/** @license MIT License (c) copyright B Cavalier & J Hann */

/*jshint sub:true*/
/*global Node:true*/

/**
 * debug
 * wire plugin that logs timing and debug information about wiring context and object
 * lifecycle events (e.g. creation, properties set, initialized, etc.).
 *
 * wire is part of the cujo.js family of libraries (http://cujojs.com/)
 *
 * Licensed under the MIT License at:
 * http://www.opensource.org/licenses/mit-license.php
 *
 * Usage:
 * {
 *     module: 'wire/debug',
 *
 *     // verbose (Optional)
 *     // If set to true, even more (a LOT) info will be output.
 *     // Default is false if not specified.
 *     verbose: false,
 *
 *     // timeout (Optional)
 *     // Milliseconds to wait for wiring to finish before reporting
 *     // failed components.  There may be failures caused by 3rd party
 *     // wire plugins and components that wire.js cannot detect.  This
 *     // provides a last ditch way to try to report those failures.
 *     // Default is 5000ms (5 seconds)
 *     timeout: 5000,
 *
 *     // filter (Optional)
 *     // String or RegExp to match against a component's name.  Only
 *     // components whose path matches will be reported in the debug
 *     // diagnostic output.
 *     // All components will still be tracked for failures.
 *     // This can be useful in reducing the amount of diagnostic output and
 *     // focusing it on specific components.
 *     // Defaults to matching all components
 *     // Examples:
 *     //   filter: ".*View"
 *     //   filter: /.*View/
 *     //   filter: "[fF]oo[bB]ar"
 *     filter: ".*"
 *
 *     // trace (Optional)
 *     // Enables application component tracing that will log information about component
 *     // method calls while your application runs.  This provides a powerful way to watch
 *     // and debug your application as it runs.
 *     // To enable full tracing, which is a LOT of information:
 *     trace: true
 *     // Or, specify options to enable more focused tracing:
 *     trace: {
 *          // filter (Optional)
 *          // Similar to above, can be string pattern or RegExp
 *          // If not specified, the general debug filter is used (see above)
 *          filter: ".*View",
 *
 *          // pointcut (Optional)
 *          // Matches *method names*.  Can be used with or without specifying filter
 *          // When filter is not specified, this will match methods across all components.
 *          // For example, if all your components name their event emitters "on<Event>", e.g. "onClick"
 *          // you could trace all your event emitters:
 *          // Default: "^[^_]" (all methods not starting with '_')
 *          pointcut: "on.*",
 *
 *          // step (Optional)
 *          // At what step in the wiring process should tracing start.  This can be helpful
 *          // if you need to trace a component during wiring.
 *          // Values: 'create', 'configure', 'initialize', 'ready', 'destroy'
 *          // NOTE: This defines when tracing *begins*.  For example, if this is set to
 *          // 'configure' (the default), anything that happens to components during and
 *          // after the configure step, until that component is destroyed, will be traced.
 *          // Default: 'configure'
 *          step: 'configure'
 *     }
 * }
 */
