const $ = require('../modules/sprint')
const iconExtractor = require('../modules/icon-extractor')
const setting = require('../modules/setting')

const Trail = {
    initializeSidebar: function() {
        let Sidebar = require('./Sidebar')
        let HorizontalResizer = require('./HorizontalResizer')

        Trail.SidebarResizer = new HorizontalResizer($('#sidebar + .resizer'), {
            left: setting.get('sidebar.width'),
            minLeft: setting.get('sidebar.minwidth')
        }).on('resized', () => {
            setting.set('sidebar.width', Trail.SidebarResizer.data.left)
        })

        Trail.Sidebar = new Sidebar($('#sidebar'), [
            {name: 'Favorites', items: []},
            {name: 'Devices', items: []}
        ])
    },

    getSidebarData: function(callback) {
        let {basename, sep} = require('path')
        let drives = require('../modules/drives')

        drives.list((err, list) => {
            if (err) return callback(err)

            let transformSort = f => (x1, x2) => f(x1) < f(x2) ? -1 : +(f(x1) != f(x2))

            let devices = list.map(drive => {
                let name = drive.name

                if (drive.volumeName != null)
                    name = `${drive.volumeName} (${name})`
                else if (drive.description != null)
                    name = `${drive.description} (${name})`

                return {
                    name,
                    path: drive.name + sep
                }
            }).sort(transformSort(x => x.path))

            let favorites = setting.get('sidebar.favorites').map(({path}) => {
                return {
                    name: basename(path),
                    path
                }
            }).sort(transformSort(x => x.name))

            let next = () => {
                if (devices.some(x => !x.icon) || favorites.some(x => !x.icon))
                    return

                callback(null, [
                    {name: 'Favorites', items: favorites},
                    {name: 'Devices', items: devices}
                ])
            }

            let fetch = (item, name) => {
                iconExtractor.get(name, true, (err, base64) => {
                    item.icon = err ? ' ' : `data:image/png;base64,${base64}`
                    next()
                })
            }

            favorites.forEach(item => fetch(item, 'folder'))
            devices.forEach(item => fetch(item, item.path))
        })
    }
}

$(document).ready(function() {
    Trail.initializeSidebar()
    Trail.getSidebarData((_, data) => Trail.Sidebar.data = data)
})

require('./ipc')(Trail)
