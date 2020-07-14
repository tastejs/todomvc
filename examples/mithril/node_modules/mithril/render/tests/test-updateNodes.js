"use strict"

var o = require("../../ospec/ospec")
var components = require("../../test-utils/components")
var domMock = require("../../test-utils/domMock")
var vdom = require("../../render/render")

o.spec("updateNodes", function() {
	var $window, root, render
	o.beforeEach(function() {
		$window = domMock()
		root = $window.document.createElement("div")
		render = vdom($window)
	})

	o("handles el noop", function() {
		var vnodes = [{tag: "a", key: 1}, {tag: "b", key: 2}]
		var updated = [{tag: "a", key: 1}, {tag: "b", key: 2}]

		render(root, vnodes)
		render(root, updated)

		o(root.childNodes.length).equals(2)
		o(updated[0].dom.nodeName).equals("A")
		o(updated[0].dom).equals(root.childNodes[0])
		o(updated[1].dom.nodeName).equals("B")
		o(updated[1].dom).equals(root.childNodes[1])
	})
	o("handles el noop without key", function() {
		var vnodes = [{tag: "a"}, {tag: "b"}]
		var updated = [{tag: "a"}, {tag: "b"}]

		render(root, vnodes)
		render(root, updated)

		o(root.childNodes.length).equals(2)
		o(updated[0].dom.nodeName).equals("A")
		o(updated[0].dom).equals(root.childNodes[0])
		o(updated[1].dom.nodeName).equals("B")
		o(updated[1].dom).equals(root.childNodes[1])
	})
	o("handles text noop", function() {
		var vnodes = [{tag: "#", children: "a"}]
		var updated = [{tag: "#", children: "a"}]

		render(root, vnodes)
		render(root, updated)

		o(root.childNodes.length).equals(1)
		o(updated[0].dom.nodeValue).equals("a")
		o(updated[0].dom).equals(root.childNodes[0])
	})
	o("handles text noop w/ type casting", function() {
		var vnodes = [{tag: "#", children: 1}]
		var updated = [{tag: "#", children: "1"}]

		render(root, vnodes)
		render(root, updated)

		o(root.childNodes.length).equals(1)
		o(updated[0].dom.nodeValue).equals("1")
		o(updated[0].dom).equals(root.childNodes[0])
	})
	o("handles falsy text noop w/ type casting", function() {
		var vnodes = [{tag: "#", children: 0}]
		var updated = [{tag: "#", children: "0"}]

		render(root, vnodes)
		render(root, updated)

		o(root.childNodes.length).equals(1)
		o(updated[0].dom.nodeValue).equals("0")
		o(updated[0].dom).equals(root.childNodes[0])
	})
	o("handles html noop", function() {
		var vnodes = [{tag: "<", children: "a"}]
		var updated = [{tag: "<", children: "a"}]

		render(root, vnodes)
		render(root, updated)

		o(root.childNodes.length).equals(1)
		o(updated[0].dom.nodeValue).equals("a")
		o(updated[0].dom).equals(root.childNodes[0])
	})
	o("handles fragment noop", function() {
		var vnodes = [{tag: "[", children: [{tag: "a"}]}]
		var updated = [{tag: "[", children: [{tag: "a"}]}]

		render(root, vnodes)
		render(root, updated)

		o(root.childNodes.length).equals(1)
		o(updated[0].dom.nodeName).equals("A")
		o(updated[0].dom).equals(root.childNodes[0])
	})
	o("handles fragment noop w/ text child", function() {
		var vnodes = [{tag: "[", children: [{tag: "#", children: "a"}]}]
		var updated = [{tag: "[", children: [{tag: "#", children: "a"}]}]

		render(root, vnodes)
		render(root, updated)

		o(root.childNodes.length).equals(1)
		o(updated[0].dom.nodeValue).equals("a")
		o(updated[0].dom).equals(root.childNodes[0])
	})
	o("handles undefined to null noop", function() {
		var vnodes = [null, {tag: "div"}]
		var updated = [undefined, {tag: "div"}]

		render(root, vnodes)
		render(root, updated)

		o(root.childNodes.length).equals(1)
	})
	o("reverses els w/ even count", function() {
		var vnodes = [{tag: "a", key: 1}, {tag: "b", key: 2}, {tag: "i", key: 3}, {tag: "s", key: 4}]
		var updated = [{tag: "s", key: 4}, {tag: "i", key: 3}, {tag: "b", key: 2}, {tag: "a", key: 1}]

		render(root, vnodes)
		render(root, updated)

		o(root.childNodes.length).equals(4)
		o(updated[0].dom.nodeName).equals("S")
		o(updated[0].dom).equals(root.childNodes[0])
		o(updated[1].dom.nodeName).equals("I")
		o(updated[1].dom).equals(root.childNodes[1])
		o(updated[2].dom.nodeName).equals("B")
		o(updated[2].dom).equals(root.childNodes[2])
		o(updated[3].dom.nodeName).equals("A")
		o(updated[3].dom).equals(root.childNodes[3])
	})
	o("reverses els w/ odd count", function() {
		var vnodes = [{tag: "a", key: 1}, {tag: "b", key: 2}, {tag: "i", key: 3}]
		var updated = [{tag: "i", key: 3}, {tag: "b", key: 2}, {tag: "a", key: 1}]
		var expectedTags = updated.map(function(vn) {return vn.tag})
		render(root, vnodes)
		render(root, updated)

		var tagNames = [].map.call(root.childNodes, function(n) {return n.nodeName.toLowerCase()})

		o(root.childNodes.length).equals(3)
		o(updated[0].dom.nodeName).equals("I")
		o(updated[1].dom.nodeName).equals("B")
		o(updated[2].dom.nodeName).equals("A")
		o(tagNames).deepEquals(expectedTags)
	})
	o("creates el at start", function() {
		var vnodes = [{tag: "a", key: 1}]
		var updated = [{tag: "b", key: 2}, {tag: "a", key: 1}]

		render(root, vnodes)
		render(root, updated)

		o(root.childNodes.length).equals(2)
		o(updated[0].dom.nodeName).equals("B")
		o(updated[0].dom).equals(root.childNodes[0])
		o(updated[1].dom.nodeName).equals("A")
		o(updated[1].dom).equals(root.childNodes[1])
	})
	o("creates el at end", function() {
		var vnodes = [{tag: "a", key: 1}]
		var updated = [{tag: "a", key: 1}, {tag: "b", key: 2}]

		render(root, vnodes)
		render(root, updated)

		o(root.childNodes.length).equals(2)
		o(updated[0].dom.nodeName).equals("A")
		o(updated[0].dom).equals(root.childNodes[0])
		o(updated[1].dom.nodeName).equals("B")
		o(updated[1].dom).equals(root.childNodes[1])
	})
	o("creates el in middle", function() {
		var vnodes = [{tag: "a", key: 1}, {tag: "b", key: 2}]
		var updated = [{tag: "a", key: 1}, {tag: "i", key: 3}, {tag: "b", key: 2}]

		render(root, vnodes)
		render(root, updated)

		o(updated[0].dom.nodeName).equals("A")
		o(updated[0].dom).equals(root.childNodes[0])
		o(updated[1].dom.nodeName).equals("I")
		o(updated[1].dom).equals(root.childNodes[1])
		o(updated[2].dom.nodeName).equals("B")
		o(updated[2].dom).equals(root.childNodes[2])
	})
	o("creates el while reversing", function() {
		var vnodes = [{tag: "a", key: 1}, {tag: "b", key: 2}]
		var updated = [{tag: "b", key: 2}, {tag: "i", key: 3}, {tag: "a", key: 1}]

		render(root, vnodes)
		render(root, updated)

		o(root.childNodes.length).equals(3)
		o(updated[0].dom.nodeName).equals("B")
		o(updated[0].dom).equals(root.childNodes[0])
		o(updated[1].dom.nodeName).equals("I")
		o(updated[1].dom).equals(root.childNodes[1])
		o(updated[2].dom.nodeName).equals("A")
		o(updated[2].dom).equals(root.childNodes[2])
	})
	o("deletes el at start", function() {
		var vnodes = [{tag: "b", key: 2}, {tag: "a", key: 1}]
		var updated = [{tag: "a", key: 1}]

		render(root, vnodes)
		render(root, updated)

		o(root.childNodes.length).equals(1)
		o(updated[0].dom.nodeName).equals("A")
		o(updated[0].dom).equals(root.childNodes[0])
	})
	o("deletes el at end", function() {
		var vnodes = [{tag: "a", key: 1}, {tag: "b", key: 2}]
		var updated = [{tag: "a", key: 1}]

		render(root, vnodes)
		render(root, updated)

		o(root.childNodes.length).equals(1)
		o(updated[0].dom.nodeName).equals("A")
		o(updated[0].dom).equals(root.childNodes[0])
	})
	o("deletes el at middle", function() {
		var vnodes = [{tag: "a", key: 1}, {tag: "i", key: 3}, {tag: "b", key: 2}]
		var updated = [{tag: "a", key: 1}, {tag: "b", key: 2}]

		render(root, vnodes)
		render(root, updated)

		o(root.childNodes.length).equals(2)
		o(updated[0].dom.nodeName).equals("A")
		o(updated[0].dom).equals(root.childNodes[0])
		o(updated[1].dom.nodeName).equals("B")
		o(updated[1].dom).equals(root.childNodes[1])
	})
	o("deletes el while reversing", function() {
		var vnodes = [{tag: "a", key: 1}, {tag: "i", key: 3}, {tag: "b", key: 2}]
		var updated = [{tag: "b", key: 2}, {tag: "a", key: 1}]

		render(root, vnodes)
		render(root, updated)

		o(root.childNodes.length).equals(2)
		o(updated[0].dom.nodeName).equals("B")
		o(updated[0].dom).equals(root.childNodes[0])
		o(updated[1].dom.nodeName).equals("A")
		o(updated[1].dom).equals(root.childNodes[1])
	})
	o("creates, deletes, reverses els at same time", function() {
		var vnodes = [{tag: "a", key: 1}, {tag: "i", key: 3}, {tag: "b", key: 2}]
		var updated = [{tag: "b", key: 2}, {tag: "a", key: 1}, {tag: "s", key: 4}]

		render(root, vnodes)
		render(root, updated)

		o(root.childNodes.length).equals(3)
		o(updated[0].dom.nodeName).equals("B")
		o(updated[0].dom).equals(root.childNodes[0])
		o(updated[1].dom.nodeName).equals("A")
		o(updated[1].dom).equals(root.childNodes[1])
		o(updated[2].dom.nodeName).equals("S")
		o(updated[2].dom).equals(root.childNodes[2])
	})
	o("creates, deletes, reverses els at same time with '__proto__' key", function() {
		var vnodes = [{tag: "a", key: "__proto__"}, {tag: "i", key: 3}, {tag: "b", key: 2}]
		var updated = [{tag: "b", key: 2}, {tag: "a", key: "__proto__"}, {tag: "s", key: 4}]

		render(root, vnodes)
		render(root, updated)

		o(root.childNodes.length).equals(3)
		o(updated[0].dom.nodeName).equals("B")
		o(updated[0].dom).equals(root.childNodes[0])
		o(updated[1].dom.nodeName).equals("A")
		o(updated[1].dom).equals(root.childNodes[1])
		o(updated[2].dom.nodeName).equals("S")
		o(updated[2].dom).equals(root.childNodes[2])
	})
	o("adds to empty array followed by el", function() {
		var vnodes = [{tag: "[", key: 1, children: []}, {tag: "b", key: 2}]
		var updated = [{tag: "[", key: 1, children: [{tag: "a"}]}, {tag: "b", key: 2}]

		render(root, vnodes)
		render(root, updated)

		o(root.childNodes.length).equals(2)
		o(updated[0].children[0].dom.nodeName).equals("A")
		o(updated[0].children[0].dom).equals(root.childNodes[0])
		o(updated[1].dom.nodeName).equals("B")
		o(updated[1].dom).equals(root.childNodes[1])
	})
	o("reverses followed by el", function() {
		var vnodes = [{tag: "[", key: 1, children: [{tag: "a", key: 2}, {tag: "b", key: 3}]}, {tag: "i", key: 4}]
		var updated = [{tag: "[", key: 1, children: [{tag: "b", key: 3}, {tag: "a", key: 2}]}, {tag: "i", key: 4}]

		render(root, vnodes)
		render(root, updated)

		o(root.childNodes.length).equals(3)
		o(updated[0].children[0].dom.nodeName).equals("B")
		o(updated[0].children[0].dom).equals(root.childNodes[0])
		o(updated[0].children[1].dom.nodeName).equals("A")
		o(updated[0].children[1].dom).equals(root.childNodes[1])
		o(updated[1].dom.nodeName).equals("I")
		o(updated[1].dom).equals(root.childNodes[2])
	})
	o("updates empty array to html with same key", function() {
		var vnodes = [{tag: "[", key: 1, children: []}]
		var updated = [{tag: "<", key: 1, children: "<a></a><b></b>"}]

		render(root, vnodes)
		render(root, updated)

		o(root.childNodes.length).equals(2)
		o(updated[0].dom.nodeName).equals("A")
		o(updated[0].dom).equals(root.childNodes[0])
		o(updated[0].domSize).equals(2)
		o(updated[0].dom.nextSibling.nodeName).equals("B")
		o(updated[0].dom.nextSibling).equals(root.childNodes[1])
	})
	o("updates empty html to array with same key", function() {
		var vnodes = [{tag: "<", key: 1, children: ""}]
		var updated = [{tag: "[", key: 1, children: [{tag: "a"}, {tag: "b"}]}]

		render(root, vnodes)
		render(root, updated)

		o(root.childNodes.length).equals(2)
		o(updated[0].dom.nodeName).equals("A")
		o(updated[0].dom).equals(root.childNodes[0])
		o(updated[0].domSize).equals(2)
		o(updated[0].dom.nextSibling.nodeName).equals("B")
		o(updated[0].dom.nextSibling).equals(root.childNodes[1])
	})
	o("updates empty array to html without key", function() {
		var vnodes = [{tag: "[", children: []}]
		var updated = [{tag: "<", children: "<a></a><b></b>"}]

		render(root, vnodes)
		render(root, updated)

		o(root.childNodes.length).equals(2)
		o(updated[0].dom.nodeName).equals("A")
		o(updated[0].dom).equals(root.childNodes[0])
		o(updated[0].domSize).equals(2)
		o(updated[0].dom.nextSibling.nodeName).equals("B")
		o(updated[0].dom.nextSibling).equals(root.childNodes[1])
	})
	o("updates empty html to array without key", function() {
		var vnodes = [{tag: "<", children: ""}]
		var updated = [{tag: "[", children: [{tag: "a"}, {tag: "b"}]}]

		render(root, vnodes)
		render(root, updated)

		o(root.childNodes.length).equals(2)
		o(updated[0].dom.nodeName).equals("A")
		o(updated[0].dom).equals(root.childNodes[0])
		o(updated[0].domSize).equals(2)
		o(updated[0].dom.nextSibling.nodeName).equals("B")
		o(updated[0].dom.nextSibling).equals(root.childNodes[1])
	})
	o("updates array to html with same key", function() {
		var vnodes = [{tag: "[", key: 1, children: [{tag: "a"}, {tag: "b"}]}]
		var updated = [{tag: "<", key: 1, children: "<i></i><s></s>"}]

		render(root, vnodes)
		render(root, updated)

		o(root.childNodes.length).equals(2)
		o(updated[0].dom.nodeName).equals("I")
		o(updated[0].dom).equals(root.childNodes[0])
		o(updated[0].domSize).equals(2)
		o(updated[0].dom.nextSibling.nodeName).equals("S")
		o(updated[0].dom.nextSibling).equals(root.childNodes[1])
	})
	o("updates html to array with same key", function() {
		var vnodes = [{tag: "<", key: 1, children: "<a></a><b></b>"}]
		var updated = [{tag: "[", key: 1, children: [{tag: "i"}, {tag: "s"}]}]

		render(root, vnodes)
		render(root, updated)

		o(root.childNodes.length).equals(2)
		o(updated[0].dom.nodeName).equals("I")
		o(updated[0].dom).equals(root.childNodes[0])
		o(updated[0].domSize).equals(2)
		o(updated[0].dom.nextSibling.nodeName).equals("S")
		o(updated[0].dom.nextSibling).equals(root.childNodes[1])
	})
	o("updates array to html without key", function() {
		var vnodes = [{tag: "[", children: [{tag: "a"}, {tag: "b"}]}]
		var updated = [{tag: "<", children: "<i></i><s></s>"}]

		render(root, vnodes)
		render(root, updated)

		o(root.childNodes.length).equals(2)
		o(updated[0].dom.nodeName).equals("I")
		o(updated[0].dom).equals(root.childNodes[0])
		o(updated[0].domSize).equals(2)
		o(updated[0].dom.nextSibling.nodeName).equals("S")
		o(updated[0].dom.nextSibling).equals(root.childNodes[1])
	})
	o("updates html to array without key", function() {
		var vnodes = [{tag: "<", children: "<a></a><b></b>"}]
		var updated = [{tag: "[", children: [{tag: "i"}, {tag: "s"}]}]

		render(root, vnodes)
		render(root, updated)

		o(root.childNodes.length).equals(2)
		o(updated[0].dom.nodeName).equals("I")
		o(updated[0].dom).equals(root.childNodes[0])
		o(updated[0].domSize).equals(2)
		o(updated[0].dom.nextSibling.nodeName).equals("S")
		o(updated[0].dom.nextSibling).equals(root.childNodes[1])
	})
	o("updates empty array to html with same key followed by el", function() {
		var vnodes = [{tag: "[", key: 1, children: []}, {tag: "i", key: 2}]
		var updated = [{tag: "<", key: 1, children: "<a></a><b></b>"}, {tag: "i", key: 2}]

		render(root, vnodes)
		render(root, updated)

		o(root.childNodes.length).equals(3)
		o(updated[0].dom.nodeName).equals("A")
		o(updated[0].dom).equals(root.childNodes[0])
		o(updated[0].domSize).equals(2)
		o(updated[0].dom.nextSibling.nodeName).equals("B")
		o(updated[0].dom.nextSibling).equals(root.childNodes[1])
		o(updated[1].dom.nodeName).equals("I")
		o(updated[1].dom).equals(root.childNodes[2])
	})
	o("updates empty html to array with same key followed by el", function() {
		var vnodes = [{tag: "[", key: 1, children: []}, {tag: "i", key: 2}]
		var updated = [{tag: "<", key: 1, children: "<a></a><b></b>"}, {tag: "i", key: 2}]

		render(root, vnodes)
		render(root, updated)

		o(root.childNodes.length).equals(3)
		o(updated[0].dom.nodeName).equals("A")
		o(updated[0].dom).equals(root.childNodes[0])
		o(updated[0].domSize).equals(2)
		o(updated[0].dom.nextSibling.nodeName).equals("B")
		o(updated[0].dom.nextSibling).equals(root.childNodes[1])
		o(updated[1].dom.nodeName).equals("I")
		o(updated[1].dom).equals(root.childNodes[2])
	})
	o("populates array followed by el keyed", function() {
		var vnodes = [{tag: "[", key: 1, children: []}, {tag: "i", key: 2}]
		var updated = [{tag: "[", key: 1, children: [{tag: "a"}, {tag: "b"}]}, {tag: "i", key: 2}]

		render(root, vnodes)
		render(root, updated)

		o(root.childNodes.length).equals(3)
		o(updated[0].dom.nodeName).equals("A")
		o(updated[0].dom).equals(root.childNodes[0])
		o(updated[0].domSize).equals(2)
		o(updated[0].dom.nextSibling.nodeName).equals("B")
		o(updated[0].dom.nextSibling).equals(root.childNodes[1])
		o(updated[1].dom.nodeName).equals("I")
		o(updated[1].dom).equals(root.childNodes[2])
	})
	o("throws populates array followed by el keyed", function() {
		var vnodes = [{tag: "[", key: 1, children: []}, {tag: "i", key: 2}]
		var updated = [{tag: "[", key: 1, children: [{tag: "a"}, {tag: "b"}]}, {tag: "i", key: 2}]

		render(root, vnodes)
		render(root, updated)

		o(root.childNodes.length).equals(3)
		o(updated[0].dom.nodeName).equals("A")
		o(updated[0].dom).equals(root.childNodes[0])
		o(updated[0].domSize).equals(2)
		o(updated[0].dom.nextSibling.nodeName).equals("B")
		o(updated[0].dom.nextSibling).equals(root.childNodes[1])
		o(updated[1].dom.nodeName).equals("I")
		o(updated[1].dom).equals(root.childNodes[2])
	})
	o("throws if array followed by null then el on first render keyed", function() {
		var vnodes = [{tag: "[", key: 1, children: []}, null, {tag: "i", key: 2}]

		o(function () { render(root, vnodes) }).throws(TypeError)
	})
	o("throws if array followed by null then el on next render keyed", function() {
		var vnodes = [{tag: "[", key: 1, children: []}, {tag: "i", key: 2}]
		var updated = [{tag: "[", key: 1, children: [{tag: "a"}, {tag: "b"}]}, null, {tag: "i", key: 2}]

		render(root, vnodes)
		o(function () { render(root, updated) }).throws(TypeError)
	})
	o("populates childless array replaced followed by el keyed", function() {
		var vnodes = [{tag: "[", key: 1}, {tag: "i", key: 2}]
		var updated = [{tag: "[", key: 1, children: [{tag: "a"}, {tag: "b"}]}, {tag: "i", key: 2}]

		render(root, vnodes)
		render(root, updated)

		o(root.childNodes.length).equals(3)
		o(updated[0].dom.nodeName).equals("A")
		o(updated[0].dom).equals(root.childNodes[0])
		o(updated[0].domSize).equals(2)
		o(updated[0].dom.nextSibling.nodeName).equals("B")
		o(updated[0].dom.nextSibling).equals(root.childNodes[1])
		o(updated[1].dom.nodeName).equals("I")
		o(updated[1].dom).equals(root.childNodes[2])
	})
	o("throws if childless array replaced followed by null then el keyed", function() {
		var vnodes = [{tag: "[", key: 1}, {tag: "i", key: 2}]
		var updated = [{tag: "[", key: 1, children: [{tag: "a"}, {tag: "b"}]}, null, {tag: "i", key: 2}]

		render(root, vnodes)
		o(function () { render(root, updated) }).throws(TypeError)
	})
	o("moves from end to start", function() {
		var vnodes = [{tag: "a", key: 1}, {tag: "b", key: 2}, {tag: "i", key: 3}, {tag: "s", key: 4}]
		var updated = [{tag: "s", key: 4}, {tag: "a", key: 1}, {tag: "b", key: 2}, {tag: "i", key: 3}]

		render(root, vnodes)
		render(root, updated)

		o(root.childNodes.length).equals(4)
		o(updated[0].dom.nodeName).equals("S")
		o(updated[0].dom).equals(root.childNodes[0])
		o(updated[1].dom.nodeName).equals("A")
		o(updated[1].dom).equals(root.childNodes[1])
		o(updated[2].dom.nodeName).equals("B")
		o(updated[2].dom).equals(root.childNodes[2])
		o(updated[3].dom.nodeName).equals("I")
		o(updated[3].dom).equals(root.childNodes[3])
	})
	o("moves from start to end", function() {
		var vnodes = [{tag: "a", key: 1}, {tag: "b", key: 2}, {tag: "i", key: 3}, {tag: "s", key: 4}]
		var updated = [{tag: "b", key: 2}, {tag: "i", key: 3}, {tag: "s", key: 4}, {tag: "a", key: 1}]

		render(root, vnodes)
		render(root, updated)

		o(root.childNodes.length).equals(4)
		o(updated[0].dom.nodeName).equals("B")
		o(updated[0].dom).equals(root.childNodes[0])
		o(updated[1].dom.nodeName).equals("I")
		o(updated[1].dom).equals(root.childNodes[1])
		o(updated[2].dom.nodeName).equals("S")
		o(updated[2].dom).equals(root.childNodes[2])
		o(updated[3].dom.nodeName).equals("A")
		o(updated[3].dom).equals(root.childNodes[3])
	})
	o("removes then recreate", function() {
		var vnodes = [{tag: "a", key: 1}, {tag: "b", key: 2}, {tag: "i", key: 3}, {tag: "s", key: 4}]
		var temp = []
		var updated = [{tag: "a", key: 1}, {tag: "b", key: 2}, {tag: "i", key: 3}, {tag: "s", key: 4}]

		render(root, vnodes)
		render(root, temp)
		render(root, updated)

		o(root.childNodes.length).equals(4)
		o(updated[0].dom.nodeName).equals("A")
		o(updated[0].dom).equals(root.childNodes[0])
		o(updated[1].dom.nodeName).equals("B")
		o(updated[1].dom).equals(root.childNodes[1])
		o(updated[2].dom.nodeName).equals("I")
		o(updated[2].dom).equals(root.childNodes[2])
		o(updated[3].dom.nodeName).equals("S")
		o(updated[3].dom).equals(root.childNodes[3])
	})
	o("removes then recreate reversed", function() {
		var vnodes = [{tag: "a", key: 1}, {tag: "b", key: 2}, {tag: "i", key: 3}, {tag: "s", key: 4}]
		var temp = []
		var updated = [{tag: "s", key: 4}, {tag: "i", key: 3}, {tag: "b", key: 2}, {tag: "a", key: 1}]

		render(root, vnodes)
		render(root, temp)
		render(root, updated)

		o(root.childNodes.length).equals(4)
		o(updated[0].dom.nodeName).equals("S")
		o(updated[0].dom).equals(root.childNodes[0])
		o(updated[1].dom.nodeName).equals("I")
		o(updated[1].dom).equals(root.childNodes[1])
		o(updated[2].dom.nodeName).equals("B")
		o(updated[2].dom).equals(root.childNodes[2])
		o(updated[3].dom.nodeName).equals("A")
		o(updated[3].dom).equals(root.childNodes[3])
	})
	o("removes then recreate smaller", function() {
		var vnodes = [{tag: "a", key: 1}, {tag: "b", key: 2}]
		var temp = []
		var updated = [{tag: "a", key: 1}]

		render(root, vnodes)
		render(root, temp)
		render(root, updated)

		o(root.childNodes.length).equals(1)
		o(updated[0].dom.nodeName).equals("A")
		o(updated[0].dom).equals(root.childNodes[0])
	})
	o("removes then recreate bigger", function() {
		var vnodes = [{tag: "a", key: 1}, {tag: "b", key: 2}]
		var temp = []
		var updated = [{tag: "a", key: 1}, {tag: "b", key: 2}, {tag: "i", key: 3}]

		render(root, vnodes)
		render(root, temp)
		render(root, updated)

		o(root.childNodes.length).equals(3)
		o(updated[0].dom.nodeName).equals("A")
		o(updated[0].dom).equals(root.childNodes[0])
		o(updated[1].dom.nodeName).equals("B")
		o(updated[1].dom).equals(root.childNodes[1])
		o(updated[2].dom.nodeName).equals("I")
		o(updated[2].dom).equals(root.childNodes[2])
	})
	o("removes then create different", function() {
		var vnodes = [{tag: "a", key: 1}, {tag: "b", key: 2}]
		var temp = []
		var updated = [{tag: "i", key: 3}, {tag: "s", key: 4}]

		render(root, vnodes)
		render(root, temp)
		render(root, updated)

		o(root.childNodes.length).equals(2)
		o(updated[0].dom.nodeName).equals("I")
		o(updated[0].dom).equals(root.childNodes[0])
		o(updated[1].dom.nodeName).equals("S")
		o(updated[1].dom).equals(root.childNodes[1])
	})
	o("removes then create different smaller", function() {
		var vnodes = [{tag: "a", key: 1}, {tag: "b", key: 2}]
		var temp = []
		var updated = [{tag: "i", key: 3}]

		render(root, vnodes)
		render(root, temp)
		render(root, updated)

		o(root.childNodes.length).equals(1)
		o(updated[0].dom.nodeName).equals("I")
		o(updated[0].dom).equals(root.childNodes[0])
	})
	o("cached keyed nodes move when the list is reversed", function(){
		var a = {tag: "a", key: "a"}
		var b = {tag: "b", key: "b"}
		var c = {tag: "c", key: "c"}
		var d = {tag: "d", key: "d"}

		render(root, [a, b, c, d])
		render(root, [d, c, b, a])

		o(root.childNodes.length).equals(4)
		o(root.childNodes[0].nodeName).equals("D")
		o(root.childNodes[1].nodeName).equals("C")
		o(root.childNodes[2].nodeName).equals("B")
		o(root.childNodes[3].nodeName).equals("A")
	})
	o("cached keyed nodes move when diffed via the map", function() {
		var onupdate = o.spy()
		var a = {tag: "a", key: "a", attrs: {onupdate: onupdate}}
		var b = {tag: "b", key: "b", attrs: {onupdate: onupdate}}
		var c = {tag: "c", key: "c", attrs: {onupdate: onupdate}}
		var d = {tag: "d", key: "d", attrs: {onupdate: onupdate}}

		render(root, [a, b, c, d])
		render(root, [b, d, a, c])

		o(root.childNodes.length).equals(4)
		o(root.childNodes[0].nodeName).equals("B")
		o(root.childNodes[1].nodeName).equals("D")
		o(root.childNodes[2].nodeName).equals("A")
		o(root.childNodes[3].nodeName).equals("C")
		o(onupdate.callCount).equals(0)
	})
	o("removes then create different bigger", function() {
		var vnodes = [{tag: "a", key: 1}, {tag: "b", key: 2}]
		var temp = []
		var updated = [{tag: "i", key: 3}, {tag: "s", key: 4}, {tag: "div", key: 5}]

		render(root, vnodes)
		render(root, temp)
		render(root, updated)

		o(root.childNodes.length).equals(3)
		o(updated[0].dom.nodeName).equals("I")
		o(updated[0].dom).equals(root.childNodes[0])
		o(updated[1].dom.nodeName).equals("S")
		o(updated[1].dom).equals(root.childNodes[1])
		o(updated[2].dom.nodeName).equals("DIV")
		o(updated[2].dom).equals(root.childNodes[2])
	})
	o("removes then create mixed", function() {
		var vnodes = [{tag: "a", key: 1}, {tag: "b", key: 2}]
		var temp = []
		var updated = [{tag: "a", key: 1}, {tag: "s", key: 4}]

		render(root, vnodes)
		render(root, temp)
		render(root, updated)

		o(root.childNodes.length).equals(2)
		o(updated[0].dom.nodeName).equals("A")
		o(updated[0].dom).equals(root.childNodes[0])
		o(updated[1].dom.nodeName).equals("S")
		o(updated[1].dom).equals(root.childNodes[1])
	})
	o("removes then create mixed reversed", function() {
		var vnodes = [{tag: "a", key: 1}, {tag: "b", key: 2}]
		var temp = []
		var updated = [{tag: "s", key: 4}, {tag: "a", key: 1}]

		render(root, vnodes)
		render(root, temp)
		render(root, updated)

		o(root.childNodes.length).equals(2)
		o(updated[0].dom.nodeName).equals("S")
		o(updated[0].dom).equals(root.childNodes[0])
		o(updated[1].dom.nodeName).equals("A")
		o(updated[1].dom).equals(root.childNodes[1])
	})
	o("removes then create mixed smaller", function() {
		var vnodes = [{tag: "a", key: 1}, {tag: "b", key: 2}, {tag: "i", key: 3}]
		var temp = []
		var updated = [{tag: "a", key: 1}, {tag: "s", key: 4}]

		render(root, vnodes)
		render(root, temp)
		render(root, updated)

		o(root.childNodes.length).equals(2)
		o(updated[0].dom.nodeName).equals("A")
		o(updated[0].dom).equals(root.childNodes[0])
		o(updated[1].dom.nodeName).equals("S")
		o(updated[1].dom).equals(root.childNodes[1])
	})
	o("removes then create mixed smaller reversed", function() {
		var vnodes = [{tag: "a", key: 1}, {tag: "b", key: 2}, {tag: "i", key: 3}]
		var temp = []
		var updated = [{tag: "s", key: 4}, {tag: "a", key: 1}]

		render(root, vnodes)
		render(root, temp)
		render(root, updated)

		o(root.childNodes.length).equals(2)
		o(updated[0].dom.nodeName).equals("S")
		o(updated[0].dom).equals(root.childNodes[0])
		o(updated[1].dom.nodeName).equals("A")
		o(updated[1].dom).equals(root.childNodes[1])
	})
	o("removes then create mixed bigger", function() {
		var vnodes = [{tag: "a", key: 1}, {tag: "b", key: 2}]
		var temp = []
		var updated = [{tag: "a", key: 1}, {tag: "i", key: 3}, {tag: "s", key: 4}]

		render(root, vnodes)
		render(root, temp)
		render(root, updated)

		o(root.childNodes.length).equals(3)
		o(updated[0].dom.nodeName).equals("A")
		o(updated[0].dom).equals(root.childNodes[0])
		o(updated[1].dom.nodeName).equals("I")
		o(updated[1].dom).equals(root.childNodes[1])
		o(updated[2].dom.nodeName).equals("S")
		o(updated[2].dom).equals(root.childNodes[2])
	})
	o("removes then create mixed bigger reversed", function() {
		var vnodes = [{tag: "a", key: 1}, {tag: "b", key: 2}]
		var temp = []
		var updated = [{tag: "s", key: 4}, {tag: "i", key: 3}, {tag: "a", key: 1}]

		render(root, vnodes)
		render(root, temp)
		render(root, updated)

		o(root.childNodes.length).equals(3)
		o(updated[0].dom.nodeName).equals("S")
		o(updated[0].dom).equals(root.childNodes[0])
		o(updated[1].dom.nodeName).equals("I")
		o(updated[1].dom).equals(root.childNodes[1])
		o(updated[2].dom.nodeName).equals("A")
		o(updated[2].dom).equals(root.childNodes[2])
	})
	o("change type, position and length", function() {
		var vnodes = {tag: "div", children: [
			undefined,
			{tag: "#", children: "a"}
		]}
		var updated = {tag: "div", children: [
			{tag: "[", children: [{tag: "#", children: "b"}]},
			undefined,
			undefined
		]}

		render(root, vnodes)
		render(root, updated)

		o(root.firstChild.childNodes.length).equals(1)
	})
	o("removes then recreates then reverses children", function() {
		var vnodes = [{tag: "a", key: 1, children: [{tag: "i", key: 3}, {tag: "s", key: 4}]}, {tag: "b", key: 2}]
		var temp1 = []
		var temp2 = [{tag: "a", key: 1, children: [{tag: "i", key: 3}, {tag: "s", key: 4}]}, {tag: "b", key: 2}]
		var updated = [{tag: "a", key: 1, children: [{tag: "s", key: 4}, {tag: "i", key: 3}]}, {tag: "b", key: 2}]

		render(root, vnodes)
		render(root, temp1)
		render(root, temp2)
		render(root, updated)

		o(root.childNodes.length).equals(2)
		o(updated[0].dom.nodeName).equals("A")
		o(updated[0].dom).equals(root.childNodes[0])
		o(updated[1].dom.nodeName).equals("B")
		o(updated[1].dom).equals(root.childNodes[1])
		o(updated[0].dom.childNodes.length).equals(2)
		o(updated[0].dom.childNodes[0].nodeName).equals("S")
		o(updated[0].dom.childNodes[1].nodeName).equals("I")
	})
	o("removes then recreates nested", function() {
		var vnodes = [{tag: "a", key: 1, children: [{tag: "a", key: 3, children: [{tag: "a", key: 5}]}, {tag: "a", key: 4, children: [{tag: "a", key: 5}]}]}, {tag: "a", key: 2}]
		var temp = []
		var updated = [{tag: "a", key: 1, children: [{tag: "a", key: 3, children: [{tag: "a", key: 5}]}, {tag: "a", key: 4, children: [{tag: "a", key: 5}]}]}, {tag: "a", key: 2}]

		render(root, vnodes)
		render(root, temp)
		render(root, updated)

		o(root.childNodes.length).equals(2)
		o(root.childNodes[0].childNodes.length).equals(2)
		o(root.childNodes[0].childNodes[0].childNodes.length).equals(1)
		o(root.childNodes[0].childNodes[1].childNodes.length).equals(1)
		o(root.childNodes[1].childNodes.length).equals(0)
	})
	o("doesn't recycle", function() {
		var vnodes = [{tag: "div", key: 1}]
		var temp = []
		var updated = [{tag: "div", key: 1}]

		render(root, vnodes)
		render(root, temp)
		render(root, updated)

		o(vnodes[0].dom).notEquals(updated[0].dom) // this used to be a recycling pool test
		o(updated[0].dom.nodeName).equals("DIV")
	})
	o("doesn't recycle when not keyed", function() {
		var vnodes = [{tag: "div"}]
		var temp = []
		var updated = [{tag: "div"}]

		render(root, vnodes)
		render(root, temp)
		render(root, updated)

		o(root.childNodes.length).equals(1)
		o(vnodes[0].dom).notEquals(updated[0].dom) // this used to be a recycling pool test
		o(updated[0].dom.nodeName).equals("DIV")
	})
	o("doesn't recycle deep", function() {
		var vnodes = [{tag: "div", children: [{tag: "a", key: 1}]}]
		var temp = [{tag: "div"}]
		var updated = [{tag: "div", children: [{tag: "a", key: 1}]}]

		render(root, vnodes)

		var oldChild = vnodes[0].dom.firstChild

		render(root, temp)
		render(root, updated)

		o(oldChild).notEquals(updated[0].dom.firstChild) // this used to be a recycling pool test
		o(updated[0].dom.firstChild.nodeName).equals("A")
	})
	o("mixed unkeyed tags are not broken by recycle", function() {
		var vnodes = [{tag: "a"}, {tag: "b"}]
		var temp = [{tag: "b"}]
		var updated = [{tag: "a"}, {tag: "b"}]

		render(root, vnodes)
		render(root, temp)
		render(root, updated)

		o(root.childNodes.length).equals(2)
		o(root.childNodes[0].nodeName).equals("A")
		o(root.childNodes[1].nodeName).equals("B")
	})
	o("mixed unkeyed vnode types are not broken by recycle", function() {
		var vnodes = [{tag: "[", children: [{tag: "a"}]}, {tag: "b"}]
		var temp = [{tag: "b"}]
		var updated = [{tag: "[", children: [{tag: "a"}]}, {tag: "b"}]

		render(root, vnodes)
		render(root, temp)
		render(root, updated)

		o(root.childNodes.length).equals(2)
		o(root.childNodes[0].nodeName).equals("A")
		o(root.childNodes[1].nodeName).equals("B")
	})
	o("onremove doesn't fire from nodes in the pool (#1990)", function () {
		var onremove = o.spy()
		render(root, [
			{tag: "div", children: [{tag: "div", attrs: {onremove: onremove}}]},
			{tag: "div", children: [{tag: "div", attrs: {onremove: onremove}}]}
		])
		render(root, [
			{tag: "div", children: [{tag: "div", attrs: {onremove: onremove}}]}
		])
		render(root,[])

		o(onremove.callCount).equals(2)
	})
	o("cached, non-keyed nodes skip diff", function () {
		var onupdate = o.spy();
		var cached = {tag:"a", attrs:{onupdate: onupdate}}

		render(root, cached)
		render(root, cached)

		o(onupdate.callCount).equals(0)
	})
	o("cached, keyed nodes skip diff", function () {
		var onupdate = o.spy()
		var cached = {tag:"a", key:"a", attrs:{onupdate: onupdate}}

		render(root, cached)
		render(root, cached)

		o(onupdate.callCount).equals(0)
	})
	o("keyed cached elements are re-initialized when brought back from the pool (#2003)", function () {
		var onupdate = o.spy()
		var oncreate = o.spy()
		var cached = {
			tag: "B", key: 1, children: [
				{tag: "A", attrs: {oncreate: oncreate, onupdate: onupdate}, text: "A"}
			]
		}
		render(root, [{tag: "div", children: [cached]}])
		render(root, [])
		render(root, [{tag: "div", children: [cached]}])

		o(oncreate.callCount).equals(2)
		o(onupdate.callCount).equals(0)
	})

	o("unkeyed cached elements are re-initialized when brought back from the pool (#2003)", function () {
		var onupdate = o.spy()
		var oncreate = o.spy()
		var cached = {
			tag: "B", children: [
				{tag: "A", attrs: {oncreate: oncreate, onupdate: onupdate}, text: "A"}
			]
		}
		render(root, [{tag: "div", children: [cached]}])
		render(root, [])
		render(root, [{tag: "div", children: [cached]}])

		o(oncreate.callCount).equals(2)
		o(onupdate.callCount).equals(0)
	})

	o("keyed cached elements are re-initialized when brought back from nested pools (#2003)", function () {
		var onupdate = o.spy()
		var oncreate = o.spy()
		var cached = {
			tag: "B", key: 1, children: [
				{tag: "A", attrs: {oncreate: oncreate, onupdate: onupdate}, text: "A"}
			]
		}
		render(root, [{tag: "div", children: [cached]}])
		render(root, [{tag: "div", children: []}])
		render(root, [])
		render(root, [{tag: "div", children: [cached]}])

		o(oncreate.callCount).equals(2)
		o(onupdate.callCount).equals(0)
	})

	o("unkeyed cached elements are re-initialized when brought back from nested pools (#2003)", function () {
		var onupdate = o.spy()
		var oncreate = o.spy()
		var cached = {
			tag: "B", children: [
				{tag: "A", attrs: {oncreate: oncreate, onupdate: onupdate}, text: "A"}
			]
		}
		render(root, [{tag: "div", children: [cached]}])
		render(root, [{tag: "div", children: []}])
		render(root, [])
		render(root, [{tag: "div", children: [cached]}])

		o(oncreate.callCount).equals(2)
		o(onupdate.callCount).equals(0)
	})

	o("null stays in place", function() {
		var create = o.spy()
		var update = o.spy()
		var remove = o.spy()
		var vnodes = [{tag: "div"}, {tag: "a", attrs: {oncreate: create, onupdate: update, onremove: remove}}]
		var temp = [null, {tag: "a", attrs: {oncreate: create, onupdate: update, onremove: remove}}]
		var updated = [{tag: "div"}, {tag: "a", attrs: {oncreate: create, onupdate: update, onremove: remove}}]

		render(root, vnodes)
		var before = vnodes[1].dom
		render(root, temp)
		render(root, updated)
		var after = updated[1].dom

		o(before).equals(after)
		o(create.callCount).equals(1)
		o(update.callCount).equals(2)
		o(remove.callCount).equals(0)
	})
	o("null stays in place if not first", function() {
		var create = o.spy()
		var update = o.spy()
		var remove = o.spy()
		var vnodes = [{tag: "b"}, {tag: "div"}, {tag: "a", attrs: {oncreate: create, onupdate: update, onremove: remove}}]
		var temp = [{tag: "b"}, null, {tag: "a", attrs: {oncreate: create, onupdate: update, onremove: remove}}]
		var updated = [{tag: "b"}, {tag: "div"}, {tag: "a", attrs: {oncreate: create, onupdate: update, onremove: remove}}]

		render(root, vnodes)
		var before = vnodes[2].dom
		render(root, temp)
		render(root, updated)
		var after = updated[2].dom

		o(before).equals(after)
		o(create.callCount).equals(1)
		o(update.callCount).equals(2)
		o(remove.callCount).equals(0)
	})
	o("node is recreated if key changes to undefined", function () {
		var vnode = {tag: "b", key: 1}
		var updated = {tag: "b"}

		render(root, vnode)
		render(root, updated)

		o(vnode.dom).notEquals(updated.dom)
	})
	o("don't add back elements from fragments that are restored from the pool #1991", function() {
		render(root, [
			{tag: "[", children: []},
			{tag: "[", children: []}
		])
		render(root, [
			{tag: "[", children: []},
			{tag: "[", children: [{tag: "div"}]}
		])
		render(root, [
			{tag: "[", children: [null]}
		])
		render(root, [
			{tag: "[", children: []},
			{tag: "[", children: []}
		])

		o(root.childNodes.length).equals(0)
	})
	o("don't add back elements from fragments that are being removed #1991", function() {
		render(root, [
			{tag: "[", children: []},
			{tag: "p"},
		])
		render(root, [
			{tag: "[", children: [{tag: "div", text: 5}]}
		])
		render(root, [
			{tag: "[", children: []},
			{tag: "[", children: []}
		])

		o(root.childNodes.length).equals(0)
	})
	o("handles null values in unkeyed lists of different length (#2003)", function() {
		var oncreate = o.spy();
		var onremove = o.spy();
		var onupdate = o.spy();
		function attrs() {
			return {oncreate: oncreate, onremove: onremove, onupdate: onupdate}
		}

		render(root, [{tag: "div", attrs: attrs()}, null]);
		render(root, [null, {tag: "div", attrs: attrs()}, null]);

		o(oncreate.callCount).equals(2)
		o(onremove.callCount).equals(1)
		o(onupdate.callCount).equals(0)
	})
	o("supports changing the element of a keyed element in a list when traversed bottom-up", function() {
		try {
			render(root, [{tag: "a", key: 2}])
			render(root, [{tag: "b", key: 1}, {tag: "b", key: 2}])

			o(root.childNodes.length).equals(2)
			o(root.childNodes[0].nodeName).equals("B")
			o(root.childNodes[1].nodeName).equals("B")
		} catch (e) {
			o(e).equals(null)
		}
	})
	o("supports changing the element of a keyed element in a list when looking up nodes using the map", function() {
		try {
			render(root, [{tag: "x", key: 1}, {tag: "y", key: 2}, {tag: "z", key: 3}])
			render(root, [{tag: "b", key: 2}, {tag: "c", key: 1}, {tag: "d", key: 4}, {tag: "e", key: 3}])

			o(root.childNodes.length).equals(4)
			o(root.childNodes[0].nodeName).equals("B")
			o(root.childNodes[1].nodeName).equals("C")
			o(root.childNodes[2].nodeName).equals("D")
			o(root.childNodes[3].nodeName).equals("E")
		} catch (e) {
			o(e).equals(null)
		}
	})
	o("don't fetch the nextSibling from the pool", function() {
		render(root, [{tag: "[", children: [{tag: "div", key: 1}, {tag: "div", key: 2}]}, {tag: "p"}])
		render(root, [{tag: "[", children: []}, {tag: "p"}])
		render(root, [{tag: "[", children: [{tag: "div", key: 2}, {tag: "div", key: 1}]}, {tag: "p"}])

		o([].map.call(root.childNodes, function(el) {return el.nodeName})).deepEquals(["DIV", "DIV", "P"])
	})
	o("minimizes DOM operations when scrambling a keyed lists", function() {
		var vnodes = [{tag: "a", key: "a"}, {tag: "b", key: "b"}, {tag: "c", key: "c"}, {tag: "d", key: "d"}]
		var updated = [{tag: "b", key: "b"}, {tag: "a", key: "a"}, {tag: "d", key: "d"}, {tag: "c", key: "c"}]
		var expectedTagNames = updated.map(function(vn) {return vn.tag})

		render(root, vnodes)

		root.appendChild = o.spy(root.appendChild)
		root.insertBefore = o.spy(root.insertBefore)

		render(root, updated)

		var tagNames = [].map.call(root.childNodes, function(n) {return n.nodeName.toLowerCase()})

		o(root.appendChild.callCount + root.insertBefore.callCount).equals(2)
		o(tagNames).deepEquals(expectedTagNames)
	})
	o("minimizes DOM operations when reversing a keyed lists with an odd number of items", function() {
		var vnodes = [{tag: "a", key: "a"}, {tag: "b", key: "b"}, {tag: "c", key: "c"}, {tag: "d", key: "d"}]
		var updated = [{tag: "d", key: "d"}, {tag: "c", key: "c"}, {tag: "b", key: "b"}, {tag: "a", key: "a"}]
		var expectedTagNames = updated.map(function(vn) {return vn.tag})

		render(root, vnodes)

		root.appendChild = o.spy(root.appendChild)
		root.insertBefore = o.spy(root.insertBefore)

		render(root, updated)

		var tagNames = [].map.call(root.childNodes, function(n) {return n.nodeName.toLowerCase()})

		o(root.appendChild.callCount + root.insertBefore.callCount).equals(3)
		o(tagNames).deepEquals(expectedTagNames)
	})
	o("minimizes DOM operations when reversing a keyed lists with an even number of items", function() {
		var vnodes = [{tag: "a", key: "a"}, {tag: "b", key: "b"}, {tag: "c", key: "c"}]
		var updated = [{tag: "c", key: "c"}, {tag: "b", key: "b"}, {tag: "a", key: "a"}]
		var expectedTagNames = updated.map(function(vn) {return vn.tag})

		render(root, vnodes)

		root.appendChild = o.spy(root.appendChild)
		root.insertBefore = o.spy(root.insertBefore)

		render(root, updated)

		var tagNames = [].map.call(root.childNodes, function(n) {return n.nodeName.toLowerCase()})

		o(root.appendChild.callCount + root.insertBefore.callCount).equals(2)
		o(tagNames).deepEquals(expectedTagNames)
	})
	o("minimizes DOM operations when scrambling a keyed lists with prefixes and suffixes", function() {
		var vnodes = [{tag: "i", key: "i"}, {tag: "a", key: "a"}, {tag: "b", key: "b"}, {tag: "c", key: "c"}, {tag: "d", key: "d"}, {tag: "j", key: "j"}]
		var updated = [{tag: "i", key: "i"}, {tag: "b", key: "b"}, {tag: "a", key: "a"}, {tag: "d", key: "d"}, {tag: "c", key: "c"}, {tag: "j", key: "j"}]
		var expectedTagNames = updated.map(function(vn) {return vn.tag})

		render(root, vnodes)

		root.appendChild = o.spy(root.appendChild)
		root.insertBefore = o.spy(root.insertBefore)

		render(root, updated)

		var tagNames = [].map.call(root.childNodes, function(n) {return n.nodeName.toLowerCase()})

		o(root.appendChild.callCount + root.insertBefore.callCount).equals(2)
		o(tagNames).deepEquals(expectedTagNames)
	})
	o("minimizes DOM operations when reversing a keyed lists with an odd number of items with prefixes and suffixes", function() {
		var vnodes = [{tag: "i", key: "i"}, {tag: "a", key: "a"}, {tag: "b", key: "b"}, {tag: "c", key: "c"}, {tag: "d", key: "d"}, {tag: "j", key: "j"}]
		var updated = [{tag: "i", key: "i"}, {tag: "d", key: "d"}, {tag: "c", key: "c"}, {tag: "b", key: "b"}, {tag: "a", key: "a"}, {tag: "j", key: "j"}]
		var expectedTagNames = updated.map(function(vn) {return vn.tag})

		render(root, vnodes)

		root.appendChild = o.spy(root.appendChild)
		root.insertBefore = o.spy(root.insertBefore)

		render(root, updated)

		var tagNames = [].map.call(root.childNodes, function(n) {return n.nodeName.toLowerCase()})

		o(root.appendChild.callCount + root.insertBefore.callCount).equals(3)
		o(tagNames).deepEquals(expectedTagNames)
	})
	o("minimizes DOM operations when reversing a keyed lists with an even number of items with prefixes and suffixes", function() {
		var vnodes = [{tag: "i", key: "i"}, {tag: "a", key: "a"}, {tag: "b", key: "b"}, {tag: "c", key: "c"}, {tag: "j", key: "j"}]
		var updated = [{tag: "i", key: "i"}, {tag: "c", key: "c"}, {tag: "b", key: "b"}, {tag: "a", key: "a"}, {tag: "j", key: "j"}]
		var expectedTagNames = updated.map(function(vn) {return vn.tag})

		render(root, vnodes)

		root.appendChild = o.spy(root.appendChild)
		root.insertBefore = o.spy(root.insertBefore)

		render(root, updated)

		var tagNames = [].map.call(root.childNodes, function(n) {return n.nodeName.toLowerCase()})

		o(root.appendChild.callCount + root.insertBefore.callCount).equals(2)
		o(tagNames).deepEquals(expectedTagNames)
	})
	o("scrambling sample 1", function() {
		function vnodify(str) {
			return str.split(",").map(function(k) {return {tag: k, key: k}})
		}
		var vnodes = vnodify("k0,k1,k2,k3,k4,k5,k6,k7,k8,k9")
		var updated = vnodify("k4,k1,k2,k9,k0,k3,k6,k5,k8,k7")
		var expectedTagNames = updated.map(function(vn) {return vn.tag})

		render(root, vnodes)

		root.appendChild = o.spy(root.appendChild)
		root.insertBefore = o.spy(root.insertBefore)

		render(root, updated)

		var tagNames = [].map.call(root.childNodes, function(n) {return n.nodeName.toLowerCase()})

		o(root.appendChild.callCount + root.insertBefore.callCount).equals(5)
		o(tagNames).deepEquals(expectedTagNames)
	})
	o("scrambling sample 2", function() {
		function vnodify(str) {
			return str.split(",").map(function(k) {return {tag: k, key: k}})
		}
		var vnodes = vnodify("k0,k1,k2,k3,k4,k5,k6,k7,k8,k9")
		var updated = vnodify("b,d,k1,k0,k2,k3,k4,a,c,k5,k6,k7,k8,k9")
		var expectedTagNames = updated.map(function(vn) {return vn.tag})

		render(root, vnodes)

		root.appendChild = o.spy(root.appendChild)
		root.insertBefore = o.spy(root.insertBefore)

		render(root, updated)

		var tagNames = [].map.call(root.childNodes, function(n) {return n.nodeName.toLowerCase()})

		o(root.appendChild.callCount + root.insertBefore.callCount).equals(5)
		o(tagNames).deepEquals(expectedTagNames)
	})

	components.forEach(function(cmp){
		o.spec(cmp.kind, function(){
			var createComponent = cmp.create

			o("fragment child toggles from null when followed by null component then tag", function() {
				var component = createComponent({view: function() {return null}})
				var vnodes = [{tag: "[", children: [{tag: "a"}, {tag: component}, {tag: "b"}]}]
				var temp = [{tag: "[", children: [null, {tag: component}, {tag: "b"}]}]
				var updated = [{tag: "[", children: [{tag: "a"}, {tag: component}, {tag: "b"}]}]

				render(root, vnodes)
				render(root, temp)
				render(root, updated)

				o(root.childNodes.length).equals(2)
				o(root.childNodes[0].nodeName).equals("A")
				o(root.childNodes[1].nodeName).equals("B")
			})
			o("fragment child toggles from null in component when followed by null component then tag", function() {
				var flag = true
				var a = createComponent({view: function() {return flag ? {tag: "a"} : null}})
				var b = createComponent({view: function() {return null}})
				var vnodes = [{tag: "[", children: [{tag: a}, {tag: b}, {tag: "s"}]}]
				var temp = [{tag: "[", children: [{tag: a}, {tag: b}, {tag: "s"}]}]
				var updated = [{tag: "[", children: [{tag: a}, {tag: b}, {tag: "s"}]}]

				render(root, vnodes)
				flag = false
				render(root, temp)
				flag = true
				render(root, updated)

				o(root.childNodes.length).equals(2)
				o(root.childNodes[0].nodeName).equals("A")
				o(root.childNodes[1].nodeName).equals("S")
			})
			o("removing a component that returns a fragment doesn't throw (regression test for incidental bug introduced while debugging some Flems)", function() {
				var component = createComponent({
					view: function() {return {tag: "[", children:[{tag: "a"}, {tag: "b"}]}}
				})
				try {
					render(root, [{tag: component}])
					render(root, [])

					o(root.childNodes.length).equals(0)
				} catch (e) {
					o(e).equals(null)
				}
			})
		})
	})
})
