const {h, Component} = require('preact')

class SideBar extends Component {
    render({data}) {
        return h('section', {class: 'side-bar'}, data.map(group =>
            h('div', {class: 'group'}, [
                h('h3', {}, group.label),

                h('ul', {}, group.locations.map(location =>
                    h('li', {}, location.path)
                ))
            ])
        ))
    }
}

module.exports = SideBar
