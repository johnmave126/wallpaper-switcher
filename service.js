const ad = require('./winapi/ActiveDesktop.js');
const winapi = require('./winapi/API.js');
const profilestore = require('./profilestore.js');
const logger = require('./logger.js');
const monitorinfo = require('./monitorinfo.js');

monitorinfo.load(function(err, info) {
    console.log(info);
});

monitorinfo.onchange(function(new_info) {
    console.log("changed");
    console.log(new_info);
});


//pump.subscribe(function(_, callback) {
//   console.log('display change');
//    callback();
//}, true);
/*
i.on('line', function() {
    winapi.SendMessageTimeout({
        hwnd: winapi.FindWindow({lpClassName: 'Progman', lpWindowName: null}, true),
        Msg: 0x52c,
        wParam: 0,
        lParam: 0,
        fuFlags: 0,
        uTimeout: 500
    }, true);
    iad.SetWallpaper({
        pwszWallpaper: 'D:\\Documents\\Google Drive\\Desktop_Roll\\5810_1_other_anime_hd_wallpapers_anime_girls.jpg'
    }, true);
    iad.ApplyChanges({
        dwFlags: ad.Apply.All
    }, true);
});*/