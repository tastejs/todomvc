(function(globals) {
var define, requireModule;

(function() {
  var registry = {}, seen = {};

  define = function(name, deps, callback) {
    registry[name] = { deps: deps, callback: callback };
  };

  requireModule = function(name) {
    if (seen[name]) { return seen[name]; }
    seen[name] = {};

    var mod = registry[name];
    if (!mod) {
      throw new Error("Module '" + name + "' not found.");
    }

    var deps = mod.deps,
        callback = mod.callback,
        reified = [],
        exports;

    for (var i=0, l=deps.length; i<l; i++) {
      if (deps[i] === 'exports') {
        reified.push(exports = {});
      } else {
        reified.push(requireModule(deps[i]));
      }
    }

    var value = callback.apply(this, reified);
    return seen[name] = exports || value;
  };
})();

define("rsvp/all",
  ["rsvp/promise","exports"],
  function(__dependency1__, __exports__) {
    "use strict";
    var Promise = __dependency1__.Promise;
    /* global toString */


    function promiseAtLeast(expected_count, promises) {
      if (Object.prototype.toString.call(promises) !== "[object Array]") {
        throw new TypeError('You must pass an array to all.');
      }

      function canceller() {
        var promise;
        for (var i = 0; i < promises.length; i++) {
          promise = promises[i];

          if (promise && typeof promise.then === 'function' &&
              typeof promise.cancel === 'function') {
            promise.cancel();
          }
        }
      }

      return new Promise(function(resolve, reject, notify) {
        var results = [], remaining = promises.length,
        promise, remaining_count = promises.length - expected_count;

        if (remaining === 0) {
          if (expected_count === 1) {
            resolve();
          } else {
            resolve([]);
          }
        }

        function resolver(index) {
          return function(value) {
            resolveAll(index, value);
          };
        }

        function resolveAll(index, value) {
          results[index] = value;
          if (--remaining === remaining_count) {
            if (remaining_count === 0) {
              resolve(results);
            } else {
              resolve(value);
              canceller();
            }
          }
        }

        function notifier(index) {
          return function(value) {
            notify({"index": index, "value": value});
          };
        }

        function cancelAll(rejectionValue) {
          reject(rejectionValue);
          canceller();
        }

        for (var i = 0; i < promises.length; i++) {
          promise = promises[i];

          if (promise && typeof promise.then === 'function') {
            promise.then(resolver(i), cancelAll, notifier(i));
          } else {
            resolveAll(i, promise);
          }
        }
      }, canceller
      );
    }

    function all(promises) {
      return promiseAtLeast(promises.length, promises);
    }

    function any(promises) {
      return promiseAtLeast(1, promises);
    }


    __exports__.all = all;
    __exports__.any = any;
  });
define("rsvp/async",
  ["exports"],
  function(__exports__) {
    "use strict";
    var browserGlobal = (typeof window !== 'undefined') ? window : {};
    var BrowserMutationObserver = browserGlobal.MutationObserver || browserGlobal.WebKitMutationObserver;
    var async;
    var local = (typeof global !== 'undefined') ? global : this;

    function checkNativePromise() {
      if (typeof Promise === "function" &&
          typeof Promise.resolve === "function") {
        try {
          /* global Promise */
          var promise = new Promise(function(){});
          if ({}.toString.call(promise) === "[object Promise]") {
            return true;
          }
        } catch (e) {}
      }
      return false;
    }

    function useNativePromise() {
      var nativePromise = Promise.resolve();
      return function(callback, arg) {
        nativePromise.then(function () {
          callback(arg);
        });
      };
    }

    // old node
    function useNextTick() {
      return function(callback, arg) {
        process.nextTick(function() {
          callback(arg);
        });
      };
    }

    // node >= 0.10.x
    function useSetImmediate() {
      return function(callback, arg) {
        /* global  setImmediate */
        setImmediate(function(){
          callback(arg);
        });
      };
    }

    function useMutationObserver() {
      var queue = [];

      var observer = new BrowserMutationObserver(function() {
        var toProcess = queue.slice();
        queue = [];

        toProcess.forEach(function(tuple) {
          var callback = tuple[0], arg= tuple[1];
          callback(arg);
        });
      });

      var element = document.createElement('div');
      observer.observe(element, { attributes: true });

      // Chrome Memory Leak: https://bugs.webkit.org/show_bug.cgi?id=93661
      window.addEventListener('unload', function(){
        observer.disconnect();
        observer = null;
      }, false);

      return function(callback, arg) {
        queue.push([callback, arg]);
        element.setAttribute('drainQueue', 'drainQueue');
      };
    }

    function useSetTimeout() {
      return function(callback, arg) {
        local.setTimeout(function() {
          callback(arg);
        }, 1);
      };
    }

    if (typeof setImmediate === 'function') {
      async = useSetImmediate();
    } else if (typeof process !== 'undefined' && {}.toString.call(process) === '[object process]') {
      async = useNextTick();
    } else if (BrowserMutationObserver) {
      async = useMutationObserver();
    } else if (checkNativePromise()) {
      async = useNativePromise();
    } else {
      async = useSetTimeout();
    }


    __exports__.async = async;
  });
define("rsvp/cancellation_error",
  ["exports"],
  function(__exports__) {
    "use strict";
    // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error
    function CancellationError(message) {
      this.name = "cancel";
      if ((message !== undefined) && (typeof message !== "string")) {
        throw new TypeError('You must pass a string.');
      }
      this.message = message || "Default Message";
    }
    CancellationError.prototype = new Error();
    CancellationError.prototype.constructor = CancellationError;


    __exports__.CancellationError = CancellationError;
  });
define("rsvp/config",
  ["rsvp/async","exports"],
  function(__dependency1__, __exports__) {
    "use strict";
    var async = __dependency1__.async;

    var config = {};
    config.async = async;


    __exports__.config = config;
  });
define("rsvp/defer",
  ["rsvp/promise","exports"],
  function(__dependency1__, __exports__) {
    "use strict";
    var Promise = __dependency1__.Promise;

    function defer() {
      var deferred = {
        // pre-allocate shape
        resolve: undefined,
        reject:  undefined,
        promise: undefined
      };

      deferred.promise = new Promise(function(resolve, reject) {
        deferred.resolve = resolve;
        deferred.reject = reject;
      });

      return deferred;
    }


    __exports__.defer = defer;
  });
define("rsvp/events",
  ["exports"],
  function(__exports__) {
    "use strict";
    var Event = function(type, options) {
      this.type = type;

      for (var option in options) {
        if (!options.hasOwnProperty(option)) { continue; }

        this[option] = options[option];
      }
    };

    var indexOf = function(callbacks, callback) {
      for (var i=0, l=callbacks.length; i<l; i++) {
        if (callbacks[i][0] === callback) { return i; }
      }

      return -1;
    };

    var callbacksFor = function(object) {
      var callbacks = object._promiseCallbacks;

      if (!callbacks) {
        callbacks = object._promiseCallbacks = {};
      }

      return callbacks;
    };

    var EventTarget = {
      mixin: function(object) {
        object.on = this.on;
        object.off = this.off;
        object.trigger = this.trigger;
        return object;
      },

      on: function(eventNames, callback, binding) {
        var allCallbacks = callbacksFor(this), callbacks, eventName;
        eventNames = eventNames.split(/\s+/);
        binding = binding || this;

        while (eventName = eventNames.shift()) {
          callbacks = allCallbacks[eventName];

          if (!callbacks) {
            callbacks = allCallbacks[eventName] = [];
          }

          if (indexOf(callbacks, callback) === -1) {
            callbacks.push([callback, binding]);
          }
        }
      },

      off: function(eventNames, callback) {
        var allCallbacks = callbacksFor(this), callbacks, eventName, index;
        eventNames = eventNames.split(/\s+/);

        while (eventName = eventNames.shift()) {
          if (!callback) {
            allCallbacks[eventName] = [];
            continue;
          }

          callbacks = allCallbacks[eventName];

          index = indexOf(callbacks, callback);

          if (index !== -1) { callbacks.splice(index, 1); }
        }
      },

      trigger: function(eventName, options) {
        var allCallbacks = callbacksFor(this),
            callbacks, callbackTuple, callback, binding, event;

        if (callbacks = allCallbacks[eventName]) {
          // Don't cache the callbacks.length since it may grow
          for (var i=0; i<callbacks.length; i++) {
            callbackTuple = callbacks[i];
            callback = callbackTuple[0];
            binding = callbackTuple[1];

            if (typeof options !== 'object') {
              options = { detail: options };
            }

            event = new Event(eventName, options);
            callback.call(binding, event);
          }
        }
      }
    };


    __exports__.EventTarget = EventTarget;
  });
define("rsvp/hash",
  ["rsvp/defer","exports"],
  function(__dependency1__, __exports__) {
    "use strict";
    var defer = __dependency1__.defer;

    function size(object) {
      var s = 0;

      for (var prop in object) {
        s++;
      }

      return s;
    }

    function hash(promises) {
      var results = {}, deferred = defer(), remaining = size(promises);

      if (remaining === 0) {
        deferred.resolve({});
      }

      var resolver = function(prop) {
        return function(value) {
          resolveAll(prop, value);
        };
      };

      var resolveAll = function(prop, value) {
        results[prop] = value;
        if (--remaining === 0) {
          deferred.resolve(results);
        }
      };

      var rejectAll = function(error) {
        deferred.reject(error);
      };

      for (var prop in promises) {
        if (promises[prop] && typeof promises[prop].then === 'function') {
          promises[prop].then(resolver(prop), rejectAll);
        } else {
          resolveAll(prop, promises[prop]);
        }
      }

      return deferred.promise;
    }


    __exports__.hash = hash;
  });
define("rsvp/node",
  ["rsvp/promise","rsvp/all","exports"],
  function(__dependency1__, __dependency2__, __exports__) {
    "use strict";
    var Promise = __dependency1__.Promise;
    var all = __dependency2__.all;

    function makeNodeCallbackFor(resolve, reject) {
      return function (error, value) {
        if (error) {
          reject(error);
        } else if (arguments.length > 2) {
          resolve(Array.prototype.slice.call(arguments, 1));
        } else {
          resolve(value);
        }
      };
    }

    function denodeify(nodeFunc) {
      return function()  {
        var nodeArgs = Array.prototype.slice.call(arguments), resolve, reject;
        var thisArg = this;

        var promise = new Promise(function(nodeResolve, nodeReject) {
          resolve = nodeResolve;
          reject = nodeReject;
        });

        all(nodeArgs).then(function(nodeArgs) {
          nodeArgs.push(makeNodeCallbackFor(resolve, reject));

          try {
            nodeFunc.apply(thisArg, nodeArgs);
          } catch(e) {
            reject(e);
          }
        });

        return promise;
      };
    }


    __exports__.denodeify = denodeify;
  });
define("rsvp/promise",
  ["rsvp/config","rsvp/events","rsvp/cancellation_error","exports"],
  function(__dependency1__, __dependency2__, __dependency3__, __exports__) {
    "use strict";
    var config = __dependency1__.config;
    var EventTarget = __dependency2__.EventTarget;
    var CancellationError = __dependency3__.CancellationError;

    function objectOrFunction(x) {
      return isFunction(x) || (typeof x === "object" && x !== null);
    }

    function isFunction(x){
      return typeof x === "function";
    }

    var Promise = function(resolver, canceller) {
      var promise = this,
      resolved = false;

      if (typeof resolver !== 'function') {
        throw new TypeError('You must pass a resolver function as the sole argument to the promise constructor');
      }

      if ((canceller !== undefined) && (typeof canceller !== 'function')) {
        throw new TypeError('You can only pass a canceller function' +
          ' as the second argument to the promise constructor');
      }

      if (!(promise instanceof Promise)) {
        return new Promise(resolver, canceller);
      }

      var resolvePromise = function(value) {
        if (resolved) { return; }
        resolved = true;
        resolve(promise, value);
      };

      var rejectPromise = function(value) {
        if (resolved) { return; }
        resolved = true;
        reject(promise, value);
      };

      var notifyPromise = function(value) {
        if (resolved) { return; }
        notify(promise, value);
      };

      this.on('promise:failed', function(event) {
        this.trigger('error', { detail: event.detail });
      }, this);

      this.on('error', onerror);

      this.cancel = function () {
        // For now, simply reject the promise and does not propagate the cancel
        // to parent or children
        if (resolved) { return; }
        if (canceller !== undefined) {
          try {
            canceller();
          } catch (e) {
            rejectPromise(e);
            return;
          }
        }
        // Trigger cancel?
        rejectPromise(new CancellationError());
      };

      try {
        resolver(resolvePromise, rejectPromise, notifyPromise);
      } catch(e) {
        rejectPromise(e);
      }
    };

    function onerror(event) {
      if (config.onerror) {
        config.onerror(event.detail);
      }
    }

    var invokeCallback = function(type, promise, callback, event) {
      var hasCallback = isFunction(callback),
          value, error, succeeded, failed;

      if (promise.isFulfilled) { return; }
      if (promise.isRejected) { return; }

      if (hasCallback) {
        try {
          value = callback(event.detail);
          succeeded = true;
        } catch(e) {
          failed = true;
          error = e;
        }
      } else {
        value = event.detail;
        succeeded = true;
      }

      if (handleThenable(promise, value)) {
        return;
      } else if (hasCallback && succeeded) {
        resolve(promise, value);
      } else if (failed) {
        reject(promise, error);
      } else if (type === 'resolve') {
        resolve(promise, value);
      } else if (type === 'reject') {
        reject(promise, value);
      }
    };


    var invokeNotifyCallback = function(promise, callback, event) {
      var value;
      if (typeof callback === 'function') {
        try {
          value = callback(event.detail);
        } catch (e) {
          // stop propagating
          return;
        }
        notify(promise, value);
      } else {
        notify(promise, event.detail);
      }
    };

    Promise.prototype = {
      constructor: Promise,

      isRejected: undefined,
      isFulfilled: undefined,
      rejectedReason: undefined,
      fulfillmentValue: undefined,

      then: function(done, fail, progress) {
        this.off('error', onerror);

        var thenPromise = new this.constructor(function() {},
            function () {
              thenPromise.trigger('promise:cancelled', {});
            });

        if (this.isFulfilled) {
          config.async(function(promise) {
            invokeCallback('resolve', thenPromise, done, { detail: promise.fulfillmentValue });
          }, this);
        }

        if (this.isRejected) {
          config.async(function(promise) {
            invokeCallback('reject', thenPromise, fail, { detail: promise.rejectedReason });
          }, this);
        }

        this.on('promise:resolved', function(event) {
          invokeCallback('resolve', thenPromise, done, event);
        });

        this.on('promise:failed', function(event) {
          invokeCallback('reject', thenPromise, fail, event);
        });

        this.on('promise:notified', function (event) {
          invokeNotifyCallback(thenPromise, progress, event);
        });

        return thenPromise;
      },

      fail: function(fail) {
        return this.then(null, fail);
      },

      always: function(fail) {
        return this.then(fail, fail);
      }
    };

    EventTarget.mixin(Promise.prototype);

    function resolve(promise, value) {
      if (promise === value) {
        fulfill(promise, value);
      } else if (!handleThenable(promise, value)) {
        fulfill(promise, value);
      }
    }

    function handleThenable(promise, value) {
      var then = null,
      resolved;

      try {
        if (promise === value) {
          throw new TypeError("A promises callback cannot return that same promise.");
        }

        if (objectOrFunction(value)) {
          then = value.then;

          if (isFunction(then)) {
            if (isFunction(value.on)) {
              value.on('promise:notified', function (event) {
                notify(promise, event.detail);
              });
            }
            promise.on('promise:cancelled', function(event) {
              if (isFunction(value.cancel)) {
                value.cancel();
              }
            });
            then.call(value, function(val) {
              if (resolved) { return true; }
              resolved = true;

              if (value !== val) {
                resolve(promise, val);
              } else {
                fulfill(promise, val);
              }
            }, function(val) {
              if (resolved) { return true; }
              resolved = true;

              reject(promise, val);
            });

            return true;
          }
        }
      } catch (error) {
        reject(promise, error);
        return true;
      }

      return false;
    }

    function fulfill(promise, value) {
      config.async(function() {
        if (promise.isFulfilled) { return; }
        if (promise.isRejected) { return; }
        promise.trigger('promise:resolved', { detail: value });
        promise.isFulfilled = true;
        promise.fulfillmentValue = value;
      });
    }

    function reject(promise, value) {
      config.async(function() {
        if (promise.isFulfilled) { return; }
        if (promise.isRejected) { return; }
        promise.trigger('promise:failed', { detail: value });
        promise.isRejected = true;
        promise.rejectedReason = value;
      });
    }

    function notify(promise, value) {
      config.async(function() {
        promise.trigger('promise:notified', { detail: value });
      });
    }


    __exports__.Promise = Promise;
  });
define("rsvp/queue",
  ["rsvp/promise","rsvp/resolve","exports"],
  function(__dependency1__, __dependency2__, __exports__) {
    "use strict";
    var Promise = __dependency1__.Promise;
    var resolve = __dependency2__.resolve;

    // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error
    function ResolvedQueueError(message) {
      this.name = "resolved";
      if ((message !== undefined) && (typeof message !== "string")) {
        throw new TypeError('You must pass a string.');
      }
      this.message = message || "Default Message";
    }
    ResolvedQueueError.prototype = new Error();
    ResolvedQueueError.prototype.constructor = ResolvedQueueError;

    var Queue = function() {
      var queue = this,
        promise_list = [],
        promise,
        fulfill,
        reject,
        notify,
        resolved;

      if (!(this instanceof Queue)) {
        return new Queue();
      }

      function canceller() {
        for (var i = 0; i < 2; i++) {
          promise_list[i].cancel();
        }
      }

      promise = new Promise(function(done, fail, progress) {
        fulfill = function (fulfillmentValue) {
          if (resolved) {return;}
          queue.isFulfilled = true;
          queue.fulfillmentValue = fulfillmentValue;
          resolved = true;
          return done(fulfillmentValue);
        };
        reject = function (rejectedReason) {
          if (resolved) {return;}
          queue.isRejected = true;
          queue.rejectedReason = rejectedReason ;
          resolved = true;
          return fail(rejectedReason);
        };
        notify = progress;
      }, canceller);

      promise_list.push(resolve());
      promise_list.push(promise_list[0].then(function () {
        promise_list.splice(0, 2);
        if (promise_list.length === 0) {
          fulfill();
        }
      }));

      queue.cancel = function () {
        if (resolved) {return;}
        resolved = true;
        promise.cancel();
        promise.fail(function (rejectedReason) {
          queue.isRejected = true;
          queue.rejectedReason = rejectedReason;
        });
      };
      queue.then = function () {
        return promise.then.apply(promise, arguments);
      };

      queue.push = function(done, fail, progress) {
        var last_promise = promise_list[promise_list.length - 1],
          next_promise;

        if (resolved) {
          throw new ResolvedQueueError();
        }

        next_promise = last_promise.then(done, fail, progress);
        promise_list.push(next_promise);

        // Handle pop
        last_promise = next_promise.then(function (fulfillmentValue) {
          promise_list.splice(0, 2);
          if (promise_list.length === 0) {
            fulfill(fulfillmentValue);
          } else {
            return fulfillmentValue;
          }
        }, function (rejectedReason) {
          promise_list.splice(0, 2);
          if (promise_list.length === 0) {
            reject(rejectedReason);
          } else {
            throw rejectedReason;
          }
        }, function (notificationValue) {
          if (promise_list[promise_list.length - 1] === last_promise) {
            notify(notificationValue);
          }
          return notificationValue;
        });
        promise_list.push(last_promise);

        return this;
      };
    };

    Queue.prototype = Object.create(Promise.prototype);
    Queue.prototype.constructor = Queue;


    __exports__.Queue = Queue;
    __exports__.ResolvedQueueError = ResolvedQueueError;
  });
define("rsvp/reject",
  ["rsvp/promise","exports"],
  function(__dependency1__, __exports__) {
    "use strict";
    var Promise = __dependency1__.Promise;

    function reject(reason) {
      return new Promise(function (resolve, reject) {
        reject(reason);
      });
    }


    __exports__.reject = reject;
  });
define("rsvp/resolve",
  ["rsvp/promise","exports"],
  function(__dependency1__, __exports__) {
    "use strict";
    var Promise = __dependency1__.Promise;

    function resolve(thenable) {
      return new Promise(function(resolve, reject) {
        if (typeof thenable === "object" && thenable !== null) {
          var then = thenable.then;
          if ((then !== undefined) && (typeof then === "function")) {
            return then.apply(thenable, [resolve, reject]);
          }
        }
        return resolve(thenable);
      }, function () {
        if ((thenable !== undefined) && (thenable.cancel !== undefined)) {
          thenable.cancel();
        }
      });
    }


    __exports__.resolve = resolve;
  });
define("rsvp/rethrow",
  ["exports"],
  function(__exports__) {
    "use strict";
    var local = (typeof global === "undefined") ? this : global;

    function rethrow(reason) {
      local.setTimeout(function() {
        throw reason;
      });
      throw reason;
    }


    __exports__.rethrow = rethrow;
  });
define("rsvp/timeout",
  ["rsvp/promise","exports"],
  function(__dependency1__, __exports__) {
    "use strict";
    var Promise = __dependency1__.Promise;

    function promiseSetTimeout(millisecond, should_reject, message) {
      var timeout_id;

      function resolver(resolve, reject) {
        timeout_id = setTimeout(function () {
          if (should_reject) {
            reject(message);
          } else {
            resolve(message);
          }
        }, millisecond);
      }
      function canceller() {
        clearTimeout(timeout_id);
      }
      return new Promise(resolver, canceller);
    }

    function delay(millisecond, message) {
      return promiseSetTimeout(millisecond, false, message);
    }

    function timeout(millisecond) {
      return promiseSetTimeout(millisecond, true,
                               "Timed out after " + millisecond + " ms");
    }

    Promise.prototype.delay = function(millisecond) {
      return this.then(function (fulfillmentValue) {
        return delay(millisecond, fulfillmentValue);
      });
    };


    __exports__.delay = delay;
    __exports__.timeout = timeout;
  });
define("rsvp",
  ["rsvp/events","rsvp/cancellation_error","rsvp/promise","rsvp/node","rsvp/all","rsvp/queue","rsvp/timeout","rsvp/hash","rsvp/rethrow","rsvp/defer","rsvp/config","rsvp/resolve","rsvp/reject","exports"],
  function(__dependency1__, __dependency2__, __dependency3__, __dependency4__, __dependency5__, __dependency6__, __dependency7__, __dependency8__, __dependency9__, __dependency10__, __dependency11__, __dependency12__, __dependency13__, __exports__) {
    "use strict";
    var EventTarget = __dependency1__.EventTarget;
    var CancellationError = __dependency2__.CancellationError;
    var Promise = __dependency3__.Promise;
    var denodeify = __dependency4__.denodeify;
    var all = __dependency5__.all;
    var any = __dependency5__.any;
    var Queue = __dependency6__.Queue;
    var ResolvedQueueError = __dependency6__.ResolvedQueueError;
    var delay = __dependency7__.delay;
    var timeout = __dependency7__.timeout;
    var hash = __dependency8__.hash;
    var rethrow = __dependency9__.rethrow;
    var defer = __dependency10__.defer;
    var config = __dependency11__.config;
    var resolve = __dependency12__.resolve;
    var reject = __dependency13__.reject;

    function configure(name, value) {
      config[name] = value;
    }


    __exports__.CancellationError = CancellationError;
    __exports__.Promise = Promise;
    __exports__.EventTarget = EventTarget;
    __exports__.all = all;
    __exports__.any = any;
    __exports__.Queue = Queue;
    __exports__.ResolvedQueueError = ResolvedQueueError;
    __exports__.delay = delay;
    __exports__.timeout = timeout;
    __exports__.hash = hash;
    __exports__.rethrow = rethrow;
    __exports__.defer = defer;
    __exports__.denodeify = denodeify;
    __exports__.configure = configure;
    __exports__.resolve = resolve;
    __exports__.reject = reject;
  });
window.RSVP = requireModule("rsvp");
})(window);
