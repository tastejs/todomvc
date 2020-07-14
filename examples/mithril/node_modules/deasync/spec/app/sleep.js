var deasync = require('../../index.js')
var sleep = deasync(function (timeout, done) {
  setTimeout(done, timeout)
})
sleep(2000)
