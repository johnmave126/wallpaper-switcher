const {app} = require('electron');
const path = require('path');
const isDev = require('electron-is-dev');

const {createWindow} = require('./config_tool.js');
const service = require('./service.js');

if(isDev) {
    require('electron-reload')(__dirname, {electron: path.join(__dirname, 'node_modules', '.bin', 'electron')});
}

process.on('uncaughtException', (error) => {
    console.error(error.message);
    console.trace(error);
    process.exit(-1);
});

require('yargs')
    .usage('$0 [cmd]')
    .command('$0', 'run the config program', () => {}, fix0(run_config))
    .command('service', 'run the background service of the switcher', () => {}, fix0(run_service))
    .command('install', 'install the background service to the system', () => {}, fix0(run_installer))
    .command('uninstall', 'remove the background service from the system', () => {}, fix0(run_uninstaller))
    .help()
    .strict()
    .parse(isDev ? process.argv.slice(2) : process.argv.slice(1));


function fix0(func) {
    return function(argv) {
        argv.$0 = isDev ? argv.$0 : argv.$0.split(' ')[0];
        return func(argv);
    };
}

function run_config(argv) {
    app.on('ready', createWindow.bind(null, argv));

    app.on('window-all-closed', function() {
        app.quit();
    });
}

function run_service(argv) {
    app.on('ready', service.startService.bind(null, argv));
}

function run_installer(argv) {
    app.on('ready', service.installService.bind(null, argv));
}

function run_uninstaller(argv) {
    app.on('ready', service.removeService.bind(null, argv));
}
