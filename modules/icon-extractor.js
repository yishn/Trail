const {extname} = require('path')
const EventEmitter = require('events')

const {extractIcon} = require('./trail-shell')
const setting = require('./setting')

let emitter = new EventEmitter()
let busy = false
let inProgress = {}
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
            delete inProgress[id]

            emitter.emit(id, err, result)
        })
    }

    busy = false
}

module.exports = exports = function(options = {}) {
    exports.options = Object.assign({
        noCacheExts: []
    }, options)

    return exports
}

exports.get = function(name, small, callback = () => {}) {
    let ext = extname(name).toLowerCase()
    if (ext != '' && !exports.options.noCacheExts.includes(ext))
        name = ext

    let id = [name, small].join('|')
    if (id in cache) return callback(null, cache[id])

    if (!(id in inProgress)) {
        inProgress[id] = true
        queue.push([name, small])
        if (!busy) start()
    }

    emitter.setMaxListeners(emitter.getMaxListeners() + 1);
    emitter.once(id, (err, result) => {
        emitter.setMaxListeners(Math.max(emitter.getMaxListeners() - 1, 0));
        callback(err, result)
    })
}
