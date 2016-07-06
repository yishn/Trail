const $ = require('../modules/sprint')
const Component = require('./Component')

class Sidebar extends Component {
    render() {
        this.$element.empty()

        this.data.forEach(group => {
            var $label = $('<h2/>').text(group.name)
            this.$element.append($label)
        })
    }
}

module.exports = Sidebar
