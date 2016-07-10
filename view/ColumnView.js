const $ = require('../modules/sprint')
const Component = require('./Component')
const Trail = require('./index')

class ColumnView extends Component {
    constructor($element, data) {
        super($element, data)

        this.$element.on('scroll', () => {
            let $resizer = $('#sidebar + .resizer')
            $resizer.toggleClass('shadow', this.$element.scrollLeft() != 0)
        })
    }

    render() {
        this.$element.empty()

        this.data.columns.forEach((column, i) => {
            this.addColumn(column, err => {
                let $column = this.$element.find('.column').eq(i)
                if (err || !$column.hasClass('list-column')) return

                // Spray breadcrumbs along the trail

                if (i + 1 == this.data.columns.length) {
                    $column.find('li').eq(0).trigger('mousedown')
                    this.$element.scrollLeft(0)
                    $column.data('component').focus()
                    return
                }

                let filter = li => $(li).data('item').path == this.data.columns[i + 1].path
                let lis = $column.find('li').get().filter(filter)

                if (lis.length > 0) $(lis[0]).trigger('mousedown')
            }, false)
        })

        return this
    }

    getLastColumn() {
        return this.$element.find('.column').eq(-1)
    }

    addColumn(column, callback = null, updateData = true) {
        let $column = Trail.createColumn(column)
        let component = $column.data('component')

        this.$element.append($column)

        if (updateData)
            this.data.columns.push(column)
        if (!callback)
            callback = err => component.focus()

        component.load(column.path, callback)
        return this
    }
}

module.exports = ColumnView
