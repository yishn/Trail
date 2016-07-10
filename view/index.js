const $ = require('../modules/sprint')
const helper = require('../modules/helper')
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

    getSidebarData: function(callback = () => {}) {
        let {basename} = require('path')
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
                    path: helper.trimTrailingSep(drive.name)
                }
            }).sort(transformSort(x => x.path.toLowerCase()))

            let favorites = setting.get('sidebar.favorites').map(({path}) => {
                return {
                    name: basename(path),
                    path: helper.trimTrailingSep(path)
                }
            }).sort(transformSort(x => x.name.toLowerCase()))

            let next = () => {
                if (devices.some(x => !x.icon) || favorites.some(x => !x.icon))
                    return

                callback(null, [
                    {name: 'Favorites', items: favorites},
                    {name: 'Devices', items: devices}
                ])
            }

            let fetch = (item, name) => {
                iconExtractor.get(name, true, (err, img) => {
                    item.icon = err ? ' ' : img
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

    let ColumnView = require('./ColumnView')
    let DirectoryColumn = require('../packages/DirectoryColumn')
    let columns = new DirectoryColumn().getTrail(require('electron').remote.app.getPath('userData'))

    let cv = new ColumnView($('main .column-view'), {columns})

    let TabBar = require('./TabBar')
    let tb = new TabBar($('main .tab-bar'), {
        tabs: [
            {name: 'Trail', selected: true},
            {name: 'Hello World!'},
            {name: 'Blah'}
        ]
    })
})

require('./ipc')(Trail)
