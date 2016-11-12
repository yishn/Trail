const {h, Component} = require('preact')

class Column extends Component {
    render() {
        return h('div', {class: 'column-box'})
    }
}

module.exports = Column
