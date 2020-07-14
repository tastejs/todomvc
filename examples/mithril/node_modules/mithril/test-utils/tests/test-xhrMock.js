"use strict"

var o = require("../../ospec/ospec")
var xhrMock = require("../../test-utils/xhrMock")
var parseQueryString = require("../../querystring/parse")

o.spec("xhrMock", function() {
	var $window
	o.beforeEach(function() {
		$window = xhrMock()
	})

	o.spec("xhr", function() {
		o("works", function(done) {
			$window.$defineRoutes({
				"GET /item": function(request) {
					o(request.url).equals("/item")
					return {status: 200, responseText: "test"}
				}
			})
			var xhr = new $window.XMLHttpRequest()
			xhr.open("GET", "/item")
			xhr.onreadystatechange = function() {
				if (xhr.readyState === 4) {
					o(xhr.status).equals(200)
					o(xhr.responseText).equals("test")
					done()
				}
			}
			xhr.send()
		})
		o("works w/ search", function(done) {
			$window.$defineRoutes({
				"GET /item": function(request) {
					o(request.query).equals("?a=b")
					return {status: 200, responseText: "test"}
				}
			})
			var xhr = new $window.XMLHttpRequest()
			xhr.open("GET", "/item?a=b")
			xhr.onreadystatechange = function() {
				if (xhr.readyState === 4) {
					done()
				}
			}
			xhr.send()
		})
		o("works w/ body", function(done) {
			$window.$defineRoutes({
				"POST /item": function(request) {
					o(request.body).equals("a=b")
					return {status: 200, responseText: "test"}
				}
			})
			var xhr = new $window.XMLHttpRequest()
			xhr.open("POST", "/item")
			xhr.onreadystatechange = function() {
				if (xhr.readyState === 4) {
					done()
				}
			}
			xhr.send("a=b")
		})
		o("passes event to onreadystatechange", function(done) {
			$window.$defineRoutes({
				"GET /item": function(request) {
					o(request.url).equals("/item")
					return {status: 200, responseText: "test"}
				}
			})
			var xhr = new $window.XMLHttpRequest()
			xhr.open("GET", "/item")
			xhr.onreadystatechange = function(ev) {
				o(ev.target).equals(xhr)
				if (xhr.readyState === 4) {
					done()
				}
			}
			xhr.send()
		})
		o("handles routing error", function(done) {
			var xhr = new $window.XMLHttpRequest()
			xhr.open("GET", "/nonexistent")
			xhr.onreadystatechange = function() {
				if (xhr.readyState === 4) {
					o(xhr.status).equals(500)
					done()
				}
			}
			xhr.send("a=b")
		})
		o("Setting a header twice merges the header", function() {
			// Source: https://developer.mozilla.org/en-US/docs/Web/API/XMLHttpRequest/setRequestHeader
			var xhr = new $window.XMLHttpRequest()
			xhr.open("POST", "/test")
			xhr.setRequestHeader("Content-Type", "foo")
			xhr.setRequestHeader("Content-Type", "bar")
			o(xhr.getRequestHeader("Content-Type")).equals("foo, bar")
		})
	})
	o.spec("jsonp", function() {
		o("works", function(done) {
			$window.$defineRoutes({
				"GET /test": function(request) {
					var queryData = parseQueryString(request.query)
					return {status: 200, responseText: queryData["callback"] + "(" + JSON.stringify({a: 1}) + ")"}
				}
			})

			$window["cb"] = finish

			var script = $window.document.createElement("script")
			script.src = "/test?callback=cb"
			$window.document.documentElement.appendChild(script)

			function finish(data) {
				o(data).deepEquals({a: 1})
				done()
			}
		})
		o("works w/ custom callback key", function(done) {
			$window.$defineRoutes({
				"GET /test": function(request) {
					var queryData = parseQueryString(request.query)
					return {status: 200, responseText: queryData["cb"] + "(" + JSON.stringify({a: 2}) + ")"}
				}
			})
			$window.$defineJSONPCallbackKey("cb")

			$window["customcb"] = finish2

			var script = $window.document.createElement("script")
			script.src = "/test?cb=customcb"
			$window.document.documentElement.appendChild(script)

			function finish2(data) {
				o(data).deepEquals({a: 2})
				done()
			}
		})
		o("works with other querystring params", function(done) {
			$window.$defineRoutes({
				"GET /test": function(request) {
					var queryData = parseQueryString(request.query)
					return {status: 200, responseText: queryData["callback"] + "(" + JSON.stringify({a: 3}) + ")"}
				}
			})

			$window["cbwithinparams"] = finish

			var script = $window.document.createElement("script")
			script.src = "/test?a=b&callback=cbwithinparams&c=d"
			$window.document.documentElement.appendChild(script)

			function finish(data) {
				o(data).deepEquals({a: 3})
				done()
			}
		})
		o("handles error", function(done) {
			var script = $window.document.createElement("script")
			script.onerror = finish
			script.src = "/test?cb=nonexistent"
			$window.document.documentElement.appendChild(script)

			function finish(e) {
				o(e.type).equals("error")
				done()
			}
		})
	})
})
