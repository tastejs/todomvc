"use strict"

var o = require("../../ospec/ospec")
var domMock = require("../../test-utils/domMock")
var vdom = require("../../render/render")

o.spec("updateHTML", function() {
	var $window, root, render
	o.beforeEach(function() {
		$window = domMock()
		root = $window.document.createElement("div")
		render = vdom($window)
	})

	o("updates html", function() {
		var vnode = {tag: "<", children: "a"}
		var updated = {tag: "<", children: "b"}

		render(root, [vnode])
		render(root, [updated])

		o(updated.dom).equals(root.firstChild)
		o(updated.domSize).equals(1)
		o(updated.dom.nodeValue).equals("b")
	})
	o("adds html", function() {
		var vnode = {tag: "<", children: ""}
		var updated = {tag: "<", children: "<a></a><b></b>"}

		render(root, [vnode])
		render(root, [updated])

		o(updated.domSize).equals(2)
		o(updated.dom).equals(root.firstChild)
		o(root.childNodes.length).equals(2)
		o(root.childNodes[0].nodeName).equals("A")
		o(root.childNodes[1].nodeName).equals("B")
	})
	o("removes html", function() {
		var vnode = {tag: "<", children: "<a></a><b></b>"}
		var updated = {tag: "<", children: ""}

		render(root, [vnode])
		render(root, [updated])

		o(updated.dom).equals(null)
		o(updated.domSize).equals(0)
		o(root.childNodes.length).equals(0)
	})
	function childKeysOf(elem, key) {
		var keys = key.split(".")
		var result = []
		for (var i = 0; i < elem.childNodes.length; i++) {
			var child = elem.childNodes[i]
			for (var j = 0; j < keys.length; j++) child = child[keys[j]]
			result.push(child)
		}
		return result
	}
	o("updates the dom correctly with a contenteditable parent", function() {
		var div = {tag: "div", attrs: {contenteditable: true}, children: [{tag: "<", children: "<a></a>"}]}

		render(root, div)
		o(childKeysOf(div.dom, "nodeName")).deepEquals(["A"])
	})
	o("updates dom with multiple text children", function() {
		var vnode = [{tag: "#", children: "a"}, {tag: "<", children: "<a></a>"}, {tag: "<", children: "<b></b>"}]
		var replacement = [{tag: "#", children: "a"}, {tag: "<", children: "<c></c>"}, {tag: "<", children: "<d></d>"}]

		render(root, vnode)
		render(root, replacement)

		o(childKeysOf(root, "nodeName")).deepEquals(["#text", "C", "D"])
	})
	o("updates dom with multiple text children in other parents", function() {
		var vnode = [
			{tag: "div", attrs: {}, children: [{tag: "#", children: "a"}, {tag: "<", children: "<a></a>"}]},
			{tag: "div", attrs: {}, children: [{tag: "#", children: "b"}, {tag: "<", children: "<b></b>"}]},
		]
		var replacement = [
			{tag: "div", attrs: {}, children: [{tag: "#", children: "c"}, {tag: "<", children: "<c></c>"}]},
			{tag: "div", attrs: {}, children: [{tag: "#", children: "d"}, {tag: "<", children: "<d></d>"}]},
		]

		render(root, vnode)
		render(root, replacement)

		o(childKeysOf(root, "nodeName")).deepEquals(["DIV", "DIV"])
		o(childKeysOf(root.childNodes[0], "nodeName")).deepEquals(["#text", "C"])
		o(root.childNodes[0].firstChild.nodeValue).equals("c")
		o(childKeysOf(root.childNodes[1], "nodeName")).deepEquals(["#text", "D"])
		o(root.childNodes[1].firstChild.nodeValue).equals("d")
	})
	o("correctly diffs if followed by another trusted vnode", function() {
		render(root, [
			{tag: "<", children: "<span>A</span>"},
			{tag: "<", children: "<span>A</span>"},
		])
		o(childKeysOf(root, "nodeName")).deepEquals(["SPAN", "SPAN"])
		o(childKeysOf(root, "firstChild.nodeValue")).deepEquals(["A", "A"])
		render(root, [
			{tag: "<", children: "<span>B</span>"},
			{tag: "<", children: "<span>A</span>"},
		])
		o(childKeysOf(root, "nodeName")).deepEquals(["SPAN", "SPAN"])
		o(childKeysOf(root, "firstChild.nodeValue")).deepEquals(["B", "A"])
		render(root, [
			{tag: "<", children: "<span>B</span>"},
			{tag: "<", children: "<span>B</span>"},
		])
		o(childKeysOf(root, "nodeName")).deepEquals(["SPAN", "SPAN"])
		o(childKeysOf(root, "firstChild.nodeValue")).deepEquals(["B", "B"])
	})
})
