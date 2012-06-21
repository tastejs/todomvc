/*
Hormigas version 1
Copyright (c) 2012, Peter Michaux
All rights reserved.
Licensed under the Simplified BSD License.
https://github.com/petermichaux/hormigas/blob/master/LICENSE
*/
var hormigas = hormigas || {};
(function() {

    var nextId = 0;

    function getId() {
        return nextId++;
    }

    function initSet(set) {
        set._hormigas_ObjectSet_elements = {};
        set.length = 0;
    }

/**

@property hormigas.ObjectSet

@description

A constructor function for creating set objects. ObjectSets are designed
to hold JavaScript objects. They cache a marker on the objects.
Do not attempt to add primitives or host objects in a ObjectSet. This
is a compromise to make ObjectSet objects efficient for use in the model
layer of your application.

When using the set iterators (e.g. forEach, map) do not depend
on the order of iteration of the set's elements. ObjectSets are unordered.

var set = new hormigas.ObjectSet();                         // an empty set

ObjectSets have a length property that is the number of elements in the set.

var alpha = {};
var beta = {};
var set = new hormigas.ObjectSet(alpha, beta, alpha);
set.length; // 2

The methods of an event target object are inspired by the incomplete
Harmony Set proposal and the Array.prototype iterators.

*/
    hormigas.ObjectSet = function() {
        initSet(this);
        for (var i = 0, ilen = arguments.length; i < ilen; i++) {
            this.add(arguments[i]);
        }
    };

/**

@property hormigas.ObjectSet.prototype.has

@parameter element

@description

Returns true if element is in the set. Otherwise returns false.

var alpha = {};
var beta = {};
var set = new hormigas.ObjectSet(alpha);
set.has(alpha); // true
set.has(beta); // false

*/
    hormigas.ObjectSet.prototype.has = function(element) {
        return Object.prototype.hasOwnProperty.call(element, '_hormigas_ObjectSet_id') &&
               Object.prototype.hasOwnProperty.call(this._hormigas_ObjectSet_elements, element._hormigas_ObjectSet_id);
    };

/**

@property hormigas.ObjectSet.prototype.add

@parameter element

@description

If element is not already in the set then adds element to the set
and returns true. Otherwise returns false.

var alpha = {};
var set = new hormigas.ObjectSet();
set.add(alpha); // true
set.has(alpha); // false

*/
    hormigas.ObjectSet.prototype.add = function(element) {
        if (this.has(element)) {
            return false;
        }
        else {
            var id;
            if (!Object.prototype.hasOwnProperty.call(element, '_hormigas_ObjectSet_id')) {
                element._hormigas_ObjectSet_id = getId();
            }
            this._hormigas_ObjectSet_elements[element._hormigas_ObjectSet_id] = element;
            this.length++;
            return true;
        }
    };

/**

@property hormigas.ObjectSet.prototype.delete

@parameter element

@description

If element is in the set then removes element from the set
and returns true. Otherwise returns false.

"delete" is a reserved word and older implementations
did not allow bare reserved words in property name
position so quote "delete".

var alpha = {};
var set = new hormigas.ObjectSet(alpha);
set['delete'](alpha); // true
set['delete'](alpha); // false

*/
    hormigas.ObjectSet.prototype['delete'] = function(element) {
        if (this.has(element)) {
            delete this._hormigas_ObjectSet_elements[element._hormigas_ObjectSet_id];
            this.length--;
            return true;
        }
        else {
            return false;
        }
    };

/**

@property hormigas.ObjectSet.prototype.empty

@description

If the set has elements then removes all the elements and
returns true. Otherwise returns false.

var alpha = {};
var set = new hormigas.ObjectSet(alpha);
set.empty(); // true
set.empty(); // false

*/
    hormigas.ObjectSet.prototype.empty = function() {
        if (this.length > 0) {
            initSet(this);
            return true;
        }
        else {
            return false;
        }
    };

/**

@property hormigas.ObjectSet.prototype.toArray

@description

Returns the elements of the set in a new array.

*/
    hormigas.ObjectSet.prototype.toArray = function() {
        var elements = [];
        for (var p in this._hormigas_ObjectSet_elements) {
            if (Object.prototype.hasOwnProperty.call(this._hormigas_ObjectSet_elements, p)) {
                elements.push(this._hormigas_ObjectSet_elements[p]);
            }
        }
        return elements;
    };

/**

@property hormigas.ObjectSet.prototype.forEach

@parameter callbackfn {function} The function to call for each element in the set.

@parameter thisArg {object} The optional object to use as the this object in calls to callbackfn.

@description

Calls callbackfn for each element of the set.

var alpha = {value: 0};
var beta = {value: 1};
var gamma = {value: 2};
var set = new hormigas.ObjectSet(alpha, beta, gamma);
set.forEach(function(element, set) {
    console.log(element.value);
});

*/
    hormigas.ObjectSet.prototype.forEach = function(callbackfn /*, thisArg */) {
        var thisArg = arguments[1];
        for (var p in this._hormigas_ObjectSet_elements) {
            if (Object.prototype.hasOwnProperty.call(this._hormigas_ObjectSet_elements, p)) {
                callbackfn.call(thisArg, this._hormigas_ObjectSet_elements[p], this);
            }
        }
    };

/**

@property hormigas.ObjectSet.prototype.every

@parameter callbackfn {function} The function to call for each element in the set.

@parameter thisArg {object} The optional object to use as the this object in calls to callbackfn.

@description

Calls callbackfn for each element of the set. If callbackfn returns a truthy value
for all elements then every returns true. Otherwise returns false.

var one = {value: 1};
var two = {value: 2};
var three = {value: 3};
var set = new hormigas.ObjectSet(one, two, three);
set.every(function(element, set) {
    return element.value < 2;
}); // false

*/
    hormigas.ObjectSet.prototype.every = function(callbackfn /*, thisArg */) {
        var thisArg = arguments[1];
        for (var p in this._hormigas_ObjectSet_elements) {
            if (Object.prototype.hasOwnProperty.call(this._hormigas_ObjectSet_elements, p) &&
                !callbackfn.call(thisArg, this._hormigas_ObjectSet_elements[p], this)) {
                return false;
            }
        }
        return true;
    };

/**

@property hormigas.ObjectSet.prototype.some

@parameter callbackfn {function} The function to call for each element in the set.

@parameter thisArg {object} The optional object to use as the this object in calls to callbackfn.

@description

Calls callbackfn for each element of the set. If callbackfn returns a truthy value
for at least one element then some returns true. Otherwise returns false.

var one = {value: 1};
var two = {value: 2};
var three = {value: 3};
var set = new hormigas.ObjectSet(one, two, three);
set.some(function(element, set) {
    return element.value < 2;
}); // true

*/
    hormigas.ObjectSet.prototype.some = function(callbackfn /*, thisArg */) {
        var thisArg = arguments[1];
        for (var p in this._hormigas_ObjectSet_elements) {
            if (Object.prototype.hasOwnProperty.call(this._hormigas_ObjectSet_elements, p) &&
                callbackfn.call(thisArg, this._hormigas_ObjectSet_elements[p], this)) {
                return true;
            }
        }
        return false;
    };

/**

@property hormigas.ObjectSet.prototype.reduce

@parameter callbackfn {function} The function to call for each element in the set.

@parameter initialValue {object} The optional starting value for accumulation.

@description

Calls callbackfn for each element of the set.

For the first call to callbackfn, if initialValue is supplied then initalValue is
the first argument passed to callbackfn and the second argument is the first
element in the set to be iterated. Otherwise the first argument is
the first element to be iterated in the set and the second argument is
the next element to be iterated in the set.

For subsequent calls to callbackfn, the first argument is the value returned
by the last call to callbackfn. The second argument is the next value to be
iterated in the set.

var one = {value: 1};
var two = {value: 2};
var three = {value: 3};
var set = new hormigas.ObjectSet(one, two, three);
set.reduce(function(accumulator, element) {
    return {value: accumulator.value + element.value};
}); // {value:6}
set.reduce(function(accumulator, element) {
    return accumulator + element.value;
}, 4); // 10

*/
    hormigas.ObjectSet.prototype.reduce = function(callbackfn /*, initialValue */) {
        var elements = this.toArray();
        var i = 0;
        var ilen = elements.length;
        var accumulator;
        if (arguments.length > 1) {
            accumulator = arguments[1];
        }
        else if (ilen < 1) {
            throw new TypeError('reduce of empty set with no initial value');
        }
        else {
            i = 1;
            accumulator = elements[0];
        }
        while (i < ilen) {
            accumulator = callbackfn.call(undefined, accumulator, elements[i], this);
            i++;
        }
        return accumulator;
    };

/**

@property hormigas.ObjectSet.prototype.map

@parameter callbackfn {function} The function to call for each element in the set.

@parameter thisArg {object} The optional object to use as the this object in calls to callbackfn.

@description

Calls callbackfn for each element of the set. The values returned by callbackfn
are added to a new array. This new array is the value returned by map.

var alpha = {length: 5};
var beta = {length: 4};
var gamma = {length: 5};
var set = new hormigas.ObjectSet(alpha, beta, gamma);
set.map(function(element) {
    return element.length;
}); // [5,5,4] or [5,4,5] or [4,5,5]

*/
    hormigas.ObjectSet.prototype.map = function(callbackfn /*, thisArg */) {
        var thisArg = arguments[1];
        var result = [];
        for (var p in this._hormigas_ObjectSet_elements) {
            if (Object.prototype.hasOwnProperty.call(this._hormigas_ObjectSet_elements, p)) {
                result.push(callbackfn.call(thisArg, this._hormigas_ObjectSet_elements[p], this));
            }
        }
        return result;
    };

/**

@property hormigas.ObjectSet.prototype.filter

@parameter callbackfn {function} The function to call for each element in the set.

@parameter thisArg {object} The optional object to use as the this object in calls to callbackfn.

@description

Calls callbackfn for each element of the set. If callbackfn returns true
for an element then that element is added to a new array. This new array
is the value returned by filter.

var alpha = {length: 5};
var beta = {length: 4};
var gamma = {length: 5};
var set = new hormigas.ObjectSet(alpha, beta, gamma);
set.filter(function(element) {
    return element.length > 4;
}); // [alpha, gamma] or [gamma, alpha]

*/
    hormigas.ObjectSet.prototype.filter = function(callbackfn /*, thisArg */) {
        var thisArg = arguments[1];
        var result = [];
        for (var p in this._hormigas_ObjectSet_elements) {
            if (Object.prototype.hasOwnProperty.call(this._hormigas_ObjectSet_elements, p)) {
                var element = this._hormigas_ObjectSet_elements[p];
                if (callbackfn.call(thisArg, element, this)) {
                    result.push(element);
                }
            }
        }
        return result;
    };

}());

// insure prototype object is initialized properly
hormigas.ObjectSet.call(hormigas.ObjectSet.prototype);

/**

@property hormigas.ObjectSet.mixin

@parameter obj {object} The object to become a ObjectSet.

@description

Mixes in the ObjectSet methods into any object.

// Example 1

app.MyModel = function() {
    hormigas.ObjectSet.call(this);
};
hormigas.ObjectSet.mixin(app.MyModel.prototype);

// Example 2

var obj = {};
hormigas.ObjectSet.mixin(obj);

*/
hormigas.ObjectSet.mixin = function(obj) {
    for (var p in hormigas.ObjectSet.prototype) {
        if (Object.prototype.hasOwnProperty.call(hormigas.ObjectSet.prototype, p) &&
            (typeof hormigas.ObjectSet.prototype[p] === 'function')) {
            obj[p] = hormigas.ObjectSet.prototype[p];
        }
    }
    hormigas.ObjectSet.call(obj);
};
