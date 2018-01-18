import React from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';
import cn from 'classnames';

class MonitorSelector extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            canvasWidth: 0,
            canvasHeight: 0
        };
        this.handleResize = this.handleResize.bind(this);
        this.switchDisplay = this.switchDisplay.bind(this);
    }

    handleResize() {
        var top_div = ReactDOM.findDOMNode(this);
        var width = window.getComputedStyle(top_div).getPropertyValue('width');
        var width_numerical = parseFloat(width);
        var height_numerical = width_numerical * 7 /16;
        this.setState({
            canvasWidth: width_numerical,
            canvasHeight: height_numerical
        });
    }

    switchDisplay(e) {
        this.props.onChange(e.target.dataset.id);
    }

    componentDidMount() {
        this.handleResize();
        window.addEventListener('resize', this.handleResize);
    }

    componentWillUnmount() {
        window.removeEventListener('resize', this.handleResize);
    }

    render() {
        const margin = 10;
        var canvasWidth = this.state.canvasWidth - 2 * margin;
        var canvasHeight = this.state.canvasHeight - 2 * margin;
        var scale = Math.min(canvasWidth / this.props.monitorInfo.width, canvasHeight / this.props.monitorInfo.height);
        var marginH = margin + (canvasWidth - scale * this.props.monitorInfo.width) / 2,
            marginV = margin + (canvasHeight - scale * this.props.monitorInfo.height) / 2;
        var monitor_selectors = this.props.monitorInfo.monitors.map(function(monitor, idx) {
            var style = {
                top: (marginV + monitor.rect.Top * scale) + 'px',
                left: (marginH + monitor.rect.Left * scale) + 'px',
                width: ((monitor.rect.Right - monitor.rect.Left) * scale) + 'px',
                height: ((monitor.rect.Bottom - monitor.rect.Top) * scale) + 'px',
                fontSize: ((monitor.rect.Bottom - monitor.rect.Top) * scale * 0.8) + 'px',
            };
            var isActive = monitor.id === this.props.selectedMonitor;
            return (
                <div className={cn("monitor-selector", {active: isActive})} style={style} key={monitor.id}>
                    <div data-id={monitor.id} className="monitor-rect" onClick={this.switchDisplay}>{(idx + 1)}</div>
                </div>
            );
        }, this);
        return (
            <div style={{height: this.state.canvasHeight + 'px'}} className="monitor-container">
                {monitor_selectors}
            </div>
        );
    }
}

MonitorSelector.defaultProps = {
    onChange: () => {}
};

MonitorSelector.propTypes = {
    onChange: PropTypes.func
};

export default MonitorSelector;
