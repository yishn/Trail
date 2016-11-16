const {h, Component} = require('preact')

class Resizer extends Component {
    render({value, style}) {
        return h('div', {
            class: this.props.class,
            style: style(value),
            ref: el => this.element = el
        })
    }
}

module.exports = Resizer
