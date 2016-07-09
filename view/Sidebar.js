const $ = require('../modules/sprint')
const Component = require('./Component')

let transparentImg = 'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7'

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
                let $img = $('<img/>').attr('src', item.icon || transparentImg)
                let $li = $('<li/>').text(item.name).prepend($img)

                $li.data('item', item)

                if (item.selected) $li.addClass('selected')

                $li.on('click', evt => {
                    evt.preventDefault()

                    let $selected = this.$element.find('.selected')
                    let selectedItem = $selected.data('item')

                    $selected.removeClass('selected')
                    $li.addClass('selected')

                    if (selectedItem) selectedItem.selected = false
                    item.selected = true

                    this.emit('item-click', item)
                }).on('mouseenter', evt => {
                    if ($li.get(0).offsetWidth < $li.get(0).scrollWidth)
                        $li.attr('title', $li.text())
                    else
                        $li.attr('title', '')
                })

                $ol.append($li)
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
