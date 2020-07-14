"use strict"

// Low-priority TODO: remove the dependency on the renderer here.
var o = require("../../ospec/ospec")
var browserMock = require("../../test-utils/browserMock")
var throttleMocker = require("../../test-utils/throttleMock")

var m = require("../../render/hyperscript")
var coreRenderer = require("../../render/render")
var apiMountRedraw = require("../../api/mount-redraw")
var apiRouter = require("../../api/router")
var Promise = require("../../promise/promise")

o.spec("route", function() {
	// Note: the `n` parameter used in calls to this are generally found by
	// either trial-and-error or by studying the source. If tests are failing,
	// find the failing assertions, set `n` to about 10 on the preceding call to
	// `waitCycles`, then drop them down incrementally until it fails. The last
	// one to succeed is the one you want to keep. And just do that for each
	// failing assertion, and it'll eventually work.
	//
	// This is effectively what I did when designing this and hooking everything
	// up. (It would be so much easier to just be able to run the calls with a
	// different event loop and just turn it until I get what I want, but JS
	// lacks that functionality.)

	// Use precisely what `m.route` uses, for consistency and to ensure timings
	// are aligned.
	var waitFunc = typeof setImmediate === "function" ? setImmediate : setTimeout
	function waitCycles(n) {
		n = Math.max(n, 1)
		return new Promise(function(resolve) {
			return loop()
			function loop() {
				if (n === 0) resolve()
				else { n--; waitFunc(loop) }
			}
		})
	}

	void [{protocol: "http:", hostname: "localhost"}, {protocol: "file:", hostname: "/"}].forEach(function(env) {
		void ["#", "?", "", "#!", "?!", "/foo"].forEach(function(prefix) {
			o.spec("using prefix `" + prefix + "` starting on " + env.protocol + "//" + env.hostname, function() {
				var $window, root, mountRedraw, route, throttleMock
				var nextID = 0
				var currentTest = 0

				// Once done, a root should no longer be alive. This verifies
				// that, and it's a *very* subtle test bug that can lead to
				// some rather unusual consequences. If this fails, use
				// `waitCycles(n)` to avoid this.
				function lock(func) {
					var id = currentTest
					var start = Date.now()
					try {
						throw new Error()
					} catch (trace) {
						return function() {
							// This *will* cause a test failure.
							if (id != null && id !== currentTest) {
								id = undefined
								trace.message = "called " +
									(Date.now() - start) + "ms after test end"
								console.error(trace.stack)
								o("in test").equals("not in test")
							}
							return func.apply(this, arguments)
						}
					}
				}

				o.beforeEach(function() {
					currentTest = nextID++
					$window = browserMock(env)
					throttleMock = throttleMocker()

					root = $window.document.body

					mountRedraw = apiMountRedraw(coreRenderer($window), throttleMock.schedule, console)
					route = apiRouter($window, mountRedraw)
					route.prefix = prefix
				})

				o.afterEach(function() {
					o(throttleMock.queueLength()).equals(0)
					currentTest = -1 // doesn't match any test
				})

				o("throws on invalid `root` DOM node", function() {
					var threw = false
					try {
						route(null, "/", {"/":{view: lock(function() {})}})
					} catch (e) {
						threw = true
					}
					o(threw).equals(true)
				})

				o("renders into `root`", function() {
					$window.location.href = prefix + "/"
					route(root, "/", {
						"/" : {
							view: lock(function() {
								return m("div")
							})
						}
					})

					o(root.firstChild.nodeName).equals("DIV")
				})

				o("resolves to route w/ escaped unicode", function() {
					$window.location.href = prefix + "/%C3%B6?%C3%B6=%C3%B6"
					route(root, "/ö", {
						"/ö" : {
							view: lock(function() {
								return m("div")
							})
						}
					})

					o(root.firstChild.nodeName).equals("DIV")
				})

				o("resolves to route w/ unicode", function() {
					$window.location.href = prefix + "/ö?ö=ö"
					route(root, "/ö", {
						"/ö" : {
							view: lock(function() {
								return JSON.stringify(route.param()) + " " +
									route.get()
							})
						}
					})

					o(root.firstChild.nodeValue).equals('{"ö":"ö"} /ö?ö=ö')
				})

				o("handles parameterized route", function() {
					$window.location.href = prefix + "/test/x"
					route(root, "/test/:a", {
						"/test/:a" : {
							view: lock(function(vnode) {
								return JSON.stringify(route.param()) + " " +
									JSON.stringify(vnode.attrs) + " " +
									route.get()
							})
						}
					})

					o(root.firstChild.nodeValue).equals(
						'{"a":"x"} {"a":"x"} /test/x'
					)
				})

				o("handles multi-parameterized route", function() {
					$window.location.href = prefix + "/test/x/y"
					route(root, "/test/:a/:b", {
						"/test/:a/:b" : {
							view: lock(function(vnode) {
								return JSON.stringify(route.param()) + " " +
									JSON.stringify(vnode.attrs) + " " +
									route.get()
							})
						}
					})

					o(root.firstChild.nodeValue).equals(
						'{"a":"x","b":"y"} {"a":"x","b":"y"} /test/x/y'
					)
				})

				o("handles rest parameterized route", function() {
					$window.location.href = prefix + "/test/x/y"
					route(root, "/test/:a...", {
						"/test/:a..." : {
							view: lock(function(vnode) {
								return JSON.stringify(route.param()) + " " +
									JSON.stringify(vnode.attrs) + " " +
									route.get()
							})
						}
					})

					o(root.firstChild.nodeValue).equals(
						'{"a":"x/y"} {"a":"x/y"} /test/x/y'
					)
				})

				o("handles route with search", function() {
					$window.location.href = prefix + "/test?a=b&c=d"
					route(root, "/test", {
						"/test" : {
							view: lock(function(vnode) {
								return JSON.stringify(route.param()) + " " +
									JSON.stringify(vnode.attrs) + " " +
									route.get()
							})
						}
					})

					o(root.firstChild.nodeValue).equals(
						'{"a":"b","c":"d"} {"a":"b","c":"d"} /test?a=b&c=d'
					)
				})

				o("redirects to default route if no match", function() {
					$window.location.href = prefix + "/test"
					route(root, "/other", {
						"/other": {
							view: lock(function(vnode) {
								return JSON.stringify(route.param()) + " " +
									JSON.stringify(vnode.attrs) + " " +
									route.get()
							})
						}
					})

					return waitCycles(1).then(function() {
						o(root.firstChild.nodeValue).equals("{} {} /other")
					})
				})

				o("handles out of order routes", function() {
					$window.location.href = prefix + "/z/y/x"

					route(root, "/z/y/x", {
						"/z/y/x": {
							view: lock(function() { return "1" }),
						},
						"/:a...": {
							view: lock(function() { return "2" }),
						},
					})

					o(root.firstChild.nodeValue).equals("1")
				})

				o("handles reverse out of order routes", function() {
					$window.location.href = prefix + "/z/y/x"

					route(root, "/z/y/x", {
						"/:a...": {
							view: lock(function() { return "2" }),
						},
						"/z/y/x": {
							view: lock(function() { return "1" }),
						},
					})

					o(root.firstChild.nodeValue).equals("2")
				})

				o("resolves to route on fallback mode", function() {
					$window.location.href = "file://" + prefix + "/test"

					route(root, "/test", {
						"/test" : {
							view: lock(function(vnode) {
								return JSON.stringify(route.param()) + " " +
									JSON.stringify(vnode.attrs) + " " +
									route.get()
							})
						}
					})

					o(root.firstChild.nodeValue).equals("{} {} /test")
				})

				o("routed mount points only redraw asynchronously (POJO component)", function() {
					var view = o.spy()

					$window.location.href = prefix + "/"
					route(root, "/", {"/":{view:view}})

					o(view.callCount).equals(1)

					mountRedraw.redraw()

					o(view.callCount).equals(1)

					throttleMock.fire()

					o(view.callCount).equals(2)
				})

				o("routed mount points only redraw asynchronously (constructible component)", function() {
					var view = o.spy()

					var Cmp = lock(function(){})
					Cmp.prototype.view = lock(view)

					$window.location.href = prefix + "/"
					route(root, "/", {"/":Cmp})

					o(view.callCount).equals(1)

					mountRedraw.redraw()

					o(view.callCount).equals(1)

					throttleMock.fire()

					o(view.callCount).equals(2)
				})

				o("routed mount points only redraw asynchronously (closure component)", function() {
					var view = o.spy()

					function Cmp() {return {view: lock(view)}}

					$window.location.href = prefix + "/"
					route(root, "/", {"/":lock(Cmp)})

					o(view.callCount).equals(1)

					mountRedraw.redraw()

					o(view.callCount).equals(1)

					throttleMock.fire()

					o(view.callCount).equals(2)
				})

				o("subscribes correctly and removes when unmounted", function() {
					$window.location.href = prefix + "/"

					route(root, "/", {
						"/" : {
							view: lock(function() {
								return m("div")
							})
						}
					})

					o(root.firstChild.nodeName).equals("DIV")

					mountRedraw.mount(root)

					o(root.childNodes.length).equals(0)
				})

				o("default route doesn't break back button", function() {
					$window.location.href = "http://old.com"
					$window.location.href = "http://new.com"

					route(root, "/a", {
						"/a" : {
							view: lock(function() {
								return m("div")
							})
						}
					})

					return waitCycles(1).then(function() {
						o(root.firstChild.nodeName).equals("DIV")

						o(route.get()).equals("/a")

						$window.history.back()

						o($window.location.pathname).equals("/")
						o($window.location.hostname).equals("old.com")
					})
				})

				o("default route does not inherit params", function() {
					$window.location.href = "/invalid?foo=bar"
					route(root, "/a", {
						"/a" : {
							oninit: lock(function(vnode) {
								o(vnode.attrs.foo).equals(undefined)
							}),
							view: lock(function() {
								return m("div")
							})
						}
					})

					return waitCycles(1)
				})

				o("redraws when render function is executed", function() {
					var onupdate = o.spy()
					var oninit = o.spy()

					$window.location.href = prefix + "/"
					route(root, "/", {
						"/" : {
							view: lock(function() {
								return m("div", {
									oninit: oninit,
									onupdate: onupdate
								})
							})
						}
					})

					o(oninit.callCount).equals(1)

					mountRedraw.redraw()
					throttleMock.fire()

					o(onupdate.callCount).equals(1)
				})

				o("redraws on events", function() {
					var onupdate = o.spy()
					var oninit = o.spy()
					var onclick = o.spy()
					var e = $window.document.createEvent("MouseEvents")

					e.initEvent("click", true, true)

					$window.location.href = prefix + "/"
					route(root, "/", {
						"/" : {
							view: lock(function() {
								return m("div", {
									oninit: oninit,
									onupdate: onupdate,
									onclick: onclick,
								})
							})
						}
					})

					root.firstChild.dispatchEvent(e)

					o(oninit.callCount).equals(1)

					o(onclick.callCount).equals(1)
					o(onclick.this).equals(root.firstChild)
					o(onclick.args[0].type).equals("click")
					o(onclick.args[0].target).equals(root.firstChild)


					throttleMock.fire()
					o(onupdate.callCount).equals(1)
				})

				o("event handlers can skip redraw", function() {
					var onupdate = o.spy()
					var oninit = o.spy()
					var e = $window.document.createEvent("MouseEvents")

					e.initEvent("click", true, true)

					$window.location.href = prefix + "/"
					route(root, "/", {
						"/" : {
							view: lock(function() {
								return m("div", {
									oninit: oninit,
									onupdate: onupdate,
									onclick: lock(function(e) {
										e.redraw = false
									}),
								})
							})
						}
					})

					o(oninit.callCount).equals(1)

					root.firstChild.dispatchEvent(e)
					throttleMock.fire()

					// Wrapped to ensure no redraw fired
					return waitCycles(1).then(function() {
						o(onupdate.callCount).equals(0)
					})
				})

				o("changes location on route.Link", function() {
					var e = $window.document.createEvent("MouseEvents")

					e.initEvent("click", true, true)
					e.button = 0

					$window.location.href = prefix + "/"
					route(root, "/", {
						"/" : {
							view: lock(function() {
								return m(route.Link, {href: "/test"})
							})
						},
						"/test" : {
							view : lock(function() {
								return m("div")
							})
						}
					})

					var slash = prefix[0] === "/" ? "" : "/"

					o($window.location.href).equals(env.protocol + "//" + (env.hostname === "/" ? "" : env.hostname) + slash + (prefix ? prefix + "/" : ""))

					root.firstChild.dispatchEvent(e)
					throttleMock.fire()
					o($window.location.href).equals(env.protocol + "//" + (env.hostname === "/" ? "" : env.hostname) + slash + (prefix ? prefix + "/" : "") + "test")
				})

				o("passes options on route.Link", function() {
					var opts = {}
					var e = $window.document.createEvent("MouseEvents")

					e.initEvent("click", true, true)
					e.button = 0
					$window.location.href = prefix + "/"

					route(root, "/", {
						"/" : {
							view: lock(function() {
								return m(route.Link, {
									href: "/test",
									options: opts,
								})
							})
						},
						"/test" : {
							view : lock(function() {
								return m("div")
							})
						}
					})
					route.set = o.spy(route.set)

					root.firstChild.dispatchEvent(e)

					o(route.set.callCount).equals(1)
					o(route.set.args[2]).equals(opts)
				})

				o("route.Link can render without routes or dom access", function() {
					$window = browserMock(env)
					var render = coreRenderer($window)
					route = apiRouter(null, null)
					route.prefix = prefix
					root = $window.document.body

					render(root, m(route.Link, {href: "/test", foo: "bar"}, "text"))

					o(root.childNodes.length).equals(1)
					o(root.firstChild.nodeName).equals("A")
					o(root.firstChild.href).equals(prefix + "/test")
					o(root.firstChild.hasAttribute("aria-disabled")).equals(false)
					o(root.firstChild.hasAttribute("disabled")).equals(false)
					o(root.firstChild.attributes["foo"].value).equals("bar")
					o(root.firstChild.childNodes.length).equals(1)
					o(root.firstChild.firstChild.nodeName).equals("#text")
					o(root.firstChild.firstChild.nodeValue).equals("text")
				})

				o("route.Link keeps magic attributes from being double-called", function() {
					$window = browserMock(env)
					var render = coreRenderer($window)
					route = apiRouter(null, null)
					route.prefix = prefix
					root = $window.document.body

					var oninit = o.spy()
					var oncreate = o.spy()
					var onbeforeupdate = o.spy()
					var onupdate = o.spy()
					var onbeforeremove = o.spy()
					var onremove = o.spy()

					render(root, m(route.Link, {
						href: "/test",
						oninit: oninit,
						oncreate: oncreate,
						onbeforeupdate: onbeforeupdate,
						onupdate: onupdate,
						onbeforeremove: onbeforeremove,
						onremove: onremove,
					}, "text"))

					o(oninit.callCount).equals(1)
					o(oncreate.callCount).equals(1)
					o(onbeforeupdate.callCount).equals(0)
					o(onupdate.callCount).equals(0)
					o(onbeforeremove.callCount).equals(0)
					o(onremove.callCount).equals(0)

					render(root, m(route.Link, {
						href: "/test",
						oninit: oninit,
						oncreate: oncreate,
						onbeforeupdate: onbeforeupdate,
						onupdate: onupdate,
						onbeforeremove: onbeforeremove,
						onremove: onremove,
					}, "text"))

					o(oninit.callCount).equals(1)
					o(oncreate.callCount).equals(1)
					o(onbeforeupdate.callCount).equals(1)
					o(onupdate.callCount).equals(1)
					o(onbeforeremove.callCount).equals(0)
					o(onremove.callCount).equals(0)

					render(root, [])

					o(oninit.callCount).equals(1)
					o(oncreate.callCount).equals(1)
					o(onbeforeupdate.callCount).equals(1)
					o(onupdate.callCount).equals(1)
					o(onbeforeremove.callCount).equals(1)
					o(onremove.callCount).equals(1)
				})

				o("route.Link can render other tag without routes or dom access", function() {
					$window = browserMock(env)
					var render = coreRenderer($window)
					route = apiRouter(null, null)
					route.prefix = prefix
					root = $window.document.body

					render(root, m(route.Link, {selector: "button", href: "/test", foo: "bar"}, "text"))

					o(root.childNodes.length).equals(1)
					o(root.firstChild.nodeName).equals("BUTTON")
					o(root.firstChild.attributes["href"].value).equals(prefix + "/test")
					o(root.firstChild.hasAttribute("aria-disabled")).equals(false)
					o(root.firstChild.hasAttribute("disabled")).equals(false)
					o(root.firstChild.attributes["foo"].value).equals("bar")
					o(root.firstChild.childNodes.length).equals(1)
					o(root.firstChild.firstChild.nodeName).equals("#text")
					o(root.firstChild.firstChild.nodeValue).equals("text")
				})

				o("route.Link can render other selector without routes or dom access", function() {
					$window = browserMock(env)
					var render = coreRenderer($window)
					route = apiRouter(null, null)
					route.prefix = prefix
					root = $window.document.body

					render(root, m(route.Link, {selector: "button[href=/test]", foo: "bar"}, "text"))

					o(root.childNodes.length).equals(1)
					o(root.firstChild.nodeName).equals("BUTTON")
					o(root.firstChild.attributes["href"].value).equals(prefix + "/test")
					o(root.firstChild.hasAttribute("aria-disabled")).equals(false)
					o(root.firstChild.hasAttribute("disabled")).equals(false)
					o(root.firstChild.attributes["foo"].value).equals("bar")
					o(root.firstChild.childNodes.length).equals(1)
					o(root.firstChild.firstChild.nodeName).equals("#text")
					o(root.firstChild.firstChild.nodeValue).equals("text")
				})

				o("route.Link can render not disabled", function() {
					$window = browserMock(env)
					var render = coreRenderer($window)
					route = apiRouter(null, null)
					route.prefix = prefix
					root = $window.document.body

					render(root, m(route.Link, {href: "/test", disabled: false, foo: "bar"}, "text"))

					o(root.childNodes.length).equals(1)
					o(root.firstChild.nodeName).equals("A")
					o(root.firstChild.href).equals(prefix + "/test")
					o(root.firstChild.hasAttribute("aria-disabled")).equals(false)
					o(root.firstChild.hasAttribute("disabled")).equals(false)
					o(root.firstChild.attributes["foo"].value).equals("bar")
					o(root.firstChild.childNodes.length).equals(1)
					o(root.firstChild.firstChild.nodeName).equals("#text")
					o(root.firstChild.firstChild.nodeValue).equals("text")
				})

				o("route.Link can render falsy disabled", function() {
					$window = browserMock(env)
					var render = coreRenderer($window)
					route = apiRouter(null, null)
					route.prefix = prefix
					root = $window.document.body

					render(root, m(route.Link, {href: "/test", disabled: 0, foo: "bar"}, "text"))

					o(root.childNodes.length).equals(1)
					o(root.firstChild.nodeName).equals("A")
					o(root.firstChild.href).equals(prefix + "/test")
					o(root.firstChild.hasAttribute("aria-disabled")).equals(false)
					o(root.firstChild.hasAttribute("disabled")).equals(false)
					o(root.firstChild.attributes["foo"].value).equals("bar")
					o(root.firstChild.childNodes.length).equals(1)
					o(root.firstChild.firstChild.nodeName).equals("#text")
					o(root.firstChild.firstChild.nodeValue).equals("text")
				})

				o("route.Link can render disabled", function() {
					$window = browserMock(env)
					var render = coreRenderer($window)
					route = apiRouter(null, null)
					route.prefix = prefix
					root = $window.document.body

					render(root, m(route.Link, {href: "/test", disabled: true, foo: "bar"}, "text"))

					o(root.childNodes.length).equals(1)
					o(root.firstChild.nodeName).equals("A")
					o(root.firstChild.href).equals("")
					o(root.firstChild.attributes["aria-disabled"].value).equals("true")
					o(root.firstChild.attributes["foo"].value).equals("bar")
					o(root.firstChild.attributes["disabled"].value).equals("")
					o(root.firstChild.childNodes.length).equals(1)
					o(root.firstChild.firstChild.nodeName).equals("#text")
					o(root.firstChild.firstChild.nodeValue).equals("text")
				})

				o("route.Link can render truthy disabled", function() {
					$window = browserMock(env)
					var render = coreRenderer($window)
					route = apiRouter(null, null)
					route.prefix = prefix
					root = $window.document.body

					render(root, m(route.Link, {href: "/test", disabled: 1, foo: "bar"}, "text"))

					o(root.childNodes.length).equals(1)
					o(root.firstChild.nodeName).equals("A")
					o(root.firstChild.href).equals("")
					o(root.firstChild.attributes["aria-disabled"].value).equals("true")
					o(root.firstChild.attributes["foo"].value).equals("bar")
					o(root.firstChild.attributes["disabled"].value).equals("")
					o(root.firstChild.childNodes.length).equals(1)
					o(root.firstChild.firstChild.nodeName).equals("#text")
					o(root.firstChild.firstChild.nodeValue).equals("text")
				})

				o("route.Link doesn't redraw on wrong button", function() {
					var e = $window.document.createEvent("MouseEvents")

					e.initEvent("click", true, true)
					e.button = 10

					$window.location.href = prefix + "/"
					route(root, "/", {
						"/" : {
							view: lock(function() {
								return m(route.Link, {href: "/test"})
							})
						},
						"/test" : {
							view : lock(function() {
								return m("div")
							})
						}
					})

					var slash = prefix[0] === "/" ? "" : "/"

					o($window.location.href).equals(env.protocol + "//" + (env.hostname === "/" ? "" : env.hostname) + slash + (prefix ? prefix + "/" : ""))

					root.firstChild.dispatchEvent(e)
					throttleMock.fire()
					o($window.location.href).equals(env.protocol + "//" + (env.hostname === "/" ? "" : env.hostname) + slash + (prefix ? prefix + "/" : ""))
				})

				o("route.Link doesn't redraw on preventDefault", function() {
					var e = $window.document.createEvent("MouseEvents")

					e.initEvent("click", true, true)
					e.button = 0

					$window.location.href = prefix + "/"
					route(root, "/", {
						"/" : {
							view: lock(function() {
								return m(route.Link, {
									href: "/test",
									onclick: function(e) {
										e.preventDefault()
									}
								})
							})
						},
						"/test" : {
							view : lock(function() {
								return m("div")
							})
						}
					})

					var slash = prefix[0] === "/" ? "" : "/"

					o($window.location.href).equals(env.protocol + "//" + (env.hostname === "/" ? "" : env.hostname) + slash + (prefix ? prefix + "/" : ""))

					root.firstChild.dispatchEvent(e)
					throttleMock.fire()
					o($window.location.href).equals(env.protocol + "//" + (env.hostname === "/" ? "" : env.hostname) + slash + (prefix ? prefix + "/" : ""))
				})

				o("route.Link doesn't redraw on preventDefault in handleEvent", function() {
					var e = $window.document.createEvent("MouseEvents")

					e.initEvent("click", true, true)
					e.button = 0

					$window.location.href = prefix + "/"
					route(root, "/", {
						"/" : {
							view: lock(function() {
								return m(route.Link, {
									href: "/test",
									onclick: {
										handleEvent: function(e) {
											e.preventDefault()
										}
									}
								})
							})
						},
						"/test" : {
							view : lock(function() {
								return m("div")
							})
						}
					})

					var slash = prefix[0] === "/" ? "" : "/"

					o($window.location.href).equals(env.protocol + "//" + (env.hostname === "/" ? "" : env.hostname) + slash + (prefix ? prefix + "/" : ""))

					root.firstChild.dispatchEvent(e)
					throttleMock.fire()
					o($window.location.href).equals(env.protocol + "//" + (env.hostname === "/" ? "" : env.hostname) + slash + (prefix ? prefix + "/" : ""))
				})

				o("route.Link doesn't redraw on return false", function() {
					var e = $window.document.createEvent("MouseEvents")

					e.initEvent("click", true, true)
					e.button = 0

					$window.location.href = prefix + "/"
					route(root, "/", {
						"/" : {
							view: lock(function() {
								return m(route.Link, {
									href: "/test",
									onclick: function() {
										return false
									}
								})
							})
						},
						"/test" : {
							view : lock(function() {
								return m("div")
							})
						}
					})

					var slash = prefix[0] === "/" ? "" : "/"

					o($window.location.href).equals(env.protocol + "//" + (env.hostname === "/" ? "" : env.hostname) + slash + (prefix ? prefix + "/" : ""))

					root.firstChild.dispatchEvent(e)
					throttleMock.fire()
					o($window.location.href).equals(env.protocol + "//" + (env.hostname === "/" ? "" : env.hostname) + slash + (prefix ? prefix + "/" : ""))
				})

				o("accepts RouteResolver with onmatch that returns Component", function() {
					var matchCount = 0
					var renderCount = 0
					var Component = {
						view: lock(function() {
							return m("span")
						})
					}

					var resolver = {
						onmatch: lock(function(args, requestedPath, route) {
							matchCount++

							o(args.id).equals("abc")
							o(requestedPath).equals("/abc")
							o(route).equals("/:id")
							o(this).equals(resolver)
							return Component
						}),
						render: lock(function(vnode) {
							renderCount++

							o(vnode.attrs.id).equals("abc")
							o(this).equals(resolver)

							return vnode
						}),
					}

					$window.location.href = prefix + "/abc"
					route(root, "/abc", {
						"/:id" : resolver
					})

					return waitCycles(1).then(function() {
						o(matchCount).equals(1)
						o(renderCount).equals(1)
						o(root.firstChild.nodeName).equals("SPAN")
					})
				})

				o("accepts RouteResolver with onmatch that returns route.SKIP", function() {
					var match1Count = 0
					var match2Count = 0
					var render1 = o.spy()
					var render2Count = 0
					var Component = {
						view: lock(function() {
							return m("span")
						})
					}

					var resolver1 = {
						onmatch: lock(function(args, requestedPath, key) {
							match1Count++

							o(args.id1).equals("abc")
							o(requestedPath).equals("/abc")
							o(key).equals("/:id1")
							o(this).equals(resolver1)
							return route.SKIP
						}),
						render: lock(render1),
					}

					var resolver2 = {
						onmatch: function(args, requestedPath, key) {
							match2Count++

							o(args.id2).equals("abc")
							o(requestedPath).equals("/abc")
							o(key).equals("/:id2")
							o(this).equals(resolver2)
							return Component
						},
						render: function(vnode) {
							render2Count++

							o(vnode.attrs.id2).equals("abc")
							o(this).equals(resolver2)
							o(render1.callCount).equals(0)

							return vnode
						},
					}

					$window.location.href = prefix + "/abc"
					route(root, "/abc", {
						"/:id1" : resolver1,
						"/:id2" : resolver2
					})

					return waitCycles(4).then(function() {
						o(match1Count).equals(1)
						o(match2Count).equals(1)
						o(render2Count).equals(1)
						o(render1.callCount).equals(0)
						o(root.firstChild.nodeName).equals("SPAN")
					})
				})

				o("accepts RouteResolver with onmatch that returns Promise<Component>", function() {
					var matchCount = 0
					var renderCount = 0
					var Component = {
						view: lock(function() {
							return m("span")
						})
					}

					var resolver = {
						onmatch: lock(function(args, requestedPath, route) {
							matchCount++

							o(args.id).equals("abc")
							o(requestedPath).equals("/abc")
							o(route).equals("/:id")
							o(this).equals(resolver)
							return Promise.resolve(Component)
						}),
						render: lock(function(vnode) {
							renderCount++

							o(vnode.attrs.id).equals("abc")
							o(this).equals(resolver)

							return vnode
						}),
					}

					$window.location.href = prefix + "/abc"
					route(root, "/abc", {
						"/:id" : resolver
					})

					return waitCycles(10).then(function() {
						o(matchCount).equals(1)
						o(renderCount).equals(1)
						o(root.firstChild.nodeName).equals("SPAN")
					})
				})

				o("accepts RouteResolver with onmatch that returns Promise<undefined>", function() {
					var matchCount = 0
					var renderCount = 0

					var resolver = {
						onmatch: lock(function(args, requestedPath, route) {
							matchCount++

							o(args.id).equals("abc")
							o(requestedPath).equals("/abc")
							o(route).equals("/:id")
							o(this).equals(resolver)
							return Promise.resolve()
						}),
						render: lock(function(vnode) {
							renderCount++

							o(vnode.attrs.id).equals("abc")
							o(this).equals(resolver)

							return vnode
						}),
					}

					$window.location.href = prefix + "/abc"
					route(root, "/abc", {
						"/:id" : resolver
					})

					return waitCycles(2).then(function() {
						o(matchCount).equals(1)
						o(renderCount).equals(1)
						o(root.firstChild.nodeName).equals("DIV")
					})
				})

				o("accepts RouteResolver with onmatch that returns Promise<any>", function() {
					var matchCount = 0
					var renderCount = 0

					var resolver = {
						onmatch: lock(function(args, requestedPath, route) {
							matchCount++

							o(args.id).equals("abc")
							o(requestedPath).equals("/abc")
							o(route).equals("/:id")
							o(this).equals(resolver)
							return Promise.resolve([])
						}),
						render: lock(function(vnode) {
							renderCount++

							o(vnode.attrs.id).equals("abc")
							o(this).equals(resolver)

							return vnode
						}),
					}

					$window.location.href = prefix + "/abc"
					route(root, "/abc", {
						"/:id" : resolver
					})

					return waitCycles(2).then(function() {
						o(matchCount).equals(1)
						o(renderCount).equals(1)
						o(root.firstChild.nodeName).equals("DIV")
					})
				})

				o("accepts RouteResolver with onmatch that returns rejected Promise", function() {
					var matchCount = 0
					var renderCount = 0
					var spy = o.spy()

					var resolver = {
						onmatch: lock(function() {
							matchCount++
							return Promise.reject(new Error("error"))
						}),
						render: lock(function(vnode) {
							renderCount++
							return vnode
						}),
					}

					$window.location.href = prefix + "/test/1"
					route(root, "/default", {
						"/default" : {view: spy},
						"/test/:id" : resolver
					})

					return waitCycles(3).then(function() {
						o(matchCount).equals(1)
						o(renderCount).equals(0)
						o(spy.callCount).equals(1)
					})
				})

				o("accepts RouteResolver without `render` method as payload", function() {
					var matchCount = 0
					var Component = {
						view: lock(function() {
							return m("div")
						})
					}

					$window.location.href = prefix + "/abc"
					route(root, "/abc", {
						"/:id" : {
							onmatch: lock(function(args, requestedPath, route) {
								matchCount++

								o(args.id).equals("abc")
								o(requestedPath).equals("/abc")
								o(route).equals("/:id")

								return Component
							}),
						},
					})

					return waitCycles(2).then(function() {
						o(matchCount).equals(1)
						o(root.firstChild.nodeName).equals("DIV")
					})
				})

				o("changing `key` param resets the component", function(){
					var oninit = o.spy()
					var Component = {
						oninit: oninit,
						view: lock(function() {
							return m("div")
						})
					}
					$window.location.href = prefix + "/abc"
					route(root, "/abc", {
						"/:key": Component,
					})
					return waitCycles(1).then(function() {
						o(oninit.callCount).equals(1)
						route.set("/def")
						return waitCycles(1).then(function() {
							throttleMock.fire()
							o(oninit.callCount).equals(2)
						})
					})
				})

				o("accepts RouteResolver without `onmatch` method as payload", function() {
					var renderCount = 0
					var Component = {
						view: lock(function() {
							return m("div")
						})
					}

					$window.location.href = prefix + "/abc"
					route(root, "/abc", {
						"/:id" : {
							render: lock(function(vnode) {
								renderCount++

								o(vnode.attrs.id).equals("abc")

								return m(Component)
							}),
						},
					})

					o(root.firstChild.nodeName).equals("DIV")
					o(renderCount).equals(1)
				})

				o("RouteResolver `render` does not have component semantics", function() {
					$window.location.href = prefix + "/a"
					route(root, "/a", {
						"/a" : {
							render: lock(function() {
								return m("div", m("p"))
							}),
						},
						"/b" : {
							render: lock(function() {
								return m("div", m("a"))
							}),
						},
					})

					var dom = root.firstChild
					var child = dom.firstChild

					o(root.firstChild.nodeName).equals("DIV")

					route.set("/b")

					return waitCycles(1).then(function() {
						throttleMock.fire()

						o(root.firstChild).equals(dom)
						o(root.firstChild.firstChild).notEquals(child)
					})
				})

				o("calls onmatch and view correct number of times", function() {
					var matchCount = 0
					var renderCount = 0
					var Component = {
						view: lock(function() {
							return m("div")
						})
					}

					$window.location.href = prefix + "/"
					route(root, "/", {
						"/" : {
							onmatch: lock(function() {
								matchCount++
								return Component
							}),
							render: lock(function(vnode) {
								renderCount++
								return vnode
							}),
						},
					})

					return waitCycles(1).then(function() {
						o(matchCount).equals(1)
						o(renderCount).equals(1)

						mountRedraw.redraw()
						throttleMock.fire()

						o(matchCount).equals(1)
						o(renderCount).equals(2)
					})
				})

				o("calls onmatch and view correct number of times when not onmatch returns undefined", function() {
					var matchCount = 0
					var renderCount = 0
					var Component = {
						view: lock(function() {
							return m("div")
						})
					}

					$window.location.href = prefix + "/"
					route(root, "/", {
						"/" : {
							onmatch: lock(function() {
								matchCount++
							}),
							render: lock(function() {
								renderCount++
								return {tag: Component}
							}),
						},
					})

					return waitCycles(2).then(function() {
						o(matchCount).equals(1)
						o(renderCount).equals(1)

						mountRedraw.redraw()
						throttleMock.fire()

						o(matchCount).equals(1)
						o(renderCount).equals(2)
					})
				})

				o("onmatch can redirect to another route", function() {
					var redirected = false
					var render = o.spy()

					$window.location.href = prefix + "/a"
					route(root, "/a", {
						"/a" : {
							onmatch: lock(function() {
								route.set("/b")
							}),
							render: lock(render)
						},
						"/b" : {
							view: lock(function() {
								redirected = true
							})
						}
					})

					return waitCycles(2).then(function() {
						o(render.callCount).equals(0)
						o(redirected).equals(true)
					})
				})

				o("onmatch can redirect to another route that has RouteResolver w/ only onmatch", function() {
					var redirected = false
					var render = o.spy()
					var view = o.spy(function() {return m("div")})

					$window.location.href = prefix + "/a"
					route(root, "/a", {
						"/a" : {
							onmatch: lock(function() {
								route.set("/b", {}, {state: {a: 5}})
							}),
							render: lock(render)
						},
						"/b" : {
							onmatch: lock(function() {
								redirected = true
								return {view: lock(view)}
							})
						}
					})

					return waitCycles(3).then(function() {
						o(render.callCount).equals(0)
						o(redirected).equals(true)
						o(view.callCount).equals(1)
						o(root.childNodes.length).equals(1)
						o(root.firstChild.nodeName).equals("DIV")
						o($window.history.state).deepEquals({a: 5})
					})
				})

				o("onmatch can redirect to another route that has RouteResolver w/ only render", function() {
					var redirected = false
					var render = o.spy()

					$window.location.href = prefix + "/a"
					route(root, "/a", {
						"/a" : {
							onmatch: lock(function() {
								route.set("/b")
							}),
							render: lock(render)
						},
						"/b" : {
							render: lock(function(){
								redirected = true
							})
						}
					})

					return waitCycles(2).then(function() {
						o(render.callCount).equals(0)
						o(redirected).equals(true)
					})
				})

				o("onmatch can redirect to another route that has RouteResolver whose onmatch resolves asynchronously", function() {
					var redirected = false
					var render = o.spy()
					var view = o.spy()

					$window.location.href = prefix + "/a"
					route(root, "/a", {
						"/a" : {
							onmatch: lock(function() {
								route.set("/b")
							}),
							render: lock(render)
						},
						"/b" : {
							onmatch: lock(function() {
								redirected = true
								return waitCycles(1).then(function(){
									return {view: view}
								})
							})
						}
					})

					return waitCycles(6).then(function() {
						o(render.callCount).equals(0)
						o(redirected).equals(true)
						o(view.callCount).equals(1)
					})
				})

				o("onmatch can redirect to another route asynchronously", function() {
					var redirected = false
					var render = o.spy()
					var view = o.spy()

					$window.location.href = prefix + "/a"
					route(root, "/a", {
						"/a" : {
							onmatch: lock(function() {
								waitCycles(1).then(function() {route.set("/b")})
								return new Promise(function() {})
							}),
							render: lock(render)
						},
						"/b" : {
							onmatch: lock(function() {
								redirected = true
								return {view: lock(view)}
							})
						}
					})

					return waitCycles(5).then(function() {
						o(render.callCount).equals(0)
						o(redirected).equals(true)
						o(view.callCount).equals(1)
					})
				})

				o("onmatch can redirect w/ window.history.back()", function() {

					var render = o.spy()
					var component = {view: o.spy()}

					$window.location.href = prefix + "/a"
					route(root, "/a", {
						"/a" : {
							onmatch: lock(function() {
								return component
							}),
							render: lock(function(vnode) {
								return vnode
							})
						},
						"/b" : {
							onmatch: lock(function() {
								$window.history.back()
								return new Promise(function() {})
							}),
							render: lock(render)
						}
					})

					return waitCycles(2).then(function() {
						throttleMock.fire()

						route.set("/b")
						o(render.callCount).equals(0)
						o(component.view.callCount).equals(1)

						return waitCycles(4).then(function() {
							throttleMock.fire()

							o(render.callCount).equals(0)
							o(component.view.callCount).equals(2)
						})
					})
				})

				o("onmatch can redirect to a non-existent route that defaults to a RouteResolver w/ onmatch", function() {
					var redirected = false
					var render = o.spy()

					$window.location.href = prefix + "/a"
					route(root, "/b", {
						"/a" : {
							onmatch: lock(function() {
								route.set("/c")
							}),
							render: lock(render)
						},
						"/b" : {
							onmatch: lock(function(){
								redirected = true
								return {view: lock(function() {})}
							})
						}
					})

					return waitCycles(3).then(function() {
						o(render.callCount).equals(0)
						o(redirected).equals(true)
					})
				})

				o("onmatch can redirect to a non-existent route that defaults to a RouteResolver w/ render", function() {
					var redirected = false
					var render = o.spy()

					$window.location.href = prefix + "/a"
					route(root, "/b", {
						"/a" : {
							onmatch: lock(function() {
								route.set("/c")
							}),
							render: lock(render)
						},
						"/b" : {
							render: lock(function(){
								redirected = true
							})
						}
					})

					return waitCycles(3).then(function() {
						o(render.callCount).equals(0)
						o(redirected).equals(true)
					})
				})

				o("onmatch can redirect to a non-existent route that defaults to a component", function() {
					var redirected = false
					var render = o.spy()

					$window.location.href = prefix + "/a"
					route(root, "/b", {
						"/a" : {
							onmatch: lock(function() {
								route.set("/c")
							}),
							render: lock(render)
						},
						"/b" : {
							view: lock(function(){
								redirected = true
							})
						}
					})

					return waitCycles(3).then(function() {
						o(render.callCount).equals(0)
						o(redirected).equals(true)
					})
				})

				o("the previous view redraws while onmatch resolution is pending (#1268)", function() {
					var view = o.spy()
					var onmatch = o.spy(function() {
						return new Promise(function() {})
					})

					$window.location.href = prefix + "/a"
					route(root, "/", {
						"/a": {view: lock(view)},
						"/b": {onmatch: lock(onmatch)},
						"/": {view: lock(function() {})}
					})

					o(view.callCount).equals(1)
					o(onmatch.callCount).equals(0)

					route.set("/b")

					return waitCycles(1).then(function() {
						o(view.callCount).equals(1)
						o(onmatch.callCount).equals(1)

						mountRedraw.redraw()
						throttleMock.fire()

						o(view.callCount).equals(2)
						o(onmatch.callCount).equals(1)
					})
				})

				o("when two async routes are racing, the last one set cancels the finalization of the first", function(done) {
					var renderA = o.spy()
					var renderB = o.spy()
					var onmatchA = o.spy(function(){
						return waitCycles(3)
					})

					$window.location.href = prefix + "/a"
					route(root, "/a", {
						"/a": {
							onmatch: lock(onmatchA),
							render: lock(renderA)
						},
						"/b": {
							onmatch: lock(function(){
								var p = new Promise(function(fulfill) {
									o(onmatchA.callCount).equals(1)
									o(renderA.callCount).equals(0)
									o(renderB.callCount).equals(0)

									waitCycles(3).then(function(){
										o(onmatchA.callCount).equals(1)
										o(renderA.callCount).equals(0)
										o(renderB.callCount).equals(0)

										fulfill()
										return p
									}).then(function(){
										return waitCycles(1)
									}).then(function(){
										o(onmatchA.callCount).equals(1)
										o(renderA.callCount).equals(0)
										o(renderB.callCount).equals(1)
									}).then(done, done)
								})
								return p
							}),
							render: lock(renderB)
						}
					})

					waitCycles(1).then(lock(function() {
						o(onmatchA.callCount).equals(1)
						o(renderA.callCount).equals(0)
						o(renderB.callCount).equals(0)
						route.set("/b")
						o(onmatchA.callCount).equals(1)
						o(renderA.callCount).equals(0)
						o(renderB.callCount).equals(0)
					}))
				})

				o("m.route.set(m.route.get()) re-runs the resolution logic (#1180)", function(){
					var onmatch = o.spy()
					var render = o.spy(function() {return m("div")})

					$window.location.href = prefix + "/"
					route(root, "/", {
						"/": {
							onmatch: lock(onmatch),
							render: lock(render)
						}
					})

					return waitCycles(1).then(function() {
						throttleMock.fire()

						o(onmatch.callCount).equals(1)
						o(render.callCount).equals(1)

						route.set(route.get())

						return waitCycles(2).then(function() {
							throttleMock.fire()

							o(onmatch.callCount).equals(2)
							o(render.callCount).equals(2)
						})
					})
				})

				o("m.route.get() returns the last fully resolved route (#1276)", function(){
					$window.location.href = prefix + "/"

					route(root, "/", {
						"/": {view: lock(function() {})},
						"/2": {
							onmatch: lock(function() {
								return new Promise(function() {})
							})
						}
					})


					o(route.get()).equals("/")

					route.set("/2")

					return waitCycles(1).then(function() {
						o(route.get()).equals("/")
					})
				})

				o("routing with RouteResolver works more than once", function() {
					$window.location.href = prefix + "/a"
					route(root, "/a", {
						"/a": {
							render: lock(function() {
								return m("a", "a")
							})
						},
						"/b": {
							render: lock(function() {
								return m("b", "b")
							})
						}
					})

					route.set("/b")

					return waitCycles(1).then(function() {
						throttleMock.fire()

						o(root.firstChild.nodeName).equals("B")

						route.set("/a")

						return waitCycles(1).then(function() {
							throttleMock.fire()

							o(root.firstChild.nodeName).equals("A")
						})
					})
				})

				o("calling route.set invalidates pending onmatch resolution", function() {
					var rendered = false
					var resolved
					$window.location.href = prefix + "/a"
					route(root, "/a", {
						"/a": {
							onmatch: lock(function() {
								return waitCycles(2).then(function() {
									return {view: lock(function() {rendered = true})}
								})
							}),
							render: lock(function() {
								rendered = true
								resolved = "a"
							})
						},
						"/b": {
							view: lock(function() {
								resolved = "b"
							})
						}
					})

					route.set("/b")

					return waitCycles(1).then(function() {
						o(rendered).equals(false)
						o(resolved).equals("b")

						return waitCycles(1).then(function() {
							o(rendered).equals(false)
							o(resolved).equals("b")
						})
					})
				})

				o("route changes activate onbeforeremove", function() {
					var spy = o.spy()

					$window.location.href = prefix + "/a"
					route(root, "/a", {
						"/a": {
							onbeforeremove: lock(spy),
							view: lock(function() {})
						},
						"/b": {
							view: lock(function() {})
						}
					})

					route.set("/b")

					// setting the route is asynchronous
					return waitCycles(1).then(function() {
						throttleMock.fire()
						o(spy.callCount).equals(1)
					})
				})

				o("asynchronous route.set in onmatch works", function() {
					var rendered = false, resolved
					route(root, "/a", {
						"/a": {
							onmatch: lock(function() {
								return Promise.resolve().then(lock(function() {
									route.set("/b")
								}))
							}),
							render: lock(function() {
								rendered = true
								resolved = "a"
							})
						},
						"/b": {
							view: lock(function() {
								resolved = "b"
							})
						},
					})

					// tick for popstate for /a
					// tick for onmatch
					// tick for promise in onmatch
					// tick for onpopstate for /b
					return waitCycles(4).then(function() {
						o(rendered).equals(false)
						o(resolved).equals("b")
					})
				})

				o("throttles", function() {
					var i = 0
					$window.location.href = prefix + "/"
					route(root, "/", {
						"/": {view: lock(function() {i++})}
					})
					var before = i

					mountRedraw.redraw()
					mountRedraw.redraw()
					mountRedraw.redraw()
					mountRedraw.redraw()
					var after = i

					throttleMock.fire()

					o(before).equals(1) // routes synchronously
					o(after).equals(1) // redraws asynchronously
					o(i).equals(2)
				})

				o("m.route.param is available outside of route handlers", function() {
					$window.location.href = prefix + "/"

					route(root, "/1", {
						"/:id" : {
							view : lock(function() {
								o(route.param("id")).equals("1")

								return m("div")
							})
						}
					})

					o(route.param("id")).equals(undefined);
					o(route.param()).deepEquals(undefined);

					return waitCycles(1).then(function() {
						o(route.param("id")).equals("1")
						o(route.param()).deepEquals({id:"1"})
					})
				})
			})
		})
	})
})
