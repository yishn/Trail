const {h, Component} = require('preact')
const Column = require('./Column')

class ColumnView extends Component {
    render({breadcrumbs, settings}, {widths = {}}) {
        return h('section', {class: 'column-view'}, breadcrumbs.map((location, i) =>
            h(Column, {
                location,
                width: widths[i] || settings['columnview.colwidth'],
                minWidth: settings['columnview.colminwidth'],
                
                onResize: width => {
                    widths[i] = width
                    this.setState({widths})
                }
            })
        ))
    }
}

module.exports = ColumnView
