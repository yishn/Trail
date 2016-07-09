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
}

module.exports = Column
