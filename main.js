const {app, BrowserWindow, ipcMain, systemPreferences} = require('electron');
const path = require('path');
const url = require('url');
const monitorinfo = require('./monitorinfo.js');

var win;
require('electron-reload')(__dirname);

function create_window() {
    win = new BrowserWindow({
        width: 800,
        height: 600,
        minWidth: 513,
        minHeight: 356,
        icon: path.join(__dirname, 'static', 'res', 'icon.png')
    });

    win.loadURL(url.format({
        pathname: path.join(__dirname, 'static', 'index.html'),
        protocol: 'file:',
        slashes: true
    }));

    win.setMenu(null);

    win.webContents.openDevTools();

    win.on('closed', function() {
        win = null;
    });

    ipcMain.on('query-accent-color', function() {
        win.send('accent-color', systemPreferences.getAccentColor());
    });

    systemPreferences.on('accent-color-changed', function(e, new_color) {
        win.send('accent-color', new_color);
    });

    ipcMain.on('query-monitors', function() {
        monitorinfo.load(function(err, monitors) {
            win.send('monitors', monitors);
        });
    });

    monitorinfo.onchange(function(new_monitors) {
        win.send('monitors', new_monitors);
    });
}

app.on('ready', create_window);

app.on('window-all-closed', function() {
    app.quit();
});
