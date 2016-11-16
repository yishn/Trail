const {h, Component} = require('preact')
const ColumnView = require('./ColumnView')

class Main extends Component {
    render({settings}) {
        return h('main', {style: {left: settings['sidebar.width']}}, [
            h(ColumnView, {columns: []})
        ])
    }
}

module.exports = Main
