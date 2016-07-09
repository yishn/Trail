const $ = require('../modules/sprint')
const Column = require('./Column')

let transparentImg = 'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7'

class ListColumn extends Column {
    render() {
        super.render()

        let scrollTop = this.$element.children('ol').scrollTop() || 0

        let $ol = $('<ol/>')
        let $input = $('<input type="text"/>').addClass('focus-indicator')
        this.$element.addClass('list-column').append($ol, $input)

        this.$element.on('click', evt => {
            this.deselect().focus()
        })

        let selectItem = ($li, shift, ctrl) => {
            let item = $li.data('item')

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

            // Focus component

            this.focus()
        }

        this.data.items.forEach(item => {
            let $img = $('<img/>').attr('src', item.icon || transparentImg)
            let $li = $('<li/>').text(item.name).prepend($img)

            $li.data('item', item)

            if (item.selected) $li.addClass('selected')

            $li.on('mousedown', evt => {
                evt.preventDefault()

                let selected = this.$element.find('.selected').get()
                if (selected.indexOf($li.get(0)) < 0) {
                    selectItem($li, evt.shiftKey, evt.ctrlKey)
                }
            }).on('mouseup', evt => {
                evt.preventDefault()

                let selected = this.$element.find('.selected').get()
                if (selected.indexOf($li.get(0)) >= 0) {
                    selectItem($li, evt.shiftKey, evt.ctrlKey)
                }
            }).on('mouseenter', evt => {
                if ($li.get(0).offsetWidth < $li.get(0).scrollWidth)
                    $li.attr('title', $li.text())
                else
                    $li.attr('title', '')
            }).on('click', evt => {
                evt.stopPropagation()
                this.emit('item-click')
            }).on('dblclick', evt => {
                evt.preventDefault()
                this.emit('item-dblclick')
            })

            $ol.append($li)
        })

        $ol.scrollTop(scrollTop)

        // Handle keys

        $input.on('keydown', evt => {
            evt.preventDefault()
            if ([36, 35, 33, 34, 40, 38, 13].indexOf(evt.keyCode) < 0) return

            let $selected = this.$element.find('.selected')
            let $lis = this.$element.find('li')
            let i = $lis.get().indexOf($selected.get(0))
            let j = $lis.get().indexOf($selected.get(-1))
            let $li

            if (evt.keyCode == 36) {
                // Home Arrow
                $li = $lis.eq(0)
            } else if (evt.keyCode == 35) {
                // End Arrow
                $li = $lis.eq(-1)
            } else if (evt.keyCode == 33) {
                // Page Up Arrow
                $li = $lis.eq(Math.max(i - 10, 0))
            } else if (evt.keyCode == 34) {
                // Page Down Arrow
                $li = $lis.eq(Math.min(j + 10, $lis.length - 1))
            } else if (evt.keyCode == 38) {
                // Up Arrow
                $li = $lis.eq(Math.max(i - 1, 0))
            } else if (evt.keyCode == 40) {
                // Down Arrow
                $li = $lis.eq(Math.min(j + 1, $lis.length - 1))
            } else if (evt.keyCode == 13) {
                // Enter
                this.emit('item-click')
                this.emit('item-dblclick')
                return
            }

            selectItem($li, evt.shiftKey, evt.ctrlKey)
        })
    }

    focus() {
        $('.focused').removeClass('focused')
        this.$element.addClass('focused')
        this.$element.find('.focus-indicator').get(0).focus()
        return this
    }

    deselect() {
        let $selected = this.$element.find('.selected').removeClass('selected')
        if ($selected.length) $selected.data('item').selected = false
        return this
    }
}

module.exports = ListColumn
