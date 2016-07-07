const {execFile} = require('child_process')
const {join} = require('path')

let server = execFile(join(__dirname, 'bin/TrailShell.exe'))
let commands = []
let buffer = ''

server.stdout.on('data', function(data) {
    buffer += (data + '').replace(/\r/g, '')

    let start = buffer.indexOf('\n\n')

    while (start != -1) {
        let response = buffer.substr(0, start)
        buffer = buffer.substr(start + 2)

        if (commands.length > 0) {
            let command = commands.shift()
            command.callback(null, response)
        }

        start = buffer.indexOf('\n\n')
    }
})

exports.sendCommand = function(command, callback) {
    commands.push({command, callback})

    try {
        server.stdin.write(command + '\n')
    } catch(e) {
        callback(e)
    }

    return exports
}

exports.extractIcon = function(name, callback) {
    return exports.sendCommand(`extract-icon ${name}`, callback)
}
