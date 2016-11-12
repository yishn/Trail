const {h, Component} = require('preact')
const Column = require('./Column')

class ColumnView extends Component {
    render({columns}) {
        return h('section', {class: 'column-view'}, columns.map(column =>
            h(Column)
        ))
    }
}

module.exports = ColumnView
