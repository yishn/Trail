const {ipcRenderer, remote} = require('electron')
const {app} = remote
const {h, Component} = require('preact')
const drives = require('../../modules/drives')

const Window = require('./Window')
const SideBar = require('./SideBar')

class TrailWindow extends Window {
    constructor() {
        super()

        this.setState({
            devices: []
        })

        this.prepareMenu()
        this.loadDevices()
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

    loadDevices() {
        drives.list((err, list) => {
            if (err) return
            this.setState({devices: list})
        })
    }

    render({}, {settings}) {
        return h('section', {class: 'trail-window'}, [
            h(SideBar, {
                width: settings['sidebar.width'],
                minWidth: settings['sidebar.minwidth'],
                data: [
                    {
                        label: 'Devices',
                        locations: this.state.devices.map(d => d = {
                            path: d.name,
                            label: d.volumeName
                        })
                    },
                    {
                        label: 'Favorites',
                        locations: settings['sidebar.favorites']
                    }
                ]
            })
        ])
    }
}

module.exports = TrailWindow
