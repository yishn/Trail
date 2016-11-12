const helper = require('./helper')

function normalize(path) {
    let {normalize} = require('path')
    let result = normalize(path)

    if (result.slice(-1) == '.')
        return result.slice(0, result.length - 1)

    return result
}

exports.resolve = function({path, type = 'directory'}) {
    let Location = require(`../packages/${type}`)
    return new Location(helper.trimTrailingSep(normalize(path)))
}
