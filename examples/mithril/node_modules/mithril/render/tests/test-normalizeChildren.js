"use strict"

var o = require("../../ospec/ospec")
var Vnode = require("../../render/vnode")

o.spec("normalizeChildren", function() {
	o("normalizes arrays into fragments", function() {
		var children = Vnode.normalizeChildren([[]])

		o(children[0].tag).equals("[")
		o(children[0].children.length).equals(0)
	})
	o("normalizes strings into text nodes", function() {
		var children = Vnode.normalizeChildren(["a"])

		o(children[0].tag).equals("#")
		o(children[0].children).equals("a")
	})
	o("normalizes `false` values into `null`s", function() {
		var children = Vnode.normalizeChildren([false])

		o(children[0]).equals(null)
	})
	o("allows all keys", function() {
		var children = Vnode.normalizeChildren([
			{key: 1},
			{key: 2},
		])

		o(children).deepEquals([{key: 1}, {key: 2}])
	})
	o("allows no keys", function() {
		var children = Vnode.normalizeChildren([
			{data: 1},
			{data: 2},
		])

		o(children).deepEquals([{data: 1}, {data: 2}])
	})
	o("disallows mixed keys, starting with key", function() {
		o(function() {
			Vnode.normalizeChildren([
				{key: 1},
				{data: 2},
			])
		}).throws(TypeError)
	})
	o("disallows mixed keys, starting with no key", function() {
		o(function() {
			Vnode.normalizeChildren([
				{data: 1},
				{key: 2},
			])
		}).throws(TypeError)
	})
})
