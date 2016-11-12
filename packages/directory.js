const path = require('path')
const helper = require('../modules/helper')
const iconExtractor = require('../modules/icon-extractor')

class Location {
    constructor(path) {
        this.path = path
        this.type = 'directory'
    }

    getName() {
        let basename = path.basename(this.path)

        if (basename != '') return basename
        return this.path
    }

    getIcon(callback) {
        if (path.basename(this.path).trim() == '') {
            iconExtractor.get(this.path, true, callback)
        } else {
            iconExtractor.get('folder', true, callback)
        }
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
}

module.exports = Location
