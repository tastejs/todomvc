"use strict"

var o = require("../../ospec/ospec")
var xhrMock = require("../../test-utils/xhrMock")
var Request = require("../../request/request")
var PromisePolyfill = require("../../promise/promise")
var parseQueryString = require("../../querystring/parse")

o.spec("jsonp", function() {
	var mock, jsonp, complete
	o.beforeEach(function() {
		mock = xhrMock()
		complete = o.spy()
		jsonp = Request(mock, PromisePolyfill, complete).jsonp
	})

	o("works", function(done) {
		mock.$defineRoutes({
			"GET /item": function(request) {
				var queryData = parseQueryString(request.query)
				return {status: 200, responseText: queryData["callback"] + "(" + JSON.stringify({a: 1}) + ")"}
			}
		})
		jsonp({url: "/item"}).then(function(data) {
			o(data).deepEquals({a: 1})
		}).then(done)
	})
	o("first argument can be a string aliasing url property", function(done){
		mock.$defineRoutes({
			"GET /item": function(request) {
				var queryData = parseQueryString(request.query)
				return {status: 200, responseText: queryData["callback"] + "(" + JSON.stringify({a: 1}) + ")"}
			}
		})
		jsonp("/item").then(function(data) {
			o(data).deepEquals({a: 1})
		}).then(function() {
			done()
		})
	})
	o("works w/ other querystring params", function(done) {
		mock.$defineRoutes({
			"GET /item": function(request) {
				var queryData = parseQueryString(request.query)
				return {status: 200, responseText: queryData["callback"] + "(" + JSON.stringify(queryData) + ")"}
			}
		})
		jsonp({url: "/item", params: {a: "b", c: "d"}}).then(function(data) {
			delete data["callback"]
			o(data).deepEquals({a: "b", c: "d"})
		}).then(done)
	})
	o("works w/ custom callbackKey", function(done) {
		mock.$defineRoutes({
			"GET /item": function(request) {
				var queryData = parseQueryString(request.query)
				return {status: 200, responseText: queryData["cb"] + "(" + JSON.stringify({a: 2}) + ")"}
			}
		})
		jsonp({url: "/item", callbackKey: "cb"}).then(function(data) {
			o(data).deepEquals({a: 2})
		}).then(done)
	})
	o("requests don't block each other", function(done) {
		mock.$defineRoutes({
			"GET /item": function(request) {
				var queryData = parseQueryString(request.query)
				return {status: 200, responseText: queryData["callback"] + "([])"}
			}
		})
		jsonp("/item").then(function() {
			return jsonp("/item")
		})
		jsonp("/item").then(function() {
			return jsonp("/item")
		})
		setTimeout(function() {
			o(complete.callCount).equals(4)
			done()
		}, 20)
	})
	o("requests trigger finally once with a chained then", function(done) {
		mock.$defineRoutes({
			"GET /item": function(request) {
				var queryData = parseQueryString(request.query)
				return {status: 200, responseText: queryData["callback"] + "([])"}
			}
		})
		var promise = jsonp("/item")
		promise.then(function() {}).then(function() {})
		promise.then(function() {}).then(function() {})
		setTimeout(function() {
			o(complete.callCount).equals(1)
			done()
		}, 20)
	})
	o("requests does not trigger finally when background: true", function(done) {
		mock.$defineRoutes({
			"GET /item": function(request) {
				var queryData = parseQueryString(request.query)
				return {status: 200, responseText: queryData["callback"] + "([])"}
			}
		})
		jsonp("/item", {background: true}).then(function() {})

		setTimeout(function() {
			o(complete.callCount).equals(0)
			done()
		}, 20)
	})
	o("handles error", function(done) {
		jsonp({url: "/item", callbackKey: "cb"}).catch(function(e) {
			o(e.message).equals("JSONP request failed")
			done()
		})
	})
})
