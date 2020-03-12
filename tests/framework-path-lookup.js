var fs = require('fs')
var frameworkNamePattern = /^[a-z-_\d]+$/

var excludedFrameworks = require('./excluded')

module.exports = function (names) {
  // collect together the framework names from each of the subfolders
  var list = fs.readdirSync('../examples/').map(function (folderName) {
    return { name: folderName, path: 'examples/' + folderName }
  })

  // apps that are not hosted at the root of their folder need to be handled explicitly
  var exceptions = [
    { name: 'chaplin-brunch', path: 'examples/chaplin-brunch/public' },
    { name: 'angular-dart', path: 'examples/angular-dart/web' },
    { name: 'duel', path: 'examples/duel/www' },
    { name: 'canjs_require', path: 'examples/canjs_require/' },
    { name: 'troopjs', path: 'examples/troopjs_require/' },
    { name: 'thorax_lumbar', path: 'examples/thorax_lumbar/public' }
  ]
  list = list.map(function (framework) {
    var exception = exceptions.filter(function (exFramework) {
      return exFramework.name === framework.name
    })
    return exception.length > 0 ? exception[0] : framework
  })

  // filter out any folders that are not frameworks (.e.g  hidden files)
  list = list.filter(function (framework) {
    return frameworkNamePattern.test(framework.name)
  })

  // filter out un-supported implementations
  list = list.filter(function (framework) {
    return excludedFrameworks.indexOf(framework.name) === -1
  })

  return list.filter(function (framework) {
    return [].concat(names).some(function (f) {
      return f === framework.name
    })
  })
}
