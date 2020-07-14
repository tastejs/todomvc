"use strict"

var o = require("../../ospec/ospec")
var callAsync = require("../../test-utils/callAsync")
var Promise = require("../../promise/polyfill")

o.spec("promise", function() {
	o.spec("constructor", function() {
		o("constructor throws if called without new", function(done) {
			try {Promise(function() {})} catch(e) {done()}
		})
		o("constructor throws if called without executor", function(done) {
			try {new Promise()} catch(e) {done()}
		})
		o("constructor has correct methods", function() {
			o(typeof Promise.prototype.then).equals("function")
			o(typeof Promise.prototype.catch).equals("function")
			o(typeof Promise.prototype.finally).equals("function")
			o(typeof Promise.resolve).equals("function")
			o(typeof Promise.reject).equals("function")
			o(typeof Promise.race).equals("function")
			o(typeof Promise.all).equals("function")
		})
	})
	o.spec("return value", function() {
		o("static resolve returns promise", function() {
			var promise = Promise.resolve()

			o(promise instanceof Promise).equals(true)
		})
		o("static reject returns promise", function() {
			var promise = Promise.reject()
			promise.catch(function() {})

			o(promise instanceof Promise).equals(true)
		})
		o("static resolve with promise input returns same promise", function() {
			var resolved = Promise.resolve(1)
			var promise = Promise.resolve(resolved)

			o(promise).equals(resolved)
		})
		o("then returns promise", function(done) {
			var promise = Promise.resolve(1)

			promise.then(function(value) {
				o(value).equals(1)
			}).then(done)
		})
		o("catch returns promise", function(done) {
			var promise = Promise.reject(1)

			promise.catch(function(value) {
				o(value).equals(1)
			}).then(done)
		})
		o("finally lets a fulfilled value pass though", function(done) {
			var promise = Promise.resolve(1)
			var spy = o.spy(function(){return 2})

			promise.finally(spy).then(function(value){
				o(value).equals(1)
				o(spy.callCount).equals(1)
				o(spy.args.length).equals(0)
				o(spy.this).equals(undefined)
				done()
			})
		})
		o("finally lets a rejected reason pass though", function(done) {
			var promise = Promise.reject(1)
			var spy = o.spy(function(){return 2})

			promise.finally(spy).catch(function(reason){
				o(reason).equals(1)
				o(spy.callCount).equals(1)
				o(spy.args.length).equals(0)
				o(spy.this).equals(undefined)
				done()
			})
		})
		o("finally overrrides a fulfilled value when it throws", function(done) {
			var promise = Promise.resolve(1)
			var spy = o.spy(function(){throw 2})

			promise.finally(spy).catch(function(reason){
				o(reason).equals(2)
				o(spy.callCount).equals(1)
				o(spy.args.length).equals(0)
				o(spy.this).equals(undefined)
				done()
			})
		})
		o("finally overrrides a fulfilled value when it returns a rejected Promise", function(done) {
			var promise = Promise.resolve(1)
			var spy = o.spy(function(){return Promise.reject(2)})

			promise.finally(spy).catch(function(reason){
				o(reason).equals(2)
				o(spy.callCount).equals(1)
				o(spy.args.length).equals(0)
				o(spy.this).equals(undefined)
				done()
			})
		})
		o("finally overrrides a rejected reason when it throws", function(done) {
			var promise = Promise.reject(1)
			var spy = o.spy(function(){throw 2})

			promise.finally(spy).catch(function(reason){
				o(reason).equals(2)
				o(spy.callCount).equals(1)
				o(spy.args.length).equals(0)
				o(spy.this).equals(undefined)
				done()
			})
		})
		o("finally overrrides a rejected reason when it returns a rejected Promise", function(done) {
			var promise = Promise.reject(1)
			var spy = o.spy(function(){return Promise.reject(2)})

			promise.finally(spy).catch(function(reason){
				o(reason).equals(2)
				o(spy.callCount).equals(1)
				o(spy.args.length).equals(0)
				o(spy.this).equals(undefined)
				done()
			})
		})
	})
	o.spec("resolve", function() {
		o("resolves once", function(done) {
			var callCount = 0
			var promise = new Promise(function(resolve) {
				resolve(1)
				resolve(2)
				callAsync(function() {resolve(3)})
			})

			promise.then(function(value) {
				callCount++

				o(value).equals(1)
				o(callCount).equals(1)
				done()
			})
		})
		o("does not reject after resolve", function(done) {
			var promise = new Promise(function(resolve, reject) {
				resolve(1)
				reject(2)
				callAsync(function() {reject(3)})
			})

			promise.then(function(value) {
				o(value).equals(1)
				done()
			})
		})
		o("resolves asynchronously", function(done) {
			var state = 0

			var promise = Promise.resolve()

			state = 1
			promise.then(function() {
				o(state).equals(2)
				done()
			})
			state = 2
		})
		o("resolves via static method", function(done) {
			var promise = Promise.resolve(1)

			promise.then(function(value) {
				o(value).equals(1)
				done()
			})
		})
		o("resolves asynchronously via executor", function(done) {
			var promise = new Promise(function(resolve) {
				callAsync(function() {resolve(1)})
			})

			promise.then(function(value) {
				o(value).equals(1)
				done()
			})
		})
		o("downstreams correctly", function(done) {
			var promise = Promise.resolve(1)
			var a = promise.then(function(value) {return value + 1})
			var b = promise.then(function(value) {return value + 2})

			a.then(function(aValue) {
				b.then(function(bValue) {
					o(aValue).equals(2)
					o(bValue).equals(3)
					done()
				})
			})
		})
		o("cannot resolve to itself", function(done) {
			var promise = new Promise(function(resolve) {
				callAsync(function() {resolve(promise)})
			})

			promise.then(null, function() { done() })
		})
		o("non-function onFulfilled is ignored", function(done) {
			var promise = Promise.resolve(1)

			promise.then(null, null).then(function(value) {
				o(value).equals(1)
				done()
			})
		})
		o("non-function onFulfilled with no second param is ignored", function(done) {
			var promise = Promise.resolve(1)

			promise.then(null).then(function(value) {
				o(value).equals(1)
				done()
			})
		})
	})
	o.spec("reject", function() {
		o("rejects once", function(done) {
			var callCount = 0
			var promise = new Promise(function(resolve, reject) {
				reject(1)
				reject(2)
				callAsync(function() {reject(3)})
			})

			promise.then(null, function(value) {
				callCount++

				o(value).equals(1)
				o(callCount).equals(1)
				done()
			})
		})
		o("does not resolve after reject", function(done) {
			var promise = new Promise(function(resolve, reject) {
				reject(1)
				resolve(2)
				callAsync(function() {resolve(3)})
			})

			promise.then(null, function(value) {
				o(value).equals(1)
				done()
			})
		})
		o("rejects asynchronously", function(done) {
			var state = 0

			var promise = Promise.reject()

			state = 1
			promise.then(null, function() {
				o(state).equals(2)
				done()
			})
			state = 2
		})
		o("does not catch itself", function(done) {
			var callCount = 0
			var promise = Promise.resolve().then(function() {throw 1}, function() {callCount++})

			promise.then(null, function() {
				o(callCount).equals(0)
				done()
			})
		})
		o("rejects via static method", function(done) {
			var promise = Promise.reject(1)

			promise.then(null, function(value) {
				o(value).equals(1)
				return value
			}).then(function(value) {
				o(value).equals(1)
				done()
			})
		})
		o("rejects synchronously via executor", function(done) {
			var promise = new Promise(function(resolve, reject) {
				reject(1)
			})

			promise.then(null, function(value) {
				o(value).equals(1)
				done()
			})
		})
		o("rejects asynchronously via executor", function(done) {
			var promise = new Promise(function(resolve, reject) {
				callAsync(function() {reject(1)})
			})

			promise.then(null, function(value) {
				o(value).equals(1)
				done()
			})
		})
		o("rejects via executor on error", function(done) {
			var promise = new Promise(function() {
				throw 1
			})

			promise.then(null, function(value) {
				o(value).equals(1)
				done()
			})
		})
		o("rejects on fulfillment error", function(done) {
			var promise = Promise.resolve()

			promise.then(function() {
				throw 1
			}).then(null, function(value) {
				o(value).equals(1)
				done()
			})
		})
		o("rejects on rejection error", function(done) {
			var promise = Promise.resolve()

			promise.then(function() {
				throw 1
			}).then(null, function() {
				throw 2
			}).then(null, function(value) {
				o(value).equals(2)
				done()
			})
		})
		o("non-function onRejected is ignored", function(done) {
			var promise = Promise.reject(1)

			promise.then(function() {}, null).then(null, function(value) {
				o(value).equals(1)
				done()
			})
		})
	})
	o.spec("promise absorption", function() {
		o("absorbs resolved promise via static resolver", function(done) {
			var promise = Promise.resolve(Promise.resolve(1))

			promise.then(function(value) {
				o(value).equals(1)
			}).then(done)
		})
		o("absorbs resolved promise in executor resolve", function(done) {
			var promise = new Promise(function(resolve) {
				var p = Promise.resolve(1)
				resolve(p)
			})

			promise.then(function(value) {
				o(value).equals(1)
				done()
			})
		})
		o("absorbs resolved promise on fulfillment", function(done) {
			var promise = Promise.resolve()

			promise.then(function() {
				return Promise.resolve(1)
			}).then(function(value) {
				o(value).equals(1)
				done()
			})
		})
		o("absorbs rejected promise via static resolver", function(done) {
			var promise = Promise.resolve(Promise.reject(1))

			promise.then(null, function(value) {
				o(value).equals(1)
				done()
			})
		})
		o("absorbs rejected promise in executor resolve", function(done) {
			var promise = new Promise(function(resolve) {
				resolve(Promise.reject(1))
			})

			promise.then(null, function(value) {
				o(value).equals(1)
				done()
			})
		})
		o("absorbs rejected promise on fulfillment", function(done) {
			var promise = Promise.resolve()

			promise.then(function() {
				return Promise.reject(1)
			}).then(null, function(value) {
				o(value).equals(1)
				done()
			})
		})
		o("absorbs pending promise that resolves via static resolver", function(done) {
			var pending = new Promise(function(resolve) {
				setTimeout(function() {resolve(1)}, 10)
			})
			var promise = Promise.resolve(pending)

			promise.then(function(value) {
				o(value).equals(1)
				done()
			})
		})
		o("absorbs pending promise that resolves in executor resolve", function(done) {
			var pending = new Promise(function(resolve) {
				setTimeout(function() {resolve(1)}, 10)
			})
			var promise = new Promise(function(resolve) {
				resolve(pending)
			})

			promise.then(function(value) {
				o(value).equals(1)
				done()
			})
		})
		o("absorbs pending promise that resolves on fulfillment", function(done) {
			var pending = new Promise(function(resolve) {
				setTimeout(function() {resolve(1)}, 10)
			})
			var promise = Promise.resolve()

			promise.then(function() {
				return pending
			}).then(function(value) {
				o(value).equals(1)
				done()
			})
		})
		o("absorbs pending promise that rejects via static resolver", function(done) {
			var pending = new Promise(function(resolve, reject) {
				setTimeout(function() {reject(1)}, 10)
			})
			var promise = Promise.resolve(pending)

			promise.then(null, function(value) {
				o(value).equals(1)
				done()
			})
		})
		o("absorbs pending promise that rejects in executor resolve", function(done) {
			var pending = new Promise(function(resolve, reject) {
				setTimeout(function() {reject(1)}, 10)
			})
			var promise = new Promise(function(resolve) {
				resolve(pending)
			})

			promise.then(null, function(value) {
				o(value).equals(1)
				done()
			})
		})
		o("absorbs pending promise that rejects on fulfillment", function(done) {
			var pending = new Promise(function(resolve, reject) {
				setTimeout(function() {reject(1)}, 10)
			})
			var promise = Promise.resolve()

			promise.then(function() {
				return pending
			}).then(null, function(value) {
				o(value).equals(1)
				done()
			})
		})
		o("triggers all branched rejection handlers upon rejection", function(done) {
			var promise = Promise.reject()
			var then = o.spy()
			var catch1 = o.spy()
			var catch2 = o.spy()
			var catch3 = o.spy()

			promise.catch(catch1)
			promise.then(then, catch2)
			promise.then(then).catch(catch3)

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
		o("does not absorb resolved promise via static rejector", function(done) {
			var promise = Promise.reject(Promise.resolve(1))

			promise.then(null, function(value) {
				o(value instanceof Promise).equals(true)
				done()
			})
		})
		o("does not absorb rejected promise via static rejector", function(done) {
			var rejected = Promise.reject(1)
			rejected.catch(function() {})
			var promise = Promise.reject(rejected)

			promise.then(null, function(value) {
				o(value instanceof Promise).equals(true)
				done()
			})
		})
		o("does not absorb resolved promise in executor reject", function(done) {
			var promise = new Promise(function(resolve, reject) {
				reject(Promise.resolve(1))
			})

			promise.then(null, function(value) {
				o(value instanceof Promise).equals(true)
				done()
			})
		})
		o("does not absorb rejected promise in executor reject", function(done) {
			var promise = new Promise(function(resolve, reject) {
				var rejected = Promise.reject(1)
				rejected.catch(function() {})
				reject(rejected)
			})

			promise.then(null, function(value) {
				o(value instanceof Promise).equals(true)
				done()
			})
		})
		o("does not absorb resolved promise on fulfillment error", function(done) {
			var promise = Promise.resolve()

			promise.then(function() {
				throw Promise.resolve(1)
			}).then(null, function(value) {
				o(value instanceof Promise).equals(true)
				done()
			})
		})
		o("does not absorb rejected promise on fulfillment error", function(done) {
			var promise = Promise.resolve()

			promise.then(function() {
				var rejected = Promise.reject(1)
				rejected.catch(function() {})
				throw rejected
			}).then(null, function(value) {
				o(value instanceof Promise).equals(true)
				done()
			})
		})
		o("promise stays pending if absorbed promise is pending", function(done) {
			var promise = new Promise(function(resolve) {resolve()})
			var fulfilled = false, rejected = false

			promise.then(function() {
				return new Promise(function() {})
			}).then(function() {
				fulfilled = true
			}, function() {
				rejected = false
			})

			setTimeout(function() {
				o(fulfilled).equals(false)
				o(rejected).equals(false)
				done()
			}, 10)
		})
		o("absorbs early resolved promise", function(done) {
			var resolved = Promise.resolve(1)
			var promise = new Promise(function(resolve) {
				setTimeout(function() {
					resolve(resolved)
				}, 10)
			})

			promise.then(function(value) {
				o(value).equals(1)
				done()
			})
		})
	})
	o.spec("race", function() {
		o("resolves to first resolved", function(done) {
			var a = Promise.resolve(1)
			var b = new Promise(function(resolve) {
				callAsync(function() {resolve(2)})
			})
			Promise.race([a, b]).then(function(value) {
				o(value).equals(1)
				done()
			})
		})
		o("rejects to first rejected", function(done) {
			var a = Promise.reject(1)
			var b = new Promise(function(resolve, reject) {
				callAsync(function() {reject(2)})
			})
			Promise.race([a, b]).then(null, function(value) {
				o(value).equals(1)
				done()
			})
		})
	})
	o.spec("all", function() {
		o("resolves to array", function(done) {
			var a = new Promise(function(resolve) {
				callAsync(function() {resolve(1)})
			})
			var b = Promise.resolve(2)
			Promise.all([a, b]).then(function(value) {
				o(value).deepEquals([1, 2])
				done()
			})
		})
		o("resolves empty array", function(done) {
			Promise.all([]).then(function(value) {
				o(value).deepEquals([])
				done()
			})
		})
		o("resolves non-promise to itself", function(done) {
			var a = new Promise(function(resolve) {
				callAsync(function() {resolve(1)})
			})
			var b = Promise.resolve(2)
			var c = 3
			Promise.all([a, b, c]).then(function(value) {
				o(value).deepEquals([1, 2, 3])
				done()
			})
		})
		o("rejects to first rejected", function(done) {
			var a = Promise.reject(1)
			var b = new Promise(function(resolve, reject) {
				callAsync(function() {reject(2)})
			})
			Promise.all([a, b]).then(null, function(value) {
				o(value).equals(1)
				done()
			})
		})
	})
	o.spec("A+ compliance", function() {
		o("accesses then only once", function(done) {
			var readCount = 0
			var promise = Promise.resolve(1).then(function() {
				return Object.create(null, {
					then: {
						get: function () {
							++readCount
							return function(onFulfilled) {
								onFulfilled()
							}
						}
					}
				})
			})

			promise.then(function() {
				o(readCount).equals(1)
				done()
			})
		})
		o("works if thennable resolves twice", function(done) {
			var promise = Promise.resolve({
				then: function(res) {
					res({
						then: function(resolve) {
							setTimeout(function() {resolve(2)})
						}
					})
					res(1)
				}
			})

			promise.then(function(value) {
				o(value).equals(2)
				done()
			})
		})
		o("works if thennable resolves async rejection then throws", function(done) {
			var promise = new Promise(function(res) {
				res({
					then: function(resolve, reject) {
						setTimeout(function() {reject(2)})
					}
				})
				throw 3
			})

			promise.then(null, function(value) {
				o(value).equals(2)
				done()
			})
		})
	})
})
