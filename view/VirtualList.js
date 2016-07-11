const $ = require('../modules/sprint')
const Component = require('./Component')

class VirtualList extends Component {
    constructor($element, data) {
        $element.on('scroll', () => {
            renderChunk()
        })
    }

    render() {
        this.$element.empty()

        $('<div/>').addClass('placeholder')
            .css('height', data.items.length * data.itemHeight)
            .appendTo(this.$element)
    }

    renderChunk() {
        let height = this.$element.height()
        let scrollHeight = this.$element.get(0).scrollHeight
        let scrollMiddle = this.$element.scrollTop() + height / 2
        let percent = scrollMiddle / scrollHeight
        let shownItemsCount = height / this.data.itemHeight
        let renderItemsCount = shownItemsCount * 4
        let startIndex = Math.max(0, Math.round(percent * this.data.items.length) - renderItemsCount / 2)
        let endIndex = Math.min(startIndex + renderItemsCount - 1, this.data.items.length - 1)
        let $lis = this.$element.children('li')
        let newItems = []

        $lis.eq(startIndex).prevAll('li').remove()
        $lis.eq(endIndex).nextAll('li').remove()

        for (let i = startIndex; i <= endIndex; i++) {
            if (this.$element.children(`li[data-index="${i}"]`).length)
                continue

            let item = this.data.items[i]

            newItems.push(
                $('<li/>').text(item.name).attr('data-index', i).prepend(
                    $('<img/>').src(item.icon)
                )
            )
        }

        this.$element.append(newItems)
        this.emit('chunk-rendered')
    }
}
