const $ = require('../modules/sprint')
const Component = require('./Component')

let transparentImg = 'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7'

class ListColumn extends Component {
    render() {
        let scrollTop = this.$element.children('ol').scrollTop() || 0
        this.$element.css('width', this.data.width).empty()

        let $ol = $('<ol/>')
        let $input = $('<input type="text"/>').addClass('focus-indicator')
        this.$element.append($ol, $input)

        let itemMouseDownHandler = ($li, shift, ctrl) => {
            let item = $li.data('item')

            // Focus component

            $('.focused').removeClass('focused')
            this.$element.addClass('focused')
            $input.get(0).focus()

            // Select items

            let $selected = this.$element.find('.selected')
            let selectedItem = $selected.data('item')

            if (!ctrl) $selected.removeClass('selected')

            if (!shift || !$selected.length) {
                $li.addClass('selected')
            } else {
                let $lis = this.$element.find('li')
                let i = $lis.get().indexOf($selected.get(0))
                let j = $lis.get().indexOf($selected.get(-1))
                let k = $lis.get().indexOf($li.get(0))

                $lis.slice(Math.min(i, j, k), Math.max(i, j, k) + 1).addClass('selected')
            }

            if (selectedItem) selectedItem.selected = false
            item.selected = true
            $li.get(0).scrollIntoViewIfNeeded(false)

            // Emit event

            this.emit('item-mousedown', item)
        }

        $input.on('keydown', evt => {
            evt.preventDefault()
            if ([40, 38, 13].indexOf(evt.keyCode) < 0) return

            let $selected = this.$element.find('.selected')
            let $lis = this.$element.find('li')
            let i = $lis.get().indexOf($selected.get(0))
            let j = $lis.get().indexOf($selected.get(-1))
            let $li

            if (evt.keyCode == 40) {
                // Down Arrow
                $li = $lis.eq(Math.min(j + 1, $lis.length - 1))
            } else if (evt.keyCode == 38) {
                // Up Arrow
                $li = $lis.eq(Math.max(i - 1, 0))
            } else if (evt.keyCode == 13) {
                // Enter
                this.emit('item-activate')
                return
            }

            itemMouseDownHandler($li, evt.shiftKey, evt.ctrlKey)
        })

        this.data.items.forEach(item => {
            let $img = $('<img/>').attr('src', item.icon || transparentImg)
            let $li = $('<li/>').text(item.name).prepend($img)

            $li.data('item', item)

            if (item.selected) $li.addClass('selected')

            $li.on('mousedown', evt => {
                evt.preventDefault()
                itemMouseDownHandler($li, evt.shiftKey, evt.ctrlKey)
            }).on('mouseup', evt => {
                evt.preventDefault()
                this.emit('item-activate')
            })

            $ol.append($li)
        })

        $ol.scrollTop(scrollTop)

        // Add resizer

        let $resizer = $('<div/>').addClass('resizer vertical').appendTo(this.$element)
    }
}

module.exports = ListColumn
