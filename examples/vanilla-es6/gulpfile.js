/**
 * gulpfile.js
 */

var Fannypack = require('fannypack')

Fannypack.Config.root = {
  src: './src',
  dest: './build'
}

Fannypack.Config.js.src = 'scripts'
Fannypack.Config.js.dest = 'assets/js'
Fannypack.Config.js.entries = {
  main: ['./main.js']
}

Fannypack.Config.sass.src = 'styles'
Fannypack.Config.sass.dest = 'assets/css'

Fannypack.Config.html.src = ''
Fannypack.Config.browsersync = {
  server: {
    baseDir: Fannypack.Config.root.dest
  }
}

Fannypack.init()
