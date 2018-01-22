const ad = require('./winapi/ActiveDesktop.js');
const winapi = require('./winapi/API.js');
const DataStore = require('./datastore.js');
const logger = require('./logger.js');
const monitorinfo = require('./monitorinfo.js');

var exports = module.exports = {};

exports.startService = function(argv) {
    console.log('running service');
    console.log(argv);
    setTimeout(() => {
        console.log(process.execPath);
        process.exit(0);
    }, 2000);
};

exports.installService = function() {
    console.log('install service');
};

exports.removeService = function() {
    console.log('remove service');
};
