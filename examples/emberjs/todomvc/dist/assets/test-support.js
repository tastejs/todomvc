(function() {
/*!
 * @overview  Ember - JavaScript Application Framework
 * @copyright Copyright 2011 Tilde Inc. and contributors
 *            Portions Copyright 2006-2011 Strobe Inc.
 *            Portions Copyright 2008-2011 Apple Inc. All rights reserved.
 * @license   Licensed under MIT license
 *            See https://raw.github.com/emberjs/ember.js/master/LICENSE
 * @version   5.3.0
 */
/* eslint-disable no-var */
/* globals global globalThis self */
/* eslint-disable-next-line no-unused-vars */
var define, require;
(function () {
  var globalObj = typeof globalThis !== 'undefined' ? globalThis : typeof self !== 'undefined' ? self : typeof window !== 'undefined' ? window : typeof global !== 'undefined' ? global : null;
  if (globalObj === null) {
    throw new Error('unable to locate global object');
  }
  if (typeof globalObj.define === 'function' && typeof globalObj.require === 'function') {
    define = globalObj.define;
    require = globalObj.require;
    return;
  }
  var registry = Object.create(null);
  var seen = Object.create(null);
  function missingModule(name, referrerName) {
    if (referrerName) {
      throw new Error('Could not find module ' + name + ' required by: ' + referrerName);
    } else {
      throw new Error('Could not find module ' + name);
    }
  }
  function internalRequire(_name, referrerName) {
    var name = _name;
    var mod = registry[name];
    if (!mod) {
      name = name + '/index';
      mod = registry[name];
    }
    var exports = seen[name];
    if (exports !== undefined) {
      return exports;
    }
    exports = seen[name] = {};
    if (!mod) {
      missingModule(_name, referrerName);
    }
    var deps = mod.deps;
    var callback = mod.callback;
    var reified = new Array(deps.length);
    for (var i = 0; i < deps.length; i++) {
      if (deps[i] === 'exports') {
        reified[i] = exports;
      } else if (deps[i] === 'require') {
        reified[i] = require;
      } else {
        reified[i] = require(deps[i], name);
      }
    }
    callback.apply(this, reified);
    return exports;
  }
  require = function (name) {
    return internalRequire(name, null);
  };
  define = function (name, deps, callback) {
    registry[name] = {
      deps: deps,
      callback: callback
    };
  };

  // setup `require` module
  require['default'] = require;
  require.has = function registryHas(moduleName) {
    return Boolean(registry[moduleName]) || Boolean(registry[moduleName + '/index']);
  };
  require._eak_seen = require.entries = registry;
})();
define("@ember/debug/index", ["exports", "@ember/-internals/browser-environment", "@ember/debug/lib/deprecate", "@ember/debug/lib/testing", "@ember/debug/lib/warn", "@ember/debug/lib/inspect", "@ember/debug/lib/capture-render-tree"], function (_exports, _browserEnvironment, _deprecate2, _testing, _warn2, _inspect, _captureRenderTree) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.assert = _exports._warnIfUsingStrippedFeatureFlags = void 0;
  Object.defineProperty(_exports, "captureRenderTree", {
    enumerable: true,
    get: function () {
      return _captureRenderTree.default;
    }
  });
  _exports.info = _exports.getDebugFunction = _exports.deprecateFunc = _exports.deprecate = _exports.debugSeal = _exports.debugFreeze = _exports.debug = void 0;
  Object.defineProperty(_exports, "inspect", {
    enumerable: true,
    get: function () {
      return _inspect.default;
    }
  });
  Object.defineProperty(_exports, "isTesting", {
    enumerable: true,
    get: function () {
      return _testing.isTesting;
    }
  });
  Object.defineProperty(_exports, "registerDeprecationHandler", {
    enumerable: true,
    get: function () {
      return _deprecate2.registerHandler;
    }
  });
  Object.defineProperty(_exports, "registerWarnHandler", {
    enumerable: true,
    get: function () {
      return _warn2.registerHandler;
    }
  });
  _exports.setDebugFunction = _exports.runInDebug = void 0;
  Object.defineProperty(_exports, "setTesting", {
    enumerable: true,
    get: function () {
      return _testing.setTesting;
    }
  });
  _exports.warn = void 0;
  // These are the default production build versions:
  var noop = () => {};
  // SAFETY: these casts are just straight-up lies, but the point is that they do
  // not do anything in production builds.
  var assert = noop;
  _exports.assert = assert;
  var info = noop;
  _exports.info = info;
  var warn = noop;
  _exports.warn = warn;
  var debug = noop;
  _exports.debug = debug;
  var deprecate = noop;
  _exports.deprecate = deprecate;
  var debugSeal = noop;
  _exports.debugSeal = debugSeal;
  var debugFreeze = noop;
  _exports.debugFreeze = debugFreeze;
  var runInDebug = noop;
  _exports.runInDebug = runInDebug;
  var setDebugFunction = noop;
  _exports.setDebugFunction = setDebugFunction;
  var getDebugFunction = noop;
  _exports.getDebugFunction = getDebugFunction;
  var deprecateFunc = function () {
    return arguments[arguments.length - 1];
  };
  _exports.deprecateFunc = deprecateFunc;
  if (true /* DEBUG */) {
    _exports.setDebugFunction = setDebugFunction = function (type, callback) {
      switch (type) {
        case 'assert':
          return _exports.assert = assert = callback;
        case 'info':
          return _exports.info = info = callback;
        case 'warn':
          return _exports.warn = warn = callback;
        case 'debug':
          return _exports.debug = debug = callback;
        case 'deprecate':
          return _exports.deprecate = deprecate = callback;
        case 'debugSeal':
          return _exports.debugSeal = debugSeal = callback;
        case 'debugFreeze':
          return _exports.debugFreeze = debugFreeze = callback;
        case 'runInDebug':
          return _exports.runInDebug = runInDebug = callback;
        case 'deprecateFunc':
          return _exports.deprecateFunc = deprecateFunc = callback;
      }
    };
    _exports.getDebugFunction = getDebugFunction = function (type) {
      switch (type) {
        case 'assert':
          return assert;
        case 'info':
          return info;
        case 'warn':
          return warn;
        case 'debug':
          return debug;
        case 'deprecate':
          return deprecate;
        case 'debugSeal':
          return debugSeal;
        case 'debugFreeze':
          return debugFreeze;
        case 'runInDebug':
          return runInDebug;
        case 'deprecateFunc':
          return deprecateFunc;
      }
    };
  }
  /**
  @module @ember/debug
  */
  if (true /* DEBUG */) {
    // eslint-disable-next-line no-inner-declarations
    function _assert(desc, test) {
      if (!test) {
        throw new Error(`Assertion Failed: ${desc}`);
      }
    }
    setDebugFunction('assert', _assert);
    /**
      Display a debug notice.
         Calls to this function are not invoked in production builds.
         ```javascript
      import { debug } from '@ember/debug';
         debug('I\'m a debug notice!');
      ```
         @method debug
      @for @ember/debug
      @static
      @param {String} message A debug message to display.
      @public
    */
    setDebugFunction('debug', function debug(message) {
      console.debug(`DEBUG: ${message}`); /* eslint-disable-line no-console */
    });
    /**
      Display an info notice.
         Calls to this function are removed from production builds, so they can be
      freely added for documentation and debugging purposes without worries of
      incuring any performance penalty.
         @method info
      @private
    */
    setDebugFunction('info', function info() {
      console.info(...arguments); /* eslint-disable-line no-console */
    });
    /**
     @module @ember/debug
     @public
    */
    /**
      Alias an old, deprecated method with its new counterpart.
         Display a deprecation warning with the provided message and a stack trace
      (Chrome and Firefox only) when the assigned method is called.
         Calls to this function are removed from production builds, so they can be
      freely added for documentation and debugging purposes without worries of
      incuring any performance penalty.
         ```javascript
      import { deprecateFunc } from '@ember/debug';
         Ember.oldMethod = deprecateFunc('Please use the new, updated method', options, Ember.newMethod);
      ```
         @method deprecateFunc
      @static
      @for @ember/debug
      @param {String} message A description of the deprecation.
      @param {Object} [options] The options object for `deprecate`.
      @param {Function} func The new function called to replace its deprecated counterpart.
      @return {Function} A new function that wraps the original function with a deprecation warning
      @private
    */
    setDebugFunction('deprecateFunc', function deprecateFunc() {
      for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
        args[_key] = arguments[_key];
      }
      if (args.length === 3) {
        var [message, options, func] = args;
        return function () {
          deprecate(message, false, options);
          for (var _len2 = arguments.length, args = new Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
            args[_key2] = arguments[_key2];
          }
          return func.apply(this, args);
        };
      } else {
        var [_message, _func] = args;
        return function () {
          deprecate(_message);
          return _func.apply(this, arguments);
        };
      }
    });
    /**
     @module @ember/debug
     @public
    */
    /**
      Run a function meant for debugging.
         Calls to this function are removed from production builds, so they can be
      freely added for documentation and debugging purposes without worries of
      incuring any performance penalty.
         ```javascript
      import Component from '@ember/component';
      import { runInDebug } from '@ember/debug';
         runInDebug(() => {
        Component.reopen({
          didInsertElement() {
            console.log("I'm happy");
          }
        });
      });
      ```
         @method runInDebug
      @for @ember/debug
      @static
      @param {Function} func The function to be executed.
      @since 1.5.0
      @public
    */
    setDebugFunction('runInDebug', function runInDebug(func) {
      func();
    });
    setDebugFunction('debugSeal', function debugSeal(obj) {
      Object.seal(obj);
    });
    setDebugFunction('debugFreeze', function debugFreeze(obj) {
      // re-freezing an already frozen object introduces a significant
      // performance penalty on Chrome (tested through 59).
      //
      // See: https://bugs.chromium.org/p/v8/issues/detail?id=6450
      if (!Object.isFrozen(obj)) {
        Object.freeze(obj);
      }
    });
    setDebugFunction('deprecate', _deprecate2.default);
    setDebugFunction('warn', _warn2.default);
  }
  var _warnIfUsingStrippedFeatureFlags;
  _exports._warnIfUsingStrippedFeatureFlags = _warnIfUsingStrippedFeatureFlags;
  if (true /* DEBUG */ && !(0, _testing.isTesting)()) {
    if (typeof window !== 'undefined' && (_browserEnvironment.isFirefox || _browserEnvironment.isChrome) && window.addEventListener) {
      window.addEventListener('load', () => {
        if (document.documentElement && document.documentElement.dataset && !document.documentElement.dataset['emberExtension']) {
          var downloadURL;
          if (_browserEnvironment.isChrome) {
            downloadURL = 'https://chrome.google.com/webstore/detail/ember-inspector/bmdblncegkenkacieihfhpjfppoconhi';
          } else if (_browserEnvironment.isFirefox) {
            downloadURL = 'https://addons.mozilla.org/en-US/firefox/addon/ember-inspector/';
          }
          debug(`For more advanced debugging, install the Ember Inspector from ${downloadURL}`);
        }
      }, false);
    }
  }
});
define("@ember/debug/lib/capture-render-tree", ["exports", "@glimmer/util"], function (_exports, _util) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.default = captureRenderTree;
  /**
    @module @ember/debug
  */
  /**
    Ember Inspector calls this function to capture the current render tree.
  
    In production mode, this requires turning on `ENV._DEBUG_RENDER_TREE`
    before loading Ember.
  
    @private
    @static
    @method captureRenderTree
    @for @ember/debug
    @param app {ApplicationInstance} An `ApplicationInstance`.
    @since 3.14.0
  */
  function captureRenderTree(app) {
    // SAFETY: Ideally we'd assert here but that causes awkward circular requires since this is also in @ember/debug.
    // This is only for debug stuff so not very risky.
    var renderer = (0, _util.expect)(app.lookup('renderer:-dom'), `BUG: owner is missing renderer`);
    return renderer.debugRenderTree.capture();
  }
});
define("@ember/debug/lib/deprecate", ["exports", "@ember/-internals/environment", "@ember/debug/index", "@ember/debug/lib/handlers"], function (_exports, _environment, _index, _handlers) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.registerHandler = _exports.missingOptionsIdDeprecation = _exports.missingOptionsDeprecation = _exports.missingOptionDeprecation = _exports.default = void 0;
  /**
   @module @ember/debug
   @public
  */
  /**
    Allows for runtime registration of handler functions that override the default deprecation behavior.
    Deprecations are invoked by calls to [@ember/debug/deprecate](/ember/release/classes/@ember%2Fdebug/methods/deprecate?anchor=deprecate).
    The following example demonstrates its usage by registering a handler that throws an error if the
    message contains the word "should", otherwise defers to the default handler.
  
    ```javascript
    import { registerDeprecationHandler } from '@ember/debug';
  
    registerDeprecationHandler((message, options, next) => {
      if (message.indexOf('should') !== -1) {
        throw new Error(`Deprecation message with should: ${message}`);
      } else {
        // defer to whatever handler was registered before this one
        next(message, options);
      }
    });
    ```
  
    The handler function takes the following arguments:
  
    <ul>
      <li> <code>message</code> - The message received from the deprecation call.</li>
      <li> <code>options</code> - An object passed in with the deprecation call containing additional information including:</li>
        <ul>
          <li> <code>id</code> - An id of the deprecation in the form of <code>package-name.specific-deprecation</code>.</li>
          <li> <code>until</code> - The Ember version number the feature and deprecation will be removed in.</li>
        </ul>
      <li> <code>next</code> - A function that calls into the previously registered handler.</li>
    </ul>
  
    @public
    @static
    @method registerDeprecationHandler
    @for @ember/debug
    @param handler {Function} A function to handle deprecation calls.
    @since 2.1.0
  */
  var registerHandler = () => {};
  _exports.registerHandler = registerHandler;
  var missingOptionsDeprecation;
  _exports.missingOptionsDeprecation = missingOptionsDeprecation;
  var missingOptionsIdDeprecation;
  _exports.missingOptionsIdDeprecation = missingOptionsIdDeprecation;
  var missingOptionDeprecation = () => '';
  _exports.missingOptionDeprecation = missingOptionDeprecation;
  var deprecate = () => {};
  if (true /* DEBUG */) {
    _exports.registerHandler = registerHandler = function registerHandler(handler) {
      (0, _handlers.registerHandler)('deprecate', handler);
    };
    var formatMessage = function formatMessage(_message, options) {
      var message = _message;
      if (options?.id) {
        message = message + ` [deprecation id: ${options.id}]`;
      }
      if (options?.until) {
        message = message + ` This will be removed in ${options.for} ${options.until}.`;
      }
      if (options?.url) {
        message += ` See ${options.url} for more details.`;
      }
      return message;
    };
    registerHandler(function logDeprecationToConsole(message, options) {
      var updatedMessage = formatMessage(message, options);
      console.warn(`DEPRECATION: ${updatedMessage}`); // eslint-disable-line no-console
    });

    var captureErrorForStack;
    if (new Error().stack) {
      captureErrorForStack = () => new Error();
    } else {
      captureErrorForStack = () => {
        try {
          __fail__.fail();
          return;
        } catch (e) {
          return e;
        }
      };
    }
    registerHandler(function logDeprecationStackTrace(message, options, next) {
      if (_environment.ENV.LOG_STACKTRACE_ON_DEPRECATION) {
        var stackStr = '';
        var error = captureErrorForStack();
        var stack;
        if (error instanceof Error) {
          if (error.stack) {
            if (error['arguments']) {
              // Chrome
              stack = error.stack.replace(/^\s+at\s+/gm, '').replace(/^([^(]+?)([\n$])/gm, '{anonymous}($1)$2').replace(/^Object.<anonymous>\s*\(([^)]+)\)/gm, '{anonymous}($1)').split('\n');
              stack.shift();
            } else {
              // Firefox
              stack = error.stack.replace(/(?:\n@:0)?\s+$/m, '').replace(/^\(/gm, '{anonymous}(').split('\n');
            }
            stackStr = `\n    ${stack.slice(2).join('\n    ')}`;
          }
        }
        var updatedMessage = formatMessage(message, options);
        console.warn(`DEPRECATION: ${updatedMessage}${stackStr}`); // eslint-disable-line no-console
      } else {
        next(message, options);
      }
    });
    registerHandler(function raiseOnDeprecation(message, options, next) {
      if (_environment.ENV.RAISE_ON_DEPRECATION) {
        var updatedMessage = formatMessage(message);
        throw new Error(updatedMessage);
      } else {
        next(message, options);
      }
    });
    _exports.missingOptionsDeprecation = missingOptionsDeprecation = 'When calling `deprecate` you ' + 'must provide an `options` hash as the third parameter.  ' + '`options` should include `id` and `until` properties.';
    _exports.missingOptionsIdDeprecation = missingOptionsIdDeprecation = 'When calling `deprecate` you must provide `id` in options.';
    _exports.missingOptionDeprecation = missingOptionDeprecation = (id, missingOption) => {
      return `When calling \`deprecate\` you must provide \`${missingOption}\` in options. Missing options.${missingOption} in "${id}" deprecation`;
    };
    /**
     @module @ember/debug
     @public
     */
    /**
      Display a deprecation warning with the provided message and a stack trace
      (Chrome and Firefox only).
         Ember itself leverages [Semantic Versioning](https://semver.org) to aid
      projects in keeping up with changes to the framework. Before any
      functionality or API is removed, it first flows linearly through a
      deprecation staging process. The staging process currently contains two
      stages: available and enabled.
         Deprecations are initially released into the 'available' stage.
      Deprecations will stay in this stage until the replacement API has been
      marked as a recommended practice via the RFC process and the addon
      ecosystem has generally adopted the change.
         Once a deprecation meets the above criteria, it will move into the
      'enabled' stage where it will remain until the functionality or API is
      eventually removed.
         For application and addon developers, "available" deprecations are not
      urgent and "enabled" deprecations require action.
         * In a production build, this method is defined as an empty function (NOP).
      Uses of this method in Ember itself are stripped from the ember.prod.js build.
         ```javascript
      import { deprecate } from '@ember/debug';
         deprecate(
        'Use of `assign` has been deprecated. Please use `Object.assign` or the spread operator instead.',
        false,
        {
          id: 'ember-polyfills.deprecate-assign',
          until: '5.0.0',
          url: 'https://deprecations.emberjs.com/v4.x/#toc_ember-polyfills-deprecate-assign',
          for: 'ember-source',
          since: {
            available: '4.0.0',
            enabled: '4.0.0',
          },
        }
      );
      ```
         @method deprecate
      @for @ember/debug
      @param {String} message A description of the deprecation.
      @param {Boolean} test A boolean. If falsy, the deprecation will be displayed.
      @param {Object} options
      @param {String} options.id A unique id for this deprecation. The id can be
        used by Ember debugging tools to change the behavior (raise, log or silence)
        for that specific deprecation. The id should be namespaced by dots, e.g.
        "view.helper.select".
      @param {string} options.until The version of Ember when this deprecation
        warning will be removed.
      @param {String} options.for A namespace for the deprecation, usually the package name
      @param {Object} options.since Describes when the deprecation became available and enabled.
      @param {String} [options.url] An optional url to the transition guide on the
            emberjs.com website.
      @static
      @public
      @since 1.0.0
    */
    deprecate = function deprecate(message, test, options) {
      (0, _index.assert)(missingOptionsDeprecation, Boolean(options && (options.id || options.until)));
      (0, _index.assert)(missingOptionsIdDeprecation, Boolean(options.id));
      (0, _index.assert)(missingOptionDeprecation(options.id, 'until'), Boolean(options.until));
      (0, _index.assert)(missingOptionDeprecation(options.id, 'for'), Boolean(options.for));
      (0, _index.assert)(missingOptionDeprecation(options.id, 'since'), Boolean(options.since));
      (0, _handlers.invoke)('deprecate', message, test, options);
    };
  }
  var _default = deprecate;
  _exports.default = _default;
});
define("@ember/debug/lib/handlers", ["exports"], function (_exports) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.registerHandler = _exports.invoke = _exports.HANDLERS = void 0;
  var HANDLERS = {};
  _exports.HANDLERS = HANDLERS;
  var registerHandler = function registerHandler(_type, _callback) {};
  _exports.registerHandler = registerHandler;
  var invoke = () => {};
  _exports.invoke = invoke;
  if (true /* DEBUG */) {
    _exports.registerHandler = registerHandler = function registerHandler(type, callback) {
      var nextHandler = HANDLERS[type] || (() => {});
      HANDLERS[type] = (message, options) => {
        callback(message, options, nextHandler);
      };
    };
    _exports.invoke = invoke = function invoke(type, message, test, options) {
      if (test) {
        return;
      }
      var handlerForType = HANDLERS[type];
      if (handlerForType) {
        handlerForType(message, options);
      }
    };
  }
});
define("@ember/debug/lib/inspect", ["exports", "@glimmer/util", "@ember/debug"], function (_exports, _util, _debug) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.default = inspect;
  var {
    toString: objectToString
  } = Object.prototype;
  var {
    toString: functionToString
  } = Function.prototype;
  var {
    isArray
  } = Array;
  var {
    keys: objectKeys
  } = Object;
  var {
    stringify
  } = JSON;
  var LIST_LIMIT = 100;
  var DEPTH_LIMIT = 4;
  var SAFE_KEY = /^[\w$]+$/;
  /**
   @module @ember/debug
  */
  /**
    Convenience method to inspect an object. This method will attempt to
    convert the object into a useful string description.
  
    It is a pretty simple implementation. If you want something more robust,
    use something like JSDump: https://github.com/NV/jsDump
  
    @method inspect
    @static
    @param {Object} obj The object you want to inspect.
    @return {String} A description of the object
    @since 1.4.0
    @private
  */
  function inspect(obj) {
    // detect Node util.inspect call inspect(depth: number, opts: object)
    if (typeof obj === 'number' && arguments.length === 2) {
      return this;
    }
    return inspectValue(obj, 0);
  }
  function inspectValue(value, depth, seen) {
    var valueIsArray = false;
    switch (typeof value) {
      case 'undefined':
        return 'undefined';
      case 'object':
        if (value === null) return 'null';
        if (isArray(value)) {
          valueIsArray = true;
          break;
        }
        // is toString Object.prototype.toString or undefined then traverse
        if (value.toString === objectToString || value.toString === undefined) {
          break;
        }
        // custom toString
        return value.toString();
      case 'function':
        return value.toString === functionToString ? value.name ? `[Function:${value.name}]` : `[Function]` : value.toString();
      case 'string':
        return stringify(value);
      case 'symbol':
      case 'boolean':
      case 'number':
      default:
        return value.toString();
    }
    if (seen === undefined) {
      seen = new _util._WeakSet();
    } else {
      if (seen.has(value)) return `[Circular]`;
    }
    seen.add(value);
    return valueIsArray ? inspectArray(value, depth + 1, seen) : inspectObject(value, depth + 1, seen);
  }
  function inspectKey(key) {
    return SAFE_KEY.test(key) ? key : stringify(key);
  }
  function inspectObject(obj, depth, seen) {
    if (depth > DEPTH_LIMIT) {
      return '[Object]';
    }
    var s = '{';
    var keys = objectKeys(obj);
    for (var i = 0; i < keys.length; i++) {
      s += i === 0 ? ' ' : ', ';
      if (i >= LIST_LIMIT) {
        s += `... ${keys.length - LIST_LIMIT} more keys`;
        break;
      }
      var key = keys[i];
      (true && !(key) && (0, _debug.assert)('has key', key)); // Looping over array
      s += `${inspectKey(String(key))}: ${inspectValue(obj[key], depth, seen)}`;
    }
    s += ' }';
    return s;
  }
  function inspectArray(arr, depth, seen) {
    if (depth > DEPTH_LIMIT) {
      return '[Array]';
    }
    var s = '[';
    for (var i = 0; i < arr.length; i++) {
      s += i === 0 ? ' ' : ', ';
      if (i >= LIST_LIMIT) {
        s += `... ${arr.length - LIST_LIMIT} more items`;
        break;
      }
      s += inspectValue(arr[i], depth, seen);
    }
    s += ' ]';
    return s;
  }
});
define("@ember/debug/lib/testing", ["exports"], function (_exports) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.isTesting = isTesting;
  _exports.setTesting = setTesting;
  var testing = false;
  function isTesting() {
    return testing;
  }
  function setTesting(value) {
    testing = Boolean(value);
  }
});
define("@ember/debug/lib/warn", ["exports", "@ember/debug/index", "@ember/debug/lib/handlers"], function (_exports, _index, _handlers) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.registerHandler = _exports.missingOptionsIdDeprecation = _exports.missingOptionsDeprecation = _exports.default = void 0;
  var registerHandler = () => {};
  _exports.registerHandler = registerHandler;
  var warn = () => {};
  var missingOptionsDeprecation;
  _exports.missingOptionsDeprecation = missingOptionsDeprecation;
  var missingOptionsIdDeprecation;
  /**
  @module @ember/debug
  */
  _exports.missingOptionsIdDeprecation = missingOptionsIdDeprecation;
  if (true /* DEBUG */) {
    /**
      Allows for runtime registration of handler functions that override the default warning behavior.
      Warnings are invoked by calls made to [@ember/debug/warn](/ember/release/classes/@ember%2Fdebug/methods/warn?anchor=warn).
      The following example demonstrates its usage by registering a handler that does nothing overriding Ember's
      default warning behavior.
         ```javascript
      import { registerWarnHandler } from '@ember/debug';
         // next is not called, so no warnings get the default behavior
      registerWarnHandler(() => {});
      ```
         The handler function takes the following arguments:
         <ul>
        <li> <code>message</code> - The message received from the warn call. </li>
        <li> <code>options</code> - An object passed in with the warn call containing additional information including:</li>
          <ul>
            <li> <code>id</code> - An id of the warning in the form of <code>package-name.specific-warning</code>.</li>
          </ul>
        <li> <code>next</code> - A function that calls into the previously registered handler.</li>
      </ul>
         @public
      @static
      @method registerWarnHandler
      @for @ember/debug
      @param handler {Function} A function to handle warnings.
      @since 2.1.0
    */
    _exports.registerHandler = registerHandler = function registerHandler(handler) {
      (0, _handlers.registerHandler)('warn', handler);
    };
    registerHandler(function logWarning(message) {
      /* eslint-disable no-console */
      console.warn(`WARNING: ${message}`);
      /* eslint-enable no-console */
    });

    _exports.missingOptionsDeprecation = missingOptionsDeprecation = 'When calling `warn` you ' + 'must provide an `options` hash as the third parameter.  ' + '`options` should include an `id` property.';
    _exports.missingOptionsIdDeprecation = missingOptionsIdDeprecation = 'When calling `warn` you must provide `id` in options.';
    /**
      Display a warning with the provided message.
         * In a production build, this method is defined as an empty function (NOP).
      Uses of this method in Ember itself are stripped from the ember.prod.js build.
         ```javascript
      import { warn } from '@ember/debug';
      import tomsterCount from './tomster-counter'; // a module in my project
         // Log a warning if we have more than 3 tomsters
      warn('Too many tomsters!', tomsterCount <= 3, {
        id: 'ember-debug.too-many-tomsters'
      });
      ```
         @method warn
      @for @ember/debug
      @static
      @param {String} message A warning to display.
      @param {Boolean} test An optional boolean. If falsy, the warning
        will be displayed.
      @param {Object} options An object that can be used to pass a unique
        `id` for this warning.  The `id` can be used by Ember debugging tools
        to change the behavior (raise, log, or silence) for that specific warning.
        The `id` should be namespaced by dots, e.g. "ember-debug.feature-flag-with-features-stripped"
      @public
      @since 1.0.0
    */
    warn = function warn(message, test, options) {
      if (arguments.length === 2 && typeof test === 'object') {
        options = test;
        test = false;
      }
      (0, _index.assert)(missingOptionsDeprecation, Boolean(options));
      (0, _index.assert)(missingOptionsIdDeprecation, Boolean(options && options.id));
      // SAFETY: we checked this by way of the `arguments` check above.
      (0, _handlers.invoke)('warn', message, test, options);
    };
  }
  var _default = warn;
  _exports.default = _default;
});
define("ember-testing/index", ["exports", "ember-testing/lib/test", "ember-testing/lib/adapters/adapter", "ember-testing/lib/setup_for_testing", "ember-testing/lib/adapters/qunit", "ember-testing/lib/ext/application", "ember-testing/lib/ext/rsvp", "ember-testing/lib/helpers", "ember-testing/lib/initializers"], function (_exports, _test, _adapter, _setup_for_testing, _qunit, _application, _rsvp, _helpers, _initializers) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  Object.defineProperty(_exports, "Adapter", {
    enumerable: true,
    get: function () {
      return _adapter.default;
    }
  });
  Object.defineProperty(_exports, "QUnitAdapter", {
    enumerable: true,
    get: function () {
      return _qunit.default;
    }
  });
  Object.defineProperty(_exports, "Test", {
    enumerable: true,
    get: function () {
      return _test.default;
    }
  });
  Object.defineProperty(_exports, "setupForTesting", {
    enumerable: true,
    get: function () {
      return _setup_for_testing.default;
    }
  });
});
define("ember-testing/lib/adapters/adapter", ["exports", "@ember/object"], function (_exports, _object) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.default = void 0;
  var Adapter = _object.default.extend({
    /**
      This callback will be called whenever an async operation is about to start.
         Override this to call your framework's methods that handle async
      operations.
         @public
      @method asyncStart
    */
    asyncStart() {},
    /**
      This callback will be called whenever an async operation has completed.
         @public
      @method asyncEnd
    */
    asyncEnd() {},
    /**
      Override this method with your testing framework's false assertion.
      This function is called whenever an exception occurs causing the testing
      promise to fail.
         QUnit example:
         ```javascript
        exception: function(error) {
          ok(false, error);
        };
      ```
         @public
      @method exception
      @param {String} error The exception to be raised.
    */
    exception(error) {
      throw error;
    }
  });
  var _default = Adapter;
  _exports.default = _default;
});
define("ember-testing/lib/adapters/qunit", ["exports", "@ember/debug", "ember-testing/lib/adapters/adapter"], function (_exports, _debug, _adapter) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.default = void 0;
  /* globals QUnit */

  function isVeryOldQunit(obj) {
    return obj != null && typeof obj.stop === 'function';
  }
  var QUnitAdapter = _adapter.default.extend({
    init() {
      this.doneCallbacks = [];
    },
    asyncStart() {
      if (isVeryOldQunit(QUnit)) {
        // very old QUnit version
        // eslint-disable-next-line qunit/no-qunit-stop
        QUnit.stop();
      } else {
        this.doneCallbacks.push(QUnit.config.current ? QUnit.config.current.assert.async() : null);
      }
    },
    asyncEnd() {
      // checking for QUnit.stop here (even though we _need_ QUnit.start) because
      // QUnit.start() still exists in QUnit 2.x (it just throws an error when calling
      // inside a test context)
      if (isVeryOldQunit(QUnit)) {
        QUnit.start();
      } else {
        var done = this.doneCallbacks.pop();
        // This can be null if asyncStart() was called outside of a test
        if (done) {
          done();
        }
      }
    },
    exception(error) {
      QUnit.config.current.assert.ok(false, (0, _debug.inspect)(error));
    }
  });
  var _default = QUnitAdapter;
  _exports.default = _default;
});
define("ember-testing/lib/ext/application", ["@ember/application", "ember-testing/lib/setup_for_testing", "ember-testing/lib/test/helpers", "ember-testing/lib/test/promise", "ember-testing/lib/test/run", "ember-testing/lib/test/on_inject_helpers", "ember-testing/lib/test/adapter", "@ember/debug"], function (_application, _setup_for_testing, _helpers, _promise, _run, _on_inject_helpers, _adapter, _debug) {
  "use strict";

  _application.default.reopen({
    /**
     This property contains the testing helpers for the current application. These
     are created once you call `injectTestHelpers` on your `Application`
     instance. The included helpers are also available on the `window` object by
     default, but can be used from this object on the individual application also.
         @property testHelpers
      @type {Object}
      @default {}
      @public
    */
    testHelpers: {},
    /**
     This property will contain the original methods that were registered
     on the `helperContainer` before `injectTestHelpers` is called.
        When `removeTestHelpers` is called, these methods are restored to the
     `helperContainer`.
         @property originalMethods
      @type {Object}
      @default {}
      @private
      @since 1.3.0
    */
    originalMethods: {},
    /**
    This property indicates whether or not this application is currently in
    testing mode. This is set when `setupForTesting` is called on the current
    application.
       @property testing
    @type {Boolean}
    @default false
    @since 1.3.0
    @public
    */
    testing: false,
    /**
      This hook defers the readiness of the application, so that you can start
      the app when your tests are ready to run. It also sets the router's
      location to 'none', so that the window's location will not be modified
      (preventing both accidental leaking of state between tests and interference
      with your testing framework). `setupForTesting` should only be called after
      setting a custom `router` class (for example `App.Router = Router.extend(`).
         Example:
         ```
      App.setupForTesting();
      ```
         @method setupForTesting
      @public
    */
    setupForTesting() {
      (0, _setup_for_testing.default)();
      this.testing = true;
      this.resolveRegistration('router:main').reopen({
        location: 'none'
      });
    },
    /**
      This will be used as the container to inject the test helpers into. By
      default the helpers are injected into `window`.
         @property helperContainer
      @type {Object} The object to be used for test helpers.
      @default window
      @since 1.2.0
      @private
    */
    helperContainer: null,
    /**
      This injects the test helpers into the `helperContainer` object. If an object is provided
      it will be used as the helperContainer. If `helperContainer` is not set it will default
      to `window`. If a function of the same name has already been defined it will be cached
      (so that it can be reset if the helper is removed with `unregisterHelper` or
      `removeTestHelpers`).
         Any callbacks registered with `onInjectHelpers` will be called once the
      helpers have been injected.
         Example:
      ```
      App.injectTestHelpers();
      ```
         @method injectTestHelpers
      @public
    */
    injectTestHelpers(helperContainer) {
      if (helperContainer) {
        this.helperContainer = helperContainer;
      } else {
        this.helperContainer = window;
      }
      this.reopen({
        willDestroy() {
          this._super(...arguments);
          this.removeTestHelpers();
        }
      });
      this.testHelpers = {};
      for (var name in _helpers.helpers) {
        // SAFETY: It is safe to access a property on an object
        this.originalMethods[name] = this.helperContainer[name];
        // SAFETY: It is not quite as safe to do this, but it _seems_ to be ok.
        this.testHelpers[name] = this.helperContainer[name] = helper(this, name);
        // SAFETY: We checked that it exists
        protoWrap(_promise.default.prototype, name, helper(this, name), _helpers.helpers[name].meta.wait);
      }
      (0, _on_inject_helpers.invokeInjectHelpersCallbacks)(this);
    },
    /**
      This removes all helpers that have been registered, and resets and functions
      that were overridden by the helpers.
         Example:
         ```javascript
      App.removeTestHelpers();
      ```
         @public
      @method removeTestHelpers
    */
    removeTestHelpers() {
      if (!this.helperContainer) {
        return;
      }
      for (var name in _helpers.helpers) {
        this.helperContainer[name] = this.originalMethods[name];
        // SAFETY: This is a weird thing, but it's not technically unsafe here.
        delete _promise.default.prototype[name];
        delete this.testHelpers[name];
        delete this.originalMethods[name];
      }
    }
  });
  // This method is no longer needed
  // But still here for backwards compatibility
  // of helper chaining
  function protoWrap(proto, name, callback, isAsync) {
    // SAFETY: This isn't entirely safe, but it _seems_ to be ok.
    proto[name] = function () {
      for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
        args[_key] = arguments[_key];
      }
      if (isAsync) {
        return callback.apply(this, args);
      } else {
        // SAFETY: This is not actually safe.
        return this.then(function () {
          return callback.apply(this, args);
        });
      }
    };
  }
  function helper(app, name) {
    var helper = _helpers.helpers[name];
    (true && !(helper) && (0, _debug.assert)(`[BUG] Missing helper: ${name}`, helper));
    var fn = helper.method;
    var meta = helper.meta;
    if (!meta.wait) {
      return function () {
        for (var _len2 = arguments.length, args = new Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
          args[_key2] = arguments[_key2];
        }
        return fn.apply(app, [app, ...args]);
      };
    }
    return function () {
      for (var _len3 = arguments.length, args = new Array(_len3), _key3 = 0; _key3 < _len3; _key3++) {
        args[_key3] = arguments[_key3];
      }
      var lastPromise = (0, _run.default)(() => (0, _promise.resolve)((0, _promise.getLastPromise)()));
      // wait for last helper's promise to resolve and then
      // execute. To be safe, we need to tell the adapter we're going
      // asynchronous here, because fn may not be invoked before we
      // return.
      (0, _adapter.asyncStart)();
      return lastPromise.then(() => fn.apply(app, [app, ...args])).finally(_adapter.asyncEnd);
    };
  }
});
define("ember-testing/lib/ext/rsvp", ["exports", "@ember/-internals/runtime", "@ember/runloop", "@ember/debug", "ember-testing/lib/test/adapter"], function (_exports, _runtime, _runloop, _debug, _adapter) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.default = void 0;
  _runtime.RSVP.configure('async', function (callback, promise) {
    // if schedule will cause autorun, we need to inform adapter
    if ((0, _debug.isTesting)() && !_runloop._backburner.currentInstance) {
      (0, _adapter.asyncStart)();
      _runloop._backburner.schedule('actions', () => {
        (0, _adapter.asyncEnd)();
        callback(promise);
      });
    } else {
      _runloop._backburner.schedule('actions', () => callback(promise));
    }
  });
  var _default = _runtime.RSVP;
  _exports.default = _default;
});
define("ember-testing/lib/helpers", ["ember-testing/lib/test/helpers", "ember-testing/lib/helpers/and_then", "ember-testing/lib/helpers/current_path", "ember-testing/lib/helpers/current_route_name", "ember-testing/lib/helpers/current_url", "ember-testing/lib/helpers/pause_test", "ember-testing/lib/helpers/visit", "ember-testing/lib/helpers/wait"], function (_helpers, _and_then, _current_path, _current_route_name, _current_url, _pause_test, _visit, _wait) {
  "use strict";

  (0, _helpers.registerAsyncHelper)('visit', _visit.default);
  (0, _helpers.registerAsyncHelper)('wait', _wait.default);
  (0, _helpers.registerAsyncHelper)('andThen', _and_then.default);
  (0, _helpers.registerAsyncHelper)('pauseTest', _pause_test.pauseTest);
  (0, _helpers.registerHelper)('currentRouteName', _current_route_name.default);
  (0, _helpers.registerHelper)('currentPath', _current_path.default);
  (0, _helpers.registerHelper)('currentURL', _current_url.default);
  (0, _helpers.registerHelper)('resumeTest', _pause_test.resumeTest);
});
define("ember-testing/lib/helpers/and_then", ["exports", "@ember/debug"], function (_exports, _debug) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.default = andThen;
  function andThen(app, callback) {
    var wait = app.testHelpers['wait'];
    (true && !(wait) && (0, _debug.assert)('[BUG] Missing wait helper', wait));
    return wait(callback(app));
  }
});
define("ember-testing/lib/helpers/current_path", ["exports", "@ember/object", "@ember/routing/-internals", "@ember/debug"], function (_exports, _object, _internals, _debug) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.default = currentPath;
  /**
  @module ember
  */

  /**
    Returns the current path.
  
  Example:
  
  ```javascript
  function validateURL() {
    equal(currentPath(), 'some.path.index', "correct path was transitioned into.");
  }
  
  click('#some-link-id').then(validateURL);
  ```
  
  @method currentPath
  @return {Object} The currently active path.
  @since 1.5.0
  @public
  */
  function currentPath(app) {
    (true && !(app.__container__) && (0, _debug.assert)('[BUG] app.__container__ is not set', app.__container__));
    var routingService = app.__container__.lookup('service:-routing');
    (true && !(routingService instanceof _internals.RoutingService) && (0, _debug.assert)('[BUG] service:-routing is not a RoutingService', routingService instanceof _internals.RoutingService));
    return (0, _object.get)(routingService, 'currentPath');
  }
});
define("ember-testing/lib/helpers/current_route_name", ["exports", "@ember/object", "@ember/routing/-internals", "@ember/debug"], function (_exports, _object, _internals, _debug) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.default = currentRouteName;
  /**
  @module ember
  */

  /**
    Returns the currently active route name.
  
  Example:
  
  ```javascript
  function validateRouteName() {
    equal(currentRouteName(), 'some.path', "correct route was transitioned into.");
  }
  visit('/some/path').then(validateRouteName)
  ```
  
  @method currentRouteName
  @return {Object} The name of the currently active route.
  @since 1.5.0
  @public
  */
  function currentRouteName(app) {
    (true && !(app.__container__) && (0, _debug.assert)('[BUG] app.__container__ is not set', app.__container__));
    var routingService = app.__container__.lookup('service:-routing');
    (true && !(routingService instanceof _internals.RoutingService) && (0, _debug.assert)('[BUG] service:-routing is not a RoutingService', routingService instanceof _internals.RoutingService));
    return (0, _object.get)(routingService, 'currentRouteName');
  }
});
define("ember-testing/lib/helpers/current_url", ["exports", "@ember/object", "@ember/debug", "@ember/routing/router"], function (_exports, _object, _debug, _router) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.default = currentURL;
  /**
  @module ember
  */

  /**
    Returns the current URL.
  
  Example:
  
  ```javascript
  function validateURL() {
    equal(currentURL(), '/some/path', "correct URL was transitioned into.");
  }
  
  click('#some-link-id').then(validateURL);
  ```
  
  @method currentURL
  @return {Object} The currently active URL.
  @since 1.5.0
  @public
  */
  function currentURL(app) {
    (true && !(app.__container__) && (0, _debug.assert)('[BUG] app.__container__ is not set', app.__container__));
    var router = app.__container__.lookup('router:main');
    (true && !(router instanceof _router.default) && (0, _debug.assert)('[BUG] router:main is not a Router', router instanceof _router.default));
    var location = (0, _object.get)(router, 'location');
    (true && !(typeof location !== 'string') && (0, _debug.assert)('[BUG] location is still a string', typeof location !== 'string'));
    return location.getURL();
  }
});
define("ember-testing/lib/helpers/pause_test", ["exports", "@ember/-internals/runtime", "@ember/debug"], function (_exports, _runtime, _debug) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.pauseTest = pauseTest;
  _exports.resumeTest = resumeTest;
  /**
  @module ember
  */

  var resume;
  /**
   Resumes a test paused by `pauseTest`.
  
   @method resumeTest
   @return {void}
   @public
  */
  function resumeTest() {
    (true && !(resume) && (0, _debug.assert)('Testing has not been paused. There is nothing to resume.', resume));
    resume();
    resume = undefined;
  }
  /**
   Pauses the current test - this is useful for debugging while testing or for test-driving.
   It allows you to inspect the state of your application at any point.
   Example (The test will pause before clicking the button):
  
   ```javascript
   visit('/')
   return pauseTest();
   click('.btn');
   ```
  
   You may want to turn off the timeout before pausing.
  
   qunit (timeout available to use as of 2.4.0):
  
   ```
   visit('/');
   assert.timeout(0);
   return pauseTest();
   click('.btn');
   ```
  
   mocha (timeout happens automatically as of ember-mocha v0.14.0):
  
   ```
   visit('/');
   this.timeout(0);
   return pauseTest();
   click('.btn');
   ```
  
  
   @since 1.9.0
   @method pauseTest
   @return {Object} A promise that will never resolve
   @public
  */
  function pauseTest() {
    (0, _debug.info)('Testing paused. Use `resumeTest()` to continue.');
    return new _runtime.RSVP.Promise(resolve => {
      resume = resolve;
    }, 'TestAdapter paused promise');
  }
});
define("ember-testing/lib/helpers/visit", ["exports", "@ember/debug", "@ember/routing/router", "@ember/runloop"], function (_exports, _debug, _router, _runloop) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.default = visit;
  /**
    Loads a route, sets up any controllers, and renders any templates associated
    with the route as though a real user had triggered the route change while
    using your app.
  
    Example:
  
    ```javascript
    visit('posts/index').then(function() {
      // assert something
    });
    ```
  
    @method visit
    @param {String} url the name of the route
    @return {RSVP.Promise<undefined>}
    @public
  */
  function visit(app, url) {
    (true && !(app.__container__) && (0, _debug.assert)('[BUG] Missing container', app.__container__));
    var router = app.__container__.lookup('router:main');
    (true && !(router instanceof _router.default) && (0, _debug.assert)('[BUG] router:main is not a Router', router instanceof _router.default));
    var shouldHandleURL = false;
    app.boot().then(() => {
      (true && !(typeof router.location !== 'string') && (0, _debug.assert)('[BUG] router.location is still a string', typeof router.location !== 'string'));
      router.location.setURL(url);
      if (shouldHandleURL) {
        (true && !(app.__deprecatedInstance__) && (0, _debug.assert)("[BUG] __deprecatedInstance__ isn't set", app.__deprecatedInstance__));
        (0, _runloop.run)(app.__deprecatedInstance__, 'handleURL', url);
      }
    });
    if (app._readinessDeferrals > 0) {
      // SAFETY: This should be safe, though it is odd.
      router.initialURL = url;
      (0, _runloop.run)(app, 'advanceReadiness');
      delete router.initialURL;
    } else {
      shouldHandleURL = true;
    }
    var wait = app.testHelpers['wait'];
    (true && !(wait) && (0, _debug.assert)('[BUG] missing wait helper', wait));
    return wait();
  }
});
define("ember-testing/lib/helpers/wait", ["exports", "ember-testing/lib/test/waiters", "@ember/-internals/runtime", "@ember/runloop", "ember-testing/lib/test/pending_requests", "@ember/debug", "@ember/routing/router"], function (_exports, _waiters, _runtime, _runloop, _pending_requests, _debug, _router) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.default = wait;
  /**
  @module ember
  */

  /**
    Causes the run loop to process any pending events. This is used to ensure that
    any async operations from other helpers (or your assertions) have been processed.
  
    This is most often used as the return value for the helper functions (see 'click',
    'fillIn','visit',etc). However, there is a method to register a test helper which
    utilizes this method without the need to actually call `wait()` in your helpers.
  
    The `wait` helper is built into `registerAsyncHelper` by default. You will not need
    to `return app.testHelpers.wait();` - the wait behavior is provided for you.
  
    Example:
  
    ```javascript
    import { registerAsyncHelper } from '@ember/test';
  
    registerAsyncHelper('loginUser', function(app, username, password) {
      visit('secured/path/here')
        .fillIn('#username', username)
        .fillIn('#password', password)
        .click('.submit');
    });
    ```
  
    @method wait
    @param {Object} value The value to be returned.
    @return {RSVP.Promise<any>} Promise that resolves to the passed value.
    @public
    @since 1.0.0
  */
  function wait(app, value) {
    return new _runtime.RSVP.Promise(function (resolve) {
      (true && !(app.__container__) && (0, _debug.assert)('[BUG] Missing container', app.__container__));
      var router = app.__container__.lookup('router:main');
      (true && !(router instanceof _router.default) && (0, _debug.assert)('[BUG] Expected router:main to be a subclass of Ember Router', router instanceof _router.default)); // Every 10ms, poll for the async thing to have finished
      var watcher = setInterval(() => {
        // 1. If the router is loading, keep polling
        var routerIsLoading = router._routerMicrolib && Boolean(router._routerMicrolib.activeTransition);
        if (routerIsLoading) {
          return;
        }
        // 2. If there are pending Ajax requests, keep polling
        if ((0, _pending_requests.pendingRequests)()) {
          return;
        }
        // 3. If there are scheduled timers or we are inside of a run loop, keep polling
        if ((0, _runloop._hasScheduledTimers)() || (0, _runloop._getCurrentRunLoop)()) {
          return;
        }
        if ((0, _waiters.checkWaiters)()) {
          return;
        }
        // Stop polling
        clearInterval(watcher);
        // Synchronously resolve the promise
        (0, _runloop.run)(null, resolve, value);
      }, 10);
    });
  }
});
define("ember-testing/lib/initializers", ["@ember/application"], function (_application) {
  "use strict";

  var name = 'deferReadiness in `testing` mode';
  (0, _application.onLoad)('Ember.Application', function (ApplicationClass) {
    if (!ApplicationClass.initializers[name]) {
      ApplicationClass.initializer({
        name: name,
        initialize(application) {
          if (application.testing) {
            application.deferReadiness();
          }
        }
      });
    }
  });
});
define("ember-testing/lib/setup_for_testing", ["exports", "@ember/debug", "ember-testing/lib/test/adapter", "ember-testing/lib/adapters/adapter", "ember-testing/lib/adapters/qunit"], function (_exports, _debug, _adapter, _adapter2, _qunit) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.default = setupForTesting;
  /* global self */

  /**
    Sets Ember up for testing. This is useful to perform
    basic setup steps in order to unit test.
  
    Use `App.setupForTesting` to perform integration tests (full
    application testing).
  
    @method setupForTesting
    @namespace Ember
    @since 1.5.0
    @private
  */
  function setupForTesting() {
    (0, _debug.setTesting)(true);
    var adapter = (0, _adapter.getAdapter)();
    // if adapter is not manually set default to QUnit
    if (!adapter) {
      (0, _adapter.setAdapter)(typeof self.QUnit === 'undefined' ? _adapter2.default.create() : _qunit.default.create());
    }
  }
});
define("ember-testing/lib/test", ["exports", "ember-testing/lib/test/helpers", "ember-testing/lib/test/on_inject_helpers", "ember-testing/lib/test/promise", "ember-testing/lib/test/waiters", "ember-testing/lib/test/adapter"], function (_exports, _helpers, _on_inject_helpers, _promise, _waiters, _adapter) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.default = void 0;
  /**
    @module ember
  */

  /**
    This is a container for an assortment of testing related functionality:
  
    * Choose your default test adapter (for your framework of choice).
    * Register/Unregister additional test helpers.
    * Setup callbacks to be fired when the test helpers are injected into
      your application.
  
    @class Test
    @namespace Ember
    @public
  */
  var Test = {
    /**
      Hash containing all known test helpers.
         @property _helpers
      @private
      @since 1.7.0
    */
    _helpers: _helpers.helpers,
    registerHelper: _helpers.registerHelper,
    registerAsyncHelper: _helpers.registerAsyncHelper,
    unregisterHelper: _helpers.unregisterHelper,
    onInjectHelpers: _on_inject_helpers.onInjectHelpers,
    Promise: _promise.default,
    promise: _promise.promise,
    resolve: _promise.resolve,
    registerWaiter: _waiters.registerWaiter,
    unregisterWaiter: _waiters.unregisterWaiter,
    checkWaiters: _waiters.checkWaiters
  };
  /**
   Used to allow ember-testing to communicate with a specific testing
   framework.
  
   You can manually set it before calling `App.setupForTesting()`.
  
   Example:
  
   ```javascript
   Ember.Test.adapter = MyCustomAdapter.create()
   ```
  
   If you do not set it, ember-testing will default to `Ember.Test.QUnitAdapter`.
  
   @public
   @for Ember.Test
   @property adapter
   @type {Class} The adapter to be used.
   @default Ember.Test.QUnitAdapter
  */
  Object.defineProperty(Test, 'adapter', {
    get: _adapter.getAdapter,
    set: _adapter.setAdapter
  });
  var _default = Test;
  _exports.default = _default;
});
define("ember-testing/lib/test/adapter", ["exports", "@ember/-internals/error-handling"], function (_exports, _errorHandling) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.asyncEnd = asyncEnd;
  _exports.asyncStart = asyncStart;
  _exports.getAdapter = getAdapter;
  _exports.setAdapter = setAdapter;
  var adapter;
  function getAdapter() {
    return adapter;
  }
  function setAdapter(value) {
    adapter = value;
    if (value && typeof value.exception === 'function') {
      (0, _errorHandling.setDispatchOverride)(adapterDispatch);
    } else {
      (0, _errorHandling.setDispatchOverride)(null);
    }
  }
  function asyncStart() {
    if (adapter) {
      adapter.asyncStart();
    }
  }
  function asyncEnd() {
    if (adapter) {
      adapter.asyncEnd();
    }
  }
  function adapterDispatch(error) {
    adapter.exception(error);
    // @ts-expect-error Normally unreachable
    console.error(error.stack); // eslint-disable-line no-console
  }
});
define("ember-testing/lib/test/helpers", ["exports", "ember-testing/lib/test/promise"], function (_exports, _promise) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.helpers = void 0;
  _exports.registerAsyncHelper = registerAsyncHelper;
  _exports.registerHelper = registerHelper;
  _exports.unregisterHelper = unregisterHelper;
  var helpers = {};
  /**
   @module @ember/test
  */
  /**
    `registerHelper` is used to register a test helper that will be injected
    when `App.injectTestHelpers` is called.
  
    The helper method will always be called with the current Application as
    the first parameter.
  
    For example:
  
    ```javascript
    import { registerHelper } from '@ember/test';
    import { run } from '@ember/runloop';
  
    registerHelper('boot', function(app) {
      run(app, app.advanceReadiness);
    });
    ```
  
    This helper can later be called without arguments because it will be
    called with `app` as the first parameter.
  
    ```javascript
    import Application from '@ember/application';
  
    App = Application.create();
    App.injectTestHelpers();
    boot();
    ```
  
    @public
    @for @ember/test
    @static
    @method registerHelper
    @param {String} name The name of the helper method to add.
    @param {Function} helperMethod
    @param options {Object}
  */
  _exports.helpers = helpers;
  function registerHelper(name, helperMethod) {
    helpers[name] = {
      method: helperMethod,
      meta: {
        wait: false
      }
    };
  }
  /**
    `registerAsyncHelper` is used to register an async test helper that will be injected
    when `App.injectTestHelpers` is called.
  
    The helper method will always be called with the current Application as
    the first parameter.
  
    For example:
  
    ```javascript
    import { registerAsyncHelper } from '@ember/test';
    import { run } from '@ember/runloop';
  
    registerAsyncHelper('boot', function(app) {
      run(app, app.advanceReadiness);
    });
    ```
  
    The advantage of an async helper is that it will not run
    until the last async helper has completed.  All async helpers
    after it will wait for it complete before running.
  
  
    For example:
  
    ```javascript
    import { registerAsyncHelper } from '@ember/test';
  
    registerAsyncHelper('deletePost', function(app, postId) {
      click('.delete-' + postId);
    });
  
    // ... in your test
    visit('/post/2');
    deletePost(2);
    visit('/post/3');
    deletePost(3);
    ```
  
    @public
    @for @ember/test
    @method registerAsyncHelper
    @param {String} name The name of the helper method to add.
    @param {Function} helperMethod
    @since 1.2.0
  */
  function registerAsyncHelper(name, helperMethod) {
    helpers[name] = {
      method: helperMethod,
      meta: {
        wait: true
      }
    };
  }
  /**
    Remove a previously added helper method.
  
    Example:
  
    ```javascript
    import { unregisterHelper } from '@ember/test';
  
    unregisterHelper('wait');
    ```
  
    @public
    @method unregisterHelper
    @static
    @for @ember/test
    @param {String} name The helper to remove.
  */
  function unregisterHelper(name) {
    delete helpers[name];
    // SAFETY: This isn't necessarily a safe thing to do, but in terms of the immediate types here
    // it won't error.
    delete _promise.default.prototype[name];
  }
});
define("ember-testing/lib/test/on_inject_helpers", ["exports"], function (_exports) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.callbacks = void 0;
  _exports.invokeInjectHelpersCallbacks = invokeInjectHelpersCallbacks;
  _exports.onInjectHelpers = onInjectHelpers;
  var callbacks = [];
  /**
    Used to register callbacks to be fired whenever `App.injectTestHelpers`
    is called.
  
    The callback will receive the current application as an argument.
  
    Example:
  
    ```javascript
    import $ from 'jquery';
  
    Ember.Test.onInjectHelpers(function() {
      $(document).ajaxSend(function() {
        Test.pendingRequests++;
      });
  
      $(document).ajaxComplete(function() {
        Test.pendingRequests--;
      });
    });
    ```
  
    @public
    @for Ember.Test
    @method onInjectHelpers
    @param {Function} callback The function to be called.
  */
  _exports.callbacks = callbacks;
  function onInjectHelpers(callback) {
    callbacks.push(callback);
  }
  function invokeInjectHelpersCallbacks(app) {
    for (var callback of callbacks) {
      callback(app);
    }
  }
});
define("ember-testing/lib/test/pending_requests", ["exports"], function (_exports) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.clearPendingRequests = clearPendingRequests;
  _exports.decrementPendingRequests = decrementPendingRequests;
  _exports.incrementPendingRequests = incrementPendingRequests;
  _exports.pendingRequests = pendingRequests;
  var requests = [];
  function pendingRequests() {
    return requests.length;
  }
  function clearPendingRequests() {
    requests.length = 0;
  }
  function incrementPendingRequests(_, xhr) {
    requests.push(xhr);
  }
  function decrementPendingRequests(_, xhr) {
    setTimeout(function () {
      for (var i = 0; i < requests.length; i++) {
        if (xhr === requests[i]) {
          requests.splice(i, 1);
          break;
        }
      }
    }, 0);
  }
});
define("ember-testing/lib/test/promise", ["exports", "@ember/-internals/runtime", "ember-testing/lib/test/run"], function (_exports, _runtime, _run) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.default = void 0;
  _exports.getLastPromise = getLastPromise;
  _exports.promise = promise;
  _exports.resolve = resolve;
  var lastPromise = null;
  class TestPromise extends _runtime.RSVP.Promise {
    constructor(executor, label) {
      super(executor, label);
      lastPromise = this;
    }
    then(onFulfilled, onRejected, label) {
      var normalizedOnFulfilled = typeof onFulfilled === 'function' ? result => isolate(onFulfilled, result) : undefined;
      return super.then(normalizedOnFulfilled, onRejected, label);
    }
  }
  /**
    This returns a thenable tailored for testing.  It catches failed
    `onSuccess` callbacks and invokes the `Ember.Test.adapter.exception`
    callback in the last chained then.
  
    This method should be returned by async helpers such as `wait`.
  
    @public
    @for Ember.Test
    @method promise
    @param {Function} resolver The function used to resolve the promise.
    @param {String} label An optional string for identifying the promise.
  */
  _exports.default = TestPromise;
  function promise(resolver, label) {
    var fullLabel = `Ember.Test.promise: ${label || '<Unknown Promise>'}`;
    return new TestPromise(resolver, fullLabel);
  }
  /**
    Replacement for `Ember.RSVP.resolve`
    The only difference is this uses
    an instance of `Ember.Test.Promise`
  
    @public
    @for Ember.Test
    @method resolve
    @param {Mixed} The value to resolve
    @since 1.2.0
  */
  function resolve(result, label) {
    return TestPromise.resolve(result, label);
  }
  function getLastPromise() {
    return lastPromise;
  }
  // This method isolates nested async methods
  // so that they don't conflict with other last promises.
  //
  // 1. Set `Ember.Test.lastPromise` to null
  // 2. Invoke method
  // 3. Return the last promise created during method
  function isolate(onFulfilled, result) {
    // Reset lastPromise for nested helpers
    lastPromise = null;
    var value = onFulfilled(result);
    var promise = lastPromise;
    lastPromise = null;
    // If the method returned a promise
    // return that promise. If not,
    // return the last async helper's promise
    if (value && value instanceof TestPromise || !promise) {
      return value;
    } else {
      return (0, _run.default)(() => resolve(promise).then(() => value));
    }
  }
});
define("ember-testing/lib/test/run", ["exports", "@ember/runloop"], function (_exports, _runloop) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.default = run;
  function run(fn) {
    if (!(0, _runloop._getCurrentRunLoop)()) {
      return (0, _runloop.run)(fn);
    } else {
      return fn();
    }
  }
});
define("ember-testing/lib/test/waiters", ["exports"], function (_exports) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.checkWaiters = checkWaiters;
  _exports.registerWaiter = registerWaiter;
  _exports.unregisterWaiter = unregisterWaiter;
  /**
   @module @ember/test
  */
  var contexts = [];
  var callbacks = [];
  function registerWaiter() {
    var checkedCallback;
    var checkedContext;
    if (arguments.length === 1) {
      checkedContext = null;
      checkedCallback = arguments.length <= 0 ? undefined : arguments[0];
    } else {
      checkedContext = arguments.length <= 0 ? undefined : arguments[0];
      checkedCallback = arguments.length <= 1 ? undefined : arguments[1];
    }
    if (indexOf(checkedContext, checkedCallback) > -1) {
      return;
    }
    contexts.push(checkedContext);
    callbacks.push(checkedCallback);
  }
  /**
     `unregisterWaiter` is used to unregister a callback that was
     registered with `registerWaiter`.
  
     @public
     @for @ember/test
     @static
     @method unregisterWaiter
     @param {Object} context (optional)
     @param {Function} callback
     @since 1.2.0
  */
  function unregisterWaiter(context, callback) {
    if (!callbacks.length) {
      return;
    }
    if (arguments.length === 1) {
      callback = context;
      context = null;
    }
    var i = indexOf(context, callback);
    if (i === -1) {
      return;
    }
    contexts.splice(i, 1);
    callbacks.splice(i, 1);
  }
  /**
    Iterates through each registered test waiter, and invokes
    its callback. If any waiter returns false, this method will return
    true indicating that the waiters have not settled yet.
  
    This is generally used internally from the acceptance/integration test
    infrastructure.
  
    @public
    @for @ember/test
    @static
    @method checkWaiters
  */
  function checkWaiters() {
    if (!callbacks.length) {
      return false;
    }
    for (var i = 0; i < callbacks.length; i++) {
      var context = contexts[i];
      var callback = callbacks[i];
      // SAFETY: The loop ensures that this exists
      if (!callback.call(context)) {
        return true;
      }
    }
    return false;
  }
  function indexOf(context, callback) {
    for (var i = 0; i < callbacks.length; i++) {
      if (callbacks[i] === callback && contexts[i] === context) {
        return i;
      }
    }
    return -1;
  }
});
require('ember-testing');
}());
(function() {
  var key = '_embroider_macros_runtime_config';
  if (!window[key]) {
    window[key] = [];
  }
  window[key].push(function(m) {
    m.setGlobalConfig(
      '@embroider/macros',
      Object.assign({}, m.getGlobalConfig()['@embroider/macros'], { isTesting: true })
    );
  });
})();

        var runningTests=true;
        if (typeof Testem !== 'undefined' && (typeof QUnit !== 'undefined' || typeof Mocha !== 'undefined')) {
          Testem.hookIntoTestFramework();
        }//# sourceMappingURL=test-support.map
