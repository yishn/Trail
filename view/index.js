(function() {

const $ = require('../modules/sprint')
const setting = require('../modules/setting')

$(document).ready(function() {
    // Initialize split view

    var splitjs = require('split.js')
    var sidebarWidth = +setting.get('sidebar.width')

    splitjs(['#sidebar', 'main'], {
        sizes: [sidebarWidth, 100 - sidebarWidth],
        gutterSize: 2,
        snapOffset: 1
    })
})

})()
