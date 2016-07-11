const $ = require('../modules/sprint')
const Component = require('./Component')

class VirtualList extends Component {
    constructor($element, data) {

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
        let startIndex = Math.max(0, Math.round(percent * data.items.length) - renderItemsCount / 2)
        let endIndex = startIndex + renderItemsCount - 1

        for (let i = startIndex; i <= endIndex; i++) {

        }
    }
}
