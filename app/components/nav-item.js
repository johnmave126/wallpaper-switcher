import React from 'react';

class NavItem extends React.Component {
    constructor(props) {
        super(props);
        this.handleClick = this.handleClick.bind(this);
    }

    handleClick() {
        this.props.switchPage(this.props.name);
    }

    render() {
        var isActive = this.props.name === this.props.activePage;
        return (
            <div className={`nav-item ${isActive?"nav-active":""} button button-white`}
                 onClick={this.handleClick}>
                <div className="nav-title">
                    <div className="nave-active-indicator"></div>
                    <span className={`icon nav-icon icon-${this.props.iconClass}`}></span>
                    <div className="nav-name">{this.props.name}</div>
                </div>
            </div>
        );
    }
}

export default NavItem;
