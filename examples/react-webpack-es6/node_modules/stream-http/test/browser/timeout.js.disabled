var Buffer = require('buffer').Buffer
var fs = require('fs')
var test = require('tape')
var UAParser = require('ua-parser-js')
var url = require('url')

var http = require('../..')

var browser = (new UAParser()).setUA(navigator.userAgent).getBrowser()
var browserName = browser.name
var browserVersion = browser.major

var skipTimeout = ((browserName === 'Opera' && browserVersion <= 12) ||
	(browserName === 'Safari' && browserVersion <= 5))


test('emits timeout events', function (t) {
	if (skipTimeout) {
		return t.skip('Browser does not support setting timeouts')
	}

	var req = http.request({
		path: '/basic.txt',
		timeout: 1
	})

	req.on('timeout', function () {
		t.pass('timeout caught')
		t.end() // the test will timeout if this does not happen
	})

	req.end()
})
