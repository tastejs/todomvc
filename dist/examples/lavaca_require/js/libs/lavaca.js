(function() {
//just a shim for cordova, because the actual dependency will differ between
//Android and iOS
define('cordova',[],function() {
  return window.cordova;
});

define('lavaca/util/extend',[],function() {
  /**
   * Establishes inheritance between types. After a type is extended, it receives its own static
   * convenience method, extend(TSub, overrides).
   * @class lavaca.util.extend
   */
   /**
   * Establishes inheritance between types. After a type is extended, it receives its own static
   * convenience method, extend(TSub, overrides).
   * @method extend
   * @static
   *
   */
   /**
   * Establishes inheritance between types. After a type is extended, it receives its own static
   * convenience method, extend(TSub, overrides).
   * @method extend
   * @static
   * @param {Function} TSub  The child type which will inherit from superType
   * @param {Object} overrides  A hash of key-value pairs that will be added to the subType
   * @return {Function}  The subtype
   *
   */
   /**
   * Establishes inheritance between types. After a type is extended, it receives its own static
   * convenience method, extend(TSub, overrides).
   * @method extend
   * @static
   * @param {Function} TSuper  The base type to extend
   * @param {Function} TSub  The child type which will inherit from superType
   * @param {Object} overrides  A hash of key-value pairs that will be added to the subType
   * @return {Function}  The subtype
   */
  var extend = function(TSuper, TSub, overrides) {
    if (typeof TSuper === 'object') {
      overrides = TSuper;
      TSuper = Object;
      TSub = function() {
        // Empty
      };
    } else if (typeof TSub === 'object') {
      overrides = TSub;
      TSub = TSuper;
      TSuper = Object;
    }
    function ctor() {
      // Empty
    }
    ctor.prototype = TSuper.prototype;
    TSub.prototype = new ctor;
    TSub.prototype.constructor = TSub;
    if (overrides) {
      for (var name in overrides) {
        TSub.prototype[name] = overrides[name];
      }
    }
    TSub.extend = function(T, overrides) {
      if (typeof T === 'object') {
        overrides = T;
        T = function() {
          TSub.apply(this, arguments);
        };
      }
      extend(TSub, T, overrides);
      return T;
    };
    return TSub;
  };

  return extend;

});

define('lavaca/util/Promise',['require','./extend'],function(require) {

  var extend = require('./extend');

  /**
   * Utility type for asynchronous programming
   * @class lavaca.util.Promise
   *
   * @constructor
   *
   * @param {Object} thisp  What the "this" keyword resolves to in callbacks
   */
  var Promise = extend(function(thisp) {
    /**
     * What the "this" keyword resolves to in callbacks
     * @property {Object} thisp
     * @default null
     */
    this.thisp = thisp;
    /**
     * Pending handlers for the success event
     * @property {Array} resolvedQueue
     * @default []
     */
    this.resolvedQueue = [];
    /**
     * Pending handlers for the error event
     * @property {Array} rejectedQueue
     * @default []
     */
    this.rejectedQueue = [];
  }, {
    /**
     * Flag indicating that the promise completed successfully
     * @property {Boolean} succeeded
     * @default false
     */
    succeeded: false,
    /**
     * Flag indicating that the promise failed to complete
     * @property {Boolean} failed
     * @default false
     */
    failed: false,
    /**
     * Queues a callback to be executed when the promise succeeds
     * @method success
     *
     * @param {Function} callback  The callback to execute
     * @return {Lavaca.util.Promise}  This promise (for chaining)
     */
    success: function(callback) {
      if (callback) {
        if (this.succeeded) {
          callback.apply(this.thisp, this.resolveArgs);
        } else {
          this.resolvedQueue.push(callback);
        }
      }
      return this;
    },
    /**
     * Queues a callback to be executed when the promise fails
     * @method error
     *
     * @param {Function} callback  The callback to execute
     * @return {Lavaca.util.Promise}  This promise (for chaining)
     */
    error: function(callback) {
      if (callback) {
        if (this.failed) {
          callback.apply(this.thisp, this.rejectArgs);
        } else {
          this.rejectedQueue.push(callback);
        }
      }
      return this;
    },
    /**
     * Queues a callback to be executed when the promise is either rejected or resolved
     * @method always
     *
     * @param {Function} callback  The callback to execute
     * @return {Lavaca.util.Promise}  This promise (for chaining)
     */
    always: function(callback) {
      return this.then(callback, callback);
    },
    /**
     * Queues up callbacks after the promise is completed
     * @method then
     *
     * @param {Function} resolved  A callback to execute when the operation succeeds
     * @param {Function} rejected  A callback to execute when the operation fails
     * @return {Lavaca.util.Promise}  This promise (for chaining)
     */
    then: function(resolved, rejected) {
      return this
        .success(resolved)
        .error(rejected);
    },
    /**
     * Resolves the promise successfully
     * @method resolve
     *
     * @params {Object} value  Values to pass to the queued success callbacks
     * @return {Lavaca.util.Promise}  This promise (for chaining)
     */
    resolve: function(/* value1, value2, valueN */) {
      if (!this.succeeded && !this.failed) {
        this.succeeded = true;
        this.resolveArgs = [].slice.call(arguments, 0);
        var i = -1,
            callback;
        while (!!(callback = this.resolvedQueue[++i])) {
          callback.apply(this.thisp, this.resolveArgs);
        }
      }
      return this;
    },
    /**
     * Resolves the promise as a failure
     * @method reject
     *
     * @params {String} err  Failure messages
     * @return {Lavaca.util.Promise}  This promise (for chaining)
     */
    reject: function(/* err1, err2, errN */) {
      if (!this.succeeded && !this.failed) {
        this.failed = true;
        this.rejectArgs = [].slice.call(arguments, 0);
        var i = -1,
            callback;
        while (!!(callback = this.rejectedQueue[++i])) {
          callback.apply(this.thisp, this.rejectArgs);
        }
      }
      return this;
    },
    /**
     * Queues this promise to be resolved only after several other promises
     *   have been successfully resolved, or immediately rejected when one
     *   of those promises is rejected
     * @method when
     *
     * @params {Lavaca.util.Promise}  promise  One or more other promises
     * @return {Lavaca.util.Promise}  This promise (for chaining)
     */
    when: function(/* promise1, promise2, promiseN */) {
      var self = this,
          values = [],
          i = -1,
          pendingPromiseCount = arguments.length,
          promise;
      while (!!(promise = arguments[++i])) {
        (function(index) {
          promise
            .success(function(v) {
              values[index] = v;
              if (--pendingPromiseCount < 1) {
                self.resolve.apply(self, values);
              }
            })
            .error(function() {
              self.reject.apply(self, arguments);
            });
        })(i);
      }
      promise = null;
      return this;
    },
    /**
     * Produces a callback that resolves the promise with any number of arguments
     * @method resolver
     * @return {Function}  The callback
     */
    resolver: function() {
      var self = this;
      return function() {
        self.resolve.apply(self, arguments);
      };
    },
    /**
     * Produces a callback that rejects the promise with any number of arguments
     * @method rejector
     *
     * @return {Function}  The callback
     */
    rejector: function() {
      var self = this;
      return function() {
        self.reject.apply(self, arguments);
      };
    }
  });
  /**
   *
   * Creates a promise to be resolved only after several other promises
   *   have been successfully resolved, or immediately rejected when one
   *   of those promises is rejected
   * @method when
   * @static
   * @params {Lavaca.util.Promise}  promise  One or more other promises
   * @return {Lavaca.util.Promise}  The new promise
   */
   /**
   * Creates a promise to be resolved only after several other promises
   *   have been successfully resolved, or immediately rejected when one
   *   of those promises is rejected
   * @method when
   * @static
   * @param {Object} thisp  The execution context of the promise
   * @params {Lavaca.util.Promise}  promise  One or more other promises
   * @return {Lavaca.util.Promise}  The new promise
   */
  Promise.when = function(thisp/*, promise1, promise2, promiseN */) {
    var thispIsPromise = thisp instanceof Promise,
        promise = new Promise(thispIsPromise ? window : thisp),
        args = [].slice.call(arguments, thispIsPromise ? 0 : 1);
    return promise.when.apply(promise, args);
  };

  return Promise;

});

define('lavaca/env/Device',['require','$','cordova','lavaca/util/Promise'],function(require) {

  var $ = require('$'),
      Cordova = require('cordova'),
      Promise = require('lavaca/util/Promise');

  /**
   * Static utility type for working with Cordova (aka PhoneGap) and other non-standard native functionality
   * @class lavaca.env.Device
   */

  var _initHasRun = false,
      _onInit = [];

  var Device = {};

  /**
   * Indicates whether or not the app is being run through Cordova
   * @method isCordova
   * @static
   *
   * @return {Boolean}  True if app is being run through Cordova
   */
  Device.isCordova = function() {
    return !!Cordova;
  };
  /**
   * Registers a plugin to be initialized when the device is ready
   * @method register
   * @static
   *
   * @param {String} name
   * @param {Function} TPlugin  The plugin to register. The plugin should be a constructor function
   */
  Device.register = function(name, TPlugin) {
    function install() {
      if (!window.plugins) {
        window.plugins = {};
      }
      window.plugins[name] = new TPlugin();
    }
    if (_initHasRun) {
      install();
    } else {
      _onInit.push(install);
    }
  };

  /**
   * Executes a Cordova command, if Cordova is available
   * @method exec
   * @static
   *
   * @param {String} className  The name of the native class
   * @param {String} methodName  The name of the class method to call
   * @param {Array} args  Arguments to pass the method
   * @return {Lavaca.util.Promise}  A promise
   */
  Device.exec = function(className, methodName, args) {
    var promise = new Promise(window);
    if (Cordova) {
      Cordova.exec(promise.resolver(), promise.rejector(), className, methodName, args);
    } else {
      promise.reject();
    }
    return promise;
  };

  /**
   * Executes a callback when the device is ready to be used
   * @method init
   * @static
   *
   * @param {Function} callback  The handler to execute when the device is ready
   */
  Device.init = function(callback) {
    if (!Cordova) {
      $(document).ready(callback);
    }
    else if (document.addEventListener) {
      // Android fix
      document.addEventListener('deviceready', callback, false);
    } else {
      $(document).on('deviceready', callback);
    }
  };

  $(document).ready(function() {
    var i = -1,
        installPlugin;
    while (!!(installPlugin = _onInit[++i])) {
      installPlugin();
    }
    _initHasRun = true;
  });

  return Device;

});

define('lavaca/util/Disposable',['require','./extend'],function(require) {

  var extend = require('./extend');

  function _disposeOf(obj) {
    var n,
        o,
        i;
    for (n in obj) {
      if (obj.hasOwnProperty(n)) {
        o = obj[n];
          if (o) {
            if (typeof o === 'object' && typeof o.dispose === 'function') {
              o.dispose();
            } else if (o instanceof Array) {
              for (i = o.length - 1; i > -1; i--) {
                  if (o[i] && typeof o[i].dispose === 'function') {
                    o[i].dispose();
                  } else {
                    _disposeOf(o[i]);
                  }
                }
            }
          }
        }
    }
  }

  /**
   * Abstract type for types that need to ready themselves for GC
   * @class lavaca.util.Disposable
   * @constructor
   *
   */
  var Disposable = extend({
    /**
     * Readies the object to be garbage collected
     * @method dispose
     *
     */
    dispose: function() {
        _disposeOf(this);
    }
  });

  return Disposable;

});
define('mout/object/hasOwn',[],function () {

    /**
     * Safer Object.hasOwnProperty
     */
     function hasOwn(obj, prop){
         return Object.prototype.hasOwnProperty.call(obj, prop);
     }

     return hasOwn;

});

define('mout/object/forIn',[],function () {

    var _hasDontEnumBug,
        _dontEnums;

    function checkDontEnum(){
        _dontEnums = [
                'toString',
                'toLocaleString',
                'valueOf',
                'hasOwnProperty',
                'isPrototypeOf',
                'propertyIsEnumerable',
                'constructor'
            ];

        _hasDontEnumBug = true;

        for (var key in {'toString': null}) {
            _hasDontEnumBug = false;
        }
    }

    /**
     * Similar to Array/forEach but works over object properties and fixes Don't
     * Enum bug on IE.
     * based on: http://whattheheadsaid.com/2010/10/a-safer-object-keys-compatibility-implementation
     */
    function forIn(obj, fn, thisObj){
        var key, i = 0;
        // no need to check if argument is a real object that way we can use
        // it for arrays, functions, date, etc.

        //post-pone check till needed
        if (_hasDontEnumBug == null) checkDontEnum();

        for (key in obj) {
            if (exec(fn, obj, key, thisObj) === false) {
                break;
            }
        }

        if (_hasDontEnumBug) {
            while (key = _dontEnums[i++]) {
                // since we aren't using hasOwn check we need to make sure the
                // property was overwritten
                if (obj[key] !== Object.prototype[key]) {
                    if (exec(fn, obj, key, thisObj) === false) {
                        break;
                    }
                }
            }
        }
    }

    function exec(fn, obj, key, thisObj){
        return fn.call(thisObj, obj[key], key, obj);
    }

    return forIn;

});

define('mout/object/forOwn',['./hasOwn', './forIn'], function (hasOwn, forIn) {

    /**
     * Similar to Array/forEach but works over object properties and fixes Don't
     * Enum bug on IE.
     * based on: http://whattheheadsaid.com/2010/10/a-safer-object-keys-compatibility-implementation
     */
    function forOwn(obj, fn, thisObj){
        forIn(obj, function(val, key){
            if (hasOwn(obj, key)) {
                return fn.call(thisObj, obj[key], key, obj);
            }
        });
    }

    return forOwn;

});

define('mout/lang/isPlainObject',[],function () {

    /**
     * Checks if the value is created by the `Object` constructor.
     */
    function isPlainObject(value) {
        return (!!value
            && typeof value === 'object'
            && value.constructor === Object);
    }

    return isPlainObject;

});

define('mout/object/deepMixIn',['./forOwn', '../lang/isPlainObject'], function (forOwn, isPlainObject) {

    /**
     * Mixes objects into the target object, recursively mixing existing child
     * objects.
     */
    function deepMixIn(target, objects) {
        var i = 0,
            n = arguments.length,
            obj;

        while(++i < n){
            obj = arguments[i];
            if (obj) {
                forOwn(obj, copyProp, target);
            }
        }

        return target;
    }

    function copyProp(val, key) {
        var existing = this[key];
        if (isPlainObject(val) && isPlainObject(existing)) {
            deepMixIn(existing, val);
        } else {
            this[key] = val;
        }
    }

    return deepMixIn;

});

define('lavaca/events/EventDispatcher',['require','lavaca/util/Disposable','mout/object/deepMixIn'],function(require) {

  var Disposable = require('lavaca/util/Disposable'),
      deepMixIn = require('mout/object/deepMixIn');

  /**
   * Basic event dispatcher type
   * @class lavaca.events.EventDispatcher
   * @extends lavaca.util.Disposable
   * @constructor
   *
   */
  var EventDispatcher = Disposable.extend({
    /**
     * When true, do not fire events
     * @property suppressEvents
     * @type Boolean
     * @default false
     *
     */
    suppressEvents: false,
    /**
     * Bind an event handler to this object
     * @method on
     *
     * @param {String} type  The name of the event
     * @param {Function} callback  The function to execute when the event occurs
     * @return {Lavaca.events.EventDispatcher}  This event dispatcher (for chaining)
     */
    /**
     * Bind an event handler to this object
     * @method on
     *
     * @param {String} type  The name of the event
     * @param {Function} callback  The function to execute when the event occurs
     * @param {Object} thisp  The context of the handler
     * @return {Lavaca.events.EventDispatcher}  This event dispatcher (for chaining)
     */
    on: function(type, callback, thisp) {
      var calls = this.callbacks || (this.callbacks = {}),
          list = calls[type] || (calls[type] = []);
      list[list.length] = {fn: callback, thisp: thisp};
      return this;
    },
    /**
     * Unbinds all event handler from this object
     * @method off
     *
     * @return {Lavaca.events.EventDispatcher}  This event dispatcher (for chaining)
     */
    /**
     * Unbinds all event handlers for an event
     * @method off
     *
     * @param {String} type  The name of the event
     * @return {Lavaca.events.EventDispatcher}  This event dispatcher (for chaining)
     */
    /**
     * Unbinds a specific event handler
     * @method off
     *
     * @param {String} type  The name of the event
     * @param {Function} callback  The function handling the event
     * @return {Lavaca.events.EventDispatcher}  This event dispatcher (for chaining)
     */
    /**
     * Unbinds a specific event handler
     * @method off
     *
     * @param {String} type  The name of the event
     * @param {Function} callback  The function handling the event
     * @param {Object} thisp  The context of the handler
     * @return {Lavaca.events.EventDispatcher}  This event dispatcher (for chaining)
     */
    off: function(type, callback, thisp) {
      var calls = this.callbacks,
          list,
          handler,
          i = -1,
          newList,
          isCallback,
          isThisp;
      if (!type) {
        delete this.callbacks;
      } else if (calls) {
        if (!callback) {
          delete calls[type];
        } else {
          list = calls[type];
          if (list) {
            newList = calls[type] = [];
            while (!!(handler = list[++i])) {
              isCallback = handler.fn === callback ||
                           handler.fn.fn === callback ||
                           (handler.fn.guid && handler.fn.guid === callback.guid) || // Check if is jQuery proxy of callback
                           (handler.fn._zid && handler.fn._zid === callback._zid); // Check if is Zepto proxy of callback
              isThisp = thisp && (handler.thisp === thisp || handler.fn.thisp === thisp);
              if (!isCallback || (thisp && !isThisp)) {
                newList[newList.length] = handler;
              }
            }
          }
        }
      }
      return this;
    },
    /**
     * Dispatches an event
     * @method trigger
     *
     * @param {String} type  The type of event to dispatch
     * @return {Lavaca.events.EventDispatcher}  This event dispatcher (for chaining)
     */
    /**
     * Dispactches an event with additional parameters
     * @method trigger
     *
     * @param {String} type  The type of event to dispatch
     * @param {Object} params  Additional data points to add to the event
     * @return {Lavaca.events.EventDispatcher}  This event dispatcher (for chaining)
     */
    trigger: function(type, params) {
      if (!this.suppressEvents && this.callbacks) {
        var list = this.callbacks[type],
            event = this.createEvent(type, params),
            i = -1,
            handler;
        if (list) {
          while (!!(handler = list[++i])) {
            handler.fn.apply(handler.thisp || this, [event]);
          }
        }
      }
      return this;
    },
    /**
     * Creates an event object
     * @method createEvent
     *
     * @param {String} type  The type of event to create
     * @return {Object}  The event object
     */
     /**
     * Creates an event object with additional params
     * @method createEvent
     *
     * @param {String} type  The type of event to create
     * @param {Object} params  Additional data points to add to the event
     * @return {Object}  The event object
     */
    createEvent: function(type, params) {
      return deepMixIn({}, params || {}, {
        type: type,
        target: params && params.target ? params.target : this,
        currentTarget: this
      });
    }
  });

  return EventDispatcher;

});

define('lavaca/env/ChildBrowser',['require','lavaca/env/Device','lavaca/events/EventDispatcher','lavaca/util/Promise'],function(require) {

  var Device = require('lavaca/env/Device'),
      EventDispatcher = require('lavaca/events/EventDispatcher'),
      Promise = require('lavaca/util/Promise');

  /**
   * A sub-browser management utility (also accessible via window.plugins.childBrowser)
   * @class lavaca.env.ChildBrowser
   * @extends Lavaca.events.EventDispatcher
   *
   * @event open
   * @event close
   * @event change
   *
   * @constructor
   */
  var ChildBrowser = EventDispatcher.extend({
    /**
     * Opens a web page in the child browser (or navigates to it)
     * @method showWebPage
     *
     * @param {String} loc  The URL to open
     * @return {Lavaca.util.Promise}  A promise
     */
    showWebPage: function(loc) {
      if (Device.isCordova()) {
        return Device
          .exec('ChildBrowser', 'showWebPage', [loc])
          .error(function() {
            window.location.href = loc;
          });
      } else {
        window.open(loc);
        return new Promise(window).resolve();
      }
    },
    /**
     * Closes the child browser, if it's open
     * @method close
     *
     * @return {Lavaca.util.Promise}  A promise
     */
    close: function() {
      return Device.exec('ChildBrowser', 'close', []);
    }
  });

  Device.register('childBrowser', ChildBrowser);

  return ChildBrowser;

});

define('lavaca/env/Detection',['require','$'],function(require) {
  var $ = require('$');
  var Detection = {};
  Detection.agent = navigator.userAgent.toLowerCase();
  Detection.scrWidth = screen.width;
  Detection.scrHeight = screen.height;
  Detection.viewportWidth = window.innerWidth;
  Detection.viewportHeight = window.innerHeight;
  Detection.elemWidth = document.documentElement.clientWidth;
  Detection.elemHeight = document.documentElement.clientHeight;
  Detection.otherBrowser = (Detection.agent.search(/series60/i) > -1) || (Detection.agent.search(/symbian/i) > -1) || (Detection.agent.search(/windows\sce/i) > -1) || (Detection.agent.search(/blackberry/i) > -1);
  Detection.mobileOS = typeof orientation !== 'undefined';
  Detection.touchOS = 'ontouchstart' in document.documentElement;
  Detection.blackberry = Detection.agent.search(/blackberry/i) > -1;
  Detection.ipad = Detection.agent.search(/ipad/i) > -1;
  Detection.ipod = Detection.agent.search(/ipod/i) > -1;
  Detection.iphone = Detection.agent.search(/iphone/i) > -1;
  Detection.palm = Detection.agent.search(/palm/i) > -1;
  Detection.symbian = Detection.agent.search(/symbian/i) > -1;
  Detection.iOS = Detection.iphone || Detection.ipod || Detection.ipad;
  Detection.iOS5 = Detection.iOS && Detection.agent.search(/os 5_/i) > 0;
  Detection.iOSChrome = Detection.iOS && Detection.agent.search(/CriOS/i) > 0;
  Detection.android = (Detection.agent.search(/android/i) > -1) || (!Detection.iOS && !Detection.otherBrowser && Detection.touchOS && Detection.mobileOS);
  Detection.android2 = Detection.android && (Detection.agent.search(/android\s2/i) > -1);
  Detection.isMobile = Detection.android || Detection.iOS || Detection.mobileOS || Detection.touchOS;
  Detection.android23AndBelow = (function() {
    var matches = Detection.agent.match(/android\s(\d)\.(\d)/i);
    var vi, vd;
    if (Array.isArray(matches) && matches.length === 3) {
      vi = parseInt(matches[1], 10);
      vd = parseInt(matches[2], 10);
      return (vi === 2 && vd < 3) || vi < 2;
    }
    return false;
  }());
  Detection.iOS4AndBelow = (function() {
    var matches = Detection.agent.match(/os\s(\d)_/i);
    var v;
    if (Array.isArray(matches) && matches.length === 2) {
      v = parseInt(matches[1], 10);
      return v <= 4;
    }
    return false;
  }());
  Detection.addCustomDetection = function(condition, feature, selector) {
    var el;
    if (Detection.hasOwnProperty(feature)) {
      throw Error('Namespace "' + feature + '" is already taken by Detection module');
    }
    Detection[feature] = condition;
    if (selector !== null) {
      el = selector ? $(selector) : $(document.documentElement);
      el.toggleClass(feature, typeof condition === 'function' ? condition() : condition);
    }
  };
  Detection.animationEnabled = !Detection.android;
  return Detection;
});
define('lavaca/env/Device',['require','$','cordova','lavaca/util/Promise'],function(require) {

  var $ = require('$'),
      Cordova = require('cordova'),
      Promise = require('lavaca/util/Promise');

  /**
   * Static utility type for working with Cordova (aka PhoneGap) and other non-standard native functionality
   * @class lavaca.env.Device
   */

  var _initHasRun = false,
      _onInit = [];

  var Device = {};

  /**
   * Indicates whether or not the app is being run through Cordova
   * @method isCordova
   * @static
   *
   * @return {Boolean}  True if app is being run through Cordova
   */
  Device.isCordova = function() {
    return !!Cordova;
  };
  /**
   * Registers a plugin to be initialized when the device is ready
   * @method register
   * @static
   *
   * @param {String} name
   * @param {Function} TPlugin  The plugin to register. The plugin should be a constructor function
   */
  Device.register = function(name, TPlugin) {
    function install() {
      if (!window.plugins) {
        window.plugins = {};
      }
      window.plugins[name] = new TPlugin();
    }
    if (_initHasRun) {
      install();
    } else {
      _onInit.push(install);
    }
  };

  /**
   * Executes a Cordova command, if Cordova is available
   * @method exec
   * @static
   *
   * @param {String} className  The name of the native class
   * @param {String} methodName  The name of the class method to call
   * @param {Array} args  Arguments to pass the method
   * @return {Lavaca.util.Promise}  A promise
   */
  Device.exec = function(className, methodName, args) {
    var promise = new Promise(window);
    if (Cordova) {
      Cordova.exec(promise.resolver(), promise.rejector(), className, methodName, args);
    } else {
      promise.reject();
    }
    return promise;
  };

  /**
   * Executes a callback when the device is ready to be used
   * @method init
   * @static
   *
   * @param {Function} callback  The handler to execute when the device is ready
   */
  Device.init = function(callback) {
    if (!Cordova) {
      $(document).ready(callback);
    }
    else if (document.addEventListener) {
      // Android fix
      document.addEventListener('deviceready', callback, false);
    } else {
      $(document).on('deviceready', callback);
    }
  };

  $(document).ready(function() {
    var i = -1,
        installPlugin;
    while (!!(installPlugin = _onInit[++i])) {
      installPlugin();
    }
    _initHasRun = true;
  });

  return Device;

});

define('lavaca/events/EventDispatcher',['require','lavaca/util/Disposable','mout/object/deepMixIn'],function(require) {

  var Disposable = require('lavaca/util/Disposable'),
      deepMixIn = require('mout/object/deepMixIn');

  /**
   * Basic event dispatcher type
   * @class lavaca.events.EventDispatcher
   * @extends lavaca.util.Disposable
   * @constructor
   *
   */
  var EventDispatcher = Disposable.extend({
    /**
     * When true, do not fire events
     * @property suppressEvents
     * @type Boolean
     * @default false
     *
     */
    suppressEvents: false,
    /**
     * Bind an event handler to this object
     * @method on
     *
     * @param {String} type  The name of the event
     * @param {Function} callback  The function to execute when the event occurs
     * @return {Lavaca.events.EventDispatcher}  This event dispatcher (for chaining)
     */
    /**
     * Bind an event handler to this object
     * @method on
     *
     * @param {String} type  The name of the event
     * @param {Function} callback  The function to execute when the event occurs
     * @param {Object} thisp  The context of the handler
     * @return {Lavaca.events.EventDispatcher}  This event dispatcher (for chaining)
     */
    on: function(type, callback, thisp) {
      var calls = this.callbacks || (this.callbacks = {}),
          list = calls[type] || (calls[type] = []);
      list[list.length] = {fn: callback, thisp: thisp};
      return this;
    },
    /**
     * Unbinds all event handler from this object
     * @method off
     *
     * @return {Lavaca.events.EventDispatcher}  This event dispatcher (for chaining)
     */
    /**
     * Unbinds all event handlers for an event
     * @method off
     *
     * @param {String} type  The name of the event
     * @return {Lavaca.events.EventDispatcher}  This event dispatcher (for chaining)
     */
    /**
     * Unbinds a specific event handler
     * @method off
     *
     * @param {String} type  The name of the event
     * @param {Function} callback  The function handling the event
     * @return {Lavaca.events.EventDispatcher}  This event dispatcher (for chaining)
     */
    /**
     * Unbinds a specific event handler
     * @method off
     *
     * @param {String} type  The name of the event
     * @param {Function} callback  The function handling the event
     * @param {Object} thisp  The context of the handler
     * @return {Lavaca.events.EventDispatcher}  This event dispatcher (for chaining)
     */
    off: function(type, callback, thisp) {
      var calls = this.callbacks,
          list,
          handler,
          i = -1,
          newList,
          isCallback,
          isThisp;
      if (!type) {
        delete this.callbacks;
      } else if (calls) {
        if (!callback) {
          delete calls[type];
        } else {
          list = calls[type];
          if (list) {
            newList = calls[type] = [];
            while (!!(handler = list[++i])) {
              isCallback = handler.fn === callback ||
                           handler.fn.fn === callback ||
                           (handler.fn.guid && handler.fn.guid === callback.guid) || // Check if is jQuery proxy of callback
                           (handler.fn._zid && handler.fn._zid === callback._zid); // Check if is Zepto proxy of callback
              isThisp = thisp && (handler.thisp === thisp || handler.fn.thisp === thisp);
              if (!isCallback || (thisp && !isThisp)) {
                newList[newList.length] = handler;
              }
            }
          }
        }
      }
      return this;
    },
    /**
     * Dispatches an event
     * @method trigger
     *
     * @param {String} type  The type of event to dispatch
     * @return {Lavaca.events.EventDispatcher}  This event dispatcher (for chaining)
     */
    /**
     * Dispactches an event with additional parameters
     * @method trigger
     *
     * @param {String} type  The type of event to dispatch
     * @param {Object} params  Additional data points to add to the event
     * @return {Lavaca.events.EventDispatcher}  This event dispatcher (for chaining)
     */
    trigger: function(type, params) {
      if (!this.suppressEvents && this.callbacks) {
        var list = this.callbacks[type],
            event = this.createEvent(type, params),
            i = -1,
            handler;
        if (list) {
          while (!!(handler = list[++i])) {
            handler.fn.apply(handler.thisp || this, [event]);
          }
        }
      }
      return this;
    },
    /**
     * Creates an event object
     * @method createEvent
     *
     * @param {String} type  The type of event to create
     * @return {Object}  The event object
     */
     /**
     * Creates an event object with additional params
     * @method createEvent
     *
     * @param {String} type  The type of event to create
     * @param {Object} params  Additional data points to add to the event
     * @return {Object}  The event object
     */
    createEvent: function(type, params) {
      return deepMixIn({}, params || {}, {
        type: type,
        target: params && params.target ? params.target : this,
        currentTarget: this
      });
    }
  });

  return EventDispatcher;

});

define('lavaca/fx/Transform',['require','$'],function(require) {

  var $ = require('$');

  var _props = {
        transform: 'transform',
        webkitTransform: '-webkit-transform',
        MozTransform: '-moz-transform',
        OTransform: '-o-transform',
        MSTransform: '-ms-transform'
      },
      _prop,
      _cssProp,
      _3d = false,
      UNDEFINED;

  var Transform = {};

  (function() {
    var style = document.createElement('div').style,
        s;
    for (s in _props) {
      if (s in style) {
        _prop = s;
        _cssProp = _props[s];
        style[s] = 'translate3d(0,0,0)';
        _3d = style[s].indexOf('translate3d') > -1 && navigator.userAgent.indexOf('Android') === -1;
        break;
      }
    }
  })();

  function _isUndefined(value) {
    return value === UNDEFINED;
  }

  function _toOriginUnit(v) {
    return typeof v === 'number' ? v * 100 + '%' : v;
  }

  function _scrubRotateValue(v) {
    return typeof v === 'number' ? v + 'deg' : v;
  }

  function _scrubTranslateValue(v) {
    return typeof v === 'number' ? v + 'px' : v;
  }

  function _scrubScaleValue(v) {
    return typeof v === 'number' ? v + ',' + v : v;
  }

  function _scrubTransformValue(prop, value) {
    var isRotate = prop.indexOf('rotate') === 0,
        isScale = prop === 'scale',
        isTranslate = prop.indexOf('translate') === 0,
        //isAxisSpecific = /(X|Y|Z)$/.test(prop),
        p,
        css = [];
    if (typeof value === 'object') {
      for (p in value) {
        css.push(prop
          + p.toUpperCase()
          + '('
          + (isTranslate
              ? _scrubTranslateValue(value[p])
              : isRotate
                ? _scrubRotateValue(value[p])
                : isScale
                  ? _scrubScaleValue(value[p])
                  : value[p])
          + ')');
      }
    } else {
      if (isScale) {
        value = _scrubScaleValue(value);
      } else if (isRotate) {
        value = _scrubRotateValue(value);
      } else if (isTranslate) {
        value = _scrubTranslateValue(value);
      }
      css.push(prop + '(' + value + ')');
    }
    return css.join(' ');
  }

  /**
   * Static utility type for working with CSS transforms
   * @class lavaca.fx.Transform
   */

  /**
   * Whether or not transforms are supported by the browser
   * @method isSupported
   * @static
   *
   * @return {Boolean}  True when transforms are supported
   */
  Transform.isSupported = function() {
    return !!_prop;
  };

  /**
   * Whether or not 3D transforms are supported by the browser
   * @method is3dSupported
   * @static
   *
   * @return {Boolean}  True when 3D transforms are supported
   */
  Transform.is3dSupported = function() {
    return _3d;
  };

  /**
   * Converts a transform hash into a CSS string
   * @method toCSS
   * @static
   *
   * @param {Object} opts  A hash of CSS transform values, with properties in
   *      the form {translateX: 1, translateY: 1} or {translate: {x: 1, y: 1}}
   * @opt {Object} translate  An object or string containing the translation values
   * @opt {Object} translateX  A string (in any unit) or number (in pixels) representing the X translation value
   * @opt {Object} translateY  A string (in any unit) or number (in pixels) representing the Y translation value
   * @opt {Object} translateZ  A string (in any unit) or number (in pixels) representing the Z translation value
   * @opt {String} translate3d  A string containing the 3D translation values
   * @opt {Object} rotate  An object, string, or number (in degrees) containing the rotation value(s)
   * @opt {Object} rotateX  A string (in any unit) or number (in degrees) representing the X rotation value
   * @opt {Object} rotateY  A string (in any unit) or number (in degrees) representing the Y rotation value
   * @opt {Object} rotateZ  A string (in any unit) or number (in degrees) representing the Z rotation value
   * @opt {String} rotate3d  A string containing the 3D rotation values
   * @opt {Object} scale  An object, string or number (in percentage points) containing the scale value(s)
   * @opt {Object} scaleX  A string (in any unit) or number (in percentage points) representing the X scale value
   * @opt {Object} scaleY  A string (in any unit) or number (in percentage points) representing the Y scale value
   * @opt {Object} scaleZ  A string (in any unit) or number (in percentage points) representing the Z scale value
   * @opt {String} scale3d  Astring containing the 3D scale values
   * @opt {Object} skew  An object or string containing the skew values
   * @opt {Object} skewX  A string (in any unit) or number (in pixels) representing the X skew value
   * @opt {Object} skewY  A string (in any unit) or number (in pixels) representing the Y skew value
   * @opt {String} matrix  A string containing the matrix transform values
   * @opt {String} matrix3d  A string containing the 3D matrix transform values
   * @opt {String} perspective  A string containing the perspective transform values
   * @return {String}  The generated CSS string
   */
  Transform.toCSS = function(opts) {
    var css = [],
        prop;
    if (typeof opts === 'object') {
      for (prop in opts) {
        css.push(_scrubTransformValue(prop, opts[prop]));
      }
    } else {
      css.push(opts);
    }
    return css.join(' ');
  };

  /**
   * Gets the name of the transform CSS property
   * @method cssProperty
   * @static
   *
   * @return {String}  The name of the CSS property
   */
  Transform.cssProperty = function() {
    return _cssProp;
  };

  /**
   * Transforms an element
   * @method $.fn.transform
   *
   * @param {String} value  The CSS transform string
   * @return {jQuery}  The jQuery object, for chaining
   */
  /**
   * Transforms an element
   * @method $.fn.transform
   *
   * @param {Object} opt  A hash of CSS transform values, with properties in
   *      the form {translateX: 1, translateY: 1} or {translate: {x: 1, y: 1}}
   * @opt {Object} translate  An object or string containing the translation values
   * @opt {Object} translateX  A string (in any unit) or number (in pixels) representing the X translation value
   * @opt {Object} translateY  A string (in any unit) or number (in pixels) representing the Y translation value
   * @opt {Object} translateZ  A string (in any unit) or number (in pixels) representing the Z translation value
   * @opt {String} translate3d  A string containing the 3D translation values
   * @opt {Object} rotate  An object, string, or number (in degrees) containing the rotation value(s)
   * @opt {Object} rotateX  A string (in any unit) or number (in degrees) representing the X rotation value
   * @opt {Object} rotateY  A string (in any unit) or number (in degrees) representing the Y rotation value
   * @opt {Object} rotateZ  A string (in any unit) or number (in degrees) representing the Z rotation value
   * @opt {String} rotate3d  A string containing the 3D rotation values
   * @opt {Object} scale  An object, string or number (in percentage points) containing the scale value(s)
   * @opt {Object} scaleX  A string (in any unit) or number (in percentage points) representing the X scale value
   * @opt {Object} scaleY  A string (in any unit) or number (in percentage points) representing the Y scale value
   * @opt {Object} scaleZ  A string (in any unit) or number (in percentage points) representing the Z scale value
   * @opt {String} scale3d  Astring containing the 3D scale values
   * @opt {Object} skew  An object or string containing the skew values
   * @opt {Object} skewX  A string (in any unit) or number (in pixels) representing the X skew value
   * @opt {Object} skewY  A string (in any unit) or number (in pixels) representing the Y skew value
   * @opt {String} matrix  A string containing the matrix transform values
   * @opt {String} matrix3d  A string containing the 3D matrix transform values
   * @opt {String} perspective  A string containing the perspective transform values
   * @return {jQuery}  The jQuery object, for chaining
   */
  /**
   * Transforms an element
   * @method $.fn.transform
   *
   * @param {String} value  The CSS transform string
   * @param {String} origin  The CSS transform origin
   * @return {jQuery}  The jQuery object, for chaining
   */
  /**
   * Transforms an element
   * @method $.fn.transform
   *
   * @param {Object} opt  A hash of CSS transform values, with properties in
   *      the form {translateX: 1, translateY: 1} or {translate: {x: 1, y: 1}}
   * @opt {Object} translate  An object or string containing the translation values
   * @opt {Object} translateX  A string (in any unit) or number (in pixels) representing the X translation value
   * @opt {Object} translateY  A string (in any unit) or number (in pixels) representing the Y translation value
   * @opt {Object} translateZ  A string (in any unit) or number (in pixels) representing the Z translation value
   * @opt {String} translate3d  A string containing the 3D translation values
   * @opt {Object} rotate  An object, string, or number (in degrees) containing the rotation value(s)
   * @opt {Object} rotateX  A string (in any unit) or number (in degrees) representing the X rotation value
   * @opt {Object} rotateY  A string (in any unit) or number (in degrees) representing the Y rotation value
   * @opt {Object} rotateZ  A string (in any unit) or number (in degrees) representing the Z rotation value
   * @opt {String} rotate3d  A string containing the 3D rotation values
   * @opt {Object} scale  An object, string or number (in percentage points) containing the scale value(s)
   * @opt {Object} scaleX  A string (in any unit) or number (in percentage points) representing the X scale value
   * @opt {Object} scaleY  A string (in any unit) or number (in percentage points) representing the Y scale value
   * @opt {Object} scaleZ  A string (in any unit) or number (in percentage points) representing the Z scale value
   * @opt {String} scale3d  Astring containing the 3D scale values
   * @opt {Object} skew  An object or string containing the skew values
   * @opt {Object} skewX  A string (in any unit) or number (in pixels) representing the X skew value
   * @opt {Object} skewY  A string (in any unit) or number (in pixels) representing the Y skew value
   * @opt {String} matrix  A string containing the matrix transform values
   * @opt {String} matrix3d  A string containing the 3D matrix transform values
   * @opt {String} perspective  A string containing the perspective transform values
   * @param {String} origin  The CSS transform origin
   * @return {jQuery}  The jQuery object, for chaining
   */
  /**
   * Transforms an element
   * @method $.fn.transform
   *
   * @param {String} value  The CSS transform string
   * @param {Object} origin  The CSS transform origin, in the form {x: N, y: N},
   *      where N is a decimal percentage between -1 and 1 or N is a pixel value > 1 or < -1.
   * @return {jQuery}  The jQuery object, for chaining
   */
  /**
   * Transforms an element
   * @method $.fn.transform
   *
   * @param {Object} opt  A hash of CSS transform values, with properties in
   *      the form {translateX: 1, translateY: 1} or {translate: {x: 1, y: 1}}
   * @opt {Object} translate  An object or string containing the translation values
   * @opt {Object} translateX  A string (in any unit) or number (in pixels) representing the X translation value
   * @opt {Object} translateY  A string (in any unit) or number (in pixels) representing the Y translation value
   * @opt {Object} translateZ  A string (in any unit) or number (in pixels) representing the Z translation value
   * @opt {String} translate3d  A string containing the 3D translation values
   * @opt {Object} rotate  An object, string, or number (in degrees) containing the rotation value(s)
   * @opt {Object} rotateX  A string (in any unit) or number (in degrees) representing the X rotation value
   * @opt {Object} rotateY  A string (in any unit) or number (in degrees) representing the Y rotation value
   * @opt {Object} rotateZ  A string (in any unit) or number (in degrees) representing the Z rotation value
   * @opt {String} rotate3d  A string containing the 3D rotation values
   * @opt {Object} scale  An object, string or number (in percentage points) containing the scale value(s)
   * @opt {Object} scaleX  A string (in any unit) or number (in percentage points) representing the X scale value
   * @opt {Object} scaleY  A string (in any unit) or number (in percentage points) representing the Y scale value
   * @opt {Object} scaleZ  A string (in any unit) or number (in percentage points) representing the Z scale value
   * @opt {String} scale3d  Astring containing the 3D scale values
   * @opt {Object} skew  An object or string containing the skew values
   * @opt {Object} skewX  A string (in any unit) or number (in pixels) representing the X skew value
   * @opt {Object} skewY  A string (in any unit) or number (in pixels) representing the Y skew value
   * @opt {String} matrix  A string containing the matrix transform values
   * @opt {String} matrix3d  A string containing the 3D matrix transform values
   * @opt {String} perspective  A string containing the perspective transform values
   * @param {Object} origin  The CSS transform origin, in the form {x: N, y: N},
   *      where N is a decimal percentage between -1 and 1 or N is a pixel value > 1 or < -1.
   * @return {jQuery}  The jQuery object, for chaining
   */
  $.fn.transform = function(value, origin) {
    if (Transform.isSupported()) {
      value = Transform.toCSS(value);
      if (origin) {
        if (typeof origin === 'object') {
          origin = _toOriginUnit(origin.x) + (_isUndefined(origin.y) ? '' : ' ' + _toOriginUnit(origin.y));
        }
      }
      this.each(function() {
        this.style[_prop] = value;
        if (origin) {
          this.style[_prop + 'Origin'] = origin;
        }
      });
    }
    return this;
  };

  return Transform;

});

define('lavaca/fx/Animation',['require','$','./Transform'],function(require) {

  var $ = require('$'),
      Transform = require('./Transform');

  var Animation = {};

  var _props = {
        animation: ['animation', 'animationend', 'keyframes'],
        webkitAnimation: ['-webkit-animation', 'webkitAnimationEnd', '-webkit-keyframes'],
        MozAnimation: ['-moz-animation', 'animationend', '-moz-keyframes'],
        OAnimation: ['-o-animation', 'oAnimationEnd', '-o-keyframes'],
        MSAnimation: ['-ms-animation', 'MSAnimationEnd', '-ms-keyframes']
      },
      _prop,
      _cssProp,
      _declaration,
      _event;

  (function() {
    var style = document.createElement('div').style,
        s,
        opts;
    for (s in _props) {
      if (s in style) {
        opts = _props[s];
        _prop = s;
        _cssProp = opts[0];
        _event = opts[1];
        _declaration = opts[2];
        break;
      }
    }
  })();

  /**
   * Static utility type for working with CSS keyframe animations
   * @class lavaca.fx.Animation
   */

  /**
   * Whether or not animations are supported by the browser
   * @method isSupported
   * @static
   *
   * @return {Boolean}  True if CSS keyframe animations are supported
   */
  Animation.isSupported = function() {
    return !!_prop;
  };

  /**
   * Converts a list of keyframes to a CSS animation
   * @method keyframesToCSS
   * @static
   *
   * @param {String} name  The name of the keyframe animation
   * @param {Object} keyframes  A list of timestamped keyframes in the form {'0%': {color: 'red'}, '100%': 'color: blue'}
   * @return {String}  The CSS keyframe animation declaration
   */
  Animation.keyframesToCSS = function(name, keyframes) {
    var css = ['@', _declaration, ' ', name, '{'],
    time,
    keyframe,
    prop,
    value;
    for (time in keyframes) {
      css.push(time, '{');
      keyframe = keyframes[time];
      if (typeof keyframe === 'string') {
        css.push(keyframe);
      } else {
        for (prop in keyframe) {
          value = keyframe[prop];
          if (prop === 'transform' && Transform) {
            prop = Transform.cssProperty();
            value = Transform.toCSS(value);
          }
          css.push(prop, ':', value, ';');
        }
      }
      css.push('}');
    }
    css.push('}');
    return css.join('');
  };

  /**
   * Generates a keyframe animation
   * @method generateKeyframes
   * @static
   *
   * @param {Object} keyframes  A list of timestamped keyframes in the form {'0%': {color: 'red'}, '100%': 'color: blue'}
   * @return {String}  The name fo the animation
   */
  /**
   * Generates a keyframe animation
   * @method generateKeyframes
   * @static
   * @param {String} name  The name of the animation
   * @param {Object} keyframes  A list of timestamped keyframes in the form {'0%': {color: 'red'}, '100%': 'color: blue'}
   * @return {String}  The name fo the animation
   */
  Animation.generateKeyframes = function(name, keyframes) {
    if (typeof name === 'object') {
      keyframes = name;
      name = 'a' + new Date().getTime();
    }
    var css = Animation.keyframesToCSS(name, keyframes);
    $('<style>' + css + '</style>').appendTo('head');
    return name;
  };

  /**
   * Gets the name of the animation CSS property
   * @method cssProperty
   * @static
   *
   * @return {String}  The name of the CSS property
   */
  Animation.cssProperty = function() {
    return _cssProp;
  };

  /**
   * Applies a keyframe animation to an element
   * @method $.fn.keyframe
   *
   * @param {String} name  The name of the animation
   * @param {Object} options  Options for the animation
   * @opt {Number} duration  The number of milliseconds that the animation lasts
   * @opt {String} easing  The name of a CSS easing function
   * @default 'linear'
   * @opt {Number} delay  The number of milliseconds before the animation should start
   * @default 0
   * @opt {Object} iterations  Either the number of iterations to play the animation or 'infinite'
   * @default 1
   * @opt {String} direction  The name of a CSS animation direction
   * @default 'normal'
   * @opt {Function} complete  A function to execute when the animation has completed
   * @default null
   * @return {jQuery}  The jQuery object, for chaining
   */
  /**
   * Applies a keyframe animation to an element
   * @method $.fn.keyframe
   *
   * @param {Object} keyframes  A list of timestamped keyframes in the form {'0%': {color: 'red'}, '100%': 'color: blue'}
   * @param {Object} options  Options for the animation
   * @opt {Number} duration  The number of milliseconds that the animation lasts
   * @opt {String} easing  The name of a CSS easing function
   * @default 'linear'
   * @opt {Number} delay  The number of milliseconds before the animation should start
   * @default 0
   * @opt {Object} iterations  Either the number of iterations to play the animation or 'infinite'
   * @default 1
   * @opt {String} direction  The name of a CSS animation direction
   * @default 'normal'
   * @opt {Function} complete  A function to execute when the animation has completed
   * @default null
   * @return {jQuery}  The jQuery object, for chaining
   *
   */
  /**
   * Applies a keyframe animation to an element
   * @method $.fn.keyframe
   *
   * @param {String} name  The name of the animation
   * @param {Number} duration  The number of milliseconds that the animation lasts
   * @param {String} easing  The name of a CSS easing function
   * @param {Number} delay  The number of milliseconds before the animation should start
   * @param {Object} iterations  Either the number of iterations to play the animation or 'infinite'
   * @param {String} direction  The name of a CSS animation direction
   * @param {Function} callback  A function to execute when the animation has completed
   * @return {jQuery}  The jQuery object, for chaining
   *
  */
  /**
   * Applies a keyframe animation to an element
   * @method $.fn.keyframe
   *
   * @param {Object} keyframes  A list of timestamped keyframes in the form {'0%': {color: 'red'}, '100%': 'color: blue'}
   * @param {Number} duration  The number of milliseconds that the animation lasts
   * @param {String} easing  The name of a CSS easing function
   * @param {Number} delay  The number of milliseconds before the animation should start
   * @param {Object} iterations  Either the number of iterations to play the animation or 'infinite'
   * @param {String} direction  The name of a CSS animation direction
   * @param {Function} callback  A function to execute when the animation has completed
   * @return {jQuery}  The jQuery object, for chaining
   */
  $.fn.keyframe = function(name, duration, easing, delay, iterations, direction, callback) {
    if (Animation.isSupported()) {
      if (typeof name === 'object') {
        name = Animation.generateKeyframes(name);
      }
      if (typeof duration === 'object') {
        callback = duration.complete;
        direction = duration.direction;
        iterations = duration.iterations;
        delay = duration.delay;
        easing = duration.easing;
        duration = duration.duration;
      }
      direction = direction || 'normal';
      iterations = iterations || 1;
      delay = delay || 0;
      easing = easing || 'linear';
      duration = duration || 1;
      if (typeof duration === 'number') {
        duration += 'ms';
      }
      if (typeof delay === 'number') {
        delay += 'ms';
      }
      if (callback) {
        this.nextAnimationEnd(callback);
      }
      this.css(Animation.cssProperty(), [name, duration, easing, delay, iterations, direction].join(' '));
    }
    return this;
  };

  /**
   * Binds an animation end handler to an element.
   * @method $.fn.animationEnd
   *
   * @param {Function} callback  Callback for when the animation ends
   * @return {jQuery}  This jQuery object, for chaining
   *
  /**
   * Binds an animation end handler to an element.
   * @method $.fn.animationEnd
   *
   * @param {String} delegate  Selector for the descendant elements to which the handler will be bound
   * @param {Function} callback  Callback for when the animation ends
   * @return {jQuery}  This jQuery object, for chaining
   */
  $.fn.animationEnd = function(delegate, callback) {
    if (_event) {
      return this.on(_event, delegate, callback);
    } else {
      return this;
    }
  };

  /**
   * Binds an animation end handler to an element's next animation end event
   * @method $.fn.nextAnimationEnd
   *
   * @param {Function} callback  Callback for when the animation ends
   * @return {jQuery}  This jQuery object, for chaining
   */
  /**
   * Binds an animation end handler to an element's next animation end event
   * @method $.fn.nextAnimationEnd
   *
   * @param {String} delegate  Selector for the descendant elements to which the handler will be bound
   * @param {Function} callback  Callback for when the animation ends
   * @return {jQuery}  This jQuery object, for chaining
   */
  $.fn.nextAnimationEnd = function(delegate, callback) {
    if (_event) {
      return this.one(_event, delegate, callback);
    } else {
      return this;
    }
  };

  return Animation;

});

define('lavaca/fx/Transition',['require','$'],function(require) {

  var $ = require('$');

  var Transition = {};

  var _props = {
        transition: ['transition', 'transitionend'],
        webkitTransition: ['-webkit-transition', 'webkitTransitionEnd'],
        MozTransition: ['-moz-transition', 'MozTransitionEnd'],
        OTransition: ['-o-transition', 'OTransitionEnd'],
        MSTransition: ['-ms-transition', 'MSTransitionEnd']
      },
      _prop,
      _cssProp,
      _event;

  (function() {
    var style = document.createElement('div').style,
        s;
    for (s in _props) {
      if (s in style) {
        _prop = s;
        _cssProp = _props[s][0];
        _event = _props[s][1];
        break;
      }
    }
  })();

  /**
   * Static utility type for working with CSS transitions
   * @class lavaca.fx.Transition
   */

  /**
   * Whether or not transitions are supported by the browser
   * @method isSupported
   * @static
   *
   * @return {Boolean}  True when CSS transitions are supported
   */
  Transition.isSupported = function() {
    return !!_prop;
  };

  /**
   * Generates a CSS transition property string from several values
   * @method toCSS
   * @static
   *
   * @param {Object} props  A hash in which the keys are the names of the CSS properties
   * @param {Number} duration  The amount of time in milliseconds that the transition lasts
   * @return {String}  The generated CSS string
   */
 /**
   * Generates a CSS transition property string from several values
   * @method toCSS
   * @static
   *
   * @param {Array} props  An array of CSS property names
   * @param {Number} duration  The amount of time in milliseconds that the transition lasts
   * @return {String}  The generated CSS string
   */
  /**
   * Generates a CSS transition property string from several values
   * @method toCSS
   * @static
   *
   * @param {Object} props  A hash in which the keys are the names of the CSS properties
   * @param {Number} duration  The amount of time in milliseconds that the transition lasts
   * @param {String} easing  The interpolation for the transition
   * @return {String}  The generated CSS string
   */
  /**
   * Generates a CSS transition property string from several values
   * @method toCSS
   * @static
   *
   * @param {Array} props  An array of CSS property names
   * @param {Number} duration  The amount of time in milliseconds that the transition lasts
   * @param {String} easing  The interpolation for the transition
   * @return {String}  The generated CSS string
   */
  Transition.toCSS = function(props, duration, easing) {
    easing = easing || 'linear';
    var css = [],
        isArray = props instanceof Array,
        prop;
    for (prop in props) {
      if (isArray) {
        prop = props[prop];
      }
      css.push(prop + ' ' + duration + 'ms ' + easing);
    }
    return css.join(',');
  };

  /**
   * Gets the name of the transition CSS property
   * @method cssProperty
   * @static
   *
   * @return {String}  The name of the CSS property
   */
  Transition.cssProperty = function() {
    return _cssProp;
  };

  /**
   * Causes an element to undergo a transition
   * @method $.fn.transition
   *
   * @param {Object} props  The CSS property values at the end of the transition
   * @param {Number} duration  The amount of time in milliseconds that the transition lasts
   * @return {jQuery}  The jQuery object, for chaining
   */
   /**
   * Causes an element to undergo a transition
   * @method $.fn.transition
   *
   * @param {Object} props  The CSS property values at the end of the transition
   * @param {Number} duration  The amount of time in milliseconds that the transition lasts
   * @param {String} easing  The interpolation for the transition
   * @return {jQuery}  The jQuery object, for chaining
   */
/**
   * Causes an element to undergo a transition
   * @method $.fn.transition
   *
   * @param {Object} props  The CSS property values at the end of the transition
   * @param {Number} duration  The amount of time in milliseconds that the transition lasts
   * @param {Function} callback  A function to execute when the transition completes
   * @return {jQuery}  The jQuery object, for chaining
   */
   /**
   * Causes an element to undergo a transition
   * @method $.fn.transition
   *
   * @param {Object} props  The CSS property values at the end of the transition
   * @param {Number} duration  The amount of time in milliseconds that the transition lasts
   * @param {String} easing  The interpolation for the transition
   * @param {Function} callback  A function to execute when the transition completes
   * @return {jQuery}  The jQuery object, for chaining
   */
  $.fn.transition = function(props, duration, easing, callback) {
    if (easing instanceof Function) {
        callback = easing;
        easing = null;
    }
    if (Transition.isSupported()) {
      var css = Transition.toCSS(props, duration, easing);
      if (callback) {
        this.nextTransitionEnd(callback);
      }
      this.each(function() {
        this.style[_prop] = css;
      });
      this.css(props);
    } else {
      this.css(props);
      if (callback) {
        callback.call(this[0], {});
      }
    }
    return this;
  };

  /**
   * Binds a transition end handler to an element.
   * @method $.fn.transitionEnd
   *
   * @param {Function} callback  Callback for when the transition ends
   * @return {jQuery}  The jQuery object, for chaining
   */
  /**
   * Binds a transition end handler to an element.
   * @method $.fn.transitionEnd
   *
   * @param {String} delegate  Selector for the descendant elements to which the handlers will be bound
   * @param {Function} callback  Callback for when the transition ends
   * @return {jQuery}  The jQuery object, for chaining
   */
  $.fn.transitionEnd = function(delegate, callback) {
    if (_event) {
      return this.on(_event, delegate, callback);
    } else {
      return this;
    }
  };

  /**
   * Binds a transition end handler to an element's next transition end event.
   * @method $.fn.nextTransitionEnd
   *
   * @param {Function} callback  Callback for when the transition ends
   * @return {jQuery}  The jQuery object, for chaining
   */
  /**
   * Binds a transition end handler to an element's next transition end event.
   * @method $.fn.nextTransitionEnd
   *
   * @param {String} delegate  Selector for the descendant elements to which the handlers will be bound
   * @param {Function} callback  Callback for when the transition ends
   * @return {jQuery}  The jQuery object, for chaining
   */
  $.fn.nextTransitionEnd = function(delegate, callback) {
    if (_event) {
      return this.one(_event, delegate, callback);
    } else {
      return this;
    }
  };

  return Transition;

});

define('lavaca/util/uuid',[],function() {

  var _uuidMap = {};
  /**
   * Produces a app specific unique identifier
   * @class lavaca.util.uuid
   */
   /**
   * Produces a unique identifier
   * @method uuid
   * @static
   * @param {String} namespace  A string served the namespace of a uuid
   *
   * @return {Number}  A number that is unique to this page
   */
  var uuid = function(namespace) {
    namespace = namespace || '__defaultNS';
    if (typeof _uuidMap[namespace] !== 'number') {
      _uuidMap[namespace] = 0;
    }
    return _uuidMap[namespace]++;
  };

  return uuid;

});

define('lavaca/net/History',['require','lavaca/events/EventDispatcher','lavaca/util/uuid'],function(require) {

  var EventDispatcher = require('lavaca/events/EventDispatcher'),
      uuid = require('lavaca/util/uuid');

  var _isAndroid = navigator.userAgent.indexOf('Android') > -1,
      _standardsMode = !_isAndroid && typeof history.pushState === 'function',
      _hasPushed = false,
      _lastHash,
      _hist,
      _currentId,
      _pushCount = 0;

  function _insertState(hist, position, id, state, title, url) {
    hist.position = position;
    var record = {
          id: id,
          state: state,
          title: title,
          url: url
        };
    hist.sequence[position] = record;
    location.hash = _lastHash = url + '#@' + id;
    return record;
  }

  /**
   * HTML5 history abstraction layer
   * @class lavaca.net.History
   * @extends lavaca.events.EventDispatcher
   *
   * @event popstate
   *
   * @constructor
   */
  var History = EventDispatcher.extend(function() {
    EventDispatcher.call(this);
    /**
     * A list containing history states generated by the app (not used for HTML5 history)
     * @property {Array} sequence
     */
    this.sequence = [];
    /**
     * The current index in the history sequence (not used for HTML5 history)
     * @property {Number} position
     */
    this.position = -1;
    this.replace({}, document.title, location.pathname);
    var self = this;
    if (_standardsMode) {
      /**
       * Auto-generated callback executed when a history event occurs
       * @property {Function} onPopState
       */
       var self = this;
      this.onPopState = function(e) {
        if (e.state) {
          _pushCount--;
          var previousId = _currentId;
          _currentId = e.state.id;
          self.trigger('popstate', {
            state: e.state.state,
            title: e.state.title,
            url: e.state.url,
            id: e.state.id,
            direction: _currentId > previousId ? 'forward' : 'back'
          });
        }
      };
      window.addEventListener('popstate', this.onPopState, false);
    } else {
      this.onPopState = function() {
        var hash = location.hash,
            code,
            record,
            item,
            previousCode,
            i = -1;
        if (hash) {
          hash = hash.replace(/^#/, '');
        }
        if (hash !== _lastHash) {
          previousCode = _lastHash.split('#@')[1];
          _lastHash = hash;
          if (hash) {
            _pushCount--;
            code = hash.split('#@')[1];
            while (!!(item = self.sequence[++i])) {
              if (item.id === parseInt(code, 10)) {
                record = item;
                self.position = i;
                break;
              }
            }
            if (record) {
              location.hash = record.url + '#@' + record.id;
              document.title = record.title;
              self.trigger('popstate', {
                state: record.state,
                title: record.title,
                url: record.url,
                id: record.id,
                direction: record.id > parseInt(previousCode, 10) ? 'forward' : 'back'
              });
            }
          }
        }
      };
      if (window.attachEvent) {
        window.attachEvent('onhashchange', this.onPopState);
      } else {
        window.addEventListener('hashchange', this.onPopState, false);
      }
    }
  }, {
    /**
     * Retrieve the current history record
     * @method current
     *
     * @return {Object}  The current history record
     */
    current: function() {
      return this.sequence[this.position] || null;
    },
    /**
     * Determines whether or not there are history states
     * @method hasHistory
     *
     * @returns {Boolean} True when there is a history state
     */
    hasHistory: function() {
      return _pushCount > 0;
    },
    /**
     * Adds a record to the history
     * @method push
     *
     * @param {Object} state  A data object associated with the page state
     * @param {String} title  The title of the page state
     * @param {String} url  The URL of the page state
     */
    push: function(state, title, url) {
      _pushCount++;
      if (_hasPushed) {
        document.title = title;
        _currentId = uuid('history');
        if (_standardsMode) {
          history.pushState({state: state, title: title, url: url, id: _currentId}, title, url);
        } else {
          _insertState(this, ++this.position, _currentId, state, title, url);
        }
      } else {
        this.replace(state, title, url);
      }
    },
    /**
     * Replaces the current record in the history
     * @method replace
     *
     * @param {Object} state  A data object associated with the page state
     * @param {String} title  The title of the page state
     * @param {String} url  The URL of the page state
     */
    replace: function(state, title, url) {
      _hasPushed = true;
      document.title = title;
      if (_standardsMode) {
        history.replaceState({state: state, title: title, url: url, id: _currentId}, title, url);
      } else {
        if (this.position < 0) {
          this.position = 0;
        }
        _insertState(this, this.position, typeof _currentId !== 'undefined' ? _currentId : uuid('history'), state, title, url);
      }
    },
    /**
     * Unbind the history object and ready it for garbage collection
     * @method dispose
     */
    dispose: function() {
      if (this.onPopState) {
        if (_standardsMode) {
          window.removeEventListener('popstate', this.onPopState, false);
        } else if (window.detachEvent) {
          window.detachEvent('onhashchange', this.onPopState);
        } else {
          window.removeEventListener('hashchange', this.onPopState, false);
        }
      }
      EventDispatcher.prototype.dispose.call(this);
    }
  });
  /**
   * Initialize a singleton history abstraction layer
   * @method init
   * @static
   *
   * @return {Lavaca.mvc.History}  The history instance
   */
   /**
   * Initialize a singleton history abstraction layer
   * @method init
   * @static
   *
   * @param {Boolean} useHash  When true, use the location hash to manage history state instead of HTML5 history
   * @return {Lavaca.mvc.History}  The history instance
   */
  History.init = function(useHash) {
    if (!_hist) {
      if (useHash) {
        History.overrideStandardsMode();
      }
      _hist = new History();
    }
    return _hist;
  };
  /**
   * Adds a record to the history
   * @method push
   * @static
   *
   * @param {Object} state  A data object associated with the page state
   * @param {String} title  The title of the page state
   * @param {String} url  The URL of the page state
   */
  History.push = function() {
    History.init().push.apply(_hist, arguments);
  };
  /**
   * Replaces the current record in the history
   * @method replace
   * @static
   *
   * @param {Object} state  A data object associated with the page state
   * @param {String} title  The title of the page state
   * @param {String} url  The URL of the page state
   */
  History.replace = function() {
    History.init().replace.apply(_hist, arguments);
  };
  /**
   * Goes to the previous history state
   * @method back
   * @static
   */
  History.back = function() {
    history.back();
  };
  /**
   * Goes to the next history state
   * @method forward
   * @static
   */
  History.forward = function() {
    history.forward();
  };
  /**
   * Unbind the history object and ready it for garbage collection
   * @method dispose
   * @static
   */
  History.dispose = function() {
    if (_hist) {
      _hist.dispose();
      _hist = null;
    }
  };
  /**
   * Binds an event handler to the singleton history
   * @method on
   * @static
   *
   * @param {String} type  The type of event
   * @param {Function} callback  The function to execute when the event occurs
   * @return {Lavaca.mvc.History}  The history object (for chaining)
   */
  History.on = function() {
    return History.init().on.apply(_hist, arguments);
  };
  /**
   * Unbinds an event handler from the singleton history
   * @method off
   * @static
   *
   * @param {String} type  The type of event
   * @param {Function} callback  The function to stop executing when the
   *    event occurs
   * @return {Lavaca.mvc.History}  The history object (for chaining)
   */
  History.off = function() {
    return History.init().off.apply(_hist, arguments);
  };
  /**
   * Sets Histroy to hash mode
   * @method overrideStandardsMode
   * @static
   */
  History.overrideStandardsMode = function() {
    _standardsMode = false;
  };

  /**
   * Stores the page transition animations so that if you route back, it will animate correctly
   * @property {Array} animationBreadcrumb
   */
  History.animationBreadcrumb = [];

  /**
   * Flag to notify when history back is being called
   * @property {Boolean} isRoutingBack
   */
  History.isRoutingBack = false;

  return History;

});

define('lavaca/util/delay',[],function() {
  /**
   * Wraps setTimeout and delays the execution of a function
   * @class lavaca.util.delay
   */
   /**
   * Delays the execution of a function
   * @method delay
   * @static
   *
   * @param {Function} callback  A callback to execute on delay
   */
   /**
   * Delays the execution of a function
   * @method delay
   * @static
   * @param {Function} callback  A callback to execute on delay
   * @param {Object} thisp  The object to use as the "this" keyword
   * @return {Number}  The timeout ID
   */
   /**
   * Delays the execution of a function
   * @method delay
   * @static
   * @param {Function} callback  A callback to execute on delay
   * @param {Object} thisp  The object to use as the "this" keyword
   * @param {Number} ms  The number of milliseconds to delay execution
   * @return {Number}  The timeout ID
   */
  var delay = function(callback, thisp, ms) {
    return setTimeout(function() {
      callback.call(thisp);
    }, ms || 0);
  };

  return delay;

});

define('mout/lang/kindOf',[],function () {

    var _rKind = /^\[object (.*)\]$/,
        _toString = Object.prototype.toString,
        UNDEF;

    /**
     * Gets the "kind" of value. (e.g. "String", "Number", etc)
     */
    function kindOf(val) {
        if (val === null) {
            return 'Null';
        } else if (val === UNDEF) {
            return 'Undefined';
        } else {
            return _rKind.exec( _toString.call(val) )[1];
        }
    }
    return kindOf;
});

define('mout/object/mixIn',['./forOwn'], function(forOwn){

    /**
    * Combine properties from all the objects into first one.
    * - This method affects target object in place, if you want to create a new Object pass an empty object as first param.
    * @param {object} target    Target Object
    * @param {...object} objects    Objects to be combined (0...n objects).
    * @return {object} Target Object.
    */
    function mixIn(target, objects){
        var i = 0,
            n = arguments.length,
            obj;
        while(++i < n){
            obj = arguments[i];
            if (obj != null) {
                forOwn(obj, copyProp, target);
            }
        }
        return target;
    }

    function copyProp(val, key){
        this[key] = val;
    }

    return mixIn;
});

define('mout/lang/clone',['./kindOf', './isPlainObject', '../object/mixIn'], function (kindOf, isPlainObject, mixIn) {

    /**
     * Clone native types.
     */
    function clone(val){
        switch (kindOf(val)) {
            case 'Object':
                return cloneObject(val);
            case 'Array':
                return cloneArray(val);
            case 'RegExp':
                return cloneRegExp(val);
            case 'Date':
                return cloneDate(val);
            default:
                return val;
        }
    }

    function cloneObject(source) {
        if (isPlainObject(source)) {
            return mixIn({}, source);
        } else {
            return source;
        }
    }

    function cloneRegExp(r) {
        var flags = '';
        flags += r.multiline ? 'm' : '';
        flags += r.global ? 'g' : '';
        flags += r.ignorecase ? 'i' : '';
        return new RegExp(r.source, flags);
    }

    function cloneDate(date) {
        return new Date(+date);
    }

    function cloneArray(arr) {
        return arr.slice();
    }

    return clone;

});

define('mout/lang/deepClone',['./clone', '../object/forOwn', './kindOf', './isPlainObject'], function (clone, forOwn, kindOf, isPlainObject) {

    /**
     * Recursively clone native types.
     */
    function deepClone(val, instanceClone) {
        switch ( kindOf(val) ) {
            case 'Object':
                return cloneObject(val, instanceClone);
            case 'Array':
                return cloneArray(val, instanceClone);
            default:
                return clone(val);
        }
    }

    function cloneObject(source, instanceClone) {
        if (isPlainObject(source)) {
            var out = {};
            forOwn(source, function(val, key) {
                this[key] = deepClone(val, instanceClone);
            }, out);
            return out;
        } else if (instanceClone) {
            return instanceClone(source);
        } else {
            return source;
        }
    }

    function cloneArray(arr, instanceClone) {
        var out = [],
            i = -1,
            n = arr.length,
            val;
        while (++i < n) {
            out[i] = deepClone(arr[i], instanceClone);
        }
        return out;
    }

    return deepClone;

});


define('mout/lang/isKind',['./kindOf'], function (kindOf) {
    /**
     * Check if value is from a specific "kind".
     */
    function isKind(val, kind){
        return kindOf(val) === kind;
    }
    return isKind;
});

define('mout/lang/isObject',['./isKind'], function (isKind) {
    /**
     */
    function isObject(val) {
        return isKind(val, 'Object');
    }
    return isObject;
});

define('mout/object/merge',['./hasOwn', '../lang/deepClone', '../lang/isObject'], function (hasOwn, deepClone, isObject) {

    /**
     * Deep merge objects.
     */
    function merge() {
        var i = 1,
            key, val, obj, target;

        // make sure we don't modify source element and it's properties
        // objects are passed by reference
        target = deepClone( arguments[0] );

        while (obj = arguments[i++]) {
            for (key in obj) {
                if ( ! hasOwn(obj, key) ) {
                    continue;
                }

                val = obj[key];

                if ( isObject(val) && isObject(target[key]) ){
                    // inception, deep merge objects
                    target[key] = merge(target[key], val);
                } else {
                    // make sure arrays, regexp, date, objects are cloned
                    target[key] = deepClone(val);
                }

            }
        }

        return target;
    }

    return merge;

});

define('lavaca/mvc/Route',['require','lavaca/util/Disposable','lavaca/util/delay','mout/lang/deepClone','mout/object/merge'],function(require) {

  var Disposable = require('lavaca/util/Disposable'),
      delay = require('lavaca/util/delay'),
      clone = require('mout/lang/deepClone'),
      merge = require('mout/object/merge');

  function _multivariablePattern() {
    return new RegExp('\\{\\*(.*?)\\}', 'g');
  }

  function _variablePattern() {
    return new RegExp('\\{([^\\/]*?)\\}', 'g');
  }

  function _variableCharacters() {
    return new RegExp('[\\{\\}\\*]', 'g');
  }

  function _datePattern() {
    return new RegExp('^\\d{4}-[0-1]\\d-[0-3]\\d$', 'g');
  }

  function _patternToRegExp(pattern) {
    if (pattern === '/') {
      return new RegExp('^\\/(\\?.*)?(#.*)?$', 'g');
    }
    if (pattern.charAt(0) === '/') {
      pattern = pattern.slice(1);
    }
    pattern = pattern.split('/');
    var exp = '^',
        i = -1,
        part;
    while (!!(part = pattern[++i])) {
      if (_multivariablePattern().test(part)) {
        exp += '(/([^/?#]+))*?';
      } else if (_variablePattern().test(part)) {
        exp += '/([^/?#]+)';
      } else {
        exp += '/' + part;
      }
    }
    exp += '(\\?.*)?(#\\.*)?$';
    return new RegExp(exp, 'g');
  }

  function _scrubURLValue(value) {
    value = decodeURIComponent(value);
    if (!isNaN(value)) {
      value = Number(value);
    } else if (value.toLowerCase() === 'true') {
      value = true;
    } else if (value.toLowerCase() === 'false') {
      value = false;
    } else if (_datePattern().test(value)) {
      value = value.split('-');
      value = new Date(Number(value[0]), Number(value[1]) - 1, Number(value[2]));
    }
    return value;
  }

  /**
   * @class lavaca.mvc.Route
   * @extends lavaca.util.Disposable
   * A relationship between a URL pattern and a controller action
   *
   * @constructor
   * @param {String} pattern  The route URL pattern
   *   Route URL patterns should be in the form /path/{foo}/path/{*bar}.
   *   The path variables, along with query string parameters, will be passed
   *   to the controller action as a params object. In this case, when passed
   *   the URL /path/something/path/1/2/3?abc=def, the params object would be
   *   {foo: 'something', bar: [1, 2, 3], abc: 'def'}.
   * @param {Function} TController  The type of controller that performs the action
   *   (Should derive from [[Lavaca.mvc.Controller]])
   * @param {String} action  The name of the controller method to call
   * @param {Object} params  Key-value pairs that will be merged into the params
   *   object that is passed to the controller action
   */
  var Route = Disposable.extend(function(pattern, TController, action, params) {
    Disposable.call(this);
    this.pattern = pattern;
    this.TController = TController;
    this.action = action;
    this.params = params || {};
  }, {
    /**
     * Tests if this route applies to a URL
     * @method matches
     *
     * @param {String} url  The URL to test
     * @return {Boolean}  True when this route matches the URL
     */
    matches: function(url) {
      return _patternToRegExp(this.pattern).test(url);
    },
    /**
     * Converts a URL into a params object according to this route's pattern
     * @method parse
     *
     * @param {String} url  The URL to convert
     * @return {Object}  The params object
     */
    parse: function(url) {
      var result = clone(this.params),
          pattern = this.pattern.slice(1),
          urlParts = url.split('#'),
          i,
          query,
          path,
          pathItem,
          patternItem,
          name;
      result.url = url;
      result.route = this;
      urlParts = urlParts[1] ? urlParts[1].split('?') : urlParts[0].split('?');
      query = urlParts[1];
      if (query) {
        i = -1;
        query = query.split('&');
        while (!!(pathItem = query[++i])) {
          pathItem = pathItem.split('=');
          name = decodeURIComponent(pathItem[0]);
          if (result[name] !== undefined) {
            if (!(result[name] instanceof Array)) {
              result[name] = [result[name]];
            }
            result[name].push(_scrubURLValue(pathItem[1]));
          } else {
            result[name] = _scrubURLValue(pathItem[1]);
          }
        }
      }
      i = 0;
      path = urlParts[0].replace(/(^(http(s?)\:\/\/[^\/]+)?\/?)|(\/$)/, '');
      var breakApartPattern = new RegExp(pattern.replace(_multivariablePattern(), '(.+)').replace(_variablePattern(), '([^/]+)')),
          brokenPath = breakApartPattern.exec(path),
          brokenPattern = breakApartPattern.exec(pattern);
      while (!!(pathItem = brokenPath[++i])) {
        patternItem = brokenPattern[i];
        if (_multivariablePattern().test(patternItem)) {
          pathItem = pathItem.split('/');
        }
        result[patternItem.replace(_variableCharacters(), '')] = pathItem;
      }
      return result;
    },
    /**
     * Executes this route's controller action see if work
     * @method exec
     *
     * @param {String} url  The URL that supplies parameters to this route
     * @param {Lavaca.mvc.Router} router  The router used by the application
     * @param {Lavaca.mvc.ViewManager}  viewManager The view manager used by the application
     * @return {Lavaca.util.Promise}  A promise
     */
    /**
     * Executes this route's controller action see if work
     * @method exec
     *
     * @param {String} url  The URL that supplies parameters to this route
     * @param {Lavaca.mvc.Router} router  The router used by the application
     * @param {Lavaca.mvc.ViewManager}  viewManager The view manager used by the application
     * @param {Object} state  A history record object
     * @return {Lavaca.util.Promise}  A promise
     */
    /**
     * Executes this route's controller action see if work
     * @method exec
     *
     * @param {String} url  The URL that supplies parameters to this route
     * @param {Lavaca.mvc.Router} router  The router used by the application
     * @param {Lavaca.mvc.ViewManager}  viewManager The view manager used by the application
     * @param {Object} state  A history record object
     * @param {Object} params  Additional parameters to pass to the controller action
     * @return {Lavaca.util.Promise}  A promise
     */
    exec: function(url, router, viewManager, state, params) {
      var controller = new this.TController(router, viewManager),
          urlParams = this.parse(url),
          promise = controller.exec(this.action, merge(urlParams, params), state);
      function dispose() {
        delay(controller.dispose, controller);
      }
      promise.then(dispose, dispose);
      return promise;
    }
  });

  return Route;

});

define('lavaca/mvc/Router',['require','./Route','lavaca/net/History','lavaca/util/Disposable','lavaca/util/Promise'],function(require) {

  var Route = require('./Route'),
      History = require('lavaca/net/History'),
      Disposable = require('lavaca/util/Disposable'),
      Promise = require('lavaca/util/Promise');

  /**
   * @class lavaca.mvc.Router
   * @extends lavaca.util.Disposable
   * URL manager
   *
   * @constructor
   * @param {Lavaca.mvc.ViewManager} viewManager  The view manager
   */
  var Router = Disposable.extend(function(viewManager) {
    Disposable.call(this);
    /**
     * @field {Array} routes
     * @default []
     * The [[Lavaca.mvc.Route]]s used by this router
     */
    this.routes = [];
    /**
     * @field {Lavaca.mvc.ViewManager} viewManager
     * @default null
     * The view manager used by this router
     */
    this.viewManager = viewManager;

  }, {
    /**
     * @field {Boolean} locked
     * @default false
     * When true, the router is prevented from executing a route
     */
    locked: false,
    /**
     * @field {Boolean} hasNavigated
     * @default false
     * Whether or not this router has been used to navigate
     */
    hasNavigated: false,

    startHistory: function() {
      this.onpopstate = function(e) {
        if (this.hasNavigated) {
          History.isRoutingBack = e.direction === 'back';
          this.exec(e.url, e).always(function() {
            History.isRoutingBack = false;
          });
        }
      };
      History.on('popstate', this.onpopstate, this);
    },
    /**
     * Sets the viewManager property on the instance which is the view manager used by this router
     * @method setEl
     *
     * @param {Lavaca.mvc.ViewManager} viewManager
     * @return {Lavaca.mvc.Router}  This Router instance
     */
    setViewManager: function(viewManager) {
      this.viewManager = viewManager;
      return this;
    },
    /**
     * Adds multiple routes
     * @method add
     *
     * @param {Object} map  A hash in the form {pattern: [TController, action, params]}
     *   or {pattern: {controller: TController, action: action, params: params}
     * @return {Lavaca.mvc.Router}  The router (for chaining)
     */
    /**
     * Adds a route
     * @method add
     *
     * @param {String} pattern  The route URL pattern
     * @param {Function} TController  The type of controller to perform the action (should derive from [[Lavaca.mvc.Controller]])
     * @param {String} action  The name of the controller method to call
     * @return {Lavaca.mvc.Router}  The router (for chaining)
     */
    /**
     * Adds a route
     * @method add
     *
     * @param {String} pattern  The route URL pattern
     * @param {Function} TController  The type of controller to perform the action (should derive from [[Lavaca.mvc.Controller]])
     * @param {String} action  The name of the controller method to call
     * @param {Object} params  Key-value pairs that will be passed to the action
     * @return {Lavaca.mvc.Router}  The router (for chaining)
     */
    add: function(pattern, TController, action, params) {
      if (typeof pattern === 'object') {
        for (var p in pattern) {
          var args = pattern[p];
          if (args instanceof Array) {
            TController = args[0];
            action = args[1];
            params = args[2];
          } else {
            TController = args.controller;
            action = args.action;
            params = args.params;
          }
          this.add(p, TController, action, params);
        }
      } else {
        this.routes.push(new Route(pattern, TController, action, params));
      }
      return this;
    },
    /**
     * Executes the action for a given URL
     * @method exec
     *
     * @param {String} url  The URL
     * @return {Lavaca.util.Promise}  A promise
     */
    /**
     * Executes the action for a given URL
     * @method exec
     *
     * @param {String} url  The URL
     * @param {Object} state  A history record object
     * @return {Lavaca.util.Promise}  A promise
     */
    /**
     * Executes the action for a given URL
     * @method exec
     *
     * @param {String} url  The URL
     * @param {Object} state  A history record object
     * @param {Object} params  Additional parameters to pass to the route
     * @return {Lavaca.util.Promise}  A promise
     */
    exec: function(url, state, params) {
      if (this.locked) {
        return (new Promise(this)).reject('locked');
      } else {
        this.locked = true;
      }
      if (!url) {
        url = '/';
      }
      if (url.indexOf('http') === 0) {
        url = url.replace(/^http(s?):\/\/.+?/, '');
      }
      var i = -1,
          route,
          promise = new Promise(this);
      promise.always(function() {
        this.unlock();
      });
      if (!this.hasNavigated) {
        promise.success(function() {
          this.hasNavigated = true;
        });
      }
      while (!!(route = this.routes[++i])) {
        if (route.matches(url)) {
          return promise.when(route.exec(url, this, this.viewManager, state, params));
        }
      }
      return promise.reject(url, state);
    },
    /**
     * Unlocks the router so that it can be used again
     * @method unlock
     *
     * @return {Lavaca.mvc.Router}  This router (for chaining)
     */
    unlock: function() {
      this.locked = false;
      return this;
    },
    /**
     * Readies the router for garbage collection
     * @method dispose
     */
    dispose: function() {
      if (this.onpopstate) {
        History.off('popstate', this.onpopstate);
        this.onpopstate = null;
      }
      Disposable.prototype.dispose.apply(this, arguments);
    }
  });

  return new Router();

});

define('lavaca/util/resolve',[],function() {
  /**
   * Looks up or creates an object, given its global path (ie, 'Lavaca.resolve' resolves to this function,
   * 'no.obj.exists' resolves to null)
   * @class lavaca.util.resolve
   */
   /**
   * Looks up or creates an object, given its global path (ie, 'Lavaca.resolve' resolves to this function,
   * 'no.obj.exists' resolves to null)
   * @method resolve
   * @static
   *
   * @param {String} name  The fully-qualified name of the object to look up
   * @return {Object}  The resolved object
   */
   /**
   * Looks up or creates an object, given its global path (ie, 'Lavaca.resolve' resolves to this function,
   * 'no.obj.exists' resolves to null)
   * @method resolve
   * @static
   *
   * @param {String} name  The fully-qualified name of the object to look up
   * @param {Boolean} createIfNotExists  When true, any part of the name that doesn't already exist will be created
   * as an empty object
   * @return {Object}  The resolved object
   */
  var resolve = function(name, createIfNotExists, root) {
    if (!name) {
      return null;
    }
    name = name.split('.');
    var last = root || window,
        o = root || window,
        i = -1,
        segment;
    while (!!(segment = name[++i])) {
      o = o[segment];
      if (!o) {
        if (createIfNotExists) {
          o = last[segment] = {};
        } else {
          return null;
        }
      }
      last = o;
    }
    return o;
  };

  return resolve;

});

define('lavaca/net/Connectivity',['require','$','lavaca/util/Promise','lavaca/util/resolve'],function(require) {

  var $ = require('$'),
      Promise = require('lavaca/util/Promise'),
      resolve = require('lavaca/util/resolve');

  /**
   * A utility type for working under different network connectivity situatioConnectivity.
   * @class lavaca.net.Connectivity
   */

  var _navigatorOnlineSupported = typeof navigator.onLine === 'boolean',
      _offlineAjaxHandlers = [],
      _offlineErrorCode = 'offline';

  function _onAjaxError(arg) {
    if (arg === _offlineErrorCode) {
      var i = -1,
          callback;
      while (!!(callback = _offlineAjaxHandlers[++i])) {
        callback(arg);
      }
    }
  }

  var Connectivity = {};

  /**
   * Attempts to detect whether or not the browser is connected
   * @method isOffline
   * @static
   *
   * @return {Boolean}  True if the browser is offline; false if the browser is online
   *    or if connection status cannot be determined
   */
  Connectivity.isOffline = function() {
    var connectionType = resolve('navigator.connection.type');
    if (connectionType !== null) {
      return connectionType === resolve('Connection.NONE');
    } else {
      return _navigatorOnlineSupported ? !navigator.onLine : false;
    }
  };

  /**
   * Makes an AJAX request if the user is online. If the user is offline, the returned
   * promise will be rejected with the string argument "offline"
   * @method ajax
   * @static
   *
   * @param {Object} opts  jQuery-style AJAX options
   * @return {Lavaca.util.Promise}  A promise
   */
  Connectivity.ajax = function(opts) {
    var promise = new Promise(),
        origSuccess = opts.success,
        origError = opts.error;
    opts.success = function() {
      if (origSuccess) {
        origSuccess.apply(this, arguments);
      }
      promise.resolve.apply(promise, arguments);
    };
    opts.error = function() {
      if (origError) {
        origError.apply(this, arguments);
      }
      promise.reject.apply(promise, arguments);
    };
    if (Connectivity.isOffline()) {
      promise.reject(_offlineErrorCode);
    } else {
      $.ajax(opts);
    }
    promise.error(_onAjaxError);
    return promise;
  };

  /**
   * Adds a callback to be executed whenever any Lavaca.net.Connectivity.ajax() call is
   * blocked as a result of a lack of internet connection.
   * @method registerOfflineAjaxHandler
   * @static
   *
   * @param {Function} callback  The callback to execute
   */
  Connectivity.registerOfflineAjaxHandler = function(callback) {
    _offlineAjaxHandlers.push(callback);
  };

  return Connectivity;

});

define('lavaca/util/ArrayUtils',[],function() {

  /**
   * Utility class for working with arrays
   * @class lavaca.util.ArrayUtils
   */
  var ArrayUtils = {};

  /**
   * Gets the first index of an item in an array
   * @method indexOf
   * @static
   *
   * @param {Array} a  The array
   * @param {Object} o  The object to look for
   * @return {Number}  The first index of the object, or -1 if not found
   */
  ArrayUtils.indexOf = function(a, o) {
    if (!a) {
      return -1;
    } else if (a.indexOf) {
      return a.indexOf(o);
    } else {
      for (var i = 0, j = a.length; i < j; i++) {
        if (a[i] === o) {
          return i;
        }
      }
      return -1;
    }
  };

  /**
   * Determines whether an array contains an object
   * @method contains
   * @static
   *
   * @param {Array} a  The array
   * @param {Object} o  The object to look for
   * @return {Boolean}  True when the array contains the object, false otherwise
   */
  ArrayUtils.contains = function(a, o) {
    return ArrayUtils.indexOf(a, o) > -1;
  };

  /**
   * Removes the first instance of an item from an array, if it exists
   * @method remove
   * @static
   *
   * @param {Array} a  The array
   * @param {Object} o  The object to remove
   * @return {Number}  The former index of the item (or -1 if the item was not
   *   in the array)
   */
  ArrayUtils.remove = function(a, o) {
    var index = ArrayUtils.indexOf(a, o);
    if (index > -1) {
      a.splice(index, 1);
    }
    return index;
  };

  /**
   * Adds an item to the end of an array, if it was not already in the array
   * @method pushIfNotExists
   * @static
   *
   * @param {Array} a  The array
   * @param {Object} o  The object to add to the array
   * @return {Number}  The index of the item in the array
   */
  ArrayUtils.pushIfNotExists = function(a, o) {
    var index = ArrayUtils.indexOf(a, o);
    if (index === -1) {
      a[index = a.length] = o;
    }
    return index;
  };
  /**
   * Determines if object is an array
   * @method isArray
   * @static
   *
   * @param {Object} a  Any value of any type
   * @return {Boolean}  True if a is a true array
   */
  ArrayUtils.isArray = function(a) {
    return Array.isArray === 'function' ? Array.isArray(a) : Object.prototype.toString.call(a) === '[object Array]';
  };

  return ArrayUtils;

});

define('lavaca/util/Cache',['require','lavaca/util/Disposable','lavaca/util/uuid'],function(require) {

  var Disposable = require('lavaca/util/Disposable'),
      uuid = require('lavaca/util/uuid');

  /**
   * Object for storing data
   * @class lavaca.util.Cache
   * @extends lavaca.util.Disposable
   */
  var Cache = Disposable.extend({
    /**
     *
     * Retrieves an item from the cache
     * @method get
     * @param {String} id  The key under which the item is stored
     * @return {Object}  The stored item (or null if no item is stored)
     */
     /**
     * Retrieves an item from the cache
     * @method get
     * @param {String} id  The key under which the item is stored
     * @param {Object} def  A default value that will be added, if there is no item stored
     * @return {Object}  The stored item (or null if no item is stored and no default)
     */
    get: function(id, def) {
      var result = this['@' + id];
      if (result === undefined && def !== undefined) {
        result = this['@' + id] = def;
      }
      return result === undefined ? null : result;
    },
    /**
     * Assigns an item to a key in the cache
     * @method set
     *
     * @param {String} id  The key under which the item will be stored
     * @param {Object} value  The object to store in the cache
     */
    set: function(id, value) {
      this['@' + id] = value;
    },
    /**
     * Adds an item to the cache
     * @method add
     *
     * @param {Object} value  The object to store in the cache
     * @return {String}  The auto-generated ID under which the value was stored
     */
    add: function(value) {
      var id = uuid();
      this.set(id, value);
      return id;
    },
    /**
     * Removes an item from the cache (if it exists)
     * @method remove
     *
     * @param {String} id  The key under which the item is stored
     */
    remove: function(id) {
      delete this['@' + id];
    },
    /**
     * Executes a callback for each cached item. To stop iteration immediately,
     * return false from the callback.
     * @method each
     * @param {Function} callback  A function to execute for each item, callback(key, item)
     */
     /**
     * Executes a callback for each cached item. To stop iteration immediately,
     * return false from the callback.
     * @method each
     * @param {Function} callback  A function to execute for each item, callback(key, item)
     * @param {Object} thisp  The context of the callback
     */
    each: function(cb, thisp) {
      var prop, returned;
      for (prop in this) {
        if (this.hasOwnProperty(prop) && prop.indexOf('@') === 0) {
          returned = cb.call(thisp || this, prop.slice(1), this[prop]);
          if (returned === false) {
            break;
          }
        }
      }
    },
    /**
     * Serializes the cache to a hash
     * @method toObject
     *
     * @return {Object}  The resulting key-value hash
     */
    toObject: function() {
      var result = {};
      this.each(function(prop, value) {
        result[prop] = (value && typeof value.toObject === 'function') ? value.toObject() : value;
      });
      return result;
    },
    /**
     * Serializes the cache to JSON
     * @method toJSON
     *
     * @return {String}  The JSON string
     */
    toJSON: function() {
      return JSON.stringify(this.toObject());
    },
     /**
     * Serializes the cache to an array
     * @method toArray
     *
     * @return {Object}  The resulting array with elements being index based and keys stored in an array on the 'ids' property
     */
    toArray: function() {
      var results = [];
      results['ids'] = [];
      this.each(function(prop, value) {
        results.push(typeof value.toObject === 'function' ? value.toObject() : value);
        results['ids'].push(prop);
      });
      return results;
    },

    /**
     * removes all items from the cache
     * @method clear
     */
    clear: function() {
       this.each(function(key, item) {
         this.remove(key);
       }, this);
    },

    /**
     * returns number of items in cache
     * @method count
     */
    count: function() {
      var count = 0;
      this.each(function(key, item) {
        count++;
      }, this);
      return count;
    },

    /**
     * Clears all items from the cache on dispose
     * @method dispose
     */
    dispose: function() {
      this.clear();
      Disposable.prototype.dispose.apply(this, arguments);
    }
  });

  return Cache;

});

define('lavaca/util/Map',['require','$','./Cache','./Disposable','lavaca/net/Connectivity'],function(require) {

  var $ = require('$'),
      Cache = require('./Cache'),
      Disposable = require('./Disposable'),
      Connectivity = require('lavaca/net/Connectivity');

  function _absolute(url) {
    if (url && url.indexOf('http') !== 0) {
      if (url.charAt(0) === '/') {
        url = location.protocol + '//'
          + location.hostname
          + (location.port ? ':' + location.port : '')
          + (url.indexOf('/') === 0 ? url : '/' + url);
      } else {
        url = location.toString().split('#')[0].split('?')[0].replace(/\w+\.\w+$/, '') + url;
      }
    }
    return url;
  }

  /**
   * Abstract type for lookup tables
   * @class lavaca.util.Map
   * @extends lavaca.util.Disposable
   *
   * @constructor
   * @param {String} name  The name of the map
   * @param {String} src  The URL of the map's data (or null if code is supplied)
   * @param {String} code  The raw string data for the map (or null if src is supplied)
   */
  var Map = Disposable.extend(function(name, src, code) {
    Disposable.call(this);
    /**
     * Whether or not the map has loaded
     * @property {Boolean} hasLoaded
     * @default false
     */
    this.hasLoaded = false;
    /**
     * The name of the map
     * @property {String} name
     * @default null
     */
    this.name = name;
    /**
     * The source URL for the map
     * @property {String} src
     * @default null
     */
    this.src = _absolute(src);
    /**
     * The raw string data for the map
     * @property {String} code
     * @default null
     */
    this.code = code;
    /**
     * The cache in which this map stores data
     * @property {Lavaca.util.Cache} cache
     * @default new Lavaca.util.Cache()
     */
    this.cache = new Cache();
  }, {
    /**
     * Determines whether or not this is the desired lookup
     * @method is
     *
     * @param {String} name  The name of the lookup
     * @return {Boolean}  True if this is the lookup
     */
    is: function(name) {
      return this.name === name;
    },
    /**
     * Gets the value stored under a code
     * @method get
     *
     * @param {String} code  The code
     * @return {Object}  The value (or null)
     */
    get: function(code) {
      if (!this.hasLoaded) {
        if (this.code) {
          this.add(this.code);
        } else if (this.src) {
          this.load(this.src);
        }
        this.hasLoaded = true;
      }
      return this.cache.get(code);
    },
    /**
     * Adds parameters to this map
     * @method add
     *
     * @param {Object} data  The parameters to add
     */
    add: function(data) {
      for (var n in data) {
        this.cache.set(n, data[n]);
      }
    },
    /**
     * Processes server data to include in this lookup
     * @method process
     *
     * @param {String} text  The server data string
     */
    process: function(text) {
      this.add(typeof text === 'string' ? JSON.parse(text) : text);
    },
    /**
     * Adds JSON data to this map (synchronous)
     * @method load
     *
     * @param {String} url  The URL of the data
     */
    load: function(url) {
      var self = this;
      Connectivity.ajax({
        async: false,
        url: url,
        success: function(resp) {
          self.process(resp);
        }
      });
    }
  });
  /**
   * Sets the application's default config
   * @method setDefault
   * @static
   *
   * @param {Lavaca.util.Cache} cache  The map cache
   * @param {String} name  The name of the config
   */
  Map.setDefault = function(cache, name) {
    var map = name;
    if (typeof map === 'string') {
      map = cache.get(name);
    }
    cache.set('default', map);
  };
  /**
   * Finds the most appropriate value for a code
   * @method get
   * @static
   *
   * @param {Lavaca.util.Cache} cache  The maps cache
   * @param {String} name  The name of the map
   * @param {String} code  The name of the parameter
   * @param {String} defaultName  The name of the default map
   * @return {Object}  The value of the parameter
   */
  Map.get = function(cache, name, code, defaultName) {
    if (!code) {
      code = name;
      name = defaultName;
    }
    if (name) {
      var map = cache.get(name);
      if (map) {
        return map.get(code);
      }
    }
    return null;
  };
  /**
   * Scans the document for all maps and prepares them
   * @method init
   * @static
   *
   * @param {Lavaca.util.Cache} cache  The map cache
   * @param {String} mimeType  The MIME type of the scripts
   * @param {Function} construct  A function that returns a new map, in
   *   the form construct(name, src, code)
   * @param {jQuery} scope  The element to which to limit the scan
   */
  Map.init = function(cache, mimeType, construct, scope) {
    $(scope || document.documentElement)
      .find('script[type="' + mimeType + '"]')
      .each(function() {
        var item = $(this),
            src = item.attr('data-src'),
            name = item.attr('data-name'),
            isDefault = typeof item.attr('data-default') === 'string',
            code = item.text(),
            map;
        map = construct(name, src, code);
        cache.set(map.name, map);
        if (isDefault) {
          Map.setDefault(cache, name);
        }
      });
  };
  /**
   * Disposes of all maps
   * @method dispose
   * @static
   *
   * @param {Lavaca.util.Cache} cache  The map cache
   */
  Map.dispose = function(cache) {
    cache.dispose();
  };

  return Map;

});

define('lavaca/util/Config',['require','./Cache','./Map'],function(require) {

  var Cache = require('./Cache'),
      Map = require('./Map');

  var _cache = new Cache();

  function _construct(name, src, code) {
    if (code) {
      code = JSON.parse(code);
    }
    return new Config(name, src, code);
  }

  /**
   * Configuration management type
   * @class lavaca.util.Config
   * @extends lavaca.util.Map
   */
  var Config = Map.extend({
    // Empty (no overrides)
  });
  /**
   * Sets the application's default config
   * @method setDefault
   * @static
   *
   * @param {String} name  The name of the default config
   */
  Config.setDefault = function(name) {
    Map.setDefault(_cache, name);
  };
  /**
   * Gets the application's current config environment name
   * @method currentEnvironment
   * @static
   *
   * @return {String} The name of the current environment
   */
  Config.currentEnvironment = function() {
    return _cache.get('default').name;
  };
  /**
   * Retrieves a value from the configuration
   * @method get
   * @static
   * @param {String} code  The name of the parameter
   * @return {Object}  The value of the parameter
   */
   /**
   * Retrieves a value from the configuration
   * @method get
   * @static
   * @param {String} name  The name of the config
   * @param {String} code  The name of the parameter
   * @return {Object}  The value of the parameter
   */
  Config.get = function(name, code) {
    return Map.get(_cache, name, code, 'default');
  };
  /**
   * Scans the document for all translations and prepares them
   * @method init
   * @static
   */
   /**
   * Scans the document for all translations and prepares them
   * @method init
   * @static
   * @param {jQuery} scope  The element to which to limit the scan
   */
  Config.init = function(scope) {
    Map.init(_cache, 'text/x-config', _construct, scope);
  };
  /**
   * Disposes of all translations
   * @method dispose
   * @static
   */
  Config.dispose = function() {
    Map.dispose(_cache);
  };

  Config.init();

  return Config;

});

define('lavaca/mvc/Model',['require','lavaca/events/EventDispatcher','lavaca/net/Connectivity','lavaca/util/ArrayUtils','lavaca/util/Cache','lavaca/util/Promise','mout/lang/deepClone','mout/object/merge','lavaca/util/Config'],function(require) {

  var EventDispatcher = require('lavaca/events/EventDispatcher'),
      Connectivity = require('lavaca/net/Connectivity'),
      ArrayUtils = require('lavaca/util/ArrayUtils'),
      Cache = require('lavaca/util/Cache'),
      Promise = require('lavaca/util/Promise'),
      clone = require('mout/lang/deepClone'),
      merge = require('mout/object/merge'),
      Config = require('lavaca/util/Config');


  var UNDEFINED;

  function _triggerAttributeEvent(model, event, attribute, previous, value, messages) {
    model.trigger(event, {
      attribute: attribute,
      previous: previous === UNDEFINED ? null : previous,
      value: value === UNDEFINED ? model.get(attribute) : value,
      messages: messages || []
    });
  }

  function _setFlagOn(model, name, flag) {
    var keys = model.flags[flag];
    if (!keys) {
      keys = model.flags[flag] = [];
    }
    if (!ArrayUtils.contains(keys, name)) {
      keys.push(name);
    }
  }

  function _suppressChecked(model, suppress, callback) {
    suppress = !!suppress;
    var props = ['suppressValidation', 'suppressEvents', 'suppressTracking'],
        old = {},
        i = -1,
        prop,
        result;
    while (!!(prop = props[++i])) {
      old[prop] = model[prop];
      model[prop] = suppress || model[prop];
    }
    result = callback.call(model);
    i = -1;
    while (!!(prop = props[++i])) {
      model[prop] = old[prop];
    }
    return result;
  }

  function _isValid(messages){
    var isValid = true;
    for(var attribute in messages){
      if (messages[attribute].length > 0){
        isValid = false;
      }
    }
    messages.isValid = isValid;
    return messages;
  }


  // Virtual type
  /**
   * Event type used when an attribute is modified
   * @class lavaca.mvc.AttributeEvent
   * @extends Event
   */
   /**
   * The name of the event-causing attribute
   * @property {String} attribute
   * @default null
   */
   /**
   * The value of the attribute before the event
   * @property {Object} previous
   * @default null
   */
   /**
   * The value of the attribute after the event
   * @property {Object} value
   * @default null
   */
   /**
   * A list of validation messages the change caused
   * @property {Array} messages
   * @default []
   */

  /**
   * Basic model type
   * @class lavaca.mvc.Model
   * @extends lavaca.events.EventDispatcher
   *
   * Place the events where they are triggered in the code, see the yuidoc syntax reference and view.js for rendersuccess trigger
   * @event change
   * @event invalid
   * @event fetchSuccess
   * @event fetchError
   * @event saveSuccess
   * @event saveError
   *
   * @constructor
   * @param {Object} [map]  A parameter hash to apply to the model
   */
  var Model = EventDispatcher.extend(function(map) {
    EventDispatcher.call(this);
    this.attributes = new Cache();
    this.rules = new Cache();
    this.unsavedAttributes = [];
    this.flags = {};
    if (this.defaults) {
      map = merge({}, this.defaults, map);
    }
    if (map) {
      this.suppressEvents
        = this.suppressTracking
        = true;
      this.apply(map);
      this.suppressEvents
        = this.suppressTracking
        = false;
    }
  }, {
    /**
     * When true, attributes are not validated
     * @property suppressValidation
     * @default false
     *
     * @type Boolean
     */

    suppressValidation: false,
    /**
     * When true, changes to attributes are not tracked
     * @property suppressTracking
     * @default false
     *
     * @type Boolean
     */

    suppressTracking: false,
    /**
     * Gets the value of a attribute
     * @method get
     *
     * @param {String} attribute  The name of the attribute
     * @return {Object}  The value of the attribute, or null if there is no value
     */
    get: function(attribute) {
      var attr = this.attributes.get(attribute),
          flags;
      if (typeof attr === 'function') {
        flags = this.flags[Model.DO_NOT_COMPUTE];
        return !flags || ArrayUtils.indexOf(flags, attribute) === -1 ? attr.call(this) : attr;
      }
      return attr;
    },
    /**
     * Determines whether or not an attribute can be assigned
     * @method canSet
     *
     * @param {String} attribute  The name of the attribute
     * @return {Boolean}  True if you can assign to the attribute
     */
    canSet: function() {
      return true;
    },
    /**
     * Sets the value of the attribute, if it passes validation
     * @method set
     *
     * @param {String} attribute  The name of the attribute
     * @param {Object} value  The new value
     * @return {Boolean}  True if attribute was set, false otherwise
     *
     */
    /**
     * Sets the value of the attribute, if it passes validation
     * @method set
     *
     * @param {String} attribute  The name of the attribute
     * @param {Object} value  The new value
     * @param {String} flag  A metadata flag describing the attribute
     * @param {Boolean} suppress  When true, validation, events and tracking are suppressed
     * @return {Boolean}  True if attribute was set, false otherwise
     */
//* @event invalid
//* @event change


    set: function(attribute, value, flag, suppress) {
      return _suppressChecked(this, suppress, function() {
        if (!this.canSet(attribute)) {
          return false;
        }
        var previous = this.attributes.get(attribute),
            messages = this.suppressValidation ? [] : this.validate(attribute, value);
        if (messages.length) {
          _triggerAttributeEvent(this, 'invalid', attribute, previous, value, messages);
          return false;
        } else {
          if (previous !== value) {
            this.attributes.set(attribute, value);
            if (flag) {
              _setFlagOn(this, attribute, flag);
            }
            _triggerAttributeEvent(this, 'change', attribute, previous, value);
            if (!this.suppressTracking
                && !ArrayUtils.contains(this.unsavedAttributes, attribute)) {
              this.unsavedAttributes.push(attribute);
            }
          }
          return true;
        }
      });
    },
    /**
     * Determines whether or not this model has a named attribute
     * @method has
     *
     * @param {String} attribute  The name of the attribute
     * @return {Boolean}  True if the attribute exists and has a value
     */
    has: function(attribute) {
      return this.get(attribute) !== null;
    },
    /**
     * The name of the ID attribute
     * @property id
     * @default 'id'
     *
     * @type String
     */

    idAttribute: 'id',
    /**
     * Gets the ID of the model
     * @method id
     *
     * @return {String}  The ID of the model
     */
    id: function() {
      return this.get(this.idAttribute);
    },
    /**
     * Determines whether or not this model has been saved before
     * @method isNew
     *
     * @return {Boolean}  True when the model has no ID associated with it
     */
    isNew: function() {
      return null === this.id();
    },
    /**
     * Ensures that a map is suitable to be applied to this model
     * @method parse
     *
     * @param {Object} map  The string or key-value hash to parse
     * @return {Object}  The parsed version of the map
     */
    parse: function(map) {
      if (typeof map === 'string') {
        map = JSON.parse(map);
      }
      return map;
    },
    /**
     * Sets each attribute of this model according to the map
     * @method apply
     *
     * @param {Object} map  The string or key-value map to parse and apply
     */
    /**
     * Sets each attribute of this model according to the map
     * @method apply
     *
     * @param {Object} map  The string or key-value map to parse and apply
     * @param {Boolean} suppress  When true, validation, events and tracking are suppressed
     */
    apply: function(map, suppress) {
      _suppressChecked(this, suppress, function() {
        map = this.parse(map);
        for (var n in map) {
          this.set(n, map[n]);
        }
      });
    },
    /**
     * Removes all data from the model or removes selected flag from model.
     * @method clear
     *
     * @sig
     * Removes all flagged data from the model
     * @param {String} flag  The metadata flag describing the data to remove
     */
    clear: function(flag) {
      if (flag) {
        var attrs = this.flags[flag],
            i = -1,
            attr,
            item;
        if (attrs) {
          while (!!(attr = attrs[++i])) {
            ArrayUtils.remove(this.unsavedAttributes, attr);
            item = this.get(attr);
            if (item && item.dispose) {
              item.dispose();
            }
            this.set(attr, null);
          }
        }
      } else {
        this.attributes.dispose();
        this.attributes = new Cache();
        this.unsavedAttributes.length = 0;
      }
    },
    /**
     * Makes a copy of this model
     * @method clone
     *
     * @return {Lavaca.mvc.Model}  The copy
     */
    clone: function() {
      return new this.constructor(this.attributes.toObject());
    },
    /**
     * Adds a validation rule to this model
     * @method addRule
     *
     * @param {String} attribute  The name of the attribute to which the rule applies
     * @param {Function} callback  The callback to use to validate the attribute, in the
     *   form callback(attribute, value)
     * @param {String} message  A text message used when a value fails the test
     */
    addRule: function(attribute, callback, message) {
      this.rules.get(attribute, []).push({rule: callback, message: message});
    },
    /**
     * Validates all attributes on the model
     * @method validate
     *
     * @return {Object}  A map of attribute names to validation error messages
     */
    /**
     * Runs validation tests for a specific attribute
     * @method validate
     *
     * @param {String}  The name of the attribute to test
     * @return {Array}  A list of validation error messages
     */
    /**
     * Runs validation against a potential value for a attribute
     * @method validate
     * @param {String} attribute  The name of the attribute
     * @param {Object} value  The potential value for the attribute
     * @return {Array}  A list of validation error messages
     */
    validate: function(attribute, value) {
      var messages,
          rules,
          i = -1,
          rule;
      if (attribute) {
        messages = [];
        value = value === UNDEFINED ? this.get(attribute, value) : value;
        rules = this.rules.get(attribute);
        if (rules) {
          while (!!(rule = rules[++i])) {
            if (!rule.rule(attribute, value)) {
              messages.push(rule.message);
            }
          }
        }
        return messages;
      } else {
        messages = {};
        this.rules.each(function(attributeName) {
          messages[attributeName] = this.validate(attributeName);
        }, this);
        return _isValid(messages);
      }
    },
    /**
     * Processes the data received from a fetch request
     * @method onFetchSuccess
     *
     * @param {Object} response  The response data
     */
    onFetchSuccess: function(response) {
      response = this.parse(response);
      if (this.responseFilter && typeof this.responseFilter === 'function') {
        response = this.responseFilter(response);
      }
      this.apply(response, true);
      this.trigger('fetchSuccess', {response: response});
    },
    /**
     * Triggered when the model is unable to fetch data
     * @method onFetchError
     *
     * @param {Object} value  The error value
     */
    onFetchError: function(response) {
      this.trigger('fetchError', {response: response});
    },
    /**
     * Loads the data for this model from the server and only apply to this model attributes (Note: Does not clear the model first)
     * @method fetch
     *
     * @event fetchSuccess
     * @event fetchError
     */
    /**
     * Loads the data for this model from the server and only apply to this model attributes (Note: Does not clear the model first)
     * @method fetch
     *
     * @param {String} url  The URL from which to load the data
     * @return {Lavaca.util.Promise}  A promise
     */
    /**
     * Loads the data for this model from the server and only apply to this model attributes (Note: Does not clear the model first)
     * @method fetch
     *
     * @param {Object} options  jQuery AJAX settings. If url property is missing, fetch() will try to use the url property on this model
     * @return {Lavaca.util.Promise}  A promise
     */
    /**
     * Loads the data for this model from the server and only apply to this model attributes (Note: Does not clear the model first)
     * @method fetch
     *
     * @param {String} url  The URL from which to load the data
     * @param {Object} options  jQuery AJAX settings
     * @return {Lavaca.util.Promise}  A promise
     */
    fetch: function(url, options) {
      if (typeof url === 'object') {
        options = url;
      } else {
        options = clone(options || {});
        options.url = url;
      }
      options.url = this.getApiURL(options.url || this.url);
      return Promise.when(this, Connectivity.ajax(options))
        .success(this.onFetchSuccess)
        .error(this.onFetchError);
    },
    /**
     * Converts a relative path to an absolute api url based on environment config 'apiRoot'
     * @method getApiURL
     *
     * @param {String} relPath  A relative path
     * @return {String}  A formated api url or an apparently bad url '/please_set_model_url' if relPath argument is faslsy
     */
    getApiURL: function(relPath) {
      var badURL = '/please_set_model_url',
          apiRoot = Config.get('apiRoot'),
          apiURL;
      if (!relPath) {
        return badURL;
      }
      apiURL = (apiRoot || '') + relPath;
      return apiURL;
    },
    /**
     * Saves the model
     * @method save
     *
     *
     * @param {Function} callback  A function callback(model, changedAttributes, attributes)
     *   that returns either a promise or a truthy value
     *   indicating whether the operation failed or succeeded
     * @return {Lavaca.util.Promise}  A promise
     */
    /**
     * Saves the model
     * @method save
     *
     * @param {Function} callback  A function callback(model, changedAttributes, attributes)
     *   that returns either a promise or a truthy value
     *   indicating whether the operation failed or succeeded
     * @param {Object} thisp  The context for the callback
     * @return {Lavaca.util.Promise}  A promise
     */

//* @event saveSuccess
//* @event saveError

    save: function(callback, thisp) {
      var promise = new Promise(this),
          attributes = this.toObject(),
          changedAttributes = {},
          i = -1,
          attribute,
          result;
      while (!!(attribute = this.unsavedAttributes[++i])) {
        changedAttributes[attribute] = attributes[attribute];
      }
      promise
        .success(function(value) {
          var idAttribute = this.idAttribute;
          if (this.isNew() && value[idAttribute] !== UNDEFINED) {
            this.set(idAttribute, value[idAttribute]);
          }
          this.unsavedAttributes = [];
          this.trigger('saveSuccess', {response: value});
        })
        .error(function(value) {
          this.trigger('saveError', {response: value});
        });
      result = callback.call(thisp || this, this, changedAttributes, attributes);
      if (result instanceof Promise) {
        promise.when(result);
      } else if (result) {
        promise.resolve(result);
      } else {
        promise.reject(result);
      }
      return promise;
    },
    /**
     * Saves the model to the server via POST
     * @method saveToServer
     *
     * @param {String} url  The URL to which to post the data
     * @return {Lavaca.util.Promise}  A promise
     */
    saveToServer: function(url) {
      return this.save(function(model, changedAttributes, attributes) {
        var id = this.id(),
            data;
        if (this.isNew()) {
          data = attributes;
        } else {
          changedAttributes[this.idAttribute] = id;
          data = changedAttributes;
        }
        return Promise.when(this, Connectivity.ajax({
            url: url,
            cache: false,
            type: 'POST',
            data: data,
            dataType: 'json'
          }));
      });
    },
    /**
     * Converts this model to a key-value hash
     * @method toObject
     *
     * @return {Object}  The key-value hash
     */
    toObject: function() {
      var obj = this.attributes.toObject(),
          flags;
      for(var key in obj) {
        if(typeof obj[key] === "function") {
          flags = this.flags[Model.DO_NOT_COMPUTE];
          if (!flags || ArrayUtils.indexOf(flags, key) === -1) {
            obj[key] = obj[key].call(this);
          }
        }
      }
      return obj;
    },
    /**
     * Converts this model to JSON
     * @method toJSON
     *
     * @return {String}  The JSON string representing the model
     */
    toJSON: function() {
      return JSON.stringify(this.toObject());
    },
    /**
     * Bind an event handler to this object
     * @method on
     *
     *
     * @param {String} type  The name of the event
     * @param {Function} callback  The function to execute when the event occurs
     * @return {Lavaca.events.EventDispatcher}  This event dispatcher (for chaining)
     */
    /**
     * Bind an event handler to this object
     * @method on
     *
     * @param {String} type  The name of the event
     * @param {String} attr  An attribute to which to limit the scope of events
     * @param {Function} callback  The function to execute when the event occurs
     * @return {Lavaca.events.EventDispatcher}  This event dispatcher (for chaining)
     */
    /**
     * Bind an event handler to this object
     * @method on
     * @param {String} type  The name of the event
     * @param {Function} callback  The function to execute when the event occurs
     * @param {Object} thisp  The context of the handler
     * @return {Lavaca.events.EventDispatcher}  This event dispatcher (for chaining)
     */
    /**
     * Bind an event handler to this object
     * @method on
     * @param {String} type  The name of the event
     * @param {String} attr  An attribute to which to limit the scope of events
     * @param {Function} callback  The function to execute when the event occurs
     * @param {Object} thisp  The context of the handler
     * @return {Lavaca.events.EventDispatcher}  This event dispatcher (for chaining)
     */
    on: function(type, attr, callback, thisp) {
      if (typeof attr === 'function') {
        thisp = callback;
        callback = attr;
        attr = null;
      }
      function handler(e) {
        if (!attr || e.attribute === attr) {
          callback.call(thisp || this, e);
        }
      }
      handler.fn = callback;
      handler.thisp = thisp;
      return EventDispatcher.prototype.on.call(this, type, handler, thisp);
    },
    /**
    * Filters the raw response from onFetchSuccess() down to a custom object. (Meant to be overriden)
    * @method responseFilter
    *
    * @param {Object} response  The raw response passed in onFetchSuccess()
    * @return {Object}  An object to be applied to this model instance
    */
    responseFilter: function(response) {
      return response;
    }
  });
  /**
   * @field {String} SENSITIVE
   * @static
   * @default 'sensitive'
   * Flag indicating that data is sensitive
   */
  Model.SENSITIVE = 'sensitive';
  /**
   * @field {String} DO_NOT_COMPUTE
   * @static
   * @default 'do_not_compute'
   * Flag indicating that the selected attribute should not be executed
   * as a computed property and should instead just return the function.
   */
  Model.DO_NOT_COMPUTE = 'do_not_compute';

  return Model;

});

define('lavaca/ui/Template',['require','lavaca/util/Cache','lavaca/util/Map'],function(require) {

  var Cache = require('lavaca/util/Cache'),
      Map = require('lavaca/util/Map');

  var _cache = new Cache(),
      _types = [];

  /**
   * Abstract type for templates
   * @class lavaca.ui.Template
   * @extends lavaca.util.Map
   */
  var Template = Map.extend({
    /**
     * Compiles the template
     * @method compile
     */
    compile: function() {
      // Do nothing
    },
    /**
     * Renders the template to a string
     * @method render
     *
     * @param {Object} model  The data model to provide to the template
     * @return {Lavaca.util.Promise}  A promise
     */
    render: function() {
      throw 'Abstract';
    },
    /**
     * Parses server data to include in this lookup
     * @method process
     *
     * @param {String} text  The server data string
     */
    process: function(text) {
      this.code = text;
    }
  });
  /**
   * Finds the template with a given name
   * @method get
   * @static
   *
   * @param {String} name  The name of the template
   * @return {Lavaca.ui.Template}  The template (or null if no such template exists)
   */
  Template.get = function(name) {
    return _cache.get(name);
  };
  /**
   * Scans the document for all templates with registered types and
   *   prepares template objects from them
   * @method init
   * @static
   */
   /**
   *
   * Scans the document for all templates with registered types and
   *   prepares template objects from them
   * @method init
   * @static
   * @param {jQuery} scope  The element to which to limit the scan
   */
  Template.init = function(scope) {
    var i = -1,
        type, templates, templateName, template;

    while (!!(type = _types[++i])) {
      var construct = function(name, src, code) {
        return new type.js(name, src, code);
      };

      // Load pre-compiled templates
      if (typeof type.js.getCompiledTemplates === "function") {
        templates = type.js.getCompiledTemplates();
        for (templateName in templates) {
          template = construct(templateName, null, templates[templateName]);
          template.compiled = true;
          _cache.set(templateName, template);
        }
      }

      // Load un-compiled templates
      if (type.mime) {
        Map.init(_cache, type.mime, construct, scope);
      }
    }
  };
  /**
   * Disposes of all templates
   * @method dispose
   * @static
   */
  Template.dispose = function() {
    Map.dispose(_cache);
  };
  /**
   * Finds the named template and renders it to a string
   * @method render
   * @static
   *
   * @param {String} name  The name of the template
   * @param {Object} model  The data model to provide to the template
   * @return {Lavaca.util.Promise}  A promise
   */
  Template.render = function(name, model) {
    var template = Template.get(name);
    if (!template) {
      throw 'No template named "' + name + '"';
    } else {
      return template.render(model);
    }
  };
  /**
   * Registers a type of template to look for on intilization.
   * @method register
   * @static
   * @param {String} mimeType  The mime-type associated with the template
   * @param {Function} TTemplate  The JavaScript type used for the template (should derive from [[Lavaca.ui.Template]])
   */
   /**
   * Registers a type of template to look for on intilization.
   * @method register
   * @static
   * @param {Function} TTemplate  The JavaScript type used for the template (should derive from [[Lavaca.ui.Template]])
   */
  Template.register = function(mimeType, TTemplate) {
    if (typeof mimeType === "function") {
      TTemplate = mimeType;
      mimeType = null;
    }
    _types[_types.length] = {mime: mimeType, js: TTemplate};
  };

  return Template;

});

define('lavaca/util/log',[],function() {
  /**
   * Logs to the console (or alerts if no console exists)
   * @class lavaca.util.log
   */
   /**
   * Logs to the console (or alerts if no console exists)
   * @method log
   * @static
   *
   * @params {Object} arg  The content to be logged
   */
  var log = function() {
    if (window.console) {
      console.log.apply(console, arguments);
    } else {
      alert([].join.call(arguments, ' '));
    }
  };

  return log;

});

define('lavaca/mvc/View',['require','$','lavaca/events/EventDispatcher','lavaca/mvc/Model','lavaca/ui/Template','lavaca/util/Cache','lavaca/util/Promise','lavaca/util/log','lavaca/util/uuid'],function(require) {

  var $ = require('$'),
    EventDispatcher = require('lavaca/events/EventDispatcher'),
    Model = require('lavaca/mvc/Model'),
    Template = require('lavaca/ui/Template'),
    Cache = require('lavaca/util/Cache'),
    Promise = require('lavaca/util/Promise'),
    log = require('lavaca/util/log'),
    uuid = require('lavaca/util/uuid');




  /**
   * Base View Class
   * @class lavaca.mvc.View
   * @extends lavaca.events.EventDispatcher
   * @constructor
   * @param {Object | String} el the selector or Object for the element to attach to the view
   * @param {Object} [model] the model for the view
   * @param {Object} [parentView] the parent view for the view
   *
   *
   */
  var View = EventDispatcher.extend(function(el, model, parentView) {
    EventDispatcher.call(this);

    /**
     * The model used by the view
     * @property model
     * @default null
     * @optional
     * @type lavaca.mvc.Model
     *
     */
    this.model = model || null;

    /**
     * An id is applied to a data property on the views container
     * @property id
     * @default generated from className and unique identifier
     * @type String
     *
     */
    this.id = this.className + '-' + uuid();

    /**
     * If the view is created in the context of a childView, the parent view is assigned to this view
     * @property parentView
     * @default null
     * @type Object
     *
     */
    this.parentView = parentView || null;

    /**
     * The element that is either assigned to the view if in the context of a childView, or is created for the View
     * if it is a PageView
     * @property el
     * @default null
     * @type Object | String
     *
     */
    this.el = typeof el === 'string' ? $(el) : (el || null);

    /**
     * A dictionary of selectors and event types in the form
     * {eventType: {delegate: 'xyz', callback: func}}@property el
     * @property eventMap
     * @default {}
     * @type Object
     */
    this.eventMap = {};
    /**
     * A dictionary of selectors, View types and models in the form
     *   {selector: {TView: TView, model: model}}}
     * @property {Object} childViewMap
     * @default {}
     * @type Object
     *
     */
    this.childViewMap = {};
    /**
     * Interactive elements used by the view
     * @property childViews
     * @default lavaca.util.cache
     * @type lavaca.util.Cache
     */
    this.childViews = new Cache();
    /**
     * A dictionary of selectors and widget types in the form
     *   {selector: widgetType}
     * @property {Object} widgetMap
     * @default {}
     * @type Object
     */
    this.widgetMap = {};
    /**
     * Interactive elements used by the view
     * @property widgets
     * @default lavaca.util.Cache
     * @type lavaca.util.Cache
     */
    this.widgets = new Cache();
    /**
     *  A map of all the events to be applied to child Views in the form of
     *  {type: {TView: TView, callback : callback}}
     * @property childViewEventMap
     * @default Object
     * @type Object
     */
    this.childViewEventMap = {};

    this
      .on('rendersuccess', this.onRenderSuccess)
      .on('rendererror', this.onRenderError);

    if (this.autoRender) {
      this.render();
    }
  }, {
    /**
     * The element associated with the view
     * @property {jQuery} el
     * @default null
     *
     */
    el: null,
    /**
     * The name of the template associated with the view
     * @property {String} template
     * @default null
     *
     */
    template: null,
    /**
     * A class name added to the view container
     * @property String className
     * @default null
     *
     */
    className: null,
    /**
     * Will render any childViews automatically when set to true
     * @property autoRender
     * @default false
     *
     * @type Boolean
     */
    autoRender: false,
    /**
     * Renders the view using its template and model
     * @method render
     *
     *
     *
     * @return {lavaca.util.Promise} A promise
     */
    render: function() {
      var self = this,
        promise = new Promise(this),
        renderPromise = new Promise(this),
        template = Template.get(this.template),
        model = this.model;
      if (model instanceof Model) {
        model = model.toObject();
      }
      /**
       * Fires when html from template has rendered
       * @event rendersuccess
       */
      promise
        .success(function(html) {
          this.trigger('rendersuccess', {html: html});
          renderPromise.resolve();
        })
      /**
       * Fired when there was an error during rendering process
       * @event rendererror
       */
        .error(function(err) {
          this.trigger('rendererror', {err: err});
          renderPromise.reject();
        });
      template
        .render(model)
        .success(promise.resolver())
        .error(promise.rejector())
        .then(function() {
          if (self.className){
            self.el.addClass(self.className);
          }
        });

      return renderPromise;
    },

    /**
     * Re-renders the view's template and replaces the DOM nodes that match
     * the selector argument. If no selector argument is provided, the whole view
     * will be re-rendered. If the first parameter is passed as <code>false</code>
     * the resulting html will pe passed with the promise and nothing will be replaced.
     * Note: the number of elements that match the provided selector must be identical
     * in the current markup and in the newly rendered markup or else the returned
     * promise will be rejected.
     * Re-renders the view's template using the view's model
     * and redraws the entire view
     * @method redraw
     *
     * @return {lavaca.util.Promise} A promise
     */
    /**
     * Re-renders the view's template using the specified model
     * and redraws the entire view
     * @method redraw
     * @param {Object} model  The data model to be passed to the template
     * @return {lavaca.util.Promise} A promise
     */
    /**
     * Re-renders the view's template using the view's model and only redraws the
     * elements that match the specified selector string.
     * Note: The numbers of items that match the selector must
     * be exactly the same in the view's current markup and in the newly rendered
     * markup. If that is not the case, the returned promise will be rejected and
     * nothing will be redrawn.
     * @method redraw
     * @param {String} selector  Selector string that defines elements to redraw
     * @return {lavaca.util.Promise} A promise
     */
    /**
     * Re-renders the view's template using the specified model and only redraws the
     * elements that match the specified selector string.
     * Note: The numbers of items that match the selector must
     * be exactly the same in the view's current markup and in the newly rendered
     * markup. If that is not the case, the returned promise will be rejected and
     * nothing will be redrawn.
     * @method redraw
     * @param {String} selector  Selector string that defines elements that will be updated
     * @param {Object} model  The data model to be passed to the template
     * @return {lavaca.util.Promise} A promise
     */
    /**
     * Re-renders the view's template using the view's model. If shouldRedraw is true,
     * the entire view will be redrawn. If shouldRedraw is false, nothing will be redrawn,
     * but the returned promise will be resolved with the newly rendered content. This allows
     * the caller to attach a success handler to the returned promise and define their own
     * redrawing behavior.
     * @method redraw
     * @param {Boolean} shouldRedraw  Whether the view should be automatically redrawn.
     * @return {lavaca.util.Promise}  A promise
     */
    /**
     * Re-renders the view's template using the specified model. If shouldRedraw is true,
     * the entire view will be redrawn. If shouldRedraw is false, nothing will be redrawn,
     * but the returned promise will be resolved with the newly rendered content. This allows
     * the caller to attach a success handler to the returned promise and define their own
     * redrawing behavior.
     * @method redraw
     * @param {Boolean} shouldRedraw  Whether the view should be automatically redrawn.
     * @param {Object} model  The data model to be passed to the template
     * @return {lavaca.util.Promise}  A promise
     */
    redraw: function(selector, model) {
      var self = this,
        templateRenderPromise = new Promise(this),
        redrawPromise = new Promise(this),
        template = Template.get(this.template),
        replaceAll;
      if (typeof selector === 'object' || selector instanceof Model) {
        model = selector;
        replaceAll = true;
        selector = null;
      }
      else if (typeof selector === 'boolean') {
        replaceAll = selector;
        selector = null;
      } else if (!selector) {
        replaceAll = true;
      }
      model = model || this.model;
      if (model instanceof Model) {
        model = model.toObject();
      }

      // process widget, child view, and
      // child view event maps
      function processMaps() {
        self.createWidgets();
        self.createChildViews();
        self.applyChildViewEvents();
      }
      templateRenderPromise
        .success(function(html) {
          if (replaceAll) {
            this.disposeChildViews(this.el);
            this.disposeWidgets(this.el);
            this.el.html(html);
            processMaps();
            redrawPromise.resolve(html);
            return;
          }
          if(selector) {
            var $newEl = $('<div>' + html + '</div>').find(selector),
              $oldEl = this.el.find(selector);
            if($newEl.length === $oldEl.length) {
              $oldEl.each(function(index) {
                var $el = $(this);
                self.disposeChildViews($el);
                self.disposeWidgets($el);
                $el.replaceWith($newEl.eq(index)).remove();
              });
              processMaps();
              redrawPromise.resolve(html);
            } else {
              redrawPromise.reject('Count of items matching selector is not the same in the original html and in the newly rendered html.');
            }
          } else {
            redrawPromise.resolve(html);
          }
        })
        .error(redrawPromise.rejector());
      template
        .render(model)
        .success(templateRenderPromise.resolver())
        .error(templateRenderPromise.rejector());
      return redrawPromise;
    },

    /**
     * Dispose old widgets and child views
     * @method disposeChildViews
     * @param  {Object} $el the $el to search for child views and widgets in
     */
    disposeChildViews: function ($el) {
      var childViewSearch,
        self = this;

      // Remove child views
      childViewSearch = $el.find('[data-view-id]');
      if ($el !== self.el && $el.is('[data-view-id]')) {
        childViewSearch = childViewSearch.add($el);
      }
      childViewSearch.each(function(index, item) {
        var $item = $(item),
          childView = $item.data('view');

        self.childViews.remove(childView.id);
        childView.dispose();
      });
    },
    /**
     * Dispose old widgets and child views
     * @method disposeWidgets
     * @param  {Object} $el the $el to search for child views and widgets in
     */
    disposeWidgets: function ($el) {
      var self = this;

      // Remove widgets
      $el.add($el.find('[data-has-widgets]')).each(function(index, item) {
        var $item = $(item),
          widgets = $item.data('widgets'),
          selector, widget;
        for (selector in widgets) {
          widget = widgets[selector];
          self.widgets.remove(widget.id);
          widget.dispose();
        }
      });
      $el.removeData('widgets');
    },
    /**
     * Unbinds events from the model
     * @method clearModelEvents
     *
     */
    clearModelEvents: function() {
      var type,
        callback,
        dotIndex;
      if (this.eventMap
        && this.eventMap.model
        && this.model
        && this.model instanceof EventDispatcher) {
        for (type in this.eventMap.model) {
          callback = this.eventMap.model[type];
          if (typeof callback === 'object') {
            callback = callback.on;
          }
          dotIndex = type.indexOf('.');
          if (dotIndex !== -1) {
            type = type.substr(0, dotIndex);
          }
          this.model.off(type, callback);
        }
      }
    },
    /**
     * Checks for strings in the event map to bind events to this automatically
     * @method bindMappedEvents
     */
    bindMappedEvents: function() {
      var callbacks,
        delegate,
        type;
      for (delegate in this.eventMap) {
        callbacks = this.eventMap[delegate];
        for (type in callbacks) {
          if (typeof this.eventMap[delegate][type] === 'string'){
            this.eventMap[delegate][type] = this[this.eventMap[delegate][type]].bind(this);
          }
        }
      }
    },
    /**
     * Binds events to the view
     * @method applyEvents
     *
     */
    applyEvents: function() {
      var el = this.el,
        callbacks,
        callback,
        property,
        delegate,
        type,
        dotIndex,
        opts;
      for (delegate in this.eventMap) {
        callbacks = this.eventMap[delegate];
        if (delegate === 'self') {
          delegate = null;
        }
        for (type in callbacks) {
          callback = callbacks[type];
          if (typeof callback === 'object') {
            opts = callback;
            callback = callback.on;
          } else {
            opts = undefined;
          }
          if (typeof callback === 'string') {
            if (callback in this) {
              callback = this[callback].bind(this);
            }
          }
          if (delegate === 'model') {
            if (this.model && this.model instanceof Model) {
              dotIndex = type.indexOf('.');
              if (dotIndex !== -1) {
                property = type.substr(dotIndex+1);
                type = type.substr(0, dotIndex);
              }
              this.model.on(type, property, callback, this);
            }
          } else if (type === 'animationEnd' && el.animationEnd) {
            el.animationEnd(delegate, callback);
          } else if (type === 'transitionEnd' && el.transitionEnd) {
            el.transitionEnd(delegate, callback);
          } else {
            el.on(type, delegate, callback);
          }
        }
      }
    },
    /**
     * Maps multiple delegated events for the view
     * @method mapEvent
     *
     * @param {Object} map  A hash of the delegates, event types, and handlers
     *     that will be bound when the view is rendered. The map should be in
     *     the form <code>{delegate: {eventType: callback}}</code>. For example,
     *     <code>{'.button': {click: onClickButton}}</code>. The events defined in
     *     [[Lavaca.fx.Animation]] and [[Lavaca.fx.Transition]] are also supported.
     *     To map an event to the view's el, use 'self' as the delegate. To map
     *     events to the view's model, use 'model' as the delegate. To limit events
     *     to only a particular property on the model, use a period-seperated
     *     syntax such as <code>{model: {'change.myproperty': myCallback}}</code>
     * @return {lavaca.mvc.View}  This view (for chaining)
     */
    /**
     * Maps an event for the view
     * @method mapEvent
     * @param {String} delegate  The element to which to delegate the event
     * @param {String} type  The type of event
     * @param {Function} callback  The event handler
     * @return {lavaca.mvc.View}  This view (for chaining)
     */
    mapEvent: function(delegate, type, callback) {
      var o;
      if (typeof delegate === 'object') {
        o = delegate;
        for (delegate in o) {
          for (type in o[delegate]) {
            this.mapEvent(delegate, type, o[delegate][type]);
          }
        }
      } else {
        o = this.eventMap[delegate];
        if (!o) {
          o = this.eventMap[delegate] = {};
        }
        o[type] = callback;
      }
      return this;
    },
    /**
     * Initializes widgets on the view
     * @method createWidgets
     *
     */
    createWidgets: function() {
      var cache = this.widgets,
        n,
        o;
      for (n in this.widgetMap) {
        o = this.widgetMap[n];
        (n === 'self' ? this.el : this.el.find(n))
          .each(function(index, item) {
            var $el = $(item),
              widgetMap = $el.data('widgets') || {},
              widget;
            if (!widgetMap[n]) {
              widget = new o($(item));
              widgetMap[n] = widget;
              cache.set(widget.id, widget);
              $el.data('widgets', widgetMap);
              $el.attr('data-has-widgets','');
            }
          });
      }
    },
    /**
     * Assigns multiple widget types to elements on the view
     * @method mapWidget
     * @param {Object} map  A hash of selectors to widget types to be bound when the view is rendered.
     *     The map should be in the form {selector: TWidget}. For example, {'form': Lavaca.ui.Form}
     * @return {Lavaca.mvc.View}  This view (for chaining)
     *
     */
    /**
     * Assigns a widget type to be created for elements matching a selector when the view is rendered
     * @method mapWidget
     * @param {String} selector  The selector for the root element of the widget
     * @param {Function} TWidget  The [[Lavaca.ui.Widget]]-derived type of widget to create
     * @return {Lavaca.mvc.View}  This view (for chaining)
     */
    mapWidget: function(selector, TWidget) {
      if (typeof selector === 'object') {
        var widgetTypes = selector;
        for (selector in widgetTypes) {
          this.mapWidget(selector, widgetTypes[selector]);
        }
      } else {
        this.widgetMap[selector] = TWidget;
      }
      return this;
    },
    /**
     * Initializes child views on the view, called from onRenderSuccess
     * @method createChildViews
     *
     */
    createChildViews: function() {
      var cache = this.childViews,
        n,
        self = this,
        o;
      for (n in this.childViewMap) {
        o = this.childViewMap[n];
        this.el.find(n)
          .each(function(index, item) {
            var $el = $(item),
              childView;
            if (!$el.data('view')) {
              childView = new o.TView($el, o.model || self.model, self);
              cache.set(childView.id, childView);
            }
          });
      }
    },
    /**
     * Assigns multiple Views to elements on the view
     * @method mapChildView
     * @param {Object} map  A hash of selectors to view types and models to be bound when the view is rendered.
     *     The map should be in the form {selector: {TView : TView, model : lavaca.mvc.Model}}. For example, {'form': {TView : lavaca.mvc.ExampleView, model : lavaca.mvc.Model}}
     * @return {lavaca.mvc.View}  This view (for chaining)
     *
     * Assigns a View type to be created for elements matching a selector when the view is rendered
     * @method mapChildView
     * @param {String} selector  The selector for the root element of the View
     * @param {Function} TView  The [[Lavaca.mvc.View]]-derived type of view to create
     * @param {Function} model  The [[Lavaca.mvc.Model]]-derived model instance to use in the child view
     * @return {Lavaca.mvc.View}  This view (for chaining)
     */
    mapChildView: function(selector, TView, model) {
      if (typeof selector === 'object') {
        var childViewTypes = selector;
        for (selector in childViewTypes) {
          this.mapChildView(selector, childViewTypes[selector].TView, childViewTypes[selector].model);
        }
      } else {
        this.childViewMap[selector] = { TView: TView, model: model };
      }
      return this;
    },

    /**
     * Listen for events triggered from child views.
     * @method mapChildViewEvent
     *
     * @param {String} type The type of event to listen for
     * @param {Function} callback The method to execute when this event type has occured
     * @param {Lavaca.mvc.View} TView (Optional) Only listen on child views of this type
     */
    /**
     * Maps multiple child event types
     * @method mapChildViewEvent
     *
     * @param {Object} map A hash of event types with callbacks and TView's associated with that type
     *  The map should be in the form {type : {callback : {Function}, TView : TView}}
     */
    mapChildViewEvent: function(type, callback, TView) {
      if (typeof type === 'object'){
        var eventTypes = type;
        for (type in eventTypes){
          //add in view type to limit events created
          this.mapChildViewEvent(type, eventTypes[type].callback, eventTypes[type].TView);
        }
      } else {
        this.childViewEventMap[type] = {
          TView: TView,
          callback: callback
        };
      }
    },

    /**
     * Called from onRenderSuccess of the view, adds listeners to all childviews if present
     * @method applyChildViewEvent
     *
     */
    applyChildViewEvents: function() {
      var childViewEventMap = this.childViewEventMap,
        type;
      for (type in childViewEventMap) {
        this.childViews.each(function(key, item) {
          var callbacks,
            callback,
            i = -1;

          if (!childViewEventMap[type].TView || item instanceof childViewEventMap[type].TView) {
            callbacks = item.callbacks[type] || [];
            while (!!(callback = callbacks[++i])) {
              if (callback === childViewEventMap[type].callback) {
                return;
              }
            }
            item.on(type, childViewEventMap[type].callback);
          }
        });
      }
    },
    /**
     * Executes when the template renders successfully
     * @method onRenderSuccess
     *
     * @param {Event} e  The render event. This object should have a string property named "html"
     *   that contains the template's rendered HTML output.
     */
    onRenderSuccess: function(e) {
      this.el.html(e.html);
      this.bindMappedEvents();
      this.applyEvents();
      this.createWidgets();
      this.createChildViews();
      this.applyChildViewEvents();
      this.el.data('view', this);
      this.el.attr('data-view-id', this.id);
      this.hasRendered = true;
    },
    /**
     * Executes when the template fails to render
     * @method onRenderError
     *
     * @param {Event} e  The error event. This object should have a string property named "err"
     *   that contains the error message.
     */
    onRenderError: function(e) {
      log(e.err);
    },
    /**
     * Readies the view for garbage collection
     * @method dispose
     */
    dispose: function() {
      if (this.model) {
        this.clearModelEvents();
      }
      if (this.childViews.count()) {
        this.disposeChildViews(this.el);
      }
      if (this.widgets.count()) {
        this.disposeWidgets(this.el);
      }

      // Do not dispose of template or model
      this.template
        = this.model
        = this.parentView
        = null;

      EventDispatcher.prototype.dispose.apply(this, arguments);
    }
  });

  return View;

});

define('lavaca/mvc/PageView',['require','$','lavaca/mvc/Model','lavaca/mvc/View','lavaca/ui/Template','lavaca/util/Promise','lavaca/util/delay'],function(require) {

  var $ = require('$'),
      Model = require('lavaca/mvc/Model'),
      View = require('lavaca/mvc/View'),
      Template = require('lavaca/ui/Template'),
      Promise = require('lavaca/util/Promise'),
      delay = require('lavaca/util/delay');

  /**
   * Page View type, represents an entire screen
   * @class lavaca.mvc.PageView
   * @extends lavaca.mvc.View
   *
   * @constructor
   * @param {Object} el  The element that the PageView is bound to
   * @param {Object} model  The model used by the view
   * @param {Number} [layer]  The index of the layer on which the view sits
   *
   */
  var PageView = View.extend(function(el, model, layer) {

    View.call(this, el, model);
    /**
     * The index of the layer on which the view sits
     * @property {Number} layer
     * @default 0
     */
    this.layer = layer || 0;


  }, {

    /**
     * The element containing the view
     * @property {jQuery} shell
     * @default null
     */
    shell: null,

    /**
     * Creates the view's wrapper element
     * @method wrapper
     * @return {jQuery}  The wrapper element
     */
    wrapper: function() {
      return $('<div class="view"></div>');
    },
    /**
     * Creates the view's interior content wrapper element
     * @method interior
     * @return {jQuery} The interior content wrapper element
     */
    interior: function() {
      return $('<div class="view-interior"></div>');
    },


    /**
     * Adds this view to a container
     * @method insertInto
     * @param {jQuery} container  The containing element
     */
    insertInto: function(container) {
      if (this.shell.parent()[0] !== container[0]) {
        var layers = container.children('[data-layer-index]'),
            i = -1,
            layer;
        while (!!(layer = layers[++i])) {
          layer = $(layer);
          if (layer.attr('data-layer-index') > this.index) {
            this.shell.insertBefore(layer);
            return;
          }
        }
        container.append(this.shell);
      }
    },
    /**
     * Renders the view using its template and model, overrides the View class render method
     * @method render
     *
     * @return {Lavaca.util.Promise}  A promise
     */
    render: function() {
      var promise = new Promise(this),
          renderPromise = new Promise(this),
          template = Template.get(this.template),
          model = this.model;
      if (model instanceof Model) {
        model = model.toObject();
      }
      if (this.el) {
        this.el.remove();
      }

      this.shell = this.wrapper();
      this.el = this.interior();
      this.shell.append(this.el);
      this.shell.attr('data-layer-index', this.layer);
      if (this.className) {
        this.shell.addClass(this.className);
      }
      promise
        .success(function(html) {
          /**
           * Fires when html from template has rendered
           * @event rendersuccess
           */
          this.trigger('rendersuccess', {html: html});
          renderPromise.resolve();
        })
        .error(function(err) {
          /**
           * Fired when there was an error during rendering process
           * @event rendererror
           */
          this.trigger('rendererror', {err: err});
          renderPromise.reject();
        });
      template
        .render(model)
        .success(promise.resolver())
        .error(promise.rejector());

      return renderPromise;
    },
    /**
     * Executes when the user navigates to this view
     * @method enter
     * @param {jQuery} container  The parent element of all views
     * @param {Array} exitingViews  The views that are exiting as this one enters
     * @return {lavaca.util.Promise}  A promise
     */
    enter: function(container) {
      var promise = new Promise(this),
          renderPromise;
      container = $(container);
      if (!this.hasRendered) {
        renderPromise = this
          .render()
          .error(promise.rejector());
      }
      this.insertInto(container);
      if (renderPromise) {
        promise.when(renderPromise);
      } else {
        delay(promise.resolver());
      }
      promise.then(function() {
        /**
         * Fired when there was an error during rendering process
         * @event rendererror
         */
        this.trigger('enter');
      });
      return promise;
    },
    /**
     * Executes when the user navigates away from this view
     * @method exit
     *
     * @param {jQuery} container  The parent element of all views
     * @param {Array} enteringViews  The views that are entering as this one exits
     * @return {lavaca.util.Promise}  A promise
     */
    exit: function() {
      var promise = new Promise(this);
      this.shell.detach();
      delay(promise.resolver());
      promise.then(function() {
        /**
         * Fired when there was an error during rendering process
         * @event rendererror
         */
        this.trigger('exit');
      });
      return promise;
    }
  });

  return PageView;

});

define('lavaca/mvc/ViewManager',['require','$','lavaca/mvc/PageView','lavaca/util/ArrayUtils','lavaca/util/Cache','lavaca/util/Disposable','lavaca/util/Promise','lavaca/util/delay','mout/object/merge','lavaca/net/History'],function(require) {

  var $ = require('$'),
      PageView = require('lavaca/mvc/PageView'),
      ArrayUtils = require('lavaca/util/ArrayUtils'),
      Cache = require('lavaca/util/Cache'),
      Disposable = require('lavaca/util/Disposable'),
      Promise = require('lavaca/util/Promise'),
      delay = require('lavaca/util/delay'),
      merge = require('mout/object/merge'),
      History = require('lavaca/net/History');

  /**
   * Manager responsible for drawing views
   * @class lavaca.mvc.ViewManager
   * @extends lavaca.util.Disposable
   *
   * @constructor
   * @param {jQuery} el  The element that contains all layers
   */
  var ViewManager = Disposable.extend(function(el) {
    Disposable.call(this);
    /**
    * The element that contains all view layers
     * @property {jQuery} el
     * @default null
     */
    this.el = $(el || document.body);
    /**
     * A cache containing all views
     * @property {Lavaca.util.Cache} views
     * @default new Lavaca.util.Cache()
     */
    this.pageViews = new Cache();
    /**
     * A list containing all layers
     * @property {Array} layers
     * @default []
     */
    this.layers = [];
    /**
     * A list containing all views that are currently exiting
     * @property {Array} exitingPageViews
     * @default []
     */
    this.exitingPageViews = [];
    /**
     * A list containing all views that are currently entering
     * @property {Array} enteringPageViews
     * @default []
     */
    this.enteringPageViews = [];
  }, {
    /**
     * When true, the view manager is prevented from loading views.
     * @property {Boolean} locked
     * @default false
     */
    locked: false,
    /**
     * Sets the el property on the instance
     * @method setEl
     *
     * @param {jQuery} el  A jQuery object of the element that contains all layers
     * @return {Lavaca.mvc.ViewManager}  This View Manager instance
     */
    /**
     * Sets the el property on the instance
     * @method setEl
     *
     * @param {String} el  A CSS selector matching the element that contains all layers
     * @return {Lavaca.mvc.ViewManager}  This View Manager instance
     */
    setEl: function(el) {
      this.el = typeof el === 'string' ? $(el) : el;
      return this;
    },
    /**
     * Loads a view
     * @method load
     *
     * @param {String} cacheKey  The cache key associated with the view
     * @param {Function} TPageView  The type of view to load (should derive from [[Lavaca.mvc.View]])
     * @param {Object} model  The views model
     * @param {Number} layer  The index of the layer on which the view will sit
     * @return {Lavaca.util.Promise}  A promise
     */
    /**
     * Loads a view
     * @method load
     *
     * @param {String} cacheKey  The cache key associated with the view
     * @param {Function} TPageView  The type of view to load (should derive from [[Lavaca.mvc.View]])
     * @param {Object} model  The views model
     * @param {Object} params  Parameters to be mapped to the view
     * @return {Lavaca.util.Promise}  A promise
     */
    load: function(cacheKey, TPageView, model, params) {
      if (this.locked) {
        return (new Promise(this)).reject('locked');
      } else {
        this.locked = true;
      }
      params = params || {};
      var self = this,
          layer = layer || 0,
          pageView = this.pageViews.get(cacheKey),
          promise = new Promise(this),
          enterPromise = new Promise(promise),
          renderPromise = null,
          exitPromise = null;
      promise.always(function() {
        this.locked = false;
      });
      if (typeof params === 'number') {
        layer = params;
      } else if (params.layer) {
        layer = params.layer;
      }
      if (!pageView) {
        if (History.isRoutingBack && self.layers[layer] instanceof TPageView) {
          pageView = self.layers[layer];
        } else {
          pageView = new TPageView(null, model, layer);
          if (typeof params === 'object') {
            merge(pageView, params);
          }
          renderPromise = pageView.render();
          if (cacheKey !== null) {
            this.pageViews.set(cacheKey, pageView);
            pageView.cacheKey = cacheKey;
          }
        }
      }
      function lastly() {
        self.enteringPageViews = [pageView];
        promise.success(function() {
          delay(function() {
            self.enteringPageViews = [];
          });
        });
        exitPromise = self.dismissLayersAbove(layer - 1, pageView);
        if (self.layers[layer] !== pageView) {
          enterPromise
            .when(pageView.enter(self.el, self.exitingPageViews), exitPromise)
            .then(promise.resolve);
          self.layers[layer] = pageView;
        } else {
          promise.when(exitPromise);
        }
      }
      if (renderPromise) {
        renderPromise.then(lastly, promise.rejector());
      } else {
        lastly();
      }
      return promise;
    },
    /**
     * Removes all views on a layer
     * @method dismiss
     *
     * @param {Number} index  The index of the layer to remove
     */
    /**
     * Removes all views on a layer
     * @method dismiss
     *
     * @param {jQuery} el  An element on the layer to remove (or the layer itself)
     */
    /**
     * Removes all views on a layer
     * @method dismiss
     *
     * @param {Lavaca.mvc.View} view  The view on the layer to remove
     */
    dismiss: function(layer) {
      if (typeof layer === 'number') {
        this.dismissLayersAbove(layer - 1);
      } else if (layer instanceof PageView) {
        this.dismiss(layer.layer);
      } else {
        layer = $(layer);
        var index = layer.attr('data-layer-index');
        if (index === null) {
          layer = layer.closest('[data-layer-index]');
          index = layer.attr('data-layer-index');
        }
        if (index !== null) {
          this.dismiss(Number(index));
        }
      }
    },
    /**
     * Removes all layers above a given index
     * @method dismissLayersAbove
     *
     * @param {Number}  index The index above which to clear
     * @return {Lavaca.util.Promise}  A promise
     */
    /**
     * Removes all layers above a given index
     * @method dismissLayersAbove
     *
     * @param {Number} index  The index above which to clear
     * @param {Lavaca.mvc.View}  exceptForView A view that should not be dismissed
     * @return {Lavaca.util.Promise}  A promise
     */
    dismissLayersAbove: function(index, exceptForView) {
      var promise = new Promise(this),
          dismissedLayers = false,
          i,
          layer;
      for (i = this.layers.length - 1; i > index; i--) {
        if ((layer = this.layers[i]) && (!exceptForView || exceptForView !== layer)) {
          (function(layer) {
            this.exitingPageViews.push(layer);
            promise
              .when(layer.exit(this.el, this.enteringPageViews))
              .success(function() {
                delay(function() {
                  ArrayUtils.remove(this.exitingPageViews, layer);
                  if (!layer.cacheKey || (exceptForView && exceptForView.cacheKey === layer.cacheKey)) {
                    layer.dispose();
                  }
                }, this);
              });
            this.layers[i] = null;
          }).call(this, layer);
          dismissedLayers = true;
        }
      }
      if (!dismissedLayers) {
        promise.resolve();
      }
      return promise;
    },
    /**
     * Empties the view cache
     * @method flush
     */
    flush: function(cacheKey) {
      // Don't dispose of any views that are currently displayed
      //flush individual cacheKey
      if (cacheKey){
        this.pageViews.remove(cacheKey);
      } else {
        var i = -1,
          layer;
        while (!!(layer = this.layers[++i])) {
          if (layer.cacheKey) {
            this.pageViews.remove(layer.cacheKey);
          }
        }
        this.pageViews.dispose();
        this.pageViews = new Cache();
      }
    },
    /**
     * Readies the view manager for garbage collection
     * @method dispose
     */
    dispose: function() {
      Disposable.prototype.dispose.call(this);
    }
  });

  return new ViewManager(null);

});

define('lavaca/env/ChildBrowser',['require','lavaca/env/Device','lavaca/events/EventDispatcher','lavaca/util/Promise'],function(require) {

  var Device = require('lavaca/env/Device'),
      EventDispatcher = require('lavaca/events/EventDispatcher'),
      Promise = require('lavaca/util/Promise');

  /**
   * A sub-browser management utility (also accessible via window.plugins.childBrowser)
   * @class lavaca.env.ChildBrowser
   * @extends Lavaca.events.EventDispatcher
   *
   * @event open
   * @event close
   * @event change
   *
   * @constructor
   */
  var ChildBrowser = EventDispatcher.extend({
    /**
     * Opens a web page in the child browser (or navigates to it)
     * @method showWebPage
     *
     * @param {String} loc  The URL to open
     * @return {Lavaca.util.Promise}  A promise
     */
    showWebPage: function(loc) {
      if (Device.isCordova()) {
        return Device
          .exec('ChildBrowser', 'showWebPage', [loc])
          .error(function() {
            window.location.href = loc;
          });
      } else {
        window.open(loc);
        return new Promise(window).resolve();
      }
    },
    /**
     * Closes the child browser, if it's open
     * @method close
     *
     * @return {Lavaca.util.Promise}  A promise
     */
    close: function() {
      return Device.exec('ChildBrowser', 'close', []);
    }
  });

  Device.register('childBrowser', ChildBrowser);

  return ChildBrowser;

});

define('lavaca/util/Translation',['require','./Cache','./Map'],function(require) {

  var Cache = require('./Cache'),
      Map = require('./Map');

  var _cache = new Cache();

  function _construct(name, src, code) {
    if (code) {
      code = JSON.parse(code);
    }
    var map = new Translation(name, src, code);
    if (!_cache.get(map.language)) {
      _cache.set(map.language, map);
    }
    return map;
  }

  /**
   * Translation dictionary
   * @class lavaca.util.Translation
   * @extends lavaca.util.Map
   *
   * @constructor
   * @param {String} name  The name of the map
   * @param {String} src  The URL of the map's data (or null if code is supplied)
   * @param {String} code  The raw string data for the map (or null if src is supplied)
   */
  var Translation = Map.extend(function(name) {
    Map.apply(this, arguments);
    var locale = name.toLowerCase().split('_');
    /**
     * The ISO 639-2 code for the translation's language
     * @property {String} language
     * @default null
     */
    this.language = locale[0];
    /**
     * The ISO 3166-1 code for the translation's country
     * @property {String} country
     * @default ''
     */
    this.country = locale[1] || '';
    /**
     * The locale of this translation (either lang or lang_COUNTRY)
     * @property {String} locale
     * @default null
     */
    this.locale = this.country
      ? this.language + '_' + this.country
      : this.language;
  }, {
    /**
     * Determines whether or not this translation works for a locale
     * @method is
     * @param {String} language  The locale's language
     * @return {Boolean}  True if this translation applies
     */
    /**
     * Determines whether or not this translation works for a locale
     * @method is
     * @param {String} language  The locale's language
     * @param {String} country   (Optional) The locale's country
     * @return {Boolean}  True if this translation applies
     */
    is: function(language, country) {
      return language === this.language
        && (!country || !this.country || country === this.country);
    }
  });
  /**
   * Sets the application's default locale
   * @method setDefault
   * @static
   *
   * @param {String} locale  A locale string (ie, "en", "en_US", or "es_MX")
   */
  Translation.setDefault = function(locale) {
    _cache.remove('default');
    Map.setDefault(_cache, Translation.forLocale(locale));
  };
  /**
   * Finds the most appropriate translation for a given locale
   * @method forLocale
   * @static
   *
   * @param {String} locale  The locale
   * @return {Lavaca.util.Translation}  The translation
   */
  Translation.forLocale = function(locale) {
    locale = (locale || 'default').toLowerCase();
    return _cache.get(locale)
      || _cache.get(locale.split('_')[0])
      || _cache.get('default');
  };
  /**
   * Finds the most appropriate translation of a message for the default locale
   * @method get
   * @static
   * @param {String} code  The code under which the message is stored
   * @return {Lavaca.util.Translation}  The translation
   */
  /**
   * Finds the most appropriate translation of a message for the default locale
   * @method get
   * @static
   * @param {String} locale  The locale
   * @param {String} code  The code under which the message is stored
   * @return {Lavaca.util.Translation}  The translation
   */
  Translation.get = function(locale, code) {
    if (!code) {
      code = locale;
      locale = 'default';
    }
    var translation = Translation.forLocale(locale),
        result = null;
    if (translation) {
      result = translation.get(code);
    }
    if (result === null) {
      translation = Translation.forLocale(locale.split('_')[0]);
      if (translation) {
        result = translation.get(code);
      }
    }
    if (result === null) {
      translation = Translation.forLocale('default');
      if (translation) {
        result = translation.get(code);
      }
    }
    return result;
  };
  /**
   * Scans the document for all translations and prepares them
   * @method init
   * @static
   * @param {String} locale  The default locale
   */
  /**
   * Scans the document for all translations and prepares them
   * @method init
   * @static
   * @param {String} locale  The default locale
   * @param {jQuery} scope  The element to which to limit the scan
   */
  Translation.init = function(locale, scope) {
    Map.init(_cache, 'text/x-translation', _construct, scope);
    Translation.setDefault(locale);
  };
  /**
   * Disposes of all translations
   * @method dispose
   * @static
   */
  Translation.dispose = function() {
    Map.dispose(_cache);
  };

  return Translation;

});

// This plugin is an experiment for abstracting away the touch and mouse
// events so that developers don't have to worry about which method of input
// the device their document is loaded on supports.
//
// The idea here is to allow the developer to register listeners for the
// basic mouse events, such as mousedown, mousemove, mouseup, and click,
// and the plugin will take care of registering the correct listeners
// behind the scenes to invoke the listener at the fastest possible time
// for that device, while still retaining the order of event firing in
// the traditional mouse environment, should multiple handlers be registered
// on the same element for different events.
//
// The current version exposes the following virtual events to jQuery bind methods:
// "vmouseover vmousedown vmousemove vmouseup vclick vmouseout vmousecancel"

//>>description: Normalizes touch/mouse events.
//>>label: Virtual Mouse (vmouse) Bindings
//>>group: Core

define('jquery-mobile/jquery.mobile.vmouse', [ "jquery" ], function( jQuery ) {
(function( $, window, document, undefined ) {

var dataPropertyName = "virtualMouseBindings",
	touchTargetPropertyName = "virtualTouchID",
	virtualEventNames = "vmouseover vmousedown vmousemove vmouseup vclick vmouseout vmousecancel".split( " " ),
	touchEventProps = "clientX clientY pageX pageY screenX screenY".split( " " ),
	mouseHookProps = $.event.mouseHooks ? $.event.mouseHooks.props : [],
	mouseEventProps = $.event.props.concat( mouseHookProps ),
	activeDocHandlers = {},
	resetTimerID = 0,
	startX = 0,
	startY = 0,
	didScroll = false,
	clickBlockList = [],
	blockMouseTriggers = false,
	blockTouchTriggers = false,
	eventCaptureSupported = "addEventListener" in document,
	$document = $( document ),
	nextTouchID = 1,
	lastTouchID = 0, threshold;

$.vmouse = {
	moveDistanceThreshold: 10,
	clickDistanceThreshold: 10,
	resetTimerDuration: 1500
};

function getNativeEvent( event ) {

	while ( event && typeof event.originalEvent !== "undefined" ) {
		event = event.originalEvent;
	}
	return event;
}

function createVirtualEvent( event, eventType ) {

	var t = event.type,
		oe, props, ne, prop, ct, touch, i, j, len;

	event = $.Event( event );
	event.type = eventType;

	oe = event.originalEvent;
	props = $.event.props;

	// addresses separation of $.event.props in to $.event.mouseHook.props and Issue 3280
	// https://github.com/jquery/jquery-mobile/issues/3280
	if ( t.search( /^(mouse|click)/ ) > -1 ) {
		props = mouseEventProps;
	}

	// copy original event properties over to the new event
	// this would happen if we could call $.event.fix instead of $.Event
	// but we don't have a way to force an event to be fixed multiple times
	if ( oe ) {
		for ( i = props.length, prop; i; ) {
			prop = props[ --i ];
			event[ prop ] = oe[ prop ];
		}
	}

	// make sure that if the mouse and click virtual events are generated
	// without a .which one is defined
	if ( t.search(/mouse(down|up)|click/) > -1 && !event.which ) {
		event.which = 1;
	}

	if ( t.search(/^touch/) !== -1 ) {
		ne = getNativeEvent( oe );
		t = ne.touches;
		ct = ne.changedTouches;
		touch = ( t && t.length ) ? t[0] : ( ( ct && ct.length ) ? ct[ 0 ] : undefined );

		if ( touch ) {
			for ( j = 0, len = touchEventProps.length; j < len; j++) {
				prop = touchEventProps[ j ];
				event[ prop ] = touch[ prop ];
			}
		}
	}

	return event;
}

function getVirtualBindingFlags( element ) {

	var flags = {},
		b, k;

	while ( element ) {

		b = $.data( element, dataPropertyName );

		for (  k in b ) {
			if ( b[ k ] ) {
				flags[ k ] = flags.hasVirtualBinding = true;
			}
		}
		element = element.parentNode;
	}
	return flags;
}

function getClosestElementWithVirtualBinding( element, eventType ) {
	var b;
	while ( element ) {

		b = $.data( element, dataPropertyName );

		if ( b && ( !eventType || b[ eventType ] ) ) {
			return element;
		}
		element = element.parentNode;
	}
	return null;
}

function enableTouchBindings() {
	blockTouchTriggers = false;
}

function disableTouchBindings() {
	blockTouchTriggers = true;
}

function enableMouseBindings() {
	lastTouchID = 0;
	clickBlockList.length = 0;
	blockMouseTriggers = false;

	// When mouse bindings are enabled, our
	// touch bindings are disabled.
	disableTouchBindings();
}

function disableMouseBindings() {
	// When mouse bindings are disabled, our
	// touch bindings are enabled.
	enableTouchBindings();
}

function startResetTimer() {
	clearResetTimer();
	resetTimerID = setTimeout( function() {
		resetTimerID = 0;
		enableMouseBindings();
	}, $.vmouse.resetTimerDuration );
}

function clearResetTimer() {
	if ( resetTimerID ) {
		clearTimeout( resetTimerID );
		resetTimerID = 0;
	}
}

function triggerVirtualEvent( eventType, event, flags ) {
	var ve;

	if ( ( flags && flags[ eventType ] ) ||
				( !flags && getClosestElementWithVirtualBinding( event.target, eventType ) ) ) {

		ve = createVirtualEvent( event, eventType );

		$( event.target).trigger( ve );
	}

	return ve;
}

function mouseEventCallback( event ) {
	var touchID = $.data( event.target, touchTargetPropertyName );

	if ( !blockMouseTriggers && ( !lastTouchID || lastTouchID !== touchID ) ) {
		var ve = triggerVirtualEvent( "v" + event.type, event );
		if ( ve ) {
			if ( ve.isDefaultPrevented() ) {
				event.preventDefault();
			}
			if ( ve.isPropagationStopped() ) {
				event.stopPropagation();
			}
			if ( ve.isImmediatePropagationStopped() ) {
				event.stopImmediatePropagation();
			}
		}
	}
}

function handleTouchStart( event ) {

	var touches = getNativeEvent( event ).touches,
		target, flags;

	if ( touches && touches.length === 1 ) {

		target = event.target;
		flags = getVirtualBindingFlags( target );

		if ( flags.hasVirtualBinding ) {

			lastTouchID = nextTouchID++;
			$.data( target, touchTargetPropertyName, lastTouchID );

			clearResetTimer();

			disableMouseBindings();
			didScroll = false;

			var t = getNativeEvent( event ).touches[ 0 ];
			startX = t.pageX;
			startY = t.pageY;

			triggerVirtualEvent( "vmouseover", event, flags );
			triggerVirtualEvent( "vmousedown", event, flags );
		}
	}
}

function handleScroll( event ) {
	if ( blockTouchTriggers ) {
		return;
	}

	if ( !didScroll ) {
		triggerVirtualEvent( "vmousecancel", event, getVirtualBindingFlags( event.target ) );
	}

	didScroll = true;
	startResetTimer();
}

function handleTouchMove( event ) {
	if ( blockTouchTriggers ) {
		return;
	}

	var t = getNativeEvent( event ).touches[ 0 ],
		didCancel = didScroll,
		moveThreshold = $.vmouse.moveDistanceThreshold,
		flags = getVirtualBindingFlags( event.target );

		didScroll = didScroll ||
			( Math.abs( t.pageX - startX ) > moveThreshold ||
				Math.abs( t.pageY - startY ) > moveThreshold );


	if ( didScroll && !didCancel ) {
		triggerVirtualEvent( "vmousecancel", event, flags );
	}

	triggerVirtualEvent( "vmousemove", event, flags );
	startResetTimer();
}

function handleTouchEnd( event ) {
	if ( blockTouchTriggers ) {
		return;
	}

	disableTouchBindings();

	var flags = getVirtualBindingFlags( event.target ),
		t;
	triggerVirtualEvent( "vmouseup", event, flags );

	if ( !didScroll ) {
		var ve = triggerVirtualEvent( "vclick", event, flags );
		if ( ve && ve.isDefaultPrevented() ) {
			// The target of the mouse events that follow the touchend
			// event don't necessarily match the target used during the
			// touch. This means we need to rely on coordinates for blocking
			// any click that is generated.
			t = getNativeEvent( event ).changedTouches[ 0 ];
			clickBlockList.push({
				touchID: lastTouchID,
				x: t.clientX,
				y: t.clientY
			});

			// Prevent any mouse events that follow from triggering
			// virtual event notifications.
			blockMouseTriggers = true;
		}
	}
	triggerVirtualEvent( "vmouseout", event, flags);
	didScroll = false;

	startResetTimer();
}

function hasVirtualBindings( ele ) {
	var bindings = $.data( ele, dataPropertyName ),
		k;

	if ( bindings ) {
		for ( k in bindings ) {
			if ( bindings[ k ] ) {
				return true;
			}
		}
	}
	return false;
}

function dummyMouseHandler() {}

function getSpecialEventObject( eventType ) {
	var realType = eventType.substr( 1 );

	return {
		setup: function( data, namespace ) {
			// If this is the first virtual mouse binding for this element,
			// add a bindings object to its data.

			if ( !hasVirtualBindings( this ) ) {
				$.data( this, dataPropertyName, {} );
			}

			// If setup is called, we know it is the first binding for this
			// eventType, so initialize the count for the eventType to zero.
			var bindings = $.data( this, dataPropertyName );
			bindings[ eventType ] = true;

			// If this is the first virtual mouse event for this type,
			// register a global handler on the document.

			activeDocHandlers[ eventType ] = ( activeDocHandlers[ eventType ] || 0 ) + 1;

			if ( activeDocHandlers[ eventType ] === 1 ) {
				$document.bind( realType, mouseEventCallback );
			}

			// Some browsers, like Opera Mini, won't dispatch mouse/click events
			// for elements unless they actually have handlers registered on them.
			// To get around this, we register dummy handlers on the elements.

			$( this ).bind( realType, dummyMouseHandler );

			// For now, if event capture is not supported, we rely on mouse handlers.
			if ( eventCaptureSupported ) {
				// If this is the first virtual mouse binding for the document,
				// register our touchstart handler on the document.

				activeDocHandlers[ "touchstart" ] = ( activeDocHandlers[ "touchstart" ] || 0) + 1;

				if ( activeDocHandlers[ "touchstart" ] === 1 ) {
					$document.bind( "touchstart", handleTouchStart )
						.bind( "touchend", handleTouchEnd )

						// On touch platforms, touching the screen and then dragging your finger
						// causes the window content to scroll after some distance threshold is
						// exceeded. On these platforms, a scroll prevents a click event from being
						// dispatched, and on some platforms, even the touchend is suppressed. To
						// mimic the suppression of the click event, we need to watch for a scroll
						// event. Unfortunately, some platforms like iOS don't dispatch scroll
						// events until *AFTER* the user lifts their finger (touchend). This means
						// we need to watch both scroll and touchmove events to figure out whether
						// or not a scroll happenens before the touchend event is fired.

						.bind( "touchmove", handleTouchMove )
						.bind( "scroll", handleScroll );
				}
			}
		},

		teardown: function( data, namespace ) {
			// If this is the last virtual binding for this eventType,
			// remove its global handler from the document.

			--activeDocHandlers[ eventType ];

			if ( !activeDocHandlers[ eventType ] ) {
				$document.unbind( realType, mouseEventCallback );
			}

			if ( eventCaptureSupported ) {
				// If this is the last virtual mouse binding in existence,
				// remove our document touchstart listener.

				--activeDocHandlers[ "touchstart" ];

				if ( !activeDocHandlers[ "touchstart" ] ) {
					$document.unbind( "touchstart", handleTouchStart )
						.unbind( "touchmove", handleTouchMove )
						.unbind( "touchend", handleTouchEnd )
						.unbind( "scroll", handleScroll );
				}
			}

			var $this = $( this ),
				bindings = $.data( this, dataPropertyName );

			// teardown may be called when an element was
			// removed from the DOM. If this is the case,
			// jQuery core may have already stripped the element
			// of any data bindings so we need to check it before
			// using it.
			if ( bindings ) {
				bindings[ eventType ] = false;
			}

			// Unregister the dummy event handler.

			$this.unbind( realType, dummyMouseHandler );

			// If this is the last virtual mouse binding on the
			// element, remove the binding data from the element.

			if ( !hasVirtualBindings( this ) ) {
				$this.removeData( dataPropertyName );
			}
		}
	};
}

// Expose our custom events to the jQuery bind/unbind mechanism.

for ( var i = 0; i < virtualEventNames.length; i++ ) {
	$.event.special[ virtualEventNames[ i ] ] = getSpecialEventObject( virtualEventNames[ i ] );
}

// Add a capture click handler to block clicks.
// Note that we require event capture support for this so if the device
// doesn't support it, we punt for now and rely solely on mouse events.
if ( eventCaptureSupported ) {
	document.addEventListener( "click", function( e ) {
		var cnt = clickBlockList.length,
			target = e.target,
			x, y, ele, i, o, touchID;

		if ( cnt ) {
			x = e.clientX;
			y = e.clientY;
			threshold = $.vmouse.clickDistanceThreshold;

			// The idea here is to run through the clickBlockList to see if
			// the current click event is in the proximity of one of our
			// vclick events that had preventDefault() called on it. If we find
			// one, then we block the click.
			//
			// Why do we have to rely on proximity?
			//
			// Because the target of the touch event that triggered the vclick
			// can be different from the target of the click event synthesized
			// by the browser. The target of a mouse/click event that is syntehsized
			// from a touch event seems to be implementation specific. For example,
			// some browsers will fire mouse/click events for a link that is near
			// a touch event, even though the target of the touchstart/touchend event
			// says the user touched outside the link. Also, it seems that with most
			// browsers, the target of the mouse/click event is not calculated until the
			// time it is dispatched, so if you replace an element that you touched
			// with another element, the target of the mouse/click will be the new
			// element underneath that point.
			//
			// Aside from proximity, we also check to see if the target and any
			// of its ancestors were the ones that blocked a click. This is necessary
			// because of the strange mouse/click target calculation done in the
			// Android 2.1 browser, where if you click on an element, and there is a
			// mouse/click handler on one of its ancestors, the target will be the
			// innermost child of the touched element, even if that child is no where
			// near the point of touch.

			ele = target;

			while ( ele ) {
				for ( i = 0; i < cnt; i++ ) {
					o = clickBlockList[ i ];
					touchID = 0;

					if ( ( ele === target && Math.abs( o.x - x ) < threshold && Math.abs( o.y - y ) < threshold ) ||
								$.data( ele, touchTargetPropertyName ) === o.touchID ) {
						// XXX: We may want to consider removing matches from the block list
						//      instead of waiting for the reset timer to fire.
						e.preventDefault();
						e.stopPropagation();
						return;
					}
				}
				ele = ele.parentNode;
			}
		}
	}, true);
}
})( jQuery, window, document );
});

//>>description: The mobile namespace on the jQuery object
//>>label: Namespace
//>>group: Core
define('jquery-mobile/jquery.mobile.ns',[ "jquery" ], function( jQuery ) {
(function( $ ) {
	$.mobile = {};
}( jQuery ));
});
//>>description: Touch feature test
//>>label: Touch support test
//>>group: Core

define('jquery-mobile/jquery.mobile.support.touch', [ "jquery", "./jquery.mobile.ns" ], function( jQuery ) {
	(function( $, undefined ) {
		var support = {
			touch: "ontouchend" in document
		};

		$.mobile.support = $.mobile.support || {};
		$.extend( $.support, support );
		$.extend( $.mobile.support, support );
	}( jQuery ));
});

//>>description: Touch events including: touchstart, touchmove, touchend, tap, taphold, swipe, swipeleft, swiperight, scrollstart, scrollstop
//>>label: Touch
//>>group: Events

define('jquery-mobile/events/touch', [ "jquery", "../jquery.mobile.vmouse", "../jquery.mobile.support.touch" ], function( jQuery ) {

(function( $, window, undefined ) {
	var $document = $( document );

	// add new event shortcuts
	$.each( ( "touchstart touchmove touchend " +
		"tap taphold " +
		"swipe swipeleft swiperight " +
		"scrollstart scrollstop" ).split( " " ), function( i, name ) {

		$.fn[ name ] = function( fn ) {
			return fn ? this.bind( name, fn ) : this.trigger( name );
		};

		// jQuery < 1.8
		if ( $.attrFn ) {
			$.attrFn[ name ] = true;
		}
	});

	var supportTouch = $.mobile.support.touch,
		scrollEvent = "touchmove scroll",
		touchStartEvent = supportTouch ? "touchstart" : "mousedown",
		touchStopEvent = supportTouch ? "touchend" : "mouseup",
		touchMoveEvent = supportTouch ? "touchmove" : "mousemove";

	function triggerCustomEvent( obj, eventType, event ) {
		var originalType = event.type;
		event.type = eventType;
		$.event.dispatch.call( obj, event );
		event.type = originalType;
	}

	// also handles scrollstop
	$.event.special.scrollstart = {

		enabled: true,

		setup: function() {

			var thisObject = this,
				$this = $( thisObject ),
				scrolling,
				timer;

			function trigger( event, state ) {
				scrolling = state;
				triggerCustomEvent( thisObject, scrolling ? "scrollstart" : "scrollstop", event );
			}

			// iPhone triggers scroll after a small delay; use touchmove instead
			$this.bind( scrollEvent, function( event ) {

				if ( !$.event.special.scrollstart.enabled ) {
					return;
				}

				if ( !scrolling ) {
					trigger( event, true );
				}

				clearTimeout( timer );
				timer = setTimeout( function() {
					trigger( event, false );
				}, 50 );
			});
		}
	};

	// also handles taphold
	$.event.special.tap = {
		tapholdThreshold: 750,

		setup: function() {
			var thisObject = this,
				$this = $( thisObject );

			$this.bind( "vmousedown", function( event ) {

				if ( event.which && event.which !== 1 ) {
					return false;
				}

				var origTarget = event.target,
					origEvent = event.originalEvent,
					timer;

				function clearTapTimer() {
					clearTimeout( timer );
				}

				function clearTapHandlers() {
					clearTapTimer();

					$this.unbind( "vclick", clickHandler )
						.unbind( "vmouseup", clearTapTimer );
					$document.unbind( "vmousecancel", clearTapHandlers );
				}

				function clickHandler( event ) {
					clearTapHandlers();

					// ONLY trigger a 'tap' event if the start target is
					// the same as the stop target.
					if ( origTarget === event.target ) {
						triggerCustomEvent( thisObject, "tap", event );
					}
				}

				$this.bind( "vmouseup", clearTapTimer )
					.bind( "vclick", clickHandler );
				$document.bind( "vmousecancel", clearTapHandlers );

				timer = setTimeout( function() {
					triggerCustomEvent( thisObject, "taphold", $.Event( "taphold", { target: origTarget } ) );
				}, $.event.special.tap.tapholdThreshold );
			});
		}
	};

	// also handles swipeleft, swiperight
	$.event.special.swipe = {
		scrollSupressionThreshold: 30, // More than this horizontal displacement, and we will suppress scrolling.

		durationThreshold: 1000, // More time than this, and it isn't a swipe.

		horizontalDistanceThreshold: 30,  // Swipe horizontal displacement must be more than this.

		verticalDistanceThreshold: 75,  // Swipe vertical displacement must be less than this.

		start: function( event ) {
			var data = event.originalEvent.touches ?
					event.originalEvent.touches[ 0 ] : event;
			return {
						time: ( new Date() ).getTime(),
						coords: [ data.pageX, data.pageY ],
						origin: $( event.target )
					};
		},

		stop: function( event ) {
			var data = event.originalEvent.touches ?
					event.originalEvent.touches[ 0 ] : event;
			return {
						time: ( new Date() ).getTime(),
						coords: [ data.pageX, data.pageY ]
					};
		},

		handleSwipe: function( start, stop ) {
			if ( stop.time - start.time < $.event.special.swipe.durationThreshold &&
				Math.abs( start.coords[ 0 ] - stop.coords[ 0 ] ) > $.event.special.swipe.horizontalDistanceThreshold &&
				Math.abs( start.coords[ 1 ] - stop.coords[ 1 ] ) < $.event.special.swipe.verticalDistanceThreshold ) {

				start.origin.trigger( "swipe" )
					.trigger( start.coords[0] > stop.coords[ 0 ] ? "swipeleft" : "swiperight" );
			}
		},

		setup: function() {
			var thisObject = this,
				$this = $( thisObject );

			$this.bind( touchStartEvent, function( event ) {
				var start = $.event.special.swipe.start( event ),
					stop;

				function moveHandler( event ) {
					if ( !start ) {
						return;
					}

					stop = $.event.special.swipe.stop( event );

					// prevent scrolling
					if ( Math.abs( start.coords[ 0 ] - stop.coords[ 0 ] ) > $.event.special.swipe.scrollSupressionThreshold ) {
						event.preventDefault();
					}
				}

				$this.bind( touchMoveEvent, moveHandler )
					.one( touchStopEvent, function() {
						$this.unbind( touchMoveEvent, moveHandler );

						if ( start && stop ) {
							$.event.special.swipe.handleSwipe( start, stop );
						}
						start = stop = undefined;
					});
			});
		}
	};
	$.each({
		scrollstop: "scrollstart",
		taphold: "tap",
		swipeleft: "swipe",
		swiperight: "swipe"
	}, function( event, sourceEvent ) {

		$.event.special[ event ] = {
			setup: function() {
				$( this ).bind( sourceEvent, $.noop );
			}
		};
	});

})( jQuery, this );
});

//>>description: Feature test for orientation
//>>label: Orientation support test
//>>group: Core

define('jquery-mobile/jquery.mobile.support.orientation', [ "jquery" ], function( jQuery ) {
	(function( $, undefined ) {
		$.extend( $.support, {
			orientation: "orientation" in window && "onorientationchange" in window
		});
	}( jQuery ));
});

//>>description: Fires a resize event with a slight delay to prevent excessive callback invocation
//>>label: Throttled Resize
//>>group: Events

define('jquery-mobile/events/throttledresize', [ "jquery" ], function( jQuery ) {

	// throttled resize event
	(function( $ ) {
		$.event.special.throttledresize = {
			setup: function() {
				$( this ).bind( "resize", handler );
			},
			teardown: function() {
				$( this ).unbind( "resize", handler );
			}
		};

		var throttle = 250,
			handler = function() {
				curr = ( new Date() ).getTime();
				diff = curr - lastCall;

				if ( diff >= throttle ) {

					lastCall = curr;
					$( this ).trigger( "throttledresize" );

				} else {

					if ( heldCall ) {
						clearTimeout( heldCall );
					}

					// Promise a held call will still execute
					heldCall = setTimeout( handler, throttle - diff );
				}
			},
			lastCall = 0,
			heldCall,
			curr,
			diff;
	})( jQuery );
});
//>>description: Provides a wrapper around the inconsistent browser implementations of orientationchange
//>>label: Orientation Change
//>>group: Events

define('jquery-mobile/events/orientationchange', [ "jquery", "../jquery.mobile.support.orientation", "./throttledresize" ], function( jQuery ) {

(function( $, window ) {
	var win = $( window ),
		event_name = "orientationchange",
		special_event,
		get_orientation,
		last_orientation,
		initial_orientation_is_landscape,
		initial_orientation_is_default,
		portrait_map = { "0": true, "180": true };

	// It seems that some device/browser vendors use window.orientation values 0 and 180 to
	// denote the "default" orientation. For iOS devices, and most other smart-phones tested,
	// the default orientation is always "portrait", but in some Android and RIM based tablets,
	// the default orientation is "landscape". The following code attempts to use the window
	// dimensions to figure out what the current orientation is, and then makes adjustments
	// to the to the portrait_map if necessary, so that we can properly decode the
	// window.orientation value whenever get_orientation() is called.
	//
	// Note that we used to use a media query to figure out what the orientation the browser
	// thinks it is in:
	//
	//     initial_orientation_is_landscape = $.mobile.media("all and (orientation: landscape)");
	//
	// but there was an iPhone/iPod Touch bug beginning with iOS 4.2, up through iOS 5.1,
	// where the browser *ALWAYS* applied the landscape media query. This bug does not
	// happen on iPad.

	if ( $.support.orientation ) {

		// Check the window width and height to figure out what the current orientation
		// of the device is at this moment. Note that we've initialized the portrait map
		// values to 0 and 180, *AND* we purposely check for landscape so that if we guess
		// wrong, , we default to the assumption that portrait is the default orientation.
		// We use a threshold check below because on some platforms like iOS, the iPhone
		// form-factor can report a larger width than height if the user turns on the
		// developer console. The actual threshold value is somewhat arbitrary, we just
		// need to make sure it is large enough to exclude the developer console case.

		var ww = window.innerWidth || win.width(),
			wh = window.innerHeight || win.height(),
			landscape_threshold = 50;

		initial_orientation_is_landscape = ww > wh && ( ww - wh ) > landscape_threshold;


		// Now check to see if the current window.orientation is 0 or 180.
		initial_orientation_is_default = portrait_map[ window.orientation ];

		// If the initial orientation is landscape, but window.orientation reports 0 or 180, *OR*
		// if the initial orientation is portrait, but window.orientation reports 90 or -90, we
		// need to flip our portrait_map values because landscape is the default orientation for
		// this device/browser.
		if ( ( initial_orientation_is_landscape && initial_orientation_is_default ) || ( !initial_orientation_is_landscape && !initial_orientation_is_default ) ) {
			portrait_map = { "-90": true, "90": true };
		}
	}

	$.event.special.orientationchange = $.extend( {}, $.event.special.orientationchange, {
		setup: function() {
			// If the event is supported natively, return false so that jQuery
			// will bind to the event using DOM methods.
			if ( $.support.orientation && !$.event.special.orientationchange.disabled ) {
				return false;
			}

			// Get the current orientation to avoid initial double-triggering.
			last_orientation = get_orientation();

			// Because the orientationchange event doesn't exist, simulate the
			// event by testing window dimensions on resize.
			win.bind( "throttledresize", handler );
		},
		teardown: function() {
			// If the event is not supported natively, return false so that
			// jQuery will unbind the event using DOM methods.
			if ( $.support.orientation && !$.event.special.orientationchange.disabled ) {
				return false;
			}

			// Because the orientationchange event doesn't exist, unbind the
			// resize event handler.
			win.unbind( "throttledresize", handler );
		},
		add: function( handleObj ) {
			// Save a reference to the bound event handler.
			var old_handler = handleObj.handler;


			handleObj.handler = function( event ) {
				// Modify event object, adding the .orientation property.
				event.orientation = get_orientation();

				// Call the originally-bound event handler and return its result.
				return old_handler.apply( this, arguments );
			};
		}
	});

	// If the event is not supported natively, this handler will be bound to
	// the window resize event to simulate the orientationchange event.
	function handler() {
		// Get the current orientation.
		var orientation = get_orientation();

		if ( orientation !== last_orientation ) {
			// The orientation has changed, so trigger the orientationchange event.
			last_orientation = orientation;
			win.trigger( event_name );
		}
	}

	// Get the current page orientation. This method is exposed publicly, should it
	// be needed, as jQuery.event.special.orientationchange.orientation()
	$.event.special.orientationchange.orientation = get_orientation = function() {
		var isPortrait = true, elem = document.documentElement;

		// prefer window orientation to the calculation based on screensize as
		// the actual screen resize takes place before or after the orientation change event
		// has been fired depending on implementation (eg android 2.3 is before, iphone after).
		// More testing is required to determine if a more reliable method of determining the new screensize
		// is possible when orientationchange is fired. (eg, use media queries + element + opacity)
		if ( $.support.orientation ) {
			// if the window orientation registers as 0 or 180 degrees report
			// portrait, otherwise landscape
			isPortrait = portrait_map[ window.orientation ];
		} else {
			isPortrait = elem && elem.clientWidth / elem.clientHeight < 1.1;
		}

		return isPortrait ? "portrait" : "landscape";
	};

	$.fn[ event_name ] = function( fn ) {
		return fn ? this.bind( event_name, fn ) : this.trigger( event_name );
	};

	// jQuery < 1.8
	if ( $.attrFn ) {
		$.attrFn[ event_name ] = true;
	}

}( jQuery, this ));

});

define('lavaca/mvc/Application',['require','$','lavaca/net/History','lavaca/env/Device','lavaca/events/EventDispatcher','lavaca/mvc/Router','lavaca/mvc/ViewManager','lavaca/net/Connectivity','lavaca/ui/Template','lavaca/util/Config','lavaca/util/Promise','lavaca/env/ChildBrowser','lavaca/util/Translation','jquery-mobile/events/touch','jquery-mobile/events/orientationchange'],function(require) {

  var $ = require('$'),
    History = require('lavaca/net/History'),
    Device = require('lavaca/env/Device'),
    EventDispatcher = require('lavaca/events/EventDispatcher'),
    router = require('lavaca/mvc/Router'),
    viewManager = require('lavaca/mvc/ViewManager'),
    Connectivity = require('lavaca/net/Connectivity'),
    Template = require('lavaca/ui/Template'),
    Config = require('lavaca/util/Config'),
    Promise = require('lavaca/util/Promise'),
    ChildBrowser = require('lavaca/env/ChildBrowser'),
    Translation = require('lavaca/util/Translation');
    require('jquery-mobile/events/touch');
    require('jquery-mobile/events/orientationchange');

  function _stopEvent(e) {
    e.preventDefault();
    e.stopPropagation();
  }

  function _matchHashRoute(hash) {
    var matches = hash.match(/^(?:#)(\/.*)#?@?/);
    if (matches instanceof Array && matches[1]) {
      return matches[1].replace(/#.*/, '');
    }
    return null;
  }

  /**
   * Base application type
   * @class lavaca.mvc.Application
   * @extends lavaca.events.EventDispatcher
   *
   */
   /**
   * Creates an application
   * @constructor
   * @param {Function} [callback]  A callback to execute when the application is initialized but not yet ready
   */
  var Application = EventDispatcher.extend(function(callback) {
    if (callback) {
      this._callback = callback.bind(this);
    }
    Device.init(function() {
      this.beforeInit(Config)
        .then(this.init.bind(this));
    }.bind(this));
  }, {
    /**
     * The default URL that the app will navigate to
     * @property initRoute
     * @default '/'
     *
     * @type String
     */

    initRoute: '/',
    /**
     * The default state object to supply the initial route
     * @property initState
     * @default null
     *
     * @type {Object}
     */
    initState: null,
    /**
     * The default params object to supply the initial route
     * @property initParams
     * @default null
     *
     * @type {Object}
     */

    initParams: null,
    /**
     * The selector used to identify the DOM element that will contain views
     * @property viewRootSelector
     * @default #view-root
     *
     * @type {String}
     */

    viewRootSelector: '#view-root',
    /**
     * Handler for when the user attempts to navigate to an invalid route
     * @method onInvalidRoute
     *
     * @param {Object} err  The routing error
     */
    onInvalidRoute: function(err) {
      // If the error is equal to "locked", it means that the router or view manager was
      // busy while while the user was attempting to navigate
      if (err !== 'locked') {
        alert('An error occurred while trying to display this URL.');
      }
    },
    /**
     * Handler for when the user taps on a <A> element
     * @method onTapLink
     *
     * @param {Event} e  The event object
     */
    onTapLink: function(e) {
      var link = $(e.currentTarget),
          url = link.attr('href'),
          rel = link.attr('rel'),
          target = link.attr('target'),
          isExternal = link.is('[data-external]');
      if (/^((mailto)|(tel)|(sms))\:/.test(url) || link.is('.ignore')) {
        location.href = url;
        return true;
      } else {
        e.preventDefault();
      }
      if (rel === 'back') {
        History.back();
      } else if (isExternal || rel === 'nofollow' || target === '_blank') {
        e.stopPropagation();
        new ChildBrowser().showWebPage(url);
      } else if (rel === 'cancel') {
        this.viewManager.dismiss(e.currentTarget);
      } else if (url) {
        this.router.exec(url, null, null).error(this.onInvalidRoute);
      }
    },
    /**
     * Makes an AJAX request if the user is online. If the user is offline, the returned
     * promise will be rejected with the string argument "offline". (Alias for [[Lavaca.net.Connectivity]].ajax)
     * @method ajax
     *
     * @param {Object} opts  jQuery-style AJAX options
     * @return {Lavaca.util.Promise}  A promise
     */
    ajax: function() {
      return Connectivity.ajax.apply(Connectivity, arguments);
    },
    /**
     * Initializes the application
     * @method init
     *
     * @param {Object} args  Data of any type from a resolved promise returned by Application.beforeInit(). Defaults to null.
     *
     * @return {Lavaca.util.Promise}  A promise that resolves when the application is ready for use
     */
    init: function(args) {
      var promise = new Promise(this),
          _cbPromise,
          lastly;
      Template.init();
      /**
       * View manager used to transition between UI states
       * @property viewManager
       * @default null
       *
       * @type {Lavaca.mvc.ViewManager}
       */
      this.viewManager = viewManager.setEl(this.viewRootSelector);
      /**
       * Router used to manage application traffic and URLs
       * @property router
       * @default null
       *
       * @type {Lavaca.mvc.Router}
       */
      this.router = router.setViewManager(this.viewManager);


      lastly = function() {
        this.router.startHistory();
        if (!this.router.hasNavigated) {
          promise.when(
            this.router.exec(this.initialHashRoute || this.initRoute, this.initState, this.initParams)
          );
          if (this.initState) {
            History.replace(this.initState.state, this.initState.title, this.initState.url);
          }
        } else {
          promise.resolve();
        }
      }.bind(this);

      $(document.body)
        .on('tap', 'a', this.onTapLink.bind(this))
        .on('tap', '.ui-blocker', _stopEvent);

      if (this._callback) {
        _cbPromise = this._callback(args);
        _cbPromise instanceof Promise ? _cbPromise.then(lastly, promise.rejector()) : lastly();
      } else {
        lastly();
      }
      return promise.then(function() {
        this.trigger('ready');
      });
    },

    /**
     * Gets initial route based on query string returned by server 302 redirect
     * @property initialStandardRoute
     * @default null
     *
     * @type {String}
     */

    initialHashRoute: (function(hash) {
      return _matchHashRoute(hash);
    })(window.location.hash),
    /**
     * Handles asynchronous requests that need to happen before Application.init() is called in the constructor
     * @method {String} beforeInit
     *
     * @param {Lavaca.util.Config} Config cache that's been initialized
     *
     * @return {Lavaca.util.Promise}  A promise
     */
    beforeInit: function(Config) {
      var promise = new Promise();
      return promise.resolve(null);
    }
  });

  return Application;

});

define('lavaca/mvc/Collection',['require','lavaca/mvc/Model','lavaca/net/Connectivity','lavaca/util/ArrayUtils','lavaca/util/Promise','mout/lang/deepClone','mout/object/merge'],function(require) {

  var Model = require('lavaca/mvc/Model'),
      Connectivity = require('lavaca/net/Connectivity'),
      ArrayUtils = require('lavaca/util/ArrayUtils'),
      Promise = require('lavaca/util/Promise'),
      clone = require('mout/lang/deepClone'),
      merge = require('mout/object/merge');

  var UNDEFINED;

  function _triggerItemEvent(collection, event, previousIndex, index, model) {
    collection.trigger(event, {
      previousIndex: previousIndex,
      index: index,
      model: model
    });
  }

  function _getComparator(attr, descending) {
    var compareVal = descending ? 1 : -1;
    return function(modelA, modelB) {
      var attrA = modelA.get(attr),
          attrB = modelB.get(attr);
      return (attrA === attrB)
              ? 0
              : attrA < attrB
                ? compareVal
                : -compareVal;
    };
  }

  // Virtual type
  /**
   * Event type used when a model in a collection has an event
   * @class lavaca.mvc.ItemEvent
   * @extends lavaca.events.EventDispatcher

   *
   * @property {Lavaca.mvc.Collection} target
   * @default null
   * The collection that contains (or contained) the model that caused the event
   *
   * @property {Lavaca.mvc.Model} model
   * @default null
   * The model that caused the event
   *
   * @property {Number} index
   * @default null
   * The index of the event-causing model in the collection
   *
   * @property {Number} previousIndex
   * @default null
   * The index of the event-causing model before the event
   */

  /**
   * @class lavaca.mvc.Collection
   * @super Model
   * Basic model collection type
   *
   * @event change
   * @event invalid
   * @event fetchSuccess
   * @event fetchError
   * @event saveSuccess
   * @event saveError
   * @event changeItem
   * @event invalidItem
   * @event saveSuccessItem
   * @event saveErrorItem
   *
   * @constructor
   * @param {Array} models  A list of models to add to the collection
   * @param {Object} [map]  A parameter hash to apply to the collection
   */
  var Collection = Model.extend(function(models, map) {
    Model.call(this, map);
    this.models = [];
    this.changedOrder = false;
    this.addedItems = [];
    this.removedItems = [];
    this.changedItems = [];
    if (models) {
      this.suppressEvents = true;
      this.add.apply(this, models);
      this.suppressEvents = false;
    }
  }, {
    /**
     * The type of model object to use for items in this collection
     * @property TModel
     * @default [[Lavaca.mvc.Model]]
     *
     * @type Function
     */

    TModel: Model,
    /**
     * The name of the property containing the collection's items when using toObject()
     * @property itemsProperty
     * @default 'items'
     *
     * @type String
     */
   itemsProperty: 'items',
    /**
     * Whether to allow duplicated IDs in collection items. If false, a later added item will overwrite the one with same ID.
     * @property allowDuplicatedIds
     * @default false
     *
     * @type Boolean
     */
    allowDuplicatedIds: false,
    /**
     * Removes and disposes of all models in the collection
     * @method clear
     *
     */
//  @event removeItem
    clear: function() {
      Model.prototype.clear.apply(this, arguments);
      this.clearModels();
    },
    /**
     * clears only the models in the collection
     * @method clearModels
     *
     */
    clearModels: function() {
      var i = -1,
          model;
      while (!!(model = this.models[++i])) {
        this.remove(model);
      }
      this.changedOrder = false;
      this.addedItems.length
        = this.removedItems.length
        = this.changedItems.length
        = this.models.length
        = 0;
    },
    /**
     * Readies data to be an item in the collection
     * @method prepare
     *
     * @param {Object} data  The model or object to be added
     * @return {Lavaca.mvc.Model}  The model derived from the data
     */
    prepare: function(data) {
      var model = data instanceof this.TModel
            ? data
            : this.TModel.prototype instanceof Collection
              ? new this.TModel(data[this.TModel.prototype.itemsProperty], data)
              : new this.TModel(data),
          index = ArrayUtils.indexOf(this.models, model);
      if (index === -1) {
        model
          .on('change', this.onItemEvent, this)
          .on('invalid', this.onItemEvent, this)
          .on('saveSuccess', this.onItemEvent, this)
          .on('saveError', this.onItemEvent, this);
      }
      return model;
    },
    /**
     * Determines whether or not an attribute can be assigned
     * @method canSet
     *
     * @param {String} attribute  The name of the attribute
     * @return {Boolean}  True if you can assign to the attribute
     */
    canSet: function(attribute) {
      return attribute !== this.itemsProperty;
    },
    /**
     * Inserts one or more items into the collection at the specified index
     * @method insert
     *
     * @param {Number} insertIndex  index at which items will be inserted
     * @param {Array} newItems  Array of objects or Models to insert
     * @return {Boolean}  false if no items were able to be added, true otherwise.
     */
    /**
     * Inserts one or more items into the collection at the specified index
     * @method insert
     * @param {Number} insertIndex  index at which items will be inserted
     * @params {Object} items  One or more objects or Models to insert
     * @return {Boolean}  false if no items were able to be added, true otherwise.
     */
//@event addItem

    insert: function(insertIndex, item /*, item1, item2, item3...*/) {
      var result = false,
          idAttribute = this.TModel.prototype.idAttribute,
          compareObj = {},
          id,
          i,
          j,
          model,
          index,
          items;
      items = item && ArrayUtils.isArray(item) ? item : Array.prototype.slice.call(arguments, 1);
      for (i = 0, j = items.length; i < j; i++) {
        model = items[i];
        if (typeof model === 'object') {
          model = this.prepare(model);

          // If it's a duplicate, remove the old item
          id = model.get(idAttribute);
          if (id !== null) {
            compareObj[idAttribute] = id;
            index = this.indexOf(compareObj);
            if (index > -1 && !this.allowDuplicatedIds) {
              this.remove(index);
            }
          }

          this.models.splice(insertIndex, 0, model);
          if (!this.suppressTracking) {
            ArrayUtils.remove(this.removedItems, model);
            ArrayUtils.remove(this.changedItems, model);
            ArrayUtils.pushIfNotExists(this.addedItems, model);
          }
          _triggerItemEvent(this, 'addItem', null, insertIndex, this.models[insertIndex]);
          insertIndex++;
          result = true;
        } else {
          throw 'Only objects can be added to a Collection.';
        }
      }

      return result;
    },
    /**
     * Adds one or more items to the collection. Items with IDs matching an item already in this collection will replace instead of add.
     * @method add
     *
     * @params {Object} item  One or more items to add to the collection
     * @return {Boolean}  True if an item was added, false otherwise
     */
    /**
     * Adds one or more items to the collection. Items with IDs matching an item already in this collection will replace instead of add.
     * @method add
     *
     * @params {Array} items  An array of items to add to the collection
     * @return {Boolean}  True if an item was added, false otherwise
     */
// * @event addItem
    add: function(/* item1, item2, itemN */) {
      if (arguments.length && arguments[0] instanceof Array) {
        return this.add.apply(this, arguments[0]);
      }
      return this.insert.call(this, this.count(), Array.prototype.slice.call(arguments, 0));
    },
    /**
     * Moves an item
     * @method moveTo
     *
     * @param {Lavaca.mvc.Model} model  The model to move
     * @param {Number} newIndex  The new index at which the model should be placed
     *
     */
    /**
     * Moves an item
     * @method moveTo
     *
     * @param {Number} oldIndex  The current index of the model
     * @param {Number} newIndex  The new index at which the model should be placed
     */
// * @event moveItem
    moveTo: function(oldIndex, newIndex) {
      if (oldIndex instanceof this.TModel) {
        oldIndex = ArrayUtils.indexOf(this.models, oldIndex);
      }
      if (oldIndex > -1) {
        var model = this.models.splice(oldIndex, 1)[0];
        if (model) {
          this.models.splice(newIndex, 0, model);
          if (!this.suppressTracking) {
            this.changedOrder = true;
          }
          _triggerItemEvent(this, 'moveItem', oldIndex, newIndex, model);
        }
      }
    },
    /**
     * Removes an item from the collection
     * @method remove
     * @params {Number} index  The index of the model to remove
     * @return {Boolean}  True if an item was removed, false otherwise
     *
     */
    /**
     * Removes an item from the collection
     * @method remove
     * @params {Lavaca.mvc.Model} item  The models to remove from the collection
     * @return {Boolean}  True if an item was removed, false otherwise
     *
     */
    /**
     * Removes an item from the collection
     * @method remove
     * @param {Object} item  One object containing attributes matching any models to remove
     * @return {Boolean}  True if at least one item was removed, false otherwise
     *
     */
    /**
     * Removes an item from the collection
     * @method remove
     * @param {Object} item  N number of object arguments containing attributes matching any models to remove
     * @return {Array}  An array of booleans indicating if at least one item was removed by matching each argument
     *
     */
    /**
     * Removes an item from the collection
     * @method remove
     * @param {Array} items  An array of objects containing attributes matching any models to remove
     * @return {Array}  An array of booleans indicating if at least one item was removed by matching each element in the array
     */
    /**
     * Removes an item from the collection
     * @method remove
     * @param {Function} test  A function to check each model in the collection in the form
     *     test(index, model). If the test function returns true, the model will be removed
     * @return {Boolean}  True if at least one item was removed, false otherwise
     */
//* @event removeItem

    remove: function(item /*, item1, item2, item3...*/) {
      var n, it, items, index, i, removed;

      if (arguments.length === 1 && ArrayUtils.isArray(item)) {
        n = 0;
        removed = [];
        while (!!(it = item[n++])) {
          removed.push(this.remove(it));
        }
        return removed;
      } else if (arguments.length > 1) {
        // Prevent passing multiple numeric arguments,
        // which could have unexpected behavior
        if (typeof item === 'number' && item % 1 === 0) { // is integer
          return this.remove(item);
        } else {
          return this.remove([].slice.call(arguments));
        }
      }

      if (item instanceof this.TModel) {
        index = ArrayUtils.remove(this.models, item);
        if (index > -1) {
          if (!this.suppressTracking) {
            ArrayUtils.remove(this.addedItems, item);
            ArrayUtils.remove(this.changedItems, item);
            ArrayUtils.pushIfNotExists(this.removedItems, item);
          }
          item
            .off('change', this.onItemEvent)
            .off('invalid', this.onItemEvent)
            .off('saveSuccess', this.onItemEvent)
            .off('saveError', this.onItemEvent);
          _triggerItemEvent(this, 'removeItem', index, null, item);
          return true;
        } else {
          return false;
        }
      } else if (typeof item === 'number' && item % 1 === 0) { // is integer
        if (item >= 0 && item < this.count()) {
          return this.remove(this.itemAt(item));
        } else {
          return false;
        }
      } else {
        items = this.filter(item),
        i = -1,
        removed = false;
        while (!!(item = items[++i])) {
          removed = this.remove(item) || removed;
        }
        return removed;
      }
    },
    /**
     * Compiles a list of items matching an attribute hash
     * @method filter
     *
     * @param {Object} The attributes to test against each model
     * @return {Array}  A list of this collection's models that matched the attributes
     */
    /**
     * Compiles a list of items matching an attribute hash
     * @method filter
     *
     * @param {Object} attributes  The attributes to test against each model
     * @param {Number} maxResults  The maximum number of results to return
     * @return {Array}  A list of this collection's models that matched the attributes
     */
    /**
     * Compiles a list of items matching an attribute hash
     * @method filter
     *
     * @param {Function} test  A function to check each model in the collection in the form
     *     test(index, model). If the test function returns true, the model will be included
     *     in the result
     * @return {Array}  A list of this collection's models that passed the test
     */

    /**
     * Compiles a list of items matching an attribute hash
     * @method filter
     *
     * @param {Function} test  A function to check each model in the collection in the form
     *     test(index, model). If the test function returns true, the model will be included
     *     in the result
     * @param {Number} maxResults  The maximum number of results to return
     * @return {Array}  A list of this collection's models that passed the test
     */
    filter: function(test, maxResults) {
      maxResults = maxResults === UNDEFINED ? Number.MAX_VALUE : maxResults;
      var result = [],
          i = -1,
          item,
          attrs;
      if (typeof test !== 'function') {
        attrs = test;
        test = function(index, item) {
          for (var n in attrs) {
            if (item.get(n) !== attrs[n]) {
              return false;
            }
          }
          return true;
        };
      }
      while (!!(item = this.models[++i])) {
        if (test(i, item)) {
          result.push(item);
          if (--maxResults < 1) {
            break;
          }
        }
      }
      return result;
    },
    /**
     * Finds the first item matching an attribute hash
     * @method first
     *
     * @param {Object} attributes  The attributes to test against each model
     * @return {Lavaca.mvc.Model}  The first model that matched the attributes (or null)
     */
     /**
     * Finds the first item that passed a functional test
     * @method first
     *
     * @param {Function} test  A function to check each model in the collection in the form
     *     test(index, model). If the test function returns true, the model will be included
     *     as the result
     * @return {Lavaca.mvc.Model}  The first model that passed the test (or null)
     */
    first: function(test) {
      return this.filter(test, 1)[0] || null;
    },
    /**
     * Finds the index of the first item matching an attribute hash
     * @method indexOf
     *
     * @sig
     * Finds the index of the first item matching an attribute hash
     * @param {Object} attributes  The attributes to test against each model
     * @return {Number}  Index of the matching model, or -1 if no match is found
     */
    /**
     * Finds the index of the first item that passed a functional test
     * @method indexOf
     * @param {Function} test  A function to check each model in the collection in the form
     *     test(index, model). If the test function returns true, the model will be included
     *     as the result
     * @return {Number}  Index of the matching model, or -1 if no match is found
     */
    indexOf: function(test) {
      var match = this.first(test);
      return match ? ArrayUtils.indexOf(this.models, match) : -1;
    },
    /**
     * Gets the item at a specific index
     * @method itemAt
     *
     * @param {Number} index  The index of the item
     * @return {Lavaca.mvc.Model}  The model at that index
     */
    itemAt: function(index) {
      return this.models[index];
    },
    /**
     * Gets the number of items in the collection
     * @method count
     *
     * @return {Number}  The number of items in the collection
     */
    count: function() {
      return this.models.length;
    },
    /**
     * Executes a callback for each model in the collection. To stop iteration immediately,
     * return false from the callback.
     * @method each
     *
     * @param {Function} callback  A function to execute for each item, callback(index, model)
     */
    /**
     * Executes a callback for each model in the collection. To stop iteration immediately,
     * return false from the callback.
     * @method each
     * @param {Function} callback  A function to execute for each item, callback(index, model)
     * @param {Object} thisp  The context of the callback
     */
    each: function(cb, thisp) {
      var i = -1,
          returned,
          item;
      while (!!(item = this.itemAt(++i))) {
        returned = cb.call(thisp || this, i, item);
        if (returned === false) {
          break;
        }
      }
    },
    /**
     * Sorts the models in the collection using the specified attribute, in ascending order.
     * @method sort
     *
     * @param {String} attribute  Attribute to sort by
     * @return {Lavaca.mvc.Collection}  The updated collection (for chaining)
     */
    /**
     * Sorts the models in the collection using the specified attribute, in either ascending or descending order.
     * @method sort
     *
     * @param {String} attribute  Attribute to sort by
     * @param {Boolean}  descending  Use descending sort. Defaults to false
     * @return {Lavaca.mvc.Collection}  The updated collection (for chaining)
     *
     */
    /**
     * Sorts the models in the collection according to the specified compare function.
     * @method sort
     *
     * @param {Function} compareFunction  A function that compares two models. It should work
     *     in the same manner as the default Array.sort method in javascript.  i.e. the function
     *     should have a signature of function(modelA, modelB) and should return a negative integer
     *     if modelA should come before modelB, a positive integer if modelB should come before modelA
     *     and integer 0 if modelA and modelB are equivalent.
     * @return {Lavaca.mvc.Collection}  The updated collection (for chaining)
     */
//* @event moveItem

    sort: function(attribute, descending) {
      var comparator = typeof attribute === "function" ? attribute : _getComparator(attribute, descending),
          oldModels = clone(this.models),
          oldIndex;
      this.models.sort(comparator, this);
      if (!this.suppressTracking) {
        this.changedOrder = true;
      }
      if (!this.suppressEvents) {
        this.each(function(index, model) {
          oldIndex = ArrayUtils.indexOf(oldModels, model);
          if (oldIndex !== index) {
            _triggerItemEvent(this, 'moveItem', ArrayUtils.indexOf(oldModels, model), index, model);
          }
        });
      }
      return this;
    },
    /**
     * Reverses the order of the models in the collection
     * @method reverse
     *
     * @return {Lavaca.mvc.Collection}  The updated collection (for chaining)
     */
//* @event moveItem
    reverse: function() {
      var oldModels = clone(this.models),
          oldIndex;
      this.models.reverse();
      if (!this.suppressTracking) {
        this.changedOrder = true;
      }
      if (!this.suppressEvents) {
        this.each(function(index, model) {
          oldIndex = ArrayUtils.indexOf(oldModels, model);
          if (oldIndex !== index) {
            _triggerItemEvent(this, 'moveItem', ArrayUtils.indexOf(oldModels, model), index, model);
          }
        });
      }
      return this;
    },
    /**
     * Handler invoked when an item in the collection has an event. Triggers an [[Lavaca.mvc.ItemEvent]].
     * @method onItemEvent
     *
     * @param {Lavaca.mvc.ModelEvent} e  The item event
     */
    onItemEvent: function(e) {
      var model = e.target,
          index = ArrayUtils.indexOf(this.models, model);
      if (e.type === 'change') {
        ArrayUtils.pushIfNotExists(this.changedItems, model);
      } else if (e.type === 'saveSuccess') {
        ArrayUtils.remove(this.changedItems, model);
      }
      this.trigger(e.type + 'Item', merge({}, e, {
        target: model,
        model: model,
        index: index,
        previousIndex: null
      }));
    },
    /**
     * Processes the data received from a fetch request
     * @method onFetchSuccess
     *
     * @param {Object} response  The response data
     */
    onFetchSuccess: function(response) {
      var list;
      response = this.parse(response);
      if (this.responseFilter && typeof this.responseFilter === 'function') {
        response = this.responseFilter(response);
      }
      list = response;
      if (!(list instanceof Array)) {
        this.apply(response);
        if (response && response.hasOwnProperty(this.itemsProperty)) {
          list = response[this.itemsProperty];
        }
      }
      this.add.apply(this, list);
      this.trigger('fetchSuccess', {response: response});
    },
    /**
     * Saves the model to the server via POST
     * @method saveToServer
     *
     * @param {String} url  The URL to which to post the data
     * @return {Lavaca.util.Promise}  A promise
     */
    saveToServer: function(url) {
      return this.save(function(model, changedAttributes, attributes) {
        var id = this.id(),
            data;
        if (this.isNew()) {
          data = attributes;
        } else {
          changedAttributes[this.idAttribute] = id;
          data = changedAttributes;
        }
        return (new Promise(this)).when(Connectivity.ajax({
          url: url,
          cache: false,
          type: 'POST',
          data: data,
          dataType: 'json'
        }));
      });
    },
    /**
     * Converts this model to a key-value hash
     * @method toObject
     *
     * @param {Boolean} idOnly  When true, only include item IDs for pre-existing items
     * @return {Object}  The key-value hash
     */
    toObject: function(idOnly) {
      var obj = Model.prototype.toObject.apply(this, arguments),
          prop = this.itemsProperty,
          items = obj[prop] = [],
          i = -1,
          item;
      while (!!(item = this.models[++i])) {
        items[obj[prop].length] = idOnly && !item.isNew() ? item.id() : item.toObject();
      }
      return obj;
    },
    /**
    * Filters the raw response from onFetchSuccess() down to a custom object. (Meant to be overriden)
    * @method responseFilter
    *
    * @param {Object} response  The raw response passed in onFetchSuccess()
    * @return {Object}  An object or array to be applied to this collection instance
    */
    responseFilter: function(response) {
      return response;
    }
  });

  return Collection;

});

define('lavaca/util/StringUtils',['require'],function(require) {

  var _htmlEscapes = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&apos;'
  };

  function _noop(s) {
    return s;
  }

  /**
   * Static utility type for working with strings
   * @class lavaca.util.StringUtils
   */
  var StringUtils = {};

  /**
   * Substitutes arguments into a string
   * @method format
   * @static
   * @param {String} s  The format string. Substitutions should be in the form {0} to sub in
   *   the first arg, {1} for the second, and so on
   * @params {Object} arg  Arguments to be substituted in to the string
   * @return {String}  The format string with the arguments substituted into it
   */
  /**
   * Substitutes arguments into a string
   * @method format
   * @static
   * @param {String} s  The format string. Substitutions should be in the form {0} to sub in
   *   the first arg, {1} for the second, and so on
   * @param {Array} args  Arguments to be substituted in to the string
   * @return {String}  The format string with the arguments substituted into it
   */
  /**
   * Substitutes arguments into a string
   * @method format
   * @static
   * @param {String} s  The format string. Substitutions should be in the form {0} to sub in
   *   the first arg, {1} for the second, and so on
   * @param {Array} args  Arguments to be substituted in to the string
   * @param {Function} fn  A function to call on each argument, the result of which is substituted into the string
   * @return {String}  The format string with the arguments substituted into it
   */
  StringUtils.format = function(s /*[, arg0, arg1, argN]*/) {
    var args,
        fn = _noop,
        i,
        j;
    if (arguments[1] instanceof Array) {
      args = arguments[1];
      fn = arguments[2] || _noop;
    } else {
      args = [].slice.call(arguments, 1);
    }
    for (i = 0, j = args.length; i < j; i++) {
      s = s.split('{' + i + '}').join(fn(args[i] + ''));
    }
    return s;
  };

  /**
   * Escapes a string for inclusion in HTML
   * @method escapeHTML
   * @static
   *
   * @param {String} s  The string
   * @return {String}  The escaped string
   */
  StringUtils.escapeHTML = function(s) {
    s = '' + s;
    for (var n in _htmlEscapes) {
      s = s.split(n).join(_htmlEscapes[n]);
    }
    return s;
  };

  return StringUtils;

});
define('lavaca/mvc/Controller',['require','lavaca/net/Connectivity','lavaca/net/History','lavaca/util/Disposable','lavaca/util/Promise','lavaca/util/StringUtils','lavaca/util/Translation'],function(require) {

  var Connectivity = require('lavaca/net/Connectivity'),
      History = require('lavaca/net/History'),
      Disposable = require('lavaca/util/Disposable'),
      Promise = require('lavaca/util/Promise'),
      StringUtils = require('lavaca/util/StringUtils'),
      Translation = require('lavaca/util/Translation');

  /**
   * Base type for controllers
   * @class lavaca.mvc.Controller
   * @extends lavaca.util.Disposable
   * @constructor
   * @param {Lavaca.mvc.Controller} other  Another controller from which to take context information
   * @param {Lavaca.mvc.Router} [router]  The application's router
   * @param {Lavaca.mvc.ViewManager} [viewManager]  The application's view manager
   */
  var Controller = Disposable.extend(function(router, viewManager) {
    if (router instanceof Controller) {
      this.router = router.router;
      this.viewManager = router.viewManager;
    } else {
      this.router = router;
      this.viewManager = viewManager;
    }
  }, {
    /**
     * The application's router
     * @property {Lavaca.mvc.Router} router
     * @default null
     */
    router: null,
    /**
     * The application's view manager
     * @property {Lavaca.mvc.ViewManager} viewManager
     * @default null
     */
    viewManager: null,
    /**
     * Executes an action on this controller
     * @method exec
     *
     * @param {String} action  The name of the controller method to call
     * @param {Object} params  Key-value arguments to pass to the action
     * @return {Lavaca.util.Promise}  A promise
     */
     /**
     * Executes an action on this controller
     * @method exec
     * @param {String} action  The name of the controller method to call
     * @param {Object} params  Key-value arguments to pass to the action
     * @param {Object} state  A history record object
     * @return {Lavaca.util.Promise}  A promise
     */
    exec: function(action, params, state) {
      this.params = params;
      this.state = state;
      var promise = new Promise(this),
          model,
          result;
      if (state) {
        model = state.state;
        promise.success(function() {
          document.title = state.title;
        });
      }
      result = this[action](params, model);
      if (result instanceof Promise) {
        promise.when(result);
      } else {
        promise.resolve();
      }
      return promise;
    },
    /**
     * Loads a view
     * @method view
     *
     * @param {String} cacheKey  The key under which to cache the view
     * @param {Function} TView  The type of view to load (should derive from [[Lavaca.mvc.View]])
     * @param {Object} model  The data object to pass to the view
     * @param {Number} layer  The integer indicating what UI layer the view sits on
     * @return {Lavaca.util.Promise}  A promise
     */
    view: function(cacheKey, TView, model, layer) {
      return Promise.when(this, this.viewManager.load(cacheKey, TView, model, layer));
    },
    /**
     * Adds a state to the browser history
     * @method history
     *
     * @param {Object} state  A data object associated with the page state
     * @param {String} title  The title of the page state
     * @param {String} url  The URL of the page state
     * @param {Boolean} useReplace  The bool to decide if to remove previous history
     */
    history: function(state, title, url, useReplace) {
      var needsHistory = !this.state;
      return function() {
        if (needsHistory) {
          History[useReplace ? 'replace' : 'push'](state, title, url);
        }
      };
    },
    /**
     * Convenience method for formatting URLs
     * @method url
     *
     * @param {String} str  The URL string
     * @param {Array} args  Format arguments to insert into the URL
     * @return {String}  The formatted URL
     */
    url: function(str, args) {
      return StringUtils.format(str, args, encodeURIComponent);
    },
    /**
     * Directs the user to another route
     * @method redirect
     *
     * @param {String} str  The URL string
     * @return {Lavaca.util.Promise}  A promise
     *
     */
    /**
     * Directs the user to another route
     * @method redirect
     * @param {String} str  The URL string
     * @param {Array} args  Format arguments to insert into the URL
     * @return {Lavaca.util.Promise}  A promise
     */
    redirect: function(str, args) {
      return this.router.unlock().exec(this.url(str, args || []));
    },
    /**
     * Readies the controller for garbage collection
     * @method dispose
     */
    dispose: function() {
      // Do not dispose of view manager or router
      this.router
        = this.viewManager
        = null;
      Disposable.prototype.dispose.apply(this, arguments);
    }
  });

  return Controller;

});

define('lavaca/mvc/Model',['require','lavaca/events/EventDispatcher','lavaca/net/Connectivity','lavaca/util/ArrayUtils','lavaca/util/Cache','lavaca/util/Promise','mout/lang/deepClone','mout/object/merge','lavaca/util/Config'],function(require) {

  var EventDispatcher = require('lavaca/events/EventDispatcher'),
      Connectivity = require('lavaca/net/Connectivity'),
      ArrayUtils = require('lavaca/util/ArrayUtils'),
      Cache = require('lavaca/util/Cache'),
      Promise = require('lavaca/util/Promise'),
      clone = require('mout/lang/deepClone'),
      merge = require('mout/object/merge'),
      Config = require('lavaca/util/Config');


  var UNDEFINED;

  function _triggerAttributeEvent(model, event, attribute, previous, value, messages) {
    model.trigger(event, {
      attribute: attribute,
      previous: previous === UNDEFINED ? null : previous,
      value: value === UNDEFINED ? model.get(attribute) : value,
      messages: messages || []
    });
  }

  function _setFlagOn(model, name, flag) {
    var keys = model.flags[flag];
    if (!keys) {
      keys = model.flags[flag] = [];
    }
    if (!ArrayUtils.contains(keys, name)) {
      keys.push(name);
    }
  }

  function _suppressChecked(model, suppress, callback) {
    suppress = !!suppress;
    var props = ['suppressValidation', 'suppressEvents', 'suppressTracking'],
        old = {},
        i = -1,
        prop,
        result;
    while (!!(prop = props[++i])) {
      old[prop] = model[prop];
      model[prop] = suppress || model[prop];
    }
    result = callback.call(model);
    i = -1;
    while (!!(prop = props[++i])) {
      model[prop] = old[prop];
    }
    return result;
  }

  function _isValid(messages){
    var isValid = true;
    for(var attribute in messages){
      if (messages[attribute].length > 0){
        isValid = false;
      }
    }
    messages.isValid = isValid;
    return messages;
  }


  // Virtual type
  /**
   * Event type used when an attribute is modified
   * @class lavaca.mvc.AttributeEvent
   * @extends Event
   */
   /**
   * The name of the event-causing attribute
   * @property {String} attribute
   * @default null
   */
   /**
   * The value of the attribute before the event
   * @property {Object} previous
   * @default null
   */
   /**
   * The value of the attribute after the event
   * @property {Object} value
   * @default null
   */
   /**
   * A list of validation messages the change caused
   * @property {Array} messages
   * @default []
   */

  /**
   * Basic model type
   * @class lavaca.mvc.Model
   * @extends lavaca.events.EventDispatcher
   *
   * Place the events where they are triggered in the code, see the yuidoc syntax reference and view.js for rendersuccess trigger
   * @event change
   * @event invalid
   * @event fetchSuccess
   * @event fetchError
   * @event saveSuccess
   * @event saveError
   *
   * @constructor
   * @param {Object} [map]  A parameter hash to apply to the model
   */
  var Model = EventDispatcher.extend(function(map) {
    EventDispatcher.call(this);
    this.attributes = new Cache();
    this.rules = new Cache();
    this.unsavedAttributes = [];
    this.flags = {};
    if (this.defaults) {
      map = merge({}, this.defaults, map);
    }
    if (map) {
      this.suppressEvents
        = this.suppressTracking
        = true;
      this.apply(map);
      this.suppressEvents
        = this.suppressTracking
        = false;
    }
  }, {
    /**
     * When true, attributes are not validated
     * @property suppressValidation
     * @default false
     *
     * @type Boolean
     */

    suppressValidation: false,
    /**
     * When true, changes to attributes are not tracked
     * @property suppressTracking
     * @default false
     *
     * @type Boolean
     */

    suppressTracking: false,
    /**
     * Gets the value of a attribute
     * @method get
     *
     * @param {String} attribute  The name of the attribute
     * @return {Object}  The value of the attribute, or null if there is no value
     */
    get: function(attribute) {
      var attr = this.attributes.get(attribute),
          flags;
      if (typeof attr === 'function') {
        flags = this.flags[Model.DO_NOT_COMPUTE];
        return !flags || ArrayUtils.indexOf(flags, attribute) === -1 ? attr.call(this) : attr;
      }
      return attr;
    },
    /**
     * Determines whether or not an attribute can be assigned
     * @method canSet
     *
     * @param {String} attribute  The name of the attribute
     * @return {Boolean}  True if you can assign to the attribute
     */
    canSet: function() {
      return true;
    },
    /**
     * Sets the value of the attribute, if it passes validation
     * @method set
     *
     * @param {String} attribute  The name of the attribute
     * @param {Object} value  The new value
     * @return {Boolean}  True if attribute was set, false otherwise
     *
     */
    /**
     * Sets the value of the attribute, if it passes validation
     * @method set
     *
     * @param {String} attribute  The name of the attribute
     * @param {Object} value  The new value
     * @param {String} flag  A metadata flag describing the attribute
     * @param {Boolean} suppress  When true, validation, events and tracking are suppressed
     * @return {Boolean}  True if attribute was set, false otherwise
     */
//* @event invalid
//* @event change


    set: function(attribute, value, flag, suppress) {
      return _suppressChecked(this, suppress, function() {
        if (!this.canSet(attribute)) {
          return false;
        }
        var previous = this.attributes.get(attribute),
            messages = this.suppressValidation ? [] : this.validate(attribute, value);
        if (messages.length) {
          _triggerAttributeEvent(this, 'invalid', attribute, previous, value, messages);
          return false;
        } else {
          if (previous !== value) {
            this.attributes.set(attribute, value);
            if (flag) {
              _setFlagOn(this, attribute, flag);
            }
            _triggerAttributeEvent(this, 'change', attribute, previous, value);
            if (!this.suppressTracking
                && !ArrayUtils.contains(this.unsavedAttributes, attribute)) {
              this.unsavedAttributes.push(attribute);
            }
          }
          return true;
        }
      });
    },
    /**
     * Determines whether or not this model has a named attribute
     * @method has
     *
     * @param {String} attribute  The name of the attribute
     * @return {Boolean}  True if the attribute exists and has a value
     */
    has: function(attribute) {
      return this.get(attribute) !== null;
    },
    /**
     * The name of the ID attribute
     * @property id
     * @default 'id'
     *
     * @type String
     */

    idAttribute: 'id',
    /**
     * Gets the ID of the model
     * @method id
     *
     * @return {String}  The ID of the model
     */
    id: function() {
      return this.get(this.idAttribute);
    },
    /**
     * Determines whether or not this model has been saved before
     * @method isNew
     *
     * @return {Boolean}  True when the model has no ID associated with it
     */
    isNew: function() {
      return null === this.id();
    },
    /**
     * Ensures that a map is suitable to be applied to this model
     * @method parse
     *
     * @param {Object} map  The string or key-value hash to parse
     * @return {Object}  The parsed version of the map
     */
    parse: function(map) {
      if (typeof map === 'string') {
        map = JSON.parse(map);
      }
      return map;
    },
    /**
     * Sets each attribute of this model according to the map
     * @method apply
     *
     * @param {Object} map  The string or key-value map to parse and apply
     */
    /**
     * Sets each attribute of this model according to the map
     * @method apply
     *
     * @param {Object} map  The string or key-value map to parse and apply
     * @param {Boolean} suppress  When true, validation, events and tracking are suppressed
     */
    apply: function(map, suppress) {
      _suppressChecked(this, suppress, function() {
        map = this.parse(map);
        for (var n in map) {
          this.set(n, map[n]);
        }
      });
    },
    /**
     * Removes all data from the model or removes selected flag from model.
     * @method clear
     *
     * @sig
     * Removes all flagged data from the model
     * @param {String} flag  The metadata flag describing the data to remove
     */
    clear: function(flag) {
      if (flag) {
        var attrs = this.flags[flag],
            i = -1,
            attr,
            item;
        if (attrs) {
          while (!!(attr = attrs[++i])) {
            ArrayUtils.remove(this.unsavedAttributes, attr);
            item = this.get(attr);
            if (item && item.dispose) {
              item.dispose();
            }
            this.set(attr, null);
          }
        }
      } else {
        this.attributes.dispose();
        this.attributes = new Cache();
        this.unsavedAttributes.length = 0;
      }
    },
    /**
     * Makes a copy of this model
     * @method clone
     *
     * @return {Lavaca.mvc.Model}  The copy
     */
    clone: function() {
      return new this.constructor(this.attributes.toObject());
    },
    /**
     * Adds a validation rule to this model
     * @method addRule
     *
     * @param {String} attribute  The name of the attribute to which the rule applies
     * @param {Function} callback  The callback to use to validate the attribute, in the
     *   form callback(attribute, value)
     * @param {String} message  A text message used when a value fails the test
     */
    addRule: function(attribute, callback, message) {
      this.rules.get(attribute, []).push({rule: callback, message: message});
    },
    /**
     * Validates all attributes on the model
     * @method validate
     *
     * @return {Object}  A map of attribute names to validation error messages
     */
    /**
     * Runs validation tests for a specific attribute
     * @method validate
     *
     * @param {String}  The name of the attribute to test
     * @return {Array}  A list of validation error messages
     */
    /**
     * Runs validation against a potential value for a attribute
     * @method validate
     * @param {String} attribute  The name of the attribute
     * @param {Object} value  The potential value for the attribute
     * @return {Array}  A list of validation error messages
     */
    validate: function(attribute, value) {
      var messages,
          rules,
          i = -1,
          rule;
      if (attribute) {
        messages = [];
        value = value === UNDEFINED ? this.get(attribute, value) : value;
        rules = this.rules.get(attribute);
        if (rules) {
          while (!!(rule = rules[++i])) {
            if (!rule.rule(attribute, value)) {
              messages.push(rule.message);
            }
          }
        }
        return messages;
      } else {
        messages = {};
        this.rules.each(function(attributeName) {
          messages[attributeName] = this.validate(attributeName);
        }, this);
        return _isValid(messages);
      }
    },
    /**
     * Processes the data received from a fetch request
     * @method onFetchSuccess
     *
     * @param {Object} response  The response data
     */
    onFetchSuccess: function(response) {
      response = this.parse(response);
      if (this.responseFilter && typeof this.responseFilter === 'function') {
        response = this.responseFilter(response);
      }
      this.apply(response, true);
      this.trigger('fetchSuccess', {response: response});
    },
    /**
     * Triggered when the model is unable to fetch data
     * @method onFetchError
     *
     * @param {Object} value  The error value
     */
    onFetchError: function(response) {
      this.trigger('fetchError', {response: response});
    },
    /**
     * Loads the data for this model from the server and only apply to this model attributes (Note: Does not clear the model first)
     * @method fetch
     *
     * @event fetchSuccess
     * @event fetchError
     */
    /**
     * Loads the data for this model from the server and only apply to this model attributes (Note: Does not clear the model first)
     * @method fetch
     *
     * @param {String} url  The URL from which to load the data
     * @return {Lavaca.util.Promise}  A promise
     */
    /**
     * Loads the data for this model from the server and only apply to this model attributes (Note: Does not clear the model first)
     * @method fetch
     *
     * @param {Object} options  jQuery AJAX settings. If url property is missing, fetch() will try to use the url property on this model
     * @return {Lavaca.util.Promise}  A promise
     */
    /**
     * Loads the data for this model from the server and only apply to this model attributes (Note: Does not clear the model first)
     * @method fetch
     *
     * @param {String} url  The URL from which to load the data
     * @param {Object} options  jQuery AJAX settings
     * @return {Lavaca.util.Promise}  A promise
     */
    fetch: function(url, options) {
      if (typeof url === 'object') {
        options = url;
      } else {
        options = clone(options || {});
        options.url = url;
      }
      options.url = this.getApiURL(options.url || this.url);
      return Promise.when(this, Connectivity.ajax(options))
        .success(this.onFetchSuccess)
        .error(this.onFetchError);
    },
    /**
     * Converts a relative path to an absolute api url based on environment config 'apiRoot'
     * @method getApiURL
     *
     * @param {String} relPath  A relative path
     * @return {String}  A formated api url or an apparently bad url '/please_set_model_url' if relPath argument is faslsy
     */
    getApiURL: function(relPath) {
      var badURL = '/please_set_model_url',
          apiRoot = Config.get('apiRoot'),
          apiURL;
      if (!relPath) {
        return badURL;
      }
      apiURL = (apiRoot || '') + relPath;
      return apiURL;
    },
    /**
     * Saves the model
     * @method save
     *
     *
     * @param {Function} callback  A function callback(model, changedAttributes, attributes)
     *   that returns either a promise or a truthy value
     *   indicating whether the operation failed or succeeded
     * @return {Lavaca.util.Promise}  A promise
     */
    /**
     * Saves the model
     * @method save
     *
     * @param {Function} callback  A function callback(model, changedAttributes, attributes)
     *   that returns either a promise or a truthy value
     *   indicating whether the operation failed or succeeded
     * @param {Object} thisp  The context for the callback
     * @return {Lavaca.util.Promise}  A promise
     */

//* @event saveSuccess
//* @event saveError

    save: function(callback, thisp) {
      var promise = new Promise(this),
          attributes = this.toObject(),
          changedAttributes = {},
          i = -1,
          attribute,
          result;
      while (!!(attribute = this.unsavedAttributes[++i])) {
        changedAttributes[attribute] = attributes[attribute];
      }
      promise
        .success(function(value) {
          var idAttribute = this.idAttribute;
          if (this.isNew() && value[idAttribute] !== UNDEFINED) {
            this.set(idAttribute, value[idAttribute]);
          }
          this.unsavedAttributes = [];
          this.trigger('saveSuccess', {response: value});
        })
        .error(function(value) {
          this.trigger('saveError', {response: value});
        });
      result = callback.call(thisp || this, this, changedAttributes, attributes);
      if (result instanceof Promise) {
        promise.when(result);
      } else if (result) {
        promise.resolve(result);
      } else {
        promise.reject(result);
      }
      return promise;
    },
    /**
     * Saves the model to the server via POST
     * @method saveToServer
     *
     * @param {String} url  The URL to which to post the data
     * @return {Lavaca.util.Promise}  A promise
     */
    saveToServer: function(url) {
      return this.save(function(model, changedAttributes, attributes) {
        var id = this.id(),
            data;
        if (this.isNew()) {
          data = attributes;
        } else {
          changedAttributes[this.idAttribute] = id;
          data = changedAttributes;
        }
        return Promise.when(this, Connectivity.ajax({
            url: url,
            cache: false,
            type: 'POST',
            data: data,
            dataType: 'json'
          }));
      });
    },
    /**
     * Converts this model to a key-value hash
     * @method toObject
     *
     * @return {Object}  The key-value hash
     */
    toObject: function() {
      var obj = this.attributes.toObject(),
          flags;
      for(var key in obj) {
        if(typeof obj[key] === "function") {
          flags = this.flags[Model.DO_NOT_COMPUTE];
          if (!flags || ArrayUtils.indexOf(flags, key) === -1) {
            obj[key] = obj[key].call(this);
          }
        }
      }
      return obj;
    },
    /**
     * Converts this model to JSON
     * @method toJSON
     *
     * @return {String}  The JSON string representing the model
     */
    toJSON: function() {
      return JSON.stringify(this.toObject());
    },
    /**
     * Bind an event handler to this object
     * @method on
     *
     *
     * @param {String} type  The name of the event
     * @param {Function} callback  The function to execute when the event occurs
     * @return {Lavaca.events.EventDispatcher}  This event dispatcher (for chaining)
     */
    /**
     * Bind an event handler to this object
     * @method on
     *
     * @param {String} type  The name of the event
     * @param {String} attr  An attribute to which to limit the scope of events
     * @param {Function} callback  The function to execute when the event occurs
     * @return {Lavaca.events.EventDispatcher}  This event dispatcher (for chaining)
     */
    /**
     * Bind an event handler to this object
     * @method on
     * @param {String} type  The name of the event
     * @param {Function} callback  The function to execute when the event occurs
     * @param {Object} thisp  The context of the handler
     * @return {Lavaca.events.EventDispatcher}  This event dispatcher (for chaining)
     */
    /**
     * Bind an event handler to this object
     * @method on
     * @param {String} type  The name of the event
     * @param {String} attr  An attribute to which to limit the scope of events
     * @param {Function} callback  The function to execute when the event occurs
     * @param {Object} thisp  The context of the handler
     * @return {Lavaca.events.EventDispatcher}  This event dispatcher (for chaining)
     */
    on: function(type, attr, callback, thisp) {
      if (typeof attr === 'function') {
        thisp = callback;
        callback = attr;
        attr = null;
      }
      function handler(e) {
        if (!attr || e.attribute === attr) {
          callback.call(thisp || this, e);
        }
      }
      handler.fn = callback;
      handler.thisp = thisp;
      return EventDispatcher.prototype.on.call(this, type, handler, thisp);
    },
    /**
    * Filters the raw response from onFetchSuccess() down to a custom object. (Meant to be overriden)
    * @method responseFilter
    *
    * @param {Object} response  The raw response passed in onFetchSuccess()
    * @return {Object}  An object to be applied to this model instance
    */
    responseFilter: function(response) {
      return response;
    }
  });
  /**
   * @field {String} SENSITIVE
   * @static
   * @default 'sensitive'
   * Flag indicating that data is sensitive
   */
  Model.SENSITIVE = 'sensitive';
  /**
   * @field {String} DO_NOT_COMPUTE
   * @static
   * @default 'do_not_compute'
   * Flag indicating that the selected attribute should not be executed
   * as a computed property and should instead just return the function.
   */
  Model.DO_NOT_COMPUTE = 'do_not_compute';

  return Model;

});

define('lavaca/mvc/PageView',['require','$','lavaca/mvc/Model','lavaca/mvc/View','lavaca/ui/Template','lavaca/util/Promise','lavaca/util/delay'],function(require) {

  var $ = require('$'),
      Model = require('lavaca/mvc/Model'),
      View = require('lavaca/mvc/View'),
      Template = require('lavaca/ui/Template'),
      Promise = require('lavaca/util/Promise'),
      delay = require('lavaca/util/delay');

  /**
   * Page View type, represents an entire screen
   * @class lavaca.mvc.PageView
   * @extends lavaca.mvc.View
   *
   * @constructor
   * @param {Object} el  The element that the PageView is bound to
   * @param {Object} model  The model used by the view
   * @param {Number} [layer]  The index of the layer on which the view sits
   *
   */
  var PageView = View.extend(function(el, model, layer) {

    View.call(this, el, model);
    /**
     * The index of the layer on which the view sits
     * @property {Number} layer
     * @default 0
     */
    this.layer = layer || 0;


  }, {

    /**
     * The element containing the view
     * @property {jQuery} shell
     * @default null
     */
    shell: null,

    /**
     * Creates the view's wrapper element
     * @method wrapper
     * @return {jQuery}  The wrapper element
     */
    wrapper: function() {
      return $('<div class="view"></div>');
    },
    /**
     * Creates the view's interior content wrapper element
     * @method interior
     * @return {jQuery} The interior content wrapper element
     */
    interior: function() {
      return $('<div class="view-interior"></div>');
    },


    /**
     * Adds this view to a container
     * @method insertInto
     * @param {jQuery} container  The containing element
     */
    insertInto: function(container) {
      if (this.shell.parent()[0] !== container[0]) {
        var layers = container.children('[data-layer-index]'),
            i = -1,
            layer;
        while (!!(layer = layers[++i])) {
          layer = $(layer);
          if (layer.attr('data-layer-index') > this.index) {
            this.shell.insertBefore(layer);
            return;
          }
        }
        container.append(this.shell);
      }
    },
    /**
     * Renders the view using its template and model, overrides the View class render method
     * @method render
     *
     * @return {Lavaca.util.Promise}  A promise
     */
    render: function() {
      var promise = new Promise(this),
          renderPromise = new Promise(this),
          template = Template.get(this.template),
          model = this.model;
      if (model instanceof Model) {
        model = model.toObject();
      }
      if (this.el) {
        this.el.remove();
      }

      this.shell = this.wrapper();
      this.el = this.interior();
      this.shell.append(this.el);
      this.shell.attr('data-layer-index', this.layer);
      if (this.className) {
        this.shell.addClass(this.className);
      }
      promise
        .success(function(html) {
          /**
           * Fires when html from template has rendered
           * @event rendersuccess
           */
          this.trigger('rendersuccess', {html: html});
          renderPromise.resolve();
        })
        .error(function(err) {
          /**
           * Fired when there was an error during rendering process
           * @event rendererror
           */
          this.trigger('rendererror', {err: err});
          renderPromise.reject();
        });
      template
        .render(model)
        .success(promise.resolver())
        .error(promise.rejector());

      return renderPromise;
    },
    /**
     * Executes when the user navigates to this view
     * @method enter
     * @param {jQuery} container  The parent element of all views
     * @param {Array} exitingViews  The views that are exiting as this one enters
     * @return {lavaca.util.Promise}  A promise
     */
    enter: function(container) {
      var promise = new Promise(this),
          renderPromise;
      container = $(container);
      if (!this.hasRendered) {
        renderPromise = this
          .render()
          .error(promise.rejector());
      }
      this.insertInto(container);
      if (renderPromise) {
        promise.when(renderPromise);
      } else {
        delay(promise.resolver());
      }
      promise.then(function() {
        /**
         * Fired when there was an error during rendering process
         * @event rendererror
         */
        this.trigger('enter');
      });
      return promise;
    },
    /**
     * Executes when the user navigates away from this view
     * @method exit
     *
     * @param {jQuery} container  The parent element of all views
     * @param {Array} enteringViews  The views that are entering as this one exits
     * @return {lavaca.util.Promise}  A promise
     */
    exit: function() {
      var promise = new Promise(this);
      this.shell.detach();
      delay(promise.resolver());
      promise.then(function() {
        /**
         * Fired when there was an error during rendering process
         * @event rendererror
         */
        this.trigger('exit');
      });
      return promise;
    }
  });

  return PageView;

});

define('lavaca/mvc/Route',['require','lavaca/util/Disposable','lavaca/util/delay','mout/lang/deepClone','mout/object/merge'],function(require) {

  var Disposable = require('lavaca/util/Disposable'),
      delay = require('lavaca/util/delay'),
      clone = require('mout/lang/deepClone'),
      merge = require('mout/object/merge');

  function _multivariablePattern() {
    return new RegExp('\\{\\*(.*?)\\}', 'g');
  }

  function _variablePattern() {
    return new RegExp('\\{([^\\/]*?)\\}', 'g');
  }

  function _variableCharacters() {
    return new RegExp('[\\{\\}\\*]', 'g');
  }

  function _datePattern() {
    return new RegExp('^\\d{4}-[0-1]\\d-[0-3]\\d$', 'g');
  }

  function _patternToRegExp(pattern) {
    if (pattern === '/') {
      return new RegExp('^\\/(\\?.*)?(#.*)?$', 'g');
    }
    if (pattern.charAt(0) === '/') {
      pattern = pattern.slice(1);
    }
    pattern = pattern.split('/');
    var exp = '^',
        i = -1,
        part;
    while (!!(part = pattern[++i])) {
      if (_multivariablePattern().test(part)) {
        exp += '(/([^/?#]+))*?';
      } else if (_variablePattern().test(part)) {
        exp += '/([^/?#]+)';
      } else {
        exp += '/' + part;
      }
    }
    exp += '(\\?.*)?(#\\.*)?$';
    return new RegExp(exp, 'g');
  }

  function _scrubURLValue(value) {
    value = decodeURIComponent(value);
    if (!isNaN(value)) {
      value = Number(value);
    } else if (value.toLowerCase() === 'true') {
      value = true;
    } else if (value.toLowerCase() === 'false') {
      value = false;
    } else if (_datePattern().test(value)) {
      value = value.split('-');
      value = new Date(Number(value[0]), Number(value[1]) - 1, Number(value[2]));
    }
    return value;
  }

  /**
   * @class lavaca.mvc.Route
   * @extends lavaca.util.Disposable
   * A relationship between a URL pattern and a controller action
   *
   * @constructor
   * @param {String} pattern  The route URL pattern
   *   Route URL patterns should be in the form /path/{foo}/path/{*bar}.
   *   The path variables, along with query string parameters, will be passed
   *   to the controller action as a params object. In this case, when passed
   *   the URL /path/something/path/1/2/3?abc=def, the params object would be
   *   {foo: 'something', bar: [1, 2, 3], abc: 'def'}.
   * @param {Function} TController  The type of controller that performs the action
   *   (Should derive from [[Lavaca.mvc.Controller]])
   * @param {String} action  The name of the controller method to call
   * @param {Object} params  Key-value pairs that will be merged into the params
   *   object that is passed to the controller action
   */
  var Route = Disposable.extend(function(pattern, TController, action, params) {
    Disposable.call(this);
    this.pattern = pattern;
    this.TController = TController;
    this.action = action;
    this.params = params || {};
  }, {
    /**
     * Tests if this route applies to a URL
     * @method matches
     *
     * @param {String} url  The URL to test
     * @return {Boolean}  True when this route matches the URL
     */
    matches: function(url) {
      return _patternToRegExp(this.pattern).test(url);
    },
    /**
     * Converts a URL into a params object according to this route's pattern
     * @method parse
     *
     * @param {String} url  The URL to convert
     * @return {Object}  The params object
     */
    parse: function(url) {
      var result = clone(this.params),
          pattern = this.pattern.slice(1),
          urlParts = url.split('#'),
          i,
          query,
          path,
          pathItem,
          patternItem,
          name;
      result.url = url;
      result.route = this;
      urlParts = urlParts[1] ? urlParts[1].split('?') : urlParts[0].split('?');
      query = urlParts[1];
      if (query) {
        i = -1;
        query = query.split('&');
        while (!!(pathItem = query[++i])) {
          pathItem = pathItem.split('=');
          name = decodeURIComponent(pathItem[0]);
          if (result[name] !== undefined) {
            if (!(result[name] instanceof Array)) {
              result[name] = [result[name]];
            }
            result[name].push(_scrubURLValue(pathItem[1]));
          } else {
            result[name] = _scrubURLValue(pathItem[1]);
          }
        }
      }
      i = 0;
      path = urlParts[0].replace(/(^(http(s?)\:\/\/[^\/]+)?\/?)|(\/$)/, '');
      var breakApartPattern = new RegExp(pattern.replace(_multivariablePattern(), '(.+)').replace(_variablePattern(), '([^/]+)')),
          brokenPath = breakApartPattern.exec(path),
          brokenPattern = breakApartPattern.exec(pattern);
      while (!!(pathItem = brokenPath[++i])) {
        patternItem = brokenPattern[i];
        if (_multivariablePattern().test(patternItem)) {
          pathItem = pathItem.split('/');
        }
        result[patternItem.replace(_variableCharacters(), '')] = pathItem;
      }
      return result;
    },
    /**
     * Executes this route's controller action see if work
     * @method exec
     *
     * @param {String} url  The URL that supplies parameters to this route
     * @param {Lavaca.mvc.Router} router  The router used by the application
     * @param {Lavaca.mvc.ViewManager}  viewManager The view manager used by the application
     * @return {Lavaca.util.Promise}  A promise
     */
    /**
     * Executes this route's controller action see if work
     * @method exec
     *
     * @param {String} url  The URL that supplies parameters to this route
     * @param {Lavaca.mvc.Router} router  The router used by the application
     * @param {Lavaca.mvc.ViewManager}  viewManager The view manager used by the application
     * @param {Object} state  A history record object
     * @return {Lavaca.util.Promise}  A promise
     */
    /**
     * Executes this route's controller action see if work
     * @method exec
     *
     * @param {String} url  The URL that supplies parameters to this route
     * @param {Lavaca.mvc.Router} router  The router used by the application
     * @param {Lavaca.mvc.ViewManager}  viewManager The view manager used by the application
     * @param {Object} state  A history record object
     * @param {Object} params  Additional parameters to pass to the controller action
     * @return {Lavaca.util.Promise}  A promise
     */
    exec: function(url, router, viewManager, state, params) {
      var controller = new this.TController(router, viewManager),
          urlParams = this.parse(url),
          promise = controller.exec(this.action, merge(urlParams, params), state);
      function dispose() {
        delay(controller.dispose, controller);
      }
      promise.then(dispose, dispose);
      return promise;
    }
  });

  return Route;

});

define('lavaca/mvc/Router',['require','./Route','lavaca/net/History','lavaca/util/Disposable','lavaca/util/Promise'],function(require) {

  var Route = require('./Route'),
      History = require('lavaca/net/History'),
      Disposable = require('lavaca/util/Disposable'),
      Promise = require('lavaca/util/Promise');

  /**
   * @class lavaca.mvc.Router
   * @extends lavaca.util.Disposable
   * URL manager
   *
   * @constructor
   * @param {Lavaca.mvc.ViewManager} viewManager  The view manager
   */
  var Router = Disposable.extend(function(viewManager) {
    Disposable.call(this);
    /**
     * @field {Array} routes
     * @default []
     * The [[Lavaca.mvc.Route]]s used by this router
     */
    this.routes = [];
    /**
     * @field {Lavaca.mvc.ViewManager} viewManager
     * @default null
     * The view manager used by this router
     */
    this.viewManager = viewManager;

  }, {
    /**
     * @field {Boolean} locked
     * @default false
     * When true, the router is prevented from executing a route
     */
    locked: false,
    /**
     * @field {Boolean} hasNavigated
     * @default false
     * Whether or not this router has been used to navigate
     */
    hasNavigated: false,

    startHistory: function() {
      this.onpopstate = function(e) {
        if (this.hasNavigated) {
          History.isRoutingBack = e.direction === 'back';
          this.exec(e.url, e).always(function() {
            History.isRoutingBack = false;
          });
        }
      };
      History.on('popstate', this.onpopstate, this);
    },
    /**
     * Sets the viewManager property on the instance which is the view manager used by this router
     * @method setEl
     *
     * @param {Lavaca.mvc.ViewManager} viewManager
     * @return {Lavaca.mvc.Router}  This Router instance
     */
    setViewManager: function(viewManager) {
      this.viewManager = viewManager;
      return this;
    },
    /**
     * Adds multiple routes
     * @method add
     *
     * @param {Object} map  A hash in the form {pattern: [TController, action, params]}
     *   or {pattern: {controller: TController, action: action, params: params}
     * @return {Lavaca.mvc.Router}  The router (for chaining)
     */
    /**
     * Adds a route
     * @method add
     *
     * @param {String} pattern  The route URL pattern
     * @param {Function} TController  The type of controller to perform the action (should derive from [[Lavaca.mvc.Controller]])
     * @param {String} action  The name of the controller method to call
     * @return {Lavaca.mvc.Router}  The router (for chaining)
     */
    /**
     * Adds a route
     * @method add
     *
     * @param {String} pattern  The route URL pattern
     * @param {Function} TController  The type of controller to perform the action (should derive from [[Lavaca.mvc.Controller]])
     * @param {String} action  The name of the controller method to call
     * @param {Object} params  Key-value pairs that will be passed to the action
     * @return {Lavaca.mvc.Router}  The router (for chaining)
     */
    add: function(pattern, TController, action, params) {
      if (typeof pattern === 'object') {
        for (var p in pattern) {
          var args = pattern[p];
          if (args instanceof Array) {
            TController = args[0];
            action = args[1];
            params = args[2];
          } else {
            TController = args.controller;
            action = args.action;
            params = args.params;
          }
          this.add(p, TController, action, params);
        }
      } else {
        this.routes.push(new Route(pattern, TController, action, params));
      }
      return this;
    },
    /**
     * Executes the action for a given URL
     * @method exec
     *
     * @param {String} url  The URL
     * @return {Lavaca.util.Promise}  A promise
     */
    /**
     * Executes the action for a given URL
     * @method exec
     *
     * @param {String} url  The URL
     * @param {Object} state  A history record object
     * @return {Lavaca.util.Promise}  A promise
     */
    /**
     * Executes the action for a given URL
     * @method exec
     *
     * @param {String} url  The URL
     * @param {Object} state  A history record object
     * @param {Object} params  Additional parameters to pass to the route
     * @return {Lavaca.util.Promise}  A promise
     */
    exec: function(url, state, params) {
      if (this.locked) {
        return (new Promise(this)).reject('locked');
      } else {
        this.locked = true;
      }
      if (!url) {
        url = '/';
      }
      if (url.indexOf('http') === 0) {
        url = url.replace(/^http(s?):\/\/.+?/, '');
      }
      var i = -1,
          route,
          promise = new Promise(this);
      promise.always(function() {
        this.unlock();
      });
      if (!this.hasNavigated) {
        promise.success(function() {
          this.hasNavigated = true;
        });
      }
      while (!!(route = this.routes[++i])) {
        if (route.matches(url)) {
          return promise.when(route.exec(url, this, this.viewManager, state, params));
        }
      }
      return promise.reject(url, state);
    },
    /**
     * Unlocks the router so that it can be used again
     * @method unlock
     *
     * @return {Lavaca.mvc.Router}  This router (for chaining)
     */
    unlock: function() {
      this.locked = false;
      return this;
    },
    /**
     * Readies the router for garbage collection
     * @method dispose
     */
    dispose: function() {
      if (this.onpopstate) {
        History.off('popstate', this.onpopstate);
        this.onpopstate = null;
      }
      Disposable.prototype.dispose.apply(this, arguments);
    }
  });

  return new Router();

});

define('lavaca/mvc/View',['require','$','lavaca/events/EventDispatcher','lavaca/mvc/Model','lavaca/ui/Template','lavaca/util/Cache','lavaca/util/Promise','lavaca/util/log','lavaca/util/uuid'],function(require) {

  var $ = require('$'),
    EventDispatcher = require('lavaca/events/EventDispatcher'),
    Model = require('lavaca/mvc/Model'),
    Template = require('lavaca/ui/Template'),
    Cache = require('lavaca/util/Cache'),
    Promise = require('lavaca/util/Promise'),
    log = require('lavaca/util/log'),
    uuid = require('lavaca/util/uuid');




  /**
   * Base View Class
   * @class lavaca.mvc.View
   * @extends lavaca.events.EventDispatcher
   * @constructor
   * @param {Object | String} el the selector or Object for the element to attach to the view
   * @param {Object} [model] the model for the view
   * @param {Object} [parentView] the parent view for the view
   *
   *
   */
  var View = EventDispatcher.extend(function(el, model, parentView) {
    EventDispatcher.call(this);

    /**
     * The model used by the view
     * @property model
     * @default null
     * @optional
     * @type lavaca.mvc.Model
     *
     */
    this.model = model || null;

    /**
     * An id is applied to a data property on the views container
     * @property id
     * @default generated from className and unique identifier
     * @type String
     *
     */
    this.id = this.className + '-' + uuid();

    /**
     * If the view is created in the context of a childView, the parent view is assigned to this view
     * @property parentView
     * @default null
     * @type Object
     *
     */
    this.parentView = parentView || null;

    /**
     * The element that is either assigned to the view if in the context of a childView, or is created for the View
     * if it is a PageView
     * @property el
     * @default null
     * @type Object | String
     *
     */
    this.el = typeof el === 'string' ? $(el) : (el || null);

    /**
     * A dictionary of selectors and event types in the form
     * {eventType: {delegate: 'xyz', callback: func}}@property el
     * @property eventMap
     * @default {}
     * @type Object
     */
    this.eventMap = {};
    /**
     * A dictionary of selectors, View types and models in the form
     *   {selector: {TView: TView, model: model}}}
     * @property {Object} childViewMap
     * @default {}
     * @type Object
     *
     */
    this.childViewMap = {};
    /**
     * Interactive elements used by the view
     * @property childViews
     * @default lavaca.util.cache
     * @type lavaca.util.Cache
     */
    this.childViews = new Cache();
    /**
     * A dictionary of selectors and widget types in the form
     *   {selector: widgetType}
     * @property {Object} widgetMap
     * @default {}
     * @type Object
     */
    this.widgetMap = {};
    /**
     * Interactive elements used by the view
     * @property widgets
     * @default lavaca.util.Cache
     * @type lavaca.util.Cache
     */
    this.widgets = new Cache();
    /**
     *  A map of all the events to be applied to child Views in the form of
     *  {type: {TView: TView, callback : callback}}
     * @property childViewEventMap
     * @default Object
     * @type Object
     */
    this.childViewEventMap = {};

    this
      .on('rendersuccess', this.onRenderSuccess)
      .on('rendererror', this.onRenderError);

    if (this.autoRender) {
      this.render();
    }
  }, {
    /**
     * The element associated with the view
     * @property {jQuery} el
     * @default null
     *
     */
    el: null,
    /**
     * The name of the template associated with the view
     * @property {String} template
     * @default null
     *
     */
    template: null,
    /**
     * A class name added to the view container
     * @property String className
     * @default null
     *
     */
    className: null,
    /**
     * Will render any childViews automatically when set to true
     * @property autoRender
     * @default false
     *
     * @type Boolean
     */
    autoRender: false,
    /**
     * Renders the view using its template and model
     * @method render
     *
     *
     *
     * @return {lavaca.util.Promise} A promise
     */
    render: function() {
      var self = this,
        promise = new Promise(this),
        renderPromise = new Promise(this),
        template = Template.get(this.template),
        model = this.model;
      if (model instanceof Model) {
        model = model.toObject();
      }
      /**
       * Fires when html from template has rendered
       * @event rendersuccess
       */
      promise
        .success(function(html) {
          this.trigger('rendersuccess', {html: html});
          renderPromise.resolve();
        })
      /**
       * Fired when there was an error during rendering process
       * @event rendererror
       */
        .error(function(err) {
          this.trigger('rendererror', {err: err});
          renderPromise.reject();
        });
      template
        .render(model)
        .success(promise.resolver())
        .error(promise.rejector())
        .then(function() {
          if (self.className){
            self.el.addClass(self.className);
          }
        });

      return renderPromise;
    },

    /**
     * Re-renders the view's template and replaces the DOM nodes that match
     * the selector argument. If no selector argument is provided, the whole view
     * will be re-rendered. If the first parameter is passed as <code>false</code>
     * the resulting html will pe passed with the promise and nothing will be replaced.
     * Note: the number of elements that match the provided selector must be identical
     * in the current markup and in the newly rendered markup or else the returned
     * promise will be rejected.
     * Re-renders the view's template using the view's model
     * and redraws the entire view
     * @method redraw
     *
     * @return {lavaca.util.Promise} A promise
     */
    /**
     * Re-renders the view's template using the specified model
     * and redraws the entire view
     * @method redraw
     * @param {Object} model  The data model to be passed to the template
     * @return {lavaca.util.Promise} A promise
     */
    /**
     * Re-renders the view's template using the view's model and only redraws the
     * elements that match the specified selector string.
     * Note: The numbers of items that match the selector must
     * be exactly the same in the view's current markup and in the newly rendered
     * markup. If that is not the case, the returned promise will be rejected and
     * nothing will be redrawn.
     * @method redraw
     * @param {String} selector  Selector string that defines elements to redraw
     * @return {lavaca.util.Promise} A promise
     */
    /**
     * Re-renders the view's template using the specified model and only redraws the
     * elements that match the specified selector string.
     * Note: The numbers of items that match the selector must
     * be exactly the same in the view's current markup and in the newly rendered
     * markup. If that is not the case, the returned promise will be rejected and
     * nothing will be redrawn.
     * @method redraw
     * @param {String} selector  Selector string that defines elements that will be updated
     * @param {Object} model  The data model to be passed to the template
     * @return {lavaca.util.Promise} A promise
     */
    /**
     * Re-renders the view's template using the view's model. If shouldRedraw is true,
     * the entire view will be redrawn. If shouldRedraw is false, nothing will be redrawn,
     * but the returned promise will be resolved with the newly rendered content. This allows
     * the caller to attach a success handler to the returned promise and define their own
     * redrawing behavior.
     * @method redraw
     * @param {Boolean} shouldRedraw  Whether the view should be automatically redrawn.
     * @return {lavaca.util.Promise}  A promise
     */
    /**
     * Re-renders the view's template using the specified model. If shouldRedraw is true,
     * the entire view will be redrawn. If shouldRedraw is false, nothing will be redrawn,
     * but the returned promise will be resolved with the newly rendered content. This allows
     * the caller to attach a success handler to the returned promise and define their own
     * redrawing behavior.
     * @method redraw
     * @param {Boolean} shouldRedraw  Whether the view should be automatically redrawn.
     * @param {Object} model  The data model to be passed to the template
     * @return {lavaca.util.Promise}  A promise
     */
    redraw: function(selector, model) {
      var self = this,
        templateRenderPromise = new Promise(this),
        redrawPromise = new Promise(this),
        template = Template.get(this.template),
        replaceAll;
      if (typeof selector === 'object' || selector instanceof Model) {
        model = selector;
        replaceAll = true;
        selector = null;
      }
      else if (typeof selector === 'boolean') {
        replaceAll = selector;
        selector = null;
      } else if (!selector) {
        replaceAll = true;
      }
      model = model || this.model;
      if (model instanceof Model) {
        model = model.toObject();
      }

      // process widget, child view, and
      // child view event maps
      function processMaps() {
        self.createWidgets();
        self.createChildViews();
        self.applyChildViewEvents();
      }
      templateRenderPromise
        .success(function(html) {
          if (replaceAll) {
            this.disposeChildViews(this.el);
            this.disposeWidgets(this.el);
            this.el.html(html);
            processMaps();
            redrawPromise.resolve(html);
            return;
          }
          if(selector) {
            var $newEl = $('<div>' + html + '</div>').find(selector),
              $oldEl = this.el.find(selector);
            if($newEl.length === $oldEl.length) {
              $oldEl.each(function(index) {
                var $el = $(this);
                self.disposeChildViews($el);
                self.disposeWidgets($el);
                $el.replaceWith($newEl.eq(index)).remove();
              });
              processMaps();
              redrawPromise.resolve(html);
            } else {
              redrawPromise.reject('Count of items matching selector is not the same in the original html and in the newly rendered html.');
            }
          } else {
            redrawPromise.resolve(html);
          }
        })
        .error(redrawPromise.rejector());
      template
        .render(model)
        .success(templateRenderPromise.resolver())
        .error(templateRenderPromise.rejector());
      return redrawPromise;
    },

    /**
     * Dispose old widgets and child views
     * @method disposeChildViews
     * @param  {Object} $el the $el to search for child views and widgets in
     */
    disposeChildViews: function ($el) {
      var childViewSearch,
        self = this;

      // Remove child views
      childViewSearch = $el.find('[data-view-id]');
      if ($el !== self.el && $el.is('[data-view-id]')) {
        childViewSearch = childViewSearch.add($el);
      }
      childViewSearch.each(function(index, item) {
        var $item = $(item),
          childView = $item.data('view');

        self.childViews.remove(childView.id);
        childView.dispose();
      });
    },
    /**
     * Dispose old widgets and child views
     * @method disposeWidgets
     * @param  {Object} $el the $el to search for child views and widgets in
     */
    disposeWidgets: function ($el) {
      var self = this;

      // Remove widgets
      $el.add($el.find('[data-has-widgets]')).each(function(index, item) {
        var $item = $(item),
          widgets = $item.data('widgets'),
          selector, widget;
        for (selector in widgets) {
          widget = widgets[selector];
          self.widgets.remove(widget.id);
          widget.dispose();
        }
      });
      $el.removeData('widgets');
    },
    /**
     * Unbinds events from the model
     * @method clearModelEvents
     *
     */
    clearModelEvents: function() {
      var type,
        callback,
        dotIndex;
      if (this.eventMap
        && this.eventMap.model
        && this.model
        && this.model instanceof EventDispatcher) {
        for (type in this.eventMap.model) {
          callback = this.eventMap.model[type];
          if (typeof callback === 'object') {
            callback = callback.on;
          }
          dotIndex = type.indexOf('.');
          if (dotIndex !== -1) {
            type = type.substr(0, dotIndex);
          }
          this.model.off(type, callback);
        }
      }
    },
    /**
     * Checks for strings in the event map to bind events to this automatically
     * @method bindMappedEvents
     */
    bindMappedEvents: function() {
      var callbacks,
        delegate,
        type;
      for (delegate in this.eventMap) {
        callbacks = this.eventMap[delegate];
        for (type in callbacks) {
          if (typeof this.eventMap[delegate][type] === 'string'){
            this.eventMap[delegate][type] = this[this.eventMap[delegate][type]].bind(this);
          }
        }
      }
    },
    /**
     * Binds events to the view
     * @method applyEvents
     *
     */
    applyEvents: function() {
      var el = this.el,
        callbacks,
        callback,
        property,
        delegate,
        type,
        dotIndex,
        opts;
      for (delegate in this.eventMap) {
        callbacks = this.eventMap[delegate];
        if (delegate === 'self') {
          delegate = null;
        }
        for (type in callbacks) {
          callback = callbacks[type];
          if (typeof callback === 'object') {
            opts = callback;
            callback = callback.on;
          } else {
            opts = undefined;
          }
          if (typeof callback === 'string') {
            if (callback in this) {
              callback = this[callback].bind(this);
            }
          }
          if (delegate === 'model') {
            if (this.model && this.model instanceof Model) {
              dotIndex = type.indexOf('.');
              if (dotIndex !== -1) {
                property = type.substr(dotIndex+1);
                type = type.substr(0, dotIndex);
              }
              this.model.on(type, property, callback, this);
            }
          } else if (type === 'animationEnd' && el.animationEnd) {
            el.animationEnd(delegate, callback);
          } else if (type === 'transitionEnd' && el.transitionEnd) {
            el.transitionEnd(delegate, callback);
          } else {
            el.on(type, delegate, callback);
          }
        }
      }
    },
    /**
     * Maps multiple delegated events for the view
     * @method mapEvent
     *
     * @param {Object} map  A hash of the delegates, event types, and handlers
     *     that will be bound when the view is rendered. The map should be in
     *     the form <code>{delegate: {eventType: callback}}</code>. For example,
     *     <code>{'.button': {click: onClickButton}}</code>. The events defined in
     *     [[Lavaca.fx.Animation]] and [[Lavaca.fx.Transition]] are also supported.
     *     To map an event to the view's el, use 'self' as the delegate. To map
     *     events to the view's model, use 'model' as the delegate. To limit events
     *     to only a particular property on the model, use a period-seperated
     *     syntax such as <code>{model: {'change.myproperty': myCallback}}</code>
     * @return {lavaca.mvc.View}  This view (for chaining)
     */
    /**
     * Maps an event for the view
     * @method mapEvent
     * @param {String} delegate  The element to which to delegate the event
     * @param {String} type  The type of event
     * @param {Function} callback  The event handler
     * @return {lavaca.mvc.View}  This view (for chaining)
     */
    mapEvent: function(delegate, type, callback) {
      var o;
      if (typeof delegate === 'object') {
        o = delegate;
        for (delegate in o) {
          for (type in o[delegate]) {
            this.mapEvent(delegate, type, o[delegate][type]);
          }
        }
      } else {
        o = this.eventMap[delegate];
        if (!o) {
          o = this.eventMap[delegate] = {};
        }
        o[type] = callback;
      }
      return this;
    },
    /**
     * Initializes widgets on the view
     * @method createWidgets
     *
     */
    createWidgets: function() {
      var cache = this.widgets,
        n,
        o;
      for (n in this.widgetMap) {
        o = this.widgetMap[n];
        (n === 'self' ? this.el : this.el.find(n))
          .each(function(index, item) {
            var $el = $(item),
              widgetMap = $el.data('widgets') || {},
              widget;
            if (!widgetMap[n]) {
              widget = new o($(item));
              widgetMap[n] = widget;
              cache.set(widget.id, widget);
              $el.data('widgets', widgetMap);
              $el.attr('data-has-widgets','');
            }
          });
      }
    },
    /**
     * Assigns multiple widget types to elements on the view
     * @method mapWidget
     * @param {Object} map  A hash of selectors to widget types to be bound when the view is rendered.
     *     The map should be in the form {selector: TWidget}. For example, {'form': Lavaca.ui.Form}
     * @return {Lavaca.mvc.View}  This view (for chaining)
     *
     */
    /**
     * Assigns a widget type to be created for elements matching a selector when the view is rendered
     * @method mapWidget
     * @param {String} selector  The selector for the root element of the widget
     * @param {Function} TWidget  The [[Lavaca.ui.Widget]]-derived type of widget to create
     * @return {Lavaca.mvc.View}  This view (for chaining)
     */
    mapWidget: function(selector, TWidget) {
      if (typeof selector === 'object') {
        var widgetTypes = selector;
        for (selector in widgetTypes) {
          this.mapWidget(selector, widgetTypes[selector]);
        }
      } else {
        this.widgetMap[selector] = TWidget;
      }
      return this;
    },
    /**
     * Initializes child views on the view, called from onRenderSuccess
     * @method createChildViews
     *
     */
    createChildViews: function() {
      var cache = this.childViews,
        n,
        self = this,
        o;
      for (n in this.childViewMap) {
        o = this.childViewMap[n];
        this.el.find(n)
          .each(function(index, item) {
            var $el = $(item),
              childView;
            if (!$el.data('view')) {
              childView = new o.TView($el, o.model || self.model, self);
              cache.set(childView.id, childView);
            }
          });
      }
    },
    /**
     * Assigns multiple Views to elements on the view
     * @method mapChildView
     * @param {Object} map  A hash of selectors to view types and models to be bound when the view is rendered.
     *     The map should be in the form {selector: {TView : TView, model : lavaca.mvc.Model}}. For example, {'form': {TView : lavaca.mvc.ExampleView, model : lavaca.mvc.Model}}
     * @return {lavaca.mvc.View}  This view (for chaining)
     *
     * Assigns a View type to be created for elements matching a selector when the view is rendered
     * @method mapChildView
     * @param {String} selector  The selector for the root element of the View
     * @param {Function} TView  The [[Lavaca.mvc.View]]-derived type of view to create
     * @param {Function} model  The [[Lavaca.mvc.Model]]-derived model instance to use in the child view
     * @return {Lavaca.mvc.View}  This view (for chaining)
     */
    mapChildView: function(selector, TView, model) {
      if (typeof selector === 'object') {
        var childViewTypes = selector;
        for (selector in childViewTypes) {
          this.mapChildView(selector, childViewTypes[selector].TView, childViewTypes[selector].model);
        }
      } else {
        this.childViewMap[selector] = { TView: TView, model: model };
      }
      return this;
    },

    /**
     * Listen for events triggered from child views.
     * @method mapChildViewEvent
     *
     * @param {String} type The type of event to listen for
     * @param {Function} callback The method to execute when this event type has occured
     * @param {Lavaca.mvc.View} TView (Optional) Only listen on child views of this type
     */
    /**
     * Maps multiple child event types
     * @method mapChildViewEvent
     *
     * @param {Object} map A hash of event types with callbacks and TView's associated with that type
     *  The map should be in the form {type : {callback : {Function}, TView : TView}}
     */
    mapChildViewEvent: function(type, callback, TView) {
      if (typeof type === 'object'){
        var eventTypes = type;
        for (type in eventTypes){
          //add in view type to limit events created
          this.mapChildViewEvent(type, eventTypes[type].callback, eventTypes[type].TView);
        }
      } else {
        this.childViewEventMap[type] = {
          TView: TView,
          callback: callback
        };
      }
    },

    /**
     * Called from onRenderSuccess of the view, adds listeners to all childviews if present
     * @method applyChildViewEvent
     *
     */
    applyChildViewEvents: function() {
      var childViewEventMap = this.childViewEventMap,
        type;
      for (type in childViewEventMap) {
        this.childViews.each(function(key, item) {
          var callbacks,
            callback,
            i = -1;

          if (!childViewEventMap[type].TView || item instanceof childViewEventMap[type].TView) {
            callbacks = item.callbacks[type] || [];
            while (!!(callback = callbacks[++i])) {
              if (callback === childViewEventMap[type].callback) {
                return;
              }
            }
            item.on(type, childViewEventMap[type].callback);
          }
        });
      }
    },
    /**
     * Executes when the template renders successfully
     * @method onRenderSuccess
     *
     * @param {Event} e  The render event. This object should have a string property named "html"
     *   that contains the template's rendered HTML output.
     */
    onRenderSuccess: function(e) {
      this.el.html(e.html);
      this.bindMappedEvents();
      this.applyEvents();
      this.createWidgets();
      this.createChildViews();
      this.applyChildViewEvents();
      this.el.data('view', this);
      this.el.attr('data-view-id', this.id);
      this.hasRendered = true;
    },
    /**
     * Executes when the template fails to render
     * @method onRenderError
     *
     * @param {Event} e  The error event. This object should have a string property named "err"
     *   that contains the error message.
     */
    onRenderError: function(e) {
      log(e.err);
    },
    /**
     * Readies the view for garbage collection
     * @method dispose
     */
    dispose: function() {
      if (this.model) {
        this.clearModelEvents();
      }
      if (this.childViews.count()) {
        this.disposeChildViews(this.el);
      }
      if (this.widgets.count()) {
        this.disposeWidgets(this.el);
      }

      // Do not dispose of template or model
      this.template
        = this.model
        = this.parentView
        = null;

      EventDispatcher.prototype.dispose.apply(this, arguments);
    }
  });

  return View;

});

define('lavaca/mvc/ViewManager',['require','$','lavaca/mvc/PageView','lavaca/util/ArrayUtils','lavaca/util/Cache','lavaca/util/Disposable','lavaca/util/Promise','lavaca/util/delay','mout/object/merge','lavaca/net/History'],function(require) {

  var $ = require('$'),
      PageView = require('lavaca/mvc/PageView'),
      ArrayUtils = require('lavaca/util/ArrayUtils'),
      Cache = require('lavaca/util/Cache'),
      Disposable = require('lavaca/util/Disposable'),
      Promise = require('lavaca/util/Promise'),
      delay = require('lavaca/util/delay'),
      merge = require('mout/object/merge'),
      History = require('lavaca/net/History');

  /**
   * Manager responsible for drawing views
   * @class lavaca.mvc.ViewManager
   * @extends lavaca.util.Disposable
   *
   * @constructor
   * @param {jQuery} el  The element that contains all layers
   */
  var ViewManager = Disposable.extend(function(el) {
    Disposable.call(this);
    /**
    * The element that contains all view layers
     * @property {jQuery} el
     * @default null
     */
    this.el = $(el || document.body);
    /**
     * A cache containing all views
     * @property {Lavaca.util.Cache} views
     * @default new Lavaca.util.Cache()
     */
    this.pageViews = new Cache();
    /**
     * A list containing all layers
     * @property {Array} layers
     * @default []
     */
    this.layers = [];
    /**
     * A list containing all views that are currently exiting
     * @property {Array} exitingPageViews
     * @default []
     */
    this.exitingPageViews = [];
    /**
     * A list containing all views that are currently entering
     * @property {Array} enteringPageViews
     * @default []
     */
    this.enteringPageViews = [];
  }, {
    /**
     * When true, the view manager is prevented from loading views.
     * @property {Boolean} locked
     * @default false
     */
    locked: false,
    /**
     * Sets the el property on the instance
     * @method setEl
     *
     * @param {jQuery} el  A jQuery object of the element that contains all layers
     * @return {Lavaca.mvc.ViewManager}  This View Manager instance
     */
    /**
     * Sets the el property on the instance
     * @method setEl
     *
     * @param {String} el  A CSS selector matching the element that contains all layers
     * @return {Lavaca.mvc.ViewManager}  This View Manager instance
     */
    setEl: function(el) {
      this.el = typeof el === 'string' ? $(el) : el;
      return this;
    },
    /**
     * Loads a view
     * @method load
     *
     * @param {String} cacheKey  The cache key associated with the view
     * @param {Function} TPageView  The type of view to load (should derive from [[Lavaca.mvc.View]])
     * @param {Object} model  The views model
     * @param {Number} layer  The index of the layer on which the view will sit
     * @return {Lavaca.util.Promise}  A promise
     */
    /**
     * Loads a view
     * @method load
     *
     * @param {String} cacheKey  The cache key associated with the view
     * @param {Function} TPageView  The type of view to load (should derive from [[Lavaca.mvc.View]])
     * @param {Object} model  The views model
     * @param {Object} params  Parameters to be mapped to the view
     * @return {Lavaca.util.Promise}  A promise
     */
    load: function(cacheKey, TPageView, model, params) {
      if (this.locked) {
        return (new Promise(this)).reject('locked');
      } else {
        this.locked = true;
      }
      params = params || {};
      var self = this,
          layer = layer || 0,
          pageView = this.pageViews.get(cacheKey),
          promise = new Promise(this),
          enterPromise = new Promise(promise),
          renderPromise = null,
          exitPromise = null;
      promise.always(function() {
        this.locked = false;
      });
      if (typeof params === 'number') {
        layer = params;
      } else if (params.layer) {
        layer = params.layer;
      }
      if (!pageView) {
        if (History.isRoutingBack && self.layers[layer] instanceof TPageView) {
          pageView = self.layers[layer];
        } else {
          pageView = new TPageView(null, model, layer);
          if (typeof params === 'object') {
            merge(pageView, params);
          }
          renderPromise = pageView.render();
          if (cacheKey !== null) {
            this.pageViews.set(cacheKey, pageView);
            pageView.cacheKey = cacheKey;
          }
        }
      }
      function lastly() {
        self.enteringPageViews = [pageView];
        promise.success(function() {
          delay(function() {
            self.enteringPageViews = [];
          });
        });
        exitPromise = self.dismissLayersAbove(layer - 1, pageView);
        if (self.layers[layer] !== pageView) {
          enterPromise
            .when(pageView.enter(self.el, self.exitingPageViews), exitPromise)
            .then(promise.resolve);
          self.layers[layer] = pageView;
        } else {
          promise.when(exitPromise);
        }
      }
      if (renderPromise) {
        renderPromise.then(lastly, promise.rejector());
      } else {
        lastly();
      }
      return promise;
    },
    /**
     * Removes all views on a layer
     * @method dismiss
     *
     * @param {Number} index  The index of the layer to remove
     */
    /**
     * Removes all views on a layer
     * @method dismiss
     *
     * @param {jQuery} el  An element on the layer to remove (or the layer itself)
     */
    /**
     * Removes all views on a layer
     * @method dismiss
     *
     * @param {Lavaca.mvc.View} view  The view on the layer to remove
     */
    dismiss: function(layer) {
      if (typeof layer === 'number') {
        this.dismissLayersAbove(layer - 1);
      } else if (layer instanceof PageView) {
        this.dismiss(layer.layer);
      } else {
        layer = $(layer);
        var index = layer.attr('data-layer-index');
        if (index === null) {
          layer = layer.closest('[data-layer-index]');
          index = layer.attr('data-layer-index');
        }
        if (index !== null) {
          this.dismiss(Number(index));
        }
      }
    },
    /**
     * Removes all layers above a given index
     * @method dismissLayersAbove
     *
     * @param {Number}  index The index above which to clear
     * @return {Lavaca.util.Promise}  A promise
     */
    /**
     * Removes all layers above a given index
     * @method dismissLayersAbove
     *
     * @param {Number} index  The index above which to clear
     * @param {Lavaca.mvc.View}  exceptForView A view that should not be dismissed
     * @return {Lavaca.util.Promise}  A promise
     */
    dismissLayersAbove: function(index, exceptForView) {
      var promise = new Promise(this),
          dismissedLayers = false,
          i,
          layer;
      for (i = this.layers.length - 1; i > index; i--) {
        if ((layer = this.layers[i]) && (!exceptForView || exceptForView !== layer)) {
          (function(layer) {
            this.exitingPageViews.push(layer);
            promise
              .when(layer.exit(this.el, this.enteringPageViews))
              .success(function() {
                delay(function() {
                  ArrayUtils.remove(this.exitingPageViews, layer);
                  if (!layer.cacheKey || (exceptForView && exceptForView.cacheKey === layer.cacheKey)) {
                    layer.dispose();
                  }
                }, this);
              });
            this.layers[i] = null;
          }).call(this, layer);
          dismissedLayers = true;
        }
      }
      if (!dismissedLayers) {
        promise.resolve();
      }
      return promise;
    },
    /**
     * Empties the view cache
     * @method flush
     */
    flush: function(cacheKey) {
      // Don't dispose of any views that are currently displayed
      //flush individual cacheKey
      if (cacheKey){
        this.pageViews.remove(cacheKey);
      } else {
        var i = -1,
          layer;
        while (!!(layer = this.layers[++i])) {
          if (layer.cacheKey) {
            this.pageViews.remove(layer.cacheKey);
          }
        }
        this.pageViews.dispose();
        this.pageViews = new Cache();
      }
    },
    /**
     * Readies the view manager for garbage collection
     * @method dispose
     */
    dispose: function() {
      Disposable.prototype.dispose.call(this);
    }
  });

  return new ViewManager(null);

});

define('lavaca/net/Connectivity',['require','$','lavaca/util/Promise','lavaca/util/resolve'],function(require) {

  var $ = require('$'),
      Promise = require('lavaca/util/Promise'),
      resolve = require('lavaca/util/resolve');

  /**
   * A utility type for working under different network connectivity situatioConnectivity.
   * @class lavaca.net.Connectivity
   */

  var _navigatorOnlineSupported = typeof navigator.onLine === 'boolean',
      _offlineAjaxHandlers = [],
      _offlineErrorCode = 'offline';

  function _onAjaxError(arg) {
    if (arg === _offlineErrorCode) {
      var i = -1,
          callback;
      while (!!(callback = _offlineAjaxHandlers[++i])) {
        callback(arg);
      }
    }
  }

  var Connectivity = {};

  /**
   * Attempts to detect whether or not the browser is connected
   * @method isOffline
   * @static
   *
   * @return {Boolean}  True if the browser is offline; false if the browser is online
   *    or if connection status cannot be determined
   */
  Connectivity.isOffline = function() {
    var connectionType = resolve('navigator.connection.type');
    if (connectionType !== null) {
      return connectionType === resolve('Connection.NONE');
    } else {
      return _navigatorOnlineSupported ? !navigator.onLine : false;
    }
  };

  /**
   * Makes an AJAX request if the user is online. If the user is offline, the returned
   * promise will be rejected with the string argument "offline"
   * @method ajax
   * @static
   *
   * @param {Object} opts  jQuery-style AJAX options
   * @return {Lavaca.util.Promise}  A promise
   */
  Connectivity.ajax = function(opts) {
    var promise = new Promise(),
        origSuccess = opts.success,
        origError = opts.error;
    opts.success = function() {
      if (origSuccess) {
        origSuccess.apply(this, arguments);
      }
      promise.resolve.apply(promise, arguments);
    };
    opts.error = function() {
      if (origError) {
        origError.apply(this, arguments);
      }
      promise.reject.apply(promise, arguments);
    };
    if (Connectivity.isOffline()) {
      promise.reject(_offlineErrorCode);
    } else {
      $.ajax(opts);
    }
    promise.error(_onAjaxError);
    return promise;
  };

  /**
   * Adds a callback to be executed whenever any Lavaca.net.Connectivity.ajax() call is
   * blocked as a result of a lack of internet connection.
   * @method registerOfflineAjaxHandler
   * @static
   *
   * @param {Function} callback  The callback to execute
   */
  Connectivity.registerOfflineAjaxHandler = function(callback) {
    _offlineAjaxHandlers.push(callback);
  };

  return Connectivity;

});

define('lavaca/net/History',['require','lavaca/events/EventDispatcher','lavaca/util/uuid'],function(require) {

  var EventDispatcher = require('lavaca/events/EventDispatcher'),
      uuid = require('lavaca/util/uuid');

  var _isAndroid = navigator.userAgent.indexOf('Android') > -1,
      _standardsMode = !_isAndroid && typeof history.pushState === 'function',
      _hasPushed = false,
      _lastHash,
      _hist,
      _currentId,
      _pushCount = 0;

  function _insertState(hist, position, id, state, title, url) {
    hist.position = position;
    var record = {
          id: id,
          state: state,
          title: title,
          url: url
        };
    hist.sequence[position] = record;
    location.hash = _lastHash = url + '#@' + id;
    return record;
  }

  /**
   * HTML5 history abstraction layer
   * @class lavaca.net.History
   * @extends lavaca.events.EventDispatcher
   *
   * @event popstate
   *
   * @constructor
   */
  var History = EventDispatcher.extend(function() {
    EventDispatcher.call(this);
    /**
     * A list containing history states generated by the app (not used for HTML5 history)
     * @property {Array} sequence
     */
    this.sequence = [];
    /**
     * The current index in the history sequence (not used for HTML5 history)
     * @property {Number} position
     */
    this.position = -1;
    this.replace({}, document.title, location.pathname);
    var self = this;
    if (_standardsMode) {
      /**
       * Auto-generated callback executed when a history event occurs
       * @property {Function} onPopState
       */
       var self = this;
      this.onPopState = function(e) {
        if (e.state) {
          _pushCount--;
          var previousId = _currentId;
          _currentId = e.state.id;
          self.trigger('popstate', {
            state: e.state.state,
            title: e.state.title,
            url: e.state.url,
            id: e.state.id,
            direction: _currentId > previousId ? 'forward' : 'back'
          });
        }
      };
      window.addEventListener('popstate', this.onPopState, false);
    } else {
      this.onPopState = function() {
        var hash = location.hash,
            code,
            record,
            item,
            previousCode,
            i = -1;
        if (hash) {
          hash = hash.replace(/^#/, '');
        }
        if (hash !== _lastHash) {
          previousCode = _lastHash.split('#@')[1];
          _lastHash = hash;
          if (hash) {
            _pushCount--;
            code = hash.split('#@')[1];
            while (!!(item = self.sequence[++i])) {
              if (item.id === parseInt(code, 10)) {
                record = item;
                self.position = i;
                break;
              }
            }
            if (record) {
              location.hash = record.url + '#@' + record.id;
              document.title = record.title;
              self.trigger('popstate', {
                state: record.state,
                title: record.title,
                url: record.url,
                id: record.id,
                direction: record.id > parseInt(previousCode, 10) ? 'forward' : 'back'
              });
            }
          }
        }
      };
      if (window.attachEvent) {
        window.attachEvent('onhashchange', this.onPopState);
      } else {
        window.addEventListener('hashchange', this.onPopState, false);
      }
    }
  }, {
    /**
     * Retrieve the current history record
     * @method current
     *
     * @return {Object}  The current history record
     */
    current: function() {
      return this.sequence[this.position] || null;
    },
    /**
     * Determines whether or not there are history states
     * @method hasHistory
     *
     * @returns {Boolean} True when there is a history state
     */
    hasHistory: function() {
      return _pushCount > 0;
    },
    /**
     * Adds a record to the history
     * @method push
     *
     * @param {Object} state  A data object associated with the page state
     * @param {String} title  The title of the page state
     * @param {String} url  The URL of the page state
     */
    push: function(state, title, url) {
      _pushCount++;
      if (_hasPushed) {
        document.title = title;
        _currentId = uuid('history');
        if (_standardsMode) {
          history.pushState({state: state, title: title, url: url, id: _currentId}, title, url);
        } else {
          _insertState(this, ++this.position, _currentId, state, title, url);
        }
      } else {
        this.replace(state, title, url);
      }
    },
    /**
     * Replaces the current record in the history
     * @method replace
     *
     * @param {Object} state  A data object associated with the page state
     * @param {String} title  The title of the page state
     * @param {String} url  The URL of the page state
     */
    replace: function(state, title, url) {
      _hasPushed = true;
      document.title = title;
      if (_standardsMode) {
        history.replaceState({state: state, title: title, url: url, id: _currentId}, title, url);
      } else {
        if (this.position < 0) {
          this.position = 0;
        }
        _insertState(this, this.position, typeof _currentId !== 'undefined' ? _currentId : uuid('history'), state, title, url);
      }
    },
    /**
     * Unbind the history object and ready it for garbage collection
     * @method dispose
     */
    dispose: function() {
      if (this.onPopState) {
        if (_standardsMode) {
          window.removeEventListener('popstate', this.onPopState, false);
        } else if (window.detachEvent) {
          window.detachEvent('onhashchange', this.onPopState);
        } else {
          window.removeEventListener('hashchange', this.onPopState, false);
        }
      }
      EventDispatcher.prototype.dispose.call(this);
    }
  });
  /**
   * Initialize a singleton history abstraction layer
   * @method init
   * @static
   *
   * @return {Lavaca.mvc.History}  The history instance
   */
   /**
   * Initialize a singleton history abstraction layer
   * @method init
   * @static
   *
   * @param {Boolean} useHash  When true, use the location hash to manage history state instead of HTML5 history
   * @return {Lavaca.mvc.History}  The history instance
   */
  History.init = function(useHash) {
    if (!_hist) {
      if (useHash) {
        History.overrideStandardsMode();
      }
      _hist = new History();
    }
    return _hist;
  };
  /**
   * Adds a record to the history
   * @method push
   * @static
   *
   * @param {Object} state  A data object associated with the page state
   * @param {String} title  The title of the page state
   * @param {String} url  The URL of the page state
   */
  History.push = function() {
    History.init().push.apply(_hist, arguments);
  };
  /**
   * Replaces the current record in the history
   * @method replace
   * @static
   *
   * @param {Object} state  A data object associated with the page state
   * @param {String} title  The title of the page state
   * @param {String} url  The URL of the page state
   */
  History.replace = function() {
    History.init().replace.apply(_hist, arguments);
  };
  /**
   * Goes to the previous history state
   * @method back
   * @static
   */
  History.back = function() {
    history.back();
  };
  /**
   * Goes to the next history state
   * @method forward
   * @static
   */
  History.forward = function() {
    history.forward();
  };
  /**
   * Unbind the history object and ready it for garbage collection
   * @method dispose
   * @static
   */
  History.dispose = function() {
    if (_hist) {
      _hist.dispose();
      _hist = null;
    }
  };
  /**
   * Binds an event handler to the singleton history
   * @method on
   * @static
   *
   * @param {String} type  The type of event
   * @param {Function} callback  The function to execute when the event occurs
   * @return {Lavaca.mvc.History}  The history object (for chaining)
   */
  History.on = function() {
    return History.init().on.apply(_hist, arguments);
  };
  /**
   * Unbinds an event handler from the singleton history
   * @method off
   * @static
   *
   * @param {String} type  The type of event
   * @param {Function} callback  The function to stop executing when the
   *    event occurs
   * @return {Lavaca.mvc.History}  The history object (for chaining)
   */
  History.off = function() {
    return History.init().off.apply(_hist, arguments);
  };
  /**
   * Sets Histroy to hash mode
   * @method overrideStandardsMode
   * @static
   */
  History.overrideStandardsMode = function() {
    _standardsMode = false;
  };

  /**
   * Stores the page transition animations so that if you route back, it will animate correctly
   * @property {Array} animationBreadcrumb
   */
  History.animationBreadcrumb = [];

  /**
   * Flag to notify when history back is being called
   * @property {Boolean} isRoutingBack
   */
  History.isRoutingBack = false;

  return History;

});

define('lavaca/storage/Store',['require','lavaca/util/Disposable'],function(require) {

  var Disposable = require('lavaca/util/Disposable');

  function _notImplemented() {
    throw 'Not implemented';
  }

  /**
   * An object for manage local storage
   * @class lavaca.storage.Store
   * @extends lavaca.util.Disposable
   */
  var Store = Disposable.extend(function(id) {
    /**
     * The ID of the store
     * @property {String} id
     */
    this.id = id;
  }, {
    /**
     * Retrieves an object from storage, given its ID
     * @method get
     *
     * @param {String} id  The ID of the stored object
     * @return {Object}  The stored object
     */
    get: function() {
      _notImplemented();
    },
    /**
     * Stores an object locally
     * @method set
     *
     * @param {String} id  The ID of the object to store
     * @param {Object} value  The value to store
     */
    set: function() {
      _notImplemented();
    },
    /**
     * Removes an object from storage
     * @method remove
     *
     * @param {String} id  The ID of the object to remove from storage
     */
    remove: function() {
      _notImplemented();
    },
    /**
     * Retrieves all items in this store
     * @method all
     *
     * @return {Array}  A list of stored objects
     */
    all: function() {
      _notImplemented();
    }
  });

  return Store;

});

/*\
|*|
|*|  :: cookies.js ::
|*|
|*|  A complete cookies reader/writer framework with full unicode support.
|*|
|*|  https://developer.mozilla.org/en-US/docs/DOM/document.cookie
|*|
|*|  This framework is released under the GNU Public License, version 3 or later.
|*|  http://www.gnu.org/licenses/gpl-3.0-standalone.html
|*|
|*|  Syntaxes:
|*|
|*|  * docCookies.setItem(name, value[, end[, path[, domain[, secure]]]])
|*|  * docCookies.getItem(name)
|*|  * docCookies.removeItem(name[, path])
|*|  * docCookies.hasItem(name)
|*|  * docCookies.keys()
|*|
\*/
define('docCookies',[],function() {
  var escape = window.escape;
  var unescape = window.unescape;
  var docCookies = {
    getItem: function (sKey) {
      return unescape(document.cookie.replace(new RegExp("(?:(?:^|.*;\\s*)" + escape(sKey).replace(/[\-\.\+\*]/g, "\\$&") + "\\s*\\=\\s*((?:[^;](?!;))*[^;]?).*)|.*"), "$1")) || null;
    },
    setItem: function (sKey, sValue, vEnd, sPath, sDomain, bSecure) {
      if (!sKey || /^(?:expires|max\-age|path|domain|secure)$/i.test(sKey)) { return false; }
      var sExpires = "";
      if (vEnd) {
        switch (vEnd.constructor) {
          case Number:
            sExpires = vEnd === Infinity ? "; expires=Fri, 31 Dec 9999 23:59:59 GMT" : "; max-age=" + vEnd;
            break;
          case String:
            sExpires = "; expires=" + vEnd;
            break;
          case Date:
            sExpires = "; expires=" + vEnd.toGMTString();
            break;
        }
      }
      document.cookie = escape(sKey) + "=" + escape(sValue) + sExpires + (sDomain ? "; domain=" + sDomain : "") + (sPath ? "; path=" + sPath : "") + (bSecure ? "; secure" : "");
      return true;
    },
    removeItem: function (sKey, sPath) {
      if (!sKey || !this.hasItem(sKey)) { return false; }
      document.cookie = escape(sKey) + "=; expires=Thu, 01 Jan 1970 00:00:00 GMT" + (sPath ? "; path=" + sPath : "");
      return true;
    },
    hasItem: function (sKey) {
      return (new RegExp("(?:^|;\\s*)" + escape(sKey).replace(/[\-\.\+\*]/g, "\\$&") + "\\s*\\=")).test(document.cookie);
    },
    keys: /* optional method: you can safely remove it! */ function () {
      var aKeys = document.cookie.replace(/((?:^|\s*;)[^\=]+)(?=;|$)|^\s*|\s*(?:\=[^;]*)?(?:\1|$)/g, "").split(/\s*(?:\=[^;]*)?;\s*/);
      for (var nIdx = 0; nIdx < aKeys.length; nIdx++) { aKeys[nIdx] = unescape(aKeys[nIdx]); }
      return aKeys;
    }
  };
  return docCookies;
});
define('lavaca/storage/LocalStore',['require','./Store','docCookies','lavaca/util/ArrayUtils'],function(require) {

  var Store = require('./Store'),
      docCookies = require('docCookies'),
      ArrayUtils = require('lavaca/util/ArrayUtils');

  var _isLocalStorageSupported = (function(localStorage) {
    var testKey = 'qeTest';
    if (!localStorage) {
      return false;
    }
    try {
      localStorage.setItem(testKey, '1');
      localStorage.removeItem(testKey);
      return true;
    } catch (error) {
      return false;
    }
  }(window.localStorage));

  var _storage = _isLocalStorageSupported ? localStorage : docCookies;

  function _saveManifest(store) {
    _storage.setItem(store.id + '@manifest', JSON.stringify(store.manifest));
  }

  /**
   * An object for manage local storage
   * @class lavaca.storage.LocalStore
   * @extends lavaca.storage.Store

   */
  var LocalStore = Store.extend(function(id) {
    Store.call(this, id);
     /**
     * A list of keys found in the store
     * @field {Array} manifest
     */
    this.manifest = JSON.parse(_storage.getItem(this.id + '@manifest') || '[]');
  }, {
    /**
     * Generates a storage key
     * @method key
     *
     * @param {String} id  The ID of the item for which to generate a key
     * @return {String}  The key
     */
    key: function(id) {
      return this.id + ':' + id;
    },
    /**
     * Retrieves an object from storage, given its ID
     * @method get
     *
     * @param {String} id  The ID of the stored object
     * @return {Object}  The stored object
     */
    get: function(id) {
      var str = _storage.getItem(this.key(id));
      var obj;
      if (!!str) {
        try {
          obj = JSON.parse(str);
          return obj;
        } catch(e) {
          return str;
        }
      }
      return null;
    },
    /**
     * Stores an object locally
     * @method set
     *
     * @param {String} id  The ID of the object to store
     * @param {Object} value  The value to store
     */
    set: function(id, value) {
      _storage.setItem(this.key(id), JSON.stringify(value));
      ArrayUtils.pushIfNotExists(this.manifest, id);
      _saveManifest(this);
    },
    /**
     * Removes an object from storage
     * @method remove
     *
     * @param {String} id  The ID of the object to remove from storage
     */
    remove: function(id) {
      _storage.removeItem(this.key(id));
      ArrayUtils.remove(this.manifest, id);
      _saveManifest(this);
    },
    /**
     * Retrieves all items in this store
     * @method all
     *
     * @return {Array}  A list of stored objects
     */
    all: function() {
      var result = [],
          i = -1,
          id;
      while (!!(id = this.manifest[++i])) {
        result.push(this.get(id));
      }
      return result;
    }
  });

  return LocalStore;

});

define('lavaca/ui/DustTemplate',['require','dust','lavaca/ui/Template','lavaca/util/Config','lavaca/util/Promise','lavaca/util/StringUtils','lavaca/util/Translation','dust-helpers'],function(require) {

  var dust = require('dust'),
      Template = require('lavaca/ui/Template'),
      Config = require('lavaca/util/Config'),
      Promise = require('lavaca/util/Promise'),
      StringUtils = require('lavaca/util/StringUtils'),
      Translation = require('lavaca/util/Translation');
  require('dust-helpers');

  /**
   * Base type for templates that use the dust engine
   * @class lavaca.ui.DustTemplate
   * @extends lavaca.ui.Template
   *
   * @constructor
   * @param {String} name  The unique name of the template
   * @param {String} src  A URL from which to load the template
   * @param {String} code  The raw string code of the template's body
   */
  var DustTemplate = Template.extend(function() {
    Template.apply(this, arguments);
    var helper = this.prepareHelpers(),
        n;
    if(!dust.helpers) {
      dust.helpers = [];
    }
    for (n in helper) {
      dust.helpers[n] = helper[n];
    }
  }, {
    /**
     * Gets the basis for the template helper object
     * @method prepareHelpers
     *
     * @return {Object}  A map of helper function names to functions
     */
    prepareHelpers: function() {
      return {
        msg: this.helperMsg,
        include: this.helperInclude,
        config: this.helperConfig
      };
    },
    /**
     * Helper function, exposed in dust templates, that uses
     *   [Lavaca.util.Translation] to get localized strings.
     * Accessed as:
     *
     * <dl>
     *
     * <dt>{@msg key="code"/}</dt>
     *   <dd>code&mdash;The key under which the message is stored</dd>
     *
     * <dt>{@msg key="code"}default{/msg}</dt>
     *   <dd>code&mdash;The key under which the message is stored</dd>
     *   <dd>default&mdash;The default markup to display if no translation
     *       is found</dd>
     *
     *
     * <dt>{@msg key="code" locale="en_US"/}</dt>
     *   <dd>code&mdash;The key under which the message is stored</dd>
     *   <dd>locale&mdash;The locale from which to get the message ("en_US")</dd>
     *
     * <dt>{@msg key="code" p0="first" p1=variable /}</dt>
     *   <dd>code&mdash;The key under which the message is stored</dd>
     *   <dd>p0, p1, &hellip; pN&mdash;String format parameters for the message
     *       (See [[Lavaca.util.StringUtils]].format())</dd>
     *
     * </dl>
     *
     * @method helperMsg
     *
     * @param {Object} chunk  Dust chunk
     * @param {Object} context  Dust context
     * @param {Object} bodies  Dust bodies
     * @param {Object} params  Parameters passed to the helper
     * @return {String}  Rendered output
     */
    helperMsg: function(chunk, context, bodies, params) {
      var key = dust.helpers.tap(params.key, chunk, context),
          locale = dust.helpers.tap(params.locale, chunk, context),
          translation = Translation.get(key, locale),
          args = [translation],
          i = -1,
          arg;
      if(!translation) {
        return bodies.block ? chunk.render(bodies.block, context) : chunk;
      }
      arg = params['p' + (++i)];
      while (typeof arg !== 'undefined') {
        args.push(dust.helpers.tap(arg, chunk, context));
        arg = params['p' + (++i)];
      }
      return chunk.write(StringUtils.format.apply(this, args));
    },
    /**
     * Helper function, exposed in dust templates, that uses
     *   [[Lavaca.ui.Template]] to include other templates. Accessed as:
     *
     * <dl>
     *
     * <dt>{@include name="template-name"/}</dt>
     *   <dd>name&mdash;The name under which the template can be referenced</dd>
     *
     * </dl>
     *
     * <strong>Note:</strong> You should always use the include helper instead of
     * the dust.js partial syntax. The dust.js partial syntax may not work as expected.
     *
     * @method helperInclude
     * @param {Object} chunk  Dust chunk
     * @param {Object} context  Dust context
     * @param {Object} bodies  Dust bodies
     * @param {Object} params  Parameters passed to the helper
     * @return {String}  Rendered output
     */
    helperInclude: function(chunk, context, bodies, params) {
      var name = dust.helpers.tap(params.name, chunk, context),
          result;

      // Note that this only works because
      // dust renders are synchronous so
      // the .then() is called before this
      // helper function returns
      Template
        .render(name, context.stack.head)
        .then(function(html) {
          result = html;
        });
      return chunk.write(result);
    },
    /**
     * Helper function, exposed in dust templates, that allows templates
     *   to use data from [[Lavaca.util.Config]]. Accessed as:
     *
     * <dl>
     *
     * <dt>{@config key="config_value"/}</dt>
     *   <dd>key&mdash;The key to read from the config file for the default environment.</dd>
     *
     * <dt>{@config key="config_value" environment="production"/}</dt>
     *   <dd>key&mdash;The key to read from the config file for the specified environment.</dd>
     *
     * <dt>{@config key="config_value"}default{/config}</dt>
     *   <dd>key&mdash;The key to read from the config file</dd>
     *   <dd>default&mdash;The default markup to display if the key
     *       is not found</dd>
     *
     * <dt>{@config key="config_value" p0="first" p1=variable /}</dt>
     *   <dd>key&mdash;The key to read from the config file</dd>
     *   <dd>p0, p1, &hellip; pN&mdash;String format parameters
     *       (See [[Lavaca.util.StringUtils]].format())</dd>
     *
     * </dl>
     *
     * <dt>{@config only="local"}&hellip;{:else}&hellip;{/config}</dt>
     *   <dd>only&mdash;Only render the body content if the current config environment's name matches this key</dd>
     *
     * </dl>
     *
     * <dt>{@config not="production"}&hellip;{:else}&hellip;{/config}</dt>
     *   <dd>not&mdash;Only render the body content if the current config environment's name does NOT match this key</dd>
     *
     * </dl>
     * @method helperConfig
     *
     * @param {Object} chunk  Dust chunk
     * @param {Object} context  Dust context
     * @param {Object} bodies  Dust bodies
     * @param {Object} params  Parameters passed to the helper
     * @return {String}  Rendered output
     */
    helperConfig: function(chunk, context, bodies, params) {
      var key = dust.helpers.tap(params.key, chunk, context),
          environment = dust.helpers.tap(params.environment, chunk, context),
          value = environment ? Config.get(environment, key) : Config.get(key),
          args = [value],
          i = -1,
          currentEnvironment, arg;
      if(params.only || params.not) {
        currentEnvironment = Config.currentEnvironment();
        if((params.only && currentEnvironment === params.only) || (params.not && currentEnvironment !== params.not)) {
          return bodies.block ? chunk.render(bodies.block, context) : chunk;
        } else {
          return bodies['else'] ? chunk.render(bodies['else'], context) : chunk;
        }
      }
      if(!value) {
        return bodies.block ? chunk.render(bodies.block, context) : chunk;
      }
      arg = params['p' + (++i)];
      while (typeof arg !== 'undefined') {
        args.push(dust.helpers.tap(arg, chunk, context));
        arg = params['p' + (++i)];
      }
      return chunk.write(StringUtils.format.apply(this, args));
    },
    /**
     * Compiles the template
     * @method compile
     */
    compile: function() {
      Template.prototype.compile.call(this);
      dust.loadSource(dust.compile(this.code, this.name));
    },
    /**
     * Renders the template to a string.
     * @method render
     *
     * @param {Object} model  The data model to provide to the template
     * @return {Lavaca.util.Promise}  A promise
     */
    render: function(model) {
      var promise = new Promise(this);
      if (!this.code && this.src) {
        this.load(this.src);
      }
      if (this.code && !this.compiled) {
        this.compile();
        this.compiled = true;
      }
      dust.render(this.name, model, function(err, html) {
        if (err) {
          promise.reject(err);
        } else {
          promise.resolve(html);
        }
      });
      return promise;
    },
    /**
     * Makes this template ready for disposals
     * @method dispose
     */
    dispose: function() {
      delete dust.cache[this.name];
      Template.prototype.dispose.call(this);
    }
  });

  DustTemplate.getCompiledTemplates = function() {
    return dust.cache;
  };

  // Register the Dust template type for later use
  Template.register('text/dust-template', DustTemplate);

  return DustTemplate;

});

define('lavaca/ui/Widget',['require','$','lavaca/events/EventDispatcher','lavaca/util/uuid'],function(require) {

  var $ = require('$'),
      EventDispatcher = require('lavaca/events/EventDispatcher'),
      uuid = require('lavaca/util/uuid');

  /**
   * Base type for all UI elements
   * @class lavaca.ui.Widget
   * @extends lavaca.events.EventDispatcher
   *
   * @constructor
   *
   * @param {jQuery} el  The DOM element that is the root of the widget
   */
  var Widget = EventDispatcher.extend(function(el) {
    EventDispatcher.call(this);
    /**
     * The DOM element that is the root of the widget
     * @property {jQuery} el
     * @default null
     */
    this.el = el = $(el);
    var id = el.attr('id');
    if (!id) {
      id = 'widget-' + uuid();
    }
    /**
     * The el's ID
     * @property {String} id
     * @default (Autogenerated)
     */
    this.id = id;
  });

  return Widget;

});

define('lavaca/ui/Form',['require','$','lavaca/ui/Widget','lavaca/util/Promise'],function(require) {

  var $ = require('$'),
      Widget = require('lavaca/ui/Widget'),
      Promise = require('lavaca/util/Promise');

  function _required(value) {
    return value ? null : 'error_required';
  }

  function _pattern(value, input) {
    if (value) {
      var pattern = new RegExp(input.attr('pattern'));
      if (!pattern.test(value)) {
        return 'error_pattern';
      }
    }
    return null;
  }

  function _email(value) {
    if (value && !/^\w+@\w+(\.\w+)*\.\w+$/.test(value)) {
      return 'error_email';
    }
    return null;
  }

  function _tel(value) {
    if (value && !/^\d?(\d{3})?\d{7}$/.test(value.replace(/\D/g, ''))) {
      return 'error_email';
    }
    return null;
  }

  function _number(value) {
    if (value && !/^\d+(\.\d+)?$/.test(value)) {
      return 'error_number';
    }
    return null;
  }

  function _url(value) {
    if (value && !/^https?:\/\/\w+(\.\w+)*\.\w(:\d+)?\/\S+$/.test(value)) {
      return 'error_url';
    }
    return null;
  }

  /**
   * Basic form type
   * @class lavaca.ui.Form
   * @extends lavaca.ui.Widget
   *
   * @constructor
   * @param {jQuery} el  The DOM element that is the root of the widget
   */
  var Form = Widget.extend(function() {
    Widget.apply(this, arguments);
    var self = this;
    this.pendingSync = {};
    this._onChangeInput = function(e) {
      self.onChangeInput(e);
    };
    this._onSubmit = function(e) {
      self.onSubmit(e);
    };
    this.el.on('submit', this._onSubmit);
    this.addRule(this.defaultRules());
  }, {
    /**
     * Event handler for when the form is submitted
     * @method onSubmit
     *
     * @param {Event} e  The submit event
     */
    onSubmit: function(e) {
      e.preventDefault();
      this.validate()
        .success(this.onSubmitSuccess)
        .error(this.onSubmitError);
    },
    /**
     * Event handler for when the user attempts to submit a valid form
     * @method onSubmitSuccess
     *
     * @param {Object} values  Key-value map of the form's input names and values
     */
    onSubmitSuccess: function() {
      // Placeholder
    },
    /**
     * Event handler for when the user attempts to submit an invalid form
     * @method onSubmitError
     *
     * @param {Object} invalidInputs  A key-value map of all invalid inputs
     */
    onSubmitError: function() {
      // Placeholder
    },
    /**
     * Event handler for when an input on the form changes
     * @method onChangeInput
     *
     * @param {Event} e  The change event
     */
    onChangeInput: function(e) {
      if (this.model) {
        var input = $(e.target),
            name = input.attr('name'),
            value = input.val();
        this.pendingSync[name] = true;
        this.model.set(name, value);
        this.pendingSync[name] = false;
      }
    },
    /**
     * Event handler for when an attribute on the bound model changes
     * @method onChangeModel
     *
     * @param {Event} e  The change event
     */
    onChangeModel: function(e) {
      if (!this.pendingSync[e.attribute]) {
        this.set(e.attribute, e.value);
      }
    },
    /**
     * Binds this form to a model, forcing the two to stay in sync
     * @method bind
     *
     * @param {Lavaca.mvc.Model} model  The model being bound
     */
    bind: function(model) {
      this.unbind();
      this.model = model;
      model.on('change', this.onChangeModel, this);
      this.el.on('change', this._onChangeInput);
    },
    /**
     * Unbinds this form from its model
     * @method unbind
     */
    unbind: function() {
      if (this.model) {
        this.el.off('change', this._onChangeInput);
        this.model.off('change', this.onchangeModel, this);
        this.model = null;
      }
    },
    /**
     * Retrieve an input from the form with a given name
     * @method input
     *
     * @param {String} name  The name of the input
     * @return {jQuery}  The input
     */
    input: function(name) {
      return this.el.find('input, select, textarea').filter('[name="' + name + '"]');
    },
    /**
     * Gets the value of an input on the form
     * @method get
     *
     * @param {String} name  The name of the input
     * @return {String}  The value of the input
     */
    get: function(name) {
      return this.input(name).val();
    },
    /**
     * Sets an input on the form's value
     * @method set
     *
     * @param {String} name  The name of the input
     * @param {Object} value  The new value of the input
     */
    set: function(name, value) {
      this.input(name).val(value || null);
    },
    /**
     * The default validation rules for the form
     * @method defaultRules
     *
     * @return {Object}  The form's default rules1
     */
    defaultRules: function() {
      return {
        '[required]': _required,
        '[pattern]': _pattern,
        '[type=email]': _email,
        '[type=tel]': _tel,
        '[type=number]': _number,
        '[type=url]': _url
      };
    },
    /**
     * Adds multiple validation rules to this form
     * @method addRule
     *
     * @param {Object} map  A hash of selectors and callbacks to add as rules
     */
    /**
     * Adds multiple validation rules to this form
     * @method addRule
     * @param {String} selector  A jQuery selector associated with the rule
     * @param {Function} callback  A function that tests the value of inputs matching the
     *   selector in the form callback(value, input, form) and
     *   return a string message if validation fails
     */
    addRule: function(selector, callback) {
      if (!this.rules) {
        this.rules = [];
      }
      if (typeof selector === 'object') {
        for (var n in selector) {
          this.addRule(n, selector[n]);
        }
      } else {
        this.rules.push({selector: selector, callback: callback});
      }
    },
    /**
     * Collects all input values on the form
     * @method values
     *
     * @return {Object}  A hash of input names and their values
     */
    values: function() {
      var inputs = this.el.find('input, select, textarea'),
          result = {},
          i = -1,
          input,
          name,
          current,
          value,
          type;
      while (!!(input = inputs[++i])) {
        input = $(input);
        type = input.attr('type');
        if ((type === 'radio' || type === 'checkbox') && !input[0].checked) {
          continue;
        }
        name = input.attr('name');
        current = result[name];
        value = input.val();
        if (current instanceof Array) {
          current.push(value);
        } else if (current !== undefined) {
          result[name] = [current, value];
        } else {
          result[name] = value;
        }
      }
      return result;
    },
    /**
     * Checks the entire form to see if it's in a valid state
     * @method validate
     * @return {Lavaca.util.Promise}  A promise
     */
    /**
     * Checks the entire form to see if it's in a valid state
     * @method validate
     * @param {Function} succcess  A callback to execute when the form is valid
     * @param {Function} error  A callback to execute when the form is invalid
     * @return {Lavaca.util.Promise}  A promise
     */
    /**
     * Checks the entire form to see if it's in a valid state
     * @method validate
     * @param {jQuery} input  An input to check
     * @return {Lavaca.util.Promise}  A promise
     */
    /**
     * Checks the entire form to see if it's in a valid state
     * @method validate
     * @param {Function} succcess  A callback to execute when the input is valid
     * @param {Function} error  A callback to execute when the input is invalid
     * @param {jQuery} input  An input to check
     * @return {Lavaca.util.Promise}  A promise
     */
    validate: function(success, error, input) {
      if (success && typeof success !== 'function') {
        input = success;
        success = null;
      }
      if (input) {
        input = $(input);
      }
      var result = null,
          promise = new Promise(this),
          i = -1,
          j,
          rule,
          inputs,
          ip,
          message,
          name,
          label,
          id,
          value;
      while (!!(rule = this.rules[++i])) {
        if (input) {
          inputs = input.filter(rule.selector);
        } else {
          inputs = this.el.find(rule.selector);
        }
        j = -1;
        while (!!(ip = inputs[++j])) {
          ip = $(ip);
          value = ip.val();
          message = rule.callback.call(this, value, ip, this);
          if (message) {
            name = ip.attr('name');
            if (!result) {
              result = {};
            }
            if (!result[name]) {
              id = ip.attr('id');
              label = null;
              if (id) {
                label = this.el.find('label[for="' + id + '"]').text();
              }
              result[name] = {
                id: id,
                name: name,
                label: label,
                el: ip,
                value: value,
                messages: []
              };
            }
            result[name].messages.push(message);
          }
        }
      }
      if (result) {
        promise.reject(result);
      } else {
        promise.resolve(this.values());
      }
      return promise
        .error(function(inputs) {
          this.trigger('invalid', {inputs: inputs});
        })
        .success(function(values) {
          this.trigger('valid', values);
        })
        .success(success)
        .error(error);
    },
    /**
     * Ready the form for garbage collection
     * @method dispose
     */
    dispose: function() {
      this.unbind();
      Widget.prototype.dispose.call(this);
    }
  });
  /**
   * Extends the form with new submit handlers
   * @method withSubmit
   * @static
   *
   * @param {Function} success  The success handler
   * @param {Function} error  The error handler
   * @return {Function}  A new [@Lavaca.ui.Form]-derived type
   */
  Form.withSubmit = function(success, error) {
    return Form.extend({
      onSubmitSuccess: function(values) {
        success.call(this, values);
      },
      onSubmitError: function(inputs) {
        error.call(this, inputs);
      }
    });
  };

  return Form;

});

define('lavaca/ui/Widget',['require','$','lavaca/events/EventDispatcher','lavaca/util/uuid'],function(require) {

  var $ = require('$'),
      EventDispatcher = require('lavaca/events/EventDispatcher'),
      uuid = require('lavaca/util/uuid');

  /**
   * Base type for all UI elements
   * @class lavaca.ui.Widget
   * @extends lavaca.events.EventDispatcher
   *
   * @constructor
   *
   * @param {jQuery} el  The DOM element that is the root of the widget
   */
  var Widget = EventDispatcher.extend(function(el) {
    EventDispatcher.call(this);
    /**
     * The DOM element that is the root of the widget
     * @property {jQuery} el
     * @default null
     */
    this.el = el = $(el);
    var id = el.attr('id');
    if (!id) {
      id = 'widget-' + uuid();
    }
    /**
     * The el's ID
     * @property {String} id
     * @default (Autogenerated)
     */
    this.id = id;
  });

  return Widget;

});

define('lavaca/ui/LoadingIndicator',['require','$','./Widget'],function(require) {

  var $ = require('$'),
      Widget = require('./Widget');

  /**
   * Type that shows/hides a loading indicator
   * @class lavaca.ui.LoadingIndicator
   * @extends lavaca.ui.Widget
   *
   * @constructor
   * @param {jQuery} el  The DOM element that is the root of the widget
   */
  var LoadingIndicator = Widget.extend({
    /**
     * Class name applied to the root
     * @property {String} className
     * @default 'loading'
     */
    className: 'loading',
    /**
     * Activates the loading indicator
     * @method show
     */
    show: function() {
      this.el.addClass(this.className);
    },
    /**
     * Deactivates the loading indicator
     * @method hide
     */
    hide: function() {
      this.el.removeClass(this.className);
    }
  });
  /**
   * Creates a loading indicator and binds it to the document's AJAX events
   * @method init
   * @static
   */
   /** Creates a loading indicator and binds it to the document's AJAX events
   * @method init
   * @static
   * @param {Function} TLoadingIndicator  The type of loading indicator to create (should derive from [[Lavaca.ui.LoadingIndicator]])
   */
  LoadingIndicator.init = function(TLoadingIndicator) {
    TLoadingIndicator = TLoadingIndicator || LoadingIndicator;
    var indicator = new TLoadingIndicator(document.body);
    function show() {
      indicator.show();
    }
    function hide() {
      indicator.hide();
    }
    $(document)
      .on('ajaxStart', show)
      .on('ajaxStop', hide)
      .on('ajaxError', hide);
    return indicator;
  };

  return LoadingIndicator.init();

});


define('lavaca/ui/Template',['require','lavaca/util/Cache','lavaca/util/Map'],function(require) {

  var Cache = require('lavaca/util/Cache'),
      Map = require('lavaca/util/Map');

  var _cache = new Cache(),
      _types = [];

  /**
   * Abstract type for templates
   * @class lavaca.ui.Template
   * @extends lavaca.util.Map
   */
  var Template = Map.extend({
    /**
     * Compiles the template
     * @method compile
     */
    compile: function() {
      // Do nothing
    },
    /**
     * Renders the template to a string
     * @method render
     *
     * @param {Object} model  The data model to provide to the template
     * @return {Lavaca.util.Promise}  A promise
     */
    render: function() {
      throw 'Abstract';
    },
    /**
     * Parses server data to include in this lookup
     * @method process
     *
     * @param {String} text  The server data string
     */
    process: function(text) {
      this.code = text;
    }
  });
  /**
   * Finds the template with a given name
   * @method get
   * @static
   *
   * @param {String} name  The name of the template
   * @return {Lavaca.ui.Template}  The template (or null if no such template exists)
   */
  Template.get = function(name) {
    return _cache.get(name);
  };
  /**
   * Scans the document for all templates with registered types and
   *   prepares template objects from them
   * @method init
   * @static
   */
   /**
   *
   * Scans the document for all templates with registered types and
   *   prepares template objects from them
   * @method init
   * @static
   * @param {jQuery} scope  The element to which to limit the scan
   */
  Template.init = function(scope) {
    var i = -1,
        type, templates, templateName, template;

    while (!!(type = _types[++i])) {
      var construct = function(name, src, code) {
        return new type.js(name, src, code);
      };

      // Load pre-compiled templates
      if (typeof type.js.getCompiledTemplates === "function") {
        templates = type.js.getCompiledTemplates();
        for (templateName in templates) {
          template = construct(templateName, null, templates[templateName]);
          template.compiled = true;
          _cache.set(templateName, template);
        }
      }

      // Load un-compiled templates
      if (type.mime) {
        Map.init(_cache, type.mime, construct, scope);
      }
    }
  };
  /**
   * Disposes of all templates
   * @method dispose
   * @static
   */
  Template.dispose = function() {
    Map.dispose(_cache);
  };
  /**
   * Finds the named template and renders it to a string
   * @method render
   * @static
   *
   * @param {String} name  The name of the template
   * @param {Object} model  The data model to provide to the template
   * @return {Lavaca.util.Promise}  A promise
   */
  Template.render = function(name, model) {
    var template = Template.get(name);
    if (!template) {
      throw 'No template named "' + name + '"';
    } else {
      return template.render(model);
    }
  };
  /**
   * Registers a type of template to look for on intilization.
   * @method register
   * @static
   * @param {String} mimeType  The mime-type associated with the template
   * @param {Function} TTemplate  The JavaScript type used for the template (should derive from [[Lavaca.ui.Template]])
   */
   /**
   * Registers a type of template to look for on intilization.
   * @method register
   * @static
   * @param {Function} TTemplate  The JavaScript type used for the template (should derive from [[Lavaca.ui.Template]])
   */
  Template.register = function(mimeType, TTemplate) {
    if (typeof mimeType === "function") {
      TTemplate = mimeType;
      mimeType = null;
    }
    _types[_types.length] = {mime: mimeType, js: TTemplate};
  };

  return Template;

});

define('lavaca/util/ArrayUtils',[],function() {

  /**
   * Utility class for working with arrays
   * @class lavaca.util.ArrayUtils
   */
  var ArrayUtils = {};

  /**
   * Gets the first index of an item in an array
   * @method indexOf
   * @static
   *
   * @param {Array} a  The array
   * @param {Object} o  The object to look for
   * @return {Number}  The first index of the object, or -1 if not found
   */
  ArrayUtils.indexOf = function(a, o) {
    if (!a) {
      return -1;
    } else if (a.indexOf) {
      return a.indexOf(o);
    } else {
      for (var i = 0, j = a.length; i < j; i++) {
        if (a[i] === o) {
          return i;
        }
      }
      return -1;
    }
  };

  /**
   * Determines whether an array contains an object
   * @method contains
   * @static
   *
   * @param {Array} a  The array
   * @param {Object} o  The object to look for
   * @return {Boolean}  True when the array contains the object, false otherwise
   */
  ArrayUtils.contains = function(a, o) {
    return ArrayUtils.indexOf(a, o) > -1;
  };

  /**
   * Removes the first instance of an item from an array, if it exists
   * @method remove
   * @static
   *
   * @param {Array} a  The array
   * @param {Object} o  The object to remove
   * @return {Number}  The former index of the item (or -1 if the item was not
   *   in the array)
   */
  ArrayUtils.remove = function(a, o) {
    var index = ArrayUtils.indexOf(a, o);
    if (index > -1) {
      a.splice(index, 1);
    }
    return index;
  };

  /**
   * Adds an item to the end of an array, if it was not already in the array
   * @method pushIfNotExists
   * @static
   *
   * @param {Array} a  The array
   * @param {Object} o  The object to add to the array
   * @return {Number}  The index of the item in the array
   */
  ArrayUtils.pushIfNotExists = function(a, o) {
    var index = ArrayUtils.indexOf(a, o);
    if (index === -1) {
      a[index = a.length] = o;
    }
    return index;
  };
  /**
   * Determines if object is an array
   * @method isArray
   * @static
   *
   * @param {Object} a  Any value of any type
   * @return {Boolean}  True if a is a true array
   */
  ArrayUtils.isArray = function(a) {
    return Array.isArray === 'function' ? Array.isArray(a) : Object.prototype.toString.call(a) === '[object Array]';
  };

  return ArrayUtils;

});

define('lavaca/util/Cache',['require','lavaca/util/Disposable','lavaca/util/uuid'],function(require) {

  var Disposable = require('lavaca/util/Disposable'),
      uuid = require('lavaca/util/uuid');

  /**
   * Object for storing data
   * @class lavaca.util.Cache
   * @extends lavaca.util.Disposable
   */
  var Cache = Disposable.extend({
    /**
     *
     * Retrieves an item from the cache
     * @method get
     * @param {String} id  The key under which the item is stored
     * @return {Object}  The stored item (or null if no item is stored)
     */
     /**
     * Retrieves an item from the cache
     * @method get
     * @param {String} id  The key under which the item is stored
     * @param {Object} def  A default value that will be added, if there is no item stored
     * @return {Object}  The stored item (or null if no item is stored and no default)
     */
    get: function(id, def) {
      var result = this['@' + id];
      if (result === undefined && def !== undefined) {
        result = this['@' + id] = def;
      }
      return result === undefined ? null : result;
    },
    /**
     * Assigns an item to a key in the cache
     * @method set
     *
     * @param {String} id  The key under which the item will be stored
     * @param {Object} value  The object to store in the cache
     */
    set: function(id, value) {
      this['@' + id] = value;
    },
    /**
     * Adds an item to the cache
     * @method add
     *
     * @param {Object} value  The object to store in the cache
     * @return {String}  The auto-generated ID under which the value was stored
     */
    add: function(value) {
      var id = uuid();
      this.set(id, value);
      return id;
    },
    /**
     * Removes an item from the cache (if it exists)
     * @method remove
     *
     * @param {String} id  The key under which the item is stored
     */
    remove: function(id) {
      delete this['@' + id];
    },
    /**
     * Executes a callback for each cached item. To stop iteration immediately,
     * return false from the callback.
     * @method each
     * @param {Function} callback  A function to execute for each item, callback(key, item)
     */
     /**
     * Executes a callback for each cached item. To stop iteration immediately,
     * return false from the callback.
     * @method each
     * @param {Function} callback  A function to execute for each item, callback(key, item)
     * @param {Object} thisp  The context of the callback
     */
    each: function(cb, thisp) {
      var prop, returned;
      for (prop in this) {
        if (this.hasOwnProperty(prop) && prop.indexOf('@') === 0) {
          returned = cb.call(thisp || this, prop.slice(1), this[prop]);
          if (returned === false) {
            break;
          }
        }
      }
    },
    /**
     * Serializes the cache to a hash
     * @method toObject
     *
     * @return {Object}  The resulting key-value hash
     */
    toObject: function() {
      var result = {};
      this.each(function(prop, value) {
        result[prop] = (value && typeof value.toObject === 'function') ? value.toObject() : value;
      });
      return result;
    },
    /**
     * Serializes the cache to JSON
     * @method toJSON
     *
     * @return {String}  The JSON string
     */
    toJSON: function() {
      return JSON.stringify(this.toObject());
    },
     /**
     * Serializes the cache to an array
     * @method toArray
     *
     * @return {Object}  The resulting array with elements being index based and keys stored in an array on the 'ids' property
     */
    toArray: function() {
      var results = [];
      results['ids'] = [];
      this.each(function(prop, value) {
        results.push(typeof value.toObject === 'function' ? value.toObject() : value);
        results['ids'].push(prop);
      });
      return results;
    },

    /**
     * removes all items from the cache
     * @method clear
     */
    clear: function() {
       this.each(function(key, item) {
         this.remove(key);
       }, this);
    },

    /**
     * returns number of items in cache
     * @method count
     */
    count: function() {
      var count = 0;
      this.each(function(key, item) {
        count++;
      }, this);
      return count;
    },

    /**
     * Clears all items from the cache on dispose
     * @method dispose
     */
    dispose: function() {
      this.clear();
      Disposable.prototype.dispose.apply(this, arguments);
    }
  });

  return Cache;

});

define('lavaca/util/extend',[],function() {
  /**
   * Establishes inheritance between types. After a type is extended, it receives its own static
   * convenience method, extend(TSub, overrides).
   * @class lavaca.util.extend
   */
   /**
   * Establishes inheritance between types. After a type is extended, it receives its own static
   * convenience method, extend(TSub, overrides).
   * @method extend
   * @static
   *
   */
   /**
   * Establishes inheritance between types. After a type is extended, it receives its own static
   * convenience method, extend(TSub, overrides).
   * @method extend
   * @static
   * @param {Function} TSub  The child type which will inherit from superType
   * @param {Object} overrides  A hash of key-value pairs that will be added to the subType
   * @return {Function}  The subtype
   *
   */
   /**
   * Establishes inheritance between types. After a type is extended, it receives its own static
   * convenience method, extend(TSub, overrides).
   * @method extend
   * @static
   * @param {Function} TSuper  The base type to extend
   * @param {Function} TSub  The child type which will inherit from superType
   * @param {Object} overrides  A hash of key-value pairs that will be added to the subType
   * @return {Function}  The subtype
   */
  var extend = function(TSuper, TSub, overrides) {
    if (typeof TSuper === 'object') {
      overrides = TSuper;
      TSuper = Object;
      TSub = function() {
        // Empty
      };
    } else if (typeof TSub === 'object') {
      overrides = TSub;
      TSub = TSuper;
      TSuper = Object;
    }
    function ctor() {
      // Empty
    }
    ctor.prototype = TSuper.prototype;
    TSub.prototype = new ctor;
    TSub.prototype.constructor = TSub;
    if (overrides) {
      for (var name in overrides) {
        TSub.prototype[name] = overrides[name];
      }
    }
    TSub.extend = function(T, overrides) {
      if (typeof T === 'object') {
        overrides = T;
        T = function() {
          TSub.apply(this, arguments);
        };
      }
      extend(TSub, T, overrides);
      return T;
    };
    return TSub;
  };

  return extend;

});

define('lavaca/util/Disposable',['require','./extend'],function(require) {

  var extend = require('./extend');

  function _disposeOf(obj) {
    var n,
        o,
        i;
    for (n in obj) {
      if (obj.hasOwnProperty(n)) {
        o = obj[n];
          if (o) {
            if (typeof o === 'object' && typeof o.dispose === 'function') {
              o.dispose();
            } else if (o instanceof Array) {
              for (i = o.length - 1; i > -1; i--) {
                  if (o[i] && typeof o[i].dispose === 'function') {
                    o[i].dispose();
                  } else {
                    _disposeOf(o[i]);
                  }
                }
            }
          }
        }
    }
  }

  /**
   * Abstract type for types that need to ready themselves for GC
   * @class lavaca.util.Disposable
   * @constructor
   *
   */
  var Disposable = extend({
    /**
     * Readies the object to be garbage collected
     * @method dispose
     *
     */
    dispose: function() {
        _disposeOf(this);
    }
  });

  return Disposable;

});
define('lavaca/util/Map',['require','$','./Cache','./Disposable','lavaca/net/Connectivity'],function(require) {

  var $ = require('$'),
      Cache = require('./Cache'),
      Disposable = require('./Disposable'),
      Connectivity = require('lavaca/net/Connectivity');

  function _absolute(url) {
    if (url && url.indexOf('http') !== 0) {
      if (url.charAt(0) === '/') {
        url = location.protocol + '//'
          + location.hostname
          + (location.port ? ':' + location.port : '')
          + (url.indexOf('/') === 0 ? url : '/' + url);
      } else {
        url = location.toString().split('#')[0].split('?')[0].replace(/\w+\.\w+$/, '') + url;
      }
    }
    return url;
  }

  /**
   * Abstract type for lookup tables
   * @class lavaca.util.Map
   * @extends lavaca.util.Disposable
   *
   * @constructor
   * @param {String} name  The name of the map
   * @param {String} src  The URL of the map's data (or null if code is supplied)
   * @param {String} code  The raw string data for the map (or null if src is supplied)
   */
  var Map = Disposable.extend(function(name, src, code) {
    Disposable.call(this);
    /**
     * Whether or not the map has loaded
     * @property {Boolean} hasLoaded
     * @default false
     */
    this.hasLoaded = false;
    /**
     * The name of the map
     * @property {String} name
     * @default null
     */
    this.name = name;
    /**
     * The source URL for the map
     * @property {String} src
     * @default null
     */
    this.src = _absolute(src);
    /**
     * The raw string data for the map
     * @property {String} code
     * @default null
     */
    this.code = code;
    /**
     * The cache in which this map stores data
     * @property {Lavaca.util.Cache} cache
     * @default new Lavaca.util.Cache()
     */
    this.cache = new Cache();
  }, {
    /**
     * Determines whether or not this is the desired lookup
     * @method is
     *
     * @param {String} name  The name of the lookup
     * @return {Boolean}  True if this is the lookup
     */
    is: function(name) {
      return this.name === name;
    },
    /**
     * Gets the value stored under a code
     * @method get
     *
     * @param {String} code  The code
     * @return {Object}  The value (or null)
     */
    get: function(code) {
      if (!this.hasLoaded) {
        if (this.code) {
          this.add(this.code);
        } else if (this.src) {
          this.load(this.src);
        }
        this.hasLoaded = true;
      }
      return this.cache.get(code);
    },
    /**
     * Adds parameters to this map
     * @method add
     *
     * @param {Object} data  The parameters to add
     */
    add: function(data) {
      for (var n in data) {
        this.cache.set(n, data[n]);
      }
    },
    /**
     * Processes server data to include in this lookup
     * @method process
     *
     * @param {String} text  The server data string
     */
    process: function(text) {
      this.add(typeof text === 'string' ? JSON.parse(text) : text);
    },
    /**
     * Adds JSON data to this map (synchronous)
     * @method load
     *
     * @param {String} url  The URL of the data
     */
    load: function(url) {
      var self = this;
      Connectivity.ajax({
        async: false,
        url: url,
        success: function(resp) {
          self.process(resp);
        }
      });
    }
  });
  /**
   * Sets the application's default config
   * @method setDefault
   * @static
   *
   * @param {Lavaca.util.Cache} cache  The map cache
   * @param {String} name  The name of the config
   */
  Map.setDefault = function(cache, name) {
    var map = name;
    if (typeof map === 'string') {
      map = cache.get(name);
    }
    cache.set('default', map);
  };
  /**
   * Finds the most appropriate value for a code
   * @method get
   * @static
   *
   * @param {Lavaca.util.Cache} cache  The maps cache
   * @param {String} name  The name of the map
   * @param {String} code  The name of the parameter
   * @param {String} defaultName  The name of the default map
   * @return {Object}  The value of the parameter
   */
  Map.get = function(cache, name, code, defaultName) {
    if (!code) {
      code = name;
      name = defaultName;
    }
    if (name) {
      var map = cache.get(name);
      if (map) {
        return map.get(code);
      }
    }
    return null;
  };
  /**
   * Scans the document for all maps and prepares them
   * @method init
   * @static
   *
   * @param {Lavaca.util.Cache} cache  The map cache
   * @param {String} mimeType  The MIME type of the scripts
   * @param {Function} construct  A function that returns a new map, in
   *   the form construct(name, src, code)
   * @param {jQuery} scope  The element to which to limit the scan
   */
  Map.init = function(cache, mimeType, construct, scope) {
    $(scope || document.documentElement)
      .find('script[type="' + mimeType + '"]')
      .each(function() {
        var item = $(this),
            src = item.attr('data-src'),
            name = item.attr('data-name'),
            isDefault = typeof item.attr('data-default') === 'string',
            code = item.text(),
            map;
        map = construct(name, src, code);
        cache.set(map.name, map);
        if (isDefault) {
          Map.setDefault(cache, name);
        }
      });
  };
  /**
   * Disposes of all maps
   * @method dispose
   * @static
   *
   * @param {Lavaca.util.Cache} cache  The map cache
   */
  Map.dispose = function(cache) {
    cache.dispose();
  };

  return Map;

});

define('lavaca/util/Config',['require','./Cache','./Map'],function(require) {

  var Cache = require('./Cache'),
      Map = require('./Map');

  var _cache = new Cache();

  function _construct(name, src, code) {
    if (code) {
      code = JSON.parse(code);
    }
    return new Config(name, src, code);
  }

  /**
   * Configuration management type
   * @class lavaca.util.Config
   * @extends lavaca.util.Map
   */
  var Config = Map.extend({
    // Empty (no overrides)
  });
  /**
   * Sets the application's default config
   * @method setDefault
   * @static
   *
   * @param {String} name  The name of the default config
   */
  Config.setDefault = function(name) {
    Map.setDefault(_cache, name);
  };
  /**
   * Gets the application's current config environment name
   * @method currentEnvironment
   * @static
   *
   * @return {String} The name of the current environment
   */
  Config.currentEnvironment = function() {
    return _cache.get('default').name;
  };
  /**
   * Retrieves a value from the configuration
   * @method get
   * @static
   * @param {String} code  The name of the parameter
   * @return {Object}  The value of the parameter
   */
   /**
   * Retrieves a value from the configuration
   * @method get
   * @static
   * @param {String} name  The name of the config
   * @param {String} code  The name of the parameter
   * @return {Object}  The value of the parameter
   */
  Config.get = function(name, code) {
    return Map.get(_cache, name, code, 'default');
  };
  /**
   * Scans the document for all translations and prepares them
   * @method init
   * @static
   */
   /**
   * Scans the document for all translations and prepares them
   * @method init
   * @static
   * @param {jQuery} scope  The element to which to limit the scan
   */
  Config.init = function(scope) {
    Map.init(_cache, 'text/x-config', _construct, scope);
  };
  /**
   * Disposes of all translations
   * @method dispose
   * @static
   */
  Config.dispose = function() {
    Map.dispose(_cache);
  };

  Config.init();

  return Config;

});

define('lavaca/util/Translation',['require','./Cache','./Map'],function(require) {

  var Cache = require('./Cache'),
      Map = require('./Map');

  var _cache = new Cache();

  function _construct(name, src, code) {
    if (code) {
      code = JSON.parse(code);
    }
    var map = new Translation(name, src, code);
    if (!_cache.get(map.language)) {
      _cache.set(map.language, map);
    }
    return map;
  }

  /**
   * Translation dictionary
   * @class lavaca.util.Translation
   * @extends lavaca.util.Map
   *
   * @constructor
   * @param {String} name  The name of the map
   * @param {String} src  The URL of the map's data (or null if code is supplied)
   * @param {String} code  The raw string data for the map (or null if src is supplied)
   */
  var Translation = Map.extend(function(name) {
    Map.apply(this, arguments);
    var locale = name.toLowerCase().split('_');
    /**
     * The ISO 639-2 code for the translation's language
     * @property {String} language
     * @default null
     */
    this.language = locale[0];
    /**
     * The ISO 3166-1 code for the translation's country
     * @property {String} country
     * @default ''
     */
    this.country = locale[1] || '';
    /**
     * The locale of this translation (either lang or lang_COUNTRY)
     * @property {String} locale
     * @default null
     */
    this.locale = this.country
      ? this.language + '_' + this.country
      : this.language;
  }, {
    /**
     * Determines whether or not this translation works for a locale
     * @method is
     * @param {String} language  The locale's language
     * @return {Boolean}  True if this translation applies
     */
    /**
     * Determines whether or not this translation works for a locale
     * @method is
     * @param {String} language  The locale's language
     * @param {String} country   (Optional) The locale's country
     * @return {Boolean}  True if this translation applies
     */
    is: function(language, country) {
      return language === this.language
        && (!country || !this.country || country === this.country);
    }
  });
  /**
   * Sets the application's default locale
   * @method setDefault
   * @static
   *
   * @param {String} locale  A locale string (ie, "en", "en_US", or "es_MX")
   */
  Translation.setDefault = function(locale) {
    _cache.remove('default');
    Map.setDefault(_cache, Translation.forLocale(locale));
  };
  /**
   * Finds the most appropriate translation for a given locale
   * @method forLocale
   * @static
   *
   * @param {String} locale  The locale
   * @return {Lavaca.util.Translation}  The translation
   */
  Translation.forLocale = function(locale) {
    locale = (locale || 'default').toLowerCase();
    return _cache.get(locale)
      || _cache.get(locale.split('_')[0])
      || _cache.get('default');
  };
  /**
   * Finds the most appropriate translation of a message for the default locale
   * @method get
   * @static
   * @param {String} code  The code under which the message is stored
   * @return {Lavaca.util.Translation}  The translation
   */
  /**
   * Finds the most appropriate translation of a message for the default locale
   * @method get
   * @static
   * @param {String} locale  The locale
   * @param {String} code  The code under which the message is stored
   * @return {Lavaca.util.Translation}  The translation
   */
  Translation.get = function(locale, code) {
    if (!code) {
      code = locale;
      locale = 'default';
    }
    var translation = Translation.forLocale(locale),
        result = null;
    if (translation) {
      result = translation.get(code);
    }
    if (result === null) {
      translation = Translation.forLocale(locale.split('_')[0]);
      if (translation) {
        result = translation.get(code);
      }
    }
    if (result === null) {
      translation = Translation.forLocale('default');
      if (translation) {
        result = translation.get(code);
      }
    }
    return result;
  };
  /**
   * Scans the document for all translations and prepares them
   * @method init
   * @static
   * @param {String} locale  The default locale
   */
  /**
   * Scans the document for all translations and prepares them
   * @method init
   * @static
   * @param {String} locale  The default locale
   * @param {jQuery} scope  The element to which to limit the scan
   */
  Translation.init = function(locale, scope) {
    Map.init(_cache, 'text/x-translation', _construct, scope);
    Translation.setDefault(locale);
  };
  /**
   * Disposes of all translations
   * @method dispose
   * @static
   */
  Translation.dispose = function() {
    Map.dispose(_cache);
  };

  return Translation;

});

define('lavaca/util/DateUtils',['require','./Translation'],function(require) {

  var Translation = require('./Translation');

  /**
   * Utility class for working with dates
   * @class lavaca.util.DateUtils
   */
  var DateUtils = {};

  function _int(input) {
    return parseInt(input, 10);
  }

  function _indexOfCode(input, array) {
    input = input.toLowerCase();
    var i = -1,
        code;
    while (!!(code = array[++i])) {
      if (input === code.toLowerCase() || input === _translate(code).toLowerCase()) {
        return i - 1;
      }
    }
    throw 'Invalid code "' + code + '"';
  }

  function _pad(n, digits, c) {
    var sign = n < 0 ? '-' : '';
    c = c || '0';
    n = Math.abs(n).toString();
    while (digits - n.length > 0) {
      n = c + n;
    }
    return sign + n;
  }

  function _translate(s) {
    return Translation.get(s);
  }

  /**
   * The time of day abbreviation. You can supply [[Lavaca.util.Translation]] values using these names as keys to translate.
   * @property {Array} timeOfDayDesignatorAbbr
   * @static
   * @default ["A", "P"]*/
  DateUtils.timeOfDayDesignatorAbbr = [
    'A',
    'P'
  ];

  /**
   * The time of day. You can supply [[Lavaca.util.Translation]] values using these names as keys to translate.
   * @property {Array} timeOfDayDesignator
   * @static
   * @default ["AM", "PM"]
   */
  DateUtils.timeOfDayDesignator = [
    'AM',
    'PM'
  ];

  /**
   * The abbreviated days of the week. You can supply [[Lavaca.util.Translation]] values using these names as keys to translate.
   * @property {Array} daysOfWeekAbbr
   * @static
   * @default ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]
   * */
  DateUtils.daysOfWeekAbbr = [
    'Sun',
    'Mon',
    'Tue',
    'Wed',
    'Thu',
    'Fri',
    'Sat'
  ];

  /**
   * The days of the week. You can supply [[Lavaca.util.Translation]] values using these names as keys to translate.
   * @property {Array} daysOfWeek
   * @static
   * @default ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"]
   */
  DateUtils.daysOfWeek = [
    'Sunday',
    'Monday',
    'Tuesday',
    'Wednesday',
    'Thursday',
    'Friday',
    'Saturday'
  ];

  /**
   * The abbreviated months. You can supply [[Lavaca.util.Translation]] values using these names as keys to translate.
   * @property {Array} monthsAbbr
   * @static
   * @default ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
   */
  DateUtils.monthsAbbr = [
    'Jan',
    'Feb',
    'Mar',
    'Apr',
    'May',
    'Jun',
    'Jul',
    'Aug',
    'Sep',
    'Oct',
    'Nov',
    'Dec'
  ];

  /**
   * The months. You can supply [[Lavaca.util.Translation]] values using these names as keys to translate.
   * @property {Array} months
   * @static
   * @default ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"]
   */
  DateUtils.months = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December'
  ];

  /**
   * Object containing the functions used by each date format code. Default format codes are:
   *
   * <dl>
   * <dt>d</dt> <dd>Day of month (1 - 31)</dd>
   * <dt>dd</dt> <dd>Padded day of month (01 - 31)</dd>
   * <dt>ddd</dt> <dd>Abbreviated day of week (Sun - Sat)</dd>
   * <dt>ddd</dt> <dd>Full day of week (Sunday - Saturday)</dd>
   * <dt>f</dt> <dd>Tenth of a second</dd>
   * <dt>ff</dt> <dd>Hundreth of a second</dd>
   * <dt>fff</dt> <dd>Milliseconds</dd>
   * <dt>h</dt> <dd>Twelve-hour clock hour (1 - 12)</dd>
   * <dt>hh</dt> <dd>Padded twelve-hour clock hour (01 - 12)</dd>
   * <dt>H</dt> <dd>Twenty-four hour clock hour (0 - 23)</dd>
   * <dt>HH</dt> <dd>Padded twenty-four hour clock hour (00 - 23)</dd>
   * <dt>m</dt> <dd>Minute (0 - 59)</dd>
   * <dt>mm</dt> <dd>Padded minute (00 - 59)</dd>
   * <dt>M</dt> <dd>Month (1 - 12)</dd>
   * <dt>MM</dt> <dd>Padded month (01 - 12)</dd>
   * <dt>MMM</dt> <dd>Abbreviated month (Jan - Dec)</dd>
   * <dt>MMMM</dt> <dd>Full month (January - December)</dd>
   * <dt>s</dt> <dd>Second (0 - 59)</dd>
   * <dt>ss</dt> <dd>Padded second (00 - 59)</dd>
   * <dt>t</dt> <dd>Abbreviated AM/PM designator (A or P)</dd>
   * <dt>tt</dt> <dd>Full AM/PM designator (AM or PM)</dd>
   * <dt>y</dt> <dd>Short year (0 - 99)</dd>
   * <dt>yy</dt> <dd>Padded short year (00 - 99)</dd>
   * <dt>yyy</dt> <dd>Full year padded to at least 3 digits (000+)</dd>
   * <dt>yyyy</dt> <dd>Full year padded to at least 4 digits (0000+)</dd>
   * <dt>z</dt> <dd>Hours offset from UTC (-12, 0, 12)</dd>
   * <dt>zz</dt> <dd>Padded hours offset from UTC (-12, 00, 12)</dd>
   * <dt>zzz</dt> <dd>Padded hours and minute offset from UTC (-12:00, 00:00, 12:00)</dd>
   * </dl>
   *
   * To add a custom format code, assign this property an object containing an <code>i</code> function (responsible for parsing)
   * and an <code>o</code> function (responsible for stringifying). The <code>i</code> function
   * should assign to one of the following properties of its second argument: date, month, year,
   * hour, minute, second, ms, or offset. Example: <code>Lavaca.util.DateUtils.fn.QQQ = {i: function(input, dateObj, mappedObj) { dateObj.date = parseInt(input, 10); }, o: function(date, utc) { return (utc ? date.getUTCDate() : date.getDate()).toString(); }};</code>
   *
   * @property {Object} fn
   * @static
   */
  DateUtils.fn = {
    d: {
      exp: '\\d{1,2}',
      i: function(input, dateObj) {
        dateObj.date = _int(input);
      },
      o: function(date, utc) {
        return (utc ? date.getUTCDate() : date.getDate()).toString();
      }
    },
    dd: {
      exp: '\\d{2}',
      i: function(input, dateObj) {
        dateObj.date = _int(input);
      },
      o: function(date, utc) {
        return _pad(DateUtils.fn.d.o(date, utc), 2);
      }
    },
    ddd: {
      exp: '[a-z]{3}',
      i: function() {
        // Do nothing
      },
      o: function(date, utc) {
        return _translate(DateUtils.daysOfWeekAbbr[utc ? date.getUTCDay() : date.getDay()]);
      }
    },
    dddd: {
      exp: '[a-z]+',
      i: function() {
        // Do nothing
      },
      o: function(date, utc) {
        return _translate(DateUtils.daysOfWeek[utc ? date.getUTCDay() : date.getDay()]);
      }
    },
    f: {
      exp: '\\d',
      i: function(input, dateObj) {
        dateObj.ms = _int(input) * 100;
      },
      o: function(date, utc, divisor) {
        divisor = divisor || 100;
        return _pad(Math.floor((utc ? date.getUTCMilliseconds() : date.getMilliseconds()) / divisor), 3 - divisor.toString().length);
      }
    },
    ff: {
      exp: '\\d{2}',
      i: function(input, dateObj) {
        dateObj.ms = _int(input) * 10;
      },
      o: function(date, utc) {
        return _pad(DateUtils.fn.f.o(date, utc, 10), 2);
      }
    },
    fff: {
      exp: '\\d{3}',
      i: function(input, dateObj) {
        dateObj.ms = _int(input, 10);
      },
      o: function(date, utc) {
        return _pad(DateUtils.fn.f.o(date, utc, 1), 3);
      }
    },
    h: {
      exp: '1?\\d',
      i: function(input, dateObj, mappedObj) {
        var h = _int(input) - 1,
            tod = (mappedObj.t || mappedObj.tt || 'A').indexOf('A') === 0 ? 0 : 12;
        dateObj.hour = h + tod;
      },
      o: function(date, utc) {
        return ((utc ? date.getUTCHours() : date.getHours()) % 12 + 1).toString();
      }
    },
    hh: {
      exp: '[0-1]\\d',
      i: function(input, dateObj, mappedObj) {
        DateUtils.fn.h.i(input, dateObj, mappedObj);
      },
      o: function(date, utc) {
        return _pad(DateUtils.fn.h.o(date, utc), 2);
      }
    },
    H: {
      exp: '[0-2]?\\d',
      i: function(input, dateObj) {
        dateObj.hour = _int(input);
      },
      o: function(date, utc) {
        return (utc ? date.getUTCHours() : date.getHours()).toString();
      }
    },
    HH: {
      exp: '[0-2]\\d',
      i: function(input, dateObj) {
        dateObj.hour = _int(input);
      },
      o: function (date, utc) {
        return _pad(DateUtils.fn.H.o(date, utc), 2);
      }
    },
    m: {
      exp: '[1-5]?\\d',
      i: function(input, dateObj) {
        dateObj.minute = _int(input);
      },
      o: function(date, utc) {
        return (utc ? date.getUTCMinutes() : date.getMinutes()).toString();
      }
    },
    mm: {
      exp: '[0-5]\\d',
      i: function(input, dateObj, mappedObj) {
        DateUtils.fn.m.i(input, dateObj, mappedObj);
      },
      o: function(date, utc) {
        return _pad(DateUtils.fn.m.o(date, utc), 2);
      }
    },
    M: {
      exp: '1?\\d',
      i: function(input, dateObj) {
        dateObj.month = _int(input) - 1;
      },
      o: function(date, utc) {
        return ((utc ? date.getUTCMonth() : date.getMonth()) + 1).toString();
      }
    },
    MM: {
      exp: '[0-1]\\d',
      i: function(input, dateObj, mappedObj) {
        DateUtils.fn.M.i(input, dateObj, mappedObj);
      },
      o: function(date, utc) {
        return _pad(DateUtils.fn.M.o(date, utc), 2);
      }
    },
    MMM: {
      exp: '[a-z]{3}',
      i: function(input, dateObj) {
        dateObj.month = _indexOfCode(input, DateUtils.monthsAbbr);
      },
      o: function(date, utc) {
        return _translate(DateUtils.monthsAbbr[utc ? date.getUTCMonth() : date.getMonth()]);
      }
    },
    MMMM: {
      exp: '[a-z]+',
      i: function(input, dateObj) {
        dateObj.month = _indexOfCode(input, DateUtils.months);
      },
      o: function(date, utc) {
        return _translate(DateUtils.months[utc ? date.getUTCMonth() : date.getMonth()]);
      }
    },
    s: {
      exp: '[1-5]?\\d',
      i: function(input, dateObj) {
        dateObj.second = _int(input);
      },
      o: function(date, utc) {
        return (utc ? date.getUTCSeconds() : date.getSeconds()).toString();
      }
    },
    ss: {
      exp: '[0-5]\\d',
      i: function(input, dateObj, mappedObj) {
        DateUtils.fn.s.i(input, dateObj, mappedObj);
      },
      o: function(date, utc) {
        return _pad(DateUtils.fn.s.o(date, utc), 2);
      }
    },
    t: {
      exp: '[a-z]',
      i: function() {
        // Do nothing
      },
      o: function(date, utc) {
        return _translate(DateUtils.timeOfDayDesignatorAbbr[Math.floor((utc ? date.getUTCHours() : date.getHours()) / 12)]);
      }
    },
    tt: {
      exp: '[a-z]+',
      i: function() {
        // Do nothing
      },
      o: function(date, utc) {
        return _translate(DateUtils.timeOfDayDesignator[Math.floor((utc ? date.getUTCHours() : date.getHours()) / 12)]);
      }
    },
    y: {
      exp: '\\d?\\d',
      i: function(input, dateObj) {
        dateObj.year = (new Date()).getFullYear() % 100 + _int(input);
      },
      o: function(date, utc) {
        return ((utc ? date.getUTCFullYear() : date.getFullYear()) % 100).toString();
      }
    },
    yy: {
      exp: '\\d{2}',
      i: function(input, dateObj, mappedObj) {
        DateUtils.fn.y.i(input, dateObj, mappedObj);
      },
      o: function(date, utc) {
        return _pad(DateUtils.fn.y.o(date, utc), 2);
      }
    },
    yyy: {
      exp: '\\d*\\d{3}',
      i: function(input, dateObj) {
        dateObj.year = _int(input);
      },
      o: function(date, utc) {
        return _pad(utc ? date.getUTCFullYear() : date.getFullYear(), 3);
      }
    },
    yyyy: {
      exp: '\\d*\\d{4}',
      i: function(input, dateObj, mappedObj) {
        DateUtils.fn.yyy.i(input, dateObj, mappedObj);
      },
      o: function(date, utc) {
        return _pad(utc ? date.getUTCFullYear() : date.getFullYear(), 4);
      }
    },
    z: {
      exp: '[-+]?1?\\d',
      i: function(input, dateObj) {
        dateObj.offset = _int(input) * 60;
      },
      o: function(date, padding) {
        var off = date.getTimezoneOffset(),
            offH = Math.floor(Math.abs(off / 60));
        return (off < 0 ? '-' : '+') + _pad(offH, padding);
      }
    },
    zz: {
      exp: '[-+]?[0-1]\\d',
      i: function(input, dateObj, mappedObj) {
        DateUtils.fn.z.i(input, dateObj, mappedObj);
      },
      o: function(date) {
        return DateUtils.fn.z.o(date, 2);
      }
    },
    zzz: {
      exp: '[-+]?[0-1]\\d:\\d{2}',
      i: function(input, dateObj) {
        var parts = input.split(':');
        dateObj.offset = _int(parts[0]) * 60 + _int(parts[1]);
      },
      o: function(date) {
        var z = date.getTimezoneOffset(),
            sign = z > 0 ? '-' : '+',
            m = z % 60,
            h = Math.abs((z - m) / 60);
        return sign + _pad(h, 2) + ':' + _pad(Math.abs(m), 2);
      }
    }
  };

  function _parseFormat(f) {
    var actors = [],
        buffer = '',
        i = -1,
        bufferChar,
        c;
    while (!!(c = f.charAt(++i))) {
      bufferChar = buffer.charAt(0);
      if (bufferChar === c || bufferChar === '"' || bufferChar === '\'') {
        buffer += c;
        if ((bufferChar === '"' && c === '"') || (bufferChar === '\'' && c === '\'')) {
          actors.push(buffer);
          buffer = '';
        }
      } else {
        if (buffer) {
          actors.push(buffer);
        }
        buffer = c;
      }
    }
    if (buffer) {
      actors.push(buffer);
    }
    return actors;
  }

  function _actorsToRegex(actors) {
    var s = ['^'],
        i = -1,
        actor,
        handler;
    while (!!(actor = actors[++i])) {
      handler = DateUtils.fn[actor];
      if (handler) {
        s.push('(', handler.exp, ')');
      } else {
        s.push('(', actor.replace(/(^")|(^')|('$)|("$)/g, '').replace(/[-[\]{}()*+?.,\\^$|#\s]/g, '\\$&'), ')');
      }
    }
    s.push('$');
    return new RegExp(s.join(''));
  }

  /**
   * @method parse
   * @static
   * Converts a string to a date
   *
   * @param {String} s  The date string
   * @param {String} f  The format of the date string
   * @return {Date}  The parsed date
   */
  DateUtils.parse = function(s, f) {
    var actors = _parseFormat(f),
        exp = _actorsToRegex(actors),
        dateObj = {year: 0, month: 0, date: 1, hour: 0, minute: 0, second: 0, ms: 0, offset: 0},
        mappedObj = {},
        i = -1,
        actor,
        match,
        handler;
    if (exp.test(s)) {
      match = exp.exec(s);
      while (!!(actor = actors[++i])) {
        mappedObj[actor] = match[i + 1];
      }
    }
    for (actor in mappedObj) {
      handler = DateUtils.fn[actor];
      if (handler) {
        handler.i(mappedObj[actor], dateObj, mappedObj);
      }
    }
    return new Date(
        DateUtils.monthsAbbr[dateObj.month]
      + ' '
      + _pad(dateObj.date, 2)
      + ' '
      + _pad(dateObj.year, 4)
      + ' '
      + _pad(dateObj.hour, 2)
      + ':'
      + _pad(dateObj.minute, 2)
      + ':'
      + _pad(dateObj.second, 2)
      + (dateObj.ms > 0 ? '.' + _pad(dateObj.ms, 3) : '')
      + (dateObj.offset >= 0 ? '+' : '-')
      + _pad(Math.floor(Math.abs(dateObj.offset / 60)), 2)
      + _pad(Math.abs(dateObj.offset % 60), 2));
  };

  /**
   * Converts a date to a string
   * @method stringify
   * @static
   * @param {Date} d  The date
   * @param {String} f  The string format of the date
   * @return {String}  The stringified date
   */
   /**
   * Converts a date to a string
   * @method stringify
   * @static
   * @param {Date} d  The date
   * @param {String} f  The string format of the date
   * @param {Boolean} utc  When true, use the UTC date to generate the string
   * @return {String}  The stringified date
   */
  DateUtils.stringify = function(d, f, utc) {
    var actors = _parseFormat(f),
        i = -1,
        s = [],
        actor,
        handler;
    while (!!(actor = actors[++i])) {
      handler = DateUtils.fn[actor];
      if (handler) {
        s.push(handler.o(d, utc));
      } else {
        s.push(actor.replace(/(^")|(^')|('$)|("$)/g, ''));
      }
    }
    return s.join('');
  };

  return DateUtils;

});

define('lavaca/util/Promise',['require','./extend'],function(require) {

  var extend = require('./extend');

  /**
   * Utility type for asynchronous programming
   * @class lavaca.util.Promise
   *
   * @constructor
   *
   * @param {Object} thisp  What the "this" keyword resolves to in callbacks
   */
  var Promise = extend(function(thisp) {
    /**
     * What the "this" keyword resolves to in callbacks
     * @property {Object} thisp
     * @default null
     */
    this.thisp = thisp;
    /**
     * Pending handlers for the success event
     * @property {Array} resolvedQueue
     * @default []
     */
    this.resolvedQueue = [];
    /**
     * Pending handlers for the error event
     * @property {Array} rejectedQueue
     * @default []
     */
    this.rejectedQueue = [];
  }, {
    /**
     * Flag indicating that the promise completed successfully
     * @property {Boolean} succeeded
     * @default false
     */
    succeeded: false,
    /**
     * Flag indicating that the promise failed to complete
     * @property {Boolean} failed
     * @default false
     */
    failed: false,
    /**
     * Queues a callback to be executed when the promise succeeds
     * @method success
     *
     * @param {Function} callback  The callback to execute
     * @return {Lavaca.util.Promise}  This promise (for chaining)
     */
    success: function(callback) {
      if (callback) {
        if (this.succeeded) {
          callback.apply(this.thisp, this.resolveArgs);
        } else {
          this.resolvedQueue.push(callback);
        }
      }
      return this;
    },
    /**
     * Queues a callback to be executed when the promise fails
     * @method error
     *
     * @param {Function} callback  The callback to execute
     * @return {Lavaca.util.Promise}  This promise (for chaining)
     */
    error: function(callback) {
      if (callback) {
        if (this.failed) {
          callback.apply(this.thisp, this.rejectArgs);
        } else {
          this.rejectedQueue.push(callback);
        }
      }
      return this;
    },
    /**
     * Queues a callback to be executed when the promise is either rejected or resolved
     * @method always
     *
     * @param {Function} callback  The callback to execute
     * @return {Lavaca.util.Promise}  This promise (for chaining)
     */
    always: function(callback) {
      return this.then(callback, callback);
    },
    /**
     * Queues up callbacks after the promise is completed
     * @method then
     *
     * @param {Function} resolved  A callback to execute when the operation succeeds
     * @param {Function} rejected  A callback to execute when the operation fails
     * @return {Lavaca.util.Promise}  This promise (for chaining)
     */
    then: function(resolved, rejected) {
      return this
        .success(resolved)
        .error(rejected);
    },
    /**
     * Resolves the promise successfully
     * @method resolve
     *
     * @params {Object} value  Values to pass to the queued success callbacks
     * @return {Lavaca.util.Promise}  This promise (for chaining)
     */
    resolve: function(/* value1, value2, valueN */) {
      if (!this.succeeded && !this.failed) {
        this.succeeded = true;
        this.resolveArgs = [].slice.call(arguments, 0);
        var i = -1,
            callback;
        while (!!(callback = this.resolvedQueue[++i])) {
          callback.apply(this.thisp, this.resolveArgs);
        }
      }
      return this;
    },
    /**
     * Resolves the promise as a failure
     * @method reject
     *
     * @params {String} err  Failure messages
     * @return {Lavaca.util.Promise}  This promise (for chaining)
     */
    reject: function(/* err1, err2, errN */) {
      if (!this.succeeded && !this.failed) {
        this.failed = true;
        this.rejectArgs = [].slice.call(arguments, 0);
        var i = -1,
            callback;
        while (!!(callback = this.rejectedQueue[++i])) {
          callback.apply(this.thisp, this.rejectArgs);
        }
      }
      return this;
    },
    /**
     * Queues this promise to be resolved only after several other promises
     *   have been successfully resolved, or immediately rejected when one
     *   of those promises is rejected
     * @method when
     *
     * @params {Lavaca.util.Promise}  promise  One or more other promises
     * @return {Lavaca.util.Promise}  This promise (for chaining)
     */
    when: function(/* promise1, promise2, promiseN */) {
      var self = this,
          values = [],
          i = -1,
          pendingPromiseCount = arguments.length,
          promise;
      while (!!(promise = arguments[++i])) {
        (function(index) {
          promise
            .success(function(v) {
              values[index] = v;
              if (--pendingPromiseCount < 1) {
                self.resolve.apply(self, values);
              }
            })
            .error(function() {
              self.reject.apply(self, arguments);
            });
        })(i);
      }
      promise = null;
      return this;
    },
    /**
     * Produces a callback that resolves the promise with any number of arguments
     * @method resolver
     * @return {Function}  The callback
     */
    resolver: function() {
      var self = this;
      return function() {
        self.resolve.apply(self, arguments);
      };
    },
    /**
     * Produces a callback that rejects the promise with any number of arguments
     * @method rejector
     *
     * @return {Function}  The callback
     */
    rejector: function() {
      var self = this;
      return function() {
        self.reject.apply(self, arguments);
      };
    }
  });
  /**
   *
   * Creates a promise to be resolved only after several other promises
   *   have been successfully resolved, or immediately rejected when one
   *   of those promises is rejected
   * @method when
   * @static
   * @params {Lavaca.util.Promise}  promise  One or more other promises
   * @return {Lavaca.util.Promise}  The new promise
   */
   /**
   * Creates a promise to be resolved only after several other promises
   *   have been successfully resolved, or immediately rejected when one
   *   of those promises is rejected
   * @method when
   * @static
   * @param {Object} thisp  The execution context of the promise
   * @params {Lavaca.util.Promise}  promise  One or more other promises
   * @return {Lavaca.util.Promise}  The new promise
   */
  Promise.when = function(thisp/*, promise1, promise2, promiseN */) {
    var thispIsPromise = thisp instanceof Promise,
        promise = new Promise(thispIsPromise ? window : thisp),
        args = [].slice.call(arguments, thispIsPromise ? 0 : 1);
    return promise.when.apply(promise, args);
  };

  return Promise;

});

define('lavaca/util/StringUtils',['require'],function(require) {

  var _htmlEscapes = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&apos;'
  };

  function _noop(s) {
    return s;
  }

  /**
   * Static utility type for working with strings
   * @class lavaca.util.StringUtils
   */
  var StringUtils = {};

  /**
   * Substitutes arguments into a string
   * @method format
   * @static
   * @param {String} s  The format string. Substitutions should be in the form {0} to sub in
   *   the first arg, {1} for the second, and so on
   * @params {Object} arg  Arguments to be substituted in to the string
   * @return {String}  The format string with the arguments substituted into it
   */
  /**
   * Substitutes arguments into a string
   * @method format
   * @static
   * @param {String} s  The format string. Substitutions should be in the form {0} to sub in
   *   the first arg, {1} for the second, and so on
   * @param {Array} args  Arguments to be substituted in to the string
   * @return {String}  The format string with the arguments substituted into it
   */
  /**
   * Substitutes arguments into a string
   * @method format
   * @static
   * @param {String} s  The format string. Substitutions should be in the form {0} to sub in
   *   the first arg, {1} for the second, and so on
   * @param {Array} args  Arguments to be substituted in to the string
   * @param {Function} fn  A function to call on each argument, the result of which is substituted into the string
   * @return {String}  The format string with the arguments substituted into it
   */
  StringUtils.format = function(s /*[, arg0, arg1, argN]*/) {
    var args,
        fn = _noop,
        i,
        j;
    if (arguments[1] instanceof Array) {
      args = arguments[1];
      fn = arguments[2] || _noop;
    } else {
      args = [].slice.call(arguments, 1);
    }
    for (i = 0, j = args.length; i < j; i++) {
      s = s.split('{' + i + '}').join(fn(args[i] + ''));
    }
    return s;
  };

  /**
   * Escapes a string for inclusion in HTML
   * @method escapeHTML
   * @static
   *
   * @param {String} s  The string
   * @return {String}  The escaped string
   */
  StringUtils.escapeHTML = function(s) {
    s = '' + s;
    for (var n in _htmlEscapes) {
      s = s.split(n).join(_htmlEscapes[n]);
    }
    return s;
  };

  return StringUtils;

});
define('lavaca/util/delay',[],function() {
  /**
   * Wraps setTimeout and delays the execution of a function
   * @class lavaca.util.delay
   */
   /**
   * Delays the execution of a function
   * @method delay
   * @static
   *
   * @param {Function} callback  A callback to execute on delay
   */
   /**
   * Delays the execution of a function
   * @method delay
   * @static
   * @param {Function} callback  A callback to execute on delay
   * @param {Object} thisp  The object to use as the "this" keyword
   * @return {Number}  The timeout ID
   */
   /**
   * Delays the execution of a function
   * @method delay
   * @static
   * @param {Function} callback  A callback to execute on delay
   * @param {Object} thisp  The object to use as the "this" keyword
   * @param {Number} ms  The number of milliseconds to delay execution
   * @return {Number}  The timeout ID
   */
  var delay = function(callback, thisp, ms) {
    return setTimeout(function() {
      callback.call(thisp);
    }, ms || 0);
  };

  return delay;

});

define('lavaca/util/log',[],function() {
  /**
   * Logs to the console (or alerts if no console exists)
   * @class lavaca.util.log
   */
   /**
   * Logs to the console (or alerts if no console exists)
   * @method log
   * @static
   *
   * @params {Object} arg  The content to be logged
   */
  var log = function() {
    if (window.console) {
      console.log.apply(console, arguments);
    } else {
      alert([].join.call(arguments, ' '));
    }
  };

  return log;

});

define('lavaca/util/resolve',[],function() {
  /**
   * Looks up or creates an object, given its global path (ie, 'Lavaca.resolve' resolves to this function,
   * 'no.obj.exists' resolves to null)
   * @class lavaca.util.resolve
   */
   /**
   * Looks up or creates an object, given its global path (ie, 'Lavaca.resolve' resolves to this function,
   * 'no.obj.exists' resolves to null)
   * @method resolve
   * @static
   *
   * @param {String} name  The fully-qualified name of the object to look up
   * @return {Object}  The resolved object
   */
   /**
   * Looks up or creates an object, given its global path (ie, 'Lavaca.resolve' resolves to this function,
   * 'no.obj.exists' resolves to null)
   * @method resolve
   * @static
   *
   * @param {String} name  The fully-qualified name of the object to look up
   * @param {Boolean} createIfNotExists  When true, any part of the name that doesn't already exist will be created
   * as an empty object
   * @return {Object}  The resolved object
   */
  var resolve = function(name, createIfNotExists, root) {
    if (!name) {
      return null;
    }
    name = name.split('.');
    var last = root || window,
        o = root || window,
        i = -1,
        segment;
    while (!!(segment = name[++i])) {
      o = o[segment];
      if (!o) {
        if (createIfNotExists) {
          o = last[segment] = {};
        } else {
          return null;
        }
      }
      last = o;
    }
    return o;
  };

  return resolve;

});

define('lavaca/util/uuid',[],function() {

  var _uuidMap = {};
  /**
   * Produces a app specific unique identifier
   * @class lavaca.util.uuid
   */
   /**
   * Produces a unique identifier
   * @method uuid
   * @static
   * @param {String} namespace  A string served the namespace of a uuid
   *
   * @return {Number}  A number that is unique to this page
   */
  var uuid = function(namespace) {
    namespace = namespace || '__defaultNS';
    if (typeof _uuidMap[namespace] !== 'number') {
      _uuidMap[namespace] = 0;
    }
    return _uuidMap[namespace]++;
  };

  return uuid;

});

})();