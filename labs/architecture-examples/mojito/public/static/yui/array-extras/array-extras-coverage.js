/*
YUI 3.7.3 (build 5687)
Copyright 2012 Yahoo! Inc. All rights reserved.
Licensed under the BSD License.
http://yuilibrary.com/license/
*/
if (typeof _yuitest_coverage == "undefined"){
    _yuitest_coverage = {};
    _yuitest_coverline = function(src, line){
        var coverage = _yuitest_coverage[src];
        if (!coverage.lines[line]){
            coverage.calledLines++;
        }
        coverage.lines[line]++;
    };
    _yuitest_coverfunc = function(src, name, line){
        var coverage = _yuitest_coverage[src],
            funcId = name + ":" + line;
        if (!coverage.functions[funcId]){
            coverage.calledFunctions++;
        }
        coverage.functions[funcId]++;
    };
}
_yuitest_coverage["build/array-extras/array-extras.js"] = {
    lines: {},
    functions: {},
    coveredLines: 0,
    calledLines: 0,
    coveredFunctions: 0,
    calledFunctions: 0,
    path: "build/array-extras/array-extras.js",
    code: []
};
_yuitest_coverage["build/array-extras/array-extras.js"].code=["YUI.add('array-extras', function (Y, NAME) {","","/**","Adds additional utility methods to the `Y.Array` class.","","@module collection","@submodule array-extras","**/","","var A          = Y.Array,","    L          = Y.Lang,","    ArrayProto = Array.prototype;","","/**","Returns the index of the last item in the array that contains the specified","value, or `-1` if the value isn't found.","","@method lastIndexOf","@param {Array} a Array to search in.","@param {Any} val Value to search for.","@param {Number} [fromIndex] Index at which to start searching backwards.","  Defaults to the array's length - 1. If negative, it will be taken as an offset","  from the end of the array. If the calculated index is less than 0, the array","  will not be searched and `-1` will be returned.","@return {Number} Index of the item that contains the value, or `-1` if not","  found.","@static","@for Array","**/","A.lastIndexOf = L._isNative(ArrayProto.lastIndexOf) ?","    function(a, val, fromIndex) {","        // An undefined fromIndex is still considered a value by some (all?)","        // native implementations, so we can't pass it unless it's actually","        // specified.","        return fromIndex || fromIndex === 0 ? a.lastIndexOf(val, fromIndex) :","                a.lastIndexOf(val);","    } :","    function(a, val, fromIndex) {","        var len = a.length,","            i   = len - 1;","","        if (fromIndex || fromIndex === 0) {","            i = Math.min(fromIndex < 0 ? len + fromIndex : fromIndex, len);","        }","","        if (i > -1 && len > 0) {","            for (; i > -1; --i) {","                if (i in a && a[i] === val) {","                    return i;","                }","            }","        }","","        return -1;","    };","","/**","Returns a copy of the input array with duplicate items removed.","","Note: If the input array only contains strings, the `Y.Array.dedupe()` method is","a much faster alternative.","","@method unique","@param {Array} array Array to dedupe.","@param {Function} [testFn] Custom function to use to test the equality of two","    values. A truthy return value indicates that the values are equal. A falsy","    return value indicates that the values are not equal.","","    @param {Any} testFn.a First value to compare.","    @param {Any} testFn.b Second value to compare.","    @param {Number} testFn.index Index of the current item in the original","        array.","    @param {Array} testFn.array The original array.","    @return {Boolean} _true_ if the items are equal, _false_ otherwise.","","@return {Array} Copy of the input array with duplicate items removed.","@static","**/","A.unique = function (array, testFn) {","    var i       = 0,","        len     = array.length,","        results = [],","        j, result, resultLen, value;","","    // Note the label here. It's used to jump out of the inner loop when a value","    // is not unique.","    outerLoop: for (; i < len; i++) {","        value = array[i];","","        // For each value in the input array, iterate through the result array","        // and check for uniqueness against each result value.","        for (j = 0, resultLen = results.length; j < resultLen; j++) {","            result = results[j];","","            // If the test function returns true or there's no test function and","            // the value equals the current result item, stop iterating over the","            // results and continue to the next value in the input array.","            if (testFn) {","                if (testFn.call(array, value, result, i, array)) {","                    continue outerLoop;","                }","            } else if (value === result) {","                continue outerLoop;","            }","        }","","        // If we get this far, that means the current value is not already in","        // the result array, so add it.","        results.push(value);","    }","","    return results;","};","","/**","Executes the supplied function on each item in the array. Returns a new array","containing the items for which the supplied function returned a truthy value.","","@method filter","@param {Array} a Array to filter.","@param {Function} f Function to execute on each item.","@param {Object} [o] Optional context object.","@return {Array} Array of items for which the supplied function returned a","  truthy value (empty if it never returned a truthy value).","@static","*/","A.filter = L._isNative(ArrayProto.filter) ?","    function(a, f, o) {","        return ArrayProto.filter.call(a, f, o);","    } :","    function(a, f, o) {","        var i       = 0,","            len     = a.length,","            results = [],","            item;","","        for (; i < len; ++i) {","            if (i in a) {","                item = a[i];","","                if (f.call(o, item, i, a)) {","                    results.push(item);","                }","            }","        }","","        return results;","    };","","/**","The inverse of `Array.filter()`. Executes the supplied function on each item.","Returns a new array containing the items for which the supplied function","returned `false`.","","@method reject","@param {Array} a the array to iterate.","@param {Function} f the function to execute on each item.","@param {object} [o] Optional context object.","@return {Array} The items for which the supplied function returned `false`.","@static","*/","A.reject = function(a, f, o) {","    return A.filter(a, function(item, i, a) {","        return !f.call(o, item, i, a);","    });","};","","/**","Executes the supplied function on each item in the array. Iteration stops if the","supplied function does not return a truthy value.","","@method every","@param {Array} a the array to iterate.","@param {Function} f the function to execute on each item.","@param {Object} [o] Optional context object.","@return {Boolean} `true` if every item in the array returns `true` from the","  supplied function, `false` otherwise.","@static","*/","A.every = L._isNative(ArrayProto.every) ?","    function(a, f, o) {","        return ArrayProto.every.call(a, f, o);","    } :","    function(a, f, o) {","        for (var i = 0, l = a.length; i < l; ++i) {","            if (i in a && !f.call(o, a[i], i, a)) {","                return false;","            }","        }","","        return true;","    };","","/**","Executes the supplied function on each item in the array and returns a new array","containing all the values returned by the supplied function.","","@example","","    // Convert an array of numbers into an array of strings.","    Y.Array.map([1, 2, 3, 4], function (item) {","      return '' + item;","    });","    // => ['1', '2', '3', '4']","","@method map","@param {Array} a the array to iterate.","@param {Function} f the function to execute on each item.","@param {object} [o] Optional context object.","@return {Array} A new array containing the return value of the supplied function","  for each item in the original array.","@static","*/","A.map = L._isNative(ArrayProto.map) ?","    function(a, f, o) {","        return ArrayProto.map.call(a, f, o);","    } :","    function(a, f, o) {","        var i       = 0,","            len     = a.length,","            results = ArrayProto.concat.call(a);","","        for (; i < len; ++i) {","            if (i in a) {","                results[i] = f.call(o, a[i], i, a);","            }","        }","","        return results;","    };","","","/**","Executes the supplied function on each item in the array, \"folding\" the array","into a single value.","","@method reduce","@param {Array} a Array to iterate.","@param {Any} init Initial value to start with.","@param {Function} f Function to execute on each item. This function should","  update and return the value of the computation. It will receive the following","  arguments:","    @param {Any} f.previousValue Value returned from the previous iteration,","      or the initial value if this is the first iteration.","    @param {Any} f.currentValue Value of the current item being iterated.","    @param {Number} f.index Index of the current item.","    @param {Array} f.array Array being iterated.","@param {Object} [o] Optional context object.","@return {Any} Final result from iteratively applying the given function to each","  element in the array.","@static","*/","A.reduce = L._isNative(ArrayProto.reduce) ?","    function(a, init, f, o) {","        // ES5 Array.reduce doesn't support a thisObject, so we need to","        // implement it manually.","        return ArrayProto.reduce.call(a, function(init, item, i, a) {","            return f.call(o, init, item, i, a);","        }, init);","    } :","    function(a, init, f, o) {","        var i      = 0,","            len    = a.length,","            result = init;","","        for (; i < len; ++i) {","            if (i in a) {","                result = f.call(o, result, a[i], i, a);","            }","        }","","        return result;","    };","","/**","Executes the supplied function on each item in the array, searching for the","first item that matches the supplied function.","","@method find","@param {Array} a the array to search.","@param {Function} f the function to execute on each item. Iteration is stopped","  as soon as this function returns `true`.","@param {Object} [o] Optional context object.","@return {Object} the first item that the supplied function returns `true` for,","  or `null` if it never returns `true`.","@static","*/","A.find = function(a, f, o) {","    for (var i = 0, l = a.length; i < l; i++) {","        if (i in a && f.call(o, a[i], i, a)) {","            return a[i];","        }","    }","    return null;","};","","/**","Iterates over an array, returning a new array of all the elements that match the","supplied regular expression.","","@method grep","@param {Array} a Array to iterate over.","@param {RegExp} pattern Regular expression to test against each item.","@return {Array} All the items in the array that produce a match against the","  supplied regular expression. If no items match, an empty array is returned.","@static","*/","A.grep = function(a, pattern) {","    return A.filter(a, function(item, index) {","        return pattern.test(item);","    });","};","","/**","Partitions an array into two new arrays, one with the items for which the","supplied function returns `true`, and one with the items for which the function","returns `false`.","","@method partition","@param {Array} a Array to iterate over.","@param {Function} f Function to execute for each item in the array. It will","  receive the following arguments:","    @param {Any} f.item Current item.","    @param {Number} f.index Index of the current item.","    @param {Array} f.array The array being iterated.","@param {Object} [o] Optional execution context.","@return {Object} An object with two properties: `matches` and `rejects`. Each is","  an array containing the items that were selected or rejected by the test","  function (or an empty array if none).","@static","*/","A.partition = function(a, f, o) {","    var results = {","        matches: [],","        rejects: []","    };","","    A.each(a, function(item, index) {","        var set = f.call(o, item, index, a) ? results.matches : results.rejects;","        set.push(item);","    });","","    return results;","};","","/**","Creates an array of arrays by pairing the corresponding elements of two arrays","together into a new array.","","@method zip","@param {Array} a Array to iterate over.","@param {Array} a2 Another array whose values will be paired with values of the","  first array.","@return {Array} An array of arrays formed by pairing each element of the first","  array with an item in the second array having the corresponding index.","@static","*/","A.zip = function(a, a2) {","    var results = [];","    A.each(a, function(item, index) {","        results.push([item, a2[index]]);","    });","    return results;","};","","/**","Flattens an array of nested arrays at any abitrary depth into a single, flat","array.","","@method flatten","@param {Array} a Array with nested arrays to flatten.","@return {Array} An array whose nested arrays have been flattened.","@static","@since 3.7.0","**/","A.flatten = function(a) {","    var result = [],","        i, len, val;","","    // Always return an array.","    if (!a) {","        return result;","    }","","    for (i = 0, len = a.length; i < len; ++i) {","        val = a[i];","","        if (L.isArray(val)) {","            // Recusively flattens any nested arrays.","            result.push.apply(result, A.flatten(val));","        } else {","            result.push(val);","        }","    }","","    return result;","};","","","}, '3.7.3', {\"requires\": [\"yui-base\"]});"];
_yuitest_coverage["build/array-extras/array-extras.js"].lines = {"1":0,"10":0,"30":0,"35":0,"39":0,"42":0,"43":0,"46":0,"47":0,"48":0,"49":0,"54":0,"79":0,"80":0,"87":0,"88":0,"92":0,"93":0,"98":0,"99":0,"100":0,"102":0,"103":0,"109":0,"112":0,"127":0,"129":0,"132":0,"137":0,"138":0,"139":0,"141":0,"142":0,"147":0,"162":0,"163":0,"164":0,"180":0,"182":0,"185":0,"186":0,"187":0,"191":0,"214":0,"216":0,"219":0,"223":0,"224":0,"225":0,"229":0,"253":0,"257":0,"258":0,"262":0,"266":0,"267":0,"268":0,"272":0,"288":0,"289":0,"290":0,"291":0,"294":0,"308":0,"309":0,"310":0,"332":0,"333":0,"338":0,"339":0,"340":0,"343":0,"358":0,"359":0,"360":0,"361":0,"363":0,"376":0,"377":0,"381":0,"382":0,"385":0,"386":0,"388":0,"390":0,"392":0,"396":0};
_yuitest_coverage["build/array-extras/array-extras.js"].functions = {"(anonymous 2):31":0,"}:38":0,"unique:79":0,"(anonymous 3):128":0,"}:131":0,"(anonymous 4):163":0,"reject:162":0,"(anonymous 5):181":0,"}:184":0,"(anonymous 6):215":0,"}:218":0,"(anonymous 8):257":0,"(anonymous 7):254":0,"}:261":0,"find:288":0,"(anonymous 9):309":0,"grep:308":0,"(anonymous 10):338":0,"partition:332":0,"(anonymous 11):360":0,"zip:358":0,"flatten:376":0,"(anonymous 1):1":0};
_yuitest_coverage["build/array-extras/array-extras.js"].coveredLines = 87;
_yuitest_coverage["build/array-extras/array-extras.js"].coveredFunctions = 23;
_yuitest_coverline("build/array-extras/array-extras.js", 1);
YUI.add('array-extras', function (Y, NAME) {

/**
Adds additional utility methods to the `Y.Array` class.

@module collection
@submodule array-extras
**/

_yuitest_coverfunc("build/array-extras/array-extras.js", "(anonymous 1)", 1);
_yuitest_coverline("build/array-extras/array-extras.js", 10);
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
_yuitest_coverline("build/array-extras/array-extras.js", 30);
A.lastIndexOf = L._isNative(ArrayProto.lastIndexOf) ?
    function(a, val, fromIndex) {
        // An undefined fromIndex is still considered a value by some (all?)
        // native implementations, so we can't pass it unless it's actually
        // specified.
        _yuitest_coverfunc("build/array-extras/array-extras.js", "(anonymous 2)", 31);
_yuitest_coverline("build/array-extras/array-extras.js", 35);
return fromIndex || fromIndex === 0 ? a.lastIndexOf(val, fromIndex) :
                a.lastIndexOf(val);
    } :
    function(a, val, fromIndex) {
        _yuitest_coverfunc("build/array-extras/array-extras.js", "}", 38);
_yuitest_coverline("build/array-extras/array-extras.js", 39);
var len = a.length,
            i   = len - 1;

        _yuitest_coverline("build/array-extras/array-extras.js", 42);
if (fromIndex || fromIndex === 0) {
            _yuitest_coverline("build/array-extras/array-extras.js", 43);
i = Math.min(fromIndex < 0 ? len + fromIndex : fromIndex, len);
        }

        _yuitest_coverline("build/array-extras/array-extras.js", 46);
if (i > -1 && len > 0) {
            _yuitest_coverline("build/array-extras/array-extras.js", 47);
for (; i > -1; --i) {
                _yuitest_coverline("build/array-extras/array-extras.js", 48);
if (i in a && a[i] === val) {
                    _yuitest_coverline("build/array-extras/array-extras.js", 49);
return i;
                }
            }
        }

        _yuitest_coverline("build/array-extras/array-extras.js", 54);
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
_yuitest_coverline("build/array-extras/array-extras.js", 79);
A.unique = function (array, testFn) {
    _yuitest_coverfunc("build/array-extras/array-extras.js", "unique", 79);
_yuitest_coverline("build/array-extras/array-extras.js", 80);
var i       = 0,
        len     = array.length,
        results = [],
        j, result, resultLen, value;

    // Note the label here. It's used to jump out of the inner loop when a value
    // is not unique.
    _yuitest_coverline("build/array-extras/array-extras.js", 87);
outerLoop: for (; i < len; i++) {
        _yuitest_coverline("build/array-extras/array-extras.js", 88);
value = array[i];

        // For each value in the input array, iterate through the result array
        // and check for uniqueness against each result value.
        _yuitest_coverline("build/array-extras/array-extras.js", 92);
for (j = 0, resultLen = results.length; j < resultLen; j++) {
            _yuitest_coverline("build/array-extras/array-extras.js", 93);
result = results[j];

            // If the test function returns true or there's no test function and
            // the value equals the current result item, stop iterating over the
            // results and continue to the next value in the input array.
            _yuitest_coverline("build/array-extras/array-extras.js", 98);
if (testFn) {
                _yuitest_coverline("build/array-extras/array-extras.js", 99);
if (testFn.call(array, value, result, i, array)) {
                    _yuitest_coverline("build/array-extras/array-extras.js", 100);
continue outerLoop;
                }
            } else {_yuitest_coverline("build/array-extras/array-extras.js", 102);
if (value === result) {
                _yuitest_coverline("build/array-extras/array-extras.js", 103);
continue outerLoop;
            }}
        }

        // If we get this far, that means the current value is not already in
        // the result array, so add it.
        _yuitest_coverline("build/array-extras/array-extras.js", 109);
results.push(value);
    }

    _yuitest_coverline("build/array-extras/array-extras.js", 112);
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
_yuitest_coverline("build/array-extras/array-extras.js", 127);
A.filter = L._isNative(ArrayProto.filter) ?
    function(a, f, o) {
        _yuitest_coverfunc("build/array-extras/array-extras.js", "(anonymous 3)", 128);
_yuitest_coverline("build/array-extras/array-extras.js", 129);
return ArrayProto.filter.call(a, f, o);
    } :
    function(a, f, o) {
        _yuitest_coverfunc("build/array-extras/array-extras.js", "}", 131);
_yuitest_coverline("build/array-extras/array-extras.js", 132);
var i       = 0,
            len     = a.length,
            results = [],
            item;

        _yuitest_coverline("build/array-extras/array-extras.js", 137);
for (; i < len; ++i) {
            _yuitest_coverline("build/array-extras/array-extras.js", 138);
if (i in a) {
                _yuitest_coverline("build/array-extras/array-extras.js", 139);
item = a[i];

                _yuitest_coverline("build/array-extras/array-extras.js", 141);
if (f.call(o, item, i, a)) {
                    _yuitest_coverline("build/array-extras/array-extras.js", 142);
results.push(item);
                }
            }
        }

        _yuitest_coverline("build/array-extras/array-extras.js", 147);
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
_yuitest_coverline("build/array-extras/array-extras.js", 162);
A.reject = function(a, f, o) {
    _yuitest_coverfunc("build/array-extras/array-extras.js", "reject", 162);
_yuitest_coverline("build/array-extras/array-extras.js", 163);
return A.filter(a, function(item, i, a) {
        _yuitest_coverfunc("build/array-extras/array-extras.js", "(anonymous 4)", 163);
_yuitest_coverline("build/array-extras/array-extras.js", 164);
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
_yuitest_coverline("build/array-extras/array-extras.js", 180);
A.every = L._isNative(ArrayProto.every) ?
    function(a, f, o) {
        _yuitest_coverfunc("build/array-extras/array-extras.js", "(anonymous 5)", 181);
_yuitest_coverline("build/array-extras/array-extras.js", 182);
return ArrayProto.every.call(a, f, o);
    } :
    function(a, f, o) {
        _yuitest_coverfunc("build/array-extras/array-extras.js", "}", 184);
_yuitest_coverline("build/array-extras/array-extras.js", 185);
for (var i = 0, l = a.length; i < l; ++i) {
            _yuitest_coverline("build/array-extras/array-extras.js", 186);
if (i in a && !f.call(o, a[i], i, a)) {
                _yuitest_coverline("build/array-extras/array-extras.js", 187);
return false;
            }
        }

        _yuitest_coverline("build/array-extras/array-extras.js", 191);
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
_yuitest_coverline("build/array-extras/array-extras.js", 214);
A.map = L._isNative(ArrayProto.map) ?
    function(a, f, o) {
        _yuitest_coverfunc("build/array-extras/array-extras.js", "(anonymous 6)", 215);
_yuitest_coverline("build/array-extras/array-extras.js", 216);
return ArrayProto.map.call(a, f, o);
    } :
    function(a, f, o) {
        _yuitest_coverfunc("build/array-extras/array-extras.js", "}", 218);
_yuitest_coverline("build/array-extras/array-extras.js", 219);
var i       = 0,
            len     = a.length,
            results = ArrayProto.concat.call(a);

        _yuitest_coverline("build/array-extras/array-extras.js", 223);
for (; i < len; ++i) {
            _yuitest_coverline("build/array-extras/array-extras.js", 224);
if (i in a) {
                _yuitest_coverline("build/array-extras/array-extras.js", 225);
results[i] = f.call(o, a[i], i, a);
            }
        }

        _yuitest_coverline("build/array-extras/array-extras.js", 229);
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
_yuitest_coverline("build/array-extras/array-extras.js", 253);
A.reduce = L._isNative(ArrayProto.reduce) ?
    function(a, init, f, o) {
        // ES5 Array.reduce doesn't support a thisObject, so we need to
        // implement it manually.
        _yuitest_coverfunc("build/array-extras/array-extras.js", "(anonymous 7)", 254);
_yuitest_coverline("build/array-extras/array-extras.js", 257);
return ArrayProto.reduce.call(a, function(init, item, i, a) {
            _yuitest_coverfunc("build/array-extras/array-extras.js", "(anonymous 8)", 257);
_yuitest_coverline("build/array-extras/array-extras.js", 258);
return f.call(o, init, item, i, a);
        }, init);
    } :
    function(a, init, f, o) {
        _yuitest_coverfunc("build/array-extras/array-extras.js", "}", 261);
_yuitest_coverline("build/array-extras/array-extras.js", 262);
var i      = 0,
            len    = a.length,
            result = init;

        _yuitest_coverline("build/array-extras/array-extras.js", 266);
for (; i < len; ++i) {
            _yuitest_coverline("build/array-extras/array-extras.js", 267);
if (i in a) {
                _yuitest_coverline("build/array-extras/array-extras.js", 268);
result = f.call(o, result, a[i], i, a);
            }
        }

        _yuitest_coverline("build/array-extras/array-extras.js", 272);
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
_yuitest_coverline("build/array-extras/array-extras.js", 288);
A.find = function(a, f, o) {
    _yuitest_coverfunc("build/array-extras/array-extras.js", "find", 288);
_yuitest_coverline("build/array-extras/array-extras.js", 289);
for (var i = 0, l = a.length; i < l; i++) {
        _yuitest_coverline("build/array-extras/array-extras.js", 290);
if (i in a && f.call(o, a[i], i, a)) {
            _yuitest_coverline("build/array-extras/array-extras.js", 291);
return a[i];
        }
    }
    _yuitest_coverline("build/array-extras/array-extras.js", 294);
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
_yuitest_coverline("build/array-extras/array-extras.js", 308);
A.grep = function(a, pattern) {
    _yuitest_coverfunc("build/array-extras/array-extras.js", "grep", 308);
_yuitest_coverline("build/array-extras/array-extras.js", 309);
return A.filter(a, function(item, index) {
        _yuitest_coverfunc("build/array-extras/array-extras.js", "(anonymous 9)", 309);
_yuitest_coverline("build/array-extras/array-extras.js", 310);
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
_yuitest_coverline("build/array-extras/array-extras.js", 332);
A.partition = function(a, f, o) {
    _yuitest_coverfunc("build/array-extras/array-extras.js", "partition", 332);
_yuitest_coverline("build/array-extras/array-extras.js", 333);
var results = {
        matches: [],
        rejects: []
    };

    _yuitest_coverline("build/array-extras/array-extras.js", 338);
A.each(a, function(item, index) {
        _yuitest_coverfunc("build/array-extras/array-extras.js", "(anonymous 10)", 338);
_yuitest_coverline("build/array-extras/array-extras.js", 339);
var set = f.call(o, item, index, a) ? results.matches : results.rejects;
        _yuitest_coverline("build/array-extras/array-extras.js", 340);
set.push(item);
    });

    _yuitest_coverline("build/array-extras/array-extras.js", 343);
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
_yuitest_coverline("build/array-extras/array-extras.js", 358);
A.zip = function(a, a2) {
    _yuitest_coverfunc("build/array-extras/array-extras.js", "zip", 358);
_yuitest_coverline("build/array-extras/array-extras.js", 359);
var results = [];
    _yuitest_coverline("build/array-extras/array-extras.js", 360);
A.each(a, function(item, index) {
        _yuitest_coverfunc("build/array-extras/array-extras.js", "(anonymous 11)", 360);
_yuitest_coverline("build/array-extras/array-extras.js", 361);
results.push([item, a2[index]]);
    });
    _yuitest_coverline("build/array-extras/array-extras.js", 363);
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
_yuitest_coverline("build/array-extras/array-extras.js", 376);
A.flatten = function(a) {
    _yuitest_coverfunc("build/array-extras/array-extras.js", "flatten", 376);
_yuitest_coverline("build/array-extras/array-extras.js", 377);
var result = [],
        i, len, val;

    // Always return an array.
    _yuitest_coverline("build/array-extras/array-extras.js", 381);
if (!a) {
        _yuitest_coverline("build/array-extras/array-extras.js", 382);
return result;
    }

    _yuitest_coverline("build/array-extras/array-extras.js", 385);
for (i = 0, len = a.length; i < len; ++i) {
        _yuitest_coverline("build/array-extras/array-extras.js", 386);
val = a[i];

        _yuitest_coverline("build/array-extras/array-extras.js", 388);
if (L.isArray(val)) {
            // Recusively flattens any nested arrays.
            _yuitest_coverline("build/array-extras/array-extras.js", 390);
result.push.apply(result, A.flatten(val));
        } else {
            _yuitest_coverline("build/array-extras/array-extras.js", 392);
result.push(val);
        }
    }

    _yuitest_coverline("build/array-extras/array-extras.js", 396);
return result;
};


}, '3.7.3', {"requires": ["yui-base"]});
