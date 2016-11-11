const {h, Component} = require('preact')
const Location = require('../../modules/location')

class SideBar extends Component {
    componentWillReceiveProps() {
        let icons = {}

        this.props.data.forEach(group => {
            group.locations.forEach(location => {
                let l = Location.resolve(location)

                l.getIcon((err, icon) => {
                    icons[l.path] = icon
                    this.setState({icons})
                })
            })
        })
    }

    render({data}, {icons = {}}) {
        return h('section', {class: 'side-bar'}, data.map(group =>
            h('div', {class: 'group'}, [
                h('h3', {}, group.label),

                h('ul', {}, group.locations.map(location => {
                    let l = Location.resolve(location)
                    let label = location.label || l.getName()

                    return h('li', {}, [
                        h('img', {src: icons[l.path] || './img/blank.svg'}),
                        label
                    ])
                }))
            ])
        ))
    }
}

module.exports = SideBar
