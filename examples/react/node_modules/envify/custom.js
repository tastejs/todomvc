var through = require('through')
  , jstransform = require('jstransform')
  , createVisitors = require('./visitors')

var processEnvPattern = /\bprocess\.env\b/

module.exports = function(rootEnv) {
  rootEnv = rootEnv || process.env || {}

  return function envify(file, argv) {
    if (/\.json$/.test(file)) return through()

    var buffer = []
    argv = argv || {}

    return through(write, flush)

    function write(data) {
      buffer.push(data)
    }

    function flush() {
      var source = buffer.join('')

      if (processEnvPattern.test(source)) {
        try {
          var visitors = createVisitors([argv, rootEnv])
          source = jstransform.transform(visitors, source).code
        } catch(err) {
          return this.emit('error', err)
        }
      }

      this.queue(source)
      this.queue(null)
    }
  }
}
