import React from 'react';

import ExtLink from './external-link';

class About extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div className="body">
                <h2>Wallpaper Switcher</h2>
                <p>A small utility to manage wallpaper across multi-monitor on Windows written by <ExtLink accentColor={this.props.accentColor} href="mailto:johnmave126@gmail.com" title="johnmave126@gmail.com">Shuhao Tan</ExtLink>. Licensed under <ExtLink accentColor={this.props.accentColor} href="http://">MIT</ExtLink>.</p>
                <p><ExtLink accentColor={this.props.accentColor} href="https://github.com/johnmave126/wallpaper-switcher">Want to contribute?</ExtLink></p>
                <h2>Credits</h2>
                <p>App icon made by <ExtLink accentColor={this.props.accentColor} href="https://www.flaticon.com/authors/dinosoftlabs" title="DinosoftLabs">DinosoftLabs</ExtLink> from <ExtLink accentColor={this.props.accentColor} href="https://www.flaticon.com/" title="Flaticon">www.flaticon.com</ExtLink> is licensed by <ExtLink accentColor={this.props.accentColor} href="http://creativecommons.org/licenses/by/3.0/" title="Creative Commons BY 3.0">CC 3.0 BY</ExtLink></p>
                <p>Project is built upon Node.js {window.process.versions.node}, Chromium {window.process.versions.chrome}, and Electron {window.process.versions.electron}</p>
            </div>
        );
    }
}

export default About;
