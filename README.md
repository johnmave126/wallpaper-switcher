# Wallpaper Switcher
Wallpaper management for multi-monitor setup on Windows, built on [Electron](https://github.com/atom/electron).

## Installing
Clone the repository and perform:

```bash
$ npm install
```

### Prerequisites
- `git`
- `python` (`v2.7` recommended for `node-gyp`)
- VC++ Build Environment

Delivering a pre-built out-of-box version is on the roadmap.

## Usage

To enable the backend service run on startup:
```bash
$ npm run addautorun
```

To remove the backend service run on startup:
```bash
$ npm run removeautorun
```

To bring up config program and change wallpaper settings:
```bash
$ npm start
```
The config program recreates the native Windows 10 settings app experience. Zero learning curve for windows users.

Delivering a installer that handles autorun automatically is on the roadmap.
## Screenshot
![screenshot1](https://user-images.githubusercontent.com/1661662/35475424-355a0972-036c-11e8-9e23-bd0866380c90.png)

## Roadmap

- [ ] Better installing process
  - [ ] Add [Squirrel](https://github.com/Squirrel/Squirrel.Windows) support
  - [ ] Deliver built version via Release
- [ ] Better error handling and displaying both in backend and frontend
- [ ] Add solid color option to background selection
  - [ ] Add color palette
  - [ ] Add custom color picker
- [ ] Better widget for slideshow path display
  - [ ] Native style
  - [ ] Support multiple path (list style)
- [ ] Allow configuration for default background for unknown monitor
  - [ ] Basic configuration
  - [ ] Different default configuration for different aspect ratios
- [ ] Mannually change to next wallpaper (Like `Next Background` in the context menu of the desktop)
- [ ] Real size mode: span a picture seamlessly across different monitors with different DPIs.
  - [ ] Select a picture/slideshow and fit
  - [ ] Position configuration for picture
- [ ] Wallpaper preview on config UI
- [ ] Add comments to the source code.

## License
[MIT](https://github.com/johnmave126/wallpaper-switcher/blob/master/LICENSE)
