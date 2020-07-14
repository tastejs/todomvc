"use strict"

var o = require("../../ospec/ospec")
var domMock = require("../../test-utils/domMock")
var vdom = require("../../render/render")

o.spec("createNodes", function() {
	var $window, root, render
	o.beforeEach(function() {
		$window = domMock()
		root = $window.document.createElement("div")
		render = vdom($window)
	})

	o("creates nodes", function() {
		var vnodes = [
			{tag: "a"},
			{tag: "#", children: "b"},
			{tag: "<", children: "c"},
			{tag: "[", children: [{tag: "#", children: "d"}]},
		]
		render(root, vnodes)

		o(root.childNodes.length).equals(4)
		o(root.childNodes[0].nodeName).equals("A")
		o(root.childNodes[1].nodeValue).equals("b")
		o(root.childNodes[2].nodeValue).equals("c")
		o(root.childNodes[3].nodeValue).equals("d")
	})
	o("ignores null", function() {
		var vnodes = [
			{tag: "a"},
			{tag: "#", children: "b"},
			null,
			{tag: "<", children: "c"},
			{tag: "[", children: [{tag: "#", children: "d"}]},
		]
		render(root, vnodes)

		o(root.childNodes.length).equals(4)
		o(root.childNodes[0].nodeName).equals("A")
		o(root.childNodes[1].nodeValue).equals("b")
		o(root.childNodes[2].nodeValue).equals("c")
		o(root.childNodes[3].nodeValue).equals("d")
	})
	o("ignores undefined", function() {
		var vnodes = [
			{tag: "a"},
			{tag: "#", children: "b"},
			undefined,
			{tag: "<", children: "c"},
			{tag: "[", children: [{tag: "#", children: "d"}]},
		]
		render(root, vnodes)

		o(root.childNodes.length).equals(4)
		o(root.childNodes[0].nodeName).equals("A")
		o(root.childNodes[1].nodeValue).equals("b")
		o(root.childNodes[2].nodeValue).equals("c")
		o(root.childNodes[3].nodeValue).equals("d")
	})
})
