const app = require('electron').app
const shell = require('electron').shell
const dialog = require('electron').dialog
const ipcMain = require('electron').ipcMain
const setting = require('./modules/setting')

const BrowserWindow = require('electron').BrowserWindow
const Menu = require('electron').Menu

const windows = []

function newWindow(session, tabIndex = 0, info = {}) {
    if (!session)
        session = [{path: app.getPath('userData')}]

    let {height = 350, width = 800, top = 30, left = 30} = info

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

    window.webContents.on('did-finish-load', function() {
        window.webContents.send('load-session', session, tabIndex)
    }).on('new-window', function(e) {
        e.preventDefault()
    })

    window.on('closed', function() {
        window = null
    })

    window.loadURL(`file://${__dirname}/view/index.html`)

    if (setting.get('debug.dev_tools'))
        window.toggleDevTools()

    return window
}

function buildMenu(noWindows) {
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

ipcMain.on('new-window', function(e, session) { newWindow(session) })
ipcMain.on('build-menu', function(e) { buildMenu() })

app.on('window-all-closed', function() {
    if (process.platform != 'darwin') {
        app.quit()
    } else {
        buildMenu(true)
    }
})

app.on('ready', function() {
    let windowInfos = setting.get('session.windows')
    let tabIndices = setting.get('session.tab_indices')

    setting.get('session.tabs').forEach((session, i) => {
        newWindow(session, tabIndices[i], windowInfos[i])
    })

    if (process.argv.length >= 2) {
        newWindow([{path: process.argv[1]}])
    }
})

app.on('activate', function(e, hasVisibleWindows) {
    if (!hasVisibleWindows) newWindow()
})

process.on('uncaughtException', function(err) {
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
