"use strict"

var callAsync = require("../../test-utils/callAsync")
var o = require("../ospec")


// this throws an async error that can't be caught in browsers
if (typeof process !== "undefined") {
	o("incomplete assertion", function(done) {
		var stackMatcher = /([\w\.\\\/\-]+):(\d+):/
		// /!\ this test relies on the `new Error` expression being six lines
		// above the `oo("test", function(){...})` call.
		var matches = (new Error).stack.match(stackMatcher)
		if (matches != null) {
			var name = matches[1]
			var num = Number(matches[2])
		}
		var oo = o.new()
		oo("test", function() {
			oo("incomplete")
		})
		oo.run(function(results) {
			o(results.length).equals(1)
			o(results[0].message).equals("Incomplete assertion in the test definition starting at...")
			o(results[0].pass).equals(null)
			var stack = o.cleanStackTrace(results[0].testError)
			var matches2 = stack && stack.match(stackMatcher)
			if (matches != null && matches2 != null) {
				o(matches[1]).equals(name)
				o(Number(matches2[2])).equals(num + 6)
			}
			done()
		})
	})
}

o("o.only", function(done) {
	var oo = o.new()

	oo.spec("won't run", function() {
		oo("nope, skipped", function() {
			o(true).equals(false)
		})
	})

	oo.spec("ospec", function() {
		oo("skipped as well", function() {
			oo(true).equals(false)
		})
		oo.only(".only()", function() {
			oo(2).equals(2)
		}, true)
		oo.only("another .only()", function(done) {
			done("that fails")
		}, true)
	})

	oo.run(function(results){
		o(results.length).equals(2)
		o(results[0].pass).equals(true)
		o(results[1].pass).equals(false)

		done()
	})
})

// Predicate test passing on clone results
o.spec("reporting", function() {
	var oo
	o.beforeEach(function(){
		oo = o.new()

		oo.spec("clone", function() {
			oo("fail", function() {
				oo(true).equals(false)
			})

			oo("pass", function() {
				oo(true).equals(true)
			})
		})
	})
	o("reports per instance", function(done, timeout) {
		timeout(100) // Waiting on clone

		oo.run(function(results) {
			o(typeof results).equals("object")
			o("length" in results).equals(true)
			o(results.length).equals(2)("Two results")

			o("error" in results[0] && "pass" in results[0]).equals(true)("error and pass keys present in failing result")
			o("message" in results[0] && "context" in results[0]).equals(true)("message and context keys present in failing result")
			o("message" in results[1] && "context" in results[1]).equals(true)("message and context keys present in passing result")
			o(results[0].pass).equals(false)("Test meant to fail has failed")
			o(results[1].pass).equals(true)("Test meant to pass has passed")

			done()
		})
	})
	o("o.report() returns the number of failures", function () {
		var log = console.log, error = console.error
		console.log = o.spy()
		console.error = o.spy()

		function makeError(msg) {try{throw msg ? new Error(msg) : new Error} catch(e){return e}}
		try {
			var errCount = o.report([{pass: true}, {pass: true}])

			o(errCount).equals(0)
			o(console.log.callCount).equals(1)
			o(console.error.callCount).equals(0)

			errCount = o.report([
				{pass: false, error: makeError("hey"), message: "hey"}
			])

			o(errCount).equals(1)
			o(console.log.callCount).equals(2)
			o(console.error.callCount).equals(1)

			errCount = o.report([
				{pass: false, error: makeError("hey"), message: "hey"},
				{pass: true},
				{pass: false, error: makeError("ho"), message: "ho"}
			])

			o(errCount).equals(2)
			o(console.log.callCount).equals(3)
			o(console.error.callCount).equals(3)
		} catch (e) {
			o(1).equals(0)("Error while testing the reporter")
		}

		console.log = log
		console.error = error
	})
})

