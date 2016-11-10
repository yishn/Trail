const {ipcRenderer, remote} = require('electron')
const {app} = require('electron').remote

// Handle menu events

ipcRenderer.on('menu-click', (evt, action) => {
    let data = {
        'new-window': () => {
            ipcRenderer.send('new-window')
        },
        'restart': () => {
            app.relaunch()
            app.quit()
        }
    }

    data[action]()
})
