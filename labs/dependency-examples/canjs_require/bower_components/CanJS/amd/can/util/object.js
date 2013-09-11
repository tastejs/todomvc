/*!
* CanJS - 1.1.5 (2013-03-27)
* http://canjs.us/
* Copyright (c) 2013 Bitovi
* Licensed MIT
*/
define(['can/util/library'], function (can) {

    var isArray = can.isArray,
        // essentially returns an object that has all the must have comparisons ...
        // must haves, do not return true when provided undefined
        cleanSet = function (obj, compares) {
            var copy = can.extend({}, obj);
            for (var prop in copy) {
                var compare = compares[prop] === undefined ? compares["*"] : compares[prop];
                if (same(copy[prop], undefined, compare)) {
                    delete copy[prop]
                }
            }
            return copy;
        },
        propCount = function (obj) {
            var count = 0;
            for (var prop in obj) count++;
            return count;
        };

    can.Object = {};

    var same = can.Object.same = function (a, b, compares, aParent, bParent, deep) {
        var aType = typeof a,
            aArray = isArray(a),
            comparesType = typeof compares,
            compare;

        if (comparesType == 'string' || compares === null) {
            compares = compareMethods[compares];
            comparesType = 'function'
        }
        if (comparesType == 'function') {
            return compares(a, b, aParent, bParent)
        }
        compares = compares || {};

        if (a instanceof Date) {
            return a === b;
        }
        if (deep === -1) {
            return aType === 'object' || a === b;
        }
        if (aType !== typeof b || aArray !== isArray(b)) {
            return false;
        }
        if (a === b) {
            return true;
        }
        if (aArray) {
            if (a.length !== b.length) {
                return false;
            }
            for (var i = 0; i < a.length; i++) {
                compare = compares[i] === undefined ? compares["*"] : compares[i]
                if (!same(a[i], b[i], a, b, compare)) {
                    return false;
                }
            };
            return true;
        } else if (aType === "object" || aType === 'function') {
            var bCopy = can.extend({}, b);
            for (var prop in a) {
                compare = compares[prop] === undefined ? compares["*"] : compares[prop];
                if (!same(a[prop], b[prop], compare, a, b, deep === false ? -1 : undefined)) {
                    return false;
                }
                delete bCopy[prop];
            }
            // go through bCopy props ... if there is no compare .. return false
            for (prop in bCopy) {
                if (compares[prop] === undefined || !same(undefined, b[prop], compares[prop], a, b, deep === false ? -1 : undefined)) {
                    return false;
                }
            }
            return true;
        }
        return false;
    };

    can.Object.subsets = function (checkSet, sets, compares) {
        var len = sets.length,
            subsets = [],
            checkPropCount = propCount(checkSet),
            setLength;

        for (var i = 0; i < len; i++) {
            //check this subset
            var set = sets[i];
            if (can.Object.subset(checkSet, set, compares)) {
                subsets.push(set)
            }
        }
        return subsets;
    };

    can.Object.subset = function (subset, set, compares) {
        // go through set {type: 'folder'} and make sure every property
        // is in subset {type: 'folder', parentId :5}
        // then make sure that set has fewer properties
        // make sure we are only checking 'important' properties
        // in subset (ones that have to have a value)
        var setPropCount = 0,
            compares = compares || {};

        for (var prop in set) {

            if (!same(subset[prop], set[prop], compares[prop], subset, set)) {
                return false;
            }
        }
        return true;
    }

    var compareMethods = {
        "null": function () {
            return true;
        },
        i: function (a, b) {
            return ("" + a).toLowerCase() == ("" + b).toLowerCase()
        }
    }

    return can.Object;

});