"use strict"

var pushStateMock = require("./pushStateMock")
var domMock = require("./domMock")
var xhrMock = require("./xhrMock")

module.exports = function(env) {
	env = env || {}
	var $window = env.window = {}

	var dom = domMock()
	var xhr = xhrMock()
	for (var key in dom) if (!$window[key]) $window[key] = dom[key]
	for (var key in xhr) if (!$window[key]) $window[key] = xhr[key]
	pushStateMock(env)

	return $window
}