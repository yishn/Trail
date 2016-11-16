const fs = require('fs')
const {basename, join} = require('path')
const helper = require('../modules/helper')
const iconExtractor = require('../modules/icon-extractor')

class Location {
    constructor(path) {
        this.path = path
        this.type = 'directory'
    }

    getName() {
        let name = basename(this.path)

        if (name != '') return name
        return this.path
    }

    getBreadcrumbs() {
        let parent = dirname(this.path)
        if (this.path == helper.trimTrailingSep(parent))
            return [new Location(this.path)]

        let l = new Location(parent)
        let breadcrumbs = l.getBreadcrumbs()

        breadcrumbs.push(new Location(this.path))
        return breadcrumbs
    }

    getIcon(callback) {
        if (basename(this.path).trim() == '') {
            iconExtractor.get(this.path, true, callback)
        } else {
            iconExtractor.get('folder', true, callback)
        }
    }

    list(callback) {
        fs.readdir(this.path, (err, files) => {
            if (err) return callback(err)

            callback(null, files.map(file => file = {
                label: file,
                path: join(this.path, file)
            }))
        })
    }
}

Location.supports = function(path) {
    try {
        return fs.lstatSync(path).isDirectory()
    } catch(err) {}

    return false
}

module.exports = Location
