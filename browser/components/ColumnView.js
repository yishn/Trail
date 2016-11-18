const {h, Component} = require('preact')
const scroll = require('scroll')
const deepEqual = require('universal-deep-strict-equal')

const Column = require('./Column')

class ColumnView extends Component {
    componentDidMount() {
        this.focusColumn(this.props.breadcrumbs.length - 1)
    }

    componentDidUpdate({breadcrumbs: prevBreadcrumbs}) {
        if (!deepEqual(prevBreadcrumbs, this.props.breadcrumbs)) {
            this.focusColumn(this.props.breadcrumbs.length - 1)
        }
    }

    focusColumn(index) {
        let {scrollLeft, offsetWidth: width} = this.element
        let column = this.element.querySelectorAll('.column-box')[index]
        let {offsetLeft: columnLeft, offsetWidth: columnWidth} = column
        let options = {duration: 200}

        this.setState({focusedIndex: index})

        if (columnLeft < scrollLeft) {
            scroll.left(this.element, columnLeft, options)
        } else if (columnLeft + columnWidth > scrollLeft + width) {
            scroll.left(this.element, columnLeft + columnWidth - width, options)
        }
    }

    render({breadcrumbs, settings}, {focusedIndex = null, widths = {}}) {
        return h('section', {
            class: 'column-view',
            ref: el => this.element = el
        }, breadcrumbs.map((location, i) =>
            h(Column, {
                location,
                breadcrumbs,
                width: widths[i] || settings['columnview.colwidth'],
                minWidth: settings['columnview.colminwidth'],
                focused: focusedIndex == i,

                onResize: width => {
                    widths[i] = width
                    this.setState({widths})
                },

                onFocus: column => {
                    this.focusColumn(i)

                    if (column.state.selectedIndices.length != 0)
                        column.scrollItemIntoView(column.state.selectedIndices[0])
                }
            })
        ))
    }
}

module.exports = ColumnView
