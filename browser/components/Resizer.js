const {h, Component} = require('preact')

class Resizer extends Component {
    constructor() {
        super()

        this._oldValue = null
        this._mousePos = null

        window.addEventListener('mousemove', evt => {
            if (evt.button != 0 || this._mousePos == null) return

            let diff = this.props.diff(this._mousePos, [evt.x, evt.y])
            this.props.update(this._oldValue + diff)
        })
    }

    componentDidMount() {
        this.element.addEventListener('mousedown', evt => {
            if (evt.button != 0) return

            this._oldValue = this.props.value
            this._mousePos = [evt.x, evt.y]
        })

        this.element.addEventListener('mouseup', evt => {
            if (evt.button != 0) return

            this._mousePos = null
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
