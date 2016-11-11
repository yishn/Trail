const {ipcRenderer, remote: {app}} = require('electron')
const {h, Component} = require('preact')

function prepareMenu() {
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

class App extends Component {
    constructor() {
        super()
        prepareMenu()
    }

    render() {
        return h('h1', {}, 'Hello World!')
    }
}

module.exports = App
