const $ = require('../modules/sprint')
const Component = require('./Component')

let transparentImg = 'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7'

class VirtualList extends Component {
    constructor($element, data) {
        super($element)

        let lastRenderY

        $element.on('scroll', () => {
            let height = $element.height()
            let scrollTop = $element.scrollTop()

            if (!lastRenderY || Math.abs(scrollTop - lastRenderY) >= height / 2) {
                this._renderChunk(height, scrollTop)
                lastRenderY = scrollTop
            }
        })

        if (data) this.data = data
    }

    render() {
        if (!this.data.items) this.data.items = []

        let scrollTop = this.$element.scrollTop()
        this.$element.empty()

        $('<div/>').addClass('placeholder')
            .css('height', this.data.items.length * this.data.itemHeight)
            .appendTo(this.$element)

        this.$element.scrollTop(scrollTop)
        this.$element.trigger('scroll')
    }

    _renderChunk(height, scrollTop) {
        if (!height) height = this.$element.height()
        if (!scrollTop) scrollTop = this.$element.scrollTop()

        let scrollHeight = this.$element.get(0).scrollHeight
        let scrollMiddle = scrollTop + height / 2
        let percent = scrollMiddle / scrollHeight
        let shownItemsCount = height / this.data.itemHeight
        let renderItemsCount = shownItemsCount * 3
        let startIndex = Math.max(0, Math.round(percent * this.data.items.length - renderItemsCount / 2))
        let endIndex = Math.min(startIndex + renderItemsCount - 1, this.data.items.length - 1)
        let newItems = []

        this.$element.children('li').remove()

        for (let i = startIndex; i <= endIndex; i++) {
            let item = this.data.items[i]
            let $img = $('<img/>')
            let $li = $('<li/>')
                .data('item', item)
                .text(item.name)
                .attr('data-index', i)
                .css('top', i * this.data.itemHeight)
                .prepend($img)

            let events = ['mousedown', 'mouseup', 'mouseenter', 'click', 'dblclick']
            events.forEach(name => $li.on(name, evt => this.emit('item-' + name, $li, evt)))

            if (item.icon instanceof Function) {
                item.icon((err, img) => $img.attr('src', img || transparentImg))
            } else {
                $img.attr('src', item.icon || transparentImg)
            }

            if (item.selected) $li.addClass('selected')

            newItems.push($li)
        }

        this.$element.append(newItems)
        this.emit('chunk-rendered')
    }

    selectItems(indices) {
        let lastIndices = this.data.items
            .map((item, i) => [i, item.selected])
            .filter(([_, selected]) => selected)
            .map(([i, _]) => i)
            .sort()

        if (indices.sort().every((x, i) => x == lastIndices[i]))
            return this

        this.data.items.forEach((item, i) => {
            item.selected = indices.includes(i)
        })

        this.$element.children('li').get().forEach(li => {
            $(li).toggleClass('selected', $(li).data('item').selected)
        })

        this.emit('selection-changed')
        return this
    }

    scrollIntoView(index) {
        let height = this.$element.height()
        let scrollTop = this.$element.scrollTop()
        let itemHeight = this.data.itemHeight
        let top = index * itemHeight - scrollTop

        if (top < 0) {
            this.$element.scrollTop(scrollTop + top).trigger('scroll')
        } else if (top + itemHeight > height) {
            this.$element.scrollTop(scrollTop + top + itemHeight - height).trigger('scroll')
        }

        return this
    }
}

module.exports = VirtualList
