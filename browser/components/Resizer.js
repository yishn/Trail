const {h, Component} = require('preact')
const helper = require('../../modules/helper')

class Resizer extends Component {
    constructor() {
        super()

        this._oldValue = null
        this._mousePos = null

        window.addEventListener('mousemove', evt => {
            if (evt.button != 0 || this._mousePos == null) return

            let {diff, update, minValue, maxValue} = this.props
            let delta = diff(this._mousePos, [evt.x, evt.y])

            update(helper.clamp(this._oldValue + delta, minValue, maxValue))
        })

        window.addEventListener('mousedown', evt => {
            if (evt.button != 0) return

            this._oldValue = this.props.value
            this._mousePos = [evt.x, evt.y]
        })

        window.addEventListener('mouseup', evt => {
            if (evt.button != 0) return

            this._mousePos = null
        })
    }

    render({value, style}) {
        return h('div', {
            class: this.props.class,
            style: style(value)
        })
    }
}

module.exports = Resizer
