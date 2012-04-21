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

    var Flow = function(context) {
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

                /**
                 * @param err
                 * @param data
                 * @param end
                 */
                var thisArg = function (err, data, end) {
                    if (!err && name) {
                        // save result to var
                        self.$context.vars[name] = data;
                    }

                    cb(err, end);
                };
                thisArg.vars = self.$context.vars;

                if (fn.length) {
                    // end for async case
                    thisArg.end = function (err, data) {
                        // end
                        thisArg(err, data, true);
                    };

                    fn.call(thisArg, thisArg);
                } else {
                    // sync
                    thisArg.end = function() {
                        sync_end = true;
                    };

                    try {
                        thisArg(null, fn.call(thisArg), sync_end);
                    } catch (e) {
                        thisArg(e, null, sync_end);
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

            var thisArg = function (err, data, end) {

                if (!err && name) {
                    // save result to tmp. var
                    results[name] = data;
                }

                parallelFinishedCallback(parallelInstance, err, end);
            };

            thisArg.vars = context.vars;

            if (fn.length) {
                // async
                thisArg.end = function (err, data) {
                    // end
                    thisArg(err, data, true);
                };

                fn.call(thisArg, thisArg);
            } else {
                // sync
                thisArg.end = function () {
                    sync_end = true;
                };

                try {
                    thisArg(null, fn.call(thisArg), sync_end);
                } catch (e) {
                    thisArg(e, null, sync_end);
                }
            }
        };
    };

    /**
     * Executes the given functions parallel
     *
     * @param {Object, Array} fns
     *  {Object} fns - keys will be variable name for returned value
     */
    Flow.prototype.par = function (fns) {

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

    Flow.prototype.exec = function (cb) {
        var self = this;

        var callback = function(err, data) {
            if (cb) {
                cb(err, data);
            }
        };

        function execNext(index) {
            if (index < self.$context.actions.length) {
                // execute action
                self.$context.actions[index](function(err, end) {
                    if (err || end) {
                        callback(err, self.$context.vars);
                    } else {
                        execNext(index+1);
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