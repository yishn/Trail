const $ = require('../modules/sprint')

;(function() {

const setting = require('../modules/setting')

function initializeSplitView() {
    var splitjs = require('split.js')
    var width = parseFloat($('#root').css('width'))
    var sidebarWidth = parseFloat(setting.get('sidebar.width'))

    splitjs(['#sidebar', 'main'], {
        sizes: [(sidebarWidth - 1) + 'px', (width - sidebarWidth - 1) + 'px'],
        gutterSize: 2,
        snapOffset: 1
    })
}

function initializeSidebar() {
    var $element = $('#sidebar')
    var Sidebar = require('./Sidebar')
    var component = new Sidebar($element)
    $element.data('component', component)

    component.data = [
        {
            name: 'Group1'
        },
        {
            name: 'Group2'
        }
    ]
}

$(document).ready(function() {
    initializeSplitView()
    initializeSidebar()
})

})()
