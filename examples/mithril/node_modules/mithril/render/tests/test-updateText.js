"use strict"

var o = require("../../ospec/ospec")
var domMock = require("../../test-utils/domMock")
var vdom = require("../../render/render")

o.spec("updateText", function() {
	var $window, root, render
	o.beforeEach(function() {
		$window = domMock()
		root = $window.document.createElement("div")
		render = vdom($window)
	})

	o("updates to string", function() {
		var vnode = {tag: "#", children: "a"}
		var updated = {tag: "#", children: "b"}

		render(root, [vnode])
		render(root, [updated])

		o(updated.dom).equals(vnode.dom)
		o(updated.dom).equals(root.firstChild)
		o(updated.dom.nodeValue).equals("b")
	})
	o("updates to falsy string", function() {
		var vnode = {tag: "#", children: "a"}
		var updated = {tag: "#", children: ""}

		render(root, [vnode])
		render(root, [updated])

		o(updated.dom).equals(vnode.dom)
		o(updated.dom).equals(root.firstChild)
		o(updated.dom.nodeValue).equals("")
	})
	o("updates from falsy string", function() {
		var vnode = {tag: "#", children: ""}
		var updated = {tag: "#", children: "b"}

		render(root, [vnode])
		render(root, [updated])

		o(updated.dom).equals(vnode.dom)
		o(updated.dom).equals(root.firstChild)
		o(updated.dom.nodeValue).equals("b")
	})
	o("updates to number", function() {
		var vnode = {tag: "#", children: "a"}
		var updated = {tag: "#", children: 1}

		render(root, [vnode])
		render(root, [updated])

		o(updated.dom).equals(vnode.dom)
		o(updated.dom).equals(root.firstChild)
		o(updated.dom.nodeValue).equals("1")
	})
	o("updates to falsy number", function() {
		var vnode = {tag: "#", children: "a"}
		var updated = {tag: "#", children: 0}

		render(root, [vnode])
		render(root, [updated])

		o(updated.dom).equals(vnode.dom)
		o(updated.dom).equals(root.firstChild)
		o(updated.dom.nodeValue).equals("0")
	})
	o("updates from falsy number", function() {
		var vnode = {tag: "#", children: 0}
		var updated = {tag: "#", children: "b"}

		render(root, [vnode])
		render(root, [updated])

		o(updated.dom).equals(vnode.dom)
		o(updated.dom).equals(root.firstChild)
		o(updated.dom.nodeValue).equals("b")
	})
	o("updates to boolean", function() {
		var vnode = {tag: "#", children: "a"}
		var updated = {tag: "#", children: true}

		render(root, [vnode])
		render(root, [updated])

		o(updated.dom).equals(vnode.dom)
		o(updated.dom).equals(root.firstChild)
		o(updated.dom.nodeValue).equals("true")
	})
	o("updates to falsy boolean", function() {
		var vnode = {tag: "#", children: "a"}
		var updated = {tag: "#", children: false}

		render(root, [vnode])
		render(root, [updated])

		o(updated.dom).equals(vnode.dom)
		o(updated.dom).equals(root.firstChild)
		o(updated.dom.nodeValue).equals("false")
	})
	o("updates from falsy boolean", function() {
		var vnode = {tag: "#", children: false}
		var updated = {tag: "#", children: "b"}

		render(root, [vnode])
		render(root, [updated])

		o(updated.dom).equals(vnode.dom)
		o(updated.dom).equals(root.firstChild)
		o(updated.dom.nodeValue).equals("b")
	})
})
