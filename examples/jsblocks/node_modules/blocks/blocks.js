/*!
 * jsblocks JavaScript Library v@VERSION
 * http://jsblocks.com/
 *
 * Copyright 2014, Antonio Stoilkov
 * Released under the MIT license
 * http://jsblocks.org/license
 *
 * Date: @DATE
 */
(function(global, factory) {
  if (typeof module === 'object' && typeof module.exports === 'object') {
    module.exports = factory(global, true);
  } else {
    factory(global);
  }

  // Pass this if window is not defined yet
}(typeof window !== 'undefined' ? window : this, function(global, noGlobal) {
  var toString = Object.prototype.toString;
  var slice = Array.prototype.slice;
  var hasOwn = Object.prototype.hasOwnProperty;
  var support = {};
  var core = {};

  /**
  * @namespace blocks
  */
  var blocks = function (value) {
    if (core.expressionsCreated) {
      if (arguments.length === 0) {
        return core.staticExpression;
      }
      return core.createExpression(value);
      //return core.createExpression(blocks.unwrap(value));
    }
    return value;
  };

  blocks.version = '0.3.4';
  blocks.core = core;

  /**
   * Copies properties from all provided objects into the first object parameter
   *
   * @memberof blocks
   * @param {Object} obj
   * @param {...Object} objects
   * @returns {Object}
   */
  blocks.extend = function() {
    var src, copyIsArray, copy, name, options, clone,
      target = arguments[0] || {},
      i = 1,
      length = arguments.length,
      deep = false;

    // Handle a deep copy situation
    if (typeof target === 'boolean') {
      deep = target;
      target = arguments[1] || {};
      // skip the boolean and the target
      i = 2;
    }

    // Handle case when target is a string or something (possible in deep copy)
    if (typeof target !== 'object' && !blocks.isFunction(target)) {
      target = {};
    }

    for (; i < length; i++) {
      // Only deal with non-null/undefined values
      if ((options = arguments[i]) != null) {
        // Extend the base object
        for (name in options) {
          src = target[name];
          copy = options[name];

          // Prevent never-ending loop
          if (target === copy) {
            continue;
          }

          // Recurse if we're merging plain objects or arrays
          if (deep && copy && (blocks.isPlainObject(copy) || (copyIsArray = blocks.isArray(copy)))) {
            if (copyIsArray) {
              copyIsArray = false;
              clone = src && blocks.isArray(src) ? src : [];
            } else {
              clone = src && blocks.isPlainObject(src) ? src : {};
            }

            // Never move original objects, clone them
            target[name] = blocks.extend(deep, clone, copy);

          } else {
            target[name] = copy;
          }
        }
      }
    }

    // Return the modified object
    return target;
  };

  /**
   * @callback iterateCallback
   * @param {*} value - The value
   * @param {(number|string)} indexOrKey - Index or key
   * @param {(Array|Object)} collection - The collection that is being iterated
   */

  /**
   * Iterates over the collection
   *
   * @memberof blocks
   * @param {(Array|Object)} collection - The array or object to iterate over
   * @param {Function} callback - The callback that will be executed for each element in the collection
   * @param {*} [thisArg] - Optional this context for the callback
   *
   * @example {javascript}
   * blocks.each([3, 1, 4], function (value, index, collection) {
   *   // value is the current item (3, 1 and 4)
   *   // index is the current index (0, 1 and 2)
   *   // collection points to the array passed to the function - [3, 1, 4]
   * });
   */
  blocks.each = function(collection, callback, thisArg) {
    if (collection == null) {
      return;
    }

    var length = collection.length;
    var indexOrKey = -1;
    var isArray = typeof length == 'number';

    callback = parseCallback(callback, thisArg);

    if (isArray) {
      while (++indexOrKey < length) {
        if (callback(collection[indexOrKey], indexOrKey, collection) === false) {
          break;
        }
      }
    } else {
      for (indexOrKey in collection) {
        if (callback(collection[indexOrKey], indexOrKey, collection) === false) {
          break;
        }
      }
    }
  };

  /**
   * Iterates over the collection from end to start
   *
   * @memberof blocks
   * @param {(Array|Object)} collection - The array or object to iterate over
   * @param {Function} callback - The callback that will be executed for each element in the collection
   * @param {*} [thisArg] - Optional this context for the callback
   *
   * @example {javascript}
   * blocks.eachRight([3, 1, 4], function (value, index, collection) {
   *   // value is the current item (4, 1 and 3)
   *   // index is the current index (2, 1 and 0)
   *   // collection points to the array passed to the function - [3, 1, 4]
   * });
   */
  blocks.eachRight = function(collection, callback, thisArg) {
    if (collection == null) {
      return;
    }

    var length = collection.length,
      indexOrKey = collection.length,
      isCollectionAnArray = typeof length == 'number';

    callback = parseCallback(callback, thisArg);

    if (isCollectionAnArray) {
      while (--indexOrKey >= 0) {
        callback(collection[indexOrKey], indexOrKey, collection);
      }
    } else {
      for (indexOrKey in collection) {
        callback(collection[indexOrKey], indexOrKey, collection);
      }
    }
  };

  blocks.each(['Arguments', 'Function', 'String', 'Number', 'Date', 'RegExp'], function(type) {
    blocks['is' + type] = function(obj) {
      return toString.call(obj) == '[object ' + type + ']';
    };
  });

  // Define a fallback version of the method in browsers (ahem, IE), where
  // there isn't any inspectable 'Arguments' type.
  if (!blocks.isArguments(arguments)) {
    blocks.isArguments = function(obj) {
      return !!(obj && hasOwn.call(obj, 'callee'));
    };
  }

  // Optimize `isFunction` if appropriate.
  if (typeof(/./) !== 'function') {
    blocks.isFunction = function(obj) {
      return !!(obj && typeof obj === 'function');
    };
  }

  /**
   * Determines if a value is an array.
   * Returns false for array like objects (for example arguments object)
   *
   * @memberof blocks
   * @param {*} value - The value to check if it is an array
   * @returns {boolean} - Whether the value is an array
   *
   * @example {javascript}
   * blocks.isArray([1, 2, 3]);
   * // -> true
   *
   * function calculate() {
   *   blocks.isArray(arguments);
   *   // -> false
   * }
   */
  blocks.isArray = Array.isArray || function(value) {
    return toString.call(value) == '[object Array]';
  };

  blocks.extend(blocks, {

    /**
     * Represents a dummy empty function
     *
     * @memberof blocks
     * @returns {Function} - Empty function
     *
     * @example {javascript}
     * function max(collection, callback) {
     *   callback = callback || blocks.noop;
     * }
     */
    noop: function() {},

    inherit: function(BaseClass, Class, prototype) {
      if ((arguments.length < 3 && blocks.isPlainObject(Class)) || arguments.length == 1) {
        prototype = Class;
        Class = BaseClass;
        BaseClass = undefined;
      }

      if (BaseClass) {
        Class.prototype = objectCreate(BaseClass.prototype);
        Class.prototype.constructor = Class;
        blocks.extend(Class.prototype, prototype);
        Class.prototype.__Class__ = BaseClass;
        Class.prototype._super = _super;
      } else if (prototype) {
        Class.prototype = prototype;
      }

      return Class;
    },

    /**
     * Determines the true type of an object
     *
     * @memberof blocks
     * @param {*} value - The value for which to determine its type
     * @returns {string} - Returns the type of the value as a string
     *
     * @example {javascript}
     * blocks.type('a string');
     * // -> string
     *
     * blocks.type(314);
     * // -> number
     *
     * blocks.type([]);
     * // -> array
     *
     * blocks.type({});
     * // -> object
     *
     * blocks.type(blocks.noop);
     * // -> function
     *
     * blocks.type(new RegExp());
     * // -> regexp
     *
     * blocks.type(undefined);
     * // -> undefined
     *
     * blocks.type(null);
     * // -> null
     */
    type: function(value) {
      if (value instanceof Array) {
        return 'array';
      }
      if (typeof value == 'string' || value instanceof String) {
        return 'string';
      }
      if (typeof value == 'number' || value instanceof Number) {
        return 'number';
      }
      if (value instanceof Date) {
        return 'date';
      }
      if (toString.call(value) === '[object RegExp]') {
        return 'regexp';
      }
      if (value === null) {
        return 'null';
      }
      if (value === undefined) {
        return 'undefined';
      }

      if (blocks.isFunction(value)) {
        return 'function';
      }

      if (blocks.isBoolean(value)) {
        return 'boolean';
      }

      return 'object';
    },

    /**
     * Determines if a specific value is the specified type
     *
     * @memberof blocks
     * @param {*} value - The value
     * @param {string} type - The type
     * @returns {boolean} - If the value is from the specified type
     *
     * @example {javascript}
     * blocks.is([], 'array');
     * // -> true
     *
     * blocks.is(function () {}, 'object');
     * // -> false
     */
    is: function(value, type) {
      if (arguments.length > 1 && blocks.isFunction(type)) {
        return type.prototype.isPrototypeOf(value);
      }
      return blocks.type(value) == type;
    },

    /**
     * Checks if a variable has the specified property.
     * Uses hasOwnProperty internally
     *
     * @memberof blocks
     * @param {*} obj - The object to call hasOwnPrototype for
     * @param {String} key - The key to check if exists in the object
     * @returns {boolean} Returns if the key exists in the provided object
     *
     * @example {javascript}
     * blocks.has({
     *   price: undefined
     * }, 'price');
     * // -> true
     *
     * blocks.has({
     *   price: 314
     * }, 'ratio');
     * // -> false
     */
    has: function(obj, key) {
      return !!(obj && hasOwn.call(obj, key));
    },

    hasValue: function(value) {
      return value != null && (!blocks.isNumber(value) || !isNaN(value));
    },

    toString: function(value) {
      // TODO: Implement and make tests
      var result = '';
      if (blocks.hasValue(value)) {
        result = value.toString();
      }
      return result;
    },

    /**
     * Unwraps a jsblocks value to its raw representation.
     * Unwraps blocks.observable() and blocks() values
     *
     * @memberof blocks
     * @param {*} value - The value that will be unwrapped
     * @returns {*} The unwrapped value
     *
     * @example {javascript}
     * blocks.unwrap(blocks.observable(314));
     * // -> 314
     *
     * blocks.unwrap(blocks([3, 1, 4]));
     * // -> [3, 1, 4]
     *
     * blocks.unwrap('a string or any other value will not be changed');
     * // -> 'a string or any other value will not be changed'
     */
    unwrap: function(value) {
      if (core.expressionsCreated && core.isExpression(value)) {
        return value.value();
      }

      if (blocks.unwrapObservable) {
        return blocks.unwrapObservable(value);
      }
      return value;
    },

    /**
     * Unwraps a jQuery instance and returns the first element
     *
     * @param {*} element - If jQuery element is specified it will be unwraped
     * @returns {*} - The unwraped value
     *
     * @example {javascript}
     * var articles = $('.article');
     * blocks.$unwrap()
     */
    $unwrap: function(element, callback, thisArg) {
      callback = parseCallback(callback, thisArg);

      if (element && element.jquery) {
        if (callback) {
          element.each(function () {
            callback(this);
          });
        }
        element = element[0];
      } else {
        if (callback) {
          callback(element);
        }
      }

      return element;
    },

    /**
     * Converts a value to an array. Arguments object is converted to array
     * and primitive values are wrapped in an array. Does nothing when value
     * is already an array
     *
     * @memberof blocks
     * @param {*} value - The value to be converted to an array
     * @returns {Array} - The array
     *
     * @example {javascript}
     * blocks.toArray(3);
     * // -> [3]
     *
     * function calculate() {
     *   var numbers = blocks.toArray(arguments);
     * }
     *
     * blocks.toArray([3, 1, 4]);
     * // -> [3, 1, 4]
     */
    toArray: function(value) {
      // TODO: Think if it should be removed permanantely.
      // Run tests after change to observe difference
      //if (value == null) {
      //    return [];
      //}
      if (blocks.isArguments(value)) {
        return slice.call(value);
      }
      if (blocks.isElements(value)) {
        // TODO: if not IE8 and below use slice.call
        /* jshint newcap: false */
        var result = Array(value.length);
        var index = -1;
        var length = value.length;
        while (++index < length) {
          result[index] = value[index];
        }
        return result;
      }
      if (!blocks.isArray(value)) {
        return [value];
      }
      return value;
    },

    /**
     * Converts an integer or string to a unit.
     * If the value could not be parsed to a number it is not converted
     *
     * @memberof blocks
     * @param {[type]} value - The value to be converted to the specified unit
     * @param {String} [unit='px'] - Optionally provide a unit to convert to.
     * Default value is 'px'
     *
     * @example {javascript}
     *
     * blocks.toUnit(230);
     * // -> 230px
     *
     * blocks.toUnit(230, '%');
     * // -> 230%
     *
     * blocks.toUnit('60px', '%');
     * // -> 60%
     */
    toUnit: function(value, unit) {
      var unitIsSpecified = unit;
      unit = unit || 'px';

      if (blocks.isNaN(parseFloat(value))) {
        return value;
      }

      if (blocks.isString(value) && blocks.isNaN(parseInt(value.charAt(value.length - 1), 10))) {
        if (unitIsSpecified) {
          return value.replace(/[^0-9]+$/, unit);
        }
        return value;
      }
      return value + unit;
    },

    /**
     * Clones value. If deepClone is set to true the value will be cloned recursively
     *
     * @memberof blocks
     * @param {*} value -
     * @param {boolean} [deepClone] - Description
     * @returns {*} Description
     *
     * @example {javascript}
     * var array = [3, 1, 4];
     * var cloned = blocks.clone(array);
     * // -> [3, 1, 4]
     * var areEqual = array == cloned;
     * // -> false
     */
    clone: function(value, deepClone) {
      if (value == null) {
        return value;
      }

      var type = blocks.type(value);
      var clone;
      var key;

      if (type == 'array') {
        return value.slice(0);
      } else if (type == 'object') {
        if (value.constructor === Object) {
          clone = {};
        } else {
          clone = new value.constructor();
        }

        for (key in value) {
          clone[key] = deepClone ? blocks.clone(value[key], true) : value[key];
        }
        return clone;
      } else if (type == 'date') {
        return new Date(value.getFullYear(), value.getMonth(), value.getDate(),
          value.getHours(), value.getMinutes(), value.getSeconds(), value.getMilliseconds());
      } else if (type == 'string') {
        return value.toString();
      } else if (type == 'regexp') {
        var flags = '';
        if (value.global) {
          flags += 'g';
        }
        if (value.ignoreCase) {
          flags += 'i';
        }
        if (value.multiline) {
          flags += 'm';
        }
        clone = new RegExp(value.source, flags);
        clone.lastIndex = value.lastIndex;
        return clone;
      }

      return value;
    },

    /**
     * Determines if the specified value is a HTML elements collection
     *
     * @memberof blocks
     * @param {*} value - The value to check if it is elements collection
     * @returns {boolean} - Returns whether the value is elements collection
     */
    isElements: function(value) {
      var isElements = false;
      if (value) {
        if (typeof HTMLCollection != 'undefined') {
          isElements = value instanceof window.HTMLCollection;
        }
        if (typeof NodeList != 'undefined' && !isElements) {
          isElements = value instanceof NodeList;
        }
        if (!isElements && blocks.isString(value.item)) {
          try {
            value.item(0);
            isElements = true;
          } catch (e) {}
        }
      }
      return isElements;
    },

    /**
     * Determines if the specified value is a HTML element
     *
     * @memberof blocks
     * @param {*} value - The value to check if it is a HTML element
     * @returns {boolean} - Returns whether the value is a HTML element
     *
     * @example {javascript}
     * blocks.isElement(document.body);
     * // -> true
     *
     * blocks.isElement({});
     * // -> false
     */
    isElement: function(value) {
      return !!(value && value.nodeType === 1);
    },

    /**
     * Determines if a the specified value is a boolean.
     *
     * @memberof blocks
     * @param {*} value - The value to be checked if it is a boolean
     * @returns {boolean} - Whether the value is a boolean or not
     *
     * @example {javascript}
     * blocks.isBoolean(true);
     * // -> true
     *
     * blocks.isBoolean(new Boolean(false));
     * // -> true
     *
     * blocks.isBoolean(1);
     * // -> false
     */
    isBoolean: function(value) {
      return value === true || value === false || toString.call(value) == '[object Boolean]';
    },

    /**
     * Determines if the specified value is an object
     *
     * @memberof blocks
     * @param {[type]} obj - The value to check for if it is an object
     * @returns {boolean} - Returns whether the value is an object
     */
    isObject: function(obj) {
      return obj === Object(obj);
    },

    /**
     * Determines if a value is a object created using {} or new Object
     *
     * @memberof blocks
     * @param {*} obj - The value that will be checked
     * @returns {boolean} - Whether the value is a plain object or not
     *
     * @example {javascript}
     * blocks.isPlainObject({ property: true });
     * // -> true
     *
     * blocks.isPlainObject(new Object());
     * // -> true
     *
     * function Car () {
     *
     * }
     *
     * blocks.isPlainObject(new Car());
     * // -> false
     */
    isPlainObject: function(obj) {
      var key;

      // Must be an Object.
      // Because of IE, we also have to check the presence of the constructor property.
      // Make sure that DOM nodes and window objects don't pass through, as well
      if (!obj || typeof obj !== 'object' || toString.call(obj) !== '[object Object]' || obj.nodeType || obj.window == obj) {
        return false;
      }

      try {
        // Not own constructor property must be Object
        if (obj.constructor && !hasOwn.call(obj, 'constructor') && !hasOwn.call(obj.constructor.prototype, 'isPrototypeOf')) {
          return false;
        }
      } catch (e) {
        // IE8,9 Will throw exceptions on certain host objects #9897
        return false;
      }

      // Support: IE<9
      // Handle iteration over inherited properties before own properties.
      if (support.ownPropertiesAreLast) {
        for (key in obj) {
          return hasOwn.call(obj, key);
        }
      }

      // Own properties are enumerated firstly, so to speed up,
      // if last one is own, then all properties are own.
      // jshint noempty: false
      // Disable JSHint error: Empty blocks. This option warns when you have an empty block in your code.
      for (key in obj) {}

      return key === undefined || hasOwn.call(obj, key);
    },

    isFinite: function(value) {
      return isFinite(value) && !blocks.isNaN(parseFloat(value));
    },

    isNaN: function(value) {
      return blocks.isNumber(value) && value != +value;
    },

    isNull: function(value) {
      return value === null;
    },

    isUndefined: function(value) {
      return value === undefined;
    },

    nothing: {},

    access: function(obj, path, defaultValue) {
      var index = 0;
      var name;

      defaultValue = arguments.length > 2 ? defaultValue : blocks.nothing;
      path = path.split('.');
      name = path[0];

      while (name) {
        if (obj == null) {
          return defaultValue;
        }
        obj = obj[name];
        name = path[++index];
      }
      return obj;
    },

    swap: function(array, indexA, indexB) {
      var length = array.length;
      if (indexA >= 0 && indexB >= 0 && indexA < length && indexB < length) {
        array[indexA] = array[indexB] + (array[indexB] = array[indexA], 0);
      }
      return array;
    },

    move: function(array, sourceIndex, targetIndex) {
      if (sourceIndex != targetIndex) {
        if (sourceIndex <= targetIndex) {
          targetIndex++;
        }
        array.splice(targetIndex, 0, array[sourceIndex]);
        if (sourceIndex > targetIndex) {
          sourceIndex++;
        }
        array.splice(sourceIndex, 1);
      }
      return array;
    },

    /**
     * Changes the this binding to a function and optionally passes additional parameters to the
     * function
     *
     * @memberof blocks
     * @param {Function} func - The function for which to change the this binding and optionally
     * add arguments
     * @param {*} thisArg - The new this binding context value
     * @param {...*} [args] - Optional arguments that will be passed to the function
     * @returns {Function} - The newly created function having the new this binding and optional
     * arguments
     *
     * @example {javascript}
     * var alert = blocks.bind(function () {
     *   alert(this);
     * }, 'Hello bind method!');
     *
     * alert();
     * // -> alerts 'Hello bind method'
     *
     * var alertAll = blocks.bind(function (firstName, lastName) {
     *   alert('My name is ' + firstName + ' ' + lastName);
     * }, null, 'John', 'Doe');
     *
     * alertAll();
     * // -> alerts 'My name is John Doe'
     */
    bind: function(func, thisArg) {
      var Class = function() {};
      var args = slice.call(arguments, 2);
      var bound;

      bound = function() {
        if (!(this instanceof bound)) {
          return func.apply(thisArg, args.concat(slice.call(arguments)));
        }
        Class.prototype = func.prototype;
        var self = new Class();
        //Class.prototype = null;
        var result = func.apply(self, args.concat(slice.call(arguments)));
        if (Object(result) === result) {
          return result;
        }
        return self;
      };
      return bound;
    },

    /**
     * Determines if two values are deeply equal.
     * Set deepEqual to false to stop recusively equality checking
     *
     * @memberof blocks
     * @param {*} a - The first object to be campared
     * @param {*} b - The second object to be compared
     * @param {boolean} [deepEqual] - Determines if the equality check will recursively check all
     * child properties
     * @returns {boolean} - Whether the two values are equal
     *
     * @example {javascript}
     * blocks.equals([3, 4], [3, 4]);
     * // -> true
     *
     * blocks.equals({ value: 7 }, { value: 7, result: 1});
     * // -> false
     */
    equals: function(a, b, deepEqual) {
      // TODO: deepEqual could accept a Number which represents the levels it could go in the recursion
      a = blocks.unwrap(a);
      b = blocks.unwrap(b);
      return equals(a, b, [], [], deepEqual);
    }
  });

  // Internal recursive comparison function for `isEqual`.
  function equals(a, b, aStack, bStack, deepEqual) {
    if (deepEqual !== false) {
      deepEqual = true;
    }

    // Identical objects are equal. `0 === -0`, but they aren't identical.
    // See the [Harmony `egal` proposal](http://wiki.ecmascript.org/doku.php?id=harmony:egal).
    if (a === b) {
      return a !== 0 || 1 / a == 1 / b;
    }

    // A strict comparison is necessary because `null == undefined`.
    if (a == null || b == null) {
      return a === b;
    }

    // Unwrap any wrapped objects.
    if (a instanceof blocks) {
      a = a._wrapped;
    }
    if (b instanceof blocks) {
      b = b._wrapped;
    }

    // Compare `[[Class]]` names.
    var className = toString.call(a);
    if (className != toString.call(b)) {
      return false;
    }

    switch (className) {
      // Strings, numbers, dates, and booleans are compared by value.
      case '[object String]':
        // Primitives and their corresponding object wrappers are equivalent; thus, `'5'` is
        // equivalent to `new String('5')`.
        return a == String(b);
      case '[object Number]':
        // `NaN`s are equivalent, but non-reflexive. An `egal` comparison is performed for
        // other numeric values.
        return a != +a ? b != +b : (a === 0 ? 1 / a == 1 / b : a == +b);
      case '[object Date]':
      case '[object Boolean]':
        // Coerce dates and booleans to numeric primitive values. Dates are compared by their
        // millisecond representations. Note that invalid dates with millisecond representations
        // of `NaN` are not equivalent.
        return +a == +b;
        // RegExps are compared by their source patterns and flags.
      case '[object RegExp]':
        return a.source == b.source &&
          a.global == b.global &&
          a.multiline == b.multiline &&
          a.ignoreCase == b.ignoreCase;
    }

    if (typeof a != 'object' || typeof b != 'object') {
      return false;
    }

    // Assume equality for cyclic structures. The algorithm for detecting cyclic
    // structures is adapted from ES 5.1 section 15.12.3, abstract operation `JO`.
    var length = aStack.length;
    while (length--) {
      // Linear search. Performance is inversely proportional to the number of
      // unique nested structures.
      if (aStack[length] == a) {
        return bStack[length] == b;
      }
    }

    // Objects with different constructors are not equivalent, but `Object`s
    // from different frames are.
    var aCtor = a.constructor,
      bCtor = b.constructor;
    if (aCtor !== bCtor && !(blocks.isFunction(aCtor) && (aCtor instanceof aCtor) &&
        blocks.isFunction(bCtor) && (bCtor instanceof bCtor)) &&
      ('constructor' in a && 'constructor' in b)) {
      return false;
    }

    // Add the first object to the stack of traversed objects.
    aStack.push(a);
    bStack.push(b);

    var size = 0,
      result = true;
    // Recursively compare objects and arrays.
    if (className == '[object Array]') {
      // Compare array lengths to determine if a deep comparison is necessary.
      size = a.length;
      result = size == b.length;
      if (result) {
        // Deep compare the contents, ignoring non-numeric properties.
        while (size--) {
          if (!(result = (deepEqual ? equals(a[size], b[size], aStack, bStack, deepEqual) : a[size] === b[size]))) {
            break;
          }
        }
      }
    } else {
      // Deep compare objects.
      for (var key in a) {
        if (blocks.has(a, key)) {
          // Count the expected number of properties.
          size++;
          // Deep compare each member.
          if (!(result = blocks.has(b, key) && (deepEqual ? equals(a[key], b[key], aStack, bStack, deepEqual) : a[key] === b[key]))) {
            break;
          }
        }
      }
      // Ensure that both objects contain the same number of properties.
      if (result) {
        for (key in b) {
          if (blocks.has(b, key) && !(size--)) {
            break;
          }
        }
        result = !size;
      }
    }

    // Remove the first object from the stack of traversed objects.
    aStack.pop();
    bStack.pop();
    return result;
  }

  blocks.at = function (index) {
    return {
      index: index,
      prototypeIndentification: '__blocks.at__'
    };
  };

  blocks.first = function () {
    return blocks.first;
  };

  blocks.last = function () {
    return blocks.last;
  };

  function _super(name, args) {
    var Class = this.__Class__;
    var result;
    var func;

    if (blocks.isString(name)) {
      func = Class.prototype[name];
    } else {
      args = name;
      func = Class;
    }

    this.__Class__ = Class.prototype.__Class__;
    result = func.apply(this, args || []);
    this.__Class__ = Class;

    return result;
  }

  var objectCreate = Object.create || function(prototype) {
    var Class = function() {};
    Class.prototype = prototype;
    return new Class();
  };

  for (var key in [support]) {
    break;
  }
  support.ownPropertiesAreLast = key != '0';

  function parseCallback(callback, thisArg) {
    if (thisArg != null) {
      var orgCallback = callback;
      callback = function(value, index, collection) {
        return orgCallback.call(thisArg, value, index, collection);
      };
    }
    return callback;
  }

  (function () {
    
(function () {

var customTypes = {};

blocks.debug = {
  enabled: true,

  enable: function () {
    blocks.debug.enabled = true;
  },

  disable: function () {
    blocks.debug.enabled = false;
  },

  addType: function (name, checkCallback) {
    customTypes[name.toLowerCase()] = checkCallback;
  },

  checkArgs: debugFunc(function (method, args, options) {
    if (!blocks.debug.enabled) {
      return;
    }
    if (!options) {
      return;
    }
    var errors = checkMethod(method, args);

    if (errors.length === 0) {
      return;
    }

    blocks.debug.printErrors(method, args, options, errors);
  }),

  printErrors: function (method, args, options, errors) {
    if (!blocks.debug.enabled) {
      return;
    }
    var message = new ConsoleMessage();
    var one = errors.length === 1;
    var firstError = errors[0];

    if (one) {
      message.beginCollapsedGroup();
    } else {
      message.beginGroup();
    }

    message
      .addSpan('Arguments mismatch:', { background: 'yellow'})
      .addText(' ');

    if (one) {
      addError(message, firstError, method, options.paramsNames);
      tryInsertElement(message, options.element);
      addMethodReference(message, method);
    } else {
      message.addText('Multiple errors:');
      tryInsertElement(message, options.element);
      message.newLine();
      for (var i = 0; i < errors.length; i++) {
        message.addText((i + 1) + '. ');
        addError(message, errors[i], method, options.paramsNames);
        message.newLine();
      }
      message.beginCollapsedGroup();
      message.addText('Method reference');
      message.newLine();
      addMethodReference(message, method, true);
      message.endGroup();
    }

    message.endGroup();
    message.print();
  },

  checkQuery: function (name, args, query, element) {
    if (!blocks.debug.enabled || name == 'if' || name == 'ifnot') {
      return;
    }
    var method = blocks.debug.queries[name];
    if (method) {
      blocks.debug.checkArgs(method, args, {
        paramsNames: query.params,
        element: element
      });
    }
  },

  queryNotExists: function (query, element) {
    if (!blocks.debug.enabled) {
      return;
    }
    var message = blocks.debug.Message();
    message.beginSpan({ 'font-weight': 'bold' });
    message.addSpan('Warning:', { background: 'orange', padding: '0 3px' });

    message.addText(' ');
    message.addSpan(query.name, { background: 'red', color: 'white' });
    message.addSpan('(' + query.params.join(', ') + ')', { background: '#EEE' });

    message.addText(' - data-query ');
    message.addSpan(query.name, { background: '#EEE', padding: '0 5px' });
    message.addText(' does not exists');
    tryInsertElement(message, element);
    message.endSpan();

    message.print();
  },

  queryParameterFail: function (query, failedParameter, element) {
    if (!blocks.debug.enabled) {
      return;
    }
    var method = blocks.debug.queries[query.name];
    var message = blocks.debug.Message();
    var params = query.params;
    var param;

    if (!method) {
      return;
    }

    message.beginCollapsedGroup();
    message.beginSpan({ 'font-weight': 'bold' });
    message.addSpan('Critical:', { background: 'red', color: 'white' });
    message.addText(' ');
    message.beginSpan({ background: '#EEE' });
    message.addText(query.name + '(');
    for (var i = 0; i < params.length; i++) {
      param = params[i];
      if (param == failedParameter) {
        message.addSpan(param, { background: 'red', color: 'white' });
      } else {
        message.addText(param);
      }
      if (i != params.length - 1) {
        message.addText(', ');
      }
    }
    message.addText(')');
    message.endSpan();
    message.addText(' - exception thrown while executing query parameter');
    tryInsertElement(message, element);
    addMethodReference(message, method);
    message.endGroup();

    message.print();
  },

  expressionFail: function (expressionText, element) {
    if (!blocks.debug.enabled) {
      return;
    }
    var message = new blocks.debug.Message();

    message.beginSpan({ 'font-weight': 'bold' });
    message.addSpan('Critical:', { background: 'red', color: 'white' });
    message.addText(' ');
    message.addSpan('{{' + expressionText + '}}', { background: 'red', color: 'white' });
    message.addText(' - exception thrown while executing expression');
    message.endSpan();

    tryInsertElement(message, element);

    message.print();
  },

  Message: ConsoleMessage
};

function tryInsertElement(message, element) {
  if (element) {
    //message.addText(' -->');
    message.addText('   ');
    if (blocks.VirtualElement.Is(element)) {
      if (element._el) {
        message.addElement(element._el);
      } else {
        message.addText(element.renderBeginTag());
      }
    } else {
      message.addElement(element);
    }
  }
}

function addMethodReference(message, method, examplesExpanded) {
  var examples = method.examples;

  message
    .newLine()
    .addSpan(method.description, { color: 'green' });

  addMethodSignature(message, method);

  if (examplesExpanded) {
    message.beginGroup();
  } else {
    message.beginCollapsedGroup();
  }

  message
    .addSpan('Usage example' + (examples.length > 1 ? 's' : ''), { color: 'blue' })
    .newLine();

  for (var i = 0; i < method.examples.length;i++) {
    addCodeTree(message, method.examples[i].code);
  }

  message.endGroup();
}

function addCodeTree(message, codeTree) {
  var children = codeTree.children;
  var lines;
  var child;

  message.beginSpan(highlightjs[codeTree.name]);

  for (var i = 0; i < children.length; i++) {
    child = children[i];

    if (typeof child == 'string') {
      message.addText(child.split('\n').join('\n '));
    } else {
      addCodeTree(message, child);
    }
  }

  message.endSpan();
}

function addError(message, error, method, paramNames) {
  var params = method.params;
  var index;

  if (!paramNames) {
    paramNames = [];
    for (index = 0; index < params.length; index++) {
      paramNames.push(params[index].name);
    }
  }

  message.beginSpan({
    'background-color': '#EEE'
  });

  message.addText(method.name + '(');

  if (error) {
    switch (error.type) {
      case 'less-args':
        message.addText(paramNames.slice(0, error.actual).join(', '));
        if (error.actual > 0) {
          message.addText(', ');
        }
        for (index = 0; index < error.expected; index++) {
          message
            .beginSpan({
              'background-color': 'red',
              padding: '0 5px',
              color: 'white'
            })
            .addText('?')
            .endSpan();
          if (index != error.expected - 1) {
            message.addText(', ');
          }
        }
        message.addText(')');
        message.endSpan();
        message.addText(' - less arguments than the required specified');
        break;
      case 'more-args':
        message.addText(paramNames.slice(0, error.expected).join(', '));
        if (error.expected > 0) {
          message.addText(', ');
        }
        for (index = error.expected; index < error.actual; index++) {
          message.addSpan(paramNames[index], {
            'background-color': 'red',
            'text-decoration': 'line-through',
            color: 'white'
          });
          if (index != error.actual - 1) {
            message.addText(', ');
          }
        }
        message.addText(')');
        message.endSpan();
        message.addText(' - ' + (error.actual - error.expected) + ' unnecessary arguments specified');
        break;
      case 'param':
        for (index = 0; index < paramNames.length; index++) {
          if (method.params[index] == error.param) {
            message.addSpan(paramNames[index], {
              'background-color': 'red',
              color: 'white'
            });
          } else {
            message.addText(paramNames[index]);
          }
          if (index != paramNames.length - 1) {
            message.addText(', ');
          }
        }
        message.addText(')');
        message.endSpan();
        message.addText(' - ' + error.actual + ' specified where ' + error.expected + ' expected');
        break;
    }
  } else {
    message.addText(')');
    message.endSpan();
  }
}

function debugFunc(callback) {
  return function () {
    if (blocks.debug.executing) {
      return;
    }
    blocks.debug.executing = true;
    callback.apply(blocks.debug, blocks.toArray(arguments));
    blocks.debug.executing = false;
  };
}

function checkMethod(method, args) {
  var errors = [];

  errors = errors.concat(checkArgsCount(method, args));
  if (errors.length === 0 || errors[0].type == 'more-args') {
    errors = errors.concat(checkArgsTypes(method, args));
  }

  return errors;
}

function checkArgsCount(method, args) {
  var errors = [];
  var requiredCount = 0;
  var hasArguments = false;
  var params = method.params;
  var param;

  for (var i = 0; i < params.length; i++) {
    param = params[i];
    if (!param.optional) {
      requiredCount++;
    }
    if (param.isArguments) {
      hasArguments = true;
    }
  }

  if (args.length < requiredCount) {
    errors.push({
      type: 'less-args',
      actual: args.length,
      expected: requiredCount
    });
  }
  if (!hasArguments && args.length > params.length) {
    errors.push({
      type: 'more-args',
      actual: args.length,
      expected: params.length
    });
  }

  return errors;
}

function getOptionalParamsCount(params) {
  var count = 0;

  for (var i = 0; i < params.length; i++) {
    if (params[i].optional) {
      count++;
    }
  }

  return count;
}

function checkArgsTypes(method, args) {
  var errors = [];
  var params = method.params;
  var maxOptionals = params.length - (params.length - getOptionalParamsCount(method.params));
  var paramIndex = 0;
  var passDetailValues = blocks.queries[method.name].passDetailValues;
  var currentErrors;
  var param;
  var value;

  for (var i = 0; i < args.length; i++) {
    param = params[paramIndex];
    value = args[i];

    if (!param) {
      break;
    }

    if (passDetailValues) {
      value = value.rawValue;
    }

    if (param.optional) {
      if (maxOptionals > 0) {
        currentErrors = checkType(param, value);
        if (currentErrors.length === 0) {
          maxOptionals -= 1;
          if (!param.isArguments) {
            paramIndex += 1;
          }
        }
      }
    } else {
      errors = errors.concat(checkType(param, value));
      if (!param.isArguments) {
        paramIndex += 1;
      }
    }
  }

  return errors;
}

function checkType(param, value) {
  var unwrapedValue = blocks.unwrap(value);
  var errors = [];
  var types = param.types;
  var satisfied = false;
  var valueType;
  var type;

  for (var i = 0; i < types.length; i++) {
    type = types[i].toLowerCase();
    type = type.replace('...', '');

    if (type == '*') {
      satisfied = true;
      break;
    }

    if (type == 'falsy') {
      if (!unwrapedValue) {
        satisfied = true;
        break;
      } else {
        continue;
      }
    } else if (type == 'truthy') {
      if (unwrapedValue) {
        satisfied = true;
        break;
      } else {
        continue;
      }
    } else if (customTypes[type]) {
      satisfied = customTypes[type](value);
      if (satisfied) {
        break;
      } else {
        continue;
      }
    } else if (blocks.isObservable(value)) {
      valueType = 'blocks.observable()';
    } else {
      valueType = blocks.type(value).toLowerCase();
    }

    if (type === valueType) {
      satisfied = true;
      break;
    } else if (valueType == 'blocks.observable()') {
      valueType = blocks.type(blocks.unwrapObservable(value));
      if (type === valueType) {
        satisfied = true;
        break;
      }
    }
  }

  if (!satisfied) {
    errors.push({
      type: 'param',
      param: param,
      actual: valueType,
      expected: types
    });
  }

  return errors;
}

function addMethodSignature(message, method) {
  var params = method.params;
  var paramNames = [];
  var index;

  message
    .newLine()
    .beginSpan({ 'font-size': '15px', 'font-weight': 'bold' })
    .addText(method.name + '(');

  for (index = 0; index < params.length; index++) {
    paramNames.push(params[index].rawName);
  }
  message.addText(paramNames.join(', ') + ')');
  if (method.returns) {
    message.addText(' returns ' + method.returns.types[0]);
    if (method.returns.description) {

    }
  }

  message.endSpan();

  for (index = 0; index < params.length; index++) {
    message
      .newLine()
      .addText('    ' + params[index].rawName + ' {' + params[index].types.join('|') + '} - ' + params[index].description);
  }

  message.newLine();
}

function examples(method) {
  var examples = method.examples;

  if (examples) {
    console.groupCollapsed('%cUsage examples', 'color: blue;');

    for (var i = 0; i < examples.length; i++) {
      console.log(examples[i].code);
      if (i != examples.length - 1) {
        console.log('-------------------------------');
      }
    }

    console.groupEnd();
  }
}

function params(method) {
  var params = method.params;
  for (var i = 0; i < params.length; i++) {
    console.log('    ' + method.params[i].name + ': ' + method.params[i].description);
  }
}

function ConsoleMessage() {
  if (!ConsoleMessage.prototype.isPrototypeOf(this)) {
    return new ConsoleMessage();
  }
  this._rootSpan = {
    styles: {},
    children: [],
    parent: null
  };
  this._currentSpan = this._rootSpan;
}

ConsoleMessage.Support = (function () {
  // https://github.com/jquery/jquery-migrate/blob/master/src/core.js
  function uaMatch( ua ) {
    ua = ua.toLowerCase();

    var match = /(chrome)[ \/]([\w.]+)/.exec( ua ) ||
      /(webkit)[ \/]([\w.]+)/.exec( ua ) ||
      /(opera)(?:.*version|)[ \/]([\w.]+)/.exec( ua ) ||
      /(msie) ([\w.]+)/.exec( ua ) ||
      ua.indexOf("compatible") < 0 && /(mozilla)(?:.*? rv:([\w.]+)|)/.exec( ua ) ||
      [];

    return {
      browser: match[ 1 ] || "",
      version: match[ 2 ] || "0"
    };
  }
  var browserData = uaMatch(navigator.userAgent);

  return {
    isIE: browserData.browser == 'msie' || (browserData.browser == 'mozilla' && parseInt(browserData.version, 10) == 11)
  };
})();

ConsoleMessage.prototype = {
  beginGroup: function () {
    this._currentSpan.children.push({
      type: 'group',
      parent: this._currentSpan
    });
    return this;
  },

  beginCollapsedGroup: function () {
    this._currentSpan.children.push({
      type: 'groupCollapsed'
    });
    return this;
  },

  endGroup: function () {
    this._currentSpan.children.push({
      type: 'groupEnd',
      parent: this._currentSpan
    });
    return this;
  },

  beginSpan: function (styles) {
    var span = {
      type: 'span',
      styles: styles,
      children: [],
      parent: this._currentSpan
    };
    this._currentSpan.children.push(span);
    this._currentSpan = span;
    return this;
  },

  endSpan: function () {
    this._currentSpan = this._currentSpan.parent || this._currentSpan;
    return this;
  },

  addSpan: function (text, styles) {
    this.beginSpan(styles);
    this.addText(text);
    this.endSpan();
    return this;
  },

  addText: function (message) {
    this._currentSpan.children.push({
      type: 'text',
      message: message,
      parent: this._currentSpan
    });
    return this;
  },

  newLine: function (type) {
    this._currentSpan.children.push({
      type: type || 'log',
      parent: this._currentSpan
    });
    return this;
  },

  addImage: function () {
    (function () {
      var faviconUrl = "http://d2c87l0yth4zbw.cloudfront.net/i/_global/favicon.png",
        css = "background-image: url('" + faviconUrl + "');" +
          "background-repeat: no-repeat;" +
          "display: block;" +
          "background-size: 13px 13px;" +
          "padding-left: 13px;" +
          "margin-left: 5px;",
        text = "Do you like coding? Visit www.spotify.com/jobs";
      if (navigator.userAgent.match(/chrome/i)) {
        console.log(text + '%c', css);
      } else {
        console.log('%c   ' + text, css);
      }
    })();
    return this;
  },

  addElement: function (element) {
    this._currentSpan.children.push({
      type: 'element',
      element: element,
      parent: this._currentSpan
    });
    return this;
  },

  print: function () {
    if (typeof console == 'undefined') {
      return;
    }

    var messages = [this._newMessage()];
    var message;

    this._printSpan(this._rootSpan, messages);

    for (var i = 0; i < messages.length; i++) {
      message = messages[i];
      if (message.text && message.text != '%c' && console[message.type]) {
        Function.prototype.apply.call(console[message.type], console, [message.text].concat(message.args));
      }
    }

    return this;
  },

  _printSpan: function (span, messages) {
    var children = span.children;
    var message = messages[messages.length - 1];

    this._addSpanData(span, message);

    for (var i = 0; i < children.length; i++) {
      this._handleChild(children[i], messages);
    }
  },

  _handleChild: function (child, messages) {
    var message = messages[messages.length - 1];

    switch (child.type) {
      case 'group':
        messages.push(this._newMessage('group'));
        break;
      case 'groupCollapsed':
        messages.push(this._newMessage('groupCollapsed'));
        break;
      case 'groupEnd':
        message = this._newMessage('groupEnd');
        message.text = ' ';
        messages.push(message);
        messages.push(this._newMessage())
        break;
      case 'span':
        this._printSpan(child, messages);
        this._addSpanData(child, message);
        this._addSpanData(child.parent, message);
        break;
      case 'text':
        message.text += child.message;
        break;
      case 'element':
        message.text += '%o';
        message.args.push(child.element);
        break;
      case 'log':
        messages.push(this._newMessage(child.type));
        break;
    }
  },

  _addSpanData: function (span, message) {
    if (!ConsoleMessage.Support.isIE) {
      if (message.text.substring(message.text.length - 2) == '%c') {
        message.args[message.args.length - 1] = this._stylesString(span.styles);
      } else {
        message.text += '%c';
        message.args.push(this._stylesString(span.styles));
      }
    }
  },

  _newMessage: function (type) {
    return {
      type: type || 'log',
      text: '',
      args: []
    };
  },

  _stylesString: function (styles) {
    var result = '';
    for (var key in styles) {
      result += key + ':' + styles[key] + ';';
    }
    return result;
  }
};

var highlightjs = {
  'xml': {},
  'hljs-tag': {

  },
  'hljs-title': {
    color: '#5cd94d'
  },
  'hljs-expression': {
    color: '#7b521e'
  },
  'hljs-variable': {
    color: '#7b521e'
  },
  'hljs-keyword': {},
  'hljs-string': {},
  'hljs-function': {},
  'hljs-params': {},
  'hljs-number': {},
  'hljs-regexp': {},
  'hljs-comment': {
    color: '#888'
  },
  'hljs-attribute': {
    color: '#2d8fd0'
  },
  'hljs-value': {
    color: '#e7635f'
  }
};

})();
(function () {
blocks.debug.queries = {
  'if': {
    fullName: 'if',
    name: 'if',
    description: 'Executes particular query depending on the condition specified',
    params: [{
        name: 'condition',
        rawName: 'condition',
        types: ['boolean'],
        optional: false,
        isArguments: false,
        description: 'The result will determine if the consequent or the alternate query will be executed',
        defaultValue: '',
        value: ''
      }, {
        name: 'consequent',
        rawName: 'consequent',
        types: ['data-query'],
        optional: false,
        isArguments: false,
        description: 'The query that will be executed if the specified condition returns a truthy value',
        defaultValue: '',
        value: ''
      }, {
        name: 'alternate',
        rawName: '[alternate]',
        types: ['data-query'],
        optional: true,
        isArguments: false,
        description: 'The query that will be executed if the specified condition returns a falsy value',
        defaultValue: '',
        value: ''
      }],
    returns: undefined,
    examples: [{
        language: 'html',
        code: {
          name: '',
          children: [{
              name: 'hljs-tag',
              children: ['<', {
                  name: 'hljs-title',
                  children: ['div']
                }, ' ', {
                  name: 'hljs-attribute',
                  children: ['data-query']
                }, '=', {
                  name: 'hljs-value',
                  children: ['"if(true, setClass(\'success\'), setClass(\'fail\'))"']
                }, '>']
            }, {
              name: 'hljs-tag',
              children: ['</', {
                  name: 'hljs-title',
                  children: ['div']
                }, '>']
            }, '\n', {
              name: 'hljs-tag',
              children: ['<', {
                  name: 'hljs-title',
                  children: ['div']
                }, ' ', {
                  name: 'hljs-attribute',
                  children: ['data-query']
                }, '=', {
                  name: 'hljs-value',
                  children: ['"if(false, setClass(\'success\'), setClass(\'fail\'))"']
                }, '>']
            }, {
              name: 'hljs-tag',
              children: ['</', {
                  name: 'hljs-title',
                  children: ['div']
                }, '>']
            }, '\n\n', {
              name: 'hljs-comment',
              children: ['<!-- will result in -->']
            }, '\n', {
              name: 'hljs-tag',
              children: ['<', {
                  name: 'hljs-title',
                  children: ['div']
                }, ' ', {
                  name: 'hljs-attribute',
                  children: ['data-query']
                }, '=', {
                  name: 'hljs-value',
                  children: ['"if(true, setClass(\'success\'), setClass(\'fail\'))"']
                }, ' ', {
                  name: 'hljs-attribute',
                  children: ['class']
                }, '=', {
                  name: 'hljs-value',
                  children: ['"success"']
                }, '>']
            }, {
              name: 'hljs-tag',
              children: ['</', {
                  name: 'hljs-title',
                  children: ['div']
                }, '>']
            }, '\n', {
              name: 'hljs-tag',
              children: ['<', {
                  name: 'hljs-title',
                  children: ['div']
                }, ' ', {
                  name: 'hljs-attribute',
                  children: ['data-query']
                }, '=', {
                  name: 'hljs-value',
                  children: ['"if(false, setClass(\'success\'), setClass(\'fail\'))"']
                }, ' ', {
                  name: 'hljs-attribute',
                  children: ['class']
                }, '=', {
                  name: 'hljs-value',
                  children: ['"fail"']
                }, '>']
            }, {
              name: 'hljs-tag',
              children: ['</', {
                  name: 'hljs-title',
                  children: ['div']
                }, '>']
            }]
        },
        value: ''
      }],
    memberof: 'blocks.queries'
  },
  ifnot: {
    fullName: 'ifnot',
    name: 'ifnot',
    description: 'Executes particular query depending on the condition specified.\n The opposite query of the \'if\'',
    params: [{
        name: 'condition',
        rawName: 'condition',
        types: ['boolean'],
        optional: false,
        isArguments: false,
        description: 'The result will determine if the consequent or the alternate query will be executed',
        defaultValue: '',
        value: ''
      }, {
        name: 'consequent',
        rawName: 'consequent',
        types: ['data-query'],
        optional: false,
        isArguments: false,
        description: 'The query that will be executed if the specified condition returns a falsy value',
        defaultValue: '',
        value: ''
      }, {
        name: 'alternate',
        rawName: '[alternate]',
        types: ['data-query'],
        optional: true,
        isArguments: false,
        description: 'The query that will be executed if the specified condition returns a truthy value',
        defaultValue: '',
        value: ''
      }],
    returns: undefined,
    examples: [{
        language: 'html',
        code: {
          name: '',
          children: [{
              name: 'hljs-tag',
              children: ['<', {
                  name: 'hljs-title',
                  children: ['div']
                }, ' ', {
                  name: 'hljs-attribute',
                  children: ['data-query']
                }, '=', {
                  name: 'hljs-value',
                  children: ['"ifnot(true, setClass(\'success\'), setClass(\'fail\'))"']
                }, '>']
            }, {
              name: 'hljs-tag',
              children: ['</', {
                  name: 'hljs-title',
                  children: ['div']
                }, '>']
            }, '\n', {
              name: 'hljs-tag',
              children: ['<', {
                  name: 'hljs-title',
                  children: ['div']
                }, ' ', {
                  name: 'hljs-attribute',
                  children: ['data-query']
                }, '=', {
                  name: 'hljs-value',
                  children: ['"ifnot(false, setClass(\'success\'), setClass(\'fail\'))"']
                }, '>']
            }, {
              name: 'hljs-tag',
              children: ['</', {
                  name: 'hljs-title',
                  children: ['div']
                }, '>']
            }, '\n\n', {
              name: 'hljs-comment',
              children: ['<!-- will result in -->']
            }, '\n', {
              name: 'hljs-tag',
              children: ['<', {
                  name: 'hljs-title',
                  children: ['div']
                }, ' ', {
                  name: 'hljs-attribute',
                  children: ['data-query']
                }, '=', {
                  name: 'hljs-value',
                  children: ['"ifnot(true, setClass(\'success\'), setClass(\'fail\'))"']
                }, ' ', {
                  name: 'hljs-attribute',
                  children: ['class']
                }, '=', {
                  name: 'hljs-value',
                  children: ['"fail"']
                }, '>']
            }, {
              name: 'hljs-tag',
              children: ['</', {
                  name: 'hljs-title',
                  children: ['div']
                }, '>']
            }, '\n', {
              name: 'hljs-tag',
              children: ['<', {
                  name: 'hljs-title',
                  children: ['div']
                }, ' ', {
                  name: 'hljs-attribute',
                  children: ['data-query']
                }, '=', {
                  name: 'hljs-value',
                  children: ['"ifnot(false, setClass(\'success\'), setClass(\'fail\'))"']
                }, ' ', {
                  name: 'hljs-attribute',
                  children: ['class']
                }, '=', {
                  name: 'hljs-value',
                  children: ['"success"']
                }, '>']
            }, {
              name: 'hljs-tag',
              children: ['</', {
                  name: 'hljs-title',
                  children: ['div']
                }, '>']
            }]
        },
        value: ''
      }],
    memberof: 'blocks.queries'
  },
  template: {
    fullName: 'template',
    name: 'template',
    description: 'Queries and sets the inner html of the element from the template specified',
    params: [{
        name: 'template',
        rawName: 'template',
        types: ['HTMLElement', 'string'],
        optional: false,
        isArguments: false,
        description: 'The template that will be rendered\n The value could be an element id (the element innerHTML property will be taken), string (the template) or\n an element (again the element innerHTML property will be taken)',
        defaultValue: '',
        value: ''
      }, {
        name: 'value',
        rawName: '[value]',
        types: ['*'],
        optional: true,
        isArguments: false,
        description: 'Optional context for the template',
        defaultValue: '',
        value: ''
      }],
    returns: undefined,
    examples: [{
        language: 'html',
        code: {
          name: '',
          children: [{
              name: 'hljs-tag',
              children: ['<', {
                  name: 'hljs-title',
                  children: ['script']
                }, '>']
            }, {
              name: 'less',
              children: ['\n  ', {
                  name: 'hljs-tag',
                  children: ['blocks']
                }, {
                  name: 'hljs-class',
                  children: ['.query']
                }, '({\n    ', {
                  name: 'hljs-attribute',
                  children: ['name']
                }, ': ', {
                  name: 'hljs-string',
                  children: ['\'John Doe\'']
                }, ',\n    ', {
                  name: 'hljs-attribute',
                  children: ['age']
                }, ': ', {
                  name: 'hljs-number',
                  children: ['22']
                }, '\n  });\n']
            }, {
              name: 'hljs-tag',
              children: ['</', {
                  name: 'hljs-title',
                  children: ['script']
                }, '>']
            }, '\n', {
              name: 'hljs-tag',
              children: ['<', {
                  name: 'hljs-title',
                  children: ['script']
                }, ' ', {
                  name: 'hljs-attribute',
                  children: ['id']
                }, '=', {
                  name: 'hljs-value',
                  children: ['"user"']
                }, ' ', {
                  name: 'hljs-attribute',
                  children: ['type']
                }, '=', {
                  name: 'hljs-value',
                  children: ['"blocks-template"']
                }, '>']
            }, {
              name: 'handlebars',
              children: [{
                  name: 'xml',
                  children: ['\n  ', {
                      name: 'hljs-tag',
                      children: ['<', {
                          name: 'hljs-title',
                          children: ['h3']
                        }, '>']
                    }]
                }, {
                  name: 'hljs-expression',
                  children: ['{{', {
                      name: 'hljs-variable',
                      children: ['name']
                    }, '}}']
                }, {
                  name: 'xml',
                  children: [{
                      name: 'hljs-tag',
                      children: ['</', {
                          name: 'hljs-title',
                          children: ['h3']
                        }, '>']
                    }, '\n  ', {
                      name: 'hljs-tag',
                      children: ['<', {
                          name: 'hljs-title',
                          children: ['p']
                        }, '>']
                    }, 'I am ']
                }, {
                  name: 'hljs-expression',
                  children: ['{{', {
                      name: 'hljs-variable',
                      children: ['age']
                    }, '}}']
                }, {
                  name: 'xml',
                  children: [' years old.', {
                      name: 'hljs-tag',
                      children: ['</', {
                          name: 'hljs-title',
                          children: ['p']
                        }, '>']
                    }, '\n']
                }]
            }, {
              name: 'hljs-tag',
              children: ['</', {
                  name: 'hljs-title',
                  children: ['script']
                }, '>']
            }, '\n', {
              name: 'hljs-tag',
              children: ['<', {
                  name: 'hljs-title',
                  children: ['div']
                }, ' ', {
                  name: 'hljs-attribute',
                  children: ['data-query']
                }, '=', {
                  name: 'hljs-value',
                  children: ['"template(\'user\')"']
                }, '>']
            }, '\n', {
              name: 'hljs-tag',
              children: ['</', {
                  name: 'hljs-title',
                  children: ['div']
                }, '>']
            }, '\n\n', {
              name: 'hljs-comment',
              children: ['<!-- will result in -->']
            }, '\n', {
              name: 'hljs-tag',
              children: ['<', {
                  name: 'hljs-title',
                  children: ['div']
                }, ' ', {
                  name: 'hljs-attribute',
                  children: ['data-query']
                }, '=', {
                  name: 'hljs-value',
                  children: ['"template(\'user\')"']
                }, '>']
            }, '\n  ', {
              name: 'hljs-tag',
              children: ['<', {
                  name: 'hljs-title',
                  children: ['h3']
                }, '>']
            }, 'John Doe', {
              name: 'hljs-tag',
              children: ['</', {
                  name: 'hljs-title',
                  children: ['h3']
                }, '>']
            }, '\n  ', {
              name: 'hljs-tag',
              children: ['<', {
                  name: 'hljs-title',
                  children: ['p']
                }, '>']
            }, 'I am 22 years old.', {
              name: 'hljs-tag',
              children: ['</', {
                  name: 'hljs-title',
                  children: ['p']
                }, '>']
            }, '\n', {
              name: 'hljs-tag',
              children: ['</', {
                  name: 'hljs-title',
                  children: ['div']
                }, '>']
            }]
        },
        value: ''
      }],
    memberof: 'blocks.queries'
  },
  define: {
    fullName: 'define',
    name: 'define',
    description: 'Creates a variable name that could be used in child elements',
    params: [{
        name: 'propertyName',
        rawName: 'propertyName',
        types: ['string'],
        optional: false,
        isArguments: false,
        description: 'The name of the value that will be\n created and you could access its value later using that name',
        defaultValue: '',
        value: ''
      }, {
        name: 'propertyValue',
        rawName: 'propertyValue',
        types: ['*'],
        optional: false,
        isArguments: false,
        description: 'The value that the property will have',
        defaultValue: '',
        value: ''
      }],
    returns: undefined,
    examples: [{
        language: 'html',
        code: {
          name: '',
          children: [{
              name: 'hljs-tag',
              children: ['<', {
                  name: 'hljs-title',
                  children: ['script']
                }, '>']
            }, {
              name: 'less',
              children: ['\n  ', {
                  name: 'hljs-tag',
                  children: ['blocks']
                }, {
                  name: 'hljs-class',
                  children: ['.query']
                }, '({\n    ', {
                  name: 'hljs-tag',
                  children: ['strings']
                }, ': {\n      ', {
                  name: 'hljs-tag',
                  children: ['title']
                }, ': {\n        ', {
                  name: 'hljs-attribute',
                  children: ['text']
                }, ': ', {
                  name: 'hljs-string',
                  children: ['\'Hello World!\'']
                }, '\n      }\n    }\n  });\n']
            }, {
              name: 'hljs-tag',
              children: ['</', {
                  name: 'hljs-title',
                  children: ['script']
                }, '>']
            }, '\n', {
              name: 'hljs-tag',
              children: ['<', {
                  name: 'hljs-title',
                  children: ['div']
                }, ' ', {
                  name: 'hljs-attribute',
                  children: ['data-query']
                }, '=', {
                  name: 'hljs-value',
                  children: ['"define(\'$title\', strings.title.text)"']
                }, '>']
            }, '\n  The title is {{$title}}.\n', {
              name: 'hljs-tag',
              children: ['</', {
                  name: 'hljs-title',
                  children: ['div']
                }, '>']
            }, '\n\n', {
              name: 'hljs-comment',
              children: ['<!-- will result in -->']
            }, '\n', {
              name: 'hljs-tag',
              children: ['<', {
                  name: 'hljs-title',
                  children: ['div']
                }, ' ', {
                  name: 'hljs-attribute',
                  children: ['data-query']
                }, '=', {
                  name: 'hljs-value',
                  children: ['"define(\'$title\', strings.title.text)"']
                }, '>']
            }, '\n  The title is Hello World!.\n', {
              name: 'hljs-tag',
              children: ['</', {
                  name: 'hljs-title',
                  children: ['div']
                }, '>']
            }]
        },
        value: ''
      }],
    memberof: 'blocks.queries'
  },
  'with': {
    fullName: 'with',
    name: 'with',
    description: 'Changes the current context for the child elements.\n Useful when you will work a lot with a particular value',
    params: [{
        name: 'value',
        rawName: 'value',
        types: ['*'],
        optional: false,
        isArguments: false,
        description: 'The new context',
        defaultValue: '',
        value: ''
      }, {
        name: 'name',
        rawName: '[name]',
        types: ['string'],
        optional: true,
        isArguments: false,
        description: 'Optional name of the new context\n This way the context will also available under the name not only under the $this context property',
        defaultValue: '',
        value: ''
      }],
    returns: undefined,
    examples: [{
        language: 'html',
        code: {
          name: '',
          children: [{
              name: 'hljs-tag',
              children: ['<', {
                  name: 'hljs-title',
                  children: ['script']
                }, '>']
            }, {
              name: 'less',
              children: ['\n  ', {
                  name: 'hljs-tag',
                  children: ['blocks']
                }, {
                  name: 'hljs-class',
                  children: ['.query']
                }, '({\n    ', {
                  name: 'hljs-tag',
                  children: ['ProfilePage']
                }, ': {\n      ', {
                  name: 'hljs-tag',
                  children: ['user']
                }, ': {\n        ', {
                  name: 'hljs-attribute',
                  children: ['name']
                }, ': ', {
                  name: 'hljs-string',
                  children: ['\'John Doe\'']
                }, ',\n        ', {
                  name: 'hljs-attribute',
                  children: ['age']
                }, ': ', {
                  name: 'hljs-number',
                  children: ['22']
                }, '\n      }\n    }\n  });\n']
            }, {
              name: 'hljs-tag',
              children: ['</', {
                  name: 'hljs-title',
                  children: ['script']
                }, '>']
            }, '\n', {
              name: 'hljs-tag',
              children: ['<', {
                  name: 'hljs-title',
                  children: ['div']
                }, ' ', {
                  name: 'hljs-attribute',
                  children: ['data-query']
                }, '=', {
                  name: 'hljs-value',
                  children: ['"with(ProfilePage.user, \'$user\')"']
                }, '>']
            }, '\n My name is {{$user.name}} and I am {{$this.age}} years old.\n', {
              name: 'hljs-tag',
              children: ['</', {
                  name: 'hljs-title',
                  children: ['div']
                }, '>']
            }, '\n\n', {
              name: 'hljs-comment',
              children: ['<!-- will result in -->']
            }, '\n', {
              name: 'hljs-tag',
              children: ['<', {
                  name: 'hljs-title',
                  children: ['div']
                }, ' ', {
                  name: 'hljs-attribute',
                  children: ['data-query']
                }, '=', {
                  name: 'hljs-value',
                  children: ['"with(ProfilePage.user, \'$user\')"']
                }, '>']
            }, '\n My name is John Doe and I am 22 years old.\n', {
              name: 'hljs-tag',
              children: ['</', {
                  name: 'hljs-title',
                  children: ['div']
                }, '>']
            }]
        },
        value: ''
      }],
    memberof: 'blocks.queries'
  },
  each: {
    fullName: 'each',
    name: 'each',
    description: 'The each method iterates through an array items or object values\n and repeats the child elements by using them as a template',
    params: [{
        name: 'collection',
        rawName: 'collection',
        types: ['Array', 'Object'],
        optional: false,
        isArguments: false,
        description: 'The collection to iterate over',
        defaultValue: '',
        value: ''
      }],
    returns: undefined,
    examples: [{
        language: 'html',
        code: {
          name: '',
          children: [{
              name: 'hljs-tag',
              children: ['<', {
                  name: 'hljs-title',
                  children: ['script']
                }, '>']
            }, {
              name: 'css',
              children: ['\n  ', {
                  name: 'hljs-tag',
                  children: ['blocks']
                }, {
                  name: 'hljs-class',
                  children: ['.query']
                }, '(', {
                  name: 'hljs-rules',
                  children: ['{\n    ', {
                      name: 'hljs-rule',
                      children: [{
                          name: 'hljs-attribute',
                          children: ['items']
                        }, ':', {
                          name: 'hljs-value',
                          children: [' [', {
                              name: 'hljs-string',
                              children: ['\'John\'']
                            }, ', ', {
                              name: 'hljs-string',
                              children: ['\'Doe\'']
                            }, ']\n  })']
                        }]
                    }, ';\n']
                }]
            }, {
              name: 'hljs-tag',
              children: ['</', {
                  name: 'hljs-title',
                  children: ['script']
                }, '>']
            }, '\n', {
              name: 'hljs-tag',
              children: ['<', {
                  name: 'hljs-title',
                  children: ['ul']
                }, ' ', {
                  name: 'hljs-attribute',
                  children: ['data-query']
                }, '=', {
                  name: 'hljs-value',
                  children: ['"each(items)"']
                }, '>']
            }, '\n  ', {
              name: 'hljs-tag',
              children: ['<', {
                  name: 'hljs-title',
                  children: ['li']
                }, '>']
            }, '{{$this}}', {
              name: 'hljs-tag',
              children: ['</', {
                  name: 'hljs-title',
                  children: ['li']
                }, '>']
            }, '\n', {
              name: 'hljs-tag',
              children: ['</', {
                  name: 'hljs-title',
                  children: ['ul']
                }, '>']
            }, '\n\n', {
              name: 'hljs-comment',
              children: ['<!-- will result in -->']
            }, '\n', {
              name: 'hljs-tag',
              children: ['<', {
                  name: 'hljs-title',
                  children: ['ul']
                }, ' ', {
                  name: 'hljs-attribute',
                  children: ['data-query']
                }, '=', {
                  name: 'hljs-value',
                  children: ['"each(items)"']
                }, '>']
            }, '\n  ', {
              name: 'hljs-tag',
              children: ['<', {
                  name: 'hljs-title',
                  children: ['li']
                }, '>']
            }, 'John', {
              name: 'hljs-tag',
              children: ['</', {
                  name: 'hljs-title',
                  children: ['li']
                }, '>']
            }, '\n  ', {
              name: 'hljs-tag',
              children: ['<', {
                  name: 'hljs-title',
                  children: ['li']
                }, '>']
            }, 'Doe', {
              name: 'hljs-tag',
              children: ['</', {
                  name: 'hljs-title',
                  children: ['li']
                }, '>']
            }, '\n', {
              name: 'hljs-tag',
              children: ['</', {
                  name: 'hljs-title',
                  children: ['ul']
                }, '>']
            }]
        },
        value: ''
      }],
    memberof: 'blocks.queries'
  },
  options: {
    fullName: 'options',
    name: 'options',
    description: 'Render options for a <select> element by providing an collection.',
    params: [{
        name: 'collection',
        rawName: 'collection',
        types: ['Array', 'Object'],
        optional: false,
        isArguments: false,
        description: 'The collection to iterate over',
        defaultValue: '',
        value: ''
      }, {
        name: 'options',
        rawName: '[options]',
        types: ['Object'],
        optional: true,
        isArguments: false,
        description: 'Options to customize the behavior for creating each option.\n options.value - determines the field in the collection to server for the option value\n options.text - determines the field in the collection to server for the option text\n options.caption - creates a option with the specified text at the first option',
        defaultValue: '',
        value: ''
      }],
    returns: undefined,
    examples: [{
        language: 'html',
        code: {
          name: '',
          children: [{
              name: 'hljs-tag',
              children: ['<', {
                  name: 'hljs-title',
                  children: ['script']
                }, '>']
            }, {
              name: 'css',
              children: ['\n', {
                  name: 'hljs-tag',
                  children: ['blocks']
                }, {
                  name: 'hljs-class',
                  children: ['.query']
                }, '(', {
                  name: 'hljs-rules',
                  children: ['{\n  ', {
                      name: 'hljs-rule',
                      children: [{
                          name: 'hljs-attribute',
                          children: ['caption']
                        }, ':', {
                          name: 'hljs-value',
                          children: [' ', {
                              name: 'hljs-string',
                              children: ['\'Select user\'']
                            }, '\n  data: [\n    { name: ', {
                              name: 'hljs-string',
                              children: ['\'John\'']
                            }, ', id: ', {
                              name: 'hljs-number',
                              children: ['1']
                            }, ' },\n    { name: ', {
                              name: 'hljs-string',
                              children: ['\'Doe\'']
                            }, ', id: ', {
                              name: 'hljs-number',
                              children: ['2']
                            }, ' }\n  ]\n})']
                        }]
                    }, ';\n']
                }]
            }, {
              name: 'hljs-tag',
              children: ['</', {
                  name: 'hljs-title',
                  children: ['script']
                }, '>']
            }, '\n', {
              name: 'hljs-tag',
              children: ['<', {
                  name: 'hljs-title',
                  children: ['select']
                }, ' ', {
                  name: 'hljs-attribute',
                  children: ['data-query']
                }, '=', {
                  name: 'hljs-value',
                  children: ['"options(data, { text: \'name\', value: \'id\', caption: caption })"']
                }, '>']
            }, '\n', {
              name: 'hljs-tag',
              children: ['</', {
                  name: 'hljs-title',
                  children: ['select']
                }, '>']
            }, '\n\n', {
              name: 'hljs-comment',
              children: ['<!-- will result in -->']
            }, '\n', {
              name: 'hljs-tag',
              children: ['<', {
                  name: 'hljs-title',
                  children: ['select']
                }, ' ', {
                  name: 'hljs-attribute',
                  children: ['data-query']
                }, '=', {
                  name: 'hljs-value',
                  children: ['"options(data, { text: \'name\', value: \'id\', caption: caption })"']
                }, '>']
            }, '\n  ', {
              name: 'hljs-tag',
              children: ['<', {
                  name: 'hljs-title',
                  children: ['option']
                }, '>']
            }, 'Select user', {
              name: 'hljs-tag',
              children: ['</', {
                  name: 'hljs-title',
                  children: ['option']
                }, '>']
            }, '\n  ', {
              name: 'hljs-tag',
              children: ['<', {
                  name: 'hljs-title',
                  children: ['option']
                }, ' ', {
                  name: 'hljs-attribute',
                  children: ['value']
                }, '=', {
                  name: 'hljs-value',
                  children: ['"1"']
                }, '>']
            }, 'John', {
              name: 'hljs-tag',
              children: ['</', {
                  name: 'hljs-title',
                  children: ['option']
                }, '>']
            }, '\n  ', {
              name: 'hljs-tag',
              children: ['<', {
                  name: 'hljs-title',
                  children: ['option']
                }, ' ', {
                  name: 'hljs-attribute',
                  children: ['value']
                }, '=', {
                  name: 'hljs-value',
                  children: ['"2"']
                }, '>']
            }, 'Doe', {
              name: 'hljs-tag',
              children: ['</', {
                  name: 'hljs-title',
                  children: ['option']
                }, '>']
            }, '\n', {
              name: 'hljs-tag',
              children: ['</', {
                  name: 'hljs-title',
                  children: ['select']
                }, '>']
            }]
        },
        value: ''
      }],
    memberof: 'blocks.queries'
  },
  render: {
    fullName: 'render',
    name: 'render',
    description: 'The render query allows elements to be skipped from rendering and not to exist in the HTML result',
    params: [{
        name: 'condition',
        rawName: 'condition',
        types: ['boolean'],
        optional: false,
        isArguments: false,
        description: 'The value determines if the element will be rendered or not',
        defaultValue: '',
        value: ''
      }, {
        name: 'renderChildren',
        rawName: '[renderChildren=false]',
        types: ['boolean'],
        optional: true,
        isArguments: false,
        description: 'The value indicates if the children will be rendered',
        defaultValue: 'false',
        value: ''
      }],
    returns: undefined,
    examples: [{
        language: 'html',
        code: {
          name: '',
          children: [{
              name: 'hljs-tag',
              children: ['<', {
                  name: 'hljs-title',
                  children: ['div']
                }, ' ', {
                  name: 'hljs-attribute',
                  children: ['data-query']
                }, '=', {
                  name: 'hljs-value',
                  children: ['"render(true)"']
                }, '>']
            }, 'Visible', {
              name: 'hljs-tag',
              children: ['</', {
                  name: 'hljs-title',
                  children: ['div']
                }, '>']
            }, '\n', {
              name: 'hljs-tag',
              children: ['<', {
                  name: 'hljs-title',
                  children: ['div']
                }, ' ', {
                  name: 'hljs-attribute',
                  children: ['data-query']
                }, '=', {
                  name: 'hljs-value',
                  children: ['"render(false)"']
                }, '>']
            }, 'Invisible', {
              name: 'hljs-tag',
              children: ['</', {
                  name: 'hljs-title',
                  children: ['div']
                }, '>']
            }, '\n\n', {
              name: 'hljs-comment',
              children: ['<!-- html result will be -->']
            }, '\n', {
              name: 'hljs-tag',
              children: ['<', {
                  name: 'hljs-title',
                  children: ['div']
                }, ' ', {
                  name: 'hljs-attribute',
                  children: ['data-query']
                }, '=', {
                  name: 'hljs-value',
                  children: ['"render(true)"']
                }, '>']
            }, 'Visible', {
              name: 'hljs-tag',
              children: ['</', {
                  name: 'hljs-title',
                  children: ['div']
                }, '>']
            }]
        },
        value: ''
      }],
    memberof: 'blocks.queries'
  },
  animate: {
    fullName: 'animate',
    name: 'animate',
    description: 'Could be used for custom JavaScript animation by providing a callback function\n that will be called the an animation needs to be performed',
    params: [{
        name: 'callback',
        rawName: 'callback',
        types: ['Function'],
        optional: false,
        isArguments: false,
        description: 'The function that will be called when animation needs\n to be performed.',
        defaultValue: '',
        value: ''
      }],
    returns: undefined,
    examples: [{
        language: 'html',
        code: {
          name: '',
          children: [{
              name: 'hljs-tag',
              children: ['<', {
                  name: 'hljs-title',
                  children: ['script']
                }, '>']
            }, {
              name: 'nimrod',
              children: ['\nblocks.query({\n  visible: blocks.observable(', {
                  name: 'hljs-literal',
                  children: ['true']
                }, '),\n  toggleVisibility: function () {\n    // this points to the model ', {
                  name: 'hljs-keyword',
                  children: ['object']
                }, ' passed to blocks.query() ', {
                  name: 'hljs-keyword',
                  children: ['method']
                }, '\n    this.visible(!this.visible());\n  },\n\n  fade: function (element, ready) {\n    ', {
                  name: 'hljs-type',
                  children: ['Velocity']
                }, '(element, {\n      // this points to the model ', {
                  name: 'hljs-keyword',
                  children: ['object']
                }, ' passed to blocks.query() ', {
                  name: 'hljs-keyword',
                  children: ['method']
                }, '\n      opacity: this.visible() ? ', {
                  name: 'hljs-number',
                  children: ['1']
                }, ' : ', {
                  name: 'hljs-number',
                  children: ['0']
                }, '\n    }, {\n      duration: ', {
                  name: 'hljs-number',
                  children: ['1000']
                }, ',\n      queue: ', {
                  name: 'hljs-literal',
                  children: ['false']
                }, ',\n\n      // setting the ready callback to the complete callback\n      complete: ready\n    });\n  }\n});\n']
            }, {
              name: 'hljs-tag',
              children: ['</', {
                  name: 'hljs-title',
                  children: ['script']
                }, '>']
            }, '\n', {
              name: 'hljs-tag',
              children: ['<', {
                  name: 'hljs-title',
                  children: ['button']
                }, ' ', {
                  name: 'hljs-attribute',
                  children: ['data-query']
                }, '=', {
                  name: 'hljs-value',
                  children: ['"click(toggleVisibility)"']
                }, '>']
            }, 'Toggle visibility', {
              name: 'hljs-tag',
              children: ['</', {
                  name: 'hljs-title',
                  children: ['button']
                }, '>']
            }, '\n', {
              name: 'hljs-tag',
              children: ['<', {
                  name: 'hljs-title',
                  children: ['div']
                }, ' ', {
                  name: 'hljs-attribute',
                  children: ['data-query']
                }, '=', {
                  name: 'hljs-value',
                  children: ['"visible(visible).animate(fade)"']
                }, ' ', {
                  name: 'hljs-attribute',
                  children: ['style']
                }, '=', {
                  name: 'hljs-value',
                  children: ['"background: red;width: 300px;height: 240px;"']
                }, '>']
            }, '\n', {
              name: 'hljs-tag',
              children: ['</', {
                  name: 'hljs-title',
                  children: ['div']
                }, '>']
            }]
        },
        value: ''
      }],
    memberof: 'blocks.queries'
  },
  setClass: {
    fullName: 'setClass',
    name: 'setClass',
    description: 'Adds or removes a class from an element',
    params: [{
        name: 'className',
        rawName: 'className',
        types: ['string', 'Array'],
        optional: false,
        isArguments: false,
        description: 'The class string (or array of strings) that will be added or removed from the element.',
        defaultValue: '',
        value: ''
      }, {
        name: 'condition',
        rawName: '[condition=true]',
        types: ['boolean', 'undefined'],
        optional: true,
        isArguments: false,
        description: 'Optional value indicating if the class name will be added or removed. true - add, false - remove.',
        defaultValue: 'true',
        value: ''
      }],
    returns: undefined,
    examples: [{
        language: 'html',
        code: {
          name: '',
          children: [{
              name: 'hljs-tag',
              children: ['<', {
                  name: 'hljs-title',
                  children: ['div']
                }, ' ', {
                  name: 'hljs-attribute',
                  children: ['data-query']
                }, '=', {
                  name: 'hljs-value',
                  children: ['"setClass(\'header\')"']
                }, '>']
            }, {
              name: 'hljs-tag',
              children: ['</', {
                  name: 'hljs-title',
                  children: ['div']
                }, '>']
            }, '\n\n', {
              name: 'hljs-comment',
              children: ['<!-- will result in -->']
            }, '\n', {
              name: 'hljs-tag',
              children: ['<', {
                  name: 'hljs-title',
                  children: ['div']
                }, ' ', {
                  name: 'hljs-attribute',
                  children: ['data-query']
                }, '=', {
                  name: 'hljs-value',
                  children: ['"setClass(\'header\')"']
                }, ' ', {
                  name: 'hljs-attribute',
                  children: ['class']
                }, '=', {
                  name: 'hljs-value',
                  children: ['"header"']
                }, '>']
            }, {
              name: 'hljs-tag',
              children: ['</', {
                  name: 'hljs-title',
                  children: ['div']
                }, '>']
            }]
        },
        value: ''
      }],
    memberof: 'blocks.queries'
  },
  html: {
    fullName: 'html',
    name: 'html',
    description: 'Sets the inner html to the element',
    params: [{
        name: 'html',
        rawName: 'html',
        types: ['string'],
        optional: false,
        isArguments: false,
        description: 'The html that will be places inside element replacing any other content.',
        defaultValue: '',
        value: ''
      }, {
        name: 'condition',
        rawName: '[condition=true]',
        types: ['boolean'],
        optional: true,
        isArguments: false,
        description: 'Condition indicating if the html will be set.',
        defaultValue: 'true',
        value: ''
      }],
    returns: undefined,
    examples: [{
        language: 'html',
        code: {
          name: '',
          children: [{
              name: 'hljs-tag',
              children: ['<', {
                  name: 'hljs-title',
                  children: ['div']
                }, ' ', {
                  name: 'hljs-attribute',
                  children: ['data-query']
                }, '=', {
                  name: 'hljs-value',
                  children: ['"html(\'<b>some content</b>\')"']
                }, '>']
            }, {
              name: 'hljs-tag',
              children: ['</', {
                  name: 'hljs-title',
                  children: ['div']
                }, '>']
            }, '\n\n', {
              name: 'hljs-comment',
              children: ['<!-- will result in -->']
            }, '\n', {
              name: 'hljs-tag',
              children: ['<', {
                  name: 'hljs-title',
                  children: ['div']
                }, ' ', {
                  name: 'hljs-attribute',
                  children: ['data-query']
                }, '=', {
                  name: 'hljs-value',
                  children: ['"html(\'<b>some content</b>\')"']
                }, '>']
            }, {
              name: 'hljs-tag',
              children: ['<', {
                  name: 'hljs-title',
                  children: ['b']
                }, '>']
            }, 'some content', {
              name: 'hljs-tag',
              children: ['</', {
                  name: 'hljs-title',
                  children: ['b']
                }, '>']
            }, {
              name: 'hljs-tag',
              children: ['</', {
                  name: 'hljs-title',
                  children: ['div']
                }, '>']
            }]
        },
        value: ''
      }],
    memberof: 'blocks.queries'
  },
  text: {
    fullName: 'text',
    name: 'text',
    description: 'Adds or removes the inner text from an element. Escapes any HTML provided',
    params: [{
        name: 'text',
        rawName: 'text',
        types: ['string'],
        optional: false,
        isArguments: false,
        description: 'The text that will be places inside element replacing any other content.',
        defaultValue: '',
        value: ''
      }, {
        name: 'condition',
        rawName: '[condition=true]',
        types: ['boolean'],
        optional: true,
        isArguments: false,
        description: 'Value indicating if the text will be added or cleared. true - add, false - clear.',
        defaultValue: 'true',
        value: ''
      }],
    returns: undefined,
    examples: [{
        language: 'html',
        code: {
          name: '',
          children: [{
              name: 'hljs-tag',
              children: ['<', {
                  name: 'hljs-title',
                  children: ['div']
                }, ' ', {
                  name: 'hljs-attribute',
                  children: ['data-query']
                }, '=', {
                  name: 'hljs-value',
                  children: ['"html(\'some content\')"']
                }, '>']
            }, {
              name: 'hljs-tag',
              children: ['</', {
                  name: 'hljs-title',
                  children: ['div']
                }, '>']
            }, '\n\n', {
              name: 'hljs-comment',
              children: ['<!-- will result in -->']
            }, '\n', {
              name: 'hljs-tag',
              children: ['<', {
                  name: 'hljs-title',
                  children: ['div']
                }, ' ', {
                  name: 'hljs-attribute',
                  children: ['data-query']
                }, '=', {
                  name: 'hljs-value',
                  children: ['"html(\'some content\')"']
                }, '>']
            }, 'some content', {
              name: 'hljs-tag',
              children: ['</', {
                  name: 'hljs-title',
                  children: ['div']
                }, '>']
            }]
        },
        value: ''
      }],
    memberof: 'blocks.queries'
  },
  visible: {
    fullName: 'visible',
    name: 'visible',
    description: 'Determines if an html element will be visible. Sets the CSS display property.',
    params: [{
        name: 'condition',
        rawName: '[condition=true]',
        types: ['boolean'],
        optional: true,
        isArguments: false,
        description: 'Value indicating if element will be visible or not.',
        defaultValue: 'true',
        value: ''
      }],
    returns: undefined,
    examples: [{
        language: 'html',
        code: {
          name: '',
          children: [{
              name: 'hljs-tag',
              children: ['<', {
                  name: 'hljs-title',
                  children: ['div']
                }, ' ', {
                  name: 'hljs-attribute',
                  children: ['data-query']
                }, '=', {
                  name: 'hljs-value',
                  children: ['"visible(true)"']
                }, '>']
            }, 'Visible', {
              name: 'hljs-tag',
              children: ['</', {
                  name: 'hljs-title',
                  children: ['div']
                }, '>']
            }, '\n', {
              name: 'hljs-tag',
              children: ['<', {
                  name: 'hljs-title',
                  children: ['div']
                }, ' ', {
                  name: 'hljs-attribute',
                  children: ['data-query']
                }, '=', {
                  name: 'hljs-value',
                  children: ['"visible(false)"']
                }, '>']
            }, 'Invisible', {
              name: 'hljs-tag',
              children: ['</', {
                  name: 'hljs-title',
                  children: ['div']
                }, '>']
            }, '\n\n', {
              name: 'hljs-comment',
              children: ['<!-- html result will be -->']
            }, '\n', {
              name: 'hljs-tag',
              children: ['<', {
                  name: 'hljs-title',
                  children: ['div']
                }, ' ', {
                  name: 'hljs-attribute',
                  children: ['data-query']
                }, '=', {
                  name: 'hljs-value',
                  children: ['"visible(true)"']
                }, '>']
            }, 'Visible', {
              name: 'hljs-tag',
              children: ['</', {
                  name: 'hljs-title',
                  children: ['div']
                }, '>']
            }, '\n', {
              name: 'hljs-tag',
              children: ['<', {
                  name: 'hljs-title',
                  children: ['div']
                }, ' ', {
                  name: 'hljs-attribute',
                  children: ['data-query']
                }, '=', {
                  name: 'hljs-value',
                  children: ['"visible(false)"']
                }, ' ', {
                  name: 'hljs-attribute',
                  children: ['style']
                }, '=', {
                  name: 'hljs-value',
                  children: ['"display: none;"']
                }, '>']
            }, 'Invisible', {
              name: 'hljs-tag',
              children: ['</', {
                  name: 'hljs-title',
                  children: ['div']
                }, '>']
            }]
        },
        value: ''
      }],
    memberof: 'blocks.queries'
  },
  attr: {
    fullName: 'attr',
    name: 'attr',
    description: 'Gets, sets or removes an element attribute.\n Passing only the first parameter will return the attributeName value',
    params: [{
        name: 'attributeName',
        rawName: 'attributeName',
        types: ['string'],
        optional: false,
        isArguments: false,
        description: 'The attribute name that will be get, set or removed.',
        defaultValue: '',
        value: ''
      }, {
        name: 'attributeValue',
        rawName: 'attributeValue',
        types: ['string'],
        optional: false,
        isArguments: false,
        description: 'The value of the attribute. It will be set if condition is true.',
        defaultValue: '',
        value: ''
      }],
    returns: undefined,
    examples: [{
        language: 'html',
        code: {
          name: '',
          children: [{
              name: 'hljs-tag',
              children: ['<', {
                  name: 'hljs-title',
                  children: ['div']
                }, ' ', {
                  name: 'hljs-attribute',
                  children: ['data-query']
                }, '=', {
                  name: 'hljs-value',
                  children: ['"attr(\'data-content\', \'some content\')"']
                }, '>']
            }, {
              name: 'hljs-tag',
              children: ['</', {
                  name: 'hljs-title',
                  children: ['div']
                }, '>']
            }, '\n\n', {
              name: 'hljs-comment',
              children: ['<!-- will result in -->']
            }, '\n', {
              name: 'hljs-tag',
              children: ['<', {
                  name: 'hljs-title',
                  children: ['div']
                }, ' ', {
                  name: 'hljs-attribute',
                  children: ['data-query']
                }, '=', {
                  name: 'hljs-value',
                  children: ['"attr(\'data-content\', \'some content\')"']
                }, ' ', {
                  name: 'hljs-attribute',
                  children: ['data-content']
                }, '=', {
                  name: 'hljs-value',
                  children: ['"some content"']
                }, '>']
            }, {
              name: 'hljs-tag',
              children: ['</', {
                  name: 'hljs-title',
                  children: ['div']
                }, '>']
            }]
        },
        value: ''
      }],
    memberof: 'blocks.queries'
  },
  val: {
    fullName: 'val',
    name: 'val',
    description: 'Sets the value attribute on an element.',
    params: [{
        name: 'value',
        rawName: 'value',
        types: ['string', 'number', 'Array', 'undefined'],
        optional: false,
        isArguments: false,
        description: 'The new value for the element.',
        defaultValue: '',
        value: ''
      }],
    returns: undefined,
    examples: [{
        language: 'html',
        code: {
          name: '',
          children: [{
              name: 'hljs-tag',
              children: ['<', {
                  name: 'hljs-title',
                  children: ['script']
                }, '>']
            }, {
              name: 'css',
              children: ['\n', {
                  name: 'hljs-tag',
                  children: ['blocks']
                }, {
                  name: 'hljs-class',
                  children: ['.query']
                }, '(', {
                  name: 'hljs-rules',
                  children: ['{\n  ', {
                      name: 'hljs-rule',
                      children: [{
                          name: 'hljs-attribute',
                          children: ['name']
                        }, ':', {
                          name: 'hljs-value',
                          children: [' blocks.', {
                              name: 'hljs-function',
                              children: ['observable']
                            }, '(', {
                              name: 'hljs-string',
                              children: ['\'John Doe\'']
                            }, ')\n})']
                        }]
                    }, ';\n']
                }]
            }, {
              name: 'hljs-tag',
              children: ['</', {
                  name: 'hljs-title',
                  children: ['script']
                }, '>']
            }, '\n', {
              name: 'hljs-tag',
              children: ['<', {
                  name: 'hljs-title',
                  children: ['input']
                }, ' ', {
                  name: 'hljs-attribute',
                  children: ['data-query']
                }, '=', {
                  name: 'hljs-value',
                  children: ['"val(name)"']
                }, ' />']
            }, '\n\n', {
              name: 'hljs-comment',
              children: ['<!-- will result in -->']
            }, '\n', {
              name: 'hljs-tag',
              children: ['<', {
                  name: 'hljs-title',
                  children: ['input']
                }, ' ', {
                  name: 'hljs-attribute',
                  children: ['data-query']
                }, '=', {
                  name: 'hljs-value',
                  children: ['"val(name)"']
                }, ' ', {
                  name: 'hljs-attribute',
                  children: ['value']
                }, '=', {
                  name: 'hljs-value',
                  children: ['"John Doe"']
                }, ' />']
            }]
        },
        value: ''
      }],
    memberof: 'blocks.queries'
  },
  checked: {
    fullName: 'checked',
    name: 'checked',
    description: 'Sets the checked attribute on an element',
    params: [{
        name: 'condition',
        rawName: '[condition=true]',
        types: ['boolean', 'undefined'],
        optional: true,
        isArguments: false,
        description: 'Determines if the element will be checked or not',
        defaultValue: 'true',
        value: ''
      }],
    returns: undefined,
    examples: [{
        language: 'html',
        code: {
          name: '',
          children: [{
              name: 'hljs-tag',
              children: ['<', {
                  name: 'hljs-title',
                  children: ['input']
                }, ' ', {
                  name: 'hljs-attribute',
                  children: ['type']
                }, '=', {
                  name: 'hljs-value',
                  children: ['"checkbox"']
                }, ' ', {
                  name: 'hljs-attribute',
                  children: ['data-query']
                }, '=', {
                  name: 'hljs-value',
                  children: ['"checked(true)"']
                }, ' />']
            }, '\n', {
              name: 'hljs-tag',
              children: ['<', {
                  name: 'hljs-title',
                  children: ['input']
                }, ' ', {
                  name: 'hljs-attribute',
                  children: ['type']
                }, '=', {
                  name: 'hljs-value',
                  children: ['"checkbox"']
                }, ' ', {
                  name: 'hljs-attribute',
                  children: ['data-query']
                }, '=', {
                  name: 'hljs-value',
                  children: ['"checked(false)"']
                }, ' />']
            }, '\n\n', {
              name: 'hljs-comment',
              children: ['<!-- will result in -->']
            }, '\n', {
              name: 'hljs-tag',
              children: ['<', {
                  name: 'hljs-title',
                  children: ['input']
                }, ' ', {
                  name: 'hljs-attribute',
                  children: ['type']
                }, '=', {
                  name: 'hljs-value',
                  children: ['"checkbox"']
                }, ' ', {
                  name: 'hljs-attribute',
                  children: ['data-query']
                }, '=', {
                  name: 'hljs-value',
                  children: ['"checked(true)"']
                }, ' ', {
                  name: 'hljs-attribute',
                  children: ['checked']
                }, '=', {
                  name: 'hljs-value',
                  children: ['"checked"']
                }, ' />']
            }, '\n', {
              name: 'hljs-tag',
              children: ['<', {
                  name: 'hljs-title',
                  children: ['input']
                }, ' ', {
                  name: 'hljs-attribute',
                  children: ['type']
                }, '=', {
                  name: 'hljs-value',
                  children: ['"checkbox"']
                }, ' ', {
                  name: 'hljs-attribute',
                  children: ['data-query']
                }, '=', {
                  name: 'hljs-value',
                  children: ['"checked(false)"']
                }, ' />']
            }]
        },
        value: ''
      }],
    memberof: 'blocks.queries'
  },
  disabled: {
    fullName: 'disabled',
    name: 'disabled',
    description: 'Sets the disabled attribute on an element',
    params: [{
        name: 'condition',
        rawName: '[condition=true]',
        types: ['boolean', 'undefined'],
        optional: true,
        isArguments: false,
        description: 'Determines if the element will be disabled or not',
        defaultValue: 'true',
        value: ''
      }],
    returns: undefined,
    examples: [],
    memberof: 'blocks.queries'
  },
  css: {
    fullName: 'css',
    name: 'css',
    description: 'Gets, sets or removes a CSS style from an element.\n Passing only the first parameter will return the CSS propertyName value.',
    params: [{
        name: 'name',
        rawName: 'name',
        types: ['string'],
        optional: false,
        isArguments: false,
        description: 'The name of the CSS property that will be get, set or removed',
        defaultValue: '',
        value: ''
      }, {
        name: 'value',
        rawName: 'value',
        types: ['string'],
        optional: false,
        isArguments: false,
        description: 'The value of the of the attribute. It will be set if condition is true',
        defaultValue: '',
        value: ''
      }],
    returns: undefined,
    examples: [{
        language: 'html',
        code: {
          name: '',
          children: [{
              name: 'hljs-tag',
              children: ['<', {
                  name: 'hljs-title',
                  children: ['script']
                }, '>']
            }, {
              name: 'less',
              children: ['\n  ', {
                  name: 'hljs-tag',
                  children: ['blocks']
                }, {
                  name: 'hljs-class',
                  children: ['.query']
                }, '({\n    ', {
                  name: 'hljs-attribute',
                  children: ['h1FontSize']
                }, ': ', {
                  name: 'hljs-number',
                  children: ['12']
                }, '\n  });\n']
            }, {
              name: 'hljs-tag',
              children: ['</', {
                  name: 'hljs-title',
                  children: ['script']
                }, '>']
            }, '\n', {
              name: 'hljs-tag',
              children: ['<', {
                  name: 'hljs-title',
                  children: ['h1']
                }, ' ', {
                  name: 'hljs-attribute',
                  children: ['data-query']
                }, '=', {
                  name: 'hljs-value',
                  children: ['"css(\'font-size\', h1FontSize)"']
                }, '>']
            }, {
              name: 'hljs-tag',
              children: ['</', {
                  name: 'hljs-title',
                  children: ['h1']
                }, '>']
            }, '\n', {
              name: 'hljs-tag',
              children: ['<', {
                  name: 'hljs-title',
                  children: ['h1']
                }, ' ', {
                  name: 'hljs-attribute',
                  children: ['data-query']
                }, '=', {
                  name: 'hljs-value',
                  children: ['"css(\'fontSize\', h1FontSize)"']
                }, '>']
            }, {
              name: 'hljs-tag',
              children: ['</', {
                  name: 'hljs-title',
                  children: ['h1']
                }, '>']
            }, '\n\n', {
              name: 'hljs-comment',
              children: ['<!-- will result in -->']
            }, '\n', {
              name: 'hljs-tag',
              children: ['<', {
                  name: 'hljs-title',
                  children: ['h1']
                }, ' ', {
                  name: 'hljs-attribute',
                  children: ['data-query']
                }, '=', {
                  name: 'hljs-value',
                  children: ['"css(\'font-size\', h1FontSize)"']
                }, ' ', {
                  name: 'hljs-attribute',
                  children: ['style']
                }, '=', {
                  name: 'hljs-value',
                  children: ['"font-size: 12px;"']
                }, '>']
            }, {
              name: 'hljs-tag',
              children: ['</', {
                  name: 'hljs-title',
                  children: ['h1']
                }, '>']
            }, '\n', {
              name: 'hljs-tag',
              children: ['<', {
                  name: 'hljs-title',
                  children: ['h1']
                }, ' ', {
                  name: 'hljs-attribute',
                  children: ['data-query']
                }, '=', {
                  name: 'hljs-value',
                  children: ['"css(\'fontSize\', h1FontSize)"']
                }, ' ', {
                  name: 'hljs-attribute',
                  children: ['style']
                }, '=', {
                  name: 'hljs-value',
                  children: ['"font-size: 12px;"']
                }, '>']
            }, {
              name: 'hljs-tag',
              children: ['</', {
                  name: 'hljs-title',
                  children: ['h1']
                }, '>']
            }]
        },
        value: ''
      }],
    memberof: 'blocks.queries'
  },
  width: {
    fullName: 'width',
    name: 'width',
    description: 'Sets the width of the element',
    params: [{
        name: 'value',
        rawName: 'value',
        types: ['number', 'string'],
        optional: false,
        isArguments: false,
        description: 'The new width of the element',
        defaultValue: '',
        value: ''
      }],
    returns: undefined,
    examples: [],
    memberof: 'blocks.queries'
  },
  height: {
    fullName: 'height',
    name: 'height',
    description: 'Sets the height of the element',
    params: [{
        name: 'value',
        rawName: 'value',
        types: ['number', 'string'],
        optional: false,
        isArguments: false,
        description: 'The new height of the element',
        defaultValue: '',
        value: ''
      }],
    returns: undefined,
    examples: [],
    memberof: 'blocks.queries'
  },
  on: {
    fullName: 'on',
    name: 'on',
    description: 'Subscribes to an event',
    params: [{
        name: 'events',
        rawName: 'events',
        types: ['String', 'Array'],
        optional: false,
        isArguments: false,
        description: 'The event or events to subscribe to',
        defaultValue: '',
        value: ''
      }, {
        name: 'callback',
        rawName: 'callback',
        types: ['Function'],
        optional: false,
        isArguments: false,
        description: 'The callback that will be executed when the event is fired',
        defaultValue: '',
        value: ''
      }, {
        name: 'args',
        rawName: '[args]',
        types: ['*'],
        optional: true,
        isArguments: false,
        description: 'Optional arguments that will be passed as second parameter to\n the callback function after the event arguments',
        defaultValue: '',
        value: ''
      }],
    returns: undefined,
    examples: [],
    memberof: 'blocks.queries'
  },
  view: {
    fullName: 'view',
    name: 'view',
    description: 'Associates the element with the particular view and creates a $view context property.\n The View will be automatically hidden and shown if the view have routing. The visibility\n of the View could be also controled using the isActive observable property',
    params: [{
        name: 'view',
        rawName: 'view',
        types: ['View'],
        optional: false,
        isArguments: false,
        description: 'The view to associate with the current element',
        defaultValue: '',
        value: ''
      }],
    returns: undefined,
    examples: [{
        language: 'html',
        code: {
          name: '',
          children: [{
              name: 'hljs-comment',
              children: ['<!-- Associating the div element and its children with the Profiles view -->']
            }, '\n', {
              name: 'hljs-tag',
              children: ['<', {
                  name: 'hljs-title',
                  children: ['div']
                }, ' ', {
                  name: 'hljs-attribute',
                  children: ['data-query']
                }, '=', {
                  name: 'hljs-value',
                  children: ['"view(Profiles)"']
                }, '>']
            }, '\n  ', {
              name: 'hljs-comment',
              children: ['<!-- looping through the View users collection -->']
            }, '\n  ', {
              name: 'hljs-tag',
              children: ['<', {
                  name: 'hljs-title',
                  children: ['ul']
                }, ' ', {
                  name: 'hljs-attribute',
                  children: ['data-query']
                }, '=', {
                  name: 'hljs-value',
                  children: ['"each(users)"']
                }, '>']
            }, '\n    ', {
              name: 'hljs-comment',
              children: ['<!-- Using the $view context value to point to the View selectUser handler -->']
            }, '\n    ', {
              name: 'hljs-tag',
              children: ['<', {
                  name: 'hljs-title',
                  children: ['li']
                }, ' ', {
                  name: 'hljs-attribute',
                  children: ['data-query']
                }, '=', {
                  name: 'hljs-value',
                  children: ['"click($view.selectUser)"']
                }, '>']
            }, '{{username}}', {
              name: 'hljs-tag',
              children: ['</', {
                  name: 'hljs-title',
                  children: ['li']
                }, '>']
            }, '\n  ', {
              name: 'hljs-tag',
              children: ['</', {
                  name: 'hljs-title',
                  children: ['ul']
                }, '>']
            }, '\n', {
              name: 'hljs-tag',
              children: ['</', {
                  name: 'hljs-title',
                  children: ['div']
                }, '>']
            }]
        },
        value: ''
      }, {
        language: 'javascript',
        code: {
          name: '',
          children: [{
              name: 'hljs-keyword',
              children: ['var']
            }, ' App = blocks.Application();\n\nApp.View(', {
              name: 'hljs-string',
              children: ['\'Profiles\'']
            }, ', {\n  users: [{ username: ', {
              name: 'hljs-string',
              children: ['\'John\'']
            }, ' }, { username: ', {
              name: 'hljs-string',
              children: ['\'Doe\'']
            }, ' }],\n\n  selectUser: ', {
              name: 'hljs-function',
              children: [{
                  name: 'hljs-keyword',
                  children: ['function']
                }, ' (', {
                  name: 'hljs-params',
                  children: ['e']
                }, ') ']
            }, '{\n    ', {
              name: 'hljs-comment',
              children: ['// ...stuff...']
            }, '\n  }\n});']
        },
        value: ''
      }],
    memberof: 'blocks.queries'
  },
  navigateTo: {
    fullName: 'navigateTo',
    name: 'navigateTo',
    description: 'Navigates to a particular view by specifying the target view or route and optional parameters',
    params: [{
        name: 'viewOrRoute',
        rawName: 'viewOrRoute',
        types: ['View', 'String'],
        optional: false,
        isArguments: false,
        description: 'the view or route to which to navigate to',
        defaultValue: '',
        value: ''
      }, {
        name: 'params',
        rawName: '[params]',
        types: ['Object'],
        optional: true,
        isArguments: false,
        description: 'parameters needed for the current route',
        defaultValue: '',
        value: ''
      }],
    returns: undefined,
    examples: [{
        language: 'html',
        code: {
          name: '',
          children: [{
              name: 'hljs-comment',
              children: ['<!-- will navigate to /contactus because the ContactUs View have /contactus route -->']
            }, '\n', {
              name: 'hljs-tag',
              children: ['<', {
                  name: 'hljs-title',
                  children: ['a']
                }, ' ', {
                  name: 'hljs-attribute',
                  children: ['data-query']
                }, '=', {
                  name: 'hljs-value',
                  children: ['"navigateTo(ContactUs)"']
                }, '>']
            }, 'Contact Us', {
              name: 'hljs-tag',
              children: ['</', {
                  name: 'hljs-title',
                  children: ['a']
                }, '>']
            }, '\n\n', {
              name: 'hljs-comment',
              children: ['<!-- will navigate to /products/t-shirts because the Products View have /products/{{category}} route -->']
            }, '\n', {
              name: 'hljs-tag',
              children: ['<', {
                  name: 'hljs-title',
                  children: ['a']
                }, ' ', {
                  name: 'hljs-attribute',
                  children: ['data-query']
                }, '=', {
                  name: 'hljs-value',
                  children: ['"navigateTo(Products, { category: \'t-shirts\' })"']
                }, '>']
            }, 'T-Shirts', {
              name: 'hljs-tag',
              children: ['</', {
                  name: 'hljs-title',
                  children: ['a']
                }, '>']
            }, '\n\n', {
              name: 'hljs-comment',
              children: ['<!-- the same example as above but the route is directly specifying instead of using the View instance -->']
            }, '\n', {
              name: 'hljs-tag',
              children: ['<', {
                  name: 'hljs-title',
                  children: ['a']
                }, ' ', {
                  name: 'hljs-attribute',
                  children: ['data-query']
                }, '=', {
                  name: 'hljs-value',
                  children: ['"navigateTo(\'/products/{{category}}\', { category: \'t-shirts\' })"']
                }, '>']
            }, 'T-Shirts', {
              name: 'hljs-tag',
              children: ['</', {
                  name: 'hljs-title',
                  children: ['a']
                }, '>']
            }]
        },
        value: ''
      }],
    memberof: 'blocks.queries'
  }
}
})();// @debug-code
  })();

  (function () {
    
(function () {


  var blocksAt = blocks.at;
  blocks.at = function (index) {
    return {
      index: index,
      prototypeIndentification: '__blocks.at__'
    };
  };

  blocks.first = function () {
    return blocks.first;
  };

  blocks.last = function () {
    return blocks.last;
  };

  var positions = {
    isPosition: function (position) {
      return position == blocks.first || position == blocks.last || (position && position.prototypeIndentification == '__blocks.at__');
    },

    determineIndex: function (value, length) {
      if (value == blocks.first) {
        return 0;
      } else if (value.prototypeIndentification == '__blocks.at__') {
        return value.index;
      }
      return length;
    }
  };

    var methodsData = {};


  /**
  * @namespace blocks.expressions
  */

  /**
  * @memberof blocks.expressions
  * @class BaseExpression
  */
  function BaseExpression(value, parent) {
    this._value = value;
    this._computedValue = undefined;
    if (parent) {
      this._parent = parent;
      this._currentResult = blocks.isBoolean(parent._result) ? parent._result : parent._currentResult;
      this._lastCondition = parent._condition || parent._lastCondition;
      this._hasNot = parent._hasNot;
    }
  }

  BaseExpression.prototype = {
    _prototypeIndentification: '__blocks.expression__',
    _expression: BaseExpression,

    /**
    * @memberof BaseExpression
    * @returns {String}
    */
    type: function () {
      return 'base';
    },

    /**
    * @memberof BaseExpression
    * @param {(String|Array)} types - 
    * @returns {boolean}
    */
    is: function (types) {
      this._setResult(blocks.is(this._value, types));
      return this;
    },

    /**
    * Description
    * @memberof BaseExpression
    */
    value: function () {
      return this._value;
    },

    /**
    * @memberof BaseExpression
    * @returns {Expression}
    */
    not: function () {
      var expression = new this._expression(this._value, this);
      expression._hasNot = !this._hasNot;
      return expression;
    },

    /**
    * @memberof 
    */
    or: function () {
      var expression = new this._expression(this._value, this);
      expression._condition = 'or';
      return expression;
    },

    and: function () {
      var expression = new this._expression(this._value, this);
      expression._condition = 'and';
      return expression;
    },

    result: function () {
      return this._not ? !this._result : this._result;
    },

    each: function (/*callback, thisArg*/) {
      //if (thisArg !== undefined) {
      //    callback.call(this._value, 0, this.toArray());
      //} else {
      //    callback(this._value, 0, this.toArray());
      //}
    },

    equals: function (value, deepEqual) {
      var expression = new this._expression(this._value, this);
      expression._setResult(blocks.equals(this._value, value, deepEqual));
      return expression;
    },

    hasValue: function () {
      return this._resultExpression(blocks.hasValue(this._value));
    },

    toString: function () {
      return new StringExpression(blocks.toString(this._value));
    },

    toArray: function () {
      return new RootArrayExpression(blocks.toArray(this.value()));
    },

    clone: function (deepClone) {
      return blocks(blocks.clone(this._value, deepClone));
    },

    _setResult: function (result) {
      if (this._hasNot) {
        result = !result;
      }
      switch (this._lastCondition) {
        case 'and':
          this._result = this._currentResult && result;
          break;
        case 'or':
          this._result = this._currentResult || result;
          break;
        default:
          this._result = result;
          break;
      }
      this._hasNot = false;
      this._lastCondition = undefined;
    },

    _resultExpression: function (result) {
      var expression = new this._expression(this._value, this);
      expression._setResult(result);
      return expression;
    }
  };

  blocks.extend(blocks, {
    isEmpty: function (value) {
      if (value == null) {
        return true;
      }
      if (blocks.isArray(value) || blocks.isString(value) || blocks.isArguments(value)) {
        return !value.length;
      }
      for (var key in value) {
        if (blocks.has(value, key)) {
          return false;
        }
        return true;
      }
      return true;
    }
  });
    var identity = function (value) {
    return value;
  };

    var hasOwn = Object.prototype.hasOwnProperty;


  var nativeMax = Math.max;
  var ceil = Math.ceil;

  blocks.extend(blocks, {
    range: function (start, end, step) {
      tart = +start || 0;
      step = typeof step == 'number' ? step : (+step || 1);

      if (end == null) {
        end = start;
        start = 0;
      }
      var index = -1;
      var length = nativeMax(0, ceil((end - start) / (step || 1)));
      var result = Array(length);

      while (++index < length) {
        result[index] = start;
        start += step;
      }
      return result;
    },

    groupBy: function (collection, accessor, thisArg) {
      return group(function (result, key, value) {
        if (!hasOwn.call(result, key)) {
          result[key] = [];
        }
        result[key].push(value);
      }, collection, accessor, thisArg);
    },

    countBy: function (collection, accessor, thisArg) {
      return group(function (result, key) {
        if (!hasOwn.call(result, key)) {
          result[key] = 0;
        }
        result[key]++;
      }, collection, accessor, thisArg);
    },

    sortBy: function (collection, callback, thisArg) {
      var length = callback ? callback.length : 0;
      var dir;
      var sortExpression;
      var result;
      var a;
      var b;

      if (blocks.isPlainObject(callback)) {
        callback = [callback];
        length = 1;
      }
      if (blocks.isArray(callback)) {
        if (length > 0) {
          return collection.sort(function (left, right) {
            for (i = 0; i < length; i++) {
              sortExpression = callback[i];
              dir = sortExpression.dir ? sortExpression.dir.toLowerCase() : 'asc';
              if (dir == 'none') {
                continue;
              }
              a = left[sortExpression.field];
              b = right[sortExpression.field];
              if (a !== b) {
                result = a > b ? 1 : -1;
                return dir == 'desc' ? -result : result;
              }
            }
          });
        }
        return collection;
      }

      callback = PrepareValues.parseCallback(callback, thisArg);
      if (!callback) {
        callback = identity;
      }
      return blocks(collection).map(function (value, index, list) {
        return {
          value: value,
          index: index,
          criteria: callback(value, index, list)
        };
      }).sort(function (left, right) {
        a = left.criteria;
        b = right.criteria;
        if (a !== b) {
          if (a > b || a === undefined) return 1;
          if (a < b || b === undefined) return -1;
        }
        return left.index - right.index;
      }).map('value').value();
    }
  });

  function group(behavior, array, accessor, thisArg) {
    accessor = PrepareValues.parseCallback(accessor, thisArg) || accessor;

    var result = {};
    var i = 0;
    var length = array.length;
    var isAccessorACallback = blocks.isFunction(accessor);
    var hasAccessor = accessor != null;
    var value;
    var key;

    for (; i < length; i++) {
      value = array[i];
      key = hasAccessor ? isAccessorACallback ? accessor(value, i, array) : value[accessor] : value;
      behavior(result, key, value, array, accessor);
    }
    return result;
  }

    var staticMethods = {};

    var slice = Array.prototype.slice;


  var HelperDescriptors = {
    skip: function () {
      return {
        name: 'skip',
        args: ['skip']
      }
    },

    take: function () {
      return {
        name: 'take',
        args: ['take']
      }
    },

    and: function () {
      return {
        name: 'and',
        args: []
      }
    },

    or: function () {
      return {
        name: 'or',
        args: []
      }
    },

    not: function () {
      return {
        name: 'not',
        args: []
      }
    },

    reverse: function () {
      return {
        name: 'reverse',
        args: []
      };
    }
  };

  for (var key in HelperDescriptors) {
    HelperDescriptors[key].identity = key;
  }

  var core = blocks.core;
  
  var PrepareValues = {
    parseCallback: function (callback, thisArg) {
      if (typeof callback == 'string') {
        var fieldName = callback;
        return function (value) {
          return value[fieldName];
        };
      }
      if (thisArg != null) {
        var orgCallback = callback;
        callback = function (value, index, collection) {
          return orgCallback.call(thisArg, value, index, collection);
        };
      }
      return callback;
    },

    uniquePrepare: function (callback, thisArg) {
      if (!blocks.isFunction(callback)) {
        return callback;
      }
      return PrepareValues.parseCallback(callback, thisArg);
    },

    mapPrepare: function (callback, thisArg) {
      //if (thisArg != null) {
      //    var orgCallback = callback;
      //    callback = function (value, index, collection) {
      //        return orgCallback.call(thisArg, value, index, collection);
      //    };
      //};
      //return callback;
      return PrepareValues.parseCallback(callback, thisArg);
    },

    filterPrepare: function (callback, thisArg) {
      if (blocks.isFunction(callback) || blocks.isString(callback)) {
        return PrepareValues.parseCallback(callback, thisArg);
      }
      return PrepareValues.createFilterCallback(callback);
    },

    reducePrepare: function (callback, memo, thisArg) {
      if (blocks.isFunction(callback) || blocks.isString(callback)) {
        return PrepareValues.parseCallback(callback, thisArg);
      }
      return PrepareValues.parseCallback(callback, thisArg);
    },

    createFilterCallback: function (filterExpressions) {
      return function (value) {
        return PrepareValues.resolveFilterExpressionValue(false, value, filterExpressions);
      };
    },

    resolveFilterExpressionValue: function (result, value, filterExpression) {
      if (filterExpression.field && filterExpression.operator) {
        var compareValue = filterExpression.value;
        value = value[filterExpression.field];
        switch (filterExpression.operator.toLowerCase()) {
          case 'eq':
            result = value === compareValue;
            break;
          case 'neq':
            result = value !== compareValue;
            break;
          case 'lt':
            result = value < compareValue;
            break;
          case 'lte':
            result = value <= compareValue;
            break;
          case 'gt':
            result = value > compareValue;
            break;
          case 'gte':
            result = value >= compareValue;
            break;
          case 'startswith':
            result = blocks(value).startsWith(compareValue);
            break;
          case 'endswith':
            result = blocks(value).endsWith(compareValue);
            break;
          case 'contains':
            result = value.indexOf(compareValue) !== -1;
            break;
        }
        return result;
      } else if (filterExpression.logic && filterExpression.filters) {
        if (result && filterExpression.logic == 'or') {
          return true;
        } else {
          var currentResult = false,
              length = filterExpression.filters.length,
              i = 0;
          for (; i < length; i++) {
            currentResult = PrepareValues.resolveFilterExpressionValue(false, value, filterExpression.filters[i]);
            if (currentResult && filterExpression.logic == 'or') {
              break;
            }
          }
          return currentResult;
        }
      } else {
        for (var key in filterExpression) {
          if (value[key] !== filterExpression[key]) {
            return false;
          }
        }
        return true;
      }
    },

    flatten: function (shallow, value, result) {
      if (blocks.isArray(value) || blocks.isArguments(value)) {
        if (shallow) {
          result.push.apply(result, value);
        } else {
          for (var i = 0; i < value.length; i++) {
            PrepareValues.flatten(shallow, value[i], result);
          }
        }
      } else {
        result.push(value);
      }
    }
  };
  PrepareValues.reduceRightPrepare = PrepareValues.reducePrepare;

  for (var key in PrepareValues) {
    core[key] = PrepareValues[key];
  }


var CollectionDescriptors = {
contains: function anonymous(index,type,expression,tillExpressions,skipTake
/**/) {
return {
boolResult: false,
args: ['searchValue'],
beforeLoop: 'result' + index + '=false;',
inLoop: 'if (value===searchValue' + index + '){result' + index + '=true;break ;};'}
},each: function anonymous(index,type,expression,tillExpressions,skipTake
/**/) {
var prepareValues = 'callback' + index + '=blocks.core.parseCallback(callback' + index + ',thisArg' + index + ');';
return {
args: ['callback', 'thisArg'],
beforeLoop: (index === ''?'' + prepareValues + '':''),
inLoop: 'callback' + index + '(value,indexOrKey,collection);',
prepareValues: prepareValues}
},
// Objects with different constructors are not equivalent, but `Object`s
equals: function anonymous(index,type,expression,tillExpressions,skipTake
/**/) {
var prepareValues = 'deepEqual' + index + '=deepEqual' + index + '===false?false:true;';
return {
boolResult: true,
args: ['compareValue', 'deepEqual'],
beforeLoop: (index === ''?'' + prepareValues + '':'')+'var index' + index + '=0;var resultResolved' + index + '=false;var size' + index + '=0;var key' + index + ';result' + index + '=true;if (Object.prototype.toString.call(collection)!==Object.prototype.toString.call(compareValue' + index + ')){result' + index + '=false;resultResolved' + index + '=true;};if (!resultResolved' + index + '){var aCtor=collection.constructor;var bCtor=compareValue' + index + '.constructor;if (aCtor!==bCtor&&!(blocks.isFunction(aCtor)&&aCtor instanceof aCtor&&blocks.isFunction(bCtor)&&bCtor instanceof bCtor)&&("constructor" in collection&&"constructor" in compareValue' + index + ')){result' + index + '=false;resultResolved' + index + '=true;}};',
inLoop: (type == 'array'?'if (!resultResolved' + index + '){if (deepEqual' + index + '?!blocks.equals(value,compareValue' + index + '[size' + index + '],true):value!==compareValue' + index + '[size' + index + ']){result' + index + '=false;break;}size' + index + '+=1;};':'')+(type == 'object'?'if (!resultResolved' + index + '){if (blocks.has(collection,indexOrKey)){if (!blocks.has(compareValue' + index + ',indexOrKey)||(deepEqual' + index + '?!blocks.equals(value,compareValue' + index + '[indexOrKey],true):value!==compareValue' + index + '[indexOrKey])){result' + index + '=false;break;}size' + index + '+=1;}};':''),
afterLoop: (type == 'array'?'if (!compareValue' + index + '||size' + index + '!==compareValue' + index + '.length){result' + index + '=false;resultResolved' + index + '=true;};':'')+(type == 'object'?'if (!resultResolved' + index + '&&result' + index + '){for (key' + index + ' in compareValue' + index + '){if (blocks.has(compareValue' + index + ',key' + index + ')&&!size' + index + '--){break ;}}result' + index + '=!size' + index + ';};':''),
prepareValues: prepareValues}
},every: function anonymous(index,type,expression,tillExpressions,skipTake
/**/) {
var prepareValues = 'callback' + index + '=blocks.core.parseCallback(callback' + index + ',thisArg' + index + ');';
return {
boolResult: true,
args: ['callback', 'thisArg'],
beforeLoop: 'result' + index + '=true;'+(index === ''?'' + prepareValues + '':''),
inLoop: 'if (callback' + index + '){if (!callback' + index + '(value,indexOrKey,collection)){result' + index + '=false;break ;}}else if (!value){result' + index + '=false;break ;};',
prepareValues: prepareValues}
},filter: function anonymous(index,type,expression,tillExpressions,skipTake
/**/) {
var prepareValues = 'callback' + index + '=blocks.core.filterPrepare(callback' + index + ',thisArg' + index + ');';
return {
args: ['callback', 'thisArg'],
beforeLoop: (index === ''?'' + prepareValues + '':'')+(index === '' || tillExpressions.length === 0?''+(type == 'array'?'result' + index + '=[];':'')+(type == 'object'?'result' + index + '={};':''):''),
inLoop: 'if (!callback' + index + '(value,indexOrKey,collection)){continue ;};' + skipTake + ';'+(index === '' || tillExpressions.length === 0?''+(type == 'array'?'result' + index + '.push(value);':'')+(type == 'object'?'result' + index + '[indexOrKey]=value;':''):''),
prepareValues: prepareValues}
},first: function anonymous(index,type,expression,tillExpressions,skipTake
/**/) {
var prepareValues = 'if (callback' + index + '){callback' + index + '=blocks.core.parseCallback(callback' + index + ',thisArg' + index + ');};';
return {
args: ['callback', 'thisArg'],
beforeLoop: 'var isNumber' + index + '=blocks.isNumber(callback' + index + ');var size' + index + '=0;var count' + index + '=1;var current' + index + ';if (isNumber' + index + '){result' + index + '=[];count' + index + '=callback' + index + ';callback' + index + '=thisArg' + index + ';};'+(index === ''?'' + prepareValues + '':''),
inLoop: 'if (callback' + index + '){if (callback' + index + '(value,indexOrKey,collection)){current' + index + '=value;}else {continue ;}}else {current' + index + '=value;};if (isNumber' + index + '){if (size' + index + '++>=count' + index + '){break ;}result' + index + '.push(current' + index + ');}else {result' + index + '=current' + index + ';break ;};',
prepareValues: prepareValues,
everything: true}
},has: function anonymous(index,type,expression,tillExpressions,skipTake
/**/) {
return {
boolResult: false,
args: ['key'],
beforeLoop: 'result' + index + '=false;',
afterLoop: 'result' + index + '=blocks.has(collection,key' + index + ');'}
},
// TODO: ifNeedsResult could be removed and automatically detect if you need to include the this.result in the descriptor string
invoke: function anonymous(index,type,expression,tillExpressions,skipTake
/**/) {
return {
args: ['method', 'args'],
beforeLoop: 'var isFunc' + index + '=blocks.isFunction(method' + index + ');'+(index === '' || tillExpressions.length === 0?''+(type == 'array'?'result' + index + '=[];':'')+(type == 'object'?'result' + index + '={};':''):'')+(index === ''?'args' + index + '=Array.prototype.slice.call(arguments,2);':''),
inLoop: 'value=(isFunc' + index + '?method' + index + ':value[method' + index + ']).apply(value,args' + index + '||[]);'+(index === '' || tillExpressions.length === 0?''+(type == 'array'?'result' + index + '.push(value);':'')+(type == 'object'?'result' + index + '[indexOrKey]=value;':''):'')}
},isEmpty: function anonymous(index,type,expression,tillExpressions,skipTake
/**/) {
return {
boolResult: true,
beforeLoop: 'result' + index + '=true;',
inLoop: 'result' + index + '=false;'}
},join: function anonymous(index,type,expression,tillExpressions,skipTake
/**/) {
return {
args: ['separator'],
beforeLoop: 'separator' + index + '=typeof separator' + index + '=="undefined"?",":separator' + index + ';result' + index + '="";',
inLoop: 'result' + index + '+=value+separator' + index + ';',
afterLoop: 'result' + index + '=result' + index + '.substring(0,result' + index + '.length-separator' + index + '.length);'}
},
// NOTE: The code could be minified using UglifyJS.
map: function anonymous(index,type,expression,tillExpressions,skipTake
/**/) {
var prepareValues = 'callback' + index + '=blocks.core.parseCallback(callback' + index + ',thisArg' + index + ');';
return {
args: ['callback', 'thisArg'],
beforeLoop: (index === ''?'' + prepareValues + '':'')+(index === ''?''+(type == 'array'?'result' + index + '=Array(collection.length);':'')+(type == 'object'?'result' + index + '=[];':''):'')+(index !== '' && tillExpressions.length === 0?'result' + index + '=[];':''),
inLoop: 'value=callback' + index + '(value,indexOrKey,collection);'+(index === ''?''+(type == 'array'?'result' + index + '[indexOrKey]=value;':'')+(type == 'object'?'result' + index + '.push(value);':''):'')+(index !== '' && tillExpressions.length === 0?'result' + index + '.push(value);':''),
prepareValues: prepareValues}
},max: function anonymous(index,type,expression,tillExpressions,skipTake
/**/) {
var prepareValues = 'callback' + index + '=blocks.core.parseCallback(callback' + index + ',thisArg' + index + ');';
return {
args: ['callback', 'thisArg'],
beforeLoop: 'var max' + index + '=-Infinity;result' + index + '=max' + index + ';'+(index === ''?'' + prepareValues + '':''),
inLoop: 'max' + index + '=callback' + index + '?callback' + index + '(value,indexOrKey,collection):value;result' + index + '=max' + index + '>result' + index + '?max' + index + ':result' + index + ';',
prepareValues: prepareValues,
type: 'NumberExpression'}
},min: function anonymous(index,type,expression,tillExpressions,skipTake
/**/) {
var prepareValues = 'callback' + index + '=blocks.core.parseCallback(callback' + index + ',thisArg' + index + ');';
return {
args: ['callback', 'thisArg'],
beforeLoop: 'var min' + index + '=Infinity;result' + index + '=min' + index + ';'+(index === ''?'' + prepareValues + '':''),
inLoop: 'min' + index + '=callback' + index + '?callback' + index + '(value,indexOrKey,collection):value;result' + index + '=min' + index + '<result' + index + '?min' + index + ':result' + index + ';',
prepareValues: prepareValues,
type: 'NumberExpression'}
},reduce: function anonymous(index,type,expression,tillExpressions,skipTake
/**/) {
var prepareValues = 'callback' + index + '=blocks.core.reducePrepare(callback' + index + ',memo' + index + ',thisArg' + index + ');';
return {
args: ['callback', 'memo', 'thisArg'],
beforeLoop: 'var hasMemo' + index + '=memo' + index + '!=null;result' + index + '=memo' + index + ';'+(index === ''?'' + prepareValues + '':''),
inLoop: 'if (hasMemo' + index + '){result' + index + '=callback' + index + '(result' + index + ',value,indexOrKey,collection);}else {result' + index + '=collection[indexOrKey];hasMemo' + index + '=true;};',
prepareValues: prepareValues,
everything: true}
},size: function anonymous(index,type,expression,tillExpressions,skipTake
/**/) {
return {
beforeLoop: (index === ''?''+(type == 'array'?'return collection.length;':''):'')+'result' + index + '=0;',
inLoop: 'result' + index + '++;',
type: 'NumberExpression'}
},some: function anonymous(index,type,expression,tillExpressions,skipTake
/**/) {
var prepareValues = 'callback' + index + '=blocks.core.parseCallback(callback' + index + ',thisArg' + index + ');';
return {
boolResult: false,
args: ['callback', 'thisArg'],
beforeLoop: 'result' + index + '=false;'+(index === ''?'' + prepareValues + '':''),
inLoop: 'if (callback' + index + '){if (callback' + index + '(value,indexOrKey,collection)){result' + index + '=true;break ;}}else if (value){result' + index + '=true;break ;};',
prepareValues: prepareValues}
},type: 'collection'
};for (var key in CollectionDescriptors) {CollectionDescriptors[key].identity = key;CollectionDescriptors[key].parent = CollectionDescriptors;}

var ArrayDescriptors = {

/**
 * Creates an array of elements from the specified indexes, or keys, of the collection. Indexes may be specified as individual arguments or as arrays of indexes.
 * @memberof ArrayExpression
 * @param  {number} position - The position from which to start extracting
 * @param  {number} [count]  - The number of items to be extracted
 * @returns {Array}           - Returns a new array of elements corresponding to the provided indexes
 *
 * @example {javascript}
 * blocks.at(['a', 'b', 'c', 'd', 'e'], [0, 2, 4]);
 * // → ['a', 'c', 'e']
 * blocks.at(['fred', 'barney', 'pebbles'], 0, 2);
 * // → ['fred', 'pebbles']
 */
at: function anonymous(index,type,expression,tillExpressions,skipTake
/**/) {
return {
args: ['position', 'count'],
beforeLoop: 'var isArray' + index + '=blocks.isNumber(count' + index + ');var size' + index + '=0;indexOrKey=position' + index + '-1;if (isArray' + index + '){result' + index + '=[];};',
inLoop: 'if (isArray' + index + '){if (size' + index + '++>=count' + index + '){break ;}result' + index + '.push(value);}else {result=value;break ;};'}
},
/**
 * Flattens a nested array (the nesting can be to any depth).
 * If isShallow is truthy, the array will only be flattened a single level.
 * If a callback is provided each element of the array is passed through the callback before flattening.
 * The callback is bound to thisArg and invoked with three arguments; (value, index, array).
 * If a property name is provided for callback the created "_.pluck" style callback will return the property value of the given element.
 *
 * @memberof ArrayExpression
 * @param  {boolean} shallow - A flag to restrict flattening to a single level.
 * @returns {Array} - Returns a new flattened array.
 *
 * @example {javascript}
 * blocks.flatten([1, [2], [3, [[4]]]]);
 * // → [1, 2, 3, 4];
 *
 * blocks.flatten([1, [2], [3, [[4]]]], true);
 * // → [1, 2, 3, [[4]]];
 *
 * var characters = [
 *  { 'name': 'barney', 'age': 30, 'pets': ['hoppy'] },
 *  { 'name': 'fred',   'age': 40, 'pets': ['baby puss', 'dino'] }
 * ];
 *
 * // using "_.pluck" callback shorthand
 * blocks.flatten(characters, 'pets');
 * // → ['hoppy', 'baby puss', 'dino']
 */
flatten: function anonymous(index,type,expression,tillExpressions,skipTake
/**/) {
return {
args: ['shallow'],
beforeLoop: 'var flatten' + index + '=blocks.core.flatten;result' + index + '=[];',
inLoop: 'flatten' + index + '(shallow' + index + ',value,result' + index + ');'}
},
/**
 * Gets the index at which the first occurrence of value is found using strict equality for comparisons, i.e. ===.
 * If the array is already sorted providing true for fromIndex will run a faster binary search
 *
 * @memberof ArrayExpression
 * @param {*} searchValue - The value to search for
 * @param {number|boolean} fromIndex - The index to search from or true to perform a binary search on a sorted array
 * @returns {number} - Returns the index of the matched value or -1
 * 
 * @example {javascript}
 * blocks.indexOf([1, 2, 3, 1, 2, 3], 2);
 * // → 1
 *
 * blocks.indexOf([1, 2, 3, 1, 2, 3], 2, 3);
 * // → 4
 *
 * blocks.indexOf([1, 1, 2, 2, 3, 3], 2, true);
 * // → 2
 */
indexOf: function anonymous(index,type,expression,tillExpressions,skipTake
/**/) {
return {
args: ['searchValue', 'fromIndex'],
beforeLoop: 'result' + index + '=-1;if (blocks.isNumber(fromIndex' + index + ')){indexOrKey=fromIndex' + index + ';};',
inLoop: 'if (value===searchValue' + index + '){result' + index + '=indexOrKey;break ;};',
type: 'NumberExpression'}
},
/**
 * Gets the last element or last n elements of an array. If a callback is provided elements at the end of the array are returned as long as the callback returns truthy.
 * The callback is bound to thisArg and invoked with three arguments; (value, index, array).
 * If a property name is provided for callback the created "_.pluck" style callback will return the property value of the given element.
 * If an object is provided for callback the created "_.where" style callback will return true for elements that have the properties of the given object, else false.
 *
 * @memberof ArrayExpression
 * @param   {(Function|Object|number|string)} callback - The function called per element or the number of elements to return. If a property name or object is provided it will be used to create a ".pluck" or ".where" style callback, respectively.
 * @param   {*}  thisArg - The this binding of callback.
 * @returns {*} - Returns the last element(s) of array.
 *
 * @example {javascript}
 * blocks.last([1, 2, 3]);
 * // → 3
 *
 * blocks.last([1, 2, 3], 2);
 * // → [2, 3]
 *
 * blocks.last([1, 2, 3], function(num) {
 *  return num > 1;
 * })
 * // → [2, 3]
 *
 * var characters = [
 *  { 'name': 'barney',  'blocked': false, 'employer': 'slate' },
 *  { 'name': 'fred',    'blocked': true,  'employer': 'slate' },
 *  { 'name': 'pebbles', 'blocked': true,  'employer': 'na' }
 * ];
 *
 * // using "_.pluck" callback shorthand
 * blocks.pluck(_.last(characters, 'blocked'), 'name');
 * // → ['fred', 'pebbles']
 *
 * // using "_.where" callback shorthand
 * blocks.last(characters, { 'employer': 'na' });
 * // → [{ 'name': 'pebbles', 'blocked': true, 'employer': 'na' }]
 */
last: function anonymous(index,type,expression,tillExpressions,skipTake
/**/) {
var prepareValues = 'if (callback' + index + '){callback' + index + '=blocks.core.parseCallback(callback' + index + ',thisArg' + index + ');};';
return {
reverse: true,
args: ['callback', 'thisArg'],
beforeLoop: 'var isNumber' + index + '=blocks.isNumber(callback' + index + ');var size' + index + '=0;var count' + index + '=1;var current' + index + ';if (isNumber' + index + '){result' + index + '=[];count' + index + '=callback' + index + ';callback' + index + '=thisArg' + index + ';};'+(index === ''?'' + prepareValues + '':''),
inLoop: 'if (callback' + index + '){if (callback' + index + '(value,indexOrKey,collection)){current' + index + '=value;}else {continue ;}}else {current' + index + '=value;};if (isNumber' + index + '){if (size' + index + '++>=count' + index + '){break ;}result' + index + '.unshift(current' + index + ');}else {result' + index + '=current' + index + ';break ;};',
prepareValues: prepareValues,
everything: true}
},
/**
 * Gets the index at which the last occurrence of value is found using strict equality for comparisons, i.e. ===. If fromIndex is negative, it is used as the offset from the end of the collection.
 *
 * If a property name is provided for callback the created "_.pluck" style callback will return the property value of the given element.
 *
 * If an object is provided for callback the created "_.where" style callback will return true for elements that have the properties of the given object, else false.
 *
 * @memberof ArrayExpression
 * @param {*} searchValue - The value to search for.
 * @param {number} [fromIndex=array.length - 1] - The index to search from.
 * @returns {number} - Returns the index of the matched value or -1.
 *
 * @example {javascript}
 * blocks.lastIndexOf([1, 2, 3, 1, 2, 3], 2);
 * // → 4
 *
 * blocks.lastIndexOf([1, 2, 3, 1, 2, 3], 2, 3);
 * // → 1
 */
lastIndexOf: function anonymous(index,type,expression,tillExpressions,skipTake
/**/) {
return {
reverse: true,
args: ['searchValue', 'fromIndex'],
beforeLoop: 'result' + index + '=-1;if (blocks.isNumber(fromIndex' + index + ')){indexOrKey=fromIndex' + index + ';};',
inLoop: 'if (value===searchValue' + index + '){result' + index + '=indexOrKey;break ;};',
type: 'NumberExpression'}
},
/**
﻿ * Creates an array of numbers (positive and/or negative) progressing from start up to but not including end.
﻿ * If start is less than stop a zero-length range is created unless a negative step is specified.
﻿ *
﻿ * @memberof ArrayExpression
﻿ * @param   {number} [start=0] - The start of the range
﻿ * @param   {number} end - The end of the range
﻿ * @param   {number} [step=1] - The value to increment or decrement by
﻿ * @returns {Array} - Returns a new range array
﻿ *
﻿ * @example {javascript}
﻿ * blocks.range(4);
﻿ * // → [0, 1, 2, 3]
﻿ *
﻿ * blocks.range(1, 5);
﻿ * // → [1, 2, 3, 4]
﻿ *
﻿ * blocks.range(0, 20, 5);
﻿ * // → [0, 5, 10, 15]
﻿ *
﻿ * blocks.range(0, -4, -1);
﻿ * // → [0, -1, -2, -3]
﻿ *
﻿ * blocks.range(1, 4, 0);
﻿ * // → [1, 1, 1]
﻿ *
﻿ * blocks.range(0);
﻿ * // → []
﻿ */
range: function anonymous(index,type,expression,tillExpressions,skipTake
/**/) {
return {
args: ['start', 'end', 'step'],
beforeLoop: 'length=Math.max(Math.ceil((end' + index + '-start' + index + ')/step' + index + '),0);result' + index + '=Array(length);',
inLoop: 'value=start' + index + ';start' + index + '+=step' + index + ';'+(index === '' || tillExpressions.length === 0?'result' + index + '[indexOrKey]=value;':'')}
},
// TODO: reduceRight and lastIndexOf are equal to code as reduce and indexOf respectivly
reduceRight: function anonymous(index,type,expression,tillExpressions,skipTake
/**/) {
return {
reverse: true,
args: ['callback', 'memo', 'thisArg'],
beforeLoop: 'var hasMemo' + index + '=memo' + index + '!=null;result' + index + '=memo' + index + ';'+(index === ''?'callback' + index + '=blocks.core.reducePrepare(callback' + index + ',memo' + index + ',thisArg' + index + ');':''),
inLoop: 'if (hasMemo' + index + '){result' + index + '=callback' + index + '(result' + index + ',value,indexOrKey,collection);}else {result' + index + '=collection[indexOrKey];hasMemo' + index + '=true;};',
everything: true}
},unique: function anonymous(index,type,expression,tillExpressions,skipTake
/**/) {
var prepareValues = 'callback' + index + '=blocks.core.uniquePrepare(callback' + index + ',thisArg' + index + ');';
return {
args: ['callback', 'thisArg'],
beforeLoop: 'var seen' + index + '=[];var isFirst' + index + '=true;var isSorted' + index + '=blocks.isBoolean(callback' + index + ')&&callback' + index + ';var hasCallback' + index + '=blocks.isFunction(callback' + index + ');var map' + index + ';result' + index + '=[];'+(index === ''?'' + prepareValues + '':''),
inLoop: 'map' + index + '=hasCallback' + index + '?callback' + index + '(value,indexOrKey,collection):value;if (isSorted' + index + '?isFirst' + index + '||seen' + index + '[seen' + index + '.length-1]!==map' + index + ':!blocks.contains(seen' + index + ',map' + index + ')){isFirst' + index + '=false;seen' + index + '.push(map' + index + ');}else {continue ;};'+(index === '' || tillExpressions.length === 0?'result' + index + '.push(value);':''),
prepareValues: prepareValues}
},type: 'array'
};for (var key in ArrayDescriptors) {ArrayDescriptors[key].identity = key;ArrayDescriptors[key].parent = ArrayDescriptors;}

var ObjectDescriptors = {
get: function anonymous(index,type,expression,tillExpressions,skipTake
/**/) {
var prepareValues = (index === ''?'keys' + index + '=blocks.flatten(Array.prototype.slice.call(arguments,1));':'')+(index !== ''?'keys' + index + '=blocks.flatten(Array.prototype.slice.call(arguments,0));':'');
return {
args: ['keys'],
beforeLoop: (index === ''?'' + prepareValues + '':'')+'var singleKey' + index + '=keys' + index + '.length<2;keys' + index + '=blocks.toObject(keys' + index + ');result' + index + '={};',
inLoop: 'if (keys' + index + '.hasOwnProperty(indexOrKey)){if (singleKey' + index + '){result' + index + '=value;}else {result' + index + '[indexOrKey]=value;}};',
prepareValues: prepareValues}
},invert: function anonymous(index,type,expression,tillExpressions,skipTake
/**/) {
return {
beforeLoop: 'var temp' + index + ';result' + index + '={};',
inLoop: 'temp' + index + '=value;value=indexOrKey;indexOrKey=temp' + index + ';'+(index === '' || tillExpressions.length === 0?'result' + index + '[indexOrKey]=value;':'')}
},keys: function anonymous(index,type,expression,tillExpressions,skipTake
/**/) {
return {
beforeLoop: 'result' + index + '=[];',
inLoop: 'value=indexOrKey;'+(index === '' || tillExpressions.length === 0?'result' + index + '.push(value);':'')}
},pairs: function anonymous(index,type,expression,tillExpressions,skipTake
/**/) {
return {
beforeLoop: 'result' + index + '=[];',
inLoop: 'result' + index + '.push({key:indexOrKey,value:value});'}
},values: function anonymous(index,type,expression,tillExpressions,skipTake
/**/) {
return {
beforeLoop: 'result' + index + '=[];',
inLoop: 'result' + index + '.push(value);'}
},type: 'object'
};for (var key in ObjectDescriptors) {ObjectDescriptors[key].identity = key;ObjectDescriptors[key].parent = ObjectDescriptors;}

var LoopDescriptors = {
chainExpression: function anonymous(context
/**/) {
var context2;
var context1;
var result = '';
var last2;
var first2;
var key2;
var index2;
var last1;
var first1;
var key1;
var index1;
result += 'var ' + context.indexOrKey + ' = -1, ' + context.collection + ', ' + context.length + ', ' + context.value + ', ' + (!context.conditions ? ' ' + context.result + context.resultIndex + ',' : '') + ' ' + context.result + (context.conditions ? ' = false' : '') + '; ' + context.conditionsDeclarations + ' ';
index1 = -1;
blocks.each(context.args, function (value, index){
context1 = value;
index1 += 1;
key1 = index;
first1 = index == 0;
last1 = index == context.args.length - 1;
result += ' ';
index2 = -1;
blocks.each(context1, function (value, index){
context2 = value;
index2 += 1;
key2 = index;
first2 = index == 0;
last2 = index == context1.length - 1;
result += ' var ' + context2 + index1 + ' = ' + context.expression + '._' + context2 + '; ';
});
result += ' ' + context.expression + ' = ' + context.expression + '._parent; ';
});
result += ' ';
blocks.eachRight(context.variables, function (value, index){
context1 = value;
index1 = context.variables.length;
index1 += -1;
key1 = index;
first1 = index == 0;
last1 = index == context.variables.length - 1;
result += ' ';
index2 = -1;
blocks.each(context1, function (value, index){
context2 = value;
index2 += 1;
key2 = index;
first2 = index == 0;
last2 = index == context1.length - 1;
result += ' var ' + key2 + index2 + ' = ' + context2 + '; ';
});
result += ' ';
});
result += ' ' + context.collection + ' = ' + context.expression + '._value; ' + context.indexOrKey + ' += ' + context.skip + '; ' + (context.take ? ' ' + context.length + ' = Math.min(' + context.collection + '.length, ' + context.skip + ' + ' + context.take + '); ' : '') + ' ' + (!context.take ? ' ' + context.length + ' = ' + context.collection + '.length; ' : '') + ' ' + (context.reverse ? ' ' + context.indexOrKey + ' = ' + context.collection + '.length - ' + context.skip + '; ' : '') + ' ';
blocks.eachRight(context.arrayBeforeLoops, function (value, index){
context1 = value;
index1 = context.arrayBeforeLoops.length;
index1 += -1;
key1 = index;
first1 = index == 0;
last1 = index == context.arrayBeforeLoops.length - 1;
result += ' ' + context1 + ' ';
});
result += ' ' + (context.isObject ? ' for (' + context.indexOrKey + ' in ' + context.collection + ') { ' : '') + ' ' + (!context.isObject ? ' ' + (context.reverse ? ' while (--' + context.indexOrKey + ' >= ' + (context.take ? context.take : '') + (!context.take ? '0' : '') + ') { ' : '') + ' ' + (!context.reverse ? ' while (++' + context.indexOrKey + ' < ' + context.length + ') { ' : '') + ' ' : '') + ' ' + context.value + ' = ' + context.collection + '[' + context.indexOrKey + ']; ';
blocks.eachRight(context.arrayInLoops, function (value, index){
context1 = value;
index1 = context.arrayInLoops.length;
index1 += -1;
key1 = index;
first1 = index == 0;
last1 = index == context.arrayInLoops.length - 1;
result += ' ' + context1 + ' ';
});
result += ' ' + (context.inLoopConditions ? ' ' + context.inLoopConditions + ' ' : '') + ' } ';
blocks.eachRight(context.arrayAfterLoops, function (value, index){
context1 = value;
index1 = context.arrayAfterLoops.length;
index1 += -1;
key1 = index;
first1 = index == 0;
last1 = index == context.arrayAfterLoops.length - 1;
result += ' ' + context1 + ' ';
});
result += ' ' + (context.afterLoopConditions ? ' ' + context.afterLoopConditions + ' ' : '') + ' ' + (!context.conditions ? ' ' + context.result + ' = ' + context.result + context.resultIndex + '; ' : '') + ' return ' + context.result + '; ';
return result;
},conditions: function anonymous(context
/**/) {
var context1;
var result = '';
var last1;
var first1;
var key1;
var index1;
result += 'if (';
index1 = -1;
blocks.each(context.items, function (value, index){
context1 = value;
index1 += 1;
key1 = index;
first1 = index == 0;
last1 = index == context.items.length - 1;
result += context1;
});
result += ') { ' + context.result + ' = true; ' + (context.inLoop ? ' break; ' : '') + ' } ';
return result;
},expressions: function anonymous(context
/**/) {
var context2;
var context1;
var result = '';
var last2;
var first2;
var key2;
var index2;
var last1;
var first1;
var key1;
var index1;
result += 'function ' + context.name + 'Expression( ';
index1 = -1;
blocks.each(context.args, function (value, index){
context1 = value;
index1 += 1;
key1 = index;
first1 = index == 0;
last1 = index == context.args.length - 1;
result += ' ' + context1 + ', ';
});
result += ' parent ) { this._parent = parent; this._descriptor = descriptors.' + context.descriptorName + '; ';
index1 = -1;
blocks.each(context.args, function (value, index){
context1 = value;
index1 += 1;
key1 = index;
first1 = index == 0;
last1 = index == context.args.length - 1;
result += ' this._' + context1 + ' = ' + context1 + '; ';
});
result += ' } ' + (context.isRoot ? ' function ' + context.name + 'Expression(value) { this._value = value; this._loopDescriptor = LoopDescriptors.chainExpression; } ' : '') + ' blocks.inherit(BaseExpression, ' + context.name + 'Expression, { _type: ' + context.type + ', _name: "' + context.name + '", ';
index1 = -1;
blocks.each(context.methods, function (value, index){
context1 = value;
index1 += 1;
key1 = index;
first1 = index == 0;
last1 = index == context.methods.length - 1;
result += ' ' + context1.name + ': function ( ';
index2 = -1;
blocks.each(context1.args, function (value, index){
context2 = value;
index2 += 1;
key2 = index;
first2 = index == 0;
last2 = index == context1.args.length - 1;
result += ' ' + context2 + ', ';
});
result += ' a ) { var type = expressions.' + context.path + context1.name + '; if (!type) { type = (expressions.' + context.path + context1.name + ' = generateExpression("' + context.name + context1.name + '", "' + context.path + context1.name + '", "' + context1.name + '", ' + context.type + ')); } ' + context1.prepareValues + ' expression = new type(';
index2 = -1;
blocks.each(context1.args, function (value, index){
context2 = value;
index2 += 1;
key2 = index;
first2 = index == 0;
last2 = index == context1.args.length - 1;
result += ' ' + context2 + ', ';
});
result += ' this); ' + (context1.type ? ' if (this._hasConditions()) { this.result(); this._setLastCondition(); return new ' + context1.type + '(expression.value(), this); } return new ' + context1.type + '(expression.value()); ' : '') + ' ' + (context1.everything ? ' if (this._hasConditions()) { this.result(); this._setLastCondition(); } return blocks(expression.value(), this); ' : '') + ' return expression; }, ';
});
result += ' ';
index1 = -1;
blocks.each(context.staticMethods, function (value, index){
context1 = value;
index1 += 1;
key1 = index;
first1 = index == 0;
last1 = index == context.staticMethods.length - 1;
result += ' ' + key1 + ' : ' + context1 + ', ';
});
result += ' reverse: function () { var type = expressions.' + context.path + 'reverse; if (!type) { type = (expressions.' + context.path + 'reverse = generateExpression("' + context.path + 'reverse", "' + context.path + 'reverse", "reverse", ' + context.type + ')); } var expression = new type(this); return expression; }, each: function (callback, thisArg) { var type = expressions.' + context.path + 'each; if (!type) { type = (expressions.' + context.path + 'each = generateExpression("' + context.path + 'each", "' + context.path + 'each", "each", ' + context.type + ')); } callback = PrepareValues.parseCallback(callback, thisArg); var expression = new type(callback, thisArg, this); expression._loop(); return expression; }, value: function () { if (this._parent && this._computedValue === undefined) { this._execute(true); this._computedValue = blocks.isBoolean(this._result) ? this._parent._value : this._result; } return this._computedValue === undefined ? this._value : this._computedValue; }, result: function () { if (this._result === true || this._result === false) { return this._result; } if (this._parent) { this._execute(); } return this._result; }, _loop: function () { var func = cache.' + context.path + ' || (cache.' + context.path + ' = createExpression(this)); func(this); }, _execute: function (skipConditions) { var func = cache.' + context.path + ' || (cache.' + context.path + ' = createExpression(this, skipConditions)); if (func) { this._setResult(func(this)); } else { this._result = this._findValue(); } }, _hasConditions: function () { var name = this._name; return name.indexOf("and") != -1 || name.indexOf("or") != -1; }, _setLastCondition: function () { var name = this._name; var andIndex = name.lastIndexOf("and"); var orIndex = name.lastIndexOf("or"); this._lastCondition = andIndex > orIndex ? "and" : "or"; }, _findValue: function () { var parent = this._parent; while (parent) { if (parent._value) { return parent._value; } parent = parent._parent; } } }); return ' + context.name + 'Expression; ';
return result;
},singleExpression: function anonymous(context
/**/) {
var context1;
var result = '';
var last1;
var first1;
var key1;
var index1;
result += 'var ' + context.length + ' = ' + context.collection + '.length, ' + context.indexOrKey + ' = ' + (!context.reverse ? '-1' : '') + (context.reverse ? context.length : '') + ', ' + context.isCollectionAnArray + ' = ' + context.isArrayCheck + ', ' + context.result + ', ' + context.value + '; ';
index1 = -1;
blocks.each(context.variables, function (value, index){
context1 = value;
index1 += 1;
key1 = index;
first1 = index == 0;
last1 = index == context.variables.length - 1;
result += ' ';
});
result += ' if (' + context.isCollectionAnArray + ') { ';
index1 = -1;
blocks.each(context.arrayBeforeLoops, function (value, index){
context1 = value;
index1 += 1;
key1 = index;
first1 = index == 0;
last1 = index == context.arrayBeforeLoops.length - 1;
result += ' ' + context1 + ' ';
});
result += ' ' + (context.reverse ? ' while (--' + context.indexOrKey + ' >= 0) { ' : '') + ' ' + (!context.reverse ? ' while (++' + context.indexOrKey + ' < ' + context.length + ') { ' : '') + ' ' + context.value + ' = ' + context.collection + '[' + context.indexOrKey + ']; ';
index1 = -1;
blocks.each(context.arrayInLoops, function (value, index){
context1 = value;
index1 += 1;
key1 = index;
first1 = index == 0;
last1 = index == context.arrayInLoops.length - 1;
result += ' ' + context1 + ' ';
});
result += ' } ';
index1 = -1;
blocks.each(context.arrayAfterLoops, function (value, index){
context1 = value;
index1 += 1;
key1 = index;
first1 = index == 0;
last1 = index == context.arrayAfterLoops.length - 1;
result += ' ' + context1 + ' ';
});
result += ' } else { ';
index1 = -1;
blocks.each(context.objectBeforeLoops, function (value, index){
context1 = value;
index1 += 1;
key1 = index;
first1 = index == 0;
last1 = index == context.objectBeforeLoops.length - 1;
result += ' ' + context1 + ' ';
});
result += ' for (' + context.indexOrKey + ' in collection) { ' + context.value + ' = ' + context.collection + '[' + context.indexOrKey + ']; ';
index1 = -1;
blocks.each(context.objectInLoops, function (value, index){
context1 = value;
index1 += 1;
key1 = index;
first1 = index == 0;
last1 = index == context.objectInLoops.length - 1;
result += ' ' + context1 + ' ';
});
result += ' } ';
index1 = -1;
blocks.each(context.objectAfterLoops, function (value, index){
context1 = value;
index1 += 1;
key1 = index;
first1 = index == 0;
last1 = index == context.objectAfterLoops.length - 1;
result += ' ' + context1 + ' ';
});
result += ' } return ' + context.result + '; ';
return result;
},skip: function anonymous(context
/**/) {
var result = '';
result += 'if (skip' + context.index + '-- > 0) { continue; }';
return result;
},take: function anonymous(context
/**/) {
var result = '';
result += 'if (take' + context.index + '-- <= 0) { break; }';
return result;
},type: 'loop'
};

  var cache = {};
  var expressionsCache = {};

  var descriptors2 = blocks.extend({}, CollectionDescriptors, ArrayDescriptors, ObjectDescriptors, HelperDescriptors);

  //function toCode(func) {
  //    var lines = func.toString().split('\n');
  //    return lines.slice(1, lines.length - 1).join('\n');
  //}

  //descriptors2.equals.prepareValues = {
  //    deepEqual: toCode(function (deepEqual) {
  //        deepEqual = deepEqual === false ? false : true;
  //    }),
  //};

  //descriptors2.reduce.prepareValues = [toCode(function (callback, memo, thisArg) {
  //    callback = PrepareValues.parseCallback(callback, thisArg);
  //})];

  //descriptors2.get.prepareValues = [toCode(function (keys) {
  //    keys = blocks.flatten(arguments);
  //})];

  //blocks.each(['filter', 'some', 'every', 'unique', 'first', 'last', 'min', 'max'], function (methodName) {
  //    if (PrepareValues[methodName + 'Prepare']) {
  //        descriptors2[methodName].prepareValues = ['callback = PrepareValues.' + methodName + 'Prepare(callback, thisArg);'];
  //    } else {
  //        descriptors2[methodName].prepareValues = [toCode(function (callback, thisArg) {
  //            callback = PrepareValues.parseCallback(callback, thisArg);
  //        })];
  //    }
  //});

  var descriptor;
  var descriptorData;
  for (var key in descriptors2) {
    descriptor = descriptors2[key];
    if (blocks.isFunction(descriptor)) {
      descriptorData = descriptor(' ', '', '', []);
      methodsData[key] = {
        name: key,
        args: descriptorData.args,
        prepareValues: descriptorData.prepareValues || '',
        type: descriptorData.type,
        everything: descriptorData.everything
      };
    }
  }

  blocks.extend(staticMethods, {
    toObject: function (values) {
      return new expressions.RootObjectExpression(blox.toObject(this.value(), values));
    },

    sortBy: function (callback, thisArg) {
      return new expressions.RootArrayExpression(blox.sortBy(this.value(), callback, thisArg));
    },

    groupBy: function (callback, thisArg) {
      return new expressions.RootObjectExpression(blox.groupBy(this.value(), callback, thisArg));
    },

    countBy: function (callback, thisArg) {
      return new expressions.RootObjectExpression(blox.countBy(this.value(), callback, thisArg));
    },

    shuffle: function () {
      return new expressions.RootArrayExpression(blox.shuffle(this.value()));
    },

    set: function (objectOrKey, value) {
      return new expressions.RootObjectExpression(blox.set.call(undefined, this.value, objectOrKey, value));
    },

    at: function (index, count) {
      return new expressions.RootArrayExpression(blox.at(this._value, index, count));
    },

    // Array.prototype methods
    concat: function () {
      var value = this.value();
      return new expressions.RootArrayExpression(value.concat.apply(value, arguments));
      //return new expressionsCache.RootArrayExpression(this.value().concat(slice.call(arguments)));
    },

    push: function () {
      var value = this.value();
      value.push.apply(value, arguments)
      return new expressions.RootArrayExpression(value);
    },

    pop: function () {
      var value = this.value();
      value.pop();
      return new expressions.RootArrayExpression(value);
    },

    shift: function () {
      var value = this.value();
      value.shift();
      return new expressions.RootArrayExpression(value);
    },

    slice: function (begin, end) {
      return new expressions.RootArrayExpression(this.value().slice(begin, end));
    },

    sort: function (compareFunction) {
      return new expressions.RootArrayExpression(this.value().sort(compareFunction));
    },

    splice: function (index, howMany) {
      var value = this.value();
      if (arguments.length > 2) {
        value.splice.apply(value, [index, howMany].concat(slice.call(arguments, 2)));
      } else {
        value.splice(index, howMany);
      }
      return new expressions.RootArrayExpression(value);
    },

    unshift: function () {
      var value = this.value();
      value.unshift.apply(value, arguments)
      return new expressions.RootArrayExpression(value);
    }
  });

  function generateExpression(name, path, descriptorName, type, isRoot) {
    var body = LoopDescriptors.expressions({
      isRoot: isRoot,
      name: name,
      path: path,
      descriptorName: descriptorName || 'a',
      args: (methodsData[descriptorName] || {}).args,
      methods: methodsData,
      type: type || 0,
      staticMethods: staticMethods
    });

    var Expression = new Function(
          ['blocks', 'blox', 'expressions', 'cache', 'BaseExpression', 'LoopDescriptors', 'generateExpression', 'descriptors', 'createExpression', 'PrepareValues', 'slice', 'add',
          'NumberExpression'],
          body)
          (blocks, blocks, expressionsCache, cache, BaseExpression, LoopDescriptors, generateExpression, descriptors2, createExpression, PrepareValues, slice, add,
          NumberExpression);
    if (isRoot) {
      expressionsCache[name + 'Expression'] = Expression;
    }
    Expression.prototype.forEach = Expression.prototype.each;
    return Expression;
  }


  blocks.extend(staticMethods, {
    add: function () {
      add(this.value(), arguments);
      return this;
    },

    remove: function (position, callback) {
      blocks.remove(this.value(), position, callback);
      return this;
    },

    removeAt: function (position, count) {
      blocks.removeAt(this.value(), position, count);
      return this;
    },

    removeAll: function (callback, thisArg) {
      if (arguments.length === 0) {
        blocks.removeAll(this.value());
      } else {
        blocks.removeAll(this.value(), callback, thisArg);
      }
      return this;
    },

    addMany: function () {
      addMany(this.value(), arguments);
      return this;
    },

    swap: function (index1, index2) {
      blocks.swap(this.value(), index1, index2);
      return this;
    },

    move: function (sourceIndex, targetIndex) {
      blocks.move(this.value(), sourceIndex, targetIndex);
      return this;
    }
  });

  /**
  * @memberof blocks.expressions
  * @class ArrayExpression
  */
  var RootArrayExpression = generateExpression('RootArray', 'arr', '', 1, true);

  blocks.extend(RootArrayExpression.prototype, {
    reverse: function () {
      return new RootArrayExpression(this._value.reverse());
    }
  });

  blocks.extend(blocks, {
    add: function (array) {
      return add(array, slice.call(arguments, 1));
    },

    addMany: function (array) {
      return addMany(array, slice.call(arguments, 1));
    },

    remove: function (array, position, callback) {
      if (positions.isPosition(position)) {
        return blocks.removeAt(array, positions.determineIndex(position, this._value.length), callback);
      } else {
        return blocks.removeAll(array, position, callback, true);
      }
    },

    removeAt: function (array, index, count) {
      if (!blocks.isNumber(count)) {
        count = 1;
      }
      array.splice(index, count);
      return array;
    },

    removeAll: function (array, callback, thisArg, removeOne) {
      var i = 0;
      var isCallbackAFunction = blocks.isFunction(callback);
      var value;

      if (arguments.length == 1) {
        array.splice(0, array.length);
      } else {
        for (; i < array.length; i++) {
          value = array[i];
          if (value === callback || (isCallbackAFunction && callback.call(thisArg, value, i, array))) {
            array.splice(i--, 1);
            if (removeOne) {
              break;
            }
          }
        }
      }

      return array;
    },

    toObject: function (array, values) {
      var result = {},
          useValuesArray = arguments.length > 1 && values,
          i = 0,
          length = array.length,
          value;

      for (; i < length; i++) {
        value = array[i];
        if (blocks.isArray(value)) {
          result[value[0]] = value[1];
        } else if (blocks.isObject(value)) {
          result[value.key] = value.value;
        } else {
          result[value] = useValuesArray ? values[i] : true;
        }
      }
      return result;
    },

    shuffle: function (array) {
      var shuffled = [];
      var i = 0;
      var length = array.length;
      var rand;

      for (; i < length; i++) {
        rand = blocks.random(i);
        shuffled[i] = shuffled[rand];
        shuffled[rand] = array[i];
      }
      return shuffled;
    }
  });

  function add(array, args) {
    if (args.length > 0) {
      var index = positions.determineIndex(args[0], array.length);
      var items = slice.call(args, positions.isPosition(args[0]) ? 1 : 0);
      var i = 0;

      if (index >= array.length) {
        for (; i < items.length; i++) {
          array[index + i] = items[i];
        }
      } else {
        array.splice.apply(array, [index, 0].concat(items));
      }
    }
    return array;
  }

  function addMany(array, args) {
    return add(array, blocks.flatten(args, true));
  }



  var RootObjectExpression = generateExpression('RootObject', 'obj', '', 2, true);

  blocks.set = function (object, objectOrKey, value) {
    var key;
    if (blocks.isString(objectOrKey)) {
      object[objectOrKey] = value;
    } else {
      for (key in objectOrKey) {
        object[key] = objectOrKey;
      }
    }
    return object;
  };

    var trimRegExp = /^\s+|\s+$/gm;


  var stringTrimStartRegex = /^(\s|\u00A0)+/;
  var stringTrimEndRegex = /(\s|\u00A0)+$/;

  function StringExpression(value, parent) {
    this.__Class__(value, parent);
  }

  StringExpression.prototype.constructor = BaseExpression;

  blocks.inherit(BaseExpression, StringExpression, {
    _expression: StringExpression,

    type: function () {
      return 'string';
    },

    substring: function (indexA, indexB) {
      return new StringExpression(this._value.substring(indexA, indexB));
    },

    isEmpty: function () {
      return this._resultExpression(this._value.length == 0);
    },

    size: function () {
      return new NumberExpression(blocks.size(this._value));
    },

    contains: function (value) {
      return this._resultExpression(this._value.indexOf(value) != -1);
    },

    startsWith: function (value) {
      return this._resultExpression(blocks.startsWith(this._value, value));
    },

    endsWith: function (value) {
      return this._resultExpression(blocks.endsWith(this._value, value));
    },

    trim: function (trimValue) {
      return new StringExpression(blocks.trim(this._value, trimValue));
    },

    trimStart: function (trimValue) {
      return new StringExpression(blocks.trimStart(this._value, trimValue));
    },

    trimEnd: function (trimValue) {
      return new StringExpression(blocks.trimEnd(this._value, trimValue));
    },

    repeat: function (count) {
      return new StringExpression(blocks.repeat(this._value, count));
    },

    reverse: function () {
      return new StringExpression(blocks.reverse(this._value));
    },

    wrap: function (wrapValue) {
      return new StringExpression(blocks.wrap(this._value, wrapValue));
    },

    format: function () {
      return new StringExpression(format(this._value, slice.call(arguments, 0)));
    },

    matches: function (regexp, count) {
      return new StringExpression(blocks.matches(this._value, regexp, count));
    },

    toUnit: function (unit) {
      return new StringExpression(blocks.toUnit(this._value, unit));
    },

    clone: function () {
      return new StringExpression(this._value.toString());
    }
  });

  blocks.extend(blocks, {
    startsWith: function (value, startsWith) {
      if (!blocks.isString(value)) {
        value = value.toString();
      }
      startsWith = startsWith.toString();
      return value.indexOf(startsWith) == 0;
    },

    endsWith: function (value, endsWith) {
      if (!blocks.isString(value)) {
        value = value.toString();
      }
      endsWith = endsWith.toString();
      return value.lastIndexOf(endsWith) == value.length - endsWith.length;
    },

    trim: function (string, trimValue) {
      return (string || '').toString().replace(typeof trimValue == 'string' ? new RegExp('^(' + trimValue + ')+|(' + trimValue + ')+$', 'g') : trimRegExp, '');
    },

    trimStart: function (string, trimValue) {
      return (string || '').toString().replace(typeof trimValue == 'string' ? new RegExp('^(' + trimValue + ')+') : stringTrimStartRegex, '');
    },

    trimEnd: function (string, trimValue) {
      return (string || '').toString().replace(typeof trimValue == 'string' ? new RegExp('(' + trimValue + ')+$') : stringTrimEndRegex, '');
    },

    repeat: function (string, count) {
      var result = '';
      var i = 0;

      if (count < 0 || typeof count != 'number') {
        return string;
      }

      count = Math.floor(count);
      for (; i < count; i++) {
        result += string;
      }
      return result;
    },

    reverse: function (value) {
      if (blocks.isArray(value)) {
        return value.reverse();
      }

      if (typeof value != 'string') {
        value = value.toString();
      }
      return value.split('').reverse().join('')
    },

    wrap: function (stringOrFunction, wrapValueOrCallback) {
      if (blocks.isFunction(stringOrFunction)) {
        return function () {
          var args = [stringOrFunction];
          push.apply(args, arguments);
          return wrapValueOrCallback.apply(this, args);
        };
      }
      return wrapValueOrCallback + stringOrFunction + blocks.reverse(wrapValueOrCallback);
    },

    format: function (string) {
      return format(string, slice.call(arguments, 1));
    },

    matches: function (string, reg, count) {
      count = blocks.isNumber(count) ? count : Number.MAX_VALUE;
      if (!blocks.isRegExp(reg)) {
        reg = new RegExp(reg.toString(), 'g');
      }
      var result = [];
      var match;
      var length;

      reg.lastIndex = 0;
      match = reg.exec(string);
      while (count > 0 && match) {
        length = blocks.isArray(match) ? match[0].length : match.length;
        result.push({
          result: match,
          input: match.input,
          startIndex: match.index,
          endIndex: match.index + length,
          length: length
        });
        if (!reg.global) {
          break;
        }
        match = reg.exec(string);
        count--;
      }

      return result;
    }
  });

  function format(string, args) {
    var regEx;
    var i = 0;

    // start with the second argument (i = 1)
    for (; i < args.length; i++) {
      // 'gm' = RegEx options for Global search (more than one instance)
      // and for Multiline search
      regEx = new RegExp('\\{' + i + '\\}', 'gm');
      string = string.replace(regEx, args[i]);
    }

    return string;
  }


  function FunctionExpression(value, parent) {
    this.__Class__(value, parent);
  }

  blocks.inherit(BaseExpression, FunctionExpression, {
    bind: function () {
      return new FunctionExpression(blocks.bind.apply(this, [this._value].concat(slice.call(arguments))));
    },

    partial: function () {
      return new FunctionExpression(partial(this._value, slice.call(arguments, 0)));
    },

    memoize: function (hasher) {
      return new FunctionExpression(blocks.memoize(this._value, hasher));
    },

    delay: function (wait) {
      return new FunctionExpression(delay(this._value, wait, slice.call(arguments, 1)));
    },

    throttle: function (wait, options) {
      return new FunctionExpression(blocks.throttle(this._value, wait, options));
    },

    debounce: function (wait, immediate) {
      return new FunctionExpression(blocks.debound(this._value, wait, immediate));
    },

    once: function () {
      return new FunctionExpression(blocks.once(this._value));
    },

    wrap: function (callback) {
      return new FunctionExpression(blocks.wrap(this._value, callback));
    }
  });

  blocks.extend(blocks, {
    partial: function (func) {
      var args = slice.call(arguments, 1);
      return partial(func, args);
    },

    memoize: function (func, hasher) {
      var memo = {};
      hasher || (hasher = identity);
      return function () {
        var key = hasher.apply(this, arguments);
        return memo.hasOwnProperty(key) ? memo[key] : (memo[key] = func.apply(this, arguments));
      };
    },

    delay: function (func, wait) {
      return delay(func, wait, slice.call(arguments, 2));
    },

    throttle: function (wait, func, options) {
      var context;
      var args;
      var result;
      var timeout = null;
      var previous = 0;

      options || (options = {});
      var later = function () {
        previous = options.leading === false ? 0 : new Date;
        timeout = null;
        result = func.apply(context, args);
      };
      return function () {
        var now = new Date;
        if (!previous && options.leading === false) previous = now;
        var remaining = wait - (now - previous);
        context = this;
        args = arguments;
        if (remaining <= 0) {
          clearTimeout(timeout);
          timeout = null;
          previous = now;
          result = func.apply(context, args);
        } else if (!timeout && options.trailing !== false) {
          timeout = setTimeout(later, remaining);
        }
        return result;
      };
    },

    debounce: function (func, wait, immediate) {
      var timeout,
          args,
          context,
          timestamp,
          result;
      return function () {
        context = this;
        args = arguments;
        timestamp = new Date();
        var later = function () {
          var last = (new Date()) - timestamp;
          if (last < wait) {
            timeout = setTimeout(later, wait - last);
          } else {
            timeout = null;
            if (!immediate) result = func.apply(context, args);
          }
        };
        var callNow = immediate && !timeout;
        if (!timeout) {
          timeout = setTimeout(later, wait);
        }
        if (callNow) result = func.apply(context, args);
        return result;
      };
    },

    once: function (func) {
      var ran = false,
          memo;
      return function () {
        if (ran) return memo;
        ran = true;
        memo = func.apply(this, arguments);
        func = null;
        return memo;
      };
    }
  });

  function partial(func, args) {
    return function () {
      return func.apply(this, args.concat(slice.call(arguments)));
    };
  }

  function delay(func, wait, args) {
    wait = wait || 0;
    return setTimeout(function () {
      return func.apply(null, args);
    }, wait);
  }


  blocks.random = function (min, max) {
    if (arguments.length == 0) {
      return Math.random();
    }
    if (max == null) {
      max = min;
      min = 0;
    }
    return min + Math.floor(0 | Math.random() * (max - min + 1));
  };

  function NumberExpression(value, parent) {
    this.__Class__(value, parent);
  }

  blocks.inherit(BaseExpression, NumberExpression, {
    _expression: NumberExpression,

    type: function () {
      return 'number';
    },

    toUnit: function (unit) {
      unit = unit || 'px';
      return new StringExpression(this._value + unit, this);
    },

    random: function (min, max) {
      return new NumberExpression(blocks.random(min, max), this);
    },

    biggerThan: function (value) {
      var expression = new NumberExpression(this._value, this);
      expression._setResult(this._value > value);
      return expression;
    },

    lessThan: function () {
      var expression = new NumberExpression(this._value, this);
      expression._setResult(this._value < value);
      return expression;
    }
  });

  function DateExpression(value, parent) {
    this.__Class__(value, parent);
  }

  blocks.inherit(BaseExpression, DateExpression, {
    _expression: DateExpression,

    type: function () {
      return 'date';
    },

    addWeeks: function (weeks) {
      blocks.addWeeks(this._value, weeks);
      return this;
    },

    compare: function (date) {
      return new DateExpression(blocks.compare(this._value, date));
    },

    equalsDate: function (date) {
      this._setResult(blocks.equalsDate(this._value, date));
      return this;
    },

    equalsTime: function (date) {
      this._setResult(blocks.equalsTime(this._value, date));
      return this;
    },

    clearTime: function () {
      return new DateExpression(blocks.clearTime(this._value));
    }
  });

  blocks.extend(blocks, {
    addWeeks: function (date, weeks) {
      date.setDate(date.getDate() + weeks * 7);
      return date;
    },

    compare: function (dateA, dateB) {
      var result = dateA - dateB;
      result = result === 0 ? result : result < 0 ? -1 : 1;
      return result;
    },

    equalsDate: function (dateA, dateB) {
      return dateA.getFullYear() === dateB.getFullYear() &&
             dateA.getMonth() === dateB.getMonth() &&
             dateA.getDate() === dateB.getDate();
    },

    equalsTime: function (dateA, dateB) {
      return dateA.getHours() === dateB.getHours() &&
             dateA.getMinutes() === dateB.getMinutes() &&
             dateA.getSeconds() === dateB.getSeconds() &&
             dateA.getMilliseconds() === dateB.getMilliseconds();
    },

    clearTime: function (date) {
      date.setHours(0, 0, 0, 0);
      return date;
    }
  });

  blocks.each([['Years', 'FullYear'], ['Months', 'Month'], ['Days', 'Date'], 'Hours', 'Minutes', 'Seconds', 'Milliseconds'], function (value) {
    var methodName = value;
    var propertyName = value;
    if (blocks.isArray(value)) {
      methodName = value[0];
      propertyName = value[1];
    }
    methodName = 'add' + methodName;
    blocks[methodName] = function (date, value) {
      date['set' + propertyName](date['get' + propertyName]() + value);
      return date;
    }
    DateExpression.prototype[methodName] = function (value) {
      return new DateExpression(blocks[methodName](this._value, value));
    }
  });


  function RegExpExpression(value, parent) {
    this.__Class__(value, parent);
  }

  blocks.inherit(BaseExpression, RegExpExpression, {
    equals: function () {

    },

    matches: function (string, count) {
      return new RegExpExpression(blocks.matches(this._value, string, count));
    },

    reset: function () {

    },

    clone: function () {
      return new RegExpExpression(blocks.clone(this._value));
    }
  });



  var core = blocks.core;

  core.expressionsCreated = true;

  if (core.trigger) {
    core.trigger('expressionsCreated');
  }

  core.createExpression = function (value) {
    var type;

    if (value instanceof Array || (value && value.jquery)) {
      return new RootArrayExpression(value);
    }
    if (typeof value == 'string' || value instanceof String) {
      return new StringExpression(value);
    }
    if (typeof value == 'number' || value instanceof Number) {
      return new NumberExpression(value);
    }
    if (value instanceof Date) {
      return new DateExpression(value);
    }
    if ((type = toString.call(value)) === '[object RegExp]') {
      return new RegExpExpression(value);
    }
    if (value == null) {
      return new BaseExpression(value);
    }
    if (value._prototypeIndentification == '__blocks.expression__') {
      return value;
    }
    if (type == '[object Function]') {
      return new FunctionExpression(value);
    }

    return new RootObjectExpression(value);
  };

  core.isExpression = function (value) {
    return value && value._prototypeIndentification == '__blocks.expression__';
  };

  core.staticExpression = {
    range: function (start, end, step) {
      step = step || 1;
      if (arguments.length == 1) {
        end = start;
        start = 0;
      }

      var root = new RootArrayExpression([]);
      return root.range(start, end, step);
    },

    repeat: function () {

    }
  };

  core.isArrayExpression = function (value) {
    return ChildArrayExpression.prototype.isPrototypeOf(value);
  };

  core.isObjectExpression = function (value) {
    return ChildObjectExpression.prototype.isPrototypeOf(value);
  };


  var expressionsByName = {
    'array': RootArrayExpression,
    'object': RootObjectExpression
  };

  var skipMethods = blocks.toObject(['value', 'not', 'and', 'or', 'type', 'is', 'result'])

  blocks.core.applyExpressions = function (expressionName, object, methods) {
    // TODO: Removed when all expresions are implemented
    if (!expressionsByName[expressionName]) {
      return;
    }
    var prototype = expressionsByName[expressionName].prototype;
    var key;

    for (key in prototype) {
      if (!object[key] && !skipMethods[key] && blocks.isFunction(prototype[key]) && (!methods || methods[key])) {
        object[key] = applyExpression(key);
      }
    }
  };

  function applyExpression(key) {
    return function () {
      var value = blocks.unwrap(this._value || this.data || this);
      if (blocks[key]) {
        return blocks.unwrap(blocks[key].apply(value, [value].concat(blocks.toArray(arguments))));
      } else {
        value = blocks(value);
        value = value[key].apply(value, blocks.toArray(arguments));
        return value.result() || value.value();
      }
    };
  }



  function createContext() {
    return {
      indexOrKey: 'indexOrKey',
      length: 'length',
      result: 'result',
      isCollectionAnArray: 'isCollectionAnArray',
      collection: 'collection',
      expression: 'expression',
      value: 'value',
      resultIndex: 0,
      isArrayCheck: 'typeof length == "number"',
      skip: 0,
      take: null,

      //reverse: false,
      args: [],
      variables: [],
      objectBeforeLoops: [],
      arrayBeforeLoops: [],
      objectInLoops: [],
      arrayInLoops: [],
      objectAfterLoops: [],
      arrayAfterLoops: [],
      conditionsEnd: ''
    };
  }

  function createConditionsCreator() {
    var context = {
      result: 'result',
      inLoop: true,
      items: []
    };
    var index = 0;
    var items = context.items;
    var declarations = [];
    var boolResultsCount = 0;
    var lastBoolResult;

    return {
      callback: function (descriptorData) {
        var handled = true;

        switch (descriptorData.name) {
          case 'and':
            items.push(' && ');
            break;
          case 'or':
            items.push(' || ');
            break;
          case 'not':
            if (lastBoolResult === false) {
              context.inLoop = false;
            }
            lastBoolResult = undefined;
            items.splice(items.length - 1, 0, '!');
            boolResultsCount++;
            break;
          default:
            handled = false;
            if (descriptorData.boolResult !== undefined) {
              if (lastBoolResult !== undefined && lastBoolResult === true) {
                context.inLoop = false;
              }
              lastBoolResult = descriptorData.boolResult;
              boolResultsCount++;
              items.push(context.result + index);
              descriptorData.inLoop = (descriptorData.inLoop || '').replace(/(\s|;)(break\s?;)/g, function (match) {
                var result = '';
                if (match[0] == ';') {
                  result = ';';
                }
                return result;
              });
            }
            declarations.push(blocks.format('var {0}{1};', context.result, index));
            break;
        }
        index++;
        return handled;
      },

      end: function (parentContext) {
        if (lastBoolResult !== undefined && lastBoolResult === true) {
          context.inLoop = false;
        }

        parentContext.conditionsDeclarations = declarations.join('');
        if (boolResultsCount > 1) {
          //for (var i = 0; i < items.length; i++) {
          //    if (items[i] == '!' && items[i + 1].indexOf(parentContext.result) == -1) {
          //        items.splice(i, 1);
          //    }
          //}
          //while (items[0] == ' && ' || items[0] == ' || ') {
          //    items.splice(0, 1);
          //}
          //while (items[items.length - 1] == ' && ' || items[items.length - 1] == ' || ') {
          //    items.pop();
          //}

          parentContext.conditions = true;
          //parentContext.conditionsEnd = LoopDescriptors.conditionsEnd(context).replace(/\|\|/g, '&&');//.replace(/&&\s?/g, '&& !');
          parentContext[(context.inLoop ? 'inLoop' : 'afterLoop') + 'Conditions'] = LoopDescriptors.conditions(context);
          if (context.inLoop) {
            context.inLoop = false;
            parentContext.afterLoopConditions = LoopDescriptors.conditions(context);
          }
        }
      }
    };
  }

  function createExpression(expression) {
    var context = createContext();
    var isSingleExpression = expression._isSingle;
    var type = expression._type;
    var types = isSingleExpression ? ['array', 'object'] : [expression._type == 1 ? 'array' : 'object'];
    var index = isSingleExpression ? '' : 0;
    var tillExpressions = [];
    var conditionsCreator = isSingleExpression ? undefined : createConditionsCreator();
    var skipIndex = 0;
    var takeIndex = 0;
    var disregardResultIndex = false;
    var skipTake = '';
    var onlySkipTake = true;
    var descriptorData;
    var func;

    while (expression._parent) {
      blocks.each(types, function (type, typesIndex) {
        if (expression._descriptor.identity == 'filter') {
          if (context.skip) {
            skipTake += LoopDescriptors.skip({ index: skipIndex });
          }
          if (context.take !== null) {
            skipTake += LoopDescriptors.take({ index: takeIndex });
          }
          context.skip = 0;
          context.take = null;
        }

        descriptorData = expression._descriptor(index, type, expression, tillExpressions, skipTake);
        skipTake = '';

        if (typesIndex === 0) {
          context.args.push(descriptorData.args || []);
        }

        switch (descriptorData.name) {
          case 'skip':
            if (!context.skip) {
              context.skip = 'skip' + index;
            }
            return;
          case 'take':
            if (context.take === null) {
              context.take = 'take' + index;
            }
            return;
          case 'reverse':
            context.reverse = !context.reverse;
            return;
        }
        onlySkipTake = false;

        if (isSingleExpression || !conditionsCreator.callback(descriptorData)) {
          if (typesIndex === 0) {
            if (descriptorData.reverse) {
              context.reverse = !context.reverse;
            }
          }

          if (!isSingleExpression) {
            type = 'array';
          }

          if (descriptorData.boolResult !== undefined) {
            context.resultIndex = index || 0;
          } else if (!index) {
            disregardResultIndex = true;
          }

          if (descriptorData.beforeLoop) {
            context[type + 'BeforeLoops'].push(descriptorData.beforeLoop);
          }
          if (descriptorData.inLoop) {
            context[type + 'InLoops'].push(descriptorData.inLoop);
          }
          if (descriptorData.afterLoop) {
            context[type + 'AfterLoops'].push(descriptorData.afterLoop);
          }
        }
      });

      if (descriptorData.name != 'skip' && descriptorData.name != 'take' && descriptorData.name != 'reverse') {
        tillExpressions.push(expression);
      } else if (tillExpressions.length == 0) {
        context.resultIndex += 1;
        if (descriptorData.name == 'skip') {
          skipIndex = skipIndex || index;
        } else {
          takeIndex = takeIndex || index;
        }
      }
      index = +index + 1;
      expression = expression._parent;
    }

    context.isObject = RootObjectExpression.prototype.isPrototypeOf(expression);

    if (isSingleExpression) {
      switch (type) {
        case 'array':
          context.isArrayCheck = true;
          break;
        case 'object':
          context.isArrayCheck = false;
          break;
      }

      if (typeof module === 'object' && typeof module.exports === 'object') {
        func = new Function(['blocks', 'collection'].concat(context.args[0]), expression._loopDescriptor(context));
        return function () {
          return func.apply(this, [blocks].concat(blocks.toArray(arguments)));
        };
      }
      return new Function(['collection'].concat(context.args[0]), expression._loopDescriptor(context));
    } else {
      conditionsCreator.end(context);

      if (onlySkipTake) {
        context['arrayBeforeLoops'].push(context.result + context.resultIndex + ' = [];');
        context['arrayInLoops'].push(context.result + context.resultIndex + '.push(' + context.value + ');');
      }
      if (disregardResultIndex) {
        context.resultIndex = 0;
      }
      if (typeof module === 'object' && typeof module.exports === 'object') {
        func = new Function(['blocks', context.expression], expression._loopDescriptor(context));
        return function (collection) {
          return func(blocks, collection);
        };
      }
      return new Function(context.expression, expression._loopDescriptor(context));
    }
  }

    var descriptors = blocks.extend({}, CollectionDescriptors, ArrayDescriptors, ObjectDescriptors);

    function mock(descriptor) {
        var root = {
            _loopDescriptor: LoopDescriptors[descriptor.identity] || LoopDescriptors.singleExpression
        };
        var expression = {
            _parent: root,
            _descriptor: descriptor,
            _isSingle: true,
            _type: descriptor.parent.type
        };
        return expression;
    }
    

    function create(name) {
        var descriptor = descriptors[name];
        if (blocks.isFunction(descriptor)) {
            var expression = mock(descriptor);
            if (!blocks[name]) {
                blocks[name] = createExpression(expression);
            } else {
                return createExpression(expression);
            }
        }
    }
    
    for (var key in descriptors) {
        create(key);
    }

    blocks.forEach = blocks.each;

    var blocksAtOriginal = blocks.at;
    var blocksAt = create('at');
    blocks.at = function (array, position, count) {
        if (blocks.isNumber(array)) {
            return blocksAtOriginal(array);
        }
        return blocksAt(array, position, count);
    };

    var blocksFirstOriginal = blocks.first;
    var blocksFirst = create('first');
    blocks.first = function (array, callback, thisArg) {
        if (arguments.length == 0) {
            return blocksFirstOriginal;
        }
        return blocksFirst(array, callback, thisArg);
    };

    var blocksLastOriginal = blocks.last;
    var blocksLast = create('last');
    blocks.last = function (array, callback, thisArg) {
        if (arguments.length == 0) {
            return blocksLastOriginal;
        }
        return blocksLast(array, callback, thisArg);
    };

    var blocksContains = blocks.contains;
    blocks.contains = function (value, searchValue) {
        if (blocks.isString(value)) {
            return value.indexOf(searchValue) != -1;
        }
        return blocksContains(value, searchValue);
    };





})();
(function () {


  function parseCallback(callback, thisArg) {
    //callback = parseExpression(callback);
    if (thisArg != null) {
      var orgCallback = callback;
      callback = function (value, index, collection) {
        return orgCallback.call(thisArg, value, index, collection);
      };
    }
    return callback;
  }

  var Events = (function () {
    function createEventMethod(eventName) {
      return function (callback, context) {
        if (arguments.length > 1) {
          Events.on(this, eventName, callback, context);
        } else {
          Events.on(this, eventName, callback);
        }
        return this;
      };
    }

    var methods = {
      on: function (eventName, callback, context) {
        if (arguments.length > 2) {
          Events.on(this, eventName, callback, context);
        } else {
          Events.on(this, eventName, callback);
        }
        return this;
      },

      once: function (eventNames, callback, thisArg) {
        Events.once(this, eventNames, callback, thisArg);
      },

      off: function (eventName, callback) {
        Events.off(this, eventName, callback);
      },

      trigger: function (eventName) {
        Events.trigger(this, eventName, blocks.toArray(arguments).slice(1, 100));
      }
    };
    methods._trigger = methods.trigger;

    return {
      register: function (object, eventNames) {
        eventNames = blocks.isArray(eventNames) ? eventNames : [eventNames];
        for (var i = 0; i < eventNames.length; i++) {
          var methodName = eventNames[i];
          if (methods[methodName]) {
            object[methodName] = methods[methodName];
          } else {
            object[methodName] = createEventMethod(methodName);
          }
        }
      },

      on: function (object, eventNames, callback, thisArg) {
        eventNames = blocks.toArray(eventNames).join(' ').split(' ');

        var i = 0;
        var length = eventNames.length;
        var eventName;

        if (!callback) {
          return;
        }

        if (!object._events) {
          object._events = {};
        }
        for (; i < length; i++) {
          eventName = eventNames[i];
          if (!object._events[eventName]) {
            object._events[eventName] = [];
          }
          object._events[eventName].push({
            callback: callback,
            thisArg: thisArg
          });
        }
      },

      once: function (object, eventNames, callback, thisArg) {
        Events.on(object, eventNames, callback, thisArg);
        Events.on(object, eventNames, function () {
          Events.off(object, eventNames, callback);
        });
      },

      off: function (object, eventName, callback) {
        if (blocks.isFunction(eventName)) {
          callback = eventName;
          eventName = undefined;
        }

        if (eventName !== undefined || callback !== undefined) {
          blocks.each(object._events, function (events, currentEventName) {
            if (eventName !== undefined && callback === undefined) {
              object._events[eventName] = [];
            } else {
              blocks.each(events, function (eventData, index) {
                if (eventData.callback == callback) {
                  object._events[currentEventName].splice(index, 1);
                  return false;
                }
              });
            }
          });
        } else {
          object._events = undefined;
        }
      },

      trigger: function (object, eventName) {
        var result = true;
        var eventsData;
        var thisArg;
        var args;

        if (object && object._events) {
          eventsData = object._events[eventName];

          if (eventsData && eventsData.length > 0) {
            args = Array.prototype.slice.call(arguments, 2);

            blocks.each(eventsData, function iterateEventsData(eventData) {
              if (eventData) {
                thisArg = object;
                if (eventData.thisArg !== undefined) {
                  thisArg = eventData.thisArg;
                }
                if (eventData.callback.apply(thisArg, args) === false) {
                  result = false;
                }
              }
            });
          }
        }

        return result;
      },

      has: function (object, eventName) {
        return !!blocks.access(object, '_events.' + eventName + '.length');
      }
    };
  })();

  // Implementation of blocks.domReady event
  (function () {
    blocks.isDomReady = false;

    //blocks.elementReady = function (element, callback, thisArg) {
    //  callback = parseCallback(callback, thisArg);
    //  if (element) {
    //    callback();
    //  } else {
    //    blocks.domReady(callback);
    //  }
    //};

    blocks.domReady = function (callback, thisArg) {
      if (typeof document == 'undefined' || typeof window == 'undefined' ||
        (window.__mock__ && document.__mock__)) {
        return;
      }

      callback = parseCallback(callback, thisArg);
      if (blocks.isDomReady || document.readyState == 'complete' ||
        (window.jQuery && window.jQuery.isReady)) {
        blocks.isDomReady = true;
        callback();
      } else {
        Events.on(blocks.core, 'domReady', callback);
        handleReady();
      }
    };

    function handleReady() {
      if (document.readyState === 'complete') {
        setTimeout(ready);
      } else if (document.addEventListener) {
        document.addEventListener('DOMContentLoaded', completed, false);
        window.addEventListener('load', completed, false);
      } else {
        document.attachEvent('onreadystatechange', completed);
        window.attachEvent('onload', completed);

        var top = false;
        try {
          top = window.frameElement == null && document.documentElement;
        } catch (e) { }

        if (top && top.doScroll) {
          (function doScrollCheck() {
            if (!blocks.isDomReady) {
              try {
                top.doScroll('left');
              } catch (e) {
                return setTimeout(doScrollCheck, 50);
              }

              ready();
            }
          })();
        }
      }
    }

    function completed() {
      if (document.addEventListener || event.type == 'load' || document.readyState == 'complete') {
        ready();
      }
    }

    function ready() {
      if (!blocks.isDomReady) {
        blocks.isDomReady = true;
        Events.trigger(blocks.core, 'domReady');
        Events.off(blocks.core, 'domReady');
      }
    }
  })();

    var slice = Array.prototype.slice;

    var trimRegExp = /^\s+|\s+$/gm;


  function keys(array) {
    var result = {};
    blocks.each(array, function (value) {
      result[value] = true;
    });
    return result;
  }
    var classAttr = 'class';

    var queries = (blocks.queries = {});


  var isMouseEventRegEx = /^(?:mouse|pointer|contextmenu)|click/;
  var isKeyEventRegEx = /^key/;

  function returnFalse() {
    return false;
  }

  function returnTrue() {
    return true;
  }

  function Event(e) {
    this.originalEvent = e;
    this.type = e.type;

    this.isDefaultPrevented = e.defaultPrevented ||
        (e.defaultPrevented === undefined &&
        // Support: IE < 9, Android < 4.0
        e.returnValue === false) ?
        returnTrue :
        returnFalse;

    this.timeStamp = e.timeStamp || +new Date();
  }

  Event.PropertiesToCopy = {
    all: 'altKey bubbles cancelable ctrlKey currentTarget eventPhase metaKey relatedTarget shiftKey target timeStamp view which'.split(' '),
    mouse: 'button buttons clientX clientY fromElement offsetX offsetY pageX pageY screenX screenY toElement'.split(' '),
    keyboard: 'char charCode key keyCode'.split(' ')
  };

  Event.CopyProperties = function (originalEvent, event, propertiesName) {
    blocks.each(Event.PropertiesToCopy[propertiesName], function (propertyName) {
      event[propertyName] = originalEvent[propertyName];
    });
  };

  Event.prototype = {
    preventDefault: function () {
        var e = this.originalEvent;

        this.isDefaultPrevented = returnTrue;

        if (e.preventDefault) {
            // If preventDefault exists, run it on the original event
            e.preventDefault();
        } else {
            // Support: IE
            // Otherwise set the returnValue property of the original event to false
            e.returnValue = false;
        }
    },

    stopPropagation: function () {
        var e = this.originalEvent;

        this.isPropagationStopped = returnTrue;

        // If stopPropagation exists, run it on the original event
        if (e.stopPropagation) {
            e.stopPropagation();
        }

        // Support: IE
        // Set the cancelBubble property of the original event to true
        e.cancelBubble = true;
    },

    stopImmediatePropagation: function () {
        var e = this.originalEvent;

        this.isImmediatePropagationStopped = returnTrue;

        if (e.stopImmediatePropagation) {
            e.stopImmediatePropagation();
        }

        this.stopPropagation();
    }
  };

  Event.fix = function (originalEvent) {
    var type = originalEvent.type;
    var event = new Event(originalEvent);

    Event.CopyProperties(originalEvent, event, 'all');

    // Support: IE<9
    // Fix target property (#1925)
    if (!event.target) {
        event.target = originalEvent.srcElement || document;
    }

    // Support: Chrome 23+, Safari?
    // Target should not be a text node (#504, #13143)
    if (event.target.nodeType === 3) {
        event.target = event.target.parentNode;
    }

    // Support: IE<9
    // For mouse/key events, metaKey==false if it's undefined (#3368, #11328)
    event.metaKey = !!event.metaKey;

    if (isMouseEventRegEx.test(type)) {
        Event.fixMouse(originalEvent, event);
    } else if (isKeyEventRegEx.test(type) && event.which == null) {
        Event.CopyProperties(originalEvent, event, 'keyboard');
        // Add which for key events
        event.which = originalEvent.charCode != null ? originalEvent.charCode : originalEvent.keyCode;
    }

    return event;
  };

  Event.fixMouse = function (originalEvent, event) {
    var button = originalEvent.button;
    var fromElement = originalEvent.fromElement;
    var body;
    var eventDoc;
    var doc;

    Event.CopyProperties(originalEvent, event, 'mouse');

    // Calculate pageX/Y if missing and clientX/Y available
    if (event.pageX == null && originalEvent.clientX != null) {
        eventDoc = event.target.ownerDocument || document;
        doc = eventDoc.documentElement;
        body = eventDoc.body;

        event.pageX = originalEvent.clientX + (doc && doc.scrollLeft || body && body.scrollLeft || 0) - (doc && doc.clientLeft || body && body.clientLeft || 0);
        event.pageY = originalEvent.clientY + (doc && doc.scrollTop || body && body.scrollTop || 0) - (doc && doc.clientTop || body && body.clientTop || 0);
    }

    // Add relatedTarget, if necessary
    if (!event.relatedTarget && fromElement) {
        event.relatedTarget = fromElement === event.target ? originalEvent.toElement : fromElement;
    }

    // Add which for click: 1 === left; 2 === middle; 3 === right
    // Note: button is not normalized, so don't use it
    if (!event.which && button !== undefined) {
        /* jshint bitwise: false */
        event.which = (button & 1 ? 1 : (button & 2 ? 3 : (button & 4 ? 2 : 0)));
    }
  };

  //var event = blocks.Event();
  //event.currentTarget = 1; // the current element from which is the event is fired
  //event.namespace = ''; // the namespace for the event

  function addListener(element, eventName, callback) {
    if (element.addEventListener && eventName != 'propertychange') {
      element.addEventListener(eventName, function (event) {
        callback.call(this, Event.fix(event));
      }, false);
    } else if (element.attachEvent) {
      element.attachEvent('on' + eventName, function (event) {
        callback.call(this, Event.fix(event));
      });
    }
  }

  function getClassIndex(classAttribute, className) {
    if (!classAttribute || typeof classAttribute !== 'string' || className == null) {
      return -1;
    }

    classAttribute = ' ' + classAttribute + ' ';
    return classAttribute.indexOf(' ' + className + ' ');
  }

  var ampRegEx = /&/g;
  var lessThanRegEx = /</g;

  function escapeValue(value) {
    return String(value)
      .replace(ampRegEx, '&amp;')
      .replace(lessThanRegEx, '&lt;');
  }
    var hasOwn = Object.prototype.hasOwnProperty;

    var virtualElementIdentity = '__blocks.VirtualElement__';

    var dataIdAttr = 'data-id';

    var dataQueryAttr = 'data-query';


  function createFragment(html) {
    var fragment = document.createDocumentFragment();
    var temp = document.createElement('div');
    var count = 1;
    var table = '<table>';
    var tableEnd = '</table>';
    var tbody = '<tbody>';
    var tbodyEnd = '</tbody>';
    var tr = '<tr>';
    var trEnd = '</tr>';

    html = html.toString();

    if ((html.indexOf('<option') != -1) && html.indexOf('<select') == -1) {
      html = '<select>' + html + '</select>';
      count = 2;
    } else if (html.indexOf('<table') == -1) {
      if (html.match(/<(tbody|thead|tfoot)/)) {
        count = 2;
        html = table + html + tableEnd;
      } else if (html.indexOf('<tr') != -1) {
        count = 3;
        html = table + tbody + html + tbodyEnd + tableEnd;
      } else if (html.match(/<(td|th)/)) {
        count = 4;
        html = table + tbody + tr + html + trEnd + tbodyEnd + tableEnd;
      }
    }


    temp.innerHTML = 'A<div>' + html + '</div>';

    while (count--) {
      temp = temp.lastChild;
    }

    while (temp.firstChild) {
      fragment.appendChild(temp.firstChild);
    }

    return fragment;
  }

  var browser = {};

  function parseVersion(matches) {
    if (matches) {
      return parseFloat(matches[1]);
    }
    return undefined;
  }

  if (typeof document !== 'undefined') {
    blocks.extend(browser, {
      IE: document && (function () {
        var version = 3;
        var div = document.createElement('div');
        var iElems = div.getElementsByTagName('i');

        /* jshint noempty: false */
        // Disable JSHint error: Empty block
        // Keep constructing conditional HTML blocks until we hit one that resolves to an empty fragment
        while (
          div.innerHTML = '<!--[if gt IE ' + (++version) + ']><i></i><![endif]-->',
          iElems[0]
          ) { }
        return version > 4 ? version : undefined;
      }()),

      Opera: (window && window.navigator && window.opera && window.opera.version && parseInt(window.opera.version(), 10)) || undefined,

      Safari: window && window.navigator && parseVersion(window.navigator.userAgent.match(/^(?:(?!chrome).)*version\/([^ ]*) safari/i)),

      Firefox: window && window.navigator && parseVersion(window.navigator.userAgent.match(/Firefox\/([^ ]*)/))
    });
  }

  var ElementsData = (function () {
    var data = {};
    var globalId = 1;
    
    function getDataId(element) {
      var result = element ? VirtualElement.Is(element) ? element._state ? element._state.attributes[dataIdAttr] : element._attributes[dataIdAttr] :
        element.nodeType == 1 ? element.getAttribute(dataIdAttr) :
          element.nodeType == 8 ? /\s+(\d+):[^\/]/.exec(element.nodeValue) :
            null :
        null;

      return blocks.isArray(result) ? result[1] : result;
    }

    function setDataId(element, id) {
      if (VirtualElement.Is(element)) {
        element.attr(dataIdAttr, id);
      } else if (element.nodeType == 1) {
        element.setAttribute(dataIdAttr, id);
      }
    }

    return {
      id: function (element) {
        return getDataId(element);
      },

      collectGarbage: function () {
        blocks.each(data, function (value) {
          if (value && value.dom && !document.body.contains(value.dom)) {
            ElementsData.clear(value.id, true);
          }
        });
      },

      createIfNotExists: function (element) {
        var isVirtual = element && element.__identity__ == virtualElementIdentity;
        var currentData;
        var id;
        
        if (isVirtual) {
          currentData = data[element._getAttr(dataIdAttr)];
        } else {
          currentData = data[element && getDataId(element)];
        }

        if (!currentData) {
          id = globalId++;
          if (element) {
            if (isVirtual && element._each) {
              element._haveAttributes = true;
              if (element._state) {
                element._state.attributes[dataIdAttr] = id;
              } else {
                element._attributes[dataIdAttr] = id;
              }
            } else {
              setDataId(element, id);
            }
          }

          // if element is not defined then treat it as expression
          if (!element) {
            currentData = data[id] = {
              id: id,
              observables: {}
            };
          } else {
            currentData = data[id] = {
              id: id,
              virtual: isVirtual ? element : null,
              animating: 0,
              observables: {},
              preprocess: isVirtual
            };
          }
        }

        return currentData;
      },

      byId: function (id) {
        return data[id];
      },

      data: function (element, name, value) {
        var result = data[getDataId(element) || element];
        if (!result) {
          return;
        }
        if (arguments.length == 1) {
          return result;
        } else if (arguments.length > 2) {
          result[name] = value;
        }
        return result[name];
      },

      clear: function (element, force) {
        var id = getDataId(element) || element;
        var currentData = data[id];

        if (currentData && (!currentData.haveData || force)) {
          blocks.each(currentData.observables, function (value) {
            for (var i = 0; i < value._elements.length; i++) {
              if (value._elements[i].elementId == currentData.id) {
                value._elements.splice(i, 1);
                i--;
              }
            }

            if (value._expressionKeys[currentData.id]) {
              for (i = 0; i < value._expressions.length; i++) {
                if (value._expressions[i].elementId == currentData.id) {
                  value._expressions.splice(i, 1);
                  i--;
                }
              }
              value._expressionKeys[currentData.id] = null;
            }
          });
          data[id] = undefined;
          if (VirtualElement.Is(element)) {
            element.attr(dataIdAttr, null);
          } else if (element.nodeType == 1) {
            element.removeAttribute(dataIdAttr);
          }
        }
      }
    };
  })();


	// addEventListener implementation that fixes old browser issues
  function on(element, eventName, handler) {
    if (Workarounds[eventName]) {
      Workarounds[eventName](element, handler, function (eventName, callback) {
        addListener(element, eventName, callback);
      });
    } else {
      addListener(element, eventName, handler);
    }
  }

  var Workarounds = {
		// support for "oninput" in legacy browsers
    input: function (element, handler, subscribe) {
      var timeout;

      function call(e) {
        clearTimeout(timeout);
        handler(e);
      }

      function deferCall() {
        if (!timeout) {
          timeout = setTimeout(call, 4);
        }
      }

      if (browser.IE < 10) {
        subscribe('propertychange', function (e) {
          if (e.originalEvent.propertyName === 'value') {
            call(e);
          }
        });

        if (browser.IE == 8) {
          subscribe('keyup', call);
          subscribe('keydown', call);
        }
        if (browser.IE >= 8) {
          globalSelectionChangeHandler(element, call);
          subscribe('dragend', deferCall);
        }
      } else {
        subscribe('input', call);

        if (browser.Safari < 7 && element.tagName.toLowerCase() == 'textarea') {
          subscribe('keydown', deferCall);
          subscribe('paste', deferCall);
          subscribe('cut', deferCall);
        } else if (browser.Opera < 11) {
          subscribe('keydown', deferCall);
        } else if (browser.Firefox < 4.0) {
          subscribe('DOMAutoComplete', call);
          subscribe('dragdrop', call);
          subscribe('drop', call);
        }
      }
    }
  };

  var globalSelectionChangeHandler = (function () {
    var isRegistered = false;

    function selectionChangeHandler(e) {
      var element = this.activeElement;
      var handler = element && ElementsData.data(element, 'selectionchange');
      if (handler) {
        handler(e);
      }
    }

    return function (element, handler) {
      if (!isRegistered) {
        addListener(element.ownerDocument, 'selectionchange', selectionChangeHandler);
        isRegistered = true;
      }
      ElementsData.createIfNotExists(element).selectionChange = handler;
    };
  })();

  
  var dom = blocks.dom = {
    valueTagNames: {
      input: true,
      textarea: true,
      select: true
    },

    valueTypes: {
      file: true,
      hidden: true,
      password: true,
      text: true,

      // New HTML5 Types
      color: true,
      date: true,
      datetime: true,
      'datetime-local': true,
      email: true,
      month: true,
      number: true,
      range: true,
      search: true,
      tel: true,
      time: true,
      url: true,
      week: true
    },

    props: {
      'for': true,
      'class': true,
      value: true,
      checked: true,
      tabindex: true,
      className: true,
      htmlFor: true
    },

    propFix: {
      'for': 'htmlFor',
      'class': 'className',
      tabindex: 'tabIndex'
    },

    attrFix: {
      className: 'class',
      htmlFor: 'for'
    },

    addClass: function (element, className) {
      if (element) {
        setClass('add', element, className);  
      }
    },

    removeClass: function (element, className) {
      if (element) {
        setClass('remove', element, className);  
      }
    },

    html: function (element, html) {
      if (element) {
        html = html.toString();
        if (element.nodeType == 8) {
          dom.comment.html(element, html);
        } else if (browser.IE < 10) {
          while (element.firstChild) {
            element.removeChild(element.firstChild);
          }
          element.appendChild(createFragment(html));
        } else {
          element.innerHTML = html;
        }
      }
    },

    css: function (element, name, value) {
      // IE7 will thrown an error if you try to set element.style[''] (with empty string)
      if (!element || !name) {
        return;
      }

      if (name == 'display') {
        animation.setVisibility(element, value == 'none' ? false : true);
      } else {
        element.style[name] = value;
      }
    },

    on: function (element, eventName, handler) {
      if (element) {
        on(element, eventName, handler);
      }
    },

    off: function () {

    },

    removeAttr: function (element, attributeName) {
      if (element && attributeName) {
        dom.attr(element, attributeName, null);  
      }
    },

    attr: function (element, attributeName, attributeValue) {
      var isProperty = dom.props[attributeName];
      attributeName = dom.propFix[attributeName.toLowerCase()] || attributeName;

      if ((blocks.core.skipExecution &&
        blocks.core.skipExecution.element === element &&
        blocks.core.skipExecution.attributeName == attributeName) ||
        !element) {
        return;
      }
      
      if (element.nodeType == 8) {
        dom.comment.attr(element, attributeName, attributeValue);
        return;
      }

      if (attributeName == 'checked') {
        if (attributeValue != 'checked' &&
          typeof attributeValue == 'string' &&
          element.getAttribute('type') == 'radio' &&
          attributeValue != element.value && element.defaultValue != null && element.defaultValue !== '') {

          attributeValue = false;
        } else {
          attributeValue = !!attributeValue;
        }
      }

      if (arguments.length === 1) {
        return isProperty ? element[attributeName] : element.getAttribute(attributeName);
      } else if (attributeValue != null) {
        if (attributeName == 'value' && element.tagName.toLowerCase() == 'select') {
          attributeValue = keys(blocks.toArray(attributeValue));
          blocks.each(element.children, function (child) {
            child.selected = !!attributeValue[child.value];
          });
        } else {
          if (isProperty) {
            element[attributeName] = attributeValue;
          } else {
            element.setAttribute(attributeName, attributeValue);
          }
        }
      } else {
        if (isProperty) {
          if (attributeName == 'value' && element.tagName.toLowerCase() == 'select') {
            element.selectedIndex = -1;
          } else if (element[attributeName]) {
            element[attributeName] = '';
          }
        } else {
          element.removeAttribute(attributeName);
        }
      }
    },

    comment: {
      html: function (element, html) {
        // var commentElement = this._element.nextSibling;
        // var parentNode = commentElement.parentNode;
        // parentNode.insertBefore(DomQuery.CreateFragment(html), commentElement);
        // parentNode.removeChild(commentElement);
        var commentElement = element;
        var parentNode = commentElement.parentNode;
        var currentElement = commentElement.nextSibling;
        var temp;
        var count = 0;

        while (currentElement && (currentElement.nodeType != 8 || currentElement.nodeValue.indexOf('/blocks') == -1)) {
          count++;
          temp = currentElement.nextSibling;
          parentNode.removeChild(currentElement);
          currentElement = temp;
        }

        parentNode.insertBefore(createFragment(html), commentElement.nextSibling);
        //parentNode.removeChild(currentElement);
        return count;
      },

      attr: function (element, attributeName, attributeValue) {
        if (element && attributeName == dataIdAttr && attributeValue) {
          var commentElement = element;
          // TODO: This should be refactored
          var endComment = element._endElement;
          commentElement.nodeValue = ' ' + attributeValue + ':' + commentElement.nodeValue.replace(trimRegExp, '') + ' ';
          endComment.nodeValue = ' ' + attributeValue + ':' + endComment.nodeValue.replace(trimRegExp, '') + ' ';
          return this;
        }
        return this;
      }
    }
  };
    var parameterQueryCache = {};


  var Observer = (function () {
    var stack = [];

    return {
      startObserving: function () {
        stack.push([]);
      },

      stopObserving: function () {
        return stack.pop();
      },

      currentObservables: function () {
        return stack[stack.length - 1];
      },

      registerObservable: function (newObservable) {
        var observables = stack[stack.length - 1];
        var alreadyExists = false;

        if (observables) {
          blocks.each(observables, function (observable) {
            if (observable === newObservable) {
              alreadyExists = true;
              return false;
            }
          });
          if (!alreadyExists) {
            observables.push(newObservable);
          }
        }
      }
    };
  })();

  var Expression = {
    Html: 0,
    ValueOnly: 2,
    
    Create: function (text, attributeName, element) {
      var index = -1;
      var endIndex = 0;
      var result = [];
      var character;
      var startIndex;
      var match;

      while (text.length > ++index) {
        character = text.charAt(index);

        if (character == '{' && text.charAt(index + 1) == '{') {
          startIndex = index + 2;
        } else if (character == '}' && text.charAt(index + 1) == '}') {
          if (startIndex) {
            match = text.substring(startIndex, index);
            if (!attributeName) {
              match = match
                .replace(/&amp;/g, '&')
                .replace(/&quot;/g, '"')
                .replace(/&#39;/g, '\'')
                .replace(/&lt;/g, '<')
                .replace(/&gt;/g, '>');
            }

            character = text.substring(endIndex, startIndex - 2);
            if (character) {
              result.push(character);
            }

            result.push({
              expression: match,
              attributeName: attributeName
            });

            endIndex = index + 2;
          }
          startIndex = 0;
        }
      }

      character = text.substring(endIndex);
      if (character) {
        result.push(character);
      }

      result.text = text;
      result.attributeName = attributeName;
      result.element = element;
      result.isExpression = true;
      return match ? result : null;
    },

    GetValue: function (context, elementData, expression, type) {
      var value = '';
      var length = expression.length;
      var index = -1;
      var chunk;

      if (!context) {
        return expression.text;
      }
      
      if (length == 1) {
        value = Expression.Execute(context, elementData, expression[0], expression, type);
      } else {
        while (++index < length) {
          chunk = expression[index];
          if (typeof chunk == 'string') {
            value += chunk;
          } else {
            value += Expression.Execute(context, elementData, chunk, expression, type);
          }
        }  
      }

      expression.lastResult = value;

      return value;
    },

    Execute: function (context, elementData, expressionData, entireExpression, type) {
      var expression = expressionData.expression;
      var attributeName = expressionData.attributeName;
      var isObservable;
      var expressionObj;
      var observables;
      var result;
      var value;
      var func;

      // jshint -W054
      // Disable JSHint error: The Function constructor is a form of eval
      func = parameterQueryCache[expression] = parameterQueryCache[expression] ||
        new Function('c', 'with(c){with($this){ return ' + expression + '}}');

      Observer.startObserving();

 {
        try {
          value = func(context);
        } catch (ex) {
          blocks.debug.expressionFail(expression, entireExpression.element);
        }
      }      value = func(context);

      isObservable = blocks.isObservable(value);
      result = isObservable ? value() : value;
      result = result == null ? '' : result.toString();
      result = escapeValue(result);

      observables = Observer.stopObserving();

      if (type != Expression.ValueOnly && (isObservable || observables.length)) {
        if (!attributeName) {
          elementData = ElementsData.createIfNotExists();
        }
        if (elementData) {
          elementData.haveData = true;

          expressionObj = {
            length: result.length,
            attr: attributeName,
            context: context,
            elementId: elementData.id,
            expression: expression,
            entire: entireExpression
          };

          blocks.each(observables, function (observable) {
            if (!observable._expressionKeys[elementData.id]) {
              observable._expressionKeys[elementData.id] = true;
              observable._expressions.push(expressionObj);
            }

            elementData.observables[observable.__id__ + (attributeName || 'expression') + '[' + expression + ']'] = observable;
          });
        }
        if (!attributeName) {
          result = '<!-- ' + elementData.id + ':blocks -->' + result;
        }
      }
      
      return result;
    }
  };


  function VirtualElement(tagName) {
    if (!VirtualElement.prototype.isPrototypeOf(this)) {
      return new VirtualElement(tagName);
    }

    this.__identity__ = virtualElementIdentity;
    this._tagName = tagName ? tagName.toString().toLowerCase() : null;
    this._attributes = {};
    this._attributeExpressions = [];
    this._parent = null;
    this._children = [];
    this._isSelfClosing = false;
    this._haveAttributes = true;
    this._innerHTML = null;
    this._renderMode = VirtualElement.RenderMode.All;
    this._haveStyle = false;
    this._style = {};
    this._states = null;
    this._state = null;

    if (blocks.isElement(tagName)) {
      this._el = tagName;
    }
  }

  blocks.VirtualElement = blocks.inherit(VirtualElement, {
    tagName: function (tagName) {
      if (tagName) {
        this._tagName = tagName;
        return this;
      }
      return this._tagName;
    },

    /**
     * Gets or sets the inner HTML of the element.
     *
     * @param {String} [html] - The new html that will be set. Provide the parameter only if you want to set new html.
     * @returns {String|VirtualElement} - returns itself if it is used as a setter(no parameters specified)
     * and returns the inner HTML of the element if it used as a getter .
     */
    html: function (html) {
      if (arguments.length > 0) {
        html = html == null ? '' : html;
        if (this._state) {
          if (this._state.html !== html) {
            this._state.html = html;
            dom.html(this._el, html);
          }
        } else {
          this._innerHTML = html;
          dom.html(this._el, html);
        }
        this._children = [];
        return this;
      }
      return this._innerHTML || '';
    },

    /**
     * Gets or sets the inner text of the element.
     *
     * @param {String} [html] - The new text that will be set. Provide the parameter only if you want to set new text.
     * @returns {String|VirtualElement} - returns itself if it is used as a setter(no parameters specified)
     * and returns the inner text of the element if it used as a getter.
     */
    text: function (text) {
      if (arguments.length > 0) {
        if (text != null) {
          text = escapeValue(text);
          this.html(text);
        }
        return this;
      }
      return this.html();
    },

    /**
     * Gets the parent VirtualElement
     *
     * @returns {VirtualElement} - The parent VirtualElement
     */
    parent: function () {
      return this._parent;
    },

    children: function (value) {
      if (typeof value === 'number') {
        return this._children[value];
      }
      return this._children;
    },

    /**
     * Gets or sets an attribute value
     *
     * @param {String} attributeName - The attribute name to be set or retrieved.
     * @param {String} [attributeValue] - The value to be set to the attribute.
     * @returns {VirtualElement|String} - Returns the VirtualElement itself if you set an attribute.
     * Returns the attribute name value if only the first parameter is specified.
     */
    attr: function (attributeName, attributeValue) {
      var _this = this;
      var returnValue;

      if (typeof attributeName == 'string') {
        var tagName = this._tagName;
        var type = this._attributes.type;
        var rawAttributeValue = attributeValue;
        var elementData = ElementsData.data(this);
        var value = this._getAttr('value');

        attributeName = blocks.unwrapObservable(attributeName);
        attributeName = dom.attrFix[attributeName] || attributeName;
        attributeValue = blocks.unwrapObservable(attributeValue);

        if (blocks.isObservable(rawAttributeValue) && attributeName == 'value' && dom.valueTagNames[tagName] && (!type || dom.valueTypes[type])) {
          elementData.subscribe = tagName == 'select' ? 'change' : 'input';
          elementData.valueObservable = rawAttributeValue;
        } else if (blocks.isObservable(rawAttributeValue) &&
          attributeName == 'checked' && (type == 'checkbox' || type == 'radio')) {

          elementData.subscribe = 'click';
          elementData.valueObservable = rawAttributeValue;
        }

        if (arguments.length == 1) {
          returnValue = this._getAttr(attributeName);
          return returnValue === undefined ? null : returnValue;
        }

        if (attributeName == 'checked' && attributeValue != null && !this._fake) {
          if (this._attributes.type == 'radio' &&
            typeof attributeValue == 'string' &&
            value != attributeValue && value != null) {

            attributeValue = null;
          } else {
            attributeValue = attributeValue ? 'checked' : null;
          }
        } else if (attributeName == 'disabled') {
          attributeValue = attributeValue ? 'disabled' : null;
        }

        if (tagName == 'textarea' && attributeName == 'value' && !this._el) {
          this.html(attributeValue);
        } else if (attributeName == 'value' && tagName == 'select') {
          this._values = keys(blocks.toArray(attributeValue));
          dom.attr(this._el, attributeName, attributeValue);
        } else {
          this._haveAttributes = true;
          if (this._state) {
            if (this._state.attributes[attributeName] !== attributeValue) {
              this._state.attributes[attributeName] = attributeValue;
              dom.attr(this._el, attributeName, attributeValue);
            }
          } else {
            this._attributes[attributeName] = attributeValue;
            dom.attr(this._el, attributeName, attributeValue);
          }
        }
      } else if (blocks.isPlainObject(attributeName)) {
        blocks.each(attributeName, function (val, key) {
          _this.attr(key, val);
        });
      }

      return this;
    },

    /**
     * Removes a particular attribute from the VirtualElement
     *
     * @param {String} attributeName - The attributeName which will be removed
     * @returns {VirtualElement} - The VirtualElement itself
     */
    removeAttr: function (attributeName) {
      this._attributes[attributeName] = null;
      dom.removeAttr(this._el, attributeName);
      return this;
    },

    /**
     * Gets or sets a CSS property
     *
     * @param {String} name - The CSS property name to be set or retrieved
     * @param {String} [value] - The value to be set to the CSS property
     * @returns {VirtualElement|String} - Returns the VirtualElement itself if you use the method as a setter.
     * Returns the CSS property value if only the first parameter is specified.
     */
    css: function (propertyName, value) {
      var _this = this;

      if (typeof propertyName == 'string') {
        propertyName = blocks.unwrap(propertyName);
        value = blocks.unwrap(value);

        if (!propertyName) {
          return;
        }

        propertyName = propertyName.toString().replace(/-\w/g, function (match) {
          return match.charAt(1).toUpperCase();
        });

        if (arguments.length === 1) {
          value = this._getCss(propertyName);
          return value === undefined ? null : value;
        }

        if (propertyName == 'display') {
          value = value == 'none' || (!value && value !== '') ? 'none' : '';
        }

        this._haveStyle = true;
        if (!VirtualElement.CssNumbers[propertyName]) {
          value = blocks.toUnit(value);
        }
        if (this._state) {
          if (this._state.style[propertyName] !== value) {
            this._state.style[propertyName] = value;
            dom.css(this._el, propertyName, value);
          }
        } else {
          this._style[propertyName] = value;
          dom.css(this._el, propertyName, value);
        }
      } else if (blocks.isPlainObject(propertyName)) {
        blocks.each(propertyName, function (val, key) {
          _this.css(key, val);
        });
      }

      return this;
    },

    addChild: function (element, index) {
      var children = this._template || this._children;
      var fragment;

      if (element) {
        element._parent = this;
        if (this._childrenEach || this._each) {
          element._each = true;
        } else if (this._el) {
          fragment = createFragment(element.render(blocks.domQuery(this)));
          element._el = fragment.childNodes[0];
          if (typeof index === 'number') {
            this._el.insertBefore(fragment, this._el.childNodes[index]);
          } else {
            this._el.appendChild(fragment);
          }
        }
        if (typeof index === 'number') {
          children.splice(index, 0, element);
        } else {
          children.push(element);
        }
      }
      return this;
    },

    /**
     * Adds a class to the element
     * @param {string|Array} classNames - A single className,
     * multiples separated by space or array of class names.
     * @returns {VirtualElement} - Returns the VirtualElement itself to allow chaining.
     */
    addClass: function (classNames) {
      setClass('add', this, classNames);
      dom.addClass(this._el, classNames);
      return this;
    },

    /**
     * Removes a class from the element
     * @param {string|Array} classNames - A single className,
     * multiples separated by space or array of class names.
     * @returns {VirtualElement} - Returns the VirtualElement itself to allow chaining.
     */
    removeClass: function (classNames) {
      setClass('remove', this, classNames);
      dom.removeClass(this._el, classNames);
      return this;
    },

    toggleClass: function (className, condition) {
      if (condition === false) {
        this.removeClass(className);
      } else {
        this.addClass(className);
      }
    },

    /** Checks whether the element has the specified class name
     * @param {string} className - The class name to check for
     * @returns {boolean} - Returns a boolean determining if element has
     * the specified class name
     */
    hasClass: function (className) {
      return getClassIndex(this._attributes[classAttr], className) != -1;
    },

    renderBeginTag: function () {
      var html;

      html = '<' + this._tagName;
      if (this._haveAttributes) {
        html += this._renderAttributes();
      }
      if (this._haveStyle) {
        html += generateStyleAttribute(this._style, this._state);
      }
      html += this._isSelfClosing ? ' />' : '>';

      return html;
    },

    renderEndTag: function () {
      if (this._isSelfClosing) {
        return '';
      }
      return '</' + this._tagName + '>';
    },

    render: function (domQuery, syncIndex) {
      var html = '';
      var childHtml = '';
      var htmlElement = this._el;

      if (syncIndex !== undefined) {
        this._state = {
          attributes: {},
          style: {},
          html: null,
          expressions: {}
        };
        if (!this._states) {
          this._states = {};
        }
        this._states[syncIndex] = this._state;
      }

      this._el = undefined;

      this._execute(domQuery);

      this._el = htmlElement;

      if (this._renderMode != VirtualElement.RenderMode.None) {
        if (this._renderMode != VirtualElement.RenderMode.ElementOnly) {
          if (this._state && this._state.html !== null) {
            childHtml = this._state.html;
          } else if (this._innerHTML != null) {
            childHtml = this._innerHTML;
          } else {
            childHtml = this.renderChildren(domQuery, syncIndex);
          }
        }

        html += this.renderBeginTag();

        html += childHtml;

        html += this.renderEndTag();
      }

      this._state = null;

      return html;
    },

    renderChildren: function (domQuery, syncIndex) {
      var html = '';
      var children = this._template || this._children;
      var length = children.length;
      var index = -1;
      var child;
      var value;

      while (++index < length) {
        child = children[index];
        if (typeof child == 'string') {
          html += child;
        } else if (VirtualElement.Is(child)) {
          child._each = child._each || this._each;
          html += child.render(domQuery, syncIndex);
        } else if (domQuery) {
          value = Expression.GetValue(domQuery._context, null, child);
          if (this._state) {
            this._state.expressions[index] = value;
          }
          html += value;
        } else {
          if (!this._each && child.lastResult) {
            html += child.lastResult;
          } else {
            html += Expression.GetValue(null, null, child);
          }
        }
      }

      return html;
    },

    sync: function (domQuery, syncIndex, element) {
      if (syncIndex) {
        this._state = this._states[syncIndex];
        this._el = element;
        this._each = false;
        this._sync = true;
      }

      this._execute(domQuery);

      this.renderBeginTag();

      if (!this._innerHTML && !this._childrenEach && this._renderMode != VirtualElement.RenderMode.None) {
        this.syncChildren(domQuery, syncIndex);
      }

      this.renderEndTag();

      if (syncIndex) {
        this._state = null;
        this._el = undefined;
        this._each = true;
        this._sync = false;
      }
    },

    syncChildren: function (domQuery, syncIndex, offset) {
      var children = this._template || this._children;
      var length = children.length;
      var state = this._state;
      var element = this._el.nodeType == 8 ? this._el.nextSibling : this._el.childNodes[offset || 0];
      var index = -1;
      var elementForDeletion;
      var expression;
      var child;

      while (++index < length) {
        child = children[index];
        if (child.isExpression) {
          if (domQuery) {
            expression = Expression.GetValue(domQuery._context, null, child, state ? Expression.ValueOnly : Expression.Html);

            if (!state || (state && state.expressions[index] !== expression)) {
              if (state) {
                state.expressions[index] = expression;
                if (element) {
                  if (element.nodeType == 8) {
                    element = element.nextSibling;
                  }
                  element.nodeValue = expression;
                  element = element.nextSibling;
                } else {
                  this._el.textContent = expression;
                }
              } else {
                this._el.insertBefore(createFragment(expression), element);
                elementForDeletion = element;
                element = element.nextSibling;
                this._el.removeChild(elementForDeletion);
              }
            }
          }
        } else if (typeof child != 'string' && child._renderMode != VirtualElement.RenderMode.None) {
          child._each = child._each || this._each;

          child.sync(domQuery, syncIndex, element);

          element = element.nextSibling;
        } else {
          element = element.nextSibling;
        }
      }
    },

    updateChildren: function (collection, updateCount, domQuery, domElement) {
      var template = this._template;
      var child = template[0];
      var isOneChild = template.length === 1 && VirtualElement.Is(child);
      var childNodes = domElement.childNodes;
      var syncIndex = domQuery.getSyncIndex();
      var childContexts = domQuery._context.childs;
      var chunkLength = this._length();
      var offset = this._headers ? this._headers.length : 0;
      var index = -1;
      var context;

      while (++index < updateCount) {
        domQuery._context = context = childContexts[index];
        context.$this = collection[index];
        context.$parent = context.$parentContext.$this;
        if (isOneChild) {
          child.sync(domQuery, syncIndex + index, childNodes[index + offset]);
        } else {
          this.syncChildren(domQuery, syncIndex + index, (index * chunkLength) + offset);
        }
      }

      domQuery.popContext();
    },

    _length: function () {
      var template = this._template;
      var index = -1;
      var length = 0;

      while (++index < template.length) {
        if (template[index]._renderMode !== VirtualElement.RenderMode.None) {
          length += 1;
        }
      }

      return length;
    },

    _getAttr: function (name) {
      var state = this._state;
      return state && state.attributes[name] !== undefined ? state.attributes[name] : this._attributes[name];
    },

    _getCss: function (name) {
      var state = this._state;
      return state && state.style[name] !== undefined ? state.style[name] : this._style[name];
    },

    _execute: function (domQuery) {
      if (!domQuery) {
        return;
      }

      if (this._each) {
        this._el = undefined;
      }

      if (this._renderMode != VirtualElement.RenderMode.None) {
        var id = this._attributes[dataIdAttr];
        var data;

        if (!id || domQuery._serverData) {
          ElementsData.createIfNotExists(this);
          domQuery.applyContextToElement(this);
          id = this._attributes[dataIdAttr];
          data = ElementsData.byId(id);
        }

        if (this._attributeExpressions.length) {
          this._executeAttributeExpressions(domQuery._context);
        }

        domQuery.executeQuery(this, this._attributes[dataQueryAttr]);

        if (data && !data.haveData) {
          ElementsData.clear(this);
        }
      }
    },

    _renderAttributes: function () {
      var attributes = this._attributes;
      var state = this._state;
      var html = '';
      var key;
      var value;

      if (this._tagName == 'option' && this._parent._values) {
        if (state && typeof state.attributes.value !== 'undefined') {
          state.attributes.selected = this._parent._values[state.attributes.value] ? 'selected' : null;
        } else {
          attributes.selected = this._parent._values[attributes.value] ? 'selected' : null;
        }
      }

      for (key in attributes) {
        value = attributes[key];
        if (state && hasOwn.call(state.attributes, key)) {
          continue;
        }
        if (value === '') {
          html += ' ' + key;
        } else if (value != null) {
          html += ' ' + key + '="' + value + '"';
        }
      }

      if (state) {
        for (key in state.attributes) {
          value = state.attributes[key];
          if (value === '') {
            html += ' ' + key;
          } else if (value != null) {
            html += ' ' + key + '="' + value + '"';
          }
        }
      }

      return html;
    },

    _createAttributeExpressions: function (serverData) {
      var attributeExpressions = this._attributeExpressions;
      var dataId = this._attributes[dataIdAttr];
      var each = this._each;
      var expression;

      blocks.each(this._attributes, function (attributeValue, attributeName) {
        if(!attributeValue) {
          // In Serverside rendering, some attributes will be set to null in some cases
          return;
        }

        if (!each && serverData && serverData[dataId + attributeName]) {
          expression = Expression.Create(serverData[dataId + attributeName], attributeName);
        } else {
          expression = Expression.Create(attributeValue, attributeName);
        }
        if (expression) {
          attributeExpressions.push(expression);
        }
      });
    },

    _executeAttributeExpressions: function (context) {
      var isVirtual = this._el ? false : true;
      var attributes = this._state && this._state.attributes;
      var elementData = ElementsData.byId(attributes ? attributes[dataIdAttr] : this._attributes[dataIdAttr]);
      var expressions = this._attributeExpressions;
      var attributeName;
      var expression;
      var value;

      for (var i = 0; i < expressions.length; i++) {
        expression = expressions[i];
        value = Expression.GetValue(context, elementData, expression);
        attributeName = expression.attributeName;
        if ((attributes && attributes[attributeName] !== value) || !attributes) {
          if (isVirtual) {
            if (this._state) {
              this._state.attributes[attributeName] = value;
            } else {
              this._attributes[attributeName] = value;
            }
          } else {
            dom.attr(this._el, attributeName, value);
          }
        }
      }
    }
  });

  VirtualElement.Is = function (value) {
    return value && value.__identity__ == virtualElementIdentity;
  };

  VirtualElement.RenderMode = {
    All: 0,
    ElementOnly: 2,
    None: 4
  };

  VirtualElement.CssNumbers = {
    columnCount: true,
    fillOpacity: true,
    flexGrow: true,
    flexShrink: true,
    fontWeight: true,
    lineHeight: true,
    opacity: true,
    order: true,
    orphans: true,
    widows: true,
    zIndex: true,
    zoom: true
  };

  function generateStyleAttribute(style, state) {
    var html = ' style="';
    var haveStyle = false;
    var key;
    var value;

    for (key in style) {
      value = style[key];
      if (state && hasOwn.call(state.style, key)) {
        continue;
      }
      if (value || value === 0) {
        haveStyle = true;
        key = key.replace(/[A-Z]/g, replaceStyleAttribute);
        html += key;
        html += ':';
        html += value;
        html += ';';
      }
    }

    if (state) {
      for (key in state.style) {
        value = state.style[key];
        if (value || value === 0) {
          haveStyle = true;
          key = key.replace(/[A-Z]/g, replaceStyleAttribute);
          html += key;
          html += ':';
          html += value;
          html += ';';
        }
      }
    }

    html += '"';
    return haveStyle ? html : '';
  }

  function replaceStyleAttribute(match) {
    return '-' + match.toLowerCase();
  }


  var classListMultiArguments = true;
  if (typeof document !== 'undefined') {
    var element = document.createElement('div');
    if (element.classList) {
      element.classList.add('a', 'b');
      classListMultiArguments = element.className == 'a b';
    }
  }

  function setClass(type, element, classNames) {
    if (classNames != null) {
      classNames = blocks.isArray(classNames) ? classNames : classNames.toString().split(' ');
      var i = 0;
      var classAttribute;
      var className;
      var index;

      if (VirtualElement.Is(element)) {
        classAttribute = element._getAttr(classAttr);
      } else if (element.classList) {
        if (classListMultiArguments) {
          element.classList[type].apply(element.classList, classNames);
        } else {
          blocks.each(classNames, function (value) {
            element.classList[type](value);
          });
        }
        return;
      } else {
        classAttribute = element.className;
      }
      classAttribute = classAttribute || '';

      for (; i < classNames.length; i++) {
        className = classNames[i];
        index = getClassIndex(classAttribute, className);
        if (type == 'add') {
          if (index < 0) {
            if (classAttribute !== '') {
              className = ' ' + className;
            }
            classAttribute += className;
          }
        } else if (index != -1) {
          classAttribute = (classAttribute.substring(0, index) + ' ' +
          classAttribute.substring(index + className.length + 1, classAttribute.length)).replace(trimRegExp, '');
        }
      }

      if (VirtualElement.Is(element)) {
        if (element._state) {
          element._state.attributes[classAttr] = classAttribute;
        } else {
         element._attributes[classAttr] = classAttribute; 
        }
      } else {
        element.className = classAttribute;
      }
    }
  }

  var animation = {
    insert: function (parentElement, index, chunk) {
      index = getIndexOffset(parentElement, index);
      var insertPositionNode = parentElement.childNodes[index];
      var childNodesCount;
      var firstChild;

      blocks.each(chunk, function (node) {
        childNodesCount = node.nodeType == 11 ? node.childNodes.length : 0;
        firstChild = node.childNodes ? node.childNodes[0] : undefined;

        if (insertPositionNode) {
          //checkItemExistance(insertPositionNode);
          parentElement.insertBefore(node, insertPositionNode);
        } else {
          //checkItemExistance(parentElement.childNodes[parentElement.childNodes.length - 1]);
          parentElement.appendChild(node);
        }

        if (childNodesCount) {
          while (childNodesCount) {
            animateDomAction('add', firstChild);
            firstChild = firstChild.nextSibling;
            childNodesCount--;
          }
        } else {
          animateDomAction('add', node);
        }
      });
    },

    remove: function (parentElement, index, count) {
      var i = 0;
      var node;

      index = getIndexOffset(parentElement, index);

      for (; i < count; i++) {
        node = parentElement.childNodes[index];
        if (node) {
          if (animateDomAction('remove', node)) {
            index++;
          }
        }
      }
    },

    setVisibility: function (element, visible) {
      if (visible) {
        animation.show(element);
      } else {
        animation.hide(element);
      }
    },

    show: function (element) {
      animateDomAction('show', element);
    },

    hide: function (element) {
      animateDomAction('hide', element);
    }
  };

  function getIndexOffset(parentElement, index) {
    var elementData = ElementsData.data(parentElement);
    if (elementData && elementData.animating > 0) {
      var childNodes = parentElement.childNodes;
      var childIndex = 0;
      var currentIndex = 0;
      var className;

      while (index != currentIndex) {
        if (!childNodes[childIndex]) {
          return Number.POSITIVE_INFINITY;
        }
        className = childNodes[childIndex].className;
        childIndex++;

        if (getClassIndex(className, 'b-hide') == -1) {
          currentIndex++;
        }
      }

      if (!childNodes[childIndex]) {
        return Number.POSITIVE_INFINITY;
      }

      className = childNodes[childIndex].className;

      while (getClassIndex(className, 'b-hide') != -1) {
        childIndex++;
        if (!childNodes[childIndex]) {
          return Number.POSITIVE_INFINITY;
        }
        className = childNodes[childIndex].className;
      }

      return childIndex;
    }

    return index;
  }

  function animateDomAction(type, element) {
    var animating = false;
    var elementData = ElementsData.createIfNotExists(element);
    var parentElementData = ElementsData.createIfNotExists(element.parentNode);
    var animateCallback = elementData.animateCallback;
    var cssType = type == 'remove' ? 'hide' : type == 'add' ? 'show' : type;
    var disposeCallback = type == 'remove' ? function disposeElement() {
      ElementsData.clear(element, true);
      if (element.parentNode) {
        element.parentNode.removeChild(element);
      }
    } : type == 'hide' ? function hideElement() {
      element.style.display = 'none';
    } : blocks.noop;
    var readyCallback = function () {
      elementData.animating -= 1;
      parentElementData.animating -= 1;
      if (!elementData.animating) {
        disposeCallback();
      }
    };

    if (element.nodeType != 1) {
      disposeCallback();
      return;
    }

    if (type == 'show') {
      element.style.display = '';
    }

    if (elementData.preprocess) {
      disposeCallback();
      return;
    }

    if (animateCallback) {
      animating = true;
      elementData.animating += 1;
      parentElementData.animating += 1;
      var context = blocks.context(element);
      var thisArg = context.$view || context.$root;
      animateCallback.call(thisArg, element, readyCallback, cssType);
    }
    return animating || cssAnimate(cssType, element, disposeCallback, readyCallback);
  }

  function cssAnimate(type, element, disposeCallback, readyCallback) {
    if (typeof window == 'undefined' || window.ontransitionend === undefined) {
      disposeCallback();
      return;
    }
    setClass('add', element, 'b-' + type);

    var computedStyle = window.getComputedStyle(element);
    var prefix = '';
    var eventName;
    if (window.onanimationend === undefined && window.onwebkitanimationend !== undefined) {
      prefix = '-webkit-';
      eventName = 'webkitAnimationEnd';
    } else {
      eventName = 'animationend';
    }

    var transitionDuration = parseFloat(computedStyle['transition-duration']) || 0;
    var transitionDelay = parseFloat(computedStyle['transition-delay']) || 0;
    var animationDuration = parseFloat(computedStyle[prefix + 'animation-duration']) || 0;
    var animationDelay = parseFloat(computedStyle[prefix + 'animation-delay']) || 0;

    if ((transitionDuration <= 0 && transitionDelay <= 0 &&
      animationDuration <= 0 && animationDelay <= 0) ||
      !willAnimate(element, type)) {

      setClass('remove', element, 'b-' + type);
      disposeCallback();
      return;
    }

    ElementsData.createIfNotExists(element).animating += 1;
    ElementsData.createIfNotExists(element.parentNode).animating += 1;

    setTimeout(function () {
      setClass('add', element, 'b-' + type + '-end');
      element.addEventListener('transitionend', end, false);
      element.addEventListener(eventName, end, false);
    }, 1);

    function end() {
      setClass('remove', element, 'b-' + type);
      setClass('remove', element, 'b-' + type + '-end');
      readyCallback();
      element.removeEventListener('transitionend', end, false);
      element.removeEventListener(eventName, end, false);
    }

    return true;
  }


  // cache the willAnimate results
  // each element with identical className, style attribute and tagName
  // can be cached because the result will always be the same
  var willAnimateCache = {};

  // determines if the element will be transitioned or animated
  // check if the transitionProperty changes after applying b-type and b-type-end classes
  // if it changes this means that the element have styles for animating the element
  function willAnimate(element, type) {
    // cache key is unique combination between className, style attribute and tagName
    // which ensures the element will have the same styles
    var fromCache = willAnimateCache[element.className + element.getAttribute('style') + element.tagName];
    var result = false;
    var transitionProperties;
    var startStyle;
    var endStyle;

    if (fromCache || fromCache === false) {
      return fromCache;
    }

    setClass('remove', element, 'b-' + type);

    startStyle = blocks.extend({}, window.getComputedStyle(element));

    setClass('add', element, 'b-' + type);
    setClass('add', element, 'b-' + type + '-end');

    endStyle = window.getComputedStyle(element);

    // transitionProperty could return multiple properties - "color, opacity, font-size"
    transitionProperties = endStyle.transitionProperty.split(',');

    blocks.each(transitionProperties, function (property) {
      property = property.trim().replace(/-\w/g, function (match) {
        return match.charAt(1).toUpperCase();
      });

      if (property == 'all') {
        for (var key in endStyle) {
          if (endStyle[key] != startStyle[key]) {
            result = true;
          }
        }
        return false;
      } else {
        if (endStyle[property] != startStyle[property]) {
          result = true;
          return false;
        }
      }
    });

    setClass('remove', element, 'b-' + type + '-end');

    willAnimateCache[element.className + element.getAttribute('style') + element.tagName] = result;

    return result;
  }

  function VirtualComment(commentText) {
    if (!VirtualComment.prototype.isPrototypeOf(this)) {
      return new VirtualComment(commentText);
    }

    this.__Class__();

    if (commentText.nodeType == 8) {
      this._commentText = commentText.nodeValue;
      this._el = commentText;
    } else {
      this._commentText = commentText;
    }
  }

  blocks.VirtualComment = blocks.inherit(VirtualElement, VirtualComment, {
    renderBeginTag: function () {
      var dataId = this._getAttr(dataIdAttr);
      var html = '<!-- ';

      if (dataId) {
        html += dataId + ':';
      }
      html += this._commentText.replace(trimRegExp, '') + ' -->';

      return html;
    },

    renderEndTag: function () {
      var dataId = this._getAttr(dataIdAttr);
      var html = '<!-- ';

      if (dataId) {
        html += dataId + ':';
      }
      html += '/blocks -->';
      return html;
    },

    _executeAttributeExpressions: blocks.noop
  });

  VirtualComment.Is = function (value) {
    return VirtualComment.prototype.isPrototypeOf(value);
  };

  function createVirtual(htmlElement, parentElement) {
    var serverData = window.__blocksServerData__;
    var elements = [];
    var element;
    var tagName;
    var elementAttributes;
    var htmlAttributes;
    var htmlAttribute;
    var nodeType;
    var commentText;
    var commentTextTrimmed;
    var data;

    while (htmlElement) {
      nodeType = htmlElement.nodeType;
      if (nodeType == 1) {
        // HtmlDomElement
        tagName = htmlElement.tagName.toLowerCase();
        element = new VirtualElement(htmlElement);
        element._tagName = tagName;
        element._parent = parentElement;
        if (parentElement) {
          element._each = parentElement._each || parentElement._childrenEach;
        }
        element._haveAttributes = false;
        htmlAttributes = htmlElement.attributes;
        elementAttributes = {};
        for (var i = 0; i < htmlAttributes.length; i++) {
          htmlAttribute = htmlAttributes[i];
          // the style should not be part of the attributes. The style is handled individually.
          if (htmlAttribute.nodeName !== 'style' &&
            (htmlAttribute.specified ||
              //IE7 wil return false for .specified for the "value" attribute - WTF!
            (browser.IE < 8 && htmlAttribute.nodeName == 'value' && htmlAttribute.nodeValue))) {
            elementAttributes[htmlAttribute.nodeName.toLowerCase()] = browser.IE < 11 ? htmlAttribute.nodeValue : htmlAttribute.value;
            element._haveAttributes = true;
          }
        }
        element._attributes = elementAttributes;
        element._createAttributeExpressions(serverData);

        if (htmlElement.style.cssText) {
          element._haveStyle = true;
          element._style = generateStyleObject(htmlElement.style.cssText);
        }

        setIsSelfClosing(element);
        if (tagName == 'script' || tagName == 'style' || tagName == 'code' || element.hasClass('bl-skip')) {
          element._innerHTML = htmlElement.innerHTML;
        } else {
          element._children = createVirtual(htmlElement.childNodes[0], element);
        }

        elements.push(element);
      } else if (nodeType == 3) {
        // TextNode
        //if (htmlElement.data.replace(trimRegExp, '').replace(/(\r\n|\n|\r)/gm, '') !== '') {
        //
        //}
        data = escapeValue(htmlElement.data);
        elements.push(Expression.Create(data, null, htmlElement) || data);
      } else if (nodeType == 8) {
        // Comment
        commentText = htmlElement.nodeValue;
        commentTextTrimmed = commentText.replace(trimRegExp, '');
        if (commentTextTrimmed.indexOf('blocks') === 0) {
          element = new VirtualComment(htmlElement);
          element._parent = parentElement;
          element._attributes[dataQueryAttr] = commentTextTrimmed.substring(6);
          data = createVirtual(htmlElement.nextSibling, element);
          element._children = data.elements;
          element._el._endElement = data.htmlElement;
          htmlElement = data.htmlElement || htmlElement;
          elements.push(element);
        } else if (VirtualComment.Is(parentElement) && commentTextTrimmed.indexOf('/blocks') === 0) {
          return {
            elements: elements,
            htmlElement: htmlElement
          };
        } else if (VirtualComment.Is(parentElement)) {
          elements.push('<!--' + commentText + '-->');
        } else if (serverData) {
          var number = parseInt(/[0-9]+/.exec(commentTextTrimmed), 10);
          if (!blocks.isNaN(number) && serverData[number]) {
            elements.push(Expression.Create(serverData[number]));
          }
        } else if (commentTextTrimmed.indexOf('/blocks') !== 0) {
          elements.push('<!--' + commentText + '-->');
        }
      }
      htmlElement = htmlElement.nextSibling;
    }
    return elements;
  }

  function generateStyleObject(styleString) {
    var styles = styleString.split(';');
    var styleObject = {};
    var index;
    var style;
    var values;

    for (var i = 0; i < styles.length; i++) {
      style = styles[i];
      if (style) {
        index = style.indexOf(':');
        if (index != -1) {
          values = [style.substring(0, index), style.substring(index + 1)];
          styleObject[values[0].toLowerCase().replace(trimRegExp, '')] = values[1].replace(trimRegExp, '');
        }
      }
    }

    return styleObject;
  }

  var isSelfClosingCache = {};
  function setIsSelfClosing(element) {
    var tagName = element._tagName;
    var domElement;

    if (isSelfClosingCache[tagName] !== undefined) {
      element._isSelfClosing = isSelfClosingCache[tagName];
      return;
    }
    domElement = document.createElement('div');
    domElement.appendChild(document.createElement(tagName));
    isSelfClosingCache[tagName] = element._isSelfClosing = domElement.innerHTML.indexOf('</') === -1;
  }

  function createProperty(propertyName) {
    return function (value) {
      if (arguments.length === 0) {
        return this[propertyName];
      }
      this[propertyName] = value;
      return this;
    };
  }


  function parseQuery(query, callback) {
    var character = 0;
    var bracketsCount = 0;
    var curlyBracketsCount = 0;
    var squareBracketsCount = 0;
    var isInSingleQuotes = false;
    var isInDoubleQuotes = false;
    var startIndex = 0;
    var parameters = [];
    var currentParameter;
    var methodName;

    query = query || '';

    for (var i = 0; i < query.length; i++) {
      character = query.charAt(i);

      if (!isInSingleQuotes && !isInDoubleQuotes) {
        if (character == '[') {
          squareBracketsCount++;
        } else if (character == ']') {
          squareBracketsCount--;
        } else if (character == '{') {
          curlyBracketsCount++;
        } else if (character == '}') {
          curlyBracketsCount--;
        }
      }

      if (curlyBracketsCount !== 0 || squareBracketsCount !== 0) {
        continue;
      }

      if (character == '\'') {
        isInSingleQuotes = !isInSingleQuotes;
      } else if (character == '"') {
        isInDoubleQuotes = !isInDoubleQuotes;
      }

      if (isInSingleQuotes || isInDoubleQuotes) {
        continue;
      }

      if (character == '(') {
        if (bracketsCount === 0) {
          methodName = query.substring(startIndex, i).replace(trimRegExp, '');
          startIndex = i + 1;
        }
        bracketsCount++;
      } else if (character == ')') {
        bracketsCount--;
        if (bracketsCount === 0) {
          currentParameter = query.substring(startIndex, i).replace(trimRegExp, '');
          if (currentParameter.length) {
            parameters.push(currentParameter);
          }

          if (methodName) {
            methodName = methodName.replace(/^("|')+|("|')+$/g, ''); // trim single and double quotes
            callback(methodName, parameters);
          }
          parameters = [];
          methodName = undefined;
        }
      } else if (character == ',' && bracketsCount == 1) {
        currentParameter = query.substring(startIndex, i).replace(trimRegExp, '');
        if (currentParameter.length) {
          parameters.push(currentParameter);
        }
        startIndex = i + 1;
      } else if (character == '.' && bracketsCount === 0) {
        startIndex = i + 1;
      }
    }
  }

  function DomQuery(options) {
    this._options = options || {};
  }

  DomQuery.QueryCache = {};

  DomQuery.prototype = {
    options: function () {
      return this._options;
    },

    dataIndex: createProperty('_dataIndex'),

    context: createProperty('_context'),

    popContext: function () {
      if (this._context) {
        this._context = this._context.$parentContext;
      }
    },

    applyContextToElement: function (element) {
      var data = ElementsData.createIfNotExists(element);
      data.domQuery = this;
      data.context = this._context;

      if (this._hasChanged || (element._each && !element._parent._each)) {
        if (element._parent && !element._each) {
          data = ElementsData.createIfNotExists(element._parent);
          data.childrenContext = this._context;
        }

        this._hasChanged = false;
        data.haveData = true;
      }
    },

    pushContext: function (newModel) {
      var context = this._context;
      var models = context ? context.$parents.slice(0) : [];
      var newContext;

      this._hasChanged = true;

      if (context) {
        models.unshift(context.$this);
      }

      newContext = {
        $this: newModel,
        $root: context ? context.$root : newModel,
        $parent: context ? context.$this : null,
        $parents: context ? models : [],
        $index: this._dataIndex || null,
        $parentContext: context || null,
        __props__: context && context.__props__
      };
      newContext.$context = newContext;
      this._context = newContext;
      this.applyProperties();

      return newContext;
    },

    getSyncIndex: function () {
      var context = this._context;
      var index = '';

      while (context && context.$index) {
        index = context.$index.__value__ + '_' + index;
        context = context.$parentContext;
      }

      return index;
    },

    contextBubble: function (context, callback) {
      var currentContext = this._context;
      this._context = context;
      callback();
      this._context = currentContext;
    },

    addProperty: function (name, value) {
      var context = this._context;

      context.__props__ = context.__props__ || {};
      context.__props__[name] = value;
      this.applyProperties();
    },

    applyProperties: function () {
      var properties = this._context.__props__;
      var key;

      for (key in properties) {
        this._context[key] = properties[key];
      }
    },

    executeElementQuery: function (element) {
      var query = VirtualElement.Is(element) ? element._attributes[dataQueryAttr] :
          element.nodeType == 1 ? element.getAttribute(dataQueryAttr) : element.nodeValue.substring(element.nodeValue.indexOf('blocks') + 6).replace(trimRegExp, '');

      if (query) {
        this.executeQuery(element, query);
      }
    },

    executeQuery: function (element, query) {
      var cache = DomQuery.QueryCache[query] || createCache(query, element);

      this.executeMethods(element, cache);
    },

    executeMethods: function (element, methods) {
      var elementData = ElementsData.data(element);
      var lastObservablesLength = 0;
      var i = 0;
      var method;
      var executedParameters;
      var currentParameter;
      var parameters;
      var parameter;
      var context;
      var func;

      for (; i < methods.length; i++) {
        context = this._context;
        method = blocks.queries[methods[i].name];
        parameters = methods[i].params;
        executedParameters = method.passDomQuery ? [this] : [];
        if (VirtualElement.Is(element) && !method.call && !method.preprocess && (method.update || method.ready)) {
          elementData.haveData = true;
          if (!elementData.execute) {
            elementData.execute = [];
            elementData.executeHash = {};
          }
          if (!elementData.executeHash[methods[i].query]) {
             elementData.execute.push(methods[i]);
             elementData.executeHash[methods[i].query] = true;
          }
          continue;
        }
        Observer.startObserving();
        for (var j = 0; j < parameters.length; j++) {
          parameter = parameters[j];
          // jshint -W054
          // Disable JSHint error: The Function constructor is a form of eval
          func = parameterQueryCache[parameter] = parameterQueryCache[parameter] ||
              new Function('c', 'with(c){with($this){ return ' + parameter + '}}');

          currentParameter = {};

 {
            try {
              currentParameter.rawValue = func(context);
            } catch (e) {
              blocks.debug.queryParameterFail(methods[i], parameter, element);
            }
          }          currentParameter.rawValue = func(context);

          currentParameter.value = blocks.unwrapObservable(currentParameter.rawValue);

          if (method.passDetailValues) {
            currentParameter.isObservable = blocks.isObservable(currentParameter.rawValue);
            currentParameter.containsObservable = Observer.currentObservables().length > lastObservablesLength;
            lastObservablesLength = Observer.currentObservables().length;
            executedParameters.push(currentParameter);
          } else if (method.passRawValues) {
            executedParameters.push(currentParameter.rawValue);
          } else {
            executedParameters.push(currentParameter.value);
          }

          // Handling 'if' queries
          // Example: data-query='if(options.templates && options.templates.item, options.templates.item)'
          if (method === blocks.queries['if'] || method === blocks.queries.ifnot) {
            if ((!currentParameter.value && method === blocks.queries['if']) ||
                (currentParameter.value && method === blocks.queries.ifnot)) {
              if (!parameters[2]) {
                break;
              }
              this.executeQuery(element, parameters[2]);
              break;
            }
            this.executeQuery(element, parameters[1]);
            break;
          }
        }

 {
          var params = executedParameters;
          if (method.passDomQuery) {
            params = blocks.clone(executedParameters).slice(1);
          }
          blocks.debug.checkQuery(methods[i].name, params, methods[i], element);
        }        if (VirtualElement.Is(element)) {
          if (VirtualComment.Is(element) && !method.supportsComments) {
            // TODO: Should throw debug message
            continue;
          }

          if (method.call) {
            if (method.call === true) {
              element[methods[i].name].apply(element, executedParameters);
            } else {
              executedParameters.unshift(method.prefix || methods[i].name);
              element[method.call].apply(element, executedParameters);
            }
          } else if (method.preprocess) {
            if (method.preprocess.apply(element, executedParameters) === false) {
              this.subscribeObservables(methods[i], elementData, context);
              break;
            }
          }
        } else if (method.call) {
          var virtual = ElementsData.data(element).virtual;
          if (virtual._each) {
            virtual = VirtualElement('div');
            virtual._el = element;
            virtual._fake = true;
          }
          if (method.call === true) {
            virtual[methods[i].name].apply(virtual, executedParameters);
          } else {
            executedParameters.unshift(method.prefix || methods[i].name);
            virtual[method.call].apply(virtual, executedParameters);
          }
        } else if (elementData && elementData.preprocess && method.ready) {
          method.ready.apply(element, executedParameters);
        } else if (method.update) {
          method.update.apply(element, executedParameters);
        }

        this.subscribeObservables(methods[i], elementData, context);
      }
    },

    subscribeObservables: function (method, elementData, context) {
      var observables = Observer.stopObserving();

      if (elementData) {
        elementData.haveData = true;
        blocks.each(observables, function (observable) {
          if (!elementData.observables[observable.__id__ + method.query]) {
            elementData.observables[observable.__id__ + method.query] = observable;
            observable._elements.push({
              elementId: elementData.id,
              cache: [method],
              context: context
            });
          }
        });
      }
    },

    createElementObservableDependencies: function (elements) {
      var currentElement;
      var elementData;
      var tagName;

      for (var i = 0; i < elements.length; i++) {
        currentElement = elements[i];
        tagName = (currentElement.tagName || '').toLowerCase();
        if (currentElement.nodeType === 1 || currentElement.nodeType == 8) {
          elementData = ElementsData.data(currentElement);
          if (elementData) {
            this._context = elementData.context || this._context;
            elementData.dom = currentElement;
            if (elementData.execute) {
              this.executeMethods(currentElement, elementData.execute);
            }
            if (elementData.subscribe) {
              var eventName = elementData.updateOn || elementData.subscribe;
              on(currentElement, eventName, UpdateHandlers[eventName]);
            }
            elementData.preprocess = false;
            this._context = elementData.childrenContext || this._context;
          }
          if (tagName != 'script' && tagName != 'code' &&
            (' ' + currentElement.className + ' ').indexOf('bl-skip') == -1) {

            this.createElementObservableDependencies(currentElement.childNodes);
          }
        }
      }

      this._context = null;
    },

    createFragment: function (html) {
      var fragment = createFragment(html);
      this.createElementObservableDependencies(fragment.childNodes);

      return fragment;
    },

    cloneContext: function (context) {
      var newContext = blocks.clone(context);
      newContext.$context = newContext;
      return newContext;
    }
  };

  var UpdateHandlers = {
    change: function (e) {
      var target = e.target || e.srcElement;
      UpdateHandlers.getSetValue(target, ElementsData.data(target).valueObservable);
    },

    click: function (e) {
      UpdateHandlers.change(e);
    },

    //keyup: function (e) {

    //},

    input: function (e) {
      var target = e.target || e.srcElement;
      UpdateHandlers.getSetValue(target, ElementsData.data(target).valueObservable);
    },

    keydown: function (e) {
      var target = e.target || e.srcElement;
      var oldValue = target.value;
      var elementData = ElementsData.data(target);

      if (elementData) {
        setTimeout(function () {
          if (oldValue != target.value) {
            UpdateHandlers.getSetValue(target, ElementsData.data(target).valueObservable);
          }
        });
      }
    },

    getSetValue: function (element, value) {
      var tagName = element.tagName.toLowerCase();
      var type = element.getAttribute('type');

      if (type == 'checkbox') {
        value(element.checked);
      } else if (tagName == 'select' && element.getAttribute('multiple')) {
        var values = [];
        var selectedOptions = element.selectedOptions;
        if (selectedOptions) {
          blocks.each(selectedOptions, function (option) {
            values.push(option.getAttribute('value'));
          });
        } else {
          blocks.each(element.options, function (option) {
            if (option.selected) {
              values.push(option.getAttribute('value'));
            }
          });
        }

        value(values);
      } else {
        blocks.core.skipExecution = {
          element: element,
          attributeName: 'value'
        };
        value(element.value);
        blocks.core.skipExecution = undefined;
      }
    }
  };

  function createCache(query, element) {
    var cache = DomQuery.QueryCache[query] = [];

    parseQuery(query, function (methodName, parameters) {
      var method = blocks.queries[methodName];
      var methodObj = {
        name: methodName,
        params: parameters,
        query: methodName + '(' + parameters.join(',') + ')'
      };

      if (method) {
        // TODO: Think of a way to remove this approach
        if (methodName == 'attr' || methodName == 'val') {
          cache.unshift(methodObj);
        } else {
          cache.push(methodObj);
        }
      }
      else {
        blocks.debug.queryNotExists(methodObj, element);
      }
    });

    return cache;
  }


  /**
  * @namespace blocks.queries
  */
  blocks.extend(queries, {
    /**
     * Executes particular query depending on the condition specified
     *
     * @memberof blocks.queries
     * @param {boolean} condition - The result will determine if the consequent or the alternate query will be executed
     * @param {data-query} consequent - The query that will be executed if the specified condition returns a truthy value
     * @param {data-query} [alternate] - The query that will be executed if the specified condition returns a falsy value
     *
     * @example {html}
     * <div data-query="if(true, setClass('success'), setClass('fail'))"></div>
     * <div data-query="if(false, setClass('success'), setClass('fail'))"></div>
     *
     * <!-- will result in -->
     * <div data-query="if(true, setClass('success'), setClass('fail'))" class="success"></div>
     * <div data-query="if(false, setClass('success'), setClass('fail'))" class="fail"></div>
     */
    'if': {},

    /**
     * Executes particular query depending on the condition specified.
     * The opposite query of the 'if'
     *
     * @memberof blocks.queries
     * @param {boolean} condition - The result will determine if the consequent or the alternate query will be executed
     * @param {data-query} consequent - The query that will be executed if the specified condition returns a falsy value
     * @param {data-query} [alternate] - The query that will be executed if the specified condition returns a truthy value
     *
     * @example {html}
     * <div data-query="ifnot(true, setClass('success'), setClass('fail'))"></div>
     * <div data-query="ifnot(false, setClass('success'), setClass('fail'))"></div>
     *
     * <!-- will result in -->
     * <div data-query="ifnot(true, setClass('success'), setClass('fail'))" class="fail"></div>
     * <div data-query="ifnot(false, setClass('success'), setClass('fail'))" class="success"></div>
     */
    ifnot: {},

    /**
     * Queries and sets the inner html of the element from the template specified
     *
     * @memberof blocks.queries
     * @param {(HTMLElement|string)} template - The template that will be rendered
     * The value could be an element id (the element innerHTML property will be taken), string (the template) or
     * an element (again the element innerHTML property will be taken)
     * @param {*} [value] - Optional context for the template
     *
     * @example {html}
     * <script>
     *   blocks.query({
     *     name: 'John Doe',
     *     age: 22
     *   });
     * </script>
     * <script id="user" type="blocks-template">
     *   <h3>{{name}}</h3>
     *   <p>I am {{age}} years old.</p>
     * </script>
     * <div data-query="template('user')">
     * </div>
     *
     * <!-- will result in -->
     * <div data-query="template('user')">
     *   <h3>John Doe</h3>
     *   <p>I am 22 years old.</p>
     * </div>
     */
    template: {
      passDomQuery: true,
      passRawValues: true,

      preprocess: function (domQuery, template, value) {
        var serverData = domQuery._serverData;
        var html;

        template = blocks.$unwrap(template);
        if (blocks.isElement(template)) {
          html = template.innerHTML;
        } else {
          html = document.getElementById(template);
          if (html) {
            html = html.innerHTML;
          } else {
            html = template;
          }
        }
        if (html) {
          if (value) {
            blocks.queries['with'].preprocess.call(this, domQuery, value, '$template');
          }
          if (!serverData || !serverData.templates || !serverData.templates[ElementsData.id(this)]) {
            if (!this._el) {
              var element = document.createElement('div');
              element.innerHTML = html;
              this._children = createVirtual(element.childNodes[0], this);
              this._innerHTML = null;
            } else {
              this.html(html);
              if (!this._each) {
                this._children = createVirtual(this._el.childNodes[0], this);
                this._innerHTML = null;
              }
            }
          }
        }
      }
    },

    /**
     * Creates a variable name that could be used in child elements
     *
     * @memberof blocks.queries
     * @param {string} propertyName - The name of the value that will be
     * created and you could access its value later using that name
     * @param {*} propertyValue - The value that the property will have
     *
     * @example {html}
     * <script>
     *   blocks.query({
     *     strings: {
     *       title: {
     *         text: 'Hello World!'
     *       }
     *     }
     *   });
     * </script>
     * <div data-query="define('$title', strings.title.text)">
     *   The title is {{$title}}.
     * </div>
     *
     * <!-- will result in -->
     * <div data-query="define('$title', strings.title.text)">
     *   The title is Hello World!.
     * </div>
     */
    define: {
      passDomQuery: true,

      preprocess: function (domQuery, propertyName, propertyValue) {
        if (this._renderMode != VirtualElement.RenderMode.None) {
          var currentContext = domQuery.context();
          var newContext = domQuery.cloneContext(currentContext);
          var renderEndTag = this.renderEndTag;

          ElementsData.data(this).context = newContext;
          domQuery.context(newContext);
          domQuery.addProperty(propertyName, propertyValue);

          this.renderEndTag = function () {
            domQuery.context(currentContext);
            return renderEndTag.call(this);
          };
        }
      }
    },

    /**
     * Changes the current context for the child elements.
     * Useful when you will work a lot with a particular value
     *
     * @memberof blocks.queries
     * @param {*} value - The new context
     * @param {string} [name] - Optional name of the new context
     * This way the context will also available under the name not only under the $this context property
     *
     * @example {html}
     * <script>
     *   blocks.query({
     *     ProfilePage: {
     *       user: {
     *         name: 'John Doe',
     *         age: 22
     *       }
     *     }
     *   });
     * </script>
     * <div data-query="with(ProfilePage.user, '$user')">
     *  My name is {{$user.name}} and I am {{$this.age}} years old.
     * </div>
     *
     * <!-- will result in -->
     * <div data-query="with(ProfilePage.user, '$user')">
     *  My name is John Doe and I am 22 years old.
     * </div>
     */
    'with': {
      passDomQuery: true,
      passRawValues: true,

      preprocess: function (domQuery, value, name) {
        if (this._renderMode != VirtualElement.RenderMode.None) {
          var renderEndTag = this.renderEndTag;

          if (name) {
            domQuery.addProperty(name, value);
          }
          domQuery.pushContext(value);

          this.renderEndTag = function () {
            domQuery.popContext();
            return renderEndTag.call(this);
          };
        }
      }
    },

    /**
     * The each method iterates through an array items or object values
     * and repeats the child elements by using them as a template
     *
     * @memberof blocks.queries
     * @param {Array|Object} collection - The collection to iterate over
     *
     * @example {html}
     * <script>
     *   blocks.query({
     *     items: ['John', 'Doe']
     *   });
     * </script>
     * <ul data-query="each(items)">
     *   <li>{{$this}}</li>
     * </ul>
     *
     * <!-- will result in -->
     * <ul data-query="each(items)">
     *   <li>John</li>
     *   <li>Doe</li>
     * </ul>
     */
    each: {
      passDomQuery: true,

      passRawValues: true,

      supportsComments: true,

      _getStaticHtml: function (domQuery, element) {
        var children = element._children;
        var headers = element._headers;
        var footers = element._footers;
        var index = -1;
        var headerHtml = '';
        var footerHtml = '';
        var length;
        var dataRole;
        var child;

        if (headers) {
          length = Math.max(headers.length, footers.length);

          while (++index < length) {
            if (headers[index]) {
              headerHtml += headers[index].render(domQuery);
            }
            if (footers[index]) {
              footerHtml += footers[index].render(domQuery);
            }
          }
        } else {
          headers = element._headers = [];
          footers = element._footers = [];

          while (++index < children.length) {
            child = children[index];
            if (child.isExpression) {
              continue;
            }
            if (typeof child == 'string') {
              if (child.replace(trimRegExp, '').replace(/(\r\n|\n|\r)/gm, '') === '') {
                children.splice(index--, 1);
              }
              continue;
            }
            child._each = true;
            dataRole = child._attributes['data-role'];
            if (dataRole == 'header') {
              headerHtml += child.render(domQuery);
              headers.push(child);
              children.splice(index--, 1);
            } else if (dataRole == 'footer') {
              footerHtml += child.render(domQuery);
              footers.push(child);
              children.splice(index--, 1);
            }
          }
        }

        return {
          header: headerHtml,
          headersCount: headers.length,
          footer: footerHtml,
          footersCount: footers.length
        };
      },

      preprocess: function (domQuery, collection) {
        var syncIndex = domQuery.getSyncIndex();
        var element = this;
        var index = 0;
        var rawCollection;
        var elementData;
        var staticHtml;
        var childs;
        var html;

        if (this._sync) {
          element.updateChildren(collection, collection.length, domQuery, this._el);
          return;
        }

        this._template = this._template || this._children;

        this._childrenEach = true;

        if (domQuery._serverData) {
          elementData = domQuery._serverData[ElementsData.id(this)];
          domQuery._serverData[ElementsData.id(this)] = undefined;
          if (elementData) {
            var div = document.createElement('div');
            div.innerHTML = elementData;
            element._template = element._children = createVirtual(div.childNodes[0], element);
          }
        }

        staticHtml = queries.each._getStaticHtml(domQuery, element);
        html = staticHtml.header;

        if (blocks.isObservable(collection)) {
          elementData = ElementsData.data(element);
          elementData.eachData = {
            id: collection.__id__,
            element: element,
            startOffset: staticHtml.headersCount,
            endOffset: staticHtml.footersCount
          };
        }

        rawCollection = blocks.unwrapObservable(collection);

        childs = domQuery._context.childs = [];

        if (blocks.isArray(rawCollection)) {
          for (index = 0; index < rawCollection.length; index++) {
            domQuery.dataIndex(blocks.observable.getIndex(collection, index));
            childs.push(domQuery.pushContext(rawCollection[index]));
            html += this.renderChildren(domQuery, syncIndex + index);
            domQuery.popContext();
            domQuery.dataIndex(undefined);
          }
        } else if (blocks.isObject(rawCollection)) {
          for (var key in rawCollection) {
            domQuery.dataIndex(blocks.observable.getIndex(collection, index));
            domQuery.pushContext(rawCollection[key]);
            html += element.renderChildren(domQuery);
            domQuery.popContext();
            domQuery.dataIndex(undefined);
            index++;
          }
        }

        this.html(html + staticHtml.footer);
      }

      // update: function () {
      //
      // }
    },

    /**
     * Render options for a <select> element by providing an collection.
     *
     * @memberof blocks.queries
     * @param {(Array|Object)} collection - The collection to iterate over
     * @param {Object} [options] - Options to customize the behavior for creating each option.
     * options.value - determines the field in the collection to server for the option value
     * options.text - determines the field in the collection to server for the option text
     * options.caption - creates a option with the specified text at the first option
     *
     * @example {html}
     * <script>
     * blocks.query({
     *   caption: 'Select user'
     *   data: [
     *     { name: 'John', id: 1 },
     *     { name: 'Doe', id: 2 }
     *   ]
     * });
     * </script>
     * <select data-query="options(data, { text: 'name', value: 'id', caption: caption })">
     * </select>
     *
     * <!-- will result in -->
     * <select data-query="options(data, { text: 'name', value: 'id', caption: caption })">
     *   <option>Select user</option>
     *   <option value="1">John</option>
     *   <option value="2">Doe</option>
     * </select>
     */
    options: {
      passDomQuery: true,

      passRawValues: true,

      preprocess: function (domQuery, collection, options) {
        options = options || {};
        var $thisStr = '$this';
        var text = Expression.Create('{{' + (options.text || $thisStr) + '}}');
        var value = Expression.Create('{{' + (options.value || $thisStr) + '}}', 'value');
        var caption = blocks.isString(options.caption) && new VirtualElement('option');
        var option = new VirtualElement('option');
        var children = this._children;
        var i = 0;
        var child;

        for (; i < children.length; i++) {
          child = children[i];
          if (!child._attributes || (child._attributes && !child._attributes['data-role'])) {
            children.splice(i--, 1);
          }
        }

        option._attributeExpressions.push(value);
        option._children.push(text);
        option._parent = this;
        this._children.push(option);

        if (caption) {
          caption._attributes['data-role'] = 'header';
          caption._innerHTML = options.caption;
          this.addChild(caption);
        }

        blocks.queries.each.preprocess.call(this, domQuery, collection);
      }
    },

    /**
    * The render query allows elements to be skipped from rendering and not to exist in the HTML result
    *
    * @memberof blocks.queries
    * @param {boolean} condition - The value determines if the element will be rendered or not
    * @param {boolean} [renderChildren=false] - The value indicates if the children will be rendered
    *
    * @example {html}
    * <div data-query="render(true)">Visible</div>
    * <div data-query="render(false)">Invisible</div>
    *
    * <!-- html result will be -->
    * <div data-query="render(true)">Visible</div>
    */
    render: {
      passDetailValues: true,

      preprocess: function (condition) {
        if (!this._each && !this._sync) {
          throw new Error('render() is supported only() in each context');
        }

        this._renderMode = condition.value ? VirtualElement.RenderMode.All : VirtualElement.RenderMode.None;

        if (condition.containsObservable && this._renderMode == VirtualElement.RenderMode.None) {
          this._renderMode = VirtualElement.RenderMode.ElementOnly;
          this.css('display', 'none');
          ElementsData.data(this, 'renderCache', this);
        }
      },

      update: function (condition) {
        var elementData = ElementsData.data(this);
        if (elementData.renderCache && condition.value) {
          // TODO: Should use the logic from dom.html method
          this.innerHTML = elementData.renderCache.renderChildren(blocks.domQuery(this));
          blocks.domQuery(this).createElementObservableDependencies(this.childNodes);
          elementData.renderCache = null;
        }

        this.style.display = condition.value ? '' : 'none';
      }
    },

    /**
     * Determines when an observable value will be synced from the DOM.
     * Only applicable when using the 'val' data-query.
     *
     * @param {string} eventName - the name of the event. Possible values are:
     * 'input'(default)
     * 'keydown' -
     * 'change' -
     * 'keyup' -
     * 'keypress' -
     */
    updateOn: {
      preprocess: function (eventName) {
        ElementsData.data(this).updateOn = eventName;
      }
    },

    /**
     * Could be used for custom JavaScript animation by providing a callback function
     * that will be called the an animation needs to be performed
     *
     * @memberof blocks.queries
     * @param {Function} callback - The function that will be called when animation needs
     * to be performed.
     *
     * @example {html}
     * <script>
     * blocks.query({
     *   visible: blocks.observable(true),
     *   toggleVisibility: function () {
     *     // this points to the model object passed to blocks.query() method
     *     this.visible(!this.visible());
     *   },
     *
     *   fade: function (element, ready) {
     *     Velocity(element, {
     *       // this points to the model object passed to blocks.query() method
     *       opacity: this.visible() ? 1 : 0
     *     }, {
     *       duration: 1000,
     *       queue: false,
     *
     *       // setting the ready callback to the complete callback
     *       complete: ready
     *     });
     *   }
     * });
     * </script>
     * <button data-query="click(toggleVisibility)">Toggle visibility</button>
     * <div data-query="visible(visible).animate(fade)" style="background: red;width: 300px;height: 240px;">
     * </div>
     */
    animate: {
      preprocess: function (callback) {
        ElementsData.data(this).animateCallback = callback;
      }
    },

    /**
    * Adds or removes a class from an element
    *
    * @memberof blocks.queries
    * @param {string|Array} className - The class string (or array of strings) that will be added or removed from the element.
    * @param {boolean|undefined} [condition=true] - Optional value indicating if the class name will be added or removed. true - add, false - remove.
    *
    * @example {html}
    * <div data-query="setClass('header')"></div>
    *
    * <!-- will result in -->
    * <div data-query="setClass('header')" class="header"></div>
    */
    setClass: {
      preprocess: function (className, condition) {
        if (arguments.length > 1) {
          this.toggleClass(className, !!condition);
        } else {
          this.addClass(className);
        }
      },

      update: function (className, condition) {
        var virtual = ElementsData.data(this).virtual;
        if (virtual._each) {
          virtual = VirtualElement();
          virtual._el = this;
        }
        if (arguments.length > 1) {
          virtual.toggleClass(className, condition);
        } else {
          virtual.addClass(className);
        }
      }
    },

    /**
    * Sets the inner html to the element
    *
    * @memberof blocks.queries
    * @param {string} html - The html that will be places inside element replacing any other content.
    * @param {boolean} [condition=true] - Condition indicating if the html will be set.
    *
    * @example {html}
    * <div data-query="html('<b>some content</b>')"></div>
    *
    * <!-- will result in -->
    * <div data-query="html('<b>some content</b>')"><b>some content</b></div>
    */
    html: {
      call: true
    },

    /**
    * Adds or removes the inner text from an element. Escapes any HTML provided
    *
    * @memberof blocks.queries
    * @param {string} text - The text that will be places inside element replacing any other content.
    * @param {boolean} [condition=true] - Value indicating if the text will be added or cleared. true - add, false - clear.
    *
    * @example {html}
    * <div data-query="html('some content')"></div>
    *
    * <!-- will result in -->
    * <div data-query="html('some content')">some content</div>
    */
    text: {
      call: true
    },

    /**
    * Determines if an html element will be visible. Sets the CSS display property.
    *
    * @memberof blocks.queries
    * @param {boolean} [condition=true] Value indicating if element will be visible or not.
    *
    * @example {html}
    * <div data-query="visible(true)">Visible</div>
    * <div data-query="visible(false)">Invisible</div>
    *
    * <!-- html result will be -->
    * <div data-query="visible(true)">Visible</div>
    * <div data-query="visible(false)" style="display: none;">Invisible</div>
    */
    visible: {
      call: 'css',

      prefix: 'display'
    },

    /**
    * Gets, sets or removes an element attribute.
    * Passing only the first parameter will return the attributeName value
    *
    * @memberof blocks.queries
    * @param {string} attributeName - The attribute name that will be get, set or removed.
    * @param {string} attributeValue - The value of the attribute. It will be set if condition is true.
    *
    * @example {html}
    * <div data-query="attr('data-content', 'some content')"></div>
    *
    * <!-- will result in -->
    * <div data-query="attr('data-content', 'some content')" data-content="some content"></div>
    */
    attr: {
      passRawValues: true,

      call: true
    },

    /**
    * Sets the value attribute on an element.
    *
    * @memberof blocks.queries
    * @param {(string|number|Array|undefined)} value - The new value for the element.
    *
    * @example {html}
    * <script>
    * blocks.query({
    *   name: blocks.observable('John Doe')
    * });
    * </script>
    * <input data-query="val(name)" />
    *
    * <!-- will result in -->
    * <input data-query="val(name)" value="John Doe" />
    */
    val: {
      passRawValues: true,

      call: 'attr',

      prefix: 'value'
    },

    /**
    * Sets the checked attribute on an element
    *
    * @memberof blocks.queries
    * @param {boolean|undefined} [condition=true] - Determines if the element will be checked or not
    *
    * @example {html}
    * <input type="checkbox" data-query="checked(true)" />
    * <input type="checkbox" data-query="checked(false)" />
    *
    * <!-- will result in -->
    * <input type="checkbox" data-query="checked(true)" checked="checked" />
    * <input type="checkbox" data-query="checked(false)" />
    */
    checked: {
      passRawValues: true,

      call: 'attr'
    },

    /**
    * Sets the disabled attribute on an element
    *
    * @memberof blocks.queries
    * @param {boolean|undefined} [condition=true] - Determines if the element will be disabled or not
    */
    disabled: {
      passRawValues: true,

      call: 'attr'
    },

    /**
      * Gets, sets or removes a CSS style from an element.
      * Passing only the first parameter will return the CSS propertyName value.
      *
      * @memberof blocks.queries
      * @param {string} name - The name of the CSS property that will be get, set or removed
      * @param {string} value - The value of the of the attribute. It will be set if condition is true
      *
      * @example {html}
      * <script>
      *   blocks.query({
      *     h1FontSize: 12
      *   });
      * </script>
      * <h1 data-query="css('font-size', h1FontSize)"></h1>
      * <h1 data-query="css('fontSize', h1FontSize)"></h1>
      *
      * <!-- will result in -->
      * <h1 data-query="css('font-size', h1FontSize)" style="font-size: 12px;"></h1>
      * <h1 data-query="css('fontSize', h1FontSize)" style="font-size: 12px;"></h1>
      */
    css: {
      call: true
    },

    /**
      * Sets the width of the element
      *
      * @memberof blocks.queries
      * @param {(number|string)} value - The new width of the element
      */
    width: {
      call: 'css'
    },

    /**
      * Sets the height of the element
      *
      * @memberof blocks.queries
      * @param {number|string} value - The new height of the element
      */
    height: {
      call: 'css'
    },

    focused: {
      preprocess: blocks.noop,

      update: function (value) {
        if (value) {
          this.focus();
        }
      }
    },

    /**
     * Subscribes to an event
     *
     * @memberof blocks.queries
     * @param {(String|Array)} events - The event or events to subscribe to
     * @param {Function} callback - The callback that will be executed when the event is fired
     * @param {*} [args] - Optional arguments that will be passed as second parameter to
     * the callback function after the event arguments
     */
    on: {
      ready: function (events, callbacks, args) {
        if (!events || !callbacks) {
          return;
        }
        var element = this;
        var context = blocks.context(this);
        var thisArg;

        callbacks = blocks.toArray(callbacks);

        var handler = function (e) {
          context = blocks.context(this) || context;
          thisArg = context.$template || context.$view || context.$root;
          blocks.each(callbacks, function (callback) {
            callback.call(thisArg, e, args);
          });
        };

        events = blocks.isArray(events) ? events : events.toString().split(' ');

        blocks.each(events, function (event) {
          addListener(element, event, handler);
        });
      }
    }
  });

  blocks.each([
    // Mouse
    'click', 'dblclick', 'mousedown', 'mouseup', 'mouseover', 'mousemove', 'mouseout',
    // HTML form
    'select', 'change', 'submit', 'reset', 'focus', 'blur',
    // Keyboard
    'keydown', 'keypress', 'keyup'
  ], function (eventName) {
    blocks.queries[eventName] = {
      passRawValues: true,

      ready: function (callback, data) {
        blocks.queries.on.ready.call(this, eventName, callback, data);
      }
    };
  });

    var OBSERVABLE = '__blocks.observable__';


  function ChunkManager(observable) {
    this.observable = observable;
    this.chunkLengths = {};
    this.dispose();
  }

  ChunkManager.prototype = {
    dispose: function () {
      this.childNodesCount = undefined;
      this.startIndex = 0;
      this.observableLength = undefined;
      this.startOffset = 0;
      this.endOffset = 0;
    },

    setStartIndex: function (index) {
      this.startIndex = index + this.startOffset;
    },

    setChildNodesCount: function (count) {
      if (this.childNodesCount === undefined) {
        this.observableLength = this.observable.__value__.length;
      }
      this.childNodesCount = count - (this.startOffset + this.endOffset);
    },

    chunkLength: function (wrapper) {
      var chunkLengths = this.chunkLengths;
      var id = ElementsData.id(wrapper);
      var length = chunkLengths[id] || (this.childNodesCount || wrapper.childNodes.length) / (this.observableLength || this.observable.__value__.length);
      var result;

      if (blocks.isNaN(length) || length === Infinity) {
        result = 0;
      } else {
        result = Math.round(length);
      }

      chunkLengths[id] = result;

      return result;
    },

    getAt: function (wrapper, index) {
      var chunkLength = this.chunkLength(wrapper);
      var childNodes = wrapper.childNodes;
      var result = [];

      for (var i = 0; i < chunkLength; i++) {
        result[i] = childNodes[index * chunkLength + i + this.startIndex];
      }
      return result;
    },

    insertAt: function (wrapper, index, chunk) {
      animation.insert(
        wrapper,
        this.chunkLength(wrapper) * index + this.startIndex,
        blocks.isArray(chunk) ? chunk : [chunk]);
    },

    remove: function (index, howMany) {
      var _this = this;

      this.each(function (domElement) {
        blocks.context(domElement).childs.splice(index, howMany);

        for (var j = 0; j < howMany; j++) {
          _this._removeAt(domElement, index);
        }
      });

      ElementsData.collectGarbage();

      this.dispose();

      this.observable._indexes.splice(index, howMany);
    },

    add: function (addItems, index) {
      var _this = this;
      var observable = this.observable;

      blocks.each(addItems, function (item, i) {
        observable._indexes.splice(index + i, 0, blocks.observable(index + i));
      });

      this.each(function (domElement, virtualElement) {
        var domQuery = blocks.domQuery(domElement);
        var context = blocks.context(domElement);
        var html = '';
        var syncIndex;

        domQuery.contextBubble(context, function () {
          syncIndex = domQuery.getSyncIndex();
          for (var i = 0; i < addItems.length; i++) {
            domQuery.dataIndex(blocks.observable.getIndex(observable, i + index, true));
            context.childs.splice(i + index, 0, domQuery.pushContext(addItems[i]));
            html += virtualElement.renderChildren(domQuery, syncIndex + (i + index));
            domQuery.popContext();
            domQuery.dataIndex(undefined);
          }
        });

        if (domElement.childNodes.length === 0) {
          dom.html(domElement, html);
          domQuery.createElementObservableDependencies(domElement.childNodes);
        } else {
          var fragment = domQuery.createFragment(html);
          _this.insertAt(domElement, index, fragment);
        }
      });

      this.dispose();
    },

    each: function (callback) {
      var i = 0;
      var domElements = this.observable._elements;

      for (; i < domElements.length; i++) {
        var data = domElements[i];
        if (!data.element) {
          data.element = ElementsData.data(data.elementId).dom;
        }
        this.setup(data.element, callback);
      }
    },

    setup: function (domElement, callback) {
      if (!domElement) {
        return;
      }

      var eachData = ElementsData.data(domElement).eachData;
      var element;
      var commentId;
      var commentIndex;
      var commentElement;

      if (!eachData || eachData.id != this.observable.__id__) {
        return;
      }

      element = eachData.element;
      this.startOffset = eachData.startOffset;
      this.endOffset = eachData.endOffset;

      if (domElement.nodeType == 1) {
        // HTMLElement
        this.setStartIndex(0);
        this.setChildNodesCount(domElement.childNodes.length);
        callback(domElement, element, domElement);
      } else {
        // Comment
        commentId = ElementsData.id(domElement);
        commentElement = domElement.parentNode.firstChild;
        commentIndex = 0;
        while (commentElement != domElement) {
          commentElement = commentElement.nextSibling;
          commentIndex++;
        }
        this.setStartIndex(commentIndex + 1);
        while (commentElement && (commentElement.nodeType != 8 || commentElement.nodeValue.indexOf(commentId + ':/blocks') != 1)) {
          commentElement = commentElement.nextSibling;
          commentIndex++;
        }
        this.setChildNodesCount(commentIndex - this.startIndex);
        callback(domElement.parentNode, element, domElement);
      }
    },

    _removeAt: function (wrapper, index) {
      var chunkLength = this.chunkLength(wrapper);

      animation.remove(
        wrapper,
        chunkLength * index + this.startIndex,
        chunkLength);
    }
  };



  var observableId = 1;

  /**
  * @namespace blocks.observable
  * @param {*} initialValue -
  * @param {*} [context] -
  * @returns {blocks.observable}
  */
  blocks.observable = function (initialValue, thisArg) {
    var observable = function (value) {
      if (arguments.length === 0) {
        Events.trigger(observable, 'get', observable);
      }

      var currentValue = getObservableValue(observable);
      var update = observable.update;

      if (arguments.length === 0) {
        Observer.registerObservable(observable);
        return currentValue;
      } else if (!blocks.equals(value, currentValue, false) && Events.trigger(observable, 'changing', value, currentValue) !== false) {
        observable.update = blocks.noop;
        if (!observable._dependencyType) {
          if (blocks.isArray(currentValue) && blocks.isArray(value) && observable.reset) {
            observable.reset(value);
          } else {
            observable.__value__ = value;
          }
        } else if (observable._dependencyType == 2) {
          observable.__value__.set.call(observable.__context__, value);
        }

        observable.update = update;
        observable.update();

        Events.trigger(observable, 'change', value, currentValue);
      }
      return observable;
    };

    initialValue = blocks.unwrap(initialValue);

    blocks.extend(observable, blocks.observable.fn.base);
    observable.__id__ = observableId++;
    observable.__value__ = initialValue;
    observable.__context__ = thisArg || blocks.__viewInInitialize__ || observable;
    observable._expressionKeys = {};
    observable._expressions = [];
    observable._elementKeys = {};
    observable._elements = [];

    if (blocks.isArray(initialValue)) {
      blocks.extend(observable, blocks.observable.fn.array);
      observable._indexes = [];
      observable._chunkManager = new ChunkManager(observable);
    } else if (blocks.isFunction(initialValue)) {
      observable._dependencyType = 1; // Function dependecy
    } else if (initialValue && !initialValue.__Class__ && blocks.isFunction(initialValue.get) && blocks.isFunction(initialValue.set)) {
      observable._dependencyType = 2; // Custom object
    }

    updateDependencies(observable);

    return observable;
  };

  function updateDependencies(observable) {
    if (observable._dependencyType) {
      observable._getDependency = blocks.bind(getDependency, observable);
      observable.on('get', observable._getDependency);
    }
  }

  function getDependency() {
    var observable = this;
    var value = observable.__value__;
    var accessor = observable._dependencyType == 1 ? value : value.get;

    Events.off(observable, 'get', observable._getDependency);
    observable._getDependency = undefined;

    Observer.startObserving();
    accessor.call(observable.__context__);
    blocks.each(Observer.stopObserving(), function (dependency) {
      var dependencies = (dependency._dependencies = dependency._dependencies || []);
      var exists = false;
      blocks.each(dependencies, function (value) {
        if (observable === value) {
          exists = true;
          return false;
        }
      });
      if (!exists) {
        dependencies.push(observable);
      }
    });
  }

  function getObservableValue(observable) {
    var context = observable.__context__;
    return observable._dependencyType == 1 ? observable.__value__.call(context)
      : observable._dependencyType == 2 ? observable.__value__.get.call(context)
      : observable.__value__;
  }

  var observableIndexes = {};

  blocks.extend(blocks.observable, {
    getIndex: function (observable, index, forceGet) {
      if (!blocks.isObservable(observable)) {
        if (!observableIndexes[index]) {
          observableIndexes[index] = blocks.observable(index);
        }
        return observableIndexes[index];
      }
      var indexes = observable._indexes;
      var $index;

      if (indexes) {
        if (indexes.length == observable.__value__.length || forceGet) {
          $index = indexes[index];
        } else {
          $index = blocks.observable(index);
          indexes.splice(index, 0, $index);
        }
      } else {
        $index = blocks.observable(index);
      }

      return $index;
    },

    fn: {
      base: {
        __identity__: OBSERVABLE,

        /**
         * Updates all elements, expressions and dependencies where the observable is used
         *
         * @memberof blocks.observable
         * @returns {blocks.observable} Returns the observable itself - return this;
         */
        update: function () {
          var elements = this._elements;
          var elementData;
          var domQuery;
          var context;
          var element;
          var offset;
          var value;
          var isProperty;
          var propertyName;

          blocks.eachRight(this._expressions, function updateExpression(expression) {
            element = expression.element;
            context = expression.context;

            if (!element) {
              elementData = ElementsData.data(expression.elementId);
              element = expression.element = elementData.dom;
            }

            try {
              value = blocks.unwrap(parameterQueryCache[expression.expression](context));
            } catch (ex) {
              value = '';
            }

            value = value == null ? '' : value.toString();

            offset = expression.length - value.length;
            expression.length = value.length;

            isProperty = dom.props[expression.attr];
            propertyName = expression.attr ? dom.propFix[expression.attr.toLowerCase()] || expression.attr : null;

            if (element) {
              if (expression.attr) {
                if(isProperty) {
                  element[propertyName] = Expression.GetValue(context, null, expression.entire);
                } else {
                  element.setAttribute(expression.attr, Expression.GetValue(context, null, expression.entire));
                }
              } else {
                if (element.nextSibling) {
                  element = element.nextSibling;
                  element.nodeValue = value + element.nodeValue.substring(expression.length + offset);
                } else {
                  element.parentNode.appendChild(document.createTextNode(value));
                }
              }
            } else {
             element = elementData.virtual;
             if (expression.attr) {
               element.attr(expression.attr, Expression.GetValue(context, null, expression.entire));
             }
            }
          });

          for (var i = 0; i < elements.length; i++) {
            value = elements[i];
            element = value.element;
            if (!element && ElementsData.data(value.elementId)) {
              element = value.element = ElementsData.data(value.elementId).dom;
              if (!element) {
                element = ElementsData.data(value.elementId).virtual;
              }
            }
            if (VirtualElement.Is(element) || document.body.contains(element)) {
              domQuery = blocks.domQuery(element);
              domQuery.contextBubble(value.context, function () {
                domQuery.executeMethods(element, value.cache);
              });
            } else {
              elements.splice(i, 1);
              i -= 1;
            }
          }

          blocks.each(this._dependencies, function updateDependency(dependency) {
            updateDependencies(dependency);
            dependency.update();
          });

          blocks.each(this._indexes, function updateIndex(observable, index) {
            observable(index);
          });

          return this;
        },


        on: function (eventName, callback, thisArg) {
          Events.on(this, eventName, callback, thisArg || this.__context__);
          return this;
        },

        once: function (eventName, callback, thisArg) {
          Events.once(this, eventName, callback, thisArg || this.__context__);
          return this;
        },

        off: function (eventName, callback) {
          Events.off(this, eventName, callback);
          return this;
        },

        /**
         * Extends the current observable with particular functionality depending on the parameters
         * specified. If the method is called without arguments and jsvalue framework is included
         * the observable will be extended with the methods available in jsvalue for the current type
         *
         * @memberof blocks.observable
         * @param {String} [name] -
         * @param {...*} [options]
         * @returns {*} - The result of the extend or the observable itself
         *
         * @example {javascript}
         * blocks.observable.formatter = function () {
         *   // your code here
         * };
         *
         * // extending using the formatter extender
         * var data = blocks.observable([1, 2, 3]).extend('formatter');
         *
         */
        extend: function (name /*, options*/) {
          var extendFunc = blocks.observable[name];
          var result;

          if (arguments.length === 0) {
            if (blocks.core.expressionsCreated) {
              blocks.core.applyExpressions(blocks.type(this()), this);
            }
            return this;
          } else if (extendFunc) {
            result = extendFunc.apply(this, blocks.toArray(arguments).slice(1));
            return blocks.isObservable(result) ? result : this;
          }
        },

        clone: function (cloneValue) {
          var value = this.__value__;
          return blocks.observable(cloneValue ? blocks.clone(value) : value, this.__context__);
        },

        toString: function () {
          var context = this.__context__;
          var value = this._dependencyType == 1 ? this.__value__.call(context)
            : this._dependencyType == 2 ? this.__value__.get.call(context)
            : this.__value__;

          Observer.registerObservable(this);

          if (value != null && blocks.isFunction(value.toString)) {
            return value.toString();
          }
          return String(value);
        }
      },

      /**
       * @memberof blocks.observable
       * @class array
       */
      array: {

        /**
         * Removes all items from the collection and replaces them with the new value provided.
         * The value could be Array, observable array or jsvalue.Array
         *
         * @memberof array
         * @param {Array} value - The new value that will be populated
         * @returns {blocks.observable} - Returns the observable itself - return this;
         *
         * @example {javascript}
         * // creates an observable array with [1, 2, 3] as values
         * var items = blocks.observable([1, 2, 3]);
         *
         * // removes the previous values and fills the observable array with [5, 6, 7] values
         * items.reset([5, 6, 7]);
         */
        reset: function (array) {
          if (arguments.length === 0) {
            this.removeAll();
            return this;
          }

          array = blocks.unwrap(array);

          var current = this.__value__;
          var chunkManager = this._chunkManager;
          var addCount = Math.max(array.length - current.length, 0);
          var removeCount = Math.max(current.length - array.length, 0);
          var updateCount = array.length - addCount;

          Events.trigger(this, 'removing', {
            type: 'removing',
            items: current,
            index: 0
          });

          Events.trigger(this, 'adding', {
            type: 'adding',
            items: array,
            index: 0
          });

          chunkManager.each(function (domElement, virtualElement) {
            var domQuery = blocks.domQuery(domElement);

            domQuery.contextBubble(blocks.context(domElement), function () {
                virtualElement.updateChildren(array, updateCount, domQuery, domElement);
            });
          });

          if (addCount > 0) {
            chunkManager.add(array.slice(current.length), current.length);
          } else if (removeCount > 0) {
            chunkManager.remove(array.length, removeCount);
          }

          this.__value__ = array;

          Events.trigger(this, 'remove', {
            type: 'remove',
            items: current,
            index: 0
          });

          Events.trigger(this, 'add', {
            type: 'add',
            items: array,
            index: 0
          });

          return this;
        },

        /**
         * Adds values to the end of the observable array
         *
         * @memberof array
         * @param {*} value - The values that will be added to the end of the array
         * @param {number} [index] - Optional index specifying where to insert the value
         * @returns {blocks.observable} - Returns the observable itself - return this;
         *
         * @example {javascript}
         * var items = blocks.observable([1, 2, 3]);
         *
         * // results in observable array with [1, 2, 3, 4] values
         * items.add(4);
         *
         */
        add: function (value, index) {
          this.splice(blocks.isNumber(index) ? index : this.__value__.length, 0, value);

          return this;
        },

        /**
         * Adds the values from the provided array(s) to the end of the collection
         *
         * @memberof array
         * @param {Array} value - The array that will be added to the end of the array
         * @param {number} [index] - Optional position where the array of values to be inserted
         * @returns {blocks.observable} - Returns the observable itself - return this;
         *
         * @example {javascript}
         * var items = blocks.observable([1, 2, 3]);
         *
         * // results in observable array with [1, 2, 3, 4, 5, 6] values
         * items.addMany([4, 5], [6]);
         */
        addMany: function (value, index) {
          this.splice.apply(this, [blocks.isNumber(index) ? index : this.__value__.length, 0].concat(blocks.toArray(value)));
          return this;
        },

        /**
         * Swaps two values in the observable array.
         * Note: Faster than removing the items and adding them at the locations
         *
         * @memberof array
         * @param {number} indexA - The first index that points to the index in the array that will be swapped
         * @param {number} indexB - The second index that points to the index in the array that will be swapped
         * @returns {blocks.observable} - Returns the observable itself - return this;
         *
         * @example {javascript}
         * var items = blocks.observable([4, 2, 3, 1]);
         *
         * // results in observable array with [1, 2, 3, 4] values
         * items.swap(0, 3);
         */
        swap: function (indexA, indexB) {
          var array = this();
          var elements = this._elements;
          var chunkManager = this._chunkManager;
          var element;

          blocks.swap(array, indexA, indexB);

          for (var i = 0; i < elements.length; i++) {
            element = elements[i].element;
            if (indexA > indexB) {
              chunkManager.insertAt(element, indexA, chunkManager.getAt(element, indexB));
              chunkManager.insertAt(element, indexB, chunkManager.getAt(element, indexA));
            } else {
              chunkManager.insertAt(element, indexB, chunkManager.getAt(element, indexA));
              chunkManager.insertAt(element, indexA, chunkManager.getAt(element, indexB));
            }
          }

          return this;
        },

        /**
         * Moves an item from one location to another in the array.
         * Note: Faster than removing the item and adding it at the location
         *
         * @memberof array
         * @param {number} sourceIndex - The index pointing to the item that will be moved
         * @param {number} targetIndex - The index where the item will be moved to
         * @returns {blocks.observable} - Returns the observable itself - return this;
         *
         * @example {javascript}
         * var items = blocks.observable([1, 4, 2, 3, 5]);
         *
         * // results in observable array with [1, 2, 3, 4, 5] values
         * items.move(1, 4);
         */
        move: function (sourceIndex, targetIndex) {
          var array = this();
          var elements = this._elements;
          var chunkManager = this._chunkManager;
          var element;

          blocks.move(array, sourceIndex, targetIndex);

          if (targetIndex > sourceIndex) {
            targetIndex++;
          }

          for (var i = 0; i < elements.length; i++) {
            element = elements[i].element;
            chunkManager.insertAt(element, targetIndex, chunkManager.getAt(element, sourceIndex));
          }

          return this;
        },

        /**
         * Removes an item from the observable array
         *
         * @memberof array
         * @param {(Function|*)} value - the value that will be removed or a callback function
         * which returns true or false to determine if the value should be removed
         * @param {Function} [thisArg] - Optional this context for the callback
         * @returns {blocks.observable} - Returns the observable itself - return this;
         *
         * @example {javascript}
         *
         */
        remove: function (value, thisArg) {
          return this.removeAll(value, thisArg, true);
        },

        /**
         * Removes an item at the specified index
         *
         * @memberof array
         * @param {number} index - The index location of the item that will be removed
         * @param {number} [count] - Optional parameter that if specified will remove
         * the next items starting from the specified index
         * @returns {blocks.observable} - Returns the observable itself - return this;
         */
        removeAt: function (index, count) {
          if (!blocks.isNumber(count)) {
            count = 1;
          }
          this.splice(index, count);

          return this;
        },

        /**
         * Removes all items from the observable array and optionally filter which items
         * to be removed by providing a callback
         *
         * @memberof array
         * @param {Function} [callback] - Optional callback function which filters which items
         * to be removed. Returning a truthy value will remove the item and vice versa
         * @param {*} [thisArg] - Optional this context for the callback function
         * @returns {blocks.observable} - Returns the observable itself - return this;
         */
        removeAll: function (callback, thisArg, removeOne) {
          var array = this.__value__;
          var chunkManager = this._chunkManager;
          var items;
          var i;

          if (arguments.length === 0) {
            if (Events.has(this, 'removing') || Events.has(this, 'remove')) {
              items = blocks.clone(array);
            }
            Events.trigger(this, 'removing', {
              type: 'removing',
              items: items,
              index: 0
            });

            chunkManager.remove(0, array.length);

            //this._indexes.splice(0, array.length);
            this._indexes = [];
            items = array.splice(0, array.length);
            Events.trigger(this, 'remove', {
              type: 'remove',
              items: items,
              index: 0
            });
          } else {
            var isCallbackAFunction = blocks.isFunction(callback);
            var value;

            for (i = 0; i < array.length; i++) {
              value = array[i];
              if (value === callback || (isCallbackAFunction && callback.call(thisArg, value, i, array))) {
                this.splice(i, 1);
                i -= 1;
                if (removeOne) {
                  break;
                }
              }
            }
          }

          this.update();

          return this;
        },

        //#region Base

        /**
         * The concat() method is used to join two or more arrays
         *
         * @memberof array
         * @param {...Array} arrays - The arrays to be joined
         * @returns {Array} - The joined array
         */
        concat: function () {
          var array = this();
          return array.concat.apply(array, blocks.toArray(arguments));
        },

        //
        /**
         * The slice() method returns the selected elements in an array, as a new array object
         *
         * @memberof array
         * @param {number} start An integer that specifies where to start the selection (The first element has an index of 0)
         * @param {number} [end] An integer that specifies where to end the selection. If omitted, all elements from the start
         * position and to the end of the array will be selected. Use negative numbers to select from the end of an array
         * @returns {Array} A new array, containing the selected elements
         */
        slice: function (start, end) {
          if (arguments.length > 1) {
            return this().slice(start, end);
          }
          return this().slice(start);
        },

        /**
         * The join() method joins the elements of an array into a string, and returns the string
         *
         * @memberof array
         * @param {string} [seperator=','] The separator to be used. If omitted, the elements are separated with a comma
         * @returns {string} The array values, separated by the specified separator
         */
        join: function (seperator) {
          if (arguments.length > 0) {
            return this().join(seperator);
          }
          return this().join();
        },

        ///**
        // * The indexOf() method returns the position of the first occurrence of a specified value in a string.
        // * @param {*} item The item to search for.
        // * @param {number} [index=0] Where to start the search. Negative values will start at the given position counting from the end, and search to the end.
        // * @returns {number} The position of the specified item, otherwise -1
        // */
        //indexOf: function (item, index) {
        //    return blocks.indexOf(this(), item, index);
        //},


        ///**
        // * The lastIndexOf() method returns the position of the last occurrence of a specified value in a string.
        // * @param {*} item The item to search for.
        // * @param {number} [index=0] Where to start the search. Negative values will start at the given position counting from the end, and search to the beginning.
        // * @returns {number} The position of the specified item, otherwise -1.
        // */
        //lastIndexOf: function (item, index) {
        //    var array = this();
        //    if (arguments.length > 1) {
        //        return blocks.lastIndexOf(array, item, index);
        //    }
        //    return blocks.lastIndexOf(array, item);
        //},

        //#endregion

        /**
         * The pop() method removes the last element of a observable array, and returns that element
         *
         * @memberof array
         * @returns {*} The removed array item
         */
        pop: function () {
          var that = this;
          var array = that();

          return that.splice(array.length - 1, 1)[0];
        },

        /**
         * The push() method adds new items to the end of the observable array, and returns the new length
         *
         * @memberof array
         * @param {...*} values - The item(s) to add to the observable array
         * @returns {number} The new length of the observable array
         */
        push: function () {
          this.addMany(arguments);
          return this.__value__.length;
        },

        /**
         * Reverses the order of the elements in the observable array
         *
         * @memberof array
         * @returns {Array} The array after it has been reversed
         */
        reverse: function () {
          var array = this().reverse();
          var chunkManager = this._chunkManager;

          this._indexes.reverse();

          chunkManager.each(function (domElement) {
            for (var j = 1; j < array.length; j++) {
              chunkManager.insertAt(domElement, 0, chunkManager.getAt(domElement, j));
            }
          });

          this.update();

          return array;
        },

        /**
         * Removes the first element of a observable array, and returns that element
         *
         * @memberof array
         * @returns {*} The removed array item
         */
        shift: function () {
          return this.splice(0, 1)[0];
          //returns - The removed array item
        },

        /**
         * Sorts the elements of an array
         *
         * @memberof array
         * @param {Function} [sortfunction] - A function that defines the sort order
         * @returns {Array} - The Array object, with the items sorted
         */
        sort: function (sortfunction) {
          var array = this.__value__;
          var length = array.length;
          var useSortFunction = arguments.length > 0;
          var chunkManager = this._chunkManager;
          var indexes = this._indexes;
          var i = 0;
          var j;
          var item;

          for (; i < length; i++) {
            var result = [array[i], i];

            chunkManager.each(function (domElement) {
              result.push(chunkManager.getAt(domElement, i));
            });
            //if (!useSortFunction) { // TODO: Test performance
            //    result.toString = function () { return this[0]; }
            //}
            array[i] = result;
          }

          //if (useSortFunction) { // TODO: Test performance
          //    array.sort(function (a, b) {
          //        return sortfunction.call(this, a[0], b[0])
          //    });
          //}

          // TODO: Test performance (Comment)
          array.sort(function (a, b) {
            a = a[0];
            b = b[0];
            if (useSortFunction) {
              return sortfunction.call(this, a, b);
            }
            if (a < b) {
              return -1;
            }
            if (a > b) {
              return 1;
            }
            return 0;
          });

          if (indexes.length > 0) {
            this._indexes = [];
          }

          for (i = 0; i < length; i++) {
            item = array[i];
            if (indexes.length > 0) {
              this._indexes.push(indexes[item[1]]);
            }

            j = 2;
            chunkManager.each(function (domElement) {
              chunkManager.insertAt(domElement, length, item[j]);
              j++;
            });
            array[i] = item[0];
          }

          this.update();

          //chunkManager.dispose();

          return array;
        },

        /**
         * Adds and/or removes elements from the observable array
         *
         * @memberof array
         * @param {number} index An integer that specifies at what position to add/remove items.
         * Use negative values to specify the position from the end of the array.
         * @param {number} howMany The number of items to be removed. If set to 0, no items will be removed.
         * @param {...*} The new item(s) to be added to the array.
         * @returns {Array} A new array containing the removed items, if any.
         */
        splice: function (index, howMany) {
          var array = this.__value__;
          var chunkManager = this._chunkManager;
          var returnValue = [];
          var args = arguments;
          var addItems;

          index = index < 0 ? array.length - index : index;

          if (howMany && index < array.length && index >= 0) {
            howMany = Math.min(array.length - index, howMany);
            returnValue = array.slice(index, index + howMany);
            Events.trigger(this, 'removing', {
              type: 'removing',
              items: returnValue,
              index: index
            });

            chunkManager.remove(index, howMany);

            returnValue = array.splice(index, howMany);
            Events.trigger(this, 'remove', {
              type: 'remove',
              items: returnValue,
              index: index
            });
          }

          if (args.length > 2) {
            addItems = blocks.toArray(args);
            addItems.splice(0, 2);
            Events.trigger(this, 'adding', {
              type: 'adding',
              index: index,
              items: addItems
            });

            chunkManager.add(addItems, index);

            array.splice.apply(array, [index, 0].concat(addItems));
            Events.trigger(this, 'add', {
              type: 'add',
              index: index,
              items: addItems
            });
          }

          this.update();
          return returnValue;
        },

        /**
         * The unshift() method adds new items to the beginning of an array, and returns the new length.
         *
         * @memberof array
         * @this {blocks.observable}
         * @param {...*} The new items that will be added to the beginning of the observable array.
         * @returns {number} The new length of the observable array.
         */
        unshift: function () {
          this.addMany(arguments, 0);
          return this.__value__.length;
        }
      }
    }
  });


  var ExtenderHelper = {
    waiting: {},

    initExpressionExtender: function (observable) {
      var newObservable = observable.clone();

      newObservable.view = blocks.observable([]);
      newObservable.view._connections = {};
      newObservable.view._observed = [];
      newObservable.view._updateObservable = blocks.bind(ExtenderHelper.updateObservable, newObservable);
      newObservable._operations = observable._operations ? blocks.clone(observable._operations) : [];
      newObservable._getter = blocks.bind(ExtenderHelper.getter, newObservable);
      newObservable.view._initialized = false;

      newObservable.view.on('get', newObservable._getter);
      
      newObservable.on('add', function () {
        if (newObservable.view._initialized) {
          newObservable.view._connections = {};
          newObservable.view.reset();
          ExtenderHelper.executeOperations(newObservable);
        }
      });
  
      newObservable.on('remove', function () {
        if (newObservable.view._initialized) {
          newObservable.view._connections = {};
          newObservable.view.reset();
          ExtenderHelper.executeOperations(newObservable);
        }
      });

      return newObservable;
    },

    getter: function () {
      Events.off(this.view, 'get', this._getter);
      this._getter = undefined;
      this.view._initialized = true;
      ExtenderHelper.executeOperationsPure(this);
    },

    updateObservable: function () {
      ExtenderHelper.executeOperations(this);
    },

    executeOperationsPure: function (observable) {
      var chunk = [];
      var observed = observable.view._observed;
      var updateObservable = observable.view._updateObservable;

      blocks.each(observed, function (observable) {
        Events.off(observable, 'change', updateObservable);
      });
      observed = observable.view._observed = [];
      Observer.startObserving();

      blocks.each(observable._operations, function (operation) {
        if (operation.type == 'step') {
          var view = observable.view;
          observable.view = blocks.observable([]);
          observable.view._connections = {};
          if (chunk.length) {
            ExtenderHelper.executeOperationsChunk(observable, chunk);
          }
          operation.step.call(observable.__context__);
          observable.view = view;
        } else {
          chunk.push(operation);
        }
      });

      if (chunk.length) {
        ExtenderHelper.executeOperationsChunk(observable, chunk);
      }

      blocks.each(Observer.stopObserving(), function (observable) {
        observed.push(observable);
        observable.on('change', updateObservable);
      });
    },

    executeOperations: function (observable) {
      var id = observable.__id__;
      var waiting = ExtenderHelper.waiting;

      if (!waiting[id]) {
        waiting[id] = true;
        setTimeout(function () {
          ExtenderHelper.executeOperationsPure(observable);
          waiting[id] = false;
        }, 0);
      }
    },

    executeOperationsChunk: function (observable, operations) {
      var ADD = 'add';
      var REMOVE = 'remove';
      var EXISTS = 'exists';
      var action = EXISTS;

      var collection = observable.__value__;
      var view = observable.view;
      var connections = view._connections;
      var newConnections = {};
      var viewIndex = 0;
      var update = view.update;
      var skip = 0;
      var take = collection.length;
      view.update = blocks.noop;

      blocks.each(operations, function (operation) {
        if (operation.type == 'skip') {
          skip = operation.skip;
          if (blocks.isFunction(skip)) {
            skip = skip.call(observable.__context__);
          }
          skip = blocks.unwrap(skip);
        } else if (operation.type == 'take') {
          take = operation.take;
          if (blocks.isFunction(take)) {
            take = take.call(observable.__context__);
          }
          take = blocks.unwrap(take);
        } else if (operation.type == 'sort') {
          if (blocks.isString(operation.sort)) {
            collection = blocks.clone(collection).sort(function (valueA, valueB) {
              return valueA[operation.sort] - valueB[operation.sort];
            });
          } else if (blocks.isFunction(operation.sort)) {
            collection = blocks.clone(collection).sort(operation.sort);
          } else {
            collection = blocks.clone(collection).sort();
          }
          if (operations.length == 1) {
            operations.push({ type: 'filter', filter: function () { return true; }});
          }
        }
      });

      blocks.each(collection, function iterateCollection(value, index) {
        if (take <= 0) {
          while (view().length - viewIndex > 0) {
            view.removeAt(view().length - 1);
          }
          return false;
        }
        blocks.each(operations, function executeExtender(operation) {
          var filterCallback = operation.filter;

          action = undefined;

          if (filterCallback) {
            if (filterCallback.call(observable.__context__, value, index, collection)) {
              action = EXISTS;

              if (connections[index] === undefined) {
                action = ADD;
              }
            } else {
              action = undefined;
              if (connections[index] !== undefined) {
                action = REMOVE;
              }
              return false;
            }
          } else if (operation.type == 'skip') {
            action = EXISTS;
            skip -= 1;
            if (skip >= 0) {
              action = REMOVE;
              return false;
            } else if (skip < 0 && connections[index] === undefined) {
              action = ADD;
            }
          } else if (operation.type == 'take') {
            if (take <= 0) {
              action = REMOVE;
              return false;
            } else {
              take -= 1;
              action = EXISTS;

              if (connections[index] === undefined) {
                action = ADD;
              }
            }
          }
        });

        switch (action) {
          case ADD:
            newConnections[index] = viewIndex;
            view.splice(viewIndex, 0, value);
            viewIndex++;
            break;
          case REMOVE:
            view.removeAt(viewIndex);
            break;
          case EXISTS:
            newConnections[index] = viewIndex;
            viewIndex++;
            break;
        }
      });

      view._connections = newConnections;
      view.update = update;
      view.update();
    }
  };



  /**
   * @memberof blocks.observable
   * @class extenders
   */

  /**
   * Extends the observable by adding a .view property which is filtered
   * based on the provided options
   *
   * @memberof extenders
   * @param {(Function|Object|String)} options - provide a callback function
   * which returns true or false, you could also provide an observable
   * @returns {blocks.observable} - Returns a new observable
   * containing a .view property with the filtered data
   */
  blocks.observable.filter = function (options) {
    var observable = ExtenderHelper.initExpressionExtender(this);
    var callback = options;

    if (!blocks.isFunction(callback) || blocks.isObservable(callback)) {
      callback = function (value) {
        var filter = blocks.unwrap(options);
        var filterString = String(filter).toLowerCase();
        value = String(blocks.unwrap(value)).toLowerCase();

        return !filter || value.indexOf(filterString) != -1;
      };
    }

    observable._operations.push({
      type: 'filter',
      filter: callback
    });

    return observable;
  };

  blocks.observable.step = function (options) {
    var observable = ExtenderHelper.initExpressionExtender(this);

    observable._operations.push({
      type: 'step',
      step: options
    });

    return observable;
  };

  /**
   * Extends the observable by adding a .view property in which the first n
   * items are skipped
   *
   * @memberof extenders
   * @param {(number|blocks.observable)} value - The number of items to be skipped
   * @returns {blocks.observable} - Returns a new observable
   * containing a .view property with the manipulated data
   */
  blocks.observable.skip = function (value) {
    var observable = ExtenderHelper.initExpressionExtender(this);

    observable._operations.push({
      type: 'skip',
      skip: value
    });

    return observable;
  };

  /**
   * Extends the observable by adding a .view property in which there is
   * always maximum n items
   *
   * @memberof extenders
   * @param {(number|blocks.observable))} value - The max number of items to be in the collection
   * @returns {blocks.observable} - Returns a new observable
   * containing a .view property with the manipulated data
   */
  blocks.observable.take = function (value) {
    var observable = ExtenderHelper.initExpressionExtender(this);

    observable._operations.push({
      type: 'take',
      take: value
    });

    return observable;
  };

  /**
   * Extends the observable by adding a .view property which is sorted
   * based on the provided options
   *
   * @memberof extenders
   * @param {(Function|string)} options - provide a callback sort function or field name to be sorted
   * @returns {blocks.observable} - Returns a new observable
   * containing a .view property with the sorted data
   */
  blocks.observable.sort = function (options) {
    var observable = ExtenderHelper.initExpressionExtender(this);

    observable._operations.push({
      type: 'sort',
      sort: options
    });

    return observable;
  };


  /**
   * Performs a query operation on the DOM. Executes all data-query attributes
   * and renders the html result to the specified HTMLElement if not specified
   * uses document.body by default.
   *
   * @memberof blocks
   * @param {*} model - The model that will be used to query the DOM.
   * @param {HTMLElement} [element=document.body] - Optional element on which to execute the query.
   *
   * @example {html}
   * <script>
   *   blocks.query({
   *     message: 'Hello World!'
   *   });
   * </script>
   * <h1>Hey, {{message}}</h1>
   *
   * <!-- will result in -->
   * <h1>Hey, Hello World!</h1>
   */
  blocks.query = function query(model, element) {
    blocks.domReady(function () {
      blocks.$unwrap(element, function (element) {
        if (!blocks.isElement(element)) {
          element = document.body;
        }

        var domQuery = new DomQuery();
        var rootElement = createVirtual(element)[0];
        var serverData = window.__blocksServerData__;

        domQuery.pushContext(model);
        domQuery._serverData = serverData;

        if (serverData) {
          rootElement.render(domQuery);
        } else {
          rootElement.sync(domQuery);
        }
        domQuery.createElementObservableDependencies([element]);
      });
    });
  };

  blocks.executeQuery = function executeQuery(element, queryName /*, ...args */) {
    var methodName = VirtualElement.Is(element) ? 'preprocess' : 'update';
    var args = Array.prototype.slice.call(arguments, 2);
    var query = blocks.queries[queryName];
    if (query.passDomQuery) {
      args.unshift(blocks.domQuery(element));
    }
    query[methodName].apply(element, args);
  };

  /**
   * Gets the context for a particular element. Searches all parents until it finds the context.
   *
   * @memberof blocks
   * @param {(HTMLElement|blocks.VirtualElement)} element - The element from which to search for a context
   * @returns {Object} - The context object containing all context properties for the specified element
   *
   * @example {html}
   * <script>
   *   blocks.query({
   *     items: ['John', 'Alf', 'Mega'],
   *     alertIndex: function (e) {
   *       alert('Clicked an item with index:' + blocks.context(e.target).$index);
   *     }
   *   });
   * </script>
   * <ul data-query="each(items)">
   *   <li data-query="click(alertIndex)">{{$this}}</li>
   * </ul>
   */
  blocks.context = function context(element, isRecursive) {
    element = blocks.$unwrap(element);

    if (element) {
      var elementData = ElementsData.data(element);
      if (elementData) {
        if (isRecursive && elementData.childrenContext) {
          return elementData.childrenContext;
        }
        if (elementData.context) {
          return elementData.context;
        }
      }

      return blocks.context(VirtualElement.Is(element) ? element._parent : element.parentNode, true);
    }
    return null;
  };

  /**
   * Gets the associated dataItem for a particlar element. Searches all parents until it finds the context
   *
   * @memberof blocks
   * @param {(HTMLElement|blocks.VirtualElement)} element - The element from which to search for a dataItem
   * @returns {*}
   *
   * @example {html}
   * <script>
   *   blocks.query({
   *     items: [1, 2, 3],
   *     alertValue: function (e) {
   *       alert('Clicked the value: ' + blocks.dataItem(e.target));
   *     }
   *   });
   * </script>
   * <ul data-query="each(items)">
   *   <li data-query="click(alertValue)">{{$this}}</li>
   * </ul>
   */
  blocks.dataItem = function dataItem(element) {
    var context = blocks.context(element);
    return context ? context.$this : null;
  };

  /**
   * Determines if particular value is an blocks.observable
   *
   * @memberof blocks
   * @param {*} value - The value to check if the value is observable
   * @returns {boolean} - Returns if the value is observable
   *
   * @example {javascript}
   * blocks.isObservable(blocks.observable(3));
   * // -> true
   *
   * blocks.isObservable(3);
   * // -> false
   */
  blocks.isObservable = function isObservable(value) {
    return !!value && value.__identity__ === OBSERVABLE;
  };

  /**
   * Gets the raw value of an observable or returns the value if the specified object is not an observable
   *
   * @memberof blocks
   * @param {*} value - The value that could be any object observable or not
   * @returns {*} - Returns the unwrapped value
   *
   * @example {javascript}
   * blocks.unwrapObservable(blocks.observable(304));
   * // -> 304
   *
   * blocks.unwrapObservable(305);
   * // -> 305
   */
  blocks.unwrapObservable = function unwrapObservable(value) {
    if (value && value.__identity__ === OBSERVABLE) {
      return value();
    }
    return value;
  };

  blocks.domQuery = function domQuery(element) {
    element = blocks.$unwrap(element);
    if (element) {
      var data = ElementsData.data(element, 'domQuery');
      if (data) {
        return data;
      }
      return blocks.domQuery(VirtualElement.Is(element) ? element._parent : element.parentNode);
    }
    return null;
  };



  blocks.extend(blocks.queries, {
    /**
     * Associates the element with the particular view and creates a $view context property.
     * The View will be automatically hidden and shown if the view have routing. The visibility
     * of the View could be also controled using the isActive observable property
     *
     * @memberof blocks.queries
     * @param {View} view - The view to associate with the current element
     *
     * @example {html}
     * <!-- Associating the div element and its children with the Profiles view -->
     * <div data-query="view(Profiles)">
     *   <!-- looping through the View users collection -->
     *   <ul data-query="each(users)">
     *     <!-- Using the $view context value to point to the View selectUser handler -->
     *     <li data-query="click($view.selectUser)">{{username}}</li>
     *   </ul>
     * </div>
     *
     * @example {javascript}
     * var App = blocks.Application();
     *
     * App.View('Profiles', {
     *   users: [{ username: 'John' }, { username: 'Doe' }],
     *
     *   selectUser: function (e) {
     *     // ...stuff...
     *   }
     * });
     */
    view: {
      passDomQuery: true,

      preprocess: function (domQuery, view) {
        if (!view.isActive()) {
          this.css('display', 'none');
        } else {
          //view._tryInitialize(view.isActive());
          this.css('display', '');
          if (view._html) {
            blocks.queries.template.preprocess.call(this, domQuery, view._html, view);
          }
          // Quotes are used because of IE8 and below. It failes with 'Expected idenfitier'
          //queries['with'].preprocess.call(this, domQuery, view, '$view');
          //queries.define.preprocess.call(this, domQuery, view._name, view);
        }

        queries['with'].preprocess.call(this, domQuery, view, '$view');
      },

      update: function (domQuery, view) {
        if (view.isActive()) {
          if (view._html) {
            // Quotes are used because of IE8 and below. It failes with 'Expected idenfitier'
            queries['with'].preprocess.call(this, domQuery, view, '$view');

            this.innerHTML = view._html;
            view._children = view._html = undefined;
            blocks.each(createVirtual(this.childNodes[0]), function (element) {
              if (VirtualElement.Is(element)) {
                element.sync(domQuery);
              } else if (element && element.isExpression && element.element) {
                element.element.nodeValue = Expression.GetValue(domQuery._context, null, element);
              }
            });
            domQuery.createElementObservableDependencies(this.childNodes);
          }
          animation.show(this);
        } else {
          animation.hide(this);
        }
      }
    },

    /**
     * Navigates to a particular view by specifying the target view or route and optional parameters
     *
     * @memberof blocks.queries
     * @param {(View|String)} viewOrRoute - the view or route to which to navigate to
     * @param {Object} [params] - parameters needed for the current route
     *
     * @example {html}
     * <!-- will navigate to /contactus because the ContactUs View have /contactus route -->
     * <a data-query="navigateTo(ContactUs)">Contact Us</a>
     *
     * <!-- will navigate to /products/t-shirts because the Products View have /products/{{category}} route -->
     * <a data-query="navigateTo(Products, { category: 't-shirts' })">T-Shirts</a>
     *
     * <!-- the same example as above but the route is directly specifying instead of using the View instance -->
     * <a data-query="navigateTo('/products/{{category}}', { category: 't-shirts' })">T-Shirts</a>
     */
    navigateTo: {
      update: function (viewOrRoute, params) {
        function navigate(e) {
          e = e || window.event;
          e.preventDefault();
          e.returnValue = false;

          if (blocks.isString(viewOrRoute)) {
            window.location.href = viewOrRoute;
          } else {
            viewOrRoute.navigateTo(viewOrRoute, params);
          }
        }

        addListener(this, 'click', navigate);
      }
    },

    trigger: {

    }
  });


  var validators = {
    required: {
      priority: 9,
      validate: function (value, options) {
        if (value !== options.defaultValue &&
            value !== '' &&
            value !== false &&
            value !== undefined &&
            value !== null) {
          return true;
        }
      }
    },

    minlength: {
      priority: 19,
      validate: function (value, options, option) {
        if (value === undefined || value === null) {
          return false;
        }
        return value.length >= parseInt(option, 10);
      }
    },

    maxlength: {
      priority: 29,
      validate: function (value, options, option) {
        if (value === undefined || value === null) {
          return true;
        }
        return value.length <= parseInt(option, 10);
      }
    },

    min: {
      priority: 39,
      validate: function (value, options, option) {
        if (value === undefined || value === null) {
          return false;
        }
        return value >= option;
      }
    },

    max: {
      priority: 49,
      validate: function (value, options, option) {
        if (value === undefined || value === null) {
          return false;
        }
        return value <= option;
      }
    },

    email: {
      priority: 59,
      validate: function (value) {
        return /^((([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+(\.([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+)*)|((\x22)((((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(([\x01-\x08\x0b\x0c\x0e-\x1f\x7f]|\x21|[\x23-\x5b]|[\x5d-\x7e]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(\\([\x01-\x09\x0b\x0c\x0d-\x7f]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]))))*(((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(\x22)))@((([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.)+(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))$/i.test(value);
      }
    },

    url: {
      priority: 69,
      validate: function (value) {
        return /^(https?:\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*\/?$/.test(value);
      }
    },

    date: {
      priority: 79,
      validate: function (value) {
        if (!value) {
          return false;
        }
        return !/Invalid|NaN/.test(new Date(value.toString()).toString());
      }
    },

    creditcard: {
      priority: 89,
      validate: function (value) {
        if (blocks.isString(value) && value.length === 0) {
          return false;
        }
        if (blocks.isNumber(value)) {
          value = value.toString();
        }
        // accept only spaces, digits and dashes
        if (/[^0-9 \-]+/.test(value)) {
          return false;
        }
        var nCheck = 0,
            nDigit = 0,
            bEven = false;

        value = value.replace(/\D/g, '');

        for (var n = value.length - 1; n >= 0; n--) {
          var cDigit = value.charAt(n);
          nDigit = parseInt(cDigit, 10);
          if (bEven) {
            if ((nDigit *= 2) > 9) {
              nDigit -= 9;
            }
          }
          nCheck += nDigit;
          bEven = !bEven;
        }

        return (nCheck % 10) === 0;
      }
    },

    regexp: {
      priority: 99,
      validate: function (value, options, option) {
        if (!blocks.isRegExp(option)) {
          return false;
        }
        if (value === undefined || value === null) {
          return false;
        }
        return option.test(value);
      }
    },

    number: {
      priority: 109,
      validate: function (value) {
        if (blocks.isNumber(value)) {
          return true;
        }
        if (blocks.isString(value) && value.length === 0) {
          return false;
        }
        return /^(-?|\+?)(?:\d+|\d{1,3}(?:,\d{3})+)?(?:\.\d+)?$/.test(value);
      }
    },

    digits: {
      priority: 119,
      validate: function (value) {
        return /^\d+$/.test(value);
      }
    },

    letters: {
      priority: 129,
      validate: function (value) {
        if (!value) {
          return false;
        }
        return /^[a-zA-Z]+$/.test(value);
      }
    },

    equals: {
      priority: 139,
      validate: function (value, options, option) {
        return blocks.equals(value, blocks.unwrap(option));
      }
    }
  };

  // TODO: asyncValidate
  blocks.observable.validation = function (options) {
    var _this = this;
    var maxErrors = options.maxErrors;
    var errorMessages = this.errorMessages = blocks.observable([]);
    var validatorsArray = this._validators = [];
    var key;
    var option;

    this.errorMessage = blocks.observable('');

    for (key in options) {
      option = options[key];
      if (validators[key]) {
        validatorsArray.push({
          option: option,
          validate: validators[key].validate,
          priority: validators[key].priority
        });
      } else if (key == 'validate' || key == 'asyncValidate') {
        validatorsArray.push({
          option: '',
          validate: option.validate ? option.validate : option,
          priority: option.priority || Number.POSITIVE_INFINITY,
          isAsync: key == 'asyncValidate'
        });
      }
    }

    validatorsArray.sort(function (a, b) {
      return a.priority > b.priority ? 1 : -1;
    });

    this.valid = blocks.observable(true);

    this.validate = function () {
      var value = _this.__value__;
      var isValid = true;
      var errorsCount = 0;
      var i = 0;
      var validationOptions;
      var validator;
      var message;

      errorMessages.removeAll();
      for (; i < validatorsArray.length; i++) {
        if (errorsCount >= maxErrors) {
          break;
        }
        validator = validatorsArray[i];
        if (validator.isAsync) {
          validator.validate(value, function (result) {
            validationComplete(_this, options, !!result);
          });
          return true;
        } else {
          validationOptions = validator.option;
          option = validator.option;
          if (blocks.isPlainObject(validationOptions)) {
            option = validationOptions.value;
          }
          if (blocks.isFunction(option)) {
            option = option.call(_this.__context__);
          }
          message = validator.validate(value, options, option);
          if (blocks.isString(message)) {
            message = [message];
          }
          if (blocks.isArray(message) || !message) {
            errorMessages.addMany(
                blocks.isArray(message) ? message :
                validationOptions && validationOptions.message ? [validationOptions.message] :
                option && blocks.isString(option) ? [option] :
                []);
            isValid = false;
            errorsCount++;
          }
        }
      }

      validationComplete(this, options, isValid);
      this.valid(isValid);
      Events.trigger(this, 'validate');
      return isValid;
    };

    if (options.validateOnChange) {
      this.on('change', function () {
        this.validate();
      });
    }
    if (options.validateInitially) {
      this.validate();
    }
  };

  function validationComplete(observable, options, isValid) {
    var errorMessage = observable.errorMessage;
    var errorMessages = observable.errorMessages;

    if (isValid) {
      errorMessage('');
    } else {
      errorMessage(options.errorMessage || errorMessages()[0] || '');
    }

    observable.valid(isValid);
  }


  function escapeRegEx(string) {
    return string.replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, '\\$&');
  }

  blocks.route = function (route) {
    return Route(route);
  };

  function Route(route) {
    if (Route.Is(route)) {
      return route;
    }
    if (!Route.Is(this)) {
      return new Route(route);
    }

    this._routeString = route;
    this._wildcard = {};
    this._optional = {};
    this._validate = {};
    this._transform = {};
  }

  Route.Is = function (route) {
    return Route.prototype.isPrototypeOf(route);
  };

  Route.Has = function (route) {
    return route._routeString != null;
  };

  Route.Combine = function (routeA, routeB) {
    if (!Route.Has(routeB)) {
      return routeA;
    }
    if (!Route.Has(routeA)) {
      return routeB;
    }

    var route = Route(routeA + routeB);
    blocks.extend(route._wildcard, routeA._wildcard, routeB._wildcard);
    blocks.extend(route._optional, routeA._optional, routeB._optional);
    blocks.extend(route._validate, routeA._validate, routeB._validate);
    return route;
  };

  Route.prototype = {
    wildcard: function () {
      var wildcard = this._wildcard;
      var wildcards = blocks.flatten(blocks.toArray(arguments));
      blocks.each(wildcards, function (value) {
        wildcard[value] = true;
      });

      return this;
    },

    optional: function (nameOrObject, value) {
      this._addMetadata('optional', nameOrObject, value);

      return this;
    },

    validate: function (nameOrObject, value) {
      this._addMetadata('validate', nameOrObject, value);

      return this;
    },

    transform: function (nameOrObject, value) {
      this._addMetadata('_transform', nameOrObject, value);

      return this;
    },

    toString: function () {
      return this._routeString ? this._routeString.toString() : '';
    },

    trailingSlash: function () {
      return this;
    },

    _transfromParam: function (paramName, value) {
      var transform = this._transform[paramName];
      if (value === '' && blocks.has(this._optional, paramName)) {
        value = this._optional[paramName];
      }
      if (transform) {
        return transform(value);
      }
      return value;
    },

    _validateParam: function (paramName, value) {
      var validator = this._validate[paramName];
      if (validator) {
        return validator(value);
      }
      return true;
    },

    _addMetadata: function (type, nameOrObject, value) {
      var metadata = this['_' + type];

      if (blocks.isPlainObject(nameOrObject)) {
        blocks.each(nameOrObject, function (val, key) {
          metadata[key] = val;
        });
      } else if (blocks.isString(nameOrObject)) {
        metadata[nameOrObject] = value;
      }
    }
  };

  function Router() {
    this._currentRoute = {};
    this._routes = {};
  }

  blocks.core.Router = Router;

  Router.GenerateRoute = function (routeString, params) {
    var router = new Router();
    var routeId = router.registerRoute(routeString);
    var route = router.routeTo(routeId, params);

    if (routeString.indexOf('/') === 0 && route.indexOf('/') !== 0) {
      return '/' + route;
    }

    return route;
  };

  Router.prototype = {
    registerRoute: function (route, parentRoute) {
      route = Route(route);
      parentRoute = parentRoute ? Route(this._routes[Route(parentRoute).toString()].route) : Route(undefined);

      var finalRoute = Route.Combine(parentRoute, route);
      var routeId = finalRoute._routeString = finalRoute._routeString.replace(/^\//, '');
      var routeData = this._generateRouteStringData(routeId);

      this._routes[routeId] = {
        route: finalRoute,
        data: routeData,
        regExCollection: this._generateRouteRegEx(finalRoute, routeData),
        parent: Route.Has(parentRoute) ? this._routes[parentRoute.toString()] : undefined
      };

      return routeId;
    },

    routeTo: function (routeId, params) {
      var routeMetadata = this._routes[routeId];
      var route = routeMetadata.route;
      var result = '';
      var param;

      params = params || {};

      blocks.each(routeMetadata.data, function (split) {
        param = split.param;
        if (param) {
          if (route._validateParam(params[param])) {
            result += blocks.has(params, param) ? params[param] : route._optional[param];
          }
        } else {
          result += split.string;
        }
      });

      return result;
    },

    routeFrom: function (url) {
      var getUrlParams = this._getUrlParams;
      var result = [];
      var matches;

      url = decodeURI(url);

      blocks.each(this._routes, function (routeMetadata) {
        blocks.each(routeMetadata.regExCollection, function (regEx) {
          if (regEx.regEx.test(url)) {
            matches = regEx.regEx.exec(url);
            while (routeMetadata) {
              result.unshift({
                id: routeMetadata.route._routeString,
                params: getUrlParams(routeMetadata, regEx.params, matches)
              });
              routeMetadata  = routeMetadata.parent;
            }
            return false;
          }
        });
      });

      return result.length ? result : null;
    },

    _getUrlParams: function (routeMetadata, params, matches) {
      var route = routeMetadata.route;
      var result = {};
      var value;
      var param;

      blocks.each(params, function (param, index) {
        value = matches[index + 1];
        if (route._validateParam(param, value)) {
          result[param] = route._transfromParam(param, value);
        }
      });

      blocks.each(routeMetadata.data, function (split) {
        param = split.param;
        if (param && !result[param] &&
          blocks.has(route._optional, param) && route._optional[param] !== undefined) {

          result[param] = route._optional[param];
        }
      });

      return result;
    },

    _generateRouteRegEx: function (route, routeData) {
      var result = [];
      var sliceLastFromRegExString = this._sliceLastFromRegExString;
      var combinations = this._getOptionalParametersCombinations(route, routeData);
      var allOptionalBetweenForwardSlash;
      var containsParameter;
      var regExString;
      var params;
      var param;

      blocks.each(combinations, function (skipParameters) {
        regExString = '^';
        params = [];

        blocks.each(routeData, function (split) {
          param = split.param;
          if (param) {
            containsParameter = true;
            if (!blocks.has(route._optional, param) || !skipParameters[param]) {
              allOptionalBetweenForwardSlash = false;
            }
            if (skipParameters[param]) {
              return;
            } else {
              params.push(param);
            }
            if (route._wildcard[param]) {
              regExString += blocks.has(route._optional, param) ? '(.*?)' : '(.+?)';
            } else {
              regExString += blocks.has(route._optional, param) ? '([^\/]*?)' : '([^\/]+?)';
            }
          } else {
            if (split.string == '/') {
              if (containsParameter && allOptionalBetweenForwardSlash) {
                regExString = sliceLastFromRegExString(regExString);
              }
              containsParameter = false;
              allOptionalBetweenForwardSlash = true;
            }
            regExString += escapeRegEx(split.string);
          }
        });

        if (containsParameter && allOptionalBetweenForwardSlash) {
          regExString = sliceLastFromRegExString(regExString);
        }

        result.push({
          regEx: new RegExp(regExString + '$', 'i'),
          params: params
        });
      });

      return result;
    },

    _sliceLastFromRegExString: function (regExString) {
      var index;

      for (var i = 0; i < regExString.length; i++) {
        index = regExString.length - i - 1;
        if (regExString.charAt(index) == '/' && regExString.charAt(index + 1) != ']') {
          break;
        }
      }

      return regExString.substring(0, index - 1);
    },

    _getOptionalParametersCombinations: function (route, routeData) {
      var optionalParameters = this._getOptionalParameters(route, routeData);
      var iterations = Math.pow(2, optionalParameters.length);
      var length = optionalParameters.length;
      var combinations = [{}];
      var current;
      var i;
      var j;

      for (i = 0; i < iterations ; i++) {
        current = {};
        current.__lowestIndex__ = length;
        current.__length__ = 0;
        for (j = 0; j < length; j++) {
          /* jshint bitwise: false */
          if ((i & Math.pow(2, j))) {
            if (j < current.__lowestIndex__) {
              current.__lowestIndex__ = j;
            }
            current[optionalParameters[j]] = true;
            current.__length__ += 1;
          }
        }
        if (current.__length__) {
          combinations.push(current);
        }
      }

      combinations.sort(function (x, y) {
        var result = x.__length__ - y.__length__;

        if (!result) {
          return y.__lowestIndex__ - x.__lowestIndex__;
        }

        return result;
      });

      return combinations;
    },

    _getOptionalParameters: function (route, routeData) {
      var optionalParameters = [];

      blocks.each(routeData, function (split) {
        if (blocks.has(route._optional, split.param)) {
          optionalParameters.push(split.param);
        }
      });

      return optionalParameters;
    },

    _generateRouteStringData: function (routeString) {
      var pushStringData = this._pushStringData;
      var data = [];
      var lastIndex = 0;

      routeString.replace(/{{[^}]+}}/g, function (match, startIndex) {
        pushStringData(data, routeString.substring(lastIndex, startIndex));
        lastIndex = startIndex + match.length;
        data.push({
          param: match.substring(2, match.length - 2)
        });
      });

      if (lastIndex != routeString.length) {
        pushStringData(data, routeString.substring(lastIndex));
      }

      return data;
    },

    _pushStringData: function (data, string) {
      var splits = string.split('/');
      blocks.each(splits, function (split, index) {
        if (split) {
          data.push({
            string: split
          });
        }
        if (index != splits.length - 1) {
          data.push({
            string: '/'
          });
        }
      });
    }
  };

  var uniqueId = (function () {
    var timeStamp = Date.now();
    return function () {
      return 'blocks_' + blocks.version + '_' + timeStamp++;
    };
  })();

  function Request(options) {
    this.options = blocks.extend({}, Request.Defaults, options);
    this.execute();
  }

  Request.Execute = function (options) {
    return new Request(options);
  };

  Request.Defaults = {
    type: 'GET',
    url: '',
    processData: true,
    async: true,
    contentType: 'application/x-www-form-urlencoded; charset=UTF-8',
    jsonp: 'callback',
    jsonpCallback: function () {
      return uniqueId();
    }

  /*
  timeout: 0,
  data: null,
  dataType: null,
  username: null,
  password: null,
  cache: null,
  throws: false,
  traditional: false,
  headers: {},
  */
  };

  Request.Accepts = {
    '*': '*/'.concat('*'),
    text: 'text/plain',
    html: 'text/html',
    xml: 'application/xml, text/xml',
    json: 'application/json, text/javascript'
  };

  Request.Meta = {
    statusFix: {
      // file protocol always yields status code 0, assume 200
      0: 200,
      // Support: IE9
      // IE sometimes returns 1223 instead of 204
      1223: 204
    }
  };

  Request.prototype = {
    execute: function () {
      var options = this.options;
      var serverData = window.__blocksServerData__;

      if (options.type == 'GET' && options.data) {
        this.appendDataToUrl(options.data);
      }

      if (serverData && serverData.requests && serverData.requests[options.url]) {
        this.callSuccess(serverData.requests[options.url]);
      } else {
        try {
          if (options.dataType == 'jsonp') {
            this.scriptRequest();
          } else {
            this.xhrRequest();
          }
        } catch (e) {

        }
      }
    },

    xhrRequest: function () {
      var options = this.options;
      var xhr = this.createXHR();

      xhr.onabort = blocks.bind(this.xhrError, this);
      xhr.ontimeout = blocks.bind(this.xhrError, this);
      xhr.onload = blocks.bind(this.xhrLoad, this);
      xhr.onerror = blocks.bind(this.xhrError, this);
      xhr.open(options.type.toUpperCase(), options.url, options.async, options.username, options.password);
      xhr.setRequestHeader('Content-Type', options.contentType);
      xhr.setRequestHeader('Accept', Request.Accepts[options.dataType || '*']);
      xhr.send(options.data || null);
    },

    createXHR: function () {
      var Type = XMLHttpRequest || window.ActiveXObject;
      try {
        return new Type('Microsoft.XMLHTTP');
      } catch (e) {

      }
    },

    xhrLoad: function (e) {
      var request = e.target;
      var status = Request.Meta.statusFix[request.status] || request.status;
      var isSuccess = status >= 200 && status < 300 || status === 304;
      if (isSuccess) {
        this.callSuccess(request.responseText);
      } else {
        this.callError(request.statusText);
      }
    },

    xhrError: function () {
      this.callError();
    },

    scriptRequest: function () {
      var that = this;
      var options = this.options;
      var script = document.createElement('script');
      var jsonpCallback = {};
      var callbackName = blocks.isFunction(options.jsonpCallback) ? options.jsonpCallback() : options.jsonpCallback;

      jsonpCallback[options.jsonp] = callbackName;
      this.appendDataToUrl(jsonpCallback);
      window[callbackName] = function (result) {
        window[callbackName] = null;
        that.scriptLoad(result);
      };

      script.onerror = this.scriptError;
      script.async = options.async;
      script.src = options.url;
      document.head.appendChild(script);
    },

    scriptLoad: function (data) {
      this.callSuccess(data);
    },

    scriptError: function () {
      this.callError();
    },

    appendDataToUrl: function (data) {
      var that = this;
      var options = this.options;
      var hasParameter = /\?/.test(options.url);

      if (blocks.isPlainObject(data)) {
        blocks.each(data, function (value, key) {
          options.url += that.append(hasParameter, key, value.toString());
        });
      } else if (blocks.isArray(data)) {
        blocks.each(data, function (index, value) {
          that.appendDataToUrl(value);
        });
      } else {
        options.url += that.append(hasParameter, data.toString(), '');
      }
    },

    append: function (hasParameter, key, value) {
      var result = hasParameter ? '&' : '?';
      result += key;
      if (value) {
        result += '=' + value;
      }
      return result;
    },

    callSuccess: function (data) {
      var success = this.options.success;
      var textStatus = 'success';
      if (success) {
        success(data, textStatus, null);
      }
      this.callComplete(textStatus);
    },

    callError: function (errorThrown) {
      var error = this.options.error;
      var textStatus = 'error';
      if (error) {
        error(null, textStatus, errorThrown);
      }
      this.callComplete(textStatus);
    },

    callComplete: function (textStatus) {
      var complete = this.options.complete;
      if (complete) {
        complete(null, textStatus);
      }
    }
  };


  function ajax(options) {
    if (window) {
      var jQuery = window.jQuery || window.$;
      if (jQuery && jQuery.ajax) {
        jQuery.ajax(options);
      } else {
        Request.Execute(options);
      }
    }
  }

  /* global JSON */

  var CREATE = 'create';
  var UPDATE = 'update';
  var DESTROY = 'destroy';
  var GET = 'GET';
  var CONTENT_TYPE = 'application/json; charset=utf-8';
  //var JSONP = 'jsonp';
  var EVENTS = [
      'change',
      'sync',
      'error',
      'requestStart',
      'requestEnd'
  ];

  function DataSource(options) {
    options = options || {};
    var data = options.data;
    var baseUrl = options.baseUrl;

    // set options.data to undefined and return the extended options object using ||
    options = this.options = (options.data = undefined) || blocks.extend(true, {}, this.options, options);

    if (baseUrl) {
      options.read.url = baseUrl + options.read.url;
      options.create.url = baseUrl + options.create.url;
      options.destroy.url = baseUrl + options.destroy.url;
      options.update.url = baseUrl + options.update.url;
    }

    this.data = blocks
        .observable(blocks.unwrap(data) || [])
        .extend()
        .on('add remove', blocks.bind(this._onArrayChange, this));
    this.hasChanges = blocks.observable(false);

    this._aggregates = null;
    this._changes = [];
    this._changesMeta = {};

    this._subscribeToEvents();
  }

  blocks.DataSource = DataSource;

  DataSource.ArrayMode = 1;
  DataSource.ObjectMode = 2;

  DataSource.prototype = {
    options: {
      baseUrl: '',
      idAttr: '',
      mode: DataSource.ArrayMode,

      read: {
        url: '',
        type: GET,
        contentType: CONTENT_TYPE
      },

      update: {
        url: '',
        type: 'POST',
        contentType: CONTENT_TYPE
      },

      create: {
        url: '',
        type: 'POST',
        contentType: CONTENT_TYPE
      },

      destroy: {
        url: '',
        type: 'POST',
        contentType: CONTENT_TYPE
      }
    },

    read: function (options, callback) {
      var _this = this;

      callback = arguments[arguments.length - 1];
      if (blocks.isFunction(options)) {
        options = {};
      }
      options = options || {};

      _this._ajax('read', options, function (data) {
        if (blocks.isString(data)) {
          data = JSON.parse(data);
        }

        if (_this.options.mode == DataSource.ArrayMode) {
          if (!blocks.isArray(data)) {
            if (blocks.isArray(data.value)) {
              data = data.value;
            } else if (blocks.isObject(data)) {
              blocks.each(data, function (value) {
                if (blocks.isArray(value)) {
                  data = value;
                  return false;
                }
              });
            }
          }
        }

        if (!blocks.isArray(data)) {
          data = [data];
        }

        if (!options || options.__updateData__ !== false) {
          _this._updateData(data);
        }
        if (callback && blocks.isFunction(callback)) {
          callback(data);
        }
      });
      return _this;
    },

    // should accept dataItem only
    // should accept id + object with the new data
    update: function () {
      if (arguments.length === 0) {
        return;
      }
      var items;
      if (arguments.length > 1 && blocks.type(arguments[0]) != blocks.type(arguments[1])) {
        items = [arguments[1]];
        items[0][this.options.idAttr] = arguments[0];
      } else {
        items = blocks.flatten(arguments);
      }
      if (items.length > 0) {
        this._changes.push({
          type: UPDATE,
          items: items
        });
        this._onChangePush();
      }
    },

    hasChanges: function () {
      return this._changes.length > 0;
    },

    clearChanges: function () {
      this._changes.splice(0, this._changes.length);
      this._changesMeta = {};
      this.hasChanges(false);
      return this;
    },

    sync: function (callback) {
      var _this = this;
      var changes = this._changes;
      var changesLeft = changes.length;
      var data;

      blocks.each(changes, function (change) {
        blocks.each(change.items, function (item) {
          data = item;
          if (item.__id__) {
            delete item.__id__;
          }
          _this._ajax(change.type, {
            data: data
          }, function () {
            changesLeft--;
            if (!changesLeft) {
              if (blocks.isFunction(callback)) {
                callback();
              }
              _this._trigger('sync');
            }
          });
        });
      });

      return this.clearChanges();
    },

    _ajax: function (optionsName, options, callback) {
      var _this = this;
      var type;

      options = blocks.extend({}, this.options[optionsName], options);
      type = options.type.toUpperCase();
      options.url = Router.GenerateRoute(options.url, options.data);
      this._trigger('requestStart', {

      });
      ajax({
        type: options.type,
        url: options.url,
        data: type == GET ? null : JSON.stringify(options.data),
        contentType: options.contentType, // 'application/json; charset=utf-8',
        dataType: options.dataType,
        jsonp: options.jsonp,
        success: function (data, statusMessage, status) {
          _this._trigger('requestEnd', {});
          if (data) {
            callback(data, statusMessage, status);
          }
        },
        error: function (/*message, statusObject, status*/) {
          _this._trigger('requestEnd', {});
          _this._trigger('error');
        }
      });
    },

    _updateData: function (data) {
      this.data.removeAll();
      this.data.addMany(data);

      this.clearChanges();
      this._trigger('change');
    },

    _onArrayChange: function (args) {
      var type = args.type;
      if (type == 'remove') {
        this._remove(args.items);
      } else if (type == 'removeAt') {
        this._remove(this.data.slice(args.index, args.index + args.count));
      } else if (type == 'add') {
        this._add(args.items);
      }
    },

    _onChangePush: function () {
      var metadata = this._changesMeta;
      var changes = this._changes;
      var change = changes[changes.length - 1];
      var idAttr = this.options.idAttr;
      var type = change.type;
      var metaItem;

      blocks.each(change.items, function (item) {
        switch (type) {
          case CREATE:
            item.__id__ = uniqueId();
            metadata[item.__id__] = item;
            break;
          case UPDATE:
            metaItem = metadata[item[idAttr]];
            if (metaItem) {
              changes.splice(metaItem.index, 1);
              metaItem.item = item;
              metaItem.index = changes.length - 1;
            }
            metadata[item[idAttr]] = {
              index: changes.length - 1,
              item: item
            };
            break;
          case DESTROY:
            metaItem = metadata[item ? item.__id__ : undefined];
            if (metaItem) {
              changes.splice(metaItem.index, 1);
              changes.pop();
              metadata[item.__id__] = undefined;
            }
            break;
        }
      });

      if (changes.length > 0 && this.options.autoSync) {
        this.sync();
      } else {
        this.hasChanges(changes.length > 0);
      }
    },

    _add: function (items) {
      this._changes.push({
        type: CREATE,
        items: items
      });
      this._onChangePush();
    },

    _remove: function (items) {
      this._changes.push({
        type: DESTROY,
        items: items
      });
      this._onChangePush();
    },

    _subscribeToEvents: function () {
      var _this = this;
      var options = this.options;

      blocks.each(EVENTS, function (value) {
        if (options[value]) {
          _this.on(value, options[value]);
        }
      });
    }
  };

  Events.register(DataSource.prototype, [
    'on',
    '_trigger',


    // TODO: Should remove these
    'change',
    'error',
    'requestStart',
    'requestEnd'
  ]);

  blocks.core.applyExpressions('array', blocks.DataSource.prototype, blocks.toObject([/*'remove', 'removeAt', 'removeAll', 'add',*/ 'size', 'at', 'isEmpty', 'each']));



  function Property(options) {
    this._options = options || {};
  }

  Property.Is = function (value) {
    return Property.prototype.isPrototypeOf(value);
  };

  Property.Inflate = function (object) {
    var properties = {};
    var key;
    var value;

    for (key in object) {
      value = object[key];
      if (Property.Is(value)) {
        value = value._options;
        value.propertyName = key;
        properties[value.field || key] = value;
      }
    }

    return properties;
  };

  Property.Create = function (options, thisArg, value) {
    var observable;

    if (arguments.length < 3) {
      value = options.value || options.defaultValue;
    }
    thisArg = options.thisArg ? options.thisArg : thisArg;

    observable = blocks
      .observable(value, thisArg)
      .extend('validation', options)
      .on('changing', options.changing, thisArg)
      .on('change', options.change, thisArg);

    blocks.each(options.extenders, function (extendee) {
      observable = observable.extend.apply(observable, extendee);
    });

    return observable;
  };

  Property.prototype.extend = function () {
    var options = this._options;
    options.extenders = options.extenders || [];
    options.extenders.push(blocks.toArray(arguments));

    return this;
  };



  /**
   * @namespace Model
   */
  function Model(application, prototype, dataItem, collection) {
    var _this = this;
    this._application = application;
    this._collection = collection;
    this._initialDataItem = blocks.clone(dataItem, true);

    blocks.each(Model.prototype, function (value, key) {
      if (blocks.isFunction(value) && key.indexOf('_') !== 0) {
        _this[key] = blocks.bind(value, _this);
      }
    });
    clonePrototype(prototype, this);

    this.valid = blocks.observable(true);

    this.isLoading = blocks.observable(false);

    this.validationErrors = blocks.observable([]);

    this._isNew = false;
    this._dataItem = dataItem || {}; // for original values
    this._properties = Property.Inflate(this);
    if (!this.options.baseUrl) {
      this.options.baseUrl = application.options.baseUrl;
    }
    this.options.mode = DataSource.ObjectMode;
    this._dataSource = new DataSource(this.options);
    this._dataSource.on('change', this._onDataSourceChange, this);
    this._dataSource.requestStart(function () {
      _this.isLoading(true);
    });
    this._dataSource.requestEnd(function () {
      _this.isLoading(false);
    });
    this._dataSource.on('sync', this._onDataSourceSync);
    this.hasChanges = this._dataSource.hasChanges;

    this._ensurePropertiesCreated(dataItem);
    this.init();
  }

  Model.prototype = {
    /**
     * The options for the Model
     *
     * @memberof Model
     * @type {Object}
     */
    options: {},

    /**
     * Override the init method to perform actions on creation for each Model instance
     *
     * @memberof Model
     * @type {Function}
     *
     * @example {javascript}
     * var App = blocks.Application();
     *
     * var Product = App.Model({
     *   init: function () {
     *     this.finalPrice = this.price() * this.ratio();
     *   },
     *
     *   price: App.Property({
     *     defaultValue: 0
     *   }),
     *
     *   ratio: App.Property({
     *     defaultValue: 1
     *   })
     * });
     */
    init: blocks.noop,

    /**
     * Returns the `Collection` instance the model is part of.
     * If it is not part of a collection it returns null.
     *
     * @returns {Collection|null} - The `Collection` or null.
     *
     * @example {javascript}
     * var App = blocks.Application();
     *
     * var User = App.Model({
     *   init: function () {
     *     if (this.collection()) {
     *       this.collection().on('add remove', function handle() {});
     *     }
     *   }
     * });
     */
    collection: function () {
      return this._collection || null;
    },

    /**
     * Validates all observable properties that have validation and returns true if
     * all values are valid otherwise returns false
     *
     * @memberof Model
     * @returns {boolean} - Value indicating if the model is valid or not
     *
     * @example {javascript}
     * var App = blocks.Application();
     *
     * var User = App.Model({
     *   username: App.Property({
     *     required: true
     *   }),
     *
     *   email: App.Property({
     *     email: true
     *   })
     * });
     *
     * App.View('SignUp', {
     *   newUser: User(),
     *
     *   registerUser: function () {
     *     if (this.newUser.validate()) {
     *       alert('Successful registration!');
     *     }
     *   }
     * });
     */
    validate: function () {
      var properties = this._properties;
      var isValid = true;
      var property;
      var key;

      for (key in properties) {
        property = this[key];
        if (blocks.isObservable(property) && blocks.isFunction(property.validate) && !property.validate()) {
          isValid = false;
        }
      }
      this.valid(isValid);
      this._updateValidationErrors();
      return isValid;
    },

    /**
     * Extracts the raw(non observable) dataItem object values from the Model
     *
     * @memberof Model
     * @returns {Object} - Returns the raw dataItem object
     *
     * @example {javascript}
     * var App = blocks.Application();
     * var User = App.Model({
     *   firstName: App.Property({
     *     defaultValue: 'John'
     *   })
     * });
     *
     * App.View('Profile', {
     *   user: User(),
     *
     *   init: function () {
     *     var dataItem = this.user.dataItem();
     *     // -> { firstName: 'defaultValue' }
     *   }
     * });
     */
    dataItem: function () {
      var properties = this._properties;
      var dataItem = {};
      var key;
      var property;

      for (key in properties) {
        property = properties[key];
        if (key != '__id__' && blocks.isFunction(this[property.propertyName])) {
          dataItem[property.field || property.propertyName] = this[property.propertyName]();
        }
      }
      if (this.isNew()) {
        delete dataItem[this.options.idAttr];
      }

      return dataItem;
    },

    /**
     * Applies new properties to the Model by providing an Object
     *
     * @memberof Model
     * @param {Object} dataItem - The object from which the new values will be applied
     * @returns {Model} - Chainable. Returns itself
     */
    reset: function (dataItem) {
      this._ensurePropertiesCreated(dataItem);
      return this;
    },

    /**
     * Determines whether the instance is new. If true when syncing the item will send
     * for insertion instead of updating it. The check is determined by the idAttr value
     * specified in the options. If idAttr is not specified the item will always be considered new.
     *
     * @memberof Model
     * @returns {boolean} - Returns whether the instance is new
     */
    isNew: function () {
      var idAttr = this.options.idAttr;
      var value = blocks.unwrap(this[idAttr]);
      var property = this._properties[idAttr];

      if ((!value && value !== 0) || (property && value === property.defaultValue)) {
        return true;
      }
      return false;
    },

    /**
     * Fires a request to the server to populate the Model based on the read URL specified
     *
     * @memberof Model
     * @param {Object} [params] - The parameters Object that will be used to populate the
     * Model from the specified options.read URL. If the URL does not contain parameters
     * @returns {Model} - Chainable. Returns the Model itself - returns this;
     */
    read: function (params, callback) {
      // TODO: Write tests for the callback checking if it is beeing called
      if (blocks.isFunction(params)) {
        callback = params;
        params = undefined;
      }
      this._dataSource.read({
        data: params
      }, callback);
      return this;
    },


    destroy: function (removeFromCollection) {
      removeFromCollection = removeFromCollection === false ? false : true;
      if (removeFromCollection && this._collection) {
        this._collection.remove(this);
      }
      this._dataSource._remove([this.dataItem()]);
      return this;
    },

    /**
     * Synchronizes the changes with the server by sending requests to the provided URL's
     *
     * @memberof Model
     * @param {Function} [callback] - Optional callback which will be executed
     * when all sync operations have been successfully completed
     * @returns {Model} - Returns the Model itself - return this;
     */
    sync: function (callback) {
      if (this.isNew()) {
        this._dataSource.data.add(this.dataItem());
      }
      this._dataSource.sync(callback);
      return this;
    },

    clone: function () {
      return new this.constructor(blocks.clone(this._initialDataItem, true));
    },

    _setPropertyValue: function (property, propertyValue) {
      var propertyName = property.propertyName;
      if (blocks.isFunction(this[propertyName])) {
        this[propertyName](propertyValue);
        this._dataSource.update(this.dataItem());
      } else if (property.isObservable) {
        this[propertyName] = this._createObservable(property, propertyValue);
      } else {
        this[propertyName] = function () {
          return propertyValue;
        };
      }
    },

    _ensurePropertiesCreated: function (dataItem) {
      var properties = this._properties;
      var property;
      var key;
      var field;

      if (dataItem) {
        if (Model.prototype.isPrototypeOf(dataItem)) {
          dataItem = dataItem.dataItem();
        }

        for (key in dataItem) {
          property = properties[key];
          if (!property) {
            property = properties[key] = blocks.extend({}, this._application.Property.Defaults());
            property.propertyName = key;
          }
          this._setPropertyValue(property, dataItem[key]);
        }
      }

      for (key in properties) {
        property = properties[key];
        if (!blocks.has(dataItem, property.propertyName)) {
          field = property.field || property.propertyName;
          this._setPropertyValue(property, property.value || (blocks.has(dataItem, field) ? dataItem[field] : property.defaultValue));
        }
      }
    },

    _createObservable: function (property, value) {
      var _this = this;
      var properties = this._properties;
      var observable = Property.Create(property, this, value);

      observable
        .on('change', function () {
          if (!_this.isNew()) {
            _this._dataSource.update(_this.dataItem());
          }
        })
        .on('validate', function () {
          var isValid = true;
          var key;
          for (key in properties) {
            if (blocks.isFunction(_this[key].valid) && !_this[key].valid()) {
              isValid = false;
              break;
            }
          }
          _this._updateValidationErrors();
          _this.valid(isValid);
        });

      if (!this._collection) {
        observable.extend();
      }
      return observable;
    },

    _onDataSourceChange: function () {
      var dataItem = blocks.unwrapObservable(this._dataSource.data())[0];
      this._ensurePropertiesCreated(dataItem);
    },

    _updateValidationErrors: function () {
      var properties = this._properties;
      var result = [];
      var value;
      var key;

      for (key in properties) {
        value = this[key];
        if (value.errorMessages) {
          result.push.apply(result, value.errorMessages());
        }
      }

      this.validationErrors.reset(result);
    }
  };

  if (blocks.core.expressionsCreated) {
    blocks.core.applyExpressions('object', Model.prototype);
  }


  function clonePrototype(prototype, object) {
    var key;
    var value;

    for (key in prototype) {
      value = prototype[key];
      if (Property.Is(value)) {
        continue;
      }

      if (blocks.isObservable(value)) {
        // clone the observable and also its value by passing true to the clone method
        object[key] = value.clone(true);
        object[key].__context__ = object;
      } else if (blocks.isFunction(value)) {
        object[key] = blocks.bind(value, object);
      } else if (Model.prototype.isPrototypeOf(value)) {
        object[key] = value.clone(true);
      } else if (blocks.isObject(value) && !blocks.isPlainObject(value)) {
        object[key] = blocks.clone(value, true);
      } else {
        object[key] = blocks.clone(value, true);
      }
    }
  }

  var routeStripper = /^[#\/]|\s+$/g;
  var rootStripper = /^\/+|\/+$/g;
  var isExplorer = /msie [\w.]+/;
  var trailingSlash = /\/$/;
  var pathStripper = /[?#].*$/;
  var HASH = 'hash';
  var PUSH_STATE = 'pushState';

  function History(options) {
    this._options = blocks.extend({
      root: '/'
    }, options);

    this._tryFixOrigin();

    this._initial = true;
    this._location = window.location;
    this._history = window.history;
    this._root = ('/' + this._options.root + '/').replace(rootStripper, '/');
    this._interval = 50;
    this._fragment = this._getFragment();
    this._wants = this._options.history === true ? HASH : this._options.history;
    this._use = this._wants == PUSH_STATE && (this._history && this._history.pushState) ? PUSH_STATE : HASH;
    this._hostRegEx = new RegExp(escapeRegEx(this._location.host));
  }

  History.prototype = {
    start: function () {
      var fragment = this._fragment;
      var docMode = document.documentMode;
      var oldIE = (isExplorer.exec(navigator.userAgent.toLowerCase()) && (!docMode || docMode <= 7));

      if (this._use == HASH && oldIE) {
        this._createIFrame();
        this.navigate(fragment);
      }

      this._initEvents(oldIE);
      if (!this._tryAdaptMechanism(fragment)) {
        this._loadUrl();
      }
    },

    navigate: function (fragment, options) {
      if (!options || options === true) {
        options = {
          trigger: !!options
        };
      }
      var url = this._root + (fragment = this._getFragment(fragment || ''));
      var use = this._use;
      var iframe = this._iframe;
      var location = this._location;

      fragment = fragment.replace(pathStripper, '');
      if (this._fragment === fragment) {
        return false;
      }
      this._fragment = fragment;
      if (fragment === '' && url !== '/') {
        url = url.slice(0, -1);
      }

      if (this._wants == PUSH_STATE && use == PUSH_STATE) {
        this._history[options.replace ? 'replaceState' : 'pushState']({}, document.title, url);
      } else if (use == HASH) {
        this._updateHash(location, fragment, options.replace);
        if (iframe && (fragment !== this.getFragment(this._getHash(iframe)))) {
          if (!options.replace) {
            iframe.document.open().close();
          }
          this._updateHash(iframe.location, fragment, options.replace);
        }
      } else {
        location.assign(url);
        return true;
      }

      return this._loadUrl(fragment);
    },

    _initEvents: function (oldIE) {
      var use = this._use;
      var onUrlChanged = blocks.bind(this._onUrlChanged, this);

      if (this._wants == PUSH_STATE) {
        addListener(document, 'click', blocks.bind(this._onDocumentClick, this));
      }

      if (use == PUSH_STATE) {
        addListener(window, 'popstate', onUrlChanged);
      } else if (use == HASH && !oldIE && ('onhashchange' in window)) {
        addListener(window, 'hashchange', onUrlChanged);
      } else if (use == HASH) {
        this._checkUrlInterval = setInterval(onUrlChanged, this._interval);
      }
    },

    _loadUrl: function (fragment) {
      var initial = this._initial;

      this._initial = false;
      this._fragment = fragment = this._getFragment(fragment);

      return Events.trigger(this, 'urlChange', {
        url: fragment,
        initial: initial
      });
    },

    _getHash: function (window) {
      var match = (window ? window.location : this._location).href.match(/#(.*)$/);
      return match ? match[1] : '';
    },

    _getFragment: function (fragment) {
      if (fragment == null) {
        if (this._use == PUSH_STATE) {
          var root = this._root.replace(trailingSlash, '');
          fragment = this._location.pathname;
          if (!fragment.indexOf(root)) {
            fragment = fragment.slice(root.length);
          }
        } else {
          fragment = this._getHash();
        }
      }
      return fragment.replace(this._location.origin, '').replace(routeStripper, '');
    },

    _onUrlChanged: function () {
      var current = this._getFragment();
      if (current === this._fragment && this._iframe) {
        current = this._getFragment(this._getHash(this._iframe));
      }
      if (current === this._fragment) {
        return false;
      }
      if (this._iframe) {
        this.navigate(current);
      }
      this._loadUrl();
    },

    _onDocumentClick: function (e) {
      var target = e.target;

      while (target) {
        if (target && target.tagName && target.tagName.toLowerCase() == 'a') {
          var download = target.getAttribute('download');
          var element;

          if (download !== '' && !download && this._hostRegEx.test(target.href) &&
            !e.altKey && !e.ctrlKey && !e.metaKey && !e.shiftKey && e.which !== 2) {

            // handle click
            if (this.navigate(target.href)) {
              element = document.getElementById(window.location.hash.replace(/^#/, ''));
              if (element && element.scrollIntoView) {
                element.scrollIntoView();
              }
              e.preventDefault();
            }
          }

          break;
        }
        target = target.parentNode;
      }
    },

    _tryAdaptMechanism: function (fragment) {
      var root = this._root;
      var use = this._use;
      var location = this._location;
      var atRoot = location.pathname.replace(/[^\/]$/, '$&/') === root;

      this._fragment = fragment;
      if (this._wants == PUSH_STATE) {
        if (use != PUSH_STATE && !atRoot) {
          fragment = this._fragment = this._getFragment(null, true);
          location.replace(root + location.search + '#' + fragment);
          return true;
        } else if (use == PUSH_STATE && atRoot && location.hash) {
          this._fragment = this._getHash().replace(routeStripper, '');
          this._history.replaceState({}, document.title, root + fragment + location.search);
        }
      }
    },

    _updateHash: function (location, fragment, replace) {
      if (replace) {
        var href = location.href.replace(/(javascript:|#).*$/, '');
        location.replace(href + '#' + fragment);
      } else {
        location.hash = '#' + fragment;
      }
    },

    _createIFrame: function () {
      /* jshint scripturl: true */
      var iframe = document.createElement('iframe');
      iframe.style.display = 'none';
      iframe.src = 'javascript:0';
      iframe.tabIndex = -1;
      document.body.appendChild(iframe);
      this._iframe = iframe.contentWindow;
    },

    _tryFixOrigin: function () {
      var location = window.location;
      if (!location.origin) {
        location.origin = location.protocol + '//' + location.hostname + (location.port ? ':' + location.port: '');
      }
    }
  };

  Events.register(History.prototype, ['on']);

  /**
  * @namespace Collection
  */
  function Collection(ModelType, prototype, application, initialData) {
    return createCollectionObservable(ModelType, prototype, application, initialData);
  }

  blocks.observable.remote = function (options) {
    return createCollectionObservable(null, {
      options: options
    }, null, this.__value__);
  };

  function createCollectionObservable(ModelType, prototype, application, initialData) {
    var observable = blocks.observable([]).extend();
    var properties = Property.Inflate(prototype);
    var key;

    for (key in properties) {
      observable[key] = properties[key];
    }

    observable._baseUpdate = observable.update;
    blocks.each(blocks.observable.fn.collection, function (value, key) {
      if (blocks.isFunction(value) && key.indexOf('_') !== 0) {
        observable[key] = blocks.bind(observable[key], observable);
      }
    });
    blocks.extend(observable, blocks.observable.fn.collection, prototype);
    clonePrototype(prototype, observable);
    observable._Model = ModelType;
    observable._prototype = prototype;

    if (application) {
      observable._application = application;
      observable._view = blocks.__viewInInitialize__;
      if (!prototype.options.baseUrl) {
        prototype.options.baseUrl = application.options.baseUrl;
      }
    }

    observable._dataSource = new DataSource(prototype.options);
    observable._dataSource.on('change', observable._onDataSourceChange, observable);
    observable.hasChanges = observable._dataSource.hasChanges;
    if (ModelType) {
      observable.on('adding', observable._onAdding, observable);
      observable.on('remove add', observable._onChange, observable);
    }

    if (blocks.isArray(initialData)) {
      observable.reset(initialData);
    }

    if (prototype.init) {
      prototype.init.call(observable);
    }

    return observable;
  }

  blocks.observable.fn.collection = {

    /**
     * Fires a request to the server to populate the Model based on the read URL specified
     *
     * @memberof Collection
     * @param {Object} [params] - The parameters Object that will be used to populate the
     * Collection from the specified options.read URL. If the URL does not contain parameters
     * @returns {Collection} - Chainable. Returns the Collection itself - return this;
     *
     * @example {javascript}
     * var App = blocks.Application();
     *
     * var Products = App.Collection({
     *   options: {
     *     read: {
     *       url: 'http://your-servrice-url/{{id}}'
     *     }
     *   }
     * });
     *
     * var products = Products().read({
     *   // the id that will be replaced in the above options.read URL
     *   id: 3
     * });
     */
    read: function (params, callback) {
      // TODO: Write tests for the callback checking if it is being called
      var _this = this;

      if (blocks.isFunction(params)) {
        callback = params;
        params = undefined;
      }
      this._dataSource.read({
        data: params
      }, callback ? function () {
        callback.call(_this.__context__);
      } : blocks.noop);

      return this;
    },

    /**
     * Clear all changes made to the collection
     *
     * @memberof Collection
     * @returns {Collection} Chainable. Returns this
     *
     * @example {javascript}
     * var App = blocks.Application();
     *
     * var Products = App.Collection({
     *
     * });
     *
     * App.View('Products', function () {
     *   products: Products(),
     *
     *   init: function () {
     *     this.products.push({
     *       ProductName: 'Fish'
     *     });
     *
     *     // -> this.products.length = 1
     *     this.products.clearChanges();
     *     // -> this.products.length = 0
     *   }
     * });
     */
    clearChanges: function () {
      this._dataSource.clearChanges();
      return this;
    },

    /**
     * Performs an ajax request for all create, update and delete operations in order to sync them
     * with a database.
     *
     * @memberof Collection
     * @param {Function} [callback] - Optional callback which will be executed
     * when all sync operations have been successfully completed
     * @returns {Collection} - Chainable. Returns the Collection itself - return this;
     *
     * @example {javascript}
     * var App = blocks.Application();
     * var Products = App.Collection({
     *   options: {
     *     create: {
     *       url: 'serviceURL/CreateProduct'
     *     }
     *   }
     * });
     *
     * App.View('Products', function () {
     *   products: Products(),
     *
     *   init: function () {
     *     this.products.push({
     *       ProductName: 'Fish'
     *     });
     *
     *     // sends AJAX request to the create.url with the new item
     *     this.products.sync();
     *   }
     * });
     */
    sync: function (callback) {
      this._dataSource.sync(callback);
      return this;
    },

    /**
     *
     *
     * @memberof Collection
     * @param {number} id -
     * @param {Object} newValues -
     * @returns {Collection} - Chainable. Returns the Collection itself - return this;
     */
    update: function (id, newValues) {
      if (arguments.length === 0) {
        this._baseUpdate.call(this);
      } else {
        this._dataSource.update(id, newValues);
      }
      return this;
    },

    sortBy: function (callback, thisArg) {
      if (typeof callback == 'string') {
        var fieldName = callback;
        callback = function (value) {
          return value[fieldName]();
        };
      }
      blocks.sortBy(this.__value__, callback, thisArg);
      return this;
    },

    clone: function (cloneValue) {
      return createCollectionObservable(
        this._Model,
        this._prototype,
        this._application,
        cloneValue ? blocks.clone(this.__value__) : this.__value__);
    },

    // TODO: Add a test which adds to the center of the collection or the start
    // startIndex = args.index,
    _onAdding: function (args) {
      var _this = this;
      var ModelType = this._Model;
      var items = args.items;

      blocks.each(items, function (item, index) {
        if (Model.prototype.isPrototypeOf(item)) {
          item = item.dataItem();
        }
        items[index] = new ModelType(item, _this);
      });
    },

    _onChange: function (args) {
      var type = args.type;
      var items = args.items;
      var newItems = [];
      var i = 0;
      var item;

      if (this._internalChanging) {
        return;
      }

      for (; i < items.length; i++) {
        item = items[i];
        if (item && (type == 'remove' || (type == 'add' && item.isNew()))) {
          newItems.push(item.dataItem());
        }
      }

      if (type == 'remove') {
        this._dataSource.data.removeAt(args.index, args.items.length);
      } else if (type == 'add') {
        this._dataSource.data.addMany(newItems);
      }
    },

    _onDataSourceChange: function () {
      this._internalChanging = true;
      this.reset(this._dataSource.data());
      this._internalChanging = false;
      this.clearChanges();
      if (this._view) {
        this._view.trigger('ready');
      }
    }
  };

  /**
   * @namespace View
   */
  function View(application, parentView) {
    var _this = this;

    this._bindContext();
    this._views = [];
    this._application = application;
    this._parentView = parentView || null;
    this._initCalled = false;
    this._html = undefined;

    this.loading = blocks.observable(false);
    this.isActive = blocks.observable(!blocks.has(this.options, 'route'));
    this.isActive.on('changing', function (oldValue, newValue) {
      _this._tryInitialize(newValue);
    });

    if (this.options.preload || this.isActive()) {
      this._load();
    }
  }

  View.prototype = {
    /**
     * Determines if the view is visible or not.
     * This property is automatically populated when routing is enabled for the view.
     *
     * @memberof View
     * @name isActive
     * @type {blocks.observable}
     */

    /**
     * Override the init method to perform actions when the View is first created
     * and shown on the page
     *
     * @memberof View
     * @type {Function}
     *
     * @example {javascript}
     * var App = blocks.Application();
     *
     * App.View('Statistics', {
     *   init: function () {
     *     this.loadRemoteData();
     *   },
     *
     *   loadRemoteData: function () {
     *     // ...stuff...
     *   }
     * });
     */
    init: blocks.noop,

    /**
     * Override the ready method to perform actions when the DOM is ready and
     * all data-query have been executed.
     *
     * @memberof View
     * @type {Function}
     *
     * @example {javascript}
     * var App = blocks.Application();
     *
     * App.View('ContactUs', {
     *   ready: function () {
     *     $('#contact-form').ajaxSubmit();
     *   }
     * });
     */
    ready: blocks.noop,

    /**
     * Override the routed method to perform actions when the View have routing and routing
     * mechanism actives it.
     *
     * @memberof View
     * @type {Function}
     *
     * @example {javascript}
     * var App = blocks.Application();
     *
     * App.View('ContactUs', {
     *   options: {
     *     route: 'contactus'
     *   },
     *
     *   routed: function () {
     *     alert('Navigated to ContactUs page!')
     *   }
     * });
     */
    routed: blocks.noop,

    /**
     * Observable which value is true when the View html
     * is being loaded using ajax request. It could be used
     * to show a loading indicator.
     *
     * @memberof View
     */
    loading: blocks.observable(false),

    /**
     * Gets the parent view.
     * Returns null if the view is not a child of another view.
     *
     * @memberof View
     */
    parentView: function () {
      return this._parentView;
    },

    /**
     * Routes to a specific URL and actives the appropriate views associated with the URL
     *
     * @memberof View
     * @param {String} name -
     * @returns {View} - Chainable. Returns this
     *
     * @example {javascript}
     * var App = blocks.Application();
     *
     * App.View('ContactUs', {
     *   options: {
     *     route: 'contactus'
     *   }
     * });
     *
     * App.View('Navigation', {
     *   navigateToContactUs: function () {
     *     this.route('contactus')
     *   }
     * });
     */
    route: function (/* name */ /*, ...params */) {
      this._application._history.navigate(blocks.toArray(arguments).join('/'));
      return this;
    },

    navigateTo: function (view, params) {
      this._application.navigateTo(view, params);
    },

    _bindContext: function () {
      var key;
      var value;

      for (key in this) {
        value = this[key];

        if (blocks.isObservable(value)) {
          value.__context__ = this;
        } else if (blocks.isFunction(value)) {
          this[key] = blocks.bind(value, this);
        }
      }
    },

    _tryInitialize: function (isActive) {
      if (!this._initialized && isActive) {
        if (this.options.url && !this._html) {
          this._callInit();
          this._load();
        } else {
          this._initialized = true;
          this._callInit();
          if (this.isActive()) {
            this.isActive.update();
          }
        }
      }
    },

    _routed: function (params, metadata) {
      this._tryInitialize(true);
      this.routed(params, metadata);
      blocks.each(this._views, function (view) {
        if (!view.options.route) {
          view._routed(params, metadata);
        }
      });
      this.isActive(true);
    },

    _callInit: function () {
      if (this._initCalled) {
        return;
      }

      var key;
      var value;

      blocks.__viewInInitialize__ = this;
      for (key in this) {
        value = this[key];
        if (blocks.isObservable(value)) {
          value.__context__ = this;
        }
      }
      this.init();
      blocks.__viewInInitialize__ = undefined;
      this._initCalled = true;
    },

    _load: function () {
      var url = this.options.url;
      var serverData = this._application._serverData;

      if (serverData && serverData.views && serverData.views[url]) {
        url = this.options.url = undefined;
        this._tryInitialize(true);
      }

      if (url && !this.loading()) {
        this.loading(true);
        ajax({
          isView: true,
          url: url,
          success: blocks.bind(this._loaded, this),
          error: blocks.bind(this._error, this)
        });
      }
    },

    _loaded: function (html) {
      this._html = html;
      this._tryInitialize(true);
      this.loading(false);
    },

    _error: function () {
      this.loading(false);
    }
  };

  Events.register(View.prototype, ['on', 'off', 'trigger']);

 {
    blocks.debug.addType('View', function (value) {
      if (value && View.prototype.isPrototypeOf(value)) {
        return true;
      }
      return false;
    });
  }  var application;
  blocks.Application = function (options) {
    return (application = application || new Application(options));
  };

  blocks.core.deleteApplication = function () {
    application = undefined;
  };

  /**
   * MVC Application Class
   *
   * @namespace Application
   * @module mvc
   * @param {Object} options - The options for the application
   */
  function Application(options) {
    this._router = new Router(this);
    this._modelPrototypes = {};
    this._collectionPrototypes = {};
    this._viewPrototypes = {};
    this._views = {};
    this._currentRoutedView = undefined;
    this._started = false;
    this.options = blocks.extend({}, this.options, options);
    this._serverData = null;

    this._setDefaults();

    this._prepare();
  }

  Application.prototype = {
    options: {
      history: true
    },

    /**
     * Creates an application property for a Model
     *
     * @memberof Application
     * @param {Object)} property - An object describing the options for the current property
     *
     * @example {javascript}
     *
     * var App = blocks.Application();
     *
     * var User = App.Model({
     *   username: App.Property({
     *     defaultValue: 'John Doe'
     *   })
     * });
     */
    Property: function (property) {
      if (blocks.isString(property)) {
        return function () {
          return this[property]();
        };
      } else {
        property = blocks.extend({}, this.Property.Defaults(), property);
        property = new Property(property);

        return property;
      }
    },

    /**
    * Creates a new Model
    *
    * @memberof Application
    * @param {Object} prototype - the Model object properties that will be created
    * @returns {Model} - the Model type with the specified properties
    * @example {javascript}
    *
    * var App = blocks.Application();
    *
    * var User = App.Model({
    *  firstName: App.Property({
    *   required: true,
    *   validateOnChange: true
    *  }),
    *
    *  lastName: App.Property({
    *   required: true,
    *   validateOnChange: true
    *  }),
    *
    *  fullName: App.Property({
    *    value: function () {
    *      return this.firstName() + ' ' + this.lastName();
    *    }
    *  })
    * });
    *
    * App.View('Profile', {
    *  user: User({
    *    firstName: 'John',
    *    lastName: 'Doe'
    *  })
    * });
    *
    * @example {html}
    * <div data-query="view(Profile)">
    *   <h3>
    *     FullName is: {{user.fullName()}}
    *   </h3>
    * </div>
    *
    * <!-- will result in -->
    * <div data-query="view(Profile)">
    *   <h3>
    *     FullName is: John Doe
    *   </h3>
    * </div>
    */
    Model: function (prototype) {
      var _this = this;
      var ExtendedModel = function (dataItem, collection) {
        if (!Model.prototype.isPrototypeOf(this)) {
          return new ExtendedModel(dataItem, collection);
        }
        this._super([_this, prototype, dataItem, collection]);
      };

      prototype = prototype || {};
      prototype.options = prototype.options || {};

      return blocks.inherit(Model, ExtendedModel, prototype);
    },

    /**
    * Creates a new Collection
    *
    * @memberof Application
    * @param {Object} prototype - The Collection object properties that will be created.
    * @returns {Collection} - The Collection type with the specified properties
    * @example {javascript}
    *
    * var App = blocks.Application();
    *
    * var User = App.Model({
    *  firstName: App.Property({
    *   required: true,
    *   validateOnChange: true
    *  }),
    *
    *  lastName: App.Property({
    *   required: true,
    *   validateOnChange: true
    *  }),
    *
    *  fullName: App.Property({
    *    value: function () {
    *      return this.firstName() + ' ' + this.lastName();
    *    }
    *  })
    * });
    *
    * var Users = App.Collection(User, {
    *   count: App.Property({
    *     value: function () {
    *       return this().length;
    *     }
    *   })
    * });
    *
    * App.View('Profiles', {
    *  users: Users([{
    *     firstName: 'John',
    *     lastName: 'Doe'
    *   }, {
    *     firstName: 'Johna',
    *     lastName: 'Doa'
    *   }])
    * });
    *
    * @example {html}
    * <div data-query="view(Profiles)">
    *   <h2>Total count is {{users.count}}</h2>
    *   <ul data-query="each(users)">
    *     <li>
    *       FullName is: {{fullName()}}
    *     </li>
    *   </ul>
    * </div>
    *
    * <!-- will result in -->
    * <div data-query="view(Profiles)">
    *   <h2>Total count is 2</h2>
    *   <ul data-query="each(users)">
    *     <li>
    *       FullName is: John Doe
    *     </li>
    *     <li>
    *       FullName is: Johna Doa
    *     </li>
    *   </ul>
    * </div>
    */
    Collection: function (ModelType, prototype) {
      var _this = this;
      var ExtendedCollection = function (initialData) {
        if (!Collection.prototype.isPrototypeOf(this)) {
          return new ExtendedCollection(initialData);
        }
        return this._super([ModelType, prototype, _this, initialData]);
      };

      if (!ModelType) {
        ModelType = this.Model();
      } else if (!Model.prototype.isPrototypeOf(ModelType.prototype)) {
        prototype = ModelType;
        ModelType = this.Model();
      }
      prototype = prototype || {};
      prototype.options = prototype.options || {};

      return blocks.inherit(Collection, ExtendedCollection, prototype);
    },

    /**
     * Defines a view that will be part of the Application
     *
     * @memberof Application
     * @param {string} [parentViewName] - Provide this parameter only if you are creating nested views.
     * This is the name of the parent View
     * @param {string} name - The name of the View you are creating
     * @param {Object} prototype - The object that will represent the View
     *
     * @example {javascript}
     * var App = blocks.Application();
     *
     * App.View('Clicker', {
     *   handleClick: function () {
     *     alert('Clicky! Click!');
     *   }
     * });
     *
     * @example {html}
     *
     * <div data-query="view(Clicker)">
     *   <h3><a href="#" data-query="click(handleClick)">Click here!</a></h3>
     * </div>
     */
    View: function (name, prototype, nestedViewPrototype) {
      // TODO: Validate prototype by checking if a property does not override a proto method
      // if the prototype[propertyName] Type eqals the proto[propertyName] Type do not throw error
      if (arguments.length == 1) {
        return this._views[name];
      }
      if (blocks.isString(prototype)) {
        this._viewPrototypes[prototype] = this._createView(nestedViewPrototype);
        nestedViewPrototype.options.parentView = name;
      } else {
        this._viewPrototypes[name] = this._createView(prototype);
      }
    },

    extend: function (obj) {
      blocks.extend(this, obj);
      clonePrototype(obj, this);
      return this;
    },

    navigateTo: function (view, params) {
      if (!view.options.route) {
        return false;
      }
      this._history.navigate(this._router.routeTo(view.options.routeName, params));
      return true;
    },

    start: function (element) {
      if (!this._started) {
        this._started = true;
        this._serverData = window.__blocksServerData__;
        this._createViews();
        blocks.domReady(blocks.bind(this._ready, this, element));
      }
    },

    _prepare: function () {
      blocks.domReady(function () {
        setTimeout(blocks.bind(function () {
          this.start();
        }, this));
      }, this);
    },

    _startHistory: function () {
      this._history = new History(this.options);
      this._history
          .on('urlChange', blocks.bind(this._urlChange, this))
          .start();
    },

    _ready: function (element) {
      this._serverData = window.__blocksServerData__;
      this._startHistory();
      blocks.query(this, element);
      this._viewsReady(this._views);
    },

    _viewsReady: function (views) {
      var callReady = this._callReady;

      blocks.each(views, function (view) {
        if (view.ready !== blocks.noop) {
          if (view.isActive()) {
            callReady(view);
          } else {
            view.isActive.once('change', function () {
              callReady(view);
            });
          }
        }
      });
    },

    _callReady: function (view) {
      if (view.loading()) {
        view.loading.once('change', function () {
          view.ready();
        });
      } else {
        view.ready();
      }
    },

    _urlChange: function (data) {
      var _this = this;
      var currentView = this._currentView;
      var routes = this._router.routeFrom(data.url);
      var found = false;

      blocks.each(routes, function (route) {
        blocks.each(_this._views, function (view) {
          if (view.options.routeName == route.id) {
            if (!currentView && (view.options.initialPreload ||
              (data.initial && _this._serverData && _this.options.history == 'pushState'))) {
              view.options.url = undefined;
            }
            if (currentView && currentView != view) {
              currentView.isActive(false);
            }
            view._routed(route.params, data);
            _this._currentView = view;
            found = true;
            return false;
          }
        });
        if (found) {
          return false;
        }
      });

      if (!found && currentView) {
        currentView.isActive(false);
      }

      return found;
    },

    _createView: function (prototype) {
      prototype.options = blocks.extend({}, this.View.Defaults(), prototype.options);
      // if (prototype.options.route) {
      //   prototype.options.routeName = this._router.registerRoute(prototype.options.route);
      // }

      return blocks.inherit(View, function (application, parentView) {
        this._super([application, parentView]);
      }, prototype);
    },

    _createViews: function () {
      var viewPrototypePairs = blocks.pairs(this._viewPrototypes);
      var views = this._views;
      var viewsInOrder = [];
      var pair;
      var View;
      var parentViewName;
      var currentView;
      var i = 0;

      while (viewPrototypePairs.length !== 0) {
        for (; i < viewPrototypePairs.length; i++) {
          pair = viewPrototypePairs[i];
          View = pair.value;
          parentViewName = View.prototype.options.parentView;
          if (parentViewName) {
            //#region blocks
            if (!this._viewPrototypes[parentViewName]) {
              viewPrototypePairs.splice(i, 1);
              i--;
              throw new Error('View with ' + parentViewName + 'does not exist');
              //TODO: Throw critical error parentView with such name does not exists
            }
            //#endregion
            if (views[parentViewName]) {
              currentView = new View(this, views[parentViewName]);
              views[parentViewName][pair.key] = currentView;
              views[parentViewName]._views.push(currentView);
              if (!currentView.parentView().isActive()) {
                currentView.isActive(false);
              }
              viewPrototypePairs.splice(i, 1);
              i--;
            }
          } else {
            currentView = new View(this);
            this[pair.key] = currentView;
            viewPrototypePairs.splice(i, 1);
            i--;
            parentViewName = undefined;
          }

          if (currentView) {
            if (blocks.has(currentView.options, 'route')) {
              currentView.options.routeName = this._router.registerRoute(
                currentView.options.route, this._getParentRouteName(currentView));
            }
            views[pair.key] = currentView;
            viewsInOrder.push(currentView);
          }
        }
      }

      for (i = 0; i < viewsInOrder.length; i++) {
        viewsInOrder[i]._tryInitialize(viewsInOrder[i].isActive());
      }

      this._viewPrototypes = undefined;
    },

    _getParentRouteName: function (view) {
      while (view) {
        if (view.options.routeName) {
          return view.options.routeName;
        }
        view = view.parentView();
      }
    },

    _setDefaults: function () {
      this.Model.Defaults = blocks.observable({
        options: {}
      }).extend();

      this.Collection.Defaults = blocks.observable({
        options: {}
      }).extend();

      this.Property.Defaults = blocks.observable({
        isObservable: true,
        maxErrors: 1
      }).extend();

      this.View.Defaults = blocks.observable({
        options: { }
      }).extend();
    }
  };





})();// @source-code
  })();

  (function() {
    var toString = blocks.toString;
    blocks.toString = function(value) {
      if (arguments.length === 0) {
        return 'jsblocks - Better MV-ish Framework';
      }
      return toString(value);
    };
  })();
  var _blocks = global.blocks;

  blocks.noConflict = function (deep) {
    if (global.blocks === blocks) {
      global.blocks = _blocks;
    }

    if (deep && global.blocks === blocks) {
      global.blocks = _blocks;
    }

    return blocks;
  };

  if (typeof define === 'function' && define.amd) {
    define('blocks', [], function () {
      return blocks;
    });
  }

  if (noGlobal !== true) {
    global.blocks = blocks;
  }

  return blocks;

}));
