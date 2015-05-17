var wx;
(function (wx) {
    "use strict";
})(wx || (wx = {}));
var wx;
(function (wx) {
    "use strict";
    var WeakMapEmulated = (function () {
        function WeakMapEmulated() {
            this.inner = {};
        }
        WeakMapEmulated.prototype.set = function (key, value) {
            var oid = wx.getOid(key);
            this.inner[oid] = value;
        };
        WeakMapEmulated.prototype.get = function (key) {
            var oid = wx.getOid(key);
            return this.inner[oid];
        };
        WeakMapEmulated.prototype.has = function (key) {
            var oid = wx.getOid(key);
            return this.inner.hasOwnProperty(oid);
        };
        WeakMapEmulated.prototype.delete = function (key) {
            var oid = wx.getOid(key);
            return delete this.inner[oid];
        };
        Object.defineProperty(WeakMapEmulated.prototype, "isEmulated", {
            get: function () {
                return true;
            },
            enumerable: true,
            configurable: true
        });
        return WeakMapEmulated;
    })();
    var hasNativeSupport = typeof WeakMap === "function";
    function createWeakMap(disableNativeSupport) {
        if (disableNativeSupport || !hasNativeSupport) {
            return new WeakMapEmulated();
        }
        return new WeakMap();
    }
    wx.createWeakMap = createWeakMap;
})(wx || (wx = {}));
var wx;
(function (wx) {
    var res;
    (function (res) {
        "use strict";
        res.injector = "wx.injector";
        res.domManager = "wx.domservice";
        res.router = "wx.router";
        res.messageBus = "wx.messageBus";
        res.expressionCompiler = "wx.expressioncompiler";
        res.htmlTemplateEngine = "wx.htmlTemplateEngine";
        res.hasValueBindingValue = "has.wx.bindings.value";
        res.valueBindingValue = "wx.bindings.value";
    })(res = wx.res || (wx.res = {}));
})(wx || (wx = {}));
var wx;
(function (wx) {
    "use strict";
})(wx || (wx = {}));
var wx;
(function (wx) {
    var internal;
    (function (internal) {
        "use strict";
        var PropertyChangedEventArgs = (function () {
            function PropertyChangedEventArgs(sender, propertyName) {
                this.propertyName = propertyName;
                this.sender = sender;
            }
            return PropertyChangedEventArgs;
        })();
        internal.PropertyChangedEventArgs = PropertyChangedEventArgs;
    })(internal = wx.internal || (wx.internal = {}));
})(wx || (wx = {}));
var wx;
(function (wx) {
    "use strict";
    var IID = (function () {
        function IID() {
        }
        IID.IUnknown = "IUnknown";
        IID.IDisposable = "IDisposable";
        IID.IObservableProperty = "IObservableProperty";
        IID.IReactiveNotifyPropertyChanged = "IReactiveNotifyPropertyChanged";
        IID.IHandleObservableErrors = "IHandleObservableErrors";
        IID.IObservableList = "IObservableList";
        IID.IList = "IList";
        IID.IReactiveNotifyCollectionChanged = "IReactiveNotifyCollectionChanged";
        IID.IReactiveNotifyCollectionItemChanged = "IReactiveNotifyCollectionItemChanged";
        IID.IReactiveDerivedList = "IReactiveDerivedList";
        IID.IMoveInfo = "IMoveInfo";
        IID.IObservedChange = "IObservedChange";
        IID.ICommand = "ICommand";
        IID.IReadOnlyList = "IReadOnlyList";
        return IID;
    })();
    wx.IID = IID;
})(wx || (wx = {}));
var wx;
(function (wx) {
    "use strict";
    var regexCssClassName = /\S+/g;
    var RxObsConstructor = Rx.Observable;
    wx.noop = function () {
    };
    function isStrictMode() {
        return typeof this === "undefined";
    }
    wx.isStrictMode = isStrictMode;
    function isPrimitive(target) {
        var t = typeof target;
        return t === "boolean" || t === "number" || t === "string";
    }
    wx.isPrimitive = isPrimitive;
    function isProperty(target) {
        if (target == null)
            return false;
        return queryInterface(target, wx.IID.IObservableProperty);
    }
    wx.isProperty = isProperty;
    function isCommand(target) {
        if (target == null)
            return false;
        return target instanceof internal.commandConstructor || queryInterface(target, wx.IID.ICommand);
    }
    wx.isCommand = isCommand;
    function isList(target) {
        if (target == null)
            return false;
        return target instanceof internal.listConstructor;
    }
    wx.isList = isList;
    function isRxScheduler(target) {
        if (target == null)
            return false;
        return Rx.Scheduler.isScheduler(target);
    }
    wx.isRxScheduler = isRxScheduler;
    function isRxObservable(target) {
        if (target == null)
            return false;
        return target instanceof RxObsConstructor;
    }
    wx.isRxObservable = isRxObservable;
    function unwrapProperty(prop) {
        if (isProperty(prop))
            return prop();
        return prop;
    }
    wx.unwrapProperty = unwrapProperty;
    function isInUnitTest() {
        if (window && window["jasmine"] && window["jasmine"].version_ !== undefined) {
            return true;
        }
        if (window && window["getJasmineRequireObj"] && typeof window["getJasmineRequireObj"] === "function") {
            return true;
        }
        return false;
    }
    wx.isInUnitTest = isInUnitTest;
    function getSearchParameters(query) {
        query = query || wx.app.history.location.search.substr(1);
        if (query) {
            var result = {};
            var params = query.split("&");
            for (var i = 0; i < params.length; i++) {
                var tmp = params[i].split("=");
                result[tmp[0]] = decodeURIComponent(tmp[1]);
            }
            return result;
        }
        return {};
    }
    wx.getSearchParameters = getSearchParameters;
    function args2Array(args) {
        var result = [];
        for (var i = 0, len = args.length; i < len; i++) {
            result.push(args[i]);
        }
        return result;
    }
    wx.args2Array = args2Array;
    function formatString(fmt) {
        var args = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            args[_i - 1] = arguments[_i];
        }
        var pattern = /\{\d+\}/g;
        return fmt.replace(pattern, function (capture) {
            return args[capture.match(/\d+/)];
        });
    }
    wx.formatString = formatString;
    function extend(src, dst, inherited) {
        var prop;
        if (!inherited) {
            var ownProps = Object.getOwnPropertyNames(src);
            for (var i = 0; i < ownProps.length; i++) {
                prop = ownProps[i];
                dst[prop] = src[prop];
            }
        }
        else {
            for (prop in src) {
                dst[prop] = src[prop];
            }
        }
        return dst;
    }
    wx.extend = extend;
    var oid = 1;
    var oidPropertyName = "__rxui_oid__" + (new Date).getTime();
    var PropertyInfo = (function () {
        function PropertyInfo(propertyName, property) {
            this.property = property;
            this.propertyName = propertyName;
        }
        return PropertyInfo;
    })();
    wx.PropertyInfo = PropertyInfo;
    function queryInterface(target, iid) {
        if (supportsQueryInterface(target)) {
            return target.queryInterface(iid);
        }
        return false;
    }
    wx.queryInterface = queryInterface;
    function supportsQueryInterface(target) {
        return target !== undefined && target !== null && typeof target.queryInterface === "function";
    }
    wx.supportsQueryInterface = supportsQueryInterface;
    function getOwnPropertiesImplementingInterface(target, iid) {
        return Object.keys(target).filter(function (propertyName) {
            var o = target[propertyName];
            return queryInterface(o, iid);
        }).map(function (x) { return new PropertyInfo(x, target[x]); });
    }
    wx.getOwnPropertiesImplementingInterface = getOwnPropertiesImplementingInterface;
    function getOid(o) {
        if (o == null)
            return undefined;
        if (isPrimitive(o))
            return (typeof o + ":" + o);
        var result = o[oidPropertyName];
        if (result === undefined) {
            result = (++oid).toString();
            o[oidPropertyName] = result;
        }
        return result;
    }
    wx.getOid = getOid;
    function toggleCssClass(node, shouldHaveClass) {
        var classNames = [];
        for (var _i = 2; _i < arguments.length; _i++) {
            classNames[_i - 2] = arguments[_i];
        }
        if (classNames) {
            var currentClassNames = node.className.match(regexCssClassName) || [];
            var index;
            var i;
            var className;
            if (shouldHaveClass) {
                for (i = 0; i < classNames.length; i++) {
                    className = classNames[i];
                    index = currentClassNames.indexOf(className);
                    if (index === -1)
                        currentClassNames.push(className);
                }
            }
            else {
                for (i = 0; i < classNames.length; i++) {
                    className = classNames[i];
                    index = currentClassNames.indexOf(className);
                    if (index !== -1)
                        currentClassNames.splice(index, 1);
                }
            }
            node.className = currentClassNames.join(" ");
        }
    }
    wx.toggleCssClass = toggleCssClass;
    function triggerReflow(el) {
        el.getBoundingClientRect();
    }
    wx.triggerReflow = triggerReflow;
    function isFunction(obj) {
        return typeof obj == 'function' || false;
    }
    wx.isFunction = isFunction;
    function isDisposable(obj) {
        return isFunction(obj["dispose"]);
    }
    wx.isDisposable = isDisposable;
    function isEqual(a, b, aStack, bStack) {
        var toString = ({}).toString;
        if (a === b)
            return a !== 0 || 1 / a === 1 / b;
        if (a == null || b == null)
            return a === b;
        var className = toString.call(a);
        if (className !== toString.call(b))
            return false;
        switch (className) {
            case '[object RegExp]':
            case '[object String]':
                return '' + a === '' + b;
            case '[object Number]':
                if (+a !== +a)
                    return +b !== +b;
                return +a === 0 ? 1 / +a === 1 / b : +a === +b;
            case '[object Date]':
            case '[object Boolean]':
                return +a === +b;
        }
        var areArrays = className === '[object Array]';
        if (!areArrays) {
            if (typeof a != 'object' || typeof b != 'object')
                return false;
            var aCtor = a.constructor, bCtor = b.constructor;
            if (aCtor !== bCtor && !(isFunction(aCtor) && aCtor instanceof aCtor && isFunction(bCtor) && bCtor instanceof bCtor) && ('constructor' in a && 'constructor' in b)) {
                return false;
            }
        }
        aStack = aStack || [];
        bStack = bStack || [];
        var length = aStack.length;
        while (length--) {
            if (aStack[length] === a)
                return bStack[length] === b;
        }
        aStack.push(a);
        bStack.push(b);
        if (areArrays) {
            length = a.length;
            if (length !== b.length)
                return false;
            while (length--) {
                if (!isEqual(a[length], b[length], aStack, bStack))
                    return false;
            }
        }
        else {
            var keys = Object.keys(a), key;
            length = keys.length;
            if (Object.keys(b).length !== length)
                return false;
            while (length--) {
                key = keys[length];
                if (!(b.hasOwnProperty(key) && isEqual(a[key], b[key], aStack, bStack)))
                    return false;
            }
        }
        aStack.pop();
        bStack.pop();
        return true;
    }
    wx.isEqual = isEqual;
    function cloneNodeArray(nodes) {
        var length = nodes.length;
        var result = new Array(length);
        for (var i = 0; i < length; i++) {
            result[i] = nodes[i].cloneNode(true);
        }
        return result;
    }
    wx.cloneNodeArray = cloneNodeArray;
    function nodeListToArray(nodes) {
        return Array.prototype.slice.call(nodes);
    }
    wx.nodeListToArray = nodeListToArray;
    function nodeChildrenToArray(node) {
        return nodeListToArray(node.childNodes);
    }
    wx.nodeChildrenToArray = nodeChildrenToArray;
    function using(disp, action) {
        if (!disp)
            throw new Error("disp");
        if (!action)
            throw new Error("action");
        try {
            action(disp);
        }
        finally {
            disp.dispose();
        }
    }
    wx.using = using;
    function observableRequire(module) {
        if (!isFunction(require))
            internal.throwError("there's no AMD-module loader available (Hint: did you forget to include RequireJS in your project?)");
        return Rx.Observable.create(function (observer) {
            try {
                require([module], function (m) {
                    observer.onNext(m);
                    observer.onCompleted();
                }, function (err) {
                    observer.onError(err);
                });
            }
            catch (e) {
                observer.onError(e);
            }
            return Rx.Disposable.empty;
        });
    }
    wx.observableRequire = observableRequire;
    function observeObject(target, onChanging) {
        if (onChanging === void 0) { onChanging = false; }
        var thrownExceptionsSubject = queryInterface(target, wx.IID.IHandleObservableErrors) ? target.thrownExceptions : wx.app.defaultExceptionHandler;
        return Rx.Observable.create(function (observer) {
            var result = new Rx.CompositeDisposable();
            var observableProperties = getOwnPropertiesImplementingInterface(target, wx.IID.IObservableProperty);
            observableProperties.forEach(function (x) {
                var prop = x.property;
                var obs = onChanging ? prop.changing : prop.changed;
                result.add(obs.subscribe(function (_) {
                    var e = new internal.PropertyChangedEventArgs(self, x.propertyName);
                    try {
                        observer.onNext(e);
                    }
                    catch (ex) {
                        thrownExceptionsSubject.onNext(ex);
                    }
                }));
            });
            return result;
        }).publish().refCount();
    }
    wx.observeObject = observeObject;
    function whenAny() {
        if (arguments.length === 2) {
            return arguments[0].changed.startWith(arguments[0]()).select(arguments[1]);
        }
        var args = args2Array(arguments);
        var selector = args.pop();
        args = args.map(function (x) { return x.changed.startWith(x()); });
        args.push(selector);
        return Rx.Observable.combineLatest.apply(this, args);
    }
    wx.whenAny = whenAny;
    var internal;
    (function (internal) {
        function throwError(fmt) {
            var args = [];
            for (var _i = 1; _i < arguments.length; _i++) {
                args[_i - 1] = arguments[_i];
            }
            var msg = "WebRx: " + formatString(fmt, args);
            throw new Error(msg);
        }
        internal.throwError = throwError;
        function emitError(fmt) {
            var args = [];
            for (var _i = 1; _i < arguments.length; _i++) {
                args[_i - 1] = arguments[_i];
            }
            var msg = "WebRx: " + formatString(fmt, args);
            wx.app.defaultExceptionHandler.onNext(Error(msg));
        }
        internal.emitError = emitError;
    })(internal = wx.internal || (wx.internal = {}));
})(wx || (wx = {}));
var wx;
(function (wx) {
    "use strict";
    var Injector = (function () {
        function Injector() {
            this.registrations = {};
        }
        Injector.prototype.register = function () {
            var key = arguments[0];
            var val = arguments[1];
            var isSingleton = arguments[2];
            var factory;
            if (this.registrations.hasOwnProperty(key))
                wx.internal.throwError("'{0}' is already registered", key);
            if (wx.isFunction(val)) {
                factory = function (args, deps) { return val.apply(null, args); };
            }
            else if (Array.isArray(val)) {
                var self = this;
                var ctor = val.pop();
                var dependencies = val;
                factory = function (args, deps) {
                    var resolved = dependencies.map(function (x) {
                        try {
                            return self.get(x, undefined, deps);
                        }
                        catch (e) {
                            wx.internal.throwError("Error resolving dependency '{0}' for '{1}': {2}", x, key, e);
                        }
                    });
                    var _args = [null].concat(resolved).concat(args);
                    var ctorFunc = ctor.bind.apply(ctor, _args);
                    return new ctorFunc();
                };
            }
            else {
                factory = function (args, deps) { return val; };
            }
            this.registrations[key] = { factory: factory, isSingleton: isSingleton };
            return this;
        };
        Injector.prototype.get = function (key, args, deps) {
            deps = deps || {};
            if (deps.hasOwnProperty(key))
                wx.internal.throwError("Detected circular dependency a from '{0}' to '{1}'", Object.keys(deps).join(", "), key);
            var registration = this.registrations[key];
            if (registration === undefined)
                wx.internal.throwError("'{0}' is not registered", key);
            if (registration.isSingleton && registration.value)
                return registration.value;
            var newDeps = {};
            newDeps[key] = true;
            wx.extend(deps, newDeps);
            var result = registration.factory(args, newDeps);
            if (registration.isSingleton)
                registration.value = result;
            return result;
        };
        Injector.prototype.resolve = function (iaa, args) {
            var ctor = iaa.pop();
            if (!wx.isFunction(ctor))
                wx.internal.throwError("Error resolving inline-annotated-array. Constructor must be of type 'function' but is '{0}", typeof ctor);
            var self = this;
            var resolved = iaa.map(function (x) {
                try {
                    return self.get(x, undefined, iaa);
                }
                catch (e) {
                    wx.internal.throwError("Error resolving dependency '{0}' for '{1}': {2}", x, Object.getPrototypeOf(ctor), e);
                }
            });
            var _args = [null].concat(resolved).concat(args);
            var ctorFunc = ctor.bind.apply(ctor, _args);
            return new ctorFunc();
        };
        return Injector;
    })();
    wx.injector = new Injector();
    wx.injector.register(wx.res.injector, function () { return new Injector(); });
})(wx || (wx = {}));
var wx;
(function (wx) {
    "use strict";
    var SetEmulated = (function () {
        function SetEmulated() {
            this.values = [];
            this.keys = {};
        }
        SetEmulated.prototype.add = function (value) {
            var key = wx.getOid(value);
            if (!this.keys[key]) {
                this.values.push(value);
                this.keys[key] = true;
            }
            return this;
        };
        SetEmulated.prototype.delete = function (value) {
            var key = wx.getOid(value);
            if (this.keys[key]) {
                var index = this.values.indexOf(value);
                this.values.splice(index, 1);
                delete this.keys[key];
                return true;
            }
            return false;
        };
        SetEmulated.prototype.has = function (value) {
            var key = wx.getOid(value);
            return this.keys.hasOwnProperty(key);
        };
        SetEmulated.prototype.clear = function () {
            this.keys = {};
            this.values.length = 0;
        };
        SetEmulated.prototype.forEach = function (callback, thisArg) {
            this.values.forEach(callback, thisArg);
        };
        Object.defineProperty(SetEmulated.prototype, "size", {
            get: function () {
                return this.values.length;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(SetEmulated.prototype, "isEmulated", {
            get: function () {
                return true;
            },
            enumerable: true,
            configurable: true
        });
        return SetEmulated;
    })();
    var hasNativeSupport = typeof Set === "function" && Set.prototype.hasOwnProperty("forEach") && Set.prototype.hasOwnProperty("add") && Set.prototype.hasOwnProperty("clear") && Set.prototype.hasOwnProperty("delete") && Set.prototype.hasOwnProperty("has");
    function createSet(disableNativeSupport) {
        if (disableNativeSupport || !hasNativeSupport) {
            return new SetEmulated();
        }
        return new Set();
    }
    wx.createSet = createSet;
    function setToArray(src) {
        var result = new Array();
        src.forEach(function (x) { return result.push(x); });
        return result;
    }
    wx.setToArray = setToArray;
})(wx || (wx = {}));
var wx;
(function (wx) {
    var env;
    (function (env) {
        "use strict";
        var _window = window;
        var userAgent = _window.navigator.userAgent;
        env.ie;
        env.opera;
        env.safari;
        env.firefox;
        var parseVersion = function (matches) {
            if (matches) {
                return parseFloat(matches[1]);
            }
            return undefined;
        };
        if (_window.opera && _window.opera.version) {
            env.opera = { version: parseInt(_window.opera.version()) };
        }
        var version = document && (function () {
            var version = 3, div = document.createElement('div'), iElems = div.getElementsByTagName('i');
            while (div.innerHTML = '<!--[if gt IE ' + (++version) + ']><i></i><![endif]-->', iElems[0]) {
            }
            return version > 4 ? version : undefined;
        }());
        if (version) {
            env.ie = { version: version };
            if (version < 10) {
                var map = wx.createWeakMap();
                env.ie.getSelectionChangeObservable = function (el) {
                    var doc = el.ownerDocument;
                    var result = map.get(doc);
                    if (result)
                        return result;
                    result = Rx.Observable.defer(function () {
                        return Rx.Observable.fromEvent(doc, 'selectionchange');
                    }).select(function (x) { return doc; }).publish().refCount();
                    map.set(doc, result);
                    return result;
                };
            }
        }
        version = parseVersion(userAgent.match(/^(?:(?!chrome).)*version\/([^ ]*) safari/i));
        if (version) {
            env.safari = { version: version };
        }
        version = parseVersion(userAgent.match(/Firefox\/([^ ]*)/));
        if (version) {
            env.firefox = { version: version };
        }
        var hasES5 = typeof Array.isArray === "function" && typeof [].forEach === "function" && typeof [].map === "function" && typeof [].some === "function" && typeof [].indexOf === "function" && typeof Object.keys === "function" && typeof Object.defineProperty === "function";
        env.isSupported = (!env.ie || env.ie.version >= 9) || (!env.safari || env.safari.version >= 5) || (!env.firefox || env.firefox.version >= 5) && hasES5;
        env.jQueryInstance = window["jQuery"];
        if (env.jQueryInstance && (typeof env.jQueryInstance['cleanData'] === "function")) {
            env.cleanExternalData = function (node) {
                env.jQueryInstance['cleanData']([node]);
            };
        }
        else {
            env.cleanExternalData = function (node) {
            };
        }
    })(env = wx.env || (wx.env = {}));
})(wx || (wx = {}));
var wx;
(function (wx) {
    "use strict";
    function property(initialValue) {
        var accessor = function (newVal) {
            if (arguments.length > 0) {
                if (newVal !== accessor.value) {
                    accessor.changingSubject.onNext(newVal);
                    accessor.value = newVal;
                    accessor.changedSubject.onNext(newVal);
                }
            }
            else {
                return accessor.value;
            }
        };
        accessor.queryInterface = function (iid) {
            if (iid === wx.IID.IUnknown || iid === wx.IID.IObservableProperty || iid === wx.IID.IDisposable)
                return true;
            return false;
        };
        accessor.dispose = function () {
        };
        if (initialValue !== undefined)
            accessor.value = initialValue;
        accessor.changedSubject = new Rx.Subject();
        accessor.changed = accessor.changedSubject.publish().refCount();
        accessor.changingSubject = new Rx.Subject();
        accessor.changing = accessor.changingSubject.publish().refCount();
        return accessor;
    }
    wx.property = property;
})(wx || (wx = {}));
var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var wx;
(function (wx) {
    "use strict";
    var Module = (function () {
        function Module(name) {
            this.bindings = {};
            this.components = {};
            this.expressionFilters = {};
            this.animations = {};
            this.name = name;
        }
        Module.prototype.merge = function (other) {
            var _other = other;
            wx.extend(_other.components, this.components);
            wx.extend(_other.bindings, this.bindings);
            wx.extend(_other.expressionFilters, this.expressionFilters);
            wx.extend(_other.animations, this.animations);
            return this;
        };
        Module.prototype.component = function (name, component) {
            this.components[name] = component;
            return this;
        };
        Module.prototype.hasComponent = function (name) {
            return this.components[name] != null;
        };
        Module.prototype.loadComponent = function (name, params) {
            return this.initializeComponent(this.instantiateComponent(name), params);
        };
        Module.prototype.binding = function () {
            var _this = this;
            var args = wx.args2Array(arguments);
            var name = args.shift();
            var handler;
            if (args.length === 0) {
                handler = this.bindings[name];
                if (typeof handler === "string") {
                    handler = wx.injector.get(handler);
                    this.bindings[name] = handler;
                }
                return handler;
            }
            handler = args.shift();
            if (Array.isArray(name)) {
                name.forEach(function (x) { return _this.bindings[x] = handler; });
            }
            else {
                this.bindings[name] = handler;
            }
            return this;
        };
        Module.prototype.filter = function () {
            var args = wx.args2Array(arguments);
            var name = args.shift();
            var filter;
            if (args.length === 0) {
                filter = this.expressionFilters[name];
                if (typeof filter === "string") {
                    filter = wx.injector.get(filter);
                    this.bindings[name] = filter;
                }
                return filter;
            }
            filter = args.shift();
            this.expressionFilters[name] = filter;
            return this;
        };
        Module.prototype.filters = function () {
            return this.expressionFilters;
        };
        Module.prototype.animation = function () {
            var args = wx.args2Array(arguments);
            var name = args.shift();
            var animation;
            if (args.length === 0) {
                animation = this.animations[name];
                if (typeof animation === "string") {
                    animation = wx.injector.get(animation);
                    this.bindings[name] = animation;
                }
                return animation;
            }
            animation = args.shift();
            this.animations[name] = animation;
            return this;
        };
        Module.prototype.instantiateComponent = function (name) {
            var _this = this;
            var cd = this.components[name];
            var result = undefined;
            if (cd != null) {
                if (cd.instance) {
                    result = Rx.Observable.return(cd.instance);
                }
                else if (cd.template) {
                    result = Rx.Observable.return(cd);
                }
                else if (cd.resolve) {
                    var resolved = wx.injector.get(cd.resolve);
                    result = Rx.Observable.return(resolved);
                }
                else if (cd.require) {
                    result = wx.observableRequire(cd.require);
                }
            }
            else {
                result = Rx.Observable.return(undefined);
            }
            return result.do(function (x) { return _this.components[name].instance = x; });
        };
        Module.prototype.initializeComponent = function (obs, params) {
            var _this = this;
            return obs.take(1).selectMany(function (component) {
                if (component == null) {
                    return Rx.Observable.return(undefined);
                }
                if (component.viewModel) {
                    return Rx.Observable.combineLatest(_this.loadComponentTemplate(component.template, params), _this.loadComponentViewModel(component.viewModel, params), function (t, vm) {
                        if (wx.isFunction(vm)) {
                            vm = new vm(params);
                        }
                        return {
                            template: t,
                            viewModel: vm,
                            preBindingInit: component.preBindingInit,
                            postBindingInit: component.postBindingInit
                        };
                    });
                }
                return _this.loadComponentTemplate(component.template, params).select(function (template) { return {
                    template: template,
                    preBindingInit: component.preBindingInit,
                    postBindingInit: component.postBindingInit
                }; });
            }).take(1);
        };
        Module.prototype.loadComponentTemplate = function (template, params) {
            var syncResult;
            var el;
            if (wx.isFunction(template)) {
                syncResult = template(params);
                if (typeof syncResult === "string") {
                    syncResult = wx.app.templateEngine.parse(template(params));
                }
                return Rx.Observable.return(syncResult);
            }
            else if (typeof template === "string") {
                syncResult = wx.app.templateEngine.parse(template);
                return Rx.Observable.return(syncResult);
            }
            else if (Array.isArray(template)) {
                return Rx.Observable.return(template);
            }
            else if (typeof template === "object") {
                var options = template;
                if (options.resolve) {
                    syncResult = wx.injector.get(options.resolve);
                    return Rx.Observable.return(syncResult);
                }
                else if (options.promise) {
                    var promise = options.promise;
                    return Rx.Observable.fromPromise(promise);
                }
                else if (options.require) {
                    return wx.observableRequire(options.require).select(function (x) { return wx.app.templateEngine.parse(x); });
                }
                else if (options.element) {
                    if (typeof options.element === "string") {
                        el = document.getElementById(options.element) || document.querySelector(options.element);
                        if (el != null) {
                            syncResult = wx.app.templateEngine.parse(el.innerHTML);
                        }
                        else {
                            syncResult = [];
                        }
                        return Rx.Observable.return(syncResult);
                    }
                    else {
                        el = options.element;
                        if (el != null) {
                            syncResult = wx.app.templateEngine.parse(el.innerHTML);
                        }
                        else {
                            syncResult = [];
                        }
                        return Rx.Observable.return(syncResult);
                    }
                }
            }
            internal.throwError("invalid template descriptor");
        };
        Module.prototype.loadComponentViewModel = function (vm, componentParams) {
            var syncResult;
            if (wx.isFunction(vm)) {
                return Rx.Observable.return(vm);
            }
            else if (Array.isArray(vm)) {
                syncResult = wx.injector.resolve(vm, componentParams);
                return Rx.Observable.return(syncResult);
            }
            else if (typeof vm === "object") {
                var options = vm;
                if (options.resolve) {
                    syncResult = wx.injector.get(options.resolve, componentParams);
                    return Rx.Observable.return(syncResult);
                }
                else if (options.promise) {
                    var promise = options.promise;
                    return Rx.Observable.fromPromise(promise);
                }
                else if (options.require) {
                    return wx.observableRequire(options.require);
                }
                else if (options.instance) {
                    return Rx.Observable.return(options.instance);
                }
            }
            internal.throwError("invalid view-model descriptor");
        };
        return Module;
    })();
    var App = (function (_super) {
        __extends(App, _super);
        function App() {
            _super.call(this, "app");
            this.defaultExceptionHandler = Rx.Observer.create(function (ex) {
                if (!wx.isInUnitTest()) {
                    wx.log.error("An onError occurred on an object (usually a computedProperty) that would break a binding or command. To prevent this, subscribe to the thrownExceptions property of your objects: {0}", ex);
                }
            });
            this.title = wx.property();
            if (!wx.isInUnitTest()) {
                this.history = this.createHistory();
            }
            else {
                this.history = createMockHistory();
            }
        }
        Object.defineProperty(App.prototype, "mainThreadScheduler", {
            get: function () {
                return this._unitTestMainThreadScheduler || this._mainThreadScheduler || Rx.Scheduler.currentThread;
            },
            set: function (value) {
                if (wx.isInUnitTest()) {
                    this._unitTestMainThreadScheduler = value;
                    this._mainThreadScheduler = this._mainThreadScheduler || value;
                }
                else {
                    this._mainThreadScheduler = value;
                }
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(App.prototype, "templateEngine", {
            get: function () {
                if (!this._templateEngine) {
                    this._templateEngine = wx.injector.get(wx.res.htmlTemplateEngine);
                }
                return this._templateEngine;
            },
            set: function (newVal) {
                this._templateEngine = newVal;
            },
            enumerable: true,
            configurable: true
        });
        App.prototype.createHistory = function () {
            var result = {
                back: window.history.back.bind(window.history),
                forward: window.history.forward.bind(window.history),
                pushState: window.history.pushState.bind(window.history),
                replaceState: window.history.replaceState.bind(window.history)
            };
            Object.defineProperty(result, "length", {
                get: function () {
                    return window.history.length;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(result, "state", {
                get: function () {
                    return window.history.state;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(result, "location", {
                get: function () {
                    return window.location;
                },
                enumerable: true,
                configurable: true
            });
            result.onPopState = Rx.Observable.fromEventPattern(function (h) { return window.addEventListener("popstate", h); }, function (h) { return window.removeEventListener("popstate", h); }).publish().refCount();
            return result;
        };
        return App;
    })(Module);
    var internal;
    (function (internal) {
        internal.moduleConstructor = Module;
    })(internal = wx.internal || (wx.internal = {}));
    wx.app = new App();
    var modules = {
        'app': { instance: wx.app }
    };
    function module(name, descriptor) {
        modules[name] = descriptor;
        return wx;
    }
    wx.module = module;
    function loadModule(name) {
        var md = modules[name];
        var result = undefined;
        var module;
        if (md != null) {
            if (Array.isArray(md)) {
                module = new Module(name);
                wx.injector.resolve(md, module);
                result = Rx.Observable.return(module);
            }
            else if (wx.isFunction(md)) {
                module = new Module(name);
                md(module);
                result = Rx.Observable.return(module);
            }
            else {
                var mdd = md;
                if (mdd.instance) {
                    result = Rx.Observable.return(mdd.instance);
                }
                else {
                    module = new Module(name);
                    if (mdd.resolve) {
                        wx.injector.get(mdd.resolve, module);
                        result = Rx.Observable.return(module);
                    }
                    else if (mdd.require) {
                        result = wx.observableRequire(mdd.require).do(function (x) { return x(module); }).select(function (x) { return module; });
                    }
                }
            }
        }
        else {
            result = Rx.Observable.return(undefined);
        }
        return result.take(1).do(function (x) { return modules[name] = { instance: x }; });
    }
    wx.loadModule = loadModule;
})(wx || (wx = {}));
var wx;
(function (wx) {
    "use strict";
    var DomManager = (function () {
        function DomManager(compiler) {
            this.expressionCache = {};
            this.dataContextExtensions = wx.createSet();
            this.parserOptions = {
                disallowFunctionCalls: true
            };
            this.nodeState = wx.createWeakMap();
            this.compiler = compiler;
        }
        DomManager.prototype.applyBindings = function (model, rootNode) {
            if (rootNode === undefined || rootNode.nodeType !== 1)
                internal.throwError("first parameter should be your model, second parameter should be a DOM node!");
            if (this.isNodeBound(rootNode))
                internal.throwError("an element must not be bound multiple times!");
            var state = this.getNodeState(rootNode);
            if (state) {
                state.model = model;
            }
            else {
                state = this.createNodeState(model);
                this.setNodeState(rootNode, state);
            }
            var ctx = this.getDataContext(rootNode);
            this.applyBindingsRecursive(ctx, rootNode);
        };
        DomManager.prototype.applyBindingsToDescendants = function (ctx, node) {
            if (node.hasChildNodes()) {
                for (var i = 0; i < node.childNodes.length; i++) {
                    var child = node.childNodes[i];
                    if (child.nodeType !== 1)
                        continue;
                    this.applyBindingsRecursive(ctx, child);
                }
            }
        };
        DomManager.prototype.cleanNode = function (rootNode) {
            if (rootNode.nodeType !== 1)
                return;
            this.cleanNodeRecursive(rootNode);
        };
        DomManager.prototype.cleanDescendants = function (node) {
            if (node.hasChildNodes()) {
                for (var i = 0; i < node.childNodes.length; i++) {
                    var child = node.childNodes[i];
                    if (node.nodeType !== 1)
                        continue;
                    this.clearNodeState(child);
                }
            }
        };
        DomManager.prototype.getObjectLiteralTokens = function (value) {
            value = value.trim();
            if (value !== '' && this.isObjectLiteralString(value)) {
                return this.compiler.parseObjectLiteral(value);
            }
            return [];
        };
        DomManager.prototype.compileBindingOptions = function (value, module) {
            value = value.trim();
            if (value === '') {
                return null;
            }
            if (this.isObjectLiteralString(value)) {
                var result = {};
                var tokens = this.compiler.parseObjectLiteral(value);
                var token;
                for (var i = 0; i < tokens.length; i++) {
                    token = tokens[i];
                    result[token.key] = this.compileBindingOptions(token.value, module);
                }
                return result;
            }
            else {
                var options = wx.extend(this.parserOptions, {});
                options.filters = {};
                wx.extend(wx.app.filters(), options.filters);
                if (module) {
                    wx.extend(module.filters(), options.filters);
                }
                return this.compiler.compileExpression(value, options, this.expressionCache);
            }
        };
        DomManager.prototype.getModuleContext = function (node) {
            var state;
            while (node) {
                state = this.getNodeState(node);
                if (state != null) {
                    if (state.module != null) {
                        return state.module;
                    }
                }
                node = node.parentNode;
            }
            return wx.app;
        };
        DomManager.prototype.registerDataContextExtension = function (extension) {
            this.dataContextExtensions.add(extension);
        };
        DomManager.prototype.getDataContext = function (node) {
            var models = [];
            var state = this.getNodeState(node);
            var _node = node;
            while (_node) {
                state = state != null ? state : this.getNodeState(_node);
                if (state != null) {
                    if (state.model != null) {
                        models.push(state.model);
                    }
                }
                state = null;
                _node = _node.parentNode;
            }
            var ctx;
            if (models.length > 0) {
                ctx = {
                    $data: models[0],
                    $root: models[models.length - 1],
                    $parent: models.length > 1 ? models[1] : null,
                    $parents: models.slice(1)
                };
            }
            else {
                ctx = {
                    $data: null,
                    $root: null,
                    $parent: null,
                    $parents: []
                };
            }
            this.dataContextExtensions.forEach(function (ext) { return ext(node, ctx); });
            return ctx;
        };
        DomManager.prototype.createNodeState = function (model, module) {
            return {
                cleanup: new Rx.CompositeDisposable(),
                model: model,
                module: module,
                isBound: false
            };
        };
        DomManager.prototype.isNodeBound = function (node) {
            var state = this.nodeState.get(node);
            return state && state.isBound;
        };
        DomManager.prototype.setNodeState = function (node, state) {
            this.nodeState.set(node, state);
        };
        DomManager.prototype.getNodeState = function (node) {
            return this.nodeState.get(node);
        };
        DomManager.prototype.clearNodeState = function (node) {
            var state = this.nodeState.get(node);
            if (state) {
                if (state.cleanup != null) {
                    state.cleanup.dispose();
                    state.cleanup = undefined;
                }
                if (state.model != null) {
                    state.model = undefined;
                }
                if (state.module != null) {
                    state.module = undefined;
                }
            }
            this.nodeState.delete(node);
            wx.env.cleanExternalData(node);
        };
        DomManager.prototype.evaluateExpression = function (exp, ctx) {
            var locals = this.createLocals(undefined, ctx);
            var result = exp(ctx.$data, locals);
            return result;
        };
        DomManager.prototype.expressionToObservable = function (exp, ctx, evalObs) {
            var _this = this;
            var captured = wx.createSet();
            var locals;
            var result;
            try {
                locals = this.createLocals(captured, ctx);
                result = exp(ctx.$data, locals);
                if (evalObs)
                    evalObs.onNext(true);
            }
            catch (e) {
                wx.app.defaultExceptionHandler.onNext(e);
                return Rx.Observable.return(undefined);
            }
            if (captured.size === 0) {
                if (wx.isRxObservable(result))
                    return result;
                return Rx.Observable.return(result);
            }
            var obs = Rx.Observable.create(function (observer) {
                var innerDisp = Rx.Observable.defer(function () {
                    return Rx.Observable.merge(wx.setToArray(captured)).take(1);
                }).repeat().subscribe(function (trigger) {
                    try {
                        captured.clear();
                        locals = _this.createLocals(captured, ctx);
                        result = exp(ctx.$data, locals);
                        if (!wx.isRxObservable(result)) {
                            observer.onNext(Rx.Observable.return(result));
                        }
                        else {
                            observer.onNext(result);
                        }
                        if (evalObs)
                            evalObs.onNext(true);
                    }
                    catch (e) {
                        wx.app.defaultExceptionHandler.onNext(e);
                    }
                });
                return innerDisp;
            });
            var startValue = wx.isRxObservable(result) ? result : Rx.Observable.return(result);
            return obs.startWith(startValue).concatAll().publish().refCount();
        };
        DomManager.prototype.applyBindingsInternal = function (ctx, el, module) {
            var result = false;
            var state = this.getNodeState(el);
            if (!state) {
                state = this.createNodeState();
                this.setNodeState(el, state);
            }
            else if (state.isBound) {
                internal.throwError("an element must not be bound multiple times!");
            }
            var _bindings;
            var tagName = el.tagName.toLowerCase();
            var i;
            if (module.hasComponent(tagName) || wx.app.hasComponent(tagName)) {
                var params = el.getAttribute(DomManager.paramsAttributename);
                var componentReference;
                if (params)
                    componentReference = "{ name: '" + tagName + "', params: {" + el.getAttribute(DomManager.paramsAttributename) + "} }";
                else
                    componentReference = "{ name: '" + tagName + "' }";
                _bindings = [{ key: 'component', value: componentReference }];
            }
            else {
                _bindings = this.getBindingDefinitions(el);
            }
            if (_bindings != null && _bindings.length > 0) {
                var bindings = _bindings.map(function (x) {
                    var handler = module.binding(x.key);
                    if (!handler)
                        internal.throwError("binding '{0}' has not been registered.", x.key);
                    return { handler: handler, value: x.value };
                });
                bindings.sort(function (a, b) { return (b.handler.priority || 0) - (a.handler.priority || 0); });
                var hd = bindings.filter(function (x) { return x.handler.controlsDescendants; }).map(function (x) { return "'" + x.value + "'"; });
                if (hd.length > 1) {
                    internal.throwError("bindings {0} are competing for descendants of target element!", hd.join(", "));
                }
                result = hd.length > 0;
                for (i = 0; i < bindings.length; i++) {
                    var binding = bindings[i];
                    var handler = binding.handler;
                    handler.applyBinding(el, binding.value, ctx, state, module);
                }
            }
            state.isBound = true;
            return result;
        };
        DomManager.prototype.isObjectLiteralString = function (str) {
            return str[0] === "{" && str[str.length - 1] === "}";
        };
        DomManager.prototype.getBindingDefinitions = function (node) {
            var bindingText = null;
            if (node.nodeType === 1) {
                var attr = node.getAttribute(DomManager.bindingAttributeName);
                if (attr) {
                    bindingText = attr;
                }
            }
            if (bindingText) {
                bindingText = bindingText.trim();
            }
            if (bindingText)
                return this.compiler.parseObjectLiteral(bindingText);
            return null;
        };
        DomManager.prototype.applyBindingsRecursive = function (ctx, el, module) {
            module = module || this.getModuleContext(el);
            if (!this.applyBindingsInternal(ctx, el, module) && el.hasChildNodes()) {
                var state = this.getNodeState(el);
                if (state && state.module)
                    module = state.module;
                for (var i = 0; i < el.childNodes.length; i++) {
                    var child = el.childNodes[i];
                    if (child.nodeType !== 1)
                        continue;
                    this.applyBindingsRecursive(ctx, child, module);
                }
            }
        };
        DomManager.prototype.cleanNodeRecursive = function (node) {
            if (node.hasChildNodes()) {
                var length = node.childNodes.length;
                for (var i = 0; i < length; i++) {
                    var child = node.childNodes[i];
                    if (node.nodeType !== 1)
                        continue;
                    this.cleanNodeRecursive(child);
                }
            }
            this.clearNodeState(node);
        };
        DomManager.prototype.createLocals = function (captured, ctx) {
            var locals = {};
            var list;
            var prop;
            var result, target;
            var hooks = {
                readFieldHook: function (o, field) {
                    var noUnwrap = false;
                    if (field[0] === '@') {
                        noUnwrap = true;
                        field = field.substring(1);
                    }
                    result = o[field];
                    if (!noUnwrap && wx.isProperty(result)) {
                        var prop = result;
                        if (captured)
                            captured.add(prop.changed);
                        result = prop();
                    }
                    return result;
                },
                writeFieldHook: function (o, field, newValue) {
                    if (field[0] === '@') {
                        field = field.substring(1);
                    }
                    target = o[field];
                    if (wx.isProperty(target)) {
                        var prop = target;
                        if (captured)
                            captured.add(prop.changed);
                        prop(newValue);
                    }
                    else {
                        o[field] = newValue;
                    }
                    return newValue;
                },
                readIndexHook: function (o, index) {
                    if (wx.queryInterface(o, wx.IID.IObservableList)) {
                        list = o;
                        result = list.get(index);
                        if (captured)
                            captured.add(list.listChanged);
                    }
                    else {
                        result = o[index];
                    }
                    if (wx.queryInterface(result, wx.IID.IObservableProperty)) {
                        var prop = result;
                        if (captured)
                            captured.add(prop.changed);
                        result = prop();
                    }
                    return result;
                },
                writeIndexHook: function (o, index, newValue) {
                    if (wx.queryInterface(o, wx.IID.IObservableList)) {
                        list = o;
                        target = list.get(index);
                        if (captured)
                            captured.add(list.listChanged);
                        if (wx.isProperty(target)) {
                            prop = target;
                            if (captured)
                                captured.add(prop.changed);
                            prop(newValue);
                        }
                        else {
                            list.set(index, newValue);
                        }
                    }
                    else {
                        if (wx.isProperty(o[index])) {
                            prop = target[index];
                            if (captured)
                                captured.add(prop.changed);
                            prop(newValue);
                        }
                        else {
                            o[index] = newValue;
                        }
                    }
                    return newValue;
                }
            };
            this.compiler.setRuntimeHooks(locals, hooks);
            var keys = Object.keys(ctx);
            var length = keys.length;
            for (var i = 0; i < length; i++) {
                var key = keys[i];
                locals[key] = ctx[key];
            }
            return locals;
        };
        DomManager.bindingAttributeName = "data-bind";
        DomManager.paramsAttributename = "params";
        return DomManager;
    })();
    var internal;
    (function (internal) {
        internal.domManagerConstructor = DomManager;
    })(internal = wx.internal || (wx.internal = {}));
    function applyBindings(model, node) {
        wx.injector.get(wx.res.domManager).applyBindings(model, node || window.document.documentElement);
    }
    wx.applyBindings = applyBindings;
    function cleanNode(node) {
        wx.injector.get(wx.res.domManager).cleanNode(node);
    }
    wx.cleanNode = cleanNode;
})(wx || (wx = {}));
var wx;
(function (wx) {
    "use strict";
    var CheckedBinding = (function () {
        function CheckedBinding(domManager) {
            this.priority = 0;
            this.domManager = domManager;
        }
        CheckedBinding.prototype.applyBinding = function (node, options, ctx, state, module) {
            var _this = this;
            if (node.nodeType !== 1)
                internal.throwError("checked-binding only operates on elements!");
            if (options == null)
                internal.throwError("invalid binding-options!");
            var el = node;
            var tag = el.tagName.toLowerCase();
            var isCheckBox = el.type === 'checkbox';
            var isRadioButton = el.type === 'radio';
            if (tag !== 'input' || (!isCheckBox && !isRadioButton))
                internal.throwError("checked-binding only operates on checkboxes and radio-buttons");
            var exp = this.domManager.compileBindingOptions(options, module);
            var prop;
            var cleanup;
            function doCleanup() {
                if (cleanup) {
                    cleanup.dispose();
                    cleanup = null;
                }
            }
            function updateElement(value) {
                el.checked = value;
            }
            state.cleanup.add(this.domManager.expressionToObservable(exp, ctx).subscribe(function (model) {
                try {
                    if (!wx.isProperty(model)) {
                        updateElement(model);
                    }
                    else {
                        doCleanup();
                        cleanup = new Rx.CompositeDisposable();
                        prop = model;
                        cleanup.add(prop.changed.subscribe(function (x) {
                            updateElement(x);
                        }));
                        updateElement(prop());
                        if (!prop.source) {
                            var events = _this.getCheckedEventObservables(el);
                            cleanup.add(Rx.Observable.merge(events).subscribe(function (e) {
                                prop(el.checked);
                            }));
                        }
                    }
                }
                catch (e) {
                    wx.app.defaultExceptionHandler.onNext(e);
                }
            }));
            state.cleanup.add(Rx.Disposable.create(function () {
                node = null;
                options = null;
                ctx = null;
                state = null;
                el = null;
                doCleanup();
            }));
        };
        CheckedBinding.prototype.configure = function (options) {
        };
        CheckedBinding.prototype.getCheckedEventObservables = function (el) {
            var result = [];
            result.push(Rx.Observable.fromEvent(el, 'click'));
            result.push(Rx.Observable.fromEvent(el, 'change'));
            return result;
        };
        return CheckedBinding;
    })();
    var internal;
    (function (internal) {
        internal.checkedBindingConstructor = CheckedBinding;
    })(internal = wx.internal || (wx.internal = {}));
})(wx || (wx = {}));
var wx;
(function (wx) {
    "use strict";
    var CommandBinding = (function () {
        function CommandBinding(domManager) {
            this.priority = 0;
            this.domManager = domManager;
        }
        CommandBinding.prototype.applyBinding = function (node, options, ctx, state, module) {
            if (node.nodeType !== 1)
                internal.throwError("command-binding only operates on elements!");
            if (options == null)
                internal.throwError("invalid binding-options!");
            var compiled = this.domManager.compileBindingOptions(options, module);
            var el = node;
            var exp;
            var cmdObservable;
            var paramObservable;
            var cleanup;
            var isAnchor = el.tagName.toLowerCase() === "a";
            var event = "click";
            function doCleanup() {
                if (cleanup) {
                    cleanup.dispose();
                    cleanup = null;
                }
            }
            if (typeof compiled === "function") {
                exp = compiled;
                cmdObservable = this.domManager.expressionToObservable(exp, ctx);
            }
            else {
                var opt = compiled;
                exp = opt.command;
                cmdObservable = this.domManager.expressionToObservable(exp, ctx);
                if (opt.parameter) {
                    exp = opt.parameter;
                    paramObservable = this.domManager.expressionToObservable(exp, ctx);
                }
            }
            if (paramObservable == null) {
                paramObservable = Rx.Observable.return(undefined);
            }
            state.cleanup.add(Rx.Observable.combineLatest(cmdObservable, paramObservable, function (cmd, param) { return ({ cmd: cmd, param: param }); }).subscribe(function (x) {
                try {
                    doCleanup();
                    cleanup = new Rx.CompositeDisposable();
                    if (x.cmd != null) {
                        if (!wx.isCommand(x.cmd))
                            internal.throwError("Command-Binding only supports binding to a command!");
                        el.disabled = !x.cmd.canExecute(x.param);
                        cleanup.add(x.cmd.canExecuteObservable.subscribe(function (canExecute) {
                            el.disabled = !canExecute;
                        }));
                        cleanup.add(Rx.Observable.fromEvent(el, "click").subscribe(function (e) {
                            x.cmd.execute(x.param);
                            if (isAnchor && e.type === "click") {
                                e.preventDefault();
                            }
                        }));
                    }
                }
                catch (e) {
                    wx.app.defaultExceptionHandler.onNext(e);
                }
            }));
            state.cleanup.add(Rx.Disposable.create(function () {
                node = null;
                options = null;
                ctx = null;
                state = null;
                el = null;
                doCleanup();
            }));
        };
        CommandBinding.prototype.configure = function (options) {
        };
        return CommandBinding;
    })();
    var internal;
    (function (internal) {
        internal.commandBindingConstructor = CommandBinding;
    })(internal = wx.internal || (wx.internal = {}));
})(wx || (wx = {}));
var wx;
(function (wx) {
    "use strict";
    var ModuleBinding = (function () {
        function ModuleBinding(domManager) {
            this.priority = 100;
            this.controlsDescendants = true;
            this.domManager = domManager;
        }
        ModuleBinding.prototype.applyBinding = function (node, options, ctx, state, module) {
            if (node.nodeType !== 1)
                internal.throwError("module-binding only operates on elements!");
            if (options == null)
                internal.throwError("invalid binding-options!");
            var el = node;
            var self = this;
            var exp = this.domManager.compileBindingOptions(options, module);
            var obs = this.domManager.expressionToObservable(exp, ctx);
            var initialApply = true;
            var cleanup;
            function doCleanup() {
                if (cleanup) {
                    cleanup.dispose();
                    cleanup = null;
                }
            }
            var template = new Array();
            state.cleanup.add(obs.subscribe(function (x) {
                try {
                    doCleanup();
                    cleanup = new Rx.CompositeDisposable();
                    var value = wx.unwrapProperty(x);
                    var moduleNames;
                    var disp = undefined;
                    if (value) {
                        value = value.trim();
                        moduleNames = value.split(" ").filter(function (x) { return x; });
                    }
                    if (moduleNames.length > 0) {
                        var observables = moduleNames.map(function (x) { return wx.loadModule(x); });
                        disp = Rx.Observable.combineLatest(observables, function (_) { return wx.args2Array(arguments); }).subscribe(function (modules) {
                            var moduleName = (module || wx.app).name + "+" + moduleNames.join("+");
                            var merged = new internal.moduleConstructor(moduleName);
                            merged.merge(module || wx.app);
                            modules.forEach(function (x) { return merged.merge(x); });
                            self.applyValue(el, merged, template, ctx, state, initialApply);
                            initialApply = false;
                        });
                        if (disp != null)
                            cleanup.add(disp);
                    }
                }
                catch (e) {
                    wx.app.defaultExceptionHandler.onNext(e);
                }
            }));
            state.cleanup.add(Rx.Disposable.create(function () {
                node = null;
                options = null;
                ctx = null;
                state = null;
                obs = null;
                self = null;
            }));
        };
        ModuleBinding.prototype.configure = function (options) {
        };
        ModuleBinding.prototype.applyValue = function (el, module, template, ctx, state, initialApply) {
            var i;
            if (initialApply) {
                for (i = 0; i < el.childNodes.length; i++) {
                    template.push(el.childNodes[i].cloneNode(true));
                }
            }
            state.module = module;
            this.domManager.cleanDescendants(el);
            while (el.firstChild) {
                el.removeChild(el.firstChild);
            }
            for (i = 0; i < template.length; i++) {
                var node = template[i].cloneNode(true);
                el.appendChild(node);
            }
            this.domManager.applyBindingsToDescendants(ctx, el);
        };
        return ModuleBinding;
    })();
    var internal;
    (function (internal) {
        internal.moduleBindingConstructor = ModuleBinding;
    })(internal = wx.internal || (wx.internal = {}));
})(wx || (wx = {}));
var wx;
(function (wx) {
    "use strict";
    var ComponentBinding = (function () {
        function ComponentBinding(domManager) {
            this.priority = 30;
            this.controlsDescendants = true;
            this.domManager = domManager;
        }
        ComponentBinding.prototype.applyBinding = function (node, options, ctx, state, module) {
            var _this = this;
            if (node.nodeType !== 1)
                internal.throwError("component-binding only operates on elements!");
            if (options == null)
                internal.throwError("invalid binding-options!");
            var el = node;
            var compiled = this.domManager.compileBindingOptions(options, module);
            var opt = compiled;
            var exp;
            var componentNameObservable;
            var componentParams = {};
            var cleanup;
            function doCleanup() {
                if (cleanup) {
                    cleanup.dispose();
                    cleanup = null;
                }
            }
            if (typeof compiled === "function") {
                exp = compiled;
                componentNameObservable = this.domManager.expressionToObservable(exp, ctx);
            }
            else {
                componentNameObservable = this.domManager.expressionToObservable(opt.name, ctx);
                if (opt.params) {
                    if (wx.isFunction(opt.params)) {
                        componentParams = this.domManager.evaluateExpression(opt.params, ctx);
                    }
                    else if (typeof opt.params === "object") {
                        Object.keys(opt.params).forEach(function (x) {
                            componentParams[x] = _this.domManager.evaluateExpression(opt.params[x], ctx);
                        });
                    }
                    else {
                        internal.throwError("invalid component-params");
                    }
                }
            }
            var oldContents = new Array();
            while (el.firstChild) {
                oldContents.push(el.removeChild(el.firstChild));
            }
            state.cleanup.add(componentNameObservable.subscribe(function (componentName) {
                try {
                    doCleanup();
                    cleanup = new Rx.CompositeDisposable();
                    var obs = module.loadComponent(componentName, componentParams);
                    var disp = undefined;
                    if (obs == null)
                        internal.throwError("component '{0}' is not registered with current module-context", componentName);
                    disp = obs.subscribe(function (component) {
                        if (disp != null) {
                            disp.dispose();
                            disp = undefined;
                        }
                        if (component.viewModel) {
                            if (wx.isDisposable(component.viewModel)) {
                                cleanup.add(component.viewModel);
                            }
                        }
                        _this.applyTemplate(component, el, ctx, state, component.template, component.viewModel);
                    });
                    if (disp != null)
                        cleanup.add(disp);
                }
                catch (e) {
                    wx.app.defaultExceptionHandler.onNext(e);
                }
            }));
            state.cleanup.add(Rx.Disposable.create(function () {
                node = null;
                options = null;
                ctx = null;
                state = null;
                oldContents = null;
                compiled = null;
                doCleanup();
            }));
        };
        ComponentBinding.prototype.configure = function (options) {
        };
        ComponentBinding.prototype.applyTemplate = function (component, el, ctx, state, template, vm) {
            while (el.firstChild) {
                this.domManager.cleanNode(el.firstChild);
                el.removeChild(el.firstChild);
            }
            for (var i = 0; i < template.length; i++) {
                var node = template[i].cloneNode(true);
                el.appendChild(node);
            }
            if (vm) {
                state.model = vm;
                ctx = this.domManager.getDataContext(el);
            }
            if (vm && component.preBindingInit && vm.hasOwnProperty(component.preBindingInit)) {
                vm[component.preBindingInit].call(vm, el);
            }
            this.domManager.applyBindingsToDescendants(ctx, el);
            if (vm && component.postBindingInit && vm.hasOwnProperty(component.postBindingInit)) {
                vm[component.postBindingInit].call(vm, el);
            }
        };
        return ComponentBinding;
    })();
    var internal;
    (function (internal) {
        internal.componentBindingConstructor = ComponentBinding;
    })(internal = wx.internal || (wx.internal = {}));
})(wx || (wx = {}));
var wx;
(function (wx) {
    "use strict";
    var EventBinding = (function () {
        function EventBinding(domManager) {
            this.priority = 0;
            this.domManager = domManager;
        }
        EventBinding.prototype.applyBinding = function (node, options, ctx, state, module) {
            var _this = this;
            if (node.nodeType !== 1)
                internal.throwError("event-binding only operates on elements!");
            if (options == null)
                internal.throwError("invalid binding-options!");
            var el = node;
            var tokens = this.domManager.getObjectLiteralTokens(options);
            tokens.forEach(function (token) {
                _this.wireEvent(el, token.value, token.key, ctx, state, module);
            });
            state.cleanup.add(Rx.Disposable.create(function () {
                node = null;
                options = null;
                ctx = null;
                state = null;
                el = null;
            }));
        };
        EventBinding.prototype.configure = function (options) {
        };
        EventBinding.prototype.wireEvent = function (el, value, eventName, ctx, state, module) {
            var exp = this.domManager.compileBindingOptions(value, module);
            var command;
            var commandParameter = undefined;
            var obs = Rx.Observable.fromEvent(el, eventName);
            if (typeof exp === "function") {
                var handler = this.domManager.evaluateExpression(exp, ctx);
                handler = wx.unwrapProperty(handler);
                if (wx.isFunction(handler)) {
                    state.cleanup.add(obs.subscribe(function (e) {
                        handler.apply(ctx.$data, [ctx, e]);
                    }));
                }
                else {
                    if (wx.isCommand(handler)) {
                        command = handler;
                        state.cleanup.add(obs.subscribe(function (_) {
                            command.execute(undefined);
                        }));
                    }
                    else {
                        var observer = handler;
                        state.cleanup.add(obs.subscribe(observer));
                    }
                }
            }
            else if (typeof exp === "object") {
                var opt = exp;
                command = this.domManager.evaluateExpression(opt.command, ctx);
                command = wx.unwrapProperty(command);
                if (exp.hasOwnProperty("parameter"))
                    commandParameter = this.domManager.evaluateExpression(opt.parameter, ctx);
                state.cleanup.add(obs.subscribe(function (_) {
                    command.execute(commandParameter);
                }));
            }
            else {
                internal.throwError("invalid binding options");
            }
        };
        return EventBinding;
    })();
    var internal;
    (function (internal) {
        internal.eventBindingConstructor = EventBinding;
    })(internal = wx.internal || (wx.internal = {}));
})(wx || (wx = {}));
var wx;
(function (wx) {
    var internal;
    (function (internal) {
        "use strict";
        var VirtualChildNodes = (function () {
            function VirtualChildNodes(targetNode, initialSyncToTarget, insertCB, removeCB) {
                this.childNodes = [];
                this.targetNode = targetNode;
                this.insertCB = insertCB;
                this.removeCB = removeCB;
                if (initialSyncToTarget) {
                    for (var i = 0; i < targetNode.childNodes.length; i++) {
                        this.childNodes.push(targetNode.childNodes[i]);
                    }
                }
            }
            VirtualChildNodes.prototype.appendChilds = function (nodes, callbackData) {
                var length = nodes.length;
                var i;
                if (nodes.length > 1)
                    Array.prototype.push.apply(this.childNodes, nodes);
                else
                    this.childNodes.push(nodes[0]);
                for (i = 0; i < length; i++) {
                    this.targetNode.appendChild(nodes[i]);
                }
                if (this.insertCB) {
                    for (i = 0; i < length; i++) {
                        this.insertCB(nodes[i], callbackData);
                    }
                }
            };
            VirtualChildNodes.prototype.insertChilds = function (index, nodes, callbackData) {
                if (index === this.childNodes.length) {
                    this.appendChilds(nodes, callbackData);
                }
                else {
                    var refNode = this.childNodes[index];
                    var length = nodes.length;
                    var i;
                    Array.prototype.splice.apply(this.childNodes, [index, 0].concat(nodes));
                    for (i = 0; i < length; i++) {
                        this.targetNode.insertBefore(nodes[i], refNode);
                    }
                    if (this.insertCB) {
                        for (i = 0; i < length; i++) {
                            this.insertCB(nodes[i], callbackData);
                        }
                    }
                }
            };
            VirtualChildNodes.prototype.removeChilds = function (index, count, keepDom) {
                var node;
                if (count === 0)
                    return [];
                var nodes = this.childNodes.slice(index, index + count);
                this.childNodes.splice(index, count);
                if (!keepDom) {
                    var length = nodes.length;
                    for (var i = 0; i < length; i++) {
                        node = nodes[i];
                        if (this.removeCB)
                            this.removeCB(node);
                        this.targetNode.removeChild(node);
                    }
                }
                return nodes;
            };
            VirtualChildNodes.prototype.clear = function () {
                var length = this.childNodes.length;
                var node;
                for (var i = 0; i < length; i++) {
                    node = this.childNodes[i];
                    if (this.removeCB)
                        this.removeCB(node);
                    this.targetNode.removeChild(node);
                }
                this.childNodes = [];
            };
            return VirtualChildNodes;
        })();
        internal.VirtualChildNodes = VirtualChildNodes;
    })(internal = wx.internal || (wx.internal = {}));
})(wx || (wx = {}));
var wx;
(function (wx) {
    "use strict";
    var RefCountDisposeWrapper = (function () {
        function RefCountDisposeWrapper(inner, initialRefCount) {
            if (initialRefCount === void 0) { initialRefCount = 1; }
            this.inner = inner;
            this.refCount = initialRefCount;
        }
        RefCountDisposeWrapper.prototype.addRef = function () {
            this.refCount++;
        };
        RefCountDisposeWrapper.prototype.release = function () {
            if (--this.refCount === 0) {
                this.inner.dispose();
                this.inner = null;
            }
            return this.refCount;
        };
        RefCountDisposeWrapper.prototype.dispose = function () {
            this.release();
        };
        return RefCountDisposeWrapper;
    })();
    wx.RefCountDisposeWrapper = RefCountDisposeWrapper;
})(wx || (wx = {}));
var wx;
(function (wx) {
    "use strict";
    var ForEachBinding = (function () {
        function ForEachBinding(domManager) {
            this.priority = 40;
            this.controlsDescendants = true;
            this.domManager = domManager;
            domManager.registerDataContextExtension(function (node, ctx) {
                var state = domManager.getNodeState(node);
                ctx.$index = state.index;
            });
        }
        ForEachBinding.prototype.applyBinding = function (node, options, ctx, state, module) {
            if (node.nodeType !== 1)
                internal.throwError("forEach binding only operates on elements!");
            if (options == null)
                internal.throwError("** invalid binding options!");
            var compiled = this.domManager.compileBindingOptions(options, module);
            var el = node;
            var self = this;
            var initialApply = true;
            var cleanup = null;
            var hooks;
            var exp;
            var setProxyFunc;
            var animations = {};
            if (typeof compiled === "object" && compiled.hasOwnProperty("data")) {
                var opt = compiled;
                exp = opt.data;
                if (opt.itemEnter) {
                    animations.itemEnter = this.domManager.evaluateExpression(opt.itemEnter, ctx);
                    if (typeof animations.itemEnter === "string") {
                        animations.itemEnter = module.animation(animations.itemEnter);
                    }
                }
                if (opt.itemLeave) {
                    animations.itemLeave = this.domManager.evaluateExpression(opt.itemLeave, ctx);
                    if (typeof animations.itemLeave === "string") {
                        animations.itemLeave = module.animation(animations.itemLeave);
                    }
                }
                if (opt.hooks) {
                    hooks = this.domManager.evaluateExpression(opt.hooks, ctx);
                }
                if (typeof hooks === "string")
                    hooks = wx.injector.get(hooks);
                if (opt['debug']) {
                    if (opt['debug']['setProxyFunc']) {
                        setProxyFunc = this.domManager.evaluateExpression(opt['debug']['setProxyFunc'], ctx);
                    }
                }
            }
            else {
                exp = compiled;
            }
            var obs = this.domManager.expressionToObservable(exp, ctx);
            state.cleanup.add(Rx.Disposable.create(function () {
                if (cleanup) {
                    cleanup.dispose();
                    cleanup = null;
                }
            }));
            var template = new Array();
            state.cleanup.add(obs.subscribe(function (x) {
                try {
                    if (cleanup) {
                        cleanup.dispose();
                    }
                    cleanup = new Rx.CompositeDisposable();
                    self.applyValue(el, x, hooks, animations, template, ctx, initialApply, cleanup, setProxyFunc);
                    initialApply = false;
                }
                catch (e) {
                    wx.app.defaultExceptionHandler.onNext(e);
                }
            }));
            state.cleanup.add(Rx.Disposable.create(function () {
                node = null;
                options = null;
                ctx = null;
                state = null;
                obs = null;
                el = null;
                self = null;
                template = null;
                hooks = null;
            }));
        };
        ForEachBinding.prototype.configure = function (options) {
        };
        ForEachBinding.prototype.createIndexPropertyForNode = function (proxy, child, startIndex, trigger, templateLength) {
            return Rx.Observable.defer(function () {
                return Rx.Observable.create(function (obs) {
                    return trigger.subscribe(function (_) {
                        var index = proxy.childNodes.indexOf(child);
                        index /= templateLength;
                        obs.onNext(index);
                    });
                });
            }).toProperty(startIndex);
        };
        ForEachBinding.prototype.appendAllRows = function (proxy, list, ctx, template, hooks, animations, indexTrigger, isInitial) {
            var length = list.length();
            for (var i = 0; i < length; i++) {
                this.appendRow(proxy, i, list.get(i), ctx, template, hooks, animations, indexTrigger, isInitial);
            }
        };
        ForEachBinding.prototype.appendRow = function (proxy, index, item, ctx, template, hooks, animations, indexTrigger, isInitial) {
            var nodes = wx.cloneNodeArray(template);
            var _index = index;
            var enterAnimation = animations.itemEnter;
            var cbData = {
                item: item
            };
            if (indexTrigger) {
                _index = this.createIndexPropertyForNode(proxy, nodes[0], index, indexTrigger, template.length);
                cbData.indexDisp = new wx.RefCountDisposeWrapper(_index, 0);
            }
            cbData.index = _index;
            if (enterAnimation != null)
                enterAnimation.prepare(nodes);
            proxy.appendChilds(nodes, cbData);
            if (hooks) {
                if (hooks.afterRender)
                    hooks.afterRender(nodes, item);
                if (!isInitial && hooks.afterAdd)
                    hooks.afterAdd(nodes, item, index);
            }
            if (enterAnimation) {
                var disp = enterAnimation.run(nodes).continueWith(function () { return enterAnimation.complete(nodes); }).subscribe(function (x) {
                    if (disp != null)
                        disp.dispose();
                });
            }
        };
        ForEachBinding.prototype.insertRow = function (proxy, index, item, ctx, template, hooks, animations, indexTrigger) {
            var templateLength = template.length;
            var enterAnimation = animations.itemEnter;
            var nodes = wx.cloneNodeArray(template);
            var _index = this.createIndexPropertyForNode(proxy, nodes[0], index, indexTrigger, template.length);
            if (enterAnimation != null)
                enterAnimation.prepare(nodes);
            proxy.insertChilds(index * templateLength, nodes, {
                index: _index,
                item: item,
                indexDisp: new wx.RefCountDisposeWrapper(_index, 0)
            });
            if (hooks) {
                if (hooks.afterRender)
                    hooks.afterRender(nodes, item);
                if (hooks.afterAdd)
                    hooks.afterAdd(nodes, item, index);
            }
            if (enterAnimation) {
                var disp = enterAnimation.run(nodes).continueWith(function () { return enterAnimation.complete(nodes); }).subscribe(function (x) {
                    if (disp != null)
                        disp.dispose();
                });
            }
        };
        ForEachBinding.prototype.removeRow = function (proxy, index, item, template, hooks, animations) {
            var templateLength = template.length;
            var el = proxy.targetNode;
            var nodes = proxy.removeChilds(index * templateLength, templateLength, true);
            var leaveAnimation = animations.itemLeave;
            function removeNodes() {
                for (var i = 0; i < templateLength; i++) {
                    el.removeChild(nodes[i]);
                }
            }
            if (hooks && hooks.beforeRemove) {
                hooks.beforeRemove(nodes, item, index);
            }
            else {
                if (leaveAnimation != null) {
                    leaveAnimation.prepare(nodes);
                    var disp = leaveAnimation.run(nodes).continueWith(function () { return leaveAnimation.complete(nodes); }).continueWith(removeNodes).subscribe(function (x) {
                        if (disp != null)
                            disp.dispose();
                    });
                }
                else {
                    removeNodes();
                }
            }
        };
        ForEachBinding.prototype.moveRow = function (proxy, from, to, item, template, hooks, animations, indexTrigger) {
            var templateLength = template.length;
            var el = proxy.targetNode;
            var nodes = proxy.removeChilds(from * templateLength, templateLength, true);
            var leaveAnimation = animations.itemLeave;
            var enterAnimation = animations.itemEnter;
            var combined = [];
            var obs;
            var self = this;
            if (hooks && hooks.beforeMove) {
                hooks.beforeMove(nodes, item, from);
            }
            function removeNodes() {
                for (var i = 0; i < templateLength; i++) {
                    el.removeChild(nodes[i]);
                }
            }
            function createRow() {
                nodes = wx.cloneNodeArray(template);
                var _index = self.createIndexPropertyForNode(proxy, nodes[0], from, indexTrigger, template.length);
                if (enterAnimation != null)
                    enterAnimation.prepare(nodes);
                proxy.insertChilds(templateLength * to, nodes, {
                    index: _index,
                    item: item,
                    indexDisp: new wx.RefCountDisposeWrapper(_index, 0)
                });
                if (hooks && hooks.afterMove) {
                    hooks.afterMove(nodes, item, from);
                }
            }
            if (leaveAnimation) {
                leaveAnimation.prepare(nodes);
                obs = leaveAnimation.run(nodes).continueWith(function () { return leaveAnimation.complete(nodes); }).continueWith(removeNodes);
            }
            else {
                obs = Rx.Observable.startDeferred(removeNodes);
            }
            combined.push(obs);
            obs = Rx.Observable.startDeferred(createRow);
            if (enterAnimation) {
                obs = obs.continueWith(enterAnimation.run(nodes)).continueWith(function () { return enterAnimation.complete(nodes); });
            }
            combined.push(obs);
            if (combined.length > 1)
                obs = Rx.Observable.combineLatest(combined, wx.noop).take(1);
            else if (combined.length === 1)
                obs = combined[0].take(1);
            var disp = obs.subscribe(function (x) {
                if (disp != null)
                    disp.dispose();
            });
        };
        ForEachBinding.prototype.rebindRow = function (proxy, index, item, template, indexTrigger) {
            var templateLength = template.length;
            var _index = this.createIndexPropertyForNode(proxy, proxy.childNodes[(index * templateLength)], index, indexTrigger, template.length);
            var indexDisp = new wx.RefCountDisposeWrapper(_index, 0);
            for (var i = 0; i < template.length; i++) {
                var node = proxy.childNodes[(index * templateLength) + i];
                if (node.nodeType === 1) {
                    this.domManager.cleanNode(node);
                    var state = this.domManager.createNodeState(item);
                    state.index = _index;
                    indexDisp.addRef();
                    state.cleanup.add(indexDisp);
                    this.domManager.setNodeState(node, state);
                    this.domManager.applyBindings(item, node);
                }
            }
        };
        ForEachBinding.prototype.observeList = function (proxy, ctx, template, cleanup, list, hooks, animations, indexTrigger) {
            var _this = this;
            var i;
            var length;
            cleanup.add(indexTrigger);
            this.appendAllRows(proxy, list, ctx, template, hooks, animations, indexTrigger, true);
            cleanup.add(list.itemsAdded.subscribe(function (e) {
                length = e.items.length;
                if (e.from === list.length()) {
                    for (i = 0; i < length; i++) {
                        _this.appendRow(proxy, i + e.from, e.items[i], ctx, template, hooks, animations, indexTrigger, false);
                    }
                }
                else {
                    for (i = 0; i < e.items.length; i++) {
                        _this.insertRow(proxy, i + e.from, e.items[i], ctx, template, hooks, animations, indexTrigger);
                    }
                }
                indexTrigger.onNext(true);
            }));
            cleanup.add(list.itemsRemoved.subscribe(function (e) {
                length = e.items.length;
                for (i = 0; i < length; i++) {
                    _this.removeRow(proxy, i + e.from, e.items[i], template, hooks, animations);
                }
                indexTrigger.onNext(true);
            }));
            cleanup.add(list.itemsMoved.subscribe(function (e) {
                _this.moveRow(proxy, e.from, e.to, e.items[0], template, hooks, animations, indexTrigger);
                indexTrigger.onNext(true);
            }));
            cleanup.add(list.itemReplaced.subscribe(function (e) {
                _this.rebindRow(proxy, e.from, e.items[0], template, indexTrigger);
                indexTrigger.onNext(true);
            }));
            cleanup.add(list.shouldReset.subscribe(function (e) {
                proxy.clear();
                _this.appendAllRows(proxy, list, ctx, template, hooks, animations, indexTrigger, false);
                indexTrigger.onNext(true);
            }));
        };
        ForEachBinding.prototype.applyValue = function (el, value, hooks, animations, template, ctx, initialApply, cleanup, setProxyFunc) {
            var i, length;
            if (initialApply) {
                length = el.childNodes.length;
                for (i = 0; i < length; i++) {
                    template.push(el.childNodes[i].cloneNode(true));
                }
            }
            while (el.firstChild) {
                el.removeChild(el.firstChild);
            }
            if (template.length === 0)
                return;
            var proxy;
            var self = this;
            var recalcIndextrigger;
            function nodeInsertCB(node, callbackData) {
                var item = callbackData.item;
                var index = callbackData.index;
                var indexDisp = callbackData.indexDisp;
                if (node.nodeType === 1) {
                    var state = (self.domManager.getNodeState(node) || self.domManager.createNodeState());
                    state.model = item;
                    state.index = index;
                    self.domManager.setNodeState(node, state);
                    if (recalcIndextrigger != null && indexDisp != null) {
                        indexDisp.addRef();
                        state.cleanup.add(indexDisp);
                    }
                    self.domManager.applyBindings(item, node);
                }
            }
            function nodeRemoveCB(node) {
                if (node.nodeType === 1) {
                    self.domManager.cleanNode(node);
                }
            }
            proxy = new internal.VirtualChildNodes(el, false, nodeInsertCB, nodeRemoveCB);
            if (setProxyFunc)
                setProxyFunc(proxy);
            cleanup.add(Rx.Disposable.create(function () {
                proxy = null;
            }));
            if (Array.isArray(value)) {
                var arr = value;
                length = arr.length;
                for (i = 0; i < length; i++) {
                    this.appendRow(proxy, i, arr[i], ctx, template, hooks, animations, undefined, true);
                }
            }
            else if (wx.isList(value)) {
                var list = value;
                recalcIndextrigger = new Rx.Subject();
                this.observeList(proxy, ctx, template, cleanup, list, hooks, animations, recalcIndextrigger);
            }
        };
        return ForEachBinding;
    })();
    var internal;
    (function (internal) {
        internal.forEachBindingConstructor = ForEachBinding;
    })(internal = wx.internal || (wx.internal = {}));
})(wx || (wx = {}));
var wx;
(function (wx) {
    "use strict";
    var HasFocusBinding = (function () {
        function HasFocusBinding(domManager) {
            this.priority = -1;
            this.domManager = domManager;
        }
        HasFocusBinding.prototype.applyBinding = function (node, options, ctx, state, module) {
            var _this = this;
            if (node.nodeType !== 1)
                internal.throwError("hasFocus-binding only operates on elements!");
            if (options == null)
                internal.throwError("invalid binding-options!");
            var el = node;
            var prop;
            var cleanup;
            var compiled = this.domManager.compileBindingOptions(options, module);
            var exp;
            var delay = 0;
            if (typeof compiled === "object" && compiled.hasOwnProperty("property")) {
                var opt = compiled;
                exp = opt.property;
                delay = this.domManager.evaluateExpression(opt.delay, ctx);
                if (typeof delay === "boolean")
                    delay = delay ? 1 : 0;
            }
            else {
                exp = compiled;
            }
            function doCleanup() {
                if (cleanup) {
                    cleanup.dispose();
                    cleanup = null;
                }
            }
            function handleElementFocusChange(isFocused) {
                var ownerDoc = el.ownerDocument;
                if ("activeElement" in ownerDoc) {
                    var active;
                    try {
                        active = ownerDoc.activeElement;
                    }
                    catch (e) {
                        active = ownerDoc.body;
                    }
                    isFocused = (active === el);
                }
                prop(isFocused);
            }
            function updateElement(value) {
                if (value) {
                    if (delay === 0 && el.style.display !== 'none') {
                        el.focus();
                    }
                    else {
                        Rx.Observable.timer(delay).subscribe(function () {
                            el.focus();
                        });
                    }
                }
                else {
                    el.blur();
                }
            }
            state.cleanup.add(this.domManager.expressionToObservable(exp, ctx).subscribe(function (model) {
                try {
                    if (!wx.isProperty(model)) {
                        updateElement(model);
                    }
                    else {
                        doCleanup();
                        cleanup = new Rx.CompositeDisposable();
                        prop = model;
                        cleanup.add(prop.changed.subscribe(function (x) {
                            updateElement(x);
                        }));
                        updateElement(prop());
                        if (!prop.source) {
                            cleanup.add(Rx.Observable.merge(_this.getFocusEventObservables(el)).subscribe(function (hasFocus) {
                                handleElementFocusChange(hasFocus);
                            }));
                        }
                    }
                }
                catch (e) {
                    wx.app.defaultExceptionHandler.onNext(e);
                }
            }));
            state.cleanup.add(Rx.Disposable.create(function () {
                node = null;
                options = null;
                ctx = null;
                state = null;
                el = null;
                doCleanup();
            }));
        };
        HasFocusBinding.prototype.configure = function (options) {
        };
        HasFocusBinding.prototype.getFocusEventObservables = function (el) {
            var result = [];
            result.push(Rx.Observable.fromEvent(el, 'focus').select(function (x) { return true; }));
            result.push(Rx.Observable.fromEvent(el, 'focusin').select(function (x) { return true; }));
            result.push(Rx.Observable.fromEvent(el, 'blur').select(function (x) { return false; }));
            result.push(Rx.Observable.fromEvent(el, 'focusout').select(function (x) { return false; }));
            return result;
        };
        return HasFocusBinding;
    })();
    var internal;
    (function (internal) {
        internal.hasFocusBindingConstructor = HasFocusBinding;
    })(internal = wx.internal || (wx.internal = {}));
})(wx || (wx = {}));
var wx;
(function (wx) {
    "use strict";
    var IfBinding = (function () {
        function IfBinding(domManager) {
            this.priority = 50;
            this.controlsDescendants = true;
            this.inverse = false;
            this.domManager = domManager;
        }
        IfBinding.prototype.applyBinding = function (node, options, ctx, state, module) {
            if (node.nodeType !== 1)
                internal.throwError("if-binding only operates on elements!");
            if (options == null)
                internal.throwError("invalid binding-options!");
            var compiled = this.domManager.compileBindingOptions(options, module);
            var el = node;
            var self = this;
            var initialApply = true;
            var exp;
            var animations = {};
            var cleanup;
            function doCleanup() {
                if (cleanup) {
                    cleanup.dispose();
                    cleanup = null;
                }
            }
            if (typeof compiled === "object") {
                var opt = compiled;
                exp = opt.condition;
                if (opt.enter) {
                    animations.enter = this.domManager.evaluateExpression(opt.enter, ctx);
                    if (typeof animations.enter === "string") {
                        animations.enter = module.animation(animations.enter);
                    }
                }
                if (opt.leave) {
                    animations.leave = this.domManager.evaluateExpression(opt.leave, ctx);
                    if (typeof animations.leave === "string") {
                        animations.leave = module.animation(animations.leave);
                    }
                }
            }
            else {
                exp = compiled;
            }
            var obs = this.domManager.expressionToObservable(exp, ctx);
            var template = new Array();
            state.cleanup.add(obs.subscribe(function (x) {
                try {
                    doCleanup();
                    cleanup = new Rx.CompositeDisposable();
                    cleanup.add(self.applyValue(el, wx.unwrapProperty(x), template, ctx, animations, initialApply));
                    initialApply = false;
                }
                catch (e) {
                    wx.app.defaultExceptionHandler.onNext(e);
                }
            }));
            state.cleanup.add(Rx.Disposable.create(function () {
                node = null;
                options = null;
                ctx = null;
                state = null;
                obs = null;
                el = null;
                self = null;
                template = null;
            }));
        };
        IfBinding.prototype.configure = function (options) {
        };
        IfBinding.prototype.applyValue = function (el, value, template, ctx, animations, initialApply) {
            var leaveAnimation = animations.leave;
            var enterAnimation = animations.enter;
            var i;
            var self = this;
            var obs = undefined;
            if (initialApply) {
                for (i = 0; i < el.childNodes.length; i++) {
                    template.push(el.childNodes[i].cloneNode(true));
                }
                while (el.firstChild) {
                    el.removeChild(el.firstChild);
                }
            }
            var oldElements = wx.nodeChildrenToArray(el);
            value = this.inverse ? !value : value;
            function removeOldElements() {
                oldElements.forEach(function (x) {
                    self.domManager.cleanNode(x);
                    el.removeChild(x);
                });
            }
            if (!value) {
                if (oldElements.length > 0) {
                    if (leaveAnimation) {
                        leaveAnimation.prepare(oldElements);
                        obs = leaveAnimation.run(oldElements).continueWith(function () { return leaveAnimation.complete(oldElements); }).continueWith(removeOldElements);
                    }
                    else {
                        removeOldElements();
                    }
                }
            }
            else {
                var nodes = template.map(function (x) { return x.cloneNode(true); });
                if (enterAnimation)
                    enterAnimation.prepare(nodes);
                for (i = 0; i < template.length; i++) {
                    el.appendChild(nodes[i]);
                }
                this.domManager.applyBindingsToDescendants(ctx, el);
                if (enterAnimation) {
                    obs = enterAnimation.run(nodes).continueWith(function () { return enterAnimation.complete(nodes); });
                }
            }
            return obs ? (obs.subscribe() || Rx.Disposable.empty) : Rx.Disposable.empty;
        };
        return IfBinding;
    })();
    var NotIfBinding = (function (_super) {
        __extends(NotIfBinding, _super);
        function NotIfBinding(domManager) {
            _super.call(this, domManager);
            this.inverse = true;
        }
        return NotIfBinding;
    })(IfBinding);
    var internal;
    (function (internal) {
        internal.ifBindingConstructor = IfBinding;
        internal.notifBindingConstructor = NotIfBinding;
    })(internal = wx.internal || (wx.internal = {}));
})(wx || (wx = {}));
var wx;
(function (wx) {
    "use strict";
    var keysByCode = {
        8: 'backspace',
        9: 'tab',
        13: 'enter',
        27: 'esc',
        32: 'space',
        33: 'pageup',
        34: 'pagedown',
        35: 'end',
        36: 'home',
        37: 'left',
        38: 'up',
        39: 'right',
        40: 'down',
        45: 'insert',
        46: 'delete'
    };
    var KeyPressBinding = (function () {
        function KeyPressBinding(domManager) {
            this.priority = 0;
            this.domManager = domManager;
        }
        KeyPressBinding.prototype.applyBinding = function (node, options, ctx, state, module) {
            var _this = this;
            if (node.nodeType !== 1)
                internal.throwError("keyPress-binding only operates on elements!");
            if (options == null)
                internal.throwError("invalid binding-options!");
            var el = node;
            var tokens = this.domManager.getObjectLiteralTokens(options);
            var obs = Rx.Observable.fromEvent(el, "keydown").where(function (x) { return !x.repeat; }).publish().refCount();
            tokens.forEach(function (token) {
                var keyDesc = token.key;
                var combination, combinations = [];
                keyDesc.split(' ').forEach(function (variation) {
                    combination = {
                        expression: keyDesc,
                        keys: {}
                    };
                    variation.split('-').forEach(function (value) {
                        combination.keys[value.trim()] = true;
                    });
                    combinations.push(combination);
                });
                _this.wireKey(token.value, obs, combinations, ctx, state, module);
            });
            state.cleanup.add(Rx.Disposable.create(function () {
                node = null;
                options = null;
                ctx = null;
                state = null;
                el = null;
            }));
        };
        KeyPressBinding.prototype.configure = function (options) {
        };
        KeyPressBinding.prototype.testCombination = function (combination, event) {
            var metaPressed = !!(event.metaKey && !event.ctrlKey);
            var altPressed = !!event.altKey;
            var ctrlPressed = !!event.ctrlKey;
            var shiftPressed = !!event.shiftKey;
            var keyCode = event.keyCode;
            var metaRequired = !!combination.keys.meta;
            var altRequired = !!combination.keys.alt;
            var ctrlRequired = !!combination.keys.ctrl;
            var shiftRequired = !!combination.keys.shift;
            if ((!shiftPressed || shiftRequired) && keyCode >= 65 && keyCode <= 90)
                keyCode = keyCode + 32;
            var mainKeyPressed = combination.keys[keysByCode[keyCode]] || combination.keys[keyCode.toString()] || combination.keys[String.fromCharCode(keyCode)];
            return (mainKeyPressed && (metaRequired === metaPressed) && (altRequired === altPressed) && (ctrlRequired === ctrlPressed) && (shiftRequired === shiftPressed));
        };
        KeyPressBinding.prototype.testCombinations = function (combinations, event) {
            for (var i = 0; i < combinations.length; i++) {
                if (this.testCombination(combinations[i], event))
                    return true;
            }
            return false;
        };
        KeyPressBinding.prototype.wireKey = function (value, obs, combinations, ctx, state, module) {
            var _this = this;
            var exp = this.domManager.compileBindingOptions(value, module);
            var command;
            var commandParameter = undefined;
            if (typeof exp === "function") {
                var handler = this.domManager.evaluateExpression(exp, ctx);
                handler = wx.unwrapProperty(handler);
                if (!wx.isCommand(handler)) {
                    state.cleanup.add(obs.where(function (e) { return _this.testCombinations(combinations, e); }).subscribe(function (e) {
                        handler.apply(ctx.$data, [ctx]);
                        e.preventDefault();
                    }));
                }
                else {
                    command = handler;
                    state.cleanup.add(obs.where(function (e) { return _this.testCombinations(combinations, e); }).subscribe(function (e) {
                        command.execute(undefined);
                        e.preventDefault();
                    }));
                }
            }
            else if (typeof exp === "object") {
                command = this.domManager.evaluateExpression(exp.command, ctx);
                command = wx.unwrapProperty(command);
                if (exp.hasOwnProperty("parameter"))
                    commandParameter = this.domManager.evaluateExpression(exp.parameter, ctx);
                state.cleanup.add(obs.where(function (e) { return _this.testCombinations(combinations, e); }).subscribe(function (e) {
                    command.execute(commandParameter);
                    e.preventDefault();
                }));
            }
            else {
                internal.throwError("invalid binding options");
            }
        };
        return KeyPressBinding;
    })();
    var internal;
    (function (internal) {
        internal.keyPressBindingConstructor = KeyPressBinding;
    })(internal = wx.internal || (wx.internal = {}));
})(wx || (wx = {}));
var wx;
(function (wx) {
    "use strict";
    var MultiOneWayChangeBindingBase = (function () {
        function MultiOneWayChangeBindingBase(domManager, supportsDynamicValues) {
            if (supportsDynamicValues === void 0) { supportsDynamicValues = false; }
            this.priority = 0;
            this.supportsDynamicValues = false;
            this.domManager = domManager;
            this.supportsDynamicValues = supportsDynamicValues;
        }
        MultiOneWayChangeBindingBase.prototype.applyBinding = function (node, options, ctx, state, module) {
            if (node.nodeType !== 1)
                internal.throwError("binding only operates on elements!");
            var compiled = this.domManager.compileBindingOptions(options, module);
            if (compiled == null || (typeof compiled !== "object" && !this.supportsDynamicValues))
                internal.throwError("invalid binding-options!");
            var el = node;
            var observables = new Array();
            var obs;
            var exp;
            var keys = Object.keys(compiled);
            var i;
            var key;
            if (typeof compiled === "function") {
                exp = compiled;
                obs = this.domManager.expressionToObservable(exp, ctx);
                observables.push(["", obs]);
            }
            else {
                for (i = 0; i < keys.length; i++) {
                    key = keys[i];
                    var value = compiled[key];
                    exp = value;
                    obs = this.domManager.expressionToObservable(exp, ctx);
                    observables.push([key, obs]);
                }
            }
            for (i = 0; i < observables.length; i++) {
                key = observables[i][0];
                obs = observables[i][1];
                this.subscribe(el, obs, key, state);
            }
            state.cleanup.add(Rx.Disposable.create(function () {
                node = null;
                options = null;
                ctx = null;
                state = null;
                el = null;
                keys = null;
                observables = null;
            }));
        };
        MultiOneWayChangeBindingBase.prototype.configure = function (options) {
        };
        MultiOneWayChangeBindingBase.prototype.subscribe = function (el, obs, key, state) {
            var _this = this;
            state.cleanup.add(obs.subscribe(function (x) {
                try {
                    _this.applyValue(el, wx.unwrapProperty(x), key);
                }
                catch (e) {
                    wx.app.defaultExceptionHandler.onNext(e);
                }
            }));
        };
        MultiOneWayChangeBindingBase.prototype.applyValue = function (el, key, value) {
            internal.throwError("you need to override this method!");
        };
        return MultiOneWayChangeBindingBase;
    })();
    var CssBinding = (function (_super) {
        __extends(CssBinding, _super);
        function CssBinding(domManager) {
            _super.call(this, domManager, true);
        }
        CssBinding.prototype.applyValue = function (el, value, key) {
            var classes;
            if (key !== "") {
                classes = key.split(/\s+/).map(function (x) { return x.trim(); }).filter(function (x) { return x; });
                if (classes.length) {
                    wx.toggleCssClass.apply(null, [el, !!value].concat(classes));
                }
            }
            else {
                var state = this.domManager.getNodeState(el);
                if (state.cssBindingPreviousDynamicClasses != null) {
                    wx.toggleCssClass.apply(null, [el, false].concat(state.cssBindingPreviousDynamicClasses));
                    state.cssBindingPreviousDynamicClasses = null;
                }
                if (value) {
                    classes = value.split(/\s+/).map(function (x) { return x.trim(); }).filter(function (x) { return x; });
                    if (classes.length) {
                        wx.toggleCssClass.apply(null, [el, true].concat(classes));
                        state.cssBindingPreviousDynamicClasses = classes;
                    }
                }
            }
        };
        return CssBinding;
    })(MultiOneWayChangeBindingBase);
    var AttrBinding = (function (_super) {
        __extends(AttrBinding, _super);
        function AttrBinding(domManager) {
            _super.call(this, domManager);
            this.priority = 5;
        }
        AttrBinding.prototype.applyValue = function (el, value, key) {
            var toRemove = (value === false) || (value === null) || (value === undefined);
            if (toRemove)
                el.removeAttribute(key);
            else {
                el.setAttribute(key, value.toString());
            }
        };
        return AttrBinding;
    })(MultiOneWayChangeBindingBase);
    var StyleBinding = (function (_super) {
        __extends(StyleBinding, _super);
        function StyleBinding(domManager) {
            _super.call(this, domManager);
        }
        StyleBinding.prototype.applyValue = function (el, value, key) {
            if (value === null || value === undefined || value === false) {
                value = "";
            }
            el.style[key] = value;
        };
        return StyleBinding;
    })(MultiOneWayChangeBindingBase);
    var internal;
    (function (internal) {
        internal.cssBindingConstructor = CssBinding;
        internal.attrBindingConstructor = AttrBinding;
        internal.styleBindingConstructor = StyleBinding;
    })(internal = wx.internal || (wx.internal = {}));
})(wx || (wx = {}));
var wx;
(function (wx) {
    "use strict";
    var impls = new Array();
    var RadioSingleSelectionImpl = (function () {
        function RadioSingleSelectionImpl(domManager) {
            this.domManager = domManager;
        }
        RadioSingleSelectionImpl.prototype.supports = function (el, model) {
            return (el.tagName.toLowerCase() === 'input' && el.getAttribute("type") === 'radio') && !wx.isList(model);
        };
        RadioSingleSelectionImpl.prototype.observeElement = function (el) {
            return Rx.Observable.merge(Rx.Observable.fromEvent(el, 'click'), Rx.Observable.fromEvent(el, 'change'));
        };
        RadioSingleSelectionImpl.prototype.observeModel = function (model) {
            if (wx.isProperty(model)) {
                var prop = model;
                return prop.changed;
            }
            return Rx.Observable.never();
        };
        RadioSingleSelectionImpl.prototype.updateElement = function (el, model) {
            var input = el;
            input.checked = internal.getNodeValue(input, this.domManager) == wx.unwrapProperty(model);
        };
        RadioSingleSelectionImpl.prototype.updateModel = function (el, model, e) {
            var input = el;
            if (input.checked) {
                model(internal.getNodeValue(input, this.domManager));
            }
        };
        return RadioSingleSelectionImpl;
    })();
    var OptionSingleSelectionImpl = (function () {
        function OptionSingleSelectionImpl(domManager) {
            this.domManager = domManager;
        }
        OptionSingleSelectionImpl.prototype.supports = function (el, model) {
            return el.tagName.toLowerCase() === 'select' && !wx.isList(model);
        };
        OptionSingleSelectionImpl.prototype.observeElement = function (el) {
            return Rx.Observable.fromEvent(el, 'change');
        };
        OptionSingleSelectionImpl.prototype.observeModel = function (model) {
            if (wx.isProperty(model)) {
                var prop = model;
                return prop.changed;
            }
            return Rx.Observable.never();
        };
        OptionSingleSelectionImpl.prototype.updateElement = function (el, model) {
            var select = el;
            var value = wx.unwrapProperty(model);
            var length = select.options.length;
            if (value == null) {
                select.selectedIndex = -1;
            }
            else {
                for (var i = 0; i < length; i++) {
                    var option = select.options[i];
                    if (internal.getNodeValue(option, this.domManager) == value) {
                        select.selectedIndex = i;
                        break;
                    }
                }
            }
        };
        OptionSingleSelectionImpl.prototype.updateModel = function (el, model, e) {
            var select = el;
            var value = select.selectedIndex !== -1 ? internal.getNodeValue(select.options[select.selectedIndex], this.domManager) : undefined;
            model(value);
        };
        return OptionSingleSelectionImpl;
    })();
    var SelectedValueBinding = (function () {
        function SelectedValueBinding(domManager) {
            this.priority = 0;
            this.domManager = domManager;
            impls.push(new RadioSingleSelectionImpl(domManager));
            impls.push(new OptionSingleSelectionImpl(domManager));
        }
        SelectedValueBinding.prototype.applyBinding = function (node, options, ctx, state, module) {
            if (node.nodeType !== 1)
                internal.throwError("selectedValue-binding only operates on elements!");
            if (options == null)
                internal.throwError("invalid binding-options!");
            var el = node;
            var impl;
            var implCleanup;
            var exp = this.domManager.compileBindingOptions(options, module);
            function cleanupImpl() {
                if (implCleanup) {
                    implCleanup.dispose();
                    implCleanup = null;
                }
            }
            state.cleanup.add(this.domManager.expressionToObservable(exp, ctx).subscribe(function (model) {
                try {
                    cleanupImpl();
                    impl = undefined;
                    for (var i = 0; i < impls.length; i++) {
                        if (impls[i].supports(el, model)) {
                            impl = impls[i];
                            break;
                        }
                    }
                    if (!impl)
                        internal.throwError("selectedValue-binding does not support this combination of bound element and model!");
                    implCleanup = new Rx.CompositeDisposable();
                    impl.updateElement(el, model);
                    implCleanup.add(impl.observeModel(model).subscribe(function (x) {
                        try {
                            impl.updateElement(el, model);
                        }
                        catch (e) {
                            wx.app.defaultExceptionHandler.onNext(e);
                        }
                    }));
                    if (wx.isProperty(model)) {
                        implCleanup.add(impl.observeElement(el).subscribe(function (e) {
                            try {
                                impl.updateModel(el, model, e);
                            }
                            catch (e) {
                                wx.app.defaultExceptionHandler.onNext(e);
                            }
                        }));
                    }
                }
                catch (e) {
                    wx.app.defaultExceptionHandler.onNext(e);
                }
            }));
            state.cleanup.add(Rx.Disposable.create(function () {
                node = null;
                options = null;
                ctx = null;
                state = null;
                el = null;
                cleanupImpl();
            }));
        };
        SelectedValueBinding.prototype.configure = function (options) {
        };
        return SelectedValueBinding;
    })();
    var internal;
    (function (internal) {
        internal.selectedValueBindingConstructor = SelectedValueBinding;
    })(internal = wx.internal || (wx.internal = {}));
})(wx || (wx = {}));
var wx;
(function (wx) {
    "use strict";
    var SingleOneWayChangeBindingBase = (function () {
        function SingleOneWayChangeBindingBase(domManager) {
            this.priority = 0;
            this.domManager = domManager;
        }
        SingleOneWayChangeBindingBase.prototype.applyBinding = function (node, options, ctx, state, module) {
            if (node.nodeType !== 1)
                internal.throwError("binding only operates on elements!");
            if (options == null)
                internal.throwError("invalid binding-options!");
            var el = node;
            var self = this;
            var exp = this.domManager.compileBindingOptions(options, module);
            var obs = this.domManager.expressionToObservable(exp, ctx);
            state.cleanup.add(obs.subscribe(function (x) {
                try {
                    self.applyValue(el, wx.unwrapProperty(x));
                }
                catch (e) {
                    wx.app.defaultExceptionHandler.onNext(e);
                }
            }));
            state.cleanup.add(Rx.Disposable.create(function () {
                node = null;
                options = null;
                ctx = null;
                state = null;
                el = null;
                obs = null;
                self = null;
            }));
        };
        SingleOneWayChangeBindingBase.prototype.configure = function (options) {
        };
        SingleOneWayChangeBindingBase.prototype.applyValue = function (el, value) {
            internal.throwError("you need to override this method!");
        };
        return SingleOneWayChangeBindingBase;
    })();
    var TextBinding = (function (_super) {
        __extends(TextBinding, _super);
        function TextBinding(domManager) {
            _super.call(this, domManager);
        }
        TextBinding.prototype.applyValue = function (el, value) {
            if ((value === null) || (value === undefined))
                value = "";
            el.textContent = value;
        };
        return TextBinding;
    })(SingleOneWayChangeBindingBase);
    var VisibleBinding = (function (_super) {
        __extends(VisibleBinding, _super);
        function VisibleBinding(domManager) {
            _super.call(this, domManager);
            this.inverse = false;
            this.inverse = false;
            this.priority = 10;
        }
        VisibleBinding.prototype.configure = function (_options) {
            var options = _options;
            VisibleBinding.useCssClass = options.useCssClass;
            VisibleBinding.hiddenClass = options.hiddenClass;
        };
        VisibleBinding.prototype.applyValue = function (el, value) {
            value = this.inverse ? !value : value;
            if (!VisibleBinding.useCssClass) {
                if (!value) {
                    el.style.display = "none";
                }
                else {
                    el.style.display = "";
                }
            }
            else {
                wx.toggleCssClass(el, !value, VisibleBinding.hiddenClass);
            }
        };
        return VisibleBinding;
    })(SingleOneWayChangeBindingBase);
    var HiddenBinding = (function (_super) {
        __extends(HiddenBinding, _super);
        function HiddenBinding(domManager) {
            _super.call(this, domManager);
            this.inverse = true;
        }
        return HiddenBinding;
    })(VisibleBinding);
    var HtmlBinding = (function (_super) {
        __extends(HtmlBinding, _super);
        function HtmlBinding(domManager) {
            _super.call(this, domManager);
        }
        HtmlBinding.prototype.applyValue = function (el, value) {
            if ((value === null) || (value === undefined))
                value = "";
            el.innerHTML = value;
        };
        return HtmlBinding;
    })(SingleOneWayChangeBindingBase);
    var DisableBinding = (function (_super) {
        __extends(DisableBinding, _super);
        function DisableBinding(domManager) {
            _super.call(this, domManager);
            this.inverse = false;
            this.inverse = false;
        }
        DisableBinding.prototype.applyValue = function (el, value) {
            value = this.inverse ? !value : value;
            el.disabled = value;
        };
        return DisableBinding;
    })(SingleOneWayChangeBindingBase);
    var EnableBinding = (function (_super) {
        __extends(EnableBinding, _super);
        function EnableBinding(domManager) {
            _super.call(this, domManager);
            this.inverse = true;
        }
        return EnableBinding;
    })(DisableBinding);
    var internal;
    (function (internal) {
        internal.textBindingConstructor = TextBinding;
        internal.htmlBindingConstructor = HtmlBinding;
        internal.visibleBindingConstructor = VisibleBinding;
        internal.hiddenBindingConstructor = HiddenBinding;
        internal.disableBindingConstructor = DisableBinding;
        internal.enableBindingConstructor = EnableBinding;
    })(internal = wx.internal || (wx.internal = {}));
})(wx || (wx = {}));
var wx;
(function (wx) {
    "use strict";
    var TextInputBinding = (function () {
        function TextInputBinding(domManager) {
            this.priority = 0;
            this.domManager = domManager;
        }
        TextInputBinding.prototype.applyBinding = function (node, options, ctx, state, module) {
            var _this = this;
            if (node.nodeType !== 1)
                internal.throwError("textInput-binding only operates on elements!");
            if (options == null)
                internal.throwError("invalid binding-options!");
            var el = node;
            var tag = el.tagName.toLowerCase();
            var isTextArea = tag === "textarea";
            if (tag !== 'input' && tag !== 'textarea')
                internal.throwError("textInput-binding can only be applied to input or textarea elements");
            var exp = this.domManager.compileBindingOptions(options, module);
            var prop;
            var propertySubscription;
            var eventSubscription;
            var previousElementValue;
            function updateElement(value) {
                if (value === null || value === undefined) {
                    value = "";
                }
                if (el.value !== value) {
                    previousElementValue = value;
                    el.value = value;
                }
            }
            function doCleanup() {
                if (propertySubscription) {
                    propertySubscription.dispose();
                    propertySubscription = null;
                }
                if (eventSubscription) {
                    eventSubscription.dispose();
                    eventSubscription = null;
                }
            }
            state.cleanup.add(this.domManager.expressionToObservable(exp, ctx).subscribe(function (src) {
                try {
                    if (!wx.isProperty(src)) {
                        updateElement(src);
                    }
                    else {
                        doCleanup();
                        prop = src;
                        propertySubscription = prop.changed.subscribe(function (x) {
                            updateElement(x);
                        });
                        updateElement(prop());
                        if (!prop.source) {
                            var events = _this.getTextInputEventObservables(el, isTextArea);
                            eventSubscription = Rx.Observable.merge(events).subscribe(function (e) {
                                prop(el.value);
                            });
                        }
                    }
                }
                catch (e) {
                    wx.app.defaultExceptionHandler.onNext(e);
                }
            }));
            state.cleanup.add(Rx.Disposable.create(function () {
                node = null;
                options = null;
                ctx = null;
                state = null;
                el = null;
                doCleanup();
            }));
        };
        TextInputBinding.prototype.configure = function (options) {
        };
        TextInputBinding.prototype.getTextInputEventObservables = function (el, isTextArea) {
            var result = [];
            if (wx.env.ie && wx.env.ie.version < 10) {
                if (wx.env.ie.version <= 9) {
                    result.push(wx.env.ie.getSelectionChangeObservable(el).where(function (doc) { return doc.activeElement === el; }));
                    result.push(Rx.Observable.fromEvent(el, 'dragend'));
                    result.push(Rx.Observable.fromEvent(el, 'input'));
                    result.push(Rx.Observable.fromEvent(el, 'propertychange').where(function (e) { return e.propertyName === 'value'; }));
                }
            }
            else {
                result.push(Rx.Observable.fromEvent(el, 'input'));
                if (wx.env.safari && wx.env.safari.version < 5 && isTextArea) {
                    result.push(Rx.Observable.fromEvent(el, 'keydown'));
                    result.push(Rx.Observable.fromEvent(el, 'paste'));
                    result.push(Rx.Observable.fromEvent(el, 'cut'));
                }
                else if (wx.env.opera && wx.env.opera.version < 11) {
                    result.push(Rx.Observable.fromEvent(el, 'keydown'));
                }
                else if (wx.env.firefox && wx.env.firefox.version < 4.0) {
                    result.push(Rx.Observable.fromEvent(el, 'DOMAutoComplete'));
                    result.push(Rx.Observable.fromEvent(el, 'dragdrop'));
                    result.push(Rx.Observable.fromEvent(el, 'drop'));
                }
            }
            result.push(Rx.Observable.fromEvent(el, 'change'));
            return result;
        };
        return TextInputBinding;
    })();
    var internal;
    (function (internal) {
        internal.textInputBindingConstructor = TextInputBinding;
    })(internal = wx.internal || (wx.internal = {}));
})(wx || (wx = {}));
var wx;
(function (wx) {
    "use strict";
    var ValueBinding = (function () {
        function ValueBinding(domManager) {
            this.priority = 5;
            this.domManager = domManager;
        }
        ValueBinding.prototype.applyBinding = function (node, options, ctx, state, module) {
            var _this = this;
            if (node.nodeType !== 1)
                internal.throwError("value-binding only operates on elements!");
            if (options == null)
                internal.throwError("invalid binding-options!");
            var el = node;
            var tag = el.tagName.toLowerCase();
            if (tag !== 'input' && tag !== 'option' && tag !== 'select' && tag !== 'textarea')
                internal.throwError("value-binding only operates on checkboxes and radio-buttons");
            var useDomManagerForValueUpdates = (tag === 'input' && el.type === 'radio') || tag === 'option';
            var prop;
            var cleanup;
            var exp = this.domManager.compileBindingOptions(options, module);
            function doCleanup() {
                if (cleanup) {
                    cleanup.dispose();
                    cleanup = null;
                }
            }
            function updateElement(domManager, value) {
                if (useDomManagerForValueUpdates)
                    internal.setNodeValue(el, value, domManager);
                else {
                    if ((value === null) || (value === undefined))
                        value = "";
                    el.value = value;
                }
            }
            state.cleanup.add(this.domManager.expressionToObservable(exp, ctx).subscribe(function (model) {
                try {
                    if (!wx.isProperty(model)) {
                        updateElement(_this.domManager, model);
                    }
                    else {
                        doCleanup();
                        cleanup = new Rx.CompositeDisposable();
                        prop = model;
                        cleanup.add(prop.changed.subscribe(function (x) {
                            updateElement(_this.domManager, x);
                        }));
                        updateElement(_this.domManager, prop());
                        if (!prop.source) {
                            cleanup.add(Rx.Observable.fromEvent(el, 'change').subscribe(function (e) {
                                if (useDomManagerForValueUpdates)
                                    prop(internal.getNodeValue(el, _this.domManager));
                                else
                                    prop(el.value);
                            }));
                        }
                    }
                }
                catch (e) {
                    wx.app.defaultExceptionHandler.onNext(e);
                }
            }));
            state.cleanup.add(Rx.Disposable.create(function () {
                node = null;
                options = null;
                ctx = null;
                state = null;
                el = null;
                doCleanup();
            }));
        };
        ValueBinding.prototype.configure = function (options) {
        };
        return ValueBinding;
    })();
    var internal;
    (function (internal) {
        function getNodeValue(node, domManager) {
            var state = domManager.getNodeState(node);
            if (state != null && state[wx.res.hasValueBindingValue]) {
                return state[wx.res.valueBindingValue];
            }
            return node.value;
        }
        internal.getNodeValue = getNodeValue;
        function setNodeValue(node, value, domManager) {
            if ((value === null) || (value === undefined))
                value = "";
            var state = domManager.getNodeState(node);
            if (typeof value === "string") {
                if (node.value !== value) {
                    node.value = value;
                    if (state != null && state[wx.res.hasValueBindingValue]) {
                        state[wx.res.hasValueBindingValue] = false;
                        state[wx.res.valueBindingValue] = undefined;
                    }
                }
            }
            else {
                if (state == null) {
                    state = this.createNodeState();
                    this.setNodeState(node, state);
                }
                state[wx.res.valueBindingValue] = value;
                state[wx.res.hasValueBindingValue] = true;
            }
        }
        internal.setNodeValue = setNodeValue;
    })(internal = wx.internal || (wx.internal = {}));
    var internal;
    (function (internal) {
        internal.valueBindingConstructor = ValueBinding;
    })(internal = wx.internal || (wx.internal = {}));
})(wx || (wx = {}));
var wx;
(function (wx) {
    "use strict";
    var WithBinding = (function () {
        function WithBinding(domManager) {
            this.priority = 50;
            this.controlsDescendants = true;
            this.domManager = domManager;
        }
        WithBinding.prototype.applyBinding = function (node, options, ctx, state, module) {
            if (node.nodeType !== 1)
                internal.throwError("with-binding only operates on elements!");
            if (options == null)
                internal.throwError("invalid binding-options!");
            var el = node;
            var self = this;
            var exp = this.domManager.compileBindingOptions(options, module);
            var obs = this.domManager.expressionToObservable(exp, ctx);
            state.cleanup.add(obs.subscribe(function (x) {
                try {
                    self.applyValue(el, wx.unwrapProperty(x), state);
                }
                catch (e) {
                    wx.app.defaultExceptionHandler.onNext(e);
                }
            }));
            state.cleanup.add(Rx.Disposable.create(function () {
                node = null;
                options = null;
                ctx = null;
                state = null;
                obs = null;
                el = null;
                self = null;
            }));
        };
        WithBinding.prototype.configure = function (options) {
        };
        WithBinding.prototype.applyValue = function (el, value, state) {
            state.model = value;
            var ctx = this.domManager.getDataContext(el);
            this.domManager.cleanDescendants(el);
            this.domManager.applyBindingsToDescendants(ctx, el);
        };
        return WithBinding;
    })();
    var internal;
    (function (internal) {
        internal.withBindingConstructor = WithBinding;
    })(internal = wx.internal || (wx.internal = {}));
})(wx || (wx = {}));
var wx;
(function (wx) {
    "use strict";
    var Lazy = (function () {
        function Lazy(createValue) {
            this.createValue = createValue;
        }
        Object.defineProperty(Lazy.prototype, "value", {
            get: function () {
                if (!this.isValueCreated) {
                    this.createdValue = this.createValue();
                    this.isValueCreated = true;
                }
                return this.createdValue;
            },
            enumerable: true,
            configurable: true
        });
        return Lazy;
    })();
    wx.Lazy = Lazy;
})(wx || (wx = {}));
var wx;
(function (wx) {
    var internal;
    (function (internal) {
        "use strict";
        var ScheduledSubject = (function () {
            function ScheduledSubject(scheduler, defaultObserver, defaultSubject) {
                this._observerRefCount = 0;
                this._defaultObserverSub = Rx.Disposable.empty;
                this._scheduler = scheduler;
                this._defaultObserver = defaultObserver;
                this._subject = defaultSubject || new Rx.Subject();
                if (defaultObserver != null) {
                    this._defaultObserverSub = this._subject.observeOn(this._scheduler).subscribe(this._defaultObserver);
                }
            }
            ScheduledSubject.prototype.dispose = function () {
                if (wx.isDisposable(this._subject)) {
                    this._subject.dispose();
                }
            };
            ScheduledSubject.prototype.onCompleted = function () {
                this._subject.onCompleted();
            };
            ScheduledSubject.prototype.onError = function (error) {
                this._subject.onError(error);
            };
            ScheduledSubject.prototype.onNext = function (value) {
                this._subject.onNext(value);
            };
            ScheduledSubject.prototype.subscribe = function (observer) {
                var _this = this;
                if (this._defaultObserverSub)
                    this._defaultObserverSub.dispose();
                this._observerRefCount++;
                return new Rx.CompositeDisposable(this._subject.observeOn(this._scheduler).subscribe(observer), Rx.Disposable.create(function () {
                    if ((--_this._observerRefCount) <= 0 && _this._defaultObserver != null) {
                        _this._defaultObserverSub = _this._subject.observeOn(_this._scheduler).subscribe(_this._defaultObserver);
                    }
                }));
            };
            return ScheduledSubject;
        })();
        function createScheduledSubject(scheduler, defaultObserver, defaultSubject) {
            var scheduled = new ScheduledSubject(scheduler, defaultObserver, defaultSubject);
            var result = wx.extend(scheduled, new Rx.Subject(), true);
            return result;
        }
        internal.createScheduledSubject = createScheduledSubject;
    })(internal = wx.internal || (wx.internal = {}));
})(wx || (wx = {}));
var wx;
(function (wx) {
    "use strict";
    var RxObsConstructor = Rx.Observable;
    RxObsConstructor.prototype.toProperty = function (initialValue, scheduler) {
        scheduler = scheduler || Rx.Scheduler.currentThread;
        var accessor = function (newVal) {
            if (arguments.length > 0) {
                wx.internal.throwError("attempt to write to a read-only observable property");
            }
            if (accessor.sub == null) {
                accessor.sub = accessor._source.connect();
            }
            return accessor.value;
        };
        accessor.queryInterface = function (iid) {
            if (iid === wx.IID.IUnknown || iid === wx.IID.IObservableProperty || iid === wx.IID.IDisposable)
                return true;
            return false;
        };
        accessor.dispose = function () {
            if (accessor.sub) {
                accessor.sub.dispose();
                accessor.sub = null;
            }
        };
        accessor.value = initialValue;
        accessor.changedSubject = new Rx.Subject();
        accessor.changed = accessor.changedSubject.publish().refCount();
        accessor.changingSubject = new Rx.Subject();
        accessor.changing = accessor.changingSubject.publish().refCount();
        accessor.source = this;
        accessor.thrownExceptions = wx.internal.createScheduledSubject(scheduler, wx.app.defaultExceptionHandler);
        var firedInitial = false;
        accessor.sub = this.distinctUntilChanged().subscribe(function (x) {
            if (firedInitial && x === accessor.value) {
                return;
            }
            firedInitial = true;
            accessor.changingSubject.onNext(x);
            accessor.value = x;
            accessor.changedSubject.onNext(x);
        }, function (x) { return accessor.thrownExceptions.onNext(x); });
        return accessor;
    };
    RxObsConstructor.prototype.continueWith = function () {
        var args = wx.args2Array(arguments);
        var val = args.shift();
        var obs = undefined;
        if (wx.isRxObservable(val)) {
            obs = val;
        }
        else if (wx.isFunction(val)) {
            var action = val;
            obs = Rx.Observable.startDeferred(action);
        }
        return this.selectMany(function (_) { return obs; });
    };
    RxObsConstructor.startDeferred = function (action) {
        return Rx.Observable.defer(function () {
            return Rx.Observable.create(function (observer) {
                var cancelled = false;
                if (!cancelled)
                    action();
                observer.onNext(undefined);
                observer.onCompleted();
                return Rx.Disposable.create(function () { return cancelled = true; });
            });
        });
    };
})(wx || (wx = {}));
var wx;
(function (wx) {
    var log;
    (function (_log) {
        "use strict";
        function log() {
            var args = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                args[_i - 0] = arguments[_i];
            }
            try {
                console.log.apply(console, arguments);
            }
            catch (e) {
                try {
                    window['opera'].postError.apply(window['opera'], arguments);
                }
                catch (e) {
                    alert(Array.prototype.join.call(arguments, " "));
                }
            }
        }
        function critical(fmt) {
            var args = [];
            for (var _i = 1; _i < arguments.length; _i++) {
                args[_i - 1] = arguments[_i];
            }
            if (args.length) {
                fmt = wx.formatString.apply(null, [fmt].concat(args));
            }
            log("**** WebRx Critical: " + fmt);
        }
        _log.critical = critical;
        function error(fmt) {
            var args = [];
            for (var _i = 1; _i < arguments.length; _i++) {
                args[_i - 1] = arguments[_i];
            }
            if (args.length) {
                fmt = wx.formatString.apply(null, [fmt].concat(args));
            }
            log("*** WebRx Error: " + fmt);
        }
        _log.error = error;
        function info(fmt) {
            var args = [];
            for (var _i = 1; _i < arguments.length; _i++) {
                args[_i - 1] = arguments[_i];
            }
            if (args.length) {
                fmt = wx.formatString.apply(null, [fmt].concat(args));
            }
            log("* WebRx Info: " + fmt);
        }
        _log.info = info;
    })(log = wx.log || (wx.log = {}));
})(wx || (wx = {}));
var wx;
(function (wx) {
    "use strict";
    var ObservableList = (function () {
        function ObservableList(initialContents, resetChangeThreshold, scheduler) {
            if (resetChangeThreshold === void 0) { resetChangeThreshold = 0.3; }
            if (scheduler === void 0) { scheduler = null; }
            this.push = this.add;
            this.changeNotificationsSuppressed = 0;
            this.propertyChangeWatchers = null;
            this.resetChangeThreshold = 0;
            this.resetSubCount = 0;
            this.hasWhinedAboutNoResetSub = false;
            this.setupRx(initialContents, resetChangeThreshold, scheduler);
        }
        ObservableList.prototype.queryInterface = function (iid) {
            if (iid === wx.IID.IUnknown || iid === wx.IID.IDisposable || iid === wx.IID.IObservableList || iid === wx.IID.IReadOnlyList || iid === wx.IID.IList)
                return true;
            return false;
        };
        ObservableList.prototype.dispose = function () {
            this.clearAllPropertyChangeWatchers();
        };
        Object.defineProperty(ObservableList.prototype, "isReadOnly", {
            get: function () {
                return false;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(ObservableList.prototype, "itemsAdded", {
            get: function () {
                if (!this._itemsAdded)
                    this._itemsAdded = this.itemsAddedSubject.value.asObservable();
                return this._itemsAdded;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(ObservableList.prototype, "beforeItemsAdded", {
            get: function () {
                if (!this._beforeItemsAdded)
                    this._beforeItemsAdded = this.beforeItemsAddedSubject.value.asObservable();
                return this._beforeItemsAdded;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(ObservableList.prototype, "itemsRemoved", {
            get: function () {
                if (!this._itemsRemoved)
                    this._itemsRemoved = this.itemsRemovedSubject.value.asObservable();
                return this._itemsRemoved;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(ObservableList.prototype, "beforeItemsRemoved", {
            get: function () {
                if (!this._beforeItemsRemoved)
                    this._beforeItemsRemoved = this.beforeItemsRemovedSubject.value.asObservable();
                return this._beforeItemsRemoved;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(ObservableList.prototype, "itemReplaced", {
            get: function () {
                if (!this._itemReplaced)
                    this._itemReplaced = this.itemReplacedSubject.value.asObservable();
                return this._itemReplaced;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(ObservableList.prototype, "beforeItemReplaced", {
            get: function () {
                if (!this._beforeItemReplaced)
                    this._beforeItemReplaced = this.beforeItemReplacedSubject.value.asObservable();
                return this._beforeItemReplaced;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(ObservableList.prototype, "beforeItemsMoved", {
            get: function () {
                if (!this._beforeItemsMoved)
                    this._beforeItemsMoved = this.beforeItemsMovedSubject.value.asObservable();
                return this._beforeItemsMoved;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(ObservableList.prototype, "itemsMoved", {
            get: function () {
                if (!this._itemsMoved)
                    this._itemsMoved = this.itemsMovedSubject.value.asObservable();
                return this._itemsMoved;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(ObservableList.prototype, "lengthChanging", {
            get: function () {
                var _this = this;
                if (!this._lengthChanging)
                    this._lengthChanging = this.listChanging.select(function (_) { return _this.inner.length; }).distinctUntilChanged();
                return this._lengthChanging;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(ObservableList.prototype, "lengthChanged", {
            get: function () {
                var _this = this;
                if (!this._lengthChanged)
                    this._lengthChanged = this.listChanged.select(function (_) { return _this.inner.length; }).distinctUntilChanged();
                return this._lengthChanged;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(ObservableList.prototype, "itemChanging", {
            get: function () {
                if (!this._itemChanging)
                    this._itemChanging = this.itemChangingSubject.value.asObservable();
                return this._itemChanging;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(ObservableList.prototype, "itemChanged", {
            get: function () {
                if (!this._itemChanged)
                    this._itemChanged = this.itemChangedSubject.value.asObservable();
                return this._itemChanged;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(ObservableList.prototype, "shouldReset", {
            get: function () {
                var _this = this;
                return this.refcountSubscribers(this.listChanged.selectMany(function (x) { return !x ? Rx.Observable.empty() : Rx.Observable.return(null); }), function (x) { return _this.resetSubCount += x; });
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(ObservableList.prototype, "changeTrackingEnabled", {
            get: function () {
                return this.propertyChangeWatchers != null;
            },
            set: function (newValue) {
                var _this = this;
                if (this.propertyChangeWatchers != null && newValue)
                    return;
                if (this.propertyChangeWatchers == null && !newValue)
                    return;
                if (newValue) {
                    this.propertyChangeWatchers = {};
                    this.inner.forEach(function (x) { return _this.addItemToPropertyTracking(x); });
                }
                else {
                    this.clearAllPropertyChangeWatchers();
                    this.propertyChangeWatchers = null;
                }
            },
            enumerable: true,
            configurable: true
        });
        ObservableList.prototype.addRange = function (items) {
            var _this = this;
            if (items == null) {
                internal.throwError("items");
            }
            var disp = this.isLengthAboveResetThreshold(items.length) ? this.suppressChangeNotifications() : Rx.Disposable.empty;
            wx.using(disp, function () {
                if (!_this.areChangeNotificationsEnabled()) {
                    Array.prototype.push.apply(_this.inner, items);
                    if (_this.changeTrackingEnabled) {
                        items.forEach(function (x) {
                            _this.addItemToPropertyTracking(x);
                        });
                    }
                }
                else {
                    if (_this.beforeItemsAddedSubject.isValueCreated) {
                        _this.beforeItemsAddedSubject.value.onNext({ items: items, from: _this.inner.length });
                    }
                    Array.prototype.push.apply(_this.inner, items);
                    if (_this.itemsAddedSubject.isValueCreated) {
                        _this.itemsAddedSubject.value.onNext({ items: items, from: _this.inner.length });
                    }
                    if (_this.changeTrackingEnabled) {
                        items.forEach(function (x) {
                            _this.addItemToPropertyTracking(x);
                        });
                    }
                }
            });
        };
        ObservableList.prototype.insertRange = function (index, items) {
            var _this = this;
            if (items == null) {
                internal.throwError("collection");
            }
            if (index > this.inner.length) {
                internal.throwError("index");
            }
            var disp = this.isLengthAboveResetThreshold(items.length) ? this.suppressChangeNotifications() : Rx.Disposable.empty;
            wx.using(disp, function () {
                if (!_this.areChangeNotificationsEnabled()) {
                    Array.prototype.splice.apply(_this.inner, [index, 0].concat(items));
                    if (_this.changeTrackingEnabled) {
                        items.forEach(function (x) {
                            _this.addItemToPropertyTracking(x);
                        });
                    }
                }
                else {
                    if (_this.beforeItemsAddedSubject.isValueCreated) {
                        items.forEach(function (x) {
                            _this.beforeItemsAddedSubject.value.onNext({ items: items, from: index });
                        });
                    }
                    Array.prototype.splice.apply(_this.inner, [index, 0].concat(items));
                    if (_this.itemsAddedSubject.isValueCreated) {
                        _this.itemsAddedSubject.value.onNext({ items: items, from: index });
                    }
                    if (_this.changeTrackingEnabled) {
                        items.forEach(function (x) {
                            _this.addItemToPropertyTracking(x);
                        });
                    }
                }
            });
        };
        ObservableList.prototype.removeAll = function (items) {
            var _this = this;
            if (items == null) {
                internal.throwError("items");
            }
            var disp = this.isLengthAboveResetThreshold(items.length) ? this.suppressChangeNotifications() : Rx.Disposable.empty;
            wx.using(disp, function () {
                items.forEach(function (x) { return _this.remove(x); });
            });
        };
        ObservableList.prototype.removeRange = function (index, count) {
            var _this = this;
            var disp = this.isLengthAboveResetThreshold(count) ? this.suppressChangeNotifications() : Rx.Disposable.empty;
            wx.using(disp, function () {
                var items = _this.inner.slice(index, index + count);
                if (!_this.areChangeNotificationsEnabled()) {
                    _this.inner.splice(index, count);
                    if (_this.changeTrackingEnabled) {
                        items.forEach(function (x) {
                            _this.removeItemFromPropertyTracking(x);
                        });
                    }
                }
                else {
                    if (_this.beforeItemsRemovedSubject.isValueCreated) {
                        items.forEach(function (x) {
                            _this.beforeItemsRemovedSubject.value.onNext({ items: items, from: index });
                        });
                    }
                    _this.inner.splice(index, count);
                    if (_this.changeTrackingEnabled) {
                        items.forEach(function (x) {
                            _this.removeItemFromPropertyTracking(x);
                        });
                    }
                    if (_this.itemsRemovedSubject.isValueCreated) {
                        items.forEach(function (x) {
                            _this.itemsRemovedSubject.value.onNext({ items: items, from: index });
                        });
                    }
                }
            });
        };
        ObservableList.prototype.toArray = function () {
            return this.inner;
        };
        ObservableList.prototype.reset = function () {
            this.publishResetNotification();
        };
        ObservableList.prototype.add = function (item) {
            this.insertItem(this.inner.length, item);
        };
        ObservableList.prototype.clear = function () {
            this.clearItems();
        };
        ObservableList.prototype.contains = function (item) {
            return this.inner.indexOf(item) !== -1;
        };
        ObservableList.prototype.remove = function (item) {
            var index = this.inner.indexOf(item);
            if (index === -1)
                return false;
            this.removeItem(index);
            return true;
        };
        ObservableList.prototype.indexOf = function (item) {
            return this.inner.indexOf(item);
        };
        ObservableList.prototype.insert = function (index, item) {
            this.insertItem(index, item);
        };
        ObservableList.prototype.removeAt = function (index) {
            this.removeItem(index);
        };
        ObservableList.prototype.move = function (oldIndex, newIndex) {
            this.moveItem(oldIndex, newIndex);
        };
        ObservableList.prototype.project = function () {
            var args = wx.args2Array(arguments);
            var filter = args.shift();
            if (filter != null && wx.isRxObservable(filter)) {
                return new ObservableListProjection(this, undefined, undefined, undefined, filter, args.shift());
            }
            var orderer = args.shift();
            if (orderer != null && wx.isRxObservable(orderer)) {
                return new ObservableListProjection(this, filter, undefined, undefined, orderer, args.shift());
            }
            var selector = args.shift();
            if (selector != null && wx.isRxObservable(selector)) {
                return new ObservableListProjection(this, filter, orderer, undefined, selector, args.shift());
            }
            return new ObservableListProjection(this, filter, orderer, selector, args.shift(), args.shift());
        };
        ObservableList.prototype.suppressChangeNotifications = function () {
            var _this = this;
            this.changeNotificationsSuppressed++;
            if (!this.hasWhinedAboutNoResetSub && this.resetSubCount === 0 && !wx.isInUnitTest()) {
                wx.log.info("suppressChangeNotifications was called (perhaps via addRange), yet you do not have a subscription to shouldReset. This probably isn't what you want, as itemsAdded and friends will appear to 'miss' items");
                this.hasWhinedAboutNoResetSub = true;
            }
            return Rx.Disposable.create(function () {
                _this.changeNotificationsSuppressed--;
                if (_this.changeNotificationsSuppressed === 0) {
                    _this.publishBeforeResetNotification();
                    _this.publishResetNotification();
                }
            });
        };
        ObservableList.prototype.get = function (index) {
            return this.inner[index];
        };
        ObservableList.prototype.set = function (index, item) {
            if (!this.areChangeNotificationsEnabled()) {
                if (this.changeTrackingEnabled) {
                    this.removeItemFromPropertyTracking(this.inner[index]);
                    this.addItemToPropertyTracking(item);
                }
                this.inner[index] = item;
                return;
            }
            if (this.beforeItemReplacedSubject.isValueCreated)
                this.beforeItemReplacedSubject.value.onNext({ from: index, items: [item] });
            if (this.changeTrackingEnabled) {
                this.removeItemFromPropertyTracking(this.inner[index]);
                this.addItemToPropertyTracking(item);
            }
            this.inner[index] = item;
            if (this.itemReplacedSubject.isValueCreated)
                this.itemReplacedSubject.value.onNext({ from: index, items: [item] });
        };
        ObservableList.prototype.sort = function (comparison) {
            this.publishBeforeResetNotification();
            this.inner.sort(comparison);
            this.publishResetNotification();
        };
        ObservableList.prototype.forEach = function (callbackfn, thisArg) {
            this.inner.forEach(callbackfn, thisArg);
        };
        ObservableList.prototype.map = function (callbackfn, thisArg) {
            return this.inner.map(callbackfn, thisArg);
        };
        ObservableList.prototype.filter = function (callbackfn, thisArg) {
            return this.inner.filter(callbackfn, thisArg);
        };
        ObservableList.prototype.some = function (callbackfn, thisArg) {
            return this.inner.some(callbackfn, thisArg);
        };
        ObservableList.prototype.every = function (callbackfn, thisArg) {
            return this.inner.every(callbackfn, thisArg);
        };
        ObservableList.prototype.setupRx = function (initialContents, resetChangeThreshold, scheduler) {
            if (resetChangeThreshold === void 0) { resetChangeThreshold = 0.3; }
            if (scheduler === void 0) { scheduler = null; }
            scheduler = scheduler || wx.app.mainThreadScheduler;
            this.resetChangeThreshold = resetChangeThreshold;
            if (this.inner === undefined)
                this.inner = new Array();
            this.beforeItemsAddedSubject = new wx.Lazy(function () { return new Rx.Subject(); });
            this.itemsAddedSubject = new wx.Lazy(function () { return new Rx.Subject(); });
            this.beforeItemsRemovedSubject = new wx.Lazy(function () { return new Rx.Subject(); });
            this.itemsRemovedSubject = new wx.Lazy(function () { return new Rx.Subject(); });
            this.beforeItemReplacedSubject = new wx.Lazy(function () { return new Rx.Subject(); });
            this.itemReplacedSubject = new wx.Lazy(function () { return new Rx.Subject(); });
            this.resetSubject = new Rx.Subject();
            this.beforeResetSubject = new Rx.Subject();
            this.itemChangingSubject = new wx.Lazy(function () { return internal.createScheduledSubject(scheduler); });
            this.itemChangedSubject = new wx.Lazy(function () { return internal.createScheduledSubject(scheduler); });
            this.beforeItemsMovedSubject = new wx.Lazy(function () { return new Rx.Subject(); });
            this.itemsMovedSubject = new wx.Lazy(function () { return new Rx.Subject(); });
            this.listChanged = Rx.Observable.merge(this.itemsAdded.select(function (x) { return false; }), this.itemsRemoved.select(function (x) { return false; }), this.itemReplaced.select(function (x) { return false; }), this.itemsMoved.select(function (x) { return false; }), this.resetSubject.select(function (x) { return true; })).publish().refCount();
            this.listChanging = Rx.Observable.merge(this.beforeItemsAdded.select(function (x) { return false; }), this.beforeItemsRemoved.select(function (x) { return false; }), this.beforeItemReplaced.select(function (x) { return false; }), this.beforeItemsMoved.select(function (x) { return false; }), this.beforeResetSubject.select(function (x) { return true; })).publish().refCount();
            if (initialContents) {
                Array.prototype.splice.apply(this.inner, [0, 0].concat(initialContents));
            }
            this.length = this.lengthChanged.toProperty(this.inner.length);
            this.isEmpty = this.lengthChanged.select(function (x) { return (x === 0); }).toProperty(this.inner.length === 0);
        };
        ObservableList.prototype.areChangeNotificationsEnabled = function () {
            return this.changeNotificationsSuppressed === 0;
        };
        ObservableList.prototype.insertItem = function (index, item) {
            if (!this.areChangeNotificationsEnabled()) {
                this.inner.splice(index, 0, item);
                if (this.changeTrackingEnabled)
                    this.addItemToPropertyTracking(item);
                return;
            }
            if (this.beforeItemsAddedSubject.isValueCreated)
                this.beforeItemsAddedSubject.value.onNext({ items: [item], from: index });
            this.inner.splice(index, 0, item);
            if (this.itemsAddedSubject.isValueCreated)
                this.itemsAddedSubject.value.onNext({ items: [item], from: index });
            if (this.changeTrackingEnabled)
                this.addItemToPropertyTracking(item);
        };
        ObservableList.prototype.removeItem = function (index) {
            var item = this.inner[index];
            if (!this.areChangeNotificationsEnabled()) {
                this.inner.splice(index, 1);
                if (this.changeTrackingEnabled)
                    this.removeItemFromPropertyTracking(item);
                return;
            }
            if (this.beforeItemsRemovedSubject.isValueCreated)
                this.beforeItemsRemovedSubject.value.onNext({ items: [item], from: index });
            this.inner.splice(index, 1);
            if (this.itemsRemovedSubject.isValueCreated)
                this.itemsRemovedSubject.value.onNext({ items: [item], from: index });
            if (this.changeTrackingEnabled)
                this.removeItemFromPropertyTracking(item);
        };
        ObservableList.prototype.moveItem = function (oldIndex, newIndex) {
            var item = this.inner[oldIndex];
            if (!this.areChangeNotificationsEnabled()) {
                this.inner.splice(oldIndex, 1);
                this.inner.splice(newIndex, 0, item);
                return;
            }
            var mi = { items: [item], from: oldIndex, to: newIndex };
            if (this.beforeItemsMovedSubject.isValueCreated)
                this.beforeItemsMovedSubject.value.onNext(mi);
            this.inner.splice(oldIndex, 1);
            this.inner.splice(newIndex, 0, item);
            if (this.itemsMovedSubject.isValueCreated)
                this.itemsMovedSubject.value.onNext(mi);
        };
        ObservableList.prototype.clearItems = function () {
            if (!this.areChangeNotificationsEnabled()) {
                this.inner.length = 0;
                if (this.changeTrackingEnabled)
                    this.clearAllPropertyChangeWatchers();
                return;
            }
            this.publishBeforeResetNotification();
            this.inner.length = 0;
            this.publishResetNotification();
            if (this.changeTrackingEnabled)
                this.clearAllPropertyChangeWatchers();
        };
        ObservableList.prototype.addItemToPropertyTracking = function (toTrack) {
            var rcd = this.propertyChangeWatchers[wx.getOid(toTrack)];
            var self = this;
            if (rcd) {
                rcd.addRef();
                return;
            }
            var changing = wx.observeObject(toTrack, true).select(function (i) { return new internal.PropertyChangedEventArgs(toTrack, i.propertyName); });
            var changed = wx.observeObject(toTrack, false).select(function (i) { return new internal.PropertyChangedEventArgs(toTrack, i.propertyName); });
            var disp = new Rx.CompositeDisposable(changing.where(function (_) { return self.areChangeNotificationsEnabled(); }).subscribe(function (x) { return self.itemChangingSubject.value.onNext(x); }), changed.where(function (_) { return self.areChangeNotificationsEnabled(); }).subscribe(function (x) { return self.itemChangedSubject.value.onNext(x); }));
            this.propertyChangeWatchers[wx.getOid(toTrack)] = new wx.RefCountDisposeWrapper(Rx.Disposable.create(function () {
                disp.dispose();
                delete self.propertyChangeWatchers[wx.getOid(toTrack)];
            }));
        };
        ObservableList.prototype.removeItemFromPropertyTracking = function (toUntrack) {
            var rcd = this.propertyChangeWatchers[wx.getOid(toUntrack)];
            if (rcd) {
                rcd.release();
            }
        };
        ObservableList.prototype.clearAllPropertyChangeWatchers = function () {
            var _this = this;
            if (this.propertyChangeWatchers != null) {
                Object.keys(this.propertyChangeWatchers).forEach(function (x) {
                    _this.propertyChangeWatchers[x].release();
                });
                this.propertyChangeWatchers = null;
            }
        };
        ObservableList.prototype.refcountSubscribers = function (input, block) {
            return Rx.Observable.create(function (subj) {
                block(1);
                return new Rx.CompositeDisposable(input.subscribe(subj), Rx.Disposable.create(function () { return block(-1); }));
            });
        };
        ObservableList.prototype.publishResetNotification = function () {
            this.resetSubject.onNext(true);
        };
        ObservableList.prototype.publishBeforeResetNotification = function () {
            this.beforeResetSubject.onNext(true);
        };
        ObservableList.prototype.isLengthAboveResetThreshold = function (toChangeLength) {
            return toChangeLength / this.inner.length > this.resetChangeThreshold && toChangeLength > 10;
        };
        return ObservableList;
    })();
    var ObservableListProjection = (function (_super) {
        __extends(ObservableListProjection, _super);
        function ObservableListProjection(source, filter, orderer, selector, refreshTrigger, scheduler) {
            _super.call(this);
            this.readonlyExceptionMessage = "Derived collections cannot be modified.";
            this.indexToSourceIndexMap = [];
            this.sourceCopy = [];
            this.disp = new Rx.CompositeDisposable();
            this.source = source;
            this.selector = selector || (function (x) { return x; });
            this._filter = filter;
            this.orderer = orderer;
            this.refreshTrigger = refreshTrigger;
            this.scheduler = scheduler || Rx.Scheduler.immediate;
            this.addAllItemsFromSourceCollection();
            this.wireUpChangeNotifications();
        }
        Object.defineProperty(ObservableListProjection.prototype, "isReadOnly", {
            get: function () {
                return true;
            },
            enumerable: true,
            configurable: true
        });
        ObservableListProjection.prototype.set = function (index, item) {
            internal.throwError(this.readonlyExceptionMessage);
        };
        ObservableListProjection.prototype.addRange = function (items) {
            internal.throwError(this.readonlyExceptionMessage);
        };
        ObservableListProjection.prototype.insertRange = function (index, items) {
            internal.throwError(this.readonlyExceptionMessage);
        };
        ObservableListProjection.prototype.removeAll = function (items) {
            internal.throwError(this.readonlyExceptionMessage);
        };
        ObservableListProjection.prototype.removeRange = function (index, count) {
            internal.throwError(this.readonlyExceptionMessage);
        };
        ObservableListProjection.prototype.add = function (item) {
            internal.throwError(this.readonlyExceptionMessage);
        };
        ObservableListProjection.prototype.clear = function () {
            internal.throwError(this.readonlyExceptionMessage);
        };
        ObservableListProjection.prototype.remove = function (item) {
            internal.throwError(this.readonlyExceptionMessage);
            return undefined;
        };
        ObservableListProjection.prototype.insert = function (index, item) {
            internal.throwError(this.readonlyExceptionMessage);
        };
        ObservableListProjection.prototype.removeAt = function (index) {
            internal.throwError(this.readonlyExceptionMessage);
        };
        ObservableListProjection.prototype.move = function (oldIndex, newIndex) {
            internal.throwError(this.readonlyExceptionMessage);
        };
        ObservableListProjection.prototype.sort = function (comparison) {
            internal.throwError(this.readonlyExceptionMessage);
        };
        ObservableListProjection.prototype.reset = function () {
            var _this = this;
            wx.using(_super.prototype.suppressChangeNotifications.call(this), function () {
                _super.prototype.clear.call(_this);
                _this.addAllItemsFromSourceCollection();
            });
        };
        ObservableListProjection.prototype.dispose = function () {
            this.disp.dispose();
            _super.prototype.dispose.call(this);
        };
        ObservableListProjection.prototype.referenceEquals = function (a, b) {
            return wx.getOid(a) === wx.getOid(b);
        };
        ObservableListProjection.prototype.refresh = function () {
            var length = this.sourceCopy.length;
            for (var i = 0; i < length; i++) {
                this.onItemChanged(this.sourceCopy[i]);
            }
        };
        ObservableListProjection.prototype.wireUpChangeNotifications = function () {
            var _this = this;
            this.disp.add(this.source.itemsAdded.observeOn(this.scheduler).subscribe(function (e) {
                _this.onItemsAdded(e);
            }));
            this.disp.add(this.source.itemsRemoved.observeOn(this.scheduler).subscribe(function (e) {
                _this.onItemsRemoved(e);
            }));
            this.disp.add(this.source.itemsMoved.observeOn(this.scheduler).subscribe(function (e) {
                _this.onItemsMoved(e);
            }));
            this.disp.add(this.source.itemReplaced.observeOn(this.scheduler).subscribe(function (e) {
                _this.onItemsReplaced(e);
            }));
            this.disp.add(this.source.shouldReset.observeOn(this.scheduler).subscribe(function (e) {
                _this.reset();
            }));
            this.disp.add(this.source.itemChanged.select(function (x) { return x.sender; }).observeOn(this.scheduler).subscribe(function (x) { return _this.onItemChanged(x); }));
            if (this.refreshTrigger != null) {
                this.disp.add(this.refreshTrigger.observeOn(this.scheduler).subscribe(function (_) { return _this.refresh(); }));
            }
        };
        ObservableListProjection.prototype.onItemsAdded = function (e) {
            this.shiftIndicesAtOrOverThreshold(e.from, e.items.length);
            for (var i = 0; i < e.items.length; i++) {
                var sourceItem = e.items[i];
                this.sourceCopy.splice(e.from + i, 0, sourceItem);
                if (this._filter && !this._filter(sourceItem)) {
                    continue;
                }
                var destinationItem = this.selector(sourceItem);
                this.internalInsertAndMap(e.from + i, destinationItem);
            }
        };
        ObservableListProjection.prototype.onItemsRemoved = function (e) {
            this.sourceCopy.splice(e.from, e.items.length);
            for (var i = 0; i < e.items.length; i++) {
                var destinationIndex = this.getIndexFromSourceIndex(e.from + i);
                if (destinationIndex !== -1) {
                    this.internalRemoveAt(destinationIndex);
                }
            }
            var removedCount = e.items.length;
            this.shiftIndicesAtOrOverThreshold(e.from + removedCount, -removedCount);
        };
        ObservableListProjection.prototype.onItemsMoved = function (e) {
            if (e.items.length > 1) {
                internal.throwError("Derived collections doesn't support multi-item moves");
            }
            if (e.from === e.to) {
                return;
            }
            var oldSourceIndex = e.from;
            var newSourceIndex = e.to;
            this.sourceCopy.splice(oldSourceIndex, 1);
            this.sourceCopy.splice(newSourceIndex, 0, e.items[0]);
            var currentDestinationIndex = this.getIndexFromSourceIndex(oldSourceIndex);
            this.moveSourceIndexInMap(oldSourceIndex, newSourceIndex);
            if (currentDestinationIndex === -1) {
                return;
            }
            if (this.orderer == null) {
                var newDestinationIndex = ObservableListProjection.newPositionForExistingItem2(this.indexToSourceIndexMap, newSourceIndex, currentDestinationIndex);
                if (newDestinationIndex !== currentDestinationIndex) {
                    this.indexToSourceIndexMap.splice(currentDestinationIndex, 1);
                    this.indexToSourceIndexMap.splice(newDestinationIndex, 0, newSourceIndex);
                    _super.prototype.move.call(this, currentDestinationIndex, newDestinationIndex);
                }
                else {
                    this.indexToSourceIndexMap[currentDestinationIndex] = newSourceIndex;
                }
            }
            else {
                this.indexToSourceIndexMap[currentDestinationIndex] = newSourceIndex;
            }
        };
        ObservableListProjection.prototype.onItemsReplaced = function (e) {
            for (var i = 0; i < e.items.length; i++) {
                var sourceItem = e.items[i];
                this.sourceCopy[e.from + i] = sourceItem;
                this.onItemChanged(sourceItem);
            }
        };
        ObservableListProjection.prototype.onItemChanged = function (changedItem) {
            var _this = this;
            var sourceIndices = this.indexOfAll(this.sourceCopy, changedItem);
            var shouldBeIncluded = !this._filter || this._filter(changedItem);
            sourceIndices.forEach(function (sourceIndex) {
                var currentDestinationIndex = _this.getIndexFromSourceIndex(sourceIndex);
                var isIncluded = currentDestinationIndex >= 0;
                if (isIncluded && !shouldBeIncluded) {
                    _this.internalRemoveAt(currentDestinationIndex);
                }
                else if (!isIncluded && shouldBeIncluded) {
                    _this.internalInsertAndMap(sourceIndex, _this.selector(changedItem));
                }
                else if (isIncluded && shouldBeIncluded) {
                    var newItem = _this.selector(changedItem);
                    if (_this.orderer == null) {
                        if (!_this.referenceEquals(newItem, _this.get(currentDestinationIndex))) {
                            _super.prototype.set.call(_this, currentDestinationIndex, newItem);
                        }
                    }
                    else {
                        if (_this.canItemStayAtPosition(newItem, currentDestinationIndex)) {
                            if (!_this.referenceEquals(newItem, _this.get(currentDestinationIndex))) {
                                _super.prototype.set.call(_this, currentDestinationIndex, newItem);
                            }
                        }
                        else {
                            if (_this.referenceEquals(newItem, _this.get(currentDestinationIndex))) {
                                var newDestinationIndex = _this.newPositionForExistingItem(sourceIndex, currentDestinationIndex, newItem);
                                _this.indexToSourceIndexMap.splice(currentDestinationIndex, 1);
                                _this.indexToSourceIndexMap.splice(newDestinationIndex, 0, sourceIndex);
                                _super.prototype.move.call(_this, currentDestinationIndex, newDestinationIndex);
                            }
                            else {
                                _this.internalRemoveAt(currentDestinationIndex);
                                _this.internalInsertAndMap(sourceIndex, newItem);
                            }
                        }
                    }
                }
            });
        };
        ObservableListProjection.prototype.canItemStayAtPosition = function (item, currentIndex) {
            var hasPrecedingItem = currentIndex > 0;
            if (hasPrecedingItem) {
                var isGreaterThanOrEqualToPrecedingItem = this.orderer(item, this[currentIndex - 1]) >= 0;
                if (!isGreaterThanOrEqualToPrecedingItem) {
                    return false;
                }
            }
            var hasSucceedingItem = currentIndex < this.length() - 1;
            if (hasSucceedingItem) {
                var isLessThanOrEqualToSucceedingItem = this.orderer(item, this[currentIndex + 1]) <= 0;
                if (!isLessThanOrEqualToSucceedingItem) {
                    return false;
                }
            }
            return true;
        };
        ObservableListProjection.prototype.getIndexFromSourceIndex = function (sourceIndex) {
            return this.indexToSourceIndexMap.indexOf(sourceIndex);
        };
        ObservableListProjection.prototype.indexOfAll = function (source, item) {
            var _this = this;
            var indices = [];
            var sourceIndex = 0;
            source.forEach(function (x) {
                if (_this.referenceEquals(x, item)) {
                    indices.push(sourceIndex);
                }
                sourceIndex++;
            });
            return indices;
        };
        ObservableListProjection.prototype.moveSourceIndexInMap = function (oldSourceIndex, newSourceIndex) {
            if (newSourceIndex > oldSourceIndex) {
                this.shiftSourceIndicesInRange(oldSourceIndex + 1, newSourceIndex + 1, -1);
            }
            else {
                this.shiftSourceIndicesInRange(newSourceIndex, oldSourceIndex, 1);
            }
        };
        ObservableListProjection.prototype.shiftIndicesAtOrOverThreshold = function (threshold, value) {
            for (var i = 0; i < this.indexToSourceIndexMap.length; i++) {
                if (this.indexToSourceIndexMap[i] >= threshold) {
                    this.indexToSourceIndexMap[i] += value;
                }
            }
        };
        ObservableListProjection.prototype.shiftSourceIndicesInRange = function (rangeStart, rangeStop, value) {
            for (var i = 0; i < this.indexToSourceIndexMap.length; i++) {
                var sourceIndex = this.indexToSourceIndexMap[i];
                if (sourceIndex >= rangeStart && sourceIndex < rangeStop) {
                    this.indexToSourceIndexMap[i] += value;
                }
            }
        };
        ObservableListProjection.prototype.addAllItemsFromSourceCollection = function () {
            var _this = this;
            var sourceIndex = 0;
            this.source.forEach(function (sourceItem) {
                _this.sourceCopy.push(sourceItem);
                if (!_this._filter || _this._filter(sourceItem)) {
                    var destinationItem = _this.selector(sourceItem);
                    _this.internalInsertAndMap(sourceIndex, destinationItem);
                }
                sourceIndex++;
            });
        };
        ObservableListProjection.prototype.internalClear = function () {
            this.indexToSourceIndexMap = [];
            this.sourceCopy = [];
            _super.prototype.clear.call(this);
        };
        ObservableListProjection.prototype.internalInsertAndMap = function (sourceIndex, value) {
            var destinationIndex = this.positionForNewItem(sourceIndex, value);
            this.indexToSourceIndexMap.splice(destinationIndex, 0, sourceIndex);
            _super.prototype.insert.call(this, destinationIndex, value);
        };
        ObservableListProjection.prototype.internalRemoveAt = function (destinationIndex) {
            this.indexToSourceIndexMap.splice(destinationIndex, 1);
            _super.prototype.removeAt.call(this, destinationIndex);
        };
        ObservableListProjection.prototype.positionForNewItem = function (sourceIndex, value) {
            return this.orderer == null ? ObservableListProjection.positionForNewItemArray(this.indexToSourceIndexMap, sourceIndex, ObservableListProjection.defaultOrderer) : ObservableListProjection.positionForNewItemArray2(this.inner, 0, this.inner.length, value, this.orderer);
        };
        ObservableListProjection.positionForNewItemArray = function (array, item, orderer) {
            return ObservableListProjection.positionForNewItemArray2(array, 0, array.length, item, orderer);
        };
        ObservableListProjection.positionForNewItemArray2 = function (array, index, count, item, orderer) {
            if (count === 0) {
                return index;
            }
            if (count === 1) {
                return orderer(array[index], item) >= 0 ? index : index + 1;
            }
            if (orderer(array[index], item) >= 1)
                return index;
            var low = index, hi = index + count - 1;
            var cmp;
            while (low <= hi) {
                var mid = Math.floor(low + (hi - low) / 2);
                cmp = orderer(array[mid], item);
                if (cmp === 0) {
                    return mid;
                }
                if (cmp < 0) {
                    low = mid + 1;
                }
                else {
                    hi = mid - 1;
                }
            }
            return low;
        };
        ObservableListProjection.prototype.newPositionForExistingItem = function (sourceIndex, currentIndex, item) {
            return this.orderer == null ? ObservableListProjection.newPositionForExistingItem2(this.indexToSourceIndexMap, sourceIndex, currentIndex) : ObservableListProjection.newPositionForExistingItem2(this.inner, item, currentIndex, this.orderer);
        };
        ObservableListProjection.newPositionForExistingItem2 = function (array, item, currentIndex, orderer) {
            if (array.length === 1) {
                return 0;
            }
            var precedingIndex = currentIndex - 1;
            var succeedingIndex = currentIndex + 1;
            var comparand = array[precedingIndex >= 0 ? precedingIndex : succeedingIndex];
            if (orderer == null) {
                orderer = ObservableListProjection.defaultOrderer;
            }
            var cmp = orderer(item, comparand);
            var min = 0;
            var max = array.length;
            if (cmp === 0) {
                return currentIndex;
            }
            else if (cmp > 0) {
                min = succeedingIndex;
            }
            else {
                max = precedingIndex;
            }
            if (min === array.length || max < 0) {
                return currentIndex;
            }
            var ix = ObservableListProjection.positionForNewItemArray2(array, min, max - min, item, orderer);
            return ix >= currentIndex ? ix - 1 : ix;
        };
        ObservableListProjection.defaultOrderer = function (a, b) {
            var result;
            if (a == null && b == null)
                result = 0;
            else if (a == null)
                result = -1;
            else if (b == null)
                result = 1;
            else
                result = a - b;
            return result;
        };
        return ObservableListProjection;
    })(ObservableList);
    var internal;
    (function (internal) {
        internal.listConstructor = ObservableList;
    })(internal = wx.internal || (wx.internal = {}));
    function list(initialContents, resetChangeThreshold, scheduler) {
        if (resetChangeThreshold === void 0) { resetChangeThreshold = 0.3; }
        if (scheduler === void 0) { scheduler = null; }
        return new ObservableList(initialContents, resetChangeThreshold, scheduler);
    }
    wx.list = list;
})(wx || (wx = {}));
var wx;
(function (wx) {
    "use strict";
    var MapEmulated = (function () {
        function MapEmulated() {
            this.cacheSentinel = {};
            this.keys = [];
            this.values = [];
            this.cache = this.cacheSentinel;
        }
        Object.defineProperty(MapEmulated.prototype, "size", {
            get: function () {
                return this.keys.length;
            },
            enumerable: true,
            configurable: true
        });
        MapEmulated.prototype.has = function (key) {
            if (key === this.cache) {
                return true;
            }
            if (this.find(key) >= 0) {
                this.cache = key;
                return true;
            }
            return false;
        };
        MapEmulated.prototype.get = function (key) {
            var index = this.find(key);
            if (index >= 0) {
                this.cache = key;
                return this.values[index];
            }
            return undefined;
        };
        MapEmulated.prototype.set = function (key, value) {
            this.delete(key);
            this.keys.push(key);
            this.values.push(value);
            this.cache = key;
            return this;
        };
        MapEmulated.prototype.delete = function (key) {
            var index = this.find(key);
            if (index >= 0) {
                this.keys.splice(index, 1);
                this.values.splice(index, 1);
                this.cache = this.cacheSentinel;
                return true;
            }
            return false;
        };
        MapEmulated.prototype.clear = function () {
            this.keys.length = 0;
            this.values.length = 0;
            this.cache = this.cacheSentinel;
        };
        MapEmulated.prototype.forEach = function (callback, thisArg) {
            var size = this.size;
            for (var i = 0; i < size; ++i) {
                var key = this.keys[i];
                var value = this.values[i];
                this.cache = key;
                callback.call(this, value, key, this);
            }
        };
        Object.defineProperty(MapEmulated.prototype, "isEmulated", {
            get: function () {
                return true;
            },
            enumerable: true,
            configurable: true
        });
        MapEmulated.prototype.find = function (key) {
            var keys = this.keys;
            var size = keys.length;
            for (var i = 0; i < size; ++i) {
                if (keys[i] === key) {
                    return i;
                }
            }
            return -1;
        };
        return MapEmulated;
    })();
    var hasNativeSupport = typeof Map === "function" && Map.prototype.hasOwnProperty("forEach") && Map.prototype.hasOwnProperty("add") && Map.prototype.hasOwnProperty("clear") && Map.prototype.hasOwnProperty("devare") && Map.prototype.hasOwnProperty("has");
    function createMap(disableNativeSupport) {
        if (disableNativeSupport || !hasNativeSupport) {
            return new MapEmulated();
        }
        return new Map();
    }
    wx.createMap = createMap;
})(wx || (wx = {}));
var wx;
(function (wx) {
    "use strict";
    var groupId = 0;
    var templateCache = {};
    var RadioGroupComponent = (function () {
        function RadioGroupComponent(htmlTemplateEngine) {
            var _this = this;
            this.template = function (params) {
                return _this.buildTemplate(params);
            };
            this.viewModel = function (params) {
                var opt = params;
                var groupName = opt.groupName != null ? opt.groupName : wx.formatString("wx-radiogroup-{0}", groupId++);
                return {
                    items: params.items,
                    selectedValue: params.selectedValue,
                    groupName: groupName,
                    hooks: { afterRender: params.afterRender }
                };
            };
            this.htmlTemplateEngine = htmlTemplateEngine;
        }
        RadioGroupComponent.prototype.buildTemplate = function (params) {
            var result;
            var key = undefined;
            var nodes;
            if (!params.noCache) {
                key = (params.itemText != null ? params.itemText : "") + "-" + (params.itemValue != null ? params.itemValue : "") + "-" + (params.itemClass != null ? params.itemClass : "") + "-" + (params.selectedValue != null ? "true" : "false");
                nodes = templateCache[key];
                if (nodes != null) {
                    return nodes;
                }
            }
            result = '<div class="wx-radiogroup" data-bind="{0}"><input type="radio" data-bind="{1}"/>{2}</div>';
            var bindings = [];
            var attrs = [];
            var itemBindings = [];
            var itemAttrs = [];
            var perItemExtraMarkup = "";
            bindings.push({ key: "foreach", value: "{ data: items, hooks: hooks }" });
            if (attrs.length)
                bindings.push({ key: "attr", value: "{ " + attrs.map(function (x) { return x.key + ": " + x.value; }).join(", ") + " }" });
            itemBindings.push({ key: "value", value: params.itemValue || "$data" });
            itemAttrs.push({ key: 'name', value: "$parent.groupName" });
            if (params.selectedValue) {
                itemBindings.push({ key: "selectedValue", value: "$parent.@selectedValue" });
            }
            if (params.itemText) {
                perItemExtraMarkup += wx.formatString('<label data-bind="text: {0}, attr: { for: {1} }"></label>', params.itemText, "$parent.groupName + '-' + $index");
                itemAttrs.push({ key: 'id', value: "$parent.groupName + '-' + $index" });
            }
            if (params.itemClass) {
                itemAttrs.push({ key: 'class', value: "'" + params.itemClass + "'" });
            }
            if (itemAttrs.length)
                itemBindings.push({ key: "attr", value: "{ " + itemAttrs.map(function (x) { return x.key + ": " + x.value; }).join(", ") + " }" });
            var bindingString = bindings.map(function (x) { return x.key + ": " + x.value; }).join(", ");
            var itemBindingString = itemBindings.map(function (x) { return x.key + ": " + x.value; }).join(", ");
            result = wx.formatString(result, bindingString, itemBindingString, perItemExtraMarkup);
            if (!params.noCache) {
                templateCache[key] = result;
            }
            nodes = this.htmlTemplateEngine.parse(result);
            return nodes;
        };
        return RadioGroupComponent;
    })();
    var internal;
    (function (internal) {
        internal.radioGroupComponentConstructor = RadioGroupComponent;
    })(internal = wx.internal || (wx.internal = {}));
})(wx || (wx = {}));
var wx;
(function (wx) {
    "use strict";
    var templateCache = {};
    var SelectComponent = (function () {
        function SelectComponent(htmlTemplateEngine) {
            var _this = this;
            this.template = function (params) {
                return _this.buildTemplate(params);
            };
            this.viewModel = function (params) {
                var opt = params;
                return {
                    items: params.items,
                    selectedValue: params.selectedValue,
                    hooks: { afterRender: opt.afterRender }
                };
            };
            this.htmlTemplateEngine = htmlTemplateEngine;
        }
        SelectComponent.prototype.buildTemplate = function (params) {
            var result;
            var key = undefined;
            var nodes;
            if (!params.noCache) {
                key = (params.name != null ? params.name : "") + "-" + (params.itemText != null ? params.itemText : "") + "-" + (params.itemValue != null ? params.itemValue : "") + "-" + (params.itemClass != null ? params.itemClass : "") + "-" + (params.selectedValue != null ? "true" : "false") + "-" + (params.multiple ? "true" : "false") + "-" + (params.required ? "true" : "false") + "-" + (params.autofocus ? "true" : "false") + "-" + (params.size ? params.size.toString() : "0");
                nodes = templateCache[key];
                if (nodes != null) {
                    return nodes;
                }
            }
            result = '<select class="wx-select" data-bind="{0}"><option data-bind="{1}"></option></select>';
            var bindings = [];
            var attrs = [];
            var itemBindings = [];
            var itemAttrs = [];
            bindings.push({ key: "foreach", value: "{ data: items, hooks: hooks }" });
            if (params.selectedValue)
                bindings.push({ key: "selectedValue", value: "@selectedValue" });
            if (params.name) {
                attrs.push({ key: 'name', value: params.name });
            }
            if (params.multiple) {
                attrs.push({ key: 'multiple', value: "true" });
            }
            if (params.size !== undefined) {
                attrs.push({ key: 'size', value: params.size.toString() });
            }
            if (params.required) {
                attrs.push({ key: 'required', value: "true" });
            }
            if (params.autofocus) {
                attrs.push({ key: 'autofocus', value: "true" });
            }
            if (attrs.length)
                bindings.push({ key: "attr", value: "{ " + attrs.map(function (x) { return x.key + ": " + x.value; }).join(", ") + " }" });
            itemBindings.push({ key: "value", value: params.itemValue || "$data" });
            itemBindings.push({ key: 'text', value: params.itemText || "$data" });
            if (params.itemClass) {
                itemAttrs.push({ key: 'class', value: "'" + params.itemClass + "'" });
            }
            if (itemAttrs.length)
                itemBindings.push({ key: "attr", value: "{ " + itemAttrs.map(function (x) { return x.key + ": " + x.value; }).join(", ") + " }" });
            var bindingString = bindings.map(function (x) { return x.key + ": " + x.value; }).join(", ");
            var itemBindingString = itemBindings.map(function (x) { return x.key + ": " + x.value; }).join(", ");
            result = wx.formatString(result, bindingString, itemBindingString);
            if (!params.noCache) {
                templateCache[key] = result;
            }
            nodes = this.htmlTemplateEngine.parse(result);
            return nodes;
        };
        return SelectComponent;
    })();
    var internal;
    (function (internal) {
        internal.selectComponentConstructor = SelectComponent;
    })(internal = wx.internal || (wx.internal = {}));
})(wx || (wx = {}));
var wx;
(function (wx) {
    "use strict";
    function toElementList(element) {
        var nodes;
        if (element instanceof Node || element instanceof HTMLElement)
            nodes = [element];
        else if (Array.isArray(element))
            nodes = element;
        else if (element instanceof NodeList)
            nodes = wx.nodeListToArray(element);
        else
            wx.internal.throwError("invalid argument: element");
        var elements = nodes.filter(function (x) { return x.nodeType === 1; });
        return elements;
    }
    function parseTimingValue(x) {
        if (x.charAt(x.length - 1) === "s") {
            x = x.substring(0, x.length - 1);
        }
        var value = parseFloat(x) || 0;
        return value;
    }
    function getMaximumTransitionDuration(el) {
        var str = getComputedStyle(el)["transitionDuration"];
        var maxValue = 0;
        var values = str.split(/\s*,\s*/);
        values.forEach(function (x) {
            var value = parseTimingValue(x);
            maxValue = maxValue ? Math.max(value, maxValue) : value;
        });
        return maxValue * 1000;
    }
    function getMaximumTransitionDelay(el) {
        var str = getComputedStyle(el)["transitionDelay"];
        var maxValue = 0;
        var values = str.split(/\s*,\s*/);
        values.forEach(function (x) {
            var value = Math.max(0, parseTimingValue(x));
            maxValue = maxValue ? Math.max(value, maxValue) : value;
        });
        return maxValue * 1000;
    }
    function getKeyframeAnimationDuration(el) {
        var durationStr = getComputedStyle(el)["animationDuration"] || getComputedStyle(el)["webkitAnimationDuration"] || "0s";
        var delayStr = getComputedStyle(el)["animationDelay"] || getComputedStyle(el)["webkitAnimationDelay"] || "0s";
        var duration = parseTimingValue(durationStr);
        var delay = parseTimingValue(delayStr);
        return (duration + delay) * 1000;
    }
    function scriptedAnimation(run, prepare, complete) {
        var result = {};
        if (prepare) {
            result.prepare = function (nodes, params) {
                var elements = toElementList(nodes);
                elements.forEach(function (x) { return prepare(x, params); });
            };
        }
        else {
            result.prepare = wx.noop;
        }
        result.run = function (nodes, params) {
            return Rx.Observable.defer(function () {
                var elements = toElementList(nodes);
                if (elements.length === 0)
                    return Rx.Observable.return(undefined);
                return Rx.Observable.combineLatest(elements.map(function (x) { return run(x, params); }), wx.noop);
            });
        };
        if (complete) {
            result.complete = function (nodes, params) {
                var elements = toElementList(nodes);
                elements.forEach(function (x) { return complete(x, params); });
            };
        }
        else {
            result.complete = wx.noop;
        }
        return result;
    }
    function cssTransitionAnimation(prepare, run, complete) {
        var result = {};
        var prepToAdd;
        var prepToRemove;
        var runToAdd;
        var runToRemove;
        var completeToAdd;
        var completeToRemove;
        if (prepare) {
            var prepIns;
            if (typeof prepare === "string") {
                prepare = prepare.split(/\s+/).map(function (x) { return x.trim(); }).filter(function (x) { return x; });
            }
            if (typeof prepare[0] === "string") {
                prepIns = prepare.map(function (x) { return { css: x, add: true }; });
            }
            else {
                prepIns = prepare;
            }
            prepToAdd = prepIns.filter(function (x) { return x.add; }).map(function (x) { return x.css; });
            prepToRemove = prepIns.filter(function (x) { return !x.add || x.remove; }).map(function (x) { return x.css; });
            result.prepare = function (nodes, params) {
                var elements = toElementList(nodes);
                if (prepToAdd && prepToAdd.length)
                    elements.forEach(function (x) { return wx.toggleCssClass.apply(null, [x, true].concat(prepToAdd)); });
                if (prepToRemove && prepToRemove.length)
                    elements.forEach(function (x) { return wx.toggleCssClass.apply(null, [x, false].concat(prepToRemove)); });
            };
        }
        var runIns;
        if (typeof run === "string") {
            run = run.split(/\s+/).map(function (x) { return x.trim(); }).filter(function (x) { return x; });
        }
        if (typeof run[0] === "string") {
            runIns = run.map(function (x) { return { css: x, add: true }; });
        }
        else {
            runIns = run;
        }
        runToAdd = runIns.filter(function (x) { return x.add; }).map(function (x) { return x.css; });
        runToRemove = runIns.filter(function (x) { return !x.add || x.remove; }).map(function (x) { return x.css; });
        result.run = function (nodes, params) {
            return Rx.Observable.defer(function () {
                var elements = toElementList(nodes);
                if (elements.length === 0)
                    return Rx.Observable.return(undefined);
                var obs = Rx.Observable.combineLatest(elements.map(function (x) {
                    var duration = Math.max(getMaximumTransitionDuration(x) + getMaximumTransitionDelay(x), getKeyframeAnimationDuration(x));
                    return Rx.Observable.timer(duration);
                }), wx.noop);
                Rx.Observable.timer(1).subscribe(function () {
                    if (runToAdd && runToAdd.length)
                        elements.forEach(function (x) { return wx.toggleCssClass.apply(null, [x, true].concat(runToAdd)); });
                    if (runToRemove && runToRemove.length)
                        elements.forEach(function (x) { return wx.toggleCssClass.apply(null, [x, false].concat(runToRemove)); });
                });
                return obs;
            });
        };
        var completeIns;
        if (complete) {
            if (typeof complete === "string") {
                complete = complete.split(/\s+/).map(function (x) { return x.trim(); }).filter(function (x) { return x; });
            }
            if (typeof complete[0] === "string") {
                completeIns = complete.map(function (x) { return { css: x, add: true }; });
            }
            else {
                completeIns = complete;
            }
            completeToAdd = completeIns.filter(function (x) { return x.add; }).map(function (x) { return x.css; });
            completeToRemove = completeIns.filter(function (x) { return !x.add || x.remove; }).map(function (x) { return x.css; });
        }
        else {
            completeToRemove = [];
            if (prepToAdd && prepToAdd.length)
                completeToRemove = completeToRemove.concat(prepToAdd);
            if (runToAdd && runToAdd.length)
                completeToRemove = completeToRemove.concat(runToAdd);
        }
        result.complete = function (nodes, params) {
            var elements = toElementList(nodes);
            if (completeToAdd && completeToAdd.length)
                elements.forEach(function (x) { return wx.toggleCssClass.apply(null, [x, true].concat(completeToAdd)); });
            if (completeToRemove && completeToRemove.length)
                elements.forEach(function (x) { return wx.toggleCssClass.apply(null, [x, false].concat(completeToRemove)); });
        };
        return result;
    }
    function animation() {
        var args = wx.args2Array(arguments);
        var val = args.shift();
        if (typeof val === "function") {
            return scriptedAnimation(val, args.shift(), args.shift());
        }
        return cssTransitionAnimation(val, args.shift(), args.shift());
    }
    wx.animation = animation;
})(wx || (wx = {}));
var wx;
(function (wx) {
    "use strict";
    var Command = (function () {
        function Command(canExecute, executeAsync, scheduler) {
            var _this = this;
            this.resultsSubject = new Rx.Subject();
            this.isExecutingSubject = new Rx.Subject();
            this.inflightCount = 0;
            this.canExecuteLatest = false;
            this.canExecuteDisp = null;
            this.scheduler = scheduler || wx.app.mainThreadScheduler;
            this.func = executeAsync;
            this.canExecuteObs = canExecute.combineLatest(this.isExecutingSubject.startWith(false), function (ce, ie) { return ce && !ie; }).catch(function (ex) {
                _this.exceptionsSubject.onNext(ex);
                return Rx.Observable.return(false);
            }).do(function (x) {
                _this.canExecuteLatest = x;
            }).publish();
            if (wx.isInUnitTest()) {
                this.canExecuteObs.connect();
            }
            this.exceptionsSubject = new Rx.Subject();
            this.thrownExceptions = this.exceptionsSubject.asObservable();
            this.exceptionsSubject.observeOn(this.scheduler).subscribe(wx.app.defaultExceptionHandler);
        }
        Command.prototype.queryInterface = function (iid) {
            if (iid === wx.IID.IUnknown || iid === wx.IID.ICommand || iid === wx.IID.IHandleObservableErrors || iid === wx.IID.IDisposable)
                return true;
            return false;
        };
        Command.prototype.dispose = function () {
            var disp = this.canExecuteDisp;
            if (disp != null)
                disp.dispose();
        };
        Object.defineProperty(Command.prototype, "canExecuteObservable", {
            get: function () {
                var _this = this;
                var ret = this.canExecuteObs.startWith(this.canExecuteLatest).distinctUntilChanged();
                if (this.canExecuteDisp != null)
                    return ret;
                return Rx.Observable.create(function (subj) {
                    var disp = ret.subscribe(subj);
                    _this.canExecuteDisp = _this.canExecuteObs.connect();
                    return disp;
                });
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Command.prototype, "isExecuting", {
            get: function () {
                return this.isExecutingSubject.startWith(this.inflightCount > 0);
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Command.prototype, "results", {
            get: function () {
                return this.resultsSubject.asObservable();
            },
            enumerable: true,
            configurable: true
        });
        Command.prototype.canExecute = function (parameter) {
            if (this.canExecuteDisp == null)
                this.canExecuteDisp = this.canExecuteObs.connect();
            return this.canExecuteLatest;
        };
        Command.prototype.execute = function (parameter) {
            this.executeAsync(parameter).catch(Rx.Observable.empty()).subscribe();
        };
        Command.prototype.executeAsync = function (parameter) {
            var self = this;
            var ret = Rx.Observable.create(function (subj) {
                if (++self.inflightCount === 1) {
                    self.isExecutingSubject.onNext(true);
                }
                var decrement = new Rx.SerialDisposable();
                decrement.setDisposable(Rx.Disposable.create(function () {
                    if (--self.inflightCount === 0) {
                        self.isExecutingSubject.onNext(false);
                    }
                }));
                var disp = self.func(parameter).observeOn(self.scheduler).do(function (_) {
                }, function (e) { return decrement.setDisposable(Rx.Disposable.empty); }, function () { return decrement.setDisposable(Rx.Disposable.empty); }).do(function (x) { return self.resultsSubject.onNext(x); }, function (x) { return self.exceptionsSubject.onNext(x); }).subscribe(subj);
                return new Rx.CompositeDisposable(disp, decrement);
            });
            return ret.publish().refCount();
        };
        return Command;
    })();
    var internal;
    (function (internal) {
        internal.commandConstructor = Command;
    })(internal = wx.internal || (wx.internal = {}));
    function command() {
        var args = wx.args2Array(arguments);
        var canExecute;
        var execute;
        var scheduler;
        var thisArg;
        if (wx.isFunction(args[0])) {
            execute = args.shift();
            canExecute = wx.isRxObservable(args[0]) ? args.shift() : Rx.Observable.return(true);
            scheduler = wx.isRxScheduler(args[0]) ? args.shift() : undefined;
            thisArg = args.shift();
            if (thisArg != null)
                execute = execute.bind(thisArg);
            return asyncCommand(canExecute, function (parameter) { return Rx.Observable.create(function (obs) {
                try {
                    execute(parameter);
                    obs.onNext(null);
                    obs.onCompleted();
                }
                catch (e) {
                    obs.onError(e);
                }
                return Rx.Disposable.empty;
            }); }, scheduler);
        }
        canExecute = args.shift() || Rx.Observable.return(true);
        scheduler = wx.isRxScheduler(args[0]) ? args.shift() : undefined;
        return new Command(canExecute, function (x) { return Rx.Observable.return(x); }, scheduler);
    }
    wx.command = command;
    function asyncCommand() {
        var args = wx.args2Array(arguments);
        var canExecute;
        var executeAsync;
        var scheduler;
        var thisArg;
        if (wx.isFunction(args[0])) {
            executeAsync = args.shift();
            scheduler = wx.isRxScheduler(args[0]) ? args.shift() : undefined;
            thisArg = args.shift();
            if (thisArg != null)
                executeAsync = executeAsync.bind(thisArg);
            return new Command(Rx.Observable.return(true), executeAsync, scheduler);
        }
        canExecute = args.shift();
        executeAsync = args.shift();
        scheduler = wx.isRxScheduler(args[0]) ? args.shift() : undefined;
        return new Command(canExecute, executeAsync, scheduler);
    }
    wx.asyncCommand = asyncCommand;
    function combinedCommand() {
        var args = wx.args2Array(arguments);
        var commands = args.filter(function (x) { return wx.isCommand(x); });
        var canExecute = args.filter(function (x) { return wx.isRxObservable(x); }).pop();
        if (!canExecute)
            canExecute = Rx.Observable.return(true);
        var childrenCanExecute = Rx.Observable.combineLatest(commands.map(function (x) { return x.canExecuteObservable; }), function () {
            var latestCanExecute = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                latestCanExecute[_i - 0] = arguments[_i];
            }
            return latestCanExecute.every(function (x) { return x; });
        });
        var canExecuteSum = Rx.Observable.combineLatest(canExecute.startWith(true), childrenCanExecute, function (parent, child) { return parent && child; });
        var ret = command(canExecuteSum);
        ret.results.subscribe(function (x) { return commands.forEach(function (cmd) {
            cmd.execute(x);
        }); });
        return ret;
    }
    wx.combinedCommand = combinedCommand;
})(wx || (wx = {}));
var wx;
(function (wx) {
    "use strict";
    var compiler;
    (function (compiler) {
        var stringDouble = '"(?:[^"\\\\]|\\\\.)*"';
        var stringSingle = "'(?:[^'\\\\]|\\\\.)*'";
        var stringRegexp = '/(?:[^/\\\\]|\\\\.)*/\w*';
        var specials = ',"\'{}()/:[\\]';
        var everyThingElse = '[^\\s:,/][^' + specials + ']*[^\\s' + specials + ']';
        var oneNotSpace = '[^\\s]';
        var bindingToken = RegExp(stringDouble + '|' + stringSingle + '|' + stringRegexp + '|' + everyThingElse + '|' + oneNotSpace, 'g');
        var divisionLookBehind = /[\])"'A-Za-z0-9_$]+$/;
        var keywordRegexLookBehind = { 'in': 1, 'return': 1, 'typeof': 1 };
        function parseObjectLiteral(objectLiteralString) {
            var str = objectLiteralString.trim();
            if (str.charCodeAt(0) === 123)
                str = str.slice(1, -1);
            var result = new Array(), toks = str.match(bindingToken), key, values, depth = 0;
            if (toks) {
                toks.push(',');
                for (var i = 0, tok; tok = toks[i]; ++i) {
                    var c = tok.charCodeAt(0);
                    if (c === 44) {
                        if (depth <= 0) {
                            if (key)
                                result.push(values ? { key: key, value: values.join('') } : { 'unknown': key, value: undefined });
                            key = values = depth = 0;
                            continue;
                        }
                    }
                    else if (c === 58) {
                        if (!values)
                            continue;
                    }
                    else if (c === 47 && i && tok.length > 1) {
                        var match = toks[i - 1].match(divisionLookBehind);
                        if (match && !keywordRegexLookBehind[match[0]]) {
                            str = str.substr(str.indexOf(tok) + 1);
                            toks = str.match(bindingToken);
                            toks.push(',');
                            i = -1;
                            tok = '/';
                        }
                    }
                    else if (c === 40 || c === 123 || c === 91) {
                        ++depth;
                    }
                    else if (c === 41 || c === 125 || c === 93) {
                        --depth;
                    }
                    else if (!key && !values) {
                        key = (c === 34 || c === 39) ? tok.slice(1, -1) : tok;
                        continue;
                    }
                    if (values)
                        values.push(tok);
                    else
                        values = [tok];
                }
            }
            return result;
        }
        compiler.parseObjectLiteral = parseObjectLiteral;
        var hookField = "___runtimeHooks";
        function noop() {
        }
        function extend(dst, obj) {
            var key;
            for (key in obj) {
                if (obj.hasOwnProperty(key)) {
                    dst[key] = obj[key];
                }
            }
            return dst;
        }
        function isDefined(value) {
            return typeof value !== "undefined";
        }
        function $parseMinErr(module, message, arg1, arg2, arg3, arg4, arg5) {
            var args = arguments;
            message = message.replace(/{(\d)}/g, function (match) {
                return args[2 + parseInt(match[1])];
            });
            throw new SyntaxError(message);
        }
        function lowercase(string) {
            return typeof string === "string" ? string.toLowerCase() : string;
        }
        function ensureSafeMemberName(name, fullExpression) {
            if (name === "constructor") {
                throw $parseMinErr("isecfld", "Referencing \"constructor\" field in WebRx expressions is disallowed! Expression: {0}", fullExpression);
            }
            return name;
        }
        function ensureSafeObject(obj, fullExpression) {
            if (obj) {
                if (obj.constructor === obj) {
                    throw $parseMinErr("isecfn", "Referencing Function in WebRx expressions is disallowed! Expression: {0}", fullExpression);
                }
                else if (obj.document && obj.location && obj.alert && obj.setInterval) {
                    throw $parseMinErr("isecwindow", "Referencing the Window in WebRx expressions is disallowed! Expression: {0}", fullExpression);
                }
                else if (obj.children && (obj.nodeName || (obj.prop && obj.attr && obj.find))) {
                    throw $parseMinErr("isecdom", "Referencing DOM nodes in WebRx expressions is disallowed! Expression: {0}", fullExpression);
                }
            }
            return obj;
        }
        var OPERATORS = {
            'null': function () {
                return null;
            },
            'true': function () {
                return true;
            },
            'false': function () {
                return false;
            },
            undefined: noop,
            '+': function (self, locals, a, b) {
                a = a(self, locals);
                b = b(self, locals);
                if (isDefined(a)) {
                    if (isDefined(b)) {
                        return a + b;
                    }
                    return a;
                }
                return isDefined(b) ? b : undefined;
            },
            '-': function (self, locals, a, b) {
                a = a(self, locals);
                b = b(self, locals);
                return (isDefined(a) ? a : 0) - (isDefined(b) ? b : 0);
            },
            '*': function (self, locals, a, b) {
                return a(self, locals) * b(self, locals);
            },
            '/': function (self, locals, a, b) {
                return a(self, locals) / b(self, locals);
            },
            '%': function (self, locals, a, b) {
                return a(self, locals) % b(self, locals);
            },
            '^': function (self, locals, a, b) {
                return a(self, locals) ^ b(self, locals);
            },
            '=': noop,
            '===': function (self, locals, a, b) {
                return a(self, locals) === b(self, locals);
            },
            '!==': function (self, locals, a, b) {
                return a(self, locals) !== b(self, locals);
            },
            '==': function (self, locals, a, b) {
                return a(self, locals) === b(self, locals);
            },
            '!=': function (self, locals, a, b) {
                return a(self, locals) !== b(self, locals);
            },
            '<': function (self, locals, a, b) {
                return a(self, locals) < b(self, locals);
            },
            '>': function (self, locals, a, b) {
                return a(self, locals) > b(self, locals);
            },
            '<=': function (self, locals, a, b) {
                return a(self, locals) <= b(self, locals);
            },
            '>=': function (self, locals, a, b) {
                return a(self, locals) >= b(self, locals);
            },
            '&&': function (self, locals, a, b) {
                return a(self, locals) && b(self, locals);
            },
            '||': function (self, locals, a, b) {
                return a(self, locals) || b(self, locals);
            },
            '&': function (self, locals, a, b) {
                return a(self, locals) & b(self, locals);
            },
            '|': function (self, locals, a, b) {
                return b(self, locals)(self, locals, a(self, locals));
            },
            '!': function (self, locals, a) {
                return !a(self, locals);
            }
        };
        var ESCAPE = { "n": "\n", "f": "\f", "r": "\r", "t": "\t", "v": "\v", "'": "'", '"': "\"" };
        var Lexer = (function () {
            function Lexer(options) {
                this.options = options;
            }
            Lexer.prototype.lex = function (text) {
                this.text = text;
                this.index = 0;
                this.ch = undefined;
                this.lastCh = ":";
                this.tokens = [];
                var token;
                var json = [];
                while (this.index < this.text.length) {
                    this.ch = this.text.charAt(this.index);
                    if (this.is("\"'")) {
                        this.readString(this.ch);
                    }
                    else if (this.isNumber(this.ch) || this.is(".") && this.isNumber(this.peek())) {
                        this.readNumber();
                    }
                    else if (this.isIdent(this.ch)) {
                        this.readIdent();
                        if (this.was("{,") && json[0] === "{" && (token = this.tokens[this.tokens.length - 1])) {
                            token.json = token.text.indexOf(".") === -1;
                        }
                    }
                    else if (this.is("(){}[].,;:?")) {
                        this.tokens.push({
                            index: this.index,
                            text: this.ch,
                            json: (this.was(":[,") && this.is("{[")) || this.is("}]:,")
                        });
                        if (this.is("{["))
                            json.unshift(this.ch);
                        if (this.is("}]"))
                            json.shift();
                        this.index++;
                    }
                    else if (this.isWhitespace(this.ch)) {
                        this.index++;
                        continue;
                    }
                    else {
                        var ch2 = this.ch + this.peek();
                        var ch3 = ch2 + this.peek(2);
                        var fn = OPERATORS[this.ch];
                        var fn2 = OPERATORS[ch2];
                        var fn3 = OPERATORS[ch3];
                        if (fn3) {
                            this.tokens.push({ index: this.index, text: ch3, fn: fn3 });
                            this.index += 3;
                        }
                        else if (fn2) {
                            this.tokens.push({ index: this.index, text: ch2, fn: fn2 });
                            this.index += 2;
                        }
                        else if (fn) {
                            this.tokens.push({
                                index: this.index,
                                text: this.ch,
                                fn: fn,
                                json: (this.was("[,:") && this.is(" + -"))
                            });
                            this.index += 1;
                        }
                        else {
                            this.throwError("Unexpected next character ", this.index, this.index + 1);
                        }
                    }
                    this.lastCh = this.ch;
                }
                return this.tokens;
            };
            Lexer.prototype.is = function (chars) {
                return chars.indexOf(this.ch) !== -1;
            };
            Lexer.prototype.was = function (chars) {
                return chars.indexOf(this.lastCh) !== -1;
            };
            Lexer.prototype.peek = function (i) {
                var num = i || 1;
                return (this.index + num < this.text.length) ? this.text.charAt(this.index + num) : false;
            };
            Lexer.prototype.isNumber = function (ch) {
                return ("0" <= ch && ch <= "9");
            };
            Lexer.prototype.isWhitespace = function (ch) {
                return (ch === " " || ch === "\r" || ch === "\t" || ch === "\n" || ch === "\v" || ch === "\u00A0");
            };
            Lexer.prototype.isIdent = function (ch) {
                return ("a" <= ch && ch <= "z" || "A" <= ch && ch <= "Z" || "_" === ch || ch === "$" || ch === "@");
            };
            Lexer.prototype.isExpOperator = function (ch) {
                return (ch === "-" || ch === "+" || this.isNumber(ch));
            };
            Lexer.prototype.throwError = function (error, start, end) {
                end = end || this.index;
                var colStr = (isDefined(start) ? "s " + start + "-" + this.index + " [" + this.text.substring(start, end) + "]" : " " + end);
                throw $parseMinErr("lexerr", "Lexer Error: {0} at column{1} in expression [{2}].", error, colStr, this.text);
            };
            Lexer.prototype.readNumber = function () {
                var n = "";
                var start = this.index;
                while (this.index < this.text.length) {
                    var ch = lowercase(this.text.charAt(this.index));
                    if (ch === "." || this.isNumber(ch)) {
                        n += ch;
                    }
                    else {
                        var peekCh = this.peek();
                        if (ch === "e" && this.isExpOperator(peekCh)) {
                            n += ch;
                        }
                        else if (this.isExpOperator(ch) && peekCh && this.isNumber(peekCh) && n.charAt(n.length - 1) === "e") {
                            n += ch;
                        }
                        else if (this.isExpOperator(ch) && (!peekCh || !this.isNumber(peekCh)) && n.charAt(n.length - 1) === "e") {
                            this.throwError("Invalid exponent");
                        }
                        else {
                            break;
                        }
                    }
                    this.index++;
                }
                n = 1 * n;
                this.tokens.push({
                    index: start,
                    text: n,
                    json: true,
                    fn: function () {
                        return n;
                    }
                });
            };
            Lexer.prototype.readIdent = function () {
                var parser = this;
                var ident = "";
                var start = this.index;
                var lastDot, peekIndex, methodName, ch;
                while (this.index < this.text.length) {
                    ch = this.text.charAt(this.index);
                    if (ch === "." || this.isIdent(ch) || this.isNumber(ch)) {
                        if (ch === ".")
                            lastDot = this.index;
                        ident += ch;
                    }
                    else {
                        break;
                    }
                    this.index++;
                }
                if (lastDot) {
                    peekIndex = this.index;
                    while (peekIndex < this.text.length) {
                        ch = this.text.charAt(peekIndex);
                        if (ch === "(") {
                            methodName = ident.substr(lastDot - start + 1);
                            ident = ident.substr(0, lastDot - start);
                            this.index = peekIndex;
                            break;
                        }
                        if (this.isWhitespace(ch)) {
                            peekIndex++;
                        }
                        else {
                            break;
                        }
                    }
                }
                var token = {
                    index: start,
                    text: ident
                };
                if (OPERATORS.hasOwnProperty(ident)) {
                    token.fn = OPERATORS[ident];
                    token.json = OPERATORS[ident];
                }
                else {
                    var getter = getterFn(ident, this.options, this.text);
                    token.fn = extend(function (self, locals) {
                        return (getter(self, locals));
                    }, {
                        assign: function (self, value, locals) {
                            return setter(self, ident, value, parser.text, parser.options, locals);
                        }
                    });
                }
                this.tokens.push(token);
                if (methodName) {
                    this.tokens.push({
                        index: lastDot,
                        text: ".",
                        json: false
                    });
                    this.tokens.push({
                        index: lastDot + 1,
                        text: methodName,
                        json: false
                    });
                }
            };
            Lexer.prototype.readString = function (quote) {
                var start = this.index;
                this.index++;
                var value = "";
                var rawString = quote;
                var escape = false;
                while (this.index < this.text.length) {
                    var ch = this.text.charAt(this.index);
                    rawString += ch;
                    if (escape) {
                        if (ch === "u") {
                            var hex = this.text.substring(this.index + 1, this.index + 5);
                            if (!hex.match(/[\da-f]{4}/i))
                                this.throwError("Invalid unicode escape [\\u" + hex + "]");
                            this.index += 4;
                            value += String.fromCharCode(parseInt(hex, 16));
                        }
                        else {
                            var rep = ESCAPE[ch];
                            if (rep) {
                                value += rep;
                            }
                            else {
                                value += ch;
                            }
                        }
                        escape = false;
                    }
                    else if (ch === "\\") {
                        escape = true;
                    }
                    else if (ch === quote) {
                        this.index++;
                        this.tokens.push({
                            index: start,
                            text: rawString,
                            string: value,
                            json: true,
                            fn: function () {
                                return value;
                            }
                        });
                        return;
                    }
                    else {
                        value += ch;
                    }
                    this.index++;
                }
                this.throwError("Unterminated quote", start);
            };
            return Lexer;
        })();
        var Parser = (function () {
            function Parser(lexer, options) {
                this.lexer = lexer;
                this.options = options || { filters: {} };
            }
            Parser.prototype.parse = function (text) {
                this.text = text;
                this.tokens = this.lexer.lex(text);
                var value = this.statements();
                if (this.tokens.length !== 0) {
                    this.throwError("is an unexpected token", this.tokens[0]);
                }
                value.literal = !!value.literal;
                value.constant = !!value.constant;
                return value;
            };
            Parser.prototype.primary = function () {
                var primary;
                if (this.expect("(")) {
                    primary = this.filterChain();
                    this.consume(")");
                }
                else if (this.expect("[")) {
                    primary = this.arrayDeclaration();
                }
                else if (this.expect("{")) {
                    primary = this.object();
                }
                else {
                    var token = this.expect();
                    primary = token.fn;
                    if (!primary) {
                        this.throwError("not a primary expression", token);
                    }
                    if (token.json) {
                        primary.constant = true;
                        primary.literal = true;
                    }
                }
                var next, context;
                while ((next = this.expect("(", "[", "."))) {
                    if (next.text === "(") {
                        primary = this.functionCall(primary, context);
                        context = null;
                    }
                    else if (next.text === "[") {
                        context = primary;
                        primary = this.objectIndex(primary);
                    }
                    else if (next.text === ".") {
                        context = primary;
                        primary = this.fieldAccess(primary);
                    }
                    else {
                        this.throwError("IMPOSSIBLE");
                    }
                }
                return primary;
            };
            Parser.prototype.throwError = function (msg, token) {
                throw $parseMinErr("syntax", "WebRx Syntax Error: Token '{0}' {1} at column {2} of the expression [{3}] starting at [{4}].", token.text, msg, (token.index + 1), this.text, this.text.substring(token.index));
            };
            Parser.prototype.peekToken = function () {
                if (this.tokens.length === 0)
                    throw $parseMinErr("ueoe", "Unexpected end of expression: {0}", this.text);
                return this.tokens[0];
            };
            Parser.prototype.peek = function (e1, e2, e3, e4) {
                if (this.tokens.length > 0) {
                    var token = this.tokens[0];
                    var t = token.text;
                    if (t === e1 || t === e2 || t === e3 || t === e4 || (!e1 && !e2 && !e3 && !e4)) {
                        return token;
                    }
                }
                return false;
            };
            Parser.prototype.expect = function (e1, e2, e3, e4) {
                var token = this.peek(e1, e2, e3, e4);
                if (token) {
                    this.tokens.shift();
                    return token;
                }
                return false;
            };
            Parser.prototype.consume = function (e1) {
                if (!this.expect(e1)) {
                    this.throwError("is unexpected, expecting [" + e1 + "]", this.peek());
                }
            };
            Parser.prototype.unaryFn = function (fn, right) {
                return extend(function (self, locals) {
                    return fn(self, locals, right);
                }, {
                    constant: right.constant
                });
            };
            Parser.prototype.ternaryFn = function (left, middle, right) {
                return extend(function (self, locals) {
                    return left(self, locals) ? middle(self, locals) : right(self, locals);
                }, {
                    constant: left.constant && middle.constant && right.constant
                });
            };
            Parser.prototype.binaryFn = function (left, fn, right) {
                return extend(function (self, locals) {
                    return fn(self, locals, left, right);
                }, {
                    constant: left.constant && right.constant
                });
            };
            Parser.prototype.statements = function () {
                var statements = [];
                while (true) {
                    if (this.tokens.length > 0 && !this.peek("}", ")", ";", "]"))
                        statements.push(this.filterChain());
                    if (!this.expect(";")) {
                        return (statements.length === 1) ? statements[0] : function (self, locals) {
                            var value;
                            for (var i = 0; i < statements.length; i++) {
                                var statement = statements[i];
                                if (statement) {
                                    value = statement(self, locals);
                                }
                            }
                            return value;
                        };
                    }
                }
            };
            Parser.prototype.filterChain = function () {
                var left = this.expression();
                var token;
                while (true) {
                    if ((token = this.expect("|"))) {
                        left = this.binaryFn(left, token.fn, this.filter());
                    }
                    else {
                        return left;
                    }
                }
            };
            Parser.prototype.filter = function () {
                var token = this.expect();
                var fn = this.options.filters[token.text];
                var argsFn = [];
                while (true) {
                    if ((token = this.expect(":"))) {
                        argsFn.push(this.expression());
                    }
                    else {
                        var fnInvoke = function (self, locals, input) {
                            var args = [input];
                            for (var i = 0; i < argsFn.length; i++) {
                                args.push(argsFn[i](self, locals));
                            }
                            return fn.apply(self, args);
                        };
                        return function () {
                            return fnInvoke;
                        };
                    }
                }
            };
            Parser.prototype.expression = function () {
                return this.assignment();
            };
            Parser.prototype.assignment = function () {
                var left = this.ternary();
                var right;
                var token;
                if ((token = this.expect("="))) {
                    if (!left.assign) {
                        this.throwError("implies assignment but [" + this.text.substring(0, token.index) + "] can not be assigned to", token);
                    }
                    right = this.ternary();
                    return function (scope, locals) {
                        return left.assign(scope, right(scope, locals), locals);
                    };
                }
                return left;
            };
            Parser.prototype.ternary = function () {
                var left = this.logicalOR();
                var middle;
                var token;
                if ((token = this.expect("?"))) {
                    middle = this.ternary();
                    if ((token = this.expect(":"))) {
                        return this.ternaryFn(left, middle, this.ternary());
                    }
                    else {
                        this.throwError("expected :", token);
                    }
                }
                return left;
            };
            Parser.prototype.logicalOR = function () {
                var left = this.logicalAND();
                var token;
                while (true) {
                    if ((token = this.expect("||"))) {
                        left = this.binaryFn(left, token.fn, this.logicalAND());
                    }
                    else {
                        return left;
                    }
                }
            };
            Parser.prototype.logicalAND = function () {
                var left = this.equality();
                var token;
                if ((token = this.expect("&&"))) {
                    left = this.binaryFn(left, token.fn, this.logicalAND());
                }
                return left;
            };
            Parser.prototype.equality = function () {
                var left = this.relational();
                var token;
                if ((token = this.expect("==", "!=", "===", "!=="))) {
                    left = this.binaryFn(left, token.fn, this.equality());
                }
                return left;
            };
            Parser.prototype.relational = function () {
                var left = this.additive();
                var token;
                if ((token = this.expect("<", ">", "<=", ">="))) {
                    left = this.binaryFn(left, token.fn, this.relational());
                }
                return left;
            };
            Parser.prototype.additive = function () {
                var left = this.multiplicative();
                var token;
                while ((token = this.expect("+", "-"))) {
                    left = this.binaryFn(left, token.fn, this.multiplicative());
                }
                return left;
            };
            Parser.prototype.multiplicative = function () {
                var left = this.unary();
                var token;
                while ((token = this.expect("*", "/", "%"))) {
                    left = this.binaryFn(left, token.fn, this.unary());
                }
                return left;
            };
            Parser.prototype.unary = function () {
                var token;
                if (this.expect("+")) {
                    return this.primary();
                }
                else if ((token = this.expect("-"))) {
                    return this.binaryFn(ZERO, token.fn, this.unary());
                }
                else if ((token = this.expect("!"))) {
                    return this.unaryFn(token.fn, this.unary());
                }
                else {
                    return this.primary();
                }
            };
            Parser.prototype.fieldAccess = function (object) {
                var parser = this;
                var field = this.expect().text;
                var getter = getterFn(field, this.options, this.text);
                return extend(function (scope, locals, self) {
                    return getter(self || object(scope, locals));
                }, {
                    assign: function (scope, value, locals) {
                        return setter(object(scope, locals), field, value, parser.text, parser.options, locals);
                    }
                });
            };
            Parser.prototype.objectIndex = function (obj) {
                var parser = this;
                var indexFn = this.expression();
                this.consume("]");
                return extend(function (self, locals) {
                    var o = obj(self, locals), i = indexFn(self, locals), v, p;
                    if (!o)
                        return undefined;
                    var hooks = getRuntimeHooks(locals);
                    if (hooks && hooks.readIndexHook)
                        v = hooks.readIndexHook(o, i);
                    else
                        v = o[i];
                    v = ensureSafeObject(v, parser.text);
                    return v;
                }, {
                    assign: function (self, value, locals) {
                        var key = indexFn(self, locals);
                        var safe = ensureSafeObject(obj(self, locals), parser.text);
                        var hooks = getRuntimeHooks(locals);
                        if (hooks && hooks.writeIndexHook)
                            return hooks.writeIndexHook(safe, key, value);
                        return safe[key] = value;
                    }
                });
            };
            Parser.prototype.functionCall = function (fn, contextGetter) {
                if (this.options.disallowFunctionCalls)
                    this.throwError("Function calls are not allowed");
                var argsFn = [];
                if (this.peekToken().text !== ")") {
                    do {
                        argsFn.push(this.expression());
                    } while (this.expect(","));
                }
                this.consume(")");
                var parser = this;
                return function (scope, locals) {
                    var args = [];
                    var context = contextGetter ? contextGetter(scope, locals) : scope;
                    for (var i = 0; i < argsFn.length; i++) {
                        args.push(argsFn[i](scope, locals));
                    }
                    var fnPtr = fn(scope, locals, context) || noop;
                    ensureSafeObject(context, parser.text);
                    ensureSafeObject(fnPtr, parser.text);
                    var v = fnPtr.apply ? fnPtr.apply(context, args) : fnPtr(args[0], args[1], args[2], args[3], args[4]);
                    return ensureSafeObject(v, parser.text);
                };
            };
            Parser.prototype.arrayDeclaration = function () {
                var elementFns = [];
                var allConstant = true;
                if (this.peekToken().text !== "]") {
                    do {
                        if (this.peek("]")) {
                            break;
                        }
                        var elementFn = this.expression();
                        elementFns.push(elementFn);
                        if (!elementFn.constant) {
                            allConstant = false;
                        }
                    } while (this.expect(","));
                }
                this.consume("]");
                return extend(function (self, locals) {
                    var array = [];
                    for (var i = 0; i < elementFns.length; i++) {
                        array.push(elementFns[i](self, locals));
                    }
                    return array;
                }, {
                    literal: true,
                    constant: allConstant
                });
            };
            Parser.prototype.object = function () {
                var keyValues = [];
                var allConstant = true;
                if (this.peekToken().text !== "}") {
                    do {
                        if (this.peek("}")) {
                            break;
                        }
                        var token = this.expect(), key = token.string || token.text;
                        this.consume(":");
                        var value = this.expression();
                        keyValues.push({ key: key, value: value });
                        if (!value.constant) {
                            allConstant = false;
                        }
                    } while (this.expect(","));
                }
                this.consume("}");
                return extend(function (self, locals) {
                    var object = {};
                    for (var i = 0; i < keyValues.length; i++) {
                        var keyValue = keyValues[i];
                        object[keyValue.key] = keyValue.value(self, locals);
                    }
                    return object;
                }, {
                    literal: true,
                    constant: allConstant
                });
            };
            return Parser;
        })();
        function ZERO() {
            return 0;
        }
        ;
        function setter(obj, path, setValue, fullExp, options, locals) {
            var element = path.split("."), key;
            var i;
            var propertyObj;
            var hooks = getRuntimeHooks(locals);
            if (hooks) {
                for (i = 0; element.length > 1; i++) {
                    key = ensureSafeMemberName(element.shift(), fullExp);
                    propertyObj = hooks.readFieldHook ? hooks.readFieldHook(obj, key) : obj[key];
                    if (!propertyObj) {
                        propertyObj = {};
                        if (hooks.writeFieldHook)
                            hooks.writeFieldHook(obj, key, propertyObj);
                        else
                            obj[key] = propertyObj;
                    }
                    obj = propertyObj;
                }
            }
            else {
                for (i = 0; element.length > 1; i++) {
                    key = ensureSafeMemberName(element.shift(), fullExp);
                    propertyObj = obj[key];
                    if (!propertyObj) {
                        propertyObj = {};
                        obj[key] = propertyObj;
                    }
                    obj = propertyObj;
                }
            }
            key = ensureSafeMemberName(element.shift(), fullExp);
            if (hooks && hooks.writeFieldHook)
                hooks.writeFieldHook(obj, key, setValue);
            else
                obj[key] = setValue;
            return setValue;
        }
        var getterFnCache = {};
        function cspSafeGetterFn(key0, key1, key2, key3, key4, fullExp, options) {
            ensureSafeMemberName(key0, fullExp);
            ensureSafeMemberName(key1, fullExp);
            ensureSafeMemberName(key2, fullExp);
            ensureSafeMemberName(key3, fullExp);
            ensureSafeMemberName(key4, fullExp);
            return function (scope, locals) {
                var pathVal = (locals && locals.hasOwnProperty(key0)) ? locals : scope;
                var hooks = getRuntimeHooks(locals);
                if (hooks && hooks.readFieldHook) {
                    if (pathVal == null)
                        return pathVal;
                    pathVal = hooks.readFieldHook(pathVal, key0);
                    if (!key1)
                        return pathVal;
                    if (pathVal == null)
                        return undefined;
                    pathVal = hooks.readFieldHook(pathVal, key1);
                    if (!key2)
                        return pathVal;
                    if (pathVal == null)
                        return undefined;
                    pathVal = hooks.readFieldHook(pathVal, key2);
                    if (!key3)
                        return pathVal;
                    if (pathVal == null)
                        return undefined;
                    pathVal = hooks.readFieldHook(pathVal, key3);
                    if (!key4)
                        return pathVal;
                    if (pathVal == null)
                        return undefined;
                    pathVal = hooks.readFieldHook(pathVal, key4);
                    return pathVal;
                }
                if (pathVal == null)
                    return pathVal;
                pathVal = pathVal[key0];
                if (!key1)
                    return pathVal;
                if (pathVal == null)
                    return undefined;
                pathVal = pathVal[key1];
                if (!key2)
                    return pathVal;
                if (pathVal == null)
                    return undefined;
                pathVal = pathVal[key2];
                if (!key3)
                    return pathVal;
                if (pathVal == null)
                    return undefined;
                pathVal = pathVal[key3];
                if (!key4)
                    return pathVal;
                if (pathVal == null)
                    return undefined;
                pathVal = pathVal[key4];
                return pathVal;
            };
        }
        function simpleGetterFn1(key0, fullExp) {
            ensureSafeMemberName(key0, fullExp);
            return function (scope, locals) {
                scope = ((locals && locals.hasOwnProperty(key0)) ? locals : scope);
                if (scope == null)
                    return undefined;
                var hooks = getRuntimeHooks(locals);
                if (hooks && hooks.readFieldHook)
                    return hooks.readFieldHook(scope, key0);
                return scope[key0];
            };
        }
        function simpleGetterFn2(key0, key1, fullExp) {
            ensureSafeMemberName(key0, fullExp);
            ensureSafeMemberName(key1, fullExp);
            return function (scope, locals) {
                var hooks = getRuntimeHooks(locals);
                if (hooks && hooks.readFieldHook) {
                    scope = (locals && locals.hasOwnProperty(key0)) ? locals : scope;
                    if (scope == null)
                        return undefined;
                    scope = hooks.readFieldHook(scope, key0);
                    return scope == null ? undefined : hooks.readFieldHook(scope, key1);
                }
                scope = ((locals && locals.hasOwnProperty(key0)) ? locals : scope)[key0];
                return scope == null ? undefined : scope[key1];
            };
        }
        function getterFn(path, options, fullExp) {
            if (getterFnCache.hasOwnProperty(path)) {
                return getterFnCache[path];
            }
            var pathKeys = path.split("."), pathKeysLength = pathKeys.length, fn;
            if (pathKeysLength === 1) {
                fn = simpleGetterFn1(pathKeys[0], fullExp);
            }
            else if (pathKeysLength === 2) {
                fn = simpleGetterFn2(pathKeys[0], pathKeys[1], fullExp);
            }
            else {
                if (pathKeysLength < 6) {
                    fn = cspSafeGetterFn(pathKeys[0], pathKeys[1], pathKeys[2], pathKeys[3], pathKeys[4], fullExp, options);
                }
                else {
                    fn = function (scope, locals) {
                        var _locals = {};
                        Object.keys(locals).forEach(function (x) { return _locals[x] = locals[x]; });
                        var i = 0, val;
                        do {
                            val = cspSafeGetterFn(pathKeys[i++], pathKeys[i++], pathKeys[i++], pathKeys[i++], pathKeys[i++], fullExp, options)(scope, locals);
                            scope = val;
                            locals = {};
                            Object.keys(_locals).forEach(function (x) { return locals[x] = _locals[x]; });
                        } while (i < pathKeysLength);
                        return val;
                    };
                }
            }
            if (path !== "hasOwnProperty") {
                getterFnCache[path] = fn;
            }
            return fn;
        }
        function getRuntimeHooks(locals) {
            return locals !== undefined ? locals[hookField] : undefined;
        }
        compiler.getRuntimeHooks = getRuntimeHooks;
        function setRuntimeHooks(locals, hooks) {
            locals[hookField] = hooks;
        }
        compiler.setRuntimeHooks = setRuntimeHooks;
        function compileExpression(src, options, cache) {
            if (typeof src !== "string") {
                throw new TypeError("src must be a string, instead saw '" + typeof src + "'");
            }
            var lexer = new Lexer({});
            var parser = new Parser(lexer, options);
            if (!cache) {
                return parser.parse(src);
            }
            var cached = cache[src];
            if (!cached) {
                cached = cache[src] = parser.parse(src);
            }
            return cached;
        }
        compiler.compileExpression = compileExpression;
    })(compiler || (compiler = {}));
    var internal;
    (function (internal) {
        var exports = compiler;
        internal.expressionCompilerConstructor = exports;
    })(internal = wx.internal || (wx.internal = {}));
})(wx || (wx = {}));
;
var wx;
(function (wx) {
    "use strict";
    var rsingleTag = /^<([\w-]+)\s*\/?>(?:<\/\1>|)$/, rxhtmlTag = /<(?!area|br|col|embed|hr|img|input|link|meta|param)(([\w:-]+)[^>]*)\/>/gi, rtagName = /<([\w:-]+)/, rhtml = /<|&#?\w+;/, rscriptType = /^$|\/(?:java|ecma)script/i, wrapMap = {
        option: [1, "<select multiple='multiple'>", "</select>"],
        thead: [1, "<table>", "</table>"],
        col: [2, "<table><colgroup>", "</colgroup></table>"],
        tr: [2, "<table>", "</table>"],
        td: [3, "<table>", "</table>"],
        _default: [0, "", ""]
    };
    wrapMap.optgroup = wrapMap.option;
    wrapMap.tbody = wrapMap.tfoot = wrapMap.colgroup = wrapMap.caption = wrapMap.thead;
    wrapMap.th = wrapMap.td;
    var supportsCreateHTMLDocument = (function () {
        var doc = document.implementation.createHTMLDocument("");
        if (!doc.body) {
            return false;
        }
        doc.body.innerHTML = "<form></form><form></form>";
        return doc.body.childNodes.length === 2;
    })();
    function merge(first, second) {
        var len = +second.length, j = 0, i = first.length;
        for (; j < len; j++) {
            first[i++] = second[j];
        }
        first.length = i;
        return first;
    }
    function buildFragment(elems, context) {
        var elem, tmp, tag, wrap, j, fragment = context.createDocumentFragment(), nodes = [], i = 0, l = elems.length;
        for (; i < l; i++) {
            elem = elems[i];
            if (elem || elem === 0) {
                if (typeof elem === "object") {
                    merge(nodes, elem.nodeType ? [elem] : elem);
                }
                else if (!rhtml.test(elem)) {
                    nodes.push(context.createTextNode(elem));
                }
                else {
                    tmp = tmp || fragment.appendChild(context.createElement("div"));
                    tag = (rtagName.exec(elem) || ["", ""])[1].toLowerCase();
                    wrap = wrapMap[tag] || wrapMap._default;
                    tmp.innerHTML = wrap[1] + elem.replace(rxhtmlTag, "<$1></$2>") + wrap[2];
                    j = wrap[0];
                    while (j--) {
                        tmp = tmp.lastChild;
                    }
                    merge(nodes, tmp.childNodes);
                    tmp = fragment.firstChild;
                    tmp.textContent = "";
                }
            }
        }
        fragment.textContent = "";
        i = 0;
        while ((elem = nodes[i++])) {
            if (elem.nodeType !== 1 || elem.tagName.toLowerCase() !== "script" || !rscriptType.test(elem.type || "")) {
                fragment.appendChild(elem);
            }
        }
        return fragment;
    }
    var HtmlTemplateEngine = (function () {
        function HtmlTemplateEngine() {
        }
        HtmlTemplateEngine.prototype.parse = function (data) {
            var context = supportsCreateHTMLDocument ? document.implementation.createHTMLDocument("") : document;
            var parsed = rsingleTag.exec(data);
            if (parsed) {
                return [context.createElement(parsed[1])];
            }
            parsed = buildFragment([data], context);
            var result = merge([], parsed.childNodes);
            return result;
        };
        return HtmlTemplateEngine;
    })();
    var internal;
    (function (internal) {
        internal.htmlTemplateEngineConstructor = HtmlTemplateEngine;
    })(internal = wx.internal || (wx.internal = {}));
})(wx || (wx = {}));
var wx;
(function (wx) {
    "use strict";
    var MessageBus = (function () {
        function MessageBus() {
            this.messageBus = {};
            this.schedulerMappings = {};
        }
        MessageBus.prototype.listen = function (contract) {
            return this.setupSubjectIfNecessary(contract).skip(1);
        };
        MessageBus.prototype.isRegistered = function (contract) {
            return this.messageBus.hasOwnProperty(contract);
        };
        MessageBus.prototype.registerMessageSource = function (source, contract) {
            return source.subscribe(this.setupSubjectIfNecessary(contract));
        };
        MessageBus.prototype.sendMessage = function (message, contract) {
            this.setupSubjectIfNecessary(contract).onNext(message);
        };
        MessageBus.prototype.registerScheduler = function (scheduler, contract) {
            this.schedulerMappings[contract] = scheduler;
        };
        MessageBus.prototype.setupSubjectIfNecessary = function (contract) {
            var ret = this.messageBus[contract];
            if (ret == null) {
                ret = internal.createScheduledSubject(this.getScheduler(contract), null, new Rx.BehaviorSubject(undefined));
                this.messageBus[contract] = ret;
            }
            return ret;
        };
        MessageBus.prototype.getScheduler = function (contract) {
            var scheduler = this.schedulerMappings[contract];
            return scheduler || Rx.Scheduler.currentThread;
        };
        return MessageBus;
    })();
    wx.messageBus;
    Object.defineProperty(wx, "messageBus", {
        get: function () {
            return wx.injector.get(wx.res.messageBus);
        }
    });
    var internal;
    (function (internal) {
        internal.messageBusConstructor = MessageBus;
    })(internal = wx.internal || (wx.internal = {}));
})(wx || (wx = {}));
var wx;
(function (wx) {
    "use strict";
    var StateActiveBinding = (function () {
        function StateActiveBinding(domManager, router) {
            this.priority = 5;
            this.domManager = domManager;
            this.router = router;
        }
        StateActiveBinding.prototype.applyBinding = function (node, options, ctx, state, module) {
            var _this = this;
            if (node.nodeType !== 1)
                internal.throwError("stateActive-binding only operates on elements!");
            if (options == null)
                internal.throwError("invalid binding-options!");
            var el = node;
            var compiled = this.domManager.compileBindingOptions(options, module);
            var exp;
            var observables = [];
            var opt = compiled;
            var paramsKeys = [];
            var stateName;
            var stateParams;
            var cssClass = "active";
            observables.push(wx.router.current.changed.startWith(wx.router.current()));
            if (typeof compiled === "function") {
                exp = compiled;
                observables.push(this.domManager.expressionToObservable(exp, ctx));
            }
            else {
                observables.push(this.domManager.expressionToObservable(opt.name, ctx));
                if (opt.params) {
                    Object.keys(opt.params).forEach(function (x) {
                        paramsKeys.push(x);
                        observables.push(_this.domManager.expressionToObservable(opt.params[x], ctx));
                    });
                }
                if (opt.cssClass) {
                    cssClass = this.domManager.evaluateExpression(opt.cssClass, ctx);
                }
            }
            state.cleanup.add(Rx.Observable.combineLatest(observables, function (_) { return wx.args2Array(arguments); }).subscribe(function (latest) {
                try {
                    var currentState = latest.shift();
                    stateName = wx.unwrapProperty(latest.shift());
                    stateParams = {};
                    for (var i = 0; i < paramsKeys.length; i++) {
                        stateParams[paramsKeys[i]] = wx.unwrapProperty(latest[i]);
                    }
                    var active = _this.router.includes(stateName, stateParams);
                    var classes = cssClass.split(/\s+/).map(function (x) { return x.trim(); }).filter(function (x) { return x; });
                    if (classes.length) {
                        wx.toggleCssClass.apply(null, [el, active].concat(classes));
                    }
                }
                catch (e) {
                    wx.app.defaultExceptionHandler.onNext(e);
                }
            }));
            state.cleanup.add(Rx.Disposable.create(function () {
                node = null;
                options = null;
                ctx = null;
                state = null;
                observables = null;
                compiled = null;
                stateName = null;
                stateParams = null;
                opt = null;
                paramsKeys = null;
            }));
        };
        StateActiveBinding.prototype.configure = function (options) {
        };
        return StateActiveBinding;
    })();
    var internal;
    (function (internal) {
        internal.stateActiveBindingConstructor = StateActiveBinding;
    })(internal = wx.internal || (wx.internal = {}));
})(wx || (wx = {}));
var wx;
(function (wx) {
    "use strict";
    var StateRefBinding = (function () {
        function StateRefBinding(domManager, router) {
            this.priority = 5;
            this.domManager = domManager;
            this.router = router;
        }
        StateRefBinding.prototype.applyBinding = function (node, options, ctx, state, module) {
            var _this = this;
            if (node.nodeType !== 1)
                internal.throwError("stateRef-binding only operates on elements!");
            if (options == null)
                internal.throwError("invalid binding-options!");
            var el = node;
            var isAnchor = el.tagName.toLowerCase() === "a";
            var anchor = isAnchor ? el : undefined;
            var compiled = this.domManager.compileBindingOptions(options, module);
            var exp;
            var observables = [];
            var opt = compiled;
            var paramsKeys = [];
            var stateName;
            var stateParams;
            if (typeof compiled === "function") {
                exp = compiled;
                observables.push(this.domManager.expressionToObservable(exp, ctx));
            }
            else {
                observables.push(this.domManager.expressionToObservable(opt.name, ctx));
                if (opt.params) {
                    Object.keys(opt.params).forEach(function (x) {
                        paramsKeys.push(x);
                        observables.push(_this.domManager.expressionToObservable(opt.params[x], ctx));
                    });
                }
            }
            state.cleanup.add(Rx.Observable.combineLatest(observables, function (_) {
                return wx.args2Array(arguments);
            }).subscribe(function (latest) {
                try {
                    stateName = wx.unwrapProperty(latest.shift());
                    stateParams = {};
                    for (var i = 0; i < paramsKeys.length; i++) {
                        stateParams[paramsKeys[i]] = wx.unwrapProperty(latest[i]);
                    }
                    if (anchor != null) {
                        anchor.href = _this.router.url(stateName, stateParams);
                    }
                }
                catch (e) {
                    wx.app.defaultExceptionHandler.onNext(e);
                }
            }));
            state.cleanup.add(Rx.Observable.fromEvent(el, "click").subscribe(function (e) {
                e.preventDefault();
                _this.router.go(stateName, stateParams, { location: true });
            }));
            state.cleanup.add(Rx.Disposable.create(function () {
                node = null;
                options = null;
                ctx = null;
                state = null;
                observables = null;
                compiled = null;
                stateName = null;
                stateParams = null;
                opt = null;
                paramsKeys = null;
            }));
        };
        StateRefBinding.prototype.configure = function (options) {
        };
        return StateRefBinding;
    })();
    var internal;
    (function (internal) {
        internal.stateRefBindingConstructor = StateRefBinding;
    })(internal = wx.internal || (wx.internal = {}));
})(wx || (wx = {}));
var wx;
(function (wx) {
    "use strict";
    var ViewBinding = (function () {
        function ViewBinding(domManager, router) {
            this.priority = 1000;
            this.controlsDescendants = true;
            this.domManager = domManager;
            this.router = router;
        }
        ViewBinding.prototype.applyBinding = function (node, options, ctx, state, module) {
            var _this = this;
            if (node.nodeType !== 1)
                internal.throwError("view-binding only operates on elements!");
            if (options == null)
                internal.throwError("invalid binding-options!");
            var el = node;
            var compiled = this.domManager.compileBindingOptions(options, module);
            var viewName = this.domManager.evaluateExpression(compiled, ctx);
            var currentConfig;
            var cleanup;
            function doCleanup() {
                if (cleanup) {
                    cleanup.dispose();
                    cleanup = null;
                }
            }
            if (viewName == null || typeof viewName !== "string")
                internal.throwError("views must be named!");
            state.cleanup.add(this.router.current.changed.startWith(this.router.current()).subscribe(function (newState) {
                try {
                    doCleanup();
                    cleanup = new Rx.CompositeDisposable();
                    var config = _this.router.getViewComponent(viewName);
                    if (config != null) {
                        if (!wx.isEqual(currentConfig, config)) {
                            cleanup.add(_this.applyTemplate(config.component, config.params, config.animations, el, ctx, module));
                            currentConfig = config;
                        }
                    }
                    else {
                        cleanup.add(_this.applyTemplate(null, null, currentConfig ? currentConfig.animations : {}, el, ctx, module));
                        currentConfig = {};
                    }
                }
                catch (e) {
                    wx.app.defaultExceptionHandler.onNext(e);
                }
            }));
            state.cleanup.add(Rx.Disposable.create(function () {
                node = null;
                options = null;
                ctx = null;
                state = null;
            }));
        };
        ViewBinding.prototype.configure = function (options) {
        };
        ViewBinding.prototype.applyTemplate = function (componentName, componentParams, animations, el, ctx, module) {
            var self = this;
            var oldElements = wx.nodeChildrenToArray(el);
            var combined = [];
            var obs;
            function removeOldElements() {
                oldElements.forEach(function (x) {
                    self.domManager.cleanNode(x);
                    el.removeChild(x);
                });
            }
            function instantiateComponent(animation) {
                ctx.$componentParams = componentParams;
                var container = document.createElement("div");
                var binding = wx.formatString("component: { name: '{0}', params: $componentParams }", componentName);
                container.setAttribute("data-bind", binding);
                if (animation != null)
                    animation.prepare(container);
                el.appendChild(container);
                self.domManager.applyBindings(ctx, container);
            }
            if (oldElements.length > 0) {
                var leaveAnimation;
                if (animations && animations.leave) {
                    if (typeof animations.leave === "string") {
                        leaveAnimation = module.animation(animations.leave);
                    }
                    else {
                        leaveAnimation = animations.leave;
                    }
                }
                if (leaveAnimation) {
                    leaveAnimation.prepare(oldElements);
                    obs = leaveAnimation.run(oldElements).continueWith(function () { return leaveAnimation.complete(oldElements); }).continueWith(removeOldElements);
                }
                else {
                    obs = Rx.Observable.startDeferred(removeOldElements);
                }
                combined.push(obs);
            }
            if (componentName != null) {
                var enterAnimation;
                if (animations && animations.enter) {
                    if (typeof animations.enter === "string") {
                        enterAnimation = module.animation(animations.enter);
                    }
                    else {
                        enterAnimation = animations.enter;
                    }
                }
                obs = Rx.Observable.startDeferred(function () { return instantiateComponent(enterAnimation); });
                if (enterAnimation) {
                    obs = obs.continueWith(enterAnimation.run(el.childNodes)).continueWith(function () { return enterAnimation.complete(el.childNodes); });
                }
                combined.push(obs);
            }
            if (combined.length > 1)
                obs = Rx.Observable.combineLatest(combined, wx.noop).take(1);
            else if (combined.length === 1)
                obs = combined[0].take(1);
            else
                obs = null;
            return obs ? (obs.subscribe() || Rx.Disposable.empty) : Rx.Disposable.empty;
        };
        return ViewBinding;
    })();
    var internal;
    (function (internal) {
        internal.viewBindingConstructor = ViewBinding;
    })(internal = wx.internal || (wx.internal = {}));
})(wx || (wx = {}));
var wx;
(function (wx) {
    "use strict";
    var reEscape = /[\-\[\]{}()+?.,\\\^$|#\s]/g;
    var reParam = /([:*])(\w+)/g;
    var RouteMatcher = (function () {
        function RouteMatcher(route, rules) {
            var _this = this;
            this.route = route;
            this.rules = rules;
            this.params = [];
            var re = route;
            if (typeof route === "string") {
                re = re.replace(reEscape, "\\$&");
                re = re.replace(reParam, function (_, mode, name) {
                    _this.params.push(name);
                    return mode === ":" ? "([^/]*)" : "(.*)";
                });
                re = new RegExp("^" + re + "$");
                this.parse = function (url) {
                    var i = 0;
                    var param, value;
                    var params = {};
                    var matches = url.match(re);
                    if (!matches) {
                        return null;
                    }
                    while (i < _this.params.length) {
                        param = _this.params[i++];
                        value = matches[i];
                        if (rules && param in rules && !_this.validateRule(rules[param], value)) {
                            return null;
                        }
                        params[param] = value;
                    }
                    return params;
                };
                this.stringify = function (params) {
                    params = params || {};
                    var param, re;
                    var result = route;
                    for (param in params) {
                        re = new RegExp("[:*]" + param + "\\b");
                        result = result.replace(re, params[param]);
                    }
                    return result.replace(reParam, "");
                };
            }
            else {
                this.parse = function (url) {
                    var matches = url.match(re);
                    return matches && { captures: matches.slice(1) };
                };
                this.stringify = function () { return ""; };
            }
        }
        RouteMatcher.prototype.stripTrailingSlash = function (route) {
            if (route.length === 0 || route === "/" || route.lastIndexOf("/") !== route.length - 1)
                return route;
            return route.substr(0, route.length - 1);
        };
        Object.defineProperty(RouteMatcher.prototype, "isAbsolute", {
            get: function () {
                return this.route.indexOf("/") === 0;
            },
            enumerable: true,
            configurable: true
        });
        RouteMatcher.prototype.concat = function (route) {
            var other = route;
            var a = this.stripTrailingSlash(this.route);
            var b = this.stripTrailingSlash(other.route);
            var rules = null;
            if (other.rules) {
                if (this.rules) {
                    Object.keys(this.rules).forEach(function (rule) {
                        if (other.rules.hasOwnProperty(rule)) {
                            wx.internal.throwError("route '{0}' and '{1}' have conflicting rule '{2}", a, b, rule);
                        }
                    });
                    rules = wx.extend(this.rules, wx.extend(other.rules, {}));
                }
                else {
                    rules = wx.extend(other.rules, {});
                }
            }
            else if (this.rules) {
                rules = wx.extend(this.rules, {});
            }
            if (a === "/")
                a = "";
            return wx.route(a + "/" + b, rules);
        };
        RouteMatcher.prototype.validateRule = function (rule, value) {
            var type = this.toString.call(rule).charAt(8);
            return type === "R" ? rule.test(value) : type === "F" ? rule(value) : rule == value;
        };
        return RouteMatcher;
    })();
    function route(route, rules) {
        return new RouteMatcher(route, rules);
    }
    wx.route = route;
})(wx || (wx = {}));
var wx;
(function (wx) {
    "use strict";
    var Router = (function () {
        function Router(domManager) {
            var _this = this;
            this.current = wx.property();
            this.states = {};
            this.pathSeparator = ".";
            this.parentPathDirective = "^";
            this.rootStateName = "$";
            this.validPathRegExp = /^[a-zA-Z]([\w-_]*$)/;
            this.domManager = domManager;
            this.reset(false);
            wx.app.history.onPopState.subscribe(function (e) {
                var state = e.state;
                var stateName = state.stateName;
                if (stateName != null) {
                    _this.go(stateName, state.params, { location: false });
                    wx.app.title(state.title);
                }
            });
            wx.app.title.changed.subscribe(function (x) {
                document.title = x;
                if (_this.current() != null)
                    _this.replaceHistoryState(_this.current(), x);
            });
        }
        Router.prototype.state = function (config) {
            this.registerStateInternal(config);
            return this;
        };
        Router.prototype.updateCurrentStateParams = function (withParamsAction) {
            var _current = this.current();
            withParamsAction(_current.params);
            this.replaceHistoryState(_current, wx.app.title());
        };
        Router.prototype.go = function (to, params, options) {
            to = this.mapPath(to);
            if (this.states[to] == null)
                internal.throwError("state '{0}' is not registered", to);
            this.activateState(to, params, options);
        };
        Router.prototype.get = function (state) {
            return this.states[state];
        };
        Router.prototype.is = function (state, params, options) {
            var _current = this.current();
            var isActive = _current.name === state;
            params = params || {};
            if (isActive) {
                var currentParamsKeys = Object.keys(_current.params);
                var paramsKeys = Object.keys(params);
                if (currentParamsKeys.length === paramsKeys.length) {
                    for (var i = 0; i < paramsKeys.length; i++) {
                        if (_current.params[paramsKeys[i]] != params[paramsKeys[i]]) {
                            isActive = false;
                            break;
                        }
                    }
                }
                else {
                    isActive = false;
                }
            }
            return isActive;
        };
        Router.prototype.includes = function (state, params, options) {
            var _current = this.current();
            var isActive = _current.name.indexOf(state) === 0;
            params = params || {};
            if (isActive) {
                var currentParamsKeys = Object.keys(_current.params);
                var paramsKeys = Object.keys(params);
                paramsKeys = paramsKeys.length <= currentParamsKeys.length ? paramsKeys : currentParamsKeys;
                for (var i = 0; i < paramsKeys.length; i++) {
                    if (_current.params[paramsKeys[i]] != params[paramsKeys[i]]) {
                        isActive = false;
                        break;
                    }
                }
            }
            return isActive;
        };
        Router.prototype.url = function (state, params) {
            state = this.mapPath(state);
            var route = this.getAbsoluteRouteForState(state);
            if (route != null)
                return route.stringify(params);
            return null;
        };
        Router.prototype.reset = function (enterRootState) {
            if (enterRootState === void 0) { enterRootState = true; }
            this.states = {};
            this.root = this.registerStateInternal({
                name: this.rootStateName,
                url: wx.route("/")
            });
            if (enterRootState)
                this.go(this.rootStateName, {}, { location: 2 /* replace */ });
        };
        Router.prototype.sync = function (url) {
            if (url == null)
                url = wx.app.history.location.pathname;
            var keys = Object.keys(this.states);
            var length = keys.length;
            var params;
            for (var i = 0; i < length; i++) {
                var state = this.states[keys[i]];
                var route = this.getAbsoluteRouteForState(state.name);
                if ((params = route.parse(url)) != null) {
                    this.go(state.name, params, { location: 2 /* replace */ });
                    return;
                }
            }
            if (this.current() == null)
                this.reload();
        };
        Router.prototype.reload = function () {
            var state;
            var params;
            if (this.current() != null) {
                state = this.current().name;
                params = this.current().params;
            }
            else {
                state = this.rootStateName;
                params = {};
            }
            this.go(state, params, { force: true, location: 2 /* replace */ });
        };
        Router.prototype.getViewComponent = function (viewName) {
            var _current = this.current();
            var result = undefined;
            if (_current.views != null) {
                var component = _current.views[viewName];
                var stateParams = {};
                if (component != null) {
                    result = {};
                    if (typeof component === "object") {
                        result.component = component.component;
                        result.params = component.params || {};
                        result.animations = component.animations;
                    }
                    else {
                        result.component = component;
                        result.params = {};
                        result.animations = undefined;
                    }
                    var parameterNames = this.getViewParameterNamesFromStateConfig(viewName, result.component);
                    parameterNames.forEach(function (x) {
                        if (_current.params.hasOwnProperty(x)) {
                            stateParams[x] = _current.params[x];
                        }
                    });
                    result.params = wx.extend(stateParams, result.params);
                }
            }
            return result;
        };
        Router.prototype.registerStateInternal = function (state) {
            var _this = this;
            var parts = state.name.split(this.pathSeparator);
            if (state.name !== this.rootStateName) {
                if (parts.forEach(function (path) {
                    if (!_this.validPathRegExp.test(path)) {
                        internal.throwError("invalid state-path '{0}' (a state-path must start with a character, optionally followed by one or more alphanumeric characters, dashes or underscores)");
                    }
                }))
                    ;
            }
            state = wx.extend(state, {});
            this.states[state.name] = state;
            if (state.url != null) {
                if (typeof state.url === "string") {
                    state.url = wx.route(state.url);
                }
            }
            else {
                if (state.name !== this.rootStateName)
                    state.url = wx.route(parts[parts.length - 1]);
                else
                    state.url = wx.route("/");
            }
            if (state.name === this.rootStateName)
                this.root = state;
            return state;
        };
        Router.prototype.pushHistoryState = function (state, title) {
            var hs = {
                stateName: state.name,
                params: state.params,
                title: title != null ? title : document.title
            };
            wx.app.history.pushState(hs, "", state.url);
        };
        Router.prototype.replaceHistoryState = function (state, title) {
            var hs = {
                stateName: state.name,
                params: state.params,
                title: title != null ? title : document.title
            };
            wx.app.history.replaceState(hs, "", state.url);
        };
        Router.prototype.mapPath = function (path) {
            if (path.indexOf(this.pathSeparator) === 0) {
                return this.current().name + path;
            }
            else if (path.indexOf(this.parentPathDirective) === 0) {
                var parent = this.current().name;
                if (parent === this.rootStateName)
                    return parent;
                var parts = parent.split(this.pathSeparator);
                for (var i = parts.length - 1; i > 0; i--) {
                    var tmp = parts.slice(0, i).join(this.pathSeparator);
                    if (this.get(tmp) || this.get(tmp + path.substr(1))) {
                        path = tmp + path.substr(1);
                        return path;
                    }
                }
                path = this.rootStateName + path.substr(1);
                return path;
            }
            return path;
        };
        Router.prototype.getStateHierarchy = function (name) {
            var parts = name.split(this.pathSeparator);
            var stateName = "";
            var result = [];
            var state;
            if (name !== this.rootStateName)
                result.push(this.root);
            for (var i = 0; i < parts.length; i++) {
                if (i > 0)
                    stateName += this.pathSeparator + parts[i];
                else
                    stateName = parts[i];
                state = this.states[stateName];
                if (state == null) {
                    state = {
                        name: stateName,
                        url: wx.route(stateName)
                    };
                }
                result.push(state);
            }
            return result;
        };
        Router.prototype.getAbsoluteRouteForState = function (name, hierarchy) {
            hierarchy = hierarchy != null ? hierarchy : this.getStateHierarchy(name);
            var result = null;
            hierarchy.forEach(function (state) {
                if (result != null) {
                    var route = state.url;
                    if (!route.isAbsolute)
                        result = result.concat(state.url);
                    else
                        result = route;
                }
                else {
                    result = state.url;
                }
            });
            return result;
        };
        Router.prototype.activateState = function (to, params, options) {
            var hierarchy = this.getStateHierarchy(to);
            var stateViews = {};
            var stateParams = {};
            hierarchy.forEach(function (state) {
                if (state.views != null) {
                    wx.extend(state.views, stateViews);
                }
                if (state.params != null) {
                    wx.extend(state.params, stateParams);
                }
            });
            if (params) {
                wx.extend(params, stateParams);
            }
            var route = this.getAbsoluteRouteForState(to, hierarchy);
            var state = wx.extend(this.states[to], {});
            state.url = route.stringify(params);
            state.views = stateViews;
            state.params = stateParams;
            var _current = this.current();
            if ((options && options.force) || _current == null || _current.name !== to || !wx.isEqual(_current.params, state.params)) {
                if (_current != null && _current.views != null && state.views != null) {
                    Object.keys(_current.views).forEach(function (x) {
                        if (!state.views.hasOwnProperty(x)) {
                            state.views[x] = null;
                        }
                    });
                }
                if (options && options.location) {
                    if (options.location === 2 /* replace */)
                        this.replaceHistoryState(state, wx.app.title());
                    else
                        this.pushHistoryState(state, wx.app.title());
                }
                if (_current != null) {
                    if (_current.onLeave)
                        _current.onLeave(this.get(_current.name), _current.params);
                }
                this.current(state);
                if (state.onEnter)
                    state.onEnter(this.get(state.name), params);
            }
        };
        Router.prototype.getViewParameterNamesFromStateConfig = function (view, component) {
            var hierarchy = this.getStateHierarchy(this.current().name);
            var stateParams = {};
            var result = [];
            var config;
            var index = -1;
            for (var i = hierarchy.length; i--; i >= 0) {
                config = hierarchy[i];
                if (config.views && config.views[view]) {
                    var other = config.views[view];
                    if (typeof other === "object") {
                        other = other.component;
                    }
                    if (other === component) {
                        index = i;
                    }
                }
            }
            if (index !== -1) {
                config = hierarchy[index];
                hierarchy = hierarchy.slice(0, index + 1);
                hierarchy.forEach(function (state) {
                    if (state.params != null) {
                        wx.extend(state.params, stateParams);
                    }
                });
                result = Object.keys(stateParams);
                result = result.concat(config.url.params);
            }
            return result;
        };
        return Router;
    })();
    wx.router;
    Object.defineProperty(wx, "router", {
        get: function () {
            return wx.injector.get(wx.res.router);
        }
    });
    var internal;
    (function (internal) {
        internal.routerConstructor = Router;
    })(internal = wx.internal || (wx.internal = {}));
})(wx || (wx = {}));
var wx;
(function (wx) {
    "use strict";
    wx.injector.register(wx.res.expressionCompiler, wx.internal.expressionCompilerConstructor).register(wx.res.htmlTemplateEngine, [wx.internal.htmlTemplateEngineConstructor], true).register(wx.res.domManager, [wx.res.expressionCompiler, wx.internal.domManagerConstructor], true).register(wx.res.router, [wx.res.domManager, wx.internal.routerConstructor], true).register(wx.res.messageBus, [wx.internal.messageBusConstructor], true);
    wx.injector.register("wx.bindings.module", [wx.res.domManager, wx.internal.moduleBindingConstructor], true).register("wx.bindings.command", [wx.res.domManager, wx.internal.commandBindingConstructor], true).register("wx.bindings.if", [wx.res.domManager, wx.internal.ifBindingConstructor], true).register("wx.bindings.with", [wx.res.domManager, wx.internal.withBindingConstructor], true).register("wx.bindings.notif", [wx.res.domManager, wx.internal.notifBindingConstructor], true).register("wx.bindings.css", [wx.res.domManager, wx.internal.cssBindingConstructor], true).register("wx.bindings.attr", [wx.res.domManager, wx.internal.attrBindingConstructor], true).register("wx.bindings.style", [wx.res.domManager, wx.internal.styleBindingConstructor], true).register("wx.bindings.text", [wx.res.domManager, wx.internal.textBindingConstructor], true).register("wx.bindings.html", [wx.res.domManager, wx.internal.htmlBindingConstructor], true).register("wx.bindings.visible", [wx.res.domManager, wx.internal.visibleBindingConstructor], true).register("wx.bindings.hidden", [wx.res.domManager, wx.internal.hiddenBindingConstructor], true).register("wx.bindings.enabled", [wx.res.domManager, wx.internal.enableBindingConstructor], true).register("wx.bindings.disabled", [wx.res.domManager, wx.internal.disableBindingConstructor], true).register("wx.bindings.foreach", [wx.res.domManager, wx.internal.forEachBindingConstructor], true).register("wx.bindings.event", [wx.res.domManager, wx.internal.eventBindingConstructor], true).register("wx.bindings.keyPress", [wx.res.domManager, wx.internal.keyPressBindingConstructor], true).register("wx.bindings.textInput", [wx.res.domManager, wx.internal.textInputBindingConstructor], true).register("wx.bindings.checked", [wx.res.domManager, wx.internal.checkedBindingConstructor], true).register("wx.bindings.selectedValue", [wx.res.domManager, wx.internal.selectedValueBindingConstructor], true).register("wx.bindings.component", [wx.res.domManager, wx.internal.componentBindingConstructor], true).register("wx.bindings.value", [wx.res.domManager, wx.internal.valueBindingConstructor], true).register("wx.bindings.hasFocus", [wx.res.domManager, wx.internal.hasFocusBindingConstructor], true).register("wx.bindings.view", [wx.res.domManager, wx.res.router, wx.internal.viewBindingConstructor], true).register("wx.bindings.sref", [wx.res.domManager, wx.res.router, wx.internal.stateRefBindingConstructor], true).register("wx.bindings.sactive", [wx.res.domManager, wx.res.router, wx.internal.stateActiveBindingConstructor], true);
    wx.injector.register("wx.components.radiogroup", [wx.res.htmlTemplateEngine, wx.internal.radioGroupComponentConstructor]).register("wx.components.select", [wx.res.htmlTemplateEngine, wx.internal.selectComponentConstructor]);
    wx.app.binding("module", "wx.bindings.module").binding("css", "wx.bindings.css").binding("attr", "wx.bindings.attr").binding("style", "wx.bindings.style").binding("command", "wx.bindings.command").binding("if", "wx.bindings.if").binding("with", "wx.bindings.with").binding("ifnot", "wx.bindings.notif").binding("text", "wx.bindings.text").binding("html", "wx.bindings.html").binding("visible", "wx.bindings.visible").binding("hidden", "wx.bindings.hidden").binding("disabled", "wx.bindings.disabled").binding("enabled", "wx.bindings.enabled").binding("foreach", "wx.bindings.foreach").binding("event", "wx.bindings.event").binding(["keyPress", "keypress"], "wx.bindings.keyPress").binding(["textInput", "textinput"], "wx.bindings.textInput").binding("checked", "wx.bindings.checked").binding("selectedValue", "wx.bindings.selectedValue").binding("component", "wx.bindings.component").binding("value", "wx.bindings.value").binding(["hasFocus", "hasfocus"], "wx.bindings.hasFocus").binding("view", "wx.bindings.view").binding(["sref", "stateRef", "stateref"], "wx.bindings.sref").binding(["sactive", "stateActive", "stateactive"], "wx.bindings.sactive");
    wx.app.component("wx-radiogroup", { resolve: "wx.components.radiogroup" }).component("wx-select", { resolve: "wx.components.select" });
})(wx || (wx = {}));
var wx;
(function (wx) {
    wx.version = '0.9.83';
})(wx || (wx = {}));
//# sourceMappingURL=web.rx.js.map