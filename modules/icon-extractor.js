const {extractIcon} = require('./trail-shell')
const EventEmitter = require('events')

let eventEmitter = new EventEmitter()
let busy = false
let cache = {}
let queue = []

let start = function() {
    if (busy) return
    busy = true

    while (queue.length > 0) {
        let request = queue.shift()
        let [name, small] = request
        let id = request.join('|')

        extractIcon(name, small, (err, result) => {
            cache[id] = result
            eventEmitter.emit(id, err, result)
        })
    }

    busy = false
}

exports.get = function(name, small, callback = () => {}) {
    let id = [name, small].join('|')
    if (id in cache) return callback(null, cache[id])

    queue.push([name, small])
    if (!busy) start()

    eventEmitter.once(id, callback)
}
