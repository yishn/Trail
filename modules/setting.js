const fs = require('fs')
const path = require('path')
const remote = require('electron').remote
const app = remote ? remote.app : require('electron').app

var directory = app.getPath('userData')
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

var settings = {}

var defaults = {
    'debug.dev_tools': false,
    'window.minheight': 400,
    'window.minwidth': 800,
    'window.height': 400,
    'window.width': 800
}

exports.load = function() {
    try {
        settings = JSON.parse(fs.readFileSync(exports.settingsPath, { encoding: 'utf8' }))
    } catch(e) {
        settings = {}
    }

    // Load default settings

    for (var key in defaults) {
        if (key in settings) continue
        settings[key] = defaults[key]
    }

    // Overwrite settings

    for (var overwriteKey in settings) {
        if (overwriteKey.indexOf('setting.overwrite.') != 0) continue

        var overwrites = settings[overwriteKey]
        if (!overwrites.length) continue

        for (var i = 0; i < overwrites.length; i++) {
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
