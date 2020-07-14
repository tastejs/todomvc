var deasync = require('../../index.js')
var cp = require('child_process')
var exec = deasync(cp.exec)
exec('ls -la')
