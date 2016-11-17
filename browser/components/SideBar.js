const {h, Component} = require('preact')
const deepEqual = require('universal-deep-strict-equal')
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

    render({width, data}, {icons = {}}) {
        return h('section', {class: 'side-bar', style: {width}}, data.map(group =>
            h('div', {class: 'group'}, [
                h('h3', {}, group.label),

                h('ul', {}, group.locations.map(location => {
                    let l = Location.resolve(location)
                    let selected = Location.equals(l, Location.resolve(this.props.location))
                    let label = location.label || l.getName()

                    return h('li', {class: {selected}}, [
                        h('img', {src: icons[l.path] || './img/blank.svg'}),
                        h('span', {}, label)
                    ])
                }))
            ])
        ))
    }
}

module.exports = SideBar
