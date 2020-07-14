"use strict"

var o = require("../../ospec/ospec")
var domMock = require("../../test-utils/domMock")
var vdom = require("../../render/render")

o.spec("updateFragment", function() {
	var $window, root, render
	o.beforeEach(function() {
		$window = domMock()
		root = $window.document.createElement("div")
		render = vdom($window)
	})

	o("updates fragment", function() {
		var vnode = {tag: "[", children: [{tag: "a"}]}
		var updated = {tag: "[", children: [{tag: "b"}]}

		render(root, [vnode])
		render(root, [updated])

		o(updated.dom).equals(root.firstChild)
		o(updated.dom.nodeName).equals("B")
	})
	o("adds els", function() {
		var vnode = {tag: "[", children: []}
		var updated = {tag: "[", children: [{tag: "a"}, {tag: "b"}]}

		render(root, [vnode])
		render(root, [updated])

		o(updated.dom).equals(root.firstChild)
		o(updated.domSize).equals(2)
		o(root.childNodes.length).equals(2)
		o(root.childNodes[0].nodeName).equals("A")
		o(root.childNodes[1].nodeName).equals("B")
	})
	o("removes els", function() {
		var vnode = {tag: "[", children: [{tag: "a"}, {tag: "b"}]}
		var updated = {tag: "[", children: []}

		render(root, [vnode])
		render(root, [updated])

		o(updated.dom).equals(null)
		o(updated.domSize).equals(0)
		o(root.childNodes.length).equals(0)
	})
	o("updates from childless fragment", function() {
		var vnode = {tag: "["}
		var updated = {tag: "[", children: [{tag: "a"}]}

		render(root, [vnode])
		render(root, [updated])

		o(updated.dom).equals(root.firstChild)
		o(updated.dom.nodeName).equals("A")
	})
	o("updates to childless fragment", function() {
		var vnode = {tag: "[", children: [{tag: "a"}]}
		var updated = {tag: "["}

		render(root, [vnode])
		render(root, [updated])

		o(updated.dom).equals(null)
		o(root.childNodes.length).equals(0)
	})
})
