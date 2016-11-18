const {h, Component} = require('preact')
const Column = require('./Column')

class ColumnView extends Component {
    render({breadcrumbs, settings}, {focusedIndex = 0, widths = {}}) {
        return h('section', {class: 'column-view'}, breadcrumbs.map((location, i) =>
            h(Column, {
                location,
                width: widths[i] || settings['columnview.colwidth'],
                minWidth: settings['columnview.colminwidth'],
                focused: focusedIndex == i,

                initialSelectedPath: i + 1 < breadcrumbs.length ? breadcrumbs[i + 1].path : null,

                onResize: width => {
                    widths[i] = width
                    this.setState({widths})
                },

                onFocus: () => {
                    this.setState({focusedIndex: i})
                }
            })
        ))
    }
}

module.exports = ColumnView
