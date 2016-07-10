const scroll = require('scroll')

const $ = require('../modules/sprint')
const setting = require('../modules/setting')
const Component = require('./Component')

class Column extends Component {
    render() {
        if (!('width' in this.data))
            this.data.width = setting.get('columnview.colwidth')
        if (!('minWidth' in this.data))
            this.data.minWidth = setting.get('columnview.colminwidth')

        this.$element.css('width', this.data.width).empty()

        // Handle keys

        let $input = $('<input type="text"/>')
            .addClass('focus-indicator')
            .appendTo(this.$element)

        $input.on('keydown', evt => {
            if ([37, 39].indexOf(evt.keyCode) < 0) return

            evt.preventDefault()
            let $column

            if (evt.keyCode == 37) {
                // Left arrow
                $column = this.$element.prev('.column')
            } else if (evt.keyCode == 39) {
                // Right arrow
                $column = this.$element.next('.column')
            }

            if ($column && $column.length)
                $column.data('component').focus()
        }).on('focus', () => {
            this.focus()
        })

        // Add resizer

        let $resizer = $('<div/>').addClass('resizer vertical').appendTo(this.$element)

        $resizer.on('mousedown', evt => {
            $resizer
            .data('mousepos', [evt.x, evt.y])
            .data('mousedown', true)
            .data('width', this.data.width)
        })

        $(document).on('mouseup', () => {
            if (!$resizer.data('mousedown')) return

            $resizer.data('mousedown', false)
            this.emit('resized')
        }).on('mousemove', evt => {
            if (!$resizer.data('mousedown')) return

            let width = $resizer.data('width')
            let [ox, oy] = $resizer.data('mousepos')
            let {x, y} = evt
            let dx = x - ox

            this.data.width = Math.max(width + dx, this.data.minWidth)
            this.$element.width(this.data.width)
        })

        return this
    }

    focus() {
        // Scroll column into view

        let $parent = this.$element.parent('.column-view')
        if ($parent.length) {
            let scrollLeft = $parent.scrollLeft()
            let width = $parent.width()
            let colLeft = this.$element.position().left
            let colWidth = this.$element.width()
            let options = {duration: 200}

            if (colLeft < 0) {
                scroll.left($parent.get(0), scrollLeft + colLeft, options)
            } else if (colLeft + colWidth > width) {
                scroll.left($parent.get(0), scrollLeft + colLeft + colWidth - width, options)
            }

            $parent.find('.focused').removeClass('focused')
        }

        // Add classes

        this.$element.addClass('focused')
        this.$element.find('.focus-indicator').get(0).focus()

        this.emit('focus')
        return this
    }
}

module.exports = Column