(function(global, define) {
define(['meld'], function(meld) {
	var timer, defaultTimeout, logger, createTracer, ownProp;

	function noop() {}

	ownProp = Object.prototype.hasOwnProperty.call.bind(Object.prototype.hasOwnProperty);

	// Setup console for node, sane browsers, or IE
	logger = typeof console != 'undefined'
		? console
		: global['console'] || { log:noop, error:noop };

	// TODO: Consider using stacktrace.js
	// https://github.com/eriwen/javascript-stacktrace
	// For now, quick and dirty, based on how stacktrace.js chooses the appropriate field
	// and log using console.error
	function logStack(e) {
		var stack = e.stack || e.stacktrace;
		if(!stack) {
			// If e.sourceURL and e.line are available, this is probably Safari, so
			// we can build a clickable source:line
			// Fallback to message if available
			// If all else fails, just use e itself
			stack = e.sourceURL && e.line
				? e.sourceURL + ':' + e.line
				: e.message || e;
		}

		logger.error(stack);
	}

	timer = createTimer();

	// If we don't see any wiring progress in this amount of time
	// since the last time we saw something happen, then we'll log
	// an error.
	defaultTimeout = 5000;

	/**
	 * Builds a string with timing info and a message for debug output
	 *
	 * @param text {String} message
	 * @param contextTimer per-context timer information
	 *
	 * @returns A formatted string for output
	 */
	function time(text, contextTimer) {
		var all, timing;

		all = timer();
		timing = "(total: " +
				 (contextTimer
					 ? all.total + "ms, context: " + contextTimer()
					 : all)
			+ "): ";

		return "DEBUG " + timing + text;
	}

	/**
	 * Creates a timer function that, when called, returns an object containing
	 * the total elapsed time since the timer was created, and the split time
	 * since the last time the timer was called.  All times in milliseconds
	 *
	 * @returns timer
	 */
	function createTimer() {
		var start, split;

		start = new Date().getTime();
		split = start;

		/**
		 * Returns the total elapsed time since this timer was created, and the
		 * split time since this getTime was last called.
		 *
		 * @returns Object containing total and split times in milliseconds, plus a
		 * toString() function that is useful in logging the time.
		 */
		return function getTime() {
			var now, total, splitTime;

			now = new Date().getTime();
			total = now - start;
			splitTime = now - split;
			split = now;

			return {
				total:total,
				split:splitTime,
				toString:function () {
					return '' + splitTime + 'ms / ' + total + 'ms';
				}
			};
		};
	}

	function defaultFilter(path) {
		return !!path;
	}

	function createPathFilter(filter) {
		if (!filter) {
			return defaultFilter;
		}

		var rx = filter.test ? filter : new RegExp(filter);

		return function (path) {
			return rx.test(path);
		};

	}

	/**
	 * Returns true if it is a Node
	 * Adapted from: http://stackoverflow.com/questions/384286/javascript-isdom-how-do-you-check-if-a-javascript-object-is-a-dom-object
	 * @param it anything
	 * @return true iff it is a Node
	 */
	function isNode(it) {
		return typeof Node === "object"
			? it instanceof Node
			: it && typeof it === "object" && typeof it.nodeType === "number" && typeof it.nodeName==="string";
	}

	function isObject(it) {
		// In IE7 tos.call(null) is '[object Object]'
		// so we need to check to see if 'it' is
		// even set
		return it && Object.prototype.toString.call(it) == '[object Object]';
	}

	/**
	 * Function that applies tracing AOP to components being wired
	 * @function
	 * @param options {Object} tracing options
	 * @param plugin {Object} debug plugin instance to which to add tracing functionality
	 */
	createTracer = (function() {
		var depth, padding, defaultStep, defaultPointcut;

		/** Current trace depth */
		depth = 0;

		/** Padding character for indenting traces */
		padding =  '.';

		/** 2^8 padding = 128 */
		for(var i=0; i<8; i++) {
			padding += padding;
		}

		/** Default lifecycle step at which to begin tracing */
		defaultStep = 'configure';

		/** Default pointcut query to match methods that will be traced */
		defaultPointcut = /^[^_]/;

		function logAfter(context, tag, start, val) {
			console.log(context + tag + (new Date().getTime() - start.getTime()) + 'ms): ', val);
		}

		/**
		 * Creates an aspect to be applied to components that are being traced
		 * @param path {String} component path
		 */
		function createTraceAspect(path) {
			return {
				around:function (joinpoint) {
					var val, context, start, indent;

					// Setup current indent level
					indent = padding.substr(0, depth);
					// Form full path to invoked method
					context = indent + 'DEBUG: ' + path + '.' + joinpoint.method;

					// Increase the depth before proceeding so that nested traces will be indented
					++depth;

					logger.log(context, joinpoint.args);

					try {
						start = new Date();
						val = joinpoint.proceed();

						logAfter(context, ' RETURN (', start, val);

						// return result
						return val;

					} catch (e) {

						// rethrow
						logAfter(context, ' THROW (', start, e ? e.toString() : e);

						throw e;

					} finally {
						// And now decrease the depth after
						--depth;
					}
				}
			};
		}

		/**
		 * Implementation of createTracer
		 */
		return function(options, plugin, filter) {
			var trace, untrace, traceStep, traceFilter, tracePointcut, traceAspects;

			traceFilter = options.trace.filter ? createPathFilter(options.trace.filter) : filter;
			tracePointcut = options.trace.pointcut || defaultPointcut;
			traceStep = options.trace.step || defaultStep;

			function isTraceable(target, prop) {
				return isObject(target) && typeof target[prop] === 'function'
					&& prop !== 'wire$plugin'
					&& tracePointcut.test(prop);
			}

			/**
			 * Trace pointcut query function that filters out wire plugins
			 * @param target {Object} target object to query for methods to advise
			 */
			function pointcut(target) {
				var matches = [];

				if(isNode(target)) {
					return matches;
				}

				for (var p in target) {
					// Only match functions, exclude wire plugins, and then apply
					// the supplied tracePointcut regexp
					if (isTraceable(target, p)) {
						matches.push(p);
					}
				}

				return matches;
			}

			traceAspects = [];
			trace = function (path, target) {
				if (traceFilter(path)) {
					// Create the aspect, if the path matched
					traceAspects.push(meld.add(target, pointcut, createTraceAspect(path)));
				}
				// trace intentionally does not resolve the promise
				// trace relies on the existing plugin method to resolve it
			};

			untrace = function () {
				for (var i = traceAspects.length-1; i >= 0; --i) {
					traceAspects[i].remove();
				}
			};

			// Defend against changes to the plugin in future revs
			var orig = plugin[traceStep] || function (promise) { promise.resolve(); };

			// Replace the plugin listener method with one that will call trace()
			// and add traceAspect
			plugin[traceStep] = function (promise, proxy, wire) {
				trace(proxy.path, proxy.target);
				orig(promise, proxy, wire);
			};

			return { trace: trace, untrace: untrace };
		};

	})();

	function logSeparator() {
		logger.log('---------------------------------------------------');
	}

	return function wireDebug(options) {

		var contextTimer, timeout, paths, count, tag,
			logCreated, logDestroyed, checkPathsTimeout,
			verbose, filter, plugin, context, tracer;

		verbose = options.verbose;
		contextTimer = createTimer();

		count = 0;
		tag = "WIRING";

		tracer = { trace: noop, untrace: noop };

		filter = createPathFilter(options.filter);

		function contextTime(msg) {
			return time(msg, contextTimer);
		}

		logger.log(contextTime("Context debug"));

		context = {
			initialize: function(resolver) {
				logger.log(contextTime("Context init"));
				resolver.resolve();
			},
			ready: function(resolver) {
				cancelPathsTimeout();
				logger.log(contextTime("Context ready"));
				resolver.resolve();
			},
			destroy: function(resolver) {
				tracer.untrace();
				logger.log(contextTime("Context destroyed"));
				resolver.resolve();
			},
			error: function(resolver, api, err) {
				cancelPathsTimeout();
				console.error(contextTime("Context ERROR: ") + err, err);
				logStack(err);
				resolver.reject(err);
			}
		};

		function makeListener(step, verbose) {
			return function (promise, proxy /*, wire */) {
				cancelPathsTimeout();

				var path = proxy.path;

				if (paths[path]) {
					paths[path].status = step;
				}

				if (verbose && filter(path)) {
					var message = time(step + ' ' + (path || proxy.id || ''), contextTimer);
					if (proxy.target) {
						logger.log(message, proxy.target, proxy.metadata);
					} else {
						logger.log(message, proxy);
					}
				}

				if(count) {
					checkPathsTimeout = setTimeout(checkPaths, timeout);
				}

				promise.resolve();
			};
		}

		paths = {};
		timeout = options.timeout || defaultTimeout;
		logCreated = makeListener('created', verbose);
		logDestroyed = makeListener('destroyed', true);

		function cancelPathsTimeout() {
			clearTimeout(checkPathsTimeout);
			checkPathsTimeout = null;
		}

		function checkPaths() {
			if (!checkPathsTimeout) {
				return;
			}

			var p, component, msg, ready, notReady;

			logSeparator();
			if(count) {
				ready = [];
				notReady = [];
				logger.error(tag + ': No progress in ' + timeout + 'ms, status:');

				for (p in paths) {
					component = paths[p];
					msg = p + ': ' + component.status;

					(component.status == 'ready' ? ready : notReady).push(
						{ msg: msg, metadata: component.metadata }
					);
				}

				if(notReady.length > 0) {
					logSeparator();
					logger.log('Components that DID NOT finish wiring');
					for(p = notReady.length-1; p >= 0; --p) {
						component = notReady[p];
						logger.error(component.msg, component.metadata);
					}
				}

				if(ready.length > 0) {
					logSeparator();
					logger.log('Components that finished wiring');
					for(p = ready.length-1; p >= 0; --p) {
						component = ready[p];
						logger.log(component.msg, component.metadata);
					}
				}
			} else {
				logger.error(tag + ': No components created after ' + timeout + 'ms');
			}

			logSeparator();
		}

		/**
		 * Adds a named constructor function property to the supplied component
		 * so that the name shows up in debug inspectors.  Squelches all errors.
		 */
		function makeConstructor(name, component) {
			/*jshint evil:true*/
			var ctor;
			try {
				// Generate a named function to use as the constructor
				name = name.replace(/^[^a-zA-Z$_]|[^a-zA-Z0-9$_]+/g, '_');
				eval('ctor = function ' + name + ' () {}');

				// Be friendly and make configurable and writable just in case
				// some other library or application code tries to set constructor.
				Object.defineProperty(component, 'constructor', {
					configurable: true,
					writable: true,
					value: ctor
				});

			} catch(e) {
				// Oh well, ignore.
			}
		}

		plugin = {
			context: context,
			create:function (promise, proxy) {
				var path, component;

				path = proxy.path;
				component = proxy.target;

				count++;
				paths[path || ('(unnamed-' + count + ')')] = {
					metadata: proxy.metadata
				};

				if(component && typeof component == 'object'
					&& !ownProp(component, 'constructor')) {
					makeConstructor(proxy.id, component);
				}

				logCreated(promise, proxy);
			},
			configure:  makeListener('configured', verbose),
			initialize: makeListener('initialized', verbose),
			ready:      makeListener('ready', true),
			destroy:    function(promise, proxy) {
				// stop tracking destroyed components, since we don't
				// care anymore
				delete paths[proxy.path];
				count--;
				tag = "DESTROY";

				logDestroyed(promise, proxy);
			}
		};

		if (options.trace) {
			tracer = createTracer(options, plugin, filter);
		}

		checkPathsTimeout = setTimeout(checkPaths, timeout);

		return plugin;
	};

});
})(this, typeof define == 'function'
	// use define for AMD if available
	? define
	: function(deps, factory) {
		module.exports = factory.apply(this, deps.map(function(x) {
			return require(x);
		}));
	}
);
