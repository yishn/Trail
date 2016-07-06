const $ = require('../modules/sprint')
const Component = require('./Component')

class HorizontalResizer extends Component {
    constructor($element, data) {
        super($element, data)

        $element.on('mousedown', evt => {
            $element
                .data('mousepos', [evt.x, evt.y])
                .data('mousedown', true)
                .data('left', this.data.left)
        })

        $(document).on('mouseup', () => {
            if (!$element.data('mousedown')) return

            $element.data('mousedown', false)
            this.emit('resized')
        }).on('mousemove', evt => {
            if (!$element.data('mousedown')) return

            var left = $element.data('left')
            var [ox, oy] = $element.data('mousepos')
            var {x, y} = evt
            var dx = x - ox

            this.data = {
                left: Math.max(left + dx, this.data.minLeft),
                minLeft: this.data.minLeft
            }
        })
    }

    render() {
        this.$element
            .css('left', this.data.left)
        .prev()
            .css('width', this.data.left)
        this.$element.next()
            .css('left', this.data.left + 2)
    }
}

module.exports = HorizontalResizer
