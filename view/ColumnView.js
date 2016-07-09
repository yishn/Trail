const $ = require('../modules/sprint')
const Component = require('./Component')

class ColumnView extends Component {
    constructor($element, data) {
        super($element, data)

        this.$element.on('scroll', () => {
            let $resizer = $('#sidebar + .resizer')
            $resizer.toggleClass('shadow', this.$element.scrollLeft() != 0)
        })
    }

    render() {
        this.$element.empty()

        this.data.columns.forEach((column, i) => {
            if (!column.type)
                column.type = 'DirectoryColumn'

            let $column = $('<div/>').addClass('column').data('column', column)
            this.$element.append($column)

            let Column = require('../packages/' + column.type)
            let component = new Column($column)
            $column.data('component', component)

            component.load(column.path, err => {
                if (err || !$column.hasClass('list-column')) return

                // Spray breadcrumbs along the trail

                if (i + 1 == this.data.columns.length) {
                    $column.find('li').eq(0).trigger('mousedown')
                    this.$element.scrollLeft(0)
                    component.focus()
                    return
                }

                let filter = li => $(li).data('item').path == this.data.columns[i + 1].path
                let lis = $column.find('li').get().filter(filter)

                if (lis.length > 0) $(lis[0]).trigger('mousedown')
            })
        })

        return this
    }
}

module.exports = ColumnView
