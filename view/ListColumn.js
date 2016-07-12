const $ = require('../modules/sprint')
const Column = require('./Column')
const VirtualList = require('./VirtualList')

class ListColumn extends Column {
    constructor($element, data) {
        super($element, data)

        if (!$element) return
    }

    render() {
        super.render()

        let $ol = $('<ol/>').appendTo(this.$element.addClass('list-column'))

        let selectItem = ($li, shift, ctrl) => {
            let index = $li.attr('data-index')
            let item = $li.data('item')
            let selectedItems = this.data.items.filter(item => item.selected)

            if (!ctrl && !shift) {
                selectedItems = [item]
            } else if (ctrl) {
                selectedItems.push(item)
            } else if (shift) {
                let i = this.data.items.indexOf(selectedItems[0])
                let j = this.data.items.indexOf(selectedItems[selectedItems.length - 1])
                let k = index

                selectedItems = this.data.items.slice(Math.min(i, j, k), Math.max(i, j, k) + 1)
            }

            this.selectItems(selectedItems.map(item => this.data.items.indexOf(item)))
            this.scrollIntoView(index)
        }

        this.data.itemHeight = 14 * 1.5 + 4
        let virtualList = new VirtualList($ol)
        $ol.data('component', virtualList)

        virtualList.on('item-mousedown', ($li, evt) => {
            evt.preventDefault()

            let selected = this.data.items.find(item => item.selected)
            if (!selected) {
                selectItem($li, evt.shiftKey, evt.ctrlKey)
            }
        }).on('item-mouseup', ($li, evt) => {
            evt.preventDefault()

            let selected = this.data.items.find(item => item.selected)
            if (selected) {
                selectItem($li, evt.shiftKey, evt.ctrlKey)
            }
        }).on('item-mouseenter', ($li, evt) => {
            if ($li.get(0).offsetWidth < $li.get(0).scrollWidth)
                $li.attr('title', $li.text())
            else
                $li.attr('title', '')
        }).on('item-click', ($li, evt) => {
            evt.preventDefault()
            this.focus()
            this.emit('item-click', $li, evt)
        }).on('item-dblclick', ($li, evt) => {
            evt.preventDefault()
            this.emit('item-dblclick', $li, evt)
        })

        virtualList.data = this.data

        // Handle keys

        this.$element.find('.focus-indicator').on('keydown', evt => {
            if ([36, 35, 33, 34, 40, 38, 13].indexOf(evt.keyCode) < 0) return
            evt.preventDefault()

            let $selected = this.$element.find('.selected')
            let $lis = this.$element.find('li')
            let i = $lis.get().indexOf($selected.get(0))
            let j = $lis.get().indexOf($selected.get(-1))
            let $li

            if (evt.keyCode == 36) {
                // Home Arrow
                $ol.scrollTop(0).trigger('scroll')
                $li = this.$element.find('li').eq(0)
            } else if (evt.keyCode == 35) {
                // End Arrow
                $ol.scrollTop($ol.get(0).scrollHeight).trigger('scroll')
                $li = this.$element.find('li').eq(-1)
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

        return this
    }

    focus() {
        super.focus()

        let selected = this.data.items.find(item => item.selected)
        if (!selected) return this

        let index = this.data.items.indexOf(selected)
        this.scrollIntoView(index)

        return this
    }

    selectItems(indices) {
        this.$element.find('ol').data('component').selectItems(indices)
        return this
    }

    scrollIntoView(index) {
        this.$element.find('ol').data('component').scrollIntoView(index)
        return this
    }
}

module.exports = ListColumn
