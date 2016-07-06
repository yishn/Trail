const $ = require('../modules/sprint')
const Component = require('./Component')

class Sidebar extends Component {
    render() {
        this.$element.empty()

        this.data.forEach(group => {
            var $label = $('<h2/>').text(group.name)
            var $ol = $('<ol/>')

            this.$element.append($label, $ol)

            if (!group.items || !group.items.length) return

            group.items.forEach(item => {
                var $item = $('<li/>').text(item.name)
                var $i = $('<i/>').addClass('mi').prependTo($item)

                if (item.selected) $item.addClass('selected')
                if (item.icon == 'usb') $i.addClass('mi-usb')
                else if (item.icon == 'sd') $i.addClass('mi-sd')
                else $i.addClass('mi-console-xbox')

                $item.on('click', () => {
                    $('#sidebar .selected').removeClass('selected')
                    $item.addClass('selected')
                    this.emit('item-click', item)
                })

                $ol.append($item)
            })
        })
    }
}

module.exports = Sidebar
