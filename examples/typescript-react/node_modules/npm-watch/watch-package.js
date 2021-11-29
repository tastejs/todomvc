'use strict';

var path = require('path')
var spawn = require('child_process').spawn

var through = require('through2')

var npm = process.platform === 'win32' ? 'npm.cmd' : 'npm';
var nodemon = process.platform === 'win32' ? 'nodemon.cmd' : 'nodemon';
var clearCharacter = process.platform === 'win32' ? '\x1B[2J\x1B[0f' : '\x1B[2J\x1B[3J\x1B[H';

var pkgDir = '';
var stdin = null;

module.exports = function watchPackage(_pkgDir, exit, taskName) {
  pkgDir = _pkgDir;
  var pkg = require(path.join(pkgDir, 'package.json'))
  var processes = {}

  taskName = typeof taskName !== 'undefined' ? taskName.trim() : '';

  if (taskName === '') {
    console.info('No task specified. Will go through all possible tasks');
  }

  if (typeof pkg.watch !== 'object') {
    die('No "watch" config in package.json')
  }

  // send 'rs' commands to the right proc
  stdin = through(function (line, _, callback) {
    line = line.toString()
    var match = line.match(/^rs\s*(.*)/)
    if (!match) {
      console.log('Unrecognized input:', line)
      return callback()
    }

    if (match[1]) {
      var proc = processes[match[1]]
      if (!proc) {
        console.log('Couldn\'t find process:', match[1])
        return callback()
      }
      proc.stdin.write('rs\r\n')
      return callback();
    } else {
      Object.keys(processes).forEach(function (key) {
        processes[key].stdin.write('rs\r\n')
      })
      callback()
    }
  })

  stdin.stderr = through()
  stdin.stdout = through()

  if (taskName !== '') {
    if (!pkg.scripts[taskName]) {
      die('No such script "' + taskName + '"', 2)
    }
    startScript(taskName, pkg, processes);
  } else {
    // We only look for the global watch config here, since it is otherwise not relevant
    var setMaxListeners = null;
    if (typeof pkg.watchGlobalConfig === 'object') {
      setMaxListeners = pkg.watchGlobalConfig.setMaxListeners
    }
    var scriptsCount = Object.keys(pkg.watch).length;
  Object.keys(pkg.watch).forEach(function (script) {
    if (!pkg.scripts[script]) {
      die('No such script "' + script + '"', 2)
    }
    startScript(script, pkg, processes, setMaxListeners, scriptsCount + 1);
  })
  }

  return stdin

  function die(message, code) {
    process.stderr.write(message)

    if (stdin) {
      stdin.end()
      stdin.stderr.end()
      stdin.stdout.end()
    }
    exit(code || 1)
  }
}

function prefixer(prefix) {
  return through(function (line, _, callback) {
    line = line.toString()
    if (!line.match('to restart at any time')) {
      this.push(prefix + ' ' + line)
    }
    callback()
  })
}

function startScript(script, pkg, processes, setMaxListeners,  scriptsCount) {
  var exec = [npm, 'run', '-s', script].join(' ')
    var patterns = null
    var extensions = null
    var ignores = null
    var quiet = null
    var inherit = null
    var legacyWatch = null
    var delay = null
    var clearBuffer = null
    var verbose = null
    var runOnChangeOnly = null
  var silent = null;

    if (typeof pkg.watch[script] === 'object' && !Array.isArray(pkg.watch[script])) {
      patterns = pkg.watch[script].patterns
      extensions = pkg.watch[script].extensions
      ignores = pkg.watch[script].ignore
      quiet = pkg.watch[script].quiet
      inherit = pkg.watch[script].inherit
      legacyWatch = pkg.watch[script].legacyWatch
      delay = pkg.watch[script].delay
      clearBuffer = pkg.watch[script].clearBuffer
      verbose = pkg.watch[script].verbose
      runOnChangeOnly = pkg.watch[script].runOnChangeOnly
      silent = pkg.watch[script].silent
    } else {
      patterns = pkg.watch[script]
    }
    
    if (verbose && silent) {
      console.error('Silent and Verbose can not both be on')
    }
    patterns = [].concat(patterns).map(function (pattern) {
      return ['--watch', pattern]
    }).reduce(function (a, b) {
      return a.concat(b)
    })

    if (ignores) {
      ignores = [].concat(ignores).map(function (ignore) {
        return ['--ignore', ignore]
      }).reduce(function (a, b) {
        return a.concat(b)
      })
    }

    var args = extensions ? ['--ext', extensions] : []
    args = args.concat(patterns)
    if (ignores) { args = args.concat(ignores) }
    if (legacyWatch) { args = args.concat(['--legacy-watch']) }
    if (delay) { args = args.concat(['--delay', delay + 'ms']) }
    if (verbose) { args = args.concat(['-V']) }
    if (silent) { args = args.concat(['-q']) }
    if (runOnChangeOnly) { args = args.concat(['--on-change-only']) }
    if (setMaxListeners){
      process.setMaxListeners(scriptsCount)
      stdin.stdout.setMaxListeners(scriptsCount)
      stdin.stderr.setMaxListeners(scriptsCount)
    }
    args = args.concat(['--exec', exec])
    
    var proc = processes[script] = spawn(nodemon, args, {
      env: process.env,
      cwd: pkgDir,
      stdio: inherit === true ? ['pipe', 'inherit', 'inherit'] : 'pipe'
    })
    if (inherit === true) return;

    if (clearBuffer === true) {
      proc.stdout.pipe(
        through(function(line, _, callback) {
          line = line.toString();
          if (line.match('restarting due to changes...')) {
            stdin.stdout.write(clearCharacter);
          }
          callback()
        })
      )
    }

    if (quiet === true || quiet === 'true') {
      proc.stdout.pipe(stdin.stdout)
      proc.stderr.pipe(stdin.stderr)
    } else {
      proc.stdout.pipe(prefixer('[' + script + ']')).pipe(stdin.stdout)
      proc.stderr.pipe(prefixer('[' + script + ']')).pipe(stdin.stderr)
    }
}
