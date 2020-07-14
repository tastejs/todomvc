"use strict"

var o = require("../../ospec/ospec")
var domMock = require("../../test-utils/domMock")
var vdom = require("../../render/render")

o.spec("oninit", function() {
	var $window, root, render
	o.beforeEach(function() {
		$window = domMock()
		root = $window.document.createElement("div")
		render = vdom($window)
	})

	o("calls oninit when creating element", function() {
		var callback = o.spy()
		var vnode = {tag: "div", attrs: {oninit: callback}, state: {}}

		render(root, [vnode])

		o(callback.callCount).equals(1)
		o(callback.this).equals(vnode.state)
		o(callback.args[0]).equals(vnode)
	})
	o("calls oninit when creating text", function() {
		var callback = o.spy()
		var vnode = {tag: "#", attrs: {oninit: callback}, children: "a", state: {}}

		render(root, [vnode])

		o(callback.callCount).equals(1)
		o(callback.this).equals(vnode.state)
		o(callback.args[0]).equals(vnode)
	})
	o("calls oninit when creating fragment", function() {
		var callback = o.spy()
		var vnode = {tag: "[", attrs: {oninit: callback}, children: [], state: {}}

		render(root, [vnode])

		o(callback.callCount).equals(1)
		o(callback.this).equals(vnode.state)
		o(callback.args[0]).equals(vnode)
	})
	o("calls oninit when creating html", function() {
		var callback = o.spy()
		var vnode = {tag: "<", attrs: {oninit: callback}, children: "a", state: {}}

		render(root, [vnode])

		o(callback.callCount).equals(1)
		o(callback.this).equals(vnode.state)
		o(callback.args[0]).equals(vnode)
	})
	o("calls oninit when replacing keyed", function() {
		var createDiv = o.spy()
		var createA = o.spy()
		var vnode = {tag: "div", key: 1, attrs: {oninit: createDiv}, state: {}}
		var updated = {tag: "a", key: 1, attrs: {oninit: createA}, state: {}}

		render(root, [vnode])
		render(root, [updated])

		o(createDiv.callCount).equals(1)
		o(createDiv.this).equals(vnode.state)
		o(createDiv.args[0]).equals(vnode)
		o(createA.callCount).equals(1)
		o(createA.this).equals(updated.state)
		o(createA.args[0]).equals(updated)
	})
	o("does not call oninit when noop", function() {
		var create = o.spy()
		var update = o.spy()
		var vnode = {tag: "div", attrs: {oninit: create}, state: {}}
		var updated = {tag: "div", attrs: {oninit: update}, state: {}}

		render(root, [vnode])
		render(root, [updated])

		o(create.callCount).equals(1)
		o(create.this).equals(vnode.state)
		o(create.args[0]).equals(vnode)
		o(update.callCount).equals(0)
	})
	o("does not call oninit when updating attr", function() {
		var create = o.spy()
		var update = o.spy()
		var vnode = {tag: "div", attrs: {oninit: create}, state: {}}
		var updated = {tag: "div", attrs: {oninit: update, id: "a"}, state: {}}

		render(root, [vnode])
		render(root, [updated])

		o(create.callCount).equals(1)
		o(create.this).equals(vnode.state)
		o(create.args[0]).equals(vnode)
		o(update.callCount).equals(0)
	})
	o("does not call oninit when updating children", function() {
		var create = o.spy()
		var update = o.spy()
		var vnode = {tag: "div", attrs: {oninit: create}, children: [{tag: "a"}], state: {}}
		var updated = {tag: "div", attrs: {oninit: update}, children: [{tag: "b"}], state: {}}

		render(root, [vnode])
		render(root, [updated])

		o(create.callCount).equals(1)
		o(create.this).equals(vnode.state)
		o(create.args[0]).equals(vnode)
		o(update.callCount).equals(0)
	})
	o("does not call oninit when updating keyed", function() {
		var create = o.spy()
		var update = o.spy()
		var vnode = {tag: "div", key: 1, attrs: {oninit: create}, state: {}}
		var otherVnode = {tag: "a", key: 2}
		var updated = {tag: "div", key: 1, attrs: {oninit: update}, state: {}}
		var otherUpdated = {tag: "a", key: 2}

		render(root, [vnode, otherVnode])
		render(root, [otherUpdated, updated])

		o(create.callCount).equals(1)
		o(create.this).equals(vnode.state)
		o(create.args[0]).equals(vnode)
		o(update.callCount).equals(0)
	})
	o("does not call oninit when removing", function() {
		var create = o.spy()
		var vnode = {tag: "div", attrs: {oninit: create}, state: {}}

		render(root, [vnode])
		render(root, [])

		o(create.callCount).equals(1)
		o(create.this).equals(vnode.state)
		o(create.args[0]).equals(vnode)
	})
	o("calls oninit when recycling", function() {
		var create = o.spy()
		var update = o.spy()
		var vnode = {tag: "div", key: 1, attrs: {oninit: create}, state: {}}
		var updated = {tag: "div", key: 1, attrs: {oninit: update}, state: {}}

		render(root, [vnode])
		render(root, [])
		render(root, [updated])

		o(create.callCount).equals(1)
		o(create.this).equals(vnode.state)
		o(create.args[0]).equals(vnode)
		o(update.callCount).equals(1)
		o(update.this).equals(updated.state)
		o(update.args[0]).equals(updated)
	})
	o("calls oninit at the same step as onupdate", function() {
		var create = o.spy()
		var update = o.spy()
		var callback = o.spy()
		var vnode = {tag: "div", attrs: {onupdate: create}, children: [], state: {}}
		var updated = {tag: "div", attrs: {onupdate: update}, children: [{tag: "a", attrs: {oninit: callback}, state: {}}], state: {}}

		render(root, [vnode])
		render(root, [updated])

		o(create.callCount).equals(0)
		o(update.callCount).equals(1)
		o(update.this).equals(vnode.state)
		o(update.args[0]).equals(updated)
		o(callback.callCount).equals(1)
		o(callback.this).equals(updated.children[0].state)
		o(callback.args[0]).equals(updated.children[0])
	})
	o("calls oninit before full DOM creation", function() {
		var called = false
		var vnode = {tag: "div", children: [
			{tag: "a", attrs: {oninit: create}, children: [
				{tag: "b"}
			]}
		]}

		render(root, [vnode])

		function create(vnode) {
			called = true

			o(vnode.dom).equals(undefined)
			o(root.childNodes.length).equals(1)
		}
		o(called).equals(true)
	})
	o("does not set oninit as an event handler", function() {
		var create = o.spy()
		var vnode = {tag: "div", attrs: {oninit: create}, children: []}

		render(root, [vnode])

		o(vnode.dom.oninit).equals(undefined)
		o(vnode.dom.attributes["oninit"]).equals(undefined)
	})
	
	o("No spurious oninit calls in mapped keyed diff when the pool is involved (#1992)", function () {
		var oninit1 = o.spy()
		var oninit2 = o.spy()
		var oninit3 = o.spy()

		render(root, [
			{tag: "p", key: 1, attrs: {oninit: oninit1}},
			{tag: "p", key: 2, attrs: {oninit: oninit2}},
			{tag: "p", key: 3, attrs: {oninit: oninit3}},
		])
		render(root, [
			{tag: "p", key: 1, attrs: {oninit: oninit1}},
			{tag: "p", key: 3, attrs: {oninit: oninit3}},
		])
		render(root, [
			{tag: "p", key: 3, attrs: {oninit: oninit3}},
		])

		o(oninit1.callCount).equals(1)
		o(oninit2.callCount).equals(1)
		o(oninit3.callCount).equals(1)
	})
})
