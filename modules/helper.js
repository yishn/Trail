exports.trimTrailingSep = function(str) {
    str = str.trim()

    let {sep} = require('path')
    if (str.substr(-1) == sep)
        str = str.substr(0, str.length - 1)

    return str
}

exports.clamp = function(x, min, max) {
    if (min > max) return x
    return Math.max(Math.min(x, max), min)
}

exports.arrayEqual = function(a, b) {
    return a == b || a.length == b.length && a.every((x, i) => x == b[i])
}

exports.compare = function(x, y) {
    return x < y ? -1 : +(x != y)
}

exports.transformCompare = function(f, compare = null) {
    if (!compare) compare = exports.compare
    return (x, y) => compare(f(x), f(y))
}

exports.lexicalCompare = function(x, y) {
    if (!x.length || !y.length) return x.length - y.length
    let compare = exports.transformCompare(z => z[0], x, y)

    if (compare != 0) return compare
    return exports.lexicalSort(x.slice(1), y.slice(1))
}
