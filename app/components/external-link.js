import React from 'react';

class ExtLink extends React.Component {
    constructor(props) {
        super(props);
        this.handleClick = this.handleClick.bind(this);
    }

    handleClick(e) {
        e.preventDefault();
        window.shell.openExternal(e.target.href);
    }

    render() {
        return <a href={this.props.href} onClick={this.handleClick}>{this.props.children}</a>;
    }
}

export default ExtLink;
