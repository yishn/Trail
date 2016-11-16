const {h, Component} = require('preact')
const helper = require('../../modules/helper')

class Resizer extends Component {
    constructor() {
        super()

        this._oldValue = null
        this._mousePos = null

        window.addEventListener('mousemove', evt => {
            if (evt.button != 0 || this._mousePos == null) return

            let {type, update, minValue, maxValue} = this.props
            let t = type == 'horizontal' ? a => a[0] : a => a[1]
            let diff = (a, b) => t(b) - t(a)
            let delta = diff(this._mousePos, [evt.x, evt.y])

            update(helper.clamp(this._oldValue + delta, minValue, maxValue))
        })

        window.addEventListener('mouseup', evt => {
            if (evt.button != 0) return

            this._mousePos = null
        })
    }

    componentDidMount() {
        this.element.addEventListener('mousedown', evt => {
            if (evt.button != 0) return

            this._oldValue = this.props.value
            this._mousePos = [evt.x, evt.y]
        })
    }

    render({value, style}) {
        return h('div', {
            class: this.props.class,
            style: style(value),
            ref: el => this.element = el
        })
    }
}

module.exports = Resizer
