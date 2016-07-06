const $ = require('../modules/sprint')
const Component = require('./Component')

class Sidebar extends Component {
    render() {
        var scrollTop = this.$element.scrollTop()
        this.$element.empty()

        this.data.forEach(group => {
            var $label = $('<h2/>').text(group.name)
            var $ol = $('<ol/>')

            this.$element.append($label, $ol)

            if (!group.items || !group.items.length) return

            group.items.forEach(item => {
                var $item = $('<li/>').text(item.name)
                var $i = $('<i/>').addClass('mi').prependTo($item)

                $item.data('item', item)

                if (item.selected) $item.addClass('selected')

                if (item.icon == 'drive') $i.addClass('mi-console-xbox')
                else if (item.icon == 'usb') $i.addClass('mi-usb')
                else if (item.icon == 'sd') $i.addClass('mi-sd')
                else $i.addClass('mi-folder-outline')

                $item.on('click', () => {
                    var $selected = this.$element.find('.selected')
                    var selectedItem = $selected.data('item')

                    $selected.removeClass('selected')
                    $item.addClass('selected')

                    if (selectedItem) selectedItem.selected = false
                    item.selected = true

                    this.emit('item-click', item)
                })

                $ol.append($item)
            })
        })

        this.$element.scrollTop(scrollTop)
    }

    deselect() {
        var $selected = this.$element.find('.selected').removeClass('selected')
        if ($selected.length) $selected.data('item').selected = false
    }
}

module.exports = Sidebar
