const {ipcRenderer} = require('electron')
const {app} = require('electron').remote

const Trail = require('./index')

let menudata = {
    'new-window': () => ipcRenderer.send('new-window'),
    'new-tab': () => Trail.TabBar.emit('addbutton-click'),
    'close-tab': () => Trail.TabBar.closeTab(),
    'restart': () => { app.relaunch(); app.exit(0) }
}

ipcRenderer.on('menu-click', (evt, action) => menudata[action]())

ipcRenderer.on('load-session', (evt, session) => {
    Trail.loadSession(session)
})
