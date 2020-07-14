const assert = require('assert')
var ret,
  deasync = require('./index.js')
setTimeout(function() {
  ret = 'pass'
}, 100)

while (ret === undefined) deasync.sleep(10)
assert.strictEqual(ret, 'pass')
