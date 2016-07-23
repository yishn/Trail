const fs = require('original-fs')
const {basename, dirname, join} = require('path')
const {shell} = require('electron')

const $ = require('../modules/sprint')
const iconExtractor = require('../modules/icon-extractor')
const helper = require('../modules/helper')

const Trail = require('../view/index')
const ListColumn = require('../view/ListColumn')

let itemTransform = x => [x.name.toLowerCase(), -x.folder]
let dirCompare = (x, y) => helper.transformCompare(itemTransform, x, y, helper.lexicalCompare)

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

    fetchItems(path, callback = () => {}) {
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
            }).sort(dirCompare)

            callback(null, items)
        })

        return this
    }

    getTitle(path) {
        let title = basename(path)
        if (title.trim() == '')
            title = helper.trimTrailingSep(path)

        return title
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
