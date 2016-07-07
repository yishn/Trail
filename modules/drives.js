const {exec} = require('child_process')

function getStartIndices(captions) {
    let prevSpace = true
    let indices = []

    for (let i = 0; i < captions.length; i++) {
        let char = captions[i]

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
    let values = []

    for (let i = 1; i < indices.length; i++) {
        let startIndex = indices[i - 1]
        let endIndex = indices[i]

        values.push(line.slice(startIndex, endIndex).trim())
    }

    return values
}

function normalize(caption) {
    let streak = 0
    let result = ''

    for (let i = 0; i < caption.length; i++) {
        let char = caption[i]
        if (char.toUpperCase() == char) streak++
        else break
    }

    if (streak > 1) streak--

    for (let i = 0; i < streak; i++) {
        result += caption[i].toLowerCase()
    }

    return result + caption.slice(streak)
}

exports.list = function(callback) {
    exec('wmic logicaldisk get', (err, result) => {
        if (err) return callback(err)

        let lines = result.trim().split('\r\r\n')
        let indices = getStartIndices(lines[0])
        let values = lines.map(line => getValues(indices, line))
        let captions = values[0]
        let list = values.slice(1).map(v => {
            let result = {}
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
