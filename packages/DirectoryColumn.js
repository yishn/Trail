const fs = require('original-fs')
const {basename, dirname, join} = require('path')
const {shell} = require('electron')

const $ = require('../modules/sprint')
const helper = require('../modules/helper')
const iconExtractor = require('../modules/icon-extractor')

const Trail = require('../view/index')
const ListColumn = require('../view/ListColumn')

let transformSort = f => (x1, x2) => f(x1) < f(x2) ? -1 : +(f(x1) != f(x2))
let dirSort = (x1, x2) => {
    if (x1.folder == x2.folder)
        return transformSort(x => x.name.toLowerCase())(x1, x2)
    return +x2.folder - +x1.folder
}

class DirectoryColumn extends ListColumn {
    constructor($element, data) {
        super($element, data)

        this.on('item-dblclick', () => {
            let selected = this.data.items.filter(x => x.selected)
            let item = selected[0]

            if (selected.length != 1) return

            if (!item.folder && item.path) {
                shell.openItem(item.path)
            }
        })
    }

    load(path, callback = () => {}) {
        fs.readdir(path, (err, files) => {
            if (err) return callback(err)

            let items = files.map(name => {
                let filepath = helper.trimTrailingSep(join(path, name))
                let type = Trail.getColumnType(filepath)
                let folder = false
                try { folder = fs.lstatSync(filepath).isDirectory() } catch (err) {}
                let icon = callback => iconExtractor.get(folder ? 'folder' : filepath, true, callback)

                return {
                    name,
                    icon,
                    path: filepath,
                    type,
                    navigate: !!type,
                    folder
                }
            }).sort(dirSort)

            this.data = {items}
            callback(err)
        })

        return this
    }

    getTitle(path) {
        return basename(path)
    }

    getBreadcrumbs(path) {
        let parent = dirname(path)
        if (helper.trimTrailingSep(path) == helper.trimTrailingSep(parent))
            return [{path, type: this.constructor.name}]

        let breadcrumbs = this.getBreadcrumbs(parent)

        breadcrumbs.push({path, type: this.constructor.name})
        return breadcrumbs
    }
}

module.exports = DirectoryColumn
