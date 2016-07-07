const $ = require('../modules/sprint')
const Component = require('./Component')

class ListColumn extends Component {
    render() {
        let scrollTop = this.$element.scrollTop()
        this.$element.css('width', this.data.width).empty()

        let $ul = $('<ol/>').appendTo(this.$element)

        this.data.items.forEach(item => {
            let $img = $('<img/>').attr('src', item.icon)
            let $li = $('<li/>').text(item.name).prepend($img)

            $ul.append($li)
        })

        this.$element.scrollTop(scrollTop)
    }
}

module.exports = ListColumn
