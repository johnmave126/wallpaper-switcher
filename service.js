const path = require('path');
const elevator = require('elevator');
const isAdmin = require('is-admin');
const isDev = require('electron-is-dev');
const service = require('os-service');
const devnull = require('dev-null');
const fs = require('fs');
const Jimp = require('jimp');
const tmp = require('tmp');
const promisify = require('util.promisify');

const {simpleClone, shuffle} = require('./utils.js');
const ad = require('./winapi/ActiveDesktop.js');
const winapi = require('./winapi/API.js');
const DataStore = require('./datastore.js');
const logger = require('./logger.js');
const monitorinfo = require('./monitorinfo.js');

var exports = module.exports = {};

exports.startService = function(argv) {
    var status, profiles, monitors;
    var profiles_store = new DataStore('config.json');
    var status_store = new DataStore('status.json');
    var timer = null;

    var iad = ad.create(null, true);

    const defaultProfile = {
            background: 'picture',
            shuffle: false,
            fit: 'fill',
            picture_path: '',
            slideshow_path: '',
            interval: 30
    };
    const regex_image = /.+\.(jpg|jpeg|gif|png|bmp)$/;
/*
    service.run(devnull(), () => {
        status_store.save(status, (err) => {
            var rcode = err ? -1 : 0;
            service.stop(rcode);
            process.exit(rcode);
        });
    });
*/
    Promise.all([
        promisify(profiles_store.load.bind(profiles_store))(),
        promisify(status_store.load.bind(status_store))(),
        promisify(monitorinfo.load.bind(monitorinfo))()
    ]).then((loaded_val) => {
        profiles = simpleClone(loaded_val[0]);
        status = simpleClone(loaded_val[1]);
        monitors = simpleClone(loaded_val[2]);

        status.tick = status.tick || Date.now();
        status.current = status.current || {};
        status.future = status.future || {};

        boot();
    }, (err) => {
        //service.stop(-1);
        process.exit(-1);
    });

    function boot() {
        updateState()
        .then(commitBackground)
        .then(() => {
            process.exit(0);
        })
        .catch((err) => {
            console.log(err);console.trace(err);
        });
    }

    function updateState() {
        return Promise.all(monitors.monitors.map((monitor) => {
            var id = monitor.id;
            let profile_updated = false;
            if(!profiles[id]) {
                profiles[id] = simpleClone(defaultProfile);
                profile_updated = true;
            }
            var profile = profiles[id];
            Object.keys(defaultProfile).forEach((k) => {
                if(!profile.hasOwnProperty(k)) {
                    profile[k] = defaultProfile[k];
                    profile_updated = true;
                }
            });
            var interval_ms = 1000 * 60 * profiles[id].interval;
            if(profile.background === 'slideshow') {
                if(!status.future[id]) {
                    return createFuture(id).then(() => profile_updated);
                }
                else {
                    var nextTick = status.future[id].nextTick || status.tick + interval_ms;
                    if(nextTick < status.tick + 60 * 1000) {
                        //Advance tick
                        status.future[id].nextTick += Math.ceil((status.tick + 60 * 1000 - nextTick) / (interval_ms)) * interval_ms;
                        //Try shift
                        var shift_success = (fn) => {
                            status.current[id] = {active: fn};
                            return profile_updated;
                        };
                        var shift_fail = () => {
                            if(status.future[id].queue.length === 0) {
                                return createFuture(id).then(() => profile_updated);
                            }
                            return checkFile(profiles[id].slideshow_path, status.future.queue.shift())
                                   .then(shift_success, shift_fail);
                        }
                        return checkFile(profiles[id].slideshow_path, status.future.queue.shift())
                               .then(shift_success, shift_fail);
                    }
                }
            }
            return profile_updated;
        })).then((val) => val.reduce((updated, v) => updated || v, false));
    }

    function commitBackground() {
        return Promise.all(monitors.monitors.map((monitor) => {
            var id = monitor.id;
            var rect = monitor.rect;
            var profile = profiles[id];
            if(profile.background === 'picture' || profile.background === 'slideshow') {
                var img_path = profile.background === 'picture'
                             ? profile.picture_path
                             : path.join(profile.slideshow_path, status[id].current.active);
                return Jimp.read(img_path).then((img) => {
                    var width = rect.Right - rect.Left, height = rect.Bottom - rect.Top;
                    var canvas = new Jimp(width, height);
                    switch(profile.fit) {
                        case 'fill':
                            return img.cover(width, height);
                        case 'fit':
                            return img.contain(width, height);
                        case 'stretch':
                            return img.resize(width, height);
                        case 'tile':
                            for(let x = 0; x < width; x += img.bitmap.width) {
                                for(let y = 0; y < height; y += img.bitmap.height) {
                                    canvas = canvas.blit(img, x, y);
                                }
                            }
                            return canvas;
                        case 'center':
                            var sw = Math.min(width, img.bitmap.width),
                                sh = Math.min(height, img.bitmap.height);
                            var sx = (img.bitmap.width - sw) / 2,
                                sy = (img.bitmap.height - sh) / 2,
                                tx = (width - sw) / 2,
                                ty = (height - sh) / 2;
                            return canvas.blit(img, tx, ty, sx, sy, sw, sh);
                    }
                }).catch((err) => {
                    //Fallback to pure black background
                    return new Jimp(rect.Right - rect.Left, rect.Bottom - rect.Top);
                });
            }
            else {
                return new Jimp(rect.Right - rect.Left, rect.Bottom - rect.Top);
            }
        })).then((images) => 
            monitors.monitors
            .reduce((canvas, monitor, idx) => canvas.blit(images[idx], monitor.rect.Left, monitor.rect.Top),
                                                          new Jimp(monitors.width, monitors.height));
        ).then((background) => promisify(tmp.file)({mode: 0666, postfix: '.png', discardDescriptor: true})
        ).then((filepath) => promisify(background.write.bind(background)(filepath).then(()=>filepath)
        ).then((filepath) => 
            promisify(winapi.FindWindow)({lpClassName: 'Progman', lpWindowName: null})
            .then((hwnd) => promisify(winapi.SendMessageTimeout)({
                hwnd: hwnd,
                Msg: 0x52c,
                wParam: 0,
                lParam: 0,
                fuFlags: 0,
                uTimeout: 500
            }))
            .then(() => promisify(iad.SetWallpaper)({pwszWallpaper: filepath}))
        ).then(() => promisify(iad.SetWallpaperOptions)({pwpo: {dwStyle: ad.WallpaperStyle.Span}})
        ).then(() => promisify(iad.ApplyChanges)({dwFlags: ad.Apply.All}));
    }

    function setTimer() {

    }

    function onUpdate() {

    }

    function listCandidates(id) {
        return promisify(fs.readdir)(profiles[id].slideshow_path)
                .then((files) => files.filter(fn => regex_image.test(fn)))
                .catch(() => []);
    }

    function createFuture(id) {
        return listCandidates(id).then((files) => {
            if(profile.shuffle) {
                files = shuffle(files);
            }
            status.current[id] = {active: files.shift()};
            status.future[id] = {
                nextTick: status.tick + interval_ms,
                queue: files
            };
        });
    }

    function checkFile(dir, fn) {
        return promisify(fs.access)(path.join(dir, fn), fs.constants.R_OK);
    }
};

exports.installService = function() {
    isAdmin().then(() => {
        service.add('wallpaper-switcher-daemon', {
            programPath: isDev ? process.cwd() : '',
            programArgs: ['service'],
            displayName: "Wallpaper Switcher Daemon"
        }, (err) => {
            console.error("Installation failed!");
            console.trace(err);
            process.exit(-1);
        });
    }).catch(() => {
        elevator.execute(process.argv, (err, stdout, stderr) => {
            if(err) {
                console.error(err.message);
            }
        });
    });
};

exports.removeService = function() {
    isAdmin().then(() => {
        service.remove('wallpaper-switcher-daemon', (err) => {
            console.error("Removal failed!");
            console.trace(err);
            process.exit(-1);
        });
    }).catch(() => {
        elevator.execute(process.argv, (err, stdout, stderr) => {
            if(err) {
                console.error(err.message);
            }
        });
    });
};
