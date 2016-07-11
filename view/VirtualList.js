const $ = require('../modules/sprint')
const Component = require('./Component')

let transparentImg = 'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7'

class VirtualList extends Component {
    constructor($element, data) {
        super($element)

        let lastScrolled = 0
        let lastRenderY

        setInterval(() => {
            if (Date.now() - lastScrolled <= 100) return
            $element.children('li[data-rm="1"]').remove()
        }, 300)

        $element.on('scroll', () => {
            let height = $element.height()
            let scrollTop = $element.scrollTop()

            if (!lastRenderY || Math.abs(scrollTop - lastRenderY) > height) {
                this._renderChunk(height, scrollTop)
                lastRenderY = scrollTop
            }

            lastScrolled = Date.now()
        })

        if (data) this.data = data
    }

    render() {
        let scrollTop = this.$element.scrollTop()
        this.$element.empty()

        $('<div/>').addClass('placeholder')
            .css('height', this.data.items.length * this.data.itemHeight)
            .appendTo(this.$element)

        this.$element.scrollTop(scrollTop)
        this.$element.trigger('scroll')
    }

    _renderChunk(height, scrollTop) {
        let scrollHeight = this.$element.get(0).scrollHeight
        let scrollMiddle = scrollTop + height / 2
        let percent = scrollMiddle / scrollHeight
        let shownItemsCount = height / this.data.itemHeight
        let renderItemsCount = shownItemsCount * 3
        let startIndex = Math.max(0, Math.round(percent * this.data.items.length - renderItemsCount / 2))
        let endIndex = Math.min(startIndex + renderItemsCount - 1, this.data.items.length - 1)
        let $lis = this.$element.children('li')
        let newItems = []

        $lis.eq(startIndex).prevAll('li').add($lis.eq(endIndex).nextAll('li'))
        .css('display', 'none')
        .attr('data-rm', 1)

        for (let i = startIndex; i <= endIndex; i++) {
            let $check = this.$element.children(`li[data-index="${i}"]`)
            if ($check.length) {
                $check.css('display', 'block').attr('data-rm', 0)
                continue
            }

            let item = this.data.items[i]
            let $li = $('<li/>')
                .data('item', item)
                .text(item.name)
                .attr('data-index', i)
                .css('top', i * this.data.itemHeight)
                .prepend($('<img/>').attr('src', item.icon || transparentImg))

            if (item.selected) $li.addClass('selected')

            newItems.push($li)
        }

        this.$element.append(newItems)
        this.emit('chunk-rendered')
    }
}

module.exports = VirtualList
