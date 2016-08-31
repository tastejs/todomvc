/*
 *  Sugar v1.5.0
 *
 *  Freely distributable and licensed under the MIT-style license.
 *  Copyright (c) Andrew Plummer
 *  https://sugarjs.com/
 *
 * ---------------------------- */
(function() {
  'use strict';

    /***
     * @module Core
     * @description Core method extension and restoration.
     ***/

    // The global context
    var globalContext = typeof global !== 'undefined' && global.Object ? global : this;

    // Internal hasOwnProperty
    var internalHasOwnProperty = Object.prototype.hasOwnProperty;

    // Property descriptors exist in IE8 but will error when trying to define a property on
    // native objects. IE8 does not have defineProperies, however, so this check saves a try/catch block.
    var propertyDescriptorSupport = !!(Object.defineProperty && Object.defineProperties);

    // Natives by name.
    var natives = 'Boolean,Number,String,Array,Date,RegExp,Function'.split(',');

    // A hash of all methods by Native class
    var SugarMethods = {};

    // Class extending methods

    function initializeClasses() {
      initializeClass(Object);
      iterateOverObject(natives, function(i, name) {
        initializeClass(globalContext[name]);
      });
    }

    function initializeClass(klass) {
      extend(klass, {
        'extend': function(methods, instance) {
          extend(klass, methods, instance !== false);
        },
        'sugarRestore': function(methods) {
          restore(klass, methods);
        },
        'sugarRevert': function(methods) {
          revert(klass, methods);
        }
      }, false);
    }

    function extend(klass, methods, instance, polyfill) {
      var extendee;
      instance = instance !== false;
      extendee = instance ? klass.prototype : klass;
      iterateOverObject(methods, function(name, prop) {
        var existing = extendee[name],
            original = checkOriginalMethod(klass, name);
        if (typeof polyfill === 'function' && existing) {
          prop = wrapExisting(existing, prop, polyfill);
        }
        storeMethod(klass, name, instance, existing, prop, polyfill);
        if (polyfill !== true || !existing) {
          setProperty(extendee, name, prop);
        }
      });
    }

    function alias(klass, target, source) {
      var method = SugarMethods[klass][source];
      var obj = {};
      obj[target] = method.fn;
      extend(klass, obj, method.instance);
    }

    function restore(klass, methods) {
      return batchMethodExecute(klass, methods, function(target, name, m) {
        setProperty(target, name, m.fn);
      });
    }

    function revert(klass, methods) {
      return batchMethodExecute(klass, methods, function(target, name, m) {
        var original = checkOriginalMethod(klass, name);
        if (m.original) {
          setProperty(target, name, m.original);
        } else {
          delete target[name];
        }
      });
    }

    function batchMethodExecute(klass, methods, fn) {
      var all = !methods, changed = false;
      if (typeof methods === 'string') methods = [methods];
      iterateOverObject(SugarMethods[klass], function(name, m) {
        if (all || methods.indexOf(name) !== -1) {
          changed = true;
          fn(m.instance ? klass.prototype : klass, name, m);
        }
      });
      return changed;
    }

    function checkOriginalMethod(klass, name) {
      var methods = SugarMethods[klass];
      var method = methods && methods[name];
      return method && method.original;
    }

    function wrapExisting(originalFn, extendedFn, condition) {
      return function(a) {
        return condition.apply(this, arguments) ?
               extendedFn.apply(this, arguments) :
               originalFn.apply(this, arguments);
      }
    }

    function wrapInstanceMethod(fn) {
      return function(obj) {
        var args = arguments, newArgs = [], i;
        for(i = 1;i < args.length;i++) {
          newArgs.push(args[i]);
        }
        return fn.apply(obj, newArgs);
      };
    }

    function storeMethod(klass, name, instance, existing, prop, polyfill) {
      var result = instance ? wrapInstanceMethod(prop) : prop;
      var methods = SugarMethods[klass];
      if (!methods) {
        methods = SugarMethods[klass] = {};
      }
      setProperty(methods, name, result, true);
      if (typeof prop === 'function') {
        setProperty(result, 'fn', prop);
        setProperty(result, 'original', existing);
        setProperty(result, 'instance', instance);
        setProperty(result, 'polyfill', polyfill);
      }
    }

    function setProperty(target, name, property, enumerable) {
      if (propertyDescriptorSupport) {
        Object.defineProperty(target, name, {
          value: property,
          enumerable: !!enumerable,
          configurable: true,
          writable: true
        });
      } else {
        target[name] = property;
      }
    }

    function iterateOverObject(obj, fn) {
      var key;
      for(key in obj) {
        if (!hasOwnProperty(obj, key)) continue;
        if (fn.call(obj, key, obj[key], obj) === false) break;
      }
    }

    function hasOwnProperty(obj, prop) {
      return !!obj && internalHasOwnProperty.call(obj, prop);
    }

    initializeClasses();


    /***
     * @module Common
     * @description Internal utility and common methods.
     ***/


    // Internal toString
    var internalToString = Object.prototype.toString;

    // Are regexes type function?
    var regexIsFunction = typeof RegExp() === 'function';

    // Do strings have no keys?
    var noKeysInStringObjects = !('0' in new String('a'));

    // Type check methods need a way to be accessed dynamically.
    var typeChecks = {};

    // Classes that can be matched by value
    var matchedByValueReg = /^\[object Date|Array|String|Number|RegExp|Boolean|Arguments\]$/;

    var isBoolean  = buildPrimitiveClassCheck('boolean', natives[0]);
    var isNumber   = buildPrimitiveClassCheck('number',  natives[1]);
    var isString   = buildPrimitiveClassCheck('string',  natives[2]);

    var isArray    = buildClassCheck(natives[3]);
    var isDate     = buildClassCheck(natives[4]);
    var isRegExp   = buildClassCheck(natives[5]);


    // Wanted to enhance performance here by using simply "typeof"
    // but Firefox has two major issues that make this impossible,
    // one fixed, the other not. Despite being typeof "function"
    // the objects below still report in as [object Function], so
    // we need to perform a full class check here.
    //
    // 1. Regexes can be typeof "function" in FF < 3
    //    https://bugzilla.mozilla.org/show_bug.cgi?id=61911 (fixed)
    //
    // 2. HTMLEmbedElement and HTMLObjectElement are be typeof "function"
    //    https://bugzilla.mozilla.org/show_bug.cgi?id=268945 (won't fix)
    //
    var isFunction = buildClassCheck(natives[6]);

    function isClass(obj, klass, cached) {
      var k = cached || className(obj);
      return k === '[object '+klass+']';
    }

    function buildClassCheck(klass) {
      var fn = (klass === 'Array' && Array.isArray) || function(obj, cached) {
        return isClass(obj, klass, cached);
      };
      typeChecks[klass] = fn;
      return fn;
    }

    function buildPrimitiveClassCheck(type, klass) {
      var fn = function(obj) {
        if (isObjectType(obj)) {
          return isClass(obj, klass);
        }
        return typeof obj === type;
      }
      typeChecks[klass] = fn;
      return fn;
    }

    function className(obj) {
      return internalToString.call(obj);
    }

    function extendSimilar(klass, set, fn, instance, polyfill, override) {
      var methods = {};
      set = isString(set) ? set.split(',') : set;
      set.forEach(function(name, i) {
        fn(methods, name, i);
      });
      extend(klass, methods, instance, polyfill, override);
    }

    // Argument helpers

    function isArgumentsObject(obj, klass) {
      klass = klass || className(obj);
      // .callee exists on Arguments objects in < IE8
      return hasProperty(obj, 'length') && (klass === '[object Arguments]' || !!obj.callee);
    }

    function checkCallback(fn) {
      if (!fn || !fn.call) {
        throw new TypeError('Callback is not callable');
      }
    }

    // Coerces an object to a positive integer.
    // Does not allow NaN, or Infinity.
    function coercePositiveInteger(n) {
      n = +n || 0;
      if (n < 0 || !isNumber(n) || !isFinite(n)) {
        throw new RangeError('Invalid number');
      }
      return trunc(n);
    }


    // General helpers

    function isDefined(o) {
      return o !== undefined;
    }

    function isUndefined(o) {
      return o === undefined;
    }


    // Object helpers

    function hasProperty(obj, prop) {
      return !isPrimitiveType(obj) && prop in obj;
    }

    function isObjectType(obj) {
      // 1. Check for null
      // 2. Check for regexes in environments where they are "functions".
      return !!obj && (typeof obj === 'object' || (regexIsFunction && isRegExp(obj)));
    }

    function isPrimitiveType(obj) {
      var type = typeof obj;
      return obj == null || type === 'string' || type === 'number' || type === 'boolean';
    }

    function isPlainObject(obj, klass) {
      klass = klass || className(obj);
      try {
        // Not own constructor property must be Object
        // This code was borrowed from jQuery.isPlainObject
        if (obj && obj.constructor &&
              !hasOwnProperty(obj, 'constructor') &&
              !hasOwnProperty(obj.constructor.prototype, 'isPrototypeOf')) {
          return false;
        }
      } catch (e) {
        // IE8,9 Will throw exceptions on certain host objects.
        return false;
      }
      // === on the constructor is not safe across iframes
      // 'hasOwnProperty' ensures that the object also inherits
      // from Object, which is false for DOMElements in IE.
      return !!obj && klass === '[object Object]' && 'hasOwnProperty' in obj;
    }

    function simpleRepeat(n, fn) {
      for(var i = 0; i < n; i++) {
        fn(i);
      }
    }

    function simpleMerge(target, source) {
      iterateOverObject(source, function(key) {
        target[key] = source[key];
      });
      return target;
    }

     // Make primtives types like strings into objects.
     function coercePrimitiveToObject(obj) {
       if (isPrimitiveType(obj)) {
         obj = Object(obj);
       }
       if (noKeysInStringObjects && isString(obj)) {
         forceStringCoercion(obj);
       }
       return obj;
     }

     // Force strings to have their indexes set in
     // environments that don't do this automatically.
     function forceStringCoercion(obj) {
       var i = 0, chr;
       while(chr = obj.charAt(i)) {
         obj[i++] = chr;
       }
     }

    // Hash definition

    function Hash(obj) {
      simpleMerge(this, coercePrimitiveToObject(obj));
    };

    Hash.prototype.constructor = Object;

    // Math helpers

    var abs   = Math.abs;
    var pow   = Math.pow;
    var ceil  = Math.ceil;
    var floor = Math.floor;
    var round = Math.round;
    var min   = Math.min;
    var max   = Math.max;

    function withPrecision(val, precision, fn) {
      var multiplier = pow(10, abs(precision || 0));
      fn = fn || round;
      if (precision < 0) multiplier = 1 / multiplier;
      return fn(val * multiplier) / multiplier;
    }

    // Full width number helpers

    var HalfWidthZeroCode = 0x30;
    var HalfWidthNineCode = 0x39;
    var FullWidthZeroCode = 0xff10;
    var FullWidthNineCode = 0xff19;

    var HalfWidthPeriod = '.';
    var FullWidthPeriod = '．';
    var HalfWidthComma  = ',';

    // Used here and later in the Date package.
    var FullWidthDigits   = '';

    var NumberNormalizeMap = {};
    var NumberNormalizeReg;

    function codeIsNumeral(code) {
      return (code >= HalfWidthZeroCode && code <= HalfWidthNineCode) ||
             (code >= FullWidthZeroCode && code <= FullWidthNineCode);
    }

    function buildNumberHelpers() {
      var digit, i;
      for(i = 0; i <= 9; i++) {
        digit = chr(i + FullWidthZeroCode);
        FullWidthDigits += digit;
        NumberNormalizeMap[digit] = chr(i + HalfWidthZeroCode);
      }
      NumberNormalizeMap[HalfWidthComma] = '';
      NumberNormalizeMap[FullWidthPeriod] = HalfWidthPeriod;
      // Mapping this to itself to easily be able to easily
      // capture it in stringToNumber to detect decimals later.
      NumberNormalizeMap[HalfWidthPeriod] = HalfWidthPeriod;
      NumberNormalizeReg = RegExp('[' + FullWidthDigits + FullWidthPeriod + HalfWidthComma + HalfWidthPeriod + ']', 'g');
    }

    // String helpers

    function chr(num) {
      return String.fromCharCode(num);
    }

    // WhiteSpace/LineTerminator as defined in ES5.1 plus Unicode characters in the Space, Separator category.
    function getTrimmableCharacters() {
      return '\u0009\u000A\u000B\u000C\u000D\u0020\u00A0\u1680\u180E\u2000\u2001\u2002\u2003\u2004\u2005\u2006\u2007\u2008\u2009\u200A\u202F\u205F\u2028\u2029\u3000\uFEFF';
    }

    function repeatString(str, num) {
      var result = '';
      str = str.toString();
      while (num > 0) {
        if (num & 1) {
          result += str;
        }
        if (num >>= 1) {
          str += str;
        }
      }
      return result;
    }

    // Returns taking into account full-width characters, commas, and decimals.
    function stringToNumber(str, base) {
      var sanitized, isDecimal;
      sanitized = str.replace(NumberNormalizeReg, function(chr) {
        var replacement = NumberNormalizeMap[chr];
        if (replacement === HalfWidthPeriod) {
          isDecimal = true;
        }
        return replacement;
      });
      return isDecimal ? parseFloat(sanitized) : parseInt(sanitized, base || 10);
    }


    // Used by Number and Date

    var trunc = Math.trunc || function(n) {
      if (n === 0 || !isFinite(n)) return n;
      return n < 0 ? ceil(n) : floor(n);
    }

    function padNumber(num, place, sign, base) {
      var str = abs(num).toString(base || 10);
      str = repeatString('0', place - str.replace(/\.\d+/, '').length) + str;
      if (sign || num < 0) {
        str = (num < 0 ? '-' : '+') + str;
      }
      return str;
    }

    function getOrdinalizedSuffix(num) {
      if (num >= 11 && num <= 13) {
        return 'th';
      } else {
        switch(num % 10) {
          case 1:  return 'st';
          case 2:  return 'nd';
          case 3:  return 'rd';
          default: return 'th';
        }
      }
    }


    // RegExp helpers

    function getRegExpFlags(reg, add) {
      var flags = '';
      add = add || '';
      function checkFlag(prop, flag) {
        if (prop || add.indexOf(flag) > -1) {
          flags += flag;
        }
      }
      checkFlag(reg.multiline, 'm');
      checkFlag(reg.ignoreCase, 'i');
      checkFlag(reg.global, 'g');
      checkFlag(reg.sticky, 'y');
      return flags;
    }

    function escapeRegExp(str) {
      if (!isString(str)) str = String(str);
      return str.replace(/([\\\/\'*+?|()\[\]{}.^$-])/g,'\\$1');
    }


    // Date helpers

    function callDateGet(d, method) {
      return d['get' + (d._utc ? 'UTC' : '') + method]();
    }

    function callDateSet(d, method, value) {
      return d['set' + (d._utc ? 'UTC' : '') + method](value);
    }

    // Used by Array#unique and Object.equal

    function stringify(thing, stack) {
      var type = typeof thing, isObject, isArrayLike, klass, value, arr, key, i, len;

      // Return quickly if string to save cycles
      if (type === 'string') return thing;

      klass       = internalToString.call(thing);
      isObject    = isPlainObject(thing, klass);
      isArrayLike = isArray(thing, klass) || isArgumentsObject(thing, klass);

      if (thing != null && isObject || isArrayLike) {
        // This method for checking for cyclic structures was egregiously stolen from
        // the ingenious method by @kitcambridge from the Underscore script:
        // https://github.com/documentcloud/underscore/issues/240
        if (!stack) stack = [];
        // Allowing a step into the structure before triggering this
        // script to save cycles on standard JSON structures and also to
        // try as hard as possible to catch basic properties that may have
        // been modified.
        if (stack.length > 1) {
          i = stack.length;
          while (i--) {
            if (stack[i] === thing) {
              return 'CYC';
            }
          }
        }
        stack.push(thing);
        value = thing.valueOf() + String(thing.constructor);
        arr = isArrayLike ? thing : Object.keys(thing).sort();
        for(i = 0, len = arr.length; i < len; i++) {
          key = isArrayLike ? i : arr[i];
          value += key + stringify(thing[key], stack);
        }
        stack.pop();
      } else if (1 / thing === -Infinity) {
        value = '-0';
      } else {
        value = String(thing && thing.valueOf ? thing.valueOf() : thing);
      }
      return type + klass + value;
    }

    function isEqual(a, b) {
      if (a === b) {
        // Return quickly up front when matching by reference,
        // but be careful about 0 !== -0.
        return a !== 0 || 1 / a === 1 / b;
      } else if (objectIsMatchedByValue(a) && objectIsMatchedByValue(b)) {
        return stringify(a) === stringify(b);
      }
      return false;
    }

    function objectIsMatchedByValue(obj) {
      // Only known objects are matched by value. This is notably excluding functions, DOM Elements, and instances of
      // user-created classes. The latter can arguably be matched by value, but distinguishing between these and
      // host objects -- which should never be compared by value -- is very tricky so not dealing with it here.
      var klass = className(obj);
      return matchedByValueReg.test(klass) || isPlainObject(obj, klass);
    }


    // Used by Array#at and String#at

    function getEntriesForIndexes(obj, args, isString) {
      var result,
          length    = obj.length,
          argsLen   = args.length,
          overshoot = args[argsLen - 1] !== false,
          multiple  = argsLen > (overshoot ? 1 : 2);
      if (!multiple) {
        return entryAtIndex(obj, length, args[0], overshoot, isString);
      }
      result = [];
      for (var i = 0; i < args.length; i++) {
        var index = args[i];
        if (!isBoolean(index)) {
          result.push(entryAtIndex(obj, length, index, overshoot, isString));
        }
      }
      return result;
    }

    function entryAtIndex(obj, length, index, overshoot, isString) {
      if (overshoot && index) {
        index = index % length;
        if (index < 0) index = length + index;
      }
      return isString ? obj.charAt(index) : obj[index];
    }

    // Used by the Array and Object packages.

    function transformArgument(el, map, context, mapArgs) {
      if (!map) {
        return el;
      } else if (map.apply) {
        return map.apply(context, mapArgs || []);
      } else if (isFunction(el[map])) {
        return el[map].call(el);
      } else {
        return el[map];
      }
    }

    function keysWithObjectCoercion(obj) {
      return Object.keys(coercePrimitiveToObject(obj));
    }

    // Object class methods implemented as instance methods. This method
    // is being called only on Hash and Object itself, so we don't want
    // to go through extend() here as it will create proxies that already
    // exist, which we want to avoid.

    function buildObjectInstanceMethods(set, target) {
      set.forEach(function(name) {
        var key = name === 'equals' ? 'equal' : name;
        // Polyfill methods like Object.keys may not be defined
        // on the Sugar global object so check the main namespace.
        var classFn = Object[key];
        var fn = function() {
          var args = arguments, newArgs = [this], i;
          for(i = 0;i < args.length;i++) {
            newArgs.push(args[i]);
          }
          return classFn.apply(null, newArgs);
        }
        setProperty(target.prototype, name, fn);
      });
    }

    buildNumberHelpers();

    /***
     * @module ES5
     * @description Shim methods that provide ES5 compatible functionality. This package can be excluded if you do not require legacy browser support (IE8 and below).
     *
     ***/


    /***
     * @namespace Object
     *
     ***/

    extend(Object, {

      'keys': function(obj) {
        var keys = [];
        if (!isObjectType(obj) && !isRegExp(obj) && !isFunction(obj)) {
          throw new TypeError('Object required');
        }
        iterateOverObject(obj, function(key, value) {
          keys.push(key);
        });
        return keys;
      }

    }, false, true);


    /***
     * @namespace Array
     *
     ***/

    // ECMA5 methods

    function arrayIndexOf(arr, search, fromIndex, increment) {
      var length = arr.length,
          fromRight = increment == -1,
          start = fromRight ? length - 1 : 0,
          index = toIntegerWithDefault(fromIndex, start);
      if (index < 0) {
        index = length + index;
      }
      if ((!fromRight && index < 0) || (fromRight && index >= length)) {
        index = start;
      }
      while((fromRight && index >= 0) || (!fromRight && index < length)) {
        if (arr[index] === search) {
          return index;
        }
        index += increment;
      }
      return -1;
    }

    function arrayReduce(arr, fn, initialValue, fromRight) {
      var length = arr.length, count = 0, defined = isDefined(initialValue), result, index;
      checkCallback(fn);
      if (length == 0 && !defined) {
        throw new TypeError('Reduce called on empty array with no initial value');
      } else if (defined) {
        result = initialValue;
      } else {
        result = arr[fromRight ? length - 1 : count];
        count++;
      }
      while(count < length) {
        index = fromRight ? length - count - 1 : count;
        if (index in arr) {
          result = fn(result, arr[index], index, arr);
        }
        count++;
      }
      return result;
    }

    function toIntegerWithDefault(i, d) {
      if (isNaN(i)) {
        return d;
      } else {
        return parseInt(i >> 0);
      }
    }

    function checkFirstArgumentExists(args) {
      if (args.length === 0) {
        throw new TypeError('First argument must be defined');
      }
    }


    extend(Array, {

      /***
       *
       * @method Array.isArray(<obj>)
       * @returns Boolean
       * @short Returns true if <obj> is an Array.
       * @extra This method is provided for browsers that don't support it internally.
       * @example
       *
       *   Array.isArray(3)        -> false
       *   Array.isArray(true)     -> false
       *   Array.isArray('wasabi') -> false
       *   Array.isArray([1,2,3])  -> true
       *
       ***/
      'isArray': function(obj) {
        return isArray(obj);
      }

    }, false, true);


    extend(Array, {

      /***
       * @method every(<f>, [scope])
       * @returns Boolean
       * @short Returns true if all elements in the array match <f>.
       * @extra [scope] is the %this% object. %all% is provided an alias. In addition to providing this method for browsers that don't support it natively, this method also implements %array_matching%.
       * @example
       *
       +   ['a','a','a'].every(function(n) {
       *     return n == 'a';
       *   });
       *   ['a','a','a'].every('a')   -> true
       *   [{a:2},{a:2}].every({a:2}) -> true
       ***/
      'every': function(fn, scope) {
        var length = this.length, index = 0;
        checkFirstArgumentExists(arguments);
        while(index < length) {
          if (index in this && !fn.call(scope, this[index], index, this)) {
            return false;
          }
          index++;
        }
        return true;
      },

      /***
       * @method some(<f>, [scope])
       * @returns Boolean
       * @short Returns true if any element in the array matches <f>.
       * @extra [scope] is the %this% object. %any% is provided as an alias. In addition to providing this method for browsers that don't support it natively, this method also implements %array_matching%.
       * @example
       *
       +   ['a','b','c'].some(function(n) {
       *     return n == 'a';
       *   });
       +   ['a','b','c'].some(function(n) {
       *     return n == 'd';
       *   });
       *   ['a','b','c'].some('a')   -> true
       *   [{a:2},{b:5}].some({a:2}) -> true
       ***/
      'some': function(fn, scope) {
        var length = this.length, index = 0;
        checkFirstArgumentExists(arguments);
        while(index < length) {
          if (index in this && fn.call(scope, this[index], index, this)) {
            return true;
          }
          index++;
        }
        return false;
      },

      /***
       * @method map(<map>, [scope])
       * @returns Array
       * @short Maps the array to another array containing the values that are the result of calling <map> on each element.
       * @extra [scope] is the %this% object. When <map> is a function, it receives three arguments: the current element, the current index, and a reference to the array. In addition to providing this method for browsers that don't support it natively, this enhanced method also directly accepts a string, which is a shortcut for a function that gets that property (or invokes a function) on each element.
       * @example
       *
       *   [1,2,3].map(function(n) {
       *     return n * 3;
       *   });                                  -> [3,6,9]
       *   ['one','two','three'].map(function(n) {
       *     return n.length;
       *   });                                  -> [3,3,5]
       *   ['one','two','three'].map('length')  -> [3,3,5]
       *
       ***/
      'map': function(fn, scope) {
        var scope = arguments[1], length = this.length, index = 0, result = new Array(length);
        checkFirstArgumentExists(arguments);
        while(index < length) {
          if (index in this) {
            result[index] = fn.call(scope, this[index], index, this);
          }
          index++;
        }
        return result;
      },

      /***
       * @method filter(<f>, [scope])
       * @returns Array
       * @short Returns any elements in the array that match <f>.
       * @extra [scope] is the %this% object. In addition to providing this method for browsers that don't support it natively, this method also implements %array_matching%.
       * @example
       *
       +   [1,2,3].filter(function(n) {
       *     return n > 1;
       *   });
       *   [1,2,2,4].filter(2) -> 2
       *
       ***/
      'filter': function(fn) {
        var scope = arguments[1];
        var length = this.length, index = 0, result = [];
        checkFirstArgumentExists(arguments);
        while(index < length) {
          if (index in this && fn.call(scope, this[index], index, this)) {
            result.push(this[index]);
          }
          index++;
        }
        return result;
      },

      /***
       * @method indexOf(<search>, [fromIndex])
       * @returns Number
       * @short Searches the array and returns the first index where <search> occurs, or -1 if the element is not found.
       * @extra [fromIndex] is the index from which to begin the search. This method performs a simple strict equality comparison on <search>. It does not support enhanced functionality such as searching the contents against a regex, callback, or deep comparison of objects. For such functionality, use the %findIndex% method instead.
       * @example
       *
       *   [1,2,3].indexOf(3)           -> 1
       *   [1,2,3].indexOf(7)           -> -1
       *
       ***/
      'indexOf': function(search) {
        var fromIndex = arguments[1];
        if (isString(this)) return this.indexOf(search, fromIndex);
        return arrayIndexOf(this, search, fromIndex, 1);
      },

      /***
       * @method lastIndexOf(<search>, [fromIndex])
       * @returns Number
       * @short Searches the array and returns the last index where <search> occurs, or -1 if the element is not found.
       * @extra [fromIndex] is the index from which to begin the search. This method performs a simple strict equality comparison on <search>.
       * @example
       *
       *   [1,2,1].lastIndexOf(1)                 -> 2
       *   [1,2,1].lastIndexOf(7)                 -> -1
       *
       ***/
      'lastIndexOf': function(search) {
        var fromIndex = arguments[1];
        if (isString(this)) return this.lastIndexOf(search, fromIndex);
        return arrayIndexOf(this, search, fromIndex, -1);
      },

      /***
       * @method forEach([fn], [scope])
       * @returns Nothing
       * @short Iterates over the array, calling [fn] on each loop.
       * @extra This method is only provided for those browsers that do not support it natively. [scope] becomes the %this% object.
       * @example
       *
       *   ['a','b','c'].forEach(function(a) {
       *     // Called 3 times: 'a','b','c'
       *   });
       *
       ***/
      'forEach': function(fn) {
        var length = this.length, index = 0, scope = arguments[1];
        checkCallback(fn);
        while(index < length) {
          if (index in this) {
            fn.call(scope, this[index], index, this);
          }
          index++;
        }
      },

      /***
       * @method reduce(<fn>, [init])
       * @returns Mixed
       * @short Reduces the array to a single result.
       * @extra If [init] is passed as a starting value, that value will be passed as the first argument to the callback. The second argument will be the first element in the array. From that point, the result of the callback will then be used as the first argument of the next iteration. This is often refered to as "accumulation", and [init] is often called an "accumulator". If [init] is not passed, then <fn> will be called n - 1 times, where n is the length of the array. In this case, on the first iteration only, the first argument will be the first element of the array, and the second argument will be the second. After that callbacks work as normal, using the result of the previous callback as the first argument of the next. This method is only provided for those browsers that do not support it natively.
       *
       * @example
       *
       +   [1,2,3,4].reduce(function(a, b) {
       *     return a - b;
       *   });
       +   [1,2,3,4].reduce(function(a, b) {
       *     return a - b;
       *   }, 100);
       *
       ***/
      'reduce': function(fn) {
        return arrayReduce(this, fn, arguments[1]);
      },

      /***
       * @method reduceRight([fn], [init])
       * @returns Mixed
       * @short Identical to %Array#reduce%, but operates on the elements in reverse order.
       * @extra This method is only provided for those browsers that do not support it natively.
       *
       *
       *
       *
       * @example
       *
       +   [1,2,3,4].reduceRight(function(a, b) {
       *     return a - b;
       *   });
       *
       ***/
      'reduceRight': function(fn) {
        return arrayReduce(this, fn, arguments[1], true);
      }


    }, true, true);




    /***
     * @namespace String
     *
     ***/

    var TrimRegExp = RegExp('^[' + getTrimmableCharacters() + ']+|['+getTrimmableCharacters()+']+$', 'g')

    extend(String, {
      /***
       * @method trim()
       * @returns String
       * @short Removes leading and trailing whitespace from the string.
       * @extra Whitespace is defined as line breaks, tabs, and any character in the "Space, Separator" Unicode category, conforming to the the ES5 spec. The standard %trim% method is only added when not fully supported natively.
       *
       * @example
       *
       *   '   wasabi   '.trim()      -> 'wasabi'
       *   '   wasabi   '.trimLeft()  -> 'wasabi   '
       *   '   wasabi   '.trimRight() -> '   wasabi'
       *
       ***/
      'trim': function() {
        return this.toString().replace(TrimRegExp, '');
      }
    }, true, true);



    /***
     * @namespace Function
     *
     ***/


    extend(Function, {

       /***
       * @method bind(<scope>, [arg1], ...)
       * @returns Function
       * @short Binds <scope> as the %this% object for the function when it is called. Also allows currying an unlimited number of parameters.
       * @extra "currying" means setting parameters ([arg1], [arg2], etc.) ahead of time so that they are passed when the function is called later. If you pass additional parameters when the function is actually called, they will be added will be added to the end of the curried parameters. This method is provided for browsers that don't support it internally.
       * @example
       *
       +   (function() {
       *     return this;
       *   }).bind('woof')(); -> returns 'woof'; function is bound with 'woof' as the this object.
       *   (function(a) {
       *     return a;
       *   }).bind(1, 2)();   -> returns 2; function is bound with 1 as the this object and 2 curried as the first parameter
       *   (function(a, b) {
       *     return a + b;
       *   }).bind(1, 2)(3);  -> returns 5; function is bound with 1 as the this object, 2 curied as the first parameter and 3 passed as the second when calling the function
       *
       ***/
      'bind': function(scope) {
        // Optimized: no leaking arguments
        var boundArgs = [], $i; for($i = 1; $i < arguments.length; $i++) boundArgs.push(arguments[$i]);
        var fn = this, bound;
        if (!isFunction(this)) {
          throw new TypeError('Function.prototype.bind called on a non-function');
        }
        bound = function() {
          // Optimized: no leaking arguments
          var args = [], $i; for($i = 0; $i < arguments.length; $i++) args.push(arguments[$i]);
          return fn.apply(fn.prototype && this instanceof fn ? this : scope, boundArgs.concat(args));
        }
        bound.prototype = this.prototype;
        return bound;
      }

    }, true, true);

    /***
     * @namespace Date
     *
     ***/

    function hasISOStringSupport() {
      var d = new Date(Date.UTC(2000, 0)), expected = '2000-01-01T00:00:00.000Z';
      return !!d.toISOString && d.toISOString() === expected;
    }

    extend(Date, {

       /***
       * @method Date.now()
       * @returns String
       * @short Returns the number of milliseconds since January 1st, 1970 00:00:00 (UTC time).
       * @extra Provided for browsers that do not support this method.
       * @example
       *
       *   Date.now() -> ex. 1311938296231
       *
       ***/
      'now': function() {
        return new Date().getTime();
      }

    }, false, true);


     /***
     * @method toISOString()
     * @returns String
     * @short Formats the string to ISO8601 format.
     * @extra This will always format as UTC time. Provided for browsers that do not support this method.
     * @example
     *
     *   Date.create().toISOString() -> ex. 2011-07-05 12:24:55.528Z
     *
     ***
     * @method toJSON()
     * @returns String
     * @short Returns a JSON representation of the date.
     * @extra This is effectively an alias for %toISOString%. Will always return the date in UTC time. Provided for browsers that do not support this method.
     * @example
     *
     *   Date.create().toJSON() -> ex. 2011-07-05 12:24:55.528Z
     *
     ***/
    extendSimilar(Date, 'toISOString,toJSON', function(methods, name) {
      methods[name] = function() {
        return padNumber(this.getUTCFullYear(), 4) + '-' +
               padNumber(this.getUTCMonth() + 1, 2) + '-' +
               padNumber(this.getUTCDate(), 2) + 'T' +
               padNumber(this.getUTCHours(), 2) + ':' +
               padNumber(this.getUTCMinutes(), 2) + ':' +
               padNumber(this.getUTCSeconds(), 2) + '.' +
               padNumber(this.getUTCMilliseconds(), 3) + 'Z';
      }
    }, true, hasISOStringSupport());

    /***
     * @module Array
     * @dependency core
     * @description Array manipulation and traversal, "fuzzy matching" against elements, alphanumeric sorting and collation, enumerable methods on Object.
     *
     ***/

    // Undefined array elements in < IE8 will not be visited by concat
    // and so will not be copied. This means that non-sparse arrays will
    // become sparse, so detect for this here.
    var HAS_CONCAT_BUG = !('0' in [].concat(undefined).concat());

    function regexMatcher(reg) {
      reg = RegExp(reg);
      return function (el) {
        return reg.test(el);
      }
    }

    function dateMatcher(d) {
      var ms = d.getTime();
      return function (el) {
        return !!(el && el.getTime) && el.getTime() === ms;
      }
    }

    function functionMatcher(fn) {
      return function (el, i, arr) {
        // Return true up front if match by reference
        return el === fn || fn.call(this, el, i, arr);
      }
    }

    function invertedArgsFunctionMatcher(fn) {
      return function (value, key, obj) {
        // Return true up front if match by reference
        return value === fn || fn.call(obj, key, value, obj);
      }
    }

    function fuzzyMatcher(obj, isObject) {
      var matchers = {};
      return function (el, i, arr) {
        var key;
        if (!isObjectType(el)) {
          return false;
        }
        for(key in obj) {
          matchers[key] = matchers[key] || getMatcher(obj[key], isObject);
          if (matchers[key].call(arr, el[key], i, arr) === false) {
            return false;
          }
        }
        return true;
      }
    }

    function defaultMatcher(f) {
      return function (el) {
        return el === f || isEqual(el, f);
      }
    }

    function getMatcher(f, isObject) {
      if (isPrimitiveType(f)) {
        // Do nothing and fall through to the
        // default matcher below.
      } else if (isRegExp(f)) {
        // Match against a regexp
        return regexMatcher(f);
      } else if (isDate(f)) {
        // Match against a date. isEqual below should also
        // catch this but matching directly up front for speed.
        return dateMatcher(f);
      } else if (isFunction(f)) {
        // Match against a filtering function
        if (isObject) {
          return invertedArgsFunctionMatcher(f);
        } else {
          return functionMatcher(f);
        }
      } else if (isPlainObject(f)) {
        // Match against a fuzzy hash or array.
        return fuzzyMatcher(f, isObject);
      }
      // Default is standard isEqual
      return defaultMatcher(f);
    }

    function transformArgument(el, map, context, mapArgs) {
      if (!map) {
        return el;
      } else if (map.apply) {
        return map.apply(context, mapArgs || []);
      } else if (isArray(map)) {
        return map.map(function(m) {
          return transformArgument(el, m, context, mapArgs);
        });
      } else if (isFunction(el[map])) {
        return el[map].call(el);
      } else {
        return el[map];
      }
    }

    function compareValue(aVal, bVal) {
      var cmp, i;
      if (isString(aVal) && isString(bVal)) {
        return collateStrings(aVal, bVal);
      } else if (isArray(aVal) && isArray(bVal)) {
        if (aVal.length < bVal.length) {
          return -1;
        } else if (aVal.length > bVal.length) {
          return 1;
        } else {
          for(i = 0; i < aVal.length; i++) {
            cmp = compareValue(aVal[i], bVal[i]);
            if (cmp !== 0) {
              return cmp;
            }
          }
          return 0;
        }
      } else if (aVal < bVal) {
        return -1;
      } else if (aVal > bVal) {
        return 1;
      } else {
        return 0;
      }

    }

    // Basic array internal methods

    function arrayEach(arr, fn, startIndex, loop) {
      var index, i, length = +arr.length;
      if (startIndex < 0) startIndex = arr.length + startIndex;
      i = isNaN(startIndex) ? 0 : startIndex;
      if (loop === true) {
        length += i;
      }
      while(i < length) {
        index = i % arr.length;
        if (!(index in arr)) {
          return iterateOverSparseArray(arr, fn, i, loop);
        } else if (fn.call(arr, arr[index], index, arr) === false) {
          break;
        }
        i++;
      }
    }

    function iterateOverSparseArray(arr, fn, fromIndex, loop) {
      var indexes = [], i;
      for(i in arr) {
        if (isArrayIndex(arr, i) && i >= fromIndex) {
          indexes.push(parseInt(i));
        }
      }
      arrayEach(indexes.sort(), function(index) {
        return fn.call(arr, arr[index], index, arr);
      });
      return arr;
    }

    function isArrayIndex(arr, i) {
      return i in arr && toUInt32(i) == i && i != 0xffffffff;
    }

    function toUInt32(i) {
      return i >>> 0;
    }

    function arrayFind(arr, f, startIndex, loop, returnIndex, context) {
      var result, index, matcher;
      if (arr.length > 0) {
        matcher = getMatcher(f);
        arrayEach(arr, function(el, i) {
          if (matcher.call(context, el, i, arr)) {
            result = el;
            index = i;
            return false;
          }
        }, startIndex, loop);
      }
      return returnIndex ? index : result;
    }

    function arrayFindAll(arr, f, index, loop) {
      var result = [], matcher;
      if (arr.length > 0) {
        matcher = getMatcher(f);
        arrayEach(arr, function(el, i, arr) {
          if (matcher(el, i, arr)) {
            result.push(el);
          }
        }, index, loop);
      }
      return result;
    }

    function arrayAdd(arr, el, index) {
      if (!isNumber(+index) || isNaN(index)) index = arr.length;
      Array.prototype.splice.apply(arr, [index, 0].concat(el));
      return arr;
    }

    function arrayRemoveElement(arr, f) {
      var i = 0, matcher = getMatcher(f);
      while(i < arr.length) {
        if (matcher(arr[i], i, arr)) {
          arr.splice(i, 1);
        } else {
          i++;
        }
      }
    }

    function arrayUnique(arr, map) {
      var result = [], o = {}, transformed;
      arrayEach(arr, function(el, i) {
        transformed = map ? transformArgument(el, map, arr, [el, i, arr]) : el;
        if (!checkForElementInHashAndSet(o, transformed)) {
          result.push(el);
        }
      })
      return result;
    }

    function arrayIntersect(arr1, arr2, subtract) {
      var result = [], o = {};
      arrayEach(arr2, function(el) {
        checkForElementInHashAndSet(o, el);
      });
      arrayEach(arr1, function(el) {
        var stringified = stringify(el),
            isReference = !objectIsMatchedByValue(el);
        // Add the result to the array if:
        // 1. We're subtracting intersections or it doesn't already exist in the result and
        // 2. It exists in the compared array and we're adding, or it doesn't exist and we're removing.
        if (elementExistsInHash(o, stringified, el, isReference) !== subtract) {
          discardElementFromHash(o, stringified, el, isReference);
          result.push(el);
        }
      });
      return result;
    }

    function arrayFlatten(arr, level, current) {
      level = level || Infinity;
      current = current || 0;
      var result = [];
      arrayEach(arr, function(el) {
        if (isArray(el) && current < level) {
          result = arrayConcat(result, arrayFlatten(el, level, current + 1));
        } else {
          result.push(el);
        }
      });
      return result;
    }

    function arrayGroupBy(arr, map, fn) {
      var result = {}, key;
      arrayEach(arr, function(el, index) {
        key = transformArgument(el, map, arr, [el, index, arr]);
        if (!result[key]) result[key] = [];
        result[key].push(el);
      });
      if (fn) {
        iterateOverObject(result, fn);
      }
      return result;
    }

    function arraySum(arr, map) {
      if (map) {
        arr = arr.map.apply(arr, [map]);
      }
      return arr.length > 0 ? arr.reduce(function(a,b) { return a + b; }) : 0;
    }

    function arrayCompact(arr, all) {
      var result = [];
      arrayEach(arr, function(el, i) {
        if (all && el) {
          result.push(el);
        } else if (!all && el != null && el.valueOf() === el.valueOf()) {
          result.push(el);
        }
      });
      return result;
    }

    function arrayRandomize(arr) {
      arr = arrayClone(arr);
      var i = arr.length, j, x;
      while(i) {
        j = (Math.random() * i) | 0;
        x = arr[--i];
        arr[i] = arr[j];
        arr[j] = x;
      }
      return arr;
    }

    function arrayClone(arr) {
      var len = arr.length, clone = new Array(len);
      for (var i = 0; i < len; i++) {
        clone[i] = arr[i];
      }
      return clone;
    }

    function arrayConcat(arr1, arr2) {
      if (HAS_CONCAT_BUG) {
        return arraySafeConcat(arr1, arr2);
      }
      return arr1.concat(arr2);
    }

    // Avoids issues with concat in < IE8
    function arraySafeConcat(arr, arg) {
      var result = arrayClone(arr), len = result.length, arr2;
      arr2 = isArray(arg) ? arg : [arg];
      result.length += arr2.length;
      for (var i = 0, len2 = arr2.length; i < len2; i++) {
        result[len + i] = arr2[i];
      }
      return result;
    }

    function isArrayLike(obj) {
      return hasProperty(obj, 'length') && !isString(obj) && !isPlainObject(obj);
    }

    function elementExistsInHash(hash, key, element, isReference) {
      var exists = hasOwnProperty(hash, key);
      if (isReference) {
        if (!hash[key]) {
          hash[key] = [];
        }
        exists = hash[key].indexOf(element) !== -1;
      }
      return exists;
    }

    function checkForElementInHashAndSet(hash, element) {
      var stringified = stringify(element),
          isReference = !objectIsMatchedByValue(element),
          exists      = elementExistsInHash(hash, stringified, element, isReference);
      if (isReference) {
        hash[stringified].push(element);
      } else {
        hash[stringified] = element;
      }
      return exists;
    }

    function discardElementFromHash(hash, key, element, isReference) {
      var arr, i = 0;
      if (isReference) {
        arr = hash[key];
        while(i < arr.length) {
          if (arr[i] === element) {
            arr.splice(i, 1);
          } else {
            i += 1;
          }
        }
      } else {
        delete hash[key];
      }
    }

    // Support methods

    function getMinOrMax(obj, map, which, all) {
      var el,
          key,
          edge,
          test,
          result = [],
          max = which === 'max',
          min = which === 'min',
          isArray = Array.isArray(obj);
      for(key in obj) {
        if (!obj.hasOwnProperty(key)) continue;
        el   = obj[key];
        test = transformArgument(el, map, obj, isArray ? [el, parseInt(key), obj] : []);
        if (isUndefined(test)) {
          throw new TypeError('Cannot compare with undefined');
        }
        if (test === edge) {
          result.push(el);
        } else if (isUndefined(edge) || (max && test > edge) || (min && test < edge)) {
          result = [el];
          edge = test;
        }
      }
      if (!isArray) result = arrayFlatten(result, 1);
      return all ? result : result[0];
    }

    // Alphanumeric collation helpers

    function collateStrings(a, b) {
      var aValue, bValue, aChar, bChar, aEquiv, bEquiv, index = 0, tiebreaker = 0;

      var sortIgnore      = Array[AlphanumericSortIgnore];
      var sortIgnoreCase  = Array[AlphanumericSortIgnoreCase];
      var sortEquivalents = Array[AlphanumericSortEquivalents];
      var sortOrder       = Array[AlphanumericSortOrder];
      var naturalSort     = Array[AlphanumericSortNatural];

      a = getCollationReadyString(a, sortIgnore, sortIgnoreCase);
      b = getCollationReadyString(b, sortIgnore, sortIgnoreCase);

      do {

        aChar  = getCollationCharacter(a, index, sortEquivalents);
        bChar  = getCollationCharacter(b, index, sortEquivalents);
        aValue = getSortOrderIndex(aChar, sortOrder);
        bValue = getSortOrderIndex(bChar, sortOrder);

        if (aValue === -1 || bValue === -1) {
          aValue = a.charCodeAt(index) || null;
          bValue = b.charCodeAt(index) || null;
          if (naturalSort && codeIsNumeral(aValue) && codeIsNumeral(bValue)) {
            aValue = stringToNumber(a.slice(index));
            bValue = stringToNumber(b.slice(index));
          }
        } else {
          aEquiv = aChar !== a.charAt(index);
          bEquiv = bChar !== b.charAt(index);
          if (aEquiv !== bEquiv && tiebreaker === 0) {
            tiebreaker = aEquiv - bEquiv;
          }
        }
        index += 1;
      } while(aValue != null && bValue != null && aValue === bValue);
      if (aValue === bValue) return tiebreaker;
      return aValue - bValue;
    }

    function getCollationReadyString(str, sortIgnore, sortIgnoreCase) {
      if (!isString(str)) str = string(str);
      if (sortIgnoreCase) {
        str = str.toLowerCase();
      }
      if (sortIgnore) {
        str = str.replace(sortIgnore, '');
      }
      return str;
    }

    function getCollationCharacter(str, index, sortEquivalents) {
      var chr = str.charAt(index);
      return sortEquivalents[chr] || chr;
    }

    function getSortOrderIndex(chr, sortOrder) {
      if (!chr) {
        return null;
      } else {
        return sortOrder.indexOf(chr);
      }
    }

    var AlphanumericSort            = 'AlphanumericSort';
    var AlphanumericSortOrder       = 'AlphanumericSortOrder';
    var AlphanumericSortIgnore      = 'AlphanumericSortIgnore';
    var AlphanumericSortIgnoreCase  = 'AlphanumericSortIgnoreCase';
    var AlphanumericSortEquivalents = 'AlphanumericSortEquivalents';
    var AlphanumericSortNatural     = 'AlphanumericSortNatural';



    function buildEnhancements() {
      var nativeMap = Array.prototype.map;
      var callbackCheck = function() {
        return arguments.length > 0 && !isFunction(arguments[0]);
      };
      extendSimilar(Array, 'every,some,filter,find,findIndex', function(methods, name) {
        var nativeFn = Array.prototype[name]
        methods[name] = function(f) {
          var matcher = getMatcher(f);
          return nativeFn.call(this, function(el, index, arr) {
            return matcher(el, index, arr);
          });
        }
      }, true, callbackCheck);
      extend(Array, {
        'map': function(map, context) {
          var arr = this;
          if (arguments.length < 2) {
            context = arr;
          }
          return nativeMap.call(arr, function(el, index) {
            return transformArgument(el, map, context, [el, index, arr]);
          });
        }
      }, true, callbackCheck);
    }

    function buildAlphanumericSort() {
      var order = 'AÁÀÂÃĄBCĆČÇDĎÐEÉÈĚÊËĘFGĞHıIÍÌİÎÏJKLŁMNŃŇÑOÓÒÔPQRŘSŚŠŞTŤUÚÙŮÛÜVWXYÝZŹŻŽÞÆŒØÕÅÄÖ';
      var equiv = 'AÁÀÂÃÄ,CÇ,EÉÈÊË,IÍÌİÎÏ,OÓÒÔÕÖ,Sß,UÚÙÛÜ';
      Array[AlphanumericSortOrder] = order.split('').map(function(str) {
        return str + str.toLowerCase();
      }).join('');
      var equivalents = {};
      arrayEach(equiv.split(','), function(set) {
        var equivalent = set.charAt(0);
        arrayEach(set.slice(1).split(''), function(chr) {
          equivalents[chr] = equivalent;
          equivalents[chr.toLowerCase()] = equivalent.toLowerCase();
        });
      });
      Array[AlphanumericSortNatural] = true;
      Array[AlphanumericSortIgnoreCase] = true;
      Array[AlphanumericSortEquivalents] = equivalents;
    }

    extend(Array, {

      /***
       *
       * @method Array.create(<obj1>, <obj2>, ...)
       * @returns Array
       * @short Alternate array constructor.
       * @extra This method will create a single array by calling %concat% on all arguments passed. In addition to ensuring that an unknown variable is in a single, flat array (the standard constructor will create nested arrays, this one will not), it is also a useful shorthand to convert a function's arguments object into a standard array.
       * @example
       *
       *   Array.create('one', true, 3)   -> ['one', true, 3]
       *   Array.create(['one', true, 3]) -> ['one', true, 3]
       *   Array.create(function(n) {
       *     return arguments;
       *   }('howdy', 'doody'));
       *
       ***/
      'create': function() {
        // Optimized: no leaking arguments
        var result = [];
        for (var i = 0; i < arguments.length; i++) {
          var a = arguments[i];
          if (isArgumentsObject(a) || isArrayLike(a)) {
            for (var j = 0; j < a.length; j++) {
              result.push(a[j]);
            }
            continue;
          }
          result = arrayConcat(result, a);
        }
        return result;
      }

    }, false);

    extend(Array, {

      /***
       * @method find(<f>, [context])
       * @returns Mixed
       * @short Returns the first element that matches <f>.
       * @extra [context] is the %this% object if passed. When <f> is a function, will use native implementation if it exists. <f> will also match a string, number, array, object, or alternately test against a function or regex. This method implements %array_matching%.
       * @example
       *
       *   [{a:1,b:2},{a:1,b:3},{a:1,b:4}].find(function(n) {
       *     return n['a'] == 1;
       *   });                                  -> {a:1,b:3}
       *   ['cuba','japan','canada'].find(/^c/) -> 'cuba'
       *
       ***/
      'find': function(f) {
        var context = arguments[1];
        checkCallback(f);
        for (var i = 0, len = this.length; i < len; i++) {
          if (f.call(context, this[i], i, this)) {
            return this[i];
          }
        }
      },

      /***
       * @method findIndex(<f>, [context])
       * @returns Number
       * @short Returns the index of the first element that matches <f> or -1 if not found.
       * @extra [context] is the %this% object if passed. When <f> is a function, will use native implementation if it exists. <f> will also match a string, number, array, object, or alternately test against a function or regex. This method implements %array_matching%.
       *
       * @example
       *
       *   [1,2,3,4].findIndex(function(n) {
       *     return n % 2 == 0;
       *   }); -> 1
       *   [1,2,3,4].findIndex(3);               -> 2
       *   ['one','two','three'].findIndex(/t/); -> 1
       *
       ***/
      'findIndex': function(f) {
        var index, context = arguments[1];
        checkCallback(f);
        for (var i = 0, len = this.length; i < len; i++) {
          if (f.call(context, this[i], i, this)) {
            return i;
          }
        }
        return -1;
      }

    }, true, true);

    extend(Array, {

      /***
       * @method findFrom(<f>, [index] = 0, [loop] = false)
       * @returns Array
       * @short Returns any element that matches <f>, beginning from [index].
       * @extra <f> will match a string, number, array, object, or alternately test against a function or regex. Will continue from index = 0 if [loop] is true. This method implements %array_matching%.
       * @example
       *
       *   ['cuba','japan','canada'].findFrom(/^c/, 2) -> 'canada'
       *
       ***/
      'findFrom': function(f, index, loop) {
        return arrayFind(this, f, index, loop);
      },

      /***
       * @method findIndexFrom(<f>, [index] = 0, [loop] = false)
       * @returns Array
       * @short Returns the index of any element that matches <f>, beginning from [index].
       * @extra <f> will match a string, number, array, object, or alternately test against a function or regex. Will continue from index = 0 if [loop] is true. This method implements %array_matching%.
       * @example
       *
       *   ['cuba','japan','canada'].findIndexFrom(/^c/, 2) -> 2
       *
       ***/
      'findIndexFrom': function(f, index, loop) {
        var index = arrayFind(this, f, index, loop, true);
        return isUndefined(index) ? -1 : index;
      },

      /***
       * @method findAll(<f>, [index] = 0, [loop] = false)
       * @returns Array
       * @short Returns all elements that match <f>.
       * @extra <f> will match a string, number, array, object, or alternately test against a function or regex. Starts at [index], and will continue once from index = 0 if [loop] is true. This method implements %array_matching%.
       * @example
       *
       *   [{a:1,b:2},{a:1,b:3},{a:2,b:4}].findAll(function(n) {
       *     return n['a'] == 1;
       *   });                                        -> [{a:1,b:3},{a:1,b:4}]
       *   ['cuba','japan','canada'].findAll(/^c/)    -> 'cuba','canada'
       *   ['cuba','japan','canada'].findAll(/^c/, 2) -> 'canada'
       *
       ***/
      'findAll': function(f, index, loop) {
        return arrayFindAll(this, f, index, loop);
      },

      /***
       * @method count(<f>)
       * @returns Number
       * @short Counts all elements in the array that match <f>.
       * @extra <f> will match a string, number, array, object, or alternately test against a function or regex. This method implements %array_matching%.
       * @example
       *
       *   [1,2,3,1].count(1)       -> 2
       *   ['a','b','c'].count(/b/) -> 1
       *   [{a:1},{b:2}].count(function(n) {
       *     return n['a'] > 1;
       *   });                      -> 0
       *
       ***/
      'count': function(f) {
        if (isUndefined(f)) return this.length;
        return arrayFindAll(this, f).length;
      },

      /***
       * @method removeAt(<start>, [end])
       * @returns Array
       * @short Removes element at <start>. If [end] is specified, removes the range between <start> and [end]. This method will change the array! If you don't intend the array to be changed use %clone% first.
       * @example
       *
       *   ['a','b','c'].removeAt(0) -> ['b','c']
       *   [1,2,3,4].removeAt(1, 3)  -> [1]
       *
       ***/
      'removeAt': function(start, end) {
        if (isUndefined(start)) return this;
        if (isUndefined(end))   end = start;
        this.splice(start, end - start + 1);
        return this;
      },

      /***
       * @method include(<el>, [index])
       * @returns Array
       * @short Adds <el> to the array.
       * @extra This is a non-destructive alias for %add%. It will not change the original array.
       * @example
       *
       *   [1,2,3,4].include(5)       -> [1,2,3,4,5]
       *   [1,2,3,4].include(8, 1)    -> [1,8,2,3,4]
       *   [1,2,3,4].include([5,6,7]) -> [1,2,3,4,5,6,7]
       *
       ***/
      'include': function(el, index) {
        return arrayAdd(arrayClone(this), el, index);
      },

      /***
       * @method exclude([f1], [f2], ...)
       * @returns Array
       * @short Removes any element in the array that matches [f1], [f2], etc.
       * @extra This is a non-destructive alias for %remove%. It will not change the original array. This method implements %array_matching%.
       * @example
       *
       *   [1,2,3].exclude(3)         -> [1,2]
       *   ['a','b','c'].exclude(/b/) -> ['a','c']
       *   [{a:1},{b:2}].exclude(function(n) {
       *     return n['a'] == 1;
       *   });                       -> [{b:2}]
       *
       ***/
      'exclude': function() {
        var arr = arrayClone(this);
        for (var i = 0; i < arguments.length; i++) {
          arrayRemoveElement(arr, arguments[i]);
        }
        return arr;
      },

      /***
       * @method clone()
       * @returns Array
       * @short Makes a shallow clone of the array.
       * @example
       *
       *   [1,2,3].clone() -> [1,2,3]
       *
       ***/
      'clone': function() {
        return arrayClone(this);
      },

      /***
       * @method unique([map] = null)
       * @returns Array
       * @short Removes all duplicate elements in the array.
       * @extra [map] may be a function mapping the value to be uniqued on or a string acting as a shortcut. This is most commonly used when you have a key that ensures the object's uniqueness, and don't need to check all fields. This method will also correctly operate on arrays of objects.
       * @example
       *
       *   [1,2,2,3].unique()                 -> [1,2,3]
       *   [{foo:'bar'},{foo:'bar'}].unique() -> [{foo:'bar'}]
       *   [{foo:'bar'},{foo:'bar'}].unique(function(obj){
       *     return obj.foo;
       *   }); -> [{foo:'bar'}]
       *   [{foo:'bar'},{foo:'bar'}].unique('foo') -> [{foo:'bar'}]
       *
       ***/
      'unique': function(map) {
        return arrayUnique(this, map);
      },

      /***
       * @method flatten([limit] = Infinity)
       * @returns Array
       * @short Returns a flattened, one-dimensional copy of the array.
       * @extra You can optionally specify a [limit], which will only flatten that depth.
       * @example
       *
       *   [[1], 2, [3]].flatten()      -> [1,2,3]
       *   [['a'],[],'b','c'].flatten() -> ['a','b','c']
       *
       ***/
      'flatten': function(limit) {
        return arrayFlatten(this, limit);
      },

      /***
       * @method union([a1], [a2], ...)
       * @returns Array
       * @short Returns an array containing all elements in all arrays with duplicates removed.
       * @extra This method will also correctly operate on arrays of objects.
       * @example
       *
       *   [1,3,5].union([5,7,9])     -> [1,3,5,7,9]
       *   ['a','b'].union(['b','c']) -> ['a','b','c']
       *
       ***/
      'union': function() {
        // Optimized: no leaking arguments (flat)
        var args = [], $i; for($i = 0; $i < arguments.length; $i++) args = args.concat(arguments[$i]);
        return arrayUnique(arrayConcat(this, args));
      },

      /***
       * @method intersect([a1], [a2], ...)
       * @returns Array
       * @short Returns an array containing the elements all arrays have in common.
       * @extra This method will also correctly operate on arrays of objects.
       * @example
       *
       *   [1,3,5].intersect([5,7,9])   -> [5]
       *   ['a','b'].intersect('b','c') -> ['b']
       *
       ***/
      'intersect': function() {
        // Optimized: no leaking arguments (flat)
        var args = [], $i; for($i = 0; $i < arguments.length; $i++) args = args.concat(arguments[$i]);
        return arrayIntersect(this, args, false);
      },

      /***
       * @method subtract([a1], [a2], ...)
       * @returns Array
       * @short Subtracts from the array all elements in [a1], [a2], etc.
       * @extra This method will also correctly operate on arrays of objects.
       * @example
       *
       *   [1,3,5].subtract([5,7,9])   -> [1,3]
       *   [1,3,5].subtract([3],[5])   -> [1]
       *   ['a','b'].subtract('b','c') -> ['a']
       *
       ***/
      'subtract': function(a) {
        // Optimized: no leaking arguments (flat)
        var args = [], $i; for($i = 0; $i < arguments.length; $i++) args = args.concat(arguments[$i]);
        return arrayIntersect(this, args, true);
      },

      /***
       * @method at(<index>, [loop] = true)
       * @returns Mixed
       * @short Gets the element(s) at a given index.
       * @extra When [loop] is true, overshooting the end of the array (or the beginning) will begin counting from the other end. As an alternate syntax, passing multiple indexes will get the elements at those indexes.
       * @example
       *
       *   [1,2,3].at(0)        -> 1
       *   [1,2,3].at(2)        -> 3
       *   [1,2,3].at(4)        -> 2
       *   [1,2,3].at(4, false) -> null
       *   [1,2,3].at(-1)       -> 3
       *   [1,2,3].at(0,1)      -> [1,2]
       *
       ***/
      'at': function() {
        // Optimized: no leaking arguments
        var args = [], $i; for($i = 0; $i < arguments.length; $i++) args.push(arguments[$i]);
        return getEntriesForIndexes(this, args);
      },

      /***
       * @method first([num] = 1)
       * @returns Mixed
       * @short Returns the first element(s) in the array.
       * @extra When <num> is passed, returns the first <num> elements in the array.
       * @example
       *
       *   [1,2,3].first()        -> 1
       *   [1,2,3].first(2)       -> [1,2]
       *
       ***/
      'first': function(num) {
        if (isUndefined(num)) return this[0];
        if (num < 0) num = 0;
        return this.slice(0, num);
      },

      /***
       * @method last([num] = 1)
       * @returns Mixed
       * @short Returns the last element(s) in the array.
       * @extra When <num> is passed, returns the last <num> elements in the array.
       * @example
       *
       *   [1,2,3].last()        -> 3
       *   [1,2,3].last(2)       -> [2,3]
       *
       ***/
      'last': function(num) {
        if (isUndefined(num)) return this[this.length - 1];
        var start = this.length - num < 0 ? 0 : this.length - num;
        return this.slice(start);
      },

      /***
       * @method from(<index>)
       * @returns Array
       * @short Returns a slice of the array from <index>.
       * @example
       *
       *   [1,2,3].from(1)  -> [2,3]
       *   [1,2,3].from(2)  -> [3]
       *
       ***/
      'from': function(num) {
        return this.slice(num);
      },

      /***
       * @method to(<index>)
       * @returns Array
       * @short Returns a slice of the array up to <index>.
       * @example
       *
       *   [1,3,5].to(1)  -> [1]
       *   [1,3,5].to(2)  -> [1,3]
       *
       ***/
      'to': function(num) {
        if (isUndefined(num)) num = this.length;
        return this.slice(0, num);
      },

      /***
       * @method min([map], [all] = false)
       * @returns Mixed
       * @short Returns the element in the array with the lowest value.
       * @extra [map] may be a function mapping the value to be checked or a string acting as a shortcut. If [all] is true, will return all min values in an array.
       * @example
       *
       *   [1,2,3].min()                          -> 1
       *   ['fee','fo','fum'].min('length')       -> 'fo'
       *   ['fee','fo','fum'].min('length', true) -> ['fo']
       *   ['fee','fo','fum'].min(function(n) {
       *     return n.length;
       *   });                              -> ['fo']
       *   [{a:3,a:2}].min(function(n) {
       *     return n['a'];
       *   });                              -> [{a:2}]
       *
       ***/
      'min': function(map, all) {
        return getMinOrMax(this, map, 'min', all);
      },

      /***
       * @method max([map], [all] = false)
       * @returns Mixed
       * @short Returns the element in the array with the greatest value.
       * @extra [map] may be a function mapping the value to be checked or a string acting as a shortcut. If [all] is true, will return all max values in an array.
       * @example
       *
       *   [1,2,3].max()                          -> 3
       *   ['fee','fo','fum'].max('length')       -> 'fee'
       *   ['fee','fo','fum'].max('length', true) -> ['fee']
       *   [{a:3,a:2}].max(function(n) {
       *     return n['a'];
       *   });                              -> {a:3}
       *
       ***/
      'max': function(map, all) {
        return getMinOrMax(this, map, 'max', all);
      },

      /***
       * @method least([map])
       * @returns Array
       * @short Returns the elements in the array with the least commonly occuring value.
       * @extra [map] may be a function mapping the value to be checked or a string acting as a shortcut.
       * @example
       *
       *   [3,2,2].least()                   -> [3]
       *   ['fe','fo','fum'].least('length') -> ['fum']
       *   [{age:35,name:'ken'},{age:12,name:'bob'},{age:12,name:'ted'}].least(function(n) {
       *     return n.age;
       *   });                               -> [{age:35,name:'ken'}]
       *
       ***/
      'least': function(map, all) {
        return getMinOrMax(arrayGroupBy(this, map), 'length', 'min', all);
      },

      /***
       * @method most([map])
       * @returns Array
       * @short Returns the elements in the array with the most commonly occuring value.
       * @extra [map] may be a function mapping the value to be checked or a string acting as a shortcut.
       * @example
       *
       *   [3,2,2].most()                   -> [2]
       *   ['fe','fo','fum'].most('length') -> ['fe','fo']
       *   [{age:35,name:'ken'},{age:12,name:'bob'},{age:12,name:'ted'}].most(function(n) {
       *     return n.age;
       *   });                              -> [{age:12,name:'bob'},{age:12,name:'ted'}]
       *
       ***/
      'most': function(map, all) {
        return getMinOrMax(arrayGroupBy(this, map), 'length', 'max', all);
      },

      /***
       * @method sum([map])
       * @returns Number
       * @short Sums all values in the array.
       * @extra [map] may be a function mapping the value to be summed or a string acting as a shortcut.
       * @example
       *
       *   [1,2,2].sum()                           -> 5
       *   [{age:35},{age:12},{age:12}].sum(function(n) {
       *     return n.age;
       *   });                                     -> 59
       *   [{age:35},{age:12},{age:12}].sum('age') -> 59
       *
       ***/
      'sum': function(map) {
        return arraySum(this, map);
      },

      /***
       * @method average([map])
       * @returns Number
       * @short Gets the mean average for all values in the array.
       * @extra [map] may be a function mapping the value to be averaged or a string acting as a shortcut.
       * @example
       *
       *   [1,2,3].average()                           -> 2
       *   [{age:35},{age:11},{age:11}].average(function(n) {
       *     return n.age;
       *   });                                         -> 19
       *   [{age:35},{age:11},{age:11}].average('age') -> 19
       *
       ***/
      'average': function(map) {
        return this.length > 0 ? arraySum(this, map) / this.length : 0;
      },

      /***
       * @method inGroups(<num>, [padding])
       * @returns Array
       * @short Groups the array into <num> arrays.
       * @extra [padding] specifies a value with which to pad the last array so that they are all equal length.
       * @example
       *
       *   [1,2,3,4,5,6,7].inGroups(3)         -> [ [1,2,3], [4,5,6], [7] ]
       *   [1,2,3,4,5,6,7].inGroups(3, 'none') -> [ [1,2,3], [4,5,6], [7,'none','none'] ]
       *
       ***/
      'inGroups': function(num, padding) {
        var pad = arguments.length > 1;
        var arr = this;
        var result = [];
        var divisor = ceil(this.length / num);
        simpleRepeat(num, function(i) {
          var index = i * divisor;
          var group = arr.slice(index, index + divisor);
          if (pad && group.length < divisor) {
            simpleRepeat(divisor - group.length, function() {
              group.push(padding);
            });
          }
          result.push(group);
        });
        return result;
      },

      /***
       * @method inGroupsOf(<num>, [padding] = null)
       * @returns Array
       * @short Groups the array into arrays of <num> elements each.
       * @extra [padding] specifies a value with which to pad the last array so that they are all equal length.
       * @example
       *
       *   [1,2,3,4,5,6,7].inGroupsOf(4)         -> [ [1,2,3,4], [5,6,7] ]
       *   [1,2,3,4,5,6,7].inGroupsOf(4, 'none') -> [ [1,2,3,4], [5,6,7,'none'] ]
       *
       ***/
      'inGroupsOf': function(num, padding) {
        var result = [], len = this.length, arr = this, group;
        if (len === 0 || num === 0) return arr;
        if (isUndefined(num)) num = 1;
        if (isUndefined(padding)) padding = null;
        simpleRepeat(ceil(len / num), function(i) {
          group = arr.slice(num * i, num * i + num);
          while(group.length < num) {
            group.push(padding);
          }
          result.push(group);
        });
        return result;
      },

      /***
       * @method isEmpty()
       * @returns Boolean
       * @short Returns true if the array is empty.
       * @extra This is true if the array has a length of zero, or contains only %undefined%, %null%, or %NaN%.
       * @example
       *
       *   [].isEmpty()               -> true
       *   [null,undefined].isEmpty() -> true
       *
       ***/
      'isEmpty': function() {
        return arrayCompact(this).length == 0;
      },

      /***
       * @method sortBy(<map>, [desc] = false)
       * @returns Array
       * @short Returns a copy of the array sorted by <map>.
       * @extra <map> may be a function, a string acting as a shortcut, an array (comparison by multiple values), or blank (direct comparison of array values). [desc] will sort the array in descending order. When the field being sorted on is a string, the resulting order will be determined by an internal collation algorithm that is optimized for major Western languages, but can be customized. For more information see %array_sorting%.
       * @example
       *
       *   ['world','a','new'].sortBy('length')       -> ['a','new','world']
       *   ['world','a','new'].sortBy('length', true) -> ['world','new','a']
       *   [{age:72},{age:13},{age:18}].sortBy(function(n) {
       *     return n.age;
       *   });                                        -> [{age:13},{age:18},{age:72}]
       *
       ***/
      'sortBy': function(map, desc) {
        var arr = arrayClone(this);
        arr.sort(function(a, b) {
          var aProperty = transformArgument(a, map, arr, [a]);
          var bProperty = transformArgument(b, map, arr, [b]);
          return compareValue(aProperty, bProperty) * (desc ? -1 : 1);
        });
        return arr;
      },

      /***
       * @method randomize()
       * @returns Array
       * @short Returns a copy of the array with the elements randomized.
       * @extra Uses Fisher-Yates algorithm.
       * @example
       *
       *   [1,2,3,4].randomize()  -> [?,?,?,?]
       *
       ***/
      'randomize': function() {
        return arrayRandomize(this);
      },

      /***
       * @method zip([arr1], [arr2], ...)
       * @returns Array
       * @short Merges multiple arrays together.
       * @extra This method "zips up" smaller arrays into one large whose elements are "all elements at index 0", "all elements at index 1", etc. Useful when you have associated data that is split over separated arrays. If the arrays passed have more elements than the original array, they will be discarded. If they have fewer elements, the missing elements will filled with %null%.
       * @example
       *
       *   [1,2,3].zip([4,5,6])                                       -> [[1,2], [3,4], [5,6]]
       *   ['Martin','John'].zip(['Luther','F.'], ['King','Kennedy']) -> [['Martin','Luther','King'], ['John','F.','Kennedy']]
       *
       ***/
      'zip': function() {
        // Optimized: no leaking arguments
        var args = [], $i; for($i = 0; $i < arguments.length; $i++) args.push(arguments[$i]);
        return this.map(function(el, i) {
          return arrayConcat([el], args.map(function(k) {
            return (i in k) ? k[i] : null;
          }));
        });
      },

      /***
       * @method sample([num])
       * @returns Mixed
       * @short Returns a random element from the array.
       * @extra If [num] is passed, will return [num] samples from the array.
       * @example
       *
       *   [1,2,3,4,5].sample()  -> // Random element
       *   [1,2,3,4,5].sample(3) -> // Array of 3 random elements
       *
       ***/
      'sample': function(num) {
        var arr = arrayRandomize(this);
        return arguments.length > 0 ? arr.slice(0, num) : arr[0];
      },

      /***
       * @method each(<fn>, [index] = 0, [loop] = false)
       * @returns Array
       * @short Runs <fn> against each element in the array. Enhanced version of %Array#forEach%.
       * @extra Parameters passed to <fn> are identical to %forEach%, ie. the first parameter is the current element, second parameter is the current index, and third parameter is the array itself. If <fn> returns %false% at any time it will break out of the loop. Once %each% finishes, it will return the array. If [index] is passed, <fn> will begin at that index and work its way to the end. If [loop] is true, it will then start over from the beginning of the array and continue until it reaches [index] - 1.
       * @example
       *
       *   [1,2,3,4].each(function(n) {
       *     // Called 4 times: 1, 2, 3, 4
       *   });
       *   [1,2,3,4].each(function(n) {
       *     // Called 4 times: 3, 4, 1, 2
       *   }, 2, true);
       *
       ***/
      'each': function(fn, index, loop) {
        arrayEach(this, fn, index, loop);
        return this;
      },

      /***
       * @method add(<el>, [index])
       * @returns Array
       * @short Adds <el> to the array.
       * @extra If [index] is specified, it will add at [index], otherwise adds to the end of the array. %add% behaves like %concat% in that if <el> is an array it will be joined, not inserted. This method will change the array! Use %include% for a non-destructive alias. Also, %insert% is provided as an alias that reads better when using an index.
       * @example
       *
       *   [1,2,3,4].add(5)       -> [1,2,3,4,5]
       *   [1,2,3,4].add([5,6,7]) -> [1,2,3,4,5,6,7]
       *   [1,2,3,4].insert(8, 1) -> [1,8,2,3,4]
       *
       ***/
      'add': function(el, index) {
        return arrayAdd(this, el, index);
      },

      /***
       * @method remove([f1], [f2], ...)
       * @returns Array
       * @short Removes any element in the array that matches [f1], [f2], etc.
       * @extra Will match a string, number, array, object, or alternately test against a function or regex. This method will change the array! Use %exclude% for a non-destructive alias. This method implements %array_matching%.
       * @example
       *
       *   [1,2,3].remove(3)         -> [1,2]
       *   ['a','b','c'].remove(/b/) -> ['a','c']
       *   [{a:1},{b:2}].remove(function(n) {
       *     return n['a'] == 1;
       *   });                       -> [{b:2}]
       *
       ***/
      'remove': function() {
        for (var i = 0; i < arguments.length; i++) {
          arrayRemoveElement(this, arguments[i]);
        }
        return this;
      },

      /***
       * @method compact([all] = false)
       * @returns Array
       * @short Removes all instances of %undefined%, %null%, and %NaN% from the array.
       * @extra If [all] is %true%, all "falsy" elements will be removed. This includes empty strings, 0, and false.
       * @example
       *
       *   [1,null,2,undefined,3].compact() -> [1,2,3]
       *   [1,'',2,false,3].compact()       -> [1,'',2,false,3]
       *   [1,'',2,false,3].compact(true)   -> [1,2,3]
       *   [null, [null, 'bye']].compact()  -> ['hi', [null, 'bye']]
       *
       ***/
      'compact': function(all) {
        return arrayCompact(this, all);
      },

      /***
       * @method groupBy(<map>, [fn])
       * @returns Object
       * @short Groups the array by <map>.
       * @extra Will return an object with keys equal to the grouped values. <map> may be a mapping function, or a string acting as a shortcut. Optionally calls [fn] for each group.
       * @example
       *
       *   ['fee','fi','fum'].groupBy('length') -> { 2: ['fi'], 3: ['fee','fum'] }
       *   [{age:35,name:'ken'},{age:15,name:'bob'}].groupBy(function(n) {
       *     return n.age;
       *   });                                  -> { 35: [{age:35,name:'ken'}], 15: [{age:15,name:'bob'}] }
       *
       ***/
      'groupBy': function(map, fn) {
        return arrayGroupBy(this, map, fn);
      },

      /***
       * @method none(<f>)
       * @returns Boolean
       * @short Returns true if none of the elements in the array match <f>.
       * @extra <f> will match a string, number, array, object, or alternately test against a function or regex. This method implements %array_matching%.
       * @example
       *
       *   [1,2,3].none(5)         -> true
       *   ['a','b','c'].none(/b/) -> false
       *   [{a:1},{b:2}].none(function(n) {
       *     return n['a'] > 1;
       *   });                     -> true
       *
       ***/
      'none': function(f) {
        // Optimized: no leaking arguments
        var args = [], $i; for($i = 0; $i < arguments.length; $i++) args.push(arguments[$i]);
        return !Array.prototype.some.apply(this, args);
      }


    });


    function buildAliases() {
      /***
       * @method all()
       * @alias every
       *
       ***/
      alias(Array, 'all', 'every');

      /*** @method any()
       * @alias some
       *
       ***/
      alias(Array, 'any', 'some');

      /***
       * @method insert()
       * @alias add
       *
       ***/
      alias(Array, 'insert', 'add');
    }


    /***
     * @namespace Object
     *
     ***/

    /***
     * @method [enumerable](<obj>)
     * @returns Boolean
     * @short Enumerable methods in the Array package are also available to the Object class. They will perform their normal operations for every property in <obj>.
     * @extra In cases where a callback is used, instead of %element, index%, the callback will instead be passed %key, value%. Enumerable methods are also available to %extended objects% as instance methods.
     *
     * @set
     *   any
     *   all
     *   none
     *   count
     *   find
     *   findAll
     *   isEmpty
     *   sum
     *   average
     *   min
     *   max
     *   least
     *   most
     *
     * @example
     *
     *   Object.any({foo:'bar'}, 'bar')            -> true
     *   Object.extended({foo:'bar'}).any('bar')   -> true
     *   Object.isEmpty({})                        -> true
     *   Object.map({ fred: { age: 52 } }, 'age'); -> { fred: 52 }
     *
     ***/

    function buildEnumerableMethods(names, mapping) {
      extendSimilar(Object, names, function(methods, name) {
        var unwrapped = SugarMethods[Array][name].fn;
        methods[name] = function(obj, arg1, arg2) {
          var result, coerced = keysWithObjectCoercion(obj), matcher;
          if (!mapping) {
            matcher = getMatcher(arg1, true);
          }
          result = unwrapped.call(coerced, function(key) {
            var value = obj[key];
            if (mapping) {
              return transformArgument(value, arg1, obj, [key, value, obj]);
            } else {
              return matcher(value, key, obj);
            }
          }, arg2);
          if (isArray(result)) {
            // The method has returned an array of keys so use this array
            // to build up the resulting object in the form we want it in.
            result = result.reduce(function(o, key, i) {
              o[key] = obj[key];
              return o;
            }, {});
          }
          return result;
        };
      }, false);
      buildObjectInstanceMethods(names, Hash);
    }

    function exportSortAlgorithm() {
      Array[AlphanumericSort] = collateStrings;
    }

    var EnumerableFindingMethods = 'any,all,none,count,find,findAll,isEmpty'.split(',');
    var EnumerableMappingMethods = 'sum,average,min,max,least,most'.split(',');

    buildEnhancements();
    buildAliases();
    buildAlphanumericSort();
    buildEnumerableMethods(EnumerableFindingMethods);
    buildEnumerableMethods(EnumerableMappingMethods, true);
    exportSortAlgorithm();

    /***
     * @module Date
     * @dependency core
     * @description Date parsing and formatting, relative formats like "1 minute ago", Number methods like "daysAgo", localization support with default English locale definition.
     *
     ***/

    var English;
    var CurrentLocalization;

    var TimeFormat = ['ampm','hour','minute','second','ampm','utc','offsetSign','offsetHours','offsetMinutes','ampm'];
    var DecimalReg = '(?:[,.]\\d+)?';
    var HoursReg   = '\\d{1,2}' + DecimalReg;
    var SixtyReg   = '[0-5]\\d' + DecimalReg;
    var RequiredTime = '({t})?\\s*('+HoursReg+')(?:{h}('+SixtyReg+')?{m}(?::?('+SixtyReg+'){s})?\\s*(?:({t})|(Z)|(?:([+-])(\\d{2,2})(?::?(\\d{2,2}))?)?)?|\\s*({t}))';

    var KanjiDigits = '〇一二三四五六七八九十百千万';
    var AsianDigitMap = {};
    var AsianDigitReg;

    var DateArgumentUnits;
    var DateUnitsReversed;
    var CoreDateFormats = [];
    var CompiledOutputFormats = {};

    var DateFormatTokens = {

      'yyyy': function(d) {
        return callDateGet(d, 'FullYear');
      },

      'yy': function(d) {
        return callDateGet(d, 'FullYear').toString().slice(-2);
      },

      'ord': function(d) {
        var date = callDateGet(d, 'Date');
        return date + getOrdinalizedSuffix(date);
      },

      'tz': function(d) {
        return getUTCOffset(d);
      },

      'isotz': function(d) {
        return getUTCOffset(d, true);
      },

      'Z': function(d) {
        return getUTCOffset(d);
      },

      'ZZ': function(d) {
        return getUTCOffset(d).replace(/(\d{2})$/, ':$1');
      }

    };

    var DateUnits = [
      {
        name: 'year',
        method: 'FullYear',
        ambiguous: true,
        multiplier: 365.25 * 24 * 60 * 60 * 1000
      },
      {
        name: 'month',
        method: 'Month',
        ambiguous: true,
        multiplier: 30.4375 * 24 * 60 * 60 * 1000
      },
      {
        name: 'week',
        method: 'ISOWeek',
        multiplier: 7 * 24 * 60 * 60 * 1000
      },
      {
        name: 'day',
        method: 'Date',
        ambiguous: true,
        multiplier: 24 * 60 * 60 * 1000
      },
      {
        name: 'hour',
        method: 'Hours',
        multiplier: 60 * 60 * 1000
      },
      {
        name: 'minute',
        method: 'Minutes',
        multiplier: 60 * 1000
      },
      {
        name: 'second',
        method: 'Seconds',
        multiplier: 1000
      },
      {
        name: 'millisecond',
        method: 'Milliseconds',
        multiplier: 1
      }
    ];




    // Date Localization

    var Localizations = {};

    // Localization object

    function Localization(l) {
      simpleMerge(this, l);
      this.compiledFormats = CoreDateFormats.concat();
    }

    Localization.prototype = {

      get: function(prop) {
        return this[prop] || '';
      },

      getMonth: function(n) {
        if (isNumber(n)) {
          return n - 1;
        } else {
          return this.months.indexOf(n) % 12;
        }
      },

      getWeekday: function(n) {
        return this.weekdays.indexOf(n) % 7;
      },

      getNumber: function(n, digit) {
        var mapped = this.ordinalNumberMap[n];
        if (mapped) {
          if (digit) {
            mapped = mapped % 10;
          }
          return mapped;
        }
        return isNumber(n) ? n : 1;
      },

      getNumericDate: function(n) {
        var self = this;
        return n.replace(RegExp(this.num, 'g'), function(d) {
          var num = self.getNumber(d, true);
          return num || '';
        });
      },

      getUnitIndex: function(n) {
        return this.units.indexOf(n) % 8;
      },

      getRelativeFormat: function(adu) {
        return this.convertAdjustedToFormat(adu, adu[2] > 0 ? 'future' : 'past');
      },

      getDuration: function(ms) {
        return this.convertAdjustedToFormat(getAdjustedUnitForNumber(ms), 'duration');
      },

      hasVariant: function(code) {
        code = code || this.code;
        return code === 'en' || code === 'en-US' ? true : this.variant;
      },

      matchAM: function(str) {
        return str === this.get('ampm')[0];
      },

      matchPM: function(str) {
        return str && str === this.get('ampm')[1];
      },

      convertAdjustedToFormat: function(adu, mode) {
        var sign, unit, mult,
            num    = adu[0],
            u      = adu[1],
            ms     = adu[2],
            format = this[mode] || this.relative;
        if (isFunction(format)) {
          return format.call(this, num, u, ms, mode);
        }
        mult = !this.plural || num === 1 ? 0 : 1;
        unit = this.units[mult * 8 + u] || this.units[u];
        if (this.capitalizeUnit) unit = simpleCapitalize(unit);
        sign = this.modifiers.filter(function(m) { return m.name == 'sign' && m.value == (ms > 0 ? 1 : -1); })[0];
        return format.replace(/\{(.*?)\}/g, function(full, match) {
          switch(match) {
            case 'num': return num;
            case 'unit': return unit;
            case 'sign': return sign.src;
          }
        });
      },

      getFormats: function() {
        return this.cachedFormat ? [this.cachedFormat].concat(this.compiledFormats) : this.compiledFormats;
      },

      addFormat: function(src, allowsTime, match, variant, iso) {
        var to = match || [], loc = this, time, timeMarkers, lastIsNumeral;

        src = src.replace(/\s+/g, '[,. ]*');
        src = src.replace(/\{([^,]+?)\}/g, function(all, k) {
          var value, arr, result,
              opt   = k.match(/\?$/),
              nc    = k.match(/^(\d+)\??$/),
              slice = k.match(/(\d)(?:-(\d))?/),
              key   = k.replace(/[^a-z]+$/, '');
          if (nc) {
            value = loc.get('tokens')[nc[1]];
          } else if (loc[key]) {
            value = loc[key];
          } else if (loc[key + 's']) {
            value = loc[key + 's'];
            if (slice) {
              value = value.filter(function(m, i) {
                var mod = i % (loc.units ? 8 : value.length);
                return mod >= slice[1] && mod <= (slice[2] || slice[1]);
              });
            }
            value = arrayToAlternates(value);
          }
          if (!value) {
            return '';
          }
          if (nc) {
            result = '(?:' + value + ')';
          } else {
            if (!match) {
              to.push(key);
            }
            result = '(' + value + ')';
          }
          if (opt) {
            result += '?';
          }
          return result;
        });
        if (allowsTime) {
          time = prepareTime(RequiredTime, loc, iso);
          timeMarkers = ['t','[\\s\\u3000]'].concat(loc.get('timeMarker'));
          lastIsNumeral = src.match(/\\d\{\d,\d\}\)+\??$/);
          addDateInputFormat(loc, '(?:' + time + ')[,\\s\\u3000]+?' + src, TimeFormat.concat(to), variant);
          addDateInputFormat(loc, src + '(?:[,\\s]*(?:' + timeMarkers.join('|') + (lastIsNumeral ? '+' : '*') +')' + time + ')?', to.concat(TimeFormat), variant);
        } else {
          addDateInputFormat(loc, src, to, variant);
        }
      }

    };


    // Localization helpers

    function getLocalization(localeCode, fallback) {
      var loc;
      if (!isString(localeCode)) localeCode = '';
      loc = Localizations[localeCode] || Localizations[localeCode.slice(0,2)];
      if (fallback === false && !loc) {
        throw new TypeError('Invalid locale.');
      }
      return loc || CurrentLocalization;
    }

    function setLocalization(localeCode, set) {
      var loc;

      function initializeField(name) {
        var val = loc[name];
        if (isString(val)) {
          loc[name] = val.split(',');
        } else if (!val) {
          loc[name] = [];
        }
      }

      function eachAlternate(str, fn) {
        str = str.split('+').map(function(split) {
          return split.replace(/(.+):(.+)$/, function(full, base, suffixes) {
            return suffixes.split('|').map(function(suffix) {
              return base + suffix;
            }).join('|');
          });
        }).join('|');
        return str.split('|').forEach(fn);
      }

      function setArray(name, abbreviationSize, multiple) {
        var arr = [];
        loc[name].forEach(function(full, i) {
          if (abbreviationSize) {
            full += '+' + full.slice(0, abbreviationSize);
          }
          eachAlternate(full, function(alt, j) {
            arr[j * multiple + i] = alt.toLowerCase();
          });
        });
        loc[name] = arr;
      }

      function getDigit(start, stop, allowNumbers) {
        var str = '\\d{' + start + ',' + stop + '}';
        if (allowNumbers) str += '|(?:' + arrayToAlternates(loc.get('numbers')) + ')+';
        return str;
      }

      function getNum() {
        var numbers = loc.get('numbers');
        var arr = ['-?\\d+'].concat(loc.get('articles'));
        if (numbers) {
          arr = arr.concat(numbers);
        }
        return arrayToAlternates(arr);
      }

      function getAbbreviationSize(type) {
        // Month suffixes like those found in Asian languages
        // serve as a good proxy to detect month/weekday abbreviations.
        var hasMonthSuffix = !!loc.monthSuffix;
        return loc[type + 'Abbreviate'] || (hasMonthSuffix ? null : 3);
      }

      function setDefault(name, value) {
        loc[name] = loc[name] || value;
      }

      function buildNumbers() {
        var map = loc.ordinalNumberMap = {}, all = [];
        loc.numbers.forEach(function(full, i) {
          eachAlternate(full, function(alt) {
            all.push(alt);
            map[alt] = i + 1;
          });
        });
        loc.numbers = all;
      }

      function buildModifiers() {
        var arr = [];
        loc.modifiersByName = {};
        loc.modifiers.push({ name: 'day', src: 'yesterday', value:-1 });
        loc.modifiers.push({ name: 'day', src: 'today',     value: 0 });
        loc.modifiers.push({ name: 'day', src: 'tomorrow',  value: 1 });
        loc.modifiers.forEach(function(modifier) {
          var name = modifier.name;
          eachAlternate(modifier.src, function(t) {
            var locEntry = loc[name];
            loc.modifiersByName[t] = modifier;
            arr.push({ name: name, src: t, value: modifier.value });
            loc[name] = locEntry ? locEntry + '|' + t : t;
          });
        });
        loc.day += '|' + arrayToAlternates(loc.weekdays);
        loc.modifiers = arr;
      }

      // Initialize the locale
      loc = new Localization(set);
      initializeField('modifiers');
      'months,weekdays,units,numbers,articles,tokens,timeMarker,ampm,timeSuffixes,dateParse,timeParse'.split(',').forEach(initializeField);

      buildNumbers();

      setArray('months', getAbbreviationSize('month'), 12);
      setArray('weekdays', getAbbreviationSize('weekday'), 7);
      setArray('units', false, 8);

      setDefault('code', localeCode);
      setDefault('date', getDigit(1,2, loc.digitDate));
      setDefault('year', "'\\d{2}|" + getDigit(4,4));
      setDefault('num', getNum());

      buildModifiers();

      if (loc.monthSuffix) {
        loc.month = getDigit(1,2);
        loc.months = '1,2,3,4,5,6,7,8,9,10,11,12'.split(',').map(function(n) { return n + loc.monthSuffix; });
      }
      loc.fullMonth = getDigit(1,2) + '|' + arrayToAlternates(loc.months);

      // The order of these formats is very important. Order is reversed so formats that come
      // later will take precedence over formats that come before. This generally means that
      // more specific formats should come later, however, the {year} format should come before
      // {day}, as 2011 needs to be parsed as a year (2011) and not date (20) + hours (11)

      // If the locale has time suffixes then add a time only format for that locale
      // that is separate from the core English-based one.
      if (loc.timeSuffixes.length > 0) {
        loc.addFormat(prepareTime(RequiredTime, loc), false, TimeFormat);
      }

      loc.addFormat('{day}', true);
      loc.addFormat('{month}' + (loc.monthSuffix || ''));
      loc.addFormat('{year}' + (loc.yearSuffix || ''));

      loc.timeParse.forEach(function(src) {
        loc.addFormat(src, true);
      });

      loc.dateParse.forEach(function(src) {
        loc.addFormat(src);
      });

      return Localizations[localeCode] = loc;
    }


    // General helpers

    function addDateInputFormat(locale, format, match, variant) {
      locale.compiledFormats.unshift({
        variant: !!variant,
        locale: locale,
        reg: RegExp('^' + format + '$', 'i'),
        to: match
      });
    }

    function simpleCapitalize(str) {
      return str.slice(0,1).toUpperCase() + str.slice(1);
    }

    function arrayToAlternates(arr) {
      return arr.filter(function(el) {
        return !!el;
      }).join('|');
    }

    function getNewDate() {
      var fn = Date.SugarNewDate;
      return fn ? fn() : new Date;
    }

    function cloneDate(d) {
      var cloned = new Date(d.getTime());
      setUTC(cloned, !!d._utc);
      return cloned;
    }

    // Normal callDateSet method with ability
    // to handle ISOWeek setting as well.
    function callDateSetWithWeek(d, method, value) {
      if (method === 'ISOWeek') {
        return setWeekNumber(d, value);
      } else {
        return callDateSet(d, method, value);
      }
    }

    function isValid(d) {
      return !isNaN(d.getTime());
    }

    function isLeapYear(d) {
      var year = callDateGet(d, 'FullYear');
      return (year % 4 === 0 && year % 100 !== 0) || (year % 400 === 0);
    }

    // UTC helpers

    function setUTC(d, force) {
      setProperty(d, '_utc', !!force);
      return d;
    }

    function isUTC(d) {
      return !!d._utc || d.getTimezoneOffset() === 0;
    }

    function getUTCOffset(d, iso) {
      var offset = d._utc ? 0 : d.getTimezoneOffset();
      var colon  = iso === true ? ':' : '';
      if (!offset && iso) return 'Z';
      return padNumber(floor(-offset / 60), 2, true) + colon + padNumber(abs(offset % 60), 2);
    }

    // Date argument helpers

    function collectDateArguments(args, allowDuration) {
      var obj;
      if (isObjectType(args[0])) {
        return args;
      } else if (isNumber(args[0]) && !isNumber(args[1])) {
        return [args[0]];
      } else if (isString(args[0]) && allowDuration) {
        return [getDateParamsFromString(args[0]), args[1]];
      }
      obj = {};
      DateArgumentUnits.forEach(function(u,i) {
        obj[u.name] = args[i];
      });
      return [obj];
    }

    function getDateParamsFromString(str, num) {
      var match, num, params = {};
      match = str.match(/^(-?\d+)?\s?(\w+?)s?$/i);
      if (match) {
        if (isUndefined(num)) {
          num = parseInt(match[1]);
          if (isNaN(num)) {
            num = 1;
          }
        }
        params[match[2].toLowerCase()] = num;
      }
      return params;
    }

    // Date iteration helpers

    function iterateOverDateUnits(fn, from, to) {
      var i, unit;
      if (isUndefined(to)) to = DateUnitsReversed.length;
      for(i = from || 0; i < to; i++) {
        unit = DateUnitsReversed[i];
        if (fn(unit.name, unit, i) === false) {
          break;
        }
      }
    }

    // Date shifting helpers

    function advanceDate(d, args) {
      var set = collectDateArguments(args, true);
      return updateDate(d, set[0], set[1], 1);
    }

    function setDate(d, args) {
      var set = collectDateArguments(args);
      return updateDate(d, set[0], set[1])
    }

    function resetDate(d, unit) {
      var params = {}, recognized;
      unit = unit || 'hours';
      if (unit === 'date') unit = 'days';
      recognized = DateUnits.some(function(u) {
        return unit === u.name || unit === u.name + 's';
      });
      params[unit] = unit.match(/^days?/) ? 1 : 0;
      return recognized ? setDate(d, [params, true]) : d;
    }

    function setWeekday(d, dow, forward) {
      if (!isNumber(dow)) return;
      // Dates like "the 2nd Tuesday of June" need to be set forward
      // so make sure that the day of the week reflects that here.
      if (forward && dow % 7 < d.getDay()) {
        dow += 7;
      }
      return callDateSet(d, 'Date', callDateGet(d, 'Date') + dow - callDateGet(d, 'Day'));
    }

    function moveToBeginningOfUnit(d, unit) {
      var set = {};
      switch(unit) {
        case 'year':  set.year    = callDateGet(d, 'FullYear'); break;
        case 'month': set.month   = callDateGet(d, 'Month');    break;
        case 'day':   set.day     = callDateGet(d, 'Date');     break;
        case 'week':  set.weekday = 0; break;
      }
      return setDate(d, [set, true]);
    }

    function moveToEndOfUnit(d, unit) {
      var set = { hours: 23, minutes: 59, seconds: 59, milliseconds: 999 };
      switch(unit) {
        case 'year':  set.month   = 11; set.day = 31;  break;
        case 'month': set.day     = getDaysInMonth(d); break;
        case 'week':  set.weekday = 6;                 break;
      }
      return setDate(d, [set, true]);
    }

    // Date parsing helpers

    function getFormatMatch(match, arr) {
      var obj = {}, value, num;
      arr.forEach(function(key, i) {
        value = match[i + 1];
        if (isUndefined(value) || value === '') return;
        if (key === 'year') {
          obj.yearAsString = value.replace(/'/, '');
        }
        num = parseFloat(value.replace(/'/, '').replace(/,/, '.'));
        obj[key] = !isNaN(num) ? num : value.toLowerCase();
      });
      return obj;
    }

    function cleanDateInput(str) {
      str = str.trim().replace(/^just (?=now)|\.+$/i, '');
      return convertAsianDigits(str);
    }

    function convertAsianDigits(str) {
      return str.replace(AsianDigitReg, function(full, disallowed, match) {
        var sum = 0, place = 1, lastWasHolder, lastHolder;
        if (disallowed) return full;
        match.split('').reverse().forEach(function(letter) {
          var value = AsianDigitMap[letter], holder = value > 9;
          if (holder) {
            if (lastWasHolder) sum += place;
            place *= value / (lastHolder || 1);
            lastHolder = value;
          } else {
            if (lastWasHolder === false) {
              place *= 10;
            }
            sum += place * value;
          }
          lastWasHolder = holder;
        });
        if (lastWasHolder) sum += place;
        return sum;
      });
    }

    function getExtendedDate(contextDate, f, localeCode, prefer, forceUTC) {
      // TODO can we split this up into smaller methods?
      var d, relative, baseLocalization, afterCallbacks, loc, set, unit, unitIndex, weekday, num, tmp, weekdayForward;

      afterCallbacks = [];

      function afterDateSet(fn) {
        afterCallbacks.push(fn);
      }

      function fireCallbacks() {
        afterCallbacks.forEach(function(fn) {
          fn.call();
        });
      }

      function getWeekdayWithMultiplier(w) {
        var num = set.num && !set.unit ? set.num : 1;
        return (7 * (num - 1)) + w;
      }

      function setWeekdayOfMonth() {
        setWeekday(d, set.weekday, true);
      }

      function setUnitEdge() {
        var modifier = loc.modifiersByName[set.edge];
        iterateOverDateUnits(function(name) {
          if (isDefined(set[name])) {
            unit = name;
            return false;
          }
        }, 4);
        if (unit === 'year') {
          set.specificity = 'month';
        } else if (unit === 'month' || unit === 'week') {
          set.specificity = 'day';
        }
        if (modifier.value < 0) {
          moveToEndOfUnit(d, unit);
        } else {
          moveToBeginningOfUnit(d, unit);
        }
        // This value of -2 is arbitrary but it's a nice clean way to hook into this system.
        if (modifier.value === -2) resetDate(d);
      }

      function separateAbsoluteUnits() {
        var params;
        iterateOverDateUnits(function(name, u, i) {
          if (name === 'day') name = 'date';
          if (isDefined(set[name])) {
            // If there is a time unit set that is more specific than
            // the matched unit we have a string like "5:30am in 2 minutes",
            // which is meaningless, so invalidate the date...
            if (i >= unitIndex) {
              invalidateDate(d);
              return false;
            }
            // ...otherwise set the params to set the absolute date
            // as a callback after the relative date has been set.
            params = params || {};
            params[name] = set[name];
            delete set[name];
          }
        });
        if (params) {
          afterDateSet(function() {
            setDate(d, [params, true]);
          });
        }
      }

      if (contextDate && f) {
        // If a context date is passed, (in the case of "get"
        // and "[unit]FromNow") then use it as the starting point.
        d = cloneDate(contextDate);
      } else {
        d = getNewDate();
      }

      setUTC(d, forceUTC);

      if (isDate(f)) {
        // If the source here is already a date object, then the operation
        // is the same as cloning the date, which preserves the UTC flag.
        setUTC(d, isUTC(f)).setTime(f.getTime());
      } else if (isNumber(f) || f === null) {
        d.setTime(f);
      } else if (isObjectType(f)) {
        setDate(d, [f, true]);
        set = f;
      } else if (isString(f)) {

        // The act of getting the localization will pre-initialize
        // if it is missing and add the required formats.
        baseLocalization = getLocalization(localeCode);

        // Clean the input and convert Kanji based numerals if they exist.
        f = cleanDateInput(f);

        if (baseLocalization) {
          iterateOverObject(baseLocalization.getFormats(), function(i, dif) {
            var match = f.match(dif.reg);
            if (match) {

              loc = dif.locale;
              set = getFormatMatch(match, dif.to, loc);
              loc.cachedFormat = dif;

              if (set.utc) {
                setUTC(d, true);
              }

              if (set.timestamp) {
                set = set.timestamp;
                return false;
              }

              if (dif.variant && !isString(set.month) && (isString(set.date) || baseLocalization.hasVariant(localeCode))) {
                // If there's a variant (crazy Endian American format), swap the month and day.
                tmp = set.month;
                set.month = set.date;
                set.date  = tmp;
              }

              if (hasAbbreviatedYear(set)) {
                // If the year is 2 digits then get the implied century.
                set.year = getYearFromAbbreviation(set.year);
              }

              if (set.month) {
                // Set the month which may be localized.
                set.month = loc.getMonth(set.month);
                if (set.shift && !set.unit) set.unit = loc.units[7];
              }

              if (set.weekday && set.date) {
                // If there is both a weekday and a date, the date takes precedence.
                delete set.weekday;
              } else if (set.weekday) {
                // Otherwise set a localized weekday.
                set.weekday = loc.getWeekday(set.weekday);
                if (set.shift && !set.unit) {
                  set.unit = loc.units[5];
                }
              }

              if (set.day && (tmp = loc.modifiersByName[set.day])) {
                // Relative day localizations such as "today" and "tomorrow".
                set.day = tmp.value;
                resetDate(d);
                relative = true;
              } else if (set.day && (weekday = loc.getWeekday(set.day)) > -1) {
                // If the day is a weekday, then set that instead.
                delete set.day;
                set.weekday = getWeekdayWithMultiplier(weekday);
                if (set.num && set.month) {
                  // If we have "the 2nd Tuesday of June", then pass the "weekdayForward" flag
                  // along to updateDate so that the date does not accidentally traverse into
                  // the previous month. This needs to be independent of the "prefer" flag because
                  // we are only ensuring that the weekday is in the future, not the entire date.
                  weekdayForward = true;
                }
              }

              if (set.date && !isNumber(set.date)) {
                set.date = loc.getNumericDate(set.date);
              }

              if (loc.matchPM(set.ampm) && set.hour < 12) {
                // If the time is 1pm-11pm advance the time by 12 hours.
                set.hour += 12;
              } else if (loc.matchAM(set.ampm) && set.hour === 12) {
                // If it is 12:00am then set the hour to 0.
                set.hour = 0;
              }

              if (isNumber(set.offsetHours) || isNumber(set.offsetMinutes)) {
                // Adjust for timezone offset
                setUTC(d, true);
                set.offsetMinutes = set.offsetMinutes || 0;
                set.offsetMinutes += set.offsetHours * 60;
                if (set.offsetSign === '-') {
                  set.offsetMinutes *= -1;
                }
                set.minute -= set.offsetMinutes;
              }

              if (set.unit) {
                // Date has a unit like "days", "months", etc. are all relative to the current date.
                relative  = true;
                num       = loc.getNumber(set.num);
                unitIndex = loc.getUnitIndex(set.unit);
                unit      = English.units[unitIndex];

                // Formats like "the 15th of last month" or "6:30pm of next week"
                // contain absolute units in addition to relative ones, so separate
                // them here, remove them from the params, and set up a callback to
                // set them after the relative ones have been set.
                separateAbsoluteUnits();

                if (set.shift) {
                  // Shift and unit, ie "next month", "last week", etc.
                  num *= (tmp = loc.modifiersByName[set.shift]) ? tmp.value : 0;
                }

                if (set.sign && (tmp = loc.modifiersByName[set.sign])) {
                  // Unit and sign, ie "months ago", "weeks from now", etc.
                  num *= tmp.value;
                }

                if (isDefined(set.weekday)) {
                  // Units can be with non-relative dates, set here. ie "the day after monday"
                  setDate(d, [{ weekday: set.weekday }, true]);
                  delete set.weekday;
                }

                // Finally shift the unit.
                set[unit] = (set[unit] || 0) + num;
              }

              if (set.edge) {
                // If there is an "edge" it needs to be set after the
                // other fields are set. ie "the end of February"
                afterDateSet(setUnitEdge);
              }

              if (set.yearSign === '-') {
                set.year *= -1;
              }

              iterateOverDateUnits(function(name, unit, i) {
                var value = set[name] || 0, fraction = value % 1;
                if (fraction) {
                  set[DateUnitsReversed[i - 1].name] = round(fraction * (name === 'second' ? 1000 : 60));
                  set[name] = floor(value);
                }
              }, 1, 4);
              return false;
            }
          });
        }
        if (!set) {
          // The Date constructor does something tricky like checking the number
          // of arguments so simply passing in undefined won't work.
          if (!/^now$/i.test(f)) {
            d = new Date(f);
          }
          if (forceUTC) {
            // Falling back to system date here which cannot be parsed as UTC,
            // so if we're forcing UTC then simply add the offset.
            d.addMinutes(-d.getTimezoneOffset());
          }
        } else if (relative) {
          advanceDate(d, [set]);
        } else {
          if (d._utc) {
            // UTC times can traverse into other days or even months,
            // so preemtively reset the time here to prevent this.
            resetDate(d);
          }
          updateDate(d, set, true, false, prefer, weekdayForward);
        }
        fireCallbacks();
        // A date created by parsing a string presumes that the format *itself* is UTC, but
        // not that the date, once created, should be manipulated as such. In other words,
        // if you are creating a date object from a server time "2012-11-15T12:00:00Z",
        // in the majority of cases you are using it to create a date that will, after creation,
        // be manipulated as local, so reset the utc flag here.
        setUTC(d, false);
      }
      return {
        date: d,
        set: set
      }
    }

    function hasAbbreviatedYear(obj) {
      return obj.yearAsString && obj.yearAsString.length === 2;
    }

    // If the year is two digits, add the most appropriate century prefix.
    function getYearFromAbbreviation(year) {
      return round(callDateGet(getNewDate(), 'FullYear') / 100) * 100 - round(year / 100) * 100 + year;
    }

    function getShortHour(d) {
      var hours = callDateGet(d, 'Hours');
      return hours === 0 ? 12 : hours - (floor(hours / 13) * 12);
    }

    // weeksSince won't work here as the result needs to be floored, not rounded.
    function getWeekNumber(date) {
      date = cloneDate(date);
      var dow = callDateGet(date, 'Day') || 7;
      resetDate(advanceDate(date, [(4 - dow) + ' days']));
      return 1 + floor(date.daysSince(moveToBeginningOfUnit(cloneDate(date), 'year')) / 7);
    }

    function setWeekNumber(date, num) {
      var weekday = callDateGet(date, 'Day') || 7;
      if (isUndefined(num)) return;
      setDate(date, [{ month: 0, date: 4 }]);
      setDate(date, [{ weekday: 1 }]);
      if (num > 1) {
        advanceDate(date, [{ weeks: num - 1 }]);
      }
      if (weekday !== 1) {
        advanceDate(date, [{ days: weekday - 1 }]);
      }
      return date.getTime();
    }

    function getDaysInMonth(d) {
      return 32 - callDateGet(new Date(callDateGet(d, 'FullYear'), callDateGet(d, 'Month'), 32), 'Date');
    }

    // Gets an "adjusted date unit" which is a way of representing
    // the largest possible meaningful unit. In other words, if passed
    // 3600000, this will return an array which represents "1 hour".
    function getAdjustedUnit(ms, fn) {
      var unitIndex = 0, value = 0;
      iterateOverObject(DateUnits, function(i, unit) {
        value = abs(fn(unit));
        if (value >= 1) {
          unitIndex = 7 - i;
          return false;
        }
      });
      return [value, unitIndex, ms];
    }

    // Gets the adjusted unit based on simple division by
    // date unit multiplier.
    function getAdjustedUnitForNumber(ms) {
      return getAdjustedUnit(ms, function(unit) {
        return floor(withPrecision(ms / unit.multiplier, 1));
      });
    }

    // Gets the adjusted unit using the [unit]FromNow methods,
    // which use internal date methods that neatly avoid vaguely
    // defined units of time (days in month, leap years, etc).
    function getAdjustedUnitForDate(d) {
      var ms = d - new Date();
      if (d.getTime() > Date.now()) {

        // This adjustment is solely to allow
        // Date.create('1 year from now').relative() to remain
        // "1 year from now" instead of "11 months from now",
        // as it would be due to the fact that the internal
        // "now" date in "relative" is created slightly after
        // that in "create".
        d = new Date(d.getTime() + 10);
      }
      return getAdjustedUnit(ms, function(unit) {
        return abs(d[unit.name + 'sFromNow']());
      });
    }

    // Date format token helpers

    function createMeridianTokens(slice, caps) {
      var fn = function(d, localeCode) {
        var hours = callDateGet(d, 'Hours');
        return getLocalization(localeCode).get('ampm')[floor(hours / 12)] || '';
      }
      createFormatToken('t', fn, 1);
      createFormatToken('tt', fn);
      createFormatToken('T', fn, 1, 1);
      createFormatToken('TT', fn, null, 2);
    }

    function createWeekdayTokens(slice, caps) {
      var fn = function(d, localeCode) {
        var dow = callDateGet(d, 'Day');
        return getLocalization(localeCode).weekdays[dow];
      }
      createFormatToken('do', fn, 2);
      createFormatToken('Do', fn, 2, 1);
      createFormatToken('dow', fn, 3);
      createFormatToken('Dow', fn, 3, 1);
      createFormatToken('weekday', fn);
      createFormatToken('Weekday', fn, null, 1);
    }

    function createMonthTokens(slice, caps) {
      createMonthToken('mon', 0, 3);
      createMonthToken('month', 0);

      // For inflected month forms, namely Russian.
      createMonthToken('month2', 1);
      createMonthToken('month3', 2);
    }

    function createMonthToken(token, multiplier, slice) {
      var fn = function(d, localeCode) {
        var month = callDateGet(d, 'Month');
        return getLocalization(localeCode).months[month + (multiplier * 12)];
      };
      createFormatToken(token, fn, slice);
      createFormatToken(simpleCapitalize(token), fn, slice, 1);
    }

    function createFormatToken(t, fn, slice, caps) {
      DateFormatTokens[t] = function(d, localeCode) {
        var str = fn(d, localeCode);
        if (slice) str = str.slice(0, slice);
        if (caps)  str = str.slice(0, caps).toUpperCase() + str.slice(caps);
        return str;
      }
    }

    function createPaddedToken(t, fn, ms) {
      DateFormatTokens[t] = fn;
      DateFormatTokens[t + t] = function (d, localeCode) {
        return padNumber(fn(d, localeCode), 2);
      };
      if (ms) {
        DateFormatTokens[t + t + t] = function (d, localeCode) {
          return padNumber(fn(d, localeCode), 3);
        };
        DateFormatTokens[t + t + t + t] = function (d, localeCode) {
          return padNumber(fn(d, localeCode), 4);
        };
      }
    }


    // Date formatting helpers

    function buildCompiledOutputFormat(format) {
      var match = format.match(/(\{\w+\})|[^{}]+/g);
      CompiledOutputFormats[format] = match.map(function(p) {
        p.replace(/\{(\w+)\}/, function(full, token) {
          p = DateFormatTokens[token] || token;
          return token;
        });
        return p;
      });
    }

    function executeCompiledOutputFormat(date, format, localeCode) {
      var compiledFormat, length, i, t, result = '';
      compiledFormat = CompiledOutputFormats[format];
      for(i = 0, length = compiledFormat.length; i < length; i++) {
        t = compiledFormat[i];
        result += isFunction(t) ? t(date, localeCode) : t;
      }
      return result;
    }

    function formatDate(date, format, relative, localeCode) {
      var adu;
      if (!isValid(date)) {
        return 'Invalid Date';
      } else if (isString(Date[format])) {
        format = Date[format];
      } else if (isFunction(format)) {
        adu = getAdjustedUnitForDate(date);
        format = format.apply(date, adu.concat(getLocalization(localeCode)));
      }
      if (!format && relative) {
        adu = adu || getAdjustedUnitForDate(date);
        // Adjust up if time is in ms, as this doesn't
        // look very good for a standard relative date.
        if (adu[1] === 0) {
          adu[1] = 1;
          adu[0] = 1;
        }
        return getLocalization(localeCode).getRelativeFormat(adu);
      }
      format = format || 'long';
      if (format === 'short' || format === 'long' || format === 'full') {
        format = getLocalization(localeCode)[format];
      }

      if (!CompiledOutputFormats[format]) {
        buildCompiledOutputFormat(format);
      }

      return executeCompiledOutputFormat(date, format, localeCode);
    }

    // Date comparison helpers

    function fullCompareDate(d, f, margin, utc) {
      var tmp, comp;
      if (!isValid(d)) return;
      if (isString(f)) {
        f = f.trim().toLowerCase();
        comp = setUTC(cloneDate(d), utc);
        switch(true) {
          case f === 'future':  return d.getTime() > getNewDate().getTime();
          case f === 'past':    return d.getTime() < getNewDate().getTime();
          case f === 'weekday': return callDateGet(comp, 'Day') > 0 && callDateGet(comp, 'Day') < 6;
          case f === 'weekend': return callDateGet(comp, 'Day') === 0 || callDateGet(comp, 'Day') === 6;
          case (tmp = English.weekdays.indexOf(f) % 7) > -1: return callDateGet(comp, 'Day') === tmp;
          case (tmp = English.months.indexOf(f) % 12) > -1:  return callDateGet(comp, 'Month') === tmp;
        }
      }
      return compareDate(d, f, null, margin, utc);
    }

    function compareDate(d, find, localeCode, buffer, forceUTC) {
      var p, t, min, max, override, accuracy = 0, loBuffer = 0, hiBuffer = 0;
      p = getExtendedDate(null, find, localeCode, null, forceUTC);
      if (buffer > 0) {
        loBuffer = hiBuffer = buffer;
        override = true;
      }
      if (!isValid(p.date)) return false;
      if (p.set && p.set.specificity) {
        if (p.set.edge || p.set.shift) {
          moveToBeginningOfUnit(p.date, p.set.specificity);
        }
        if (p.set.specificity === 'month') {
          max = moveToEndOfUnit(cloneDate(p.date), p.set.specificity).getTime();
        } else {
          max = advanceDate(cloneDate(p.date), ['1 ' + p.set.specificity]).getTime() - 1;
        }
        if (!override && p.set.sign && p.set.specificity !== 'millisecond') {
          // If the time is relative, there can occasionally be an disparity between the relative date
          // and "now", which it is being compared to, so set an extra buffer to account for this.
          loBuffer = 50;
          hiBuffer = -50;
        }
      }
      t   = d.getTime();
      min = p.date.getTime();
      max = max || (min + accuracy);
      max = compensateForTimezoneTraversal(d, min, max);
      return t >= (min - loBuffer) && t <= (max + hiBuffer);
    }

    function compensateForTimezoneTraversal(d, min, max) {
      var dMin, dMax, minOffset, maxOffset;
      dMin = new Date(min);
      dMax = setUTC(new Date(max), isUTC(d));
      if (callDateGet(dMax, 'Hours') !== 23) {
        minOffset = dMin.getTimezoneOffset();
        maxOffset = dMax.getTimezoneOffset();
        if (minOffset !== maxOffset) {
          max += (maxOffset - minOffset).minutes();
        }
      }
      return max;
    }

    function updateDate(d, params, reset, advance, prefer, weekdayForward) {
      var specificityIndex, noop = true;

      function getParam(key) {
        return isDefined(params[key]) ? params[key] : params[key + 's'];
      }

      function paramExists(key) {
        return isDefined(getParam(key));
      }

      function uniqueParamExists(key, isDay) {
        return paramExists(key) || (isDay && paramExists('weekday') && !paramExists('month'));
      }

      function canDisambiguate() {
        switch(prefer) {
          case -1: return d > getNewDate();
          case  1: return d < getNewDate();
        }
      }

      if (isNumber(params) && advance) {
        // If param is a number and we're advancing, the number is presumed to be milliseconds.
        params = { milliseconds: params };
      } else if (isNumber(params)) {
        // Otherwise just set the timestamp and return.
        d.setTime(params);
        return d;
      }

      // "date" can also be passed for the day
      if (isDefined(params.date)) {
        params.day = params.date;
      }

      // Reset any unit lower than the least specific unit set. Do not do this for
      // weeks or for years. This needs to be performed before the acutal setting
      // of the date because the order needs to be reversed in order to get the
      // lowest specificity, also because higher order units can be overridden by
      // lower order units, such as setting hour: 3, minute: 345, etc.
      iterateOverDateUnits(function(name, unit, i) {
        var isDay = name === 'day';
        if (uniqueParamExists(name, isDay)) {
          params.specificity = name;
          specificityIndex = +i;
          return false;
        } else if (reset && name !== 'week' && (!isDay || !paramExists('week'))) {
          // Days are relative to months, not weeks, so don't reset if a week exists.
          callDateSet(d, unit.method, (isDay ? 1 : 0));
        }
      });

      // Now actually set or advance the date in order, higher units first.
      DateUnits.forEach(function(u, i) {
        var name = u.name, method = u.method, value, checkMonth;
        value = getParam(name)
        if (isUndefined(value)) return;

        noop = false;
        checkMonth = name === 'month' && callDateGet(d, 'Date') > 28;

        // If we are advancing or rewinding, then we need we need to set the
        // absolute time if the unit is "hours" or less. This is due to the fact
        // that setting by method is ambiguous during DST shifts. For example,
        // 1:00am on November 1st 2015 occurs twice in North American timezones
        // with DST, the second time being after the clocks are rolled back at
        // 2:00am. When springing forward this is automatically handled as there
        // is no 2:00am so the date automatically jumps to 3:00am. However, when
        // rolling back, a date at 1:00am that has setHours(2) called on it will
        // jump forward and extra hour as the period between 1:00am and 1:59am
        // occurs twice. This ambiguity is unavoidable when setting dates as the
        // notation is ambiguous. However, when advancing we clearly want the
        // resulting date to be an acutal hour ahead, which can only accomplished
        // by setting the absolute time. Conversely, any unit higher than "hours"
        // MUST use the internal set methods, as they are ambiguous as absolute
        // units of time. Years may be 365 or 366 days depending on leap years,
        // months are all over the place, and even days may be 23-25 hours
        // depending on DST shifts.
        if (advance && i > 3) {
          d.setTime(d.getTime() + (value * advance * u.multiplier));
          return;
        } else if (advance) {
          if (name === 'week') {
            value *= 7;
            method = 'Date';
          }
          value = (value * advance) + callDateGet(d, method);
        }
        callDateSetWithWeek(d, method, value);
        if (checkMonth && monthHasShifted(d, value)) {
          // As we are setting the units in reverse order, there is a chance that
          // our date may accidentally traverse into a new month, such as setting
          // { month: 1, date 15 } on January 31st. Check for this here and reset
          // the date to the last day of the previous month if this has happened.
          callDateSet(d, 'Date', 0);
        }
      });

      // If a weekday is included in the params and no 'date' parameter is
      // overriding, set it here after all other units have been set. Note that
      // the date has to be perfectly set before disambiguation so that a proper
      // comparison can be made.
      if (!advance && !paramExists('day') && paramExists('weekday')) {
        setWeekday(d, getParam('weekday'), weekdayForward);
      }

      // If no action has been taken on the date
      // then it should be considered invalid.
      if (noop && !params.specificity) {
        invalidateDate(d);
        return d;
      }

      // If past or future is preferred, then the process of "disambiguation" will
      // ensure that an ambiguous time/date ("4pm", "thursday", "June", etc.) will
      // be in the past or future.
      if (canDisambiguate()) {
        iterateOverDateUnits(function(name, u) {
          var ambiguous = u.ambiguous || (name === 'week' && paramExists('weekday'));
          if (ambiguous && !uniqueParamExists(name, name === 'day')) {
            d[u.addMethod](prefer);
            return false;
          } else if (name === 'year' && hasAbbreviatedYear(params)) {
            updateDate(d, { years: 100 * prefer }, false, 1);
          }
        }, specificityIndex + 1);
      }
      return d;
    }

    function monthHasShifted(d, targetMonth) {
      if (targetMonth < 0) {
        targetMonth = targetMonth % 12 + 12;
      }
      return targetMonth % 12 !== callDateGet(d, 'Month');
    }

    // The ISO format allows times strung together without a demarcating ":", so make sure
    // that these markers are now optional.
    function prepareTime(format, loc, iso) {
      var timeSuffixMapping = {'h':0,'m':1,'s':2}, add;
      loc = loc || English;
      return format.replace(/{([a-z])}/g, function(full, token) {
        var separators = [],
            isHours = token === 'h',
            tokenIsRequired = isHours && !iso;
        if (token === 't') {
          return loc.get('ampm').join('|');
        } else {
          if (isHours) {
            separators.push(':');
          }
          if (add = loc.timeSuffixes[timeSuffixMapping[token]]) {
            separators.push(add + '\\s*');
          }
          return separators.length === 0 ? '' : '(?:' + separators.join('|') + ')' + (tokenIsRequired ? '' : '?');
        }
      });
    }

    // If the month is being set, then we don't want to accidentally
    // traverse into a new month just because the target month doesn't have enough
    // days. In other words, "5 months ago" from July 30th is still February, even
    // though there is no February 30th, so it will of necessity be February 28th
    // (or 29th in the case of a leap year).
    function checkMonthTraversal(date, targetMonth) {
      if (targetMonth < 0) {
        targetMonth = targetMonth % 12 + 12;
      }
      if (targetMonth % 12 !== callDateGet(date, 'Month')) {
        callDateSet(date, 'Date', 0);
      }
    }

    function createDateFromArgs(contextDate, args, prefer, forceUTC) {
      var f, localeCode;
      if (isNumber(args[1])) {
        // If the second argument is a number, then we have an
        // enumerated constructor type as in "new Date(2003, 2, 12);"
        f = collectDateArguments(args)[0];
      } else {
        f = args[0];
        localeCode = args[1];
      }
      return createDate(contextDate, f, localeCode, prefer, forceUTC);
    }

    function createDate(contextDate, f, localeCode, prefer, forceUTC) {
      return getExtendedDate(contextDate, f, localeCode, prefer, forceUTC).date;
    }

    function invalidateDate(d) {
      d.setTime(NaN);
    }

    function buildDateUnits() {
      DateUnitsReversed = DateUnits.concat().reverse();
      DateArgumentUnits = DateUnits.concat();
      DateArgumentUnits.splice(2,1);
    }


    /***
     * @method [units]Since([d], [locale] = currentLocale)
     * @returns Number
     * @short Returns the time since [d] in the appropriate unit.
     * @extra [d] will accept a date object, timestamp, or text format. If not specified, [d] is assumed to be now. [locale] can be passed to specify the locale that the date is in. %[unit]Ago% is provided as an alias to make this more readable when [d] is assumed to be the current date. For more see %date_format%.
     *
     * @set
     *   millisecondsSince
     *   secondsSince
     *   minutesSince
     *   hoursSince
     *   daysSince
     *   weeksSince
     *   monthsSince
     *   yearsSince
     *
     * @example
     *
     *   Date.create().millisecondsSince('1 hour ago') -> 3,600,000
     *   Date.create().daysSince('1 week ago')         -> 7
     *   Date.create().yearsSince('15 years ago')      -> 15
     *   Date.create('15 years ago').yearsAgo()        -> 15
     *
     ***
     * @method [units]Ago()
     * @returns Number
     * @short Returns the time ago in the appropriate unit.
     *
     * @set
     *   millisecondsAgo
     *   secondsAgo
     *   minutesAgo
     *   hoursAgo
     *   daysAgo
     *   weeksAgo
     *   monthsAgo
     *   yearsAgo
     *
     * @example
     *
     *   Date.create('last year').millisecondsAgo() -> 3,600,000
     *   Date.create('last year').daysAgo()         -> 7
     *   Date.create('last year').yearsAgo()        -> 15
     *
     ***
     * @method [units]Until([d], [locale] = currentLocale)
     * @returns Number
     * @short Returns the time until [d] in the appropriate unit.
     * @extra [d] will accept a date object, timestamp, or text format. If not specified, [d] is assumed to be now. [locale] can be passed to specify the locale that the date is in. %[unit]FromNow% is provided as an alias to make this more readable when [d] is assumed to be the current date. For more see %date_format%.
     *
     * @set
     *   millisecondsUntil
     *   secondsUntil
     *   minutesUntil
     *   hoursUntil
     *   daysUntil
     *   weeksUntil
     *   monthsUntil
     *   yearsUntil
     *
     * @example
     *
     *   Date.create().millisecondsUntil('1 hour from now') -> 3,600,000
     *   Date.create().daysUntil('1 week from now')         -> 7
     *   Date.create().yearsUntil('15 years from now')      -> 15
     *   Date.create('15 years from now').yearsFromNow()    -> 15
     *
     ***
     * @method [units]FromNow()
     * @returns Number
     * @short Returns the time from now in the appropriate unit.
     *
     * @set
     *   millisecondsFromNow
     *   secondsFromNow
     *   minutesFromNow
     *   hoursFromNow
     *   daysFromNow
     *   weeksFromNow
     *   monthsFromNow
     *   yearsFromNow
     *
     * @example
     *
     *   Date.create('next year').millisecondsFromNow() -> 3,600,000
     *   Date.create('next year').daysFromNow()         -> 7
     *   Date.create('next year').yearsFromNow()        -> 15
     *
     ***
     * @method add[Units](<num>, [reset] = false)
     * @returns Date
     * @short Adds <num> of the unit to the date. If [reset] is true, all lower units will be reset.
     * @extra Note that "months" is ambiguous as a unit of time. If the target date falls on a day that does not exist (ie. August 31 -> February 31), the date will be shifted to the last day of the month. Don't use %addMonths% if you need precision.
     *
     * @set
     *   addMilliseconds
     *   addSeconds
     *   addMinutes
     *   addHours
     *   addDays
     *   addWeeks
     *   addMonths
     *   addYears
     *
     * @example
     *
     *   Date.create().addMilliseconds(5) -> current time + 5 milliseconds
     *   Date.create().addDays(5)         -> current time + 5 days
     *   Date.create().addYears(5)        -> current time + 5 years
     *
     ***
     * @method isLast[Unit]()
     * @returns Boolean
     * @short Returns true if the date is last week/month/year.
     *
     * @set
     *   isLastWeek
     *   isLastMonth
     *   isLastYear
     *
     * @example
     *
     *   Date.create('yesterday').isLastWeek()  -> true or false?
     *   Date.create('yesterday').isLastMonth() -> probably not...
     *   Date.create('yesterday').isLastYear()  -> even less likely...
     *
     ***
     * @method isThis[Unit]()
     * @returns Boolean
     * @short Returns true if the date is this week/month/year.
     *
     * @set
     *   isThisWeek
     *   isThisMonth
     *   isThisYear
     *
     * @example
     *
     *   Date.create('tomorrow').isThisWeek()  -> true or false?
     *   Date.create('tomorrow').isThisMonth() -> probably...
     *   Date.create('tomorrow').isThisYear()  -> signs point to yes...
     *
     ***
     * @method isNext[Unit]()
     * @returns Boolean
     * @short Returns true if the date is next week/month/year.
     *
     * @set
     *   isNextWeek
     *   isNextMonth
     *   isNextYear
     *
     * @example
     *
     *   Date.create('tomorrow').isNextWeek()  -> true or false?
     *   Date.create('tomorrow').isNextMonth() -> probably not...
     *   Date.create('tomorrow').isNextYear()  -> even less likely...
     *
     ***
     * @method beginningOf[Unit]()
     * @returns Date
     * @short Sets the date to the beginning of the appropriate unit.
     *
     * @set
     *   beginningOfDay
     *   beginningOfWeek
     *   beginningOfMonth
     *   beginningOfYear
     *
     * @example
     *
     *   Date.create().beginningOfDay()   -> the beginning of today (resets the time)
     *   Date.create().beginningOfWeek()  -> the beginning of the week
     *   Date.create().beginningOfMonth() -> the beginning of the month
     *   Date.create().beginningOfYear()  -> the beginning of the year
     *
     ***
     * @method endOf[Unit]()
     * @returns Date
     * @short Sets the date to the end of the appropriate unit.
     *
     * @set
     *   endOfDay
     *   endOfWeek
     *   endOfMonth
     *   endOfYear
     *
     * @example
     *
     *   Date.create().endOfDay()   -> the end of today (sets the time to 23:59:59.999)
     *   Date.create().endOfWeek()  -> the end of the week
     *   Date.create().endOfMonth() -> the end of the month
     *   Date.create().endOfYear()  -> the end of the year
     *
     ***/

    function buildDateMethods() {
      extendSimilar(Date, DateUnits, function(methods, u, i) {
        var name = u.name, caps = simpleCapitalize(name), since, until;
        u.addMethod = 'add' + caps + 's';

        function add(num, reset) {
          var set = {};
          set[name] = num;
          return advanceDate(this, [set, reset]);
        }

        function timeDistanceNumeric(d1, d2) {
          var n = (d1.getTime() - d2.getTime()) / u.multiplier;
          return n < 0 ? ceil(n) : floor(n);
        }

        function addUnit(d, n, dsc) {
          var d2;
          add.call(d, n);
          // "dsc" = "date shift compensation"
          // This number should only be passed when traversing months to
          // compensate for date shifting. For example, calling "1 month ago"
          // on March 30th will result in February 28th, as there are not enough
          // days. This is not an issue when creating new dates, as "2 months ago"
          // gives an exact target to set, and the date shift is expected. However,
          // when counting months using unit traversal, the date needs to stay the
          // same if possible. To compensate for this, we need to try to reset the
          // date after every iteration, and use the result if possible.
          if (dsc && callDateGet(d, 'Date') !== dsc) {
            d2 = cloneDate(d);
            callDateSet(d2, 'Date', dsc);
            if (callDateGet(d2, 'Date') === dsc) {
              return d2;
            }
          }
          return d;
        }

        function timeDistanceTraversal(d1, d2) {
          var d, inc, n, dsc, count = 0;
          d = cloneDate(d1);
          inc = d1 < d2;
          n = inc ? 1 : -1
          dsc = name === 'month' && callDateGet(d, 'Date');
          d = addUnit(d, n, dsc);
          while (inc ? d <= d2 : d >= d2) {
            count += -n;
            d = addUnit(d, n, dsc);
          }
          return count;
        }

        function compareSince(fn, d, args) {
          return fn(d, createDateFromArgs(d, args, 0, false));
        }

        function compareUntil(fn, d, args) {
          return fn(createDateFromArgs(d, args, 0, false), d);
        }

        if (i < 3) {
          ['Last','This','Next'].forEach(function(shift) {
            methods['is' + shift + caps] = function() {
              return compareDate(this, shift + ' ' + name, 'en');
            };
          });
        }
        if (i < 4) {
          methods['beginningOf' + caps] = function() {
            return moveToBeginningOfUnit(this, name);
          };
          methods['endOf' + caps] = function() {
            return moveToEndOfUnit(this, name);
          };
          since = function() {
            // Optimized: no leaking arguments
            var args = [], $i; for($i = 0; $i < arguments.length; $i++) args.push(arguments[$i]);
            return compareSince(timeDistanceTraversal, this, args);
          };
          until = function() {
            // Optimized: no leaking arguments
            var args = [], $i; for($i = 0; $i < arguments.length; $i++) args.push(arguments[$i]);
            return compareUntil(timeDistanceTraversal, this, args);
          };
        } else {
          since = function() {
            // Optimized: no leaking arguments
            var args = [], $i; for($i = 0; $i < arguments.length; $i++) args.push(arguments[$i]);
            return compareSince(timeDistanceNumeric, this, args);
          };
          until = function() {
            // Optimized: no leaking arguments
            var args = [], $i; for($i = 0; $i < arguments.length; $i++) args.push(arguments[$i]);
            return compareUntil(timeDistanceNumeric, this, args);
          };
        }
        methods[name + 'sAgo']     = until;
        methods[name + 'sUntil']   = until;
        methods[name + 'sSince']   = since;
        methods[name + 'sFromNow'] = since;

        methods[u.addMethod] = add;
        buildNumberToDateAlias(u, u.multiplier);
      });
    }

    function buildCoreInputFormats() {
      English.addFormat('([+-])?(\\d{4,4})[-.\\/]?{fullMonth}[-.]?(\\d{1,2})?', true, ['yearSign','year','month','date'], false, true);
      English.addFormat('(\\d{1,2})[-.\\/]{fullMonth}(?:[-.\\/](\\d{2,4}))?', true, ['date','month','year'], true);
      English.addFormat('{fullMonth}[-.](\\d{4,4})', false, ['month','year']);
      English.addFormat('\\/Date\\((\\d+(?:[+-]\\d{4,4})?)\\)\\/', false, ['timestamp'])
      English.addFormat(prepareTime(RequiredTime, English), false, TimeFormat)

      // When a new locale is initialized it will have the CoreDateFormats initialized by default.
      // From there, adding new formats will push them in front of the previous ones, so the core
      // formats will be the last to be reached. However, the core formats themselves have English
      // months in them, which means that English needs to first be initialized and creates a race
      // condition. I'm getting around this here by adding these generalized formats in the order
      // specific -> general, which will mean they will be added to the English localization in
      // general -> specific order, then chopping them off the front and reversing to get the correct
      // order. Note that there are 7 formats as 2 have times which adds a front and a back format.
      CoreDateFormats = English.compiledFormats.slice(0,7).reverse();
      English.compiledFormats = English.compiledFormats.slice(7).concat(CoreDateFormats);
    }

    function buildFormatTokens() {

      createPaddedToken('f', function(d) {
        return callDateGet(d, 'Milliseconds');
      }, true);

      createPaddedToken('s', function(d) {
        return callDateGet(d, 'Seconds');
      });

      createPaddedToken('m', function(d) {
        return callDateGet(d, 'Minutes');
      });

      createPaddedToken('h', function(d) {
        return callDateGet(d, 'Hours') % 12 || 12;
      });

      createPaddedToken('H', function(d) {
        return callDateGet(d, 'Hours');
      });

      createPaddedToken('d', function(d) {
        return callDateGet(d, 'Date');
      });

      createPaddedToken('M', function(d) {
        return callDateGet(d, 'Month') + 1;
      });

      createMeridianTokens();
      createWeekdayTokens();
      createMonthTokens();

      // Aliases
      DateFormatTokens['ms']           = DateFormatTokens['f'];
      DateFormatTokens['milliseconds'] = DateFormatTokens['f'];
      DateFormatTokens['seconds']      = DateFormatTokens['s'];
      DateFormatTokens['minutes']      = DateFormatTokens['m'];
      DateFormatTokens['hours']        = DateFormatTokens['h'];
      DateFormatTokens['24hr']         = DateFormatTokens['H'];
      DateFormatTokens['12hr']         = DateFormatTokens['h'];
      DateFormatTokens['date']         = DateFormatTokens['d'];
      DateFormatTokens['day']          = DateFormatTokens['d'];
      DateFormatTokens['year']         = DateFormatTokens['yyyy'];

    }

    function buildFormatShortcuts() {
      extendSimilar(Date, 'short,long,full', function(methods, name) {
        methods[name] = function(localeCode) {
          return formatDate(this, name, false, localeCode);
        }
      });
    }

    function buildAsianDigits() {
      KanjiDigits.split('').forEach(function(digit, value) {
        var holder;
        if (value > 9) {
          value = pow(10, value - 9);
        }
        AsianDigitMap[digit] = value;
      });
      simpleMerge(AsianDigitMap, NumberNormalizeMap);
      // Kanji numerals may also be included in phrases which are text-based rather
      // than actual numbers such as Chinese weekdays (上周三), and "the day before
      // yesterday" (一昨日) in Japanese, so don't match these.
      AsianDigitReg = RegExp('([期週周])?([' + KanjiDigits + FullWidthDigits + ']+)(?!昨)', 'g');
    }

     /***
     * @method is[Day]()
     * @returns Boolean
     * @short Returns true if the date falls on that day.
     * @extra Also available: %isYesterday%, %isToday%, %isTomorrow%, %isWeekday%, and %isWeekend%.
     *
     * @set
     *   isToday
     *   isYesterday
     *   isTomorrow
     *   isWeekday
     *   isWeekend
     *   isSunday
     *   isMonday
     *   isTuesday
     *   isWednesday
     *   isThursday
     *   isFriday
     *   isSaturday
     *
     * @example
     *
     *   Date.create('tomorrow').isToday() -> false
     *   Date.create('thursday').isTomorrow() -> ?
     *   Date.create('yesterday').isWednesday() -> ?
     *   Date.create('today').isWeekend() -> ?
     *
     ***
     * @method isFuture()
     * @returns Boolean
     * @short Returns true if the date is in the future.
     * @example
     *
     *   Date.create('next week').isFuture() -> true
     *   Date.create('last week').isFuture() -> false
     *
     ***
     * @method isPast()
     * @returns Boolean
     * @short Returns true if the date is in the past.
     * @example
     *
     *   Date.create('last week').isPast() -> true
     *   Date.create('next week').isPast() -> false
     *
     ***/
    function buildRelativeAliases() {
      var special  = 'today,yesterday,tomorrow,weekday,weekend,future,past'.split(',');
      var weekdays = English.weekdays.slice(0,7);
      var months   = English.months.slice(0,12);
      extendSimilar(Date, special.concat(weekdays).concat(months), function(methods, name) {
        methods['is'+ simpleCapitalize(name)] = function(utc) {
          return fullCompareDate(this, name, 0, utc);
        };
      });
    }

    function buildUTCAliases() {
      extend(Date, {
        'utc': {
          'create': function() {
            // Optimized: no leaking arguments
            var args = [], $i; for($i = 0; $i < arguments.length; $i++) args.push(arguments[$i]);
            return createDateFromArgs(null, args, 0, true);
          },

          'past': function() {
            // Optimized: no leaking arguments
            var args = [], $i; for($i = 0; $i < arguments.length; $i++) args.push(arguments[$i]);
            return createDateFromArgs(null, args, -1, true);
          },

          'future': function() {
            // Optimized: no leaking arguments
            var args = [], $i; for($i = 0; $i < arguments.length; $i++) args.push(arguments[$i]);
            return createDateFromArgs(null, args, 1, true);
          }
        }
      }, false);
    }

    function setDateProperties() {
      extend(Date, {
        'RFC1123': '{Dow}, {dd} {Mon} {yyyy} {HH}:{mm}:{ss} {tz}',
        'RFC1036': '{Weekday}, {dd}-{Mon}-{yy} {HH}:{mm}:{ss} {tz}',
        'ISO8601_DATE': '{yyyy}-{MM}-{dd}',
        'ISO8601_DATETIME': '{yyyy}-{MM}-{dd}T{HH}:{mm}:{ss}.{fff}{isotz}'
      }, false);
    }


    extend(Date, {

       /***
       * @method Date.create(<d>, [locale] = currentLocale)
       * @returns Date
       * @short Alternate Date constructor which understands many different text formats, a timestamp, or another date.
       * @extra If no argument is given, date is assumed to be now. %Date.create% additionally can accept enumerated parameters as with the standard date constructor. [locale] can be passed to specify the locale that the date is in. When unspecified, the current locale (default is English) is assumed. UTC-based dates can be created through the %utc% object. For more see %date_format%.
       * @set
       *   Date.utc.create
       *
       * @example
       *
       *   Date.create('July')          -> July of this year
       *   Date.create('1776')          -> 1776
       *   Date.create('today')         -> today
       *   Date.create('wednesday')     -> This wednesday
       *   Date.create('next friday')   -> Next friday
       *   Date.create('July 4, 1776')  -> July 4, 1776
       *   Date.create(-446806800000)   -> November 5, 1955
       *   Date.create(1776, 6, 4)      -> July 4, 1776
       *   Date.create('1776年07月04日', 'ja') -> July 4, 1776
       *   Date.utc.create('July 4, 1776', 'en')  -> July 4, 1776
       *
       ***/
      'create': function() {
        // Optimized: no leaking arguments
        var args = [], $i; for($i = 0; $i < arguments.length; $i++) args.push(arguments[$i]);
        return createDateFromArgs(null, args);
      },

       /***
       * @method Date.past(<d>, [locale] = currentLocale)
       * @returns Date
       * @short Alternate form of %Date.create% with any ambiguity assumed to be the past.
       * @extra For example %"Sunday"% can be either "the Sunday coming up" or "the Sunday last" depending on context. Note that dates explicitly in the future ("next Sunday") will remain in the future. This method simply provides a hint when ambiguity exists. UTC-based dates can be created through the %utc% object. For more, see %date_format%.
       * @set
       *   Date.utc.past
       *
       * @example
       *
       *   Date.past('July')          -> July of this year or last depending on the current month
       *   Date.past('Wednesday')     -> This wednesday or last depending on the current weekday
       *
       ***/
      'past': function() {
        // Optimized: no leaking arguments
        var args = [], $i; for($i = 0; $i < arguments.length; $i++) args.push(arguments[$i]);
        return createDateFromArgs(null, args, -1);
      },

       /***
       * @method Date.future(<d>, [locale] = currentLocale)
       * @returns Date
       * @short Alternate form of %Date.create% with any ambiguity assumed to be the future.
       * @extra For example %"Sunday"% can be either "the Sunday coming up" or "the Sunday last" depending on context. Note that dates explicitly in the past ("last Sunday") will remain in the past. This method simply provides a hint when ambiguity exists. UTC-based dates can be created through the %utc% object. For more, see %date_format%.
       * @set
       *   Date.utc.future
       *
       * @example
       *
       *   Date.future('July')          -> July of this year or next depending on the current month
       *   Date.future('Wednesday')     -> This wednesday or next depending on the current weekday
       *
       ***/
      'future': function() {
        // Optimized: no leaking arguments
        var args = [], $i; for($i = 0; $i < arguments.length; $i++) args.push(arguments[$i]);
        return createDateFromArgs(null, args, 1);
      },

       /***
       * @method Date.addLocale(<code>, <set>)
       * @returns Locale
       * @short Adds a locale <set> to the locales understood by Sugar.
       * @extra For more see %date_format%.
       *
       ***/
      'addLocale': function(localeCode, set) {
        return setLocalization(localeCode, set);
      },

       /***
       * @method Date.setLocale(<code>)
       * @returns Locale
       * @short Sets the current locale to be used with dates.
       * @extra Sugar has support for 13 locales that are available through the "Date Locales" package. In addition you can define a new locale with %Date.addLocale%. For more see %date_format%.
       *
       ***/
      'setLocale': function(localeCode, set) {
        var loc = getLocalization(localeCode, false);
        CurrentLocalization = loc;
        // The code is allowed to be more specific than the codes which are required:
        // i.e. zh-CN or en-US. Currently this only affects US date variants such as 8/10/2000.
        if (localeCode && localeCode !== loc.code) {
          loc.code = localeCode;
        }
        return loc;
      },

       /***
       * @method Date.getLocale([code] = current)
       * @returns Locale
       * @short Gets the locale for the given code, or the current locale.
       * @extra The resulting locale object can be manipulated to provide more control over date localizations. For more about locales, see %date_format%.
       *
       ***/
      'getLocale': function(localeCode) {
        return !localeCode ? CurrentLocalization : getLocalization(localeCode, false);
      },

       /**
       * @method Date.addFormat(<format>, <match>, [code] = null)
       * @returns Nothing
       * @short Manually adds a new date input format.
       * @extra This method allows fine grained control for alternate formats. <format> is a string that can have regex tokens inside. <match> is an array of the tokens that each regex capturing group will map to, for example %year%, %date%, etc. For more, see %date_format%.
       *
       **/
      'addFormat': function(format, match, localeCode) {
        addDateInputFormat(getLocalization(localeCode), format, match);
      }

    }, false);

    extend(Date, {

       /***
       * @method get(<d>, [locale] = currentLocale)
       * @returns Date
       * @short Gets a new date using the current one as a starting point.
       * @extra For most purposes, this method is identical to %Date.create%, except that if a relative format such as "next week" is passed, it will be relative to the instance rather than the current time.
       *
       * @example
       *
       *   new Date(2010, 0).get('next week') -> 1 week after 2010-01-01
       *   new Date(2004, 4).get('2 years before') -> 2 years before May, 2004
       *
       ***/
      'get': function(s) {
        // Optimized: no leaking arguments
        var args = [], $i; for($i = 0; $i < arguments.length; $i++) args.push(arguments[$i]);
        return createDateFromArgs(this, args);
      },

       /***
       * @method set(<set>, [reset] = false)
       * @returns Date
       * @short Sets the date object.
       * @extra This method can accept multiple formats including a single number as a timestamp, an object, or enumerated parameters (as with the Date constructor). If [reset] is %true%, any units more specific than those passed will be reset.
       *
       * @example
       *
       *   new Date().set({ year: 2011, month: 11, day: 31 }) -> December 31, 2011
       *   new Date().set(2011, 11, 31)                       -> December 31, 2011
       *   new Date().set(86400000)                           -> 1 day after Jan 1, 1970
       *   new Date().set({ year: 2004, month: 6 }, true)     -> June 1, 2004, 00:00:00.000
       *
       ***/
      'set': function() {
        // Optimized: no leaking arguments
        var args = [], $i; for($i = 0; $i < arguments.length; $i++) args.push(arguments[$i]);
        return setDate(this, args);
      },

       /***
       * @method setWeekday()
       * @returns Nothing
       * @short Sets the weekday of the date.
       * @extra In order to maintain a parallel with %getWeekday% (which itself is an alias for Javascript native %getDay%), Sunday is considered day %0%. This contrasts with ISO-8601 standard (used in %getISOWeek% and %setISOWeek%) which places Sunday at the end of the week (day 7). This effectively means that passing %0% to this method while in the middle of a week will rewind the date, where passing %7% will advance it.
       *
       * @example
       *
       *   d = new Date(); d.setWeekday(1); d; -> Monday of this week
       *   d = new Date(); d.setWeekday(6); d; -> Saturday of this week
       *
       ***/
      'setWeekday': function(dow) {
        return setWeekday(this, dow);
      },

       /***
       * @method setISOWeek(<num>)
       * @returns Nothing
       * @short Sets the week (of the year) as defined by the ISO-8601 standard.
       * @extra Note that this standard places Sunday at the end of the week (day 7).
       *
       * @example
       *
       *   d = new Date(); d.setISOWeek(15); d; -> 15th week of the year
       *
       ***/
      'setISOWeek': function(num) {
        return setWeekNumber(this, num);
      },

       /***
       * @method getISOWeek()
       * @returns Number
       * @short Gets the date's week (of the year) as defined by the ISO-8601 standard.
       * @extra Note that this standard places Sunday at the end of the week (day 7). If %utc% is set on the date, the week will be according to UTC time.
       *
       * @example
       *
       *   new Date().getISOWeek()    -> today's week of the year
       *
       ***/
      'getISOWeek': function() {
        return getWeekNumber(this);
      },

       /***
       * @method beginningOfISOWeek()
       * @returns Date
       * @short Set the date to the beginning of week as defined by this ISO-8601 standard.
       * @extra Note that this standard places Monday at the start of the week.
       * @example
       *
       *   Date.create().beginningOfISOWeek() -> Monday
       *
       ***/
      'beginningOfISOWeek': function() {
        var day = this.getDay();
        if (day === 0) {
          day = -6;
        } else if (day !== 1) {
          day = 1;
        }
        setWeekday(this, day);
        return resetDate(this);
      },

       /***
       * @method endOfISOWeek()
       * @returns Date
       * @short Set the date to the end of week as defined by this ISO-8601 standard.
       * @extra Note that this standard places Sunday at the end of the week.
       * @example
       *
       *   Date.create().endOfISOWeek() -> Sunday
       *
       ***/
      'endOfISOWeek': function() {
        if (this.getDay() !== 0) {
          setWeekday(this, 7);
        }
        return moveToEndOfUnit(this, 'day');
      },

       /***
       * @method getUTCOffset([iso])
       * @returns String
       * @short Returns a string representation of the offset from UTC time. If [iso] is true the offset will be in ISO8601 format.
       * @example
       *
       *   new Date().getUTCOffset()     -> "+0900"
       *   new Date().getUTCOffset(true) -> "+09:00"
       *
       ***/
      'getUTCOffset': function(iso) {
        return getUTCOffset(this, iso);
      },

       /***
       * @method utc([on] = true)
       * @returns Date
       * @short Sets the internal utc flag for the date. When on, UTC-based methods will be called internally.
       * @extra For more see %date_format%.
       * @example
       *
       *   new Date().utc(true)
       *   new Date().utc(false)
       *
       ***/
      'utc': function(set) {
        return setUTC(this, set !== false);
      },

       /***
       * @method isUTC()
       * @returns Boolean
       * @short Returns true if the date has no timezone offset.
       * @extra This will also return true for utc-based dates (dates that have the %utc% method set true). Note that even if the utc flag is set, %getTimezoneOffset% will always report the same thing as Javascript always reports that based on the environment's locale.
       * @example
       *
       *   new Date().isUTC()           -> true or false?
       *   new Date().utc(true).isUTC() -> true
       *
       ***/
      'isUTC': function() {
        return isUTC(this);
      },

       /***
       * @method advance(<set>, [reset] = false)
       * @returns Date
       * @short Sets the date forward.
       * @extra This method can accept multiple formats including an object, a string in the format %3 days%, a single number as milliseconds, or enumerated parameters (as with the Date constructor). If [reset] is %true%, any units more specific than those passed will be reset. For more see %date_format%.
       * @example
       *
       *   new Date().advance({ year: 2 }) -> 2 years in the future
       *   new Date().advance('2 days')    -> 2 days in the future
       *   new Date().advance(0, 2, 3)     -> 2 months 3 days in the future
       *   new Date().advance(86400000)    -> 1 day in the future
       *
       ***/
      'advance': function() {
        // Optimized: no leaking arguments
        var args = [], $i; for($i = 0; $i < arguments.length; $i++) args.push(arguments[$i]);
        return advanceDate(this, args);
      },

       /***
       * @method rewind(<set>, [reset] = false)
       * @returns Date
       * @short Sets the date back.
       * @extra This method can accept multiple formats including a single number as a timestamp, an object, or enumerated parameters (as with the Date constructor). If [reset] is %true%, any units more specific than those passed will be reset. For more see %date_format%.
       * @example
       *
       *   new Date().rewind({ year: 2 }) -> 2 years in the past
       *   new Date().rewind(0, 2, 3)     -> 2 months 3 days in the past
       *   new Date().rewind(86400000)    -> 1 day in the past
       *
       ***/
      'rewind': function() {
        // Optimized: no leaking arguments
        var args = [], $i; for($i = 0; $i < arguments.length; $i++) args.push(arguments[$i]);
        var a = collectDateArguments(args, true);
        return updateDate(this, a[0], a[1], -1);
      },

       /***
       * @method isValid()
       * @returns Boolean
       * @short Returns true if the date is valid.
       * @example
       *
       *   new Date().isValid()         -> true
       *   new Date('flexor').isValid() -> false
       *
       ***/
      'isValid': function() {
        return isValid(this);
      },

       /***
       * @method isAfter(<d>, [margin] = 0)
       * @returns Boolean
       * @short Returns true if the date is after the <d>.
       * @extra [margin] is to allow extra margin of error (in ms). <d> will accept a date object, timestamp, or text format. If not specified, <d> is assumed to be now. See %date_format% for more.
       * @example
       *
       *   new Date().isAfter('tomorrow')  -> false
       *   new Date().isAfter('yesterday') -> true
       *
       ***/
      'isAfter': function(d, margin, utc) {
        return this.getTime() > createDate(null, d).getTime() - (margin || 0);
      },

       /***
       * @method isBefore(<d>, [margin] = 0)
       * @returns Boolean
       * @short Returns true if the date is before <d>.
       * @extra [margin] is to allow extra margin of error (in ms). <d> will accept a date object, timestamp, or text format. If not specified, <d> is assumed to be now. See %date_format% for more.
       * @example
       *
       *   new Date().isBefore('tomorrow')  -> true
       *   new Date().isBefore('yesterday') -> false
       *
       ***/
      'isBefore': function(d, margin) {
        return this.getTime() < createDate(null, d).getTime() + (margin || 0);
      },

       /***
       * @method isBetween(<d1>, <d2>, [margin] = 0)
       * @returns Boolean
       * @short Returns true if the date is later or equal to <d1> and before or equal to <d2>.
       * @extra [margin] is to allow extra margin of error (in ms). <d1> and <d2> will accept a date object, timestamp, or text format. If not specified, they are assumed to be now. See %date_format% for more.
       * @example
       *
       *   new Date().isBetween('yesterday', 'tomorrow')    -> true
       *   new Date().isBetween('last year', '2 years ago') -> false
       *
       ***/
      'isBetween': function(d1, d2, margin) {
        var t  = this.getTime();
        var t1 = createDate(null, d1).getTime();
        var t2 = createDate(null, d2).getTime();
        var lo = min(t1, t2);
        var hi = max(t1, t2);
        margin = margin || 0;
        return (lo - margin <= t) && (hi + margin >= t);
      },

       /***
       * @method isLeapYear()
       * @returns Boolean
       * @short Returns true if the date is a leap year.
       * @example
       *
       *   Date.create('2000').isLeapYear() -> true
       *
       ***/
      'isLeapYear': function() {
        return isLeapYear(this);
      },

       /***
       * @method daysInMonth()
       * @returns Number
       * @short Returns the number of days in the date's month.
       * @example
       *
       *   Date.create('May').daysInMonth()            -> 31
       *   Date.create('February, 2000').daysInMonth() -> 29
       *
       ***/
      'daysInMonth': function() {
        return getDaysInMonth(this);
      },

       /***
       * @method format(<format>, [locale] = currentLocale)
       * @returns String
       * @short Formats and outputs the date.
       * @extra <format> can be a number of pre-determined formats or a string of tokens. Locale-specific formats are %short%, %long%, and %full% which have their own aliases and can be called with %date.short()%, etc. If <format> is not specified the %long% format is assumed. [locale] specifies a locale code to use (if not specified the current locale is used). See %date_format% for more details.
       *
       * @set
       *   short
       *   long
       *   full
       *
       * @example
       *
       *   Date.create().format()                                   -> ex. July 4, 2003
       *   Date.create().format('{Weekday} {d} {Month}, {yyyy}')    -> ex. Monday July 4, 2003
       *   Date.create().format('{hh}:{mm}')                        -> ex. 15:57
       *   Date.create().format('{12hr}:{mm}{tt}')                  -> ex. 3:57pm
       *   Date.create().format(Date.ISO8601_DATETIME)              -> ex. 2011-07-05 12:24:55.528Z
       *   Date.create('last week').format('short', 'ja')                -> ex. 先週
       *   Date.create('yesterday').format(function(value,unit,ms,loc) {
       *     // value = 1, unit = 3, ms = -86400000, loc = [current locale object]
       *   });                                                      -> ex. 1 day ago
       *
       ***/
      'format': function(f, localeCode) {
        return formatDate(this, f, false, localeCode);
      },

       /***
       * @method relative([fn], [locale] = currentLocale)
       * @returns String
       * @short Returns a relative date string offset to the current time.
       * @extra [fn] can be passed to provide for more granular control over the resulting string. [fn] is passed 4 arguments: the adjusted value, unit, offset in milliseconds, and a localization object. As an alternate syntax, [locale] can also be passed as the first (and only) parameter. For more, see %date_format%.
       * @example
       *
       *   Date.create('90 seconds ago').relative() -> 1 minute ago
       *   Date.create('January').relative()        -> ex. 5 months ago
       *   Date.create('January').relative('ja')    -> 3ヶ月前
       *   Date.create('120 minutes ago').relative(function(val,unit,ms,loc) {
       *     // value = 2, unit = 3, ms = -7200, loc = [current locale object]
       *   });                                      -> ex. 5 months ago
       *
       ***/
      'relative': function(fn, localeCode) {
        if (isString(fn)) {
          localeCode = fn;
          fn = null;
        }
        return formatDate(this, fn, true, localeCode);
      },

       /***
       * @method is(<f>, [margin] = 0, [utc] = false)
       * @returns Boolean
       * @short Returns true if the date is <f>.
       * @extra <f> will accept a date object, timestamp, or text format. %is% additionally understands more generalized expressions like month/weekday names, 'today', etc, and compares to the precision implied in <f>. [margin] allows an extra margin of error in milliseconds. [utc] will treat the compared date as UTC. For more, see %date_format%.
       * @example
       *
       *   Date.create().is('July')               -> true or false?
       *   Date.create().is('1776')               -> false
       *   Date.create().is('today')              -> true
       *   Date.create().is('weekday')            -> true or false?
       *   Date.create().is('July 4, 1776')       -> false
       *   Date.create().is(-6106093200000)       -> false
       *   Date.create().is(new Date(1776, 6, 4)) -> false
       *
       ***/
      'is': function(f, margin, utc) {
        return fullCompareDate(this, f, margin, utc);
      },

       /***
       * @method reset([unit] = 'hours')
       * @returns Date
       * @short Resets the unit passed and all smaller units. Default is "hours", effectively resetting the time.
       * @example
       *
       *   Date.create().reset('day')   -> Beginning of today
       *   Date.create().reset('month') -> 1st of the month
       *
       ***/
      'reset': function(unit) {
        return resetDate(this, unit);
      },

       /***
       * @method clone()
       * @returns Date
       * @short Clones the date.
       * @example
       *
       *   Date.create().clone() -> Copy of now
       *
       ***/
      'clone': function() {
        return cloneDate(this);
      },

       /***
       * @method iso()
       * @alias toISOString
       *
       ***/
      'iso': function() {
        return this.toISOString();
      },

       /***
       * @method getWeekday()
       * @returns Number
       * @short Alias for %getDay%.
       * @set
       *   getUTCWeekday
       *
       * @example
       *
       +   Date.create().getWeekday();    -> (ex.) 3
       +   Date.create().getUTCWeekday();    -> (ex.) 3
       *
       ***/
      'getWeekday': function() {
        return this.getDay();
      },

      'getUTCWeekday': function() {
        return this.getUTCDay();
      }

    });


    /***
     * @namespace Number
     *
     ***/

    /***
     * @method [unit]()
     * @returns Number
     * @short Takes the number as a corresponding unit of time and converts to milliseconds.
     * @extra Method names can be singular or plural.  Note that as "a month" is ambiguous as a unit of time, %months% will be equivalent to 30.4375 days, the average number in a month. Be careful using %months% if you need exact precision.
     *
     * @set
     *   millisecond
     *   milliseconds
     *   second
     *   seconds
     *   minute
     *   minutes
     *   hour
     *   hours
     *   day
     *   days
     *   week
     *   weeks
     *   month
     *   months
     *   year
     *   years
     *
     * @example
     *
     *   (5).milliseconds() -> 5
     *   (10).hours()       -> 36000000
     *   (1).day()          -> 86400000
     *
     ***
     * @method [unit]Before([d], [locale] = currentLocale)
     * @returns Date
     * @short Returns a date that is <n> units before [d], where <n> is the number.
     * @extra [d] will accept a date object, timestamp, or text format. Note that "months" is ambiguous as a unit of time. If the target date falls on a day that does not exist (ie. August 31 -> February 31), the date will be shifted to the last day of the month. Be careful using %monthsBefore% if you need exact precision. See %date_format% for more.
     *
     * @set
     *   millisecondBefore
     *   millisecondsBefore
     *   secondBefore
     *   secondsBefore
     *   minuteBefore
     *   minutesBefore
     *   hourBefore
     *   hoursBefore
     *   dayBefore
     *   daysBefore
     *   weekBefore
     *   weeksBefore
     *   monthBefore
     *   monthsBefore
     *   yearBefore
     *   yearsBefore
     *
     * @example
     *
     *   (5).daysBefore('tuesday')          -> 5 days before tuesday of this week
     *   (1).yearBefore('January 23, 1997') -> January 23, 1996
     *
     ***
     * @method [unit]Ago()
     * @returns Date
     * @short Returns a date that is <n> units ago.
     * @extra Note that "months" is ambiguous as a unit of time. If the target date falls on a day that does not exist (ie. August 31 -> February 31), the date will be shifted to the last day of the month. Be careful using %monthsAgo% if you need exact precision.
     *
     * @set
     *   millisecondAgo
     *   millisecondsAgo
     *   secondAgo
     *   secondsAgo
     *   minuteAgo
     *   minutesAgo
     *   hourAgo
     *   hoursAgo
     *   dayAgo
     *   daysAgo
     *   weekAgo
     *   weeksAgo
     *   monthAgo
     *   monthsAgo
     *   yearAgo
     *   yearsAgo
     *
     * @example
     *
     *   (5).weeksAgo() -> 5 weeks ago
     *   (1).yearAgo()  -> January 23, 1996
     *
     ***
     * @method [unit]After([d], [locale] = currentLocale)
     * @returns Date
     * @short Returns a date <n> units after [d], where <n> is the number.
     * @extra [d] will accept a date object, timestamp, or text format. Note that "months" is ambiguous as a unit of time. If the target date falls on a day that does not exist (ie. August 31 -> February 31), the date will be shifted to the last day of the month. Be careful using %monthsAfter% if you need exact precision. See %date_format% for more.
     *
     * @set
     *   millisecondAfter
     *   millisecondsAfter
     *   secondAfter
     *   secondsAfter
     *   minuteAfter
     *   minutesAfter
     *   hourAfter
     *   hoursAfter
     *   dayAfter
     *   daysAfter
     *   weekAfter
     *   weeksAfter
     *   monthAfter
     *   monthsAfter
     *   yearAfter
     *   yearsAfter
     *
     * @example
     *
     *   (5).daysAfter('tuesday')          -> 5 days after tuesday of this week
     *   (1).yearAfter('January 23, 1997') -> January 23, 1998
     *
     ***
     * @method [unit]FromNow()
     * @returns Date
     * @short Returns a date <n> units from now.
     * @extra Note that "months" is ambiguous as a unit of time. If the target date falls on a day that does not exist (ie. August 31 -> February 31), the date will be shifted to the last day of the month. Be careful using %monthsFromNow% if you need exact precision.
     *
     * @set
     *   millisecondFromNow
     *   millisecondsFromNow
     *   secondFromNow
     *   secondsFromNow
     *   minuteFromNow
     *   minutesFromNow
     *   hourFromNow
     *   hoursFromNow
     *   dayFromNow
     *   daysFromNow
     *   weekFromNow
     *   weeksFromNow
     *   monthFromNow
     *   monthsFromNow
     *   yearFromNow
     *   yearsFromNow
     *
     * @example
     *
     *   (5).weeksFromNow() -> 5 weeks ago
     *   (1).yearFromNow()  -> January 23, 1998
     *
     ***/
    function buildNumberToDateAlias(u, multiplier) {
      var name = u.name, methods = {};
      function base() {
        return round(this * multiplier);
      }
      function after() {
        // Optimized: no leaking arguments
        var args = [], $i; for($i = 0; $i < arguments.length; $i++) args.push(arguments[$i]);
        return createDateFromArgs(null, args)[u.addMethod](this);
      }
      function before() {
        // Optimized: no leaking arguments
        var args = [], $i; for($i = 0; $i < arguments.length; $i++) args.push(arguments[$i]);
        return createDateFromArgs(null, args)[u.addMethod](-this);
      }
      methods[name] = base;
      methods[name + 's'] = base;
      methods[name + 'Before'] = before;
      methods[name + 'sBefore'] = before;
      methods[name + 'Ago'] = before;
      methods[name + 'sAgo'] = before;
      methods[name + 'After'] = after;
      methods[name + 'sAfter'] = after;
      methods[name + 'FromNow'] = after;
      methods[name + 'sFromNow'] = after;
      extend(Number, methods);
    }

    extend(Number, {

       /***
       * @method duration([locale] = currentLocale)
       * @returns String
       * @short Takes the number as milliseconds and returns a unit-adjusted localized string.
       * @extra This method is the same as %Date#relative% without the localized equivalent of "from now" or "ago". [locale] can be passed as the first (and only) parameter. Note that this method is only available when the dates package is included.
       * @example
       *
       *   (500).duration() -> '500 milliseconds'
       *   (1200).duration() -> '1 second'
       *   (75).minutes().duration() -> '1 hour'
       *   (75).minutes().duration('es') -> '1 hora'
       *
       ***/
      'duration': function(localeCode) {
        return getLocalization(localeCode).getDuration(this);
      }

    });

    English = CurrentLocalization = Date.addLocale('en', {
      'plural':     true,
      'timeMarker': 'at',
      'ampm':       'am,pm',
      'months':     'January,February,March,April,May,June,July,August,September,October,November,December',
      'weekdays':   'Sunday,Monday,Tuesday,Wednesday,Thursday,Friday,Saturday',
      'units':      'millisecond:|s,second:|s,minute:|s,hour:|s,day:|s,week:|s,month:|s,year:|s',
      'numbers':    'one,two,three,four,five,six,seven,eight,nine,ten',
      'articles':   'a,an,the',
      'tokens':     'the,st|nd|rd|th,of',
      'short':      '{Month} {d}, {yyyy}',
      'long':       '{Month} {d}, {yyyy} {h}:{mm}{tt}',
      'full':       '{Weekday} {Month} {d}, {yyyy} {h}:{mm}:{ss}{tt}',
      'past':       '{num} {unit} {sign}',
      'future':     '{num} {unit} {sign}',
      'duration':   '{num} {unit}',
      'modifiers': [
        { 'name': 'sign',  'src': 'ago|before', 'value': -1 },
        { 'name': 'sign',  'src': 'from now|after|from|in|later', 'value': 1 },
        { 'name': 'edge',  'src': 'last day', 'value': -2 },
        { 'name': 'edge',  'src': 'end', 'value': -1 },
        { 'name': 'edge',  'src': 'first day|beginning', 'value': 1 },
        { 'name': 'shift', 'src': 'last', 'value': -1 },
        { 'name': 'shift', 'src': 'the|this', 'value': 0 },
        { 'name': 'shift', 'src': 'next', 'value': 1 }
      ],
      'dateParse': [
        '{month} {year}',
        '{shift} {unit=5-7}',
        '{0?} {date}{1}',
        '{0?} {edge} of {shift?} {unit=4-7?} {month?} {year?}'
      ],
      'timeParse': [
        '{num} {unit} {sign}',
        '{sign} {num} {unit}',
        '{0} {num}{1} {day} of {month} {year?}',
        '{weekday?} {month} {date}{1?} {year?}',
        '{date} {month} {year}',
        '{date} {month}',
        '{shift} {weekday}',
        '{shift} week {weekday}',
        '{weekday} {2?} {shift} week',
        '{num} {unit=4-5} {sign} {day}',
        '{0?} {date}{1} of {month}',
        '{0?}{month?} {date?}{1?} of {shift} {unit=6-7}',
        '{edge} of {day}'
      ]
    });

    buildDateUnits();
    buildDateMethods();
    buildCoreInputFormats();
    buildFormatTokens();
    buildFormatShortcuts();
    buildAsianDigits();
    buildRelativeAliases();
    buildUTCAliases();
    setDateProperties();

    /***
     * @module Function
     * @dependency core
     * @description Lazy, throttled, and memoized functions, delayed functions and handling of timers, argument currying.
     *
     ***/

    function setDelay(fn, ms, after, scope, args) {
      // Delay of infinity is never called of course...
      ms = coercePositiveInteger(ms || 0);
      if (!fn.timers) fn.timers = [];
      // This is a workaround for <= IE8, which apparently has the
      // ability to call timeouts in the queue on the same tick (ms?)
      // even if functionally they have already been cleared.
      fn._canceled = false;
      fn.timers.push(setTimeout(function() {
        if (!fn._canceled) {
          after.apply(scope, args || []);
        }
      }, ms));
    }

    function cancelFunction(fn) {
      var timers = fn.timers, timer;
      if (isArray(timers)) {
        while(timer = timers.shift()) {
          clearTimeout(timer);
        }
      }
      fn._canceled = true;
      return fn;
    }

    function createLazyFunction(fn, ms, immediate, limit) {
      var queue = [], locked = false, execute, rounded, perExecution, result;
      ms = ms || 1;
      limit = limit || Infinity;
      rounded = ceil(ms);
      perExecution = round(rounded / ms) || 1;
      execute = function() {
        var queueLength = queue.length, maxPerRound;
        if (queueLength == 0) return;
        // Allow fractions of a millisecond by calling
        // multiple times per actual timeout execution
        maxPerRound = max(queueLength - perExecution, 0);
        while(queueLength > maxPerRound) {
          // Getting uber-meta here...
          result = Function.prototype.apply.apply(fn, queue.shift());
          queueLength--;
        }
        setDelay(lazy, rounded, function() {
          locked = false;
          execute();
        });
      }
      function lazy() {
        // If the execution has locked and it's immediate, then
        // allow 1 less in the queue as 1 call has already taken place.
        if (queue.length < limit - (locked && immediate ? 1 : 0)) {
          // Optimized: no leaking arguments
          var args = [], $i; for($i = 0; $i < arguments.length; $i++) args.push(arguments[$i]);
          queue.push([this, args]);
        }
        if (!locked) {
          locked = true;
          if (immediate) {
            execute();
          } else {
            setDelay(lazy, rounded, execute);
          }
        }
        // Return the memoized result
        return result;
      }
      return lazy;
    }

    function stringifyArguments() {
      var str = '';
      for (var i = 0; i < arguments.length; i++) {
        str += stringify(arguments[i]);
      }
      return str;
    }

    function createMemoizedFunction(fn, hashFn) {
      var cache = {};
      if (!hashFn) {
        hashFn = stringifyArguments;
      }
      return function memoized() {
        var key = hashFn.apply(this, arguments);
        if (hasOwnProperty(cache, key)) {
          return cache[key];
        }
        return cache[key] = fn.apply(this, arguments);
      }
    }

    extend(Function, {

       /***
       * @method lazy([ms] = 1, [immediate] = false, [limit] = Infinity)
       * @returns Function
       * @short Creates a lazy function that, when called repeatedly, will queue execution and wait [ms] milliseconds to execute.
       * @extra If [immediate] is %true%, first execution will happen immediately, then lock. If [limit] is a fininte number, calls past [limit] will be ignored while execution is locked. Compare this to %throttle%, which will execute only once per [ms] milliseconds. Note that [ms] can also be a fraction. Calling %cancel% on a lazy function will clear the entire queue. For more see %functions%.
       * @example
       *
       *   (function() {
       *     // Executes immediately.
       *   }).lazy()();
       *   (3).times(function() {
       *     // Executes 3 times, with each execution 20ms later than the last.
       *   }.lazy(20));
       *   (100).times(function() {
       *     // Executes 50 times, with each execution 20ms later than the last.
       *   }.lazy(20, false, 50));
       *
       ***/
      'lazy': function(ms, immediate, limit) {
        return createLazyFunction(this, ms, immediate, limit);
      },

       /***
       * @method throttle([ms] = 1)
       * @returns Function
       * @short Creates a "throttled" version of the function that will only be executed once per <ms> milliseconds.
       * @extra This is functionally equivalent to calling %lazy% with a [limit] of %1% and [immediate] as %true%. %throttle% is appropriate when you want to make sure a function is only executed at most once for a given duration. For more see %functions%.
       * @example
       *
       *   (3).times(function() {
       *     // called only once. will wait 50ms until it responds again
       *   }.throttle(50));
       *
       ***/
      'throttle': function(ms) {
        return createLazyFunction(this, ms, true, 1);
      },

       /***
       * @method debounce([ms] = 1)
       * @returns Function
       * @short Creates a "debounced" function that postpones its execution until after <ms> milliseconds have passed.
       * @extra This method is useful to execute a function after things have "settled down". A good example of this is when a user tabs quickly through form fields, execution of a heavy operation should happen after a few milliseconds when they have "settled" on a field. For more see %functions%.
       * @example
       *
       *   var fn = (function(arg1) {
       *     // called once 50ms later
       *   }).debounce(50); fn(); fn(); fn();
       *
       ***/
      'debounce': function(ms) {
        var fn = this;
        function debounced() {
          // Optimized: no leaking arguments
          var args = [], $i; for($i = 0; $i < arguments.length; $i++) args.push(arguments[$i]);
          cancelFunction(debounced);
          setDelay(debounced, ms, fn, this, args);
        };
        return debounced;
      },

       /***
       * @method delay([ms] = 1, [arg1], ...)
       * @returns Function
       * @short Executes the function after <ms> milliseconds.
       * @extra Returns a reference to itself. %delay% is also a way to execute non-blocking operations that will wait until the CPU is free. Delayed functions can be canceled using the %cancel% method. Can also curry arguments passed in after <ms>.
       * @example
       *
       *   (function(arg1) {
       *     // called 1s later
       *   }).delay(1000, 'arg1');
       *
       ***/
      'delay': function(ms) {
        var fn = this;
        // Optimized: no leaking arguments
        var args = [], $i; for($i = 1; $i < arguments.length; $i++) args.push(arguments[$i]);
        setDelay(fn, ms, fn, fn, args);
        return fn;
      },

       /***
       * @method every([ms] = 1, [arg1], ...)
       * @returns Function
       * @short Executes the function every <ms> milliseconds.
       * @extra Returns a reference to itself. %every% uses %setTimeout%, which means that you are guaranteed a period of idle time equal to [ms] after execution has finished. Compare this to %setInterval% which will try to run a function every [ms], even when execution itself takes up a portion of that time. In most cases avoiding %setInterval% is better as calls won't "back up" when the CPU is under strain, however this also means that calls are less likely to happen at exact intervals of [ms], so the use case here should be considered. Additionally, %every% can curry arguments passed in after [ms], and also be canceled with %cancel%.
       * @example
       *
       *   (function(arg1) {
       *     // called every 1s
       *   }).every(1000, 'arg1');
       *
       ***/
      'every': function(ms) {
        // Optimized: no leaking arguments
        var args = [], $i; for($i = 1; $i < arguments.length; $i++) args.push(arguments[$i]);
        var fn = this;
        function execute () {
          // Set the delay first here, so that cancel
          // can be called within the executing function.
          setDelay(fn, ms, execute);
          fn.apply(fn, args);
        }
        setDelay(fn, ms, execute);
        return fn;
      },

       /***
       * @method cancel()
       * @returns Function
       * @short Cancels a delayed function scheduled to be run.
       * @extra %delay%, %lazy%, %throttle%, and %debounce% can all set delays.
       * @example
       *
       *   (function() {
       *     alert('hay'); -> Never called
       *   }).delay(500).cancel();
       *
       ***/
      'cancel': function() {
        return cancelFunction(this);
      },

       /***
       * @method after(<num>, [mult] = true)
       * @returns Function
       * @short Creates a function that will execute after [num] calls.
       * @extra %after% is useful for running a final callback after a series of asynchronous operations, when the order in which the operations will complete is unknown. If [mult] is %true%, the function will continue to fire multiple times. The created function will be passed an array of the arguments that it has collected from each call so far.
       * @example
       *
       *   var fn = (function() {
       *     // Will be executed once only
       *   }).after(3); fn(); fn(); fn();
       *
       ***/
      'after': function(num) {
        var fn = this, count = 0, collectedArgs = [];
        num = coercePositiveInteger(num);
        return function() {
          // Optimized: no leaking arguments
          var args = []; for(var $i = 0, $len = arguments.length; $i < $len; $i++) args.push(arguments[$i]);
          collectedArgs.push(args);
          count++;
          if (count >= num) {
            return fn.call(this, collectedArgs);
          }
        }
      },

       /***
       * @method once()
       * @returns Function
       * @short Creates a function that will execute only once and store the result.
       * @extra %once% is useful for creating functions that will cache the result of an expensive operation and use it on subsequent calls. Also it can be useful for creating initialization functions that only need to be run once.
       * @example
       *
       *   var fn = (function() {
       *     // Will be executed once only
       *   }).once(); fn(); fn(); fn();
       *
       ***/
      'once': function() {
        // noop always returns "undefined" as the cache key.
        return createMemoizedFunction(this, function() {});
      },

       /***
       * @method memoize([fn])
       * @returns Function
       * @short Creates a function that will cache results for unique calls.
       * @extra %memoize% can be thought of as a more power %once%. Where %once% will only call a function once ever, memoized functions will be called once per unique call. A "unique call" is determined by the result of [fn], which is a hashing function. If empty, [fn] will stringify all arguments, such that any different argument signature will result in a unique call. This includes objects passed as arguments, which will be deep inspected to produce the cache key.
       * @example
       *
       *   var fn = (function() {
       *     // Will be executed twice, returning the memoized
       *     // result of the first call again on the last.
       *   }).memoize(); fn(1); fn(2); fn(1);
       *
       ***/
      'memoize': function(fn) {
        return createMemoizedFunction(this, fn);
      },

       /***
       * @method fill(<arg1>, <arg2>, ...)
       * @returns Function
       * @short Returns a new version of the function which when called will have some of its arguments pre-emptively filled in, also known as "currying".
       * @extra Arguments passed to a "filled" function are generally appended to the curried arguments. However, if %undefined% is passed as any of the arguments to %fill%, it will be replaced, when the "filled" function is executed. This allows currying of arguments even when they occur toward the end of an argument list (the example demonstrates this much more clearly).
       * @example
       *
       *   var delayOneSecond = setTimeout.fill(undefined, 1000);
       *   delayOneSecond(function() {
       *     // Will be executed 1s later
       *   });
       *
       ***/
      'fill': function() {
        // Optimized: no leaking arguments
        var curried = [], $i; for($i = 0; $i < arguments.length; $i++) curried.push(arguments[$i]);
        var fn = this;
        return function() {
          var argIndex = 0, result = [];
          for (var i = 0; i < curried.length; i++) {
            if (curried[i] != null) {
              result[i] = curried[i];
            } else {
              result[i] = arguments[i];
              argIndex++;
            }
          }
          for (var i = argIndex; i < arguments.length; i++) {
            result.push(arguments[i]);
          }
          return fn.apply(this, result);
        }
      }


    });

    /***
     * @module Number
     * @dependency core
     * @description Number formatting, rounding (with precision), and ranges. Aliases to Math methods.
     *
     ***/

    function getThousands() {
      var str = Number.thousands;
      return isString(str) ? str : ',';
    }

    function getDecimal() {
      var str = Number.decimal;
      return isString(str) ? str : '.';
    }

    function abbreviateNumber(num, roundTo, str, mid, limit, bytes) {
      var fixed        = num.toFixed(20),
          decimalPlace = fixed.search(/\./),
          numeralPlace = fixed.search(/[1-9]/),
          significant  = decimalPlace - numeralPlace,
          unit, i, divisor;
      if (significant > 0) {
        significant -= 1;
      }
      i = max(min(floor(significant / 3), limit === false ? str.length : limit), -mid);
      unit = str.charAt(i + mid - 1);
      if (significant < -9) {
        i = -3;
        roundTo = abs(significant) - 9;
        unit = str.slice(0,1);
      }
      divisor = bytes ? pow(2, 10 * i) : pow(10, i * 3);
      return formatNumber(withPrecision(num / divisor, roundTo || 0)) + unit.trim();
    }

    function formatNumber(num, place, thousands, decimal) {
      var i, str, split, integer, fraction, result = '';
      thousands = thousands || getThousands();
      decimal   = decimal || getDecimal();
      str      = (isNumber(place) ? withPrecision(num, place || 0).toFixed(max(place, 0)) : num.toString()).replace(/^-/, '');
      split    = str.split('.');
      integer  = split[0];
      fraction = split[1];
      for(i = integer.length; i > 0; i -= 3) {
        if (i < integer.length) {
          result = thousands + result;
        }
        result = integer.slice(max(0, i - 3), i) + result;
      }
      if (fraction) {
        result += decimal + repeatString('0', (place || 0) - fraction.length) + fraction;
      }
      return (num < 0 ? '-' : '') + result;
    }

    function isInteger(n) {
      return n % 1 === 0;
    }

    function isMultiple(n1, n2) {
      return n1 % n2 === 0;
    }


    extend(Number, {

      /***
       * @method Number.random([n1], [n2])
       * @returns Number
       * @short Returns a random integer between [n1] and [n2].
       * @extra If only 1 number is passed, the other will be 0. If none are passed, the number will be either 0 or 1.
       * @example
       *
       *   Number.random(50, 100) -> ex. 85
       *   Number.random(50)      -> ex. 27
       *   Number.random()        -> ex. 0
       *
       ***/
      'random': function(n1, n2) {
        var minNum, maxNum;
        if (arguments.length == 1) n2 = n1, n1 = 0;
        minNum = min(n1 || 0, isUndefined(n2) ? 1 : n2);
        maxNum = max(n1 || 0, isUndefined(n2) ? 1 : n2) + 1;
        return floor((Math.random() * (maxNum - minNum)) + minNum);
      }

    }, false);

    extend(Number, {

      /***
       * @method Number.isNaN(<value>)
       * @returns Boolean
       * @short Returns true only if the number is %NaN%.
       * @extra This is differs from the global %isNaN%, which returns true for anything that is not a number.
       * @example
       *
       *   Number.isNaN(NaN) -> true
       *   Number.isNaN('n') -> false
       *
       ***/
      'isNaN': function(value) {
        return value !== value;
      }

    }, false, true);

    extend(Number, {

      /***
       * @method log(<base> = Math.E)
       * @returns Number
       * @short Returns the logarithm of the number with base <base>, or natural logarithm of the number if <base> is undefined.
       * @example
       *
       *   (64).log(2) -> 6
       *   (9).log(3)  -> 2
       *   (5).log()   -> 1.6094379124341003
       *
       ***/

      'log': function(base) {
         return Math.log(this) / (base ? Math.log(base) : 1);
       },

      /***
       * @method abbr([precision] = 0)
       * @returns String
       * @short Returns an abbreviated form of the number.
       * @extra [precision] will round to the given precision. %Number.thousands% and %Number.decimal% allow custom markers to be used.
       * @example
       *
       *   (1000).abbr()    -> "1k"
       *   (1000000).abbr() -> "1m"
       *   (1280).abbr(1)   -> "1.3k"
       *
       ***/
      'abbr': function(precision) {
        return abbreviateNumber(this, precision, 'kmbt', 0, 4);
      },

      /***
       * @method metric([precision] = 0, [limit] = 1)
       * @returns String
       * @short Returns the number as a string in metric notation.
       * @extra [precision] will round to the given precision. Both very large numbers and very small numbers are supported. [limit] is the upper limit for the units. The default is %1%, which is "kilo". If [limit] is %false%, the upper limit will be "exa". The lower limit is "nano", and cannot be changed. %Number.thousands% and %Number.decimal% allow custom markers to be used.
       * @example
       *
       *   (1000).metric()            -> "1k"
       *   (1000000).metric()         -> "1,000k"
       *   (1000000).metric(0, false) -> "1M"
       *   (1249).metric(2) + 'g'     -> "1.25kg"
       *   (0.025).metric() + 'm'     -> "25mm"
       *
       ***/
      'metric': function(precision, limit) {
        return abbreviateNumber(this, precision, 'nμm kMGTPE', 4, isUndefined(limit) ? 1 : limit);
      },

      /***
       * @method bytes([precision] = 0, [limit] = 4, [si] = false)
       * @returns String
       * @short Returns an abbreviated form of the number, considered to be "Bytes".
       * @extra [precision] will round to the given precision. [limit] is the upper limit for the units. The default is %4%, which is "terabytes" (TB). If [limit] is %false%, the upper limit will be "exa". If [si] is %true%, the standard SI units of 1000 will be used instead of 1024. %Number.thousands% and %Number.decimal% allow custom markers to be used.
       * @example
       *
       *   (1000).bytes()                 -> "1kB"
       *   (1000).bytes(2)                -> "0.98kB"
       *   ((10).pow(20)).bytes()         -> "90,949,470TB"
       *   ((10).pow(20)).bytes(0, false) -> "87EB"
       *
       ***/
      'bytes': function(precision, limit, si) {
        return abbreviateNumber(this, precision, 'kMGTPE', 0, isUndefined(limit) ? 4 : limit, si !== true) + 'B';
      },

      /***
       * @method isInteger()
       * @returns Boolean
       * @short Returns true if the number has no trailing decimal.
       * @example
       *
       *   (420).isInteger() -> true
       *   (4.5).isInteger() -> false
       *
       ***/
      'isInteger': function() {
        return isInteger(this);
      },

      /***
       * @method isOdd()
       * @returns Boolean
       * @short Returns true if the number is odd.
       * @example
       *
       *   (3).isOdd()  -> true
       *   (18).isOdd() -> false
       *
       ***/
      'isOdd': function() {
        return isInteger(this) && !isMultiple(this, 2);
      },

      /***
       * @method isEven()
       * @returns Boolean
       * @short Returns true if the number is even.
       * @example
       *
       *   (6).isEven()  -> true
       *   (17).isEven() -> false
       *
       ***/
      'isEven': function() {
        return isMultiple(this, 2);
      },

      /***
       * @method isMultipleOf(<num>)
       * @returns Boolean
       * @short Returns true if the number is a multiple of <num>.
       * @example
       *
       *   (6).isMultipleOf(2)  -> true
       *   (17).isMultipleOf(2) -> false
       *   (32).isMultipleOf(4) -> true
       *   (34).isMultipleOf(4) -> false
       *
       ***/
      'isMultipleOf': function(num) {
        return isMultiple(this, num);
      },


      /***
       * @method format([place] = 0, [thousands] = ',', [decimal] = '.')
       * @extra If [place] is %undefined%, will automatically determine the place. [thousands] is the character used for the thousands separator. [decimal] is the character used for the decimal point.xtra If [place] is %undefined%, the place will automatically be determined. %Number.thousands% and %Number.decimal% allow custom markers to be used.
       * @returns String
       * @short Formats the number to a readable string.
       * @extra If [place] is %undefined%, the place will automatically be determined. %Number.thousands% and %Number.decimal% allow custom markers to be used.
       * @example
       *
       *   (56782).format()              -> '56,782'
       *   (56782).format(2)             -> '56,782.00'
       *   (4388.43).format(2, ' ')      -> '4 388.43'
       *   (4388.43).format(2, '.', ',') -> '4.388,43'
       *
       ***/
      'format': function(place, thousands, decimal) {
        return formatNumber(this, place, thousands, decimal);
      },

      /***
       * @method hex([pad] = 1)
       * @returns String
       * @short Converts the number to hexidecimal.
       * @extra [pad] will pad the resulting string to that many places.
       * @example
       *
       *   (255).hex()   -> 'ff';
       *   (255).hex(4)  -> '00ff';
       *   (23654).hex() -> '5c66';
       *
       ***/
      'hex': function(pad) {
        return padNumber(this, pad || 1, false, 16);
      },

      /***
       * @method times(<fn>)
       * @returns Number
       * @short Calls <fn> a number of times equivalent to the number.
       * @example
       *
       *   (8).times(function(i) {
       *     // This function is called 8 times.
       *   });
       *
       ***/
      'times': function(fn) {
        if (fn) {
          for(var i = 0; i < this; i++) {
            fn.call(this, i);
          }
        }
        return +this;
      },

      /***
       * @method chr()
       * @returns String
       * @short Returns a string at the code point of the number.
       * @example
       *
       *   (65).chr() -> "A"
       *   (75).chr() -> "K"
       *
       ***/
      'chr': function() {
        return String.fromCharCode(this);
      },

      /***
       * @method pad(<place> = 0, [sign] = false, [base] = 10)
       * @returns String
       * @short Pads a number with "0" to <place>.
       * @extra [sign] allows you to force the sign as well (+05, etc). [base] can change the base for numeral conversion.
       * @example
       *
       *   (5).pad(2)        -> '05'
       *   (-5).pad(4)       -> '-0005'
       *   (82).pad(3, true) -> '+082'
       *
       ***/
      'pad': function(place, sign, base) {
        return padNumber(this, place, sign, base);
      },

      /***
       * @method ordinalize()
       * @returns String
       * @short Returns an ordinalized (English) string, i.e. "1st", "2nd", etc.
       * @example
       *
       *   (1).ordinalize() -> '1st';
       *   (2).ordinalize() -> '2nd';
       *   (8).ordinalize() -> '8th';
       *
       ***/
      'ordinalize': function() {
        var suffix, num = abs(this), last = parseInt(num.toString().slice(-2));
        return this + getOrdinalizedSuffix(last);
      },

      /***
       * @method toNumber()
       * @returns Number
       * @short Returns a number. This is mostly for compatibility reasons.
       * @example
       *
       *   (420).toNumber() -> 420
       *
       ***/
      'toNumber': function() {
        return parseFloat(this, 10);
      }

    });

    /***
     * @method round(<precision> = 0)
     * @returns Number
     * @short Shortcut for %Math.round% that also allows a <precision>.
     *
     * @example
     *
     *   (3.241).round()  -> 3
     *   (-3.841).round() -> -4
     *   (3.241).round(2) -> 3.24
     *   (3748).round(-2) -> 3800
     *
     ***
     * @method ceil(<precision> = 0)
     * @returns Number
     * @short Shortcut for %Math.ceil% that also allows a <precision>.
     *
     * @example
     *
     *   (3.241).ceil()  -> 4
     *   (-3.241).ceil() -> -3
     *   (3.241).ceil(2) -> 3.25
     *   (3748).ceil(-2) -> 3800
     *
     ***
     * @method floor(<precision> = 0)
     * @returns Number
     * @short Shortcut for %Math.floor% that also allows a <precision>.
     *
     * @example
     *
     *   (3.241).floor()  -> 3
     *   (-3.841).floor() -> -4
     *   (3.241).floor(2) -> 3.24
     *   (3748).floor(-2) -> 3700
     *
     ***
     * @method [math]()
     * @returns Number
     * @short Math related functions are mapped as shortcuts to numbers and are identical. Note that %Number#log% provides some special defaults.
     *
     * @set
     *   abs
     *   sin
     *   asin
     *   cos
     *   acos
     *   tan
     *   atan
     *   sqrt
     *   exp
     *   pow
     *
     * @example
     *
     *   (3).pow(3) -> 27
     *   (-3).abs() -> 3
     *   (1024).sqrt() -> 32
     *
     ***/

    function buildNumber() {
      function createRoundingFunction(fn) {
        return function (precision) {
          return precision ? withPrecision(this, precision, fn) : fn(this);
        }
      }
      extend(Number, {
        'ceil':   createRoundingFunction(ceil),
        'round':  createRoundingFunction(round),
        'floor':  createRoundingFunction(floor)
      });
      extendSimilar(Number, 'abs,pow,sin,asin,cos,acos,tan,atan,exp,pow,sqrt', function(methods, name) {
        methods[name] = function(a, b) {
          // Note that .valueOf() here is only required due to a
          // very strange bug in iOS7 that only occurs occasionally
          // in which Math.abs() called on non-primitive numbers
          // returns a completely different number (Issue #400)
          return Math[name](this.valueOf(), a, b);
        }
      });
    }

    buildNumber();

    /***
     * @module Object
     * @dependency core
     * @description Object manipulation, type checking (isNumber, isString, ...), %extended objects% with hash-like methods available as instance methods.
     *
     * Much thanks to kangax for his informative aricle about how problems with instanceof and constructor
     * http://perfectionkills.com/instanceof-considered-harmful-or-how-to-write-a-robust-isarray/
     *
     ***/

    var ObjectTypeMethods = 'isObject,isNaN'.split(',');
    var ObjectHashMethods = 'equals,keys,values,select,reject,each,map,reduce,size,merge,clone,watch,tap,has,toQueryString'.split(',');

    function setParamsObject(obj, param, value, castBoolean) {
      var reg = /^(.+?)(\[.*\])$/, paramIsArray, match, allKeys, key;
      if (match = param.match(reg)) {
        key = match[1];
        allKeys = match[2].replace(/^\[|\]$/g, '').split('][');
        allKeys.forEach(function(k) {
          paramIsArray = !k || k.match(/^\d+$/);
          if (!key && isArray(obj)) key = obj.length;
          if (!hasOwnProperty(obj, key)) {
            obj[key] = paramIsArray ? [] : {};
          }
          obj = obj[key];
          key = k;
        });
        if (!key && paramIsArray) key = obj.length.toString();
        setParamsObject(obj, key, value, castBoolean);
      } else if (castBoolean && value === 'true') {
        obj[param] = true;
      } else if (castBoolean && value === 'false') {
        obj[param] = false;
      } else {
        obj[param] = value;
      }
    }

    function objectToQueryString(base, obj) {
      var tmp;
      // If a custom toString exists bail here and use that instead
      if (isArray(obj) || (isObjectType(obj) && obj.toString === internalToString)) {
        tmp = [];
        iterateOverObject(obj, function(key, value) {
          if (base) {
            key = base + '[' + key + ']';
          }
          tmp.push(objectToQueryString(key, value));
        });
        return tmp.join('&');
      } else {
        if (!base) return '';
        return sanitizeURIComponent(base) + '=' + (isDate(obj) ? obj.getTime() : sanitizeURIComponent(obj));
      }
    }

    function sanitizeURIComponent(obj) {
      // undefined, null, and NaN are represented as a blank string,
      // while false and 0 are stringified. "+" is allowed in query string
      return !obj && obj !== false && obj !== 0 ? '' : encodeURIComponent(obj).replace(/%20/g, '+');
    }

    function matchInObject(match, key, value) {
      if (isRegExp(match)) {
        return match.test(key);
      } else if (isObjectType(match)) {
        return match[key] === value;
      } else {
        return key === String(match);
      }
    }

    function selectFromObject(obj, args, select) {
      var match, result = obj instanceof Hash ? new Hash : {};
      iterateOverObject(obj, function(key, value) {
        match = false;
        for (var i = 0; i < args.length; i++) {
          if (matchInObject(args[i], key, value)) {
            match = true;
          }
        }
        if (match === select) {
          result[key] = value;
        }
      });
      return result;
    }

    // Object merging

    var getOwnPropertyNames      = Object.getOwnPropertyNames;
    var defineProperty           = propertyDescriptorSupport ? Object.defineProperty : definePropertyShim;
    var getOwnPropertyDescriptor = propertyDescriptorSupport ? Object.getOwnPropertyDescriptor : getOwnPropertyDescriptorShim;

    function iterateOverProperties(obj, hidden, fn) {
      if (hidden && propertyDescriptorSupport) {
        iterateOverPropertyNames(obj, fn);
      } else {
        iterateOverObject(obj, fn);
      }
    }

    function iterateOverPropertyNames(obj, fn) {
      getOwnPropertyNames(obj).forEach(fn);
    }

    function getOwnPropertyDescriptorShim(obj, prop) {
      return obj.hasOwnProperty(prop) ? { value: obj[prop] } : Undefined;
    }

    function definePropertyShim(obj, prop, descriptor) {
      obj[prop] = descriptor.value;
    }

    function mergeObject(target, source, deep, resolve, isClone) {
      var key, sourceIsObject, targetIsObject, sourceVal, targetVal, conflict, result;
      // Strings cannot be reliably merged thanks to
      // their properties not being enumerable in < IE8.
      if(target && typeof source !== 'string') {
        iterateOverProperties(source, isClone, function (key) {
          sourceVal      = source[key];
          targetVal      = target[key];
          conflict       = isDefined(targetVal);
          sourceIsObject = isObjectType(sourceVal);
          targetIsObject = isObjectType(targetVal);
          result         = conflict && resolve === false ? targetVal : sourceVal;

          if(conflict) {
            if(isFunction(resolve)) {
              // Use the result of the callback as the result.
              result = resolve.call(source, key, targetVal, sourceVal)
            }
          }

          // Going deep
          if(deep && (sourceIsObject || targetIsObject)) {
            if(isDate(sourceVal)) {
              result = new Date(sourceVal.getTime());
            } else if(isRegExp(sourceVal)) {
              result = new RegExp(sourceVal.source, getRegExpFlags(sourceVal));
            } else {
              if(!targetIsObject) target[key] = Array.isArray(sourceVal) ? [] : {};
              mergeObject(target[key], sourceVal, deep, resolve, isClone);
              return;
            }
          }

          if (isClone && propertyDescriptorSupport) {
            mergeByPropertyDescriptor(target, source, key, result);
          } else {
            target[key] = result;
          }
        });
      }
      return target;
    }

    function mergeByPropertyDescriptor(target, source, prop, sourceVal) {
      var descriptor = getOwnPropertyDescriptor(source, prop);
      if (isDefined(descriptor.value)) {
        descriptor.value = sourceVal;
      }
      defineProperty(target, prop, descriptor);
    }


    // Extending all

    function mapAllObject() {
      buildObjectInstanceMethods(getObjectInstanceMethods(), Object);
    }

    function unmapAllObject() {
      var objProto = Object.prototype, methods = getObjectInstanceMethods();
      methods.forEach(function(name) {
        if (objProto[name]) {
          delete objProto[name];
        }
      });
    }

    function getObjectInstanceMethods() {
      return ObjectTypeMethods.concat(ObjectHashMethods);
    }

    /***
     * @method Object.is[Type](<obj>)
     * @returns Boolean
     * @short Returns true if <obj> is an object of that type.
     * @extra %isObject% will return false on anything that is not an object literal, including instances of inherited classes. Note also that %isNaN% will ONLY return true if the object IS %NaN%. It does not mean the same as browser native %isNaN%, which returns true for anything that is "not a number".
     *
     * @set
     *   isArray
     *   isArguments
     *   isObject
     *   isBoolean
     *   isDate
     *   isFunction
     *   isNaN
     *   isNumber
     *   isString
     *   isRegExp
     *
     * @example
     *
     *   Object.isArray([1,2,3])            -> true
     *   Object.isDate(3)                   -> false
     *   Object.isRegExp(/wasabi/)          -> true
     *   Object.isObject({ broken:'wear' }) -> true
     *
     ***/
    function buildTypeMethods() {
      extendSimilar(Object, natives, function(methods, name) {
        var method = 'is' + name;
        ObjectTypeMethods.push(method);
        methods[method] = typeChecks[name];
      }, false);
    }

    extend(Object, {
        /***
         * @method watch(<obj>, <prop>, <fn>)
         * @returns Boolean
         * @short Watches property <prop> of <obj> and runs <fn> when it changes.
         * @extra <fn> is passed three arguments: the property <prop>, the old value, and the new value. The return value of [fn] will be set as the new value. Properties that are non-configurable or already have getters or setters cannot be watched. Return value is whether or not the watch operation succeeded. This method is useful for things such as validating or cleaning the value when it is set. Warning: this method WILL NOT work in browsers that don't support %Object.defineProperty% (IE 8 and below). This is the only method in Sugar that is not fully compatible with all browsers. %watch% is available as an instance method on %extended objects%.
         * @example
         *
         *   Object.watch({ foo: 'bar' }, 'foo', function(prop, oldVal, newVal) {
         *     // Will be run when the property 'foo' is set on the object.
         *   });
         *   Object.extended().watch({ foo: 'bar' }, 'foo', function(prop, oldVal, newVal) {
         *     // Will be run when the property 'foo' is set on the object.
         *   });
         *
         ***/
      'watch': function(obj, prop, fn) {
        var value, descriptor;
        if (!propertyDescriptorSupport) return false;
        descriptor = getOwnPropertyDescriptor(obj, prop);
        if (descriptor && (!descriptor.configurable || descriptor.get || descriptor.set)) {
          return false;
        }
        value = obj[prop];
        defineProperty(obj, prop, {
          configurable: true,
          enumerable  : !descriptor || descriptor.enumerable,
          get: function() {
            return value;
          },
          set: function(to) {
            value = fn.call(obj, prop, value, to);
          }
        });
        return true;
      },

        /***
         * @method unwatch(<obj>, <prop>)
         * @returns Nothing.
         * @short Removes a watcher previously set.
         * @extra Return value is whether or not the watch operation succeeded. %unwatch% is available as an instance method on %extended objects%.
         ***/
      'unwatch': function(obj, prop) {
        var descriptor;
        if (!propertyDescriptorSupport) return false;
        descriptor = getOwnPropertyDescriptor(obj, prop);
        if (!descriptor || !descriptor.configurable || !descriptor.get || !descriptor.set) {
          return false;
        }
        defineProperty(obj, prop, {
          writable: true,
          configurable: true,
          enumerable: descriptor.enumerable,
          value: obj[prop]
        });
        return true;
      }
    }, false, false);

    extend(Object, {

      /***
       * @method keys(<obj>, [fn])
       * @returns Array
       * @short Returns an array containing the keys in <obj>. Optionally calls [fn] for each key.
       * @extra This method is provided for browsers that don't support it natively, and additionally is enhanced to accept the callback [fn]. Returned keys are in no particular order. %keys% is available as an instance method on %extended objects%.
       * @example
       *
       *   Object.keys({ broken: 'wear' }) -> ['broken']
       *   Object.keys({ broken: 'wear' }, function(key, value) {
       *     // Called once for each key.
       *   });
       *   Object.extended({ broken: 'wear' }).keys() -> ['broken']
       *
       ***/
      'keys': function(obj, fn) {
        var keys = Object.keys(obj);
        keys.forEach(function(key) {
          fn.call(obj, key, obj[key]);
        });
        return keys;
      }

    }, false, function() { return isFunction(arguments[1]); });

    extend(Object, {

      'isArguments': function(obj) {
        return isArgumentsObject(obj);
      },

      'isObject': function(obj) {
        return isPlainObject(obj);
      },

      'isNaN': function(obj) {
        // This is only true of NaN
        return isNumber(obj) && obj.valueOf() !== obj.valueOf();
      },

      /***
       * @method equal(<a>, <b>)
       * @returns Boolean
       * @short Returns true if <a> and <b> are equal.
       * @extra %equal% in Sugar is "egal", meaning the values are equal if they are "not observably distinguishable". Note that on %extended objects% the name is %equals% for readability.
       * @example
       *
       *   Object.equal({a:2}, {a:2}) -> true
       *   Object.equal({a:2}, {a:3}) -> false
       *   Object.extended({a:2}).equals({a:3}) -> false
       *
       ***/
      'equal': function(a, b) {
        return isEqual(a, b);
      },

      /***
       * @method Object.extended(<obj> = {})
       * @returns Extended object
       * @short Creates a new object, equivalent to %new Object()% or %{}%, but with extended methods.
       * @extra See %extended objects% for more.
       * @example
       *
       *   Object.extended()
       *   Object.extended({ happy:true, pappy:false }).keys() -> ['happy','pappy']
       *   Object.extended({ happy:true, pappy:false }).values() -> [true, false]
       *
       ***/
      'extended': function(obj) {
        return new Hash(obj);
      },

      /***
       * @method merge(<target>, <source>, [deep] = false, [resolve] = true)
       * @returns Merged object
       * @short Merges all the properties of <source> into <target>.
       * @extra Merges are shallow unless [deep] is %true%. Properties of <target> that are either null or undefined will be treated as if they don't exist. Properties of <source> will win in the case of conflicts, unless [resolve] is %false%. [resolve] can also be a function that resolves the conflict. In this case it will be passed 3 arguments, %key%, %targetVal%, and %sourceVal%. %merge% is available as an instance method on %extended objects%. For more, see %object_merging%.
       * @example
       *
       *   Object.merge({a:1},{b:2}) -> { a:1, b:2 }
       *   Object.merge({a:1},{a:2}, false, false) -> { a:1 }
       +   Object.merge({a:1},{a:2}, false, function(key, a, b) {
       *     return a + b;
       *   }); -> { a:3 }
       *   Object.extended({a:1}).merge({b:2}) -> { a:1, b:2 }
       *
       ***/
      'merge': function(target, source, deep, resolve) {
        return mergeObject(target, source, deep, resolve);
      },

      /***
       * @method values(<obj>, [fn])
       * @returns Array
       * @short Returns an array containing the values in <obj>. Optionally calls [fn] for each value.
       * @extra Returned values are in no particular order. %values% is available as an instance method on %extended objects%.
       * @example
       *
       *   Object.values({ broken: 'wear' }) -> ['wear']
       *   Object.values({ broken: 'wear' }, function(value) {
       *     // Called once for each value.
       *   });
       *   Object.extended({ broken: 'wear' }).values() -> ['wear']
       *
       ***/
      'values': function(obj, fn) {
        var values = [];
        iterateOverObject(obj, function(k,v) {
          values.push(v);
          if (isFunction(fn)) {
            fn.call(obj,v);
          }
        });
        return values;
      },

      /***
       * @method clone(<obj> = {}, [deep] = false)
       * @returns Cloned object
       * @short Creates a clone (copy) of <obj>.
       * @extra Default is a shallow clone, unless [deep] is true. %clone% is available as an instance method on %extended objects%.
       * @example
       *
       *   Object.clone({foo:'bar'})            -> { foo: 'bar' }
       *   Object.clone()                       -> {}
       *   Object.extended({foo:'bar'}).clone() -> { foo: 'bar' }
       *
       ***/
      'clone': function(obj, deep) {
        var target, klass;
        if (!isObjectType(obj)) {
          return obj;
        }
        klass = className(obj);
        if (isDate(obj, klass) && obj.clone) {
          // Preserve internal UTC flag when possible.
          return obj.clone(obj);
        } else if (isDate(obj, klass) || isRegExp(obj, klass)) {
          return new obj.constructor(obj);
        } else if (obj instanceof Hash) {
          target = new Hash;
        } else if (isArray(obj, klass)) {
          target = [];
        } else if (isPlainObject(obj, klass)) {
          target = {};
        } else {
          throw new TypeError('Clone must be a basic data type.');
        }

        return mergeObject(target, obj, deep, true, true);
      },

      /***
       * @method Object.fromQueryString(<str>, [booleans] = false)
       * @returns Object
       * @short Converts the query string of a URL into an object.
       * @extra If [booleans] is true, then %"true"% and %"false"% will be cast into booleans. All other values, including numbers will remain their string values.
       * @example
       *
       *   Object.fromQueryString('foo=bar&broken=wear') -> { foo: 'bar', broken: 'wear' }
       *   Object.fromQueryString('foo[]=1&foo[]=2')     -> { foo: ['1','2'] }
       *   Object.fromQueryString('foo=true', true)      -> { foo: true }
       *
       ***/
      'fromQueryString': function(str, castBoolean) {
        var result = new Hash, split;
        if (!str) {
          return result;
        }
        str = str && str.toString ? str.toString() : '';
        str.replace(/^.*?\?/, '').split('&').forEach(function(p) {
          var split = p.split('=');
          setParamsObject(result, split[0], decodeURIComponent(split[1] || ''), castBoolean);
        });
        return result;
      },

      /***
       * @method Object.toQueryString(<obj>, [namespace] = null)
       * @returns Object
       * @short Converts the object into a query string.
       * @extra Accepts deep nested objects and arrays. If [namespace] is passed, it will be prefixed to all param names.
       * @example
       *
       *   Object.toQueryString({foo:'bar'})          -> 'foo=bar'
       *   Object.toQueryString({foo:['a','b','c']})  -> 'foo[0]=a&foo[1]=b&foo[2]=c'
       *   Object.toQueryString({name:'Bob'}, 'user') -> 'user[name]=Bob'
       *
       ***/
      'toQueryString': function(obj, namespace) {
        return objectToQueryString(namespace, obj);
      },

      /***
       * @method tap(<obj>, <fn>)
       * @returns Object
       * @short Runs <fn> and returns <obj>.
       * @extra  A string can also be used as a shortcut to a method. This method is used to run an intermediary function in the middle of method chaining. As a standalone method on the Object class it doesn't have too much use. The power of %tap% comes when using %extended objects% or modifying the Object prototype with %Object.extend()%.
       * @example
       *
       *   Object.extend();
       *   [2,4,6].map(Math.exp).tap(function(arr) {
       *     arr.pop()
       *   });
       *   [2,4,6].map(Math.exp).tap('pop').map(Math.round); ->  [7,55]
       *
       ***/
      'tap': function(obj, arg) {
        var fn = arg;
        if (!isFunction(arg)) {
          fn = function() {
            if (arg) obj[arg]();
          }
        }
        fn.call(obj, obj);
        return obj;
      },

      /***
       * @method has(<obj>, <key>)
       * @returns Boolean
       * @short Checks if <obj> has <key> using hasOwnProperty from Object.prototype.
       * @extra This method is considered safer than %Object#hasOwnProperty% when using objects as hashes. See http://www.devthought.com/2012/01/18/an-object-is-not-a-hash/ for more.
       * @example
       *
       *   Object.has({ foo: 'bar' }, 'foo') -> true
       *   Object.has({ foo: 'bar' }, 'baz') -> false
       *   Object.has({ hasOwnProperty: true }, 'foo') -> false
       *
       ***/
      'has': function (obj, key) {
        return hasOwnProperty(obj, key);
      },

      /***
       * @method select(<obj>, <find>, ...)
       * @returns Object
       * @short Builds a new object containing the values specified in <find>.
       * @extra When <find> is a string, that single key will be selected. It can also be a regex, selecting any key that matches, or an object which will effectively do an "intersect" operation on that object. Multiple selections may also be passed as an array or directly as enumerated arguments. %select% is available as an instance method on %extended objects%.
       * @example
       *
       *   Object.select({a:1,b:2}, 'a')        -> {a:1}
       *   Object.select({a:1,b:2}, /[a-z]/)    -> {a:1,ba:2}
       *   Object.select({a:1,b:2}, {a:1})      -> {a:1}
       *   Object.select({a:1,b:2}, 'a', 'b')   -> {a:1,b:2}
       *   Object.select({a:1,b:2}, ['a', 'b']) -> {a:1,b:2}
       *
       ***/
      'select': function (obj) {
        // Optimized: no leaking arguments (flat)
        var args = [], $i; for($i = 1; $i < arguments.length; $i++) args = args.concat(arguments[$i]);
        return selectFromObject(obj, args, true);
      },

      /***
       * @method reject(<obj>, <find>, ...)
       * @returns Object
       * @short Builds a new object containing all values except those specified in <find>.
       * @extra When <find> is a string, that single key will be rejected. It can also be a regex, rejecting any key that matches, or an object which will match if the key also exists in that object, effectively "subtracting" that object. Multiple selections may also be passed as an array or directly as enumerated arguments. %reject% is available as an instance method on %extended objects%.
       * @example
       *
       *   Object.reject({a:1,b:2}, 'a')        -> {b:2}
       *   Object.reject({a:1,b:2}, /[a-z]/)    -> {}
       *   Object.reject({a:1,b:2}, {a:1})      -> {b:2}
       *   Object.reject({a:1,b:2}, 'a', 'b')   -> {}
       *   Object.reject({a:1,b:2}, ['a', 'b']) -> {}
       *
       ***/
      'reject': function (obj) {
        // Optimized: no leaking arguments (flat)
        var args = [], $i; for($i = 1; $i < arguments.length; $i++) args = args.concat(arguments[$i]);
        return selectFromObject(obj, args, false);
      },

      /***
       * @method map(<obj>, <map>)
       * @returns Object
       * @short Maps the object to another object.
       * @extra When <map> is a function, the first argument will be the object's key and the second will be its value. The third argument will be the object itself. The resulting object values will be those which were returned from <map>.
       *
       * @example
       *
       *   Object.map({ foo: 'bar' }, function(lhs, rhs) {
       *     return 'ha';
       *   }); -> Returns { foo: 'ha' }
       *
       ***/
      'map': function(obj, map) {
        var result = {}, key, value;
        for(key in obj) {
          if (!hasOwnProperty(obj, key)) continue;
          value = obj[key];
          result[key] = transformArgument(value, map, obj, [key, value, obj]);
        }
        return result;
      },

      'reduce': function(obj) {
        var args = [], values;
        values = keysWithObjectCoercion(obj).map(function(key) {
          return obj[key];
        });
        for(var i = 1, len = arguments.length; i < len; i++) {
          args.push(arguments[i]);
        }
        return values.reduce.apply(values, args);
      },

      /***
       * @method each(<obj>, <fn>)
       * @returns Object
       * @short Runs <fn> against each property in the object, passing in the key as the first argument, and the value as the second.
       * @extra If <fn> returns %false% at any time it will break out of the loop. Returns <obj>.
       * @example
       *
       *   Object.each({ foo: 'bar' }, function(k, v) {
       *     console.log('key is ', k, ' and value is ', v);
       *   });
       *
       ***/
      'each': function(obj, fn) {
        checkCallback(fn);
        iterateOverObject(obj, fn);
        return obj;
      },

      /***
       * @method size(<obj>)
       * @returns Number
       * @short Returns the number of properties in <obj>.
       * @extra %size% is available as an instance method on %extended objects%.
       * @example
       *
       *   Object.size({ foo: 'bar' }) -> 1
       *
       ***/
      'size': function (obj) {
        return keysWithObjectCoercion(obj).length;
      }

    }, false);

    extend(Object, {

      'extend': function(on) {
        if (on !== false) {
          mapAllObject();
        } else {
          unmapAllObject();
        }
        return true;
      }

    }, false, function(arg) { return typeof arg !== 'object'; });


    buildTypeMethods();
    buildObjectInstanceMethods(ObjectHashMethods, Hash);

    /***
     * @module Range
     * @dependency core
     * @description Ranges allow creating spans of numbers, strings, or dates. They can enumerate over specific points within that range, and be manipulated and compared.
     *
     ***/

    var DATE_UNITS               = 'year|month|week|day|hour|minute|(?:milli)?second';
    var FULL_CAPTURED_DURATION   = '((?:\\d+)?\\s*(?:' + DATE_UNITS + '))s?';
    var RANGE_REG                = /(?:from)?\s*(.+)\s+(?:to|until)\s+(.+)$/i;
    var DURATION_REG             = RegExp('(\\d+)?\\s*('+ DATE_UNITS +')s?', 'i');
    var RANGE_REG_FRONT_DURATION = RegExp('(?:for)?\\s*'+ FULL_CAPTURED_DURATION +'\\s*(?:starting)?\\s*at\\s*(.+)', 'i');
    var RANGE_REG_REAR_DURATION  = RegExp('(.+)\\s*for\\s*' + FULL_CAPTURED_DURATION, 'i');

    var MULTIPLIERS = {
      'Hours': 60 * 60 * 1000,
      'Minutes': 60 * 1000,
      'Seconds': 1000,
      'Milliseconds': 1
    };

    function Range(start, end) {
      this.start = cloneRangeMember(start);
      this.end   = cloneRangeMember(end);
    };

    function getRangeMemberNumericValue(m) {
      return isString(m) ? m.charCodeAt(0) : m;
    }

    function getRangeMemberPrimitiveValue(m) {
      if (m == null) return m;
      return isDate(m) ? m.getTime() : m.valueOf();
    }

    function getPrecision(n) {
      var split = n.toString().split('.');
      return split[1] ? split[1].length : 0;
    }

    function getGreaterPrecision(n1, n2) {
      return max(getPrecision(n1), getPrecision(n2));
    }

    function getSimpleDate(str) {
      // Needed as argument numbers are checked internally here.
      return str == null ? new Date() : new Date(str);
    }

    function getSugarExtendedDate(d) {
      return Date.create(d);
    }

    function dateConstructorIsExtended() {
      return !!Date.create;
    }

    function createDateRangeFromString(str) {
      var match, datetime, duration, dio, start, end;
      if (match = str.match(RANGE_REG)) {
        return DateRangeConstructor(match[1], match[2]);
      }
      if (match = str.match(RANGE_REG_FRONT_DURATION)) {
        duration = match[1];
        datetime = match[2];
      }
      if (match = str.match(RANGE_REG_REAR_DURATION)) {
        datetime = match[1];
        duration = match[2];
      }
      if (datetime && duration) {
        start = getSugarExtendedDate(datetime);
        dio = getDateIncrementObject(duration);
        end = incrementDate(start, dio[0], dio[1]);
      }
      return DateRangeConstructor(start, end);
    }

    function cloneRangeMember(m) {
      if (isDate(m)) {
        return new Date(m.getTime());
      } else {
        return getRangeMemberPrimitiveValue(m);
      }
    }

    function isValidRangeMember(m) {
      var val = getRangeMemberPrimitiveValue(m);
      return (!!val || val === 0) && valueIsNotInfinite(m);
    }

    function valueIsNotInfinite(m) {
      return m !== -Infinity && m !== Infinity;
    }

    function getDateIncrementObject(amt) {
      var match, val, unit;
      if (isNumber(amt)) {
        return [amt, 'Milliseconds'];
      }
      match = amt.match(DURATION_REG);
      val = parseInt(match[1]) || 1;
      unit = match[2].slice(0,1).toUpperCase() + match[2].slice(1).toLowerCase();
      if (unit.match(/hour|minute|second/i)) {
        unit += 's';
      } else if (unit === 'Year') {
        unit = 'FullYear';
      } else if (unit === 'Day') {
        unit = 'Date';
      }
      return [val, unit];
    }

    function incrementDate(src, amount, unit) {
      var mult = MULTIPLIERS[unit], d;
      if (mult) {
        d = new Date(src.getTime() + (amount * mult));
      } else {
        d = new Date(src);
        callDateSet(d, unit, callDateGet(src, unit) + amount);
      }
      return d;
    }


    function incrementString(current, amount) {
      return String.fromCharCode(current.charCodeAt(0) + amount);
    }

    function incrementNumber(current, amount, precision) {
      return withPrecision(current + amount, precision);
    }

    /***
     * @method toString()
     * @returns String
     * @short Returns a string representation of the range.
     * @example
     *
     *   Number.range(1, 5).toString()                               -> 1..5
     *   Date.range(new Date(2003, 0), new Date(2005, 0)).toString() -> January 1, 2003..January 1, 2005
     *
     ***/

    // Note: 'toString' doesn't appear in a for..in loop in IE even though
    // hasOwnProperty reports true, so extend() can't be used here.
    // Also tried simply setting the prototype = {} up front for all
    // methods but GCC very oddly started dropping properties in the
    // object randomly (maybe because of the global scope?) hence
    // the need for the split logic here.
    Range.prototype.toString = function() {
      return this.isValid() ? this.start + ".." + this.end : 'Invalid Range';
    };

    extend(Range, {

      /***
       * @method isValid()
       * @returns Boolean
       * @short Returns true if the range is valid, false otherwise.
       * @example
       *
       *   Date.range(new Date(2003, 0), new Date(2005, 0)).isValid() -> true
       *   Number.range(NaN, NaN).isValid()                           -> false
       *
       ***/
      'isValid': function() {
        return isValidRangeMember(this.start) && isValidRangeMember(this.end) && typeof this.start === typeof this.end;
      },

      /***
       * @method span()
       * @returns Number
       * @short Returns the span of the range. If the range is a date range, the value is in milliseconds.
       * @extra The span includes both the start and the end.
       * @example
       *
       *   Number.range(5, 10).span()                              -> 6
       *   Date.range(new Date(2003, 0), new Date(2005, 0)).span() -> 94694400000
       *
       ***/
      'span': function() {
        return this.isValid() ? abs(
          getRangeMemberNumericValue(this.end) - getRangeMemberNumericValue(this.start)
        ) + 1 : NaN;
      },

      /***
       * @method contains(<obj>)
       * @returns Boolean
       * @short Returns true if <obj> is contained inside the range. <obj> may be a value or another range.
       * @example
       *
       *   Number.range(5, 10).contains(7)                                              -> true
       *   Date.range(new Date(2003, 0), new Date(2005, 0)).contains(new Date(2004, 0)) -> true
       *
       ***/
      'contains': function(obj) {
        var self = this, arr;
        if (obj == null) return false;
        if (obj.start && obj.end) {
          return obj.start >= this.start && obj.start <= this.end &&
                 obj.end   >= this.start && obj.end   <= this.end;
        } else {
          return obj >= this.start && obj <= this.end;
        }
      },

      /***
       * @method every(<amount>, [fn])
       * @returns Array
       * @short Iterates through the range for every <amount>, calling [fn] if it is passed. Returns an array of each increment visited.
       * @extra In the case of date ranges, <amount> can also be a string, in which case it will increment a number of  units. Note that %(2).months()% first resolves to a number, which will be interpreted as milliseconds and is an approximation, so stepping through the actual months by passing %"2 months"% is usually preferable.
       * @example
       *
       *   Number.range(2, 8).every(2)                                       -> [2,4,6,8]
       *   Date.range(new Date(2003, 1), new Date(2003,3)).every("2 months") -> [...]
       *
       ***/
      'every': function(amount, fn) {
        var increment,
            precision,
            dio,
            unit,
            start   = this.start,
            end     = this.end,
            inverse = end < start,
            current = start,
            index   = 0,
            result  = [];

        if (!this.isValid()) {
          return [];
        }
        if (isFunction(amount)) {
          fn = amount;
          amount = null;
        }
        amount = amount || 1;
        if (isNumber(start)) {
          precision = getGreaterPrecision(start, amount);
          increment = function() {
            return incrementNumber(current, amount, precision);
          };
        } else if (isString(start)) {
          increment = function() {
            return incrementString(current, amount);
          };
        } else if (isDate(start)) {
          dio = getDateIncrementObject(amount);
          amount = dio[0];
          unit = dio[1];
          increment = function() {
            return incrementDate(current, amount, unit);
          };
        }
        // Avoiding infinite loops
        if (inverse && amount > 0) {
          amount *= -1;
        }
        while(inverse ? current >= end : current <= end) {
          result.push(current);
          if (fn) {
            fn(current, index);
          }
          current = increment();
          index++;
        }
        return result;
      },

      /***
       * @method union(<range>)
       * @returns Range
       * @short Returns a new range with the earliest starting point as its start, and the latest ending point as its end. If the two ranges do not intersect this will effectively remove the "gap" between them.
       * @example
       *
       *   Number.range(1, 3).union(Number.range(2, 5)) -> 1..5
       *   Date.range(new Date(2003, 1), new Date(2005, 1)).union(Date.range(new Date(2004, 1), new Date(2006, 1))) -> Jan 1, 2003..Jan 1, 2006
       *
       ***/
      'union': function(range) {
        return new Range(
          this.start < range.start ? this.start : range.start,
          this.end   > range.end   ? this.end   : range.end
        );
      },

      /***
       * @method intersect(<range>)
       * @returns Range
       * @short Returns a new range with the latest starting point as its start, and the earliest ending point as its end. If the two ranges do not intersect this will effectively produce an invalid range.
       * @example
       *
       *   Number.range(1, 5).intersect(Number.range(4, 8)) -> 4..5
       *   Date.range(new Date(2003, 1), new Date(2005, 1)).intersect(Date.range(new Date(2004, 1), new Date(2006, 1))) -> Jan 1, 2004..Jan 1, 2005
       *
       ***/
      'intersect': function(range) {
        if (range.start > this.end || range.end < this.start) {
          return new Range(NaN, NaN);
        }
        return new Range(
          this.start > range.start ? this.start : range.start,
          this.end   < range.end   ? this.end   : range.end
        );
      },

      /***
       * @method clone()
       * @returns Range
       * @short Clones the range.
       * @extra Members of the range will also be cloned.
       * @example
       *
       *   Number.range(1, 5).clone() -> Returns a copy of the range.
       *
       ***/
      'clone': function(range) {
        return new Range(this.start, this.end);
      },

      /***
       * @method clamp(<obj>)
       * @returns Mixed
       * @short Clamps <obj> to be within the range if it falls outside.
       * @example
       *
       *   Number.range(1, 5).clamp(8) -> 5
       *   Date.range(new Date(2010, 0), new Date(2012, 0)).clamp(new Date(2013, 0)) -> 2012-01
       *
       ***/
      'clamp': function(obj) {
        var clamped,
            start = this.start,
            end = this.end,
            min = end < start ? end : start,
            max = start > end ? start : end;
        if (obj < min) {
          clamped = min;
        } else if (obj > max) {
          clamped = max;
        } else {
          clamped = obj;
        }
        return cloneRangeMember(clamped);
      }

    });


    /***
     * @namespace Number
     * @method Number.range([start], [end])
     * @returns Range
     * @short Creates a new range between [start] and [end]. See %ranges% for more.
     * @example
     *
     *   Number.range(5, 10)
     *
     ***
     * @namespace String
     * @method String.range([start], [end])
     * @returns Range
     * @short Creates a new range between [start] and [end]. See %ranges% for more.
     * @example
     *
     *   String.range('a', 'z')
     *
     ***
     * @namespace Date
     * @method Date.range([start], [end])
     * @returns Range
     * @short Creates a new range between [start] and [end].
     * @extra If either [start] or [end] are null, they will default to the current date. See %ranges% for more.
     * @example
     *
     *   Date.range('today', 'tomorrow')
     *
     ***/

     function extendRangeConstructor(klass, constructor) {
       extend(klass, { 'range': constructor }, false);
     }

     var PrimitiveRangeConstructor = function(start, end) {
       return new Range(start, end);
     };

     var DateRangeConstructor = function(start, end) {
       if (dateConstructorIsExtended()) {
         if (arguments.length === 1 && isString(start)) {
           return createDateRangeFromString(start);
         }
         start = getSugarExtendedDate(start);
         end   = getSugarExtendedDate(end);
       } else {
         start = getSimpleDate(start);
         end   = getSimpleDate(end);
       }
       return new Range(start, end);
     };

     extendRangeConstructor(Number, PrimitiveRangeConstructor);
     extendRangeConstructor(String, PrimitiveRangeConstructor);
     extendRangeConstructor(Date, DateRangeConstructor);

    /***
     * @namespace Number
     *
     ***/

    extend(Number, {

      /***
       * @method upto(<num>, [fn], [step] = 1)
       * @returns Array
       * @short Returns an array containing numbers from the number up to <num>.
       * @extra Optionally calls [fn] callback for each number in that array. [step] allows multiples greater than 1.
       * @example
       *
       *   (2).upto(6) -> [2, 3, 4, 5, 6]
       *   (2).upto(6, function(n) {
       *     // This function is called 5 times receiving n as the value.
       *   });
       *   (2).upto(8, null, 2) -> [2, 4, 6, 8]
       *
       ***/
      'upto': function(num, fn, step) {
        return new Range(this, num).every(step, fn);
      },

       /***
       * @method clamp([start] = Infinity, [end] = Infinity)
       * @returns Number
       * @short Constrains the number so that it is between [start] and [end].
       * @extra This will build a range object that has an equivalent %clamp% method.
       * @example
       *
       *   (3).clamp(50, 100)  -> 50
       *   (85).clamp(50, 100) -> 85
       *
       ***/
      'clamp': function(start, end) {
        return new Range(start, end).clamp(this);
      },

       /***
       * @method cap([max] = Infinity)
       * @returns Number
       * @short Constrains the number so that it is no greater than [max].
       * @extra This will build a range object that has an equivalent %cap% method.
       * @example
       *
       *   (100).cap(80) -> 80
       *
       ***/
      'cap': function(max) {
        return new Range(Undefined, max).clamp(this);
      }

    });

    /***
     * @method downto(<num>, [fn], [step] = 1)
     * @returns Array
     * @short Returns an array containing numbers from the number down to <num>.
     * @extra Optionally calls [fn] callback for each number in that array. [step] allows multiples greater than 1.
     * @example
     *
     *   (8).downto(3) -> [8, 7, 6, 5, 4, 3]
     *   (8).downto(3, function(n) {
     *     // This function is called 6 times receiving n as the value.
     *   });
     *   (8).downto(2, null, 2) -> [8, 6, 4, 2]
     *
     ***/
    alias(Number, 'downto', 'upto');


    /***
     * @namespace Array
     *
     ***/

    extend(Array, {

      'create': function(range) {
        return range.every();
      }

    }, false, function(a) { return a instanceof Range; });

    /***
     * @module RegExp
     * @dependency core
     * @description Escaping regexes and manipulating their flags.
     *
     * Note here that methods on the RegExp class like .exec and .test will fail in the current version of SpiderMonkey being
     * used by CouchDB when using shorthand regex notation like /foo/. This is the reason for the intermixed use of shorthand
     * and compiled regexes here. If you're using JS in CouchDB, it is safer to ALWAYS compile your regexes from a string.
     *
     ***/

    extend(RegExp, {

     /***
      * @method RegExp.escape(<str> = '')
      * @returns String
      * @short Escapes all RegExp tokens in a string.
      * @example
      *
      *   RegExp.escape('really?')      -> 'really\?'
      *   RegExp.escape('yes.')         -> 'yes\.'
      *   RegExp.escape('(not really)') -> '\(not really\)'
      *
      ***/
      'escape': function(str) {
        return escapeRegExp(str);
      }

    }, false);

    extend(RegExp, {

     /***
      * @method getFlags()
      * @returns String
      * @short Returns the flags of the regex as a string.
      * @example
      *
      *   /texty/gim.getFlags('testy') -> 'gim'
      *
      ***/
      'getFlags': function() {
        return getRegExpFlags(this);
      },

     /***
      * @method setFlags(<flags>)
      * @returns RegExp
      * @short Sets the flags on a regex and retuns a copy.
      * @example
      *
      *   /texty/.setFlags('gim') -> now has global, ignoreCase, and multiline set
      *
      ***/
      'setFlags': function(flags) {
        return RegExp(this.source, flags);
      },

     /***
      * @method addFlag(<flag>)
      * @returns RegExp
      * @short Adds <flag> to the regex.
      * @example
      *
      *   /texty/.addFlag('g') -> now has global flag set
      *
      ***/
      'addFlag': function(flag) {
        return RegExp(this.source, getRegExpFlags(this, flag));
      },

     /***
      * @method removeFlag(<flag>)
      * @returns RegExp
      * @short Removes <flag> from the regex.
      * @example
      *
      *   /texty/g.removeFlag('g') -> now has global flag removed
      *
      ***/
      'removeFlag': function(flag) {
        return RegExp(this.source, getRegExpFlags(this).replace(flag, ''));
      }

    });

    /***
     * @module String
     * @dependency core
     * @description String manupulation, escaping, encoding, truncation, and:conversion.
     *
     ***/

    var HTML_CODE_MATCH = /&#(x)?([\w\d]{0,5});/i;

    var HTML_VOID_ELEMENTS = [
      'area','base','br','col','command','embed','hr','img',
      'input','keygen','link','meta','param','source','track','wbr'
    ];

    function getInflector() {
      return String.Inflector;
    }

    function getAcronym(word) {
      var inflector = getInflector();
      var word = inflector && inflector.acronyms[word];
      if (isString(word)) {
        return word;
      }
    }

    function checkRepeatRange(num) {
      num = +num;
      if (num < 0 || num === Infinity) {
        throw new RangeError('Invalid number');
      }
      return num;
    }

    function padString(num, padding) {
      return repeatString(isDefined(padding) ? padding : ' ', num);
    }

    function truncateString(str, length, from, ellipsis, split) {
      var str1, str2, len1, len2;
      if (str.length <= length) {
        return str.toString();
      }
      ellipsis = isUndefined(ellipsis) ? '...' : ellipsis;
      switch(from) {
        case 'left':
          str2 = split ? truncateOnWord(str, length, true) : str.slice(str.length - length);
          return ellipsis + str2;
        case 'middle':
          len1 = ceil(length / 2);
          len2 = floor(length / 2);
          str1 = split ? truncateOnWord(str, len1) : str.slice(0, len1);
          str2 = split ? truncateOnWord(str, len2, true) : str.slice(str.length - len2);
          return str1 + ellipsis + str2;
        default:
          str1 = split ? truncateOnWord(str, length) : str.slice(0, length);
          return str1 + ellipsis;
      }
    }

    function stringEach(str, search, fn) {
      var chunks, chunk, reg, result = [];
      if (isFunction(search)) {
        fn = search;
        reg = /[\s\S]/g;
      } else if (!search) {
        reg = /[\s\S]/g;
      } else if (isString(search)) {
        reg = RegExp(escapeRegExp(search), 'gi');
      } else if (isRegExp(search)) {
        reg = RegExp(search.source, getRegExpFlags(search, 'g'));
      }
      // Getting the entire array of chunks up front as we need to
      // pass this into the callback function as an argument.
      chunks = runGlobalMatch(str, reg);

      if (chunks) {
        for(var i = 0, len = chunks.length, r; i < len; i++) {
          chunk = chunks[i];
          result[i] = chunk;
          if (fn) {
            r = fn.call(str, chunk, i, chunks);
            if (r === false) {
              break;
            } else if (isDefined(r)) {
              result[i] = r;
            }
          }
        }
      }
      return result;
    }

    // "match" in < IE9 has enumable properties that will confuse for..in
    // loops, so ensure that the match is a normal array by manually running
    // "exec". Note that this method is also slightly more performant.
    function runGlobalMatch(str, reg) {
      var result = [], match, lastLastIndex;
      while ((match = reg.exec(str)) != null) {
        if (reg.lastIndex === lastLastIndex) {
          reg.lastIndex += 1;
        } else {
          result.push(match[0]);
        }
        lastLastIndex = reg.lastIndex;
      }
      return result;
    }

    function eachWord(str, fn) {
      return stringEach(str.trim(), /\S+/g, fn);
    }

    function stringCodes(str, fn) {
      var codes = [], i, len;
      for(i = 0, len = str.length; i < len; i++) {
        var code = str.charCodeAt(i);
        codes.push(code);
        if (fn) fn.call(str, code, i);
      }
      return codes;
    }

    function shiftChar(str, n) {
      var result = '';
      n = n || 0;
      stringCodes(str, function(c) {
        result += chr(c + n);
      });
      return result;
    }

    function underscore(str) {
      var inflector = getInflector();
      return str
        .replace(/[-\s]+/g, '_')
        .replace(inflector && inflector.acronymRegExp, function(acronym, index) {
          return (index > 0 ? '_' : '') + acronym.toLowerCase();
        })
        .replace(/([A-Z\d]+)([A-Z][a-z])/g,'$1_$2')
        .replace(/([a-z\d])([A-Z])/g,'$1_$2')
        .toLowerCase();
    }

    function spacify(str) {
      return underscore(str).replace(/_/g, ' ');
    }

    function capitalize(str, all) {
      var lastResponded;
      return str.toLowerCase().replace(all ? /[^']/g : /^\S/, function(lower) {
        var upper = lower.toUpperCase(), result;
        result = lastResponded ? lower : upper;
        lastResponded = upper !== lower;
        return result;
      });
    }

    function reverseString(str) {
      return str.split('').reverse().join('');
    }

    function stringFirst(str, num) {
      if (isUndefined(num)) num = 1;
      return str.substr(0, num);
    }

    function stringLast(str, num) {
      if (isUndefined(num)) num = 1;
      var start = str.length - num < 0 ? 0 : str.length - num;
      return str.substr(start);
    }

    function stringFrom(str, from) {
      return str.slice(numberOrIndex(str, from, true));
    }

    function stringTo(str, to) {
      if (isUndefined(to)) to = str.length;
      return str.slice(0, numberOrIndex(str, to));
    }

    function stringAssign(str, args) {
      var obj = {};
      for (var i = 0; i < args.length; i++) {
        var a = args[i];
        if (isObjectType(a)) {
          simpleMerge(obj, a);
        } else {
          obj[i + 1] = a;
        }
      }
      return str.replace(/\{([^{]+?)\}/g, function(m, key) {
        return hasOwnProperty(obj, key) ? obj[key] : m;
      });
    }

    function isBlank(str) {
      return str.trim().length === 0;
    }

    function truncateOnWord(str, limit, fromLeft) {
      if (fromLeft) {
        return reverseString(truncateOnWord(reverseString(str), limit));
      }
      var reg = RegExp('(?=[' + getTrimmableCharacters() + '])');
      var words = str.split(reg);
      var count = 0;
      return words.filter(function(word) {
        count += word.length;
        return count <= limit;
      }).join('');
    }

    function convertHTMLCodes(str) {
      return str.replace(HTML_CODE_MATCH, function(full, hex, code) {
        return String.fromCharCode(parseInt(code, hex ? 16 : 10));
      });
    }

    function tagIsVoid(tag) {
      return HTML_VOID_ELEMENTS.indexOf(tag.toLowerCase()) !== -1;
    }

    function replaceTags(str, args, strip) {
      var lastIndex = args.length - 1, lastArg = args[lastIndex], replacementFn, tags, src, reg;
      if (isFunction(lastArg)) {
        replacementFn = lastArg;
        args.length = lastIndex;
      }
      tags = args.map(function(tag) {
        return escapeRegExp(tag);
      }).join('|');
      src = tags.replace('all', '') || '[^\\s>]+';
      src = '<(\\/)?(' + src + ')(\\s+[^<>]*?)?\\s*(\\/)?>';
      reg = RegExp(src, 'gi');
      return runTagReplacements(str.toString(), reg, strip, replacementFn);
    }

    function runTagReplacements(str, reg, strip, replacementFn, fullString) {

      var match;
      var result = '';
      var currentIndex = 0;
      var currentlyOpenTagName;
      var currentlyOpenTagAttributes;
      var currentlyOpenTagCount = 0;

      function processTag(index, tagName, attributes, tagLength) {
        var content = str.slice(currentIndex, index), replacement;
        if (replacementFn) {
          replacement = replacementFn.call(fullString, tagName, content, attributes, fullString);
          if (isDefined(replacement)) {
            content = replacement;
          } else if (!strip) {
            content = '';
          }
        } else if (!strip) {
          content = '';
        }
        result += runTagReplacements(content, reg, strip, replacementFn, fullString);
        currentIndex = index + (tagLength || 0);
      }

      fullString = fullString || str;
      reg = RegExp(reg.source, 'gi');

      while(match = reg.exec(str)) {

        var tagName         = match[2];
        var attributes      = (match[3]|| '').slice(1);
        var isClosingTag    = !!match[1];
        var isSelfClosing   = !!match[4];
        var tagLength       = match[0].length;
        var isOpeningTag    = !isClosingTag && !isSelfClosing && !tagIsVoid(tagName);
        var isSameAsCurrent = tagName === currentlyOpenTagName;

        if (!currentlyOpenTagName) {
          result += str.slice(currentIndex, match.index);
          currentIndex = match.index;
        }

        if (isOpeningTag) {
          if (!currentlyOpenTagName) {
            currentlyOpenTagName = tagName;
            currentlyOpenTagAttributes = attributes;
            currentlyOpenTagCount++;
            currentIndex += tagLength;
          } else if (isSameAsCurrent) {
            currentlyOpenTagCount++;
          }
        } else if (isClosingTag && isSameAsCurrent) {
          currentlyOpenTagCount--;
          if (currentlyOpenTagCount === 0) {
            processTag(match.index, currentlyOpenTagName, currentlyOpenTagAttributes, tagLength);
            currentlyOpenTagName       = null;
            currentlyOpenTagAttributes = null;
          }
        } else if (!currentlyOpenTagName) {
          processTag(match.index, tagName, attributes, tagLength);
        }
      }
      if (currentlyOpenTagName) {
        processTag(str.length, currentlyOpenTagName, currentlyOpenTagAttributes);
      }
      result += str.slice(currentIndex);
      return result;
    }

    function numberOrIndex(str, n, from) {
      if (isString(n)) {
        n = str.indexOf(n);
        if (n === -1) {
          n = from ? str.length : 0;
        }
      }
      return n;
    }

    var encodeBase64, decodeBase64;

    function buildBase64(key) {
      var encodeAscii, decodeAscii;

      function catchEncodingError(fn) {
        return function(str) {
          try {
            return fn(str);
          } catch(e) {
            return '';
          }
        }
      }

      if (typeof Buffer !== 'undefined') {
        encodeBase64 = function(str) {
          return new Buffer(str).toString('base64');
        }
        decodeBase64 = function(str) {
          return new Buffer(str, 'base64').toString('utf8');
        }
        return;
      }
      if (typeof btoa !== 'undefined') {
        encodeAscii = catchEncodingError(btoa);
        decodeAscii = catchEncodingError(atob);
      } else {
        var base64reg = /[^A-Za-z0-9\+\/\=]/g;
        encodeAscii = function(str) {
          var output = '';
          var chr1, chr2, chr3;
          var enc1, enc2, enc3, enc4;
          var i = 0;
          do {
            chr1 = str.charCodeAt(i++);
            chr2 = str.charCodeAt(i++);
            chr3 = str.charCodeAt(i++);
            enc1 = chr1 >> 2;
            enc2 = ((chr1 & 3) << 4) | (chr2 >> 4);
            enc3 = ((chr2 & 15) << 2) | (chr3 >> 6);
            enc4 = chr3 & 63;
            if (isNaN(chr2)) {
              enc3 = enc4 = 64;
            } else if (isNaN(chr3)) {
              enc4 = 64;
            }
            output = output + key.charAt(enc1) + key.charAt(enc2) + key.charAt(enc3) + key.charAt(enc4);
            chr1 = chr2 = chr3 = '';
            enc1 = enc2 = enc3 = enc4 = '';
          } while (i < str.length);
          return output;
        }
        decodeAscii = function(input) {
          var output = '';
          var chr1, chr2, chr3;
          var enc1, enc2, enc3, enc4;
          var i = 0;
          if (input.match(base64reg)) {
            return '';
          }
          input = input.replace(/[^A-Za-z0-9\+\/\=]/g, '');
          do {
            enc1 = key.indexOf(input.charAt(i++));
            enc2 = key.indexOf(input.charAt(i++));
            enc3 = key.indexOf(input.charAt(i++));
            enc4 = key.indexOf(input.charAt(i++));
            chr1 = (enc1 << 2) | (enc2 >> 4);
            chr2 = ((enc2 & 15) << 4) | (enc3 >> 2);
            chr3 = ((enc3 & 3) << 6) | enc4;
            output = output + chr(chr1);
            if (enc3 != 64) {
              output = output + chr(chr2);
            }
            if (enc4 != 64) {
              output = output + chr(chr3);
            }
            chr1 = chr2 = chr3 = '';
            enc1 = enc2 = enc3 = enc4 = '';
          } while (i < input.length);
          return output;
        }
      }
      encodeBase64 = function(str) {
        return encodeAscii(unescape(encodeURIComponent(str)));
      }
      decodeBase64 = function(str) {
        return decodeURIComponent(escape(decodeAscii(str)));
      }
    }

    function buildStartEndsWith() {
      var override = true;
      try {
        // If String#startsWith does not exist or alternately if it exists but
        // correctly throws an error here, then there is no need to flag the
        // method to override the existing implementation.
        ''.startsWith(/./);
      } catch(e) {
        override = false;
      }
      extend(String, {


        /***
         * @method startsWith(<find>, [pos] = 0, [case] = true)
         * @returns Boolean
         * @short Returns true if the string starts with <find>.
         * @extra <find> may be either a string or regex. Search begins at [pos], which defaults to the entire string. Case sensitive if [case] is true.
         * @example
         *
         *   'hello'.startsWith('hell')           -> true
         *   'hello'.startsWith(/[a-h]/)          -> true
         *   'hello'.startsWith('HELL')           -> false
         *   'hello'.startsWith('ell', 1)         -> true
         *   'hello'.startsWith('HELL', 0, false) -> true
         *
         ***/
        'startsWith': function(reg) {
          var args = arguments, pos = args[1], c = args[2], str = this, source;
          if(pos) str = str.slice(pos);
          if(isUndefined(c)) c = true;
          source = isRegExp(reg) ? reg.source.replace('^', '') : escapeRegExp(reg);
          return RegExp('^' + source, c ? '' : 'i').test(str);
        },

        /***
         * @method endsWith(<find>, [pos] = length, [case] = true)
         * @returns Boolean
         * @short Returns true if the string ends with <find>.
         * @extra <find> may be either a string or regex. Search ends at [pos], which defaults to the entire string. Case sensitive if [case] is true.
         * @example
         *
         *   'jumpy'.endsWith('py')            -> true
         *   'jumpy'.endsWith(/[q-z]/)         -> true
         *   'jumpy'.endsWith('MPY')           -> false
         *   'jumpy'.endsWith('mp', 4)         -> false
         *   'jumpy'.endsWith('MPY', 5, false) -> true
         *
         ***/
        'endsWith': function(reg) {
          var args = arguments, pos = args[1], c = args[2], str = this, source;
          if(isDefined(pos)) str = str.slice(0, pos);
          if(isUndefined(c)) c = true;
          source = isRegExp(reg) ? reg.source.replace('$', '') : escapeRegExp(reg);
          return RegExp(source + '$', c ? '' : 'i').test(str);
        }
      }, true, function(reg) { return isRegExp(reg) || arguments.length > 2; });
    }

    extend(String, {

      /***
       * @method has(<find>)
       * @returns Boolean
       * @short Returns true if the string matches <find>.
       * @extra <find> may be a string or regex.
       * @example
       *
       *   'jumpy'.has('py')     -> true
       *   'broken'.has(/[a-n]/) -> true
       *   'broken'.has(/[s-z]/) -> false
       *
       ***/
      'has': function(find) {
        return this.search(isRegExp(find) ? find : escapeRegExp(find)) !== -1;
      },

      /***
       * @method repeat([num] = 0)
       * @returns String
       * @short Returns the string repeated [num] times.
       * @example
       *
       *   'jumpy'.repeat(2) -> 'jumpyjumpy'
       *   'a'.repeat(5)     -> 'aaaaa'
       *   'a'.repeat(0)     -> ''
       *
       ***/
      'repeat': function(num) {
        num = checkRepeatRange(num);
        return repeatString(this, num);
      }

    }, true, true);

    extend(String, {

      /***
         * @method escapeRegExp()
         * @returns String
         * @short Escapes all RegExp tokens in the string.
         * @example
         *
         *   'really?'.escapeRegExp()       -> 'really\?'
         *   'yes.'.escapeRegExp()         -> 'yes\.'
         *   '(not really)'.escapeRegExp() -> '\(not really\)'
         *
         ***/
       'escapeRegExp': function() {
         return escapeRegExp(this);
       },

       /***
        * @method escapeURL([param] = false)
        * @returns String
        * @short Escapes characters in a string to make a valid URL.
        * @extra If [param] is true, it will also escape valid URL characters for use as a URL parameter.
        * @example
        *
        *   'http://foo.com/"bar"'.escapeURL()     -> 'http://foo.com/%22bar%22'
        *   'http://foo.com/"bar"'.escapeURL(true) -> 'http%3A%2F%2Ffoo.com%2F%22bar%22'
        *
        ***/
      'escapeURL': function(param) {
        return param ? encodeURIComponent(this) : encodeURI(this);
      },

       /***
        * @method unescapeURL([partial] = false)
        * @returns String
        * @short Restores escaped characters in a URL escaped string.
        * @extra If [partial] is true, it will only unescape non-valid URL characters. [partial] is included here for completeness, but should very rarely be needed.
        * @example
        *
        *   'http%3A%2F%2Ffoo.com%2Fthe%20bar'.unescapeURL()     -> 'http://foo.com/the bar'
        *   'http%3A%2F%2Ffoo.com%2Fthe%20bar'.unescapeURL(true) -> 'http%3A%2F%2Ffoo.com%2Fthe bar'
        *
        ***/
      'unescapeURL': function(param) {
        return param ? decodeURI(this) : decodeURIComponent(this);
      },

       /***
        * @method escapeHTML()
        * @returns String
        * @short Converts HTML characters to their entity equivalents.
        * @example
        *
        *   '<p>some text</p>'.escapeHTML() -> '&lt;p&gt;some text&lt;/p&gt;'
        *   'one & two'.escapeHTML()        -> 'one &amp; two'
        *
        ***/
      'escapeHTML': function() {
        return this.replace(/&/g,  '&amp;' )
                   .replace(/</g,  '&lt;'  )
                   .replace(/>/g,  '&gt;'  )
                   .replace(/"/g,  '&quot;')
                   .replace(/'/g,  '&apos;')
                   .replace(/\//g, '&#x2f;');
      },

       /***
        * @method unescapeHTML([partial] = false)
        * @returns String
        * @short Restores escaped HTML characters.
        * @example
        *
        *   '&lt;p&gt;some text&lt;/p&gt;'.unescapeHTML() -> '<p>some text</p>'
        *   'one &amp; two'.unescapeHTML()                -> 'one & two'
        *
        ***/
      'unescapeHTML': function() {
        return convertHTMLCodes(this)
                   .replace(/&lt;/g,   '<')
                   .replace(/&gt;/g,   '>')
                   .replace(/&nbsp;/g, ' ')
                   .replace(/&quot;/g, '"')
                   .replace(/&apos;/g, "'")
                   .replace(/&amp;/g,  '&');
      },

       /***
        * @method encodeBase64()
        * @returns String
        * @short Encodes the string into base64 encoding.
        * @extra This method wraps native methods when available, and uses a custom implementation when not available. It can also handle Unicode string encodings.
        * @example
        *
        *   'gonna get encoded!'.encodeBase64()  -> 'Z29ubmEgZ2V0IGVuY29kZWQh'
        *   'http://twitter.com/'.encodeBase64() -> 'aHR0cDovL3R3aXR0ZXIuY29tLw=='
        *
        ***/
      'encodeBase64': function() {
        return encodeBase64(this);
      },

       /***
        * @method decodeBase64()
        * @returns String
        * @short Decodes the string from base64 encoding.
        * @extra This method wraps native methods when available, and uses a custom implementation when not available. It can also handle Unicode string encodings.
        * @example
        *
        *   'aHR0cDovL3R3aXR0ZXIuY29tLw=='.decodeBase64() -> 'http://twitter.com/'
        *   'anVzdCBnb3QgZGVjb2RlZA=='.decodeBase64()     -> 'just got decoded!'
        *
        ***/
      'decodeBase64': function() {
        return decodeBase64(this);
      },

      /***
       * @method each([search], [fn])
       * @returns Array
       * @short Runs callback [fn] against each occurence of [search] or each character if [search] is not provided.
       * @extra Returns an array of matches. [search] may be either a string or regex, and defaults to every character in the string. If [fn] returns false at any time it will break out of the loop.
       * @example
       *
       *   'jumpy'.each() -> ['j','u','m','p','y']
       *   'jumpy'.each(/[r-z]/) -> ['u','y']
       *   'jumpy'.each(/[r-z]/, function(m) {
       *     // Called twice: "u", "y"
       *   });
       *
       ***/
      'each': function(search, fn) {
        return stringEach(this, search, fn);
      },

      /***
       * @method map(<fn>, [scope])
       * @returns String
       * @short Maps the string to another string containing the values that are the result of calling <fn> on each element.
       * @extra [scope] is the %this% object. <fn> is a function, it receives three arguments: the current character, the current index, and a reference to the string.
       * @example
       *
       *   'jumpy'.map(function(l) {
       *     return String.fromCharCode(l.charCodeAt(0) + 1);
       *
       *   }); -> Returns the string with each character shifted one code point down.
       *
       ***/
      'map': function(map, scope) {
        var str = this.toString();
        if (isFunction(map)) {
          var fn = map;
          map = function(letter, i, arr) {
            return fn.call(scope, letter, i, str);
          }
        }
        return str.split('').map(map, scope).join('');
      },

      /***
       * @method shift(<n>)
       * @returns Array
       * @short Shifts each character in the string <n> places in the character map.
       * @example
       *
       *   'a'.shift(1)  -> 'b'
       *   'ク'.shift(1) -> 'グ'
       *
       ***/
      'shift': function(n) {
        return shiftChar(this, n);
      },

      /***
       * @method codes([fn])
       * @returns Array
       * @short Runs callback [fn] against each character code in the string. Returns an array of character codes.
       * @example
       *
       *   'jumpy'.codes() -> [106,117,109,112,121]
       *   'jumpy'.codes(function(c) {
       *     // Called 5 times: 106, 117, 109, 112, 121
       *   });
       *
       ***/
      'codes': function(fn) {
        return stringCodes(this, fn);
      },

      /***
       * @method chars([fn])
       * @returns Array
       * @short Runs callback [fn] against each character in the string. Returns an array of characters.
       * @example
       *
       *   'jumpy'.chars() -> ['j','u','m','p','y']
       *   'jumpy'.chars(function(c) {
       *     // Called 5 times: "j","u","m","p","y"
       *   });
       *
       ***/
      'chars': function(fn) {
        return stringEach(this, fn);
      },

      /***
       * @method words([fn])
       * @returns Array
       * @short Runs callback [fn] against each word in the string. Returns an array of words.
       * @extra A "word" here is defined as any sequence of non-whitespace characters.
       * @example
       *
       *   'broken wear'.words() -> ['broken','wear']
       *   'broken wear'.words(function(w) {
       *     // Called twice: "broken", "wear"
       *   });
       *
       ***/
      'words': function(fn) {
        return eachWord(this, fn);
      },

      /***
       * @method lines([fn])
       * @returns Array
       * @short Runs callback [fn] against each line in the string. Returns an array of lines.
       * @example
       *
       *   'broken wear\nand\njumpy jump'.lines() -> ['broken wear','and','jumpy jump']
       *   'broken wear\nand\njumpy jump'.lines(function(l) {
       *     // Called three times: "broken wear", "and", "jumpy jump"
       *   });
       *
       ***/
      'lines': function(fn) {
        return stringEach(this.trim(), /^.*$/gm, fn);
      },

      /***
       * @method paragraphs([fn])
       * @returns Array
       * @short Runs callback [fn] against each paragraph in the string. Returns an array of paragraphs.
       * @extra A paragraph here is defined as a block of text bounded by two or more line breaks.
       * @example
       *
       *   'Once upon a time.\n\nIn the land of oz...'.paragraphs() -> ['Once upon a time.','In the land of oz...']
       *   'Once upon a time.\n\nIn the land of oz...'.paragraphs(function(p) {
       *     // Called twice: "Once upon a time.", "In teh land of oz..."
       *   });
       *
       ***/
      'paragraphs': function(fn) {
        var paragraphs = this.trim().split(/[\r\n]{2,}/);
        paragraphs = paragraphs.map(function(p) {
          if (fn) var s = fn.call(p);
          return s ? s : p;
        });
        return paragraphs;
      },

      /***
       * @method isBlank()
       * @returns Boolean
       * @short Returns true if the string has a length of 0 or contains only whitespace.
       * @example
       *
       *   ''.isBlank()      -> true
       *   '   '.isBlank()   -> true
       *   'noway'.isBlank() -> false
       *
       ***/
      'isBlank': function() {
        return isBlank(this);
      },

      /***
       * @method add(<str>, [index] = length)
       * @returns String
       * @short Adds <str> at [index]. Negative values are also allowed.
       * @extra %insert% is provided as an alias, and is generally more readable when using an index.
       * @example
       *
       *   'schfifty'.add(' five')      -> schfifty five
       *   'dopamine'.insert('e', 3)       -> dopeamine
       *   'spelling eror'.insert('r', -3) -> spelling error
       *
       ***/
      'add': function(str, index) {
        index = isUndefined(index) ? this.length : index;
        return this.slice(0, index) + str + this.slice(index);
      },

      /***
       * @method remove(<f>)
       * @returns String
       * @short Removes any part of the string that matches <f>.
       * @extra <f> can be a stringuor a regex. When it is a string only the first match will be removed.
       * @example
       *
       *   'schfifty five'.remove('f')      -> 'schifty five'
       *   'schfifty five'.remove(/f/g)     -> 'schity ive'
       *   'schfifty five'.remove(/[a-f]/g) -> 'shity iv'
       *
       ***/
      'remove': function(f) {
        return this.replace(f, '');
      },

      /***
       * @method reverse()
       * @returns String
       * @short Reverses the string.
       * @example
       *
       *   'jumpy'.reverse()        -> 'ypmuj'
       *   'lucky charms'.reverse() -> 'smrahc ykcul'
       *
       ***/
      'reverse': function() {
        return reverseString(this);
      },

      /***
       * @method compact()
       * @returns String
       * @short Compacts all white space in the string to a single space and trims the ends.
       * @example
       *
       *   'too \n much \n space'.compact() -> 'too much space'
       *   'enough \n '.compact()           -> 'enought'
       *
       ***/
      'compact': function() {
        return this.trim().replace(/([\r\n\s　])+/g, function(match, whitespace){
          return whitespace === '　' ? whitespace : ' ';
        });
      },

      /***
       * @method at(<index>, [loop] = true)
       * @returns String or Array
       * @short Gets the character(s) at a given index.
       * @extra When [loop] is true, overshooting the end of the string (or the beginning) will begin counting from the other end. As an alternate syntax, passing multiple indexes will get the characters at those indexes.
       * @example
       *
       *   'jumpy'.at(0)               -> 'j'
       *   'jumpy'.at(2)               -> 'm'
       *   'jumpy'.at(5)               -> 'j'
       *   'jumpy'.at(5, false)        -> ''
       *   'jumpy'.at(-1)              -> 'y'
       *   'lucky charms'.at(2,4,6,8) -> ['u','k','y',c']
       *
       ***/
      'at': function() {
        // Optimized: no leaking arguments
        var args = [], $i; for($i = 0; $i < arguments.length; $i++) args.push(arguments[$i]);
        return getEntriesForIndexes(this, args, true);
      },

      /***
       * @method from([index] = 0)
       * @returns String
       * @short Returns a section of the string starting from [index].
       * @example
       *
       *   'lucky charms'.from()   -> 'lucky charms'
       *   'lucky charms'.from(7)  -> 'harms'
       *
       ***/
      'from': function(from) {
        return stringFrom(this, from);
      },

      /***
       * @method to([index] = end)
       * @returns String
       * @short Returns a section of the string ending at [index].
       * @example
       *
       *   'lucky charms'.to()   -> 'lucky charms'
       *   'lucky charms'.to(7)  -> 'lucky ch'
       *
       ***/
      'to': function(to) {
        return stringTo(this, to);
      },

      /***
       * @method dasherize()
       * @returns String
       * @short Converts underscores and camel casing to hypens.
       * @example
       *
       *   'a_farewell_to_arms'.dasherize() -> 'a-farewell-to-arms'
       *   'capsLock'.dasherize()           -> 'caps-lock'
       *
       ***/
      'dasherize': function() {
        return underscore(this).replace(/_/g, '-');
      },

      /***
       * @method underscore()
       * @returns String
       * @short Converts hyphens and camel casing to underscores.
       * @example
       *
       *   'a-farewell-to-arms'.underscore() -> 'a_farewell_to_arms'
       *   'capsLock'.underscore()           -> 'caps_lock'
       *
       ***/
      'underscore': function() {
        return underscore(this);
      },

      /***
       * @method camelize([first] = true)
       * @returns String
       * @short Converts underscores and hyphens to camel case. If [first] is true the first letter will also be capitalized.
       * @extra If the Inflections package is included acryonyms can also be defined that will be used when camelizing.
       * @example
       *
       *   'caps_lock'.camelize()              -> 'CapsLock'
       *   'moz-border-radius'.camelize()      -> 'MozBorderRadius'
       *   'moz-border-radius'.camelize(false) -> 'mozBorderRadius'
       *
       ***/
      'camelize': function(first) {
        return underscore(this).replace(/(^|_)([^_]+)/g, function(match, pre, word, index) {
          var acronym = getAcronym(word), cap = first !== false || index > 0;
          if (acronym) return cap ? acronym : acronym.toLowerCase();
          return cap ? capitalize(word) : word;
        });
      },

      /***
       * @method spacify()
       * @returns String
       * @short Converts camel case, underscores, and hyphens to a properly spaced string.
       * @example
       *
       *   'camelCase'.spacify()                         -> 'camel case'
       *   'an-ugly-string'.spacify()                    -> 'an ugly string'
       *   'oh-no_youDid-not'.spacify().capitalize(true) -> 'something else'
       *
       ***/
      'spacify': function() {
        return spacify(this);
      },

      /***
       * @method stripTags([tag1], [tag2], ...)
       * @returns String
       * @short Strips HTML tags from the string.
       * @extra Tags to strip may be enumerated in the parameters, otherwise will strip all. A single function may be passed to this method as the final argument which will allow case by case replacements. This function arguments are the tag name, tag content, tag attributes, and the string itself. If this function returns a string, then it will be used for the replacement. If it returns %undefined%, the tags will be stripped normally.
       * @example
       *
       *   '<p>just <b>some</b> text</p>'.stripTags()    -> 'just some text'
       *   '<p>just <b>some</b> text</p>'.stripTags('p') -> 'just <b>some</b> text'
       *   '<p>hi!</p>'.stripTags('p', function(tag, content) {
       *     return '|' + content + '|';
       *   }); -> '|hi!|'
       *
       ***/
      'stripTags': function() {
        // Optimized: no leaking arguments (flat)
        var args = [], $i; for($i = 0; $i < arguments.length; $i++) args = args.concat(arguments[$i]);
        return replaceTags(this, args, true);
      },

      /***
       * @method removeTags([tag1], [tag2], ...)
       * @returns String
       * @short Removes HTML tags and their contents from the string.
       * @extra Tags to remove may be enumerated in the parameters, otherwise will remove all. A single function may be passed to this method as the final argument which will allow case by case replacements. This function arguments are the tag name, tag content, tag attributes, and the string itself. If this function returns a string, then it will be used for the replacement. If it returns %undefined%, the tags will be removed normally.
       * @example
       *
       *   '<p>just <b>some</b> text</p>'.removeTags()    -> ''
       *   '<p>just <b>some</b> text</p>'.removeTags('b') -> '<p>just text</p>'
       *   '<p>hi!</p>'.removeTags('p', function(tag, content) {
       *     return 'bye!';
       *   }); -> 'bye!'
       *
       ***/
      'removeTags': function() {
        // Optimized: no leaking arguments (flat)
        var args = [], $i; for($i = 0; $i < arguments.length; $i++) args = args.concat(arguments[$i]);
        return replaceTags(this, args, false);
      },

      /***
       * @method truncate(<length>, [from] = 'right', [ellipsis] = '...')
       * @returns String
       * @short Truncates a string.
       * @extra [from] can be %'right'%, %'left'%, or %'middle'%. If the string is shorter than <length>, [ellipsis] will not be added.
       * @example
       *
       *   'sittin on the dock of the bay'.truncate(18)           -> 'just sittin on the do...'
       *   'sittin on the dock of the bay'.truncate(18, 'left')   -> '...the dock of the bay'
       *   'sittin on the dock of the bay'.truncate(18, 'middle') -> 'just sitt...of the bay'
       *
       ***/
      'truncate': function(length, from, ellipsis) {
        return truncateString(this, length, from, ellipsis);
      },

      /***
       * @method truncateOnWord(<length>, [from] = 'right', [ellipsis] = '...')
       * @returns String
       * @short Truncates a string without splitting up words.
       * @extra [from] can be %'right'%, %'left'%, or %'middle'%. If the string is shorter than <length>, [ellipsis] will not be added.
       * @example
       *
       *   'here we go'.truncateOnWord(5)               -> 'here...'
       *   'here we go'.truncateOnWord(5, 'left')       -> '...we go'
       *
       ***/
      'truncateOnWord': function(length, from, ellipsis) {
        return truncateString(this, length, from, ellipsis, true);
      },

      /***
       * @method pad[Side](<num> = null, [padding] = ' ')
       * @returns String
       * @short Pads the string out with [padding] to be exactly <num> characters.
       *
       * @set
       *   pad
       *   padLeft
       *   padRight
       *
       * @example
       *
       *   'wasabi'.pad(8)           -> ' wasabi '
       *   'wasabi'.padLeft(8)       -> '  wasabi'
       *   'wasabi'.padRight(8)      -> 'wasabi  '
       *   'wasabi'.padRight(8, '-') -> 'wasabi--'
       *
       ***/
      'pad': function(num, padding) {
        var str = this, half, front, back;
        num   = coercePositiveInteger(num);
        half  = max(0, num - str.length) / 2;
        front = floor(half);
        back  = ceil(half);
        return padString(front, padding) + str + padString(back, padding);
      },

      'padLeft': function(num, padding) {
        var str = this, num = coercePositiveInteger(num);
        return padString(max(0, num - str.length), padding) + str;
      },

      'padRight': function(num, padding) {
        var str = this, num = coercePositiveInteger(num);
        return str + padString(max(0, num - str.length), padding);
      },

      /***
       * @method first([n] = 1)
       * @returns String
       * @short Returns the first [n] characters of the string.
       * @example
       *
       *   'lucky charms'.first()   -> 'l'
       *   'lucky charms'.first(3)  -> 'luc'
       *
       ***/
      'first': function(num) {
        return stringFirst(this, num);
      },

      /***
       * @method last([n] = 1)
       * @returns String
       * @short Returns the last [n] characters of the string.
       * @example
       *
       *   'lucky charms'.last()   -> 's'
       *   'lucky charms'.last(3)  -> 'rms'
       *
       ***/
      'last': function(num) {
        return stringLast(this, num);
      },

      /***
       * @method toNumber([base] = 10)
       * @returns Number
       * @short Converts the string into a number.
       * @extra Any value with a "." fill be converted to a floating point value, otherwise an integer.
       * @example
       *
       *   '153'.toNumber()    -> 153
       *   '12,000'.toNumber() -> 12000
       *   '10px'.toNumber()   -> 10
       *   'ff'.toNumber(16)   -> 255
       *
       ***/
      'toNumber': function(base) {
        return stringToNumber(this, base);
      },

      /***
       * @method capitalize([all] = false)
       * @returns String
       * @short Capitalizes the first character in the string and downcases all other letters.
       * @extra If [all] is true, all words in the string will be capitalized.
       * @example
       *
       *   'hello'.capitalize()           -> 'Hello'
       *   'hello kitty'.capitalize()     -> 'Hello kitty'
       *   'hello kitty'.capitalize(true) -> 'Hello Kitty'
       *
       *
       ***/
      'capitalize': function(all) {
        return capitalize(this, all);
      },

      /***
       * @method assign(<obj1>, <obj2>, ...)
       * @returns String
       * @short Assigns variables to tokens in a string, demarcated with `{}`.
       * @extra If an object is passed, it's properties can be assigned using the object's keys (i.e. {name}). If a non-object (string, number, etc.) is passed it can be accessed by the argument number beginning with {1} (as with regex tokens). Multiple objects can be passed and will be merged together (original objects are unaffected).
       * @example
       *
       *   'Welcome, Mr. {name}.'.assign({ name: 'Franklin' })   -> 'Welcome, Mr. Franklin.'
       *   'You are {1} years old today.'.assign(14)             -> 'You are 14 years old today.'
       *   '{n} and {r}'.assign({ n: 'Cheech' }, { r: 'Chong' }) -> 'Cheech and Chong'
       *
       ***/
      'assign': function() {
        // Optimized: no leaking arguments (flat)
        var args = [], $i; for($i = 0; $i < arguments.length; $i++) args = args.concat(arguments[$i]);
        return stringAssign(this, args);
      },

      /***
       * @method trim[Side]()
       * @returns String
       * @short Removes leading or trailing whitespace from the string.
       * @extra Whitespace is defined as line breaks, tabs, and any character in the "Space, Separator" Unicode category, conforming to the the ES5 spec.
       *
       * @set
       *   trimLeft
       *   trimRight
       *
       * @example
       *
       *   '   wasabi   '.trimLeft()  -> 'wasabi   '
       *   '   wasabi   '.trimRight() -> '   wasabi'
       *
       ***/

      'trimLeft': function() {
        return this.replace(RegExp('^['+getTrimmableCharacters()+']+'), '');
      },

      'trimRight': function() {
        return this.replace(RegExp('['+getTrimmableCharacters()+']+$'), '');
      }

    });

    /***
     * @method insert()
     * @alias add
     *
     ***/
    alias(String, 'insert', 'add');

    buildStartEndsWith();
    buildBase64('ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=');


}).call(this);