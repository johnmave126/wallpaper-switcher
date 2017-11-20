const fs = require('fs');
const path = require('path');

const local_path = process.env.LocalAppData;
const data_dir = path.join(local_path, 'WallpaperSwitcher');

try {
    fs.mkdirSync(data_dir);
}
catch (err) {
    if(err.code !== 'EEXIST') throw err;
}

module.exports = {
    data_dir: data_dir
}
