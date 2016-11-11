exports.resolve = function({path, type = 'directory'}) {
    let Location = require(`../packages/${type}`)
    return new Location(path)
}
