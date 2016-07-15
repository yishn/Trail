const fs = require('original-fs')
const {basename} = require('path')

const $ = require('../modules/sprint')
const helper = require('../modules/helper')
const iconExtractor = require('../modules/icon-extractor')
const setting = require('../modules/setting')

const Trail = {
    createColumn: function(info) {
        let {path, type = 'DirectoryColumn'} = info
        let $column = $('<div/>').addClass('column').data('column', info)

        let Column = require('../packages/' + type)
        let component = new Column($column, {})
        $column.data('component', component)

        return $column
    },

    getColumnType: function(path) {
        try {
            let stat = fs.lstatSync(path)
            if (stat.isDirectory()) return 'DirectoryColumn'
        } catch(err) {}

        return null
    },

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

        Trail.Sidebar.on('item-click', item => {
            Trail.getCurrentColumnView().navigateTo(item)
        })
    },

    initializeTabBar: function() {
        let TabBar = require('./TabBar')

        Trail.TabBar = new TabBar($('#tab-bar'), {tabs: []})

        Trail.TabBar.on('tab-selected', tab => {
            $('#column-view-container .column-view').addClass('hide')

            let component = tab.$columnView
                .removeClass('hide')
                .trigger('scroll')
                .find('.focused')
                .data('component')

            if (component) component.focus()
        }).on('addbutton-click', () => {
            let {$columnView} = $('#tab-bar .selected').data('tab')
            let {columns} = $columnView.data('component').data
            let info = columns[columns.length - 1]
            let $container = $('#column-view-container')

            Trail.TabBar.addTab({
                name: basename(info.path),
                $columnView: this.createColumnView(info).appendTo($container)
            })
        })
    },

    fetchSidebarData: function(callback = () => {}) {
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
    },

    loadSession: function(session) {
        let $container = $('#column-view-container').empty()
        let tabs = session.map((item, i) => {
            let $columnView = this.createColumnView(item).appendTo($container)
            let name = $columnView.data('component').getTitle()

            return {
                name,
                selected: i == 0,
                $columnView
            }
        })

        Trail.TabBar.data = {tabs}
    },

    createColumnView: function(info) {
        let ColumnView = require('./ColumnView')
        let $columnView = $('<div/>').addClass('column-view')
        let component = new ColumnView($columnView)

        component.navigateTo(info)
        component.on('navigated', () => {
            let tab = Trail.TabBar.getSelectedTab()
            if (!tab) return

            tab.name = component.getTitle()
            Trail.TabBar.render()
        })

        return $columnView.data('component', component)
    },

    getCurrentColumnView: function() {
        return Trail.TabBar
            .getSelectedTab()
            .$columnView
            .data('component')
    }
}

module.exports = Trail

$(document).ready(function() {
    Trail.initializeSidebar()
    Trail.initializeTabBar()
    Trail.fetchSidebarData((_, data) => Trail.Sidebar.data = data)
})

require('./ipc')
