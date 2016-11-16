const {ipcRenderer, remote} = require('electron')
const {app} = remote
const {h, Component} = require('preact')
const setting = remote.require('./modules/setting')
const drives = require('../../modules/drives')

const App = require('./App')
const SideBar = require('./SideBar')
const Resizer = require('./Resizer')
const ColumnView = require('./ColumnView')

class TrailWindow extends App {
    constructor() {
        super()

        let {settings, windowIndex} = this.state
        let {location} = settings['session.windows'][windowIndex]

        this.setState({
            location,
            devices: []
        })
    }

    componentDidMount() {
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
                location: this.state.location,
                width: settings['sidebar.width'],
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
            }),

            h(Resizer, {
                class: 'side-bar-resizer',
                style: value => value = {left: value},
                value: settings['sidebar.width'],
                minValue: settings['sidebar.minwidth'],
                maxValue: settings['sidebar.maxwidth'],
                diff: ([x1, y1], [x2, y2]) => x2 - x1,
                update: width => {
                    this.state.settings['sidebar.width'] = width
                    this.setState(this.state)
                    setting.set('sidebar.width', width)
                }
            }),

            h(ColumnView, {columns: []})
        ])
    }
}

module.exports = TrailWindow
