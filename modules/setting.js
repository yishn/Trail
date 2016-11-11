const fs = require('original-fs')
const path = require('path')
const EventEmitter = require('events')
const {app} = require('electron')

let directory = app.getPath('userData')
try { fs.mkdirSync(directory) } catch(err) {}

exports.events = new EventEmitter().setMaxListeners(0)
exports.settingsPath = path.join(directory, 'settings.json')

let settings = {}

let defaults = {
    'columnview.colminwidth': 100,
    'columnview.colwidth': 200,
    'debug.dev_tools': false,
    'iconextractor.nocache_ext': ['.exe', '.ico', '.lnk', '.msi', '.cur', '.ani'],
    'session.homepage': {path: app.getPath('userData')},
    'session.windows': [{
        height: 350,
        width: 800,
        top: 30,
        left: 30,
        location: {path: app.getPath('userData')}
    }],
    'session.window_index': 0,
    'sidebar.favorites': [{path: app.getPath('userData')}],
    'sidebar.minwidth': 100,
    'sidebar.width': 160,
    'window.minheight': 100,
    'window.minwidth': 400
}

exports.load = function() {
    try {
        settings = JSON.parse(fs.readFileSync(exports.settingsPath, 'utf8'))
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
    exports.events.emit('change')
    return exports
}

exports.get = function(key = null) {
    if (key == null) return settings
    if (key in settings) return settings[key]
    return null
}

exports.set = function(key, value) {
    if (typeof key == 'object') Object.assign(settings, key)
    else settings[key] = value
    return exports.save()
}

exports.load()
