const {ipcRenderer} = require('electron')

module.exports = function(Trail) {
    let menudata = {
        'new-window': () => ipcRenderer.send('new-window')
    }

    ipcRenderer.on('menu-click', (e, action) => menudata[action]())
}
