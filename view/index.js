(function() {

const pathsep = require('path').sep

const $ = require('../modules/sprint')
const setting = require('../modules/setting')

var sidebar, sidebarResizer

function initializeSidebar() {
    var Sidebar = require('./Sidebar')
    var HorizontalResizer = require('./HorizontalResizer')

    sidebarResizer = new HorizontalResizer($('#sidebar + .resizer'), {
        left: setting.get('sidebar.width'),
        minLeft: setting.get('sidebar.minwidth')
    })

    sidebarResizer.on('resized', () => {
        setting.set('sidebar.width', sidebarResizer.data.left)
    })

    sidebar = new Sidebar($('#sidebar'), [
        {name: 'Devices', items: []},
        {name: 'Favorites', items: []}
    ])
}

function getSidebarData(callback) {
    var drives = require('../modules/drives')

    drives.list((err, list) => {
        var devices = list.map(drive => {
            return {
                name: drive.volumeName == null ? drive.name : `${drive.volumeName} (${drive.name})`,
                path: drive.name + pathsep,
                icon: drive.driveType
            }
        })

        var favorites = setting.get('sidebar.favorites').map(({path}) => {
            return {
                name: require('path').basename(path),
                path,
                icon: 'folder'
            }
        })

        callback([
            {name: 'Devices', items: devices},
            {name: 'Favorites', items: favorites}
        ])
    })
}

$(document).ready(function() {
    initializeSidebar()
    getSidebarData(data => sidebar.data = data)
})

})()
