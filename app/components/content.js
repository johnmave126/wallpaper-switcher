import React from 'react';

import Background from './background.page';
import About from './about.page';

const Pages = {
    'Background': Background,
    'About': About
};

class Content extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        var content = React.createElement(Pages[this.props.activePage], {
            accentColor: this.props.accentColor
        });
        return (
            <div className="content">
                <div className="header">
                    <span className="icon icon-menu button-white header-nav-toggle" onClick={this.props.openNav}></span>
                    <h1>{this.props.activePage}</h1>
                </div>
                {content}
            </div>
        );
    }
}

export default Content;
