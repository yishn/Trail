const $ = require('../modules/sprint')
const Component = require('./Component')

class TabBar extends Component {
    constructor($element, data) {
        super($element, data)

        $(document).on('keydown', evt => {
            if (!evt.ctrlKey || evt.keyCode != 9) return

            if (!evt.shiftKey) this.selectNextTab()
            else this.selectPreviousTab()
        })
    }

    render() {
        this.$element.empty()

        let $ol = $('<ol/>').appendTo(this.$element)

        this.data.tabs.forEach(tab => {
            let $li = $('<li/>')
                .data('tab', tab)
                .text(tab.name)
                .prop('draggable', true)
            let $img = $('<img/>')
                .addClass('close')
                .attr('src', '../node_modules/octicons/build/svg/x.svg')

            if (tab.selected) $li.addClass('selected')

            $li.append($img)
            $ol.append($li)

            $li.on('click', evt => {
                if (evt.button == 0)
                    this.selectTab($li)
                else if (evt.button == 1)
                    this.closeTab($li)
            }).on('dragstart', () => {
                $li.addClass('dragstart')
            }).on('dragover', evt => {
                evt.preventDefault()

                let middle = $li.offset().left + $li.width() / 2
                let leftPos = evt.x < middle - 10
                let rightPos = evt.x > middle + 10

                if (leftPos) {
                    $li.addClass('indicator')
                    .next('li').removeClass('indicator')
                } else if (rightPos) {
                    $li.removeClass('indicator')
                    .next('li').addClass('indicator')
                }
            }).on('dragleave', () => {
                $li.removeClass('indicator')
                $li.next('li').removeClass('indicator')
            }).on('dragend', () => {
                $li.removeClass('dragstart')

                let $indicator = this.$element.find('.indicator')
                if (!$indicator.length) return

                let $lis = this.$element.find('li')
                let index = $lis.get().indexOf($li.get(0))
                let insertIndex = $lis.not($li).get().indexOf($indicator.get(0))

                if (insertIndex >= 0) {
                    this.data.tabs.splice(index, 1)
                    this.data.tabs.splice(insertIndex, 0, tab)
                    this.render()
                } else {
                    $indicator.removeClass('indicator')
                }
            })

            $li.find('.close').on('click', evt => {
                evt.stopPropagation()
                this.closeTab($li)
            })
        })

        $ol.append(
            $('<li/>').addClass('add').append(
                $('<img/>').attr('src', '../node_modules/octicons/build/svg/plus.svg')
            ).on('click', () => this.emit('addbutton-click'))
        )
    }

    getSelectedTab() {
        let $selected = this.$element.find('.selected')
        return $selected.data('tab')
    }

    selectTab($li) {
        let $selected = this.$element.find('.selected')
        $selected.removeClass('selected')
        $li.addClass('selected')

        $selected.data('tab').selected = false
        $li.data('tab').selected = true

        this.emit('tab-selected', $li.data('tab'))
    }

    selectNextTab() {
        let $li = this.$element.find('.selected').next('li:not(.add)')
        if (!$li.length) $li = this.$element.find('li:not(.add)').eq(0)
        this.selectTab($li)
    }

    selectPreviousTab() {
        let $li = this.$element.find('.selected').prev('li:not(.add)')
        if (!$li.length) $li = this.$element.find('li:not(.add)').eq(-1)
        this.selectTab($li)
    }

    closeTab($li = null) {
        if (this.$element.find('li').length <= 2)
            return
        if (!$li)
            $li = this.$element.find('.selected')

        let tab = $li.data('tab')
        let index = this.data.tabs.indexOf(tab)
        let nextIndex = Math.max(index - 1, 0)
        if (nextIndex == index) nextIndex++

        if ($li.hasClass('selected'))
            this.selectTab(this.$element.find('li').eq(nextIndex))

        this.data.tabs.splice(index, 1)
        setTimeout(() => this.render(), 200)

        // Animate

        let width = $li.width()
        $li.addClass('closing')
        $li.nextAll().css('left', -width + 'px')
    }

    addTab(tab) {
        this.data.tabs.push(tab)
        this.render()

        let $li = this.$element.find('li').eq(-2)
        $li.addClass('closing')

        this.selectTab($li)
        setTimeout(() => $li.removeClass('closing'), 10)
    }
}

module.exports = TabBar
