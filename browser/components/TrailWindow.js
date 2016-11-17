const {ipcRenderer, remote} = require('electron')
const {app} = remote
const {h, Component} = require('preact')
const setting = remote.require('./modules/setting')
const drives = require('../../modules/drives')

const App = require('./App')
const SideBar = require('./SideBar')
const Resizer = require('./Resizer')
const Main = require('./Main')

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
        let {supports} = require('../../packages/directory')

        drives.list((err, list) => {
            if (err) return

            let devices = list.map(d => d = {
                path: d.name,
                label: d.volumeName,
                type: 'directory'
            }).filter(d => supports(d.path))

            this.setState({devices})
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
                        locations: this.state.devices
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

                type: 'horizontal',
                update: width => {
                    this.state.settings['sidebar.width'] = width
                    this.setState(this.state)
                    setting.set('sidebar.width', width)
                }
            }),

            h(Main, {
                location: this.state.location,
                settings
            })
        ])
    }
}

module.exports = TrailWindow
