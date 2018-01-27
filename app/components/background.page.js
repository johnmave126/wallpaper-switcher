import React from 'react';
import cn from 'classnames';
import fileUrl from 'file-url';
import update from 'immutability-helper';
const { ipcRenderer, remote } = window.electron;

import MonitorSelector from './monitor-selector';
import CheckBox from './checkbox';
import Select from './select';
import SelectItem from './select-item';

class Background extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            monitorInfo: {
                width: 1,
                height: 1,
                monitors: []
            },
            selectedMonitor: '',
            profiles: {}
        };

        this.defaultProfile = {
            background: 'picture',
            shuffle: false,
            fit: 'fill',
            picture_path: '',
            slideshow_path: '',
            interval: 30
        }

        this.handleMonitors = this.handleMonitors.bind(this);
        this.handleProfiles = this.handleProfiles.bind(this);
        this.handleMonitorSwitch = this.handleMonitorSwitch.bind(this);
        this.detectMonitor = this.detectMonitor.bind(this);
        this.selectPicture = this.selectPicture.bind(this);
        this.selectSlideshow = this.selectSlideshow.bind(this);
        this.handleConfigChange = this.handleConfigChange.bind(this);
        this.handleBackgroundChange = this.handleConfigChange.bind(this, 'background');
        this.handleShuffleChange = this.handleConfigChange.bind(this, 'shuffle');
        this.handlePictureChange = this.handleConfigChange.bind(this, 'picture_path');
        this.handleSlideshowChange = this.handleConfigChange.bind(this, 'slideshow_path');
        this.handleIntervalChange = this.handleConfigChange.bind(this, 'interval');
        this.handleFitChange = this.handleConfigChange.bind(this, 'fit');
    }

    handleMonitors(_, info) {
        this.setState(function(prevState) {
            var updater = {
                monitorInfo: info
            };
            if(info.monitors.map((x) => x.id).indexOf(prevState.selectedMonitor) === -1) {
                updater.selectedMonitor = '';
                if(info.monitors.length > 0) {
                    updater.selectedMonitor = info.monitors[0].id;
                }
            }
            return updater;
        });
    }

    handleProfiles(_, profiles) {
        this.setState({
            profiles: profiles
        });
    }

    handleMonitorSwitch(new_id) {
        this.setState({
            selectedMonitor: new_id
        });
    }

    detectMonitor() {
        ipcRenderer.send('query-monitors');
    }

    selectPicture() {
        let that = this;
        remote.dialog.showOpenDialog(remote.getCurrentWindow(), {
            properties: [
                'openFile'
            ],
            filters: [
                {name: 'All Files', extensions: ['jpg', 'jpeg', 'bmp', 'png', 'gif']}
            ]
        }, (path) => {
            if(path && path[0] !== that.getConfig('picture_path')) {
                that.handlePictureChange(path[0]);
            }
        });
    }

    selectSlideshow() {
        let that = this;
        remote.dialog.showOpenDialog(remote.getCurrentWindow(), {
            properties: [
                'openDirectory'
            ]
        }, (path) => {
            if(path && path[0] !== that.getConfig('slideshow_path')) {
                that.handleSlideshowChange(path[0]);
            }
        });
    }

    handleConfigChange(key, new_val) {
        var profiles = this.state.profiles || {};
        var selected_monitor = this.state.selectedMonitor;
        ipcRenderer.send('save-profiles', 
            profiles[selected_monitor] && typeof profiles[selected_monitor] === 'object' ?
            update(profiles, {
                [selected_monitor]: {
                    [key]: {$set: new_val}
                }
            }) :
            update(profiles, {
                [selected_monitor]: {$set: {[key]: new_val}}
            })
        );
    }

    getConfig(name) {
        var config = this.state.profiles[this.state.selectedMonitor] || this.defaultProfile;
        return config[name] || this.defaultProfile[name];
    }

    componentDidMount() {
        ipcRenderer.on('monitors', this.handleMonitors);
        ipcRenderer.send('query-monitors');

        ipcRenderer.on('profiles', this.handleProfiles);
        ipcRenderer.send('query-profiles');
    }

    componentWillUnmount() {
        ipcRenderer.removeListener('monitors', this.handleMonitors);
        ipcRenderer.removeListener('profiles', this.handleProfiles);
    }

    renderBackgroundBrowse() {
        switch(this.getConfig('background')) {
            case 'picture':
                var picture_path = this.getConfig('picture_path');
                var result = [
                    <h3 key="choose">Choose your picture</h3>,
                    <div className={cn("current-background", {filled: picture_path})}
                         style={{
                            backgroundImage: picture_path && `url('${fileUrl(picture_path)}')`
                         }} />,
                    <div className="button-gray" onClick={this.selectPicture}>Browse</div>
                ];
                break;
            case 'slideshow':
                var result = [
                    <h3>Choose albums for your slideshow</h3>,
                    <p>{this.getConfig('slideshow_path')}</p>,
                    <div className="button-gray" onClick={this.selectSlideshow}>Browse</div>,
                    <h3>Change picture every</h3>,
                    <Select onChange={this.handleIntervalChange} value={Number(this.getConfig('interval'))}>
                        <SelectItem value={1}>1 minute</SelectItem>
                        <SelectItem value={10}>10 minutes</SelectItem>
                        <SelectItem value={30}>30 minutes</SelectItem>
                        <SelectItem value={60}>1 hour</SelectItem>
                        <SelectItem value={6 * 60}>6 hours</SelectItem>
                        <SelectItem value={24 * 60}>1 day</SelectItem>
                    </Select>,
                    <h3>Shuffle</h3>,
                    <CheckBox onChange={this.handleShuffleChange} checked={this.getConfig('shuffle')}>
                        {this.getConfig('shuffle') ? "On" : "Off"}
                    </CheckBox>
                ];
                break;
        }
        return result.map((elem, idx) => React.cloneElement(elem, {key: idx}));
    }

    render() {
        return (
            <div className="body">
                <h2>Select displays</h2>
                <p>Select a display below to change its wallpaper and settings</p>
                <MonitorSelector onChange={this.handleMonitorSwitch} monitorInfo={this.state.monitorInfo} selectedMonitor={this.state.selectedMonitor} />
                <div className="monitor-tools">
                    <div className="button-gray" onClick={this.detectMonitor}>Detect</div>
                </div>
                <h3>Background</h3>
                <Select onChange={this.handleBackgroundChange} value={this.getConfig('background')}>
                    <SelectItem value="picture">Picture</SelectItem>
                    <SelectItem value="slideshow">Slideshow</SelectItem>
                </Select>
                {this.renderBackgroundBrowse()}
                <h3>Choose a fit</h3>
                <Select onChange={this.handleFitChange} value={this.getConfig('fit')}>
                    <SelectItem value="fill">Fill</SelectItem>
                    <SelectItem value="fit">Fit</SelectItem>
                    <SelectItem value="stretch">Stretch</SelectItem>
                    <SelectItem value="tile">Tile</SelectItem>
                    <SelectItem value="center">Center</SelectItem>
                </Select>
            </div>
        );
    }
}

export default Background;