o.spec("ospec", function() {
	o.spec("sync", function() {
		var a = 0, b = 0, illegalAssertionThrows = false
		var reservedTestNameTrows = false

		o.before(function() {a = 1})
		o.after(function() {a = 0})

		o.beforeEach(function() {b = 1})
		o.afterEach(function() {b = 0})

		try {o("illegal assertion")} catch (e) {illegalAssertionThrows = true}
		try {o("\x01reserved test name", function(){})} catch (e) {reservedTestNameTrows = true}

		o("assertions", function() {
			var nestedTestDeclarationThrows = false
			try {o("illegal nested test", function(){})} catch (e) {nestedTestDeclarationThrows = true}

			o(illegalAssertionThrows).equals(true)
			o(nestedTestDeclarationThrows).equals(true)
			o(reservedTestNameTrows).equals(true)

			var spy = o.spy()
			spy(a)

			o(a).equals(b)
			o(a).notEquals(2)
			o({a: [1, 2], b: 3}).deepEquals({a: [1, 2], b: 3})
			o([{a: 1, b: 2}, {c: 3}]).deepEquals([{a: 1, b: 2}, {c: 3}])
			o(function(){throw new Error()}).throws(Error)
			o(function(){"ayy".foo()}).throws(TypeError)
			o(function(){Math.PI.toFixed(Math.pow(10,20))}).throws(RangeError)
			o(function(){decodeURIComponent("%")}).throws(URIError)

			o(function(){"ayy".foo()}).notThrows(SyntaxError)
			o(function(){throw new Error("foo")}).throws("foo")
			o(function(){throw new Error("foo")}).notThrows("bar")

			var undef1 = {undef: void 0}
			var undef2 = {UNDEF: void 0}

			o(undef1).notDeepEquals(undef2)
			o(undef1).notDeepEquals({})
			o({}).notDeepEquals(undef1)

			var sparse1 = [void 1, void 2, void 3]
			delete sparse1[0]
			var sparse2 = [void 1, void 2, void 3]
			delete sparse2[1]

			o(sparse1).notDeepEquals(sparse2)

			var monkeypatch1 = [1, 2]
			monkeypatch1.field = 3
			var monkeypatch2 = [1, 2]
			monkeypatch2.field = 4

			o(monkeypatch1).notDeepEquals([1, 2])
			o(monkeypatch1).notDeepEquals(monkeypatch2)

			monkeypatch2.field = 3
			o(monkeypatch1).deepEquals(monkeypatch2)

			monkeypatch1.undef = undefined
			monkeypatch2.UNDEF = undefined

			o(monkeypatch1).notDeepEquals(monkeypatch2)

			var values = ["a", "", 1, 0, true, false, null, undefined, Date(0), ["a"], [], function() {return arguments}.call(), new Uint8Array(), {a: 1}, {}]
			for (var i = 0; i < values.length; i++) {
				for (var j = 0; j < values.length; j++) {
					if (i === j) o(values[i]).deepEquals(values[j])
					else o(values[i]).notDeepEquals(values[j])
				}
			}

			o(spy.callCount).equals(1)
			o(spy.args.length).equals(1)
			o(spy.args[0]).equals(1)
			o(spy.calls.length).equals(1)
			o(spy.calls[0]).deepEquals({this: undefined, args: [1]})
		})
		o("spy wrapping", function() {
			var spy = o.spy(function view(vnode){
				this.drawn = true

				return {tag: "div", children: vnode.children}
			})
			var children = [""]
			var state = {}

			var output = spy.call(state, {children: children})

			o(spy.length).equals(1)
			o(spy.name).equals("view")
			o(spy.callCount).equals(1)
			o(spy.args.length).equals(1)
			o(spy.args[0]).deepEquals({children: children})
			o(spy.calls.length).equals(1)
			o(spy.calls[0]).deepEquals({this: state, args: [{children: children}]})
			o(state).deepEquals({drawn: true})
			o(output).deepEquals({tag: "div", children: children})
		})
	})
	o.spec("async callback", function() {
		var a = 0, b = 0
		o.after(function() {
			o(a).equals(0)
			o(b).equals(0)
		})
		o.spec("", function(){
			o.before(function(done) {
				callAsync(function() {
					a = 1
					done()
				})
			})
			o.after(function(done) {
				callAsync(function() {
					a = 0
					done()
				})
			})

			o.beforeEach(function(done) {
				o(b).equals(0)
				callAsync(function() {
					b = 1
					done()
				})
			})
			o.afterEach(function(done) {
				callAsync(function() {
					b = 0
					done()
				})
			})

			o("hooks work as intended the first time", function(done) {
				callAsync(function() {
					var spy = o.spy()
					spy(a)

					o(a).equals(1)
					o(b).equals(1)

					done()
				})
			})
			o("hooks work as intended the second time", function(done) {
				callAsync(function() {
					var spy = o.spy()
					spy(a)

					o(a).equals(1)
					o(b).equals(1)

					done()
				})
			})
		})
	})

	o.spec("throwing in test context is recoreded as a failure", function() {
		var oo
		o.beforeEach(function(){oo = o.new()})
		o.afterEach(function() {
			oo.run(function(results) {
				o(results.length).equals(1)
				o(results[0].pass).equals(false)
			})
		})
		o("sync test", function() {
			oo("throw in sync test", function() {throw new Error})
		})
		o("async test", function() {
			oo("throw in async test", function(done) {
				throw new Error
				done() // eslint-disable-line no-unreachable
			})
		})
	})

	o.spec("timeout", function () {
		o("when using done()", function(done) {
			var oo = o.new()
			var err
			// the success of this test is dependent on having the
			// oo() call three linew below this one
			try {throw new Error} catch(e) {err = e}
			if (err.stack) {
				var line = Number(err.stack.match(/:(\d+):/)[1])
				oo("", function(oodone, timeout) {
					// oodone() keep this line for now
					timeout(1)
				})
				oo.run((function(results) {
					o(results.length).equals(1)
					o(results[0].pass).equals(false)
					// todo test cleaned up results[0].error stack trace for the presence
					// of the timeout stack entry
					o(results[0].testError instanceof Error).equals(true)
					o(o.cleanStackTrace(results[0].testError).indexOf("test-ospec.js:" + (line + 3) + ":")).notEquals(-1)

					done()
				}))
			} else {
				done()
			}
		})
		o("when using a thenable", function(done) {
			var oo = o.new()
			var err
			// the success of this test is dependent on having the
			// oo() call three linew below this one
			try {throw new Error} catch(e) {err = e}
			if (err.stack) {
				var line = Number(err.stack.match(/:(\d+):/)[1])
				oo("", function() {
					oo.timeout(1)
					return {then: function(){}}
				})
				oo.run((function(results) {
					o(results.length).equals(1)
					o(results[0].pass).equals(false)
					o(results[0].testError instanceof Error).equals(true)
					o(o.cleanStackTrace(results[0].testError).indexOf("test-ospec.js:" + (line + 3) + ":")).notEquals(-1)

					done()
				}))
			} else {
				done()
			}
		})
	})
	o.spec("o.timeout", function() {
		o("throws when called out of test definitions", function(done) {
			var oo = o.new()
			var count = 0
			try { oo.timeout(1) } catch (e) { count++ }
			oo.spec("a spec", function() {
				try { oo.timeout(1) } catch (e) { count++ }
			})
			oo("", function() {
				oo.timeout(30)
				return {then: function(f) {setTimeout(f)}}
			})
			oo.run(function(){
				o(count).equals(2)

				done()
			})
		})
		o("works", function(done) {
			var oo = o.new()
			var t = new Date
			oo("", function() {
				oo.timeout(10)
				return {then: function() {}}
			})
			oo.run(function(){
				o(new Date - t >= 10).equals(true)
				o(200 > new Date - t).equals(true)

				done()
			})
		})
	})
	o.spec("o.specTimeout", function() {
		o("throws when called inside of test definitions", function(done) {
			var err
			var oo = o.new()
			oo("", function() {
				try { oo.specTimeout(5) } catch (e) {err = e}
				return {then: function(f) {setTimeout(f)}}
			})
			oo.run(function(){
				o(err instanceof Error).equals(true)

				done()
			})
		})
		o("works", function(done) {
			var oo = o.new()
			var t

			oo.specTimeout(10)
			oo.beforeEach(function () {
				t = new Date
			})
			oo.afterEach(function () {
				var diff = new Date - t
				o(diff >= 10).equals(true)
				o(diff < 200).equals(true)
			})

			oo("", function() {
				oo(true).equals(true)

				return {then: function() {}}
			})

			oo.run(function(results) {
				o(results.length).equals(2)
				o(results[0].pass).equals(true)
				o(results[1].pass).equals(false)
				done()
			})
		})
		o("The parent and sibling suites are not affected by the specTimeout", function(done) {
			var oo = o.new()
			var t

			oo.specTimeout(50)
			oo.beforeEach(function () {
				t = new Date
			})
			oo.afterEach(function () {
				var diff = new Date - t
				o(diff >= 50).equals(true)
				o(diff < 80).equals(true)
			})

			oo.spec("nested 1", function () {
				oo.specTimeout(80)
			})

			oo("", function() {
				oo(true).equals(true)

				return {then: function() {}}
			})
			oo.spec("nested 2", function () {
				oo.specTimeout(80)
			})
			oo.spec("nested 3", function () {
				oo("", function() {
					oo(true).equals(true)

					return {then: function() {}}
				})
			})
			oo.run(function(results) {
				o(results.length).equals(4)
				o(results[0].pass).equals(true)
				o(results[1].pass).equals(false)
				o(results[2].pass).equals(true)
				o(results[3].pass).equals(false)
				done()
			})
		})
		o("nested suites inherit the specTimeout", function(done) {
			var oo = o.new()

			oo.specTimeout(50)
			oo.spec("nested", function () {
				oo.spec("deeply", function() {
					var t

					oo.beforeEach(function () {
						t = new Date
					})
					oo.afterEach(function () {
						var diff = new Date - t
						o(diff >= 50).equals(true)
						o(diff < 80).equals(true)
					})

					oo("", function() {
						oo(true).equals(true)

						return {then: function() {}}
					})
				})
			})
			oo.run(function(results) {
				o(results.length).equals(2)
				o(results[0].pass).equals(true)
				o(results[1].pass).equals(false)
				done()
			})
		})
	})

	o.spec("calling done() twice throws", function () {
		o("two successes", function(done) {
			var oo = o.new()
			var err = null
			oo("foo", function(oodone) {
				try {
					oodone()
					oodone()
				} catch (e) {
					err = e
				}
				o(err instanceof Error).equals(true)
				o(err.message).equals("`oodone()` should only be called once")
			})
			oo.run(function(results) {
				o(results.length).equals(1)
				o(results[0].pass).equals(true)
				done()
			})
		})
		o("a success followed by an error", function(done) {
			var oo = o.new()
			var err = null
			oo("foo", function(oodone) {
				try {
					oodone()
					oodone("error")
				} catch (e) {
					err = e
				}
				o(err instanceof Error).equals(true)
				o(err.message).equals("`oodone()` should only be called once")
			})
			oo.run(function(results) {
				o(results.length).equals(1)
				o(results[0].pass).equals(true)
				done()
			})
		})
		o("two errors", function(done) {
			var oo = o.new()
			var err = null
			oo("foo", function(oodone) {
				try {
					oodone("bar")
					oodone("baz")
				} catch (e) {
					err = e
				}
				o(err instanceof Error).equals(true)
				o(err.message).equals("`oodone()` should only be called once")
			})
			oo.run(function(results) {
				o(results.length).equals(1)
				o(results[0].pass).equals(false)
				o(results[0].message).equals("bar")
				done()
			})
		})
		o("an error followed by a success", function(done) {
			var oo = o.new()
			var err = null
			oo("foo", function(oodone) {
				try {
					oodone("bar")
					oodone()
				} catch (e) {
					err = e
				}
				o(err instanceof Error).equals(true)
				o(err.message).equals("`oodone()` should only be called once")
			})
			oo.run(function(results) {
				o(results.length).equals(1)
				o(results[0].pass).equals(false)
				o(results[0].message).equals("bar")
				done()
			})
		})
	})

	o.spec("stack trace cleaner", function() {
		o("handles line breaks", function() {
			try {
				throw new Error("line\nbreak")
			} catch(error) {
				var trace = o.cleanStackTrace(error)
				o(trace).notEquals("break")
				o(trace.indexOf("test-ospec.js") !== -1).equals(true)
			}
		})
	})

	o.spec("async promise", function() {
		var a = 0, b = 0

		function wrapPromise(fn) {
			return new Promise((resolve, reject) => {
				callAsync(() => {
					try {
						fn()
						resolve()
					} catch(e) {
						reject(e)
					}
				})
			})
		}

		o.before(function() {
			return wrapPromise(() => {
				a = 1
			})
		})

		o.after(function() {
			return wrapPromise(function() {
				a = 0
			})
		})

		o.beforeEach(function() {
			return wrapPromise(function() {
				b = 1
			})
		})
		o.afterEach(function() {
			return wrapPromise(function() {
				b = 0
			})
		})

		o("promise functions", function() {
			return wrapPromise(function() {
				o(a).equals(b)
				o(a).equals(1)("a and b should be initialized")
			})
		})
	})
})
o.spec("the done parser", function() {
	o("accepts non-English names", function() {
		var oo = o.new()
		var threw = false
		oo("test", function(完了) {
			oo(true).equals(true)
			完了()
		})
		try {oo.run(function(){})} catch(e) {threw = true}
		o(threw).equals(false)
	})
	o("tolerates comments", function() {
		var oo = o.new()
		var threw = false
		oo("test", function(/*hey
			*/ /**/ //ho
			done /*hey
			*/ /**/ //huuu
			, timeout
		) {
			timeout(5)
			oo(true).equals(true)
			done()
		})
		try {oo.run(function(){})} catch(e) {threw = true}
		o(threw).equals(false)
	})
	/*eslint-disable no-eval*/
	try {eval("(()=>{})()"); o.spec("with ES6 arrow functions", function() {
		function getCommentContent(f) {
			f = f.toString()
			return f.slice(f.indexOf("/*") + 2, f.lastIndexOf("*/"))
		}
		o("has no false positives 1", function(){
			var oo = o.new()
			var threw = false
			eval(getCommentContent(function(){/*
				oo(
					'Async test parser mistakenly identified 1st token after a parens to be `done` reference',
					done => {
						oo(threw).equals(false)
						done()
					}
				)
			*/}))
			try {oo.run(function(){})} catch(e) {threw = true}
			o(threw).equals(false)
		})
		o("has no false negatives", function(){
			var oo = o.new()
			var threw = false
			eval(getCommentContent(function(){/*
				oo(
					"Multiple references to the wrong thing doesn't fool the checker",
					done => {
						oo(threw).equals(false)
						oo(threw).equals(false)
					}
				)
			*/}))
			try {oo.run(function(){})} catch(e) {threw = true}
			o(threw).equals(true)
		})
		o("isn't fooled by comments", function(){
			var oo = o.new()
			var threw = false
			oo(
				"comments won't throw the parser off",
				eval("done /*hey*/ /**/ => {oo(threw).equals(false);done()}")
			)
			try {oo.run(function(){})} catch(e) {threw = true}
			o(threw).equals(false)
		})
	})} catch (e) {/*ES5 env, or no eval, ignore*/}
	/*eslint-enable no-eval*/
})
