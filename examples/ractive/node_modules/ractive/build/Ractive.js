/*
	
	Ractive - v0.3.9 - 2013-12-31
	==============================================================

	Next-generation DOM manipulation - http://ractivejs.org
	Follow @RactiveJS for updates

	--------------------------------------------------------------

	Copyright 2013 2013 Rich Harris and contributors

	Permission is hereby granted, free of charge, to any person
	obtaining a copy of this software and associated documentation
	files (the "Software"), to deal in the Software without
	restriction, including without limitation the rights to use,
	copy, modify, merge, publish, distribute, sublicense, and/or sell
	copies of the Software, and to permit persons to whom the
	Software is furnished to do so, subject to the following
	conditions:

	The above copyright notice and this permission notice shall be
	included in all copies or substantial portions of the Software.

	THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
	EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES
	OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
	NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT
	HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY,
	WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING
	FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR
	OTHER DEALINGS IN THE SOFTWARE.

*/

(function ( global ) {



var config_svg = function () {
        
        if (typeof document === 'undefined') {
            return;
        }
        return document && document.implementation.hasFeature('http://www.w3.org/TR/SVG11/feature#BasicStructure', '1.1');
    }();
var utils_create = function () {
        
        var create;
        try {
            Object.create(null);
            create = Object.create;
        } catch (err) {
            create = function () {
                var F = function () {
                };
                return function (proto, props) {
                    var obj;
                    if (proto === null) {
                        return {};
                    }
                    F.prototype = proto;
                    obj = new F();
                    if (props) {
                        Object.defineProperties(obj, props);
                    }
                    return obj;
                };
            }();
        }
        return create;
    }();
var config_namespaces = {
        html: 'http://www.w3.org/1999/xhtml',
        mathml: 'http://www.w3.org/1998/Math/MathML',
        svg: 'http://www.w3.org/2000/svg',
        xlink: 'http://www.w3.org/1999/xlink',
        xml: 'http://www.w3.org/XML/1998/namespace',
        xmlns: 'http://www.w3.org/2000/xmlns/'
    };
var utils_createElement = function (svg, namespaces) {
        
        if (!svg) {
            return function (type, ns) {
                if (ns && ns !== namespaces.html) {
                    throw 'This browser does not support namespaces other than http://www.w3.org/1999/xhtml. The most likely cause of this error is that you\'re trying to render SVG in an older browser. See https://github.com/RactiveJS/Ractive/wiki/SVG-and-older-browsers for more information';
                }
                return document.createElement(type);
            };
        } else {
            return function (type, ns) {
                if (!ns) {
                    return document.createElement(type);
                }
                return document.createElementNS(ns, type);
            };
        }
    }(config_svg, config_namespaces);
var config_isClient = function () {
        
        if (typeof document === 'object') {
            return true;
        }
        return false;
    }();
var utils_defineProperty = function (isClient) {
        
        try {
            Object.defineProperty({}, 'test', { value: 0 });
            if (isClient) {
                Object.defineProperty(document.createElement('div'), 'test', { value: 0 });
            }
            return Object.defineProperty;
        } catch (err) {
            return function (obj, prop, desc) {
                obj[prop] = desc.value;
            };
        }
    }(config_isClient);
var utils_defineProperties = function (createElement, defineProperty, isClient) {
        
        try {
            try {
                Object.defineProperties({}, { test: { value: 0 } });
            } catch (err) {
                throw err;
            }
            if (isClient) {
                Object.defineProperties(createElement('div'), { test: { value: 0 } });
            }
            return Object.defineProperties;
        } catch (err) {
            return function (obj, props) {
                var prop;
                for (prop in props) {
                    if (props.hasOwnProperty(prop)) {
                        defineProperty(obj, prop, props[prop]);
                    }
                }
            };
        }
    }(utils_createElement, utils_defineProperty, config_isClient);
var utils_normaliseKeypath = function () {
        
        var regex = /\[\s*(\*|[0-9]|[1-9][0-9]+)\s*\]/g;
        return function (keypath) {
            return (keypath || '').replace(regex, '.$1');
        };
    }();
var registries_adaptors = {};
var config_types = {
        TEXT: 1,
        INTERPOLATOR: 2,
        TRIPLE: 3,
        SECTION: 4,
        INVERTED: 5,
        CLOSING: 6,
        ELEMENT: 7,
        PARTIAL: 8,
        COMMENT: 9,
        DELIMCHANGE: 10,
        MUSTACHE: 11,
        TAG: 12,
        ATTRIBUTE: 13,
        COMPONENT: 15,
        NUMBER_LITERAL: 20,
        STRING_LITERAL: 21,
        ARRAY_LITERAL: 22,
        OBJECT_LITERAL: 23,
        BOOLEAN_LITERAL: 24,
        GLOBAL: 26,
        KEY_VALUE_PAIR: 27,
        REFERENCE: 30,
        REFINEMENT: 31,
        MEMBER: 32,
        PREFIX_OPERATOR: 33,
        BRACKETED: 34,
        CONDITIONAL: 35,
        INFIX_OPERATOR: 36,
        INVOCATION: 40
    };
var utils_isArray = function () {
        
        var toString = Object.prototype.toString;
        return function (thing) {
            return toString.call(thing) === '[object Array]';
        };
    }();
var shared_clearCache = function () {
        
        return function clearCache(ractive, keypath) {
            var cacheMap, wrappedProperty;
            if (wrappedProperty = ractive._wrapped[keypath]) {
                if (wrappedProperty.teardown() !== false) {
                    ractive._wrapped[keypath] = null;
                }
            }
            ractive._cache[keypath] = undefined;
            if (cacheMap = ractive._cacheMap[keypath]) {
                while (cacheMap.length) {
                    clearCache(ractive, cacheMap.pop());
                }
            }
        };
    }();
var shared_getValueFromCheckboxes = function () {
        
        return function (ractive, keypath) {
            var value, checkboxes, checkbox, len, i, rootEl;
            value = [];
            rootEl = ractive.rendered ? ractive.el : ractive.fragment.docFrag;
            checkboxes = rootEl.querySelectorAll('input[type="checkbox"][name="{{' + keypath + '}}"]');
            len = checkboxes.length;
            for (i = 0; i < len; i += 1) {
                checkbox = checkboxes[i];
                if (checkbox.hasAttribute('checked') || checkbox.checked) {
                    value[value.length] = checkbox._ractive.value;
                }
            }
            return value;
        };
    }();
var shared_preDomUpdate = function (getValueFromCheckboxes) {
        
        return function (ractive) {
            var deferred, evaluator, selectValue, attribute, keypath, radio;
            deferred = ractive._deferred;
            while (evaluator = deferred.evals.pop()) {
                evaluator.update().deferred = false;
            }
            while (selectValue = deferred.selectValues.pop()) {
                selectValue.deferredUpdate();
            }
            while (attribute = deferred.attrs.pop()) {
                attribute.update().deferred = false;
            }
            while (keypath = deferred.checkboxes.pop()) {
                ractive.set(keypath, getValueFromCheckboxes(ractive, keypath));
            }
            while (radio = deferred.radios.pop()) {
                radio.update();
            }
        };
    }(shared_getValueFromCheckboxes);
var shared_postDomUpdate = function () {
        
        return function (ractive) {
            var deferred, focusable, query, decorator, transition, observer;
            deferred = ractive._deferred;
            if (focusable = deferred.focusable) {
                focusable.focus();
                deferred.focusable = null;
            }
            while (query = deferred.liveQueries.pop()) {
                query._sort();
            }
            while (decorator = deferred.decorators.pop()) {
                decorator.init();
            }
            while (transition = deferred.transitions.pop()) {
                transition.init();
            }
            while (observer = deferred.observers.pop()) {
                observer.update();
            }
        };
    }();
var shared_makeTransitionManager = function () {
        
        var makeTransitionManager = function (root, callback) {
            var transitionManager, elementsToDetach, detachNodes, nodeHasNoTransitioningChildren;
            if (root._parent && root._parent._transitionManager) {
                return root._parent._transitionManager;
            }
            elementsToDetach = [];
            detachNodes = function () {
                var i, element;
                i = elementsToDetach.length;
                while (i--) {
                    element = elementsToDetach[i];
                    if (nodeHasNoTransitioningChildren(element.node)) {
                        element.detach();
                        elementsToDetach.splice(i, 1);
                    }
                }
            };
            nodeHasNoTransitioningChildren = function (node) {
                var i, candidate;
                i = transitionManager.active.length;
                while (i--) {
                    candidate = transitionManager.active[i];
                    if (node.contains(candidate)) {
                        return false;
                    }
                }
                return true;
            };
            transitionManager = {
                active: [],
                push: function (node) {
                    transitionManager.active[transitionManager.active.length] = node;
                },
                pop: function (node) {
                    var index;
                    index = transitionManager.active.indexOf(node);
                    if (index === -1) {
                        return;
                    }
                    transitionManager.active.splice(index, 1);
                    detachNodes();
                    if (!transitionManager.active.length && transitionManager._ready) {
                        transitionManager.complete();
                    }
                },
                complete: function () {
                    if (callback) {
                        callback.call(root);
                    }
                },
                ready: function () {
                    detachNodes();
                    transitionManager._ready = true;
                    if (!transitionManager.active.length) {
                        transitionManager.complete();
                    }
                },
                detachWhenReady: function (element) {
                    elementsToDetach[elementsToDetach.length] = element;
                }
            };
            return transitionManager;
        };
        return makeTransitionManager;
    }();
var shared_notifyDependants = function () {
        
        var notifyDependants, lastKey, starMaps = {};
        lastKey = /[^\.]+$/;
        notifyDependants = function (ractive, keypath, onlyDirect) {
            var i;
            if (ractive._patternObservers.length) {
                notifyPatternObservers(ractive, keypath, keypath, onlyDirect, true);
            }
            for (i = 0; i < ractive._deps.length; i += 1) {
                notifyDependantsAtPriority(ractive, keypath, i, onlyDirect);
            }
        };
        notifyDependants.multiple = function (ractive, keypaths, onlyDirect) {
            var i, j, len;
            len = keypaths.length;
            if (ractive._patternObservers.length) {
                i = len;
                while (i--) {
                    notifyPatternObservers(ractive, keypaths[i], keypaths[i], onlyDirect, true);
                }
            }
            for (i = 0; i < ractive._deps.length; i += 1) {
                if (ractive._deps[i]) {
                    j = len;
                    while (j--) {
                        notifyDependantsAtPriority(ractive, keypaths[j], i, onlyDirect);
                    }
                }
            }
        };
        return notifyDependants;
        function notifyDependantsAtPriority(ractive, keypath, priority, onlyDirect) {
            var depsByKeypath = ractive._deps[priority];
            if (!depsByKeypath) {
                return;
            }
            updateAll(depsByKeypath[keypath]);
            if (onlyDirect) {
                return;
            }
            cascade(ractive._depsMap[keypath], ractive, priority);
        }
        function updateAll(deps) {
            var i, len;
            if (deps) {
                len = deps.length;
                for (i = 0; i < len; i += 1) {
                    deps[i].update();
                }
            }
        }
        function cascade(childDeps, ractive, priority, onlyDirect) {
            var i;
            if (childDeps) {
                i = childDeps.length;
                while (i--) {
                    notifyDependantsAtPriority(ractive, childDeps[i], priority, onlyDirect);
                }
            }
        }
        function notifyPatternObservers(ractive, registeredKeypath, actualKeypath, isParentOfChangedKeypath, isTopLevelCall) {
            var i, patternObserver, children, child, key, childActualKeypath, potentialWildcardMatches, cascade;
            i = ractive._patternObservers.length;
            while (i--) {
                patternObserver = ractive._patternObservers[i];
                if (patternObserver.regex.test(actualKeypath)) {
                    patternObserver.update(actualKeypath);
                }
            }
            if (isParentOfChangedKeypath) {
                return;
            }
            cascade = function (keypath) {
                if (children = ractive._depsMap[keypath]) {
                    i = children.length;
                    while (i--) {
                        child = children[i];
                        key = lastKey.exec(child)[0];
                        childActualKeypath = actualKeypath + '.' + key;
                        notifyPatternObservers(ractive, child, childActualKeypath);
                    }
                }
            };
            if (isTopLevelCall) {
                potentialWildcardMatches = getPotentialWildcardMatches(actualKeypath);
                potentialWildcardMatches.forEach(cascade);
            } else {
                cascade(registeredKeypath);
            }
        }
        function getPotentialWildcardMatches(keypath) {
            var keys, starMap, mapper, i, result, wildcardKeypath;
            keys = keypath.split('.');
            starMap = getStarMap(keys.length);
            result = [];
            mapper = function (star, i) {
                return star ? '*' : keys[i];
            };
            i = starMap.length;
            while (i--) {
                wildcardKeypath = starMap[i].map(mapper).join('.');
                if (!result[wildcardKeypath]) {
                    result[result.length] = wildcardKeypath;
                    result[wildcardKeypath] = true;
                }
            }
            return result;
        }
        function getStarMap(num) {
            var ones = '', max, binary, starMap, mapper, i;
            if (!starMaps[num]) {
                starMap = [];
                while (ones.length < num) {
                    ones += 1;
                }
                max = parseInt(ones, 2);
                mapper = function (digit) {
                    return digit === '1';
                };
                for (i = 0; i <= max; i += 1) {
                    binary = i.toString(2);
                    while (binary.length < num) {
                        binary = '0' + binary;
                    }
                    starMap[i] = Array.prototype.map.call(binary, mapper);
                }
                starMaps[num] = starMap;
            }
            return starMaps[num];
        }
    }();
var Ractive_prototype_get_arrayAdaptor = function (types, defineProperty, isArray, clearCache, preDomUpdate, postDomUpdate, makeTransitionManager, notifyDependants) {
        
        var arrayAdaptor, notifyArrayDependants, ArrayWrapper, patchArrayMethods, unpatchArrayMethods, patchedArrayProto, testObj, mutatorMethods, noop, errorMessage;
        arrayAdaptor = {
            filter: function (object) {
                return isArray(object) && (!object._ractive || !object._ractive.setting);
            },
            wrap: function (ractive, array, keypath) {
                return new ArrayWrapper(ractive, array, keypath);
            }
        };
        ArrayWrapper = function (ractive, array, keypath) {
            this.root = ractive;
            this.value = array;
            this.keypath = keypath;
            if (!array._ractive) {
                defineProperty(array, '_ractive', {
                    value: {
                        wrappers: [],
                        instances: [],
                        setting: false
                    },
                    configurable: true
                });
                patchArrayMethods(array);
            }
            if (!array._ractive.instances[ractive._guid]) {
                array._ractive.instances[ractive._guid] = 0;
                array._ractive.instances.push(ractive);
            }
            array._ractive.instances[ractive._guid] += 1;
            array._ractive.wrappers.push(this);
        };
        ArrayWrapper.prototype = {
            get: function () {
                return this.value;
            },
            teardown: function () {
                var array, storage, wrappers, instances, index;
                array = this.value;
                storage = array._ractive;
                wrappers = storage.wrappers;
                instances = storage.instances;
                if (storage.setting) {
                    return false;
                }
                index = wrappers.indexOf(this);
                if (index === -1) {
                    throw new Error(errorMessage);
                }
                wrappers.splice(index, 1);
                if (!wrappers.length) {
                    delete array._ractive;
                    unpatchArrayMethods(this.value);
                } else {
                    instances[this.root._guid] -= 1;
                    if (!instances[this.root._guid]) {
                        index = instances.indexOf(this.root);
                        if (index === -1) {
                            throw new Error(errorMessage);
                        }
                        instances.splice(index, 1);
                    }
                }
            }
        };
        notifyArrayDependants = function (array, methodName, args) {
            var notifyKeypathDependants, queueDependants, wrappers, wrapper, i;
            notifyKeypathDependants = function (root, keypath) {
                var depsByKeypath, deps, keys, upstreamQueue, smartUpdateQueue, dumbUpdateQueue, i, changed, start, end, childKeypath, lengthUnchanged;
                if (methodName === 'sort' || methodName === 'reverse') {
                    root.set(keypath, array);
                    return;
                }
                clearCache(root, keypath);
                smartUpdateQueue = [];
                dumbUpdateQueue = [];
                for (i = 0; i < root._deps.length; i += 1) {
                    depsByKeypath = root._deps[i];
                    if (!depsByKeypath) {
                        continue;
                    }
                    deps = depsByKeypath[keypath];
                    if (deps) {
                        queueDependants(keypath, deps, smartUpdateQueue, dumbUpdateQueue);
                        preDomUpdate(root);
                        while (smartUpdateQueue.length) {
                            smartUpdateQueue.pop().smartUpdate(methodName, args);
                        }
                        while (dumbUpdateQueue.length) {
                            dumbUpdateQueue.pop().update();
                        }
                    }
                }
                if (methodName === 'splice' && args.length > 2 && args[1]) {
                    changed = Math.min(args[1], args.length - 2);
                    start = args[0];
                    end = start + changed;
                    if (args[1] === args.length - 2) {
                        lengthUnchanged = true;
                    }
                    for (i = start; i < end; i += 1) {
                        childKeypath = keypath + '.' + i;
                        notifyDependants(root, childKeypath);
                    }
                }
                preDomUpdate(root);
                upstreamQueue = [];
                keys = keypath.split('.');
                while (keys.length) {
                    keys.pop();
                    upstreamQueue[upstreamQueue.length] = keys.join('.');
                }
                notifyDependants.multiple(root, upstreamQueue, true);
                if (!lengthUnchanged) {
                    notifyDependants(root, keypath + '.length', true);
                }
            };
            queueDependants = function (keypath, deps, smartUpdateQueue, dumbUpdateQueue) {
                var k, dependant;
                k = deps.length;
                while (k--) {
                    dependant = deps[k];
                    if (dependant.type === types.REFERENCE) {
                        dependant.update();
                    } else if (dependant.keypath === keypath && dependant.type === types.SECTION && !dependant.inverted && dependant.docFrag) {
                        smartUpdateQueue[smartUpdateQueue.length] = dependant;
                    } else {
                        dumbUpdateQueue[dumbUpdateQueue.length] = dependant;
                    }
                }
            };
            wrappers = array._ractive.wrappers;
            i = wrappers.length;
            while (i--) {
                wrapper = wrappers[i];
                notifyKeypathDependants(wrapper.root, wrapper.keypath);
            }
        };
        patchedArrayProto = [];
        mutatorMethods = [
            'pop',
            'push',
            'reverse',
            'shift',
            'sort',
            'splice',
            'unshift'
        ];
        noop = function () {
        };
        mutatorMethods.forEach(function (methodName) {
            var method = function () {
                var result, instances, instance, i, previousTransitionManagers = {}, transitionManagers = {};
                result = Array.prototype[methodName].apply(this, arguments);
                instances = this._ractive.instances;
                i = instances.length;
                while (i--) {
                    instance = instances[i];
                    previousTransitionManagers[instance._guid] = instance._transitionManager;
                    instance._transitionManager = transitionManagers[instance._guid] = makeTransitionManager(instance, noop);
                }
                this._ractive.setting = true;
                notifyArrayDependants(this, methodName, arguments);
                this._ractive.setting = false;
                i = instances.length;
                while (i--) {
                    instance = instances[i];
                    instance._transitionManager = previousTransitionManagers[instance._guid];
                    transitionManagers[instance._guid].ready();
                    preDomUpdate(instance);
                    postDomUpdate(instance);
                }
                return result;
            };
            defineProperty(patchedArrayProto, methodName, { value: method });
        });
        testObj = {};
        if (testObj.__proto__) {
            patchArrayMethods = function (array) {
                array.__proto__ = patchedArrayProto;
            };
            unpatchArrayMethods = function (array) {
                array.__proto__ = Array.prototype;
            };
        } else {
            patchArrayMethods = function (array) {
                var i, methodName;
                i = mutatorMethods.length;
                while (i--) {
                    methodName = mutatorMethods[i];
                    defineProperty(array, methodName, {
                        value: patchedArrayProto[methodName],
                        configurable: true
                    });
                }
            };
            unpatchArrayMethods = function (array) {
                var i;
                i = mutatorMethods.length;
                while (i--) {
                    delete array[mutatorMethods[i]];
                }
            };
        }
        errorMessage = 'Something went wrong in a rather interesting way';
        return arrayAdaptor;
    }(config_types, utils_defineProperty, utils_isArray, shared_clearCache, shared_preDomUpdate, shared_postDomUpdate, shared_makeTransitionManager, shared_notifyDependants);
var Ractive_prototype_get_magicAdaptor = function () {
        
        var magicAdaptor, MagicWrapper;
        try {
            Object.defineProperty({}, 'test', { value: 0 });
        } catch (err) {
            return false;
        }
        magicAdaptor = {
            filter: function (object, keypath) {
                return !!keypath;
            },
            wrap: function (ractive, object, keypath) {
                return new MagicWrapper(ractive, object, keypath);
            }
        };
        MagicWrapper = function (ractive, object, keypath) {
            var wrapper = this, keys, prop, objKeypath, descriptor, wrappers, oldGet, oldSet, get, set;
            this.ractive = ractive;
            this.keypath = keypath;
            keys = keypath.split('.');
            this.prop = keys.pop();
            objKeypath = keys.join('.');
            this.obj = objKeypath ? ractive.get(objKeypath) : ractive.data;
            descriptor = this.originalDescriptor = Object.getOwnPropertyDescriptor(this.obj, this.prop);
            if (descriptor && descriptor.set && (wrappers = descriptor.set._ractiveWrappers)) {
                if (wrappers.indexOf(this) === -1) {
                    wrappers.push(this);
                }
                return;
            }
            if (descriptor && !descriptor.configurable) {
                throw new Error('Cannot use magic mode with property "' + prop + '" - object is not configurable');
            }
            if (descriptor) {
                this.value = descriptor.value;
                oldGet = descriptor.get;
                oldSet = descriptor.set;
            }
            get = oldGet || function () {
                return wrapper.value;
            };
            set = function (value) {
                var wrappers, wrapper, i;
                if (oldSet) {
                    oldSet(value);
                }
                wrappers = set._ractiveWrappers;
                i = wrappers.length;
                while (i--) {
                    wrapper = wrappers[i];
                    if (!wrapper.resetting) {
                        wrapper.ractive.set(wrapper.keypath, value);
                    }
                }
            };
            set._ractiveWrappers = [this];
            Object.defineProperty(this.obj, this.prop, {
                get: get,
                set: set,
                enumerable: true,
                configurable: true
            });
        };
        MagicWrapper.prototype = {
            get: function () {
                return this.value;
            },
            reset: function (value) {
                this.resetting = true;
                this.value = value;
                this.resetting = false;
            },
            teardown: function () {
                var descriptor, set, value, wrappers;
                descriptor = Object.getOwnPropertyDescriptor(this.obj, this.prop);
                set = descriptor.set;
                wrappers = set._ractiveWrappers;
                wrappers.splice(wrappers.indexOf(this), 1);
                if (!wrappers.length) {
                    value = this.obj[this.prop];
                    Object.defineProperty(this.obj, this.prop, this.originalDescriptor || {
                        writable: true,
                        enumerable: true,
                        configrable: true
                    });
                    this.obj[this.prop] = value;
                }
            }
        };
        return magicAdaptor;
    }();
var shared_adaptIfNecessary = function (adaptorRegistry, arrayAdaptor, magicAdaptor) {
        
        var prefixers = {};
        return function (ractive, keypath, value, isExpressionResult) {
            var len, i, adaptor, wrapped;
            len = ractive.adaptors.length;
            for (i = 0; i < len; i += 1) {
                adaptor = ractive.adaptors[i];
                if (typeof adaptor === 'string') {
                    if (!adaptorRegistry[adaptor]) {
                        throw new Error('Missing adaptor "' + adaptor + '"');
                    }
                    adaptor = ractive.adaptors[i] = adaptorRegistry[adaptor];
                }
                if (adaptor.filter(value, keypath, ractive)) {
                    wrapped = ractive._wrapped[keypath] = adaptor.wrap(ractive, value, keypath, getPrefixer(keypath));
                    wrapped.value = value;
                    return;
                }
            }
            if (!isExpressionResult) {
                if (ractive.magic && magicAdaptor.filter(value, keypath, ractive)) {
                    ractive._wrapped[keypath] = magicAdaptor.wrap(ractive, value, keypath);
                } else if (ractive.modifyArrays && arrayAdaptor.filter(value, keypath, ractive)) {
                    ractive._wrapped[keypath] = arrayAdaptor.wrap(ractive, value, keypath);
                }
            }
        };
        function prefixKeypath(obj, prefix) {
            var prefixed = {}, key;
            if (!prefix) {
                return obj;
            }
            prefix += '.';
            for (key in obj) {
                if (obj.hasOwnProperty(key)) {
                    prefixed[prefix + key] = obj[key];
                }
            }
            return prefixed;
        }
        function getPrefixer(rootKeypath) {
            var rootDot;
            if (!prefixers[rootKeypath]) {
                rootDot = rootKeypath ? rootKeypath + '.' : '';
                prefixers[rootKeypath] = function (relativeKeypath, value) {
                    var obj;
                    if (typeof relativeKeypath === 'string') {
                        obj = {};
                        obj[rootDot + relativeKeypath] = value;
                        return obj;
                    }
                    if (typeof relativeKeypath === 'object') {
                        return rootDot ? prefixKeypath(relativeKeypath, rootKeypath) : relativeKeypath;
                    }
                };
            }
            return prefixers[rootKeypath];
        }
    }(registries_adaptors, Ractive_prototype_get_arrayAdaptor, Ractive_prototype_get_magicAdaptor);
var Ractive_prototype_get__get = function (normaliseKeypath, adaptorRegistry, adaptIfNecessary) {
        
        var get, _get, retrieve;
        get = function (keypath) {
            if (this._captured && !this._captured[keypath]) {
                this._captured.push(keypath);
                this._captured[keypath] = true;
            }
            return _get(this, keypath);
        };
        _get = function (ractive, keypath) {
            var cache, cached, value, wrapped, evaluator;
            keypath = normaliseKeypath(keypath);
            cache = ractive._cache;
            if ((cached = cache[keypath]) !== undefined) {
                return cached;
            }
            if (wrapped = ractive._wrapped[keypath]) {
                value = wrapped.value;
            } else if (!keypath) {
                adaptIfNecessary(ractive, '', ractive.data);
                value = ractive.data;
            } else if (evaluator = ractive._evaluators[keypath]) {
                value = evaluator.value;
            } else {
                value = retrieve(ractive, keypath);
            }
            cache[keypath] = value;
            return value;
        };
        retrieve = function (ractive, keypath) {
            var keys, key, parentKeypath, parentValue, cacheMap, value, wrapped;
            keys = keypath.split('.');
            key = keys.pop();
            parentKeypath = keys.join('.');
            parentValue = _get(ractive, parentKeypath);
            if (wrapped = ractive._wrapped[parentKeypath]) {
                parentValue = wrapped.get();
            }
            if (parentValue === null || parentValue === undefined) {
                return;
            }
            if (!(cacheMap = ractive._cacheMap[parentKeypath])) {
                ractive._cacheMap[parentKeypath] = [keypath];
            } else {
                if (cacheMap.indexOf(keypath) === -1) {
                    cacheMap[cacheMap.length] = keypath;
                }
            }
            value = parentValue[key];
            adaptIfNecessary(ractive, keypath, value);
            ractive._cache[keypath] = value;
            return value;
        };
        return get;
    }(utils_normaliseKeypath, registries_adaptors, shared_adaptIfNecessary);
var utils_isObject = function () {
        
        var toString = Object.prototype.toString;
        return function (thing) {
            return typeof thing === 'object' && toString.call(thing) === '[object Object]';
        };
    }();
var utils_isEqual = function () {
        
        return function (a, b) {
            if (a === null && b === null) {
                return true;
            }
            if (typeof a === 'object' || typeof b === 'object') {
                return false;
            }
            return a === b;
        };
    }();
var shared_resolveRef = function () {
        
        var resolveRef;
        resolveRef = function (ractive, ref, contextStack) {
            var keypath, keys, lastKey, contextKeys, innerMostContext, postfix, parentKeypath, parentValue, wrapped, context, ancestorErrorMessage;
            ancestorErrorMessage = 'Could not resolve reference - too many "../" prefixes';
            if (ref === '.') {
                if (!contextStack.length) {
                    return '';
                }
                keypath = contextStack[contextStack.length - 1];
            } else if (ref.charAt(0) === '.') {
                context = contextStack[contextStack.length - 1];
                contextKeys = context ? context.split('.') : [];
                if (ref.substr(0, 3) === '../') {
                    while (ref.substr(0, 3) === '../') {
                        if (!contextKeys.length) {
                            throw new Error(ancestorErrorMessage);
                        }
                        contextKeys.pop();
                        ref = ref.substring(3);
                    }
                    contextKeys.push(ref);
                    keypath = contextKeys.join('.');
                } else if (!context) {
                    keypath = ref.substring(1);
                } else {
                    keypath = context + ref;
                }
            } else {
                keys = ref.split('.');
                lastKey = keys.pop();
                postfix = keys.length ? '.' + keys.join('.') : '';
                contextStack = contextStack.concat();
                while (contextStack.length) {
                    innerMostContext = contextStack.pop();
                    parentKeypath = innerMostContext + postfix;
                    parentValue = ractive.get(parentKeypath);
                    if (wrapped = ractive._wrapped[parentKeypath]) {
                        parentValue = wrapped.get();
                    }
                    if (typeof parentValue === 'object' && parentValue !== null && parentValue.hasOwnProperty(lastKey)) {
                        keypath = innerMostContext + '.' + ref;
                        break;
                    }
                }
                if (!keypath && ractive.get(ref) !== undefined) {
                    keypath = ref;
                }
            }
            return keypath ? keypath.replace(/^\./, '') : keypath;
        };
        return resolveRef;
    }();
var shared_attemptKeypathResolution = function (resolveRef) {
        
        var push = Array.prototype.push;
        return function (ractive) {
            var unresolved, keypath, leftover;
            while (unresolved = ractive._pendingResolution.pop()) {
                keypath = resolveRef(ractive, unresolved.ref, unresolved.contextStack);
                if (keypath !== undefined) {
                    unresolved.resolve(keypath);
                } else {
                    (leftover || (leftover = [])).push(unresolved);
                }
            }
            if (leftover) {
                push.apply(ractive._pendingResolution, leftover);
            }
        };
    }(shared_resolveRef);
var shared_processDeferredUpdates = function (preDomUpdate, postDomUpdate) {
        
        return function (ractive) {
            preDomUpdate(ractive);
            postDomUpdate(ractive);
        };
    }(shared_preDomUpdate, shared_postDomUpdate);
var Ractive_prototype_shared_replaceData = function () {
        
        return function (ractive, keypath, value) {
            var keys, accumulated, wrapped, obj, key, currentKeypath, keypathToClear;
            keys = keypath.split('.');
            accumulated = [];
            if (wrapped = ractive._wrapped['']) {
                if (wrapped.set) {
                    wrapped.set(keys.join('.'), value);
                }
                obj = wrapped.get();
            } else {
                obj = ractive.data;
            }
            while (keys.length > 1) {
                key = accumulated[accumulated.length] = keys.shift();
                currentKeypath = accumulated.join('.');
                if (wrapped = ractive._wrapped[currentKeypath]) {
                    if (wrapped.set) {
                        wrapped.set(keys.join('.'), value);
                    }
                    obj = wrapped.get();
                } else {
                    if (!obj.hasOwnProperty(key)) {
                        if (!keypathToClear) {
                            keypathToClear = currentKeypath;
                        }
                        obj[key] = /^\s*[0-9]+\s*$/.test(keys[0]) ? [] : {};
                    }
                    obj = obj[key];
                }
            }
            key = keys[0];
            obj[key] = value;
            return keypathToClear;
        };
    }();
var Ractive_prototype_set = function (isObject, isEqual, normaliseKeypath, clearCache, notifyDependants, attemptKeypathResolution, makeTransitionManager, processDeferredUpdates, replaceData) {
        
        var set, updateModel, getUpstreamChanges, resetWrapped;
        set = function (keypath, value, complete) {
            var map, changes, upstreamChanges, previousTransitionManager, transitionManager, i, changeHash;
            changes = [];
            if (isObject(keypath)) {
                map = keypath;
                complete = value;
            }
            if (map) {
                for (keypath in map) {
                    if (map.hasOwnProperty(keypath)) {
                        value = map[keypath];
                        keypath = normaliseKeypath(keypath);
                        updateModel(this, keypath, value, changes);
                    }
                }
            } else {
                keypath = normaliseKeypath(keypath);
                updateModel(this, keypath, value, changes);
            }
            if (!changes.length) {
                return;
            }
            previousTransitionManager = this._transitionManager;
            this._transitionManager = transitionManager = makeTransitionManager(this, complete);
            upstreamChanges = getUpstreamChanges(changes);
            if (upstreamChanges.length) {
                notifyDependants.multiple(this, upstreamChanges, true);
            }
            notifyDependants.multiple(this, changes);
            if (this._pendingResolution.length) {
                attemptKeypathResolution(this);
            }
            processDeferredUpdates(this);
            this._transitionManager = previousTransitionManager;
            transitionManager.ready();
            if (!this.firingChangeEvent) {
                this.firingChangeEvent = true;
                changeHash = {};
                i = changes.length;
                while (i--) {
                    changeHash[changes[i]] = this.get(changes[i]);
                }
                this.fire('change', changeHash);
                this.firingChangeEvent = false;
            }
            return this;
        };
        updateModel = function (ractive, keypath, value, changes) {
            var cached, previous, wrapped, keypathToClear, evaluator;
            if ((wrapped = ractive._wrapped[keypath]) && wrapped.reset) {
                if (resetWrapped(ractive, keypath, value, wrapped, changes) !== false) {
                    return;
                }
            }
            if (evaluator = ractive._evaluators[keypath]) {
                evaluator.value = value;
            }
            cached = ractive._cache[keypath];
            previous = ractive.get(keypath);
            if (previous !== value && !evaluator) {
                keypathToClear = replaceData(ractive, keypath, value);
            } else {
                if (value === cached && typeof value !== 'object') {
                    return;
                }
            }
            clearCache(ractive, keypathToClear || keypath);
            changes[changes.length] = keypath;
        };
        getUpstreamChanges = function (changes) {
            var upstreamChanges = [''], i, keypath, keys, upstreamKeypath;
            i = changes.length;
            while (i--) {
                keypath = changes[i];
                keys = keypath.split('.');
                while (keys.length > 1) {
                    keys.pop();
                    upstreamKeypath = keys.join('.');
                    if (!upstreamChanges[upstreamKeypath]) {
                        upstreamChanges[upstreamChanges.length] = upstreamKeypath;
                        upstreamChanges[upstreamKeypath] = true;
                    }
                }
            }
            return upstreamChanges;
        };
        resetWrapped = function (ractive, keypath, value, wrapped, changes) {
            var previous, cached, cacheMap, i;
            previous = wrapped.get();
            if (!isEqual(previous, value)) {
                if (wrapped.reset(value) === false) {
                    return false;
                }
            }
            value = wrapped.get();
            cached = ractive._cache[keypath];
            if (!isEqual(cached, value)) {
                ractive._cache[keypath] = value;
                cacheMap = ractive._cacheMap[keypath];
                if (cacheMap) {
                    i = cacheMap.length;
                    while (i--) {
                        clearCache(ractive, cacheMap[i]);
                    }
                }
                changes[changes.length] = keypath;
            }
        };
        return set;
    }(utils_isObject, utils_isEqual, utils_normaliseKeypath, shared_clearCache, shared_notifyDependants, shared_attemptKeypathResolution, shared_makeTransitionManager, shared_processDeferredUpdates, Ractive_prototype_shared_replaceData);
var Ractive_prototype_update = function (makeTransitionManager, attemptKeypathResolution, clearCache, notifyDependants, processDeferredUpdates) {
        
        return function (keypath, complete) {
            var transitionManager, previousTransitionManager;
            if (typeof keypath === 'function') {
                complete = keypath;
                keypath = '';
            }
            previousTransitionManager = this._transitionManager;
            this._transitionManager = transitionManager = makeTransitionManager(this, complete);
            attemptKeypathResolution(this);
            clearCache(this, keypath || '');
            notifyDependants(this, keypath || '');
            processDeferredUpdates(this);
            this._transitionManager = previousTransitionManager;
            transitionManager.ready();
            if (typeof keypath === 'string') {
                this.fire('update', keypath);
            } else {
                this.fire('update');
            }
            return this;
        };
    }(shared_makeTransitionManager, shared_attemptKeypathResolution, shared_clearCache, shared_notifyDependants, shared_processDeferredUpdates);
var utils_arrayContentsMatch = function (isArray) {
        
        return function (a, b) {
            var i;
            if (!isArray(a) || !isArray(b)) {
                return false;
            }
            if (a.length !== b.length) {
                return false;
            }
            i = a.length;
            while (i--) {
                if (a[i] !== b[i]) {
                    return false;
                }
            }
            return true;
        };
    }(utils_isArray);
var Ractive_prototype_updateModel = function (getValueFromCheckboxes, arrayContentsMatch, isEqual) {
        
        return function (keypath, cascade) {
            var values, deferredCheckboxes, i;
            if (typeof keypath !== 'string') {
                keypath = '';
                cascade = true;
            }
            consolidateChangedValues(this, keypath, values = {}, deferredCheckboxes = [], cascade);
            if (i = deferredCheckboxes.length) {
                while (i--) {
                    keypath = deferredCheckboxes[i];
                    values[keypath] = getValueFromCheckboxes(this, keypath);
                }
            }
            this.set(values);
        };
        function consolidateChangedValues(ractive, keypath, values, deferredCheckboxes, cascade) {
            var bindings, childDeps, i, binding, oldValue, newValue;
            bindings = ractive._twowayBindings[keypath];
            if (bindings) {
                i = bindings.length;
                while (i--) {
                    binding = bindings[i];
                    if (binding.radioName && !binding.node.checked) {
                        continue;
                    }
                    if (binding.checkboxName) {
                        if (binding.changed() && !deferredCheckboxes[keypath]) {
                            deferredCheckboxes[keypath] = true;
                            deferredCheckboxes[deferredCheckboxes.length] = keypath;
                        }
                        continue;
                    }
                    oldValue = binding.attr.value;
                    newValue = binding.value();
                    if (arrayContentsMatch(oldValue, newValue)) {
                        continue;
                    }
                    if (!isEqual(oldValue, newValue)) {
                        values[keypath] = newValue;
                    }
                }
            }
            if (!cascade) {
                return;
            }
            childDeps = ractive._depsMap[keypath];
            if (childDeps) {
                i = childDeps.length;
                while (i--) {
                    consolidateChangedValues(ractive, childDeps[i], values, deferredCheckboxes, cascade);
                }
            }
        }
    }(shared_getValueFromCheckboxes, utils_arrayContentsMatch, utils_isEqual);
var Ractive_prototype_animate_requestAnimationFrame = function () {
        
        if (typeof window === 'undefined') {
            return;
        }
        (function (vendors, lastTime, window) {
            var x, setTimeout;
            if (window.requestAnimationFrame) {
                return;
            }
            for (x = 0; x < vendors.length && !window.requestAnimationFrame; ++x) {
                window.requestAnimationFrame = window[vendors[x] + 'RequestAnimationFrame'];
            }
            if (!window.requestAnimationFrame) {
                setTimeout = window.setTimeout;
                window.requestAnimationFrame = function (callback) {
                    var currTime, timeToCall, id;
                    currTime = Date.now();
                    timeToCall = Math.max(0, 16 - (currTime - lastTime));
                    id = setTimeout(function () {
                        callback(currTime + timeToCall);
                    }, timeToCall);
                    lastTime = currTime + timeToCall;
                    return id;
                };
            }
        }([
            'ms',
            'moz',
            'webkit',
            'o'
        ], 0, window));
        return window.requestAnimationFrame;
    }();
var Ractive_prototype_animate_animations = function (rAF) {
        
        var queue = [];
        var animations = {
                tick: function () {
                    var i, animation;
                    for (i = 0; i < queue.length; i += 1) {
                        animation = queue[i];
                        if (!animation.tick()) {
                            queue.splice(i--, 1);
                        }
                    }
                    if (queue.length) {
                        rAF(animations.tick);
                    } else {
                        animations.running = false;
                    }
                },
                add: function (animation) {
                    queue[queue.length] = animation;
                    if (!animations.running) {
                        animations.running = true;
                        animations.tick();
                    }
                },
                abort: function (keypath, root) {
                    var i = queue.length, animation;
                    while (i--) {
                        animation = queue[i];
                        if (animation.root === root && animation.keypath === keypath) {
                            animation.stop();
                        }
                    }
                }
            };
        return animations;
    }(Ractive_prototype_animate_requestAnimationFrame);
var utils_warn = function () {
        
        if (typeof console !== 'undefined' && typeof console.warn === 'function' && typeof console.warn.apply === 'function') {
            return function () {
                console.warn.apply(console, arguments);
            };
        }
        return function () {
        };
    }();
var utils_isNumeric = function () {
        
        return function (thing) {
            return !isNaN(parseFloat(thing)) && isFinite(thing);
        };
    }();
var shared_interpolate = function (isArray, isObject, isNumeric) {
        
        var interpolate = function (from, to) {
            if (isNumeric(from) && isNumeric(to)) {
                return makeNumberInterpolator(+from, +to);
            }
            if (isArray(from) && isArray(to)) {
                return makeArrayInterpolator(from, to);
            }
            if (isObject(from) && isObject(to)) {
                return makeObjectInterpolator(from, to);
            }
            return function () {
                return to;
            };
        };
        return interpolate;
        function makeNumberInterpolator(from, to) {
            var delta = to - from;
            if (!delta) {
                return function () {
                    return from;
                };
            }
            return function (t) {
                return from + t * delta;
            };
        }
        function makeArrayInterpolator(from, to) {
            var intermediate, interpolators, len, i;
            intermediate = [];
            interpolators = [];
            i = len = Math.min(from.length, to.length);
            while (i--) {
                interpolators[i] = interpolate(from[i], to[i]);
            }
            for (i = len; i < from.length; i += 1) {
                intermediate[i] = from[i];
            }
            for (i = len; i < to.length; i += 1) {
                intermediate[i] = to[i];
            }
            return function (t) {
                var i = len;
                while (i--) {
                    intermediate[i] = interpolators[i](t);
                }
                return intermediate;
            };
        }
        function makeObjectInterpolator(from, to) {
            var properties = [], len, interpolators, intermediate, prop;
            intermediate = {};
            interpolators = {};
            for (prop in from) {
                if (from.hasOwnProperty(prop)) {
                    if (to.hasOwnProperty(prop)) {
                        properties[properties.length] = prop;
                        interpolators[prop] = interpolate(from[prop], to[prop]);
                    } else {
                        intermediate[prop] = from[prop];
                    }
                }
            }
            for (prop in to) {
                if (to.hasOwnProperty(prop) && !from.hasOwnProperty(prop)) {
                    intermediate[prop] = to[prop];
                }
            }
            len = properties.length;
            return function (t) {
                var i = len, prop;
                while (i--) {
                    prop = properties[i];
                    intermediate[prop] = interpolators[prop](t);
                }
                return intermediate;
            };
        }
    }(utils_isArray, utils_isObject, utils_isNumeric);
var Ractive_prototype_animate_Animation = function (warn, interpolate) {
        
        var Animation = function (options) {
            var key;
            this.startTime = Date.now();
            for (key in options) {
                if (options.hasOwnProperty(key)) {
                    this[key] = options[key];
                }
            }
            this.interpolator = interpolate(this.from, this.to);
            this.running = true;
        };
        Animation.prototype = {
            tick: function () {
                var elapsed, t, value, timeNow, index, keypath;
                keypath = this.keypath;
                if (this.running) {
                    timeNow = Date.now();
                    elapsed = timeNow - this.startTime;
                    if (elapsed >= this.duration) {
                        if (keypath !== null) {
                            this.root.set(keypath, this.to);
                        }
                        if (this.step) {
                            this.step(1, this.to);
                        }
                        if (this.complete) {
                            this.complete(1, this.to);
                        }
                        index = this.root._animations.indexOf(this);
                        if (index === -1) {
                            warn('Animation was not found');
                        }
                        this.root._animations.splice(index, 1);
                        this.running = false;
                        return false;
                    }
                    t = this.easing ? this.easing(elapsed / this.duration) : elapsed / this.duration;
                    if (keypath !== null) {
                        value = this.interpolator(t);
                        this.root.set(keypath, value);
                    }
                    if (this.step) {
                        this.step(t, value);
                    }
                    return true;
                }
                return false;
            },
            stop: function () {
                var index;
                this.running = false;
                index = this.root._animations.indexOf(this);
                if (index === -1) {
                    warn('Animation was not found');
                }
                this.root._animations.splice(index, 1);
            }
        };
        return Animation;
    }(utils_warn, shared_interpolate);
var registries_easing = function () {
        
        return {
            linear: function (pos) {
                return pos;
            },
            easeIn: function (pos) {
                return Math.pow(pos, 3);
            },
            easeOut: function (pos) {
                return Math.pow(pos - 1, 3) + 1;
            },
            easeInOut: function (pos) {
                if ((pos /= 0.5) < 1) {
                    return 0.5 * Math.pow(pos, 3);
                }
                return 0.5 * (Math.pow(pos - 2, 3) + 2);
            }
        };
    }();
var Ractive_prototype_animate__animate = function (isEqual, animations, Animation, easingRegistry) {
        
        var noAnimation = {
                stop: function () {
                }
            };
        return function (keypath, to, options) {
            var k, animation, animations, easing, duration, step, complete, makeValueCollector, currentValues, collectValue, dummy, dummyOptions;
            if (typeof keypath === 'object') {
                options = to || {};
                easing = options.easing;
                duration = options.duration;
                animations = [];
                step = options.step;
                complete = options.complete;
                if (step || complete) {
                    currentValues = {};
                    options.step = null;
                    options.complete = null;
                    makeValueCollector = function (keypath) {
                        return function (t, value) {
                            currentValues[keypath] = value;
                        };
                    };
                }
                for (k in keypath) {
                    if (keypath.hasOwnProperty(k)) {
                        if (step || complete) {
                            collectValue = makeValueCollector(k);
                            options = {
                                easing: easing,
                                duration: duration
                            };
                            if (step) {
                                options.step = collectValue;
                            }
                            if (complete) {
                                options.complete = collectValue;
                            }
                        }
                        animations[animations.length] = animate(this, k, keypath[k], options);
                    }
                }
                if (step || complete) {
                    dummyOptions = {
                        easing: easing,
                        duration: duration
                    };
                    if (step) {
                        dummyOptions.step = function (t) {
                            step(t, currentValues);
                        };
                    }
                    if (complete) {
                        dummyOptions.complete = function (t) {
                            complete(t, currentValues);
                        };
                    }
                    animations[animations.length] = dummy = animate(this, null, null, dummyOptions);
                }
                return {
                    stop: function () {
                        while (animations.length) {
                            animations.pop().stop();
                        }
                        if (dummy) {
                            dummy.stop();
                        }
                    }
                };
            }
            options = options || {};
            animation = animate(this, keypath, to, options);
            return {
                stop: function () {
                    animation.stop();
                }
            };
        };
        function animate(root, keypath, to, options) {
            var easing, duration, animation, from;
            if (keypath !== null) {
                from = root.get(keypath);
            }
            animations.abort(keypath, root);
            if (isEqual(from, to)) {
                if (options.complete) {
                    options.complete(1, options.to);
                }
                return noAnimation;
            }
            if (options.easing) {
                if (typeof options.easing === 'function') {
                    easing = options.easing;
                } else {
                    if (root.easing && root.easing[options.easing]) {
                        easing = root.easing[options.easing];
                    } else {
                        easing = easingRegistry[options.easing];
                    }
                }
                if (typeof easing !== 'function') {
                    easing = null;
                }
            }
            duration = options.duration === undefined ? 400 : options.duration;
            animation = new Animation({
                keypath: keypath,
                from: from,
                to: to,
                root: root,
                duration: duration,
                easing: easing,
                step: options.step,
                complete: options.complete
            });
            animations.add(animation);
            root._animations[root._animations.length] = animation;
            return animation;
        }
    }(utils_isEqual, Ractive_prototype_animate_animations, Ractive_prototype_animate_Animation, registries_easing);
var Ractive_prototype_on = function () {
        
        return function (eventName, callback) {
            var self = this, listeners, n;
            if (typeof eventName === 'object') {
                listeners = [];
                for (n in eventName) {
                    if (eventName.hasOwnProperty(n)) {
                        listeners[listeners.length] = this.on(n, eventName[n]);
                    }
                }
                return {
                    cancel: function () {
                        while (listeners.length) {
                            listeners.pop().cancel();
                        }
                    }
                };
            }
            if (!this._subs[eventName]) {
                this._subs[eventName] = [callback];
            } else {
                this._subs[eventName].push(callback);
            }
            return {
                cancel: function () {
                    self.off(eventName, callback);
                }
            };
        };
    }();
var Ractive_prototype_off = function () {
        
        return function (eventName, callback) {
            var subscribers, index;
            if (!callback) {
                if (!eventName) {
                    for (eventName in this._subs) {
                        delete this._subs[eventName];
                    }
                } else {
                    this._subs[eventName] = [];
                }
            }
            subscribers = this._subs[eventName];
            if (subscribers) {
                index = subscribers.indexOf(callback);
                if (index !== -1) {
                    subscribers.splice(index, 1);
                }
            }
        };
    }();
var shared_registerDependant = function () {
        
        return function (dependant) {
            var depsByKeypath, deps, keys, parentKeypath, map, ractive, keypath, priority;
            ractive = dependant.root;
            keypath = dependant.keypath;
            priority = dependant.priority;
            depsByKeypath = ractive._deps[priority] || (ractive._deps[priority] = {});
            deps = depsByKeypath[keypath] || (depsByKeypath[keypath] = []);
            deps[deps.length] = dependant;
            dependant.registered = true;
            if (!keypath) {
                return;
            }
            keys = keypath.split('.');
            while (keys.length) {
                keys.pop();
                parentKeypath = keys.join('.');
                map = ractive._depsMap[parentKeypath] || (ractive._depsMap[parentKeypath] = []);
                if (map[keypath] === undefined) {
                    map[keypath] = 0;
                    map[map.length] = keypath;
                }
                map[keypath] += 1;
                keypath = parentKeypath;
            }
        };
    }();
var shared_unregisterDependant = function () {
        
        return function (dependant) {
            var deps, index, keys, parentKeypath, map, ractive, keypath, priority;
            ractive = dependant.root;
            keypath = dependant.keypath;
            priority = dependant.priority;
            deps = ractive._deps[priority][keypath];
            index = deps.indexOf(dependant);
            if (index === -1 || !dependant.registered) {
                throw new Error('Attempted to remove a dependant that was no longer registered! This should not happen. If you are seeing this bug in development please raise an issue at https://github.com/RactiveJS/Ractive/issues - thanks');
            }
            deps.splice(index, 1);
            dependant.registered = false;
            if (!keypath) {
                return;
            }
            keys = keypath.split('.');
            while (keys.length) {
                keys.pop();
                parentKeypath = keys.join('.');
                map = ractive._depsMap[parentKeypath];
                map[keypath] -= 1;
                if (!map[keypath]) {
                    map.splice(map.indexOf(keypath), 1);
                    map[keypath] = undefined;
                }
                keypath = parentKeypath;
            }
        };
    }();
var Ractive_prototype_observe_Observer = function (isEqual) {
        
        var Observer = function (ractive, keypath, callback, options) {
            var self = this;
            this.root = ractive;
            this.keypath = keypath;
            this.callback = callback;
            this.defer = options.defer;
            this.debug = options.debug;
            this.proxy = {
                update: function () {
                    self.reallyUpdate();
                }
            };
            this.priority = 0;
            this.context = options && options.context ? options.context : ractive;
        };
        Observer.prototype = {
            init: function (immediate) {
                if (immediate !== false) {
                    this.update();
                } else {
                    this.value = this.root.get(this.keypath);
                }
            },
            update: function () {
                if (this.defer && this.ready) {
                    this.root._deferred.observers.push(this.proxy);
                    return;
                }
                this.reallyUpdate();
            },
            reallyUpdate: function () {
                var oldValue, newValue;
                oldValue = this.value;
                newValue = this.root.get(this.keypath);
                this.value = newValue;
                if (this.updating) {
                    return;
                }
                this.updating = true;
                if (!isEqual(newValue, oldValue) || !this.ready) {
                    try {
                        this.callback.call(this.context, newValue, oldValue, this.keypath);
                    } catch (err) {
                        if (this.debug || this.root.debug) {
                            throw err;
                        }
                    }
                }
                this.updating = false;
            }
        };
        return Observer;
    }(utils_isEqual);
var Ractive_prototype_observe_getPattern = function () {
        
        return function (ractive, pattern) {
            var keys, key, values, toGet, newToGet, expand, concatenate;
            keys = pattern.split('.');
            toGet = [];
            expand = function (keypath) {
                var value, key;
                value = ractive._wrapped[keypath] ? ractive._wrapped[keypath].get() : ractive.get(keypath);
                for (key in value) {
                    newToGet.push(keypath + '.' + key);
                }
            };
            concatenate = function (keypath) {
                return keypath + '.' + key;
            };
            while (key = keys.shift()) {
                if (key === '*') {
                    newToGet = [];
                    toGet.forEach(expand);
                    toGet = newToGet;
                } else {
                    if (!toGet[0]) {
                        toGet[0] = key;
                    } else {
                        toGet = toGet.map(concatenate);
                    }
                }
            }
            values = {};
            toGet.forEach(function (keypath) {
                values[keypath] = ractive.get(keypath);
            });
            return values;
        };
    }();
var Ractive_prototype_observe_PatternObserver = function (isEqual, getPattern) {
        
        var PatternObserver, wildcard = /\*/;
        PatternObserver = function (ractive, keypath, callback, options) {
            this.root = ractive;
            this.callback = callback;
            this.defer = options.defer;
            this.debug = options.debug;
            this.keypath = keypath;
            this.regex = new RegExp('^' + keypath.replace(/\./g, '\\.').replace(/\*/g, '[^\\.]+') + '$');
            this.values = {};
            if (this.defer) {
                this.proxies = [];
            }
            this.priority = 'pattern';
            this.context = options && options.context ? options.context : ractive;
        };
        PatternObserver.prototype = {
            init: function (immediate) {
                var values, keypath;
                values = getPattern(this.root, this.keypath);
                if (immediate !== false) {
                    for (keypath in values) {
                        if (values.hasOwnProperty(keypath)) {
                            this.update(keypath);
                        }
                    }
                } else {
                    this.values = values;
                }
            },
            update: function (keypath) {
                var values;
                if (wildcard.test(keypath)) {
                    values = getPattern(this.root, keypath);
                    for (keypath in values) {
                        if (values.hasOwnProperty(keypath)) {
                            this.update(keypath);
                        }
                    }
                    return;
                }
                if (this.defer && this.ready) {
                    this.root._deferred.observers.push(this.getProxy(keypath));
                    return;
                }
                this.reallyUpdate(keypath);
            },
            reallyUpdate: function (keypath) {
                var value = this.root.get(keypath);
                if (this.updating) {
                    this.values[keypath] = value;
                    return;
                }
                this.updating = true;
                if (!isEqual(value, this.values[keypath]) || !this.ready) {
                    try {
                        this.callback.call(this.context, value, this.values[keypath], keypath);
                    } catch (err) {
                        if (this.debug || this.root.debug) {
                            throw err;
                        }
                    }
                    this.values[keypath] = value;
                }
                this.updating = false;
            },
            getProxy: function (keypath) {
                var self = this;
                if (!this.proxies[keypath]) {
                    this.proxies[keypath] = {
                        update: function () {
                            self.reallyUpdate(keypath);
                        }
                    };
                }
                return this.proxies[keypath];
            }
        };
        return PatternObserver;
    }(utils_isEqual, Ractive_prototype_observe_getPattern);
var Ractive_prototype_observe_getObserverFacade = function (normaliseKeypath, registerDependant, unregisterDependant, Observer, PatternObserver) {
        
        var wildcard = /\*/, emptyObject = {};
        return function getObserverFacade(ractive, keypath, callback, options) {
            var observer, isPatternObserver;
            keypath = normaliseKeypath(keypath);
            options = options || emptyObject;
            if (wildcard.test(keypath)) {
                observer = new PatternObserver(ractive, keypath, callback, options);
                ractive._patternObservers.push(observer);
                isPatternObserver = true;
            } else {
                observer = new Observer(ractive, keypath, callback, options);
            }
            registerDependant(observer);
            observer.init(options.init);
            observer.ready = true;
            return {
                cancel: function () {
                    var index;
                    if (isPatternObserver) {
                        index = ractive._patternObservers.indexOf(observer);
                        if (index !== -1) {
                            ractive._patternObservers.splice(index, 1);
                        }
                    }
                    unregisterDependant(observer);
                }
            };
        };
    }(utils_normaliseKeypath, shared_registerDependant, shared_unregisterDependant, Ractive_prototype_observe_Observer, Ractive_prototype_observe_PatternObserver);
var Ractive_prototype_observe__observe = function (isObject, getObserverFacade) {
        
        return function observe(keypath, callback, options) {
            var observers = [], k;
            if (isObject(keypath)) {
                options = callback;
                for (k in keypath) {
                    if (keypath.hasOwnProperty(k)) {
                        callback = keypath[k];
                        observers[observers.length] = getObserverFacade(this, k, callback, options);
                    }
                }
                return {
                    cancel: function () {
                        while (observers.length) {
                            observers.pop().cancel();
                        }
                    }
                };
            }
            return getObserverFacade(this, keypath, callback, options);
        };
    }(utils_isObject, Ractive_prototype_observe_getObserverFacade);
var Ractive_prototype_fire = function () {
        
        return function (eventName) {
            var args, i, len, subscribers = this._subs[eventName];
            if (!subscribers) {
                return;
            }
            args = Array.prototype.slice.call(arguments, 1);
            for (i = 0, len = subscribers.length; i < len; i += 1) {
                subscribers[i].apply(this, args);
            }
        };
    }();
var Ractive_prototype_find = function () {
        
        return function (selector) {
            if (!this.el) {
                return null;
            }
            return this.fragment.find(selector);
        };
    }();
var utils_matches = function (isClient, createElement) {
        
        var div, methodNames, unprefixed, prefixed, vendors, i, j, makeFunction;
        if (!isClient) {
            return;
        }
        div = createElement('div');
        methodNames = [
            'matches',
            'matchesSelector'
        ];
        vendors = [
            'o',
            'ms',
            'moz',
            'webkit'
        ];
        makeFunction = function (methodName) {
            return function (node, selector) {
                return node[methodName](selector);
            };
        };
        i = methodNames.length;
        while (i--) {
            unprefixed = methodNames[i];
            if (div[unprefixed]) {
                return makeFunction(unprefixed);
            }
            j = vendors.length;
            while (j--) {
                prefixed = vendors[i] + unprefixed.substr(0, 1).toUpperCase() + unprefixed.substring(1);
                if (div[prefixed]) {
                    return makeFunction(prefixed);
                }
            }
        }
        return function (node, selector) {
            var nodes, i;
            nodes = (node.parentNode || node.document).querySelectorAll(selector);
            i = nodes.length;
            while (i--) {
                if (nodes[i] === node) {
                    return true;
                }
            }
            return false;
        };
    }(config_isClient, utils_createElement);
var Ractive_prototype_shared_makeQuery_test = function (matches) {
        
        return function (item, noDirty) {
            var itemMatches = this._isComponentQuery ? !this.selector || item.name === this.selector : matches(item.node, this.selector);
            if (itemMatches) {
                this.push(item.node || item.instance);
                if (!noDirty) {
                    this._makeDirty();
                }
                return true;
            }
        };
    }(utils_matches);
var Ractive_prototype_shared_makeQuery_cancel = function () {
        
        return function () {
            var liveQueries, selector, index;
            liveQueries = this._root[this._isComponentQuery ? 'liveComponentQueries' : 'liveQueries'];
            selector = this.selector;
            index = liveQueries.indexOf(selector);
            if (index !== -1) {
                liveQueries.splice(index, 1);
                liveQueries[selector] = null;
            }
        };
    }();
var Ractive_prototype_shared_makeQuery_sortByItemPosition = function () {
        
        return function (a, b) {
            var ancestryA, ancestryB, oldestA, oldestB, mutualAncestor, indexA, indexB, fragments, fragmentA, fragmentB;
            ancestryA = getAncestry(a.component || a._ractive.proxy);
            ancestryB = getAncestry(b.component || b._ractive.proxy);
            oldestA = ancestryA[ancestryA.length - 1];
            oldestB = ancestryB[ancestryB.length - 1];
            while (oldestA && oldestA === oldestB) {
                ancestryA.pop();
                ancestryB.pop();
                mutualAncestor = oldestA;
                oldestA = ancestryA[ancestryA.length - 1];
                oldestB = ancestryB[ancestryB.length - 1];
            }
            oldestA = oldestA.component || oldestA;
            oldestB = oldestB.component || oldestB;
            fragmentA = oldestA.parentFragment;
            fragmentB = oldestB.parentFragment;
            if (fragmentA === fragmentB) {
                indexA = fragmentA.items.indexOf(oldestA);
                indexB = fragmentB.items.indexOf(oldestB);
                return indexA - indexB || ancestryA.length - ancestryB.length;
            }
            if (fragments = mutualAncestor.fragments) {
                indexA = fragments.indexOf(fragmentA);
                indexB = fragments.indexOf(fragmentB);
                return indexA - indexB || ancestryA.length - ancestryB.length;
            }
            throw new Error('An unexpected condition was met while comparing the position of two components. Please file an issue at https://github.com/RactiveJS/Ractive/issues - thanks!');
        };
        function getParent(item) {
            var parentFragment;
            if (parentFragment = item.parentFragment) {
                return parentFragment.owner;
            }
            if (item.component && (parentFragment = item.component.parentFragment)) {
                return parentFragment.owner;
            }
        }
        function getAncestry(item) {
            var ancestry, ancestor;
            ancestry = [item];
            ancestor = getParent(item);
            while (ancestor) {
                ancestry.push(ancestor);
                ancestor = getParent(ancestor);
            }
            return ancestry;
        }
    }();
var Ractive_prototype_shared_makeQuery_sortByDocumentPosition = function (sortByItemPosition) {
        
        return function (node, otherNode) {
            var bitmask;
            if (node.compareDocumentPosition) {
                bitmask = node.compareDocumentPosition(otherNode);
                return bitmask & 2 ? 1 : -1;
            }
            return sortByItemPosition(node, otherNode);
        };
    }(Ractive_prototype_shared_makeQuery_sortByItemPosition);
var Ractive_prototype_shared_makeQuery_sort = function (sortByDocumentPosition, sortByItemPosition) {
        
        return function () {
            this.sort(this._isComponentQuery ? sortByItemPosition : sortByDocumentPosition);
            this._dirty = false;
        };
    }(Ractive_prototype_shared_makeQuery_sortByDocumentPosition, Ractive_prototype_shared_makeQuery_sortByItemPosition);
var Ractive_prototype_shared_makeQuery_dirty = function () {
        
        return function () {
            if (!this._dirty) {
                this._root._deferred.liveQueries.push(this);
                this._dirty = true;
            }
        };
    }();
var Ractive_prototype_shared_makeQuery_remove = function () {
        
        return function (item) {
            var index = this.indexOf(this._isComponentQuery ? item.instance : item.node);
            if (index !== -1) {
                this.splice(index, 1);
            }
        };
    }();
var Ractive_prototype_shared_makeQuery__makeQuery = function (defineProperties, test, cancel, sort, dirty, remove) {
        
        return function (ractive, selector, live, isComponentQuery) {
            var query;
            query = [];
            defineProperties(query, {
                selector: { value: selector },
                live: { value: live },
                _isComponentQuery: { value: isComponentQuery },
                _test: { value: test }
            });
            if (!live) {
                return query;
            }
            defineProperties(query, {
                cancel: { value: cancel },
                _root: { value: ractive },
                _sort: { value: sort },
                _makeDirty: { value: dirty },
                _remove: { value: remove },
                _dirty: {
                    value: false,
                    writable: true
                }
            });
            return query;
        };
    }(utils_defineProperties, Ractive_prototype_shared_makeQuery_test, Ractive_prototype_shared_makeQuery_cancel, Ractive_prototype_shared_makeQuery_sort, Ractive_prototype_shared_makeQuery_dirty, Ractive_prototype_shared_makeQuery_remove);
var Ractive_prototype_findAll = function (warn, matches, defineProperties, makeQuery) {
        
        return function (selector, options) {
            var liveQueries, query;
            if (!this.el) {
                return [];
            }
            options = options || {};
            liveQueries = this._liveQueries;
            if (query = liveQueries[selector]) {
                return options && options.live ? query : query.slice();
            }
            query = makeQuery(this, selector, !!options.live, false);
            if (query.live) {
                liveQueries.push(selector);
                liveQueries[selector] = query;
            }
            this.fragment.findAll(selector, query);
            return query;
        };
    }(utils_warn, utils_matches, utils_defineProperties, Ractive_prototype_shared_makeQuery__makeQuery);
var Ractive_prototype_findComponent = function () {
        
        return function (selector) {
            return this.fragment.findComponent(selector);
        };
    }();
var Ractive_prototype_findAllComponents = function (warn, matches, defineProperties, makeQuery) {
        
        return function (selector, options) {
            var liveQueries, query;
            options = options || {};
            liveQueries = this._liveComponentQueries;
            if (query = liveQueries[selector]) {
                return options && options.live ? query : query.slice();
            }
            query = makeQuery(this, selector, !!options.live, true);
            if (query.live) {
                liveQueries.push(selector);
                liveQueries[selector] = query;
            }
            this.fragment.findAllComponents(selector, query);
            return query;
        };
    }(utils_warn, utils_matches, utils_defineProperties, Ractive_prototype_shared_makeQuery__makeQuery);
var utils_getElement = function () {
        
        return function (input) {
            var output;
            if (typeof window === 'undefined' || !document || !input) {
                return null;
            }
            if (input.nodeType) {
                return input;
            }
            if (typeof input === 'string') {
                output = document.getElementById(input);
                if (!output && document.querySelector) {
                    output = document.querySelector(input);
                }
                if (output && output.nodeType) {
                    return output;
                }
            }
            if (input[0] && input[0].nodeType) {
                return input[0];
            }
            return null;
        };
    }();
var render_shared_initFragment = function (types, create) {
        
        return function (fragment, options) {
            var numItems, i, parentFragment, parentRefs, ref;
            fragment.owner = options.owner;
            parentFragment = fragment.owner.parentFragment;
            fragment.root = options.root;
            fragment.pNode = options.pNode;
            fragment.contextStack = options.contextStack || [];
            if (fragment.owner.type === types.SECTION) {
                fragment.index = options.index;
            }
            if (parentFragment) {
                parentRefs = parentFragment.indexRefs;
                if (parentRefs) {
                    fragment.indexRefs = create(null);
                    for (ref in parentRefs) {
                        fragment.indexRefs[ref] = parentRefs[ref];
                    }
                }
            }
            fragment.priority = parentFragment ? parentFragment.priority + 1 : 1;
            if (options.indexRef) {
                if (!fragment.indexRefs) {
                    fragment.indexRefs = {};
                }
                fragment.indexRefs[options.indexRef] = options.index;
            }
            fragment.items = [];
            numItems = options.descriptor ? options.descriptor.length : 0;
            for (i = 0; i < numItems; i += 1) {
                fragment.items[fragment.items.length] = fragment.createItem({
                    parentFragment: fragment,
                    descriptor: options.descriptor[i],
                    index: i
                });
            }
        };
    }(config_types, utils_create);
var render_DomFragment_shared_insertHtml = function (createElement) {
        
        var elementCache = {};
        return function (html, tagName, docFrag) {
            var container, nodes = [];
            if (html) {
                container = elementCache[tagName] || (elementCache[tagName] = createElement(tagName));
                container.innerHTML = html;
                while (container.firstChild) {
                    nodes[nodes.length] = container.firstChild;
                    docFrag.appendChild(container.firstChild);
                }
            }
            return nodes;
        };
    }(utils_createElement);
var render_DomFragment_Text = function (types) {
        
        var DomText, lessThan, greaterThan;
        lessThan = /</g;
        greaterThan = />/g;
        DomText = function (options, docFrag) {
            this.type = types.TEXT;
            this.descriptor = options.descriptor;
            if (docFrag) {
                this.node = document.createTextNode(options.descriptor);
                docFrag.appendChild(this.node);
            }
        };
        DomText.prototype = {
            detach: function () {
                this.node.parentNode.removeChild(this.node);
                return this.node;
            },
            teardown: function (destroy) {
                if (destroy) {
                    this.detach();
                }
            },
            firstNode: function () {
                return this.node;
            },
            toString: function () {
                return ('' + this.descriptor).replace(lessThan, '&lt;').replace(greaterThan, '&gt;');
            }
        };
        return DomText;
    }(config_types);
var shared_teardown = function (unregisterDependant) {
        
        return function (thing) {
            if (!thing.keypath) {
                var index = thing.root._pendingResolution.indexOf(thing);
                if (index !== -1) {
                    thing.root._pendingResolution.splice(index, 1);
                }
            } else {
                unregisterDependant(thing);
            }
        };
    }(shared_unregisterDependant);
var render_shared_Evaluator_Reference = function (types, isEqual, defineProperty, registerDependant, unregisterDependant) {
        
        var Reference, thisPattern;
        thisPattern = /this/;
        Reference = function (root, keypath, evaluator, argNum, priority) {
            var value;
            this.evaluator = evaluator;
            this.keypath = keypath;
            this.root = root;
            this.argNum = argNum;
            this.type = types.REFERENCE;
            this.priority = priority;
            value = root.get(keypath);
            if (typeof value === 'function') {
                value = wrapFunction(value, root, evaluator);
            }
            this.value = evaluator.values[argNum] = value;
            registerDependant(this);
        };
        Reference.prototype = {
            update: function () {
                var value = this.root.get(this.keypath);
                if (typeof value === 'function' && !value._nowrap) {
                    value = wrapFunction(value, this.root, this.evaluator);
                }
                if (!isEqual(value, this.value)) {
                    this.evaluator.values[this.argNum] = value;
                    this.evaluator.bubble();
                    this.value = value;
                }
            },
            teardown: function () {
                unregisterDependant(this);
            }
        };
        return Reference;
        function wrapFunction(fn, ractive, evaluator) {
            var prop, evaluators, index;
            if (!thisPattern.test(fn.toString())) {
                defineProperty(fn, '_nowrap', { value: true });
                return fn;
            }
            if (!fn['_' + ractive._guid]) {
                defineProperty(fn, '_' + ractive._guid, {
                    value: function () {
                        var originalCaptured, result, i, evaluator;
                        originalCaptured = ractive._captured;
                        if (!originalCaptured) {
                            ractive._captured = [];
                        }
                        result = fn.apply(ractive, arguments);
                        if (ractive._captured.length) {
                            i = evaluators.length;
                            while (i--) {
                                evaluator = evaluators[i];
                                evaluator.updateSoftDependencies(ractive._captured);
                            }
                        }
                        ractive._captured = originalCaptured;
                        return result;
                    },
                    writable: true
                });
                for (prop in fn) {
                    if (fn.hasOwnProperty(prop)) {
                        fn['_' + ractive._guid][prop] = fn[prop];
                    }
                }
                fn['_' + ractive._guid + '_evaluators'] = [];
            }
            evaluators = fn['_' + ractive._guid + '_evaluators'];
            index = evaluators.indexOf(evaluator);
            if (index === -1) {
                evaluators.push(evaluator);
            }
            return fn['_' + ractive._guid];
        }
    }(config_types, utils_isEqual, utils_defineProperty, shared_registerDependant, shared_unregisterDependant);
var render_shared_Evaluator_SoftReference = function (isEqual, registerDependant, unregisterDependant) {
        
        var SoftReference = function (root, keypath, evaluator) {
            this.root = root;
            this.keypath = keypath;
            this.priority = evaluator.priority;
            this.evaluator = evaluator;
            registerDependant(this);
        };
        SoftReference.prototype = {
            update: function () {
                var value = this.root.get(this.keypath);
                if (!isEqual(value, this.value)) {
                    this.evaluator.bubble();
                    this.value = value;
                }
            },
            teardown: function () {
                unregisterDependant(this);
            }
        };
        return SoftReference;
    }(utils_isEqual, shared_registerDependant, shared_unregisterDependant);
var render_shared_Evaluator__Evaluator = function (isEqual, defineProperty, clearCache, notifyDependants, registerDependant, unregisterDependant, adaptIfNecessary, Reference, SoftReference) {
        
        var Evaluator, cache = {};
        Evaluator = function (root, keypath, functionStr, args, priority) {
            var i, arg;
            this.root = root;
            this.keypath = keypath;
            this.priority = priority;
            this.fn = getFunctionFromString(functionStr, args.length);
            this.values = [];
            this.refs = [];
            i = args.length;
            while (i--) {
                if (arg = args[i]) {
                    if (arg[0]) {
                        this.values[i] = arg[1];
                    } else {
                        this.refs[this.refs.length] = new Reference(root, arg[1], this, i, priority);
                    }
                } else {
                    this.values[i] = undefined;
                }
            }
            this.selfUpdating = this.refs.length <= 1;
            this.update();
        };
        Evaluator.prototype = {
            bubble: function () {
                if (this.selfUpdating) {
                    this.update();
                } else if (!this.deferred) {
                    this.root._deferred.evals.push(this);
                    this.deferred = true;
                }
            },
            update: function () {
                var value;
                if (this.evaluating) {
                    return this;
                }
                this.evaluating = true;
                try {
                    value = this.fn.apply(null, this.values);
                } catch (err) {
                    if (this.root.debug) {
                        throw err;
                    } else {
                        value = undefined;
                    }
                }
                if (!isEqual(value, this.value)) {
                    clearCache(this.root, this.keypath);
                    this.root._cache[this.keypath] = value;
                    adaptIfNecessary(this.root, this.keypath, value, true);
                    this.value = value;
                    notifyDependants(this.root, this.keypath);
                }
                this.evaluating = false;
                return this;
            },
            teardown: function () {
                while (this.refs.length) {
                    this.refs.pop().teardown();
                }
                clearCache(this.root, this.keypath);
                this.root._evaluators[this.keypath] = null;
            },
            refresh: function () {
                if (!this.selfUpdating) {
                    this.deferred = true;
                }
                var i = this.refs.length;
                while (i--) {
                    this.refs[i].update();
                }
                if (this.deferred) {
                    this.update();
                    this.deferred = false;
                }
            },
            updateSoftDependencies: function (softDeps) {
                var i, keypath, ref;
                if (!this.softRefs) {
                    this.softRefs = [];
                }
                i = this.softRefs.length;
                while (i--) {
                    ref = this.softRefs[i];
                    if (!softDeps[ref.keypath]) {
                        this.softRefs.splice(i, 1);
                        this.softRefs[ref.keypath] = false;
                        ref.teardown();
                    }
                }
                i = softDeps.length;
                while (i--) {
                    keypath = softDeps[i];
                    if (!this.softRefs[keypath]) {
                        ref = new SoftReference(this.root, keypath, this);
                        this.softRefs[this.softRefs.length] = ref;
                        this.softRefs[keypath] = true;
                    }
                }
                this.selfUpdating = this.refs.length + this.softRefs.length <= 1;
            }
        };
        return Evaluator;
        function getFunctionFromString(str, i) {
            var fn, args;
            str = str.replace(/\$\{([0-9]+)\}/g, '_$1');
            if (cache[str]) {
                return cache[str];
            }
            args = [];
            while (i--) {
                args[i] = '_' + i;
            }
            fn = new Function(args.join(','), 'return(' + str + ')');
            cache[str] = fn;
            return fn;
        }
    }(utils_isEqual, utils_defineProperty, shared_clearCache, shared_notifyDependants, shared_registerDependant, shared_unregisterDependant, shared_adaptIfNecessary, render_shared_Evaluator_Reference, render_shared_Evaluator_SoftReference);
var render_shared_ExpressionResolver_ReferenceScout = function (resolveRef, teardown) {
        
        var ReferenceScout = function (resolver, ref, contextStack, argNum) {
            var keypath, root;
            root = this.root = resolver.root;
            keypath = resolveRef(root, ref, contextStack);
            if (keypath !== undefined) {
                resolver.resolveRef(argNum, false, keypath);
            } else {
                this.ref = ref;
                this.argNum = argNum;
                this.resolver = resolver;
                this.contextStack = contextStack;
                root._pendingResolution[root._pendingResolution.length] = this;
            }
        };
        ReferenceScout.prototype = {
            resolve: function (keypath) {
                this.keypath = keypath;
                this.resolver.resolveRef(this.argNum, false, keypath);
            },
            teardown: function () {
                if (!this.keypath) {
                    teardown(this);
                }
            }
        };
        return ReferenceScout;
    }(shared_resolveRef, shared_teardown);
var render_shared_ExpressionResolver_isRegularKeypath = function () {
        
        var keyPattern = /^(?:(?:[a-zA-Z$_][a-zA-Z$_0-9]*)|(?:[0-9]|[1-9][0-9]+))$/;
        return function (keypath) {
            var keys, key, i;
            keys = keypath.split('.');
            i = keys.length;
            while (i--) {
                key = keys[i];
                if (key === 'undefined' || !keyPattern.test(key)) {
                    return false;
                }
            }
            return true;
        };
    }();
var render_shared_ExpressionResolver_getKeypath = function (normaliseKeypath, isRegularKeypath) {
        
        return function (str, args) {
            var unique, normalised;
            unique = str.replace(/\$\{([0-9]+)\}/g, function (match, $1) {
                return args[$1] ? args[$1][1] : 'undefined';
            });
            normalised = normaliseKeypath(unique);
            if (isRegularKeypath(normalised)) {
                return normalised;
            }
            return '${' + unique.replace(/[\.\[\]]/g, '-') + '}';
        };
    }(utils_normaliseKeypath, render_shared_ExpressionResolver_isRegularKeypath);
var render_shared_ExpressionResolver_reassignDependants = function (registerDependant, unregisterDependant) {
        
        return function (ractive, oldKeypath, newKeypath) {
            var toReassign, i, dependant;
            toReassign = [];
            gatherDependants(ractive, oldKeypath, toReassign);
            i = toReassign.length;
            while (i--) {
                dependant = toReassign[i];
                unregisterDependant(dependant);
                dependant.keypath = dependant.keypath.replace(oldKeypath, newKeypath);
                registerDependant(dependant);
                dependant.update();
            }
        };
        function cascade(ractive, oldKeypath, toReassign) {
            var map, i;
            map = ractive._depsMap[oldKeypath];
            if (!map) {
                return;
            }
            i = map.length;
            while (i--) {
                gatherDependants(ractive, map[i], toReassign);
            }
        }
        function gatherDependants(ractive, oldKeypath, toReassign) {
            var priority, dependantsByKeypath, dependants, i;
            priority = ractive._deps.length;
            while (priority--) {
                dependantsByKeypath = ractive._deps[priority];
                if (dependantsByKeypath) {
                    dependants = dependantsByKeypath[oldKeypath];
                    if (dependants) {
                        i = dependants.length;
                        while (i--) {
                            toReassign.push(dependants[i]);
                        }
                    }
                }
            }
            cascade(ractive, oldKeypath, toReassign);
        }
    }(shared_registerDependant, shared_unregisterDependant);
var render_shared_ExpressionResolver__ExpressionResolver = function (Evaluator, ReferenceScout, getKeypath, reassignDependants) {
        
        var ExpressionResolver = function (mustache) {
            var expression, i, len, ref, indexRefs;
            this.root = mustache.root;
            this.mustache = mustache;
            this.args = [];
            this.scouts = [];
            expression = mustache.descriptor.x;
            indexRefs = mustache.parentFragment.indexRefs;
            this.str = expression.s;
            len = this.unresolved = this.args.length = expression.r ? expression.r.length : 0;
            if (!len) {
                this.resolved = this.ready = true;
                this.bubble();
                return;
            }
            for (i = 0; i < len; i += 1) {
                ref = expression.r[i];
                if (indexRefs && indexRefs[ref] !== undefined) {
                    this.resolveRef(i, true, indexRefs[ref]);
                } else {
                    this.scouts[this.scouts.length] = new ReferenceScout(this, ref, mustache.contextStack, i);
                }
            }
            this.ready = true;
            this.bubble();
        };
        ExpressionResolver.prototype = {
            bubble: function () {
                var oldKeypath;
                if (!this.ready) {
                    return;
                }
                oldKeypath = this.keypath;
                this.keypath = getKeypath(this.str, this.args);
                if (this.keypath.substr(0, 2) === '${') {
                    this.createEvaluator();
                }
                if (oldKeypath) {
                    reassignDependants(this.root, oldKeypath, this.keypath);
                } else {
                    this.mustache.resolve(this.keypath);
                }
            },
            teardown: function () {
                while (this.scouts.length) {
                    this.scouts.pop().teardown();
                }
            },
            resolveRef: function (argNum, isIndexRef, value) {
                this.args[argNum] = [
                    isIndexRef,
                    value
                ];
                this.bubble();
                this.resolved = !--this.unresolved;
            },
            createEvaluator: function () {
                if (!this.root._evaluators[this.keypath]) {
                    this.root._evaluators[this.keypath] = new Evaluator(this.root, this.keypath, this.str, this.args, this.mustache.priority);
                } else {
                    this.root._evaluators[this.keypath].refresh();
                }
            }
        };
        return ExpressionResolver;
    }(render_shared_Evaluator__Evaluator, render_shared_ExpressionResolver_ReferenceScout, render_shared_ExpressionResolver_getKeypath, render_shared_ExpressionResolver_reassignDependants);
var render_shared_initMustache = function (resolveRef, ExpressionResolver) {
        
        return function (mustache, options) {
            var keypath, indexRef, parentFragment;
            parentFragment = mustache.parentFragment = options.parentFragment;
            mustache.root = parentFragment.root;
            mustache.contextStack = parentFragment.contextStack;
            mustache.descriptor = options.descriptor;
            mustache.index = options.index || 0;
            mustache.priority = parentFragment.priority;
            mustache.type = options.descriptor.t;
            if (options.descriptor.r) {
                if (parentFragment.indexRefs && parentFragment.indexRefs[options.descriptor.r] !== undefined) {
                    indexRef = parentFragment.indexRefs[options.descriptor.r];
                    mustache.indexRef = options.descriptor.r;
                    mustache.value = indexRef;
                    mustache.render(mustache.value);
                } else {
                    keypath = resolveRef(mustache.root, options.descriptor.r, mustache.contextStack);
                    if (keypath !== undefined) {
                        mustache.resolve(keypath);
                    } else {
                        mustache.ref = options.descriptor.r;
                        mustache.root._pendingResolution[mustache.root._pendingResolution.length] = mustache;
                    }
                }
            }
            if (options.descriptor.x) {
                mustache.expressionResolver = new ExpressionResolver(mustache);
            }
            if (mustache.descriptor.n && !mustache.hasOwnProperty('value')) {
                mustache.render(undefined);
            }
        };
    }(shared_resolveRef, render_shared_ExpressionResolver__ExpressionResolver);
var render_shared_resolveMustache = function (types, registerDependant, unregisterDependant) {
        
        return function (keypath) {
            if (keypath === this.keypath) {
                return;
            }
            if (this.registered) {
                unregisterDependant(this);
            }
            this.keypath = keypath;
            registerDependant(this);
            this.update();
            if (this.root.twoway && this.parentFragment.owner.type === types.ATTRIBUTE) {
                this.parentFragment.owner.element.bind();
            }
            if (this.expressionResolver && this.expressionResolver.resolved) {
                this.expressionResolver = null;
            }
        };
    }(config_types, shared_registerDependant, shared_unregisterDependant);
var render_shared_updateMustache = function (isEqual) {
        
        return function () {
            var wrapped, value;
            value = this.root.get(this.keypath);
            if (wrapped = this.root._wrapped[this.keypath]) {
                value = wrapped.get();
            }
            if (!isEqual(value, this.value)) {
                this.render(value);
                this.value = value;
            }
        };
    }(utils_isEqual);
var render_DomFragment_Interpolator = function (types, teardown, initMustache, resolveMustache, updateMustache) {
        
        var DomInterpolator, lessThan, greaterThan;
        lessThan = /</g;
        greaterThan = />/g;
        DomInterpolator = function (options, docFrag) {
            this.type = types.INTERPOLATOR;
            if (docFrag) {
                this.node = document.createTextNode('');
                docFrag.appendChild(this.node);
            }
            initMustache(this, options);
        };
        DomInterpolator.prototype = {
            update: updateMustache,
            resolve: resolveMustache,
            detach: function () {
                this.node.parentNode.removeChild(this.node);
                return this.node;
            },
            teardown: function (destroy) {
                if (destroy) {
                    this.detach();
                }
                teardown(this);
            },
            render: function (value) {
                if (this.node) {
                    this.node.data = value == undefined ? '' : value;
                }
            },
            firstNode: function () {
                return this.node;
            },
            toString: function () {
                var value = this.value != undefined ? '' + this.value : '';
                return value.replace(lessThan, '&lt;').replace(greaterThan, '&gt;');
            }
        };
        return DomInterpolator;
    }(config_types, shared_teardown, render_shared_initMustache, render_shared_resolveMustache, render_shared_updateMustache);
var render_shared_updateSection = function (isArray, isObject, create) {
        
        return function (section, value) {
            var fragmentOptions;
            fragmentOptions = {
                descriptor: section.descriptor.f,
                root: section.root,
                pNode: section.parentFragment.pNode,
                owner: section
            };
            if (section.descriptor.n) {
                updateConditionalSection(section, value, true, fragmentOptions);
                return;
            }
            if (isArray(value)) {
                updateListSection(section, value, fragmentOptions);
            } else if (isObject(value)) {
                if (section.descriptor.i) {
                    updateListObjectSection(section, value, fragmentOptions);
                } else {
                    updateContextSection(section, fragmentOptions);
                }
            } else {
                updateConditionalSection(section, value, false, fragmentOptions);
            }
        };
        function updateListSection(section, value, fragmentOptions) {
            var i, length, fragmentsToRemove;
            length = value.length;
            if (length < section.length) {
                fragmentsToRemove = section.fragments.splice(length, section.length - length);
                while (fragmentsToRemove.length) {
                    fragmentsToRemove.pop().teardown(true);
                }
            } else {
                if (length > section.length) {
                    for (i = section.length; i < length; i += 1) {
                        fragmentOptions.contextStack = section.contextStack.concat(section.keypath + '.' + i);
                        fragmentOptions.index = i;
                        if (section.descriptor.i) {
                            fragmentOptions.indexRef = section.descriptor.i;
                        }
                        section.fragments[i] = section.createFragment(fragmentOptions);
                    }
                }
            }
            section.length = length;
        }
        function updateListObjectSection(section, value, fragmentOptions) {
            var id, fragmentsById;
            fragmentsById = section.fragmentsById || (section.fragmentsById = create(null));
            for (id in fragmentsById) {
                if (value[id] === undefined && fragmentsById[id]) {
                    fragmentsById[id].teardown(true);
                    fragmentsById[id] = null;
                }
            }
            for (id in value) {
                if (value[id] !== undefined && !fragmentsById[id]) {
                    fragmentOptions.contextStack = section.contextStack.concat(section.keypath + '.' + id);
                    fragmentOptions.index = id;
                    if (section.descriptor.i) {
                        fragmentOptions.indexRef = section.descriptor.i;
                    }
                    fragmentsById[id] = section.createFragment(fragmentOptions);
                }
            }
        }
        function updateContextSection(section, fragmentOptions) {
            if (!section.length) {
                fragmentOptions.contextStack = section.contextStack.concat(section.keypath);
                fragmentOptions.index = 0;
                section.fragments[0] = section.createFragment(fragmentOptions);
                section.length = 1;
            }
        }
        function updateConditionalSection(section, value, inverted, fragmentOptions) {
            var doRender, emptyArray, fragmentsToRemove, fragment;
            emptyArray = isArray(value) && value.length === 0;
            if (inverted) {
                doRender = emptyArray || !value;
            } else {
                doRender = value && !emptyArray;
            }
            if (doRender) {
                if (!section.length) {
                    fragmentOptions.contextStack = section.contextStack;
                    fragmentOptions.index = 0;
                    section.fragments[0] = section.createFragment(fragmentOptions);
                    section.length = 1;
                }
                if (section.length > 1) {
                    fragmentsToRemove = section.fragments.splice(1);
                    while (fragment = fragmentsToRemove.pop()) {
                        fragment.teardown(true);
                    }
                }
            } else if (section.length) {
                section.teardownFragments(true);
                section.length = 0;
            }
        }
    }(utils_isArray, utils_isObject, utils_create);
var render_DomFragment_Section_reassignFragment = function (types, unregisterDependant, ExpressionResolver) {
        
        return reassignFragment;
        function reassignFragment(fragment, indexRef, oldIndex, newIndex, by, oldKeypath, newKeypath) {
            var i, item, context, query;
            if (fragment.html) {
                return;
            }
            if (fragment.indexRefs && fragment.indexRefs[indexRef] !== undefined) {
                fragment.indexRefs[indexRef] = newIndex;
            }
            i = fragment.contextStack.length;
            while (i--) {
                context = fragment.contextStack[i];
                if (context.substr(0, oldKeypath.length) === oldKeypath) {
                    fragment.contextStack[i] = context.replace(oldKeypath, newKeypath);
                }
            }
            i = fragment.items.length;
            while (i--) {
                item = fragment.items[i];
                switch (item.type) {
                case types.ELEMENT:
                    reassignElement(item, indexRef, oldIndex, newIndex, by, oldKeypath, newKeypath);
                    break;
                case types.PARTIAL:
                    reassignFragment(item.fragment, indexRef, oldIndex, newIndex, by, oldKeypath, newKeypath);
                    break;
                case types.COMPONENT:
                    reassignFragment(item.instance.fragment, indexRef, oldIndex, newIndex, by, oldKeypath, newKeypath);
                    if (query = fragment.root._liveComponentQueries[item.name]) {
                        query._makeDirty();
                    }
                    break;
                case types.SECTION:
                case types.INTERPOLATOR:
                case types.TRIPLE:
                    reassignMustache(item, indexRef, oldIndex, newIndex, by, oldKeypath, newKeypath);
                    break;
                }
            }
        }
        function reassignElement(element, indexRef, oldIndex, newIndex, by, oldKeypath, newKeypath) {
            var i, attribute, storage, masterEventName, proxies, proxy, binding, bindings, liveQueries, ractive;
            i = element.attributes.length;
            while (i--) {
                attribute = element.attributes[i];
                if (attribute.fragment) {
                    reassignFragment(attribute.fragment, indexRef, oldIndex, newIndex, by, oldKeypath, newKeypath);
                    if (attribute.twoway) {
                        attribute.updateBindings();
                    }
                }
            }
            if (storage = element.node._ractive) {
                if (storage.keypath.substr(0, oldKeypath.length) === oldKeypath) {
                    storage.keypath = storage.keypath.replace(oldKeypath, newKeypath);
                }
                if (indexRef !== undefined) {
                    storage.index[indexRef] = newIndex;
                }
                for (masterEventName in storage.events) {
                    proxies = storage.events[masterEventName].proxies;
                    i = proxies.length;
                    while (i--) {
                        proxy = proxies[i];
                        if (typeof proxy.n === 'object') {
                            reassignFragment(proxy.a, indexRef, oldIndex, newIndex, by, oldKeypath, newKeypath);
                        }
                        if (proxy.d) {
                            reassignFragment(proxy.d, indexRef, oldIndex, newIndex, by, oldKeypath, newKeypath);
                        }
                    }
                }
                if (binding = storage.binding) {
                    if (binding.keypath.substr(0, oldKeypath.length) === oldKeypath) {
                        bindings = storage.root._twowayBindings[binding.keypath];
                        bindings.splice(bindings.indexOf(binding), 1);
                        binding.keypath = binding.keypath.replace(oldKeypath, newKeypath);
                        bindings = storage.root._twowayBindings[binding.keypath] || (storage.root._twowayBindings[binding.keypath] = []);
                        bindings.push(binding);
                    }
                }
            }
            if (element.fragment) {
                reassignFragment(element.fragment, indexRef, oldIndex, newIndex, by, oldKeypath, newKeypath);
            }
            if (liveQueries = element.liveQueries) {
                ractive = element.root;
                i = liveQueries.length;
                while (i--) {
                    ractive._liveQueries[liveQueries[i]]._makeDirty();
                }
            }
        }
        function reassignMustache(mustache, indexRef, oldIndex, newIndex, by, oldKeypath, newKeypath) {
            var i;
            if (mustache.descriptor.x) {
                if (mustache.expressionResolver) {
                    mustache.expressionResolver.teardown();
                }
                mustache.expressionResolver = new ExpressionResolver(mustache);
            }
            if (mustache.keypath) {
                if (mustache.keypath.substr(0, oldKeypath.length) === oldKeypath) {
                    mustache.resolve(mustache.keypath.replace(oldKeypath, newKeypath));
                }
            } else if (mustache.indexRef === indexRef) {
                mustache.value = newIndex;
                mustache.render(newIndex);
            }
            if (mustache.fragments) {
                i = mustache.fragments.length;
                while (i--) {
                    reassignFragment(mustache.fragments[i], indexRef, oldIndex, newIndex, by, oldKeypath, newKeypath);
                }
            }
        }
    }(config_types, shared_unregisterDependant, render_shared_ExpressionResolver__ExpressionResolver);
var render_DomFragment_Section_reassignFragments = function (types, reassignFragment, preDomUpdate) {
        
        return function (root, section, start, end, by) {
            var i, fragment, indexRef, oldIndex, newIndex, oldKeypath, newKeypath;
            indexRef = section.descriptor.i;
            for (i = start; i < end; i += 1) {
                fragment = section.fragments[i];
                oldIndex = i - by;
                newIndex = i;
                oldKeypath = section.keypath + '.' + (i - by);
                newKeypath = section.keypath + '.' + i;
                fragment.index += by;
                reassignFragment(fragment, indexRef, oldIndex, newIndex, by, oldKeypath, newKeypath);
            }
            preDomUpdate(root);
        };
    }(config_types, render_DomFragment_Section_reassignFragment, shared_preDomUpdate);
var render_DomFragment_Section_prototype_merge = function (reassignFragment) {
        
        return function (newIndices) {
            var section = this, parentFragment, firstChange, changed, i, newLength, newFragments, toTeardown, fragmentOptions, fragment, nextNode;
            parentFragment = this.parentFragment;
            newFragments = [];
            newIndices.forEach(function (newIndex, oldIndex) {
                var by, oldKeypath, newKeypath;
                if (newIndex === oldIndex) {
                    newFragments[newIndex] = section.fragments[oldIndex];
                    return;
                }
                if (firstChange === undefined) {
                    firstChange = oldIndex;
                }
                if (newIndex === -1) {
                    (toTeardown || (toTeardown = [])).push(section.fragments[oldIndex]);
                    return;
                }
                by = newIndex - oldIndex;
                oldKeypath = section.keypath + '.' + oldIndex;
                newKeypath = section.keypath + '.' + newIndex;
                reassignFragment(section.fragments[oldIndex], section.descriptor.i, oldIndex, newIndex, by, oldKeypath, newKeypath);
                newFragments[newIndex] = section.fragments[oldIndex];
                changed = true;
            });
            if (toTeardown) {
                while (fragment = toTeardown.pop()) {
                    fragment.teardown(true);
                }
            }
            if (firstChange === undefined) {
                firstChange = this.length;
            }
            newLength = this.root.get(this.keypath).length;
            if (newLength === firstChange) {
                return;
            }
            fragmentOptions = {
                descriptor: this.descriptor.f,
                root: this.root,
                pNode: parentFragment.pNode,
                owner: this
            };
            if (this.descriptor.i) {
                fragmentOptions.indexRef = this.descriptor.i;
            }
            for (i = firstChange; i < newLength; i += 1) {
                if (fragment = newFragments[i]) {
                    this.docFrag.appendChild(fragment.detach(false));
                } else {
                    fragmentOptions.contextStack = this.contextStack.concat(this.keypath + '.' + i);
                    fragmentOptions.index = i;
                    fragment = this.createFragment(fragmentOptions);
                }
                this.fragments[i] = fragment;
            }
            nextNode = parentFragment.findNextNode(this);
            parentFragment.pNode.insertBefore(this.docFrag, nextNode);
            this.length = newLength;
        };
    }(render_DomFragment_Section_reassignFragment);
var circular = function () {
        
        return [];
    }();
var render_DomFragment_Section__Section = function (types, isClient, initMustache, updateMustache, resolveMustache, updateSection, reassignFragment, reassignFragments, merge, teardown, circular) {
        
        var DomSection, DomFragment;
        circular.push(function () {
            DomFragment = circular.DomFragment;
        });
        DomSection = function (options, docFrag) {
            this.type = types.SECTION;
            this.inverted = !!options.descriptor.n;
            this.fragments = [];
            this.length = 0;
            if (docFrag) {
                this.docFrag = document.createDocumentFragment();
            }
            this.initialising = true;
            initMustache(this, options);
            if (docFrag) {
                docFrag.appendChild(this.docFrag);
            }
            this.initialising = false;
        };
        DomSection.prototype = {
            update: updateMustache,
            resolve: resolveMustache,
            smartUpdate: function (methodName, args) {
                var fragmentOptions;
                if (methodName === 'push' || methodName === 'unshift' || methodName === 'splice') {
                    fragmentOptions = {
                        descriptor: this.descriptor.f,
                        root: this.root,
                        pNode: this.parentFragment.pNode,
                        owner: this
                    };
                    if (this.descriptor.i) {
                        fragmentOptions.indexRef = this.descriptor.i;
                    }
                }
                if (this[methodName]) {
                    this.rendering = true;
                    this[methodName](fragmentOptions, args);
                    this.rendering = false;
                }
            },
            pop: function () {
                if (this.length) {
                    this.fragments.pop().teardown(true);
                    this.length -= 1;
                }
            },
            push: function (fragmentOptions, args) {
                var start, end, i;
                start = this.length;
                end = start + args.length;
                for (i = start; i < end; i += 1) {
                    fragmentOptions.contextStack = this.contextStack.concat(this.keypath + '.' + i);
                    fragmentOptions.index = i;
                    this.fragments[i] = this.createFragment(fragmentOptions);
                }
                this.length += args.length;
                this.parentFragment.pNode.insertBefore(this.docFrag, this.parentFragment.findNextNode(this));
            },
            shift: function () {
                this.splice(null, [
                    0,
                    1
                ]);
            },
            unshift: function (fragmentOptions, args) {
                this.splice(fragmentOptions, [
                    0,
                    0
                ].concat(new Array(args.length)));
            },
            splice: function (fragmentOptions, args) {
                var insertionPoint, addedItems, removedItems, balance, i, start, end, spliceArgs, reassignStart;
                if (!args.length) {
                    return;
                }
                start = +(args[0] < 0 ? this.length + args[0] : args[0]);
                addedItems = Math.max(0, args.length - 2);
                removedItems = args[1] !== undefined ? args[1] : this.length - start;
                removedItems = Math.min(removedItems, this.length - start);
                balance = addedItems - removedItems;
                if (!balance) {
                    return;
                }
                if (balance < 0) {
                    end = start - balance;
                    for (i = start; i < end; i += 1) {
                        this.fragments[i].teardown(true);
                    }
                    this.fragments.splice(start, -balance);
                } else {
                    end = start + balance;
                    insertionPoint = this.fragments[start] ? this.fragments[start].firstNode() : this.parentFragment.findNextNode(this);
                    spliceArgs = [
                        start,
                        0
                    ].concat(new Array(balance));
                    this.fragments.splice.apply(this.fragments, spliceArgs);
                    for (i = start; i < end; i += 1) {
                        fragmentOptions.contextStack = this.contextStack.concat(this.keypath + '.' + i);
                        fragmentOptions.index = i;
                        this.fragments[i] = this.createFragment(fragmentOptions);
                    }
                    this.parentFragment.pNode.insertBefore(this.docFrag, insertionPoint);
                }
                this.length += balance;
                reassignStart = start + addedItems;
                reassignFragments(this.root, this, reassignStart, this.length, balance);
            },
            merge: merge,
            detach: function () {
                var i, len;
                len = this.fragments.length;
                for (i = 0; i < len; i += 1) {
                    this.docFrag.appendChild(this.fragments[i].detach());
                }
                return this.docFrag;
            },
            teardown: function (destroy) {
                this.teardownFragments(destroy);
                teardown(this);
            },
            firstNode: function () {
                if (this.fragments[0]) {
                    return this.fragments[0].firstNode();
                }
                return this.parentFragment.findNextNode(this);
            },
            findNextNode: function (fragment) {
                if (this.fragments[fragment.index + 1]) {
                    return this.fragments[fragment.index + 1].firstNode();
                }
                return this.parentFragment.findNextNode(this);
            },
            teardownFragments: function (destroy) {
                var id, fragment;
                while (fragment = this.fragments.shift()) {
                    fragment.teardown(destroy);
                }
                if (this.fragmentsById) {
                    for (id in this.fragmentsById) {
                        if (this.fragments[id]) {
                            this.fragmentsById[id].teardown(destroy);
                            this.fragmentsById[id] = null;
                        }
                    }
                }
            },
            render: function (value) {
                var nextNode, wrapped;
                if (wrapped = this.root._wrapped[this.keypath]) {
                    value = wrapped.get();
                }
                if (this.rendering) {
                    return;
                }
                this.rendering = true;
                updateSection(this, value);
                this.rendering = false;
                if (this.docFrag && !this.docFrag.childNodes.length) {
                    return;
                }
                if (!this.initialising && isClient) {
                    nextNode = this.parentFragment.findNextNode(this);
                    if (nextNode && nextNode.parentNode === this.parentFragment.pNode) {
                        this.parentFragment.pNode.insertBefore(this.docFrag, nextNode);
                    } else {
                        this.parentFragment.pNode.appendChild(this.docFrag);
                    }
                }
            },
            createFragment: function (options) {
                var fragment = new DomFragment(options);
                if (this.docFrag) {
                    this.docFrag.appendChild(fragment.docFrag);
                }
                return fragment;
            },
            toString: function () {
                var str, i, id, len;
                str = '';
                i = 0;
                len = this.length;
                for (i = 0; i < len; i += 1) {
                    str += this.fragments[i].toString();
                }
                if (this.fragmentsById) {
                    for (id in this.fragmentsById) {
                        if (this.fragmentsById[id]) {
                            str += this.fragmentsById[id].toString();
                        }
                    }
                }
                return str;
            },
            find: function (selector) {
                var i, len, queryResult;
                len = this.fragments.length;
                for (i = 0; i < len; i += 1) {
                    if (queryResult = this.fragments[i].find(selector)) {
                        return queryResult;
                    }
                }
                return null;
            },
            findAll: function (selector, query) {
                var i, len;
                len = this.fragments.length;
                for (i = 0; i < len; i += 1) {
                    this.fragments[i].findAll(selector, query);
                }
            },
            findComponent: function (selector) {
                var i, len, queryResult;
                len = this.fragments.length;
                for (i = 0; i < len; i += 1) {
                    if (queryResult = this.fragments[i].findComponent(selector)) {
                        return queryResult;
                    }
                }
                return null;
            },
            findAllComponents: function (selector, query) {
                var i, len;
                len = this.fragments.length;
                for (i = 0; i < len; i += 1) {
                    this.fragments[i].findAllComponents(selector, query);
                }
            }
        };
        return DomSection;
    }(config_types, config_isClient, render_shared_initMustache, render_shared_updateMustache, render_shared_resolveMustache, render_shared_updateSection, render_DomFragment_Section_reassignFragment, render_DomFragment_Section_reassignFragments, render_DomFragment_Section_prototype_merge, shared_teardown, circular);
var render_DomFragment_Triple = function (types, matches, initMustache, updateMustache, resolveMustache, insertHtml, teardown) {
        
        var DomTriple = function (options, docFrag) {
            this.type = types.TRIPLE;
            if (docFrag) {
                this.nodes = [];
                this.docFrag = document.createDocumentFragment();
            }
            this.initialising = true;
            initMustache(this, options);
            if (docFrag) {
                docFrag.appendChild(this.docFrag);
            }
            this.initialising = false;
        };
        DomTriple.prototype = {
            update: updateMustache,
            resolve: resolveMustache,
            detach: function () {
                var i = this.nodes.length;
                while (i--) {
                    this.docFrag.appendChild(this.nodes[i]);
                }
                return this.docFrag;
            },
            teardown: function (destroy) {
                if (destroy) {
                    this.detach();
                    this.docFrag = this.nodes = null;
                }
                teardown(this);
            },
            firstNode: function () {
                if (this.nodes[0]) {
                    return this.nodes[0];
                }
                return this.parentFragment.findNextNode(this);
            },
            render: function (html) {
                var node, pNode;
                if (!this.nodes) {
                    return;
                }
                while (this.nodes.length) {
                    node = this.nodes.pop();
                    node.parentNode.removeChild(node);
                }
                if (!html) {
                    this.nodes = [];
                    return;
                }
                pNode = this.parentFragment.pNode;
                this.nodes = insertHtml(html, pNode.tagName, this.docFrag);
                if (!this.initialising) {
                    pNode.insertBefore(this.docFrag, this.parentFragment.findNextNode(this));
                }
            },
            toString: function () {
                return this.value != undefined ? this.value : '';
            },
            find: function (selector) {
                var i, len, node, queryResult;
                len = this.nodes.length;
                for (i = 0; i < len; i += 1) {
                    node = this.nodes[i];
                    if (node.nodeType !== 1) {
                        continue;
                    }
                    if (matches(node, selector)) {
                        return node;
                    }
                    if (queryResult = node.querySelector(selector)) {
                        return queryResult;
                    }
                }
                return null;
            },
            findAll: function (selector, queryResult) {
                var i, len, node, queryAllResult, numNodes, j;
                len = this.nodes.length;
                for (i = 0; i < len; i += 1) {
                    node = this.nodes[i];
                    if (node.nodeType !== 1) {
                        continue;
                    }
                    if (matches(node, selector)) {
                        queryResult.push(node);
                    }
                    if (queryAllResult = node.querySelectorAll(selector)) {
                        numNodes = queryAllResult.length;
                        for (j = 0; j < numNodes; j += 1) {
                            queryResult.push(queryAllResult[j]);
                        }
                    }
                }
            }
        };
        return DomTriple;
    }(config_types, utils_matches, render_shared_initMustache, render_shared_updateMustache, render_shared_resolveMustache, render_DomFragment_shared_insertHtml, shared_teardown);
var render_DomFragment_Element_initialise_getElementNamespace = function (namespaces) {
        
        return function (descriptor, parentNode) {
            if (descriptor.a && descriptor.a.xmlns) {
                return descriptor.a.xmlns;
            }
            return descriptor.e === 'svg' ? namespaces.svg : parentNode.namespaceURI || namespaces.html;
        };
    }(config_namespaces);
var render_DomFragment_shared_enforceCase = function () {
        
        var svgCamelCaseElements, svgCamelCaseAttributes, createMap, map;
        svgCamelCaseElements = 'altGlyph altGlyphDef altGlyphItem animateColor animateMotion animateTransform clipPath feBlend feColorMatrix feComponentTransfer feComposite feConvolveMatrix feDiffuseLighting feDisplacementMap feDistantLight feFlood feFuncA feFuncB feFuncG feFuncR feGaussianBlur feImage feMerge feMergeNode feMorphology feOffset fePointLight feSpecularLighting feSpotLight feTile feTurbulence foreignObject glyphRef linearGradient radialGradient textPath vkern'.split(' ');
        svgCamelCaseAttributes = 'attributeName attributeType baseFrequency baseProfile calcMode clipPathUnits contentScriptType contentStyleType diffuseConstant edgeMode externalResourcesRequired filterRes filterUnits glyphRef gradientTransform gradientUnits kernelMatrix kernelUnitLength keyPoints keySplines keyTimes lengthAdjust limitingConeAngle markerHeight markerUnits markerWidth maskContentUnits maskUnits numOctaves pathLength patternContentUnits patternTransform patternUnits pointsAtX pointsAtY pointsAtZ preserveAlpha preserveAspectRatio primitiveUnits refX refY repeatCount repeatDur requiredExtensions requiredFeatures specularConstant specularExponent spreadMethod startOffset stdDeviation stitchTiles surfaceScale systemLanguage tableValues targetX targetY textLength viewBox viewTarget xChannelSelector yChannelSelector zoomAndPan'.split(' ');
        createMap = function (items) {
            var map = {}, i = items.length;
            while (i--) {
                map[items[i].toLowerCase()] = items[i];
            }
            return map;
        };
        map = createMap(svgCamelCaseElements.concat(svgCamelCaseAttributes));
        return function (elementName) {
            var lowerCaseElementName = elementName.toLowerCase();
            return map[lowerCaseElementName] || lowerCaseElementName;
        };
    }();
var render_DomFragment_Attribute_helpers_determineNameAndNamespace = function (namespaces, enforceCase) {
        
        return function (attribute, name) {
            var colonIndex, namespacePrefix;
            colonIndex = name.indexOf(':');
            if (colonIndex !== -1) {
                namespacePrefix = name.substr(0, colonIndex);
                if (namespacePrefix !== 'xmlns') {
                    name = name.substring(colonIndex + 1);
                    attribute.name = enforceCase(name);
                    attribute.lcName = attribute.name.toLowerCase();
                    attribute.namespace = namespaces[namespacePrefix.toLowerCase()];
                    if (!attribute.namespace) {
                        throw 'Unknown namespace ("' + namespacePrefix + '")';
                    }
                    return;
                }
            }
            attribute.name = attribute.element.namespace !== namespaces.html ? enforceCase(name) : name;
            attribute.lcName = attribute.name.toLowerCase();
        };
    }(config_namespaces, render_DomFragment_shared_enforceCase);
var render_DomFragment_Attribute_helpers_setStaticAttribute = function (namespaces) {
        
        return function (attribute, options) {
            var node, value = options.value === null ? '' : options.value;
            if (node = options.pNode) {
                if (attribute.namespace) {
                    node.setAttributeNS(attribute.namespace, options.name, value);
                } else {
                    if (options.name === 'style' && node.style.setAttribute) {
                        node.style.setAttribute('cssText', value);
                    } else if (options.name === 'class' && (!node.namespaceURI || node.namespaceURI === namespaces.html)) {
                        node.className = value;
                    } else {
                        node.setAttribute(options.name, value);
                    }
                }
                if (attribute.name === 'id') {
                    options.root.nodes[options.value] = node;
                }
                if (attribute.name === 'value') {
                    node._ractive.value = options.value;
                }
            }
            attribute.value = options.value;
        };
    }(config_namespaces);
var render_DomFragment_Attribute_helpers_determinePropertyName = function (namespaces) {
        
        var propertyNames = {
                'accept-charset': 'acceptCharset',
                accesskey: 'accessKey',
                bgcolor: 'bgColor',
                'class': 'className',
                codebase: 'codeBase',
                colspan: 'colSpan',
                contenteditable: 'contentEditable',
                datetime: 'dateTime',
                dirname: 'dirName',
                'for': 'htmlFor',
                'http-equiv': 'httpEquiv',
                ismap: 'isMap',
                maxlength: 'maxLength',
                novalidate: 'noValidate',
                pubdate: 'pubDate',
                readonly: 'readOnly',
                rowspan: 'rowSpan',
                tabindex: 'tabIndex',
                usemap: 'useMap'
            };
        return function (attribute, options) {
            var propertyName;
            if (attribute.pNode && !attribute.namespace && (!options.pNode.namespaceURI || options.pNode.namespaceURI === namespaces.html)) {
                propertyName = propertyNames[attribute.name] || attribute.name;
                if (options.pNode[propertyName] !== undefined) {
                    attribute.propertyName = propertyName;
                }
                if (typeof options.pNode[propertyName] === 'boolean' || propertyName === 'value') {
                    attribute.useProperty = true;
                }
            }
        };
    }(config_namespaces);
var render_DomFragment_Attribute_prototype_bind = function (types, warn, arrayContentsMatch, getValueFromCheckboxes) {
        
        var bindAttribute, getInterpolator, updateModel, update, getBinding, inheritProperties, MultipleSelectBinding, SelectBinding, RadioNameBinding, CheckboxNameBinding, CheckedBinding, FileListBinding, ContentEditableBinding, GenericBinding;
        bindAttribute = function () {
            var node = this.pNode, interpolator, binding, bindings;
            if (!this.fragment) {
                return false;
            }
            interpolator = getInterpolator(this);
            if (!interpolator) {
                return false;
            }
            this.interpolator = interpolator;
            this.keypath = interpolator.keypath || interpolator.descriptor.r;
            binding = getBinding(this);
            if (!binding) {
                return false;
            }
            node._ractive.binding = this.element.binding = binding;
            this.twoway = true;
            bindings = this.root._twowayBindings[this.keypath] || (this.root._twowayBindings[this.keypath] = []);
            bindings[bindings.length] = binding;
            return true;
        };
        updateModel = function () {
            this._ractive.binding.update();
        };
        update = function () {
            var value = this._ractive.root.get(this._ractive.binding.keypath);
            this.value = value == undefined ? '' : value;
        };
        getInterpolator = function (attribute) {
            var item, errorMessage;
            if (attribute.fragment.items.length !== 1) {
                return null;
            }
            item = attribute.fragment.items[0];
            if (item.type !== types.INTERPOLATOR) {
                return null;
            }
            if (!item.keypath && !item.ref) {
                return null;
            }
            if (item.keypath && item.keypath.substr(0, 2) === '${') {
                errorMessage = 'You cannot set up two-way binding against an expression ' + item.keypath;
                if (attribute.root.debug) {
                    warn(errorMessage);
                }
                return null;
            }
            return item;
        };
        getBinding = function (attribute) {
            var node = attribute.pNode;
            if (node.tagName === 'SELECT') {
                return node.multiple ? new MultipleSelectBinding(attribute, node) : new SelectBinding(attribute, node);
            }
            if (node.type === 'checkbox' || node.type === 'radio') {
                if (attribute.propertyName === 'name') {
                    if (node.type === 'checkbox') {
                        return new CheckboxNameBinding(attribute, node);
                    }
                    if (node.type === 'radio') {
                        return new RadioNameBinding(attribute, node);
                    }
                }
                if (attribute.propertyName === 'checked') {
                    return new CheckedBinding(attribute, node);
                }
                return null;
            }
            if (attribute.lcName !== 'value') {
                warn('This is... odd');
            }
            if (node.type === 'file') {
                return new FileListBinding(attribute, node);
            }
            if (node.getAttribute('contenteditable')) {
                return new ContentEditableBinding(attribute, node);
            }
            return new GenericBinding(attribute, node);
        };
        MultipleSelectBinding = function (attribute, node) {
            var valueFromModel;
            inheritProperties(this, attribute, node);
            node.addEventListener('change', updateModel, false);
            valueFromModel = this.root.get(this.keypath);
            if (valueFromModel === undefined) {
                this.update();
            }
        };
        MultipleSelectBinding.prototype = {
            value: function () {
                var value, options, i, len;
                value = [];
                options = this.node.options;
                len = options.length;
                for (i = 0; i < len; i += 1) {
                    if (options[i].selected) {
                        value[value.length] = options[i]._ractive.value;
                    }
                }
                return value;
            },
            update: function () {
                var attribute, previousValue, value;
                attribute = this.attr;
                previousValue = attribute.value;
                value = this.value();
                if (previousValue === undefined || !arrayContentsMatch(value, previousValue)) {
                    attribute.receiving = true;
                    attribute.value = value;
                    this.root.set(this.keypath, value);
                    attribute.receiving = false;
                }
                return this;
            },
            deferUpdate: function () {
                if (this.deferred === true) {
                    return;
                }
                this.root._deferred.attrs.push(this);
                this.deferred = true;
            },
            teardown: function () {
                this.node.removeEventListener('change', updateModel, false);
            }
        };
        SelectBinding = function (attribute, node) {
            var valueFromModel;
            inheritProperties(this, attribute, node);
            node.addEventListener('change', updateModel, false);
            valueFromModel = this.root.get(this.keypath);
            if (valueFromModel === undefined) {
                this.update();
            }
        };
        SelectBinding.prototype = {
            value: function () {
                var options, i, len;
                options = this.node.options;
                len = options.length;
                for (i = 0; i < len; i += 1) {
                    if (options[i].selected) {
                        return options[i]._ractive.value;
                    }
                }
            },
            update: function () {
                var value = this.value();
                this.attr.receiving = true;
                this.attr.value = value;
                this.root.set(this.keypath, value);
                this.attr.receiving = false;
                return this;
            },
            deferUpdate: function () {
                if (this.deferred === true) {
                    return;
                }
                this.root._deferred.attrs.push(this);
                this.deferred = true;
            },
            teardown: function () {
                this.node.removeEventListener('change', updateModel, false);
            }
        };
        RadioNameBinding = function (attribute, node) {
            var valueFromModel;
            this.radioName = true;
            inheritProperties(this, attribute, node);
            node.name = '{{' + attribute.keypath + '}}';
            node.addEventListener('change', updateModel, false);
            if (node.attachEvent) {
                node.addEventListener('click', updateModel, false);
            }
            valueFromModel = this.root.get(this.keypath);
            if (valueFromModel !== undefined) {
                node.checked = valueFromModel == node._ractive.value;
            } else {
                this.root._deferred.radios.push(this);
            }
        };
        RadioNameBinding.prototype = {
            value: function () {
                return this.node._ractive ? this.node._ractive.value : this.node.value;
            },
            update: function () {
                var node = this.node;
                if (node.checked) {
                    this.attr.receiving = true;
                    this.root.set(this.keypath, this.value());
                    this.attr.receiving = false;
                }
            },
            teardown: function () {
                this.node.removeEventListener('change', updateModel, false);
                this.node.removeEventListener('click', updateModel, false);
            }
        };
        CheckboxNameBinding = function (attribute, node) {
            var valueFromModel, checked;
            this.checkboxName = true;
            inheritProperties(this, attribute, node);
            node.name = '{{' + this.keypath + '}}';
            node.addEventListener('change', updateModel, false);
            if (node.attachEvent) {
                node.addEventListener('click', updateModel, false);
            }
            valueFromModel = this.root.get(this.keypath);
            if (valueFromModel !== undefined) {
                checked = valueFromModel.indexOf(node._ractive.value) !== -1;
                node.checked = checked;
            } else {
                if (this.root._deferred.checkboxes.indexOf(this.keypath) === -1) {
                    this.root._deferred.checkboxes.push(this.keypath);
                }
            }
        };
        CheckboxNameBinding.prototype = {
            changed: function () {
                return this.node.checked !== !!this.checked;
            },
            update: function () {
                this.checked = this.node.checked;
                this.attr.receiving = true;
                this.root.set(this.keypath, getValueFromCheckboxes(this.root, this.keypath));
                this.attr.receiving = false;
            },
            teardown: function () {
                this.node.removeEventListener('change', updateModel, false);
                this.node.removeEventListener('click', updateModel, false);
            }
        };
        CheckedBinding = function (attribute, node) {
            inheritProperties(this, attribute, node);
            node.addEventListener('change', updateModel, false);
            if (node.attachEvent) {
                node.addEventListener('click', updateModel, false);
            }
        };
        CheckedBinding.prototype = {
            value: function () {
                return this.node.checked;
            },
            update: function () {
                this.attr.receiving = true;
                this.root.set(this.keypath, this.value());
                this.attr.receiving = false;
            },
            teardown: function () {
                this.node.removeEventListener('change', updateModel, false);
                this.node.removeEventListener('click', updateModel, false);
            }
        };
        FileListBinding = function (attribute, node) {
            inheritProperties(this, attribute, node);
            node.addEventListener('change', updateModel, false);
        };
        FileListBinding.prototype = {
            value: function () {
                return this.attr.pNode.files;
            },
            update: function () {
                this.attr.root.set(this.attr.keypath, this.value());
            },
            teardown: function () {
                this.node.removeEventListener('change', updateModel, false);
            }
        };
        ContentEditableBinding = function (attribute, node) {
            inheritProperties(this, attribute, node);
            node.addEventListener('change', updateModel, false);
            if (!this.root.lazy) {
                node.addEventListener('input', updateModel, false);
                if (node.attachEvent) {
                    node.addEventListener('keyup', updateModel, false);
                }
            }
        };
        ContentEditableBinding.prototype = {
            update: function () {
                this.attr.receiving = true;
                this.root.set(this.keypath, this.node.innerHTML);
                this.attr.receiving = false;
            },
            teardown: function () {
                this.node.removeEventListener('change', updateModel, false);
                this.node.removeEventListener('input', updateModel, false);
                this.node.removeEventListener('keyup', updateModel, false);
            }
        };
        GenericBinding = function (attribute, node) {
            inheritProperties(this, attribute, node);
            node.addEventListener('change', updateModel, false);
            if (!this.root.lazy) {
                node.addEventListener('input', updateModel, false);
                if (node.attachEvent) {
                    node.addEventListener('keyup', updateModel, false);
                }
            }
            this.node.addEventListener('blur', update, false);
        };
        GenericBinding.prototype = {
            value: function () {
                var value = this.attr.pNode.value;
                if (+value + '' === value && value.indexOf('e') === -1) {
                    value = +value;
                }
                return value;
            },
            update: function () {
                var attribute = this.attr, value = this.value();
                attribute.receiving = true;
                attribute.root.set(attribute.keypath, value);
                attribute.receiving = false;
            },
            teardown: function () {
                this.node.removeEventListener('change', updateModel, false);
                this.node.removeEventListener('input', updateModel, false);
                this.node.removeEventListener('keyup', updateModel, false);
                this.node.removeEventListener('blur', update, false);
            }
        };
        inheritProperties = function (binding, attribute, node) {
            binding.attr = attribute;
            binding.node = node;
            binding.root = attribute.root;
            binding.keypath = attribute.keypath;
        };
        return bindAttribute;
    }(config_types, utils_warn, utils_arrayContentsMatch, shared_getValueFromCheckboxes);
var render_DomFragment_Attribute_prototype_update = function (isArray, namespaces) {
        
        var updateAttribute, updateFileInputValue, deferSelect, initSelect, updateSelect, updateMultipleSelect, updateRadioName, updateCheckboxName, updateIEStyleAttribute, updateClassName, updateContentEditableValue, updateEverythingElse;
        updateAttribute = function () {
            var node;
            if (!this.ready) {
                return this;
            }
            node = this.pNode;
            if (node.tagName === 'SELECT' && this.lcName === 'value') {
                this.update = deferSelect;
                this.deferredUpdate = initSelect;
                return this.update();
            }
            if (this.isFileInputValue) {
                this.update = updateFileInputValue;
                return this;
            }
            if (this.twoway && this.lcName === 'name') {
                if (node.type === 'radio') {
                    this.update = updateRadioName;
                    return this.update();
                }
                if (node.type === 'checkbox') {
                    this.update = updateCheckboxName;
                    return this.update();
                }
            }
            if (this.lcName === 'style' && node.style.setAttribute) {
                this.update = updateIEStyleAttribute;
                return this.update();
            }
            if (this.lcName === 'class' && (!node.namespaceURI || node.namespaceURI === namespaces.html)) {
                this.update = updateClassName;
                return this.update();
            }
            if (node.getAttribute('contenteditable') && this.lcName === 'value') {
                this.update = updateContentEditableValue;
                return this.update();
            }
            this.update = updateEverythingElse;
            return this.update();
        };
        updateFileInputValue = function () {
            return this;
        };
        initSelect = function () {
            this.deferredUpdate = this.pNode.multiple ? updateMultipleSelect : updateSelect;
            this.deferredUpdate();
        };
        deferSelect = function () {
            this.root._deferred.selectValues.push(this);
            return this;
        };
        updateSelect = function () {
            var value = this.fragment.getValue(), options, option, i;
            this.value = this.pNode._ractive.value = value;
            options = this.pNode.options;
            i = options.length;
            while (i--) {
                option = options[i];
                if (option._ractive.value == value) {
                    option.selected = true;
                    return this;
                }
            }
            return this;
        };
        updateMultipleSelect = function () {
            var value = this.fragment.getValue(), options, i;
            if (!isArray(value)) {
                value = [value];
            }
            options = this.pNode.options;
            i = options.length;
            while (i--) {
                options[i].selected = value.indexOf(options[i]._ractive.value) !== -1;
            }
            this.value = value;
            return this;
        };
        updateRadioName = function () {
            var node, value;
            node = this.pNode;
            value = this.fragment.getValue();
            node.checked = value == node._ractive.value;
            return this;
        };
        updateCheckboxName = function () {
            var node, value;
            node = this.pNode;
            value = this.fragment.getValue();
            if (!isArray(value)) {
                node.checked = value == node._ractive.value;
                return this;
            }
            node.checked = value.indexOf(node._ractive.value) !== -1;
            return this;
        };
        updateIEStyleAttribute = function () {
            var node, value;
            node = this.pNode;
            value = this.fragment.getValue();
            if (value === undefined) {
                value = '';
            }
            if (value !== this.value) {
                node.style.setAttribute('cssText', value);
                this.value = value;
            }
            return this;
        };
        updateClassName = function () {
            var node, value;
            node = this.pNode;
            value = this.fragment.getValue();
            if (value === undefined) {
                value = '';
            }
            if (value !== this.value) {
                node.className = value;
                this.value = value;
            }
            return this;
        };
        updateContentEditableValue = function () {
            var node, value;
            node = this.pNode;
            value = this.fragment.getValue();
            if (value === undefined) {
                value = '';
            }
            if (value !== this.value) {
                if (!this.receiving) {
                    node.innerHTML = value;
                }
                this.value = value;
            }
            return this;
        };
        updateEverythingElse = function () {
            var node, value;
            node = this.pNode;
            value = this.fragment.getValue();
            if (this.isValueAttribute) {
                node._ractive.value = value;
            }
            if (value === undefined) {
                value = '';
            }
            if (value !== this.value) {
                if (this.useProperty) {
                    if (!this.receiving) {
                        node[this.propertyName] = value;
                    }
                    this.value = value;
                    return this;
                }
                if (this.namespace) {
                    node.setAttributeNS(this.namespace, this.name, value);
                    this.value = value;
                    return this;
                }
                if (this.lcName === 'id') {
                    if (this.value !== undefined) {
                        this.root.nodes[this.value] = undefined;
                    }
                    this.root.nodes[value] = node;
                }
                node.setAttribute(this.name, value);
                this.value = value;
            }
            return this;
        };
        return updateAttribute;
    }(utils_isArray, config_namespaces);
var parse_Tokenizer_utils_getStringMatch = function () {
        
        return function (string) {
            var substr;
            substr = this.str.substr(this.pos, string.length);
            if (substr === string) {
                this.pos += string.length;
                return string;
            }
            return null;
        };
    }();
var parse_Tokenizer_utils_allowWhitespace = function () {
        
        var leadingWhitespace = /^\s+/;
        return function () {
            var match = leadingWhitespace.exec(this.remaining());
            if (!match) {
                return null;
            }
            this.pos += match[0].length;
            return match[0];
        };
    }();
var parse_Tokenizer_utils_makeRegexMatcher = function () {
        
        return function (regex) {
            return function (tokenizer) {
                var match = regex.exec(tokenizer.str.substring(tokenizer.pos));
                if (!match) {
                    return null;
                }
                tokenizer.pos += match[0].length;
                return match[1] || match[0];
            };
        };
    }();
var parse_Tokenizer_getExpression_getPrimary_getLiteral_getStringLiteral_getEscapedChars = function () {
        
        return function (tokenizer) {
            var chars = '', character;
            character = getEscapedChar(tokenizer);
            while (character) {
                chars += character;
                character = getEscapedChar(tokenizer);
            }
            return chars || null;
        };
        function getEscapedChar(tokenizer) {
            var character;
            if (!tokenizer.getStringMatch('\\')) {
                return null;
            }
            character = tokenizer.str.charAt(tokenizer.pos);
            tokenizer.pos += 1;
            return character;
        }
    }();
var parse_Tokenizer_getExpression_getPrimary_getLiteral_getStringLiteral_getQuotedString = function (makeRegexMatcher, getEscapedChars) {
        
        var getUnescapedDoubleQuotedChars = makeRegexMatcher(/^[^\\"]+/), getUnescapedSingleQuotedChars = makeRegexMatcher(/^[^\\']+/);
        return function getQuotedString(tokenizer, singleQuotes) {
            var start, string, escaped, unescaped, next, matcher;
            start = tokenizer.pos;
            string = '';
            matcher = singleQuotes ? getUnescapedSingleQuotedChars : getUnescapedDoubleQuotedChars;
            escaped = getEscapedChars(tokenizer);
            if (escaped) {
                string += escaped;
            }
            unescaped = matcher(tokenizer);
            if (unescaped) {
                string += unescaped;
            }
            if (!string) {
                return '';
            }
            next = getQuotedString(tokenizer, singleQuotes);
            while (next !== '') {
                string += next;
            }
            return string;
        };
    }(parse_Tokenizer_utils_makeRegexMatcher, parse_Tokenizer_getExpression_getPrimary_getLiteral_getStringLiteral_getEscapedChars);
var parse_Tokenizer_getExpression_getPrimary_getLiteral_getStringLiteral__getStringLiteral = function (types, getQuotedString) {
        
        return function (tokenizer) {
            var start, string;
            start = tokenizer.pos;
            if (tokenizer.getStringMatch('"')) {
                string = getQuotedString(tokenizer, false);
                if (!tokenizer.getStringMatch('"')) {
                    tokenizer.pos = start;
                    return null;
                }
                return {
                    t: types.STRING_LITERAL,
                    v: string
                };
            }
            if (tokenizer.getStringMatch('\'')) {
                string = getQuotedString(tokenizer, true);
                if (!tokenizer.getStringMatch('\'')) {
                    tokenizer.pos = start;
                    return null;
                }
                return {
                    t: types.STRING_LITERAL,
                    v: string
                };
            }
            return null;
        };
    }(config_types, parse_Tokenizer_getExpression_getPrimary_getLiteral_getStringLiteral_getQuotedString);
var parse_Tokenizer_getExpression_getPrimary_getLiteral_getNumberLiteral = function (types, makeRegexMatcher) {
        
        var getNumber = makeRegexMatcher(/^(?:[+-]?)(?:(?:(?:0|[1-9]\d*)?\.\d+)|(?:(?:0|[1-9]\d*)\.)|(?:0|[1-9]\d*))(?:[eE][+-]?\d+)?/);
        return function (tokenizer) {
            var result;
            if (result = getNumber(tokenizer)) {
                return {
                    t: types.NUMBER_LITERAL,
                    v: result
                };
            }
            return null;
        };
    }(config_types, parse_Tokenizer_utils_makeRegexMatcher);
var parse_Tokenizer_getExpression_shared_getName = function (makeRegexMatcher) {
        
        return makeRegexMatcher(/^[a-zA-Z_$][a-zA-Z_$0-9]*/);
    }(parse_Tokenizer_utils_makeRegexMatcher);
var parse_Tokenizer_getExpression_shared_getKey = function (getStringLiteral, getNumberLiteral, getName) {
        
        var identifier = /^[a-zA-Z_$][a-zA-Z_$0-9]*$/;
        return function (tokenizer) {
            var token;
            if (token = getStringLiteral(tokenizer)) {
                return identifier.test(token.v) ? token.v : '"' + token.v.replace(/"/g, '\\"') + '"';
            }
            if (token = getNumberLiteral(tokenizer)) {
                return token.v;
            }
            if (token = getName(tokenizer)) {
                return token;
            }
        };
    }(parse_Tokenizer_getExpression_getPrimary_getLiteral_getStringLiteral__getStringLiteral, parse_Tokenizer_getExpression_getPrimary_getLiteral_getNumberLiteral, parse_Tokenizer_getExpression_shared_getName);
var utils_parseJSON = function (getStringMatch, allowWhitespace, getStringLiteral, getKey) {
        
        var Tokenizer, specials, specialsPattern, numberPattern, placeholderPattern, placeholderAtStartPattern;
        specials = {
            'true': true,
            'false': false,
            'undefined': undefined,
            'null': null
        };
        specialsPattern = new RegExp('^(?:' + Object.keys(specials).join('|') + ')');
        numberPattern = /^(?:[+-]?)(?:(?:(?:0|[1-9]\d*)?\.\d+)|(?:(?:0|[1-9]\d*)\.)|(?:0|[1-9]\d*))(?:[eE][+-]?\d+)?/;
        placeholderPattern = /\$\{([^\}]+)\}/g;
        placeholderAtStartPattern = /^\$\{([^\}]+)\}/;
        Tokenizer = function (str, values) {
            this.str = str;
            this.values = values;
            this.pos = 0;
            this.result = this.getToken();
        };
        Tokenizer.prototype = {
            remaining: function () {
                return this.str.substring(this.pos);
            },
            getStringMatch: getStringMatch,
            getToken: function () {
                this.allowWhitespace();
                return this.getPlaceholder() || this.getSpecial() || this.getNumber() || this.getString() || this.getObject() || this.getArray();
            },
            getPlaceholder: function () {
                var match;
                if (!this.values) {
                    return null;
                }
                if ((match = placeholderAtStartPattern.exec(this.remaining())) && this.values.hasOwnProperty(match[1])) {
                    this.pos += match[0].length;
                    return { v: this.values[match[1]] };
                }
            },
            getSpecial: function () {
                var match;
                if (match = specialsPattern.exec(this.remaining())) {
                    this.pos += match[0].length;
                    return { v: specials[match[0]] };
                }
            },
            getNumber: function () {
                var match;
                if (match = numberPattern.exec(this.remaining())) {
                    this.pos += match[0].length;
                    return { v: +match[0] };
                }
            },
            getString: function () {
                var stringLiteral = getStringLiteral(this), values;
                if (stringLiteral && (values = this.values)) {
                    return {
                        v: stringLiteral.v.replace(placeholderPattern, function (match, $1) {
                            return values[$1] || $1;
                        })
                    };
                }
                return stringLiteral;
            },
            getObject: function () {
                var result, pair;
                if (!this.getStringMatch('{')) {
                    return null;
                }
                result = {};
                while (pair = getKeyValuePair(this)) {
                    result[pair.key] = pair.value;
                    this.allowWhitespace();
                    if (this.getStringMatch('}')) {
                        return { v: result };
                    }
                    if (!this.getStringMatch(',')) {
                        return null;
                    }
                }
                return null;
            },
            getArray: function () {
                var result, valueToken;
                if (!this.getStringMatch('[')) {
                    return null;
                }
                result = [];
                while (valueToken = this.getToken()) {
                    result.push(valueToken.v);
                    if (this.getStringMatch(']')) {
                        return { v: result };
                    }
                    if (!this.getStringMatch(',')) {
                        return null;
                    }
                }
                return null;
            },
            allowWhitespace: allowWhitespace
        };
        function getKeyValuePair(tokenizer) {
            var key, valueToken, pair;
            tokenizer.allowWhitespace();
            key = getKey(tokenizer);
            if (!key) {
                return null;
            }
            pair = { key: key };
            tokenizer.allowWhitespace();
            if (!tokenizer.getStringMatch(':')) {
                return null;
            }
            tokenizer.allowWhitespace();
            valueToken = tokenizer.getToken();
            if (!valueToken) {
                return null;
            }
            pair.value = valueToken.v;
            return pair;
        }
        return function (str, values) {
            var tokenizer = new Tokenizer(str, values);
            if (tokenizer.result) {
                return {
                    value: tokenizer.result.v,
                    remaining: tokenizer.remaining()
                };
            }
            return null;
        };
    }(parse_Tokenizer_utils_getStringMatch, parse_Tokenizer_utils_allowWhitespace, parse_Tokenizer_getExpression_getPrimary_getLiteral_getStringLiteral__getStringLiteral, parse_Tokenizer_getExpression_shared_getKey);
var render_StringFragment_Interpolator = function (types, teardown, initMustache, updateMustache, resolveMustache) {
        
        var StringInterpolator = function (options) {
            this.type = types.INTERPOLATOR;
            initMustache(this, options);
        };
        StringInterpolator.prototype = {
            update: updateMustache,
            resolve: resolveMustache,
            render: function (value) {
                this.value = value;
                this.parentFragment.bubble();
            },
            teardown: function () {
                teardown(this);
            },
            toString: function () {
                if (this.value == undefined) {
                    return '';
                }
                return stringify(this.value);
            }
        };
        return StringInterpolator;
        function stringify(value) {
            if (typeof value === 'string') {
                return value;
            }
            return JSON.stringify(value);
        }
    }(config_types, shared_teardown, render_shared_initMustache, render_shared_updateMustache, render_shared_resolveMustache);
var render_StringFragment_Section = function (types, initMustache, updateMustache, resolveMustache, updateSection, teardown, circular) {
        
        var StringSection, StringFragment;
        circular.push(function () {
            StringFragment = circular.StringFragment;
        });
        StringSection = function (options) {
            this.type = types.SECTION;
            this.fragments = [];
            this.length = 0;
            initMustache(this, options);
        };
        StringSection.prototype = {
            update: updateMustache,
            resolve: resolveMustache,
            teardown: function () {
                this.teardownFragments();
                teardown(this);
            },
            teardownFragments: function () {
                while (this.fragments.length) {
                    this.fragments.shift().teardown();
                }
                this.length = 0;
            },
            bubble: function () {
                this.value = this.fragments.join('');
                this.parentFragment.bubble();
            },
            render: function (value) {
                var wrapped;
                if (wrapped = this.root._wrapped[this.keypath]) {
                    value = wrapped.get();
                }
                updateSection(this, value);
                this.parentFragment.bubble();
            },
            createFragment: function (options) {
                return new StringFragment(options);
            },
            toString: function () {
                return this.fragments.join('');
            }
        };
        return StringSection;
    }(config_types, render_shared_initMustache, render_shared_updateMustache, render_shared_resolveMustache, render_shared_updateSection, shared_teardown, circular);
var render_StringFragment_Text = function (types) {
        
        var StringText = function (text) {
            this.type = types.TEXT;
            this.text = text;
        };
        StringText.prototype = {
            toString: function () {
                return this.text;
            },
            teardown: function () {
            }
        };
        return StringText;
    }(config_types);
var render_StringFragment_prototype_toArgsList = function (warn, parseJSON) {
        
        return function () {
            var values, counter, jsonesque, guid, errorMessage, parsed, processItems;
            if (!this.argsList || this.dirty) {
                values = {};
                counter = 0;
                guid = this.root._guid;
                processItems = function (items) {
                    return items.map(function (item) {
                        var placeholderId, wrapped, value;
                        if (item.text) {
                            return item.text;
                        }
                        if (item.fragments) {
                            return item.fragments.map(function (fragment) {
                                return processItems(fragment.items);
                            }).join('');
                        }
                        placeholderId = guid + '-' + counter++;
                        if (wrapped = item.root._wrapped[item.keypath]) {
                            value = wrapped.value;
                        } else {
                            value = item.value;
                        }
                        values[placeholderId] = value;
                        return '${' + placeholderId + '}';
                    }).join('');
                };
                jsonesque = processItems(this.items);
                parsed = parseJSON('[' + jsonesque + ']', values);
                if (!parsed) {
                    errorMessage = 'Could not parse directive arguments (' + this.toString() + '). If you think this is a bug, please file an issue at http://github.com/RactiveJS/Ractive/issues';
                    if (this.root.debug) {
                        throw new Error(errorMessage);
                    } else {
                        warn(errorMessage);
                        this.argsList = [jsonesque];
                    }
                } else {
                    this.argsList = parsed.value;
                }
                this.dirty = false;
            }
            return this.argsList;
        };
    }(utils_warn, utils_parseJSON);
var render_StringFragment__StringFragment = function (types, parseJSON, initFragment, Interpolator, Section, Text, toArgsList, circular) {
        
        var StringFragment = function (options) {
            initFragment(this, options);
        };
        StringFragment.prototype = {
            createItem: function (options) {
                if (typeof options.descriptor === 'string') {
                    return new Text(options.descriptor);
                }
                switch (options.descriptor.t) {
                case types.INTERPOLATOR:
                    return new Interpolator(options);
                case types.TRIPLE:
                    return new Interpolator(options);
                case types.SECTION:
                    return new Section(options);
                default:
                    throw 'Something went wrong in a rather interesting way';
                }
            },
            bubble: function () {
                this.dirty = true;
                this.owner.bubble();
            },
            teardown: function () {
                var numItems, i;
                numItems = this.items.length;
                for (i = 0; i < numItems; i += 1) {
                    this.items[i].teardown();
                }
            },
            getValue: function () {
                var value;
                if (this.items.length === 1 && this.items[0].type === types.INTERPOLATOR) {
                    value = this.items[0].value;
                    if (value !== undefined) {
                        return value;
                    }
                }
                return this.toString();
            },
            isSimple: function () {
                var i, item, containsInterpolator;
                if (this.simple !== undefined) {
                    return this.simple;
                }
                i = this.items.length;
                while (i--) {
                    item = this.items[i];
                    if (item.type === types.TEXT) {
                        continue;
                    }
                    if (item.type === types.INTERPOLATOR) {
                        if (containsInterpolator) {
                            return false;
                        } else {
                            containsInterpolator = true;
                            continue;
                        }
                    }
                    return this.simple = false;
                }
                return this.simple = true;
            },
            toString: function () {
                return this.items.join('');
            },
            toJSON: function () {
                var value = this.getValue(), parsed;
                if (typeof value === 'string') {
                    parsed = parseJSON(value);
                    value = parsed ? parsed.value : value;
                }
                return value;
            },
            toArgsList: toArgsList
        };
        circular.StringFragment = StringFragment;
        return StringFragment;
    }(config_types, utils_parseJSON, render_shared_initFragment, render_StringFragment_Interpolator, render_StringFragment_Section, render_StringFragment_Text, render_StringFragment_prototype_toArgsList, circular);
var render_DomFragment_Attribute__Attribute = function (types, determineNameAndNamespace, setStaticAttribute, determinePropertyName, bind, update, StringFragment) {
        
        var DomAttribute = function (options) {
            this.type = types.ATTRIBUTE;
            this.element = options.element;
            determineNameAndNamespace(this, options.name);
            if (options.value === null || typeof options.value === 'string') {
                setStaticAttribute(this, options);
                return;
            }
            this.root = options.root;
            this.pNode = options.pNode;
            this.parentFragment = this.element.parentFragment;
            this.fragment = new StringFragment({
                descriptor: options.value,
                root: this.root,
                owner: this,
                contextStack: options.contextStack
            });
            if (!this.pNode) {
                return;
            }
            if (this.name === 'value') {
                this.isValueAttribute = true;
                if (this.pNode.tagName === 'INPUT' && this.pNode.type === 'file') {
                    this.isFileInputValue = true;
                }
            }
            determinePropertyName(this, options);
            this.selfUpdating = this.fragment.isSimple();
            this.ready = true;
        };
        DomAttribute.prototype = {
            bind: bind,
            update: update,
            updateBindings: function () {
                this.keypath = this.interpolator.keypath || this.interpolator.ref;
                if (this.propertyName === 'name') {
                    this.pNode.name = '{{' + this.keypath + '}}';
                }
            },
            teardown: function () {
                var i;
                if (this.boundEvents) {
                    i = this.boundEvents.length;
                    while (i--) {
                        this.pNode.removeEventListener(this.boundEvents[i], this.updateModel, false);
                    }
                }
                if (this.fragment) {
                    this.fragment.teardown();
                }
            },
            bubble: function () {
                if (this.selfUpdating) {
                    this.update();
                } else if (!this.deferred && this.ready) {
                    this.root._deferred.attrs.push(this);
                    this.deferred = true;
                }
            },
            toString: function () {
                var str;
                if (this.value === null) {
                    return this.name;
                }
                if (!this.fragment) {
                    return this.name + '=' + JSON.stringify(this.value);
                }
                str = this.fragment.toString();
                return this.name + '=' + JSON.stringify(str);
            }
        };
        return DomAttribute;
    }(config_types, render_DomFragment_Attribute_helpers_determineNameAndNamespace, render_DomFragment_Attribute_helpers_setStaticAttribute, render_DomFragment_Attribute_helpers_determinePropertyName, render_DomFragment_Attribute_prototype_bind, render_DomFragment_Attribute_prototype_update, render_StringFragment__StringFragment);
var render_DomFragment_Element_initialise_createElementAttributes = function (DomAttribute) {
        
        return function (element, attributes) {
            var attrName, attrValue, attr;
            element.attributes = [];
            for (attrName in attributes) {
                if (attributes.hasOwnProperty(attrName)) {
                    attrValue = attributes[attrName];
                    attr = new DomAttribute({
                        element: element,
                        name: attrName,
                        value: attrValue,
                        root: element.root,
                        pNode: element.node,
                        contextStack: element.parentFragment.contextStack
                    });
                    element.attributes[element.attributes.length] = element.attributes[attrName] = attr;
                    if (attrName !== 'name') {
                        attr.update();
                    }
                }
            }
            return element.attributes;
        };
    }(render_DomFragment_Attribute__Attribute);
var render_DomFragment_Element_initialise_appendElementChildren = function (warn, namespaces, StringFragment, circular) {
        
        var DomFragment, updateCss, updateScript;
        circular.push(function () {
            DomFragment = circular.DomFragment;
        });
        updateCss = function () {
            var node = this.node, content = this.fragment.toString();
            if (node.styleSheet) {
                node.styleSheet.cssText = content;
            }
            node.innerHTML = content;
        };
        updateScript = function () {
            if (!this.node.type || this.node.type === 'text/javascript') {
                warn('Script tag was updated. This does not cause the code to be re-evaluated!');
            }
            this.node.innerHTML = this.fragment.toString();
        };
        return function (element, node, descriptor, docFrag) {
            var liveQueries, i, selector, queryAllResult, j;
            if (element.lcName === 'script' || element.lcName === 'style') {
                element.fragment = new StringFragment({
                    descriptor: descriptor.f,
                    root: element.root,
                    contextStack: element.parentFragment.contextStack,
                    owner: element
                });
                if (docFrag) {
                    if (element.lcName === 'script') {
                        element.bubble = updateScript;
                        element.node.innerHTML = element.fragment.toString();
                    } else {
                        element.bubble = updateCss;
                        element.bubble();
                    }
                }
                return;
            }
            if (typeof descriptor.f === 'string' && (!node || (!node.namespaceURI || node.namespaceURI === namespaces.html))) {
                element.html = descriptor.f;
                if (docFrag) {
                    node.innerHTML = element.html;
                    liveQueries = element.root._liveQueries;
                    i = liveQueries.length;
                    while (i--) {
                        selector = liveQueries[i];
                        if ((queryAllResult = node.querySelectorAll(selector)) && (j = queryAllResult.length)) {
                            (element.liveQueries || (element.liveQueries = [])).push(selector);
                            element.liveQueries[selector] = [];
                            while (j--) {
                                element.liveQueries[selector][j] = queryAllResult[j];
                            }
                        }
                    }
                }
            } else {
                element.fragment = new DomFragment({
                    descriptor: descriptor.f,
                    root: element.root,
                    pNode: node,
                    contextStack: element.parentFragment.contextStack,
                    owner: element
                });
                if (docFrag) {
                    node.appendChild(element.fragment.docFrag);
                }
            }
        };
    }(utils_warn, config_namespaces, render_StringFragment__StringFragment, circular);
var render_DomFragment_Element_initialise_decorate_Decorator = function (warn, StringFragment) {
        
        var Decorator = function (descriptor, root, owner, contextStack) {
            var name, fragment, errorMessage;
            this.root = root;
            this.node = owner.node;
            name = descriptor.n || descriptor;
            if (typeof name !== 'string') {
                fragment = new StringFragment({
                    descriptor: name,
                    root: this.root,
                    owner: owner,
                    contextStack: contextStack
                });
                name = fragment.toString();
                fragment.teardown();
            }
            if (descriptor.a) {
                this.params = descriptor.a;
            } else if (descriptor.d) {
                fragment = new StringFragment({
                    descriptor: descriptor.d,
                    root: this.root,
                    owner: owner,
                    contextStack: contextStack
                });
                this.params = fragment.toArgsList();
                fragment.teardown();
            }
            this.fn = root.decorators[name];
            if (!this.fn) {
                errorMessage = 'Missing "' + name + '" decorator. You may need to download a plugin via https://github.com/RactiveJS/Ractive/wiki/Plugins#decorators';
                if (root.debug) {
                    throw new Error(errorMessage);
                } else {
                    warn(errorMessage);
                }
            }
        };
        Decorator.prototype = {
            init: function () {
                var result, args;
                if (this.params) {
                    args = [this.node].concat(this.params);
                    result = this.fn.apply(this.root, args);
                } else {
                    result = this.fn.call(this.root, this.node);
                }
                if (!result || !result.teardown) {
                    throw new Error('Decorator definition must return an object with a teardown method');
                }
                this.teardown = result.teardown;
            }
        };
        return Decorator;
    }(utils_warn, render_StringFragment__StringFragment);
var render_DomFragment_Element_initialise_decorate__decorate = function (Decorator) {
        
        return function (descriptor, root, owner, contextStack) {
            owner.decorator = new Decorator(descriptor, root, owner, contextStack);
            if (owner.decorator.fn) {
                root._deferred.decorators.push(owner.decorator);
            }
        };
    }(render_DomFragment_Element_initialise_decorate_Decorator);
var render_DomFragment_Element_initialise_addEventProxies_addEventProxy = function (warn, StringFragment) {
        
        var addEventProxy, MasterEventHandler, ProxyEvent, firePlainEvent, fireEventWithArgs, fireEventWithDynamicArgs, customHandlers, genericHandler, getCustomHandler;
        addEventProxy = function (element, triggerEventName, proxyDescriptor, contextStack, indexRefs) {
            var events, master;
            events = element.node._ractive.events;
            master = events[triggerEventName] || (events[triggerEventName] = new MasterEventHandler(element, triggerEventName, contextStack, indexRefs));
            master.add(proxyDescriptor);
        };
        MasterEventHandler = function (element, eventName, contextStack) {
            var definition;
            this.element = element;
            this.root = element.root;
            this.node = element.node;
            this.name = eventName;
            this.contextStack = contextStack;
            this.proxies = [];
            if (definition = this.root.events[eventName]) {
                this.custom = definition(this.node, getCustomHandler(eventName));
            } else {
                if (!('on' + eventName in this.node)) {
                    warn('Missing "' + this.name + '" event. You may need to download a plugin via https://github.com/RactiveJS/Ractive/wiki/Plugins#events');
                }
                this.node.addEventListener(eventName, genericHandler, false);
            }
        };
        MasterEventHandler.prototype = {
            add: function (proxy) {
                this.proxies[this.proxies.length] = new ProxyEvent(this.element, this.root, proxy, this.contextStack);
            },
            teardown: function () {
                var i;
                if (this.custom) {
                    this.custom.teardown();
                } else {
                    this.node.removeEventListener(this.name, genericHandler, false);
                }
                i = this.proxies.length;
                while (i--) {
                    this.proxies[i].teardown();
                }
            },
            fire: function (event) {
                var i = this.proxies.length;
                while (i--) {
                    this.proxies[i].fire(event);
                }
            }
        };
        ProxyEvent = function (element, ractive, descriptor, contextStack) {
            var name;
            this.root = ractive;
            name = descriptor.n || descriptor;
            if (typeof name === 'string') {
                this.n = name;
            } else {
                this.n = new StringFragment({
                    descriptor: descriptor.n,
                    root: this.root,
                    owner: element,
                    contextStack: contextStack
                });
            }
            if (descriptor.a) {
                this.a = descriptor.a;
                this.fire = fireEventWithArgs;
                return;
            }
            if (descriptor.d) {
                this.d = new StringFragment({
                    descriptor: descriptor.d,
                    root: this.root,
                    owner: element,
                    contextStack: contextStack
                });
                this.fire = fireEventWithDynamicArgs;
                return;
            }
            this.fire = firePlainEvent;
        };
        ProxyEvent.prototype = {
            teardown: function () {
                if (this.n.teardown) {
                    this.n.teardown();
                }
                if (this.d) {
                    this.d.teardown();
                }
            },
            bubble: function () {
            }
        };
        firePlainEvent = function (event) {
            this.root.fire(this.n.toString(), event);
        };
        fireEventWithArgs = function (event) {
            this.root.fire.apply(this.root, [
                this.n.toString(),
                event
            ].concat(this.a));
        };
        fireEventWithDynamicArgs = function (event) {
            var args = this.d.toArgsList();
            if (typeof args === 'string') {
                args = args.substr(1, args.length - 2);
            }
            this.root.fire.apply(this.root, [
                this.n.toString(),
                event
            ].concat(args));
        };
        genericHandler = function (event) {
            var storage = this._ractive;
            storage.events[event.type].fire({
                node: this,
                original: event,
                index: storage.index,
                keypath: storage.keypath,
                context: storage.root.get(storage.keypath)
            });
        };
        customHandlers = {};
        getCustomHandler = function (eventName) {
            if (customHandlers[eventName]) {
                return customHandlers[eventName];
            }
            return customHandlers[eventName] = function (event) {
                var storage = event.node._ractive;
                event.index = storage.index;
                event.keypath = storage.keypath;
                event.context = storage.root.get(storage.keypath);
                storage.events[eventName].fire(event);
            };
        };
        return addEventProxy;
    }(utils_warn, render_StringFragment__StringFragment);
var render_DomFragment_Element_initialise_addEventProxies__addEventProxies = function (addEventProxy) {
        
        return function (element, proxies) {
            var i, eventName, eventNames;
            for (eventName in proxies) {
                if (proxies.hasOwnProperty(eventName)) {
                    eventNames = eventName.split('-');
                    i = eventNames.length;
                    while (i--) {
                        addEventProxy(element, eventNames[i], proxies[eventName], element.parentFragment.contextStack);
                    }
                }
            }
        };
    }(render_DomFragment_Element_initialise_addEventProxies_addEventProxy);
var render_DomFragment_Element_initialise_updateLiveQueries = function () {
        
        return function (element) {
            var ractive, liveQueries, i, selector, query;
            ractive = element.root;
            liveQueries = ractive._liveQueries;
            i = liveQueries.length;
            while (i--) {
                selector = liveQueries[i];
                query = liveQueries[selector];
                if (query._test(element)) {
                    (element.liveQueries || (element.liveQueries = [])).push(selector);
                    element.liveQueries[selector] = [element.node];
                }
            }
        };
    }();
var utils_camelCase = function () {
        
        return function (hyphenatedStr) {
            return hyphenatedStr.replace(/-([a-zA-Z])/g, function (match, $1) {
                return $1.toUpperCase();
            });
        };
    }();
var utils_fillGaps = function () {
        
        return function (target, source) {
            var key;
            for (key in source) {
                if (source.hasOwnProperty(key) && !target.hasOwnProperty(key)) {
                    target[key] = source[key];
                }
            }
            return target;
        };
    }();
var render_DomFragment_Element_shared_executeTransition_Transition = function (isClient, createElement, warn, isNumeric, isArray, camelCase, fillGaps, StringFragment) {
        
        var Transition, testStyle, vendors, vendorPattern, unprefixPattern, prefixCache, CSS_TRANSITIONS_ENABLED, TRANSITION, TRANSITION_DURATION, TRANSITION_PROPERTY, TRANSITION_TIMING_FUNCTION, TRANSITIONEND;
        if (!isClient) {
            return;
        }
        testStyle = createElement('div').style;
        (function () {
            if (testStyle.transition !== undefined) {
                TRANSITION = 'transition';
                TRANSITIONEND = 'transitionend';
                CSS_TRANSITIONS_ENABLED = true;
            } else if (testStyle.webkitTransition !== undefined) {
                TRANSITION = 'webkitTransition';
                TRANSITIONEND = 'webkitTransitionEnd';
                CSS_TRANSITIONS_ENABLED = true;
            } else {
                CSS_TRANSITIONS_ENABLED = false;
            }
        }());
        if (TRANSITION) {
            TRANSITION_DURATION = TRANSITION + 'Duration';
            TRANSITION_PROPERTY = TRANSITION + 'Property';
            TRANSITION_TIMING_FUNCTION = TRANSITION + 'TimingFunction';
        }
        Transition = function (descriptor, root, owner, contextStack, isIntro) {
            var t = this, name, fragment, errorMessage;
            this.root = root;
            this.node = owner.node;
            this.isIntro = isIntro;
            this.originalStyle = this.node.getAttribute('style');
            this.complete = function (noReset) {
                if (!noReset && t.isIntro) {
                    t.resetStyle();
                }
                t._manager.pop(t.node);
                t.node._ractive.transition = null;
            };
            name = descriptor.n || descriptor;
            if (typeof name !== 'string') {
                fragment = new StringFragment({
                    descriptor: name,
                    root: this.root,
                    owner: owner,
                    contextStack: contextStack
                });
                name = fragment.toString();
                fragment.teardown();
            }
            this.name = name;
            if (descriptor.a) {
                this.params = descriptor.a;
            } else if (descriptor.d) {
                fragment = new StringFragment({
                    descriptor: descriptor.d,
                    root: this.root,
                    owner: owner,
                    contextStack: contextStack
                });
                this.params = fragment.toArgsList();
                fragment.teardown();
            }
            this._fn = root.transitions[name];
            if (!this._fn) {
                errorMessage = 'Missing "' + name + '" transition. You may need to download a plugin via https://github.com/RactiveJS/Ractive/wiki/Plugins#transitions';
                if (root.debug) {
                    throw new Error(errorMessage);
                } else {
                    warn(errorMessage);
                }
                return;
            }
        };
        Transition.prototype = {
            init: function () {
                if (this._inited) {
                    throw new Error('Cannot initialize a transition more than once');
                }
                this._inited = true;
                this._fn.apply(this.root, [this].concat(this.params));
            },
            getStyle: function (props) {
                var computedStyle, styles, i, prop, value;
                computedStyle = window.getComputedStyle(this.node);
                if (typeof props === 'string') {
                    value = computedStyle[prefix(props)];
                    if (value === '0px') {
                        value = 0;
                    }
                    return value;
                }
                if (!isArray(props)) {
                    throw new Error('Transition#getStyle must be passed a string, or an array of strings representing CSS properties');
                }
                styles = {};
                i = props.length;
                while (i--) {
                    prop = props[i];
                    value = computedStyle[prefix(prop)];
                    if (value === '0px') {
                        value = 0;
                    }
                    styles[prop] = value;
                }
                return styles;
            },
            setStyle: function (style, value) {
                var prop;
                if (typeof style === 'string') {
                    this.node.style[prefix(style)] = value;
                } else {
                    for (prop in style) {
                        if (style.hasOwnProperty(prop)) {
                            this.node.style[prefix(prop)] = style[prop];
                        }
                    }
                }
                return this;
            },
            animateStyle: function (style, value, options, complete) {
                var t = this, propertyNames, changedProperties, computedStyle, current, to, from, transitionEndHandler, i, prop;
                if (typeof style === 'string') {
                    to = {};
                    to[style] = value;
                } else {
                    to = style;
                    complete = options;
                    options = value;
                }
                if (!options) {
                    warn('The "' + t.name + '" transition does not supply an options object to `t.animateStyle()`. This will break in a future version of Ractive. For more info see https://github.com/RactiveJS/Ractive/issues/340');
                    options = t;
                    complete = t.complete;
                }
                if (!options.duration) {
                    t.setStyle(to);
                    if (complete) {
                        complete();
                    }
                }
                propertyNames = Object.keys(to);
                changedProperties = [];
                computedStyle = window.getComputedStyle(t.node);
                from = {};
                i = propertyNames.length;
                while (i--) {
                    prop = propertyNames[i];
                    current = computedStyle[prefix(prop)];
                    if (current === '0px') {
                        current = 0;
                    }
                    if (current != to[prop]) {
                        changedProperties[changedProperties.length] = prop;
                        t.node.style[prefix(prop)] = current;
                    }
                }
                if (!changedProperties.length) {
                    if (complete) {
                        complete();
                    }
                    return;
                }
                setTimeout(function () {
                    t.node.style[TRANSITION_PROPERTY] = propertyNames.map(prefix).map(hyphenate).join(',');
                    t.node.style[TRANSITION_TIMING_FUNCTION] = hyphenate(options.easing || 'linear');
                    t.node.style[TRANSITION_DURATION] = options.duration / 1000 + 's';
                    transitionEndHandler = function (event) {
                        var index;
                        index = changedProperties.indexOf(camelCase(unprefix(event.propertyName)));
                        if (index !== -1) {
                            changedProperties.splice(index, 1);
                        }
                        if (changedProperties.length) {
                            return;
                        }
                        t.root.fire(t.name + ':end');
                        t.node.removeEventListener(TRANSITIONEND, transitionEndHandler, false);
                        if (complete) {
                            complete();
                        }
                    };
                    t.node.addEventListener(TRANSITIONEND, transitionEndHandler, false);
                    setTimeout(function () {
                        var i = changedProperties.length;
                        while (i--) {
                            prop = changedProperties[i];
                            t.node.style[prefix(prop)] = to[prop];
                        }
                    }, 0);
                }, options.delay || 0);
            },
            resetStyle: function () {
                if (this.originalStyle) {
                    this.node.setAttribute('style', this.originalStyle);
                } else {
                    this.node.getAttribute('style');
                    this.node.removeAttribute('style');
                }
            },
            processParams: function (params, defaults) {
                if (typeof params === 'number') {
                    params = { duration: params };
                } else if (typeof params === 'string') {
                    if (params === 'slow') {
                        params = { duration: 600 };
                    } else if (params === 'fast') {
                        params = { duration: 200 };
                    } else {
                        params = { duration: 400 };
                    }
                } else if (!params) {
                    params = {};
                }
                return fillGaps(params, defaults);
            }
        };
        vendors = [
            'o',
            'ms',
            'moz',
            'webkit'
        ];
        vendorPattern = new RegExp('^(?:' + vendors.join('|') + ')([A-Z])');
        unprefixPattern = new RegExp('^-(?:' + vendors.join('|') + ')-');
        prefixCache = {};
        function prefix(prop) {
            var i, vendor, capped;
            if (!prefixCache[prop]) {
                if (testStyle[prop] !== undefined) {
                    prefixCache[prop] = prop;
                } else {
                    capped = prop.charAt(0).toUpperCase() + prop.substring(1);
                    i = vendors.length;
                    while (i--) {
                        vendor = vendors[i];
                        if (testStyle[vendor + capped] !== undefined) {
                            prefixCache[prop] = vendor + capped;
                            break;
                        }
                    }
                }
            }
            return prefixCache[prop];
        }
        function unprefix(prop) {
            return prop.replace(unprefixPattern, '');
        }
        function hyphenate(str) {
            var hyphenated;
            if (vendorPattern.test(str)) {
                str = '-' + str;
            }
            hyphenated = str.replace(/[A-Z]/g, function (match) {
                return '-' + match.toLowerCase();
            });
            return hyphenated;
        }
        return Transition;
    }(config_isClient, utils_createElement, utils_warn, utils_isNumeric, utils_isArray, utils_camelCase, utils_fillGaps, render_StringFragment__StringFragment);
var render_DomFragment_Element_shared_executeTransition__executeTransition = function (warn, Transition) {
        
        return function (descriptor, root, owner, contextStack, isIntro) {
            var transition, node, oldTransition;
            if (!root.transitionsEnabled || root._parent && !root._parent.transitionsEnabled) {
                return;
            }
            transition = new Transition(descriptor, root, owner, contextStack, isIntro);
            if (transition._fn) {
                node = transition.node;
                transition._manager = root._transitionManager;
                if (oldTransition = node._ractive.transition) {
                    oldTransition.complete();
                }
                node._ractive.transition = transition;
                transition._manager.push(node);
                if (isIntro) {
                    root._deferred.transitions.push(transition);
                } else {
                    transition.init();
                }
            }
        };
    }(utils_warn, render_DomFragment_Element_shared_executeTransition_Transition);
var render_DomFragment_Element_initialise__initialise = function (types, namespaces, create, defineProperty, matches, warn, createElement, getElementNamespace, createElementAttributes, appendElementChildren, decorate, addEventProxies, updateLiveQueries, executeTransition, enforceCase) {
        
        return function (element, options, docFrag) {
            var parentFragment, pNode, contextStack, descriptor, namespace, name, attributes, width, height, loadHandler, root, selectBinding, errorMessage;
            element.type = types.ELEMENT;
            parentFragment = element.parentFragment = options.parentFragment;
            pNode = parentFragment.pNode;
            contextStack = parentFragment.contextStack;
            descriptor = element.descriptor = options.descriptor;
            element.root = root = parentFragment.root;
            element.index = options.index;
            element.lcName = descriptor.e.toLowerCase();
            element.eventListeners = [];
            element.customEventListeners = [];
            if (pNode) {
                namespace = element.namespace = getElementNamespace(descriptor, pNode);
                name = namespace !== namespaces.html ? enforceCase(descriptor.e) : descriptor.e;
                element.node = createElement(name, namespace);
                defineProperty(element.node, '_ractive', {
                    value: {
                        proxy: element,
                        keypath: contextStack.length ? contextStack[contextStack.length - 1] : '',
                        index: parentFragment.indexRefs,
                        events: create(null),
                        root: root
                    }
                });
            }
            attributes = createElementAttributes(element, descriptor.a);
            if (descriptor.f) {
                if (element.node && element.node.getAttribute('contenteditable')) {
                    if (element.node.innerHTML) {
                        errorMessage = 'A pre-populated contenteditable element should not have children';
                        if (root.debug) {
                            throw new Error(errorMessage);
                        } else {
                            warn(errorMessage);
                        }
                    }
                }
                appendElementChildren(element, element.node, descriptor, docFrag);
            }
            if (docFrag && descriptor.v) {
                addEventProxies(element, descriptor.v);
            }
            if (docFrag) {
                if (root.twoway) {
                    element.bind();
                    if (element.node.getAttribute('contenteditable') && element.node._ractive.binding) {
                        element.node._ractive.binding.update();
                    }
                }
                if (attributes.name && !attributes.name.twoway) {
                    attributes.name.update();
                }
                if (element.node.tagName === 'IMG' && ((width = element.attributes.width) || (height = element.attributes.height))) {
                    element.node.addEventListener('load', loadHandler = function () {
                        if (width) {
                            element.node.width = width.value;
                        }
                        if (height) {
                            element.node.height = height.value;
                        }
                        element.node.removeEventListener('load', loadHandler, false);
                    }, false);
                }
                docFrag.appendChild(element.node);
                if (descriptor.o) {
                    decorate(descriptor.o, root, element, contextStack);
                }
                if (descriptor.t1) {
                    executeTransition(descriptor.t1, root, element, contextStack, true);
                }
                if (element.node.tagName === 'OPTION') {
                    if (pNode.tagName === 'SELECT' && (selectBinding = pNode._ractive.binding)) {
                        selectBinding.deferUpdate();
                    }
                    if (element.node._ractive.value == pNode._ractive.value) {
                        element.node.selected = true;
                    }
                }
                if (element.node.autofocus) {
                    root._deferred.focusable = element.node;
                }
            }
            updateLiveQueries(element);
        };
    }(config_types, config_namespaces, utils_create, utils_defineProperty, utils_matches, utils_warn, utils_createElement, render_DomFragment_Element_initialise_getElementNamespace, render_DomFragment_Element_initialise_createElementAttributes, render_DomFragment_Element_initialise_appendElementChildren, render_DomFragment_Element_initialise_decorate__decorate, render_DomFragment_Element_initialise_addEventProxies__addEventProxies, render_DomFragment_Element_initialise_updateLiveQueries, render_DomFragment_Element_shared_executeTransition__executeTransition, render_DomFragment_shared_enforceCase);
var render_DomFragment_Element_prototype_teardown = function (executeTransition) {
        
        return function (destroy) {
            var eventName, binding, bindings, i, liveQueries, selector, query, nodesToRemove, j;
            if (this.fragment) {
                this.fragment.teardown(false);
            }
            while (this.attributes.length) {
                this.attributes.pop().teardown();
            }
            if (this.node) {
                for (eventName in this.node._ractive.events) {
                    this.node._ractive.events[eventName].teardown();
                }
                if (binding = this.node._ractive.binding) {
                    binding.teardown();
                    bindings = this.root._twowayBindings[binding.attr.keypath];
                    bindings.splice(bindings.indexOf(binding), 1);
                }
            }
            if (this.decorator) {
                this.decorator.teardown();
            }
            if (this.descriptor.t2) {
                executeTransition(this.descriptor.t2, this.root, this, this.parentFragment.contextStack, false);
            }
            if (destroy) {
                this.root._transitionManager.detachWhenReady(this);
            }
            if (liveQueries = this.liveQueries) {
                i = liveQueries.length;
                while (i--) {
                    selector = liveQueries[i];
                    if (nodesToRemove = this.liveQueries[selector]) {
                        j = nodesToRemove.length;
                        query = this.root._liveQueries[selector];
                        while (j--) {
                            query._remove(nodesToRemove[j]);
                        }
                    }
                }
            }
        };
    }(render_DomFragment_Element_shared_executeTransition__executeTransition);
var config_voidElementNames = function () {
        
        return 'area base br col command doctype embed hr img input keygen link meta param source track wbr'.split(' ');
    }();
var render_DomFragment_Element_prototype_toString = function (voidElementNames) {
        
        return function () {
            var str, i, len;
            str = '<' + (this.descriptor.y ? '!doctype' : this.descriptor.e);
            len = this.attributes.length;
            for (i = 0; i < len; i += 1) {
                str += ' ' + this.attributes[i].toString();
            }
            str += '>';
            if (this.html) {
                str += this.html;
            } else if (this.fragment) {
                str += this.fragment.toString();
            }
            if (voidElementNames.indexOf(this.descriptor.e) === -1) {
                str += '</' + this.descriptor.e + '>';
            }
            return str;
        };
    }(config_voidElementNames);
var render_DomFragment_Element_prototype_find = function (matches) {
        
        return function (selector) {
            var queryResult;
            if (matches(this.node, selector)) {
                return this.node;
            }
            if (this.html && (queryResult = this.node.querySelector(selector))) {
                return queryResult;
            }
            if (this.fragment && this.fragment.find) {
                return this.fragment.find(selector);
            }
        };
    }(utils_matches);
var render_DomFragment_Element_prototype_findAll = function () {
        
        return function (selector, query) {
            var queryAllResult, i, numNodes, node, registeredNodes;
            if (query._test(this, true) && query.live) {
                (this.liveQueries || (this.liveQueries = [])).push(selector);
                this.liveQueries[selector] = [this.node];
            }
            if (this.html && (queryAllResult = this.node.querySelectorAll(selector)) && (numNodes = queryAllResult.length)) {
                if (query.live) {
                    if (!this.liveQueries[selector]) {
                        (this.liveQueries || (this.liveQueries = [])).push(selector);
                        this.liveQueries[selector] = [];
                    }
                    registeredNodes = this.liveQueries[selector];
                }
                for (i = 0; i < numNodes; i += 1) {
                    node = queryAllResult[i];
                    query.push(node);
                    if (query.live) {
                        registeredNodes.push(node);
                    }
                }
            }
            if (this.fragment) {
                this.fragment.findAll(selector, query);
            }
        };
    }();
var render_DomFragment_Element_prototype_findComponent = function () {
        
        return function (selector) {
            if (this.fragment) {
                return this.fragment.findComponent(selector);
            }
        };
    }();
var render_DomFragment_Element_prototype_findAllComponents = function () {
        
        return function (selector, query) {
            if (this.fragment) {
                this.fragment.findAllComponents(selector, query);
            }
        };
    }();
var render_DomFragment_Element_prototype_bind = function () {
        
        return function () {
            var attributes = this.attributes;
            if (!this.node) {
                return;
            }
            if (this.binding) {
                this.binding.teardown();
                this.binding = null;
            }
            if (this.node.getAttribute('contenteditable') && attributes.value && attributes.value.bind()) {
                return;
            }
            switch (this.descriptor.e) {
            case 'select':
            case 'textarea':
                if (attributes.value) {
                    attributes.value.bind();
                }
                return;
            case 'input':
                if (this.node.type === 'radio' || this.node.type === 'checkbox') {
                    if (attributes.name && attributes.name.bind()) {
                        return;
                    }
                    if (attributes.checked && attributes.checked.bind()) {
                        return;
                    }
                }
                if (attributes.value && attributes.value.bind()) {
                    return;
                }
            }
        };
    }();
var render_DomFragment_Element__Element = function (initialise, teardown, toString, find, findAll, findComponent, findAllComponents, bind) {
        
        var DomElement = function (options, docFrag) {
            initialise(this, options, docFrag);
        };
        DomElement.prototype = {
            detach: function () {
                if (this.node) {
                    if (this.node.parentNode) {
                        this.node.parentNode.removeChild(this.node);
                    }
                    return this.node;
                }
            },
            teardown: teardown,
            firstNode: function () {
                return this.node;
            },
            findNextNode: function () {
                return null;
            },
            bubble: function () {
            },
            toString: toString,
            find: find,
            findAll: findAll,
            findComponent: findComponent,
            findAllComponents: findAllComponents,
            bind: bind
        };
        return DomElement;
    }(render_DomFragment_Element_initialise__initialise, render_DomFragment_Element_prototype_teardown, render_DomFragment_Element_prototype_toString, render_DomFragment_Element_prototype_find, render_DomFragment_Element_prototype_findAll, render_DomFragment_Element_prototype_findComponent, render_DomFragment_Element_prototype_findAllComponents, render_DomFragment_Element_prototype_bind);
var config_errors = { missingParser: 'Missing Ractive.parse - cannot parse template. Either preparse or use the version that includes the parser' };
var registries_partials = {};
var parse_utils_stripHtmlComments = function () {
        
        return function (html) {
            var commentStart, commentEnd, processed;
            processed = '';
            while (html.length) {
                commentStart = html.indexOf('<!--');
                commentEnd = html.indexOf('-->');
                if (commentStart === -1 && commentEnd === -1) {
                    processed += html;
                    break;
                }
                if (commentStart !== -1 && commentEnd === -1) {
                    throw 'Illegal HTML - expected closing comment sequence (\'-->\')';
                }
                if (commentEnd !== -1 && commentStart === -1 || commentEnd < commentStart) {
                    throw 'Illegal HTML - unexpected closing comment sequence (\'-->\')';
                }
                processed += html.substr(0, commentStart);
                html = html.substring(commentEnd + 3);
            }
            return processed;
        };
    }();
var parse_utils_stripStandalones = function (types) {
        
        return function (tokens) {
            var i, current, backOne, backTwo, leadingLinebreak, trailingLinebreak;
            leadingLinebreak = /^\s*\r?\n/;
            trailingLinebreak = /\r?\n\s*$/;
            for (i = 2; i < tokens.length; i += 1) {
                current = tokens[i];
                backOne = tokens[i - 1];
                backTwo = tokens[i - 2];
                if (current.type === types.TEXT && backOne.type === types.MUSTACHE && backTwo.type === types.TEXT) {
                    if (trailingLinebreak.test(backTwo.value) && leadingLinebreak.test(current.value)) {
                        if (backOne.mustacheType !== types.INTERPOLATOR && backOne.mustacheType !== types.TRIPLE) {
                            backTwo.value = backTwo.value.replace(trailingLinebreak, '\n');
                        }
                        current.value = current.value.replace(leadingLinebreak, '');
                        if (current.value === '') {
                            tokens.splice(i--, 1);
                        }
                    }
                }
            }
            return tokens;
        };
    }(config_types);
var parse_utils_stripCommentTokens = function (types) {
        
        return function (tokens) {
            var i, current, previous, next;
            for (i = 0; i < tokens.length; i += 1) {
                current = tokens[i];
                previous = tokens[i - 1];
                next = tokens[i + 1];
                if (current.mustacheType === types.COMMENT || current.mustacheType === types.DELIMCHANGE) {
                    tokens.splice(i, 1);
                    if (previous && next) {
                        if (previous.type === types.TEXT && next.type === types.TEXT) {
                            previous.value += next.value;
                            tokens.splice(i, 1);
                        }
                    }
                    i -= 1;
                }
            }
            return tokens;
        };
    }(config_types);
var parse_Tokenizer_getMustache_getDelimiterChange = function (makeRegexMatcher) {
        
        var getDelimiter = makeRegexMatcher(/^[^\s=]+/);
        return function (tokenizer) {
            var start, opening, closing;
            if (!tokenizer.getStringMatch('=')) {
                return null;
            }
            start = tokenizer.pos;
            tokenizer.allowWhitespace();
            opening = getDelimiter(tokenizer);
            if (!opening) {
                tokenizer.pos = start;
                return null;
            }
            tokenizer.allowWhitespace();
            closing = getDelimiter(tokenizer);
            if (!closing) {
                tokenizer.pos = start;
                return null;
            }
            tokenizer.allowWhitespace();
            if (!tokenizer.getStringMatch('=')) {
                tokenizer.pos = start;
                return null;
            }
            return [
                opening,
                closing
            ];
        };
    }(parse_Tokenizer_utils_makeRegexMatcher);
var parse_Tokenizer_getMustache_getMustacheType = function (types) {
        
        var mustacheTypes = {
                '#': types.SECTION,
                '^': types.INVERTED,
                '/': types.CLOSING,
                '>': types.PARTIAL,
                '!': types.COMMENT,
                '&': types.TRIPLE
            };
        return function (tokenizer) {
            var type = mustacheTypes[tokenizer.str.charAt(tokenizer.pos)];
            if (!type) {
                return null;
            }
            tokenizer.pos += 1;
            return type;
        };
    }(config_types);
var parse_Tokenizer_getMustache_getMustacheContent = function (types, makeRegexMatcher, getMustacheType) {
        
        var getIndexRef = makeRegexMatcher(/^\s*:\s*([a-zA-Z_$][a-zA-Z_$0-9]*)/), arrayMember = /^[0-9][1-9]*$/;
        return function (tokenizer, isTriple) {
            var start, mustache, type, expr, i, remaining, index;
            start = tokenizer.pos;
            mustache = { type: isTriple ? types.TRIPLE : types.MUSTACHE };
            if (!isTriple) {
                if (expr = tokenizer.getExpression()) {
                    mustache.mustacheType = types.INTERPOLATOR;
                    tokenizer.allowWhitespace();
                    if (tokenizer.getStringMatch(tokenizer.delimiters[1])) {
                        tokenizer.pos -= tokenizer.delimiters[1].length;
                    } else {
                        tokenizer.pos = start;
                        expr = null;
                    }
                }
                if (!expr) {
                    type = getMustacheType(tokenizer);
                    if (type === types.TRIPLE) {
                        mustache = { type: types.TRIPLE };
                    } else {
                        mustache.mustacheType = type || types.INTERPOLATOR;
                    }
                    if (type === types.COMMENT || type === types.CLOSING) {
                        remaining = tokenizer.remaining();
                        index = remaining.indexOf(tokenizer.delimiters[1]);
                        if (index !== -1) {
                            mustache.ref = remaining.substr(0, index);
                            tokenizer.pos += index;
                            return mustache;
                        }
                    }
                }
            }
            if (!expr) {
                tokenizer.allowWhitespace();
                expr = tokenizer.getExpression();
            }
            while (expr.t === types.BRACKETED && expr.x) {
                expr = expr.x;
            }
            if (expr.t === types.REFERENCE) {
                mustache.ref = expr.n;
            } else if (expr.t === types.NUMBER_LITERAL && arrayMember.test(expr.v)) {
                mustache.ref = expr.v;
            } else {
                mustache.expression = expr;
            }
            i = getIndexRef(tokenizer);
            if (i !== null) {
                mustache.indexRef = i;
            }
            return mustache;
        };
    }(config_types, parse_Tokenizer_utils_makeRegexMatcher, parse_Tokenizer_getMustache_getMustacheType);
var parse_Tokenizer_getMustache__getMustache = function (types, getDelimiterChange, getMustacheContent) {
        
        return function () {
            var seekTripleFirst = this.tripleDelimiters[0].length > this.delimiters[0].length;
            return getMustache(this, seekTripleFirst) || getMustache(this, !seekTripleFirst);
        };
        function getMustache(tokenizer, seekTriple) {
            var start = tokenizer.pos, content, delimiters;
            delimiters = seekTriple ? tokenizer.tripleDelimiters : tokenizer.delimiters;
            if (!tokenizer.getStringMatch(delimiters[0])) {
                return null;
            }
            content = getDelimiterChange(tokenizer);
            if (content) {
                if (!tokenizer.getStringMatch(delimiters[1])) {
                    tokenizer.pos = start;
                    return null;
                }
                tokenizer[seekTriple ? 'tripleDelimiters' : 'delimiters'] = content;
                return {
                    type: types.MUSTACHE,
                    mustacheType: types.DELIMCHANGE
                };
            }
            tokenizer.allowWhitespace();
            content = getMustacheContent(tokenizer, seekTriple);
            if (content === null) {
                tokenizer.pos = start;
                return null;
            }
            tokenizer.allowWhitespace();
            if (!tokenizer.getStringMatch(delimiters[1])) {
                tokenizer.pos = start;
                return null;
            }
            return content;
        }
    }(config_types, parse_Tokenizer_getMustache_getDelimiterChange, parse_Tokenizer_getMustache_getMustacheContent);
var parse_Tokenizer_getComment_getComment = function (types) {
        
        return function () {
            var content, remaining, endIndex;
            if (!this.getStringMatch('<!--')) {
                return null;
            }
            remaining = this.remaining();
            endIndex = remaining.indexOf('-->');
            if (endIndex === -1) {
                throw new Error('Unexpected end of input (expected "-->" to close comment)');
            }
            content = remaining.substr(0, endIndex);
            this.pos += endIndex + 3;
            return {
                type: types.COMMENT,
                content: content
            };
        };
    }(config_types);
var parse_Tokenizer_utils_getLowestIndex = function () {
        
        return function (haystack, needles) {
            var i, index, lowest;
            i = needles.length;
            while (i--) {
                index = haystack.indexOf(needles[i]);
                if (!index) {
                    return 0;
                }
                if (index === -1) {
                    continue;
                }
                if (!lowest || index < lowest) {
                    lowest = index;
                }
            }
            return lowest || -1;
        };
    }();
var parse_Tokenizer_getTag__getTag = function (types, makeRegexMatcher, getLowestIndex) {
        
        var getTag, getOpeningTag, getClosingTag, getTagName, getAttributes, getAttribute, getAttributeName, getAttributeValue, getUnquotedAttributeValue, getUnquotedAttributeValueToken, getUnquotedAttributeValueText, getQuotedStringToken, getQuotedAttributeValue;
        getTag = function () {
            return getOpeningTag(this) || getClosingTag(this);
        };
        getOpeningTag = function (tokenizer) {
            var start, tag, attrs, lowerCaseName;
            start = tokenizer.pos;
            if (tokenizer.inside) {
                return null;
            }
            if (!tokenizer.getStringMatch('<')) {
                return null;
            }
            tag = { type: types.TAG };
            if (tokenizer.getStringMatch('!')) {
                tag.doctype = true;
            }
            tag.name = getTagName(tokenizer);
            if (!tag.name) {
                tokenizer.pos = start;
                return null;
            }
            attrs = getAttributes(tokenizer);
            if (attrs) {
                tag.attrs = attrs;
            }
            tokenizer.allowWhitespace();
            if (tokenizer.getStringMatch('/')) {
                tag.selfClosing = true;
            }
            if (!tokenizer.getStringMatch('>')) {
                tokenizer.pos = start;
                return null;
            }
            lowerCaseName = tag.name.toLowerCase();
            if (lowerCaseName === 'script' || lowerCaseName === 'style') {
                tokenizer.inside = lowerCaseName;
            }
            return tag;
        };
        getClosingTag = function (tokenizer) {
            var start, tag, expected;
            start = tokenizer.pos;
            expected = function (str) {
                throw new Error('Unexpected character ' + tokenizer.remaining().charAt(0) + ' (expected ' + str + ')');
            };
            if (!tokenizer.getStringMatch('<')) {
                return null;
            }
            tag = {
                type: types.TAG,
                closing: true
            };
            if (!tokenizer.getStringMatch('/')) {
                expected('"/"');
            }
            tag.name = getTagName(tokenizer);
            if (!tag.name) {
                expected('tag name');
            }
            if (!tokenizer.getStringMatch('>')) {
                expected('">"');
            }
            if (tokenizer.inside) {
                if (tag.name.toLowerCase() !== tokenizer.inside) {
                    tokenizer.pos = start;
                    return null;
                }
                tokenizer.inside = null;
            }
            return tag;
        };
        getTagName = makeRegexMatcher(/^[a-zA-Z]{1,}:?[a-zA-Z0-9\-]*/);
        getAttributes = function (tokenizer) {
            var start, attrs, attr;
            start = tokenizer.pos;
            tokenizer.allowWhitespace();
            attr = getAttribute(tokenizer);
            if (!attr) {
                tokenizer.pos = start;
                return null;
            }
            attrs = [];
            while (attr !== null) {
                attrs[attrs.length] = attr;
                tokenizer.allowWhitespace();
                attr = getAttribute(tokenizer);
            }
            return attrs;
        };
        getAttribute = function (tokenizer) {
            var attr, name, value;
            name = getAttributeName(tokenizer);
            if (!name) {
                return null;
            }
            attr = { name: name };
            value = getAttributeValue(tokenizer);
            if (value) {
                attr.value = value;
            }
            return attr;
        };
        getAttributeName = makeRegexMatcher(/^[^\s"'>\/=]+/);
        getAttributeValue = function (tokenizer) {
            var start, value;
            start = tokenizer.pos;
            tokenizer.allowWhitespace();
            if (!tokenizer.getStringMatch('=')) {
                tokenizer.pos = start;
                return null;
            }
            tokenizer.allowWhitespace();
            value = getQuotedAttributeValue(tokenizer, '\'') || getQuotedAttributeValue(tokenizer, '"') || getUnquotedAttributeValue(tokenizer);
            if (value === null) {
                tokenizer.pos = start;
                return null;
            }
            return value;
        };
        getUnquotedAttributeValueText = makeRegexMatcher(/^[^\s"'=<>`]+/);
        getUnquotedAttributeValueToken = function (tokenizer) {
            var start, text, index;
            start = tokenizer.pos;
            text = getUnquotedAttributeValueText(tokenizer);
            if (!text) {
                return null;
            }
            if ((index = text.indexOf(tokenizer.delimiters[0])) !== -1) {
                text = text.substr(0, index);
                tokenizer.pos = start + text.length;
            }
            return {
                type: types.TEXT,
                value: text
            };
        };
        getUnquotedAttributeValue = function (tokenizer) {
            var tokens, token;
            tokens = [];
            token = tokenizer.getMustache() || getUnquotedAttributeValueToken(tokenizer);
            while (token !== null) {
                tokens[tokens.length] = token;
                token = tokenizer.getMustache() || getUnquotedAttributeValueToken(tokenizer);
            }
            if (!tokens.length) {
                return null;
            }
            return tokens;
        };
        getQuotedAttributeValue = function (tokenizer, quoteMark) {
            var start, tokens, token;
            start = tokenizer.pos;
            if (!tokenizer.getStringMatch(quoteMark)) {
                return null;
            }
            tokens = [];
            token = tokenizer.getMustache() || getQuotedStringToken(tokenizer, quoteMark);
            while (token !== null) {
                tokens[tokens.length] = token;
                token = tokenizer.getMustache() || getQuotedStringToken(tokenizer, quoteMark);
            }
            if (!tokenizer.getStringMatch(quoteMark)) {
                tokenizer.pos = start;
                return null;
            }
            return tokens;
        };
        getQuotedStringToken = function (tokenizer, quoteMark) {
            var start, index, remaining;
            start = tokenizer.pos;
            remaining = tokenizer.remaining();
            index = getLowestIndex(remaining, [
                quoteMark,
                tokenizer.delimiters[0],
                tokenizer.delimiters[1]
            ]);
            if (index === -1) {
                throw new Error('Quoted attribute value must have a closing quote');
            }
            if (!index) {
                return null;
            }
            tokenizer.pos += index;
            return {
                type: types.TEXT,
                value: remaining.substr(0, index)
            };
        };
        return getTag;
    }(config_types, parse_Tokenizer_utils_makeRegexMatcher, parse_Tokenizer_utils_getLowestIndex);
var parse_Tokenizer_getText__getText = function (types, getLowestIndex) {
        
        return function () {
            var index, remaining, barrier;
            remaining = this.remaining();
            barrier = this.inside ? '</' + this.inside : '<';
            index = getLowestIndex(remaining, [
                barrier,
                this.delimiters[0],
                this.tripleDelimiters[0]
            ]);
            if (!index) {
                return null;
            }
            if (index === -1) {
                index = remaining.length;
            }
            this.pos += index;
            return {
                type: types.TEXT,
                value: remaining.substr(0, index)
            };
        };
    }(config_types, parse_Tokenizer_utils_getLowestIndex);
var parse_Tokenizer_getExpression_getPrimary_getLiteral_getBooleanLiteral = function (types) {
        
        return function (tokenizer) {
            var remaining = tokenizer.remaining();
            if (remaining.substr(0, 4) === 'true') {
                tokenizer.pos += 4;
                return {
                    t: types.BOOLEAN_LITERAL,
                    v: 'true'
                };
            }
            if (remaining.substr(0, 5) === 'false') {
                tokenizer.pos += 5;
                return {
                    t: types.BOOLEAN_LITERAL,
                    v: 'false'
                };
            }
            return null;
        };
    }(config_types);
var parse_Tokenizer_getExpression_getPrimary_getLiteral_getObjectLiteral_getKeyValuePair = function (types, getKey) {
        
        return function (tokenizer) {
            var start, key, value;
            start = tokenizer.pos;
            tokenizer.allowWhitespace();
            key = getKey(tokenizer);
            if (key === null) {
                tokenizer.pos = start;
                return null;
            }
            tokenizer.allowWhitespace();
            if (!tokenizer.getStringMatch(':')) {
                tokenizer.pos = start;
                return null;
            }
            tokenizer.allowWhitespace();
            value = tokenizer.getExpression();
            if (value === null) {
                tokenizer.pos = start;
                return null;
            }
            return {
                t: types.KEY_VALUE_PAIR,
                k: key,
                v: value
            };
        };
    }(config_types, parse_Tokenizer_getExpression_shared_getKey);
var parse_Tokenizer_getExpression_getPrimary_getLiteral_getObjectLiteral_getKeyValuePairs = function (getKeyValuePair) {
        
        return function getKeyValuePairs(tokenizer) {
            var start, pairs, pair, keyValuePairs;
            start = tokenizer.pos;
            pair = getKeyValuePair(tokenizer);
            if (pair === null) {
                return null;
            }
            pairs = [pair];
            if (tokenizer.getStringMatch(',')) {
                keyValuePairs = getKeyValuePairs(tokenizer);
                if (!keyValuePairs) {
                    tokenizer.pos = start;
                    return null;
                }
                return pairs.concat(keyValuePairs);
            }
            return pairs;
        };
    }(parse_Tokenizer_getExpression_getPrimary_getLiteral_getObjectLiteral_getKeyValuePair);
var parse_Tokenizer_getExpression_getPrimary_getLiteral_getObjectLiteral__getObjectLiteral = function (types, getKeyValuePairs) {
        
        return function (tokenizer) {
            var start, keyValuePairs;
            start = tokenizer.pos;
            tokenizer.allowWhitespace();
            if (!tokenizer.getStringMatch('{')) {
                tokenizer.pos = start;
                return null;
            }
            keyValuePairs = getKeyValuePairs(tokenizer);
            tokenizer.allowWhitespace();
            if (!tokenizer.getStringMatch('}')) {
                tokenizer.pos = start;
                return null;
            }
            return {
                t: types.OBJECT_LITERAL,
                m: keyValuePairs
            };
        };
    }(config_types, parse_Tokenizer_getExpression_getPrimary_getLiteral_getObjectLiteral_getKeyValuePairs);
var parse_Tokenizer_getExpression_shared_getExpressionList = function () {
        
        return function getExpressionList(tokenizer) {
            var start, expressions, expr, next;
            start = tokenizer.pos;
            tokenizer.allowWhitespace();
            expr = tokenizer.getExpression();
            if (expr === null) {
                return null;
            }
            expressions = [expr];
            tokenizer.allowWhitespace();
            if (tokenizer.getStringMatch(',')) {
                next = getExpressionList(tokenizer);
                if (next === null) {
                    tokenizer.pos = start;
                    return null;
                }
                expressions = expressions.concat(next);
            }
            return expressions;
        };
    }();
var parse_Tokenizer_getExpression_getPrimary_getLiteral_getArrayLiteral = function (types, getExpressionList) {
        
        return function (tokenizer) {
            var start, expressionList;
            start = tokenizer.pos;
            tokenizer.allowWhitespace();
            if (!tokenizer.getStringMatch('[')) {
                tokenizer.pos = start;
                return null;
            }
            expressionList = getExpressionList(tokenizer);
            if (!tokenizer.getStringMatch(']')) {
                tokenizer.pos = start;
                return null;
            }
            return {
                t: types.ARRAY_LITERAL,
                m: expressionList
            };
        };
    }(config_types, parse_Tokenizer_getExpression_shared_getExpressionList);
var parse_Tokenizer_getExpression_getPrimary_getLiteral__getLiteral = function (getNumberLiteral, getBooleanLiteral, getStringLiteral, getObjectLiteral, getArrayLiteral) {
        
        return function (tokenizer) {
            var literal = getNumberLiteral(tokenizer) || getBooleanLiteral(tokenizer) || getStringLiteral(tokenizer) || getObjectLiteral(tokenizer) || getArrayLiteral(tokenizer);
            return literal;
        };
    }(parse_Tokenizer_getExpression_getPrimary_getLiteral_getNumberLiteral, parse_Tokenizer_getExpression_getPrimary_getLiteral_getBooleanLiteral, parse_Tokenizer_getExpression_getPrimary_getLiteral_getStringLiteral__getStringLiteral, parse_Tokenizer_getExpression_getPrimary_getLiteral_getObjectLiteral__getObjectLiteral, parse_Tokenizer_getExpression_getPrimary_getLiteral_getArrayLiteral);
var parse_Tokenizer_getExpression_getPrimary_getReference = function (types, makeRegexMatcher, getName) {
        
        var getDotRefinement, getArrayRefinement, getArrayMember, globals;
        getDotRefinement = makeRegexMatcher(/^\.[a-zA-Z_$0-9]+/);
        getArrayRefinement = function (tokenizer) {
            var num = getArrayMember(tokenizer);
            if (num) {
                return '.' + num;
            }
            return null;
        };
        getArrayMember = makeRegexMatcher(/^\[(0|[1-9][0-9]*)\]/);
        globals = /^(?:Array|Date|RegExp|decodeURIComponent|decodeURI|encodeURIComponent|encodeURI|isFinite|isNaN|parseFloat|parseInt|JSON|Math|NaN|undefined|null)$/;
        return function (tokenizer) {
            var startPos, ancestor, name, dot, combo, refinement, lastDotIndex;
            startPos = tokenizer.pos;
            ancestor = '';
            while (tokenizer.getStringMatch('../')) {
                ancestor += '../';
            }
            if (!ancestor) {
                dot = tokenizer.getStringMatch('.') || '';
            }
            name = getName(tokenizer) || '';
            if (!ancestor && !dot && globals.test(name)) {
                return {
                    t: types.GLOBAL,
                    v: name
                };
            }
            if (name === 'this' && !ancestor && !dot) {
                name = '.';
                startPos += 3;
            }
            combo = (ancestor || dot) + name;
            if (!combo) {
                return null;
            }
            while (refinement = getDotRefinement(tokenizer) || getArrayRefinement(tokenizer)) {
                combo += refinement;
            }
            if (tokenizer.getStringMatch('(')) {
                lastDotIndex = combo.lastIndexOf('.');
                if (lastDotIndex !== -1) {
                    combo = combo.substr(0, lastDotIndex);
                    tokenizer.pos = startPos + combo.length;
                } else {
                    tokenizer.pos -= 1;
                }
            }
            return {
                t: types.REFERENCE,
                n: combo
            };
        };
    }(config_types, parse_Tokenizer_utils_makeRegexMatcher, parse_Tokenizer_getExpression_shared_getName);
var parse_Tokenizer_getExpression_getPrimary_getBracketedExpression = function (types) {
        
        return function (tokenizer) {
            var start, expr;
            start = tokenizer.pos;
            if (!tokenizer.getStringMatch('(')) {
                return null;
            }
            tokenizer.allowWhitespace();
            expr = tokenizer.getExpression();
            if (!expr) {
                tokenizer.pos = start;
                return null;
            }
            tokenizer.allowWhitespace();
            if (!tokenizer.getStringMatch(')')) {
                tokenizer.pos = start;
                return null;
            }
            return {
                t: types.BRACKETED,
                x: expr
            };
        };
    }(config_types);
var parse_Tokenizer_getExpression_getPrimary__getPrimary = function (getLiteral, getReference, getBracketedExpression) {
        
        return function (tokenizer) {
            return getLiteral(tokenizer) || getReference(tokenizer) || getBracketedExpression(tokenizer);
        };
    }(parse_Tokenizer_getExpression_getPrimary_getLiteral__getLiteral, parse_Tokenizer_getExpression_getPrimary_getReference, parse_Tokenizer_getExpression_getPrimary_getBracketedExpression);
var parse_Tokenizer_getExpression_shared_getRefinement = function (types, getName) {
        
        return function getRefinement(tokenizer) {
            var start, name, expr;
            start = tokenizer.pos;
            tokenizer.allowWhitespace();
            if (tokenizer.getStringMatch('.')) {
                tokenizer.allowWhitespace();
                if (name = getName(tokenizer)) {
                    return {
                        t: types.REFINEMENT,
                        n: name
                    };
                }
                tokenizer.expected('a property name');
            }
            if (tokenizer.getStringMatch('[')) {
                tokenizer.allowWhitespace();
                expr = tokenizer.getExpression();
                if (!expr) {
                    tokenizer.expected('an expression');
                }
                tokenizer.allowWhitespace();
                if (!tokenizer.getStringMatch(']')) {
                    tokenizer.expected('"]"');
                }
                return {
                    t: types.REFINEMENT,
                    x: expr
                };
            }
            return null;
        };
    }(config_types, parse_Tokenizer_getExpression_shared_getName);
var parse_Tokenizer_getExpression_getMemberOrInvocation = function (types, getPrimary, getExpressionList, getRefinement) {
        
        return function (tokenizer) {
            var current, expression, refinement, expressionList;
            expression = getPrimary(tokenizer);
            if (!expression) {
                return null;
            }
            while (expression) {
                current = tokenizer.pos;
                if (refinement = getRefinement(tokenizer)) {
                    expression = {
                        t: types.MEMBER,
                        x: expression,
                        r: refinement
                    };
                } else if (tokenizer.getStringMatch('(')) {
                    tokenizer.allowWhitespace();
                    expressionList = getExpressionList(tokenizer);
                    tokenizer.allowWhitespace();
                    if (!tokenizer.getStringMatch(')')) {
                        tokenizer.pos = current;
                        break;
                    }
                    expression = {
                        t: types.INVOCATION,
                        x: expression
                    };
                    if (expressionList) {
                        expression.o = expressionList;
                    }
                } else {
                    break;
                }
            }
            return expression;
        };
    }(config_types, parse_Tokenizer_getExpression_getPrimary__getPrimary, parse_Tokenizer_getExpression_shared_getExpressionList, parse_Tokenizer_getExpression_shared_getRefinement);
var parse_Tokenizer_getExpression_getTypeOf = function (types, getMemberOrInvocation) {
        
        var getTypeOf, makePrefixSequenceMatcher;
        makePrefixSequenceMatcher = function (symbol, fallthrough) {
            return function (tokenizer) {
                var start, expression;
                if (!tokenizer.getStringMatch(symbol)) {
                    return fallthrough(tokenizer);
                }
                start = tokenizer.pos;
                tokenizer.allowWhitespace();
                expression = tokenizer.getExpression();
                if (!expression) {
                    tokenizer.expected('an expression');
                }
                return {
                    s: symbol,
                    o: expression,
                    t: types.PREFIX_OPERATOR
                };
            };
        };
        (function () {
            var i, len, matcher, prefixOperators, fallthrough;
            prefixOperators = '! ~ + - typeof'.split(' ');
            fallthrough = getMemberOrInvocation;
            for (i = 0, len = prefixOperators.length; i < len; i += 1) {
                matcher = makePrefixSequenceMatcher(prefixOperators[i], fallthrough);
                fallthrough = matcher;
            }
            getTypeOf = fallthrough;
        }());
        return getTypeOf;
    }(config_types, parse_Tokenizer_getExpression_getMemberOrInvocation);
var parse_Tokenizer_getExpression_getLogicalOr = function (types, getTypeOf) {
        
        var getLogicalOr, makeInfixSequenceMatcher;
        makeInfixSequenceMatcher = function (symbol, fallthrough) {
            return function (tokenizer) {
                var start, left, right;
                left = fallthrough(tokenizer);
                if (!left) {
                    return null;
                }
                start = tokenizer.pos;
                tokenizer.allowWhitespace();
                if (!tokenizer.getStringMatch(symbol)) {
                    tokenizer.pos = start;
                    return left;
                }
                if (symbol === 'in' && /[a-zA-Z_$0-9]/.test(tokenizer.remaining().charAt(0))) {
                    tokenizer.pos = start;
                    return left;
                }
                tokenizer.allowWhitespace();
                right = tokenizer.getExpression();
                if (!right) {
                    tokenizer.pos = start;
                    return left;
                }
                return {
                    t: types.INFIX_OPERATOR,
                    s: symbol,
                    o: [
                        left,
                        right
                    ]
                };
            };
        };
        (function () {
            var i, len, matcher, infixOperators, fallthrough;
            infixOperators = '* / % + - << >> >>> < <= > >= in instanceof == != === !== & ^ | && ||'.split(' ');
            fallthrough = getTypeOf;
            for (i = 0, len = infixOperators.length; i < len; i += 1) {
                matcher = makeInfixSequenceMatcher(infixOperators[i], fallthrough);
                fallthrough = matcher;
            }
            getLogicalOr = fallthrough;
        }());
        return getLogicalOr;
    }(config_types, parse_Tokenizer_getExpression_getTypeOf);
var parse_Tokenizer_getExpression_getConditional = function (types, getLogicalOr) {
        
        return function (tokenizer) {
            var start, expression, ifTrue, ifFalse;
            expression = getLogicalOr(tokenizer);
            if (!expression) {
                return null;
            }
            start = tokenizer.pos;
            tokenizer.allowWhitespace();
            if (!tokenizer.getStringMatch('?')) {
                tokenizer.pos = start;
                return expression;
            }
            tokenizer.allowWhitespace();
            ifTrue = tokenizer.getExpression();
            if (!ifTrue) {
                tokenizer.pos = start;
                return expression;
            }
            tokenizer.allowWhitespace();
            if (!tokenizer.getStringMatch(':')) {
                tokenizer.pos = start;
                return expression;
            }
            tokenizer.allowWhitespace();
            ifFalse = tokenizer.getExpression();
            if (!ifFalse) {
                tokenizer.pos = start;
                return expression;
            }
            return {
                t: types.CONDITIONAL,
                o: [
                    expression,
                    ifTrue,
                    ifFalse
                ]
            };
        };
    }(config_types, parse_Tokenizer_getExpression_getLogicalOr);
var parse_Tokenizer_getExpression__getExpression = function (getConditional) {
        
        return function () {
            return getConditional(this);
        };
    }(parse_Tokenizer_getExpression_getConditional);
var parse_Tokenizer__Tokenizer = function (getMustache, getComment, getTag, getText, getExpression, allowWhitespace, getStringMatch) {
        
        var Tokenizer;
        Tokenizer = function (str, options) {
            var token;
            this.str = str;
            this.pos = 0;
            this.delimiters = options.delimiters;
            this.tripleDelimiters = options.tripleDelimiters;
            this.tokens = [];
            while (this.pos < this.str.length) {
                token = this.getToken();
                if (token === null && this.remaining()) {
                    this.fail();
                }
                this.tokens.push(token);
            }
        };
        Tokenizer.prototype = {
            getToken: function () {
                var token = this.getMustache() || this.getComment() || this.getTag() || this.getText();
                return token;
            },
            getMustache: getMustache,
            getComment: getComment,
            getTag: getTag,
            getText: getText,
            getExpression: getExpression,
            allowWhitespace: allowWhitespace,
            getStringMatch: getStringMatch,
            remaining: function () {
                return this.str.substring(this.pos);
            },
            fail: function () {
                var last20, next20;
                last20 = this.str.substr(0, this.pos).substr(-20);
                if (last20.length === 20) {
                    last20 = '...' + last20;
                }
                next20 = this.remaining().substr(0, 20);
                if (next20.length === 20) {
                    next20 = next20 + '...';
                }
                throw new Error('Could not parse template: ' + (last20 ? last20 + '<- ' : '') + 'failed at character ' + this.pos + ' ->' + next20);
            },
            expected: function (thing) {
                var remaining = this.remaining().substr(0, 40);
                if (remaining.length === 40) {
                    remaining += '...';
                }
                throw new Error('Tokenizer failed: unexpected string "' + remaining + '" (expected ' + thing + ')');
            }
        };
        return Tokenizer;
    }(parse_Tokenizer_getMustache__getMustache, parse_Tokenizer_getComment_getComment, parse_Tokenizer_getTag__getTag, parse_Tokenizer_getText__getText, parse_Tokenizer_getExpression__getExpression, parse_Tokenizer_utils_allowWhitespace, parse_Tokenizer_utils_getStringMatch);
var parse_tokenize = function (stripHtmlComments, stripStandalones, stripCommentTokens, Tokenizer, circular) {
        
        var tokenize, Ractive;
        circular.push(function () {
            Ractive = circular.Ractive;
        });
        tokenize = function (template, options) {
            var tokenizer, tokens;
            options = options || {};
            if (options.stripComments !== false) {
                template = stripHtmlComments(template);
            }
            tokenizer = new Tokenizer(template, {
                delimiters: options.delimiters || (Ractive ? Ractive.delimiters : [
                    '{{',
                    '}}'
                ]),
                tripleDelimiters: options.tripleDelimiters || (Ractive ? Ractive.tripleDelimiters : [
                    '{{{',
                    '}}}'
                ])
            });
            tokens = tokenizer.tokens;
            stripStandalones(tokens);
            stripCommentTokens(tokens);
            return tokens;
        };
        return tokenize;
    }(parse_utils_stripHtmlComments, parse_utils_stripStandalones, parse_utils_stripCommentTokens, parse_Tokenizer__Tokenizer, circular);
var parse_Parser_getText_TextStub__TextStub = function (types) {
        
        var TextStub, htmlEntities, controlCharacters, namedEntityPattern, hexEntityPattern, decimalEntityPattern, validateCode, decodeCharacterReferences, whitespace;
        TextStub = function (token, preserveWhitespace) {
            this.text = preserveWhitespace ? token.value : token.value.replace(whitespace, ' ');
        };
        TextStub.prototype = {
            type: types.TEXT,
            toJSON: function () {
                return this.decoded || (this.decoded = decodeCharacterReferences(this.text));
            },
            toString: function () {
                return this.text;
            }
        };
        htmlEntities = {
            quot: 34,
            amp: 38,
            apos: 39,
            lt: 60,
            gt: 62,
            nbsp: 160,
            iexcl: 161,
            cent: 162,
            pound: 163,
            curren: 164,
            yen: 165,
            brvbar: 166,
            sect: 167,
            uml: 168,
            copy: 169,
            ordf: 170,
            laquo: 171,
            not: 172,
            shy: 173,
            reg: 174,
            macr: 175,
            deg: 176,
            plusmn: 177,
            sup2: 178,
            sup3: 179,
            acute: 180,
            micro: 181,
            para: 182,
            middot: 183,
            cedil: 184,
            sup1: 185,
            ordm: 186,
            raquo: 187,
            frac14: 188,
            frac12: 189,
            frac34: 190,
            iquest: 191,
            Agrave: 192,
            Aacute: 193,
            Acirc: 194,
            Atilde: 195,
            Auml: 196,
            Aring: 197,
            AElig: 198,
            Ccedil: 199,
            Egrave: 200,
            Eacute: 201,
            Ecirc: 202,
            Euml: 203,
            Igrave: 204,
            Iacute: 205,
            Icirc: 206,
            Iuml: 207,
            ETH: 208,
            Ntilde: 209,
            Ograve: 210,
            Oacute: 211,
            Ocirc: 212,
            Otilde: 213,
            Ouml: 214,
            times: 215,
            Oslash: 216,
            Ugrave: 217,
            Uacute: 218,
            Ucirc: 219,
            Uuml: 220,
            Yacute: 221,
            THORN: 222,
            szlig: 223,
            agrave: 224,
            aacute: 225,
            acirc: 226,
            atilde: 227,
            auml: 228,
            aring: 229,
            aelig: 230,
            ccedil: 231,
            egrave: 232,
            eacute: 233,
            ecirc: 234,
            euml: 235,
            igrave: 236,
            iacute: 237,
            icirc: 238,
            iuml: 239,
            eth: 240,
            ntilde: 241,
            ograve: 242,
            oacute: 243,
            ocirc: 244,
            otilde: 245,
            ouml: 246,
            divide: 247,
            oslash: 248,
            ugrave: 249,
            uacute: 250,
            ucirc: 251,
            uuml: 252,
            yacute: 253,
            thorn: 254,
            yuml: 255,
            OElig: 338,
            oelig: 339,
            Scaron: 352,
            scaron: 353,
            Yuml: 376,
            fnof: 402,
            circ: 710,
            tilde: 732,
            Alpha: 913,
            Beta: 914,
            Gamma: 915,
            Delta: 916,
            Epsilon: 917,
            Zeta: 918,
            Eta: 919,
            Theta: 920,
            Iota: 921,
            Kappa: 922,
            Lambda: 923,
            Mu: 924,
            Nu: 925,
            Xi: 926,
            Omicron: 927,
            Pi: 928,
            Rho: 929,
            Sigma: 931,
            Tau: 932,
            Upsilon: 933,
            Phi: 934,
            Chi: 935,
            Psi: 936,
            Omega: 937,
            alpha: 945,
            beta: 946,
            gamma: 947,
            delta: 948,
            epsilon: 949,
            zeta: 950,
            eta: 951,
            theta: 952,
            iota: 953,
            kappa: 954,
            lambda: 955,
            mu: 956,
            nu: 957,
            xi: 958,
            omicron: 959,
            pi: 960,
            rho: 961,
            sigmaf: 962,
            sigma: 963,
            tau: 964,
            upsilon: 965,
            phi: 966,
            chi: 967,
            psi: 968,
            omega: 969,
            thetasym: 977,
            upsih: 978,
            piv: 982,
            ensp: 8194,
            emsp: 8195,
            thinsp: 8201,
            zwnj: 8204,
            zwj: 8205,
            lrm: 8206,
            rlm: 8207,
            ndash: 8211,
            mdash: 8212,
            lsquo: 8216,
            rsquo: 8217,
            sbquo: 8218,
            ldquo: 8220,
            rdquo: 8221,
            bdquo: 8222,
            dagger: 8224,
            Dagger: 8225,
            bull: 8226,
            hellip: 8230,
            permil: 8240,
            prime: 8242,
            Prime: 8243,
            lsaquo: 8249,
            rsaquo: 8250,
            oline: 8254,
            frasl: 8260,
            euro: 8364,
            image: 8465,
            weierp: 8472,
            real: 8476,
            trade: 8482,
            alefsym: 8501,
            larr: 8592,
            uarr: 8593,
            rarr: 8594,
            darr: 8595,
            harr: 8596,
            crarr: 8629,
            lArr: 8656,
            uArr: 8657,
            rArr: 8658,
            dArr: 8659,
            hArr: 8660,
            forall: 8704,
            part: 8706,
            exist: 8707,
            empty: 8709,
            nabla: 8711,
            isin: 8712,
            notin: 8713,
            ni: 8715,
            prod: 8719,
            sum: 8721,
            minus: 8722,
            lowast: 8727,
            radic: 8730,
            prop: 8733,
            infin: 8734,
            ang: 8736,
            and: 8743,
            or: 8744,
            cap: 8745,
            cup: 8746,
            'int': 8747,
            there4: 8756,
            sim: 8764,
            cong: 8773,
            asymp: 8776,
            ne: 8800,
            equiv: 8801,
            le: 8804,
            ge: 8805,
            sub: 8834,
            sup: 8835,
            nsub: 8836,
            sube: 8838,
            supe: 8839,
            oplus: 8853,
            otimes: 8855,
            perp: 8869,
            sdot: 8901,
            lceil: 8968,
            rceil: 8969,
            lfloor: 8970,
            rfloor: 8971,
            lang: 9001,
            rang: 9002,
            loz: 9674,
            spades: 9824,
            clubs: 9827,
            hearts: 9829,
            diams: 9830
        };
        controlCharacters = [
            8364,
            129,
            8218,
            402,
            8222,
            8230,
            8224,
            8225,
            710,
            8240,
            352,
            8249,
            338,
            141,
            381,
            143,
            144,
            8216,
            8217,
            8220,
            8221,
            8226,
            8211,
            8212,
            732,
            8482,
            353,
            8250,
            339,
            157,
            382,
            376
        ];
        namedEntityPattern = new RegExp('&(' + Object.keys(htmlEntities).join('|') + ');?', 'g');
        hexEntityPattern = /&#x([0-9]+);?/g;
        decimalEntityPattern = /&#([0-9]+);?/g;
        validateCode = function (code) {
            if (!code) {
                return 65533;
            }
            if (code === 10) {
                return 32;
            }
            if (code < 128) {
                return code;
            }
            if (code <= 159) {
                return controlCharacters[code - 128];
            }
            if (code < 55296) {
                return code;
            }
            if (code <= 57343) {
                return 65533;
            }
            if (code <= 65535) {
                return code;
            }
            return 65533;
        };
        decodeCharacterReferences = function (html) {
            var result;
            result = html.replace(namedEntityPattern, function (match, name) {
                if (htmlEntities[name]) {
                    return String.fromCharCode(htmlEntities[name]);
                }
                return match;
            });
            result = result.replace(hexEntityPattern, function (match, hex) {
                return String.fromCharCode(validateCode(parseInt(hex, 16)));
            });
            result = result.replace(decimalEntityPattern, function (match, charCode) {
                return String.fromCharCode(validateCode(charCode));
            });
            return result;
        };
        whitespace = /\s+/g;
        return TextStub;
    }(config_types);
var parse_Parser_getText__getText = function (types, TextStub) {
        
        return function (token) {
            if (token.type === types.TEXT) {
                this.pos += 1;
                return new TextStub(token, this.preserveWhitespace);
            }
            return null;
        };
    }(config_types, parse_Parser_getText_TextStub__TextStub);
var parse_Parser_getComment_CommentStub__CommentStub = function (types) {
        
        var CommentStub;
        CommentStub = function (token) {
            this.content = token.content;
        };
        CommentStub.prototype = {
            toJSON: function () {
                return {
                    t: types.COMMENT,
                    f: this.content
                };
            },
            toString: function () {
                return '<!--' + this.content + '-->';
            }
        };
        return CommentStub;
    }(config_types);
var parse_Parser_getComment__getComment = function (types, CommentStub) {
        
        return function (token) {
            if (token.type === types.COMMENT) {
                this.pos += 1;
                return new CommentStub(token, this.preserveWhitespace);
            }
            return null;
        };
    }(config_types, parse_Parser_getComment_CommentStub__CommentStub);
var parse_Parser_getMustache_ExpressionStub__ExpressionStub = function (types, isObject) {
        
        var ExpressionStub, getRefs, stringify;
        ExpressionStub = function (token) {
            this.refs = [];
            getRefs(token, this.refs);
            this.str = stringify(token, this.refs);
        };
        ExpressionStub.prototype = {
            toJSON: function () {
                if (this.json) {
                    return this.json;
                }
                this.json = {
                    r: this.refs,
                    s: this.str
                };
                return this.json;
            }
        };
        getRefs = function (token, refs) {
            var i, list;
            if (token.t === types.REFERENCE) {
                if (refs.indexOf(token.n) === -1) {
                    refs.unshift(token.n);
                }
            }
            list = token.o || token.m;
            if (list) {
                if (isObject(list)) {
                    getRefs(list, refs);
                } else {
                    i = list.length;
                    while (i--) {
                        getRefs(list[i], refs);
                    }
                }
            }
            if (token.x) {
                getRefs(token.x, refs);
            }
            if (token.r) {
                getRefs(token.r, refs);
            }
            if (token.v) {
                getRefs(token.v, refs);
            }
        };
        stringify = function (token, refs) {
            var map = function (item) {
                return stringify(item, refs);
            };
            switch (token.t) {
            case types.BOOLEAN_LITERAL:
            case types.GLOBAL:
            case types.NUMBER_LITERAL:
                return token.v;
            case types.STRING_LITERAL:
                return '\'' + token.v.replace(/'/g, '\\\'') + '\'';
            case types.ARRAY_LITERAL:
                return '[' + (token.m ? token.m.map(map).join(',') : '') + ']';
            case types.OBJECT_LITERAL:
                return '{' + (token.m ? token.m.map(map).join(',') : '') + '}';
            case types.KEY_VALUE_PAIR:
                return token.k + ':' + stringify(token.v, refs);
            case types.PREFIX_OPERATOR:
                return (token.s === 'typeof' ? 'typeof ' : token.s) + stringify(token.o, refs);
            case types.INFIX_OPERATOR:
                return stringify(token.o[0], refs) + (token.s.substr(0, 2) === 'in' ? ' ' + token.s + ' ' : token.s) + stringify(token.o[1], refs);
            case types.INVOCATION:
                return stringify(token.x, refs) + '(' + (token.o ? token.o.map(map).join(',') : '') + ')';
            case types.BRACKETED:
                return '(' + stringify(token.x, refs) + ')';
            case types.MEMBER:
                return stringify(token.x, refs) + stringify(token.r, refs);
            case types.REFINEMENT:
                return token.n ? '.' + token.n : '[' + stringify(token.x, refs) + ']';
            case types.CONDITIONAL:
                return stringify(token.o[0], refs) + '?' + stringify(token.o[1], refs) + ':' + stringify(token.o[2], refs);
            case types.REFERENCE:
                return '${' + refs.indexOf(token.n) + '}';
            default:
                throw new Error('Could not stringify expression token. This error is unexpected');
            }
        };
        return ExpressionStub;
    }(config_types, utils_isObject);
var parse_Parser_getMustache_MustacheStub__MustacheStub = function (types, ExpressionStub) {
        
        var MustacheStub = function (token, parser) {
            this.type = token.type === types.TRIPLE ? types.TRIPLE : token.mustacheType;
            if (token.ref) {
                this.ref = token.ref;
            }
            if (token.expression) {
                this.expr = new ExpressionStub(token.expression);
            }
            parser.pos += 1;
        };
        MustacheStub.prototype = {
            toJSON: function () {
                var json;
                if (this.json) {
                    return this.json;
                }
                json = { t: this.type };
                if (this.ref) {
                    json.r = this.ref;
                }
                if (this.expr) {
                    json.x = this.expr.toJSON();
                }
                this.json = json;
                return json;
            },
            toString: function () {
                return false;
            }
        };
        return MustacheStub;
    }(config_types, parse_Parser_getMustache_ExpressionStub__ExpressionStub);
var parse_Parser_utils_stringifyStubs = function () {
        
        return function (items) {
            var str = '', itemStr, i, len;
            if (!items) {
                return '';
            }
            for (i = 0, len = items.length; i < len; i += 1) {
                itemStr = items[i].toString();
                if (itemStr === false) {
                    return false;
                }
                str += itemStr;
            }
            return str;
        };
    }();
var parse_Parser_utils_jsonifyStubs = function (stringifyStubs) {
        
        return function (items, noStringify) {
            var str, json;
            if (!noStringify) {
                str = stringifyStubs(items);
                if (str !== false) {
                    return str;
                }
            }
            json = items.map(function (item) {
                return item.toJSON(noStringify);
            });
            return json;
        };
    }(parse_Parser_utils_stringifyStubs);
var parse_Parser_getMustache_SectionStub__SectionStub = function (types, jsonifyStubs, ExpressionStub) {
        
        var SectionStub = function (firstToken, parser) {
            var next;
            this.ref = firstToken.ref;
            this.indexRef = firstToken.indexRef;
            this.inverted = firstToken.mustacheType === types.INVERTED;
            if (firstToken.expression) {
                this.expr = new ExpressionStub(firstToken.expression);
            }
            parser.pos += 1;
            this.items = [];
            next = parser.next();
            while (next) {
                if (next.mustacheType === types.CLOSING) {
                    if (next.ref.trim() === this.ref || this.expr) {
                        parser.pos += 1;
                        break;
                    } else {
                        throw new Error('Could not parse template: Illegal closing section');
                    }
                }
                this.items[this.items.length] = parser.getStub();
                next = parser.next();
            }
        };
        SectionStub.prototype = {
            toJSON: function (noStringify) {
                var json;
                if (this.json) {
                    return this.json;
                }
                json = { t: types.SECTION };
                if (this.ref) {
                    json.r = this.ref;
                }
                if (this.indexRef) {
                    json.i = this.indexRef;
                }
                if (this.inverted) {
                    json.n = true;
                }
                if (this.expr) {
                    json.x = this.expr.toJSON();
                }
                if (this.items.length) {
                    json.f = jsonifyStubs(this.items, noStringify);
                }
                this.json = json;
                return json;
            },
            toString: function () {
                return false;
            }
        };
        return SectionStub;
    }(config_types, parse_Parser_utils_jsonifyStubs, parse_Parser_getMustache_ExpressionStub__ExpressionStub);
var parse_Parser_getMustache__getMustache = function (types, MustacheStub, SectionStub) {
        
        return function (token) {
            if (token.type === types.MUSTACHE || token.type === types.TRIPLE) {
                if (token.mustacheType === types.SECTION || token.mustacheType === types.INVERTED) {
                    return new SectionStub(token, this);
                }
                return new MustacheStub(token, this);
            }
        };
    }(config_types, parse_Parser_getMustache_MustacheStub__MustacheStub, parse_Parser_getMustache_SectionStub__SectionStub);
var parse_Parser_getElement_ElementStub_utils_siblingsByTagName = function () {
        
        return {
            li: ['li'],
            dt: [
                'dt',
                'dd'
            ],
            dd: [
                'dt',
                'dd'
            ],
            p: 'address article aside blockquote dir div dl fieldset footer form h1 h2 h3 h4 h5 h6 header hgroup hr menu nav ol p pre section table ul'.split(' '),
            rt: [
                'rt',
                'rp'
            ],
            rp: [
                'rp',
                'rt'
            ],
            optgroup: ['optgroup'],
            option: [
                'option',
                'optgroup'
            ],
            thead: [
                'tbody',
                'tfoot'
            ],
            tbody: [
                'tbody',
                'tfoot'
            ],
            tr: ['tr'],
            td: [
                'td',
                'th'
            ],
            th: [
                'td',
                'th'
            ]
        };
    }();
var parse_Parser_getElement_ElementStub_utils_filterAttributes = function (isArray) {
        
        return function (items) {
            var attrs, proxies, filtered, i, len, item;
            filtered = {};
            attrs = [];
            proxies = [];
            len = items.length;
            for (i = 0; i < len; i += 1) {
                item = items[i];
                if (item.name === 'intro') {
                    if (filtered.intro) {
                        throw new Error('An element can only have one intro transition');
                    }
                    filtered.intro = item;
                } else if (item.name === 'outro') {
                    if (filtered.outro) {
                        throw new Error('An element can only have one outro transition');
                    }
                    filtered.outro = item;
                } else if (item.name === 'intro-outro') {
                    if (filtered.intro || filtered.outro) {
                        throw new Error('An element can only have one intro and one outro transition');
                    }
                    filtered.intro = item;
                    filtered.outro = deepClone(item);
                } else if (item.name.substr(0, 6) === 'proxy-') {
                    item.name = item.name.substring(6);
                    proxies[proxies.length] = item;
                } else if (item.name.substr(0, 3) === 'on-') {
                    item.name = item.name.substring(3);
                    proxies[proxies.length] = item;
                } else if (item.name === 'decorator') {
                    filtered.decorator = item;
                } else {
                    attrs[attrs.length] = item;
                }
            }
            filtered.attrs = attrs;
            filtered.proxies = proxies;
            return filtered;
        };
        function deepClone(obj) {
            var result, key;
            if (typeof obj !== 'object') {
                return obj;
            }
            if (isArray(obj)) {
                return obj.map(deepClone);
            }
            result = {};
            for (key in obj) {
                if (obj.hasOwnProperty(key)) {
                    result[key] = deepClone(obj[key]);
                }
            }
            return result;
        }
    }(utils_isArray);
var parse_Parser_getElement_ElementStub_utils_processDirective = function (types, parseJSON) {
        
        return function (directive) {
            var processed, tokens, token, colonIndex, throwError, directiveName, directiveArgs, parsed;
            throwError = function () {
                throw new Error('Illegal directive');
            };
            if (!directive.name || !directive.value) {
                throwError();
            }
            processed = { directiveType: directive.name };
            tokens = directive.value;
            directiveName = [];
            directiveArgs = [];
            while (tokens.length) {
                token = tokens.shift();
                if (token.type === types.TEXT) {
                    colonIndex = token.value.indexOf(':');
                    if (colonIndex === -1) {
                        directiveName[directiveName.length] = token;
                    } else {
                        if (colonIndex) {
                            directiveName[directiveName.length] = {
                                type: types.TEXT,
                                value: token.value.substr(0, colonIndex)
                            };
                        }
                        if (token.value.length > colonIndex + 1) {
                            directiveArgs[0] = {
                                type: types.TEXT,
                                value: token.value.substring(colonIndex + 1)
                            };
                        }
                        break;
                    }
                } else {
                    directiveName[directiveName.length] = token;
                }
            }
            directiveArgs = directiveArgs.concat(tokens);
            if (directiveName.length === 1 && directiveName[0].type === types.TEXT) {
                processed.name = directiveName[0].value;
            } else {
                processed.name = directiveName;
            }
            if (directiveArgs.length) {
                if (directiveArgs.length === 1 && directiveArgs[0].type === types.TEXT) {
                    parsed = parseJSON('[' + directiveArgs[0].value + ']');
                    processed.args = parsed ? parsed.value : directiveArgs[0].value;
                } else {
                    processed.dynamicArgs = directiveArgs;
                }
            }
            return processed;
        };
    }(config_types, utils_parseJSON);
var parse_Parser_StringStub_StringParser = function (getText, getMustache) {
        
        var StringParser;
        StringParser = function (tokens, options) {
            var stub;
            this.tokens = tokens || [];
            this.pos = 0;
            this.options = options;
            this.result = [];
            while (stub = this.getStub()) {
                this.result.push(stub);
            }
        };
        StringParser.prototype = {
            getStub: function () {
                var token = this.next();
                if (!token) {
                    return null;
                }
                return this.getText(token) || this.getMustache(token);
            },
            getText: getText,
            getMustache: getMustache,
            next: function () {
                return this.tokens[this.pos];
            }
        };
        return StringParser;
    }(parse_Parser_getText__getText, parse_Parser_getMustache__getMustache);
var parse_Parser_StringStub__StringStub = function (StringParser, stringifyStubs, jsonifyStubs) {
        
        var StringStub;
        StringStub = function (tokens) {
            var parser = new StringParser(tokens);
            this.stubs = parser.result;
        };
        StringStub.prototype = {
            toJSON: function (noStringify) {
                var json;
                if (this['json_' + noStringify]) {
                    return this['json_' + noStringify];
                }
                json = this['json_' + noStringify] = jsonifyStubs(this.stubs, noStringify);
                return json;
            },
            toString: function () {
                if (this.str !== undefined) {
                    return this.str;
                }
                this.str = stringifyStubs(this.stubs);
                return this.str;
            }
        };
        return StringStub;
    }(parse_Parser_StringStub_StringParser, parse_Parser_utils_stringifyStubs, parse_Parser_utils_jsonifyStubs);
var parse_Parser_getElement_ElementStub_utils_jsonifyDirective = function (StringStub) {
        
        return function (directive) {
            var result, name;
            if (typeof directive.name === 'string') {
                if (!directive.args && !directive.dynamicArgs) {
                    return directive.name;
                }
                name = directive.name;
            } else {
                name = new StringStub(directive.name).toJSON();
            }
            result = { n: name };
            if (directive.args) {
                result.a = directive.args;
                return result;
            }
            if (directive.dynamicArgs) {
                result.d = new StringStub(directive.dynamicArgs).toJSON();
            }
            return result;
        };
    }(parse_Parser_StringStub__StringStub);
var parse_Parser_getElement_ElementStub_toJSON = function (types, jsonifyStubs, jsonifyDirective) {
        
        return function (noStringify) {
            var json, name, value, proxy, i, len, attribute;
            if (this['json_' + noStringify]) {
                return this['json_' + noStringify];
            }
            if (this.component) {
                json = {
                    t: types.COMPONENT,
                    e: this.component
                };
            } else {
                json = {
                    t: types.ELEMENT,
                    e: this.tag
                };
            }
            if (this.doctype) {
                json.y = 1;
            }
            if (this.attributes && this.attributes.length) {
                json.a = {};
                len = this.attributes.length;
                for (i = 0; i < len; i += 1) {
                    attribute = this.attributes[i];
                    name = attribute.name;
                    if (json.a[name]) {
                        throw new Error('You cannot have multiple attributes with the same name');
                    }
                    if (attribute.value === null) {
                        value = null;
                    } else {
                        value = attribute.value.toJSON(noStringify);
                    }
                    json.a[name] = value;
                }
            }
            if (this.items && this.items.length) {
                json.f = jsonifyStubs(this.items, noStringify);
            }
            if (this.proxies && this.proxies.length) {
                json.v = {};
                len = this.proxies.length;
                for (i = 0; i < len; i += 1) {
                    proxy = this.proxies[i];
                    json.v[proxy.directiveType] = jsonifyDirective(proxy);
                }
            }
            if (this.intro) {
                json.t1 = jsonifyDirective(this.intro);
            }
            if (this.outro) {
                json.t2 = jsonifyDirective(this.outro);
            }
            if (this.decorator) {
                json.o = jsonifyDirective(this.decorator);
            }
            this['json_' + noStringify] = json;
            return json;
        };
    }(config_types, parse_Parser_utils_jsonifyStubs, parse_Parser_getElement_ElementStub_utils_jsonifyDirective);
var parse_Parser_getElement_ElementStub_toString = function (stringifyStubs, voidElementNames) {
        
        var htmlElements;
        htmlElements = 'a abbr acronym address applet area b base basefont bdo big blockquote body br button caption center cite code col colgroup dd del dfn dir div dl dt em fieldset font form frame frameset h1 h2 h3 h4 h5 h6 head hr html i iframe img input ins isindex kbd label legend li link map menu meta noframes noscript object ol p param pre q s samp script select small span strike strong style sub sup textarea title tt u ul var article aside audio bdi canvas command data datagrid datalist details embed eventsource figcaption figure footer header hgroup keygen mark meter nav output progress ruby rp rt section source summary time track video wbr'.split(' ');
        return function () {
            var str, i, len, attrStr, name, attrValueStr, fragStr, isVoid;
            if (this.str !== undefined) {
                return this.str;
            }
            if (this.component) {
                return this.str = false;
            }
            if (htmlElements.indexOf(this.tag.toLowerCase()) === -1) {
                return this.str = false;
            }
            if (this.proxies || this.intro || this.outro || this.decorator) {
                return this.str = false;
            }
            fragStr = stringifyStubs(this.items);
            if (fragStr === false) {
                return this.str = false;
            }
            isVoid = voidElementNames.indexOf(this.tag.toLowerCase()) !== -1;
            str = '<' + this.tag;
            if (this.attributes) {
                for (i = 0, len = this.attributes.length; i < len; i += 1) {
                    name = this.attributes[i].name;
                    if (name.indexOf(':') !== -1) {
                        return this.str = false;
                    }
                    if (name === 'id' || name === 'intro' || name === 'outro') {
                        return this.str = false;
                    }
                    attrStr = ' ' + name;
                    if (this.attributes[i].value !== null) {
                        attrValueStr = this.attributes[i].value.toString();
                        if (attrValueStr === false) {
                            return this.str = false;
                        }
                        if (attrValueStr !== '') {
                            attrStr += '=';
                            if (/[\s"'=<>`]/.test(attrValueStr)) {
                                attrStr += '"' + attrValueStr.replace(/"/g, '&quot;') + '"';
                            } else {
                                attrStr += attrValueStr;
                            }
                        }
                    }
                    str += attrStr;
                }
            }
            if (this.selfClosing && !isVoid) {
                str += '/>';
                return this.str = str;
            }
            str += '>';
            if (isVoid) {
                return this.str = str;
            }
            str += fragStr;
            str += '</' + this.tag + '>';
            return this.str = str;
        };
    }(parse_Parser_utils_stringifyStubs, config_voidElementNames);
var parse_Parser_getElement_ElementStub__ElementStub = function (types, voidElementNames, warn, camelCase, stringifyStubs, siblingsByTagName, filterAttributes, processDirective, toJSON, toString, StringStub) {
        
        var ElementStub, allElementNames, closedByParentClose, onPattern, sanitize, leadingWhitespace = /^\s+/, trailingWhitespace = /\s+$/;
        ElementStub = function (firstToken, parser, preserveWhitespace) {
            var next, attrs, filtered, proxies, item, getFrag, lowerCaseTag;
            parser.pos += 1;
            getFrag = function (attr) {
                return {
                    name: attr.name,
                    value: attr.value ? new StringStub(attr.value) : null
                };
            };
            this.tag = firstToken.name;
            lowerCaseTag = firstToken.name.toLowerCase();
            if (lowerCaseTag.substr(0, 3) === 'rv-') {
                warn('The "rv-" prefix for components has been deprecated. Support will be removed in a future version');
                this.tag = this.tag.substring(3);
            }
            preserveWhitespace = preserveWhitespace || lowerCaseTag === 'pre';
            if (firstToken.attrs) {
                filtered = filterAttributes(firstToken.attrs);
                attrs = filtered.attrs;
                proxies = filtered.proxies;
                if (parser.options.sanitize && parser.options.sanitize.eventAttributes) {
                    attrs = attrs.filter(sanitize);
                }
                if (attrs.length) {
                    this.attributes = attrs.map(getFrag);
                }
                if (proxies.length) {
                    this.proxies = proxies.map(processDirective);
                }
                if (filtered.intro) {
                    this.intro = processDirective(filtered.intro);
                }
                if (filtered.outro) {
                    this.outro = processDirective(filtered.outro);
                }
                if (filtered.decorator) {
                    this.decorator = processDirective(filtered.decorator);
                }
            }
            if (firstToken.doctype) {
                this.doctype = true;
            }
            if (firstToken.selfClosing) {
                this.selfClosing = true;
            }
            if (voidElementNames.indexOf(lowerCaseTag) !== -1) {
                this.isVoid = true;
            }
            if (this.selfClosing || this.isVoid) {
                return;
            }
            this.siblings = siblingsByTagName[lowerCaseTag];
            this.items = [];
            next = parser.next();
            while (next) {
                if (next.mustacheType === types.CLOSING) {
                    break;
                }
                if (next.type === types.TAG) {
                    if (next.closing) {
                        if (next.name.toLowerCase() === lowerCaseTag) {
                            parser.pos += 1;
                        }
                        break;
                    } else if (this.siblings && this.siblings.indexOf(next.name.toLowerCase()) !== -1) {
                        break;
                    }
                }
                this.items[this.items.length] = parser.getStub();
                next = parser.next();
            }
            if (!preserveWhitespace) {
                item = this.items[0];
                if (item && item.type === types.TEXT) {
                    item.text = item.text.replace(leadingWhitespace, '');
                    if (!item.text) {
                        this.items.shift();
                    }
                }
                item = this.items[this.items.length - 1];
                if (item && item.type === types.TEXT) {
                    item.text = item.text.replace(trailingWhitespace, '');
                    if (!item.text) {
                        this.items.pop();
                    }
                }
            }
        };
        ElementStub.prototype = {
            toJSON: toJSON,
            toString: toString
        };
        allElementNames = 'a abbr acronym address applet area b base basefont bdo big blockquote body br button caption center cite code col colgroup dd del dfn dir div dl dt em fieldset font form frame frameset h1 h2 h3 h4 h5 h6 head hr html i iframe img input ins isindex kbd label legend li link map menu meta noframes noscript object ol p param pre q s samp script select small span strike strong style sub sup textarea title tt u ul var article aside audio bdi canvas command data datagrid datalist details embed eventsource figcaption figure footer header hgroup keygen mark meter nav output progress ruby rp rt section source summary time track video wbr'.split(' ');
        closedByParentClose = 'li dd rt rp optgroup option tbody tfoot tr td th'.split(' ');
        onPattern = /^on[a-zA-Z]/;
        sanitize = function (attr) {
            var valid = !onPattern.test(attr.name);
            return valid;
        };
        return ElementStub;
    }(config_types, config_voidElementNames, utils_warn, utils_camelCase, parse_Parser_utils_stringifyStubs, parse_Parser_getElement_ElementStub_utils_siblingsByTagName, parse_Parser_getElement_ElementStub_utils_filterAttributes, parse_Parser_getElement_ElementStub_utils_processDirective, parse_Parser_getElement_ElementStub_toJSON, parse_Parser_getElement_ElementStub_toString, parse_Parser_StringStub__StringStub);
var parse_Parser_getElement__getElement = function (types, ElementStub) {
        
        return function (token) {
            if (this.options.sanitize && this.options.sanitize.elements) {
                if (this.options.sanitize.elements.indexOf(token.name.toLowerCase()) !== -1) {
                    return null;
                }
            }
            return new ElementStub(token, this);
        };
    }(config_types, parse_Parser_getElement_ElementStub__ElementStub);
var parse_Parser__Parser = function (getText, getComment, getMustache, getElement, jsonifyStubs) {
        
        var Parser;
        Parser = function (tokens, options) {
            var stub, stubs;
            this.tokens = tokens || [];
            this.pos = 0;
            this.options = options;
            this.preserveWhitespace = options.preserveWhitespace;
            stubs = [];
            while (stub = this.getStub()) {
                stubs.push(stub);
            }
            this.result = jsonifyStubs(stubs);
        };
        Parser.prototype = {
            getStub: function () {
                var token = this.next();
                if (!token) {
                    return null;
                }
                return this.getText(token) || this.getComment(token) || this.getMustache(token) || this.getElement(token);
            },
            getText: getText,
            getComment: getComment,
            getMustache: getMustache,
            getElement: getElement,
            next: function () {
                return this.tokens[this.pos];
            }
        };
        return Parser;
    }(parse_Parser_getText__getText, parse_Parser_getComment__getComment, parse_Parser_getMustache__getMustache, parse_Parser_getElement__getElement, parse_Parser_utils_jsonifyStubs);
var parse__parse = function (tokenize, types, Parser) {
        
        var parse, onlyWhitespace, inlinePartialStart, inlinePartialEnd, parseCompoundTemplate;
        onlyWhitespace = /^\s*$/;
        inlinePartialStart = /<!--\s*\{\{\s*>\s*([a-zA-Z_$][a-zA-Z_$0-9]*)\s*}\}\s*-->/;
        inlinePartialEnd = /<!--\s*\{\{\s*\/\s*([a-zA-Z_$][a-zA-Z_$0-9]*)\s*}\}\s*-->/;
        parse = function (template, options) {
            var tokens, json, token;
            options = options || {};
            if (inlinePartialStart.test(template)) {
                return parseCompoundTemplate(template, options);
            }
            if (options.sanitize === true) {
                options.sanitize = {
                    elements: 'applet base basefont body frame frameset head html isindex link meta noframes noscript object param script style title'.split(' '),
                    eventAttributes: true
                };
            }
            tokens = tokenize(template, options);
            if (!options.preserveWhitespace) {
                token = tokens[0];
                if (token && token.type === types.TEXT && onlyWhitespace.test(token.value)) {
                    tokens.shift();
                }
                token = tokens[tokens.length - 1];
                if (token && token.type === types.TEXT && onlyWhitespace.test(token.value)) {
                    tokens.pop();
                }
            }
            json = new Parser(tokens, options).result;
            if (typeof json === 'string') {
                return [json];
            }
            return json;
        };
        parseCompoundTemplate = function (template, options) {
            var mainTemplate, remaining, partials, name, startMatch, endMatch;
            partials = {};
            mainTemplate = '';
            remaining = template;
            while (startMatch = inlinePartialStart.exec(remaining)) {
                name = startMatch[1];
                mainTemplate += remaining.substr(0, startMatch.index);
                remaining = remaining.substring(startMatch.index + startMatch[0].length);
                endMatch = inlinePartialEnd.exec(remaining);
                if (!endMatch || endMatch[1] !== name) {
                    throw new Error('Inline partials must have a closing delimiter, and cannot be nested');
                }
                partials[name] = parse(remaining.substr(0, endMatch.index), options);
                remaining = remaining.substring(endMatch.index + endMatch[0].length);
            }
            return {
                main: parse(mainTemplate, options),
                partials: partials
            };
        };
        return parse;
    }(parse_tokenize, config_types, parse_Parser__Parser);
var render_DomFragment_Partial_getPartialDescriptor = function (errors, isClient, warn, isObject, partials, parse) {
        
        var getPartialDescriptor, registerPartial, getPartialFromRegistry, unpack;
        getPartialDescriptor = function (root, name) {
            var el, partial, errorMessage;
            if (partial = getPartialFromRegistry(root, name)) {
                return partial;
            }
            if (isClient) {
                el = document.getElementById(name);
                if (el && el.tagName === 'SCRIPT') {
                    if (!parse) {
                        throw new Error(errors.missingParser);
                    }
                    registerPartial(parse(el.innerHTML), name, partials);
                }
            }
            partial = partials[name];
            if (!partial) {
                errorMessage = 'Could not find descriptor for partial "' + name + '"';
                if (root.debug) {
                    throw new Error(errorMessage);
                } else {
                    warn(errorMessage);
                }
                return [];
            }
            return unpack(partial);
        };
        getPartialFromRegistry = function (registryOwner, name) {
            var partial;
            if (registryOwner.partials[name]) {
                if (typeof registryOwner.partials[name] === 'string') {
                    if (!parse) {
                        throw new Error(errors.missingParser);
                    }
                    partial = parse(registryOwner.partials[name], registryOwner.parseOptions);
                    registerPartial(partial, name, registryOwner.partials);
                }
                return unpack(registryOwner.partials[name]);
            }
        };
        registerPartial = function (partial, name, registry) {
            var key;
            if (isObject(partial)) {
                registry[name] = partial.main;
                for (key in partial.partials) {
                    if (partial.partials.hasOwnProperty(key)) {
                        registry[key] = partial.partials[key];
                    }
                }
            } else {
                registry[name] = partial;
            }
        };
        unpack = function (partial) {
            if (partial.length === 1 && typeof partial[0] === 'string') {
                return partial[0];
            }
            return partial;
        };
        return getPartialDescriptor;
    }(config_errors, config_isClient, utils_warn, utils_isObject, registries_partials, parse__parse);
var render_DomFragment_Partial__Partial = function (types, getPartialDescriptor, circular) {
        
        var DomPartial, DomFragment;
        circular.push(function () {
            DomFragment = circular.DomFragment;
        });
        DomPartial = function (options, docFrag) {
            var parentFragment = this.parentFragment = options.parentFragment, descriptor;
            this.type = types.PARTIAL;
            this.name = options.descriptor.r;
            this.index = options.index;
            if (!options.descriptor.r) {
                throw new Error('Partials must have a static reference (no expressions). This may change in a future version of Ractive.');
            }
            descriptor = getPartialDescriptor(parentFragment.root, options.descriptor.r);
            this.fragment = new DomFragment({
                descriptor: descriptor,
                root: parentFragment.root,
                pNode: parentFragment.pNode,
                contextStack: parentFragment.contextStack,
                owner: this
            });
            if (docFrag) {
                docFrag.appendChild(this.fragment.docFrag);
            }
        };
        DomPartial.prototype = {
            firstNode: function () {
                return this.fragment.firstNode();
            },
            findNextNode: function () {
                return this.parentFragment.findNextNode(this);
            },
            detach: function () {
                return this.fragment.detach();
            },
            teardown: function (destroy) {
                this.fragment.teardown(destroy);
            },
            toString: function () {
                return this.fragment.toString();
            },
            find: function (selector) {
                return this.fragment.find(selector);
            },
            findAll: function (selector, query) {
                return this.fragment.findAll(selector, query);
            },
            findComponent: function (selector) {
                return this.fragment.findComponent(selector);
            },
            findAllComponents: function (selector, query) {
                return this.fragment.findAllComponents(selector, query);
            }
        };
        return DomPartial;
    }(config_types, render_DomFragment_Partial_getPartialDescriptor, circular);
var render_DomFragment_Component_initialise_createModel_ComponentParameter = function (StringFragment) {
        
        var ComponentParameter = function (component, key, value) {
            this.parentFragment = component.parentFragment;
            this.component = component;
            this.key = key;
            this.fragment = new StringFragment({
                descriptor: value,
                root: component.root,
                owner: this,
                contextStack: component.parentFragment.contextStack
            });
            this.selfUpdating = this.fragment.isSimple();
            this.value = this.fragment.getValue();
        };
        ComponentParameter.prototype = {
            bubble: function () {
                if (this.selfUpdating) {
                    this.update();
                } else if (!this.deferred && this.ready) {
                    this.root._deferred.attrs.push(this);
                    this.deferred = true;
                }
            },
            update: function () {
                var value = this.fragment.getValue();
                this.component.instance.set(this.key, value);
                this.value = value;
            },
            teardown: function () {
                this.fragment.teardown();
            }
        };
        return ComponentParameter;
    }(render_StringFragment__StringFragment);
var render_DomFragment_Component_initialise_createModel__createModel = function (types, parseJSON, resolveRef, ComponentParameter) {
        
        return function (component, attributes, toBind) {
            var data, key, value;
            data = {};
            component.complexParameters = [];
            for (key in attributes) {
                if (attributes.hasOwnProperty(key)) {
                    value = getValue(component, key, attributes[key], toBind);
                    if (value !== undefined) {
                        data[key] = value;
                    }
                }
            }
            return data;
        };
        function getValue(component, key, descriptor, toBind) {
            var parameter, parsed, root, parentFragment, keypath;
            root = component.root;
            parentFragment = component.parentFragment;
            if (typeof descriptor === 'string') {
                parsed = parseJSON(descriptor);
                return parsed ? parsed.value : descriptor;
            }
            if (descriptor === null) {
                return true;
            }
            if (descriptor.length === 1 && descriptor[0].t === types.INTERPOLATOR && descriptor[0].r) {
                if (parentFragment.indexRefs && parentFragment.indexRefs[descriptor[0].r] !== undefined) {
                    return parentFragment.indexRefs[descriptor[0].r];
                }
                keypath = resolveRef(root, descriptor[0].r, parentFragment.contextStack) || descriptor[0].r;
                toBind.push({
                    childKeypath: key,
                    parentKeypath: keypath
                });
                return root.get(keypath);
            }
            parameter = new ComponentParameter(component, key, descriptor);
            component.complexParameters.push(parameter);
            return parameter.value;
        }
    }(config_types, utils_parseJSON, shared_resolveRef, render_DomFragment_Component_initialise_createModel_ComponentParameter);
var render_DomFragment_Component_initialise_createInstance = function () {
        
        return function (component, Component, data, docFrag, contentDescriptor) {
            var instance, parentFragment, partials, root;
            parentFragment = component.parentFragment;
            root = component.root;
            partials = { content: contentDescriptor || [] };
            instance = new Component({
                el: parentFragment.pNode.cloneNode(false),
                data: data,
                partials: partials,
                _parent: root,
                adaptors: root.adaptors
            });
            instance.component = component;
            component.instance = instance;
            instance.insert(docFrag);
            instance.fragment.pNode = parentFragment.pNode;
            return instance;
        };
    }();
var render_DomFragment_Component_initialise_createObservers = function () {
        
        var observeOptions = {
                init: false,
                debug: true
            };
        return function (component, toBind) {
            var pair, i;
            component.observers = [];
            i = toBind.length;
            while (i--) {
                pair = toBind[i];
                bind(component, pair.parentKeypath, pair.childKeypath);
            }
        };
        function bind(component, parentKeypath, childKeypath) {
            var parentInstance, childInstance, settingParent, settingChild, observers, observer, value;
            parentInstance = component.root;
            childInstance = component.instance;
            observers = component.observers;
            observer = parentInstance.observe(parentKeypath, function (value) {
                if (!settingParent && !parentInstance._wrapped[parentKeypath]) {
                    settingChild = true;
                    childInstance.set(childKeypath, value);
                    settingChild = false;
                }
            }, observeOptions);
            observers.push(observer);
            if (childInstance.twoway) {
                observer = childInstance.observe(childKeypath, function (value) {
                    if (!settingChild) {
                        settingParent = true;
                        parentInstance.set(parentKeypath, value);
                        settingParent = false;
                    }
                }, observeOptions);
                observers.push(observer);
                value = childInstance.get(childKeypath);
                if (value !== undefined) {
                    parentInstance.set(parentKeypath, value);
                }
            }
        }
    }();
var render_DomFragment_Component_initialise_propagateEvents = function (warn) {
        
        var errorMessage = 'Components currently only support simple events - you cannot include arguments. Sorry!';
        return function (component, eventsDescriptor) {
            var eventName;
            for (eventName in eventsDescriptor) {
                if (eventsDescriptor.hasOwnProperty(eventName)) {
                    propagateEvent(component.instance, component.root, eventName, eventsDescriptor[eventName]);
                }
            }
        };
        function propagateEvent(childInstance, parentInstance, eventName, proxyEventName) {
            if (typeof proxyEventName !== 'string') {
                if (parentInstance.debug) {
                    throw new Error(errorMessage);
                } else {
                    warn(errorMessage);
                    return;
                }
            }
            childInstance.on(eventName, function () {
                var args = Array.prototype.slice.call(arguments);
                args.unshift(proxyEventName);
                parentInstance.fire.apply(parentInstance, args);
            });
        }
    }(utils_warn);
var render_DomFragment_Component_initialise_updateLiveQueries = function () {
        
        return function (component) {
            var ancestor, query;
            ancestor = component.root;
            while (ancestor) {
                if (query = ancestor._liveComponentQueries[component.name]) {
                    query.push(component.instance);
                }
                ancestor = ancestor._parent;
            }
        };
    }();
var render_DomFragment_Component_initialise__initialise = function (types, warn, createModel, createInstance, createObservers, propagateEvents, updateLiveQueries) {
        
        return function (component, options, docFrag) {
            var parentFragment, root, Component, data, toBind;
            parentFragment = component.parentFragment = options.parentFragment;
            root = parentFragment.root;
            component.root = root;
            component.type = types.COMPONENT;
            component.name = options.descriptor.e;
            component.index = options.index;
            component.observers = [];
            Component = root.components[options.descriptor.e];
            if (!Component) {
                throw new Error('Component "' + options.descriptor.e + '" not found');
            }
            toBind = [];
            data = createModel(component, options.descriptor.a, toBind);
            createInstance(component, Component, data, docFrag, options.descriptor.f);
            createObservers(component, toBind);
            propagateEvents(component, options.descriptor.v);
            if (options.descriptor.t1 || options.descriptor.t2 || options.descriptor.o) {
                warn('The "intro", "outro" and "decorator" directives have no effect on components');
            }
            updateLiveQueries(component);
        };
    }(config_types, utils_warn, render_DomFragment_Component_initialise_createModel__createModel, render_DomFragment_Component_initialise_createInstance, render_DomFragment_Component_initialise_createObservers, render_DomFragment_Component_initialise_propagateEvents, render_DomFragment_Component_initialise_updateLiveQueries);
var render_DomFragment_Component__Component = function (initialise) {
        
        var DomComponent = function (options, docFrag) {
            initialise(this, options, docFrag);
        };
        DomComponent.prototype = {
            firstNode: function () {
                return this.instance.fragment.firstNode();
            },
            findNextNode: function () {
                return this.parentFragment.findNextNode(this);
            },
            detach: function () {
                return this.instance.fragment.detach();
            },
            teardown: function () {
                var query;
                while (this.complexParameters.length) {
                    this.complexParameters.pop().teardown();
                }
                while (this.observers.length) {
                    this.observers.pop().cancel();
                }
                if (query = this.root._liveComponentQueries[this.name]) {
                    query._remove(this);
                }
                this.instance.teardown();
            },
            toString: function () {
                return this.instance.fragment.toString();
            },
            find: function (selector) {
                return this.instance.fragment.find(selector);
            },
            findAll: function (selector, query) {
                return this.instance.fragment.findAll(selector, query);
            },
            findComponent: function (selector) {
                if (!selector || selector === this.name) {
                    return this.instance;
                }
                return null;
            },
            findAllComponents: function (selector, query) {
                query._test(this, true);
                if (this.instance.fragment) {
                    this.instance.fragment.findAllComponents(selector, query);
                }
            }
        };
        return DomComponent;
    }(render_DomFragment_Component_initialise__initialise);
var render_DomFragment_Comment = function (types) {
        
        var DomComment = function (options, docFrag) {
            this.type = types.COMMENT;
            this.descriptor = options.descriptor;
            if (docFrag) {
                this.node = document.createComment(options.descriptor.f);
                docFrag.appendChild(this.node);
            }
        };
        DomComment.prototype = {
            detach: function () {
                this.node.parentNode.removeChild(this.node);
                return this.node;
            },
            teardown: function (destroy) {
                if (destroy) {
                    this.detach();
                }
            },
            firstNode: function () {
                return this.node;
            },
            toString: function () {
                return '<!--' + this.descriptor.f + '-->';
            }
        };
        return DomComment;
    }(config_types);
var render_DomFragment__DomFragment = function (types, matches, initFragment, insertHtml, Text, Interpolator, Section, Triple, Element, Partial, Component, Comment, circular) {
        
        var DomFragment = function (options) {
            if (options.pNode) {
                this.docFrag = document.createDocumentFragment();
            }
            if (typeof options.descriptor === 'string') {
                this.html = options.descriptor;
                if (this.docFrag) {
                    this.nodes = insertHtml(this.html, options.pNode.tagName, this.docFrag);
                }
            } else {
                initFragment(this, options);
            }
        };
        DomFragment.prototype = {
            detach: function () {
                var len, i;
                if (this.nodes) {
                    i = this.nodes.length;
                    while (i--) {
                        this.docFrag.appendChild(this.nodes[i]);
                    }
                } else if (this.items) {
                    len = this.items.length;
                    for (i = 0; i < len; i += 1) {
                        this.docFrag.appendChild(this.items[i].detach());
                    }
                }
                return this.docFrag;
            },
            createItem: function (options) {
                if (typeof options.descriptor === 'string') {
                    return new Text(options, this.docFrag);
                }
                switch (options.descriptor.t) {
                case types.INTERPOLATOR:
                    return new Interpolator(options, this.docFrag);
                case types.SECTION:
                    return new Section(options, this.docFrag);
                case types.TRIPLE:
                    return new Triple(options, this.docFrag);
                case types.ELEMENT:
                    if (this.root.components[options.descriptor.e]) {
                        return new Component(options, this.docFrag);
                    }
                    return new Element(options, this.docFrag);
                case types.PARTIAL:
                    return new Partial(options, this.docFrag);
                case types.COMMENT:
                    return new Comment(options, this.docFrag);
                default:
                    throw new Error('Something very strange happened. Please file an issue at https://github.com/RactiveJS/Ractive/issues. Thanks!');
                }
            },
            teardown: function (destroy) {
                var node;
                if (this.nodes && destroy) {
                    while (node = this.nodes.pop()) {
                        node.parentNode.removeChild(node);
                    }
                } else if (this.items) {
                    while (this.items.length) {
                        this.items.pop().teardown(destroy);
                    }
                }
                this.nodes = this.items = this.docFrag = null;
            },
            firstNode: function () {
                if (this.items && this.items[0]) {
                    return this.items[0].firstNode();
                } else if (this.nodes) {
                    return this.nodes[0] || null;
                }
                return null;
            },
            findNextNode: function (item) {
                var index = item.index;
                if (this.items[index + 1]) {
                    return this.items[index + 1].firstNode();
                }
                if (this.owner === this.root) {
                    if (!this.owner.component) {
                        return null;
                    }
                    return this.owner.component.findNextNode();
                }
                return this.owner.findNextNode(this);
            },
            toString: function () {
                var html, i, len, item;
                if (this.html) {
                    return this.html;
                }
                html = '';
                if (!this.items) {
                    return html;
                }
                len = this.items.length;
                for (i = 0; i < len; i += 1) {
                    item = this.items[i];
                    html += item.toString();
                }
                return html;
            },
            find: function (selector) {
                var i, len, item, node, queryResult;
                if (this.nodes) {
                    len = this.nodes.length;
                    for (i = 0; i < len; i += 1) {
                        node = this.nodes[i];
                        if (node.nodeType !== 1) {
                            continue;
                        }
                        if (matches(node, selector)) {
                            return node;
                        }
                        if (queryResult = node.querySelector(selector)) {
                            return queryResult;
                        }
                    }
                    return null;
                }
                if (this.items) {
                    len = this.items.length;
                    for (i = 0; i < len; i += 1) {
                        item = this.items[i];
                        if (item.find && (queryResult = item.find(selector))) {
                            return queryResult;
                        }
                    }
                    return null;
                }
            },
            findAll: function (selector, query) {
                var i, len, item, node, queryAllResult, numNodes, j;
                if (this.nodes) {
                    len = this.nodes.length;
                    for (i = 0; i < len; i += 1) {
                        node = this.nodes[i];
                        if (node.nodeType !== 1) {
                            continue;
                        }
                        if (matches(node, selector)) {
                            query.push(node);
                        }
                        if (queryAllResult = node.querySelectorAll(selector)) {
                            numNodes = queryAllResult.length;
                            for (j = 0; j < numNodes; j += 1) {
                                query.push(queryAllResult[j]);
                            }
                        }
                    }
                } else if (this.items) {
                    len = this.items.length;
                    for (i = 0; i < len; i += 1) {
                        item = this.items[i];
                        if (item.findAll) {
                            item.findAll(selector, query);
                        }
                    }
                }
                return query;
            },
            findComponent: function (selector) {
                var len, i, item, queryResult;
                if (this.items) {
                    len = this.items.length;
                    for (i = 0; i < len; i += 1) {
                        item = this.items[i];
                        if (item.findComponent && (queryResult = item.findComponent(selector))) {
                            return queryResult;
                        }
                    }
                    return null;
                }
            },
            findAllComponents: function (selector, query) {
                var i, len, item;
                if (this.items) {
                    len = this.items.length;
                    for (i = 0; i < len; i += 1) {
                        item = this.items[i];
                        if (item.findAllComponents) {
                            item.findAllComponents(selector, query);
                        }
                    }
                }
                return query;
            }
        };
        circular.DomFragment = DomFragment;
        return DomFragment;
    }(config_types, utils_matches, render_shared_initFragment, render_DomFragment_shared_insertHtml, render_DomFragment_Text, render_DomFragment_Interpolator, render_DomFragment_Section__Section, render_DomFragment_Triple, render_DomFragment_Element__Element, render_DomFragment_Partial__Partial, render_DomFragment_Component__Component, render_DomFragment_Comment, circular);
var Ractive_prototype_render = function (getElement, makeTransitionManager, preDomUpdate, postDomUpdate, DomFragment) {
        
        return function (target, complete) {
            var transitionManager;
            if (!this._initing) {
                throw new Error('You cannot call ractive.render() directly!');
            }
            this._transitionManager = transitionManager = makeTransitionManager(this, complete);
            this.fragment = new DomFragment({
                descriptor: this.template,
                root: this,
                owner: this,
                pNode: target
            });
            preDomUpdate(this);
            if (target) {
                target.appendChild(this.fragment.docFrag);
            }
            postDomUpdate(this);
            this._transitionManager = null;
            transitionManager.ready();
            this.rendered = true;
        };
    }(utils_getElement, shared_makeTransitionManager, shared_preDomUpdate, shared_postDomUpdate, render_DomFragment__DomFragment);
var Ractive_prototype_renderHTML = function (warn) {
        
        return function () {
            warn('renderHTML() has been deprecated and will be removed in a future version. Please use toHTML() instead');
            return this.toHTML();
        };
    }(utils_warn);
var Ractive_prototype_toHTML = function () {
        
        return function () {
            return this.fragment.toString();
        };
    }();
var Ractive_prototype_teardown = function (makeTransitionManager, clearCache) {
        
        return function (complete) {
            var keypath, transitionManager, previousTransitionManager;
            this.fire('teardown');
            previousTransitionManager = this._transitionManager;
            this._transitionManager = transitionManager = makeTransitionManager(this, complete);
            this.fragment.teardown(true);
            while (this._animations[0]) {
                this._animations[0].stop();
            }
            for (keypath in this._cache) {
                clearCache(this, keypath);
            }
            this._transitionManager = previousTransitionManager;
            transitionManager.ready();
        };
    }(shared_makeTransitionManager, shared_clearCache);
var Ractive_prototype_shared_add = function (isNumeric) {
        
        return function (root, keypath, d) {
            var value;
            if (typeof keypath !== 'string' || !isNumeric(d)) {
                if (root.debug) {
                    throw new Error('Bad arguments');
                }
                return;
            }
            value = root.get(keypath);
            if (value === undefined) {
                value = 0;
            }
            if (!isNumeric(value)) {
                if (root.debug) {
                    throw new Error('Cannot add to a non-numeric value');
                }
                return;
            }
            root.set(keypath, value + d);
        };
    }(utils_isNumeric);
var Ractive_prototype_add = function (add) {
        
        return function (keypath, d) {
            add(this, keypath, d === undefined ? 1 : d);
        };
    }(Ractive_prototype_shared_add);
var Ractive_prototype_subtract = function (add) {
        
        return function (keypath, d) {
            add(this, keypath, d === undefined ? -1 : -d);
        };
    }(Ractive_prototype_shared_add);
var Ractive_prototype_toggle = function () {
        
        return function (keypath) {
            var value;
            if (typeof keypath !== 'string') {
                if (this.debug) {
                    throw new Error('Bad arguments');
                }
                return;
            }
            value = this.get(keypath);
            this.set(keypath, !value);
        };
    }();
var Ractive_prototype_merge_mapOldToNewIndex = function () {
        
        return function (oldArray, newArray) {
            var usedIndices, mapper, firstUnusedIndex, newIndices, changed;
            usedIndices = {};
            firstUnusedIndex = 0;
            mapper = function (item, i) {
                var index, start, len;
                start = firstUnusedIndex;
                len = newArray.length;
                do {
                    index = newArray.indexOf(item, start);
                    if (index === -1) {
                        changed = true;
                        return -1;
                    }
                    start = index + 1;
                } while (usedIndices[index] && start < len);
                if (index === firstUnusedIndex) {
                    firstUnusedIndex += 1;
                }
                if (index !== i) {
                    changed = true;
                }
                usedIndices[index] = true;
                return index;
            };
            newIndices = oldArray.map(mapper);
            newIndices.unchanged = !changed;
            return newIndices;
        };
    }();
var Ractive_prototype_merge_queueDependants = function (types) {
        
        return function queueDependants(keypath, deps, mergeQueue, updateQueue) {
            var i, dependant;
            i = deps.length;
            while (i--) {
                dependant = deps[i];
                if (dependant.type === types.REFERENCE) {
                    dependant.update();
                } else if (dependant.keypath === keypath && dependant.type === types.SECTION && !dependant.inverted && dependant.docFrag) {
                    mergeQueue[mergeQueue.length] = dependant;
                } else {
                    updateQueue[updateQueue.length] = dependant;
                }
            }
        };
    }(config_types);
var Ractive_prototype_merge__merge = function (warn, isArray, clearCache, preDomUpdate, processDeferredUpdates, makeTransitionManager, notifyDependants, replaceData, mapOldToNewIndex, queueDependants) {
        
        var identifiers = {};
        return function (keypath, array, options) {
            var currentArray, oldArray, newArray, identifier, lengthUnchanged, i, newIndices, mergeQueue, updateQueue, depsByKeypath, deps, transitionManager, previousTransitionManager, upstreamQueue, keys;
            currentArray = this.get(keypath);
            if (!isArray(currentArray) || !isArray(array)) {
                return this.set(keypath, array, options && options.complete);
            }
            lengthUnchanged = currentArray.length === array.length;
            if (options && options.compare) {
                if (options.compare === true) {
                    identifier = stringify;
                } else if (typeof options.compare === 'string') {
                    identifier = getIdentifier(options.compare);
                } else if (typeof options.compare == 'function') {
                    identifier = options.compare;
                } else {
                    throw new Error('The `compare` option must be a function, or a string representing an identifying field (or `true` to use JSON.stringify)');
                }
                try {
                    oldArray = currentArray.map(identifier);
                    newArray = array.map(identifier);
                } catch (err) {
                    if (this.debug) {
                        throw err;
                    } else {
                        warn('Merge operation: comparison failed. Falling back to identity checking');
                    }
                    oldArray = currentArray;
                    newArray = array;
                }
            } else {
                oldArray = currentArray;
                newArray = array;
            }
            newIndices = mapOldToNewIndex(oldArray, newArray);
            clearCache(this, keypath);
            replaceData(this, keypath, array);
            if (newIndices.unchanged && lengthUnchanged) {
                return;
            }
            previousTransitionManager = this._transitionManager;
            this._transitionManager = transitionManager = makeTransitionManager(this, options && options.complete);
            mergeQueue = [];
            updateQueue = [];
            for (i = 0; i < this._deps.length; i += 1) {
                depsByKeypath = this._deps[i];
                if (!depsByKeypath) {
                    continue;
                }
                deps = depsByKeypath[keypath];
                if (deps) {
                    queueDependants(keypath, deps, mergeQueue, updateQueue);
                    preDomUpdate(this);
                    while (mergeQueue.length) {
                        mergeQueue.pop().merge(newIndices);
                    }
                    while (updateQueue.length) {
                        updateQueue.pop().update();
                    }
                }
            }
            processDeferredUpdates(this);
            upstreamQueue = [];
            keys = keypath.split('.');
            while (keys.length) {
                keys.pop();
                upstreamQueue[upstreamQueue.length] = keys.join('.');
            }
            notifyDependants.multiple(this, upstreamQueue, true);
            if (oldArray.length !== newArray.length) {
                notifyDependants(this, keypath + '.length', true);
            }
            this._transitionManager = previousTransitionManager;
            transitionManager.ready();
        };
        function stringify(item) {
            return JSON.stringify(item);
        }
        function getIdentifier(str) {
            if (!identifiers[str]) {
                identifiers[str] = function (item) {
                    return item[str];
                };
            }
            return identifiers[str];
        }
    }(utils_warn, utils_isArray, shared_clearCache, shared_preDomUpdate, shared_processDeferredUpdates, shared_makeTransitionManager, shared_notifyDependants, Ractive_prototype_shared_replaceData, Ractive_prototype_merge_mapOldToNewIndex, Ractive_prototype_merge_queueDependants);
var Ractive_prototype_detach = function () {
        
        return function () {
            return this.fragment.detach();
        };
    }();
var Ractive_prototype_insert = function (getElement) {
        
        return function (target, anchor) {
            target = getElement(target);
            anchor = getElement(anchor) || null;
            if (!target) {
                throw new Error('You must specify a valid target to insert into');
            }
            target.insertBefore(this.detach(), anchor);
            this.fragment.pNode = target;
        };
    }(utils_getElement);
var Ractive_prototype__prototype = function (get, set, update, updateModel, animate, on, off, observe, fire, find, findAll, findComponent, findAllComponents, render, renderHTML, toHTML, teardown, add, subtract, toggle, merge, detach, insert) {
        
        return {
            get: get,
            set: set,
            update: update,
            updateModel: updateModel,
            animate: animate,
            on: on,
            off: off,
            observe: observe,
            fire: fire,
            find: find,
            findAll: findAll,
            findComponent: findComponent,
            findAllComponents: findAllComponents,
            renderHTML: renderHTML,
            toHTML: toHTML,
            render: render,
            teardown: teardown,
            add: add,
            subtract: subtract,
            toggle: toggle,
            merge: merge,
            detach: detach,
            insert: insert
        };
    }(Ractive_prototype_get__get, Ractive_prototype_set, Ractive_prototype_update, Ractive_prototype_updateModel, Ractive_prototype_animate__animate, Ractive_prototype_on, Ractive_prototype_off, Ractive_prototype_observe__observe, Ractive_prototype_fire, Ractive_prototype_find, Ractive_prototype_findAll, Ractive_prototype_findComponent, Ractive_prototype_findAllComponents, Ractive_prototype_render, Ractive_prototype_renderHTML, Ractive_prototype_toHTML, Ractive_prototype_teardown, Ractive_prototype_add, Ractive_prototype_subtract, Ractive_prototype_toggle, Ractive_prototype_merge__merge, Ractive_prototype_detach, Ractive_prototype_insert);
var extend_registries = function () {
        
        return [
            'partials',
            'transitions',
            'events',
            'components',
            'decorators',
            'data'
        ];
    }();
var extend_initOptions = function () {
        
        return [
            'el',
            'template',
            'complete',
            'modifyArrays',
            'magic',
            'twoway',
            'lazy',
            'append',
            'preserveWhitespace',
            'sanitize',
            'stripComments',
            'noIntro',
            'transitionsEnabled',
            'adaptors'
        ];
    }();
var extend_inheritFromParent = function (registries, initOptions, create) {
        
        return function (Child, Parent) {
            registries.forEach(function (property) {
                if (Parent[property]) {
                    Child[property] = create(Parent[property]);
                }
            });
            initOptions.forEach(function (property) {
                Child[property] = Parent[property];
            });
        };
    }(extend_registries, extend_initOptions, utils_create);
var extend_wrapMethod = function () {
        
        return function (method, superMethod) {
            if (/_super/.test(method)) {
                return function () {
                    var _super = this._super, result;
                    this._super = superMethod;
                    result = method.apply(this, arguments);
                    this._super = _super;
                    return result;
                };
            } else {
                return method;
            }
        };
    }();
var extend_utils_augment = function () {
        
        return function (target, source) {
            var key;
            for (key in source) {
                if (source.hasOwnProperty(key)) {
                    target[key] = source[key];
                }
            }
            return target;
        };
    }();
var extend_inheritFromChildProps = function (registries, initOptions, wrapMethod, augment) {
        
        var blacklist, blacklisted;
        blacklist = registries.concat(initOptions);
        blacklisted = {};
        blacklist.forEach(function (property) {
            blacklisted[property] = true;
        });
        return function (Child, childProps) {
            var key, member;
            registries.forEach(function (property) {
                var value = childProps[property];
                if (value) {
                    if (Child[property]) {
                        augment(Child[property], value);
                    } else {
                        Child[property] = value;
                    }
                }
            });
            initOptions.forEach(function (property) {
                var value = childProps[property];
                if (value !== undefined) {
                    if (typeof value === 'function' && typeof Child[property] === 'function') {
                        Child[property] = wrapMethod(value, Child[property]);
                    } else {
                        Child[property] = childProps[property];
                    }
                }
            });
            for (key in childProps) {
                if (childProps.hasOwnProperty(key) && !blacklisted[key]) {
                    member = childProps[key];
                    if (typeof member === 'function' && typeof Child.prototype[key] === 'function') {
                        Child.prototype[key] = wrapMethod(member, Child.prototype[key]);
                    } else {
                        Child.prototype[key] = member;
                    }
                }
            }
        };
    }(extend_registries, extend_initOptions, extend_wrapMethod, extend_utils_augment);
var extend_extractInlinePartials = function (isObject, augment) {
        
        return function (Child, childProps) {
            if (isObject(Child.template)) {
                if (!Child.partials) {
                    Child.partials = {};
                }
                augment(Child.partials, Child.template.partials);
                if (childProps.partials) {
                    augment(Child.partials, childProps.partials);
                }
                Child.template = Child.template.main;
            }
        };
    }(utils_isObject, extend_utils_augment);
var extend_conditionallyParseTemplate = function (errors, isClient, parse) {
        
        return function (Child) {
            var templateEl;
            if (typeof Child.template === 'string') {
                if (!parse) {
                    throw new Error(errors.missingParser);
                }
                if (Child.template.charAt(0) === '#' && isClient) {
                    templateEl = document.getElementById(Child.template.substring(1));
                    if (templateEl && templateEl.tagName === 'SCRIPT') {
                        Child.template = parse(templateEl.innerHTML, Child);
                    } else {
                        throw new Error('Could not find template element (' + Child.template + ')');
                    }
                } else {
                    Child.template = parse(Child.template, Child);
                }
            }
        };
    }(config_errors, config_isClient, parse__parse);
var extend_conditionallyParsePartials = function (errors, parse) {
        
        return function (Child) {
            var key;
            if (Child.partials) {
                for (key in Child.partials) {
                    if (Child.partials.hasOwnProperty(key) && typeof Child.partials[key] === 'string') {
                        if (!parse) {
                            throw new Error(errors.missingParser);
                        }
                        Child.partials[key] = parse(Child.partials[key], Child);
                    }
                }
            }
        };
    }(config_errors, parse__parse);
var extend_utils_clone = function () {
        
        return function (source) {
            var target = {}, key;
            for (key in source) {
                if (source.hasOwnProperty(key)) {
                    target[key] = source[key];
                }
            }
            return target;
        };
    }();
var utils_extend = function () {
        
        return function (target) {
            var prop, source, sources = Array.prototype.slice.call(arguments, 1);
            while (source = sources.shift()) {
                for (prop in source) {
                    if (source.hasOwnProperty(prop)) {
                        target[prop] = source[prop];
                    }
                }
            }
            return target;
        };
    }();
var Ractive_initialise = function (isClient, errors, warn, create, extend, defineProperty, defineProperties, getElement, isObject, magicAdaptor, parse) {
        
        var getObject, getArray, defaultOptions, registries;
        getObject = function () {
            return {};
        };
        getArray = function () {
            return [];
        };
        defaultOptions = create(null);
        defineProperties(defaultOptions, {
            preserveWhitespace: {
                enumerable: true,
                value: false
            },
            append: {
                enumerable: true,
                value: false
            },
            twoway: {
                enumerable: true,
                value: true
            },
            modifyArrays: {
                enumerable: true,
                value: true
            },
            data: {
                enumerable: true,
                value: getObject
            },
            lazy: {
                enumerable: true,
                value: false
            },
            debug: {
                enumerable: true,
                value: false
            },
            transitions: {
                enumerable: true,
                value: getObject
            },
            decorators: {
                enumerable: true,
                value: getObject
            },
            events: {
                enumerable: true,
                value: getObject
            },
            noIntro: {
                enumerable: true,
                value: false
            },
            transitionsEnabled: {
                enumerable: true,
                value: true
            },
            magic: {
                enumerable: true,
                value: false
            },
            adaptors: {
                enumerable: true,
                value: getArray
            }
        });
        registries = [
            'components',
            'decorators',
            'events',
            'partials',
            'transitions',
            'data'
        ];
        return function (ractive, options) {
            var key, template, templateEl, parsedTemplate;
            for (key in defaultOptions) {
                if (options[key] === undefined) {
                    options[key] = typeof defaultOptions[key] === 'function' ? defaultOptions[key]() : defaultOptions[key];
                }
            }
            defineProperties(ractive, {
                _initing: {
                    value: true,
                    writable: true
                },
                _guid: {
                    value: 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
                        var r, v;
                        r = Math.random() * 16 | 0;
                        v = c == 'x' ? r : r & 3 | 8;
                        return v.toString(16);
                    })
                },
                _subs: {
                    value: create(null),
                    configurable: true
                },
                _cache: { value: {} },
                _cacheMap: { value: create(null) },
                _deps: { value: [] },
                _depsMap: { value: create(null) },
                _patternObservers: { value: [] },
                _pendingResolution: { value: [] },
                _deferred: { value: {} },
                _evaluators: { value: create(null) },
                _twowayBindings: { value: {} },
                _transitionManager: {
                    value: null,
                    writable: true
                },
                _animations: { value: [] },
                nodes: { value: {} },
                _wrapped: { value: create(null) },
                _liveQueries: { value: [] },
                _liveComponentQueries: { value: [] }
            });
            defineProperties(ractive._deferred, {
                attrs: { value: [] },
                evals: { value: [] },
                selectValues: { value: [] },
                checkboxes: { value: [] },
                radios: { value: [] },
                observers: { value: [] },
                transitions: { value: [] },
                liveQueries: { value: [] },
                decorators: { value: [] },
                focusable: {
                    value: null,
                    writable: true
                }
            });
            ractive.adaptors = options.adaptors;
            ractive.modifyArrays = options.modifyArrays;
            ractive.magic = options.magic;
            ractive.twoway = options.twoway;
            ractive.lazy = options.lazy;
            ractive.debug = options.debug;
            if (ractive.magic && !magicAdaptor) {
                throw new Error('Getters and setters (magic mode) are not supported in this browser');
            }
            if (options._parent) {
                defineProperty(ractive, '_parent', { value: options._parent });
            }
            if (options.el) {
                ractive.el = getElement(options.el);
                if (!ractive.el && ractive.debug) {
                    throw new Error('Could not find container element');
                }
            }
            if (options.eventDefinitions) {
                warn('ractive.eventDefinitions has been deprecated in favour of ractive.events. Support will be removed in future versions');
                options.events = options.eventDefinitions;
            }
            registries.forEach(function (registry) {
                if (ractive.constructor[registry]) {
                    ractive[registry] = extend(create(ractive.constructor[registry] || {}), options[registry]);
                } else if (options[registry]) {
                    ractive[registry] = options[registry];
                }
            });
            template = options.template;
            if (typeof template === 'string') {
                if (!parse) {
                    throw new Error(errors.missingParser);
                }
                if (template.charAt(0) === '#' && isClient) {
                    templateEl = document.getElementById(template.substring(1));
                    if (templateEl) {
                        parsedTemplate = parse(templateEl.innerHTML, options);
                    } else {
                        throw new Error('Could not find template element (' + template + ')');
                    }
                } else {
                    parsedTemplate = parse(template, options);
                }
            } else {
                parsedTemplate = template;
            }
            if (isObject(parsedTemplate)) {
                extend(ractive.partials, parsedTemplate.partials);
                parsedTemplate = parsedTemplate.main;
            }
            if (parsedTemplate && parsedTemplate.length === 1 && typeof parsedTemplate[0] === 'string') {
                parsedTemplate = parsedTemplate[0];
            }
            ractive.template = parsedTemplate;
            extend(ractive.partials, options.partials);
            ractive.parseOptions = {
                preserveWhitespace: options.preserveWhitespace,
                sanitize: options.sanitize,
                stripComments: options.stripComments
            };
            ractive.transitionsEnabled = options.noIntro ? false : options.transitionsEnabled;
            if (isClient && !ractive.el) {
                ractive.el = document.createDocumentFragment();
            }
            if (ractive.el && !options.append) {
                ractive.el.innerHTML = '';
            }
            ractive.render(ractive.el, options.complete);
            ractive.transitionsEnabled = options.transitionsEnabled;
            ractive._initing = false;
        };
    }(config_isClient, config_errors, utils_warn, utils_create, utils_extend, utils_defineProperty, utils_defineProperties, utils_getElement, utils_isObject, Ractive_prototype_get_magicAdaptor, parse__parse);
var extend_initChildInstance = function (fillGaps, initOptions, clone, wrapMethod, initialise) {
        
        return function (child, Child, options) {
            initOptions.forEach(function (property) {
                var value = options[property], defaultValue = Child[property];
                if (typeof value === 'function' && typeof defaultValue === 'function') {
                    options[property] = wrapMethod(value, defaultValue);
                } else if (value === undefined && defaultValue !== undefined) {
                    options[property] = defaultValue;
                }
            });
            if (child.beforeInit) {
                child.beforeInit(options);
            }
            initialise(child, options);
            if (child.init) {
                child.init(options);
            }
        };
    }(utils_fillGaps, extend_initOptions, extend_utils_clone, extend_wrapMethod, Ractive_initialise);
var extend__extend = function (create, inheritFromParent, inheritFromChildProps, extractInlinePartials, conditionallyParseTemplate, conditionallyParsePartials, initChildInstance, circular) {
        
        var Ractive;
        circular.push(function () {
            Ractive = circular.Ractive;
        });
        return function (childProps) {
            var Parent = this, Child;
            Child = function (options) {
                initChildInstance(this, Child, options || {});
            };
            Child.prototype = create(Parent.prototype);
            Child.prototype.constructor = Child;
            inheritFromParent(Child, Parent);
            inheritFromChildProps(Child, childProps);
            conditionallyParseTemplate(Child);
            extractInlinePartials(Child, childProps);
            conditionallyParsePartials(Child);
            Child.extend = Parent.extend;
            return Child;
        };
    }(utils_create, extend_inheritFromParent, extend_inheritFromChildProps, extend_extractInlinePartials, extend_conditionallyParseTemplate, extend_conditionallyParsePartials, extend_initChildInstance, circular);
var Ractive__Ractive = function (svg, create, defineProperties, prototype, partialRegistry, adaptorRegistry, easingRegistry, Ractive_extend, parse, initialise, circular) {
        
        var Ractive = function (options) {
            initialise(this, options);
        };
        defineProperties(Ractive, {
            prototype: { value: prototype },
            partials: { value: partialRegistry },
            adaptors: { value: adaptorRegistry },
            easing: { value: easingRegistry },
            transitions: { value: {} },
            events: { value: {} },
            components: { value: {} },
            decorators: { value: {} },
            svg: { value: svg },
            VERSION: { value: '0.3.9' }
        });
        Ractive.eventDefinitions = Ractive.events;
        Ractive.prototype.constructor = Ractive;
        Ractive.delimiters = [
            '{{',
            '}}'
        ];
        Ractive.tripleDelimiters = [
            '{{{',
            '}}}'
        ];
        Ractive.extend = Ractive_extend;
        Ractive.parse = parse;
        circular.Ractive = Ractive;
        return Ractive;
    }(config_svg, utils_create, utils_defineProperties, Ractive_prototype__prototype, registries_partials, registries_adaptors, registries_easing, extend__extend, parse__parse, Ractive_initialise, circular);
var Ractive = function (Ractive, circular) {
        
        if (typeof window !== 'undefined' && window.Node && !window.Node.prototype.contains && window.HTMLElement && window.HTMLElement.prototype.contains) {
            window.Node.prototype.contains = window.HTMLElement.prototype.contains;
        }
        while (circular.length) {
            circular.pop()();
        }
        return Ractive;
    }(Ractive__Ractive, circular);
// export as Common JS module...
if ( typeof module !== "undefined" && module.exports ) {
	module.exports = Ractive;
}

// ... or as AMD module
else if ( typeof define === "function" && define.amd ) {
	define( function () {
		return Ractive;
	});
}

// ... or as browser global
else {
	global.Ractive = Ractive;
}

}( typeof window !== 'undefined' ? window : this ));