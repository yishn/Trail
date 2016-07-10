const $ = require('../modules/sprint')
const Component = require('./Component')

class TabBar extends Component {
    render() {
        this.$element.empty()

        let $ol = $('<ol/>').appendTo(this.$element)

        this.data.tabs.forEach(tab => {
            let $li = $('<li/>').data('tab', tab).text(tab.name)
            let $img = $('<img/>')
                .addClass('close')
                .attr('src', '../node_modules/octicons/build/svg/x.svg')

            if (tab.selected) $li.addClass('selected')

            $li.append($img)
            $ol.append($li)

            $li.on('click', () => this.select($li))
            $li.find('.close').on('click', evt => {
                evt.stopPropagation()
                this.close($li)
            })
        })

        $ol.append(
            $('<li/>').addClass('add').append(
                $('<img/>').attr('src', '../node_modules/octicons/build/svg/plus.svg')
            )
        )
    }

    select($li) {
        let $selected = this.$element.find('.selected')
        $selected.removeClass('selected')
        $li.addClass('selected')

        $selected.data('tab').selected = false
        $li.data('tab').selected = true

        this.emit('tab-selected', $li.data('tab'))
    }

    close($li) {
        if (this.$element.find('li').length <= 2)
            return

        let tab = $li.data('tab')
        let index = this.data.tabs.indexOf(tab)
        let nextIndex = Math.max(index - 1, 0)
        if (nextIndex == index) nextIndex++

        if ($li.hasClass('selected'))
            this.select(this.$element.find('li').eq(nextIndex))

        setTimeout(() => {
            this.data.tabs.splice(index, 1)
            this.render()
        }, 200)

        // Animate

        let width = $li.width()
        $li.addClass('closing')
        $li.nextAll().css('left', -width + 'px')
    }
}

module.exports = TabBar
