"use strict"

var o = require("../../ospec/ospec")
var callAsync = require("../../test-utils/callAsync")
var xhrMock = require("../../test-utils/xhrMock")
var Request = require("../../request/request")
var PromisePolyfill = require("../../promise/promise")

o.spec("request", function() {
	var mock, request, complete
	o.beforeEach(function() {
		mock = xhrMock()
		complete = o.spy()
		request = Request(mock, PromisePolyfill, complete).request
	})

	o.spec("success", function() {
		o("works via GET", function(done) {
			mock.$defineRoutes({
				"GET /item": function() {
					return {status: 200, responseText: JSON.stringify({a: 1})}
				}
			})
			request({method: "GET", url: "/item"}).then(function(data) {
				o(data).deepEquals({a: 1})
			}).then(function() {
				done()
			})
		})
		o("implicit GET method", function(done){
			mock.$defineRoutes({
				"GET /item": function() {
					return {status: 200, responseText: JSON.stringify({a: 1})}
				}
			})
			request({url: "/item"}).then(function(data) {
				o(data).deepEquals({a: 1})
			}).then(function() {
				done()
			})
		})
		o("first argument can be a string aliasing url property", function(done){
			mock.$defineRoutes({
				"GET /item": function() {
					return {status: 200, responseText: JSON.stringify({a: 1})}
				}
			})
			request("/item").then(function(data) {
				o(data).deepEquals({a: 1})
			}).then(function() {
				done()
			})
		})
		o("works via POST", function(done) {
			mock.$defineRoutes({
				"POST /item": function() {
					return {status: 200, responseText: JSON.stringify({a: 1})}
				}
			})
			request({method: "POST", url: "/item"}).then(function(data) {
				o(data).deepEquals({a: 1})
			}).then(done)
		})
		o("first argument can act as URI with second argument providing options", function(done) {
			mock.$defineRoutes({
				"POST /item": function() {
					return {status: 200, responseText: JSON.stringify({a: 1})}
				}
			})
			request("/item", {method: "POST"}).then(function(data) {
				o(data).deepEquals({a: 1})
			}).then(done)
		})
		o("first argument keeps protocol", function(done) {
			mock.$defineRoutes({
				"POST /item": function(request) {
					o(request.rawUrl).equals("https://example.com/item")
					return {status: 200, responseText: JSON.stringify({a: 1})}
				}
			})
			request("https://example.com/item", {method: "POST"}).then(function(data) {
				o(data).deepEquals({a: 1})
			}).then(done)
		})
		o("works w/ parameterized data via GET", function(done) {
			mock.$defineRoutes({
				"GET /item": function(request) {
					return {status: 200, responseText: JSON.stringify({a: request.query})}
				}
			})
			request({method: "GET", url: "/item", params: {x: "y"}}).then(function(data) {
				o(data).deepEquals({a: "?x=y"})
			}).then(done)
		})
		o("works w/ parameterized data via POST", function(done) {
			mock.$defineRoutes({
				"POST /item": function(request) {
					return {status: 200, responseText: JSON.stringify({a: JSON.parse(request.body)})}
				}
			})
			request({method: "POST", url: "/item", body: {x: "y"}}).then(function(data) {
				o(data).deepEquals({a: {x: "y"}})
			}).then(done)
		})
		o("works w/ parameterized data containing colon via GET", function(done) {
			mock.$defineRoutes({
				"GET /item": function(request) {
					return {status: 200, responseText: JSON.stringify({a: request.query})}
				}
			})
			request({method: "GET", url: "/item", params: {x: ":y"}}).then(function(data) {
				o(data).deepEquals({a: "?x=%3Ay"})
			}).then(done)
		})
		o("works w/ parameterized data containing colon via POST", function(done) {
			mock.$defineRoutes({
				"POST /item": function(request) {
					return {status: 200, responseText: JSON.stringify({a: JSON.parse(request.body)})}
				}
			})
			request({method: "POST", url: "/item", body: {x: ":y"}}).then(function(data) {
				o(data).deepEquals({a: {x: ":y"}})
			}).then(done)
		})
		o("works w/ parameterized url via GET", function(done) {
			mock.$defineRoutes({
				"GET /item/y": function(request) {
					return {status: 200, responseText: JSON.stringify({a: request.url, b: request.query, c: request.body})}
				}
			})
			request({method: "GET", url: "/item/:x", params: {x: "y"}}).then(function(data) {
				o(data).deepEquals({a: "/item/y", b: {}, c: null})
			}).then(done)
		})
		o("works w/ parameterized url via POST", function(done) {
			mock.$defineRoutes({
				"POST /item/y": function(request) {
					return {status: 200, responseText: JSON.stringify({a: request.url, b: request.query, c: request.body})}
				}
			})
			request({method: "POST", url: "/item/:x", params: {x: "y"}}).then(function(data) {
				o(data).deepEquals({a: "/item/y", b: {}, c: null})
			}).then(done)
		})
		o("works w/ parameterized url + body via GET", function(done) {
			mock.$defineRoutes({
				"GET /item/y": function(request) {
					return {status: 200, responseText: JSON.stringify({a: request.url, b: request.query, c: JSON.parse(request.body)})}
				}
			})
			request({method: "GET", url: "/item/:x", params: {x: "y"}, body: {a: "b"}}).then(function(data) {
				o(data).deepEquals({a: "/item/y", b: {}, c: {a: "b"}})
			}).then(done)
		})
		o("works w/ parameterized url + body via POST", function(done) {
			mock.$defineRoutes({
				"POST /item/y": function(request) {
					return {status: 200, responseText: JSON.stringify({a: request.url, b: request.query, c: JSON.parse(request.body)})}
				}
			})
			request({method: "POST", url: "/item/:x", params: {x: "y"}, body: {a: "b"}}).then(function(data) {
				o(data).deepEquals({a: "/item/y", b: {}, c: {a: "b"}})
			}).then(done)
		})
		o("works w/ parameterized url + query via GET", function(done) {
			mock.$defineRoutes({
				"GET /item/y": function(request) {
					return {status: 200, responseText: JSON.stringify({a: request.url, b: request.query, c: request.body})}
				}
			})
			request({method: "GET", url: "/item/:x", params: {x: "y", q: "term"}}).then(function(data) {
				o(data).deepEquals({a: "/item/y", b: "?q=term", c: null})
			}).then(done)
		})
		o("works w/ parameterized url + query via POST", function(done) {
			mock.$defineRoutes({
				"POST /item/y": function(request) {
					return {status: 200, responseText: JSON.stringify({a: request.url, b: request.query, c: request.body})}
				}
			})
			request({method: "POST", url: "/item/:x", params: {x: "y", q: "term"}}).then(function(data) {
				o(data).deepEquals({a: "/item/y", b: "?q=term", c: null})
			}).then(done)
		})
		o("works w/ parameterized url + query + body via GET", function(done) {
			mock.$defineRoutes({
				"GET /item/y": function(request) {
					return {status: 200, responseText: JSON.stringify({a: request.url, b: request.query, c: JSON.parse(request.body)})}
				}
			})
			request({method: "GET", url: "/item/:x", params: {x: "y", q: "term"}, body: {a: "b"}}).then(function(data) {
				o(data).deepEquals({a: "/item/y", b: "?q=term", c: {a: "b"}})
			}).then(done)
		})
		o("works w/ parameterized url + query + body via POST", function(done) {
			mock.$defineRoutes({
				"POST /item/y": function(request) {
					return {status: 200, responseText: JSON.stringify({a: request.url, b: request.query, c: JSON.parse(request.body)})}
				}
			})
			request({method: "POST", url: "/item/:x", params: {x: "y", q: "term"}, body: {a: "b"}}).then(function(data) {
				o(data).deepEquals({a: "/item/y", b: "?q=term", c: {a: "b"}})
			}).then(done)
		})
		o("works w/ array", function(done) {
			mock.$defineRoutes({
				"POST /items": function(request) {
					return {status: 200, responseText: JSON.stringify({a: request.url, b: JSON.parse(request.body)})}
				}
			})
			request({method: "POST", url: "/items", body: [{x: "y"}]}).then(function(data) {
				o(data).deepEquals({a: "/items", b: [{x: "y"}]})
			}).then(done)
		})
		o("ignores unresolved parameter via GET", function(done) {
			mock.$defineRoutes({
				"GET /item/:x": function(request) {
					return {status: 200, responseText: JSON.stringify({a: request.url})}
				}
			})
			request({method: "GET", url: "/item/:x"}).then(function(data) {
				o(data).deepEquals({a: "/item/:x"})
			}).then(done)
		})
		o("ignores unresolved parameter via POST", function(done) {
			mock.$defineRoutes({
				"GET /item/:x": function(request) {
					return {status: 200, responseText: JSON.stringify({a: request.url})}
				}
			})
			request({method: "GET", url: "/item/:x"}).then(function(data) {
				o(data).deepEquals({a: "/item/:x"})
			}).then(done)
		})
		o("type parameter works for Array responses", function(done) {
			var Entity = function(args) {
				return {_id: args.id}
			}

			mock.$defineRoutes({
				"GET /item": function() {
					return {status: 200, responseText: JSON.stringify([{id: 1}, {id: 2}, {id: 3}])}
				}
			})
			request({method: "GET", url: "/item", type: Entity}).then(function(data) {
				o(data).deepEquals([{_id: 1}, {_id: 2}, {_id: 3}])
			}).then(done)
		})
		o("type parameter works for Object responses", function(done) {
			var Entity = function(args) {
				return {_id: args.id}
			}

			mock.$defineRoutes({
				"GET /item": function() {
					return {status: 200, responseText: JSON.stringify({id: 1})}
				}
			})
			request({method: "GET", url: "/item", type: Entity}).then(function(data) {
				o(data).deepEquals({_id: 1})
			}).then(done)
		})
		o("serialize parameter works in GET", function(done) {
			var serialize = function(data) {
				return "id=" + data.id
			}

			mock.$defineRoutes({
				"GET /item": function(request) {
					return {status: 200, responseText: JSON.stringify({body: request.query})}
				}
			})
			request({method: "GET", url: "/item", serialize: serialize, params: {id: 1}}).then(function(data) {
				o(data.body).equals("?id=1")
			}).then(done)
		})
		o("serialize parameter works in POST", function(done) {
			var serialize = function(data) {
				return "id=" + data.id
			}

			mock.$defineRoutes({
				"POST /item": function(request) {
					return {status: 200, responseText: JSON.stringify({body: request.body})}
				}
			})
			request({method: "POST", url: "/item", serialize: serialize, body: {id: 1}}).then(function(data) {
				o(data.body).equals("id=1")
			}).then(done)
		})
		o("deserialize parameter works in GET", function(done) {
			var deserialize = function(data) {
				return data
			}

			mock.$defineRoutes({
				"GET /item": function() {
					return {status: 200, responseText: JSON.stringify({test: 123})}
				}
			})
			request({method: "GET", url: "/item", deserialize: deserialize}).then(function(data) {
				o(data).deepEquals({test: 123})
			}).then(done)
		})
		o("deserialize parameter works in POST", function(done) {
			var deserialize = function(data) {
				return data
			}

			mock.$defineRoutes({
				"POST /item": function() {
					return {status: 200, responseText: JSON.stringify({test: 123})}
				}
			})
			request({method: "POST", url: "/item", deserialize: deserialize}).then(function(data) {
				o(data).deepEquals({test: 123})
			}).then(done)
		})
		o("extract parameter works in GET", function(done) {
			var extract = function() {
				return {test: 123}
			}

			mock.$defineRoutes({
				"GET /item": function() {
					return {status: 200, responseText: ""}
				}
			})
			request({method: "GET", url: "/item", extract: extract}).then(function(data) {
				o(data).deepEquals({test: 123})
			}).then(done)
		})
		o("extract parameter works in POST", function(done) {
			var extract = function() {
				return {test: 123}
			}

			mock.$defineRoutes({
				"POST /item": function() {
					return {status: 200, responseText: ""}
				}
			})
			request({method: "POST", url: "/item", extract: extract}).then(function(data) {
				o(data).deepEquals({test: 123})
			}).then(done)
		})
		o("ignores deserialize if extract is defined", function(done) {
			var extract = function(data) {
				return data.status
			}
			var deserialize = o.spy()

			mock.$defineRoutes({
				"GET /item": function() {
					return {status: 200, responseText: ""}
				}
			})
			request({method: "GET", url: "/item", extract: extract, deserialize: deserialize}).then(function(data) {
				o(data).equals(200)
			}).then(function() {
				o(deserialize.callCount).equals(0)
			}).then(done)
		})
		o("config parameter works", function(done) {
			mock.$defineRoutes({
				"POST /item": function() {
					return {status: 200, responseText: ""}
				}
			})
			request({method: "POST", url: "/item", config: config}).then(done)

			function config(xhr) {
				o(typeof xhr.setRequestHeader).equals("function")
				o(typeof xhr.open).equals("function")
				o(typeof xhr.send).equals("function")
			}
		})
		o("requests don't block each other", function(done) {
			mock.$defineRoutes({
				"GET /item": function() {
					return {status: 200, responseText: "[]"}
				}
			})
			request("/item").then(function() {
				return request("/item")
			})
			request("/item").then(function() {
				return request("/item")
			})
			setTimeout(function() {
				o(complete.callCount).equals(4)
				done()
			}, 20)
		})
		o("requests trigger finally once with a chained then", function(done) {
			mock.$defineRoutes({
				"GET /item": function() {
					return {status: 200, responseText: "[]"}
				}
			})
			var promise = request("/item")
			promise.then(function() {}).then(function() {})
			promise.then(function() {}).then(function() {})
			setTimeout(function() {
				o(complete.callCount).equals(1)
				done()
			}, 20)
		})
		o("requests does not trigger finally when background: true", function(done) {
			mock.$defineRoutes({
				"GET /item": function() {
					return {status: 200, responseText: "[]"}
				}
			})
			request("/item", {background: true}).then(function() {})

			setTimeout(function() {
				o(complete.callCount).equals(0)
				done()
			}, 20)
		})
		o("headers are set when header arg passed", function(done) {
			mock.$defineRoutes({
				"POST /item": function() {
					return {status: 200, responseText: ""}
				}
			})
			request({method: "POST", url: "/item", config: config, headers: {"Custom-Header": "Value"}}).then(done)

			function config(xhr) {
				o(xhr.getRequestHeader("Custom-Header")).equals("Value")
			}
		})
		o("headers are with higher precedence than default headers", function(done) {
			mock.$defineRoutes({
				"POST /item": function() {
					return {status: 200, responseText: ""}
				}
			})
			request({method: "POST", url: "/item", config: config, headers: {"Content-Type": "Value"}}).then(done)

			function config(xhr) {
				o(xhr.getRequestHeader("Content-Type")).equals("Value")
			}
		})
		o("doesn't fail on abort", function(done) {
			mock.$defineRoutes({
				"GET /item": function() {
					return {status: 200, responseText: JSON.stringify({a: 1})}
				}
			})

			var failed = false
			var resolved = false
			function handleAbort(xhr) {
				var onreadystatechange = xhr.onreadystatechange
				xhr.onreadystatechange = function() {
					onreadystatechange.call(xhr, {target: xhr})
					setTimeout(function() { // allow promises to (not) resolve first
						o(failed).equals(false)
						o(resolved).equals(false)
						done()
					}, 0)
				}
				xhr.abort()
			}
			request({method: "GET", url: "/item", config: handleAbort}).catch(function() {
				failed = true
			})
				.then(function() {
					resolved = true
				})
		})
		o("doesn't fail on replaced abort", function(done) {
			mock.$defineRoutes({
				"GET /item": function() {
					return {status: 200, responseText: JSON.stringify({a: 1})}
				}
			})

			var failed = false
			var resolved = false
			var abortSpy = o.spy()
			var replacement
			function handleAbort(xhr) {
				var onreadystatechange = xhr.onreadystatechange
				xhr.onreadystatechange = function() {
					onreadystatechange.call(xhr, {target: xhr})
					setTimeout(function() { // allow promises to (not) resolve first
						o(failed).equals(false)
						o(resolved).equals(false)
						done()
					}, 0)
				}
				return replacement = {
					send: xhr.send.bind(xhr),
					abort: abortSpy,
				}
			}
			request({method: "GET", url: "/item", config: handleAbort}).then(function() {
				resolved = true
			}, function() {
				failed = true
			})
			replacement.abort()
			o(abortSpy.callCount).equals(1)
		})
		o("doesn't fail on file:// status 0", function(done) {
			mock.$defineRoutes({
				"GET /item": function() {
					return {status: 0, responseText: JSON.stringify({a: 1})}
				}
			})
			var failed = false
			request({method: "GET", url: "file:///item"}).catch(function() {
				failed = true
			}).then(function(data) {
				o(failed).equals(false)
				o(data).deepEquals({a: 1})
			}).then(function() {
				done()
			})
		})
		o("set timeout to xhr instance", function() {
			mock.$defineRoutes({
				"GET /item": function() {
					return {status: 200, responseText: ""}
				}
			})
			return request({
				method: "GET", url: "/item",
				timeout: 42,
				config: function(xhr) {
					o(xhr.timeout).equals(42)
				}
			})
		})
		o("set responseType to request instance", function() {
			mock.$defineRoutes({
				"GET /item": function() {
					return {status: 200, responseText: ""}
				}
			})
			return request({
				method: "GET", url: "/item",
				responseType: "blob",
				config: function(xhr) {
					o(xhr.responseType).equals("blob")
				}
			})
		})
		o("params unmodified after interpolate", function() {
			mock.$defineRoutes({
				"PUT /items/1": function() {
					return {status: 200, responseText: "[]"}
				}
			})
			var params = {x: 1, y: 2}
			var p = request({method: "PUT", url: "/items/:x", params: params})

			o(params).deepEquals({x: 1, y: 2})

			return p
		})
		o("can return replacement from config", function() {
			mock.$defineRoutes({
				"GET /a": function() {
					return {status: 200, responseText: "[]"}
				}
			})
			var result
			return request({
				url: "/a",
				config: function(xhr) {
					return result = {
						send: o.spy(xhr.send.bind(xhr)),
					}
				},
			})
				.then(function () {
					o(result.send.callCount).equals(1)
				})
		})
		o("can abort from replacement", function() {
			mock.$defineRoutes({
				"GET /a": function() {
					return {status: 200, responseText: "[]"}
				}
			})
			var result

			request({
				url: "/a",
				config: function(xhr) {
					return result = {
						send: o.spy(xhr.send.bind(xhr)),
						abort: o.spy(),
					}
				},
			})

			result.abort()
		})
	})
	o.spec("failure", function() {
		o("rejects on server error", function(done) {
			mock.$defineRoutes({
				"GET /item": function() {
					return {status: 500, responseText: JSON.stringify({error: "error"})}
				}
			})
			request({method: "GET", url: "/item"}).catch(function(e) {
				o(e instanceof Error).equals(true)
				o(e.message).equals("[object Object]")
				o(e.response).deepEquals({error: "error"})
				o(e.code).equals(500)
			}).then(done)
		})
		o("adds response to Error", function(done) {
			mock.$defineRoutes({
				"GET /item": function() {
					return {status: 500, responseText: JSON.stringify({message: "error", stack: "error on line 1"})}
				}
			})
			request({method: "GET", url: "/item"}).catch(function(e) {
				o(e instanceof Error).equals(true)
				o(e.response.message).equals("error")
				o(e.response.stack).equals("error on line 1")
			}).then(done)
		})
		o("rejects on non-JSON server error", function(done) {
			mock.$defineRoutes({
				"GET /item": function() {
					return {status: 500, responseText: "error"}
				}
			})
			request({method: "GET", url: "/item"}).catch(function(e) {
				o(e.message).equals("null")
				o(e.response).equals(null)
			}).then(done)
		})
		o("triggers all branched catches upon rejection", function(done) {
			mock.$defineRoutes({
				"GET /item": function() {
					return {status: 500, responseText: "error"}
				}
			})
			var promise = request({method: "GET", url: "/item"})
			var then = o.spy()
			var catch1 = o.spy()
			var catch2 = o.spy()
			var catch3 = o.spy()

			promise.catch(catch1)
			promise.then(then, catch2)
			promise.then(then).catch(catch3)

			callAsync(function() {
				callAsync(function() {
					callAsync(function() {
						o(catch1.callCount).equals(1)
						o(then.callCount).equals(0)
						o(catch2.callCount).equals(1)
						o(catch3.callCount).equals(1)
						done()
					})
				})
			})
		})
		o("rejects on cors-like error", function(done) {
			mock.$defineRoutes({
				"GET /item": function() {
					return {status: 0}
				}
			})
			request({method: "GET", url: "/item"}).catch(function(e) {
				o(e instanceof Error).equals(true)
			}).then(done)
		})
		o("does not reject on status error code when extract provided", function(done) {
			mock.$defineRoutes({
				"GET /item": function() {
					return {status: 500, responseText: JSON.stringify({message: "error"})}
				}
			})
			request({
				method: "GET", url: "/item",
				extract: function(xhr) {return JSON.parse(xhr.responseText)}
			}).then(function(data) {
				o(data.message).equals("error")
				done()
			})
		})
		o("rejects on error in extract", function(done) {
			mock.$defineRoutes({
				"GET /item": function() {
					return {status: 200, responseText: JSON.stringify({a: 1})}
				}
			})
			request({
				method: "GET", url: "/item",
				extract: function() {throw new Error("error")}
			}).catch(function(e) {
				o(e instanceof Error).equals(true)
				o(e.message).equals("error")
			}).then(function() {
				done()
			})
		})
	})
	o.spec("json header", function() {
		function checkUnset(method) {
			o("doesn't set header on " + method + " without body", function(done) {
				var routes = {}
				routes[method + " /item"] = function() {
					return {status: 200, responseText: JSON.stringify({a: 1})}
				}
				mock.$defineRoutes(routes)
				request({
					method: method, url: "/item",
					config: function(xhr) {
						var header = xhr.getRequestHeader("Content-Type")
						o(header).equals(undefined)
						header = xhr.getRequestHeader("Accept")
						o(header).equals("application/json, text/*")
					}
				}).then(function(result) {
					o(result).deepEquals({a: 1})
					done()
				}).catch(function(e) {
					done(e)
				})
			})
		}

		function checkSet(method, body) {
			o("sets header on " + method + " with body", function(done) {
				var routes = {}
				routes[method + " /item"] = function(response) {
					return {
						status: 200,
						responseText: JSON.stringify({body: JSON.parse(response.body)}),
					}
				}
				mock.$defineRoutes(routes)
				request({
					method: method, url: "/item", body: body,
					config: function(xhr) {
						var header = xhr.getRequestHeader("Content-Type")
						o(header).equals("application/json; charset=utf-8")
						header = xhr.getRequestHeader("Accept")
						o(header).equals("application/json, text/*")
					}
				}).then(function(result) {
					o(result).deepEquals({body: body})
					done()
				}).catch(function(e) {
					done(e)
				})
			})
		}

		checkUnset("GET")
		checkUnset("HEAD")
		checkUnset("OPTIONS")
		checkUnset("POST")
		checkUnset("PUT")
		checkUnset("DELETE")
		checkUnset("PATCH")

		checkSet("GET", {foo: "bar"})
		checkSet("HEAD", {foo: "bar"})
		checkSet("OPTIONS", {foo: "bar"})
		checkSet("POST", {foo: "bar"})
		checkSet("PUT", {foo: "bar"})
		checkSet("DELETE", {foo: "bar"})
		checkSet("PATCH", {foo: "bar"})
	})

	// See: https://github.com/MithrilJS/mithril.js/issues/2426
	//
	// TL;DR: lots of subtlety. Make sure you read the ES spec closely before
	// updating this code or the corresponding finalizer code in
	// `request/request` responsible for scheduling autoredraws, or you might
	// inadvertently break things.
	//
	// The precise behavior here is that it schedules a redraw immediately after
	// the second tick *after* the promise resolves, but `await` in engines that
	// have implemented the change in https://github.com/tc39/ecma262/pull/1250
	// will only take one tick to get the value. Engines that haven't
	// implemented that spec change would wait until the tick after the redraw
	// was scheduled before it can see the new value. But this only applies when
	// the engine needs to coerce the value, and this is where things get a bit
	// hairy. As per spec, V8 checks the `.constructor` property of promises and
	// if that `=== Promise`, it does *not* coerce it using `.then`, but instead
	// just resolves it directly. This, of course, can screw with our autoredraw
	// behavior, and we have to work around that. At the time of writing, no
	// other browser checks for this additional constraint, and just blindly
	// invokes `.then` instead, and so we end up working as anticipated. But for
	// obvious reasons, it's a bad idea to rely on a spec violation for things
	// to work unless the spec itself is clearly broken (in this case, it's
	// not). And so we need to test for this very unusual edge case.
	//
	// The direct `eval` is just so I can convert early errors to runtime
	// errors without having to explicitly wire up all the bindings set up in
	// `o.beforeEach`. I evaluate it immediately inside a `try`/`catch` instead
	// of inside the test code so any relevant syntax error can be detected
	// ahead of time and the test skipped entirely. It might trigger mental
	// alarms because `eval` is normally asking for problems, but this is a
	// rare case where it's genuinely safe and rational.
	try {
		// eslint-disable-next-line no-eval
		var runAsyncTest = eval(
			"async () => {\n" +
			"    var p = request('/item')\n" +
			"    o(complete.callCount).equals(0)\n" +
			// Note: this step does *not* invoke `.then` on the promise returned
			// from `p.then(resolve, reject)`.
			"    await p\n" +
			// The spec prior to https://github.com/tc39/ecma262/pull/1250 used
			// to take 3 ticks instead of 1, so `complete` would have been
			// called already and we would've been done. After it, it now takes
			// 1 tick and so `complete` wouldn't have yet been called - it takes
			// 2 ticks to get called. And so we have to wait for one more ticks
			// for `complete` to get called.
			"    await null\n" +
			"    o(complete.callCount).equals(1)\n" +
			"}"
		)

		o("invokes the redraw in native async/await", function () {
			// Use the native promise for correct semantics. This test will fail
			// if you use the polyfill, as it's based on `setImmediate` (falling
			// back to `setTimeout`), and promise microtasks are run at higher
			// priority than either of those.
			request = Request(mock, Promise, complete).request
			mock.$defineRoutes({
				"GET /item": function() {
					return {status: 200, responseText: "[]"}
				}
			})
			return runAsyncTest()
		})
	} catch (e) {
		// ignore - this is just for browsers that natively support
		// `async`/`await`, like most modern browsers.
		// it's just a syntax error anyways.
	}
})
