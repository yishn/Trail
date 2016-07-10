const fs = require('fs')
const {dirname, join} = require('path')

const $ = require('../modules/sprint')
const helper = require('../modules/helper')
const iconExtractor = require('../modules/icon-extractor')
const ListColumn = require('../view/ListColumn')

let transformSort = f => (x1, x2) => f(x1) < f(x2) ? -1 : +(f(x1) != f(x2))
let dirSort = (x1, x2) => {
    if (x1.folder == x2.folder)
        return transformSort(x => x.name.toLowerCase())(x1, x2)
    return +x2.folder - +x1.folder
}

class DirectoryColumn extends ListColumn {
    load(path, callback = () => {}) {
        fs.readdir(path, (err, files) => {
            if (err) return callback(err)

            let items = files.map(name => {
                let filepath = helper.trimTrailingSep(join(path, name))
                let folder = false
                try { folder = fs.lstatSync(filepath).isDirectory() }
                catch (_) {}

                return {
                    name,
                    path: filepath,
                    folder
                }
            }).sort(dirSort)

            this.data = {items}
            callback(err)

            items.forEach((item, i) => {
                let updateIcon = (err, img) => {
                    if (err) {
                        img = '../node_modules/octicons/build/svg/circle-slash.svg'
                    }

                    item.icon = img
                    this.$element.find('li').eq(i).find('img').attr('src', img)
                }

                if (item.folder) {
                    iconExtractor.get('folder', true, updateIcon)
                } else {
                    iconExtractor.get(item.path, true, updateIcon)
                }
            })
        })

        return this
    }

    getBreadcrumbs(path) {
        let parent = dirname(path)
        if (helper.trimTrailingSep(path) == helper.trimTrailingSep(parent))
            return [{path, type: this.constructor.name}]

        let dc = new DirectoryColumn($('<div/>'))
        let breadcrumbs = dc.getBreadcrumbs(parent)

        breadcrumbs.push({path, type: this.constructor.name})
        return breadcrumbs
    }
}

module.exports = DirectoryColumn
