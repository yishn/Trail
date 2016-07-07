(function() {

const pathsep = require('path').sep

const $ = require('../modules/sprint')
const shell = require('../modules/trail-shell')
const setting = require('../modules/setting')

let sidebar, sidebarResizer

function initializeSidebar() {
    let Sidebar = require('./Sidebar')
    let HorizontalResizer = require('./HorizontalResizer')

    sidebarResizer = new HorizontalResizer($('#sidebar + .resizer'), {
        left: setting.get('sidebar.width'),
        minLeft: setting.get('sidebar.minwidth')
    })

    sidebarResizer.on('resized', () => {
        setting.set('sidebar.width', sidebarResizer.data.left)
    })

    sidebar = new Sidebar($('#sidebar'), [
        {name: 'Favorites', items: []},
        {name: 'Devices', items: []}
    ])
}

function getSidebarData(callback) {
    let drives = require('../modules/drives')

    drives.list((err, list) => {
        let devices = list.map(drive => {
            return {
                name: drive.volumeName == null ? drive.name : `${drive.volumeName} (${drive.name})`,
                path: drive.name + pathsep,
                icon: drive.driveType
            }
        }).sort((x1, x2) => x1.path < x2.path ? -1 : +(x1.path != x2.path))

        let favorites = setting.get('sidebar.favorites').map(({path}) => {
            return {
                name: require('path').basename(path),
                path,
                icon: 'folder'
            }
        }).sort((x1, x2) => x1.name < x2.name ? -1 : +(x1.name != x2.name))

        callback([
            {name: 'Favorites', items: favorites},
            {name: 'Devices', items: devices}
        ])
    })
}

$(document).ready(function() {
    initializeSidebar()
    getSidebarData(data => sidebar.data = data)
})

})()
