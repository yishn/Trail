const shell = require('./trail-shell')
const EventEmitter = require('events')

let eventEmitter = new EventEmitter()
let busy = false
let cache = {}
let queue = []

let start = function() {
    if (busy) return
    busy = true

    while (queue.length > 0) {
        let name = queue.shift()

        shell.extractIcon(name, (err, result) => {
            cache[name] = result
            eventEmitter.emit(name, err, result)
        })
    }

    busy = false
}

exports.get = function(name, callback) {
    if (name in cache) return callback(null, cache[name])

    queue.push(name)
    if (!busy) start()

    eventEmitter.once(name, callback)
}
