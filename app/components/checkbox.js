import React from 'react';

class CheckBox extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            active: false,
            defaultToOther: false,
            initX: 0,
            currX: 0,
        };
        this.handleMouseDown = this.handleMouseDown.bind(this);
        this.handleMouseUp = this.handleMouseUp.bind(this);
        this.handleMouseMove = this.handleMouseMove.bind(this);
    }

    handleMouseDown(e) {
        window.addEventListener('mouseup', this.handleMouseUp);
        window.addEventListener('mousemove', this.handleMouseMove);
        this.setState({
            active: true,
            initX: e.screenX,
            currX: e.screenX,
            defaultToOther: true
        });
    }

    handleMouseUp(e) {
        window.removeEventListener('mouseup', this.handleMouseUp);
        window.removeEventListener('mousemove', this.handleMouseMove);
        this.setState(function(prevState, props) {
            if(prevState.defaultToOther || (props.checked ? -1 : 1) * (e.screenX - prevState.initX) > 12) {
                typeof this.props.handleChange == 'function' && this.props.handleChange(!props.checked);
            }
            return {
                active: false
            };
        });
    }

    handleMouseMove(e) {
        this.setState(function(prevState, props) {
            var updater = {
                currX: e.screenX
            };
            if((props.checked ? 1 : -1) * (updater.currX - prevState.currX) > 0) {
                updater.defaultToOther = false;
            }
            return updater;
        });
    }

    render() {
        var ballStyle;

        if(this.state.active) {
            if(!this.props.checked) {
                ballStyle = {
                    left: (Math.min(25, Math.max(0, this.state.currX - this.state.initX)) + 3) + 'px'
                };
            }
            else {
                ballStyle = {
                    left: (Math.min(25, Math.max(0, this.state.currX - this.state.initX + 25)) + 3) + 'px'
                };
            }
        }
        return (
            <div className="checkbox" onMouseDown={this.handleMouseDown}>
                <div style={this.props.checked ? {backgroundColor: this.props.accentColor, borderColor: this.props.accentColor} : {}}
                     className={`box ${this.state.active?"active":""}`}
                     data-checked={this.props.checked || null}>
                    <div style={ballStyle}></div>
                </div>
                <span>{this.props.children}</span>
            </div>
        );
    }
}

export default CheckBox;
