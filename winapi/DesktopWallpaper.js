var exports = module.exports = {};

const edge = require('electron-edge-js');
const path = require('path');

exports.DesktopWallpaperPosition = {
    Center: 0,
    Tile: 1,
    Stretch: 2,
    Fit: 3,
    Fill: 4,
    Span: 5
};

exports.DesktopSlideshowOptions = {
    Sequential: 0,
    Shuffle: 1
};

exports.DesktopSlideshowDirection = {
    Forward: 0,
    Backward: 1
};

exports.DesktopSlideshowState = {
    Enabled: 0x01,
    Slideshow: 0x02,
    DisabledByRemoteSession: 0x04
};

exports.DesktopWallpaper = edge.func(path.join(__dirname, 'DesktopWallpaper.cs'))(null, true);
