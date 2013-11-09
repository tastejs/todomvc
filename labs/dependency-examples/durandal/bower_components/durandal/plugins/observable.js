/**
 * Durandal 2.0.1 Copyright (c) 2012 Blue Spire Consulting, Inc. All Rights Reserved.
 * Available via the MIT license.
 * see: http://durandaljs.com or https://github.com/BlueSpire/Durandal for details.
 */
/**
 * Enables automatic observability of plain javascript object for ES5 compatible browsers. Also, converts promise properties into observables that are updated when the promise resolves.
 * @module observable
 * @requires system
 * @requires binder
 * @requires knockout
 */
define(['durandal/system', 'durandal/binder', 'knockout'], function(system, binder, ko) {
    var observableModule,
        toString = Object.prototype.toString,
        nonObservableTypes = ['[object Function]', '[object String]', '[object Boolean]', '[object Number]', '[object Date]', '[object RegExp]'],
        observableArrayMethods = ['remove', 'removeAll', 'destroy', 'destroyAll', 'replace'],
        arrayMethods = ['pop', 'reverse', 'sort', 'shift', 'splice'],
        additiveArrayFunctions = ['push', 'unshift'],
        arrayProto = Array.prototype,
        observableArrayFunctions = ko.observableArray.fn,
        logConversion = false;

    /**
     * You can call observable(obj, propertyName) to get the observable function for the specified property on the object.
     * @class ObservableModule
     */

    function shouldIgnorePropertyName(propertyName){
        var first = propertyName[0];
        return first === '_' || first === '$';
    }

    function isNode(obj) {
        return !!(obj && obj.nodeType !== undefined && system.isNumber(obj.nodeType));
    }

    function canConvertType(value) {
        if (!value || isNode(value) || value.ko === ko || value.jquery) {
            return false;
        }

        var type = toString.call(value);

        return nonObservableTypes.indexOf(type) == -1 && !(value === true || value === false);
    }

    function makeObservableArray(original, observable) {
        var lookup = original.__observable__, notify = true;

        if(lookup && lookup.__full__){
            return;
        }

        lookup = lookup || (original.__observable__ = {});
        lookup.__full__ = true;

        observableArrayMethods.forEach(function(methodName) {
            original[methodName] = function() {
                notify = false;
                var methodCallResult = observableArrayFunctions[methodName].apply(observable, arguments);
                notify = true;
                return methodCallResult;
            };
        });

        arrayMethods.forEach(function(methodName) {
            original[methodName] = function() {
                if(notify){
                    observable.valueWillMutate();
                }

                var methodCallResult = arrayProto[methodName].apply(original, arguments);

                if(notify){
                    observable.valueHasMutated();
                }

                return methodCallResult;
            };
        });

        additiveArrayFunctions.forEach(function(methodName){
            original[methodName] = function() {
                for (var i = 0, len = arguments.length; i < len; i++) {
                    convertObject(arguments[i]);
                }

                if(notify){
                    observable.valueWillMutate();
                }

                var methodCallResult = arrayProto[methodName].apply(original, arguments);

                if(notify){
                    observable.valueHasMutated();
                }

                return methodCallResult;
            };
        });

        original['splice'] = function() {
            for (var i = 2, len = arguments.length; i < len; i++) {
                convertObject(arguments[i]);
            }

            if(notify){
                observable.valueWillMutate();
            }

            var methodCallResult = arrayProto['splice'].apply(original, arguments);

            if(notify){
                observable.valueHasMutated();
            }

            return methodCallResult;
        };

        for (var i = 0, len = original.length; i < len; i++) {
            convertObject(original[i]);
        }
    }

    /**
     * Converts an entire object into an observable object by re-writing its attributes using ES5 getters and setters. Attributes beginning with '_' or '$' are ignored.
     * @method convertObject
     * @param {object} obj The target object to convert.
     */
    function convertObject(obj){
        var lookup, value;

        if(!canConvertType(obj)){
            return;
        }

        lookup = obj.__observable__;

        if(lookup && lookup.__full__){
            return;
        }

        lookup = lookup || (obj.__observable__ = {});
        lookup.__full__ = true;

        if (system.isArray(obj)) {
            var observable = ko.observableArray(obj);
            makeObservableArray(obj, observable);
        } else {
            for (var propertyName in obj) {
                if(shouldIgnorePropertyName(propertyName)){
                    continue;
                }

                if(!lookup[propertyName]){
                    value = obj[propertyName];

                    if(!system.isFunction(value)){
                        convertProperty(obj, propertyName, value);
                    }
                }
            }
        }

        if(logConversion) {
            system.log('Converted', obj);
        }
    }

    function innerSetter(observable, newValue, isArray) {
        var val;
        observable(newValue);
        val = observable.peek();

        //if this was originally an observableArray, then always check to see if we need to add/replace the array methods (if newValue was an entirely new array)
        if (isArray) {
            if (!val) {
                //don't allow null, force to an empty array
                val = [];
                observable(val);
                makeObservableArray(val, observable);
            }
            else if (!val.destroyAll) {
                makeObservableArray(val, observable);
            }
        } else {
            convertObject(val);
        }
    }

    /**
     * Converts a normal property into an observable property using ES5 getters and setters.
     * @method convertProperty
     * @param {object} obj The target object on which the property to convert lives.
     * @param {string} propertyName The name of the property to convert.
     * @param {object} [original] The original value of the property. If not specified, it will be retrieved from the object.
     * @return {KnockoutObservable} The underlying observable.
     */
    function convertProperty(obj, propertyName, original){
        var observable,
            isArray,
            lookup = obj.__observable__ || (obj.__observable__ = {});

        if(original === undefined){
            original = obj[propertyName];
        }

        if (system.isArray(original)) {
            observable = ko.observableArray(original);
            makeObservableArray(original, observable);
            isArray = true;
        } else if (typeof original == "function") {
            if(ko.isObservable(original)){
                observable = original;
            }else{
                return null;
            }
        } else if(system.isPromise(original)) {
            observable = ko.observable();

            original.then(function (result) {
                if(system.isArray(result)) {
                    var oa = ko.observableArray(result);
                    makeObservableArray(result, oa);
                    result = oa;
                }

                observable(result);
            });
        } else {
            observable = ko.observable(original);
            convertObject(original);
        }

        Object.defineProperty(obj, propertyName, {
            configurable: true,
            enumerable: true,
            get: observable,
            set: ko.isWriteableObservable(observable) ? (function (newValue) {
                if (newValue && system.isPromise(newValue)) {
                    newValue.then(function (result) {
                        innerSetter(observable, result, system.isArray(result));
                    });
                } else {
                    innerSetter(observable, newValue, isArray);
                }
            }) : undefined
        });

        lookup[propertyName] = observable;
        return observable;
    }

    /**
     * Defines a computed property using ES5 getters and setters.
     * @method defineProperty
     * @param {object} obj The target object on which to create the property.
     * @param {string} propertyName The name of the property to define.
     * @param {function|object} evaluatorOrOptions The Knockout computed function or computed options object.
     * @return {KnockoutObservable} The underlying computed observable.
     */
    function defineProperty(obj, propertyName, evaluatorOrOptions) {
        var computedOptions = { owner: obj, deferEvaluation: true },
            computed;

        if (typeof evaluatorOrOptions === 'function') {
            computedOptions.read = evaluatorOrOptions;
        } else {
            if ('value' in evaluatorOrOptions) {
                system.error('For defineProperty, you must not specify a "value" for the property. You must provide a "get" function.');
            }

            if (typeof evaluatorOrOptions.get !== 'function') {
                system.error('For defineProperty, the third parameter must be either an evaluator function, or an options object containing a function called "get".');
            }

            computedOptions.read = evaluatorOrOptions.get;
            computedOptions.write = evaluatorOrOptions.set;
        }

        computed = ko.computed(computedOptions);
        obj[propertyName] = computed;

        return convertProperty(obj, propertyName, computed);
    }

    observableModule = function(obj, propertyName){
        var lookup, observable, value;

        if (!obj) {
            return null;
        }

        lookup = obj.__observable__;
        if(lookup){
            observable = lookup[propertyName];
            if(observable){
                return observable;
            }
        }

        value = obj[propertyName];

        if(ko.isObservable(value)){
            return value;
        }

        return convertProperty(obj, propertyName, value);
    };

    observableModule.defineProperty = defineProperty;
    observableModule.convertProperty = convertProperty;
    observableModule.convertObject = convertObject;

    /**
     * Installs the plugin into the view model binder's `beforeBind` hook so that objects are automatically converted before being bound.
     * @method install
     */
    observableModule.install = function(options) {
        var original = binder.binding;

        binder.binding = function(obj, view, instruction) {
            if(instruction.applyBindings && !instruction.skipConversion){
                convertObject(obj);
            }

            original(obj, view);
        };

        logConversion = options.logConversion;
    };

    return observableModule;
});
