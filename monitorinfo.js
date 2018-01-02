var exports = module.exports = {};

const dw = require('./winapi/DesktopWallpaper.js');
const pump = require('./winapi/MessagePump.js');
const logger = require('./logger.js');

var listeners = [];

exports.load = function(callback) {
    var idw = dw.DesktopWallpaper;
    var monitors = [];
    var err;
    try {
        var monitor_cnt = idw.GetMonitorDevicePathCount(null, true);
        for(var i = 0; i < monitor_cnt; i++) {
            var id = idw.GetMonitorDevicePathAt({monitorIndex: i}, true);
            try {
                var rect = idw.GetMonitorRECT({monitorID: id}, true);
                monitors.push({
                    id: id,
                    rect: rect
                });
            }
            catch (e) {
                //Do nothing
            }
        }
    }
    catch (e) {
        err = e;
    }

    if(typeof callback === 'function') callback(err, transform(monitors));
};

exports.onchange = function(callback) {
    if(typeof callback === 'function') listeners.push(callback);
};

pump.subscribe(function(_, callback) {
    logger.debug('Monitor changed');
    //Need to wait for some time to ensure that DesktopWallpaper updates itself
    setTimeout(function(){
        exports.load(function(err, monitors) {
            if(err) {
                logger.error('Cannot fetch monitor info: %s', err.message);
                return;
            }
            publish(monitors);
            //Check again after 7s in case the monitor starts slow
            setTimeout(function() {
                exports.load(function(err, new_monitors) {
                    if(err) {
                        logger.error('Cannot fetch monitor info: %s', err.message);
                        return;
                    }
                    if(!compare_monitors(monitors, new_monitors)) {
                        publish(new_monitors);
                    }
                });
            }, 7000);
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

function publish(monitors) {
    for(var i = 0; i < listeners.length; i++) {
        listeners[i](JSON.parse(JSON.stringify(monitors)));
    }
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
