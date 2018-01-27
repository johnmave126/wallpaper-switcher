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
                <p>A small utility to manage wallpapers across multiple monitors on Windows written by <ExtLink href="mailto:johnmave126@gmail.com" title="johnmave126@gmail.com">Shuhao Tan</ExtLink>. Licensed under <ExtLink href="https://github.com/johnmave126/wallpaper-switcher/blob/master/LICENSE">MIT</ExtLink>.</p>
                <p><ExtLink href="https://github.com/johnmave126/wallpaper-switcher">Want to contribute?</ExtLink></p>
                <h2>Credits</h2>
                <p>App icon made by <ExtLink href="https://www.flaticon.com/authors/dinosoftlabs" title="DinosoftLabs">DinosoftLabs</ExtLink> from <ExtLink href="https://www.flaticon.com/" title="Flaticon">www.flaticon.com</ExtLink> is licensed by <ExtLink href="http://creativecommons.org/licenses/by/3.0/" title="Creative Commons BY 3.0">CC 3.0 BY</ExtLink></p>
                <p>Project is built upon Node.js {window.process.versions.node}, Chromium {window.process.versions.chrome}, and Electron {window.process.versions.electron}</p>
            </div>
        );
    }
}

export default About;
