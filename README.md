# Automated Tip Tilt Example Program

**Demonstrate some simple webcam pixel manipulation and arduino communication.**

This is a minimal Electron application based on the [Quick Start Guide](https://electronjs.org/docs/tutorial/quick-start) to demonstrate how to grab webcam data and control an arduino.

**Use this app along with the [Electron API Demos](https://electronjs.org/#get-started) app for API code examples to help you get started.**

A basic Electron application needs just these files:

- `package.json` - Points to the app's main file and lists its details and dependencies.
- `main.js` - Starts the app and creates a browser window to render HTML. This is the app's **main process**.
- `index.html` - A web page to render. This is the app's **renderer process**.

You can learn more about each of these components within the [Quick Start Guide](https://electronjs.org/docs/tutorial/quick-start).

## To Use

To clone and run this repository you'll need [Git](https://git-scm.com) and [Node.js](https://nodejs.org/en/download/) (which comes with [npm](http://npmjs.com)) installed on your computer. From your command line:

```bash
# Clone this repository
git clone https://github.com/heidgera/CCIS-2020-023-AutoTipTiltExample TipTiltExample
# Go into the repository
cd TipTiltExample
# Install dependencies
npm install
# Run the app
npm start
```

Note: If you're using Linux Bash for Windows, [see this guide](https://www.howtogeek.com/261575/how-to-run-graphical-linux-desktop-applications-from-windows-10s-bash-shell/) or use `node` from the command prompt.

## How it works:

When you call 'npm start', it starts an instance of Electron in the current folder using `main.js`. In this instance, main.js then launches a browser window which opens `local/index.html` as specified in this line of `main.js`:

```
mainWindow.loadFile(path.join(__dirname, '/local/index.html'))
```

Upon launching `local/index.html`, the browser calls all scripts reference in `local/index.html`, primarily [`local/src/app.js`](https://github.com/heidgera/CCIS-2020-023-AutoTipTiltExample/blob/master/local/src/app.js). This script then loads other javascript files using the `require` syntax. Refer to the comments in code for further details.

## Resources for Learning Electron

- [electronjs.org/docs](https://electronjs.org/docs) - all of Electron's documentation
- [electronjs.org/community#boilerplates](https://electronjs.org/community#boilerplates) - sample starter apps created by the community
- [electron/electron-quick-start](https://github.com/electron/electron-quick-start) - a very basic starter Electron app
- [electron/simple-samples](https://github.com/electron/simple-samples) - small applications with ideas for taking them further
- [electron/electron-api-demos](https://github.com/electron/electron-api-demos) - an Electron app that teaches you how to use Electron
- [hokein/electron-sample-apps](https://github.com/hokein/electron-sample-apps) - small demo apps for the various Electron APIs

## License

[CC0 1.0 (Public Domain)](LICENSE.md)
