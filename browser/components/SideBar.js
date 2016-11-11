const {h, Component} = require('preact')
const Location = require('../../modules/location')

class SideBar extends Component {
    render({data}) {
        return h('section', {class: 'side-bar'}, data.map(group =>
            h('div', {class: 'group'}, [
                h('h3', {}, group.label),

                h('ul', {}, group.locations.map(location => {
                    let l = Location.resolve(location)
                    let label = location.label || l.getName()

                    return h('li', {}, [
                        h('img', {
                            src: './img/blank.svg',
                            ref: img => {
                                if (!img) return

                                l.getIcon((err, icon) => {
                                    if (err) return
                                    img.src = icon
                                })
                            }
                        }),

                        label
                    ])
                }))
            ])
        ))
    }
}

module.exports = SideBar
