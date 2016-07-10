const {ipcRenderer} = require('electron')
const {app} = require('electron').remote

const $ = require('../modules/sprint')

module.exports = function(Trail) {
    let menudata = {
        'new-window': () => ipcRenderer.send('new-window'),
        'new-tab': () => Trail.TabBar.emit('addbutton-click'),
        'close-tab': () => Trail.TabBar.closeTab(Trail.TabBar.$element.find('.selected')),
        'restart': () => { app.relaunch(); app.exit(0) }
    }

    ipcRenderer.on('menu-click', (e, action) => menudata[action]())
}
