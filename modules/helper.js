exports.trimTrailingSep = function(str) {
    str = str.trim()

    let {sep} = require('path')
    if (str.substr(-1) == sep)
        str = str.substr(0, str.length - 1)

    return str
}
