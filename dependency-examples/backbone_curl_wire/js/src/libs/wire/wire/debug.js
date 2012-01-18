/**
 * @license Copyright (c) 2010-2011 Brian Cavalier
 * LICENSE: see the LICENSE.txt file. If file is missing, this file is subject
 * to the MIT License at: http://www.opensource.org/licenses/mit-license.php.
 */

/**
 * debug.js
 * wire plugin that logs timing and debug information about wiring context and object
 * lifecycle events (e.g. creation, properties set, initialized, etc.).
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
(function(global) {
define(['aop'], function(aop) {
    var timer, defaultTimeout, console, logStack, createTracer;

    function noop() {}

    // Fake console to prevent IE breakage
    console = global['console'] || { log:noop, error:noop, trace:noop };

    // TODO: Consider using stacktrace.js
    // https://github.com/eriwen/javascript-stacktrace
    // For now, quick and dirty, based on how stacktrace.js chooses the appropriate field
    // If console.trace exists, use it, otherwise use console.error
    logStack = typeof console.trace == 'function'
        ? function (e) { console.trace(e); }
        : function (e) { console.error(e.stack || e.stacktrace || e.message || e); };

    timer = createTimer();
    defaultTimeout = 5000; // 5 second wiring failure timeout

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
        if (!filter) return defaultFilter;

        var rx = filter.test ? filter : new RegExp(filter);

        return function (path) {
            return rx.test(path);
        }

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

        /**
         * Creates an aspect to be applied to components that are being traced
         * @param path {String} component path
         */
        function createTraceAspect(path) {
            return {
                around:function (joinpoint) {
                    var val, tag, context, start, indent;

                    tag = ' RETURN (';

                    // Setup current indent level
                    indent = padding.substr(0, depth);
                    // Form full path to invoked method
                    context = indent + 'DEBUG: ' + path + '.' + joinpoint.method;

                    // Increase the depth before proceeding so that nested traces will be indented
                    ++depth;

                    console.log(context, joinpoint.args);

                    try {
                        start = new Date();
                        val = joinpoint.proceed();

                        // return result
                        return val;

                    } catch (e) {

                        // rethrow
                        val = e;
                        tag = ' THROW (';
                        throw e;

                    } finally {
                        console.log(context + tag + (new Date().getTime() - start.getTime()) + 'ms) ', val);

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

            /**
             * Trace pointcut query function that filters out wire plugins
             * @param target {Object} target object to query for methods to advise
             */
            function pointcut(target) {
                var matches = [];

                for (var p in target) {
                    // Only match functions, exclude wire plugins, and then apply
                    // the supplied tracePointcut regexp
                    if (typeof target[p] === 'function' && p !== 'wire$plugin' && tracePointcut.test(p)) {
                        matches.push(p);
                    }
                }

                return matches;
            }

            traceAspects = [];
            trace = function (path, target) {
                if (traceFilter(path)) {
                    // Create the aspect, if the path matched
                    traceAspects.push(aop.add(target, pointcut, createTraceAspect(path)));
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
        }

    })();

    return {
        wire$plugin:function debugPlugin(ready, destroyed, options) {
            var contextTimer, timeout, paths, logCreated, checkPathsTimeout,
                verbose, filter, plugin, tracer;

            verbose = options.verbose;
            contextTimer = createTimer();

            tracer = { trace: noop, untrace: noop };

            filter = createPathFilter(options.filter);

            function contextTime(msg) {
                return time(msg, contextTimer);
            }

            console.log(contextTime("Context init"));

            ready.then(
                function onContextReady(context) {
                    cancelPathsTimeout();
                    console.log(contextTime("Context ready"), context);
                },
                function onContextError(err) {
                    cancelPathsTimeout();
                    console.error(contextTime("Context ERROR: "), err);
                    logStack(err);
                }
            );

            destroyed.then(
                function onContextDestroyed() {
                    tracer.untrace();
                    console.log(contextTime("Context destroyed"));
                },
                function onContextDestroyError(err) {
                    tracer.untrace();
                    console.error(contextTime("Context destroy ERROR"), err);
                    logStack(err);
                }
            );

            function makeListener(step, verbose) {
                return function (promise, proxy /*, wire */) {
                    var path = proxy.path;

                    if (step === 'destroyed') {
                        // stop tracking destroyed components, since we don't
                        // care anymore
                        delete paths[path];

                    } else if (path) {
                        paths[path].status = step;

                    }

                    if (verbose && filter(path)) {
                        var message = time(step + ' ' + (path || proxy.id || ''), contextTimer);
                        if (proxy.target) {
                            console.log(message, proxy.target, proxy.spec);
                        } else {
                            console.log(message, proxy);
                        }
                    }

                    promise.resolve();
                }
            }

            paths = {};
            timeout = options.timeout || defaultTimeout;
            logCreated = makeListener('created', verbose);

            function cancelPathsTimeout() {
                clearTimeout(checkPathsTimeout);
                checkPathsTimeout = null;
            }

            function checkPaths() {
                if (!checkPathsTimeout) return;

                var p, path;

                for (p in paths) {
                    path = paths[p];
                    if (path.status !== 'ready') {
                        console.error("WIRING FAILED at " + path.status, p, path.spec);
                    }
                }
            }

            checkPathsTimeout = setTimeout(checkPaths, timeout);

            plugin = {
                create:function (promise, proxy) {
                    var path = proxy.path;

                    if (path) {
                        paths[path] = {
                            spec:proxy.spec
                        };
                    }
                    logCreated(promise, proxy);
                },
                configure:  makeListener('configured', verbose),
                initialize: makeListener('initialized', verbose),
                ready:      makeListener('ready', true),
                destroy:    makeListener('destroyed', true)
            };

            if (options.trace) {
                tracer = createTracer(options, plugin, filter);
            }

            return plugin;
        }
    };

});
})(this);
