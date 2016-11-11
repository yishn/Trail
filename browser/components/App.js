const {remote} = require('electron')
const {h, Component} = require('preact')
const setting = remote.require('./modules/setting')

class App extends Component {
    constructor() {
        super()

        this.state = {
            settings: setting.get()
        }

        this._settingChanges = {}
        this._settingChanged = false
    }

    componentDidUpdate({}, {settings: prevSettings}) {
        let {settings} = this.state

        for (let key in settings) {
            if (prevSettings[key] == settings[key])
                continue

            this._settingChanges[key] = settings[key]
            this._settingChanged = true
        }

        if (this._settingChanged) {
            clearTimeout(this._settingUpdateId)

            this._settingUpdateId = setTimeout(() => {
                setting.set(this._settingChanges)
                this._settingChanges = {}
                this._settingChanged = false
            }, 500)
        }
    }
}

module.exports = App
