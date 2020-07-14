"use strict"

var o = require("../../ospec/ospec")
var buildPathname = require("../../pathname/build")

o.spec("buildPathname", function() {
	function test(prefix) {
		o("returns path if no params", function () {
			var string = buildPathname(prefix + "/route/foo", undefined)

			o(string).equals(prefix + "/route/foo")
		})
		o("skips interpolation if no params", function () {
			var string = buildPathname(prefix + "/route/:id", undefined)

			o(string).equals(prefix + "/route/:id")
		})
		o("appends query strings", function () {
			var string = buildPathname(prefix + "/route/foo", {a: "b", c: 1})

			o(string).equals(prefix + "/route/foo?a=b&c=1")
		})
		o("inserts template parameters at end", function () {
			var string = buildPathname(prefix + "/route/:id", {id: "1"})

			o(string).equals(prefix + "/route/1")
		})
		o("inserts template parameters at beginning", function () {
			var string = buildPathname(prefix + "/:id/foo", {id: "1"})

			o(string).equals(prefix + "/1/foo")
		})
		o("inserts template parameters at middle", function () {
			var string = buildPathname(prefix + "/route/:id/foo", {id: "1"})

			o(string).equals(prefix + "/route/1/foo")
		})
		o("inserts variadic paths", function () {
			var string = buildPathname(prefix + "/route/:foo...", {foo: "id/1"})

			o(string).equals(prefix + "/route/id/1")
		})
		o("inserts variadic paths with initial slashes", function () {
			var string = buildPathname(prefix + "/route/:foo...", {foo: "/id/1"})

			o(string).equals(prefix + "/route//id/1")
		})
		o("skips template parameters at end if param missing", function () {
			var string = buildPathname(prefix + "/route/:id", {param: 1})

			o(string).equals(prefix + "/route/:id?param=1")
		})
		o("skips template parameters at beginning if param missing", function () {
			var string = buildPathname(prefix + "/:id/foo", {param: 1})

			o(string).equals(prefix + "/:id/foo?param=1")
		})
		o("skips template parameters at middle if param missing", function () {
			var string = buildPathname(prefix + "/route/:id/foo", {param: 1})

			o(string).equals(prefix + "/route/:id/foo?param=1")
		})
		o("skips variadic template parameters if param missing", function () {
			var string = buildPathname(prefix + "/route/:foo...", {param: "/id/1"})

			o(string).equals(prefix + "/route/:foo...?param=%2Fid%2F1")
		})
		o("handles escaped values", function() {
			var data = buildPathname(prefix + "/route/:foo", {"foo": ";:@&=+$,/?%#"})

			o(data).equals(prefix + "/route/%3B%3A%40%26%3D%2B%24%2C%2F%3F%25%23")
		})
		o("handles unicode", function() {
			var data = buildPathname(prefix + "/route/:ö", {"ö": "ö"})

			o(data).equals(prefix + "/route/%C3%B6")
		})
		o("handles zero", function() {
			var string = buildPathname(prefix + "/route/:a", {a: 0})

			o(string).equals(prefix + "/route/0")
		})
		o("handles false", function() {
			var string = buildPathname(prefix + "/route/:a", {a: false})

			o(string).equals(prefix + "/route/false")
		})
		o("handles dashes", function() {
			var string = buildPathname(prefix + "/:lang-:region/route", {
				lang: "en",
				region: "US"
			})

			o(string).equals(prefix + "/en-US/route")
		})
		o("handles dots", function() {
			var string = buildPathname(prefix + "/:file.:ext/view", {
				file: "image",
				ext: "png"
			})

			o(string).equals(prefix + "/image.png/view")
		})
		o("merges query strings", function() {
			var string = buildPathname(prefix + "/item?a=1&b=2", {c: 3})

			o(string).equals(prefix + "/item?a=1&b=2&c=3")
		})
		o("merges query strings with other parameters", function() {
			var string = buildPathname(prefix + "/item/:id?a=1&b=2", {id: "foo", c: 3})

			o(string).equals(prefix + "/item/foo?a=1&b=2&c=3")
		})
		o("consumes template parameters without modifying query string", function() {
			var string = buildPathname(prefix + "/item/:id?a=1&b=2", {id: "foo"})

			o(string).equals(prefix + "/item/foo?a=1&b=2")
		})
	}
	o.spec("absolute", function() { test("") })
	o.spec("relative", function() { test("..") })
	o.spec("absolute + domain", function() { test("https://example.com") })
	o.spec("absolute + `file:`", function() { test("file://") })
})
