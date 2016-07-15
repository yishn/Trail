const app = require('electron').app
const shell = require('electron').shell
const dialog = require('electron').dialog
const ipcMain = require('electron').ipcMain
const setting = require('./modules/setting')

const BrowserWindow = require('electron').BrowserWindow
const Menu = require('electron').Menu

const windows = []

function newWindow(session, tabIndex = 0, info = null) {
    if (!session)
        session = [{path: app.getPath('userData')}]
    if (!info) {
        let windowInfos = setting.get('session.windows')
        info = JSON.parse(JSON.stringify(windowInfos[windowInfos.length - 1]))
        info.top += 30
        info.left += 30
    }

    let {height, width, top, left} = info
    let saveSettingsId

    let window = new BrowserWindow({
        icon: process.platform == 'linux' ? `${__dirname}/logo.png` : null,
        title: app.getName(),
        useContentSize: true,
        backgroundColor: '#F0F0F0',
        width,
        height,
        x: left,
        y: top,
        minWidth: setting.get('window.minwidth'),
        minHeight: setting.get('window.minheight')
    })

    windows.push(window)
    buildMenu()

    window.webContents.on('did-finish-load', () => {
        window.webContents.send('load-session', session, tabIndex)
    }).on('new-window', evt => {
        evt.preventDefault()
    })

    window.on('closed', () => {
        if (BrowserWindow.getAllWindows().length == 0) return

        clearTimeout(saveSettingsId)
        let index = windows.indexOf(window)

        window = null
        windows.splice(index, 1)
        setting.get('session.windows').splice(index, 1)
        setting.get('session.tabs').splice(index, 1)
        setting.get('session.tab_indices').splice(index, 1)

        saveSettingsId = setTimeout(() => setting.save(), 500)
    }).on('resize', () => {
        clearTimeout(saveSettingsId)

        let size = window.getContentSize()
        info.width = size[0]
        info.height = size[1]

        saveSettingsId = setTimeout(() => setting.save(), 500)
    }).on('move', () => {
        clearTimeout(saveSettingsId)

        let position = window.getPosition()
        info.left = position[0]
        info.top = position[1]

        saveSettingsId = setTimeout(() => setting.save(), 500)
    })

    window.loadURL(`file://${__dirname}/view/index.html`)

    if (setting.get('debug.dev_tools'))
        window.toggleDevTools()

    return {window, session, tabIndex, info}
}

function buildMenu() {
    let template = JSON.parse(JSON.stringify(require('./menu.json')))

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

ipcMain.on('new-window', (evt, session, tabIndex, info) => {
    var {session, tabIndex, info} = newWindow(session, tabIndex, info)

    setting.get('session.tabs').push(session)
    setting.get('session.tab_indices').push(tabIndex)
    setting.get('session.windows').push(info)
    setting.save()
})

ipcMain.on('build-menu', () => buildMenu() )

app.on('window-all-closed', () => {
    if (process.platform != 'darwin') {
        app.quit()
    } else {
        buildMenu(true)
    }
})

app.on('ready', () => {
    let windowInfos = setting.get('session.windows')
    let tabIndices = setting.get('session.tab_indices')

    setting.get('session.tabs').forEach((session, i) => {
        newWindow(session, tabIndices[i], windowInfos[i])
    })

    if (process.argv.length >= 2) {
        ipcMain.emit('new-window', null, [{path: process.argv[1]}])
    }
})

app.on('activate', (evt, hasVisibleWindows) => {
    if (!hasVisibleWindows) newWindow()
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
