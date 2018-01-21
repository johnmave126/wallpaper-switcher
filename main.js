const {app} = require('electron');
const path = require('path');
const isDev = require('electron-is-dev');

const {createWindow} = require('./config_tool.js');

var win;

if(isDev) {
    require('electron-reload')(__dirname, {electron: path.join(__dirname, 'node_modules', '.bin', 'electron')});
}

require('yargs')
    .usage('$0 [cmd]')
    .command('$0', 'run the config program', () => {}, run_config)
    .command('service', 'run the background service of the switcher', () => {}, run_service)
    .command('install', 'install the background service to the system', () => {}, run_installer)
    .command('uninstall', 'remove the background service from the system', () => {}, run_uninstaller)
    .help()
    .strict()
    .argv;


function run_config() {
    app.on('ready', createWindow);

    app.on('window-all-closed', function() {
        app.quit();
    });
}

function run_service() {
    app.on('ready', () => {
        console.log('running service');
        app.quit();
    })
}

function run_installer() {
    app.on('ready', () => {
        console.log('running installer');
        app.quit();
    })
}

function run_uninstaller() {
    app.on('ready', () => {
        console.log('running uninstaller');
        app.quit();
    })
}
