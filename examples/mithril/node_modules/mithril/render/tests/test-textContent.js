"use strict"

var o = require("../../ospec/ospec")
var domMock = require("../../test-utils/domMock")
var vdom = require("../../render/render")

o.spec("textContent", function() {
	var $window, root, render
	o.beforeEach(function() {
		$window = domMock()
		root = $window.document.createElement("div")
		render = vdom($window)
	})

	o("ignores null", function() {
		var vnodes = [{tag: "a", text: null}]

		render(root, vnodes)

		o(root.childNodes.length).equals(1)
		o(vnodes[0].dom.childNodes.length).equals(0)
		o(vnodes[0].dom).equals(root.childNodes[0])
	})
	o("ignores undefined", function() {
		var vnodes = [{tag: "a", text: undefined}]

		render(root, vnodes)

		o(root.childNodes.length).equals(1)
		o(vnodes[0].dom.childNodes.length).equals(0)
		o(vnodes[0].dom).equals(root.childNodes[0])
	})
	o("creates string", function() {
		var vnodes = [{tag: "a", text: "a"}]

		render(root, vnodes)

		o(root.childNodes.length).equals(1)
		o(vnodes[0].dom.childNodes.length).equals(1)
		o(vnodes[0].dom.childNodes[0].nodeValue).equals("a")
		o(vnodes[0].dom).equals(root.childNodes[0])
	})
	o("creates falsy string", function() {
		var vnodes = [{tag: "a", text: ""}]

		render(root, vnodes)

		o(root.childNodes.length).equals(1)
		o(vnodes[0].dom.childNodes.length).equals(1)
		o(vnodes[0].dom.childNodes[0].nodeValue).equals("")
		o(vnodes[0].dom).equals(root.childNodes[0])
	})
	o("creates number", function() {
		var vnodes = [{tag: "a", text: 1}]

		render(root, vnodes)

		o(root.childNodes.length).equals(1)
		o(vnodes[0].dom.childNodes.length).equals(1)
		o(vnodes[0].dom.childNodes[0].nodeValue).equals("1")
		o(vnodes[0].dom).equals(root.childNodes[0])
	})
	o("creates falsy number", function() {
		var vnodes = [{tag: "a", text: 0}]

		render(root, vnodes)

		o(root.childNodes.length).equals(1)
		o(vnodes[0].dom.childNodes.length).equals(1)
		o(vnodes[0].dom.childNodes[0].nodeValue).equals("0")
		o(vnodes[0].dom).equals(root.childNodes[0])
	})
	o("creates boolean", function() {
		var vnodes = [{tag: "a", text: true}]

		render(root, vnodes)

		o(root.childNodes.length).equals(1)
		o(vnodes[0].dom.childNodes.length).equals(1)
		o(vnodes[0].dom.childNodes[0].nodeValue).equals("true")
		o(vnodes[0].dom).equals(root.childNodes[0])
	})
	o("creates falsy boolean", function() {
		var vnodes = [{tag: "a", text: false}]

		render(root, vnodes)

		o(root.childNodes.length).equals(1)
		o(vnodes[0].dom.childNodes.length).equals(1)
		o(vnodes[0].dom.childNodes[0].nodeValue).equals("false")
		o(vnodes[0].dom).equals(root.childNodes[0])
	})
	o("updates to string", function() {
		var vnodes = [{tag: "a", text: "a"}]
		var updated = [{tag: "a", text: "b"}]

		render(root, vnodes)
		render(root, updated)

		o(root.childNodes.length).equals(1)
		o(vnodes[0].dom.childNodes.length).equals(1)
		o(vnodes[0].dom.childNodes[0].nodeValue).equals("b")
		o(updated[0].dom).equals(root.childNodes[0])
	})
	o("updates to falsy string", function() {
		var vnodes = [{tag: "a", text: "a"}]
		var updated = [{tag: "a", text: ""}]

		render(root, vnodes)
		render(root, updated)

		o(root.childNodes.length).equals(1)
		o(vnodes[0].dom.childNodes.length).equals(1)
		o(vnodes[0].dom.childNodes[0].nodeValue).equals("")
		o(updated[0].dom).equals(root.childNodes[0])
	})
	o("updates to number", function() {
		var vnodes = [{tag: "a", text: "a"}]
		var updated = [{tag: "a", text: 1}]

		render(root, vnodes)
		render(root, updated)

		o(root.childNodes.length).equals(1)
		o(vnodes[0].dom.childNodes.length).equals(1)
		o(vnodes[0].dom.childNodes[0].nodeValue).equals("1")
		o(updated[0].dom).equals(root.childNodes[0])
	})
	o("updates to falsy number", function() {
		var vnodes = [{tag: "a", text: "a"}]
		var updated = [{tag: "a", text: 0}]

		render(root, vnodes)
		render(root, updated)

		o(root.childNodes.length).equals(1)
		o(vnodes[0].dom.childNodes.length).equals(1)
		o(vnodes[0].dom.childNodes[0].nodeValue).equals("0")
		o(updated[0].dom).equals(root.childNodes[0])
	})
	o("updates to boolean", function() {
		var vnodes = [{tag: "a", text: "a"}]
		var updated = [{tag: "a", text: true}]

		render(root, vnodes)
		render(root, updated)

		o(root.childNodes.length).equals(1)
		o(vnodes[0].dom.childNodes.length).equals(1)
		o(vnodes[0].dom.childNodes[0].nodeValue).equals("true")
		o(updated[0].dom).equals(root.childNodes[0])
	})
	o("updates to falsy boolean", function() {
		var vnodes = [{tag: "a", text: "a"}]
		var updated = [{tag: "a", text: false}]

		render(root, vnodes)
		render(root, updated)

		o(root.childNodes.length).equals(1)
		o(vnodes[0].dom.childNodes.length).equals(1)
		o(vnodes[0].dom.childNodes[0].nodeValue).equals("false")
		o(updated[0].dom).equals(root.childNodes[0])
	})
	o("updates with typecasting", function() {
		var vnodes = [{tag: "a", text: "1"}]
		var updated = [{tag: "a", text: 1}]

		render(root, vnodes)
		render(root, updated)

		o(root.childNodes.length).equals(1)
		o(vnodes[0].dom.childNodes.length).equals(1)
		o(vnodes[0].dom.childNodes[0].nodeValue).equals("1")
		o(updated[0].dom).equals(root.childNodes[0])
	})
	o("updates from without text to with text", function() {
		var vnodes = [{tag: "a"}]
		var updated = [{tag: "a", text: "b"}]

		render(root, vnodes)
		render(root, updated)

		o(root.childNodes.length).equals(1)
		o(vnodes[0].dom.childNodes.length).equals(1)
		o(vnodes[0].dom.childNodes[0].nodeValue).equals("b")
		o(updated[0].dom).equals(root.childNodes[0])
	})
	o("updates from with text to without text", function() {
		var vnodes = [{tag: "a", text: "a"}]
		var updated = [{tag: "a"}]

		render(root, vnodes)
		render(root, updated)

		o(root.childNodes.length).equals(1)
		o(vnodes[0].dom.childNodes.length).equals(0)
		o(updated[0].dom).equals(root.childNodes[0])
	})
})
