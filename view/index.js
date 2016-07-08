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
        })

        Trail.SidebarResizer.on('resized', () => {
            setting.set('sidebar.width', Trail.SidebarResizer.data.left)
        })

        Trail.Sidebar = new Sidebar($('#sidebar'), [
            {name: 'Favorites', items: []},
            {name: 'Devices', items: []}
        ])
    },

    getSidebarData: function(callback) {
        let {basename} = require('path')
        let drives = require('../modules/drives')

        drives.list((err, list) => {
            if (err) return callback(err)

            let devices = list.map(drive => {
                return {
                    name: drive.volumeName == null ? drive.name : `${drive.volumeName} (${drive.name})`,
                    path: drive.name
                }
            }).sort((x1, x2) => x1.path < x2.path ? -1 : +(x1.path != x2.path))

            let favorites = setting.get('sidebar.favorites').map(({path}) => {
                return {
                    name: basename(path),
                    path
                }
            }).sort((x1, x2) => x1.name < x2.name ? -1 : +(x1.name != x2.name))

            let next = () => {
                if (devices.some(x => !x.icon) || favorites.some(x => !x.icon))
                    return

                callback(null, [
                    {name: 'Favorites', items: favorites},
                    {name: 'Devices', items: devices}
                ])
            }

            iconExtractor.get('folder', (err, base64) => {
                favorites.forEach(item => {
                    item.icon = err ? transparentImg : `data:image/png;base64,${base64}`
                })

                next()
            })

            devices.forEach(item => {
                iconExtractor.get(item.path, (err, base64) => {
                    item.icon = err ? transparentImg : `data:image/png;base64,${base64}`
                    next()
                })
            })
        })
    }
}

$(document).ready(function() {
    Trail.initializeSidebar()
    Trail.getSidebarData((_, data) => Trail.Sidebar.data = data)
})

require('./ipc')(Trail)
