"use strict"

// Low-priority TODO: remove the dependency on the renderer here.
var o = require("../../ospec/ospec")
var components = require("../../test-utils/components")
var domMock = require("../../test-utils/domMock")
var throttleMocker = require("../../test-utils/throttleMock")
var mountRedraw = require("../../api/mount-redraw")
var coreRenderer = require("../../render/render")
var h = require("../../render/hyperscript")

o.spec("mount/redraw", function() {
	var root, m, throttleMock, consoleMock, $document, errors
	o.beforeEach(function() {
		var $window = domMock()
		consoleMock = {error: o.spy()}
		throttleMock = throttleMocker()
		root = $window.document.body
		m = mountRedraw(coreRenderer($window), throttleMock.schedule, consoleMock)
		$document = $window.document
		errors = []
	})

	o.afterEach(function() {
		o(consoleMock.error.calls.map(function(c) {
			return c.args[0]
		})).deepEquals(errors)
		o(throttleMock.queueLength()).equals(0)
	})

	o("shouldn't error if there are no renderers", function() {
		m.redraw()
		throttleMock.fire()
	})

	o("schedules correctly", function() {
		var spy = o.spy()

		m.mount(root, {view: spy})
		o(spy.callCount).equals(1)
		m.redraw()
		o(spy.callCount).equals(1)
		throttleMock.fire()
		o(spy.callCount).equals(2)
	})

	o("should run a single renderer entry", function() {
		var spy = o.spy()

		m.mount(root, {view: spy})

		o(spy.callCount).equals(1)

		m.redraw()
		m.redraw()
		m.redraw()

		o(spy.callCount).equals(1)
		throttleMock.fire()
		o(spy.callCount).equals(2)
	})

	o("should run all renderer entries", function() {
		var el1 = $document.createElement("div")
		var el2 = $document.createElement("div")
		var el3 = $document.createElement("div")
		var spy1 = o.spy()
		var spy2 = o.spy()
		var spy3 = o.spy()

		m.mount(el1, {view: spy1})
		m.mount(el2, {view: spy2})
		m.mount(el3, {view: spy3})

		m.redraw()

		o(spy1.callCount).equals(1)
		o(spy2.callCount).equals(1)
		o(spy3.callCount).equals(1)

		m.redraw()

		o(spy1.callCount).equals(1)
		o(spy2.callCount).equals(1)
		o(spy3.callCount).equals(1)

		throttleMock.fire()

		o(spy1.callCount).equals(2)
		o(spy2.callCount).equals(2)
		o(spy3.callCount).equals(2)
	})

	o("should stop running after mount null", function() {
		var spy = o.spy()

		m.mount(root, {view: spy})
		o(spy.callCount).equals(1)
		m.mount(root, null)

		m.redraw()

		o(spy.callCount).equals(1)
		throttleMock.fire()
		o(spy.callCount).equals(1)
	})

	o("should stop running after mount undefined", function() {
		var spy = o.spy()

		m.mount(root, {view: spy})
		o(spy.callCount).equals(1)
		m.mount(root, undefined)

		m.redraw()

		o(spy.callCount).equals(1)
		throttleMock.fire()
		o(spy.callCount).equals(1)
	})

	o("should stop running after mount no arg", function() {
		var spy = o.spy()

		m.mount(root, {view: spy})
		o(spy.callCount).equals(1)
		m.mount(root)

		m.redraw()

		o(spy.callCount).equals(1)
		throttleMock.fire()
		o(spy.callCount).equals(1)
	})

	o("should invoke remove callback on unmount", function() {
		var spy = o.spy()
		var onremove = o.spy()

		m.mount(root, {view: spy, onremove: onremove})
		o(spy.callCount).equals(1)
		m.mount(root)

		o(spy.callCount).equals(1)
		o(onremove.callCount).equals(1)
	})

	o("should stop running after unsubscribe, even if it occurs after redraw is requested", function() {
		var spy = o.spy()

		m.mount(root, {view: spy})
		o(spy.callCount).equals(1)
		m.redraw()
		m.mount(root)

		o(spy.callCount).equals(1)
		throttleMock.fire()
		o(spy.callCount).equals(1)
	})

	o("does nothing on invalid unmount", function() {
		var spy = o.spy()

		m.mount(root, {view: spy})
		o(spy.callCount).equals(1)

		m.mount(null)
		m.redraw()
		throttleMock.fire()
		o(spy.callCount).equals(2)
	})

	o("redraw.sync() redraws all roots synchronously", function() {
		var el1 = $document.createElement("div")
		var el2 = $document.createElement("div")
		var el3 = $document.createElement("div")
		var spy1 = o.spy()
		var spy2 = o.spy()
		var spy3 = o.spy()

		m.mount(el1, {view: spy1})
		m.mount(el2, {view: spy2})
		m.mount(el3, {view: spy3})

		o(spy1.callCount).equals(1)
		o(spy2.callCount).equals(1)
		o(spy3.callCount).equals(1)

		m.redraw.sync()

		o(spy1.callCount).equals(2)
		o(spy2.callCount).equals(2)
		o(spy3.callCount).equals(2)

		m.redraw.sync()

		o(spy1.callCount).equals(3)
		o(spy2.callCount).equals(3)
		o(spy3.callCount).equals(3)
	})


	o("throws on invalid component", function() {
		o(function() { m.mount(root, {}) }).throws(TypeError)
	})

	components.forEach(function(cmp){
		o.spec(cmp.kind, function(){
			var createComponent = cmp.create

			o("throws on invalid `root` DOM node", function() {
				o(function() {
					m.mount(null, createComponent({view: function() {}}))
				}).throws(TypeError)
			})

			o("renders into `root` synchronously", function() {
				m.mount(root, createComponent({
					view: function() {
						return h("div")
					}
				}))

				o(root.firstChild.nodeName).equals("DIV")
			})

			o("mounting null unmounts", function() {
				m.mount(root, createComponent({
					view: function() {
						return h("div")
					}
				}))

				m.mount(root, null)

				o(root.childNodes.length).equals(0)
			})

			o("Mounting a second root doesn't cause the first one to redraw", function() {
				var root1 = $document.createElement("div")
				var root2 = $document.createElement("div")
				var view = o.spy()

				m.mount(root1, createComponent({view: view}))
				o(view.callCount).equals(1)

				m.mount(root2, createComponent({view: function() {}}))

				o(view.callCount).equals(1)

				throttleMock.fire()
				o(view.callCount).equals(1)
			})

			o("redraws on events", function() {
				var onupdate = o.spy()
				var oninit = o.spy()
				var onclick = o.spy()
				var e = $document.createEvent("MouseEvents")

				e.initEvent("click", true, true)

				m.mount(root, createComponent({
					view: function() {
						return h("div", {
							oninit: oninit,
							onupdate: onupdate,
							onclick: onclick,
						})
					}
				}))

				root.firstChild.dispatchEvent(e)

				o(oninit.callCount).equals(1)
				o(onupdate.callCount).equals(0)

				o(onclick.callCount).equals(1)
				o(onclick.this).equals(root.firstChild)
				o(onclick.args[0].type).equals("click")
				o(onclick.args[0].target).equals(root.firstChild)

				throttleMock.fire()

				o(onupdate.callCount).equals(1)
			})

			o("redraws several mount points on events", function() {
				var onupdate0 = o.spy()
				var oninit0 = o.spy()
				var onclick0 = o.spy()
				var onupdate1 = o.spy()
				var oninit1 = o.spy()
				var onclick1 = o.spy()

				var root1 = $document.createElement("div")
				var root2 = $document.createElement("div")
				var e = $document.createEvent("MouseEvents")

				e.initEvent("click", true, true)

				m.mount(root1, createComponent({
					view: function() {
						return h("div", {
							oninit: oninit0,
							onupdate: onupdate0,
							onclick: onclick0,
						})
					}
				}))

				o(oninit0.callCount).equals(1)
				o(onupdate0.callCount).equals(0)

				m.mount(root2, createComponent({
					view: function() {
						return h("div", {
							oninit: oninit1,
							onupdate: onupdate1,
							onclick: onclick1,
						})
					}
				}))

				o(oninit1.callCount).equals(1)
				o(onupdate1.callCount).equals(0)

				root1.firstChild.dispatchEvent(e)
				o(onclick0.callCount).equals(1)
				o(onclick0.this).equals(root1.firstChild)

				throttleMock.fire()

				o(onupdate0.callCount).equals(1)
				o(onupdate1.callCount).equals(1)

				root2.firstChild.dispatchEvent(e)

				o(onclick1.callCount).equals(1)
				o(onclick1.this).equals(root2.firstChild)

				throttleMock.fire()

				o(onupdate0.callCount).equals(2)
				o(onupdate1.callCount).equals(2)
			})

			o("event handlers can skip redraw", function() {
				var onupdate = o.spy(function(){
					throw new Error("This shouldn't have been called")
				})
				var oninit = o.spy()
				var e = $document.createEvent("MouseEvents")

				e.initEvent("click", true, true)

				m.mount(root, createComponent({
					view: function() {
						return h("div", {
							oninit: oninit,
							onupdate: onupdate,
							onclick: function(e) {
								e.redraw = false
							}
						})
					}
				}))

				root.firstChild.dispatchEvent(e)

				o(oninit.callCount).equals(1)
				o(e.redraw).equals(false)

				throttleMock.fire()

				o(onupdate.callCount).equals(0)
				o(e.redraw).equals(false)
			})

			o("redraws when the render function is run", function() {
				var onupdate = o.spy()
				var oninit = o.spy()

				m.mount(root, createComponent({
					view: function() {
						return h("div", {
							oninit: oninit,
							onupdate: onupdate
						})
					}
				}))

				o(oninit.callCount).equals(1)
				o(onupdate.callCount).equals(0)

				m.redraw()

				throttleMock.fire()

				o(onupdate.callCount).equals(1)
			})

			o("emits errors correctly", function() {
				errors = ["foo", "bar", "baz"]
				var counter = -1

				m.mount(root, createComponent({
					view: function() {
						var value = errors[counter++]
						if (value != null) throw value
						return null
					}
				}))

				m.redraw()
				throttleMock.fire()
				m.redraw()
				throttleMock.fire()
				m.redraw()
				throttleMock.fire()
			})
		})
	})
})
