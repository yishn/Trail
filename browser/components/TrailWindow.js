const {ipcRenderer, remote} = require('electron')
const {app} = remote
const {h, Component} = require('preact')

const App = require('./App')
const SideBar = require('./SideBar')

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

    render({}, {settings}) {
        return h('section', {class: 'trail-window'}, [
            h(SideBar, {data: [
                {
                    label: 'Devices',
                    locations: []
                },
                {
                    label: 'Favorites',
                    locations: settings['sidebar.favorites']
                }
            ]})
        ])
    }
}

module.exports = TrailWindow
