const $ = require('../modules/sprint')
const Component = require('./Component')

class VirtualList extends Component {
    constructor($element, data) {
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
    }

    render() {
        this.$element.empty()

        $('<div/>').addClass('placeholder')
            .css('height', data.items.length * data.itemHeight)
            .appendTo(this.$element)

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
            if (this.$element.children(`li[data-index="${i}"]`).length)
                continue

            let item = this.data.items[i]

            newItems.push(
                $('<li/>')
                .text(item.name)
                .attr('data-index', i)
                .css('top', i * this.data.itemHeight)
                .prepend($('<img/>').src(item.icon))
            )
        }

        this.$element.append(newItems)
        this.emit('chunk-rendered')
    }
}
