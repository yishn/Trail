const {h, Component} = require('preact')
const Resizer = require('./Resizer')

class Column extends Component {
    render({location, width, minWidth}) {
        return h('section', {class: 'column-box', style: {width}}, [
            h(Resizer, {
                class: 'resizer',
                value: width,
                minValue: minWidth,
                type: 'horizontal',
                onUpdate: value => this.props.onResize(value)
            })
        ])
    }
}

module.exports = Column
