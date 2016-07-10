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
        let tab = $li.data('tab')
        let index = this.data.tabs.indexOf(tab)
        let selectIndex = Math.max(index - 1, 0)

        this.select(this.$element.find('li').eq(selectIndex))
        $li.addClass('closing')

        setTimeout(() => {
            this.data.tabs.splice(index, 1)
            this.render()
        }, 200)
    }
}

module.exports = TabBar
