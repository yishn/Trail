(function() {

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

    sidebar = new Sidebar($('#sidebar'))
}

function getSidebarData(callback) {
    callback([
        {
            name: 'Devices',
            items: [
                {
                    name: 'System (C)'
                },
                {
                    name: 'Data (D)',
                    icon: 'usb'
                }
            ]
        },
        {
            name: 'Favorites',
            items: [] 
        }
    ])
}

$(document).ready(function() {
    initializeSidebar()
    getSidebarData(data => sidebar.data = data)
})

})()
