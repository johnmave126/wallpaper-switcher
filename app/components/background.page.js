import React from 'react';

import MonitorSelector from './monitor-selector';
import CheckBox from './checkbox';
import Select from './select';
import SelectItem from './select-item';

class Background extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            profile: {},
            monitorInfo: {
                width: 1,
                height: 1,
                monitors: []
            },
            selectedMonitor: '',
            currentProfile: {},
            shuffled: false,
            fit: 'fill'
        };

        this.handleMonitors = this.handleMonitors.bind(this);
        this.handleMonitorSwitch = this.handleMonitorSwitch.bind(this);
        this.detectMonitor = this.detectMonitor.bind(this);
        this.handleShuffleChange = this.handleShuffleChange.bind(this);
        this.handleFitChange = this.handleFitChange.bind(this);
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

    handleMonitorSwitch(new_id) {
        this.setState({
            selectedMonitor: new_id
        });
    }

    detectMonitor() {
        window.ipcRenderer.send('query-monitors');
    }

    handleShuffleChange(new_val) {
        this.setState({
            shuffled: new_val
        });
    }

    handleFitChange(new_val) {
        this.setState({
            fit: new_val
        });
    }

    componentDidMount() {
        window.ipcRenderer.on('monitors', this.handleMonitors);
        window.ipcRenderer.send('query-monitors');
    }

    componentWillUnmount() {
        window.ipcRenderer.removeListener('monitors', this.handleMonitors);
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
                <h3>Shuffle</h3>
                <CheckBox onChange={this.handleShuffleChange} checked={this.state.shuffled}>{this.state.shuffled ? "On" : "Off"}</CheckBox>
                <h3>Choose a fit</h3>
                <Select onChange={this.handleFitChange} value={this.state.fit}>
                    <SelectItem value="fill">Fill</SelectItem>
                    <SelectItem value="stretch">Stretch</SelectItem>
                    <SelectItem value="stretch2">Stretch</SelectItem>
                    <SelectItem value="stretch3">Stretch</SelectItem>
                    <SelectItem value="stretch4">Stretch</SelectItem>
                    <SelectItem value="stretch5">Stretch</SelectItem>
                    <SelectItem value="stretch6">Stretch</SelectItem>
                    <SelectItem value="stretch7">Stretch</SelectItem>
                    <SelectItem value="stretch8">Stretch</SelectItem>
                    <SelectItem value="stretch9">Stretch</SelectItem>
                    <SelectItem value="stretch10">Stretch</SelectItem>
                    <SelectItem value="stretch11">Stretch</SelectItem>
                    <SelectItem value="stretch12">Stretch</SelectItem>
                    <SelectItem value="stretch13">Stretch</SelectItem>
                    <SelectItem value="stretch14">Stretch</SelectItem>
                    <SelectItem value="stretch15">Stretch</SelectItem>
                </Select>
                <p>Select a display below to change its wallpaper and settings</p>
                <p>Select a display below to change its wallpaper and settings</p>
                <p>Select a display below to change its wallpaper and settings</p>
                <p>Select a display below to change its wallpaper and settings</p>
                <p>Select a display below to change its wallpaper and settings</p>
                <p>Select a display below to change its wallpaper and settings</p>
                <p>Select a display below to change its wallpaper and settings</p>
                <p>Select a display below to change its wallpaper and settings</p>
                <p>Select a display below to change its wallpaper and settings</p>
                <p>Select a display below to change its wallpaper and settings</p>
                <p>Select a display below to change its wallpaper and settings</p>
                <p>Select a display below to change its wallpaper and settings</p>
                <p>Select a display below to change its wallpaper and settings</p>
                <p>Select a display below to change its wallpaper and settings</p>
                <p>Select a display below to change its wallpaper and settings</p>
                <p>Select a display below to change its wallpaper and settings</p>
                <p>Select a display below to change its wallpaper and settings</p>
                <p>Select a display below to change its wallpaper and settings</p>
                <p>Select a display below to change its wallpaper and settings</p>
                <p>Select a display below to change its wallpaper and settings</p>
                <p>Select a display below to change its wallpaper and settings</p>
                <p>Select a display below to change its wallpaper and settings</p>
                <p>Select a display below to change its wallpaper and settings</p>
                <p>Select a display below to change its wallpaper and settings</p>
                <p>Select a display below to change its wallpaper and settings</p>
                <p>Select a display below to change its wallpaper and settings</p>
                <p>Select a display below to change its wallpaper and settings</p>
                <p>Select a display below to change its wallpaper and settings</p>
                <p>Select a display below to change its wallpaper and settings</p>
            </div>
        );
    }
}

export default Background;
