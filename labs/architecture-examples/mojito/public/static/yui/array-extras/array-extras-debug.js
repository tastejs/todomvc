/*
YUI 3.7.3 (build 5687)
Copyright 2012 Yahoo! Inc. All rights reserved.
Licensed under the BSD License.
http://yuilibrary.com/license/
*/
YUI.add('array-extras', function (Y, NAME) {

/**
Adds additional utility methods to the `Y.Array` class.

@module collection
@submodule array-extras
**/

var A          = Y.Array,
    L          = Y.Lang,
    ArrayProto = Array.prototype;

/**
Returns the index of the last item in the array that contains the specified
value, or `-1` if the value isn't found.

@method lastIndexOf
@param {Array} a Array to search in.
@param {Any} val Value to search for.
@param {Number} [fromIndex] Index at which to start searching backwards.
  Defaults to the array's length - 1. If negative, it will be taken as an offset
  from the end of the array. If the calculated index is less than 0, the array
  will not be searched and `-1` will be returned.
@return {Number} Index of the item that contains the value, or `-1` if not
  found.
@static
@for Array
**/
A.lastIndexOf = L._isNative(ArrayProto.lastIndexOf) ?
    function(a, val, fromIndex) {
        // An undefined fromIndex is still considered a value by some (all?)
        // native implementations, so we can't pass it unless it's actually
        // specified.
        return fromIndex || fromIndex === 0 ? a.lastIndexOf(val, fromIndex) :
                a.lastIndexOf(val);
    } :
    function(a, val, fromIndex) {
        var len = a.length,
            i   = len - 1;

        if (fromIndex || fromIndex === 0) {
            i = Math.min(fromIndex < 0 ? len + fromIndex : fromIndex, len);
        }

        if (i > -1 && len > 0) {
            for (; i > -1; --i) {
                if (i in a && a[i] === val) {
                    return i;
                }
            }
        }

        return -1;
    };

/**
Returns a copy of the input array with duplicate items removed.

Note: If the input array only contains strings, the `Y.Array.dedupe()` method is
a much faster alternative.

@method unique
@param {Array} array Array to dedupe.
@param {Function} [testFn] Custom function to use to test the equality of two
    values. A truthy return value indicates that the values are equal. A falsy
    return value indicates that the values are not equal.

    @param {Any} testFn.a First value to compare.
    @param {Any} testFn.b Second value to compare.
    @param {Number} testFn.index Index of the current item in the original
        array.
    @param {Array} testFn.array The original array.
    @return {Boolean} _true_ if the items are equal, _false_ otherwise.

@return {Array} Copy of the input array with duplicate items removed.
@static
**/
A.unique = function (array, testFn) {
    var i       = 0,
        len     = array.length,
        results = [],
        j, result, resultLen, value;

    // Note the label here. It's used to jump out of the inner loop when a value
    // is not unique.
    outerLoop: for (; i < len; i++) {
        value = array[i];

        // For each value in the input array, iterate through the result array
        // and check for uniqueness against each result value.
        for (j = 0, resultLen = results.length; j < resultLen; j++) {
            result = results[j];

            // If the test function returns true or there's no test function and
            // the value equals the current result item, stop iterating over the
            // results and continue to the next value in the input array.
            if (testFn) {
                if (testFn.call(array, value, result, i, array)) {
                    continue outerLoop;
                }
            } else if (value === result) {
                continue outerLoop;
            }
        }

        // If we get this far, that means the current value is not already in
        // the result array, so add it.
        results.push(value);
    }

    return results;
};

/**
Executes the supplied function on each item in the array. Returns a new array
containing the items for which the supplied function returned a truthy value.

@method filter
@param {Array} a Array to filter.
@param {Function} f Function to execute on each item.
@param {Object} [o] Optional context object.
@return {Array} Array of items for which the supplied function returned a
  truthy value (empty if it never returned a truthy value).
@static
*/
A.filter = L._isNative(ArrayProto.filter) ?
    function(a, f, o) {
        return ArrayProto.filter.call(a, f, o);
    } :
    function(a, f, o) {
        var i       = 0,
            len     = a.length,
            results = [],
            item;

        for (; i < len; ++i) {
            if (i in a) {
                item = a[i];

                if (f.call(o, item, i, a)) {
                    results.push(item);
                }
            }
        }

        return results;
    };

/**
The inverse of `Array.filter()`. Executes the supplied function on each item.
Returns a new array containing the items for which the supplied function
returned `false`.

@method reject
@param {Array} a the array to iterate.
@param {Function} f the function to execute on each item.
@param {object} [o] Optional context object.
@return {Array} The items for which the supplied function returned `false`.
@static
*/
A.reject = function(a, f, o) {
    return A.filter(a, function(item, i, a) {
        return !f.call(o, item, i, a);
    });
};

/**
Executes the supplied function on each item in the array. Iteration stops if the
supplied function does not return a truthy value.

@method every
@param {Array} a the array to iterate.
@param {Function} f the function to execute on each item.
@param {Object} [o] Optional context object.
@return {Boolean} `true` if every item in the array returns `true` from the
  supplied function, `false` otherwise.
@static
*/
A.every = L._isNative(ArrayProto.every) ?
    function(a, f, o) {
        return ArrayProto.every.call(a, f, o);
    } :
    function(a, f, o) {
        for (var i = 0, l = a.length; i < l; ++i) {
            if (i in a && !f.call(o, a[i], i, a)) {
                return false;
            }
        }

        return true;
    };

/**
Executes the supplied function on each item in the array and returns a new array
containing all the values returned by the supplied function.

@example

    // Convert an array of numbers into an array of strings.
    Y.Array.map([1, 2, 3, 4], function (item) {
      return '' + item;
    });
    // => ['1', '2', '3', '4']

@method map
@param {Array} a the array to iterate.
@param {Function} f the function to execute on each item.
@param {object} [o] Optional context object.
@return {Array} A new array containing the return value of the supplied function
  for each item in the original array.
@static
*/
A.map = L._isNative(ArrayProto.map) ?
    function(a, f, o) {
        return ArrayProto.map.call(a, f, o);
    } :
    function(a, f, o) {
        var i       = 0,
            len     = a.length,
            results = ArrayProto.concat.call(a);

        for (; i < len; ++i) {
            if (i in a) {
                results[i] = f.call(o, a[i], i, a);
            }
        }

        return results;
    };


/**
Executes the supplied function on each item in the array, "folding" the array
into a single value.

@method reduce
@param {Array} a Array to iterate.
@param {Any} init Initial value to start with.
@param {Function} f Function to execute on each item. This function should
  update and return the value of the computation. It will receive the following
  arguments:
    @param {Any} f.previousValue Value returned from the previous iteration,
      or the initial value if this is the first iteration.
    @param {Any} f.currentValue Value of the current item being iterated.
    @param {Number} f.index Index of the current item.
    @param {Array} f.array Array being iterated.
@param {Object} [o] Optional context object.
@return {Any} Final result from iteratively applying the given function to each
  element in the array.
@static
*/
A.reduce = L._isNative(ArrayProto.reduce) ?
    function(a, init, f, o) {
        // ES5 Array.reduce doesn't support a thisObject, so we need to
        // implement it manually.
        return ArrayProto.reduce.call(a, function(init, item, i, a) {
            return f.call(o, init, item, i, a);
        }, init);
    } :
    function(a, init, f, o) {
        var i      = 0,
            len    = a.length,
            result = init;

        for (; i < len; ++i) {
            if (i in a) {
                result = f.call(o, result, a[i], i, a);
            }
        }

        return result;
    };

/**
Executes the supplied function on each item in the array, searching for the
first item that matches the supplied function.

@method find
@param {Array} a the array to search.
@param {Function} f the function to execute on each item. Iteration is stopped
  as soon as this function returns `true`.
@param {Object} [o] Optional context object.
@return {Object} the first item that the supplied function returns `true` for,
  or `null` if it never returns `true`.
@static
*/
A.find = function(a, f, o) {
    for (var i = 0, l = a.length; i < l; i++) {
        if (i in a && f.call(o, a[i], i, a)) {
            return a[i];
        }
    }
    return null;
};

/**
Iterates over an array, returning a new array of all the elements that match the
supplied regular expression.

@method grep
@param {Array} a Array to iterate over.
@param {RegExp} pattern Regular expression to test against each item.
@return {Array} All the items in the array that produce a match against the
  supplied regular expression. If no items match, an empty array is returned.
@static
*/
A.grep = function(a, pattern) {
    return A.filter(a, function(item, index) {
        return pattern.test(item);
    });
};

/**
Partitions an array into two new arrays, one with the items for which the
supplied function returns `true`, and one with the items for which the function
returns `false`.

@method partition
@param {Array} a Array to iterate over.
@param {Function} f Function to execute for each item in the array. It will
  receive the following arguments:
    @param {Any} f.item Current item.
    @param {Number} f.index Index of the current item.
    @param {Array} f.array The array being iterated.
@param {Object} [o] Optional execution context.
@return {Object} An object with two properties: `matches` and `rejects`. Each is
  an array containing the items that were selected or rejected by the test
  function (or an empty array if none).
@static
*/
A.partition = function(a, f, o) {
    var results = {
        matches: [],
        rejects: []
    };

    A.each(a, function(item, index) {
        var set = f.call(o, item, index, a) ? results.matches : results.rejects;
        set.push(item);
    });

    return results;
};

/**
Creates an array of arrays by pairing the corresponding elements of two arrays
together into a new array.

@method zip
@param {Array} a Array to iterate over.
@param {Array} a2 Another array whose values will be paired with values of the
  first array.
@return {Array} An array of arrays formed by pairing each element of the first
  array with an item in the second array having the corresponding index.
@static
*/
A.zip = function(a, a2) {
    var results = [];
    A.each(a, function(item, index) {
        results.push([item, a2[index]]);
    });
    return results;
};

/**
Flattens an array of nested arrays at any abitrary depth into a single, flat
array.

@method flatten
@param {Array} a Array with nested arrays to flatten.
@return {Array} An array whose nested arrays have been flattened.
@static
@since 3.7.0
**/
A.flatten = function(a) {
    var result = [],
        i, len, val;

    // Always return an array.
    if (!a) {
        return result;
    }

    for (i = 0, len = a.length; i < len; ++i) {
        val = a[i];

        if (L.isArray(val)) {
            // Recusively flattens any nested arrays.
            result.push.apply(result, A.flatten(val));
        } else {
            result.push(val);
        }
    }

    return result;
};


}, '3.7.3', {"requires": ["yui-base"]});
