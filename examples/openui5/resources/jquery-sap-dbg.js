/*!
 * @overview es6-promise - a tiny implementation of Promises/A+.
 * @copyright Copyright (c) 2014 Yehuda Katz, Tom Dale, Stefan Penner and contributors (Conversion to ES6 API by Jake Archibald)
 * @license   Licensed under MIT license
 *            See https://raw.githubusercontent.com/jakearchibald/es6-promise/master/LICENSE
 * @version   2.3.0
 */

(function() {
    "use strict";
    function lib$es6$promise$utils$$objectOrFunction(x) {
      return typeof x === 'function' || (typeof x === 'object' && x !== null);
    }

    function lib$es6$promise$utils$$isFunction(x) {
      return typeof x === 'function';
    }

    function lib$es6$promise$utils$$isMaybeThenable(x) {
      return typeof x === 'object' && x !== null;
    }

    var lib$es6$promise$utils$$_isArray;
    if (!Array.isArray) {
      lib$es6$promise$utils$$_isArray = function (x) {
        return Object.prototype.toString.call(x) === '[object Array]';
      };
    } else {
      lib$es6$promise$utils$$_isArray = Array.isArray;
    }

    var lib$es6$promise$utils$$isArray = lib$es6$promise$utils$$_isArray;
    var lib$es6$promise$asap$$len = 0;
    var lib$es6$promise$asap$$toString = {}.toString;
    var lib$es6$promise$asap$$vertxNext;
    var lib$es6$promise$asap$$customSchedulerFn;

    var lib$es6$promise$asap$$asap = function asap(callback, arg) {
      lib$es6$promise$asap$$queue[lib$es6$promise$asap$$len] = callback;
      lib$es6$promise$asap$$queue[lib$es6$promise$asap$$len + 1] = arg;
      lib$es6$promise$asap$$len += 2;
      if (lib$es6$promise$asap$$len === 2) {
        // If len is 2, that means that we need to schedule an async flush.
        // If additional callbacks are queued before the queue is flushed, they
        // will be processed by this flush that we are scheduling.
        if (lib$es6$promise$asap$$customSchedulerFn) {
          lib$es6$promise$asap$$customSchedulerFn(lib$es6$promise$asap$$flush);
        } else {
          lib$es6$promise$asap$$scheduleFlush();
        }
      }
    }

    function lib$es6$promise$asap$$setScheduler(scheduleFn) {
      lib$es6$promise$asap$$customSchedulerFn = scheduleFn;
    }

    function lib$es6$promise$asap$$setAsap(asapFn) {
      lib$es6$promise$asap$$asap = asapFn;
    }

    var lib$es6$promise$asap$$browserWindow = (typeof window !== 'undefined') ? window : undefined;
    var lib$es6$promise$asap$$browserGlobal = lib$es6$promise$asap$$browserWindow || {};
    var lib$es6$promise$asap$$BrowserMutationObserver = lib$es6$promise$asap$$browserGlobal.MutationObserver || lib$es6$promise$asap$$browserGlobal.WebKitMutationObserver;
    var lib$es6$promise$asap$$isNode = typeof process !== 'undefined' && {}.toString.call(process) === '[object process]';

    // test for web worker but not in IE10
    var lib$es6$promise$asap$$isWorker = typeof Uint8ClampedArray !== 'undefined' &&
      typeof importScripts !== 'undefined' &&
      typeof MessageChannel !== 'undefined';

    // node
    function lib$es6$promise$asap$$useNextTick() {
      var nextTick = process.nextTick;
      // node version 0.10.x displays a deprecation warning when nextTick is used recursively
      // setImmediate should be used instead instead
      var version = process.versions.node.match(/^(?:(\d+)\.)?(?:(\d+)\.)?(\*|\d+)$/);
      if (Array.isArray(version) && version[1] === '0' && version[2] === '10') {
        nextTick = setImmediate;
      }
      return function() {
        nextTick(lib$es6$promise$asap$$flush);
      };
    }

    // vertx
    function lib$es6$promise$asap$$useVertxTimer() {
      return function() {
        lib$es6$promise$asap$$vertxNext(lib$es6$promise$asap$$flush);
      };
    }

    function lib$es6$promise$asap$$useMutationObserver() {
      var iterations = 0;
      var observer = new lib$es6$promise$asap$$BrowserMutationObserver(lib$es6$promise$asap$$flush);
      var node = document.createTextNode('');
      observer.observe(node, { characterData: true });

      return function() {
        node.data = (iterations = ++iterations % 2);
      };
    }

    // web worker
    function lib$es6$promise$asap$$useMessageChannel() {
      var channel = new MessageChannel();
      channel.port1.onmessage = lib$es6$promise$asap$$flush;
      return function () {
        channel.port2.postMessage(0);
      };
    }

    function lib$es6$promise$asap$$useSetTimeout() {
      return function() {
        setTimeout(lib$es6$promise$asap$$flush, 1);
      };
    }

    var lib$es6$promise$asap$$queue = new Array(1000);
    function lib$es6$promise$asap$$flush() {
      for (var i = 0; i < lib$es6$promise$asap$$len; i+=2) {
        var callback = lib$es6$promise$asap$$queue[i];
        var arg = lib$es6$promise$asap$$queue[i+1];

        callback(arg);

        lib$es6$promise$asap$$queue[i] = undefined;
        lib$es6$promise$asap$$queue[i+1] = undefined;
      }

      lib$es6$promise$asap$$len = 0;
    }

    function lib$es6$promise$asap$$attemptVertex() {
      try {
        var r = require;
        var vertx = r('vertx');
        lib$es6$promise$asap$$vertxNext = vertx.runOnLoop || vertx.runOnContext;
        return lib$es6$promise$asap$$useVertxTimer();
      } catch(e) {
        return lib$es6$promise$asap$$useSetTimeout();
      }
    }

    var lib$es6$promise$asap$$scheduleFlush;
    // Decide what async method to use to triggering processing of queued callbacks:
    if (lib$es6$promise$asap$$isNode) {
      lib$es6$promise$asap$$scheduleFlush = lib$es6$promise$asap$$useNextTick();
    } else if (lib$es6$promise$asap$$BrowserMutationObserver) {
      lib$es6$promise$asap$$scheduleFlush = lib$es6$promise$asap$$useMutationObserver();
    } else if (lib$es6$promise$asap$$isWorker) {
      lib$es6$promise$asap$$scheduleFlush = lib$es6$promise$asap$$useMessageChannel();
    } else if (lib$es6$promise$asap$$browserWindow === undefined && typeof require === 'function') {
      lib$es6$promise$asap$$scheduleFlush = lib$es6$promise$asap$$attemptVertex();
    } else {
      lib$es6$promise$asap$$scheduleFlush = lib$es6$promise$asap$$useSetTimeout();
    }

    function lib$es6$promise$$internal$$noop() {}

    var lib$es6$promise$$internal$$PENDING   = void 0;
    var lib$es6$promise$$internal$$FULFILLED = 1;
    var lib$es6$promise$$internal$$REJECTED  = 2;

    var lib$es6$promise$$internal$$GET_THEN_ERROR = new lib$es6$promise$$internal$$ErrorObject();

    function lib$es6$promise$$internal$$selfFullfillment() {
      return new TypeError("You cannot resolve a promise with itself");
    }

    function lib$es6$promise$$internal$$cannotReturnOwn() {
      return new TypeError('A promises callback cannot return that same promise.');
    }

    function lib$es6$promise$$internal$$getThen(promise) {
      try {
        return promise.then;
      } catch(error) {
        lib$es6$promise$$internal$$GET_THEN_ERROR.error = error;
        return lib$es6$promise$$internal$$GET_THEN_ERROR;
      }
    }

    function lib$es6$promise$$internal$$tryThen(then, value, fulfillmentHandler, rejectionHandler) {
      try {
        then.call(value, fulfillmentHandler, rejectionHandler);
      } catch(e) {
        return e;
      }
    }

    function lib$es6$promise$$internal$$handleForeignThenable(promise, thenable, then) {
       lib$es6$promise$asap$$asap(function(promise) {
        var sealed = false;
        var error = lib$es6$promise$$internal$$tryThen(then, thenable, function(value) {
          if (sealed) { return; }
          sealed = true;
          if (thenable !== value) {
            lib$es6$promise$$internal$$resolve(promise, value);
          } else {
            lib$es6$promise$$internal$$fulfill(promise, value);
          }
        }, function(reason) {
          if (sealed) { return; }
          sealed = true;

          lib$es6$promise$$internal$$reject(promise, reason);
        }, 'Settle: ' + (promise._label || ' unknown promise'));

        if (!sealed && error) {
          sealed = true;
          lib$es6$promise$$internal$$reject(promise, error);
        }
      }, promise);
    }

    function lib$es6$promise$$internal$$handleOwnThenable(promise, thenable) {
      if (thenable._state === lib$es6$promise$$internal$$FULFILLED) {
        lib$es6$promise$$internal$$fulfill(promise, thenable._result);
      } else if (thenable._state === lib$es6$promise$$internal$$REJECTED) {
        lib$es6$promise$$internal$$reject(promise, thenable._result);
      } else {
        lib$es6$promise$$internal$$subscribe(thenable, undefined, function(value) {
          lib$es6$promise$$internal$$resolve(promise, value);
        }, function(reason) {
          lib$es6$promise$$internal$$reject(promise, reason);
        });
      }
    }

    function lib$es6$promise$$internal$$handleMaybeThenable(promise, maybeThenable) {
      if (maybeThenable.constructor === promise.constructor) {
        lib$es6$promise$$internal$$handleOwnThenable(promise, maybeThenable);
      } else {
        var then = lib$es6$promise$$internal$$getThen(maybeThenable);

        if (then === lib$es6$promise$$internal$$GET_THEN_ERROR) {
          lib$es6$promise$$internal$$reject(promise, lib$es6$promise$$internal$$GET_THEN_ERROR.error);
        } else if (then === undefined) {
          lib$es6$promise$$internal$$fulfill(promise, maybeThenable);
        } else if (lib$es6$promise$utils$$isFunction(then)) {
          lib$es6$promise$$internal$$handleForeignThenable(promise, maybeThenable, then);
        } else {
          lib$es6$promise$$internal$$fulfill(promise, maybeThenable);
        }
      }
    }

    function lib$es6$promise$$internal$$resolve(promise, value) {
      if (promise === value) {
        lib$es6$promise$$internal$$reject(promise, lib$es6$promise$$internal$$selfFullfillment());
      } else if (lib$es6$promise$utils$$objectOrFunction(value)) {
        lib$es6$promise$$internal$$handleMaybeThenable(promise, value);
      } else {
        lib$es6$promise$$internal$$fulfill(promise, value);
      }
    }

    function lib$es6$promise$$internal$$publishRejection(promise) {
      if (promise._onerror) {
        promise._onerror(promise._result);
      }

      lib$es6$promise$$internal$$publish(promise);
    }

    function lib$es6$promise$$internal$$fulfill(promise, value) {
      if (promise._state !== lib$es6$promise$$internal$$PENDING) { return; }

      promise._result = value;
      promise._state = lib$es6$promise$$internal$$FULFILLED;

      if (promise._subscribers.length !== 0) {
        lib$es6$promise$asap$$asap(lib$es6$promise$$internal$$publish, promise);
      }
    }

    function lib$es6$promise$$internal$$reject(promise, reason) {
      if (promise._state !== lib$es6$promise$$internal$$PENDING) { return; }
      promise._state = lib$es6$promise$$internal$$REJECTED;
      promise._result = reason;

      lib$es6$promise$asap$$asap(lib$es6$promise$$internal$$publishRejection, promise);
    }

    function lib$es6$promise$$internal$$subscribe(parent, child, onFulfillment, onRejection) {
      var subscribers = parent._subscribers;
      var length = subscribers.length;

      parent._onerror = null;

      subscribers[length] = child;
      subscribers[length + lib$es6$promise$$internal$$FULFILLED] = onFulfillment;
      subscribers[length + lib$es6$promise$$internal$$REJECTED]  = onRejection;

      if (length === 0 && parent._state) {
        lib$es6$promise$asap$$asap(lib$es6$promise$$internal$$publish, parent);
      }
    }

    function lib$es6$promise$$internal$$publish(promise) {
      var subscribers = promise._subscribers;
      var settled = promise._state;

      if (subscribers.length === 0) { return; }

      var child, callback, detail = promise._result;

      for (var i = 0; i < subscribers.length; i += 3) {
        child = subscribers[i];
        callback = subscribers[i + settled];

        if (child) {
          lib$es6$promise$$internal$$invokeCallback(settled, child, callback, detail);
        } else {
          callback(detail);
        }
      }

      promise._subscribers.length = 0;
    }

    function lib$es6$promise$$internal$$ErrorObject() {
      this.error = null;
    }

    var lib$es6$promise$$internal$$TRY_CATCH_ERROR = new lib$es6$promise$$internal$$ErrorObject();

    function lib$es6$promise$$internal$$tryCatch(callback, detail) {
      try {
        return callback(detail);
      } catch(e) {
        lib$es6$promise$$internal$$TRY_CATCH_ERROR.error = e;
        return lib$es6$promise$$internal$$TRY_CATCH_ERROR;
      }
    }

    function lib$es6$promise$$internal$$invokeCallback(settled, promise, callback, detail) {
      var hasCallback = lib$es6$promise$utils$$isFunction(callback),
          value, error, succeeded, failed;

      if (hasCallback) {
        value = lib$es6$promise$$internal$$tryCatch(callback, detail);

        if (value === lib$es6$promise$$internal$$TRY_CATCH_ERROR) {
          failed = true;
          error = value.error;
          value = null;
        } else {
          succeeded = true;
        }

        if (promise === value) {
          lib$es6$promise$$internal$$reject(promise, lib$es6$promise$$internal$$cannotReturnOwn());
          return;
        }

      } else {
        value = detail;
        succeeded = true;
      }

      if (promise._state !== lib$es6$promise$$internal$$PENDING) {
        // noop
      } else if (hasCallback && succeeded) {
        lib$es6$promise$$internal$$resolve(promise, value);
      } else if (failed) {
        lib$es6$promise$$internal$$reject(promise, error);
      } else if (settled === lib$es6$promise$$internal$$FULFILLED) {
        lib$es6$promise$$internal$$fulfill(promise, value);
      } else if (settled === lib$es6$promise$$internal$$REJECTED) {
        lib$es6$promise$$internal$$reject(promise, value);
      }
    }

    function lib$es6$promise$$internal$$initializePromise(promise, resolver) {
      try {
        resolver(function resolvePromise(value){
          lib$es6$promise$$internal$$resolve(promise, value);
        }, function rejectPromise(reason) {
          lib$es6$promise$$internal$$reject(promise, reason);
        });
      } catch(e) {
        lib$es6$promise$$internal$$reject(promise, e);
      }
    }

    function lib$es6$promise$enumerator$$Enumerator(Constructor, input) {
      var enumerator = this;

      enumerator._instanceConstructor = Constructor;
      enumerator.promise = new Constructor(lib$es6$promise$$internal$$noop);

      if (enumerator._validateInput(input)) {
        enumerator._input     = input;
        enumerator.length     = input.length;
        enumerator._remaining = input.length;

        enumerator._init();

        if (enumerator.length === 0) {
          lib$es6$promise$$internal$$fulfill(enumerator.promise, enumerator._result);
        } else {
          enumerator.length = enumerator.length || 0;
          enumerator._enumerate();
          if (enumerator._remaining === 0) {
            lib$es6$promise$$internal$$fulfill(enumerator.promise, enumerator._result);
          }
        }
      } else {
        lib$es6$promise$$internal$$reject(enumerator.promise, enumerator._validationError());
      }
    }

    lib$es6$promise$enumerator$$Enumerator.prototype._validateInput = function(input) {
      return lib$es6$promise$utils$$isArray(input);
    };

    lib$es6$promise$enumerator$$Enumerator.prototype._validationError = function() {
      return new Error('Array Methods must be provided an Array');
    };

    lib$es6$promise$enumerator$$Enumerator.prototype._init = function() {
      this._result = new Array(this.length);
    };

    var lib$es6$promise$enumerator$$default = lib$es6$promise$enumerator$$Enumerator;

    lib$es6$promise$enumerator$$Enumerator.prototype._enumerate = function() {
      var enumerator = this;

      var length  = enumerator.length;
      var promise = enumerator.promise;
      var input   = enumerator._input;

      for (var i = 0; promise._state === lib$es6$promise$$internal$$PENDING && i < length; i++) {
        enumerator._eachEntry(input[i], i);
      }
    };

    lib$es6$promise$enumerator$$Enumerator.prototype._eachEntry = function(entry, i) {
      var enumerator = this;
      var c = enumerator._instanceConstructor;

      if (lib$es6$promise$utils$$isMaybeThenable(entry)) {
        if (entry.constructor === c && entry._state !== lib$es6$promise$$internal$$PENDING) {
          entry._onerror = null;
          enumerator._settledAt(entry._state, i, entry._result);
        } else {
          enumerator._willSettleAt(c.resolve(entry), i);
        }
      } else {
        enumerator._remaining--;
        enumerator._result[i] = entry;
      }
    };

    lib$es6$promise$enumerator$$Enumerator.prototype._settledAt = function(state, i, value) {
      var enumerator = this;
      var promise = enumerator.promise;

      if (promise._state === lib$es6$promise$$internal$$PENDING) {
        enumerator._remaining--;

        if (state === lib$es6$promise$$internal$$REJECTED) {
          lib$es6$promise$$internal$$reject(promise, value);
        } else {
          enumerator._result[i] = value;
        }
      }

      if (enumerator._remaining === 0) {
        lib$es6$promise$$internal$$fulfill(promise, enumerator._result);
      }
    };

    lib$es6$promise$enumerator$$Enumerator.prototype._willSettleAt = function(promise, i) {
      var enumerator = this;

      lib$es6$promise$$internal$$subscribe(promise, undefined, function(value) {
        enumerator._settledAt(lib$es6$promise$$internal$$FULFILLED, i, value);
      }, function(reason) {
        enumerator._settledAt(lib$es6$promise$$internal$$REJECTED, i, reason);
      });
    };
    function lib$es6$promise$promise$all$$all(entries) {
      return new lib$es6$promise$enumerator$$default(this, entries).promise;
    }
    var lib$es6$promise$promise$all$$default = lib$es6$promise$promise$all$$all;
    function lib$es6$promise$promise$race$$race(entries) {
      /*jshint validthis:true */
      var Constructor = this;

      var promise = new Constructor(lib$es6$promise$$internal$$noop);

      if (!lib$es6$promise$utils$$isArray(entries)) {
        lib$es6$promise$$internal$$reject(promise, new TypeError('You must pass an array to race.'));
        return promise;
      }

      var length = entries.length;

      function onFulfillment(value) {
        lib$es6$promise$$internal$$resolve(promise, value);
      }

      function onRejection(reason) {
        lib$es6$promise$$internal$$reject(promise, reason);
      }

      for (var i = 0; promise._state === lib$es6$promise$$internal$$PENDING && i < length; i++) {
        lib$es6$promise$$internal$$subscribe(Constructor.resolve(entries[i]), undefined, onFulfillment, onRejection);
      }

      return promise;
    }
    var lib$es6$promise$promise$race$$default = lib$es6$promise$promise$race$$race;
    function lib$es6$promise$promise$resolve$$resolve(object) {
      /*jshint validthis:true */
      var Constructor = this;

      if (object && typeof object === 'object' && object.constructor === Constructor) {
        return object;
      }

      var promise = new Constructor(lib$es6$promise$$internal$$noop);
      lib$es6$promise$$internal$$resolve(promise, object);
      return promise;
    }
    var lib$es6$promise$promise$resolve$$default = lib$es6$promise$promise$resolve$$resolve;
    function lib$es6$promise$promise$reject$$reject(reason) {
      /*jshint validthis:true */
      var Constructor = this;
      var promise = new Constructor(lib$es6$promise$$internal$$noop);
      lib$es6$promise$$internal$$reject(promise, reason);
      return promise;
    }
    var lib$es6$promise$promise$reject$$default = lib$es6$promise$promise$reject$$reject;

    var lib$es6$promise$promise$$counter = 0;

    function lib$es6$promise$promise$$needsResolver() {
      throw new TypeError('You must pass a resolver function as the first argument to the promise constructor');
    }

    function lib$es6$promise$promise$$needsNew() {
      throw new TypeError("Failed to construct 'Promise': Please use the 'new' operator, this object constructor cannot be called as a function.");
    }

    var lib$es6$promise$promise$$default = lib$es6$promise$promise$$Promise;
    /**
      Promise objects represent the eventual result of an asynchronous operation. The
      primary way of interacting with a promise is through its `then` method, which
      registers callbacks to receive either a promise's eventual value or the reason
      why the promise cannot be fulfilled.

      Terminology
      -----------

      - `promise` is an object or function with a `then` method whose behavior conforms to this specification.
      - `thenable` is an object or function that defines a `then` method.
      - `value` is any legal JavaScript value (including undefined, a thenable, or a promise).
      - `exception` is a value that is thrown using the throw statement.
      - `reason` is a value that indicates why a promise was rejected.
      - `settled` the final resting state of a promise, fulfilled or rejected.

      A promise can be in one of three states: pending, fulfilled, or rejected.

      Promises that are fulfilled have a fulfillment value and are in the fulfilled
      state.  Promises that are rejected have a rejection reason and are in the
      rejected state.  A fulfillment value is never a thenable.

      Promises can also be said to *resolve* a value.  If this value is also a
      promise, then the original promise's settled state will match the value's
      settled state.  So a promise that *resolves* a promise that rejects will
      itself reject, and a promise that *resolves* a promise that fulfills will
      itself fulfill.


      Basic Usage:
      ------------

      ```js
      var promise = new Promise(function(resolve, reject) {
        // on success
        resolve(value);

        // on failure
        reject(reason);
      });

      promise.then(function(value) {
        // on fulfillment
      }, function(reason) {
        // on rejection
      });
      ```

      Advanced Usage:
      ---------------

      Promises shine when abstracting away asynchronous interactions such as
      `XMLHttpRequest`s.

      ```js
      function getJSON(url) {
        return new Promise(function(resolve, reject){
          var xhr = new XMLHttpRequest();

          xhr.open('GET', url);
          xhr.onreadystatechange = handler;
          xhr.responseType = 'json';
          xhr.setRequestHeader('Accept', 'application/json');
          xhr.send();

          function handler() {
            if (this.readyState === this.DONE) {
              if (this.status === 200) {
                resolve(this.response);
              } else {
                reject(new Error('getJSON: `' + url + '` failed with status: [' + this.status + ']'));
              }
            }
          };
        });
      }

      getJSON('/posts.json').then(function(json) {
        // on fulfillment
      }, function(reason) {
        // on rejection
      });
      ```

      Unlike callbacks, promises are great composable primitives.

      ```js
      Promise.all([
        getJSON('/posts'),
        getJSON('/comments')
      ]).then(function(values){
        values[0] // => postsJSON
        values[1] // => commentsJSON

        return values;
      });
      ```

      @class Promise
      @param {function} resolver
      Useful for tooling.
      @constructor
    */
    function lib$es6$promise$promise$$Promise(resolver) {
      this._id = lib$es6$promise$promise$$counter++;
      this._state = undefined;
      this._result = undefined;
      this._subscribers = [];

      if (lib$es6$promise$$internal$$noop !== resolver) {
        if (!lib$es6$promise$utils$$isFunction(resolver)) {
          lib$es6$promise$promise$$needsResolver();
        }

        if (!(this instanceof lib$es6$promise$promise$$Promise)) {
          lib$es6$promise$promise$$needsNew();
        }

        lib$es6$promise$$internal$$initializePromise(this, resolver);
      }
    }

    lib$es6$promise$promise$$Promise.all = lib$es6$promise$promise$all$$default;
    lib$es6$promise$promise$$Promise.race = lib$es6$promise$promise$race$$default;
    lib$es6$promise$promise$$Promise.resolve = lib$es6$promise$promise$resolve$$default;
    lib$es6$promise$promise$$Promise.reject = lib$es6$promise$promise$reject$$default;
    lib$es6$promise$promise$$Promise._setScheduler = lib$es6$promise$asap$$setScheduler;
    lib$es6$promise$promise$$Promise._setAsap = lib$es6$promise$asap$$setAsap;
    lib$es6$promise$promise$$Promise._asap = lib$es6$promise$asap$$asap;

    lib$es6$promise$promise$$Promise.prototype = {
      constructor: lib$es6$promise$promise$$Promise,

    /**
      The primary way of interacting with a promise is through its `then` method,
      which registers callbacks to receive either a promise's eventual value or the
      reason why the promise cannot be fulfilled.

      ```js
      findUser().then(function(user){
        // user is available
      }, function(reason){
        // user is unavailable, and you are given the reason why
      });
      ```

      Chaining
      --------

      The return value of `then` is itself a promise.  This second, 'downstream'
      promise is resolved with the return value of the first promise's fulfillment
      or rejection handler, or rejected if the handler throws an exception.

      ```js
      findUser().then(function (user) {
        return user.name;
      }, function (reason) {
        return 'default name';
      }).then(function (userName) {
        // If `findUser` fulfilled, `userName` will be the user's name, otherwise it
        // will be `'default name'`
      });

      findUser().then(function (user) {
        throw new Error('Found user, but still unhappy');
      }, function (reason) {
        throw new Error('`findUser` rejected and we're unhappy');
      }).then(function (value) {
        // never reached
      }, function (reason) {
        // if `findUser` fulfilled, `reason` will be 'Found user, but still unhappy'.
        // If `findUser` rejected, `reason` will be '`findUser` rejected and we're unhappy'.
      });
      ```
      If the downstream promise does not specify a rejection handler, rejection reasons will be propagated further downstream.

      ```js
      findUser().then(function (user) {
        throw new PedagogicalException('Upstream error');
      }).then(function (value) {
        // never reached
      }).then(function (value) {
        // never reached
      }, function (reason) {
        // The `PedgagocialException` is propagated all the way down to here
      });
      ```

      Assimilation
      ------------

      Sometimes the value you want to propagate to a downstream promise can only be
      retrieved asynchronously. This can be achieved by returning a promise in the
      fulfillment or rejection handler. The downstream promise will then be pending
      until the returned promise is settled. This is called *assimilation*.

      ```js
      findUser().then(function (user) {
        return findCommentsByAuthor(user);
      }).then(function (comments) {
        // The user's comments are now available
      });
      ```

      If the assimliated promise rejects, then the downstream promise will also reject.

      ```js
      findUser().then(function (user) {
        return findCommentsByAuthor(user);
      }).then(function (comments) {
        // If `findCommentsByAuthor` fulfills, we'll have the value here
      }, function (reason) {
        // If `findCommentsByAuthor` rejects, we'll have the reason here
      });
      ```

      Simple Example
      --------------

      Synchronous Example

      ```javascript
      var result;

      try {
        result = findResult();
        // success
      } catch(reason) {
        // failure
      }
      ```

      Errback Example

      ```js
      findResult(function(result, err){
        if (err) {
          // failure
        } else {
          // success
        }
      });
      ```

      Promise Example;

      ```javascript
      findResult().then(function(result){
        // success
      }, function(reason){
        // failure
      });
      ```

      Advanced Example
      --------------

      Synchronous Example

      ```javascript
      var author, books;

      try {
        author = findAuthor();
        books  = findBooksByAuthor(author);
        // success
      } catch(reason) {
        // failure
      }
      ```

      Errback Example

      ```js

      function foundBooks(books) {

      }

      function failure(reason) {

      }

      findAuthor(function(author, err){
        if (err) {
          failure(err);
          // failure
        } else {
          try {
            findBoooksByAuthor(author, function(books, err) {
              if (err) {
                failure(err);
              } else {
                try {
                  foundBooks(books);
                } catch(reason) {
                  failure(reason);
                }
              }
            });
          } catch(error) {
            failure(err);
          }
          // success
        }
      });
      ```

      Promise Example;

      ```javascript
      findAuthor().
        then(findBooksByAuthor).
        then(function(books){
          // found books
      }).catch(function(reason){
        // something went wrong
      });
      ```

      @method then
      @param {Function} onFulfilled
      @param {Function} onRejected
      Useful for tooling.
      @return {Promise}
    */
      then: function(onFulfillment, onRejection) {
        var parent = this;
        var state = parent._state;

        if (state === lib$es6$promise$$internal$$FULFILLED && !onFulfillment || state === lib$es6$promise$$internal$$REJECTED && !onRejection) {
          return this;
        }

        var child = new this.constructor(lib$es6$promise$$internal$$noop);
        var result = parent._result;

        if (state) {
          var callback = arguments[state - 1];
          lib$es6$promise$asap$$asap(function(){
            lib$es6$promise$$internal$$invokeCallback(state, child, callback, result);
          });
        } else {
          lib$es6$promise$$internal$$subscribe(parent, child, onFulfillment, onRejection);
        }

        return child;
      },

    /**
      `catch` is simply sugar for `then(undefined, onRejection)` which makes it the same
      as the catch block of a try/catch statement.

      ```js
      function findAuthor(){
        throw new Error('couldn't find that author');
      }

      // synchronous
      try {
        findAuthor();
      } catch(reason) {
        // something went wrong
      }

      // async with promises
      findAuthor().catch(function(reason){
        // something went wrong
      });
      ```

      @method catch
      @param {Function} onRejection
      Useful for tooling.
      @return {Promise}
    */
      'catch': function(onRejection) {
        return this.then(null, onRejection);
      }
    };
    function lib$es6$promise$polyfill$$polyfill() {
      var local;

      if (typeof global !== 'undefined') {
          local = global;
      } else if (typeof self !== 'undefined') {
          local = self;
      } else {
          try {
              local = Function('return this')();
          } catch (e) {
              throw new Error('polyfill failed because global object is unavailable in this environment');
          }
      }

      var P = local.Promise;

      // ##### BEGIN: MODIFIED BY SAP
      // Original line: 
      //    if (P && Object.prototype.toString.call(P.resolve()) === '[object Promise]' && !P.cast) {
      // This lead to the polyfill replacing the native promise object in 
      // - Chrome, where "[object Object]" is returned instead of '[object Promise]'
      // - Safari, where native promise contains a definition for Promise.cast
      if (P && Object.prototype.toString.call(P.resolve()).indexOf('[object ') === 0) {
      // ##### END: MODIFIED BY SAP
        return;
      }

      local.Promise = lib$es6$promise$promise$$default;
    }
    var lib$es6$promise$polyfill$$default = lib$es6$promise$polyfill$$polyfill;

    var lib$es6$promise$umd$$ES6Promise = {
      'Promise': lib$es6$promise$promise$$default,
      'polyfill': lib$es6$promise$polyfill$$default
    };

    /* global define:true module:true window: true */
    if (typeof define === 'function' && define['amd']) {
      // ##### BEGIN: MODIFIED BY SAP
      // Original line:
      // define(function() { return lib$es6$promise$umd$$ES6Promise; });
      define('sap/ui/thirdparty/es6-promise', function() { return lib$es6$promise$umd$$ES6Promise; });
      // ##### END: MODIFIED BY SAP
    } else if (typeof module !== 'undefined' && module['exports']) {
      module['exports'] = lib$es6$promise$umd$$ES6Promise;
    } else if (typeof this !== 'undefined') {
      this['ES6Promise'] = lib$es6$promise$umd$$ES6Promise;
    }

    lib$es6$promise$polyfill$$default();
}).call(this);

/*!
 * UI development toolkit for HTML5 (OpenUI5)
 * (c) Copyright 2009-2015 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */

/**
 * Device and Feature Detection API: Provides information about the used browser / device and cross platform support for certain events
 * like media queries, orientation change or resizing.
 *
 * This API is independent from any other part of the UI5 framework. This allows it to be loaded beforehand, if it is needed, to create the UI5 bootstrap
 * dynamically depending on the capabilities of the browser or device.
 *
 * @version 1.32.9
 * @namespace
 * @name sap.ui.Device
 * @public
 */

/*global console */

//Declare Module if API is available
if (window.jQuery && window.jQuery.sap && window.jQuery.sap.declare) {
	window.jQuery.sap.declare("sap.ui.Device", false);
}

//Introduce namespace if it does not yet exist
if (typeof window.sap !== "object" && typeof window.sap !== "function" ) {
	  window.sap = {};
}
if (typeof window.sap.ui !== "object") {
	window.sap.ui = {};
}

(function() {

	//Skip initialization if API is already available
	if (typeof window.sap.ui.Device === "object" || typeof window.sap.ui.Device === "function" ) {
		var apiVersion = "1.32.9";
		window.sap.ui.Device._checkAPIVersion(apiVersion);
		return;
	}

	var device = {};

////-------------------------- Logging -------------------------------------
	/* since we cannot use the logging from jquery.sap.global.js, we need to come up with a seperate
	 * solution for the device API
	 */
	// helper function for date formatting
	function pad0(i,w) {
		return ("000" + String(i)).slice(-w);
	}

	var FATAL = 0, ERROR = 1, WARNING = 2, INFO = 3, DEBUG = 4, TRACE = 5;

	var deviceLogger = function() {
		this.defaultComponent = 'DEVICE';
		this.sWindowName = (window.top == window) ? "" : "[" + window.location.pathname.split('/').slice(-1)[0] + "] ";
	// Creates a new log entry depending on its level and component.
		this.log = function (iLevel, sMessage, sComponent) {
			sComponent = sComponent || this.defaultComponent  || '';
				var oNow = new Date(),
					oLogEntry = {
						time     : pad0(oNow.getHours(),2) + ":" + pad0(oNow.getMinutes(),2) + ":" + pad0(oNow.getSeconds(),2),
						date     : pad0(oNow.getFullYear(),4) + "-" + pad0(oNow.getMonth() + 1,2) + "-" + pad0(oNow.getDate(),2),
						timestamp: oNow.getTime(),
						level    : iLevel,
						message  : sMessage || "",
						component: sComponent || ""
					};
				/*eslint-disable no-console */
				if (window.console) { // in IE and FF, console might not exist; in FF it might even disappear
					var logText = oLogEntry.date + " " + oLogEntry.time + " " + this.sWindowName + oLogEntry.message + " - " + oLogEntry.component;
					switch (iLevel) {
					case FATAL:
					case ERROR: console.error(logText); break;
					case WARNING: console.warn(logText); break;
					case INFO: console.info ? console.info(logText) : console.log(logText); break;    // info not available in iOS simulator
					case DEBUG: console.debug ? console.debug(logText) : console.log(logText); break; // debug not available in IE, fallback to log
					case TRACE: console.trace ? console.trace(logText) : console.log(logText); break; // trace not available in IE, fallback to log (no trace)
					}
				}
				/*eslint-enable no-console */
				return oLogEntry;
		};
	};
// instantiate new logger
	var logger = new deviceLogger();
	logger.log(INFO, "Device API logging initialized");


//******** Version Check ********

	//Only used internal to make clear when Device API is loaded in wrong version
	device._checkAPIVersion = function(sVersion){
		var v = "1.32.9";
		if (v != sVersion) {
			logger.log(WARNING, "Device API version differs: " + v + " <-> " + sVersion);
		}
	};


//******** Event Management ******** (see Event Provider)

	var mEventRegistry = {};

	function attachEvent(sEventId, fnFunction, oListener) {
		if (!mEventRegistry[sEventId]) {
			mEventRegistry[sEventId] = [];
		}
		mEventRegistry[sEventId].push({oListener: oListener, fFunction:fnFunction});
	}

	function detachEvent(sEventId, fnFunction, oListener) {
		var aEventListeners = mEventRegistry[sEventId];

		if (!aEventListeners) {
			return this;
		}

		for (var i = 0, iL = aEventListeners.length; i < iL; i++) {
			if (aEventListeners[i].fFunction === fnFunction && aEventListeners[i].oListener === oListener) {
				aEventListeners.splice(i,1);
				break;
			}
		}
		if (aEventListeners.length == 0) {
			delete mEventRegistry[sEventId];
		}
	}

	function fireEvent(sEventId, mParameters) {
		var aEventListeners = mEventRegistry[sEventId], oInfo;
		if (aEventListeners) {
			aEventListeners = aEventListeners.slice();
			for (var i = 0, iL = aEventListeners.length; i < iL; i++) {
				oInfo = aEventListeners[i];
				oInfo.fFunction.call(oInfo.oListener || window, mParameters);
			}
		}
	}

//******** OS Detection ********

	/**
	 * Contains information about the operating system of the device.
	 *
	 * @namespace
	 * @name sap.ui.Device.os
	 * @public
	 */
	/**
	 * Enumeration containing the names of known operating systems.
	 *
	 * @namespace
	 * @name sap.ui.Device.os.OS
	 * @public
	 */
	/**
	 * The name of the operating system.
	 *
	 * @see sap.ui.Device.os.OS
	 * @name sap.ui.Device.os#name
	 * @type String
	 * @public
	 */
	/**
	 * The version of the operating system as <code>string</code>.
	 *
	 * Might be empty if no version can be determined.
	 *
	 * @name sap.ui.Device.os#versionStr
	 * @type String
	 * @public
	 */
	/**
	 * The version of the operating system as <code>float</code>.
	 *
	 * Might be <code>-1</code> if no version can be determined.
	 *
	 * @name sap.ui.Device.os#version
	 * @type float
	 * @public
	 */
	/**
	 * If this flag is set to <code>true</code>, a Windows operating system is used.
	 *
	 * @name sap.ui.Device.os#windows
	 * @type boolean
	 * @public
	 */
	/**
	 * If this flag is set to <code>true</code>, a Linux operating system is used.
	 *
	 * @name sap.ui.Device.os#linux
	 * @type boolean
	 * @public
	 */
	/**
	 * If this flag is set to <code>true</code>, a Mac operating system is used.
	 *
	 * @name sap.ui.Device.os#macintosh
	 * @type boolean
	 * @public
	 */
	/**
	 * If this flag is set to <code>true</code>, an iOS operating system is used.
	 *
	 * @name sap.ui.Device.os#ios
	 * @type boolean
	 * @public
	 */
	/**
	 * If this flag is set to <code>true</code>, an Android operating system is used.
	 *
	 * @name sap.ui.Device.os#android
	 * @type boolean
	 * @public
	 */
	/**
	 * If this flag is set to <code>true</code>, a Blackberry operating system is used.
	 *
	 * @name sap.ui.Device.os#blackberry
	 * @type boolean
	 * @public
	 */
	/**
	 * If this flag is set to <code>true</code>, a Windows Phone operating system is used.
	 *
	 * @name sap.ui.Device.os#windows_phone
	 * @type boolean
	 * @public
	 */

	/**
	 * Windows operating system name.
	 *
	 * @see sap.ui.Device.os#name
	 * @name sap.ui.Device.os.OS#WINDOWS
	 * @public
	 */
	/**
	 * MAC operating system name.
	 *
	 * @see sap.ui.Device.os#name
	 * @name sap.ui.Device.os.OS#MACINTOSH
	 * @public
	 */
	/**
	 * Linux operating system name.
	 *
	 * @see sap.ui.Device.os#name
	 * @name sap.ui.Device.os.OS#LINUX
	 * @public
	 */
	/**
	 * iOS operating system name.
	 *
	 * @see sap.ui.Device.os#name
	 * @name sap.ui.Device.os.OS#IOS
	 * @public
	 */
	/**
	 * Android operating system name.
	 *
	 * @see sap.ui.Device.os#name
	 * @name sap.ui.Device.os.OS#ANDROID
	 * @public
	 */
	/**
	 * Blackberry operating system name.
	 *
	 * @see sap.ui.Device.os#name
	 * @name sap.ui.Device.os.OS#BLACKBERRY
	 * @public
	 */
	/**
	 * Windows Phone operating system name.
	 *
	 * @see sap.ui.Device.os#name
	 * @alias sap.ui.Device.os.OS#WINDOWS_PHONE
	 * @public
	 */

	var OS = {
		"WINDOWS": "win",
		"MACINTOSH": "mac",
		"LINUX": "linux",
		"IOS": "iOS",
		"ANDROID": "Android",
		"BLACKBERRY": "bb",
		"WINDOWS_PHONE": "winphone"
	};

	function getOS(userAgent){ // may return null!!

		userAgent = userAgent || navigator.userAgent;

		var platform, // regular expression for platform
			result;

		function getDesktopOS(){
			var pf = navigator.platform;
			if (pf.indexOf("Win") != -1 ) {
				// userAgent in windows 7 contains: windows NT 6.1
				// userAgent in windows 8 contains: windows NT 6.2 or higher
				// userAgent since windows 10: Windows NT 10[...]
				var rVersion = /Windows NT (\d+).(\d)/i;
				var uaResult = userAgent.match(rVersion);
				var sVersionStr = "";
				if (uaResult[1] == "6") {
					if (uaResult[2] == 1) {
						sVersionStr = "7";
					} else if (uaResult[2] > 1) {
						sVersionStr = "8";
					}
				} else {
					sVersionStr = uaResult[1];
				}
				return {"name": OS.WINDOWS, "versionStr": sVersionStr};
			} else if (pf.indexOf("Mac") != -1) {
				return {"name": OS.MACINTOSH, "versionStr": ""};
			} else if (pf.indexOf("Linux") != -1) {
				return {"name": OS.LINUX, "versionStr": ""};
			}
			logger.log(INFO, "OS detection returned no result");
			return null;
		}

		// Windows Phone. User agent includes other platforms and therefore must be checked first:
		platform = /Windows Phone (?:OS )?([\d.]*)/;
		result = userAgent.match(platform);
		if (result) {
			return ({"name": OS.WINDOWS_PHONE, "versionStr": result[1]});
		}

		// BlackBerry 10:
		if (userAgent.indexOf("(BB10;") > 0) {
			platform = /\sVersion\/([\d.]+)\s/;
			result = userAgent.match(platform);
			if (result) {
				return {"name": OS.BLACKBERRY, "versionStr": result[1]};
			} else {
				return {"name": OS.BLACKBERRY, "versionStr": '10'};
			}
		}

		// iOS, Android, BlackBerry 6.0+:
		platform = /\(([a-zA-Z ]+);\s(?:[U]?[;]?)([\D]+)((?:[\d._]*))(?:.*[\)][^\d]*)([\d.]*)\s/;
		result = userAgent.match(platform);
		if (result) {
			var appleDevices = /iPhone|iPad|iPod/;
			var bbDevices = /PlayBook|BlackBerry/;
			if (result[0].match(appleDevices)) {
				result[3] = result[3].replace(/_/g, ".");
				//result[1] contains info of devices
				return ({"name": OS.IOS, "versionStr": result[3]});
			} else if (result[2].match(/Android/)) {
				result[2] = result[2].replace(/\s/g, "");
				return ({"name": OS.ANDROID, "versionStr": result[3]});
			} else if (result[0].match(bbDevices)) {
				return ({"name": OS.BLACKBERRY, "versionStr": result[4]});
			}
		}
		
		//Firefox on Android
		platform = /\((Android)[\s]?([\d][.\d]*)?;.*Firefox\/[\d][.\d]*/;
		result = userAgent.match(platform);
		if (result) {
			return ({"name": OS.ANDROID, "versionStr": result.length == 3 ? result[2] : ""});
		}

		// Desktop
		return getDesktopOS();
	}

	function setOS(customUA) {
		device.os = getOS(customUA) || {};
		device.os.OS = OS;
		device.os.version = device.os.versionStr ? parseFloat(device.os.versionStr) : -1;

		if (device.os.name) {
			for (var b in OS) {
				if (OS[b] === device.os.name) {
					device.os[b.toLowerCase()] = true;
				}
			}
		}
	}
	setOS();
	// expose for unit test
	device._setOS = setOS;



//******** Browser Detection ********

	/**
	 * Contains information about the used browser.
	 *
	 * @namespace
	 * @name sap.ui.Device.browser
	 * @public
	 */

	/**
	 * Enumeration containing the names of known browsers.
	 *
	 * @namespace
	 * @name sap.ui.Device.browser.BROWSER
	 * @public
	 */

	/**
	 * The name of the browser.
	 *
	 * @see sap.ui.Device.browser.BROWSER
	 * @name sap.ui.Device.browser#name
	 * @type String
	 * @public
	 */
	/**
	 * The version of the browser as <code>string</code>.
	 *
	 * Might be empty if no version can be determined.
	 *
	 * @name sap.ui.Device.browser#versionStr
	 * @type String
	 * @public
	 */
	/**
	 * The version of the browser as <code>float</code>.
	 *
	 * Might be <code>-1</code> if no version can be determined.
	 *
	 * @name sap.ui.Device.browser#version
	 * @type float
	 * @public
	 */
	/**
	 * If this flag is set to <code>true</code>, the mobile variant of the browser is used.
	 *
	 * <b>Note:</b> This information might not be available for all browsers.
	 *
	 * @name sap.ui.Device.browser#mobile
	 * @type boolean
	 * @public
	 */
	/**
	 * If this flag is set to <code>true</code>, the Microsoft Internet Explorer browser is used.
	 *
	 * @name sap.ui.Device.browser#internet_explorer
	 * @type boolean
	 * @deprecated since 1.20, use {@link sap.ui.Device.browser.msie} instead.
	 * @public
	 */
	/**
	 * If this flag is set to <code>true</code>, the Microsoft Internet Explorer browser is used.
	 *
	 * @name sap.ui.Device.browser#msie
	 * @type boolean
	 * @since 1.20.0
	 * @public
	 */
	/**
	 * If this flag is set to <code>true</code>, the Microsoft Edge browser is used.
	 *
	 * @name sap.ui.Device.browser#edge
	 * @type boolean
	 * @since 1.30.0
	 * @public
	 */
	/**
	 * If this flag is set to <code>true</code>, the Mozilla Firefox browser is used.
	 *
	 * @name sap.ui.Device.browser#firefox
	 * @type boolean
	 * @public
	 */
	/**
	 * If this flag is set to <code>true</code>, the Google Chrome browser is used.
	 *
	 * @name sap.ui.Device.browser#chrome
	 * @type boolean
	 * @public
	 */
	/**
	 * If this flag is set to <code>true</code>, the Apple Safari browser is used.
	 *
	 * <b>Note:</b>
	 * This flag is also <code>true</code> when the standalone (fullscreen) mode or webview is used on iOS devices.
	 * Please also note the flags {@link sap.ui.Device.browser#fullscreen} and {@link sap.ui.Device.browser#webview}.
	 *
	 * @name sap.ui.Device.browser#safari
	 * @type boolean
	 * @public
	 */
	/**
	 * If this flag is set to <code>true</code>, a browser featuring a Webkit engine is used.
	 *
	 * @name sap.ui.Device.browser#webkit
	 * @type boolean
	 * @since 1.20.0
	 * @public
	 */
	/**
	 * If this flag is set to <code>true</code>, the Safari browser runs in standalone fullscreen mode on iOS.
	 *
	 * <b>Note:</b> This flag is only available if the Safari browser was detected. Furthermore, if this mode is detected,
	 * technically not a standard Safari is used. There might be slight differences in behavior and detection, e.g.
	 * the availability of {@link sap.ui.Device.browser#version}.
	 *
	 * @name sap.ui.Device.browser#fullscreen
	 * @type boolean
	 * @since 1.31.0
	 * @public
	 */
	/**
	 * If this flag is set to <code>true</code>, the Safari browser runs in webview mode on iOS.
	 *
	 * <b>Note:</b> This flag is only available if the Safari browser was detected. Furthermore, if this mode is detected,
	 * technically not a standard Safari is used. There might be slight differences in behavior and detection, e.g.
	 * the availability of {@link sap.ui.Device.browser#version}.
	 *
	 * @name sap.ui.Device.browser#webview
	 * @type boolean
	 * @since 1.31.0
	 * @public
	 */
	/**
	 * If this flag is set to <code>true</code>, the Phantom JS browser is used.
	 *
	 * @name sap.ui.Device.browser#phantomJS
	 * @type boolean
	 * @private
	 */
	/**
	 * The version of the used Webkit engine, if available.
	 *
	 * @see sap.ui.Device.browser#webkit
	 * @name sap.ui.Device.browser#webkitVersion
	 * @type String
	 * @since 1.20.0
	 * @private
	 */
	/**
	 * If this flag is set to <code>true</code>, a browser featuring a Mozilla engine is used.
	 *
	 * @name sap.ui.Device.browser#mozilla
	 * @type boolean
	 * @since 1.20.0
	 * @public
	 */
	/**
	 * Internet Explorer browser name.
	 *
	 * @see sap.ui.Device.browser#name
	 * @name sap.ui.Device.browser.BROWSER#INTERNET_EXPLORER
	 * @public
	 */
	/**
	 * Edge browser name.
	 *
	 * @see sap.ui.Device.browser#name
	 * @name sap.ui.Device.browser.BROWSER#EDGE
	 * @since 1.28.0
	 * @public
	 */
	/**
	 * Firefox browser name.
	 *
	 * @see sap.ui.Device.browser#name
	 * @name sap.ui.Device.browser.BROWSER#FIREFOX
	 * @public
	 */
	/**
	 * Chrome browser name.
	 *
	 * @see sap.ui.Device.browser#name
	 * @name sap.ui.Device.browser.BROWSER#CHROME
	 * @public
	 */
	/**
	 * Safari browser name.
	 *
	 * @see sap.ui.Device.browser#name
	 * @name sap.ui.Device.browser.BROWSER#SAFARI
	 * @public
	 */
	/**
	 * Android stock browser name.
	 *
	 * @see sap.ui.Device.browser#name
	 * @alias sap.ui.Device.browser.BROWSER#ANDROID
	 * @public
	 */

	var BROWSER = {
		"INTERNET_EXPLORER": "ie",
		"EDGE": "ed",
		"FIREFOX": "ff",
		"CHROME": "cr",
		"SAFARI": "sf",
		"ANDROID": "an"
	};

	var ua = navigator.userAgent;

	/*!
	 * Taken from jQuery JavaScript Library v1.7.1
	 * http://jquery.com/
	 *
	 * Copyright 2011, John Resig
	 * Dual licensed under the MIT or GPL Version 2 licenses.
	 * http://jquery.org/license
	 *
	 * Includes Sizzle.js
	 * http://sizzlejs.com/
	 * Copyright 2011, The Dojo Foundation
	 * Released under the MIT, BSD, and GPL Licenses.
	 *
	 * Date: Mon Nov 21 21:11:03 2011 -0500
	 */
	function calcBrowser(customUa){
		var _ua = (customUa || ua).toLowerCase(); // use custom user-agent if given

		var rwebkit = /(webkit)[ \/]([\w.]+)/;
		var ropera = /(opera)(?:.*version)?[ \/]([\w.]+)/;
		var rmsie = /(msie) ([\w.]+)/;
		var rmsie11 = /(trident)\/[\w.]+;.*rv:([\w.]+)/;
		var redge = /(edge)[ \/]([\w.]+)/;
		var rmozilla = /(mozilla)(?:.*? rv:([\w.]+))?/;

		// WinPhone IE11 and MS Edge userAgents contain "WebKit" and "Mozilla" and therefore must be checked first
		var browserMatch = redge.exec( _ua ) ||
					rmsie11.exec( _ua ) ||
					rwebkit.exec( _ua ) ||
					ropera.exec( _ua ) ||
					rmsie.exec( _ua ) ||
					_ua.indexOf("compatible") < 0 && rmozilla.exec( _ua ) ||
					[];

		var res = { browser: browserMatch[1] || "", version: browserMatch[2] || "0" };
		res[res.browser] = true;
		return res;
	}

	function getBrowser(customUa, customNav) {
		var b = calcBrowser(customUa);
		var _ua = customUa || ua;
		var _navigator = customNav || window.navigator;

		// jQuery checks for user agent strings. We differentiate between browsers
		var oExpMobile;
		if ( b.mozilla ) {
			oExpMobile = /Mobile/;
			if ( _ua.match(/Firefox\/(\d+\.\d+)/) ) {
				var version = parseFloat(RegExp.$1);
				return {
					name: BROWSER.FIREFOX,
					versionStr: "" + version,
					version: version,
					mozilla: true,
					mobile: oExpMobile.test(_ua)
				};
			} else {
				// unknown mozilla browser
				return {
					mobile: oExpMobile.test(_ua),
					mozilla: true,
					version: -1
				};
			}
		} else if ( b.webkit ) {
			// webkit version is needed for calculation if the mobile android device is a tablet (calculation of other mobile devices work without)
			var regExpWebkitVersion = _ua.toLowerCase().match(/webkit[\/]([\d.]+)/);
			var webkitVersion;
			if (regExpWebkitVersion) {
				webkitVersion = regExpWebkitVersion[1];
			}
			oExpMobile = /Mobile/;
			if ( _ua.match(/(Chrome|CriOS)\/(\d+\.\d+).\d+/)) {
				var version = parseFloat(RegExp.$2);
				return {
					name: BROWSER.CHROME,
					versionStr: "" + version,
					version: version,
					mobile: oExpMobile.test(_ua),
					webkit: true,
					webkitVersion: webkitVersion
				};
			} else if ( _ua.match(/FxiOS\/(\d+\.\d+)/)) {
				var version = parseFloat(RegExp.$1);
				return {
					name: BROWSER.FIREFOX,
					versionStr: "" + version,
					version: version,
					mobile: true,
					webkit: true,
					webkitVersion: webkitVersion
				};
			} else if ( _ua.match(/Android .+ Version\/(\d+\.\d+)/) ) {
				var version = parseFloat(RegExp.$1);
				return {
					name: BROWSER.ANDROID,
					versionStr: "" + version,
					version: version,
					mobile: oExpMobile.test(_ua),
					webkit: true,
					webkitVersion: webkitVersion
				};
			} else { // Safari might have an issue with _ua.match(...); thus changing
				var oExp = /(Version|PhantomJS)\/(\d+\.\d+).*Safari/;
				var bStandalone = _navigator.standalone;
				if (oExp.test(_ua)) {
					var aParts = oExp.exec(_ua);
					var version = parseFloat(aParts[2]);
					return {
						name: BROWSER.SAFARI,
						versionStr: "" + version,
						fullscreen: false,
						webview: false,
						version: version,
						mobile: oExpMobile.test(_ua),
						webkit: true,
						webkitVersion: webkitVersion,
						phantomJS: aParts[1] === "PhantomJS"
					};
				} else if (/iPhone|iPad|iPod/.test(_ua) && !(/CriOS/.test(_ua)) && !(/FxiOS/.test(_ua)) && (bStandalone === true || bStandalone === false)) {
					//WebView or Standalone mode on iOS
					return {
						name: BROWSER.SAFARI,
						version: -1,
						fullscreen: bStandalone,
						webview: !bStandalone,
						mobile: oExpMobile.test(_ua),
						webkit: true,
						webkitVersion: webkitVersion
					};
				} else { // other webkit based browser
					return {
						mobile: oExpMobile.test(_ua),
						webkit: true,
						webkitVersion: webkitVersion,
						version: -1
					};
				}
			}
		} else if ( b.msie || b.trident ) {
			var version;
			// recognize IE8 when running in compat mode (only then the documentMode property is there)
			if (document.documentMode && !customUa) { // only use the actual documentMode when no custom user-agent was given
				if (document.documentMode === 7) { // OK, obviously we are IE and seem to be 7... but as documentMode is there this cannot be IE7!
					version = 8.0;
				} else {
					version = parseFloat(document.documentMode);
				}
			} else {
				version = parseFloat(b.version);
			}
			return {
				name: BROWSER.INTERNET_EXPLORER,
				versionStr: "" + version,
				version: version,
				msie: true,
				mobile: false // TODO: really?
			};
		} else if ( b.edge ) {
			var version = version = parseFloat(b.version);
			return {
				name: BROWSER.EDGE,
				versionStr: "" + version,
				version: version,
				edge: true
			};
		}
		return {
			name: "",
			versionStr: "",
			version: -1,
			mobile: false
		};
	}
	device._testUserAgent = getBrowser; // expose the user-agent parsing (mainly for testing), but don't let it be overwritten

	function setBrowser() {
		device.browser = getBrowser();
		device.browser.BROWSER = BROWSER;

		if (device.browser.name) {
			for (var b in BROWSER) {
				if (BROWSER[b] === device.browser.name) {
					device.browser[b.toLowerCase()] = true;
				}
			}
		}
	}
	setBrowser();




//******** Support Detection ********

	/**
	 * Contains information about detected capabilities of the used browser or device.
	 *
	 * @namespace
	 * @name sap.ui.Device.support
	 * @public
	 */

	/**
	 * If this flag is set to <code>true</code>, the used browser supports touch events.
	 *
	 * <b>Note:</b> This flag indicates whether the used browser supports touch events or not.
	 * This does not necessarily mean that the used device has a touchable screen.
	 *
	 * @name sap.ui.Device.support#touch
	 * @type boolean
	 * @public
	 */
	/**
	 * If this flag is set to <code>true</code>, the used browser supports pointer events.
	 *
	 * @name sap.ui.Device.support#pointer
	 * @type boolean
	 * @public
	 */
	/**
	 * If this flag is set to <code>true</code>, the used browser natively supports media queries via JavaScript.
	 *
	 * <b>Note:</b> The {@link sap.ui.Device.media media queries API} of the device API can also be used when there is no native support.
	 *
	 * @name sap.ui.Device.support#matchmedia
	 * @type boolean
	 * @public
	 */
	/**
	 * If this flag is set to <code>true</code>, the used browser natively supports events of media queries via JavaScript.
	 *
	 * <b>Note:</b> The {@link sap.ui.Device.media media queries API} of the device API can also be used when there is no native support.
	 *
	 * @name sap.ui.Device.support#matchmedialistener
	 * @type boolean
	 * @public
	 */
	/**
	 * If this flag is set to <code>true</code>, the used browser natively supports the <code>orientationchange</code> event.
	 *
	 * <b>Note:</b> The {@link sap.ui.Device.orientation orientation event} of the device API can also be used when there is no native support.
	 *
	 * @name sap.ui.Device.support#orientation
	 * @type boolean
	 * @public
	 */
	/**
	 * If this flag is set to <code>true</code>, the device has a display with a high resolution.
	 *
	 * @name sap.ui.Device.support#retina
	 * @type boolean
	 * @public
	 */
	/**
	 * If this flag is set to <code>true</code>, the used browser supports web sockets.
	 *
	 * @name sap.ui.Device.support#websocket
	 * @type boolean
	 * @public
	 */
	/**
	 * If this flag is set to <code>true</code>, the used browser supports the <code>placeholder</code> attribute on <code>input</code> elements.
	 *
	 * @name sap.ui.Device.support#input.placeholder
	 * @type boolean
	 * @public
	 */

	device.support = {};

	//Maybe better to but this on device.browser because there are cases that a browser can touch but a device can't!
	device.support.touch = !!(('ontouchstart' in window) || window.DocumentTouch && document instanceof window.DocumentTouch);

	// FIXME: PhantomJS doesn't support touch events but exposes itself as touch
	//        enabled browser. Therfore we manually override that in jQuery.support!
	//        This has been tested with PhantomJS 1.9.7 and 2.0.0!
	if (device.browser.phantomJS) {
		device.support.touch = false;
	}

	device.support.pointer = !!window.PointerEvent;

	device.support.matchmedia = !!window.matchMedia;
	var m = device.support.matchmedia ? window.matchMedia("all and (max-width:0px)") : null; //IE10 doesn't like empty string as argument for matchMedia, FF returns null when running within an iframe with display:none
	device.support.matchmedialistener = !!(m && m.addListener);
	if (device.browser.safari && device.browser.version < 6 && !device.browser.fullscreen && !device.browser.webview) {
		//Safari seems to have addListener but no events are fired ?!
		device.support.matchmedialistener = false;
	}

	device.support.orientation = !!("orientation" in window && "onorientationchange" in window);

	device.support.retina = (window.retina || window.devicePixelRatio >= 2);

	device.support.websocket = ('WebSocket' in window);

	device.support.input = {};
	device.support.input.placeholder = ('placeholder' in document.createElement("input"));

//******** Match Media ********

	/**
	 * Event API for screen width changes.
	 *
	 * This API is based on media queries but can also be used if media queries are not natively supported by the used browser.
	 * In this case, the behavior of media queries is simulated by this API.
	 *
	 * There are several predefined {@link sap.ui.Device.media.RANGESETS range sets} available. Each of them defines a
	 * set of intervals for the screen width (from small to large). Whenever the screen width changes and the current screen width is in
	 * a different interval to the one before the change, the registered event handlers for the range set are called.
	 *
	 * If needed, it is also possible to define a custom set of intervals.
	 *
	 * The following example shows a typical use case:
	 * <pre>
	 * function sizeChanged(mParams) {
	 *     switch(mParams.name) {
	 *         case "Phone":
	 *             // Do what is needed for a little screen
	 *             break;
	 *         case "Tablet":
	 *             // Do what is needed for a medium sized screen
	 *             break;
	 *         case "Desktop":
	 *             // Do what is needed for a large screen
	 *     }
	 * }
	 *
	 * // Register an event handler to changes of the screen size
	 * sap.ui.Device.media.attachHandler(sizeChanged, null, sap.ui.Device.media.RANGESETS.SAP_STANDARD);
	 * // Do some initialization work based on the current size
	 * sizeChanged(sap.ui.Device.media.getCurrentRange(sap.ui.Device.media.RANGESETS.SAP_STANDARD));
	 * </pre>
	 *
	 * @namespace
	 * @name sap.ui.Device.media
	 * @public
	 */
	device.media = {};

	/**
	 * Enumeration containing the names and settings of predefined screen width media query range sets.
	 *
	 * @namespace
	 * @name sap.ui.Device.media.RANGESETS
	 * @public
	 */

	/**
	 * A 3-step range set (S-L).
	 *
	 * The ranges of this set are:
	 * <ul>
	 * <li><code>"S"</code>: For screens smaller than 520 pixels.</li>
	 * <li><code>"M"</code>: For screens greater than or equal to 520 pixels and smaller than 960 pixels.</li>
	 * <li><code>"L"</code>: For screens greater than or equal to 960 pixels.</li>
	 * </ul>
	 *
	 * To use this range set, you must initialize it explicitly ({@link sap.ui.Device.media.html#initRangeSet}).
	 *
	 * If this range set is initialized, a CSS class is added to the page root (<code>html</code> tag) which indicates the current
	 * screen width range: <code>sapUiMedia-3Step-<i>NAME_OF_THE_INTERVAL</i></code>.
	 *
	 * @name sap.ui.Device.media.RANGESETS#SAP_3STEPS
	 * @public
	 */
	/**
	 * A 4-step range set (S-XL).
	 *
	 * The ranges of this set are:
	 * <ul>
	 * <li><code>"S"</code>: For screens smaller than 520 pixels.</li>
	 * <li><code>"M"</code>: For screens greater than or equal to 520 pixels and smaller than 760 pixels.</li>
	 * <li><code>"L"</code>: For screens greater than or equal to 760 pixels and smaller than 960 pixels.</li>
	 * <li><code>"XL"</code>: For screens greater than or equal to 960 pixels.</li>
	 * </ul>
	 *
	 * To use this range set, you must initialize it explicitly ({@link sap.ui.Device.media.html#initRangeSet}).
	 *
	 * If this range set is initialized, a CSS class is added to the page root (<code>html</code> tag) which indicates the current
	 * screen width range: <code>sapUiMedia-4Step-<i>NAME_OF_THE_INTERVAL</i></code>.
	 *
	 * @name sap.ui.Device.media.RANGESETS#SAP_4STEPS
	 * @public
	 */
	/**
	 * A 6-step range set (XS-XXL).
	 *
	 * The ranges of this set are:
	 * <ul>
	 * <li><code>"XS"</code>: For screens smaller than 241 pixels.</li>
	 * <li><code>"S"</code>: For screens greater than or equal to 241 pixels and smaller than 400 pixels.</li>
	 * <li><code>"M"</code>: For screens greater than or equal to 400 pixels and smaller than 541 pixels.</li>
	 * <li><code>"L"</code>: For screens greater than or equal to 541 pixels and smaller than 768 pixels.</li>
	 * <li><code>"XL"</code>: For screens greater than or equal to 768 pixels and smaller than 960 pixels.</li>
	 * <li><code>"XXL"</code>: For screens greater than or equal to 960 pixels.</li>
	 * </ul>
	 *
	 * To use this range set, you must initialize it explicitly ({@link sap.ui.Device.media.html#initRangeSet}).
	 *
	 * If this range set is initialized, a CSS class is added to the page root (<code>html</code> tag) which indicates the current
	 * screen width range: <code>sapUiMedia-6Step-<i>NAME_OF_THE_INTERVAL</i></code>.
	 *
	 * @name sap.ui.Device.media.RANGESETS#SAP_6STEPS
	 * @public
	 */
	/**
	 * A 3-step range set (Phone, Tablet, Desktop).
	 *
	 * The ranges of this set are:
	 * <ul>
	 * <li><code>"Phone"</code>: For screens smaller than 600 pixels.</li>
	 * <li><code>"Tablet"</code>: For screens greater than or equal to 600 pixels and smaller than 1024 pixels.</li>
	 * <li><code>"Desktop"</code>: For screens greater than or equal to 1024 pixels.</li>
	 * </ul>
	 *
	 * This range set is initialized by default. An initialization via {@link sap.ui.Device.media.html#initRangeSet} is not needed.
	 *
	 * A CSS class is added to the page root (<code>html</code> tag) which indicates the current
	 * screen width range: <code>sapUiMedia-Std-<i>NAME_OF_THE_INTERVAL</i></code>.
	 * Furthermore there are 5 additional CSS classes to hide elements based on the width of the screen:
	 * <ul>
	 * <li><code>sapUiHideOnPhone</code>: Will be hidden if the screen has 600px or more</li>
	 * <li><code>sapUiHideOnTablet</code>: Will be hidden if the screen has less than 600px or more than 1023px</li>
	 * <li><code>sapUiHideOnDesktop</code>: Will be hidden if the screen is smaller than 1024px</li>
	 * <li><code>sapUiVisibleOnlyOnPhone</code>: Will be visible if the screen has less than 600px</li>
	 * <li><code>sapUiVisibleOnlyOnTablet</code>: Will be visible if the screen has 600px or more but less than 1024px</li>
	 * <li><code>sapUiVisibleOnlyOnDesktop</code>: Will be visible if the screen has 1024px or more</li>
	 * </ul>
	 *
	 * @name sap.ui.Device.media.RANGESETS#SAP_STANDARD
	 * @public
	 */

	/**
	 * A 4-step range set (Phone, Tablet, Desktop, LargeDesktop).
	 *
	 * The ranges of this set are:
	 * <ul>
	 * <li><code>"Phone"</code>: For screens smaller than 600 pixels.</li>
	 * <li><code>"Tablet"</code>: For screens greater than or equal to 600 pixels and smaller than 1024 pixels.</li>
	 * <li><code>"Desktop"</code>: For screens greater than or equal to 1024 pixels and smaller than 1440 pixels.</li>
	 * <li><code>"LargeDesktop"</code>: For screens greater than or equal to 1440 pixels.</li>
	 * </ul>
	 *
	 * This range set is initialized by default. An initialization via {@link sap.ui.Device.media.html#initRangeSet} is not needed.
	 *
	 * A CSS class is added to the page root (<code>html</code> tag) which indicates the current
	 * screen width range: <code>sapUiMedia-StdExt-<i>NAME_OF_THE_INTERVAL</i></code>.
	 *
	 * @name sap.ui.Device.media.RANGESETS#SAP_STANDARD_EXTENDED
	 * @public
	 */

	var RANGESETS = {
		"SAP_3STEPS": "3Step",
		"SAP_4STEPS": "4Step",
		"SAP_6STEPS": "6Step",
		"SAP_STANDARD": "Std",
		"SAP_STANDARD_EXTENDED": "StdExt"
	};
	device.media.RANGESETS = RANGESETS;
	device.media._predefinedRangeSets = {};
	device.media._predefinedRangeSets[RANGESETS.SAP_3STEPS] = {points: [520, 960], unit: "px", name: RANGESETS.SAP_3STEPS, names: ["S", "M", "L"]};
	device.media._predefinedRangeSets[RANGESETS.SAP_4STEPS] = {points: [520, 760, 960], unit: "px", name: RANGESETS.SAP_4STEPS, names: ["S", "M", "L", "XL"]};
	device.media._predefinedRangeSets[RANGESETS.SAP_6STEPS] = {points: [241, 400, 541, 768, 960], unit: "px", name: RANGESETS.SAP_6STEPS, names: ["XS", "S", "M", "L", "XL", "XXL"]};
	device.media._predefinedRangeSets[RANGESETS.SAP_STANDARD] = {points: [600, 1024], unit: "px", name: RANGESETS.SAP_STANDARD, names: ["Phone", "Tablet", "Desktop"]};
	device.media._predefinedRangeSets[RANGESETS.SAP_STANDARD_EXTENDED] = {points: [600, 1024, 1440], unit: "px", name: RANGESETS.SAP_STANDARD_EXTENDED, names: ["Phone", "Tablet", "Desktop", "LargeDesktop"]};
	var _defaultRangeSet = RANGESETS.SAP_STANDARD;
	var media_timeout = device.support.matchmedialistener ? 0 : 100;
	var _querysets = {};
	var media_currentwidth = null;

	function getQuery(from, to, unit){
		unit = unit || "px";
		var q = "all";
		if (from > 0) {
			q = q + " and (min-width:" + from + unit + ")";
		}
		if (to > 0) {
			q = q + " and (max-width:" + to + unit + ")";
		}
		return q;
	}

	function handleChange(name){
		if (!device.support.matchmedialistener && media_currentwidth == windowSize()[0]) {
			return; //Skip unnecessary resize events
		}

		if (_querysets[name].timer) {
			clearTimeout(_querysets[name].timer);
			_querysets[name].timer = null;
		}

		_querysets[name].timer = setTimeout(function() {
			var mParams = checkQueries(name, false);
			if (mParams) {
				fireEvent("media_" + name, mParams);
			}
		}, media_timeout);
	}

	function getRangeInfo(sSetName, iRangeIdx){
		var q = _querysets[sSetName].queries[iRangeIdx];
		var info = {from: q.from, unit: _querysets[sSetName].unit};
		if (q.to >= 0) {
			info.to = q.to;
		}
		if (_querysets[sSetName].names) {
			info.name = _querysets[sSetName].names[iRangeIdx];
		}
		return info;
	}

	function checkQueries(name, infoOnly){
		if (_querysets[name]) {
			var aQueries = _querysets[name].queries;
			var info = null;
			for (var i = 0, len = aQueries.length; i < len; i++) {
				var q = aQueries[i];
				if ((q != _querysets[name].currentquery || infoOnly) && device.media.matches(q.from, q.to, _querysets[name].unit)) {
					if (!infoOnly) {
						_querysets[name].currentquery = q;
					}
					if (!_querysets[name].noClasses && _querysets[name].names && !infoOnly) {
						refreshCSSClasses(name, _querysets[name].names[i]);
					}
					info = getRangeInfo(name, i);
				}
			}

			return info;
		}
		logger.log(WARNING, "No queryset with name " + name + " found", 'DEVICE.MEDIA');
		return null;
	}

	function refreshCSSClasses(sSetName, sRangeName, bRemove){
		 var sClassPrefix = "sapUiMedia-" + sSetName + "-";
		 changeRootCSSClass(sClassPrefix + sRangeName, bRemove, sClassPrefix);
	}

	function changeRootCSSClass(sClassName, bRemove, sPrefix){
		var oRoot = document.documentElement;
		if (oRoot.className.length == 0) {
			if (!bRemove) {
				oRoot.className = sClassName;
			}
		} else {
			var aCurrentClasses = oRoot.className.split(" ");
			var sNewClasses = "";
			for (var i = 0; i < aCurrentClasses.length; i++) {
				if ((sPrefix && aCurrentClasses[i].indexOf(sPrefix) != 0) || (!sPrefix && aCurrentClasses[i] != sClassName)) {
					sNewClasses = sNewClasses + aCurrentClasses[i] + " ";
				}
			}
			if (!bRemove) {
				sNewClasses = sNewClasses + sClassName;
			}
			oRoot.className = sNewClasses;
		}
	}

	function windowSize(){
		return [document.documentElement.clientWidth, document.documentElement.clientHeight];
	}

	function convertToPx(val, unit){
		if (unit === "em" || unit === "rem") {
			var s = window.getComputedStyle || function(e) {
					return e.currentStyle;
				};
				var x = s(document.documentElement).fontSize;
				var f = (x && x.indexOf("px") >= 0) ? parseFloat(x, 10) : 16;
				return val * f;
		}
		return val;
	}

	function match_legacy(from, to, unit){
		from = convertToPx(from, unit);
		to = convertToPx(to, unit);

		var width = windowSize()[0];
		var a = from < 0 || from <= width;
		var b = to < 0 || width <= to;
		return a && b;
	}

	function match(from, to, unit){
		var q = getQuery(from, to, unit);
		var mm = window.matchMedia(q); //FF returns null when running within an iframe with display:none
		return mm && mm.matches;
	}

	device.media.matches = device.support.matchmedia ? match : match_legacy;

	/**
	 * Registers the given event handler to change events of the screen width based on the range set with the specified name.
	 *
	 * The event is fired whenever the screen width changes and the current screen width is in
	 * a different interval of the given range set than before the width change.
	 *
	 * The event handler is called with a single argument: a map <code>mParams</code> which provides the following information
	 * about the entered interval:
	 * <ul>
	 * <li><code>mParams.from</code>: The start value (inclusive) of the entered interval as a number</li>
	 * <li><code>mParams.to</code>: The end value (exclusive) range of the entered interval as a number or undefined for the last interval (infinity)</li>
	 * <li><code>mParams.unit</code>: The unit used for the values above, e.g. <code>"px"</code></li>
	 * <li><code>mParams.name</code>: The name of the entered interval, if available</li>
	 * </ul>
	 *
	 * @param {function}
	 *            fnFunction The handler function to call when the event occurs. This function will be called in the context of the
	 *                       <code>oListener</code> instance (if present) or on the <code>window</code> instance. A map with information
	 *                       about the entered range set is provided as a single argument to the handler (see details above).
	 * @param {object}
	 *            [oListener] The object that wants to be notified when the event occurs (<code>this</code> context within the
	 *                        handler function). If it is not specified, the handler function is called in the context of the <code>window</code>.
	 * @param {String}
	 *            sName The name of the range set to listen to. The range set must be initialized beforehand
	 *                  ({@link sap.ui.Device.media.html#initRangeSet}). If no name is provided, the
	 *                  {@link sap.ui.Device.media.RANGESETS.SAP_STANDARD default range set} is used.
	 *
	 * @name sap.ui.Device.media#attachHandler
	 * @function
	 * @public
	 */
	device.media.attachHandler = function(fnFunction, oListener, sName){
		var name = sName || _defaultRangeSet;
		attachEvent("media_" + name, fnFunction, oListener);
	};

	/**
	 * Removes a previously attached event handler from the change events of the screen width.
	 *
	 * The passed parameters must match those used for registration with {@link #attachHandler} beforehand.
	 *
	 * @param {function}
	 *            fnFunction The handler function to detach from the event
	 * @param {object}
	 *            [oListener] The object that wanted to be notified when the event occurred
	 * @param {String}
	 *             sName The name of the range set to listen to. If no name is provided, the
	 *                   {@link sap.ui.Device.media.RANGESETS.SAP_STANDARD default range set} is used.
	 *
	 * @name sap.ui.Device.media#detachHandler
	 * @function
	 * @public
	 */
	device.media.detachHandler = function(fnFunction, oListener, sName){
		var name = sName || _defaultRangeSet;
		detachEvent("media_" + name, fnFunction, oListener);
	};

	/**
	 * Initializes a screen width media query range set.
	 *
	 * This initialization step makes the range set ready to be used for one of the other functions in namespace <code>sap.ui.Device.media</code>.
	 * The most important {@link sap.ui.Device.media.RANGESETS predefined range sets} are initialized automatically.
	 *
	 * To make a not yet initialized {@link sap.ui.Device.media.RANGESETS predefined range set} ready to be used, call this function with the
	 * name of the range set to be initialized:
	 * <pre>
	 * sap.ui.Device.media.initRangeSet(sap.ui.Device.media.RANGESETS.SAP_3STEPS);
	 * </pre>
	 *
	 * Alternatively it is possible to define custom range sets as shown in the following example:
	 * <pre>
	 * sap.ui.Device.media.initRangeSet("MyRangeSet", [200, 400], "px", ["Small", "Medium", "Large"]);
	 * </pre>
	 * This example defines the following named ranges:
	 * <ul>
	 * <li><code>"Small"</code>: For screens smaller than 200 pixels.</li>
	 * <li><code>"Medium"</code>: For screens greater than or equal to 200 pixels and smaller than 400 pixels.</li>
	 * <li><code>"Large"</code>: For screens greater than or equal to 400 pixels.</li>
	 * </ul>
	 * The range names are optional. If they are specified a CSS class (e.g. <code>sapUiMedia-MyRangeSet-Small</code>) is also
	 * added to the document root depending on the current active range. This can be suppressed via parameter <code>bSuppressClasses</code>.
	 *
	 * @param {String}
	 *             sName The name of the range set to be initialized - either a {@link sap.ui.Device.media.RANGESETS predefined} or custom one.
	 *                   The name must be a valid id and consist only of letters and numeric digits.
	 * @param {int[]}
	 *             [aRangeBorders] The range borders
	 * @param {String}
	 *             [sUnit] The unit which should be used for the values given in <code>aRangeBorders</code>.
	 *                     The allowed values are <code>"px"</code> (default), <code>"em"</code> or <code>"rem"</code>
	 * @param {String[]}
	 *             [aRangeNames] The names of the ranges. The names must be a valid id and consist only of letters and digits. If names
	 *             are specified, CSS classes are also added to the document root as described above. This behavior can be
	 *             switched off explicitly by using <code>bSuppressClasses</code>. <b>Note:</b> <code>aRangeBorders</code> with <code>n</code> entries
	 *             define <code>n+1</code> ranges. Therefore <code>n+1</code> names must be provided.
	 * @param {boolean}
	 *             [bSuppressClasses] Whether or not writing of CSS classes to the document root should be suppressed when
	 *             <code>aRangeNames</code> are provided
	 *
	 * @name sap.ui.Device.media#initRangeSet
	 * @function
	 * @public
	 */
	device.media.initRangeSet = function(sName, aRangeBorders, sUnit, aRangeNames, bSuppressClasses){
		//TODO Do some Assertions and parameter checking
		var oConfig;
		if (!sName) {
			oConfig = device.media._predefinedRangeSets[_defaultRangeSet];
		} else if (sName && device.media._predefinedRangeSets[sName]) {
			oConfig = device.media._predefinedRangeSets[sName];
		} else {
			oConfig = {name: sName, unit: (sUnit || "px").toLowerCase(), points: aRangeBorders || [], names: aRangeNames, noClasses: !!bSuppressClasses};
		}

		if (device.media.hasRangeSet(oConfig.name)) {
			logger.log(INFO, "Range set " + oConfig.name + " hase already been initialized", 'DEVICE.MEDIA');
			return;
		}

		sName = oConfig.name;
		oConfig.queries = [];
		oConfig.timer = null;
		oConfig.currentquery = null;
		oConfig.listener = function(){
			return handleChange(sName);
		};

		var from, to, query;
		var aPoints = oConfig.points;
		for (var i = 0, len = aPoints.length; i <= len; i++) {
			from = (i == 0) ? 0 : aPoints[i - 1];
			to = (i == aPoints.length) ? -1 : aPoints[i];
			query = getQuery(from, to, oConfig.unit);
			oConfig.queries.push({
				query: query,
				from: from,
				to: to
			});
		}

		if (oConfig.names && oConfig.names.length != oConfig.queries.length) {
			oConfig.names = null;
		}

		_querysets[oConfig.name] = oConfig;

		if (device.support.matchmedialistener) { //FF, Safari, Chrome, IE10?
			var queries = oConfig.queries;
			for (var i = 0; i < queries.length; i++) {
				var q = queries[i];
				q.media = window.matchMedia(q.query);
				q.media.addListener(oConfig.listener);
			}
		} else { //IE, Safari (<6?)
			if (window.addEventListener) {
				window.addEventListener("resize", oConfig.listener, false);
				window.addEventListener("orientationchange", oConfig.listener, false);
			} else { //IE8
				window.attachEvent("onresize", oConfig.listener);
			}
		}

		oConfig.listener();
	};

	/**
	 * Returns information about the current active range of the range set with the given name.
	 *
	 * @param {String} sName The name of the range set. The range set must be initialized beforehand ({@link sap.ui.Device.media.html#initRangeSet})
	 *
	 * @name sap.ui.Device.media#getCurrentRange
	 * @return {map} Information about the current active interval of the range set. The returned map has the same structure as the argument of the event handlers ({link sap.ui.Device.media#attachHandler})
	 * @function
	 * @public
	 */
	device.media.getCurrentRange = function(sName){
		if (!device.media.hasRangeSet(sName)) {
			return null;
		}
		return checkQueries(sName, true);
	};

	/**
	 * Returns <code>true</code> if a range set with the given name is already initialized.
	 *
	 * @param {String} sName The name of the range set.
	 *
	 * @name sap.ui.Device.media#hasRangeSet
	 * @return {boolean} Returns <code>true</code> if a range set with the given name is already initialized
	 * @function
	 * @public
	 */
	device.media.hasRangeSet = function(sName){
		return sName && !!_querysets[sName];
	};

	/**
	 * Removes a previously initialized range set and detaches all registered handlers.
	 *
	 * Only custom range sets can be removed via this function. Initialized predefined range sets
	 * ({@link sap.ui.Device.media#RANGESETS}) cannot be removed.
	 *
	 * @param {String} sName The name of the range set which should be removed.
	 *
	 * @name sap.ui.Device.media#removeRangeSet
	 * @function
	 * @protected
	 */
	device.media.removeRangeSet = function(sName){
		if (!device.media.hasRangeSet(sName)) {
			logger.log(INFO, "RangeSet " + sName + " not found, thus could not be removed.", 'DEVICE.MEDIA');
			return;
		}

		for (var x in RANGESETS) {
			if (sName === RANGESETS[x]) {
				logger.log(WARNING, "Cannot remove default rangeset - no action taken.", 'DEVICE.MEDIA');
				return;
			}
		}

		var oConfig = _querysets[sName];
		if (device.support.matchmedialistener) { //FF, Safari, Chrome, IE10?
			var queries = oConfig.queries;
			for (var i = 0; i < queries.length; i++) {
				queries[i].media.removeListener(oConfig.listener);
			}
		} else { //IE, Safari (<6?)
			if (window.removeEventListener) {
				window.removeEventListener("resize", oConfig.listener, false);
				window.removeEventListener("orientationchange", oConfig.listener, false);
			} else { //IE8
				window.detachEvent("onresize", oConfig.listener);
			}
		}

		refreshCSSClasses(sName, "", true);
		delete mEventRegistry["media_" + sName];
		delete _querysets[sName];
	};

//******** System Detection ********

	/**
	 * Provides a basic categorization of the used device based on various indicators.
	 *
	 * These indicators are for example the support of touch events, the screen size, the used operation system or
	 * the user agent of the browser.
	 *
	 * <b>Note:</b> Depending on the capabilities of the device it is also possible that multiple flags are set to <code>true</code>.
	 *
	 * @namespace
	 * @name sap.ui.Device.system
	 * @public
	 */
	/**
	 * If this flag is set to <code>true</code>, the device is recognized as a tablet.
	 *
	 * Furthermore, a CSS class <code>sap-tablet</code> is added to the document root element.
	 *
	 * @name sap.ui.Device.system#tablet
	 * @type boolean
	 * @public
	 */
	/**
	 * If this flag is set to <code>true</code>, the device is recognized as a phone.
	 *
	 * Furthermore, a CSS class <code>sap-phone</code> is added to the document root element.
	 *
	 * @name sap.ui.Device.system#phone
	 * @type boolean
	 * @public
	 */
	/**
	 * If this flag is set to <code>true</code>, the device is recognized as a desktop system.
	 *
	 * Furthermore, a CSS class <code>sap-desktop</code> is added to the document root element.
	 *
	 * @name sap.ui.Device.system#desktop
	 * @type boolean
	 * @public
	 */
	/**
	 * If this flag is set to <code>true</code>, the device is recognized as a combination of a desktop system and tablet.
	 *
	 * Furthermore, a CSS class <code>sap-combi</code> is added to the document root element.
	 *
	 * <b>Note:</b> This property is mainly for Microsoft Windows 8 (and following) devices where the mouse and touch event may be supported
	 * natively by the browser being used. This property is set to <code>true</code> only when both mouse and touch event are natively supported.
	 *
	 * @alias sap.ui.Device.system#combi
	 * @type boolean
	 * @public
	 */
	/**
	 * Enumeration containing the names of known types of the devices.
	 *
	 * @namespace
	 * @name sap.ui.Device.system.SYSTEMTYPE
	 * @private
	 */

	var SYSTEMTYPE = {
			"TABLET" : "tablet",
			"PHONE" : "phone",
			"DESKTOP" : "desktop",
			"COMBI" : "combi"
	};

	device.system = {};

	function getSystem(_simMobileOnDesktop, customUA) {
		var t = isTablet(customUA);
		var isWin8Upwards = device.os.windows && device.os.version >= 8;
		var isWin7 = device.os.windows && device.os.version === 7;

		var s = {};
		s.tablet = !!(((device.support.touch && !isWin7) || isWin8Upwards || !!_simMobileOnDesktop) && t);
		s.phone = !!(device.os.windows_phone || ((device.support.touch && !isWin7) || !!_simMobileOnDesktop) && !t);
		s.desktop = !!((!s.tablet && !s.phone) || isWin8Upwards || isWin7);
		s.combi = !!(s.desktop && s.tablet);
		s.SYSTEMTYPE = SYSTEMTYPE;

		for (var type in SYSTEMTYPE) {
			changeRootCSSClass("sap-" + SYSTEMTYPE[type], !s[SYSTEMTYPE[type]]);
		}
		return s;
	}

	function isTablet(customUA) {
		var ua = customUA || navigator.userAgent;
		var isWin8Upwards = device.os.windows && device.os.version >= 8;
		if (device.os.name === device.os.OS.IOS) {
			return /ipad/i.test(ua);
		} else {
			//in real mobile device
			if (device.support.touch) {
				if (isWin8Upwards) {
					return true;
				}

				if (device.browser.chrome && device.os.android && device.os.version >= 4.4) {
					// From Android version 4.4, WebView also uses Chrome as Kernel.
					// We can use the user agent pattern defined in Chrome to do phone/tablet detection
					// According to the information here: https://developer.chrome.com/multidevice/user-agent#chrome_for_android_user_agent,
					//  the existence of "Mobile" indicates it's a phone. But because the crosswalk framework which is used in Fiori Client
					//  inserts another "Mobile" to the user agent for both tablet and phone, we need to check whether "Mobile Safari/<Webkit Rev>" exists.
					return !/Mobile Safari\/[.0-9]+/.test(ua);
				} else {
					var densityFactor = window.devicePixelRatio ? window.devicePixelRatio : 1; // may be undefined in Windows Phone devices
					// On Android sometimes window.screen.width returns the logical CSS pixels, sometimes the physical device pixels;
					// Tests on multiple devices suggest this depends on the Webkit version.
					// The Webkit patch which changed the behavior was done here: https://bugs.webkit.org/show_bug.cgi?id=106460
					// Chrome 27 with Webkit 537.36 returns the logical pixels,
					// Chrome 18 with Webkit 535.19 returns the physical pixels.
					// The BlackBerry 10 browser with Webkit 537.10+ returns the physical pixels.
					// So it appears like somewhere above Webkit 537.10 we do not hve to divide by the devicePixelRatio anymore.
					if (device.os.android && device.browser.webkit && (parseFloat(device.browser.webkitVersion) > 537.10)) {
						densityFactor = 1;
					}

					//this is how android distinguishes between tablet and phone
					//http://android-developers.blogspot.de/2011/07/new-tools-for-managing-screen-sizes.html
					var bTablet = (Math.min(window.screen.width / densityFactor, window.screen.height / densityFactor) >= 600);

					// special workaround for Nexus 7 where the window.screen.width is 600px or 601px in portrait mode (=> tablet)
					// but window.screen.height 552px in landscape mode (=> phone), because the browser UI takes some space on top.
					// So the detected device type depends on the orientation :-(
					// actually this is a Chrome bug, as "width"/"height" should return the entire screen's dimensions and
					// "availWidth"/"availHeight" should return the size available after subtracting the browser UI
					if (isLandscape()
							&& (window.screen.height === 552 || window.screen.height === 553) // old/new Nexus 7
							&& (/Nexus 7/i.test(ua))) {
						bTablet = true;
					}

					return bTablet;
				}

			} else {
				// This simple android phone detection can be used here because this is the mobile emulation mode in desktop browser
				var android_phone = (/(?=android)(?=.*mobile)/i.test(ua));
				// in desktop browser, it's detected as tablet when
				// 1. Windows 8 device with a touch screen where "Touch" is contained in the userAgent
				// 2. Android emulation and it's not an Android phone
				return (device.browser.msie && ua.indexOf("Touch") !== -1) || (device.os.android && !android_phone);
			}
		}
	}

	function setSystem(_simMobileOnDesktop, customUA) {
		device.system = getSystem(_simMobileOnDesktop, customUA);
		if (device.system.tablet || device.system.phone) {
			device.browser.mobile = true;
		}
	}
	setSystem();
	// expose the function for unit test
	device._getSystem = getSystem;

//******** Orientation Detection ********

	/**
	 * Common API for orientation change notifications across all platforms.
	 *
	 * For browsers or devices that do not provide native support for orientation change events
	 * the API simulates them based on the ratio of the document's width and height.
	 *
	 * @namespace
	 * @name sap.ui.Device.orientation
	 * @public
	 */
	/**
	 * If this flag is set to <code>true</code>, the screen is currently in portrait mode (the height is greater than the width).
	 *
	 * @name sap.ui.Device.orientation#portrait
	 * @type boolean
	 * @public
	 */
	/**
	 * If this flag is set to <code>true</code>, the screen is currently in landscape mode (the width is greater than the height).
	 *
	 * @name sap.ui.Device.orientation#landscape
	 * @type boolean
	 * @public
	 */

	device.orientation = {};

	/**
	 * Common API for document window size change notifications across all platforms.
	 *
	 * @namespace
	 * @name sap.ui.Device.resize
	 * @public
	 */
	/**
	 * The current height of the document's window in pixels.
	 *
	 * @name sap.ui.Device.resize#height
	 * @type integer
	 * @public
	 */
	/**
	 * The current width of the document's window in pixels.
	 *
	 * @name sap.ui.Device.resize#width
	 * @type integer
	 * @public
	 */

	device.resize = {};

	/**
	 * Registers the given event handler to orientation change events of the document's window.
	 *
	 * The event is fired whenever the screen orientation changes and the width of the document's window
	 * becomes greater than its height or the other way round.
	 *
	 * The event handler is called with a single argument: a map <code>mParams</code> which provides the following information:
	 * <ul>
	 * <li><code>mParams.landscape</code>: If this flag is set to <code>true</code>, the screen is currently in landscape mode, otherwise in portrait mode.</li>
	 * </ul>
	 *
	 * @param {function}
	 *            fnFunction The handler function to call when the event occurs. This function will be called in the context of the
	 *                       <code>oListener</code> instance (if present) or on the <code>window</code> instance. A map with information
	 *                       about the orientation is provided as a single argument to the handler (see details above).
	 * @param {object}
	 *            [oListener] The object that wants to be notified when the event occurs (<code>this</code> context within the
	 *                        handler function). If it is not specified, the handler function is called in the context of the <code>window</code>.
	 *
	 * @name sap.ui.Device.orientation#attachHandler
	 * @function
	 * @public
	 */
	device.orientation.attachHandler = function(fnFunction, oListener){
		attachEvent("orientation", fnFunction, oListener);
	};

	/**
	 * Registers the given event handler to resize change events of the document's window.
	 *
	 * The event is fired whenever the document's window size changes.
	 *
	 * The event handler is called with a single argument: a map <code>mParams</code> which provides the following information:
	 * <ul>
	 * <li><code>mParams.height</code>: The height of the document's window in pixels.</li>
	 * <li><code>mParams.width</code>: The width of the document's window in pixels.</li>
	 * </ul>
	 *
	 * @param {function}
	 *            fnFunction The handler function to call when the event occurs. This function will be called in the context of the
	 *                       <code>oListener</code> instance (if present) or on the <code>window</code> instance. A map with information
	 *                       about the size is provided as a single argument to the handler (see details above).
	 * @param {object}
	 *            [oListener] The object that wants to be notified when the event occurs (<code>this</code> context within the
	 *                        handler function). If it is not specified, the handler function is called in the context of the <code>window</code>.
	 *
	 * @name sap.ui.Device.resize#attachHandler
	 * @function
	 * @public
	 */
	device.resize.attachHandler = function(fnFunction, oListener){
		attachEvent("resize", fnFunction, oListener);
	};

	/**
	 * Removes a previously attached event handler from the orientation change events.
	 *
	 * The passed parameters must match those used for registration with {@link #attachHandler} beforehand.
	 *
	 * @param {function}
	 *            fnFunction The handler function to detach from the event
	 * @param {object}
	 *            [oListener] The object that wanted to be notified when the event occurred
	 *
	 * @name sap.ui.Device.orientation#detachHandler
	 * @function
	 * @public
	 */
	device.orientation.detachHandler = function(fnFunction, oListener){
		detachEvent("orientation", fnFunction, oListener);
	};

	/**
	 * Removes a previously attached event handler from the resize events.
	 *
	 * The passed parameters must match those used for registration with {@link #attachHandler} beforehand.
	 *
	 * @param {function}
	 *            fnFunction The handler function to detach from the event
	 * @param {object}
	 *            [oListener] The object that wanted to be notified when the event occurred
	 *
	 * @name sap.ui.Device.resize#detachHandler
	 * @function
	 * @public
	 */
	device.resize.detachHandler = function(fnFunction, oListener){
		detachEvent("resize", fnFunction, oListener);
	};

	function setOrientationInfo(oInfo){
		oInfo.landscape = isLandscape(true);
		oInfo.portrait = !oInfo.landscape;
	}

	function handleOrientationChange(){
		setOrientationInfo(device.orientation);
		fireEvent("orientation", {landscape: device.orientation.landscape});
	}

	function handleResizeChange(){
		setResizeInfo(device.resize);
		fireEvent("resize", {height: device.resize.height, width: device.resize.width});
	}

	function setResizeInfo(oInfo){
		oInfo.width = windowSize()[0];
		oInfo.height = windowSize()[1];
	}

	function handleOrientationResizeChange(){
		var wasL = device.orientation.landscape;
		var isL = isLandscape();
		if (wasL != isL) {
			handleOrientationChange();
		}
		//throttle resize events because most browsers throw one or more resize events per pixel
		//for every resize event inside the period from 150ms (starting from the first resize event),
		//we only fire one resize event after this period
		if (!iResizeTimeout) {
			iResizeTimeout = window.setTimeout(handleResizeTimeout, 150);
		}
	}

	function handleResizeTimeout() {
		handleResizeChange();
		iResizeTimeout = null;
	}

	var bOrientationchange = false;
	var bResize = false;
	var iOrientationTimeout;
	var iResizeTimeout;
	var iClearFlagTimeout;
	var iWindowHeightOld = windowSize()[1];
	var iWindowWidthOld = windowSize()[0];
	var bKeyboardOpen = false;
	var iLastResizeTime;
	var rInputTagRegex = /INPUT|TEXTAREA|SELECT/;
	// On iPhone with iOS version 7.0.x and on iPad with iOS version 7.x (tested with all versions below 7.1.1), there's a invalide resize event fired
	// when changing the orientation while keyboard is shown.
	var bSkipFirstResize = device.os.ios && device.browser.name === "sf" &&
		((device.system.phone && device.os.version >= 7 && device.os.version < 7.1) || (device.system.tablet && device.os.version >= 7));

	function isLandscape(bFromOrientationChange){
		if (device.support.touch && device.support.orientation) {
			//if on screen keyboard is open and the call of this method is from orientation change listener, reverse the last value.
			//this is because when keyboard opens on android device, the height can be less than the width even in portrait mode.
			if (bKeyboardOpen && bFromOrientationChange) {
				return !device.orientation.landscape;
			}
			//when keyboard opens, the last orientation change value will be retured.
			if (bKeyboardOpen) {
				return device.orientation.landscape;
			}
			//otherwise compare the width and height of window
		} else {
			//most desktop browsers and windows phone/tablet which not support orientationchange
			if (device.support.matchmedia && device.support.orientation) {
				return !!window.matchMedia("(orientation: landscape)").matches;
			}
		}
		var size = windowSize();
		return size[0] > size[1];
	}

	function handleMobileOrientationResizeChange(evt) {
		if (evt.type == "resize") {
			// supress the first invalid resize event fired before orientationchange event while keyboard is open on iPhone 7.0.x
			// because this event has wrong size infos
			if (bSkipFirstResize && rInputTagRegex.test(document.activeElement.tagName) && !bOrientationchange) {
				return;
			}

			var iWindowHeightNew = windowSize()[1];
			var iWindowWidthNew = windowSize()[0];
			var iTime = new Date().getTime();
			//skip multiple resize events by only one orientationchange
			if (iWindowHeightNew === iWindowHeightOld && iWindowWidthNew === iWindowWidthOld) {
				return;
			}
			bResize = true;
			//on mobile devices opening the keyboard on some devices leads to a resize event
			//in this case only the height changes, not the width
			if ((iWindowHeightOld != iWindowHeightNew) && (iWindowWidthOld == iWindowWidthNew)) {
				//Asus Transformer tablet fires two resize events when orientation changes while keyboard is open.
				//Between these two events, only the height changes. The check of if keyboard is open has to be skipped because
				//it may be judged as keyboard closed but the keyboard is still open which will affect the orientation detection
				if (!iLastResizeTime || (iTime - iLastResizeTime > 300)) {
					bKeyboardOpen = (iWindowHeightNew < iWindowHeightOld);
				}
				handleResizeChange();
			} else {
				iWindowWidthOld = iWindowWidthNew;
			}
			iLastResizeTime = iTime;
			iWindowHeightOld = iWindowHeightNew;

			if (iClearFlagTimeout) {
				window.clearTimeout(iClearFlagTimeout);
				iClearFlagTimeout = null;
			}
			//Some Android build-in browser fires a resize event after the viewport is applied.
			//This resize event has to be dismissed otherwise when the next orientationchange event happens,
			//a UI5 resize event will be fired with the wrong window size.
			iClearFlagTimeout = window.setTimeout(clearFlags, 1200);
		} else if (evt.type == "orientationchange") {
			bOrientationchange = true;
		}

		if (iOrientationTimeout) {
			clearTimeout(iOrientationTimeout);
			iOrientationTimeout = null;
		}
		iOrientationTimeout = window.setTimeout(handleMobileTimeout, 50);
	}

	function handleMobileTimeout() {
		if (bOrientationchange && bResize) {
			handleOrientationChange();
			handleResizeChange();
			bOrientationchange = false;
			bResize = false;
			if (iClearFlagTimeout) {
				window.clearTimeout(iClearFlagTimeout);
				iClearFlagTimeout = null;
			}
		}
		iOrientationTimeout = null;
	}

	function clearFlags(){
		bOrientationchange = false;
		bResize = false;
		iClearFlagTimeout = null;
	}

//******** Update browser settings for test purposes ********

	device._update = function(_simMobileOnDesktop) {
		ua = navigator.userAgent;
		logger.log(WARNING, "Device API values manipulated: NOT PRODUCTIVE FEATURE!!! This should be only used for test purposes. Only use if you know what you are doing.");
		setBrowser();
		setOS();
		setSystem(_simMobileOnDesktop);
	};

//********************************************************

	setResizeInfo(device.resize);
	setOrientationInfo(device.orientation);

	//Add API to global namespace
	window.sap.ui.Device = device;

	// Add handler for orientationchange and resize after initialization of Device API (IE8 fires onresize synchronously)
	if (device.support.touch && device.support.orientation) {
		//logic for mobile devices which support orientationchange (like ios, android, blackberry)
		window.addEventListener("resize", handleMobileOrientationResizeChange, false);
		window.addEventListener("orientationchange", handleMobileOrientationResizeChange, false);
	} else {
		if (window.addEventListener) {
			//most desktop browsers and windows phone/tablet which not support orientationchange
			window.addEventListener("resize", handleOrientationResizeChange, false);
		} else {
			//IE8
			window.attachEvent("onresize", handleOrientationResizeChange);
		}
	}

	//Always initialize the default media range set
	device.media.initRangeSet();
	device.media.initRangeSet(RANGESETS["SAP_STANDARD_EXTENDED"]);

	// define module if API is available
	if (sap.ui.define) {
		sap.ui.define("sap/ui/Device", [], function() {
			return device;
		});
	}

}());
/*!
 * URI.js - Mutating URLs
 *
 * Version: 1.11.2
 *
 * Author: Rodney Rehm
 * Web: http://medialize.github.com/URI.js/
 *
 * Licensed under
 *   MIT License http://www.opensource.org/licenses/mit-license
 *   GPL v3 http://opensource.org/licenses/GPL-3.0
 *
 */
(function (root, factory) {
    // https://github.com/umdjs/umd/blob/master/returnExports.js
    if (typeof exports === 'object') {
        // Node
        module.exports = factory(require('./punycode'), require('./IPv6'), require('./SecondLevelDomains'));
    } else if (typeof define === 'function' && define.amd) {
        // AMD. Register as an anonymous module.
      // ##### BEGIN: MODIFIED BY SAP
      // define(['./punycode', './IPv6', './SecondLevelDomains'], factory);
      // we can't support loading URI.js via AMD define. URI.js is packaged with SAPUI5 code 
      // and define() doesn't execute synchronously. So the UI5 code executed after URI.js 
      // fails as it is missing the URI.js code.
      // Instead we use the standard init code and only expose the result via define()
      // The (optional) dependencies are lost or must be loaded in advance
      root.URI = factory(root.punycode, root.IPv6, root.SecondLevelDomains, root);
      define('sap/ui/thirdparty/URI', [], function() { return root.URI; });
      // ##### END: MODIFIED BY SAP
    } else {
        // Browser globals (root is window)
        root.URI = factory(root.punycode, root.IPv6, root.SecondLevelDomains, root);
    }
}(this, function (punycode, IPv6, SLD, root) {
"use strict";

// save current URI variable, if any
var _URI = root && root.URI;

function URI(url, base) {
    // Allow instantiation without the 'new' keyword
    if (!(this instanceof URI)) {
        return new URI(url, base);
    }

    if (url === undefined) {
        if (typeof location !== 'undefined') {
            url = location.href + "";
        } else {
            url = "";
        }
    }

    this.href(url);

    // resolve to base according to http://dvcs.w3.org/hg/url/raw-file/tip/Overview.html#constructor
    if (base !== undefined) {
        return this.absoluteTo(base);
    }

    return this;
};

var p = URI.prototype;
var hasOwn = Object.prototype.hasOwnProperty;

function escapeRegEx(string) {
    // https://github.com/medialize/URI.js/commit/85ac21783c11f8ccab06106dba9735a31a86924d#commitcomment-821963
    return string.replace(/([.*+?^=!:${}()|[\]\/\\])/g, '\\$1');
}

function getType(value) {
    // IE8 doesn't return [Object Undefined] but [Object Object] for undefined value
    if (value === undefined) {
        return 'Undefined';
    }

    return String(Object.prototype.toString.call(value)).slice(8, -1);
}

function isArray(obj) {
    return getType(obj) === "Array";
}

function filterArrayValues(data, value) {
    var lookup = {};
    var i, length;

    if (isArray(value)) {
        for (i = 0, length = value.length; i < length; i++) {
            lookup[value[i]] = true;
        }
    } else {
        lookup[value] = true;
    }

    for (i = 0, length = data.length; i < length; i++) {
        if (lookup[data[i]] !== undefined) {
            data.splice(i, 1);
            length--;
            i--;
        }
    }

    return data;
}

function arrayContains(list, value) {
    var i, length;
    
    // value may be string, number, array, regexp
    if (isArray(value)) {
        // Note: this can be optimized to O(n) (instead of current O(m * n))
        for (i = 0, length = value.length; i < length; i++) {
            if (!arrayContains(list, value[i])) {
                return false;
            }
        }
        
        return true;
    }
    
    var _type = getType(value);
    for (i = 0, length = list.length; i < length; i++) {
        if (_type === 'RegExp') {
            if (typeof list[i] === 'string' && list[i].match(value)) {
                return true;
            }
        } else if (list[i] === value) {
            return true;
        }
    }

    return false;
}

function arraysEqual(one, two) {
    if (!isArray(one) || !isArray(two)) {
        return false;
    }
    
    // arrays can't be equal if they have different amount of content
    if (one.length !== two.length) {
        return false;
    }

    one.sort();
    two.sort();

    for (var i = 0, l = one.length; i < l; i++) {
        if (one[i] !== two[i]) {
            return false;
        }
    }
    
    return true;
}

URI._parts = function() {
    return {
        protocol: null,
        username: null,
        password: null,
        hostname: null,
        urn: null,
        port: null,
        path: null,
        query: null,
        fragment: null,
        // state
        duplicateQueryParameters: URI.duplicateQueryParameters,
        escapeQuerySpace: URI.escapeQuerySpace
    };
};
// state: allow duplicate query parameters (a=1&a=1)
URI.duplicateQueryParameters = false;
// state: replaces + with %20 (space in query strings)
URI.escapeQuerySpace = true;
// static properties
URI.protocol_expression = /^[a-z][a-z0-9-+-]*$/i;
URI.idn_expression = /[^a-z0-9\.-]/i;
URI.punycode_expression = /(xn--)/i;
// well, 333.444.555.666 matches, but it sure ain't no IPv4 - do we care?
URI.ip4_expression = /^\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}$/;
// credits to Rich Brown
// source: http://forums.intermapper.com/viewtopic.php?p=1096#1096
// specification: http://www.ietf.org/rfc/rfc4291.txt
URI.ip6_expression = /^\s*((([0-9A-Fa-f]{1,4}:){7}([0-9A-Fa-f]{1,4}|:))|(([0-9A-Fa-f]{1,4}:){6}(:[0-9A-Fa-f]{1,4}|((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3})|:))|(([0-9A-Fa-f]{1,4}:){5}(((:[0-9A-Fa-f]{1,4}){1,2})|:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3})|:))|(([0-9A-Fa-f]{1,4}:){4}(((:[0-9A-Fa-f]{1,4}){1,3})|((:[0-9A-Fa-f]{1,4})?:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:))|(([0-9A-Fa-f]{1,4}:){3}(((:[0-9A-Fa-f]{1,4}){1,4})|((:[0-9A-Fa-f]{1,4}){0,2}:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:))|(([0-9A-Fa-f]{1,4}:){2}(((:[0-9A-Fa-f]{1,4}){1,5})|((:[0-9A-Fa-f]{1,4}){0,3}:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:))|(([0-9A-Fa-f]{1,4}:){1}(((:[0-9A-Fa-f]{1,4}){1,6})|((:[0-9A-Fa-f]{1,4}){0,4}:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:))|(:(((:[0-9A-Fa-f]{1,4}){1,7})|((:[0-9A-Fa-f]{1,4}){0,5}:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:)))(%.+)?\s*$/;
// gruber revised expression - http://rodneyrehm.de/t/url-regex.html
URI.find_uri_expression = /\b((?:[a-z][\w-]+:(?:\/{1,3}|[a-z0-9%])|www\d{0,3}[.]|[a-z0-9.\-]+[.][a-z]{2,4}\/)(?:[^\s()<>]+|\(([^\s()<>]+|(\([^\s()<>]+\)))*\))+(?:\(([^\s()<>]+|(\([^\s()<>]+\)))*\)|[^\s`!()\[\]{};:'".,<>?«»“”‘’]))/ig;
// http://www.iana.org/assignments/uri-schemes.html
// http://en.wikipedia.org/wiki/List_of_TCP_and_UDP_port_numbers#Well-known_ports
URI.defaultPorts = {
    http: "80",
    https: "443",
    ftp: "21",
    gopher: "70",
    ws: "80",
    wss: "443"
};
// allowed hostname characters according to RFC 3986
// ALPHA DIGIT "-" "." "_" "~" "!" "$" "&" "'" "(" ")" "*" "+" "," ";" "=" %encoded
// I've never seen a (non-IDN) hostname other than: ALPHA DIGIT . -
URI.invalid_hostname_characters = /[^a-zA-Z0-9\.-]/;
// map DOM Elements to their URI attribute
URI.domAttributes = {
    'a': 'href',
    'blockquote': 'cite',
    'link': 'href',
    'base': 'href',
    'script': 'src',
    'form': 'action',
    'img': 'src',
    'area': 'href',
    'iframe': 'src',
    'embed': 'src',
    'source': 'src',
    'track': 'src',
    'input': 'src' // but only if type="image"
};
URI.getDomAttribute = function(node) {
    if (!node || !node.nodeName) {
        return undefined;
    }
    
    var nodeName = node.nodeName.toLowerCase();
    // <input> should only expose src for type="image"
    if (nodeName === 'input' && node.type !== 'image') {
        return undefined;
    }
    
    return URI.domAttributes[nodeName];
};

function escapeForDumbFirefox36(value) {
    // https://github.com/medialize/URI.js/issues/91
    return escape(value);
}

// encoding / decoding according to RFC3986
function strictEncodeURIComponent(string) {
    // see https://developer.mozilla.org/en-US/docs/JavaScript/Reference/Global_Objects/encodeURIComponent
    return encodeURIComponent(string)
        .replace(/[!'()*]/g, escapeForDumbFirefox36)
        .replace(/\*/g, "%2A");
}
URI.encode = strictEncodeURIComponent;
URI.decode = decodeURIComponent;
URI.iso8859 = function() {
    URI.encode = escape;
    URI.decode = unescape;
};
URI.unicode = function() {
    URI.encode = strictEncodeURIComponent;
    URI.decode = decodeURIComponent;
};
URI.characters = {
    pathname: {
        encode: {
            // RFC3986 2.1: For consistency, URI producers and normalizers should
            // use uppercase hexadecimal digits for all percent-encodings.
            expression: /%(24|26|2B|2C|3B|3D|3A|40)/ig,
            map: {
                // -._~!'()*
                "%24": "$",
                "%26": "&",
                "%2B": "+",
                "%2C": ",",
                "%3B": ";",
                "%3D": "=",
                "%3A": ":",
                "%40": "@"
            }
        },
        decode: {
            expression: /[\/\?#]/g,
            map: {
                "/": "%2F",
                "?": "%3F",
                "#": "%23"
            }
        }
    },
    reserved: {
        encode: {
            // RFC3986 2.1: For consistency, URI producers and normalizers should
            // use uppercase hexadecimal digits for all percent-encodings.
            expression: /%(21|23|24|26|27|28|29|2A|2B|2C|2F|3A|3B|3D|3F|40|5B|5D)/ig,
            map: {
                // gen-delims
                "%3A": ":",
                "%2F": "/",
                "%3F": "?",
                "%23": "#",
                "%5B": "[",
                "%5D": "]",
                "%40": "@",
                // sub-delims
                "%21": "!",
                "%24": "$",
                "%26": "&",
                "%27": "'",
                "%28": "(",
                "%29": ")",
                "%2A": "*",
                "%2B": "+",
                "%2C": ",",
                "%3B": ";",
                "%3D": "="
            }
        }
    }
};
URI.encodeQuery = function(string, escapeQuerySpace) {
    var escaped = URI.encode(string + "");
    return escapeQuerySpace ? escaped.replace(/%20/g, '+') : escaped;
};
URI.decodeQuery = function(string, escapeQuerySpace) {
    string += "";
    try {
        return URI.decode(escapeQuerySpace ? string.replace(/\+/g, '%20') : string);
    } catch(e) {
        // we're not going to mess with weird encodings,
        // give up and return the undecoded original string
        // see https://github.com/medialize/URI.js/issues/87
        // see https://github.com/medialize/URI.js/issues/92
        return string;
    }
};
URI.recodePath = function(string) {
    var segments = (string + "").split('/');
    for (var i = 0, length = segments.length; i < length; i++) {
        segments[i] = URI.encodePathSegment(URI.decode(segments[i]));
    }

    return segments.join('/');
};
URI.decodePath = function(string) {
    var segments = (string + "").split('/');
    for (var i = 0, length = segments.length; i < length; i++) {
        segments[i] = URI.decodePathSegment(segments[i]);
    }

    return segments.join('/');
};
// generate encode/decode path functions
var _parts = {'encode':'encode', 'decode':'decode'};
var _part;
var generateAccessor = function(_group, _part) {
    return function(string) {
        return URI[_part](string + "").replace(URI.characters[_group][_part].expression, function(c) {
            return URI.characters[_group][_part].map[c];
        });
    };
};

for (_part in _parts) {
    URI[_part + "PathSegment"] = generateAccessor("pathname", _parts[_part]);
}

URI.encodeReserved = generateAccessor("reserved", "encode");

URI.parse = function(string, parts) {
    var pos;
    if (!parts) {
        parts = {};
    }
    // [protocol"://"[username[":"password]"@"]hostname[":"port]"/"?][path]["?"querystring]["#"fragment]

    // extract fragment
    pos = string.indexOf('#');
    if (pos > -1) {
        // escaping?
        parts.fragment = string.substring(pos + 1) || null;
        string = string.substring(0, pos);
    }

    // extract query
    pos = string.indexOf('?');
    if (pos > -1) {
        // escaping?
        parts.query = string.substring(pos + 1) || null;
        string = string.substring(0, pos);
    }

    // extract protocol
    if (string.substring(0, 2) === '//') {
        // relative-scheme
        parts.protocol = null;
        string = string.substring(2);
        // extract "user:pass@host:port"
        string = URI.parseAuthority(string, parts);
    } else {
        pos = string.indexOf(':');
        if (pos > -1) {
            parts.protocol = string.substring(0, pos) || null;
            if (parts.protocol && !parts.protocol.match(URI.protocol_expression)) {
                // : may be within the path
                parts.protocol = undefined;
            } else if (parts.protocol === 'file') {
                // the file scheme: does not contain an authority
                string = string.substring(pos + 3);
            } else if (string.substring(pos + 1, pos + 3) === '//') {
                string = string.substring(pos + 3);

                // extract "user:pass@host:port"
                string = URI.parseAuthority(string, parts);
            } else {
                string = string.substring(pos + 1);
                parts.urn = true;
            }
        }
    }

    // what's left must be the path
    parts.path = string;

    // and we're done
    return parts;
};
URI.parseHost = function(string, parts) {
    // extract host:port
    var pos = string.indexOf('/');
    var bracketPos;
    var t;

    if (pos === -1) {
        pos = string.length;
    }

    if (string.charAt(0) === "[") {
        // IPv6 host - http://tools.ietf.org/html/draft-ietf-6man-text-addr-representation-04#section-6
        // I claim most client software breaks on IPv6 anyways. To simplify things, URI only accepts
        // IPv6+port in the format [2001:db8::1]:80 (for the time being)
        bracketPos = string.indexOf(']');
        parts.hostname = string.substring(1, bracketPos) || null;
        parts.port = string.substring(bracketPos+2, pos) || null;
    } else if (string.indexOf(':') !== string.lastIndexOf(':')) {
        // IPv6 host contains multiple colons - but no port
        // this notation is actually not allowed by RFC 3986, but we're a liberal parser
        parts.hostname = string.substring(0, pos) || null;
        parts.port = null;
    } else {
        t = string.substring(0, pos).split(':');
        parts.hostname = t[0] || null;
        parts.port = t[1] || null;
    }

    if (parts.hostname && string.substring(pos).charAt(0) !== '/') {
        pos++;
        string = "/" + string;
    }

    return string.substring(pos) || '/';
};
URI.parseAuthority = function(string, parts) {
    string = URI.parseUserinfo(string, parts);
    return URI.parseHost(string, parts);
};
URI.parseUserinfo = function(string, parts) {
    // extract username:password
    var firstSlash = string.indexOf('/');
    var pos = firstSlash > -1 
        ? string.lastIndexOf('@', firstSlash) 
        : string.indexOf('@');
    var t;

    // authority@ must come before /path
    if (pos > -1 && (firstSlash === -1 || pos < firstSlash)) {
        t = string.substring(0, pos).split(':');
        parts.username = t[0] ? URI.decode(t[0]) : null;
        t.shift();
        parts.password = t[0] ? URI.decode(t.join(':')) : null;
        string = string.substring(pos + 1);
    } else {
        parts.username = null;
        parts.password = null;
    }

    return string;
};
URI.parseQuery = function(string, escapeQuerySpace) {
    if (!string) {
        return {};
    }

    // throw out the funky business - "?"[name"="value"&"]+
    string = string.replace(/&+/g, '&').replace(/^\?*&*|&+$/g, '');

    if (!string) {
        return {};
    }

    var items = {};
    var splits = string.split('&');
    var length = splits.length;
    var v, name, value;

    for (var i = 0; i < length; i++) {
        v = splits[i].split('=');
        name = URI.decodeQuery(v.shift(), escapeQuerySpace);
        // no "=" is null according to http://dvcs.w3.org/hg/url/raw-file/tip/Overview.html#collect-url-parameters
        value = v.length ? URI.decodeQuery(v.join('='), escapeQuerySpace) : null;

        if (items[name]) {
            if (typeof items[name] === "string") {
                items[name] = [items[name]];
            }

            items[name].push(value);
        } else {
            items[name] = value;
        }
    }

    return items;
};

URI.build = function(parts) {
    var t = "";

    if (parts.protocol) {
        t += parts.protocol + ":";
    }

    if (!parts.urn && (t || parts.hostname)) {
        t += '//';
    }

    t += (URI.buildAuthority(parts) || '');

    if (typeof parts.path === "string") {
        if (parts.path.charAt(0) !== '/' && typeof parts.hostname === "string") {
            t += '/';
        }

        t += parts.path;
    }

    if (typeof parts.query === "string" && parts.query) {
        t += '?' + parts.query;
    }

    if (typeof parts.fragment === "string" && parts.fragment) {
        t += '#' + parts.fragment;
    }
    return t;
};
URI.buildHost = function(parts) {
    var t = "";

    if (!parts.hostname) {
        return "";
    } else if (URI.ip6_expression.test(parts.hostname)) {
        if (parts.port) {
            t += "[" + parts.hostname + "]:" + parts.port;
        } else {
            // don't know if we should always wrap IPv6 in []
            // the RFC explicitly says SHOULD, not MUST.
            t += parts.hostname;
        }
    } else {
        t += parts.hostname;
        if (parts.port) {
            t += ':' + parts.port;
        }
    }

    return t;
};
URI.buildAuthority = function(parts) {
    return URI.buildUserinfo(parts) + URI.buildHost(parts);
};
URI.buildUserinfo = function(parts) {
    var t = "";

    if (parts.username) {
        t += URI.encode(parts.username);

        if (parts.password) {
            t += ':' + URI.encode(parts.password);
        }

        t += "@";
    }

    return t;
};
URI.buildQuery = function(data, duplicateQueryParameters, escapeQuerySpace) {
    // according to http://tools.ietf.org/html/rfc3986 or http://labs.apache.org/webarch/uri/rfc/rfc3986.html
    // being »-._~!$&'()*+,;=:@/?« %HEX and alnum are allowed
    // the RFC explicitly states ?/foo being a valid use case, no mention of parameter syntax!
    // URI.js treats the query string as being application/x-www-form-urlencoded
    // see http://www.w3.org/TR/REC-html40/interact/forms.html#form-content-type

    var t = "";
    var unique, key, i, length;
    for (key in data) {
        if (hasOwn.call(data, key) && key) {
            if (isArray(data[key])) {
                unique = {};
                for (i = 0, length = data[key].length; i < length; i++) {
                    if (data[key][i] !== undefined && unique[data[key][i] + ""] === undefined) {
                        t += "&" + URI.buildQueryParameter(key, data[key][i], escapeQuerySpace);
                        if (duplicateQueryParameters !== true) {
                            unique[data[key][i] + ""] = true;
                        }
                    }
                }
            } else if (data[key] !== undefined) {
                t += '&' + URI.buildQueryParameter(key, data[key], escapeQuerySpace);
            }
        }
    }

    return t.substring(1);
};
URI.buildQueryParameter = function(name, value, escapeQuerySpace) {
    // http://www.w3.org/TR/REC-html40/interact/forms.html#form-content-type -- application/x-www-form-urlencoded
    // don't append "=" for null values, according to http://dvcs.w3.org/hg/url/raw-file/tip/Overview.html#url-parameter-serialization
    return URI.encodeQuery(name, escapeQuerySpace) + (value !== null ? "=" + URI.encodeQuery(value, escapeQuerySpace) : "");
};

URI.addQuery = function(data, name, value) {
    if (typeof name === "object") {
        for (var key in name) {
            if (hasOwn.call(name, key)) {
                URI.addQuery(data, key, name[key]);
            }
        }
    } else if (typeof name === "string") {
        if (data[name] === undefined) {
            data[name] = value;
            return;
        } else if (typeof data[name] === "string") {
            data[name] = [data[name]];
        }

        if (!isArray(value)) {
            value = [value];
        }

        data[name] = data[name].concat(value);
    } else {
        throw new TypeError("URI.addQuery() accepts an object, string as the name parameter");
    }
};
URI.removeQuery = function(data, name, value) {
    var i, length, key;
    
    if (isArray(name)) {
        for (i = 0, length = name.length; i < length; i++) {
            data[name[i]] = undefined;
        }
    } else if (typeof name === "object") {
        for (key in name) {
            if (hasOwn.call(name, key)) {
                URI.removeQuery(data, key, name[key]);
            }
        }
    } else if (typeof name === "string") {
        if (value !== undefined) {
            if (data[name] === value) {
                data[name] = undefined;
            } else if (isArray(data[name])) {
                data[name] = filterArrayValues(data[name], value);
            }
        } else {
            data[name] = undefined;
        }
    } else {
        throw new TypeError("URI.addQuery() accepts an object, string as the first parameter");
    }
};
URI.hasQuery = function(data, name, value, withinArray) {
    if (typeof name === "object") {
        for (var key in name) {
            if (hasOwn.call(name, key)) {
                if (!URI.hasQuery(data, key, name[key])) {
                    return false;
                }
            }
        }
        
        return true;
    } else if (typeof name !== "string") {
        throw new TypeError("URI.hasQuery() accepts an object, string as the name parameter");
    }

    switch (getType(value)) {
        case 'Undefined':
            // true if exists (but may be empty)
            return name in data; // data[name] !== undefined;

        case 'Boolean':
            // true if exists and non-empty
            var _booly = Boolean(isArray(data[name]) ? data[name].length : data[name]);
            return value === _booly;

        case 'Function':
            // allow complex comparison
            return !!value(data[name], name, data);

        case 'Array':
            if (!isArray(data[name])) {
                return false;
            }

            var op = withinArray ? arrayContains : arraysEqual;
            return op(data[name], value);

        case 'RegExp':
            if (!isArray(data[name])) {
                return Boolean(data[name] && data[name].match(value));
            }

            if (!withinArray) {
                return false;
            }

            return arrayContains(data[name], value);

        case 'Number':
            value = String(value);
            // omit break;
        case 'String':
            if (!isArray(data[name])) {
                return data[name] === value;
            }

            if (!withinArray) {
                return false;
            }

            return arrayContains(data[name], value);

        default:
            throw new TypeError("URI.hasQuery() accepts undefined, boolean, string, number, RegExp, Function as the value parameter");
    }
};


URI.commonPath = function(one, two) {
    var length = Math.min(one.length, two.length);
    var pos;

    // find first non-matching character
    for (pos = 0; pos < length; pos++) {
        if (one.charAt(pos) !== two.charAt(pos)) {
            pos--;
            break;
        }
    }

    if (pos < 1) {
        return one.charAt(0) === two.charAt(0) && one.charAt(0) === '/' ? '/' : '';
    }
    
    // revert to last /
    if (one.charAt(pos) !== '/' || two.charAt(pos) !== '/') {
        pos = one.substring(0, pos).lastIndexOf('/');
    }

    return one.substring(0, pos + 1);
};

URI.withinString = function(string, callback) {
    // expression used is "gruber revised" (@gruber v2) determined to be the best solution in
    // a regex sprint we did a couple of ages ago at
    // * http://mathiasbynens.be/demo/url-regex
    // * http://rodneyrehm.de/t/url-regex.html

    return string.replace(URI.find_uri_expression, callback);
};

URI.ensureValidHostname = function(v) {
    // Theoretically URIs allow percent-encoding in Hostnames (according to RFC 3986)
    // they are not part of DNS and therefore ignored by URI.js

    if (v.match(URI.invalid_hostname_characters)) {
        // test punycode
        if (!punycode) {
            throw new TypeError("Hostname '" + v + "' contains characters other than [A-Z0-9.-] and Punycode.js is not available");
        }

        if (punycode.toASCII(v).match(URI.invalid_hostname_characters)) {
            throw new TypeError("Hostname '" + v + "' contains characters other than [A-Z0-9.-]");
        }
    }
};

// noConflict
URI.noConflict = function(removeAll) {
    if (removeAll) {
        var unconflicted = {
            URI: this.noConflict()
        };

        if (URITemplate && typeof URITemplate.noConflict == "function") {
            unconflicted.URITemplate = URITemplate.noConflict();
        }

        if (IPv6 && typeof IPv6.noConflict == "function") {
            unconflicted.IPv6 = IPv6.noConflict();
        }

        if (SecondLevelDomains && typeof SecondLevelDomains.noConflict == "function") {
            unconflicted.SecondLevelDomains = SecondLevelDomains.noConflict();
        }

        return unconflicted;
    } else if (root.URI === this) {
        root.URI = _URI;
    }

    return this;
};

p.build = function(deferBuild) {
    if (deferBuild === true) {
        this._deferred_build = true;
    } else if (deferBuild === undefined || this._deferred_build) {
        this._string = URI.build(this._parts);
        this._deferred_build = false;
    }

    return this;
};

p.clone = function() {
    return new URI(this);
};

p.valueOf = p.toString = function() {
    return this.build(false)._string;
};

// generate simple accessors
_parts = {protocol: 'protocol', username: 'username', password: 'password', hostname: 'hostname',  port: 'port'};
generateAccessor = function(_part){
    return function(v, build) {
        if (v === undefined) {
            return this._parts[_part] || "";
        } else {
            this._parts[_part] = v || null;
            this.build(!build);
            return this;
        }
    };
};

for (_part in _parts) {                                                                                                                                                                                        
    p[_part] = generateAccessor(_parts[_part]);
}

// generate accessors with optionally prefixed input
_parts = {query: '?', fragment: '#'};
generateAccessor = function(_part, _key){
    return function(v, build) {
        if (v === undefined) {
            return this._parts[_part] || "";
        } else {
            if (v !== null) {
                v = v + "";
                if (v.charAt(0) === _key) {
                    v = v.substring(1);
                }
            }

            this._parts[_part] = v;
            this.build(!build);
            return this;
        }
    };
};

for (_part in _parts) {
    p[_part] = generateAccessor(_part, _parts[_part]);
}

// generate accessors with prefixed output
_parts = {search: ['?', 'query'], hash: ['#', 'fragment']};
generateAccessor = function(_part, _key){
    return function(v, build) {
        var t = this[_part](v, build);
        return typeof t === "string" && t.length ? (_key + t) : t;
    };
};

for (_part in _parts) {
    p[_part] = generateAccessor(_parts[_part][1], _parts[_part][0]);
}

p.pathname = function(v, build) {
    if (v === undefined || v === true) {
        var res = this._parts.path || (this._parts.hostname ? '/' : '');
        return v ? URI.decodePath(res) : res;
    } else {
        this._parts.path = v ? URI.recodePath(v) : "/";
        this.build(!build);
        return this;
    }
};
p.path = p.pathname;
p.href = function(href, build) {
    var key;
    
    if (href === undefined) {
        return this.toString();
    }

    this._string = "";
    this._parts = URI._parts();

    var _URI = href instanceof URI;
    var _object = typeof href === "object" && (href.hostname || href.path || href.pathname);
    if (href.nodeName) {
        var attribute = URI.getDomAttribute(href);
        href = href[attribute] || "";
        _object = false;
    }
    
    // window.location is reported to be an object, but it's not the sort
    // of object we're looking for: 
    // * location.protocol ends with a colon
    // * location.query != object.search
    // * location.hash != object.fragment
    // simply serializing the unknown object should do the trick 
    // (for location, not for everything...)
    if (!_URI && _object && href.pathname !== undefined) {
        href = href.toString();
    }

    if (typeof href === "string") {
        this._parts = URI.parse(href, this._parts);
    } else if (_URI || _object) {
        var src = _URI ? href._parts : href;
        for (key in src) {
            if (hasOwn.call(this._parts, key)) {
                this._parts[key] = src[key];
            }
        }
    } else {
        throw new TypeError("invalid input");
    }

    this.build(!build);
    return this;
};

// identification accessors
p.is = function(what) {
    var ip = false;
    var ip4 = false;
    var ip6 = false;
    var name = false;
    var sld = false;
    var idn = false;
    var punycode = false;
    var relative = !this._parts.urn;

    if (this._parts.hostname) {
        relative = false;
        ip4 = URI.ip4_expression.test(this._parts.hostname);
        ip6 = URI.ip6_expression.test(this._parts.hostname);
        ip = ip4 || ip6;
        name = !ip;
        sld = name && SLD && SLD.has(this._parts.hostname);
        idn = name && URI.idn_expression.test(this._parts.hostname);
        punycode = name && URI.punycode_expression.test(this._parts.hostname);
    }

    switch (what.toLowerCase()) {
        case 'relative':
            return relative;

        case 'absolute':
            return !relative;

        // hostname identification
        case 'domain':
        case 'name':
            return name;

        case 'sld':
            return sld;

        case 'ip':
            return ip;

        case 'ip4':
        case 'ipv4':
        case 'inet4':
            return ip4;

        case 'ip6':
        case 'ipv6':
        case 'inet6':
            return ip6;

        case 'idn':
            return idn;

        case 'url':
            return !this._parts.urn;

        case 'urn':
            return !!this._parts.urn;

        case 'punycode':
            return punycode;
    }

    return null;
};

// component specific input validation
var _protocol = p.protocol;
var _port = p.port;
var _hostname = p.hostname;

p.protocol = function(v, build) {
    if (v !== undefined) {
        if (v) {
            // accept trailing ://
            v = v.replace(/:(\/\/)?$/, '');

            if (v.match(/[^a-zA-z0-9\.+-]/)) {
                throw new TypeError("Protocol '" + v + "' contains characters other than [A-Z0-9.+-]");
            }
        }
    }
    return _protocol.call(this, v, build);
};
p.scheme = p.protocol;
p.port = function(v, build) {
    if (this._parts.urn) {
        return v === undefined ? '' : this;
    }

    if (v !== undefined) {
        if (v === 0) {
            v = null;
        }

        if (v) {
            v += "";
            if (v.charAt(0) === ":") {
                v = v.substring(1);
            }

            if (v.match(/[^0-9]/)) {
                throw new TypeError("Port '" + v + "' contains characters other than [0-9]");
            }
        }
    }
    return _port.call(this, v, build);
};
p.hostname = function(v, build) {
    if (this._parts.urn) {
        return v === undefined ? '' : this;
    }

    if (v !== undefined) {
        var x = {};
        URI.parseHost(v, x);
        v = x.hostname;
    }
    return _hostname.call(this, v, build);
};

// compound accessors
p.host = function(v, build) {
    if (this._parts.urn) {
        return v === undefined ? '' : this;
    }

    if (v === undefined) {
        return this._parts.hostname ? URI.buildHost(this._parts) : "";
    } else {
        URI.parseHost(v, this._parts);
        this.build(!build);
        return this;
    }
};
p.authority = function(v, build) {
    if (this._parts.urn) {
        return v === undefined ? '' : this;
    }

    if (v === undefined) {
        return this._parts.hostname ? URI.buildAuthority(this._parts) : "";
    } else {
        URI.parseAuthority(v, this._parts);
        this.build(!build);
        return this;
    }
};
p.userinfo = function(v, build) {
    if (this._parts.urn) {
        return v === undefined ? '' : this;
    }

    if (v === undefined) {
        if (!this._parts.username) {
            return "";
        }

        var t = URI.buildUserinfo(this._parts);
        return t.substring(0, t.length -1);
    } else {
        if (v[v.length-1] !== '@') {
            v += '@';
        }

        URI.parseUserinfo(v, this._parts);
        this.build(!build);
        return this;
    }
};
p.resource = function(v, build) {
    var parts;
    
    if (v === undefined) {
        return this.path() + this.search() + this.hash();
    }
    
    parts = URI.parse(v);
    this._parts.path = parts.path;
    this._parts.query = parts.query;
    this._parts.fragment = parts.fragment;
    this.build(!build);
    return this;
};

// fraction accessors
p.subdomain = function(v, build) {
    if (this._parts.urn) {
        return v === undefined ? '' : this;
    }

    // convenience, return "www" from "www.example.org"
    if (v === undefined) {
        if (!this._parts.hostname || this.is('IP')) {
            return "";
        }

        // grab domain and add another segment
        var end = this._parts.hostname.length - this.domain().length - 1;
        return this._parts.hostname.substring(0, end) || "";
    } else {
        var e = this._parts.hostname.length - this.domain().length;
        var sub = this._parts.hostname.substring(0, e);
        var replace = new RegExp('^' + escapeRegEx(sub));

        if (v && v.charAt(v.length - 1) !== '.') {
            v += ".";
        }

        if (v) {
            URI.ensureValidHostname(v);
        }

        this._parts.hostname = this._parts.hostname.replace(replace, v);
        this.build(!build);
        return this;
    }
};
p.domain = function(v, build) {
    if (this._parts.urn) {
        return v === undefined ? '' : this;
    }

    if (typeof v === 'boolean') {
        build = v;
        v = undefined;
    }

    // convenience, return "example.org" from "www.example.org"
    if (v === undefined) {
        if (!this._parts.hostname || this.is('IP')) {
            return "";
        }

        // if hostname consists of 1 or 2 segments, it must be the domain
        var t = this._parts.hostname.match(/\./g);
        if (t && t.length < 2) {
            return this._parts.hostname;
        }

        // grab tld and add another segment
        var end = this._parts.hostname.length - this.tld(build).length - 1;
        end = this._parts.hostname.lastIndexOf('.', end -1) + 1;
        return this._parts.hostname.substring(end) || "";
    } else {
        if (!v) {
            throw new TypeError("cannot set domain empty");
        }

        URI.ensureValidHostname(v);

        if (!this._parts.hostname || this.is('IP')) {
            this._parts.hostname = v;
        } else {
            var replace = new RegExp(escapeRegEx(this.domain()) + "$");
            this._parts.hostname = this._parts.hostname.replace(replace, v);
        }

        this.build(!build);
        return this;
    }
};
p.tld = function(v, build) {
    if (this._parts.urn) {
        return v === undefined ? '' : this;
    }

    if (typeof v === 'boolean') {
        build = v;
        v = undefined;
    }

    // return "org" from "www.example.org"
    if (v === undefined) {
        if (!this._parts.hostname || this.is('IP')) {
            return "";
        }

        var pos = this._parts.hostname.lastIndexOf('.');
        var tld = this._parts.hostname.substring(pos + 1);

        if (build !== true && SLD && SLD.list[tld.toLowerCase()]) {
            return SLD.get(this._parts.hostname) || tld;
        }

        return tld;
    } else {
        var replace;
        
        if (!v) {
            throw new TypeError("cannot set TLD empty");
        } else if (v.match(/[^a-zA-Z0-9-]/)) {
            if (SLD && SLD.is(v)) {
                replace = new RegExp(escapeRegEx(this.tld()) + "$");
                this._parts.hostname = this._parts.hostname.replace(replace, v);
            } else {
                throw new TypeError("TLD '" + v + "' contains characters other than [A-Z0-9]");
            }
        } else if (!this._parts.hostname || this.is('IP')) {
            throw new ReferenceError("cannot set TLD on non-domain host");
        } else {
            replace = new RegExp(escapeRegEx(this.tld()) + "$");
            this._parts.hostname = this._parts.hostname.replace(replace, v);
        }

        this.build(!build);
        return this;
    }
};
p.directory = function(v, build) {
    if (this._parts.urn) {
        return v === undefined ? '' : this;
    }

    if (v === undefined || v === true) {
        if (!this._parts.path && !this._parts.hostname) {
            return '';
        }

        if (this._parts.path === '/') {
            return '/';
        }

        var end = this._parts.path.length - this.filename().length - 1;
        var res = this._parts.path.substring(0, end) || (this._parts.hostname ? "/" : "");

        return v ? URI.decodePath(res) : res;

    } else {
        var e = this._parts.path.length - this.filename().length;
        var directory = this._parts.path.substring(0, e);
        var replace = new RegExp('^' + escapeRegEx(directory));

        // fully qualifier directories begin with a slash
        if (!this.is('relative')) {
            if (!v) {
                v = '/';
            }

            if (v.charAt(0) !== '/') {
                v = "/" + v;
            }
        }

        // directories always end with a slash
        if (v && v.charAt(v.length - 1) !== '/') {
            v += '/';
        }

        v = URI.recodePath(v);
        this._parts.path = this._parts.path.replace(replace, v);
        this.build(!build);
        return this;
    }
};
p.filename = function(v, build) {
    if (this._parts.urn) {
        return v === undefined ? '' : this;
    }

    if (v === undefined || v === true) {
        if (!this._parts.path || this._parts.path === '/') {
            return "";
        }

        var pos = this._parts.path.lastIndexOf('/');
        var res = this._parts.path.substring(pos+1);

        return v ? URI.decodePathSegment(res) : res;
    } else {
        var mutatedDirectory = false;
        
        if (v.charAt(0) === '/') {
            v = v.substring(1);
        }

        if (v.match(/\.?\//)) {
            mutatedDirectory = true;
        }

        var replace = new RegExp(escapeRegEx(this.filename()) + "$");
        v = URI.recodePath(v);
        this._parts.path = this._parts.path.replace(replace, v);

        if (mutatedDirectory) {
            this.normalizePath(build);
        } else {
            this.build(!build);
        }

        return this;
    }
};
p.suffix = function(v, build) {
    if (this._parts.urn) {
        return v === undefined ? '' : this;
    }

    if (v === undefined || v === true) {
        if (!this._parts.path || this._parts.path === '/') {
            return "";
        }

        var filename = this.filename();
        var pos = filename.lastIndexOf('.');
        var s, res;

        if (pos === -1) {
            return "";
        }

        // suffix may only contain alnum characters (yup, I made this up.)
        s = filename.substring(pos+1);
        res = (/^[a-z0-9%]+$/i).test(s) ? s : "";
        return v ? URI.decodePathSegment(res) : res;
    } else {
        if (v.charAt(0) === '.') {
            v = v.substring(1);
        }

        var suffix = this.suffix();
        var replace;

        if (!suffix) {
            if (!v) {
                return this;
            }

            this._parts.path += '.' + URI.recodePath(v);
        } else if (!v) {
            replace = new RegExp(escapeRegEx("." + suffix) + "$");
        } else {
            replace = new RegExp(escapeRegEx(suffix) + "$");
        }

        if (replace) {
            v = URI.recodePath(v);
            this._parts.path = this._parts.path.replace(replace, v);
        }

        this.build(!build);
        return this;
    }
};
p.segment = function(segment, v, build) {
    var separator = this._parts.urn ? ':' : '/';
    var path = this.path();
    var absolute = path.substring(0, 1) === '/';
    var segments = path.split(separator);

    if (segment !== undefined && typeof segment !== 'number') {
        build = v;
        v = segment;
        segment = undefined;
    }

    if (segment !== undefined && typeof segment !== 'number') {
        throw new Error("Bad segment '" + segment + "', must be 0-based integer");
    }

    if (absolute) {
        segments.shift();
    }

    if (segment < 0) {
        // allow negative indexes to address from the end
        segment = Math.max(segments.length + segment, 0);
    }

    if (v === undefined) {
        return segment === undefined
            ? segments
            : segments[segment];
    } else if (segment === null || segments[segment] === undefined) {
        if (isArray(v)) {
            segments = [];
            // collapse empty elements within array
            for (var i=0, l=v.length; i < l; i++) {
                if (!v[i].length && (!segments.length || !segments[segments.length -1].length)) {
                    continue;
                }
                
                if (segments.length && !segments[segments.length -1].length) {
                    segments.pop();
                }
                
                segments.push(v[i]);
            }
        } else if (v || (typeof v === "string")) {
            if (segments[segments.length -1] === "") {
                // empty trailing elements have to be overwritten
                // to prevent results such as /foo//bar
                segments[segments.length -1] = v;
            } else {
                segments.push(v);
            }
        }
    } else {
        if (v || (typeof v === "string" && v.length)) {
            segments[segment] = v;
        } else {
            segments.splice(segment, 1);
        }
    }

    if (absolute) {
        segments.unshift("");
    }

    return this.path(segments.join(separator), build);
};
p.segmentCoded = function(segment, v, build) {
    var segments, i, l;

    if (typeof segment !== 'number') {
        build = v;
        v = segment;
        segment = undefined;
    }

    if (v === undefined) {
        segments = this.segment(segment, v, build);
        if (!isArray(segments)) {
            segments = segments !== undefined ? URI.decode(segments) : undefined;
        } else {
            for (i = 0, l = segments.length; i < l; i++) {
                segments[i] = URI.decode(segments[i]);
            }
        }

        return segments;
    }

    if (!isArray(v)) {
        v = typeof v === 'string' ? URI.encode(v) : v;
    } else {
        for (i = 0, l = v.length; i < l; i++) {
            v[i] = URI.decode(v[i]);
        }
    }

    return this.segment(segment, v, build);
};

// mutating query string
var q = p.query;
p.query = function(v, build) {
    if (v === true) {
        return URI.parseQuery(this._parts.query, this._parts.escapeQuerySpace);
    } else if (typeof v === "function") {
        var data = URI.parseQuery(this._parts.query, this._parts.escapeQuerySpace);
        var result = v.call(this, data);
        this._parts.query = URI.buildQuery(result || data, this._parts.duplicateQueryParameters, this._parts.escapeQuerySpace);
        this.build(!build);
        return this;
    } else if (v !== undefined && typeof v !== "string") {
        this._parts.query = URI.buildQuery(v, this._parts.duplicateQueryParameters, this._parts.escapeQuerySpace);
        this.build(!build);
        return this;
    } else {
        return q.call(this, v, build);
    }
};
p.setQuery = function(name, value, build) {
    var data = URI.parseQuery(this._parts.query, this._parts.escapeQuerySpace);
    
    if (typeof name === "object") {
        for (var key in name) {
            if (hasOwn.call(name, key)) {
                data[key] = name[key];
            }
        }
    } else if (typeof name === "string") {
        data[name] = value !== undefined ? value : null;
    } else {
        throw new TypeError("URI.addQuery() accepts an object, string as the name parameter");
    }
    
    this._parts.query = URI.buildQuery(data, this._parts.duplicateQueryParameters, this._parts.escapeQuerySpace);
    if (typeof name !== "string") {
        build = value;
    }

    this.build(!build);
    return this;
};
p.addQuery = function(name, value, build) {
    var data = URI.parseQuery(this._parts.query, this._parts.escapeQuerySpace);
    URI.addQuery(data, name, value === undefined ? null : value);
    this._parts.query = URI.buildQuery(data, this._parts.duplicateQueryParameters, this._parts.escapeQuerySpace);
    if (typeof name !== "string") {
        build = value;
    }

    this.build(!build);
    return this;
};
p.removeQuery = function(name, value, build) {
    var data = URI.parseQuery(this._parts.query, this._parts.escapeQuerySpace);
    URI.removeQuery(data, name, value);
    this._parts.query = URI.buildQuery(data, this._parts.duplicateQueryParameters, this._parts.escapeQuerySpace);
    if (typeof name !== "string") {
        build = value;
    }

    this.build(!build);
    return this;
};
p.hasQuery = function(name, value, withinArray) {
    var data = URI.parseQuery(this._parts.query, this._parts.escapeQuerySpace);
    return URI.hasQuery(data, name, value, withinArray);
};
p.setSearch = p.setQuery;
p.addSearch = p.addQuery;
p.removeSearch = p.removeQuery;
p.hasSearch = p.hasQuery;

// sanitizing URLs
p.normalize = function() {
    if (this._parts.urn) {
        return this
            .normalizeProtocol(false)
            .normalizeQuery(false)
            .normalizeFragment(false)
            .build();
    }

    return this
        .normalizeProtocol(false)
        .normalizeHostname(false)
        .normalizePort(false)
        .normalizePath(false)
        .normalizeQuery(false)
        .normalizeFragment(false)
        .build();
};
p.normalizeProtocol = function(build) {
    if (typeof this._parts.protocol === "string") {
        this._parts.protocol = this._parts.protocol.toLowerCase();
        this.build(!build);
    }

    return this;
};
p.normalizeHostname = function(build) {
    if (this._parts.hostname) {
        if (this.is('IDN') && punycode) {
            this._parts.hostname = punycode.toASCII(this._parts.hostname);
        } else if (this.is('IPv6') && IPv6) {
            this._parts.hostname = IPv6.best(this._parts.hostname);
        }

        this._parts.hostname = this._parts.hostname.toLowerCase();
        this.build(!build);
    }

    return this;
};
p.normalizePort = function(build) {
    // remove port of it's the protocol's default
    if (typeof this._parts.protocol === "string" && this._parts.port === URI.defaultPorts[this._parts.protocol]) {
        this._parts.port = null;
        this.build(!build);
    }

    return this;
};
p.normalizePath = function(build) {
    if (this._parts.urn) {
        return this;
    }

    if (!this._parts.path || this._parts.path === '/') {
        return this;
    }

    var _was_relative;
    var _path = this._parts.path;
    var _parent, _pos;

    // handle relative paths
    if (_path.charAt(0) !== '/') {
        _was_relative = true;
        _path = '/' + _path;
    }

    // resolve simples
    _path = _path
        .replace(/(\/(\.\/)+)|(\/\.$)/g, '/')
        .replace(/\/{2,}/g, '/');

    // resolve parents
    while (true) {
        _parent = _path.indexOf('/../');
        if (_parent === -1) {
            // no more ../ to resolve
            break;
        } else if (_parent === 0) {
            // top level cannot be relative...
            _path = _path.substring(3);
            break;
        }

        _pos = _path.substring(0, _parent).lastIndexOf('/');
        if (_pos === -1) {
            _pos = _parent;
        }
        _path = _path.substring(0, _pos) + _path.substring(_parent + 3);
    }

    // revert to relative
    if (_was_relative && this.is('relative')) {
        _path = _path.substring(1);
    }

    _path = URI.recodePath(_path);
    this._parts.path = _path;
    this.build(!build);
    return this;
};
p.normalizePathname = p.normalizePath;
p.normalizeQuery = function(build) {
    if (typeof this._parts.query === "string") {
        if (!this._parts.query.length) {
            this._parts.query = null;
        } else {
            this.query(URI.parseQuery(this._parts.query, this._parts.escapeQuerySpace));
        }

        this.build(!build);
    }

    return this;
};
p.normalizeFragment = function(build) {
    if (!this._parts.fragment) {
        this._parts.fragment = null;
        this.build(!build);
    }

    return this;
};
p.normalizeSearch = p.normalizeQuery;
p.normalizeHash = p.normalizeFragment;

p.iso8859 = function() {
    // expect unicode input, iso8859 output
    var e = URI.encode;
    var d = URI.decode;

    URI.encode = escape;
    URI.decode = decodeURIComponent;
    this.normalize();
    URI.encode = e;
    URI.decode = d;
    return this;
};

p.unicode = function() {
    // expect iso8859 input, unicode output
    var e = URI.encode;
    var d = URI.decode;

    URI.encode = strictEncodeURIComponent;
    URI.decode = unescape;
    this.normalize();
    URI.encode = e;
    URI.decode = d;
    return this;
};

p.readable = function() {
    var uri = this.clone();
    // removing username, password, because they shouldn't be displayed according to RFC 3986
    uri.username("").password("").normalize();
    var t = '';
    if (uri._parts.protocol) {
        t += uri._parts.protocol + '://';
    }

    if (uri._parts.hostname) {
        if (uri.is('punycode') && punycode) {
            t += punycode.toUnicode(uri._parts.hostname);
            if (uri._parts.port) {
                t += ":" + uri._parts.port;
            }
        } else {
            t += uri.host();
        }
    }

    if (uri._parts.hostname && uri._parts.path && uri._parts.path.charAt(0) !== '/') {
        t += '/';
    }

    t += uri.path(true);
    if (uri._parts.query) {
        var q = '';
        for (var i = 0, qp = uri._parts.query.split('&'), l = qp.length; i < l; i++) {
            var kv = (qp[i] || "").split('=');
            q += '&' + URI.decodeQuery(kv[0], this._parts.escapeQuerySpace)
                .replace(/&/g, '%26');

            if (kv[1] !== undefined) {
                q += "=" + URI.decodeQuery(kv[1], this._parts.escapeQuerySpace)
                    .replace(/&/g, '%26');
            }
        }
        t += '?' + q.substring(1);
    }

    t += URI.decodeQuery(uri.hash(), true);
    return t;
};

// resolving relative and absolute URLs
p.absoluteTo = function(base) {
    var resolved = this.clone();
    var properties = ['protocol', 'username', 'password', 'hostname', 'port'];
    var basedir, i, p;

    if (this._parts.urn) {
        throw new Error('URNs do not have any generally defined hierarchical components');
    }

    if (!(base instanceof URI)) {
        base = new URI(base);
    }
    
    if (!resolved._parts.protocol) {
        resolved._parts.protocol = base._parts.protocol;
    }
    
    if (this._parts.hostname) {
        return resolved;
    }

    for (i = 0; p = properties[i]; i++) {
        resolved._parts[p] = base._parts[p];
    }
    
    properties = ['query', 'path'];
    for (i = 0; p = properties[i]; i++) {
        if (!resolved._parts[p] && base._parts[p]) {
            resolved._parts[p] = base._parts[p];
        }
    }

    if (resolved.path().charAt(0) !== '/') {
        basedir = base.directory();
        resolved._parts.path = (basedir ? (basedir + '/') : '') + resolved._parts.path;
        resolved.normalizePath();
    }

    resolved.build();
    return resolved;
};
p.relativeTo = function(base) {
    var relative = this.clone().normalize();
    var relativeParts, baseParts, common, relativePath, basePath;

    if (relative._parts.urn) {
        throw new Error('URNs do not have any generally defined hierarchical components');
    }

    base = new URI(base).normalize();
    relativeParts = relative._parts;
    baseParts = base._parts;
    relativePath = relative.path();
    basePath = base.path();

    if (relativePath.charAt(0) !== '/') {
        throw new Error('URI is already relative');
    }

    if (basePath.charAt(0) !== '/') {
        throw new Error('Cannot calculate a URI relative to another relative URI');
    }

    if (relativeParts.protocol === baseParts.protocol) {
        relativeParts.protocol = null;
    }

    if (relativeParts.username !== baseParts.username || relativeParts.password !== baseParts.password) {
        return relative.build();
    }

    if (relativeParts.protocol !== null || relativeParts.username !== null || relativeParts.password !== null) {
        return relative.build();
    }

    if (relativeParts.hostname === baseParts.hostname && relativeParts.port === baseParts.port) {
        relativeParts.hostname = null;
        relativeParts.port = null;
    } else {
        return relative.build();
    }

    if (relativePath === basePath) {
        relativeParts.path = '';
        return relative.build();
    }
    
    // determine common sub path
    common = URI.commonPath(relative.path(), base.path());

    // If the paths have nothing in common, return a relative URL with the absolute path.
    if (!common) {
        return relative.build();
    }

    var parents = baseParts.path
        .substring(common.length)
        .replace(/[^\/]*$/, '')
        .replace(/.*?\//g, '../');

    relativeParts.path = parents + relativeParts.path.substring(common.length);

    return relative.build();
};

// comparing URIs
p.equals = function(uri) {
    var one = this.clone();
    var two = new URI(uri);
    var one_map = {};
    var two_map = {};
    var checked = {};
    var one_query, two_query, key;

    one.normalize();
    two.normalize();

    // exact match
    if (one.toString() === two.toString()) {
        return true;
    }

    // extract query string
    one_query = one.query();
    two_query = two.query();
    one.query("");
    two.query("");

    // definitely not equal if not even non-query parts match
    if (one.toString() !== two.toString()) {
        return false;
    }

    // query parameters have the same length, even if they're permuted
    if (one_query.length !== two_query.length) {
        return false;
    }

    one_map = URI.parseQuery(one_query, this._parts.escapeQuerySpace);
    two_map = URI.parseQuery(two_query, this._parts.escapeQuerySpace);

    for (key in one_map) {
        if (hasOwn.call(one_map, key)) {
            if (!isArray(one_map[key])) {
                if (one_map[key] !== two_map[key]) {
                    return false;
                }
            } else if (!arraysEqual(one_map[key], two_map[key])) {
                return false;
            }

            checked[key] = true;
        }
    }

    for (key in two_map) {
        if (hasOwn.call(two_map, key)) {
            if (!checked[key]) {
                // two contains a parameter not present in one
                return false;
            }
        }
    }

    return true;
};

// state
p.duplicateQueryParameters = function(v) {
    this._parts.duplicateQueryParameters = !!v;
    return this;
};

p.escapeQuerySpace = function(v) {
    this._parts.escapeQuerySpace = !!v;
    return this;
};

return URI;
}));
/*!
 * UI development toolkit for HTML5 (OpenUI5)
 * (c) Copyright 2009-2015 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */

/*global URI, Promise, ES6Promise, alert, confirm, console, XMLHttpRequest*/

/**
 * @class Provides base functionality of the SAP jQuery plugin as extension of the jQuery framework.<br/>
 * See also <a href="http://api.jquery.com/jQuery/">jQuery</a> for details.<br/>
 * Although these functions appear as static ones, they are meant to be used on jQuery instances.<br/>
 * If not stated differently, the functions follow the fluent interface paradigm and return the jQuery instance for chaining of statements.
 *
 * Example for usage of an instance method:
 * <pre>
 *   var oRect = jQuery("#myDiv").rect();
 *   alert("Top Position: " + oRect.top);
 * </pre>
 *
 * @name jQuery
 * @static
 * @public
 */

(function() {

	if (!window.jQuery ) {
		throw new Error("SAPUI5 requires jQuery as a prerequisite (>= version 1.7)");
	}

	// ensure not to initialize twice
	if (jQuery.sap) {
		return;
	}

	// Enable promise polyfill if native promise is not available
	if (!window.Promise) {
		ES6Promise.polyfill();
	}

	/**
	 * Window that the sap plugin has been initialized for.
	 * @private
	 */
	var _window = window;

	// early logging support
	var _earlyLogs = [];
	function _earlyLog(sLevel, sMessage) {
		_earlyLogs.push({
			level: sLevel,
			message: sMessage
		});
	}

	var _sBootstrapUrl;

	// -------------------------- VERSION -------------------------------------

	var rVersion = /^[0-9]+(?:\.([0-9]+)(?:\.([0-9]+))?)?(.*)$/;

	/**
	 * Returns a Version instance created from the given parameters.
	 *
	 * This function can either be called as a constructor (using <code>new</code>) or as a normal function.
	 * It always returns an immutable Version instance.
	 *
	 * The parts of the version number (major, minor, patch, suffix) can be provided in several ways:
	 * <ul>
	 * <li>Version("1.2.3-SNAPSHOT") - as a dot-separated string. Any non-numerical char or a dot followed by a non-numerical char starts the suffix portion.
	 * Any missing major, minor or patch versions will be set to 0.</li>
	 * <li>Version(1,2,3,"-SNAPSHOT") - as individual parameters. Major, minor and patch must be integer numbers or empty, suffix must be a string not starting with digits.</li>
	 * <li>Version([1,2,3,"-SNAPSHOT"]) - as an array with the individual parts. The same type restrictions apply as before.</li>
	 * <li>Version(otherVersion) - as a Version instance (cast operation). Returns the given instance instead of creating a new one.</li>
	 * </ul>
	 *
	 * To keep the code size small, this implementation mainly validates the single string variant.
	 * All other variants are only validated to some degree. It is the responsibility of the caller to
	 * provide proper parts.
	 *
	 * @param {int|string|any[]|jQuery.sap.Version} vMajor the major part of the version (int) or any of the single parameter variants explained above.
	 * @param {int} iMinor the minor part of the version number
	 * @param {int} iPatch the patch part of the version number
	 * @param {string} sSuffix the suffix part of the version number
	 * @return {jQuery.sap.Version} the version object as determined from the parameters
	 *
	 * @class Represents a version consisting of major, minor, patch version and suffix, e.g. '1.2.7-SNAPSHOT'.
	 *
	 * @author SAP SE
	 * @version 1.32.9
	 * @constructor
	 * @public
	 * @since 1.15.0
	 * @name jQuery.sap.Version
	 */
	function Version(vMajor, iMinor, iPatch, sSuffix) {
		if ( vMajor instanceof Version ) {
			// note: even a constructor may return a value different from 'this'
			return vMajor;
		}
		if ( !(this instanceof Version) ) {
			// act as a cast operator when called as function (not as a constructor)
			return new Version(vMajor, iMinor, iPatch, sSuffix);
		}

		var m;
		if (typeof vMajor === "string") {
			m = rVersion.exec(vMajor);
		} else if (jQuery.isArray(vMajor)) {
			m = vMajor;
		} else {
			m = arguments;
		}
		m = m || [];

		function norm(v) {
			v = parseInt(v,10);
			return isNaN(v) ? 0 : v;
		}
		vMajor = norm(m[0]);
		iMinor = norm(m[1]);
		iPatch = norm(m[2]);
		sSuffix = String(m[3] || "");

		/**
		 * Returns a string representation of this version.
		 *
		 * @return {string} a string representation of this version.
		 * @name jQuery.sap.Version#toString
		 * @public
		 * @since 1.15.0
		 * @function
		 */
		this.toString = function() {
			return vMajor + "." + iMinor + "." + iPatch + sSuffix;
		};

		/**
		 * Returns the major version part of this version.
		 *
		 * @return {int} the major version part of this version
		 * @name jQuery.sap.Version#getMajor
		 * @public
		 * @since 1.15.0
		 * @function
		 */
		this.getMajor = function() {
			return vMajor;
		};

		/**
		 * Returns the minor version part of this version.
		 *
		 * @return {int} the minor version part of this version
		 * @name jQuery.sap.Version#getMinor
		 * @public
		 * @since 1.15.0
		 * @function
		 */
		this.getMinor = function() {
			return iMinor;
		};

		/**
		 * Returns the patch (or micro) version part of this version.
		 *
		 * @return {int} the patch version part of this version
		 * @name jQuery.sap.Version#getPatch
		 * @public
		 * @since 1.15.0
		 * @function
		 */
		this.getPatch = function() {
			return iPatch;
		};

		/**
		 * Returns the version suffix of this version.
		 *
		 * @return {string} the version suffix of this version
		 * @name jQuery.sap.Version#getSuffix
		 * @public
		 * @since 1.15.0
		 * @function
		 */
		this.getSuffix = function() {
			return sSuffix;
		};

		/**
		 * Compares this version with a given one.
		 *
		 * The version with which this version should be compared can be given as
		 * <code>jQuery.sap.Version</code> instance, as a string (e.g. <code>v.compareto("1.4.5")</code>)
		 * or major, minor, patch and suffix cab be given as separate parameters (e.g. <code>v.compareTo(1, 4, 5)</code>)
		 * or in an array (e.g. <code>v.compareTo([1, 4, 5])</code>).
		 *
		 * @return {int} 0, if the given version is equal to this version, a negative value if the given version is greater and a positive value otherwise
		 * @name jQuery.sap.Version#compareTo
		 * @public
		 * @since 1.15.0
		 * @function
		 */
		this.compareTo = function() {
			var vOther = Version.apply(window, arguments);
			/*eslint-disable no-nested-ternary */
			return vMajor - vOther.getMajor() ||
					iMinor - vOther.getMinor() ||
					iPatch - vOther.getPatch() ||
					((sSuffix < vOther.getSuffix()) ? -1 : (sSuffix === vOther.getSuffix()) ? 0 : 1);
			/*eslint-enable no-nested-ternary */
		};

	}

	/**
	 * Checks whether this version is in the range of the given versions (start included, end excluded).
	 *
	 * The boundaries against which this version should be checked can be given as
	 * <code>jQuery.sap.Version</code> instances (e.g. <code>v.inRange(v1, v2)</code>), as strings (e.g. <code>v.inRange("1.4", "2.7")</code>)
	 * or as arrays (e.g. <code>v.inRange([1,4], [2,7])</code>).
	 *
	 * @param {string|any[]|jQuery.sap.Version} vMin the start of the range (inclusive)
	 * @param {string|any[]|jQuery.sap.Version} vMax the end of the range (exclusive)
	 * @return {boolean} <code>true</code> if this version is greater or equal to <code>vMin</code> and smaller than <code>vMax</code>, <code>false</code> otherwise.
	 * @name jQuery.sap.Version#inRange
	 * @public
	 * @since 1.15.0
	 * @function
	 */
	Version.prototype.inRange = function(vMin, vMax) {
		return this.compareTo(vMin) >= 0 && this.compareTo(vMax) < 0;
	};

	// -----------------------------------------------------------------------

	var oJQVersion = Version(jQuery.fn.jquery);
	if ( !oJQVersion.inRange("1.7.0", "2.2.0") ) {
		_earlyLog("error", "SAPUI5 requires a jQuery version of 1.7 or higher, but lower than 2.2; current version is " + jQuery.fn.jquery);
	}

	// TODO move to a separate module? Only adds 385 bytes (compressed), but...
	if ( !jQuery.browser ) {
		// re-introduce the jQuery.browser support if missing (jQuery-1.9ff)
		jQuery.browser = (function( ua ) {

			var rwebkit = /(webkit)[ \/]([\w.]+)/,
				ropera = /(opera)(?:.*version)?[ \/]([\w.]+)/,
				rmsie = /(msie) ([\w.]+)/,
				rmozilla = /(mozilla)(?:.*? rv:([\w.]+))?/,
				ua = ua.toLowerCase(),
				match = rwebkit.exec( ua ) ||
					ropera.exec( ua ) ||
					rmsie.exec( ua ) ||
					ua.indexOf("compatible") < 0 && rmozilla.exec( ua ) ||
					[],
				browser = {};

			if ( match[1] ) {
				browser[ match[1] ] = true;
				browser.version = match[2] || "0";
				if ( browser.webkit ) {
					browser.safari = true;
				}
			}

			return browser;

		}(window.navigator.userAgent));
	}

	// XHR overrides for IE
	if (!!sap.ui.Device.browser.internet_explorer) {

		// Fixes the CORS issue (introduced by jQuery 1.7) when loading resources
		// (e.g. SAPUI5 script) from other domains for IE browsers.
		// The CORS check in jQuery filters out such browsers who do not have the
		// property "withCredentials" which is the IE and Opera and prevents those
		// browsers to request data from other domains with jQuery.ajax. The CORS
		// requests are simply forbidden nevertheless if it works. In our case we
		// simply load our script resources from another domain when using the CDN
		// variant of SAPUI5. The following fix is also recommended by jQuery:
		jQuery.support = jQuery.support || {};
		jQuery.support.cors = true;

		// Fixes XHR factory issue (introduced by jQuery 1.11). In case of IE
		// it uses by mistake the ActiveXObject XHR. In the list of XHR supported
		// HTTP methods PATCH and MERGE are missing which are required for OData.
		// The related ticket is: #2068 (no downported to jQuery 1.x planned)
		var oJQV = Version(jQuery.fn.jquery);
		// the fix will only be applied to jQuery >= 1.11.0 (only for jQuery 1.x)
		if (window.ActiveXObject !== undefined && oJQV.getMajor() == 1 && oJQV.getMinor() >= 11) {
			var fnCreateStandardXHR = function() {
				try {
					return new window.XMLHttpRequest();
				} catch (e) { /* ignore */ }
			};
			var fnCreateActiveXHR = function() {
				try {
					return new window.ActiveXObject("Microsoft.XMLHTTP");
				} catch (e) { /* ignore */ }
			};
			jQuery.ajaxSettings = jQuery.ajaxSettings || {};
			jQuery.ajaxSettings.xhr = function() {
				return !this.isLocal ? fnCreateStandardXHR() : fnCreateActiveXHR();
			};
		}

	}

	/**
	 * Find the script URL where the SAPUI5 is loaded from and return an object which
	 * contains the identified script-tag and resource root
	 */
	var _oBootstrap = (function() {
		var oTag, sUrl, sResourceRoot,
			reConfigurator = /^(.*\/)?download\/configurator[\/\?]/,
			reBootScripts = /^(.*\/)?(sap-ui-(core|custom|boot|merged)(-.*)?)\.js([?#]|$)/,
			reResources = /^(.*\/)?resources\//;

		// check all script tags that have a src attribute
		jQuery("script[src]").each(function() {
			var src = this.getAttribute("src"),
				m;
			if ( (m = src.match(reConfigurator)) !== null ) {
				// guess 1: script tag src contains "/download/configurator[/?]" (for dynamically created bootstrap files)
				oTag = this;
				sUrl = src;
				sResourceRoot = (m[1] || "") + "resources/";
				return false;
			} else if ( (m = src.match(reBootScripts)) !== null ) {
				// guess 2: src contains one of the well known boot script names
				oTag = this;
				sUrl = src;
				sResourceRoot = m[1] || "";
				return false;
			} else if ( this.id == 'sap-ui-bootstrap' && (m = src.match(reResources)) ) {
				// guess 2: script tag has well known id and src contains "resources/"
				oTag = this;
				sUrl = src;
				sResourceRoot = m[0];
				return false;
			}
		});
		return {
			tag: oTag,
			url: sUrl,
			resourceRoot: sResourceRoot
		};
	})();

	/**
	 * Determine whether sap-bootstrap-debug is set, run debugger statement and allow
	 * to restart the core from a new URL
	 */
	(function() {
		if (/sap-bootstrap-debug=(true|x|X)/.test(location.search)) {
			// Dear developer, the way to reload UI5 from a different location has changed: it can now be directly configured in the support popup (Ctrl-Alt-Shift-P),
			// without stepping into the debugger.
			// However, for convenience or cases where this popup is disabled, or for other usages of an early breakpoint, the "sap-bootstrap-debug" URL parameter option is still available.
			// To reboot an alternative core just step down a few lines and set sRebootUrl
			/*eslint-disable no-debugger */
			debugger;
		}

		// Check local storage for booting a different core
		var sRebootUrl;
		try { // Necessary for FF when Cookies are disabled
			sRebootUrl = window.localStorage.getItem("sap-ui-reboot-URL");
			window.localStorage.removeItem("sap-ui-reboot-URL"); // only reboot once from there (to avoid a deadlock when the alternative core is broken)
		} catch (e) { /* no warning, as this will happen on every startup, depending on browser settings */ }

		if (sRebootUrl && sRebootUrl !== "undefined") { // sic! It can be a string.
			/*eslint-disable no-alert*/
			var bUserConfirmed = confirm("WARNING!\n\nUI5 will be booted from the URL below.\nPress 'Cancel' unless you have configured this.\n\n" + sRebootUrl);
			/*eslint-enable no-alert*/

			if (bUserConfirmed) {
				// replace the bootstrap tag with a newly created script tag to enable restarting the core from a different server
				var oScript = _oBootstrap.tag,
					sScript = "<script src=\"" + sRebootUrl + "\"";
				jQuery.each(oScript.attributes, function(i, oAttr) {
					if (oAttr.nodeName.indexOf("data-sap-ui-") == 0) {
						sScript += " " + oAttr.nodeName + "=\"" + oAttr.nodeValue.replace(/"/g, "&quot;") + "\"";
					}
				});
				sScript += "></script>";
				oScript.parentNode.removeChild(oScript);

				// clean up cachebuster stuff
				jQuery("#sap-ui-bootstrap-cachebusted").remove();
				window["sap-ui-config"] && window["sap-ui-config"].resourceRoots && (window["sap-ui-config"].resourceRoots[""] = undefined);

				document.write(sScript);

				// now this core commits suicide to enable clean loading of the other core
				var oRestart = new Error("This is not a real error. Aborting UI5 bootstrap and rebooting from: " + sRebootUrl);
				oRestart.name = "Restart";
				throw oRestart;
			}
		}
	})();

	/**
	 * Determine whether to use debug sources depending on URL parameter and local storage
	 * and load debug library if necessary
	 */
	(function() {
		//Check URI param
		var bDebugSources = /sap-ui-debug=(true|x|X)/.test(location.search),
			bIsOptimized = window["sap-ui-optimized"];

		//Check local storage
		try {
			bDebugSources = bDebugSources || (window.localStorage.getItem("sap-ui-debug") == "X");
		} catch (e) {
			//Happens in FF when Cookies are deactivated
		}

		window["sap-ui-debug"] = bDebugSources;

		// if bootstap URL already contains -dbg URL, just set sap-ui-loaddbg
		if (/-dbg\.js([?#]|$)/.test(_oBootstrap.url)) {
			window["sap-ui-loaddbg"] = true;
			window["sap-ui-debug"] = true;
		}

		// if current sources are optimized and debug sources are wanted, restart with debug URL
		if (bIsOptimized && bDebugSources) {
			var sDebugUrl = _oBootstrap.url.replace(/\/(?:sap-ui-cachebuster\/)?([^\/]+)\.js/, "/$1-dbg.js");
			window["sap-ui-optimized"] = false;
			window["sap-ui-loaddbg"] = true;
			document.write("<script type=\"text/javascript\" src=\"" + sDebugUrl + "\"></script>");
			var oRestart = new Error("Aborting UI5 bootstrap and restarting from: " + sDebugUrl);
			oRestart.name = "Restart";
			throw oRestart;
		}
	})();

	/*
	 * Merged, raw (un-interpreted) configuration data from the following sources
	 * (last one wins)
	 * <ol>
	 * <li>global configuration object <code>window["sap-ui-config"]</code> (could be either a string/url or a configuration object)</li>
	 * <li><code>data-sap-ui-config</code> attribute of the bootstrap script tag</li>
	 * <li>other <code>data-sap-ui-<i>xyz</i></code> attributes of the bootstrap tag</li>
	 * </ol>
	 */
	var oCfgData = _window["sap-ui-config"] = (function() {

		function normalize(o) {
			jQuery.each(o, function(i, v) {
				var il = i.toLowerCase();
				if ( !o.hasOwnProperty(il) ) {
					o[il] = v;
					delete o[i];
				}
			});
			return o;
		}

		var oScriptTag = _oBootstrap.tag,
			oCfg = _window["sap-ui-config"],
			sCfgFile = "sap-ui-config.json";

		// load the configuration from an external JSON file
		if (typeof oCfg === "string") {
			_earlyLog("warning", "Loading external bootstrap configuration from \"" + oCfg + "\". This is a design time feature and not for productive usage!");
			if (oCfg !== sCfgFile) {
				_earlyLog("warning", "The external bootstrap configuration file should be named \"" + sCfgFile + "\"!");
			}
			jQuery.ajax({
				url : oCfg,
				dataType : 'json',
				async : false,
				success : function(oData, sTextStatus, jqXHR) {
					oCfg = oData;
				},
				error : function(jqXHR, sTextStatus, oError) {
					_earlyLog("error", "Loading externalized bootstrap configuration from \"" + oCfg + "\" failed! Reason: " + oError + "!");
					oCfg = undefined;
				}
			});
		}

		oCfg = normalize(oCfg || {});
		oCfg.resourceroots = oCfg.resourceroots || {};
		oCfg.themeroots = oCfg.themeroots || {};
		oCfg.resourceroots[''] = oCfg.resourceroots[''] || _oBootstrap.resourceRoot;

		oCfg['xx-loadallmode'] = /(^|\/)(sap-?ui5|[^\/]+-all).js([?#]|$)/.test(_oBootstrap.url);

		// if a script tag has been identified, collect its configuration info
		if ( oScriptTag ) {
			// evaluate the config attribute first - if present
			var sConfig = oScriptTag.getAttribute("data-sap-ui-config");
			if ( sConfig ) {
				try {
					/*eslint-disable no-new-func */
					jQuery.extend(oCfg, normalize((new Function("return {" + sConfig + "};"))())); // TODO jQuery.parseJSON would be better but imposes unwanted restrictions on valid syntax
					/*eslint-enable no-new-func */
				} catch (e) {
					// no log yet, how to report this error?
					_earlyLog("error", "failed to parse data-sap-ui-config attribute: " + (e.message || e));
				}
			}

			// merge with any existing "data-sap-ui-" attributes
			jQuery.each(oScriptTag.attributes, function(i, attr) {
				var m = attr.name.match(/^data-sap-ui-(.*)$/);
				if ( m ) {
					// the following (deactivated) conversion would implement multi-word names like "resource-roots"
					m = m[1].toLowerCase(); // .replace(/\-([a-z])/g, function(s,w) { return w.toUpperCase(); })
					if ( m === 'resourceroots' ) {
						// merge map entries instead of overwriting map
						jQuery.extend(oCfg[m], jQuery.parseJSON(attr.value));
					} else if ( m === 'theme-roots' ) {
						// merge map entries, but rename to camelCase
						jQuery.extend(oCfg.themeroots, jQuery.parseJSON(attr.value));
					} else if ( m !== 'config' ) {
						oCfg[m] = attr.value;
					}
				}
			});
		}

		return oCfg;
	}());

	// check whether noConflict must be used...
	if ( oCfgData.noconflict === true || oCfgData.noconflict === "true"  || oCfgData.noconflict === "x" ) {
		jQuery.noConflict();
	}

	/**
	 * Root Namespace for the jQuery plug-in provided by SAP SE.
	 *
	 * @version 1.32.9
	 * @namespace
	 * @public
	 * @static
	 */
	jQuery.sap = {};

	// -------------------------- VERSION -------------------------------------

	jQuery.sap.Version = Version;

	// -------------------------- PERFORMANCE NOW -------------------------------------
	/**
	 * Returns a high resolution timestamp for measurements.
	 * The timestamp is based on 01/01/1970 00:00:00 as float with microsecond precision or
	 * with millisecond precision, if high resolution timestamps are not available.
	 * The fractional part of the timestamp represents microseconds.
	 * Converting to a <code>Date</code> is possible using <code>new Date(jQuery.sap.now())</code>
	 *
	 * @public
	 * @returns {float} high resolution timestamp for measurements
	 */
	jQuery.sap.now = !(window.performance && window.performance.now && window.performance.timing) ? Date.now : function() {
		return window.performance.timing.navigationStart + window.performance.now();
	};

	// -------------------------- DEBUG LOCAL STORAGE -------------------------------------
	jQuery.sap.debug = function(bEnable) {
		if (!window.localStorage) {
			return null;
		}

		function reloadHint(bUsesDbgSrc){
			/*eslint-disable no-alert */
			alert("Usage of debug sources is " + (bUsesDbgSrc ? "on" : "off") + " now.\nFor the change to take effect, you need to reload the page.");
			/*eslint-enable no-alert */
		}

		if (bEnable === true) {
			window.localStorage.setItem("sap-ui-debug", "X");
			reloadHint(true);
		} else if (bEnable === false) {
			window.localStorage.removeItem("sap-ui-debug");
			reloadHint(false);
		}

		return window.localStorage.getItem("sap-ui-debug") == "X";
	};

	/**
	 * Sets the URL to reboot this app from, the next time it is started. Only works with localStorage API available
	 * (and depending on the browser, if cookies are enabled, even though cookies are not used).
	 *
	 * @param sRebootUrl the URL to sap-ui-core.js, from which the application should load UI5 on next restart; undefined clears the restart URL
	 * @returns the current reboot URL or undefined in case of an error or when the reboot URL has been cleared
	 *
	 * @private
	 */
	jQuery.sap.setReboot = function(sRebootUrl) { // null-ish clears the reboot request
		var sUrl;
		if (!window.localStorage) {
			return null;
		}

		try {
			if (sRebootUrl) {
				window.localStorage.setItem("sap-ui-reboot-URL", sRebootUrl); // remember URL to reboot from

				/*eslint-disable no-alert */
				alert("Next time this app is launched (only once), it will load UI5 from:\n" + sRebootUrl + ".\nPlease reload the application page now.");
				/*eslint-enable no-alert */

			} else {
				window.localStorage.removeItem("sap-ui-reboot-URL"); // clear reboot URL, so app will start normally
			}

			sUrl =  window.localStorage.getItem("sap-ui-reboot-URL");
		} catch (e) {
			jQuery.sap.log.warning("Could not access localStorage while setting reboot URL '" + sRebootUrl + "' (are cookies disabled?): " + e.message);
		}

		return sUrl;
	};

	// -------------------------- STATISTICS LOCAL STORAGE -------------------------------------

	jQuery.sap.statistics = function(bEnable) {
		if (!window.localStorage) {
			return null;
		}

		function gatewayStatsHint(bUsesDbgSrc){
			/*eslint-disable no-alert */
			alert("Usage of Gateway statistics " + (bUsesDbgSrc ? "on" : "off") + " now.\nFor the change to take effect, you need to reload the page.");
			/*eslint-enable no-alert */
		}

		if (bEnable === true) {
			window.localStorage.setItem("sap-ui-statistics", "X");
			gatewayStatsHint(true);
		} else if (bEnable === false) {
			window.localStorage.removeItem("sap-ui-statistics");
			gatewayStatsHint(false);
		}

		return window.localStorage.getItem("sap-ui-statistics") == "X";
	};

	// -------------------------- Logging -------------------------------------

	(function() {

		var FATAL = 0, ERROR = 1, WARNING = 2, INFO = 3, DEBUG = 4, TRACE = 5,

		/**
		 * Unique prefix for this instance of the core in a multi-frame environment.
		 */
			sWindowName = (window.top == window) ? "" : "[" + window.location.pathname.split('/').slice(-1)[0] + "] ",
		// Note: comparison must use type coercion (==, not ===), otherwise test fails in IE

		/**
		 * The array that holds the log entries that have been recorded so far
		 */
			aLog = [],

		/**
		 * Maximum log level to be recorded (per component).
		 */
			mMaxLevel = { '' : ERROR },

		/**
		 * Registered listener to be informed about new log entries.
		 */
			oListener = null;

		function pad0(i,w) {
			return ("000" + String(i)).slice(-w);
		}

		function level(sComponent) {
			return (!sComponent || isNaN(mMaxLevel[sComponent])) ? mMaxLevel[''] : mMaxLevel[sComponent];
		}

		function listener(){
			if (!oListener) {
				oListener = {
					listeners: [],
					onLogEntry: function(oLogEntry){
						for (var i = 0; i < oListener.listeners.length; i++) {
							if (oListener.listeners[i].onLogEntry) {
								oListener.listeners[i].onLogEntry(oLogEntry);
							}
						}
					},
					attach: function(oLogger, oLstnr){
						if (oLstnr) {
							oListener.listeners.push(oLstnr);
							if (oLstnr.onAttachToLog) {
								oLstnr.onAttachToLog(oLogger);
							}
						}
					},
					detach: function(oLogger, oLstnr){
						for (var i = 0; i < oListener.listeners.length; i++) {
							if (oListener.listeners[i] === oLstnr) {
								if (oLstnr.onDetachFromLog) {
									oLstnr.onDetachFromLog(oLogger);
								}
								oListener.listeners.splice(i,1);
								return;
							}
						}
					}
				};
			}
			return oListener;
		}

		/**
		 * Creates a new log entry depending on its level and component.
		 *
		 * If the given level is higher than the max level for the given component
		 * (or higher than the global level, if no component is given),
		 * then no entry is created.
		 */
		function log(iLevel, sMessage, sDetails, sComponent) {
			if (iLevel <= level(sComponent) ) {
				var fNow =  jQuery.sap.now(),
					oNow = new Date(fNow),
					iMicroSeconds = Math.floor((fNow - Math.floor(fNow)) * 1000),
					oLogEntry = {
						time     : pad0(oNow.getHours(),2) + ":" + pad0(oNow.getMinutes(),2) + ":" + pad0(oNow.getSeconds(),2) + "." + pad0(oNow.getMilliseconds(),3) + pad0(iMicroSeconds,3),
						date     : pad0(oNow.getFullYear(),4) + "-" + pad0(oNow.getMonth() + 1,2) + "-" + pad0(oNow.getDate(),2),
						timestamp: fNow,
						level    : iLevel,
						message  : String(sMessage || ""),
						details  : String(sDetails || ""),
						component: String(sComponent || "")
					};
				aLog.push( oLogEntry );
				if (oListener) {
					oListener.onLogEntry(oLogEntry);
				}

				/*
				 * Console Log, also tries to log to the window.console, if available.
				 *
				 * Unfortunately, the support for window.console is quite different between the UI5 browsers. The most important differences are:
				 * - in IE (checked until IE9), the console object does not exist in a window, until the developer tools are opened for that window.
				 *   After opening the dev tools, the console remains available even when the tools are closed again. Only using a new window (or tab)
				 *   restores the old state without console.
				 *   When the console is available, it provides most standard methods, but not debug and trace
				 * - in FF3.6 the console is not available, until FireBug is opened. It disappears again, when fire bug is closed.
				 *   But when the settings for a web site are stored (convenience), the console remains open
				 *   When the console is available, it supports all relevant methods
				 * - in FF9.0, the console is always available, but method assert is only available when firebug is open
				 * - in Webkit browsers, the console object is always available and has all required methods
				 *   - Exception: in the iOS Simulator, console.info() does not exist
				 */
				/*eslint-disable no-console */
				if (window.console) { // in IE and FF, console might not exist; in FF it might even disappear
					var logText = oLogEntry.date + " " + oLogEntry.time + " " + sWindowName + oLogEntry.message + " - " + oLogEntry.details + " " + oLogEntry.component;
					switch (iLevel) {
					case FATAL:
					case ERROR: console.error(logText); break;
					case WARNING: console.warn(logText); break;
					case INFO: console.info ? console.info(logText) : console.log(logText); break;    // info not available in iOS simulator
					case DEBUG: console.debug ? console.debug(logText) : console.log(logText); break; // debug not available in IE, fallback to log
					case TRACE: console.trace ? console.trace(logText) : console.log(logText); break; // trace not available in IE, fallback to log (no trace)
					}
				}
				/*eslint-enable no-console */
				return oLogEntry;
			}
		}

		/**
		 * Creates a new Logger instance which will use the given component string
		 * for all logged messages without a specific component.
		 *
		 * @param {string} sDefaultComponent
		 *
		 * @class A Logger class
		 * @name jQuery.sap.log.Logger
		 * @since 1.1.2
		 * @public
		 */
		function Logger(sDefaultComponent) {

			/**
			 * Creates a new fatal-level entry in the log with the given message, details and calling component.
			 *
			 * @param {string} sMessage Message text to display
			 * @param {string} [sDetails=''] Details about the message, might be omitted
			 * @param {string} [sComponent=''] Name of the component that produced the log entry
			 * @return {jQuery.sap.log.Logger} The log instance for method chaining
			 * @name jQuery.sap.log.Logger#fatal
			 * @function
			 * @public
			 * @SecSink {0 1 2|SECRET} Could expose secret data in logs
			 */
			this.fatal = function (sMessage, sDetails, sComponent) {
				log(FATAL, sMessage, sDetails, sComponent || sDefaultComponent);
				return this;
			};

			/**
			 * Creates a new error-level entry in the log with the given message, details and calling component.
			 *
			 * @param {string} sMessage Message text to display
			 * @param {string} [sDetails=''] Details about the message, might be omitted
			 * @param {string} [sComponent=''] Name of the component that produced the log entry
			 * @return {jQuery.sap.log.Logger} The log instance
			 * @name jQuery.sap.log.Logger#error
			 * @function
			 * @public
			 * @SecSink {0 1 2|SECRET} Could expose secret data in logs
			 */
			this.error = function error(sMessage, sDetails, sComponent) {
				log(ERROR, sMessage, sDetails, sComponent || sDefaultComponent);
				return this;
			};

			/**
			 * Creates a new warning-level entry in the log with the given message, details and calling component.
			 *
			 * @param {string} sMessage Message text to display
			 * @param {string} [sDetails=''] Details about the message, might be omitted
			 * @param {string} [sComponent=''] Name of the component that produced the log entry
			 * @return {jQuery.sap.log.Logger} The log instance
			 * @name jQuery.sap.log.Logger#warning
			 * @function
			 * @public
			 * @SecSink {0 1 2|SECRET} Could expose secret data in logs
			 */
			this.warning = function warning(sMessage, sDetails, sComponent) {
				log(WARNING, sMessage, sDetails, sComponent || sDefaultComponent);
				return this;
			};
			/**
			 * Creates a new info-level entry in the log with the given message, details and calling component.
			 *
			 * @param {string} sMessage Message text to display
			 * @param {string} [sDetails=''] Details about the message, might be omitted
			 * @param {string} [sComponent=''] Name of the component that produced the log entry
			 * @return {jQuery.sap.log.Logger} The log instance
			 * @name jQuery.sap.log.Logger#info
			 * @function
			 * @public
			 * @SecSink {0 1 2|SECRET} Could expose secret data in logs
			 */
			this.info = function info(sMessage, sDetails, sComponent) {
				log(INFO, sMessage, sDetails, sComponent || sDefaultComponent);
				return this;
			};
			/**
			 * Creates a new debug-level entry in the log with the given message, details and calling component.
			 *
			 * @param {string} sMessage Message text to display
			 * @param {string} [sDetails=''] Details about the message, might be omitted
			 * @param {string} [sComponent=''] Name of the component that produced the log entry
			 * @return {jQuery.sap.log.Logger} The log instance
			 * @name jQuery.sap.log.Logger#debug
			 * @function
			 * @public
			 * @SecSink {0 1 2|SECRET} Could expose secret data in logs
			 */
			this.debug = function debug(sMessage, sDetails, sComponent) {
				log(DEBUG, sMessage, sDetails, sComponent || sDefaultComponent);
				return this;
			};
			/**
			 * Creates a new trace-level entry in the log with the given message, details and calling component.
			 *
			 * @param {string} sMessage Message text to display
			 * @param {string} [sDetails=''] Details about the message, might be omitted
			 * @param {string} [sComponent=''] Name of the component that produced the log entry
			 * @return {jQuery.sap.log.Logger} The log-instance
			 * @name jQuery.sap.log.Logger#trace
			 * @function
			 * @public
			 * @SecSink {0 1 2|SECRET} Could expose secret data in logs
			 */
			this.trace = function trace(sMessage, sDetails, sComponent) {
				log(TRACE, sMessage, sDetails, sComponent || sDefaultComponent);
				return this;
			};

			/**
			 * Defines the maximum jQuery.sap.log.Level of log entries that will be recorded.
			 * Log entries with a higher (less important) log level will be omitted from the log.
			 * When a component name is given, the log level will be configured for that component
			 * only, otherwise the log level for the default component of this logger is set.
			 * For the global logger, the global default level is set.
			 *
			 * <b>Note</b>: Setting a global default log level has no impact on already defined
			 * component log levels. They always override the global default log level.
			 *
			 * @param {jQuery.sap.log.Level} iLogLevel
			 * @param {string} [sComponent] The log component to set the log level for.
			 * @return {jQuery.sap.log} The global logger to allow method chaining
			 * @name jQuery.sap.log.Logger#setLevel
			 * @function
			 * @public
			 */
			this.setLevel = function setLevel(iLogLevel, sComponent) {
				sComponent = sComponent || sDefaultComponent || '';
				mMaxLevel[sComponent] = iLogLevel;
				var mBackMapping = [];
				jQuery.each(jQuery.sap.log.LogLevel, function(idx, v){
					mBackMapping[v] = idx;
				});
				log(INFO, "Changing log level " + (sComponent ? "for '" + sComponent + "' " : "") + "to " + mBackMapping[iLogLevel], "", "jQuery.sap.log");
				return this;
			};

			/**
			 * Returns the log level currently effective for the given component.
			 * If no component is given or when no level has been configured for a
			 * given component, the log level for the default component of this logger is returned.
			 *
			 * @param {string} [sComponent] Name of the component to retrieve the log level for
			 * @return {int} The log level for the given component or the default log level
			 * @name jQuery.sap.log.Logger#getLevel
			 * @function
			 * @public
			 * @since 1.1.2
			 */
			this.getLevel = function getLevel(sComponent) {
				return level(sComponent || sDefaultComponent);
			};

			/**
			 * Checks whether logging is enabled for the given log level,
			 * depending on the currently effective log level for the given component.
			 *
			 * If no component is given, the default component of this logger will be taken into account.
			 *
			 * @param {int} [iLevel=Level.DEBUG] the log level in question
			 * @param {string} [sComponent] Name of the component to check the log level for
			 * @return {boolean} Whether logging is enabled or not
			 * @name jQuery.sap.log.Logger#isLoggable
			 * @function
			 * @public
			 * @since 1.13.2
			 */
			this.isLoggable = function (iLevel, sComponent) {
				return (iLevel == null ? DEBUG : iLevel) <= level(sComponent || sDefaultComponent);
			};
		}

		/**
		 * A Logging API for JavaScript.
		 *
		 * Provides methods to manage a client-side log and to create entries in it. Each of the logging methods
		 * {@link jQuery.sap.log.#debug}, {@link jQuery.sap.log.#info}, {@link jQuery.sap.log.#warning},
		 * {@link jQuery.sap.log.#error} and {@link jQuery.sap.log.#fatal} creates and records a log entry,
		 * containing a timestamp, a log level, a message with details and a component info.
		 * The log level will be one of {@link jQuery.sap.log.Level} and equals the name of the concrete logging method.
		 *
		 * By using the {@link jQuery.sap.log#setLevel} method, consumers can determine the least important
		 * log level which should be recorded. Less important entries will be filtered out. (Note that higher numeric
		 * values represent less important levels). The initially set level depends on the mode that UI5 is running in.
		 * When the optimized sources are executed, the default level will be {@link jQuery.sap.log.Level.ERROR}.
		 * For normal (debug sources), the default level is {@link jQuery.sap.log.Level.DEBUG}.
		 *
		 * All logging methods allow to specify a <b>component</b>. These components are simple strings and
		 * don't have a special meaning to the UI5 framework. However they can be used to semantically group
		 * log entries that belong to the same software component (or feature). There are two APIs that help
		 * to manage logging for such a component. With <code>{@link jQuery.sap.log.getLogger}(sComponent)</code>,
		 * one can retrieve a logger that automatically adds the given <code>sComponent</code> as component
		 * parameter to each log entry, if no other component is specified. Typically, JavaScript code will
		 * retrieve such a logger once during startup and reuse it for the rest of its lifecycle.
		 * Second, the {@link jQuery.sap.log.Logger#setLevel}(iLevel, sComponent) method allows to set the log level
		 * for a specific component only. This allows a more fine granular control about the created logging entries.
		 * {@link jQuery.sap.log.Logger.getLevel} allows to retrieve the currently effective log level for a given
		 * component.
		 *
		 * {@link jQuery.sap.log#getLog} returns an array of the currently collected log entries.
		 *
		 * Furthermore, a listener can be registered to the log. It will be notified whenever a new entry
		 * is added to the log. The listener can be used for displaying log entries in a separate page area,
		 * or for sending it to some external target (server).
		 *
		 * @author SAP SE
		 * @since 0.9.0
		 * @namespace
		 * @public
		 * @borrows jQuery.sap.log.Logger#fatal as fatal
		 * @borrows jQuery.sap.log.Logger#error as error
		 * @borrows jQuery.sap.log.Logger#warning as warning
		 * @borrows jQuery.sap.log.Logger#info as info
		 * @borrows jQuery.sap.log.Logger#debug as debug
		 * @borrows jQuery.sap.log.Logger#trace as trace
		 * @borrows jQuery.sap.log.Logger#getLevel as getLevel
		 * @borrows jQuery.sap.log.Logger#setLevel as setLevel
		 * @borrows jQuery.sap.log.Logger#isLoggable as isLoggable
		 */
		jQuery.sap.log = jQuery.extend(new Logger(), /** @lends jQuery.sap.log */ {

			/**
			 * Enumeration of the configurable log levels that a Logger should persist to the log.
			 *
			 * Only if the current LogLevel is higher than the level {@link jQuery.sap.log.Level} of the currently added log entry,
			 * then this very entry is permanently added to the log. Otherwise it is ignored.
			 * @see jQuery.sap.log.Logger#setLevel
			 * @namespace
			 * @public
			 */
			Level : {

				/**
				 * Do not log anything
				 * @public
				 */
				NONE : FATAL - 1,

				/**
				 * Fatal level. Use this for logging unrecoverable situations
				 * @public
				 */
				FATAL : FATAL,

				/**
				 * Error level. Use this for logging of erroneous but still recoverable situations
				 * @public
				 */
				ERROR : ERROR,

				/**
				 * Warning level. Use this for logging unwanted but foreseen situations
				 * @public
				 */
				WARNING : WARNING,

				/**
				 * Info level. Use this for logging information of purely informative nature
				 * @public
				 */
				INFO : INFO,

				/**
				 * Debug level. Use this for logging information necessary for debugging
				 * @public
				 */
				DEBUG : DEBUG,

				/**
				 * Trace level. Use this for tracing the program flow.
				 * @public
				 */
				TRACE : TRACE, /* TODO Think about changing to 10 and thus to pull out of logging... -> Make tracing explicit */

				/**
				 * Trace level to log everything.
				 */
				ALL : (TRACE + 1) /* TODO if TRACE is changed to make sure this is 6 again. There would then be some special TRACE handling. */
			},

			/**
			 * Returns a {@link jQuery.sap.log.Logger} for the given component.
			 *
			 * The method might or might not return the same logger object across multiple calls.
			 * While loggers are assumed to be light weight objects, consumers should try to
			 * avoid redundant calls and instead keep references to already retrieved loggers.
			 *
			 * The optional second parameter <code>iDefaultLogLevel</code> allows to specify
			 * a default log level for the component. It is only applied when no log level has been
			 * defined so far for that component (ignoring inherited log levels). If this method is
			 * called multiple times for the same component but with different log levels,
			 * only the first call one might be taken into account.
			 *
			 * @param {string} sComponent Component to create the logger for
			 * @param {int} [iDefaultLogLevel] a default log level to be used for the component,
			 *   if no log level has been defined for it so far.
			 * @return {jQuery.sap.log.Logger} A logger for the component.
			 * @public
			 * @static
			 * @since 1.1.2
			 */
			getLogger : function(sComponent, iDefaultLogLevel) {
				if ( !isNaN(iDefaultLogLevel) && mMaxLevel[sComponent] == null ) {
					mMaxLevel[sComponent] = iDefaultLogLevel;
				}
				return new Logger(sComponent);
			},

			/**
			 * Returns the logged entries recorded so far as an array.
			 *
			 * Log entries are plain JavaScript objects with the following properties
			 * <ul>
			 * <li>timestamp {number} point in time when the entry was created
			 * <li>level {int} LogLevel level of the entry
			 * <li>message {string} message text of the entry
			 * </ul>
			 *
			 * @return {object[]} an array containing the recorded log entries
			 * @public
			 * @static
			 * @since 1.1.2
			 */
			getLogEntries : function () {
				return aLog.slice();
			},

			/**
			 * Allows to add a new LogListener that will be notified for new log entries.
			 * The given object must provide method <code>onLogEntry</code> and can also be informed
			 * about <code>onDetachFromLog</code> and <code>onAttachToLog</code>
			 * @param {object} oListener The new listener object that should be informed
			 * @return {jQuery.sap.log} The global logger
			 * @public
			 * @static
			 */
			addLogListener : function(oListener) {
				listener().attach(this, oListener);
				return this;
			},

			/**
			 * Allows to remove a registered LogListener.
			 * @param {object} oListener The new listener object that should be removed
			 * @return {jQuery.sap.log} The global logger
			 * @public
			 * @static
			 */
			removeLogListener : function(oListener) {
				listener().detach(this, oListener);
				return this;
			}

		});

		/**
		 * Enumeration of levels that can be used in a call to {@link jQuery.sap.log.Logger#setLevel}(iLevel, sComponent).
		 *
		 * @deprecated Since 1.1.2. To streamline the Logging API a bit, the separation between Level and LogLevel has been given up.
		 * Use the (enriched) enumeration {@link jQuery.sap.log.Level} instead.
		 * @namespace
		 * @public
		 */
		jQuery.sap.log.LogLevel = jQuery.sap.log.Level;

		/**
		 * Retrieves the currently recorded log entries.
		 * @deprecated Since 1.1.2. To avoid confusion with getLogger, this method has been renamed to {@link jQuery.sap.log.getLogEntries}.
		 * @function
		 * @public
		 * @static
		 */
		jQuery.sap.log.getLog = jQuery.sap.log.getLogEntries;

		// *** Performance measure ***
		function PerfMeasurement(){

			function Measurement( sId, sInfo, iStart, iEnd, aCategories){
				this.id = sId;
				this.info = sInfo;
				this.start = iStart;
				this.end = iEnd;
				this.pause = 0;
				this.resume = 0;
				this.duration = 0; // used time
				this.time = 0; // time from start to end
				this.categories = aCategories;
				this.average = false; //average duration enabled
				this.count = 0; //average count
				this.completeDuration = 0; //complete duration
			}

			function matchCategories(aCategories) {
				if (!aRestrictedCategories) {
					return true;
				}
				if (!aCategories) {
					return aRestrictedCategories === null;
				}
				//check whether active categories and current categories match
				for (var i = 0; i < aRestrictedCategories.length; i++) {
					if (aCategories.indexOf(aRestrictedCategories[i]) > -1) {
						return true;
					}
				}
				return false;
			}

			function checkCategories(aCategories) {
				if (!aCategories) {
					aCategories = ["javascript"];
				}
				aCategories = typeof aCategories === "string" ? aCategories.split(",") : aCategories;
				if (!matchCategories(aCategories)) {
					return null;
				}
				return aCategories;
			}

			var bActive = false,
				fnAjax = jQuery.ajax,
				aRestrictedCategories = null,
				aAverageMethods = [],
				aOriginalMethods = [],
				aMethods = ["start", "end", "pause", "resume", "add", "remove", "clear", "average"];

			/**
			 * Gets the current state of the perfomance measurement functionality
			 *
			 * @return {boolean} current state of the perfomance measurement functionality
			 * @name jQuery.sap.measure#getActive
			 * @function
			 * @public
			 */
			this.getActive = function(){
				return bActive;
			};

			/**
			 * Activates or deactivates the performance measure functionality
			 * Optionally a category or list of categories can be passed to restrict measurements to certain categories
			 * like "javascript", "require", "xmlhttprequest", "render"
			 * @param {boolean} bOn state of the perfomance measurement functionality to set
			 * @param {string | string[]}  An optional list of categories that should be measured
			 *
			 * @return {boolean} current state of the perfomance measurement functionality
			 * @name jQuery.sap.measure#setActive
			 * @function
			 * @public
			 */
			this.setActive = function(bOn, aCategories){
				//set restricted categories
				if (!aCategories) {
					aCategories = null;
				} else if (typeof aCategories === "string") {
					aCategories = aCategories.split(",");
				}
				aRestrictedCategories = aCategories;

				if (bActive === bOn) {
					return;
				}
				bActive = bOn;
				if (bActive) {

					//activate method implementations once
					for (var i = 0; i < aMethods.length; i++) {
						this[aMethods[i]] = this["_" + aMethods[i]];

					}
					aMethods = [];
					// wrap and instrument jQuery.ajax
					jQuery.ajax = function(url, options) {

						if ( typeof url === 'object' ) {
							options = url;
							url = undefined;
						}
						options = options || {};

						var sMeasureId = new URI(url || options.url).absoluteTo(document.location.origin + document.location.pathname).href();
						jQuery.sap.measure.start(sMeasureId, "Request for " + sMeasureId, "xmlhttprequest");
						var fnComplete = options.complete;
						options.complete = function() {
							jQuery.sap.measure.end(sMeasureId);
							if (fnComplete) {
								fnComplete.call(this, arguments);
							}
						};

						// strict mode: we potentially modified 'options', so we must not use 'arguments'
						return fnAjax.call(this, url, options);
					};
				} else if (fnAjax) {
					jQuery.ajax = fnAjax;
				}

				return bActive;
			};

			this.mMeasurements = {};


			/**
			 * Starts a performance measure.
			 * Optionally a category or list of categories can be passed to allow filtering of measurements.
			 *
			 * @param {string} sId ID of the measurement
			 * @param {string} sInfo Info for the measurement
			 * @param {string | string[]} [aCategories = "javascript"] An optional list of categories for the measure
			 *
			 * @return {object} current measurement containing id, info and start-timestamp (false if error)
			 * @name jQuery.sap.measure#start
			 * @function
			 * @public
			 */
			this._start = function( sId, sInfo, aCategories){
				if (!bActive) {
					return;
				}

				aCategories = checkCategories(aCategories);
				if (!aCategories) {
					return;
				}

				var iTime = jQuery.sap.now(),
					oMeasurement = new Measurement( sId, sInfo, iTime, 0, aCategories);

				// create timeline entries if available
				/*eslint-disable no-console */
				if (console.time) {
					console.time(sInfo + " - " + sId);
				}
				/*eslint-enable no-console */
	//			jQuery.sap.log.info("Performance measurement start: "+ sId + " on "+ iTime);

				if (oMeasurement) {
					this.mMeasurements[sId] = oMeasurement;
					return this.getMeasurement(oMeasurement.id);
				} else {
					return false;
				}
			};

			/**
			 * Pauses a performance measure
			 *
			 * @param {string} sId ID of the measurement
			 * @return {object} current measurement containing id, info and start-timestamp, pause-timestamp (false if error)
			 * @name jQuery.sap.measure#pause
			 * @function
			 * @public
			 */
			this._pause = function( sId ){
				if (!bActive) {
					return;
				}

				var iTime = jQuery.sap.now();
				var oMeasurement = this.mMeasurements[sId];
				if (oMeasurement && oMeasurement.end > 0) {
					// already ended -> no pause possible
					return false;
				}

				if (oMeasurement && oMeasurement.pause == 0) {
					// not already paused
					oMeasurement.pause = iTime;
					if (oMeasurement.pause >= oMeasurement.resume && oMeasurement.resume > 0) {
						oMeasurement.duration = oMeasurement.duration + oMeasurement.pause - oMeasurement.resume;
						oMeasurement.resume = 0;
					} else if (oMeasurement.pause >= oMeasurement.start) {
						oMeasurement.duration = oMeasurement.pause - oMeasurement.start;
					}
				}
	//			jQuery.sap.log.info("Performance measurement pause: "+ sId + " on "+ iTime + " duration: "+ oMeasurement.duration);

				if (oMeasurement) {
					return this.getMeasurement(oMeasurement.id);
				} else {
					return false;
				}
			};

			/**
			 * Resumes a performance measure
			 *
			 * @param {string} sId ID of the measurement
			 * @return {object} current measurement containing id, info and start-timestamp, resume-timestamp (false if error)
			 * @name jQuery.sap.measure#resume
			 * @function
			 * @public
			 */
			this._resume = function( sId ){
				if (!bActive) {
					return;
				}

				var iTime = jQuery.sap.now();
				var oMeasurement = this.mMeasurements[sId];
	//			jQuery.sap.log.info("Performance measurement resume: "+ sId + " on "+ iTime + " duration: "+ oMeasurement.duration);

				if (oMeasurement && oMeasurement.pause > 0) {
					// already paused
					oMeasurement.pause = 0;
					oMeasurement.resume = iTime;
				}

				if (oMeasurement) {
					return this.getMeasurement(oMeasurement.id);
				} else {
					return false;
				}
			};

			/**
			 * Ends a performance measure
			 *
			 * @param {string} sId ID of the measurement
			 * @return {object} current measurement containing id, info and start-timestamp, end-timestamp, time, duration (false if error)
			 * @name jQuery.sap.measure#end
			 * @function
			 * @public
			 */
			this._end = function( sId ){
				if (!bActive) {
					return;
				}

				var iTime = jQuery.sap.now();

				var oMeasurement = this.mMeasurements[sId];
	//			jQuery.sap.log.info("Performance measurement end: "+ sId + " on "+ iTime);

				if (oMeasurement && !oMeasurement.end) {
					oMeasurement.end = iTime;
					if (oMeasurement.end >= oMeasurement.resume && oMeasurement.resume > 0) {
						oMeasurement.duration = oMeasurement.duration + oMeasurement.end - oMeasurement.resume;
						oMeasurement.resume = 0;
					} else if (oMeasurement.pause > 0) {
						// duration already calculated
						oMeasurement.pause = 0;
					} else if (oMeasurement.end >= oMeasurement.start) {
						if (oMeasurement.average) {
							oMeasurement.completeDuration += (oMeasurement.end - oMeasurement.start);
							oMeasurement.count++;
							oMeasurement.duration = oMeasurement.completeDuration / oMeasurement.count;
							oMeasurement.start = iTime;
						} else {
							oMeasurement.duration = oMeasurement.end - oMeasurement.start;
						}
					}
					if (oMeasurement.end >= oMeasurement.start) {
						oMeasurement.time = oMeasurement.end - oMeasurement.start;
					}
				}

				if (oMeasurement) {
					// end timeline entry
					/*eslint-disable no-console */
					if (console.time && oMeasurement) {
						console.timeEnd(oMeasurement.info + " - " + sId);
					}
					/*eslint-enable no-console */
					return this.getMeasurement(sId);
				} else {
					return false;
				}
			};

			/**
			 * Clears all performance measurements
			 *
			 * @name jQuery.sap.measure#clear
			 * @function
			 * @public
			 */
			this._clear = function( ){
				this.mMeasurements = {};
			};

			/**
			 * Removes a performance measure
			 *
			 * @param {string} sId ID of the measurement
			 * @name jQuery.sap.measure#remove
			 * @function
			 * @public
			 */
			this._remove = function( sId ){
				delete this.mMeasurements[sId];
			};
			/**
			 * Adds a performance measurement with all data
			 * This is usefull to add external measurements (e.g. from a backend) to the common measurement UI
			 *
			 * @param {string} sId ID of the measurement
			 * @param {string} sInfo Info for the measurement
			 * @param {int} iStart start timestamp
			 * @param {int} iEnd end timestamp
			 * @param {int} iTime time in milliseconds
			 * @param {int} iDuration effective time in milliseconds
			 * @param {string | string[]} [aCategories = "javascript"] An optional list of categories for the measure
			 * @return {object} [] current measurement containing id, info and start-timestamp, end-timestamp, time, duration, categories (false if error)
			 * @name jQuery.sap.measure#add
			 * @function
			 * @public
			 */
			this._add = function( sId, sInfo, iStart, iEnd, iTime, iDuration, aCategories ){
				if (!bActive) {
					return;
				}
				aCategories = checkCategories(aCategories);
				if (!aCategories) {
					return false;
				}
				var oMeasurement = new Measurement( sId, sInfo, iStart, iEnd, aCategories);
				oMeasurement.time = iTime;
				oMeasurement.duration = iDuration;

				if (oMeasurement) {
					this.mMeasurements[sId] = oMeasurement;
					return this.getMeasurement(oMeasurement.id);
				} else {
					return false;
				}
			};

			/**
			 * Starts an average performance measure.
			 * The duration of this measure is an avarage of durations measured for each call.
			 * Optionally a category or list of categories can be passed to allow filtering of measurements.
			 *
			 * @param {string} sId ID of the measurement
			 * @param {string} sInfo Info for the measurement
			 * @param {string | string[]} [aCategories = "javascript"] An optional list of categories for the measure
			 * @return {object} current measurement containing id, info and start-timestamp (false if error)
			 * @name jQuery.sap.measure#average
			 * @function
			 * @public
			 */
			this._average = function( sId, sInfo, aCategories){
				if (!bActive) {
					return;
				}
				aCategories = checkCategories(aCategories);
				if (!aCategories) {
					return;
				}

				var oMeasurement = this.mMeasurements[sId],
					iTime = jQuery.sap.now();
				if (!oMeasurement || !oMeasurement.average) {
					this.start(sId, sInfo, aCategories);
					oMeasurement = this.mMeasurements[sId];
					oMeasurement.average = true;
				} else {
					if (!oMeasurement.end) {
						oMeasurement.completeDuration += (iTime - oMeasurement.start);
						oMeasurement.count++;
					}
					oMeasurement.start = iTime;
					oMeasurement.end = 0;
				}
				return this.getMeasurement(oMeasurement.id);
			};

			/**
			 * Gets a performance measure
			 *
			 * @param {string} sId ID of the measurement
			 * @return {object} current measurement containing id, info and start-timestamp, end-timestamp, time, duration (false if error)
			 * @name jQuery.sap.measure#getMeasurement
			 * @function
			 * @public
			 */
			this.getMeasurement = function( sId ){

				var oMeasurement = this.mMeasurements[sId];

				if (oMeasurement) {
					return {id: oMeasurement.id,
							info: oMeasurement.info,
							start: oMeasurement.start,
							end: oMeasurement.end,
							pause: oMeasurement.pause,
							resume: oMeasurement.resume,
							time: oMeasurement.time,
							duration: oMeasurement.duration,
							completeDuration: oMeasurement.completeDuration,
							count: oMeasurement.count,
							average: oMeasurement.average,
							categories: oMeasurement.categories};
				} else {
					return false;
				}
			};

			/**
			 * Gets all performance measurements
			 *
			 * @param {boolean} [bCompleted] Whether only completed measurements should be returned, if explicitly set to false only incomplete measurements are returned
			 * @return {object} [] current measurement containing id, info and start-timestamp, end-timestamp, time, duration, categories
			 * @name jQuery.sap.measure#getAllMeasurements
			 * @function
			 * @public
			 */
			this.getAllMeasurements = function(bCompleted){
				return this.filterMeasurements(function(oMeasurement) {
					return oMeasurement;
				}, bCompleted);
			};

			/**
			 * Gets all performance measurements where a provided filter function returns true.
			 * The filter function is called for every measurement and should return the measurement to be added.
			 * If no filter function is provided an empty array is returned.
			 * To filter for certain categories of measurements a fnFilter can be implemented like this
			 * <code>
			 * function(oMeasurement) {
			 *     return oMeasurement.categories.indexOf("rendering") > -1 ? oMeasurement : null
			 * }</code>
			 *
			 * @param {function} fnFilter a filter function that returns true if the passed measurement should be added to the result
			 * @param {boolean} [bCompleted] Whether only completed measurements should be returned, if explicitly set to false only incomplete measurements are returned
			 *
			 * @return {object} [] current measurements containing id, info and start-timestamp, end-timestamp, time, duration, categories (false if error)
			 * @name jQuery.sap.measure#filterMeasurements
			 * @function
			 * @public
			 * @since 1.34.0
		 	 */
			this.filterMeasurements = function(fnFilter, bCompleted) {
				var aMeasurements = [],
					that = this;
				jQuery.each(this.mMeasurements, function(sId){
					var oMeasurement = that.getMeasurement(sId);
					if (fnFilter) {
						var oResult = fnFilter(oMeasurement);
						if (oResult && ((bCompleted === false && oResult.end === 0) || (bCompleted !== false && (!bCompleted || oResult.end)))) {
							aMeasurements.push(oResult);
						}
					}
				});
				return aMeasurements;
			};

			/**
			 * Registers an average measurement for a given objects method
			 *
			 * @param {string} sId the id of the measurement
			 * @param {object} oObject the object of the method
			 * @param {string} sMethod the name of the method
			 * @param {string[]} [aCategories = ["javascript"]] An optional categories list for the measurement
			 *
			 * @returns {boolean} true if the registration was successful
			 * @name jQuery.sap.measure#registerMethod
			 * @function
			 * @public
			 * @since 1.34.0
			 */
			this.registerMethod = function(sId, oObject, sMethod, aCategories) {
				var fnMethod = oObject[sMethod];
				if (fnMethod && typeof fnMethod === "function") {
					var bFound = aAverageMethods.indexOf(fnMethod) > -1;
					if (!bFound) {
						aOriginalMethods.push({func : fnMethod, obj: oObject, method: sMethod, id: sId});
						oObject[sMethod] = function() {
							jQuery.sap.measure.average(sId, sId + " method average", aCategories);
							var result = fnMethod.apply(this, arguments);
							jQuery.sap.measure.end(sId);
							return result;
						};
						aAverageMethods.push(oObject[sMethod]);
						return true;
					}
				} else {
					jQuery.sap.log.debug(sMethod + " in not a function. jQuery.sap.measure.register failed");
				}
				return false;
			};

			/**
			 * Unregisters an average measurement for a given objects method
			 *
			 * @param {string} sId the id of the measurement
			 * @param {object} oObject the object of the method
			 * @param {string} sMethod the name of the method
			 *
			 * @returns {boolean} true if the unregistration was successful
			 * @name jQuery.sap.measure#unregisterMethod
			 * @function
			 * @public
			 * @since 1.34.0
			 */
			this.unregisterMethod = function(sId, oObject, sMethod) {
				var fnFunction = oObject[sMethod],
					iIndex = aAverageMethods.indexOf(fnFunction);
				if (fnFunction && iIndex > -1) {
					oObject[sMethod] = aOriginalMethods[iIndex].func;
					aAverageMethods.splice(iIndex, 1);
					aOriginalMethods.splice(iIndex, 1);
					return true;
				}
				return false;
			};

			/**
			 * Unregisters all average measurements
			 * @name jQuery.sap.measure#unregisterAllMethods
			 * @function
			 * @public
			 * @since 1.34.0
			 */
			this.unregisterAllMethods = function() {
				while (aOriginalMethods.length > 0) {
					var oOrig = aOriginalMethods[0];
					this.unregisterMethod(oOrig.id, oOrig.obj, oOrig.method);
				}
			};

			// ** Interaction measure **
			var aInteractions = [];
			var oPendingInteraction;

			/**
			 * Gets all interaction measurements
			 * @return {object[]} all interaction measurements
			 * @name jQuery.sap.measure#getAllInteractionMeasurements
			 * @function
			 * @public
			 * @since 1.34.0
			 */
			this.getAllInteractionMeasurements = function() {
				return aInteractions;
			};

			/**
			 * Gets the incomplete pending interaction
			 * @return {object} interaction measurement
			 * @name jQuery.sap.measure#getInteractionMeasurement
			 * @function
			 * @private
			 * @since 1.34.0
			 */
			this.getPendingInteractionMeasurement = function() {
				return oPendingInteraction;
			};

			/**
			 * Clears all interaction measurements
			 * @name jQuery.sap.measure#getLastInteractionMeasurement
			 * @function
			 * @public
			 * @since 1.34.0
			 */
			this.clearInteractionMeasurements = function() {
				aInteractions = [];
			};

			function finalizeInteraction(iTime) {
				if (oPendingInteraction) {
					oPendingInteraction.end = iTime;
					oPendingInteraction.duration = oPendingInteraction.processing;
					oPendingInteraction.requests = jQuery.sap.measure.getRequestTimings();
					oPendingInteraction.measurements = jQuery.sap.measure.filterMeasurements(function(oMeasurement) {
						return (oMeasurement.start > oPendingInteraction.start && oMeasurement.end < oPendingInteraction.end) ? oMeasurement : null;
					}, true);
					if (oPendingInteraction.requests.length > 0) {
						// determine Performance API timestamp for latestly completed request
						var iEnd = oPendingInteraction.requests[0].startTime,
							iNavLo = oPendingInteraction.requests[0].startTime,
							iNavHi = oPendingInteraction.requests[0].requestStart,
							iRtLo = oPendingInteraction.requests[0].requestStart,
							iRtHi = oPendingInteraction.requests[0].responseEnd;
						oPendingInteraction.requests.forEach(function(oRequest) {
							iEnd = oRequest.responseEnd > iEnd ? oRequest.responseEnd : iEnd;
							oPendingInteraction.requestTime += (oRequest.responseEnd - oRequest.startTime);
							// summarize navigation and roundtrip with respect to requests overlapping and times w/o requests
							if (iRtHi < oRequest.startTime) {
								oPendingInteraction.navigation += (iNavHi - iNavLo);
								oPendingInteraction.roundtrip += (iRtHi - iRtLo);
								iNavLo =  oRequest.startTime;
								iRtLo =  oRequest.requestStart;
							}
							if (oRequest.responseEnd > iRtHi) {
								iNavHi = oRequest.requestStart;
								iRtHi = oRequest.responseEnd;
							}
						});
						oPendingInteraction.navigation += iNavHi - iNavLo;
						oPendingInteraction.roundtrip += iRtHi - iRtLo;
						// calculate average network time per request
						oPendingInteraction.networkTime = oPendingInteraction.networkTime ? ((oPendingInteraction.requestTime - oPendingInteraction.networkTime) / oPendingInteraction.requests.length) : 0;
						// in case processing is not determined, which means no re-rendering occured, take start to iEnd
						if (oPendingInteraction.duration === 0) {
							oPendingInteraction.duration = oPendingInteraction.navigation + oPendingInteraction.roundtrip;
						}
					}
					// calculate real processing time if any processing took place, cannot be negative as then requests took longer than processing
					if (oPendingInteraction.processing !== 0) {
						var iProcessing = oPendingInteraction.processing - oPendingInteraction.navigation - oPendingInteraction.roundtrip;
						oPendingInteraction.processing = iProcessing > 0 ? iProcessing : 0;
					}
					aInteractions.push(oPendingInteraction);
					jQuery.sap.log.info("Interaction step finished: trigger: " + oPendingInteraction.trigger + "; duration: " + oPendingInteraction.duration + "; requests: " + oPendingInteraction.requests.length);
					oPendingInteraction = null;
				}
			}

			/**
			 * Start an interaction measurements
			 *
			 * @param {string} sType type of the event which triggered the interaction
			 * @param {object} oSrcControl the control on which the interaction was triggered
			 *
			 * @name jQuery.sap.measure#startInteraction
			 * @function
			 * @public
			 * @since 1.34.0
			 */
			this.startInteraction = function(sType, oSrcControl) {
				// component determination - heuristic
				function identifyOwnerComponent(oSrcControl) {
					if (oSrcControl) {
						var Component, oComponent;
						Component = sap.ui.require("sap/ui/core/Component");
						while (Component && oSrcControl && oSrcControl.getParent) {
							oComponent = Component.getOwnerComponentFor(oSrcControl);
							if (oComponent || oSrcControl instanceof Component) {
								oComponent = oComponent || oSrcControl;
								var oApp = oComponent.getMetadata().getManifestEntry("sap.app");
								// get app id or module name for FESR
								return oApp && oApp.id || oComponent.getMetadata().getName();
							}
							oSrcControl = oSrcControl.getParent();
						}
					}
					return "undetermined";
				}

				var iTime = jQuery.sap.now();

				if (oPendingInteraction) {
					finalizeInteraction(iTime);
				}

				// clear request timings for new interaction
				this.clearRequestTimings();

				// setup new pending interaction
				oPendingInteraction = {
					event: sType, // event which triggered interaction
					trigger: oSrcControl && oSrcControl.getId ? oSrcControl.getId() : "undetermined", // control which triggered interaction
					component: identifyOwnerComponent(oSrcControl), // component or app identifier
					start : iTime, // interaction start
					end: 0, // interaction end
					navigation: 0, // sum over all navigation times
					roundtrip: 0, // time from first request sent to last received response end
					processing: 0, // client processing time
					duration: 0, // interaction duration
					requests: [], // Performance API requests during interaction
					measurements: [], // jQuery.sap.measure Measurements
					sapStatistics: [], // SAP Statistics for OData, added by jQuery.sap.trace
					requestTime: 0, // summ over all requests in the interaction (oPendingInteraction.requests[0].responseEnd-oPendingInteraction.requests[0].requestStart)
					networkTime: 0, // request time minus server time from the header, added by jQuery.sap.trace
					bytesSent: 0, // sum over all requests bytes, added by jQuery.sap.trace
					bytesReceived: 0, // sum over all response bytes, added by jQuery.sap.trace
					requestCompression: undefined // true if all responses have been sent gzipped
				};
				jQuery.sap.log.info("Interaction step started: trigger: " + oPendingInteraction.trigger + "; type: " + oPendingInteraction.event);
			};

			/**
			 * End an interaction measurements
			 *
			 * @param {boolean} bForce forces end of interaction now and ignores further re-renderings
			 *
			 * @name jQuery.sap.measure#endInteraction
			 * @function
			 * @public
			 * @since 1.34.0
			 */
			this.endInteraction = function(bForce) {
				if (oPendingInteraction) {
					// set provisionary processing time from start to end and calculate later
					if (!bForce) {
						oPendingInteraction.processing = jQuery.sap.now() - oPendingInteraction.start;
					} else {
						finalizeInteraction(jQuery.sap.now());
					}
				}
			};

			/**
			 * Sets the request buffer size for the interaction measurement
			 *
			 * @param {integer} iSize size of the buffer
			 *
			 * @name jQuery.sap.measure#setRequestBufferSize
			 * @function
			 * @public
			 * @since 1.34.0
			 */
			this.setRequestBufferSize = function(iSize) {
				if (!window.performance) {
					return;
				}
				if (window.performance.setResourceTimingBufferSize){
					window.performance.setResourceTimingBufferSize(iSize);
				} else if (window.performance.webkitSetResourceTimingBufferSize) {
					window.performance.webkitSetResourceTimingBufferSize(iSize);
				}
			};

			/**
			 * Gets the request timings for the interaction measurement
			 *
			 * @return {object[]} iSize size of the buffer
			 * @name jQuery.sap.measure#getRequestTimings
			 * @function
			 * @public
			 * @since 1.34.0
			 */
			this.getRequestTimings = function() {
				if (window.performance && window.performance.getEntriesByType) {
					return jQuery.extend(window.performance.getEntriesByType("resource"),{});
				}
				return [];
			};

			 /**
 			 * Clears all request timings
 			 *
 			 * @name jQuery.sap.measure#clearRequestTimings
 			 * @function
 			 * @public
 			 * @since 1.34.0
 			 */
			this.clearRequestTimings = function() {
				if (!window.performance) {
					return;
				}
				if (window.performance.webkitClearResourceTimings) {
					window.performance.webkitClearResourceTimings();
				} else if (window.performance.clearResourceTimings){
					window.performance.clearResourceTimings();
				}
			};

			this.setRequestBufferSize(1000);

			var aMatch = location.search.match(/sap-ui-measure=([^\&]*)/);
			if (aMatch && aMatch[1]) {
				if (aMatch[1] === "true" || aMatch[1] === "x" || aMatch[1] === "X") {
					this.setActive(true);
				} else {
					this.setActive(true, aMatch[1]);
				}
			} else {
				var fnInactive = function() {
					//measure not active
					return null;
				};
				//deactivate methods implementations
				for (var i = 0; i < aMethods.length; i++) {
					this[aMethods[i]] = fnInactive;
				}
			}
		}

		/**
		 * Namespace for the jQuery performance measurement plug-in provided by SAP SE.
		 *
		 * @namespace
		 * @name jQuery.sap.measure
		 * @public
		 * @static
		 */
		jQuery.sap.measure = new PerfMeasurement();

		/**
		 * A simple assertion mechanism that logs a message when a given condition is not met.
		 *
		 * <b>Note:</b> Calls to this method might be removed when the JavaScript code
		 *              is optimized during build. Therefore, callers should not rely on any side effects
		 *              of this method.
		 *
		 * @param {boolean} bResult result of the checked assertion
		 * @param {string|function} vMessage message that will be raised when the result is <code>false</code>. In case this is a function, the return value of the function will be displayed. This can be used to execute complex code only if the assertion fails.
		 *
		 * @public
		 * @static
		 * @SecSink {1|SECRET} Could expose secret data in logs
		 */
		jQuery.sap.assert = function(bResult, vMessage) {
			if ( !bResult ) {
				var sMessage = typeof vMessage === "function" ? vMessage() : vMessage;
				/*eslint-disable no-console */
				if ( window.console && console.assert ) {
					console.assert(bResult, sWindowName + sMessage);
				} else {
					// console is not always available (IE, FF) and IE doesn't support console.assert
					jQuery.sap.log.debug("[Assertions] " + sMessage);
				}
				/*eslint-enable no-console */
			}
		};

		// against all our rules: use side effect of assert to differentiate between optimized and productive code
		jQuery.sap.assert( !!(mMaxLevel[''] = DEBUG), "will be removed in optimized version");
		// evaluate configuration
		oCfgData.loglevel = (function() {
			var m = /(?:\?|&)sap-ui-log(?:L|-l)evel=([^&]*)/.exec(window.location.search);
			return m && m[1];
		}()) || oCfgData.loglevel;
		if ( oCfgData.loglevel ) {
			jQuery.sap.log.setLevel(jQuery.sap.log.Level[oCfgData.loglevel.toUpperCase()] || parseInt(oCfgData.loglevel,10));
		}

		jQuery.sap.log.info("SAP Logger started.");
		// log early logs
		jQuery.each(_earlyLogs, function(i,e) {
			jQuery.sap.log[e.level](e.message);
		});
		_earlyLogs = null;


	}());

	// ---------------------------------------------------------------------------------------------------

	/**
	 * Returns a new constructor function that creates objects with
	 * the given prototype.
	 *
	 * @param {object} oPrototype
	 * @return {function} the newly created constructor function
	 * @public
	 * @static
	 */
	jQuery.sap.factory = function factory(oPrototype) {
		function Factory() {}
		Factory.prototype = oPrototype;
		return Factory;
	};

	/**
	 * Returns a new object which has the given oPrototype as its prototype.
	 *
	 * If several objects with the same prototype are to be created,
	 * {@link jQuery.sap.factory} should be used instead.
	 *
	 * @param {object} oPrototype
	 * @return {object} new object
	 * @public
	 * @static
	 */
	jQuery.sap.newObject = function newObject(oPrototype) {
		return new (jQuery.sap.factory(oPrototype))();
	};

	/**
	 * Returns a new function that returns the given <code>oValue</code> (using its closure).
	 *
	 * Avoids the need for a dedicated member for the value.
	 *
	 * As closures don't come for free, this function should only be used when polluting
	 * the enclosing object is an absolute "must-not" (as it is the case in public base classes).
	 *
	 * @param {object} oValue
	 *
	 * @public
	 * @static
	 */
	jQuery.sap.getter = function getter(oValue) {
		return function() {
			return oValue;
		};
	};

	/**
	 * Returns a JavaScript object which is identified by a sequence of names.
	 *
	 * A call to <code>getObject("a.b.C")</code> has essentially the same effect
	 * as accessing <code>window.a.b.C</code> but with the difference that missing
	 * intermediate objects (a or b in the example above) don't lead to an exception.
	 *
	 * When the addressed object exists, it is simply returned. If it doesn't exists,
	 * the behavior depends on the value of the second, optional parameter
	 * <code>iNoCreates</code> (assuming 'n' to be the number of names in the name sequence):
	 * <ul>
	 * <li>NaN: if iNoCreates is not a number and the addressed object doesn't exist,
	 *          then <code>getObject()</code> returns <code>undefined</code>.
	 * <li>0 &lt; iNoCreates &lt; n: any non-existing intermediate object is created, except
	 *          the <i>last</i> <code>iNoCreates</code> ones.
	 * </ul>
	 *
	 * Example:
	 * <pre>
	 *   getObject()            -- returns the context object (either param or window)
	 *   getObject("a.b.C")     -- will only try to get a.b.C and return undefined if not found.
	 *   getObject("a.b.C", 0)  -- will create a, b, and C in that order if they don't exists
	 *   getObject("a.b.c", 1)  -- will create a and b, but not C.
	 * </pre>
	 *
	 * When a <code>oContext</code> is given, the search starts in that object.
	 * Otherwise it starts in the <code>window</code> object that this plugin
	 * has been created in.
	 *
	 * Note: Although this method internally uses <code>object["key"]</code> to address object
	 *       properties, it does not support all possible characters in a name.
	 *       Especially the dot ('.') is not supported in the individual name segments,
	 *       as it is always interpreted as a name separator.
	 *
	 * @param {string} sName  a dot separated sequence of names that identify the required object
	 * @param {int}    [iNoCreates=NaN] number of objects (from the right) that should not be created
	 * @param {object} [oContext=window] the context to execute the search in
	 *
	 * @public
	 * @static
	 */
	jQuery.sap.getObject = function getObject(sName, iNoCreates, oContext) {
		var oObject = oContext || _window,
			aNames = (sName || "").split("."),
			l = aNames.length,
			iEndCreate = isNaN(iNoCreates) ? 0 : l - iNoCreates,
			i;

		for (i = 0; oObject && i < l; i++) {
			if (!oObject[aNames[i]] && i < iEndCreate ) {
				oObject[aNames[i]] = {};
			}
			oObject = oObject[aNames[i]];
		}
		return oObject;

	};

	/**
	 * Sets an object property to a given value, where the property is
	 * identified by a sequence of names (path).
	 *
	 * When a <code>oContext</code> is given, the path starts in that object.
	 * Otherwise it starts in the <code>window</code> object that this plugin
	 * has been created for.
	 *
	 * Note: Although this method internally uses <code>object["key"]</code> to address object
	 *       properties, it does not support all possible characters in a name.
	 *       Especially the dot ('.') is not supported in the individual name segments,
	 *       as it is always interpreted as a name separator.
	 *
	 * @param {string} sName  a dot separated sequence of names that identify the property
	 * @param {any}    vValue value to be set, can have any type
	 * @param {object} [oContext=window] the context to execute the search in
	 * @public
	 * @static
	 */
	jQuery.sap.setObject = function (sName, vValue, oContext) {
		var oObject = oContext || _window,
			aNames = (sName || "").split("."),
			l = aNames.length, i;

		if ( l > 0 ) {
			for (i = 0; oObject && i < l - 1; i++) {
				if (!oObject[aNames[i]] ) {
					oObject[aNames[i]] = {};
				}
				oObject = oObject[aNames[i]];
			}
			oObject[aNames[l - 1]] = vValue;
		}
	};

	// ---------------------- sync point -------------------------------------------------------------

	/*
	 * Internal class that can help to synchronize a set of asynchronous tasks.
	 * Each task must be registered in the sync point by calling startTask with
	 * an (purely informative) title. The returned value must be used in a later
	 * call to finishTask.
	 * When finishTask has been called for all tasks that have been started,
	 * the fnCallback will be fired.
	 * When a timeout is given and reached, the callback is called at that
	 * time, no matter whether all tasks have been finished or not.
	 */
	function SyncPoint(sName, fnCallback, iTimeout) {
		var aTasks = [],
			iOpenTasks = 0,
			iFailures = 0,
			sTimer;

		this.startTask = function(sTitle) {
			var iId = aTasks.length;
			aTasks[iId] = { name : sTitle, finished : false };
			iOpenTasks++;
			return iId;
		};

		this.finishTask = function(iId, bSuccess) {
			if ( !aTasks[iId] || aTasks[iId].finished ) {
				throw new Error("trying to finish non existing or already finished task");
			}
			aTasks[iId].finished = true;
			iOpenTasks--;
			if ( bSuccess === false ) {
				iFailures++;
			}
			if ( iOpenTasks === 0 ) {
				jQuery.sap.log.info("Sync point '" + sName + "' finished (tasks:" + aTasks.length + ", open:" + iOpenTasks + ", failures:" + iFailures + ")");
				if ( sTimer ) {
					clearTimeout(sTimer);
					sTimer = null;
				}
				finish();
			}
		};

		function finish() {
			fnCallback && fnCallback(iOpenTasks, iFailures);
			fnCallback = null;
		}

		if ( !isNaN(iTimeout) ) {
			sTimer = setTimeout(function() {
				jQuery.sap.log.info("Sync point '" + sName + "' timed out (tasks:" + aTasks.length + ", open:" + iOpenTasks + ", failures:" + iFailures + ")");
				finish();
			}, iTimeout);
		}

		jQuery.sap.log.info("Sync point '" + sName + "' created" + (iTimeout ? "(timeout after " + iTimeout + " ms)" : ""));

	}

	/**
	 * Internal function to create a sync point.
	 * @private
	 */
	jQuery.sap.syncPoint = function(sName, fnCallback, iTimeout) {
		return new SyncPoint(sName, fnCallback, iTimeout);
	};

	// ---------------------- require/declare --------------------------------------------------------

	var getModuleSystemInfo = (function() {

		/**
		 * Local logger, by default only logging errors. Can be configured to DEBUG via config parameter.
		 * @private
		 */
		var log = jQuery.sap.log.getLogger("sap.ui.ModuleSystem",
				(/sap-ui-xx-debug(M|-m)odule(L|-l)oading=(true|x|X)/.test(location.search) || oCfgData["xx-debugModuleLoading"]) ? jQuery.sap.log.Level.DEBUG : jQuery.sap.log.Level.INFO
			),

		/**
		 * A map of URL prefixes keyed by the corresponding module name prefix.
		 * URL prefix can either be given as string or as object with properties url and final.
		 * When final is set to true, module name prefix cannot be overwritten.
		 * @see jQuery.sap.registerModulePath
		 *
		 * Note that the empty prefix ('') will always match and thus serves as a fallback.
		 * @private
		 */
			mUrlPrefixes = { '' : { 'url' : 'resources/' } },

		/**
		 * Module neither has been required nor preloaded not declared, but someone asked for it.
		 */
			INITIAL = 0,

		/**
		 * Module has been preloaded, but not required or declared
		 */
			PRELOADED = -1,

		/**
		 * Module has been declared.
		 */
			LOADING = 1,

		/**
		 * Module has been loaded, but not yet executed.
		 */
			LOADED = 2,

		/**
		 * Module is currently being executed
		 */
			EXECUTING = 3,

		/**
		 * Module has been loaded and executed without errors.
		 */
			READY = 4,

		/**
		 * Module either could not be loaded or execution threw an error
		 */
			FAILED = 5,

		/**
		 * Set of modules that have been loaded (required) so far.
		 *
		 * Each module is an object that can have the following members
		 * <ul>
		 * <li>{int} state one of the module states defined in this function
		 * <li>{string} url URL where the module has been loaded from
		 * <li>{any} data temp. raw content of the module (between loaded and ready)
		 * <li>{string} error an error description for state <code>FAILED</code>
		 * <li>{any} content the content of the module as exported via define()
		 * </ul>
		 * @private
		 */
			mModules = {
				// predefine already loaded modules to avoid redundant loading
				// "sap/ui/thirdparty/jquery/jquery-1.7.1.js" : { state : READY, url : _sBootstrapUrl, content : jQuery },
				"sap/ui/thirdparty/URI.js" : { state : READY, url : _sBootstrapUrl, content : URI },
				"sap/ui/Device.js" : { state : READY, url : _sBootstrapUrl, content : sap.ui.Device },
				"jquery.sap.global.js" : { state : READY, url : _sBootstrapUrl, content : jQuery }
			},

			mPreloadModules = {},

		/* for future use
		/**
		 * Mapping from default AMD names to UI5 AMD names.
		 *
		 * For simpler usage in requireModule, the names are already converted to
		 * normalized resource names.
		 *
		 * /
			mAMDAliases = {
				'blanket.js': 'sap/ui/thirdparty/blanket.js',
				'crossroads.js': 'sap/ui/thirdparty/crossroads.js',
				'd3.js': 'sap/ui/thirdparty/d3.js',
				'handlebars.js': 'sap/ui/thirdparty/handlebars.js',
				'hasher.js': 'sap/ui/thirdparty/hasher.js',
				'IPv6.js': 'sap/ui/thirdparty/IPv6.js',
				'jquery.js': 'sap/ui/thirdparty/jquery.js',
				'jszip.js': 'sap/ui/thirdparty/jszip.js',
				'less.js': 'sap/ui/thirdparty/less.js',
				'OData.js': 'sap/ui/thirdparty/datajs.js',
				'punycode.js': 'sap/ui/thirdparty/punycode.js',
				'SecondLevelDomains.js': 'sap/ui/thirdparty/SecondLevelDomains.js',
				'sinon.js': 'sap/ui/thirdparty/sinon.js',
				'signals.js': 'sap/ui/thirdparty/signals.js',
				'URI.js': 'sap/ui/thirdparty/URI.js',
				'URITemplate.js': 'sap/ui/thirdparty/URITemplate.js',
				'esprima.js': 'sap/ui/demokit/js/esprima.js'
			},
		*/

		/**
		 * Information about third party modules that are delivered with the sap.ui.core library.
		 *
		 * The information maps the name of the module (including extension '.js') to an info object with the
		 * following properties:
		 *
		 * <ul>
		 * <li>amd:boolean : whether the module uses an AMD loader if present. UI5 will disable the AMD loader while loading
		 *              such modules to force the modules to expose their content via global names.</li>
		 * <li>exports:string[]|string : global name (or names) that are exported by the module. If one ore multiple names are defined,
		 *              the first one will be read from the global object and will be used as value of the module.</li>
		 * <li>deps:string[] : list of modules that the module depends on. The modules will be loaded first before loading the module itself.</li>
		 * </ul>
		 * to be able to work with jQuery.sap.require no matter whether an AMD loader is present or not.
		 *
		 * Note: this is a map for future extension
		 * Note: should be maintained together with raw-module info in .library files
		 * @private
		 */
			mAMDShim = {
				'sap/ui/thirdparty/blanket.js': {
					amd: true,
					exports: 'blanket' // '_blanket', 'esprima', 'falafel', 'inBrowser', 'parseAndModify'
				},
				'sap/ui/thirdparty/caja-html-sanitizer.js': {
					amd: false,
					exports: 'html' // 'html_sanitizer', 'html4'
				},
				'sap/ui/thirdparty/crossroads.js': {
					amd: true,
					exports: 'crossroads',
					deps: ['sap/ui/thirdparty/signals.js']
				},
				'sap/ui/thirdparty/d3.js': {
					amd: true,
					exports: 'd3'
				},
				'sap/ui/thirdparty/datajs.js': {
					amd: true,
					exports: 'OData' // 'datajs'
				},
				'sap/ui/thirdparty/es6-promise.js' : {
					amd: true,
					exports: 'ES6Promise'
				},
				'sap/ui/thirdparty/flexie.js': {
					exports: 'Flexie'
				},
				'sap/ui/thirdparty/handlebars.js': {
					amd: true,
					exports: 'Handlebars'
				},
				'sap/ui/thirdparty/hasher.js': {
					amd: true,
					exports: 'hasher',
					deps: ['sap/ui/thirdparty/signals.js']
				},
				'sap/ui/thirdparty/IPv6.js': {
					amd: true,
					exports: 'IPv6'
				},
				'sap/ui/thirdparty/iscroll-lite.js': {
					exports: 'iScroll'
				},
				'sap/ui/thirdparty/iscroll.js': {
					exports: 'iScroll'
				},
				'sap/ui/thirdparty/jquery.js': {
					amd: true
				},
				'sap/ui/thirdparty/jquery/jquery-1.11.1.js': {
					amd: true
				},
				'sap/ui/thirdparty/jquery/jquery-1.10.2.js': {
					amd: true
				},
				'sap/ui/thirdparty/jquery/jquery-1.10.1.js': {
					amd: true
				},
				'sap/ui/thirdparty/jquery/jquery.1.7.1.js': {
					amd: true
				},
				'sap/ui/thirdparty/jquery/jquery.1.8.1.js': {
					amd: true
				},
				'sap/ui/thirdparty/jquery-mobile-custom.js': {
					amd: true,
					exports: 'jQuery.mobile'
				},
				'sap/ui/thirdparty/jszip.js': {
					amd: true,
					exports: 'JSZip'
				},
				'sap/ui/thirdparty/less.js': {
					amd: true,
					exports: 'less'
				},
				'sap/ui/thirdparty/mobify-carousel.js': {
					exports: 'Mobify' // or Mobify.UI.Carousel?
				},
				'sap/ui/thirdparty/punycode.js': {
					amd: true,
					exports: 'punycode'
				},
				'sap/ui/thirdparty/require.js': {
					exports: 'define' // 'require', 'requirejs'
				},
				'sap/ui/thirdparty/SecondLevelDomains.js': {
					amd: true,
					exports: 'SecondLevelDomains'
				},
				'sap/ui/thirdparty/signals.js': {
					amd: true,
					exports: 'signals'
				},
				'sap/ui/thirdparty/sinon.js': {
					amd: true,
					exports: 'sinon'
				},
				'sap/ui/thirdparty/sinon-server.js': {
					amd: true,
					exports: 'sinon' // really sinon! sinon-server is a subset of server and uses the same global for export
				},
				'sap/ui/thirdparty/unorm.js': {
					exports: 'UNorm'
				},
				'sap/ui/thirdparty/unormdata.js': {
					exports: 'UNorm', // really 'UNorm'! module extends UNorm
					deps: ['sap/ui/thirdparty/unorm.js']
				},
				'sap/ui/thirdparty/URI.js' : {
					amd: true,
					exports: 'URI'
				},
				'sap/ui/thirdparty/URITemplate.js' : {
					amd: true,
					exports: 'URITemplate',
					deps: ['sap/ui/thirdparty/URI.js']
				},
				'sap/ui/thirdparty/vkbeautify.js' : {
					exports: 'vkbeautify'
				},
				'sap/ui/thirdparty/zyngascroll.js' : {
					exports: 'Scroller' // 'requestAnimationFrame', 'cancelRequestAnimationFrame', 'core'
				},
				'sap/ui/demokit/js/esprima.js' : {
					amd: true,
					exports: 'esprima'
				}
			},

		/**
		 * Stack of modules that are currently executed.
		 *
		 * Allows to identify the containing module in case of multi module files (e.g. sap-ui-core)
		 * @private
		 */
			_execStack = [ ],

		/**
		 * A prefix that will be added to module loading log statements and which reflects the nesting of module executions.
		 * @private
		 */
			sLogPrefix = "",

		// max size a script should have when executing it with execScript (IE). Otherwise fallback to eval
			MAX_EXEC_SCRIPT_LENGTH = 512 * 1024,

			sDocumentLocation = document.location.href.replace(/\?.*|#.*/g, ""),

			FRAGMENT = "fragment",
			VIEW = "view",
			mKnownSubtypes = {
				js :  [VIEW, FRAGMENT, "controller", "designtime"],
				xml:  [VIEW, FRAGMENT],
				json: [VIEW, FRAGMENT],
				html: [VIEW, FRAGMENT]
			},

			rJSSubtypes = new RegExp("(\\.(?:" + mKnownSubtypes.js.join("|") + "))?\\.js$"),
			rTypes,
			rSubTypes;

		(function() {
			var s = "",
				sSub = "";

			jQuery.each(mKnownSubtypes, function(sType, aSubtypes) {
				s = (s ? s + "|" : "") + sType;
				sSub = (sSub ? sSub + "|" : "") + "(?:(?:" + aSubtypes.join("\\.|") + "\\.)?" + sType + ")";
			});
			s = "\\.(" + s + ")$";
			sSub = "\\.(?:" + sSub + "|[^./]+)$";
			log.debug("constructed regexp for file types :" + s);
			log.debug("constructed regexp for file sub-types :" + sSub);
			rTypes = new RegExp(s);
			rSubTypes = new RegExp(sSub);
		}());

		/**
		 * Name conversion function that converts a name in UI5 module name syntax to a name in requireJS module name syntax.
		 * @private
		 */
		function ui5ToRJS(sName) {
			if ( /^sap\.ui\.thirdparty\.jquery\.jquery-/.test(sName) ) {
				return "sap/ui/thirdparty/jquery/jquery-" + sName.slice("sap.ui.thirdparty.jquery.jquery-".length);
			} else if ( /^jquery\.sap\./.test(sName) ) {
				return sName;
			}
			return sName.replace(/\./g, "/");
		}

		/**
		 * Name conversion function that converts a name in unified resource name syntax to a name in UI5 module name syntax.
		 * If the name cannot be converted (e.g. doesn't end with '.js'), then <code>undefined</code> is returned.
		 *
		 * @private
		 */
		function urnToUI5(sName) {
			// UI5 module name syntax is only defined for JS resources
			if ( !/\.js$/.test(sName) ) {
				return;
			}

			sName = sName.slice(0, -3);
			if ( /^sap\/ui\/thirdparty\/jquery\/jquery-/.test(sName) ) {
				return "sap.ui.thirdparty.jquery.jquery-" + sName.slice("sap/ui/thirdparty/jquery/jquery-".length);
			} else if ( /^jquery\.sap\./.test(sName) ) {
				return sName; // do nothing
			}
			return sName.replace(/\//g, ".");
		}

		// find longest matching prefix for resource name
		function getResourcePath(sResourceName, sSuffix) {

			// split name into segments
			var aSegments = sResourceName.split(/\//),
				l, sNamePrefix, sResult, m;

			// if no suffix was given and if the name is not empty, try to guess the suffix from the last segment
			if ( arguments.length === 1  &&  aSegments.length > 0 ) {
				// only known types (and their known subtypes) are accepted
				m = rSubTypes.exec(aSegments[aSegments.length - 1]);
				if ( m ) {
					sSuffix = m[0];
					aSegments[aSegments.length - 1] = aSegments[aSegments.length - 1].slice(0, m.index);
				} else {
					sSuffix = "";
				}
			}

			// search for a defined name prefix, starting with the full name and successively removing one segment
			for (l = aSegments.length; l >= 0; l--) {
				sNamePrefix = aSegments.slice(0, l).join('/');
				if ( mUrlPrefixes[sNamePrefix] ) {
					sResult = mUrlPrefixes[sNamePrefix].url;
					if ( l < aSegments.length ) {
						sResult += aSegments.slice(l).join('/');
					}
					if ( sResult.slice(-1) === '/' ) {
						sResult = sResult.slice(0, -1);
					}
					return sResult + (sSuffix || '');
				}
			}

			jQuery.sap.assert(false, "should never happen");
		}

		function guessResourceName(sURL) {
			var sNamePrefix,
				sUrlPrefix,
				sResourceName;

			for (sNamePrefix in mUrlPrefixes) {
				if ( mUrlPrefixes.hasOwnProperty(sNamePrefix) ) {

					// Note: configured URL prefixes are guaranteed to end with a '/'
					// But to support the legacy scenario promoted by the application tools ( "registerModulePath('Application','Application')" )
					// the prefix check here has to be done without the slash
					sUrlPrefix = mUrlPrefixes[sNamePrefix].url.slice(0, -1);

					if ( sURL.indexOf(sUrlPrefix) === 0 ) {

						// calc resource name
						sResourceName = sNamePrefix + sURL.slice(sUrlPrefix.length);
						// remove a leading '/' (occurs if name prefix is empty and if match was a full segment match
						if ( sResourceName.charAt(0) === '/' ) {
							sResourceName = sResourceName.slice(1);
						}

						if ( mModules[sResourceName] && mModules[sResourceName].data ) {
							return sResourceName;
						}
					}
				}
			}

			// return undefined;
		}

		var rDotsAnywhere = /(?:^|\/)\.+/;
		var rDotSegment = /^\.*$/;

		/**
		 * Resolves relative module names that contain <code>./</code> or <code>../</code> segments to absolute names.
		 * E.g.: A name <code>../common/validation.js</code> defined in <code>sap/myapp/controller/mycontroller.controller.js</code>
		 * may resolve to <code>sap/myapp/common/validation.js</code>.
		 *
		 * When sBaseName is <code>null</code>, relative names are not allowed (e.g. for a <code>sap.ui.require</code> call)
		 * and their usage results in an error being thrown.
		 *
		 * @param {string|null} sBaseName name of a reference module
		 * @param {string} sModuleName the name to resolve
		 * @returns {string} resolved name
		 * @private
		 */
		function resolveModuleName(sBaseName, sModuleName) {

			var m = rDotsAnywhere.exec(sModuleName),
				aSegments,
				sSegment,
				i,j,l;

			// check whether the name needs to be resolved at all - if not, just return the sModuleName as it is.
			if ( !m ) {
				return sModuleName;
			}

			// if the name starts with a relative segments then there must be a base name (a global sap.ui.require doesn't support relative names)
			if ( m.index === 0 && sBaseName == null ) {
				throw new Error("relative name not supported ('" + sModuleName + "'");
			}

			// if relative name starts with a dot segment, then prefix it with the base path
			aSegments = (m.index === 0 ? sBaseName + sModuleName : sModuleName).split('/');

			// process path segments
			for (i = 0, j = 0, l = aSegments.length; i < l; i++) {

				var sSegment = aSegments[i];

				if ( rDotSegment.test(sSegment) ) {
					if (sSegment === '.' || sSegment === '') {
						// ignore '.' as it's just a pointer to current package. ignore '' as it results from double slashes (ignored by browsers as well)
						continue;
					} else if (sSegment === '..') {
						// move to parent directory
						if ( j === 0 ) {
							throw new Error("Can't navigate to parent of root (base='" + sBaseName + "', name='" + sModuleName + "'");//  sBaseNamegetPackagePath(), relativePath));
						}
						j--;
					} else {
						throw new Error("illegal path segment '" + sSegment + "'");
					}
				} else {

					aSegments[j++] = sSegment;

				}

			}

			aSegments.length = j;

			return aSegments.join('/');
		}

		function declareModule(sModuleName) {
			var oModule;

			// sModuleName must be a unified resource name of type .js
			jQuery.sap.assert(/\.js$/.test(sModuleName), "must be a Javascript module");

			oModule = mModules[sModuleName] || (mModules[sModuleName] = { state : INITIAL });

			if ( oModule.state > INITIAL ) {
				return oModule;
			}

			if ( log.isLoggable() ) {
				log.debug(sLogPrefix + "declare module '" + sModuleName + "'");
			}

			// avoid cycles
			oModule.state = READY;

			// the first call to declareModule is assumed to identify the bootstrap module
			// Note: this is only a guess and fails e.g. when multiple modules are loaded via a script tag
			// to make it safe, we could convert 'declare' calls to e.g. 'subdeclare' calls at build time.
			if ( _execStack.length === 0 ) {
				_execStack.push(sModuleName);
				oModule.url = oModule.url || _sBootstrapUrl;
			}

			return oModule;
		}

		function requireModule(sModuleName) {

			// TODO enable when preload has been adapted:
			// sModuleName = mAMDAliases[sModuleName] || sModuleName;

			var m = rJSSubtypes.exec(sModuleName),
				oShim = mAMDShim[sModuleName],
				sBaseName, sType, oModule, aExtensions, i;

			// only for robustness, should not be possible by design (all callers append '.js')
			if ( !m ) {
				log.error("can only require Javascript module, not " + sModuleName);
				return;
			}

			if ( oShim && oShim.deps ) {
				if ( log.isLoggable() ) {
					log.debug("require dependencies of raw module " + sModuleName);
				}
				for (i = 0; i < oShim.deps.length; i++) {
					if ( log.isLoggable() ) {
						log.debug("  require " + oShim.deps[i]);
					}
					requireModule(oShim.deps[i]);
				}
			}

			// in case of having a type specified ignore the type for the module path creation and add it as file extension
			sBaseName = sModuleName.slice(0, m.index);
			sType = m[0]; // must be a normalized resource name of type .js sType can be empty or one of view|controller|fragment

			oModule = mModules[sModuleName] || (mModules[sModuleName] = { state : INITIAL });

			if ( log.isLoggable() ) {
				log.debug(sLogPrefix + "require '" + sModuleName + "' of type '" + sType + "'");
			}

			// check if module has been loaded already
			if ( oModule.state !== INITIAL ) {
				if ( oModule.state === PRELOADED ) {
					oModule.state = LOADED;
					execModule(sModuleName);
				}

				if ( oModule.state === READY ) {
					if ( log.isLoggable() ) {
						log.debug(sLogPrefix + "module '" + sModuleName + "' has already been loaded (skipped).");
					}
					return this;
				} else if ( oModule.state === FAILED ) {
					throw new Error("found in negative cache: '" + sModuleName +  "' from " + oModule.url + ": " + oModule.error);
				} else {
					// currently loading
					return this;
				}
			}

			// set marker for loading modules (to break cycles)
			oModule.state = LOADING;

			// if debug is enabled, try to load debug module first
			aExtensions = window["sap-ui-loaddbg"] ? ["-dbg", ""] : [""];
			for (i = 0; i < aExtensions.length && oModule.state !== LOADED; i++) {
				// create module URL for the current extension
				oModule.url = getResourcePath(sBaseName, aExtensions[i] + sType);
				if ( log.isLoggable() ) {
					log.debug(sLogPrefix + "loading " + (aExtensions[i] ? aExtensions[i] + " version of " : "") + "'" + sModuleName + "' from '" + oModule.url + "'");
				}
				/*eslint-disable no-loop-func */
				jQuery.ajax({
					url : oModule.url,
					dataType : 'text',
					async : false,
					success : function(response, textStatus, xhr) {
						oModule.state = LOADED;
						oModule.data = response;
					},
					error : function(xhr, textStatus, error) {
						oModule.state = FAILED;
						oModule.error = xhr ? xhr.status + " - " + xhr.statusText : textStatus;
					}
				});
				/*eslint-enable no-loop-func */
			}

			// execute module __after__ loading it, this reduces the required stack space!
			if ( oModule.state === LOADED ) {
				execModule(sModuleName);
			}

			if ( oModule.state !== READY ) {
				throw new Error("failed to load '" + sModuleName +  "' from " + oModule.url + ": " + oModule.error);
			}

		}

		// sModuleName must be a normalized resource name of type .js
		function execModule(sModuleName) {

			var oModule = mModules[sModuleName],
				oShim = mAMDShim[sModuleName],
				sOldPrefix, sScript, vAMD;

			if ( oModule && oModule.state === LOADED && typeof oModule.data !== "undefined" ) {

				// check whether the module is known to use an existing AMD loader, remember the AMD flag
				vAMD = (oShim === true || (oShim && oShim.amd)) && typeof window.define === "function" && window.define.amd;

				try {

					if ( vAMD ) {
						// temp. remove the AMD Flag from the loader
						delete window.define.amd;
					}

					if ( log.isLoggable() ) {
						log.debug(sLogPrefix + "executing '" + sModuleName + "'");
						sOldPrefix = sLogPrefix;
						sLogPrefix = sLogPrefix + ": ";
					}

					// execute the script in the window context
					oModule.state = EXECUTING;
					_execStack.push(sModuleName);
					if ( typeof oModule.data === "function" ) {
						oModule.data.call(window);
					} else if ( jQuery.isArray(oModule.data) ) {
						sap.ui.define.apply(sap.ui, oModule.data);
					} else {

						sScript = oModule.data;

						// sourceURL: Firebug, Chrome, Safari and IE11 debugging help, appending the string seems to cost ZERO performance
						// Note: IE11 supports sourceURL even when running in IE9 or IE10 mode
						// Note: make URL absolute so Chrome displays the file tree correctly
						// Note: do not append if there is already a sourceURL / sourceMappingURL
						if (sScript && !sScript.match(/\/\/[#@] source(Mapping)?URL=.*$/)) {
							sScript += "\n//# sourceURL=" + URI(oModule.url).absoluteTo(sDocumentLocation);
						}

						// framework internal hook to intercept the loaded script and modify
						// it before executing the script - e.g. useful for client side coverage
						if (typeof jQuery.sap.require._hook === "function") {
							sScript = jQuery.sap.require._hook(sScript, sModuleName);
						}

						if (_window.execScript && (!oModule.data || oModule.data.length < MAX_EXEC_SCRIPT_LENGTH) ) {
							try {
								oModule.data && _window.execScript(sScript); // execScript fails if data is empty
							} catch (e) {
								_execStack.pop();
								// eval again with different approach - should fail with a more informative exception
								jQuery.sap.globalEval(oModule.data);
								throw e; // rethrow err in case globalEval succeeded unexpectedly
							}
						} else {
							_window.eval(sScript);
						}
					}
					_execStack.pop();
					oModule.state = READY;
					oModule.data = undefined;
					// best guess for raw and legacy modules that don't use sap.ui.define
					oModule.content = oModule.content || jQuery.sap.getObject((oShim && oShim.exports) || urnToUI5(sModuleName));

					if ( log.isLoggable() ) {
						sLogPrefix = sOldPrefix;
						log.debug(sLogPrefix + "finished executing '" + sModuleName + "'");
					}

				} catch (err) {
					oModule.state = FAILED;
					oModule.error = ((err.toString && err.toString()) || err.message) + (err.line ? "(line " + err.line + ")" : "" );
					oModule.data = undefined;
					if ( window["sap-ui-debug"] && (/sap-ui-xx-show(L|-l)oad(E|-e)rrors=(true|x|X)/.test(location.search) || oCfgData["xx-showloaderrors"]) ) {
						log.error("error while evaluating " + sModuleName + ", embedding again via script tag to enforce a stack trace (see below)");
						jQuery.sap.includeScript(oModule.url);
						return;
					}

				} finally {

					// restore AMD flag
					if ( vAMD ) {
						window.define.amd = vAMD;
					}
				}
			}
		}

		function requireAll(sBaseName, aDependencies, fnCallback) {

			var aModules = [],
				i, sDepModName;

			for (i = 0; i < aDependencies.length; i++) {
				sDepModName = resolveModuleName(sBaseName, aDependencies[i]);
				log.debug(sLogPrefix + "require '" + sDepModName + "'");
				requireModule(sDepModName + ".js");
				// best guess for legacy modules that don't use sap.ui.define
				// TODO implement fallback for raw modules
				aModules[i] = mModules[sDepModName + ".js"].content || jQuery.sap.getObject(urnToUI5(sDepModName + ".js"));
				log.debug(sLogPrefix + "require '" + sDepModName + "': done.");
			}

			fnCallback(aModules);
		}

		/**
		 * Constructs an URL to load the module with the given name and file type (suffix).
		 *
		 * Searches the longest prefix of the given module name for which a registration
		 * exists (see {@link jQuery.sap.registerModulePath}) and replaces that prefix
		 * by the registered URL prefix.
		 *
		 * The remainder of the module name is appended to the URL, replacing any dot with a slash.
		 *
		 * Finally, the given suffix (typically a file name extension) is added (unconverted).
		 *
		 * The returned name (without the suffix) doesn't end with a slash.
		 *
		 * @param {string} sModuleName module name to detemrine the path for
		 * @param {string} sSuffix suffix to be added to the resulting path
		 * @return {string} calculated path (URL) to the given module
		 *
		 * @public
		 * @static
		 */
		jQuery.sap.getModulePath = function(sModuleName, sSuffix) {
			return getResourcePath(ui5ToRJS(sModuleName), sSuffix);
		};

		/**
		 * Determines the URL for a resource given its unified resource name.
		 *
		 * Searches the longest prefix of the given resource name for which a registration
		 * exists (see {@link jQuery.sap.registerResourcePath}) and replaces that prefix
		 * by the registered URL prefix.
		 *
		 * The remainder of the resource name is appended to the URL.
		 *
		 * <b>Unified Resource Names</b>
		 * Several UI5 APIs use <i>Unified Resource Names (URNs)</i> as naming scheme for resources that
		 * they deal with (e.h. Javascript, CSS, JSON, XML, ...). URNs are similar to the path
		 * component of an URL:
		 * <ul>
		 * <li>they consist of a non-empty sequence of name segments</li>
		 * <li>segments are separated by a forward slash '/'</li>
		 * <li>name segments consist of URL path segment characters only. It is recommened to use only ASCII
		 * letters (upper or lower case), digits and the special characters '$', '_', '-', '.')</li>
		 * <li>the empty name segment is not supported</li>
		 * <li>names consisting of dots only, are reserved and must not be used for resources</li>
		 * <li>names are case sensitive although the underlying server might be case-insensitive</li>
		 * <li>the behavior with regard to URL encoded characters is not specified, %ddd notation should be avoided</li>
		 * <li>the meaning of a leading slash is undefined, but might be defined in future. It therefore should be avoided</li>
		 * </ul>
		 *
		 * UI5 APIs that only deal with Javascript resources, use a slight variation of this scheme,
		 * where the extension '.js' is always omitted (see {@link sap.ui.define}, {@link sap.ui.require}).
		 *
		 *
		 * <b>Relationship to old Module Name Syntax</b>
		 *
		 * Older UI5 APIs that deal with resources (like {@link jQuery.sap.registerModulePath},
		 * {@link jQuery.sap.require} and {@link jQuery.sap.declare}) used a dot-separated naming scheme
		 * (called 'module names') which was motivated by object names in the global namespace in
		 * Javascript.
		 *
		 * The new URN scheme better matches the names of the corresponding resources (files) as stored
		 * in a server and the dot ('.') is no longer a forbidden character in a resource name. This finally
		 * allows to handle resources with different types (extensions) with the same API, not only JS files.
		 *
		 * Last but not least does the URN scheme better match the naming conventions used by AMD loaders
		 * (like <code>requireJS</code>).
		 *
		 * @param {string} sResourceName unified resource name of the resource
		 * @returns {string} URL to load the resource from
		 * @public
		 * @experimental Since 1.27.0
		 * @function
		 */
		jQuery.sap.getResourcePath = getResourcePath;

		/**
		 * Registers an URL prefix for a module name prefix.
		 *
		 * Before a module is loaded, the longest registered prefix of its module name
		 * is searched for and the associated URL prefix is used as a prefix for the request URL.
		 * The remainder of the module name is attached to the request URL by replacing
		 * dots ('.') with slashes ('/').
		 *
		 * The registration and search operates on full name segments only. So when a prefix
		 *
		 *    'sap.com'  ->  'http://www.sap.com/ui5/resources/'
		 *
		 * is registered, then it will match the name
		 *
		 *    'sap.com.Button'
		 *
		 * but not
		 *
		 *    'sap.commons.Button'
		 *
		 * Note that the empty prefix ('') will always match and thus serves as a fallback for
		 * any search.
		 *
		 * The prefix can either be given as string or as object which contains the url and a 'final' property.
		 * If 'final' is set to true, overwriting a module prefix is not possible anymore.
		 *
		 * @param {string} sModuleName module name to register a path for
		 * @param {string | object} vUrlPrefix path prefix to register, either a string literal or an object (e.g. {url : 'url/to/res', 'final': true})
		 * @param {string} [vUrlPrefix.url] path prefix to register
		 * @param {boolean} [vUrlPrefix.final] flag to avoid overwriting the url path prefix for the given module name at a later point of time
		 *
		 * @public
		 * @static
		 * @SecSink {1|PATH} Parameter is used for future HTTP requests
		 */
		jQuery.sap.registerModulePath = function registerModulePath(sModuleName, vUrlPrefix) {
			jQuery.sap.assert(!/\//.test(sModuleName), "module path must not contain a slash.");
			sModuleName = sModuleName.replace(/\./g, "/");
			// URL must not be empty
			vUrlPrefix = vUrlPrefix || '.';
			jQuery.sap.registerResourcePath(sModuleName, vUrlPrefix);
		};

		/**
		 * Registers an URL prefix for a resource name prefix.
		 *
		 * Before a resource is loaded, the longest registered prefix of its unified resource name
		 * is searched for and the associated URL prefix is used as a prefix for the request URL.
		 * The remainder of the resource name is attached to the request URL 1:1.
		 *
		 * The registration and search operates on full name segments only. So when a prefix
		 *
		 *    'sap/com'  ->  'http://www.sap.com/ui5/resources/'
		 *
		 * is registered, then it will match the name
		 *
		 *    'sap/com/Button'
		 *
		 * but not
		 *
		 *    'sap/commons/Button'
		 *
		 * Note that the empty prefix ('') will always match and thus serves as a fallback for
		 * any search.
		 *
		 * The url prefix can either be given as string or as object which contains the url and a final flag.
		 * If final is set to true, overwriting a resource name prefix is not possible anymore.
		 *
		 * @param {string} sResourceNamePrefix in unified resource name syntax
		 * @param {string | object} vUrlPrefix prefix to use instead of the sResourceNamePrefix, either a string literal or an object (e.g. {url : 'url/to/res', 'final': true})
		 * @param {string} [vUrlPrefix.url] path prefix to register
		 * @param {boolean} [vUrlPrefix.final] flag to avoid overwriting the url path prefix for the given module name at a later point of time
		 *
		 * @public
		 * @static
		 * @SecSink {1|PATH} Parameter is used for future HTTP requests
		 */
		jQuery.sap.registerResourcePath = function registerResourcePath(sResourceNamePrefix, vUrlPrefix) {

			sResourceNamePrefix = String(sResourceNamePrefix || "");

			if (mUrlPrefixes[sResourceNamePrefix] && mUrlPrefixes[sResourceNamePrefix]["final"] == true) {
				log.warning( "registerResourcePath with prefix " + sResourceNamePrefix + " already set as final to '" + mUrlPrefixes[sResourceNamePrefix].url + "'. This call is ignored." );
				return;
			}

			if ( typeof vUrlPrefix === 'string' || vUrlPrefix instanceof String ) {
				vUrlPrefix = { 'url' : vUrlPrefix };
			}

			if ( !vUrlPrefix || vUrlPrefix.url == null ) {
				delete mUrlPrefixes[sResourceNamePrefix];
				log.info("registerResourcePath ('" + sResourceNamePrefix + "') (registration removed)");
			} else {
				vUrlPrefix.url = String(vUrlPrefix.url);

				// remove query parameters
				var iQueryIndex = vUrlPrefix.url.indexOf("?");
				if (iQueryIndex !== -1) {
					vUrlPrefix.url = vUrlPrefix.url.substr(0, iQueryIndex);
				}

				// remove hash
				var iHashIndex = vUrlPrefix.url.indexOf("#");
				if (iHashIndex !== -1) {
					vUrlPrefix.url = vUrlPrefix.url.substr(0, iHashIndex);
				}

				// ensure that the prefix ends with a '/'
				if ( vUrlPrefix.url.slice(-1) != '/' ) {
					vUrlPrefix.url += '/';
				}
				mUrlPrefixes[sResourceNamePrefix] = vUrlPrefix;
				log.info("registerResourcePath ('" + sResourceNamePrefix + "', '" + vUrlPrefix.url + "')" + ((vUrlPrefix['final']) ? " (final)" : ""));
			}
		};

		/**
		 * Check whether a given module has been loaded / declared already.
		 *
		 * Returns true as soon as a module has been required the first time, even when
		 * loading/executing it has not finished yet. So the main assertion of a
		 * return value of <code>true</code> is that the necessary actions have been taken
		 * to make the module available in the near future. It does not mean, that
		 * the content of the module is already available!
		 *
		 * This fuzzy behavior is necessary to avoid multiple requests for the same module.
		 * As a consequence of the assertion above, a <i>preloaded</i> module does not
		 * count as <i>declared</i>. For preloaded modules, an explicit call to
		 * <code>jQuery.sap.require</code> is necessary to make them available.
		 *
		 * If a caller wants to know whether a module needs to be loaded from the server,
		 * it can set <code>bIncludePreloaded</code> to true. Then, preloaded modules will
		 * be reported as 'declared' as well by this method.
		 *
		 * @param {string} sModuleName name of the module to be checked
		 * @param {boolean} [bIncludePreloaded=false] whether preloaded modules should be reported as declared.
		 * @return {boolean} whether the module has been declared already
		 * @public
		 * @static
		 */
		jQuery.sap.isDeclared = function isDeclared(sModuleName, bIncludePreloaded) {
			sModuleName = ui5ToRJS(sModuleName) + ".js";
			return mModules[sModuleName] && (bIncludePreloaded || mModules[sModuleName].state !== PRELOADED);
		};

		/**
		 * Returns the names of all declared modules.
		 * @return {string[]} the names of all declared modules
		 * @see jQuery.sap.isDeclared
		 * @public
		 * @static
		 */
		jQuery.sap.getAllDeclaredModules = function() {
			var aModules = [];
			jQuery.each(mModules, function(sURN, oModule) {
				// filter out preloaded modules
				if ( oModule && oModule.state !== PRELOADED ) {
					var sModuleName = urnToUI5(sURN);
					if ( sModuleName ) {
						aModules.push(sModuleName);
					}
				}
			});
			return aModules;
		};

		// take resource roots from configuration
		if ( oCfgData.resourceroots ) {
			jQuery.each(oCfgData.resourceroots, jQuery.sap.registerModulePath);
		}

		// dump the URL prefixes
		log.info("URL prefixes set to:");
		for (var n in mUrlPrefixes) {
			log.info("  " + (n ? "'" + n + "'" : "(default)") + " : " + mUrlPrefixes[n].url + ((mUrlPrefixes[n]['final']) ? " (final)" : "") );
		}

		/**
		 * Declares a module as existing.
		 *
		 * By default, this function assumes that the module will create a JavaScript object
		 * with the same name as the module. As a convenience it ensures that the parent
		 * namespace for that object exists (by calling jQuery.sap.getObject).
		 * If such an object creation is not desired, <code>bCreateNamespace</code> must be set to false.
		 *
		 * @param {string | object}  sModuleName name of the module to be declared
		 *                           or in case of an object {modName: "...", type: "..."}
		 *                           where modName is the name of the module and the type
		 *                           could be a specific dot separated extension e.g.
		 *                           <code>{modName: "sap.ui.core.Dev", type: "view"}</code>
		 *                           loads <code>sap/ui/core/Dev.view.js</code> and
		 *                           registers as <code>sap.ui.core.Dev.view</code>
		 * @param {boolean} [bCreateNamespace=true] whether to create the parent namespace
		 *
		 * @public
		 * @static
		 */
		jQuery.sap.declare = function(sModuleName, bCreateNamespace) {

			var sNamespaceObj = sModuleName;

			// check for an object as parameter for sModuleName
			// in case of this the object contains the module name and the type
			// which could be {modName: "sap.ui.core.Dev", type: "view"}
			if (typeof (sModuleName) === "object") {
				sNamespaceObj = sModuleName.modName;
				sModuleName = ui5ToRJS(sModuleName.modName) + (sModuleName.type ? "." + sModuleName.type : "") + ".js";
			} else {
				sModuleName = ui5ToRJS(sModuleName) + ".js";
			}

			declareModule(sModuleName);

			// ensure parent namespace even if module was declared already
			// (as declare might have been called by require)
			if (bCreateNamespace !== false) {
				// ensure parent namespace
				jQuery.sap.getObject(sNamespaceObj, 1);
			}

			return this;
		};

		/**
		 * Ensures that the given module is loaded and executed before execution of the
		 * current script continues.
		 *
		 * By issuing a call to this method, the caller declares a dependency to the listed modules.
		 *
		 * Any required and not yet loaded script will be loaded and execute synchronously.
		 * Already loaded modules will be skipped.
		 *
		 * @param {...string | object}  vModuleName one or more names of modules to be loaded
		 *                              or in case of an object {modName: "...", type: "..."}
		 *                              where modName is the name of the module and the type
		 *                              could be a specific dot separated extension e.g.
		 *                              <code>{modName: "sap.ui.core.Dev", type: "view"}</code>
		 *                              loads <code>sap/ui/core/Dev.view.js</code> and
		 *                              registers as <code>sap.ui.core.Dev.view</code>
		 *
		 * @public
		 * @static
		 * @function
		 * @SecSink {0|PATH} Parameter is used for future HTTP requests
		 */
		jQuery.sap.require = function(vModuleName, fnCallback) {

			if ( arguments.length > 1 ) {
				// legacy mode with multiple arguments, each representing a dependency
				for (var i = 0; i < arguments.length; i++) {
					jQuery.sap.require(arguments[i]);
				}
				return this;
			}

			// check for an object as parameter for sModuleName
			// in case of this the object contains the module name and the type
			// which could be {modName: "sap.ui.core.Dev", type: "view"}
			if (typeof (vModuleName) === "object") {
				jQuery.sap.assert(!vModuleName.type || jQuery.inArray(vModuleName.type, mKnownSubtypes.js) >= 0, "type must be empty or one of " + mKnownSubtypes.js.join(", "));
				vModuleName = ui5ToRJS(vModuleName.modName) + (vModuleName.type ? "." + vModuleName.type : "") + ".js";
			} else {
				vModuleName = ui5ToRJS(vModuleName) + ".js";
			}

			jQuery.sap.measure.start(vModuleName,"Require module " + vModuleName, ["require"]);
			requireModule(vModuleName);
			jQuery.sap.measure.end(vModuleName);

			return this; // TODO
		};

		/**
		 * UI5 internal method that loads the given module, specified in requireJS notation (URL like, without extension).
		 *
		 * Applications MUST NOT USE THIS METHOD as it will be removed in one of the future versions.
		 * It is only intended for sap.ui.component.
		 *
		 * @param {string} sModuleName Module name in requireJS syntax
		 * @private
		 */
		jQuery.sap._requirePath = function(sModuleName) {
			requireModule(sModuleName + ".js");
		};

		window.sap = window.sap || {};
		sap.ui = sap.ui || {};

		/**
		 * Defines a Javascript module with its name, its dependencies and a module value or factory.
		 *
		 * The typical and only suggested usage of this method is to have one single, top level call to
		 * <code>sap.ui.define</code> in one Javascript resource (file). When a module is requested by its
		 * name for the first time, the corresponding resource is determined from the name and the current
		 * {@link jQuery.sap.registerResourcePath configuration}. The resource will be loaded and executed
		 * which in turn will execute the top level <code>sap.ui.define</code> call.
		 *
		 * If the module name was omitted from that call, it will be substituted by the name that was used to
		 * request the module. As a preparation step, the dependencies as well as their transitive dependencies,
		 * will be loaded. Then, the module value will be determined: if a static value (object, literal) was
		 * given, that value will be the module value. If a function was given, that function will be called
		 * (providing the module values of the declared dependencies as parameters to the function) and its
		 * return value will be used as module value. The framework internally associates the resulting value
		 * with the module name and provides it to the original requestor of the module. Whenever the module
		 * is requested again, the same value will be returned (modules are executed only once).
		 *
		 * <i>Example:</i><br>
		 * The following example defines a module "SomeClass", but doesn't hard code the module name.
		 * If stored in a file 'sap/mylib/SomeClass.js', it can be requested as 'sap/mylib/SomeClass'.
		 * <pre>
		 *   sap.ui.define(['./Helper', 'sap/m/Bar'], function(Helper,Bar) {
		 *
		 *     // create a new class
		 *     var SomeClass = function();
		 *
		 *     // add methods to its prototype
		 *     SomeClass.prototype.foo = function() {
		 *
		 *         // use a function from the dependency 'Helper' in the same package (e.g. 'sap/mylib/Helper' )
		 *         var mSettings = Helper.foo();
		 *
		 *         // create and return a sap.m.Bar (using its local name 'Bar')
		 *         return new Bar(mSettings);
		 *
		 *     }
		 *
		 *     // return the class as module value
		 *     return SomeClass;
		 *
		 *   });
		 * </pre>
		 *
		 * In another module or in an application HTML page, the {@link sap.ui.require} API can be used
		 * to load the Something module and to work with it:
		 *
		 * <pre>
		 * sap.ui.require(['sap/mylib/Something'], function(Something) {
		 *
		 *   // instantiate a Something and call foo() on it
		 *   new Something().foo();
		 *
		 * });
		 * </pre>
		 *
		 * <b>Module Name Syntax</b><br>
		 * <code>sap.ui.define</code> uses a simplified variant of the {@link jQuery.sap.getResourcePath
		 * unified resource name} syntax for the module's own name as well as for its dependencies.
		 * The only difference to that syntax is, that for <code>sap.ui.define</code> and
		 * <code>sap.ui.require</code>, the extension (which always would be '.js') has to be omitted.
		 * Both methods always add this extension internally.
		 *
		 * As a convenience, the name of a dependency can start with the segment './' which will be
		 * replaced by the name of the package that contains the currently defined module (relative name).
		 *
		 * It is best practice to omit the name of the defined module (first parameter) and to use
		 * relative names for the dependencies whenever possible. This reduces the necessary configuration,
		 * simplifies renaming of packages and allows to map them to a different namespace.
		 *
		 *
		 * <b>Dependency to Modules</b><br>
		 * If a dependencies array is given, each entry represents the name of another module that
		 * the currently defined module depends on. All dependency modules are loaded before the value
		 * of the currently defined module is determined. The module value of each dependency module
		 * will be provided as a parameter to a factory function, the order of the parameters will match
		 * the order of the modules in the dependencies array.
		 *
		 * <b>Note:</b> the order in which the dependency modules are <i>executed</i> is <b>not</b>
		 * defined by the order in the dependencies array! The execution order is affected by dependencies
		 * <i>between</i> the dependency modules as well as by their current state (whether a module
		 * already has been loaded or not). Neither module implementations nor dependants that require
		 * a module set must make any assumption about the execution order (other than expressed by
		 * their dependencies). There is, however, one exception with regard to third party libraries,
		 * see the list of limitations further down below.
		 *
		 * <b>Note:</b>a static module value (a literal provided to <code>sap.ui.define</code>) cannot
		 * depend on the module values of the depency modules. Instead, modules can use a factory function,
		 * calculate the static value in that function, potentially based on the dependencies, and return
		 * the result as module value. The same approach must be taken when the module value is supposed
		 * to be a function.
		 *
		 *
		 * <b>Asynchronous Contract</b><br>
		 * <code>sap.ui.define</code> is designed to support real Asynchronous Module Definitions (AMD)
		 * in future, although it internally still uses the the old synchronous module loading of UI5.
		 * Callers of <code>sap.ui.define</code> therefore must not rely on any synchronous behavior
		 * that they might observe with the current implementation.
		 *
		 * For example, callers of <code>sap.ui.define</code> must not use the module value immediately
		 * after invoking <code>sap.ui.define</code>:
		 *
		 * <pre>
		 *   // COUNTER EXAMPLE HOW __NOT__ TO DO IT
		 *
		 *   // define a class Something as AMD module
		 *   sap.ui.define('Something', [], function() {
		 *     var Something = function();
		 *     return Something;
		 *   });
		 *
		 *   // DON'T DO THAT!
		 *   // accessing the class _synchronously_ after sap.ui.define was called
		 *   new Something();
		 * </pre>
		 *
		 * Applications that need to ensure synchronous module definition or synchronous loading of dependencies
		 * <b>MUST</b> use the old {@link jQuery.sap.declare} and {@link jQuery.sap.require} APIs.
		 *
		 *
		 * <b>(No) Global References</b><br>
		 * To be in line with AMD best practices, modules defined with <code>sap.ui.define</code>
		 * should not make any use of global variables if those variables are also available as module
		 * values. Instead, they should add dependencies to those modules and use the corresponding parameter
		 * of the factory function to access the module value.
		 *
		 * As the current programming model and the documentation of UI5 heavily rely on global names,
		 * there will be a transition phase where UI5 enables AMD modules and local references to module
		 * values in parallel to the old global names. The fourth parameter of <code>sap.ui.define</code>
		 * has been added to support that transition phase. When this parameter is set to true, the framework
		 * provides two additional functionalities
		 *
		 * <ol>
		 * <li>before the factory function is called, the existence of the global parent namespace for
		 *     the current module is ensured</li>
		 * <li>the module value will be automatically exported under a global name which is derived from
		 *     the name of the module</li>
		 * </ol>
		 *
		 * The parameter lets the framework know whether any of those two operations is needed or not.
		 * In future versions of UI5, a central configuration option is planned to suppress those 'exports'.
		 *
		 *
		 * <b>Third Party Modules</b><br>
		 * Although third party modules don't use UI5 APIs, they still can be listed as dependencies in
		 * a <code>sap.ui.define</code> call. They will be requested and executed like UI5 modules, but their
		 * module value will be <code>undefined</code>.
		 *
		 * If the currently defined module needs to access the module value of such a third party module,
		 * it can access the value via its global name (if the module supports such a usage).
		 *
		 * Note that UI5 temporarily deactivates an existing AMD loader while it executes third party modules
		 * known to support AMD. This sounds contradictarily at a first glance as UI5 wants to support AMD,
		 * but for now it is necessary to fully support UI5 apps that rely on global names for such modules.
		 *
		 * Example:
		 * <pre>
		 *   // module 'Something' wants to use third party library 'URI.js'
		 *   // It is packaged by UI5 as non-UI5-module 'sap/ui/thirdparty/URI'
		 *
		 *   sap.ui.define('Something', ['sap/ui/thirdparty/URI'], function(URIModuleValue) {
		 *
		 *     new URIModuleValue(); // fails as module value is undefined
		 *
		 *     //global URI // (optional) declare usage of global name so that static code checks don't complain
		 *     new URI(); // access to global name 'URI' works
		 *
		 *     ...
		 *   });
		 * </pre>
		 *
		 *
		 * <b>Differences to requireJS</b><br>
		 * The current implementation of <code>sap.ui.define</code> differs from <code>requireJS</code>
		 * or other AMD loaders in several aspects:
		 * <ul>
		 * <li>the name <code>sap.ui.define</code> is different from the plain <code>define</code>.
		 * This has two reasons: first, it avoids the impression that <code>sap.ui.define</code> is
		 * an exact implementation of an AMD loader. And second, it allows the coexistence of an AMD
		 * loader (requireJS) and <code>sap.ui.define</code> in one application as long as UI5 or
		 * apps using UI5 are not fully prepared to run with an AMD loader</li>
		 * <li><code>sap.ui.define</code> currently loads modules with synchronous XHR calls. This is
		 * basically a tribute to the synchronous history of UI5.
		 * <b>BUT:</b> synchronous dependency loading and factory execution explicitly it not part of
		 * contract of <code>sap.ui.define</code>. To the contrary, it is already clear and planned
		 * that asynchronous loading will be implemented, at least as an alternative if not as the only
		 * implementation. Also check section <b>Asynchronous Contract</b> above.<br>
		 * Applications that need to ensure synchronous loading of dependencies <b>MUST</b> use the old
		 * {@link jQuery.sap.require} API.</li>
		 * <li><code>sap.ui.define</code> does not support plugins to use other file types, formats or
		 * protocols. It is not planned to support this in future</li>
		 * <li><code>sap.ui.define</code> does <b>not</b> support the 'sugar' of requireJS where CommonJS
		 * style dependency declarations using <code>sap.ui.require("something")</code> are automagically
		 * converted into <code>sap.ui.define</code> dependencies before executing the factory function.</li>
		 * </ul>
		 *
		 *
		 * <b>Limitations, Design Considerations</b><br>
		 * <ul>
		 * <li><b>Limitation</b>: as dependency management is not supported for Non-UI5 modules, the only way
		 *     to ensure proper execution order for such modules currently is to rely on the order in the
		 *     dependency array. Obviously, this only works as long as <code>sap.ui.define</code> uses
		 *     synchronous loading. It will be enhanced when asynchronous loading is implemented.</li>
		 * <li>it was discussed to enfore asynchronous execution of the module factory function (e.g. with a
		 *     timeout of 0). But this would have invalidated the current migration scenario where a
		 *     sync <code>jQuery.sap.require</code> call can load a <code>sap.ui.define</code>'ed module.
		 *     If the module definition would not execute synchronously, the synchronous contract of the
		 *     require call would be broken (default behavior in existing UI5 apps)</li>
		 * <li>a single file must not contain multiple calls to <code>sap.ui.define</code>. Multiple calls
		 *     currently are only supported in the so called 'preload' files that the UI5 merge tooling produces.
		 *     The exact details of how this works might be changed in future implementations and are not
		 *     yet part of the API contract</li>
		 * </ul>
		 * @param {string} [sModuleName] name of the module in simplified resource name syntax.
		 *        When omitted, the loader determines the name from the request.
		 * @param {string[]} [aDependencies] list of dependencies of the module
		 * @param {function|any} vFactory the module value or a function that calculates the value
		 * @param {boolean} [bExport] whether an export to global names is required - should be used by SAP-owned code only
		 * @since 1.27.0
		 * @public
		 * @experimental Since 1.27.0 - not all aspects of sap.ui.define are settled yet. If the documented
		 *        constraints and limitations are obeyed, SAP-owned code might use it. If the fourth parameter
		 *        is not used and if the asynchronous contract is respected, even Non-SAP code might use it.
		 */
		sap.ui.define = function(sModuleName, aDependencies, vFactory, bExport) {
			var sResourceName, sBaseName;

			// optional id
			if ( typeof sModuleName === 'string' ) {
				sResourceName = sModuleName + '.js';
			} else {
				// shift parameters
				bExport = vFactory;
				vFactory = aDependencies;
				aDependencies = sModuleName;
				sResourceName = _execStack[_execStack.length - 1];
			}

			// convert module name to UI5 module name syntax (might fail!)
			sModuleName = urnToUI5(sResourceName);

			// calculate the base name for relative module names
			sBaseName = sResourceName.slice(0, sResourceName.lastIndexOf('/') + 1);

			// optional array of dependencies
			if ( !jQuery.isArray(aDependencies) ) {
				// shift parameters
				bExport = vFactory;
				vFactory = aDependencies;
				aDependencies = [];
			}

			if ( log.isLoggable() ) {
				log.debug("define(" + sResourceName + ", " + "['" + aDependencies.join("','") + "']" + ")");
			}

			var oModule = declareModule(sResourceName);

			// Note: dependencies will be resolved and converted from RJS to URN inside requireAll
			requireAll(sBaseName, aDependencies, function(aModules) {

				// factory
				if ( log.isLoggable() ) {
					log.debug("define(" + sResourceName + "): calling factory " + typeof vFactory);
				}

				if ( bExport ) {
					// ensure parent namespace
					var sPackage = sResourceName.split('/').slice(0,-1).join('.');
					if ( sPackage ) {
						jQuery.sap.getObject(sPackage, 0);
					}
				}

				if ( typeof vFactory === 'function' ) {
					oModule.content = vFactory.apply(window, aModules);
				} else {
					oModule.content = vFactory;
				}

				// HACK: global export
				if ( bExport ) {
					if ( oModule.content == null ) {
						log.error("module '" + sResourceName + "' returned no content, but should be exported");
					} else {
						if ( log.isLoggable() ) {
							log.debug("exporting content of '" + sResourceName + "': as global object");
						}
						jQuery.sap.setObject(sModuleName, oModule.content);
					}
				}

			});

		};

		/**
		 * @private
		 */
		sap.ui.predefine = function(sModuleName, aDependencies, vFactory, bExport) {

			if ( typeof sModuleName !== 'string' ) {
				throw new Error("sap.ui.predefine requires a module name");
			}

			var sResourceName = sModuleName + '.js';
			var oModule = mModules[sResourceName];
			if ( !oModule ) {
				mModules[sResourceName] = { state : PRELOADED, url : "TODO???/" + sModuleName, data : [sModuleName, aDependencies, vFactory, bExport], group: null };
			}

			// when a library file is preloaded, also mark its preload file as loaded
			// for normal library preload, this is redundant, but for non-default merged entities
			// like sap/fiori/core.js it avoids redundant loading of library preload files
			if ( sResourceName.match(/\/library\.js$/) ) {
				mPreloadModules[urnToUI5(sResourceName) + "-preload"] = true;
			}

		};

		/**
		 * Resolves one or more module dependencies.
		 *
		 * <b>Synchronous Retrieval of a Single Module Value</b>
		 *
		 * When called with a single string, that string is assumed to be the name of an already loaded
		 * module and the value of that module is returned. If the module has not been loaded yet,
		 * or if it is a Non-UI5 module (e.g. third party module), <code>undefined</code> is returned.
		 * This signature variant allows synchronous access to module values without initiating module loading.
		 *
		 * Sample:
		 * <pre>
		 *   var JSONModel = sap.ui.require("sap/ui/model/json/JSONModel");
 		 * </pre>
 		 *
 		 * For modules that are known to be UI5 modules, this signature variant can be used to check whether
 		 * the module has been loaded.
 		 *
		 * <b>Asynchronous Loading of Multiple Modules</b>
		 *
		 * If an array of strings is given and (optionally) a callback function, then the strings
		 * are interpreted as module names and the corresponding modules (and their transitive
		 * dependencies) are loaded. Then the callback function will be called asynchronously.
		 * The module values of the specified modules will be provided as parameters to the callback
		 * function in the same order in which they appeared in the dependencies array.
		 *
		 * The return value for the asynchronous use case is <code>undefined</code>.
		 *
		 * <pre>
		 *   sap.ui.require(['sap/ui/model/json/JSONModel', 'sap/ui/core/UIComponent'], function(JSONModel,UIComponent) {
		 *
		 *     var MyComponent = UIComponent.extend('MyComponent', {
		 *       ...
		 *     });
		 *     ...
		 *
		 *   });
 		 * </pre>
 		 *
		 * This method uses the same variation of the {@link jQuery.sap.getResourcePath unified resource name}
		 * syntax that {@link sap.ui.define} uses: module names are specified without the implicit extension '.js'.
		 * Relative module names are not supported.
		 *
		 * @param {string|string[]} vDependencies dependency (dependencies) to resolve
		 * @param {function} [fnCallback] callback function to execute after resolving an array of dependencies
		 * @returns {any|undefined} a single module value or undefined
		 * @public
		 * @experimental Since 1.27.0 - not all aspects of sap.ui.require are settled yet. E.g. the return value
		 * of the asynchronous use case might change (currently it is undefined).
		 */
		sap.ui.require = function(vDependencies, fnCallback) {
			jQuery.sap.assert(typeof vDependencies === 'string' || jQuery.isArray(vDependencies), "dependency param either must be a single string or an array of strings");
			jQuery.sap.assert(fnCallback == null || typeof fnCallback === 'function', "callback must be a function or null/undefined");

			if ( typeof vDependencies === 'string' ) {

				var sModuleName = vDependencies + '.js',
					oModule = mModules[sModuleName];

				return oModule ? (oModule.content || jQuery.sap.getObject(urnToUI5(sModuleName))) : undefined;

			}

			requireAll(null, vDependencies, function(aModules) {

				if ( typeof fnCallback === 'function' ) {
					// enforce asynchronous execution of callback
					setTimeout(function() {
						fnCallback.apply(window, aModules);
					},0);
				}

			});

			// return undefined;
		};

		jQuery.sap.preloadModules = function(sPreloadModule, bAsync, oSyncPoint) {

			var sURL, iTask;

			jQuery.sap.assert(!bAsync || oSyncPoint, "if mode is async, a syncpoint object must be given");

			if ( mPreloadModules[sPreloadModule] ) {
				return;
			}

			mPreloadModules[sPreloadModule] = true;

			sURL = jQuery.sap.getModulePath(sPreloadModule, ".json");

			log.debug("preload file " + sPreloadModule);
			iTask = oSyncPoint && oSyncPoint.startTask("load " + sPreloadModule);
			jQuery.ajax({
				dataType : "json",
				async : bAsync,
				url : sURL,
				success : function(data) {
					if ( data ) {
						data.url = sURL;
					}
					jQuery.sap.registerPreloadedModules(data, bAsync, oSyncPoint);
					oSyncPoint && oSyncPoint.finishTask(iTask);
				},
				error : function(xhr, textStatus, error) {
					log.error("failed to preload '" + sPreloadModule + "': " + (error || textStatus));
					oSyncPoint && oSyncPoint.finishTask(iTask, false);
				}
			});

		};

		jQuery.sap.registerPreloadedModules = function(oData, bAsync, oSyncPoint) {

			var bOldSyntax = Version(oData.version || "1.0").compareTo("2.0") < 0;

			if ( log.isLoggable() ) {
				log.debug(sLogPrefix + "adding preloaded modules from '" + oData.url + "'");
			}

			if ( oData.name ) {
				mPreloadModules[oData.name] = true;
			}

			jQuery.each(oData.modules, function(sName,sContent) {
				sName = bOldSyntax ? ui5ToRJS(sName) + ".js" : sName;
				if ( !mModules[sName] ) {
					mModules[sName] = { state : PRELOADED, url : oData.url + "/" + sName, data : sContent, group: oData.name };
				}
				// when a library file is preloaded, also mark its preload file as loaded
				// for normal library preload, this is redundant, but for non-default merged entities
				// like sap/fiori/core.js it avoids redundant loading of library preload files
				if ( sName.match(/\/library\.js$/) ) {
					mPreloadModules[urnToUI5(sName) + "-preload"] = true;
				}
			});

			if ( oData.dependencies ) {
				jQuery.each(oData.dependencies, function(idx,sModuleName) {
					jQuery.sap.preloadModules(sModuleName, bAsync, oSyncPoint);
				});
			}
		};

		/**
		 * Removes a set of resources from the resource cache.
		 *
		 * @param {string} sName unified resource name of a resource or the name of a preload group to be removed
		 * @param {boolean} [bPreloadGroup=true] whether the name specifies a preload group, defaults to true
		 * @param {boolean} [bUnloadAll] Whether all matching resources should be unloaded, even if they have been executed already.
		 * @param {boolean} [bDeleteExports] Whether exportss (global variables) should be destroyed as well. Will be done for UI5 module names only.
		 * @experimental Since 1.16.3 API might change completely, apps must not develop against it.
		 * @private
		 */
		jQuery.sap.unloadResources = function(sName, bPreloadGroup, bUnloadAll, bDeleteExports) {
			var aModules = [];

			if ( bPreloadGroup == null ) {
				bPreloadGroup = true;
			}

			if ( bPreloadGroup ) {
				// collect modules that belong to the given group
				jQuery.each(mModules, function(sURN, oModule) {
					if ( oModule && oModule.group === sName ) {
						aModules.push(sURN);
					}
				});
				// also remove a preload entry
				delete mPreloadModules[sName];

			} else {
				// single module
				if ( mModules[sName] ) {
					aModules.push(sName);
				}
			}

			jQuery.each(aModules, function(i, sURN) {
				var oModule = mModules[sURN];
				if ( oModule && bDeleteExports && sURN.match(/\.js$/) ) {
					jQuery.sap.setObject(urnToUI5(sURN), undefined); // TODO really delete property
				}
				if ( oModule && (bUnloadAll || oModule.state === PRELOADED) ) {
				  delete mModules[sURN];
				}
			});

		};

		/**
		 * Converts a UI5 module name to a unified resource name.
		 *
		 * Used by View and Fragment APIs to convert a given module name into an URN.
		 *
		 * @experimental Since 1.16.0, not for public usage yet.
		 * @private
		 */
		jQuery.sap.getResourceName = function(sModuleName, sSuffix) {
			return ui5ToRJS(sModuleName) + (sSuffix || ".js");
		};

		/**
		 * Retrieves the resource with the given name, either from the preload cache or from
		 * the server. The expected data type of the resource can either be specified in the
		 * options (<code>dataType</code>) or it will be derived from the suffix of the <code>sResourceName</code>.
		 * The only supported data types so far are xml, html, json and text. If the resource name extension
		 * doesn't match any of these extensions, the data type must be specified in the options.
		 *
		 * If the resource is found in the preload cache, it will be converted from text format
		 * to the requested <code>dataType</code> using a converter from <code>jQuery.ajaxSettings.converters</code>.
		 *
		 * If it is not found, the resource name will be converted to a resource URL (using {@link #getResourcePath})
		 * and the resulting URL will be requested from the server with a synchronous jQuery.ajax call.
		 *
		 * If the resource was found in the local preload cache and any necessary conversion succeeded
		 * or when the resource was retrieved from the backend successfully, the content of the resource will
		 * be returned. In any other case, an exception will be thrown, or if option failOnError is set to true,
		 * <code>null</code> will be returned.
		 *
		 * Future implementations of this API might add more options. Generic implementations that accept an
		 * <code>mOptions</code> object and propagate it to this function should limit the options to the currently
		 * defined set of options or they might fail for unknown options.
		 *
		 * For asynchronous calls the return value of this method is an ECMA Script 6 Promise object which callbacks are triggered
		 * when the resource is ready:
		 * If <code>failOnError</code> is <code>false</code> the catch callback of the promise is not called. The argument given to the fullfilled
		 * callback is null in error case.
		 * If <code>failOnError</code> is <code>true</code> the catch callback will be triggered. The argument is an Error object in this case.
		 *
		 * @param {string} [sResourceName] resourceName in unified resource name syntax
		 * @param {object} [mOptions] options
		 * @param {object} [mOptions.dataType] one of "xml", "html", "json" or "text". If not specified it will be derived from the resource name (extension)
		 * @param {string} [mOptions.name] unified resource name of the resource to load (alternative syntax)
		 * @param {string} [mOptions.url] url of a resource to load (alternative syntax, name will only be a guess)
		 * @param {string} [mOptions.headers] Http headers for an eventual XHR request
		 * @param {string} [mOptions.failOnError=true] whether to propagate load errors or not
		 * @param {string} [mOptions.async=false] whether the loading should be performed asynchronously.
		 * @return {string|Document|object|Promise} content of the resource. A string for text or html, an Object for JSON, a Document for XML. For asynchronous calls an ECMA Script 6 Promise object will be returned.
		 * @throws Error if loading the resource failed
		 * @private
		 * @experimental API is not yet fully mature and may change in future.
		 * @since 1.15.1
		 */
		jQuery.sap.loadResource = function(sResourceName, mOptions) {

			var sType,
				oData,
				sUrl,
				oError,
				oDeferred;

			if ( typeof sResourceName === "string" ) {
				mOptions = mOptions || {};
			} else {
				mOptions = sResourceName || {};
				sResourceName = mOptions.name;
				if ( !sResourceName && mOptions.url) {
					sResourceName = guessResourceName(mOptions.url);
				}
			}
			// defaulting
			mOptions = jQuery.extend({ failOnError: true, async: false }, mOptions);

			sType = mOptions.dataType;
			if ( sType == null && sResourceName ) {
				sType = (sType = rTypes.exec(sResourceName)) && sType[1];
			}

			jQuery.sap.assert(/^(xml|html|json|text)$/.test(sType), "type must be one of xml, html, json or text");

			oDeferred = mOptions.async ? new jQuery.Deferred() : null;

			function handleData(d, e) {
				if ( d == null && mOptions.failOnError ) {
					oError = e || new Error("no data returned for " + sResourceName);
					if (mOptions.async) {
						oDeferred.reject(oError);
						jQuery.sap.log.error(oError);
					}
					return null;
				}

				if (mOptions.async) {
					oDeferred.resolve(d);
				}

				return d;
			}

			function convertData(d) {
				var vConverter = jQuery.ajaxSettings.converters["text " + sType];
				if ( typeof vConverter === "function" ) {
					d = vConverter(d);
				}
				return handleData(d);
			}

			if ( sResourceName && mModules[sResourceName] ) {
				oData = mModules[sResourceName].data;
				mModules[sResourceName].state = LOADED;
			}

			if ( oData != null ) {

				if (mOptions.async) {
					//Use timeout to simulate async behavior for this sync case for easier usage
					setTimeout(function(){
						convertData(oData);
					}, 0);
				} else {
					oData = convertData(oData);
				}

			} else {

				jQuery.ajax({
					url : sUrl = mOptions.url || getResourcePath(sResourceName),
					async : mOptions.async,
					dataType : sType,
					headers: mOptions.headers,
					success : function(data, textStatus, xhr) {
						oData = handleData(data);
					},
					error : function(xhr, textStatus, error) {
						oError = new Error("resource " + sResourceName + " could not be loaded from " + sUrl + ". Check for 'file not found' or parse errors. Reason: " + error);
						oError.status = textStatus;
						oError.error = error;
						oError.statusCode = xhr.status;
						oData = handleData(null, oError);
					}
				});

			}

			if ( mOptions.async ) {
				return Promise.resolve(oDeferred);
			}

			if ( oError != null && mOptions.failOnError ) {
				throw oError;
			}

			return oData;
		};

		/*
		 * register a global event handler to detect script execution errors.
		 * Only works for browsers that support document.currentScript.
		 * /
		window.addEventListener("error", function(e) {
			if ( document.currentScript && document.currentScript.dataset.sapUiModule ) {
				var error = {
					message: e.message,
					filename: e.filename,
					lineno: e.lineno,
					colno: e.colno
				};
				document.currentScript.dataset.sapUiModuleError = JSON.stringify(error);
			}
		});
		*/

		/**
		 * Loads the given Javascript resource (URN) asynchronously via as script tag.
		 * Returns a promise that will be resolved when the load event is fired or reject
		 * when the error event is fired.
		 *
		 * Note: execution errors of the script are not reported as 'error'.
		 *
		 * This method is not a full implementation of require. It is intended only for
		 * loading "preload" files that do not define an own module / module value.
		 *
		 * Functionality might be removed/renamed in future, so no code outside the
		 * sap.ui.core library must use it.
		 *
		 * @experimental
		 * @private
		 */
		jQuery.sap._loadJSResourceAsync = function(sResource, bIgnoreErrors) {

			return new Promise(function(resolve,reject) {

				var oModule = mModules[sResource] || (mModules[sResource] = { state : INITIAL });
				var sUrl = oModule.url = getResourcePath(sResource);
				oModule.state = LOADING;

				var oScript = window.document.createElement('SCRIPT');
				oScript.src = sUrl;
				oScript.setAttribute("data-sap-ui-module", sResource); // IE9/10 don't support dataset :-(
				// oScript.setAttribute("data-sap-ui-module-error", '');
				oScript.addEventListener('load', function(e) {
					jQuery.sap.log.info("Javascript resource loaded: " + sResource);
// TODO either find a cross-browser solution to detect and assign execution errros or document behavior
//					var error = e.target.dataset.sapUiModuleError;
//					if ( error ) {
//						oModule.state = FAILED;
//						oModule.error = JSON.parse(error);
//						jQuery.sap.log.error("failed to load Javascript resource: " + sResource + ":" + error);
//						reject(oModule.error);
//					}
					oModule.state = READY;
					// TODO oModule.data = ?
					resolve();
				});
				oScript.addEventListener('error', function(e) {
					jQuery.sap.log.error("failed to load Javascript resource: " + sResource);
					oModule.state = FAILED;
					// TODO oModule.error = xhr ? xhr.status + " - " + xhr.statusText : textStatus;
					if ( bIgnoreErrors ) {
						resolve();
					} else {
						reject();
					}
				});
				appendHead(oScript);
			});

		};

		return function() {

			//remove final information in mUrlPrefixes
			var mFlatUrlPrefixes = {};
				jQuery.each(mUrlPrefixes, function(sKey,oUrlPrefix) {
				mFlatUrlPrefixes[sKey] = oUrlPrefix.url;
			});


			return { modules : mModules, prefixes : mFlatUrlPrefixes };
		};

	}());

	// --------------------- script and stylesheet handling --------------------------------------------------

	// appends a link object to the head
	function appendHead(oElement) {
		var head = window.document.getElementsByTagName("head")[0];
		if (head) {
			head.appendChild(oElement);
		}
	}

	/**
	 * Includes the script (via &lt;script&gt;-tag) into the head for the
	 * specified <code>sUrl</code> and optional <code>sId</code>.
	 * <br>
	 * <i>In case of IE8 only the load callback will work ignoring in case of success and error.</i>
	 *
	 * @param {string}
	 *            sUrl the URL of the script to load
	 * @param {string}
	 *            [sId] id that should be used for the script include tag
	 * @param {function}
	 *            [fnLoadCallback] callback function to get notified once the script has been loaded
	 * @param {function}
	 *            [fnErrorCallback] callback function to get notified once the script loading failed (not supported by IE8)
	 *
	 * @public
	 * @static
	 * @SecSink {0|PATH} Parameter is used for future HTTP requests
	 */
	jQuery.sap.includeScript = function includeScript(sUrl, sId, fnLoadCallback, fnErrorCallback){
		var oScript = window.document.createElement("script");
		oScript.src = sUrl;
		oScript.type = "text/javascript";
		if (sId) {
			oScript.id = sId;
		}
		if (!!sap.ui.Device.browser.internet_explorer && sap.ui.Device.browser.version < 9) {
			// in case if IE8 the error callback is not supported!
			// we can only check the loading via the readystatechange event
			if (fnLoadCallback) {
				oScript.onreadystatechange = function() {
					if (oScript.readyState === "loaded" || oScript.readyState === "complete") {
						fnLoadCallback();
						oScript.onreadystatechange = null;
					}
				};
			}
		} else {
			if (fnLoadCallback) {
				jQuery(oScript).load(fnLoadCallback);
			}
			if (fnErrorCallback) {
				jQuery(oScript).error(fnErrorCallback);
			}
		}
		// jQuery("head").append(oScript) doesn't work because they filter for the script
		// and execute them directly instead adding the SCRIPT tag to the head
		var oOld;
		if ((sId && (oOld = jQuery.sap.domById(sId)) && oOld.tagName === "SCRIPT")) {
			jQuery(oOld).remove(); // replacing scripts will not trigger the load event
		}
		appendHead(oScript);
	};

	var oIEStyleSheetNode;
	var mIEStyleSheets = jQuery.sap._mIEStyleSheets = {};

	/**
	 * Includes the specified stylesheet via a &lt;link&gt;-tag in the head of the current document. If there is call to
	 * <code>includeStylesheet</code> providing the sId of an already included stylesheet, the existing element will be
	 * replaced.
	 *
	 * @param {string}
	 *          sUrl the URL of the script to load
	 * @param {string}
	 *          [sId] id that should be used for the script include tag
	 * @param {function}
	 *          [fnLoadCallback] callback function to get notified once the link has been loaded
	 * @param {function}
	 *          [fnErrorCallback] callback function to get notified once the link loading failed.
	 *          In case of usage in IE the error callback will also be executed if an empty stylesheet
	 *          is loaded. This is the only option how to determine in IE if the load was successful
	 *          or not since the native onerror callback for link elements doesn't work in IE. The IE
	 *          always calls the onload callback of the link element.
	 *
	 * @public
	 * @static
	 * @SecSink {0|PATH} Parameter is used for future HTTP requests
	 */
	jQuery.sap.includeStyleSheet = function includeStyleSheet(sUrl, sId, fnLoadCallback, fnErrorCallback) {

		var _createLink = function(sUrl, sId, fnLoadCallback, fnErrorCallback){

			// create the new link element
			var oLink = document.createElement("link");
			oLink.type = "text/css";
			oLink.rel = "stylesheet";
			oLink.href = sUrl;
			if (sId) {
				oLink.id = sId;
			}

			var fnError = function() {
				jQuery(oLink).attr("data-sap-ui-ready", "false");
				if (fnErrorCallback) {
					fnErrorCallback();
				}
			};

			var fnLoad = function() {
				jQuery(oLink).attr("data-sap-ui-ready", "true");
				if (fnLoadCallback) {
					fnLoadCallback();
				}
			};

			// for IE we will check if the stylesheet contains any rule and then
			// either trigger the load callback or the error callback
			if (!!sap.ui.Device.browser.internet_explorer) {
				var fnLoadOrg = fnLoad;
				fnLoad = function(oEvent) {
					var aRules;
					try {
						// in cross-origin scenarios the IE can still access the rules of the stylesheet
						// if the stylesheet has been loaded properly
						aRules = oEvent.target && oEvent.target.sheet && oEvent.target.sheet.rules;
						// in cross-origin scenarios now the catch block will be executed because we
						// cannot access the rules of the stylesheet but for non cross-origin stylesheets
						// we will get an empty rules array and finally we cannot differ between
						// empty stylesheet or loading issue correctly => documented in JSDoc!
					} catch (ex) {
						// exception happens when the stylesheet could not be loaded from the server
						// we now ignore this and know that the stylesheet doesn't exists => trigger error
					}
					// no rules means error
					if (aRules && aRules.length > 0) {
						fnLoadOrg();
					} else {
						fnError();
					}
				};
			}

			jQuery(oLink).load(fnLoad);
			jQuery(oLink).error(fnError);
			return oLink;

		};

		var _appendStyle = function(sUrl, sId, fnLoadCallback, fnErrorCallback){

			if (sap.ui.Device.browser.internet_explorer && sap.ui.Device.browser.version <= 9 && document.styleSheets.length >= 28) {
				// in IE9 only 30 links are alowed, so use stylesheet object insted
				var sRootUrl = URI.parse(document.URL).path;
				var sAbsoluteUrl = new URI(sUrl).absoluteTo(sRootUrl).toString();

				if (sId) {
					var oIEStyleSheet = mIEStyleSheets[sId];
					if (oIEStyleSheet && oIEStyleSheet.href === sAbsoluteUrl) {
						// if stylesheet was already included and href is the same, do nothing
						return;
					}
				}

				jQuery.sap.log.warning("Stylesheet " + (sId ? sId + " " : "") + "not added as LINK because of IE limits", sUrl, "jQuery.sap.includeStyleSheet");

				if (!oIEStyleSheetNode) {
					// create a style sheet to add additional style sheet. But for this the Replace logic will not work any more
					// the callback functions are not used in this case
					// the data-sap-ui-ready attribute will not be set -> maybe problems with ThemeCheck
					oIEStyleSheetNode = document.createStyleSheet();
				}
				// add up to 30 style sheets to every of this style sheets. (result is a tree of style sheets)
				var bAdded = false;
				for ( var i = 0; i < oIEStyleSheetNode.imports.length; i++) {
					var oStyleSheet = oIEStyleSheetNode.imports[i];
					if (oStyleSheet.imports.length < 30) {
						oStyleSheet.addImport(sAbsoluteUrl);
						bAdded = true;
						break;
					}
				}
				if (!bAdded) {
					oIEStyleSheetNode.addImport(sAbsoluteUrl);
				}

				if (sId) {
					// remember id and href URL in internal map as there is no link tag that can be checked
					mIEStyleSheets[sId] = {
						href: sAbsoluteUrl
					};
				}

				// always make sure to re-append the customcss in the end if it exists
				var oCustomCss = document.getElementById('sap-ui-core-customcss');
				if (!jQuery.isEmptyObject(oCustomCss)) {
					appendHead(oCustomCss);
				}
			} else {
				var oLink = _createLink(sUrl, sId, fnLoadCallback, fnErrorCallback);
				if (jQuery('#sap-ui-core-customcss').length > 0) {
					jQuery('#sap-ui-core-customcss').first().before(jQuery(oLink));
				} else {
					appendHead(oLink);
				}
			}

		};

		// check for existence of the link
		var oOld = jQuery.sap.domById(sId);
		if (oOld && oOld.tagName === "LINK" && oOld.rel === "stylesheet") {
			// link exists, so we replace it - but only if a callback has to be attached or if the href will change. Otherwise don't touch it
			if (fnLoadCallback || fnErrorCallback || oOld.href !== URI(String(sUrl), URI().search("") /* returns current URL without search params */ ).toString()) {
				jQuery(oOld).replaceWith(_createLink(sUrl, sId, fnLoadCallback, fnErrorCallback));
			}
		} else {
			_appendStyle(sUrl, sId, fnLoadCallback, fnErrorCallback);
		}

	};

	// TODO should be in core, but then the 'callback' could not be implemented
	if ( !(oCfgData.productive === true || oCfgData.productive === "true"  || oCfgData.productive === "x") ) {
		jQuery(function() {
			jQuery(document.body).keydown(function(e) {
				if ( e.keyCode == 80 && e.shiftKey && e.altKey && e.ctrlKey ) {
					try {
						jQuery.sap.require("sap.ui.debug.TechnicalInfo");
					} catch (err1) {
						// alert("Sorry, failed to activate 'P'-mode!");
						return;
					}
					sap.ui.debug.TechnicalInfo.open(function() {
						var oInfo = getModuleSystemInfo();
						return { modules : oInfo.modules, prefixes : oInfo.prefixes, config: oCfgData };
					});
				}
			});
		});

		jQuery(function() {
			jQuery(document.body).keydown(function(e) {
				if ( e.keyCode == 83 /*S*/ && e.shiftKey && e.altKey && e.ctrlKey ) { //TODO: Is this ok?
					try {
						jQuery.sap.require("sap.ui.core.support.Support");
						var oSupport = sap.ui.core.support.Support.getStub();
						if (oSupport.getType() != sap.ui.core.support.Support.StubType.APPLICATION) {
							return;
						}
						oSupport.openSupportTool();
					} catch (err2) {
						// ignore error
					}
				}
			});
		});
	}

	// *********** feature detection, enriching jQuery.support *************
	// this might go into its own file once there is more stuff added

	/**
	 * Holds information about the browser's capabilities and quirks.
	 * This object is provided and documented by jQuery.
	 * But it is extended by SAPUI5 with detection for features not covered by jQuery. This documentation ONLY covers the detection properties added by UI5.
	 * For the standard detection properties, please refer to the jQuery documentation.
	 *
	 * These properties added by UI5 are only available temporarily until jQuery adds feature detection on their own.
	 *
	 * @name jQuery.support
	 * @namespace
	 * @since 1.12
	 * @public
	 */

	if (!jQuery.support) {
		jQuery.support = {};
	}

	jQuery.extend(jQuery.support, {touch: sap.ui.Device.support.touch}); // this is also defined by jquery-mobile-custom.js, but this information is needed earlier

	var aPrefixes = ["Webkit", "ms", "Moz"];
	var oStyle = document.documentElement.style;

	var preserveOrTestCssPropWithPrefixes = function(detectionName, propName) {
		if (jQuery.support[detectionName] === undefined) {

			if (oStyle[propName] !== undefined) { // without vendor prefix
				jQuery.support[detectionName] = true;
				// If one of the flex layout properties is supported without the prefix, set the flexBoxPrefixed to false
				if (propName === "boxFlex" || propName === "flexOrder" || propName === "flexGrow") {
					// Exception for Chrome up to version 28
					// because some versions implemented the non-prefixed properties without the functionality
					if (!sap.ui.Device.browser.chrome || sap.ui.Device.browser.version > 28) {
						jQuery.support.flexBoxPrefixed = false;
					}
				}
				return;

			} else { // try vendor prefixes
				propName = propName.charAt(0).toUpperCase() + propName.slice(1);
				for (var i in aPrefixes) {
					if (oStyle[aPrefixes[i] + propName] !== undefined) {
						jQuery.support[detectionName] = true;
						return;
					}
				}
			}
			jQuery.support[detectionName] = false;
		}
	};

	/**
	 * Whether the current browser supports (2D) CSS transforms
	 * @type {boolean}
	 * @public
	 * @name jQuery.support.cssTransforms
	 */
	preserveOrTestCssPropWithPrefixes("cssTransforms", "transform");

	/**
	 * Whether the current browser supports 3D CSS transforms
	 * @type {boolean}
	 * @public
	 * @name jQuery.support.cssTransforms3d
	 */
	preserveOrTestCssPropWithPrefixes("cssTransforms3d", "perspective");

	/**
	 * Whether the current browser supports CSS transitions
	 * @type {boolean}
	 * @public
	 * @name jQuery.support.cssTransitions
	 */
	preserveOrTestCssPropWithPrefixes("cssTransitions", "transition");

	/**
	 * Whether the current browser supports (named) CSS animations
	 * @type {boolean}
	 * @public
	 * @name jQuery.support.cssAnimations
	 */
	preserveOrTestCssPropWithPrefixes("cssAnimations", "animationName");

	/**
	 * Whether the current browser supports CSS gradients. Note that ANY support for CSS gradients leads to "true" here, no matter what the syntax is.
	 * @type {boolean}
	 * @public
	 * @name jQuery.support.cssGradients
	 */
	if (jQuery.support.cssGradients === undefined) {
		var oElem = document.createElement('div'),
		oStyle = oElem.style;
		try {
			oStyle.backgroundImage = "linear-gradient(left top, red, white)";
			oStyle.backgroundImage = "-moz-linear-gradient(left top, red, white)";
			oStyle.backgroundImage = "-webkit-linear-gradient(left top, red, white)";
			oStyle.backgroundImage = "-ms-linear-gradient(left top, red, white)";
			oStyle.backgroundImage = "-webkit-gradient(linear, left top, right bottom, from(red), to(white))";
		} catch (e) {/* no support...*/}
		jQuery.support.cssGradients = (oStyle.backgroundImage && oStyle.backgroundImage.indexOf("gradient") > -1);

		oElem = null; // free for garbage collection
	}

	/**
	 * Whether the current browser supports only prefixed flexible layout properties
	 * @type {boolean}
	 * @public
	 * @name jQuery.support.flexBoxPrefixed
	 */
	jQuery.support.flexBoxPrefixed = true;	// Default to prefixed properties

	/**
	 * Whether the current browser supports the OLD CSS3 Flexible Box Layout directly or via vendor prefixes
	 * @type {boolean}
	 * @public
	 * @name jQuery.support.flexBoxLayout
	 */
	preserveOrTestCssPropWithPrefixes("flexBoxLayout", "boxFlex");

	/**
	 * Whether the current browser supports the NEW CSS3 Flexible Box Layout directly or via vendor prefixes
	 * @type {boolean}
	 * @public
	 * @name jQuery.support.newFlexBoxLayout
	 */
	preserveOrTestCssPropWithPrefixes("newFlexBoxLayout", "flexGrow");	// Use a new property that IE10 doesn't support

	/**
	 * Whether the current browser supports the IE10 CSS3 Flexible Box Layout directly or via vendor prefixes
	 * @type {boolean}
	 * @public
	 * @name jQuery.support.ie10FlexBoxLayout
	 * @since 1.12.0
	 */
	// Just using one of the IE10 properties that's not in the new FlexBox spec
	if (!jQuery.support.newFlexBoxLayout && oStyle.msFlexOrder !== undefined) {
		jQuery.support.ie10FlexBoxLayout = true;
	} else {
		jQuery.support.ie10FlexBoxLayout = false;
	}

	/**
	 * Whether the current browser supports any kind of Flexible Box Layout directly or via vendor prefixes
	 * @type {boolean}
	 * @public
	 * @name jQuery.support.hasFlexBoxSupport
	 */
	if (jQuery.support.flexBoxLayout || jQuery.support.newFlexBoxLayout || jQuery.support.ie10FlexBoxLayout) {
		jQuery.support.hasFlexBoxSupport = true;
	} else {
		jQuery.support.hasFlexBoxSupport = false;
	}


	/**
	 * FrameOptions class
	 */
	var FrameOptions = function(mSettings) {
		/* mSettings: mode, callback, whitelist, whitelistService, timeout, blockEvents, showBlockLayer, allowSameOrigin */
		this.mSettings = mSettings || {};
		this.sMode = this.mSettings.mode || FrameOptions.Mode.ALLOW;
		this.fnCallback = this.mSettings.callback;
		this.iTimeout = this.mSettings.timeout || 10000;
		this.bBlockEvents = this.mSettings.blockEvents !== false;
		this.bShowBlockLayer = this.mSettings.showBlockLayer !== false;
		this.bAllowSameOrigin = this.mSettings.allowSameOrigin !== false;
		this.sParentOrigin = '';
		this.bUnlocked = false;
		this.bRunnable = false;
		this.bParentUnlocked = false;
		this.bParentResponded = false;
		this.sStatus = "pending";
		this.aFPChilds = [];

		var that = this;

		this.iTimer = setTimeout(function() {
			that._callback(false);
		}, this.iTimeout);

		var fnHandlePostMessage = function() {
			that._handlePostMessage.apply(that, arguments);
		};

		FrameOptions.__window.addEventListener('message', fnHandlePostMessage);

		if (FrameOptions.__parent === FrameOptions.__self || FrameOptions.__parent == null || this.sMode === FrameOptions.Mode.ALLOW) {
			// unframed page or "allow all" mode
			this._applyState(true, true);
		} else {
			// framed page

			this._lock();

			// "deny" mode blocks embedding page from all origins
			if (this.sMode === FrameOptions.Mode.DENY) {
				this._callback(false);
				return;
			}

			if (this.bAllowSameOrigin) {

				try {
					var oParentWindow = FrameOptions.__parent;
					var bOk = false;
					var bTrue = true;
					do {
						var test = oParentWindow.document.domain;
						if (oParentWindow == FrameOptions.__top) {
							if (test != undefined) {
								bOk = true;
							}
							break;
						}
						oParentWindow = oParentWindow.parent;
					} while (bTrue);
					if (bOk) {
						this._applyState(true, true);
					}
				} catch (e) {
					// access to the top window is not possible
					this._sendRequireMessage();
				}

			} else {
				// same origin not allowed
				this._sendRequireMessage();
			}

		}

	};

	FrameOptions.Mode = {
		// only allow with same origin parent
		TRUSTED: 'trusted',

		// allow all kind of embedding (default)
		ALLOW: 'allow',

		// deny all kinds of embedding
		DENY: 'deny'
	};

	// Allow globals to be mocked in unit test
	FrameOptions.__window = window;
	FrameOptions.__parent = parent;
	FrameOptions.__self = self;
	FrameOptions.__top = top;

	// List of events to block while framing is unconfirmed
	FrameOptions._events = [
		"mousedown", "mouseup", "click", "dblclick", "mouseover", "mouseout",
		"touchstart", "touchend", "touchmove", "touchcancel",
		"keydown", "keypress", "keyup"
	];

	// check if string matches pattern
	FrameOptions.prototype.match = function(sProbe, sPattern) {
		if (!(/\*/i.test(sPattern))) {
			return sProbe == sPattern;
		} else {
			sPattern = sPattern.replace(/\//gi, "\\/"); // replace /   with \/
			sPattern = sPattern.replace(/\./gi, "\\."); // replace .   with \.
			sPattern = sPattern.replace(/\*/gi, ".*");  // replace *   with .*
			sPattern = sPattern.replace(/:\.\*$/gi, ":\\d*"); // replace :.* with :\d* (only at the end)

			if (sPattern.substr(sPattern.length - 1, 1) !== '$') {
				sPattern = sPattern + '$'; // if not already there add $ at the end
			}
			if (sPattern.substr(0, 1) !== '^') {
				sPattern = '^' + sPattern; // if not already there add ^ at the beginning
			}

			// sPattern looks like: ^.*:\/\/.*\.company\.corp:\d*$ or ^.*\.company\.corp$
			var r = new RegExp(sPattern, 'i');
			return r.test(sProbe);
		}
	};

	FrameOptions._lockHandler = function(oEvent) {
		oEvent.stopPropagation();
		oEvent.preventDefault();
	};

	FrameOptions.prototype._createBlockLayer = function() {
		if (document.readyState == "complete") {
			var lockDiv = document.createElement("div");
			lockDiv.style.position = "absolute";
			lockDiv.style.top = "0px";
			lockDiv.style.bottom = "0px";
			lockDiv.style.left = "0px";
			lockDiv.style.right = "0px";
			lockDiv.style.opacity = "0";
			lockDiv.style.backgroundColor = "white";
			lockDiv.style.zIndex = 2147483647; // Max value of signed integer (32bit)
			document.body.appendChild(lockDiv);
			this._lockDiv = lockDiv;
		}
	};

	FrameOptions.prototype._setCursor = function() {
		if (this._lockDiv) {
			this._lockDiv.style.cursor = this.sStatus == "denied" ? "not-allowed" : "wait";
		}
	};

	FrameOptions.prototype._lock = function() {
		var that = this;
		if (this.bBlockEvents) {
			for (var i = 0; i < FrameOptions._events.length; i++) {
				document.addEventListener(FrameOptions._events[i], FrameOptions._lockHandler, true);
			}
		}
		if (this.bShowBlockLayer) {
			this._blockLayer = function() {
				that._createBlockLayer();
				that._setCursor();
			};
			if (document.readyState == "complete") {
				this._blockLayer();
			} else {
				document.addEventListener("readystatechange", this._blockLayer);
			}
		}
	};

	FrameOptions.prototype._unlock = function() {
		if (this.bBlockEvents) {
			for (var i = 0; i < FrameOptions._events.length; i++) {
				document.removeEventListener(FrameOptions._events[i], FrameOptions._lockHandler, true);
			}
		}
		if (this.bShowBlockLayer) {
			document.removeEventListener("readystatechange", this._blockLayer);
			if (this._lockDiv) {
				document.body.removeChild(this._lockDiv);
				delete this._lockDiv;
			}
		}
	};

	FrameOptions.prototype._callback = function(bSuccess) {
		this.sStatus = bSuccess ? "allowed" : "denied";
		this._setCursor();
		clearTimeout(this.iTimer);
		if (typeof this.fnCallback === 'function') {
			this.fnCallback.call(null, bSuccess);
		}
	};

	FrameOptions.prototype._applyState = function(bIsRunnable, bIsParentUnlocked) {
		if (this.bUnlocked) {
			return;
		}
		if (bIsRunnable) {
			this.bRunnable = true;
		}
		if (bIsParentUnlocked) {
			this.bParentUnlocked = true;
		}
		if (!this.bRunnable || !this.bParentUnlocked) {
			return;
		}
		this._unlock();
		this._callback(true);
		this._notifyChildFrames();
		this.bUnlocked = true;
	};

	FrameOptions.prototype._applyTrusted = function(bTrusted) {
		if (bTrusted) {
			this._applyState(true, false);
		} else {
			this._callback(false);
		}
	};

	FrameOptions.prototype._check = function(bParentResponsePending) {
		if (this.bRunnable) {
			return;
		}
		var bTrusted = false;
		if (this.bAllowSameOrigin && this.sParentOrigin && FrameOptions.__window.document.URL.indexOf(this.sParentOrigin) == 0) {
			bTrusted = true;
		} else if (this.mSettings.whitelist && this.mSettings.whitelist.length != 0) {
			var sHostName = this.sParentOrigin.split('//')[1];
			sHostName = sHostName.split(':')[0];
			for (var i = 0; i < this.mSettings.whitelist.length; i++) {
				var match = sHostName.indexOf(this.mSettings.whitelist[i]);
				if (match != -1 && sHostName.substring(match) == this.mSettings.whitelist[i]) {
					bTrusted = true;
					break;
				}
			}
		}
		if (bTrusted) {
			this._applyTrusted(bTrusted);
		} else if (this.mSettings.whitelistService) {
			var that = this;
			var xmlhttp = new XMLHttpRequest();
			var url = this.mSettings.whitelistService + '?parentOrigin=' + encodeURIComponent(this.sParentOrigin);
			xmlhttp.onreadystatechange = function() {
				if (xmlhttp.readyState == 4) {
					that._handleXmlHttpResponse(xmlhttp, bParentResponsePending);
				}
			};
			xmlhttp.open('GET', url, true);
			xmlhttp.setRequestHeader('Accept', 'application/json');
			xmlhttp.send();
		} else {
			this._callback(false);
		}
	};

	FrameOptions.prototype._handleXmlHttpResponse = function(xmlhttp, bParentResponsePending) {
		if (xmlhttp.status === 200) {
			var bTrusted = false;
			var sResponseText = xmlhttp.responseText;
			var oRuleSet = JSON.parse(sResponseText);
			if (oRuleSet.active == false) {
				this._applyState(true, true);
			} else if (bParentResponsePending) {
				return;
			} else {
				if (this.match(this.sParentOrigin, oRuleSet.origin)) {
					bTrusted = oRuleSet.framing;
				}
				this._applyTrusted(bTrusted);
			}
		} else {
			jQuery.sap.log.warning("The configured whitelist service is not available: " + xmlhttp.status);
			this._callback(false);
		}
	};

	FrameOptions.prototype._notifyChildFrames = function() {
		for (var i = 0; i < this.aFPChilds.length; i++) {
			this.aFPChilds[i].postMessage('SAPFrameProtection*parent-unlocked','*');
		}
	};

	FrameOptions.prototype._sendRequireMessage = function() {
		FrameOptions.__parent.postMessage('SAPFrameProtection*require-origin', '*');
		// If not postmessage response was received, send request to whitelist service
		// anyway, to check whether frame protection is enabled
		if (this.mSettings.whitelistService) {
			setTimeout(function() {
				if (!this.bParentResponded) {
					this._check(true);
				}
			}.bind(this), 10);
		}
	};

	FrameOptions.prototype._handlePostMessage = function(oEvent) {
		var oSource = oEvent.source,
			sData = oEvent.data;

		// For compatibility with previous version empty message from parent means parent-unlocked
		// if (oSource === FrameOptions.__parent && sData == "") {
		//	sData = "SAPFrameProtection*parent-unlocked";
		// }

		if (oSource === FrameOptions.__self || oSource == null ||
			typeof sData !== "string" || sData.indexOf("SAPFrameProtection*") === -1) {
			return;
		}
		if (oSource === FrameOptions.__parent) {
			this.bParentResponded = true;
			if (!this.sParentOrigin) {
				this.sParentOrigin = oEvent.origin;
				this._check();
			}
			if (sData == "SAPFrameProtection*parent-unlocked") {
				this._applyState(false, true);
			}
		} else if (oSource.parent === FrameOptions.__self && sData == "SAPFrameProtection*require-origin" && this.bUnlocked) {
			oSource.postMessage("SAPFrameProtection*parent-unlocked", "*");
		} else {
			oSource.postMessage("SAPFrameProtection*parent-origin", "*");
			this.aFPChilds.push(oSource);
		}
	};

	jQuery.sap.FrameOptions = FrameOptions;

}());

/**
 * Executes an 'eval' for its arguments in the global context (without closure variables).
 *
 * This is a synchronous replacement for <code>jQuery.globalEval</code> which in some
 * browsers (e.g. FireFox) behaves asynchronously.
 *
 * @type void
 * @public
 * @static
 * @SecSink {0|XSS} Parameter is evaluated
 */
jQuery.sap.globalEval = function() {
	/*eslint-disable no-eval */
	eval(arguments[0]);
	/*eslint-enable no-eval */
};
jQuery.sap.declare('jquery-sap');
jQuery.sap.declare('sap.ui.thirdparty.es6-promise', false);
jQuery.sap.declare('sap.ui.Device', false);
jQuery.sap.declare('sap.ui.thirdparty.URI', false);
jQuery.sap.declare('jquery.sap.global', false);
/*!
 * UI development toolkit for HTML5 (OpenUI5)
 * (c) Copyright 2009-2015 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */

// Provides functionality related to DOM analysis and manipulation which is not provided by jQuery itself.
sap.ui.predefine('jquery.sap.dom',['jquery.sap.global', 'sap/ui/Device'],
	function(jQuery, Device) {
	"use strict";

	/**
	 * Shortcut for document.getElementById() with additionally an IE6/7 bug fixed.
	 * Used to replace the jQuery.sap.domById when running in IE < v8.
	 *
	 * @param {string} sId the id of the DOM element to return
	 * @param {Window} oWindow the window (optional)
	 * @return {Element} the DOMNode identified by the given sId
	 * @private
	 */
	var domByIdInternal = function(sId, oWindow) {

		if (!oWindow) {
			oWindow = window;
		}
		if (!sId || sId == "") {
			return null;
		}

		var oDomRef = oWindow.document.getElementById(sId);

		// IE also returns the element with the name or id whatever is first
		// => the following line makes sure that this was the id
		if (oDomRef && oDomRef.id == sId) {
			return oDomRef;
		}

		// otherwise try to lookup the name
		var oRefs = oWindow.document.getElementsByName(sId);
		for (var i = 0;i < oRefs.length;i++) {
			oDomRef = oRefs[i];
			if (oDomRef && oDomRef.id == sId) {
				return oDomRef;
			}
		}

		return null;

	};

	/**
	 * Shortcut for document.getElementById(), including a bug fix for older IE versions.
	 *
	 * @param {string} sId The id of the DOM element to return
	 * @param {Window} [oWindow=window] The window (optional)
	 * @return {Element} The DOMNode identified by the given sId
	 * @public
	 * @function
	 * @since 0.9.0
	 */
	jQuery.sap.domById = !!Device.browser.internet_explorer && Device.browser.version < 8 ? domByIdInternal : function domById(sId, oWindow) {
		return sId ? (oWindow || window).document.getElementById(sId) : null;
	};


	/**
	 * Shortcut for jQuery("#" + id) with additionally the id being escaped properly.
	 * I.e.: returns the jQuery object for the DOM element with the given id
	 *
	 * Use this method instead of jQuery(...) if you know the argument is exactly one id and
	 * the id is not known in advance because it is in a variable (as opposed to a string
	 * constant with known content).
	 *
	 * @param {string} sId The id to search for and construct the jQuery object
	 * @param {Element} oContext the context DOM Element
	 * @return {Object} The jQuery object for the DOM element identified by the given sId
	 * @public
	 * @since 0.9.1
	 */
	jQuery.sap.byId = function byId(sId, oContext) {
		var escapedId = "";
		if (sId) {
			escapedId = "#" + sId.replace(/(:|\.)/g,'\\$1');
		}
		return jQuery(escapedId, oContext);
	};


	/**
	 * Calls focus() on the given DOM element, but catches and ignores any errors that occur when doing so.
	 * (i.e. IE8 throws an error when the DOM element is invisible or disabled)
	 *
	 * @param {Element} oDomRef The DOM element to focus (or null - in this case the method does nothing)
	 * @return {boolean} Whether the focus() command was executed without an error
	 * @public
	 * @since 1.1.2
	 */
	jQuery.sap.focus = function focus(oDomRef) {
		if (!oDomRef) {
			return;
		}
		try {
			oDomRef.focus();
		} catch (e) {
			var id = (oDomRef && oDomRef.id) ? " (ID: '" + oDomRef.id + "')" : "";
			jQuery.sap.log.warning("Error when trying to focus a DOM element" + id + ": " + e.message);
			return false;
		}
		return true;
	};


	/**
	 * Sets or gets the position of the cursor in an element that supports cursor positioning
	 *
	 * @param {int} iPos The cursor position to set (or no parameter to retrieve the cursor position)
	 * @return {int | jQuery} The cursor position (or the jQuery collection if the position has been set)
	 * @public
	 * @name jQuery#cursorPos
	 * @author SAP SE
	 * @since 0.9.0
	 * @function
	 */
	jQuery.fn.cursorPos = function cursorPos(iPos) {
		var len = arguments.length,
			oTextRange,iLength,
			sTagName,
			sType;

		sTagName = this.prop("tagName");
		sType = this.prop("type");

		if ( this.length === 1 && ((sTagName == "INPUT" && (sType == "text" || sType == "password" || sType == "search"))
				|| sTagName == "TEXTAREA" )) {

			var oDomRef = this.get(0);

			if (len > 0) { // SET

				if (typeof (oDomRef.selectionStart) == "number") { // FF and IE9+ method
					oDomRef.focus();
					oDomRef.selectionStart = iPos;
					oDomRef.selectionEnd = iPos;
				} else if (oDomRef.createTextRange) { // IE method
					oTextRange = oDomRef.createTextRange();
					var iMaxLength = oDomRef.value.length;

					if (iPos < 0 || iPos > iMaxLength) {
						iPos = iMaxLength;
					}
					if (oTextRange) {
						oTextRange.collapse();
						oTextRange.moveEnd("character",iPos);
						oTextRange.moveStart("character",iPos);
						oTextRange.select();
					}
				}

				return this;
				// end of SET

			} else { // GET
				if (typeof (oDomRef.selectionStart) == "number") { // Firefox etc.
					return oDomRef.selectionStart;
				} else if (oDomRef.createTextRange) { // IE 8
					oTextRange = window.document.selection.createRange();
					var oCopiedTextRange = oTextRange.duplicate();
					// Logic in TEXTAREA and INPUT is different in IE -> check for element type
					if (oDomRef.tagName == "TEXTAREA") {
						oCopiedTextRange.moveToElementText(oDomRef);
						var oCheckTextRange = oCopiedTextRange.duplicate();
						iLength = oCopiedTextRange.text.length;

						// first check if cursor on last position
						oCheckTextRange.moveStart("character", iLength);
						var iStart = 0;
						if (oCheckTextRange.inRange(oTextRange)) {
							iStart = iLength;
						} else {
							// find out cursor position using a bisection algorithm
							var iCheckLength = iLength;
							while (iLength > 1) {
								iCheckLength = Math.round(iLength / 2);
								iStart = iStart + iCheckLength;

								oCheckTextRange = oCopiedTextRange.duplicate();
								oCheckTextRange.moveStart("character", iStart);
								if (oCheckTextRange.inRange(oTextRange)) {
									//cursor is after or on iStart -> Length = not checked Length
									iLength = iLength - iCheckLength;

								} else {
									//cursor is before iStart  -> Length = checked Length
									iStart = iStart - iCheckLength;
									iLength = iCheckLength;
								}
							}
						}
						return iStart;
					} else if (oCopiedTextRange.parentElement() === oDomRef) {
						// ensure there is only the cursor and not the range (as this would create erroneous position)!
						oCopiedTextRange.collapse();
						// now, move the selection range to the beginning of the inputField and simply get the selected range's length
						var iLength = oDomRef.value.length;
						oCopiedTextRange.moveStart('character', -iLength);
						return oCopiedTextRange.text.length;
					}
				}

				return -1;
			} // end of GET
		} else {
			// shouldn't really happen, but to be safe...
			return this;
		}
	};

	/**
	 * Sets the text selection in the first element of the collection.
	 * note: This feature is only supported for input element’s type of text, search, url, tel and password.
	 *
	 * @param {int} iStart Start position of the selection (inclusive)
	 * @param {int} iEnd End position of the selection (exclusive)
	 * @return {jQuery} The jQuery collection
	 * @public
	 * @name jQuery#selectText
	 * @author SAP SE
	 * @since 0.9.0
	 * @function
	 */
	jQuery.fn.selectText = function selectText(iStart, iEnd) {
		var oDomRef = this.get(0);

		try {
			if (typeof (oDomRef.selectionStart) === "number") { // Firefox and IE9+

				oDomRef.setSelectionRange(iStart, iEnd);
			} else if (oDomRef.createTextRange) { // IE
				var oTextEditRange = oDomRef.createTextRange();
				oTextEditRange.collapse();
				oTextEditRange.moveStart('character', iStart);
				oTextEditRange.moveEnd('character', iEnd - iStart);
				oTextEditRange.select();
			}
		} catch (e) {
			// note: some browsers fail to read the "selectionStart" and "selectionEnd" properties from HTMLInputElement, e.g.: The input element's type "number" does not support selection.
		}

		return this;
	};

	/**
	 * Retrieve the selected text in the first element of the collection.
	 * note: This feature is only supported for input element’s type of text, search, url, tel and password.
	 *
	 * @return {string} The selected text.
	 * @public
	 * @name jQuery#getSelectedText
	 * @author SAP SE
	 * @since 1.26.0
	 * @function
	 */
	jQuery.fn.getSelectedText = function() {
		var oDomRef = this.get(0);

		try {
			if (typeof oDomRef.selectionStart === "number") {
				return oDomRef.value.substring(oDomRef.selectionStart, oDomRef.selectionEnd);
			}

			// older versions of Internet Explorer do not support the HTML5 "selectionStart" and "selectionEnd" properties
			if (document.selection) {
				return document.selection.createRange().text;
			}
		} catch (e) {
			// note: some browsers fail to read the "selectionStart" and "selectionEnd" properties from HTMLInputElement, e.g.: The input element's type "number" does not support selection.
		}

		return "";
	};

	/**
	 * Returns the outer HTML of the given HTML element
	 *
	 * @return {string} outer HTML
	 * @public
	 * @name jQuery#outerHTML
	 * @author SAP SE
	 * @since 0.9.0
	 * @function
	 */
	jQuery.fn.outerHTML = function outerHTML() {
		var oDomRef = this.get(0);

		if (oDomRef && oDomRef.outerHTML) {
			return jQuery.trim(oDomRef.outerHTML);
		} else {
			var doc = this[0] ? this[0].ownerDocument : document;

			var oDummy = doc.createElement("div");
			oDummy.appendChild(oDomRef.cloneNode(true));
			return oDummy.innerHTML;
		}
	};


	/**
	 * Returns whether oDomRefChild is oDomRefContainer or is contained in oDomRefContainer.
	 *
	 * This is a browser-independent version of the .contains method of Internet Explorer.
	 * For compatibility reasons it returns true if oDomRefContainer and oDomRefChild are equal.
	 *
	 * This method intentionally does not operate on the jQuery object, as the original jQuery.contains()
	 * method also does not do so.
	 *
	 * @param {Element} oDomRefContainer The container element
	 * @param {Element} oDomRefChild The child element (must not be a text node, must be an element)
	 * @return {boolean} 'true' if oDomRefChild is contained in oDomRefContainer or oDomRefChild is oDomRefContainer
	 * @public
	 * @author SAP SE
	 * @since 0.9.0
	 */
	jQuery.sap.containsOrEquals = function containsOrEquals(oDomRefContainer, oDomRefChild) {
		if (oDomRefChild && oDomRefContainer && oDomRefChild != document && oDomRefChild != window) {
			return (oDomRefContainer === oDomRefChild) || jQuery.contains(oDomRefContainer, oDomRefChild);
		}
		return false;
	};


	/**
	 * Returns a rectangle describing the current visual positioning of the first DOM object in the collection
	 * (or null if no element was given)
	 *
	 * @return {object} An object with left, top, width and height
	 * @public
	 * @name jQuery#rect
	 * @author SAP SE
	 * @since 0.9.0
	 * @function
	 */
	jQuery.fn.rect = function rect() {
		var oDomRef = this.get(0);

		if (oDomRef) {
			// this should be available in all 'modern browsers'
			if (oDomRef.getBoundingClientRect) {
				var oClientRect = oDomRef.getBoundingClientRect();
				var oRect = { top : oClientRect.top,
						left : oClientRect.left,
						width : oClientRect.right - oClientRect.left,
						height : oClientRect.bottom - oClientRect.top };

				var oWnd = jQuery.sap.ownerWindow(oDomRef);
				oRect.left += jQuery(oWnd).scrollLeft();
				oRect.top += jQuery(oWnd).scrollTop();

				return oRect;
			} else {
				// IE6 and older; avoid crashing and give some hardcoded size
				return { top : 10, left : 10, width : oDomRef.offsetWidth, height : oDomRef.offsetWidth };
			}
		}
		return null;
	};


	/**
	 * Returns whether a point described by X and Y is inside this Rectangle's boundaries
	 *
	 * @param {int} iPosX
	 * @param {int} iPosY
	 * @return {boolean} Whether X and Y are inside this Rectangle's boundaries
	 * @public
	 * @name jQuery#rectContains
	 * @author SAP SE
	 * @since 0.18.0
	 * @function
	 */
	jQuery.fn.rectContains = function rectContains(iPosX, iPosY) {
		jQuery.sap.assert(!isNaN(iPosX), "iPosX must be a number");
		jQuery.sap.assert(!isNaN(iPosY), "iPosY must be a number");

		var oRect = this.rect();

		if (oRect) {

			return iPosX >= oRect.left
				&& iPosX <= oRect.left + oRect.width
				&& iPosY >= oRect.top
				&& iPosY <= oRect.top + oRect.height;

		}
		return false;
	};


	/**
	 * Returns true if the first element has a set tabindex
	 *
	 * @return {boolean} If the first element has a set tabindex
	 * @public
	 * @name jQuery#hasTabIndex
	 * @author SAP SE
	 * @since 0.9.0
	 * @function
	 */
	jQuery.fn.hasTabIndex = function hasTabIndex() {
		var iTabIndex = this.prop("tabIndex");

		if (this.attr("disabled") && !this.attr("tabindex")) {
			// disabled field with not explicit set tabindex -> not in tab chain (bug of jQuery prop function)
			iTabIndex = -1;
		}

		return !isNaN(iTabIndex) && iTabIndex >= 0;
	};


	/**
	 * Returns the first focusable domRef in a given container (the first element of the collection)
	 *
	 * @return {Element} The domRef
	 * @public
	 * @name jQuery#firstFocusableDomRef
	 * @author SAP SE
	 * @since 0.9.0
	 * @function
	 */
	jQuery.fn.firstFocusableDomRef = function firstFocusableDomRef() {
		var oContainerDomRef = this.get(0);
		var visibilityHiddenFilter = function (idx){
			return jQuery(this).css("visibility") == "hidden";
		};
		if (!oContainerDomRef || jQuery(oContainerDomRef).is(':hidden') ||
				jQuery(oContainerDomRef).filter(visibilityHiddenFilter).length == 1) {
			return null;
		}

		var oCurrDomRef = oContainerDomRef.firstChild,
			oDomRefFound = null;

		while (oCurrDomRef) {
			if (oCurrDomRef.nodeType == 1 && jQuery(oCurrDomRef).is(':visible')) {
				if (jQuery(oCurrDomRef).hasTabIndex()) {
					return oCurrDomRef;
				}

				if (oCurrDomRef.childNodes) {
					oDomRefFound = jQuery(oCurrDomRef).firstFocusableDomRef();
					if (oDomRefFound) {
						return oDomRefFound;
					}
				}
			}
			oCurrDomRef = oCurrDomRef.nextSibling;
		}

		return null;
	};


	/**
	 * Returns the last focusable domRef in a given container
	 *
	 * @return {Element} The last domRef
	 * @public
	 * @name jQuery#lastFocusableDomRef
	 * @author SAP SE
	 * @since 0.9.0
	 * @function
	 */
	jQuery.fn.lastFocusableDomRef = function lastFocusableDomRef() {
		var oContainerDomRef = this.get(0);
		var visibilityHiddenFilter = function (idx){
			return jQuery(this).css("visibility") == "hidden";
		};
		if (!oContainerDomRef || jQuery(oContainerDomRef).is(':hidden') ||
				jQuery(oContainerDomRef).filter(visibilityHiddenFilter).length == 1) {
			return null;
		}

		var oCurrDomRef = oContainerDomRef.lastChild,
			oDomRefFound = null;

		while (oCurrDomRef) {
			if (oCurrDomRef.nodeType == 1 && jQuery(oCurrDomRef).is(':visible')) {
				if (oCurrDomRef.childNodes) {
					oDomRefFound = jQuery(oCurrDomRef).lastFocusableDomRef();
					if (oDomRefFound) {
						return oDomRefFound;
					}
				}

				if (jQuery(oCurrDomRef).hasTabIndex()) {
					return oCurrDomRef;
				}
			}
			oCurrDomRef = oCurrDomRef.previousSibling;
		}

		return null;
	};


	/**
	 * Sets or returns the scrollLeft value of the first element in the given jQuery collection in right-to-left mode.
	 * Precondition: The element is rendered in RTL mode.
	 *
	 * Reason for this method is that the major browsers use three different values for the same scroll position when in RTL mode.
	 * This method hides those differences and returns/applies the same value that would be returned in LTR mode: The distance in px
	 * how far the given container is scrolled away from the leftmost scroll position.
	 *
	 * Returns "undefined" if no element and no iPos is given.
	 *
	 * @param {int} iPos
	 * @return {jQuery | int} The jQuery collection if iPos is given, otherwise the scroll position, counted from the leftmost position
	 * @public
	 * @name jQuery#scrollLeftRTL
	 * @author SAP SE
	 * @since 0.20.0
	 * @function
	 */
	jQuery.fn.scrollLeftRTL = function scrollLeftRTL(iPos) {
		var oDomRef = this.get(0);
		if (oDomRef) {

			if (iPos === undefined) { // GETTER code
				if (!!Device.browser.internet_explorer || !!Device.browser.edge) {
					return oDomRef.scrollWidth - oDomRef.scrollLeft - oDomRef.clientWidth;

				} else if (!!Device.browser.webkit) {
					return oDomRef.scrollLeft;

				} else if (!!Device.browser.firefox) {
					return oDomRef.scrollWidth + oDomRef.scrollLeft - oDomRef.clientWidth;

				} else {
					// unrecognized browser; it is hard to return a best guess, as browser strategies are very different, so return the actual value
					return oDomRef.scrollLeft;
				}

			} else { // SETTER code
				oDomRef.scrollLeft = jQuery.sap.denormalizeScrollLeftRTL(iPos, oDomRef);
				return this;
			}
		}
	};

	/**
	 * Returns the MIRRORED scrollLeft value of the first element in the given jQuery collection in right-to-left mode.
	 * Precondition: The element is rendered in RTL mode.
	 *
	 * Reason for this method is that the major browsers return three different values for the same scroll position when in RTL mode.
	 * This method hides those differences and returns the value that would be returned in LTR mode if the UI would be mirrored horizontally:
	 * The distance in px how far the given container is scrolled away from the rightmost scroll position.
	 *
	 * Returns "undefined" if no element is given.
	 *
	 * @return {int} The scroll position, counted from the rightmost position
	 * @public
	 * @name jQuery#scrollRightRTL
	 * @author SAP SE
	 * @since 0.20.0
	 * @function
	 */
	jQuery.fn.scrollRightRTL = function scrollRightRTL() {
		var oDomRef = this.get(0);
		if (oDomRef) {

			if (!!Device.browser.internet_explorer) {
				return oDomRef.scrollLeft;

			} else if (!!Device.browser.webkit) {
				return oDomRef.scrollWidth - oDomRef.scrollLeft - oDomRef.clientWidth;

			} else if (!!Device.browser.firefox) {
				return (-oDomRef.scrollLeft);

			} else {
				// unrecognized browser; it is hard to return a best guess, as browser strategies are very different, so return the actual value
				return oDomRef.scrollLeft;
			}
		}
	};


	/**
	 * For the given scrollLeft value this method returns the scrollLeft value as understood by the current browser in RTL mode.
	 * This value is specific to the given DOM element, as the computation may involve its dimensions.
	 *
	 * So when oDomRef should be scrolled 2px from the leftmost position, the number "2" must be given as iNormalizedScrollLeft
	 * and the result of this method (which may be a large or even negative number, depending on the browser) can then be set as
	 * oDomRef.scrollLeft to achieve the desired (cross-browser-consistent) scrolling position.
	 *
	 * This method does no scrolling on its own, it only calculates the value to set (so it can also be used for animations).
	 *
	 * @param {int} iNormalizedScrollLeft The distance from the leftmost position to which the element should be scrolled
	 * @param {Element} oDomRef The DOM Element to which scrollLeft will be applied
	 * @return {int} The scroll position that must be set for the DOM element
	 * @public
	 * @author SAP SE
	 * @since 0.20.0
	 */
	jQuery.sap.denormalizeScrollLeftRTL = function(iNormalizedScrollLeft, oDomRef) {

		if (oDomRef) {
			if (!!Device.browser.internet_explorer) {
				return oDomRef.scrollWidth - oDomRef.clientWidth - iNormalizedScrollLeft;

			} else if (!!Device.browser.webkit) {
				return iNormalizedScrollLeft;

			} else if (!!Device.browser.firefox) {
				return oDomRef.clientWidth + iNormalizedScrollLeft - oDomRef.scrollWidth;

			} else {
				// unrecognized browser; it is hard to return a best guess, as browser strategies are very different, so return the actual value
				return iNormalizedScrollLeft;
			}
		}
	};


	/**
	 * For the given scroll position measured from the "beginning" of a container (the right edge in RTL mode)
	 * this method returns the scrollLeft value as understood by the current browser in RTL mode.
	 * This value is specific to the given DOM element, as the computation may involve its dimensions.
	 *
	 * So when oDomRef should be scrolled 2px from the beginning, the number "2" must be given as iNormalizedScrollBegin
	 * and the result of this method (which may be a large or even negative number, depending on the browser) can then be set as
	 * oDomRef.scrollLeft to achieve the desired (cross-browser-consistent) scrolling position.
	 * Low values make the right part of the content visible, high values the left part.
	 *
	 * This method does no scrolling on its own, it only calculates the value to set (so it can also be used for animations).
	 *
	 * Only use this method in RTL mode, as the behavior in LTR mode is undefined and may change!
	 *
	 * @param {int} iNormalizedScrollBegin The distance from the rightmost position to which the element should be scrolled
	 * @param {Element} oDomRef The DOM Element to which scrollLeft will be applied
	 * @return {int} The scroll position that must be set for the DOM element
	 * @public
	 * @author SAP SE
	 * @since 1.26.1
	 */
	jQuery.sap.denormalizeScrollBeginRTL = function(iNormalizedScrollBegin, oDomRef) {

		if (oDomRef) {
			if (!!Device.browser.internet_explorer) {
				return iNormalizedScrollBegin;

			} else if (!!Device.browser.webkit) {
				return oDomRef.scrollWidth - oDomRef.clientWidth - iNormalizedScrollBegin;

			} else if (!!Device.browser.firefox) {
				return -iNormalizedScrollBegin;

			} else {
				// unrecognized browser; it is hard to return a best guess, as browser strategies are very different, so return the actual value
				return iNormalizedScrollBegin;
			}
		}
	};



	/*
	 * The following methods are taken from jQuery UI core but modified.
	 *
	 * jQuery UI Core
	 * http://jqueryui.com
	 *
	 * Copyright 2014 jQuery Foundation and other contributors
	 * Released under the MIT license.
	 * http://jquery.org/license
	 *
	 * http://api.jqueryui.com/category/ui-core/
	 */
	jQuery.support.selectstart = "onselectstart" in document.createElement("div");
	jQuery.fn.extend( /** @lends jQuery.prototype */ {

		/**
		 * Disable HTML elements selection.
		 *
		 * @return {jQuery} <code>this</code> to allow method chaining.
		 * @protected
		 * @since 1.24.0
		 */
		disableSelection: function() {
			return this.on((jQuery.support.selectstart ? "selectstart" : "mousedown") + ".ui-disableSelection", function(oEvent) {
				oEvent.preventDefault();
			});
		},

		/**
		 * Enable HTML elements to get selected.
		 *
		 * @return {jQuery} <code>this</code> to allow method chaining.
		 * @protected
		 * @since 1.24.0
		 */
		enableSelection: function() {
			return this.off(".ui-disableSelection");
		}
	});


	/*!
	 * The following functions are taken from jQuery UI 1.8.17 but modified
	 *
	 * Copyright 2011, AUTHORS.txt (http://jqueryui.com/about)
	 * Dual licensed under the MIT or GPL Version 2 licenses.
	 * http://jquery.org/license
	 *
	 * http://docs.jquery.com/UI
	 */
	function visible( element ) {
		// check if one of the parents (until it's position parent) is invisible
		// prevent that elements in static area are always checked as invisible

		// list all items until the offsetParent item (with jQuery >1.6 you can use parentsUntil)
		var oOffsetParent = jQuery(element).offsetParent();
		var bOffsetParentFound = false;
		var $refs = jQuery(element).parents().filter(function() {
			if (this === oOffsetParent) {
				bOffsetParentFound = true;
			}
			return bOffsetParentFound;
		});

		// check for at least one item to be visible
		return !jQuery(element).add($refs).filter(function() {
			return jQuery.css( this, "visibility" ) === "hidden" || jQuery.expr.filters.hidden( this );
		}).length;
	}

	function focusable( element, isTabIndexNotNaN ) {
		var nodeName = element.nodeName.toLowerCase();
		if ( nodeName === "area" ) {
			var map = element.parentNode,
				mapName = map.name,
				img;
			if ( !element.href || !mapName || map.nodeName.toLowerCase() !== "map" ) {
				return false;
			}
			img = jQuery( "img[usemap=#" + mapName + "]" )[0];
			return !!img && visible( img );
		}
		/*eslint-disable no-nested-ternary */
		return ( /input|select|textarea|button|object/.test( nodeName )
			? !element.disabled
			: nodeName == "a"
				? element.href || isTabIndexNotNaN
				: isTabIndexNotNaN)
			// the element and all of its ancestors must be visible
			&& visible( element );
		/*eslint-enable no-nested-ternary */
	}


	if (!jQuery.expr[":"].focusable) {
		/*!
		 * The following function is taken from jQuery UI 1.8.17
		 *
		 * Copyright 2011, AUTHORS.txt (http://jqueryui.com/about)
		 * Dual licensed under the MIT or GPL Version 2 licenses.
		 * http://jquery.org/license
		 *
		 * http://docs.jquery.com/UI
		 *
		 * But since visible is modified, focusable is different too the jQuery UI version too.
		 */
		jQuery.extend( jQuery.expr[ ":" ], {
			/**
			 * This defines the jQuery ":focusable" selector; it is also defined in jQuery UI. If already present, nothing is
			 * done here, so we will not overwrite any previous implementation.
			 * If jQuery UI is loaded later on, this implementation here will be overwritten by that one, which is fine,
			 * as it is semantically the same thing and intended to do exactly the same.
			 */
			focusable: function( element ) {
				return focusable( element, !isNaN( jQuery.attr( element, "tabindex" ) ) );
			}
		});
	}

	if (!jQuery.expr[":"].sapTabbable) {
		/*!
		 * The following function is taken from
		 * jQuery UI Core 1.11.1
		 * http://jqueryui.com
		 *
		 * Copyright 2014 jQuery Foundation and other contributors
		 * Released under the MIT license.
		 * http://jquery.org/license
		 *
		 * http://api.jqueryui.com/category/ui-core/
		 */
		jQuery.extend( jQuery.expr[ ":" ], {
			/**
			 * This defines the jQuery ":tabbable" selector; it is also defined in jQuery UI. If already present, nothing is
			 * done here, so we will not overwrite any previous implementation.
			 * If jQuery UI is loaded later on, this implementation here will be overwritten by that one, which is fine,
			 * as it is semantically the same thing and intended to do exactly the same.
			 */
			sapTabbable: function( element ) {
				var tabIndex = jQuery.attr( element, "tabindex" ),
					isTabIndexNaN = isNaN( tabIndex );
				return ( isTabIndexNaN || tabIndex >= 0 ) && focusable( element, !isTabIndexNaN );
			}
		});
	}

	if (!jQuery.expr[":"].sapFocusable) {
		/*!
		 * Do not use jQuery UI focusable because this might be overwritten if jQuery UI is loaded
		 */
		jQuery.extend( jQuery.expr[ ":" ], {
			/**
			 * This defines the jQuery ":sapFocusable" selector; If already present, nothing is
			 * done here, so we will not overwrite any previous implementation.
			 * If jQuery UI is loaded later on, this implementation here will NOT be overwritten by.
			 */
			sapFocusable: function( element ) {
				return focusable( element, !isNaN( jQuery.attr( element, "tabindex" ) ) );
			}
		});
	}

	if (!jQuery.fn.zIndex) {
		/*!
		 * The following function is taken from
		 * jQuery UI Core 1.11.1
		 * http://jqueryui.com
		 *
		 * Copyright 2014 jQuery Foundation and other contributors
		 * Released under the MIT license.
		 * http://jquery.org/license
		 *
		 * http://api.jqueryui.com/category/ui-core/
		 */
		jQuery.fn.zIndex = function( zIndex ) {
			if ( zIndex !== undefined ) {
				return this.css( "zIndex", zIndex );
			}

			if ( this.length ) {
				var elem = jQuery( this[ 0 ] ), position, value;
				while ( elem.length && elem[ 0 ] !== document ) {
					// Ignore z-index if position is set to a value where z-index is ignored by the browser
					// This makes behavior of this function consistent across browsers
					// WebKit always returns auto if the element is positioned
					position = elem.css( "position" );
					if ( position === "absolute" || position === "relative" || position === "fixed" ) {
						// IE returns 0 when zIndex is not specified
						// other browsers return a string
						// we ignore the case of nested elements with an explicit value of 0
						// <div style="z-index: -10;"><div style="z-index: 0;"></div></div>
						value = parseInt( elem.css( "zIndex" ), 10 );
						if ( !isNaN( value ) && value !== 0 ) {
							return value;
						}
					}
					elem = elem.parent();
				}
			}

			return 0;
		};
	}

	/**
	 * Gets the next parent DOM element with a given attribute and attribute value starting above the first given element
	 *
	 * @param {string} sAttribute Name of the attribute
	 * @param {string} sValue Value of the attribute (optional)
	 * @return {Element} null or the DOM reference
	 * @public
	 * @name jQuery#parentByAttribute
	 * @author SAP SE
	 * @since 0.9.0
	 * @function
	 */
	jQuery.fn.parentByAttribute = function parentByAttribute(sAttribute, sValue) {
		if (this.length > 0) {
			if (sValue) {
				return this.first().parents("[" + sAttribute + "='" + sValue + "']").get(0);
			} else {
				return this.first().parents("[" + sAttribute + "]").get(0);
			}
		}
	};


	/**
	 * Returns the window reference for a DomRef
	 *
	 * @param {Element} oDomRef The DOM reference
	 * @return {Window} Window reference
	 * @public
	 * @since 0.9.0
	 */
	jQuery.sap.ownerWindow = function ownerWindow(oDomRef){
		if (oDomRef.ownerDocument.parentWindow) {
			return oDomRef.ownerDocument.parentWindow;
		}
		return oDomRef.ownerDocument.defaultView;
	};


	var _oScrollbarSize = {};

	/**
	 * Returns the size (width of the vertical / height of the horizontal) native browser scrollbars.
	 *
	 * This function must only be used when the DOM is ready.
	 *
	 * @param {string} [sClasses=null] the CSS class that should be added to the test element.
	 * @param {boolean} [bForce=false] force recalculation of size (e.g. when CSS was changed). When no classes are passed all calculated sizes are reset.
	 * @return {object} JSON object with properties <code>width</code> and <code>height</code> (the values are of type number and are pixels).
	 * @public
	 * @since 1.4.0
	 */
	jQuery.sap.scrollbarSize = function(sClasses, bForce) {
		if (typeof sClasses === "boolean") {
			bForce = sClasses;
			sClasses = null;
		}

		var sKey = sClasses || "#DEFAULT"; // # is an invalid character for CSS classes

		if (bForce) {
			if (sClasses) {
				delete _oScrollbarSize[sClasses];
			} else {
				_oScrollbarSize = {};
			}
		}

		if (_oScrollbarSize[sKey]) {
			return _oScrollbarSize[sKey];
		}

		if (!document.body) {
			return {width: 0, height: 0};
		}

		var $Area = jQuery("<DIV/>")
			.css("visibility", "hidden")
			.css("height", "0")
			.css("width", "0")
			.css("overflow", "hidden");

		if (sClasses) {
			$Area.addClass(sClasses);
		}

		$Area.prependTo(document.body);

		var $Dummy = jQuery("<div style=\"visibility:visible;position:absolute;height:100px;width:100px;overflow:scroll;opacity:0;\"></div>");
		$Area.append($Dummy);

		var oDomRef = $Dummy.get(0);
		var iWidth = oDomRef.offsetWidth - oDomRef.scrollWidth;
		var iHeight = oDomRef.offsetHeight - oDomRef.scrollHeight;

		$Area.remove();

		// due to a bug in FireFox when hiding iframes via an outer DIV element
		// the height and width calculation is not working properly - by not storing
		// height and width when one value is 0 we make sure that once the iframe
		// gets visible the height calculation will be redone (see snippix: #64049)
		if (iWidth === 0 || iHeight === 0) {
			return {width: iWidth, height: iHeight};
		}

		_oScrollbarSize[sKey] = {width: iWidth, height: iHeight};

		return _oScrollbarSize[sKey];
	};

	// handle weak dependency to sap/ui/core/Control
	var _Control;

	function getControl() {
		return _Control || (_Control = sap.ui.require('sap/ui/core/Control'));
	}

	/**
	 * Search ancestors of the given source DOM element for the specified CSS class name.
	 * If the class name is found, set it to the root DOM element of the target control.
	 * If the class name is not found, it is also removed from the target DOM element.
	 *
	 * @param {string} sStyleClass CSS class name
	 * @param {jQuery|Control|string} vSource jQuery object, control or an id of the source element.
	 * @param {jQuery|Control} vDestination target jQuery object or a control.
	 * @return {jQuery|Element} Target element
	 * @public
	 * @since 1.22
	 */
	jQuery.sap.syncStyleClass = function(sStyleClass, vSource, vDestination) {

		if (!sStyleClass) {
			return vDestination;
		}

		var Control = getControl();

		if (Control && vSource instanceof Control) {
			vSource = vSource.$();
		} else if (typeof vSource === "string") {
			vSource = jQuery.sap.byId(vSource);
		} else if (!(vSource instanceof jQuery)) {
			jQuery.sap.assert(false, 'jQuery.sap.syncStyleClass(): vSource must be a jQuery object or a Control or a string');
			return vDestination;
		}

		var bClassFound = !!vSource.closest("." + sStyleClass).length;

		if (vDestination instanceof jQuery) {
			vDestination.toggleClass(sStyleClass, bClassFound);
		} else if (Control && vDestination instanceof Control) {
			vDestination.toggleStyleClass(sStyleClass, bClassFound);
		} else {
			jQuery.sap.assert(false, 'jQuery.sap.syncStyleClass(): vDestination must be a jQuery object or a Control');
		}

		return vDestination;
	};

	/**
	 * Adds space separated value to the given attribute.
	 * This method ignores when the value is already available for the given attribute.
	 *
	 * @this {jQuery} jQuery context
	 * @param {string} sAttribute The name of the attribute.
	 * @param {string} sValue The value of the attribute to be inserted.
	 * @return {jQuery} <code>this</code> to allow method chaining.
	 * @author SAP SE
	 * @since 1.30.0
	 * @function
	 * @private
	 */
	function addToAttributeList(sAttribute, sValue) {
		var sAttributes = this.attr(sAttribute);
		if (!sAttributes) {
			return this.attr(sAttribute, sValue);
		}

		var aAttributes = sAttributes.split(" ");
		if (aAttributes.indexOf(sValue) == -1) {
			aAttributes.push(sValue);
			this.attr(sAttribute, aAttributes.join(" "));
		}

		return this;
	}

	/**
	 * Remove space separated value from the given attribute.
	 *
	 * @this {jQuery} jQuery context
	 * @param {string} sAttribute The name of the attribute.
	 * @param {string} sValue The value of the attribute to be inserted.
	 * @return {jQuery} <code>this</code> to allow method chaining.
	 * @author SAP SE
	 * @since 1.30.0
	 * @function
	 * @private
	 */
	function removeFromAttributeList(sAttribute, sValue) {
		var sAttributes = this.attr(sAttribute) || "",
			aAttributes = sAttributes.split(" "),
			iIndex = aAttributes.indexOf(sValue);

		if (iIndex == -1) {
			return this;
		}

		aAttributes.splice(iIndex, 1);
		if (aAttributes.length) {
			this.attr(sAttribute, aAttributes.join(" "));
		} else {
			this.removeAttr(sAttribute);
		}

		return this;
	}

	/**
	 * Adds the given ID reference to the the aria-labelledby attribute.
	 *
	 * @param {string} sID The ID reference of an element
	 * @return {jQuery} <code>this</code> to allow method chaining.
	 * @name jQuery#addAriaLabelledBy
	 * @public
	 * @author SAP SE
	 * @since 1.30.0
	 * @function
	 */
	jQuery.fn.addAriaLabelledBy = function (sId) {
		return addToAttributeList.call(this, "aria-labelledby", sId);
	};

	/**
	 * Removes the given ID reference from the aria-labelledby attribute.
	 *
	 * @param {string} sID The ID reference of an element
	 * @return {jQuery} <code>this</code> to allow method chaining.
	 * @name jQuery#removeAriaLabelledBy
	 * @public
	 * @author SAP SE
	 * @since 1.30.0
	 * @function
	 */
	jQuery.fn.removeAriaLabelledBy = function (sId) {
		return removeFromAttributeList.call(this, "aria-labelledby", sId);
	};

	/**
	 * Adds the given ID reference to the aria-describedby attribute.
	 *
	 * @param {string} sID The ID reference of an element
	 * @return {jQuery} <code>this</code> to allow method chaining.
	 * @name jQuery#addAriaDescribedBy
	 * @public
	 * @author SAP SE
	 * @since 1.30.0
	 * @function
	 */
	jQuery.fn.addAriaDescribedBy = function (sId) {
		return addToAttributeList.call(this, "aria-describedby", sId);
	};

	/**
	 * Removes the given ID reference from the aria-describedby attribute.
	 *
	 * @param {string} sID The ID reference of an element
	 * @return {jQuery} <code>this</code> to allow method chaining.
	 * @name jQuery#removeAriaDescribedBy
	 * @public
	 * @author SAP SE
	 * @since 1.30.0
	 * @function
	 */
	jQuery.fn.removeAriaDescribedBy = function (sId) {
		return removeFromAttributeList.call(this, "aria-describedby", sId);
	};


	/**
	 * This method try to patch two HTML elements according to changed attributes.
	 *
	 * @param {HTMLElement} oOldDom existing element to be patched
	 * @param {HTMLElement} oNewDom is the new node to patch old dom
	 * @return {Boolean} true when patch is applied correctly or false when nodes are replaced.
	 * @author SAP SE
	 * @since 1.30.0
	 * @private
	 */
	function patchDOM(oOldDom, oNewDom) {

		// start checking with most common use case and backwards compatible
		if (oOldDom.childElementCount != oNewDom.childElementCount ||
			oOldDom.tagName != oNewDom.tagName) {
			oOldDom.parentNode.replaceChild(oNewDom, oOldDom);
			return false;
		}

		// go with native... if nodes are equal there is nothing to do
		// http://www.w3.org/TR/DOM-Level-3-Core/core.html#Node3-isEqualNode
		if (oOldDom.isEqualNode(oNewDom)) {
			return true;
		}

		// remove outdated attributes from old dom
		var aOldAttributes = oOldDom.attributes;
		for (var i = 0, ii = aOldAttributes.length; i < ii; i++) {
			var sAttrName = aOldAttributes[i].name;
			if (oNewDom.getAttribute(sAttrName) === null) {
				oOldDom.removeAttribute(sAttrName);
				ii = ii - 1;
				i = i - 1;
			}
		}

		// patch new or changed attributes to the old dom
		var aNewAttributes = oNewDom.attributes;
		for (var i = 0, ii = aNewAttributes.length; i < ii; i++) {
			var sAttrName = aNewAttributes[i].name,
				vOldAttrValue = oOldDom.getAttribute(sAttrName),
				vNewAttrValue = oNewDom.getAttribute(sAttrName);

			if (vOldAttrValue === null || vOldAttrValue !== vNewAttrValue) {
				oOldDom.setAttribute(sAttrName, vNewAttrValue);
			}
		}

		// check whether more child nodes to continue or not
		var iNewChildNodesCount = oNewDom.childNodes.length;
		if (!iNewChildNodesCount && !oOldDom.hasChildNodes()) {
			return true;
		}

		// maybe no more child elements
		if (!oNewDom.childElementCount) {
			// but child nodes(e.g. Text Nodes) still needs to be replaced
			if (!iNewChildNodesCount) {
				// new dom does not have any child node, so we can clean the old one
				oOldDom.textContent = "";
			} else if (iNewChildNodesCount == 1 && oNewDom.firstChild.nodeType == 3 /* TEXT_NODE */) {
				// update the text content for the first text node
				oOldDom.textContent = oNewDom.textContent;
			} else {
				// in case of comments or other node types are used
				oOldDom.innerHTML = oNewDom.innerHTML;
			}
			return true;
		}

		// patch child nodes
		for (var i = 0, r = 0, ii = iNewChildNodesCount; i < ii; i++) {
			var oOldDomChildNode = oOldDom.childNodes[i],
				oNewDomChildNode = oNewDom.childNodes[i - r];

			if (oNewDomChildNode.nodeType == 1 /* ELEMENT_NODE */) {
				// recursively patch child elements
				if (!patchDOM(oOldDomChildNode, oNewDomChildNode)) {
					// if patch is not possible we replace nodes
					// in this case replaced node is removed
					r = r + 1;
				}
			} else {
				// when not element update only node values
				oOldDomChildNode.nodeValue = oNewDomChildNode.nodeValue;
			}
		}

		return true;
	}

	/**
	 * This method try to replace two HTML elements according to changed attributes.
	 * As a fallback it replaces DOM nodes.
	 *
	 * @param {HTMLElement} oOldDom existing element to be patched
	 * @param {HTMLElement|String} vNewDom is the new node to patch old dom
	 * @param {Boolean} bCleanData wheter jQuery data should be removed or not
	 * @return {Boolean} true when patch is applied correctly or false when nodes are replaced.
	 * @author SAP SE
	 * @since 1.30.0
	 * @private
	 */
	jQuery.sap.replaceDOM = function(oOldDom, vNewDom, bCleanData) {
		var oNewDom;
		if (typeof vNewDom === "string") {
			oNewDom = jQuery.parseHTML(vNewDom)[0];
		} else {
			oNewDom = vNewDom;
		}

		if (bCleanData) {
			jQuery.cleanData([oOldDom]);
			jQuery.cleanData(oOldDom.getElementsByTagName("*"));
		}

		return patchDOM(oOldDom, oNewDom);
	};

	return jQuery;

});
/*!
 * UI development toolkit for HTML5 (OpenUI5)
 * (c) Copyright 2009-2015 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */

// Provides encoding functions for JavaScript.
sap.ui.predefine('jquery.sap.encoder',['jquery.sap.global'],
	function(jQuery) {
	"use strict";

	/*
	 * Encoding according to the Secure Programming Guide
	 * <SAPWIKI>/wiki/display/NWCUIAMSIM/XSS+Secure+Programming+Guide
	 */

	/**
	 * Create hex and pad to length
	 * @private
	 */
	function hex(iChar, iLength) {
		var sHex = iChar.toString(16);
		if (iLength) {
			while (iLength > sHex.length) {
				sHex = "0" + sHex;
			}
		}
		return sHex;
	}

	/**
	 * RegExp and escape function for HTML escaping
	 */
	var rHtml = /[\x00-\x2b\x2f\x3a-\x40\x5b-\x5e\x60\x7b-\xff\u2028\u2029]/g,
		rHtmlReplace = /[\x00-\x08\x0b\x0c\x0e-\x1f\x7f-\x9f]/,
		mHtmlLookup = {
			"<": "&lt;",
			">": "&gt;",
			"&": "&amp;",
			"\"": "&quot;"
		};

	var fHtml = function(sChar) {
		var sEncoded = mHtmlLookup[sChar];
		if (!sEncoded) {
			if (rHtmlReplace.test(sChar)) {
				sEncoded = "&#xfffd;";
			} else {
				sEncoded = "&#x" + hex(sChar.charCodeAt(0)) + ";";
			}
			mHtmlLookup[sChar] = sEncoded;
		}
		return sEncoded;
	};

	/**
	 * Encode the string for inclusion into HTML content/attribute
	 *
	 * @param {string} sString The string to be escaped
	 * @return The escaped string
	 * @type {string}
	 * @public
	 * @SecValidate {0|return|XSS} validates the given string for HTML contexts
	 */
	jQuery.sap.encodeHTML = function(sString) {
		return sString.replace(rHtml, fHtml);
	};

	/**
	 * Encode the string for inclusion into XML content/attribute
	 *
	 * @param {string} sString The string to be escaped
	 * @return The escaped string
	 * @type {string}
	 * @public
	 * @SecValidate {0|return|XSS} validates the given string for XML contexts
	 */
	jQuery.sap.encodeXML = function(sString) {
		return sString.replace(rHtml, fHtml);
	};

	/**
	 * Encode the string for inclusion into HTML content/attribute.
	 * Old name "escapeHTML" kept for backward compatibility
	 *
	 * @param {string} sString The string to be escaped
	 * @return The escaped string
	 * @type {string}
	 * @public
	 * @deprecated Has been renamed, use {@link jQuery.sap.encodeHTML} instead.
	 */
	jQuery.sap.escapeHTML = function(sString) {
		return sString.replace(rHtml, fHtml);
	};

	/**
	 * RegExp and escape function for JS escaping
	 */
	var rJS = /[\x00-\x2b\x2d\x2f\x3a-\x40\x5b-\x5e\x60\x7b-\xff\u2028\u2029]/g,
		mJSLookup = {};

	var fJS = function(sChar) {
		var sEncoded = mJSLookup[sChar];
		if (!sEncoded) {
			var iChar = sChar.charCodeAt(0);
			if (iChar < 256) {
				sEncoded = "\\x" + hex(iChar, 2);
			} else {
				sEncoded = "\\u" + hex(iChar, 4);
			}
			mJSLookup[sChar] = sEncoded;
		}
		return sEncoded;
	};

	/**
	 * Encode the string for inclusion into a JS string literal
	 *
	 * @param {string} sString The string to be escaped
	 * @return The escaped string
	 * @type {string}
	 * @public
	 * @SecValidate {0|return|XSS} validates the given string for a JavaScript contexts
	 */
	jQuery.sap.encodeJS = function(sString) {
		return sString.replace(rJS, fJS);
	};

	/**
	 * Encode the string for inclusion into a JS string literal.
	 * Old name "escapeJS" kept for backward compatibility
	 *
	 * @param {string} sString The string to be escaped
	 * @return The escaped string
	 * @type {string}
	 * @public
	 * @deprecated Since 1.3.0. Has been renamed, use {@link jQuery.sap.encodeJS} instead.
	 */
	jQuery.sap.escapeJS = function(sString) {
		return sString.replace(rJS, fJS);
	};

	/**
	 * RegExp and escape function for URL escaping
	 */
	var rURL = /[\x00-\x2c\x2f\x3a-\x40\x5b-\x5e\x60\x7b-\uffff]/g,
		mURLLookup = {};

	var fURL = function(sChar) {
		var sEncoded = mURLLookup[sChar];
		if (!sEncoded) {
			var iChar = sChar.charCodeAt(0);
			if (iChar < 128) {
				sEncoded = "%" + hex(iChar, 2);
			} else if (iChar < 2048) {
				sEncoded = "%" + hex((iChar >> 6) | 192, 2) +
						   "%" + hex((iChar & 63) | 128, 2);
			} else {
				sEncoded = "%" + hex((iChar >> 12) | 224, 2) +
						   "%" + hex(((iChar >> 6) & 63) | 128, 2) +
						   "%" + hex((iChar & 63) | 128, 2);
			}
			mURLLookup[sChar] = sEncoded;
		}
		return sEncoded;
	};

	/**
	 * Encode the string for inclusion into an URL parameter
	 *
	 * @param {string} sString The string to be escaped
	 * @return The escaped string
	 * @type {string}
	 * @public
	 * @SecValidate {0|return|XSS} validates the given string for a URL context
	 */
	jQuery.sap.encodeURL = function(sString) {
		return sString.replace(rURL, fURL);
	};

	/**
	 * Encode a map of parameters into a combined URL parameter string
	 *
	 * @param {object} mParams The map of parameters to encode
	 * @return The URL encoded parameters
	 * @type {string}
	 * @public
	 * @SecValidate {0|return|XSS} validates the given string for a CSS context
	 */
	jQuery.sap.encodeURLParameters = function(mParams) {
		if (!mParams) {
			return "";
		}
		var aUrlParams = [];
		jQuery.each(mParams, function (sName, oValue) {
			if (jQuery.type(oValue) === "string") {
				oValue = jQuery.sap.encodeURL(oValue);
			}
			aUrlParams.push(jQuery.sap.encodeURL(sName) + "=" + oValue);
		});
		return aUrlParams.join("&");
	};

	/**
	 * RegExp and escape function for CSS escaping
	 */
	var rCSS = /[\x00-\x2f\x3a-\x40\x5b-\x60\x7b-\xff\u2028\u2029][0-9A-Fa-f]?/g;

	var fCSS = function(sChar) {
		var iChar = sChar.charCodeAt(0);
		if (sChar.length == 1) {
			return "\\" + hex(iChar);
		} else {
			return "\\" + hex(iChar) + " " + sChar.substr(1);
		}
	};

	/**
	 * Encode the string for inclusion into CSS string literals or identifiers
	 *
	 * @param {string} sString The string to be escaped
	 * @return The escaped string
	 * @type {string}
	 * @public
	 * @SecValidate {0|return|XSS} validates the given string for a CSS context
	 */
	jQuery.sap.encodeCSS = function(sString) {
		return sString.replace(rCSS, fCSS);
	};

	/**
	 * WhitelistEntry object
	 * @param {string} protocol The protocol of the URL
	 * @param {string} host The host of the URL
	 * @param {string} port The port of the URL
	 * @param {string} path the path of the URL
	 * @public
	 */
	function WhitelistEntry(protocol, host, port, path){
		if (protocol) {
			this.protocol = protocol.toUpperCase();
		}
		if (host) {
			this.host = host.toUpperCase();
		}
		this.port = port;
		this.path = path;
	}

	var aWhitelist = [];

	/**
	 * clears the whitelist for URL valiadtion
	 *
	 * @public
	 */
	jQuery.sap.clearUrlWhitelist = function() {

		aWhitelist.splice(0,aWhitelist.length);

	};

	/**
	 * Adds a whitelist entry for URL valiadtion
	 *
	 * @param {string} protocol The protocol of the URL
	 * @param {string} host The host of the URL
	 * @param {string} port The port of the URL
	 * @param {string} path the path of the URL
	 * @public
	 */
	jQuery.sap.addUrlWhitelist = function(protocol, host, port, path) {
		var oEntry = new WhitelistEntry(protocol, host, port, path);
		var iIndex = aWhitelist.length;
		aWhitelist[iIndex] = oEntry;
	};

	/**
	 * Removes a whitelist entry for URL valiadtion
	 *
	 * @param {int} iIndex index of entry
	 * @public
	 */
	jQuery.sap.removeUrlWhitelist = function(iIndex) {
		aWhitelist.splice(iIndex,1);
	};

	/**
	 * Gets the whitelist for URL valiadtion
	 *
	 * @return {string[]} whitelist
	 * @public
	 */
	jQuery.sap.getUrlWhitelist = function() {
		return aWhitelist.slice();
	};

	/**
	 * Validates an URL. Check if it's not a script or other security issue.
	 *
	 * @param {string} sUrl
	 * @return true if valid, false if not valid
	 * @public
	 */
	jQuery.sap.validateUrl = function(sUrl) {

		var result = /(?:([^:\/?#]+):)?(?:\/\/([^\/?#:]*)(?::([0-9]+))?)?([^?#]*)(?:\?([^#]*))?(?:#(.*))?/.exec(sUrl);
		if (!result) {
			return result;
		}

		var sProtocol = result[1],
			sHost = result[2],
			sPort = result[3],
			sPath = result[4],
			sQuery = result[5],
			sHash = result[6];

		var rCheck = /[\x00-\x24\x26-\x29\x2b\x2c\x2f\x3a-\x40\x5b-\x5e\x60\x7b-\x7d\x7f-\uffff]/;
		var rCheckHash = /[\x00-\x20\x22\x3c\x3e\x5b-\x5e\x60\x7b-\x7d\x7f-\uffff]/;
		var rCheckMail = /[a-z0-9!#$%&'*+\/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+\/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/;

		// protocol
		if (sProtocol) {
			sProtocol = sProtocol.toUpperCase();
			if (aWhitelist.length <= 0) {
				// no whitelist -> check for default protocols
				if (!/^(https?|ftp)/i.test(sProtocol)) {
					return false;
				}
			}
		}

		// Host -> whitelist + character check (TBD)
		if (sHost) {
			sHost = sHost.toUpperCase();
		}

		// Path -> split for "/" and check if forbidden characters exist
		if (sPath) {
			if (sProtocol === "MAILTO") {
				var bCheck = rCheckMail.test(sPath);
				if (!bCheck) {
					return false;
				}
			} else {
				var aComponents = sPath.split("/");
				for ( var i = 0; i < aComponents.length; i++) {
					var bCheck = rCheck.test(aComponents[i]);
					if (bCheck) {
						// forbidden character found
						return false;
					}
				}
			}
		}

		// query -> Split on & and = and check if forbidden characters exist
		if (sQuery) {
			var aComponents = sQuery.split("&");
			for ( var i = 0; i < aComponents.length; i++) {
				var iPos = aComponents[i].search("=");
				if (iPos != -1) {
					var sPart1 = aComponents[i].substring(0,iPos);
					var sPart2 = aComponents[i].substring(iPos + 1);
					var bCheck1 = rCheck.test(sPart1);
					var bCheck2 = rCheck.test(sPart2);
					if (bCheck1 || bCheck2) {
						// forbidden character found
						return false;
					}
				}
			}
		}

		// hash
		if (sHash) {
			if (rCheckHash.test(sHash)) {
				// forbidden character found
				return false;
			}
		}

		//filter whitelist
		if (aWhitelist.length > 0) {
			var bFound = false;
			for (var i = 0; i < aWhitelist.length; i++) {
				jQuery.sap.assert(aWhitelist[i] instanceof WhitelistEntry, "whitelist entry type wrong");
				if (!sProtocol || !aWhitelist[i].protocol || sProtocol == aWhitelist[i].protocol) {
					// protocol OK
					var bOk = false;
					if (sHost && aWhitelist[i].host && /^\*/.test(aWhitelist[i].host)) {
						// check for wildcard search at begin
						var sHostEscaped = aWhitelist[i].host.slice(1).replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
						var rFilter = RegExp(sHostEscaped + "$");
						if (rFilter.test(sHost)) {
							bOk = true;
						}
					} else if (!sHost || !aWhitelist[i].host || sHost == aWhitelist[i].host) {
						bOk = true;
					}
					if (bOk) {
						// host OK
						if ((!sHost && !sPort) || !aWhitelist[i].port || sPort == aWhitelist[i].port) {
							// port OK
							if (aWhitelist[i].path && /\*$/.test(aWhitelist[i].path)) {
								// check for wildcard search at end
								var sPathEscaped = aWhitelist[i].path.slice(0, -1).replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
								var rFilter = RegExp("^" + sPathEscaped);
								if (rFilter.test(sPath)) {
									bFound = true;
								}
							} else if (!aWhitelist[i].path || sPath == aWhitelist[i].path) {
								// path OK
								bFound = true;
							}
						}
					}
				}
				if (bFound) {
					break;
				}
			}
			if (!bFound) {
				return false;
			}
		}

		return true;
	};

	/**
	 * Strips unsafe tags and attributes from HTML.
	 *
	 * @param {string} sHTML the HTML to be sanitized.
	 * @param {object} [mOptions={}] options for the sanitizer
	 * @return {string} sanitized HTML
	 * @private
	 */
	jQuery.sap._sanitizeHTML = function(sHTML, mOptions) {
		return fnSanitizer(sHTML, mOptions || {
			uriRewriter: function(sUrl) {
				// by default we use the URL whitelist to check the URL's
				if (jQuery.sap.validateUrl(sUrl)) {
					return sUrl;
				}
			}
		});
	};

	/**
	 * Registers an application defined sanitizer to be used instead of the built-in one.
	 *
	 * The given sanitizer function must have the same signature as
	 * {@link jQuery.sap._sanitizeHTML}:
	 *
	 * <pre>
	 *   function sanitizer(sHtml, mOptions);
	 * </pre>
	 *
	 * The parameter <code>mOptions</code> will always be provided, but might be empty.
	 * The set of understood options is defined by the sanitizer. If no specific
	 * options are given, the sanitizer should run with the most secure settings.
	 * Sanitizers should ignore unknown settings. Known, but misconfigured settings should be
	 * reported as error.
	 *
	 * @param {function} fnSanitizer
	 * @private
	 */
	jQuery.sap._setHTMLSanitizer = function (fnSanitizer) {
		jQuery.sap.assert(typeof fnSanitizer === "function", "Sanitizer must be a function");
		fnSanitizer = fnSanitizer || defaultSanitizer;
	};

	function defaultSanitizer(sHTML, mOptions) {
		if ( !window.html || !window.html.sanitize ) {
			jQuery.sap.require("sap.ui.thirdparty.caja-html-sanitizer");
			jQuery.sap.assert(window.html && window.html.sanitize, "Sanitizer should have been loaded");
		}

		var oTagPolicy = mOptions.tagPolicy || window.html.makeTagPolicy(mOptions.uriRewriter, mOptions.tokenPolicy);
		return window.html.sanitizeWithPolicy(sHTML, oTagPolicy);
	}

	/**
	 * Globally configured sanitizer.
	 * @private
	 */
	var fnSanitizer = defaultSanitizer;

	return jQuery;

});
/*!
 * UI development toolkit for HTML5 (OpenUI5)
 * (c) Copyright 2009-2015 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */

// Provides functionality related to eventing.
sap.ui.predefine('jquery.sap.events',['jquery.sap.global', 'sap/ui/Device', 'jquery.sap.keycodes'],
	function(jQuery, Device/* , jQuerySap1 */) {
	"use strict";

	var onTouchStart,
		onTouchMove,
		onTouchEnd,
		onTouchCancel,
		onMouseEvent,
		aMouseEvents,
		bIsSimulatingTouchToMouseEvent = false;

	if (Device.browser.webkit && /Mobile/.test(navigator.userAgent) && Device.support.touch) {

		bIsSimulatingTouchToMouseEvent = true;

		(function() {
			var document = window.document,
				bHandleEvent = false,
				oTarget = null,
				bIsMoved = false,
				iStartX,
				iStartY,
				i = 0;

			aMouseEvents = ["mousedown", "mouseover", "mouseup", "mouseout", "click"];

			/**
			 * Fires a synthetic mouse event for a given type and native touch event.
			 * @param {String} sType the type of the synthetic event to fire, e.g. "mousedown"
			 * @param {jQuery.Event} oEvent the event object
			 * @private
			 */
			var fireMouseEvent = function(sType, oEvent) {

				if (!bHandleEvent) {
					return;
				}

				// we need mapping of the different event types to get the correct target
				var oMappedEvent = oEvent.type == "touchend" ? oEvent.changedTouches[0] : oEvent.touches[0];

				// create the synthetic event
				var newEvent = document.createEvent('MouseEvent');  // trying to create an actual TouchEvent will create an error
				newEvent.initMouseEvent(sType, true, true, window, oEvent.detail,
						oMappedEvent.screenX, oMappedEvent.screenY, oMappedEvent.clientX, oMappedEvent.clientY,
						oEvent.ctrlKey, oEvent.shiftKey, oEvent.altKey, oEvent.metaKey,
						oEvent.button, oEvent.relatedTarget);

				newEvent.isSynthetic = true;

				// Timeout needed. Do not interrupt the native event handling.
				window.setTimeout(function() {
						oTarget.dispatchEvent(newEvent);
				}, 0);
			};

			/**
			 * Checks if the target of the event is an input field.
			 * @param {jQuery.Event} oEvent the event object
			 * @return {Boolean} whether the target of the event is an input field.
			 */
			var isInputField = function(oEvent) {
				return oEvent.target.tagName.match(/input|textarea|select/i);
			};

			/**
			 * Mouse event handler. Prevents propagation for native events. 
			 * @param {jQuery.Event} oEvent the event object
			 * @private
			 */
			onMouseEvent = function(oEvent) {
				if (!oEvent.isSynthetic && !isInputField(oEvent)) {
					oEvent.stopPropagation();
					oEvent.preventDefault();
				}
			};

			/**
			 * Touch start event handler. Called whenever a finger is added to the surface. Fires mouse start event.
			 * @param {jQuery.Event} oEvent the event object
			 * @private
			 */
			onTouchStart = function(oEvent) {
				var oTouches = oEvent.touches,
					oTouch;

				bHandleEvent = (oTouches.length == 1 && !isInputField(oEvent));

				bIsMoved = false;
				if (bHandleEvent) {
					oTouch = oTouches[0];

					// As we are only interested in the first touch target, we remember it
					oTarget = oTouch.target;
					if (oTarget.nodeType === 3) {

						// no text node
						oTarget = oTarget.parentNode;
					}

					// Remember the start position of the first touch to determine if a click was performed or not.
					iStartX = oTouch.clientX;
					iStartY = oTouch.clientY;
					fireMouseEvent("mousedown", oEvent);
				}
			};

			/**
			 * Touch move event handler. Fires mouse move event.
			 * @param {jQuery.Event} oEvent the event object
			 * @private
			 */
			onTouchMove = function(oEvent) {
				var oTouch;

				if (bHandleEvent) {
					oTouch = oEvent.touches[0];

					// Check if the finger is moved. When the finger was moved, no "click" event is fired.
					if (Math.abs(oTouch.clientX - iStartX) > 10 || Math.abs(oTouch.clientY - iStartY) > 10) {
						bIsMoved = true;
					}

					if (bIsMoved) {

						// Fire "mousemove" event only when the finger was moved. This is to prevent unwanted movements. 
						fireMouseEvent("mousemove", oEvent);
					}
				}
			};

			/**
			 * Touch end event handler. Fires mouse up and click event.
			 * @param {jQuery.Event} oEvent the event object
			 * @private
			 */
			onTouchEnd = function(oEvent) {
				fireMouseEvent("mouseup", oEvent);
				if (!bIsMoved) {
					fireMouseEvent("click", oEvent);
				}
			};

			/**
			 * Touch cancel event handler. Fires mouse up event.
			 * @param {jQuery.Event} oEvent the event object
			 * @private
			 */
			onTouchCancel = function(oEvent) {
				fireMouseEvent("mouseup", oEvent);
			};

			// Bind mouse events
			for (; i < aMouseEvents.length; i++) {

				// Add click on capturing phase to prevent propagation if necessary
				document.addEventListener(aMouseEvents[i], onMouseEvent, true);
			}

			// Bind touch events
			document.addEventListener('touchstart', onTouchStart, true);
			document.addEventListener('touchmove', onTouchMove, true);
			document.addEventListener('touchend', onTouchEnd, true);
			document.addEventListener('touchcancel', onTouchCancel, true);
			
			/**
			 * Disable touch to mouse handling
			 *
			 * @public
			 */
			jQuery.sap.disableTouchToMouseHandling = function() {
				var i = 0;

				if (!bIsSimulatingTouchToMouseEvent) {
					return;
				}

				// unbind touch events
				document.removeEventListener('touchstart', onTouchStart, true);
				document.removeEventListener('touchmove', onTouchMove, true);
				document.removeEventListener('touchend', onTouchEnd, true);
				document.removeEventListener('touchcancel', onTouchCancel, true);

				// unbind mouse events
				for (; i < aMouseEvents.length; i++) {
					document.removeEventListener(aMouseEvents[i], onMouseEvent, true);
				}
			};
			
		}());
	}
	
	if (!jQuery.sap.disableTouchToMouseHandling) {
		jQuery.sap.disableTouchToMouseHandling = function() {};
	}

	/**
	 * List of DOM events that a UIArea automatically takes care of.
	 *
	 * A control/element doesn't have to bind listeners for these events.
	 * It instead can implement an <code>on<i>event</i>(oEvent)</code> method
	 * for any of the following events that it wants to be notified about:
	 * 
	 * click, dblclick, contextmenu, focusin, focusout, keydown, keypress, keyup, mousedown, mouseout, mouseover, 
	 * mouseup, select, selectstart, dragstart, dragenter, dragover, dragleave, dragend, drop, paste, cut, input
	 * 
	 * In case touch events are natively supported the following events are available in addition:
	 * touchstart, touchend, touchmove, touchcancel
	 *
	 * @public
	 */
	jQuery.sap.ControlEvents = [  // IMPORTANT: update the public documentation when extending this list
		"click",
		"dblclick",
		"contextmenu",
		"focusin",
		"focusout",
		"keydown",
		"keypress",
		"keyup",
		"mousedown",
		"mouseout",
		"mouseover",
		"mouseup",
		"select",
		"selectstart",
		"dragstart",
		"dragenter",
		"dragover",
		"dragleave",
		"dragend",
		"drop",
		"paste",
		"cut",
		
		/* input event is fired synchronously on IE9+ when the value of an <input> or <textarea> element is changed */
		/* for more details please see : https://developer.mozilla.org/en-US/docs/Web/Reference/Events/input */
		"input"
	];

	// touch events natively supported
	if (Device.support.touch) {

		// Define additional native events to be added to the event list.
		// TODO: maybe add "gesturestart", "gesturechange", "gestureend" later?
		jQuery.sap.ControlEvents.push("touchstart", "touchend", "touchmove", "touchcancel");
	}

	/**
	 * Enumeration of all so called "pseudo events", a useful classification
	 * of standard browser events as implied by SAP product standards.
	 *
	 * Whenever a browser event is recognized as one or more pseudo events, then this
	 * classification is attached to the original {@link jQuery.Event} object and thereby
	 * delivered to any jQuery-style listeners registered for that browser event.
	 *
	 * Pure JavaScript listeners can evaluate the classification information using
	 * the {@link jQuery.Event#isPseudoType} method.
	 *
	 * Instead of using the procedure as described above, the SAPUI5 controls and elements
	 * should simply implement an <code>on<i>pseudo-event</i>(oEvent)</code> method. It will
	 * be invoked only when that specific pseudo event has been recognized. This simplifies event
	 * dispatching even further.
	 *
	 * @namespace
	 * @public
	 */
	jQuery.sap.PseudoEvents = { // IMPORTANT: update the public documentation when extending this list

		/* Pseudo keyboard events */

		/**
		 * Pseudo event for keyboard arrow down without modifiers (Ctrl, Alt or Shift)
		 * @public
		 */
		sapdown: {sName: "sapdown", aTypes: ["keydown"], fnCheck: function (oEvent) {
			return oEvent.keyCode == jQuery.sap.KeyCodes.ARROW_DOWN && !hasModifierKeys(oEvent);
		}},

		/**
		 * Pseudo event for keyboard arrow down with modifiers (Ctrl, Alt or Shift)
		 * @public
		 */
		sapdownmodifiers: {sName: "sapdownmodifiers", aTypes: ["keydown"], fnCheck: function(oEvent) {
			return oEvent.keyCode == jQuery.sap.KeyCodes.ARROW_DOWN && hasModifierKeys(oEvent);
		}},

		/**
		 * Pseudo event for pseudo 'show' event (F4, Alt + down-Arrow)
		 * @public
		 */
		sapshow: {sName: "sapshow", aTypes: ["keydown"], fnCheck: function(oEvent) {
			return (oEvent.keyCode == jQuery.sap.KeyCodes.F4 && !hasModifierKeys(oEvent)) ||
				(oEvent.keyCode == jQuery.sap.KeyCodes.ARROW_DOWN && checkModifierKeys(oEvent, /*Ctrl*/false, /*Alt*/true, /*Shift*/false));
		}},

		/**
		 * Pseudo event for keyboard arrow up without modifiers (Ctrl, Alt or Shift)
		 * @public
		 */
		sapup: {sName: "sapup", aTypes: ["keydown"], fnCheck: function(oEvent) {
			return oEvent.keyCode == jQuery.sap.KeyCodes.ARROW_UP && !hasModifierKeys(oEvent);
		}},

		/**
		 * Pseudo event for keyboard arrow up with modifiers (Ctrl, Alt or Shift)
		 * @public
		 */
		sapupmodifiers: {sName: "sapupmodifiers", aTypes: ["keydown"], fnCheck: function(oEvent) {
			return oEvent.keyCode == jQuery.sap.KeyCodes.ARROW_UP && hasModifierKeys(oEvent);
		}},

		/**
		 * Pseudo event for pseudo 'hide' event (Alt + up-Arrow)
		 * @public
		 */
		saphide: {sName: "saphide", aTypes: ["keydown"], fnCheck: function(oEvent) {
			return oEvent.keyCode == jQuery.sap.KeyCodes.ARROW_UP && checkModifierKeys(oEvent, /*Ctrl*/false, /*Alt*/true, /*Shift*/false);
		}},

		/**
		 * Pseudo event for keyboard arrow left without modifiers (Ctrl, Alt or Shift)
		 * @public
		 */
		sapleft: {sName: "sapleft", aTypes: ["keydown"], fnCheck: function(oEvent) {
			return oEvent.keyCode == jQuery.sap.KeyCodes.ARROW_LEFT && !hasModifierKeys(oEvent);
		}},

		/**
		 * Pseudo event for keyboard arrow left with modifiers (Ctrl, Alt or Shift)
		 * @public
		 */
		sapleftmodifiers: {sName: "sapleftmodifiers", aTypes: ["keydown"], fnCheck: function(oEvent) {
			return oEvent.keyCode == jQuery.sap.KeyCodes.ARROW_LEFT && hasModifierKeys(oEvent);
		}},

		/**
		 * Pseudo event for keyboard arrow right without modifiers (Ctrl, Alt or Shift)
		 * @public
		 */
		sapright: {sName: "sapright", aTypes: ["keydown"], fnCheck: function(oEvent) {
			return oEvent.keyCode == jQuery.sap.KeyCodes.ARROW_RIGHT && !hasModifierKeys(oEvent);
		}},

		/**
		 * Pseudo event for keyboard arrow right with modifiers (Ctrl, Alt or Shift)
		 * @public
		 */
		saprightmodifiers: {sName: "saprightmodifiers", aTypes: ["keydown"], fnCheck: function(oEvent) {
			return oEvent.keyCode == jQuery.sap.KeyCodes.ARROW_RIGHT && hasModifierKeys(oEvent);
		}},

		/**
		 * Pseudo event for keyboard Home/Pos1 with modifiers (Ctrl, Alt or Shift)
		 * @public
		 */
		saphome: {sName: "saphome", aTypes: ["keydown"], fnCheck: function(oEvent) {
			return oEvent.keyCode == jQuery.sap.KeyCodes.HOME && !hasModifierKeys(oEvent);
		}},

		/**
		 * Pseudo event for keyboard Home/Pos1 without modifiers (Ctrl, Alt or Shift)
		 * @public
		 */
		saphomemodifiers: {sName: "saphomemodifiers", aTypes: ["keydown"], fnCheck: function(oEvent) {
			return oEvent.keyCode == jQuery.sap.KeyCodes.HOME && hasModifierKeys(oEvent);
		}},

		/**
		 * Pseudo event for  pseudo top event
		 * @public
		 */
		saptop: {sName: "saptop", aTypes: ["keydown"], fnCheck: function(oEvent) {
			return oEvent.keyCode == jQuery.sap.KeyCodes.HOME && checkModifierKeys(oEvent, /*Ctrl*/true, /*Alt*/false, /*Shift*/false);
		}},

		/**
		 * Pseudo event for keyboard End without modifiers (Ctrl, Alt or Shift)
		 * @public
		 */
		sapend: {sName: "sapend", aTypes: ["keydown"], fnCheck: function(oEvent) {
			return oEvent.keyCode == jQuery.sap.KeyCodes.END && !hasModifierKeys(oEvent);
		}},

		/**
		 * Pseudo event for keyboard End with modifiers (Ctrl, Alt or Shift)
		 * @public
		 */
		sapendmodifiers: {sName: "sapendmodifiers", aTypes: ["keydown"], fnCheck: function(oEvent) {
			return oEvent.keyCode == jQuery.sap.KeyCodes.END && hasModifierKeys(oEvent);
		}},

		/**
		 * Pseudo event for pseudo bottom event
		 * @public
		 */
		sapbottom: {sName: "sapbottom", aTypes: ["keydown"], fnCheck: function(oEvent) {
			return oEvent.keyCode == jQuery.sap.KeyCodes.END && checkModifierKeys(oEvent, /*Ctrl*/true, /*Alt*/false, /*Shift*/false);
		}},

		/**
		 * Pseudo event for keyboard page up without modifiers (Ctrl, Alt or Shift)
		 * @public
		 */
		sappageup: {sName: "sappageup", aTypes: ["keydown"], fnCheck: function(oEvent) {
			return oEvent.keyCode == jQuery.sap.KeyCodes.PAGE_UP && !hasModifierKeys(oEvent);
		}},

		/**
		 * Pseudo event for keyboard page up with modifiers (Ctrl, Alt or Shift)
		 * @public
		 */
		sappageupmodifiers: {sName: "sappageupmodifiers", aTypes: ["keydown"], fnCheck: function(oEvent) {
			return oEvent.keyCode == jQuery.sap.KeyCodes.PAGE_UP && hasModifierKeys(oEvent);
		}},

		/**
		 * Pseudo event for keyboard page down without modifiers (Ctrl, Alt or Shift)
		 * @public
		 */
		sappagedown: {sName: "sappagedown", aTypes: ["keydown"], fnCheck: function(oEvent) {
			return oEvent.keyCode == jQuery.sap.KeyCodes.PAGE_DOWN && !hasModifierKeys(oEvent);
		}},

		/**
		 * Pseudo event for keyboard page down with modifiers (Ctrl, Alt or Shift)
		 * @public
		 */
		sappagedownmodifiers: {sName: "sappagedownmodifiers", aTypes: ["keydown"], fnCheck: function(oEvent) {
			return oEvent.keyCode == jQuery.sap.KeyCodes.PAGE_DOWN && hasModifierKeys(oEvent);
		}},

		/**
		 * Pseudo event for pseudo 'select' event... space, enter, ... without modifiers (Ctrl, Alt or Shift)
		 * @public
		 */
		sapselect: {sName: "sapselect", aTypes: ["keydown"], fnCheck: function(oEvent) {
			return (oEvent.keyCode == jQuery.sap.KeyCodes.ENTER || oEvent.keyCode == jQuery.sap.KeyCodes.SPACE) && !hasModifierKeys(oEvent);
		}},

		/**
		 * Pseudo event for pseudo 'select' event... space, enter, ... with modifiers (Ctrl, Alt or Shift)
		 * @public
		 */
		sapselectmodifiers: {sName: "sapselectmodifiers", aTypes: ["keydown"], fnCheck: function(oEvent) {
			return (oEvent.keyCode == jQuery.sap.KeyCodes.ENTER || oEvent.keyCode == jQuery.sap.KeyCodes.SPACE) && hasModifierKeys(oEvent);
		}},

		/**
		 * Pseudo event for keyboard space without modifiers (Ctrl, Alt or Shift)
		 * @public
		 */
		sapspace: {sName: "sapspace", aTypes: ["keydown"], fnCheck: function(oEvent) {
			return oEvent.keyCode == jQuery.sap.KeyCodes.SPACE && !hasModifierKeys(oEvent);
		}},

		/**
		 * Pseudo event for keyboard space with modifiers (Ctrl, Alt or Shift)
		 * @public
		 */
		sapspacemodifiers: {sName: "sapspacemodifiers", aTypes: ["keydown"], fnCheck: function(oEvent) {
			return oEvent.keyCode == jQuery.sap.KeyCodes.SPACE && hasModifierKeys(oEvent);
		}},

		/**
		 * Pseudo event for keyboard enter without modifiers (Ctrl, Alt or Shift)
		 * @public
		 */
		sapenter: {sName: "sapenter", aTypes: ["keydown"], fnCheck: function(oEvent) {
			return oEvent.keyCode == jQuery.sap.KeyCodes.ENTER && !hasModifierKeys(oEvent);
		}},

		/**
		 * Pseudo event for keyboard enter with modifiers (Ctrl, Alt or Shift)
		 * @public
		 */
		sapentermodifiers: {sName: "sapentermodifiers", aTypes: ["keydown"], fnCheck: function(oEvent) {
			return oEvent.keyCode == jQuery.sap.KeyCodes.ENTER && hasModifierKeys(oEvent);
		}},

		/**
		 * Pseudo event for keyboard backspace without modifiers (Ctrl, Alt or Shift)
		 * @public
		 */
		sapbackspace: {sName: "sapbackspace", aTypes: ["keydown"], fnCheck: function(oEvent) {
			return oEvent.keyCode == jQuery.sap.KeyCodes.BACKSPACE && !hasModifierKeys(oEvent);
		}},

		/**
		 * Pseudo event for keyboard backspace with modifiers (Ctrl, Alt or Shift)
		 * @public
		 */
		sapbackspacemodifiers: {sName: "sapbackspacemodifiers", aTypes: ["keydown"], fnCheck: function(oEvent) {
			return oEvent.keyCode == jQuery.sap.KeyCodes.BACKSPACE && hasModifierKeys(oEvent);
		}},

		/**
		 * Pseudo event for keyboard delete without modifiers (Ctrl, Alt or Shift)
		 * @public
		 */
		sapdelete: {sName: "sapdelete", aTypes: ["keydown"], fnCheck: function(oEvent) {
			return oEvent.keyCode == jQuery.sap.KeyCodes.DELETE && !hasModifierKeys(oEvent);
		}},

		/**
		 * Pseudo event for keyboard delete with modifiers (Ctrl, Alt or Shift)
		 * @public
		 */
		sapdeletemodifiers: {sName: "sapdeletemodifiers", aTypes: ["keydown"], fnCheck: function(oEvent) {
			return oEvent.keyCode == jQuery.sap.KeyCodes.DELETE && hasModifierKeys(oEvent);
		}},

		/**
		 * Pseudo event for pseudo expand event (keyboard numpad +) without modifiers (Ctrl, Alt or Shift)
		 * @public
		 */
		sapexpand: {sName: "sapexpand", aTypes: ["keydown"], fnCheck: function(oEvent) {
			return oEvent.keyCode == jQuery.sap.KeyCodes.NUMPAD_PLUS && !hasModifierKeys(oEvent);
		}},

		/**
		 * Pseudo event for pseudo expand event (keyboard numpad +) with modifiers (Ctrl, Alt or Shift)
		 * @public
		 */
		sapexpandmodifiers: {sName: "sapexpandmodifiers", aTypes: ["keydown"], fnCheck: function(oEvent) {
			return oEvent.keyCode == jQuery.sap.KeyCodes.NUMPAD_PLUS && hasModifierKeys(oEvent);
		}},

		/**
		 * Pseudo event for pseudo collapse event (keyboard numpad -) without modifiers (Ctrl, Alt or Shift)
		 * @public
		 */
		sapcollapse: {sName: "sapcollapse", aTypes: ["keydown"], fnCheck: function(oEvent) {
			return oEvent.keyCode == jQuery.sap.KeyCodes.NUMPAD_MINUS && !hasModifierKeys(oEvent);
		}},

		/**
		 * Pseudo event for pseudo collapse event (keyboard numpad -) with modifiers (Ctrl, Alt or Shift)
		 * @public
		 */
		sapcollapsemodifiers: {sName: "sapcollapsemodifiers", aTypes: ["keydown"], fnCheck: function(oEvent) {
			return oEvent.keyCode == jQuery.sap.KeyCodes.NUMPAD_MINUS && hasModifierKeys(oEvent);
		}},

		/**
		 * Pseudo event for pseudo collapse event (keyboard numpad *)
		 * @public
		 */
		sapcollapseall: {sName: "sapcollapseall", aTypes: ["keydown"], fnCheck: function(oEvent) {
			return oEvent.keyCode == jQuery.sap.KeyCodes.NUMPAD_ASTERISK && !hasModifierKeys(oEvent);
		}},

		/**
		 * Pseudo event for keyboard escape
		 * @public
		 */
		sapescape: {sName: "sapescape", aTypes: ["keydown"], fnCheck: function(oEvent) {
			return oEvent.keyCode == jQuery.sap.KeyCodes.ESCAPE && !hasModifierKeys(oEvent);
		}},

		/**
		 * Pseudo event for keyboard tab (TAB + no modifier)
		 * @public
		 */
		saptabnext: {sName: "saptabnext", aTypes: ["keydown"], fnCheck: function(oEvent) {
			return oEvent.keyCode == jQuery.sap.KeyCodes.TAB && !hasModifierKeys(oEvent);
		}},

		/**
		 * Pseudo event for keyboard tab (TAB + shift modifier)
		 * @public
		 */
		saptabprevious: {sName: "saptabprevious", aTypes: ["keydown"], fnCheck: function(oEvent) {
			return oEvent.keyCode == jQuery.sap.KeyCodes.TAB && checkModifierKeys(oEvent, /*Ctrl*/false, /*Alt*/false, /*Shift*/true);
		}},

		/**
		 * Pseudo event for pseudo skip forward (F6 + no modifier)
		 * @public
		 */
		sapskipforward: {sName: "sapskipforward", aTypes: ["keydown"], fnCheck: function(oEvent) {
			return oEvent.keyCode == jQuery.sap.KeyCodes.F6 && !hasModifierKeys(oEvent);
		}},

		/**
		 * Pseudo event for pseudo skip back (F6 + shift modifier)
		 * @public
		 */
		sapskipback: {sName: "sapskipback", aTypes: ["keydown"], fnCheck: function(oEvent) {
			return oEvent.keyCode == jQuery.sap.KeyCodes.F6 && checkModifierKeys(oEvent, /*Ctrl*/false, /*Alt*/false, /*Shift*/true);
		}},

		//// contextmenu Shift-F10 hack
		//{sName: "sapcontextmenu", aTypes: ["keydown"], fnCheck: function(oEvent) {
		//	return oEvent.keyCode == jQuery.sap.KeyCodes.F10 && checkModifierKeys(oEvent, /*Ctrl*/false, /*Alt*/false, /*Shift*/true);
		//}},

		/**
		 * Pseudo event for pseudo 'decrease' event without modifiers (Ctrl, Alt or Shift)
		 * @public
		 */
		sapdecrease: {sName: "sapdecrease", aTypes: ["keydown"], fnCheck: function(oEvent) {
			var bRtl = sap.ui.getCore().getConfiguration().getRTL();
			var iPreviousKey = bRtl ? jQuery.sap.KeyCodes.ARROW_RIGHT : jQuery.sap.KeyCodes.ARROW_LEFT;
			return (oEvent.keyCode == iPreviousKey || oEvent.keyCode == jQuery.sap.KeyCodes.ARROW_DOWN) && !hasModifierKeys(oEvent);
		}},

		/**
		 * Pseudo event for pressing the '-' (minus) sign.
		 * @since 1.25.0
		 * @experimental Since 1.25.0 Implementation details can be changed in future.
		 * @public
		 */
		sapminus: {sName: "sapminus", aTypes: ["keypress"], fnCheck: function(oEvent) {
			var sCharCode = String.fromCharCode(oEvent.which);
			return sCharCode == '-';
		}},

		/**
		 * Pseudo event for pseudo 'decrease' event with modifiers (Ctrl, Alt or Shift)
		 * @public
		 */
		sapdecreasemodifiers: {sName: "sapdecreasemodifiers", aTypes: ["keydown"], fnCheck: function(oEvent) {
			var bRtl = sap.ui.getCore().getConfiguration().getRTL();
			var iPreviousKey = bRtl ? jQuery.sap.KeyCodes.ARROW_RIGHT : jQuery.sap.KeyCodes.ARROW_LEFT;
			return (oEvent.keyCode == iPreviousKey || oEvent.keyCode == jQuery.sap.KeyCodes.ARROW_DOWN) && hasModifierKeys(oEvent);
		}},

		/**
		 * Pseudo event for pseudo 'increase' event without modifiers (Ctrl, Alt or Shift)
		 * @public
		 */
		sapincrease: {sName: "sapincrease", aTypes: ["keydown"], fnCheck: function(oEvent) {
			var bRtl = sap.ui.getCore().getConfiguration().getRTL();
			var iNextKey = bRtl ? jQuery.sap.KeyCodes.ARROW_LEFT : jQuery.sap.KeyCodes.ARROW_RIGHT;
			return (oEvent.keyCode == iNextKey || oEvent.keyCode == jQuery.sap.KeyCodes.ARROW_UP) && !hasModifierKeys(oEvent);
		}},
		
		/**
		 * Pseudo event for pressing the '+' (plus) sign.
		 * @since 1.25.0
		 * @experimental Since 1.25.0 Implementation details can be changed in future.
		 * @public
		 */
		sapplus: {sName: "sapplus", aTypes: ["keypress"], fnCheck: function(oEvent) {
			var sCharCode = String.fromCharCode(oEvent.which);
			return sCharCode == '+';
		}},

		/**
		 * Pseudo event for pseudo 'increase' event with modifiers (Ctrl, Alt or Shift)
		 * @public
		 */
		sapincreasemodifiers: {sName: "sapincreasemodifiers", aTypes: ["keydown"], fnCheck: function(oEvent) {
			var bRtl = sap.ui.getCore().getConfiguration().getRTL();
			var iNextKey = bRtl ? jQuery.sap.KeyCodes.ARROW_LEFT : jQuery.sap.KeyCodes.ARROW_RIGHT;
			return (oEvent.keyCode == iNextKey || oEvent.keyCode == jQuery.sap.KeyCodes.ARROW_UP) && hasModifierKeys(oEvent);
		}},

		/**
		 * Pseudo event for pseudo 'previous' event without modifiers (Ctrl, Alt or Shift)
		 * @public
		 */
		sapprevious: {sName: "sapprevious", aTypes: ["keydown"], fnCheck: function(oEvent) {
			var bRtl = sap.ui.getCore().getConfiguration().getRTL();
			var iPreviousKey = bRtl ? jQuery.sap.KeyCodes.ARROW_RIGHT : jQuery.sap.KeyCodes.ARROW_LEFT;
			return (oEvent.keyCode == iPreviousKey || oEvent.keyCode == jQuery.sap.KeyCodes.ARROW_UP) && !hasModifierKeys(oEvent);
		}},

		/**
		 * Pseudo event for pseudo 'previous' event with modifiers (Ctrl, Alt or Shift)
		 * @public
		 */
		sappreviousmodifiers: {sName: "sappreviousmodifiers", aTypes: ["keydown"], fnCheck: function(oEvent) {
			var bRtl = sap.ui.getCore().getConfiguration().getRTL();
			var iPreviousKey = bRtl ? jQuery.sap.KeyCodes.ARROW_RIGHT : jQuery.sap.KeyCodes.ARROW_LEFT;
			return (oEvent.keyCode == iPreviousKey || oEvent.keyCode == jQuery.sap.KeyCodes.ARROW_UP) && hasModifierKeys(oEvent);
		}},

		/**
		 * Pseudo event for pseudo 'next' event without modifiers (Ctrl, Alt or Shift)
		 * @public
		 */
		sapnext: {sName: "sapnext", aTypes: ["keydown"], fnCheck: function(oEvent) {
			var bRtl = sap.ui.getCore().getConfiguration().getRTL();
			var iNextKey = bRtl ? jQuery.sap.KeyCodes.ARROW_LEFT : jQuery.sap.KeyCodes.ARROW_RIGHT;
			return (oEvent.keyCode == iNextKey || oEvent.keyCode == jQuery.sap.KeyCodes.ARROW_DOWN) && !hasModifierKeys(oEvent);
		}},

		/**
		 * Pseudo event for pseudo 'next' event with modifiers (Ctrl, Alt or Shift)
		 * @public
		 */
		sapnextmodifiers: {sName: "sapnextmodifiers", aTypes: ["keydown"], fnCheck: function(oEvent) {
			var bRtl = sap.ui.getCore().getConfiguration().getRTL();
			var iNextKey = bRtl ? jQuery.sap.KeyCodes.ARROW_LEFT : jQuery.sap.KeyCodes.ARROW_RIGHT;
			return (oEvent.keyCode == iNextKey || oEvent.keyCode == jQuery.sap.KeyCodes.ARROW_DOWN) && hasModifierKeys(oEvent);
		}},

		//// pseudo hotkey event
		//{sName: "saphotkey", aTypes: ["keydown"], fnCheck: function(oEvent) {
		//  return false;
		//}},
		/* TODO: hotkeys: all other events could be hotkeys
		if(UCF_KeyboardHelper.bIsValidHotkey(iKey, bCtrl, bAlt, bShift)) {

			if (iKey == jQuery.sap.KeyCodes.F1 && bNoModifiers) {
				//special handling for FF - in IE the help is handeled by onHelp
				if (UCF_System.sDevice == "ff1") {
					this.fireSapEvent(this.E_SAP_EVENTS.hotkey, oEvent);
				}
			}
			else if (bCtrlOnly && iKey == jQuery.sap.KeyCodes.C && document.selection) {
				//handle ctrl+c centrally if text is selected to allow to copy it instead of firing the hotkey
				var oTextRange = document.selection.createRange();
				if (!oTextRange || oTextRange.text.length <= 0) {
					this.fireSapEvent(this.E_SAP_EVENTS.hotkey, oEvent);
				}
			}
			else {
				this.fireSapEvent(this.E_SAP_EVENTS.hotkey, oEvent);
			}
		}
		*/

		/*
		 * Other pseudo events
		 * @public
		 */

		/**
		 * Pseudo event indicating delayed double click (e.g. for inline edit)
		 * @public
		 */
		sapdelayeddoubleclick: {sName: "sapdelayeddoubleclick", aTypes: ["click"], fnCheck: function(oEvent) {
			var element = jQuery(oEvent.target);
			var currentTimestamp = oEvent.timeStamp;
			var data = element.data("sapdelayeddoubleclick_lastClickTimestamp");
			var lastTimestamp = data || 0;
			element.data("sapdelayeddoubleclick_lastClickTimestamp", currentTimestamp);
			var diff = currentTimestamp - lastTimestamp;
			return (diff >= 300 && diff <= 1300);
		}}
	};

	/**
	 * Ordered array of the {@link jQuery.sap.PseudoEvents}.
	 *
	 * Order is significant as some check methods rely on the fact that they are tested before other methods.
	 * The array is processed during event analysis (when classifying browser events as pseudo events).
	 * @private
	 */
	var PSEUDO_EVENTS = ["sapdown", "sapdownmodifiers", "sapshow", "sapup", "sapupmodifiers", "saphide", "sapleft", "sapleftmodifiers", "sapright", "saprightmodifiers", "saphome", "saphomemodifiers", "saptop", "sapend", "sapendmodifiers", "sapbottom", "sappageup", "sappageupmodifiers", "sappagedown", "sappagedownmodifiers", "sapselect", "sapselectmodifiers", "sapspace", "sapspacemodifiers", "sapenter", "sapentermodifiers", "sapexpand", "sapbackspace", "sapbackspacemodifiers", "sapdelete", "sapdeletemodifiers", "sapexpandmodifiers", "sapcollapse", "sapcollapsemodifiers", "sapcollapseall", "sapescape", "saptabnext", "saptabprevious", "sapskipforward", "sapskipback", "sapprevious", "sappreviousmodifiers", "sapnext", "sapnextmodifiers", "sapdecrease", "sapminus", "sapdecreasemodifiers", "sapincrease", "sapplus", "sapincreasemodifiers", "sapdelayeddoubleclick"];

	//Add mobile touch events if touch is supported
	(function initTouchEventSupport() {
		jQuery.sap.touchEventMode = "SIM";

		var aAdditionalControlEvents = [];
		var aAdditionalPseudoEvents = [];

		if (Device.support.touch) { // touch events natively supported
			jQuery.sap.touchEventMode = "ON";

			// ensure that "oEvent.touches", ... works (and not only "oEvent.originalEvent.touches", ...)
			jQuery.event.props.push("touches", "targetTouches", "changedTouches");
		}

		/**
		 * This function adds the simulated event prefixed with string "sap" to jQuery.sap.ControlEvents.
		 * 
		 * When UIArea binds to the simulated event with prefix, it internally binds to the original events with the given handler and 
		 * also provides the additional configuration data in the follwing format:
		 * 
		 * {
		 * 	domRef: // the dom reference of the UIArea
		 * 	eventName: // the simulated event name
		 * 	sapEventName: // the simulated event name with sap prefix
		 * 	eventHandle: // the handler that should be registered to simulated event with sap prefix
		 * }
		 * 
		 * @param {string} sSimEventName The name of the simulated event
		 * @param {array} aOrigEvents The array of original events that should be simulated from
		 * @param {function} fnHandler The function which is bound to the original events
		 * 
		 * @private
		 */
		var createSimulatedEvent = function(sSimEventName, aOrigEvents, fnHandler) {
			var sHandlerKey = "__" + sSimEventName + "Handler";
			var sSapSimEventName = "sap" + sSimEventName;
			aAdditionalControlEvents.push(sSapSimEventName);
			aAdditionalPseudoEvents.push({sName: sSimEventName, aTypes: [sSapSimEventName], fnCheck: function (oEvent) {
				return true;
			}});

			jQuery.event.special[sSapSimEventName] = {
				// When binding to the simulated event with prefix is done through jQuery, this function is called and redirect the registration
				// to the original events. Doing in this way we can simulate the event from listening to the original events.
				add: function(oHandle) {
					var that = this,
						$this = jQuery(this),
						oAdditionalConfig = {
							domRef: that,
							eventName: sSimEventName,
							sapEventName: sSapSimEventName,
							eventHandle: oHandle
						};

					var fnHandlerWrapper = function(oEvent){
						fnHandler(oEvent, oAdditionalConfig);
					};

					oHandle.__sapSimulatedEventHandler = fnHandlerWrapper;
					for (var i = 0; i < aOrigEvents.length; i++) {
						$this.on(aOrigEvents[i], fnHandlerWrapper);
					}
				},

				// When unbinding to the simulated event with prefix is done through jQuery, this function is called and redirect the deregistration
				// to the original events.
				remove: function(oHandle) {
					var $this = jQuery(this);
					var fnHandler = oHandle.__sapSimulatedEventHandler;
					$this.removeData(sHandlerKey + oHandle.guid);
					for (var i = 0; i < aOrigEvents.length; i++) {
						jQuery.event.remove(this, aOrigEvents[i], fnHandler);
					}
				}
			};
		};

		/**
		 * This function simulates the corresponding touch event by listening to mouse event.
		 * 
		 * The simulated event will be dispatch through UI5 event delegation which means that the on"EventName" function is called
		 * on control's prototype.
		 * 
		 * @param {jQuery.Event} oEvent The original event object
		 * @param {object} oConfig Additional configuration passed from createSimulatedEvent function
		 * @private
		 */
		var fnMouseToTouchHandler = function(oEvent, oConfig) {
			var $DomRef = jQuery(oConfig.domRef);
			// Suppress the delayed mouse events simulated on touch enabled device
			// the mark is done within jquery-mobile-custom.js
			if (oEvent.isMarked("delayedMouseEvent")) {
				return;
			}

			// Checks if the mouseout event should be handled, the mouseout of the inner dom shouldn't be handled when the mouse cursor
			// is still inside the control's root dom node
			if (!(oEvent.type != "mouseout" || (oEvent.type === "mouseout" && jQuery.sap.checkMouseEnterOrLeave(oEvent, oConfig.domRef)))) {
				var bSkip = true;
				var sControlId = $DomRef.data("__touchstart_control");
				if (sControlId) {
					var oCtrlDom = jQuery.sap.domById(sControlId);
					if (oCtrlDom && jQuery.sap.checkMouseEnterOrLeave(oEvent, oCtrlDom)) {
						bSkip = false;
					}
				}
				if (bSkip) {
					return;
				}
			}

			var oNewEvent = jQuery.event.fix(oEvent.originalEvent || oEvent);
			oNewEvent.type = oConfig.sapEventName;

			//reset the _sapui_handledByUIArea flag
			if (oNewEvent.isMarked("firstUIArea")) {
				oNewEvent.setMark("handledByUIArea", false);
			}

			var aTouches = [{
				identifier: 1,
				pageX: oNewEvent.pageX,
				pageY: oNewEvent.pageY,
				clientX: oNewEvent.clientX,
				clientY: oNewEvent.clientY,
				screenX: oNewEvent.screenX,
				screenY: oNewEvent.screenY,
				target: oNewEvent.target,
				radiusX: 1,
				radiusY: 1,
				rotationAngle: 0
			}];

			switch (oConfig.eventName) {
				case "touchstart":
				case "touchmove":
					oNewEvent.touches = oNewEvent.changedTouches = oNewEvent.targetTouches = aTouches;
					break;

				case "touchend":
					oNewEvent.changedTouches = aTouches;
					oNewEvent.touches = oNewEvent.targetTouches = [];
					break;
				// no default
			}

			if (oConfig.eventName === "touchstart" || $DomRef.data("__touch_in_progress")) {
				$DomRef.data("__touch_in_progress", "X");
				var oControl = jQuery.fn.control ? jQuery(oEvent.target).control(0) : null;
				if (oControl) {
					$DomRef.data("__touchstart_control", oControl.getId());
				}

				// When saptouchend event is generated from mouseout event, it has to be marked for being correctly handled inside UIArea.
				// for example, when sap.m.Image control is used inside sap.m.Button control, the following situation can happen:
				// 	1. Mousedown on image.
				// 	2. Keep mousedown and move mouse out of image.
				// 	3. ontouchend function will be called on image control and bubbled up to button control
				// 	4. However, the ontouchend function shouldn't be called on button.
				//
				// With this parameter, UIArea can check if the touchend is generated from mouseout event and check if the target is still
				// inside the current target. Executing the corresponding logic only when the target is out of the current target.
				if (oEvent.type === "mouseout") {
					oNewEvent.setMarked("fromMouseout");
				}
				oConfig.eventHandle.handler.call(oConfig.domRef, oNewEvent);
				// here the fromMouseout flag is checked, terminate the touch progress only when touchend event is not marked with fromMouseout.
				if (oConfig.eventName === "touchend" && !oNewEvent.isMarked("fromMouseout")) {
					$DomRef.removeData("__touch_in_progress");
					$DomRef.removeData("__touchstart_control");
				}
			}
		};
		if (!(Device.support.pointer && Device.support.touch)) {
			createSimulatedEvent("touchstart", ["mousedown"], fnMouseToTouchHandler);
			createSimulatedEvent("touchend", ["mouseup", "mouseout"], fnMouseToTouchHandler);
			createSimulatedEvent("touchmove", ["mousemove"], fnMouseToTouchHandler);
		}

		/**
		 * This methods decides when extra events are needed. Extra events are: tap, swipe and the new touch to mouse event simulation.
		 * 
		 * The old touch to mouse simulation is done in a way that a real mouse event is fired when there's a corresponding touch event. But this will mess up
		 * the mouse to touch event simulation and is not consistent with the mouse to touch event simulation. That's why when certain condition is met, the old
		 * touch to mouse event simluation will be replaced with the new touch to mouse event simulation.
		 * 
		 * The new one can't completely replace the old one because the desktop controls which bind to events using jQuery or browser API directly have to be change.
		 * Then the new one can replace the old one completely not under certain condition anymore.
		 * 
		 * @private
		 */
		function needsExtraEventSupport(){
			var oCfgData = window["sap-ui-config"] || {},
				sLibs = oCfgData.libs || "";

			// TODO: should be replaced by some function in jQuery.sap.global (e.g. jQuery.sap.config(sKey))
			function hasConfig(sKey) {
				return document.location.search.indexOf("sap-ui-" + sKey) > -1 || // URL 
					!!oCfgData[sKey.toLowerCase()]; // currently, properties of oCfgData are converted to lower case (DOM attributes)
			}

			return Device.support.touch || // tap, swipe, etc. events are needed when touch is supported
				hasConfig("xx-test-mobile") || // see sap.ui.core.Configuration -> M_SETTINGS
				// also simulate touch events when sap-ui-xx-fakeOS is set (independently of the value and the current browser)
				hasConfig("xx-fakeOS") ||
				// always simulate touch events when the mobile lib is involved (FIXME: hack for Kelley, this does currently not work with dynamic library loading)
				sLibs.match(/sap.m\b/);
		}

		// If extra event support is needed, jQuery mobile event plugin is loaded to support tap, swipe and scrollstart/stop events.
		// The old touch to mouse event simulation ((see line 25 in this file)) will be deregistered and the new one will be active.
		if (needsExtraEventSupport()) {
			jQuery.sap.require("sap.ui.thirdparty.jquery-mobile-custom");

			// Simulate mouse events on touch devices
			// Except for Windows Phone with touch events support.
			if (Device.support.touch && !Device.support.pointer) {
				var bFingerIsMoved = false,
					iMoveThreshold = jQuery.vmouse.moveDistanceThreshold,
					iStartX, iStartY,
					iOffsetX, iOffsetY,
					iLastTouchMoveTime;
				
				var fnCreateNewEvent = function(oEvent, oConfig, oMappedEvent) {
					var oNewEvent = jQuery.event.fix(oEvent.originalEvent || oEvent);
					oNewEvent.type = oConfig.sapEventName;

					delete oNewEvent.touches;
					delete oNewEvent.changedTouches;
					delete oNewEvent.targetTouches;
					
					//TODO: add other properties that should be copied to the new event
					oNewEvent.screenX = oMappedEvent.screenX;
					oNewEvent.screenY = oMappedEvent.screenY;
					oNewEvent.clientX = oMappedEvent.clientX;
					oNewEvent.clientY = oMappedEvent.clientY;
					oNewEvent.ctrlKey = oMappedEvent.ctrlKey;
					oNewEvent.altKey = oMappedEvent.altKey;
					oNewEvent.shiftKey = oMappedEvent.shiftKey;
					// The simulated mouse event should always be clicked by the left key of the mouse
					oNewEvent.button = (Device.browser.msie && Device.browser.version <= 8 ? 1 : 0);
					
					return oNewEvent;
				};
				
				/**
				 * This function simulates the corresponding mouse event by listening to touch event (touchmove).
				 * 
				 * The simulated event will be dispatch through UI5 event delegation which means that the on"EventName" function is called
				 * on control's prototype.
				 * 
				 * @param {jQuery.Event} oEvent The original event object
				 * @param {object} oConfig Additional configuration passed from createSimulatedEvent function
				 */
				var fnTouchMoveToMouseHandler = function(oEvent, oConfig) {
					if (oEvent.isMarked("handledByTouchToMouse")) {
						return;
					}
					oEvent.setMarked("handledByTouchToMouse");
					
					if (!bFingerIsMoved) {
						var oTouch = oEvent.originalEvent.touches[0];
						bFingerIsMoved = (Math.abs(oTouch.pageX - iStartX) > iMoveThreshold ||
												Math.abs(oTouch.pageY - iStartY) > iMoveThreshold);
					}

					if (Device.os.blackberry) {
						//Blackberry sends many touchmoves -> create a simulated mousemove every 50ms
						if (iLastTouchMoveTime && oEvent.timeStamp - iLastTouchMoveTime < 50) {
							return;
						}
						iLastTouchMoveTime = oEvent.timeStamp;
					}

					var oNewEvent = fnCreateNewEvent(oEvent, oConfig, oEvent.touches[0]);
					jQuery.sap.delayedCall(0, this, function(){
						oNewEvent.setMark("handledByUIArea", false);
						oConfig.eventHandle.handler.call(oConfig.domRef, oNewEvent);
					});
				};

				/**
				 * This function simulates the corresponding mouse event by listening to touch event (touchstart, touchend, touchcancel).
				 * 
				 * The simulated event will be dispatch through UI5 event delegation which means that the on"EventName" function is called
				 * on control's prototype.
				 * 
				 * @param {jQuery.Event} oEvent The original event object
				 * @param {object} oConfig Additional configuration passed from createSimulatedEvent function
				 */
				var fnTouchToMouseHandler = function(oEvent, oConfig) {
					if (oEvent.isMarked("handledByTouchToMouse")) {
						return;
					}
					oEvent.setMarked("handledByTouchToMouse");

					var oNewStartEvent, oNewEndEvent, bSimulateClick;

					function createNewEvent() {
						return fnCreateNewEvent(oEvent, oConfig, oConfig.eventName === "mouseup" ? oEvent.changedTouches[0] : oEvent.touches[0]);
					}

					if (oEvent.type === "touchstart") {

						var oTouch = oEvent.originalEvent.touches[0];
						bFingerIsMoved = false;
						iLastTouchMoveTime = 0;
						iStartX = oTouch.pageX;
						iStartY = oTouch.pageY;
						iOffsetX = Math.round(oTouch.pageX - jQuery(oEvent.target).offset().left);
						iOffsetY = Math.round(oTouch.pageY - jQuery(oEvent.target).offset().top);

						oNewStartEvent = createNewEvent();
						jQuery.sap.delayedCall(0, this, function(){
							oNewStartEvent.setMark("handledByUIArea", false);
							oConfig.eventHandle.handler.call(oConfig.domRef, oNewStartEvent);
						});
					} else if (oEvent.type === "touchend") {

						oNewEndEvent = createNewEvent();
						bSimulateClick = !bFingerIsMoved;

						jQuery.sap.delayedCall(0, this, function(){
							oNewEndEvent.setMark("handledByUIArea", false);
							oConfig.eventHandle.handler.call(oConfig.domRef, oNewEndEvent);
							if (bSimulateClick) {
								// also call the onclick event handler when touchend event is received and the movement is within threshold
								oNewEndEvent.type = "click";
								oNewEndEvent.getPseudoTypes = jQuery.Event.prototype.getPseudoTypes; //Reset the pseudo types due to type change
								oNewEndEvent.setMark("handledByUIArea", false);
								oNewEndEvent.offsetX = iOffsetX; // use offset from touchstart
								oNewEndEvent.offsetY = iOffsetY; // use offset from touchstart
								oConfig.eventHandle.handler.call(oConfig.domRef, oNewEndEvent);
							}
						});
					}
				};

				// Deregister the previous touch to mouse event simulation (see line 25 in this file)
				jQuery.sap.disableTouchToMouseHandling();

				createSimulatedEvent("mousedown", ["touchstart"], fnTouchToMouseHandler);
				createSimulatedEvent("mousemove", ["touchmove"], fnTouchMoveToMouseHandler);
				createSimulatedEvent("mouseup", ["touchend", "touchcancel"], fnTouchToMouseHandler);
			}

			// Define additional jQuery Mobile events to be added to the event list
			// TODO taphold cannot be used (does not bubble / has no target property) -> Maybe provide own solution
			// IMPORTANT: update the public documentation when extending this list
			aAdditionalControlEvents.push("swipe", "tap", "swipeleft", "swiperight", "scrollstart", "scrollstop");

			//Define additional pseudo events to be added to the event list
			aAdditionalPseudoEvents.push({sName: "swipebegin", aTypes: ["swipeleft", "swiperight"], fnCheck: function (oEvent) {
				var bRtl = sap.ui.getCore().getConfiguration().getRTL();
				return (bRtl && oEvent.type === "swiperight") || (!bRtl && oEvent.type === "swipeleft");
			}});
			aAdditionalPseudoEvents.push({sName: "swipeend", aTypes: ["swipeleft", "swiperight"], fnCheck: function (oEvent) {
				var bRtl = sap.ui.getCore().getConfiguration().getRTL();
				return (!bRtl && oEvent.type === "swiperight") || (bRtl && oEvent.type === "swipeleft");
			}});
		}

		// Add all defined events to the event infrastructure
		//
		// jQuery has inversed the order of event registration when multiple events are passed into jQuery.on method from version 1.9.1.
		//
		// UIArea binds to both touchstart and saptouchstart event and saptouchstart internally also binds to touchstart event. Before
		// jQuery version 1.9.1, the touchstart event handler is called before the saptouchstart event handler and our flags (e.g. _sapui_handledByUIArea)
		// still work. However since the order of event registration is inversed from jQuery version 1.9.1, the saptouchstart event hanlder is called
		// before the touchstart one, our flags don't work anymore.
		//
		// Therefore jQuery version needs to be checked in order to decide the event order in jQuery.sap.ControlEvents.
		if (jQuery.sap.Version(jQuery.fn.jquery).compareTo("1.9.1") < 0) {
			jQuery.sap.ControlEvents = jQuery.sap.ControlEvents.concat(aAdditionalControlEvents);
		} else {
			jQuery.sap.ControlEvents = aAdditionalControlEvents.concat(jQuery.sap.ControlEvents);
		}

		for (var i = 0; i < aAdditionalPseudoEvents.length; i++) {
			jQuery.sap.PseudoEvents[aAdditionalPseudoEvents[i].sName] = aAdditionalPseudoEvents[i];
			PSEUDO_EVENTS.push(aAdditionalPseudoEvents[i].sName);
		}
	}());

	/**
	 * Function for initialization of an Array containing all basic event types of the available pseudo events.
	 * @private
	 */
	function initPseudoEventBasicTypes(){
		var mEvents = jQuery.sap.PseudoEvents,
			aResult = [];

		for (var sName in mEvents) {
			if (mEvents[sName].aTypes) {
				for (var j = 0, js = mEvents[sName].aTypes.length; j < js; j++) {
					var sType = mEvents[sName].aTypes[j];
					if (jQuery.inArray(sType, aResult) == -1) {
						aResult.push(sType);
					}
				}
			}
		}

		return aResult;
	}

	/**
	 * Array containing all basic event types of the available pseudo events.
	 * @private
	 */
	var PSEUDO_EVENTS_BASIC_TYPES = initPseudoEventBasicTypes();

	/**
	 * Convenience method to check an event for a certain combination of modifier keys
	 *
	 * @private
	 */
	function checkModifierKeys(oEvent, bCtrlKey, bAltKey, bShiftKey) {
		return oEvent.shiftKey == bShiftKey && oEvent.altKey == bAltKey && getCtrlKey(oEvent) == bCtrlKey;
	}

	/**
	 * Convenience method to check an event for any modifier key
	 *
	 * @private
	 */
	function hasModifierKeys(oEvent) {
		return oEvent.shiftKey || oEvent.altKey || getCtrlKey(oEvent);
	}

	/**
	 * Convenience method for handling of Ctrl key, meta key etc.
	 *
	 * @private
	 */
	function getCtrlKey(oEvent) {
		return !!(oEvent.metaKey || oEvent.ctrlKey); // double negation doesn't have effect on boolean but ensures null and undefined are equivalent to false.
	}

	/**
	 * Returns an array of names (as strings) identifying {@link jQuery.sap.PseudoEvents} that are fulfilled by this very Event instance.
	 *
	 * @returns {String[]} Array of names identifying {@link jQuery.sap.PseudoEvents} that are fulfilled by this very Event instance.
	 * @public
	 */
	jQuery.Event.prototype.getPseudoTypes = function() {
		var aPseudoTypes = [];

		if (jQuery.inArray(this.type, PSEUDO_EVENTS_BASIC_TYPES) != -1) {
			var aPseudoEvents = PSEUDO_EVENTS;
			var ilength = aPseudoEvents.length;
			var oPseudo = null;

			for (var i = 0; i < ilength; i++) {
				oPseudo = jQuery.sap.PseudoEvents[aPseudoEvents[i]];
				if (oPseudo.aTypes
						&& jQuery.inArray(this.type, oPseudo.aTypes) > -1
						&& oPseudo.fnCheck
						&& oPseudo.fnCheck(this)) {
					aPseudoTypes.push(oPseudo.sName);
				}
			}
		}

		this.getPseudoTypes = function(){
			return aPseudoTypes.slice();
		};

		return aPseudoTypes.slice();
	};

	/**
	 * Checks whether this instance of {@link jQuery.Event} is of the given <code>sType</code> pseudo type.
	 *
	 * @param {string} sType The name of the pseudo type this event should be checked for.
	 * @returns {boolean} <code>true</code> if this instance of jQuery.Event is of the given sType, <code>false</code> otherwise.
	 * @public
	 */
	jQuery.Event.prototype.isPseudoType = function(sType) {
		var aPseudoTypes = this.getPseudoTypes();

		if (sType) {
			return jQuery.inArray(sType, aPseudoTypes) > -1;
		} else {
			return aPseudoTypes.length > 0;
		}
	};

	/**
	 * Binds all events for listening with the given callback function.
	 *
	 * @param {function} fnCallback Callback function
	 * @public
	 */
	jQuery.sap.bindAnyEvent = function bindAnyEvent(fnCallback) {
		if (fnCallback) {
			jQuery(document).bind(jQuery.sap.ControlEvents.join(" "), fnCallback);
		}
	};

	/**
	 * Unbinds all events for listening with the given callback function.
	 *
	 * @param {function} fnCallback Callback function
	 * @public
	 */
	jQuery.sap.unbindAnyEvent = function unbindAnyEvent(fnCallback) {
		if (fnCallback) {
			jQuery(document).unbind(jQuery.sap.ControlEvents.join(" "), fnCallback);
		}
	};

	/**
	 * Checks a given mouseover or mouseout event whether it is
	 * equivalent to a mouseenter or mousleave event regarding the given DOM reference.
	 *
	 * @param {jQuery.Event} oEvent
	 * @param {element} oDomRef
	 * @public
	 */
	jQuery.sap.checkMouseEnterOrLeave = function checkMouseEnterOrLeave(oEvent, oDomRef) {
		if (oEvent.type != "mouseover" && oEvent.type != "mouseout") {
			return false;
		}

		var isMouseEnterLeave = false;
		var element = oDomRef;
		var parent = oEvent.relatedTarget;

		try {
			while ( parent && parent !== element ) {
				parent = parent.parentNode;
			}

			if ( parent !== element ) {
				isMouseEnterLeave = true;
			}
		} catch (e) {
			//escape eslint check for empty block
		}

		return isMouseEnterLeave;
	};

	/*
	 * Detect whether the pressed key is:
	 * SHIFT, CONTROL, ALT, BREAK, CAPS_LOCK,
	 * PAGE_UP, PAGE_DOWN, END, HOME, ARROW_LEFT, ARROW_UP, ARROW_RIGHT, ARROW_DOWN,
	 * PRINT, INSERT, DELETE, F1, F2, F3, F4, F5, F6, F7, F8, F9, F10, F11, F12,
	 * BACKSPACE, TAB, ENTER, ESCAPE
	 *
	 * @param {jQuery.Event} oEvent The event object of the <code>keydown</code>, <code>keyup</code> or <code>keypress</code> events.
	 * @static
	 * @returns {boolean}
	 * @protected
	 * @since 1.24.0
	 * @experimental Since 1.24.0 Implementation might change.
	 */
	jQuery.sap.isSpecialKey = function(oEvent) {
		var mKeyCodes = jQuery.sap.KeyCodes,
			iKeyCode = oEvent.which,	// jQuery oEvent.which normalizes oEvent.keyCode and oEvent.charCode
			bSpecialKey = 	isModifierKey(oEvent) ||
							isArrowKey(oEvent) ||
							(iKeyCode >= 33 && iKeyCode <= 36) ||	// PAGE_UP, PAGE_DOWN, END, HOME
							(iKeyCode >= 44 && iKeyCode <= 46) ||	// PRINT, INSERT, DELETE
							(iKeyCode >= 112 && iKeyCode <= 123) ||	// F1, F2, F3, F4, F5, F6, F7, F8, F9, F10, F11, F12
							(iKeyCode === mKeyCodes.BREAK) ||
							(iKeyCode === mKeyCodes.BACKSPACE) ||
							(iKeyCode === mKeyCodes.TAB) ||
							(iKeyCode === mKeyCodes.ENTER) ||
							(iKeyCode === mKeyCodes.ESCAPE) ||
							(iKeyCode === mKeyCodes.SCROLL_LOCK);

		switch (oEvent.type) {
			case "keydown":
			case "keyup":
				return bSpecialKey;

			// note: the keypress event should be fired only when a character key is pressed,
			// unfortunately some browsers fire the keypress event for other keys. e.g.:
			//
			// Firefox fire it for:
			// BREAK, ARROW_LEFT, ARROW_RIGHT, INSERT, DELETE,
			// F1, F2, F3, F5, F6, F7, F8, F9, F10, F11, F12
			// BACKSPACE, ESCAPE
			//
			// Internet Explorer fire it for:
			// ESCAPE
			case "keypress":

				// note: in Firefox, almost all noncharacter keys that fire the keypress event have a key code of 0,
				// with the exception of BACKSPACE (key code of 8).
				// note: in IE the ESCAPE key is also fired for the the keypress event
				return (iKeyCode === 0 ||	// in Firefox, almost all noncharacter keys that fire the keypress event have a key code of 0, with the exception of BACKSPACE (key code of 8)
						iKeyCode === mKeyCodes.BACKSPACE ||
						iKeyCode === mKeyCodes.ESCAPE ||
						iKeyCode === mKeyCodes.ENTER /* all browsers */) || false;

			default:
				return false;
		}
	};

	/**
	 * Detect whether the pressed key is a modifier.
	 *
	 * Modifier keys are considered:
	 * SHIFT, CONTROL, ALT, CAPS_LOCK, NUM_LOCK
	 * These keys don't send characters, but modify the characters sent by other keys.
	 *
	 * @param {jQuery.Event} oEvent The event object of the <code>keydown</code>, <code>keyup</code> or <code>keypress</code> events.
	 * @static
	 * @returns {boolean}
	 * @since 1.24.0
	 */
	function isModifierKey(oEvent) {
		var mKeyCodes = jQuery.sap.KeyCodes,
			iKeyCode = oEvent.which;	// jQuery oEvent.which normalizes oEvent.keyCode and oEvent.charCode

		return (iKeyCode === mKeyCodes.SHIFT) ||
				(iKeyCode === mKeyCodes.CONTROL) ||
				(iKeyCode === mKeyCodes.ALT) ||
				(iKeyCode === mKeyCodes.CAPS_LOCK) ||
				(iKeyCode === mKeyCodes.NUM_LOCK);
	}

	/**
	 * Detect whether the pressed key is a navigation key.
	 *
	 * Navigation keys are considered:
	 * ARROW_LEFT, ARROW_UP, ARROW_RIGHT, ARROW_DOWN
	 *
	 * @param {jQuery.Event} oEvent The event object of the <code>keydown</code>, <code>keyup</code> or <code>keypress</code> events.
	 * @static
	 * @returns {boolean}
	 * @since 1.24.0
	 */
	function isArrowKey(oEvent) {
		var iKeyCode = oEvent.which,	// jQuery oEvent.which normalizes oEvent.keyCode and oEvent.charCode
			bArrowKey = (iKeyCode >= 37 && iKeyCode <= 40);	// ARROW_LEFT, ARROW_UP, ARROW_RIGHT, ARROW_DOWN

		switch (oEvent.type) {
			case "keydown":
			case "keyup":
				return bArrowKey;

			// note: the keypress event should be fired only when a character key is pressed,
			// unfortunately some browsers fire the keypress event for other keys. e.g.:
			//
			// Firefox fire it for:
			// ARROW_LEFT, ARROW_RIGHT
			case "keypress":

				// in Firefox, almost all noncharacter keys that fire the keypress event have a key code of 0
				return iKeyCode === 0;

			default:
				return false;
		}
	}

	/**
	 * Constructor for a jQuery.Event object.<br/>
	 * @see "http://www.jquery.com" and "http://api.jquery.com/category/events/event-object/".
	 *
	 * @class Check the jQuery.Event class documentation available under "http://www.jquery.com"<br/>
	 * and "http://api.jquery.com/category/events/event-object/" for details.
	 *
	 * @name jQuery.Event
	 * @public
	 */

	/**
	 * Returns OffsetX of Event. In jQuery there is a bug. In IE the value is in offsetX, in FF in layerX
	 *
	 * @returns {int} offsetX
	 * @public
	 */
	jQuery.Event.prototype.getOffsetX = function() {

		if (this.type == 'click') {
			if (this.offsetX) {
				return this.offsetX;
			}
			if (this.layerX) {
				return this.layerX;
			}
			if (this.originalEvent.layerX) {
				return this.originalEvent.layerX;
			}
		}
		// nothing defined -> offset = 0
		return 0;
	};

	/**
	 * Returns OffsetY of Event. In jQuery there is a bug. in IE the value is in offsetY, in FF in layerY.
	 *
	 * @returns {int} offsetY
	 * @public
	 */
	jQuery.Event.prototype.getOffsetY = function() {

		if (this.type == 'click') {
			if (this.offsetY) {
				return this.offsetY;
			}
			if (this.layerY) {
				return this.layerY;
			}
			if (this.originalEvent.layerY) {
				return this.originalEvent.layerY;
			}
		}
		// nothing defined -> offset = 0
		return 0;
	};

	// we still call the original stopImmediatePropagation
	var fnStopImmediatePropagation = jQuery.Event.prototype.stopImmediatePropagation;
	
	/**
	 * PRIVATE EXTENSION: allows to immediately stop the propagation of events in
	 * the event handler execution - means that "before" delegates can stop the
	 * propagation of the event to other delegates or the element and so on.
	 *
	 * @see sap.ui.core.Element.prototype._callEventHandles
	 * @param {boolean} bStopDelegate
	 */
	jQuery.Event.prototype.stopImmediatePropagation = function(bStopHandlers) {

		// execute the original function
		fnStopImmediatePropagation.apply(this, arguments);

		// only set the stop handlers flag if it is wished...
		if (bStopHandlers) {
			this._bIsStopHandlers = true;
		}
	};

	/**
	 * PRIVATE EXTENSION: check if the handler propagation has been stopped.
	 *
	 * @see sap.ui.core.Element.prototype._callEventHandles
	 */
	jQuery.Event.prototype.isImmediateHandlerPropagationStopped = function() {
		return !!this._bIsStopHandlers;
	};

	/**
	 * Mark the event object for components that needs to know if the event was handled by a child component.
	 * PRIVATE EXTENSION
	 *
	 * @param {string} [sKey="handledByControl"]
	 * @param {string} [vValue=true]
	 */
	jQuery.Event.prototype.setMark = function(sKey, vValue) {
		sKey = sKey || "handledByControl";
		vValue = arguments.length < 2 ? true : vValue;
		(this.originalEvent || this)["_sapui_" + sKey] = vValue;
	};

	/**
	 * Mark the event object for components that needs to know if the event was handled by a child component.
	 * PRIVATE EXTENSION
	 *
	 * @see jQuery.Event.prototype.setMark
	 * @param {string} [sKey="handledByControl"]
	 */
	jQuery.Event.prototype.setMarked = jQuery.Event.prototype.setMark;

	/**
	 * Check whether the event object is marked by the child component or not.
	 * PRIVATE EXTENSION
	 *
	 * @param {string} [sKey="handledByControl"]
	 * @returns {boolean}
	 */
	jQuery.Event.prototype.isMarked = function(sKey) {
		sKey = sKey || "handledByControl";
		return !!(this.originalEvent || this)["_sapui_" + sKey];
	};

	
	/* ************** F6 Fast Navigation ************** */
	
	// CustomData attribute name for fast navigation groups (in DOM additional prefix "data-" is needed)
	jQuery.sap._FASTNAVIGATIONKEY = "sap-ui-fastnavgroup";
	
	// Returns the nearest parent DomRef of the given DomRef with attribute data-sap-ui-customfastnavgroup="true". 
	function findClosestCustomGroup(oRef) {
		var $Group = jQuery(oRef).closest('[data-sap-ui-customfastnavgroup="true"]');
		return $Group[0];
	}
	
	// Returns the nearest parent DomRef of the given DomRef with attribute data-sap-ui-fastnavgroup="true" or
	// (if available) the nearest parent with attribute data-sap-ui-customfastnavgroup="true". 
	function findClosestGroup(oRef) {
		var oGroup = findClosestCustomGroup(oRef);
		if (oGroup) {
			return oGroup;
		}
		
		var $Group = jQuery(oRef).closest('[data-' + jQuery.sap._FASTNAVIGATIONKEY + '="true"]');
		return $Group[0];
	}
	
	// Returns a jQuery object which contains all next/previous (bNext) tabbable DOM elements of the given starting point (oRef) within the given scopes (DOMRefs)
	function findTabbables(oRef, aScopes, bNext) {
		var $Ref = jQuery(oRef),
			$All, $Tabbables;
		
		if (bNext) {
			$All = jQuery.merge($Ref.find("*"), jQuery.merge($Ref.nextAll(), $Ref.parents().nextAll()));
			$Tabbables = $All.find(':sapTabbable').addBack(':sapTabbable');
		} else {
			$All = jQuery.merge($Ref.prevAll(), $Ref.parents().prevAll());
			$Tabbables = jQuery.merge($Ref.parents(':sapTabbable'), $All.find(':sapTabbable').addBack(':sapTabbable'));
		} 

		var $Tabbables = jQuery.unique($Tabbables);
		return $Tabbables.filter(function(){
			return isContained(aScopes, this);
		});
	}
	
	// Filters all elements in the given jQuery object which are in the static UIArea and which are not in the given scopes.
	function filterStaticAreaContent($Refs, aScopes){
		var oStaticArea = jQuery.sap.domById("sap-ui-static");
		if (!oStaticArea) {
			return $Refs;
		}
		
		var aScopesInStaticArea = [];
		for (var i = 0; i < aScopes.length; i++) {
			if (jQuery.contains(oStaticArea, aScopes[i])) {
				aScopesInStaticArea.push(aScopes[i]);
			}
		}
		
		return $Refs.filter(function(){
			if (aScopesInStaticArea.length && isContained(aScopesInStaticArea, this)) {
				return true;
			}
			return !jQuery.contains(oStaticArea, this);
		});
	}
	
	// Checks whether the given DomRef is contained or equals (in) one of the given container
	function isContained(aContainers, oRef) {
		for (var i = 0; i < aContainers.length; i++) {
			if (aContainers[i] === oRef || jQuery.contains(aContainers[i], oRef)) {
				return true;
			}
		}
		return false;
	}
	
	//see navigate() (bForward = false)
	function findFirstTabbableOfPreviousGroup($FirstTabbableInScope, $Tabbables, oSouceGroup, bFindPreviousGroup) {
		var oGroup, $Target;
		
		for (var i = $Tabbables.length - 1; i >= 0; i--) {
			oGroup = findClosestGroup($Tabbables[i]);
			if (oGroup != oSouceGroup) {
				if (bFindPreviousGroup) {
					//First find last tabbable of previous group and remember this new group (named "X" in the following comments)
					oSouceGroup = oGroup;
					bFindPreviousGroup = false;
				} else {
					//Then starting from group X and try to find again the last tabbable of previous group (named "Y")
					//-> Jump one tabbable back to get the first tabbable of X
					$Target = jQuery($Tabbables[i + 1]);
					break;
				}
			}
		}
		
		if (!$Target && !bFindPreviousGroup) {
			//Group X found but not group Y -> X is the first group -> Focus the first tabbable scope (e.g. page) element
			$Target = $FirstTabbableInScope;
		}
		
		return $Target;
	}
	
	// Finds the next/previous (bForward) element in the F6 chain starting from the given source element within the given scopes and focus it
	function navigate(oSource, aScopes, bForward) {
		if (!aScopes || aScopes.length == 0) {
			aScopes = [document];
		}
		
		if (!isContained(aScopes, oSource)) {
			return;
		}
		
		var oSouceGroup = findClosestGroup(oSource),
			$AllTabbables = filterStaticAreaContent(jQuery(aScopes).find(':sapTabbable').addBack(':sapTabbable'), aScopes),
			$FirstTabbableInScope = $AllTabbables.first(),
			$Tabbables = filterStaticAreaContent(findTabbables(oSource, aScopes, bForward), aScopes),
			oGroup, $Target;
		
		if (bForward) {
			//Find the first next tabbable within another group
			for (var i = 0; i < $Tabbables.length; i++) {
				oGroup = findClosestGroup($Tabbables[i]);
				if (oGroup != oSouceGroup) {
					$Target = jQuery($Tabbables[i]);
					break;
				}
			}

			//If not found, end of scope (e.g. page) is reached -> Focus the first tabbable scope (e.g. page) element
			if (!$Target || !$Target.length) {
				$Target = $FirstTabbableInScope;
			}
		} else {
			$Target = findFirstTabbableOfPreviousGroup($FirstTabbableInScope, $Tabbables, oSouceGroup, true);
			
			if (!$Target || !$Target.length) {
				//No other group found before -> find first element of last group in the scope (e.g. page)
				
				if ($AllTabbables.length == 1) {
					//Only one tabbable element -> use it
					$Target = jQuery($AllTabbables[0]);
				} else if ($AllTabbables.length > 1) {
					oSouceGroup = findClosestGroup($AllTabbables.eq(-1));
					oGroup = findClosestGroup($AllTabbables.eq(-2));
					if (oSouceGroup != oGroup) {
						//Last tabbable scope (e.g. page) element and the previous tabbable scope (e.g. page) element have different groups -> last tabbable scope (e.g. page) element is first tabbable element of its group
						$Target = $AllTabbables.eq(-1);
					} else {
						//Take last tabbable scope (e.g. page) element as reference and start search for first tabbable of the same group
						$Target = findFirstTabbableOfPreviousGroup($FirstTabbableInScope, $AllTabbables, oSouceGroup, false);
					}
				}
			}
		}
		
		if ($Target && $Target.length) {
			var oTarget = $Target[0],
				oEvent = null,
				oCustomGroup = findClosestCustomGroup(oTarget);
			
			if (oCustomGroup && oCustomGroup.id) {
				var oControl = sap.ui.getCore().byId(oCustomGroup.id);
				if (oControl) {
					oEvent = jQuery.Event("BeforeFastNavigationFocus");
					oEvent.target = oTarget;
					oEvent.source = oSource;
					oEvent.forward = bForward;
					oControl._handleEvent(oEvent);
				}
			}
			
			if (!oEvent || !oEvent.isDefaultPrevented()) {
				jQuery.sap.focus(oTarget);
			}
		}
	}
	
	/**
	 * Central handler for F6 key event. Based on the current target and the given event the next element in the F6 chain is focused.
	 * 
	 * This handler might be also called manually. In this case the central handler is deactivated for the given event.
	 * 
	 * If the event is not a keydown event, it does not represent the F6 key, the default behavior is prevented,
	 * the handling is explicitly skipped (<code>oSettings.skip</code>) or the target (<code>oSettings.target</code>) is not contained
	 * in the used scopes (<code>oSettings.scope</code>), the event is skipped.
	 *
	 * @param {jQuery.Event} oEvent a <code>keydown</code> event object.
	 * @param {object} [oSettings] further options in case the handler is called manually.
	 * @param {boolean} [oSettings.skip=false] whether the event should be ignored by the central handler (see above)
	 * @param {Element} [oSettings.target=document.activeElement] the DOMNode which should be used as starting point to find the next DOMNode in the F6 chain.
	 * @param {Element[]} [oSettings.scope=[document]] the DOMNodes(s) which are used for the F6 chain search
	 * @static
	 * @private
	 * @since 1.25.0
	 */
	jQuery.sap.handleF6GroupNavigation = function(oEvent, oSettings) {
		if (oEvent.type != "keydown" 
				|| oEvent.keyCode != jQuery.sap.KeyCodes.F6 
				|| oEvent.isMarked("sapui5_handledF6GroupNavigation")
				|| oEvent.isMarked()
				|| oEvent.isDefaultPrevented()) {
			return;
		}
		
		oEvent.setMark("sapui5_handledF6GroupNavigation");
		oEvent.setMarked();
		oEvent.preventDefault();
		
		if (oSettings && oSettings.skip) {
			return;
		}
		
		var oTarget = oSettings && oSettings.target ? oSettings.target : document.activeElement,
			aScopes = null;
		
		if (oSettings && oSettings.scope) {
			aScopes = jQuery.isArray(oSettings.scope) ? oSettings.scope : [oSettings.scope];
		}
		
		navigate(oTarget, aScopes, !oEvent.shiftKey);
	};
	
	jQuery(function() {
		jQuery(document).on("keydown", function(oEvent) {
			jQuery.sap.handleF6GroupNavigation(oEvent, null);
		});
	});

	/**
	 * Whether the current browser fires mouse events after touch events with long delay (~300ms)
	 *
	 * Mobile browsers fire mouse events after touch events with a delay (~300ms)
	 * Some modern mobile browsers already removed the delay under some condition. Those browsers are:
	 *  1. iOS Safari in iOS 8.
	 *  2. Chrome on Android from version 32 (exclude the Samsung stock browser which also uses Chrome kernel)
	 *
	 * @private
	 * @since 1.30.0
	 */
	jQuery.sap.isMouseEventDelayed =
		(Device.browser.mobile
			&& !(
				(Device.os.ios && Device.os.version >= 8 && Device.browser.safari)
				|| (Device.browser.chrome && !/SAMSUNG/.test(navigator.userAgent) && Device.browser.version >= 32)
			)
		);


	/* ************************************************ */


	return jQuery;

});
/*!
 * UI development toolkit for HTML5 (OpenUI5)
 * (c) Copyright 2009-2015 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */

/*
 * Provides constants for key codes. Useful in the implementation of keypress/keydown event handlers.
 */
sap.ui.predefine('jquery.sap.keycodes',['jquery.sap.global'],
	function(jQuery) {
	"use strict";


	/**
	 * Enumeration of key codes.
	 *
	 * @namespace
	 * @public
	 * @since 0.9.0
	 */
	jQuery.sap.KeyCodes = {
	
		/**
		 * @type number
		 * @public
		 */
		BACKSPACE : 8,
	
		/**
		 * @type number
		 * @public
		 */
		TAB : 9,
	
		/**
		 * @type number
		 * @public
		 */
		ENTER : 13,
	
		/**
		 * @type number
		 * @public
		 */
		SHIFT : 16,
	
		/**
		 * @type number
		 * @public
		 */
		CONTROL : 17,
	
		/**
		 * @type number
		 * @public
		 */
		ALT : 18,
	
		/**
		 * @type number
		 * @public
		 */
		BREAK : 19,
	
		/**
		 * @type number
		 * @public
		 */
		CAPS_LOCK : 20,
	
		/**
		 * @type number
		 * @public
		 */
		ESCAPE : 27,
	
		/**
		 * @type number
		 * @public
		 */
		SPACE : 32,
	
		/**
		 * @type number
		 * @public
		 */
		PAGE_UP : 33,
	
		/**
		 * @type number
		 * @public
		 */
		PAGE_DOWN : 34,
	
		/**
		 * @type number
		 * @public
		 */
		END : 35,
	
		/**
		 * @type number
		 * @public
		 */
		HOME : 36,
	
		/**
		 * @type number
		 * @public
		 */
		ARROW_LEFT : 37,
	
		/**
		 * @type number
		 * @public
		 */
		ARROW_UP : 38,
	
		/**
		 * @type number
		 * @public
		 */
		ARROW_RIGHT : 39,
	
		/**
		 * @type number
		 * @public
		 */
		ARROW_DOWN : 40,
	
		/**
		 * @type number
		 * @public
		 */
		PRINT : 44,
	
		/**
		 * @type number
		 * @public
		 */
		INSERT : 45,
	
		/**
		 * @type number
		 * @public
		 */
		DELETE : 46,
	
		/**
		 * @type number
		 * @public
		 */
		DIGIT_0 : 48,
	
		/**
		 * @type number
		 * @public
		 */
		DIGIT_1 : 49,
	
		/**
		 * @type number
		 * @public
		 */
		DIGIT_2 : 50,
	
		/**
		 * @type number
		 * @public
		 */
		DIGIT_3 : 51,
	
		/**
		 * @type number
		 * @public
		 */
		DIGIT_4 : 52,
	
		/**
		 * @type number
		 * @public
		 */
		DIGIT_5 : 53,
	
		/**
		 * @type number
		 * @public
		 */
		DIGIT_6 : 54,
	
		/**
		 * @type number
		 * @public
		 */
		DIGIT_7 : 55,
	
		/**
		 * @type number
		 * @public
		 */
		DIGIT_8 : 56,
	
		/**
		 * @type number
		 * @public
		 */
		DIGIT_9 : 57,
	
		/**
		 * @type number
		 * @public
		 */
		A : 65,
	
		/**
		 * @type number
		 * @public
		 */
		B : 66,
	
		/**
		 * @type number
		 * @public
		 */
		C : 67,
	
		/**
		 * @type number
		 * @public
		 */
		D : 68,
	
		/**
		 * @type number
		 * @public
		 */
		E : 69,
	
		/**
		 * @type number
		 * @public
		 */
		F : 70,
	
		/**
		 * @type number
		 * @public
		 */
		G : 71,
	
		/**
		 * @type number
		 * @public
		 */
		H : 72,
	
		/**
		 * @type number
		 * @public
		 */
		I : 73,
	
		/**
		 * @type number
		 * @public
		 */
		J : 74,
	
		/**
		 * @type number
		 * @public
		 */
		K : 75,
	
		/**
		 * @type number
		 * @public
		 */
		L : 76,
	
		/**
		 * @type number
		 * @public
		 */
		M : 77,
	
		/**
		 * @type number
		 * @public
		 */
		N : 78,
	
		/**
		 * @type number
		 * @public
		 */
		O : 79,
	
		/**
		 * @type number
		 * @public
		 */
		P : 80,
	
		/**
		 * @type number
		 * @public
		 */
		Q : 81,
	
		/**
		 * @type number
		 * @public
		 */
		R : 82,
	
		/**
		 * @type number
		 * @public
		 */
		S : 83,
	
		/**
		 * @type number
		 * @public
		 */
		T : 84,
	
		/**
		 * @type number
		 * @public
		 */
		U : 85,
	
		/**
		 * @type number
		 * @public
		 */
		V : 86,
	
		/**
		 * @type number
		 * @public
		 */
		W : 87,
	
		/**
		 * @type number
		 * @public
		 */
		X : 88,
	
		/**
		 * @type number
		 * @public
		 */
		Y : 89,
	
		/**
		 * @type number
		 * @public
		 */
		Z : 90,
	
		/**
		 * @type number
		 * @public
		 */
		WINDOWS : 91,
	
		/**
		 * @type number
		 * @public
		 */
		CONTEXT_MENU : 93,
	
		/**
		 * @type number
		 * @public
		 */
		TURN_OFF : 94,
	
		/**
		 * @type number
		 * @public
		 */
		SLEEP : 95,
	
		/**
		 * @type number
		 * @public
		 */
		NUMPAD_0 : 96,
	
		/**
		 * @type number
		 * @public
		 */
		NUMPAD_1 : 97,
	
		/**
		 * @type number
		 * @public
		 */
		NUMPAD_2 : 98,
	
		/**
		 * @type number
		 * @public
		 */
		NUMPAD_3 : 99,
	
		/**
		 * @type number
		 * @public
		 */
		NUMPAD_4 : 100,
	
		/**
		 * @type number
		 * @public
		 */
		NUMPAD_5 : 101,
	
		/**
		 * @type number
		 * @public
		 */
		NUMPAD_6 : 102,
	
		/**
		 * @type number
		 * @public
		 */
		NUMPAD_7 : 103,
	
		/**
		 * @type number
		 * @public
		 */
		NUMPAD_8 : 104,
	
		/**
		 * @type number
		 * @public
		 */
		NUMPAD_9 : 105,
	
		/**
		 * @type number
		 * @public
		 */
		NUMPAD_ASTERISK : 106,
	
		/**
		 * @type number
		 * @public
		 */
		NUMPAD_PLUS : 107,
	
		/**
		 * @type number
		 * @public
		 */
		NUMPAD_MINUS : 109,
	
		/**
		 * @type number
		 * @public
		 */
		NUMPAD_COMMA : 110,
	
		/**
		 * @type number
		 * @public
		 */
		NUMPAD_SLASH : 111,
	
		/**
		 * @type number
		 * @public
		 */
		F1 : 112,
	
		/**
		 * @type number
		 * @public
		 */
		F2 : 113,
	
		/**
		 * @type number
		 * @public
		 */
		F3 : 114,
	
		/**
		 * @type number
		 * @public
		 */
		F4 : 115,
	
		/**
		 * @type number
		 * @public
		 */
		F5 : 116,
	
		/**
		 * @type number
		 * @public
		 */
		F6 : 117,
	
		/**
		 * @type number
		 * @public
		 */
		F7 : 118,
	
		/**
		 * @type number
		 * @public
		 */
		F8 : 119,
	
		/**
		 * @type number
		 * @public
		 */
		F9 : 120,
	
		/**
		 * @type number
		 * @public
		 */
		F10 : 121,
	
		/**
		 * @type number
		 * @public
		 */
		F11 : 122,
	
		/**
		 * @type number
		 * @public
		 */
		F12 : 123,
	
		/**
		 * @type number
		 * @public
		 */
		NUM_LOCK : 144,
	
		/**
		 * @type number
		 * @public
		 */
		SCROLL_LOCK : 145,
	
		/**
		 * @type number
		 * @public
		 */
		OPEN_BRACKET : 186,
	
		/**
		 * @type number
		 * @public
		 */
		PLUS : 187,
	
		/**
		 * @type number
		 * @public
		 */
		COMMA : 188,
	
		/**
		 * @type number
		 * @public
		 */
		SLASH : 189,
	
		/**
		 * @type number
		 * @public
		 */
		DOT : 190,
	
		/**
		 * @type number
		 * @public
		 */
		PIPE : 191,
	
		/**
		 * @type number
		 * @public
		 */
		SEMICOLON : 192,
	
		/**
		 * @type number
		 * @public
		 */
		MINUS : 219,
	
		/**
		 * @type number
		 * @public
		 */
		GREAT_ACCENT : 220,
	
		/**
		 * @type number
		 * @public
		 */
		EQUALS : 221,
	
		/**
		 * @type number
		 * @public
		 */
		SINGLE_QUOTE : 222,
	
		/**
		 * @type number
		 * @public
		 */
		BACKSLASH : 226
	};

	return jQuery;

});
/*!
 * UI development toolkit for HTML5 (OpenUI5)
 * (c) Copyright 2009-2015 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */

//Provides common helper functions for the mobile version of UI5 
sap.ui.predefine('jquery.sap.mobile',['jquery.sap.global', 'sap/ui/Device', 'jquery.sap.dom', 'jquery.sap.events'],
	function(jQuery, Device/* , jQuerySap1, jQuerySap2 */) {
	"use strict";


	(function($) { // TODO get rid of inner scope function, rename $ to jQuery
		var FAKE_OS_PATTERN = /(?:\?|&)sap-ui-xx-fakeOS=([^&]+)/;
	
		$.sap.simulateMobileOnDesktop = false;
	
		// OS overriding mechanism
		if ((Device.browser.webkit || (Device.browser.msie && Device.browser.version >= 10)) && !jQuery.support.touch) { // on non-touch webkit browsers and IE10 we are interested in overriding
	
			var result = document.location.search.match(FAKE_OS_PATTERN);
			var resultUA = result && result[1] || jQuery.sap.byId("sap-ui-bootstrap").attr("data-sap-ui-xx-fakeOS");
	
			if (resultUA) {
	
				$.sap.simulateMobileOnDesktop = true;
	
				var ua = { // for "ios"/"android"/"blackberry" we have defined fake user-agents; these will affect all other browser/platform detection mechanisms
						ios: "Mozilla/5.0 (iPhone; CPU iPhone OS 5_0_1 like Mac OS X) AppleWebKit/534.48 (KHTML, like Gecko) Version/5.1 Mobile/9A406 Safari/7534.48.3",
						iphone: "Mozilla/5.0 (iPhone; CPU iPhone OS 5_0_1 like Mac OS X) AppleWebKit/534.48 (KHTML, like Gecko) Version/5.1 Mobile/9A406 Safari/7534.48.3",
						ipad: "Mozilla/5.0 (iPad; CPU OS 5_1_1 like Mac OS X) AppleWebKit/534.46 (KHTML, like Gecko) Mobile/9B206",
						android: "Mozilla/5.0 (Linux; U; Android 4.0.3; en-us; GT-I9100 Build/IML74K) AppleWebKit/534.46 (KHTML, like Gecko) Version/4.0 Mobile Safari/534.46",
						android_phone: "Mozilla/5.0 (Linux; U; Android 4.0.3; en-us; GT-I9100 Build/IML74K) AppleWebKit/534.46 (KHTML, like Gecko) Version/4.0 Mobile Safari/534.46",
						android_tablet: "Mozilla/5.0 (Linux; Android 4.1.2; Nexus 7 Build/JZ054K) AppleWebKit/535.19 (KHTML, like Gecko) Chrome/18.0.1025.166 Safari/535.19",
						blackberry: "Mozilla/5.0 (BB10; Touch) AppleWebKit/537.10+ (KHTML, like Gecko) Version/10.0.9.2372 Mobile Safari/537.10+",
						winphone: "Mozilla/5.0 (compatible; MSIE 10.0; Windows Phone 8.0; Trident/6.0; IEMobile/10.0; ARM; Touch; NOKIA; Lumia 920)"
				}[resultUA];
	
				if (ua &&
						(Device.browser.webkit && resultUA !== "winphone" || Device.browser.msie && resultUA === "winphone")) { // only for the working combinations
	
					// code for modifying the real user-agent
					if (Device.browser.safari) {
						var __originalNavigator = window.navigator;
						window.navigator = {};
						/*eslint-disable no-proto */
						window.navigator.__proto__ = __originalNavigator;
						/*eslint-enable no-proto */
						window.navigator.__defineGetter__('userAgent', function(){ return ua; });
					} else { // Chrome, IE10
						Object.defineProperty(navigator, "userAgent", {
							get: function() {
								return ua;
							}
						});
					}
	
					if (Device.browser.webkit) {
	
						// all downstream checks will be fine with the faked user-agent.
						// But now we also need to adjust the wrong upstream settings in jQuery:
						jQuery.browser.msie = jQuery.browser.opera = jQuery.browser.mozilla = false;
						jQuery.browser.webkit = true;
						jQuery.browser.version = "534.46"; // this is not exactly true for all UAs, but there are much bigger shortcomings of this approach than a minor version of the browser, so giving the exact value is not worth the effort
					} // else in IE10 with winphone emulation, jQuery.browser has already the correct information
	
					// update the sap.ui.Device.browser.* information
					Device._update($.sap.simulateMobileOnDesktop);
				}
			}
		}
	
		/**
		 * Holds information about the current operating system
		 * 
		 * @name jQuery.os
		 * @namespace
		 * @deprecated since 1.20: use sap.ui.Device.os
		 * @public
		 */
		$.os = $.extend(/** @lends jQuery.os */ {
	
			/**
			 * The name of the operating system; currently supported are: "ios", "android", "blackberry"
			 * @type {string}
			 * @deprecated since 1.20: use sap.ui.Device.os.name
			 * @public
			 */
			os: Device.os.name,
	
			/**
			 * The version of the operating system as a string (including minor versions)
			 * @type {string}
			 * @deprecated since 1.20: use sap.ui.Device.os.versionStr
			 * @public
			 */
			version: Device.os.versionStr,
	
			/**
			 * The version of the operating system parsed as a float (major and first minor version)
			 * @type {float}
			 * @deprecated since 1.20: use sap.ui.Device.os.version
			 * @public
			 */
			fVersion: Device.os.version
		}, $.os);
	
		$.os[Device.os.name] = true;
	
		/**
		 * Whether the current operating system is Android
		 * @type {boolean}
		 * @public
		 * @deprecated since 1.20: use sap.ui.Device.os.android
		 * @name jQuery.os.android
		 */
	
		/**
		 * Whether the current operating system is BlackBerry
		 * @type {boolean}
		 * @public
		 * @deprecated since 1.20: use sap.ui.Device.os.blackberry
		 * @name jQuery.os.blackberry
		 */
	
		/**
		 * Whether the current operating system is Apple iOS
		 * @type {boolean}
		 * @public
		 * @deprecated since 1.20: use sap.ui.Device.os.ios
		 * @name jQuery.os.ios
		 */
		
		/**
		 * Whether the current operating system is Windows Phone
		 * @type {boolean}
		 * @public
		 * @deprecated since 1.20: use sap.ui.Device.os.winphone
		 * @name jQuery.os.winphone
		 */
	
	
		// feature and state detection
		$.extend( $.support, {
	
			/**
			 * Whether the device has a retina display (window.devicePixelRatio >= 2)
			 * @type {boolean}
			 * @public
			 */
			retina: window.devicePixelRatio >= 2
		});
	
		
		/**
		 * @name jQuery.device
		 * @namespace
		 * @deprecated since 1.20: use the respective functions of sap.ui.Device
		 * @public
		 */
		$.device = $.extend({}, $.device);
	
		/**
		 * Holds information about the current device and its state
		 * 
		 * @name jQuery.device.is
		 * @namespace
		 * @deprecated since 1.20: use the respective functions of sap.ui.Device
		 * @public
		 */
		$.device.is = $.extend( /** @lends jQuery.device.is */ {
	
			/**
			 * Whether the application runs in standalone mode without browser UI (launched from the iOS home screen)
			 * @type {boolean}
			 * @deprecated since 1.20: use window.navigator.standalone
			 * @public
			 */
			standalone: window.navigator.standalone,
	
			/**
			 * Whether the device is in "landscape" orientation (also "true" when the device does not know about the orientation)
			 * @type {boolean}
			 * @deprecated since 1.20: use sap.ui.Device.orientation.landscape
			 * @public
			 */
			landscape: Device.orientation.landscape,
	
			/**
			 * Whether the device is in portrait orientation
			 * @type {boolean}
			 * @deprecated since 1.20: use sap.ui.Device.orientation.portrait
			 * @public
			 */
			portrait: Device.orientation.portrait,
	
			/**
			 * Whether the application runs on an iPhone
			 * @type {boolean}
			 * @deprecated since 1.20: shouldn't do device specific coding; if still needed, use sap.ui.Device.os.ios &amp;&amp; sap.ui.Device.system.phone
			 * @public
			 */
			iphone: Device.os.ios && Device.system.phone,
	
			/**
			 * Whether the application runs on an iPad
			 * @type {boolean}
			 * @deprecated since 1.20: shouldn't do device specific coding; if still needed, use sap.ui.Device.os.ios &amp;&amp; sap.ui.Device.system.tablet
			 * @public
			 */
			ipad: Device.os.ios && Device.system.tablet,
	
			/**
			 * Whether the application runs on an Android phone - based not on screen size but user-agent (so this is not guaranteed to be equal to jQuery.device.is.phone on Android)
			 * https://developers.google.com/chrome/mobile/docs/user-agent
			 * Some device vendors however do not follow this rule
			 * @deprecated since 1.17.0: use sap.ui.Device.system.phone &amp;&amp; sap.ui.Device.os.android  instead
			 * @type {boolean}
			 * @public
			 */
			android_phone: Device.system.phone && Device.os.android,
	
			/**
			 * Whether the application runs on an Android tablet - based not on screen size but user-agent (so this is not guaranteed to be equal to jQuery.device.is.tablet on Android)
			 * https://developers.google.com/chrome/mobile/docs/user-agent
			 * Some device vendors however do not follow this rule
			 * @type {boolean}
			 * @deprecated since 1.17.0: use sap.ui.Device.system.tablet &amp;&amp; sap.ui.Device.os.android  instead
			 * @public
			 */
			android_tablet: Device.system.tablet && Device.os.android,
	
			/**
			 * Whether the running device is a tablet.
			 * If a desktop browser runs in mobile device simulation mode (with URL parameter sap-ui-xx-fakeOS or sap-ui-xx-test-mobile), 
			 * this property will also be set according to the simulated platform.
			 * This property will be false when runs in desktop browser.
			 * @type {boolean}
			 * @deprecated since 1.17.0: use sap.ui.Device.system.tablet instead
			 * @public
			 */
			tablet: Device.system.tablet,
	
			/**
			 * Whether the running device is a phone.
			 * If a desktop browser runs in mobile device simulation mode (with URL parameter sap-ui-xx-fakeOS or sap-ui-xx-test-mobile), 
			 * this property will also be set according to the simulated platform.
			 * This property will be false when runs in desktop browser.
			 * @type {boolean}
			 * @deprecated since 1.17.0: use sap.ui.Device.system.phone instead
			 * @public
			 */
			phone: Device.system.phone,
	
			/**
			 * Whether the running device is a desktop browser.
			 * If a desktop browser runs in mobile device simulation mode (with URL parameter sap-ui-xx-fakeOS or sap-ui-xx-test-mobile), 
			 * this property will be false.
			 * @type {boolean}
			 * @deprecated since 1.17.0: use sap.ui.Device.system.desktop instead
			 * @public
			 */
			desktop: Device.system.desktop
		},$.device.is);

		// Windows Phone specific handling
		if (Device.os.windows_phone) {
			var oTag;
			// Disable grey highlights over tapped areas.
			// This meta tag works since Windows 8.1.
			// Write in-place, otherwise IE ignores it:
			oTag = document.createElement("meta");
			oTag.setAttribute("name", "msapplication-tap-highlight");
			oTag.setAttribute("content", "no");
			document.head.appendChild(oTag);

			// Style for correct viewport size and scale definition.
			// It works correctly since Windows 8.1.
			// Older 8.0 patches return wrong device-width:
			oTag = document.createElement("style");
			oTag.appendChild(document.createTextNode('@-ms-viewport{width:device-width;}'));
			document.head.appendChild(oTag);
		}

		var _bInitMobileTriggered = false;
		/**
		 * Does some basic modifications to the HTML page that make it more suitable for mobile apps.
		 * Only the first call to this method is executed, subsequent calls are ignored. Note that this method is also called by the constructor of toplevel controls like sap.m.App, sap.m.SplitApp and sap.m.Shell.
		 * Exception: if no homeIcon was set, subsequent calls have the chance to set it.
		 *
		 * The "options" parameter configures what exactly should be done.
		 *
		 * It can have the following properties:
		 * <ul>
		 * <li>viewport: whether to set the viewport in a way that disables zooming (default: true)</li>
		 * <li>statusBar: the iOS status bar color, "default", "black" or "black-translucent" (default: "default")</li>
		 * <li>hideBrowser: whether the browser UI should be hidden as far as possible to make the app feel more native (default: true)</li>
		 * <li>preventScroll: whether native scrolling should be disabled in order to prevent the "rubber-band" effect where the whole window is moved (default: true)</li>
		 * <li>preventPhoneNumberDetection: whether Safari Mobile should be prevented from transforming any numbers that look like phone numbers into clickable links; this should be left as "true", otherwise it might break controls because Safari actually changes the DOM. This only affects all page content which is created after initMobile is called.</li>
		 * <li>rootId: the ID of the root element that should be made fullscreen; only used when hideBrowser is set (default: the document.body)</li>
		 * <li>useFullScreenHeight: a boolean that defines whether the height of the html root element should be set to 100%, which is required for other elements to cover the full height (default: true)</li>
		 * <li>homeIcon: deprecated since 1.12, use jQuery.sap.setIcons instead.
		 * </ul>
		 *
		 * @param {object}  [options] configures what exactly should be done
		 * @param {boolean} [options.viewport=true] whether to set the viewport in a way that disables zooming
		 * @param {string}  [options.statusBar='default'] the iOS status bar color, "default", "black" or "black-translucent"
		 * @param {boolean} [options.hideBrowser=true] whether the browser UI should be hidden as far as possible to make the app feel more native
		 * @param {boolean} [options.preventScroll=true] whether native scrolling should be disabled in order to prevent the "rubber-band" effect where the whole window is moved
		 * @param {boolean} [options.preventPhoneNumberDetection=true] whether Safari mobile should be prevented from transforming any numbers that look like phone numbers into clickable links
		 * @param {string}  [options.rootId] the ID of the root element that should be made fullscreen; only used when hideBrowser is set. If not set, the body is used
		 * @param {boolean} [options.useFullScreenHeight=true] whether the height of the html root element should be set to 100%, which is required for other elements to cover the full height
		 * @param {string}  [options.homeIcon=undefined] deprecated since 1.12, use jQuery.sap.setIcons instead.
		 * @param {boolean} [options.homeIconPrecomposed=false] deprecated since 1.12, use jQuery.sap.setIcons instead.
		 * @param {boolean} [options.mobileWebAppCapable=true] whether the Application will be loaded in full screen mode after added to home screen on mobile devices. The default value for this property only enables the full screen mode when runs on iOS device.
		 * 
		 * @name jQuery.sap.initMobile
		 * @function
		 * @public
		 */
		$.sap.initMobile = function(options) {
			var $head = $("head");
	
			if (!_bInitMobileTriggered) { // only one initialization per HTML page
				_bInitMobileTriggered = true;
	
				options = $.extend({}, { // merge in the default values
					viewport: true,
					statusBar: "default",
					hideBrowser: true,
					preventScroll: true,
					preventPhoneNumberDetection: true,
					useFullScreenHeight: true,
					homeIconPrecomposed: false,
					mobileWebAppCapable: "default"
				}, options);
	
				// en-/disable automatic link generation for phone numbers
				if (Device.os.ios && options.preventPhoneNumberDetection) {
					$head.append($('<meta name="format-detection" content="telephone=no">')); // this only works for all DOM created afterwards
				} else if (Device.browser.msie) {
					$head.append($('<meta http-equiv="cleartype" content="on">'));
					$head.append($('<meta name="msapplication-tap-highlight" content="no">'));
				}
	
				var bIsIOS7Safari = Device.os.ios && Device.os.version >= 7 && Device.os.version < 8 && Device.browser.name === "sf";
				// initialize viewport
				if (options.viewport) {
					var sMeta;
					if (bIsIOS7Safari && Device.system.phone) {
						//if the softkeyboard is open in orientation change, we have to do this to solve the zoom bug on the phone -
						//the phone zooms into the view although it shouldn't so these two lines will zoom out again see orientation change below
						//the important part seems to be removing the device width
						sMeta = 'minimal-ui, initial-scale=1.0, maximum-scale=1.0, user-scalable=0';
					} else if (bIsIOS7Safari && Device.system.tablet) {
						//remove the width = device width since it will not work correctly if the webside is embedded in a webview
						sMeta = 'initial-scale=1.0, maximum-scale=1.0, user-scalable=no';
					} else if ($.device.is.iphone && (Math.max(window.screen.height, window.screen.width) === 568)) {
						// iPhone 5
						sMeta = "user-scalable=0, initial-scale=1.0";
					} else if (Device.os.android && Device.os.version < 3) {
						sMeta = "width=device-width, height=device-height, initial-scale=1.0, maximum-scale=1.0, user-scalable=no";
					} else {
						// all other devices
						sMeta = "width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no";
					}
					$head.append($('<meta name="viewport" content="' + sMeta + '">'));
				}
				
				if (options.mobileWebAppCapable === "default") {
					if (Device.os.ios) {
						// keep the old behavior for compatibility
						// enable fullscreen mode only when runs on iOS devices
						$head.append($('<meta name="apple-mobile-web-app-capable" content="yes">')); // since iOS 2.1
					}
				} else {
					$.sap.setMobileWebAppCapable(options.mobileWebAppCapable);
				}
	
				if (Device.os.ios) {
					// set the status bar style on Apple devices
					$head.append($('<meta name="apple-mobile-web-app-status-bar-style" content="' + options.statusBar + '">')); // "default" or "black" or "black-translucent", since iOS 2.1
	
					// splash screen
					//<link rel="apple-touch-startup-image" href="/startup.png">
				}
	
				if (options.preventScroll && !sap.ui.Device.os.blackberry) {
					$(window).bind("touchmove", function sapInitMobileTouchMoveHandle(oEvent) {
						if (!oEvent.isMarked()) {
							oEvent.preventDefault(); // prevent the rubber-band effect
						}
					});
				}
	
				if (options.useFullScreenHeight) {
					$(function() {
						document.documentElement.style.height = "100%"; // set html root tag to 100% height
					});
				}
			}

			if (options && options.homeIcon) {
				var oIcons;

				if (typeof options.homeIcon === "string") {
					oIcons = { phone: options.homeIcon };
				} else {
					oIcons = $.extend({}, options.homeIcon);
				}

				oIcons.precomposed = options.homeIconPrecomposed || oIcons.precomposed;
				oIcons.favicon = options.homeIcon.icon || oIcons.favicon;
				oIcons.icon = undefined;
				$.sap.setIcons(oIcons);
			}
		};

		/**
		 * Sets the bookmark icon for desktop browsers and the icon to be displayed on the home screen of iOS devices after the user does "add to home screen".
		 *
		 * Only call this method once and call it early when the page is loading: browsers behave differently when the favicon is modified while the page is alive.
		 * Some update the displayed icon inside the browser but use an old icon for bookmarks.
		 * When a favicon is given, any other existing favicon in the document will be removed.
		 * When at least one home icon is given, all existing home icons will be removed and new home icon tags for all four resolutions will be created.
		 *
		 * The home icons must be in PNG format and given in different sizes for iPad/iPhone with and without retina display.
		 * The favicon is used in the browser and for desktop shortcuts and should optimally be in ICO format:
		 * PNG does not seem to be supported by Internet Explorer and ICO files can contain different image sizes for different usage locations. E.g. a 16x16px version
		 * is used inside browsers.
		 *
		 * All icons are given in an an object holding icon URLs and other settings. The properties of this object are:
		 * <ul>
		 * <li>phone: a 57x57 pixel version for non-retina iPhones</li>
		 * <li>tablet: a 72x72 pixel version for non-retina iPads</li>
		 * <li>phone@2: a 114x114 pixel version for retina iPhones</li>
		 * <li>tablet@2: a 144x144 pixel version for retina iPads</li>
		 * <li>precomposed: whether the home icons already have some glare effect (otherwise iOS will add it) (default: false)</li>
		 * <li>favicon: the ICO file to be used inside the browser and for desktop shortcuts</li>
		 * </ul>
		 *
		 * One example is:
		 * <pre>
		 * {
		 *    'phone':'phone-icon_57x57.png',
		 *    'phone@2':'phone-retina_117x117.png',
		 *    'tablet':'tablet-icon_72x72.png',
		 *    'tablet@2':'tablet-retina_144x144.png',
		 *    'precomposed':true,
		 *    'favicon':'desktop.ico'
		 * }
		 * </pre>
		 * If one of the sizes is not given, the largest available alternative image will be used instead for this size.
		 * On Android these icons may or may not be used by the device. Apparently chances can be improved by using icons with glare effect, so the "precomposed" property can be set to "true". Some Android devices may also use the favicon for bookmarks instead of the home icons.</li>
		 * 
		 * @param {object} oIcons
		 * @name jQuery.sap.setIcons
		 * @function
		 * @public
		 */
		$.sap.setIcons = function(oIcons) {
	
			if (!oIcons || (typeof oIcons !== "object")) {
				$.sap.log.warning("Call to jQuery.sap.setIcons() has been ignored because there were no icons given or the argument was not an object.");
				return;
			}
	
			var $head = $("head"),
				precomposed = oIcons.precomposed ? "-precomposed" : "",
				getBestFallback = function(res) {
					return oIcons[res] || oIcons['tablet@2'] || oIcons['phone@2'] || oIcons['phone'] || oIcons['tablet']; // fallback logic
				},
				mSizes = {
					"phone": "",
					"tablet": "72x72",
					"phone@2": "114x114",
					"tablet@2": "144x144"
				};
	
			// desktop icon
			if (oIcons["favicon"]) {
	
				// remove any other favicons
				var $fav = $head.find("[rel^=shortcut]"); // cannot search for "shortcut icon"
	
				$fav.each(function(){
					if (this.rel === "shortcut icon") {
						$(this).remove();
					}
				});
	
				// create favicon
				$head.append($('<link rel="shortcut icon" href="' + oIcons["favicon"] + '" />'));
			}
	
			// mobile home screen icons
			if (getBestFallback("phone")) {
	
				// if any home icon is given remove old ones
				$head.find("[rel=apple-touch-icon]").remove();
				$head.find("[rel=apple-touch-icon-precomposed]").remove();
			}
	
			for (var platform in mSizes) {
				oIcons[platform] = oIcons[platform] || getBestFallback(platform);
				if (oIcons[platform]) {
					var size = mSizes[platform];
					$head.append($('<link rel="apple-touch-icon' + precomposed + '" ' + (size ? 'sizes="' + size + '"' : "") + ' href="' + oIcons[platform] + '" />'));
				}
			}
		};

		/**
		 * Sets the "apple-mobile-web-app-capable" and "mobile-web-app-capable" meta information which defines whether the application is loaded
		 * in full screen mode (browser address bar and toolbar are hidden) after the user does "add to home screen" on mobile devices. Currently
		 * this meta tag is only supported by iOS Safari and mobile Chrome from version 31.
		 * 
		 * If the application opens new tabs because of attachments, url and so on, setting this to false will let the user be able to go from the
		 * new tab back to the application tab after the application is added to home screen.
		 * 
		 * Note: this function only has effect when the application runs on iOS Safari and mobile Chrome from version 31.
		 * 
		 * @param {boolean} bValue whether the Application will be loaded in full screen mode after added to home screen from iOS Safari or mobile Chrome from version 31.
		 * @name jQuery.sap.setMobileWebAppCapable
		 * @function
		 * @public
		 */
		$.sap.setMobileWebAppCapable = function(bValue) {
			if (!Device.system.tablet && !Device.system.phone) {
				return;
			}

			var $Head = $("head"),
				aPrefixes = ["", "apple"],
				sNameBase = "mobile-web-app-capable",
				sContent = bValue ? "yes" : "no",
				i, sName, $WebAppMeta;

			for (i = 0 ; i < aPrefixes.length ; i++) {
				sName = aPrefixes[i] ? (aPrefixes[i] + "-" + sNameBase) : sNameBase;
				$WebAppMeta = $Head.children('meta[name="' + sName + '"]');
				if ($WebAppMeta.length) {
					$WebAppMeta.attr("content", sContent);
				} else {
					$Head.append($('<meta name="' + sName + '" content="' + sContent + '">'));
				}
			}
		};
	})(jQuery);
	
	return jQuery;
	
});
/*!
 * UI development toolkit for HTML5 (OpenUI5)
 * (c) Copyright 2009-2015 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */

// Provides access to Java-like properties files
sap.ui.predefine('jquery.sap.properties',['jquery.sap.global', 'jquery.sap.sjax'],
	function(jQuery/* , jQuerySap1 */) {
	"use strict";

	// Javadoc for private inner class "Properties" - this list of comments is intentional!
	/**
	 * @interface  Represents a list of properties (key/value pairs).
	 *
	 * Each key and its corresponding value in the property list is a string.
	 * Values are unicode escaped \ue0012.
	 * Keys are case-sensitive and only alpha-numeric characters with a leading character are allowed.
	 *
	 * Use {@link jQuery.sap.properties} to create an instance of jQuery.sap.util.Properties.
	 *
	 * The getProperty method is used to retrieve a value from the list.
	 * The setProperty method is used to store or change a property in the list.
	 * Additionally, the getKeys method can be used to retrieve an array of all keys that are
	 * currently in the list.
	 *
	 * @author SAP SE
	 * @version 1.32.9
	 * @since 0.9.0
	 * @name jQuery.sap.util.Properties
	 * @public
	 */
	/**
	 * Returns the value of a given key. Optionally, a given default value is returned if the requested key is not in the list.
	 * @param {string} sKey The key of the property
	 * @param {string} [sDefaultValue] Optional, the default value if the requested key is not in the list.
	 * @return {string} The value of a given key. The default value (if given) is returned if the requested key is not in the list.
	 *
	 * @function
	 * @name jQuery.sap.util.Properties.prototype.getProperty
	 */
	/**
	 * Returns an array of all keys in the property list.
	 * @return {array} All keys in the property list.
	 *
	 * @function
	 * @name jQuery.sap.util.Properties.prototype.getKeys
	 */
	/**
	 * Adds or changes a given key to/in the list.
	 * @param {string} sKey The key of the property
	 * @param {string} sValue The value for the key with unicode encoding.
	 *
	 * @function
	 * @name jQuery.sap.util.Properties.prototype.setProperty
	 */
	/**
	 * Creates and returns a clone of the property list.
	 * @return {jQuery.sap.util.Properties} A clone of the property list
	 *
	 * @function
	 * @name jQuery.sap.util.Properties.prototype.clone
	 */

	/*
	 * Implements jQuery.sap.util.Properties
	 */
	var Properties = function() {
		this.mProperties = {};
		this.aKeys = [];
	};

	/*
	 * Implements jQuery.sap.util.Properties.prototype.getProperty
	 */
	Properties.prototype.getProperty = function(sKey, sDefaultValue) {
		var sValue = this.mProperties[sKey];
		if (typeof (sValue) == "string") {
			return sValue;
		} else if (sDefaultValue) {
			return sDefaultValue;
		}
		return null;
	};

	/*
	 * Implements jQuery.sap.util.Properties.prototype.getKeys
	 */
	Properties.prototype.getKeys = function() {
		return this.aKeys;
	};

	/*
	 * Implements jQuery.sap.util.Properties.prototype.setProperty
	 */
	Properties.prototype.setProperty = function(sKey, sValue) {
		if (typeof (sValue) != "string") {
			return;
		}
		if (typeof (this.mProperties[sKey]) != "string") {
			this.aKeys.push(sKey);
		}
		this.mProperties[sKey] = sValue;
	};

	/*
	 * Implements jQuery.sap.util.Properties.prototype.clone
	 */
	Properties.prototype.clone = function() {
		var oClone = new Properties();
		oClone.mProperties = jQuery.extend({}, this.mProperties);
		oClone.aKeys = jQuery.merge([], this.aKeys);
		return oClone;
	};

	/*
	 * Saves the property list to a given URL using a POST request.
	 */
	//sap.ui.resource.Properties.prototype.save = function(sUrl) {
	//	return jQuery.sap.syncPost(sUrl, this.mProperties);
	//};

	/**
	 * RegExp used to split file into lines, also removes leading whitespace.
	 * Note: group must be non-capturing, otherwise the line feeds will be part of the split result.
	 */
	var rLines = /(?:\r\n|\r|\n|^)[ \t\f]*/;

	/**
	 * RegExp that handles escapes, continuation line markers and key/value separators
	 *
	 *              [---unicode escape--] [esc] [cnt] [---key/value separator---]
	 */
	var rEscapes = /(\\u[0-9a-fA-F]{0,4})|(\\.)|(\\$)|([ \t\f]*[ \t\f:=][ \t\f]*)/g;

	/**
	 * Special escape characters as supported by properties format
	 * @see JDK API doc for java.util.Properties
	 */
	var mEscapes = {
		'\\f' : '\f',
		'\\n' : '\n',
		'\\r' : '\r',
		'\\t' : '\t'
	};

	/*
	 * Parses the given text sText and sets the properties
	 * in the properties object oProp accordingly.
	 * @param {string} sText the text to parse
	 * @param oProp the properties object to fill
	 * @private
	 */
	function parse(sText, oProp) {

		var aLines = sText.split(rLines), // split file into lines
			sLine,sKey,sValue,bKey,i,m,iLastIndex;

		oProp.mProperties = {};
		oProp.aKeys = [];

		for (i = 0; i < aLines.length; i++) {
			sLine = aLines[i];
			// ignore empty lines
			if (sLine === "" || sLine.charAt(0) === "#" || sLine.charAt(0) === "!" ) {
				continue;
			}

			rEscapes.lastIndex = iLastIndex = 0;
			sValue = "";
			bKey = true;

			while ( (m = rEscapes.exec(sLine)) !== null ) {
				// handle any raw, unmatched input
				if ( iLastIndex < m.index ) {
					sValue += sLine.slice(iLastIndex, m.index);
				}
				iLastIndex = rEscapes.lastIndex;
				if ( m[1] ) {
					// unicode escape
					if ( m[1].length !== 6 ) {
						throw new Error("Incomplete Unicode Escape '" + m[1] + "'");
					}
					sValue += String.fromCharCode(parseInt(m[1].slice(2), 16));
				} else if ( m[2] ) {
					// special or simple escape
					sValue += mEscapes[m[2]] || m[2].slice(1);
				} else if ( m[3] ) {
					// continuation line marker
					sLine = aLines[++i];
					rEscapes.lastIndex = iLastIndex = 0;
				} else if ( m[4] ) {
					// key/value separator
					if ( bKey ) {
						bKey = false;
						sKey = sValue;
						sValue = "";
					} else {
						sValue += m[4];
					}
				}
			}
			if ( iLastIndex < sLine.length ) {
				sValue += sLine.slice(iLastIndex);
			}
			if ( bKey ) {
				sKey = sValue;
				sValue = "";
			}
			oProp.aKeys.push(sKey);
			oProp.mProperties[sKey] = sValue;
		}

		// remove duplicates from keyset (sideeffect:sort)
		jQuery.sap.unique(oProp.aKeys);
	}

	/**
	 * Creates and returns a new instance of {@link jQuery.sap.util.Properties}.
	 *
	 * If option 'url' is passed, immediately a load request for the given target is triggered.
	 * A property file that is loaded can contain comments with a leading ! or #.
	 * The loaded property list does not contain any comments.
	 *
	 * <b>Example for loading a property file:</b>
	 * <pre>
	 *  jQuery.sap.properties({url : "../myProperty.properties"});
	 * </pre>
	 *
	 * <b>Example for creating an empty properties instance:</b>
	 * <pre>
	 *  jQuery.sap.properties();
	 * </pre>
	 *
	 * <b>Examples for getting and setting properties:</b>
	 * <pre>
	 *	var oProperties = jQuery.sap.properties();
	 *	oProperties.setProperty("KEY_1","Test Key");
	 *	var sValue1 = oProperties.getProperty("KEY_1");
	 *	var sValue2 = oProperties.getProperty("KEY_2","Default");
	 * </pre>
	 *
	 * @public
	 * @param {object} [mParams] Parameters used to initialize the property list
	 * @param {string} [mParams.url] The URL to the .properties file which should be loaded.
	 * @param {boolean} [mParams.async] Whether the .properties file which should be loaded asynchronously (Default: <code>false</code>)
	 * @param {object} [mParams.headers] A map of additional header key/value pairs to send along with the request (see headers option of jQuery.ajax).
	 * @return {jQuery.sap.util.Properties|Promise} A new property list instance (synchronous case). In case of asynchronous loading an ECMA Script 6 Promise is returned.
	 * @SecSink {0|PATH} Parameter is used for future HTTP requests
	 */
	jQuery.sap.properties = function properties(mParams) {
		mParams = jQuery.extend({url: undefined, headers: {}}, mParams);

		var bAsync = !!mParams.async,
			oProp = new Properties();


		function _parse(sText){
			if (typeof (sText) == "string") {
				parse(sText, oProp);
			}
		}

		function _load(){
			var oRes;

			if (typeof (mParams.url) == "string") {
				oRes = jQuery.sap.loadResource({
					url: mParams.url,
					dataType: 'text',
					headers: mParams.headers,
					failOnError: false,
					async: bAsync
				});
			}

			return oRes;
		}

		if (bAsync) {
			return new window.Promise(function(resolve, reject){
				var oRes = _load();
				if (!oRes) {
					resolve(oProp);
					return;
				}

				oRes.then(function(oVal){
					try {
						_parse(oVal);
						resolve(oProp);
					} catch (e) {
						reject(e);
					}
				}, function(oVal){
					reject(oVal instanceof Error ? oVal : new Error("Problem during loading of property file '" + mParams.url + "': " + oVal));
				});
			});
		} else {
			_parse(_load());
			return oProp;
		}
	};

	return jQuery;

});
/*!
 * UI development toolkit for HTML5 (OpenUI5)
 * (c) Copyright 2009-2015 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */

// Provides access to Java-like resource bundles in properties file format
sap.ui.predefine('jquery.sap.resources',['jquery.sap.global', 'jquery.sap.properties', 'jquery.sap.strings'],
	function(jQuery/* , jQuerySap1, jQuerySap2 */) {
	"use strict";

	/*global Promise*/

	// Javadoc for private inner class "Bundle" - this list of comments is intentional!
	/**
	 * @interface  Contains locale-specific texts.
	 *
	 * If you need a locale-specific text within your application, you can use the
	 * resource bundle to load the locale-specific file from the server and access
	 * the texts of it.
	 *
	 * Use {@link jQuery.sap.resources} to create an instance of jQuery.sap.util.ResourceBundle.
	 * There you have to specify the URL to the base .properties file of a bundle
	 * (.properties without any locale information, e.g. "mybundle.properties"), and optionally
	 * a locale. The locale is defined as a string of the language and an optional country code
	 * separated by underscore (e.g. "en_GB" or "fr"). If no locale is passed, the default
	 * locale is "en" if the SAPUI5 framework is not available. Otherwise the default locale is taken from
	 * the SAPUI5 configuration.
	 *
	 * With the getText() method of the resource bundle, a locale-specific string value
	 * for a given key will be returned.
	 *
	 * With the given locale, the ResourceBundle requests the locale-specific properties file
	 * (e.g. "mybundle_fr_FR.properties"). If no file is found for the requested locale or if the file
	 * does not contain a text for the given key, a sequence of fall back locales is tried one by one.
	 * First, if the locale contains a region information (fr_FR), then the locale without the region is
	 * tried (fr). If that also can't be found or doesn't contain the requested text, the english file
	 * is used (en - assuming that most development projects contain at least english texts).
	 * If that also fails, the file without locale (base URL of the bundle) is tried.
	 * 
	 * If none of the requested files can be found or none of them contains a text for the given key,
	 * then the key itself is returned as text.
	 *
	 * Exception: Fallback for "zh_HK" is "zh_TW" before zh.
	 *
	 * @author SAP SE
	 * @version 1.32.9
	 * @since 0.9.0
	 * @name jQuery.sap.util.ResourceBundle
	 * @public
	 */
	
	/**
	 * Returns a locale-specific string value for the given key sKey.
	 * 
	 * The text is searched in this resource bundle according to the fallback chain described in
	 * {@link jQuery.sap.util.ResourceBundle}. If no text could be found, the key itself is used as text.
	 * 
	 * If text parameters are given, then any occurrences of the pattern "{<i>n</i>}" with <i>n</i> being an integer
	 * are replaced by the parameter value with index <i>n</i>.  Note: This replacement is also applied if no text had been found (key).
	 * For more details on this replacement mechanism refer also:
	 * @see jQuery.sap#formatMessage
	 * 
	 * @param {string} sKey
	 * @param {string[]} [aArgs] List of parameters which should replace the place holders "{n}" (n is the index) in the found locale-specific string value.
	 * @return {string} The value belonging to the key, if found; otherwise the key itself.
	 *
	 * @function
	 * @name jQuery.sap.util.ResourceBundle.prototype.getText
	 * @public
	 */

	/**
	 * Enhances the resource bundle with a custom resource bundle. The bundle
	 * can be enhanced with multiple resource bundles. The last enhanced resource
	 * bundle wins against the previous ones and the original ones. This function
	 * can be called several times.
	 *
	 * @param {jQuery.sap.util.ResourceBundle} oBundle an instance of a <code>jQuery.sap.util.ResourceBundle</code>
	 * @since 1.16.5
	 * @private
	 * 
	 * @function
	 * @name jQuery.sap.util.ResourceBundle.prototype._enhance
	 */
	
	/**
	 * A regular expression that describes language tags according to BCP-47.
	 * @see BCP47 "Tags for Identifying Languages" (http://www.ietf.org/rfc/bcp/bcp47.txt)
	 *
	 * The matching groups are
	 *  0=all
	 *  1=language (shortest ISO639 code + ext. language sub tags | 4digits (reserved) | registered language sub tags)
	 *  2=script (4 letters)
	 *  3=region (2letter language or 3 digits)
	 *  4=variants (separated by '-', Note: capturing group contains leading '-' to shorten the regex!)
	 *  5=extensions (including leading singleton, multiple extensions separated by '-')
	 *  6=private use section (including leading 'x', multiple sections separated by '-')
	 *  
	 *            [-------------------- language ----------------------][--- script ---][------- region --------][------------ variants --------------][--------- extensions --------------][------ private use -------]
	 */
	var rlocale = /^((?:[A-Z]{2,3}(?:-[A-Z]{3}){0,3})|[A-Z]{4}|[A-Z]{5,8})(?:-([A-Z]{4}))?(?:-([A-Z]{2}|[0-9]{3}))?(-[0-9A-Z]{5,8}|(?:[0-9][0-9A-Z]{3}))*(?:-([0-9A-WYZ](?:-[0-9A-Z]{2,8})+))*(?:-(X(?:-[0-9A-Z]{1,8})+))?$/i;

	/**
	 * Resource bundles are stored according to the Java Development Kit conventions.
	 * JDK uses old language names for a few ISO639 codes ("iw" for "he", "ji" for "yi", "in" for "id" and "sh" for "sr").
	 * Make sure to convert newer codes to older ones before creating file names.
	 */
	var M_ISO639_NEW_TO_OLD = {
		"he" : "iw",
		"yi" : "ji",
		"id" : "in",
		"sr" : "sh"
	};

	var M_ISO639_OLD_TO_NEW = {
		"iw" : "he",
		"ji" : "yi",
		"in" : "id",
		"sn" : "sr"
	};

	/**
	 * HANA XS Engine can't handle private extensions in BCP47 language tags.
	 * Therefore, the agreed BCP47 codes for the technical languages 1Q and 2Q 
	 * don't work as Accept-Header and need to be send as URL parameters as well.
	 * @private
	 */
	var M_SUPPORTABILITY_TO_XS = {
		"en_US_saptrc" : "1Q",
		"en_US_sappsd" : "2Q"
	};

	var rSAPSupportabilityLocales = /-(saptrc|sappsd)(?:-|$)/i;

	/**
	 * Helper to normalize the given locale (in BCP-47 syntax) to the java.util.Locale format.
	 * @param {string} sLocale locale to normalize
	 * @return {string} Normalized locale or undefined if the locale can't be normalized
	 */
	function normalize(sLocale) {
		var m;
		if ( typeof sLocale === 'string' && (m = rlocale.exec(sLocale.replace(/_/g, '-'))) ) {
			var sLanguage = m[1].toLowerCase();
			sLanguage = M_ISO639_NEW_TO_OLD[sLanguage] || sLanguage;
			var sScript = m[2] ? m[2].toLowerCase() : undefined;
			var sRegion = m[3] ? m[3].toUpperCase() : undefined;
			var sVariants = m[4];
			var sPrivate = m[6];
			// recognize and convert special SAP supportability locales (overwrites m[]!)
			if ( (sPrivate && (m = rSAPSupportabilityLocales.exec(sPrivate)))
					 || (sVariants && (m = rSAPSupportabilityLocales.exec(sVariants))) ) {
				return "en_US_" + m[1].toLowerCase(); // for now enforce en_US (agreed with SAP SLS)
			}
			// Chinese: when no region but a script is specified, use default region for each script
			if ( sLanguage === "zh" && !sRegion ) {
				if ( sScript === "hans" ) {
					sRegion = "CN";
				} else if ( sScript === "hant" ) {
					sRegion = "TW";
				}
			}
			return sLanguage + (sRegion ? "_" + sRegion + (sVariants ? "_" + sVariants.slice(1).replace("-","_") : "") : "");
		}
	}
	
	/**
	 * Returns the default locale (the locale defined in UI5 configuration if available, else "en")
	 * @return {string} The default locale
	 */
	function defaultLocale() {
		var sLocale;
		if (window.sap && sap.ui && sap.ui.getCore) {
			sLocale = sap.ui.getCore().getConfiguration().getLanguage();
			sLocale = normalize(sLocale);
		}
		return sLocale || "en";
	}
	
	/**
	 * Helper to normalize the given locale (java.util.Locale format) to the BCP-47 syntax.
	 * @param {string} sLocale locale to convert
	 * @return {string} Normalized locale or undefined if the locale can't be normalized
	 */
	function convertLocaleToBCP47(sLocale) {
		var m;
		if ( typeof sLocale === 'string' && (m = rlocale.exec(sLocale.replace(/_/g, '-'))) ) {
			var sLanguage = m[1].toLowerCase();
			sLanguage = M_ISO639_OLD_TO_NEW[sLanguage] || sLanguage;
			return sLanguage + (m[3] ? "-" + m[3].toUpperCase() + (m[4] ? "-" + m[4].slice(1).replace("_","-") : "") : "");
		}
	}

	/**
	 * A regular expression to split a URL into
	 * <ol>
	 * <li>a part before the file extension
	 * <li>the file extension itself
	 * <li>any remaining part after the file extension (query, hash - optional)
	 * </ol>.
	 * 
	 * Won't match for URLs without a file extension.
	 *
	 *           [------- prefix ------][----ext----][-------suffix--------]
	 *                                               ?[--query--]#[--hash--]
	 */
	var rUrl = /^((?:[^?#]*\/)?[^\/?#]*)(\.[^.\/?#]+)((?:\?([^#]*))?(?:#(.*))?)$/;

	/**
	 * List of supported file extensions.
	 *
	 * Could be enriched in future or even could be made
	 * extensible to support other formats as well.
	 */
	var aValidFileTypes = [ ".properties", ".hdbtextbundle"];

	/**
	 * Helper to split a URL with the above regex.
	 * Either returns an object with the parts or undefined.
	 * @param {string} sUrl URL to analyze / split into pieces.
	 * @return {object} an object with properties for the individual URL parts
	 */
	function splitUrl(sUrl) {
		var m = rUrl.exec(sUrl);
		return m && { url : sUrl, prefix : m[1], ext : m[2], query: m[4], hash: (m[5] || ""), suffix : m[2] + (m[3] || "") };
	}

	/*
	 * Implements jQuery.sap.util.ResourceBundle
	 */
	var Bundle = function(sUrl, sLocale, bIncludeInfo, bAsync){
		//last fallback is english if no or no valid locale is given
		//TODO: If the browsers allow to access the users language preference this should be the fallback
		this.sLocale = normalize(sLocale) || defaultLocale();
		this.oUrlInfo = splitUrl(sUrl);
		if ( !this.oUrlInfo || jQuery.inArray(this.oUrlInfo.ext, aValidFileTypes) < 0 ) {
			throw new Error("resource URL '" + sUrl + "' has unknown type (should be one of " + aValidFileTypes.join(",") + ")");
		}
		this.bIncludeInfo = bIncludeInfo;
		// list of custom bundles
		this.aCustomBundles = [];
		//declare list of property files that are loaded
		this.aPropertyFiles = [];
		this.aLocales = [];
		//load the most specific property file
		var p = load(this, this.sLocale, bAsync);
		if (bAsync) {
			this._promise = p;
		}
	};

	Bundle.prototype = {};

	/*
	 * Implements jQuery.sap.util.ResourceBundle.prototype._enhance
	 */
	Bundle.prototype._enhance = function(oCustomBundle) {
		if (oCustomBundle && oCustomBundle instanceof Bundle) {
			this.aCustomBundles.push(oCustomBundle);
		} else {
			// we report the error but do not break the execution
			jQuery.sap.log.error("Custom ResourceBundle is either undefined or not an instanceof jQuery.sap.util.ResourceBundle. Therefore this custom ResourceBundle will be ignored!");
		}
	};
	
	/*
	 * Implements jQuery.sap.util.ResourceBundle.prototype.getText
	 */
	Bundle.prototype.getText = function(sKey, aArgs, bCustomBundle){
		var sValue = null, 
			i;
		
		// loop over the custom bundles before resolving this one
		// lookup the custom resource bundles (last one first!)
		for (i = this.aCustomBundles.length - 1; i >= 0; i--) {
			sValue = this.aCustomBundles[i].getText(sKey, aArgs, true /* bCustomBundle */);
			// value found - so return it!
			if (sValue != null) {
				return sValue; // found!
			}
		}
		
		//loop over all loaded property files and return the value for the key if any
		for (i = 0; i < this.aPropertyFiles.length; i++) {
			sValue = this.aPropertyFiles[i].getProperty(sKey);
			if (typeof (sValue) === "string") {
				break;
			}
		}

		//value for this key was not found in the currently loaded property files,
		//load the fallback locales
		if (typeof (sValue) !== "string") {
			var sTempLocale = this.aLocales[0];
			while (sTempLocale.length > 0) {
				// TODO: validate why, maybe remove? Introduced by Martin S.
				// keep in sync with fallback mechanism in Java, ABAP (MIME & BSP)
				// resource handler (Java: Peter M., MIME: Sebastian A., BSP: Silke A.)
				if (sTempLocale == "zh_HK") {
					sTempLocale = "zh_TW";
				} else {
					var p = sTempLocale.lastIndexOf('_');
					if (p >= 0) {
						sTempLocale = sTempLocale.substring(0,p);
					} else if (sTempLocale != "en") {
						sTempLocale = "en";
					} else {
						sTempLocale = "";
					}
				}

				var oProperties = load(this, sTempLocale);
				if (oProperties == null) {
					continue;
				}

				//check whether the key is included in the newly loaded property file
				sValue = oProperties.getProperty(sKey);
				if (typeof (sValue) === "string") {
					break;
				}
			}
		}

		if (!bCustomBundle && typeof (sValue) !== "string") {
			jQuery.sap.assert(false, "could not find any translatable text for key '" + sKey + "' in bundle '" + this.oUrlInfo.url + "'");
			sValue = sKey;
		}

		if (typeof (sValue) === "string") {
			if (aArgs) {
				sValue = jQuery.sap.formatMessage(sValue, aArgs);
			}

			if (this.bIncludeInfo) {
				/* eslint-disable no-new-wrappers */
				sValue = new String(sValue);
				/* eslint-enable no-new-wrappers */
				sValue.originInfo = {
					source: "Resource Bundle",
					url: this.oUrlInfo.url,
					locale: this.sLocale,
					key: sKey
				};
			}
		}

		return sValue;
	};

	/*
	 * If a .properties file for the given locale is not loaded yet
	 * in the given bundle, this method loads the .properties file and
	 * adds it to the bundle.
	 * @param {string} sLocale the text to parse
	 * @param oBundle the resource bundle to extend
	 * @param bAsync whether the resource should be loaded asynchronously. A Promise is returned in this case
	 * @return The newly loaded properties or <code>null</code>
	 *         when the properties for the given locale already loaded.
	 * @private
	 */
	function load(oBundle, sLocale, bAsync) {
		var oUrl = oBundle.oUrlInfo,
			sUrl,
			oRequest,
			oProperties,
			oPromise;

		if ( jQuery.inArray(sLocale, oBundle.aLocales) == -1 ) {
			if ( shouldRequest(sLocale) ) {
				switch (oUrl.ext) {
					case '.hdbtextbundle':
						if ( M_SUPPORTABILITY_TO_XS[sLocale] ) {
							// Add technical support languages also as URL parameter (as XS engine can't handle private extensions in Accept-Language header)
							sUrl = oUrl.prefix + oUrl.suffix + '?' + (oUrl.query ? oUrl.query + "&" : "") + "sap-language=" + M_SUPPORTABILITY_TO_XS[sLocale] + (oUrl.hash ? "#" + oUrl.hash : "");
						} else {
							sUrl = oUrl.url;
						}
						oRequest = {
							url: sUrl,
							// Alternative: add locale as query:
							// url: oUrl.prefix + oUrl.suffix + '?' + (oUrl.query ? oUrl.query + "&" : "") + "locale=" + sLocale + (oUrl.hash ? "#" + oUrl.hash : ""),
							headers : {
								"Accept-Language": convertLocaleToBCP47(sLocale) || ""
							}
						};
						break;
					default:
						oRequest = {
							url: oUrl.prefix + (sLocale ? "_" + sLocale : "") + oUrl.suffix
						};
						break;
				}
				
				if (bAsync) {
					oRequest.async = true;
					oPromise = Promise.resolve(jQuery.sap.properties(oRequest));
				} else {
					oProperties = jQuery.sap.properties(oRequest);
				}
			} else {
				// dummy result (empty)
				oProperties = {
					getProperty : function() {
						return undefined;
					}
				};
				if (bAsync) {
					oPromise = Promise.resolve(oProperties);
				}
			}
			
			// remember result and locales that have been loaded so far (to avoid repeated roundtrips)
			if (bAsync) {
				oPromise.then(function(oProps){
					oBundle.aPropertyFiles.push(oProps);
					oBundle.aLocales.push(sLocale);
				});
				return oPromise;
			} else {
				oBundle.aPropertyFiles.push(oProperties);
				oBundle.aLocales.push(sLocale);
				return oProperties;
			}
		}
		
		return bAsync ? Promise.resolve(null) : null;
	}

	function shouldRequest(sLocale) {
		var aLanguages = window.sap && sap.ui && sap.ui.getCore && sap.ui.getCore().getConfiguration().getSupportedLanguages();
		if ( aLanguages && aLanguages.length > 0 ) {
			return jQuery.inArray(sLocale, aLanguages) >= 0;
		}
		return true;
	}
	
	/**
	 * Creates and returns a new instance of {@link jQuery.sap.util.ResourceBundle}
	 * using the given URL and locale to determine what to load.
	 *
	 * @public
	 * @param {object} [mParams] Parameters used to initialize the resource bundle
	 * @param {string} [mParams.url=''] The URL to the base .properties file of a bundle (.properties file without any locale information, e.g. "mybundle.properties")
	 * @param {string} [mParams.locale='en'] Optional string of the language and an optional country code separated by underscore (e.g. "en_GB" or "fr")
	 * @param {boolean} [mParams.includeInfo=false] Optional boolean whether to include origin information into the returned property values
	 * @param {boolean} [mParams.async=false] Optional boolean whether first bundle should be loaded asynchronously. Note: fallback bundles will still be loaded synchronously afterwards if needed.
	 * @return {jQuery.sap.util.ResourceBundle|Promise} A new resource bundle instance or a ECMA Script 6 Promise (in asynchronous case)
	 * @SecSink {0|PATH} Parameter is used for future HTTP requests
	 */
	jQuery.sap.resources = function resources(mParams) {
		mParams = jQuery.extend({url: "", locale: undefined, includeInfo: false}, mParams);
		var bAsync = !!mParams.async;
		var oBundle = new Bundle(mParams.url, mParams.locale, mParams.includeInfo, bAsync);
		if (bAsync) {
			return new Promise(function(resolve, reject){
				function _resolve(){
					resolve(oBundle);
					delete oBundle._promise;
				}
				oBundle._promise.then(_resolve, _resolve);
			});
		} else {
			return oBundle;
		}
	};
	
	/**
	 * Checks if the given object is an instance of {@link jQuery.sap.util.ResourceBundle}
	 * 
	 * @param {jQuery.sap.util.ResourceBundle} oBundle object to check
	 * @return {boolean} true, if the object is a {@link jQuery.sap.util.ResourceBundle}
	 * @public
	 */
	jQuery.sap.resources.isBundle = function(oBundle) {
		return oBundle && oBundle instanceof Bundle;
	};

	jQuery.sap.resources._getFallbackLocales = function(sLocale, aSupportedLocales) {
		var sTempLocale = normalize(sLocale),
			aLocales = [];

		function supported(sLocale) {
			return !aSupportedLocales || aSupportedLocales.length === 0 || jQuery.inArray(sLocale, aSupportedLocales) >= 0;
		}
		
		while (sTempLocale) {
			if ( supported(sTempLocale) ) {
				aLocales.push(sTempLocale);
			}
			// TODO: validate why, maybe remove? Introduced by Martin S.
			// keep in sync with fallback mechanism in Java, ABAP (MIME & BSP)
			// resource handler (Java: Peter M., MIME: Sebastian A., BSP: Silke A.)
			if ( sTempLocale === "zh_HK" ) {
				sTempLocale = "zh_TW";
			} else {
				var p = sTempLocale.lastIndexOf('_');
				if (p > 0 ) {
					sTempLocale = sTempLocale.slice(0, p);
				} else if ( sTempLocale !== "en" ) {
					sTempLocale = "en";
				} else {
				  sTempLocale = "";
				}
			}
		}
		if ( supported("") ) {
			aLocales.push("");
		}
		return aLocales;
	};

	return jQuery;

});
/*!
 * UI development toolkit for HTML5 (OpenUI5)
 * (c) Copyright 2009-2015 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */

// Provides miscellaneous utility functions that might be useful for any script
sap.ui.predefine('jquery.sap.script',['jquery.sap.global'],
	function(jQuery) {
	"use strict";

	/**
	 * Some private variable used for creation of (pseudo-)unique ids.
	 * @type integer
	 * @private
	 */
	var iIdCounter = 0;

	/**
	 * Creates and returns a pseudo-unique id.
	 *
	 * No means for detection of overlap with already present or future UIDs.
	 *
	 * @return {string} A pseudo-unique id.
	 * @public
	 */
	jQuery.sap.uid = function uid() {
		return "id-" + new Date().valueOf() + "-" + iIdCounter++;
	};

	/**
	 * Calls a method after a given delay and returns an id for this timer
	 *
	 * @param {int} iDelay Delay time in milliseconds
	 * @param {object} oObject Object from which the method should be called
	 * @param {string|object} method function pointer or name of the method
	 * @param {array} [aParameters] Method parameters
	 * @return {string} Id which can be used to cancel the timer with clearDelayedCall
	 * @public
	 */
	jQuery.sap.delayedCall = function delayedCall(iDelay, oObject, method, aParameters) {
		return setTimeout(function(){
			if (jQuery.type(method) == "string") {
				method = oObject[method];
			}
			method.apply(oObject, aParameters || []);
		}, iDelay);
	};

	/**
	 * Stops the delayed call.
	 *
	 * The function given when calling delayedCall is not called anymore.
	 *
	 * @param {string} sDelayedCallId The id returned, when calling delayedCall
	 * @public
	 */
	jQuery.sap.clearDelayedCall = function clearDelayedCall(sDelayedCallId) {
		clearTimeout(sDelayedCallId);
		return this;
	};

	/**
	 * Calls a method after a given interval and returns an id for this interval.
	 *
	 * @param {int} iInterval Interval time in milliseconds
	 * @param {object} oObject Object from which the method should be called
	 * @param {string|object} method function pointer or name of the method
	 * @param {array} [aParameters] Method parameters
	 * @return {string} Id which can be used to cancel the interval with clearIntervalCall
	 * @public
	 */
	jQuery.sap.intervalCall = function intervalCall(iInterval, oObject, method, aParameters) {
		return setInterval(function(){
			if (jQuery.type(method) == "string") {
				method = oObject[method];
			}
			method.apply(oObject, aParameters || []);
		}, iInterval);
	};

	/**
	 * Stops the interval call.
	 *
	 * The function given when calling intervalCall is not called anymore.
	 *
	 * @param {string} sIntervalCallId The id returned, when calling intervalCall
	 * @public
	 */
	jQuery.sap.clearIntervalCall = function clearIntervalCall(sIntervalCallId) {
		clearInterval(sIntervalCallId);
		return this;
	};

	// Javadoc for private inner class "UriParams" - this list of comments is intentional!
	/**
	 * @interface	Encapsulates all URI parameters of the current windows location (URL).
	 *
	 * Use {@link jQuery.sap.getUriParameters} to create an instance of jQuery.sap.util.UriParameters.
	 *
	 * @author SAP SE
	 * @version 1.32.9
	 * @since 0.9.0
	 * @name jQuery.sap.util.UriParameters
	 * @public
	 */
	/**
	 * Returns the value(s) of the URI parameter with the given name sName.
	 *
	 * If the boolean parameter bAll is <code>true</code>, an array of string values of all
	 * occurrences of the URI parameter with the given name is returned. This array is empty
	 * if the URI parameter is not contained in the windows URL.
	 *
	 * If the boolean parameter bAll is <code>false</code> or is not specified, the value of the first
	 * occurrence of the URI parameter with the given name is returned. Might be <code>null</code>
	 * if the URI parameter is not contained in the windows URL.
	 *
	 * @param {string} sName The name of the URI parameter.
	 * @param {boolean} [bAll=false] Optional, specifies whether all or only the first parameter value should be returned.
	 * @return {string|array} The value(s) of the URI parameter with the given name
	 * @SecSource {return|XSS} Return value contains URL parameters
	 *
	 * @function
	 * @name jQuery.sap.util.UriParameters.prototype.get
	 */

	/*
	 * Implements jQuery.sap.util.UriParameters
	 */
	var UriParams = function(sUri) {
		this.mParams = {};
		var sQueryString = sUri || window.location.href;
		if ( sQueryString.indexOf('#') >= 0 ) {
			sQueryString = sQueryString.slice(0, sQueryString.indexOf('#'));
		}
		if (sQueryString.indexOf("?") >= 0) {
			sQueryString = sQueryString.slice(sQueryString.indexOf("?") + 1);
			var aParameters = sQueryString.split("&"),
				mParameters = {},
				aParameter,
				sName,
				sValue;
			for (var i = 0; i < aParameters.length; i++) {
				aParameter = aParameters[i].split("=");
				sName = decodeURIComponent(aParameter[0]);
				sValue = aParameter.length > 1 ? decodeURIComponent(aParameter[1].replace(/\+/g,' ')) : "";
				if (sName) {
					if (!Object.prototype.hasOwnProperty.call(mParameters, sName)) {
						mParameters[sName] = [];
					}
					mParameters[sName].push(sValue);
				}
			}
			this.mParams = mParameters;
		}
	};

	UriParams.prototype = {};

	/*
	 * Implements jQuery.sap.util.UriParameters.prototype.get
	 */
	UriParams.prototype.get = function(sName, bAll) {
		var aValues = Object.prototype.hasOwnProperty.call(this.mParams, sName) ? this.mParams[sName] : [];
		return bAll === true ? aValues : (aValues[0] || null);
	};

	/**
	 * Creates and returns a new instance of {@link jQuery.sap.util.UriParameters}.
	 *
	 * Example for reading a single URI parameter (or the value of the first
	 * occurrence of the URI parameter):
	 * <pre>
	 *	var sValue = jQuery.sap.getUriParameters().get("myUriParam");
	 * </pre>
	 *
	 * Example for reading the values of the first of the URI parameter
	 * (with multiple occurrences):
	 * <pre>
	 *	var aValues = jQuery.sap.getUriParameters().get("myUriParam", true);
	 *	for(i in aValues){
	 *	var sValue = aValues[i];
	 *	}
	 * </pre>
	 *
	 * @public
	 * @param {string} sUri Uri to determine the parameters for
	 * @return {jQuery.sap.util.UriParameters} A new URI parameters instance
	 */
	jQuery.sap.getUriParameters = function getUriParameters(sUri) {
		return new UriParams(sUri);
	};

	/**
	 * Sorts the given array in-place and removes any duplicates (identified by "===").
	 *
	 * Use <code>jQuery.unique()</code> for arrays of DOMElements.
	 *
	 * @param {Array} a An Array of any type
	 * @return {Array} Same array as given (for chaining)
	 * @public
	 */
	jQuery.sap.unique = function(a) {
		jQuery.sap.assert(a instanceof Array, "unique: a must be an array");
		var l = a.length;
		if ( l > 1 ) {
			a.sort();
			var j = 0;
			for (var i = 1; i < l; i++) {
				// invariant: i is the entry to check, j is the last unique entry known so far
				if ( a[i] !== a[j] ) {
					a[++j] = a[i];
				}
			}
			// cut off the rest - if any
			if ( ++j < l ) {
				a.splice(j, l - j);
			}
		}
		return a;
	};

	/**
	 * Compares the two given values for equality, especially takes care not to compare
	 * arrays and objects by reference, but compares their content.
	 * Note: function does not work with comparing XML objects
	 *
	 * @param {any} a A value of any type
	 * @param {any} b A value of any type
	 * @param {int} [maxDepth=10] Maximum recursion depth
	 * @param {boolean} [contains] Whether all existing properties in a are equal as in b
	 * 
	 * @return {boolean} Whether a and b are equal
	 * @public
	 */
	jQuery.sap.equal = function(a, b, maxDepth, contains, depth) {
		// Optional parameter normalization
		if (typeof maxDepth == "boolean") {
			contains = maxDepth;
			maxDepth = undefined;
		}
		if (!depth) {
			depth = 0;
		}
		if (!maxDepth) {
			maxDepth = 10;
		}
		if (depth > maxDepth) {
			return false;
		}
		if (a === b) {
			return true;
		}
		if (jQuery.isArray(a) && jQuery.isArray(b)) {
			if (!contains) {
				if (a.length != b.length) {
					return false;
				}
			} else {
				if (a.length > b.length) {
					return false;
				}
			}
			for (var i = 0; i < a.length; i++) {
				if (!jQuery.sap.equal(a[i], b[i], maxDepth, contains, depth + 1)) {
						return false;
				}
			}
			return true;
		}
		if (typeof a == "object" && typeof b == "object") {
			if (!a || !b) {
				return false;
			}
			if (a.constructor != b.constructor) {
				return false;
			}
			if (a.nodeName && b.nodeName && a.namespaceURI && b.namespaceURI) {
				return jQuery.sap.isEqualNode(a,b);
			}
			if (a instanceof Date) {
				return a.valueOf() == b.valueOf();
			}
			for (var i in a) {
				if (!jQuery.sap.equal(a[i], b[i], maxDepth, contains, depth + 1)) {
					return false;
				}
			}
			if (!contains) {
				for (var i in b) {
					if (a[i] === undefined) {
						return false;
					}
				}
			}
			return true;
		}
		return false;
	};
	
	/**
	 * Iterates over elements of the given object or array. 
	 * 
	 * Works similar to <code>jQuery.each</code>, but a numeric index is only used for 
	 * instances of <code>Array</code>. For all other objects, including those with a numeric 
	 * <code>length</code> property, the properties are iterated by name. 
	 * 
	 * The contract for the <code>fnCallback</code> is the same as for <code>jQuery.each</code>,
	 * when it returns <code>false</code>, then the iteration stops (break).
	 * 
	 * @param {object|any[]} oObject object or array to enumerate the properties of
	 * @param {function} fnCallback function to call for each property name
	 * @return {object|any[]} the given <code>oObject</code> 
	 * @since 1.11
	 */
	jQuery.sap.each = function(oObject, fnCallback) {
		var isArray = jQuery.isArray(oObject),
			length, i;

		if ( isArray ) {
			for (i = 0, length = oObject.length; i < length; i++) {
				if ( fnCallback.call(oObject[i], i, oObject[i]) === false ) {
					break;
				}
			}
		} else {
			for ( i in oObject ) {
				if ( fnCallback.call(oObject[i], i, oObject[i] ) === false ) {
					break;
				}
			}
		}

		return oObject;
	};
	
	/**
	 * Substitute for <code>for(n in o)</code> loops which fixes the 'Don'tEnum' bug of IE8.
	 * 
	 * Iterates over all enumerable properties of the given object and calls the
	 * given callback function for each of them. The assumed signature of the 
	 * callback function is 
	 * 
	 *	 fnCallback(name, value)
	 *	 
	 * where name is the name of the property and value is its value.
	 * 
	 * When an object in IE8 overrides a property of Object.prototype
	 * that has been marked as 'don't enum', then IE8 by mistake also 
	 * doesn't enumerate the overriding property. 
	 * 
	 * A 100% complete substitute is hard to achieve. The current implementation 
	 * enumerates an overridden property when it either is an 'own' property 
	 * (hasOwnProperty(name) is true) or when the property value is different 
	 * from the value in the Object.prototype object.
	 * 
	 * @param {object} oObject object to enumerate the properties of
	 * @param {function} fnCallback function to call for each property name
	 * @function
	 * @since 1.7.1
	 */
	jQuery.sap.forIn = {toString:null}.propertyIsEnumerable("toString") ?
		// for browsers without the bug we use the straight forward implementation of a for in loop
		function(oObject, fnCallback) {
			for (var n in oObject) {
				if ( fnCallback(n, oObject[n]) === false ) {
					return;
				}
			}
		} :
		// use a special implementation for IE8 
		(function() {
			var DONT_ENUM_KEYS = ["toString","valueOf","toLocaleString", "hasOwnProperty","isPrototypeOf","propertyIsEnumerable","constructor"],
					DONT_ENUM_KEYS_LENGTH = DONT_ENUM_KEYS.length,
					oObjectPrototype = Object.prototype,
					fnHasOwnProperty = oObjectPrototype.hasOwnProperty;
					
			return function(oObject, fnCallback) {
				var n,i;
				
				// standard for(in) loop
				for (n in oObject) {
					if ( fnCallback(n, oObject[n]) === false ) {
						return;
					}
				}
				// additionally check the known 'don't enum' names
				for (var i = 0; i < DONT_ENUM_KEYS_LENGTH; i++) {
					n = DONT_ENUM_KEYS[i];
					// assume an enumerable property if it is either an own property
					// or if its value differes fro mthe value in the Object.prototype
					if ( fnHasOwnProperty.call(oObject,n) || oObject[n] !== oObjectPrototype[n] ) {
						if ( fnCallback(n, oObject[n]) === false ) {
							return;
						}
					}
				}
				// Note: this substitute implementation still fails in several regards
				// - it fails when oObject is identical to Object.prototype (iterates non-enumerable properties)
				// - it fails when one of the don't enum properties by intention has been overridden in the 
				//	 prototype chain with a value identical to the value in Object.prototype
				// - the don't enum properties are handled out of order. This is okay with the ECMAScript
				//	 spec but might be unexpected for some callers
			};
		}());
		

	/**
	 * Calculate delta of old list and new list
	 * This implements the algorithm described in "A Technique for Isolating Differences Between Files"
	 * (Commun. ACM, April 1978, Volume 21, Number 4, Pages 264-268)
	 * @public
	 * @param {Array} aOld Old Array
	 * @param {Array} aNew New Array
	 * @param {function} [fnCompare] Function to compare list entries
	 * @param {boolean} [bUniqueEntries] Whether entries are unique, so no duplicate entries exist
	 * @return {Array} List of changes
	 */
	jQuery.sap.arrayDiff = function(aOld, aNew, fnCompare, bUniqueEntries){
		fnCompare = fnCompare || function(vValue1, vValue2) {
			return jQuery.sap.equal(vValue1, vValue2);
		};

		var aOldRefs = [];
		var aNewRefs = [];

		//Find references
		var aMatches = [];
		for (var i = 0; i < aNew.length; i++) {
			var oNewEntry = aNew[i];
			var iFound = 0;
			var iTempJ;
			// if entries are unique, first check for whether same index is same entry
			// and stop searching as soon the first matching entry is found
			if (bUniqueEntries && fnCompare(aOld[i], oNewEntry)) {
				iFound = 1;
				iTempJ = i;
			} else {
				for (var j = 0; j < aOld.length; j++) {
					if (fnCompare(aOld[j], oNewEntry)) {
						iFound++;
						iTempJ = j;
						if (bUniqueEntries || iFound > 1) {
							break;
						}
					}
				}
			}
			if (iFound == 1) {
				var oMatchDetails = {
					oldIndex: iTempJ,
					newIndex: i
				};
				if (aMatches[iTempJ]) {
					delete aOldRefs[iTempJ];
					delete aNewRefs[aMatches[iTempJ].newIndex];
				} else {
					aNewRefs[i] = {
						data: aNew[i],
						row: iTempJ
					};
					aOldRefs[iTempJ] = {
						data: aOld[iTempJ],
						row: i
					};
					aMatches[iTempJ] = oMatchDetails;
				}
			}
		}

		//Pass 4: Find adjacent matches in ascending order
		for (var i = 0; i < aNew.length - 1; i++) {
			if (aNewRefs[i] &&
				!aNewRefs[i + 1] &&
				aNewRefs[i].row + 1 < aOld.length &&
				!aOldRefs[aNewRefs[i].row + 1] &&
				fnCompare(aOld[ aNewRefs[i].row + 1 ], aNew[i + 1])) {

				aNewRefs[i + 1] = {
					data: aNew[i + 1],
					row: aNewRefs[i].row + 1
				};
				aOldRefs[aNewRefs[i].row + 1] = {
					data: aOldRefs[aNewRefs[i].row + 1],
					row: i + 1
				};

			}
		}

		//Pass 5: Find adjacent matches in descending order
		for (var i = aNew.length - 1; i > 0; i--) {
			if (aNewRefs[i] &&
				!aNewRefs[i - 1] &&
				aNewRefs[i].row > 0 &&
				!aOldRefs[aNewRefs[i].row - 1] &&
				fnCompare(aOld[aNewRefs[i].row - 1], aNew[i - 1])) {

				aNewRefs[i - 1] = {
					data: aNew[i - 1],
					row: aNewRefs[i].row - 1
				};
				aOldRefs[aNewRefs[i].row - 1] = {
					data: aOldRefs[aNewRefs[i].row - 1],
					row: i - 1
				};

			}
		}

		//Pass 6: Generate diff data
		var aDiff = [];

		if (aNew.length == 0) {
			//New list is empty, all items were deleted
			for (var i = 0; i < aOld.length; i++) {
				aDiff.push({
					index: 0,
					type: 'delete'
				});
			}
		} else {
			var iNewListIndex = 0;
			if (!aOldRefs[0]) {
				//Detect all deletions at the beginning of the old list
				for (var i = 0; i < aOld.length && !aOldRefs[i]; i++) {
					aDiff.push({
						index: 0,
						type: 'delete'
					});
					iNewListIndex = i + 1;
				}
			}

			for (var i = 0; i < aNew.length; i++) {
				if (!aNewRefs[i] || aNewRefs[i].row > iNewListIndex) {
					//Entry doesn't exist in old list = insert
					aDiff.push({
						index: i,
						type: 'insert'
					});
				} else {
					iNewListIndex = aNewRefs[i].row + 1;
					for (var j = aNewRefs[i].row + 1; j < aOld.length && (!aOldRefs[j] || aOldRefs[j].row < i); j++) {
						aDiff.push({
							index: i + 1,
							type: 'delete'
						});
						iNewListIndex = j + 1;
					}
				}
			}
		}

		return aDiff;
	};

	/**
	 * A factory returning a tokenizer object for JS values.
	 * Contains functions to consume tokens on an input string.
	 * @private
	 * @returns {object} - the tokenizer
	 */
	jQuery.sap._createJSTokenizer = function() {
		var at, // The index of the current character
			ch, // The current character
			escapee = {
				'"': '"',
				'\'': '\'',
				'\\': '\\',
				'/': '/',
				b: '\b',
				f: '\f',
				n: '\n',
				r: '\r',
				t: '\t'
			},
			text,

			error = function(m) {

				// Call error when something is wrong.
				throw {
					name: 'SyntaxError',
					message: m,
					at: at,
					text: text
				};
			},

			next = function(c) {

				// If a c parameter is provided, verify that it matches the current character.
				if (c && c !== ch) {
					error("Expected '" + c + "' instead of '" + ch + "'");
				}

				// Get the next character. When there are no more characters,
				// return the empty string.
				ch = text.charAt(at);
				at += 1;
				return ch;
			},

			number = function() {

				// Parse a number value.
				var number, string = '';

				if (ch === '-') {
					string = '-';
					next('-');
				}
				while (ch >= '0' && ch <= '9') {
					string += ch;
					next();
				}
				if (ch === '.') {
					string += '.';
					while (next() && ch >= '0' && ch <= '9') {
						string += ch;
					}
				}
				if (ch === 'e' || ch === 'E') {
					string += ch;
					next();
					if (ch === '-' || ch === '+') {
						string += ch;
						next();
					}
					while (ch >= '0' && ch <= '9') {
						string += ch;
						next();
					}
				}
				number = +string;
				if (!isFinite(number)) {
					error("Bad number");
				} else {
					return number;
				}
			},

			string = function() {

				// Parse a string value.
				var hex, i, string = '', quote,
					uffff;

				// When parsing for string values, we must look for " and \ characters.
				if (ch === '"' || ch === '\'') {
					quote = ch;
					while (next()) {
						if (ch === quote) {
							next();
							return string;
						}
						if (ch === '\\') {
							next();
							if (ch === 'u') {
								uffff = 0;
								for (i = 0; i < 4; i += 1) {
									hex = parseInt(next(), 16);
									if (!isFinite(hex)) {
										break;
									}
									uffff = uffff * 16 + hex;
								}
								string += String.fromCharCode(uffff);
							} else if (typeof escapee[ch] === 'string') {
								string += escapee[ch];
							} else {
								break;
							}
						} else {
							string += ch;
						}
					}
				}
				error("Bad string");
			},

			name = function() {

				// Parse a name value.
				var name = '',
					allowed = function(ch) {
						return ch === "_" ||
							(ch >= "0" && ch <= "9") ||
							(ch >= "a" && ch <= "z") ||
							(ch >= "A" && ch <= "Z");
					};

				if (allowed(ch)) {
					name += ch;
				} else {
					error("Bad name");
				}

				while (next()) {
					if (ch === ' ') {
						next();
						return name;
					}
					if (ch === ':') {
						return name;
					}
					if (allowed(ch)) {
						name += ch;
					} else {
						error("Bad name");
					}
				}
				error("Bad name");
			},

			white = function() {

				// Skip whitespace.
				while (ch && ch <= ' ') {
					next();
				}
			},

			word = function() {

				// true, false, or null.
				switch (ch) {
				case 't':
					next('t');
					next('r');
					next('u');
					next('e');
					return true;
				case 'f':
					next('f');
					next('a');
					next('l');
					next('s');
					next('e');
					return false;
				case 'n':
					next('n');
					next('u');
					next('l');
					next('l');
					return null;
				}
				error("Unexpected '" + ch + "'");
			},

			value, // Place holder for the value function.
			array = function() {

				// Parse an array value.
				var array = [];

				if (ch === '[') {
					next('[');
					white();
					if (ch === ']') {
						next(']');
						return array; // empty array
					}
					while (ch) {
						array.push(value());
						white();
						if (ch === ']') {
							next(']');
							return array;
						}
						next(',');
						white();
					}
				}
				error("Bad array");
			},

			object = function() {

				// Parse an object value.
				var key, object = {};

				if (ch === '{') {
					next('{');
					white();
					if (ch === '}') {
						next('}');
						return object; // empty object
					}
					while (ch) {
						if (ch >= "0" && ch <= "9") {
							key = number();
						} else if (ch === '"' || ch === '\'') {
							key = string();
						} else {
							key = name();
						}
						white();
						next(':');
						if (Object.hasOwnProperty.call(object, key)) {
							error('Duplicate key "' + key + '"');
						}
						object[key] = value();
						white();
						if (ch === '}') {
							next('}');
							return object;
						}
						next(',');
						white();
					}
				}
				error("Bad object");
			};

		value = function() {

			// Parse a JS value. It could be an object, an array, a string, a number,
			// or a word.
			white();
			switch (ch) {
			case '{':
				return object();
			case '[':
				return array();
			case '"':
			case '\'':
				return string();
			case '-':
				return number();
			default:
				return ch >= '0' && ch <= '9' ? number() : word();
			}
		};

		// Return the parse function. It will have access to all of the above
		// functions and variables.
		function parseJS(source, start) {
			var result;

			text = source;
			at = start || 0;
			ch = ' ';
			result = value();
			
			if ( isNaN(start) ) {
				white();
				if (ch) {
					error("Syntax error");
				}
				return result;
			} else {
				return { result : result, at : at - 1 };
			}

		}

		return {
			array: array,
			error: error,
			/**
			 * Returns the index of the current character.
			 * @returns {number} The current character's index.
			 */
			getIndex: function() {
				return at - 1;
			},
			getCh: function() {
				return ch;
			},
			init: function(source, iIndex) {
				text = source;
				at = iIndex || 0;
				ch = ' ';
			},
			name: name,
			next: next,
			number: number,
			parseJS: parseJS,
			/**
			 * Advances the index in the text to <code>iIndex</code>. Fails if the new index
			 * is smaller than the previous index.
			 *
			 * @param {number} iIndex - the new index
			 */
			setIndex: function(iIndex) {
				if (iIndex < at - 1) {
					throw new Error("Must not set index " + iIndex
						+ " before previous index " + (at - 1));
				}
				at = iIndex;
				next();
			},
			string: string,
			value: value,
			white: white,
			word: word
		};
	};

	/**
	 * Parse simple JS objects.
	 * 
	 * A parser for JS object literals. This is different from a JSON parser, as it does not have
	 * the JSON specification as a format description, but a subset of the JavaScript language.
	 * The main difference is, that keys in objects do not need to be quoted and strings can also
	 * be defined using apostrophes instead of quotation marks.
	 * 
	 * The parser does not support functions, but only boolean, number, string, object and array.
	 * 
	 * @param {string} The string containing the JS objects
	 * @throws an error, if the string does not contain a valid JS object
	 * @returns {object} the JS object
	 * 
	 * @since 1.11
	 */
	jQuery.sap.parseJS = jQuery.sap._createJSTokenizer().parseJS;
	
	/**
	 * Merge the contents of two or more objects together into the first object.
	 * Usage is the same as jQuery.extend, but Arguments that are null or undefined are NOT ignored.
	 * 
	 * @since 1.26
	 */
	jQuery.sap.extend = function() {
		var src, copyIsArray, copy, name, options, clone,
			target = arguments[0] || {},
			i = 1,
			length = arguments.length,
			deep = false;

		// Handle a deep copy situation
		if ( typeof target === "boolean" ) {
			deep = target;

			// skip the boolean and the target
			target = arguments[ i ] || {};
			i++;
		}

		// Handle case when target is a string or something (possible in deep copy)
		if ( typeof target !== "object" && !jQuery.isFunction(target) ) {
			target = {};
		}

		for ( ; i < length; i++ ) {
			
			options = arguments[ i ];
			
			// Extend the base object
			for ( name in options ) {
				src = target[ name ];
				copy = options[ name ];

				// Prevent never-ending loop
				if ( target === copy ) {
					continue;
				}

				// Recurse if we're merging plain objects or arrays
				if ( deep && copy && ( jQuery.isPlainObject(copy) || (copyIsArray = jQuery.isArray(copy)) ) ) {
					if ( copyIsArray ) {
						copyIsArray = false;
						clone = src && jQuery.isArray(src) ? src : [];

					} else {
						clone = src && jQuery.isPlainObject(src) ? src : {};
					}

					// Never move original objects, clone them
					target[ name ] = jQuery.sap.extend( deep, clone, copy );

				} else {
					target[ name ] = copy;
				}
			}
		}

		// Return the modified object
		return target;
	};
	
	return jQuery;

});
/*!
 * UI development toolkit for HTML5 (OpenUI5)
 * (c) Copyright 2009-2015 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */

/*
 * Provides convenience functions for synchronous communication, based on the jQuery.ajax() function.
 */
sap.ui.predefine('jquery.sap.sjax',['jquery.sap.global'],
	function(jQuery) {
	"use strict";

	jQuery.sap.sjaxSettings = {
		/**
		 * Whether to return an object consisting of data and status and error codes or only the simple data
		 */
		complexResult: true,

		/**
		 * fallback value when complexResult is set to false and an error occurred. Then fallback will be returned.
		 */
		fallback: undefined
	};

	/**
	 * Convenience wrapper around <code>jQuery.ajax()</code> that avoids the need for callback functions when
	 * synchronous calls are made. If the setting <code>complexResult</code> is true (default), then the return value
	 * is an object with the following properties
	 * <ul>
	 * <li><code>success</code> boolean whether the call succeeded or not
	 * <li><code>data</code> any the data returned by the call. For dataType 'text' this is a string,
	 *                       for JSON it is an object, for XML it is a document. When the call failed, then data is not defined
	 * <li><code>status</code> string a textual status ('success,', 'error', 'timeout',...)
	 * <li><code>statusCode</code> string the HTTP status code of the request
	 * <li><code>error</code> Error an error object (exception) in case an error occurred
	 * <li><code>errorText</code> string an error message in case an error occurred
	 * </ul>
	 *
	 * When <code>complexResult</code> is false, then in the case of success, only 'data' is returned, in case of an error the
	 * 'fallback' setting is returned (defaults to undefined).
	 *
	 * Note that async=false is always enforced by this method.
	 *
	 * @param {string} oOrigSettings the ajax() settings
	 * @return result, see above
	 *
	 * @public
	 * @since 0.9.0
	 * @SecSink {0|PATH} Parameter is used for future HTTP requests
	 */
	jQuery.sap.sjax = function sjax(oOrigSettings) {

		var s = jQuery.extend(true, {}, jQuery.sap.sjaxSettings, oOrigSettings,

			// the following settings are enforced as this is the rightmost object in the extend call
			{
				async: false,
				success : function(data, textStatus, xhr) {
//					oResult = { success : true, data : data, status : textStatus, statusCode : xhr.status };
					oResult = { success : true, data : data, status : textStatus, statusCode : xhr && xhr.status };
				},
				error : function(xhr, textStatus, error) {
					oResult = { success : false, data : undefined, status : textStatus, error : error, statusCode : xhr.status, errorResponse :  xhr.responseText};
				}
			});

		var oResult;

		jQuery.ajax(s);

		if (!s.complexResult) {
			return oResult.success ? oResult.data : s.fallback;
		}

		return oResult;
	};

	/**
	 * Convenience wrapper that checks whether a given web resource could be accessed.
	 * @SecSink {0|PATH} Parameter is used for future HTTP requests
	 * @SecSource {return} Returned value is under control of an external resource
	 */
	jQuery.sap.syncHead = function(sUrl) {
		return jQuery.sap.sjax({type:'HEAD', url: sUrl}).success;
	};

	/**
	 * Convenience wrapper for {@link jQuery.sap.sjax} that enforeces the Http method GET and defaults the
	 * data type of the result to 'text'.
	 *
	 * @param {string} sUrl the URL
	 * @param {string|object} data request parameters in the format accepted by jQuery.ajax()
	 * @param {string} [sDataType='text'] the type of data expected from the server, default is "text"
	 * @return result @see jQuery.sap.sjax
	 *
	 * @public
	 * @since 0.9.0
	 * @SecSink {0 1|PATH} Parameter is used for future HTTP requests
	 * @SecSource {return} Returned value is under control of an external resource
	 */
	jQuery.sap.syncGet = function syncGet(sUrl, data, sDataType) {
		return jQuery.sap.sjax({
			url: sUrl,
			data: data,
			type: 'GET',
			dataType: sDataType || 'text'
		});
	};

	/**
	 * Convenience wrapper for {@link jQuery.sap.sjax} that enforces the Http method POST and defaults the
	 * data type of the result to 'text'.
	 *
	 * @param {string} sUrl the URL
	 * @param {string|object} data request parameters in the format accepted by jQuery.ajax()
	 * @param {string} [sDataType='text'] the type of data expected from the server, default is "text"
	 * @return result @see jQuery.sap.sjax
	 *
	 * @public
	 * @since 0.9.0
	 * @SecSink {0 1|PATH} Parameter is used for future HTTP requests
	 * @SecSource {return} Returned value is under control of an external resource
	 */
	jQuery.sap.syncPost = function syncPost(sUrl, data, sDataType) {
		return jQuery.sap.sjax({
			url: sUrl,
			data: data,
			type: 'POST',
			dataType: sDataType || 'text'
		});
	};

	/**
	 * Convenience wrapper for {@link jQuery.sap.sjax} that enforces the Http method GET and the data type 'text'.
	 * If a fallback value is given, the function simply returns the response as a text or - if some error occurred -
	 * the fallback value. This is useful for applications that don't require detailed error diagnostics.
	 *
	 * If applications need to know about occurring errors, they can either call <code>sjax()</code> directly
	 * or they can omit the fallback value (providing only two parameters to syncGetText()).
	 * They then receive the same complex result object as for the sjax() call.
	 *
	 * @param {string} sUrl the URL
	 * @param {string|object} data request parameters in the format accepted by jQuery.ajax()
	 * @param {string} [fallback] if set, only data is returned (and this fallback instead in case of errors); if unset, a result structure is returned
	 * @return  result @see jQuery.sap.sjax
	 *
	 * @public
	 * @since 0.9.0
	 * @SecSink {0 1|PATH} Parameter is used for future HTTP requests
	 */
	jQuery.sap.syncGetText = function syncGetText(sUrl, data, fallback) {
		return jQuery.sap.sjax({
			url: sUrl,
			data: data,
			type: 'GET',
			dataType: 'text',
			fallback: fallback,
			complexResult : (arguments.length < 3)
		});
	};

	/**
	 * Convenience wrapper for {@link jQuery.sap.sjax} that enforces the Http method GET and the data type 'json'.
	 * If a fallback value is given, the function simply returns the response as an object or - if some error occurred -
	 * the fallback value. This is useful for applications that don't require detailed error diagnostics.
	 *
	 * If applications need to know about occurring errors, they can either call <code>sjax()</code> directly
	 * or they can omit the fallback value (providing only two parameters to syncGetJSON()).
	 * They then receive the same complex result object as for the sjax() call.
	 *
	 * Note that providing "undefined" or "null" as a fallback is different from omitting the fallback (complex result).
	 *
	 * @param {string} sUrl the URL
	 * @param {string|object} data request parameters in the format accepted by jQuery.ajax()
	 * @param {object} [fallback] if set, only data is returned (and this fallback instead in case of errors); if unset, a result structure is returned
	 * @return result @see jQuery.sap.sjax
	 *
	 * @public
	 * @since 0.9.0
	 * @SecSink {0 1|PATH} Parameter is used for future HTTP requests
	 */
	jQuery.sap.syncGetJSON = function syncGetJSON(sUrl, data, fallback) {
		return jQuery.sap.sjax({
			url: sUrl,
			data: data || null,
			type: 'GET',
			dataType: 'json',
			fallback: fallback,
			complexResult : (arguments.length < 3)
		});
	};

	return jQuery;

});
/*!
 * UI development toolkit for HTML5 (OpenUI5)
 * (c) Copyright 2009-2015 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */

// Provides useful string operations not available in pure JavaScript.
sap.ui.predefine('jquery.sap.strings',['jquery.sap.global'],
	function(jQuery) {
	"use strict";

	/**
	 * Checks whether a given sString ends with sEndString
	 * respecting the case of the strings.
	 *
	 * @param {string} sString The string to be checked
	 * @param {string} sEndString The end string to be searched
	 * @return True if sString ends with sEndString
	 * @type {boolean}
	 * @see jQuery.sap.endsWithIgnoreCase
	 * @public
	 */
	jQuery.sap.endsWith = function endsWith(sString, sEndString) {
		if (typeof (sEndString) != "string" || sEndString == "") {
			return false;
		}
		var iPos = sString.lastIndexOf(sEndString);
		return iPos >= 0 && iPos == sString.length - sEndString.length;
	};

	/**
	 * Checks whether a given sString ends with sEndString
	 * ignoring the case of the strings.
	 *
	 * @param {string} sString the string to be checked
	 * @param {string} sEndString the end string to be searched
	 * @return true if sString ends with sEndString
	 * @type {boolean}
	 * @see jQuery.sap.endsWith
	 * @public
	 */
	jQuery.sap.endsWithIgnoreCase = function endsWithIgnoreCase(sString, sEndString) {
		if (typeof (sEndString) != "string" || sEndString == "") {
			return false;
		}
		sString = sString.toUpperCase();
		sEndString = sEndString.toUpperCase();
		return jQuery.sap.endsWith(sString,sEndString);
	};

	/**
	 * Checks whether a given sString starts with sStartString
	 * respecting the case of the strings.
	 *
	 * @param {string} sString The string to be checked
	 * @param {string} sStartString The start string to be searched
	 * @return True if sString ends with sEndString
	 * @type {boolean}
	 * @see jQuery.sap.startsWithIgnoreCase
	 * @public
	 */
	jQuery.sap.startsWith = function startsWith(sString, sStartString) {
		if (typeof (sStartString) != "string" || sStartString == "") {
			return false;
		}
		if (sString == sStartString) {
			return true;
		}
		return sString.indexOf(sStartString) == 0;
	};

	/**
	 * Checks whether a given sString starts with sStartString
	 * ignoring the case of the strings.
	 *
	 * @param {string} sString The string to be checked
	 * @param {string} sStartString The start string to be searched
	 * @return True if sString ends with sEndString
	 * @type {boolean}
	 * @see jQuery.sap.startsWith
	 * @public
	 */
	jQuery.sap.startsWithIgnoreCase = function startsWithIgnoreCase(sString, sStartString) {
		if (typeof (sStartString) != "string" || sStartString == "") {
			return false;
		}
		sString = sString.toUpperCase();
		sStartString = sStartString.toUpperCase();
		return jQuery.sap.startsWith(sString,sStartString);
	};

	/**
	 * Converts a character of the string to upper case.<br/>
	 * If no pos is defined as second parameter or pos is negative or greater than sString the first character will be
	 * converted into upper case. the first char position is 0.
	 *
	 * @param {string} sString The string to be checked
	 * @param {int} iPos the position of the character that will be uppercase
	 * @return The string with the firstletter in upper case
	 * @type {string}
	 * @public
	 * @SecPassthrough {0|return}
	 */
	jQuery.sap.charToUpperCase = function charToUpperCase(sString,iPos) {
		if (!sString) {
			return sString;
		}
		if (!iPos || isNaN(iPos) || iPos <= 0 || iPos >= sString.length) {
			iPos = 0;
		}
		var sChar = sString.charAt(iPos).toUpperCase();
		if (iPos > 0) {
			return sString.substring(0,iPos) + sChar + sString.substring(iPos + 1);
		}
		return sChar + sString.substring(iPos + 1);
	};

	/**
	 * Pads a string on the left side until is has the given length.<br/>
	 *
	 * @param {string} sString The string to be padded
	 * @param {string} sPadChar The char to use for the padding
	 * @param {int} iLength the target length of the string
	 * @return The padded string
	 * @type {string}
	 * @public
	 * @SecPassthrough {0 1|return}
	 */
	jQuery.sap.padLeft = function padLeft(sString, sPadChar, iLength) {
		if (!sString) {
			sString = "";
		}
		while (sString.length < iLength) {
			sString = sPadChar + sString;
		}
		return sString;
	};

	/**
	 * Pads a string on the right side until is has the given length.<br/>
	 *
	 * @param {string} sString The string to be padded
	 * @param {string} sPadChar The char to use for the padding
	 * @param {int} iLength the target length of the string
	 * @return The padded string
	 * @type {string}
	 * @public
	 * @SecPassthrough {0 1|return}
	 */
	jQuery.sap.padRight = function padRight(sString, sPadChar, iLength) {
		if (!sString) {
			sString = "";
		}
		while (sString.length < iLength) {
			sString = sString + sPadChar;
		}
		return sString;
	};


	var rCamelCase = /-(.)/ig;

	/**
	 * Transforms a hyphen separated string to an camel case string. 
	 *
	 * @param {string} sString Hyphen separated string
	 * @return The transformed string
	 * @type {string}
	 * @since 1.7.0
	 * @public
	 * @SecPassthrough {0|return}
	 */
	jQuery.sap.camelCase = function camelCase(sString) {
		return sString.replace( rCamelCase, function( sMatch, sChar ) {
			return sChar.toUpperCase();
		});
	};

	
	var rHyphen = /([A-Z])/g;
	
	/**
	 * Transforms a camel case string into a hyphen separated string.
	 * 
	 * @param {string} sString camel case string
	 * @return The transformed string
	 * @type {string}
	 * @since 1.15.0
	 * @public
	 * @SecPassthrough {0|return}
	 */
	jQuery.sap.hyphen = function hyphen(sString) {
		return sString.replace( rHyphen, function(sMatch, sChar) {
			return "-" + sChar.toLowerCase();
		});
	};

	
	var rEscapeRegExp = /[-[\]{}()*+?.,\\^$|#\s]/g;

	/**
	 * This function escapes the reserved letters in Regular Expression
	 * @param {string} sString string to escape
	 * @return The escaped string
	 * @type {string}
	 * @since 1.9.3
	 * @public
	 * @SecPassthrough {0|return}
	 */
	jQuery.sap.escapeRegExp = function escapeRegExp(sString) {
		return sString.replace(rEscapeRegExp, "\\$&");
	};

	/**
	 * Creates a string from a pattern by replacing placeholders with concrete values.
	 *
	 * The syntax of the pattern is inspired by (but not fully equivalent to) the 
	 * java.util.MessageFormat.
	 *
	 * Placeholders have the form <code>{ integer }</code>, where any occurrence of 
	 * <code>{0}</code> is replaced by the value with index 0 in <code>aValues</code>,
	 * <code>{1}</code> y the value with index 1 in <code>aValues</code> etc.
	 *
	 * To avoid interpretation of curly braces as placeholders, any non-placeholder fragment 
	 * of the pattern can be enclosed in single quotes. The surrounding single quotes will be 
	 * omitted from the result. Single quotes that are not meant to escape a fragment and 
	 * that should appear in the result, need to be doubled. In the result, only a single 
	 * single quote will occur.
	 *
	 * Example Pattern Strings:
	 * <pre>
	 *   jQuery.sap.formatMessage("Say {0}", ["Hello"]) -> "Say Hello"  // normal use case
	 *   jQuery.sap.formatMessage("Say '{0}'", ["Hello"]) -> "Say {0}"  // escaped placeholder
	 *   jQuery.sap.formatMessage("Say ''{0}''", ["Hello"]) -> "Say 'Hello'" // doubled single quote 
	 *   jQuery.sap.formatMessage("Say '{0}'''", ["Hello"]) -> "Say {0}'" // doubled single quote in quoted fragment
	 * </pre>
	 * 
	 * In contrast to java.util.MessageFormat, format types or format styles are not supported. 
	 * Everything after the argument index and up to the first closing curly brace is ignored.
	 * Nested placeholders (as supported by java.lang.MessageFormat for the format type choice)
	 * are not ignored but reported as a parse error. 
	 *
	 * This method throws an Error when the pattern syntax is not fulfilled (e.g. unbalanced curly 
	 * braces, nested placeholders or a non-numerical argument index).
	 *
	 * This method can also be used as a formatter within a binding. The first part of a composite binding 
	 * will be used as pattern, the following parts as aValues. If there is only one value and this
	 * value is an array it will be handled like the default described above.
	 *  
	 * @param {string} sPattern A pattern string in the described syntax 
	 * @param {any[]} [aValues=[]] The values to be used instead of the placeholders.
	 * 										 
	 * @return {string} The formatted result string 
	 * @since 1.12.5
	 * @SecPassthrough {*|return}
	 * @public
	 */
	jQuery.sap.formatMessage = function formatMessage(sPattern, aValues) {
		jQuery.sap.assert(typeof sPattern === "string" || sPattern instanceof String, "pattern must be string");
		if (arguments.length > 2 || (aValues != null && !jQuery.isArray(aValues))) {
			aValues = Array.prototype.slice.call(arguments,1);
		}
		aValues = aValues || [];
		return sPattern.replace(rMessageFormat, function($0,$1,$2,$3,offset) {
			if ( $1 ) {
				// a doubled single quote in a normal string fragment 
				//   --> emit a single quote
				return "'";
			} else if ( $2 ) {
				// a quoted sequence of chars, potentially containing doubled single quotes again 
				//   --> emit with doubled single quotes replaced by a single quote 
				return $2.replace(/''/g, "'");
			} else if ( $3 ) {
				// a welformed curly brace
				//   --> emit the argument but ignore other parameters 
				return String(aValues[parseInt($3, 10)]);
			}
			// e.g. malformed curly braces 
			//   --> throw Error 
			throw new Error("formatMessage: pattern syntax error at pos. " + offset);
		});
	};
	
	/**
	 * Pattern to analyze MessageFormat strings.
	 * 
	 * Group 1: captures doubled single quotes within the string
	 * Group 2: captures quoted fragments within the string. 
	 *            Note that java.util.MessageFormat silently forgives a missing single quote at 
	 *            the end of a pattern. This special case is handled by the RegEx as well.  
	 * Group 3: captures placeholders
	 *            Checks only for numerical argument index, any remainder is ignored up to the next 
	 *            closing curly brace. Nested placeholdes are not accepted!
	 * Group 4: captures any remaining curly braces and indicates syntax errors
	 *
	 *                    [-1] [----- quoted string -----] [------ placeholder ------] [--]
	 * @private
	 */
	var rMessageFormat = /('')|'([^']+(?:''[^']*)*)(?:'|$)|\{([0-9]+(?:\s*,[^{}]*)?)\}|[{}]/g;

	return jQuery;

});
/*!
 * UI development toolkit for HTML5 (OpenUI5)
 * (c) Copyright 2009-2015 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */

// Provides xml parsing and error checking functionality.
sap.ui.predefine('jquery.sap.xml',['jquery.sap.global', 'sap/ui/Device'],
	function(jQuery, Device) {
	"use strict";

	/*global ActiveXObject */
	/**
	 * Parses the specified XML formatted string text using native parsing
	 * function of the browser and returns a valid XML document. If an error
	 * occurred during parsing a parse error object is returned as property (parseError) of the
	 * returned XML document object. The parse error object has the following error
	 * information parameters: errorCode, url, reason, srcText, line, linepos, filepos
	 *
	 * @param {string}
	 *            sXMLText the XML data as string
	 * @return {object} the parsed XML document with a parseError property as described in
	 *         getParseError. An error occurred if the errorCode property of the parseError is != 0.
	 * @public
	 */
	jQuery.sap.parseXML = function parseXML(sXMLText) {
		var oXMLDocument;
		if (window.DOMParser) {
			var oParser = new DOMParser();
			try {
				oXMLDocument = oParser.parseFromString(sXMLText, "text/xml");
			} catch (e) {
				var oParseError = jQuery.sap.getParseError(oXMLDocument);
				oXMLDocument = {};
				oParseError.reason = e.message;
				oXMLDocument.parseError = oParseError;
				return oXMLDocument;
			}
		} else {
			oXMLDocument = new ActiveXObject("Microsoft.XMLDOM");
			oXMLDocument.async = false;
			oXMLDocument.loadXML(sXMLText);
		}
		var oParseError = jQuery.sap.getParseError(oXMLDocument);
		if (oParseError) {
			if (!oXMLDocument.parseError) {
				oXMLDocument.parseError = oParseError;
			}
		}
		return oXMLDocument;
	};

	/**
	 * Serializes the specified XML document into a string representation.
	 *
	 * @param {string}
	 *            oXMLDocument the XML document object to be serialized as string
	 * @return {object} the serialized XML string
	 * @public
	 */
	jQuery.sap.serializeXML = function serializeXML(oXMLDocument) {
		var sXMLString = "";
		if (window.ActiveXObject) {
			sXMLString = oXMLDocument.xml;
			if (sXMLString) {
				return sXMLString;
			}
		}
		if (window.XMLSerializer) {
			var serializer = new XMLSerializer();
			sXMLString = serializer.serializeToString(oXMLDocument);
		}
		return sXMLString;
	};

	jQuery.sap.isEqualNode = function(oNode1, oNode2) {
		if (oNode1 === oNode2) {
			return true;
		}
		if (!oNode1 || !oNode2) {
			return false;
		}
		if (oNode1.isEqualNode) {
			return oNode1.isEqualNode(oNode2);
		}
		if (oNode1.nodeType != oNode2.nodeType) {
			return false;
		}
		if (oNode1.nodeValue != oNode2.nodeValue) {
			return false;
		}
		if (oNode1.baseName != oNode2.baseName) {
			return false;
		}
		if (oNode1.nodeName != oNode2.nodeName) {
			return false;
		}
		if (oNode1.nameSpaceURI != oNode2.nameSpaceURI) {
			return false;
		}
		if (oNode1.prefix != oNode2.prefix) {
			return false;
		}
		if (oNode1.nodeType != 1) {
			return true; //ELEMENT_NODE
		}
		if (oNode1.attributes.length != oNode2.attributes.length) {
			return false;
		}
		for (var i = 0; i < oNode1.attributes.length; i++) {
			if (!jQuery.sap.isEqualNode(oNode1.attributes[i], oNode2.attributes[i])) {
				return false;
			}
		}
		if (oNode1.childNodes.length != oNode2.childNodes.length) {
			return false;
		}
		for (var i = 0; i < oNode1.childNodes.length; i++) {
			if (!jQuery.sap.isEqualNode(oNode1.childNodes[i], oNode2.childNodes[i])) {
				return false;
			}
		}
		return true;
	};


	/**
	 * Extracts parse error information from the specified document (if any). If
	 * an error was found the returned object has the following error
	 * information parameters: errorCode, url, reason, srcText, line, linepos,
	 * filepos
	 *
	 * @return oParseError if errors were found, or an object with an errorCode of 0 only
	 * @private
	 */
	jQuery.sap.getParseError = function getParseError(oDocument) {
		var oParseError = {
			errorCode : -1,
			url : "",
			reason : "unknown error",
			srcText : "",
			line : -1,
			linepos : -1,
			filepos : -1
		};

		// IE
		if (!!Device.browser.internet_explorer && oDocument && oDocument.parseError
				&& oDocument.parseError.errorCode != 0) {
			return oDocument.parseError;
		}

		// Firefox or Edge
		if ((!!Device.browser.firefox  || !!Device.browser.edge) && oDocument && oDocument.documentElement
				&& oDocument.documentElement.tagName == "parsererror") {

			var sErrorText = oDocument.documentElement.firstChild.nodeValue, rParserError = /XML Parsing Error: (.*)\nLocation: (.*)\nLine Number (\d+), Column (\d+):(.*)/;

			if (rParserError.test(sErrorText)) {
				oParseError.reason = RegExp.$1;
				oParseError.url = RegExp.$2;
				oParseError.line = parseInt(RegExp.$3, 10);
				oParseError.linepos = parseInt(RegExp.$4, 10);
				oParseError.srcText = RegExp.$5;

			}
			return oParseError;
		}

		// Safari
		if (!!Device.browser.webkit && oDocument && oDocument.documentElement
				&& oDocument.documentElement.tagName == "html"
				&& oDocument.getElementsByTagName("parsererror").length > 0) {

			var sErrorText = jQuery.sap.serializeXML(oDocument), rParserError = /error on line (\d+) at column (\d+): ([^<]*)/;

			if (rParserError.test(sErrorText)) {
				oParseError.reason = RegExp.$3;
				oParseError.url = "";
				oParseError.line = parseInt(RegExp.$1, 10);
				oParseError.linepos = parseInt(RegExp.$2, 10);
				oParseError.srcText = "";

			}
			return oParseError;
		}

		if (!oDocument || !oDocument.documentElement) {
			return oParseError;
		}

		return	{
				errorCode : 0
			};
	};

	return jQuery;

});
jQuery.sap.require("jquery.sap.dom");
jQuery.sap.require("jquery.sap.encoder");
jQuery.sap.require("jquery.sap.events");
jQuery.sap.require("jquery.sap.keycodes");
jQuery.sap.require("jquery.sap.mobile");
jQuery.sap.require("jquery.sap.properties");
jQuery.sap.require("jquery.sap.resources");
jQuery.sap.require("jquery.sap.script");
jQuery.sap.require("jquery.sap.sjax");
jQuery.sap.require("jquery.sap.strings");
jQuery.sap.require("jquery.sap.xml");
