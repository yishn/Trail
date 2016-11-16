const fs = require('fs')
const helper = require('./helper')

function normalize(path) {
    let {normalize} = require('path')
    let result = normalize(path)

    if (result.slice(-1) == '.')
        return result.slice(0, result.length - 1)

    return result
}

exports.resolve = function({path, type = null}) {
    let Location = null

    if (type == null) {
        let result = fs.readdirSync(normalize(`${__dirname}/../packages/`))

        for (let i = 0; i < result.length; i++) {
            if (result[i].slice(-3) != '.js') continue

            Location = require(`../packages/${result[i]}`)
            if (Location.supports(path)) break
        }
    } else {
        Location = require(`../packages/${type}`)
    }

    if (Location == null) return null

    return new Location(helper.trimTrailingSep(normalize(path)))
}
