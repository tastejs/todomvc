"use strict"

var o = require("../../ospec/ospec")

// force usage of polyfill
var save = Object.assign
Object.assign = null
delete require.cache[require.resolve("../assign")]
var assign = require("../assign")
Object.assign = save

o.spec("assign polyfill", function() {
	o("works", function() {
		var target = {hello: "world", foo: "bar"}
		var source = {foo: "foo", extra: true}

		assign(target, source)

		o(target).deepEquals({hello: "world", foo: "foo", extra: true})

		var falsySources = [null, 0, "", false, void 0]
		falsySources.forEach(function(falsy) { assign(target, falsy) })

		o(target).deepEquals({hello: "world", foo: "foo", extra: true})
	})
})
