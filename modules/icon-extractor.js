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

exports.get = function(name, small, callback = () => {}) {
    let ext = extname(name).toLowerCase()
    if (ext != '' && setting.get('iconextractor.nocache_ext').indexOf(ext) < 0)
        name = ext

    let id = [name, small].join('|')
    if (id in cache) return callback(null, cache[id])

    if (!(id in inProgress)) {
        inProgress[id] = true
        queue.push([name, small])
        if (!busy) start()
    }

    emitter.once(id, (err, result) => {
        callback(err, result)
    })
}
