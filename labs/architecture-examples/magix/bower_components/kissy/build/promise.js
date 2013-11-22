/*
Copyright 2013, KISSY v1.40
MIT Licensed
build time: Nov 13 21:50
*/
/*
 Combined processedModules by KISSY Module Compiler: 

 promise
*/

/**
 * @ignore
 * implement Promise specification by KISSY
 * @author yiminghe@gmail.com
 */
KISSY.add('promise',function (S, undefined) {
    var PROMISE_VALUE = '__promise_value',
        processImmediate = S.setImmediate,
        logger = S.getLogger('s/promise'),
        PROMISE_PROGRESS_LISTENERS = '__promise_progress_listeners',
        PROMISE_PENDINGS = '__promise_pendings';

    function logError(str) {
        if (typeof console !== 'undefined' && console.error) {
            console.error(str);
        }
    }

    /*
     two effects:
     1. call fulfilled with immediate value
     2. push fulfilled in right promise
     */
    function promiseWhen(promise, fulfilled, rejected) {
        // simply call rejected
        if (promise instanceof Reject) {
            // if there is a rejected , should always has! see when()
            processImmediate(function () {
                rejected.call(promise, promise[PROMISE_VALUE]);
            });
        } else {
            var v = promise[PROMISE_VALUE],
                pendings = promise[PROMISE_PENDINGS];

            // unresolved
            // pushed to pending list
            if (pendings) {
                pendings.push([fulfilled, rejected]);
            }
            // rejected or nested promise
            else if (isPromise(v)) {
                promiseWhen(v, fulfilled, rejected);
            } else {
                // fulfilled value
                // normal value represents ok
                // need return user's return value
                // if return promise then forward
                if (fulfilled) {
                    processImmediate(function () {
                        fulfilled.call(promise, v);
                    });
                }
            }
        }
    }

    /**
     * @class KISSY.Defer
     * Defer constructor For KISSY, implement Promise specification.
     */
    function Defer(promise) {
        var self = this;
        if (!(self instanceof Defer)) {
            return new Defer(promise);
        }
        // http://en.wikipedia.org/wiki/Object-capability_model
        // principal of least authority
        /**
         * defer object's promise
         * @type {KISSY.Promise}
         */
        self.promise = promise || new Promise();
        self.promise.defer = self;
    }

    Defer.prototype = {
        constructor: Defer,
        /**
         * fulfill defer object's promise
         * note: can only be called once
         * @param value defer object's value
         * @return {KISSY.Promise} defer object's promise
         */
        resolve: function (value) {
            var promise = this.promise,
                pendings;
            if (!(pendings = promise[PROMISE_PENDINGS])) {
                return null;
            }
            // set current promise 's resolved value
            // maybe a promise or instant value
            promise[PROMISE_VALUE] = value;
            pendings = [].concat(pendings);
            promise[PROMISE_PENDINGS] = undefined;
            promise[PROMISE_PROGRESS_LISTENERS] = undefined;
            S.each(pendings, function (p) {
                promiseWhen(promise, p[0], p[1]);
            });
            return value;
        },
        /**
         * reject defer object's promise
         * @param reason
         * @return {KISSY.Promise} defer object's promise
         */
        reject: function (reason) {
            return this.resolve(new Reject(reason));
        },
        /**
         * notify promise 's progress listeners
         * @param message
         */
        notify: function (message) {
            S.each(this.promise[PROMISE_PROGRESS_LISTENERS], function (listener) {
                processImmediate(function () {
                    listener(message);
                });
            });
        }
    };

    function isPromise(obj) {
        return  obj && obj instanceof Promise;
    }

    /**
     * @class KISSY.Promise
     * Promise constructor.
     * This class should not be instantiated manually.
     * Instances will be created and returned as needed by {@link KISSY.Defer#promise}
     * @param [v] promise 's resolved value
     */
    function Promise(v) {
        var self = this;
        // maybe internal value is also a promise
        self[PROMISE_VALUE] = v;
        if (v === undefined) {
            // unresolved
            self[PROMISE_PENDINGS] = [];
            self[PROMISE_PROGRESS_LISTENERS] = [];
        }
    }

    Promise.prototype = {
        constructor: Promise,

        /**
         * register callbacks when this promise object is resolved
         * @param {Function} fulfilled called when resolved successfully,pass a resolved value to this function and
         * return a value (could be promise object) for the new promise 's resolved value.
         * @param {Function} [rejected] called when error occurs,pass error reason to this function and
         * return a new reason for the new promise 's error reason
         * @param {Function} [progressListener] progress listener
         * @return {KISSY.Promise} a new promise object
         */
        then: function (fulfilled, rejected, progressListener) {
            if (progressListener) {
                this.progress(progressListener);
            }
            return when(this, fulfilled, rejected);
        },
        /**
         * call progress listener when defer.notify is called
         * @param {Function} [progressListener] progress listener
         */
        progress: function (progressListener) {
            if (this[PROMISE_PROGRESS_LISTENERS]) {
                this[PROMISE_PROGRESS_LISTENERS].push(progressListener);
            }
            return this;
        },
        /**
         * call rejected callback when this promise object is rejected
         * @param {Function} rejected called with rejected reason
         * @return {KISSY.Promise} a new promise object
         */
        fail: function (rejected) {
            return when(this, 0, rejected);
        },
        /**
         * call callback when this promise object is rejected or resolved
         * @param {Function} callback the second parameter is
         * true when resolved and false when rejected
         * @@return {KISSY.Promise} a new promise object
         */
        fin: function (callback) {
            return when(this, function (value) {
                return callback(value, true);
            }, function (reason) {
                return callback(reason, false);
            });
        },

        /**
         * register callbacks when this promise object is resolved,
         * and throw error at next event loop if promise
         * (current instance if no fulfilled and rejected parameter or
         * new instance caused by call this.then(fulfilled, rejected))
         * fails.
         * @param {Function} [fulfilled] called when resolved successfully,pass a resolved value to this function and
         * return a value (could be promise object) for the new promise 's resolved value.
         * @param {Function} [rejected] called when error occurs,pass error reason to this function and
         * return a new reason for the new promise 's error reason
         */
        done: function (fulfilled, rejected) {
            var self = this,
                onUnhandledError = function (e) {
                    S.log(e.stack || e, 'error');
                    setTimeout(function () {
                        throw e;
                    }, 0);
                },
                promiseToHandle = fulfilled || rejected ?
                    self.then(fulfilled, rejected) :
                    self;
            promiseToHandle.fail(onUnhandledError);
        },

        /**
         * whether the given object is a resolved promise
         * if it is resolved with another promise,
         * then that promise needs to be resolved as well.
         * @member KISSY.Promise
         */
        isResolved: function () {
            return isResolved(this);
        },
        /**
         * whether the given object is a rejected promise
         */
        isRejected: function () {
            return isRejected(this);
        }
    };

    /**
     * Reject promise
     * @param {String|KISSY.Promise.Reject} reason reject reason
     * @class KISSY.Promise.Reject
     * @extend KISSY.Promise
     * @private
     */
    function Reject(reason) {
        if (reason instanceof Reject) {
            return reason;
        }
        var self = this;
        Promise.apply(self, arguments);
        if (self[PROMISE_VALUE] instanceof Promise) {
            logger.error('assert.not(this.__promise_value instanceof promise) in Reject constructor');
        }
        return self;
    }

    S.extend(Reject, Promise);


    // wrap for promiseWhen
    function when(value, fulfilled, rejected) {
        var defer = new Defer(),
            done = 0;

        // wrap user's callback to catch exception
        function _fulfilled(value) {
            try {
                return fulfilled ? fulfilled.call(this, value) :
                    // propagate
                    value;
            } catch (e) {
                // can not use logger.error
                // must expose to user
                // print stack info for firefox/chrome
                logError(e.stack || e);
                return new Reject(e);
            }
        }

        function _rejected(reason) {
            try {
                return rejected ?
                    // error recovery
                    rejected.call(this, reason) :
                    // propagate
                    new Reject(reason);
            } catch (e) {
                // print stack info for firefox/chrome
                logError(e.stack || e);
                return new Reject(e);
            }
        }

        function finalFulfill(value) {
            if (done) {
                logger.error('already done at fulfilled');
                return;
            }
            if (value instanceof Promise) {
                logger.error('assert.not(value instanceof Promise) in when');
                return;
            }
            done = 1;
            defer.resolve(_fulfilled.call(this, value));
        }

        if (value instanceof  Promise) {
            promiseWhen(value, finalFulfill, function (reason) {
                if (done) {
                    logger.error('already done at rejected');
                    return;
                }
                done = 1;
                // _reject may return non-Reject object for error recovery
                defer.resolve(_rejected.call(this, reason));
            });
        } else {
            finalFulfill(value);
        }

        // chained and leveled
        // wait for value's resolve
        return defer.promise;
    }

    function isResolved(obj) {
        // exclude Reject at first
        return !isRejected(obj) &&
            isPromise(obj) &&
            // self is resolved
            (obj[PROMISE_PENDINGS] === undefined) &&
            // value is a resolved promise or value is immediate value
            (
                // immediate value
                !isPromise(obj[PROMISE_VALUE]) ||
                    // resolved with a resolved promise !!! :)
                    // Reject.__promise_value is string
                    isResolved(obj[PROMISE_VALUE])
                );
    }

    function isRejected(obj) {
        return isPromise(obj) &&
            (obj[PROMISE_PENDINGS] === undefined) &&
            (obj[PROMISE_VALUE] instanceof Reject);
    }

    KISSY.Defer = Defer;
    KISSY.Promise = Promise;
    Promise.Defer = Defer;

    S.mix(Promise, {
        /**
         * register callbacks when obj as a promise is resolved
         * or call fulfilled callback directly when obj is not a promise object
         * @param {KISSY.Promise|*} obj a promise object or value of any type
         * @param {Function} fulfilled called when obj resolved successfully,pass a resolved value to this function and
         * return a value (could be promise object) for the new promise 's resolved value.
         * @param {Function} [rejected] called when error occurs in obj,pass error reason to this function and
         * return a new reason for the new promise 's error reason
         * @return {KISSY.Promise} a new promise object
         *
         * for example:
         *      @example
         *      function check(p) {
             *          S.Promise.when(p, function(v){
             *              alert(v === 1);
             *          });
             *      }
         *
         *      var defer = S.Defer();
         *      defer.resolve(1);
         *
         *      check(1); // => alert(true)
         *
         *      check(defer.promise); //=> alert(true);
         *
         * @static
         * @method
         * @member KISSY.Promise
         */
        when: when,

        /**
         * whether the given object is a promise
         * @method
         * @static
         * @param obj the tested object
         * @return {Boolean}
         * @member KISSY.Promise
         */
        isPromise: isPromise,

        /**
         * whether the given object is a resolved promise
         * @method
         * @static
         * @param obj the tested object
         * @return {Boolean}
         * @member KISSY.Promise
         */
        isResolved: isResolved,

        /**
         * whether the given object is a rejected promise
         * @method
         * @static
         * @param obj the tested object
         * @return {Boolean}
         * @member KISSY.Promise
         */
        isRejected: isRejected,

        /**
         * return a new promise
         * which is resolved when all promises is resolved
         * and rejected when any one of promises is rejected
         * @param {KISSY.Promise[]} promises list of promises
         * @static
         * @return {KISSY.Promise}
         * @member KISSY.Promise
         */
        all: function (promises) {
            var count = promises.length;
            if (!count) {
                return null;
            }
            var defer = Defer();
            for (var i = 0; i < promises.length; i++) {
                (function (promise, i) {
                    when(promise, function (value) {
                        promises[i] = value;
                        if (--count === 0) {
                            // if all is resolved
                            // then resolve final returned promise with all value
                            defer.resolve(promises);
                        }
                    }, function (r) {
                        // if any one is rejected
                        // then reject final return promise with first reason
                        defer.reject(r);
                    });
                })(promises[i], i);
            }
            return defer.promise;
        },

        /**
         * provide es6 generator
         * @param generatorFunc es6 generator function which has yielded promise
         */
        async: function (generatorFunc) {
            return function () {
                var generator = generatorFunc.apply(this, arguments);

                function doAction(action, arg) {
                    var result;
                    // in case error on first
                    try {
                        result = generator[action](arg);
                    } catch (e) {
                        return new Reject(e);
                    }
                    if (result.done) {
                        return result.value;
                    }
                    return when(result.value, next, throwEx);
                }

                function next(v) {
                    return doAction('next', v);
                }

                function throwEx(e) {
                    return doAction('throw', e);
                }

                return next();
            };
        }
    });
    return Promise;
});

/*
 refer:
 - http://wiki.commonjs.org/wiki/Promises
 - http://en.wikipedia.org/wiki/Futures_and_promises#Read-only_views
 - http://en.wikipedia.org/wiki/Object-capability_model
 - https://github.com/kriskowal/q
 - http://www.sitepen.com/blog/2010/05/03/robust-promises-with-dojo-deferred-1-5/
 - http://dojotoolkit.org/documentation/tutorials/1.6/deferreds/
 */

