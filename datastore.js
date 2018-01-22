const EventEmitter = require("events").EventEmitter;
const path = require('path');
const fs = require('fs');
const localdata = require('./localdata.js');
const logger = require('./logger.js');

class DataStore extends EventEmitter {
    constructor(filename) {
        super();
        var that = this;
        this.path = path.join(localdata.data_dir, filename);
        fs.watch(this.path, 'utf8', (eventType, filename) => {
            logger.debug('%s changed', filename);
            that.load(function(err, filecontent) {
                if(err) {
                    logger.error('Cannot fetch %s: %s', filename, err.message);
                    return;
                }
                logger.debug('%s reloaded', filename);
                that.emit('change', filecontent);
            });
        });
    }

    load(callback = () => {}) {
        var that = this;
        fs.readFile(this.path, 'utf8', (err, data) => {
            if(err) {
                if(err.code !== 'ENOENT') {
                    logger.warn('Failed to load %s: %s', that.path, err.message);
                }
                data = "{}";
            }
            try {
                var obj = JSON.parse(data);
            }
            catch(e) {
                var obj = {};
            }
            callback(null, obj);
        });
    }

    save(obj, callback = (err) => err && logger.error('Cannot save profile: %s', err.message)) {
        if(typeof obj !== 'object') {
            return callback(new TypeError('Content should be an object', 'datastore.js'));
        }
        fs.writeFile(this.path, JSON.stringify(obj), 'utf8', callback);
    }
}

var exports = module.exports = DataStore;
