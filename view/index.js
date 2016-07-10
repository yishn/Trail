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
        let component = new Column($column)
        $column.data('component', component)

        return $column
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

    loadSession: function(session = null) {
        if (!session)
            session = setting.get('tabbar.session')

        let $container = $('#column-view-container').empty()
        let tabs = session.map((item, i) => {
            return {
                name: basename(item.path),
                selected: i == 0,
                $columnView: this.createColumnView(item).appendTo($container)
            }
        })

        Trail.TabBar.data = {tabs}
    },

    createColumnView: function(info) {
        let {path, type = 'DirectoryColumn'} = info

        let ColumnView = require('./ColumnView')
        let Column = require(`../packages/${type}`)

        let $columnView = $('<div/>').addClass('column-view')
        let columns = new Column().getBreadcrumbs(path)
        let component = new ColumnView($columnView, {columns})

        return $columnView.data('component', component)
    },

    getCurrentColumnView: function() {
        return $('#tab-bar .selected')
            .data('tab')
            .$columnView
            .data('component')
    }
}

module.exports = Trail

$(document).ready(function() {
    Trail.initializeSidebar()
    Trail.initializeTabBar()
    Trail.fetchSidebarData((_, data) => Trail.Sidebar.data = data)
    Trail.loadSession()
})

require('./ipc')
