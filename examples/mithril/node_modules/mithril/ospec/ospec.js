"use strict"
;(function(m) {
if (typeof module !== "undefined") module["exports"] = m()
else window.o = m()
})(function init(name) {
	var spec = {}, subjects = [], results, only = [], ctx = spec, start, stack = 0, nextTickish, hasProcess = typeof process === "object", hasOwn = ({}).hasOwnProperty
	var ospecFileName = getStackName(ensureStackTrace(new Error), /[\/\\](.*?):\d+:\d+/), timeoutStackName
	var globalTimeout = noTimeoutRightNow
	var currentTestError = null
	if (name != null) spec[name] = ctx = {}

	try {throw new Error} catch (e) {
		var ospecFileName = e.stack && (/[\/\\](.*?):\d+:\d+/).test(e.stack) ? e.stack.match(/[\/\\](.*?):\d+:\d+/)[1] : null
	}
	function o(subject, predicate) {
		if (predicate === undefined) {
			if (!isRunning()) throw new Error("Assertions should not occur outside test definitions")
			return new Assert(subject)
		} else {
			if (isRunning()) throw new Error("Test definitions and hooks shouldn't be nested. To group tests use `o.spec()`")
			subject = String(subject)
			if (subject.charCodeAt(0) === 1) throw new Error("test names starting with '\\x01' are reserved for internal use")
			ctx[unique(subject)] = new Task(predicate, ensureStackTrace(new Error))
		}
	}
	o.before = hook("\x01before")
	o.after = hook("\x01after")
	o.beforeEach = hook("\x01beforeEach")
	o.afterEach = hook("\x01afterEach")
	o.specTimeout = function (t) {
		if (isRunning()) throw new Error("o.specTimeout() can only be called before o.run()")
		if (hasOwn.call(ctx, "\x01specTimeout")) throw new Error("A default timeout has already been defined in this context")
		if (typeof t !== "number") throw new Error("o.specTimeout() expects a number as argument")
		ctx["\x01specTimeout"] = t
	}
	o.new = init
	o.spec = function(subject, predicate) {
		var parent = ctx
		ctx = ctx[unique(subject)] = {}
		predicate()
		ctx = parent
	}
	o.only = function(subject, predicate, silent) {
		if (!silent) console.log(
			highlight("/!\\ WARNING /!\\ o.only() mode") + "\n" + o.cleanStackTrace(ensureStackTrace(new Error)) + "\n",
			cStyle("red"), ""
		)
		only.push(predicate)
		o(subject, predicate)
	}
	o.spy = function(fn) {
		var spy = function() {
			spy.this = this
			spy.args = [].slice.call(arguments)
			spy.calls.push({this: this, args: spy.args})
			spy.callCount++

			if (fn) return fn.apply(this, arguments)
		}
		if (fn)
			Object.defineProperties(spy, {
				length: {value: fn.length},
				name: {value: fn.name}
			})
		spy.args = []
		spy.calls = []
		spy.callCount = 0
		return spy
	}
	o.cleanStackTrace = function(error) {
		// For IE 10+ in quirks mode, and IE 9- in any mode, errors don't have a stack
		if (error.stack == null) return ""
		var i = 0, header = error.message ? error.name + ": " + error.message : error.name, stack
		// some environments add the name and message to the stack trace
		if (error.stack.indexOf(header) === 0) {
			stack = error.stack.slice(header.length).split(/\r?\n/)
			stack.shift() // drop the initial empty string
		} else {
			stack = error.stack.split(/\r?\n/)
		}
		if (ospecFileName == null) return stack.join("\n")
		// skip ospec-related entries on the stack
		while (stack[i] != null && stack[i].indexOf(ospecFileName) !== -1) i++
		// now we're in user code (or past the stack end)
		return stack[i]
	}
	o.timeout = function(n) {
		globalTimeout(n)
	}
	o.run = function(reporter) {
		results = []
		start = new Date
		test(spec, [], [], new Task(function() {
			setTimeout(function () {
				timeoutStackName = getStackName({stack: o.cleanStackTrace(ensureStackTrace(new Error))}, /([\w \.]+?:\d+:\d+)/)
				if (typeof reporter === "function") reporter(results)
				else {
					var errCount = o.report(results)
					if (hasProcess && errCount !== 0) process.exit(1) // eslint-disable-line no-process-exit
				}
			})
		}, null), 200 /*default timeout delay*/)

		function test(spec, pre, post, finalize, defaultDelay) {
			if (hasOwn.call(spec, "\x01specTimeout")) defaultDelay = spec["\x01specTimeout"]
			pre = [].concat(pre, spec["\x01beforeEach"] || [])
			post = [].concat(spec["\x01afterEach"] || [], post)
			series([].concat(spec["\x01before"] || [], Object.keys(spec).reduce(function(tasks, key) {
				if (key.charCodeAt(0) !== 1 && (only.length === 0 || only.indexOf(spec[key].fn) !== -1 || !(spec[key] instanceof Task))) {
					tasks.push(new Task(function(done) {
						o.timeout(Infinity)
						subjects.push(key)
						var pop = new Task(function pop() {subjects.pop(), done()}, null)
						if (spec[key] instanceof Task) series([].concat(pre, spec[key], post, pop), defaultDelay)
						else test(spec[key], pre, post, pop, defaultDelay)
					}, null))
				}
				return tasks
			}, []), spec["\x01after"] || [], finalize), defaultDelay)
		}

		function series(tasks, defaultDelay) {
			var cursor = 0
			next()

			function next() {
				if (cursor === tasks.length) return

				var task = tasks[cursor++]
				var fn = task.fn
				currentTestError = task.err
				var timeout = 0, delay = defaultDelay, s = new Date
				var current = cursor
				var arg

				globalTimeout = setDelay

				var isDone = false
				// public API, may only be called once from use code (or after returned Promise resolution)
				function done(err) {
					if (!isDone) isDone = true
					else throw new Error("`" + arg + "()` should only be called once")
					if (timeout === undefined) console.warn("# elapsed: " + Math.round(new Date - s) + "ms, expected under " + delay + "ms\n" + o.cleanStackTrace(task.err))
					finalizeAsync(err)
				}
				// for internal use only
				function finalizeAsync(err) {
					if (err == null) {
						if (task.err != null) succeed(new Assert)
					} else {
						if (err instanceof Error) fail(new Assert, err.message, err)
						else fail(new Assert, String(err), null)
					}
					if (timeout !== undefined) timeout = clearTimeout(timeout)
					if (current === cursor) next()
				}
				function startTimer() {
					timeout = setTimeout(function() {
						timeout = undefined
						finalizeAsync("async test timed out after " + delay + "ms")
					}, Math.min(delay, 2147483647))
				}
				function setDelay (t) {
					if (typeof t !== "number") throw new Error("timeout() and o.timeout() expect a number as argument")
					delay = t
				}
				if (fn.length > 0) {
					var body = fn.toString()
					arg = (body.match(/^(.+?)(?:\s|\/\*[\s\S]*?\*\/|\/\/.*?\n)*=>/) || body.match(/\((?:\s|\/\*[\s\S]*?\*\/|\/\/.*?\n)*(.+?)(?:\s|\/\*[\s\S]*?\*\/|\/\/.*?\n)*[,\)]/) || []).pop()
					if (body.indexOf(arg) === body.lastIndexOf(arg)) {
						var e = new Error
						e.stack = "`" + arg + "()` should be called at least once\n" + o.cleanStackTrace(task.err)
						throw e
					}
					try {
						fn(done, setDelay)
					}
					catch (e) {
						if (task.err != null) finalizeAsync(e)
						// The errors of internal tasks (which don't have an Err) are ospec bugs and must be rethrown.
						else throw e
					}
					if (timeout === 0) {
						startTimer()
					}
				} else {
					try{
						var p = fn()
						if (p && p.then) {
							startTimer()
							p.then(function() { done() }, done)
						} else {
							nextTickish(next)
						}
					} catch (e) {
						if (task.err != null) finalizeAsync(e)
						// The errors of internal tasks (which don't have an Err) are ospec bugs and must be rethrown.
						else throw e
					}
				}
				globalTimeout = noTimeoutRightNow
			}
		}
	}
	function unique(subject) {
		if (hasOwn.call(ctx, subject)) {
			console.warn("A test or a spec named `" + subject + "` was already defined")
			while (hasOwn.call(ctx, subject)) subject += "*"
		}
		return subject
	}
	function hook(name) {
		return function(predicate) {
			if (ctx[name]) throw new Error("This hook should be defined outside of a loop or inside a nested test group:\n" + predicate)
			ctx[name] = new Task(predicate, ensureStackTrace(new Error))
		}
	}

	define("equals", "should equal", function(a, b) {return a === b})
	define("notEquals", "should not equal", function(a, b) {return a !== b})
	define("deepEquals", "should deep equal", deepEqual)
	define("notDeepEquals", "should not deep equal", function(a, b) {return !deepEqual(a, b)})
	define("throws", "should throw a", throws)
	define("notThrows", "should not throw a", function(a, b) {return !throws(a, b)})

	function isArguments(a) {
		if ("callee" in a) {
			for (var i in a) if (i === "callee") return false
			return true
		}
	}
	function deepEqual(a, b) {
		if (a === b) return true
		if (a === null ^ b === null || a === undefined ^ b === undefined) return false // eslint-disable-line no-bitwise
		if (typeof a === "object" && typeof b === "object") {
			var aIsArgs = isArguments(a), bIsArgs = isArguments(b)
			if (a.constructor === Object && b.constructor === Object && !aIsArgs && !bIsArgs) {
				for (var i in a) {
					if ((!(i in b)) || !deepEqual(a[i], b[i])) return false
				}
				for (var i in b) {
					if (!(i in a)) return false
				}
				return true
			}
			if (a.length === b.length && (a instanceof Array && b instanceof Array || aIsArgs && bIsArgs)) {
				var aKeys = Object.getOwnPropertyNames(a), bKeys = Object.getOwnPropertyNames(b)
				if (aKeys.length !== bKeys.length) return false
				for (var i = 0; i < aKeys.length; i++) {
					if (!hasOwn.call(b, aKeys[i]) || !deepEqual(a[aKeys[i]], b[aKeys[i]])) return false
				}
				return true
			}
			if (a instanceof Date && b instanceof Date) return a.getTime() === b.getTime()
			if (typeof Buffer === "function" && a instanceof Buffer && b instanceof Buffer) {
				for (var i = 0; i < a.length; i++) {
					if (a[i] !== b[i]) return false
				}
				return true
			}
			if (a.valueOf() === b.valueOf()) return true
		}
		return false
	}
	function throws(a, b){
		try{
			a()
		}catch(e){
			if(typeof b === "string"){
				return (e.message === b)
			}else{
				return (e instanceof b)
			}
		}
		return false
	}

	function isRunning() {return results != null}
	function Assert(value) {
		this.value = value
		this.i = results.length
		results.push({pass: null, context: "", message: "Incomplete assertion in the test definition starting at...", error: currentTestError, testError: currentTestError})
	}
	function Task(fn, err) {
		this.fn = fn
		this.err = err
	}
	function define(name, verb, compare) {
		Assert.prototype[name] = function assert(value) {
			var self = this
			var message = serialize(self.value) + "\n  " + verb + "\n" + serialize(value)
			if (compare(self.value, value)) succeed(self, message)
			else fail(self, message)
			return function(message) {
				if (!self.pass) self.message = message + "\n\n" + self.message
			}
		}
	}
	function succeed(assertion, message) {
		results[assertion.i].pass = true
		results[assertion.i].context = subjects.join(" > ")
		results[assertion.i].message = message
	}
	function fail(assertion, message, error) {
		results[assertion.i].pass = false
		results[assertion.i].context = subjects.join(" > ")
		results[assertion.i].message = message
		results[assertion.i].error = error != null ? error : ensureStackTrace(new Error)
	}
	function serialize(value) {
		if (hasProcess) return require("util").inspect(value) // eslint-disable-line global-require
		if (value === null || (typeof value === "object" && !(value instanceof Array)) || typeof value === "number") return String(value)
		else if (typeof value === "function") return value.name || "<anonymous function>"
		try {return JSON.stringify(value)} catch (e) {return String(value)}
	}
	function noTimeoutRightNow() {
		throw new Error("o.timeout must be called snchronously from within a test definition or a hook")
	}
	var colorCodes = {
		red: "31m",
		red2: "31;1m",
		green: "32;1m"
	}
	function highlight(message, color) {
		var code = colorCodes[color] || colorCodes.red;
		return hasProcess ? (process.stdout.isTTY ? "\x1b[" + code + message + "\x1b[0m" : message) : "%c" + message + "%c "
	}
	function cStyle(color, bold) {
		return hasProcess||!color ? "" : "color:"+color+(bold ? ";font-weight:bold" : "")
	}
	function ensureStackTrace(error) {
		// mandatory to get a stack in IE 10 and 11 (and maybe other envs?)
		if (error.stack === undefined) try { throw error } catch(e) {return e}
		else return error
	}
	function getStackName(e, exp) {
		return e.stack && exp.test(e.stack) ? e.stack.match(exp)[1] : null
	}

	o.report = function (results) {
		var errCount = 0
		for (var i = 0, r; r = results[i]; i++) {
			if (r.pass == null) {
				r.testError.stack = r.message + "\n" + o.cleanStackTrace(r.testError)
				r.testError.message = r.message
				throw r.testError
			}
			if (!r.pass) {
				var stackTrace = o.cleanStackTrace(r.error)
				var couldHaveABetterStackTrace = !stackTrace || timeoutStackName != null && stackTrace.indexOf(timeoutStackName) !== -1
				if (couldHaveABetterStackTrace) stackTrace = r.testError != null ? o.cleanStackTrace(r.testError) : r.error.stack || ""
				console.error(
					(hasProcess ? "\n" : "") +
					highlight(r.context + ":", "red2") + "\n" +
					highlight(r.message, "red") +
					(stackTrace ? "\n" + stackTrace + "\n" : ""),

					cStyle("black", true), "", // reset to default
					cStyle("red"), cStyle("black")
				)
				errCount++
			}
		}
		var pl = results.length === 1 ? "" : "s"
		var resultSummary = (errCount === 0) ?
			highlight((pl ? "All " : "The ") + results.length + " assertion" + pl + " passed", "green"):
			highlight(errCount + " out of " + results.length + " assertion" + pl + " failed", "red2")
		var runningTime = " in " + Math.round(Date.now() - start) + "ms"

		console.log(
			(hasProcess ? "––––––\n" : "") +
			(name ? name + ": " : "") + resultSummary + runningTime,
			cStyle((errCount === 0 ? "green" : "red"), true), ""
		)
		return errCount
	}

	if (hasProcess) {
		nextTickish = process.nextTick
	} else {
		nextTickish = function fakeFastNextTick(next) {
			if (stack++ < 5000) next()
			else setTimeout(next, stack = 0)
		}
	}

	return o
})
