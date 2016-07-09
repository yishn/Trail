const EventEmitter = require('events')

class Component extends EventEmitter {
    constructor($element, data) {
        super()
        this.$element = $element
        this._data = data

        if (data) this.render()
    }

    get data() {
        return this._data
    }

    set data(data) {
        this._data = data
        this.render()
        this.emit('data-changed')
    }

    render() {
        return this
    }
}

module.exports = Component
