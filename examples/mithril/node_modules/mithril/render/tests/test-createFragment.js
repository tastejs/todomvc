"use strict"

var o = require("../../ospec/ospec")
var domMock = require("../../test-utils/domMock")
var vdom = require("../../render/render")

o.spec("createFragment", function() {
	var $window, root, render
	o.beforeEach(function() {
		$window = domMock()
		root = $window.document.createElement("div")
		render = vdom($window)
	})

	o("creates fragment", function() {
		var vnode = {tag: "[", children: [{tag: "a"}]}
		render(root, [vnode])

		o(vnode.dom.nodeName).equals("A")
	})
	o("handles empty fragment", function() {
		var vnode = {tag: "[", children: []}
		render(root, [vnode])

		o(vnode.dom).equals(null)
		o(vnode.domSize).equals(0)
	})
	o("handles childless fragment", function() {
		var vnode = {tag: "["}
		render(root, [vnode])

		o(vnode.dom).equals(null)
		o(vnode.domSize).equals(0)
	})
	o("handles multiple children", function() {
		var vnode = {tag: "[", children: [{tag: "a"}, {tag: "b"}]}
		render(root, [vnode])

		o(vnode.domSize).equals(2)
		o(vnode.dom.nodeName).equals("A")
		o(vnode.dom.nextSibling.nodeName).equals("B")
	})
	o("handles td", function() {
		var vnode = {tag: "[", children: [{tag: "td"}]}
		render(root, [vnode])

		o(vnode.dom).notEquals(null)
		o(vnode.dom.nodeName).equals("TD")
	})
})
