"use strict"

var o = require("../../ospec/ospec")
var domMock = require("../../test-utils/domMock")
var vdom = require("../../render/render")

o.spec("createText", function() {
	var $window, root, render
	o.beforeEach(function() {
		$window = domMock()
		root = $window.document.createElement("div")
		render = vdom($window)
	})

	o("creates string", function() {
		var vnode = {tag: "#", children: "a"}
		render(root, [vnode])

		o(vnode.dom.nodeName).equals("#text")
		o(vnode.dom.nodeValue).equals("a")
	})
	o("creates falsy string", function() {
		var vnode = {tag: "#", children: ""}
		render(root, [vnode])

		o(vnode.dom.nodeName).equals("#text")
		o(vnode.dom.nodeValue).equals("")
	})
	o("creates number", function() {
		var vnode = {tag: "#", children: 1}
		render(root, [vnode])

		o(vnode.dom.nodeName).equals("#text")
		o(vnode.dom.nodeValue).equals("1")
	})
	o("creates falsy number", function() {
		var vnode = {tag: "#", children: 0}
		render(root, [vnode])

		o(vnode.dom.nodeName).equals("#text")
		o(vnode.dom.nodeValue).equals("0")
	})
	o("creates boolean", function() {
		var vnode = {tag: "#", children: true}
		render(root, [vnode])

		o(vnode.dom.nodeName).equals("#text")
		o(vnode.dom.nodeValue).equals("true")
	})
	o("creates falsy boolean", function() {
		var vnode = {tag: "#", children: false}
		render(root, [vnode])

		o(vnode.dom.nodeName).equals("#text")
		o(vnode.dom.nodeValue).equals("false")
	})
	o("creates spaces", function() {
		var vnode = {tag: "#", children: "   "}
		render(root, [vnode])

		o(vnode.dom.nodeName).equals("#text")
		o(vnode.dom.nodeValue).equals("   ")
	})
	o("ignores html", function() {
		var vnode = {tag: "#", children: "<a></a>&trade;"}
		render(root, [vnode])

		o(vnode.dom.nodeName).equals("#text")
		o(vnode.dom.nodeValue).equals("<a></a>&trade;")
	})
})
