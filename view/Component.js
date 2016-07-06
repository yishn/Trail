const EventEmitter = require('events')

class Component extends EventEmitter {
    constructor($element, data = {}) {
        super()
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
