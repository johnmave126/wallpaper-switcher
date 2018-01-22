const {app, BrowserWindow, ipcMain, systemPreferences} = require('electron');
const path = require('path');
const url = require('url');
const isDev = require('electron-is-dev');
const monitorinfo = require('./monitorinfo.js');
const DataStore = require('./datastore.js');
const {simpleClone} = require('./utils.js');

var exports = module.exports = {};
var win;
exports.createWindow = function() {
    win = new BrowserWindow({
        width: 800,
        height: 600,
        minWidth: 513,
        minHeight: 374,
        icon: path.join(__dirname, 'static', 'res', 'icon.png')
    });

    win.loadURL(url.format({
        pathname: path.join(__dirname, 'static', 'index.html'),
        protocol: 'file:',
        slashes: true
    }));

    win.setMenu(null);

    if(isDev) {
        win.webContents.openDevTools();
    }

    win.on('closed', function() {
        win = null;
    });

    ipcMain.on('query-accent-color', () => {
        win.send('accent-color', systemPreferences.getAccentColor());
    });

    systemPreferences.on('accent-color-changed', (_, new_color) => {
        win.send('accent-color', new_color);
    });

    ipcMain.on('query-monitors', () => {
        monitorinfo.load((_, monitors) => {
            win.send('monitors', simpleClone(monitors));
        });
    });

    monitorinfo.on('change', (new_monitors) => {
        win.send('monitors', simpleClone(new_monitors));
    });

    ipcMain.on('query-profiles', () => {
        profilestore.load((_, profiles) => {
            win.send('profiles', simpleClone(profiles));
        });
    });

    var profilestore = new DataStore('config.json');

    ipcMain.on('save-profiles', (_, profiles) => {
        profilestore.save(profiles);
    });

    profilestore.on('change', (new_profiles) => {
        win.send('profiles', simpleClone(new_profiles));
    });
};
