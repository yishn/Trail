const $ = require('../modules/sprint')
const Component = require('./Component')

class Sidebar extends Component {
    render() {
        let scrollTop = this.$element.scrollTop()
        this.$element.empty()

        this.data.forEach(group => {
            let $label = $('<h2/>').text(group.name)
            let $ol = $('<ol/>')

            this.$element.append($label, $ol)

            if (!group.items || !group.items.length) return

            group.items.forEach(item => {
                let $item = $('<li/>').text(item.name)
                let $i = $('<i/>').addClass('mi').prependTo($item)

                $item.data('item', item)

                if (item.selected) $item.addClass('selected')

                if (item.icon == 'network') $i.addClass('mi-network-drive')
                else if (item.icon == 'removable') $i.addClass('mi-usb')
                else if (item.icon == 'cd') $i.addClass('mi-cd')
                else if (item.icon == 'folder') $i.addClass('mi-folder-outline mi-flip-vertical')
                else $i.addClass('mi-console-xbox')

                $item.on('click', () => {
                    let $selected = this.$element.find('.selected')
                    let selectedItem = $selected.data('item')

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
        let $selected = this.$element.find('.selected').removeClass('selected')
        if ($selected.length) $selected.data('item').selected = false
    }
}

module.exports = Sidebar
