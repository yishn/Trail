const {h, Component} = require('preact')
const Location = require('../../modules/location')
const ColumnView = require('./ColumnView')

class Main extends Component {
    render({location, settings}) {
        let l = Location.resolve(location)
        let breadcrumbs = l.getBreadcrumbs()

        return h('main', {style: {left: settings['sidebar.width'] + 3}}, [
            h(ColumnView, {breadcrumbs, settings})
        ])
    }
}

module.exports = Main
