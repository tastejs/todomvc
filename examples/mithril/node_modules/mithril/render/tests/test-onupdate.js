"use strict"

var o = require("../../ospec/ospec")
var domMock = require("../../test-utils/domMock")
var vdom = require("../../render/render")

o.spec("onupdate", function() {
	var $window, root, render
	o.beforeEach(function() {
		$window = domMock()
		root = $window.document.createElement("div")
		render = vdom($window)
	})

	o("does not call onupdate when creating element", function() {
		var create = o.spy()
		var update = o.spy()
		var vnode = {tag: "div", attrs: {onupdate: create}, state: {}}
		var updated = {tag: "div", attrs: {onupdate: update}, state: {}}

		render(root, [vnode])
		render(root, [updated])

		o(create.callCount).equals(0)
		o(update.callCount).equals(1)
		o(update.this).equals(vnode.state)
		o(update.args[0]).equals(updated)
	})
	o("does not call onupdate when removing element", function() {
		var create = o.spy()
		var vnode = {tag: "div", attrs: {onupdate: create}}

		render(root, [vnode])
		render(root, [])

		o(create.callCount).equals(0)
	})
	o("does not call onupdate when replacing keyed element", function() {
		var create = o.spy()
		var update = o.spy()
		var vnode = {tag: "div", key: 1, attrs: {onupdate: create}}
		var updated = {tag: "a", key: 1, attrs: {onupdate: update}}
		render(root, [vnode])
		render(root, [updated])

		o(create.callCount).equals(0)
		o(update.callCount).equals(0)
	})
	o("does not recycle when there's an onupdate", function() {
		var update = o.spy()
		var vnode = {tag: "div", key: 1, attrs: {onupdate: update}}
		var updated = {tag: "div", key: 1, attrs: {onupdate: update}}

		render(root, [vnode])
		render(root, [])
		render(root, [updated])

		o(vnode.dom).notEquals(updated.dom)
	})
	o("does not call old onupdate when removing the onupdate property in new vnode", function() {
		var create = o.spy()
		var vnode = {tag: "a", attrs: {onupdate: create}}
		var updated = {tag: "a"}

		render(root, [vnode])
		render(root, [updated])

		o(create.callCount).equals(0)
	})
	o("calls onupdate when noop", function() {
		var create = o.spy()
		var update = o.spy()
		var vnode = {tag: "div", attrs: {onupdate: create}, state: {}}
		var updated = {tag: "div", attrs: {onupdate: update}, state: {}}

		render(root, [vnode])
		render(root, [updated])

		o(create.callCount).equals(0)
		o(update.callCount).equals(1)
		o(update.this).equals(vnode.state)
		o(update.args[0]).equals(updated)
	})
	o("calls onupdate when updating attr", function() {
		var create = o.spy()
		var update = o.spy()
		var vnode = {tag: "div", attrs: {onupdate: create}, state: {}}
		var updated = {tag: "div", attrs: {onupdate: update, id: "a"}, state: {}}

		render(root, [vnode])
		render(root, [updated])

		o(create.callCount).equals(0)
		o(update.callCount).equals(1)
		o(update.this).equals(vnode.state)
		o(update.args[0]).equals(updated)
	})
	o("calls onupdate when updating children", function() {
		var create = o.spy()
		var update = o.spy()
		var vnode = {tag: "div", attrs: {onupdate: create}, children: [{tag: "a"}], state: {}}
		var updated = {tag: "div", attrs: {onupdate: update}, children: [{tag: "b"}], state: {}}

		render(root, [vnode])
		render(root, [updated])

		o(create.callCount).equals(0)
		o(update.callCount).equals(1)
		o(update.this).equals(vnode.state)
		o(update.args[0]).equals(updated)
	})
	o("calls onupdate when updating text", function() {
		var create = o.spy()
		var update = o.spy()
		var vnode = {tag: "#", attrs: {onupdate: create}, children: "a", state: {}}
		var updated = {tag: "#", attrs: {onupdate: update}, children: "a", state: {}}

		render(root, [vnode])
		render(root, [updated])

		o(create.callCount).equals(0)
		o(update.callCount).equals(1)
		o(update.this).equals(vnode.state)
		o(update.args[0]).equals(updated)
	})
	o("calls onupdate when updating fragment", function() {
		var create = o.spy()
		var update = o.spy()
		var vnode = {tag: "[", attrs: {onupdate: create}, children: [], state: {}}
		var updated = {tag: "[", attrs: {onupdate: update}, children: [], state: {}}

		render(root, [vnode])
		render(root, [updated])

		o(create.callCount).equals(0)
		o(update.callCount).equals(1)
		o(update.this).equals(vnode.state)
		o(update.args[0]).equals(updated)
	})
	o("calls onupdate when updating html", function() {
		var create = o.spy()
		var update = o.spy()
		var vnode = {tag: "<", attrs: {onupdate: create}, children: "a", state: {}}
		var updated = {tag: "<", attrs: {onupdate: update}, children: "a", state: {}}

		render(root, [vnode])
		render(root, [updated])

		o(create.callCount).equals(0)
		o(update.callCount).equals(1)
		o(update.this).equals(vnode.state)
		o(update.args[0]).equals(updated)
	})
	o("calls onupdate after full DOM update", function() {
		var called = false
		var vnode = {tag: "div", attrs: {id: "1"}, children: [
			{tag: "a", attrs: {id: "2"}, children: [
				{tag: "b", attrs: {id: "3"}}
			]}
		]}
		var updated = {tag: "div", attrs: {id: "11"}, children: [
			{tag: "a", attrs: {onupdate: update, id: "22"}, children: [
				{tag: "b", attrs: {id: "33"}}
			]}
		]}

		render(root, [vnode])
		render(root, [updated])

		function update(vnode) {
			called = true

			o(vnode.dom.parentNode.attributes["id"].value).equals("11")
			o(vnode.dom.attributes["id"].value).equals("22")
			o(vnode.dom.childNodes[0].attributes["id"].value).equals("33")
		}
		o(called).equals(true)
	})
	o("does not set onupdate as an event handler", function() {
		var update = o.spy()
		var vnode = {tag: "div", attrs: {onupdate: update}, children: []}

		render(root, [vnode])

		o(vnode.dom.onupdate).equals(undefined)
		o(vnode.dom.attributes["onupdate"]).equals(undefined)
	})
})
