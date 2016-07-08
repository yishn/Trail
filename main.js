const app = require('electron').app
const shell = require('electron').shell
const dialog = require('electron').dialog
const ipcMain = require('electron').ipcMain
const setting = require('./modules/setting')

const BrowserWindow = require('electron').BrowserWindow
const Menu = require('electron').Menu

const windows = []

function newWindow(path) {
    let window = new BrowserWindow({
        icon: process.platform == 'linux' ? `${__dirname}/logo.png` : null,
        title: app.getName(),
        useContentSize: true,
        width: setting.get('window.width'),
        height: setting.get('window.height'),
        minWidth: setting.get('window.minwidth'),
        minHeight: setting.get('window.minheight')
    })

    windows.push(window)
    buildMenu()

    window.webContents.on('did-finish-load', function() {
        if (path) window.webContents.send('load-dir', path)
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
            click: newWindow.bind(null, null)
        }]))
    }
}

ipcMain.on('new-window', function(e, path) { newWindow(path) })
ipcMain.on('build-menu', function(e) { buildMenu() })

app.on('window-all-closed', function() {
    if (process.platform != 'darwin') {
        app.quit()
    } else {
        buildMenu(true)
    }
})

app.on('ready', function() {
    if (process.argv.length >= 2) {
        newWindow(process.argv[1])
    } else {
        newWindow()
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
