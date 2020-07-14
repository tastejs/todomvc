"use strict"

// Low-priority TODO: remove the dependency on the renderer here.
var o = require("../../ospec/ospec")
var callAsync = require("../../test-utils/callAsync")
var browserMock = require("../../test-utils/browserMock")
var throttleMocker = require("../../test-utils/throttleMock")

var callAsync = require("../../test-utils/callAsync")
var apiMountRedraw = require("../../api/mount-redraw")
var coreRenderer = require("../../render/render")
var apiRouter = require("../../api/router")

o.spec("route.get/route.set", function() {
	void [{protocol: "http:", hostname: "localhost"}, {protocol: "file:", hostname: "/"}].forEach(function(env) {
		void ["#", "?", "", "#!", "?!", "/foo"].forEach(function(prefix) {
			o.spec("using prefix `" + prefix + "` starting on " + env.protocol + "//" + env.hostname, function() {
				var $window, root, mountRedraw, route, throttleMock

				o.beforeEach(function() {
					$window = browserMock(env)
					throttleMock = throttleMocker()

					root = $window.document.body

					mountRedraw = apiMountRedraw(coreRenderer($window), throttleMock.schedule, console)
					route = apiRouter($window, mountRedraw)
					route.prefix = prefix
				})

				o.afterEach(function() {
					o(throttleMock.queueLength()).equals(0)
				})

				o("gets route", function() {
					$window.location.href = prefix + "/test"
					route(root, "/test", {"/test": {view: function() {}}})

					o(route.get()).equals("/test")
				})

				o("gets route w/ params", function() {
					$window.location.href = prefix + "/other/x/y/z?c=d#e=f"

					route(root, "/other/x/y/z?c=d#e=f", {
						"/test": {view: function() {}},
						"/other/:a/:b...": {view: function() {}},
					})

					o(route.get()).equals("/other/x/y/z?c=d#e=f")
				})

				o("gets route w/ escaped unicode", function() {
					$window.location.href = prefix + encodeURI("/ö/é/å?ö=ö#ö=ö")

					route(root, "/ö/é/å?ö=ö#ö=ö", {
						"/test": {view: function() {}},
						"/ö/:a/:b...": {view: function() {}},
					})

					o(route.get()).equals("/ö/é/å?ö=ö#ö=ö")
				})

				o("gets route w/ unicode", function() {
					$window.location.href = prefix + "/ö/é/å?ö=ö#ö=ö"

					route(root, "/ö/é/å?ö=ö#ö=ö", {
						"/test": {view: function() {}},
						"/ö/:a/:b...": {view: function() {}},
					})

					o(route.get()).equals("/ö/é/å?ö=ö#ö=ö")
				})

				o("sets path asynchronously", function(done) {
					$window.location.href = prefix + "/a"
					var spy1 = o.spy()
					var spy2 = o.spy()

					route(root, "/a", {
						"/a": {view: spy1},
						"/b": {view: spy2},
					})

					o(spy1.callCount).equals(1)
					o(spy2.callCount).equals(0)
					route.set("/b")
					o(spy1.callCount).equals(1)
					o(spy2.callCount).equals(0)
					callAsync(function() {
						throttleMock.fire()

						o(spy1.callCount).equals(1)
						o(spy2.callCount).equals(1)
						done()
					})
				})

				o("sets fallback asynchronously", function(done) {
					$window.location.href = prefix + "/b"
					var spy1 = o.spy()
					var spy2 = o.spy()

					route(root, "/a", {
						"/a": {view: spy1},
						"/b": {view: spy2},
					})

					o(spy1.callCount).equals(0)
					o(spy2.callCount).equals(1)
					route.set("/c")
					o(spy1.callCount).equals(0)
					o(spy2.callCount).equals(1)
					callAsync(function() {
						// Yep, before even the throttle mechanism takes hold.
						o(route.get()).equals("/b")
						callAsync(function() {
							// Yep, before even the throttle mechanism takes hold.
							o(route.get()).equals("/a")
							throttleMock.fire()

							o(spy1.callCount).equals(1)
							o(spy2.callCount).equals(1)
							done()
						})
					})
				})

				o("exposes new route asynchronously", function(done) {
					$window.location.href = prefix + "/test"
					route(root, "/test", {
						"/test": {view: function() {}},
						"/other/:a/:b...": {view: function() {}},
					})

					route.set("/other/x/y/z?c=d#e=f")
					callAsync(function() {
						// Yep, before even the throttle mechanism takes hold.
						o(route.get()).equals("/other/x/y/z?c=d#e=f")
						throttleMock.fire()
						done()
					})
				})

				o("exposes new escaped unicode route asynchronously", function(done) {
					$window.location.href = prefix + "/test"
					route(root, "/test", {
						"/test": {view: function() {}},
						"/ö": {view: function() {}},
					})

					route.set(encodeURI("/ö?ö=ö#ö=ö"))
					callAsync(function() {
						// Yep, before even the throttle mechanism takes hold.
						o(route.get()).equals("/ö?ö=ö#ö=ö")
						throttleMock.fire()
						done()
					})
				})

				o("exposes new unescaped unicode route asynchronously", function(done) {
					$window.location.href = "file://" + prefix + "/test"
					route(root, "/test", {
						"/test": {view: function() {}},
						"/ö": {view: function() {}},
					})

					route.set("/ö?ö=ö#ö=ö")
					callAsync(function() {
						// Yep, before even the throttle mechanism takes hold.
						o(route.get()).equals("/ö?ö=ö#ö=ö")
						throttleMock.fire()
						done()
					})
				})

				o("exposes new route asynchronously on fallback mode", function(done) {
					$window.location.href = prefix + "/test"
					route(root, "/test", {
						"/test": {view: function() {}},
						"/other/:a/:b...": {view: function() {}},
					})

					route.set("/other/x/y/z?c=d#e=f")
					callAsync(function() {
						// Yep, before even the throttle mechanism takes hold.
						o(route.get()).equals("/other/x/y/z?c=d#e=f")
						throttleMock.fire()
						done()
					})
				})

				o("sets route via pushState/onpopstate", function(done) {
					$window.location.href = prefix + "/test"
					route(root, "/test", {
						"/test": {view: function() {}},
						"/other/:a/:b...": {view: function() {}},
					})

					callAsync(function() {
						$window.history.pushState(null, null, prefix + "/other/x/y/z?c=d#e=f")
						$window.onpopstate()

						callAsync(function() {
							// Yep, before even the throttle mechanism takes hold.
							o(route.get()).equals("/other/x/y/z?c=d#e=f")
							throttleMock.fire()

							done()
						})
					})
				})

				o("sets parameterized route", function(done) {
					$window.location.href = prefix + "/test"
					route(root, "/test", {
						"/test": {view: function() {}},
						"/other/:a/:b...": {view: function() {}},
					})

					route.set("/other/:a/:b", {a: "x", b: "y/z", c: "d", e: "f"})
					callAsync(function() {
						// Yep, before even the throttle mechanism takes hold.
						o(route.get()).equals("/other/x/y%2Fz?c=d&e=f")
						throttleMock.fire()
						done()
					})
				})

				o("replace:true works", function(done) {
					$window.location.href = prefix + "/test"
					route(root, "/test", {
						"/test": {view: function() {}},
						"/other": {view: function() {}},
					})

					route.set("/other", null, {replace: true})

					callAsync(function() {
						throttleMock.fire()
						$window.history.back()
						o($window.location.href).equals(env.protocol + "//" + (env.hostname === "/" ? "" : env.hostname) + "/")
						done()
					})
				})

				o("replace:false works", function(done) {
					$window.location.href = prefix + "/test"
					route(root, "/test", {
						"/test": {view: function() {}},
						"/other": {view: function() {}},
					})

					route.set("/other", null, {replace: false})

					callAsync(function() {
						throttleMock.fire()
						$window.history.back()
						var slash = prefix[0] === "/" ? "" : "/"
						o($window.location.href).equals(env.protocol + "//" + (env.hostname === "/" ? "" : env.hostname) + slash + (prefix ? prefix + "/" : "") + "test")
						done()
					})
				})

				o("state works", function(done) {
					$window.location.href = prefix + "/test"
					route(root, "/test", {
						"/test": {view: function() {}},
						"/other": {view: function() {}},
					})

					route.set("/other", null, {state: {a: 1}})
					callAsync(function() {
						throttleMock.fire()
						o($window.history.state).deepEquals({a: 1})
						done()
					})
				})
			})
		})
	})
})
