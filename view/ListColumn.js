const $ = require('../modules/sprint')
const Component = require('./Component')

class ListColumn extends Component {
    render() {
        let scrollTop = this.$element.children('ol').scrollTop() || 0
        this.$element.css('width', this.data.width).empty()

        let $ol = $('<ol/>').appendTo(this.$element)

        this.data.items.forEach(item => {
            let $img = $('<img/>').attr('src', item.icon)
            let $li = $('<li/>').text(item.name).prepend($img)

            $li.data('item', item)

            if (item.selected) $li.addClass('selected')

            $li.on('click', () => {
                $('.focused').removeClass('focused')
                this.$element.addClass('focused')

                let $selected = this.$element.find('.selected')
                let selectedItem = $selected.data('item')

                $selected.removeClass('selected')
                $li.addClass('selected')

                if (selectedItem) selectedItem.selected = false
                item.selected = true

                this.emit('item-click', item)
            })

            $ol.append($li)
        })

        $ol.scrollTop(scrollTop)

        let $resizer = $('<div/>').addClass('resizer vertical').appendTo(this.$element)
    }
}

module.exports = ListColumn
