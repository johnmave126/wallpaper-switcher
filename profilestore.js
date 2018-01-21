const EventEmitter = require("events").EventEmitter;
const path = require('path');
const fs = require('fs');
const localdata = require('./localdata.js');
const logger = require('./logger.js');

const profile_path = path.join(localdata.data_dir ,'config.json');

class ProfileStore extends EventEmitter {
    load(callback = () => {}) {
        fs.readFile(profile_path, 'utf8', function(err, data) {
            if(err) {
                if(err.code !== 'ENOENT') {
                    logger.warn('Failed to load profile file: %s', err.message);
                }
                data = "{}";
            }
            try {
                var profiles = JSON.parse(data);
            }
            catch(e) {
                var profiles = {};
            }
            callback(null, profiles);
        });
    }

    save(profiles, callback = (err) => err && logger.error('Cannot save profile: %s', err.message)) {
        if(typeof profiles !== 'object') {
            return callback(new TypeError('profile should be an object', 'profilestore.js'));
        }
        fs.writeFile(profile_path, JSON.stringify(profiles), 'utf8', callback);
    }
}

var exports = module.exports = new ProfileStore();

fs.watch(profile_path, 'utf8', function(eventType, filename) {
    logger.debug('Profile changed');
    exports.load(function(err, profiles) {
        if(err) {
            logger.error('Cannot fetch profile: %s', err.message);
            return;
        }
        logger.debug('Profile reloaded');
        exports.emit('change', profiles);
    });
});
