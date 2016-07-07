(function() {

const pathsep = require('path').sep

const $ = require('../modules/sprint')
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
        {name: 'Devices', items: []},
        {name: 'Favorites', items: []}
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
        })

        let favorites = setting.get('sidebar.favorites').map(({path}) => {
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
