/* jshint ignore:start */
/*
* PlatypusTS v0.0.1.4 (http://getplatypi.com)
* Copyright 2014 Platypi, LLC. All rights reserved.
*
* PlatypusTS is licensed under the GPL-3.0 found at
* http://opensource.org/licenses/GPL-3.0
*/
var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var plat;
(function (plat) {
    var __nativeIsArray = !!Array.isArray, __uids__ = {};

    function noop() {
    }

    function extend(destination) {
        var sources = [];
        for (var _i = 0; _i < (arguments.length - 1); _i++) {
            sources[_i] = arguments[_i + 1];
        }
        if (isNull(destination)) {
            return destination;
        }

        var deep = isBoolean(destination);

        if (deep) {
            destination = sources.shift();
        }

        var keys, property;

        forEach(sources, function (source, k) {
            if (!(isObject(source) || isArray(source))) {
                return;
            }

            keys = Object.keys(source);

            forEach(keys, function (key) {
                property = source[key];
                if (deep) {
                    if (isArray(property)) {
                        extend(deep, destination[key] || (destination[key] = []), property);
                        return;
                    } else if (isObject(property)) {
                        extend(deep, destination[key] || (destination[key] = {}), property);
                        return;
                    }
                }
                destination[key] = source[key];
            });
        });

        return destination;
    }

    function deepExtend(destination) {
        var sources = [];
        for (var _i = 0; _i < (arguments.length - 1); _i++) {
            sources[_i] = arguments[_i + 1];
        }
        return extend.apply(null, [true, destination].concat(sources));
    }

    function isObject(obj) {
        return obj != null && typeof obj === 'object';
    }

    function isWindow(obj) {
        return !!(obj && obj.document && obj.setInterval);
    }

    function isDocument(obj) {
        return !!(obj && obj.nodeType === Node.DOCUMENT_NODE);
    }

    function isNode(obj) {
        return !!(obj && typeof obj.nodeType === 'number');
    }

    function isString(obj) {
        return typeof obj === 'string';
    }

    function isRegExp(obj) {
        return Object.prototype.toString.call(obj) === '[object RegExp]';
    }

    function isEmpty(obj) {
        if (isNull(obj)) {
            return true;
        }

        if (isString(obj) || isArray(obj)) {
            return obj.length === 0;
        }

        if (!isObject(obj)) {
            return false;
        }

        return Object.keys(obj).length === 0;
    }

    function isBoolean(obj) {
        return typeof obj === 'boolean';
    }

    function isNumber(obj) {
        return typeof obj === 'number' && !isNaN(obj);
    }

    function isFunction(obj) {
        return typeof obj === 'function';
    }

    function isNull(obj) {
        return obj === null || obj === undefined;
    }

    function isUndefined(obj) {
        return obj === undefined;
    }

    function isArray(obj) {
        if (__nativeIsArray) {
            return Array.isArray(obj);
        }

        return Object.prototype.toString.call(obj) === '[object Array]';
    }

    function isArrayLike(obj) {
        if (isNull(obj) || isWindow(obj) || isFunction(obj)) {
            return false;
        }

        return isString(obj) || obj.length >= 0;
    }

    function filter(obj, iterator, context) {
        var arr = [];
        if (isNull(obj)) {
            return arr;
        }

        if (isFunction(obj.filter)) {
            return obj.filter(iterator, context);
        }

        forEach(obj, function (value, key, obj) {
            if (iterator(value, key, obj)) {
                arr.push(value);
            }
        });

        return arr;
    }

    function where(obj, properties) {
        return filter(obj, function (value) {
            return !some(properties, function (property, key) {
                return value[key] !== property;
            });
        });
    }

    function forEach(obj, iterator, context) {
        if (isNull(obj)) {
            return obj;
        }
        var i, key, length;

        if (isFunction(obj.forEach)) {
            return obj.forEach(iterator, context);
        } else if (isArrayLike(obj)) {
            for (i = 0, length = obj.length; i < length; ++i) {
                iterator.call(context, obj[i], i, obj);
            }
        } else {
            for (key in obj) {
                if (obj.hasOwnProperty(key)) {
                    iterator.call(context, obj[key], key, obj);
                }
            }
        }

        return obj;
    }

    function map(obj, iterator, context) {
        var arr = [];
        if (isNull(obj)) {
            return arr;
        }

        if (isFunction(obj.map)) {
            return obj.map(iterator, context);
        }

        forEach(obj, function (value, key) {
            arr.push(iterator.call(this, value, key, obj));
        }, context);

        return arr;
    }

    function pluck(obj, key) {
        return map(obj, function (value) {
            return value[key];
        });
    }

    function some(obj, iterator, context) {
        if (isNull(obj)) {
            return false;
        }
        var i, key, length, ret;

        if (isFunction(obj.some)) {
            return obj.some(iterator, context);
        } else if (isArrayLike(obj)) {
            for (i = 0, length = obj.length; i < length; ++i) {
                ret = iterator.call(context, obj[i], i, obj);
                if (ret === true) {
                    return true;
                }
            }
        } else {
            for (key in obj) {
                if (obj.hasOwnProperty(key)) {
                    ret = iterator.call(context, obj[key], key, obj);
                    if (ret === true) {
                        return true;
                    }
                }
            }
        }

        return false;
    }

    function postpone(method, args, context) {
        return defer(method, 0, args, context);
    }

    function defer(method, timeout, args, context) {
        function defer() {
            method.apply(context, args);
        }

        var timeoutId = setTimeout(defer, timeout);

        return function clearDefer() {
            clearTimeout(timeoutId);
        };
    }

    function uniqueId(prefix) {
        if (isNull(prefix)) {
            prefix = '';
        }

        var puid = __uids__[prefix];

        if (isNull(puid)) {
            puid = __uids__[prefix] = ['0', '/'];
        }

        var index = puid.length, char;

        while (index--) {
            char = puid[index].charCodeAt(0);

            //'9'
            if (char === 57) {
                puid[index] = 'A';
                return join();
            }

            //'Z'
            if (char === 90) {
                puid[index] = 'a';
                return join();
            }

            //'z'
            if (char === 122) {
                puid[index] = '0';
            } else {
                puid[index] = String.fromCharCode(char + 1);
                return join();
            }
        }

        puid.unshift('0');

        function join() {
            return prefix + puid.join('');
        }

        return join();
    }

    function camelCase(str) {
        if (!isString(str) || isEmpty(str)) {
            return str;
        }

        str = str.charAt(0).toLowerCase() + str.substr(1);
        var regex = acquire('$regex');

        return str.replace(regex.camelCaseRegex, function delimiterMatch(match, delimiter, char, index) {
            return index ? char.toUpperCase() : char;
        });
    }

    /**
    * An IInjectorObject of plat.IControls. Contains all the registered
    * controls for an application.
    */
    var controlInjectors = {};

    /**
    * An IInjectorObject of plat.ui.IViewControls. Contains all the registered
    * view controls for an application.
    */
    var viewControlInjectors = {};

    /**
    * An IInjectorObject of objects. Contains all the registered
    * injectables for an application.
    */
    var injectableInjectors = {};

    /**
    * An IInjectorObject of static objects. Contains all the registered
    * static injectables for an application.
    */
    var staticInjectors = {};

    (function (register) {
        /**
        * Generic function for creating an Injector and adding it to an IInjectorObject.
        *
        * @param obj The IInjectorObject to which to add an Injector.
        * @param name The name used to set/get the Injector from the IInjectorObject.
        * @param dependencies An array of strings representing the dependencies needed for the
        * injector.
        * @param Constructor The Constructor for the Injector.
        *
        * @return {register} The object that contains the register methods (for method chaining).
        */
        function add(obj, name, Constructor, dependencies, type) {
            var injector = obj[name] = new dependency.Injector(name, Constructor, dependencies, type);

            if (type === register.injectableType.STATIC) {
                staticInjectors[name] = injector;
            }

            return register;
        }

        /**
        * Registers the IApp with the framework. The framework will instantiate the IApp when needed, and wire up
        * the Application Lifecycle Management (ALM) events. The dependencies array corresponds to injectables that will be
        * passed into the Constructor of the app. The app constructor arguments must all be optional
        * (denoted with a ? after the declaration), as they are potentially null.
        *
        * @param name The name of your app.
        * @param dependencies An array of strings representing the dependencies needed for the app injector.
        * @param Constructor The constructor for the IApp.
        * @return {IApp} The newly created app
        */
        function app(name, Constructor, dependencies) {
            var app = new dependency.Injector(name, Constructor, dependencies);
            App.registerApp(app);
            return app;
        }
        register.app = app;

        /**
        * Registers a IControl with the framework. The framework will instantiate the IControl when needed. The
        * dependencies array corresponds to injectables that will be passed into the Constructor of the control. The control
        * constructor arguments must all be optional (denoted with a ? after the declaration), as they are potentially null.
        *
        * @param type The type, corresponding to the HTML notation for creating a new IControl (e.g. 'plat-foreach').
        * @param Constructor The constructor for the IControl.
        * @param dependencies An array of strings representing the dependencies needed for the IControl injector.
        *
        * @return {register} The object that contains the register methods (for method chaining).
        *
        * @example register.control('plat-tap', [plat.expressions.Parser], export function(parser: plat.expressions.IParser) { ... });
        */
        function control(type, Constructor, dependencies) {
            return add(controlInjectors, type, Constructor, dependencies);
        }
        register.control = control;

        /**
        * Registers a IControl with the framework. The framework will instantiate the IControl when needed. The
        * dependencies array corresponds to injectables that will be passed into the Constructor of the control. The control
        * constructor arguments must all be optional (denoted with a ? after the declaration), as they are potentially null.
        *
        * @param type The type, corresponding to the HTML notation for creating a new IControl (e.g. 'plat-foreach').
        * @param Constructor The constructor for the IControl.
        * @param dependencies An optional array of strings representing the dependencies needed for the IControl injector.
        * @param routes Optional route strings (or regular expressions) used for matching a URL to the registered ViewControl.
        *
        * @return {register} The object that contains the register methods (for method chaining).
        *
        * @example register.viewControl('my-view-control', MyViewControl, null, ['customers/:customer(/:ordernumber)']);
        */
        function viewControl(type, Constructor, dependencies, routes) {
            var ret = add(viewControlInjectors, type, Constructor, dependencies, type);

            if (isArray(routes)) {
                var router = acquire('$router');
                router.registerRoutes(type, routes);
            }

            return ret;
        }
        register.viewControl = viewControl;

        

        
        function injectable(name, Constructor, dependencies, type) {
            return add(injectableInjectors, name, Constructor, dependencies, type || register.injectableType.SINGLE);
        }
        register.injectable = injectable;

        /**
        * Defines the different types of injectables.
        */
        register.injectableType = {
            /**
            * Static injectables will be injected before the application loads. This provides a way to create
            * a static constructor and load dependencies into static class properties.
            */
            STATIC: 'static',
            /**
            * Single injectables will contain a constructor. A single injectable will be instantiated once and
            * used throughout the application lifetime. It will be instantiated when another component is injected
            * and lists it as a dependency.
            */
            SINGLE: 'single',
            /**
            * Multi injectables will contain a constructor. A multi injectable will be instantiated multiple times
            * throughout the application lifetime. It will be instantiated whenever another component is injected
            * and lists it as a dependency.
            */
            MULTI: 'multi'
        };
    })(plat.register || (plat.register = {}));
    var register = plat.register;
    (function (_dependency) {
        /**
        * The Injector class is used for dependency injection. You can create an injector object,
        * specify dependencies and a constructor for your component. When the injector object is
        * 'injected' it will create a new instance of your component and pass in the dependencies
        * to the constructor.
        */
        var Injector = (function () {
            /**
            * @param dependencies An array of strings specifying the injectable dependencies for the
            * associated constructor.
            * @param Constructor The constructor method for the component requiring the dependency
            * injection.
            * @param type The type of injector, used for injectables specifying a register.injectableType of
            * STATIC, SINGLE, or MULTI. The default is SINGLE.
            */
            function Injector(__name, Constructor, dependencies, type) {
                this.__name = __name;
                this.Constructor = Constructor;
                this.type = type;
                this.__dependencies = Injector.convertDependencies(dependencies);
            }
            Injector.initialize = function () {
                var injectors = staticInjectors, keys = Object.keys(injectors), length = keys.length;

                for (var i = 0; i < length; ++i) {
                    injectors[keys[i]].inject();
                }

                staticInjectors = {};
            };

            Injector.getDependencies = function (dependencies) {
                if (isNull(dependencies) || isEmpty(dependencies)) {
                    return [];
                }

                var deps = [], length = dependencies.length, dependency;

                for (var i = 0; i < length; ++i) {
                    dependency = dependencies[i];
                    if (isNull(dependency)) {
                        deps.push(Injector.__noop());
                        continue;
                    } else if (Injector.__isInjector(dependency)) {
                        return dependencies;
                    }

                    deps.push(Injector.__locateInjector(dependency));
                }

                return deps;
            };

            Injector.convertDependencies = function (dependencies) {
                if (!isArray(dependencies)) {
                    return [];
                }
                var deps = [], length = dependencies.length, dependency, injector;

                for (var i = 0; i < length; ++i) {
                    dependency = dependencies[i];

                    if (isNull(dependency)) {
                        deps.push('noop');
                        continue;
                    }

                    deps.push(Injector.__getInjectorName(dependency));
                }

                return deps;
            };

            Injector.__getInjectorName = function (dependency) {
                if (isNull(dependency)) {
                    return 'noop';
                } else if (isString(dependency)) {
                    return dependency;
                } else if (dependency === window) {
                    return '$window';
                } else if (dependency === window.document) {
                    return '$document';
                }

                var injectors = injectableInjectors, injector, keys = Object.keys(injectors), length = keys.length, key, value;

                for (var i = 0; i < length; ++i) {
                    key = keys[i];
                    injector = injectors[key];

                    value = injector.Constructor;

                    if (value === dependency) {
                        return key;
                    }
                }

                return 'noop';
            };

            Injector.__construct = function (Constructor, args, pattern) {
                if (isNull(Constructor) || isNull(Constructor.prototype)) {
                    return Constructor;
                }
                var obj = Object.create(Constructor.prototype), ret = obj.constructor.apply(obj, args);

                if (!isUndefined(ret)) {
                    return ret;
                }

                return obj;
            };

            Injector.__locateInjector = function (Constructor) {
                if (isNull(Constructor)) {
                    return;
                } else if (isString(Constructor)) {
                    return injectableInjectors[Constructor];
                } else if (Constructor === window) {
                    return injectableInjectors['$window'];
                } else if (Constructor === window.document) {
                    return injectableInjectors['$document'];
                }

                var injectors = injectableInjectors, injector, keys = Object.keys(injectors), length = keys.length, value;

                for (var i = 0; i < length; ++i) {
                    injector = injectors[keys[i]];

                    if (injector.Constructor === Constructor) {
                        return injector;
                    }
                }

                return Injector.__wrap(Constructor);
            };

            Injector.__wrap = function (value) {
                return {
                    inject: function () {
                        return value;
                    },
                    __name: 'wrapped',
                    dependencies: [],
                    Constructor: value
                };
            };

            Injector.__noop = function () {
                return {
                    inject: noop,
                    type: 'noop',
                    __name: 'noop',
                    __dependencies: [],
                    Constructor: noop
                };
            };

            Injector.__isInjector = function (dependency) {
                return isFunction(dependency.inject) && !isUndefined(dependency.type) && !isUndefined(dependency.__name) && !isUndefined(dependency.Constructor);
            };

            /**
            * Gathers the dependencies for the Injector object and creates a new instance of the
            * Constructor, passing in the dependencies in the order they were specified. If the
            * Injector contains a Constructor for an injectable it will only inject that injectable
            * once.
            */
            Injector.prototype.inject = function () {
                var toInject = [];

                this.__dependencies = Injector.getDependencies(this.__dependencies);

                var dependencies = this.__dependencies || [], length = dependencies.length, dependency, injectable;

                for (var i = 0; i < length; ++i) {
                    toInject.push(dependencies[i].inject());
                }

                injectable = Injector.__construct(this.Constructor, toInject, this.type);

                if (this.type === register.injectableType.SINGLE || this.type === register.injectableType.STATIC) {
                    this._wrapInjector(injectable);
                }

                return injectable;
            };
            Injector.prototype._wrapInjector = function (value) {
                return injectableInjectors[this.__name] = {
                    type: this.type,
                    __name: this.__name,
                    dependencies: this.__dependencies,
                    Constructor: this.Constructor,
                    inject: function () {
                        return value;
                    }
                };
            };
            return Injector;
        })();
        _dependency.Injector = Injector;

        

        
    })(plat.dependency || (plat.dependency = {}));
    var dependency = plat.dependency;

    

    
    function acquire(dependencies) {
        var deps, array = isArray(dependencies);

        if (array) {
            deps = dependency.Injector.getDependencies(dependencies);
        } else {
            deps = dependency.Injector.getDependencies([dependencies]);
        }

        var length = deps.length, output = [];

        for (var i = 0; i < length; ++i) {
            output = deps[i].inject();
        }

        if (array) {
            return output[0];
        }

        return output;
    }
    plat.acquire = acquire;

    

    var Exception = (function () {
        function Exception() {
        }
        /**
        * Method for sending a warning to all listeners. Will
        * not throw an error.
        *
        * @param message The message to be sent to the listeners.
        * @param type Denotes the type of fatal exception.
        */
        Exception.warn = function (message, type) {
            raise(message, type, false);
        };

        Exception.fatal = function (message, type) {
            raise(message, type, true);
        };
        Exception.PARSE = 0;
        Exception.COMPILE = 1;
        Exception.BIND = 2;
        Exception.NAME = 3;
        Exception.NAVIGATION = 4;
        Exception.TEMPLATE = 5;
        Exception.AJAX = 6;
        Exception.CONTEXT = 7;
        Exception.EVENT = 8;
        Exception.INJECTABLE = 9;
        Exception.COMPAT = 10;
        return Exception;
    })();
    plat.Exception = Exception;

    function ExceptionStatic() {
        return Exception;
    }
    plat.ExceptionStatic = ExceptionStatic;

    register.injectable('$ExceptionStatic', ExceptionStatic, null, register.injectableType.STATIC);

    function PlatException(message, name) {
        this.message = message;
        this.name = name;
    }

    function PlatError(message) {
        this.message = message || '';
        this.name = 'PlatError';
    }

    function setPrototypes(platError) {
        PlatError.prototype = platError || Error.prototype;
        PlatException.prototype = new PlatError();
    }

    function raise(message, type, isFatal) {
        var error;

        if (message instanceof Error) {
            setPrototypes(Object.getPrototypeOf(message));
        } else if (PlatError.prototype !== Error.prototype) {
            setPrototypes();
        }
        error = new PlatException(message, '');
        switch (type) {
            case Exception.PARSE:
                error.name = 'ParsingError';
                break;
            case Exception.BIND:
                error.name = 'BindingError';
                break;
            case Exception.COMPILE:
                error.name = 'CompilingError';
                break;
            case Exception.NAME:
                error.name = 'PlatNameError';
                break;
            case Exception.NAVIGATION:
                error.name = 'NavigatingError';
                break;
            case Exception.TEMPLATE:
                error.name = 'TemplatingError';
                break;
            case Exception.CONTEXT:
                error.name = 'ContextError';
                break;
            case Exception.EVENT:
                error.name = 'DispatchEventError';
                break;
            case Exception.INJECTABLE:
                error.name = 'InjectableError';
                break;
            case Exception.COMPAT:
                error.name = 'CompatibilityError';
                break;
            default:
                error = new PlatError(message);
                break;
        }

        if (message instanceof Error) {
            var temp = message, properties = Object.getOwnPropertyNames(message), length = properties.length;

            error.message = '';
            error = Object.create(error);

            for (var i = 0; i < length; ++i) {
                error[properties[i]] = message[properties[i]];
            }
        }
        var ErrorEvent = acquire('$ErrorEventStatic');

        ErrorEvent.dispatch('error', Exception, error);

        if (isFatal) {
            throw error;
        }
    }

    /**
    * A class for checking browser compatibility issues.
    */
    var Compat = (function () {
        function Compat() {
            var contextManager = acquire('$ContextManagerStatic'), $window = acquire('$window'), define = contextManager.defineGetter, def = $window['define'], msA = $window['MSApp'];

            define(this, 'cordova', !isNull($window['cordova']));
            define(this, 'pushState', !isNull($window.history.pushState));
            define(this, 'amd', isFunction(def) && !isNull(def.amd));
            define(this, 'msApp', isObject(msA) && isFunction(msA.execUnsafeLocalFunction));
            define(this, 'indexedDb', !isNull($window.indexedDB));
            define(this, 'proto', isObject({}.__proto__));
            define(this, 'getProto', isFunction(Object.getPrototypeOf));
            define(this, 'setProto', isFunction(Object.setPrototypeOf));
        }
        Object.defineProperty(Compat.prototype, "isCompatible", {
            /**
            * Determines if the browser is modern enough to correctly
            * run PlatypusTS.
            */
            get: function () {
                var $document = acquire('$document');

                return isFunction(Object.defineProperty) && isFunction($document.querySelector);
            },
            enumerable: true,
            configurable: true
        });
        return Compat;
    })();
    plat.Compat = Compat;

    register.injectable('$compat', Compat);

    

    var Utils = (function () {
        function Utils() {
        }
        /**
        * An empty method for quickly creating dummy objects.
        */
        Utils.prototype.noop = function () {
        };

        /**
        * Allows you to extend the properties of an object with any number
        * of other objects. If objects share properties, the last object in the
        * arguments will take precedence. This method is only a shallow copy of
        * all the source objects to the destination object.
        *
        * @param destination The destination object to extend.
        * @param ...sources[] Any number of objects with which to extend the
        * destination object.
        * @return {any} The extended destination object.
        */
        Utils.prototype.extend = function (destination) {
            var sources = [];
            for (var _i = 0; _i < (arguments.length - 1); _i++) {
                sources[_i] = arguments[_i + 1];
            }
            return extend.apply(null, [destination].concat(sources));
        };

        /**
        * Allows you to extend the properties of an object with any number
        * of other objects. If objects share properties, the last object in the
        * arguments will take precedence. This method is a deep copy of
        * all the source objects to the destination object.
        *
        * @param destination The destination object to extend.
        * @param ...sources[] Any number of objects with which to extend the
        * destination object.
        * @return {any} The extended destination object.
        */
        Utils.prototype.deepExtend = function (destination) {
            var sources = [];
            for (var _i = 0; _i < (arguments.length - 1); _i++) {
                sources[_i] = arguments[_i + 1];
            }
            return extend.apply(null, [true, destination].concat(sources));
        };

        /**
        * Takes in anything and determines if it is a type of Object.
        *
        * @param obj Anything.
        * @return {boolean} True if obj is an object, false otherwise.
        */
        Utils.prototype.isObject = function (obj) {
            return isObject(obj);
        };

        /**
        * Takes in anything and determines if it is a window object.
        *
        * @param obj Anything.
        * @return {boolean} True if obj is the window, false otherwise.
        */
        Utils.prototype.isWindow = function (obj) {
            return isWindow(obj);
        };

        /**
        * Takes in anything and determines if it is a document object.
        *
        * @param obj Anything.
        * @return {boolean} True if obj is the document, false otherwise.
        */
        Utils.prototype.isDocument = function (obj) {
            return isDocument(obj);
        };

        /**
        * Takes in anything and determines if it is a Node.
        *
        * @param obj Anything.
        * @return {boolean} True if obj is a Node, false otherwise.
        */
        Utils.prototype.isNode = function (obj) {
            return isNode(obj);
        };

        /**
        * Takes in anything and determines if it is a string.
        *
        * @param obj Anything.
        * @return {boolean} True if obj is a string, false otherwise.
        */
        Utils.prototype.isString = function (obj) {
            return isString(obj);
        };

        /**
        * Takes in anything and determines if it is a RegExp object.
        *
        * @param obj Anything.
        * @return {boolean} True if obj is a RegExp object, false otherwise.
        */
        Utils.prototype.isRegExp = function (obj) {
            return isRegExp(obj);
        };

        /**
        * Takes in anything and determines if it is empty. Useful for
        * checking for empty strings, arrays, or objects without keys.
        *
        * @param obj Anything.
        * @return {boolean} True if the object isEmpty (or null/undefined),
        * false otherwise.
        */
        Utils.prototype.isEmpty = function (obj) {
            return isEmpty(obj);
        };

        /**
        * Takes in anything and determines if it is a boolean.
        *
        * @param obj Anything.
        * @return {boolean} True if obj is a boolean, false otherwise.
        */
        Utils.prototype.isBoolean = function (obj) {
            return isBoolean(obj);
        };

        /**
        * Takes in anything and determines if it is a number.
        *
        * @param obj Anything.
        * @return {boolean} True if obj is a number, false otherwise.
        */
        Utils.prototype.isNumber = function (obj) {
            return isNumber(obj);
        };

        /**
        * Takes in anything and determines if it is a function.
        *
        * @param obj Anything.
        * @return {boolean} True if obj is a function, false otherwise.
        */
        Utils.prototype.isFunction = function (obj) {
            return isFunction(obj);
        };

        /**
        * Takes in anything and determines if it is null or undefined.
        *
        * @param obj Anything.
        * @return {boolean} True if obj is null or undefined, false otherwise.
        */
        Utils.prototype.isNull = function (obj) {
            return isNull(obj);
        };

        /**
        * Takes in anything and determines if it is undefined.
        *
        * @param obj Anything.
        * @return {boolean} True if obj is undefined, false otherwise.
        */
        Utils.prototype.isUndefined = function (obj) {
            return isUndefined(obj);
        };

        /**
        * Takes in anything and determines if it is an Array.
        *
        * @param obj Anything.
        * @return {boolean} True if obj is an Array, false otherwise.
        */
        Utils.prototype.isArray = function (obj) {
            return isArray(obj);
        };

        /**
        * Takes in anything and determines if it has array-like qualities.
        *
        * @param obj Anything.
        * @return {boolean} True if obj has array-like qualities (i.e. it is an
        * Array, string, arguments, or NodeList), false otherwise.
        */
        Utils.prototype.isArrayLike = function (obj) {
            return isArrayLike(obj);
        };

        Utils.prototype.filter = function (obj, iterator, context) {
            return filter(obj, iterator, context);
        };

        Utils.prototype.where = function (obj, properties) {
            return where(obj, properties);
        };

        Utils.prototype.forEach = function (obj, iterator, context) {
            return forEach(obj, iterator, context);
        };

        Utils.prototype.map = function (obj, iterator, context) {
            return map(obj, iterator, context);
        };

        /**
        * Takes in an object and a property to extract from all of the object's values. Returns an array of
        * the 'plucked' values.
        *
        * @param obj An object.
        * @param key The property to 'pluck' from each value in obj.
        * @return {Array<U>} An array of 'plucked' values from obj.
        */
        Utils.prototype.pluck = function (obj, key) {
            return map(obj, function (value) {
                return value[key];
            });
        };

        Utils.prototype.some = function (obj, iterator, context) {
            return some(obj, iterator, context);
        };

        /**
        * Takes in a method and array of arguments to pass to that method. Delays calling the method until
        * after the current call stack is clear. Equivalent to a setTimeout with a timeout of 0.
        *
        * @param method The method to call.
        * @param args The arguments to apply to the method.
        * @param context An optional context to bind to the method.
        * @return {() => void} A function that will clear the timeout when called.
        */
        Utils.prototype.postpone = function (method, args, context) {
            return defer(method, 0, args, context);
        };

        /**
        * Takes in a method and array of arguments to pass to that method. Delays calling the method until
        * after the current call stack is clear. Equivalent to a setTimeout with a timeout of 0.
        *
        * @param method The method to call.
        * @param timeout The time (in milliseconds) to delay before calling the provided method
        * @param args The arguments to apply to the method.
        * @param context An optional context to bind to the method.
        * @return {() => void} A function that will clear the timeout when called.
        */
        Utils.prototype.defer = function (method, timeout, args, context) {
            return defer(method, timeout, args, context);
        };

        /**
        * Takes in a prefix and returns a unique identifier string with the prefix preprended. If no prefix
        * is specified, none will be prepended.
        *
        * @param prefix A string prefix to prepend tothe unique ID.
        * @return {string} The prefix-prepended unique id.
        */
        Utils.prototype.uniqueId = function (prefix) {
            return uniqueId(prefix);
        };

        /**
        * Takes in a spinal-case, dot.case, or snake_case string and returns
        * a camelCase string. Also can turn a string into camelCase with space
        * as a delimeter.
        *
        * @param str The spinal-case, dot.case, or snake_case string
        * @return {string} The camelCase string
        *
        * @example camelCase('plat-options'); // returns 'platOptions'
        */
        Utils.prototype.camelCase = function (str) {
            return camelCase(str);
        };
        return Utils;
    })();
    plat.Utils = Utils;

    register.injectable('$utils', Utils);

    function WindowStatic() {
        return window;
    }
    plat.WindowStatic = WindowStatic;

    register.injectable('$window', WindowStatic, null, register.injectableType.STATIC);

    function DocumentStatic(window) {
        return window.document;
    }
    plat.DocumentStatic = DocumentStatic;

    register.injectable('$document', DocumentStatic, ['$window'], register.injectableType.STATIC);

    (function (expressions) {
        var Regex = (function () {
            function Regex() {
            }
            Object.defineProperty(Regex.prototype, "newLineRegex", {
                /**
                * The regular expression for matching or removing all newline characters.
                */
                get: function () {
                    return /\n|\r/g;
                },
                enumerable: true,
                configurable: true
            });

            Object.defineProperty(Regex.prototype, "markupRegex", {
                /**
                * The regular expression for finding markup in a string.
                */
                get: function () {
                    return /{{[\S\s]*}}/;
                },
                enumerable: true,
                configurable: true
            });

            Object.defineProperty(Regex.prototype, "argumentRegex", {
                /**
                * Finds the arguments in a method expression
                *
                * @example
                *   // outputs ["('foo', 'bar', 'baz')", "'foo', 'bar', 'baz'"]
                *   exec("myFunction('foo', 'bar', 'baz')");
                */
                get: function () {
                    return /\((.*)\)/;
                },
                enumerable: true,
                configurable: true
            });

            Object.defineProperty(Regex.prototype, "aliasRegex", {
                /**
                * Given a string, finds the root alias name if that string is an
                * alias path.
                *
                * @example
                *   // outputs ['context']
                *   exec('@context.foo');
                *
                * @example
                *   // outputs null
                *   exec('@context');
                */
                get: function () {
                    return /[^@\.\[\(]+(?=[\.\[\(])/;
                },
                enumerable: true,
                configurable: true
            });

            Object.defineProperty(Regex.prototype, "optionalRouteRegex", {
                /**
                * Finds optional parameters in a route string.
                *
                * @example
                *   // outputs ['(/foo)', '/foo']
                *   exec('(/foo)/bar');
                *
                * @example
                *  // outputs ['(/foo)', '/foo']
                *  exec('(/foo))');
                */
                get: function () {
                    return /\((.*?)\)/g;
                },
                enumerable: true,
                configurable: true
            });

            Object.defineProperty(Regex.prototype, "namedParameterRouteRegex", {
                /**
                * Finds named parameters in a route string.
                *
                * @example
                *   // outputs [':foo']
                *   exec('/:foo/bar')
                *
                *   // outputs [':foo']
                *   exec('(/:foo)/bar');
                */
                get: function () {
                    return /(\(\?)?:\w+/g;
                },
                enumerable: true,
                configurable: true
            });

            Object.defineProperty(Regex.prototype, "wildcardRouteRegex", {
                /**
                * Finds an alphanumeric wildcard match in a route string.
                *
                * @example
                *   // outputs ['*bar']
                *   exec('/foo/*bar/baz')
                */
                get: function () {
                    return /\*\w*/g;
                },
                enumerable: true,
                configurable: true
            });

            Object.defineProperty(Regex.prototype, "escapeRouteRegex", {
                /**
                * Finds invalid characters in a route string.
                *
                * @example
                *  // outputs ['?']
                *  exec('/foo/bar?query=baz');
                */
                get: function () {
                    return /[\-{}\[\]+?.,\\\^$|#\s]/g;
                },
                enumerable: true,
                configurable: true
            });

            Object.defineProperty(Regex.prototype, "initialUrlRegex", {
                /**
                * Finds '/*.html' or '/*.htm' in a url. Useful for removing
                * the html file out of the url.
                *
                * @example
                *   // outputs ['/index.html']
                *   exec('http://localhost:8080/index.html');
                */
                get: function () {
                    return /\/[^\/]*\.(?:html|htm)/;
                },
                enumerable: true,
                configurable: true
            });

            Object.defineProperty(Regex.prototype, "protocolRegex", {
                /**
                * Finds a protocol delimeter in a string (i.e. ://)
                */
                get: function () {
                    return /:\/\//;
                },
                enumerable: true,
                configurable: true
            });

            Object.defineProperty(Regex.prototype, "camelCaseRegex", {
                /**
                * Finds delimeters for spinal-case, snake_case, and dot.case.
                * useful for converting to camelCase. Also can turn a string
                * into camelCase with space as a delimeter.
                *
                * @example
                *   // outputs ['-o', '-', 'o']
                *   exec('plat-options')
                *
                * @example
                *   // outputs ['.c', '.', 'c']
                *   exec('plat.cache')
                *
                * @example
                *   // outputs ['_v', '_', 'v']
                *   exec('plat_var')
                *
                * @example
                *   // outputs [' W', ' ', 'W']
                *   exec('Hello World')
                */
                get: function () {
                    return /([\-_\.\s])(\w+?)/g;
                },
                enumerable: true,
                configurable: true
            });

            Object.defineProperty(Regex.prototype, "whiteSpaceRegex", {
                /**
                * Finds all whitespace and newline characters
                * not in string literals. Needs to be combined
                * with string replace function using $1 argument.
                */
                get: function () {
                    return /("[^"]*?"|'[^']*?')|[\s\r\n\t\v]/g;
                },
                enumerable: true,
                configurable: true
            });

            Object.defineProperty(Regex.prototype, "quotationRegex", {
                /**
                * Finds all single and double quotes.
                */
                get: function () {
                    return /'|"/g;
                },
                enumerable: true,
                configurable: true
            });

            Object.defineProperty(Regex.prototype, "invalidVariableRegex", {
                /**
                * Looks for any invalid variable syntax.
                */
                get: function () {
                    return /[^a-zA-Z0-9@_$]/;
                },
                enumerable: true,
                configurable: true
            });
            return Regex;
        })();
        expressions.Regex = Regex;

        register.injectable('$regex', Regex);

        /**
        * Responsible for taking a javascript expression string and
        * finding all its tokens (i.e. delimiters, operators, etc).
        */
        var Tokenizer = (function () {
            function Tokenizer() {
                this.$ExceptionStatic = acquire('$ExceptionStatic');
                this.__previousChar = '';
                this.__variableRegex = acquire('$regex').invalidVariableRegex;
                this.__outputQueue = [];
                this.__operatorStack = [];
                this.__argCount = [];
                this.__objArgCount = [];
                this.__lastColonChar = [];
                this.__lastCommaChar = [];
            }
            /**
            * Creates an IToken array for the Tokenizer's input string.
            * The IToken array contains all the tokens for the input string.
            *
            * @param input The expression string to tokenize.
            * return {Array<IToken>}
            */
            Tokenizer.prototype.createTokens = function (input) {
                if (isNull(input)) {
                    return [];
                }

                this._input = input;

                var char, length = input.length, ternary = 0, ternaryFound = false, isSpace = this._isSpace, isAlphaNumeric = this._isAlphaNumeric;

                for (var index = 0; index < length; index++) {
                    char = input[index];

                    //space
                    if (isSpace(char)) {
                        continue;
                    } else if (isAlphaNumeric(char)) {
                        index = this.__handleAplhaNumeric(index, char);
                    } else if (isDelimiter(char)) {
                        switch (char) {
                            case '.':
                                index = this.__handlePeriod(index, char);
                                break;
                            case '{':
                                this.__handleLeftBrace(char);
                                break;
                            case '}':
                                this.__handleRightBrace(char);
                                break;
                            case '[':
                                this.__handleLeftBracket(char);
                                break;
                            case ']':
                                this.__handleRightBracket(char);
                                break;
                            case '(':
                                this.__handleLeftParenthesis(char);
                                break;
                            case ')':
                                this.__handleRightParenthesis(char);
                                break;
                            case ',':
                                this.__handleComma(char);
                                break;
                            case '\'':
                            case '"':
                                index = this.__handleStringLiteral(index, char);
                                break;
                        }
                    } else if (isOperator(char)) {
                        switch (char) {
                            case '?':
                                ternaryFound = true;
                                ternary++;
                                this.__handleQuestion(char);
                                break;
                            case ':':
                                ternary = this.__handleColon(char, ternary);
                                break;
                            default:
                                index = this.__handleOtherOperator(index, char);
                        }
                        //semicolon throw error
                    } else if (char === ';') {
                        this._throwError('Unexpected semicolon');
                    }

                    this.__previousChar = char;
                }

                if (ternaryFound && (ternary > 0)) {
                    this._throwError('Improper ternary expression');
                } else if (this.__objArgCount.length > 0) {
                    this._throwError('Improper object literal');
                }

                this.__popRemainingOperators();
                var output = this.__outputQueue;
                this._resetTokenizer();

                return output;
            };

            // ALPHANUMERIC CASE
            Tokenizer.prototype.__handleAplhaNumeric = function (index, char) {
                var functionArr = [], isNumberLike = this._isNumeric(char);

                functionArr.push(char);

                index = this._lookAhead(index, isNumberLike, functionArr);

                var mergedValue = functionArr.join(''), outputToPush = isNumberLike ? ({ val: Number(mergedValue), args: 0 }) : ({ val: mergedValue, args: -1 });

                this.__outputQueue.push(outputToPush);

                return index;
            };

            // DELIMITER FUNCTIONS
            Tokenizer.prototype.__handlePeriod = function (index, char) {
                var functionArr = [], outputQueue = this.__outputQueue, operatorStack = this.__operatorStack, topOutputLength = outputQueue.length - 1, previousChar = this._input[index - 1];

                //if output queue is null OR space or operator or ( or , before .
                if (topOutputLength < 0 || this._isSpace(previousChar) || !isNull(OPERATORS[previousChar]) || previousChar === '(' || previousChar === ',') {
                    functionArr.push(char);
                    index = this._lookAhead(index, true, functionArr);
                    outputQueue.push({ val: parseFloat(functionArr.join('')), args: 0 });
                } else if (!(isNull(outputQueue[topOutputLength]) || !isNumber(Number(outputQueue[topOutputLength].val)) || this._isValEqual(outputQueue[topOutputLength - 1], char))) {
                    functionArr.push(char);
                    index = this._lookAhead(index, true, functionArr);
                    outputQueue[topOutputLength].val += parseFloat(functionArr.join(''));
                } else if (this._isValEqual(operatorStack[0], char)) {
                    outputQueue.push({ val: char, args: 0 });
                } else {
                    operatorStack.unshift({ val: char, args: 0 });
                }

                return index;
            };
            Tokenizer.prototype.__handleLeftBrace = function (char) {
                this.__operatorStack.unshift({ val: char, args: 0 });
                this.__objArgCount.push(0);
                this.__lastColonChar.push(char);
                this.__lastCommaChar.push(char);
            };
            Tokenizer.prototype.__handleRightBrace = function (char) {
                var operatorStack = this.__operatorStack, topOperator = operatorStack[0], lastArgCount = this.__objArgCount.pop();

                if (isNull(topOperator)) {
                    this._throwError('Improper object literal');
                } else {
                    this._popStackForVal(topOperator, '{', 'Improper object literal');

                    //pop left brace off stack
                    operatorStack.shift();

                    this.__lastColonChar.pop();
                    this.__lastCommaChar.pop();

                    this.__outputQueue.push({ val: '{}', args: lastArgCount });
                }
            };
            Tokenizer.prototype.__handleLeftBracket = function (char) {
                var previousChar = this.__previousChar, operatorStack = this.__operatorStack;

                if (this._isValEqual(operatorStack[0], '.')) {
                    this.__outputQueue.push(operatorStack.shift());
                }
                operatorStack.unshift({ val: char, args: 0 });
                this.__argCount.push({
                    num: 0,
                    isArray: !(previousChar === ']' || previousChar === ')' || this._isAlphaNumeric(previousChar))
                });
                this.__lastCommaChar.push(char);
            };
            Tokenizer.prototype.__handleRightBracket = function (char) {
                var operatorStack = this.__operatorStack, topOperator = operatorStack[0], lastArgCountObj = this.__argCount.pop(), outputQueue = this.__outputQueue, isEmptyArray = (this.__previousChar === '[');

                if (isNull(topOperator) || isNull(lastArgCountObj)) {
                    this._throwError('Brackets mismatch');
                } else {
                    if (!lastArgCountObj.isArray) {
                        lastArgCountObj.num--;
                    }

                    this._popStackForVal(topOperator, '[', 'Brackets mismatch');

                    //pop left bracket off stack
                    operatorStack.shift();

                    this.__lastCommaChar.pop();

                    //check if function on top of stack
                    outputQueue.push({ val: '[]', args: isEmptyArray ? -1 : lastArgCountObj.num + 1 });
                }
            };
            Tokenizer.prototype.__handleLeftParenthesis = function (char) {
                var previousChar = this.__previousChar, operatorStack = this.__operatorStack;

                if (this._isAlphaNumeric(previousChar) || previousChar === ']' || previousChar === ')') {
                    var outputQueue = this.__outputQueue, topOutput = outputQueue[outputQueue.length - 1];

                    if (this._isValEqual(topOutput, '[]')) {
                        operatorStack.unshift(outputQueue.pop());
                        operatorStack.unshift(outputQueue.pop());
                    } else if (!(this._isValEqual(topOutput, '()') || this._isNumeric(topOutput.val))) {
                        operatorStack.unshift(outputQueue.pop());
                    }

                    this.__argCount.push({ num: 0, isFn: true });
                }
                operatorStack.unshift({ val: char, args: 0 });
                this.__lastCommaChar.push(char);
            };
            Tokenizer.prototype.__handleRightParenthesis = function (char) {
                var operatorStack = this.__operatorStack, topOperator = operatorStack[0], localArgCountObj = this.__argCount.pop();

                if (isNull(topOperator)) {
                    this._throwError('Parentheses mismatch');
                } else {
                    this._popStackForVal(topOperator, '(', 'Parentheses mismatch');

                    //pop left parenthesis off stack
                    operatorStack.shift();

                    this.__lastCommaChar.pop();

                    //check if function on top of stack
                    if (!isNull(localArgCountObj) && this.__removeFnFromStack(localArgCountObj.num + 1)) {
                        this.__outputQueue.push({ val: '()', args: (this.__previousChar === '(') ? 0 : (localArgCountObj.num + 1) });
                    }
                }
            };
            Tokenizer.prototype.__handleComma = function (char) {
                var lastCommaArray = this.__lastCommaChar, lastCommaArg = lastCommaArray[lastCommaArray.length - 1];

                if (lastCommaArg === '(' || lastCommaArg === '[') {
                    var argCountArray = this.__argCount, length = argCountArray.length;

                    if (length > 0) {
                        //increment deepest fn count (don't need to increment obj count because we increment with colon)
                        argCountArray[length - 1].num++;
                    } else {
                        this._throwError('Mismatch with ' + lastCommaArg);
                    }
                }

                var topOperator = this.__operatorStack[0];

                if (isNull(topOperator)) {
                    this._throwError('Unexpected comma');
                } else {
                    this._popStackForVal(topOperator, lastCommaArg, 'Unexpected comma');
                }
            };
            Tokenizer.prototype.__handleStringLiteral = function (index, char) {
                var str = this._lookAheadForDelimiter(char, char, index, true), operatorStack = this.__operatorStack, topOperator = operatorStack[0];

                if (this._isValEqual(topOperator, '([')) {
                    operatorStack.unshift({ val: str.char, args: 0 });
                } else {
                    this.__outputQueue.push({ val: str.char, args: 0 });
                }
                return str.index;
            };

            // OPERATOR FUNCTIONS
            Tokenizer.prototype.__handleQuestion = function (char) {
                this.__lastColonChar.push(char);
                this.__determinePrecedence(char);
            };
            Tokenizer.prototype.__handleColon = function (char, ternary) {
                var lastColonCharArray = this.__lastColonChar, lastColonCharacter = lastColonCharArray[lastColonCharArray.length - 1], outputQueue = this.__outputQueue;

                if (lastColonCharacter === '?') {
                    var operatorStack = this.__operatorStack, topOperator = operatorStack[0];

                    if (isNull(topOperator)) {
                        this._throwError('Ternary mismatch');
                    } else {
                        ternary--;
                        lastColonCharArray.pop(); //pop latest colon char off queue

                        this._popStackForVal(topOperator, '?', 'Ternary mismatch');

                        outputQueue.push(operatorStack.shift());
                        operatorStack.unshift({ val: char, args: 0 });
                    }
                } else if (lastColonCharacter === '{') {
                    var objCountLast = this.__objArgCount.length - 1, outputLength = outputQueue.length;

                    this.__objArgCount[objCountLast]++;
                    if (outputLength > 0) {
                        outputQueue[outputLength - 1].args = 1;
                    } else {
                        this._throwError('Unexpected colon');
                    }
                } else {
                    this._throwError('Unexpected colon');
                }

                return ternary;
            };
            Tokenizer.prototype.__handleOtherOperator = function (index, char) {
                var look = this._lookAheadForOperatorFn(char, index);
                this.__determinePrecedence(look.char);

                return look.index;
            };
            Tokenizer.prototype.__popRemainingOperators = function () {
                var outputQueue = this.__outputQueue, operatorStack = this.__operatorStack;

                while (operatorStack.length > 0) {
                    var topOperator = operatorStack.shift();
                    if (topOperator.val === '(' || topOperator.val === ')') {
                        this._throwError('Parentheses mismatch');
                    }
                    outputQueue.push(topOperator);
                }
            };

            // PRIVATE HELPER FUNCTIONS
            Tokenizer.prototype.__determineOperator = function (operator) {
                switch (operator) {
                    case '+':
                    case '-':
                        var outputQueue = this.__outputQueue, operatorStack = this.__operatorStack, outputQueueLength = outputQueue.length, operatorStackLength = operatorStack.length, topOutput = outputQueue[outputQueueLength - 1], topOperator = operatorStack[operatorStackLength - 1], topOutputIsOperator = isNull(topOutput) ? false : isOperator(topOutput.val), topOperatorIsOperator = isNull(topOperator) ? false : isOperator(topOperator.val), topOperatorIsNonUnary = topOperatorIsOperator && topOperator.args > 1;

                        if ((outputQueueLength === 0 && operatorStackLength >= 0) || !(outputQueueLength > 1 || operatorStackLength < 1 || !topOperatorIsNonUnary) || (topOutputIsOperator && topOperatorIsOperator)) {
                            return OPERATORS['u' + operator];
                        }
                    default:
                        return OPERATORS[operator];
                }
            };
            Tokenizer.prototype.__determinePrecedence = function (operator) {
                var determined = false, operatorFn = this.__determineOperator(operator), operatorPrecedence = operatorFn.precedence, operatorAssoc = operatorFn.associativity, operatorStack = this.__operatorStack, outputQueue = this.__outputQueue, operatorObj, firstArrayOperator, firstArrayVal, firstArrayObj;

                while (!determined) {
                    firstArrayObj = operatorStack[0];

                    if (!firstArrayObj) {
                        operatorStack.unshift({ val: operator, args: operatorFn.fn.length - 2 });
                        return;
                    }

                    firstArrayVal = operatorStack[0].val;
                    firstArrayOperator = OPERATORS[firstArrayVal];
                    if (!(isNull(firstArrayOperator) || !(firstArrayOperator.precedence < operatorPrecedence || (firstArrayOperator.precedence === operatorPrecedence && operatorAssoc === 'ltr')))) {
                        outputQueue.push(operatorStack.shift());
                    } else {
                        operatorStack.unshift({ val: operator, args: operatorFn.fn.length - 2 });
                        determined = true;
                    }
                }
            };
            Tokenizer.prototype.__removeFnFromStack = function (argCount) {
                var outputQueue = this.__outputQueue, operatorStack = this.__operatorStack, topOperator = operatorStack[0], isValEqual = this._isValEqual, isValUnequal = this._isValUnequal, fnToken, atLeastOne = false;

                while (!isNull(topOperator) && isValUnequal(topOperator, '([') && (this._isStringValidVariable(topOperator.val) || isValEqual(topOperator.val, '[].') || isAccessor(topOperator.val))) {
                    fnToken = operatorStack.shift();
                    if (!(fnToken.args !== -1 || isValEqual(fnToken, '[].'))) {
                        fnToken.args = -2;
                    }
                    outputQueue.push(fnToken);
                    topOperator = operatorStack[0];
                    atLeastOne = true;
                }
                if (!(atLeastOne || isValUnequal(outputQueue[outputQueue.length - argCount - 1], '()'))) {
                    atLeastOne = true;
                }

                return atLeastOne;
            };

            // PROTECTED HELPER FUNCTIONS
            Tokenizer.prototype._checkType = function (char, isNumberLike) {
                if (isNumberLike) {
                    return this._isNumeric(char);
                }
                return this._isAlphaNumeric(char);
            };
            Tokenizer.prototype._lookAhead = function (index, isNumberLike, array) {
                var ch, input = this._input;

                while (++index) {
                    if (this._checkType((ch = input[index]), isNumberLike)) {
                        array.push(ch);
                    } else {
                        break;
                    }
                }
                return index - 1;
            };
            Tokenizer.prototype._lookAheadForOperatorFn = function (char, index) {
                var ch, fn, input = this._input;

                while ((++index < input.length) && ch !== '') {
                    ch = input[index], fn = char + ch;

                    if (isOperator(fn)) {
                        char = fn;
                    } else {
                        break;
                    }
                }
                return { char: char, index: index - 1 };
            };
            Tokenizer.prototype._lookAheadForDelimiter = function (char, endChar, index, includeDelimiter) {
                var ch, input = this._input;

                while ((ch = input[++index]) !== endChar) {
                    char += ch;
                }
                if (includeDelimiter) {
                    char = char.substr(1);
                    index++;
                }
                return { char: char, index: index - 1 };
            };
            Tokenizer.prototype._popStackForVal = function (topOperator, char, error) {
                var outputQueue = this.__outputQueue, operatorStack = this.__operatorStack;

                while (topOperator.val !== char) {
                    outputQueue.push(operatorStack.shift());
                    topOperator = operatorStack[0];
                    if (operatorStack.length === 0) {
                        this._throwError(error);
                    }
                }
            };
            Tokenizer.prototype._isValEqual = function (obj, char) {
                if (isNull(obj)) {
                    return isNull(char);
                }
                return char.indexOf(obj.val) !== -1;
            };
            Tokenizer.prototype._isValUnequal = function (obj, char) {
                if (isNull(obj)) {
                    return !isNull(char);
                }
                return char.indexOf(obj.val) === -1;
            };
            Tokenizer.prototype._resetTokenizer = function () {
                this.__previousChar = '';
                this.__outputQueue = [];
                this.__operatorStack = [];
                this.__argCount = [];
                this.__objArgCount = [];
                this.__lastColonChar = [];
                this.__lastCommaChar = [];
            };
            Tokenizer.prototype._throwError = function (error) {
                this.$ExceptionStatic.fatal(error + ' in {{' + this._input + '}}', this.$ExceptionStatic.PARSE);
            };
            Tokenizer.prototype._isNumeric = function (char) {
                return ('0' <= char && char <= '9');
            };
            Tokenizer.prototype._isSpace = function (char) {
                return (char === ' ' || char === '\r' || char === '\n' || char === '\t' || char === '\v' || char === '\u00A0');
            };
            Tokenizer.prototype._isAlpha = function (char) {
                return ('a' <= char && char <= 'z' || 'A' <= char && char <= 'Z' || '@' === char || '_' === char || '$' === char);
            };
            Tokenizer.prototype._isAlphaNumeric = function (char) {
                return ('a' <= char && char <= 'z' || 'A' <= char && char <= 'Z' || '0' <= char && char <= '9' || '@' === char || '_' === char || '$' === char);
            };
            Tokenizer.prototype._isStringValidVariable = function (input) {
                return !this.__variableRegex.test(input);
            };
            return Tokenizer;
        })();
        expressions.Tokenizer = Tokenizer;

        

        

        

        register.injectable('$tokenizer', Tokenizer);

        /**
        * Parses javascript expression strings and creates IParsedExpressions.
        */
        var Parser = (function () {
            function Parser() {
                this._tokens = [];
                this.$tokenizer = acquire('$tokenizer');
                this.$ExceptionStatic = acquire('$ExceptionStatic');
                this.__cache = {};
                this.__codeArray = [];
                this.__identifiers = [];
                this.__tempIdentifiers = [];
                this.__aliases = [];
                this.__uniqueAliases = {};
            }
            /**
            * Parses a string representation of a javascript expression and turns it
            * into an IParsedExpression.
            *
            * @param input The string representation of a javascript expression.
            * @return {IParsedExpression}
            */
            Parser.prototype.parse = function (input) {
                var parsedObject = this.__cache[input];
                if (!isNull(parsedObject)) {
                    return parsedObject;
                }
                this._tokens = this.$tokenizer.createTokens(input);

                parsedObject = this._evaluate(input);

                var identifiers = parsedObject.identifiers;
                if (identifiers.length === 0) {
                    var noModel = parsedObject.evaluate(null);
                    parsedObject.evaluate = function evaluateNoContext() {
                        return noModel;
                    };
                }

                this.__cache[input] = parsedObject;

                return parsedObject;
            };
            Parser.prototype._evaluate = function (input) {
                var tokens = this._tokens, length = tokens.length, tempIdentifiers = this.__tempIdentifiers, codeArray = this.__codeArray, codeStr = '', useLocalContext = false;

                for (var i = 0; i < length; i++) {
                    var tokenObj = tokens[i], token = tokenObj.val, args = tokenObj.args;

                    //check if its an accessor
                    if (isAccessor(token)) {
                        var obj;
                        switch (token) {
                            case '()':
                                useLocalContext = this.__handleFunction(i, args, useLocalContext);
                                break;
                            case '{}':
                                codeArray.push(this.__convertObject(args));
                                break;
                            default:
                                //handle empty array
                                if (args < 0) {
                                    codeArray.push('[]');
                                    tempIdentifiers.push('.');
                                    //handle array literal
                                } else if (args > 0) {
                                    codeArray.push(this.__convertArrayLiteral(args));
                                } else {
                                    useLocalContext = this.__indexIntoObject(i, useLocalContext);
                                }
                                break;
                        }
                        //check if its an operator
                    } else if (isOperator(token)) {
                        switch (token) {
                            case '?':
                                this.__handleQuestion();
                                break;
                            case ':':
                                this.__handleColon();
                                break;
                            case '+':
                            case '-':
                                if (args === 1) {
                                    token = 'u' + token;
                                }
                            default:
                                this.__handleOperator(token, args);
                                break;
                        }
                        // its either function, object, or primitive
                    } else {
                        //potential function or object to index into
                        if (args < 0) {
                            codeStr = this.__convertFunction(i, token, useLocalContext);
                            // primitive
                        } else {
                            codeStr = this.__convertPrimitive(i, token, args);
                        }
                        codeArray.push(codeStr);
                    }
                }

                // move the rest of the tempIdentifiers to the identifiers
                this._popRemainingIdentifiers();

                // make the identifiers array unqiue entries only
                this._makeIdentifiersUnique();

                var parsedExpression = {
                    evaluate: new Function('context', 'aliases', 'var initialContext;' + 'return ' + (codeArray.length === 0 ? ('"' + input + '"') : codeArray.join('')) + ';'),
                    expression: input,
                    identifiers: this.__identifiers.slice(0),
                    aliases: this.__aliases.slice(0)
                };

                // reset parser's properties
                this._resetParser();

                return parsedExpression;
            };

            // PARSE CASES
            Parser.prototype.__convertPrimitive = function (index, token, args) {
                var tokens = this._tokens, tempIdentifiers = this.__tempIdentifiers;

                if (args > 0) {
                    tempIdentifiers.push('.');
                    return token;
                } else {
                    var castToken = Number(token), castTokenIsNumberLike = isNumber(castToken), peek1 = this._peek(index), isPeekIndexer = peek1 && peek1.args < 1;

                    if (isKeyword(token) || (isString(token) && (castTokenIsNumberLike || this._isValUnequal(peek1, '[]()') || (this._isValEqual(peek1, '[]') && !isPeekIndexer)))) {
                        tempIdentifiers.push('.');
                        return '"' + token + '"';
                    } else {
                        if (!castTokenIsNumberLike || (this._isValEqual(peek1, '[].') && isPeekIndexer)) {
                            tempIdentifiers.push(token);
                        } else {
                            tempIdentifiers.push('.');
                        }
                        return token;
                    }
                }
            };
            Parser.prototype.__convertFunction = function (index, token, useLocalContext) {
                var tokens = this._tokens, tempIdentifiers = this.__tempIdentifiers, nextChar = this._peek(index);

                if (token[0] === '@' && isNull(this.__uniqueAliases[token])) {
                    this.__uniqueAliases[token] = true;
                    this.__aliases.push(token.slice(1));
                } else if (isKeyword(token)) {
                    tempIdentifiers.push('.');
                    return token;
                }

                tempIdentifiers.push(token);
                if (!isNull(nextChar)) {
                    switch (nextChar.val) {
                        case '.':
                        case '()':
                            return token;
                        default:
                            if (!useLocalContext) {
                                return '(initialContext = (' + this.__findInitialContext.toString() + ')(context,aliases,"' + token + '"))';
                            }
                            break;
                    }
                } else {
                    return '(initialContext = (' + this.__findInitialContext.toString() + ')(context,aliases,"' + token + '"))';
                }
            };
            Parser.prototype.__convertObject = function (args) {
                var identifiers = this.__identifiers, tempIdentifiers = this.__tempIdentifiers, codeArray = this.__codeArray, j = 0, indexer, codeStr = '{', tempIdentifier, contextFnString = '(' + this.__findInitialContext.toString() + ')(context,aliases,"';

                var temp;
                while (j++ < args) {
                    temp = codeArray.pop();
                    indexer = codeArray.pop();
                    codeStr += ',"' + indexer + '":' + temp;

                    if (tempIdentifiers.length > 0) {
                        tempIdentifier = tempIdentifiers.pop();

                        // the identifier could have the context fn prepended to it so need to check for equality
                        if (tempIdentifier === temp || (contextFnString + tempIdentifier + '")') === temp || ('(initialContext = ' + contextFnString + tempIdentifier + '"))') === temp) {
                            identifiers.push(tempIdentifier);
                            if (tempIdentifiers[tempIdentifiers.length - 1] === indexer) {
                                tempIdentifiers.pop();
                            }
                        } else if (tempIdentifiers[tempIdentifiers.length - 1] === indexer) {
                            tempIdentifiers.pop();
                        }
                    }
                }

                return codeStr.replace(',', '') + '}';
            };
            Parser.prototype.__convertArrayLiteral = function (args) {
                var identifiers = this.__identifiers, tempIdentifiers = this.__tempIdentifiers, codeArray = this.__codeArray, j = 0, tempStr = '', codeStr = '[', tempIdentifier;

                while (j++ < args) {
                    tempStr = codeArray.pop() + ',' + tempStr;

                    if (tempIdentifiers.length > 0) {
                        tempIdentifier = tempIdentifiers.pop();
                        if (tempIdentifier !== '.') {
                            identifiers.push(tempIdentifier);
                        }
                    }
                }

                codeStr += tempStr.slice(0, tempStr.length - 1) + ']';

                return codeStr;
            };

            // ACCESSORS
            Parser.prototype.__handleFunction = function (index, args, useLocalContext) {
                var tokens = this._tokens, identifiers = this.__identifiers, tempIdentifiers = this.__tempIdentifiers, codeArray = this.__codeArray, j = 0, previousToken = tokens[index - 1], previousTokenIsFnName = (previousToken.args === -2), grabFnName = previousTokenIsFnName || this._isValEqual(previousToken, '[].'), tempStr = '', tempIdentifier, fnName = '', identifierFnName = '', codeStr, pushedIdentifier = false;

                if (grabFnName) {
                    fnName = codeArray.pop();
                    identifierFnName = tempIdentifiers.pop();
                }

                while (j++ < args) {
                    tempStr = codeArray.pop() + ',' + tempStr;

                    if (tempIdentifiers.length > 0) {
                        tempIdentifier = tempIdentifiers.pop();
                        if (tempIdentifier !== '.') {
                            identifiers.push(tempIdentifier);
                            pushedIdentifier = true;
                        }
                    }
                }

                if (args > 0) {
                    codeStr = '.call(initialContext || context,' + tempStr.slice(0, tempStr.length - 1) + ')';
                } else {
                    codeStr = '.call(initialContext || context)';
                }

                if (useLocalContext) {
                    useLocalContext = false;
                    if (codeArray.length > 0) {
                        var context = codeArray.pop();

                        var lastIndex = tempIdentifiers.length - 1;
                        if (!(lastIndex < 0 || tempIdentifiers[lastIndex] === '.' || identifierFnName === '')) {
                            tempIdentifiers[lastIndex] += '.' + identifierFnName;
                            identifiers.push(tempIdentifiers.pop());
                            //check fn name is not null, pushed an identifier, and the context is not an array literal
                        } else if (!(identifierFnName === '' || !pushedIdentifier || context[0] === '[' || context[context.length - 1] === ']')) {
                            identifiers[identifiers.length - 1] += '.' + identifierFnName;
                        }

                        if (isEmpty(fnName)) {
                            codeStr = context + codeStr;
                        } else {
                            codeStr = '((' + this.__indexIntoContext.toString() + ')(' + context + ',"' + fnName + '") || (function () {}))' + codeStr;
                        }
                    } else {
                        this._throwError('Improper expression or context');
                    }
                } else {
                    if (grabFnName) {
                        codeStr = '(initialContext = (' + this.__findInitialContext.toString() + ')(context,aliases,"' + fnName + '") || (function () {}))' + codeStr;

                        identifiers.push(fnName);
                    } else {
                        codeStr = codeArray.pop() + codeStr;
                    }
                }
                codeArray.push(codeStr);

                var peek = this._peek(index), length = tempIdentifiers.length;
                if (this._isValEqual(peek, '[]') && length > 0) {
                    var lastIdentifier = tempIdentifiers[length - 1];
                    if (lastIdentifier !== '.') {
                        identifiers.push(tempIdentifiers.pop());
                    }
                }

                return useLocalContext;
            };
            Parser.prototype.__indexIntoObject = function (index, useLocalContext) {
                var tokens = this._tokens, identifiers = this.__identifiers, tempIdentifiers = this.__tempIdentifiers, codeArray = this.__codeArray, nextChar = this._peek(index);

                if (this._isValEqual(nextChar, '()')) {
                    return true;
                }

                var codeStr = codeArray.pop(), previousToken = tokens[index - 1], indexer, identifierIndexer = tempIdentifiers.pop(), context = codeArray.pop();

                if (this._isValUnequal(previousToken, '++--()[]*/%?:>=<=&&||!===')) {
                    codeStr = '(' + this.__indexIntoContext.toString() + ')(' + context + ',"' + codeStr + '")';

                    var lastIndex = tempIdentifiers.length - 1;
                    if (lastIndex >= 0) {
                        if (tempIdentifiers[lastIndex] !== '.') {
                            tempIdentifiers[lastIndex] += '.' + identifierIndexer;
                        }
                    } else if (!isNull(identifierIndexer) && identifierIndexer !== '.') {
                        identifiers.push(identifierIndexer);
                    }
                } else {
                    codeStr = '(' + this.__indexIntoContext.toString() + ')(' + context + ',' + codeStr + ')';
                    tempIdentifiers.push('.');
                }

                codeArray.push(codeStr);

                return useLocalContext;
            };

            // OPERATORS
            Parser.prototype.__handleQuestion = function () {
                var identifiers = this.__identifiers, tempIdentifiers = this.__tempIdentifiers, codeArray = this.__codeArray, temp = codeArray.pop(), codeStr = codeArray.pop() + '?' + temp, tempIdentifier;

                for (var i = 0; i < 2; i++) {
                    if (tempIdentifiers.length > 0) {
                        tempIdentifier = tempIdentifiers.pop();
                        if (tempIdentifier !== '.') {
                            identifiers.push(tempIdentifier);
                        }
                    } else {
                        break;
                    }
                }

                codeArray.push(codeStr);
            };
            Parser.prototype.__handleColon = function () {
                var identifiers = this.__identifiers, tempIdentifiers = this.__tempIdentifiers, codeArray = this.__codeArray, temp = codeArray.pop(), codeStr = codeArray.pop() + ':' + temp, tempIdentifier;

                for (var i = 0; i < 2; i++) {
                    if (tempIdentifiers.length > 0) {
                        tempIdentifier = tempIdentifiers.pop();
                        if (tempIdentifier !== '.') {
                            identifiers.push(tempIdentifier);
                        }
                    } else {
                        break;
                    }
                }

                codeArray.push(codeStr);
            };
            Parser.prototype.__handleOperator = function (token, args) {
                var identifiers = this.__identifiers, tempIdentifiers = this.__tempIdentifiers, codeArray = this.__codeArray, j = 0, tempStr = '', codeStr = '(' + OPERATORS[token].fn.toString() + ')(context, aliases,', tempIdentifier;

                while (j++ < args) {
                    tempStr = 'function (context, aliases) { return ' + codeArray.pop() + '; }' + ',' + tempStr;

                    if (tempIdentifiers.length > 0) {
                        tempIdentifier = tempIdentifiers.pop();
                        if (tempIdentifier !== '.') {
                            identifiers.push(tempIdentifier);
                        }
                    }
                }

                codeStr += tempStr.slice(0, tempStr.length - 1) + ')';

                codeArray.push(codeStr);
            };

            // PRIVATE HELPER FUNCTIONS
            Parser.prototype.__findInitialContext = function (context, aliases, token, undefined) {
                if (token[0] === '@' && aliases !== null && typeof aliases === 'object') {
                    return aliases[token];
                } else if (context !== null && typeof context === 'object') {
                    return context[token];
                }
                return context === null ? null : undefined;
            };
            Parser.prototype.__indexIntoContext = function (context, token, undefined) {
                if (context !== null && typeof context === 'object') {
                    return context[token];
                }
                return context === null ? null : undefined;
            };

            // PROTECTED HELPER FUNCTIONS
            Parser.prototype._peek = function (index) {
                return this._tokens[index + 1];
            };
            Parser.prototype._popRemainingIdentifiers = function () {
                var identifiers = this.__identifiers, tempIdentifiers = this.__tempIdentifiers, last;

                while (tempIdentifiers.length > 0) {
                    last = tempIdentifiers.pop();
                    if (last !== '.') {
                        identifiers.push(last);
                    }
                }
            };
            Parser.prototype._makeIdentifiersUnique = function () {
                var identifiers = this.__identifiers, uniqueIdentifiers = [], uniqueIdentifierObject = {}, identifier;

                while (identifiers.length > 0) {
                    identifier = identifiers.pop();
                    if (isNull(uniqueIdentifierObject[identifier])) {
                        uniqueIdentifierObject[identifier] = true;
                        uniqueIdentifiers.push(identifier);
                    }
                }

                this.__identifiers = uniqueIdentifiers;
            };
            Parser.prototype._isValEqual = function (obj, char) {
                if (isNull(obj)) {
                    return isNull(char);
                }
                return char.indexOf(obj.val) !== -1;
            };
            Parser.prototype._isValUnequal = function (obj, char) {
                if (isNull(obj)) {
                    return !isNull(char);
                }
                return char.indexOf(obj.val) === -1;
            };
            Parser.prototype._resetParser = function () {
                this._tokens = [];
                this.__codeArray = [];
                this.__identifiers = [];
                this.__tempIdentifiers = [];
                this.__aliases = [];
                this.__uniqueAliases = {};
            };
            Parser.prototype._throwError = function (error) {
                this.$ExceptionStatic.fatal(error, this.$ExceptionStatic.PARSE);
            };
            return Parser;
        })();
        expressions.Parser = Parser;

        register.injectable('$parser', Parser);

        

        
    })(plat.expressions || (plat.expressions = {}));
    var expressions = plat.expressions;
    (function (web) {
        /**
        * Todo
        */
        var Browser = (function () {
            function Browser() {
                this.$EventManagerStatic = acquire('$EventManagerStatic');
                this.$compat = acquire('$compat');
                this.$config = acquire('$browser.config');
                this.$regex = acquire('$regex');
                this.$window = acquire('$window');
                this.__lastUrl = this.$window.location.href;
                this.__initializing = false;
                this.uid = uniqueId('plat_');
                this.$EventManagerStatic.on(this.uid, 'beforeLoad', this.initialize, this);
            }
            /**
            * Todo
            */
            Browser.prototype.url = function (url, replace) {
                var location = this.$window.location, history = this.$window.history;

                if (isString(url) && this.__lastUrl !== url) {
                    this.__lastUrl = url;
                    var newUrl = this._setUrl(url, replace);
                } else {
                    return this.__currentUrl || location.href;
                }
            };

            /**
            * Todo
            */
            Browser.prototype.urlUtils = function (url) {
                url = url || this.url();

                var utils = acquire('$urlUtils'), config = this.$config;

                if (config.routingType === config.routeType.HASH) {
                    url = url.replace(new RegExp('#' + (config.hashPrefix || '') + '/?'), '');
                }

                utils.initialize(url);

                return utils;
            };

            /**
            * Checks to see if the requested URL is cross domain.
            */
            Browser.prototype.isCrossDomain = function (url) {
                if (!isString(url)) {
                    return false;
                }

                var urlUtils = this.urlUtils(url), locationUtils = this.urlUtils();

                // check for protocol:host:port mismatch
                return urlUtils.protocol !== locationUtils.protocol || urlUtils.hostname !== locationUtils.hostname || urlUtils.port !== locationUtils.port;
            };

            /**
            * Todo
            */
            Browser.prototype.initialize = function () {
                var config = this.$config, compat = this.$compat;

                this.$EventManagerStatic.dispose(this.uid);

                if (config.routingType === config.routeType.NONE) {
                    return;
                }

                this.__initializing = true;

                var changed = this._urlChanged.bind(this);

                var url = this.url(), trimmedUrl = url.replace(this.$regex.initialUrlRegex, '/');

                if (config.routingType === config.routeType.HASH) {
                    this.$config.baseUrl = trimmedUrl = trimmedUrl.replace(/#.*/, '');
                }

                if (trimmedUrl !== url) {
                    this.url(trimmedUrl, true);
                }

                if (compat.pushState) {
                    if (config.routingType === config.routeType.STATE) {
                        this.url(this._getBaseUrl(trimmedUrl), true);
                    }
                    this.$window.addEventListener('popstate', changed, false);
                }

                this.$window.addEventListener('hashchange', changed, false);

                this.__initializing = false;
            };

            Browser.prototype._getBaseUrl = function (url) {
                var colon = url.substring(url.indexOf(':')), next = colon.substring(colon.search(/\w+/));

                return url.substring(0, url.indexOf('/', url.indexOf(next))) + '/';
            };

            /**
            * Todo
            */
            Browser.prototype._urlChanged = function (url) {
                if (this.__initializing) {
                    return;
                }

                this.__currentUrl = null;
                var url = this.url();

                if (this.__lastUrl === url) {
                    return;
                }

                this.__lastUrl = url;

                var manager = this.$EventManagerStatic;

                manager.dispatch('urlChanged', this, manager.direction.DIRECT, [this.urlUtils()]);
            };

            /**
            * Todo
            */
            Browser.prototype._setUrl = function (url, replace) {
                url = this._formatUrl(url);
                if (this.$compat.pushState) {
                    if (replace) {
                        history.replaceState(null, '', url);
                    } else {
                        history.pushState(null, '', url);
                    }
                    this._urlChanged(url);
                } else {
                    this.__currentUrl = url;
                    if (replace) {
                        location.replace(url);
                    } else {
                        location.href = url;
                    }
                }

                return url;
            };

            /**
            * Todo
            */
            Browser.prototype._formatUrl = function (url) {
                var config = this.$config;
                if (config.routingType === config.routeType.HASH) {
                    var hasProtocol = url.indexOf(this.urlUtils().protocol) !== -1, prefix = this.$config.hashPrefix || '', hashRegex = new RegExp('#' + prefix + '|#/');

                    if (hasProtocol && !hashRegex.test(url)) {
                        url = url + '#' + prefix + '/';
                    } else if (!hashRegex.test(url)) {
                        url = '#' + prefix + '/' + url;
                    }
                }

                return url;
            };
            return Browser;
        })();
        web.Browser = Browser;

        register.injectable('$browser', Browser);

        var UrlUtils = (function () {
            function UrlUtils() {
                this.$ContextManagerStatic = acquire('$ContextManagerStatic');
                this.$document = acquire('$document');
                this.$compat = acquire('$compat');
                this.$config = acquire('$browser.config');
            }
            UrlUtils.__getQuery = function (search) {
                if (isEmpty(search)) {
                    return {};
                }

                var split = search.split('&'), query = {}, length = split.length, item, define = acquire('$ContextManagerStatic').defineGetter;

                for (var i = 0; i < length; ++i) {
                    item = split[i].split('=');

                    define(query, item[0], item[1]);
                }

                return query;
            };

            /**
            * Todo
            */
            UrlUtils.prototype.initialize = function (url) {
                url = url || '';

                var element = UrlUtils.__urlUtilsElement || (UrlUtils.__urlUtilsElement = this.$document.createElement('a')), define = this.$ContextManagerStatic.defineGetter;

                // always make local urls relative to start page.
                if (url[0] === '/') {
                    url = url.substr(1);
                }

                element.setAttribute('href', url);
                url = element.href;

                define(this, 'href', url, true, true);
                define(this, 'protocol', element.protocol ? element.protocol.replace(/:$/, '') : '', true, true);
                define(this, 'host', element.host, true, true);
                define(this, 'search', element.search ? element.search.replace(/^\?/, '') : '', true, true);
                define(this, 'hash', element.hash ? element.hash.replace(/^#/, '') : '', true, true);
                define(this, 'hostname', element.hostname, true, true);
                define(this, 'port', element.port, true, true);

                var path;

                if (!isEmpty(this.$config.baseUrl)) {
                    path = url.replace(this.$config.baseUrl, '/');
                } else {
                    path = (element.pathname.charAt(0) === '/') ? element.pathname : '/' + element.pathname;
                }

                define(this, 'pathname', path, true, true);
                define(this, 'query', UrlUtils.__getQuery(this.search), true, true);
            };

            /**
            * Todo
            */
            UrlUtils.prototype.toString = function () {
                return this.href;
            };
            return UrlUtils;
        })();
        web.UrlUtils = UrlUtils;

        register.injectable('$urlUtils', UrlUtils, null, register.injectableType.MULTI);

        /**
        * Specifies configuration properties for the Browser
        * injectable.
        */
        var BrowserConfig = (function () {
            function BrowserConfig() {
                /**
                * Contains the constants for use with routingType.
                */
                this.routeType = {
                    /**
                    * Specifies that the application will not be doing
                    * url-based routing.
                    */
                    NONE: 'none',
                    /**
                    * Specifies that the application wants to use hash-based
                    * routing.
                    */
                    HASH: 'hash',
                    /**
                    * Specifies that the application wants to use the HTML5
                    * popstate method for managing routing. If the browser
                    * does not support HTML5 popstate events, hash routing
                    * will be used instead.
                    *
                    * Note: In 'state' mode, the web server must be configured to
                    * route every url to the root url.
                    */
                    STATE: 'state'
                };
                /**
                * Allows you to define how your app will route. There are
                * three modes, 'none', 'hash', and 'state'.
                *
                * In 'none' mode, the application will not be responding to
                * url changes.
                *
                * In 'hash' mode, the application will use a hash prefix and
                * all navigation will be managed with hash changes.
                *
                * In 'state' mode, the application will use the 'popstate'
                * event and will be able to manage routes. The web server
                * must be configured to route every url to the root url if
                * using 'state' mode.
                *
                * The default mode is 'none'
                */
                this.routingType = this.routeType.NONE;
                /**
                * If routingType is set to 'hash', this value will be
                * appended to the '#' at the beginning of every route. The
                * default prefix is '', meaning each path will be '#/<path>'.
                */
                this.hashPrefix = '';
                /**
                * Specifies the base url used to normalize url routing.
                */
                this.baseUrl = '';
            }
            return BrowserConfig;
        })();
        web.BrowserConfig = BrowserConfig;

        register.injectable('$browser.config', BrowserConfig);

        

        

        var Router = (function () {
            function Router() {
                this.uid = uniqueId('plat_');
                this._routes = [];
                this.$browser = acquire('$browser');
                this.$browserConfig = acquire('$browser.config');
                this.$EventManagerStatic = acquire('$EventManagerStatic');
                this.$NavigationEventStatic = acquire('$NavigationEventStatic');
                this.$compat = acquire('$compat');
                this.$ExceptionStatic = acquire('$ExceptionStatic');
                this.$regex = acquire('$regex');
                this.$window = acquire('$window');
                this.__escapeRegex = this.$regex.escapeRouteRegex;
                this.__optionalRegex = this.$regex.optionalRouteRegex;
                this.__firstRoute = true;
                this._removeListener = this.$EventManagerStatic.on(this.uid, 'urlChanged', this._routeChanged, this);
                var config = this.$browserConfig;
                if (config.routingType === config.routeType.NONE) {
                    config.routingType = config.routeType.HASH;
                    config.hashPrefix = config.hashPrefix || '';
                }

                if (this.$compat.msApp) {
                    this.__history = [];
                }
            }
            /**
            * Registers route strings/RegExp and associates them with a control type.
            *
            * @param type The control type with which to associate the routes.
            * @param routes An array of strings or RegExp expressions to associate with
            * the control type.
            */
            Router.prototype.registerRoutes = function (type, routes) {
                if (!isArray(routes)) {
                    return;
                }

                var injector = viewControlInjectors[type], length = routes.length;

                for (var i = 0; i < length; ++i) {
                    this._registerRoute(routes[i], injector, type);
                }
            };

            /**
            * Formats a url path given the parameters and query string, then changes the
            * url to that path.
            */
            Router.prototype.route = function (path, options) {
                options = options || {};

                var replace = options.replace, route, match, currentUtils = this.$browser.urlUtils();

                if (this.__firstRoute) {
                    this.__firstRoute = false;
                    if (!isEmpty(currentUtils.pathname) && currentUtils.pathname !== '/') {
                        this._routeChanged(null, currentUtils);
                        return;
                    }
                }

                var build = this._buildRoute(path, options.query);

                if (isNull(build)) {
                    this.$ExceptionStatic.warn('Route: ' + path + ' is not a matched route.', this.$ExceptionStatic.NAVIGATION);
                    return;
                }

                route = build.route;
                match = build.match;

                var event = this.$NavigationEventStatic.dispatch('beforeRouteChange', this, {
                    parameter: match.route,
                    target: match.injector,
                    type: match.type,
                    options: null,
                    cancelable: true
                });

                if (event.canceled) {
                    return;
                }

                var nextUtils = this.$browser.urlUtils(route);

                if (currentUtils.href === nextUtils.href) {
                    replace = true;
                }

                this.$browser.url(route, replace);
            };

            Router.prototype.goBack = function (length) {
                this.$window.history.go(-length);

                if (this.__history && this.__history.length > 1) {
                    var historyLength = this.__history.length;
                    this.__history = this.__history.slice(0, historyLength - length);
                    this.$browser.url(this.__history.pop() || '');
                }
            };

            Router.prototype._buildRoute = function (routeParameter, query) {
                var queryStr = this._buildQueryString(query);

                if (!isString(routeParameter)) {
                    return;
                }

                var route = routeParameter + queryStr, utils = this.$browser.urlUtils(route), match = this._match(utils);

                if (isNull(match)) {
                    return;
                }

                return {
                    route: route,
                    match: match
                };
            };

            Router.prototype._buildQueryString = function (query) {
                var queryStr = [];

                if (!isObject(query)) {
                    return queryStr.join();
                }

                var keys = Object.keys(query), length = keys.length, key;

                for (var i = 0; i < length; ++i) {
                    key = keys[i];

                    queryStr.push(key + '=' + query[key]);
                }

                return '?' + queryStr.join('&');
            };

            Router.prototype._routeChanged = function (ev, utils) {
                var matchedRoute = this._match(utils);

                if (isNull(matchedRoute)) {
                    this.$ExceptionStatic.warn('Could not match route: ' + utils.pathname, this.$ExceptionStatic.NAVIGATION);
                    return;
                }

                if (this.__history) {
                    this.__history.push(matchedRoute.route.path);
                }

                var event = this.$NavigationEventStatic.dispatch('routeChanged', this, {
                    parameter: matchedRoute.route,
                    target: matchedRoute.injector,
                    type: matchedRoute.type,
                    options: null,
                    cancelable: false
                });
            };

            Router.prototype._registerRoute = function (route, injector, type) {
                var regexp = isRegExp(route), routeParameters;

                if (!(regexp || isString(route))) {
                    return;
                } else if (regexp) {
                    routeParameters = {
                        regex: route,
                        type: type,
                        injector: injector,
                        args: []
                    };
                } else if (isEmpty(route)) {
                    this._defaultRoute = {
                        injector: injector,
                        type: type
                    };
                    return;
                } else if (route.trim() === '/') {
                    this._baseRoute = {
                        injector: injector,
                        type: type
                    };
                    return;
                } else {
                    routeParameters = this._getRouteParameters(route);
                    routeParameters.injector = injector;
                    routeParameters.type = type;
                }

                this._routes.push(routeParameters);
            };

            Router.prototype._getRouteParameters = function (route) {
                var regex = this.$regex, namedRegex = regex.namedParameterRouteRegex, escapeRegex = this.__escapeRegex, optionalRegex = this.__optionalRegex, wildcardRegex = regex.wildcardRouteRegex, regexArgs = route.match(namedRegex), wildcard = wildcardRegex.exec(route), args = [];

                route = route.replace(escapeRegex, '\\$').replace(optionalRegex, '(?:$1)?').replace(namedRegex, function (match, optional) {
                    return optional ? match : '([^/?]+)';
                }).replace(wildcardRegex, '([^?]*?)');

                if (!isNull(regexArgs)) {
                    var length = regexArgs.length;

                    for (var i = 0; i < length; ++i) {
                        args.push(regexArgs[i].substr(1));
                    }
                }

                if (!isNull(wildcard)) {
                    var wildCardName = wildcard[0].substr(1);

                    if (isEmpty(wildCardName)) {
                        wildCardName = 'wildcard';
                    }

                    args.push(wildCardName);
                }

                return {
                    regex: new RegExp('^' + route + '(?:\\?([\\s\\S]*))?$'),
                    args: args
                };
            };

            Router.prototype._match = function (utils) {
                var routes = this._routes, url = this._getUrlFragment(utils), route, exec, args, routeParams = {}, path, argsLength, length = routes.length;

                if (isEmpty(url)) {
                    var base = this._baseRoute || this._defaultRoute;

                    if (isNull(base)) {
                        return;
                    }

                    return {
                        injector: base.injector,
                        type: base.type,
                        route: {
                            path: url,
                            parameters: {},
                            query: utils.query
                        }
                    };
                }

                for (var i = 0; i < length; ++i) {
                    route = routes[i];
                    exec = route.regex.exec(url);

                    if (isNull(exec)) {
                        continue;
                    }

                    args = route.args;
                    argsLength = args.length;
                    path = exec.input;

                    if (argsLength === 0) {
                        args = Object.keys(exec.slice());
                        exec.unshift('');
                        argsLength = args.length;
                    }

                    for (var j = 0; j < argsLength; ++j) {
                        routeParams[args[j]] = exec[j + 1];
                    }

                    return {
                        injector: route.injector,
                        type: route.type,
                        route: {
                            path: path,
                            parameters: routeParams,
                            query: utils.query
                        }
                    };
                }

                var defaultRoute = this._defaultRoute;
                if (isNull(defaultRoute)) {
                    return;
                }

                return {
                    injector: defaultRoute.injector,
                    type: defaultRoute.type,
                    route: {
                        path: url,
                        parameters: {},
                        query: utils.query
                    }
                };
            };

            Router.prototype._getUrlFragment = function (utils) {
                return this._trimSlashes(utils.pathname);
            };

            Router.prototype._trimSlashes = function (fragment) {
                return fragment.replace(/\/$/, '').replace(/^\//, '');
            };
            return Router;
        })();

        register.injectable('$router', Router);

        

        

        

        
    })(plat.web || (plat.web = {}));
    var web = plat.web;
    (function (_async) {
        /**
        * Adopted from the ES6 promise polyfill: https://github.com/jakearchibald/es6-promise
        *
        * Takes in 2 generic types corresponding to the fullfilled success and error types.
        * The error type (U) should extend Error in order to get proper stack tracing.
        */
        var Promise = (function () {
            /**
            * An ES6 implementation of Promise. Useful for asynchronous programming.
            *
            * @param resolveFunction A IResolveFunction for fulfilling/rejecting the Promise.
            */
            function Promise(resolveFunction) {
                if (!isFunction(resolveFunction)) {
                    throw new TypeError('You must pass a resolver function as the first argument to the promise constructor');
                }

                if (!(this instanceof Promise)) {
                    throw new TypeError('Failed to construct "Promise": ' + 'Please use the "new" operator, this object constructor cannot be called as a function.');
                }

                this.__subscribers = [];

                invokeResolveFunction(resolveFunction, this);
            }
            /**
            * Returns a promise that fulfills when every item in the array is fulfilled.
            * Casts arguments to promises if necessary. The result argument of the
            * returned promise is an array containing the fulfillment result arguments
            * in-order. The rejection argument is the rejection argument of the
            * first-rejected promise.
            *
            * @param promises An array of promises, although every argument is potentially
            * cast to a promise meaning not every item in the array needs to be a promise.
            * @return {Promise<T, U>} A promise that fulfills when every promise in the array
            * has been fulfilled.
            */
            Promise.all = function (promises) {
                if (!isArray(promises)) {
                    throw new TypeError('You must pass an array to all.');
                }

                return new Promise(function (resolve, reject) {
                    var results = [], remaining = promises.length, promise;

                    if (remaining === 0) {
                        resolve([]);
                    }

                    function resolver(index) {
                        return function (value) {
                            resolveAll(index, value);
                        };
                    }

                    function resolveAll(index, value) {
                        results[index] = value;
                        if (--remaining === 0) {
                            resolve(results);
                        }
                    }

                    for (var i = 0; i < promises.length; i++) {
                        promise = promises[i];

                        if (promise && isFunction(promise.then)) {
                            promise.then(resolver(i), reject);
                        } else {
                            resolveAll(i, promise);
                        }
                    }
                });
            };

            /**
            * Creates a promise that fulfills to the passed in object. If the
            * passed-in object is a promise it returns the promise.
            *
            * @param object The object to cast to a Promise.
            */
            Promise.cast = function (object) {
                if (isObject(object) && object.constructor === Promise) {
                    return object;
                }

                return new Promise(function (resolve) {
                    resolve(object);
                });
            };

            /**
            * Returns a promise that fulfills as soon as any of the promises fulfill,
            * or rejects as soon as any of the promises reject (whichever happens first).
            *
            * @param promises An Array of promises to 'race'.
            * @return {Promise<T, U>} A promise that fulfills/rejects when the first promise
            * in promises fulfills/rejects.
            */
            Promise.race = function (promises) {
                if (!isArray(promises)) {
                    throw new TypeError('You must pass an array to race.');
                }

                return new Promise(function (resolve, reject) {
                    var results = [], promise;

                    for (var i = 0; i < promises.length; i++) {
                        promise = promises[i];

                        if (promise && typeof promise.then === 'function') {
                            promise.then(resolve, reject);
                        } else {
                            resolve(promise);
                        }
                    }
                });
            };

            /**
            * Returns a promise that resolves with the input value.
            *
            * @param value The value to resolve.
            * @return {Promise<T, any>} A promise that resolves with value.
            */
            Promise.resolve = function (value) {
                return new Promise(function (resolve, reject) {
                    resolve(value);
                });
            };

            /**
            * Returns a promise that rejects with the input value.
            *
            * @param value The value to reject.
            * @return {Promise<void, U>} A promise that rejects with value.
            */
            Promise.reject = function (reason) {
                return new Promise(function (resolve, reject) {
                    reject(reason);
                });
            };

            /**
            * Takes in two methods, called when/if the promise fulfills/rejects.
            *
            * @param onFulfilled A method called when/if the promise fulills. If undefined the next
            * onFulfilled method in the promise chain will be called.
            * @param onRejected A method called when/if the promise rejects. If undefined the next
            * onRejected method in the promise chain will be called.
            * @return {Promise<T, U>} A Promise used for method chaining.
            */
            Promise.prototype.then = function (onFulfilled, onRejected) {
                var promise = this;

                var thenPromise = new this.constructor(function () {
                }, this);

                if (this.__state) {
                    var callbacks = arguments;
                    config.async(function invokePromiseCallback() {
                        invokeCallback(promise.__state, thenPromise, callbacks[promise.__state - 1], promise.__detail);
                    });
                } else {
                    subscribe(this, thenPromise, onFulfilled, onRejected);
                }

                return thenPromise;
            };

            /**
            * A wrapper method for Promise.then(undefined, onRejected);
            *
            * @param onRejected A method called when/if the promise rejects. If undefined the next
            * onRejected method in the promise chain will be called.
            * @return {Promise<T, U>} A Promise used for method chaining.
            */
            Promise.prototype.catch = function (onRejected) {
                return this.then(null, onRejected);
            };
            return Promise;
        })();
        _async.Promise = Promise;

        

        

        var browserGlobal = (typeof window !== 'undefined') ? window : {};
        var BrowserMutationObserver = browserGlobal.MutationObserver || browserGlobal.WebKitMutationObserver;

        // node
        function useNextTick() {
            return function processNextTick() {
                process.nextTick(flush);
            };
        }

        function useMutationObserver() {
            var observer = new BrowserMutationObserver(flush), $document = acquire('$document'), $window = acquire('$window'), element = $document.createElement('div');

            observer.observe(element, { attributes: true });

            $window.addEventListener('unload', function unloadPromise() {
                observer.disconnect();
                observer = null;
            }, false);

            return function drainQueue() {
                element.setAttribute('drainQueue', 'drainQueue');
            };
        }

        function useSetTimeout() {
            var global = global;
            var local = (typeof global !== 'undefined') ? global : this;
            return function setFlush() {
                local.setTimeout(flush, 1);
            };
        }

        var queue = [];
        function flush() {
            for (var i = 0; i < queue.length; i++) {
                var tuple = queue[i];
                var callback = tuple[0], arg = tuple[1];
                callback(arg);
            }
            queue = [];
        }

        var process = process, scheduleFlush;

        // Decide what async method to use to triggering processing of queued callbacks:
        if (typeof process !== 'undefined' && {}.toString.call(process) === '[object process]') {
            scheduleFlush = useNextTick();
        } else if (BrowserMutationObserver) {
            scheduleFlush = useMutationObserver();
        } else {
            scheduleFlush = useSetTimeout();
        }

        var config = {
            instrument: false,
            async: function (callback, arg) {
                var length = queue.push([callback, arg]);
                if (length === 1) {
                    // If length is 1, that means that we need to schedule an async flush.
                    // If additional callbacks are queued before the queue is flushed, they
                    // will be processed by this flush that we are scheduling.
                    scheduleFlush();
                }
            }
        }, counter = 0;

        function configure(name, value) {
            if (arguments.length === 2) {
                config[name] = value;
            } else {
                return config[name];
            }
        }

        var State;
        (function (State) {
            State[State["PENDING"] = (void 0)] = "PENDING";
            State[State["SEALED"] = 0] = "SEALED";
            State[State["FULFILLED"] = 1] = "FULFILLED";
            State[State["REJECTED"] = 2] = "REJECTED";
        })(State || (State = {}));
        ;

        function invokeResolveFunction(resolveFunction, promise) {
            function resolvePromise(value) {
                resolve(promise, value);
            }

            function rejectPromise(reason) {
                reject(promise, reason);
            }

            try  {
                resolveFunction(resolvePromise, rejectPromise);
            } catch (e) {
                rejectPromise(e);
            }
        }

        function invokeCallback(settled, promise, callback, detail) {
            var hasCallback = isFunction(callback), value, error, succeeded, failed;

            if (hasCallback) {
                try  {
                    value = callback(detail);
                    succeeded = true;
                } catch (e) {
                    failed = true;
                    error = e;
                }
            } else {
                value = detail;
                succeeded = true;
            }

            if (handleThenable(promise, value)) {
                return;
            } else if (hasCallback && succeeded) {
                resolve(promise, value);
            } else if (failed) {
                reject(promise, error);
            } else if (settled === 1 /* FULFILLED */) {
                resolve(promise, value);
            } else if (settled === 2 /* REJECTED */) {
                reject(promise, value);
            }
        }

        function subscribe(parent, child, onFulfilled, onRejected) {
            var subscribers = parent.__subscribers;
            var length = subscribers.length;

            subscribers[length] = child;
            subscribers[length + 1 /* FULFILLED */] = onFulfilled;
            subscribers[length + 2 /* REJECTED */] = onRejected;
        }

        function publish(promise, settled) {
            var subscribers = promise.__subscribers, detail = promise.__detail, child, callback;

            for (var i = 0; i < subscribers.length; i += 3) {
                child = subscribers[i];
                callback = subscribers[i + settled];

                invokeCallback(settled, child, callback, detail);
            }

            promise.__subscribers = null;
        }

        function handleThenable(promise, value) {
            var then = null, resolved;

            try  {
                if (promise === value) {
                    throw new TypeError('A promises callback cannot return that same promise.');
                }

                if (isObject(value) || isFunction(value)) {
                    then = value.then;

                    if (isFunction(then)) {
                        then.call(value, function (val) {
                            if (resolved) {
                                return true;
                            }
                            resolved = true;

                            if (value !== val) {
                                resolve(promise, val);
                            } else {
                                fulfill(promise, val);
                            }
                        }, function (val) {
                            if (resolved) {
                                return true;
                            }
                            resolved = true;

                            reject(promise, val);
                        });

                        return true;
                    }
                }
            } catch (error) {
                if (resolved) {
                    return true;
                }
                reject(promise, error);
                return true;
            }

            return false;
        }

        function resolve(promise, value) {
            if (promise === value) {
                fulfill(promise, value);
            } else if (!handleThenable(promise, value)) {
                fulfill(promise, value);
            }
        }

        function fulfill(promise, value) {
            if (promise.__state !== State.PENDING) {
                return;
            }
            promise.__state = 0 /* SEALED */;
            promise.__detail = value;

            config.async(publishFulfillment, promise);
        }

        function reject(promise, reason) {
            if (promise.__state !== State.PENDING) {
                return;
            }
            promise.__state = 0 /* SEALED */;
            promise.__detail = reason;

            config.async(publishRejection, promise);
        }

        function publishFulfillment(promise) {
            publish(promise, promise.__state = 1 /* FULFILLED */);
        }

        function publishRejection(promise) {
            publish(promise, promise.__state = 2 /* REJECTED */);
        }

        

        function PromiseStatic() {
            return Promise;
        }
        _async.PromiseStatic = PromiseStatic;

        register.injectable('$PromiseStatic', PromiseStatic, null, register.injectableType.STATIC);

        /**
        * HttpRequest provides a wrapper for the XmlHttpRequest object. Allows for
        * sending AJAX requests to a server. This class does not support
        * synchronous requests.
        */
        var HttpRequest = (function () {
            /**
            * @param options The IAjaxOptions used to customize this Http.
            */
            function HttpRequest(options) {
                /**
                * The plat.IBrowser injectable instance
                */
                this.$browser = acquire('$browser');
                /**
                * The injectable instance of type Window
                */
                this.$window = acquire('$window');
                /**
                * The injectable instance of type Document
                */
                this.$document = acquire('$document');
                /**
                * The configuration for an HTTP Request
                */
                this.$config = acquire('$http.config');
                this.__options = extend({}, this.$config, options);
            }
            /**
            * Performs either the XmlHttpRequest or the JSONP callback and returns an AjaxPromise.
            * The Promise is fulfilled or rejected when either the XmlHttpRequest returns or the
            * JSONP callback is fired.
            *
            * @return {AjaxPromise} A promise that fulfills/rejects
            * when either the XmlHttpRequest returns (Response statuses >= 200 and < 300 are a success.
            * Other response statuses are failures) or the JSONP callback is fired.
            */
            HttpRequest.prototype.execute = function () {
                var options = this.__options, url = options.url;

                if (!isString(url) || isEmpty(url.trim())) {
                    return this._invalidOptions();
                }

                options.url = this.$browser.urlUtils(url).toString();

                var isCrossDomain = options.isCrossDomain || false, xDomain = false, xhr;

                // check if forced cross domain call or cors is not supported (IE9)
                if (isCrossDomain) {
                    xDomain = true;
                } else {
                    xhr = this.xhr = new XMLHttpRequest();
                    if (isUndefined(xhr.withCredentials)) {
                        xDomain = this.$browser.isCrossDomain(url);
                    }
                }

                if (xDomain) {
                    this.xhr = null;
                    this.jsonpCallback = options.jsonpCallback || uniqueId('plat_callback');
                    return this.executeJsonp();
                }

                return this._sendXhrRequest(xhr);
            };

            /**
            * Adds the script tag and processes the callback for the JSONP and returns a
            * Promise. The Promise is fulfilled or rejected when the JSONP callback is called.
            *
            * @return {Promise<IAjaxResponse>} A promise that fulfills with the
            * JSONP callback and rejects if there is a problem.
            */
            HttpRequest.prototype.executeJsonp = function () {
                var _this = this;
                var options = this.__options, url = options.url;

                if (!isString(url) || isEmpty(url.trim())) {
                    return this._invalidOptions();
                }

                options.url = this.$browser.urlUtils(url).toString();

                return new AjaxPromise(function (resolve, reject) {
                    var scriptTag = _this.$document.createElement('script'), jsonpCallback = _this.jsonpCallback || uniqueId('plat_callback'), jsonpIdentifier = options.jsonpIdentifier || 'callback';

                    scriptTag.src = url + '?' + jsonpIdentifier + '=' + jsonpCallback;

                    var oldValue = _this.$window[jsonpCallback];
                    _this.$window[jsonpCallback] = function (response) {
                        //clean up
                        if (isFunction(_this.clearTimeout)) {
                            _this.clearTimeout();
                        }

                        _this.$document.head.removeChild(scriptTag);
                        if (!isUndefined(oldValue)) {
                            _this.$window[jsonpCallback] = oldValue;
                        } else {
                            delete _this.$window[jsonpCallback];
                        }

                        //call callback
                        resolve({
                            response: response,
                            status: 200
                        });
                    };

                    _this.$document.head.appendChild(scriptTag);

                    var timeout = options.timeout;
                    if (isNumber(timeout) && timeout > 0) {
                        // We first postpone to avoid always timing out when debugging, though this is not
                        // a foolproof method.
                        _this.clearTimeout = postpone(function () {
                            _this.clearTimeout = defer(function () {
                                reject(new AjaxError({
                                    response: 'Request timed out in ' + timeout + 'ms for ' + url,
                                    status: 408
                                }));
                                _this.$window[jsonpCallback] = noop;
                            }, timeout - 1);
                        });
                    }
                }, { __http: this });
            };

            /**
            * A wrapper for the XMLHttpRequest's onReadyStateChanged callback.
            *
            * @param {XMLHttpRequest} The associated XMLHttpRequest
            * @return {bool} Waits for the readyState to be complete and then
            * return true in the case of a success and false in the case of
            * an error.
            */
            HttpRequest.prototype._xhrOnReadyStateChange = function (xhr) {
                if (xhr.readyState === 4) {
                    var status = xhr.status, response = xhr.response || xhr.responseText;

                    if (status === 0) {
                        // file protocol issue **Needs to be tested more thoroughly**
                        // OK if response is not empty, Not Found otherwise
                        if (!isEmpty(response)) {
                            return true;
                        }

                        return false;
                    }

                    // 304 is not modified
                    if ((status >= 200 && status < 300) || status === 304) {
                        return true;
                    } else {
                        return false;
                    }
                } else {
                    // TODO: add progress for xhr if we choose to add progress to AjaxPromise
                }
            };

            /**
            * The function that initializes and sends the XMLHttpRequest.
            *
            * @param {XMLHttpRequest} The associated XMLHttpRequest
            * @return {Promise<IAjaxResponse>} A promise that fulfills with the
            * formatted IAjaxResponse and rejects if there is a problem with an
            * IAjaxError.
            */
            HttpRequest.prototype._sendXhrRequest = function (xhr) {
                var _this = this;
                var options = this.__options, method = options.method, url = options.url;

                return new AjaxPromise(function (resolve, reject) {
                    xhr.onreadystatechange = function () {
                        var success = _this._xhrOnReadyStateChange(xhr);

                        if (isNull(success)) {
                            return;
                        }

                        var response = _this._formatResponse(xhr);

                        if (success) {
                            resolve(response);
                        } else {
                            reject(new AjaxError(response));
                        }
                    };

                    if (!isString(method)) {
                        var Exception = acquire('$ExceptionStatic');
                        Exception.warn('AjaxOptions method was not of type string. Defaulting to "GET".', Exception.AJAX);
                        method = 'GET';
                    }

                    xhr.open(method.toUpperCase(), url, true, options.user, options.password);

                    xhr.responseType = options.responseType;
                    xhr.withCredentials = options.withCredentials;

                    var headers = options.headers, keys = Object.keys(isObject(headers) ? headers : {}), length = keys.length, key;

                    for (var i = 0; i < length; ++i) {
                        key = keys[i];
                        xhr.setRequestHeader(key, options.headers[key]);
                    }

                    var data = options.data;
                    if (isEmpty(data)) {
                        xhr.send();
                    } else {
                        // Set the Content-Type header if data is being sent
                        xhr.setRequestHeader('Content-Type', options.contentType);
                        xhr.send(data);
                    }

                    var timeout = options.timeout;
                    if (isNumber(timeout) && timeout > 0) {
                        // We first postpone to avoid always timing out when debugging, though this is not
                        // a foolproof method.
                        _this.clearTimeout = postpone(function () {
                            _this.clearTimeout = defer(function () {
                                reject(new AjaxError({
                                    response: 'Request timed out in ' + timeout + 'ms for ' + options.url,
                                    status: xhr.status,
                                    getAllResponseHeaders: xhr.getAllResponseHeaders,
                                    xhr: xhr
                                }));

                                xhr.onreadystatechange = null;
                                xhr.abort();
                                xhr = null;
                            }, timeout - 1);
                        }, null);
                    }
                }, { __http: this });
            };

            /**
            * Returns a promise that is immediately rejected due to an error.
            *
            * @return {Promise<IAjaxResponse>} A promise that immediately rejects
            * with an IAjaxError
            */
            HttpRequest.prototype._invalidOptions = function () {
                return new AjaxPromise(function (resolve, reject) {
                    var exceptionFactory = acquire('$ExceptionStatic');
                    exceptionFactory.warn('Attempting a request without specifying a url', exceptionFactory.AJAX);
                    reject(new AjaxError({
                        response: 'Attempting a request without specifying a url',
                        status: null,
                        getAllResponseHeaders: null,
                        xhr: null
                    }));
                });
            };

            /**
            * The function that formats the response from the XMLHttpRequest
            *
            * @param {XMLHttpRequest} The associated XMLHttpRequest
            * @param {bool} Signifies if the response was a success
            * @return {IAjaxResponse} The IAjaxResponse to be returned to
            * the requester.
            */
            HttpRequest.prototype._formatResponse = function (xhr, success) {
                var status = xhr.status, response = xhr.response || xhr.responseText;

                if (status === 0) {
                    // file protocol issue **Needs to be tested more thoroughly**
                    // OK if response empty, Not Found otherwise
                    status = success ? 200 : 404;
                }

                xhr.onreadystatechange = null;

                if (isFunction(this.clearTimeout)) {
                    this.clearTimeout();
                }

                if (this.__options.responseType === 'json' && isString(response)) {
                    try  {
                        response = JSON.parse(response);
                    } catch (e) {
                    }
                }

                return {
                    response: response,
                    status: status,
                    getAllResponseHeaders: xhr.getAllResponseHeaders,
                    xhr: xhr
                };
            };
            return HttpRequest;
        })();

        

        

        

        

        

        /**
        * A class that forms an Error object with an IAjaxResponse.
        */
        var AjaxError = (function () {
            function AjaxError(response) {
                this.name = 'AjaxError';
                Error.apply(this);
                this.response = this.message = response.response;
                this.status = response.status;
                this.getAllResponseHeaders = response.getAllResponseHeaders;
                this.xhr = response.xhr;
            }
            AjaxError.prototype.toString = function () {
                var response = this.response, responseText = response;

                if (isObject(response) && !response.hasOwnProperty('toString')) {
                    responseText = JSON.stringify(response);
                }

                return 'Request failed with status: ' + this.status + ' and response: ' + responseText;
            };
            return AjaxError;
        })();

        // Have to bypass TS flags in order to properly extend Error
        AjaxError['prototype'] = Error.prototype;

        

        /**
        * Describes a type of Promise that fulfills with an IAjaxResponse and can be optionally canceled.
        */
        var AjaxPromise = (function (_super) {
            __extends(AjaxPromise, _super);
            function AjaxPromise(resolveFunction, promise) {
                _super.call(this, resolveFunction);
                this.$window = acquire('$window');
                if (!isNull(promise)) {
                    this.__http = promise.__http;
                }
            }
            /**
            * A method to cancel the AJAX call associated with this AjaxPromise.
            */
            AjaxPromise.prototype.cancel = function () {
                var http = this.__http, xhr = http.xhr, jsonpCallback = http.jsonpCallback;

                if (isFunction(http.clearTimeout)) {
                    http.clearTimeout();
                }

                if (!isNull(xhr)) {
                    xhr.onreadystatechange = null;
                    xhr.abort();
                } else if (!isNull(jsonpCallback)) {
                    this.$window[jsonpCallback] = noop;
                }

                this.__subscribers = [];
            };

            /**
            * Takes in two methods, called when/if the promise fulfills/rejects.
            *
            * @param onFulfilled A method called when/if the promise fulills. If undefined the next
            * onFulfilled method in the promise chain will be called.
            * @param onRejected A method called when/if the promise rejects. If undefined the next
            * onRejected method in the promise chain will be called.
            * @return {AjaxPromise} A Promise used for method chaining.
            */
            AjaxPromise.prototype.then = function (onFulfilled, onRejected) {
                return _super.prototype.then.call(this, onFulfilled, onRejected);
            };
            return AjaxPromise;
        })(Promise);

        

        

        

        /**
        * The instantiated class of the injectable for making
        * AJAX requests.
        */
        var Http = (function () {
            function Http() {
                /**
                * HttpResponseType mapping
                */
                this.responseType = {
                    DEFAULT: '',
                    ARRAYBUFFER: 'arraybuffer',
                    BLOB: 'blob',
                    DOCUMENT: 'document',
                    JSON: 'json',
                    TEXT: 'text'
                };
            }
            /**
            * A wrapper method for the Http class that creates and executes a new Http with
            * the specified IAjaxOptions. This function will check if
            * XMLHttpRequest level 2 is present, and will default to JSONP if it isn't and
            * the request is cross-domain.
            *
            * @param options The IAjaxOptions for either the XMLHttpRequest
            * or the JSONP callback.
            */
            Http.prototype.ajax = function (options) {
                return new HttpRequest(options).execute();
            };

            /**
            * A direct method to force a cross-domain JSONP request.
            *
            * @param options The IJsonpOptions
            */
            Http.prototype.jsonp = function (options) {
                return new HttpRequest(options).executeJsonp();
            };

            /**
            * Makes an ajax request, specifying responseType:
            * utils.XMLHttpRequestResponseType.json.
            *
            * @param options The IAjaxOptions for either the XMLHttpRequest
            * or the JSONP callback.
            * @return {AjaxPromise} A promise, when fulfilled or rejected,
            * will return an IAjaxResponse object, with the response being a parsed
            * JSON object (assuming valid JSON).
            */
            Http.prototype.json = function (options) {
                return new HttpRequest(extend({}, options, { responseType: 'json' })).execute();
            };
            Http.config = {
                url: null,
                method: 'GET',
                responseType: '',
                headers: {},
                withCredentials: false,
                timeout: null,
                jsonpIdentifier: 'callback',
                contentType: 'application/x-www-form-urlencoded; charset=UTF-8;'
            };
            return Http;
        })();
        _async.Http = Http;

        register.injectable('$http', Http);

        function HttpConfigStatic() {
            return Http.config;
        }
        _async.HttpConfigStatic = HttpConfigStatic;

        register.injectable('$http.config', HttpConfigStatic, null, register.injectableType.STATIC);
    })(plat.async || (plat.async = {}));
    var async = plat.async;
    (function (storage) {
        var caches = {};
        var internalCaches = {};

        /**
        * A Cache class, for use with the CacheFactory. Used for storing objects.
        * Takes in a generic type corresponding to the type of objects it contains.
        *
        */
        var Cache = (function () {
            /**
            * @param id The id to use to retrieve the cache from the CacheFactory.
            * @param options The ICacheOptions for customizing the cache.
            */
            function Cache(id, options) {
                this.__id = id;
                this.__options = options;

                if (options === null || options === undefined) {
                    this.__options = {
                        timeout: 0
                    };
                }

                internalCaches[id] = {};
            }
            /**
            * Method for creating a new Cache. Takes a generic type to denote the
            * type of objects stored in the new Cache.  If the Cache already exists
            * in the CacheFactory, a new Cache will not be created.
            *
            * @param id The id of the new Cache.
            * @param options ICacheOptions for customizing the Cache.
            * @param cacheDependency A string representing the injectable name for an
            * ICache. The CacheFactory will create a new ICache by acquiring the
            * injectable.
            *
            * @return {Cache} The newly created Cache object.
            */
            Cache.create = function (id, options) {
                var cache = caches[id];

                if (cache === null || cache === undefined) {
                    cache = caches[id] = new Cache(id, options);
                }

                return cache;
            };

            /**
            * Gets a cache out of the CacheFactory if it exists.
            *
            * @param id The identifier used to search for the cache.
            *
            * @returns {Cache|null}
            */
            Cache.fetch = function (id) {
                return caches[id];
            };

            /**
            * Clears the CacheFactory and all of its caches.
            */
            Cache.clear = function () {
                var keys = Object.keys(caches), length = keys.length;

                for (var i = 0; i < length; ++i) {
                    caches[keys[i]].clear();
                }

                caches = {};
            };

            /**
            * Method for accessing information about the cache.
            *
            * @return {ICacheInfo}
            */
            Cache.prototype.info = function () {
                return {
                    id: this.__id,
                    size: this.__size,
                    options: this.__options
                };
            };

            /**
            * Method for inserting an object into the cache.
            *
            * @param key The key to use for storage/retrieval of the object.
            * @param value The value to store with the associated key.
            *
            * @return {T} The value inserted into the cache.
            */
            Cache.prototype.put = function (key, value) {
                var val = internalCaches[this.__id][key];
                internalCaches[this.__id][key] = value;

                if (isUndefined(val)) {
                    this.__size++;
                }

                var timeout = this.__options.timeout;

                if (isNumber(timeout) && timeout > 0) {
                    defer(this.remove, timeout, [key], this);
                }

                return value;
            };

            /**
            * Method for retrieving an object from the cache.
            *
            * @param key The key to search for in the cache.
            *
            * @return {T|null} The value found at the associated key. Returns null for a cache miss.
            */
            Cache.prototype.read = function (key) {
                return internalCaches[this.__id][key];
            };

            /**
            * Method for removing an object from the cache.
            *
            * @param key The key to remove from the cache.
            */
            Cache.prototype.remove = function (key) {
                internalCaches[this.__id][key] = null;
                delete internalCaches[this.__id][key];
                this.__size--;
            };

            /**
            * Method for clearing the cache, removing all of its keys.
            */
            Cache.prototype.clear = function () {
                internalCaches[this.__id] = {};
                this.__size = 0;
            };

            /**
            * Method for removing a cache from the CacheFactory.
            */
            Cache.prototype.dispose = function () {
                this.clear();
                caches[this.__id] = null;
                delete caches[this.__id];
            };
            return Cache;
        })();
        storage.Cache = Cache;

        function CacheStatic() {
            return Cache;
        }
        storage.CacheStatic = CacheStatic;

        register.injectable('$CacheStatic', CacheStatic, null, register.injectableType.STATIC);

        var managerCache = Cache.create('managerCache');

        function ManagerCacheStatic() {
            return managerCache;
        }
        storage.ManagerCacheStatic = ManagerCacheStatic;

        register.injectable('$ManagerCacheStatic', ManagerCacheStatic, null, register.injectableType.STATIC);

        

        

        

        

        /**
        * Used for caching compiled nodes. This class will
        * clone a template when you put it in the cache. It will
        * also clone the template when you retrieve it.
        */
        var TemplateCache = (function (_super) {
            __extends(TemplateCache, _super);
            function TemplateCache() {
                _super.call(this, '__templateCache');
                this.$ExceptionStatic = acquire('$ExceptionStatic');
            }
            /**
            * Takes in a Node or a Promise. If the value is a
            * Node, the node will be cloned and put into the cache.
            *
            * @param key The key used to store the value.
            * @param value The template promise or Node.
            */
            TemplateCache.prototype.put = function (key, value) {
                _super.prototype.put.call(this, key, value);

                if (isNode(value)) {
                    value = value.cloneNode(true);
                }

                return value;
            };

            /**
            * Method for retrieving a Node from a TemplateCache. If a Node
            * is found in the cache, it will be cloned.
            *
            * @param key The key to search for in a TemplateCache.
            *
            * @return {T|async.IPromise<T, Error>} The value found at the associated key.
            * Returns null for an ITemplateCache miss.
            */
            TemplateCache.prototype.read = function (key) {
                var _this = this;
                var template = _super.prototype.read.call(this, key);

                if (isNull(template)) {
                    return template;
                } else if (isNode(template)) {
                    return template.cloneNode(true);
                }

                return template.then(function (node) {
                    return _this.put(key, node).cloneNode(true);
                }).catch(function (error) {
                    _this.$ExceptionStatic.warn('Error retrieving template from promise.', _this.$ExceptionStatic.TEMPLATE);
                });
            };
            return TemplateCache;
        })(Cache);

        register.injectable('$templateCache', TemplateCache);

        

        var BaseStorage = (function () {
            function BaseStorage() {
                forEach(this.storage, function (value, key) {
                    this[key] = value;
                }, this);
            }
            Object.defineProperty(BaseStorage.prototype, "length", {
                /**
                * Returns the number of items in storage.
                */
                get: function () {
                    return this.storage.length;
                },
                enumerable: true,
                configurable: true
            });

            /**
            * Clears storage, deleting all of its keys.
            */
            BaseStorage.prototype.clear = function () {
                this.storage.clear();
            };

            /**
            * Gets an item out of local storage with the assigned key.
            *
            * @param key The key of the item to retrieve from storage.
            * @return {T} The item retrieved from storage.
            */
            BaseStorage.prototype.getItem = function (key) {
                return this.storage.getItem(key);
            };

            /**
            * Allows for iterating over storage keys with an index. When
            * called with an index, it will return the key at that index in
            * storage.
            *
            * @param index The index used to retrieve the associated key.
            * @return {string} The key at the given index.
            */
            BaseStorage.prototype.key = function (index) {
                return this.storage.key(index);
            };

            /**
            * Searches in this.storage for an item and removes it if it
            * exists.
            *
            * @param key the Key of the item to remove from this.storage.
            */
            BaseStorage.prototype.removeItem = function (key) {
                this.storage.removeItem(key);
            };

            /**
            * Adds data to storage with the designated key.
            *
            * @param key The key of the item to store in storage.
            * @param data The data to store in storage with the key.
            */
            BaseStorage.prototype.setItem = function (key, data) {
                this.storage.setItem(key, data);
                this[key] = this.getItem(key);
            };
            return BaseStorage;
        })();
        storage.BaseStorage = BaseStorage;

        var LocalStorage = (function (_super) {
            __extends(LocalStorage, _super);
            function LocalStorage() {
                _super.apply(this, arguments);
                this.storage = acquire('$window').localStorage;
            }
            return LocalStorage;
        })(BaseStorage);
        storage.LocalStorage = LocalStorage;

        register.injectable('$localStorage', LocalStorage);

        

        var SessionStorage = (function (_super) {
            __extends(SessionStorage, _super);
            function SessionStorage() {
                _super.apply(this, arguments);
                this.storage = acquire('$window').sessionStorage;
            }
            return SessionStorage;
        })(BaseStorage);
        storage.SessionStorage = SessionStorage;

        register.injectable('$sessionStorage', SessionStorage);

        
    })(plat.storage || (plat.storage = {}));
    var storage = plat.storage;

    /**
    * An object used to create ITokenDetails for every operator.
    */
    var OPERATORS = {
        'u+': {
            precedence: 4, associativity: 'rtl',
            fn: function unaryPlus(context, aliases, a) {
                return +a(context, aliases);
            }
        },
        '+': {
            precedence: 6, associativity: 'ltr',
            fn: function add(context, aliases, a, b) {
                return a(context, aliases) + b(context, aliases);
            }
        },
        'u-': {
            precedence: 4, associativity: 'rtl',
            fn: function unaryMinus(context, aliases, a) {
                return -a(context, aliases);
            }
        },
        '-': {
            precedence: 6, associativity: 'ltr',
            fn: function subtract(context, aliases, a, b) {
                return a(context, aliases) - b(context, aliases);
            }
        },
        '*': {
            precedence: 5, associativity: 'ltr',
            fn: function multiply(context, aliases, a, b) {
                return a(context, aliases) * b(context, aliases);
            }
        },
        '/': {
            precedence: 5, associativity: 'ltr',
            fn: function divide(context, aliases, a, b) {
                return a(context, aliases) / b(context, aliases);
            }
        },
        '%': {
            precedence: 5, associativity: 'ltr',
            fn: function modulus(context, aliases, a, b) {
                return a(context, aliases) % b(context, aliases);
            }
        },
        '?': {
            precedence: 15, associativity: 'rtl',
            fn: function question(context, aliases) {
            }
        },
        ':': {
            precedence: 15, associativity: 'rtl',
            fn: function colon(context, aliases) {
            }
        },
        '>': {
            precedence: 8, associativity: 'ltr',
            fn: function greaterThan(context, aliases, a, b) {
                return a(context, aliases) > b(context, aliases);
            }
        },
        '<': {
            precedence: 8, associativity: 'ltr',
            fn: function lessThan(context, aliases, a, b) {
                return a(context, aliases) < b(context, aliases);
            }
        },
        '!': {
            precedence: 4, associativity: 'rtl',
            fn: function logicalNot(context, aliases, a) {
                return !a(context, aliases);
            }
        },
        '~': {
            precedence: 4, associativity: 'rtl',
            fn: function bitwiseNot(context, aliases, a) {
                return ~a(context, aliases);
            }
        },
        '&': {
            precedence: 10, associativity: 'ltr',
            fn: function bitwiseAnd(context, aliases, a, b) {
                return a(context, aliases) & b(context, aliases);
            }
        },
        '|': {
            precedence: 12, associativity: 'ltr',
            fn: function bitwiseOr(context, aliases, a, b) {
                return a(context, aliases) | b(context, aliases);
            }
        },
        '>>': {
            precedence: 7, associativity: 'ltr',
            fn: function bitwiseShiftRight(context, aliases, a, b) {
                return a(context, aliases) >> b(context, aliases);
            }
        },
        '<<': {
            precedence: 7, associativity: 'ltr',
            fn: function bitwiseShiftLeft(context, aliases, a, b) {
                return a(context, aliases) << b(context, aliases);
            }
        },
        '>>>': {
            precedence: 7, associativity: 'ltr',
            fn: function bitwiseUnsignedShiftRight(context, aliases, a, b) {
                return a(context, aliases) >>> b(context, aliases);
            }
        },
        '&&': {
            precedence: 13, associativity: 'ltr',
            fn: function logicalAnd(context, aliases, a, b) {
                return a(context, aliases) && b(context, aliases);
            }
        },
        '||': {
            precedence: 14, associativity: 'ltr',
            fn: function logicalOr(context, aliases, a, b) {
                return a(context, aliases) || b(context, aliases);
            }
        },
        '==': {
            precedence: 9, associativity: 'ltr',
            /* tslint:disable:triple-equals */
            fn: function isEquivalent(context, aliases, a, b) {
                return a(context, aliases) == b(context, aliases);
            }
        },
        '===': {
            precedence: 9, associativity: 'ltr',
            fn: function is(context, aliases, a, b) {
                return a(context, aliases) === b(context, aliases);
            }
        },
        '!=': {
            precedence: 9, associativity: 'ltr',
            /* tslint:disable:triple-equals */
            fn: function isNotEquivalent(context, aliases, a, b) {
                return a(context, aliases) != b(context, aliases);
            }
        },
        '!==': {
            precedence: 9, associativity: 'ltr',
            fn: function isNot(context, aliases, a, b) {
                return a(context, aliases) !== b(context, aliases);
            }
        },
        '>=': {
            precedence: 8, associativity: 'ltr',
            fn: function greaterThanOrEqual(context, aliases, a, b) {
                return a(context, aliases) >= b(context, aliases);
            }
        },
        '<=': {
            precedence: 8, associativity: 'ltr',
            fn: function lessThanOrEqual(context, aliases, a, b) {
                return a(context, aliases) <= b(context, aliases);
            }
        },
        '=': {
            precedence: 17, associativity: 'rtl',
            fn: function equals(context, aliases, a, b) {
                var Exception = acquire('$ExceptionStatic');
                Exception.fatal('Assignment operators are not supported', Exception.PARSE);
            }
        },
        '++': {
            precedence: 3, associativity: '',
            fn: function increment(context, aliases, a) {
                var Exception = acquire('$ExceptionStatic');
                Exception.fatal('Assignment operators are not supported', Exception.PARSE);
            }
        },
        '--': {
            precedence: 3, associativity: '',
            fn: function decrement(context, aliases, a) {
                var Exception = acquire('$ExceptionStatic');
                Exception.fatal('Assignment operators are not supported', Exception.PARSE);
            }
        },
        '+=': {
            precedence: 17, associativity: 'rtl',
            fn: function addAssignment(context, aliases, a, b) {
                var Exception = acquire('$ExceptionStatic');
                Exception.fatal('Assignment operators are not supported', Exception.PARSE);
            }
        },
        '-=': {
            precedence: 17, associativity: 'rtl',
            fn: function subtractAssignment(context, aliases, a, b) {
                var Exception = acquire('$ExceptionStatic');
                Exception.fatal('Assignment operators are not supported', Exception.PARSE);
            }
        },
        '*=': {
            precedence: 17, associativity: 'rtl',
            fn: function multiplyAssignment(context, aliases, a, b) {
                var Exception = acquire('$ExceptionStatic');
                Exception.fatal('Assignment operators are not supported', Exception.PARSE);
            }
        },
        '/=': {
            precedence: 17, associativity: 'rtl',
            fn: function divideAssignment(context, aliases, a, b) {
                var Exception = acquire('$ExceptionStatic');
                Exception.fatal('Assignment operators are not supported', Exception.PARSE);
            }
        },
        '%=': {
            precedence: 17, associativity: 'rtl',
            fn: function modulusAssignment(context, aliases, a, b) {
                var Exception = acquire('$ExceptionStatic');
                Exception.fatal('Assignment operators are not supported', Exception.PARSE);
            }
        },
        '.': { precedence: 2, associativity: 'ltr', fn: function index(context, aliases, a, b) {
                return a[b];
            } }
    };

    /**
    * An object used to create ITokenDetails for every accessor.
    */
    var ACCESSORS = {
        '()': { precedence: 2, associativity: null, fn: null },
        '[]': { precedence: 2, associativity: null, fn: null },
        '.': { precedence: 2, associativity: null, fn: null },
        '{}': { precedence: 1, associativity: null, fn: null }
    };

    /**
    * An object used to create ITokenDetails for every delimiter.
    */
    var DELIMITERS = {
        '{': { precedence: 1, associativity: null, fn: null },
        '}': { precedence: 1, associativity: null, fn: null },
        '[': { precedence: 2, associativity: null, fn: null },
        ']': { precedence: 2, associativity: null, fn: null },
        '(': { precedence: 2, associativity: null, fn: null },
        ')': { precedence: 2, associativity: null, fn: null },
        '.': { precedence: 2, associativity: null, fn: null },
        ',': { precedence: 18, associativity: null, fn: null },
        '\'': { precedence: 0, associativity: null, fn: null },
        '"': { precedence: 0, associativity: null, fn: null }
    };

    /**
    * An object used to get literal values from string values of false, true, and undefined
    */
    var KEYWORDS = {
        'false': false,
        'true': true,
        'null': null,
        'undefined': 'undefined'
    };

    /**
    * Checks if a string is in the DELIMITERS array.
    *
    * @param key The string to index into the DELIMITERS array.
    * @return {Boolean}
    */
    function isDelimiter(key) {
        return !isNull(DELIMITERS[key]);
    }

    /**
    * Checks if a string is in the ACCESSORS array.
    *
    * @param key The string to index into the ACCESSORS array.
    * @return {Boolean}
    */
    function isAccessor(key) {
        return !isNull(ACCESSORS[key]);
    }

    /**
    * Checks if a string is in the OPERATORS array.
    *
    * @param key The string to index into the OPERATORS array.
    * @return {Boolean}
    */
    function isOperator(key) {
        return !isNull(OPERATORS[key]);
    }

    /**
    * Checks if a string is in the KEYWORDS array.
    *
    * @param key The string to index into the KEYWORDS array.
    * @return {Boolean}
    */
    function isKeyword(key) {
        return !isUndefined(KEYWORDS[key]);
    }

    (function (observable) {
        var arrayMethods = ['push', 'pop', 'reverse', 'shift', 'sort', 'splice', 'unshift'];

        /**
        * Manages observable properties on control.
        * Facilitates in data-binding and managing context inheritance.
        */
        var ContextManager = (function () {
            function ContextManager() {
                this.$ContextManagerStatic = acquire('$ContextManagerStatic');
                this.$compat = acquire('$compat');
                this.$ExceptionStatic = acquire('$ExceptionStatic');
                this.__identifiers = {};
                this.__identifierHash = {};
                this.__contextObjects = {};
                this.__isArrayFunction = false;
            }
            ContextManager.getManager = function (control) {
                var contextManager, managers = ContextManager.__managers, uid = control.uid, manager = managers[uid];

                if (!isNull(manager)) {
                    contextManager = manager;
                    return contextManager;
                }

                contextManager = managers[uid] = new ContextManager();
                contextManager.context = control;

                return contextManager;
            };

            ContextManager.dispose = function (control, persist) {
                if (isNull(control)) {
                    return;
                }

                var uid = control.uid, controls = ContextManager.__controls, identifiers = controls[uid], managers = ContextManager.__managers, manager = managers[uid];

                if (!isNull(manager)) {
                    manager.dispose();
                    managers[uid] = null;
                    delete managers[uid];
                }

                if (isNull(identifiers)) {
                    return;
                }

                var keys = Object.keys(identifiers), identifier, listeners, i, j, jLength;

                while (keys.length > 0) {
                    identifier = keys.shift();
                    listeners = identifiers[identifier];
                    jLength = listeners.length;
                    for (j = 0; j < jLength; ++j) {
                        listeners[j](identifier, uid);
                    }
                }

                var arrayListeners = ContextManager.observedArrayListeners, remove = ContextManager.removeArrayListeners;

                keys = Object.keys(arrayListeners);
                length = keys.length;

                for (i = 0; i < length; ++i) {
                    remove(keys[i], uid);
                }

                controls[uid] = null;
                delete controls[uid];

                if (!isNull(control.context)) {
                    ContextManager.defineProperty(control, 'context', persist ? deepExtend({}, control.context) : null, true, true);
                }
            };

            /**
            * Removes all listeners for an Array associated with a given uid.
            *
            * @static
            * @param absoluteIdentifier The identifier used to locate the array.
            * @param uid The uid used to search for listeners.
            */
            ContextManager.removeArrayListeners = function (absoluteIdentifier, uid) {
                var listeners = ContextManager.observedArrayListeners[absoluteIdentifier];

                if (!isNull(listeners)) {
                    listeners[uid] = null;
                    delete listeners[uid];
                }
            };

            /**
            * Safely retrieves the local context given a root context and an Array of
            * property strings.
            *
            * @static
            * @param rootContext The root object in which to find a local context.
            * @param split The string array containing properties used to index into
            * the rootContext.
            */
            ContextManager.getContext = function (rootContext, split) {
                split = split.slice(0);
                if (isNull(rootContext)) {
                    return null;
                }
                while (split.length > 0) {
                    rootContext = rootContext[split.shift()];
                    if (isNull(rootContext)) {
                        return null;
                    }
                }

                return rootContext;
            };

            /**
            * Defines an object property with the associated value. Useful for unobserving objects.
            *
            * @param obj The object on which to define the property.
            * @param key The property key.
            * @param value The value used to define the property.
            * @param enumerable Whether or not the property should be enumerable (able to be iterated
            * over in a loop)
            * @param configurable Whether or not the property is able to be reconfigured.
            */
            ContextManager.defineProperty = function (obj, key, value, enumerable, configurable) {
                Object.defineProperty(obj, key, {
                    value: value,
                    enumerable: !!enumerable,
                    configurable: !!configurable
                });
            };
            ContextManager.defineGetter = function (obj, key, value, enumerable, configurable) {
                Object.defineProperty(obj, key, {
                    get: function () {
                        return value;
                    },
                    enumerable: !!enumerable,
                    configurable: !!configurable
                });
            };
            ContextManager.pushRemoveListener = function (identifier, uid, listener) {
                var controls = ContextManager.__controls, control = controls[uid], listeners;

                if (isNull(control)) {
                    control = controls[uid] = {};
                }

                listeners = control[identifier];

                if (isNull(listeners)) {
                    listeners = control[identifier] = [];
                }

                listeners.push(listener);
            };
            ContextManager.removeIdentifier = function (uids, identifier) {
                var length = uids.length, controls = ContextManager.__controls, uid, identifiers;

                for (var i = 0; i < length; ++i) {
                    uid = uids[i];

                    identifiers = controls[uid];

                    if (isNull(identifiers)) {
                        continue;
                    }

                    identifiers[identifier] = null;
                    delete identifiers[identifier];
                }
            };

            /**
            * Safely retrieves the local context for this ContextManager given an Array of
            * property strings.
            *
            * @param split The string array containing properties used to index into
            * the context.
            */
            ContextManager.prototype.getContext = function (split) {
                var join = split.join('.'), context = this.__contextObjects[join];

                if (isNull(this.__contextObjects[join])) {
                    context = this.__contextObjects[join] = this.$ContextManagerStatic.getContext(this.context, split);
                }

                return context;
            };

            /**
            * Given a period-delimited identifier, observes an object and calls the given listener when the
            * object changes.
            *
            * @param absoluteIdentifier The period-delimited identifier noting the property to be observed.
            * @param observableListener An object implmenting IObservableListener. The listener will be
            * notified of object changes.
            * @return {IRemoveListener} A method for removing the listener.
            */
            ContextManager.prototype.observe = function (absoluteIdentifier, observableListener) {
                if (isEmpty(absoluteIdentifier)) {
                    return;
                }

                var split = absoluteIdentifier.split('.'), key = split.pop(), path, parsedExpression, context = this.context, hasIdentifier = this._hasIdentifier(absoluteIdentifier), hasObservableListener = !isNull(observableListener), join;

                if (split.length > 0) {
                    join = split.join('.');
                    context = this.__contextObjects[join];
                    if (isNull(this.__contextObjects[join])) {
                        context = this.__contextObjects[join] = this._getImmediateContext(join);
                    }
                }

                if (!(isObject(context) || isArray(context))) {
                    this.$ExceptionStatic.warn('Trying to observe a child property of a primitive for identifier: ' + absoluteIdentifier, this.$ExceptionStatic.CONTEXT);

                    if (hasObservableListener) {
                        return this._addObservableListener(absoluteIdentifier, observableListener);
                    }

                    return;
                }

                // set observedIdentifier to null
                this.__observedIdentifier = null;

                var value = this.__contextObjects[absoluteIdentifier] = context[key];

                // if observedIdentifier is not null, the primitive is already being watched
                var observedIdentifier = this.__observedIdentifier, isObserved = !isNull(observedIdentifier);
                if (isObserved) {
                    hasIdentifier = true;
                }

                var removeCallback = noop;

                if (hasObservableListener) {
                    var removeObservedCallback = noop, removeAbsoluteCallback = this._addObservableListener(absoluteIdentifier, observableListener);

                    if (isObserved && absoluteIdentifier !== observedIdentifier) {
                        removeObservedCallback = this._addObservableListener(observedIdentifier, observableListener);
                    }

                    removeCallback = function removeObservableCallback() {
                        removeAbsoluteCallback();
                        removeObservedCallback();
                    };
                }

                //check if value is defined and context manager hasn't seen this identifier
                if (!hasIdentifier) {
                    this._define(absoluteIdentifier, context, key);
                }

                return removeCallback;
            };

            /**
            * Observes an array and calls the listener when certain functions are called on
            * that array. The watched functions are push, pop, shift, splice, unshift, sort,
            * and reverse.
            *
            * @param control The control that is observing the array.
            * @param listener The callback for when an observed Array function has been called.
            * @param absoluteIdentifier The identifier from the root context used to find the array.
            * @param array The array to be observed.
            */
            ContextManager.prototype.observeArray = function (control, listener, absoluteIdentifier, array, oldArray) {
                var length = arrayMethods.length, method, i = 0, ContextManager = this.$ContextManagerStatic, Compat = this.$compat, proto = Compat.proto, setProto = Compat.setProto;

                if (!isNull(oldArray)) {
                    if (setProto) {
                        Object.setPrototypeOf(oldArray, Object.create(Array.prototype));
                    } else if (proto) {
                        oldArray.__proto__ = Object.create(Array.prototype);
                    } else {
                        length = arrayMethods.length;

                        for (; i < length; ++i) {
                            method = arrayMethods[i];
                            oldArray[method] = Array.prototype[method];
                        }
                    }
                }

                if (isNull(array)) {
                    return;
                }

                var arrayCallbacks = ContextManager.observedArrayListeners[absoluteIdentifier];

                if (isNull(arrayCallbacks)) {
                    arrayCallbacks = ContextManager.observedArrayListeners[absoluteIdentifier] = {};
                }

                arrayCallbacks[control.uid] = listener;

                if (proto) {
                    var obj = Object.create(Array.prototype);

                    for (; i < length; ++i) {
                        method = arrayMethods[i];
                        obj[method] = this._overwriteArrayFunction(absoluteIdentifier, control, method);
                    }

                    if (setProto) {
                        Object.setPrototypeOf(array, obj);
                    } else {
                        array.__proto__ = obj;
                    }

                    return;
                }

                for (; i < length; ++i) {
                    method = arrayMethods[i];
                    ContextManager.defineProperty(array, method, this._overwriteArrayFunction(absoluteIdentifier, control, method), false, true);
                }
            };
            ContextManager.prototype.dispose = function () {
                this.context = null;
                this.__identifiers = {};
                this.__identifierHash = {};
                this.__contextObjects = {};
            };
            ContextManager.prototype._getImmediateContext = function (identifier) {
                if (isNull(this.__identifiers[identifier])) {
                    this.observe(identifier, null);
                }

                var split = identifier.split('.'), context = this.context, key = split.shift(), partialIdentifier = key;

                do {
                    context = context[key];
                    if (isNull(context) || split.length === 0) {
                        break;
                    }

                    key = split.shift();
                    partialIdentifier += '.' + key;
                } while(split.length >= 0);

                return context;
            };
            ContextManager.prototype._getValues = function (split, newRootContext, oldRootContext) {
                var length = split.length, property, doNew = true, doOld = true;

                while (split.length > 1) {
                    property = split.shift();
                    if (doNew) {
                        newRootContext = newRootContext[property];
                        if (isNull(newRootContext)) {
                            doNew = false;
                        }
                    }
                    if (doOld) {
                        oldRootContext = oldRootContext[property];
                        if (isNull(oldRootContext)) {
                            doOld = false;
                        }
                    }

                    if (!(doNew || doOld)) {
                        return null;
                    }
                }

                property = split.shift();

                var newValue, oldValue;

                if (!isNull(newRootContext)) {
                    newValue = newRootContext[property];
                }

                if (!isNull(oldRootContext)) {
                    oldValue = oldRootContext[property];
                }

                return {
                    newParent: newRootContext,
                    oldParent: oldRootContext,
                    property: property,
                    newValue: newValue,
                    oldValue: oldValue
                };
            };
            ContextManager.prototype._notifyChildProperties = function (identifier, newValue, oldValue) {
                var mappings = this.__identifierHash[identifier];

                if (isNull(mappings)) {
                    return;
                }

                var length = mappings.length, binding, property, parentProperty, split, values = {}, value, key, start = identifier.length + 1, newParent, oldParent, newChild, oldChild;

                if (length === 0) {
                    this.__identifierHash[identifier] = null;
                    delete this.__identifierHash[identifier];
                    return;
                }

                for (var i = 0; i < length; ++i) {
                    binding = mappings[i];
                    property = binding.slice(start);
                    split = property.split('.');
                    key = split.pop();
                    parentProperty = split.join('.');

                    if (isEmpty(parentProperty)) {
                        newParent = newValue;
                        oldParent = oldValue;
                        newChild = isNull(newParent) ? newParent : newParent[key];
                        oldChild = isNull(oldParent) ? oldParent : oldParent[key];
                    } else {
                        value = values[parentProperty];

                        if (isNull(value)) {
                            value = values[parentProperty] = this._getValues(split, newValue, oldValue);

                            if (isNull(value)) {
                                this._execute(binding, null, null);
                                continue;
                            }
                        }

                        newParent = value.newValue;
                        oldParent = value.oldValue;
                        newChild = isNull(newParent) ? null : newParent[key];
                        oldChild = isNull(oldParent) ? null : oldParent[key];
                    }

                    values[property] = {
                        newParent: newParent,
                        oldParent: oldParent,
                        property: key,
                        newValue: newChild,
                        oldValue: oldChild
                    };

                    if (!isNull(newParent) && !isUndefined(newChild)) {
                        this._define(binding, newParent, key);
                    }

                    this._execute(binding, newChild, oldChild);
                }

                values = null;
            };
            ContextManager.prototype._addObservableListener = function (absoluteIdentifier, observableListener) {
                var uid = observableListener.uid, contextManagerCallback = this._removeCallback.bind(this), ContextManager = this.$ContextManagerStatic;

                this._add(absoluteIdentifier, observableListener);

                ContextManager.pushRemoveListener(absoluteIdentifier, uid, contextManagerCallback);

                return function removeObservableCallback() {
                    ContextManager.removeIdentifier([uid], absoluteIdentifier);
                    contextManagerCallback(absoluteIdentifier, uid);
                };
            };
            ContextManager.prototype._define = function (identifier, immediateContext, key) {
                var value = immediateContext[key];

                if (isObject(value) || isArray(value)) {
                    this.__defineObject(identifier, immediateContext, key);
                } else {
                    this.__definePrimitive(identifier, immediateContext, key);
                }
            };
            ContextManager.prototype.__defineObject = function (identifier, immediateContext, key) {
                var _this = this;
                var value = immediateContext[key];

                Object.defineProperty(immediateContext, key, {
                    configurable: true,
                    get: function () {
                        _this.__observedIdentifier = identifier;
                        return value;
                    },
                    set: function (newValue) {
                        if (value === newValue) {
                            return;
                        }

                        var oldValue = value;
                        value = newValue;

                        if (_this.__isArrayFunction) {
                            return;
                        }

                        var childPropertiesLength = _this.__identifierHash[identifier].length;
                        _this._execute(identifier, value, oldValue);
                        if (childPropertiesLength > 0) {
                            _this._notifyChildProperties(identifier, value, oldValue);
                        }
                    }
                });
            };
            ContextManager.prototype.__definePrimitive = function (identifier, immediateContext, key) {
                var _this = this;
                var value = immediateContext[key], isDefined = !isNull(value);

                if (isArray(immediateContext) && key === 'length') {
                    return;
                }

                Object.defineProperty(immediateContext, key, {
                    configurable: true,
                    get: function () {
                        _this.__observedIdentifier = identifier;
                        return value;
                    },
                    set: function (newValue) {
                        if (value === newValue) {
                            return;
                        }
                        var oldValue = value;
                        value = newValue;

                        if (_this.__isArrayFunction && isArray(immediateContext)) {
                            return;
                        }

                        if (isDefined) {
                            _this._execute(identifier, newValue, oldValue);
                            return;
                        }

                        if (isObject(value) || isArray(value)) {
                            var childPropertiesLength = _this.__identifierHash[identifier].length;
                            _this._execute(identifier, newValue, oldValue);
                            _this.__defineObject(identifier, immediateContext, key);
                            if (childPropertiesLength > 0) {
                                _this._notifyChildProperties(identifier, newValue, oldValue);
                            }
                        } else {
                            _this._execute(identifier, newValue, oldValue);
                            _this.__definePrimitive(identifier, immediateContext, key);
                        }
                    }
                });
            };
            ContextManager.prototype._overwriteArrayFunction = function (absoluteIdentifier, control, method) {
                var callbacks = this.$ContextManagerStatic.observedArrayListeners[absoluteIdentifier], that = this;

                // We can't use a fat-arrow function here because we need the array context.
                return function observedArrayFn() {
                    var args = [];
                    for (var _i = 0; _i < (arguments.length - 0); _i++) {
                        args[_i] = arguments[_i + 0];
                    }
                    var oldArray = this.slice(0), returnValue;

                    if (method.indexOf('shift') !== -1) {
                        that.__isArrayFunction = true;
                        returnValue = Array.prototype[method].apply(this, args);
                        that.__isArrayFunction = false;
                        that._notifyChildProperties(absoluteIdentifier, this, oldArray);
                    } else {
                        returnValue = Array.prototype[method].apply(this, args);
                    }

                    var keys = Object.keys(callbacks), length = keys.length;

                    if (oldArray.length !== this.length) {
                        that._execute(absoluteIdentifier + '.length', this.length, oldArray.length);
                    }

                    for (var i = 0; i < length; ++i) {
                        callbacks[keys[i]]({
                            method: method,
                            returnValue: returnValue,
                            oldArray: oldArray,
                            newArray: this,
                            arguments: args
                        });
                    }

                    return returnValue;
                };
            };
            ContextManager.prototype.__addHashValues = function (identifier) {
                var split = identifier.split('.'), ident = '', hashValue;

                ident = split.shift();
                hashValue = this.__identifierHash[ident];

                if (isNull(hashValue)) {
                    hashValue = this.__identifierHash[ident] = [];
                    if (split.length === 0) {
                        return;
                    }
                }

                hashValue.push(identifier);

                while (split.length > 0) {
                    ident += '.' + split.shift();
                    hashValue = this.__identifierHash[ident];

                    if (isNull(hashValue)) {
                        hashValue = this.__identifierHash[ident] = [];
                    }
                    if (ident !== identifier) {
                        hashValue.push(identifier);
                    }
                }
            };
            ContextManager.prototype._add = function (identifier, observableListener) {
                var callbacks = this.__identifiers[identifier];

                if (isNull(callbacks)) {
                    callbacks = this.__identifiers[identifier] = [];
                }

                callbacks.push(observableListener);

                if (isNull(this.__identifierHash[identifier])) {
                    this.__addHashValues(identifier);
                }
            };
            ContextManager.prototype._removeCallback = function (identifier, uid) {
                var callbacks = this.__identifiers[identifier];
                if (isNull(callbacks)) {
                    return;
                }

                // filter out callback objects that have matching uids
                var length = callbacks.length - 1, callback;

                for (var i = length; i >= 0; --i) {
                    callback = callbacks[i];
                    if (callback.uid === uid) {
                        callbacks.splice(i, 1);
                    }
                }

                if (isEmpty(this.__identifiers[identifier])) {
                    this.__identifierHash[identifier] = null;
                    delete this.__identifierHash[identifier];
                    this.__contextObjects[identifier] = null;
                    delete this.__contextObjects[identifier];
                }
            };
            ContextManager.prototype._hasIdentifier = function (identifier) {
                return !isEmpty(this.__identifiers[identifier]);
            };
            ContextManager.prototype._execute = function (identifier, value, oldValue) {
                var observableListeners = this.__identifiers[identifier];

                this.__contextObjects[identifier] = value;

                if (isUndefined(value)) {
                    delete this.__contextObjects[identifier];
                }

                if (isNull(observableListeners)) {
                    return;
                }

                for (var i = 0; i < observableListeners.length; ++i) {
                    observableListeners[i].listener(value, oldValue);
                }
            };
            ContextManager.observedArrayListeners = {};

            ContextManager.__managers = {};
            ContextManager.__controls = {};
            return ContextManager;
        })();
        observable.ContextManager = ContextManager;

        function ContextManagerStatic() {
            return ContextManager;
        }
        observable.ContextManagerStatic = ContextManagerStatic;

        register.injectable('$ContextManagerStatic', ContextManagerStatic, null, register.injectableType.STATIC);

        

        

        

        
    })(plat.observable || (plat.observable = {}));
    var observable = plat.observable;
    (function (events) {
        var DispatchEvent = (function () {
            function DispatchEvent() {
                this.$EventManagerStatic = acquire('$EventManagerStatic');
            }
            DispatchEvent.prototype.initialize = function (name, sender, direction) {
                this.name = name;
                this.direction = direction || this.$EventManagerStatic.direction.DIRECT;
                this.sender = sender;
            };

            /**
            * Call this method to halt the propagation of an upward-moving event.
            * Other events cannot be stopped with this method.
            */
            DispatchEvent.prototype.stopPropagation = function () {
                if (this.direction === this.$EventManagerStatic.direction.UP) {
                    this.$EventManagerStatic.propagatingEvents[this.name] = false;
                }
            };
            return DispatchEvent;
        })();
        events.DispatchEvent = DispatchEvent;

        register.injectable('$dispatchEvent', DispatchEvent, null, register.injectableType.MULTI);

        

        /**
        * Represents a Lifecycle Event. Lifecycle Events are always direct events.
        */
        var LifecycleEvent = (function (_super) {
            __extends(LifecycleEvent, _super);
            function LifecycleEvent() {
                _super.apply(this, arguments);
            }
            /**
            * Creates a new Lifecycle and fires it.
            *
            * @param name The name of the event.
            * @param sender The sender of the event.
            */
            LifecycleEvent.dispatch = function (name, sender) {
                var event = new LifecycleEvent();

                event.initialize(name, sender);
                EventManager.sendEvent(event);
            };

            /**
            * @param name The name of the event.
            * @param sender The sender of the event.
            */
            LifecycleEvent.prototype.initialize = function (name, sender) {
                _super.prototype.initialize.call(this, name, sender, this.$EventManagerStatic.direction.DIRECT);
            };
            return LifecycleEvent;
        })(DispatchEvent);
        events.LifecycleEvent = LifecycleEvent;

        function LifecycleEventStatic() {
            return LifecycleEvent;
        }
        events.LifecycleEventStatic = LifecycleEventStatic;

        register.injectable('$LifecycleEventStatic', LifecycleEventStatic, null, register.injectableType.STATIC);

        

        /**
        * Event object for a control dispatch event. Contains information about the type of event.
        * Propagation of the event always starts at the sender, allowing a control to both
        * initialize and consume an event. If a consumer of an event throws an error while
        * handling the event it will be logged to the app using exception.warn. Errors will
        * not stop propagation of the event.
        */
        var EventManager = (function () {
            function EventManager() {
            }
            /**
            * Initializes the EventManager, creating the initial ALM event listeners.
            *
            * @static
            */
            EventManager.initialize = function () {
                if (EventManager.__initialized) {
                    return;
                }

                EventManager.__initialized = true;

                var lifecycleListeners = EventManager.__lifecycleEventListeners, length = lifecycleListeners.length, compat = EventManager.$compat, $document = EventManager.$document, dispatch = LifecycleEvent.dispatch, listener;

                while (lifecycleListeners.length > 0) {
                    listener = lifecycleListeners.pop();
                    $document.removeEventListener(listener.name, listener.value, false);
                }

                if (compat.cordova) {
                    var eventNames = ['resume', 'online', 'offline'], event;

                    length = eventNames.length;

                    for (var i = 0; i < eventNames.length; ++i) {
                        event = eventNames[i];
                        lifecycleListeners.push({
                            name: event,
                            value: (function (ev) {
                                return function () {
                                    dispatch(event, EventManager);
                                };
                            })(event)
                        });

                        $document.addEventListener(event, lifecycleListeners[i].value, false);
                    }

                    lifecycleListeners.push({
                        name: 'pause',
                        value: function () {
                            dispatch('suspend', EventManager);
                        }
                    });

                    $document.addEventListener('pause', lifecycleListeners[lifecycleListeners.length - 1].value, false);

                    lifecycleListeners.push({
                        name: 'deviceReady',
                        value: function () {
                            dispatch('ready', EventManager);
                        }
                    });

                    $document.addEventListener('deviceReady', lifecycleListeners[lifecycleListeners.length - 1].value, false);

                    lifecycleListeners.push({
                        name: 'backbutton',
                        value: function () {
                            dispatch('goBack', EventManager);
                        }
                    });

                    $document.addEventListener('backbutton', lifecycleListeners[lifecycleListeners.length - 1].value, false);
                } else if (compat.amd) {
                    return;
                } else {
                    EventManager.$window.addEventListener('load', function onWindowLoad() {
                        dispatch('ready', EventManager);
                    });
                }
            };

            /**
            * Removes all event listeners for a given uid. Useful for garbage collection when
            * certain objects that listen to events go out of scope.
            *
            * @static
            * @param uid The uid for which the event listeners will be removed.
            */
            EventManager.dispose = function (uid) {
                EventManager.__eventsListeners[uid] = null;
                delete EventManager.__eventsListeners[uid];
            };

            /**
            * Registers a listener for a DispatchEvent. The listener will be called when a DispatchEvent is
            * propagating over the given uid. Any number of listeners can exist for a single event name.
            *
            * @static
            * @param uid A unique id to associate with the object registering the listener.
            * @param eventName The name of the event to listen to.
            * @param listener The method called when the DispatchEvent is fired.
            * @return {IRemoveListener} A method for removing the listener.
            */
            EventManager.on = function (uid, eventName, listener, context) {
                var eventsListener = EventManager.__eventsListeners[uid];

                if (isNull(eventsListener)) {
                    eventsListener = EventManager.__eventsListeners[uid] = {
                        listeners: {},
                        context: context
                    };
                }

                var eventListeners = eventsListener.listeners[eventName];

                if (isNull(eventListeners)) {
                    eventListeners = eventsListener.listeners[eventName] = [];
                }

                eventListeners.push(listener);

                var index = eventListeners.length - 1;

                return function removeListener() {
                    eventListeners.splice(index, 1);
                };
            };

            EventManager.dispatch = function (name, sender, direction, args) {
                var event = acquire('$dispatchEvent');
                event.initialize(name, sender, direction);
                EventManager.sendEvent(event, args);
            };

            EventManager.sendEvent = function (event, args) {
                var name = event.name, direction = event.direction;

                args = args || [];

                EventManager.propagatingEvents[name] = true;
                args = args || [];

                switch (direction) {
                    case EventManager.direction.UP:
                        EventManager._dispatchUp(event, args);
                        break;
                    case EventManager.direction.DOWN:
                        EventManager._dispatchDown(event, args);
                        break;
                    case EventManager.direction.DIRECT:
                        EventManager._dispatchDirect(event, args);
                        break;
                }

                EventManager.propagatingEvents[name] = false;
                delete EventManager.propagatingEvents[name];
            };

            EventManager._dispatchUp = function (event, args) {
                var name = event.name, parent = event.sender;

                while (!isNull(parent) && EventManager.propagatingEvents[name]) {
                    if (isNull(parent.uid)) {
                        continue;
                    }
                    EventManager.__executeEvent(parent.uid, event, args);
                    parent = parent.parent;
                }
            };

            EventManager._dispatchDown = function (event, args) {
                var controls = [], control, name = event.name;

                controls.push(event.sender);

                while (controls.length && EventManager.propagatingEvents[name]) {
                    control = controls.pop();

                    if (isNull(control.uid)) {
                        continue;
                    }

                    EventManager.__executeEvent(control.uid, event, args);

                    if (isNull(control.controls)) {
                        continue;
                    }

                    controls = controls.concat(control.controls);
                }
            };

            EventManager._dispatchDirect = function (event, args) {
                var uids = Object.keys(EventManager.__eventsListeners), length = uids.length, name = event.name, eventsListener;

                for (var i = 0; i < length; ++i) {
                    if (!EventManager.propagatingEvents[name]) {
                        break;
                    }

                    eventsListener = EventManager.__eventsListeners[uids[i]];

                    if (isNull(eventsListener) || isNull(eventsListener.listeners[name])) {
                        continue;
                    }

                    EventManager.__callListeners(eventsListener.context, event, eventsListener.listeners[name], args);
                }
            };

            /**
            * Returns whether or not the given string is a registered direction.
            */
            EventManager.hasDirection = function (direction) {
                var dir = EventManager.direction;

                return (direction === dir.UP || direction === dir.DOWN || direction === dir.DIRECT);
            };

            EventManager.__executeEvent = function (uid, ev, args) {
                var eventsListener = EventManager.__eventsListeners[uid];

                if (isNull(eventsListener)) {
                    return;
                }
                var context = eventsListener.context, listeners = eventsListener.listeners[ev.name];

                if (isNull(listeners)) {
                    return;
                }

                EventManager.__callListeners(context, ev, listeners, args);
            };

            EventManager.__callListeners = function (context, ev, listeners, args) {
                var name = ev.name, length = listeners.length, index = -1;

                args = [ev].concat(args);

                while (++index < length && EventManager.propagatingEvents[name]) {
                    try  {
                        listeners[index].apply(context, args);
                    } catch (e) {
                        EventManager.$ExceptionStatic.warn(e, Exception.EVENT);
                    }
                }
            };
            EventManager.direction = {
                /**
                * An upward-moving event will start at the sender and move
                * up the parent chain.
                */
                UP: 'up',
                /**
                * A downward-moving event will start at the sender and move
                * to its children and beyond.
                */
                DOWN: 'down',
                /**
                * Goes through all listeners for an event name, ignoring order.
                */
                DIRECT: 'direct'
            };

            EventManager.propagatingEvents = {};

            EventManager.__eventsListeners = {};
            EventManager.__lifecycleEventListeners = [];
            EventManager.__initialized = false;
            return EventManager;
        })();
        events.EventManager = EventManager;

        

        

        function EventManagerStatic($compat, $document, $window, $ExceptionStatic) {
            EventManager.$compat = $compat;
            EventManager.$document = $document;
            EventManager.$window = $window;
            EventManager.$ExceptionStatic = $ExceptionStatic;
            return EventManager;
        }
        events.EventManagerStatic = EventManagerStatic;

        register.injectable('$EventManagerStatic', EventManagerStatic, [
            '$compat',
            '$document',
            '$window',
            '$ExceptionStatic'
        ], register.injectableType.STATIC);

        /**
        * A class used by the Navigator to dispatch Navigation events. Allows anyone to listen
        * for navigation events and respond to them, even canceling them if necessary.
        */
        var NavigationEvent = (function (_super) {
            __extends(NavigationEvent, _super);
            function NavigationEvent() {
                _super.apply(this, arguments);
                /**
                * States whether or not this event is able to be canceled. Some navigation events can be
                * canceled, preventing further navigation.
                */
                this.cancelable = true;
                this.canceled = false;
            }
            /**
            * Dispatches an event with the specified target type.
            *
            * @param name The name of the event (e.g. 'beforeNavigate')
            * @param sender The object sending the event.
            * @param eventOptions An object implementing INavigationEvent, specifying what all event listeners
            * will be passed.
            * @return {Boolean} Whether or not the event was canceled, indicating further navigation should also
            * be canceled.
            */
            NavigationEvent.dispatch = function (name, sender, eventOptions) {
                var event = new NavigationEvent();

                event.initialize(name, sender, null, eventOptions);
                NavigationEvent.$EventManagerStatic.sendEvent(event, []);

                return event;
            };

            /**
            * Initializes the event members.
            *
            * @param name The name of the event.
            * @param sender The object that initiated the event.
            * @param direction This will always be a direct event no matter what is sent in.
            *
            * @see eventDirection
            */
            NavigationEvent.prototype.initialize = function (name, sender, direction, eventOptions) {
                _super.prototype.initialize.call(this, name, sender, this.$EventManagerStatic.direction.DIRECT);
                this.parameter = eventOptions.parameter;
                this.options = eventOptions.options;
                this.target = eventOptions.target;
                this.type = eventOptions.type;
            };

            /**
            * If the event is cancelable (ev.cancelable), calling this method will cancel the event.
            */
            NavigationEvent.prototype.cancel = function () {
                if (this.cancelable) {
                    this.canceled = true;

                    this.$EventManagerStatic.propagatingEvents[this.name] = false;
                }
            };
            return NavigationEvent;
        })(DispatchEvent);
        events.NavigationEvent = NavigationEvent;

        

        function NavigationEventStatic($EventManagerStatic) {
            NavigationEvent.$EventManagerStatic = $EventManagerStatic;
            return NavigationEvent;
        }
        events.NavigationEventStatic = NavigationEventStatic;

        register.injectable('$NavigationEventStatic', NavigationEventStatic, ['$EventManagerStatic'], register.injectableType.STATIC);

        /**
        * Represents an internal Error Event. This is used for any
        * internal errors (both fatal and warnings). All error events are
        * direct events.
        */
        var ErrorEvent = (function (_super) {
            __extends(ErrorEvent, _super);
            function ErrorEvent() {
                _super.apply(this, arguments);
            }
            /**
            * Creates a new ErrorEvent and fires it.
            *
            * @param name The name of the event.
            * @param sender The sender of the event.
            * @param error The error that occurred, resulting in the event.
            */
            ErrorEvent.dispatch = function (name, sender, error) {
                var event = new ErrorEvent();

                event.initialize(name, sender, null, error);
                ErrorEvent.$EventManagerStatic.sendEvent(event);
            };

            ErrorEvent.prototype.initialize = function (name, sender, direction, error) {
                _super.prototype.initialize.call(this, name, sender, this.$EventManagerStatic.direction.DIRECT);

                this.error = error;
            };
            return ErrorEvent;
        })(DispatchEvent);
        events.ErrorEvent = ErrorEvent;

        function ErrorEventStatic($EventManagerStatic) {
            ErrorEvent.$EventManagerStatic = $EventManagerStatic;
            return ErrorEvent;
        }
        events.ErrorEventStatic = ErrorEventStatic;

        register.injectable('$ErrorEventStatic', ErrorEventStatic, ['$EventManagerStatic'], register.injectableType.STATIC);

        
    })(plat.events || (plat.events = {}));
    var events = plat.events;

    /**
    * Used for facilitating data and DOM manipulation. Contains lifecycle events
    * as well as properties for communicating with other controls. This is the base
    * class for all types of controls.
    */
    var Control = (function () {
        /**
        * The constructor for a control. Any injectables specified during control registration will be
        * passed into the constructor as arguments as long as the control is instantiated with its associated
        * injector.
        */
        function Control() {
            Control.$ContextManagerStatic.defineGetter(this, 'uid', uniqueId('plat_'));
        }
        Control.getRootControl = function (control) {
            if (isNull(control)) {
                return control;
            }

            var root = control;

            while (!(isNull(root.parent) || root.hasOwnContext)) {
                if (!isNull(root.root)) {
                    root = root.root;
                    break;
                }
                root = root.parent;
            }

            return root;
        };

        /**
        * Given a control, calls the loaded method for the control if it exists.
        *
        * @static
        * @param control The control to load.
        */
        Control.load = function (control) {
            if (isNull(control)) {
                return;
            }

            if (isFunction(control.loaded)) {
                control.loaded();
            }
        };

        /**
        * Disposes all the necessary memory for a control. Uses specific dispose
        * methods related to a control's constructor if necessary.
        *
        * @static
        * @param control The Control to dispose.
        */
        Control.dispose = function (control) {
            var ctrl = control, ContextManager = Control.$ContextManagerStatic, AttributeControl = controls.AttributeControl, ViewControl = ui.ViewControl, TemplateControl = ui.TemplateControl;

            if (isNull(ctrl)) {
                return;
            } else if (!isUndefined(ctrl.templateControl)) {
                AttributeControl.dispose(ctrl);
                return;
            } else if (ctrl.hasOwnContext) {
                ViewControl.dispose(ctrl);
                return;
            } else if (ctrl.controls) {
                TemplateControl.dispose(ctrl);
                return;
            }

            ContextManager.dispose(control);
            control.dispose();

            Control.removeParent(control);
        };

        /**
        * Splices a control from its parent's controls list. Sets the control's parent
        * to null.
        *
        * @static
        * @param control The control whose parent will be removed.
        */
        Control.removeParent = function (control) {
            if (isNull(control)) {
                return;
            }

            var parent = control.parent;

            if (isNull(parent)) {
                return;
            }

            var controls = parent.controls || [], index = controls.indexOf(control);

            if (index !== -1) {
                controls.splice(index, 1);
            }

            control.parent = null;
        };

        Control.__getControls = function (control, method, key) {
            var controls = [], root = Control.getRootControl(control), child;

            if (!isNull(root) && root[method] === key) {
                controls.push(root);
            }

            var children = root.controls;

            if (isNull(children)) {
                return controls;
            }

            var queue = [];
            queue = queue.concat(children);

            while (queue.length > 0) {
                child = queue.shift();

                if (child[method] === key) {
                    controls.push(child);
                }

                if (isNull(child.controls)) {
                    continue;
                }

                queue = queue.concat(child.controls);
            }

            return controls;
        };

        /**
        * The initialize event method for a control. In this method a control should initialize all the necessary
        * variables. This method is typically only necessary for view controls. If a control does not implement
        * ui.IViewControl then it is not safe to access, observe, or modify the context property in this method.
        * A view control should call services/set context in this method in order to fire the loaded event. No control
        * will be loaded until the view control has specified a context.
        */
        Control.prototype.initialize = function () {
        };

        /**
        * The loaded event method for a control. This event is fired after a control has been loaded,
        * meaning all of its children have also been loaded and initial DOM has been created and populated. It is now
        * safe for all controls to access, observe, and modify the context property.
        */
        Control.prototype.loaded = function () {
        };

        /**
        * Retrieves all the controls with the specified name.
        *
        * @param name The string name with which to populate the returned controls array.
        */
        Control.prototype.getControlsByName = function (name) {
            return Control.__getControls(this, 'name', name);
        };

        Control.prototype.getControlsByType = function (type) {
            if (isString(type)) {
                return Control.__getControls(this, 'type', type);
            }
            return Control.__getControls(this, 'constructor', type);
        };

        Control.prototype.observeExpression = function (expression, listener) {
            if (isNull(expression)) {
                return noop;
            } else if (!(isString(expression) || isFunction(expression.evaluate))) {
                return noop;
            }

            var parser = acquire('$parser'), parsedExpression = isString(expression) ? parser.parse(expression) : expression, aliases = parsedExpression.aliases, that = this, control = !isNull(that.resources) ? that : that.parent, alias, length = aliases.length, resources = {}, ContextManager = Control.$ContextManagerStatic, getManager = ContextManager.getManager, TemplateControl = ui.TemplateControl, findResource = TemplateControl.findResource, evaluateExpression = TemplateControl.evaluateExpression, i;

            if (isNull(control)) {
                return noop;
            }

            for (i = 0; i < length; ++i) {
                alias = aliases[i];

                var resourceObj = findResource(control, alias);
                if (!isNull(resourceObj) && resourceObj.resource.type === 'observable') {
                    resources[alias] = getManager(resourceObj.control);
                }
            }

            var identifiers = parsedExpression.identifiers, contextManager = getManager(Control.getRootControl(control)), identifier, split = [], absolutePath = control.absoluteContextPath + '.', managers = {};

            length = identifiers.length;

            for (i = 0; i < length; ++i) {
                identifier = identifiers[i];
                split = identifier.split('.');

                if (identifier.indexOf('this') === 0) {
                    identifier = identifier.slice(5);
                } else if (identifier[0] === '@') {
                    alias = split[0].substr(1);
                    identifier = identifier.replace('@' + alias, 'resources.' + alias + '.value');

                    if (!isNull(resources[alias])) {
                        managers[identifier] = resources[alias];
                    }

                    continue;
                }

                managers[absolutePath + identifier] = contextManager;
            }

            identifiers = Object.keys(managers);
            length = identifiers.length;

            var oldValue = evaluateExpression(parsedExpression, control), listeners = [];

            for (i = 0; i < length; ++i) {
                identifier = identifiers[i];

                listeners.push(managers[identifier].observe(identifier, {
                    uid: this.uid,
                    listener: function () {
                        var value = evaluateExpression(parsedExpression, control);
                        listener.call(that, value, oldValue);
                        oldValue = value;
                    }
                }));
            }

            return function removeExpressionListener() {
                var length = listeners.length;

                for (var i = 0; i < length; ++i) {
                    listeners[i]();
                }
            };
        };

        Control.prototype.evaluateExpression = function (expression, context) {
            var TemplateControl = ui.TemplateControl;
            return TemplateControl.evaluateExpression(expression, this.parent, context);
        };

        Control.prototype.dispatchEvent = function (name, direction) {
            var args = [];
            for (var _i = 0; _i < (arguments.length - 2); _i++) {
                args[_i] = arguments[_i + 2];
            }
            var manager = Control.$EventManagerStatic;

            if (!manager.hasDirection(direction)) {
                if (!isUndefined(direction)) {
                    args.unshift(direction);
                }
                direction = manager.direction.UP;
            }
            var sender = this;

            if (!isNull(sender.templateControl)) {
                sender = sender.templateControl;
            }

            manager.dispatch(name, sender, direction, args);
        };

        /**
        * Registers a listener for a DispatchEvent. The listener will be called when a DispatchEvent is
        * propagating over the control. Any number of listeners can exist for a single event name.
        *
        * @param name The name of the event, cooinciding with the DispatchEvent name.
        * @param listener The method called when the DispatchEvent is fired.
        */
        Control.prototype.on = function (name, listener) {
            var manager = Control.$EventManagerStatic;
            return manager.on(this.uid, name, listener, this);
        };

        /**
        * The dispose event is called when a control is being removed from memory. A control should release
        * all of the memory it is using, including DOM event and property listeners.
        */
        Control.prototype.dispose = function () {
        };
        return Control;
    })();
    plat.Control = Control;

    function ControlStatic($ContextManagerStatic, $EventManagerStatic) {
        Control.$ContextManagerStatic = $ContextManagerStatic;
        Control.$EventManagerStatic = $EventManagerStatic;
        return Control;
    }
    plat.ControlStatic = ControlStatic;

    register.injectable('$ControlStatic', ControlStatic, [
        '$ContextManagerStatic',
        '$EventManagerStatic'
    ], register.injectableType.STATIC);

    

    (function (controls) {
        var AttributeControl = (function (_super) {
            __extends(AttributeControl, _super);
            function AttributeControl() {
                _super.apply(this, arguments);
                /**
                * Specifies the ITemplateControl associated with this
                * control's element. Can be null if no ITemplateControl
                * exists.
                */
                this.templateControl = null;
                /**
                * Specifies the priority of the attribute. The purpose of
                * this is so that controls like plat-bind can have a higher
                * priority than plat-tap. The plat-bind will be initialized
                * and loaded before plat-tap, meaning it has the first chance
                * to respond to events.
                */
                this.priority = 0;
            }
            /**
            * Method for disposing an attribute control. Removes any
            * necessary objects from the control.
            *
            * @static
            * @param control The AttributeControl to dispose.
            */
            AttributeControl.dispose = function (control) {
                control.templateControl = null;
                delete control.templateControl;

                Control.dispose(control);
            };
            return AttributeControl;
        })(Control);
        controls.AttributeControl = AttributeControl;

        function AttributeControlStatic($ControlStatic) {
            return AttributeControl;
        }
        controls.AttributeControlStatic = AttributeControlStatic;

        register.injectable('$AttributeControlStatic', AttributeControlStatic, null, register.injectableType.STATIC);

        var Name = (function (_super) {
            __extends(Name, _super);
            function Name() {
                _super.apply(this, arguments);
                this.$ContextManagerStatic = acquire('$ContextManagerStatic');
                this.$ExceptionStatic = acquire('$ExceptionStatic');
            }
            /**
            * Finds the root control and defines the property specified by the
            * attribute value as the INamedElement.
            */
            Name.prototype.initialize = function () {
                var attr = camelCase(this.type), name = this.attributes[attr];

                if (isEmpty(name)) {
                    return;
                }

                this._label = name;

                var templateControl = this.templateControl, rootControl = this._rootControl = Control.getRootControl(this.parent), define = this.$ContextManagerStatic.defineGetter;

                if (!isNull(templateControl)) {
                    define(templateControl, 'name', name, true, true);
                }

                if (!isNull(rootControl)) {
                    if (!isNull(rootControl[name])) {
                        this.$ExceptionStatic.warn('Multiple instances of plat-name = ' + name + ' found, or root control already has property defined.', this.$ExceptionStatic.NAME);
                        return;
                    }

                    define(rootControl, name, {
                        element: this.element,
                        control: templateControl
                    }, true, true);
                }
            };

            /**
            * Removes the INamedElement from the root control.
            */
            Name.prototype.dispose = function () {
                var rootControl = this._rootControl, name = this._label;

                if (!isNull(rootControl)) {
                    this.$ContextManagerStatic.defineProperty(rootControl, name, null, true, true);
                    delete rootControl[name];
                }
            };
            return Name;
        })(AttributeControl);
        controls.Name = Name;

        register.control('plat-name', Name);

        

        var SimpleEventControl = (function (_super) {
            __extends(SimpleEventControl, _super);
            function SimpleEventControl() {
                _super.apply(this, arguments);
                /**
                * A parsed form of the expression found in the attribute's value.
                */
                this._expression = [];
                /**
                * An array of the aliases used in the expression.
                */
                this._aliases = [];
                this.$parser = acquire('$parser');
                this.$regex = acquire('$regex');
                this.$ExceptionStatic = acquire('$ExceptionStatic');
            }
            /**
            * Kicks off finding and setting the listener.
            */
            SimpleEventControl.prototype.loaded = function () {
                if (isNull(this.element)) {
                    return;
                }

                this.attribute = camelCase(this.type);
                this._setListener();
            };

            /**
            * Disposes of the event listener.
            */
            SimpleEventControl.prototype.dispose = function () {
                if (isNull(this._listener) || isNull(this.element)) {
                    return;
                }
                this.element.removeEventListener(this.event, this._listener);
                this._listener = null;
            };

            /**
            * Adds the event listener to the element.
            */
            SimpleEventControl.prototype._addEventListener = function () {
                this._listener = this._onEvent.bind(this);
                this.element.addEventListener(this.event, this._listener, false);
            };

            /**
            * Sets the event listener.
            */
            SimpleEventControl.prototype._setListener = function () {
                var attr = this.attribute;
                if (isEmpty(this.event) || isEmpty(attr)) {
                    return;
                }

                this._parseArgs(this.attributes[attr]);

                if (isNull(this._expression)) {
                    return;
                }

                this._addEventListener();
            };

            /**
            * Finds the first instance of the specified function
            * in the parent control chain.
            *
            * @param identifier the function identifer
            */
            SimpleEventControl.prototype._findListener = function (identifier) {
                var control = this, expression = this.$parser.parse(identifier), value;

                while (!isNull(control)) {
                    value = expression.evaluate(control);
                    if (!isNull(value)) {
                        return {
                            control: control,
                            value: value
                        };
                    }
                    control = control.parent;
                }

                return {
                    control: null,
                    value: null
                };
            };

            /**
            * Constructs the function to evaluate with
            * the evaluated arguments taking resources
            * into account.
            */
            SimpleEventControl.prototype._buildExpression = function () {
                var expression = this._expression.slice(0), hasParent = !isNull(this.parent), aliases = hasParent ? this.parent.getResources(this._aliases) : null, listenerStr = expression.shift(), listener, control, fn;

                if (listenerStr[0] !== '@') {
                    listener = this._findListener(listenerStr);

                    if (isNull(listener)) {
                        return {
                            fn: noop,
                            control: {},
                            args: []
                        };
                    }

                    fn = listener.value;
                    control = listener.control;
                } else {
                    fn = aliases[listenerStr];
                    control = null;
                }

                var length = expression.length, args = [], parser = this.$parser;

                for (var i = 0; i < length; ++i) {
                    args.push(parser.parse(expression[i]).evaluate(hasParent ? this.parent.context : null, aliases));
                }

                return {
                    fn: fn,
                    control: control,
                    args: args
                };
            };

            /**
            * Calls the specified function when the DOM event is fired.
            *
            * @param ev The event object.
            */
            SimpleEventControl.prototype._onEvent = function (ev) {
                var expression = this._buildExpression(), fn = expression.fn, control = expression.control, args = expression.args;

                if (!isFunction(fn)) {
                    this.$ExceptionStatic.warn('Cannot find registered event method ' + this._expression[0] + ' for control: ' + this.type);
                    return;
                }

                fn.apply(control, args.concat(ev));
            };

            /**
            * Finds all alias contained within the expression.
            *
            * @param arguments The array of arguments as strings.
            */
            SimpleEventControl.prototype._findAliases = function (arguments) {
                var length = arguments.length, arg, alias, exec, aliases = {}, aliasRegex = this.$regex.aliasRegex;

                for (var i = 0; i < length; ++i) {
                    arg = arguments[i].trim();

                    if (arg[0] === '@') {
                        exec = aliasRegex.exec(arg);
                        aliases[!isNull(exec) ? exec[0] : arg.substr(1)] = true;
                    }
                }

                return Object.keys(aliases);
            };

            /**
            * Parses the expression and separates the function
            * from its arguments.
            *
            * @param expression The expression to parse.
            */
            SimpleEventControl.prototype._parseArgs = function (expression) {
                var exec = this.$regex.argumentRegex.exec(expression), haveArgs = !isNull(exec);

                if (isEmpty(expression)) {
                    return;
                }

                if (haveArgs) {
                    this._expression = [expression.slice(0, exec.index)].concat((exec[1] !== '') ? exec[1].split(',') : []);
                } else {
                    this._expression.push(expression);
                }

                this._aliases = this._findAliases(this._expression);
            };
            return SimpleEventControl;
        })(AttributeControl);
        controls.SimpleEventControl = SimpleEventControl;

        var Tap = (function (_super) {
            __extends(Tap, _super);
            function Tap() {
                _super.apply(this, arguments);
                /**
                * The event name.
                */
                this.event = 'click';
            }
            return Tap;
        })(SimpleEventControl);
        controls.Tap = Tap;

        var Blur = (function (_super) {
            __extends(Blur, _super);
            function Blur() {
                _super.apply(this, arguments);
                /**
                * The event name.
                */
                this.event = 'blur';
            }
            return Blur;
        })(SimpleEventControl);
        controls.Blur = Blur;

        var Change = (function (_super) {
            __extends(Change, _super);
            function Change() {
                _super.apply(this, arguments);
                /**
                * The event name.
                */
                this.event = 'change';
            }
            return Change;
        })(SimpleEventControl);
        controls.Change = Change;

        var Copy = (function (_super) {
            __extends(Copy, _super);
            function Copy() {
                _super.apply(this, arguments);
                /**
                * The event name.
                */
                this.event = 'copy';
            }
            return Copy;
        })(SimpleEventControl);
        controls.Copy = Copy;

        var Cut = (function (_super) {
            __extends(Cut, _super);
            function Cut() {
                _super.apply(this, arguments);
                /**
                * The event name.
                */
                this.event = 'cut';
            }
            return Cut;
        })(SimpleEventControl);
        controls.Cut = Cut;

        var Paste = (function (_super) {
            __extends(Paste, _super);
            function Paste() {
                _super.apply(this, arguments);
                /**
                * The event name.
                */
                this.event = 'paste';
            }
            return Paste;
        })(SimpleEventControl);
        controls.Paste = Paste;

        var Dbltap = (function (_super) {
            __extends(Dbltap, _super);
            function Dbltap() {
                _super.apply(this, arguments);
                /**
                * The event name.
                */
                this.event = 'dblclick';
            }
            return Dbltap;
        })(SimpleEventControl);
        controls.Dbltap = Dbltap;

        var Focus = (function (_super) {
            __extends(Focus, _super);
            function Focus() {
                _super.apply(this, arguments);
                /**
                * The event name.
                */
                this.event = 'focus';
            }
            return Focus;
        })(SimpleEventControl);
        controls.Focus = Focus;

        var Mouseenter = (function (_super) {
            __extends(Mouseenter, _super);
            function Mouseenter() {
                _super.apply(this, arguments);
                /**
                * The event name.
                */
                this.event = 'mouseenter';
            }
            return Mouseenter;
        })(SimpleEventControl);
        controls.Mouseenter = Mouseenter;

        var Mouseleave = (function (_super) {
            __extends(Mouseleave, _super);
            function Mouseleave() {
                _super.apply(this, arguments);
                /**
                * The event name.
                */
                this.event = 'mouseleave';
            }
            return Mouseleave;
        })(SimpleEventControl);
        controls.Mouseleave = Mouseleave;

        var Mousedown = (function (_super) {
            __extends(Mousedown, _super);
            function Mousedown() {
                _super.apply(this, arguments);
                /**
                * The event name.
                */
                this.event = 'mousedown';
            }
            return Mousedown;
        })(SimpleEventControl);
        controls.Mousedown = Mousedown;

        var Mouseup = (function (_super) {
            __extends(Mouseup, _super);
            function Mouseup() {
                _super.apply(this, arguments);
                /**
                * The event name.
                */
                this.event = 'mouseup';
            }
            return Mouseup;
        })(SimpleEventControl);
        controls.Mouseup = Mouseup;

        var Mouseover = (function (_super) {
            __extends(Mouseover, _super);
            function Mouseover() {
                _super.apply(this, arguments);
                /**
                * The event name.
                */
                this.event = 'mouseover';
            }
            return Mouseover;
        })(SimpleEventControl);
        controls.Mouseover = Mouseover;

        var Mousemove = (function (_super) {
            __extends(Mousemove, _super);
            function Mousemove() {
                _super.apply(this, arguments);
                /**
                * The event name.
                */
                this.event = 'mousemove';
            }
            return Mousemove;
        })(SimpleEventControl);
        controls.Mousemove = Mousemove;

        var Submit = (function (_super) {
            __extends(Submit, _super);
            function Submit() {
                _super.apply(this, arguments);
                /**
                * The event name.
                */
                this.event = 'submit';
            }
            /**
            * Prevents the default submit action unless
            * the "action" attribute is present.
            *
            * @param ev The event object.
            */
            Submit.prototype._onEvent = function (ev) {
                if (!this.element.hasAttribute('action')) {
                    ev.preventDefault();
                }

                _super.prototype._onEvent.call(this, ev);
            };
            return Submit;
        })(SimpleEventControl);
        controls.Submit = Submit;

        register.control('plat-tap', Tap);
        register.control('plat-blur', Blur);
        register.control('plat-change', Change);
        register.control('plat-copy', Copy);
        register.control('plat-cut', Cut);
        register.control('plat-paste', Paste);
        register.control('plat-dbltap', Dbltap);
        register.control('plat-focus', Focus);
        register.control('plat-mouseenter', Mouseenter);
        register.control('plat-mouseleave', Mouseleave);
        register.control('plat-mousedown', Mousedown);
        register.control('plat-mouseup', Mouseup);
        register.control('plat-mouseover', Mouseover);
        register.control('plat-mousemove', Mousemove);
        register.control('plat-submit', Submit);

        // Keyboard events
        controls.KeyCodes = {
            'backspace': 8,
            'tab': 9,
            'enter': 13,
            'shift': 16,
            'ctrl': 17,
            'alt': 18,
            'pause': 19, 'break': 19,
            'caps lock': 20,
            'escape': 27,
            'space': 32,
            'page up': 33,
            'page down': 34,
            'end': 35,
            'home': 36,
            'left': 37, 'left arrow': 37,
            'up': 38, 'up arrow': 38,
            'right': 39, 'right arrow': 39,
            'down': 40, 'down arrow': 40,
            'insert': 45,
            'delete': 46,
            '0': 48, 'zero': 48,
            ')': 48, 'right parenthesis': 48,
            '1': 49, 'one': 49,
            '!': 49, 'exclamation': 49, 'exclamation point': 49,
            '2': 50, 'two': 50,
            '@': 50, 'at': 50,
            '3': 51, 'three': 51,
            '#': 51, 'number sign': 51,
            'hash': 51, 'pound': 51,
            '4': 52, 'four': 52,
            '$': 52, 'dollar': 52, 'dollar sign': 52,
            '5': 53, 'five': 53,
            '%': 53, 'percent': 53, 'percent sign': 53,
            '6': 54, 'six': 54,
            '^': 54, 'caret': 54,
            '7': 55, 'seven': 55,
            '&': 55, 'ampersand': 55,
            '8': 56, 'eight': 56,
            '*': 56, 'asterisk': 56,
            '9': 57, 'nine': 57,
            '(': 57, 'left parenthesis': 57,
            'a': 65, 'b': 66, 'c': 67, 'd': 68, 'e': 69,
            'f': 70, 'g': 71, 'h': 72, 'i': 73, 'j': 74,
            'k': 75, 'l': 76, 'm': 77, 'n': 78, 'o': 79,
            'p': 80, 'q': 81, 'r': 82, 's': 83, 't': 84,
            'u': 85, 'v': 86, 'w': 87, 'x': 88, 'y': 89,
            'z': 90,
            'lwk': 91, 'left window key': 91,
            'rwk': 92, 'right window key': 92,
            'select': 93, 'select key': 93,
            'numpad 0': 96,
            'numpad 1': 97,
            'numpad 2': 98,
            'numpad 3': 99,
            'numpad 4': 100,
            'numpad 5': 101,
            'numpad 6': 102,
            'numpad 7': 103,
            'numpad 8': 104,
            'numpad 9': 105,
            'multiply': 106,
            'add': 107,
            'subtract': 109,
            'decimal point': 110,
            'divide': 111,
            'f1': 112, 'f2': 113, 'f3': 114, 'f4': 115,
            'f5': 116, 'f6': 117, 'f7': 118, 'f8': 119,
            'f9': 120, 'f10': 121, 'f11': 122, 'f12': 123,
            'num lock': 144,
            'scroll lock': 145,
            ';': 186, 'semi-colon': 186,
            ':': 186, 'colon': 186,
            '=': 187, 'equal': 187, 'equal sign': 187,
            '+': 187, 'plus': 187,
            ',': 188, 'comma': 188,
            '<': 188, 'lt': 188, 'less than': 188,
            'left angle bracket': 188,
            '-': 189, 'dash': 189,
            '_': 189, 'underscore': 189,
            '.': 190, 'period': 190,
            '>': 190, 'gt': 190, 'greater than': 190,
            'right angle bracket': 190,
            '/': 191, 'forward slash': 191,
            '?': 191, 'question mark': 191,
            '`': 192, 'grave accent': 192,
            '~': 192, 'tilde': 192,
            '[': 219, 'open bracket': 219,
            '{': 219, 'open brace': 219,
            '\\': 220, 'back slash': 220,
            '|': 220, 'pipe': 220,
            ']': 221, 'close bracket': 221,
            '}': 221, 'close brace': 221,
            '\'': 222, 'single quote': 222,
            '"': 222, 'double quote': 222
        };

        var KeyCodeEventControl = (function (_super) {
            __extends(KeyCodeEventControl, _super);
            function KeyCodeEventControl() {
                _super.apply(this, arguments);
            }
            /**
            * Checks if the IKeyboardEventInput is an expression object
            * and sets the necessary listener.
            */
            KeyCodeEventControl.prototype._setListener = function () {
                var attr = this.attribute;
                if (isEmpty(this.event) || isEmpty(attr)) {
                    return;
                }

                var expression = this.attributes[attr].trim();

                if (expression[0] === '{') {
                    var eventObject = this.evaluateExpression(expression) || { method: '', key: null }, key = eventObject.key, keys = eventObject.keys;

                    this._parseArgs(eventObject.method);

                    if (isNull(key) && isNull(keys)) {
                        this.attributes[attr] = eventObject.method;

                        this._setKeyCodes();
                        _super.prototype._setListener.call(this);
                        return;
                    }

                    keys = isArray(keys) ? keys : [key];
                    this._setKeyCodes(keys);
                    this._addEventListener();

                    return;
                }

                this._setKeyCodes();
                _super.prototype._setListener.call(this);
            };

            /**
            * Matches the event's keyCode if necessary and then handles the event if
            * a match is found or if there are no filter keyCodes.
            *
            * @param ev The keyboard event object.
            */
            KeyCodeEventControl.prototype._onEvent = function (ev) {
                var keyCodes = this.keyCodes;

                if (isEmpty(keyCodes) || !isUndefined(keyCodes[ev.keyCode])) {
                    _super.prototype._onEvent.call(this, ev);
                }
            };

            /**
            * Sets the defined key codes as they correspond to
            * the KeyCodes map.
            *
            * @param keys The array of defined keys to satisfy the
            * key press condition.
            */
            KeyCodeEventControl.prototype._setKeyCodes = function (keys) {
                if (typeof keys === "undefined") { keys = []; }
                var length = keys.length, key, keyCodes = this.keyCodes;

                if (!isArray(keyCodes)) {
                    keyCodes = this.keyCodes = {};
                }

                for (var i = 0; i < length; ++i) {
                    key = keys[i];

                    keyCodes[isNumber(key) ? key : controls.KeyCodes[key]] = {};
                }
            };
            return KeyCodeEventControl;
        })(SimpleEventControl);
        controls.KeyCodeEventControl = KeyCodeEventControl;

        

        var Keydown = (function (_super) {
            __extends(Keydown, _super);
            function Keydown() {
                _super.apply(this, arguments);
                /**
                * The event name.
                */
                this.event = 'keydown';
            }
            return Keydown;
        })(KeyCodeEventControl);
        controls.Keydown = Keydown;

        var Keypress = (function (_super) {
            __extends(Keypress, _super);
            function Keypress() {
                _super.apply(this, arguments);
                /**
                * The event name.
                */
                this.event = 'keydown';
            }
            /**
            * Filters only 'printing keys' (a-z, 0-9, and special characters)
            *
            * @param ev The keyboard event object.
            */
            Keypress.prototype._onEvent = function (ev) {
                var keyCode = ev.keyCode;

                if ((keyCode >= 48 && keyCode <= 90) || (keyCode >= 186) || (keyCode >= 96 && keyCode <= 111)) {
                    _super.prototype._onEvent.call(this, ev);
                }
            };
            return Keypress;
        })(KeyCodeEventControl);
        controls.Keypress = Keypress;

        var Keyup = (function (_super) {
            __extends(Keyup, _super);
            function Keyup() {
                _super.apply(this, arguments);
                /**
                * The event name.
                */
                this.event = 'keyup';
            }
            return Keyup;
        })(KeyCodeEventControl);
        controls.Keyup = Keyup;

        register.control('plat-keydown', Keydown);
        register.control('plat-keypress', Keypress);
        register.control('plat-keyup', Keyup);

        var SetAttributeControl = (function (_super) {
            __extends(SetAttributeControl, _super);
            function SetAttributeControl() {
                _super.apply(this, arguments);
            }
            /**
            * Sets the corresponding attribute {property} value and
            * observes the attribute for changes.
            */
            SetAttributeControl.prototype.loaded = function () {
                if (isNull(this.element)) {
                    return;
                }

                this.attribute = camelCase(this.type);
                this.setter();
                this.__removeListener = this.attributes.observe(this.attribute, this.setter);
            };

            /**
            * Resets the corresponding attribute {property} value upon
            * a change of context.
            */
            SetAttributeControl.prototype.contextChanged = function () {
                if (isNull(this.element)) {
                    return;
                }

                this.setter();
            };

            /**
            * Stops listening to attribute changes.
            */
            SetAttributeControl.prototype.dispose = function () {
                if (isFunction(this.__removeListener)) {
                    this.__removeListener();
                    this.__removeListener = null;
                }
            };

            /**
            * The function for setting the corresponding
            * attribute {property} value.
            */
            SetAttributeControl.prototype.setter = function () {
                var expression = this.attributes[this.attribute];

                if (isEmpty(expression)) {
                    return;
                }

                switch (expression) {
                    case 'false':
                    case '0':
                    case 'null':
                    case '':
                        this.element.setAttribute(this.property, '');
                        this.element[this.property] = false;
                        this.element.removeAttribute(this.property);
                        break;
                    default:
                        this.element.setAttribute(this.property, this.property);
                        this.element[this.property] = true;
                }
            };
            return SetAttributeControl;
        })(AttributeControl);
        controls.SetAttributeControl = SetAttributeControl;

        var Checked = (function (_super) {
            __extends(Checked, _super);
            function Checked() {
                _super.apply(this, arguments);
                this.property = 'checked';
            }
            return Checked;
        })(SetAttributeControl);
        controls.Checked = Checked;

        var Disabled = (function (_super) {
            __extends(Disabled, _super);
            function Disabled() {
                _super.apply(this, arguments);
                this.property = 'disabled';
            }
            return Disabled;
        })(SetAttributeControl);
        controls.Disabled = Disabled;

        var Selected = (function (_super) {
            __extends(Selected, _super);
            function Selected() {
                _super.apply(this, arguments);
                this.property = 'selected';
            }
            return Selected;
        })(SetAttributeControl);
        controls.Selected = Selected;

        var Readonly = (function (_super) {
            __extends(Readonly, _super);
            function Readonly() {
                _super.apply(this, arguments);
                this.property = 'readonly';
            }
            return Readonly;
        })(SetAttributeControl);
        controls.Readonly = Readonly;

        var Open = (function (_super) {
            __extends(Open, _super);
            function Open() {
                _super.apply(this, arguments);
                this.property = 'open';
            }
            return Open;
        })(SetAttributeControl);
        controls.Open = Open;

        var Visible = (function (_super) {
            __extends(Visible, _super);
            function Visible() {
                _super.apply(this, arguments);
            }
            /**
            * Obtains the initial visibility of the item
            * based on it's initial display.
            */
            Visible.prototype.initialize = function () {
                var element = this.element;

                if (!isEmpty(element.style.display)) {
                    this.__initialDisplay = element.style.display;
                } else {
                    var $window = acquire('$window');
                    this.__initialDisplay = $window.getComputedStyle(element).display;
                }

                if (this.__initialDisplay === 'none') {
                    this.__initialDisplay = '';
                }
            };

            /**
            * Evaluates boolean expression and sets the display.
            */
            Visible.prototype.setter = function () {
                var expression = this.attributes[this.attribute], style = this.element.style;

                switch (expression) {
                    case 'false':
                    case '0':
                    case 'null':
                    case '':
                        style.display = 'none';
                        break;
                    default:
                        style.display = this.__initialDisplay;
                }
            };
            return Visible;
        })(SetAttributeControl);
        controls.Visible = Visible;

        var Style = (function (_super) {
            __extends(Style, _super);
            function Style() {
                _super.apply(this, arguments);
            }
            /**
            * Sets the evaluated styles on the element.
            */
            Style.prototype.setter = function () {
                var expression = this.attributes[this.attribute];

                if (isEmpty(expression)) {
                    return;
                }

                var attributes = expression.split(';'), elementStyle = this.element.style, length = attributes.length, splitStyles, styleType, styleValue;

                for (var i = 0; i < length; ++i) {
                    splitStyles = attributes[i].split(':');
                    if (splitStyles.length === 2) {
                        styleType = camelCase(splitStyles[0].trim());
                        styleValue = splitStyles[1].trim();

                        if (!isUndefined(elementStyle[styleType])) {
                            elementStyle[styleType] = styleValue;
                        }
                    }
                }
            };
            return Style;
        })(SetAttributeControl);
        controls.Style = Style;

        register.control('plat-checked', Checked);
        register.control('plat-disabled', Disabled);
        register.control('plat-selected', Selected);
        register.control('plat-readonly', Readonly);
        register.control('plat-open', Open);
        register.control('plat-visible', Visible);
        register.control('plat-style', Style);

        var ElementPropertyControl = (function (_super) {
            __extends(ElementPropertyControl, _super);
            function ElementPropertyControl() {
                _super.apply(this, arguments);
            }
            /**
            * The function for setting the corresponding
            * attribute {property} value to the evaluated expression.
            */
            ElementPropertyControl.prototype.setter = function () {
                var element = this.element, elementProperty = this.property, expression = this.attributes[this.attribute];

                if (isEmpty(expression) || isNull(element)) {
                    return;
                }

                if (!isUndefined(element[elementProperty])) {
                    element[elementProperty] = expression;
                }
            };
            return ElementPropertyControl;
        })(SetAttributeControl);
        controls.ElementPropertyControl = ElementPropertyControl;

        var Href = (function (_super) {
            __extends(Href, _super);
            function Href() {
                _super.apply(this, arguments);
                /**
                * The corresponding attribute to set on the element.
                */
                this.property = 'href';
            }
            return Href;
        })(ElementPropertyControl);
        controls.Href = Href;

        var Src = (function (_super) {
            __extends(Src, _super);
            function Src() {
                _super.apply(this, arguments);
                /**
                * The corresponding attribute to set on the element.
                */
                this.property = 'src';
            }
            return Src;
        })(ElementPropertyControl);
        controls.Src = Src;

        var Srcset = (function (_super) {
            __extends(Srcset, _super);
            function Srcset() {
                _super.apply(this, arguments);
                /**
                * The corresponding attribute to set on the element.
                */
                this.property = 'srcset';
            }
            return Srcset;
        })(ElementPropertyControl);
        controls.Srcset = Srcset;

        var Value = (function (_super) {
            __extends(Value, _super);
            function Value() {
                _super.apply(this, arguments);
                /**
                * The corresponding attribute to set on the element.
                */
                this.property = 'value';
            }
            return Value;
        })(ElementPropertyControl);
        controls.Value = Value;

        register.control('plat-href', Href);
        register.control('plat-src', Src);
        register.control('plat-srcset', Srcset);
        register.control('plat-value', Value);

        var Bind = (function (_super) {
            __extends(Bind, _super);
            function Bind() {
                _super.apply(this, arguments);
                /**
                * The priority of Bind is set high to take precede
                * other controls that may be listening to the same
                * event.
                */
                this.priority = 100;
                this.$parser = acquire('$parser');
                this.$ExceptionStatic = acquire('$ExceptionStatic');
                /**
                * An array of functions to remove the event listeners attached
                * to this element.
                */
                this._removeEventListeners = [];
            }
            /**
            * Determines the type of HTMLElement being bound to
            * and sets the necessary handlers.
            */
            Bind.prototype.initialize = function () {
                this._determineType();
            };

            /**
            * Parses and watches the expression being bound to.
            */
            Bind.prototype.loaded = function () {
                var _this = this;
                if (isNull(this.parent) || isNull(this.element)) {
                    return;
                }
                var attr = camelCase(this.type);
                this._expression = this.$parser.parse(this.attributes[attr]);

                var identifiers = this._expression.identifiers;

                if (identifiers.length !== 1) {
                    this.$ExceptionStatic.warn('Only 1 identifier allowed in a plat-bind expression');
                    this._contextExpression = null;
                    return;
                }

                var split = identifiers[0].split('.');

                this._property = split.pop();

                if (split.length > 0) {
                    this._contextExpression = this.$parser.parse(split.join('.'));
                } else {
                    this._contextExpression = {
                        evaluate: function () {
                            return _this.parent.context;
                        },
                        aliases: [],
                        identifiers: [],
                        expression: ''
                    };
                }

                this._watchExpression();

                if (isNull(this._addEventType)) {
                    return;
                }

                this._addEventType();
            };

            /**
            * Re-observes the expression with the new context.
            */
            Bind.prototype.contextChanged = function () {
                this._watchExpression();
            };

            /**
            * Removes all of the element's event listeners.
            */
            Bind.prototype.dispose = function () {
                var element = this.element;

                if (!isNull(element)) {
                    var removeListeners = this._removeEventListeners, length = removeListeners.length;

                    for (var i = 0; i < length; ++i) {
                        removeListeners[i]();
                    }

                    this._removeEventListeners = null;
                }

                this._eventListener = null;
                this._postponedEventListener = null;
                this._addEventType = null;
            };

            /**
            * Adds a text event as the event listener.
            * Used for textarea and input[type=text].
            */
            Bind.prototype._addTextEventListener = function () {
                var _this = this;
                var composing = false, timeout;

                this._eventListener = function () {
                    if (composing) {
                        return;
                    }

                    _this._propertyChanged();
                };

                this._postponedEventListener = function () {
                    var _this = this;
                    if (!!timeout) {
                        return;
                    }

                    timeout = postpone(function () {
                        _this._eventListener();
                        timeout = null;
                    });
                };

                this._addEventListener('compositionstart', function () {
                    return composing = true;
                });

                this._addEventListener('compositionend', function () {
                    return composing = false;
                });

                this._addEventListener('keydown', function (ev) {
                    var key = ev.keyCode, codes = controls.KeyCodes;

                    if (key === codes.lwk || key === codes.rwk || (key > 15 && key < 28) || (key > 32 && key < 41)) {
                        return;
                    }

                    _this._postponedEventListener();
                });
                this._addEventListener('cut', null, true);
                this._addEventListener('paste', null, true);
                this._addEventListener('change');
            };

            /**
            * Adds a change event as the event listener.
            * Used for select, input[type=radio], and input[type=range].
            */
            Bind.prototype._addChangeEventListener = function () {
                this._eventListener = this._propertyChanged.bind(this);
                this._addEventListener('change');
            };

            /**
            * Adds the event listener to the element.
            *
            * @param event The event type
            * @param listener The event listener
            * @param postpone Whether or not to postpone the event listener
            */
            Bind.prototype._addEventListener = function (event, listener, postpone) {
                var listener = listener || (!!postpone ? this._postponedEventListener : this._eventListener);

                this._pushRemoveEventListener(event, listener);

                this.element.addEventListener(event, listener, false);
            };

            /**
            * Getter for input[type=checkbox] and input[type=radio]
            */
            Bind.prototype._getChecked = function () {
                return this.element.checked;
            };

            /**
            * Getter for input[type=text], input[type=range],
            * textarea, and select.
            */
            Bind.prototype._getValue = function () {
                return this.element.value;
            };

            /**
            * Setter for textarea, input[type=text],
            * and input[type=button]
            *
            * @param newValue The new value to set
            */
            Bind.prototype._setText = function (newValue) {
                if (isNull(newValue)) {
                    newValue = '';
                }

                this.__setValue(newValue);
            };

            /**
            * Setter for input[type=range]
            *
            * @param newValue The new value to set
            */
            Bind.prototype._setRange = function (newValue) {
                if (isEmpty(newValue)) {
                    newValue = 0;
                }

                this.__setValue(newValue);
            };

            /**
            * Setter for input[type=checkbox] and input[type=radio]
            *
            * @param newValue The new value to set
            */
            Bind.prototype._setChecked = function (newValue) {
                this.element.checked = !(newValue === false);
            };

            /**
            * Setter for select
            *
            * @param newValue The new value to set
            */
            Bind.prototype._setSelectedIndex = function (newValue) {
                this.element.value = newValue;
            };

            /**
            * Determines the type of HTMLElement being bound to
            * and sets the necessary handlers.
            */
            Bind.prototype._determineType = function () {
                var element = this.element;

                if (isNull(element)) {
                    return;
                }

                switch (element.nodeName.toLowerCase()) {
                    case 'textarea':
                        this._addEventType = this._addTextEventListener;
                        this._getter = this._getValue;
                        this._setter = this._setText;
                        break;
                    case 'input':
                        switch (element.type) {
                            case 'button':
                                this._setter = this._setText;
                                break;
                            case 'checkbox':
                            case 'radio':
                                this._addEventType = this._addChangeEventListener;
                                this._getter = this._getChecked;
                                this._setter = this._setChecked;
                                break;
                            case 'range':
                                this._addEventType = this._addChangeEventListener;
                                this._getter = this._getValue;
                                this._setter = this._setRange;
                                break;
                            default:
                                this._addEventType = this._addTextEventListener;
                                this._getter = this._getValue;
                                this._setter = this._setText;
                                break;
                        }
                        break;
                    case 'select':
                        this._addEventType = this._addChangeEventListener;
                        this._getter = this._getValue;
                        this._setter = this._setSelectedIndex;
                        var options = element.options, length = options.length, option;

                        for (var i = 0; i < length; ++i) {
                            option = options[i];
                            if (!option.hasAttribute('value')) {
                                option.setAttribute('value', option.textContent);
                            }
                        }
                        break;
                }
            };

            /**
            * Observes the expression to bind to.
            */
            Bind.prototype._watchExpression = function () {
                var expression = this._expression;
                this.observeExpression(expression, this._setter);
                this._setter(this.parent.evaluateExpression(expression));
            };

            /**
            * Pushes a new function for removing a newly added
            * event listener.
            *
            * @param event The event type
            * @param listener The event listener
            */
            Bind.prototype._pushRemoveEventListener = function (event, listener) {
                var element = this.element;

                this._removeEventListeners.push(function () {
                    element.removeEventListener(event, listener, false);
                });
            };

            /**
            * Sets the context property being bound to when the
            * element's property is changed.
            */
            Bind.prototype._propertyChanged = function () {
                if (isNull(this._contextExpression)) {
                    return;
                }

                var context = this.parent.evaluateExpression(this._contextExpression), property = this._property;

                var newValue = this._getter();

                if (isNull(context) || context[property] === newValue) {
                    return;
                }

                context[property] = newValue;
            };
            Bind.prototype.__setValue = function (newValue) {
                if (this.element.value === newValue) {
                    return;
                }

                this.element.value = newValue;
            };
            return Bind;
        })(AttributeControl);
        controls.Bind = Bind;

        register.control('plat-bind', Bind);

        var ObservableAttributeControl = (function (_super) {
            __extends(ObservableAttributeControl, _super);
            function ObservableAttributeControl() {
                _super.apply(this, arguments);
                /**
                * The property to set on the associated template control.
                */
                this.property = '';
                /**
                * The set of functions added by the Template Control that listens
                * for property changes.
                */
                this._listeners = [];
            }
            /**
            * Sets the initial value of the property on
            * the Template Control.
            */
            ObservableAttributeControl.prototype.initialize = function () {
                this.attribute = camelCase(this.type);
                this._boundAddListener = this._addListener.bind(this);
                this._setProperty(this._getValue());
            };

            /**
            * Observes the property and resets the value.
            */
            ObservableAttributeControl.prototype.loaded = function () {
                this._observeProperty();
                this._setProperty(this._getValue());
            };

            /**
            * Stops listening for changes to the evaluated
            * expression and removes references to the listeners
            * defined by the Template Control.
            */
            ObservableAttributeControl.prototype.dispose = function () {
                if (isFunction(this._removeListener)) {
                    this._removeListener();
                }

                this._listeners = [];
            };

            /**
            * Sets the property on the Template Control.
            *
            * @param value The new value of the evaluated expression.
            * @param oldValue The old value of the evaluated expression.
            */
            ObservableAttributeControl.prototype._setProperty = function (value, oldValue) {
                var templateControl = this.templateControl;

                if (isNull(templateControl)) {
                    return;
                }

                var property = {
                    value: value,
                    observe: this._boundAddListener
                }, ContextManager = acquire('$ContextManagerStatic');

                ContextManager.defineGetter(templateControl, this.property, property, true, true);
                this._callListeners(value, oldValue);
            };

            /**
            * Calls the listeners defined by the Template Control.
            *
            * @param value The new value of the evaluated expression.
            * @param oldValue The old value of the evaluated expression.
            */
            ObservableAttributeControl.prototype._callListeners = function (newValue, oldValue) {
                var listeners = this._listeners, length = listeners.length, templateControl = this.templateControl;

                for (var i = 0; i < length; ++i) {
                    listeners[i].call(templateControl, newValue, oldValue);
                }
            };

            /**
            * Adds a listener as defined by the Template Control.
            *
            * @param listener The listener added by the Template Control.
            */
            ObservableAttributeControl.prototype._addListener = function (listener) {
                var listeners = this._listeners, index = listeners.length;

                listeners.push(listener);

                return function removeListener() {
                    listeners.splice(index, 1);
                };
            };

            /**
            * Evaluates the attribute's value.
            */
            ObservableAttributeControl.prototype._getValue = function () {
                var expression = this.attributes[this.attribute], templateControl = this.templateControl;

                if (isNull(templateControl)) {
                    return;
                }

                return this.evaluateExpression(expression);
            };

            /**
            * Observes the attribute's value.
            */
            ObservableAttributeControl.prototype._observeProperty = function () {
                var expression = this.attributes[this.attribute], templateControl = this.templateControl, parent = this.parent;

                if (isNull(templateControl)) {
                    return;
                }

                this._removeListener = this.observeExpression(expression, this._setProperty);
            };
            return ObservableAttributeControl;
        })(AttributeControl);
        controls.ObservableAttributeControl = ObservableAttributeControl;

        var Options = (function (_super) {
            __extends(Options, _super);
            function Options() {
                _super.apply(this, arguments);
                /**
                * The property to set on the associated template control.
                */
                this.property = 'options';
            }
            return Options;
        })(ObservableAttributeControl);
        controls.Options = Options;

        register.control('plat-options', Options);
    })(plat.controls || (plat.controls = {}));
    var controls = plat.controls;
    (function (ui) {
        var TemplateControl = (function (_super) {
            __extends(TemplateControl, _super);
            /**
            * TemplateControls are the base control for any UIControl. They provide properties for the control to use
            * to manage its body HTML.
            */
            function TemplateControl() {
                _super.call(this);
                /**
                * Specifies the absolute path from where the context was created to this control's context.
                * Used by the ContextManager for maintaining context parity.
                *
                * @example 'context.childContextProperty.grandChildContextProperty'
                */
                this.absoluteContextPath = null;
                /**
                * The inherited singleton object used for data-binding. A control that implements IViewControl will
                * create the context object for all of its children. Any properties bound in the DOM markup will be
                * initialized to NULL automatically. If a control does not implement IViewControl it cannot
                * directly modify the context property, and it should only modify child properties off of context.
                */
                this.context = null;
                /**
                * Indicates whether or not this control defines its over context. Controls that implement
                * IViewControl will automatically implement this flag.
                */
                this.hasOwnContext = false;
                /**
                * Contains DOM helper methods for manipulating this control's element.
                */
                this.dom = acquire('$dom');
            }
            TemplateControl.evaluateExpression = function (expression, control, aliases) {
                if (isNull(expression)) {
                    return;
                } else if (!(isString(expression) || isFunction(expression.evaluate))) {
                    return;
                }

                var parser = acquire('$parser');

                expression = isString(expression) ? parser.parse(expression) : expression;

                if (isNull(control)) {
                    return expression.evaluate(null, aliases);
                }

                if (expression.aliases.length > 0) {
                    aliases = TemplateControl.getResources(control, expression.aliases, aliases);
                }

                return expression.evaluate(control.context, aliases);
            };

            /**
            * Given a control and Array of aliases, finds the associated resources and builds a context object containing
            * the values. Returns the object.
            *
            * @param control The control used as the starting point for finding resources.
            * @param aliases An array of aliases to search for.
            * @param resources An optional resources object to extend, if no resources object is passed in a new one will be created.
            */
            TemplateControl.getResources = function (control, aliases, resources) {
                if (isNull(control)) {
                    return {};
                }

                var length = aliases.length, alias, resourceObj, cache = TemplateControl.__resourceCache[control.uid];

                if (isNull(cache)) {
                    cache = TemplateControl.__resourceCache[control.uid] = {};
                }

                resources = resources || {};

                for (var i = 0; i < length; ++i) {
                    alias = aliases[i];

                    if (!isNull(resources[alias])) {
                        continue;
                    } else if (!isNull(cache[alias])) {
                        var resourceControl = cache[alias].control, controlResources = resourceControl.resources;

                        if (isNull(controlResources)) {
                            resourceObj = TemplateControl.findResource(control, alias);
                        } else {
                            resourceObj = {
                                control: resourceControl,
                                resource: controlResources[alias]
                            };
                        }
                    } else {
                        resourceObj = TemplateControl.findResource(control, alias);
                    }

                    if (isNull(resourceObj)) {
                        var Exception = acquire('$ExceptionStatic');
                        Exception.warn('Attempting to use a resource that is not defined.', Exception.CONTEXT);
                        continue;
                    }

                    cache[alias] = resourceObj;
                    resources['@' + alias] = isNull(resourceObj.resource) ? resourceObj.resource : resourceObj.resource.value;
                }

                return resources;
            };

            /**
            * Starts at a control and searches up its parent chain for a particular resource alias.
            * If the resource is found, it will be returned along with the control instance on which
            * the resource was found.
            *
            * @param control The control on which to start searching for the resource alias.
            * @param alias The alias to search for.
            */
            TemplateControl.findResource = function (control, alias) {
                var resource;

                if (isNull(control)) {
                    return null;
                }

                if (alias === 'rootContext') {
                    control = Control.getRootControl(control);
                    return {
                        resource: control.resources[alias],
                        control: control
                    };
                } else if (alias === 'context' || alias === 'control') {
                    return {
                        resource: control.resources[alias],
                        control: control
                    };
                }

                while (!isNull(control)) {
                    resource = control.resources[alias];
                    if (!isNull(resource)) {
                        return {
                            resource: resource,
                            control: control
                        };
                    }
                    control = control.parent;
                }
            };

            /**
            * Recursively disposes a control and its children.
            * @static
            * @param control A control to dispose.
            */
            TemplateControl.dispose = function (control) {
                if (isNull(control)) {
                    return;
                }

                var parent = control.parent, rootControl, parentControls = !isNull(parent) ? parent.controls : null, uid = control.uid, controls = (control.controls && control.controls.slice(0)), ContextManager = acquire('$ContextManagerStatic'), define = ContextManager.defineProperty, Resources = acquire('$ResourcesStatic'), BindableTemplates = acquire('$BindableTemplatesStatic'), managerCache = acquire('$ManagerCacheStatic');

                if (!isNull(controls)) {
                    var length = controls.length - 1;

                    for (var i = length; i >= 0; --i) {
                        Control.dispose(controls[i]);
                    }
                }

                if (isFunction(control.dispose)) {
                    control.dispose();
                }

                TemplateControl.removeElement(control);

                Resources.dispose(control);
                BindableTemplates.dispose(control);

                TemplateControl.__resourceCache[control.uid] = null;
                delete TemplateControl.__resourceCache[control.uid];

                ContextManager.dispose(control);
                events.EventManager.dispose(control.uid);

                managerCache.remove(uid);
                Control.removeParent(control);

                define(control, 'context', null, true, true);
                define(control, 'resources', null, true, true);
                control.attributes = null;
                control.bindableTemplates = null;
                control.controls = [];
                control.root = null;
                control.innerTemplate = null;
            };

            /**
            * Loads the control tree depth first (visit children, then visit self).
            *
            * @static
            * @param control The control serving as the root control to load.
            */
            TemplateControl.loadControl = function (control) {
                var children = control.controls, length = children.length, child;

                for (var i = 0; i < length; ++i) {
                    child = children[i];
                    if (!isNull(child.controls)) {
                        TemplateControl.loadControl(child);
                    } else {
                        child.loaded();
                    }
                }

                control.loaded();
            };

            TemplateControl.contextChanged = function (control, newValue, oldValue) {
                control.context = newValue;

                TemplateControl.setContextResources(control);

                if (isFunction(control.contextChanged)) {
                    control.contextChanged(newValue, oldValue);
                }
            };

            /**
            * Sets the 'context' resource value on a template control. If the control specifies
            * hasOwnContext, the 'rootContext' resource value will be set.
            *
            * @param control The control whose context resources will be set.
            */
            TemplateControl.setContextResources = function (control) {
                var value = control.context;

                if (isNull(control.resources)) {
                    var Resources = acquire('$ResourcesStatic');
                    control.resources = Resources.getInstance();
                    control.resources.initialize(control);
                }

                if (control.hasOwnContext) {
                    if (isNull(control.resources['rootContext'])) {
                        control.resources.add({
                            root: {
                                type: 'observable',
                                value: value
                            }
                        });
                    } else {
                        control.resources['rootContext'].value = value;
                    }
                }

                if (isNull(control.resources['context'])) {
                    control.resources.add({
                        context: {
                            type: 'observable',
                            value: value
                        }
                    });

                    return;
                }

                control.resources['context'].value = value;
            };

            /**
            * Completely removes a control's element from its parentNode. If the
            * control implements replaceWith=null, All of its nodes between its
            * startNode and endNode (inclusive) will be removed.
            *
            * @param control The control whose element should be removed.
            */
            TemplateControl.removeElement = function (control) {
                var parentNode, dom = acquire('$dom');

                if (isNull(control)) {
                    return;
                }

                var element = control.element;

                if (control.replaceWith === null || control.replaceWith === '' || element instanceof DocumentFragment) {
                    dom.removeAll(control.startNode, control.endNode);
                    control.elementNodes = control.startNode = control.endNode = null;
                    return;
                } else if (isNull(element)) {
                    return;
                }

                parentNode = element.parentNode;

                if (!isNull(parentNode)) {
                    parentNode.removeChild(element);
                }

                control.element = null;
            };

            /**
            * Sets the absoluteContextPath read-only property on a control.
            *
            * @param control The control on which to set the absoluteContextPath.
            * @param path The path to set on the control.
            */
            TemplateControl.setAbsoluteContextPath = function (control, path) {
                var ContextManager = acquire('$ContextManagerStatic');
                ContextManager.defineGetter(control, 'absoluteContextPath', path, false, true);
            };

            /**
            * Determines the template for a control by searching for a templateUrl,
            * using the provided templateUrl, or serializing the control's templateString.
            */
            TemplateControl.determineTemplate = function (control, templateUrl) {
                var template, templateCache = acquire('$templateCache'), dom = acquire('$dom');

                if (!isNull(templateUrl)) {
                    control.templateUrl = templateUrl;
                } else if (!isNull(control.templateUrl)) {
                    templateUrl = control.templateUrl;
                } else if (!isNull(control.templateString)) {
                    var type = control.type;
                    template = templateCache.read(type);
                    if (!isNull(template)) {
                        return template;
                    }
                    template = dom.serializeTemplate(control.templateString);
                    return templateCache.put(type, template);
                } else {
                    return null;
                }

                template = templateCache.read(templateUrl);

                if (!isNull(template)) {
                    return template;
                }

                var ajax = acquire('$http').ajax, Exception = acquire('$ExceptionStatic');

                var templatePromise = new async.Promise(function initiateTemplateCall(resolve, reject) {
                    ajax({ url: templateUrl }).then(function templateSuccess(success) {
                        if (!isObject(success) || !isString(success.response)) {
                            Exception.warn('No template found at ' + templateUrl, Exception.AJAX);
                            resolve();
                            return;
                        }

                        var templateString = success.response;
                        if (isEmpty(templateString.trim())) {
                            resolve();
                            return;
                        }

                        template = dom.serializeTemplate(templateString);

                        resolve(templateCache.put(templateUrl, template));
                    }, function templateError(error) {
                        postpone(function () {
                            Exception.fatal('Failure to get template from ' + templateUrl + '.', Exception.TEMPLATE);
                        });
                        reject(error);
                    });
                });

                templateCache.put(templateUrl, templatePromise);

                return templatePromise;
            };

            /**
            * Detaches a TemplateControl. Disposes its children, but does not dispose the TemplateControl.
            *
            * @static
            * @param control The control to be detached.
            */
            TemplateControl.detach = function (control) {
                if (isNull(control)) {
                    return;
                }

                var ContextManager = acquire('$ContextManagerStatic'), Resources = acquire('$ResourcesStatic'), managerCache = acquire('$ManagerCacheStatic');

                if (isNull(control.controls)) {
                    return;
                }

                var controls = control.controls.slice(0), length = controls.length;

                for (var i = 0; i < length; ++i) {
                    Control.dispose(controls[i]);
                }

                TemplateControl.removeElement(control);

                Resources.dispose(control, true);

                TemplateControl.__resourceCache[control.uid] = null;
                delete TemplateControl.__resourceCache[control.uid];

                ContextManager.dispose(control, true);
                events.EventManager.dispose(control.uid);

                managerCache.remove(control.uid);
                Control.removeParent(control);

                control.controls = [];
                control.attributes = null;
            };

            /**
            * This event is fired when a TemplateControl's context property is changed by an ancestor control.
            */
            TemplateControl.prototype.contextChanged = function () {
            };

            /**
            * A method called for ITemplateControls to set their template. During this method a control should
            * ready its template for compilation. Whatever is in the control's element (or elementNodes if replaceWith
            * is implemented) after this method's execution will be compiled and appear on the DOM.
            */
            TemplateControl.prototype.setTemplate = function () {
            };

            /**
            * Finds the identifier string associated with the given context object. The string returned
            * is the path from a control's context.
            *
            * @param context The object to locate on the control's context.
            *
            * @example
            *     // returns 'title'
            *     this.getIdentifier(this.context.title);
            */
            TemplateControl.prototype.getIdentifier = function (context) {
                var queue = [], dataContext = this.context, found = false, obj = {
                    context: dataContext,
                    identifier: ''
                }, length, keys, key, newObj;

                if (dataContext === context) {
                    found = true;
                } else {
                    queue.push(obj);
                }

                while (queue.length > 0) {
                    obj = queue.pop();

                    if (!isObject(obj.context)) {
                        continue;
                    }

                    keys = Object.keys(obj.context);
                    length = keys.length;

                    for (var i = 0; i < length; ++i) {
                        key = keys[i];
                        newObj = obj.context[key];

                        if (newObj === context) {
                            return (obj.identifier !== '') ? (obj.identifier + '.' + key) : key;
                        }

                        queue.push({
                            context: newObj,
                            identifier: (obj.identifier !== '') ? (obj.identifier + '.' + key) : key
                        });
                    }
                }
                if (!found) {
                    return;
                }

                return obj.identifier;
            };

            /**
            * Finds the absolute identifier string associated with the given context object. The string returned
            * is the path from a control's root ancestor's context.
            *
            * @param context The object to locate on the root control's context.
            */
            TemplateControl.prototype.getAbsoluteIdentifier = function (context) {
                if (context === this.context) {
                    return this.absoluteContextPath;
                }

                var localIdentifier = this.getIdentifier(context);
                if (isNull(localIdentifier)) {
                    return localIdentifier;
                }

                return this.absoluteContextPath + '.' + localIdentifier;
            };

            /**
            * Finds the associated resources and builds a context object containing
            * the values. Returns the object.
            *
            * @param aliases An array of aliases to search for.
            * @param resources An optional resources object to extend, if no resources object is passed in a new one will be created.
            */
            TemplateControl.prototype.getResources = function (aliases, resources) {
                return TemplateControl.getResources(this, aliases, resources);
            };

            /**
            * Starts at a control and searches up its parent chain for a particular resource alias.
            * If the resource is found, it will be returned along with the control instance on which
            * the resource was found.
            *
            * @param alias The alias to search for.
            */
            TemplateControl.prototype.findResource = function (alias) {
                return TemplateControl.findResource(this, alias);
            };

            TemplateControl.prototype.evaluateExpression = function (expression, context) {
                return TemplateControl.evaluateExpression(expression, this, context);
            };

            TemplateControl.prototype.observe = function (context, property, listener) {
                if (isNull(context) || !context.hasOwnProperty(property)) {
                    return;
                }

                var control = !isFunction(this.getAbsoluteIdentifier) ? this.parent : this, absoluteIdentifier = control.getAbsoluteIdentifier(context), ContextManager = acquire('$ContextManagerStatic');

                if (isNull(absoluteIdentifier)) {
                    return;
                }

                var contextManager = ContextManager.getManager(Control.getRootControl(this));
                return contextManager.observe(absoluteIdentifier + '.' + property, {
                    listener: listener.bind(this),
                    uid: this.uid
                });
            };

            TemplateControl.prototype.observeArray = function (context, property, listener) {
                var _this = this;
                if (isNull(context) || !context.hasOwnProperty(property)) {
                    return;
                }

                var array = context[property], callback = listener.bind(this);

                if (!isArray(array)) {
                    return;
                }

                var control = !isFunction(this.getAbsoluteIdentifier) ? this.parent : this, absoluteIdentifier = control.getAbsoluteIdentifier(context), ContextManager = acquire('$ContextManagerStatic');

                if (isNull(absoluteIdentifier)) {
                    if (property === 'context') {
                        absoluteIdentifier = control.absoluteContextPath;
                    } else {
                        return;
                    }
                } else {
                    absoluteIdentifier += '.' + property;
                }

                var contextManager = ContextManager.getManager(Control.getRootControl(this)), uid = this.uid, removeCallback = contextManager.observe(absoluteIdentifier, {
                    listener: function (newValue, oldValue) {
                        contextManager.observeArray(_this, callback, absoluteIdentifier, newValue, oldValue);
                    },
                    uid: uid
                });
                contextManager.observeArray(this, callback, absoluteIdentifier, array, null);

                // need to call callback if
                return function () {
                    ContextManager.removeArrayListeners(absoluteIdentifier, uid);
                    removeCallback();
                };
            };
            TemplateControl.__resourceCache = {};
            return TemplateControl;
        })(Control);
        ui.TemplateControl = TemplateControl;

        function TemplateControlStatic() {
            return TemplateControl;
        }
        ui.TemplateControlStatic = TemplateControlStatic;

        register.injectable('$TemplateControlStatic', TemplateControlStatic, null, register.injectableType.STATIC);

        

        var ViewControl = (function (_super) {
            __extends(ViewControl, _super);
            /**
            * A ViewControl is used in a controls.Viewport for simulated page navigation. The
            * ViewControl has navigation events that are called when navigating to and from the control.
            */
            function ViewControl() {
                _super.call(this);
                /**
                * The context used for data binding and inheritance.
                */
                this.hasOwnContext = true;
            }
            /**
            * Detaches a ViewControl. Disposes its children, but does not dispose the ViewControl.
            * Useful for the Navigator when storing the ViewControl in history.
            *
            * @static
            * @param control The control to be detached.
            */
            ViewControl.detach = function (control) {
                TemplateControl.detach(control);
            };

            /**
            * Recursively disposes a control and its children.
            * @static
            * @param control A control to dispose.
            */
            ViewControl.dispose = function (control) {
                TemplateControl.dispose(control);
            };

            /**
            * This event is fired when this control has been navigated to.
            *
            * @param parameter A navigation parameter sent from the previous IViewControl.
            */
            ViewControl.prototype.navigatedTo = function (parameter) {
            };

            /**
            * This event is fired when this control is being navigated away from.
            *
            * @param parameter A navigation parameter sent from wherever initialized the navigation.
            * @param route A IRoute, sent if the navigation is a result of the url changing.
            * @param toControlType The type of control being navigated to next (e.g. 'my-next-view-control').
            */
            ViewControl.prototype.navigatingFrom = function () {
            };
            return ViewControl;
        })(TemplateControl);
        ui.ViewControl = ViewControl;

        function ViewControlStatic() {
            return ViewControl;
        }
        ui.ViewControlStatic = ViewControlStatic;

        register.injectable('$ViewControlStatic', ViewControlStatic, null, register.injectableType.STATIC);

        

        var Dom = (function () {
            function Dom() {
            }
            Dom.prototype.appendChildren = function (nodeList, root) {
                return appendChildren(nodeList, root);
            };

            /**
            * Clears a DOM Node by removing all of its childNodes.
            *
            * @param node The DOM Node to clear.
            */
            Dom.prototype.clearNode = function (node) {
                return clearNode(node);
            };

            Dom.prototype.clearNodeBlock = function (nodeList, parent) {
                return clearNodeBlock(nodeList, parent);
            };

            /**
            * Converts HTML string to a Node. Can be used to create text nodes.
            * Handles cross-browser issues revolving around creating elements
            * without the correct parent (e.g. '<option>Text</option>').
            */
            Dom.prototype.stringToNode = function (html) {
                return stringToNode(html);
            };

            /**
            * Sets the innerHTML of a Node. Can take in a Node rather than an HTMLElement
            * because it does not use innerHTML on the passed-in Node (it appends its
            * childNodes).
            *
            * @param node The Node to set innerHTML.
            * @param html HTML string to be put inside the node.
            *
            * @return {Node} The same node passed in, with innerHTML set.
            */
            Dom.prototype.setInnerHtml = function (node, html) {
                return setInnerHtml(node, html);
            };

            Dom.prototype.insertBefore = function (parent, nodes, endNode) {
                return insertBefore(parent, nodes, endNode);
            };

            /**
            * Takes the child nodes of the given node and places them above the node
            * in the DOM. Then removes the given node.
            *
            * @param node The Node to replace.
            * @return {Array<Node>} A Node Array that represents the childNodes of the
            * given node.
            */
            Dom.prototype.replace = function (node) {
                return replace(node);
            };

            Dom.prototype.replaceWith = function (node, newNode) {
                return replaceWith(node, newNode);
            };

            /**
            * Takes in a string representing innerHTML and returns a DocumentFragment
            * containing the serialized DOM.
            *
            * @param template The DOM string.
            * @return {DocumentFragment} The serialized DOM.
            */
            Dom.prototype.serializeTemplate = function (template) {
                return serializeTemplate(template);
            };

            /**
            * Takes in a startNode and endNode, each having the same parentNode.
            * Removes every node in between the startNode.  If endNode is not specified,
            * DOM will be removed until the end of the parentNode's children.
            *
            * @param startNode The starting node, which will not be removed.
            * @param endNode The ending node, which will not be removed.
            */
            Dom.prototype.removeBetween = function (startNode, endNode) {
                return removeBetween(startNode, endNode);
            };

            /**
            * Takes in a startNode and endNode, each having the same parentNode.
            * Removes every node in between the startNode and endNode as well as
            * the startNode and the endNode.  If endNode is not specified, DOM
            * will be removed until the end of the parentNode's children.
            *
            * @param startNode The first node to remove.
            * @param endNode The last node to remove.
            */
            Dom.prototype.removeAll = function (startNode, endNode) {
                return removeAll(startNode, endNode);
            };
            return Dom;
        })();
        ui.Dom = Dom;

        register.injectable('$dom', Dom);

        function appendChildren(nodeList, root) {
            var fragment, isFragment = root instanceof DocumentFragment, nullRoot = isNull(root), $document = acquire('$document');

            if (isFragment) {
                fragment = root;
            } else {
                fragment = $document.createDocumentFragment();
            }

            if (nullRoot) {
                root = fragment;
            }

            var list;
            if (isFunction(nodeList.push)) {
                list = nodeList;
            } else {
                list = Array.prototype.slice.call(nodeList);
            }

            while (list.length > 0) {
                fragment.insertBefore(list.shift(), null);
            }

            if (!(isFragment || nullRoot)) {
                root.appendChild(fragment);
            }

            return root;
        }

        function clearNode(node) {
            var childNodes = Array.prototype.slice.call(node.childNodes);

            while (childNodes.length > 0) {
                node.removeChild(childNodes.pop());
            }
        }

        function clearNodeBlock(nodeList, parent) {
            if (!isFunction(nodeList.push)) {
                nodeList = Array.prototype.slice.call(nodeList);
            }

            while (nodeList.length > 0) {
                parent.removeChild(nodeList.pop());
            }
        }

        function stringToNode(html) {
            var compat = acquire('$compat'), $document = acquire('$document');

            if (compat.pushState) {
                return innerHtml($document.createElement('div'), html);
            }

            var nodeName = /<([\w:]+)/.exec(html);
            var element = $document.createElement('div');

            if (isNull(nodeName)) {
                element = innerHtml(element, html);
                return element.removeChild(element.lastChild);
            }

            // string trim
            html = html.replace(/^\s+|\s+$/g, '');

            var mapTag = nodeName[1];

            if (mapTag === 'body') {
                element = innerHtml($document.createElement('html'), html);
                return element.removeChild(element.lastChild);
            }

            var wrapper = innerHtmlWrappers[mapTag] || innerHtmlWrappers._default, depth = wrapper[0], parentStart = wrapper[1], parentEnd = wrapper[2];

            element = innerHtml(element, parentStart + html + parentEnd);

            while (depth-- > 0) {
                element = element.lastChild;
            }

            return element;
        }

        function setInnerHtml(node, html) {
            clearNode(node);

            if (isEmpty(html)) {
                return;
            }

            var element = stringToNode(html);

            if (element.childNodes.length > 0) {
                appendChildren(element.childNodes, node);
            } else {
                node.insertBefore(element, null);
            }

            return node;
        }

        function insertBefore(parent, nodes, endNode) {
            if (isNull(parent)) {
                return;
            }

            if (!isFunction(nodes.push)) {
                nodes = Array.prototype.slice.call(nodes);
            }

            var $document = acquire('$document'), fragment = $document.createDocumentFragment(), length = nodes.length;

            for (var i = 0; i < length; ++i) {
                fragment.insertBefore(nodes[i], null);
            }

            parent.insertBefore(fragment, endNode);

            return nodes;
        }

        function replace(node) {
            var parent = node.parentNode, nodes = insertBefore(parent, node.childNodes, node);

            parent.removeChild(node);

            return nodes;
        }

        function replaceWith(node, newNode) {
            if (isNull(newNode)) {
                return newNode;
            }

            if (node.nodeType === Node.ELEMENT_NODE) {
                var attributes = node.attributes, length = attributes.length, attribute;

                for (var i = 0; i < length; ++i) {
                    attribute = attributes[i];
                    newNode.setAttribute(attribute.name, attribute.value);
                }
            }

            var parent = node.parentNode;

            insertBefore(newNode, node.childNodes);
            parent.replaceChild(newNode, node);

            return newNode;
        }

        function serializeTemplate(template) {
            var $document = acquire('$document'), templateElement = $document.createDocumentFragment();

            if (!isEmpty(template)) {
                setInnerHtml(templateElement, template);
            }

            return templateElement;
        }

        function removeBetween(startNode, endNode) {
            if (isNull(startNode)) {
                return;
            }

            var currentNode = startNode.nextSibling, parentNode = startNode.parentNode, tempNode;

            if (isNull(endNode)) {
                endNode = null;
            }

            if (isNull(parentNode) || (!isNull(endNode) && endNode.parentNode !== parentNode)) {
                return;
            }

            while (currentNode !== endNode) {
                tempNode = currentNode.nextSibling;
                parentNode.removeChild(currentNode);
                currentNode = tempNode;
            }
        }

        function removeAll(startNode, endNode) {
            if (isNull(startNode)) {
                return;
            }

            removeBetween(startNode, endNode);

            removeNode(startNode);
            removeNode(endNode);
        }

        var __option = [1, '<select multiple="multiple">', '</select>'], __table = [1, '<table>', '</table>'], __tableData = [3, '<table><tbody><tr>', '</tr></tbody></table>'], __svg = [1, '<svg xmlns="http://www.w3.org/2000/svg" version="1.1">', '</svg>'], innerHtmlWrappers = {
            option: __option,
            optgroup: __option,
            legend: [1, '<fieldset>', '</fieldset>'],
            area: [1, '<map>', '</map>'],
            param: [1, '<object>', '</object>'],
            thead: __table,
            tbody: __table,
            tfoot: __table,
            colgroup: __table,
            caption: __table,
            tr: [2, '<table><tbody>', '</tbody></table>'],
            col: [2, '<table><tbody></tbody><colgroup>', '</colgroup></table>'],
            td: __tableData,
            th: __tableData,
            text: __svg,
            circle: __svg,
            ellipse: __svg,
            line: __svg,
            path: __svg,
            polygon: __svg,
            polyline: __svg,
            rect: __svg,
            _default: [0, '', '']
        };

        /**
        * Safely sets innerHTML of an element. Uses MSApp.execUnsafeLocalFunction if
        * available.
        */
        function innerHtml(element, html) {
            var compat = acquire('$compat');

            if (compat.msApp) {
                MSApp.execUnsafeLocalFunction(function () {
                    element.innerHTML = html;
                });
            } else {
                element.innerHTML = html;
            }

            return element;
        }

        function removeNode(node) {
            if (isNull(node)) {
                return;
            }

            var parentNode = node.parentNode;

            if (!isNull(parentNode)) {
                node.parentNode.removeChild(node);
            }
        }

        var BindableTemplates = (function () {
            /**
            * Provides a way for ITemplateControls to bind a template to a data context. Useful
            * for narrowing data context without needing another ITemplateControl. In addition,
            * this object provides a performance increase because it will only compile the template once.
            * This object is also useful when a ITemplateControl expects multiple configuration
            * templates in its innerHTML. It can separate those templates and reuse them accordingly.
            */
            function BindableTemplates() {
                /**
                * Stores the compiled templates for this object, ready to be bound to a data context.
                * All created templates are DocumentFragments, allowing a ITemplateControl to
                * easily insert the template into the DOM (without iterating over childNodes).
                */
                this.templates = {};
                this.cache = {};
                this.compiledControls = [];
                this.$ResourcesStatic = acquire('$ResourcesStatic');
                this.$PromiseStatic = acquire('$PromiseStatic');
                this.$ManagerCacheStatic = acquire('$ManagerCacheStatic');
                this.$dom = acquire('$dom');
                this.$ExceptionStatic = acquire('$ExceptionStatic');
                this.$document = acquire('$document');
                this.$ElementManagerStatic = acquire('$ElementManagerStatic');
            }
            /**
            * Creates a new instance of BindableTemplates and returns it. If a BindableTemplates is
            * passed in, it will use the properties on the original BindableTemplates.
            *
            * @param control The ITemplateControl containing the new BindableTemplate object, used for data context
            * inheritance for templates.
            * @param originalBindableTemplates An optional IBindableTemplates object to copy.
            * @return {BindableTemplates} The newly instantiated BindableTemplates object.
            */
            BindableTemplates.create = function (control, original) {
                var bindableTemplates = new BindableTemplates();
                bindableTemplates.control = control;

                if (!isNull(original)) {
                    bindableTemplates.templates = original.templates;
                    bindableTemplates.cache = original.cache;
                }

                return bindableTemplates;
            };

            BindableTemplates.dispose = function (control) {
                var bindableTemplates = control.bindableTemplates, dispose = BindableTemplates.$TemplateControlStatic.dispose;

                if (isNull(control.bindableTemplates)) {
                    return;
                }

                var compiledControls = bindableTemplates.compiledControls, length = compiledControls.length;

                for (var i = 0; i < length; ++i) {
                    dispose(compiledControls[i]);
                }

                bindableTemplates.compiledControls = [];
                bindableTemplates.control = null;
                bindableTemplates.cache = {};
                bindableTemplates.templates = {};
            };

            BindableTemplates.prototype.bind = function (key, callback, context, resources) {
                var _this = this;
                var template = this.templates[key], control = this.control, nodeMap, templatePromise;

                if (isNull(template)) {
                    this.$ExceptionStatic.fatal('Cannot bind template, no template stored with key: ' + key, this.$ExceptionStatic.TEMPLATE);
                    return;
                }

                if (!isNull(context) && !isString(context)) {
                    context = this.control.getIdentifier(context);
                }

                if (isFunction(template.then)) {
                    template.then(function (result) {
                        _this._bindTemplate(key, result.cloneNode(true), context, resources, callback);
                    }).catch(function (error) {
                        postpone(function () {
                            _this.$ExceptionStatic.fatal(error, _this.$ExceptionStatic.COMPILE);
                        });
                    });
                    return;
                }
                this._bindTemplate(key, template.cloneNode(true), context, resources, callback);
            };

            BindableTemplates.prototype.add = function (key, template) {
                if (isNull(template)) {
                    return;
                }

                if (template.nodeType === Node.DOCUMENT_FRAGMENT_NODE) {
                    this.templates[key] = template;
                    this._compile(key, template);
                    return;
                }

                var fragment = this.$document.createDocumentFragment(), nodes;

                if (isNode(template)) {
                    fragment.appendChild(template);
                } else if (isArrayLike(template)) {
                    this.$dom.appendChildren(template, fragment);
                } else {
                    return;
                }

                this.templates[key] = fragment;

                this._compile(key, fragment);
            };
            BindableTemplates.prototype._bindTemplate = function (key, template, context, resources, callback) {
                var _this = this;
                var control = this._createBoundControl(key, template, context, resources), nodeMap = this._createNodeMap(control, template, context);

                this._bindNodeMap(nodeMap, key).then(function () {
                    control.startNode = template.insertBefore(_this.$document.createComment(control.type + ': start node'), template.firstChild);
                    control.endNode = template.insertBefore(_this.$document.createComment(control.type + ': end node'), null);

                    callback.call(_this.control, template);
                }).catch(function (error) {
                    postpone(function () {
                        _this.$ExceptionStatic.fatal(error, _this.$ExceptionStatic.BIND);
                    });
                });
            };
            BindableTemplates.prototype._bindNodeMap = function (nodeMap, key) {
                var manager = this.cache[key], child = nodeMap.uiControlNode.control, template = nodeMap.element;

                this.control.controls.push(child);

                manager.clone(template, this.$ManagerCacheStatic.read(this.control.uid), nodeMap);
                return (this.$ManagerCacheStatic.read(child.uid)).bindAndLoad();
            };
            BindableTemplates.prototype._compile = function (key, template) {
                var control = this._createBoundControl(key, template), nodeMap = this._createNodeMap(control, template);

                this.compiledControls.push(control);

                this._compileNodeMap(control, nodeMap, key);
            };
            BindableTemplates.prototype._compileNodeMap = function (control, nodeMap, key) {
                var _this = this;
                var manager = this.$ElementManagerStatic.getInstance(), promises = [];

                manager.isClone = true;
                manager.initialize(nodeMap, null);
                promises.push(manager.setUiControlTemplate());

                this.cache[key] = manager;

                promises.push(manager.fulfillTemplate());

                this.templates[key] = this.$PromiseStatic.all(promises).then(function (results) {
                    var element = nodeMap.element, startNode, endNode;

                    _this.templates[key] = nodeMap.element.cloneNode(true);

                    startNode = control.startNode = _this.$document.createComment(control.type + ': start node');
                    endNode = control.endNode = _this.$document.createComment(control.type + ': end node');
                    element.insertBefore(startNode, element.firstChild);
                    element.insertBefore(endNode, null);

                    return _this.templates[key];
                }).catch(function (error) {
                    postpone(function () {
                        _this.$ExceptionStatic.fatal(error, _this.$ExceptionStatic.COMPILE);
                    });
                });

                return this.templates[key];
            };
            BindableTemplates.prototype._createNodeMap = function (uiControl, template, childContext) {
                return {
                    element: template,
                    attributes: {},
                    nodes: [],
                    childContext: childContext,
                    uiControlNode: {
                        control: uiControl,
                        nodeName: uiControl.type,
                        expressions: [],
                        injector: null
                    }
                };
            };
            BindableTemplates.prototype._createBoundControl = function (key, template, relativeIdentifier, resources) {
                var control = new BindableTemplates.$TemplateControlStatic(), parent = this.control, hasRelativeIdentifier = !isEmpty(relativeIdentifier), absoluteContextPath;

                if (hasRelativeIdentifier) {
                    absoluteContextPath = parent.absoluteContextPath + '.' + relativeIdentifier;
                } else {
                    absoluteContextPath = parent.absoluteContextPath;
                }

                BindableTemplates.$TemplateControlStatic.setAbsoluteContextPath(control, absoluteContextPath);

                var _resources = this.$ResourcesStatic.getInstance();

                _resources.initialize(control, resources);

                control.resources = _resources;
                this.$ResourcesStatic.addControlResources(control);

                control.parent = parent;
                control.controls = [];
                control.element = template;
                control.type = this.control.type + '-@' + key;

                return control;
            };
            return BindableTemplates;
        })();
        ui.BindableTemplates = BindableTemplates;

        function BindableTemplatesStatic($TemplateControlStatic) {
            BindableTemplates.$TemplateControlStatic = $TemplateControlStatic;
            return BindableTemplates;
        }
        ui.BindableTemplatesStatic = BindableTemplatesStatic;

        register.injectable('$BindableTemplatesStatic', BindableTemplatesStatic, [
            '$TemplateControlStatic'
        ], register.injectableType.STATIC);

        

        

        var Attributes = (function () {
            function Attributes() {
                this.__listeners = {};
            }
            /**
            * Stores the information about an HTMLElement's attribute NamedNodeMap, and allows a control to observe
            * for changes on an attribute. The interface takes in a generic type, allowing ITemplateControls
            * to specify an interface for their plat-options.
            *
            * Attributes for this object are converted from dash-notation to camelCase notation. 'plat-options' are
            * parsed and stored as an object on this object, all other attributes are stored with their string values.
            */
            Attributes.prototype.initialize = function (control, attributes) {
                this.__control = control;

                var keys = Object.keys(attributes), attributeListeners = this.__listeners, key, length = keys.length, parent = control.parent, hasParent = !isNull(parent);

                for (var i = 0; i < length; ++i) {
                    key = keys[i];
                    this[key] = attributes[key];
                    attributeListeners[key] = [];
                }
            };

            /**
            * Provides a way to observe an attribute for changes.
            *
            * @param key The attribute to observe for changes (e.g. 'platOptions').
            * @param listener The listener function to be called when the attribute changes. The
            * 'this' context of the listener will be scoped to the control instance.
            */
            Attributes.prototype.observe = function (key, listener) {
                var listeners = this.__listeners[camelCase(key)];

                if (isNull(listeners)) {
                    return noop;
                }

                var length = listeners.length;

                listeners.push(listener);

                return function removeListener() {
                    listeners.splice(length, 1);
                };
            };

            /**
            * Used to show an attribute has been changed and forces listeners to be fired.
            *
            * @param key The attribute being observed for changes (e.g. 'platOptions').
            * @param newValue The new value of the attribute.
            * @param oldValue The previous value of the attribute.
            */
            Attributes.prototype.attributeChanged = function (key, newValue, oldValue) {
                var control = this.__control, listeners = this.__listeners[camelCase(key)], length = listeners.length;

                for (var i = 0; i < length; ++i) {
                    listeners[i].call(control, newValue, oldValue);
                }
            };
            return Attributes;
        })();
        ui.Attributes = Attributes;

        register.injectable('$attributes', Attributes, null, register.injectableType.MULTI);

        

        /**
        * Resources are used for providing aliases to use in markup expressions. They
        * are particularly useful when trying to access properties outside of the
        * current context, as well as reassigning context at any point in an app.
        *
        * By default, every control has a resource for '@control' and '@context'.
        * IViewControl objects also have a resource for '@root' and '@rootContext',
        * which is a reference to the control and its context.
        *
        * Resources can be created in HTML, or through the exposed control.resources
        * object. If specified in HTML, they must be the first element child of the
        * control upon which the resources will be placed. IViewControls that use a
        * templateUrl can have resources as their first element in the templateUrl.
        *
        * @example
        * <custom-control>
        *     <plat-resources>
        *         <injectable alias="Cache">$CacheStatic</injectable>
        *         <observable alias="testObj">
        *              {
        *                  foo: 'foo',
        *                  bar: 'bar',
        *                  baz: 2
        *              }
        *         </observable>
        *     </plat-resources>
        * </custom-control>
        *
        * In the above example, the resources can be accessed by using '@Cache' and '@testObj'.
        * The type of resource is denoted by the element name.
        *
        * Only resources of type 'observable' will have data binding. The types of resources are:
        * function, injectable, observable, and object. Resources of type 'function' will have their
        * associated function context bound to the control that contains the resource.
        *
        * When an alias is found in a markup expression, the framework will search up the control chain
        * to find the alias on a control's resources. This first matching alias will be used.
        */
        var Resources = (function () {
            function Resources() {
                this.__resources = {};
                this.__bound = false;
            }
            /**
            * Populates an IResource value if necessary, and adds it to the given
            * control's resources.
            *
            * @param control The control for which to create a resource.
            * @param resource The IResource used to set the value.
            * @return {IResource} The created resource.
            */
            Resources.createResource = function (control, resource) {
                if (isNull(resource)) {
                    return resource;
                }

                var value;

                switch (resource.type.toLowerCase()) {
                    case 'injectable':
                        var injector = injectableInjectors[resource.value];
                        if (!isNull(injector)) {
                            resource.value = injector.inject();
                        }
                        break;
                    case 'observable':
                        Resources._observeResource(control, resource);
                        break;
                    case 'object':
                        value = resource.value;
                        if (isString(value)) {
                            resource.value = control.evaluateExpression(value);
                        }
                        break;
                    case 'function':
                        value = resource.value;
                        if (isString(value)) {
                            value = control[value];
                            if (isFunction(value)) {
                                resource.value = value.bind(control);
                            } else {
                                ;
                                Resources.$ExceptionStatic.warn('Attempted to create a "function" ' + 'type Resource with a function not found on your control.', Resources.$ExceptionStatic.BIND);
                                resource.value = noop;
                            }
                        }
                        break;
                }

                return resource;
            };

            /**
            * Adds resource aliases for '@control' and '@context'. The resources are
            * aliases for the control instance and the control.context.
            *
            * @param control The control on which to add the resources.
            */
            Resources.addControlResources = function (control) {
                control.resources.add({
                    context: {
                        value: control.context,
                        type: 'observable'
                    },
                    control: {
                        value: control,
                        type: 'object'
                    }
                });

                if (control.hasOwnContext) {
                    Resources.__addRoot(control);
                }
            };

            Resources.bindResources = function (resourcesInstance) {
                var resources = resourcesInstance.__resources, control = resourcesInstance.__controlInstance, aliases = Object.keys(resources), controlResources = Resources.__controlResources, length = aliases.length, alias;

                for (var i = 0; i < length; ++i) {
                    alias = aliases[i];

                    if (controlResources.indexOf(alias) !== -1) {
                        continue;
                    }

                    resourcesInstance[alias] = resources[alias] = Resources.createResource(control, resourcesInstance[alias]);
                }

                resourcesInstance.__bound = true;
            };

            /**
            * Disposes a resource instance, removing its reference
            * from a control and breaking references to all resource
            * objects.
            *
            * @param resources The resources instance.
            */
            Resources.dispose = function (control, persist) {
                var resources = control.resources;

                if (isNull(resources)) {
                    return;
                }

                var keys = Object.keys(resources.__resources), key, length = keys.length, define = Resources.$ContextManagerStatic.defineProperty, resource;

                for (var i = 0; i < length; ++i) {
                    key = keys[i];
                    resource = resources[key];

                    if (!isNull(resource) && resource.type === 'observable') {
                        define(resources, key, persist ? deepExtend({}, resource) : null, true, true);
                    }
                }

                Resources._removeListeners(resources.__controlInstance);
            };

            /**
            * Parses a resources HTMLElement and creates
            * an IObject<IResource> with its element children.
            *
            * @param element The resources element to parse.
            * @return {IObject<IResource>} The resources created
            * using element.
            */
            Resources.parseElement = function (element) {
                var slice = Array.prototype.slice, whiteSpaceRegex = Resources.$regex.whiteSpaceRegex, quotationRegex = Resources.$regex.quotationRegex, resources = {}, resource, types = Resources.__resourceTypes, attrs, attr, children = slice.call(element.children), child, nodeName, text;

                while (children.length > 0) {
                    child = children.pop();
                    nodeName = child.nodeName.toLowerCase();

                    if (types.indexOf(nodeName) === -1) {
                        continue;
                    }

                    attrs = child.attributes;
                    resource = {};

                    attr = attrs.getNamedItem('alias');
                    if (isNull(attr)) {
                        continue;
                    }
                    resource.alias = attr.value;

                    text = child.textContent.replace(whiteSpaceRegex, '$1');
                    if (isEmpty(text)) {
                        continue;
                    }
                    resource.value = (nodeName === 'injectable') ? text.replace(quotationRegex, '') : text;

                    resource.type = nodeName;
                    resources[resource.alias] = resource;
                }

                return resources;
            };

            /**
            * Returns a new instance of IResources
            */
            Resources.getInstance = function () {
                return new Resources();
            };

            /**
            * Adds a '@root' alias and '@rootContext' to a control, specifying that it contains the root
            * and root context. Root controls are the root IViewControl.
            *
            * @param control The root IViewControl.
            */
            Resources.__addRoot = function (control) {
                control.resources.add({
                    root: {
                        value: control,
                        type: 'object',
                        alias: 'root'
                    },
                    rootContext: {
                        value: control.context,
                        type: 'observable',
                        alias: 'rootContext'
                    }
                });
            };

            Resources._observeResource = function (control, resource) {
                var value = resource.value, uid = control.uid, removeListeners = Resources.__observableResourceRemoveListeners[uid];

                if (isNull(removeListeners)) {
                    removeListeners = Resources.__observableResourceRemoveListeners[uid] = [];
                }

                if (isString(value)) {
                    if (!isNull(resource.initialValue)) {
                        value = resource.initialValue;
                    } else {
                        resource.initialValue = value;
                    }
                    var listener = control.observeExpression(value, function resourceChanged(newValue) {
                        resource.value = newValue;
                    });
                    resource.value = control.evaluateExpression(value);
                    removeListeners.push(listener);
                }
            };

            Resources._removeListeners = function (control) {
                if (isNull(control)) {
                    return;
                }

                var uid = control.uid, removeListeners = Resources.__observableResourceRemoveListeners[uid];

                if (isArray(removeListeners)) {
                    var length = removeListeners.length;

                    for (var i = 0; i < length; ++i) {
                        removeListeners[i]();
                    }
                }

                Resources.__observableResourceRemoveListeners[uid] = null;
                delete Resources.__observableResourceRemoveListeners[uid];
            };

            Resources.prototype.initialize = function (controlInstance, resources) {
                this.__controlInstance = controlInstance;

                if (isNull(resources)) {
                    return;
                } else if (isNode(resources)) {
                    resources = Resources.parseElement(resources);
                } else if (isObject(resources.resources)) {
                    resources = resources.resources;
                }

                this.__resources = resources;

                var keys = Object.keys(resources), key, injector, length = keys.length;

                for (var i = 0; i < length; ++i) {
                    key = keys[i];
                    this[key] = resources[key];
                }
            };

            Resources.prototype.add = function (resources) {
                if (isNull(resources)) {
                    return;
                } else if (isNode(resources)) {
                    resources = Resources.parseElement(resources);
                }

                var keys = Object.keys(resources), length = keys.length, resource, control = this.__controlInstance, bound = this.__bound, key, create = Resources.createResource;

                for (var i = 0; i < length; ++i) {
                    key = keys[i];
                    resource = resources[key];
                    resource.alias = key;

                    this[key] = this.__resources[key] = bound ? create(control, resource) : resource;
                }
            };
            Resources.__controlResources = ['control', 'context', 'root', 'rootContext'];
            Resources.__resourceTypes = ['injectable', 'object', 'observable', 'function'];
            Resources.__observableResourceRemoveListeners = {};
            return Resources;
        })();
        ui.Resources = Resources;

        function ResourcesStatic($ContextManagerStatic, $regex, $ExceptionStatic) {
            Resources.$ContextManagerStatic = $ContextManagerStatic;
            Resources.$regex = $regex;
            Resources.$ExceptionStatic = $ExceptionStatic;
            return Resources;
        }
        ui.ResourcesStatic = ResourcesStatic;

        register.injectable('$ResourcesStatic', ResourcesStatic, [
            '$ContextManagerStatic',
            '$regex',
            '$ExceptionStatic'
        ], register.injectableType.STATIC);

        

        

        (function (_controls) {
            var Baseport = (function (_super) {
                __extends(Baseport, _super);
                function Baseport(navigator) {
                    _super.call(this);
                    this.navigator = navigator;
                    this.$ManagerCacheStatic = acquire('$ManagerCacheStatic');
                    this.$ExceptionStatic = acquire('$ExceptionStatic');
                    this.$document = acquire('$document');
                    this.$ElementManagerStatic = acquire('$ElementManagerStatic');
                }
                /**
                * Clears the Baseport's innerHTML.
                */
                Baseport.prototype.setTemplate = function () {
                    this.dom.clearNode(this.element);
                };

                /**
                * Initializes the navigator.
                *
                * @param navigationParameter A parameter needed
                * to perform the specified type of navigation.
                * @param options The IBaseNavigationOptions
                * needed on load for the inherited form of
                * navigation.
                */
                Baseport.prototype.loaded = function (navigationParameter, options) {
                    var navigator = this.navigator;
                    navigator.initialize(this);
                    navigator.navigate(navigationParameter, options);
                };

                /**
                * Grabs the root of this Baseport's manager
                * tree, clears it, and initializes the
                * creation of a new one by kicking off a
                * navigate.
                *
                * @param ev The navigation options
                */
                Baseport.prototype.navigateTo = function (ev) {
                    var control = ev.target, parameter = ev.parameter, options = ev.options, element = this.element, controlType = ev.type, newControl = isFunction(control.inject);

                    var node = this.$document.createElement(controlType), attributes = {}, nodeMap = {
                        element: node,
                        attributes: attributes,
                        nodes: [],
                        uiControlNode: {
                            control: newControl ? control.inject() : control,
                            nodeName: controlType,
                            expressions: [],
                            injector: control,
                            childManagerLength: 0
                        }
                    };

                    element.appendChild(node);

                    var viewportManager = this.$ManagerCacheStatic.read(this.uid);
                    viewportManager.children = [];

                    var manager = this.$ElementManagerStatic.getInstance();

                    manager.initialize(nodeMap, viewportManager, !newControl);

                    control = this.controls[0];
                    control.navigator = this.navigator;
                    this.navigator.navigated(control, parameter, options);

                    manager.setUiControlTemplate();
                };

                /**
                * Manages the navigatingFrom lifecycle event for
                * ViewControls.
                *
                * @param fromControl The ViewControl being navigated
                * away from.
                */
                Baseport.prototype.navigateFrom = function (fromControl) {
                    if (isNull(fromControl) || !isFunction(fromControl.navigatingFrom)) {
                        return;
                    }

                    fromControl.navigatingFrom();
                };
                return Baseport;
            })(TemplateControl);
            _controls.Baseport = Baseport;

            

            var Viewport = (function (_super) {
                __extends(Viewport, _super);
                function Viewport() {
                    _super.apply(this, arguments);
                }
                /**
                * Checks for a defaultView, finds the ViewControl's injector,
                * and initializes the loading of the view.
                */
                Viewport.prototype.loaded = function () {
                    if (isNull(this.options)) {
                        this.$ExceptionStatic.warn('No defaultView specified in plat-options for plat-viewport.', this.$ExceptionStatic.NAVIGATION);
                        return;
                    }

                    var options = this.options.value || {}, controlType = options.defaultView, injector = viewControlInjectors[controlType];

                    if (isNull(injector)) {
                        this.$ExceptionStatic.fatal('The defaultView ' + controlType + ' is not a registered view control.', this.$ExceptionStatic.NAVIGATION);
                        return;
                    }

                    _super.prototype.loaded.call(this, injector);
                };
                return Viewport;
            })(Baseport);
            _controls.Viewport = Viewport;

            

            register.control('plat-viewport', Viewport, ['$navigator']);

            var Routeport = (function (_super) {
                __extends(Routeport, _super);
                function Routeport() {
                    _super.apply(this, arguments);
                }
                /**
                * Looks for a defaultRoute and initializes the loading
                * of the view.
                */
                Routeport.prototype.loaded = function () {
                    var path = '', options = this.options;

                    if (!isNull(options) && !isNull(options.value)) {
                        path = options.value.defaultRoute || '';
                    }

                    _super.prototype.loaded.call(this, path, {
                        replace: true
                    });
                };
                return Routeport;
            })(Baseport);

            

            register.control('plat-routeport', Routeport, ['$routingNavigator']);

            var Template = (function (_super) {
                __extends(Template, _super);
                function Template() {
                    _super.call(this);
                    /**
                    * Removes the <plat-template> node from the DOM
                    */
                    this.replaceWith = null;
                    this.$PromiseStatic = acquire('$PromiseStatic');
                    this.$templateCache = acquire('$templateCache');
                    this.$ExceptionStatic = acquire('$ExceptionStatic');
                    this.__isFirst = false;
                    var Cache = acquire('$CacheStatic');
                    this.__templateControlCache = Cache.create('templateControlCache');
                }
                /**
                * Initializes the creation of the template.
                */
                Template.prototype.initialize = function () {
                    var templateControlCache = this.__templateControlCache, id = this._id = this.options.value.id, options = this.options.value;

                    if (isNull(id)) {
                        return;
                    }

                    this._url = options.url;

                    var templatePromise = this.__templateControlCache.read(id);
                    if (!isNull(templatePromise)) {
                        this.__templatePromise = templatePromise;
                        return;
                    }

                    this.__isFirst = true;
                    this._initializeTemplate();
                };

                /**
                * Decides if this is a template definition or
                * a template instance.
                */
                Template.prototype.loaded = function () {
                    if (!this.__isFirst) {
                        this._waitForTemplateControl(this.__templatePromise);
                    }
                };

                /**
                * Removes the template from the template cache.
                */
                Template.prototype.dispose = function () {
                    if (this.__isFirst) {
                        this.$templateCache.remove(this._id);
                        this.__templateControlCache.dispose();
                    }
                };

                /**
                * Determines whether a URL or innerHTML is being used,
                * creates the bindable template, and stores the template
                * in a template cache for later use.
                */
                Template.prototype._initializeTemplate = function () {
                    var id = this._id, $document = acquire('$document');

                    if (isNull(id)) {
                        return;
                    }

                    var parentNode = this.endNode.parentNode, url = this._url, template;

                    if (!isNull(url)) {
                        template = this.$templateCache.read(url) || TemplateControl.determineTemplate(this, url);

                        //determineTemplate sets the templateUrl so we need to reset it back to null
                        this.templateUrl = null;
                        this.dom.clearNodeBlock(this.elementNodes, parentNode);
                    } else {
                        template = $document.createDocumentFragment();
                        this.dom.appendChildren(this.elementNodes, template);
                    }

                    var controlPromise;
                    if (isFunction(template.then)) {
                        controlPromise = template.then(function templateSuccess(template) {
                            var bindableTemplates = this.bindableTemplates;
                            bindableTemplates.add(id, template.cloneNode(true));
                            return this;
                        });
                    } else {
                        this.bindableTemplates.add(id, template.cloneNode(true));

                        controlPromise = this.$PromiseStatic.resolve(this);
                    }

                    this.__templateControlCache.put(id, controlPromise);
                };

                /**
                * Waits for the template promise to resolve, then initializes
                * the binding of the bindable template and places it into the
                * DOM.
                *
                * @param templatePromise The promise associated with the first
                * instance of the template with this ID.
                */
                Template.prototype._waitForTemplateControl = function (templatePromise) {
                    var _this = this;
                    templatePromise.then(function (templateControl) {
                        if (!(isNull(_this._url) || (_this._url === templateControl._url))) {
                            _this.$ExceptionStatic.warn('The specified url: ' + _this._url + ' does not match the original plat-template with id: ' + '"' + _this._id + '". The original url will be loaded.', _this.$ExceptionStatic.TEMPLATE);
                        }

                        var endNode = _this.endNode;
                        templateControl._instantiateTemplate(_this).then(function (clone) {
                            _this.dom.insertBefore(endNode.parentNode, clone.childNodes, endNode);
                        });
                    }).catch(function (error) {
                        postpone(function () {
                            _this.$ExceptionStatic.warn('Problem resolving plat-template url: ' + error.response, _this.$ExceptionStatic.TEMPLATE);
                        });
                    });
                };

                /**
                * Binds the template to the proper context and
                * resolves the clone to be placed into the DOM.
                *
                * @param control The control whose context will
                * be bound to the bindable template.
                */
                Template.prototype._instantiateTemplate = function (control) {
                    var _this = this;
                    var bindableTemplates = this.bindableTemplates, id = this._id;

                    bindableTemplates.control = control;
                    return new this.$PromiseStatic(function (resolve, reject) {
                        bindableTemplates.bind(id, function (clone) {
                            bindableTemplates.control = _this;
                            resolve(clone);
                        });
                    });
                };
                return Template;
            })(TemplateControl);
            _controls.Template = Template;

            

            register.control('plat-template', Template);

            var Ignore = (function (_super) {
                __extends(Ignore, _super);
                function Ignore() {
                    _super.apply(this, arguments);
                }
                /**
                * Removes the innerHTML from the DOM and saves it.
                */
                Ignore.prototype.setTemplate = function () {
                    this.innerTemplate = this.dom.appendChildren(this.element.childNodes);
                };

                /**
                * Places the saved innerHTML back into the DOM.
                */
                Ignore.prototype.loaded = function () {
                    this.element.appendChild(this.innerTemplate.cloneNode(true));
                };
                return Ignore;
            })(TemplateControl);
            _controls.Ignore = Ignore;

            register.control('plat-ignore', Ignore);

            var ForEach = (function (_super) {
                __extends(ForEach, _super);
                function ForEach() {
                    _super.apply(this, arguments);
                    /**
                    * The ForEach element will not appear in the DOM.
                    */
                    this.replaceWith = null;
                    this.__clearTimeouts = [];
                }
                /**
                * Creates a bindable template with the elementNodes (innerHTML)
                * specified for the ForEach.
                */
                ForEach.prototype.setTemplate = function () {
                    this.bindableTemplates.add('item', this.elementNodes);
                };

                /**
                * Re-syncs the ForEach children controls and DOM with the new
                * array.
                *
                * @param newValue The new Array
                * @param oldValue The old Array
                */
                ForEach.prototype.contextChanged = function (newValue, oldValue) {
                    if (isNull(this.__removeListener)) {
                        this._setListener();
                    }

                    if (!isArray(newValue)) {
                        return;
                    }

                    if (newValue.length === 0) {
                        this._removeItems(this.controls.length);
                        return;
                    }

                    this._executeEventAsync({
                        method: 'splice',
                        arguments: null,
                        returnValue: null,
                        oldArray: oldValue || [],
                        newArray: newValue || []
                    });
                };

                /**
                * Observes the array for changes and adds initial items to the DOM.
                */
                ForEach.prototype.loaded = function () {
                    var context = this.context;

                    if (!isArray(context)) {
                        return;
                    }

                    this._addItems(context.length, 0);

                    this._setListener();
                };

                /**
                * Removes the Array listener
                */
                ForEach.prototype.dispose = function () {
                    if (isFunction(this.__removeListener)) {
                        this.__removeListener();
                        this.__removeListener = null;
                    }

                    var clearTimeouts = this.__clearTimeouts;

                    while (clearTimeouts.length > 0) {
                        clearTimeouts.shift()();
                    }
                };

                /**
                * Adds an item to the ForEach's element.
                */
                ForEach.prototype._addItem = function (item) {
                    var endNode = this.endNode;
                    endNode.parentNode.insertBefore(item, endNode);
                };

                /**
                * Removes an item from the ForEach's element.
                */
                ForEach.prototype._removeItem = function () {
                    var controls = this.controls, length = controls.length - 1;

                    TemplateControl.dispose(controls[length]);
                };

                /**
                * Updates the ForEach's children resource objects when
                * the array changes.
                */
                ForEach.prototype._updateResources = function () {
                    var controls = this.controls, length = controls.length;

                    for (var i = 0; i < length; ++i) {
                        controls[i].resources.add(this._getAliases(i));
                    }
                };

                /**
                * Sets a listener for the changes to the array.
                */
                ForEach.prototype._setListener = function () {
                    this.__removeListener = this.observeArray(this, 'context', this._arrayChanged);
                };

                /**
                * Receives an event when a method has been called on an array.
                *
                * @param ev The IArrayMethodInfo
                */
                ForEach.prototype._arrayChanged = function (ev) {
                    if (isFunction(this['_' + ev.method])) {
                        this._executeEventAsync(ev);
                    }
                };

                /**
                * Maps an array method to its associated method handler.
                *
                * @param ev The IArrayMethodInfo
                */
                ForEach.prototype._executeEventAsync = function (ev) {
                    var _this = this;
                    this.__clearTimeouts.push(postpone(function () {
                        _this.__clearTimeouts.shift();
                        _this['_' + ev.method](ev);
                    }, null));
                };

                /**
                * Adds new items to the ForEach's element when items are added to
                * the array.
                *
                * @param numberOfItems The number of items to add.
                * @param index The point in the array to start adding items.
                */
                ForEach.prototype._addItems = function (numberOfItems, index) {
                    var bindableTemplates = this.bindableTemplates;

                    for (var i = 0; i < numberOfItems; ++i, ++index) {
                        bindableTemplates.bind('item', this._addItem, '' + index, this._getAliases(index));
                    }
                };

                /**
                * Returns a resource alias object for an item in the array. The
                * resource object contains index:number, even:boolean, odd:boolean,
                * and first:boolean.
                *
                * @param index The index used to create the resource aliases.
                */
                ForEach.prototype._getAliases = function (index) {
                    var isEven = (index & 1) === 0;
                    return {
                        index: {
                            value: index,
                            type: 'observable'
                        },
                        even: {
                            value: isEven,
                            type: 'observable'
                        },
                        odd: {
                            value: !isEven,
                            type: 'observable'
                        },
                        first: {
                            value: index === 0,
                            type: 'observable'
                        }
                    };
                };

                /**
                * Removes items from the ForEach's element.
                *
                * @param numberOfItems The number of items to remove.
                */
                ForEach.prototype._removeItems = function (numberOfItems) {
                    for (var i = 0; i < numberOfItems; ++i) {
                        this._removeItem();
                    }

                    if (this.controls.length > 0) {
                        this._updateResources();
                    }
                };

                /**
                * Handles items being pushed into the array.
                *
                * @param ev The IArrayMethodInfo
                */
                ForEach.prototype._push = function (ev) {
                    this._addItems(ev.arguments.length, ev.oldArray.length);
                };

                /**
                * Handles items being popped off the array.
                *
                * @param ev The IArrayMethodInfo
                */
                ForEach.prototype._pop = function (ev) {
                    this._removeItems(1);
                };

                /**
                * Handles items being shifted off the array.
                *
                * @param ev The IArrayMethodInfo
                */
                ForEach.prototype._shift = function (ev) {
                    this._removeItems(1);
                };

                /**
                * Handles adding/removing items when an array is spliced.
                *
                * @param ev The IArrayMethodInfo
                */
                ForEach.prototype._splice = function (ev) {
                    var oldLength = this.controls.length, newLength = ev.newArray.length;

                    if (newLength > oldLength) {
                        this._addItems(newLength - oldLength, oldLength);
                    } else if (oldLength > newLength) {
                        this._removeItems(oldLength - newLength);
                    }
                };

                /**
                * Handles items being unshifted into the array.
                *
                * @param ev The IArrayMethodInfo
                */
                ForEach.prototype._unshift = function (ev) {
                    this._addItems(ev.arguments.length, ev.oldArray.length);
                };

                /**
                * Handles when the array is sorted.
                *
                * @param ev The IArrayMethodInfo
                */
                ForEach.prototype._sort = function (ev) {
                };

                /**
                * Handles when the array is reversed.
                *
                * @param ev The IArrayMethodInfo
                */
                ForEach.prototype._reverse = function (ev) {
                };
                return ForEach;
            })(TemplateControl);
            _controls.ForEach = ForEach;

            register.control('plat-foreach', ForEach);

            var Html = (function (_super) {
                __extends(Html, _super);
                function Html() {
                    _super.apply(this, arguments);
                }
                /**
                * Loads the new HTML String.
                */
                Html.prototype.contextChanged = function () {
                    this.loaded();
                };

                /**
                * Loads the context as the innerHTML of the element.
                */
                Html.prototype.loaded = function () {
                    var context = this.context;

                    if (!isString(context) || context.trim() === '') {
                        return;
                    }
                    this.dom.setInnerHtml(this.element, context);
                };
                return Html;
            })(TemplateControl);
            _controls.Html = Html;

            register.control('plat-html', Html);

            var Select = (function (_super) {
                __extends(Select, _super);
                function Select() {
                    _super.apply(this, arguments);
                    /**
                    * Replaces the <plat-select> node with
                    * a <select> node.
                    */
                    this.replaceWith = 'select';
                    /**
                    * An object that keeps track of unique
                    * optgroups.
                    */
                    this.groups = {};
                    this.$PromiseStatic = acquire('$PromiseStatic');
                    this.$Exception = acquire('$ExceptionStatic');
                    this.__isGrouped = false;
                }
                /**
                * Creates the bindable option template and grouping
                * template if necessary.
                */
                Select.prototype.setTemplate = function () {
                    var element = this.element, firstElementChild = element.firstElementChild, $document = acquire('$document');

                    if (!isNull(firstElementChild) && firstElementChild.nodeName.toLowerCase() === 'option') {
                        this.__defaultOption = firstElementChild.cloneNode(true);
                    }

                    var platOptions = this.options.value, option = $document.createElement('option');

                    if (this.__isGrouped = !isNull(platOptions.group)) {
                        var group = this.__group = platOptions.group, optionGroup = $document.createElement('optgroup');

                        optionGroup.label = '{{' + group + '}}';

                        this.bindableTemplates.add('group', optionGroup);
                    }

                    option.value = '{{' + platOptions.value + '}}';
                    option.textContent = '{{' + platOptions.textContent + '}}';

                    this.bindableTemplates.add('option', option);
                };

                /**
                * Re-observes the new array context and modifies
                * the options accordingly.
                *
                * @param newValue The new array context.
                * @param oldValue The old array context.
                */
                Select.prototype.contextChanged = function (newValue, oldValue) {
                    var newLength = isNull(newValue) ? 0 : newValue.length, oldLength = isNull(oldValue) ? 0 : oldValue.length;

                    if (isNull(this.__removeListener)) {
                        this.__removeListener = this.observeArray(this, 'context', function watchArray(ev) {
                            if (isFunction(this['_' + ev.method])) {
                                this['_' + ev.method](ev);
                            }
                        });
                    }

                    if (newLength > oldLength) {
                        this._addItems(newLength - oldLength, oldLength);
                    } else if (newLength < oldLength) {
                        this._removeItems(oldLength - newLength);
                    }
                };

                /**
                * Observes the new array context and adds
                * the options accordingly.
                */
                Select.prototype.loaded = function () {
                    var context = this.context;

                    if (isNull(context)) {
                        return;
                    }

                    this._addItems(context.length, 0);

                    this.__removeListener = this.observeArray(this, 'context', function watchArray(ev) {
                        if (isFunction(this['_' + ev.method])) {
                            this['_' + ev.method](ev);
                        }
                    });
                };

                /**
                * Stops observing the array context.
                */
                Select.prototype.dispose = function () {
                    if (isFunction(this.__removeListener)) {
                        this.__removeListener();
                        this.__removeListener = null;
                    }
                };

                /**
                * Adds the options to the select element.
                *
                * @param numberOfItems The number of items
                * to add.
                * @param length The current index of the next
                * set of items to add.
                */
                Select.prototype._addItems = function (numberOfItems, length) {
                    var index = length, item;

                    for (var i = 0; i < numberOfItems; ++i, ++index) {
                        item = this.context[index];

                        this.bindableTemplates.bind('option', this._insertOptions.bind(this, index, item), '' + index);
                    }
                };

                /**
                * The callback used to add an option after
                * its template has been bound.
                *
                * @param index The current index of the item being added.
                * @param item The item being added.
                * @param optionClone The bound DocumentFragment to be
                * inserted into the DOM.
                */
                Select.prototype._insertOptions = function (index, item, optionClone) {
                    var _this = this;
                    var element = this.element;

                    if (this.__isGrouped) {
                        var groups = this.groups, newGroup = item[this.__group], optgroup = groups[newGroup];

                        if (isNull(optgroup)) {
                            optgroup = groups[newGroup] = new this.$PromiseStatic(function (resolve) {
                                _this.bindableTemplates.bind('group', function (groupClone) {
                                    optgroup = groups[newGroup] = groupClone.childNodes[1];

                                    optgroup.appendChild(optionClone);
                                    element.appendChild(groupClone);
                                    resolve(optgroup);
                                }, '' + index);
                            }).catch(function (error) {
                                postpone(function () {
                                    _this.$Exception.warn(error.message);
                                });
                            });
                            return;
                        } else if (isFunction(optgroup.then)) {
                            optgroup.then(function (group) {
                                group.appendChild(optionClone);
                                return group;
                            });
                            return;
                        }

                        optgroup.appendChild(optionClone);
                        return;
                    }

                    element.appendChild(optionClone);
                };

                /**
                * Removes an item from the DOM.
                *
                * @param parent The element whose child
                * will be removed.
                */
                Select.prototype._removeItem = function (parent) {
                    parent.removeChild(parent.lastElementChild);
                };

                /**
                * Removes a specified number of elements.
                *
                * @param numberOfItems The number of items
                * to remove.
                */
                Select.prototype._removeItems = function (numberOfItems) {
                    var element = this.element, removeItem = this._removeItem;
                    while (numberOfItems-- > 0) {
                        removeItem(element);
                    }
                };

                /**
                * The function called when an item has been removed
                * from the array context.
                *
                * @param ev The array mutation object
                */
                Select.prototype._itemRemoved = function (ev) {
                    if (ev.oldArray.length === 0) {
                        return;
                    }

                    if (this.__isGrouped) {
                        var removed = ev.returnValue, group = removed[this.__group], optgroup = this.groups[group];

                        this._removeItem(optgroup);

                        return;
                    }

                    this._removeItems(1);
                };

                /**
                * Resets the select element by removing all its
                * items and adding them back.
                */
                Select.prototype._resetSelect = function () {
                    var itemLength = this.context.length, nodeLength = this.element.childNodes.length;

                    this._removeItems(nodeLength);
                    this.groups = {};
                    if (!isNull(this.__defaultOption)) {
                        this.element.appendChild(this.__defaultOption);
                    }

                    this._addItems(itemLength, 0);
                };

                /**
                * The function called when an element is pushed to
                * the array context.
                *
                * @param ev The array mutation object
                */
                Select.prototype._push = function (ev) {
                    this._addItems(ev.arguments.length, ev.oldArray.length);
                };

                /**
                * The function called when an item is popped
                * from the array context.
                *
                * @param ev The array mutation object
                */
                Select.prototype._pop = function (ev) {
                    this._itemRemoved(ev);
                };

                /**
                * The function called when an item is shifted
                * from the array context.
                *
                * @param ev The array mutation object
                */
                Select.prototype._shift = function (ev) {
                    if (this.__isGrouped) {
                        this._resetSelect();
                        return;
                    }

                    this._itemRemoved(ev);
                };

                /**
                * The function called when items are spliced
                * from the array context.
                *
                * @param ev The array mutation object
                */
                Select.prototype._splice = function (ev) {
                    if (this.__isGrouped) {
                        this._resetSelect();
                        return;
                    }

                    var oldLength = ev.oldArray.length, newLength = ev.newArray.length;

                    if (newLength > oldLength) {
                        this._addItems(newLength - oldLength, oldLength);
                    } else if (oldLength > newLength) {
                        this._removeItems(oldLength - newLength);
                    }
                };

                /**
                * The function called when an item is unshifted
                * onto the array context.
                *
                * @param ev The array mutation object
                */
                Select.prototype._unshift = function (ev) {
                    if (this.__isGrouped) {
                        this._resetSelect();
                        return;
                    }

                    this._addItems(ev.arguments.length, ev.oldArray.length);
                };

                /**
                * The function called when the array context
                * is sorted.
                *
                * @param ev The array mutation object
                */
                Select.prototype._sort = function (ev) {
                    if (this.__isGrouped) {
                        this._resetSelect();
                    }
                };

                /**
                * The function called when the array context
                * is reversed.
                *
                * @param ev The array mutation object
                */
                Select.prototype._reverse = function (ev) {
                    if (this.__isGrouped) {
                        this._resetSelect();
                    }
                };
                return Select;
            })(TemplateControl);
            _controls.Select = Select;

            

            register.control('plat-select', Select);

            var If = (function (_super) {
                __extends(If, _super);
                function If() {
                    _super.apply(this, arguments);
                    /**
                    * Removes the <plat-if> node from the DOM
                    */
                    this.replaceWith = null;
                    this.$ExceptionStatic = acquire('$ExceptionStatic');
                }
                /**
                * Creates a bindable template with its element nodes.
                */
                If.prototype.setTemplate = function () {
                    this.bindableTemplates.add('item', this.elementNodes);
                };

                /**
                * Checks the options and initializes the
                * evaluation.
                */
                If.prototype.contextChanged = function () {
                    var options = this.options.value;

                    if (isEmpty(options)) {
                        return;
                    }

                    this.setter(options);
                };

                /**
                * Sets the visibility to true if no options are
                * defined, kicks off the evaluation, and observes
                * the options for changes.
                */
                If.prototype.loaded = function () {
                    if (isNull(this.options)) {
                        this.$ExceptionStatic.warn('No condition specified in plat-options for plat-if.');
                        this.options = {
                            value: {
                                condition: true
                            },
                            observe: noop
                        };
                    }
                    this.contextChanged();
                    this.__removeListener = this.options.observe(this.setter);
                };

                /**
                * Stops listening to the options for changes.
                */
                If.prototype.dispose = function () {
                    if (isFunction(this.__removeListener)) {
                        this.__removeListener();
                        this.__removeListener = null;
                    }
                };

                /**
                * Checks the condition and decides
                * whether or not to add or remove
                * the node from the DOM.
                */
                If.prototype.setter = function (options) {
                    var value = options.condition;

                    if (value === this.__condition) {
                        return;
                    }

                    if (!value) {
                        this._removeItem();
                    } else {
                        this.bindableTemplates.bind('item', this._addItem);
                    }

                    this.__condition = value;
                };

                /**
                * The callback used to add the fragment to the DOM
                * after the bindableTemplate has been created.
                *
                * @param item The DocumentFragment consisting of
                * the inner template of the node.
                */
                If.prototype._addItem = function (item) {
                    var endNode = this.endNode;
                    endNode.parentNode.insertBefore(item, endNode);
                };

                /**
                * Removes the node from the DOM.
                */
                If.prototype._removeItem = function () {
                    postpone(function () {
                        Control.dispose(this.controls[0]);
                    }, null, this);
                };
                return If;
            })(TemplateControl);
            _controls.If = If;

            

            register.control('plat-if', If);

            var Anchor = (function (_super) {
                __extends(Anchor, _super);
                function Anchor() {
                    _super.apply(this, arguments);
                    this.$browserConfig = acquire('$browser.config');
                    this.$browser = acquire('$browser');
                }
                Anchor.prototype.initialize = function () {
                    var config = this.$browserConfig;

                    if (config.routingType !== config.routeType.HASH) {
                        return;
                    }

                    var prefix = config.hashPrefix || '', element = this.element, href = element.href, regex = new RegExp('#' + prefix), path = element.pathname;

                    if (this.$browser.isCrossDomain(href) || regex.test(href)) {
                        return;
                    }

                    if (isEmpty(path)) {
                        path = '/';
                    }

                    var utils = this.$browser.urlUtils(href || path);
                    path = utils.pathname;

                    var index = href.indexOf(path);

                    if (index === -1) {
                        if (!isEmpty(href)) {
                            return;
                        }
                        index = 0;
                    }

                    var start = href.substr(0, index), end = '#' + prefix + (path || '/');

                    if (!isEmpty(start) && start[start.length - 1] !== '/') {
                        end = '/' + end;
                    }

                    element.href = start + end;
                };
                return Anchor;
            })(TemplateControl);

            register.control('a', Anchor);
        })(ui.controls || (ui.controls = {}));
        var controls = ui.controls;
    })(plat.ui || (plat.ui = {}));
    var ui = plat.ui;
    (function (processing) {
        /**
        * Responsible for iterating through DOM and collecting controls.
        */
        var Compiler = (function () {
            function Compiler() {
                this.$ElementManagerStatic = acquire('$ElementManagerStatic');
                this.$TextManageStatic = acquire('$TextManageStatic');
                this.$commentManagerFactory = acquire('$commentManagerFactory');
                this.$ManagerCacheStatic = acquire('$ManagerCacheStatic');
            }
            Compiler.prototype.compile = function (node, control) {
                var childNodes = node.childNodes, length, newLength, childNode, hasControl = !isNull(control), manager = (hasControl ? this.$ManagerCacheStatic.read(control.uid) : null), create = this.$ElementManagerStatic.create;

                if (!isUndefined(childNodes)) {
                    childNodes = Array.prototype.slice.call(childNodes);
                } else if (isFunction(node.push)) {
                    childNodes = node;
                } else {
                    childNodes = Array.prototype.slice.call(node);
                }

                if (isNull(manager)) {
                    length = childNodes.length;

                    for (var i = 0; i < length; ++i) {
                        childNode = childNodes[i];
                        if (childNode.nodeType === Node.ELEMENT_NODE) {
                            if (!isNull(create(childNode))) {
                                this.compile(childNode);
                            }
                        }

                        newLength = childNodes.length;
                        i += newLength - length;
                        length = newLength;
                    }
                } else {
                    this._compileNodes(childNodes, manager);
                }
            };

            Compiler.prototype._compileNodes = function (nodes, manager) {
                var length = nodes.length, node, newManager, newLength, create = this.$ElementManagerStatic.create, commentCreate = this.$commentManagerFactory.create, textCreate = this.$TextManageStatic.create;

                for (var i = 0; i < length; ++i) {
                    node = nodes[i];
                    switch (node.nodeType) {
                        case Node.ELEMENT_NODE:
                            newManager = create(node, manager);
                            if (!isNull(newManager)) {
                                this._compileNodes(Array.prototype.slice.call(node.childNodes), newManager);
                            }
                            break;
                        case Node.TEXT_NODE:
                            textCreate(node, manager);
                            break;
                        case Node.COMMENT_NODE:
                            commentCreate(node, manager);
                            break;
                    }
                    newLength = nodes.length;
                    i += newLength - length;
                    length = newLength;
                }
            };
            return Compiler;
        })();
        processing.Compiler = Compiler;

        

        register.injectable('$compiler', Compiler);

        /**
        * A NodeManager is responsible for data binding a data context to a Node.
        */
        var NodeManager = (function () {
            function NodeManager() {
                /**
                * Lets us know when an ElementManager is a cloned manager, or the compiled
                * manager from BindableTemplates. We do not want to bindAndLoad compiled
                * managers that are clones.
                */
                this.isClone = false;
            }
            /**
            * Given an IParsedExpression array, creates an array of unique identifers
            * to use with binding. This allows us to avoid creating multiple listeners
            * for the identifier and node.
            *
            * @static
            * @param expressions An IParsedExpression array to search for identifiers.
            * @return {Array<string>} An array of identifiers.
            */
            NodeManager.findUniqueIdentifiers = function (expressions) {
                var length = expressions.length, uniqueIdentifierObject = {}, uniqueIdentifiers = [], identifiers, identifier, j, jLength;

                if (length === 1) {
                    return expressions[0].identifiers.slice(0);
                }

                for (var i = 0; i < length; ++i) {
                    identifiers = expressions[i].identifiers;
                    jLength = identifiers.length;

                    for (j = 0; j < jLength; ++j) {
                        identifier = identifiers[j];
                        if (isNull(uniqueIdentifierObject[identifier])) {
                            uniqueIdentifierObject[identifier] = true;
                            uniqueIdentifiers.push(identifier);
                        }
                    }
                }

                return uniqueIdentifiers;
            };

            /**
            * Determines if a string has the markup notation.
            *
            * @param text The text string in which to search for markup.
            * @return {Boolean} Indicates whether or not there is markup.
            */
            NodeManager.hasMarkup = function (text) {
                return NodeManager.$regex.markupRegex.test(text);
            };

            /**
            * Given a string, finds markup in the string and creates an IParsedExpression array.
            *
            * @static
            * @param text The text string to parse.
            * @return {Array<IParsedExpression>}
            */
            NodeManager.findMarkup = function (text) {
                var start, end, regex = NodeManager.$regex, newLineRegex = regex.newLineRegex, text = text.replace(newLineRegex, ''), parsedExpressions = [], startSymbol = NodeManager.startSymbol, endSymbol = NodeManager.endSymbol, wrapExpression = NodeManager._wrapExpression, substring, expression, parser = NodeManager.$parser;

                while ((start = text.indexOf(startSymbol)) !== -1 && (end = text.indexOf(endSymbol)) !== -1) {
                    if (start !== 0) {
                        parsedExpressions.push(wrapExpression(text.substring(0, start)));
                    }

                    while (text[++end] === '}') {
                    }

                    substring = text.substring(start + 2, end - 2);

                    //check for one-time databinding
                    if (substring[0] === '=') {
                        substring = substring.substr(1).trim();
                        expression = parser.parse(substring);
                        expression = {
                            expression: expression.expression,
                            evaluate: expression.evaluate,
                            identifiers: [],
                            aliases: expression.aliases,
                            oneTime: true
                        };
                        parsedExpressions.push(expression);
                    } else {
                        parsedExpressions.push(parser.parse(substring.trim()));
                    }

                    text = text.substr(end);
                }

                if (start > -1 && end >= 0) {
                    parsedExpressions.push(wrapExpression(text.substring(end)));
                } else if (text !== '') {
                    parsedExpressions.push(wrapExpression(text));
                }

                return parsedExpressions;
            };

            /**
            * Takes in data context and an IParsedExpression array and outputs a string of the evaluated
            * expressions.
            *
            * @static
            * @param expressions The IParsedExpression array to evaluate.
            * @param control The IControl used to parse the expressions.
            * @return {string} The evaluated expressions.
            */
            NodeManager.build = function (expressions, control) {
                var text = '', length = expressions.length, resources = {}, expression, value, evaluateExpression = NodeManager.$TemplateControlStatic.evaluateExpression;

                for (var i = 0; i < length; ++i) {
                    expression = expressions[i];

                    value = evaluateExpression(expression, control, resources);

                    if (isObject(value)) {
                        try  {
                            text += JSON.stringify(value);
                        } catch (e) {
                            if (!isNull(e.description)) {
                                e.description = 'Cannot stringify object: ' + e.description;
                            }
                            e.message = 'Cannot stringify object: ' + e.message;
                            ;
                            NodeManager.$ExceptionStatic.warn(e, Exception.PARSE);
                        }
                    } else if (!isNull(value)) {
                        text += value;
                    }

                    if (expression.oneTime) {
                        expressions[i] = NodeManager._wrapExpression(value);
                    }
                }

                return text;
            };

            /**
            * Registers a listener to be notified of a change in any associated identifier.
            *
            * @static
            * @param identifiers An Array of identifiers to observe.
            * @param control The control associated to the identifiers.
            * @param listener The listener to call when any identifier property changes.
            */
            NodeManager.observeIdentifiers = function (identifiers, control, listener) {
                var length = identifiers.length, ContextManager = NodeManager.$ContextManagerStatic, contextManager = ContextManager.getManager(Control.getRootControl(control)), absoluteContextPath = control.absoluteContextPath, context = control.context, observableCallback = {
                    listener: listener,
                    uid: control.uid
                }, resources = {}, resourceObj, manager, split, alias, absoluteIdentifier, identifier;

                for (var i = 0; i < length; ++i) {
                    identifier = identifiers[i];
                    absoluteIdentifier = '';

                    if (identifier[0] === '@') {
                        // We found an alias
                        split = identifier.split('.');
                        alias = split.shift().substr(1);

                        if (split.length > 0) {
                            absoluteIdentifier = '.' + split.join('.');
                        }

                        resourceObj = resources[alias];

                        if (isNull(resourceObj)) {
                            resourceObj = resources[alias] = control.findResource(alias);
                        }

                        if (!isNull(resourceObj) && !isNull(resourceObj.resource) && resourceObj.resource.type === 'observable') {
                            manager = ContextManager.getManager(resources[alias].control);
                            absoluteIdentifier = 'resources.' + alias + '.value' + absoluteIdentifier;
                        } else {
                            continue;
                        }
                    } else {
                        // Look on the control.context
                        split = identifier.split('.');

                        if (!isNull(ContextManager.getContext(context, split))) {
                            manager = contextManager;
                            absoluteIdentifier = absoluteContextPath + '.' + identifier;
                        } else if (!isNull(ContextManager.getContext(control, split))) {
                            manager = null;
                        } else {
                            manager = contextManager;
                            absoluteIdentifier = absoluteContextPath + '.' + identifier;
                        }
                    }

                    if (!isNull(manager)) {
                        manager.observe(absoluteIdentifier, observableCallback);
                    }
                }
            };

            NodeManager._wrapExpression = function (text) {
                return {
                    evaluate: function unboundText() {
                        return text;
                    },
                    identifiers: [],
                    aliases: [],
                    expression: text
                };
            };

            /**
            * @param nodeMap The INodeMap associated with this TextManager. We have to use an
            * INodeMap instead of an INode so we can treat all INodeManagers the same.
            * @param parent The parent ui.ITemplateControl for a TextManager.
            */
            NodeManager.prototype.initialize = function (nodeMap, parent) {
                this.nodeMap = nodeMap;
                this.parent = parent;

                if (!isNull(parent)) {
                    this.isClone = parent.isClone;
                    parent.children.push(this);
                }
            };

            /**
            * Retrieves the parent control for this NodeManager.
            */
            NodeManager.prototype.getParentControl = function () {
                var parent = this.parent, control;

                while (isNull(control)) {
                    if (isNull(parent)) {
                        break;
                    }

                    control = parent.getUiControl();
                    parent = parent.parent;
                }

                return control;
            };

            /**
            * Clones this NodeManager with the new node.
            *
            * @param newNode The node used to clone this NodeManager.
            * @param parentManager The parent NodeManager for the clone.
            */
            NodeManager.prototype.clone = function (newNode, parentManager) {
                return 1;
            };

            /**
            * The function used for data-binding a data context to the DOM.
            *
            * @param parent The parent ui.ITemplateControl to use for context inheritance.
            * @param nodeMap The INodeMap to use in order to data-bind the data context.
            * @param controlsToLoad An optional array to populate with controls that need to be loaded.
            */
            NodeManager.prototype.bind = function () {
            };
            NodeManager.startSymbol = '{{';

            NodeManager.endSymbol = '}}';
            return NodeManager;
        })();
        processing.NodeManager = NodeManager;

        function NodeManagerStatic($regex, $ContextManagerStatic, $parser, $ExceptionStatic, $TemplateControlStatic) {
            NodeManager.$regex = $regex;
            NodeManager.$ContextManagerStatic = $ContextManagerStatic;
            NodeManager.$parser = $parser;
            NodeManager.$ExceptionStatic = $ExceptionStatic;
            NodeManager.$TemplateControlStatic = $TemplateControlStatic;
            return NodeManager;
        }
        processing.NodeManagerStatic = NodeManagerStatic;

        register.injectable('$NodeManagerStatic', NodeManagerStatic, [
            '$regex',
            '$ContextManagerStatic',
            '$parser',
            '$ExceptionStatic',
            '$TemplateControlStatic'
        ], register.injectableType.STATIC);

        

        

        

        

        /**
        * A class used to manage element nodes. Provides a way for compiling and binding the
        * element/template. Also provides methods for cloning an ElementManager.
        */
        var ElementManager = (function (_super) {
            __extends(ElementManager, _super);
            function ElementManager() {
                _super.apply(this, arguments);
                /**
                * The child managers for this manager.
                */
                this.children = [];
                /**
                * The type of INodeManager.
                */
                this.type = 'element';
                /**
                * Specifies whether or not this manager has a uiControl which has
                * replaceWith set to null or empty string.
                */
                this.replace = false;
                /**
                * Indicates whether the control for this manager hasOwnContext.
                */
                this.hasOwnContext = false;
                this.$ElementManagerStatic = acquire('$ElementManagerStatic');
                this.$PromiseStatic = acquire('$PromiseStatic');
                this.$compiler = acquire('$compiler');
                this.$NodeManagerStatic = acquire('$NodeManagerStatic');
                this.$ContextManagerStatic = acquire('$ContextManagerStatic');
                this.$commentManagerFactory = acquire('$commentManagerFactory');
                this.$ExceptionStatic = acquire('$ExceptionStatic');
                this.$ControlStatic = acquire('$ControlStatic');
                this.$TemplateControlStatic = acquire('$TemplateControlStatic');
            }
            /**
            * Determines if the associated HTMLElement has controls that need to be instantiated or Attr nodes
            * containing text markup. If controls exist or markup is found a new ElementManager will be created,
            * else an empty INodeManager will be added to the Array of INodeManagers.
            *
            * @static
            * @param element The HTMLElement to use to identifier markup and controls.
            * @param parent The parent ui.ITemplateControl used for context inheritance.
            * @param managers An INodeManager array used to link the compiled DOM to context.
            * @return {ElementManager} The newly created ElementManager.
            */
            ElementManager.create = function (element, parent) {
                var name = element.nodeName.toLowerCase(), injector = controlInjectors[name] || viewControlInjectors[name], hasUiControl = false, uiControlNode, dom = ElementManager.$dom, $document = ElementManager.$document;

                if (!isNull(injector)) {
                    var uiControl = injector.inject(), resourceElement = element.firstElementChild;

                    if (!isNull(resourceElement) && resourceElement.nodeName.toLowerCase() === 'plat-resources') {
                        resourceElement = element.removeChild(resourceElement);
                    } else {
                        resourceElement = null;
                    }

                    uiControlNode = {
                        control: uiControl,
                        resourceElement: resourceElement,
                        nodeName: name,
                        expressions: [],
                        injector: injector
                    };

                    hasUiControl = true;

                    var replacementType = uiControl.replaceWith;
                    if (!isEmpty(replacementType)) {
                        var replacement = $document.createElement(replacementType);
                        if (replacement.nodeType === Node.ELEMENT_NODE) {
                            element = dom.replaceWith(element, replacement.cloneNode(true));
                        }
                    }
                }

                var attributes = element.attributes, elementMap = ElementManager._collectAttributes(attributes);

                elementMap.element = element;
                elementMap.uiControlNode = uiControlNode;

                var manager = new ElementManager();

                manager.initialize(elementMap, parent);

                if (!(elementMap.hasControl || hasUiControl)) {
                    manager.bind = noop;
                } else {
                    manager.setUiControlTemplate();
                    return hasUiControl ? null : manager;
                }

                return manager;
            };

            /**
            * Clones an ElementManager with a new element.
            *
            * @param sourceManager The original IElementManager.
            * @param parent The parent IElementManager for the new clone.
            * @param element The new element to associate with the clone.
            * @param newControl An optional control to associate with the clone.
            * @return {ElemenetManager} The cloned ElementManager.
            */
            ElementManager.clone = function (sourceManager, parent, element, newControl, nodeMap) {
                if (isNull(nodeMap)) {
                    nodeMap = ElementManager._cloneNodeMap(sourceManager.nodeMap, element, parent.getUiControl() || parent.getParentControl(), newControl);
                }

                var manager = new ElementManager(), cache = ElementManager.$ManagerCacheStatic;

                manager.nodeMap = nodeMap;
                manager.parent = parent;

                if (!isNull(parent)) {
                    parent.children.push(manager);
                }

                manager.replace = sourceManager.replace;
                manager.replaceNodeLength = sourceManager.replaceNodeLength;
                manager.hasOwnContext = sourceManager.hasOwnContext;
                manager.isClone = true;

                if (!nodeMap.hasControl && isNull(newControl)) {
                    manager.bind = noop;
                }

                if (!isNull(newControl)) {
                    cache.put(newControl.uid, manager);
                }

                return manager;
            };

            /**
            * Clones a UI Control with a new nodeMap.
            *
            * @param sourceMap The source INodeMap used to clone the UI Control
            * @param parent The parent control of the clone.
            * @return {ui.ITemplateControl} The cloned UI control.
            */
            ElementManager.cloneUiControl = function (sourceMap, parent) {
                var uiControlNode = sourceMap.uiControlNode;

                if (isNull(uiControlNode)) {
                    return;
                }

                var uiControl = uiControlNode.control, newUiControl = uiControlNode.injector.inject(), Resources = ElementManager.$ResourcesStatic, BindableTemplates = ElementManager.$BindableTemplatesStatic, resources = ElementManager.$ResourcesStatic.getInstance(), attributes = acquire('$attributes');

                newUiControl.parent = parent;
                parent.controls.push(newUiControl);
                newUiControl.controls = [];

                attributes.initialize(newUiControl, sourceMap.attributes);
                newUiControl.attributes = attributes;

                resources.initialize(newUiControl, uiControl.resources);
                newUiControl.resources = resources;

                Resources.addControlResources(newUiControl);

                if (!isNull(uiControl.innerTemplate)) {
                    newUiControl.innerTemplate = uiControl.innerTemplate.cloneNode(true);
                }

                newUiControl.type = uiControl.type;
                newUiControl.bindableTemplates = BindableTemplates.create(newUiControl, uiControl.bindableTemplates);
                newUiControl.replaceWith = uiControl.replaceWith;

                return newUiControl;
            };

            /**
            * Creates new nodes for an INodeMap corresponding to the element associated with the nodeMap or
            * the passed-in element.
            *
            * @param nodeMap The nodeMap to populate with attribute nodes.
            * @param parent The parent control for the new attribute controls.
            * @param newElement An optional element to use for attributes (used in cloning).
            * @return {Array<INode>} The new nodes.
            */
            ElementManager.createAttributeControls = function (nodeMap, parent, templateControl, newElement, isClone) {
                var nodes = nodeMap.nodes, length = nodes.length, element = isClone ? newElement : nodeMap.element;

                if (!isNull(element) && element.nodeType === Node.DOCUMENT_FRAGMENT_NODE) {
                    return isClone ? ElementManager._copyAttributeNodes(nodes) : [];
                }

                var attributes = !isNull(element) ? element.attributes : null, attrs = nodeMap.attributes, newAttributes, node, injector, control, newNodes = [], nodeName, i;

                for (i = 0; i < length; ++i) {
                    node = nodes[i];
                    injector = node.injector;
                    control = null;

                    if (!isNull(injector)) {
                        control = injector.inject();
                        node.control = control;
                        control.parent = parent;
                        control.element = element;

                        newAttributes = acquire('$attributes');
                        newAttributes.initialize(control, attrs);
                        control.attributes = newAttributes;

                        control.type = node.nodeName;
                        control.uid = control.uid || uniqueId('plat_');
                        control.templateControl = templateControl;
                    }

                    if (isClone) {
                        nodeName = node.nodeName;
                        newNodes.push({
                            control: control,
                            expressions: node.expressions,
                            identifiers: node.identifiers,
                            node: !!attributes ? attributes.getNamedItem(nodeName) : null,
                            nodeName: nodeName,
                            injector: injector
                        });

                        if (!isNull(control)) {
                            if (!isNull(parent)) {
                                parent.controls.push(control);
                            }

                            if (isFunction(control.initialize)) {
                                control.initialize();
                            }
                        }
                    }
                }

                if (!isClone) {
                    nodes.sort(function (a, b) {
                        var aControl = a.control, bControl = b.control;

                        if (isNull(aControl)) {
                            return 1;
                        } else if (isNull(bControl)) {
                            return -1;
                        }

                        var aPriority = isNumber(aControl.priority) ? aControl.priority : 0, bPriority = isNumber(bControl.priority) ? bControl.priority : 0;

                        return bPriority - aPriority;
                    });

                    for (i = 0; i < length; ++i) {
                        node = nodes[i];
                        control = node.control;

                        if (!isNull(control)) {
                            if (!isNull(parent)) {
                                parent.controls.push(control);
                            }

                            if (isFunction(control.initialize)) {
                                control.initialize();
                            }
                        }
                    }
                }

                return newNodes;
            };

            /**
            * Returns an instance of an IElementManager
            */
            ElementManager.getInstance = function () {
                return new ElementManager();
            };

            /**
            * Iterates over the attributes NamedNodeMap, creating an INodeMap. The INodeMap
            * will contain injectors for all the IControls as well as parsed expressions
            * and identifiers found for each Attribute (useful for data binding).
            *
            * @static
            * @param attributes A NamedNodeMap to compile into an INodeMap
            * @return {INodeMap} The compiled NamedNodeMap
            */
            ElementManager._collectAttributes = function (attributes) {
                var nodes = [], attribute, name, value, childContext, childIdentifier, hasMarkup, hasMarkupFn = NodeManager.hasMarkup, findMarkup = NodeManager.findMarkup, findUniqueIdentifiers = NodeManager.findUniqueIdentifiers, parser = NodeManager.$parser, build = NodeManager.build, expressions, hasControl = false, injector, length = attributes.length, controlAttributes = {}, uniqueIdentifiers;

                for (var i = 0; i < length; ++i) {
                    attribute = attributes[i];
                    value = attribute.value;
                    name = attribute.name.replace(/data-/i, '').toLowerCase();
                    injector = controlInjectors[name] || viewControlInjectors[name];
                    expressions = [];
                    uniqueIdentifiers = [];

                    if (name === 'plat-context') {
                        childContext = parser.parse(value);
                        if (childContext.identifiers.length !== 1) {
                            var Exception = acquire('$ExceptionStatic');
                            Exception.warn('Incorrect plat-context: ' + value + ', must contain a single identifier.', Exception.COMPILE);
                        }
                        childIdentifier = childContext.identifiers[0];
                    } else {
                        hasMarkup = hasMarkupFn(value);

                        if (hasMarkup) {
                            expressions = findMarkup(value);
                            uniqueIdentifiers = findUniqueIdentifiers(expressions);
                            if (uniqueIdentifiers.length === 0) {
                                attribute.value = value = build(expressions);
                            }
                        }

                        if (!hasControl && (hasMarkup || !isNull(injector))) {
                            hasControl = true;
                        }

                        nodes.push({
                            control: null,
                            node: attribute,
                            nodeName: name,
                            expressions: expressions,
                            identifiers: uniqueIdentifiers,
                            injector: injector
                        });
                    }

                    controlAttributes[camelCase(name)] = value;
                }

                return {
                    element: null,
                    attributes: controlAttributes,
                    nodes: nodes,
                    childContext: childIdentifier,
                    hasControl: hasControl
                };
            };

            ElementManager._copyAttributeNodes = function (nodes) {
                var newNodes = [], length = nodes.length, node;

                for (var i = 0; i < length; ++i) {
                    node = nodes[i];
                    newNodes.push({
                        identifiers: node.identifiers,
                        expressions: node.expressions,
                        nodeName: node.nodeName
                    });
                }

                return newNodes;
            };

            /**
            * Clones an INode with a new node.
            *
            * @param sourceNode The original INode.
            * @param node The new node used for cloning.
            * @param newControl An optional new control to associate with the cloned node.
            * @return {INode} The clones INode.
            */
            ElementManager._cloneNode = function (sourceNode, node, newControl) {
                return {
                    control: newControl,
                    injector: sourceNode.injector,
                    identifiers: sourceNode.identifiers,
                    expressions: sourceNode.expressions,
                    node: node,
                    nodeName: sourceNode.nodeName
                };
            };

            /**
            * Clones an INodeMap with a new element.
            *
            * @param sourceMap The original INodeMap.
            * @param element The new HTMLElement used for cloning.
            * @param newControl An optional new control to associate with the element.
            * @return {INodeMap} The cloned INodeMap.
            */
            ElementManager._cloneNodeMap = function (sourceMap, element, parent, newControl) {
                var hasControl = sourceMap.hasControl, nodeMap = {
                    attributes: sourceMap.attributes,
                    childContext: sourceMap.childContext,
                    nodes: [],
                    element: element,
                    uiControlNode: !isNull(sourceMap.uiControlNode) ? ElementManager._cloneNode(sourceMap.uiControlNode, element, newControl) : null,
                    hasControl: hasControl
                };

                if (hasControl) {
                    nodeMap.nodes = ElementManager.createAttributeControls(sourceMap, parent, newControl, element, true);
                }
                return nodeMap;
            };

            /**
            * Clones this ElementManager with a new node.
            *
            * @param newNode The new element used to clone the ElementManager.
            * @param parentManager The parent for the clone.
            * @param newControl An optional new control to associate with the clone.
            */
            ElementManager.prototype.clone = function (newNode, parentManager, nodeMap) {
                var childNodes, clonedManager, replace = this.replace, nodeMapExists = !isNull(nodeMap), newControl = nodeMapExists ? nodeMap.uiControlNode.control : null, newControlExists = !isNull(newControl), startNodeManager, endNodeManager, parentControl = parentManager.getUiControl() || parentManager.getParentControl(), ElementManager = this.$ElementManagerStatic;

                if (!newControlExists) {
                    // create new control
                    newControl = ElementManager.cloneUiControl(this.nodeMap, parentControl);

                    newControlExists = !isNull(newControl);
                }

                if (replace) {
                    // definitely have newControl
                    var nodes = newNode.parentNode.childNodes, startIndex = Array.prototype.indexOf.call(nodes, newNode);

                    childNodes = Array.prototype.slice.call(nodes, startIndex + 1, startIndex + this.replaceNodeLength);
                    clonedManager = ElementManager.clone(this, parentManager, null, newControl, nodeMap);
                    newControl.elementNodes = childNodes;
                    newControl.startNode = newNode;
                    newControl.endNode = childNodes.pop();

                    startNodeManager = this.children.shift();
                    endNodeManager = this.children.shift();

                    startNodeManager.clone(newControl.startNode, clonedManager);
                    endNodeManager.clone(newControl.endNode, clonedManager);

                    if (isFunction(newControl.initialize)) {
                        newControl.initialize();
                    }
                } else {
                    childNodes = Array.prototype.slice.call(newNode.childNodes);
                    clonedManager = ElementManager.clone(this, parentManager, newNode, newControl, nodeMap);
                    nodeMap = clonedManager.nodeMap;

                    if (newControlExists) {
                        newControl.element = newNode;
                        if (isFunction(newControl.initialize)) {
                            newControl.initialize();
                        }
                    }
                }

                if (clonedManager.hasOwnContext) {
                    postpone(function observeRootContext() {
                        clonedManager.observeRootContext(newControl, clonedManager.bindAndLoad);
                    });
                }

                var children = this.children, length = children.length, childNodeOffset = 0;

                for (var i = 0; i < length; ++i) {
                    //clone children
                    childNodeOffset += children[i].clone(childNodes[childNodeOffset], clonedManager);
                }

                if (replace) {
                    this.children.unshift(endNodeManager);
                    this.children.unshift(startNodeManager);

                    return childNodeOffset + 2;
                }

                return 1;
            };

            /**
            * Initializes all the controls associated to the ElementManager's nodeMap.
            * The INodeManager array must be passed in because if this ElementManager is
            * used for transclusion, it can't rely on one INodeManager array.
            *
            * @param dontInitialize Specifies whether or not the initialize method should
            * be called for a control.
            */
            ElementManager.prototype.initialize = function (nodeMap, parent, dontInitialize) {
                _super.prototype.initialize.call(this, nodeMap, parent);

                var parentControl = this.getParentControl(), controlNode = nodeMap.uiControlNode, control, hasAttributeControl = nodeMap.hasControl, hasUiControl = !isNull(controlNode), replaceElement = false;

                if (hasUiControl) {
                    this._populateUiControl();
                    control = controlNode.control;
                    this.hasOwnContext = control.hasOwnContext;
                }

                if (hasAttributeControl) {
                    this.$ElementManagerStatic.createAttributeControls(nodeMap, parentControl, control);
                }

                if (!dontInitialize && hasUiControl && isFunction(control.initialize)) {
                    control.initialize();
                }
            };

            /**
            * Links the data context to the DOM (data-binding).
            *
            * @param parent The parent of the UIControl and Attribute controls.
            * @param nodeMap The INodeMap for the ElementManager to use to locate controls.
            * Separating the ElementManager from a INodeMap allows us to transclude templates
            */
            ElementManager.prototype.bind = function () {
                var _this = this;
                var nodeMap = this.nodeMap, parent = this.getParentControl(), controlNode = nodeMap.uiControlNode, uiControl, nodes = nodeMap.nodes, node, controls = [], control, attributes = nodeMap.attributes, hasParent = !isNull(parent), getManager = this.$ContextManagerStatic.getManager, contextManager, absoluteContextPath = hasParent ? parent.absoluteContextPath : 'context', hasUiControl = !isNull(controlNode), replace = this.replace;

                if (hasUiControl) {
                    uiControl = controlNode.control;
                    controls.push(uiControl);

                    var childContext = nodeMap.childContext;

                    if (!isNull(childContext)) {
                        if (childContext[0] === '@') {
                            var split = childContext.split('.'), alias = split.shift().substr(1), resourceObj = this.$TemplateControlStatic.findResource(uiControl, alias);

                            if (!isNull(resourceObj)) {
                                if (resourceObj.resource.type === 'observable') {
                                    var identifier = (split.length > 0) ? '.' + split.join('.') : '';
                                    absoluteContextPath = 'resources.' + alias + '.value' + identifier;
                                    contextManager = getManager(resourceObj.control);
                                    uiControl.root = resourceObj.control;
                                } else {
                                    this.$ExceptionStatic.warn('Only resources of type observable can be set as context.', this.$ExceptionStatic.CONTEXT);
                                }
                            }
                        } else {
                            absoluteContextPath = absoluteContextPath + '.' + childContext;
                        }
                    }

                    uiControl.root = this.$ControlStatic.getRootControl(uiControl) || uiControl;

                    contextManager = getManager(uiControl.root);

                    if (!uiControl.hasOwnContext) {
                        uiControl.context = contextManager.getContext(absoluteContextPath.split('.'));
                    } else {
                        absoluteContextPath = 'context';
                    }

                    this.$TemplateControlStatic.setAbsoluteContextPath(uiControl, absoluteContextPath);
                    this.$TemplateControlStatic.setContextResources(uiControl);
                    ElementManager.$ResourcesStatic.bindResources(uiControl.resources);

                    contextManager.observe(uiControl.absoluteContextPath, {
                        uid: uiControl.uid,
                        listener: function (newValue, oldValue) {
                            _this.$TemplateControlStatic.contextChanged(uiControl, newValue, oldValue);
                        }
                    });

                    if (!replace) {
                        var element = uiControl.element;
                        if (!isNull(element) && isFunction(element.removeAttribute)) {
                            element.removeAttribute('plat-hide');
                        }
                    }
                }

                this._observeControlIdentifiers(nodes, parent, controls);
                this._loadAttributeControls(controls, uiControl);
            };

            ElementManager.prototype._observeControlIdentifiers = function (nodes, parent, controls) {
                var length = nodes.length, bindings = [], attributeChanged = this._attributeChanged, hasParent = !isNull(parent), node, control;

                for (var i = 0; i < length; ++i) {
                    node = nodes[i];
                    control = node.control;

                    if (hasParent && node.identifiers.length > 0) {
                        NodeManager.observeIdentifiers(node.identifiers, parent, attributeChanged.bind(this, node, parent, controls));
                        bindings.push(node);
                    }

                    if (!isNull(control)) {
                        controls.push(control);
                    }
                }

                length = bindings.length;
                for (i = 0; i < length; ++i) {
                    this._attributeChanged(bindings[i], parent, controls);
                }
            };

            ElementManager.prototype._loadAttributeControls = function (controls, templateControl) {
                var length = controls.length, control, load = this.$ControlStatic.load;

                for (var i = !!templateControl ? 1 : 0; i < length; ++i) {
                    control = controls[i];
                    control.templateControl = templateControl;

                    load(control);
                }
            };

            /**
            * Sets the template for an ElementManager by calling its associated UI Control's
            * setTemplate method.
            *
            * @param templateUrl An optional templateUrl used to override the control's template.
            */
            ElementManager.prototype.setUiControlTemplate = function (templateUrl, isClone) {
                var _this = this;
                var nodeMap = this.nodeMap, controlNode = nodeMap.uiControlNode, control;

                if (!isNull(controlNode)) {
                    control = controlNode.control;

                    var template = this.$TemplateControlStatic.determineTemplate(control, templateUrl);

                    if (!isNull(template)) {
                        if (isFunction(template.then)) {
                            this.templatePromise = template.then(function (template) {
                                _this.templatePromise = null;
                                _this._initializeControl(control, template.cloneNode(true));
                            }).catch(function (error) {
                                postpone(function () {
                                    _this.$ExceptionStatic.fatal(error, _this.$ExceptionStatic.COMPILE);
                                });
                            });

                            return this.templatePromise;
                        }
                    }
                    this._initializeControl(control, template);
                    return;
                }

                if (!isNull(this.parent)) {
                    return;
                }

                this.bindAndLoad();
            };

            /**
            * Retrieves the UI control instance for this ElementManager.
            *
            * @return {ui.ITemplateControl} The control.
            */
            ElementManager.prototype.getUiControl = function () {
                var uiControlNode = this.nodeMap.uiControlNode;
                if (isNull(uiControlNode)) {
                    return;
                }

                return uiControlNode.control;
            };

            /**
            * Fullfills any template template promises and finishes the compile phase
            * for the template associated to this ElementManager.
            *
            * @return {async.IPromise} A promise, fulfilled when the template
            * is complete.
            */
            ElementManager.prototype.fulfillTemplate = function () {
                var _this = this;
                var children = this.children, child, length = children.length, promises = [];

                return new this.$PromiseStatic(function (resolve, reject) {
                    if (!isNull(_this.templatePromise)) {
                        promises.push(_this.templatePromise);
                    }

                    for (var i = 0; i < length; ++i) {
                        child = children[i];
                        if (!isUndefined(child.children)) {
                            promises.push(child.fulfillTemplate());
                        }
                    }

                    _this.$PromiseStatic.all(promises).then(resolve, reject);
                }).catch(function (error) {
                    postpone(function () {
                        _this.$ExceptionStatic.fatal(error, _this.$ExceptionStatic.COMPILE);
                    });
                });
            };

            /**
            * Binds context to the DOM and loads controls.
            */
            ElementManager.prototype.bindAndLoad = function () {
                var _this = this;
                var children = this.children, length = children.length, child, promises = [];

                this.bind();

                for (var i = 0; i < length; ++i) {
                    child = children[i];
                    if (child.hasOwnContext) {
                        promises.push(child.loadedPromise);
                        continue;
                    }

                    if (!isUndefined(child.children)) {
                        promises.push(child.bindAndLoad());
                    } else {
                        child.bind();
                    }
                }

                return this.$PromiseStatic.all(promises).then(function () {
                    _this.$ControlStatic.load(_this.getUiControl());
                }).catch(function (error) {
                    postpone(function () {
                        _this.$ExceptionStatic.fatal(error, _this.$ExceptionStatic.BIND);
                    });
                });
            };

            ElementManager.prototype.observeRootContext = function (root, loadMethod) {
                var _this = this;
                this.loadedPromise = new this.$PromiseStatic(function (resolve, reject) {
                    var contextManager = _this.$ContextManagerStatic.getManager(root);

                    var removeListener = contextManager.observe('context', {
                        listener: function () {
                            removeListener();

                            loadMethod.call(_this).then(resolve);
                        },
                        uid: root.uid
                    });

                    if (!isNull(root.context)) {
                        removeListener();
                        loadMethod.call(_this).then(resolve);
                    }
                }).catch(function (error) {
                    postpone(function () {
                        _this.$ExceptionStatic.fatal(error, _this.$ExceptionStatic.BIND);
                    });
                });
            };

            ElementManager.prototype._fulfillAndLoad = function () {
                var _this = this;
                return new this.$PromiseStatic(function (resolve, reject) {
                    _this.fulfillTemplate().then(function () {
                        return _this.bindAndLoad();
                    }).then(resolve);
                }).catch(function (error) {
                    postpone(function () {
                        _this.$ExceptionStatic.fatal(error, _this.$ExceptionStatic.BIND);
                    });
                });
            };
            ElementManager.prototype._populateUiControl = function () {
                var nodeMap = this.nodeMap, parent = this.getParentControl(), controlNode = nodeMap.uiControlNode, uiControl = controlNode.control, hasParent = !isNull(parent), element = nodeMap.element, attributes = nodeMap.attributes, newAttributes = acquire('$attributes');

                ElementManager.$ManagerCacheStatic.put(uiControl.uid, this);

                if (hasParent && uiControl.parent !== parent) {
                    parent.controls.push(uiControl);
                    uiControl.parent = parent;
                }
                if (isFunction(element.setAttribute)) {
                    element.setAttribute('plat-hide', '');
                }
                uiControl.element = element;
                uiControl.controls = [];

                newAttributes.initialize(uiControl, attributes);
                uiControl.attributes = newAttributes;

                if (!isNull(uiControl.resources)) {
                    uiControl.resources.add(controlNode.resourceElement);
                } else {
                    injectableInjectors;
                    var resources = ElementManager.$ResourcesStatic.getInstance();
                    resources.initialize(uiControl, controlNode.resourceElement);
                    uiControl.resources = resources;
                }

                ElementManager.$ResourcesStatic.addControlResources(uiControl);
                uiControl.type = controlNode.nodeName;
                uiControl.uid = uiControl.uid || uniqueId('plat_');
                uiControl.bindableTemplates = uiControl.bindableTemplates || ElementManager.$BindableTemplatesStatic.create(uiControl);

                if ((element.childNodes.length > 0) && (!isEmpty(uiControl.templateString) || !isEmpty(uiControl.templateUrl))) {
                    uiControl.innerTemplate = ElementManager.$dom.appendChildren(element.childNodes);
                }

                var replace = this.replace = (uiControl.replaceWith === null || uiControl.replaceWith === '');

                if (replace) {
                    this._replaceElement(uiControl, nodeMap);
                }
            };
            ElementManager.prototype._replaceElement = function (control, nodeMap) {
                var element = nodeMap.element, parentNode = element.parentNode, $document = ElementManager.$document, controlType = control.type, controlUid = control.uid, startNode = control.startNode = $document.createComment(controlType + ' ' + controlUid + ': start node'), endNode = control.endNode = $document.createComment(controlType + ' ' + controlUid + ': end node'), create = this.$commentManagerFactory.create;

                create(startNode, this);
                create(endNode, this);

                parentNode.insertBefore(startNode, element);
                parentNode.insertBefore(endNode, element.nextSibling);
                control.elementNodes = ElementManager.$dom.replace(element);

                control.element = nodeMap.element = null;
            };
            ElementManager.prototype._locateResources = function (node) {
                var childNodes = Array.prototype.slice.call(node.childNodes), length = childNodes.length, childNode;

                while (childNodes.length > 0) {
                    childNode = childNodes.shift();

                    if (childNode.nodeName.toLowerCase() === 'plat-resources') {
                        return node.removeChild(childNode);
                    }
                }
            };
            ElementManager.prototype._initializeControl = function (uiControl, template) {
                var element = this.nodeMap.element, replaceElement = this.replace, hasOwnContext = uiControl.hasOwnContext, hasParent = !isNull(uiControl.parent), endNode;

                if (!isNull(template)) {
                    var resourceElement = this._locateResources(template);

                    if (!isNull(resourceElement)) {
                        uiControl.resources.add(ElementManager.$ResourcesStatic.parseElement(resourceElement));
                    }

                    if (replaceElement) {
                        endNode = uiControl.endNode;
                        uiControl.elementNodes = Array.prototype.slice.call(template.childNodes);
                        endNode.parentNode.insertBefore(template, endNode);
                    } else {
                        element.insertBefore(template, element.lastChild);
                    }
                }

                if (isFunction(uiControl.setTemplate)) {
                    uiControl.setTemplate();
                }

                if (replaceElement) {
                    this.$compiler.compile(uiControl.elementNodes, uiControl);
                    var startNode = uiControl.startNode, parentNode = startNode.parentNode, childNodes = Array.prototype.slice.call(parentNode.childNodes);

                    endNode = uiControl.endNode;

                    uiControl.elementNodes = childNodes.slice(childNodes.indexOf(startNode) + 1, childNodes.indexOf(endNode));
                    this.replaceNodeLength = uiControl.elementNodes.length + 2;
                } else {
                    this.$compiler.compile(element, uiControl);
                }

                if (hasOwnContext && !this.isClone) {
                    this.observeRootContext(uiControl, this._fulfillAndLoad);
                } else if (!hasParent) {
                    this._fulfillAndLoad();
                }
            };
            ElementManager.prototype._attributeChanged = function (node, parent, controls) {
                var length = controls.length, key = camelCase(node.nodeName), attribute = node.node, value = this.$NodeManagerStatic.build(node.expressions, parent), attributes, oldValue;

                for (var i = 0; i < length; ++i) {
                    attributes = controls[i].attributes;
                    oldValue = attributes[key];
                    attributes[key] = value;
                    attributes.attributeChanged(key, value, oldValue);
                }

                if (!this.replace) {
                    attribute.value = value;
                }
            };
            return ElementManager;
        })(NodeManager);
        processing.ElementManager = ElementManager;

        

        function ElementManagerStatic($dom, $document, $ManagerCacheStatic, $ResourcesStatic, $BindableTemplatesStatic) {
            ElementManager.$dom = $dom;
            ElementManager.$document = $document;
            ElementManager.$ManagerCacheStatic = $ManagerCacheStatic;
            ElementManager.$ResourcesStatic = $ResourcesStatic;
            ElementManager.$BindableTemplatesStatic = $BindableTemplatesStatic;
            return ElementManager;
        }
        processing.ElementManagerStatic = ElementManagerStatic;

        register.injectable('$ElementManagerStatic', ElementManagerStatic, [
            '$dom',
            '$document',
            '$ManagerCacheStatic',
            '$ResourcesStatic',
            '$BindableTemplatesStatic'
        ], register.injectableType.STATIC);

        var TextManager = (function (_super) {
            __extends(TextManager, _super);
            function TextManager() {
                _super.apply(this, arguments);
                /**
                * Specifies the type for this INodeManager.
                */
                this.type = 'text';
            }
            /**
            * Determines if a text node has markup, and creates a TextManager if it does.
            * A TextManager or empty TextManager will be added to the managers array.
            *
            * @static
            * @param node The Node used to find markup.
            * @param parent The parent ui.ITemplateControl for the node.
            * @param managers The INodeManager array used to compile the DOM.
            */
            TextManager.create = function (node, parent) {
                var value = node.nodeValue, manager = new TextManager();

                if (NodeManager.hasMarkup(value)) {
                    var expressions = NodeManager.findMarkup(value), map = {
                        nodes: [{
                                node: node,
                                expressions: expressions,
                                identifiers: NodeManager.findUniqueIdentifiers(expressions)
                            }]
                    };

                    manager.initialize(map, parent);

                    return manager;
                }

                manager.initialize(null, parent);
                manager.bind = noop;

                return manager;
            };

            /**
            * Clones an INodeMap with a new text node.
            *
            * @param sourceMap The original INodeMap.
            * @param element The new text node used for cloning.
            * @return {INodeMap} The cloned INodeMap.
            */
            TextManager._cloneNodeMap = function (sourceMap, newNode) {
                var node = sourceMap.nodes[0], nodeMap = {
                    nodes: [{
                            identifiers: node.identifiers,
                            expressions: node.expressions,
                            nodeName: node.nodeName,
                            node: newNode
                        }]
                };
                return nodeMap;
            };

            /**
            * Clones a TextManager with a new text node.
            *
            * @param sourceManager The original IElementManager.
            * @param node The new text node to associate with the clone.
            * @param parent The parent IElementManager for the new clone.
            * @return {TextManager} The cloned TextManager.
            */
            TextManager._clone = function (sourceManager, node, parent) {
                var map = sourceManager.nodeMap, manager = new TextManager();

                if (!isNull(map)) {
                    manager.initialize(TextManager._cloneNodeMap(map, node), parent);
                } else {
                    manager.initialize(null, parent);
                    manager.bind = noop;
                }

                return manager;
            };

            /**
            * Clones this TextManager with a new node.
            *
            * @param newNode The new element used to clone the TextManager.
            * @param parentManager The parent for the clone.
            */
            TextManager.prototype.clone = function (newNode, parentManager) {
                TextManager._clone(this, newNode, parentManager);
                return 1;
            };

            /**
            * The function used for data-binding a data context to the DOM. We allow you to
            * pass in a ui.ITemplateControl and INodeMap to override those contained on the
            * TextManager instance. This helps when binding templates to new data contexts.
            *
            * @param parent The parent ui.ITemplateControl to use for context inheritance.
            * @param nodeMap The INodeMap to use in order to data-bind the data context.
            */
            TextManager.prototype.bind = function () {
                var parent = this.getParentControl(), node = this.nodeMap.nodes[0], textNode = node.node, expressions = node.expressions;

                NodeManager.observeIdentifiers(node.identifiers, parent, this._setText.bind(this, textNode, parent, expressions));

                this._setText(textNode, parent, expressions);
            };
            TextManager.prototype._setText = function (node, control, expressions) {
                var control = control || {}, value;

                value = NodeManager.build(expressions, control);

                node.nodeValue = value;
            };
            return TextManager;
        })(processing.NodeManager);
        processing.TextManager = TextManager;

        function TextManagerStatic() {
            return TextManager;
        }
        processing.TextManagerStatic = TextManagerStatic;

        register.injectable('$TextManageStatic', TextManagerStatic, null, register.injectableType.STATIC);

        /**
        * A class used to manage Comment nodes. Provides a way to
        * clone a Comment node.
        */
        var CommentManager = (function (_super) {
            __extends(CommentManager, _super);
            function CommentManager() {
                _super.apply(this, arguments);
                /**
                * Specifies the type of INodeManager.
                */
                this.type = 'comment';
            }
            /**
            * Creates a new CommentManager for the given Comment node.
            *
            * @static
            * @param node The Comment to associate with the new manager.
            * @param parent The parent IElementManager.
            * @param isClone Denotes whether or not the new manager is a cloned
            * manager.
            */
            CommentManager.create = function (node, parent) {
                var manager = new CommentManager();

                manager.initialize({
                    nodes: [{
                            node: node
                        }]
                }, parent);
            };

            /**
            * A method for cloning this CommentManager.
            *
            * @param newNode The new Comment node to associate with the cloned
            * manager.
            * @param parentManager The parent IElementManager for the new clone.
            */
            CommentManager.prototype.clone = function (newNode, parentManager) {
                CommentManager.create(newNode, parentManager);
                return 1;
            };
            return CommentManager;
        })(NodeManager);
        processing.CommentManager = CommentManager;

        register.injectable('$commentManagerFactory', function () {
            return CommentManager;
        });
    })(plat.processing || (plat.processing = {}));
    var processing = plat.processing;
    (function (navigation) {
        var BaseNavigator = (function () {
            function BaseNavigator() {
                /**
                * A unique identifier used to identify this navigator.
                */
                this.uid = uniqueId('plat_');
                this.$EventManagerStatic = acquire('$EventManagerStatic');
                this.$NavigationEventStatic = acquire('$NavigationEventStatic');
                this.$ExceptionStatic = acquire('$ExceptionStatic');
                this.$ViewControlStatic = acquire('$ViewControlStatic');
                this.$EventManagerStatic.on(this.uid, 'goBack', this.goBack, this);
            }
            /**
            * Initializes a Navigator. The viewport will call this method and pass itself in so
            * the navigator can store it and use it to facilitate navigation.
            */
            BaseNavigator.prototype.initialize = function (baseport) {
                this.baseport = baseport;
            };

            BaseNavigator.prototype.navigate = function (navigationParameter, options) {
            };

            /**
            * Called by the Viewport to make the Navigator aware of a successful navigation. The Navigator will
            * in-turn call the app.navigated event.
            *
            * @param control The ui.IViewControl to which the navigation occurred.
            * @param parameter The navigation parameter sent to the control.
            * @param options The INavigationOptions used during navigation.
            */
            BaseNavigator.prototype.navigated = function (control, parameter, options) {
                this.currentState = {
                    control: control
                };

                control.navigator = this;
                control.navigatedTo(parameter);

                this._sendEvent('navigated', control, control.type, parameter, options, false);
            };

            /**
            * Every navigator must implement this method, defining what happens when a view
            * control wants to go back.
            */
            BaseNavigator.prototype.goBack = function (options) {
            };

            /**
            * Sends a NavigationEvent with the given parameters.  The 'sender' property of the event will be the
            * navigator.
            *
            * @param name The name of the event to send.
            * @param target The target of the event, could be a view control or a route depending upon the navigator and
            * event name.
            * @param options The IBaseNavigationOptions used during navigation
            * @param cancelable Whether or not the event can be canceled, preventing further navigation.
            */
            BaseNavigator.prototype._sendEvent = function (name, target, type, parameter, options, cancelable) {
                return this.$NavigationEventStatic.dispatch(name, this, {
                    target: target,
                    type: type,
                    parameter: parameter,
                    options: options,
                    cancelable: cancelable
                });
            };
            return BaseNavigator;
        })();
        navigation.BaseNavigator = BaseNavigator;

        

        

        

        

        /**
        * The Navigator class allows ui.IViewControls to navigate within a Viewport.
        * Every Viewport has its own Navigator instance, allowing multiple navigators to
        * coexist in one app.
        */
        var Navigator = (function (_super) {
            __extends(Navigator, _super);
            function Navigator() {
                _super.apply(this, arguments);
                /**
                * Contains the navigation history stack.
                */
                this.history = [];
            }
            Navigator.prototype.navigate = function (Constructor, options) {
                var state = this.currentState || {}, viewControl = state.control, injector, key, options = options || {}, parameter = options.parameter, event;

                event = this._sendEvent('beforeNavigate', Constructor, null, parameter, options, true);

                if (event.canceled) {
                    return;
                }

                this.$ViewControlStatic.detach(viewControl);

                if (isObject(parameter)) {
                    parameter = deepExtend({}, parameter);
                }

                this.baseport.controls = [];

                if (isFunction(Constructor.inject)) {
                    injector = Constructor;
                    key = Constructor.type;
                } else {
                    var keys = Object.keys(viewControlInjectors), control;

                    while (keys.length > 0) {
                        key = keys.pop();
                        control = viewControlInjectors[key];
                        if (control.Constructor === Constructor) {
                            injector = control;
                            break;
                        }
                    }
                }

                if (isNull(injector)) {
                    this.$ExceptionStatic.fatal('Attempting to navigate to unregistered view control.', this.$ExceptionStatic.NAVIGATION);
                }

                if (!isNull(viewControl)) {
                    this.baseport.navigateFrom(viewControl);
                    if (!options.replace) {
                        this.history.push({ control: viewControl });
                    }
                }

                event.target = injector;
                event.type = key;
                this.baseport.navigateTo(event);
            };

            /**
            * Returns to the last visited ui.IViewControl.
            *
            * @param parameter An optional navigation parameter to send to the previous control.
            * @param options Optional IBackNavigationOptions allowing the ui.IViewControl
            * to customize navigation. Enables navigating back to a specified point in history as well
            * as specifying a new templateUrl to use at the next ui.IViewControl.
            */
            Navigator.prototype.goBack = function (options) {
                options = options || {};

                if (this.history.length === 0) {
                    this.$EventManagerStatic.dispatch('shutdown', this, this.$EventManagerStatic.direction.DIRECT);
                }

                var viewControl = this.currentState.control, length = isNumber(options.length) ? options.length : 1, Constructor = options.ViewControl, parameter = options.parameter;

                options = options || {};

                var event = this._sendEvent('beforeNavigate', viewControl, viewControl.type, parameter, options, true);

                if (event.canceled) {
                    return;
                }

                if (!isNull(Constructor)) {
                    var index = this._findInHistory(Constructor);

                    if (index > -1) {
                        length = this.history.length - index;
                    } else {
                        this.$ExceptionStatic.warn('Cannot find ViewControl in navigation history.', this.$ExceptionStatic.NAVIGATION);
                        return;
                    }
                }

                if (!isNumber(length) || length > this.history.length) {
                    this.$ExceptionStatic.warn('Not enough views in the navigation history in order to navigate back.', this.$ExceptionStatic.NAVIGATION);
                    return;
                }

                var ViewControl = acquire('$ViewControlStatic');

                this.baseport.navigateFrom(viewControl);
                ViewControl.dispose(viewControl);

                var last = this._goBackLength(length);

                if (isNull(last)) {
                    return;
                }

                viewControl = last.control;

                this.currentState = last;

                event.target = viewControl;
                event.type = viewControl.type;

                this.baseport.navigateTo(event);
            };

            /**
            * Lets the caller know if there are ui.IViewControls in the history, meaning the caller
            * is safe to perform a backward navigation.
            *
            * @return {Boolean}
            */
            Navigator.prototype.canGoBack = function () {
                return this.history.length > 0;
            };

            /**
            * Clears the navigation history, disposing all the controls.
            */
            Navigator.prototype.clearHistory = function () {
                var history = this.history, dispose = this.$ViewControlStatic.dispose;

                while (history.length > 0) {
                    dispose(history.pop().control);
                }
            };

            /**
            * Finds the given constructor in the history stack. Returns the index in the history where
            * the constructor is found, or -1 if no constructor is found.
            *
            * @param Constructor The view control constructor to search for in the history stack.
            */
            Navigator.prototype._findInHistory = function (Constructor) {
                var history = this.history, length = history.length - 1, index = -1, control;

                for (var i = length; i >= 0; --i) {
                    control = history[i].control;

                    if (control.constructor === Constructor) {
                        index = i;
                        break;
                    }
                }

                return index;
            };

            /**
            * This method takes in a length and navigates back in the history, returning the view control
            * associated with length + 1 entries back in the history.  It disposes all the view controls
            * encapsulated in the length.
            */
            Navigator.prototype._goBackLength = function (length) {
                length = isNumber(length) ? length : 1;

                var last, dispose = this.$ViewControlStatic.dispose;

                while (length-- > 0) {
                    if (!isNull(last) && !isNull(last.control)) {
                        dispose(last.control);
                    }

                    last = this.history.pop();
                }

                return last;
            };
            return Navigator;
        })(BaseNavigator);
        navigation.Navigator = Navigator;

        

        register.injectable('$navigator', Navigator, null, register.injectableType.MULTI);

        var RoutingNavigator = (function (_super) {
            __extends(RoutingNavigator, _super);
            function RoutingNavigator() {
                _super.call(this);
                this.$browser = acquire('$browser');
                this.$router = acquire('$router');
                this.$window = acquire('$window');
                this.__removeListeners = [];
                this.__historyLength = 0;

                this.__removeListeners.push(this.$EventManagerStatic.on(this.uid, 'routeChanged', this._onRouteChanged, this));
                this.__removeListeners.push(this.$EventManagerStatic.on(this.uid, 'beforeRouteChange', this._beforeRouteChange, this));
            }
            RoutingNavigator.prototype._beforeRouteChange = function (ev) {
                var event = this._sendEvent('beforeNavigate', ev.target, ev.type, ev.parameter, ev.options, true);

                if (event.canceled) {
                    ev.cancel();
                }
            };

            RoutingNavigator.prototype._onRouteChanged = function (ev) {
                var state = this.currentState || {}, viewControl = state.control, injector = ev.target;

                if (isNull(injector)) {
                    return;
                }

                this.__historyLength++;
                this.baseport.navigateFrom(viewControl);
                this.$ViewControlStatic.dispose(viewControl);
                this.baseport.navigateTo(ev);
            };

            /**
            * Allows a ui.IViewControl to navigate to another ui.IViewControl. Also allows for
            * navigation parameters to be sent to the new ui.IViewControl.
            *
            * @param path The url path to navigate to.
            * @param parameter An optional navigation parameter to send to the next ui.IViewControl.
            * @param options Optional INavigationOptions for ignoring the current ui.IViewControl in the history as
            * well as specifying a new templateUrl for the next ui.IViewControl to use.
            */
            RoutingNavigator.prototype.navigate = function (path, options) {
                this.$router.route(path, options);
            };

            /**
            * Called by the Viewport to make the Navigator aware of a successful navigation. The Navigator will
            * in-turn call the app.navigated event.
            *
            * @param control The ui.IViewControl to which the navigation occurred.
            * @param parameter The navigation parameter sent to the control.
            * @param options The INavigationOptions used during navigation.
            */
            RoutingNavigator.prototype.navigated = function (control, parameter, options) {
                _super.prototype.navigated.call(this, control, parameter, options);
                this.currentState.route = parameter;
            };

            RoutingNavigator.prototype.goBack = function (options) {
                options = options || {};

                this.__historyLength -= 2;

                if (this.__historyLength < 0) {
                    this.$EventManagerStatic.dispatch('shutdown', this, this.$EventManagerStatic.direction.DIRECT);
                }

                this.$router.goBack((isNumber(options.length) ? options.length : 1));
            };
            return RoutingNavigator;
        })(BaseNavigator);
        navigation.RoutingNavigator = RoutingNavigator;

        register.injectable('$routingNavigator', RoutingNavigator);
    })(plat.navigation || (plat.navigation = {}));
    var navigation = plat.navigation;

    /**
    * Class for every app. This class contains hooks for Application Lifecycle Events
    * as well as error handling.
    */
    var App = (function () {
        /**
        * Class for every app. This class contains hooks for Application Lifecycle Management (ALM)
        * as well as error handling and navigation events.
        */
        function App() {
            var ContextManager = acquire('$ContextManagerStatic');
            ContextManager.defineGetter(this, 'uid', uniqueId('plat_'));
        }
        /**
        * A static method for initiating the app startup.
        */
        App.start = function () {
            var compat = acquire('$compat');

            if (!compat.isCompatible) {
                var $ExceptionStatic = acquire('$ExceptionStatic');

                $ExceptionStatic.fatal('PlatypusTS only supports modern browsers where ' + 'Object.defineProperty is defined', $ExceptionStatic.COMPAT);
                return;
            }

            var eventManager = acquire('$EventManagerStatic');

            eventManager.dispose('__app__');
            eventManager.on('__app__', 'ready', App.__ready);
            eventManager.on('__app__', 'shutdown', App.__shutdown);
            eventManager.initialize();
        };

        /**
        * A static methods called upon app registration. Primarily used
        * to initiate a ready state in the case that amd is being used.
        */
        App.registerApp = function (app) {
            App._app = app;
            var compat = acquire('$compat');

            if (compat.amd) {
                var lifecycleEventFactory = acquire('$LifecycleEventStatic'), dispatch = lifecycleEventFactory.dispatch;

                postpone(function ready() {
                    dispatch('ready', lifecycleEventFactory);
                });
            }
        };

        /**
        * Kicks off compilation of the DOM from the specified node. If no node is specified,
        * the default start node is document.body.
        *
        * @param node The node at which DOM compilation begins.
        */
        App.load = function (node) {
            var LifecycleEvent = App.$LifecycleEventStatic, compiler = App.$compiler, $document = App.$document;

            LifecycleEvent.dispatch('beforeLoad', App);

            if (isNull(node)) {
                compiler.compile($document.body);
                return;
            }

            compiler.compile(node);
        };

        /**
        * A static method called when the application is ready. It calls the app instance's
        * ready function as well as checks for the presence of a module loader. If one exists,
        * loading the DOM falls back to the app developer. If it doesn't, the DOM is loaded from
        * document.body.
        */
        App.__ready = function (ev) {
            dependency.Injector.initialize();
            var app = App._app;

            if (!isNull(app)) {
                if (isFunction(app.inject)) {
                    App._app = app = app.inject();
                }

                app.on('suspend', app.suspend);
                app.on('resume', app.resume);
                app.on('online', app.online);
                app.on('offline', app.offline);
                app.on('error', app.error);

                if (isFunction(app.ready)) {
                    app.ready(ev);
                }
            }

            var compat = App.$compat;

            if (!compat.amd) {
                App.load();
            }
        };

        App.__shutdown = function () {
            var app = navigator.app;

            if (!isNull(app) && isFunction(app.exitApp)) {
                app.exitApp();
            }
        };

        /**
        * Event fired when the app is suspended.
        *
        * @param ev The ILifecycleEvent object.
        */
        App.prototype.suspend = function (ev) {
        };

        /**
        * Event fired when the app resumes from the suspended state.
        *
        * @param ev The ILifecycleEvent object.
        */
        App.prototype.resume = function (ev) {
        };

        /**
        * Event fired when an internal error occures.
        *
        * @param ev The IErrorEvent object.
        */
        App.prototype.error = function (ev) {
        };

        /**
        * Event fired when the app is ready.
        *
        * @param ev The ILifecycleEvent object.
        */
        App.prototype.ready = function (ev) {
        };

        /**
        * Event fired when the app regains connectivity and is now in an online state.
        *
        * @param ev The ILifecycleEvent object.
        */
        App.prototype.online = function (ev) {
        };

        /**
        * Event fired when the app loses connectivity and is now in an offline state.
        *
        * @param ev The ILifecycleEvent object.
        */
        App.prototype.offline = function (ev) {
        };

        /**
        * Creates a new DispatchEvent and propagates it to all listeners based on the
        * events.EventManager.DIRECT method. Propagation will always start with the sender,
        * so the sender can both produce and consume the same event.
        *
        * @param name The name of the event to send, cooincides with the name used in the
        * app.on() method.
        * @param ...args Any number of arguments to send to all the listeners.
        */
        App.prototype.dispatchEvent = function (name) {
            var args = [];
            for (var _i = 0; _i < (arguments.length - 1); _i++) {
                args[_i] = arguments[_i + 1];
            }
            App.$EventManagerStatic.dispatch(name, this, App.$EventManagerStatic.direction.DIRECT, args);
        };

        /**
        * Registers a listener for a DispatchEvent. The listener will be called when a DispatchEvent is
        * propagating over the app. Any number of listeners can exist for a single event name.
        *
        * @param name The name of the event, cooinciding with the DispatchEvent name.
        * @param listener The method called when the DispatchEvent is fired.
        */
        App.prototype.on = function (name, listener) {
            return App.$EventManagerStatic.on(this.uid, name, listener, this);
        };

        /**
        * Kicks off compilation of the DOM from the specified node. If no node is specified,
        * the default start node is document.body. This method should be called from the app when
        * using module loaders. If a module loader is in use, the app will delay loading until
        * this method is called.
        *
        * @param node The node where at which DOM compilation begins.
        */
        App.prototype.load = function (node) {
            App.load(node);
        };
        return App;
    })();
    plat.App = App;

    function AppStatic($compat, $ExceptionStatic, $EventManagerStatic, $document, $compiler, $LifecycleEventStatic) {
        App.$compat = $compat;
        App.$ExceptionStatic = $ExceptionStatic;
        App.$EventManagerStatic = $EventManagerStatic;
        App.$document = $document;
        App.$compiler = $compiler;
        App.$LifecycleEventStatic = $LifecycleEventStatic;
        return App;
    }
    plat.AppStatic = AppStatic;

    register.injectable('$AppStatic', AppStatic, [
        '$compat',
        '$ExceptionStatic',
        '$EventManagerStatic',
        '$document',
        '$compiler',
        '$LifecycleEventStatic'
    ], register.injectableType.STATIC);

    

    

    

    App.start();
})(plat || (plat = {}));
//# sourceMappingURL=platypus.js.map
