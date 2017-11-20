const winston = require('winston');
const path = require('path');
const localdata = require('./localdata.js');

winston.configure({
    transports: [
        new winston.transports.File({
            filename: path.join(localdata.data_dir, 'app.log')
        })
    ]
});

module.exports = winston;
