var deasync = require('../../index.js')
var https = require('https')


var request = deasync(function (url, done) {
  https.get(url, function (res) {
    res.on('error', done)

    res.setEncoding('utf8')

    var result = ''

    res.on('data', function (data) {
      result += data
    })
    res.on('end', function () {
      done(null, result)
    })
  }).on('error', done)
})

request('https://nodejs.org/en/')