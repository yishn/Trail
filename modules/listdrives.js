const {exec} = require('child_process')

function getStartIndices(captions) {
    var prevSpace = true
    var indices = []

    for (let i = 0; i < captions.length; i++) {
        var char = captions[i]

        if (/\s/.test(char)) {
            prevSpace = true
        } else {
            if (prevSpace) indices.push(i)
            prevSpace = false
        }
    }

    indices.push(captions.length)
    return indices
}

function getValues(indices, line) {
    var values = []

    for (let i = 1; i < indices.length; i++) {
        var startIndex = indices[i - 1]
        var endIndex = indices[i]

        values.push(line.slice(startIndex, endIndex).trim())
    }

    return values
}

function normalize(caption) {
    var streak = 0
    var result = ''

    for (let i = 0; i < caption.length; i++) {
        var char = caption[i]
        if (char.toUpperCase() == char) streak++
        else break
    }

    if (streak > 1) streak--

    for (let i = 0; i < streak; i++) {
        result += caption[i].toLowerCase()
    }

    return result + caption.slice(streak)
}

module.exports = function(callback) {
    exec('wmic logicaldisk get', (err, result) => {
        if (err) return callback(err)

        var lines = result.trim().split('\r\r\n')
        var indices = getStartIndices(lines[0])
        var values = lines.map(line => getValues(indices, line))
        var captions = values[0]
        var list = values.slice(1).map(v => {
            var result = {}
            captions.forEach((caption, i) => result[normalize(caption)] = v[i])
            return result
        })

        list.forEach(drive => {
            for (let key in drive) {
                if (!drive[key].length) {
                    drive[key] = null
                } else if (!isNaN(drive[key])) {
                    drive[key] = +drive[key]
                } else if (['false', 'true'].indexOf(drive[key].toLowerCase()) >= 0) {
                    drive[key] = drive[key].toLowerCase() == 'TRUE' ? true : false
                }
            }

            if (drive.driveType == 0) drive.driveType = 'unknown'
            else if (drive.driveType == 1) drive.driveType = 'noroot'
            else if (drive.driveType == 2) drive.driveType = 'removable'
            else if (drive.driveType == 3) drive.driveType = 'local'
            else if (drive.driveType == 4) drive.driveType = 'network'
            else if (drive.driveType == 5) drive.driveType = 'cd'
            else if (drive.driveType == 6) drive.driveType = 'ram'
        })

        callback(err, list)
    })
}
