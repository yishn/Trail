const scroll = require('scroll')

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
        $('<div/>').addClass('placeholder').appendTo(this.$element)

        this.data.columns.forEach((column, i) => {
            this.addColumn(column, err => {
                let $column = this.$element.find('.column').eq(i)
                if (err || !$column.hasClass('list-column')) return

                let columnComponent = $column.data('component')

                // Spray breadcrumbs along the trail

                if (i + 1 == this.data.columns.length) {
                    $column.find('li').eq(0).trigger('mousedown')
                    this.$element.scrollLeft(0)
                    columnComponent.focus()
                    return
                }

                let item = columnComponent.data.items.find(item => item.path == this.data.columns[i + 1].path)
                let index = columnComponent.data.items.indexOf(item)

                if (index >= 0) columnComponent.selectItems([index]).focus()
            }, false)
        })

        return this
    }

    getLastColumn() {
        return this.$element.find('.column').eq(-1)
    }

    removeColumnsAfter($column) {
        let $columns = this.$element.find('.column')
        let index = $columns.get().indexOf($column.get(0))
        let scrollWidth = this.$element.get(0).scrollWidth

        this.$element.find('.placeholder').css('width', scrollWidth)
        this.data.columns.splice(index + 1, $columns.length)
        $column.nextAll('.column').remove()

        return this
    }

    addColumn(column, callback = null, updateData = true) {
        let $column = Trail.createColumn(column)
        let component = $column.data('component')

        this.$element.append($column)
        component.on('focus', () => this.scrollIntoView($column))

        if (updateData)
            this.data.columns.push(column)
        if (!callback)
            callback = err => this.scrollIntoView($column)

        $column.addClass('busy')
        component.load(column.path, err => {
            $column.removeClass('busy')
            callback(err)
        })

        return this
    }

    scrollIntoView($column) {
        let scrollLeft = this.$element.scrollLeft()
        let width = this.$element.width()
        let colLeft = $column.position().left
        let colWidth = $column.width()
        let options = {duration: 200}

        if (colLeft < 0) {
            scroll.left(this.$element.get(0), scrollLeft + colLeft, options)
        } else if (colLeft + colWidth > width) {
            scroll.left(this.$element.get(0), scrollLeft + colLeft + colWidth - width, options)
        }
    }
}

module.exports = ColumnView
