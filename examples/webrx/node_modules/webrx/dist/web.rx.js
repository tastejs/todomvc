(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define(factory);
	else if(typeof exports === 'object')
		exports["wx"] = factory();
	else
		root["wx"] = factory();
})(this, function() {
return /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;
/******/
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	// WebRx's API-Surface
	function __export(m) {
	    for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];
	}
	var App_1 = __webpack_require__(3);
	exports.app = App_1.app;
	exports.router = App_1.router;
	exports.messageBus = App_1.messageBus;
	var Module_1 = __webpack_require__(14);
	exports.module = Module_1.module;
	__export(__webpack_require__(5));
	var Property_1 = __webpack_require__(13);
	exports.property = Property_1.property;
	var DomManager_1 = __webpack_require__(16);
	exports.applyBindings = DomManager_1.applyBindings;
	exports.cleanNode = DomManager_1.cleanNode;
	var Command_1 = __webpack_require__(20);
	exports.command = Command_1.command;
	exports.asyncCommand = Command_1.asyncCommand;
	exports.combinedCommand = Command_1.combinedCommand;
	exports.isCommand = Command_1.isCommand;
	var Animation_1 = __webpack_require__(50);
	exports.animation = Animation_1.animation;
	var Oid_1 = __webpack_require__(2);
	exports.getOid = Oid_1.getOid;
	var List_1 = __webpack_require__(28);
	exports.list = List_1.list;
	exports.isList = List_1.isList;
	var Map_1 = __webpack_require__(8);
	exports.createMap = Map_1.createMap;
	var Set_1 = __webpack_require__(1);
	exports.createSet = Set_1.createSet;
	exports.setToArray = Set_1.setToArray;
	var WeakMap_1 = __webpack_require__(7);
	exports.createWeakMap = WeakMap_1.createWeakMap;
	var Lazy_1 = __webpack_require__(29);
	exports.Lazy = Lazy_1.default;
	var VirtualChildNodes_1 = __webpack_require__(26);
	exports.VirtualChildNodes = VirtualChildNodes_1.default;
	var RouteMatcher_1 = __webpack_require__(46);
	exports.route = RouteMatcher_1.route;
	var Value_1 = __webpack_require__(32);
	exports.getNodeValue = Value_1.getNodeValue;
	exports.setNodeValue = Value_1.setNodeValue;
	var Injector_1 = __webpack_require__(4);
	exports.injector = Injector_1.injector;
	var IID_1 = __webpack_require__(10);
	exports.IID = IID_1.default;
	// re-exports
	var res = __webpack_require__(11);
	exports.res = res;
	var env = __webpack_require__(17);
	exports.env = env;
	//# sourceMappingURL=WebRx.js.map

/***/ },
/* 1 */
/***/ function(module, exports, __webpack_require__) {

	/// <reference path="../../node_modules/typescript/bin/lib.es6.d.ts" />
	/// <reference path="../Interfaces.ts" />
	var Oid_1 = __webpack_require__(2);
	"use strict";
	/**
	* ES6 Set Shim
	* @class
	*/
	var SetEmulated = (function () {
	    function SetEmulated() {
	        ////////////////////
	        /// Implementation
	        this.values = [];
	        this.keys = {};
	    }
	    ////////////////////
	    /// ISet
	    SetEmulated.prototype.add = function (value) {
	        var key = Oid_1.getOid(value);
	        if (!this.keys[key]) {
	            this.values.push(value);
	            this.keys[key] = true;
	        }
	        return this;
	    };
	    SetEmulated.prototype.delete = function (value) {
	        var key = Oid_1.getOid(value);
	        if (this.keys[key]) {
	            var index = this.values.indexOf(value);
	            this.values.splice(index, 1);
	            delete this.keys[key];
	            return true;
	        }
	        return false;
	    };
	    SetEmulated.prototype.has = function (value) {
	        var key = Oid_1.getOid(value);
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
	var hasNativeSupport = typeof Set === "function" && Set.prototype.hasOwnProperty("forEach")
	    && Set.prototype.hasOwnProperty("add") && Set.prototype.hasOwnProperty("clear")
	    && Set.prototype.hasOwnProperty("delete") && Set.prototype.hasOwnProperty("has");
	/**
	* Creates a new Set instance
	* @param {boolean} disableNativeSupport Force creation of an emulated implementation, regardless of browser native support.
	* @return {ISet<T>} A new instance of a suitable ISet implementation
	*/
	function createSet(disableNativeSupport) {
	    if (disableNativeSupport || !hasNativeSupport) {
	        return new SetEmulated();
	    }
	    return new Set();
	}
	exports.createSet = createSet;
	/**
	* Extracts the values of a Set by invoking its forEach method and capturing the output
	*/
	function setToArray(src) {
	    var result = new Array();
	    src.forEach(function (x) { return result.push(x); });
	    return result;
	}
	exports.setToArray = setToArray;
	//# sourceMappingURL=Set.js.map

/***/ },
/* 2 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	var oid = 1;
	var oidPropertyName = "__wx_oid__" + (new Date).getTime();
	function isPrimitive(target) {
	    var t = typeof target;
	    return t === "boolean" || t === "number" || t === "string";
	}
	/**
	* Returns the objects unique id or assigns it if unassigned
	* @param {any} o
	*/
	function getOid(o) {
	    if (o == null)
	        return undefined;
	    if (isPrimitive(o))
	        return (typeof o + ":" + o);
	    // already set?
	    if (o.hasOwnProperty(oidPropertyName))
	        return o[oidPropertyName];
	    // assign new one
	    var result = (++oid).toString();
	    // store as non-enumerable property to avoid confusing other libraries
	    Object.defineProperty(o, oidPropertyName, {
	        enumerable: false,
	        configurable: false,
	        writable: false,
	        value: result
	    });
	    return result;
	}
	exports.getOid = getOid;
	//# sourceMappingURL=Oid.js.map

/***/ },
/* 3 */
/***/ function(module, exports, __webpack_require__) {

	/// <reference path="./Interfaces.ts" />
	var __extends = (this && this.__extends) || function (d, b) {
	    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
	    function __() { this.constructor = d; }
	    __.prototype = b.prototype;
	    d.prototype = new __();
	};
	var Injector_1 = __webpack_require__(4);
	var Utils_1 = __webpack_require__(5);
	var res = __webpack_require__(11);
	var log = __webpack_require__(12);
	var Property_1 = __webpack_require__(13);
	var Module_1 = __webpack_require__(14);
	var ExpressionCompiler = __webpack_require__(15);
	var DomManager_1 = __webpack_require__(16);
	var HtmlTemplateEngine_1 = __webpack_require__(18);
	var Command_1 = __webpack_require__(19);
	var Module_2 = __webpack_require__(21);
	var If_1 = __webpack_require__(22);
	var MultiOneWay_1 = __webpack_require__(23);
	var SimpleOneWay_1 = __webpack_require__(24);
	var ForEach_1 = __webpack_require__(25);
	var Event_1 = __webpack_require__(31);
	var Value_1 = __webpack_require__(32);
	var HasFocus_1 = __webpack_require__(33);
	var With_1 = __webpack_require__(34);
	var Checked_1 = __webpack_require__(35);
	var KeyPress_1 = __webpack_require__(36);
	var TextInput_1 = __webpack_require__(37);
	var SelectedValue_1 = __webpack_require__(38);
	var Component_1 = __webpack_require__(39);
	var StateActive_1 = __webpack_require__(40);
	var View_1 = __webpack_require__(41);
	var StateRef_1 = __webpack_require__(42);
	var Select_1 = __webpack_require__(43);
	var RadioGroup_1 = __webpack_require__(44);
	var Router_1 = __webpack_require__(45);
	var MessageBus_1 = __webpack_require__(47);
	var Version_1 = __webpack_require__(48);
	// make sure RxExtensions get installed
	var RxExtensions_1 = __webpack_require__(49);
	RxExtensions_1.install();
	"use strict";
	var App = (function (_super) {
	    __extends(App, _super);
	    function App() {
	        _super.call(this, "app");
	        /// <summary>
	        /// This Observer is signalled whenever an object that has a
	        /// ThrownExceptions property doesn't Subscribe to that Observable. Use
	        /// Observer.Create to set up what will happen - the default is to crash
	        /// the application with an error message.
	        /// </summary>
	        this.defaultExceptionHandler = Rx.Observer.create(function (ex) {
	            if (!Utils_1.isInUnitTest()) {
	                log.error("An onError occurred on an object (usually a computedProperty) that would break a binding or command. To prevent this, subscribe to the thrownExceptions property of your objects: {0}", ex);
	            }
	        });
	        this.title = Property_1.property(document.title);
	        this.version = Version_1.version;
	        if (!Utils_1.isInUnitTest()) {
	            this.history = this.createHistory();
	        }
	        else {
	            this.history = window["createMockHistory"]();
	        }
	    }
	    Object.defineProperty(App.prototype, "mainThreadScheduler", {
	        /// <summary>
	        /// MainThreadScheduler is the scheduler used to schedule work items that
	        /// should be run "on the UI thread". In normal mode, this will be
	        /// DispatcherScheduler, and in Unit Test mode this will be Immediate,
	        /// to simplify writing common unit tests.
	        /// </summary>
	        get: function () {
	            return this._unitTestMainThreadScheduler || this._mainThreadScheduler
	                || Rx.Scheduler.currentThread; // OW: return a default if schedulers haven't been setup by in
	        },
	        set: function (value) {
	            if (Utils_1.isInUnitTest()) {
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
	                this._templateEngine = Injector_1.injector.get(res.templateEngine);
	            }
	            return this._templateEngine;
	        },
	        set: function (newVal) {
	            this._templateEngine = newVal;
	        },
	        enumerable: true,
	        configurable: true
	    });
	    Object.defineProperty(App.prototype, "router", {
	        get: function () {
	            if (!this._router) {
	                this._router = Injector_1.injector.get(res.router);
	            }
	            return this._router;
	        },
	        enumerable: true,
	        configurable: true
	    });
	    App.prototype.createHistory = function () {
	        // inherit default implementation
	        var result = {
	            back: window.history.back.bind(window.history),
	            forward: window.history.forward.bind(window.history),
	            //go: window.history.go,
	            pushState: window.history.pushState.bind(window.history),
	            replaceState: window.history.replaceState.bind(window.history),
	            getSearchParameters: function (query) {
	                query = query || result.location.search.substr(1);
	                if (query) {
	                    var result_1 = {};
	                    var params = query.split("&");
	                    for (var i = 0; i < params.length; i++) {
	                        var tmp = params[i].split("=");
	                        result_1[tmp[0]] = decodeURIComponent(tmp[1]);
	                    }
	                    return result_1;
	                }
	                return {};
	            }
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
	        // enrich with observable
	        result.onPopState = Rx.Observable.fromEventPattern(function (h) { return window.addEventListener("popstate", h); }, function (h) { return window.removeEventListener("popstate", h); })
	            .publish()
	            .refCount();
	        return result;
	    };
	    App.prototype.register = function () {
	        Injector_1.injector.register(res.app, this) // register with injector
	            .register(res.expressionCompiler, ExpressionCompiler)
	            .register(res.templateEngine, [HtmlTemplateEngine_1.default], true)
	            .register(res.domManager, [res.expressionCompiler, res.app, DomManager_1.DomManager], true)
	            .register(res.router, [res.domManager, res.app, Router_1.Router], true)
	            .register(res.messageBus, [MessageBus_1.default], true);
	        Injector_1.injector.register("bindings.module", [res.domManager, Module_2.default], true)
	            .register("bindings.command", [res.domManager, Command_1.default], true)
	            .register("bindings.if", [res.domManager, If_1.IfBinding], true)
	            .register("bindings.with", [res.domManager, With_1.default], true)
	            .register("bindings.notif", [res.domManager, If_1.NotIfBinding], true)
	            .register("bindings.css", [res.domManager, MultiOneWay_1.CssBinding], true)
	            .register("bindings.attr", [res.domManager, MultiOneWay_1.AttrBinding], true)
	            .register("bindings.style", [res.domManager, MultiOneWay_1.StyleBinding], true)
	            .register("bindings.text", [res.domManager, SimpleOneWay_1.TextBinding], true)
	            .register("bindings.html", [res.domManager, SimpleOneWay_1.HtmlBinding], true)
	            .register("bindings.visible", [res.domManager, SimpleOneWay_1.VisibleBinding], true)
	            .register("bindings.hidden", [res.domManager, SimpleOneWay_1.HiddenBinding], true)
	            .register("bindings.enabled", [res.domManager, SimpleOneWay_1.EnableBinding], true)
	            .register("bindings.disabled", [res.domManager, SimpleOneWay_1.DisableBinding], true)
	            .register("bindings.foreach", [res.domManager, ForEach_1.default], true)
	            .register("bindings.event", [res.domManager, Event_1.default], true)
	            .register("bindings.keyPress", [res.domManager, KeyPress_1.default], true)
	            .register("bindings.textInput", [res.domManager, TextInput_1.default], true)
	            .register("bindings.checked", [res.domManager, Checked_1.default], true)
	            .register("bindings.selectedValue", [res.domManager, SelectedValue_1.default], true)
	            .register("bindings.component", [res.domManager, Component_1.default], true)
	            .register("bindings.value", [res.domManager, Value_1.default], true)
	            .register("bindings.hasFocus", [res.domManager, HasFocus_1.default], true)
	            .register("bindings.view", [res.domManager, res.router, View_1.default], true)
	            .register("bindings.sref", [res.domManager, res.router, StateRef_1.default], true)
	            .register("bindings.sactive", [res.domManager, res.router, StateActive_1.default], true);
	        Injector_1.injector.register("components.radiogroup", [res.templateEngine, RadioGroup_1.default])
	            .register("components.select", [res.templateEngine, Select_1.default]);
	        // initialize module
	        this.binding("module", "bindings.module")
	            .binding("css", "bindings.css")
	            .binding("attr", "bindings.attr")
	            .binding("style", "bindings.style")
	            .binding("command", "bindings.command")
	            .binding("if", "bindings.if")
	            .binding("with", "bindings.with")
	            .binding("ifnot", "bindings.notif")
	            .binding("text", "bindings.text")
	            .binding("html", "bindings.html")
	            .binding("visible", "bindings.visible")
	            .binding("hidden", "bindings.hidden")
	            .binding("disabled", "bindings.disabled")
	            .binding("enabled", "bindings.enabled")
	            .binding("foreach", "bindings.foreach")
	            .binding("event", "bindings.event")
	            .binding(["keyPress", "keypress"], "bindings.keyPress")
	            .binding(["textInput", "textinput"], "bindings.textInput")
	            .binding("checked", "bindings.checked")
	            .binding("selectedValue", "bindings.selectedValue")
	            .binding("component", "bindings.component")
	            .binding("value", "bindings.value")
	            .binding(["hasFocus", "hasfocus"], "bindings.hasFocus")
	            .binding("view", "bindings.view")
	            .binding(["sref", "stateRef", "stateref"], "bindings.sref")
	            .binding(["sactive", "stateActive", "stateactive"], "bindings.sactive");
	        this.component("wx-radiogroup", { resolve: "components.radiogroup" })
	            .component("wx-select", { resolve: "components.select" });
	        // register with module-registry
	        Module_1.modules["app"] = { instance: this };
	    };
	    return App;
	})(Module_1.Module);
	var _app = new App();
	exports.app = _app;
	_app.register();
	exports.router = Injector_1.injector.get(res.router);
	exports.messageBus = Injector_1.injector.get(res.messageBus);
	//# sourceMappingURL=App.js.map

/***/ },
/* 4 */
/***/ function(module, exports, __webpack_require__) {

	/// <reference path="../Interfaces.ts" />
	var Utils_1 = __webpack_require__(5);
	var res = __webpack_require__(11);
	"use strict";
	/**
	* Simple IoC & Service Locator
	*/
	var Injector = (function () {
	    function Injector() {
	        //////////////////////////////////
	        // Implementation
	        this.registrations = {};
	    }
	    Injector.prototype.register = function () {
	        var key = arguments[0];
	        var val = arguments[1];
	        var isSingleton = arguments[2];
	        var factory;
	        if (this.registrations.hasOwnProperty(key))
	            Utils_1.throwError("'{0}' is already registered", key);
	        if (Utils_1.isFunction(val)) {
	            // second overload
	            // it's a factory function
	            factory = function (args, deps) { return val.apply(null, args); };
	        }
	        else if (Array.isArray(val)) {
	            // first overload
	            // array assumed to be inline array notation with constructor
	            var self_1 = this;
	            var ctor = val.pop();
	            var dependencies = val;
	            factory = function (args, deps) {
	                // resolve dependencies
	                var resolved = dependencies.map(function (x) {
	                    try {
	                        return self_1.get(x, undefined, deps);
	                    }
	                    catch (e) {
	                        Utils_1.throwError("Error resolving dependency '{0}' for '{1}': {2}", x, key, e);
	                    }
	                });
	                // invoke constructor
	                var _args = [null].concat(resolved).concat(args);
	                var ctorFunc = ctor.bind.apply(ctor, _args);
	                return new ctorFunc();
	            };
	        }
	        else {
	            // third overload
	            // singleton
	            factory = function (args, deps) { return val; };
	        }
	        this.registrations[key] = { factory: factory, isSingleton: isSingleton };
	        return this;
	    };
	    Injector.prototype.get = function (key, args, deps) {
	        deps = deps || {};
	        if (deps.hasOwnProperty(key))
	            Utils_1.throwError("Detected circular dependency a from '{0}' to '{1}'", Object.keys(deps).join(", "), key);
	        // registered?
	        var registration = this.registrations[key];
	        if (registration === undefined)
	            Utils_1.throwError("'{0}' is not registered", key);
	        // already instantiated?
	        if (registration.isSingleton && registration.value)
	            return registration.value;
	        // append current key
	        var newDeps = {};
	        newDeps[key] = true;
	        Utils_1.extend(deps, newDeps);
	        // create it
	        var result = registration.factory(args, newDeps);
	        // cache if singleton
	        if (registration.isSingleton)
	            registration.value = result;
	        return result;
	    };
	    Injector.prototype.resolve = function (iaa, args) {
	        var ctor = iaa.pop();
	        if (!Utils_1.isFunction(ctor))
	            Utils_1.throwError("Error resolving inline-annotated-array. Constructor must be of type 'function' but is '{0}", typeof ctor);
	        var self = this;
	        // resolve dependencies
	        var resolved = iaa.map(function (x) {
	            try {
	                return self.get(x, undefined, iaa);
	            }
	            catch (e) {
	                Utils_1.throwError("Error resolving dependency '{0}' for '{1}': {2}", x, Object.getPrototypeOf(ctor), e);
	            }
	        });
	        // invoke constructor
	        var _args = [null].concat(resolved).concat(args);
	        var ctorFunc = ctor.bind.apply(ctor, _args);
	        return new ctorFunc();
	    };
	    return Injector;
	})();
	exports.injector = new Injector();
	exports.injector.register(res.injector, function () { return new Injector(); });
	//# sourceMappingURL=Injector.js.map

/***/ },
/* 5 */
/***/ function(module, exports, __webpack_require__) {

	/// <reference path="../Interfaces.ts" />
	var Reflect_1 = __webpack_require__(6);
	var Events_1 = __webpack_require__(9);
	var IID_1 = __webpack_require__(10);
	/*
	* Global helpers
	*/
	"use strict";
	var regexCssClassName = /\S+/g;
	var RxObsConstructor = Rx.Observable; // the cast is neccessary because the rx.js.d.ts declares Observable as an interface
	exports.noop = function () { };
	/**
	* Returns true if a ECMAScript5 strict-mode is active
	*/
	function isStrictMode() {
	    return typeof this === "undefined";
	}
	exports.isStrictMode = isStrictMode;
	/**
	* Returns true if target is a javascript primitive
	*/
	function isPrimitive(target) {
	    var t = typeof target;
	    return t === "boolean" || t === "number" || t === "string";
	}
	exports.isPrimitive = isPrimitive;
	/**
	* Tests if the target supports the interface
	* @param {any} target
	* @param {string} iid
	*/
	function queryInterface(target, iid) {
	    if (target == null || isPrimitive(target))
	        return false;
	    if (typeof target === "object")
	        target = target.constructor;
	    var interfaces = Reflect_1.getMetadata(Reflect_1.implementsMetaDataKey, target);
	    return interfaces != null && interfaces[iid];
	}
	exports.queryInterface = queryInterface;
	/**
	* Returns all own properties of target implementing interface iid
	* @param {any} target
	* @param {string} iid
	*/
	function getOwnPropertiesImplementingInterface(target, iid) {
	    return Object.keys(target).filter(function (propertyName) {
	        // lookup object for name
	        var o = target[propertyName];
	        // is it an ObservableProperty?
	        return queryInterface(o, iid);
	    }).map(function (x) { return new PropertyInfo(x, target[x]); });
	}
	exports.getOwnPropertiesImplementingInterface = getOwnPropertiesImplementingInterface;
	/**
	* Determines if target is an instance of a IObservableProperty
	* @param {any} target
	*/
	function isProperty(target) {
	    if (target == null)
	        return false;
	    return queryInterface(target, IID_1.default.IObservableProperty);
	}
	exports.isProperty = isProperty;
	/**
	* Determines if target is an instance of a Rx.Scheduler
	* @param {any} target
	*/
	function isRxScheduler(target) {
	    if (target == null)
	        return false;
	    return Rx.Scheduler.isScheduler(target);
	}
	exports.isRxScheduler = isRxScheduler;
	/**
	* Determines if target is an instance of a Rx.Observable
	* @param {any} target
	*/
	function isRxObservable(target) {
	    if (target == null)
	        return false;
	    return target instanceof RxObsConstructor;
	}
	exports.isRxObservable = isRxObservable;
	/**
	* If the prop is an observable property return its value
	* @param {any} prop
	*/
	function unwrapProperty(prop) {
	    if (isProperty(prop))
	        return prop();
	    return prop;
	}
	exports.unwrapProperty = unwrapProperty;
	/**
	* Returns true if a Unit-Testing environment is detected
	*/
	function isInUnitTest() {
	    // detect jasmine 1.x
	    if (window && window["jasmine"] && window["jasmine"].version_ !== undefined) {
	        return true;
	    }
	    // detect jasmine 2.x
	    if (window && window["getJasmineRequireObj"] && typeof window["getJasmineRequireObj"] === "function") {
	        return true;
	    }
	    return false;
	}
	exports.isInUnitTest = isInUnitTest;
	/**
	* Transforms the current method's arguments into an array
	*/
	function args2Array(args) {
	    var result = [];
	    for (var i = 0, len = args.length; i < len; i++) {
	        result.push(args[i]);
	    }
	    return result;
	}
	exports.args2Array = args2Array;
	/**
	* Formats a string using .net style format string
	* @param {string} fmt The format string
	* @param {any[]} ...args Format arguments
	*/
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
	exports.formatString = formatString;
	/**
	* Copies own properties from src to dst
	*/
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
	exports.extend = extend;
	var PropertyInfo = (function () {
	    function PropertyInfo(propertyName, property) {
	        this.property = property;
	        this.propertyName = propertyName;
	    }
	    return PropertyInfo;
	})();
	exports.PropertyInfo = PropertyInfo;
	/**
	* Toggles one ore more css classes on the specified DOM element
	* @param {Node} node The target element
	* @param {boolean} shouldHaveClass True if the classes should be added to the element, false if they should be removed
	* @param {string[} classNames The list of classes to process
	*/
	function toggleCssClass(node, shouldHaveClass) {
	    var classNames = [];
	    for (var _i = 2; _i < arguments.length; _i++) {
	        classNames[_i - 2] = arguments[_i];
	    }
	    if (classNames) {
	        var currentClassNames = node.className.match(regexCssClassName) || [];
	        var index;
	        var className;
	        if (shouldHaveClass) {
	            for (var i = 0; i < classNames.length; i++) {
	                className = classNames[i];
	                index = currentClassNames.indexOf(className);
	                if (index === -1)
	                    currentClassNames.push(className);
	            }
	        }
	        else {
	            for (var i = 0; i < classNames.length; i++) {
	                className = classNames[i];
	                index = currentClassNames.indexOf(className);
	                if (index !== -1)
	                    currentClassNames.splice(index, 1);
	            }
	        }
	        node.className = currentClassNames.join(" ");
	    }
	}
	exports.toggleCssClass = toggleCssClass;
	/**
	 * Trigger a reflow on the target element
	 * @param {HTMLElement} el
	 */
	function triggerReflow(el) {
	    el.getBoundingClientRect();
	}
	exports.triggerReflow = triggerReflow;
	/**
	 * Returns true if the specified element may be disabled
	 * @param {HTMLElement} el
	 */
	function elementCanBeDisabled(el) {
	    return el instanceof HTMLButtonElement ||
	        el instanceof HTMLAnchorElement ||
	        el instanceof HTMLInputElement ||
	        el instanceof HTMLFieldSetElement ||
	        el instanceof HTMLLinkElement ||
	        el instanceof HTMLOptGroupElement ||
	        el instanceof HTMLOptionElement ||
	        el instanceof HTMLSelectElement ||
	        el instanceof HTMLTextAreaElement;
	}
	exports.elementCanBeDisabled = elementCanBeDisabled;
	/**
	 * Returns true if object is a Function.
	 * @param obj
	 */
	function isFunction(obj) {
	    return typeof obj == 'function' || false;
	}
	exports.isFunction = isFunction;
	/**
	 * Returns true if object is a Disposable
	 * @param obj
	 */
	function isDisposable(obj) {
	    return queryInterface(obj, IID_1.default.IDisposable) || isFunction(obj["dispose"]);
	}
	exports.isDisposable = isDisposable;
	/**
	 * Performs an optimized deep comparison between the two objects, to determine if they should be considered equal.
	 * @param a Object to compare
	 * @param b Object to compare to
	 */
	function isEqual(a, b, aStack, bStack) {
	    var toString = ({}).toString;
	    // Identical objects are equal. `0 === -0`, but they aren't identical.
	    // See the [Harmony `egal` proposal](http://wiki.ecmascript.org/doku.php?id=harmony:egal).
	    if (a === b)
	        return a !== 0 || 1 / a === 1 / b;
	    // A strict comparison is necessary because `null == undefined`.
	    if (a == null || b == null)
	        return a === b;
	    // Unwrap any wrapped objects.
	    //if (a instanceof _) a = a._wrapped;
	    //if (b instanceof _) b = b._wrapped;
	    // Compare `[[Class]]` names.
	    var className = toString.call(a);
	    if (className !== toString.call(b))
	        return false;
	    switch (className) {
	        // Strings, numbers, regular expressions, dates, and booleans are compared by value.
	        case '[object RegExp]':
	        // RegExps are coerced to strings for comparison (Note: '' + /a/i === '/a/i')
	        case '[object String]':
	            // Primitives and their corresponding object wrappers are equivalent; thus, `"5"` is
	            // equivalent to `new String("5")`.
	            return '' + a === '' + b;
	        case '[object Number]':
	            // `NaN`s are equivalent, but non-reflexive.
	            // Object(NaN) is equivalent to NaN
	            if (+a !== +a)
	                return +b !== +b;
	            // An `egal` comparison is performed for other numeric values.
	            return +a === 0 ? 1 / +a === 1 / b : +a === +b;
	        case '[object Date]':
	        case '[object Boolean]':
	            // Coerce dates and booleans to numeric primitive values. Dates are compared by their
	            // millisecond representations. Note that invalid dates with millisecond representations
	            // of `NaN` are not equivalent.
	            return +a === +b;
	    }
	    var areArrays = className === '[object Array]';
	    if (!areArrays) {
	        if (typeof a != 'object' || typeof b != 'object')
	            return false;
	        // Objects with different constructors are not equivalent, but `Object`s or `Array`s
	        // from different frames are.
	        var aCtor = a.constructor, bCtor = b.constructor;
	        if (aCtor !== bCtor && !(isFunction(aCtor) && aCtor instanceof aCtor &&
	            isFunction(bCtor) && bCtor instanceof bCtor)
	            && ('constructor' in a && 'constructor' in b)) {
	            return false;
	        }
	    }
	    // Assume equality for cyclic structures. The algorithm for detecting cyclic
	    // structures is adapted from ES 5.1 section 15.12.3, abstract operation `JO`.
	    // Initializing stack of traversed objects.
	    // It's done here since we only need them for objects and arrays comparison.
	    aStack = aStack || [];
	    bStack = bStack || [];
	    var length = aStack.length;
	    while (length--) {
	        // Linear search. Performance is inversely proportional to the number of
	        // unique nested structures.
	        if (aStack[length] === a)
	            return bStack[length] === b;
	    }
	    // Add the first object to the stack of traversed objects.
	    aStack.push(a);
	    bStack.push(b);
	    // Recursively compare objects and arrays.
	    if (areArrays) {
	        // Compare array lengths to determine if a deep comparison is necessary.
	        length = a.length;
	        if (length !== b.length)
	            return false;
	        // Deep compare the contents, ignoring non-numeric properties.
	        while (length--) {
	            if (!isEqual(a[length], b[length], aStack, bStack))
	                return false;
	        }
	    }
	    else {
	        // Deep compare objects.
	        var keys = Object.keys(a), key;
	        length = keys.length;
	        // Ensure that both objects contain the same number of properties before comparing deep equality.
	        if (Object.keys(b).length !== length)
	            return false;
	        while (length--) {
	            // Deep compare each member
	            key = keys[length];
	            if (!(b.hasOwnProperty(key) && isEqual(a[key], b[key], aStack, bStack)))
	                return false;
	        }
	    }
	    // Remove the first object from the stack of traversed objects.
	    aStack.pop();
	    bStack.pop();
	    return true;
	}
	exports.isEqual = isEqual;
	/**
	* Returns an array of clones of the nodes in the source array
	*/
	function cloneNodeArray(nodes) {
	    var length = nodes.length;
	    var result = new Array(length);
	    for (var i = 0; i < length; i++) {
	        result[i] = nodes[i].cloneNode(true);
	    }
	    return result;
	}
	exports.cloneNodeArray = cloneNodeArray;
	/**
	 * Converts a NodeList into a javascript array
	 * @param {NodeList} nodes
	 */
	function nodeListToArray(nodes) {
	    return Array.prototype.slice.call(nodes);
	}
	exports.nodeListToArray = nodeListToArray;
	/**
	 * Converts the node's children into a javascript array
	 * @param {Node} node
	 */
	function nodeChildrenToArray(node) {
	    return nodeListToArray(node.childNodes);
	}
	exports.nodeChildrenToArray = nodeChildrenToArray;
	/**
	* Wraps an action in try/finally block and disposes the resource after the action has completed even if it throws an exception
	* (mimics C# using statement)
	* @param {Rx.IDisposable} disp The resource to dispose after action completes
	* @param {() => void} action The action to wrap
	*/
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
	exports.using = using;
	/**
	* Turns an AMD-Style require call into an observable
	* @param {string} Module The module to load
	* @return {Rx.Observable<any>} An observable that yields a value and completes as soon as the module has been loaded
	*/
	function observableRequire(module) {
	    var requireFunc = window["require"];
	    if (!isFunction(requireFunc))
	        throwError("there's no AMD-module loader available (Hint: did you forget to include RequireJS in your project?)");
	    return Rx.Observable.create(function (observer) {
	        try {
	            requireFunc([module], function (m) {
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
	exports.observableRequire = observableRequire;
	/**
	* Returns an observable that notifes of any observable property changes on the target
	* @param {any} target The object to observe
	* @return {Rx.Observable<T>} An observable
	*/
	function observeObject(target, defaultExceptionHandler, onChanging) {
	    if (onChanging === void 0) { onChanging = false; }
	    var thrownExceptionsSubject = queryInterface(target, IID_1.default.IHandleObservableErrors) ?
	        target.thrownExceptions : defaultExceptionHandler;
	    return Rx.Observable.create(function (observer) {
	        var result = new Rx.CompositeDisposable();
	        var observableProperties = getOwnPropertiesImplementingInterface(target, IID_1.default.IObservableProperty);
	        observableProperties.forEach(function (x) {
	            var prop = x.property;
	            var obs = onChanging ? prop.changing : prop.changed;
	            result.add(obs.subscribe(function (_) {
	                var e = new Events_1.PropertyChangedEventArgs(self, x.propertyName);
	                try {
	                    observer.onNext(e);
	                }
	                catch (ex) {
	                    thrownExceptionsSubject.onNext(ex);
	                }
	            }));
	        });
	        return result;
	    })
	        .publish()
	        .refCount();
	}
	exports.observeObject = observeObject;
	/**
	 * whenAny allows you to observe whenever the value of one or more properties
	 * on an object have changed, providing an initial value when the Observable is set up.
	 */
	function whenAny() {
	    // no need to invoke combineLatest for the simplest case
	    if (arguments.length === 2) {
	        return arguments[0].changed.startWith(arguments[0]()).select(arguments[1]);
	    }
	    var args = args2Array(arguments);
	    // extract selector
	    var selector = args.pop();
	    // prepend sequence with current values to satisfy combineLatest
	    args = args.map(function (x) { return x.changed.startWith(x()); });
	    // finally append the selector
	    args.push(selector);
	    return Rx.Observable.combineLatest.apply(this, args);
	}
	exports.whenAny = whenAny;
	/**
	* FOR INTERNAL USE ONLY
	* Throw an error containing the specified description
	*/
	function throwError(fmt) {
	    var args = [];
	    for (var _i = 1; _i < arguments.length; _i++) {
	        args[_i - 1] = arguments[_i];
	    }
	    var msg = "WebRx: " + formatString(fmt, args);
	    throw new Error(msg);
	}
	exports.throwError = throwError;
	//# sourceMappingURL=Utils.js.map

/***/ },
/* 6 */
/***/ function(module, exports, __webpack_require__) {

	/// <reference path="../Interfaces.ts" />
	var WeakMap_1 = __webpack_require__(7);
	var Set_1 = __webpack_require__(1);
	var Map_1 = __webpack_require__(8);
	/*! *****************************************************************************
	Copyright (C) Microsoft. All rights reserved.
	Licensed under the Apache License, Version 2.0 (the "License"); you may not use
	this file except in compliance with the License. You may obtain a copy of the
	License at http://www.apache.org/licenses/LICENSE-2.0
	
	Unless required by applicable law or agreed to in writing, software
	distributed under the License is distributed on an "AS IS" BASIS,
	WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
	
	See the License for the specific language governing permissions and
	limitations under the License.
	***************************************************************************** */
	"use strict";
	// Load global or shim versions of Map, Set, and WeakMap
	var functionPrototype = Object.getPrototypeOf(Function);
	// [[Metadata]] internal slot
	var __Metadata__ = WeakMap_1.createWeakMap();
	/**
	  * Applies a set of decorators to a property of a target object.
	  * @param decorators An array of decorators.
	  * @param target The target object.
	  * @param targetKey (Optional) The property key to decorate.
	  * @param targetDescriptor (Optional) The property descriptor for the target key
	  * @remarks Decorators are applied in reverse order.
	  * @example
	  *
	  *     class C {
	  *         // property declarations are not part of ES6, though they are valid in TypeScript:
	  *         // static staticProperty;
	  *         // property;
	  *
	  *         constructor(p) { }
	  *         static staticMethod(p) { }
	  *         method(p) { }
	  *     }
	  *
	  *     // constructor
	  *     C = Reflect.decorate(decoratorsArray, C);
	  *
	  *     // property (on constructor)
	  *     Reflect.decorate(decoratorsArray, C, "staticProperty");
	  *
	  *     // property (on prototype)
	  *     Reflect.decorate(decoratorsArray, C.prototype, "property");
	  *
	  *     // method (on constructor)
	  *     Object.defineProperty(C, "staticMethod",
	  *         Reflect.decorate(decoratorsArray, C, "staticMethod",
	  *             Object.getOwnPropertyDescriptor(C, "staticMethod")));
	  *
	  *     // method (on prototype)
	  *     Object.defineProperty(C.prototype, "method",
	  *         Reflect.decorate(decoratorsArray, C.prototype, "method",
	  *             Object.getOwnPropertyDescriptor(C.prototype, "method")));
	  *
	  */
	function decorate(decorators, target, targetKey, targetDescriptor) {
	    if (!IsUndefined(targetDescriptor)) {
	        if (!IsArray(decorators)) {
	            throw new TypeError();
	        }
	        else if (!IsObject(target)) {
	            throw new TypeError();
	        }
	        else if (IsUndefined(targetKey)) {
	            throw new TypeError();
	        }
	        else if (!IsObject(targetDescriptor)) {
	            throw new TypeError();
	        }
	        targetKey = ToPropertyKey(targetKey);
	        return DecoratePropertyWithDescriptor(decorators, target, targetKey, targetDescriptor);
	    }
	    else if (!IsUndefined(targetKey)) {
	        if (!IsArray(decorators)) {
	            throw new TypeError();
	        }
	        else if (!IsObject(target)) {
	            throw new TypeError();
	        }
	        targetKey = ToPropertyKey(targetKey);
	        return DecoratePropertyWithoutDescriptor(decorators, target, targetKey);
	    }
	    else {
	        if (!IsArray(decorators)) {
	            throw new TypeError();
	        }
	        else if (!IsConstructor(target)) {
	            throw new TypeError();
	        }
	        return DecorateConstructor(decorators, target);
	    }
	}
	exports.decorate = decorate;
	/**
	  * A default metadata decorator factory that can be used on a class, class member, or parameter.
	  * @param metadataKey The key for the metadata entry.
	  * @param metadataValue The value for the metadata entry.
	  * @returns A decorator function.
	  * @remarks
	  * If `metadataKey` is already defined for the target and target key, the
	  * metadataValue for that key will be overwritten.
	  * @example
	  *
	  *     // constructor
	  *     @Reflect.metadata(key, value)
	  *     class C {
	  *     }
	  *
	  *     // property (on constructor, TypeScript only)
	  *     class C {
	  *         @Reflect.metadata(key, value)
	  *         static staticProperty;
	  *     }
	  *
	  *     // property (on prototype, TypeScript only)
	  *     class C {
	  *         @Reflect.metadata(key, value)
	  *         property;
	  *     }
	  *
	  *     // method (on constructor)
	  *     class C {
	  *         @Reflect.metadata(key, value)
	  *         static staticMethod() { }
	  *     }
	  *
	  *     // method (on prototype)
	  *     class C {
	  *         @Reflect.metadata(key, value)
	  *         method() { }
	  *     }
	  *
	  */
	function metadata(metadataKey, metadataValue) {
	    function decorator(target, targetKey) {
	        if (!IsUndefined(targetKey)) {
	            if (!IsObject(target)) {
	                throw new TypeError();
	            }
	            targetKey = ToPropertyKey(targetKey);
	            OrdinaryDefineOwnMetadata(metadataKey, metadataValue, target, targetKey);
	        }
	        else {
	            if (!IsConstructor(target)) {
	                throw new TypeError();
	            }
	            OrdinaryDefineOwnMetadata(metadataKey, metadataValue, target, undefined);
	        }
	    }
	    return decorator;
	}
	exports.metadata = metadata;
	/**
	  * Define a unique metadata entry on the target.
	  * @param metadataKey A key used to store and retrieve metadata.
	  * @param metadataValue A value that contains attached metadata.
	  * @param target The target object on which to define metadata.
	  * @param targetKey (Optional) The property key for the target.
	  * @example
	  *
	  *     class C {
	  *         // property declarations are not part of ES6, though they are valid in TypeScript:
	  *         // static staticProperty;
	  *         // property;
	  *
	  *         constructor(p) { }
	  *         static staticMethod(p) { }
	  *         method(p) { }
	  *     }
	  *
	  *     // constructor
	  *     Reflect.defineMetadata("custom:annotation", options, C);
	  *
	  *     // property (on constructor)
	  *     Reflect.defineMetadata("custom:annotation", options, C, "staticProperty");
	  *
	  *     // property (on prototype)
	  *     Reflect.defineMetadata("custom:annotation", options, C.prototype, "property");
	  *
	  *     // method (on constructor)
	  *     Reflect.defineMetadata("custom:annotation", options, C, "staticMethod");
	  *
	  *     // method (on prototype)
	  *     Reflect.defineMetadata("custom:annotation", options, C.prototype, "method");
	  *
	  *     // decorator factory as metadata-producing annotation.
	  *     function MyAnnotation(options): Decorator {
	  *         return (target, key?) => Reflect.defineMetadata("custom:annotation", options, target, key);
	  *     }
	  *
	  */
	function defineMetadata(metadataKey, metadataValue, target, targetKey) {
	    if (!IsObject(target)) {
	        throw new TypeError();
	    }
	    else if (!IsUndefined(targetKey)) {
	        targetKey = ToPropertyKey(targetKey);
	    }
	    return OrdinaryDefineOwnMetadata(metadataKey, metadataValue, target, targetKey);
	}
	exports.defineMetadata = defineMetadata;
	/**
	  * Gets a value indicating whether the target object or its prototype chain has the provided metadata key defined.
	  * @param metadataKey A key used to store and retrieve metadata.
	  * @param target The target object on which the metadata is defined.
	  * @param targetKey (Optional) The property key for the target.
	  * @returns `true` if the metadata key was defined on the target object or its prototype chain; otherwise, `false`.
	  * @example
	  *
	  *     class C {
	  *         // property declarations are not part of ES6, though they are valid in TypeScript:
	  *         // static staticProperty;
	  *         // property;
	  *
	  *         constructor(p) { }
	  *         static staticMethod(p) { }
	  *         method(p) { }
	  *     }
	  *
	  *     // constructor
	  *     result = Reflect.hasMetadata("custom:annotation", C);
	  *
	  *     // property (on constructor)
	  *     result = Reflect.hasMetadata("custom:annotation", C, "staticProperty");
	  *
	  *     // property (on prototype)
	  *     result = Reflect.hasMetadata("custom:annotation", C.prototype, "property");
	  *
	  *     // method (on constructor)
	  *     result = Reflect.hasMetadata("custom:annotation", C, "staticMethod");
	  *
	  *     // method (on prototype)
	  *     result = Reflect.hasMetadata("custom:annotation", C.prototype, "method");
	  *
	  */
	function hasMetadata(metadataKey, target, targetKey) {
	    if (!IsObject(target)) {
	        throw new TypeError();
	    }
	    else if (!IsUndefined(targetKey)) {
	        targetKey = ToPropertyKey(targetKey);
	    }
	    return OrdinaryHasMetadata(metadataKey, target, targetKey);
	}
	exports.hasMetadata = hasMetadata;
	/**
	  * Gets a value indicating whether the target object has the provided metadata key defined.
	  * @param metadataKey A key used to store and retrieve metadata.
	  * @param target The target object on which the metadata is defined.
	  * @param targetKey (Optional) The property key for the target.
	  * @returns `true` if the metadata key was defined on the target object; otherwise, `false`.
	  * @example
	  *
	  *     class C {
	  *         // property declarations are not part of ES6, though they are valid in TypeScript:
	  *         // static staticProperty;
	  *         // property;
	  *
	  *         constructor(p) { }
	  *         static staticMethod(p) { }
	  *         method(p) { }
	  *     }
	  *
	  *     // constructor
	  *     result = Reflect.hasOwnMetadata("custom:annotation", C);
	  *
	  *     // property (on constructor)
	  *     result = Reflect.hasOwnMetadata("custom:annotation", C, "staticProperty");
	  *
	  *     // property (on prototype)
	  *     result = Reflect.hasOwnMetadata("custom:annotation", C.prototype, "property");
	  *
	  *     // method (on constructor)
	  *     result = Reflect.hasOwnMetadata("custom:annotation", C, "staticMethod");
	  *
	  *     // method (on prototype)
	  *     result = Reflect.hasOwnMetadata("custom:annotation", C.prototype, "method");
	  *
	  */
	function hasOwnMetadata(metadataKey, target, targetKey) {
	    if (!IsObject(target)) {
	        throw new TypeError();
	    }
	    else if (!IsUndefined(targetKey)) {
	        targetKey = ToPropertyKey(targetKey);
	    }
	    return OrdinaryHasOwnMetadata(metadataKey, target, targetKey);
	}
	exports.hasOwnMetadata = hasOwnMetadata;
	/**
	  * Gets the metadata value for the provided metadata key on the target object or its prototype chain.
	  * @param metadataKey A key used to store and retrieve metadata.
	  * @param target The target object on which the metadata is defined.
	  * @param targetKey (Optional) The property key for the target.
	  * @returns The metadata value for the metadata key if found; otherwise, `undefined`.
	  * @example
	  *
	  *     class C {
	  *         // property declarations are not part of ES6, though they are valid in TypeScript:
	  *         // static staticProperty;
	  *         // property;
	  *
	  *         constructor(p) { }
	  *         static staticMethod(p) { }
	  *         method(p) { }
	  *     }
	  *
	  *     // constructor
	  *     result = Reflect.getMetadata("custom:annotation", C);
	  *
	  *     // property (on constructor)
	  *     result = Reflect.getMetadata("custom:annotation", C, "staticProperty");
	  *
	  *     // property (on prototype)
	  *     result = Reflect.getMetadata("custom:annotation", C.prototype, "property");
	  *
	  *     // method (on constructor)
	  *     result = Reflect.getMetadata("custom:annotation", C, "staticMethod");
	  *
	  *     // method (on prototype)
	  *     result = Reflect.getMetadata("custom:annotation", C.prototype, "method");
	  *
	  */
	function getMetadata(metadataKey, target, targetKey) {
	    if (!IsObject(target)) {
	        throw new TypeError();
	    }
	    else if (!IsUndefined(targetKey)) {
	        targetKey = ToPropertyKey(targetKey);
	    }
	    return OrdinaryGetMetadata(metadataKey, target, targetKey);
	}
	exports.getMetadata = getMetadata;
	/**
	  * Gets the metadata value for the provided metadata key on the target object.
	  * @param metadataKey A key used to store and retrieve metadata.
	  * @param target The target object on which the metadata is defined.
	  * @param targetKey (Optional) The property key for the target.
	  * @returns The metadata value for the metadata key if found; otherwise, `undefined`.
	  * @example
	  *
	  *     class C {
	  *         // property declarations are not part of ES6, though they are valid in TypeScript:
	  *         // static staticProperty;
	  *         // property;
	  *
	  *         constructor(p) { }
	  *         static staticMethod(p) { }
	  *         method(p) { }
	  *     }
	  *
	  *     // constructor
	  *     result = Reflect.getOwnMetadata("custom:annotation", C);
	  *
	  *     // property (on constructor)
	  *     result = Reflect.getOwnMetadata("custom:annotation", C, "staticProperty");
	  *
	  *     // property (on prototype)
	  *     result = Reflect.getOwnMetadata("custom:annotation", C.prototype, "property");
	  *
	  *     // method (on constructor)
	  *     result = Reflect.getOwnMetadata("custom:annotation", C, "staticMethod");
	  *
	  *     // method (on prototype)
	  *     result = Reflect.getOwnMetadata("custom:annotation", C.prototype, "method");
	  *
	  */
	function getOwnMetadata(metadataKey, target, targetKey) {
	    if (!IsObject(target)) {
	        throw new TypeError();
	    }
	    else if (!IsUndefined(targetKey)) {
	        targetKey = ToPropertyKey(targetKey);
	    }
	    return OrdinaryGetOwnMetadata(metadataKey, target, targetKey);
	}
	exports.getOwnMetadata = getOwnMetadata;
	/**
	  * Gets the metadata keys defined on the target object or its prototype chain.
	  * @param target The target object on which the metadata is defined.
	  * @param targetKey (Optional) The property key for the target.
	  * @returns An array of unique metadata keys.
	  * @example
	  *
	  *     class C {
	  *         // property declarations are not part of ES6, though they are valid in TypeScript:
	  *         // static staticProperty;
	  *         // property;
	  *
	  *         constructor(p) { }
	  *         static staticMethod(p) { }
	  *         method(p) { }
	  *     }
	  *
	  *     // constructor
	  *     result = Reflect.getMetadataKeys(C);
	  *
	  *     // property (on constructor)
	  *     result = Reflect.getMetadataKeys(C, "staticProperty");
	  *
	  *     // property (on prototype)
	  *     result = Reflect.getMetadataKeys(C.prototype, "property");
	  *
	  *     // method (on constructor)
	  *     result = Reflect.getMetadataKeys(C, "staticMethod");
	  *
	  *     // method (on prototype)
	  *     result = Reflect.getMetadataKeys(C.prototype, "method");
	  *
	  */
	function getMetadataKeys(target, targetKey) {
	    if (!IsObject(target)) {
	        throw new TypeError();
	    }
	    else if (!IsUndefined(targetKey)) {
	        targetKey = ToPropertyKey(targetKey);
	    }
	    return OrdinaryMetadataKeys(target, targetKey);
	}
	exports.getMetadataKeys = getMetadataKeys;
	/**
	  * Gets the unique metadata keys defined on the target object.
	  * @param target The target object on which the metadata is defined.
	  * @param targetKey (Optional) The property key for the target.
	  * @returns An array of unique metadata keys.
	  * @example
	  *
	  *     class C {
	  *         // property declarations are not part of ES6, though they are valid in TypeScript:
	  *         // static staticProperty;
	  *         // property;
	  *
	  *         constructor(p) { }
	  *         static staticMethod(p) { }
	  *         method(p) { }
	  *     }
	  *
	  *     // constructor
	  *     result = Reflect.getOwnMetadataKeys(C);
	  *
	  *     // property (on constructor)
	  *     result = Reflect.getOwnMetadataKeys(C, "staticProperty");
	  *
	  *     // property (on prototype)
	  *     result = Reflect.getOwnMetadataKeys(C.prototype, "property");
	  *
	  *     // method (on constructor)
	  *     result = Reflect.getOwnMetadataKeys(C, "staticMethod");
	  *
	  *     // method (on prototype)
	  *     result = Reflect.getOwnMetadataKeys(C.prototype, "method");
	  *
	  */
	function getOwnMetadataKeys(target, targetKey) {
	    if (!IsObject(target)) {
	        throw new TypeError();
	    }
	    else if (!IsUndefined(targetKey)) {
	        targetKey = ToPropertyKey(targetKey);
	    }
	    return OrdinaryOwnMetadataKeys(target, targetKey);
	}
	exports.getOwnMetadataKeys = getOwnMetadataKeys;
	/**
	  * Deletes the metadata entry from the target object with the provided key.
	  * @param metadataKey A key used to store and retrieve metadata.
	  * @param target The target object on which the metadata is defined.
	  * @param targetKey (Optional) The property key for the target.
	  * @returns `true` if the metadata entry was found and deleted; otherwise, false.
	  * @example
	  *
	  *     class C {
	  *         // property declarations are not part of ES6, though they are valid in TypeScript:
	  *         // static staticProperty;
	  *         // property;
	  *
	  *         constructor(p) { }
	  *         static staticMethod(p) { }
	  *         method(p) { }
	  *     }
	  *
	  *     // constructor
	  *     result = Reflect.deleteMetadata("custom:annotation", C);
	  *
	  *     // property (on constructor)
	  *     result = Reflect.deleteMetadata("custom:annotation", C, "staticProperty");
	  *
	  *     // property (on prototype)
	  *     result = Reflect.deleteMetadata("custom:annotation", C.prototype, "property");
	  *
	  *     // method (on constructor)
	  *     result = Reflect.deleteMetadata("custom:annotation", C, "staticMethod");
	  *
	  *     // method (on prototype)
	  *     result = Reflect.deleteMetadata("custom:annotation", C.prototype, "method");
	  *
	  */
	function deleteMetadata(metadataKey, target, targetKey) {
	    if (!IsObject(target)) {
	        throw new TypeError();
	    }
	    else if (!IsUndefined(targetKey)) {
	        targetKey = ToPropertyKey(targetKey);
	    }
	    // https://github.com/jonathandturner/decorators/blob/master/specs/metadata.md#deletemetadata-metadatakey-p-
	    var metadataMap = GetOrCreateMetadataMap(target, targetKey, false);
	    if (IsUndefined(metadataMap)) {
	        return false;
	    }
	    if (!metadataMap.delete(metadataKey)) {
	        return false;
	    }
	    if (metadataMap.size > 0) {
	        return true;
	    }
	    var targetMetadata = __Metadata__.get(target);
	    targetMetadata.delete(targetKey);
	    if (targetMetadata.size > 0) {
	        return true;
	    }
	    __Metadata__.delete(target);
	    return true;
	}
	exports.deleteMetadata = deleteMetadata;
	function DecorateConstructor(decorators, target) {
	    for (var i = decorators.length - 1; i >= 0; --i) {
	        var decorator = decorators[i];
	        var decorated = decorator(target);
	        if (!IsUndefined(decorated)) {
	            if (!IsConstructor(decorated)) {
	                throw new TypeError();
	            }
	            target = decorated;
	        }
	    }
	    return target;
	}
	function DecoratePropertyWithDescriptor(decorators, target, propertyKey, descriptor) {
	    for (var i = decorators.length - 1; i >= 0; --i) {
	        var decorator = decorators[i];
	        var decorated = decorator(target, propertyKey, descriptor);
	        if (!IsUndefined(decorated)) {
	            if (!IsObject(decorated)) {
	                throw new TypeError();
	            }
	            descriptor = decorated;
	        }
	    }
	    return descriptor;
	}
	function DecoratePropertyWithoutDescriptor(decorators, target, propertyKey) {
	    for (var i = decorators.length - 1; i >= 0; --i) {
	        var decorator = decorators[i];
	        decorator(target, propertyKey);
	    }
	}
	// https://github.com/jonathandturner/decorators/blob/master/specs/metadata.md#getorcreatemetadatamap--o-p-create-
	function GetOrCreateMetadataMap(target, targetKey, create) {
	    var targetMetadata = __Metadata__.get(target);
	    if (!targetMetadata) {
	        if (!create) {
	            return undefined;
	        }
	        targetMetadata = Map_1.createMap();
	        __Metadata__.set(target, targetMetadata);
	    }
	    var keyMetadata = targetMetadata.get(targetKey);
	    if (!keyMetadata) {
	        if (!create) {
	            return undefined;
	        }
	        keyMetadata = Map_1.createMap();
	        targetMetadata.set(targetKey, keyMetadata);
	    }
	    return keyMetadata;
	}
	// https://github.com/jonathandturner/decorators/blob/master/specs/metadata.md#ordinaryhasmetadata--metadatakey-o-p-
	function OrdinaryHasMetadata(MetadataKey, O, P) {
	    var hasOwn = OrdinaryHasOwnMetadata(MetadataKey, O, P);
	    if (hasOwn) {
	        return true;
	    }
	    var parent = GetPrototypeOf(O);
	    if (parent !== null) {
	        return OrdinaryHasMetadata(MetadataKey, parent, P);
	    }
	    return false;
	}
	// https://github.com/jonathandturner/decorators/blob/master/specs/metadata.md#ordinaryhasownmetadata--metadatakey-o-p-
	function OrdinaryHasOwnMetadata(MetadataKey, O, P) {
	    var metadataMap = GetOrCreateMetadataMap(O, P, false);
	    if (metadataMap === undefined) {
	        return false;
	    }
	    return Boolean(metadataMap.has(MetadataKey));
	}
	// https://github.com/jonathandturner/decorators/blob/master/specs/metadata.md#ordinarygetmetadata--metadatakey-o-p-
	function OrdinaryGetMetadata(MetadataKey, O, P) {
	    var hasOwn = OrdinaryHasOwnMetadata(MetadataKey, O, P);
	    if (hasOwn) {
	        return OrdinaryGetOwnMetadata(MetadataKey, O, P);
	    }
	    var parent = GetPrototypeOf(O);
	    if (parent !== null) {
	        return OrdinaryGetMetadata(MetadataKey, parent, P);
	    }
	    return undefined;
	}
	// https://github.com/jonathandturner/decorators/blob/master/specs/metadata.md#ordinarygetownmetadata--metadatakey-o-p-
	function OrdinaryGetOwnMetadata(MetadataKey, O, P) {
	    var metadataMap = GetOrCreateMetadataMap(O, P, false);
	    if (metadataMap === undefined) {
	        return undefined;
	    }
	    return metadataMap.get(MetadataKey);
	}
	// https://github.com/jonathandturner/decorators/blob/master/specs/metadata.md#ordinarydefineownmetadata--metadatakey-metadatavalue-o-p-
	function OrdinaryDefineOwnMetadata(MetadataKey, MetadataValue, O, P) {
	    var metadataMap = GetOrCreateMetadataMap(O, P, true);
	    metadataMap.set(MetadataKey, MetadataValue);
	}
	// https://github.com/jonathandturner/decorators/blob/master/specs/metadata.md#ordinarymetadatakeys--o-p-
	function OrdinaryMetadataKeys(O, P) {
	    var ownKeys = OrdinaryOwnMetadataKeys(O, P);
	    var parent = GetPrototypeOf(O);
	    if (parent === null) {
	        return ownKeys;
	    }
	    var parentKeys = OrdinaryMetadataKeys(parent, P);
	    if (parentKeys.length <= 0) {
	        return ownKeys;
	    }
	    if (ownKeys.length <= 0) {
	        return parentKeys;
	    }
	    var set = Set_1.createSet();
	    var keys = [];
	    for (var _i = 0; _i < ownKeys.length; _i++) {
	        var key = ownKeys[_i];
	        var hasKey = set.has(key);
	        if (!hasKey) {
	            set.add(key);
	            keys.push(key);
	        }
	    }
	    for (var _a = 0; _a < parentKeys.length; _a++) {
	        var key = parentKeys[_a];
	        var hasKey = set.has(key);
	        if (!hasKey) {
	            set.add(key);
	            keys.push(key);
	        }
	    }
	    return keys;
	}
	// https://github.com/jonathandturner/decorators/blob/master/specs/metadata.md#ordinaryownmetadatakeys--o-p-
	function OrdinaryOwnMetadataKeys(target, targetKey) {
	    var metadataMap = GetOrCreateMetadataMap(target, targetKey, false);
	    var keys = [];
	    if (metadataMap) {
	        metadataMap.forEach(function (_, key) { return keys.push(key); });
	    }
	    return keys;
	}
	// https://people.mozilla.org/~jorendorff/es6-draft.html#sec-ecmascript-language-types-undefined-type
	function IsUndefined(x) {
	    return x === undefined;
	}
	// https://people.mozilla.org/~jorendorff/es6-draft.html#sec-isarray
	function IsArray(x) {
	    return Array.isArray(x);
	}
	// https://people.mozilla.org/~jorendorff/es6-draft.html#sec-object-type
	function IsObject(x) {
	    return typeof x === "object" ? x !== null : typeof x === "function";
	}
	// https://people.mozilla.org/~jorendorff/es6-draft.html#sec-isconstructor
	function IsConstructor(x) {
	    return typeof x === "function";
	}
	// https://people.mozilla.org/~jorendorff/es6-draft.html#sec-ecmascript-language-types-symbol-type
	function IsSymbol(x) {
	    return typeof x === "symbol";
	}
	// https://people.mozilla.org/~jorendorff/es6-draft.html#sec-topropertykey
	function ToPropertyKey(value) {
	    if (IsSymbol(value)) {
	        return value;
	    }
	    return String(value);
	}
	function GetPrototypeOf(O) {
	    var proto = Object.getPrototypeOf(O);
	    if (typeof O !== "function" || O === functionPrototype) {
	        return proto;
	    }
	    // TypeScript doesn't set __proto__ in ES5, as it's non-standard. 
	    // Try to determine the superclass constructor. Compatible implementations
	    // must either set __proto__ on a subclass constructor to the superclass constructor,
	    // or ensure each class has a valid `constructor` property on its prototype that
	    // points back to the constructor.
	    // If this is not the same as Function.[[Prototype]], then this is definately inherited.
	    // This is the case when in ES6 or when using __proto__ in a compatible browser.
	    if (proto !== functionPrototype) {
	        return proto;
	    }
	    // If the super prototype is Object.prototype, null, or undefined, then we cannot determine the heritage.
	    var prototype = O.prototype;
	    var prototypeProto = Object.getPrototypeOf(prototype);
	    if (prototypeProto == null || prototypeProto === Object.prototype) {
	        return proto;
	    }
	    // if the constructor was not a function, then we cannot determine the heritage.
	    var constructor = prototypeProto.constructor;
	    if (typeof constructor !== "function") {
	        return proto;
	    }
	    // if we have some kind of self-reference, then we cannot determine the heritage.
	    if (constructor === O) {
	        return proto;
	    }
	    // we have a pretty good guess at the heritage.
	    return constructor;
	}
	exports.implementsMetaDataKey = "wx:interfaceImpl";
	/**
	* Interface decorator
	* @param {string} interfaceName Name of an interface
	*/
	function Implements(value) {
	    return function (target) {
	        var interfaces = getMetadata(exports.implementsMetaDataKey, target) || {};
	        if (typeof (value) === "string")
	            value = value.split(/\s+/).map(function (x) { return x.trim(); }).filter(function (x) { return x; });
	        for (var i = 0; i < value.length; i++)
	            interfaces[value[i]] = true;
	        defineMetadata(exports.implementsMetaDataKey, interfaces, target);
	    };
	}
	exports.Implements = Implements;
	//# sourceMappingURL=Reflect.js.map

/***/ },
/* 7 */
/***/ function(module, exports, __webpack_require__) {

	/// <reference path="../../node_modules/typescript/bin/lib.es6.d.ts" />
	/// <reference path="../Interfaces.ts" />
	var Oid_1 = __webpack_require__(2);
	"use strict";
	/**
	* This class emulates the semantics of a WeakMap.
	* Even though this implementation is indeed "weak", it has the drawback of
	* requiring manual housekeeping of entries otherwise they are kept forever.
	* @class
	*/
	var WeakMapEmulated = (function () {
	    function WeakMapEmulated() {
	        ////////////////////
	        /// Implementation
	        this.inner = {};
	    }
	    ////////////////////
	    /// IWeakMap
	    WeakMapEmulated.prototype.set = function (key, value) {
	        var oid = Oid_1.getOid(key);
	        this.inner[oid] = value;
	    };
	    WeakMapEmulated.prototype.get = function (key) {
	        var oid = Oid_1.getOid(key);
	        return this.inner[oid];
	    };
	    WeakMapEmulated.prototype.has = function (key) {
	        var oid = Oid_1.getOid(key);
	        return this.inner.hasOwnProperty(oid);
	    };
	    WeakMapEmulated.prototype.delete = function (key) {
	        var oid = Oid_1.getOid(key);
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
	//let hasNativeSupport = false;
	/**
	* Creates a new WeakMap instance
	* @param {boolean} disableNativeSupport Force creation of an emulated implementation, regardless of browser native support.
	* @return {IWeakMap<TKey, T>} A new instance of a suitable IWeakMap implementation
	*/
	function createWeakMap(disableNativeSupport) {
	    if (disableNativeSupport || !hasNativeSupport) {
	        return new WeakMapEmulated();
	    }
	    return new WeakMap();
	}
	exports.createWeakMap = createWeakMap;
	//# sourceMappingURL=WeakMap.js.map

/***/ },
/* 8 */
/***/ function(module, exports, __webpack_require__) {

	/// <reference path="../../node_modules/typescript/bin/lib.es6.d.ts" />
	/// <reference path="../Interfaces.ts" />
	"use strict";
	/**
	* ES6 Map Shim
	* @class
	*/
	var MapEmulated = (function () {
	    function MapEmulated() {
	        ////////////////////
	        /// Implementation
	        this.cacheSentinel = {};
	        this.keys = [];
	        this.values = [];
	        this.cache = this.cacheSentinel;
	    }
	    Object.defineProperty(MapEmulated.prototype, "size", {
	        ////////////////////
	        /// IMap
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
	var hasNativeSupport = typeof Map === "function" && Map.prototype.hasOwnProperty("forEach")
	    && Map.prototype.hasOwnProperty("add") && Map.prototype.hasOwnProperty("clear")
	    && Map.prototype.hasOwnProperty("devare") && Map.prototype.hasOwnProperty("has");
	/**
	* Creates a new WeakMap instance
	* @param {boolean} disableNativeSupport Force creation of an emulated implementation, regardless of browser native support.
	* @return {IWeakMap<TKey, T>} A new instance of a suitable IWeakMap implementation
	*/
	function createMap(disableNativeSupport) {
	    if (disableNativeSupport || !hasNativeSupport) {
	        return new MapEmulated();
	    }
	    return new Map();
	}
	exports.createMap = createMap;
	//# sourceMappingURL=Map.js.map

/***/ },
/* 9 */
/***/ function(module, exports, __webpack_require__) {

	/// <reference path="../Interfaces.ts" />
	"use strict";
	var PropertyChangedEventArgs = (function () {
	    /// <summary>
	    /// Initializes a new instance of the <see cref="ObservablePropertyChangedEventArgs{TSender}"/> class.
	    /// </summary>
	    /// <param name="sender">The sender.</param>
	    /// <param name="propertyName">Name of the property.</param>
	    function PropertyChangedEventArgs(sender, propertyName) {
	        this.propertyName = propertyName;
	        this.sender = sender;
	    }
	    return PropertyChangedEventArgs;
	})();
	exports.PropertyChangedEventArgs = PropertyChangedEventArgs;
	//# sourceMappingURL=Events.js.map

/***/ },
/* 10 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	/// <summary>
	/// Interface registry to be used with IUnknown.queryInterface
	/// </summary>
	var IID = (function () {
	    function IID() {
	    }
	    IID.IDisposable = "IDisposable";
	    IID.IObservableProperty = "IObservableProperty";
	    IID.IObservableList = "IObservableList";
	    IID.ICommand = "ICommand";
	    IID.IHandleObservableErrors = "IHandleObservableErrors";
	    return IID;
	})();
	exports.default = IID;
	//# sourceMappingURL=IID.js.map

/***/ },
/* 11 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	exports.app = "app";
	exports.injector = "injector";
	exports.domManager = "domservice";
	exports.router = "router";
	exports.messageBus = "messageBus";
	exports.expressionCompiler = "expressioncompiler";
	exports.templateEngine = "templateEngine";
	exports.hasValueBindingValue = "has.bindings.value";
	exports.valueBindingValue = "bindings.value";
	//# sourceMappingURL=Resources.js.map

/***/ },
/* 12 */
/***/ function(module, exports, __webpack_require__) {

	var Utils_1 = __webpack_require__(5);
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
	        fmt = Utils_1.formatString.apply(null, [fmt].concat(args));
	    }
	    log("**** WebRx Critical: " + fmt);
	}
	exports.critical = critical;
	function error(fmt) {
	    var args = [];
	    for (var _i = 1; _i < arguments.length; _i++) {
	        args[_i - 1] = arguments[_i];
	    }
	    if (args.length) {
	        fmt = Utils_1.formatString.apply(null, [fmt].concat(args));
	    }
	    log("*** WebRx Error: " + fmt);
	}
	exports.error = error;
	function info(fmt) {
	    var args = [];
	    for (var _i = 1; _i < arguments.length; _i++) {
	        args[_i - 1] = arguments[_i];
	    }
	    if (args.length) {
	        fmt = Utils_1.formatString.apply(null, [fmt].concat(args));
	    }
	    log("* WebRx Info: " + fmt);
	}
	exports.info = info;
	//# sourceMappingURL=Log.js.map

/***/ },
/* 13 */
/***/ function(module, exports, __webpack_require__) {

	/// <reference path="../Interfaces.ts" />
	var Reflect_1 = __webpack_require__(6);
	var IID_1 = __webpack_require__(10);
	// NOTE: The factory method approach is necessary because it is  
	// currently impossible to implement a Typescript interface 
	// with a function signature in a Typescript class.
	"use strict";
	/**
	* Creates an observable property with an optional default value
	* @param {T} initialValue?
	*/
	function property(initialValue) {
	    // initialize accessor function
	    var accessor = function (newVal) {
	        if (arguments.length > 0) {
	            // set
	            if (newVal !== accessor.value) {
	                accessor.changingSubject.onNext(newVal);
	                accessor.value = newVal;
	                accessor.changedSubject.onNext(newVal);
	            }
	        }
	        else {
	            // get
	            return accessor.value;
	        }
	    };
	    Reflect_1.Implements(IID_1.default.IObservableProperty)(accessor);
	    Reflect_1.Implements(IID_1.default.IDisposable)(accessor);
	    //////////////////////////////////
	    // IDisposable implementation
	    accessor.dispose = function () {
	    };
	    //////////////////////////////////
	    // IObservableProperty<T> implementation
	    if (initialValue !== undefined)
	        accessor.value = initialValue;
	    // setup observables
	    accessor.changedSubject = new Rx.Subject();
	    accessor.changed = accessor.changedSubject
	        .publish()
	        .refCount();
	    accessor.changingSubject = new Rx.Subject();
	    accessor.changing = accessor.changingSubject
	        .publish()
	        .refCount();
	    return accessor;
	}
	exports.property = property;
	//# sourceMappingURL=Property.js.map

/***/ },
/* 14 */
/***/ function(module, exports, __webpack_require__) {

	/// <reference path="../Interfaces.ts" />
	var Injector_1 = __webpack_require__(4);
	var Utils_1 = __webpack_require__(5);
	var res = __webpack_require__(11);
	"use strict";
	var Module = (function () {
	    function Module(name) {
	        //////////////////////////////////
	        // Implementation
	        this.bindings = {};
	        this.components = {};
	        this.expressionFilters = {};
	        this.animations = {};
	        this.name = name;
	    }
	    //////////////////////////////////
	    // wx.IModule
	    Module.prototype.merge = function (other) {
	        var _other = other;
	        Utils_1.extend(_other.components, this.components);
	        Utils_1.extend(_other.bindings, this.bindings);
	        Utils_1.extend(_other.expressionFilters, this.expressionFilters);
	        Utils_1.extend(_other.animations, this.animations);
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
	        var args = Utils_1.args2Array(arguments);
	        var name = args.shift();
	        var handler;
	        // lookup?
	        if (args.length === 0) {
	            // if the handler has been registered as resource, resolve it now and update registry
	            handler = this.bindings[name];
	            if (typeof handler === "string") {
	                handler = Injector_1.injector.get(handler);
	                this.bindings[name] = handler;
	            }
	            return handler;
	        }
	        // registration
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
	        var args = Utils_1.args2Array(arguments);
	        var name = args.shift();
	        var filter;
	        // lookup?
	        if (args.length === 0) {
	            // if the filter has been registered as resource, resolve it now and update registry
	            filter = this.expressionFilters[name];
	            if (typeof filter === "string") {
	                filter = Injector_1.injector.get(filter);
	                this.bindings[name] = filter;
	            }
	            return filter;
	        }
	        // registration
	        filter = args.shift();
	        this.expressionFilters[name] = filter;
	        return this;
	    };
	    Module.prototype.filters = function () {
	        return this.expressionFilters;
	    };
	    Module.prototype.animation = function () {
	        var args = Utils_1.args2Array(arguments);
	        var name = args.shift();
	        var animation;
	        // lookup?
	        if (args.length === 0) {
	            // if the animation has been registered as resource, resolve it now and update registry
	            animation = this.animations[name];
	            if (typeof animation === "string") {
	                animation = Injector_1.injector.get(animation);
	                this.bindings[name] = animation;
	            }
	            return animation;
	        }
	        // registration
	        animation = args.shift();
	        this.animations[name] = animation;
	        return this;
	    };
	    Object.defineProperty(Module.prototype, "app", {
	        get: function () {
	            return Injector_1.injector.get(res.app);
	        },
	        enumerable: true,
	        configurable: true
	    });
	    Module.prototype.instantiateComponent = function (name) {
	        var _this = this;
	        var cd = this.components[name];
	        var result = undefined;
	        if (cd != null) {
	            // if the component has been registered as resource, resolve it now and update registry
	            if (cd.instance) {
	                result = Rx.Observable.return(cd.instance);
	            }
	            else if (cd.template) {
	                result = Rx.Observable.return(cd);
	            }
	            else if (cd.resolve) {
	                var resolved = Injector_1.injector.get(cd.resolve);
	                result = Rx.Observable.return(resolved);
	            }
	            else if (cd.require) {
	                result = Utils_1.observableRequire(cd.require);
	            }
	        }
	        else {
	            result = Rx.Observable.return(undefined);
	        }
	        return result.do(function (x) { return _this.components[name].instance = x; }); // cache instantiated component
	    };
	    Module.prototype.initializeComponent = function (obs, params) {
	        var _this = this;
	        return obs.take(1).selectMany(function (component) {
	            if (component == null) {
	                return Rx.Observable.return(undefined);
	            }
	            if (component.viewModel) {
	                // component with view-model & template
	                return Rx.Observable.combineLatest(_this.loadComponentTemplate(component.template, params), _this.loadComponentViewModel(component.viewModel, params), function (t, vm) {
	                    // if view-model factory yields a function, use it as constructor
	                    if (Utils_1.isFunction(vm)) {
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
	            // template-only component
	            return _this.loadComponentTemplate(component.template, params)
	                .select(function (template) { return {
	                template: template,
	                preBindingInit: component.preBindingInit,
	                postBindingInit: component.postBindingInit
	            }; });
	        })
	            .take(1);
	    };
	    Module.prototype.loadComponentTemplate = function (template, params) {
	        var _this = this;
	        var syncResult;
	        var el;
	        if (Utils_1.isFunction(template)) {
	            syncResult = template(params);
	            if (typeof syncResult === "string") {
	                syncResult = this.app.templateEngine.parse(template(params));
	            }
	            return Rx.Observable.return(syncResult);
	        }
	        else if (typeof template === "string") {
	            syncResult = this.app.templateEngine.parse(template);
	            return Rx.Observable.return(syncResult);
	        }
	        else if (Array.isArray(template)) {
	            return Rx.Observable.return(template);
	        }
	        else if (typeof template === "object") {
	            var options = template;
	            if (options.resolve) {
	                syncResult = Injector_1.injector.get(options.resolve);
	                return Rx.Observable.return(syncResult);
	            }
	            else if (options.promise) {
	                var promise = options.promise;
	                return Rx.Observable.fromPromise(promise);
	            }
	            else if (options.require) {
	                return Utils_1.observableRequire(options.require).select(function (x) { return _this.app.templateEngine.parse(x); });
	            }
	            else if (options.element) {
	                if (typeof options.element === "string") {
	                    // try both getElementById & querySelector
	                    el = document.getElementById(options.element) ||
	                        document.querySelector(options.element);
	                    if (el != null) {
	                        // only the nodes inside the specified element will be cloned for use as the component’s template
	                        syncResult = this.app.templateEngine.parse(el.innerHTML);
	                    }
	                    else {
	                        syncResult = [];
	                    }
	                    return Rx.Observable.return(syncResult);
	                }
	                else {
	                    el = options.element;
	                    // unwrap text/html script nodes
	                    if (el != null) {
	                        // only the nodes inside the specified element will be cloned for use as the component’s template
	                        syncResult = this.app.templateEngine.parse(el.innerHTML);
	                    }
	                    else {
	                        syncResult = [];
	                    }
	                    return Rx.Observable.return(syncResult);
	                }
	            }
	        }
	        Utils_1.throwError("invalid template descriptor");
	    };
	    Module.prototype.loadComponentViewModel = function (vm, componentParams) {
	        var syncResult;
	        if (Utils_1.isFunction(vm)) {
	            return Rx.Observable.return(vm);
	        }
	        else if (Array.isArray(vm)) {
	            // assumed to be inline-annotated-array
	            syncResult = Injector_1.injector.resolve(vm, componentParams);
	            return Rx.Observable.return(syncResult);
	        }
	        else if (typeof vm === "object") {
	            var options = vm;
	            if (options.resolve) {
	                syncResult = Injector_1.injector.get(options.resolve, componentParams);
	                return Rx.Observable.return(syncResult);
	            }
	            else if (options.promise) {
	                var promise = options.promise;
	                return Rx.Observable.fromPromise(promise);
	            }
	            else if (options.require) {
	                return Utils_1.observableRequire(options.require);
	            }
	            else if (options.instance) {
	                return Rx.Observable.return(options.instance);
	            }
	        }
	        Utils_1.throwError("invalid view-model descriptor");
	    };
	    return Module;
	})();
	exports.Module = Module;
	exports.modules = {};
	/**
	* Defines a module.
	* @param {string} name The module name
	* @return {wx.IModule} The module handle
	*/
	function module(name, descriptor) {
	    exports.modules[name] = descriptor;
	    return this;
	}
	exports.module = module;
	/**
	* Instantiate a new module instance and configure it using the user supplied configuration
	* @param {string} name The module name
	* @return {wx.IModule} The module handle
	*/
	function loadModule(name) {
	    var md = exports.modules[name];
	    var result = undefined;
	    var module;
	    if (md != null) {
	        if (Array.isArray(md)) {
	            // assumed to be inline-annotated-array
	            // resolve the configuration function via DI and invoke it with the module instance as argument
	            module = new Module(name);
	            Injector_1.injector.resolve(md, module);
	            result = Rx.Observable.return(module);
	        }
	        else if (Utils_1.isFunction(md)) {
	            // configuration function
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
	                    // resolve the configuration function via DI and invoke it with the module instance as argument
	                    Injector_1.injector.get(mdd.resolve, module);
	                    result = Rx.Observable.return(module);
	                }
	                else if (mdd.require) {
	                    // load the configuration function from external module and invoke it with the module instance as argument
	                    result = Utils_1.observableRequire(mdd.require)
	                        .do(function (x) { return x(module); }) // configure the module
	                        .select(function (x) { return module; });
	                }
	            }
	        }
	    }
	    else {
	        result = Rx.Observable.return(undefined);
	    }
	    return result.take(1).do(function (x) { return exports.modules[name] = { instance: x }; }); // cache instantiated module
	}
	exports.loadModule = loadModule;
	//# sourceMappingURL=Module.js.map

/***/ },
/* 15 */
/***/ function(module, exports, __webpack_require__) {

	/// <reference path="../Interfaces.ts" />
	var Utils_1 = __webpack_require__(5);
	"use strict";
	/**
	* Knockout's object-literal parser ported to Typescript
	*/
	// The following regular expressions will be used to split an object-literal string into tokens
	// These two match strings, either with double quotes or single quotes
	var stringDouble = '"(?:[^"\\\\]|\\\\.)*"';
	var stringSingle = "'(?:[^'\\\\]|\\\\.)*'";
	// Matches a regular expression (text enclosed by slashes), but will also match sets of divisions
	// as a regular expression (this is handled by the parsing loop below).
	var stringRegexp = '/(?:[^/\\\\]|\\\\.)*/\w*';
	// These characters have special meaning to the parser and must not appear in the middle of a
	// token, except as part of a string.
	var specials = ',"\'{}()/:[\\]';
	// Match text (at least two characters) that does not contain any of the above special characters,
	// although some of the special characters are allowed to start it (all but the colon and comma).
	// The text can contain spaces, but leading or trailing spaces are skipped.
	var everyThingElse = '[^\\s:,/][^' + specials + ']*[^\\s' + specials + ']';
	// Match any non-space character not matched already. This will match colons and commas, since they're
	// not matched by "everyThingElse", but will also match any other single character that wasn't already
	// matched (for example: in "a: 1, b: 2", each of the non-space characters will be matched by oneNotSpace).
	var oneNotSpace = '[^\\s]';
	// Create the actual regular expression by or-ing the above strings. The order is important.
	var bindingToken = RegExp(stringDouble + '|' + stringSingle + '|' + stringRegexp + '|' + everyThingElse + '|' + oneNotSpace, 'g');
	// Match end of previous token to determine whether a slash is a division or regex.
	var divisionLookBehind = /[\])"'A-Za-z0-9_$]+$/;
	var keywordRegexLookBehind = { 'in': 1, 'return': 1, 'typeof': 1 };
	// Simplified extend() for our use-case
	function extend(dst, obj) {
	    var key;
	    for (key in obj) {
	        if (obj.hasOwnProperty(key)) {
	            dst[key] = obj[key];
	        }
	    }
	    return dst;
	}
	/**
	* Split an object-literal string into tokens (borrowed from the KnockoutJS project)
	* @param {string} objectLiteralString A javascript-style object literal without leading and trailing curly brances
	* @return {Command<any>} A Command whose ExecuteAsync just returns the CommandParameter immediately. Which you should ignore!
	*/
	function parseObjectLiteral(objectLiteralString) {
	    // Trim leading and trailing spaces from the string
	    var str = objectLiteralString.trim();
	    // Trim braces '{' surrounding the whole object literal
	    if (str.charCodeAt(0) === 123)
	        str = str.slice(1, -1);
	    // Split into tokens
	    var result = new Array(), toks = str.match(bindingToken), key, values, depth = 0;
	    if (toks) {
	        // Append a comma so that we don't need a separate code block to deal with the last item
	        toks.push(',');
	        for (var i = 0, tok = void 0; tok = toks[i]; ++i) {
	            var c = tok.charCodeAt(0);
	            // A comma signals the end of a key/value pair if depth is zero
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
	                // Look at the end of the previous token to determine if the slash is actually division
	                var match = toks[i - 1].match(divisionLookBehind);
	                if (match && !keywordRegexLookBehind[match[0]]) {
	                    // The slash is actually a division punctuator; re-parse the remainder of the string (not including the slash)
	                    str = str.substr(str.indexOf(tok) + 1);
	                    toks = str.match(bindingToken);
	                    toks.push(',');
	                    i = -1;
	                    // Continue with just the slash
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
	                key = (c === 34 || c === 39) /* '"', "'" */ ? tok.slice(1, -1) : tok;
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
	exports.parseObjectLiteral = parseObjectLiteral;
	/**
	* Angular's expression compiler ported to Typescript
	*/
	var hookField = "___runtimeHooks";
	function isDefined(value) { return typeof value !== "undefined"; }
	//function valueFn(value) { return () => value; }
	function $parseMinErr(module, message, arg1, arg2, arg3, arg4, arg5) {
	    var args = arguments;
	    message = message.replace(/{(\d)}/g, function (match) {
	        return args[2 + parseInt(match[1])];
	    });
	    throw new SyntaxError(message);
	}
	function lowercase(string) { return typeof string === "string" ? string.toLowerCase() : string; }
	// Sandboxing Angular Expressions
	// ------------------------------
	// Angular expressions are generally considered safe because these expressions only have direct
	// access to $scope and locals. However, one can obtain the ability to execute arbitrary JS code by
	// obtaining a reference to native JS functions such as the Function constructor.
	//
	// As an example, consider the following Angular expression:
	//
	//   {}.toString.constructor(alert("evil JS code"))
	//
	// We want to prevent this type of access. For the sake of performance, during the lexing phase we
	// disallow any "dotted" access to any member named "constructor".
	//
	// For reflective calls (a[b]) we check that the value of the lookup is not the Function constructor
	// while evaluating the expression, which is a stronger but more expensive test. Since reflective
	// calls are expensive anyway, this is not such a big deal compared to static dereferencing.
	//
	// This sandboxing technique is not perfect and doesn't aim to be. The goal is to prevent exploits
	// against the expression language, but not to prevent exploits that were enabled by exposing
	// sensitive JavaScript or browser apis on Scope. Exposing such objects on a Scope is never a good
	// practice and therefore we are not even trying to protect against interaction with an object
	// explicitly exposed in this way.
	//
	// A developer could foil the name check by aliasing the Function constructor under a different
	// name on the scope.
	//
	// In general, it is not possible to access a Window object from an angular expression unless a
	// window or some DOM object that has a reference to window is published onto a Scope.
	function ensureSafeMemberName(name, fullExpression) {
	    if (name === "constructor") {
	        throw $parseMinErr("isecfld", "Referencing \"constructor\" field in WebRx expressions is disallowed! Expression: {0}", fullExpression);
	    }
	    return name;
	}
	function ensureSafeObject(obj, fullExpression) {
	    // nifty check if obj is Function that is fast and works across iframes and other contexts
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
	    /* jshint bitwise : false */
	    'null': function () { return null; },
	    'true': function () { return true; },
	    'false': function () { return false; },
	    undefined: Utils_1.noop,
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
	    '*': function (self, locals, a, b) { return a(self, locals) * b(self, locals); },
	    '/': function (self, locals, a, b) { return a(self, locals) / b(self, locals); },
	    '%': function (self, locals, a, b) { return a(self, locals) % b(self, locals); },
	    '^': function (self, locals, a, b) { return a(self, locals) ^ b(self, locals); },
	    '=': Utils_1.noop,
	    '===': function (self, locals, a, b) { return a(self, locals) === b(self, locals); },
	    '!==': function (self, locals, a, b) { return a(self, locals) !== b(self, locals); },
	    '==': function (self, locals, a, b) { return a(self, locals) === b(self, locals); },
	    '!=': function (self, locals, a, b) { return a(self, locals) !== b(self, locals); },
	    '<': function (self, locals, a, b) { return a(self, locals) < b(self, locals); },
	    '>': function (self, locals, a, b) { return a(self, locals) > b(self, locals); },
	    '<=': function (self, locals, a, b) { return a(self, locals) <= b(self, locals); },
	    '>=': function (self, locals, a, b) { return a(self, locals) >= b(self, locals); },
	    '&&': function (self, locals, a, b) { return a(self, locals) && b(self, locals); },
	    '||': function (self, locals, a, b) { return a(self, locals) || b(self, locals); },
	    '&': function (self, locals, a, b) { return a(self, locals) & b(self, locals); },
	    //    '|':function(self, locals, a,b){return a|b;},
	    '|': function (self, locals, a, b) { return b(self, locals)(self, locals, a(self, locals)); },
	    '!': function (self, locals, a) { return !a(self, locals); }
	};
	/* jshint bitwise: true */
	var ESCAPE = { "n": "\n", "f": "\f", "r": "\r", "t": "\t", "v": "\v", "'": "'", '"': "\"" };
	/**
	* @constructor
	*/
	var Lexer = (function () {
	    function Lexer(options) {
	        this.options = options;
	    }
	    Lexer.prototype.lex = function (text) {
	        this.text = text;
	        this.index = 0;
	        this.ch = undefined;
	        this.lastCh = ":"; // can start regexp
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
	                // identifiers can only be if the preceding char was a { or ,
	                if (this.was("{,") && json[0] === "{" &&
	                    (token = this.tokens[this.tokens.length - 1])) {
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
	        // IE treats non-breaking space as \u00A0
	        return (ch === " " || ch === "\r" || ch === "\t" ||
	            ch === "\n" || ch === "\v" || ch === "\u00A0");
	    };
	    Lexer.prototype.isIdent = function (ch) {
	        return ("a" <= ch && ch <= "z" ||
	            "A" <= ch && ch <= "Z" ||
	            "_" === ch || ch === "$" || ch === "@");
	    };
	    Lexer.prototype.isExpOperator = function (ch) {
	        return (ch === "-" || ch === "+" || this.isNumber(ch));
	    };
	    Lexer.prototype.throwError = function (error, start, end) {
	        end = end || this.index;
	        var colStr = (isDefined(start)
	            ? "s " + start + "-" + this.index + " [" + this.text.substring(start, end) + "]"
	            : " " + end);
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
	                else if (this.isExpOperator(ch) &&
	                    peekCh && this.isNumber(peekCh) &&
	                    n.charAt(n.length - 1) === "e") {
	                    n += ch;
	                }
	                else if (this.isExpOperator(ch) &&
	                    (!peekCh || !this.isNumber(peekCh)) &&
	                    n.charAt(n.length - 1) === "e") {
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
	        //check if this is not a method invocation and if it is back out to last dot
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
	        // OPERATORS is our own object so we don't need to use special hasOwnPropertyFn
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
	/**
	* @constructor
	*/
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
	            if (t === e1 || t === e2 || t === e3 || t === e4 ||
	                (!e1 && !e2 && !e3 && !e4)) {
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
	                // optimize for the common case where there is only one statement.
	                // TODO(size): maybe we should not support multiple statements?
	                return (statements.length === 1)
	                    ? statements[0] :
	                    function (self, locals) {
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
	                this.throwError("implies assignment but [" +
	                    this.text.substring(0, token.index) + "] can not be assigned to", token);
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
	                // prevent overwriting of Function.constructor which would break ensureSafeObject check
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
	            var fnPtr = fn(scope, locals, context) || Utils_1.noop;
	            ensureSafeObject(context, parser.text);
	            ensureSafeObject(fnPtr, parser.text);
	            // IE stupidity! (IE doesn't have apply for some native functions)
	            var v = fnPtr.apply
	                ? fnPtr.apply(context, args)
	                : fnPtr(args[0], args[1], args[2], args[3], args[4]);
	            return ensureSafeObject(v, parser.text);
	        };
	    };
	    // This is used with json array declaration
	    Parser.prototype.arrayDeclaration = function () {
	        var elementFns = [];
	        var allConstant = true;
	        if (this.peekToken().text !== "]") {
	            do {
	                if (this.peek("]")) {
	                    // Support trailing commas per ES5.1.
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
	                    // Support trailing commas per ES5.1.
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
	function ZERO() { return 0; }
	;
	//////////////////////////////////////////////////
	// Parser helper functions
	//////////////////////////////////////////////////
	function setter(obj, path, setValue, fullExp, options, locals) {
	    var element = path.split("."), key;
	    var i;
	    var propertyObj;
	    var hooks = getRuntimeHooks(locals);
	    if (hooks) {
	        for (var i_1 = 0; element.length > 1; i_1++) {
	            key = ensureSafeMemberName(element.shift(), fullExp);
	            propertyObj = hooks.readFieldHook ?
	                hooks.readFieldHook(obj, key) :
	                obj[key];
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
	        for (var i_2 = 0; element.length > 1; i_2++) {
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
	/**
	* Implementation of the "Black Hole" variant from:
	* - http://jsperf.com/angularjs-parse-getter/4
	* - http://jsperf.com/path-evaluation-simplified/7
	*/
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
	    // Check whether the cache has this getter already.
	    // We can use hasOwnProperty directly on the cache because we ensure,
	    // see below, that the cache never stores a path called 'hasOwnProperty'
	    if (getterFnCache.hasOwnProperty(path)) {
	        return getterFnCache[path];
	    }
	    var pathKeys = path.split("."), pathKeysLength = pathKeys.length, fn;
	    // When we have only 1 or 2 tokens, use optimized special case closures.
	    // http://jsperf.com/angularjs-parse-getter/6
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
	                // backup locals
	                var _locals = {};
	                Object.keys(locals).forEach(function (x) { return _locals[x] = locals[x]; });
	                var i = 0, val;
	                do {
	                    val = cspSafeGetterFn(pathKeys[i++], pathKeys[i++], pathKeys[i++], pathKeys[i++], pathKeys[i++], fullExp, options)(scope, locals);
	                    scope = val;
	                    // reset locals
	                    locals = {};
	                    Object.keys(_locals).forEach(function (x) { return locals[x] = _locals[x]; });
	                } while (i < pathKeysLength);
	                return val;
	            };
	        }
	    } /* else {
	    let code = "var p;\n";
	    forEach(pathKeys, (key, index) => {
	        ensureSafeMemberName(key, fullExp);
	        code += "if(s == null) return undefined;\n" +
	            "s=" + (index
	                // we simply dereference 's' on any .dot notation
	                ? "s"
	                // but if we are first then we check locals first, and if so read it first
	                : "((k&&k.hasOwnProperty(\"" + key + "\"))?k:s)") + "[\"" + key + "\"]" + ";\n";
	    });
	    code += "return s;";
	
	    // jshint -W054
	    let evaledFnGetter = new Function("s", "k", "pw", code); // s=scope, k=locals, pw=promiseWarning
	    // jshint +W054 /
	    evaledFnGetter.toString = valueFn(code);
	    fn = <(scope: any, locals?: any, self?: any) => any> evaledFnGetter;
	} */
	    // Only cache the value if it's not going to mess up the cache object
	    // This is more performant that using Object.prototype.hasOwnProperty.call
	    if (path !== "hasOwnProperty") {
	        getterFnCache[path] = fn;
	    }
	    return fn;
	}
	function getRuntimeHooks(locals) {
	    return locals !== undefined ? locals[hookField] : undefined;
	}
	exports.getRuntimeHooks = getRuntimeHooks;
	function setRuntimeHooks(locals, hooks) {
	    locals[hookField] = hooks;
	}
	exports.setRuntimeHooks = setRuntimeHooks;
	/**
	 * Compiles src and returns a function that executes src on a target object.
	 * The compiled function is cached under compile.cache[src] to speed up further calls.
	 *
	 * @param {string} src
	 * @returns {function}
	 */
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
	exports.compileExpression = compileExpression;
	//# sourceMappingURL=ExpressionCompiler.js.map

/***/ },
/* 16 */
/***/ function(module, exports, __webpack_require__) {

	/// <reference path="../Interfaces.ts" />
	var WeakMap_1 = __webpack_require__(7);
	var Set_1 = __webpack_require__(1);
	var IID_1 = __webpack_require__(10);
	var Injector_1 = __webpack_require__(4);
	var Utils_1 = __webpack_require__(5);
	var res = __webpack_require__(11);
	var env = __webpack_require__(17);
	"use strict";
	var DomManager = (function () {
	    function DomManager(compiler, app) {
	        this.expressionCache = {};
	        this.dataContextExtensions = Set_1.createSet();
	        this.parserOptions = {
	            disallowFunctionCalls: true
	        };
	        this.nodeState = WeakMap_1.createWeakMap();
	        this.compiler = compiler;
	        this.app = app;
	    }
	    DomManager.prototype.applyBindings = function (model, rootNode) {
	        if (rootNode === undefined || rootNode.nodeType !== 1)
	            Utils_1.throwError("first parameter should be your model, second parameter should be a DOM node!");
	        if (this.isNodeBound(rootNode))
	            Utils_1.throwError("an element must not be bound multiple times!");
	        // create or update node state for root node
	        var state = this.getNodeState(rootNode);
	        if (state) {
	            state.model = model;
	        }
	        else {
	            state = this.createNodeState(model);
	            this.setNodeState(rootNode, state);
	        }
	        // calculate resulting data-context and apply bindings
	        var ctx = this.getDataContext(rootNode);
	        this.applyBindingsRecursive(ctx, rootNode);
	    };
	    DomManager.prototype.applyBindingsToDescendants = function (ctx, node) {
	        if (node.hasChildNodes()) {
	            for (var i = 0; i < node.childNodes.length; i++) {
	                var child = node.childNodes[i];
	                // only elements
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
	                // only elements
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
	            // build compiler options
	            var options = Utils_1.extend(this.parserOptions, {});
	            options.filters = {};
	            // enrich with app filters
	            Utils_1.extend(this.app.filters(), options.filters);
	            // enrich with module filters
	            if (module && module.name != "app") {
	                Utils_1.extend(module.filters(), options.filters);
	            }
	            return this.compiler.compileExpression(value, options, this.expressionCache);
	        }
	    };
	    DomManager.prototype.getModuleContext = function (node) {
	        var state;
	        // collect model hierarchy
	        while (node) {
	            state = this.getNodeState(node);
	            if (state != null) {
	                if (state.module != null) {
	                    return state.module;
	                }
	            }
	            node = node.parentNode;
	        }
	        // default to app
	        return this.app;
	    };
	    DomManager.prototype.registerDataContextExtension = function (extension) {
	        this.dataContextExtensions.add(extension);
	    };
	    DomManager.prototype.getDataContext = function (node) {
	        var models = [];
	        var state = this.getNodeState(node);
	        // collect model hierarchy
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
	        // extensions
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
	        return state != null && !!state.isBound;
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
	        // support external per-node cleanup
	        env.cleanExternalData(node);
	    };
	    DomManager.prototype.evaluateExpression = function (exp, ctx) {
	        var locals = this.createLocals(undefined, ctx);
	        var result = exp(ctx.$data, locals);
	        return result;
	    };
	    DomManager.prototype.expressionToObservable = function (exp, ctx, evalObs) {
	        var _this = this;
	        var captured = Set_1.createSet();
	        var locals;
	        var result;
	        // initial evaluation
	        try {
	            locals = this.createLocals(captured, ctx);
	            result = exp(ctx.$data, locals);
	            // diagnostics
	            if (evalObs)
	                evalObs.onNext(true);
	        }
	        catch (e) {
	            this.app.defaultExceptionHandler.onNext(e);
	            return Rx.Observable.return(undefined);
	        }
	        // Optimization: If the initial evaluation didn't touch any observables, treat it as constant expression
	        if (captured.size === 0) {
	            if (Utils_1.isRxObservable(result))
	                return result;
	            // wrap it
	            return Rx.Observable.return(result);
	        }
	        var obs = Rx.Observable.create(function (observer) {
	            var innerDisp = Rx.Observable.defer(function () {
	                // construct observable that represents the first change of any of the expression's dependencies
	                return Rx.Observable.merge(Set_1.setToArray(captured)).take(1);
	            })
	                .repeat()
	                .subscribe(function (trigger) {
	                try {
	                    // reset execution state before evaluation
	                    captured.clear();
	                    locals = _this.createLocals(captured, ctx);
	                    // evaluate and produce next value
	                    result = exp(ctx.$data, locals);
	                    if (!Utils_1.isRxObservable(result)) {
	                        // wrap non-observable
	                        observer.onNext(Rx.Observable.return(result));
	                    }
	                    else {
	                        observer.onNext(result);
	                    }
	                    // diagnostics
	                    if (evalObs)
	                        evalObs.onNext(true);
	                }
	                catch (e) {
	                    _this.app.defaultExceptionHandler.onNext(e);
	                }
	            });
	            return innerDisp;
	        });
	        // prefix with initial result
	        var startValue = Utils_1.isRxObservable(result) ?
	            result :
	            Rx.Observable.return(result);
	        return obs.startWith(startValue).concatAll();
	    };
	    DomManager.prototype.applyBindingsInternal = function (ctx, el, module) {
	        var result = false;
	        // get or create elment-state
	        var state = this.getNodeState(el);
	        // create and set if necessary
	        if (!state) {
	            state = this.createNodeState();
	            this.setNodeState(el, state);
	        }
	        else if (state.isBound) {
	            Utils_1.throwError("an element must not be bound multiple times!");
	        }
	        var _bindings;
	        var tagName = el.tagName.toLowerCase();
	        // check if tag represents a component
	        if (module.hasComponent(tagName) || this.app.hasComponent(tagName)) {
	            // when a component is referenced by element, we just apply a virtual 'component' binding
	            var params = el.getAttribute(DomManager.paramsAttributename);
	            var componentReference;
	            if (params)
	                componentReference = "{ name: '" + tagName + "', params: {" + el.getAttribute(DomManager.paramsAttributename) + "} }";
	            else
	                componentReference = "{ name: '" + tagName + "' }";
	            _bindings = [{ key: 'component', value: componentReference }];
	        }
	        else {
	            // get definitions from attribute
	            _bindings = this.getBindingDefinitions(el);
	        }
	        if (_bindings != null && _bindings.length > 0) {
	            // lookup handlers
	            var bindings = _bindings.map(function (x) {
	                var handler = module.binding(x.key);
	                if (!handler)
	                    Utils_1.throwError("binding '{0}' has not been registered.", x.key);
	                return { handler: handler, value: x.value };
	            });
	            // sort by priority
	            bindings.sort(function (a, b) { return (b.handler.priority || 0) - (a.handler.priority || 0); });
	            // check if there's binding-handler competition for descendants (which is illegal)
	            var hd = bindings.filter(function (x) { return x.handler.controlsDescendants; }).map(function (x) { return "'" + x.value + "'"; });
	            if (hd.length > 1) {
	                Utils_1.throwError("bindings {0} are competing for descendants of target element!", hd.join(", "));
	            }
	            result = hd.length > 0;
	            // apply all bindings
	            for (var i = 0; i < bindings.length; i++) {
	                var binding = bindings[i];
	                var handler = binding.handler;
	                handler.applyBinding(el, binding.value, ctx, state, module);
	            }
	        }
	        // mark bound
	        state.isBound = true;
	        return result;
	    };
	    DomManager.prototype.isObjectLiteralString = function (str) {
	        return str[0] === "{" && str[str.length - 1] === "}";
	    };
	    DomManager.prototype.getBindingDefinitions = function (node) {
	        var bindingText = null;
	        if (node.nodeType === 1) {
	            // attempt to get definition from attribute
	            var attr = node.getAttribute(DomManager.bindingAttributeName);
	            if (attr) {
	                bindingText = attr;
	            }
	        }
	        // transform textual binding-definition into a key-value store where 
	        // the key is the binding name and the value is its options
	        if (bindingText) {
	            bindingText = bindingText.trim();
	        }
	        if (bindingText)
	            return this.compiler.parseObjectLiteral(bindingText);
	        return null;
	    };
	    DomManager.prototype.applyBindingsRecursive = function (ctx, el, module) {
	        // "module" binding receiving first-class treatment here because it is considered part of the core
	        module = module || this.getModuleContext(el);
	        if (!this.applyBindingsInternal(ctx, el, module) && el.hasChildNodes()) {
	            // module binding might have updated state.module
	            var state = this.getNodeState(el);
	            if (state && state.module)
	                module = state.module;
	            // iterate over descendants
	            for (var i = 0; i < el.childNodes.length; i++) {
	                var child = el.childNodes[i];
	                // only elements
	                if (child.nodeType !== 1)
	                    continue;
	                this.applyBindingsRecursive(ctx, child, module);
	            }
	        }
	    };
	    DomManager.prototype.cleanNodeRecursive = function (node) {
	        if (node.hasChildNodes()) {
	            var length_1 = node.childNodes.length;
	            for (var i = 0; i < length_1; i++) {
	                var child = node.childNodes[i];
	                // only elements
	                if (node.nodeType !== 1)
	                    continue;
	                this.cleanNodeRecursive(child);
	            }
	        }
	        // clear parent after childs
	        this.clearNodeState(node);
	    };
	    DomManager.prototype.createLocals = function (captured, ctx) {
	        var locals = {};
	        var list;
	        var prop;
	        var result, target;
	        var hooks = {
	            readFieldHook: function (o, field) {
	                // handle "@propref" access-modifier
	                var noUnwrap = false;
	                if (field[0] === '@') {
	                    noUnwrap = true;
	                    field = field.substring(1);
	                }
	                result = o[field];
	                // intercept access to observable properties
	                if (!noUnwrap && Utils_1.isProperty(result)) {
	                    var prop_1 = result;
	                    // register observable
	                    if (captured)
	                        captured.add(prop_1.changed);
	                    // get the property's real value
	                    result = prop_1();
	                }
	                return result;
	            },
	            writeFieldHook: function (o, field, newValue) {
	                // ignore @propref access-modifier on writes
	                if (field[0] === '@') {
	                    field = field.substring(1);
	                }
	                target = o[field];
	                // intercept access to observable properties
	                if (Utils_1.isProperty(target)) {
	                    var prop_2 = target;
	                    // register observable
	                    if (captured)
	                        captured.add(prop_2.changed);
	                    // replace field assignment with property invocation
	                    prop_2(newValue);
	                }
	                else {
	                    o[field] = newValue;
	                }
	                return newValue;
	            },
	            readIndexHook: function (o, index) {
	                // recognize observable lists
	                if (Utils_1.queryInterface(o, IID_1.default.IObservableList)) {
	                    // translate indexer to list.get()
	                    list = o;
	                    result = list.get(index);
	                    // add collectionChanged to monitored observables
	                    if (captured)
	                        captured.add(list.listChanged);
	                }
	                else {
	                    result = o[index];
	                }
	                // intercept access to observable properties
	                if (Utils_1.queryInterface(result, IID_1.default.IObservableProperty)) {
	                    var prop_3 = result;
	                    // register observable
	                    if (captured)
	                        captured.add(prop_3.changed);
	                    // get the property's real value
	                    result = prop_3();
	                }
	                return result;
	            },
	            writeIndexHook: function (o, index, newValue) {
	                // recognize observable lists
	                if (Utils_1.queryInterface(o, IID_1.default.IObservableList)) {
	                    // translate indexer to list.get()
	                    list = o;
	                    target = list.get(index);
	                    // add collectionChanged to monitored observables
	                    if (captured)
	                        captured.add(list.listChanged);
	                    // intercept access to observable properties
	                    if (Utils_1.isProperty(target)) {
	                        prop = target;
	                        // register observable
	                        if (captured)
	                            captured.add(prop.changed);
	                        // replace field assignment with property invocation
	                        prop(newValue);
	                    }
	                    else {
	                        list.set(index, newValue);
	                    }
	                }
	                else {
	                    // intercept access to observable properties
	                    if (Utils_1.isProperty(o[index])) {
	                        prop = target[index];
	                        // register observable
	                        if (captured)
	                            captured.add(prop.changed);
	                        // replace field assignment with property invocation
	                        prop(newValue);
	                    }
	                    else {
	                        o[index] = newValue;
	                    }
	                }
	                return newValue;
	            }
	        };
	        // install property interceptor hooks
	        this.compiler.setRuntimeHooks(locals, hooks);
	        // injected context members into locals
	        var keys = Object.keys(ctx);
	        var length = keys.length;
	        for (var i = 0; i < length; i++) {
	            var key = keys[i];
	            locals[key] = ctx[key];
	        }
	        return locals;
	    };
	    //////////////////////////////////
	    // Implementation
	    DomManager.bindingAttributeName = "data-bind";
	    DomManager.paramsAttributename = "params";
	    return DomManager;
	})();
	exports.DomManager = DomManager;
	/**
	* Applies bindings to the specified node and all of its children using the specified data context.
	* @param {any} model The model to bind to
	* @param {Node} rootNode The node to be bound
	*/
	function applyBindings(model, node) {
	    Injector_1.injector.get(res.domManager).applyBindings(model, node || window.document.documentElement);
	}
	exports.applyBindings = applyBindings;
	/**
	* Removes and cleans up any binding-related state from the specified node and its descendants.
	* @param {Node} rootNode The node to be cleaned
	*/
	function cleanNode(node) {
	    Injector_1.injector.get(res.domManager).cleanNode(node);
	}
	exports.cleanNode = cleanNode;
	//# sourceMappingURL=DomManager.js.map

/***/ },
/* 17 */
/***/ function(module, exports, __webpack_require__) {

	var WeakMap_1 = __webpack_require__(7);
	"use strict";
	var _window = window;
	var userAgent = _window.navigator.userAgent;
	var parseVersion = function (matches) {
	    if (matches) {
	        return parseFloat(matches[1]);
	    }
	    return undefined;
	};
	// Detect Opera
	if (_window.opera && _window.opera.version) {
	    exports.opera = { version: parseInt(_window.opera.version()) };
	}
	// Detect wx.IE versions for bug workarounds (uses wx.IE conditionals, not UA string, for robustness)
	// Note that, since wx.IE 10 does not support conditional comments, the following logic only detects wx.IE < 10.
	// Currently this is by design, since wx.IE 10+ behaves correctly when treated as a standard browser.
	var version = document && (function () {
	    var version = 3, div = document.createElement('div'), iElems = div.getElementsByTagName('i');
	    // Keep constructing conditional HTML blocks until we hit one that resolves to an empty fragment
	    while (div.innerHTML = '<!--[if gt wx.IE ' + (++version) + ']><i></i><![endif]-->',
	        iElems[0]) { }
	    return version > 4 ? version : undefined;
	}());
	if (version) {
	    exports.ie = { version: version };
	    if (version < 10) {
	        // for wx.IE9 and lower, provide an accessor for document scoped
	        // observables which allow monitoring the selectionchange event
	        var map = WeakMap_1.createWeakMap();
	        exports.ie.getSelectionChangeObservable = function (el) {
	            var doc = el.ownerDocument;
	            var result = map.get(doc);
	            if (result)
	                return result;
	            result = Rx.Observable.defer(function () {
	                return Rx.Observable.fromEvent(doc, 'selectionchange');
	            })
	                .select(function (x) { return doc; })
	                .publish()
	                .refCount();
	            map.set(doc, result);
	            return result;
	        };
	    }
	}
	// Detect Safari (not Chrome or WebKit)
	version = parseVersion(userAgent.match(/^(?:(?!chrome).)*version\/([^ ]*) safari/i));
	if (version) {
	    exports.safari = { version: version };
	}
	// Detect FF
	version = parseVersion(userAgent.match(/Firefox\/([^ ]*)/));
	if (version) {
	    exports.firefox = { version: version };
	}
	var hasES5 = typeof Array.isArray === "function" &&
	    typeof [].forEach === "function" &&
	    typeof [].map === "function" &&
	    typeof [].some === "function" &&
	    typeof [].indexOf === "function" &&
	    typeof Object.keys === "function" &&
	    typeof Object.defineProperty === "function";
	exports.isSupported = (!exports.ie || exports.ie.version >= 9) ||
	    (!exports.safari || exports.safari.version >= 5) ||
	    (!exports.firefox || exports.firefox.version >= 5) &&
	        hasES5;
	// Special support for jQuery here because it's so commonly used.
	exports.jQueryInstance = window["jQuery"];
	if (exports.jQueryInstance && (typeof exports.jQueryInstance['cleanData'] === "function")) {
	    exports.cleanExternalData = function (node) {
	        // Many jQuery plugins (including jquery.tmpl) store data using jQuery's equivalent of domData
	        // so notify it to tear down any resources associated with the node.
	        exports.jQueryInstance['cleanData']([node]);
	    };
	}
	else {
	    exports.cleanExternalData = function (node) { };
	}
	//# sourceMappingURL=Environment.js.map

/***/ },
/* 18 */
/***/ function(module, exports, __webpack_require__) {

	/// <reference path="../Interfaces.ts" />
	"use strict";
	/**
	* Html Template Engine based on JQuery's parseHTML
	* NOTE: This version does not support scripts in templates!
	*/
	var rsingleTag = /^<([\w-]+)\s*\/?>(?:<\/\1>|)$/, rxhtmlTag = /<(?!area|br|col|embed|hr|img|input|link|meta|param)(([\w:-]+)[^>]*)\/>/gi, rtagName = /<([\w:-]+)/, rhtml = /<|&#?\w+;/, rscriptType = /^$|\/(?:java|ecma)script/i, 
	// We have to close these tags to support XHTML (#13200)
	wrapMap = {
	    // Support: IE9
	    option: [1, "<select multiple='multiple'>", "</select>"],
	    thead: [1, "<table>", "</table>"],
	    // Some of the following wrappers are not fully defined, because
	    // their parent elements (except for "table" element) could be omitted
	    // since browser parsers are smart enough to auto-insert them
	    // Support: Android 2.3
	    // Android browser doesn't auto-insert colgroup
	    col: [2, "<table><colgroup>", "</colgroup></table>"],
	    // Auto-insert "tbody" element
	    tr: [2, "<table>", "</table>"],
	    // Auto-insert "tbody" and "tr" elements
	    td: [3, "<table>", "</table>"],
	    _default: [0, "", ""]
	};
	// Support: IE9
	wrapMap.optgroup = wrapMap.option;
	wrapMap.tbody = wrapMap.tfoot = wrapMap.colgroup = wrapMap.caption = wrapMap.thead;
	wrapMap.th = wrapMap.td;
	var supportsCreateHTMLDocument = (function () {
	    var doc = document.implementation.createHTMLDocument("");
	    // Support: Node with jsdom<=1.5.0+
	    // jsdom's document created via the above method doesn't contain the body
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
	            // Add nodes directly
	            if (typeof elem === "object") {
	                // Support: Android<4.1, PhantomJS<2
	                // push.apply(_, arraylike) throws on ancient WebKit
	                merge(nodes, elem.nodeType ? [elem] : elem);
	            }
	            else if (!rhtml.test(elem)) {
	                nodes.push(context.createTextNode(elem));
	            }
	            else {
	                tmp = tmp || fragment.appendChild(context.createElement("div"));
	                // Deserialize a standard representation
	                tag = (rtagName.exec(elem) || ["", ""])[1].toLowerCase();
	                wrap = wrapMap[tag] || wrapMap._default;
	                tmp.innerHTML = wrap[1] + elem.replace(rxhtmlTag, "<$1></$2>") + wrap[2];
	                // Descend through wrappers to the right content
	                j = wrap[0];
	                while (j--) {
	                    tmp = tmp.lastChild;
	                }
	                // Support: Android<4.1, PhantomJS<2
	                // push.apply(_, arraylike) throws on ancient WebKit
	                merge(nodes, tmp.childNodes);
	                // Remember the top-level container
	                tmp = fragment.firstChild;
	                // Ensure the created nodes are orphaned (#12392)
	                tmp.textContent = "";
	            }
	        }
	    }
	    // Remove wrapper from fragment
	    fragment.textContent = "";
	    i = 0;
	    while ((elem = nodes[i++])) {
	        // filter out scripts
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
	        // document.implementation stops scripts or inline event handlers from being executed immediately
	        var context = supportsCreateHTMLDocument ? document.implementation.createHTMLDocument("") : document;
	        var parsed = rsingleTag.exec(data);
	        // Single tag
	        if (parsed) {
	            return [context.createElement(parsed[1])];
	        }
	        parsed = buildFragment([data], context);
	        var result = merge([], parsed.childNodes);
	        return result;
	    };
	    return HtmlTemplateEngine;
	})();
	exports.default = HtmlTemplateEngine;
	//# sourceMappingURL=HtmlTemplateEngine.js.map

/***/ },
/* 19 */
/***/ function(module, exports, __webpack_require__) {

	/// <reference path="../../node_modules/rx/ts/rx.all.d.ts" />
	/// <reference path="../Interfaces.ts" />
	var Utils_1 = __webpack_require__(5);
	var Command_1 = __webpack_require__(20);
	"use strict";
	var CommandBinding = (function () {
	    function CommandBinding(domManager, app) {
	        this.priority = 0;
	        this.domManager = domManager;
	        this.app = app;
	    }
	    ////////////////////
	    // wx.IBinding
	    CommandBinding.prototype.applyBinding = function (node, options, ctx, state, module) {
	        var _this = this;
	        if (node.nodeType !== 1)
	            Utils_1.throwError("command-binding only operates on elements!");
	        if (options == null)
	            Utils_1.throwError("invalid binding-options!");
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
	        state.cleanup.add(Rx.Observable
	            .combineLatest(cmdObservable, paramObservable, function (cmd, param) { return ({ cmd: cmd, param: param }); })
	            .subscribe(function (x) {
	            try {
	                doCleanup();
	                cleanup = new Rx.CompositeDisposable();
	                if (x.cmd != null) {
	                    if (!Command_1.isCommand(x.cmd))
	                        Utils_1.throwError("Command-Binding only supports binding to a command!");
	                    // disabled handling if supported by element
	                    if (Utils_1.elementCanBeDisabled(el)) {
	                        // initial update
	                        el.disabled = !x.cmd.canExecute(x.param);
	                        // listen to changes
	                        cleanup.add(x.cmd.canExecuteObservable.subscribe(function (canExecute) {
	                            el.disabled = !canExecute;
	                        }));
	                    }
	                    // handle input events
	                    cleanup.add(Rx.Observable.fromEvent(el, "click").subscribe(function (e) {
	                        // verify that the command can actually execute since we cannot disable 
	                        // all elements - only form elements such as buttons 
	                        if (x.cmd.canExecute(x.param)) {
	                            x.cmd.execute(x.param);
	                        }
	                        // prevent default for anchors
	                        if (isAnchor) {
	                            e.preventDefault();
	                        }
	                    }));
	                }
	            }
	            catch (e) {
	                _this.app.defaultExceptionHandler.onNext(e);
	            }
	        }));
	        // release closure references to GC 
	        state.cleanup.add(Rx.Disposable.create(function () {
	            // nullify args
	            node = null;
	            options = null;
	            ctx = null;
	            state = null;
	            // nullify common locals
	            el = null;
	            // nullify locals
	            doCleanup();
	        }));
	    };
	    CommandBinding.prototype.configure = function (options) {
	        // intentionally left blank
	    };
	    return CommandBinding;
	})();
	exports.default = CommandBinding;
	//# sourceMappingURL=Command.js.map

/***/ },
/* 20 */
/***/ function(module, exports, __webpack_require__) {

	/// <reference path="../Interfaces.ts" />
	var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
	    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") return Reflect.decorate(decorators, target, key, desc);
	    switch (arguments.length) {
	        case 2: return decorators.reduceRight(function(o, d) { return (d && d(o)) || o; }, target);
	        case 3: return decorators.reduceRight(function(o, d) { return (d && d(target, key)), void 0; }, void 0);
	        case 4: return decorators.reduceRight(function(o, d) { return (d && d(target, key, o)) || o; }, desc);
	    }
	};
	var __metadata = (this && this.__metadata) || function (k, v) {
	    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
	};
	var IID_1 = __webpack_require__(10);
	var Utils_1 = __webpack_require__(5);
	var Reflect_1 = __webpack_require__(6);
	var Injector_1 = __webpack_require__(4);
	var res = __webpack_require__(11);
	"use strict";
	var Command = (function () {
	    /// <summary>
	    /// Don't use this directly, use commandXYZ instead
	    /// </summary>
	    function Command(canExecute, executeAsync, scheduler) {
	        var _this = this;
	        this.resultsSubject = new Rx.Subject();
	        this.isExecutingSubject = new Rx.Subject();
	        this.inflightCount = 0;
	        this.canExecuteLatest = false;
	        this.canExecuteDisp = null;
	        this.scheduler = scheduler || Injector_1.injector.get(res.app).mainThreadScheduler;
	        this.func = executeAsync;
	        // setup canExecute
	        this.canExecuteObs = canExecute
	            .combineLatest(this.isExecutingSubject.startWith(false), function (ce, ie) { return ce && !ie; })
	            .catch(function (ex) {
	            _this.exceptionsSubject.onNext(ex);
	            return Rx.Observable.return(false);
	        })
	            .do(function (x) {
	            _this.canExecuteLatest = x;
	        })
	            .publish();
	        if (Utils_1.isInUnitTest()) {
	            this.canExecuteObs.connect();
	        }
	        // setup thrownExceptions
	        this.exceptionsSubject = new Rx.Subject();
	        this.thrownExceptions = this.exceptionsSubject.asObservable();
	        this.exceptionsSubject
	            .observeOn(this.scheduler)
	            .subscribe(Injector_1.injector.get(res.app).defaultExceptionHandler);
	    }
	    //////////////////////////////////
	    // IDisposable implementation
	    Command.prototype.dispose = function () {
	        var disp = this.canExecuteDisp;
	        if (disp != null)
	            disp.dispose();
	    };
	    Object.defineProperty(Command.prototype, "canExecuteObservable", {
	        ////////////////////
	        /// wx.ICommand
	        get: function () {
	            var _this = this;
	            // setup canExecuteObservable
	            var ret = this.canExecuteObs.startWith(this.canExecuteLatest).distinctUntilChanged();
	            if (this.canExecuteDisp != null)
	                return ret;
	            return Rx.Observable.create(function (subj) {
	                var disp = ret.subscribe(subj);
	                // NB: We intentionally leak the CanExecute disconnect, it's
	                // cleaned up by the global Dispose. This is kind of a
	                // "Lazy Subscription" to CanExecute by the command itself.
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
	        this.executeAsync(parameter)
	            .catch(Rx.Observable.empty())
	            .subscribe();
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
	            var disp = self.func(parameter)
	                .observeOn(self.scheduler)
	                .do(function (_) { }, function (e) { return decrement.setDisposable(Rx.Disposable.empty); }, function () { return decrement.setDisposable(Rx.Disposable.empty); })
	                .do(function (x) { return self.resultsSubject.onNext(x); }, function (x) { return self.exceptionsSubject.onNext(x); })
	                .subscribe(subj);
	            return new Rx.CompositeDisposable(disp, decrement);
	        });
	        return ret
	            .publish()
	            .refCount();
	    };
	    Command = __decorate([
	        Reflect_1.Implements(IID_1.default.ICommand),
	        Reflect_1.Implements(IID_1.default.IDisposable), 
	        __metadata('design:paramtypes', [Rx.Observable, Function, Object])
	    ], Command);
	    return Command;
	})();
	exports.Command = Command;
	var internal;
	(function (internal) {
	    internal.commandConstructor = Command;
	})(internal = exports.internal || (exports.internal = {}));
	// factory method implementation
	function command() {
	    var args = Utils_1.args2Array(arguments);
	    var canExecute;
	    var execute;
	    var scheduler;
	    var thisArg;
	    if (Utils_1.isFunction(args[0])) {
	        // first overload
	        execute = args.shift();
	        canExecute = Utils_1.isRxObservable(args[0]) ? args.shift() : Rx.Observable.return(true);
	        scheduler = Utils_1.isRxScheduler(args[0]) ? args.shift() : undefined;
	        thisArg = args.shift();
	        if (thisArg != null)
	            execute = execute.bind(thisArg);
	        return asyncCommand(canExecute, function (parameter) {
	            return Rx.Observable.create(function (obs) {
	                try {
	                    execute(parameter);
	                    obs.onNext(null);
	                    obs.onCompleted();
	                }
	                catch (e) {
	                    obs.onError(e);
	                }
	                return Rx.Disposable.empty;
	            });
	        }, scheduler);
	    }
	    // second overload
	    canExecute = args.shift() || Rx.Observable.return(true);
	    scheduler = Utils_1.isRxScheduler(args[0]) ? args.shift() : undefined;
	    return new Command(canExecute, function (x) { return Rx.Observable.return(x); }, scheduler);
	}
	exports.command = command;
	// factory method implementation
	function asyncCommand() {
	    var args = Utils_1.args2Array(arguments);
	    var canExecute;
	    var executeAsync;
	    var scheduler;
	    var thisArg;
	    if (Utils_1.isFunction(args[0])) {
	        // second overload
	        executeAsync = args.shift();
	        scheduler = Utils_1.isRxScheduler(args[0]) ? args.shift() : undefined;
	        thisArg = args.shift();
	        if (thisArg != null)
	            executeAsync = executeAsync.bind(thisArg);
	        return new Command(Rx.Observable.return(true), executeAsync, scheduler);
	    }
	    // first overload
	    canExecute = args.shift();
	    executeAsync = args.shift();
	    scheduler = Utils_1.isRxScheduler(args[0]) ? args.shift() : undefined;
	    return new Command(canExecute, executeAsync, scheduler);
	}
	exports.asyncCommand = asyncCommand;
	// factory method implementation
	function combinedCommand() {
	    var args = Utils_1.args2Array(arguments);
	    var commands = args
	        .filter(function (x) { return isCommand(x); });
	    var canExecute = args
	        .filter(function (x) { return Utils_1.isRxObservable(x); })
	        .pop();
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
	exports.combinedCommand = combinedCommand;
	/**
	* Determines if target is an instance of a ICommand
	* @param {any} target
	*/
	function isCommand(target) {
	    if (target == null)
	        return false;
	    return target instanceof Command ||
	        Utils_1.queryInterface(target, IID_1.default.ICommand);
	}
	exports.isCommand = isCommand;
	//# sourceMappingURL=Command.js.map

/***/ },
/* 21 */
/***/ function(module, exports, __webpack_require__) {

	/// <reference path="../../node_modules/rx/ts/rx.all.d.ts" />
	/// <reference path="../Interfaces.ts" />
	var Utils_1 = __webpack_require__(5);
	var Module_1 = __webpack_require__(14);
	"use strict";
	var ModuleBinding = (function () {
	    function ModuleBinding(domManager, app) {
	        this.priority = 100;
	        this.controlsDescendants = true;
	        this.domManager = domManager;
	        this.app = app;
	    }
	    ////////////////////
	    // wx.IBinding
	    ModuleBinding.prototype.applyBinding = function (node, options, ctx, state, module) {
	        var _this = this;
	        if (node.nodeType !== 1)
	            Utils_1.throwError("module-binding only operates on elements!");
	        if (options == null)
	            Utils_1.throwError("invalid binding-options!");
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
	        // backup inner HTML
	        var template = new Array();
	        // subscribe
	        state.cleanup.add(obs.subscribe(function (x) {
	            try {
	                doCleanup();
	                cleanup = new Rx.CompositeDisposable();
	                var value = Utils_1.unwrapProperty(x);
	                var moduleNames;
	                var disp = undefined;
	                // split names
	                if (value) {
	                    value = value.trim();
	                    moduleNames = value.split(" ").filter(function (x) { return x; });
	                }
	                if (moduleNames.length > 0) {
	                    var observables = moduleNames.map(function (x) { return Module_1.loadModule(x); });
	                    disp = Rx.Observable.combineLatest(observables, function (_) { return Utils_1.args2Array(arguments); }).subscribe(function (modules) {
	                        try {
	                            // create intermediate module
	                            var moduleName = (module || _this.app).name + "+" + moduleNames.join("+");
	                            var merged = new Module_1.Module(moduleName);
	                            // merge modules into intermediate
	                            merged.merge(module || _this.app);
	                            modules.forEach(function (x) { return merged.merge(x); });
	                            // done
	                            self.applyValue(el, merged, template, ctx, state, initialApply);
	                            initialApply = false;
	                        }
	                        catch (e) {
	                            _this.app.defaultExceptionHandler.onNext(e);
	                        }
	                    });
	                    if (disp != null)
	                        cleanup.add(disp);
	                }
	            }
	            catch (e) {
	                _this.app.defaultExceptionHandler.onNext(e);
	            }
	        }));
	        // release closure references to GC 
	        state.cleanup.add(Rx.Disposable.create(function () {
	            // nullify args
	            node = null;
	            options = null;
	            ctx = null;
	            state = null;
	            // nullify common locals
	            obs = null;
	            self = null;
	        }));
	    };
	    ModuleBinding.prototype.configure = function (options) {
	        // intentionally left blank
	    };
	    ModuleBinding.prototype.applyValue = function (el, module, template, ctx, state, initialApply) {
	        if (initialApply) {
	            // clone to template
	            for (var i = 0; i < el.childNodes.length; i++) {
	                template.push(el.childNodes[i].cloneNode(true));
	            }
	        }
	        state.module = module;
	        // clean first
	        this.domManager.cleanDescendants(el);
	        // clear
	        while (el.firstChild) {
	            el.removeChild(el.firstChild);
	        }
	        // clone nodes and inject
	        for (var i = 0; i < template.length; i++) {
	            var node = template[i].cloneNode(true);
	            el.appendChild(node);
	        }
	        this.domManager.applyBindingsToDescendants(ctx, el);
	    };
	    return ModuleBinding;
	})();
	exports.default = ModuleBinding;
	//# sourceMappingURL=Module.js.map

/***/ },
/* 22 */
/***/ function(module, exports, __webpack_require__) {

	/// <reference path="../../node_modules/rx/ts/rx.all.d.ts" />
	/// <reference path="../Interfaces.ts" />
	var __extends = (this && this.__extends) || function (d, b) {
	    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
	    function __() { this.constructor = d; }
	    __.prototype = b.prototype;
	    d.prototype = new __();
	};
	var Utils_1 = __webpack_require__(5);
	"use strict";
	var IfBinding = (function () {
	    function IfBinding(domManager, app) {
	        this.priority = 50;
	        this.controlsDescendants = true;
	        ////////////////////
	        // wx.Implementation
	        this.inverse = false;
	        this.domManager = domManager;
	        this.app = app;
	    }
	    ////////////////////
	    // wx.IBinding
	    IfBinding.prototype.applyBinding = function (node, options, ctx, state, module) {
	        var _this = this;
	        if (node.nodeType !== 1)
	            Utils_1.throwError("if-binding only operates on elements!");
	        if (options == null)
	            Utils_1.throwError("invalid binding-options!");
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
	            // extract animations
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
	        // backup inner HTML
	        var template = new Array();
	        // subscribe
	        state.cleanup.add(obs.subscribe(function (x) {
	            try {
	                doCleanup();
	                cleanup = new Rx.CompositeDisposable();
	                cleanup.add(self.applyValue(el, Utils_1.unwrapProperty(x), template, ctx, animations, initialApply));
	                initialApply = false;
	            }
	            catch (e) {
	                _this.app.defaultExceptionHandler.onNext(e);
	            }
	        }));
	        // release closure references to GC 
	        state.cleanup.add(Rx.Disposable.create(function () {
	            // nullify args
	            node = null;
	            options = null;
	            ctx = null;
	            state = null;
	            // nullify common locals
	            obs = null;
	            el = null;
	            self = null;
	            // nullify locals
	            template = null;
	        }));
	    };
	    IfBinding.prototype.configure = function (options) {
	        // intentionally left blank
	    };
	    IfBinding.prototype.applyValue = function (el, value, template, ctx, animations, initialApply) {
	        var leaveAnimation = animations.leave;
	        var enterAnimation = animations.enter;
	        var self = this;
	        var obs = undefined;
	        if (initialApply) {
	            // clone to template
	            for (var i = 0; i < el.childNodes.length; i++) {
	                template.push(el.childNodes[i].cloneNode(true));
	            }
	            // clear
	            while (el.firstChild) {
	                el.removeChild(el.firstChild);
	            }
	        }
	        var oldElements = Utils_1.nodeChildrenToArray(el);
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
	                    obs = leaveAnimation.run(oldElements)
	                        .continueWith(function () { return leaveAnimation.complete(oldElements); })
	                        .continueWith(removeOldElements);
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
	            for (var i = 0; i < template.length; i++) {
	                el.appendChild(nodes[i]);
	            }
	            this.domManager.applyBindingsToDescendants(ctx, el);
	            if (enterAnimation) {
	                obs = enterAnimation.run(nodes)
	                    .continueWith(function () { return enterAnimation.complete(nodes); });
	            }
	        }
	        return obs ? (obs.subscribe() || Rx.Disposable.empty) : Rx.Disposable.empty;
	    };
	    return IfBinding;
	})();
	exports.IfBinding = IfBinding;
	var NotIfBinding = (function (_super) {
	    __extends(NotIfBinding, _super);
	    function NotIfBinding(domManager, app) {
	        _super.call(this, domManager, app);
	        this.inverse = true;
	    }
	    return NotIfBinding;
	})(IfBinding);
	exports.NotIfBinding = NotIfBinding;
	//# sourceMappingURL=If.js.map

/***/ },
/* 23 */
/***/ function(module, exports, __webpack_require__) {

	/// <reference path="../../node_modules/rx/ts/rx.all.d.ts" />
	/// <reference path="../Interfaces.ts" />
	var __extends = (this && this.__extends) || function (d, b) {
	    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
	    function __() { this.constructor = d; }
	    __.prototype = b.prototype;
	    d.prototype = new __();
	};
	var Utils_1 = __webpack_require__(5);
	"use strict";
	var MultiOneWayChangeBindingBase = (function () {
	    function MultiOneWayChangeBindingBase(domManager, app, supportsDynamicValues) {
	        if (supportsDynamicValues === void 0) { supportsDynamicValues = false; }
	        this.priority = 0;
	        this.supportsDynamicValues = false;
	        this.domManager = domManager;
	        this.app = app;
	        this.supportsDynamicValues = supportsDynamicValues;
	    }
	    ////////////////////
	    // wx.IBinding
	    MultiOneWayChangeBindingBase.prototype.applyBinding = function (node, options, ctx, state, module) {
	        if (node.nodeType !== 1)
	            Utils_1.throwError("binding only operates on elements!");
	        var compiled = this.domManager.compileBindingOptions(options, module);
	        if (compiled == null || (typeof compiled !== "object" && !this.supportsDynamicValues))
	            Utils_1.throwError("invalid binding-options!");
	        var el = node;
	        var observables = new Array();
	        var obs;
	        var exp;
	        var keys = Object.keys(compiled);
	        var key;
	        if (typeof compiled === "function") {
	            exp = compiled;
	            obs = this.domManager.expressionToObservable(exp, ctx);
	            observables.push(["", obs]);
	        }
	        else {
	            for (var i = 0; i < keys.length; i++) {
	                key = keys[i];
	                var value = compiled[key];
	                exp = value;
	                obs = this.domManager.expressionToObservable(exp, ctx);
	                observables.push([key, obs]);
	            }
	        }
	        // subscribe
	        for (var i = 0; i < observables.length; i++) {
	            key = observables[i][0];
	            obs = observables[i][1];
	            this.subscribe(el, obs, key, state);
	        }
	        // release closure references to GC 
	        state.cleanup.add(Rx.Disposable.create(function () {
	            // nullify args
	            node = null;
	            options = null;
	            ctx = null;
	            state = null;
	            // nullify common locals
	            el = null;
	            keys = null;
	            // nullify locals
	            observables = null;
	        }));
	    };
	    MultiOneWayChangeBindingBase.prototype.configure = function (options) {
	        // intentionally left blank
	    };
	    MultiOneWayChangeBindingBase.prototype.subscribe = function (el, obs, key, state) {
	        var _this = this;
	        state.cleanup.add(obs.subscribe(function (x) {
	            try {
	                _this.applyValue(el, Utils_1.unwrapProperty(x), key);
	            }
	            catch (e) {
	                _this.app.defaultExceptionHandler.onNext(e);
	            }
	        }));
	    };
	    MultiOneWayChangeBindingBase.prototype.applyValue = function (el, key, value) {
	        Utils_1.throwError("you need to override this method!");
	    };
	    return MultiOneWayChangeBindingBase;
	})();
	exports.MultiOneWayChangeBindingBase = MultiOneWayChangeBindingBase;
	var CssBinding = (function (_super) {
	    __extends(CssBinding, _super);
	    function CssBinding(domManager, app) {
	        _super.call(this, domManager, app, true);
	    }
	    CssBinding.prototype.applyValue = function (el, value, key) {
	        var classes;
	        if (key !== "") {
	            classes = key.split(/\s+/).map(function (x) { return x.trim(); }).filter(function (x) { return x; });
	            if (classes.length) {
	                Utils_1.toggleCssClass.apply(null, [el, !!value].concat(classes));
	            }
	        }
	        else {
	            var state = this.domManager.getNodeState(el);
	            // if we have previously added classes, remove them
	            if (state.cssBindingPreviousDynamicClasses != null) {
	                Utils_1.toggleCssClass.apply(null, [el, false].concat(state.cssBindingPreviousDynamicClasses));
	                state.cssBindingPreviousDynamicClasses = null;
	            }
	            if (value) {
	                classes = value.split(/\s+/).map(function (x) { return x.trim(); }).filter(function (x) { return x; });
	                if (classes.length) {
	                    Utils_1.toggleCssClass.apply(null, [el, true].concat(classes));
	                    state.cssBindingPreviousDynamicClasses = classes;
	                }
	            }
	        }
	    };
	    return CssBinding;
	})(MultiOneWayChangeBindingBase);
	exports.CssBinding = CssBinding;
	var AttrBinding = (function (_super) {
	    __extends(AttrBinding, _super);
	    function AttrBinding(domManager, app) {
	        _super.call(this, domManager, app);
	        this.priority = 5;
	    }
	    AttrBinding.prototype.applyValue = function (el, value, key) {
	        // To cover cases like "attr: { checked:someProp }", we want to remove the attribute entirely
	        // when someProp is a "no value"-like value (strictly null, false, or undefined)
	        // (because the absence of the "checked" attr is how to mark an element as not checked, etc.)
	        var toRemove = (value === false) || (value === null) || (value === undefined);
	        if (toRemove)
	            el.removeAttribute(key);
	        else {
	            el.setAttribute(key, value.toString());
	        }
	    };
	    return AttrBinding;
	})(MultiOneWayChangeBindingBase);
	exports.AttrBinding = AttrBinding;
	var StyleBinding = (function (_super) {
	    __extends(StyleBinding, _super);
	    function StyleBinding(domManager, app) {
	        _super.call(this, domManager, app);
	    }
	    StyleBinding.prototype.applyValue = function (el, value, key) {
	        if (value === null || value === undefined || value === false) {
	            // Empty string removes the value, whereas null/undefined have no effect
	            value = "";
	        }
	        el.style[key] = value;
	    };
	    return StyleBinding;
	})(MultiOneWayChangeBindingBase);
	exports.StyleBinding = StyleBinding;
	//# sourceMappingURL=MultiOneWay.js.map

/***/ },
/* 24 */
/***/ function(module, exports, __webpack_require__) {

	/// <reference path="../../node_modules/rx/ts/rx.all.d.ts" />
	/// <reference path="../Interfaces.ts" />
	var __extends = (this && this.__extends) || function (d, b) {
	    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
	    function __() { this.constructor = d; }
	    __.prototype = b.prototype;
	    d.prototype = new __();
	};
	var Utils_1 = __webpack_require__(5);
	"use strict";
	var SingleOneWayChangeBindingBase = (function () {
	    function SingleOneWayChangeBindingBase(domManager, app) {
	        this.priority = 0;
	        this.domManager = domManager;
	        this.app = app;
	    }
	    ////////////////////
	    // wx.IBinding
	    SingleOneWayChangeBindingBase.prototype.applyBinding = function (node, options, ctx, state, module) {
	        var _this = this;
	        if (node.nodeType !== 1)
	            Utils_1.throwError("binding only operates on elements!");
	        if (options == null)
	            Utils_1.throwError("invalid binding-options!");
	        var el = node;
	        var self = this;
	        var exp = this.domManager.compileBindingOptions(options, module);
	        var obs = this.domManager.expressionToObservable(exp, ctx);
	        // subscribe
	        state.cleanup.add(obs.subscribe(function (x) {
	            try {
	                self.applyValue(el, Utils_1.unwrapProperty(x));
	            }
	            catch (e) {
	                _this.app.defaultExceptionHandler.onNext(e);
	            }
	        }));
	        // release closure references to GC 
	        state.cleanup.add(Rx.Disposable.create(function () {
	            // nullify args
	            node = null;
	            options = null;
	            ctx = null;
	            state = null;
	            // nullify common locals
	            el = null;
	            obs = null;
	            self = null;
	        }));
	    };
	    SingleOneWayChangeBindingBase.prototype.configure = function (options) {
	        // intentionally left blank
	    };
	    SingleOneWayChangeBindingBase.prototype.applyValue = function (el, value) {
	        Utils_1.throwError("you need to override this method!");
	    };
	    return SingleOneWayChangeBindingBase;
	})();
	exports.SingleOneWayChangeBindingBase = SingleOneWayChangeBindingBase;
	////////////////////
	// Bindings
	var TextBinding = (function (_super) {
	    __extends(TextBinding, _super);
	    function TextBinding(domManager, app) {
	        _super.call(this, domManager, app);
	    }
	    TextBinding.prototype.applyValue = function (el, value) {
	        if ((value === null) || (value === undefined))
	            value = "";
	        el.textContent = value;
	    };
	    return TextBinding;
	})(SingleOneWayChangeBindingBase);
	exports.TextBinding = TextBinding;
	var VisibleBinding = (function (_super) {
	    __extends(VisibleBinding, _super);
	    function VisibleBinding(domManager, app) {
	        _super.call(this, domManager, app);
	        this.inverse = false;
	        this.inverse = false;
	        this.priority = 10;
	    }
	    VisibleBinding.prototype.configure = function (_options) {
	        var options = _options;
	        VisibleBinding.useCssClass = options.useCssClass;
	        VisibleBinding.hiddenClass = options.hiddenClass;
	    };
	    ////////////////////
	    // implementation
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
	            Utils_1.toggleCssClass(el, !value, VisibleBinding.hiddenClass);
	        }
	    };
	    return VisibleBinding;
	})(SingleOneWayChangeBindingBase);
	exports.VisibleBinding = VisibleBinding;
	var HiddenBinding = (function (_super) {
	    __extends(HiddenBinding, _super);
	    function HiddenBinding(domManager, app) {
	        _super.call(this, domManager, app);
	        this.inverse = true;
	    }
	    return HiddenBinding;
	})(VisibleBinding);
	exports.HiddenBinding = HiddenBinding;
	var HtmlBinding = (function (_super) {
	    __extends(HtmlBinding, _super);
	    function HtmlBinding(domManager, app) {
	        _super.call(this, domManager, app);
	    }
	    HtmlBinding.prototype.applyValue = function (el, value) {
	        if ((value === null) || (value === undefined))
	            value = "";
	        el.innerHTML = value;
	    };
	    return HtmlBinding;
	})(SingleOneWayChangeBindingBase);
	exports.HtmlBinding = HtmlBinding;
	var DisableBinding = (function (_super) {
	    __extends(DisableBinding, _super);
	    function DisableBinding(domManager, app) {
	        _super.call(this, domManager, app);
	        this.inverse = false;
	        this.inverse = false;
	    }
	    ////////////////////
	    // implementation
	    DisableBinding.prototype.applyValue = function (el, value) {
	        value = this.inverse ? !value : value;
	        if (Utils_1.elementCanBeDisabled(el)) {
	            el.disabled = value;
	        }
	    };
	    return DisableBinding;
	})(SingleOneWayChangeBindingBase);
	exports.DisableBinding = DisableBinding;
	var EnableBinding = (function (_super) {
	    __extends(EnableBinding, _super);
	    function EnableBinding(domManager, app) {
	        _super.call(this, domManager, app);
	        this.inverse = true;
	    }
	    return EnableBinding;
	})(DisableBinding);
	exports.EnableBinding = EnableBinding;
	//# sourceMappingURL=SimpleOneWay.js.map

/***/ },
/* 25 */
/***/ function(module, exports, __webpack_require__) {

	/// <reference path="../../node_modules/rx/ts/rx.all.d.ts" />
	/// <reference path="../RxExtensions.d.ts" />
	var Utils_1 = __webpack_require__(5);
	var VirtualChildNodes_1 = __webpack_require__(26);
	var RefCountDisposeWrapper_1 = __webpack_require__(27);
	var Injector_1 = __webpack_require__(4);
	var List_1 = __webpack_require__(28);
	"use strict";
	var ForEachBinding = (function () {
	    function ForEachBinding(domManager, app) {
	        this.priority = 40;
	        this.controlsDescendants = true;
	        this.domManager = domManager;
	        this.app = app;
	        // hook into getDataContext() to map state['index'] to ctx['$index']
	        domManager.registerDataContextExtension(function (node, ctx) {
	            var state = domManager.getNodeState(node);
	            ctx.$index = state.index;
	        });
	    }
	    ////////////////////
	    // wx.IBinding
	    ForEachBinding.prototype.applyBinding = function (node, options, ctx, state, module) {
	        var _this = this;
	        if (node.nodeType !== 1)
	            Utils_1.throwError("forEach binding only operates on elements!");
	        if (options == null)
	            Utils_1.throwError("** invalid binding options!");
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
	            // extract animations
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
	                // extract hooks
	                hooks = this.domManager.evaluateExpression(opt.hooks, ctx);
	            }
	            // optionally resolve hooks if passed as string identifier
	            if (typeof hooks === "string")
	                hooks = Injector_1.injector.get(hooks);
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
	        // add own disposables
	        state.cleanup.add(Rx.Disposable.create(function () {
	            if (cleanup) {
	                cleanup.dispose();
	                cleanup = null;
	            }
	        }));
	        // backup inner HTML
	        var template = new Array();
	        // subscribe
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
	                _this.app.defaultExceptionHandler.onNext(e);
	            }
	        }));
	        // release closure references to GC 
	        state.cleanup.add(Rx.Disposable.create(function () {
	            // nullify args
	            node = null;
	            options = null;
	            ctx = null;
	            state = null;
	            // nullify common locals
	            obs = null;
	            el = null;
	            self = null;
	            // nullify locals
	            template = null;
	            hooks = null;
	        }));
	    };
	    ForEachBinding.prototype.configure = function (options) {
	        // intentionally left blank
	    };
	    ForEachBinding.prototype.createIndexPropertyForNode = function (proxy, child, startIndex, trigger, templateLength) {
	        return Rx.Observable.defer(function () {
	            return Rx.Observable.create(function (obs) {
	                return trigger.subscribe(function (_) {
	                    // recalculate index from node position within parent
	                    var index = proxy.childNodes.indexOf(child);
	                    index /= templateLength;
	                    obs.onNext(index);
	                });
	            });
	        })
	            .toProperty(startIndex);
	    };
	    ForEachBinding.prototype.appendAllRows = function (proxy, list, ctx, template, hooks, animations, indexTrigger, isInitial) {
	        var length = list.length();
	        for (var i = 0; i < length; i++) {
	            this.appendRow(proxy, i, list.get(i), ctx, template, hooks, animations, indexTrigger, isInitial);
	        }
	    };
	    ForEachBinding.prototype.appendRow = function (proxy, index, item, ctx, template, hooks, animations, indexTrigger, isInitial) {
	        var nodes = Utils_1.cloneNodeArray(template);
	        var _index = index;
	        var enterAnimation = animations.itemEnter;
	        var cbData = {
	            item: item
	        };
	        if (indexTrigger) {
	            _index = this.createIndexPropertyForNode(proxy, nodes[0], index, indexTrigger, template.length);
	            cbData.indexDisp = new RefCountDisposeWrapper_1.default(_index, 0);
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
	            var disp = enterAnimation.run(nodes)
	                .continueWith(function () { return enterAnimation.complete(nodes); })
	                .subscribe(function (x) {
	                if (disp != null)
	                    disp.dispose();
	            });
	        }
	    };
	    ForEachBinding.prototype.insertRow = function (proxy, index, item, ctx, template, hooks, animations, indexTrigger) {
	        var templateLength = template.length;
	        var enterAnimation = animations.itemEnter;
	        var nodes = Utils_1.cloneNodeArray(template);
	        var _index = this.createIndexPropertyForNode(proxy, nodes[0], index, indexTrigger, template.length);
	        if (enterAnimation != null)
	            enterAnimation.prepare(nodes);
	        proxy.insertChilds(index * templateLength, nodes, {
	            index: _index,
	            item: item,
	            indexDisp: new RefCountDisposeWrapper_1.default(_index, 0)
	        });
	        if (hooks) {
	            if (hooks.afterRender)
	                hooks.afterRender(nodes, item);
	            if (hooks.afterAdd)
	                hooks.afterAdd(nodes, item, index);
	        }
	        if (enterAnimation) {
	            var disp = enterAnimation.run(nodes)
	                .continueWith(function () { return enterAnimation.complete(nodes); })
	                .subscribe(function (x) {
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
	                var disp = leaveAnimation.run(nodes)
	                    .continueWith(function () { return leaveAnimation.complete(nodes); })
	                    .continueWith(removeNodes)
	                    .subscribe(function (x) {
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
	            // create new row
	            nodes = Utils_1.cloneNodeArray(template);
	            var _index = self.createIndexPropertyForNode(proxy, nodes[0], from, indexTrigger, template.length);
	            if (enterAnimation != null)
	                enterAnimation.prepare(nodes);
	            proxy.insertChilds(templateLength * to, nodes, {
	                index: _index,
	                item: item,
	                indexDisp: new RefCountDisposeWrapper_1.default(_index, 0)
	            });
	            if (hooks && hooks.afterMove) {
	                hooks.afterMove(nodes, item, from);
	            }
	        }
	        // construct leave-observable
	        if (leaveAnimation) {
	            leaveAnimation.prepare(nodes);
	            obs = leaveAnimation.run(nodes)
	                .continueWith(function () { return leaveAnimation.complete(nodes); })
	                .continueWith(removeNodes);
	        }
	        else {
	            obs = Rx.Observable.startDeferred(removeNodes);
	        }
	        combined.push(obs);
	        // construct enter-observable
	        obs = Rx.Observable.startDeferred(createRow);
	        if (enterAnimation) {
	            obs = obs.continueWith(enterAnimation.run(nodes))
	                .continueWith(function () { return enterAnimation.complete(nodes); });
	        }
	        combined.push(obs);
	        // optimize return
	        if (combined.length > 1)
	            obs = Rx.Observable.combineLatest(combined, Utils_1.noop).take(1);
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
	        var indexDisp = new RefCountDisposeWrapper_1.default(_index, 0);
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
	        // initial insert
	        this.appendAllRows(proxy, list, ctx, template, hooks, animations, indexTrigger, true);
	        // track changes
	        cleanup.add(list.itemsAdded.subscribe(function (e) {
	            length = e.items.length;
	            if (e.from === list.length()) {
	                for (var i_1 = 0; i_1 < length; i_1++) {
	                    _this.appendRow(proxy, i_1 + e.from, e.items[i_1], ctx, template, hooks, animations, indexTrigger, false);
	                }
	            }
	            else {
	                for (var i_2 = 0; i_2 < e.items.length; i_2++) {
	                    _this.insertRow(proxy, i_2 + e.from, e.items[i_2], ctx, template, hooks, animations, indexTrigger);
	                }
	            }
	            indexTrigger.onNext(true);
	        }));
	        cleanup.add(list.itemsRemoved.subscribe(function (e) {
	            length = e.items.length;
	            for (var i_3 = 0; i_3 < length; i_3++) {
	                _this.removeRow(proxy, i_3 + e.from, e.items[i_3], template, hooks, animations);
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
	            // clone to template
	            length = el.childNodes.length;
	            for (var i_4 = 0; i_4 < length; i_4++) {
	                template.push(el.childNodes[i_4].cloneNode(true));
	            }
	        }
	        // perform initial clear
	        while (el.firstChild) {
	            el.removeChild(el.firstChild);
	        }
	        if (template.length === 0)
	            return; // nothing to do
	        var proxy;
	        var self = this;
	        var recalcIndextrigger;
	        function nodeInsertCB(node, callbackData) {
	            var item = callbackData.item;
	            var index = callbackData.index;
	            var indexDisp = callbackData.indexDisp;
	            if (node.nodeType === 1) {
	                // propagate index to state
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
	        proxy = new VirtualChildNodes_1.default(el, false, nodeInsertCB, nodeRemoveCB);
	        if (setProxyFunc)
	            setProxyFunc(proxy);
	        cleanup.add(Rx.Disposable.create(function () {
	            proxy = null;
	        }));
	        if (Array.isArray(value)) {
	            var arr = value;
	            // iterate once and be done with it
	            length = arr.length;
	            for (var i_5 = 0; i_5 < length; i_5++) {
	                this.appendRow(proxy, i_5, arr[i_5], ctx, template, hooks, animations, undefined, true);
	            }
	        }
	        else if (List_1.isList(value)) {
	            var list = value;
	            recalcIndextrigger = new Rx.Subject();
	            this.observeList(proxy, ctx, template, cleanup, list, hooks, animations, recalcIndextrigger);
	        }
	    };
	    return ForEachBinding;
	})();
	exports.default = ForEachBinding;
	//# sourceMappingURL=ForEach.js.map

/***/ },
/* 26 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	/**
	* VirtualChildNodes implements consisent and predictable manipulation
	* of a DOM Node's childNodes collection regardless its the true contents
	* @class
	**/
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
	        // append to proxy array
	        if (nodes.length > 1)
	            Array.prototype.push.apply(this.childNodes, nodes);
	        else
	            this.childNodes.push(nodes[0]);
	        // append to DOM
	        for (var i = 0; i < length; i++) {
	            this.targetNode.appendChild(nodes[i]);
	        }
	        // callback
	        if (this.insertCB) {
	            for (var i = 0; i < length; i++) {
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
	            var length_1 = nodes.length;
	            // insert into proxy array
	            Array.prototype.splice.apply(this.childNodes, [index, 0].concat(nodes));
	            // insert into DOM
	            for (var i = 0; i < length_1; i++) {
	                this.targetNode.insertBefore(nodes[i], refNode);
	            }
	            // callback
	            if (this.insertCB) {
	                for (var i = 0; i < length_1; i++) {
	                    this.insertCB(nodes[i], callbackData);
	                }
	            }
	        }
	    };
	    VirtualChildNodes.prototype.removeChilds = function (index, count, keepDom) {
	        var node;
	        if (count === 0)
	            return [];
	        // extract removed nodes
	        var nodes = this.childNodes.slice(index, index + count);
	        // remove from proxy array
	        this.childNodes.splice(index, count);
	        if (!keepDom) {
	            // remove from DOM
	            var length_2 = nodes.length;
	            for (var i = 0; i < length_2; i++) {
	                node = nodes[i];
	                if (this.removeCB)
	                    this.removeCB(node);
	                this.targetNode.removeChild(node);
	            }
	        }
	        return nodes;
	    };
	    VirtualChildNodes.prototype.clear = function () {
	        // remove from DOM
	        var length = this.childNodes.length;
	        var node;
	        for (var i = 0; i < length; i++) {
	            node = this.childNodes[i];
	            if (this.removeCB)
	                this.removeCB(node);
	            this.targetNode.removeChild(node);
	        }
	        // reset proxy array
	        this.childNodes = [];
	    };
	    return VirtualChildNodes;
	})();
	exports.default = VirtualChildNodes;
	//# sourceMappingURL=VirtualChildNodes.js.map

/***/ },
/* 27 */
/***/ function(module, exports, __webpack_require__) {

	/// <reference path="../Interfaces.ts" />
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
	exports.default = RefCountDisposeWrapper;
	//# sourceMappingURL=RefCountDisposeWrapper.js.map

/***/ },
/* 28 */
/***/ function(module, exports, __webpack_require__) {

	/// <reference path="../Interfaces.ts" />
	var __extends = (this && this.__extends) || function (d, b) {
	    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
	    function __() { this.constructor = d; }
	    __.prototype = b.prototype;
	    d.prototype = new __();
	};
	var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
	    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") return Reflect.decorate(decorators, target, key, desc);
	    switch (arguments.length) {
	        case 2: return decorators.reduceRight(function(o, d) { return (d && d(o)) || o; }, target);
	        case 3: return decorators.reduceRight(function(o, d) { return (d && d(target, key)), void 0; }, void 0);
	        case 4: return decorators.reduceRight(function(o, d) { return (d && d(target, key, o)) || o; }, desc);
	    }
	};
	var __metadata = (this && this.__metadata) || function (k, v) {
	    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
	};
	var Utils_1 = __webpack_require__(5);
	var Oid_1 = __webpack_require__(2);
	var IID_1 = __webpack_require__(10);
	var Lazy_1 = __webpack_require__(29);
	var ScheduledSubject_1 = __webpack_require__(30);
	var Events_1 = __webpack_require__(9);
	var RefCountDisposeWrapper_1 = __webpack_require__(27);
	var log = __webpack_require__(12);
	var Reflect_1 = __webpack_require__(6);
	var Injector_1 = __webpack_require__(4);
	var res = __webpack_require__(11);
	"use strict";
	/**
	* ReactiveUI's awesome ReactiveList ported to Typescript
	* @class
	*/
	var ObservableList = (function () {
	    function ObservableList(initialContents, resetChangeThreshold, scheduler) {
	        if (resetChangeThreshold === void 0) { resetChangeThreshold = 0.3; }
	        if (scheduler === void 0) { scheduler = null; }
	        //////////////////////////
	        // Some array convenience members
	        this.push = this.add;
	        this.changeNotificationsSuppressed = 0;
	        this.propertyChangeWatchers = null;
	        this.resetChangeThreshold = 0;
	        this.resetSubCount = 0;
	        this.hasWhinedAboutNoResetSub = false;
	        this.app = Injector_1.injector.get(res.app);
	        this.setupRx(initialContents, resetChangeThreshold, scheduler);
	    }
	    //////////////////////////////////
	    // wx.IDisposable implementation
	    ObservableList.prototype.dispose = function () {
	        this.clearAllPropertyChangeWatchers();
	    };
	    Object.defineProperty(ObservableList.prototype, "isReadOnly", {
	        ////////////////////
	        /// wx.IObservableList<T>
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
	                this._lengthChanging = this.listChanging.select(function (_) {
	                    return _this.inner.length;
	                }).distinctUntilChanged();
	            return this._lengthChanging;
	        },
	        enumerable: true,
	        configurable: true
	    });
	    Object.defineProperty(ObservableList.prototype, "lengthChanged", {
	        get: function () {
	            var _this = this;
	            if (!this._lengthChanged)
	                this._lengthChanged = this.listChanged.select(function (_) {
	                    return _this.inner.length;
	                }).distinctUntilChanged();
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
	            return this.refcountSubscribers(this.listChanged.selectMany(function (x) { return !x ? Rx.Observable.empty() :
	                Rx.Observable.return(null); }), function (x) { return _this.resetSubCount += x; });
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
	            Utils_1.throwError("items");
	        }
	        var disp = this.isLengthAboveResetThreshold(items.length) ? this.suppressChangeNotifications() : Rx.Disposable.empty;
	        Utils_1.using(disp, function () {
	            // reset notification
	            if (!_this.areChangeNotificationsEnabled()) {
	                // this._inner.splice(this._inner.length, 0, items)
	                Array.prototype.push.apply(_this.inner, items);
	                if (_this.changeTrackingEnabled) {
	                    items.forEach(function (x) {
	                        _this.addItemToPropertyTracking(x);
	                    });
	                }
	            }
	            else {
	                var from = _this.inner.length; // need to capture this before "inner" gets modified 
	                if (_this.beforeItemsAddedSubject.isValueCreated) {
	                    _this.beforeItemsAddedSubject.value.onNext({ items: items, from: from });
	                }
	                Array.prototype.push.apply(_this.inner, items);
	                if (_this.itemsAddedSubject.isValueCreated) {
	                    _this.itemsAddedSubject.value.onNext({ items: items, from: from });
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
	            Utils_1.throwError("collection");
	        }
	        if (index > this.inner.length) {
	            Utils_1.throwError("index");
	        }
	        var disp = this.isLengthAboveResetThreshold(items.length) ? this.suppressChangeNotifications() : Rx.Disposable.empty;
	        Utils_1.using(disp, function () {
	            // reset notification
	            if (!_this.areChangeNotificationsEnabled()) {
	                // this._inner.splice(index, 0, items)
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
	            Utils_1.throwError("items");
	        }
	        var disp = this.isLengthAboveResetThreshold(items.length) ?
	            this.suppressChangeNotifications() : Rx.Disposable.empty;
	        Utils_1.using(disp, function () {
	            // NB: wx.If we don't do this, we'll break Collection<T>'s
	            // accounting of the length
	            items.forEach(function (x) { return _this.remove(x); });
	        });
	    };
	    ObservableList.prototype.removeRange = function (index, count) {
	        var _this = this;
	        var disp = this.isLengthAboveResetThreshold(count) ? this.suppressChangeNotifications() : Rx.Disposable.empty;
	        Utils_1.using(disp, function () {
	            // construct items
	            var items = _this.inner.slice(index, index + count);
	            // reset notification
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
	        var args = Utils_1.args2Array(arguments);
	        var filter = args.shift();
	        if (filter != null && Utils_1.isRxObservable(filter)) {
	            return new ObservableListProjection(this, undefined, undefined, undefined, filter, args.shift());
	        }
	        var orderer = args.shift();
	        if (orderer != null && Utils_1.isRxObservable(orderer)) {
	            return new ObservableListProjection(this, filter, undefined, undefined, orderer, args.shift());
	        }
	        var selector = args.shift();
	        if (selector != null && Utils_1.isRxObservable(selector)) {
	            return new ObservableListProjection(this, filter, orderer, undefined, selector, args.shift());
	        }
	        return new ObservableListProjection(this, filter, orderer, selector, args.shift(), args.shift());
	    };
	    ObservableList.prototype.suppressChangeNotifications = function () {
	        var _this = this;
	        this.changeNotificationsSuppressed++;
	        if (!this.hasWhinedAboutNoResetSub && this.resetSubCount === 0 && !Utils_1.isInUnitTest()) {
	            log.info("suppressChangeNotifications was called (perhaps via addRange), yet you do not have a subscription to shouldReset. This probably isn't what you want, as itemsAdded and friends will appear to 'miss' items");
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
	        scheduler = scheduler || Injector_1.injector.get(res.app).mainThreadScheduler;
	        this.resetChangeThreshold = resetChangeThreshold;
	        if (this.inner === undefined)
	            this.inner = new Array();
	        this.beforeItemsAddedSubject = new Lazy_1.default(function () { return new Rx.Subject(); });
	        this.itemsAddedSubject = new Lazy_1.default(function () { return new Rx.Subject(); });
	        this.beforeItemsRemovedSubject = new Lazy_1.default(function () { return new Rx.Subject(); });
	        this.itemsRemovedSubject = new Lazy_1.default(function () { return new Rx.Subject(); });
	        this.beforeItemReplacedSubject = new Lazy_1.default(function () { return new Rx.Subject(); });
	        this.itemReplacedSubject = new Lazy_1.default(function () { return new Rx.Subject(); });
	        this.resetSubject = new Rx.Subject();
	        this.beforeResetSubject = new Rx.Subject();
	        this.itemChangingSubject = new Lazy_1.default(function () {
	            return ScheduledSubject_1.createScheduledSubject(scheduler);
	        });
	        this.itemChangedSubject = new Lazy_1.default(function () {
	            return ScheduledSubject_1.createScheduledSubject(scheduler);
	        });
	        this.beforeItemsMovedSubject = new Lazy_1.default(function () { return new Rx.Subject(); });
	        this.itemsMovedSubject = new Lazy_1.default(function () { return new Rx.Subject(); });
	        this.listChanged = Rx.Observable.merge(this.itemsAdded.select(function (x) { return false; }), this.itemsRemoved.select(function (x) { return false; }), this.itemReplaced.select(function (x) { return false; }), this.itemsMoved.select(function (x) { return false; }), this.resetSubject.select(function (x) { return true; }))
	            .publish()
	            .refCount();
	        this.listChanging = Rx.Observable.merge(this.beforeItemsAdded.select(function (x) { return false; }), this.beforeItemsRemoved.select(function (x) { return false; }), this.beforeItemReplaced.select(function (x) { return false; }), this.beforeItemsMoved.select(function (x) { return false; }), this.beforeResetSubject.select(function (x) { return true; }))
	            .publish()
	            .refCount();
	        if (initialContents) {
	            Array.prototype.splice.apply(this.inner, [0, 0].concat(initialContents));
	        }
	        this.length = this.lengthChanged.toProperty(this.inner.length);
	        this.isEmpty = this.lengthChanged
	            .select(function (x) { return (x === 0); })
	            .toProperty(this.inner.length === 0);
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
	            this.inner.length = 0; // see http://stackoverflow.com/a/1232046/88513
	            if (this.changeTrackingEnabled)
	                this.clearAllPropertyChangeWatchers();
	            return;
	        }
	        this.publishBeforeResetNotification();
	        this.inner.length = 0; // see http://stackoverflow.com/a/1232046/88513
	        this.publishResetNotification();
	        if (this.changeTrackingEnabled)
	            this.clearAllPropertyChangeWatchers();
	    };
	    ObservableList.prototype.addItemToPropertyTracking = function (toTrack) {
	        var rcd = this.propertyChangeWatchers[Oid_1.getOid(toTrack)];
	        var self = this;
	        if (rcd) {
	            rcd.addRef();
	            return;
	        }
	        var changing = Utils_1.observeObject(toTrack, this.app.defaultExceptionHandler, true)
	            .select(function (i) { return new Events_1.PropertyChangedEventArgs(toTrack, i.propertyName); });
	        var changed = Utils_1.observeObject(toTrack, this.app.defaultExceptionHandler, false)
	            .select(function (i) { return new Events_1.PropertyChangedEventArgs(toTrack, i.propertyName); });
	        var disp = new Rx.CompositeDisposable(changing.where(function (_) { return self.areChangeNotificationsEnabled(); }).subscribe(function (x) { return self.itemChangingSubject.value.onNext(x); }), changed.where(function (_) { return self.areChangeNotificationsEnabled(); }).subscribe(function (x) { return self.itemChangedSubject.value.onNext(x); }));
	        this.propertyChangeWatchers[Oid_1.getOid(toTrack)] = new RefCountDisposeWrapper_1.default(Rx.Disposable.create(function () {
	            disp.dispose();
	            delete self.propertyChangeWatchers[Oid_1.getOid(toTrack)];
	        }));
	    };
	    ObservableList.prototype.removeItemFromPropertyTracking = function (toUntrack) {
	        var rcd = this.propertyChangeWatchers[Oid_1.getOid(toUntrack)];
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
	    ObservableList = __decorate([
	        Reflect_1.Implements(IID_1.default.IObservableList),
	        Reflect_1.Implements(IID_1.default.IDisposable), 
	        __metadata('design:paramtypes', [Array, Number, Object])
	    ], ObservableList);
	    return ObservableList;
	})();
	exports.ObservableList = ObservableList;
	var ObservableListProjection = (function (_super) {
	    __extends(ObservableListProjection, _super);
	    function ObservableListProjection(source, filter, orderer, selector, refreshTrigger, scheduler) {
	        _super.call(this);
	        ////////////////////
	        // wx.Implementation
	        this.readonlyExceptionMessage = "Derived collections cannot be modified.";
	        // This list maps indices in this collection to their corresponding indices in the source collection.
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
	        //////////////////////////////////
	        // ObservableList overrides to enforce readonly contract
	        get: function () {
	            return true;
	        },
	        enumerable: true,
	        configurable: true
	    });
	    ObservableListProjection.prototype.set = function (index, item) {
	        Utils_1.throwError(this.readonlyExceptionMessage);
	    };
	    ObservableListProjection.prototype.addRange = function (items) {
	        Utils_1.throwError(this.readonlyExceptionMessage);
	    };
	    ObservableListProjection.prototype.insertRange = function (index, items) {
	        Utils_1.throwError(this.readonlyExceptionMessage);
	    };
	    ObservableListProjection.prototype.removeAll = function (items) {
	        Utils_1.throwError(this.readonlyExceptionMessage);
	    };
	    ObservableListProjection.prototype.removeRange = function (index, count) {
	        Utils_1.throwError(this.readonlyExceptionMessage);
	    };
	    ObservableListProjection.prototype.add = function (item) {
	        Utils_1.throwError(this.readonlyExceptionMessage);
	    };
	    ObservableListProjection.prototype.clear = function () {
	        Utils_1.throwError(this.readonlyExceptionMessage);
	    };
	    ObservableListProjection.prototype.remove = function (item) {
	        Utils_1.throwError(this.readonlyExceptionMessage);
	        return undefined;
	    };
	    ObservableListProjection.prototype.insert = function (index, item) {
	        Utils_1.throwError(this.readonlyExceptionMessage);
	    };
	    ObservableListProjection.prototype.removeAt = function (index) {
	        Utils_1.throwError(this.readonlyExceptionMessage);
	    };
	    ObservableListProjection.prototype.move = function (oldIndex, newIndex) {
	        Utils_1.throwError(this.readonlyExceptionMessage);
	    };
	    ObservableListProjection.prototype.sort = function (comparison) {
	        Utils_1.throwError(this.readonlyExceptionMessage);
	    };
	    ObservableListProjection.prototype.reset = function () {
	        var _this = this;
	        Utils_1.using(_super.prototype.suppressChangeNotifications.call(this), function () {
	            _super.prototype.clear.call(_this);
	            _this.addAllItemsFromSourceCollection();
	        });
	    };
	    //////////////////////////////////
	    // wx.IDisposable implementation
	    ObservableListProjection.prototype.dispose = function () {
	        this.disp.dispose();
	        _super.prototype.dispose.call(this);
	    };
	    ObservableListProjection.prototype.referenceEquals = function (a, b) {
	        return Oid_1.getOid(a) === Oid_1.getOid(b);
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
	            this.nsertAndMap(e.from + i, destinationItem);
	        }
	    };
	    ObservableListProjection.prototype.onItemsRemoved = function (e) {
	        this.sourceCopy.splice(e.from, e.items.length);
	        for (var i = 0; i < e.items.length; i++) {
	            var destinationIndex = this.getIndexFromSourceIndex(e.from + i);
	            if (destinationIndex !== -1) {
	                this.emoveAt(destinationIndex);
	            }
	        }
	        var removedCount = e.items.length;
	        this.shiftIndicesAtOrOverThreshold(e.from + removedCount, -removedCount);
	    };
	    ObservableListProjection.prototype.onItemsMoved = function (e) {
	        if (e.items.length > 1) {
	            Utils_1.throwError("Derived collections doesn't support multi-item moves");
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
	            // We mirror the order of the source collection so we'll perform the same move operation
	            // as the source. As is the case with when we have an orderer we don't test whether or not
	            // the item should be included or not here. wx.If it has been included at some point it'll
	            // stay included until onItemChanged picks up a change which filters it.
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
	            // TODO: Conceptually wx.I feel like we shouldn't concern ourselves with ordering when we 
	            // receive a Move notification. wx.If it affects ordering it should be picked up by the
	            // onItemChange and resorted there instead.
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
	                _this.emoveAt(currentDestinationIndex);
	            }
	            else if (!isIncluded && shouldBeIncluded) {
	                _this.nsertAndMap(sourceIndex, _this.selector(changedItem));
	            }
	            else if (isIncluded && shouldBeIncluded) {
	                // The item is already included and it should stay there but it's possible that the change that
	                // caused this event affects the ordering. This gets a little tricky so let's be verbose.
	                var newItem = _this.selector(changedItem);
	                if (_this.orderer == null) {
	                    // We don't have an orderer so we're currently using the source collection index for sorting 
	                    // meaning that no item change will affect ordering. Look at our current item and see if it's
	                    // the exact (reference-wise) same object. wx.If it is then we're done, if it's not (for example 
	                    // if it's an integer) we'll issue a replace event so that subscribers get the new value.
	                    if (!_this.referenceEquals(newItem, _this.get(currentDestinationIndex))) {
	                        _super.prototype.set.call(_this, currentDestinationIndex, newItem);
	                    }
	                }
	                else {
	                    // Don't be tempted to just use the orderer to compare the new item with the previous since
	                    // they'll almost certainly be equal (for reference types). We need to test whether or not the
	                    // new item can stay in the same position that the current item is in without comparing them.
	                    if (_this.canItemStayAtPosition(newItem, currentDestinationIndex)) {
	                        // The new item should be in the same position as the current but there's no need to signal
	                        // that in case they are the same object.
	                        if (!_this.referenceEquals(newItem, _this.get(currentDestinationIndex))) {
	                            _super.prototype.set.call(_this, currentDestinationIndex, newItem);
	                        }
	                    }
	                    else {
	                        // The change is forcing us to reorder. We'll use a move operation if the item hasn't 
	                        // changed (ie it's the same object) and we'll implement it as a remove and add if the
	                        // object has changed (ie the selector is not an identity function).
	                        if (_this.referenceEquals(newItem, _this.get(currentDestinationIndex))) {
	                            var newDestinationIndex = _this.newPositionForExistingItem(sourceIndex, currentDestinationIndex, newItem);
	                            // Debug.Assert(newDestinationIndex != currentDestinationIndex, "This can't be, canItemStayAtPosition said it this couldn't happen");
	                            _this.indexToSourceIndexMap.splice(currentDestinationIndex, 1);
	                            _this.indexToSourceIndexMap.splice(newDestinationIndex, 0, sourceIndex);
	                            _super.prototype.move.call(_this, currentDestinationIndex, newDestinationIndex);
	                        }
	                        else {
	                            _this.emoveAt(currentDestinationIndex);
	                            _this.nsertAndMap(sourceIndex, newItem);
	                        }
	                    }
	                }
	            }
	        });
	    };
	    /// <summary>
	    /// Gets a value indicating whether or not the item fits (sort-wise) at the provided index. The determination
	    /// is made by checking whether or not it's considered larger than or equal to the preceeding item and if
	    /// it's less than or equal to the succeeding item.
	    /// </summary>
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
	    /// <summary>
	    /// Gets the index of the dervived item super. on it's originating element index in the source collection.
	    /// </summary>
	    ObservableListProjection.prototype.getIndexFromSourceIndex = function (sourceIndex) {
	        return this.indexToSourceIndexMap.indexOf(sourceIndex);
	    };
	    /// <summary>
	    /// Returns one or more positions in the source collection where the given item is found super. on the
	    /// provided equality comparer.
	    /// </summary>
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
	    /// <summary>
	    /// wx.Increases (or decreases depending on move direction) all source indices between the source and destination
	    /// move indices.
	    /// </summary>
	    ObservableListProjection.prototype.moveSourceIndexInMap = function (oldSourceIndex, newSourceIndex) {
	        if (newSourceIndex > oldSourceIndex) {
	            // wx.Item is moving towards the end of the list, everything between its current position and its 
	            // new position needs to be shifted down one index
	            this.shiftSourceIndicesInRange(oldSourceIndex + 1, newSourceIndex + 1, -1);
	        }
	        else {
	            // wx.Item is moving towards the front of the list, everything between its current position and its
	            // new position needs to be shifted up one index
	            this.shiftSourceIndicesInRange(newSourceIndex, oldSourceIndex, 1);
	        }
	    };
	    /// <summary>
	    /// wx.Increases (or decreases) all source indices equal to or higher than the threshold. Represents an
	    /// insert or remove of one or more items in the source list thus causing all subsequent items to shift
	    /// up or down.
	    /// </summary>
	    ObservableListProjection.prototype.shiftIndicesAtOrOverThreshold = function (threshold, value) {
	        for (var i = 0; i < this.indexToSourceIndexMap.length; i++) {
	            if (this.indexToSourceIndexMap[i] >= threshold) {
	                this.indexToSourceIndexMap[i] += value;
	            }
	        }
	    };
	    /// <summary>
	    /// wx.Increases (or decreases) all source indices within the range (lower inclusive, upper exclusive). 
	    /// </summary>
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
	        // Debug.Assert(sourceCopy.length == 0, "Expected source copy to be empty");
	        var sourceIndex = 0;
	        this.source.forEach(function (sourceItem) {
	            _this.sourceCopy.push(sourceItem);
	            if (!_this._filter || _this._filter(sourceItem)) {
	                var destinationItem = _this.selector(sourceItem);
	                _this.nsertAndMap(sourceIndex, destinationItem);
	            }
	            sourceIndex++;
	        });
	    };
	    ObservableListProjection.prototype.lear = function () {
	        this.indexToSourceIndexMap = [];
	        this.sourceCopy = [];
	        _super.prototype.clear.call(this);
	    };
	    ObservableListProjection.prototype.nsertAndMap = function (sourceIndex, value) {
	        var destinationIndex = this.positionForNewItem(sourceIndex, value);
	        this.indexToSourceIndexMap.splice(destinationIndex, 0, sourceIndex);
	        _super.prototype.insert.call(this, destinationIndex, value);
	    };
	    ObservableListProjection.prototype.emoveAt = function (destinationIndex) {
	        this.indexToSourceIndexMap.splice(destinationIndex, 1);
	        _super.prototype.removeAt.call(this, destinationIndex);
	    };
	    ObservableListProjection.prototype.positionForNewItem = function (sourceIndex, value) {
	        // wx.If we haven't got an orderer we'll simply match our items to that of the source collection.
	        return this.orderer == null
	            ? ObservableListProjection.positionForNewItemArray(this.indexToSourceIndexMap, sourceIndex, ObservableListProjection.defaultOrderer)
	            : ObservableListProjection.positionForNewItemArray2(this.inner, 0, this.inner.length, value, this.orderer);
	    };
	    ObservableListProjection.positionForNewItemArray = function (array, item, orderer) {
	        return ObservableListProjection.positionForNewItemArray2(array, 0, array.length, item, orderer);
	    };
	    ObservableListProjection.positionForNewItemArray2 = function (array, index, count, item, orderer) {
	        // Debug.Assert(index >= 0);
	        // Debug.Assert(count >= 0);
	        // Debug.Assert((list.length - index) >= count);
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
	    /// <summary>
	    /// Calculates a new destination for an updated item that's already in the list.
	    /// </summary>
	    ObservableListProjection.prototype.newPositionForExistingItem = function (sourceIndex, currentIndex, item) {
	        // wx.If we haven't got an orderer we'll simply match our items to that of the source collection.
	        return this.orderer == null
	            ? ObservableListProjection.newPositionForExistingItem2(this.indexToSourceIndexMap, sourceIndex, currentIndex)
	            : ObservableListProjection.newPositionForExistingItem2(this.inner, item, currentIndex, this.orderer);
	    };
	    /// <summary>
	    /// Calculates a new destination for an updated item that's already in the list.
	    /// </summary>
	    ObservableListProjection.newPositionForExistingItem2 = function (array, item, currentIndex, orderer) {
	        // Since the item changed is most likely a value type we must refrain from ever comparing it to itself.
	        // We do this by figuring out how the updated item compares to its neighbors. By knowing if it's
	        // less than or greater than either one of its neighbors we can limit the search range to a range exlusive
	        // of the current index.
	        // Debug.Assert(list.length > 0);
	        if (array.length === 1) {
	            return 0;
	        }
	        var precedingIndex = currentIndex - 1;
	        var succeedingIndex = currentIndex + 1;
	        // The item on the preceding or succeeding index relative to currentIndex.
	        var comparand = array[precedingIndex >= 0 ? precedingIndex : succeedingIndex];
	        if (orderer == null) {
	            orderer = ObservableListProjection.defaultOrderer;
	        }
	        // Compare that to the (potentially) new value.
	        var cmp = orderer(item, comparand);
	        var min = 0;
	        var max = array.length;
	        if (cmp === 0) {
	            // The new value is equal to the preceding or succeeding item, it may stay at the current position
	            return currentIndex;
	        }
	        else if (cmp > 0) {
	            // The new value is greater than the preceding or succeeding item, limit the search to indices after
	            // the succeeding item.
	            min = succeedingIndex;
	        }
	        else {
	            // The new value is less than the preceding or succeeding item, limit the search to indices before
	            // the preceding item.
	            max = precedingIndex;
	        }
	        // Bail if the search range is invalid.
	        if (min === array.length || max < 0) {
	            return currentIndex;
	        }
	        var ix = ObservableListProjection.positionForNewItemArray2(array, min, max - min, item, orderer);
	        // wx.If the item moves 'forward' in the collection we have to account for the index where
	        // the item currently resides getting removed first.
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
	/**
	* Creates a new observable list with optional default contents
	* @param {Array<T>} initialContents The initial contents of the list
	* @param {number = 0.3} resetChangeThreshold
	*/
	function list(initialContents, resetChangeThreshold, scheduler) {
	    if (resetChangeThreshold === void 0) { resetChangeThreshold = 0.3; }
	    if (scheduler === void 0) { scheduler = null; }
	    return new ObservableList(initialContents, resetChangeThreshold, scheduler);
	}
	exports.list = list;
	/**
	* Determines if target is an instance of a IObservableList
	* @param {any} target
	*/
	function isList(target) {
	    if (target == null)
	        return false;
	    return target instanceof ObservableList;
	}
	exports.isList = isList;
	//# sourceMappingURL=List.js.map

/***/ },
/* 29 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	/**
	* .Net's Lazy<T>
	* @class
	*/
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
	exports.default = Lazy;
	//# sourceMappingURL=Lazy.js.map

/***/ },
/* 30 */
/***/ function(module, exports, __webpack_require__) {

	var Utils_1 = __webpack_require__(5);
	"use strict";
	var ScheduledSubject = (function () {
	    function ScheduledSubject(scheduler, defaultObserver, defaultSubject) {
	        this._observerRefCount = 0;
	        this._defaultObserverSub = Rx.Disposable.empty;
	        this._scheduler = scheduler;
	        this._defaultObserver = defaultObserver;
	        this._subject = defaultSubject || new Rx.Subject();
	        if (defaultObserver != null) {
	            this._defaultObserverSub = this._subject
	                .observeOn(this._scheduler)
	                .subscribe(this._defaultObserver);
	        }
	    }
	    ScheduledSubject.prototype.dispose = function () {
	        if (Utils_1.isDisposable(this._subject)) {
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
	    var result = Utils_1.extend(scheduled, new Rx.Subject(), true);
	    return result;
	}
	exports.createScheduledSubject = createScheduledSubject;
	//# sourceMappingURL=ScheduledSubject.js.map

/***/ },
/* 31 */
/***/ function(module, exports, __webpack_require__) {

	/// <reference path="../../node_modules/rx/ts/rx.all.d.ts" />
	/// <reference path="../Interfaces.ts" />
	var Utils_1 = __webpack_require__(5);
	var Command_1 = __webpack_require__(20);
	"use strict";
	var EventBinding = (function () {
	    function EventBinding(domManager, app) {
	        this.priority = 0;
	        this.domManager = domManager;
	        this.app = app;
	    }
	    ////////////////////
	    // wx.IBinding
	    EventBinding.prototype.applyBinding = function (node, options, ctx, state, module) {
	        var _this = this;
	        if (node.nodeType !== 1)
	            Utils_1.throwError("event-binding only operates on elements!");
	        if (options == null)
	            Utils_1.throwError("invalid binding-options!");
	        var el = node;
	        // create an observable for each event handler value
	        var tokens = this.domManager.getObjectLiteralTokens(options);
	        tokens.forEach(function (token) {
	            _this.wireEvent(el, token.value, token.key, ctx, state, module);
	        });
	        // release closure references to GC 
	        state.cleanup.add(Rx.Disposable.create(function () {
	            // nullify args
	            node = null;
	            options = null;
	            ctx = null;
	            state = null;
	            // nullify common locals
	            el = null;
	            // nullify locals
	        }));
	    };
	    EventBinding.prototype.configure = function (options) {
	        // intentionally left blank
	    };
	    EventBinding.prototype.wireEvent = function (el, value, eventName, ctx, state, module) {
	        var _this = this;
	        var exp = this.domManager.compileBindingOptions(value, module);
	        var command;
	        var commandParameter = undefined;
	        var obs = Rx.Observable.fromEvent(el, eventName);
	        if (typeof exp === "function") {
	            var handler = this.domManager.evaluateExpression(exp, ctx);
	            handler = Utils_1.unwrapProperty(handler);
	            if (Utils_1.isFunction(handler)) {
	                state.cleanup.add(obs.subscribe(function (e) {
	                    handler.apply(ctx.$data, [ctx, e]);
	                }));
	            }
	            else {
	                if (Command_1.isCommand(handler)) {
	                    command = handler;
	                    state.cleanup.add(obs.subscribe(function (_) {
	                        command.execute(undefined);
	                    }));
	                }
	                else {
	                    // assumed to be an Rx.Observer
	                    var observer = handler;
	                    // subscribe event directly to observer
	                    state.cleanup.add(obs.subscribe(observer));
	                }
	            }
	        }
	        else if (typeof exp === "object") {
	            var opt = exp;
	            command = this.domManager.evaluateExpression(opt.command, ctx);
	            command = Utils_1.unwrapProperty(command);
	            if (exp.hasOwnProperty("parameter"))
	                commandParameter = this.domManager.evaluateExpression(opt.parameter, ctx);
	            state.cleanup.add(obs.subscribe(function (_) {
	                try {
	                    command.execute(commandParameter);
	                }
	                catch (e) {
	                    _this.app.defaultExceptionHandler.onNext(e);
	                }
	            }));
	        }
	        else {
	            Utils_1.throwError("invalid binding options");
	        }
	    };
	    return EventBinding;
	})();
	exports.default = EventBinding;
	//# sourceMappingURL=Event.js.map

/***/ },
/* 32 */
/***/ function(module, exports, __webpack_require__) {

	/// <reference path="../../node_modules/rx/ts/rx.all.d.ts" />
	/// <reference path="../Interfaces.ts" />
	var Utils_1 = __webpack_require__(5);
	var res = __webpack_require__(11);
	"use strict";
	var ValueBinding = (function () {
	    function ValueBinding(domManager, app) {
	        this.priority = 5;
	        this.domManager = domManager;
	        this.app = app;
	    }
	    ////////////////////
	    // wx.IBinding
	    ValueBinding.prototype.applyBinding = function (node, options, ctx, state, module) {
	        var _this = this;
	        if (node.nodeType !== 1)
	            Utils_1.throwError("value-binding only operates on elements!");
	        if (options == null)
	            Utils_1.throwError("invalid binding-options!");
	        var el = node;
	        var tag = el.tagName.toLowerCase();
	        if (tag !== 'input' && tag !== 'option' && tag !== 'select' && tag !== 'textarea')
	            Utils_1.throwError("value-binding only operates on checkboxes and radio-buttons");
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
	                setNodeValue(el, value, domManager);
	            else {
	                if ((value === null) || (value === undefined))
	                    value = "";
	                el.value = value;
	            }
	        }
	        // options is supposed to be a field-access path
	        state.cleanup.add(this.domManager.expressionToObservable(exp, ctx).subscribe(function (model) {
	            try {
	                if (!Utils_1.isProperty(model)) {
	                    // initial and final update
	                    updateElement(_this.domManager, model);
	                }
	                else {
	                    doCleanup();
	                    cleanup = new Rx.CompositeDisposable();
	                    // update on property change
	                    prop = model;
	                    cleanup.add(prop.changed.subscribe(function (x) {
	                        updateElement(_this.domManager, x);
	                    }));
	                    // initial update
	                    updateElement(_this.domManager, prop());
	                    // don't attempt to updated computed properties
	                    if (!prop.source) {
	                        cleanup.add(Rx.Observable.fromEvent(el, 'change').subscribe(function (e) {
	                            try {
	                                if (useDomManagerForValueUpdates)
	                                    prop(getNodeValue(el, _this.domManager));
	                                else
	                                    prop(el.value);
	                            }
	                            catch (e) {
	                                _this.app.defaultExceptionHandler.onNext(e);
	                            }
	                        }));
	                    }
	                }
	            }
	            catch (e) {
	                _this.app.defaultExceptionHandler.onNext(e);
	            }
	        }));
	        // release closure references to GC 
	        state.cleanup.add(Rx.Disposable.create(function () {
	            // nullify args
	            node = null;
	            options = null;
	            ctx = null;
	            state = null;
	            // nullify common locals
	            el = null;
	            // nullify locals
	            doCleanup();
	        }));
	    };
	    ValueBinding.prototype.configure = function (options) {
	        // intentionally left blank
	    };
	    return ValueBinding;
	})();
	exports.default = ValueBinding;
	/**
	 * For certain elements such as select and input type=radio we store
	 * the real element value in NodeState if it is anything other than a
	 * string. This method returns that value.
	 * @param {Node} node
	 * @param {IDomManager} domManager
	 */
	function getNodeValue(node, domManager) {
	    var state = domManager.getNodeState(node);
	    if (state != null && state[res.hasValueBindingValue]) {
	        return state[res.valueBindingValue];
	    }
	    return node.value;
	}
	exports.getNodeValue = getNodeValue;
	/**
	 * Associate a value with an element. Either by using its value-attribute
	 * or storing it in NodeState
	 * @param {Node} node
	 * @param {any} value
	 * @param {IDomManager} domManager
	 */
	function setNodeValue(node, value, domManager) {
	    if ((value === null) || (value === undefined))
	        value = "";
	    var state = domManager.getNodeState(node);
	    if (typeof value === "string") {
	        // Update the element only if the element and model are different. On some browsers, updating the value
	        // will move the cursor to the end of the input, which would be bad while the user is typing.
	        if (node.value !== value) {
	            node.value = value;
	            // clear state since value is stored in attribute
	            if (state != null && state[res.hasValueBindingValue]) {
	                state[res.hasValueBindingValue] = false;
	                state[res.valueBindingValue] = undefined;
	            }
	        }
	    }
	    else {
	        // get or create state
	        if (state == null) {
	            state = this.createNodeState();
	            this.setNodeState(node, state);
	        }
	        // store value
	        state[res.valueBindingValue] = value;
	        state[res.hasValueBindingValue] = true;
	    }
	}
	exports.setNodeValue = setNodeValue;
	//# sourceMappingURL=Value.js.map

/***/ },
/* 33 */
/***/ function(module, exports, __webpack_require__) {

	/// <reference path="../../node_modules/rx/ts/rx.all.d.ts" />
	/// <reference path="../Interfaces.ts" />
	var Utils_1 = __webpack_require__(5);
	"use strict";
	var HasFocusBinding = (function () {
	    function HasFocusBinding(domManager, app) {
	        this.priority = -1;
	        this.domManager = domManager;
	        this.app = app;
	    }
	    ////////////////////
	    // wx.IBinding
	    HasFocusBinding.prototype.applyBinding = function (node, options, ctx, state, module) {
	        var _this = this;
	        if (node.nodeType !== 1)
	            Utils_1.throwError("hasFocus-binding only operates on elements!");
	        if (options == null)
	            Utils_1.throwError("invalid binding-options!");
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
	            // convert boolean to number
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
	            // wx.If possible, ignore which event was raised and determine focus state using activeElement,
	            // as this avoids phantom focus/blur events raised when changing tabs in modern browsers.
	            var ownerDoc = el.ownerDocument;
	            if ("activeElement" in ownerDoc) {
	                var active;
	                try {
	                    active = ownerDoc.activeElement;
	                }
	                catch (e) {
	                    // wx.IE9 throws if you access activeElement during page load (see issue #703)
	                    active = ownerDoc.body;
	                }
	                isFocused = (active === el);
	            }
	            prop(isFocused);
	        }
	        function updateElement(value) {
	            if (value) {
	                // Note: wx.If the element is currently hidden, we schedule the focus change
	                // to occur "soonish". Technically this is a hack because it hides the fact
	                // that we make tricky assumption about the presence of a "visible" binding 
	                // on the same element who's subscribe handler runs after us 
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
	        // options is supposed to be a @propref
	        state.cleanup.add(this.domManager.expressionToObservable(exp, ctx).subscribe(function (model) {
	            try {
	                if (!Utils_1.isProperty(model)) {
	                    // initial and final update
	                    updateElement(model);
	                }
	                else {
	                    doCleanup();
	                    cleanup = new Rx.CompositeDisposable();
	                    // update on property change
	                    prop = model;
	                    cleanup.add(prop.changed.subscribe(function (x) {
	                        updateElement(x);
	                    }));
	                    // initial update
	                    updateElement(prop());
	                    // don't attempt to updated computed properties
	                    if (!prop.source) {
	                        cleanup.add(Rx.Observable.merge(_this.getFocusEventObservables(el)).subscribe(function (hasFocus) {
	                            handleElementFocusChange(hasFocus);
	                        }));
	                    }
	                }
	            }
	            catch (e) {
	                _this.app.defaultExceptionHandler.onNext(e);
	            }
	        }));
	        // release closure references to GC 
	        state.cleanup.add(Rx.Disposable.create(function () {
	            // nullify args
	            node = null;
	            options = null;
	            ctx = null;
	            state = null;
	            // nullify common locals
	            el = null;
	            // nullify locals
	            doCleanup();
	        }));
	    };
	    HasFocusBinding.prototype.configure = function (options) {
	        // intentionally left blank
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
	exports.default = HasFocusBinding;
	//# sourceMappingURL=HasFocus.js.map

/***/ },
/* 34 */
/***/ function(module, exports, __webpack_require__) {

	/// <reference path="../../node_modules/rx/ts/rx.all.d.ts" />
	/// <reference path="../Interfaces.ts" />
	var Utils_1 = __webpack_require__(5);
	"use strict";
	var WithBinding = (function () {
	    function WithBinding(domManager, app) {
	        this.priority = 50;
	        this.controlsDescendants = true;
	        this.domManager = domManager;
	        this.app = app;
	    }
	    ////////////////////
	    // wx.IBinding
	    WithBinding.prototype.applyBinding = function (node, options, ctx, state, module) {
	        var _this = this;
	        if (node.nodeType !== 1)
	            Utils_1.throwError("with-binding only operates on elements!");
	        if (options == null)
	            Utils_1.throwError("invalid binding-options!");
	        var el = node;
	        var self = this;
	        var exp = this.domManager.compileBindingOptions(options, module);
	        var obs = this.domManager.expressionToObservable(exp, ctx);
	        // subscribe
	        state.cleanup.add(obs.subscribe(function (x) {
	            try {
	                self.applyValue(el, Utils_1.unwrapProperty(x), state);
	            }
	            catch (e) {
	                _this.app.defaultExceptionHandler.onNext(e);
	            }
	        }));
	        // release closure references to GC 
	        state.cleanup.add(Rx.Disposable.create(function () {
	            // nullify args
	            node = null;
	            options = null;
	            ctx = null;
	            state = null;
	            // nullify common locals
	            obs = null;
	            el = null;
	            self = null;
	            // nullify locals
	        }));
	    };
	    WithBinding.prototype.configure = function (options) {
	        // intentionally left blank
	    };
	    WithBinding.prototype.applyValue = function (el, value, state) {
	        state.model = value;
	        var ctx = this.domManager.getDataContext(el);
	        this.domManager.cleanDescendants(el);
	        this.domManager.applyBindingsToDescendants(ctx, el);
	    };
	    return WithBinding;
	})();
	exports.default = WithBinding;
	//# sourceMappingURL=With.js.map

/***/ },
/* 35 */
/***/ function(module, exports, __webpack_require__) {

	/// <reference path="../../node_modules/rx/ts/rx.all.d.ts" />
	/// <reference path="../Interfaces.ts" />
	var Utils_1 = __webpack_require__(5);
	"use strict";
	var CheckedBinding = (function () {
	    function CheckedBinding(domManager, app) {
	        this.priority = 0;
	        this.domManager = domManager;
	        this.app = app;
	    }
	    ////////////////////
	    // wx.IBinding
	    CheckedBinding.prototype.applyBinding = function (node, options, ctx, state, module) {
	        var _this = this;
	        if (node.nodeType !== 1)
	            Utils_1.throwError("checked-binding only operates on elements!");
	        if (options == null)
	            Utils_1.throwError("invalid binding-options!");
	        var el = node;
	        var tag = el.tagName.toLowerCase();
	        var isCheckBox = el.type === 'checkbox';
	        var isRadioButton = el.type === 'radio';
	        if (tag !== 'input' || (!isCheckBox && !isRadioButton))
	            Utils_1.throwError("checked-binding only operates on checkboxes and radio-buttons");
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
	                if (!Utils_1.isProperty(model)) {
	                    // initial and final update
	                    updateElement(model);
	                }
	                else {
	                    doCleanup();
	                    cleanup = new Rx.CompositeDisposable();
	                    // update on property change
	                    prop = model;
	                    cleanup.add(prop.changed.subscribe(function (x) {
	                        updateElement(x);
	                    }));
	                    // initial update
	                    updateElement(prop());
	                    // don't attempt to updated computed properties
	                    if (!prop.source) {
	                        // wire change-events depending on browser and version
	                        var events = _this.getCheckedEventObservables(el);
	                        cleanup.add(Rx.Observable.merge(events).subscribe(function (e) {
	                            try {
	                                prop(el.checked);
	                            }
	                            catch (e) {
	                                _this.app.defaultExceptionHandler.onNext(e);
	                            }
	                        }));
	                    }
	                }
	            }
	            catch (e) {
	                _this.app.defaultExceptionHandler.onNext(e);
	            }
	        }));
	        // release closure references to GC 
	        state.cleanup.add(Rx.Disposable.create(function () {
	            // nullify args
	            node = null;
	            options = null;
	            ctx = null;
	            state = null;
	            // nullify common locals
	            el = null;
	            // nullify locals
	            doCleanup();
	        }));
	    };
	    CheckedBinding.prototype.configure = function (options) {
	        // intentionally left blank
	    };
	    CheckedBinding.prototype.getCheckedEventObservables = function (el) {
	        var result = [];
	        result.push(Rx.Observable.fromEvent(el, 'click'));
	        result.push(Rx.Observable.fromEvent(el, 'change'));
	        return result;
	    };
	    return CheckedBinding;
	})();
	exports.default = CheckedBinding;
	//# sourceMappingURL=Checked.js.map

/***/ },
/* 36 */
/***/ function(module, exports, __webpack_require__) {

	/// <reference path="../../node_modules/rx/ts/rx.all.d.ts" />
	/// <reference path="../Interfaces.ts" />
	var Utils_1 = __webpack_require__(5);
	var Command_1 = __webpack_require__(20);
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
	    function KeyPressBinding(domManager, app) {
	        this.priority = 0;
	        this.domManager = domManager;
	        this.app = app;
	    }
	    ////////////////////
	    // wx.IBinding
	    KeyPressBinding.prototype.applyBinding = function (node, options, ctx, state, module) {
	        var _this = this;
	        if (node.nodeType !== 1)
	            Utils_1.throwError("keyPress-binding only operates on elements!");
	        if (options == null)
	            Utils_1.throwError("invalid binding-options!");
	        var el = node;
	        // create an observable for key combination
	        var tokens = this.domManager.getObjectLiteralTokens(options);
	        var obs = Rx.Observable.fromEvent(el, "keydown")
	            .where(function (x) { return !x.repeat; })
	            .publish()
	            .refCount();
	        tokens.forEach(function (token) {
	            var keyDesc = token.key;
	            var combination, combinations = [];
	            // parse key combinations
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
	        // release closure references to GC 
	        state.cleanup.add(Rx.Disposable.create(function () {
	            // nullify args
	            node = null;
	            options = null;
	            ctx = null;
	            state = null;
	            // nullify common locals
	            el = null;
	            // nullify locals
	        }));
	    };
	    KeyPressBinding.prototype.configure = function (options) {
	        // intentionally left blank
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
	        // normalize keycodes
	        if ((!shiftPressed || shiftRequired) && keyCode >= 65 && keyCode <= 90)
	            keyCode = keyCode + 32;
	        var mainKeyPressed = combination.keys[keysByCode[keyCode]] || combination.keys[keyCode.toString()] || combination.keys[String.fromCharCode(keyCode)];
	        return (mainKeyPressed &&
	            (metaRequired === metaPressed) &&
	            (altRequired === altPressed) &&
	            (ctrlRequired === ctrlPressed) &&
	            (shiftRequired === shiftPressed));
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
	            handler = Utils_1.unwrapProperty(handler);
	            if (!Command_1.isCommand(handler)) {
	                state.cleanup.add(obs.where(function (e) { return _this.testCombinations(combinations, e); }).subscribe(function (e) {
	                    try {
	                        handler.apply(ctx.$data, [ctx]);
	                        e.preventDefault();
	                    }
	                    catch (e) {
	                        _this.app.defaultExceptionHandler.onNext(e);
	                    }
	                }));
	            }
	            else {
	                command = handler;
	                state.cleanup.add(obs.where(function (e) { return _this.testCombinations(combinations, e); }).subscribe(function (e) {
	                    try {
	                        command.execute(undefined);
	                        e.preventDefault();
	                    }
	                    catch (e) {
	                        _this.app.defaultExceptionHandler.onNext(e);
	                    }
	                }));
	            }
	        }
	        else if (typeof exp === "object") {
	            command = this.domManager.evaluateExpression(exp.command, ctx);
	            command = Utils_1.unwrapProperty(command);
	            if (exp.hasOwnProperty("parameter"))
	                commandParameter = this.domManager.evaluateExpression(exp.parameter, ctx);
	            state.cleanup.add(obs.where(function (e) { return _this.testCombinations(combinations, e); }).subscribe(function (e) {
	                try {
	                    command.execute(commandParameter);
	                    e.preventDefault();
	                }
	                catch (e) {
	                    _this.app.defaultExceptionHandler.onNext(e);
	                }
	            }));
	        }
	        else {
	            Utils_1.throwError("invalid binding options");
	        }
	    };
	    return KeyPressBinding;
	})();
	exports.default = KeyPressBinding;
	//# sourceMappingURL=KeyPress.js.map

/***/ },
/* 37 */
/***/ function(module, exports, __webpack_require__) {

	/// <reference path="../../node_modules/rx/ts/rx.all.d.ts" />
	/// <reference path="../Interfaces.ts" />
	var Utils_1 = __webpack_require__(5);
	var env = __webpack_require__(17);
	"use strict";
	var TextInputBinding = (function () {
	    function TextInputBinding(domManager, app) {
	        this.priority = 0;
	        this.domManager = domManager;
	        this.app = app;
	    }
	    ////////////////////
	    // wx.IBinding
	    TextInputBinding.prototype.applyBinding = function (node, options, ctx, state, module) {
	        var _this = this;
	        if (node.nodeType !== 1)
	            Utils_1.throwError("textInput-binding only operates on elements!");
	        if (options == null)
	            Utils_1.throwError("invalid binding-options!");
	        var el = node;
	        var tag = el.tagName.toLowerCase();
	        var isTextArea = tag === "textarea";
	        if (tag !== 'input' && tag !== 'textarea')
	            Utils_1.throwError("textInput-binding can only be applied to input or textarea elements");
	        var exp = this.domManager.compileBindingOptions(options, module);
	        var prop;
	        var propertySubscription;
	        var eventSubscription;
	        var previousElementValue;
	        function updateElement(value) {
	            if (value === null || value === undefined) {
	                value = "";
	            }
	            // Update the element only if the element and model are different. On some browsers, updating the value
	            // will move the cursor to the end of the input, which would be bad while the user is typing.
	            if (el.value !== value) {
	                previousElementValue = value; // Make sure we ignore events (propertychange) that result from updating the value
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
	                if (!Utils_1.isProperty(src)) {
	                    // initial and final update
	                    updateElement(src);
	                }
	                else {
	                    doCleanup();
	                    // update on property change
	                    prop = src;
	                    propertySubscription = prop.changed.subscribe(function (x) {
	                        updateElement(x);
	                    });
	                    // initial update
	                    updateElement(prop());
	                    // don't attempt to updated computed properties
	                    if (!prop.source) {
	                        // wire change-events depending on browser and version
	                        var events = _this.getTextInputEventObservables(el, isTextArea);
	                        eventSubscription = Rx.Observable.merge(events).subscribe(function (e) {
	                            try {
	                                prop(el.value);
	                            }
	                            catch (e) {
	                                _this.app.defaultExceptionHandler.onNext(e);
	                            }
	                        });
	                    }
	                }
	            }
	            catch (e) {
	                _this.app.defaultExceptionHandler.onNext(e);
	            }
	        }));
	        // release closure references to GC 
	        state.cleanup.add(Rx.Disposable.create(function () {
	            // nullify args
	            node = null;
	            options = null;
	            ctx = null;
	            state = null;
	            // nullify common locals
	            el = null;
	            // nullify locals
	            doCleanup();
	        }));
	    };
	    TextInputBinding.prototype.configure = function (options) {
	        // intentionally left blank
	    };
	    TextInputBinding.prototype.getTextInputEventObservables = function (el, isTextArea) {
	        var result = [];
	        if (env.ie && env.ie.version < 10) {
	            if (env.ie.version <= 9) {
	                // wx.Internet Explorer 9 doesn't fire the 'input' event when deleting text, including using
	                // the backspace, delete, or ctrl-x keys, clicking the 'x' to clear the input, dragging text
	                // out of the field, and cutting or deleting text using the context menu. 'selectionchange'
	                // can detect all of those except dragging text out of the field, for which we use 'dragend'.
	                result.push(env.ie.getSelectionChangeObservable(el).where(function (doc) { return doc.activeElement === el; }));
	                result.push(Rx.Observable.fromEvent(el, 'dragend'));
	                // wx.IE 9 does support 'input', but since it doesn't fire it when
	                // using autocomplete, we'll use 'propertychange' for it also.
	                result.push(Rx.Observable.fromEvent(el, 'input'));
	                result.push(Rx.Observable.fromEvent(el, 'propertychange').where(function (e) { return e.propertyName === 'value'; }));
	            }
	        }
	        else {
	            // All other supported browsers support the 'input' event, which fires whenever the content of the element is changed
	            // through the user interface.
	            result.push(Rx.Observable.fromEvent(el, 'input'));
	            if (env.safari && env.safari.version < 5 && isTextArea) {
	                // Safari <5 doesn't fire the 'input' event for <textarea> elements (it does fire 'textInput'
	                // but only when typing). So we'll just catch as much as we can with keydown, cut, and paste.
	                result.push(Rx.Observable.fromEvent(el, 'keydown'));
	                result.push(Rx.Observable.fromEvent(el, 'paste'));
	                result.push(Rx.Observable.fromEvent(el, 'cut'));
	            }
	            else if (env.opera && env.opera.version < 11) {
	                // Opera 10 doesn't always fire the 'input' event for cut, paste, undo & drop operations.
	                // We can try to catch some of those using 'keydown'.
	                result.push(Rx.Observable.fromEvent(el, 'keydown'));
	            }
	            else if (env.firefox && env.firefox.version < 4.0) {
	                // Firefox <= 3.6 doesn't fire the 'input' event when text is filled in through autocomplete
	                result.push(Rx.Observable.fromEvent(el, 'DOMAutoComplete'));
	                // Firefox <=3.5 doesn't fire the 'input' event when text is dropped into the input.
	                result.push(Rx.Observable.fromEvent(el, 'dragdrop')); // <3.5
	                result.push(Rx.Observable.fromEvent(el, 'drop')); // 3.5
	            }
	        }
	        // Bind to the change event so that we can catch programmatic updates of the value that fire this event.
	        result.push(Rx.Observable.fromEvent(el, 'change'));
	        return result;
	    };
	    return TextInputBinding;
	})();
	exports.default = TextInputBinding;
	//# sourceMappingURL=TextInput.js.map

/***/ },
/* 38 */
/***/ function(module, exports, __webpack_require__) {

	/// <reference path="../../node_modules/rx/ts/rx.all.d.ts" />
	/// <reference path="../Interfaces.ts" />
	var Utils_1 = __webpack_require__(5);
	var Value_1 = __webpack_require__(32);
	var List_1 = __webpack_require__(28);
	"use strict";
	var impls = new Array();
	var RadioSingleSelectionImpl = (function () {
	    function RadioSingleSelectionImpl(domManager) {
	        this.domManager = domManager;
	    }
	    RadioSingleSelectionImpl.prototype.supports = function (el, model) {
	        return (el.tagName.toLowerCase() === 'input' &&
	            el.getAttribute("type") === 'radio') &&
	            !List_1.isList(model);
	    };
	    RadioSingleSelectionImpl.prototype.observeElement = function (el) {
	        return Rx.Observable.merge(Rx.Observable.fromEvent(el, 'click'), Rx.Observable.fromEvent(el, 'change'));
	    };
	    RadioSingleSelectionImpl.prototype.observeModel = function (model) {
	        if (Utils_1.isProperty(model)) {
	            var prop = model;
	            return prop.changed;
	        }
	        return Rx.Observable.never();
	    };
	    RadioSingleSelectionImpl.prototype.updateElement = function (el, model) {
	        var input = el;
	        input.checked = Value_1.getNodeValue(input, this.domManager) == Utils_1.unwrapProperty(model);
	    };
	    RadioSingleSelectionImpl.prototype.updateModel = function (el, model, e) {
	        var input = el;
	        if (input.checked) {
	            model(Value_1.getNodeValue(input, this.domManager));
	        }
	    };
	    return RadioSingleSelectionImpl;
	})();
	var OptionSingleSelectionImpl = (function () {
	    function OptionSingleSelectionImpl(domManager) {
	        this.domManager = domManager;
	    }
	    OptionSingleSelectionImpl.prototype.supports = function (el, model) {
	        return el.tagName.toLowerCase() === 'select' &&
	            !List_1.isList(model);
	    };
	    OptionSingleSelectionImpl.prototype.observeElement = function (el) {
	        return Rx.Observable.fromEvent(el, 'change');
	    };
	    OptionSingleSelectionImpl.prototype.observeModel = function (model) {
	        if (Utils_1.isProperty(model)) {
	            var prop = model;
	            return prop.changed;
	        }
	        return Rx.Observable.never();
	    };
	    OptionSingleSelectionImpl.prototype.updateElement = function (el, model) {
	        var select = el;
	        var value = Utils_1.unwrapProperty(model);
	        var length = select.options.length;
	        if (value == null) {
	            select.selectedIndex = -1;
	        }
	        else {
	            for (var i = 0; i < length; i++) {
	                var option = select.options[i];
	                if (Value_1.getNodeValue(option, this.domManager) == value) {
	                    select.selectedIndex = i;
	                    break;
	                }
	            }
	        }
	    };
	    OptionSingleSelectionImpl.prototype.updateModel = function (el, model, e) {
	        var select = el;
	        // selected-value comes from the option at selectedIndex
	        var value = select.selectedIndex !== -1 ?
	            Value_1.getNodeValue(select.options[select.selectedIndex], this.domManager) :
	            undefined;
	        model(value);
	    };
	    return OptionSingleSelectionImpl;
	})();
	var SelectedValueBinding = (function () {
	    function SelectedValueBinding(domManager, app) {
	        this.priority = 0;
	        this.domManager = domManager;
	        this.app = app;
	        impls.push(new RadioSingleSelectionImpl(domManager));
	        impls.push(new OptionSingleSelectionImpl(domManager));
	    }
	    ////////////////////
	    // wx.IBinding
	    SelectedValueBinding.prototype.applyBinding = function (node, options, ctx, state, module) {
	        var _this = this;
	        if (node.nodeType !== 1)
	            Utils_1.throwError("selectedValue-binding only operates on elements!");
	        if (options == null)
	            Utils_1.throwError("invalid binding-options!");
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
	        // options is supposed to be a field-access path
	        state.cleanup.add(this.domManager.expressionToObservable(exp, ctx).subscribe(function (model) {
	            try {
	                cleanupImpl();
	                // lookup implementation
	                impl = undefined;
	                for (var i = 0; i < impls.length; i++) {
	                    if (impls[i].supports(el, model)) {
	                        impl = impls[i];
	                        break;
	                    }
	                }
	                if (!impl)
	                    Utils_1.throwError("selectedValue-binding does not support this combination of bound element and model!");
	                implCleanup = new Rx.CompositeDisposable();
	                // initial update
	                impl.updateElement(el, model);
	                // update on model change
	                implCleanup.add(impl.observeModel(model).subscribe(function (x) {
	                    try {
	                        impl.updateElement(el, model);
	                    }
	                    catch (e) {
	                        _this.app.defaultExceptionHandler.onNext(e);
	                    }
	                }));
	                // wire change-events
	                if (Utils_1.isProperty(model)) {
	                    implCleanup.add(impl.observeElement(el).subscribe(function (e) {
	                        try {
	                            impl.updateModel(el, model, e);
	                        }
	                        catch (e) {
	                            _this.app.defaultExceptionHandler.onNext(e);
	                        }
	                    }));
	                }
	            }
	            catch (e) {
	                _this.app.defaultExceptionHandler.onNext(e);
	            }
	        }));
	        // release closure references to GC 
	        state.cleanup.add(Rx.Disposable.create(function () {
	            // nullify args
	            node = null;
	            options = null;
	            ctx = null;
	            state = null;
	            // nullify common locals
	            el = null;
	            // nullify locals
	            cleanupImpl();
	        }));
	    };
	    SelectedValueBinding.prototype.configure = function (options) {
	        // intentionally left blank
	    };
	    return SelectedValueBinding;
	})();
	exports.default = SelectedValueBinding;
	//# sourceMappingURL=SelectedValue.js.map

/***/ },
/* 39 */
/***/ function(module, exports, __webpack_require__) {

	/// <reference path="../../node_modules/rx/ts/rx.all.d.ts" />
	/// <reference path="../Interfaces.ts" />
	var Utils_1 = __webpack_require__(5);
	"use strict";
	var ComponentBinding = (function () {
	    function ComponentBinding(domManager, app) {
	        this.priority = 30;
	        this.controlsDescendants = true;
	        this.domManager = domManager;
	        this.app = app;
	    }
	    ////////////////////
	    // wx.IBinding
	    ComponentBinding.prototype.applyBinding = function (node, options, ctx, state, module) {
	        var _this = this;
	        if (node.nodeType !== 1)
	            Utils_1.throwError("component-binding only operates on elements!");
	        if (options == null)
	            Utils_1.throwError("invalid binding-options!");
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
	            // collect component-name observable
	            componentNameObservable = this.domManager.expressionToObservable(opt.name, ctx);
	            // collect params observables
	            if (opt.params) {
	                if (Utils_1.isFunction(opt.params)) {
	                    // opt params is object passed by value (probably $componentParams from view-binding)
	                    componentParams = this.domManager.evaluateExpression(opt.params, ctx);
	                }
	                else if (typeof opt.params === "object") {
	                    Object.keys(opt.params).forEach(function (x) {
	                        componentParams[x] = _this.domManager.evaluateExpression(opt.params[x], ctx);
	                    });
	                }
	                else {
	                    Utils_1.throwError("invalid component-params");
	                }
	            }
	        }
	        // clear children
	        var oldContents = new Array();
	        while (el.firstChild) {
	            oldContents.push(el.removeChild(el.firstChild));
	        }
	        // subscribe to any input changes
	        state.cleanup.add(componentNameObservable.subscribe(function (componentName) {
	            try {
	                doCleanup();
	                cleanup = new Rx.CompositeDisposable();
	                // lookup component
	                var obs = module.loadComponent(componentName, componentParams);
	                var disp = undefined;
	                if (obs == null)
	                    Utils_1.throwError("component '{0}' is not registered with current module-context", componentName);
	                disp = obs.subscribe(function (component) {
	                    // loader cleanup
	                    if (disp != null) {
	                        disp.dispose();
	                        disp = undefined;
	                    }
	                    // auto-dispose view-model
	                    if (component.viewModel) {
	                        if (Utils_1.isDisposable(component.viewModel)) {
	                            cleanup.add(component.viewModel);
	                        }
	                    }
	                    // done
	                    _this.applyTemplate(component, el, ctx, state, component.template, component.viewModel);
	                });
	                if (disp != null)
	                    cleanup.add(disp);
	            }
	            catch (e) {
	                _this.app.defaultExceptionHandler.onNext(e);
	            }
	        }));
	        // release closure references to GC 
	        state.cleanup.add(Rx.Disposable.create(function () {
	            // nullify args
	            node = null;
	            options = null;
	            ctx = null;
	            state = null;
	            // nullify common locals
	            oldContents = null;
	            compiled = null;
	            doCleanup();
	        }));
	    };
	    ComponentBinding.prototype.configure = function (options) {
	        // intentionally left blank
	    };
	    ComponentBinding.prototype.applyTemplate = function (component, el, ctx, state, template, vm) {
	        // clear
	        while (el.firstChild) {
	            this.domManager.cleanNode(el.firstChild);
	            el.removeChild(el.firstChild);
	        }
	        // clone template and inject
	        for (var i = 0; i < template.length; i++) {
	            var node = template[i].cloneNode(true);
	            el.appendChild(node);
	        }
	        if (vm) {
	            state.model = vm;
	            // refresh context
	            ctx = this.domManager.getDataContext(el);
	        }
	        // invoke preBindingInit 
	        if (vm && component.preBindingInit && vm.hasOwnProperty(component.preBindingInit)) {
	            vm[component.preBindingInit].call(vm, el);
	        }
	        // done
	        this.domManager.applyBindingsToDescendants(ctx, el);
	        // invoke postBindingInit 
	        if (vm && component.postBindingInit && vm.hasOwnProperty(component.postBindingInit)) {
	            vm[component.postBindingInit].call(vm, el);
	        }
	    };
	    return ComponentBinding;
	})();
	exports.default = ComponentBinding;
	//# sourceMappingURL=Component.js.map

/***/ },
/* 40 */
/***/ function(module, exports, __webpack_require__) {

	/// <reference path="../../../node_modules/rx/ts/rx.all.d.ts" />
	/// <reference path="../../Interfaces.ts" />
	var Utils_1 = __webpack_require__(5);
	"use strict";
	var StateActiveBinding = (function () {
	    function StateActiveBinding(domManager, router, app) {
	        this.priority = 5;
	        this.domManager = domManager;
	        this.router = router;
	        this.app = app;
	    }
	    ////////////////////
	    // wx.IBinding
	    StateActiveBinding.prototype.applyBinding = function (node, options, ctx, state, module) {
	        var _this = this;
	        if (node.nodeType !== 1)
	            Utils_1.throwError("stateActive-binding only operates on elements!");
	        if (options == null)
	            Utils_1.throwError("invalid binding-options!");
	        var el = node;
	        var compiled = this.domManager.compileBindingOptions(options, module);
	        var exp;
	        var observables = [];
	        var opt = compiled;
	        var paramsKeys = [];
	        var stateName;
	        var stateParams;
	        var cssClass = "active";
	        observables.push(this.router.current.changed.startWith(this.router.current()));
	        if (typeof compiled === "function") {
	            exp = compiled;
	            observables.push(this.domManager.expressionToObservable(exp, ctx));
	        }
	        else {
	            // collect state-name observable
	            observables.push(this.domManager.expressionToObservable(opt.name, ctx));
	            // collect params observables
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
	        // subscribe to any input changes
	        state.cleanup.add(Rx.Observable.combineLatest(observables, function (_) { return Utils_1.args2Array(arguments); }).subscribe(function (latest) {
	            try {
	                // first element is the current state
	                var currentState = latest.shift();
	                // second element is the state-name
	                stateName = Utils_1.unwrapProperty(latest.shift());
	                // subsequent entries are latest param values
	                stateParams = {};
	                for (var i = 0; i < paramsKeys.length; i++) {
	                    stateParams[paramsKeys[i]] = Utils_1.unwrapProperty(latest[i]);
	                }
	                var active = _this.router.includes(stateName, stateParams);
	                var classes = cssClass.split(/\s+/).map(function (x) { return x.trim(); }).filter(function (x) { return x; });
	                if (classes.length) {
	                    Utils_1.toggleCssClass.apply(null, [el, active].concat(classes));
	                }
	            }
	            catch (e) {
	                _this.app.defaultExceptionHandler.onNext(e);
	            }
	        }));
	        // release closure references to GC 
	        state.cleanup.add(Rx.Disposable.create(function () {
	            // nullify args
	            node = null;
	            options = null;
	            ctx = null;
	            state = null;
	            // nullify locals
	            observables = null;
	            compiled = null;
	            stateName = null;
	            stateParams = null;
	            opt = null;
	            paramsKeys = null;
	        }));
	    };
	    StateActiveBinding.prototype.configure = function (options) {
	        // intentionally left blank
	    };
	    return StateActiveBinding;
	})();
	exports.default = StateActiveBinding;
	//# sourceMappingURL=StateActive.js.map

/***/ },
/* 41 */
/***/ function(module, exports, __webpack_require__) {

	/// <reference path="../../../node_modules/rx/ts/rx.all.d.ts" />
	/// <reference path="../../Interfaces.ts" />
	var Utils_1 = __webpack_require__(5);
	"use strict";
	var ViewBinding = (function () {
	    function ViewBinding(domManager, router, app) {
	        this.priority = 1000;
	        this.controlsDescendants = true;
	        this.domManager = domManager;
	        this.router = router;
	        this.app = app;
	    }
	    ////////////////////
	    // wx.IBinding
	    ViewBinding.prototype.applyBinding = function (node, options, ctx, state, module) {
	        var _this = this;
	        if (node.nodeType !== 1)
	            Utils_1.throwError("view-binding only operates on elements!");
	        if (options == null)
	            Utils_1.throwError("invalid binding-options!");
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
	            Utils_1.throwError("views must be named!");
	        // subscribe to router-state changes
	        state.cleanup.add(this.router.current.changed.startWith(this.router.current()).subscribe(function (newState) {
	            try {
	                doCleanup();
	                cleanup = new Rx.CompositeDisposable();
	                var config = _this.router.getViewComponent(viewName);
	                if (config != null) {
	                    if (!Utils_1.isEqual(currentConfig, config)) {
	                        cleanup.add(_this.applyTemplate(viewName, config.component, currentConfig ? currentConfig.component : undefined, config.params, config.animations, el, ctx, module));
	                        currentConfig = config;
	                    }
	                }
	                else {
	                    cleanup.add(_this.applyTemplate(viewName, null, currentConfig ? currentConfig.component : undefined, null, currentConfig ? currentConfig.animations : {}, el, ctx, module));
	                    currentConfig = {};
	                }
	            }
	            catch (e) {
	                _this.app.defaultExceptionHandler.onNext(e);
	            }
	        }));
	        // release closure references to GC 
	        state.cleanup.add(Rx.Disposable.create(function () {
	            // nullify args
	            node = null;
	            options = null;
	            ctx = null;
	            state = null;
	            // nullify common locals
	        }));
	    };
	    ViewBinding.prototype.configure = function (options) {
	        // intentionally left blank
	    };
	    ViewBinding.prototype.applyTemplate = function (viewName, componentName, previousComponentName, componentParams, animations, el, ctx, module) {
	        var _this = this;
	        var self = this;
	        var oldElements = Utils_1.nodeChildrenToArray(el);
	        var combined = [];
	        var obs;
	        function removeOldElements() {
	            oldElements.forEach(function (x) {
	                self.domManager.cleanNode(x);
	                el.removeChild(x);
	            });
	        }
	        function instantiateComponent(animation) {
	            // extend the data-context
	            ctx.$componentParams = componentParams;
	            // create component container element
	            var container = document.createElement("div");
	            var binding = Utils_1.formatString("component: { name: '{0}', params: $componentParams }", componentName);
	            container.setAttribute("data-bind", binding);
	            // prepare container for animation
	            if (animation != null)
	                animation.prepare(container);
	            // now insert it
	            el.appendChild(container);
	            // and apply bindings
	            self.domManager.applyBindings(ctx, container);
	        }
	        // construct leave-observable
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
	                obs = leaveAnimation.run(oldElements)
	                    .continueWith(function () { return leaveAnimation.complete(oldElements); })
	                    .continueWith(removeOldElements);
	            }
	            else {
	                obs = Rx.Observable.startDeferred(removeOldElements);
	            }
	            combined.push(obs);
	        }
	        // construct enter-observable
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
	                obs = obs.continueWith(enterAnimation.run(el.childNodes))
	                    .continueWith(function () { return enterAnimation.complete(el.childNodes); });
	            }
	            // notify world
	            obs = obs.continueWith(function () {
	                var transition = {
	                    view: viewName,
	                    fromComponent: previousComponentName,
	                    toComponent: componentName
	                };
	                var ri = _this.router;
	                ri.viewTransitionsSubject.onNext(transition);
	            });
	            combined.push(obs);
	        }
	        // optimize return
	        if (combined.length > 1)
	            obs = Rx.Observable.combineLatest(combined, Utils_1.noop).take(1);
	        else if (combined.length === 1)
	            obs = combined[0].take(1);
	        else
	            obs = null;
	        // no-op return
	        return obs ? (obs.subscribe() || Rx.Disposable.empty) : Rx.Disposable.empty;
	    };
	    return ViewBinding;
	})();
	exports.default = ViewBinding;
	//# sourceMappingURL=View.js.map

/***/ },
/* 42 */
/***/ function(module, exports, __webpack_require__) {

	/// <reference path="../../../node_modules/rx/ts/rx.all.d.ts" />
	/// <reference path="../../Interfaces.ts" />
	var Utils_1 = __webpack_require__(5);
	"use strict";
	var StateRefBinding = (function () {
	    function StateRefBinding(domManager, router, app) {
	        this.priority = 5;
	        this.domManager = domManager;
	        this.router = router;
	        this.app = app;
	    }
	    ////////////////////
	    // wx.IBinding
	    StateRefBinding.prototype.applyBinding = function (node, options, ctx, state, module) {
	        var _this = this;
	        if (node.nodeType !== 1)
	            Utils_1.throwError("stateRef-binding only operates on elements!");
	        if (options == null)
	            Utils_1.throwError("invalid binding-options!");
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
	            // collect state-name observable
	            observables.push(this.domManager.expressionToObservable(opt.name, ctx));
	            // collect params observables
	            if (opt.params) {
	                Object.keys(opt.params).forEach(function (x) {
	                    paramsKeys.push(x);
	                    observables.push(_this.domManager.expressionToObservable(opt.params[x], ctx));
	                });
	            }
	        }
	        // subscribe to any input changes
	        state.cleanup.add(Rx.Observable.combineLatest(observables, function (_) { return Utils_1.args2Array(arguments); }).subscribe(function (latest) {
	            try {
	                // first element is always the state-name
	                stateName = Utils_1.unwrapProperty(latest.shift());
	                // subsequent entries are latest param values
	                stateParams = {};
	                for (var i = 0; i < paramsKeys.length; i++) {
	                    stateParams[paramsKeys[i]] = Utils_1.unwrapProperty(latest[i]);
	                }
	                if (anchor != null) {
	                    anchor.href = _this.router.url(stateName, stateParams);
	                }
	            }
	            catch (e) {
	                _this.app.defaultExceptionHandler.onNext(e);
	            }
	        }));
	        // subscribe to anchor's click event
	        state.cleanup.add(Rx.Observable.fromEvent(el, "click").subscribe(function (e) {
	            e.preventDefault();
	            // initiate state change using latest name and params
	            _this.router.go(stateName, stateParams, { location: true });
	        }));
	        // release closure references to GC 
	        state.cleanup.add(Rx.Disposable.create(function () {
	            // nullify args
	            node = null;
	            options = null;
	            ctx = null;
	            state = null;
	            // nullify locals
	            observables = null;
	            compiled = null;
	            stateName = null;
	            stateParams = null;
	            opt = null;
	            paramsKeys = null;
	        }));
	    };
	    StateRefBinding.prototype.configure = function (options) {
	        // intentionally left blank
	    };
	    return StateRefBinding;
	})();
	exports.default = StateRefBinding;
	//# sourceMappingURL=StateRef.js.map

/***/ },
/* 43 */
/***/ function(module, exports, __webpack_require__) {

	/// <reference path="../Interfaces.ts" />
	var Utils_1 = __webpack_require__(5);
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
	        // check cache
	        if (!params.noCache) {
	            key = (params.name != null ? params.name : "") + "-" +
	                (params.itemText != null ? params.itemText : "") + "-" +
	                (params.itemValue != null ? params.itemValue : "") + "-" +
	                (params.itemClass != null ? params.itemClass : "") + "-" +
	                (params.selectedValue != null ? "true" : "false") + "-" +
	                (params.multiple ? "true" : "false") + "-" +
	                (params.required ? "true" : "false") + "-" +
	                (params.autofocus ? "true" : "false") + "-" +
	                (params.size ? params.size.toString() : "0");
	            nodes = templateCache[key];
	            if (nodes != null) {
	                //console.log("cache hit", key, result);
	                return nodes;
	            }
	        }
	        // base-template
	        result = '<select class="wx-select" data-bind="{0}"><option data-bind="{1}"></option></select>';
	        var bindings = [];
	        var attrs = [];
	        var itemBindings = [];
	        var itemAttrs = [];
	        bindings.push({ key: "foreach", value: "{ data: items, hooks: hooks }" });
	        // selection (two-way)
	        if (params.selectedValue)
	            bindings.push({ key: "selectedValue", value: "@selectedValue" });
	        // name
	        if (params.name) {
	            attrs.push({ key: 'name', value: params.name });
	        }
	        // multi-select
	        if (params.multiple) {
	            attrs.push({ key: 'multiple', value: "true" });
	        }
	        // size
	        if (params.size !== undefined) {
	            attrs.push({ key: 'size', value: params.size.toString() });
	        }
	        // required
	        if (params.required) {
	            attrs.push({ key: 'required', value: "true" });
	        }
	        // required
	        if (params.autofocus) {
	            attrs.push({ key: 'autofocus', value: "true" });
	        }
	        // assemble attr-binding
	        if (attrs.length)
	            bindings.push({ key: "attr", value: "{ " + attrs.map(function (x) { return x.key + ": " + x.value; }).join(", ") + " }" });
	        // value
	        itemBindings.push({ key: "value", value: params.itemValue || "$data" });
	        // label
	        itemBindings.push({ key: 'text', value: params.itemText || "$data" });
	        // per-item css class
	        if (params.itemClass) {
	            itemAttrs.push({ key: 'class', value: "'" + params.itemClass + "'" });
	        }
	        // assemble attr-binding
	        if (itemAttrs.length)
	            itemBindings.push({ key: "attr", value: "{ " + itemAttrs.map(function (x) { return x.key + ": " + x.value; }).join(", ") + " }" });
	        // assemble all bindings
	        var bindingString = bindings.map(function (x) { return x.key + ": " + x.value; }).join(", ");
	        var itemBindingString = itemBindings.map(function (x) { return x.key + ": " + x.value; }).join(", ");
	        // assemble template
	        result = Utils_1.formatString(result, bindingString, itemBindingString);
	        //console.log(result);
	        // store
	        if (!params.noCache) {
	            templateCache[key] = result;
	        }
	        // app.templateEngine can be altered by developer therefore we make sure to parse using HtmlTemplateEngine
	        nodes = this.htmlTemplateEngine.parse(result);
	        return nodes;
	    };
	    return SelectComponent;
	})();
	exports.default = SelectComponent;
	//# sourceMappingURL=Select.js.map

/***/ },
/* 44 */
/***/ function(module, exports, __webpack_require__) {

	/// <reference path="../Interfaces.ts" />
	var Utils_1 = __webpack_require__(5);
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
	            var groupName = opt.groupName != null ?
	                opt.groupName :
	                Utils_1.formatString("wx-radiogroup-{0}", groupId++);
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
	        // check cache
	        if (!params.noCache) {
	            key = (params.itemText != null ? params.itemText : "") + "-" +
	                (params.itemValue != null ? params.itemValue : "") + "-" +
	                (params.itemClass != null ? params.itemClass : "") + "-" +
	                (params.selectedValue != null ? "true" : "false");
	            nodes = templateCache[key];
	            if (nodes != null) {
	                //console.log("cache hit", key, result);
	                return nodes;
	            }
	        }
	        // base-template
	        result = '<div class="wx-radiogroup" data-bind="{0}"><input type="radio" data-bind="{1}"/>{2}</div>';
	        var bindings = [];
	        var attrs = [];
	        var itemBindings = [];
	        var itemAttrs = [];
	        var perItemExtraMarkup = "";
	        bindings.push({ key: "foreach", value: "{ data: items, hooks: hooks }" });
	        // assemble attr-binding
	        if (attrs.length)
	            bindings.push({ key: "attr", value: "{ " + attrs.map(function (x) { return x.key + ": " + x.value; }).join(", ") + " }" });
	        // value
	        itemBindings.push({ key: "value", value: params.itemValue || "$data" });
	        // name
	        itemAttrs.push({ key: 'name', value: "$parent.groupName" });
	        // selection (two-way)
	        if (params.selectedValue) {
	            itemBindings.push({ key: "selectedValue", value: "$parent.@selectedValue" });
	        }
	        // label
	        if (params.itemText) {
	            perItemExtraMarkup += Utils_1.formatString('<label data-bind="text: {0}, attr: { for: {1} }"></label>', params.itemText, "$parent.groupName + '-' + $index");
	            itemAttrs.push({ key: 'id', value: "$parent.groupName + '-' + $index" });
	        }
	        // per-item css class
	        if (params.itemClass) {
	            itemAttrs.push({ key: 'class', value: "'" + params.itemClass + "'" });
	        }
	        // assemble attr-binding
	        if (itemAttrs.length)
	            itemBindings.push({ key: "attr", value: "{ " + itemAttrs.map(function (x) { return x.key + ": " + x.value; }).join(", ") + " }" });
	        // assemble all bindings
	        var bindingString = bindings.map(function (x) { return x.key + ": " + x.value; }).join(", ");
	        var itemBindingString = itemBindings.map(function (x) { return x.key + ": " + x.value; }).join(", ");
	        // assemble template
	        result = Utils_1.formatString(result, bindingString, itemBindingString, perItemExtraMarkup);
	        // store
	        if (!params.noCache) {
	            templateCache[key] = result;
	        }
	        // app.templateEngine can be altered by developer therefore we make sure to parse using HtmlTemplateEngine
	        nodes = this.htmlTemplateEngine.parse(result);
	        return nodes;
	    };
	    return RadioGroupComponent;
	})();
	exports.default = RadioGroupComponent;
	//# sourceMappingURL=RadioGroup.js.map

/***/ },
/* 45 */
/***/ function(module, exports, __webpack_require__) {

	/// <reference path="../Interfaces.ts" />
	var Utils_1 = __webpack_require__(5);
	var Property_1 = __webpack_require__(13);
	var RouteMatcher_1 = __webpack_require__(46);
	"use strict";
	var Router = (function () {
	    function Router(domManager, app) {
	        var _this = this;
	        this.current = Property_1.property();
	        //////////////////////////////////
	        // Implementation
	        this.states = {};
	        this.pathSeparator = ".";
	        this.parentPathDirective = "^";
	        this.rootStateName = "$";
	        this.validPathRegExp = /^[a-zA-Z]([\w-_]*$)/;
	        this.viewTransitionsSubject = new Rx.Subject();
	        this.domManager = domManager;
	        this.app = app;
	        this.viewTransitions = this.viewTransitionsSubject.asObservable();
	        this.reset(false);
	        // monitor navigation history
	        app.history.onPopState.subscribe(function (e) {
	            try {
	                // certain versions of WebKit raise an empty popstate event on page-load
	                if (e && e.state) {
	                    var state = e.state;
	                    var stateName = state.stateName;
	                    if (stateName != null) {
	                        // enter state using extracted params
	                        _this.go(stateName, state.params, { location: false });
	                        // update title
	                        app.title(state.title);
	                    }
	                }
	            }
	            catch (e) {
	                app.defaultExceptionHandler.onNext(e);
	            }
	        });
	        // monitor title changes
	        app.title.changed.subscribe(function (x) {
	            document.title = x;
	            if (_this.current() != null)
	                _this.replaceHistoryState(_this.current(), x);
	        });
	    }
	    //////////////////////////////////
	    // IRouter
	    Router.prototype.state = function (config) {
	        this.registerStateInternal(config);
	        return this;
	    };
	    Router.prototype.updateCurrentStateParams = function (withParamsAction) {
	        var _current = this.current();
	        withParamsAction(_current.params);
	        this.replaceHistoryState(_current, this.app.title());
	    };
	    Router.prototype.go = function (to, params, options) {
	        to = this.mapPath(to);
	        if (this.states[to] == null)
	            Utils_1.throwError("state '{0}' is not registered", to);
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
	            paramsKeys = paramsKeys.length <= currentParamsKeys.length ?
	                paramsKeys : currentParamsKeys;
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
	        // Implicit root state that is always present
	        this.root = this.registerStateInternal({
	            name: this.rootStateName,
	            url: RouteMatcher_1.route("/")
	        });
	        if (enterRootState)
	            this.go(this.rootStateName, {}, { location: 2 /* replace */ });
	    };
	    Router.prototype.sync = function (url) {
	        if (url == null)
	            url = this.app.history.location.pathname; // + app.history.location.search;
	        // iterate over registered states to find matching uri
	        var keys = Object.keys(this.states);
	        var length = keys.length;
	        var params;
	        for (var i = 0; i < length; i++) {
	            var state = this.states[keys[i]];
	            var route_1 = this.getAbsoluteRouteForState(state.name);
	            if ((params = route_1.parse(url)) != null) {
	                this.go(state.name, params, { location: 2 /* replace */ });
	                return;
	            }
	        }
	        // not found, enter root state as fallback
	        if (this.current() == null)
	            this.reload();
	    };
	    Router.prototype.reload = function () {
	        var state;
	        var params;
	        // reload current state or enter inital root state            
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
	                // ensure that only parameters configured at state level surface at view-level
	                var parameterNames = this.getViewParameterNamesFromStateConfig(viewName, result.component);
	                parameterNames.forEach(function (x) {
	                    if (_current.params.hasOwnProperty(x)) {
	                        stateParams[x] = _current.params[x];
	                    }
	                });
	                // merge state params into component params
	                result.params = Utils_1.extend(stateParams, result.params);
	            }
	        }
	        return result;
	    };
	    Router.prototype.registerStateInternal = function (state) {
	        var _this = this;
	        var parts = state.name.split(this.pathSeparator);
	        if (state.name !== this.rootStateName) {
	            // validate name
	            if (parts.forEach(function (path) {
	                if (!_this.validPathRegExp.test(path)) {
	                    Utils_1.throwError("invalid state-path '{0}' (a state-path must start with a character, optionally followed by one or more alphanumeric characters, dashes or underscores)");
	                }
	            }))
	                ;
	        }
	        // wrap and store
	        state = Utils_1.extend(state, {});
	        this.states[state.name] = state;
	        if (state.url != null) {
	            // create route from string
	            if (typeof state.url === "string") {
	                state.url = RouteMatcher_1.route(state.url);
	            }
	        }
	        else {
	            // derive relative route from name
	            if (state.name !== this.rootStateName)
	                state.url = RouteMatcher_1.route(parts[parts.length - 1]);
	            else
	                state.url = RouteMatcher_1.route("/");
	        }
	        // detect root-state override
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
	        this.app.history.pushState(hs, "", state.url);
	    };
	    Router.prototype.replaceHistoryState = function (state, title) {
	        var hs = {
	            stateName: state.name,
	            params: state.params,
	            title: title != null ? title : document.title
	        };
	        this.app.history.replaceState(hs, "", state.url);
	    };
	    Router.prototype.mapPath = function (path) {
	        // child-relative
	        if (path.indexOf(this.pathSeparator) === 0) {
	            return this.current().name + path;
	        }
	        else if (path.indexOf(this.parentPathDirective) === 0) {
	            // parent-relative                
	            var parent_1 = this.current().name;
	            // can't go further up than root
	            if (parent_1 === this.rootStateName)
	                return parent_1;
	            // test parents and siblings until one is found that is registered
	            var parts = parent_1.split(this.pathSeparator);
	            for (var i = parts.length - 1; i > 0; i--) {
	                var tmp = parts.slice(0, i).join(this.pathSeparator);
	                // check if parent or sibling relative to current parent exists 
	                if (this.get(tmp) || this.get(tmp + path.substr(1))) {
	                    path = tmp + path.substr(1);
	                    return path;
	                }
	            }
	            // make it root relative
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
	            // if not registered, introduce fake state to keep hierarchy intact
	            if (state == null) {
	                state = {
	                    name: stateName,
	                    url: RouteMatcher_1.route(stateName)
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
	            // concat urls
	            if (result != null) {
	                var route_2 = state.url;
	                // individual states may use absolute urls as well
	                if (!route_2.isAbsolute)
	                    result = result.concat(state.url);
	                else
	                    result = route_2;
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
	            // merge views
	            if (state.views != null) {
	                Utils_1.extend(state.views, stateViews);
	            }
	            // merge params
	            if (state.params != null) {
	                Utils_1.extend(state.params, stateParams);
	            }
	        });
	        // merge param overrides
	        if (params) {
	            Utils_1.extend(params, stateParams);
	        }
	        // construct resulting state
	        var route = this.getAbsoluteRouteForState(to, hierarchy);
	        var state = Utils_1.extend(this.states[to], {});
	        state.url = route.stringify(params);
	        state.views = stateViews;
	        state.params = stateParams;
	        // perform deep equal against current state
	        var _current = this.current();
	        if ((options && options.force) || _current == null ||
	            _current.name !== to ||
	            !Utils_1.isEqual(_current.params, state.params)) {
	            // reset views used by previous state that are unused by new state
	            if (_current != null && _current.views != null && state.views != null) {
	                Object.keys(_current.views).forEach(function (x) {
	                    if (!state.views.hasOwnProperty(x)) {
	                        state.views[x] = null;
	                    }
	                });
	            }
	            // update history
	            if (options && options.location) {
	                if (options.location === 2 /* replace */)
	                    this.replaceHistoryState(state, this.app.title());
	                else
	                    this.pushHistoryState(state, this.app.title());
	            }
	            if (_current != null) {
	                if (_current.onLeave)
	                    _current.onLeave(this.get(_current.name), _current.params);
	            }
	            // activate
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
	        // walk the hierarchy backward to figure out when the component was introduced at the specified view-slot
	        for (var i = hierarchy.length; i--; i >= 0) {
	            config = hierarchy[i];
	            if (config.views && config.views[view]) {
	                var other = config.views[view];
	                if (typeof other === "object") {
	                    other = other.component;
	                }
	                if (other === component) {
	                    index = i; // found but keep looking
	                }
	            }
	        }
	        if (index !== -1) {
	            config = hierarchy[index];
	            // truncate hierarchy and merge params
	            hierarchy = hierarchy.slice(0, index + 1);
	            hierarchy.forEach(function (state) {
	                // merge params
	                if (state.params != null) {
	                    Utils_1.extend(state.params, stateParams);
	                }
	            });
	            // extract resulting property names
	            result = Object.keys(stateParams);
	            // append any route-params
	            result = result.concat(config.url.params);
	        }
	        return result;
	    };
	    return Router;
	})();
	exports.Router = Router;
	//# sourceMappingURL=Router.js.map

/***/ },
/* 46 */
/***/ function(module, exports, __webpack_require__) {

	/// <reference path="../Interfaces.ts" />
	var Utils_1 = __webpack_require__(5);
	/*
	 * JavaScript Route Matcher
	 * http://benalman.com/
	 *
	 * Copyright (c) 2011 "Cowboy" Ben Alman
	 * Dual licensed under the MIT and GPL licenses.
	 * http://benalman.com/about/license/
	 */
	"use strict";
	// Characters to be escaped with \. RegExp borrowed from the Backbone router
	// but escaped (note: unnecessarily) to keep JSHint from complaining.
	var reEscape = /[\-\[\]{}()+?.,\\\^$|#\s]/g;
	// Match named :param or *splat placeholders.
	var reParam = /([:*])(\w+)/g;
	var RouteMatcher = (function () {
	    // Pass in a route string (or RegExp) plus an optional map of rules, and get
	    // back an object with .parse and .stringify methods.
	    function RouteMatcher(route, rules) {
	        var _this = this;
	        // store
	        this.route = route;
	        this.rules = rules;
	        // Object to be returned. The public API.
	        // Matched param or splat names, in order
	        this.params = [];
	        // Route matching RegExp.
	        var re = route;
	        // Build route RegExp from passed string.
	        if (typeof route === "string") {
	            // Escape special chars.
	            re = re.replace(reEscape, "\\$&");
	            // Replace any :param or *splat with the appropriate capture group.
	            re = re.replace(reParam, function (_, mode, name) {
	                _this.params.push(name);
	                // :param should capture until the next / or EOL, while *splat should
	                // capture until the next :param, *splat, or EOL.
	                return mode === ":" ? "([^/]*)" : "(.*)";
	            });
	            // Add ^/$ anchors and create the actual RegExp.
	            re = new RegExp("^" + re + "$");
	            // Match the passed url against the route, returning an object of params
	            // and values.
	            this.parse = function (url) {
	                var i = 0;
	                var param, value;
	                var params = {};
	                var matches = url.match(re);
	                // If no matches, return null.
	                if (!matches) {
	                    return null;
	                }
	                // Add all matched :param / *splat values into the params object.
	                while (i < _this.params.length) {
	                    param = _this.params[i++];
	                    value = matches[i];
	                    // If a rule exists for this param and it doesn't validate, return null.
	                    if (rules && param in rules && !_this.validateRule(rules[param], value)) {
	                        return null;
	                    }
	                    params[param] = value;
	                }
	                return params;
	            };
	            // Build path by inserting the given params into the route.
	            this.stringify = function (params) {
	                params = params || {};
	                var param, re;
	                var result = route;
	                // Insert each passed param into the route string. Note that this loop
	                // doesn't check .hasOwnProperty because this script doesn't support
	                // modifications to Object.prototype.
	                for (param in params) {
	                    re = new RegExp("[:*]" + param + "\\b");
	                    result = result.replace(re, params[param]);
	                }
	                // Missing params should be replaced with empty string.
	                return result.replace(reParam, "");
	            };
	        }
	        else {
	            // RegExp route was passed. This is super-simple.
	            this.parse = function (url) {
	                var matches = url.match(re);
	                return matches && { captures: matches.slice(1) };
	            };
	            // There's no meaningful way to stringify based on a RegExp route, so
	            // return empty string.
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
	        // check for conflicting rules
	        if (other.rules) {
	            if (this.rules) {
	                Object.keys(this.rules).forEach(function (rule) {
	                    if (other.rules.hasOwnProperty(rule)) {
	                        Utils_1.throwError("route '{0}' and '{1}' have conflicting rule '{2}", a, b, rule);
	                    }
	                });
	                rules = Utils_1.extend(this.rules, Utils_1.extend(other.rules, {}));
	            }
	            else {
	                rules = Utils_1.extend(other.rules, {});
	            }
	        }
	        else if (this.rules) {
	            rules = Utils_1.extend(this.rules, {});
	        }
	        if (a === "/")
	            a = "";
	        return new RouteMatcher(a + "/" + b, rules);
	    };
	    // Test to see if a value matches the corresponding rule.
	    RouteMatcher.prototype.validateRule = function (rule, value) {
	        // For a given rule, get the first letter of the string name of its
	        // constructor function. "R" -> RegExp, "F" -> Function (these shouldn't
	        // conflict with any other types one might specify). Note: instead of
	        // getting .toString from a new object {} or Object.prototype, I'm assuming
	        // that exports will always be an object, and using its .toString method.
	        // Bad idea? Let me know by filing an issue
	        var type = this.toString.call(rule).charAt(8);
	        // If regexp, match. If function, invoke. Otherwise, compare. Note that ==
	        // is used because type coercion is needed, as `value` will always be a
	        // string, but `rule` might not.
	        return type === "R" ? rule.test(value) : type === "F" ? rule(value) : rule == value;
	    };
	    return RouteMatcher;
	})();
	exports.RouteMatcher = RouteMatcher;
	function route(route, rules) {
	    return new RouteMatcher(route, rules);
	}
	exports.route = route;
	//# sourceMappingURL=RouteMatcher.js.map

/***/ },
/* 47 */
/***/ function(module, exports, __webpack_require__) {

	/// <reference path="../Interfaces.ts" />
	var ScheduledSubject_1 = __webpack_require__(30);
	// ReactiveUI's MessageBus
	"use strict";
	var MessageBus = (function () {
	    function MessageBus() {
	        //////////////////////////////////
	        // Implementation
	        this.messageBus = {};
	        this.schedulerMappings = {};
	    }
	    //////////////////////////////////
	    // IMessageBus
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
	            ret = ScheduledSubject_1.createScheduledSubject(this.getScheduler(contract), null, new Rx.BehaviorSubject(undefined));
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
	exports.default = MessageBus;
	//# sourceMappingURL=MessageBus.js.map

/***/ },
/* 48 */
/***/ function(module, exports, __webpack_require__) {

	exports.version = '0.9.87';
	//# sourceMappingURL=Version.js.map

/***/ },
/* 49 */
/***/ function(module, exports, __webpack_require__) {

	/// <reference path="./Interfaces.ts" />
	var Utils_1 = __webpack_require__(5);
	var IID_1 = __webpack_require__(10);
	var ScheduledSubject_1 = __webpack_require__(30);
	var Reflect_1 = __webpack_require__(6);
	var Injector_1 = __webpack_require__(4);
	var res = __webpack_require__(11);
	"use strict";
	var RxObsConstructor = Rx.Observable; // this hack is neccessary because the .d.ts for RxJs declares Observable as an interface)
	/**
	* Creates an read-only observable property with an optional default value from the current (this) observable
	* (Note: This is the equivalent to Knockout's ko.computed)
	* @param {T} initialValue? Optional initial value, valid until the observable produces a value
	*/
	function toProperty(initialValue, scheduler) {
	    scheduler = scheduler || Rx.Scheduler.currentThread;
	    // initialize accessor function (read-only)
	    var accessor = function propertyAccessor(newVal) {
	        if (arguments.length > 0) {
	            Utils_1.throwError("attempt to write to a read-only observable property");
	        }
	        if (accessor.sub == null) {
	            accessor.sub = accessor._source.connect();
	        }
	        return accessor.value;
	    };
	    Reflect_1.Implements(IID_1.default.IObservableProperty)(accessor);
	    Reflect_1.Implements(IID_1.default.IDisposable)(accessor);
	    //////////////////////////////////
	    // IDisposable implementation
	    accessor.dispose = function () {
	        if (accessor.sub) {
	            accessor.sub.dispose();
	            accessor.sub = null;
	        }
	    };
	    //////////////////////////////////
	    // IObservableProperty<T> implementation
	    accessor.value = initialValue;
	    // setup observables
	    accessor.changedSubject = new Rx.Subject();
	    accessor.changed = accessor.changedSubject
	        .publish()
	        .refCount();
	    accessor.changingSubject = new Rx.Subject();
	    accessor.changing = accessor.changingSubject
	        .publish()
	        .refCount();
	    accessor.source = this;
	    accessor.thrownExceptions = ScheduledSubject_1.createScheduledSubject(scheduler, Injector_1.injector.get(res.app).defaultExceptionHandler);
	    //////////////////////////////////
	    // implementation
	    var firedInitial = false;
	    accessor.sub = this
	        .distinctUntilChanged()
	        .subscribe(function (x) {
	        // Suppress a non-change between initialValue and the first value
	        // from a Subscribe
	        if (firedInitial && x === accessor.value) {
	            return;
	        }
	        firedInitial = true;
	        accessor.changingSubject.onNext(x);
	        accessor.value = x;
	        accessor.changedSubject.onNext(x);
	    }, function (x) { return accessor.thrownExceptions.onNext(x); });
	    return accessor;
	}
	RxObsConstructor.prototype.toProperty = toProperty;
	RxObsConstructor.prototype.continueWith = function () {
	    var args = Utils_1.args2Array(arguments);
	    var val = args.shift();
	    var obs = undefined;
	    if (Utils_1.isRxObservable(val)) {
	        obs = val;
	    }
	    else if (Utils_1.isFunction(val)) {
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
	function install() {
	    // deliberately left blank    
	}
	exports.install = install;
	//# sourceMappingURL=RxExtensions.js.map

/***/ },
/* 50 */
/***/ function(module, exports, __webpack_require__) {

	/// <reference path="../Interfaces.ts" />
	var Utils_1 = __webpack_require__(5);
	"use strict";
	function toElementList(element) {
	    var nodes;
	    if (element instanceof Node || element instanceof HTMLElement)
	        nodes = [element];
	    else if (Array.isArray(element))
	        nodes = element;
	    else if (element instanceof NodeList)
	        nodes = Utils_1.nodeListToArray(element);
	    else
	        Utils_1.throwError("invalid argument: element");
	    var elements = nodes.filter(function (x) { return x.nodeType === 1; });
	    return elements;
	}
	function parseTimingValue(x) {
	    // it's always safe to consider only second values and omit `ms` values since
	    // getComputedStyle will always handle the conversion for us
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
	        result.prepare = Utils_1.noop;
	    }
	    result.run = function (nodes, params) {
	        return Rx.Observable.defer(function () {
	            var elements = toElementList(nodes);
	            if (elements.length === 0)
	                return Rx.Observable.return(undefined);
	            return Rx.Observable.combineLatest(elements.map(function (x) { return run(x, params); }), Utils_1.noop);
	        });
	    };
	    if (complete) {
	        result.complete = function (nodes, params) {
	            var elements = toElementList(nodes);
	            elements.forEach(function (x) { return complete(x, params); });
	        };
	    }
	    else {
	        result.complete = Utils_1.noop;
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
	            // convert into wx.IAnimationCssClassInstruction
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
	                elements.forEach(function (x) { return Utils_1.toggleCssClass.apply(null, [x, true].concat(prepToAdd)); });
	            if (prepToRemove && prepToRemove.length)
	                elements.forEach(function (x) { return Utils_1.toggleCssClass.apply(null, [x, false].concat(prepToRemove)); });
	        };
	    }
	    var runIns;
	    if (typeof run === "string") {
	        run = run.split(/\s+/).map(function (x) { return x.trim(); }).filter(function (x) { return x; });
	    }
	    if (typeof run[0] === "string") {
	        // convert into wx.IAnimationCssClassInstruction
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
	            }), Utils_1.noop);
	            // defer animation-start to avoid problems with transitions on freshly added elements 
	            Rx.Observable.timer(1).subscribe(function () {
	                if (runToAdd && runToAdd.length)
	                    elements.forEach(function (x) { return Utils_1.toggleCssClass.apply(null, [x, true].concat(runToAdd)); });
	                if (runToRemove && runToRemove.length)
	                    elements.forEach(function (x) { return Utils_1.toggleCssClass.apply(null, [x, false].concat(runToRemove)); });
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
	            // convert into wx.IAnimationCssClassInstruction
	            completeIns = complete.map(function (x) { return { css: x, add: true }; });
	        }
	        else {
	            completeIns = complete;
	        }
	        completeToAdd = completeIns.filter(function (x) { return x.add; }).map(function (x) { return x.css; });
	        completeToRemove = completeIns.filter(function (x) { return !x.add || x.remove; }).map(function (x) { return x.css; });
	    }
	    else {
	        // default to remove classes added during prepare & run stages
	        completeToRemove = [];
	        if (prepToAdd && prepToAdd.length)
	            completeToRemove = completeToRemove.concat(prepToAdd);
	        if (runToAdd && runToAdd.length)
	            completeToRemove = completeToRemove.concat(runToAdd);
	    }
	    result.complete = function (nodes, params) {
	        var elements = toElementList(nodes);
	        if (completeToAdd && completeToAdd.length)
	            elements.forEach(function (x) { return Utils_1.toggleCssClass.apply(null, [x, true].concat(completeToAdd)); });
	        if (completeToRemove && completeToRemove.length)
	            elements.forEach(function (x) { return Utils_1.toggleCssClass.apply(null, [x, false].concat(completeToRemove)); });
	    };
	    return result;
	}
	function animation() {
	    var args = Utils_1.args2Array(arguments);
	    var val = args.shift();
	    if (typeof val === "function") {
	        return scriptedAnimation(val, args.shift(), args.shift());
	    }
	    return cssTransitionAnimation(val, args.shift(), args.shift());
	}
	exports.animation = animation;
	//# sourceMappingURL=Animation.js.map

/***/ }
/******/ ])
});
;
//# sourceMappingURL=web.rx.js.map