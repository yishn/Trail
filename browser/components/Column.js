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

    componentDidUpdate({location: prevLocation}) {
        let l1 = Location.resolve(prevLocation)
        let l2 = Location.resolve(this.props.location)

        if (!Location.equals(l1, l2))
            load()
    }

    componentDidMount() {
        // Manage scroll state

        window.addEventListener('resize', () => this.updateScrollState())
        this.ol.addEventListener('scroll', () => this.updateScrollState())
        this.updateScrollState()

        // Focus indicator

        this.element.addEventListener('click', () => this.focus())
        this.focusIndicator.addEventListener('focus', () => this.focus())

        this.load()
    }

    load() {
        let l = Location.resolve(this.props.location)

        l.list((err, items) => {
            if (err) return this.setState({items: [], error: true})

            let selectedIndices = []
            let i = items.findIndex(item => this.props.breadcrumbs.some(x => x.path == item.path))
            if (i >= 0) selectedIndices.push(i)

            this.setState({items, icons: [], selectedIndices})
            this.updateScrollState()

            if (i >= 0) this.scrollItemIntoView(i)
        })
    }

    focus() {
        if (this.props.focused) return

        this.focusIndicator.focus()
        this.props.onFocus(this)
    }

    scrollItemIntoView(index) {
        let {scrollTop} = this.ol
        let {height} = this.state
        let itemTop = index * this.itemHeight

        if (itemTop < scrollTop) {
            this.ol.scrollTop = itemTop
        } else if (itemTop + this.itemHeight > scrollTop + height) {
            this.ol.scrollTop = itemTop - height + this.itemHeight
        }

        this.updateScrollState()
    }

    updateScrollState() {
        let {scrollTop, scrollHeight, offsetHeight: height} = this.ol

        this.setState({
            scrollPercentage: scrollTop / scrollHeight,
            height
        })

        // Get icons

        let [startIndex, endIndex] = this.getStartEndIndices()

        this.state.items.forEach((item, i) => {
            if (i < startIndex || i > endIndex) return

            let {icons} = this.state
            if (icons[i] != null) return

            item.icon((err, icon) => {
                if (err) return

                icons[i] = icon
                this.setState({icons})
            })
        })
    }

    getStartEndIndices() {
        let itemsCount = Math.ceil(this.state.height / this.itemHeight)
        let startIndex = Math.floor(this.state.scrollPercentage * (this.state.items.length - 1))
        let endIndex = startIndex + itemsCount

        return [startIndex, endIndex]
    }

    render({breadcrumbs, width, focused}, {items, icons, selectedIndices, error}) {
        let [startIndex, endIndex] = this.getStartEndIndices()

        return h('section', {
            class: {'column-box': true, focused},
            style: {width},
            ref: el => this.element = el
        }, [
            !error

            ? h('ol', {ref: el => this.ol = el}, [
                items.map((item, i) => {
                    if (i < startIndex || i > endIndex) return

                    return h('li', {
                        class: {
                            selected: selectedIndices.includes(i),
                            opened: breadcrumbs.some(x => x.path == item.path)
                        },
                        style: {
                            top: i * this.itemHeight
                        }
                    }, [
                        h('img', {src: icons[i] || 'img/blank.svg'}),
                        h('span', {title: item.label}, item.label)
                    ])
                }),

                h('li', {class: 'placeholder', style: {height: items.length * this.itemHeight}})
            ])

            : h('div', {class: 'error'}),

            h('input', {class: 'focus-indicator', ref: el => this.focusIndicator = el}),

            h(Resizer, {
                class: 'resizer',
                value: width,
                minValue: this.props.minWidth,
                type: 'horizontal',
                onUpdate: value => this.props.onResize(value)
            })
        ])
    }
}

module.exports = Column
