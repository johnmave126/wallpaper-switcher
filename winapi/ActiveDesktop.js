var exports = module.exports = {};

const edge = require('electron-edge-js');
const path = require('path');

var Apply = exports.Apply = {};
Apply.Save = 0x01;
Apply.HTMLGen = 0x02;
Apply.Refresh = 0x04;
Apply.All = Apply.Save | Apply.HTMLGen | Apply.Refresh;
Apply.Force = 0x08;
Apply.BufferedRefresh = 0x10;
Apply.DynamicRefresh = 0x20;

exports.GetWallpaperOpt = {
    BMP: 0x0,
    Image: 0x1,
    LastApplied: 0x2
};

exports.WallpaperStyle = {
    Center: 0,
    Tile: 1,
    Stretch: 2,
    KeepAspect: 3,
    CropToFit: 4,
    Span: 5
};

exports.create = edge.func(path.join(__dirname, 'ActiveDesktop.cs'));
