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

            component.load(column.path, err => {
                if (err) return
                if (i + 1 == this.data.columns.length) {
                    $column.find('li').eq(0).trigger('mousedown')
                    return
                }

                let pathToSelect = this.data.columns[i + 1].path
                let lis = $column.find('li').get().filter(li => {
                    return $(li).data('item').path == pathToSelect
                })

                if (lis.length > 0) $(lis[0]).trigger('mousedown')
            })
        })
    }
}

module.exports = ColumnView
