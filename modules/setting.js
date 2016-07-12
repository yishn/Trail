const fs = require('original-fs')
const path = require('path')
const {remote} = require('electron')
const app = remote ? remote.app : require('electron').app

let directory = app.getPath('userData')
try { fs.mkdirSync(directory) } catch(e) {}

exports.settingsPath = path.join(directory, 'settings.json')
exports.stylesPath = path.join(directory, 'styles.css')

try {
    fs.accessSync(exports.stylesPath, fs.R_OK)
} catch(e) {
    fs.writeFileSync(
        exports.stylesPath,
        '/* This stylesheet is loaded when ' + app.getName() + ' starts up. */'
    )
}

let settings = {}

let defaults = {
    'columnview.colminwidth': 100,
    'columnview.colwidth': 200,
    'debug.dev_tools': false,
    'iconextractor.nocache_ext': [ ".exe", ".ico", ".lnk", ".msi", ".cur", ".ani" ],
    'tabbar.session': [{path: app.getPath('userData')}],
    'sidebar.favorites': [{path: app.getPath('userData')}],
    'sidebar.minwidth': 100,
    'sidebar.width': 160,
    'window.minheight': 100,
    'window.minwidth': 400,
    'window.height': 350,
    'window.width': 800
}

exports.load = function() {
    try {
        settings = JSON.parse(fs.readFileSync(exports.settingsPath, {encoding: 'utf8'}))
    } catch(e) {
        settings = {}
    }

    // Load default settings

    for (let key in defaults) {
        if (key in settings) continue
        settings[key] = defaults[key]
    }

    // Overwrite settings

    for (let overwriteKey in settings) {
        if (overwriteKey.indexOf('setting.overwrite.') != 0) continue

        let overwrites = settings[overwriteKey]
        if (!overwrites.length) continue

        for (let i = 0; i < overwrites.length; i++) {
            settings[overwrites[i]] = defaults[overwrites[i]]
        }

        settings[overwriteKey] = []
    }

    exports.save()
}

exports.save = function() {
    fs.writeFileSync(exports.settingsPath, JSON.stringify(settings, null, '  '))
    exports
}

exports.get = function(key) {
    if (key in settings) return settings[key]
    if (key in defaults) return defaults[key]
    return null
}

exports.set = function(key, value) {
    settings[key] = value
    exports.save()
}

exports.load()
