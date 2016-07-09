const $ = require('../modules/sprint')
const Component = require('./Component')

class ColumnView extends Component {
    render() {
        this.$element.empty()

        this.data.columns.forEach(column => {
            if (!column.type)
                column.type = 'DirectoryColumn'

            let $column = $('<div/>').addClass('column').data('column', column)
            this.$element.append($column)

            var Column = require('../packages/' + column.type)
            let component = new Column($column)
            component.load(column.path)
        })
    }
}

module.exports = ColumnView
