#!/usr/bin/env node
'use strict';
var path = require('path')
var windows = process.platform === 'win32'
var pathVarName = (windows && !('PATH' in process.env)) ? 'Path' : 'PATH'

process.env[pathVarName] += path.delimiter + path.join(__dirname, 'node_modules', '.bin')

var watchPackage = require('./watch-package')
var watcher = watchPackage(process.argv[3] || process.cwd(), process.exit, process.argv[2])

process.stdin.pipe(watcher)
watcher.stdout.pipe(process.stdout)
watcher.stderr.pipe(process.stderr)
