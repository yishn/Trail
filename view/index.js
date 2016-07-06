const $ = require('../modules/sprint')

;(function() {

const setting = require('../modules/setting')

function initializeSplitView() {
    var sidebarWidth = parseFloat(setting.get('sidebar.width'))
    $('#sidebar').css('width', sidebarWidth)
    $('#sidebar + .resizer').css('left', sidebarWidth)
    $('main').css('left', sidebarWidth + 2)
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
