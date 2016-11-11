const {ipcRenderer, remote} = require('electron')
const {app} = remote
const {h, Component} = require('preact')
const App = require('./App')

class TrailWindow extends App {
    constructor() {
        super()

        this.prepareMenu()
    }

    prepareMenu() {
        ipcRenderer.on('menu-click', (evt, action) => {
            let data = {
                'new-window': () => {
                    ipcRenderer.send('new-window')
                },
                'restart': () => {
                    app.relaunch()
                    app.quit()
                }
            }

            data[action]()
        })
    }

    render() {
        return h('pre', {}, JSON.stringify(this.state.settings['session.windows'], '  '))
    }
}

module.exports = TrailWindow
