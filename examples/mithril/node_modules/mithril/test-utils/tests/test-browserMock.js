"use strict"

var o = require("../../ospec/ospec")
var browserMock = require("../../test-utils/browserMock")
var callAsync = require("../../test-utils/callAsync")
o.spec("browserMock", function() {

	var $window
	o.beforeEach(function() {
		$window = browserMock()
	})

	o("Mocks DOM, pushState and XHR", function() {
		o($window.location).notEquals(undefined)
		o($window.document).notEquals(undefined)
		o($window.XMLHttpRequest).notEquals(undefined)
	})
	o("$window.onhashchange can be reached from the pushStateMock functions", function(done) {
		$window.onhashchange = o.spy()
		$window.location.hash = "#a"

		callAsync(function(){
			o($window.onhashchange.callCount).equals(1)
			done()
		})
	})
	o("$window.onpopstate can be reached from the pushStateMock functions", function() {
		$window.onpopstate = o.spy()
		$window.history.pushState(null, null, "#a")
		$window.history.back()

		o($window.onpopstate.callCount).equals(1)
	})
	o("$window.onunload can be reached from the pushStateMock functions", function() {
		$window.onunload = o.spy()
		$window.location.href = "/a"

		o($window.onunload.callCount).equals(1)
	})
})
