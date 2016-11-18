const {h, Component} = require('preact')
const Location = require('../../modules/location')
const Resizer = require('./Resizer')

class Column extends Component {
    constructor() {
        super()

        this.itemHeight = 25

        this.state = {
            scrollPercentage: 0,
            height: 0,

            items: [],
            icons: [],
            selectedIndices: [],
            error: false
        }
    }

    componentWillReceiveProps() {
        let l = Location.resolve(this.props.location)

        l.list((err, items) => {
            if (err) return this.setState({items: [], error: true})

            let selectedIndices = []
            let i = items.findIndex(item => item.path == this.props.initialSelectedPath)
            if (i >= 0) selectedIndices.push(i)

            this.setState({items, selectedIndices})
            this.updateScrollState()

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

    componentDidMount() {
        let ol = this.element.querySelector('ol')
        ol.addEventListener('scroll', () => this.updateScrollState())
        this.updateScrollState()
    }

    updateScrollState() {
        let ol = this.element.querySelector('ol')
        let height = ol.offsetHeight
        let {scrollTop, scrollHeight} = ol

        this.setState({
            scrollPercentage: scrollTop / scrollHeight,
            height
        })
    }

    render({location, width, minWidth}, {items, icons, selectedIndices, error}) {
        let itemsCount = Math.ceil(this.state.height / this.itemHeight)
        let startIndex = Math.floor(this.state.scrollPercentage * (items.length - 1))
        let endIndex = startIndex + itemsCount

        return h('section', {
            class: 'column-box',
            style: {width},
            ref: el => this.element = el
        }, [
            !error

            ? h('ol', {}, [
                items.map((item, i) => {
                    if (i < startIndex || i > endIndex) return

                    return h('li', {
                        class: {selected: selectedIndices.includes(i)},
                        style: {top: i * this.itemHeight}
                    }, [
                        h('img', {src: icons[i] || 'img/blank.svg'}),
                        h('span', {title: item.label}, item.label)
                    ])
                }),

                h('li', {class: 'placeholder', style: {height: items.length * this.itemHeight}})
            ])

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
