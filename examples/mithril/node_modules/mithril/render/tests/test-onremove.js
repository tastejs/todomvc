"use strict"

var o = require("../../ospec/ospec")
var components = require("../../test-utils/components")
var domMock = require("../../test-utils/domMock")
var vdom = require("../../render/render")
var m = require("../../render/hyperscript")

o.spec("onremove", function() {
	var $window, root, render
	o.beforeEach(function() {
		$window = domMock()
		root = $window.document.createElement("div")
		render = vdom($window)
	})

	o("does not call onremove when creating", function() {
		var create = o.spy()
		var update = o.spy()
		var vnode = {tag: "div", attrs: {onremove: create}}
		var updated = {tag: "div", attrs: {onremove: update}}

		render(root, [vnode])
		render(root, [updated])

		o(create.callCount).equals(0)
	})
	o("does not call onremove when updating", function() {
		var create = o.spy()
		var update = o.spy()
		var vnode = {tag: "div", attrs: {onremove: create}}
		var updated = {tag: "div", attrs: {onremove: update}}

		render(root, [vnode])
		render(root, [updated])

		o(create.callCount).equals(0)
		o(update.callCount).equals(0)
	})
	o("calls onremove when removing element", function() {
		var remove = o.spy()
		var vnode = {tag: "div", attrs: {onremove: remove}, state: {}}

		render(root, [vnode])
		render(root, [])

		o(remove.callCount).equals(1)
		o(remove.this).equals(vnode.state)
		o(remove.args[0]).equals(vnode)
	})
	o("calls onremove when removing text", function() {
		var remove = o.spy()
		var vnode = {tag: "#", attrs: {onremove: remove}, children: "a", state: {}}

		render(root, [vnode])
		render(root, [])

		o(remove.callCount).equals(1)
		o(remove.this).equals(vnode.state)
		o(remove.args[0]).equals(vnode)
	})
	o("calls onremove when removing fragment", function() {
		var remove = o.spy()
		var vnode = {tag: "[", attrs: {onremove: remove}, children: [], state: {}}

		render(root, [vnode])
		render(root, [])

		o(remove.callCount).equals(1)
		o(remove.this).equals(vnode.state)
		o(remove.args[0]).equals(vnode)
	})
	o("calls onremove when removing html", function() {
		var remove = o.spy()
		var vnode = {tag: "<", attrs: {onremove: remove}, children: "a", state: {}}

		render(root, [vnode])
		render(root, [])

		o(remove.callCount).equals(1)
		o(remove.this).equals(vnode.state)
		o(remove.args[0]).equals(vnode)
	})
	o("does not set onremove as an event handler", function() {
		var remove = o.spy()
		var vnode = {tag: "div", attrs: {onremove: remove}, children: []}

		render(root, [vnode])

		o(vnode.dom.onremove).equals(undefined)
		o(vnode.dom.attributes["onremove"]).equals(undefined)
		o(vnode.events).equals(undefined)
	})
	o("calls onremove on keyed nodes", function() {
		var remove = o.spy()
		var vnodes = [{tag: "div", key: 1}]
		var temp = [{tag: "div", key: 2, attrs: {onremove: remove}}]
		var updated = [{tag: "div", key: 1}]

		render(root, vnodes)
		render(root, temp)
		render(root, updated)

		o(vnodes[0].dom).notEquals(updated[0].dom) // this used to be a recycling pool test
		o(remove.callCount).equals(1)
	})
	o("does not recycle when there's an onremove", function() {
		var remove = o.spy()
		var vnode = {tag: "div", key: 1, attrs: {onremove: remove}}
		var updated = {tag: "div", key: 1, attrs: {onremove: remove}}

		render(root, [vnode])
		render(root, [])
		render(root, [updated])

		o(vnode.dom).notEquals(updated.dom)
	})
	components.forEach(function(cmp){
		o.spec(cmp.kind, function(){
			var createComponent = cmp.create

			o("calls onremove on nested component", function() {
				var spy = o.spy()
				var comp = createComponent({
					view: function() {return m(outer)}
				})
				var outer = createComponent({
					view: function() {return m(inner)}
				})
				var inner = createComponent({
					onremove: spy,
					view: function() {return m("div")}
				})
				render(root, {tag: comp})
				render(root, null)

				o(spy.callCount).equals(1)
			})
			o("calls onremove on nested component child", function() {
				var spy = o.spy()
				var comp = createComponent({
					view: function() {return m(outer)}
				})
				var outer = createComponent({
					view: function() {return m(inner, m("a", {onremove: spy}))}
				})
				var inner = createComponent({
					view: function(vnode) {return m("div", vnode.children)}
				})
				render(root, {tag: comp})
				render(root, null)

				o(spy.callCount).equals(1)
			})
			o("doesn't call onremove on children when the corresponding view returns null (after removing the parent)", function() {
				var threw = false
				var spy = o.spy()
				var parent = createComponent({
					view: function() {}
				})
				var child = createComponent({
					view: function() {},
					onremove: spy
				})
				render(root, {tag: parent, children: [child]})
				try {
					render(root, null)
				} catch (e) {
					threw = e
				}

				o(spy.callCount).equals(0)
				o(threw).equals(false)
			})
			o("doesn't call onremove on children when the corresponding view returns null (after removing the children)", function() {
				var threw = false
				var spy = o.spy()
				var parent = createComponent({
					view: function() {}
				})
				var child = createComponent({
					view: function() {},
					onremove: spy
				})
				render(root, {tag: parent, children: [child]})
				try {
					render(root, {tag: parent})
				} catch (e) {
					threw = true
				}

				o(spy.callCount).equals(0)
				o(threw).equals(false)
			})
			o("onremove doesn't fire on nodes that go from pool to pool (#1990)", function() {
				var onremove = o.spy();

				render(root, [m("div", m("div")), m("div", m("div", {onremove: onremove}))]);
				render(root, [m("div", m("div"))]);
				render(root, []);

				o(onremove.callCount).equals(1)
			})
			o("doesn't fire when removing the children of a node that's brought back from the pool (#1991 part 2)", function() {
				var onremove = o.spy()
				var vnode = {tag: "div", key: 1, children: [{tag: "div", attrs: {onremove: onremove}}]}
				var temp = {tag: "div", key: 2}
				var updated = {tag: "div", key: 1, children: [{tag: "p"}]}

				render(root, [vnode])
				render(root, [temp])
				render(root, [updated])

				o(vnode.dom).notEquals(updated.dom) // this used to be a recycling pool test
				o(onremove.callCount).equals(1)
			})
			// Warning: this test is complicated because it's replicating a race condition.
			o("removes correct nodes when child delays removal, parent removes, then child resolves", function () {
				// Sugar over the complexity - I need to test the entire tree for consistency.
				function expect(expectedPairs) {
					var expected = []

					for (var i = 0; i < expectedPairs.length; i++) {
						var name = expectedPairs[i][0]
						var text = expectedPairs[i][1]
						expected.push({
							name: name,
							firstType: name === "#text" ? null : "#text",
							text: text,
						})
					}

					var actual = []
					var list = root.firstChild.childNodes
					for (var i = 0; i < list.length; i++) {
						var current = list[i]
						var textNode = current.childNodes.length === 1
							? current.firstChild
							: current
						actual.push({
							name: current.nodeName,
							firstType: textNode === current ? null : textNode.nodeName,
							text: textNode.nodeValue,
						})
					}

					o(actual).deepEquals(expected)
				}

				var resolve

				function update(id, showParent, showChild) {
					render(root, [
						{tag: "div", children: [
							showParent ? {tag: "[", children: [
								{tag: "#", children: ""}, // Required
								showChild ? {tag: "[", attrs: {
									onbeforeremove: function () {
										return {then: function (r) { resolve = r }}
									},
								}, children: [
									{tag: "div", text: id},
								]} : undefined,
							]} : undefined,
						]}
					])
				}

				update("1", true, true)
				expect([
					["#text", ""],
					["DIV", "1"],
				])
				o(resolve).equals(undefined)

				update("2", true, false)
				expect([
					["#text", ""],
					["DIV", "1"],
				])
				o(typeof resolve).equals("function")
				var original = resolve

				update("3", true, true)
				expect([
					["#text", ""],
					["DIV", "1"],
					["DIV", "3"],
				])
				o(resolve).equals(original)

				update("4", false, true)
				expect([
					["DIV", "1"],
				])
				o(resolve).equals(original)

				update("5", true, true)
				expect([
					["DIV", "1"],
					["#text", ""],
					["DIV", "5"],
				])
				o(resolve).equals(original)

				resolve()
				expect([
					["#text", ""],
					["DIV", "5"],
				])
				o(resolve).equals(original)

				update("6", true, true)
				expect([
					["#text", ""],
					["DIV", "6"],
				])
				o(resolve).equals(original)
			})
			// Warning: this test is complicated because it's replicating a race condition.
			o("removes correct nodes when child delays removal, parent removes, then child resolves + rejects both", function () {
				// Sugar over the complexity - I need to test the entire tree for consistency.
				function expect(expectedPairs) {
					var expected = []

					for (var i = 0; i < expectedPairs.length; i++) {
						var name = expectedPairs[i][0]
						var text = expectedPairs[i][1]
						expected.push({
							name: name,
							firstType: name === "#text" ? null : "#text",
							text: text,
						})
					}

					var actual = []
					var list = root.firstChild.childNodes
					for (var i = 0; i < list.length; i++) {
						var current = list[i]
						var textNode = current.childNodes.length === 1
							? current.firstChild
							: current
						actual.push({
							name: current.nodeName,
							firstType: textNode === current ? null : textNode.nodeName,
							text: textNode.nodeValue,
						})
					}

					o(actual).deepEquals(expected)
				}

				var resolve, reject

				function update(id, showParent, showChild) {
					render(root, [
						{tag: "div", children: [
							showParent ? {tag: "[", children: [
								{tag: "#", children: ""}, // Required
								showChild ? {tag: "[", attrs: {
									onbeforeremove: function () {
										return {then: function (res, rej) {
											resolve = res
											reject = rej
										}}
									},
								}, children: [
									{tag: "div", text: id},
								]} : undefined,
							]} : undefined,
						]}
					])
				}

				update("1", true, true)
				expect([
					["#text", ""],
					["DIV", "1"],
				])
				o(resolve).equals(undefined)

				update("2", true, false)
				expect([
					["#text", ""],
					["DIV", "1"],
				])
				o(typeof resolve).equals("function")
				var originalResolve = resolve
				var originalReject = reject

				update("3", true, true)
				expect([
					["#text", ""],
					["DIV", "1"],
					["DIV", "3"],
				])
				o(resolve).equals(originalResolve)
				o(reject).equals(originalReject)

				update("4", false, true)
				expect([
					["DIV", "1"],
				])
				o(resolve).equals(originalResolve)
				o(reject).equals(originalReject)

				update("5", true, true)
				expect([
					["DIV", "1"],
					["#text", ""],
					["DIV", "5"],
				])
				o(resolve).equals(originalResolve)
				o(reject).equals(originalReject)

				resolve()
				reject()
				reject()
				resolve()
				expect([
					["#text", ""],
					["DIV", "5"],
				])
				o(resolve).equals(originalResolve)
				o(reject).equals(originalReject)

				update("6", true, true)
				expect([
					["#text", ""],
					["DIV", "6"],
				])
				o(resolve).equals(originalResolve)
				o(reject).equals(originalReject)
			})
		})
	})
})
