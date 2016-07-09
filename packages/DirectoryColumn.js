const fs = require('fs-extra')
const {join} = require('path')

const $ = require('../modules/sprint')
const ListColumn = require('../view/ListColumn')

class DirectoryColumn extends ListColumn {
    load(path, callback = () => {}) {
        fs.readdir(path, (err, files) => {
            if (err) return callback(err)

            let items = files.map(name => {
                return {
                    name
                }
            })

            this.data = {items}

            callback(err)
        })
    }
}

module.exports = DirectoryColumn
