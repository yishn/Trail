class Component {
    constructor($element, data = {}) {
        this.$element = $element
        this._data = data
    }

    get data() {
        return this._data
    }

    set data(data) {
        this._data = data
        this.render()
    }

    render() {}
}

module.exports = Component
