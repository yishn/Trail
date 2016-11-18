const {h, Component} = require('preact')
const Location = require('../../modules/location')
const Resizer = require('./Resizer')

class Column extends Component {
    constructor() {
        super()

        this.state = {
            scrollTop: 0,
            items: [],
            icons: [],
            selectedIndices: [],
            error: false
        }
    }

    componentWillReceiveProps() {
        let l = Location.resolve(this.props.location)

        l.list((err, items) => {
            if (err) {
                items = []
                this.setState({error: true})
            }

            let selectedIndices = []
            let i = items.findIndex(item => item.path == this.props.initialSelectedPath)
            if (i >= 0) selectedIndices.push(i)

            this.setState({items, selectedIndices})

            items.forEach((item, i) => {
                let {icons} = this.state

                item.icon((err, icon) => {
                    if (err) return

                    icons[i] = icon
                    this.setState({icons})
                })
            })
        })
    }

    render({location, width, minWidth}, {items, icons, selectedIndices, error}) {
        return h('section', {class: 'column-box', style: {width}}, [
            !error

            ? h('ol', {}, items.map((item, i) =>
                h('li', {class: {selected: selectedIndices.includes(i)}}, [
                    h('img', {src: icons[i] || 'img/blank.svg'}),
                    h('span', {title: item.label}, item.label)
                ])
            ))

            : h('div', {class: 'error'}),

            h(Resizer, {
                class: 'resizer',
                value: width,
                minValue: minWidth,
                type: 'horizontal',
                onUpdate: value => this.props.onResize(value)
            })
        ])
    }
}

module.exports = Column
