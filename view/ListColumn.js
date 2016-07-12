const $ = require('../modules/sprint')
const Column = require('./Column')
const VirtualList = require('./VirtualList')

class ListColumn extends Column {
    constructor($element, data) {
        super($element, data)

        if (!$element) return

        $element.on('click', () => this.focus())
    }

    render() {
        super.render()

        let $ol = $('<ol/>').appendTo(this.$element.addClass('list-column'))

        let selectItem = ($li, shift, ctrl) => {
            let item = $li.data('item')
            let $selected = this.$element.find('.selected')

            if (!ctrl && !shift) {
                $selected = $li
            } else if (ctrl) {
                $selected = $selected.add($li)
            } else if (shift) {
                let $lis = this.$element.find('li')
                let i = $lis.get().indexOf($selected.get(0))
                let j = $lis.get().indexOf($selected.get(-1))
                let k = $lis.get().indexOf($li.get(0))

                $selected = $lis.slice(Math.min(i, j, k), Math.max(i, j, k) + 1)
            }

            this.selectItems($selected)
            this.scrollIntoView($li)
        }

        this.data.itemHeight = 14 * 1.5 + 4
        let virtualList = new VirtualList($ol)
        $ol.data('component', virtualList)

        virtualList.on('chunk-rendered', () => {
            let self = this

            $ol.children('li')
            .off('mousedown mouseup mouseenter click dblclick')
            .on('mousedown', function(evt) {
                evt.preventDefault()

                let $li = $(this)
                let selected = self.$element.find('.selected').get()

                if (selected.indexOf($li.get(0)) < 0) {
                    selectItem($li, evt.shiftKey, evt.ctrlKey)
                }
            }).on('mouseup', function(evt) {
                evt.preventDefault()

                let $li = $(this)
                let selected = self.$element.find('.selected').get()

                if (selected.indexOf($li.get(0)) >= 0) {
                    selectItem($li, evt.shiftKey, evt.ctrlKey)
                }
            }).on('mouseenter', function(evt) {
                let $li = $(this)
                if ($li.get(0).offsetWidth < $li.get(0).scrollWidth)
                    $li.attr('title', $li.text())
                else
                    $li.attr('title', '')
            }).on('click', function(evt) {
                evt.preventDefault()
                self.emit('item-click')
            }).on('dblclick', function(evt) {
                evt.preventDefault()
                self.emit('item-dblclick')
            })
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

        let $selected = this.$element.find('.selected')

        if ($selected.length)
            this.scrollIntoView($selected)

        return this
    }

    selectItems($li) {
        let $selected = this.$element.find('.selected')
        $selected.removeClass('selected')
        $selected.get().forEach(li => $(li).data('item').selected = false)

        $li.addClass('selected')
        $li.get().forEach(li => $(li).data('item').selected = true)
    }

    scrollIntoView($li) {
        let $ol = this.$element.find('ol')
        let height = $ol.height()
        let scrollTop = $ol.scrollTop()
        let top = $li.position().top
        let itemHeight = $li.height()

        if (top < 0) {
            $ol.scrollTop(scrollTop + top).trigger('scroll')
        } else if (top + itemHeight > height) {
            $ol.scrollTop(scrollTop + top + itemHeight - height).trigger('scroll')
        }
    }
}

module.exports = ListColumn
