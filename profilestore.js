var exports = module.exports = {};

const path = require('path');
const fs = require('fs');
const localdata = require('./localdata.js');
const logger = require('./logger.js');

const profile_path = path.join(localdata.data_dir ,'config.json');

var listeners = [];

exports.load = function(callback) {
    fs.readFile(profile_path, 'utf8', function(err, data) {
        if(err) {
            if(err.code !== 'ENOENT') {
                logger.warn('Failed to load profile file: %s', err.message);
            }
            data = "{}";
        }
        try {
            var profile = JSON.parse(data);
        }
        catch(e) {
            var profile = {};
        }
        if(typeof callback === 'function') callback(null, profile);
    });
};

exports.onchange = function(callback) {
    if(typeof callback === 'function') listeners.push(callback);
}

exports.save = function(profile, callback) {
    if(typeof profile !== 'object') {
        if(typeof callback === 'function') callback(new TypeError('profile should be an object', 'profilestore.js'));
        return;
    }
    fs.writeFile(profile_path, JSON.stringify(profile), 'utf8', callback);
};

fs.watch(profile_path, 'utf8', function(eventType, filename) {
    logger.debug('Profile changed');
    exports.load(function(err, profile) {
        if(err) {
            logger.error('Cannot fetch profile: %s', err.message);
            return;
        }
        logger.debug('Profile reloaded');
        for(var i = 0; i < listeners.length; i++) {
            listeners[i](profile);
        }
    });
});
