const $ = require('sprint-js')

const setting = require('../modules/setting')

$(document).ready(function() {
    var splitjs = require('split.js')
    var sidebarWidth = +setting.get('sidebar.width')

    splitjs(['#sidebar', 'main'], {
        sizes: [sidebarWidth, 100 - sidebarWidth],
        gutterSize: 4,
        snapOffset: 20
    })
})
