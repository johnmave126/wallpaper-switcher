import React from 'react';

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
            canvasWidth: 0,
            canvasHeight: 0,
            shuffled: false,
        };

        this.handleResize = this.handleResize.bind(this);
        this.handleMonitors = this.handleMonitors.bind(this);
        this.switchDisplay = this.switchDisplay.bind(this);
        this.detectMonitor = this.detectMonitor.bind(this);
        this.handleShuffleChange = this.handleShuffleChange.bind(this);
    }

    handleResize() {
        var width = window.getComputedStyle(this.monitorContainer).getPropertyValue('width');
        var width_numerical = parseFloat(width);
        var height_numerical = width_numerical * 7 /16;
        this.setState({
            canvasWidth: width_numerical,
            canvasHeight: height_numerical
        });
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

    switchDisplay(e) {
        this.setState({
            selectedMonitor: e.target.dataset.id
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

    componentDidMount() {
        var that = this;
        this.handleResize();
        window.addEventListener('resize', this.handleResize);
        window.ipcRenderer.send('query-monitors');
        window.ipcRenderer.on('monitors', this.handleMonitors);
    }

    componentWillUnmount() {
        window.removeEventListener('resize', this.handleResize);
        window.ipcRenderer.removeListener('monitors', this.handleMonitors);
    }

    render() {
        var margin = 10;
        var canvasWidth = this.state.canvasWidth - 2 * margin;
        var canvasHeight = this.state.canvasHeight - 2 * margin;
        var scale = Math.min(canvasWidth / this.state.monitorInfo.width, canvasHeight / this.state.monitorInfo.height);
        var marginH = margin + (canvasWidth - scale * this.state.monitorInfo.width) / 2,
            marginV = margin + (canvasHeight - scale * this.state.monitorInfo.height) / 2;
        var monitor_selectors = this.state.monitorInfo.monitors.map(function(monitor, idx) {
            var style = {
                top: (marginV + monitor.rect.Top * scale) + 'px',
                left: (marginH + monitor.rect.Left * scale) + 'px',
                width: ((monitor.rect.Right - monitor.rect.Left) * scale) + 'px',
                height: ((monitor.rect.Bottom - monitor.rect.Top) * scale) + 'px',
                fontSize: ((monitor.rect.Bottom - monitor.rect.Top) * scale * 0.8) + 'px',
            };
            var isActive = monitor.id === this.state.selectedMonitor;
            return (
                <div className={`monitor-selector ${isActive?"active":""}`} style={style} key={monitor.id}>
                    <div data-id={monitor.id} className="monitor-rect" onClick={this.switchDisplay}>{(idx + 1)}</div>
                </div>
            );
        }, this);

        return (
            <div className="body">
                <h2>Select displays</h2>
                <p>Select a display below to change its wallpaper and settings</p>
                <div style={{height: this.state.canvasHeight + 'px'}} className="monitor-container" ref={(div) => { this.monitorContainer = div; }}>
                {monitor_selectors}
                </div>
                <div className="monitor-tools">
                    <div className="button-gray" onClick={this.detectMonitor}>Detect</div>
                </div>
                <h3>Shuffle</h3>
                <CheckBox handleChange={this.handleShuffleChange} checked={this.state.shuffled}>Off</CheckBox>
                <Select>
                    <SelectItem value="fill">Fill</SelectItem>
                    <SelectItem value="stretch">Stretch</SelectItem>
                </Select>
            </div>
        );
    }
}

export default Background;
