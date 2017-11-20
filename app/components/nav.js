import React from 'react';

import NavItem from './nav-item';

class Nav extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        const items = [
            {name: 'Background', iconClass: 'monitor'},
            {name: 'About', iconClass: 'info'}
        ].map(function(item) {
            return (
                <NavItem activePage={this.props.activePage} accentColor={this.props.accentColor} switchPage={this.props.switchPage}
                         name={item.name} key={item.name} iconClass={item.iconClass} />
            );
        }, this);
        return (
            <div className={`nav-container ${this.props.navOpen?'active':''}`}>
                <div className="nav-sidebar">
                    {items}
                </div>
                <div className="nav-overlay" onClick={this.props.closeNav}></div>
            </div>
        );
    }
}

export default Nav;
