"use strict"

var o = require("../../ospec/ospec")
var buildQueryString = require("../../querystring/build")

o.spec("buildQueryString", function() {
	o("handles flat object", function() {
		var string = buildQueryString({a: "b", c: 1})

		o(string).equals("a=b&c=1")
	})
	o("handles escaped values", function() {
		var data = buildQueryString({";:@&=+$,/?%#": ";:@&=+$,/?%#"})

		o(data).equals("%3B%3A%40%26%3D%2B%24%2C%2F%3F%25%23=%3B%3A%40%26%3D%2B%24%2C%2F%3F%25%23")
	})
	o("handles unicode", function() {
		var data = buildQueryString({"ö": "ö"})

		o(data).equals("%C3%B6=%C3%B6")
	})
	o("handles nested object", function() {
		var string = buildQueryString({a: {b: 1, c: 2}})

		o(string).equals("a%5Bb%5D=1&a%5Bc%5D=2")
	})
	o("handles deep nested object", function() {
		var string = buildQueryString({a: {b: {c: 1, d: 2}}})

		o(string).equals("a%5Bb%5D%5Bc%5D=1&a%5Bb%5D%5Bd%5D=2")
	})
	o("handles nested array", function() {
		var string = buildQueryString({a: ["x", "y"]})

		o(string).equals("a%5B0%5D=x&a%5B1%5D=y")
	})
	o("handles array w/ dupe values", function() {
		var string = buildQueryString({a: ["x", "x"]})

		o(string).equals("a%5B0%5D=x&a%5B1%5D=x")
	})
	o("handles deep nested array", function() {
		var string = buildQueryString({a: [["x", "y"]]})

		o(string).equals("a%5B0%5D%5B0%5D=x&a%5B0%5D%5B1%5D=y")
	})
	o("handles deep nested array in object", function() {
		var string = buildQueryString({a: {b: ["x", "y"]}})

		o(string).equals("a%5Bb%5D%5B0%5D=x&a%5Bb%5D%5B1%5D=y")
	})
	o("handles deep nested object in array", function() {
		var string = buildQueryString({a: [{b: 1, c: 2}]})

		o(string).equals("a%5B0%5D%5Bb%5D=1&a%5B0%5D%5Bc%5D=2")
	})
	o("handles date", function() {
		var string = buildQueryString({a: new Date(0)})

		o(string).equals("a=" + encodeURIComponent(new Date(0).toString()))
	})
	o("turns null into value-less string (like jQuery)", function() {
		var string = buildQueryString({a: null})

		o(string).equals("a")
	})
	o("turns undefined into value-less string (like jQuery)", function() {
		var string = buildQueryString({a: undefined})

		o(string).equals("a")
	})
	o("turns empty string into value-less string (like jQuery)", function() {
		var string = buildQueryString({a: ""})

		o(string).equals("a")
	})
	o("handles zero", function() {
		var string = buildQueryString({a: 0})

		o(string).equals("a=0")
	})
	o("handles false", function() {
		var string = buildQueryString({a: false})

		o(string).equals("a=false")
	})
})
