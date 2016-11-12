const {ipcRenderer, remote} = require('electron')
const {h, Component} = require('preact')
const setting = remote.require('./modules/setting')

class App extends Component {
    constructor() {
        super()

        let getWindowIndex = () => ipcRenderer.sendSync('window-index')

        this.state = {
            windowIndex: getWindowIndex(),
            settings: setting.get()
        }

        let handleSettingChange = () => this.setState({
            windowIndex: getWindowIndex(),
            settings: setting.get()
        })

        setting.events.on('change', handleSettingChange)

        window.addEventListener('unload', () => {
            setting.events.removeListener('change', handleSettingChange)
        })

        this._settingChanges = {}
        this._settingChanged = false
    }
}

module.exports = App
