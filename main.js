const fs = require('fs')
const {app, shell, dialog, ipcMain, BrowserWindow, Menu} = require('electron')
const setting = require('./modules/setting')

const windows = []

function newWindow(info = null, overwriteLocation = null) {
    if (!info) {
        let windowInfos = setting.get('session.windows')
        info = Object.assign({}, windowInfos.slice(-1)[0])
        info.top += 30
        info.left += 30
        info.location = Object.assign({}, setting.get('session.homepage'))
    }

    if (overwriteLocation != null) {
        info.location = overwriteLocation
    }

    let {height, width, top, left, location} = info

    let window = new BrowserWindow({
        icon: process.platform == 'linux' ? `${__dirname}/logo.png` : null,
        title: app.getName(),
        useContentSize: true,
        backgroundColor: '#F0F0F0',
        width,
        height,
        x: left,
        y: top,
        maximizable: false,
        minWidth: setting.get('window.minwidth'),
        minHeight: setting.get('window.minheight'),
        show: false
    })

    windows.push(window)
    buildMenu()

    window.webContents.on('did-finish-load', () => {
        window.show()
        window.webContents.send('navigate', location)
    }).on('new-window', evt => {
        evt.preventDefault()
    })

    window.on('closed', () => {
        if (BrowserWindow.getAllWindows().length == 0) return

        let index = windows.indexOf(window)

        window = null
        windows.splice(index, 1)
        setting.get('session.windows').splice(index, 1)

        setting.save()
    }).on('resize', () => {
        if (window.isMinimized()) return

        let size = window.getContentSize()
        info.width = size[0]
        info.height = size[1]

        setting.save()
    }).on('move', () => {
        let position = window.getPosition()
        info.left = position[0]
        info.top = position[1]

        setting.save()
    }).on('focus', () => {
        setting.set('session.window_index', windows.indexOf(window))
    })

    window.loadURL(`file://${__dirname}/browser/index.html`)

    // if (setting.get('debug.dev_tools')) {
        window.toggleDevTools()
    // }

    return [window, info]
}

function buildMenu() {
    let template = JSON.parse(fs.readFileSync(`${__dirname}/menu.json`, 'utf8'))

    // Process menu

    let processMenu = items => {
        items.forEach(item => {
            if ('label' in item) {
                item.label = item.label
                .replace('{name}', app.getName())
                .replace('{version}', app.getVersion())
            }

            if ('action' in item) {
                let action = item.action

                item.click = () => {
                    let window = BrowserWindow.getFocusedWindow()
                    if (!window) return

                    window.webContents.send('menu-click', action)
                }

                delete item.action
            }

            if ('checked' in item) {
                item.type = 'checkbox'
                item.checked = !!setting.get(item.checked)
            }

            if ('submenu' in item) {
                processMenu(item.submenu)
            }
        })
    }

    processMenu(template)

    // Set menu

    let menu = Menu.buildFromTemplate(template)
    Menu.setApplicationMenu(menu)

    // Create dock menu

    if (process.platform == 'darwin') {
        app.dock.setMenu(Menu.buildFromTemplate([{
            label: 'New Window',
            click: () => newWindow()
        }]))
    }
}

ipcMain.on('new-window', (evt, ...args) => {
    let [window, info] = newWindow(...args)

    setting.get('session.windows').push(info)
    setting.save()
}).on('build-menu', () => {
    buildMenu()
}).on('window-index', evt => {
    let window = BrowserWindow.fromWebContents(evt.sender)
    evt.returnValue = windows.indexOf(window)
})

app.on('ready', () => {
    let windowInfos = setting.get('session.windows')
    let windowIndex = setting.get('session.window_index')

    windowInfos.forEach(info => newWindow(info))

    if (process.argv.length >= 2) {
        ipcMain.emit('new-window', null, {path: process.argv[1]})
        windowIndex = windows.length - 1
    }

    windows[windowIndex].focus()
}).on('activate', (evt, hasVisibleWindows) => {
    if (!hasVisibleWindows) newWindow()
}).on('window-all-closed', () => {
    app.quit()
})

process.on('uncaughtException', err => {
    dialog.showErrorBox(app.getName() + ' v' + app.getVersion(), [
        'Something weird happened. ',
        app.getName(),
        ' will shut itself down. ',
        'If possible, please report this on ',
        app.getName() + '’s repository on GitHub.\n\n',
        err.stack
    ].join(''))

    app.quit()
})
