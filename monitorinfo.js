const EventEmitter = require("events").EventEmitter;
const Registry = require("winreg");
const EdidReader = require('edid-reader');
const util = require("util");
const idw = require('./winapi/DesktopWallpaper.js').DesktopWallpaper;
const pump = require('./winapi/MessagePump.js');
const logger = require('./logger.js');

const GetMonitorDevicePathCount = util.promisify(idw.GetMonitorDevicePathCount)
const GetMonitorDevicePathAt = util.promisify(idw.GetMonitorDevicePathAt);
const GetMonitorRECT = util.promisify(idw.GetMonitorRECT);

async function queryEDID(device_id) {
    const [display_type, device_path] = device_id.split('#').slice(1, 3);
    const reg_key = new Registry({
        hive: Registry.HKLM,
        key:  `\\SYSTEM\\CurrentControlSet\\Enum\\DISPLAY\\${display_type}\\${device_path}\\Device Parameters`
    });
    reg_key.getPromise = util.promisify(reg_key.get);
    try {
        const edid_item = await reg_key.getPromise('EDID');
        if(edid_item.type !== Registry.REG_BINARY) {
            throw "EDID not exists";
        }
        const raw_edid = Buffer.from(edid_item.value, 'hex');
        const edid = EdidReader.parse(raw_edid);
        return {
            id: `${edid.modelName}|${edid.serialNumber}`,
            name: edid.modelName
        };
    }
    catch (e) {
        return {
            id: device_id,
            name: 'Unknown'
        };
    }
}

class MonitorInfo extends EventEmitter {
    async load() {
        const monitors = [];
        const monitor_cnt = await GetMonitorDevicePathCount(null);
        for(var i = 0; i < monitor_cnt; i++) {
            const id = await GetMonitorDevicePathAt({monitorIndex: i});
            try {
                const rect = await GetMonitorRECT({monitorID: id});
                const edid_info = await queryEDID(id);
                monitors.push({
                    ...edid_info,
                    rect: rect
                });
            }
            catch (e) {
                console.log(e);
                //Do nothing
            }
        }
        return transform(monitors);
    }
}

var exports = module.exports = new MonitorInfo();

pump.subscribe(function(_, callback) {
    logger.debug('Monitor changed');
    //Need to wait for some time to ensure that DesktopWallpaper updates itself
    setTimeout(() => {
        exports.load
        .then(monitors => {
            exports.emit('change', monitors);
            //Check again after 7s in case the monitor starts slow
            setTimeout(() => {
                exports.load
                .then(new_monitors => {
                    if(!compare_monitors(monitors, new_monitors)) {
                        exports.emit('change', new_monitors);
                    }
                })
                .catch(err => {
                    logger.error('Cannot fetch monitor info: %s', err.message);
                });
            }, 7000);
        })
        .catch(err => {
            logger.error('Cannot fetch monitor info: %s', err.message);
        });
    }, 3000);
});

function compare_rect(r1, r2) {
    return r1.Top === r2.Top && r1.Right === r2.Right && r1.Bottom === r2.Bottom && r1.Left === r2.Left;
}

function compare_monitors(m1, m2) {
    if(m1.width !== m2.width || m1.height != m2.height || m1.monitors.length != m2.monitors.length) return false;
    for(var i = 0; i < m1.monitors.length; i++) {
        if(m1.monitors[i].id !== m1.monitors[i].id || !compare_rect(m1.monitors[i].rect, m1.monitors[i].rect)) return false;
    }
    return true;
}

function transform(monitors) {
    var left = 0, top = 0, bottom = 0, right = 0;
    for(var i = 0; i < monitors.length; i++) {
        var rect = monitors[i].rect;
        left = Math.min(left, rect.Left);
        top = Math.min(top, rect.Top);
        bottom = Math.max(bottom, rect.Bottom);
        right = Math.max(right, rect.Right);
    }
    for(var i = 0; i < monitors.length; i++) {
        var rect = monitors[i].rect;
        rect.Left -= left;
        rect.Right -= left;
        rect.Top -= top;
        rect.Bottom -= top;
    }
    return {
        width: right - left,
        height: bottom - top,
        monitors: monitors
    };
}
