const {remote} = require('electron')
const {h, Component} = require('preact')
const setting = remote.require('./modules/setting')

class App extends Component {
    constructor() {
        super()

        this.state = {
            settings: setting.get()
        }

        let handleSettingChange = () => this.setState({
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
