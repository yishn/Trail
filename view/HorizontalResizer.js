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

            let left = $element.data('left')
            let [ox, oy] = $element.data('mousepos')
            let {x, y} = evt
            let dx = x - ox

            this.data = {
                left: Math.max(left + dx, this.data.minLeft),
                minLeft: this.data.minLeft
            }
        })
    }

    render() {
        this.$element
            .css('left', this.data.left - 2)
        .prev()
            .css('width', this.data.left - 2)
        this.$element.next()
            .css('left', this.data.left)
    }
}

module.exports = HorizontalResizer
