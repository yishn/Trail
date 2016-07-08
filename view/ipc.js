const {ipcRenderer} = require('electron')
const {app} = require('electron').remote

module.exports = function(Trail) {
    let menudata = {
        'new-window': () => ipcRenderer.send('new-window'),
        'restart': () => { app.relaunch(); app.exit(0) }
    }

    ipcRenderer.on('menu-click', (e, action) => menudata[action]())
}
