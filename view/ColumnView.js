const $ = require('../modules/sprint')
const Component = require('./Component')

class ColumnView extends Component {
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
                // Spray breadcrumbs along the trail

                if (err) return
                if (i + 1 == this.data.columns.length) {
                    $column.find('li').eq(0).trigger('mousedown')
                    component.focus()
                    return
                }

                let pathToSelect = this.data.columns[i + 1].path
                let lis = $column.find('li').get().filter(li => {
                    return $(li).data('item').path == pathToSelect
                })

                if (lis.length > 0) $(lis[0]).trigger('mousedown')
            })
        })

        return this
    }
}

module.exports = ColumnView
