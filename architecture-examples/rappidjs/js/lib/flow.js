/*!
 * flow.js JavaScript Library v0.1.0
 * https://github.com/it-ony/flow.js
 *
 * Copyright 2012, Tony Findeisen
 * Licensed under the MIT license.
 * https://raw.github.com/it-ony/flow.js/master/LICENSE
 *
 * Date: Mon Mar 12 2012 12:36:34 GMT+0100 (CET)
 */
(function (exports) {
    "use strict";

    var Flow = function (context) {
        this.$context = context || {
            error: null,
            actions: [],
            vars: {}
        };
    };

    var flow = function () {
        return new Flow();
    };

    /**
     *
     * @param {String} [name] variable name
     * @param {Function} fn function to execute
     *      fn - function() {}      // syncron
     *      fn - function(cb) {}    // asyncron
     */
    Flow.prototype.seq = function (name, fn) {
        if (name instanceof Function) {
            fn = name;
            name = null;
        }

        if (!fn) {
            throw "Sequence action not defined";
        }

        var self = this;

        this.$context.actions.push(function (cb) {

                var sync_end = false;

                var setDataAndReturn = function (err, data, end) {
                    if (!err && name) {
                        // save result to var
                        self.$context.vars[name] = data;
                    }

                    cb(err, end);
                };

                /**
                 * @param err
                 * @param data
                 */
                var thisArg = function (err, data) {
                    setDataAndReturn(err, data, false);
                };
                thisArg.vars = self.$context.vars;


                if (fn.length) {
                    // end for async case
                    thisArg.end = function (err, data) {
                        // end
                        setDataAndReturn(err, data, true);
                    };

                    fn.call(thisArg, thisArg);
                } else {
                    // sync
                    thisArg.end = function () {
                        sync_end = true;
                    };

                    try {
                        setDataAndReturn(null, fn.call(thisArg), sync_end);
                    } catch (e) {
                        setDataAndReturn(e, null, sync_end);
                    }
                }
            }
        );

        return this;
    };

    var ParallelAction = function (name, fn) {

        if (!fn) {
            throw "Parallel action not defined";
        }

        return function (parallelInstance, context, results, parallelFinishedCallback) {

            var sync_end = false;

            var setDataAndReturn = function (err, data, end) {
                if (!err && name) {
                    // save result to tmp. var
                    results[name] = data;
                }

                parallelFinishedCallback(parallelInstance, err, end);
            };

            var thisArg = function (err, data) {
                setDataAndReturn(err, data, false);
            };

            thisArg.vars = context.vars;

            if (fn.length) {
                // async
                thisArg.end = function (err, data) {
                    // end
                    setDataAndReturn(err, data, true);
                };

                fn.call(thisArg, thisArg);
            } else {
                // sync
                thisArg.end = function () {
                    sync_end = true;
                };

                try {
                    setDataAndReturn(null, fn.call(thisArg), sync_end);
                } catch (e) {
                    setDataAndReturn(e, null, sync_end);
                }
            }
        };
    };

    /**
     * Executes the given functions parallel
     *
     * @param {Object|Array} fns
     *  {Object} fns - keys will be variable name for returned value
     */
    Flow.prototype.par = function (fns) {

        if (arguments.length > 1) {
            // parallel functions given comma separated without named return
            this.par(Array.prototype.slice.call(arguments));
            return this;
        }

        var self = this, i, key;

        if (fns) {

            var parallelActions = [];

            if (fns instanceof Array) {
                for (i = 0; i < fns.length; i++) {
                    var fn = fns[i];
                    parallelActions.push(new ParallelAction(null, fn));
                }
            } else {
                for (key in fns) {
                    if (fns.hasOwnProperty(key)) {
                        parallelActions.push(new ParallelAction(key, fns[key]));
                    }
                }
            }

            if (parallelActions.length > 0) {
                // we got at least one function executing in parallel

                // push new action
                this.$context.actions.push(function (cb) {

                    (function (parallelActions, cb) {
                        var results = {}, p;

                        var parallelFinished = function (fn, err, end) {
                            var key;

                            if (!cb) {
                                // callback, already called, because end called multiple times
                                return;
                            }

                            if (err || end) {
                                // some error occurred
                                cb(err, end);
                                cb = null;
                            } else {
                                var index = parallelActions.indexOf(fn);
                                if (index >= 0 && index < parallelActions.length) {
                                    // remove parallel executed function from actions
                                    parallelActions.splice(index, 1);
                                } else {
                                    cb("Parallel function returned which wasn't part of this parallel actions");
                                    cb = null;
                                    return;
                                }

                                if (parallelActions.length === 0) {
                                    // copy results to var
                                    for (key in results) {
                                        if (results.hasOwnProperty(key)) {
                                            self.$context.vars[key] = results[key];
                                        }
                                    }

                                    cb(null, false);
                                    cb = null;
                                }
                            }
                        };

                        // copy array of parallel actions, to avoid array is modified by returning of function
                        // before all functions are started

                        var copyParallelActions = parallelActions.slice();

                        // start all functions
                        for (p = 0; p < copyParallelActions.length; p++) {
                            // start parallel action
                            var parallelInstance = copyParallelActions[p];
                            parallelInstance(parallelInstance, self.$context, results, parallelFinished);
                        }
                    }(parallelActions, cb));

                });
            }
        }

        return this;
    };

    /***
     * executes the given function for each value in values
     * @param {Array|Object} values for which fn should be called in parallel,
     *                      if object is passed, keys will be var names
     * @param {Function} fn function which will be executed for each value in values
     *                      function(value, [cb]) - the function will be called with the value as first parameter
     *                      and optional as second parameter with the callback
     */
    Flow.prototype.parEach = function (values, fn) {
        values = values || [];

        if (!(fn instanceof Function)) {
            throw "2nd argument for parEach needs to be a function";
        }

        var noVars = values instanceof Array,
            delegates = noVars ? [] : {};

        function addDelegate(name, value) {
            if (noVars) {
                value = name;
                name = null;
            }

            var parFn;

            if (fn.length >= 2) {
                // async
                parFn = function (cb) {
                    fn(value, cb);
                };
            } else {
                // sync
                parFn = function () {
                    return fn(value);
                };
            }

            if (noVars) {
                delegates.push(parFn);
            } else {
                delegates[name] = parFn;
            }

        }

        if (noVars) {
            for (var i = 0; i < values.length; i++) {
                addDelegate(values[i]);
            }
        } else {
            for (var key in values) {
                if (values.hasOwnProperty(key)) {
                    addDelegate(key, values[key]);
                }
            }
        }

        return this.par(delegates);
    };

    Flow.prototype.exec = function (cb) {
        var self = this;

        var callback = function (err, data) {
            if (cb) {
                cb(err, data);
            }
        };

        function execNext(index) {
            if (index < self.$context.actions.length) {
                // execute action
                self.$context.actions[index](function (err, end) {
                    if (err || end) {
                        callback(err, self.$context.vars);
                    } else {
                        execNext(index + 1);
                    }
                });

            } else {
                // finished
                callback(null, self.$context.vars);
            }
        }

        execNext(0);

    };

    // global on the server, window in the browser
    var previous_flow = exports.flow;

    flow.noConflict = function () {
        exports.flow = previous_flow;
        return flow;
    };

    exports.flow = flow;

}(typeof(exports) === "undefined" ? this : exports));