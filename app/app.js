import React from 'react';
import ReactDOM from 'react-dom';
import Color from 'color';

import Nav from './components/nav';
import Content from './components/content'

class App extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            activePage: 'Background',
            navOpen: false,
            windowWidth: window.innerWidth,
            windowHeight: window.innerHeight,
            accentColor: '#000000',
            lightAccentColor: '#000000',
            xlightAccentColor: '#000000'
        };
        this.updateDimension = this.updateDimension.bind(this);
        this.switchPage = this.switchPage.bind(this);
        this.closeNav = this.closeNav.bind(this);
        this.openNav = this.openNav.bind(this);
    }

    updateDimension() {
        this.setState(function(prevStates, props) {
            var updater = {
                windowWidth: window.innerWidth,
                windowHeight: window.innerHeight
            };
            if(prevStates.windowWidth <= 716 && updater.windowWidth > 716) {
                updater.navOpen = false;
            }
            return updater;
        });
    }

    componentDidMount() {
        var that = this;
        window.addEventListener('resize', this.updateDimension);
        window.ipcRenderer.send('query-accent-color');
        window.ipcRenderer.on('accent-color', function(_, new_color) {
            var color = Color('#' + new_color.substr(0, 6));
            that.setState({
                accentColor: color.string(),
                lightAccentColor: color.lighten(0.3).string(),
                xlightAccentColor: color.lighten(0.5).string()
            });
        });
    }

    componentWillUnmount() {
        window.removeEventListener('resize', this.updateDimension);
    }

    switchPage(new_page) {
        this.setState({activePage: new_page});
        this.closeNav();
    }

    closeNav() {
        this.setState({navOpen: false});
    }

    openNav() {
        this.setState({navOpen: true});
    }

    static adjustColorLum(hex, lum) {
        // validate hex string
        hex = String(hex).replace(/[^0-9a-f]/gi, '');
        if (hex.length < 6) {
            hex = hex[0] + hex[0] + hex[1] + hex[1] + hex[2] + hex[2];
        }
        lum = lum || 0;

        // convert to decimal and change luminosity
        var rgb = "#", c, i;
        for (i = 0; i < 3; i++) {
            c = parseInt(hex.substr(i * 2, 2), 16);
            c = Math.round(Math.min(Math.max(0, c + (c * lum)), 255)).toString(16);
            rgb += ("00" + c).substr(c.length);
        }

        return rgb;
    }

    render () {
        return (
            <div style={{
                '--accent-color': this.state.accentColor,
                '--light-accent-color': this.state.lightAccentColor,
                '--xlight-accent-color': this.state.xlightAccentColor
            }}>
                <Nav activePage={this.state.activePage} navOpen={this.state.navOpen} 
                     switchPage={this.switchPage} closeNav={this.closeNav} />
                <Content activePage={this.state.activePage}
                         openNav={this.openNav} />
            </div>
        );
    }
}

ReactDOM.render(
    <App />,
    document.getElementById('container')
)

