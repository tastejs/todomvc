"use strict"

var o = require("../../ospec/ospec")
var parsePathname = require("../../pathname/parse")
var compileTemplate = require("../../pathname/compileTemplate")

o.spec("compileTemplate", function() {
	o("checks empty string", function() {
		var data = parsePathname("/")
		o(compileTemplate("/")(data)).equals(true)
		o(data.params).deepEquals({})
	})
	o("checks identical match", function() {
		var data = parsePathname("/foo")
		o(compileTemplate("/foo")(data)).equals(true)
		o(data.params).deepEquals({})
	})
	o("checks identical mismatch", function() {
		var data = parsePathname("/bar")
		o(compileTemplate("/foo")(data)).equals(false)
		o(data.params).deepEquals({})
	})
	o("checks single parameter", function() {
		var data = parsePathname("/1")
		o(compileTemplate("/:id")(data)).equals(true)
		o(data.params).deepEquals({id: "1"})
	})
	o("checks single variadic parameter", function() {
		var data = parsePathname("/some/path")
		o(compileTemplate("/:id...")(data)).equals(true)
		o(data.params).deepEquals({id: "some/path"})
	})
	o("checks single parameter with extra match", function() {
		var data = parsePathname("/1/foo")
		o(compileTemplate("/:id/foo")(data)).equals(true)
		o(data.params).deepEquals({id: "1"})
	})
	o("checks single parameter with extra mismatch", function() {
		var data = parsePathname("/1/bar")
		o(compileTemplate("/:id/foo")(data)).equals(false)
		o(data.params).deepEquals({})
	})
	o("checks single variadic parameter with extra match", function() {
		var data = parsePathname("/some/path/foo")
		o(compileTemplate("/:id.../foo")(data)).equals(true)
		o(data.params).deepEquals({id: "some/path"})
	})
	o("checks single variadic parameter with extra mismatch", function() {
		var data = parsePathname("/some/path/bar")
		o(compileTemplate("/:id.../foo")(data)).equals(false)
		o(data.params).deepEquals({})
	})
	o("checks multiple parameters", function() {
		var data = parsePathname("/1/2")
		o(compileTemplate("/:id/:name")(data)).equals(true)
		o(data.params).deepEquals({id: "1", name: "2"})
	})
	o("checks incomplete multiple parameters", function() {
		var data = parsePathname("/1")
		o(compileTemplate("/:id/:name")(data)).equals(false)
		o(data.params).deepEquals({})
	})
	o("checks multiple parameters with extra match", function() {
		var data = parsePathname("/1/2/foo")
		o(compileTemplate("/:id/:name/foo")(data)).equals(true)
		o(data.params).deepEquals({id: "1", name: "2"})
	})
	o("checks multiple parameters with extra mismatch", function() {
		var data = parsePathname("/1/2/bar")
		o(compileTemplate("/:id/:name/foo")(data)).equals(false)
		o(data.params).deepEquals({})
	})
	o("checks multiple parameters, last variadic, with extra match", function() {
		var data = parsePathname("/1/some/path/foo")
		o(compileTemplate("/:id/:name.../foo")(data)).equals(true)
		o(data.params).deepEquals({id: "1", name: "some/path"})
	})
	o("checks multiple parameters, last variadic, with extra mismatch", function() {
		var data = parsePathname("/1/some/path/bar")
		o(compileTemplate("/:id/:name.../foo")(data)).equals(false)
		o(data.params).deepEquals({})
	})
	o("checks multiple separated parameters", function() {
		var data = parsePathname("/1/sep/2")
		o(compileTemplate("/:id/sep/:name")(data)).equals(true)
		o(data.params).deepEquals({id: "1", name: "2"})
	})
	o("checks incomplete multiple separated parameters", function() {
		var data = parsePathname("/1")
		o(compileTemplate("/:id/sep/:name")(data)).equals(false)
		o(data.params).deepEquals({})
		data = parsePathname("/1/sep")
		o(compileTemplate("/:id/sep/:name")(data)).equals(false)
		o(data.params).deepEquals({})
	})
	o("checks multiple separated parameters missing sep", function() {
		var data = parsePathname("/1/2")
		o(compileTemplate("/:id/sep/:name")(data)).equals(false)
		o(data.params).deepEquals({})
	})
	o("checks multiple separated parameters with extra match", function() {
		var data = parsePathname("/1/sep/2/foo")
		o(compileTemplate("/:id/sep/:name/foo")(data)).equals(true)
		o(data.params).deepEquals({id: "1", name: "2"})
	})
	o("checks multiple separated parameters with extra mismatch", function() {
		var data = parsePathname("/1/sep/2/bar")
		o(compileTemplate("/:id/sep/:name/foo")(data)).equals(false)
		o(data.params).deepEquals({})
	})
	o("checks multiple separated parameters, last variadic, with extra match", function() {
		var data = parsePathname("/1/sep/some/path/foo")
		o(compileTemplate("/:id/sep/:name.../foo")(data)).equals(true)
		o(data.params).deepEquals({id: "1", name: "some/path"})
	})
	o("checks multiple separated parameters, last variadic, with extra mismatch", function() {
		var data = parsePathname("/1/sep/some/path/bar")
		o(compileTemplate("/:id/sep/:name.../foo")(data)).equals(false)
		o(data.params).deepEquals({})
	})
	o("checks multiple parameters + prefix", function() {
		var data = parsePathname("/route/1/2")
		o(compileTemplate("/route/:id/:name")(data)).equals(true)
		o(data.params).deepEquals({id: "1", name: "2"})
	})
	o("checks incomplete multiple parameters + prefix", function() {
		var data = parsePathname("/route/1")
		o(compileTemplate("/route/:id/:name")(data)).equals(false)
		o(data.params).deepEquals({})
	})
	o("checks multiple parameters + prefix with extra match", function() {
		var data = parsePathname("/route/1/2/foo")
		o(compileTemplate("/route/:id/:name/foo")(data)).equals(true)
		o(data.params).deepEquals({id: "1", name: "2"})
	})
	o("checks multiple parameters + prefix with extra mismatch", function() {
		var data = parsePathname("/route/1/2/bar")
		o(compileTemplate("/route/:id/:name/foo")(data)).equals(false)
		o(data.params).deepEquals({})
	})
	o("checks multiple parameters + prefix, last variadic, with extra match", function() {
		var data = parsePathname("/route/1/some/path/foo")
		o(compileTemplate("/route/:id/:name.../foo")(data)).equals(true)
		o(data.params).deepEquals({id: "1", name: "some/path"})
	})
	o("checks multiple parameters + prefix, last variadic, with extra mismatch", function() {
		var data = parsePathname("/route/1/some/path/bar")
		o(compileTemplate("/route/:id/:name.../foo")(data)).equals(false)
		o(data.params).deepEquals({})
	})
	o("checks multiple separated parameters + prefix", function() {
		var data = parsePathname("/route/1/sep/2")
		o(compileTemplate("/route/:id/sep/:name")(data)).equals(true)
		o(data.params).deepEquals({id: "1", name: "2"})
	})
	o("checks incomplete multiple separated parameters + prefix", function() {
		var data = parsePathname("/route/1")
		o(compileTemplate("/route/:id/sep/:name")(data)).equals(false)
		o(data.params).deepEquals({})
		var data = parsePathname("/route/1/sep")
		o(compileTemplate("/route/:id/sep/:name")(data)).equals(false)
		o(data.params).deepEquals({})
	})
	o("checks multiple separated parameters + prefix missing sep", function() {
		var data = parsePathname("/route/1/2")
		o(compileTemplate("/route/:id/sep/:name")(data)).equals(false)
		o(data.params).deepEquals({})
	})
	o("checks multiple separated parameters + prefix with extra match", function() {
		var data = parsePathname("/route/1/sep/2/foo")
		o(compileTemplate("/route/:id/sep/:name/foo")(data)).equals(true)
		o(data.params).deepEquals({id: "1", name: "2"})
	})
	o("checks multiple separated parameters + prefix with extra mismatch", function() {
		var data = parsePathname("/route/1/sep/2/bar")
		o(compileTemplate("/route/:id/sep/:name/foo")(data)).equals(false)
		o(data.params).deepEquals({})
	})
	o("checks multiple separated parameters + prefix, last variadic, with extra match", function() {
		var data = parsePathname("/route/1/sep/some/path/foo")
		o(compileTemplate("/route/:id/sep/:name.../foo")(data)).equals(true)
		o(data.params).deepEquals({id: "1", name: "some/path"})
	})
	o("checks multiple separated parameters + prefix, last variadic, with extra mismatch", function() {
		var data = parsePathname("/route/1/sep/some/path/bar")
		o(compileTemplate("/route/:id/sep/:name.../foo")(data)).equals(false)
		o(data.params).deepEquals({})
	})
	o("checks query params match", function() {
		var data = parsePathname("/route/1?foo=bar")
		o(compileTemplate("/route/:id?foo=bar")(data)).equals(true)
		o(data.params).deepEquals({id: "1", foo: "bar"})
	})
	o("checks query params mismatch", function() {
		var data = parsePathname("/route/1?foo=bar")
		o(compileTemplate("/route/:id?foo=1")(data)).equals(false)
		o(data.params).deepEquals({foo: "bar"})
		o(compileTemplate("/route/:id?bar=foo")(data)).equals(false)
		o(data.params).deepEquals({foo: "bar"})
	})
	o("checks dot before dot", function() {
		var data = parsePathname("/file.test.png/edit")
		o(compileTemplate("/:file.:ext/edit")(data)).equals(true)
		o(data.params).deepEquals({file: "file.test", ext: "png"})
	})
	o("checks dash before dot", function() {
		var data = parsePathname("/file-test.png/edit")
		o(compileTemplate("/:file.:ext/edit")(data)).equals(true)
		o(data.params).deepEquals({file: "file-test", ext: "png"})
	})
	o("checks dot before dash", function() {
		var data = parsePathname("/file.test-png/edit")
		o(compileTemplate("/:file-:ext/edit")(data)).equals(true)
		o(data.params).deepEquals({file: "file.test", ext: "png"})
	})
	o("checks dash before dash", function() {
		var data = parsePathname("/file-test-png/edit")
		o(compileTemplate("/:file-:ext/edit")(data)).equals(true)
		o(data.params).deepEquals({file: "file-test", ext: "png"})
	})
})
