const {execFile} = require('child_process')
const {join} = require('path')

let server = execFile(join(__dirname, 'bin/TrailShell.exe'))
let log = []
let commands = []
let buffer = ''

function logPush(str) {
    if (log.length > 100) log.shift()
    log.push(str)
}

server.stdout.on('data', function(data) {
    buffer += (data + '').replace(/\r/g, '')

    let start = buffer.indexOf('\n\n')

    while (start != -1) {
        let response = buffer.substr(0, start)
        buffer = buffer.substr(start + 2)

        if (commands.length > 0) {
            let command = commands.shift()
            logPush(response)
            command.callback(null, response)
        }

        start = buffer.indexOf('\n\n')
    }
})

exports.getLog = function(index = null) {
    if (index == null) return log
    return log[(index + log.length) % log.length]
}

exports.sendCommand = function(command, callback = () => {}) {
    commands.push({command, callback})

    try {
        logPush(command)
        server.stdin.write(command + '\n')
    } catch(e) {
        callback(e)
    }

    return exports
}

exports.extractIcon = function(name, small, callback) {
    let size = small ? 's' : 'l'
    return exports.sendCommand(`extract-icon ${size} ${name}`, callback)
}
