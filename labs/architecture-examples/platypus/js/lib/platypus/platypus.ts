/* 
* PlatypusTS v0.0.1.4 (http://getplatypi.com) 
* Copyright 2014 Platypi, LLC. All rights reserved. 
* 
* PlatypusTS is licensed under the GPL-3.0 found at  
* http://opensource.org/licenses/GPL-3.0 
*/ 

module plat {
    var __nativeIsArray = !!Array.isArray,
        __uids__ = {};
    
    function noop() { }
    
    function extend(destination: any, ...sources: any[]): any {
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
    
            forEach(keys, function (key: string) {
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
    
    function deepExtend(destination: any, ...sources: any[]): any {
        return extend.apply(null, [true, destination].concat(sources));
    }
    
    function isObject(obj: any): boolean {
        return obj != null && typeof obj === 'object';
    }
    
    function isWindow(obj: any): boolean {
        return !!(obj && obj.document && obj.setInterval);
    }
    
    function isDocument(obj: any): boolean {
        return !!(obj && obj.nodeType === Node.DOCUMENT_NODE);
    }
    
    function isNode(obj: any): boolean {
        return !!(obj && typeof obj.nodeType === 'number');
    }
    
    function isString(obj: any): boolean {
        return typeof obj === 'string';
    }
    
    function isRegExp(obj: any): boolean {
        return Object.prototype.toString.call(obj) === '[object RegExp]';
    }
    
    function isEmpty(obj: any): boolean {
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
    
    function isBoolean(obj: any): boolean {
        return typeof obj === 'boolean';
    }
    
    function isNumber(obj: any): boolean {
        return typeof obj === 'number' && !isNaN(obj);
    }
    
    function isFunction(obj: any): boolean {
        return typeof obj === 'function';
    }
    
    function isNull(obj: any): boolean {
        return obj === null || obj === undefined;
    }
    
    function isUndefined(obj: any): boolean {
        return obj === undefined;
    }
    
    function isArray(obj: any): boolean {
        if (__nativeIsArray) {
            return Array.isArray(obj);
        }
    
        return Object.prototype.toString.call(obj) === '[object Array]';
    }
    
    function isArrayLike(obj: any): boolean {
        if (isNull(obj) || isWindow(obj) || isFunction(obj)) {
            return false;
        }
    
        return isString(obj) || obj.length >= 0;
    }
    
    function filter<T>(obj: any, iterator: (value: T, key: any, obj: any) => boolean, context?: any): Array<T> {
        var arr = [];
        if (isNull(obj)) {
            return arr;
        }
    
        if (isFunction(obj.filter)) {
            return obj.filter(iterator, context);
        }
    
        forEach<T>(obj, function (value: T, key: any, obj: any) {
            if (iterator(value, key, obj)) {
                arr.push(value);
            }
        });
    
        return arr;
    }
    
    function where(obj: any, properties: any): Array<any> {
        return filter(obj, function (value) {
            return !some(properties, function (property, key) {
                return value[key] !== property;
            });
        });
    }
    
    function forEach<T>(obj: any, iterator: (value: T, key: any, obj: any) => void, context?: any): any {
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
    
    function map<T, U>(obj: any, iterator: (value: T, key: any, obj: any) => U, context?: any): Array<U> {
        var arr: any = [];
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
    
    function pluck<T, U>(obj: any, key: string): Array<U> {
        return map<T, U>(obj, function (value) { return value[key]; });
    }
    
    function some<T>(obj: any, iterator: (value: T, key: any, obj: any) => boolean, context?: any): boolean {
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
    
    function postpone(method: (...args: any[]) => void, args?: Array<any>, context?: any) {
        return defer(method, 0, args, context);
    }
    
    function defer(method: (...args: any[]) => void, timeout: number, args?: Array<any>, context?: any) {
        function defer() {
            method.apply(context, args);
        }
    
        var timeoutId = setTimeout(defer, timeout);
    
        return function clearDefer() {
            clearTimeout(timeoutId);
        };
    }
    
    function uniqueId(prefix?: string) {
        if (isNull(prefix)) {
            prefix = '';
        }
    
        var puid = __uids__[prefix];
    
        if (isNull(puid)) {
            puid = __uids__[prefix] = ['0', '/'];
        }
    
        var index = puid.length,
            char;
    
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
    
    function camelCase(str: string) {
        if (!isString(str) || isEmpty(str)) {
            return str;
        }
    
        str = str.charAt(0).toLowerCase() + str.substr(1);
        var regex: expressions.IRegex = acquire('$regex');
    
        return str.replace(regex.camelCaseRegex,
            function delimiterMatch(match: string, delimiter?: string, char?: string, index?: number) {
                return index ? char.toUpperCase() : char;
            });
    }
    /**
     * An IInjectorObject of plat.IControls. Contains all the registered
     * controls for an application.
     */
    var controlInjectors: dependency.IInjectorObject<IControl> = {};
    
    /**
     * An IInjectorObject of plat.ui.IViewControls. Contains all the registered
     * view controls for an application.
     */
    var viewControlInjectors: dependency.IInjectorObject<ui.IViewControl> = {};
    
    /**
     * An IInjectorObject of objects. Contains all the registered
     * injectables for an application.
     */
    var injectableInjectors: dependency.IInjectorObject<dependency.IInjector<any>> = {};
    
    /**
     * An IInjectorObject of static objects. Contains all the registered
     * static injectables for an application.
     */
    var staticInjectors: dependency.IInjectorObject<dependency.IInjector<any>> = {};
    
    export module register {
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
        function add(obj: dependency.IInjectorObject<any>, name: string, Constructor: any, dependencies?: Array<any>, type?: string) {
            var injector = obj[name] = new dependency.Injector<any>(name, Constructor, dependencies, type);

            if (type === injectableType.STATIC) {
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
        export function app(name: string, Constructor: new (...args: any[]) => IApp, dependencies?: Array<any>) {
            var app = new dependency.Injector<IApp>(name, Constructor, dependencies);
            App.registerApp(app);
            return app;
        }

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
        export function control(type: string, Constructor: new (...args: any[]) => IControl, dependencies?: Array<any>): typeof register {
            return add(controlInjectors, type, Constructor, dependencies);
        }

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
        export function viewControl(type: string, Constructor: new (...args: any[]) => ui.IViewControl,
            dependencies?: Array<any>, routes?: Array<any>): typeof register {
            var ret = add(viewControlInjectors, type, Constructor, dependencies, type);

            if (isArray(routes)) {
                var router: web.IRouter = acquire('$router');
                router.registerRoutes(type, routes);
            }

            return ret;
        }

        /**
         * Registers an injectable with the framework. Injectables are objects that can be used for dependency injection into other objects.
         * The dependencies array corresponds to injectables that will be passed into the Constructor of the injectable. The injectable 
         * constructor arguments must all be optional (denoted with a ? after the declaration), as they are potentially null.
         * 
         * @param name The name of the injector, used when another component is specifying dependencies.
         * @param dependencies An array of strings representing the dependencies needed for the injectable's injector.
         * @param Constructor The constructor for the injectable. The injectable will only be instantiated once during the application
         * lifetime.
         * @param type Specifies the type of injectable, either register.injectableType.SINGLE or 
         * register.injectableType.MULTI (defaults to register.injectableType.SINGLE).
         * 
         * @see register.injectableType
         * 
         * @return {register} The object that contains the register methods (for method chaining).
         * 
         * @example register.injectable('$CacheStatic', [plat.expressions.Parser], Cache);
         * @example register.injectable('database', MyDatabase, null, register.injectableType.MULTI);
         */
        export function injectable(name: string, Constructor: new (...args: any[]) => void,
            dependencies?: Array<any>, type?: string): typeof register;
        /**
         * Registers an injectable with the framework. Injectables are objects that can be used for dependency injection into other objects.
         * The dependencies array corresponds to injectables that will be passed into the injectable method. The injectable 
         * method arguments must all be optional (denoted with a ? after the declaration), as they are potentially null.
         * 
         * @param name The name of the injector, used when another component is specifying dependencies.
         * @param dependencies An array of strings representing the dependencies needed for the injectable's injector.
         * @param Constructor The constructor for the injectable. The injectable will only be instantiated once during the application
         * lifetime.
         * @param type Specifies the type of injectable, either register.injectableType.SINGLE or 
         * register.injectableType.MULTI (defaults to register.injectableType.SINGLE).
         * 
         * @see register.injectableType
         * 
         * @return {register} The object that contains the register methods (for method chaining).
         * 
         * @example register.injectable('$CacheStatic', [plat.expressions.Parser], 
         *  export function(parser? plat.expressions.IParser) { return { ... }; });
         * @example register.injectable('database', export function() { return new Database(); }, null, register.injectableType.MULTI);
         */
        export function injectable(name: string, method: (...args: any[]) => any,
            dependencies?: Array<any>, type?: string): typeof register;
        export function injectable(name: string, Constructor: any, dependencies?: Array<any>, type?: string): typeof register {
            return add(injectableInjectors, name, Constructor, dependencies, type || register.injectableType.SINGLE);
        }

        /**
         * Defines the different types of injectables.
         */
        export var injectableType = {
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
    }
    export module dependency {
        /**
         * The Injector class is used for dependency injection. You can create an injector object,
         * specify dependencies and a constructor for your component. When the injector object is
         * 'injected' it will create a new instance of your component and pass in the dependencies
         * to the constructor.
         */
        export class Injector<T> implements IInjector<T> {
            static initialize() {
                var injectors = staticInjectors,
                    keys = Object.keys(injectors),
                    length = keys.length;

                for (var i = 0; i < length; ++i) {
                    injectors[keys[i]].inject();
                }

                staticInjectors = {};
            }

            static getDependencies(dependencies: Array<any>) {
                if (isNull(dependencies) || isEmpty(dependencies)) {
                    return [];
                }

                var deps = [],
                    length = dependencies.length,
                    dependency;

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
            }

            static convertDependencies(dependencies: Array<any>) {
                if (!isArray(dependencies)) {
                    return [];
                }
                var deps: Array<string> = [],
                    length = dependencies.length,
                    dependency,
                    injector: Injector<any>;

                for (var i = 0; i < length; ++i) {
                    dependency = dependencies[i];

                    if (isNull(dependency)) {
                        deps.push('noop');
                        continue;
                    }

                    deps.push(Injector.__getInjectorName(dependency));
                }

                return deps;
            }

            private static __getInjectorName(dependency): string {
                if (isNull(dependency)) {
                    return 'noop';
                } else if (isString(dependency)) {
                    return dependency;
                } else if (dependency === window) {
                    return '$window';
                } else if (dependency === window.document) {
                    return '$document';
                }

                var injectors = injectableInjectors,
                    injector: IInjector<any>,
                    keys = Object.keys(injectors),
                    length = keys.length,
                    key: string,
                    value: any;

                for (var i = 0; i < length; ++i) {
                    key = keys[i];
                    injector = injectors[key];

                    value = injector.Constructor;

                    if (value === dependency) {
                        return key;
                    }
                }

                return 'noop';
            }

            private static __construct(Constructor: any, args: Array<any>, pattern: string) {
                if (isNull(Constructor) || isNull(Constructor.prototype)) {
                    return Constructor;
                }
                var obj = Object.create(Constructor.prototype),
                    ret = obj.constructor.apply(obj, args);

                if (!isUndefined(ret)) {
                    return ret;
                }

                return obj;
            }

            private static __locateInjector(Constructor: any) {
                if (isNull(Constructor)) {
                    return;
                } else if (isString(Constructor)) {
                    return injectableInjectors[Constructor];
                } else if (Constructor === window) {
                    return injectableInjectors['$window'];
                } else if (Constructor === window.document) {
                    return injectableInjectors['$document'];
                }

                var injectors = injectableInjectors,
                    injector: IInjector<any>,
                    keys = Object.keys(injectors),
                    length = keys.length,
                    value: any;

                for (var i = 0; i < length; ++i) {
                    injector = injectors[keys[i]];

                    if (injector.Constructor === Constructor) {
                        return injector;
                    }
                }

                return Injector.__wrap(Constructor);
            }

            private static __wrap(value: any): IInjector<any> {
                return {
                    inject: function () {
                        return value;
                    },
                    __name: 'wrapped',
                    dependencies: [],
                    Constructor: value
                };
            }

            private static __noop(): IInjector<any> {
                return {
                    inject: noop,
                    type: 'noop',
                    __name: 'noop',
                    __dependencies: [],
                    Constructor: <any>noop
                };
            }

            private static __isInjector(dependency: Injector<any>): boolean {
                return isFunction(dependency.inject) &&
                    !isUndefined(dependency.type) &&
                    !isUndefined(dependency.__name) &&
                    !isUndefined(dependency.Constructor);
            }

            private __dependencies: Array<any>;

            /**
             * @param dependencies An array of strings specifying the injectable dependencies for the 
             * associated constructor.
             * @param Constructor The constructor method for the component requiring the dependency 
             * injection.
             * @param type The type of injector, used for injectables specifying a register.injectableType of 
             * STATIC, SINGLE, or MULTI. The default is SINGLE.
             */
            constructor(private __name: string, public Constructor: new () => T, dependencies?: Array<any>, public type?: string) {
                this.__dependencies = Injector.convertDependencies(dependencies);
            }

            /**
             * Gathers the dependencies for the Injector object and creates a new instance of the 
             * Constructor, passing in the dependencies in the order they were specified. If the 
             * Injector contains a Constructor for an injectable it will only inject that injectable
             * once.
             */
            inject(): T {
                var toInject: any = [];

                this.__dependencies = Injector.getDependencies(this.__dependencies);

                var dependencies: Array<IInjector<any>> = this.__dependencies || [],
                    length = dependencies.length,
                    dependency,
                    injectable: any;

                for (var i = 0; i < length; ++i) {
                    toInject.push(dependencies[i].inject());
                }

                injectable = <T>Injector.__construct(this.Constructor, toInject, this.type);

                if (this.type === register.injectableType.SINGLE || this.type === register.injectableType.STATIC) {
                    this._wrapInjector(injectable);
                }

                return injectable;
            }
            _wrapInjector(value: any) {
                return injectableInjectors[this.__name] = <IInjector<any>>{
                    type: this.type,
                    __name: this.__name,
                    dependencies: this.__dependencies,
                    Constructor: this.Constructor,
                    inject: function () {
                        return <T>value;
                    }
                };
            }
        }

        /**
         * An object whose values are all IInjectors.
         */
        export interface IInjectorObject<T> extends IObject<IInjector<T>> { }

        /**
         * Describes an object that handles dependency-injection for a Constructor.
         */
        export interface IInjector<T> {
            /**
             * Gathers the dependencies for the IInjector object and creates a new instance of the 
             * Constructor, passing in the dependencies in the order they were specified. If the 
             * Injector contains a Constructor for an injectable it will only inject that injectable
             * once.
             */
            inject(): T;

            /**
             * The constructor method for the component requiring the dependency injection.
             */
            Constructor: new () => T;

            /**
             * The type of injector, used for injectables specifying a register.injectableType of 
             * STATIC, SINGLE, or MULTI. The default is SINGLE.
             */
            type?: string;
        }
    }
    export function acquire(dependency: any): any;
    export function acquire(dependencies: Array<any>): Array<any>;
    /**
     * Returns the requested injectable dependency.
     * 
     * @param dependency The injectable dependency type to return.
     * @param {any} The requested dependency.
     */
    export function acquire(dependency: string): any;
    /**
     * Gathers dependencies and returns them as an array in the order they were requested.
     * 
     * @param dependencies An array of strings specifying the injectable dependencies.
     * @return {Array<any>} The dependencies, in the order they were requested.
     */
    export function acquire(dependencies: Array<string>): Array<any>;
    export function acquire(dependencies: any) {
        var deps: Array<dependency.IInjector<any>>,
            array = isArray(dependencies);

        if (array) {
            deps = dependency.Injector.getDependencies(dependencies);
        } else {
            deps = dependency.Injector.getDependencies([dependencies]);
        }

        var length = deps.length,
            output = [];

        for (var i = 0; i < length; ++i) {
            output = deps[i].inject();
        }

        if (array) {
            return output[0];
        }

        return output;
    }

    /**
     * Returns the requested dependency or gathers dependencies and passes them back 
     * as an array in the order they were specified.
     */
    export interface IAcquire {
        /**
         * Returns the requested injectable dependency.
         * 
         * @param dependency The injectable dependency type to return.
         * @param {any} The requested dependency.
         */
        (dependency: string): any;
        /**
         * Gathers dependencies and returns them as an array in the order they were requested.
         * 
         * @param dependencies An array of strings specifying the injectable dependencies.
         * @return {Array<any>} The dependencies, in the order they were requested.
         */
        (dependencies: Array<string>): Array<any>;
    }

    export class Exception {
        /**
         * Method for sending a warning to all listeners. Will 
         * not throw an error.
         * 
         * @param message The message to be sent to the listeners.
         * @param type Denotes the type of fatal exception.
         */
        static warn(message: string, type?: number) {
            raise(message, type, false);
        }

        /**
         * Method for sending a fatal error to all listeners. Will
         * throw an error.
         * 
         * @param error The Error to be sent to all the listeners.
         * @param type Denotes the type of fatal exception. 
         */
        static fatal(error: Error, type?: number);
        /**
         * Method for sending a fatal message to all listeners. Will
         * throw an error.
         * 
         * @param message The message to be sent to all the listeners.
         * @param type Denotes the type of fatal exception.
         */
        static fatal(message: string, type?: number);
        static fatal(message: any, type?: number) {
            raise(message, type, true);
        }
        static PARSE = 0;
        static COMPILE = 1;
        static BIND = 2;
        static NAME = 3;
        static NAVIGATION = 4;
        static TEMPLATE = 5;
        static AJAX = 6;
        static CONTEXT = 7;
        static EVENT = 8;
        static INJECTABLE = 9;
        static COMPAT = 10;
    }

    export interface IExceptionStatic {
        /**
         * Method for sending a warning to all listeners. Will
         * not throw an error.
         *
         * @param message The message to be sent to the listeners.
         * @param type Denotes the type of fatal exception.
         */
        warn(message: string, type?: number): void;

        /**
         * Method for sending a fatal error to all listeners. Will
         * throw an error.
         *
         * @param error The Error to be sent to all the listeners.
         * @param type Denotes the type of fatal exception.
         */
        fatal(error: Error, type?: number): void;
        /**
         * Method for sending a fatal message to all listeners. Will
         * throw an error.
         *
         * @param message The message to be sent to all the listeners.
         * @param type Denotes the type of fatal exception.
         */
        fatal(message: string, type?: number): void;
        PARSE: number;
        COMPILE: number;
        BIND: number;
        NAME: number;
        NAVIGATION: number;
        TEMPLATE: number;
        AJAX: number;
        CONTEXT: number;
        EVENT: number;
        INJECTABLE: number;
        COMPAT: number;
    }

    export function ExceptionStatic() {
        return Exception;
    }

    register.injectable('$ExceptionStatic', ExceptionStatic, null, register.injectableType.STATIC);

    function PlatException(message, name) {
        this.message = message;
        this.name = name;
    }

    function PlatError(message?: string) {
        this.message = message || '';
        this.name = 'PlatError';
    }

    function setPrototypes(platError?: any) {
        PlatError.prototype = platError || Error.prototype;
        PlatException.prototype = new PlatError();
    }

    function raise(message: any, type: number, isFatal?: boolean) {
        var error: Error;

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
            var temp = message,
                properties = Object.getOwnPropertyNames(message),
                length = properties.length;

            error.message = '';
            error = Object.create(error);

            for (var i = 0; i < length; ++i) {
                error[properties[i]] = message[properties[i]];
            }
        }
        var ErrorEvent: events.IErrorEventStatic = acquire('$ErrorEventStatic');

        ErrorEvent.dispatch('error', Exception, error);

        if (isFatal) {
            throw error;
        }
    }

    /**
     * A class for checking browser compatibility issues.
     */
    export class Compat implements ICompat {
        /**
         * Signifies whether or not Cordova is defined. If it is, 
         * we hook up ALM events to Cordova's functions.
         */
        cordova: boolean;

        /**
         * Signifies whether window.history.pushState is defined.
         */
        pushState: boolean;
        
        /**
         * Signifies whether Require is present. If it is, we assume 
         * it is going to be used and leave the loading of the app up 
         * to the developer.
         */
        amd: boolean;
        
        /**
         * Signifies whether we are in the contet of a Windows 8 app.
         */
        msApp: boolean;
        
        /**
         * Signifies whether indexedDB exists on the window.
         */
        indexedDb: boolean;

        /**
         * Signifies whether Object.prototype.__proto__ exists.
         */
        proto: boolean;

        /**
         * Signifies whether Object.prototype.getPrototypeOf exists.
         */
        getProto: boolean;

        /**
         * Signifies whether Object.prototype.setPrototypeOf exists.
         */
        setProto: boolean;

        /**
         * Determines if the browser is modern enough to correctly 
         * run PlatypusTS.
         */
        get isCompatible() {
            var $document = acquire('$document');

            return isFunction(Object.defineProperty) &&
                isFunction($document.querySelector);
        }

        constructor() {
            var contextManager: observable.IContextManagerStatic = acquire('$ContextManagerStatic'),
                $window: Window = acquire('$window'),
                define = contextManager.defineGetter,
                def = $window['define'],
                msA = $window['MSApp'];

            define(this, 'cordova', !isNull($window['cordova']));
            define(this, 'pushState', !isNull($window.history.pushState));
            define(this, 'amd', isFunction(def) && !isNull(def.amd));
            define(this, 'msApp', isObject(msA) && isFunction(msA.execUnsafeLocalFunction));
            define(this, 'indexedDb', !isNull($window.indexedDB));
            define(this, 'proto', isObject((<any>{}).__proto__));
            define(this, 'getProto', isFunction(Object.getPrototypeOf));
            define(this, 'setProto', isFunction((<any>Object).setPrototypeOf));
        }
    }

    register.injectable('$compat', Compat);

    /**
     * An object containing boolean values signifying browser 
     * and/or platform compatibilities.
     */
    export interface ICompat {
        /**
         * Signifies whether or not Cordova is defined. If it is, 
         * we hook up ALM events to Cordova's functions.
         */
        cordova: boolean;

        /**
         * Signifies whether window.history.pushState is defined.
         */
        pushState: boolean;

        /**
         * Signifies whether Require is present. If it is, we assume 
         * it is going to be used and leave the loading of the app up 
         * to the developer.
         */
        amd: boolean;

        /**
         * Signifies whether we are in the contet of a Windows 8 app.
         */
        msApp: boolean;

        /**
         * Signifies whether indexedDB exists on the window.
         */
        indexedDb: boolean;

        /**
         * Signifies whether Object.prototype.__proto__ exists.
         */
        proto: boolean;

        /**
         * Signifies whether Object.prototype.getPrototypeOf exists.
         */
        getProto: boolean;

        /**
         * Signifies whether Object.prototype.setPrototypeOf exists.
         */
        setProto: boolean;

        /**
         * Determines if the browser is modern enough to correctly 
         * run PlatypusTS.
         */
        isCompatible: boolean;
    }

    export class Utils {
        /**
         * An empty method for quickly creating dummy objects.
         */
        noop() { }

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
        extend(destination: any, ...sources: any[]): any {
            return extend.apply(null, [destination].concat(sources));
        }

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
        deepExtend(destination: any, ...sources: any[]): any {
            return extend.apply(null, [true, destination].concat(sources));
        }

        /**
         * Takes in anything and determines if it is a type of Object.
         * 
         * @param obj Anything.
         * @return {boolean} True if obj is an object, false otherwise.
         */
        isObject(obj: any): boolean {
            return isObject(obj);
        }

        /**
         * Takes in anything and determines if it is a window object.
         * 
         * @param obj Anything.
         * @return {boolean} True if obj is the window, false otherwise.
         */
        isWindow(obj: any): boolean {
            return isWindow(obj);
        }

        /**
         * Takes in anything and determines if it is a document object.
         * 
         * @param obj Anything.
         * @return {boolean} True if obj is the document, false otherwise.
         */
        isDocument(obj: any): boolean {
            return isDocument(obj);
        }

        /**
         * Takes in anything and determines if it is a Node.
         * 
         * @param obj Anything.
         * @return {boolean} True if obj is a Node, false otherwise.
         */
        isNode(obj: any): boolean {
            return isNode(obj);
        }

        /**
         * Takes in anything and determines if it is a string.
         * 
         * @param obj Anything.
         * @return {boolean} True if obj is a string, false otherwise.
         */
        isString(obj: any): boolean {
            return isString(obj);
        }

        /**
         * Takes in anything and determines if it is a RegExp object.
         * 
         * @param obj Anything.
         * @return {boolean} True if obj is a RegExp object, false otherwise.
         */
        isRegExp(obj: any): boolean {
            return isRegExp(obj);
        }

        /**
         * Takes in anything and determines if it is empty. Useful for
         * checking for empty strings, arrays, or objects without keys.
         * 
         * @param obj Anything.
         * @return {boolean} True if the object isEmpty (or null/undefined), 
         * false otherwise.
         */
        isEmpty(obj: any): boolean {
            return isEmpty(obj);
        }

        /**
         * Takes in anything and determines if it is a boolean.
         * 
         * @param obj Anything.
         * @return {boolean} True if obj is a boolean, false otherwise.
         */
        isBoolean(obj: any): boolean {
            return isBoolean(obj);
        }

        /**
         * Takes in anything and determines if it is a number.
         * 
         * @param obj Anything.
         * @return {boolean} True if obj is a number, false otherwise.
         */
        isNumber(obj: any): boolean {
            return isNumber(obj);
        }

        /**
         * Takes in anything and determines if it is a function.
         * 
         * @param obj Anything.
         * @return {boolean} True if obj is a function, false otherwise.
         */
        isFunction(obj: any): boolean {
            return isFunction(obj);
        }

        /**
         * Takes in anything and determines if it is null or undefined.
         * 
         * @param obj Anything.
         * @return {boolean} True if obj is null or undefined, false otherwise.
         */
        isNull(obj: any): boolean {
            return isNull(obj);
        }

        /**
         * Takes in anything and determines if it is undefined.
         * 
         * @param obj Anything.
         * @return {boolean} True if obj is undefined, false otherwise.
         */
        isUndefined(obj: any): boolean {
            return isUndefined(obj);
        }

        /**
         * Takes in anything and determines if it is an Array.
         * 
         * @param obj Anything.
         * @return {boolean} True if obj is an Array, false otherwise.
         */
        isArray(obj: any): boolean {
            return isArray(obj);
        }

        /**
         * Takes in anything and determines if it has array-like qualities.
         * 
         * @param obj Anything.
         * @return {boolean} True if obj has array-like qualities (i.e. it is an
         * Array, string, arguments, or NodeList), false otherwise.
         */
        isArrayLike(obj: any): boolean {
            return isArrayLike(obj);
        }

        /**
         * Takes in an array and a function to evaluate the properties in the array.
         * Returns a filtered array of objects resulting from evaluating the function.
         * 
         * @param array The Array to filter.
         * @param iterator The iterator function to call with array's properties. Returns true if the property
         * should be kept, false otherwise.
         * @param context Optional context with which to call the iterator.
         * @return {Array<T>} An array of objects which evaluated to true with the iterator.
         */
        filter<T>(array: Array<T>, iterator: (value: T, key: any, obj: any) => boolean, context?: any): Array<T>;
        /**
         * Takes in an object/array and a function to evaluate the properties in the object/array.
         * Returns a filtered array of objects resulting from evaluating the function.
         * 
         * @param obj The object to filter.
         * @param iterator The iterator function to call with obj's properties. Returns true if the property
         * should be kept, false otherwise.
         * @param context Optional context with which to call the iterator.
         * @return {Array<T>} An array of objects which evaluated to true with the iterator.
         */
        filter<T>(obj: any, iterator: (value: T, key: any, obj: any) => boolean, context?: any): Array<T>;
        filter<T>(obj: any, iterator: (value: T, key: any, obj: any) => boolean, context?: any): Array<T> {
            return filter(obj, iterator, context);
        }

        /**
         * Takes in a list and object containing key/value pairs to search for in the list.
         * 
         * @param array The list used for searching for properties.
         * @param properties An object containing key/value pairs to match with obj's values.
         * @return {Array<T>} The matched values in obj.
         * 
         * @example where([{foo: 'foo', bar: 'bar'}, {foo: 'bar', bar: 'foo'}], {foo: 'foo'});
         * //returns [{foo: 'bar', bar: 'bar'}]
         */
        where<T>(array: Array<T>, properties: any): Array<T>;
        /**
         * Takes in a list and object containing key/value pairs to search for on the obj.
         * 
         * @param obj The list used for searching for properties.
         * @param properties An object containing key/value pairs to match with obj's values.
         * @return {Array<T>} The matched values in obj.
         * 
         * @example where([{foo: 'foo', bar: 'bar'}, {foo: 'bar', bar: 'foo'}], {foo: 'foo'});
         * //returns [{foo: 'bar', bar: 'bar'}]
         */
        where<T>(obj: any, properties: any): Array<T>;
        where(obj: any, properties: any): Array<any> {
            return where(obj, properties);
        }

        /**
         * Takes in an Array and a function to iterate over. Calls the iterator function with every property
         * in the Array, then returns the object.
         * 
         * @param obj An Array.
         * @param iterator A method that takes in a value, index, and the object.
         * @param context An optional context to bind to the iterator.
         * @return {Array<T>} The array.
         */
        forEach<T>(array: Array<T>, iterator: (value: T, index: number, obj: any) => void, context?: any): Array<T>;
        /**
         * Takes in an object and a function to iterate over. Calls the iterator function with every property
         * in the object, then returns the object. If the object is Array-like (e.g. a String), it will be treated as though 
         * it is an Array.
         * 
         * @param obj An object.
         * @param iterator A method that takes in a value, key, and the object.
         * @param context An optional context to bind to the iterator.
         * @return {IObject<T>} The object.
         */
        forEach<T>(obj: any, iterator: (value: T, key: string, obj: any) => void, context?: any): any;
        forEach<T>(obj: any, iterator: (value: T, key: any, obj: any) => void, context?: any): any {
            return forEach(obj, iterator, context);
        }

        /**
         * Takes in an object and an iterator function. Calls the iterator with all the values in the object. The 
         * iterator can transform the object and return it. The returned values will be pushed to an Array and 
         * returned.
         * 
         * @param array An Array.
         * @param iterator The transformation function.
         * @param context An optional context to bind to the iterator.
         * @return {Array<U>} The accumulated transformed values from the iterator.
         */
        map<T, U>(array: Array<T>, iterator: (value: T, index: number, obj: any) => U, context?: any): Array<U>;
        /**
         * Takes in an object and an iterator function. Calls the iterator with all the values in the object. The 
         * iterator can transform the object and return it. The returned values will be pushed to an Array and 
         * returned.
         * 
         * @param obj An object/array.
         * @param iterator The transformation function.
         * @param context An optional context to bind to the iterator.
         * @return {Array<U>} The accumulated transformed values from the iterator.
         */
        map<T, U>(obj: any, iterator: (value: T, key: string, obj: any) => U, context?: any): Array<U>;
        map<T, U>(obj: any, iterator: (value: T, key: any, obj: any) => U, context?: any): Array<U> {
            return map<T, U>(obj, iterator, context);
        }

        /**
         * Takes in an object and a property to extract from all of the object's values. Returns an array of
         * the 'plucked' values.
         * 
         * @param obj An object.
         * @param key The property to 'pluck' from each value in obj.
         * @return {Array<U>} An array of 'plucked' values from obj.
         */
        pluck<T, U>(obj: any, key: string): Array<U> {
            return map<T, U>(obj, function (value) { return value[key]; });
        }

        /**
         * Takes in an array and an iterator. Evaluates all the values in the array with the iterator.
         * Returns true if any of the iterators return true, otherwise returns false.
         * 
         * @param array An array.
         * @param iterator A method with which to evaluate all the values in obj.
         * @param context An optional context to bind to the iterator.
         * @return {boolean} True if any calls to iterator return true, false otherwise.
         */
        some<T>(array: Array<T>, iterator: (value: T, index: number, obj: any) => boolean, context?: any): boolean;
        /**
         * Takes in an object and an iterator. Evaluates all the values in the object with the iterator.
         * Returns true if any of the iterators return true, otherwise returns false. If the object is Array-like 
         * (e.g. a String), it will be treated as though it is an Array.
         * 
         * @param obj An object.
         * @param iterator A method with which to evaluate all the values in obj.
         * @param context An optional context to bind to the iterator.
         * @return {boolean} True if any calls to iterator return true, false otherwise.
         */
        some<T>(obj: any, iterator: (value: T, key: string, obj: any) => boolean, context?: any): boolean;
        some<T>(obj: any, iterator: (value: T, key: any, obj: any) => boolean, context?: any): boolean {
            return some<T>(obj, iterator, context);
        }

        /**
         * Takes in a method and array of arguments to pass to that method. Delays calling the method until 
         * after the current call stack is clear. Equivalent to a setTimeout with a timeout of 0.
         * 
         * @param method The method to call.
         * @param args The arguments to apply to the method.
         * @param context An optional context to bind to the method.
         * @return {() => void} A function that will clear the timeout when called.
         */
        postpone(method: (...args: any[]) => void, args?: Array<any>, context?: any) {
            return defer(method, 0, args, context);
        }

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
        defer(method: (...args: any[]) => void, timeout: number, args?: Array<any>, context?: any) {
            return defer(method, timeout, args, context);
        }

        /**
         * Takes in a prefix and returns a unique identifier string with the prefix preprended. If no prefix
         * is specified, none will be prepended.
         * 
         * @param prefix A string prefix to prepend tothe unique ID.
         * @return {string} The prefix-prepended unique id.
         */
        uniqueId(prefix?: string) {
            return uniqueId(prefix);
        }

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
        camelCase(str: string) {
            return camelCase(str);
        }
    }

    register.injectable('$utils', Utils);

    export interface IUtils {
        /**
         * An empty method for quickly creating dummy objects.
         */
        noop(): void;

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
        extend(destination: any, ...sources: any[]): any;

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
        deepExtend(destination: any, ...sources: any[]): any;

        /**
         * Takes in anything and determines if it is a type of Object.
         * 
         * @param obj Anything.
         * @return {boolean} True if obj is an object, false otherwise.
         */
        isObject(obj: any): boolean;

        /**
         * Takes in anything and determines if it is a window object.
         * 
         * @param obj Anything.
         * @return {boolean} True if obj is the window, false otherwise.
         */
        isWindow(obj: any): boolean;

        /**
         * Takes in anything and determines if it is a document object.
         * 
         * @param obj Anything.
         * @return {boolean} True if obj is the document, false otherwise.
         */
        isDocument(obj: any): boolean;

        /**
         * Takes in anything and determines if it is a Node.
         * 
         * @param obj Anything.
         * @return {boolean} True if obj is a Node, false otherwise.
         */
        isNode(obj: any): boolean;

        /**
         * Takes in anything and determines if it is a string.
         * 
         * @param obj Anything.
         * @return {boolean} True if obj is a string, false otherwise.
         */
        isString(obj: any): boolean;

        /**
         * Takes in anything and determines if it is a RegExp object.
         * 
         * @param obj Anything.
         * @return {boolean} True if obj is a RegExp object, false otherwise.
         */
        isRegExp(obj: any): boolean;

        /**
         * Takes in anything and determines if it is empty. Useful for
         * checking for empty strings, arrays, or objects without keys.
         * 
         * @param obj Anything.
         * @return {boolean} True if the object isEmpty (or null/undefined), 
         * false otherwise.
         */
        isEmpty(obj: any): boolean;

        /**
         * Takes in anything and determines if it is a boolean.
         * 
         * @param obj Anything.
         * @return {boolean} True if obj is a boolean, false otherwise.
         */
        isBoolean(obj: any): boolean;

        /**
         * Takes in anything and determines if it is a number.
         * 
         * @param obj Anything.
         * @return {boolean} True if obj is a number, false otherwise.
         */
        isNumber(obj: any): boolean;

        /**
         * Takes in anything and determines if it is a function.
         * 
         * @param obj Anything.
         * @return {boolean} True if obj is a function, false otherwise.
         */
        isFunction(obj: any): boolean;

        /**
         * Takes in anything and determines if it is null or undefined.
         * 
         * @param obj Anything.
         * @return {boolean} True if obj is null or undefined, false otherwise.
         */
        isNull(obj: any): boolean;

        /**
         * Takes in anything and determines if it is undefined.
         * 
         * @param obj Anything.
         * @return {boolean} True if obj is undefined, false otherwise.
         */
        isUndefined(obj: any): boolean;

        /**
         * Takes in anything and determines if it is an Array.
         * 
         * @param obj Anything.
         * @return {boolean} True if obj is an Array, false otherwise.
         */
        isArray(obj: any): boolean;

        /**
         * Takes in anything and determines if it has array-like qualities.
         * 
         * @param obj Anything.
         * @return {boolean} True if obj has array-like qualities (i.e. it is an
         * Array, string, arguments, or NodeList), false otherwise.
         */
        isArrayLike(obj: any): boolean;

        /**
         * Takes in an array and a function to evaluate the properties in the array.
         * Returns a filtered array of objects resulting from evaluating the function.
         * 
         * @param array The Array to filter.
         * @param iterator The iterator function to call with array's properties. Returns true if the property
         * should be kept, false otherwise.
         * @param context Optional context with which to call the iterator.
         * @return {Array<T>} An array of objects which evaluated to true with the iterator.
         */
        filter<T>(array: Array<T>, iterator: (value: T, key: any, obj: any) => boolean, context?: any): Array<T>;
        /**
         * Takes in an object/array and a function to evaluate the properties in the object/array.
         * Returns a filtered array of objects resulting from evaluating the function.
         * 
         * @param obj The object to filter.
         * @param iterator The iterator function to call with obj's properties. Returns true if the property
         * should be kept, false otherwise.
         * @param context Optional context with which to call the iterator.
         * @return {Array<T>} An array of objects which evaluated to true with the iterator.
         */
        filter<T>(obj: any, iterator: (value: T, key: any, obj: any) => boolean, context?: any): Array<T>;

        /**
         * Takes in a list and object containing key/value pairs to search for in the list.
         * 
         * @param array The list used for searching for properties.
         * @param properties An object containing key/value pairs to match with obj's values.
         * @return {Array<T>} The matched values in obj.
         * 
         * @example where([{foo: 'foo', bar: 'bar'}, {foo: 'bar', bar: 'foo'}], {foo: 'foo'});
         * //returns [{foo: 'bar', bar: 'bar'}]
         */
        where<T>(array: Array<T>, properties: any): Array<T>;
        /**
         * Takes in a list and object containing key/value pairs to search for on the obj.
         * 
         * @param obj The list used for searching for properties.
         * @param properties An object containing key/value pairs to match with obj's values.
         * @return {Array<T>} The matched values in obj.
         * 
         * @example where([{foo: 'foo', bar: 'bar'}, {foo: 'bar', bar: 'foo'}], {foo: 'foo'});
         * //returns [{foo: 'bar', bar: 'bar'}]
         */
        where<T>(obj: any, properties: any): Array<T>;

        /**
         * Takes in an Array and a function to iterate over. Calls the iterator function with every property
         * in the Array, then returns the object.
         * 
         * @param obj An Array.
         * @param iterator A method that takes in a value, index, and the object.
         * @param context An optional context to bind to the iterator.
         * @return {Array<T>} The array.
         */
        forEach<T>(array: Array<T>, iterator: (value: T, index: number, obj: any) => void, context?: any): Array<T>;
        /**
         * Takes in an object and a function to iterate over. Calls the iterator function with every property
         * in the object, then returns the object. If the object is Array-like (e.g. a String), it will be treated as though 
         * it is an Array.
         * 
         * @param obj An object.
         * @param iterator A method that takes in a value, key, and the object.
         * @param context An optional context to bind to the iterator.
         * @return {IObject<T>} The object.
         */
        forEach<T>(obj: any, iterator: (value: T, key: string, obj: any) => void, context?: any): any;

        /**
         * Takes in an object and an iterator function. Calls the iterator with all the values in the object. The 
         * iterator can transform the object and return it. The returned values will be pushed to an Array and 
         * returned.
         * 
         * @param array An Array.
         * @param iterator The transformation function.
         * @param context An optional context to bind to the iterator.
         * @return {Array<U>} The accumulated transformed values from the iterator.
         */
        map<T, U>(array: Array<T>, iterator: (value: T, index: number, obj: any) => U, context?: any): Array<U>;
        /**
         * Takes in an object and an iterator function. Calls the iterator with all the values in the object. The 
         * iterator can transform the object and return it. The returned values will be pushed to an Array and 
         * returned.
         * 
         * @param obj An object/array.
         * @param iterator The transformation function.
         * @param context An optional context to bind to the iterator.
         * @return {Array<U>} The accumulated transformed values from the iterator.
         */
        map<T, U>(obj: any, iterator: (value: T, key: string, obj: any) => U, context?: any): Array<U>;

        /**
         * Takes in an object and a property to extract from all of the object's values. Returns an array of
         * the 'plucked' values.
         * 
         * @param obj An object.
         * @param key The property to 'pluck' from each value in obj.
         * @return {Array<U>} An array of 'plucked' values from obj.
         */
        pluck<T, U>(obj: any, key: string): Array<U>;

        /**
         * Takes in an array and an iterator. Evaluates all the values in the array with the iterator.
         * Returns true if any of the iterators return true, otherwise returns false.
         * 
         * @param array An array.
         * @param iterator A method with which to evaluate all the values in obj.
         * @param context An optional context to bind to the iterator.
         * @return {boolean} True if any calls to iterator return true, false otherwise.
         */
        some<T>(array: Array<T>, iterator: (value: T, index: number, obj: any) => boolean, context?: any): boolean;
        /**
         * Takes in an object and an iterator. Evaluates all the values in the object with the iterator.
         * Returns true if any of the iterators return true, otherwise returns false. If the object is Array-like 
         * (e.g. a String), it will be treated as though it is an Array.
         * 
         * @param obj An object.
         * @param iterator A method with which to evaluate all the values in obj.
         * @param context An optional context to bind to the iterator.
         * @return {boolean} True if any calls to iterator return true, false otherwise.
         */
        some<T>(obj: any, iterator: (value: T, key: string, obj: any) => boolean, context?: any): boolean;

        /**
         * Takes in a method and array of arguments to pass to that method. Delays calling the method until 
         * after the current call stack is clear. Equivalent to a setTimeout with a timeout of 0.
         * 
         * @param method The method to call.
         * @param args The arguments to apply to the method.
         * @param context An optional context to bind to the method.
         * @return {() => void} A function that will clear the timeout when called.
         */
        postpone(method: (...args: any[]) => void, args?: Array<any>, context?: any): () => void;

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
        defer(method: (...args: any[]) => void, timeout: number, args?: Array<any>, context?: any): () => void;

        /**
         * Takes in a prefix and returns a unique identifier string with the prefix preprended. If no prefix
         * is specified, none will be prepended.
         * 
         * @param prefix A string prefix to prepend tothe unique ID.
         * @return {string} The prefix-prepended unique id.
         */
        uniqueId(prefix?: string): string;

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
        camelCase(str: string): string;
    }

    export function WindowStatic() {
        return window;
    }

    register.injectable('$window', WindowStatic, null, register.injectableType.STATIC);

    export function DocumentStatic(window: Window) {
        return window.document;
    }

    register.injectable('$document', DocumentStatic, ['$window'], register.injectableType.STATIC);

    export module expressions {
        export class Regex implements IRegex {

            /**
             * The regular expression for matching or removing all newline characters.
             */
            get newLineRegex() {
                return /\n|\r/g;
            }

            /**
             * The regular expression for finding markup in a string.
             */
            get markupRegex() {
                return /{{[\S\s]*}}/;
            }

            /**
             * Finds the arguments in a method expression
             * 
             * @example 
             *   // outputs ["('foo', 'bar', 'baz')", "'foo', 'bar', 'baz'"]
             *   exec("myFunction('foo', 'bar', 'baz')");
             */
            get argumentRegex() {
                return /\((.*)\)/;
            }

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
            get aliasRegex() {
                return /[^@\.\[\(]+(?=[\.\[\(])/;
            }

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
            get optionalRouteRegex() {
                return /\((.*?)\)/g;
            }

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
            get namedParameterRouteRegex() {
                return /(\(\?)?:\w+/g;
            }

            /**
             * Finds an alphanumeric wildcard match in a route string.
             * 
             * @example
             *   // outputs ['*bar']
             *   exec('/foo/*bar/baz')
             */
            get wildcardRouteRegex() {
                return /\*\w*/g;
            }

            /**
             * Finds invalid characters in a route string.
             * 
             * @example
             *  // outputs ['?']
             *  exec('/foo/bar?query=baz');
             */
            get escapeRouteRegex() {
                return /[\-{}\[\]+?.,\\\^$|#\s]/g;
            }

            /**
             * Finds '/*.html' or '/*.htm' in a url. Useful for removing 
             * the html file out of the url.
             * 
             * @example
             *   // outputs ['/index.html']
             *   exec('http://localhost:8080/index.html');
             */
            get initialUrlRegex() {
                return /\/[^\/]*\.(?:html|htm)/;
            }

            /**
             * Finds a protocol delimeter in a string (i.e. ://)
             */
            get protocolRegex() {
                return /:\/\//;
            }

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
            get camelCaseRegex() {
                return /([\-_\.\s])(\w+?)/g;
            }

            /**
             * Finds all whitespace and newline characters 
             * not in string literals. Needs to be combined 
             * with string replace function using $1 argument.
             */
            get whiteSpaceRegex() {
                return /("[^"]*?"|'[^']*?')|[\s\r\n\t\v]/g;
            }

            /**
             * Finds all single and double quotes.
             */
            get quotationRegex() {
                return /'|"/g;
            }

            /**
             * Looks for any invalid variable syntax.
             */
            get invalidVariableRegex() {
                return /[^a-zA-Z0-9@_$]/;
            }
        }

        register.injectable('$regex', Regex);

        export interface IRegex {
            /**
             * The regular expression for matching or removing all newline characters.
             */
            newLineRegex: RegExp;

            /**
             * The regular expression for finding markup in a string.
             */
            markupRegex: RegExp;

            /**
             * Finds the arguments in a method expression
             *
             * @example
             *   // outputs ["('foo', 'bar', 'baz')", "'foo', 'bar', 'baz'"]
             *   exec("myFunction('foo', 'bar', 'baz')");
             */
            argumentRegex: RegExp;

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
            aliasRegex: RegExp;

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
            optionalRouteRegex: RegExp;

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
            namedParameterRouteRegex: RegExp;

            /**
             * Finds an alphanumeric wildcard match in a route string.
             *
             * @example
             *   // outputs ['*bar']
             *   exec('/foo/*bar/baz')
             */
            wildcardRouteRegex: RegExp;

            /**
             * Finds invalid characters in a route string.
             *
             * @example
             *  // outputs ['?']
             *  exec('/foo/bar?query=baz');
             */
            escapeRouteRegex: RegExp;

            /**
             * Finds '/*.html' or '/*.htm' in a url. Useful for removing 
             * the html file out of the url.
             * 
             * @example
             *   // outputs ['/index.html']
             *   exec('http://localhost:8080/index.html');
             */
            initialUrlRegex: RegExp;

            /**
             * Finds a protocol delimeter in a string (i.e. ://)
             */
            protocolRegex: RegExp;

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
             *   exec('$CacheStatic')
             *
             * @example
             *   // outputs ['_v', '_', 'v']
             *   exec('plat_var')
             *
             * @example
             *   // outputs [' W', ' ', 'W']
             *   exec('Hello World')
             */
            camelCaseRegex: RegExp;

            /**
             * Finds all whitespace and newline characters 
             * not in string literals. Needs to be combined 
             * with string replace function using $1 argument.
             */
            whiteSpaceRegex: RegExp;

            /**
             * Finds all single and double quotes.
             */
            quotationRegex: RegExp;

            /**
             * Looks for any invalid variable syntax.
             */
            invalidVariableRegex: RegExp;
        }

        /**
         * Responsible for taking a javascript expression string and
         * finding all its tokens (i.e. delimiters, operators, etc).
         */
        export class Tokenizer implements ITokenizer {
            $ExceptionStatic: IExceptionStatic = acquire('$ExceptionStatic');
            _input: string;
            private __previousChar: string = '';
            private __variableRegex = (<expressions.IRegex>acquire('$regex')).invalidVariableRegex;
            private __outputQueue: Array<IToken> = [];
            private __operatorStack: Array<IToken> = [];
            private __argCount: Array<any> = [];
            private __objArgCount: Array<number> = [];
            private __lastColonChar: Array<string> = [];
            private __lastCommaChar: Array<string> = [];

            /**
             * Creates an IToken array for the Tokenizer's input string. 
             * The IToken array contains all the tokens for the input string.
             * 
             * @param input The expression string to tokenize.
             * return {Array<IToken>}
             */
            createTokens(input: string): Array<IToken> {
                if (isNull(input)) {
                    return [];
                }

                this._input = input;

                var char,
                    length = input.length,
                    ternary = 0,
                    ternaryFound = false,
                    isSpace = this._isSpace,
                    isAlphaNumeric = this._isAlphaNumeric;

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
            }

            // ALPHANUMERIC CASE
            private __handleAplhaNumeric(index: number, char: string) {
                var functionArr = [],
                    isNumberLike = this._isNumeric(char);

                functionArr.push(char);

                index = this._lookAhead(index, isNumberLike, functionArr);

                var mergedValue = functionArr.join(''),
                    outputToPush = isNumberLike ? ({ val: Number(mergedValue), args: 0 }) :
                    <IToken>({ val: mergedValue, args: -1 });

                this.__outputQueue.push(outputToPush);

                return index;
            }

            // DELIMITER FUNCTIONS
            private __handlePeriod(index: number, char: string) {
                var functionArr = [],
                    outputQueue = this.__outputQueue,
                    operatorStack = this.__operatorStack,
                    topOutputLength = outputQueue.length - 1,
                    previousChar = this._input[index - 1];

                //if output queue is null OR space or operator or ( or , before .
                if (topOutputLength < 0 ||
                    this._isSpace(previousChar) ||
                    !isNull(OPERATORS[previousChar]) ||
                    previousChar === '(' ||
                    previousChar === ',') {
                    functionArr.push(char);
                    index = this._lookAhead(index, true, functionArr);
                    outputQueue.push({ val: parseFloat(functionArr.join('')), args: 0 });
                } else if (!(isNull(outputQueue[topOutputLength]) ||
                    !isNumber(Number(outputQueue[topOutputLength].val)) ||
                    this._isValEqual(outputQueue[topOutputLength - 1], char))) {
                    functionArr.push(char);
                    index = this._lookAhead(index, true, functionArr);
                    outputQueue[topOutputLength].val += parseFloat(functionArr.join(''));
                } else if (this._isValEqual(operatorStack[0], char)) {
                    outputQueue.push({ val: char, args: 0 });
                } else {
                    operatorStack.unshift({ val: char, args: 0 });
                }

                return index;
            }
            private __handleLeftBrace(char: string) {
                this.__operatorStack.unshift({ val: char, args: 0 });
                this.__objArgCount.push(0);
                this.__lastColonChar.push(char);
                this.__lastCommaChar.push(char);
            }
            private __handleRightBrace(char: string) {
                var operatorStack = this.__operatorStack,
                    topOperator = operatorStack[0],
                    lastArgCount = this.__objArgCount.pop();

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
            }
            private __handleLeftBracket(char: string) {
                var previousChar = this.__previousChar,
                    operatorStack = this.__operatorStack;

                if (this._isValEqual(operatorStack[0], '.')) {
                    this.__outputQueue.push(operatorStack.shift());
                }
                operatorStack.unshift({ val: char, args: 0 });
                this.__argCount.push({
                    num: 0,
                    isArray: !(previousChar === ']' ||
                    previousChar === ')' ||
                    this._isAlphaNumeric(previousChar))
                });
                this.__lastCommaChar.push(char);
            }
            private __handleRightBracket(char: string) {
                var operatorStack = this.__operatorStack,
                    topOperator = operatorStack[0],
                    lastArgCountObj = this.__argCount.pop(),
                    outputQueue = this.__outputQueue,
                    isEmptyArray = (this.__previousChar === '[');

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
            }
            private __handleLeftParenthesis(char: string) {
                var previousChar = this.__previousChar,
                    operatorStack = this.__operatorStack;

                if (this._isAlphaNumeric(previousChar) || previousChar === ']' || previousChar === ')') {
                    var outputQueue = this.__outputQueue,
                        topOutput = outputQueue[outputQueue.length - 1];

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
            }
            private __handleRightParenthesis(char: string) {
                var operatorStack = this.__operatorStack,
                    topOperator = operatorStack[0],
                    localArgCountObj = this.__argCount.pop();

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
            }
            private __handleComma(char: string) {
                var lastCommaArray = this.__lastCommaChar,
                    lastCommaArg = lastCommaArray[lastCommaArray.length - 1];

                if (lastCommaArg === '(' || lastCommaArg === '[') {
                    var argCountArray = this.__argCount,
                        length = argCountArray.length;

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
            }
            private __handleStringLiteral(index: number, char: string) {
                var str = this._lookAheadForDelimiter(char, char, index, true),
                    operatorStack = this.__operatorStack,
                    topOperator = operatorStack[0];

                if (this._isValEqual(topOperator, '([')) {
                    operatorStack.unshift({ val: str.char, args: 0 });
                } else {
                    this.__outputQueue.push({ val: str.char, args: 0 });
                }
                return str.index;
            }

            // OPERATOR FUNCTIONS
            private __handleQuestion(char: string) {
                this.__lastColonChar.push(char);
                this.__determinePrecedence(char);
            }
            private __handleColon(char: string, ternary: number) {
                var lastColonCharArray = this.__lastColonChar,
                    lastColonCharacter = lastColonCharArray[lastColonCharArray.length - 1],
                    outputQueue = this.__outputQueue;

                if (lastColonCharacter === '?') {
                    var operatorStack = this.__operatorStack,
                        topOperator = operatorStack[0];

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
                    var objCountLast = this.__objArgCount.length - 1,
                        outputLength = outputQueue.length;

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
            }
            private __handleOtherOperator(index: number, char: string) {
                var look = this._lookAheadForOperatorFn(char, index);
                this.__determinePrecedence(look.char);

                return look.index;
            }
            private __popRemainingOperators() {
                var outputQueue = this.__outputQueue,
                    operatorStack = this.__operatorStack;

                while (operatorStack.length > 0) {
                    var topOperator = operatorStack.shift();
                    if (topOperator.val === '(' || topOperator.val === ')') {
                        this._throwError('Parentheses mismatch');
                    }
                    outputQueue.push(topOperator);
                }
            }

            // PRIVATE HELPER FUNCTIONS
            private __determineOperator(operator: any) {
                switch (operator) {
                    case '+':
                    case '-':
                        var outputQueue = this.__outputQueue,
                            operatorStack = this.__operatorStack,
                            outputQueueLength = outputQueue.length,
                            operatorStackLength = operatorStack.length,
                            topOutput = outputQueue[outputQueueLength - 1],
                            topOperator = operatorStack[operatorStackLength - 1],
                            topOutputIsOperator = isNull(topOutput) ? false : isOperator(topOutput.val),
                            topOperatorIsOperator = isNull(topOperator) ? false : isOperator(topOperator.val),
                            topOperatorIsNonUnary = topOperatorIsOperator && topOperator.args > 1;

                        if ((outputQueueLength === 0 && operatorStackLength >= 0) ||
                            !(outputQueueLength > 1 || operatorStackLength < 1 || !topOperatorIsNonUnary) ||
                            (topOutputIsOperator && topOperatorIsOperator)) {
                            return OPERATORS['u' + operator];
                        }
                    default:
                        return OPERATORS[operator];
                }
            }
            private __determinePrecedence(operator: any) {
                var determined = false,
                    operatorFn = this.__determineOperator(operator),
                    operatorPrecedence = operatorFn.precedence,
                    operatorAssoc = operatorFn.associativity,
                    operatorStack = this.__operatorStack,
                    outputQueue = this.__outputQueue,
                    operatorObj,
                    firstArrayOperator,
                    firstArrayVal,
                    firstArrayObj;

                while (!determined) {
                    firstArrayObj = operatorStack[0];

                    if (!firstArrayObj) {
                        operatorStack.unshift({ val: operator, args: operatorFn.fn.length - 2 });
                        return;
                    }

                    firstArrayVal = operatorStack[0].val;
                    firstArrayOperator = OPERATORS[firstArrayVal];
                    if (!(isNull(firstArrayOperator) ||
                        !(firstArrayOperator.precedence < operatorPrecedence ||
                        (firstArrayOperator.precedence === operatorPrecedence && operatorAssoc === 'ltr')))) {
                        outputQueue.push(operatorStack.shift());
                    } else {
                        operatorStack.unshift({ val: operator, args: operatorFn.fn.length - 2 });
                        determined = true;
                    }
                }
            }
            private __removeFnFromStack(argCount: number): boolean {
                var outputQueue = this.__outputQueue,
                    operatorStack = this.__operatorStack,
                    topOperator = operatorStack[0],
                    isValEqual = this._isValEqual,
                    isValUnequal = this._isValUnequal,
                    fnToken: IToken,
                    atLeastOne = false;

                while (!isNull(topOperator) &&
                    isValUnequal(topOperator, '([') &&
                    (this._isStringValidVariable(topOperator.val) ||
                    isValEqual(topOperator.val, '[].') ||
                    isAccessor(topOperator.val))) {
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
            }

            // PROTECTED HELPER FUNCTIONS
            _checkType(char: string, isNumberLike: boolean): boolean {
                if (isNumberLike) {
                    return this._isNumeric(char);
                }
                return this._isAlphaNumeric(char);
            }
            _lookAhead(index: number, isNumberLike: boolean, array: Array<string>): number {
                var ch,
                    input = this._input;

                while (++index) {
                    if (this._checkType((ch = input[index]), isNumberLike)) {
                        array.push(ch);
                    } else {
                        break;
                    }
                }
                return index - 1;
            }
            _lookAheadForOperatorFn(char: string, index: number): any {
                var ch,
                    fn,
                    input = this._input;

                while ((++index < input.length) && ch !== '') {
                    ch = input[index],
                    fn = char + ch;

                    if (isOperator(fn)) {
                        char = fn;
                    } else {
                        break;
                    }
                }
                return { char: char, index: index - 1 };
            }
            _lookAheadForDelimiter(char: string, endChar: string, index: number, includeDelimiter?: boolean): any {
                var ch,
                    input = this._input;

                while ((ch = input[++index]) !== endChar) {
                    char += ch;
                }
                if (includeDelimiter) {
                    char = char.substr(1);
                    index++;
                }
                return { char: char, index: index - 1 };
            }
            _popStackForVal(topOperator: any, char: string, error: string) {
                var outputQueue = this.__outputQueue,
                    operatorStack = this.__operatorStack;

                while (topOperator.val !== char) {
                    outputQueue.push(operatorStack.shift());
                    topOperator = operatorStack[0];
                    if (operatorStack.length === 0) {
                        this._throwError(error);
                    }
                }
            }
            _isValEqual(obj: any, char: string): boolean {
                if (isNull(obj)) {
                    return isNull(char);
                }
                return char.indexOf(obj.val) !== -1;
            }
            _isValUnequal(obj: any, char: string): boolean {
                if (isNull(obj)) {
                    return !isNull(char);
                }
                return char.indexOf(obj.val) === -1;
            }
            _resetTokenizer() {
                this.__previousChar = '';
                this.__outputQueue = [];
                this.__operatorStack = [];
                this.__argCount = [];
                this.__objArgCount = [];
                this.__lastColonChar = [];
                this.__lastCommaChar = [];
            }
            _throwError(error: string) {
                this.$ExceptionStatic.fatal(error + ' in {{' + this._input + '}}', this.$ExceptionStatic.PARSE);
            }
            _isNumeric(char: string): boolean {
                return ('0' <= char && char <= '9');
            }
            _isSpace(char: string): boolean {
                return (char === ' ' ||
                    char === '\r' ||
                    char === '\n' ||
                    char === '\t' ||
                    char === '\v' ||
                    char === '\u00A0');
            }
            _isAlpha(char: string): boolean {
                return ('a' <= char && char <= 'z' ||
                    'A' <= char && char <= 'Z' ||
                    '@' === char ||
                    '_' === char ||
                    '$' === char);
            }
            _isAlphaNumeric(char: string): boolean {
                return ('a' <= char && char <= 'z' ||
                    'A' <= char && char <= 'Z' ||
                    '0' <= char && char <= '9' ||
                    '@' === char ||
                    '_' === char ||
                    '$' === char);
            }
            _isStringValidVariable(input: string): boolean {
                return !this.__variableRegex.test(input);
            }
        }

        /**
         * Describes a token in an expression.
         */
        export interface IToken {
            /**
             * The string or number value of the token.
             */
            val: any;

            /**
             * Denotes the type of token, as well as the number
             * of arguments for a function if it is the token.
             * 
             * If -2: Denotes a function name unless indexed into with [].
             * If -1: Denotes a variable or empty array literal.
             * If 0: Denotes a number, keyword, object indexer (.[]), string literal,
             *  function with 0 arguments, ternary expression, or empty object literal
             * If 1: Denotes a function type with 1 argument, a property on an object literal,
             *  an object literal with 1 property, or an array literal with 1 entry.
             * If > 1: Denotes a function type with args arguments, an object literal with
             *  args properties, or an array literal with args entries.
             */
            args: number;
        }

        /**
         * Provides all the necessary detail on how to evaluate a token.
         */
        export interface ITokenDetails {
            /**
             * The precedence that this token takes with respect to the 
             * evaluation order.
             */
            precedence: number;

            /**
             * Whether or not the token associates with the expression on
             * their left or right.
             */
            associativity: string;

            /**
             * A function used to evaluate an operator expression.
             */
            fn: Function;
        }

        /**
         * Describes an object used to find tokens for an expression and create ITokens.
         */
        export interface ITokenizer {
            /**
             * Takes in an expression string and outputs ITokens.
             * 
             * @param input The expression string to tokenize.
             * @return {Array<IToken>}
             */
            createTokens(input: string): Array<IToken>;
        }

        register.injectable('$tokenizer', Tokenizer);

        /**
         * Parses javascript expression strings and creates IParsedExpressions.
         */
        export class Parser implements IParser {
            _tokens: Array<IToken> = [];
            $tokenizer: ITokenizer = acquire('$tokenizer');
            $ExceptionStatic: IExceptionStatic = acquire('$ExceptionStatic');
            private __cache: IObject<IParsedExpression> = {};
            private __codeArray: Array<string> = [];
            private __identifiers: Array<string> = [];
            private __tempIdentifiers: Array<string> = [];
            private __aliases: Array<string> = [];
            private __uniqueAliases: IObject<boolean> = {};

            /**
             * Parses a string representation of a javascript expression and turns it
             * into an IParsedExpression.
             * 
             * @param input The string representation of a javascript expression.
             * @return {IParsedExpression}
             */
            parse(input: string): IParsedExpression {
                var parsedObject = this.__cache[input];
                if (!isNull(parsedObject)) {
                    return parsedObject;
                }
                this._tokens = this.$tokenizer.createTokens(input);

                parsedObject = this._evaluate(input);

                var identifiers = parsedObject.identifiers;
                if (identifiers.length === 0) {
                    var noModel = parsedObject.evaluate(null);
                    parsedObject.evaluate = function evaluateNoContext() { return noModel; };
                }

                this.__cache[input] = parsedObject;

                return parsedObject;
            }
            _evaluate(input: string): IParsedExpression {
                var tokens = this._tokens,
                    length = tokens.length,
                    tempIdentifiers = this.__tempIdentifiers,
                    codeArray = this.__codeArray,
                    codeStr = '',
                    useLocalContext = false;

                for (var i = 0; i < length; i++) {
                    var tokenObj = tokens[i],
                        token = tokenObj.val,
                        args = tokenObj.args;

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

                var parsedExpression: IParsedExpression = {
                    evaluate: <(context: any, aliases?: any) => any>new Function('context', 'aliases',
                        'var initialContext;' +
                        'return ' + (codeArray.length === 0 ? ('"' + input + '"') : codeArray.join('')) + ';'),
                    expression: input,
                    identifiers: this.__identifiers.slice(0),
                    aliases: this.__aliases.slice(0)
                };

                // reset parser's properties
                this._resetParser();

                return parsedExpression;
            }

            // PARSE CASES
            private __convertPrimitive(index: number, token: string, args: number) {
                var tokens = this._tokens,
                    tempIdentifiers = this.__tempIdentifiers;

                if (args > 0) {
                    tempIdentifiers.push('.');
                    return token;
                } else {
                    var castToken = Number(token),
                        castTokenIsNumberLike = isNumber(castToken),
                        peek1 = this._peek(index),
                        isPeekIndexer = peek1 && peek1.args < 1;

                    if (isKeyword(token) ||
                        (isString(token) &&
                        (castTokenIsNumberLike ||
                        this._isValUnequal(peek1, '[]()') ||
                        (this._isValEqual(peek1, '[]') &&
                        !isPeekIndexer)))) {
                        tempIdentifiers.push('.');
                        return '"' + token + '"';
                    } else {
                        if (!castTokenIsNumberLike ||
                            (this._isValEqual(peek1, '[].') &&
                            isPeekIndexer)) {
                            tempIdentifiers.push(token);
                        } else {
                            tempIdentifiers.push('.');
                        }
                        return token;
                    }
                }
            }
            private __convertFunction(index: number, token: string, useLocalContext: boolean) {
                var tokens = this._tokens,
                    tempIdentifiers = this.__tempIdentifiers,
                    nextChar = this._peek(index);

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
            }
            private __convertObject(args: number) {
                var identifiers = this.__identifiers,
                    tempIdentifiers = this.__tempIdentifiers,
                    codeArray = this.__codeArray,
                    j = 0,
                    indexer,
                    codeStr = '{',
                    tempIdentifier,
                    contextFnString = '(' + this.__findInitialContext.toString() + ')(context,aliases,"';

                var temp;
                while (j++ < args) {
                    temp = codeArray.pop();
                    indexer = codeArray.pop();
                    codeStr += ',"' + indexer + '":' + temp;

                    if (tempIdentifiers.length > 0) {
                        tempIdentifier = tempIdentifiers.pop();
                        // the identifier could have the context fn prepended to it so need to check for equality
                        if (tempIdentifier === temp ||
                            (contextFnString + tempIdentifier + '")') === temp ||
                            ('(initialContext = ' + contextFnString + tempIdentifier + '"))') === temp) {
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
            }
            private __convertArrayLiteral(args: number) {
                var identifiers = this.__identifiers,
                    tempIdentifiers = this.__tempIdentifiers,
                    codeArray = this.__codeArray,
                    j = 0,
                    tempStr = '',
                    codeStr = '[',
                    tempIdentifier;

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
            }

            // ACCESSORS
            private __handleFunction(index: number, args: number, useLocalContext: boolean) {
                var tokens = this._tokens,
                    identifiers = this.__identifiers,
                    tempIdentifiers = this.__tempIdentifiers,
                    codeArray = this.__codeArray,
                    j = 0,
                    previousToken = tokens[index - 1],
                    previousTokenIsFnName = (previousToken.args === -2),
                    grabFnName = previousTokenIsFnName || this._isValEqual(previousToken, '[].'),
                    tempStr = '',
                    tempIdentifier,
                    fnName = '',
                    identifierFnName = '',
                    codeStr,
                    pushedIdentifier = false;

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
                        } else if (!(identifierFnName === '' ||
                            !pushedIdentifier ||
                            context[0] === '[' ||
                            context[context.length - 1] === ']')) {
                            identifiers[identifiers.length - 1] += '.' + identifierFnName;
                        }

                        if (isEmpty(fnName)) {
                            codeStr = context + codeStr;
                        } else {
                            codeStr = '((' + this.__indexIntoContext.toString() + ')(' + context + ',"' +
                            fnName + '") || (function () {}))' + codeStr;
                        }
                    } else {
                        this._throwError('Improper expression or context');
                    }
                } else {
                    if (grabFnName) {
                        codeStr = '(initialContext = (' + this.__findInitialContext.toString() + ')(context,aliases,"' +
                        fnName + '") || (function () {}))' + codeStr;

                        identifiers.push(fnName);
                    } else {
                        codeStr = codeArray.pop() + codeStr;
                    }
                }
                codeArray.push(codeStr);

                var peek = this._peek(index),
                    length = tempIdentifiers.length;
                if (this._isValEqual(peek, '[]') && length > 0) {
                    var lastIdentifier = tempIdentifiers[length - 1];
                    if (lastIdentifier !== '.') {
                        identifiers.push(tempIdentifiers.pop());
                    }
                }

                return useLocalContext;
            }
            private __indexIntoObject(index: number, useLocalContext: boolean) {
                var tokens = this._tokens,
                    identifiers = this.__identifiers,
                    tempIdentifiers = this.__tempIdentifiers,
                    codeArray = this.__codeArray,
                    nextChar = this._peek(index);

                if (this._isValEqual(nextChar, '()')) {
                    return true;
                }

                var codeStr = codeArray.pop(),
                    previousToken = tokens[index - 1],
                    indexer,
                    identifierIndexer = tempIdentifiers.pop(),
                    context = codeArray.pop();

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
            }

            // OPERATORS
            private __handleQuestion() {
                var identifiers = this.__identifiers,
                    tempIdentifiers = this.__tempIdentifiers,
                    codeArray = this.__codeArray,
                    temp = codeArray.pop(),
                    codeStr = codeArray.pop() + '?' + temp,
                    tempIdentifier;

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
            }
            private __handleColon() {
                var identifiers = this.__identifiers,
                    tempIdentifiers = this.__tempIdentifiers,
                    codeArray = this.__codeArray,
                    temp = codeArray.pop(),
                    codeStr = codeArray.pop() + ':' + temp,
                    tempIdentifier;

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
            }
            private __handleOperator(token: string, args: number) {
                var identifiers = this.__identifiers,
                    tempIdentifiers = this.__tempIdentifiers,
                    codeArray = this.__codeArray,
                    j = 0,
                    tempStr = '',
                    codeStr = '(' + OPERATORS[token].fn.toString() + ')(context, aliases,',
                    tempIdentifier;

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
            }

            // PRIVATE HELPER FUNCTIONS
            private __findInitialContext(context: any, aliases: any, token: string, undefined?: any) {
                if (token[0] === '@' && aliases !== null && typeof aliases === 'object') {
                    return aliases[token];
                } else if (context !== null && typeof context === 'object') {
                    return context[token];
                }
                return context === null ? null : undefined;
            }
            private __indexIntoContext(context: any, token: string, undefined?: any) {
                if (context !== null && typeof context === 'object') {
                    return context[token];
                }
                return context === null ? null : undefined;
            }

            // PROTECTED HELPER FUNCTIONS
            _peek(index: number) {
                return this._tokens[index + 1];
            }
            _popRemainingIdentifiers() {
                var identifiers = this.__identifiers,
                    tempIdentifiers = this.__tempIdentifiers,
                    last;

                while (tempIdentifiers.length > 0) {
                    last = tempIdentifiers.pop();
                    if (last !== '.') {
                        identifiers.push(last);
                    }
                }
            }
            _makeIdentifiersUnique() {
                var identifiers = this.__identifiers,
                    uniqueIdentifiers = [],
                    uniqueIdentifierObject = {},
                    identifier;

                while (identifiers.length > 0) {
                    identifier = identifiers.pop();
                    if (isNull(uniqueIdentifierObject[identifier])) {
                        uniqueIdentifierObject[identifier] = true;
                        uniqueIdentifiers.push(identifier);
                    }
                }

                this.__identifiers = uniqueIdentifiers;
            }
            _isValEqual(obj: any, char: string): boolean {
                if (isNull(obj)) {
                    return isNull(char);
                }
                return char.indexOf(obj.val) !== -1;
            }
            _isValUnequal(obj: any, char: string): boolean {
                if (isNull(obj)) {
                    return !isNull(char);
                }
                return char.indexOf(obj.val) === -1;
            }
            _resetParser() {
                this._tokens = [];
                this.__codeArray = [];
                this.__identifiers = [];
                this.__tempIdentifiers = [];
                this.__aliases = [];
                this.__uniqueAliases = {};
            }
            _throwError(error: string) {
                this.$ExceptionStatic.fatal(error, this.$ExceptionStatic.PARSE);
            }
        }

        register.injectable('$parser', Parser);

        /**
         * Describes an object that is the result of parsing an expression string. Provides a
         * way to evaluate the expression with a context.
         */
        export interface IParsedExpression {
            /**
             * A method for evaluating an expression with a context.
             * 
             * @param context The primary context for evaluation.
             * @param aliases An object containing resource alias values. All keys must begin with '@'.
             */
            evaluate(context: any, aliases?: any): any;

            /**
             * The original expression string.
             */
            expression: string;

            /**
             * Contains all the identifiers found in an expression.  Useful for determining
             * properties to watch on a context.
             */
            identifiers: Array<string>;

            /**
             * Contains all the aliases (denoted by an identifier with '@' as the first character) for this IParsedExpression.
             */
            aliases: Array<string>;

            /**
             * Specifies whether or not you want to do a one-time binding on identifiers 
             * for this expression. Typically this is added to a clone of the IParsedExpression.
             */
            oneTime?: boolean;
        }

        /**
         * Describes an object that can parse an expression string and turn it into an
         * IParsedExpression.
         */
        export interface IParser {
            /**
             * Takes in an expression string and outputs an IParsedExpression.
             * 
             * @param input An expression string to parse.
             */
            parse(expression: string): IParsedExpression;
        }
    }
    export module web {
        /**
         * Todo
         */
        export class Browser implements IBrowser {
            uid: string;
            $EventManagerStatic: events.IEventManagerStatic = acquire('$EventManagerStatic');
            $compat: ICompat = acquire('$compat');
            $config: IBrowserConfig = acquire('$browser.config');
            $regex: expressions.IRegex = acquire('$regex');
            $window: Window = acquire('$window');
            private __currentUrl: string;
            private __lastUrl = this.$window.location.href;
            private __initializing = false;
            constructor() {
                this.uid = uniqueId('plat_');
                this.$EventManagerStatic.on(this.uid, 'beforeLoad', this.initialize, this);
            }

            /**
             * Todo
             */
            url(url?: string, replace?: boolean) {
                var location = this.$window.location,
                    history = this.$window.history;

                if (isString(url) && this.__lastUrl !== url) {
                    this.__lastUrl = url;
                    var newUrl = this._setUrl(url, replace);
                } else {
                    return this.__currentUrl || location.href;
                }
            }

            /**
             * Todo
             */
            urlUtils(url?: string) {
                url = url || this.url();

                var utils: IUrlUtils = acquire('$urlUtils'),
                    config = this.$config;

                if (config.routingType === config.routeType.HASH) {
                    url = url.replace(new RegExp('#' + (config.hashPrefix || '') + '/?'), '');
                }

                utils.initialize(url);

                return utils;
            }

            /**
             * Checks to see if the requested URL is cross domain.
             */
            isCrossDomain(url: string) {
                if (!isString(url)) {
                    return false;
                }

                var urlUtils = this.urlUtils(url),
                    locationUtils = this.urlUtils();

                // check for protocol:host:port mismatch
                return urlUtils.protocol !== locationUtils.protocol ||
                    urlUtils.hostname !== locationUtils.hostname ||
                    urlUtils.port !== locationUtils.port;
            }

            /**
             * Todo
             */
            initialize() {
                var config = this.$config,
                    compat = this.$compat;

                this.$EventManagerStatic.dispose(this.uid);

                if (config.routingType === config.routeType.NONE) {
                    return;
                }

                this.__initializing = true;

                var changed = this._urlChanged.bind(this);

                var url = this.url(),
                    trimmedUrl = url.replace(this.$regex.initialUrlRegex, '/');

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
            }

            _getBaseUrl(url: string) {
                var colon = url.substring(url.indexOf(':')),
                    next = colon.substring(colon.search(/\w+/));
                
                return url.substring(0, url.indexOf('/', url.indexOf(next))) + '/';
            }

            /**
             * Todo
             */
            _urlChanged(url?: string) {
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

                manager.dispatch('urlChanged',
                    this,
                    manager.direction.DIRECT,
                    [this.urlUtils()]);
            }

            /**
             * Todo
             */
            _setUrl(url: string, replace?: boolean) {
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
            }

            /**
             * Todo
             */
            _formatUrl(url: string) {
                var config = this.$config;
                if (config.routingType === config.routeType.HASH) {
                    var hasProtocol = url.indexOf(this.urlUtils().protocol) !== -1,
                        prefix = this.$config.hashPrefix || '',
                        hashRegex = new RegExp('#' + prefix + '|#/');

                    if (hasProtocol && !hashRegex.test(url)) {
                        url = url + '#' + prefix + '/';
                    } else if (!hashRegex.test(url)) {
                        url = '#' + prefix + '/' + url;
                    }
                }

                return url;
            }
        }

        register.injectable('$browser', Browser);

        export class UrlUtils implements IUrlUtils {
            private static __urlUtilsElement: HTMLAnchorElement;
            private static __getQuery(search: string) {
                if (isEmpty(search)) {
                    return <IObject<string>>{};
                }

                var split = search.split('&'),
                    query: IObject<string> = {},
                    length = split.length,
                    item,
                    define = (<observable.IContextManagerStatic>acquire('$ContextManagerStatic')).defineGetter;

                for (var i = 0; i < length; ++i) {
                    item = split[i].split('=');

                    define(query, item[0], item[1]);
                }

                return query;
            }
            href: string;
            protocol: string;
            host: string;
            hostname: string;
            port: string;
            pathname: string;
            search: string;
            hash: string;
            username: string;
            password: string;
            origin: string;
            query: IObject<string>;
            $ContextManagerStatic: observable.IContextManagerStatic = acquire('$ContextManagerStatic');
            $document: Document = acquire('$document');
            $compat: ICompat = acquire('$compat');
            $config: IBrowserConfig = acquire('$browser.config');

            /**
             * Todo
             */
            initialize(url: string) {
                url = url || '';

                var element = UrlUtils.__urlUtilsElement ||
                    (UrlUtils.__urlUtilsElement = this.$document.createElement('a')),
                    define = this.$ContextManagerStatic.defineGetter;

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
                    path = (element.pathname.charAt(0) === '/')
                        ? element.pathname
                        : '/' + element.pathname;
                }

                define(this, 'pathname', path, true, true);
                define(this, 'query', UrlUtils.__getQuery(this.search), true, true);
            }

            /**
             * Todo
             */
            toString() {
                return this.href;
            }
        }

        register.injectable('$urlUtils', UrlUtils, null, register.injectableType.MULTI);

        export interface IUrlUtils {
            href: string;
            protocol: string;
            host: string;
            hostname: string;
            port: string;
            pathname: string;
            search: string;
            hash: string;
            username?: string;
            password?: string;
            origin?: string;
            query?: IObject<string>;
            initialize(url: string);
            toString(): string;
        }

        export interface IBrowser {
            /**
             * Checks to see if the requested URL is cross domain.
             */
            isCrossDomain(url: string): boolean;
            initialize(): void;
            url(url?: string, replace?: boolean): string;
            urlUtils(url?: string): IUrlUtils;
        }

        /**
         * Specifies configuration properties for the Browser 
         * injectable.
         */
        export class BrowserConfig implements IBrowserConfig {
            /**
             * Contains the constants for use with routingType.
             */
            routeType: IRouteType = {
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
            routingType = this.routeType.NONE;

            /**
             * If routingType is set to 'hash', this value will be 
             * appended to the '#' at the beginning of every route. The 
             * default prefix is '', meaning each path will be '#/<path>'.
             */
            hashPrefix = '';

            /**
             * Specifies the base url used to normalize url routing.
             */
            baseUrl = '';
        }

        register.injectable('$browser.config', BrowserConfig);

        /**
         * Contains the constants for use with routingType.
         */
        export interface IRouteType {
            /**
             * Specifies that the application will not be doing 
             * url-based routing.
             */
            NONE: string;

            /**
             * Specifies that the application wants to use hash-based 
             * routing.
             */
            HASH: string;

            /**
             * Specifies that the application wants to use the HTML5 
             * popstate method for managing routing. If the browser 
             * does not support HTML5 popstate events, hash routing 
             * will be used instead.
             * 
             * Note: In 'state' mode, the web server must be configured to 
             * route every url to the root url.
             */
            STATE: string;
        }

        /**
         * Specifies configuration properties for the Browser 
         * injectable.
         */
        export interface IBrowserConfig {
            /**
             * Contains the constants for use with routingType.
             */
            routeType: IRouteType;

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
            routingType: string;

            /**
             * If routingType is set to 'hash', this value will be 
             * appended to the '#' at the beginning of every route. The 
             * default prefix is '!', meaning each path will be '#!/<path>'.
             */
            hashPrefix: string;

            /**
             * Specifies the base url used to normalize url routing.
             */
            baseUrl: string;
        }

        class Router implements IRouter {
            uid = uniqueId('plat_');
            _routes: Array<IRouteMatcher> = [];
            _removeListener: IRemoveListener;
            _defaultRoute: IMatchedRoute;
            _baseRoute: IMatchedRoute;
            $browser: IBrowser = acquire('$browser');
            $browserConfig: IBrowserConfig = acquire('$browser.config');
            $EventManagerStatic: events.IEventManagerStatic = acquire('$EventManagerStatic');
            $NavigationEventStatic: events.INavigationEventStatic = acquire('$NavigationEventStatic');
            $compat: ICompat = acquire('$compat');
            $ExceptionStatic: IExceptionStatic = acquire('$ExceptionStatic');
            $regex: expressions.IRegex = acquire('$regex');
            $window: Window = acquire('$window');
            private __escapeRegex = this.$regex.escapeRouteRegex;
            private __optionalRegex = this.$regex.optionalRouteRegex;
            private __firstRoute = true;
            private __history: Array<string>;
            constructor() {
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
            registerRoutes(type: string, routes: Array<any>) {
                if (!isArray(routes)) {
                    return;
                }

                var injector = viewControlInjectors[type],
                    length = routes.length;

                for (var i = 0; i < length; ++i) {
                    this._registerRoute(routes[i], injector, type);
                }
            }

            /**
             * Formats a url path given the parameters and query string, then changes the 
             * url to that path.
             */
            route(path: string, options?: IRouteNavigationOptions) {
                options = options || <IRouteNavigationOptions>{};

                var replace = options.replace,
                    route: string,
                    match: IMatchedRoute,
                    currentUtils = this.$browser.urlUtils();

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
            }

            goBack(length?: number) {
                this.$window.history.go(-length);

                if (this.__history && this.__history.length > 1) {
                    var historyLength = this.__history.length;
                    this.__history = this.__history.slice(0, historyLength - length);
                    this.$browser.url(this.__history.pop() || '');
                }
            }

            _buildRoute(routeParameter: string, query: IObject<string>) {
                var queryStr = this._buildQueryString(query);

                if (!isString(routeParameter)) {
                    return;
                }

                var route = routeParameter + queryStr,
                    utils = this.$browser.urlUtils(route),
                    match = this._match(utils);

                if (isNull(match)) {
                    return;
                }

                return {
                    route: route,
                    match: match
                };
            }

            _buildQueryString(query: IObject<string>) {
                var queryStr: Array<string> = [];

                if (!isObject(query)) {
                    return queryStr.join();
                }

                var keys = Object.keys(query),
                    length = keys.length,
                    key: string;

                for (var i = 0; i < length; ++i) {
                    key = keys[i];

                    queryStr.push(key + '=' + query[key]);
                }

                return '?' + queryStr.join('&');
            }

            _routeChanged(ev: events.IDispatchEvent, utils: web.IUrlUtils) {
                var matchedRoute = this._match(utils);

                if (isNull(matchedRoute)) {
                    this.$ExceptionStatic.warn('Could not match route: ' + utils.pathname,
                        this.$ExceptionStatic.NAVIGATION);
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
            }

            _registerRoute(route: any, injector: dependency.IInjector<ui.IViewControl>, type: string) {
                var regexp = isRegExp(route),
                    routeParameters: IRouteMatcher;

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
            }

            _getRouteParameters(route: string): IRouteMatcher {
                var regex = this.$regex,
                    namedRegex = regex.namedParameterRouteRegex,
                    escapeRegex = this.__escapeRegex,
                    optionalRegex = this.__optionalRegex,
                    wildcardRegex = regex.wildcardRouteRegex,
                    regexArgs = route.match(namedRegex),
                    wildcard = wildcardRegex.exec(route),
                    args = [];

                route = route.replace(escapeRegex, '\\$')
                    .replace(optionalRegex, '(?:$1)?')
                    .replace(namedRegex, function (match, optional) {
                        return optional ? match : '([^/?]+)';
                    })
                    .replace(wildcardRegex, '([^?]*?)');

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
            }

            _match(utils: web.IUrlUtils): IMatchedRoute {
                var routes = this._routes,
                    url = this._getUrlFragment(utils),
                    route: IRouteMatcher,
                    exec: RegExpExecArray,
                    args: Array<string>,
                    routeParams = {},
                    path: string,
                    argsLength,
                    length = routes.length;

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
            }

            _getUrlFragment(utils: web.IUrlUtils) {
                return this._trimSlashes(utils.pathname);
            }

            _trimSlashes(fragment: string) {
                return fragment.replace(/\/$/, '').replace(/^\//, '');
            }
        }

        register.injectable('$router', Router);

        /**
         * Options that you can submit to the router in order
         * to customize navigation.
         */
        export interface IRouteNavigationOptions extends navigation.IBaseNavigationOptions {
            query?: IObject<string>;
        }

        /**
         * Used by the navigator for matching a route with 
         * a view control injector.
         */
        export interface IRouteMatcher {
            /**
             * The view control injector.
             */
            injector?: dependency.IInjector<ui.IViewControl>;

            /**
             * The type of IViewControl
             */
            type?: string;

            /**
             * A regular expression to match with the url.
             */
            regex: RegExp;

            /**
             * Route arguments used to create IRouteParameters 
             * in the event of a url match.
             */
            args: Array<string>;
        }

        /**
         * Extends IRoute to provide a control injector that matches 
         * the given IRoute.
         */
        export interface IMatchedRoute {
            /**
             * The associated view control injector for the route.
             */
            injector: dependency.IInjector<ui.IViewControl>;

            /**
             * The type of IViewControl
             */
            type: string;

            /**
             * The route associated with the injector
             */
            route?: IRoute<any>;
        }

        /**
         * Contains the parsed properties of a url.
         */
        export interface IRoute<T extends {}> {
            /**
             * The defined parameters that were matched with the route. 
             * When a route is registered, the registrant can specify named 
             * route parameters. Those parameters will appear in this object 
             * as key/value pairs.
             */
            parameters: T;

            /**
             * This property will always exist and will be equal to the full
             * route for navigation (only the path from root, not including 
             * the query string).
             */
            path: string;

            /**
             * An object containing query string key/value pairs.
             */
            query?: IObject<string>;
        }

        export interface IRouter {
            /**
             * Registers route strings/RegExp and associates them with a control type.
             * 
             * @param type The control type with which to associate the routes.
             * @param routes An array of strings or RegExp expressions to associate with 
             * the control type.
             */
            registerRoutes(type: string, routes: Array<any>);

            /**
             * Formats a url path given the parameters and query string, then changes the 
             * url to that path.
             */
            route(path: string, options?: web.IRouteNavigationOptions): void;

            /**
             * Navigates back in the history.
             */
            goBack(length?: number): void;
        }
    }
    export module async {
        /**
         * Adopted from the ES6 promise polyfill: https://github.com/jakearchibald/es6-promise
         * 
         * Takes in 2 generic types corresponding to the fullfilled success and error types. 
         * The error type (U) should extend Error in order to get proper stack tracing.
         */
        export class Promise<T, U extends Error> implements IPromise<T, U> {
            private __subscribers: Array<any>;
            private __state: State;
            private __detail: any;

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
            static all<T, U extends Error>(promises: Array<any>): IPromise<T, U> {
                if (!isArray(promises)) {
                    throw new TypeError('You must pass an array to all.');
                }

                return new Promise<T, U>(function (resolve, reject) {
                    var results = [], remaining = promises.length,
                        promise;

                    if (remaining === 0) {
                        resolve(<any>[]);
                    }

                    function resolver(index) {
                        return function (value) {
                            resolveAll(index, value);
                        };
                    }

                    function resolveAll(index, value) {
                        results[index] = value;
                        if (--remaining === 0) {
                            resolve(<any>results);
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
            }

            /**
             * Creates a promise that fulfills to the passed in object. If the 
             * passed-in object is a promise it returns the promise.
             * 
             * @param object The object to cast to a Promise.
             */
            static cast<T, U extends Error>(object: T): IPromise<T, U> {
                if (isObject(object) && (<any>object).constructor === Promise) {
                    return <Promise<T, U>>(<any>object);
                }

                return new Promise<T, U>(function (resolve) {
                    resolve(object);
                });
            }

            /**
             * Returns a promise that fulfills as soon as any of the promises fulfill,
             * or rejects as soon as any of the promises reject (whichever happens first).
             * 
             * @param promises An Array of promises to 'race'.
             * @return {Promise<T, U>} A promise that fulfills/rejects when the first promise
             * in promises fulfills/rejects.
             */
            static race<T, U extends Error>(promises: Array<IPromise<T, U>>): IPromise<T, U> {
                if (!isArray(promises)) {
                    throw new TypeError('You must pass an array to race.');
                }

                return new Promise<T, U>(function (resolve, reject) {
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
            }

            /**
             * Returns a promise that resolves with the input value.
             * 
             * @param value The value to resolve.
             * @return {Promise<T, any>} A promise that resolves with value.
             */
            static resolve<T>(value: T): IPromise<T, any> {
                return new Promise<T, any>(function (resolve: (value: T) => any, reject: (reason: any) => any) {
                    resolve(value);
                });
            }

            /**
             * Returns a promise that rejects with the input value.
             * 
             * @param value The value to reject.
             * @return {Promise<void, U>} A promise that rejects with value.
             */
            static reject<U extends Error>(reason: U): IPromise<void, U> {
                return new Promise<void, U>(function (resolve: (value: any) => any, reject: (reason: U) => any) {
                    reject(reason);
                });
            }

            /**
             * An ES6 implementation of Promise. Useful for asynchronous programming.
             * 
             * @param resolveFunction A IResolveFunction for fulfilling/rejecting the Promise.
             */
            constructor(resolveFunction: IResolveFunction<T, U>) {
                if (!isFunction(resolveFunction)) {
                    throw new TypeError('You must pass a resolver function as the first argument to the promise constructor');
                }

                if (!(this instanceof Promise)) {
                    throw new TypeError('Failed to construct "Promise": ' +
                        'Please use the "new" operator, this object constructor cannot be called as a function.');
                }

                this.__subscribers = [];

                invokeResolveFunction<T, U>(resolveFunction, this);
            }

            /**
             * Takes in two methods, called when/if the promise fulfills/rejects.
             * 
             * @param onFulfilled A method called when/if the promise fulills. If undefined the next
             * onFulfilled method in the promise chain will be called.
             * @param onRejected A method called when/if the promise rejects. If undefined the next
             * onRejected method in the promise chain will be called.
             * @return {Promise<T, U>} A Promise used for method chaining.
             */
            then<TResult, TError>(onFulfilled: (success: T) => TResult, onRejected?: (error: U) => TError): IPromise<T, U> {
                var promise = this;

                var thenPromise = <IPromise<T, U>>new (<any>this).constructor(() => { }, this);

                if (this.__state) {
                    var callbacks = arguments;
                    config.async(function invokePromiseCallback() {
                        invokeCallback(promise.__state, thenPromise, callbacks[promise.__state - 1], promise.__detail);
                    });
                } else {
                    subscribe(this, thenPromise, onFulfilled, onRejected);
                }

                return thenPromise;
            }

            /**
             * A wrapper method for Promise.then(undefined, onRejected);
             * 
             * @param onRejected A method called when/if the promise rejects. If undefined the next
             * onRejected method in the promise chain will be called.
             * @return {Promise<T, U>} A Promise used for method chaining.
             */
            catch<TError>(onRejected: (error: U) => TError) {
                return this.then(null, onRejected);
            }
        }

        /**
         * Describes a function passed into the constructor for a Promise. The function allows you to
         * resolve/reject the Promise.
         */
        export interface IResolveFunction<T, U extends Error> {
            /**
             * A function which allows you to resolve/reject a Promise.
             * 
             * @param resolve A method for resolving a Promise. If you pass in a 'thenable' argument 
             * (meaning if you pass in a Promise-like object), then the promise will resolve with the 
             * outcome of the object. Else the promise will resolve with the argument.
             * @param reject A method for rejecting a promise. The argument should be an instancof Error
             * to assist with debugging. If a method in the constructor for a Promise throws an error, 
             * the promise will reject with the error.
             */
            (resolve: (value?: T) => void, reject: (reason?: U) => void): void
        }

        /**
         * Describes an object that implements the ES6 Promise API
         */
        export interface IPromise<T, U extends Error> {
            /**
             * Takes in two methods, called when/if the promise fulfills/rejects.
             * 
             * @param onFulfilled A method called when/if the promise fulills. If undefined the next
             * onFulfilled method in the promise chain will be called.
             * @param onRejected A method called when/if the promise rejects. If undefined the next
             * onRejected method in the promise chain will be called.
             * @return {IPromise<T, U>} An IPromise used for method chaining.
             */
            then<TResult, TError>(onFulfilled: (success: T) => TResult, onRejected?: (error: U) => TError): IPromise<T, U>;

            /**
             * A wrapper method for Promise.then(undefined, onRejected);
             * 
             * @param onRejected A method called when/if the promise rejects. If undefined the next
             * onRejected method in the promise chain will be called.
             * @return {IPromise<T, U>} An IPromise used for method chaining.
             */
            catch<TError>(onRejected: (error: U) => TError): IPromise<T, U>;
        }

        var browserGlobal: any = (typeof window !== 'undefined') ? window : {};
        var BrowserMutationObserver = browserGlobal.MutationObserver || browserGlobal.WebKitMutationObserver;

        // node
        function useNextTick() {
            return function processNextTick() {
                process.nextTick(flush);
            };
        }

        function useMutationObserver() {
            var observer = new BrowserMutationObserver(flush),
                $document = acquire('$document'),
                $window = acquire('$window'),
                element = $document.createElement('div');

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
            var global: any = global;
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

        var process: any = process,
            scheduleFlush;

        // Decide what async method to use to triggering processing of queued callbacks:
        if (typeof process !== 'undefined' && {}.toString.call(process) === '[object process]') {
            scheduleFlush = useNextTick();
        } else if (BrowserMutationObserver) {
            scheduleFlush = useMutationObserver();
        } else {
            scheduleFlush = useSetTimeout();
        }

        var config: any = {
            instrument: false,
            async: function (callback: (response: any) => any, arg: any) {
                var length = queue.push([callback, arg]);
                if (length === 1) {
                    // If length is 1, that means that we need to schedule an async flush.
                    // If additional callbacks are queued before the queue is flushed, they
                    // will be processed by this flush that we are scheduling.
                    scheduleFlush();
                }
            }
        },
            counter = 0;

        function configure(name: string, value: any) {
            if (arguments.length === 2) {
                config[name] = value;
            } else {
                return config[name];
            }
        }

        enum State {
            PENDING = <any>(void 0),
            SEALED = 0,
            FULFILLED = 1,
            REJECTED = 2
        };

        function invokeResolveFunction<T, U extends Error>(resolveFunction: IResolveFunction<T, U>,
            promise: IPromise<T, U>) {
            function resolvePromise(value?: any) {
                resolve(promise, value);
            }

            function rejectPromise(reason?: any) {
                reject(promise, reason);
            }

            try {
                resolveFunction(resolvePromise, rejectPromise);
            } catch (e) {
                rejectPromise(e);
            }
        }

        function invokeCallback(settled: State, promise: any, callback: (response: any) => void, detail) {
            var hasCallback = isFunction(callback),
                value, error, succeeded, failed;

            if (hasCallback) {
                try {
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

            if (handleThenable<any, any>(promise, value)) {
                return;
            } else if (hasCallback && succeeded) {
                resolve<any, any>(promise, value);
            } else if (failed) {
                reject<any>(promise, error);
            } else if (settled === State.FULFILLED) {
                resolve<any, any>(promise, value);
            } else if (settled === State.REJECTED) {
                reject<any>(promise, value);
            }
        }

        function subscribe(parent, child: IPromise<any, any>,
            onFulfilled: (success: any) => any, onRejected?: (error: any) => any) {
            var subscribers = parent.__subscribers;
            var length = subscribers.length;

            subscribers[length] = child;
            subscribers[length + State.FULFILLED] = onFulfilled;
            subscribers[length + State.REJECTED] = onRejected;
        }

        function publish(promise, settled) {
            var subscribers = promise.__subscribers,
                detail = promise.__detail,
                child, callback;

            for (var i = 0; i < subscribers.length; i += 3) {
                child = subscribers[i];
                callback = subscribers[i + settled];

                invokeCallback(settled, child, callback, detail);
            }

            promise.__subscribers = null;
        }

        function handleThenable<T, U extends Error>(promise: IPromise<any, any>, value: IPromise<any, any>) {
            var then = null,
                resolved;

            try {
                if (promise === value) {
                    throw new TypeError('A promises callback cannot return that same promise.');
                }

                if (isObject(value) || isFunction(value)) {
                    then = value.then;

                    if (isFunction(then)) {
                        then.call(value, function (val) {
                            if (resolved) { return true; }
                            resolved = true;

                            if (value !== val) {
                                resolve<T, U>(promise, val);
                            } else {
                                fulfill<T>(promise, val);
                            }
                        }, function (val) {
                                if (resolved) { return true; }
                                resolved = true;

                                reject<U>(promise, val);
                            });

                        return true;
                    }
                }
            } catch (error) {
                if (resolved) { return true; }
                reject<U>(promise, error);
                return true;
            }

            return false;
        }

        function resolve<T, U extends Error>(promise: IPromise<T, U>, value: any) {
            if (promise === value) {
                fulfill(promise, value);
            } else if (!handleThenable<T, U>(promise, value)) {
                fulfill(promise, value);
            }
        }

        function fulfill<T>(promise: any, value: any) {
            if (promise.__state !== State.PENDING) { return; }
            promise.__state = State.SEALED;
            promise.__detail = value;

            config.async(publishFulfillment, promise);
        }

        function reject<U>(promise: any, reason: any) {
            if (promise.__state !== State.PENDING) { return; }
            promise.__state = State.SEALED;
            promise.__detail = reason;

            config.async(publishRejection, promise);
        }

        function publishFulfillment(promise: any) {
            publish(promise, promise.__state = State.FULFILLED);
        }

        function publishRejection(promise: any) {
            publish(promise, promise.__state = State.REJECTED);
        }

        /**
         * The injectable reference for the ES6 Promise implementation.
         */
        export interface IPromiseStatic {
            /**
             * An ES6 implementation of the Promise API. Useful for asynchronous programming.
             * Takes in 2 generic types corresponding to the fullfilled success and error types. 
             * The error type (U) should extend Error in order to get proper stack tracing.
             * 
             * @param resolveFunction A IResolveFunction for fulfilling/rejecting the Promise.
             */
            new <T, U extends Error>(resolveFunction: IResolveFunction<T, U>): IPromise<T, U>;

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
            all<T, U extends Error>(promises: Array<any>): IPromise<T, U>;

            /**
             * Creates a promise that fulfills to the passed in object. If the
             * passed-in object is a promise it returns the promise.
             *
             * @param object The object to cast to a Promise.
             * @return {Promise<T, U>}
             */
            cast<T, U extends Error>(object: T): IPromise<T, U>;

            /**
             * Returns a promise that fulfills as soon as any of the promises fulfill,
             * or rejects as soon as any of the promises reject (whichever happens first).
             * 
             * @param promises An Array of promises to 'race'.
             * @return {Promise<T, U>} A promise that fulfills/rejects when the first promise
             * in promises fulfills/rejects.
             */
            race<T, U extends Error>(promises: Array<IPromise<T, U>>): IPromise<T, U>;

            /**
             * Returns a promise that resolves with the input value.
             * 
             * @param value The value to resolve.
             * @return {Promise<T, any>} A promise that resolves with value.
             */
            resolve<T>(value: T): IPromise<T, any>;

            /**
             * Returns a promise that rejects with the input value.
             * 
             * @param value The value to reject.
             * @return {Promise<void, U>} A promise that rejects with value.
             */
            reject<U extends Error>(reason: U): IPromise<void, U>;
        }

        export function PromiseStatic() {
            return Promise;
        }

        register.injectable('$PromiseStatic', PromiseStatic, null, register.injectableType.STATIC);

        /**
         * HttpRequest provides a wrapper for the XmlHttpRequest object. Allows for
         * sending AJAX requests to a server. This class does not support 
         * synchronous requests.
         */
        class HttpRequest implements IHttpRequest {
            /**
             * The timeout ID associated with the specified timeout
             */
            clearTimeout: () => void;
            /**
             * The created XMLHttpRequest
             */
            xhr: XMLHttpRequest;
            /**
             * The JSONP callback name
             */
            jsonpCallback: string;
            /**
             * The plat.IBrowser injectable instance
             */
            $browser: web.IBrowser = acquire('$browser');
            /**
             * The injectable instance of type Window
             */
            $window: Window = acquire('$window');
            /**
             * The injectable instance of type Document
             */
            $document: Document = acquire('$document');

            /**
             * The configuration for an HTTP Request
             */
            $config: IHttpConfigStatic = acquire('$http.config');

            private __options: IHttpConfigStatic;

            /**
             * @param options The IAjaxOptions used to customize this Http.
             */
            constructor(options?: IHttpConfigStatic) {
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
            execute(): IAjaxPromise {
                var options = this.__options,
                    url = options.url;

                if (!isString(url) || isEmpty(url.trim())) {
                    return this._invalidOptions();
                }

                options.url = this.$browser.urlUtils(url).toString();

                var isCrossDomain = options.isCrossDomain || false,
                    xDomain = false,
                    xhr;

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
            }

            /**
             * Adds the script tag and processes the callback for the JSONP and returns a 
             * Promise. The Promise is fulfilled or rejected when the JSONP callback is called.
             *
             * @return {Promise<IAjaxResponse>} A promise that fulfills with the 
             * JSONP callback and rejects if there is a problem.
             */
            executeJsonp(): IAjaxPromise {
                var options = this.__options,
                    url = options.url;

                if (!isString(url) || isEmpty(url.trim())) {
                    return this._invalidOptions();
                }

                options.url = this.$browser.urlUtils(url).toString();

                return new AjaxPromise((resolve, reject) => {
                    var scriptTag = this.$document.createElement('script'),
                        jsonpCallback = this.jsonpCallback || uniqueId('plat_callback'),
                        jsonpIdentifier = options.jsonpIdentifier || 'callback';

                    scriptTag.src = url + '?' + jsonpIdentifier + '=' + jsonpCallback;

                    var oldValue = this.$window[jsonpCallback];
                    this.$window[jsonpCallback] = (response: any) => {
                        //clean up
                        if (isFunction(this.clearTimeout)) {
                            this.clearTimeout();
                        }

                        this.$document.head.removeChild(scriptTag);
                        if (!isUndefined(oldValue)) {
                            this.$window[jsonpCallback] = oldValue;
                        } else {
                            delete this.$window[jsonpCallback];
                        }

                        //call callback
                        resolve({
                            response: response,
                            status: 200 // OK
                        });
                    };

                    this.$document.head.appendChild(scriptTag);

                    var timeout = options.timeout;
                    if (isNumber(timeout) && timeout > 0) {
                        // We first postpone to avoid always timing out when debugging, though this is not
                        // a foolproof method.
                        this.clearTimeout = postpone(() => {
                            this.clearTimeout = defer(() => {
                                reject(new AjaxError({
                                    response: 'Request timed out in ' + timeout + 'ms for ' + url,
                                    status: 408 // Request Timeout
                                }));
                                this.$window[jsonpCallback] = noop;
                            }, timeout - 1);
                        });
                    }
                }, { __http: this });
            }

            /**
             * A wrapper for the XMLHttpRequest's onReadyStateChanged callback.
             *
             * @param {XMLHttpRequest} The associated XMLHttpRequest
             * @return {bool} Waits for the readyState to be complete and then 
             * return true in the case of a success and false in the case of 
             * an error.
             */
            _xhrOnReadyStateChange(xhr: XMLHttpRequest) {
                if (xhr.readyState === 4) {
                    var status = xhr.status,
                        response = xhr.response || xhr.responseText;

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
            }

            /**
             * The function that initializes and sends the XMLHttpRequest.
             *
             * @param {XMLHttpRequest} The associated XMLHttpRequest
             * @return {Promise<IAjaxResponse>} A promise that fulfills with the 
             * formatted IAjaxResponse and rejects if there is a problem with an 
             * IAjaxError.
             */
            _sendXhrRequest(xhr: XMLHttpRequest): IAjaxPromise {
                var options = this.__options,
                    method = options.method,
                    url = options.url;

                return new AjaxPromise((resolve, reject) => {
                    xhr.onreadystatechange = () => {
                        var success = this._xhrOnReadyStateChange(xhr);

                        if (isNull(success)) {
                            return;
                        }

                        var response = this._formatResponse(xhr);

                        if (success) {
                            resolve(response);
                        } else {
                            reject(new AjaxError(response));
                        }
                    };

                    if (!isString(method)) {
                        var Exception: IExceptionStatic = acquire('$ExceptionStatic');
                        Exception.warn('AjaxOptions method was not of type string. Defaulting to "GET".', Exception.AJAX);
                        method = 'GET';
                    }

                    xhr.open(
                        method.toUpperCase(),
                        url,
                        true, // synchronous XHR not supported
                        options.user,
                        options.password
                        );

                    xhr.responseType = options.responseType;
                    xhr.withCredentials = options.withCredentials;

                    var headers = options.headers,
                        keys = Object.keys(isObject(headers) ? headers : {}),
                        length = keys.length,
                        key;

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
                        this.clearTimeout = postpone(() => {
                            this.clearTimeout = defer(() => {
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
            }
        
            /**
             * Returns a promise that is immediately rejected due to an error.
             *
             * @return {Promise<IAjaxResponse>} A promise that immediately rejects 
             * with an IAjaxError
             */
            _invalidOptions(): IAjaxPromise {
                return new AjaxPromise((resolve, reject) => {
                    var exceptionFactory: IExceptionStatic = acquire('$ExceptionStatic');
                    exceptionFactory.warn('Attempting a request without specifying a url', exceptionFactory.AJAX);
                    reject(new AjaxError({
                        response: 'Attempting a request without specifying a url',
                        status: null,
                        getAllResponseHeaders: null,
                        xhr: null
                    }));
                });
            }
        
            /**
             * The function that formats the response from the XMLHttpRequest
             *
             * @param {XMLHttpRequest} The associated XMLHttpRequest
             * @param {bool} Signifies if the response was a success
             * @return {IAjaxResponse} The IAjaxResponse to be returned to 
             * the requester.
             */
            _formatResponse(xhr: XMLHttpRequest, success?: boolean): IAjaxResponse {
                var status = xhr.status,
                    response = xhr.response || xhr.responseText;

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
                    try {
                        response = JSON.parse(response);
                    } catch (e) { }
                }

                return {
                    response: response,
                    status: status,
                    getAllResponseHeaders: xhr.getAllResponseHeaders,
                    xhr: xhr
                };
            }
        }

        /**
         * Describes an object that provides a wrapper for either the XmlHttpRequest object 
         * or a JSONP callback. Allows for sending AJAX requests to a server.
         */
        export interface IHttpRequest {
            /**
             * Performs either the XmlHttpRequest or the JSONP callback and returns an AjaxPromise. 
             * The Promise is fulfilled or rejected when either the XmlHttpRequest returns or the 
             * JSONP callback is fired.
             *
             * @return {IAjaxPromise} A promise that fulfills/rejects
             * when either the XmlHttpRequest returns (Response statuses >= 200 and < 300 are a success.
             * Other response statuses are failures) or the JSONP callback is fired.
             */
            execute(): IAjaxPromise;

            /**
             * Adds the script tag and processes the callback for the JSONP. The AjaxPromise from 
             * the ajax or jsonp call is fulfilled or rejected when the JSONP callback is called.
             *
             * @return {IAjaxPromise} A promise that fulfills with the 
             * JSONP callback and rejects if there is a problem.
             */
            executeJsonp(): IAjaxPromise;
        }

        /**
         * Describes an object which contains Ajax configuration properties.
         */
        export interface IHttpConfigStatic {
            /**
             * The url for either the XmlHttpRequest or the JSONP callback 
             * (without the ?{callback}={callback_name} parameter in the url)
             */
            url: string;

            /**
             * The HTTP method type of XmlHttpRequest such as 'GET', 'POST', 'PUT', 
             * 'DELETE', etc. Ignored for non-HTTP urls. Defaults to 'GET'.
             */
            method?: string;

            /**
             * The number of milliseconds a request can take before 
             * automatically being terminated. A value of 0 
             * means there is no timeout. 
             */
            timeout?: number;

            /**
             * An optional user string for the XmlHttpRequest
             */
            user?: string;

            /**
             * An optional password string for the XmlHttpRequest
             */
            password?: string;

            /**
             * The XMLHttpRequestResponseType. The response should 
             * still be checked when received due to browser 
             * incompatibilities. If a browser does not support a 
             * response type it will return the value as a string. 
             * The response type does not affect JSONP callback 
             * arguments.
             * 
             * @see utilties.XMLHttpRequestResponseType
             */
            responseType?: string;

            /**
             * The Content-Type header for XMLHttpRequest when 
             * data is being sent. The default is 
             * 'application/x-www-form-urlencoded; charset=UTF-8'.
             */
            contentType?: string;

            /**
             * A key/value pair object where the key is a DOMString header key
             * and the value is the DOMString header value.
             */
            headers?: any;

            /**
             * Indicates whether or not cross-site Access-Control requests 
             * should be made using credentials such as cookies or 
             * authorization headers. The default is false.
             */
            withCredentials?: boolean;

            /**
             * The request payload
             */
            data?: string;

            /**
             * Forces a JSONP, cross-domain request when set to true.
             * The default is false.
             */
            isCrossDomain?: boolean;

            /**
             * The identifier the server uses to get the name of the JSONP
             * callback. The default is 'callback' as seen in 
             * http://www.platyfi.com/data?callback=plat_fnName.
             */
            jsonpIdentifier?: string;

            /**
             * A specified name for the JSONP callback (in case the server has 
             * it hardcoded and/or does not get it from the given url). The 
             * default is a unique plat id generated separately for 
             * each JSONP callback seen as 'plat_callback00' in
             * http://www.platyfi.com/data?callback=plat_callback00.
             */
            jsonpCallback?: string;
        }

        /**
         * Describes an object which contains JSONP configuration properties.
         */
        export interface IJsonpConfig {
            /**
             * The url for the JSONP callback 
             * (without the ?{callback}={callback_name} parameter in the url)
             */
            url: string;

            /**
             * The identifier the server uses to get the name of the JSONP
             * callback. The default is 'callback' as seen in 
             * http://www.platyfi.com/data?callback=plat_fnName.
             */
            jsonpIdentifier?: string;

            /**
             * A specified name for the JSONP callback (in case the server has 
             * it hardcoded and/or does not get it from the given url). The 
             * default is a unique plat id generated separately for 
             * each JSONP callback seen as 'plat_callback00' in
             * http://www.platyfi.com/data?callback=plat_callback00.
             */
            jsonpCallback?: string;
        }

        /**
         * Describes an object that is the response to an AJAX request.
         */
        export interface IAjaxResponse {
            /**
             * The AJAX response or responseText. The response should 
             * be checked when received due to browser 
             * incompatibilities with responseType. If a browser does 
             * not support a response type it will return the value as 
             * a string.
             */
            response: any;
            /**
             * The XHR status. Resolves as 200 for JSONP.
             */
            status: number;

            /**
             * A method for getting the XHR response headers.
             */
            getAllResponseHeaders?: () => string;

            /**
             * The XMLHttpRequest object associated with the AJAX call
             */
            xhr?: XMLHttpRequest;
        }

        /**
         * Describes the AjaxPromise's resolve function
         */
        export interface IAjaxResolveFunction {
            (resolve: (value?: IAjaxResponse) => any, reject: (reason?: IAjaxError) => any): void;
        }

        /**
         * A class that forms an Error object with an IAjaxResponse.
         */
        class AjaxError implements IAjaxError {
            name: string = 'AjaxError';
            message: string;
            response: any;
            status: number;
            getAllResponseHeaders: () => string;
            xhr: XMLHttpRequest;
            constructor(response: IAjaxResponse) {
                Error.apply(this);
                this.response = this.message = response.response;
                this.status = response.status;
                this.getAllResponseHeaders = response.getAllResponseHeaders;
                this.xhr = response.xhr;
            }
            toString() {
                var response = this.response,
                    responseText = response;

                if (isObject(response) && !response.hasOwnProperty('toString')) {
                    responseText = JSON.stringify(response);
                }

                return 'Request failed with status: ' + this.status + ' and response: ' + responseText;
            }
        }

        // Have to bypass TS flags in order to properly extend Error
        (<any>AjaxError)['prototype'] = Error.prototype;

        /**
         * Describes an object that forms an Error object with an IAjaxResponse.
         */
        export interface IAjaxError extends Error, IAjaxResponse { }

        /**
         * Describes a type of Promise that fulfills with an IAjaxResponse and can be optionally canceled.
         */
        class AjaxPromise extends Promise<IAjaxResponse, IAjaxError>
            implements IAjaxPromise {
            $window: Window = acquire('$window');
            private __http: HttpRequest;
            constructor(resolveFunction: IAjaxResolveFunction, promise?: any) {
                super(resolveFunction);
                if (!isNull(promise)) {
                    this.__http = promise.__http;
                }
            }

            /**
             * A method to cancel the AJAX call associated with this AjaxPromise.
             */
            cancel() {
                var http = this.__http,
                    xhr = http.xhr,
                    jsonpCallback = http.jsonpCallback;

                if (isFunction(http.clearTimeout)) {
                    http.clearTimeout();
                }

                if (!isNull(xhr)) {
                    xhr.onreadystatechange = null;
                    xhr.abort();
                } else if (!isNull(jsonpCallback)) {
                    this.$window[jsonpCallback] = noop;
                }

                (<any>this).__subscribers = [];
            }

            /**
             * Takes in two methods, called when/if the promise fulfills/rejects.
             * 
             * @param onFulfilled A method called when/if the promise fulills. If undefined the next
             * onFulfilled method in the promise chain will be called.
             * @param onRejected A method called when/if the promise rejects. If undefined the next
             * onRejected method in the promise chain will be called.
             * @return {AjaxPromise} A Promise used for method chaining.
             */
            then<TResult, TError>(onFulfilled: (success: IAjaxResponse) => TResult,
                onRejected?: (error: IAjaxError) => TError) {
                return <AjaxPromise>super.then<TResult, TError>(onFulfilled, onRejected);
            }
        }

        /**
         * Describes a type of IPromise that fulfills with an IAjaxResponse and can be optionally canceled.
         */
        export interface IAjaxPromise extends IPromise<IAjaxResponse, IAjaxError> {
            /**
             * A method to cancel the AJAX call associated with this AjaxPromise.
             */
            cancel(): void;

            /**
             * Inherited from IPromise
             */
            then<TResult, TError>(onFulfilled: (success: IAjaxResponse) => TResult,
                onRejected?: (error: IAjaxError) => TError): IAjaxPromise;
        }

        /**
         * Describes an object that provides value mappings for
         * XMLHttpRequestResponseTypes
         */
        export interface IHttpResponseType {
            /**
             * The default response type (empty string)
             */
            DEFAULT: string;

            /**
             * The arrayBuffer type ('arrayBuffer')
             */
            ARRAYBUFFER: string;

            /**
             * The blob type ('blob')
             */
            BLOB: string;

            /**
             * The document type ('document')
             */
            DOCUMENT: string;

            /**
             * The json type ('json')
             */
            JSON: string;

            /**
             * The text type ('text')
             */
            TEXT: string;
        }

        /**
         * Describes the interface for the Ajax injectable for making both 
         * XMLHttpRequests and JSONP requests.
         */
        export interface IHttp {
            /**
             * Describes an object that provides value mappings for
             * XMLHttpRequestResponseTypes
             */
            responseType: IHttpResponseType;

            /**
             * A wrapper method for the Http class that creates and executes a new Http with
             * the specified IAjaxOptions. This function will check if 
             * XMLHttpRequest level 2 is present, and will default to JSONP if it isn't and 
             * the request is cross-domain.
             * 
             * @param options The IAjaxOptions for either the XMLHttpRequest 
             * or the JSONP callback.
             * @return {AjaxPromise} A promise, when fulfilled
             * or rejected, will return an IAjaxResponse object.
             */
            ajax(options: IHttpConfigStatic): IAjaxPromise;

            /**
             * A direct method to force a cross-domain JSONP request.
             * 
             * @param options The IJsonpOptions 
             * @return {AjaxPromise} A promise, when fulfilled
             * or rejected, will return an IAjaxResponse object.
             */
            jsonp? (options: IJsonpConfig): IAjaxPromise;

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
            json? (options: IHttpConfigStatic): IAjaxPromise;
        }

        /**
         * The instantiated class of the injectable for making 
         * AJAX requests.
         */
        export class Http implements IHttp {
            /**
             * Default Http config
             */
            static config: IHttpConfigStatic = {
                url: null,
                method: 'GET',
                responseType: '',
                headers: {},
                withCredentials: false,
                timeout: null,
                jsonpIdentifier: 'callback',
                contentType: 'application/x-www-form-urlencoded; charset=UTF-8;'
            };

            /**
             * HttpResponseType mapping
             */
            responseType: IHttpResponseType = {
                DEFAULT: '',
                ARRAYBUFFER: 'arraybuffer',
                BLOB: 'blob',
                DOCUMENT: 'document',
                JSON: 'json',
                TEXT: 'text'
            };

            /**
             * A wrapper method for the Http class that creates and executes a new Http with
             * the specified IAjaxOptions. This function will check if 
             * XMLHttpRequest level 2 is present, and will default to JSONP if it isn't and 
             * the request is cross-domain.
             * 
             * @param options The IAjaxOptions for either the XMLHttpRequest 
             * or the JSONP callback.
             */
            ajax(options: IHttpConfigStatic): IAjaxPromise {
                return new HttpRequest(options).execute();
            }

            /**
             * A direct method to force a cross-domain JSONP request.
             * 
             * @param options The IJsonpOptions 
             */
            jsonp(options: IJsonpConfig): IAjaxPromise {
                return new HttpRequest(options).executeJsonp();
            }

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
            json(options: IHttpConfigStatic): IAjaxPromise {
                return new HttpRequest(extend({}, options, { responseType: 'json' })).execute();
            }
        }

        register.injectable('$http', Http);

        export function HttpConfigStatic() {
            return Http.config;
        }

        register.injectable('$http.config', HttpConfigStatic, null, register.injectableType.STATIC);
    }
    export module storage {
        var caches: IObject<Cache<any>> = {};
        var internalCaches: any = {};

        /**
         * A Cache class, for use with the CacheFactory. Used for storing objects.
         * Takes in a generic type corresponding to the type of objects it contains.
         * 
         */
        export class Cache<T> implements ICache<T> {
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
            static create<T>(id: string, options?: ICacheOptions) {
                var cache: ICache<T> = caches[id];

                if (cache === null || cache === undefined) {
                    cache = caches[id] = new Cache<T>(id, options);
                }

                return cache;
            }

            /**
             * Gets a cache out of the CacheFactory if it exists.
             * 
             * @param id The identifier used to search for the cache.
             * 
             * @returns {Cache|null}
             */
            static fetch(id: string) {
                return caches[id];
            }

            /**
             * Clears the CacheFactory and all of its caches.
             */
            static clear() {
                var keys = Object.keys(caches),
                    length = keys.length;

                for (var i = 0; i < length; ++i) {
                    caches[keys[i]].clear();
                }

                caches = <IObject<Cache<any>>>{};
            }

            private __size: number;
            private __id: string;
            private __options: ICacheOptions;

            /**
             * @param id The id to use to retrieve the cache from the CacheFactory.
             * @param options The ICacheOptions for customizing the cache.
             */
            constructor(id: string, options?: ICacheOptions) {
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
             * Method for accessing information about the cache.
             * 
             * @return {ICacheInfo}
             */
            info() {
                return {
                    id: this.__id,
                    size: this.__size,
                    options: this.__options
                };
            }

            /**
             * Method for inserting an object into the cache.
             * 
             * @param key The key to use for storage/retrieval of the object.
             * @param value The value to store with the associated key.
             * 
             * @return {T} The value inserted into the cache.
             */
            put(key: string, value: T) {
                var val = internalCaches[this.__id][key];
                internalCaches[this.__id][key] = value;

                if (isUndefined(val)) {
                    this.__size++;
                }

                var timeout = this.__options.timeout;

                if (isNumber(timeout) && timeout > 0) {
                    defer(<(key?: string) => void>this.remove, timeout, [key], this);
                }

                return value;
            }

            /**
             * Method for retrieving an object from the cache.
             * 
             * @param key The key to search for in the cache.
             * 
             * @return {T|null} The value found at the associated key. Returns null for a cache miss.
             */
            read(key: string) {
                return <T>internalCaches[this.__id][key];
            }

            /**
             * Method for removing an object from the cache.
             * 
             * @param key The key to remove from the cache.
             */
            remove(key: string) {
                internalCaches[this.__id][key] = null;
                delete internalCaches[this.__id][key];
                this.__size--;
            }

            /**
             * Method for clearing the cache, removing all of its keys.
             */
            clear() {
                internalCaches[this.__id] = {};
                this.__size = 0;
            }

            /**
             * Method for removing a cache from the CacheFactory.
             */
            dispose() {
                this.clear();
                caches[this.__id] = null;
                delete caches[this.__id];
            }
        }

        export function CacheStatic() {
            return Cache;
        }

        register.injectable('$CacheStatic', CacheStatic, null, register.injectableType.STATIC);

        var managerCache = Cache.create<processing.INodeManager>('managerCache');

        export function ManagerCacheStatic() {
            return managerCache;
        }

        register.injectable('$ManagerCacheStatic', ManagerCacheStatic, null, register.injectableType.STATIC);

        /**
         * Options for a cache
         */
        export interface ICacheOptions {
            /**
             * Specifies a timeout for a cache value. When a value 
             * is put in the cache, it will be valid for the given
             * period of time (in milliseconds). After the timeout 
             * is reached, the value will automatically be removed
             * from the cache.
             */
            timeout?: number;
        }

        /**
         * Contains information about an ICache
         */
        export interface ICacheInfo {
            /**
             * A unique id for the ICache object, used to 
             * retrieve the ICache out of an ICacheFactory.
             */
            id: string;

            /**
             * Represents the number of items in the ICache.
             */
            size: number;

            /**
             * Represents the ICacheOptions that the ICache is
             * using.
             */
            options: ICacheOptions;
        }

        /**
         * The ICache interface describing a cache. Takes in a generic type
         * corresponding to the type of objects stored in the cache.
         */
        export interface ICache<T> {
            /**
             * Method for accessing information about an ICache.
             * 
             * @return {ICacheInfo}
             */
            info(): ICacheInfo;

            /**
             * Method for inserting an object into an ICache.
             * 
             * @param key The key to use for storage/retrieval of the object.
             * @param value The value to store with the associated key.
             * 
             * @return {T} The value inserted into an ICache.
             */
            put(key: string, value: T): T;

            /**
             * Method for retrieving an object from an ICache.
             * 
             * @param key The key to search for in an ICache.
             * 
             * @return {T|null} The value found at the associated key. Returns null for an ICache miss.
             */
            read(key: string): T;

            /**
             * Method for removing an object from an ICache.
             * 
             * @param key The key to remove from an ICache.
             */
            remove(key: string): void;

            /**
             * Method for clearing an ICache, removing all of its keys.
             */
            clear(): void;

            /**
             * Method for removing an ICache from the CacheFactory.
             */
            dispose(): void;
        }
        /**
         * Interface for a CacheFactory. CacheFactories are used to manage all 
         * the caches for the application.
         */
        export interface ICacheStatic {
            /**
             * Method for creating a new ICache. Takes a generic type to denote the
             * type of objects stored in the new ICache.  If the ICache already exists
             * in the ICacheFactory, a new ICache will not be created.
             * 
             * @param id The id of the new ICache.
             * @param options ICacheOptions for customizing the ICache.
             * 
             * @return {ICache} The newly created ICache object.
             */
            create<T>(id: string, options?: ICacheOptions): ICache<T>;

            /**
             * Gets a cache out of the ICacheFactory if it exists.
             * 
             * @param id The identifier used to search for the cache.
             * 
             * @returns {ICache|null}
             */
            fetch<T>(id: string): ICache<T>;

            /**
             * Clears the ICacheFactory and all of its caches.
             */
            clear(): void;
        }

        /**
         * Used for caching compiled nodes. This class will
         * clone a template when you put it in the cache. It will
         * also clone the template when you retrieve it.
         */
        class TemplateCache extends Cache<any> {
            $ExceptionStatic: IExceptionStatic = acquire('$ExceptionStatic');
            constructor() {
                super('__templateCache');
            }

            /**
             * Takes in a Node or a Promise. If the value is a 
             * Node, the node will be cloned and put into the cache.
             * 
             * @param key The key used to store the value.
             * @param value The template promise or Node.
             */
            put(key: string, value: any) {
                super.put(key, value);

                if (isNode(value)) {
                    value = value.cloneNode(true);
                }

                return value;
            }

            /**
             * Method for retrieving a Node from a TemplateCache. If a Node 
             * is found in the cache, it will be cloned.
             * 
             * @param key The key to search for in a TemplateCache.
             * 
             * @return {T|async.IPromise<T, Error>} The value found at the associated key. 
             * Returns null for an ITemplateCache miss.
             */
            read(key: string) {
                var template: any = super.read(key);

                if (isNull(template)) {
                    return template;
                } else if (isNode(template)) {
                    return template.cloneNode(true);
                }

                return template.then((node: Node) => {
                    return this.put(key, node).cloneNode(true);
                }).catch((error) => {
                    this.$ExceptionStatic.warn('Error retrieving template from promise.', this.$ExceptionStatic.TEMPLATE);
                });
            }
        }
    
        register.injectable('$templateCache', TemplateCache);

        /**
         * Interface for TemplateCache, used to manage all templates. Returns a unique template 
         * for every ready, to avoid having to call cloneNode.
         */
        export interface ITemplateCache {
            /**
             * Takes in a Node or a Promise. If the value is a 
             * Node, the node will be cloned and put into the cache.
             * 
             * @param key The key used to store the value.
             * @param value The template promise or Node.
             */
            put(key: string, value: any): any;
            /**
             * Method for retrieving a Node from an ITemplateCache. The returned Node will be 
             * cloned to avoid manipulating the cached template.
             * 
             * @param key The key to search for in an ITemplateCache.
             * 
             * @return {Node|async.IPromise<T, Error>} The value found at the associated key. 
             * Returns null for an ITemplateCache miss.
             */
            read(key: string): any;
        }

        export class BaseStorage {
            constructor() {
                forEach((<Storage>(<any>this).storage), function (value, key) {
                    this[key] = value;
                }, this);
            }

            /**
             * Returns the number of items in storage.
             */
            get length() {
                return (<Storage>(<any>this).storage).length;
            }

            /**
             * Clears storage, deleting all of its keys.
             */
            clear() {
                (<Storage>(<any>this).storage).clear();
            }

            /**
             * Gets an item out of local storage with the assigned key.
             * 
             * @param key The key of the item to retrieve from storage.
             * @return {T} The item retrieved from storage.
             */
            getItem(key: string) {
                return (<Storage>(<any>this).storage).getItem(key);
            }

            /**
             * Allows for iterating over storage keys with an index. When
             * called with an index, it will return the key at that index in 
             * storage.
             * 
             * @param index The index used to retrieve the associated key.
             * @return {string} The key at the given index.
             */
            key(index: number) {
                return (<Storage>(<any>this).storage).key(index);
            }

            /**
             * Searches in this.storage for an item and removes it if it 
             * exists.
             * 
             * @param key the Key of the item to remove from this.storage.
             */
            removeItem(key: string) {
                (<Storage>(<any>this).storage).removeItem(key);
            }

            /**
             * Adds data to storage with the designated key.
             * 
             * @param key The key of the item to store in storage.
             * @param data The data to store in storage with the key.
             */
            setItem(key: string, data: any) {
                (<Storage>(<any>this).storage).setItem(key, data);
                this[key] = this.getItem(key);
            }
        }

        export class LocalStorage extends BaseStorage implements ILocalStorage {
            private storage: Storage = acquire('$window').localStorage;
        }

        register.injectable('$localStorage', LocalStorage);

        /**
         * Describes an object used to wrap local storage into an injectable.
         */
        export interface ILocalStorage {
            /**
             * Returns the number of items in localStorage.
             */
            length: number;

            /**
             * Clears localStorage, deleting all of its keys.
             */
            clear(): void;

            /**
             * Gets an item out of local storage with the assigned key.
             * 
             * @param key The key of the item to retrieve from localStorage.
             * @return {any} The item retrieved from localStorage.
             */
            getItem(key: string): any;

            /**
             * Allows for iterating over localStorage keys with an index. When
             * called with an index, it will return the key at that index in 
             * localStorage.
             * 
             * @param index The index used to retrieve the associated key.
             * @return {string} The key at the given index.
             */
            key(index: number): string;

            /**
             * Searches in localStorage for an item and removes it if it 
             * exists.
             * 
             * @param key the Key of the item to remove from localStorage.
             */
            removeItem(key: string): void;

            /**
             * Adds data to localStorage with the designated key.
             * 
             * @param key The key of the item to store in localStorage.
             * @param data The data to store in localStorage with the key.
             */
            setItem(key: string, data: any): void;
        }

        export class SessionStorage extends BaseStorage implements ISessionStorage {
            private storage: Storage = acquire('$window').sessionStorage;
        }

        register.injectable('$sessionStorage', SessionStorage);

        /**
         * Describes an object used to wrap session storage into an injectable.
         */
        export interface ISessionStorage {
            /**
             * Returns the number of items in sessionStorage.
             */
            length: number;

            /**
             * Clears sessionStorage, deleting all of its keys.
             */
            clear(): void;

            /**
             * Gets an item out of session storage with the assigned key.
             * 
             * @param key The key of the item to retrieve from sessionStorage.
             * @return {any} The item retrieved from sessionStorage.
             */
            getItem(key: string): any;

            /**
             * Allows for iterating over sessionStorage keys with an index. When
             * called with an index, it will return the key at that index in 
             * sessionStorage.
             * 
             * @param index The index used to retrieve the associated key.
             * @return {string} The key at the given index.
             */
            key(index: number): string;

            /**
             * Searches in sessionStorage for an item and removes it if it 
             * exists.
             * 
             * @param key the Key of the item to remove from sessionStorage.
             */
            removeItem(key: string): void;

            /**
             * Adds data to sessionStorage with the designated key.
             * 
             * @param key The key of the item to store in sessionStorage.
             * @param data The data to store in sessionStorage with the key.
             */
            setItem(key: string, data: any): void;
        }
    }
    /**
     * An object used to create ITokenDetails for every operator.
     */
    var OPERATORS: IObject<expressions.ITokenDetails> = {
        'u+': {
            precedence: 4, associativity: 'rtl',
            fn: function unaryPlus(context, aliases, a) { return +a(context, aliases); }
        },
        '+': {
            precedence: 6, associativity: 'ltr',
            fn: function add(context, aliases, a, b) { return a(context, aliases) + b(context, aliases); }
        },
        'u-': {
            precedence: 4, associativity: 'rtl',
            fn: function unaryMinus(context, aliases, a) { return -a(context, aliases); }
        },
        '-': {
            precedence: 6, associativity: 'ltr',
            fn: function subtract(context, aliases, a, b) { return a(context, aliases) - b(context, aliases); }
        },
        '*': {
            precedence: 5, associativity: 'ltr',
            fn: function multiply(context, aliases, a, b) { return a(context, aliases) * b(context, aliases); }
        },
        '/': {
            precedence: 5, associativity: 'ltr',
            fn: function divide(context, aliases, a, b) { return a(context, aliases) / b(context, aliases); }
        },
        '%': {
            precedence: 5, associativity: 'ltr',
            fn: function modulus(context, aliases, a, b) { return a(context, aliases) % b(context, aliases); }
        },
        '?': {
            precedence: 15, associativity: 'rtl',
            fn: function question(context, aliases) { }
        },
        ':': {
            precedence: 15, associativity: 'rtl',
            fn: function colon(context, aliases) { }
        },
        '>': {
            precedence: 8, associativity: 'ltr',
            fn: function greaterThan(context, aliases, a, b) { return a(context, aliases) > b(context, aliases); }
        },
        '<': {
            precedence: 8, associativity: 'ltr',
            fn: function lessThan(context, aliases, a, b) { return a(context, aliases) < b(context, aliases); }
        },
        '!': {
            precedence: 4, associativity: 'rtl',
            fn: function logicalNot(context, aliases, a) { return !a(context, aliases); }
        },
        '~': {
            precedence: 4, associativity: 'rtl',
            fn: function bitwiseNot(context, aliases, a) { return ~a(context, aliases); }
        },
        '&': {
            precedence: 10, associativity: 'ltr',
            fn: function bitwiseAnd(context, aliases, a, b) { return a(context, aliases) & b(context, aliases); }
        },
        '|': {
            precedence: 12, associativity: 'ltr',
            fn: function bitwiseOr(context, aliases, a, b) { return a(context, aliases) | b(context, aliases); }
        },
        '>>': {
            precedence: 7, associativity: 'ltr',
            fn: function bitwiseShiftRight(context, aliases, a, b) { return a(context, aliases) >> b(context, aliases); }
        },
        '<<': {
            precedence: 7, associativity: 'ltr',
            fn: function bitwiseShiftLeft(context, aliases, a, b) { return a(context, aliases) << b(context, aliases); }
        },
        '>>>': {
            precedence: 7, associativity: 'ltr',
            fn: function bitwiseUnsignedShiftRight(context, aliases, a, b) { return a(context, aliases) >>> b(context, aliases); }
        },
        '&&': {
            precedence: 13, associativity: 'ltr',
            fn: function logicalAnd(context, aliases, a, b) { return a(context, aliases) && b(context, aliases); }
        },
        '||': {
            precedence: 14, associativity: 'ltr',
            fn: function logicalOr(context, aliases, a, b) { return a(context, aliases) || b(context, aliases); }
        },
        '==': {
            precedence: 9, associativity: 'ltr',
            /* tslint:disable:triple-equals */
            fn: function isEquivalent(context, aliases, a, b) { return a(context, aliases) == b(context, aliases); }
            /* tslint:enable:triple-equals */
        },
        '===': {
            precedence: 9, associativity: 'ltr',
            fn: function is(context, aliases, a, b) { return a(context, aliases) === b(context, aliases); }
        },
        '!=': {
            precedence: 9, associativity: 'ltr',
            /* tslint:disable:triple-equals */
            fn: function isNotEquivalent(context, aliases, a, b) { return a(context, aliases) != b(context, aliases); }
            /* tslint:enable:triple-equals */
        },
        '!==': {
            precedence: 9, associativity: 'ltr',
            fn: function isNot(context, aliases, a, b) { return a(context, aliases) !== b(context, aliases); }
        },
        '>=': {
            precedence: 8, associativity: 'ltr',
            fn: function greaterThanOrEqual(context, aliases, a, b) { return a(context, aliases) >= b(context, aliases); }
        },
        '<=': {
            precedence: 8, associativity: 'ltr',
            fn: function lessThanOrEqual(context, aliases, a, b) { return a(context, aliases) <= b(context, aliases); }
        },
        '=': {
            precedence: 17, associativity: 'rtl',
            fn: function equals(context, aliases, a, b) {
                var Exception: IExceptionStatic = acquire('$ExceptionStatic');
                Exception.fatal('Assignment operators are not supported', Exception.PARSE);
            }
        },
        '++': {
            precedence: 3, associativity: '',
            fn: function increment(context, aliases, a) {
                var Exception: IExceptionStatic = acquire('$ExceptionStatic');
                Exception.fatal('Assignment operators are not supported', Exception.PARSE);
            }
        },
        '--': {
            precedence: 3, associativity: '',
            fn: function decrement(context, aliases, a) {
                var Exception: IExceptionStatic = acquire('$ExceptionStatic');
                Exception.fatal('Assignment operators are not supported', Exception.PARSE);
            }
        },
        '+=': {
            precedence: 17, associativity: 'rtl',
            fn: function addAssignment(context, aliases, a, b) {
                var Exception: IExceptionStatic = acquire('$ExceptionStatic');
                Exception.fatal('Assignment operators are not supported', Exception.PARSE);
            }
        },
        '-=': {
            precedence: 17, associativity: 'rtl',
            fn: function subtractAssignment(context, aliases, a, b) {
                var Exception: IExceptionStatic = acquire('$ExceptionStatic');
                Exception.fatal('Assignment operators are not supported', Exception.PARSE);
            }
        },
        '*=': {
            precedence: 17, associativity: 'rtl',
            fn: function multiplyAssignment(context, aliases, a, b) {
                var Exception: IExceptionStatic = acquire('$ExceptionStatic');
                Exception.fatal('Assignment operators are not supported', Exception.PARSE);
            }
        },
        '/=': {
            precedence: 17, associativity: 'rtl',
            fn: function divideAssignment(context, aliases, a, b) {
                var Exception: IExceptionStatic = acquire('$ExceptionStatic');
                Exception.fatal('Assignment operators are not supported', Exception.PARSE);
            }
        },
        '%=': {
            precedence: 17, associativity: 'rtl',
            fn: function modulusAssignment(context, aliases, a, b) {
                var Exception: IExceptionStatic = acquire('$ExceptionStatic');
                Exception.fatal('Assignment operators are not supported', Exception.PARSE);
            }
        },
        '.': { precedence: 2, associativity: 'ltr', fn: function index(context, aliases, a, b) { return a[b]; } }
    };
    
    /**
     * An object used to create ITokenDetails for every accessor.
     */
    var ACCESSORS: IObject<expressions.ITokenDetails> = {
        '()': { precedence: 2, associativity: null, fn: null },
        '[]': { precedence: 2, associativity: null, fn: null },
        '.': { precedence: 2, associativity: null, fn: null },
        '{}': { precedence: 1, associativity: null, fn: null }
    };
    
    /**
     * An object used to create ITokenDetails for every delimiter.
     */
    var DELIMITERS: IObject<expressions.ITokenDetails> = {
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
    function isDelimiter(key: string) {
        return !isNull(DELIMITERS[key]);
    }
    
    /**
     * Checks if a string is in the ACCESSORS array.
     * 
     * @param key The string to index into the ACCESSORS array.
     * @return {Boolean}
     */
    function isAccessor(key: string) {
        return !isNull(ACCESSORS[key]);
    }
    
    /**
     * Checks if a string is in the OPERATORS array.
     * 
     * @param key The string to index into the OPERATORS array.
     * @return {Boolean}
     */
    function isOperator(key: string) {
        return !isNull(OPERATORS[key]);
    }
    
    /**
     * Checks if a string is in the KEYWORDS array.
     * 
     * @param key The string to index into the KEYWORDS array.
     * @return {Boolean}
     */
    function isKeyword(key: string) {
        return !isUndefined(KEYWORDS[key]);
    }

    export module observable {
        var arrayMethods = ['push', 'pop', 'reverse', 'shift', 'sort', 'splice', 'unshift'];

        /**
         * Manages observable properties on control.
         * Facilitates in data-binding and managing context inheritance.
         */
        export class ContextManager implements IContextManager {
            static observedArrayListeners: IObject<IObject<(ev: IArrayMethodInfo<any>) => void>> = {};
            /**
             * Gets the ContextManager associated to the given control. If no 
             * ContextManager exists, one is created for that control.
             * 
             * @static
             * @param control The control on which to locate the ContextManager
             */
            static getManager(control: IControl): IContextManager;
            static getManager(control: any): IContextManager {
                var contextManager: IContextManager,
                    managers = ContextManager.__managers,
                    uid = control.uid,
                    manager = managers[uid];

                if (!isNull(manager)) {
                    contextManager = manager;
                    return contextManager;
                }

                contextManager = managers[uid] = new ContextManager();
                contextManager.context = control;

                return contextManager;
            }

            /**
             * Removes all the listeners for a given control's uid.
             * 
             * @static
             * @param uid The uid used to search for listeners.
             */
            static dispose(control: IControl, persist?: boolean);
            static dispose(control: ui.ITemplateControl, persist?: boolean) {
                if (isNull(control)) {
                    return;
                }

                var uid = control.uid,
                    controls = ContextManager.__controls,
                    identifiers = controls[uid],
                    managers = ContextManager.__managers,
                    manager = managers[uid];

                if (!isNull(manager)) {
                    manager.dispose();
                    managers[uid] = null;
                    delete managers[uid];
                }

                if (isNull(identifiers)) {
                    return;
                }

                var keys = Object.keys(identifiers),
                    identifier, listeners, i, j, jLength;

                while (keys.length > 0) {
                    identifier = keys.shift();
                    listeners = identifiers[identifier];
                    jLength = listeners.length;
                    for (j = 0; j < jLength; ++j) {
                        listeners[j](identifier, uid);
                    }
                }

                var arrayListeners = ContextManager.observedArrayListeners,
                    remove = ContextManager.removeArrayListeners;

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
            }

            /**
             * Removes all listeners for an Array associated with a given uid.
             * 
             * @static
             * @param absoluteIdentifier The identifier used to locate the array.
             * @param uid The uid used to search for listeners.
             */
            static removeArrayListeners(absoluteIdentifier: string, uid: string) {
                var listeners = ContextManager.observedArrayListeners[absoluteIdentifier];

                if (!isNull(listeners)) {
                    listeners[uid] = null;
                    delete listeners[uid];
                }
            }

            /**
             * Safely retrieves the local context given a root context and an Array of
             * property strings.
             * 
             * @static
             * @param rootContext The root object in which to find a local context.
             * @param split The string array containing properties used to index into
             * the rootContext.
             */
            static getContext(rootContext: any, split: Array<string>) {
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
            }

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
            static defineProperty(obj: any, key: string, value: any, enumerable?: boolean, configurable?: boolean) {
                Object.defineProperty(obj, key, {
                    value: value,
                    enumerable: !!enumerable,
                    configurable: !!configurable
                });
            }
            static defineGetter(obj: any, key: string, value: any, enumerable?: boolean, configurable?: boolean) {
                Object.defineProperty(obj, key, {
                    get: function () {
                        return value;
                    },
                    enumerable: !!enumerable,
                    configurable: !!configurable
                });
            }
            static pushRemoveListener(identifier: string, uid: string, listener: IRemoveListener) {
                var controls = ContextManager.__controls,
                    control = controls[uid],
                    listeners;

                if (isNull(control)) {
                    control = controls[uid] = {};
                }

                listeners = control[identifier];

                if (isNull(listeners)) {
                    listeners = control[identifier] = [];
                }

                listeners.push(listener);
            }
            static removeIdentifier(uids: Array<string>, identifier: string) {
                var length = uids.length,
                    controls = ContextManager.__controls,
                    uid, identifiers;

                for (var i = 0; i < length; ++i) {
                    uid = uids[i];

                    identifiers = controls[uid];

                    if (isNull(identifiers)) {
                        continue;
                    }

                    identifiers[identifier] = null;
                    delete identifiers[identifier];
                }
            }

            private static __managers: IObject<IContextManager> = {};
            private static __controls: IObject<IObject<Array<IRemoveListener>>> = {};

            context: any;
            $ContextManagerStatic: IContextManagerStatic = acquire('$ContextManagerStatic');
            $compat: ICompat = acquire('$compat');
            $ExceptionStatic: IExceptionStatic = acquire('$ExceptionStatic');
            private __identifiers: IObject<Array<IListener>> = {};
            private __identifierHash: IObject<Array<string>> = {};
            private __contextObjects = {};
            private __isArrayFunction: boolean = false;
            private __observedIdentifier: string;

            /**
             * Safely retrieves the local context for this ContextManager given an Array of
             * property strings.
             * 
             * @param split The string array containing properties used to index into
             * the context.
             */
            getContext(split: Array<string>) {
                var join = split.join('.'),
                    context = this.__contextObjects[join];

                if (isNull(this.__contextObjects[join])) {
                    context = this.__contextObjects[join] = this.$ContextManagerStatic.getContext(this.context, split);
                }

                return context;
            }

            /**
             * Given a period-delimited identifier, observes an object and calls the given listener when the 
             * object changes.
             * 
             * @param absoluteIdentifier The period-delimited identifier noting the property to be observed.
             * @param observableListener An object implmenting IObservableListener. The listener will be 
             * notified of object changes.
             * @return {IRemoveListener} A method for removing the listener.
             */
            observe(absoluteIdentifier: string, observableListener: IListener): IRemoveListener {
                if (isEmpty(absoluteIdentifier)) {
                    return;
                }

                var split = absoluteIdentifier.split('.'),
                    key = split.pop(),
                    path,
                    parsedExpression,
                    context = this.context,
                    hasIdentifier = this._hasIdentifier(absoluteIdentifier),
                    hasObservableListener = !isNull(observableListener),
                    join;

                if (split.length > 0) {
                    join = split.join('.');
                    context = this.__contextObjects[join];
                    if (isNull(this.__contextObjects[join])) {
                        context = this.__contextObjects[join] = this._getImmediateContext(join);
                    }
                }

                if (!(isObject(context) || isArray(context))) {
                    this.$ExceptionStatic.warn('Trying to observe a child property of a primitive for identifier: ' +
                        absoluteIdentifier, this.$ExceptionStatic.CONTEXT);

                    if (hasObservableListener) {
                        return this._addObservableListener(absoluteIdentifier, observableListener);
                    }

                    return;
                }

                // set observedIdentifier to null
                this.__observedIdentifier = null;

                var value = this.__contextObjects[absoluteIdentifier] = context[key];

                // if observedIdentifier is not null, the primitive is already being watched
                var observedIdentifier = this.__observedIdentifier,
                    isObserved = !isNull(observedIdentifier);
                if (isObserved) {
                    hasIdentifier = true;
                }

                var removeCallback = noop;

                if (hasObservableListener) {
                    var removeObservedCallback = noop,
                        removeAbsoluteCallback = this._addObservableListener(absoluteIdentifier, observableListener);

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
            }

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
            observeArray(control: IControl, listener: (ev: IArrayMethodInfo<any>) => void,
                absoluteIdentifier: string, array: Array<any>, oldArray: Array<any>) {
                var length = arrayMethods.length,
                    method, i = 0,
                    ContextManager = this.$ContextManagerStatic,
                    Compat = this.$compat,
                    proto = Compat.proto,
                    setProto = Compat.setProto;
            
                if (!isNull(oldArray)) {
                    if (setProto) {
                        (<any>Object).setPrototypeOf(oldArray, Object.create(Array.prototype));
                    } else if (proto) {
                        (<any>oldArray).__proto__ = Object.create(Array.prototype);
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
                        (<any>Object).setPrototypeOf(array, obj);
                    } else {
                        (<any>array).__proto__ = obj;
                    }

                    return;
                }

                for (; i < length; ++i) {
                    method = arrayMethods[i];
                    ContextManager.defineProperty(array, method,
                        this._overwriteArrayFunction(absoluteIdentifier, control, method), false, true);
                }
            }
            dispose() {
                this.context = null;
                this.__identifiers = {};
                this.__identifierHash = {};
                this.__contextObjects = {};
            }
            _getImmediateContext(identifier: string) {
                if (isNull(this.__identifiers[identifier])) {
                    this.observe(identifier, null);
                }

                var split = identifier.split('.'),
                    context = this.context,
                    key = split.shift(),
                    partialIdentifier = key;

                do {
                    context = context[key];
                    if (isNull(context) || split.length === 0) {
                        break;
                    }

                    key = split.shift();
                    partialIdentifier += '.' + key;
                } while (split.length >= 0);

                return context;
            }
            _getValues(split: Array<string>, newRootContext: any, oldRootContext: any) {
                var length = split.length,
                    property,
                    doNew = true,
                    doOld = true;

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
            }
            _notifyChildProperties(identifier: string, newValue: any, oldValue: any) {
                var mappings = this.__identifierHash[identifier];

                if (isNull(mappings)) {
                    return;
                }

                var length = mappings.length,
                    binding,
                    property,
                    parentProperty,
                    split,
                    values = {},
                    value,
                    key,
                    start = identifier.length + 1,
                    newParent, oldParent, newChild, oldChild;

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
            }
            _addObservableListener(absoluteIdentifier: string, observableListener: IListener) {
                var uid = observableListener.uid,
                    contextManagerCallback = this._removeCallback.bind(this),
                    ContextManager = this.$ContextManagerStatic;

                this._add(absoluteIdentifier, observableListener);

                ContextManager.pushRemoveListener(absoluteIdentifier, uid, contextManagerCallback);

                return function removeObservableCallback() {
                    ContextManager.removeIdentifier([uid], absoluteIdentifier);
                    contextManagerCallback(absoluteIdentifier, uid);
                };
            }
            _define(identifier: string, immediateContext: any, key: string) {
                var value = immediateContext[key];

                if (isObject(value) || isArray(value)) {
                    this.__defineObject(identifier, immediateContext, key);
                } else {
                    this.__definePrimitive(identifier, immediateContext, key);
                }
            }
            private __defineObject(identifier: string, immediateContext: any, key: string) {
                var value = immediateContext[key];

                Object.defineProperty(immediateContext, key, {
                    configurable: true,
                    get: () => {
                        this.__observedIdentifier = identifier;
                        return value;
                    },
                    set: (newValue) => {
                        if (value === newValue) {
                            return;
                        }

                        var oldValue = value;
                        value = newValue;

                        if (this.__isArrayFunction) {
                            return;
                        }

                        var childPropertiesLength = this.__identifierHash[identifier].length;
                        this._execute(identifier, value, oldValue);
                        if (childPropertiesLength > 0) {
                            this._notifyChildProperties(identifier, value, oldValue);
                        }
                    }
                });
            }
            private __definePrimitive(identifier: string, immediateContext: any, key: string) {
                var value = immediateContext[key],
                    isDefined = !isNull(value);

                if (isArray(immediateContext) && key === 'length') {
                    return;
                }

                Object.defineProperty(immediateContext, key, {
                    configurable: true,
                    get: () => {
                        this.__observedIdentifier = identifier;
                        return value;
                    },
                    set: (newValue) => {
                        if (value === newValue) {
                            return;
                        }
                        var oldValue = value;
                        value = newValue;

                        if (this.__isArrayFunction && isArray(immediateContext)) {
                            return;
                        }

                        if (isDefined) {
                            this._execute(identifier, newValue, oldValue);
                            return;
                        }

                        if (isObject(value) || isArray(value)) {
                            var childPropertiesLength = this.__identifierHash[identifier].length;
                            this._execute(identifier, newValue, oldValue);
                            this.__defineObject(identifier, immediateContext, key);
                            if (childPropertiesLength > 0) {
                                this._notifyChildProperties(identifier, newValue, oldValue);
                            }
                        } else {
                            this._execute(identifier, newValue, oldValue);
                            this.__definePrimitive(identifier, immediateContext, key);
                        }
                    }
                });
            }
            _overwriteArrayFunction(absoluteIdentifier: string, control: IControl, method: string) {
                var callbacks = this.$ContextManagerStatic.observedArrayListeners[absoluteIdentifier],
                    that = this;

                // We can't use a fat-arrow function here because we need the array context.
                return function observedArrayFn(...args: any[]) {
                    var oldArray = this.slice(0),
                        returnValue;

                    if (method.indexOf('shift') !== -1) {
                        that.__isArrayFunction = true;
                        returnValue = Array.prototype[method].apply(this, args);
                        that.__isArrayFunction = false;
                        that._notifyChildProperties(absoluteIdentifier, this, oldArray);
                    } else {
                        returnValue = Array.prototype[method].apply(this, args);
                    }

                    var keys = Object.keys(callbacks),
                        length = keys.length;

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
            }
            private __addHashValues(identifier: string) {
                var split = identifier.split('.'),
                    ident = '',
                    hashValue;

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
            }
            _add(identifier: string, observableListener: IListener) {
                var callbacks = this.__identifiers[identifier];

                if (isNull(callbacks)) {
                    callbacks = this.__identifiers[identifier] = [];
                }

                callbacks.push(observableListener);

                if (isNull(this.__identifierHash[identifier])) {
                    this.__addHashValues(identifier);
                }
            }
            _removeCallback(identifier: string, uid: string) {
                var callbacks = this.__identifiers[identifier];
                if (isNull(callbacks)) {
                    return;
                }

                // filter out callback objects that have matching uids
                var length = callbacks.length - 1,
                    callback: IListener;

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
            }
            _hasIdentifier(identifier: string) {
                return !isEmpty(this.__identifiers[identifier]);
            }
            _execute(identifier: string, value: any, oldValue: any) {
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
            }
        }

        export function ContextManagerStatic() {
            return ContextManager;
        }

        register.injectable('$ContextManagerStatic', ContextManagerStatic, null, register.injectableType.STATIC);

        /**
         * Describes an object that manages observing properties on any object.
         */
        export interface IContextManager {
            context: any;
            /**
             * Safely retrieves the local context for this ContextManager given an Array of
             * property strings.
             * 
             * @param split The string array containing properties used to index into
             * the context.
             */
            getContext(split: Array<string>): any;

            /**
             * Given a period-delimited identifier, observes an object and calls the given listener when the 
             * object changes.
             * 
             * @param absoluteIdentifier The period-delimited identifier noting the property to be observed.
             * @param observableListener An object implmenting IObservableListener. The listener will be 
             * notified of object changes.
             * @return {IRemoveListener} A method for removing the listener.
             */
            observe(identifier: string, observableListener: IListener): IRemoveListener;

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
            observeArray(control: IControl, listener: (ev: IArrayMethodInfo<any>) => void,
                absoluteIdentifier: string, array: Array<any>, oldArray: Array<any>): void;

            /**
             * Disposes the memory for an IContextManager.
             */
            dispose();
        }

        /**
         * An object specifying a listener callback function and a unique id to use to manage the
         * listener.
         */
        export interface IListener {
            /**
             * A listener method called when the object it is observing is changed.
             * 
             * @param value The new value of the object.
             * @param oldValue The previous value of the object.
             */
            listener(value: any, oldValue: any): void;

            /**
             * A unique id used to manage the listener.
             */
            uid: string;
        }

        /**
         * An object for Array method info. Takes a 
         * generic type to denote the type of array it uses.
         */
        export interface IArrayMethodInfo<T> {
            /**
             * The method name that was called. Possible values are:
             * 'push', 'pop', 'reverse', 'shift', 'sort', 'splice', 
             * and 'unshift'
             */
            method: string;

            /**
             * The value returned from the called function.
             */
            returnValue: any;

            /**
             * The previous value of the array.
             */
            oldArray: Array<T>;

            /**
             * The new value of the array.
             */
            newArray: Array<T>;

            /**
             * The arguments passed into the array function.
             */
            arguments: Array<any>;
        }

        export interface IContextManagerStatic {
            observedArrayListeners: IObject<IObject<(ev: IArrayMethodInfo<any>) => void>>;
            /**
             * Gets the ContextManager associated to the given control. If no 
             * ContextManager exists, one is created for that control.
             * 
             * @static
             * @param control The control on which to locate the ContextManager
             */
            getManager(control: IControl): IContextManager;
            getManager(control: any): IContextManager;

            /**
             * Removes all the listeners for a given control's uid.
             * 
             * @static
             * @param uid The uid used to search for listeners.
             */
            dispose(control: IControl, persist?: boolean);
            dispose(control: ui.ITemplateControl, persist?: boolean): void;

            /**
             * Removes all listeners for an Array associated with a given uid.
             * 
             * @static
             * @param absoluteIdentifier The identifier used to locate the array.
             * @param uid The uid used to search for listeners.
             */
            removeArrayListeners(absoluteIdentifier: string, uid: string): void;

            /**
             * Safely retrieves the local context given a root context and an Array of
             * property strings.
             * 
             * @static
             * @param rootContext The root object in which to find a local context.
             * @param split The string array containing properties used to index into
             * the rootContext.
             */
            getContext(rootContext: any, split: Array<string>);

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
            defineProperty(obj: any, key: string, value: any, enumerable?: boolean, configurable?: boolean): void;

            /**
             * Defines an object property as a getter with the associated value. Useful for unobserving objects.
             * 
             * @param obj The object on which to define the property.
             * @param key The property key.
             * @param value The value used to define the property.
             * @param enumerable Whether or not the property should be enumerable (able to be iterated 
             * over in a loop)
             * @param configurable Whether or not the property is able to be reconfigured.
             */
            defineGetter(obj: any, key: string, value: any, enumerable?: boolean, configurable?: boolean): void;

            pushRemoveListener(identifier: string, uid: string, listener: IRemoveListener);
            removeIdentifier(uids: Array<string>, identifier: string);
        }

        /**
         * Defines the object added to a template control when its element 
         * has an attribute control that extends controls.ObservableAttributeControl.
         * 
         * This will contain the value of the expression as well as a way to observe the 
         * attribute value for changes.
         * 
         * plat-options is a control that implements this interface, and puts an 'options' 
         * property on its associated template control.
         * 
         * The generic type corresponds to the type of object created when the attribute 
         * expression is evaluated.
         */
        export interface IObservableProperty<T> {
            /**
             * The value obtained from evaluating the attribute's expression.
             */
            value: T;

            /**
             * A method for observing the attribute for changes.
             * 
             * @param listener The listener callback which will be pre-bound to the 
             * template control.
             * 
             * @return {IRemoveListener} A method for removing the listener.
             */
            observe(listener: (newValue: T, oldValue: T) => void): IRemoveListener;
        }
    }
    export module events {
        export class DispatchEvent implements IDispatchEvent {
            $EventManagerStatic: IEventManagerStatic = acquire('$EventManagerStatic');
            /**
             * The object that initiated the event.
             */
            sender: any;

            /**
             * The name of the event.
             */
            name: string;

            /**
             * The event direction this object is using for propagation.
             */
            direction: string;
        
            /**
             * @param name The name of the event.
             * @param sender The object that initiated the event.
             * @param direction The event direction this object is using for propagation.
             * 
             * @see EventManager
             */
            initialize(name: string, sender: any, direction?: string);
            /**
             * @param name The name of the event.
             * @param sender The object that initiated the event.
             * @param direction='up' Equivalent to EventManager.UP.
             * 
             * @see EventManager
             */
            initialize(name: string, sender: any, direction?: 'up');
            /**
             * @param name The name of the event.
             * @param sender The object that initiated the event.
             * @param direction='down' Equivalent to EventManager.DOWN.
             * 
             * @see EventManager
             */
            initialize(name: string, sender: any, direction?: 'down');
            /**
             * @param name The name of the event.
             * @param sender The object that initiated the event.
             * @param direction='direct' Equivalent to EventManager.DIRECT.
             * 
             * @see EventManager
             */
            initialize(name: string, sender: any, direction?: 'direct');
            initialize(name: string, sender: any, direction?: string) {
                this.name = name;
                this.direction = direction || this.$EventManagerStatic.direction.DIRECT;
                this.sender = sender;
            }

            /**
             * Call this method to halt the propagation of an upward-moving event.
             * Other events cannot be stopped with this method.
             */
            stopPropagation() {
                if (this.direction === this.$EventManagerStatic.direction.UP) {
                    this.$EventManagerStatic.propagatingEvents[this.name] = false;
                }
            }
        }

        register.injectable('$dispatchEvent', DispatchEvent, null, register.injectableType.MULTI);

        /**
         * Describes an event that propagates through a control tree. 
         * Propagation of the event always starts at the sender, allowing a control to both 
         * initialize and consume an event. If a consumer of an event throws an error while 
         * handling the event it will be logged to the app using exception.warn. Errors will 
         * not stop propagation of the event.
         */
        export interface IDispatchEvent {
            /**
             * The object that initiated the event.
             */
            sender: any;
        
            /**
             * The name of the event.
             */
            name: string;

            /**
             * The event direction this object is using for propagation.
             */
            direction: string;

            /**
             * Call this method to halt the propagation of an upward-moving event.
             * Downward events cannot be stopped with this method.
             */
            stopPropagation(): void;

            /**
             * @param name The name of the event.
             * @param sender The object that initiated the event.
             * @param direction='up' Equivalent to EventManager.UP.
             * 
             * @see EventManager
             */
            initialize(name: string, sender: any, direction?: 'up');
            /**
             * @param name The name of the event.
             * @param sender The object that initiated the event.
             * @param direction='down' Equivalent to EventManager.DOWN.
             * 
             * @see EventManager
             */
            initialize(name: string, sender: any, direction?: 'down');
            /**
             * @param name The name of the event.
             * @param sender The object that initiated the event.
             * @param direction='direct' Equivalent to EventManager.DIRECT.
             * 
             * @see EventManager
             */
            initialize(name: string, sender: any, direction?: 'direct');
            /**
             * @param name The name of the event.
             * @param sender The object that initiated the event.
             * @param direction The event direction this object is using for propagation.
             *
             * 
             * @see EventManager
             */
            initialize(name: string, sender: any, direction?: string);
        }

        /**
         * Represents a Lifecycle Event. Lifecycle Events are always direct events.
         */
        export class LifecycleEvent extends DispatchEvent implements ILifecycleEvent {
            /**
             * Creates a new Lifecycle and fires it.
             * 
             * @param name The name of the event.
             * @param sender The sender of the event.
             */
            static dispatch(name: string, sender: any) {
                var event = new LifecycleEvent();

                event.initialize(name, sender);
                EventManager.sendEvent(event);
            }

            /**
             * @param name The name of the event.
             * @param sender The sender of the event.
             */
            initialize(name: string, sender: any) {
                super.initialize(name, sender, this.$EventManagerStatic.direction.DIRECT);
            }
        }

        export function LifecycleEventStatic() {
            return LifecycleEvent;
        }

        register.injectable('$LifecycleEventStatic', LifecycleEventStatic, null, register.injectableType.STATIC);

        /**
         * Defines an object that represents a Lifecycle Event
         */
        export interface ILifecycleEvent extends IDispatchEvent {
            /**
             * @param name The name of the event.
             * @param sender The sender of the event.
             */
            initialize(name: string, sender: any): void;
        }

        export interface ILifecycleEventStatic {
            /**
             * Creates a new Lifecycle and fires it.
             *
             * @param name The name of the event.
             * @param sender The sender of the event.
             */
            dispatch(name: string, sender: any): void;
        }

        /**
         * Event object for a control dispatch event. Contains information about the type of event.
         * Propagation of the event always starts at the sender, allowing a control to both 
         * initialize and consume an event. If a consumer of an event throws an error while 
         * handling the event it will be logged to the app using exception.warn. Errors will 
         * not stop propagation of the event.
         */
        export class EventManager {
            /**
             * Contains the constants for specifying event direction.
             */
            static direction: IDirection = {
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

            /**
             * Keeps track of which events are currently propagating.
             */
            static propagatingEvents = {};
            static $compat: ICompat;
            static $document: Document;
            static $window: Window;
            static $ExceptionStatic: IExceptionStatic;
            private static __eventsListeners: IObject<IEventsListener> = {};
            private static __lifecycleEventListeners: Array<any> = [];
            private static __initialized = false;

            /**
             * Initializes the EventManager, creating the initial ALM event listeners.
             * 
             * @static
             */
            static initialize() {
                if (EventManager.__initialized) {
                    return;
                }

                EventManager.__initialized = true;

                var lifecycleListeners = EventManager.__lifecycleEventListeners,
                    length = lifecycleListeners.length,
                    compat = EventManager.$compat,
                    $document = EventManager.$document,
                    dispatch = LifecycleEvent.dispatch,
                    listener;

                while (lifecycleListeners.length > 0) {
                    listener = lifecycleListeners.pop();
                    $document.removeEventListener(listener.name, listener.value, false);
                }

                if (compat.cordova) {
                    var eventNames = ['resume', 'online', 'offline'],
                        event;

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
            }

            /**
             * Removes all event listeners for a given uid. Useful for garbage collection when 
             * certain objects that listen to events go out of scope.
             * 
             * @static
             * @param uid The uid for which the event listeners will be removed.
             */
            static dispose(uid: string) {
                EventManager.__eventsListeners[uid] = null;
                delete EventManager.__eventsListeners[uid];
            }

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
            static on(uid: string, eventName: string, listener: (ev: IDispatchEvent, ...args: any[]) => void,
                context?: any): IRemoveListener {
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
            }

            /**
             * Looks for listeners to a given event name, and fires the listeners using the specified
             * event direction.
             * 
             * @static
             * @param name The name of the event.
             * @param sender The object sending the event.
             * @param direction The eventDirection in which to send the event.
             * @param args The arguments to send to the listeners.
             * 
             * @see eventDirection
             */
            static dispatch(name: string, sender: any, direction: string, args?: Array<any>);
            /**
             * Looks for listeners to a given event name, and fires the listeners using the specified
             * event direction.
             * 
             * @static
             * @param name The name of the event.
             * @param sender The object sending the event.
             * @param direction='up' Equivalent to EventManager.UP.
             * @param args The arguments to send to the listeners.
             * 
             * @see eventDirection
             */
            static dispatch(name: string, sender: any, direction: 'up', args?: Array<any>);
            /**
             * Looks for listeners to a given event name, and fires the listeners using the specified
             * event direction.
             * 
             * @static
             * @param name The name of the event.
             * @param sender The object sending the event.
             * @param direction='down' Equivalent to EventManager.DOWN.
             * @param args The arguments to send to the listeners.
             * 
             * @see eventDirection
             */
            static dispatch(name: string, sender: any, direction: 'down', args?: Array<any>);
            /**
             * Looks for listeners to a given event name, and fires the listeners using the specified
             * event direction.
             * 
             * @static
             * @param name The name of the event.
             * @param sender The object sending the event.
             * @param direction='direct' Equivalent to EventManager.DIRECT.
             * @param args The arguments to send to the listeners.
             * 
             * @see eventDirection
             */
            static dispatch(name: string, sender: any, direction: 'direct', args?: Array<any>);
            static dispatch(name: string, sender: any, direction: string, args?: Array<any>) {
                var event: IDispatchEvent = acquire('$dispatchEvent');
                event.initialize(name, sender, direction);
                EventManager.sendEvent(event, args);
            }

            static sendEvent(event: IDispatchEvent, args?: Array<any>) {
                var name = event.name,
                    direction = event.direction;

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
            }

            static _dispatchUp(event: IDispatchEvent, args: Array<any>) {
                var name = event.name,
                    parent = event.sender;

                while (!isNull(parent) && EventManager.propagatingEvents[name]) {
                    if (isNull(parent.uid)) {
                        continue;
                    }
                    EventManager.__executeEvent(parent.uid, event, args);
                    parent = parent.parent;
                }
            }

            static _dispatchDown(event: IDispatchEvent, args: Array<any>) {
                var controls = [],
                    control,
                    name = event.name;

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
            }

            static _dispatchDirect(event: IDispatchEvent, args: Array<any>) {
                var uids = Object.keys(EventManager.__eventsListeners),
                    length = uids.length,
                    name = event.name,
                    eventsListener: IEventsListener;

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
            }

            /**
             * Returns whether or not the given string is a registered direction.
             */
            static hasDirection(direction: string) {
                var dir = EventManager.direction;

                return (direction === dir.UP ||
                    direction === dir.DOWN ||
                    direction === dir.DIRECT);
            }

            private static __executeEvent(uid: string, ev: IDispatchEvent, args: Array<any>) {
                var eventsListener = EventManager.__eventsListeners[uid];

                if (isNull(eventsListener)) {
                    return;
                }
                var context = eventsListener.context,
                    listeners = eventsListener.listeners[ev.name];

                if (isNull(listeners)) {
                    return;
                }

                EventManager.__callListeners(context, ev, listeners, args);
            }

            private static __callListeners(context: any, ev: IDispatchEvent,
                listeners: Array<(ev: IDispatchEvent, ...args: any[]) => void>, args: Array<any>) {
                var name = ev.name,
                    length = listeners.length,
                    index = -1;

                args = [ev].concat(args);

                while (++index < length && EventManager.propagatingEvents[name]) {
                    try {
                        listeners[index].apply(context, args);
                    } catch (e) {
                        EventManager.$ExceptionStatic.warn(e, Exception.EVENT);
                    }
                }
            }
        }

        /**
         * Desscribes an object that contains event listeners.
         */
        export interface IEventsListener {
            /**
             * An IObject of listener arrays, keyed by event name.
             */
            listeners: IObject<Array<(ev: IDispatchEvent, ...args: any[]) => void>>;
            /**
             * The context with which to call each event listener.
             */
            context: any;
        }

        /**
         * Contains the constants for specifying event direction.
         */
        export interface IDirection {
            /**
             * An upward-moving event will start at the sender and move 
             * up the parent chain.
             */
            UP: string;

            /**
             * A downward-moving event will start at the sender and move
             * to its children and beyond.
             */
            DOWN: string;

            /**
             * Goes through all listeners for an event name, ignoring order.
             */
            DIRECT: string;
        }

        export interface IEventManagerStatic {
            /**
             * Contains the constants for specifying event direction.
             */
            direction: IDirection;

            /**
             * Keeps track of which events are currently propagating.
             */
            propagatingEvents: {};

            /**
             * Initializes the EventManager, creating the initial ALM event listeners.
             */
            initialize(): void;

            /**
             * Removes all event listeners for a given uid. Useful for garbage collection when
             * certain objects that listen to events go out of scope.
             *
             * @param uid The uid for which the event listeners will be removed.
             */
            dispose(uid: string): void;

            /**
             * Registers a listener for the beforeNavigate Event. The listener will be called when the beforeNavigate 
             * event is propagating over the given uid. Any number of listeners can exist for a single event name. The 
             * listener can chose to cancel the event using ev.cancel(), preventing any navigation as well as further 
             * calls to event listeners.
             *
             * @param uid A unique id to associate with the object registering the listener.
             * @param eventName='beforeNavigate' Specifies that this is a listener for the beforeNavigate event.
             * @param listener The method called when the beforeNavigate event is fired.
             * @param context Optional context with which the listener will be bound.
             * @return {IRemoveListener} A method for removing the listener.
             */
            on(uid: string, eventName: 'beforeNavigate',
                listener: (ev: INavigationEvent<any, any, navigation.IBaseNavigator>) => void, context?: any): IRemoveListener;
            /**
             * Registers a listener for the navigating Event. The listener will be called when the navigating 
             * event is propagating over the given uid. Any number of listeners can exist for a single event name.
             * The listener can chose to cancel the event using ev.cancel(), preventing any navigation as well as further 
             * calls to event listeners.
             *
             * @param uid A unique id to associate with the object registering the listener.
             * @param eventName='navigating' Specifies that this is a listener for the navigating event.
             * @param listener The method called when the navigating event is fired.
             * @param context Optional context with which the listener will be bound.
             * @return {IRemoveListener} A method for removing the listener.
             */
            on(uid: string, eventName: 'navigating',
                listener: (ev: INavigationEvent<any, any, navigation.IBaseNavigator>) => void, context?: any): IRemoveListener;
            /**
             * Registers a listener for the navigated Event. The listener will be called when the navigated 
             * event is propagating over the given uid. Any number of listeners can exist for a single event name.
             * The listener cannot cancel the event.
             *
             * @param uid A unique id to associate with the object registering the listener.
             * @param eventName='navigated' Specifies that this is a listener for the navigated event.
             * @param listener The method called when the navigated event is fired.
             * @param context Optional context with which the listener will be bound.
             * @return {IRemoveListener} A method for removing the listener.
             */
            on(uid: string, eventName: 'navigated',
                listener: (ev: INavigationEvent<ui.IViewControl, any,
                navigation.IBaseNavigator>) => void, context?: any): IRemoveListener;
            /**
             * Registers a listener for a NavigationEvent. The listener will be called when a NavigationEvent is
             * propagating over the given uid. Any number of listeners can exist for a single event name.
             *
             * @param uid A unique id to associate with the object registering the listener.
             * @param eventName The name of the event to listen to.
             * @param listener The method called when the NavigationEvent is fired.
             * @param context Optional context with which the listener will be bound.
             * @return {IRemoveListener} A method for removing the listener.
             */
            on(uid: string, eventName: string, listener: (ev: INavigationEvent<any, any, navigation.IBaseNavigator>) => void,
                context?: any): IRemoveListener;
            /**
             * Registers a listener for the ready AlmEvent. The ready event will be called when the app 
             * is ready to start.
             *
             * @param uid A unique id to associate with the object registering the listener.
             * @param eventName='ready' Specifies that the listener is for the ready event.
             * @param listener The method called when the app is ready to start.
             * @param context Optional context with which the listener will be bound.
             * @return {IRemoveListener} A method for removing the listener.
             */
            on(uid: string, eventName: 'ready', listener: (ev: ILifecycleEvent) => void,
                context?: any): IRemoveListener;
            /**
             * Registers a listener for the suspend AlmEvent. The listener will be called when an app 
             * is being suspended.
             *
             * @param uid A unique id to associate with the object registering the listener.
             * @param eventName='suspend' Specifies the listener is for the suspend event.
             * @param listener The method called when the suspend event is fired.
             * @param context Optional context with which the listener will be bound.
             * @return {IRemoveListener} A method for removing the listener.
             */
            on(uid: string, eventName: 'suspend', listener: (ev: ILifecycleEvent) => void,
                context?: any): IRemoveListener;
            /**
             * Registers a listener for the resume AlmEvent. The listener will be called when an app 
             * is being resumeed.
             *
             * @param uid A unique id to associate with the object registering the listener.
             * @param eventName='suspend' Specifies the listener is for the resume event.
             * @param listener The method called when the resume event is fired.
             * @param context Optional context with which the listener will be bound.
             * @return {IRemoveListener} A method for removing the listener.
             */
            on(uid: string, eventName: 'resume', listener: (ev: ILifecycleEvent) => void,
                context?: any): IRemoveListener;
            /**
             * Registers a listener for the online AlmEvent. This event fires when the app's network 
             * connection changes to be online.
             *
             * @param uid A unique id to associate with the object registering the listener.
             * @param eventName='online' Specifies the listener is for the online event.
             * @param listener The method called when the online event is fired.
             * @param context Optional context with which the listener will be bound.
             * @return {IRemoveListener} A method for removing the listener.
             */
            on(uid: string, eventName: 'online', listener: (ev: ILifecycleEvent) => void,
                context?: any): IRemoveListener;
            /**
             * Registers a listener for the offline AlmEvent. This event fires when the app's network 
             * connection changes to be offline.
             *
             * @param uid A unique id to associate with the object registering the listener.
             * @param eventName='offline' Specifies the listener is for the offline event.
             * @param listener The method called when the offline is fired.
             * @param context Optional context with which the listener will be bound.
             * @return {IRemoveListener} A method for removing the listener.
             */
            on(uid: string, eventName: 'offline', listener: (ev: ILifecycleEvent) => void,
                context?: any): IRemoveListener;
            /**
             * Registers a listener for an AlmEvent. The listener will be called when an AlmEvent is
             * propagating over the given uid. Any number of listeners can exist for a single event name.
             *
             * @param uid A unique id to associate with the object registering the listener.
             * @param eventName The name of the event to listen to.
             * @param listener The method called when the AlmEvent is fired.
             * @param context Optional context with which the listener will be bound.
             * @return {IRemoveListener} A method for removing the listener.
             */
            on(uid: string, eventName: string, listener: (ev: ILifecycleEvent) => void,
                context?: any): IRemoveListener;
            /**
             * Registers a listener for a ErrorEvent. The listener will be called when a ErrorEvent is
             * propagating over the given uid. Any number of listeners can exist for a single event name.
             *
             * @param uid A unique id to associate with the object registering the listener.
             * @param eventName The name of the event to listen to.
             * @param listener The method called when the ErrorEvent is fired.
             * @param context Optional context with which the listener will be bound.
             * @return {IRemoveListener} A method for removing the listener.
             */
            on(uid: string, eventName: 'error', listener: (ev: IErrorEvent<Error>) => void,
                context?: any): IRemoveListener;
            /**
             * Registers a listener for a ErrorEvent. The listener will be called when a ErrorEvent is
             * propagating over the given uid. Any number of listeners can exist for a single event name.
             *
             * @param uid A unique id to associate with the object registering the listener.
             * @param eventName The name of the event to listen to.
             * @param listener The method called when the ErrorEvent is fired.
             * @param context Optional context with which the listener will be bound.
             * @return {IRemoveListener} A method for removing the listener.
             */
            on(uid: string, eventName: string, listener: (ev: IErrorEvent<any>) => void,
                context?: any): IRemoveListener;
            /**
             * Registers a listener for a DispatchEvent. The listener will be called when a DispatchEvent is
             * propagating over the given uid. Any number of listeners can exist for a single event name.
             *
             * @param uid A unique id to associate with the object registering the listener.
             * @param eventName The name of the event to listen to.
             * @param listener The method called when the DispatchEvent is fired.
             * @param context Optional context with which the listener will be bound.
             * @return {IRemoveListener} A method for removing the listener.
             */
            on(uid: string, eventName: string, listener: (ev: IDispatchEvent, ...args: any[]) => void,
                context?: any): IRemoveListener;

            /**
             * Looks for listeners to a given event name, and fires the listeners using the specified
             * event direction.
             *
             * @static
             * @param name The name of the event.
             * @param sender The object sending the event.
             * @param direction='up' Equivalent to EventManager.UP.
             * @param args The arguments to send to the listeners.
             *
             * @see eventDirection
             */
            dispatch(name: string, sender: any, direction: 'up', args?: Array<any>): void;
            /**
             * Looks for listeners to a given event name, and fires the listeners using the specified
             * event direction.
             *
             * @static
             * @param name The name of the event.
             * @param sender The object sending the event.
             * @param direction='down' Equivalent to EventManager.DOWN.
             * @param args The arguments to send to the listeners.
             *
             * @see eventDirection
             */
            dispatch(name: string, sender: any, direction: 'down', args?: Array<any>): void;
            /**
             * Looks for listeners to a given event name, and fires the listeners using the specified
             * event direction.
             *
             * @static
             * @param name The name of the event.
             * @param sender The object sending the event.
             * @param direction='direct' Equivalent to EventManager.DIRECT.
             * @param args The arguments to send to the listeners.
             *
             * @see eventDirection
             */
            dispatch(name: string, sender: any, direction: 'direct', args?: Array<any>): void;
            /**
             * Looks for listeners to a given event name, and fires the listeners using the specified
             * event direction.
             *
             * @static
             * @param name The name of the event.
             * @param sender The object sending the event.
             * @param direction The eventDirection in which to send the event.
             * @param args The arguments to send to the listeners.
             *
             * @see eventDirection
             */
            dispatch(name: string, sender: any, direction: string, args?: Array<any>): void;

            /**
             * Returns whether or not the given string is a registered direction.
             */
            hasDirection(direction: string): boolean;

            sendEvent(event: IDispatchEvent, args?: Array<any>);
        }

        export function EventManagerStatic($compat, $document, $window, $ExceptionStatic) {
            EventManager.$compat = $compat;
            EventManager.$document = $document;
            EventManager.$window = $window;
            EventManager.$ExceptionStatic = $ExceptionStatic;
            return EventManager;
        }

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
        export class NavigationEvent<T, U, V> extends DispatchEvent implements INavigationEvent<T, U, V> {
            static $EventManagerStatic: IEventManagerStatic;
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
            static dispatch<T, U, V>(name: string, sender: V, eventOptions: INavigationEventOptions<T, U>) {
                var event = new NavigationEvent<T, U, V>();

                event.initialize(name, sender, null, eventOptions);
                NavigationEvent.$EventManagerStatic.sendEvent(event, []);

                return event;
            }

            /**
             * Navigation parameter, used to send objects from one view control to another.
             */
            parameter: any;

            /**
             * The INavigationOptions in use for the navigation.
             */
            options: navigation.IBaseNavigationOptions;

            /**
             * The navigation event target. Its type depends on the type of Navigation event.
             */
            target: T;

            /**
             * Specifies the type of IViewControl for the Route Event.
             */
            type: string;

            /**
             * States whether or not this event is able to be canceled. Some navigation events can be 
             * canceled, preventing further navigation.
             */
            cancelable: boolean = true;

            canceled: boolean = false;

            /**
             * Initializes the event members.
             * 
             * @param name The name of the event.
             * @param sender The object that initiated the event.
             * @param direction This will always be a direct event no matter what is sent in.
             * 
             * @see eventDirection
             */
            initialize(name: string, sender: V, direction?: string, eventOptions?: INavigationEventOptions<T, U>) {
                super.initialize(name, sender, this.$EventManagerStatic.direction.DIRECT);
                this.parameter = eventOptions.parameter;
                this.options = eventOptions.options;
                this.target = eventOptions.target;
                this.type = eventOptions.type;
            }

            /**
             * If the event is cancelable (ev.cancelable), calling this method will cancel the event.
             */
            cancel() {
                if (this.cancelable) {
                    this.canceled = true;

                    this.$EventManagerStatic.propagatingEvents[this.name] = false;
                }
            }
        }

        /**
         * Describes options for an INavigationEvent. The generic parameter specifies the 
         * target type for the event.
         */
        export interface INavigationEventOptions<T, U> {
            /**
             * Navigation parameter, used to send objects from one view control to another.
             */
            parameter: U;

            /**
             * The INavigationOptions in use for the navigation.
             */
            options: navigation.IBaseNavigationOptions;

            /**
             * The navigation event target. Its type depends on the type of Navigation event.
             */
            target: T;

            /**
             * Specifies the type of IViewControl for the Route Event.
             */
            type: string;

            /**
             * States whether or not this event is able to be canceled. Some navigation events can be 
             * canceled, preventing further navigation.
             */
            cancelable?: boolean;
        }

        export interface INavigationEvent<T, U, V> extends IDispatchEvent {
            /**
             * Navigation parameter, used to send objects from one view control to another.
             */
            parameter: U;

            /**
             * The INavigationOptions in use for the navigation.
             */
            options: navigation.IBaseNavigationOptions;

            /**
             * The navigation event target. Its type depends on the type of Navigation event.
             */
            target: T;

            /**
             * Specifies the type of IViewControl for the Route Event.
             */
            type: string;

            /**
             * The sender of the event.
             */
            sender: V;

            /**
             * States whether or not this event is able to be canceled. Some navigation events can be 
             * canceled, preventing further navigation.
             */
            cancelable?: boolean;

            /**
             * States whether or not this event has been canceled.
             */
            canceled?: boolean;

            /**
             * If the event is cancelable (ev.cancelable), calling this method will cancel the event.
             */
            cancel(): void;

            /**
             * Initializes the event members.
             * 
             * @param name The name of the event.
             * @param sender The object that initiated the event.
             * @param direction='direct' Equivalent to EventManager.DIRECT.
             * 
             * @see eventDirection
             */
            initialize(name: string, sender: V, direction?: 'direct', eventOptions?: INavigationEventOptions<T, U>);
            /**
             * Initializes the event members.
             * 
             * @param name The name of the event.
             * @param sender The object that initiated the event.
             * @param direction This will always be a direct event no matter what is sent in.
             * 
             * @see eventDirection
             */
            initialize(name: string, sender: V, direction?: string, eventOptions?: INavigationEventOptions<T, U>);
        }

        export interface INavigationEventStatic {
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
            dispatch<T, U, V>(name: string, sender: V, eventOptions: events.INavigationEventOptions<T, U>): INavigationEvent<T, U, V>;
        }

        export function NavigationEventStatic($EventManagerStatic) {
            NavigationEvent.$EventManagerStatic = $EventManagerStatic;
            return NavigationEvent;
        }

        register.injectable('$NavigationEventStatic', NavigationEventStatic, ['$EventManagerStatic'], register.injectableType.STATIC);

        /**
         * Represents an internal Error Event. This is used for any 
         * internal errors (both fatal and warnings). All error events are 
         * direct events.
         */
        export class ErrorEvent<T extends Error> extends DispatchEvent implements IErrorEvent<T> {
            static $EventManagerStatic: IEventManagerStatic;
            /**
             * Creates a new ErrorEvent and fires it.
             * 
             * @param name The name of the event.
             * @param sender The sender of the event.
             * @param error The error that occurred, resulting in the event.
             */
            static dispatch<T extends Error>(name: string, sender: any, error: T) {
                var event = new ErrorEvent<T>();

                event.initialize(name, sender, null, error);
                ErrorEvent.$EventManagerStatic.sendEvent(event);
            }

            error: T;

            /**
             * @param name The name of the event.
             * @param sender The sender of the event.
             * @param direction='direct' This is always a direct event
             * @param error The error that occurred, resulting in the event.
             */
            initialize(name: string, sender: any, direction?: 'direct', error?: T);
            /**
             * @param name The name of the event.
             * @param sender The sender of the event.
             * @param direction This is always a direct event.
             * @param error The error that occurred, resulting in the event.
             */
            initialize(name: string, sender: any, direction?: string, error?: T);
            initialize(name: string, sender: any, direction?: string, error?: T) {
                super.initialize(name, sender, this.$EventManagerStatic.direction.DIRECT);

                this.error = error;
            }
        }
    
        export function ErrorEventStatic($EventManagerStatic) {
            ErrorEvent.$EventManagerStatic = $EventManagerStatic;
            return ErrorEvent;
        }

        register.injectable('$ErrorEventStatic', ErrorEventStatic, ['$EventManagerStatic'], register.injectableType.STATIC);
    
        export interface IErrorEventStatic {
            /**
             * Creates a new ErrorEvent and fires it.
             *
             * @param name The name of the event.
             * @param sender The sender of the event.
             * @param error The error that occurred, resulting in the event.
             */
            dispatch<T extends Error>(name: string, sender: any, error: T): void;
        }

        /**
         * Defines an object that represents an Error Event. This is used for any 
         * internal errors (both fatal and warnings).
         */
        export interface IErrorEvent<T extends Error> extends IDispatchEvent {
            error: T;
        
            /**
             * @param name The name of the event.
             * @param sender The sender of the event.
             * @param direction='direct' This is always a direct event
             * @param error The error that occurred, resulting in the event.
             */
            initialize(name: string, sender: any, direction?: 'direct', error?: T);
            /**
             * @param name The name of the event.
             * @param sender The sender of the event.
             * @param direction This is always a direct event.
             * @param error The error that occurred, resulting in the event.
             */
            initialize(name: string, sender: any, direction?: string, error?: T);
        }
    }
    /**
     * Used for facilitating data and DOM manipulation. Contains lifecycle events 
     * as well as properties for communicating with other controls. This is the base
     * class for all types of controls.
     */
    export class Control implements IControl {
        static $ContextManagerStatic: observable.IContextManagerStatic;
        static $EventManagerStatic: events.IEventManagerStatic;
        
        /**
         * Finds the ancestor control for the given control that contains the root 
         * context.
         * 
         * @static
         * @param control The control with which to find the root.
         */
        static getRootControl(control: IControl): ui.ITemplateControl;
        static getRootControl(control: ui.ITemplateControl) {
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
        }

        /**
         * Given a control, calls the loaded method for the control if it exists.
         * 
         * @static
         * @param control The control to load.
         */
        static load(control: IControl) {
            if (isNull(control)) {
                return;
            }

            if (isFunction(control.loaded)) {
                control.loaded();
            }
        }

        /**
         * Disposes all the necessary memory for a control. Uses specific dispose 
         * methods related to a control's constructor if necessary.
         * 
         * @static
         * @param control The Control to dispose.
         */
        static dispose(control: IControl) {
            var ctrl = <any>control,
                ContextManager = Control.$ContextManagerStatic,
                AttributeControl = controls.AttributeControl,
                ViewControl = ui.ViewControl,
                TemplateControl = ui.TemplateControl;

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
        }

        /**
         * Splices a control from its parent's controls list. Sets the control's parent 
         * to null.
         * 
         * @static
         * @param control The control whose parent will be removed.
         */
        static removeParent(control: IControl) {
            if (isNull(control)) {
                return;
            }

            var parent = control.parent;

            if (isNull(parent)) {
                return;
            }

            var controls = parent.controls || [],
                index = controls.indexOf(control);

            if (index !== -1) {
                controls.splice(index, 1);
            }

            control.parent = null;
        }

        private static __getControls(control: IControl, method: string, key: string) {
            var controls: Array<IControl> = [],
                root = Control.getRootControl(control),
                child;

            if (!isNull(root) && root[method] === key) {
                controls.push(root);
            }

            var children = root.controls;

            if (isNull(children)) {
                return controls;
            }

            var queue: Array<IControl> = [];
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
        }

        /**
         * A read-only unique id, created during instantiation and found on every control.
         */
        uid: string;

        /**
         * The name of a control. This can be set using 'plat-name' in the DOM markup.
         * When a control is given a name using 'plat-name' the root control will be able to
         * access the control as a INamedElement<T extends HTMLElement, U extends ui.ITemplateControl> 
         * interface on the parent. In addition, named controls can be retrieved using the 
         * getControlsByName method on every control instance.
         * 
         * @see {@link Control.getControlsByName}
         */
        name: string;

        /**
         * The type of a control. The type is created when a control is registered.
         * 
         * @example register.control('my-control', MyControl) // All MyControl instances will have type 'my-control'
         */
        type: string;

        /**
         * The parent control that created this control. If this control does not implement ui.IViewControl
         * then it will inherit its context from the parent, or from plat-context when specified.
         */
        parent: ui.ITemplateControl;

        /**
         * The HTMLElement that represents this control. Should only be modified by controls that implement 
         * ui.ITemplateControl. During initialize the control should populate this element with what it wishes
         * to render to the user. 
         * 
         * When there is innerHTML in the element prior to instantiating the control:
         *     The element will include the innerHTML
         * When the control implements templateString or templateUrl:
         *     The serialized DOM will be auto-generated and included in the element. Any
         *     innerHTML will be stored in the innerTemplate property on the control.
         *    
         * After a control is initialized its element will be compiled.
         */
        element: HTMLElement;

        /**
         * The attributes object representing all the attributes for a control's element. All attributes are 
         * converted from dash notation to camelCase.
         * 
         * @see {@link ui.Attributes}
         */
        attributes: ui.IAttributes;

        /**
         * The constructor for a control. Any injectables specified during control registration will be
         * passed into the constructor as arguments as long as the control is instantiated with its associated
         * injector.
         */
        constructor() {
            Control.$ContextManagerStatic.defineGetter(this, 'uid', uniqueId('plat_'));
        }

        /**
         * The initialize event method for a control. In this method a control should initialize all the necessary 
         * variables. This method is typically only necessary for view controls. If a control does not implement 
         * ui.IViewControl then it is not safe to access, observe, or modify the context property in this method.
         * A view control should call services/set context in this method in order to fire the loaded event. No control 
         * will be loaded until the view control has specified a context.
         */
        initialize() { }

        /**
         * The loaded event method for a control. This event is fired after a control has been loaded,
         * meaning all of its children have also been loaded and initial DOM has been created and populated. It is now 
         * safe for all controls to access, observe, and modify the context property.
         */
        loaded() { }

        /**
         * Retrieves all the controls with the specified name.
         * 
         * @param name The string name with which to populate the returned controls array.
         */
        getControlsByName(name: string) {
            return Control.__getControls(this, 'name', name);
        }

        /**
         * Retrieves all the controls of the specified type.
         * 
         * @param type The type used to find controls (e.g. 'plat-foreach')
         * @return {Array<IControl>}
         */
        getControlsByType<T extends Control>(type: string): Array<T>;
        /**
         * Retrieves all the controls of the specified type.
         * 
         * @param Constructor The constructor used to find controls.
         * 
         * @example this.getControlsByType<ui.controls.ForEach>(ui.controls.ForEach)
         */
        getControlsByType<T extends Control>(Constructor: new () => T): Array<T>;
        getControlsByType(type: any): any {
            if (isString(type)) {
                return Control.__getControls(this, 'type', type);
            }
            return Control.__getControls(this, 'constructor', type);
        }

        /**
         * Parses an expression string and observes any associated identifiers. When an identifier
         * value changes, the listener will be called.
         * 
         * @param expression The expression string to watch for changes.
         * @param listener The listener to call when the expression identifer values change.
         */
        observeExpression(expression: string, listener: (value: any, oldValue: any) => void): IRemoveListener;
        /**
         * Uses a parsed expression to observe any associated identifiers. When an identifier
         * value changes, the listener will be called.
         * 
         * @param expression The IParsedExpression to watch for changes.
         * @param listener The listener to call when the expression identifer values change.
         */
        observeExpression(expression: expressions.IParsedExpression, listener: (value: any, oldValue: any) => void): IRemoveListener;
        observeExpression(expression: any, listener: (value: any, oldValue: any) => void): IRemoveListener {
            if (isNull(expression)) {
                return noop;
            } else if (!(isString(expression) || isFunction(expression.evaluate))) {
                return noop;
            }

            var parser: expressions.IParser = acquire('$parser'),
                parsedExpression: expressions.IParsedExpression = isString(expression) ? parser.parse(expression) : expression,
                aliases = parsedExpression.aliases,
                that: ui.ITemplateControl = <any>this,
                control: ui.ITemplateControl = !isNull(that.resources) ? that : that.parent,
                alias: string,
                length = aliases.length,
                resources = {},
                ContextManager = Control.$ContextManagerStatic,
                getManager = ContextManager.getManager,
                TemplateControl = ui.TemplateControl,
                findResource = TemplateControl.findResource,
                evaluateExpression = TemplateControl.evaluateExpression,
                i;

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

            var identifiers = parsedExpression.identifiers,
                contextManager = getManager(Control.getRootControl(control)),
                identifier: string,
                split: Array<string> = [],
                absolutePath = control.absoluteContextPath + '.',
                managers: IObject<observable.IContextManager> = {};

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

            var oldValue = evaluateExpression(parsedExpression, control),
                listeners = [];

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
        }

        /**
         * Evaluates an expression string, using the control.context.
         * 
         * @param expression The expression string to evaluate.
         * @param context An optional context with which to parse. If 
         * no context is specified, the control.context will be used.
         */
        evaluateExpression(expression: string, context?: any);
        /**
         * Evaluates a parsed expression, using the control.context.
         * 
         * @param expression The IParsedExpression to evaluate.
         * @param context An optional context with which to parse. If 
         * no context is specified, the control.context will be used.
         */
        evaluateExpression(expression: expressions.IParsedExpression, context?: any);
        evaluateExpression(expression: any, context?: any) {
            var TemplateControl = ui.TemplateControl;
            return TemplateControl.evaluateExpression(expression, this.parent, context);
        }

        /**
         * Creates a new DispatchEvent and propagates it to controls based on the 
         * provided direction mechanism. Controls in the propagation chain that registered
         * the event using the control.on() method will receive the event. Propagation will
         * always start with the sender, so the sender can both produce and consume the same
         * event.
         * 
         * @param name The name of the event to send, cooincides with the name used in the
         * control.on() method.
         * @param direction An optional events.eventDirection to propagate the event, defaults to
         * events.EventManager.UP.
         * @param ...args Any number of arguments to send to all the listeners.
         * 
         * @see events.eventDirection
         */
        dispatchEvent(name: string, direction?: string, ...args: any[]);
        /**
         * Creates a new DispatchEvent and propagates it to controls based on the 
         * provided direction mechanism. Controls in the propagation chain that registered
         * the event using the control.on() method will receive the event. Propagation will
         * always start with the sender, so the sender can both produce and consume the same
         * event.
         * 
         * @param name The name of the event to send, cooincides with the name used in the
         * control.on() method.
         * @param direction='up' Equivalent to events.EventManager.UP
         * @param ...args Any number of arguments to send to all the listeners.
         * 
         * @see events.eventDirection
         */
        dispatchEvent(name: string, direction?: 'up', ...args: any[]);
        /**
         * Creates a new DispatchEvent and propagates it to controls based on the 
         * provided direction mechanism. Controls in the propagation chain that registered
         * the event using the control.on() method will receive the event. Propagation will
         * always start with the sender, so the sender can both produce and consume the same
         * event.
         * 
         * @param name The name of the event to send, cooincides with the name used in the
         * control.on() method.
         * @param direction='down' Equivalent to events.EventManager.DOWN
         * @param ...args Any number of arguments to send to all the listeners.
         * 
         * @see events.eventDirection
         */
        dispatchEvent(name: string, direction?: 'down', ...args: any[]);
        /**
         * Creates a new DispatchEvent and propagates it to controls based on the 
         * provided direction mechanism. Controls in the propagation chain that registered
         * the event using the control.on() method will receive the event. Propagation will
         * always start with the sender, so the sender can both produce and consume the same
         * event.
         * 
         * @param name The name of the event to send, cooincides with the name used in the
         * control.on() method.
         * @param direction='direct' Equivalent to events.EventManager.DIRECT
         * @param ...args Any number of arguments to send to all the listeners.
         * 
         * @see events.eventDirection
         */
        dispatchEvent(name: string, direction?: 'direct', ...args: any[]);
        dispatchEvent(name: string, direction?: string, ...args: any[]) {
            var manager = Control.$EventManagerStatic;

            if (!manager.hasDirection(direction)) {
                if (!isUndefined(direction)) {
                    args.unshift(direction);
                }
                direction = manager.direction.UP;
            }
            var sender: any = this;

            if (!isNull(sender.templateControl)) {
                sender = sender.templateControl;
            }

            manager.dispatch(name, sender, direction, args);
        }

        /**
         * Registers a listener for a DispatchEvent. The listener will be called when a DispatchEvent is 
         * propagating over the control. Any number of listeners can exist for a single event name.
         * 
         * @param name The name of the event, cooinciding with the DispatchEvent name.
         * @param listener The method called when the DispatchEvent is fired.
         */
        on(name: string, listener: (ev: events.IDispatchEvent, ...args: any[]) => void): IRemoveListener;
        /**
         * Registers a listener for a routeChange event. The listener will be called when a routeChange event 
         * is propagating over the control. Any number of listeners can exist for a single event name.
         *
         * @param eventName='routeChange' This specifies that the listener is for a routeChange event.
         * @param listener The method called when the routeChange is fired. The route argument will contain 
         * a parsed route.
         */
        on(name: 'routeChange', listener: (ev: events.IDispatchEvent, route: web.IRoute<any>) => void): IRemoveListener;
        /**
         * Registers a listener for a DispatchEvent. The listener will be called when a DispatchEvent is 
         * propagating over the control. Any number of listeners can exist for a single event name.
         * 
         * @param name The name of the event, cooinciding with the DispatchEvent name.
         * @param listener The method called when the DispatchEvent is fired.
         */
        on(name: string, listener: (ev: events.IDispatchEvent, ...args: any[]) => void): IRemoveListener {
            var manager = Control.$EventManagerStatic;
            return manager.on(this.uid, name, listener, this);
        }

        /**
         * The dispose event is called when a control is being removed from memory. A control should release 
         * all of the memory it is using, including DOM event and property listeners.
         */
        dispose() { }
    }

    export function ControlStatic($ContextManagerStatic, $EventManagerStatic) {
        Control.$ContextManagerStatic = $ContextManagerStatic;
        Control.$EventManagerStatic = $EventManagerStatic;
        return Control;
    }

    register.injectable('$ControlStatic', ControlStatic, [
        '$ContextManagerStatic',
        '$EventManagerStatic'
    ], register.injectableType.STATIC);

    export interface IControlStatic {
        /**
         * Finds the ancestor control for the given control that contains the root
         * context.
         *
         * @static
         * @param control The control with which to find the root.
         * @return {ui.ITemplateControl}
         */
        getRootControl(control: IControl): ui.ITemplateControl;
        getRootControl(control: ui.ITemplateControl): ui.ITemplateControl;

        /**
         * Given a control, calls the loaded method for the control if it exists.
         *
         * @static
         * @param control The control to load.
         */
        load(control: IControl): void;

        /**
         * Disposes all the necessary memory for a control. Uses specific dispose
         * methods related to a control's constructor if necessary.
         *
         * @static
         * @param control The Control to dispose.
         */
        dispose(control: IControl): void;

        /**
         * Splices a control from its parent's controls list. Sets the control's parent
         * to null.
         *
         * @static
         * @param control The control whose parent will be removed.
         */
        removeParent(control: IControl): void;

        /**
         * Create a new empty IControl
         */
        new (): IControl;
    }

    /**
     * Describes an object used for facilitating data and DOM manipulation. Contains lifecycle events 
     * as well as properties for communicating with other IControls.
     */
    export interface IControl {
        /**
         * A unique id, created during instantiation and found on every IControl.
         */
        uid: string;

        /**
         * The name of an IControl.
         */
        name?: string;

        /**
         * The type of an IControl.
         */
        type?: string;

        /**
         * The parent control that created this control. If this control does not implement ui.IViewControl
         * then it will inherit its context from the parent.
         */
        parent?: ui.ITemplateControl;

        /**
         * The HTMLElement that represents this IControl. Should only be modified by controls that implement 
         * ui.ITemplateControl. During initialize the control should populate this element with what it wishes
         * to render to the user. 
         * 
         * When there is innerHTML in the element prior to instantiating the control:
         *     The element will include the innerHTML
         * When the control implements templateString or templateUrl:
         *     The serialized DOM will be auto-generated and included in the element. Any
         *     innerHTML will be stored in the innerTemplate property on the control.
         *    
         * After an IControl is initialized its element will be compiled.
         */
        element?: HTMLElement;

        /**
         * The attributes object representing all the attributes for an IControl's element. All attributes are 
         * converted from dash notation to camelCase.
         * 
         * @see {@link ui.Attributes}
         */
        attributes?: ui.IAttributes;

        /**
         * The initialize event method for a control. In this method a control should initialize all the necessary 
         * variables. This method is typically only necessary for view controls. If a control does not implement 
         * ui.IViewControl then it is not safe to access, observe, or modify the context property in this method.
         * A view control should call services/set context in this method in order to fire the loaded event. No control 
         * will be loaded until the view control has specified a context.
         */
        initialize? (): void;

        /**
         * The loaded event method for a control. This event is fired after a control has been loaded,
         * meaning all of its children have also been loaded and initial DOM has been created and populated. It is now 
         * safe for all controls to access, observe, and modify the context property.
         */
        loaded? (): void;

        /**
         * Retrieves all the controls with the specified name.
         * 
         * @param name The string name with which to populate the returned controls array.
         */
        getControlsByName? (name: string): Array<IControl>;

        /**
         * Retrieves all the controls of the specified type.
         * 
         * @param type The type used to find controls (e.g. 'plat-foreach')
         */
        getControlsByType? <T extends IControl>(type: string): Array<T>;
        /**
         * Retrieves all the controls of the specified type.
         * 
         * @param Constructor The constructor used to find controls.
         * 
         * @example this.getControlsByType<ui.controls.ForEach>(ui.controls.ForEach)
         */
        getControlsByType? <T extends IControl>(Constructor: new () => T): Array<T>;

        /**
         * Parses an expression string and observes any associated identifiers. When an identifier
         * value changes, the listener will be called.
         * 
         * @param expression The expression string to watch for changes.
         * @param listener The listener to call when the expression identifer values change.
         */
        observeExpression(expression: string, listener: (value: any, oldValue: any) => void): IRemoveListener;
        /**
         * Uses a parsed expression to observe any associated identifiers. When an identifier
         * value changes, the listener will be called.
         * 
         * @param expression The IParsedExpression to watch for changes.
         * @param listener The listener to call when the expression identifer values change.
         */
        observeExpression(expression: expressions.IParsedExpression, listener: (value: any, oldValue: any) => void): IRemoveListener;

        /**
         * Evaluates an expression string, using the control.context.
         * 
         * @param expression The expression string to evaluate.
         * @param context An optional context with which to parse. If 
         * no context is specified, the control.context will be used.
         */
        evaluateExpression(expression: string, context?: any);
        /**
         * Evaluates a parsed expression, using the control.context.
         * 
         * @param expression The IParsedExpression to evaluate.
         * @param context An optional context with which to parse. If 
         * no context is specified, the control.context will be used.
         */
        evaluateExpression(expression: expressions.IParsedExpression, context?: any);

        /**
         * Creates a new DispatchEvent and propagates it to controls based on the 
         * provided direction mechanism. Controls in the propagation chain that registered
         * the event using the control.on() method will receive the event. Propagation will
         * always start with the sender, so the sender can both produce and consume the same
         * event.
         * 
         * @param name The name of the event to send, cooincides with the name used in the
         * control.on() method.
         * @param direction='up' Equivalent to events.EventManager.UP
         * @param ...args Any number of arguments to send to all the listeners.
         * 
         * @see events.eventDirection
         */
        dispatchEvent(name: string, direction?: 'up', ...args: any[]);
        /**
         * Creates a new DispatchEvent and propagates it to controls based on the 
         * provided direction mechanism. Controls in the propagation chain that registered
         * the event using the control.on() method will receive the event. Propagation will
         * always start with the sender, so the sender can both produce and consume the same
         * event.
         * 
         * @param name The name of the event to send, cooincides with the name used in the
         * control.on() method.
         * @param direction='down' Equivalent to events.EventManager.DOWN
         * @param ...args Any number of arguments to send to all the listeners.
         * 
         * @see events.eventDirection
         */
        dispatchEvent(name: string, direction?: 'down', ...args: any[]);
        /**
         * Creates a new DispatchEvent and propagates it to controls based on the 
         * provided direction mechanism. Controls in the propagation chain that registered
         * the event using the control.on() method will receive the event. Propagation will
         * always start with the sender, so the sender can both produce and consume the same
         * event.
         * 
         * @param name The name of the event to send, cooincides with the name used in the
         * control.on() method.
         * @param direction='direct' Equivalent to events.EventManager.DIRECT
         * @param ...args Any number of arguments to send to all the listeners.
         * 
         * @see events.eventDirection
         */
        dispatchEvent(name: string, direction?: 'direct', ...args: any[]);
        /**
         * Creates a new DispatchEvent and propagates it to controls based on the 
         * provided direction mechanism. Controls in the propagation chain that registered
         * the event using the control.on() method will receive the event. Propagation will
         * always start with the sender, so the sender can both produce and consume the same
         * event.
         * 
         * @param name The name of the event to send, cooincides with the name used in the
         * control.on() method.
         * @param direction An optional events.eventDirection to propagate the event, defaults to
         * events.EventManager.UP.
         * @param ...args Any number of arguments to send to all the listeners.
         * 
         * @see events.eventDirection
         */
        dispatchEvent(name: string, direction?: string, ...args: any[]);

        /**
         * Registers a listener for a routeChange event. The listener will be called when a routeChange event 
         * is propagating over the control. Any number of listeners can exist for a single event name.
         *
         * @param eventName='routeChange' This specifies that the listener is for a routeChange event.
         * @param listener The method called when the routeChange is fired. The route argument will contain 
         * a parsed route.
         */
        on(name: 'routeChange', listener: (ev: events.IDispatchEvent, route: web.IRoute<any>) => void): IRemoveListener;
        /**
         * Registers a listener for a DispatchEvent. The listener will be called when a DispatchEvent is 
         * propagating over the control. Any number of listeners can exist for a single event name.
         * 
         * @param name The name of the event, cooinciding with the DispatchEvent name.
         * @param listener The method called when the DispatchEvent is fired.
         */
        on(name: string, listener: (ev: events.IDispatchEvent, ...args: any[]) => void): IRemoveListener;

        /**
         * The dispose event is called when a control is being removed from memory. A control should release 
         * all of the memory it is using, including DOM event and property listeners.
         */
        dispose? (): void;
    }

    export module controls {
        export class AttributeControl extends Control {
            /**
             * Method for disposing an attribute control. Removes any 
             * necessary objects from the control.
             * 
             * @static
             * @param control The AttributeControl to dispose.
             */
            static dispose(control: IAttributeControl) {
                control.templateControl = null;
                delete control.templateControl;

                Control.dispose(control);
            }

            /**
             * Specifies the ITemplateControl associated with this
             * control's element. Can be null if no ITemplateControl
             * exists.
             */
            templateControl: ui.ITemplateControl = null;

            /**
             * Specifies the priority of the attribute. The purpose of 
             * this is so that controls like plat-bind can have a higher 
             * priority than plat-tap. The plat-bind will be initialized 
             * and loaded before plat-tap, meaning it has the first chance 
             * to respond to events.
             */
            priority = 0;
        }

        export function AttributeControlStatic($ControlStatic) {
            return AttributeControl;
        }

        register.injectable('$AttributeControlStatic', AttributeControlStatic, null, register.injectableType.STATIC);

        export interface IAttributeControlClass {
            /**
             * Method for disposing an attribute control. Removes any
             * necessary objects from the control.
             *
             * @static
             * @param control The AttributeControl to dispose.
             */
            dispose(control: IAttributeControl): void;

            /**
             * Create a new empty IAttributeControl
             */
            new (): IAttributeControl;
        }

        export interface IAttributeControl extends IControl {
            /**
             * Specifies the ITemplateControl associated with this
             * control's element. Can be null if no ITemplateControl
             * exists.
             */
            templateControl: ui.ITemplateControl;

            /**
             * Specifies the priority of the attribute. The purpose of 
             * this is so that controls like plat-bind can have a higher 
             * priority than plat-tap. The plat-bind will be initialized 
             * and loaded before plat-tap, meaning it has the first chance 
             * to respond to events.
             */
            priority: number;
        }

        export class Name extends AttributeControl {
            $ContextManagerStatic: observable.IContextManagerStatic = acquire('$ContextManagerStatic');
            $ExceptionStatic: IExceptionStatic = acquire('$ExceptionStatic');
            /**
             * The root control that will have the INamedElement set as a property.
             */
            _rootControl: ui.ITemplateControl;

            /**
             * The property name on the root control to set as the INamedElement.
             */
            _label: string;

            /**
             * Finds the root control and defines the property specified by the 
             * attribute value as the INamedElement.
             */
            initialize() {
                var attr = camelCase(this.type),
                    name = this.attributes[attr];

                if (isEmpty(name)) {
                    return;
                }

                this._label = name;

                var templateControl = this.templateControl,
                    rootControl = this._rootControl = Control.getRootControl(this.parent),
                    define = this.$ContextManagerStatic.defineGetter;

                if (!isNull(templateControl)) {
                    define(templateControl, 'name', name, true, true);
                }

                if (!isNull(rootControl)) {
                    if (!isNull(rootControl[name])) {
                        this.$ExceptionStatic.warn('Multiple instances of plat-name = ' +
                            name + ' found, or root control already has property defined.', this.$ExceptionStatic.NAME);
                        return;
                    }

                    define(rootControl, name, {
                        element: this.element,
                        control: templateControl
                    }, true, true);
                }
            }

            /**
             * Removes the INamedElement from the root control.
             */
            dispose() {
                var rootControl = this._rootControl,
                    name = this._label;

                if (!isNull(rootControl)) {
                    this.$ContextManagerStatic.defineProperty(rootControl, name, null, true, true);
                    delete rootControl[name];
                }
            }
        }

        register.control('plat-name', Name);

        /**
         * Defines the object added to a root control when an HTML element has 
         * a plat-name attribute. If the element corresponds to a registered 
         * control, the control will be included in the object.
         */
        export interface INamedElement<T extends HTMLElement, U> {
            /**
             * The element on which the plat-name is specified.
             */
            element: T;

            /**
             * The template control on the associated element, if one 
             * exists.
             */
            control?: U;
        }

        export class SimpleEventControl extends AttributeControl implements ISimpleEventControl {
            /**
             * The event name.
             */
            event: string;

            /**
             * The camel-cased name of the control as it appears as an attribute.
             */
            attribute: string;

            /**
             * Our event handler bound to our own context.
             */
            _listener: any;

            /**
             * A parsed form of the expression found in the attribute's value.
             */
            _expression: Array<string> = [];

            /**
             * An array of the aliases used in the expression.
             */
            _aliases: Array<string> = [];
            $parser: expressions.IParser = acquire('$parser');
            $regex: expressions.IRegex = acquire('$regex');
            $ExceptionStatic: IExceptionStatic = acquire('$ExceptionStatic');

            /**
             * Kicks off finding and setting the listener.
             */
            loaded() {
                if (isNull(this.element)) {
                    return;
                }

                this.attribute = camelCase(this.type);
                this._setListener();
            }

            /**
             * Disposes of the event listener.
             */
            dispose() {
                if (isNull(this._listener) || isNull(this.element)) {
                    return;
                }
                this.element.removeEventListener(this.event, this._listener);
                this._listener = null;
            }

            /**
             * Adds the event listener to the element.
             */
            _addEventListener() {
                this._listener = this._onEvent.bind(this);
                this.element.addEventListener(this.event, this._listener, false);
            }

            /**
             * Sets the event listener.
             */
            _setListener() {
                var attr = this.attribute;
                if (isEmpty(this.event) || isEmpty(attr)) {
                    return;
                }

                this._parseArgs(this.attributes[attr]);

                if (isNull(this._expression)) {
                    return;
                }

                this._addEventListener();
            }

            /**
             * Finds the first instance of the specified function 
             * in the parent control chain.
             * 
             * @param identifier the function identifer
             */
            _findListener(identifier: string) {
                var control: IControl = this,
                    expression = this.$parser.parse(identifier),
                    value;

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
            }

            /**
             * Constructs the function to evaluate with 
             * the evaluated arguments taking resources 
             * into account.
             */
            _buildExpression() {
                var expression = this._expression.slice(0),
                    hasParent = !isNull(this.parent),
                    aliases = hasParent ? this.parent.getResources(this._aliases) : null,
                    listenerStr = expression.shift(),
                    listener,
                    control,
                    fn;

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

                var length = expression.length,
                    args = [],
                    parser = this.$parser;

                for (var i = 0; i < length; ++i) {
                    args.push(parser.parse(expression[i]).evaluate(hasParent ? this.parent.context : null, aliases));
                }

                return {
                    fn: fn,
                    control: control,
                    args: args
                };
            }

            /**
             * Calls the specified function when the DOM event is fired.
             * 
             * @param ev The event object.
             */
            _onEvent(ev: any) {
                var expression = this._buildExpression(),
                    fn = expression.fn,
                    control = expression.control,
                    args = expression.args;

                if (!isFunction(fn)) {
                    this.$ExceptionStatic.warn('Cannot find registered event method ' +
                        this._expression[0] + ' for control: ' + this.type);
                    return;
                }

                fn.apply(control, args.concat(ev));
            }

            /**
             * Finds all alias contained within the expression.
             * 
             * @param arguments The array of arguments as strings.
             */
            _findAliases(arguments: Array<string>) {
                var length = arguments.length,
                    arg: string,
                    alias: string,
                    exec: RegExpExecArray,
                    aliases = {},
                    aliasRegex = this.$regex.aliasRegex;

                for (var i = 0; i < length; ++i) {
                    arg = arguments[i].trim();

                    if (arg[0] === '@') {
                        exec = aliasRegex.exec(arg);
                        aliases[!isNull(exec) ? exec[0] : arg.substr(1)] = true;
                    }
                }

                return Object.keys(aliases);
            }

            /**
             * Parses the expression and separates the function 
             * from its arguments.
             * 
             * @param expression The expression to parse.
             */
            _parseArgs(expression: string) {
                var exec = this.$regex.argumentRegex.exec(expression),
                    haveArgs = !isNull(exec);

                if (isEmpty(expression)) {
                    return;
                }

                if (haveArgs) {
                    this._expression = [expression.slice(0, exec.index)]
                        .concat((exec[1] !== '') ? exec[1].split(',') : []);
                } else {
                    this._expression.push(expression);
                }

                this._aliases = this._findAliases(this._expression);
            }
        }

        export interface ISimpleEventControl extends IControl {
            /**
             * The event name.
             */
            event: string;

            /**
             * The camel-cased name of the control as it appears as an attribute.
             */
            attribute: string;
        }

        export class Tap extends SimpleEventControl {
            /**
             * The event name.
             */
            event: string = 'click';
        }

        export class Blur extends SimpleEventControl {
            /**
             * The event name.
             */
            event: string = 'blur';
        }

        export class Change extends SimpleEventControl {
            /**
             * The event name.
             */
            event: string = 'change';
        }

        export class Copy extends SimpleEventControl {
            /**
             * The event name.
             */
            event: string = 'copy';
        }

        export class Cut extends SimpleEventControl {
            /**
             * The event name.
             */
            event: string = 'cut';
        }

        export class Paste extends SimpleEventControl {
            /**
             * The event name.
             */
            event: string = 'paste';
        }

        export class Dbltap extends SimpleEventControl {
            /**
             * The event name.
             */
            event: string = 'dblclick';
        }

        export class Focus extends SimpleEventControl {
            /**
             * The event name.
             */
            event: string = 'focus';
        }

        export class Mouseenter extends SimpleEventControl {
            /**
             * The event name.
             */
            event: string = 'mouseenter';
        }

        export class Mouseleave extends SimpleEventControl {
            /**
             * The event name.
             */
            event: string = 'mouseleave';
        }

        export class Mousedown extends SimpleEventControl {
            /**
             * The event name.
             */
            event: string = 'mousedown';
        }

        export class Mouseup extends SimpleEventControl {
            /**
             * The event name.
             */
            event: string = 'mouseup';
        }

        export class Mouseover extends SimpleEventControl {
            /**
             * The event name.
             */
            event: string = 'mouseover';
        }

        export class Mousemove extends SimpleEventControl {
            /**
             * The event name.
             */
            event: string = 'mousemove';
        }

        export class Submit extends SimpleEventControl {
            /**
             * The event name.
             */
            event: string = 'submit';

            /**
             * Prevents the default submit action unless 
             * the "action" attribute is present.
             * 
             * @param ev The event object.
             */
            _onEvent(ev: Event) {
                if (!this.element.hasAttribute('action')) {
                    ev.preventDefault();
                }

                super._onEvent(ev);
            }
        }

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
        export var KeyCodes = {
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

        export class KeyCodeEventControl extends SimpleEventControl implements IKeyCodeEventControl {
            /**
             * An object keyed by keyCode with options as key values.
             */
            keyCodes: IObject<{ shifted?: boolean; }>;

            /**
             * Checks if the IKeyboardEventInput is an expression object 
             * and sets the necessary listener.
             */
            _setListener() {
                var attr = this.attribute;
                if (isEmpty(this.event) || isEmpty(attr)) {
                    return;
                }

                var expression = this.attributes[attr].trim();
            
                if (expression[0] === '{') {
                    var eventObject: IKeyboardEventInput = this.evaluateExpression(expression) ||
                        { method: '', key: null },
                        key = eventObject.key,
                        keys = eventObject.keys;

                    this._parseArgs(eventObject.method);

                    if (isNull(key) && isNull(keys)) {
                        this.attributes[attr] = eventObject.method;

                        this._setKeyCodes();
                        super._setListener();
                        return;
                    }

                    keys = isArray(keys) ? keys : [key];
                    this._setKeyCodes(keys);
                    this._addEventListener();

                    return;
                }

                this._setKeyCodes();
                super._setListener();
            }

            /**
             * Matches the event's keyCode if necessary and then handles the event if 
             * a match is found or if there are no filter keyCodes.
             * 
             * @param ev The keyboard event object.
             */
            _onEvent(ev: KeyboardEvent) {
                var keyCodes = this.keyCodes;

                if (isEmpty(keyCodes) || !isUndefined(keyCodes[ev.keyCode])) {
                    super._onEvent(ev);
                }
            }

            /**
             * Sets the defined key codes as they correspond to 
             * the KeyCodes map.
             * 
             * @param keys The array of defined keys to satisfy the 
             * key press condition.
             */
            _setKeyCodes(keys: Array<string> = []) {
                var length = keys.length,
                    key,
                    keyCodes = this.keyCodes;

                if (!isArray(keyCodes)) {
                    keyCodes = this.keyCodes = {};
                }

                for (var i = 0; i < length; ++i) {
                    key = keys[i];

                    keyCodes[isNumber(key) ? key : KeyCodes[key]] = {};
                }
            }
        }

        export interface IKeyCodeEventControl extends ISimpleEventControl {
            /**
             * An object keyed by keyCode with options as key values.
             */
            keyCodes: IObject<{ shifted?: boolean; }>;
        }

        /**
         * The available options for plat.controls.KeyCodeEventControl.
         */
        export interface IKeyboardEventInput {
            /**
             * The method to call when the 
             * condition is satisfied.
             */
            method: string;

            /**
             * The key to satisfy the press 
             * condition. Can be specified 
             * either as a numeric key code 
             * or a string representation 
             * as seen by the KeyCodes mapping.
             */
            key?: string;

            /**
             * An optional array of keys 
             * if more than one key can 
             * satisfy the condition.
             */
            keys?: Array<string>;
        }

        export class Keydown extends KeyCodeEventControl {
            /**
             * The event name.
             */
            event: string = 'keydown';
        }

        export class Keypress extends KeyCodeEventControl {
            /**
             * The event name.
             */
            event: string = 'keydown';

            /**
             * Filters only 'printing keys' (a-z, 0-9, and special characters)
             * 
             * @param ev The keyboard event object.
             */
            _onEvent(ev: KeyboardEvent) {
                var keyCode = ev.keyCode;

                if ((keyCode >= 48 && keyCode <= 90) ||
                    (keyCode >= 186) ||
                    (keyCode >= 96 && keyCode <= 111)) {
                    super._onEvent(ev);
                }
            }
        }

        export class Keyup extends KeyCodeEventControl {
            /**
             * The event name.
             */
            event: string = 'keyup';
        }

        register.control('plat-keydown', Keydown);
        register.control('plat-keypress', Keypress);
        register.control('plat-keyup', Keyup);

        export class SetAttributeControl extends AttributeControl implements ISetAttributeControl {
            /**
             * The corresponding attribute to set on the element.
             */
            property: string;

            /**
             * The camel-cased name of the control as it appears as an attribute.
             */
            attribute: string;

            /**
             * The function for removing the attribute changed listener.
             */
            private __removeListener: IRemoveListener;

            /**
             * Sets the corresponding attribute {property} value and 
             * observes the attribute for changes.
             */
            loaded() {
                if (isNull(this.element)) {
                    return;
                }

                this.attribute = camelCase(this.type);
                this.setter();
                this.__removeListener = this.attributes.observe(this.attribute, this.setter);
            }

            /**
             * Resets the corresponding attribute {property} value upon 
             * a change of context.
             */
            contextChanged() {
                if (isNull(this.element)) {
                    return;
                }

                this.setter();
            }

            /**
             * Stops listening to attribute changes.
             */
            dispose() {
                if (isFunction(this.__removeListener)) {
                    this.__removeListener();
                    this.__removeListener = null;
                }
            }

            /**
             * The function for setting the corresponding 
             * attribute {property} value.
             */
            setter() {
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
            }
        }

        export interface ISetAttributeControl extends IControl {
            /**
             * The corresponding attribute to set on the element.
             */
            property: string;

            /**
             * The camel-cased name of the control as it appears as an attribute.
             */
            attribute: string;

            /**
             * The function for setting the corresponding 
             * attribute {property} value.
             */
            setter(): void;
        }

        export class Checked extends SetAttributeControl {
            property: string = 'checked';
        }

        export class Disabled extends SetAttributeControl {
            property: string = 'disabled';
        }

        export class Selected extends SetAttributeControl {
            property: string = 'selected';
        }

        export class Readonly extends SetAttributeControl {
            property: string = 'readonly';
        }

        export class Open extends SetAttributeControl {
            property: string = 'open';
        }

        export class Visible extends SetAttributeControl {
            private __initialDisplay: string;
            /**
             * Obtains the initial visibility of the item 
             * based on it's initial display.
             */
            initialize() {
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
            }

            /**
             * Evaluates boolean expression and sets the display.
             */
            setter() {
                var expression: string = this.attributes[this.attribute],
                    style = this.element.style;

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
            }
        }

        export class Style extends SetAttributeControl {
            /**
             * Sets the evaluated styles on the element.
             */
            setter() {
                var expression: string = this.attributes[this.attribute];

                if (isEmpty(expression)) {
                    return;
                }

                var attributes = expression.split(';'),
                    elementStyle = this.element.style,
                    length = attributes.length,
                    splitStyles,
                    styleType,
                    styleValue;

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
            }
        }

        register.control('plat-checked', Checked);
        register.control('plat-disabled', Disabled);
        register.control('plat-selected', Selected);
        register.control('plat-readonly', Readonly);
        register.control('plat-open', Open);
        register.control('plat-visible', Visible);
        register.control('plat-style', Style);

        export class ElementPropertyControl extends SetAttributeControl {
            /**
             * The function for setting the corresponding 
             * attribute {property} value to the evaluated expression.
             */
            setter() {
                var element = this.element,
                    elementProperty = this.property,
                    expression = this.attributes[this.attribute];

                if (isEmpty(expression) || isNull(element)) {
                    return;
                }

                if (!isUndefined(element[elementProperty])) {
                    element[elementProperty] = expression;
                }
            }
        }

        export class Href extends ElementPropertyControl {
            /**
             * The corresponding attribute to set on the element.
             */
            property: string = 'href';
        }

        export class Src extends ElementPropertyControl {
            /**
             * The corresponding attribute to set on the element.
             */
            property: string = 'src';
        }

        export class Srcset extends ElementPropertyControl {
            /**
             * The corresponding attribute to set on the element.
             */
            property: string = 'srcset';
        }
    
        export class Value extends ElementPropertyControl {
            /**
             * The corresponding attribute to set on the element.
             */
            property: string = 'value';
        }

        register.control('plat-href', Href);
        register.control('plat-src', Src);
        register.control('plat-srcset', Srcset);
        register.control('plat-value', Value);

        export class Bind extends AttributeControl {
            /**
             * The priority of Bind is set high to take precede 
             * other controls that may be listening to the same 
             * event.
             */
            priority: number = 100;
            $parser: expressions.IParser = acquire('$parser');
            $ExceptionStatic: IExceptionStatic = acquire('$ExceptionStatic');
            /**
             * The function used to add the proper event based on the input type.
             */
            _addEventType: () => void;

            /**
             * The function used to get the bound value.
             */
            _getter: any;

            /**
             * The function used to set the bound value.
             */
            _setter: any;

            /**
             * An array of functions to remove the event listeners attached 
             * to this element.
             */
            _removeEventListeners: Array<IRemoveListener> = [];

            /**
             * The event listener attached to this element.
             */
            _eventListener: () => void;

            /**
             * The event listener as a postponed function.
             */
            _postponedEventListener: () => void;

            /**
             * The expression to evaluate as the bound value.
             */
            _expression: expressions.IParsedExpression;

            /**
             * The IParsedExpression used to evaluate the context 
             * of the bound property.
             */
            _contextExpression: expressions.IParsedExpression;

            /**
             * The bound property name.
             */
            _property: string;

            /**
             * Determines the type of HTMLElement being bound to 
             * and sets the necessary handlers.
             */
            initialize() {
                this._determineType();
            }

            /**
             * Parses and watches the expression being bound to.
             */
            loaded() {
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
                        evaluate: () => {
                            return this.parent.context;
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
            }

            /**
             * Re-observes the expression with the new context.
             */
            contextChanged() {
                this._watchExpression();
            }

            /**
             * Removes all of the element's event listeners.
             */
            dispose() {
                var element = this.element;

                if (!isNull(element)) {
                    var removeListeners = this._removeEventListeners,
                        length = removeListeners.length;

                    for (var i = 0; i < length; ++i) {
                        removeListeners[i]();
                    }

                    this._removeEventListeners = null;
                }

                this._eventListener = null;
                this._postponedEventListener = null;
                this._addEventType = null;
            }

            /**
             * Adds a text event as the event listener. 
             * Used for textarea and input[type=text].
             */
            _addTextEventListener() {
                var composing = false,
                    timeout;

                this._eventListener = () => {
                    if (composing) {
                        return;
                    }

                    this._propertyChanged();
                };

                this._postponedEventListener = function () {
                    if (!!timeout) {
                        return;
                    }

                    timeout = postpone(() => {
                        this._eventListener();
                        timeout = null;
                    });
                };

                this._addEventListener('compositionstart', () => composing = true);

                this._addEventListener('compositionend', () => composing = false);

                this._addEventListener('keydown', (ev?: KeyboardEvent) => {
                    var key = ev.keyCode,
                        codes = KeyCodes;

                    if (key === codes.lwk ||
                        key === codes.rwk ||
                        (key > 15 && key < 28) ||
                        (key > 32 && key < 41)) {
                        return;
                    }

                    this._postponedEventListener();
                });
                this._addEventListener('cut', null, true);
                this._addEventListener('paste', null, true);
                this._addEventListener('change');
            }

            /**
             * Adds a change event as the event listener. 
             * Used for select, input[type=radio], and input[type=range].
             */
            _addChangeEventListener() {
                this._eventListener = this._propertyChanged.bind(this);
                this._addEventListener('change');
            }

            /**
             * Adds the event listener to the element.
             * 
             * @param event The event type
             * @param listener The event listener
             * @param postpone Whether or not to postpone the event listener
             */
            _addEventListener(event: string, listener?: () => void, postpone?: boolean) {
                var listener = listener ||
                    (!!postpone ? this._postponedEventListener : this._eventListener);

                this._pushRemoveEventListener(event, listener);

                this.element.addEventListener(event, listener, false);
            }

            /**
             * Getter for input[type=checkbox] and input[type=radio]
             */
            _getChecked() {
                return (<HTMLInputElement>this.element).checked;
            }

            /**
             * Getter for input[type=text], input[type=range], 
             * textarea, and select.
             */
            _getValue() {
                return (<HTMLInputElement>this.element).value;
            }

            /**
             * Setter for textarea, input[type=text], 
             * and input[type=button]
             * 
             * @param newValue The new value to set
             */
            _setText(newValue: any) {
                if (isNull(newValue)) {
                    newValue = '';
                }

                this.__setValue(newValue);
            }

            /**
             * Setter for input[type=range]
             * 
             * @param newValue The new value to set
             */
            _setRange(newValue: any) {
                if (isEmpty(newValue)) {
                    newValue = 0;
                }

                this.__setValue(newValue);
            }

            /**
             * Setter for input[type=checkbox] and input[type=radio]
             * 
             * @param newValue The new value to set
             */
            _setChecked(newValue: any) {
                (<HTMLInputElement>this.element).checked = !(newValue === false);
            }

            /**
             * Setter for select
             * 
             * @param newValue The new value to set
             */
            _setSelectedIndex(newValue: any) {
                (<HTMLSelectElement>this.element).value = newValue;
            }

            /**
             * Determines the type of HTMLElement being bound to 
             * and sets the necessary handlers.
             */
            _determineType() {
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
                        switch ((<HTMLInputElement>element).type) {
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
                        var options = (<HTMLSelectElement>element).options,
                            length = options.length,
                            option: HTMLSelectElement;

                        for (var i = 0; i < length; ++i) {
                            option = options[i];
                            if (!option.hasAttribute('value')) {
                                option.setAttribute('value', option.textContent);
                            }
                        }
                        break;
                }
            }

            /**
             * Observes the expression to bind to.
             */
            _watchExpression() {
                var expression = this._expression;
                this.observeExpression(expression, this._setter);
                this._setter(this.parent.evaluateExpression(expression));
            }

            /**
             * Pushes a new function for removing a newly added 
             * event listener.
             * 
             * @param event The event type
             * @param listener The event listener
             */
            _pushRemoveEventListener(event: string, listener: () => void) {
                var element = this.element;

                this._removeEventListeners.push(function () {
                    element.removeEventListener(event, listener, false);
                });
            }

            /**
             * Sets the context property being bound to when the 
             * element's property is changed.
             */
            _propertyChanged() {
                if (isNull(this._contextExpression)) {
                    return;
                }

                var context = this.parent.evaluateExpression(this._contextExpression),
                    property = this._property;

                var newValue = this._getter();

                if (isNull(context) || context[property] === newValue) {
                    return;
                }

                context[property] = newValue;
            }
            private __setValue(newValue: any) {
                if ((<HTMLInputElement>this.element).value === newValue) {
                    return;
                }

                (<HTMLInputElement>this.element).value = newValue;
            }
        }

        register.control('plat-bind', Bind);

        export class ObservableAttributeControl extends AttributeControl implements IObservablePropertyControl {
            /**
             * The property to set on the associated template control.
             */
            property: string = '';

            /**
             * The camel-cased name of the control as it appears as an attribute.
             */
            attribute: string;

            /**
             * The set of functions added by the Template Control that listens 
             * for property changes.
             */
            _listeners: Array<(newValue: any, oldValue: any) => void> = [];

            /**
             * A function for adding listeners.
             */
            _boundAddListener;

            /**
             * The function to stop listening for property changes.
             */
            _removeListener: IRemoveListener;

            /**
             * Sets the initial value of the property on 
             * the Template Control.
             */
            initialize() {
                this.attribute = camelCase(this.type);
                this._boundAddListener = this._addListener.bind(this);
                this._setProperty(this._getValue());
            }

            /**
             * Observes the property and resets the value.
             */
            loaded() {
                this._observeProperty();
                this._setProperty(this._getValue());
            }

            /**
             * Stops listening for changes to the evaluated 
             * expression and removes references to the listeners 
             * defined by the Template Control.
             */
            dispose() {
                if (isFunction(this._removeListener)) {
                    this._removeListener();
                }

                this._listeners = [];
            }

            /**
             * Sets the property on the Template Control.
             * 
             * @param value The new value of the evaluated expression.
             * @param oldValue The old value of the evaluated expression.
             */
            _setProperty(value: any, oldValue?: any) {
                var templateControl = this.templateControl;

                if (isNull(templateControl)) {
                    return;
                }

                var property = <observable.IObservableProperty<any>>{
                        value: value,
                        observe: this._boundAddListener
                    },
                    ContextManager: observable.IContextManagerStatic = acquire('$ContextManagerStatic');

                ContextManager.defineGetter(templateControl, this.property, property, true, true);
                this._callListeners(value, oldValue);
            }

            /**
             * Calls the listeners defined by the Template Control.
             * 
             * @param value The new value of the evaluated expression.
             * @param oldValue The old value of the evaluated expression.
             */
            _callListeners(newValue: any, oldValue: any) {
                var listeners = this._listeners,
                    length = listeners.length,
                    templateControl = this.templateControl;

                for (var i = 0; i < length; ++i) {
                    listeners[i].call(templateControl, newValue, oldValue);
                }
            }

            /**
             * Adds a listener as defined by the Template Control.
             * 
             * @param listener The listener added by the Template Control.
             */
            _addListener(listener: (newValue: any, oldValue: any) => void): IRemoveListener {
                var listeners = this._listeners,
                    index = listeners.length;

                listeners.push(listener);

                return function removeListener() {
                    listeners.splice(index, 1);
                };
            }

            /**
             * Evaluates the attribute's value.
             */
            _getValue() {
                var expression = this.attributes[this.attribute],
                    templateControl = this.templateControl;

                if (isNull(templateControl)) {
                    return;
                }

                return this.evaluateExpression(expression);
            }

            /**
             * Observes the attribute's value.
             */
            _observeProperty() {
                var expression = this.attributes[this.attribute],
                    templateControl = this.templateControl,
                    parent = this.parent;

                if (isNull(templateControl)) {
                    return;
                }

                this._removeListener = this.observeExpression(expression, this._setProperty);
            }
        }

        export interface IObservablePropertyControl extends IAttributeControl {
            /**
             * The property to set on the associated template control.
             */
            property: string;
        }

        export class Options extends ObservableAttributeControl {
            /**
             * The property to set on the associated template control.
             */
            property: string = 'options';
        }

        register.control('plat-options', Options);
    }
    export module ui {
        export class TemplateControl extends Control implements ITemplateControl {
            /**
             * Evaluates an expression string with a given control and optional context.
             * 
             * @param expression The expression string (e.g. 'foo + foo').
             * @param control The control used for evaluation context.
             * @param aliases An optional alias object containing resource alias values
             */
            static evaluateExpression(expression: string, control?: ITemplateControl, aliases?: any);
            /**
             * Evaluates a parsed expression with a given control and optional context.
             * 
             * @param expression An IParsedExpression created using the '$parser' injectable.
             * @param control The control used for evaluation context.
             * @param aliases An optional alias object containing resource alias values
             */
            static evaluateExpression(expression: expressions.IParsedExpression, control?: ITemplateControl, aliases?: any);
            static evaluateExpression(expression: any, control?: ITemplateControl, aliases?: any) {
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
            }

            /**
             * Given a control and Array of aliases, finds the associated resources and builds a context object containing
             * the values. Returns the object.
             * 
             * @param control The control used as the starting point for finding resources.
             * @param aliases An array of aliases to search for.
             * @param resources An optional resources object to extend, if no resources object is passed in a new one will be created.
             */
            static getResources(control: ITemplateControl, aliases: Array<string>, resources?: any) {
                if (isNull(control)) {
                    return {};
                }

                var length = aliases.length,
                    alias: string,
                    resourceObj,
                    cache = TemplateControl.__resourceCache[control.uid];

                if (isNull(cache)) {
                    cache = TemplateControl.__resourceCache[control.uid] = {};
                }

                resources = resources || {};

                for (var i = 0; i < length; ++i) {
                    alias = aliases[i];

                    if (!isNull(resources[alias])) {
                        continue;
                    } else if (!isNull(cache[alias])) {
                        var resourceControl = cache[alias].control,
                            controlResources = resourceControl.resources;

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
                        var Exception: IExceptionStatic = acquire('$ExceptionStatic');
                        Exception.warn('Attempting to use a resource that is not defined.', Exception.CONTEXT);
                        continue;
                    }

                    cache[alias] = resourceObj;
                    resources['@' + alias] = isNull(resourceObj.resource) ? resourceObj.resource : resourceObj.resource.value;
                }

                return resources;
            }

            /**
             * Starts at a control and searches up its parent chain for a particular resource alias. 
             * If the resource is found, it will be returned along with the control instance on which
             * the resource was found.
             * 
             * @param control The control on which to start searching for the resource alias.
             * @param alias The alias to search for.
             */
            static findResource(control: ITemplateControl, alias: string) {
                var resource: IResource;

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
            }

            /**
             * Recursively disposes a control and its children.
             * @static
             * @param control A control to dispose.
             */
            static dispose(control: ITemplateControl) {
                if (isNull(control)) {
                    return;
                }

                var parent = control.parent,
                    rootControl,
                    parentControls = !isNull(parent) ? parent.controls : null,
                    uid = control.uid,
                    controls = (control.controls && control.controls.slice(0)),
                    ContextManager: observable.IContextManagerStatic = acquire('$ContextManagerStatic'),
                    define = ContextManager.defineProperty,
                    Resources: IResourcesStatic = acquire('$ResourcesStatic'),
                    BindableTemplates: IBindableTemplatesStatic = acquire('$BindableTemplatesStatic'),
                    managerCache: storage.ICache<processing.IElementManager> = acquire('$ManagerCacheStatic');

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
            }
        
            /**
             * Loads the control tree depth first (visit children, then visit self).
             * 
             * @static
             * @param control The control serving as the root control to load.
             */
            static loadControl(control: ITemplateControl) {
                var children = control.controls,
                    length = children.length,
                    child;

                for (var i = 0; i < length; ++i) {
                    child = children[i];
                    if (!isNull(child.controls)) {
                        TemplateControl.loadControl(child);
                    } else {
                        child.loaded();
                    }
                }
            
                control.loaded();
            }

            /**
             * Notifies a control that its context has been changed by 
             * calling the control.contextChanged method if it exists.
             * 
             * @param control The control whose context changed.
             * @param newValue The new value of the control's context.
             * @param oldValue The old value of the control's context.
             */
            static contextChanged(control: IControl, newValue, oldValue);
            static contextChanged(control: ITemplateControl, newValue, oldValue) {
                control.context = newValue;

                TemplateControl.setContextResources(control);

                if (isFunction(control.contextChanged)) {
                    control.contextChanged(newValue, oldValue);
                }
            }

            /**
             * Sets the 'context' resource value on a template control. If the control specifies
             * hasOwnContext, the 'rootContext' resource value will be set.
             * 
             * @param control The control whose context resources will be set.
             */
            static setContextResources(control: ITemplateControl) {
                var value = control.context;

                if (isNull(control.resources)) {
                    var Resources: IResourcesStatic = acquire('$ResourcesStatic');
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
            }

            /**
             * Completely removes a control's element from its parentNode. If the 
             * control implements replaceWith=null, All of its nodes between its 
             * startNode and endNode (inclusive) will be removed.
             * 
             * @param control The control whose element should be removed.
             */
            static removeElement(control: ITemplateControl) {
                var parentNode: Node,
                    dom: IDom = acquire('$dom');

                if (isNull(control)) {
                    return;
                }

                var element = control.element;

                if (control.replaceWith === null ||
                control.replaceWith === '' ||
                element instanceof DocumentFragment) {
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
            }

            /**
             * Sets the absoluteContextPath read-only property on a control.
             * 
             * @param control The control on which to set the absoluteContextPath.
             * @param path The path to set on the control.
             */
            static setAbsoluteContextPath(control: ITemplateControl, path: string) {
                var ContextManager: observable.IContextManagerStatic = acquire('$ContextManagerStatic');
                ContextManager.defineGetter(control, 'absoluteContextPath', path, false, true);
            }

            /**
             * Determines the template for a control by searching for a templateUrl, 
             * using the provided templateUrl, or serializing the control's templateString.
             */
            static determineTemplate(control: ITemplateControl, templateUrl?: string) {
                var template,
                    templateCache: storage.ITemplateCache = acquire('$templateCache'),
                    dom: IDom = acquire('$dom');

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

                var ajax = acquire('$http').ajax,
                    Exception: IExceptionStatic = acquire('$ExceptionStatic');

                var templatePromise =
                    new async.Promise<DocumentFragment, async.IAjaxError>(
                        function initiateTemplateCall(resolve: (value?: DocumentFragment) => void, reject: (reason?: any) => void) {
                            ajax({ url: templateUrl }).then(function templateSuccess(success: async.IAjaxResponse) {
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

                            }, function templateError(error: async.IAjaxError) {
                                    postpone(function () {
                                        Exception.fatal('Failure to get template from ' + templateUrl + '.', Exception.TEMPLATE);
                                    });
                                    reject(error);
                                });
                        });

                templateCache.put(templateUrl, templatePromise);

                return templatePromise;
            }

            /**
             * Detaches a TemplateControl. Disposes its children, but does not dispose the TemplateControl.
             *  
             * @static
             * @param control The control to be detached.
             */
            static detach(control: ITemplateControl) {
                if (isNull(control)) {
                    return;
                }

                var ContextManager: observable.IContextManagerStatic = acquire('$ContextManagerStatic'),
                    Resources: IResourcesStatic = acquire('$ResourcesStatic'),
                    managerCache: storage.ICache<processing.IElementManager> = acquire('$ManagerCacheStatic');

                if (isNull(control.controls)) {
                    return;
                }

                var controls = control.controls.slice(0),
                    length = controls.length;

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
            }

            private static __resourceCache: any = {};

            /**
             * Specifies the absolute path from where the context was created to this control's context.
             * Used by the ContextManager for maintaining context parity.
             * 
             * @example 'context.childContextProperty.grandChildContextProperty'
             */
            absoluteContextPath: string = null;

            /**
             * The inherited singleton object used for data-binding. A control that implements IViewControl will 
             * create the context object for all of its children. Any properties bound in the DOM markup will be
             * initialized to NULL automatically. If a control does not implement IViewControl it cannot
             * directly modify the context property, and it should only modify child properties off of context.
             */
            context: any = null;

            /**
             * Resources are used for providing aliases to use in markup expressions. They 
             * are particularly useful when trying to access properties outside of the 
             * current context, as well as reassigning context at any point in an app.
             * 
             * By default, every control has a resource for '@control' and '@context'.
             * IViewControl objects also have a resource for '@root' and '@rootContext', which is a reference
             * to their root control and root context.
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
            resources: IResources;
        
            /**
             * Indicates whether or not this control defines its over context. Controls that implement 
             * IViewControl will automatically implement this flag.
             */
            hasOwnContext: boolean = false;

            /**
             * A string representing the DOM template for this control. If this property is
             * defined on a ITemplateControl then DOM will be created and put in the 
             * control's element prior to calling the 'setTemplate' method.
             */
            templateString: string;

            /**
             * A url containing a string representing the DOM template for this control. If this property is
             * defined on a ITemplateControl then DOM will be created and put in the 
             * control's element prior to calling the 'setTemplate' method. This property takes 
             * precedence over templateString. In the event that both are defined, templateString
             * will be ignored.
             */
            templateUrl: string;

            /**
             * A DocumentFragment representing the innerHTML that existed when this control was instantiated.
             * This property will only contain the innerHTML when either a templateString or templateUrl is
             * defined.
             */
            innerTemplate: DocumentFragment;

            /**
             * A IBindableTemplates object used for binding a data context to a template. This is an
             * advanced function of a ITemplateControl.
             * 
             * @see IBindableTemplates
             */
            bindableTemplates: IBindableTemplates;

            /**
             * An array of child controls. Any controls created by this control can be found in this array. The controls in
             * this array will have reference to this control in their parent property.
             */
            controls: Array<IControl>;

            /**
             * A Node array for managing the ITemplateControl's childNodes in the event that this control
             * replaces its element. This property will only be useful for a ITemplateControl that implements
             * replaceWith = null.
             */
            elementNodes: Array<Node>;

            /**
             * The first node in the ITemplateControl's body. This property will be a Comment node when the
             * control implements replaceWith = null, otherwise it will be null. This property allows a ITemplateControl
             * to add nodes to its body in the event that it replaces its element.
             * 
             * @example this.startNode.parentNode.insertBefore(node, this.startNode.nextSibling);
             */
            startNode: Node;

            /**
             * The last node in the ITemplateControl's body. This property will be a Comment node when the
             * control implements replaceWith = null, otherwise it will be null. This property allows a ITemplateControl
             * to add nodes to its body in the event that it replaces its element.
             * 
             * @example this.endNode.parentNode.insertBefore(node, this.endNode);
             */
            endNode: Node;

            /**
             * TemplateControls are the base control for any UIControl. They provide properties for the control to use
             * to manage its body HTML.
             */
            constructor() {
                super();
            }

            /**
             * Contains DOM helper methods for manipulating this control's element.
             */
            dom: IDom = acquire('$dom');

            /**
             * Set to the root ancestor control from which this control inherits its context. This value
             * can be equal to this control.
             */
            root: ITemplateControl;

            /**
             * This event is fired when a TemplateControl's context property is changed by an ancestor control.
             */
            contextChanged() { }

            /**
             * A method called for ITemplateControls to set their template. During this method a control should
             * ready its template for compilation. Whatever is in the control's element (or elementNodes if replaceWith
             * is implemented) after this method's execution will be compiled and appear on the DOM.
             */
            setTemplate() { }

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
            getIdentifier(context: any): string {
                var queue = [],
                    dataContext = this.context,
                    found = false,
                    obj = {
                        context: dataContext,
                        identifier: ''
                    },
                    length,
                    keys,
                    key,
                    newObj;

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
            }

            /**
             * Finds the absolute identifier string associated with the given context object. The string returned
             * is the path from a control's root ancestor's context.
             * 
             * @param context The object to locate on the root control's context.
             */
            getAbsoluteIdentifier(context: any) {
                if (context === this.context) {
                    return this.absoluteContextPath;
                }

                var localIdentifier = this.getIdentifier(context);
                if (isNull(localIdentifier)) {
                    return localIdentifier;
                }

                return this.absoluteContextPath + '.' + localIdentifier;
            }

            /**
             * Finds the associated resources and builds a context object containing
             * the values. Returns the object.
             * 
             * @param aliases An array of aliases to search for.
             * @param resources An optional resources object to extend, if no resources object is passed in a new one will be created.
             */
            getResources(aliases: Array<string>, resources?: any) {
                return TemplateControl.getResources(this, aliases, resources);
            }

            /**
             * Starts at a control and searches up its parent chain for a particular resource alias. 
             * If the resource is found, it will be returned along with the control instance on which
             * the resource was found.
             * 
             * @param alias The alias to search for.
             */
            findResource(alias: string) {
                return TemplateControl.findResource(this, alias);
            }

            /**
             * Evaluates an expression string, using the control.context.
             * 
             * @param expression The expression string to evaluate.
             * @param context An optional context with which to parse. If 
             * no context is specified, the control.context will be used.
             */
            evaluateExpression(expression: string, context?: any);
            /**
             * Evaluates a parsed expression, using the control.context.
             * 
             * @param expression The IParsedExpression to evaluate.
             * @param context An optional context with which to parse. If 
             * no context is specified, the control.context will be used.
             */
            evaluateExpression(expression: expressions.IParsedExpression, context?: any);
            evaluateExpression(expression: any, context?: any) {
                return TemplateControl.evaluateExpression(expression, this, context);
            }

            /**
             * Allows a control to observe any property on its context and receive updates when
             * the property is changed.
             * 
             * @param context The immediate parent object containing the property.
             * @param property The property identifier to watch for changes.
             * @param listener The method called when the property is changed. This method will have its 'this'
             * context set to the control instance.
             */
            observe<T>(context: any, property: string, listener: (value: T, oldValue: any) => void): IRemoveListener;
            /**
             * Allows a control to observe any property on its context and receive updates when
             * the property is changed.
             * 
             * @param context The immediate parent array containing the property.
             * @param property The index to watch for changes.
             * @param listener The method called when the property is changed. This method will have its 'this'
             * context set to the control instance.
             */
            observe<T>(context: any, property: number, listener: (value: T, oldValue: T) => void): IRemoveListener;
            observe(context: any, property: any, listener: (value: any, oldValue: any) => void): IRemoveListener {
                if (isNull(context) || !context.hasOwnProperty(property)) {
                    return;
                }

                var control = !isFunction((<any>this).getAbsoluteIdentifier) ? this.parent : <ITemplateControl>this,
                    absoluteIdentifier = control.getAbsoluteIdentifier(context),
                    ContextManager: observable.IContextManagerStatic = acquire('$ContextManagerStatic');

                if (isNull(absoluteIdentifier)) {
                    return;
                }

                var contextManager = ContextManager.getManager(Control.getRootControl(this));
                return contextManager.observe(absoluteIdentifier + '.' + property, {
                    listener: listener.bind(this),
                    uid: this.uid
                });
            }

            /**
             * Allows a control to observe an array and receive updates when certain array-changing methods are called.
             * The methods watched are push, pop, shift, sort, splice, reverse, and unshift. This method does not watch
             * every item in the array.
             * 
             * @param context The immediate parent object containing the array as a property.
             * @param property The array property identifier to watch for changes.
             * @param listener The method called when an array-changing method is called. This method will have its 'this'
             * context set to the control instance.
             */
            observeArray<T>(context: any, property: string, listener: (ev: observable.IArrayMethodInfo<T>) => void): IRemoveListener;
            /**
             * Allows a control to observe an array and receive updates when certain array-changing methods are called.
             * The methods watched are push, pop, shift, sort, splice, reverse, and unshift. This method does not watch
             * every item in the array.
             * 
             * @param context The immediate parent array containing the array as a property.
             * @param property The index on the parent array, specifying the array to watch for changes.
             * @param listener The method called when an array-changing method is called. This method will have its 'this'
             * context set to the control instance.
             */
            observeArray<T>(context: Array<T>, property: number, listener: (ev: observable.IArrayMethodInfo<T>) => void): IRemoveListener;
            observeArray(context: any, property: any, listener: (ev: observable.IArrayMethodInfo<any>) => void): IRemoveListener {
                if (isNull(context) || !context.hasOwnProperty(property)) {
                    return;
                }

                var array = context[property],
                    callback = listener.bind(this);

                if (!isArray(array)) {
                    return;
                }

                var control = !isFunction((<any>this).getAbsoluteIdentifier) ? this.parent : <ITemplateControl>this,
                    absoluteIdentifier = control.getAbsoluteIdentifier(context),
                    ContextManager: observable.IContextManagerStatic = acquire('$ContextManagerStatic');

                if (isNull(absoluteIdentifier)) {
                    if (property === 'context') {
                        absoluteIdentifier = control.absoluteContextPath;
                    } else {
                        return;
                    }
                } else {
                    absoluteIdentifier += '.' + property;
                }

                var contextManager = ContextManager.getManager(Control.getRootControl(this)),
                    uid = this.uid,
                    removeCallback = contextManager.observe(absoluteIdentifier, {
                        listener: (newValue: Array<any>, oldValue: Array<any>) => {
                            contextManager.observeArray(this, callback, absoluteIdentifier, newValue, oldValue);
                        },
                        uid: uid
                    });
                contextManager.observeArray(this, callback, absoluteIdentifier, array, null);

                // need to call callback if 
                return () => {
                    ContextManager.removeArrayListeners(absoluteIdentifier, uid);
                    removeCallback();
                };
            }
        }

        export function TemplateControlStatic() {
            return TemplateControl;
        }

        register.injectable('$TemplateControlStatic', TemplateControlStatic, null, register.injectableType.STATIC);

        export interface ITemplateControlStatic {
            /**
             * Evaluates an expression string with a given control and optional context.
             *
             * @param expression The expression string (e.g. 'foo + foo').
             * @param control The control used for evaluation context.
             * @param aliases An optional alias object containing resource alias values
             */
            evaluateExpression(expression: string, control?: ITemplateControl, aliases?: any);
            /**
             * Evaluates a parsed expression with a given control and optional context.
             *
             * @param expression An IParsedExpression created using the '$parser' injectable.
             * @param control The control used for evaluation context.
             * @param aliases An optional alias object containing resource alias values
             */
            evaluateExpression(expression: expressions.IParsedExpression, control?: ITemplateControl, aliases?: any);

            /**
             * Given a control and Array of aliases, finds the associated resources and builds a context object containing
             * the values. Returns the object.
             *
             * @param control The control used as the starting point for finding resources.
             * @param aliases An array of aliases to search for.
             * @param resources An optional resources object to extend, if no resources object is passed in a new one will be created.
             */
            getResources(control: ITemplateControl, aliases: Array<string>, resources?: any);

            /**
             * Starts at a control and searches up its parent chain for a particular resource alias.
             * If the resource is found, it will be returned along with the control instance on which
             * the resource was found.
             *
             * @param control The control on which to start searching for the resource alias.
             * @param alias The alias to search for.
             */
            findResource(control: ITemplateControl, alias: string): { resource: IResource; control: ITemplateControl; };

            /**
             * Recursively disposes a control and its children.
             * @param control A control to dispose.
             */
            dispose(control: ITemplateControl): void;

            /**
             * Loads the control tree depth first (visit children, then visit self).
             *
             * @param control The control serving as the root control to load.
             */
            loadControl(control: ITemplateControl): void;

            /**
             * Notifies a control that its context has been changed by
             * calling the control.contextChanged method if it exists.
             *
             * @param control The control whose context changed.
             * @param newValue The new value of the control's context.
             * @param oldValue The old value of the control's context.
             */
            contextChanged(control: IControl, newValue, oldValue);

            /**
             * Sets the 'context' resource value on a template control. If the control specifies
             * hasOwnContext, the 'rootContext' resource value will be set.
             *
             * @param control The control whose context resources will be set.
             */
            setContextResources(control: ITemplateControl): void;

            /**
             * Completely removes a control's element from its parentNode. If the
             * control implements replaceWith=null, All of its nodes between its
             * startNode and endNode (inclusive) will be removed.
             *
             * @param control The control whose element should be removed.
             */
            removeElement(control: ITemplateControl): void;

            /**
             * Sets the absoluteContextPath read-only property on a control.
             * 
             * @param control The control on which to set the absoluteContextPath.
             * @param path The path to set on the control.
             */
            setAbsoluteContextPath(control: ITemplateControl, path: string): void;

            /**
             * Determines the template for a control by searching for a templateUrl, 
             * using the provided templateUrl, or serializing the control's templateString.
             */
            determineTemplate(control: ITemplateControl, templateUrl?: string);

            /**
             * Detaches a TemplateControl. Disposes its children, but does not dispose the TemplateControl.
             *
             * @param control The control to be detached.
             */
            detach(control: ITemplateControl): void;

            /**
             * Create a new empty ITemplateControl
             */
            new (): ITemplateControl;
        }

        /**
         * Describes a control which provides properties and methods for managing its body HTML.
         */
        export interface ITemplateControl extends IControl {
            /**
             * The context of an ITemplateControl, used for inheritance and data-binding.
             */
            context?: any;

            /**
             * Resources are used for providing aliases to use in markup expressions. They 
             * are particularly useful when trying to access properties outside of the 
             * current context, as well as reassigning context at any point in an app.
             * 
             * By default, every control has a resource for '@control' and '@context'.
             * IViewControl objects also have a resource for '@root' and '@rootContext', which is a reference
             * to their root control and root context.
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
            resources?: IResources;

            /**
             * Flag indicating whether or not the ITemplateControl defines the context property.
             */
            hasOwnContext?: boolean;

            /**
             * Specifies the absolute path from where the context was created to this IControl's context.
             * Used by the ContextManager for maintaining context parity.
             * 
             * @example 'context.childContextProperty.grandChildContextProperty'
             */
            absoluteContextPath?: string;

            /**
             * A string representing the DOM template for this control. If this property is
             * defined on a ITemplateControl then DOM will be created and put in the 
             * control's element prior to calling the 'setTemplate' method.
             */
            templateString?: string;

            /**
             * A url containing a string representing the DOM template for this control. If this property is
             * defined on a ITemplateControl then DOM will be created and put in the 
             * control's element prior to calling the 'setTemplate' method. This property takes 
             * precedence over templateString. In the event that both are defined, templateString
             * will be ignored.
             */
            templateUrl?: string;

            /**
             * A DocumentFragment representing the innerHTML that existed when this control was instantiated.
             * This property will only contain the innerHTML when either a templateString or templateUrl is
             * defined. Its important to clone this property when injecting it somewhere, else its childNodes
             * will disappear.
             * 
             * @example this.innerTemplate.cloneNode(true); //Useful if this is not a one-time injection.
             */
            innerTemplate?: DocumentFragment;

            /**
             * A IBindableTemplates object used for binding a data context to a template. This is an
             * advanced function of a ITemplateControl.
             * 
             * @see IBindableTemplates
             */
            bindableTemplates?: IBindableTemplates;

            /**
             * An array of child controls. Any controls created by this control can be found in this array. The controls in
             * this array will have reference to this control in their parent property.
             */
            controls?: Array<IControl>;

            /**
             * A Node array for managing the ITemplateControl's childNodes in the event that this control
             * replaces its element. This property will only be useful for a ITemplateControl that implements
             * replaceWith.
             */
            elementNodes?: Array<Node>;

            /**
             * The first node in the ITemplateControl's body. This property will be a Comment node when the
             * control implements replaceWith = null, otherwise it will be null. This property allows a ITemplateControl
             * to add nodes to its body in the event that it replaces its element.
             * 
             * @example this.startNode.parentNode.insertBefore(node, this.startNode.nextSibling);
             */
            startNode?: Node;

            /**
             * The last node in the ITemplateControl's body. This property will be a Comment node when the
             * control implements replaceWith, otherwise it will be null. This property allows a ITemplateControl
             * to add nodes to its body in the event that it replaces its element.
             * 
             * @example this.endNode.parentNode.insertBefore(node, this.endNode);
             */
            endNode?: Node;

            /**
             * Allows a ITemplateControl to either swap its element with another element (e.g. plat-select), or
             * replace its element altogether. If null or empty string, the element will be removed from the DOM, and the 
             * childNodes of the element will be in its place. In addition, when the element is placed an endNode Comment
             * is created, and the childNodes are added to the elementNodes property on the control. The replaceWith 
             * property can be any property that works with document.createElement(). If the control's element had 
             * attributes (as well as attribute IControls), those attributes will be carried to the swapped element.
             */
            replaceWith?: string;

            /**
             * Contains DOM helper methods for manipulating this control's element.
             */
            dom: IDom;

            /**
             * Set to the root ancestor control from which this control inherits its context. This value
             * can be equal to this control.
             */
            root: ITemplateControl;

            /**
             * A method called for ITemplateControls to set their template. During this method a control should
             * ready its template for compilation. Whatever is in the control's element (or elementNodes if replaceWith
             * is implemented) after this method's execution will be compiled and appear on the DOM.
             */
            setTemplate? (): void;

            /**
             * This event is fired when an ITemplateControl's context property is changed by an ancestor control.
             */
            contextChanged? (newValue: any, oldValue: any): void;

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
            getIdentifier? (context: any): string;

            /**
             * Finds the absolute identifier string associated with the given context object. The string returned
             * is the path from a control's root ancestor's context.
             * 
             * @param context The object to locate on the root control's context.
             */
            getAbsoluteIdentifier? (context: any): string;
        
            /**
             * Finds the associated resources and builds a context object containing
             * the values. Returns the object.
             * 
             * @param aliases An array of aliases to search for.
             * @param resources An optional resources object to extend, if no resources object is passed in a new one will be created.
             */
            getResources(aliases: Array<string>, resources?: any);

            /**
             * Starts at a control and searches up its parent chain for a particular resource alias. 
             * If the resource is found, it will be returned along with the control instance on which
             * the resource was found.
             * 
             * @param alias The alias to search for.
             */
            findResource(alias: string): { resource: IResource; control: ITemplateControl; };

            /**
             * Evaluates an expression string, using the control.context.
             * 
             * @param expression The expression string to evaluate.
             * @param context An optional context with which to parse. If 
             * no context is specified, the control.context will be used.
             */
            evaluateExpression(expression: string, context?: any);
            /**
             * Evaluates a parsed expression, using the control.context.
             * 
             * @param expression The IParsedExpression to evaluate.
             * @param context An optional context with which to parse. If 
             * no context is specified, the control.context will be used.
             */
            evaluateExpression(expression: expressions.IParsedExpression, context?: any);

            /**
             * Allows an IControl to observe any property on its context and receive updates when
             * the property is changed.
             * 
             * @param context The immediate parent object containing the property.
             * @param property The property identifier to watch for changes.
             * @param listener The method called when the property is changed. This method will have its 'this'
             * context set to the control instance.
             */
            observe? <T>(context: any, property: string, listener: (value: T, oldValue: T) => void): IRemoveListener;
            /**
             * Allows an IControl to observe any property on its context and receive updates when
             * the property is changed.
             * 
             * @param context The immediate parent array containing the property.
             * @param property The index to watch for changes.
             * @param listener The method called when the property is changed. This method will have its 'this'
             * context set to the control instance.
             */
            observe? <T>(context: any, property: number, listener: (value: T, oldValue: T) => void): IRemoveListener;

            /**
             * Allows an IControl to observe an array and receive updates when certain array-changing methods are called.
             * The methods watched are push, pop, shift, sort, splice, reverse, and unshift. This method does not watch
             * every item in the array.
             * 
             * @param context The immediate parent object containing the array as a property.
             * @param property The array property identifier to watch for changes.
             * @param listener The method called when an array-changing method is called. This method will have its 'this'
             * context set to the control instance.
             */
            observeArray? <T>(context: any, property: string, listener: (ev: observable.IArrayMethodInfo<T>) => void): IRemoveListener;
            /**
             * Allows an IControl to observe an array and receive updates when certain array-changing methods are called.
             * The methods watched are push, pop, shift, sort, splice, reverse, and unshift. This method does not watch
             * every item in the array.
             * 
             * @param context The immediate parent array containing the array as a property.
             * @param property The index on the parent array, specifying the array to watch for changes.
             * @param listener The method called when an array-changing method is called. This method will have its 'this'
             * context set to the control instance.
             */
            observeArray? <T>(context: Array<T>, property: number, listener: (ev: observable.IArrayMethodInfo<T>) => void): IRemoveListener;
        }

        export class ViewControl extends TemplateControl implements IViewControl {
            /**
             * Detaches a ViewControl. Disposes its children, but does not dispose the ViewControl.
             * Useful for the Navigator when storing the ViewControl in history.
             *  
             * @static
             * @param control The control to be detached.
             */
            static detach(control: IViewControl) {
                TemplateControl.detach(control);
            }

            /**
             * Recursively disposes a control and its children.
             * @static
             * @param control A control to dispose.
             */
            static dispose(control: IViewControl) {
                TemplateControl.dispose(control);
            }

            /**
             * The context used for data binding and inheritance.
             */
            hasOwnContext: boolean = true;

            /**
             * Specifies the navigator for this control. Used for navigating to other IViewControls
             * in a controls.Viewport.
             */
            navigator: navigation.IBaseNavigator;

            /**
             * This event is fired when this control has been navigated to.
             * 
             * @param parameter A navigation parameter sent from the previous IViewControl.
             */
            navigatedTo(parameter?: any) { }

            /**
             * This event is fired when this control is being navigated away from.
             * 
             * @param parameter A navigation parameter sent from wherever initialized the navigation.
             * @param route A IRoute, sent if the navigation is a result of the url changing.
             * @param toControlType The type of control being navigated to next (e.g. 'my-next-view-control').
             */
            navigatingFrom() { }

            /**
             * A ViewControl is used in a controls.Viewport for simulated page navigation. The 
             * ViewControl has navigation events that are called when navigating to and from the control.
             */
            constructor() { super(); }
        }

        export function ViewControlStatic() {
            return ViewControl;
        }

        register.injectable('$ViewControlStatic', ViewControlStatic, null, register.injectableType.STATIC);

        export interface IViewControlStatic {
            /**
             * Detaches a ViewControl. Disposes its children, but does not dispose the ViewControl.
             * Useful for the Navigator when storing the ViewControl in history.
             *
             * @static
             * @param control The control to be detached.
             */
            detach(control: IViewControl): void;

            /**
             * Recursively disposes a control and its children.
             * @static
             * @param control A control to dispose.
             */
            dispose(control: IViewControl): void;

            /**
             * Create a new empty IViewControl
             */
            new (): IViewControl;
        }

        /**
         * Describes a control used in a controls.Viewport for simulated page navigation. The 
         * control has navigation events that are called when navigating to and from the control.
         */
        export interface IViewControl extends ITemplateControl {
            /**
             * Specifies that this control will have its own context, and it should not inherit a context.
             */
            hasOwnContext: boolean;

            /**
             * This event is fired when this control has been navigated to.
             * 
             * @param parameter A navigation parameter sent from the previous IViewControl.
             */
            navigatedTo? (parameter?: any): void;

            /**
             * This event is fired when this control is being navigated away from.
             * 
             * @param parameter A navigation parameter sent from wherever initialized the navigation.
             * @param route A IRoute, sent if the navigation is a result of the url changing.
             * @param toControlType The type of control being navigated to next (e.g. 'my-next-view-control').
             */
            navigatingFrom? (): void;

            /**
             * Specifies the navigator for this control. Used for navigating to other IViewControls
             * in a controls.Viewport.
             */
            navigator: navigation.IBaseNavigator;
        }

        export class Dom {
            /**
             * Takes a Node Array and either adds it to the passed in Node,
             * or creates a DocumentFragment and adds the NodeList to the
             * Fragment.
             * 
             * @param nodeList A Node Array to be appended to the root/DocumentFragment
             * @param root An optional Node to append the nodeList.
             * @return {Node} The root Node or a DocumentFragment.
             */
            appendChildren(nodeList: Array<Node>, root?: Node): Node;
            /**
             * Takes a NodeList and either adds it to the passed in Node,
             * or creates a DocumentFragment and adds the NodeList to the
             * Fragment.
             * 
             * @param nodeList A NodeList to be appended to the root/DocumentFragment
             * @param root An optional Node to append the nodeList.
             * @return {Node} The root Node or a DocumentFragment.
             */
            appendChildren(nodeList: NodeList, root?: Node): Node;
            appendChildren(nodeList: any, root?: Node) {
                return appendChildren(nodeList, root);
            }

            /**
             * Clears a DOM Node by removing all of its childNodes.
             * 
             * @param node The DOM Node to clear.
             */
            clearNode(node: Node) {
                return clearNode(node);
            }

            /**
             * Removes all the Nodes in the Array from the parent Node.
             * 
             * @param nodeList The Node Array to remove from the parent Node.
             * @param parent The parent Node used to remove the nodeList.
             */
            clearNodeBlock(nodeList: Array<Node>, parent: Node);
            /**
             * Removes all the Nodes in the NodeList from the parent Node.
             * 
             * @param nodeList The NodeList to remove from the parent Node.
             * @param parent The parent Node used to remove the nodeList.
             */
            clearNodeBlock(nodeList: NodeList, parent: Node);
            clearNodeBlock(nodeList: any, parent: Node) {
                return clearNodeBlock(nodeList, parent);
            }

            /**
             * Converts HTML string to a Node. Can be used to create text nodes. 
             * Handles cross-browser issues revolving around creating elements 
             * without the correct parent (e.g. '<option>Text</option>').
             */
            stringToNode(html: string): Node {
                return stringToNode(html);
            }

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
            setInnerHtml(node: Node, html: string) {
                return setInnerHtml(node, html);
            }

            /**
             * Inserts a list of Nodes before the designated end Node.
             * 
             * @param parent The parent node into which to insert nodes.
             * @param nodes The Node Array to insert into the parent.
             * @param endNode An optional endNode to use to insert nodes.
             * 
             * @return {Array<Node>} An Array copy of nodes.
             */
            insertBefore(parent: Node, nodes: Array<Node>, endNode?: Node): Array<Node>;
            /**
             * Inserts a list of Nodes before the designated end Node.
             * 
             * @param parent The parent node into which to insert nodes.
             * @param nodes The NodeList to insert into the parent.
             * @param endNode An optional endNode to use to insert nodes.
             * 
             * @return {Array<Node>} An Array copy of nodes.
             */
            insertBefore(parent: Node, nodes: NodeList, endNode?: Node): Array<Node>;
            insertBefore(parent: Node, nodes: any, endNode?: Node) {
                return insertBefore(parent, nodes, endNode);
            }

            /**
             * Takes the child nodes of the given node and places them above the node
             * in the DOM. Then removes the given node.
             * 
             * @param node The Node to replace.
             * @return {Array<Node>} A Node Array that represents the childNodes of the
             * given node.
             */
            replace(node: Node) {
                return replace(node);
            }

            /**
             * Takes the childNodes of the given element and appends them to the newElement.
             * Then replaces the element in its parent's tree with the newElement.
             * 
             * @param element The HTMLElement to remove from its parent.
             * @param newElement The HTMLElement populate with childNodes and add to the 
             * elemnent's parent.
             * @return {HTMLElement} The replaced element (newElement).
             */
            replaceWith(element: HTMLElement, newElement: HTMLElement): HTMLElement;
            /**
             * Takes the childNodes of the given Node and appends them to the newNode.
             * Then replaces the Node in its parent's tree with the newNode.
             * 
             * @param node The Node to remove from its parent.
             * @param newElement The Node populate with childNodes and add to the 
             * node's parent.
             * @return {Node} The replaced Node (newNode).
             */
            replaceWith(node: Node, newNode: Node): Node;
            replaceWith(node: any, newNode: any) {
                return replaceWith(node, newNode);
            }

            /**
             * Takes in a string representing innerHTML and returns a DocumentFragment
             * containing the serialized DOM.
             * 
             * @param template The DOM string.
             * @return {DocumentFragment} The serialized DOM.
             */
            serializeTemplate(template: string): DocumentFragment {
                return serializeTemplate(template);
            }

            /**
             * Takes in a startNode and endNode, each having the same parentNode. 
             * Removes every node in between the startNode.  If endNode is not specified, 
             * DOM will be removed until the end of the parentNode's children.
             * 
             * @param startNode The starting node, which will not be removed.
             * @param endNode The ending node, which will not be removed.
             */
            removeBetween(startNode: Node, endNode?: Node) {
                return removeBetween(startNode, endNode);
            }

            /**
             * Takes in a startNode and endNode, each having the same parentNode. 
             * Removes every node in between the startNode and endNode as well as 
             * the startNode and the endNode.  If endNode is not specified, DOM 
             * will be removed until the end of the parentNode's children.
             * 
             * @param startNode The first node to remove.
             * @param endNode The last node to remove.
             */
            removeAll(startNode: Node, endNode?: Node) {
                return removeAll(startNode, endNode);
            }
        }

        register.injectable('$dom', Dom);

        function appendChildren(nodeList: any, root?: Node) {
            var fragment,
                isFragment = root instanceof DocumentFragment,
                nullRoot = isNull(root),
                $document = acquire('$document');

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

        function clearNode(node: Node) {
            var childNodes = Array.prototype.slice.call(node.childNodes);

            while (childNodes.length > 0) {
                node.removeChild(childNodes.pop());
            }
        }

        function clearNodeBlock(nodeList: any, parent: Node) {
            if (!isFunction(nodeList.push)) {
                nodeList = Array.prototype.slice.call(nodeList);
            }

            while (nodeList.length > 0) {
                parent.removeChild(nodeList.pop());
            }
        }

        function stringToNode(html: string): Node {
            var compat: ICompat = acquire('$compat'),
                $document: Document = acquire('$document');

            if (compat.pushState) {
                return innerHtml($document.createElement('div'), html);
            }

            var nodeName = /<([\w:]+)/.exec(html);
            var element: HTMLElement = $document.createElement('div');

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

            var wrapper = innerHtmlWrappers[mapTag] || innerHtmlWrappers._default,
                depth = wrapper[0],
                parentStart = wrapper[1],
                parentEnd = wrapper[2];

            element = innerHtml(element, parentStart + html + parentEnd);

            while (depth-- > 0) {
                element = <HTMLElement>element.lastChild;
            }

            return element;
        }

        function setInnerHtml(node: Node, html: string) {
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

        function insertBefore(parent: Node, nodes: any, endNode?: Node) {
            if (isNull(parent)) {
                return;
            }

            if (!isFunction(nodes.push)) {
                nodes = Array.prototype.slice.call(nodes);
            }

            var $document = acquire('$document'),
                fragment = $document.createDocumentFragment(),
                length = nodes.length;

            for (var i = 0; i < length; ++i) {
                fragment.insertBefore(nodes[i], null);
            }

            parent.insertBefore(fragment, endNode);

            return nodes;
        }

        function replace(node: Node) {
            var parent = node.parentNode,
                nodes = insertBefore(parent, node.childNodes, node);

            parent.removeChild(node);

            return nodes;
        }

        function replaceWith(node: any, newNode: any) {
            if (isNull(newNode)) {
                return newNode;
            }

            if (node.nodeType === Node.ELEMENT_NODE) {
                var attributes = node.attributes,
                    length = attributes.length,
                    attribute: Attr;

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

        function serializeTemplate(template: string): DocumentFragment {
            var $document = acquire('$document'),
                templateElement = $document.createDocumentFragment();

            if (!isEmpty(template)) {
                setInnerHtml(templateElement, template);
            }

            return templateElement;
        }

        function removeBetween(startNode: Node, endNode?: Node) {
            if (isNull(startNode)) {
                return;
            }

            var currentNode = startNode.nextSibling,
                parentNode = startNode.parentNode,
                tempNode;

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

        function removeAll(startNode: Node, endNode?: Node) {
            if (isNull(startNode)) {
                return;
            }

            removeBetween(startNode, endNode);

            removeNode(startNode);
            removeNode(endNode);
        }

        var __option = [1, '<select multiple="multiple">', '</select>'],
            __table = [1, '<table>', '</table>'],
            __tableData = [3, '<table><tbody><tr>', '</tr></tbody></table>'],
            __svg = [1, '<svg xmlns="http://www.w3.org/2000/svg" version="1.1">', '</svg>'],
            innerHtmlWrappers = {
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
        function innerHtml(element: HTMLElement, html: string) {
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

        function removeNode(node: Node) {
            if (isNull(node)) {
                return;
            }

            var parentNode = node.parentNode;

            if (!isNull(parentNode)) {
                node.parentNode.removeChild(node);
            }
        }

        export interface IDom {
            /**
             * Takes a Node Array and either adds it to the passed in Node,
             * or creates a DocumentFragment and adds the NodeList to the
             * Fragment.
             *
             * @param nodeList A Node Array to be appended to the root/DocumentFragment
             * @param root An optional Node to append the nodeList.
             * @return {Node} The root Node or a DocumentFragment.
             */
            appendChildren(nodeList: Array<Node>, root?: Node): Node;
            /**
             * Takes a NodeList and either adds it to the passed in Node,
             * or creates a DocumentFragment and adds the NodeList to the
             * Fragment.
             *
             * @param nodeList A NodeList to be appended to the root/DocumentFragment
             * @param root An optional Node to append the nodeList.
             * @return {Node} The root Node or a DocumentFragment.
             */
            appendChildren(nodeList: NodeList, root?: Node): Node;

            /**
             * Clears a DOM Node by removing all of its childNodes.
             *
             * @param node The DOM Node to clear.
             */
            clearNode(node: Node): void;

            /**
             * Removes all the Nodes in the Array from the parent Node.
             *
             * @param nodeList The Node Array to remove from the parent Node.
             * @param parent The parent Node used to remove the nodeList.
             */
            clearNodeBlock(nodeList: Array<Node>, parent: Node): void;
            /**
             * Removes all the Nodes in the NodeList from the parent Node.
             *
             * @param nodeList The NodeList to remove from the parent Node.
             * @param parent The parent Node used to remove the nodeList.
             */
            clearNodeBlock(nodeList: NodeList, parent: Node): void;

            /**
             * Converts HTML string to a Node. Can be used to create text nodes.
             * Handles cross-browser issues revolving around creating elements
             * without the correct parent (e.g. '<option>Text</option>').
             */
            stringToNode(html: string): Node;

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
            setInnerHtml(node: Node, html: string): Node;

            /**
             * Inserts a list of Nodes before the designated end Node.
             *
             * @param parent The parent node into which to insert nodes.
             * @param nodes The Node Array to insert into the parent.
             * @param endNode An optional endNode to use to insert nodes.
             *
             * @return {Array<Node>} An Array copy of nodes.
             */
            insertBefore(parent: Node, nodes: Array<Node>, endNode?: Node): Array<Node>;
            /**
             * Inserts a list of Nodes before the designated end Node.
             *
             * @param parent The parent node into which to insert nodes.
             * @param nodes The NodeList to insert into the parent.
             * @param endNode An optional endNode to use to insert nodes.
             *
             * @return {Array<Node>} An Array copy of nodes.
             */
            insertBefore(parent: Node, nodes: NodeList, endNode?: Node): Array<Node>;

            /**
             * Takes the child nodes of the given node and places them above the node
             * in the DOM. Then removes the given node.
             *
             * @param node The Node to replace.
             * @return {Array<Node>} A Node Array that represents the childNodes of the
             * given node.
             */
            replace(node: Node): Array<Node>;

            /**
             * Takes the childNodes of the given element and appends them to the newElement.
             * Then replaces the element in its parent's tree with the newElement.
             *
             * @param element The HTMLElement to remove from its parent.
             * @param newElement The HTMLElement populate with childNodes and add to the
             * elemnent's parent.
             * @return {HTMLElement} The replaced element (newElement).
             */
            replaceWith(element: HTMLElement, newElement: HTMLElement): HTMLElement;
            /**
             * Takes the childNodes of the given Node and appends them to the newNode.
             * Then replaces the Node in its parent's tree with the newNode.
             *
             * @param node The Node to remove from its parent.
             * @param newElement The Node populate with childNodes and add to the
             * node's parent.
             * @return {Node} The replaced Node (newNode).
             */
            replaceWith(node: Node, newNode: Node): Node;

            /**
             * Takes in a string representing innerHTML and returns a DocumentFragment
             * containing the serialized DOM.
             *
             * @param template The DOM string.
             * @return {DocumentFragment} The serialized DOM.
             */
            serializeTemplate(template: string): DocumentFragment;

            /**
             * Takes in a startNode and endNode, each having the same parentNode.
             * Removes every node in between the startNode.  If endNode is not specified,
             * DOM will be removed until the end of the parentNode's children.
             *
             * @param startNode The starting node, which will not be removed.
             * @param endNode The ending node, which will not be removed.
             */
            removeBetween(startNode: Node, endNode?: Node): void;

            /**
             * Takes in a startNode and endNode, each having the same parentNode.
             * Removes every node in between the startNode and endNode as well as
             * the startNode and the endNode.  If endNode is not specified, DOM
             * will be removed until the end of the parentNode's children.
             *
             * @param startNode The first node to remove.
             * @param endNode The last node to remove.
             */
            removeAll(startNode: Node, endNode?: Node): void;
        }

        export class BindableTemplates implements IBindableTemplates {
            static $TemplateControlStatic: ITemplateControlStatic;

            /**
             * Creates a new instance of BindableTemplates and returns it. If a BindableTemplates is 
             * passed in, it will use the properties on the original BindableTemplates.
             * 
             * @param control The ITemplateControl containing the new BindableTemplate object, used for data context 
             * inheritance for templates.
             * @param originalBindableTemplates An optional IBindableTemplates object to copy.
             * @return {BindableTemplates} The newly instantiated BindableTemplates object.
             */
            static create(control: ITemplateControl, original?: IBindableTemplates): IBindableTemplates {
                var bindableTemplates = new BindableTemplates();
                bindableTemplates.control = control;

                if (!isNull(original)) {
                    bindableTemplates.templates = original.templates;
                    bindableTemplates.cache = original.cache;
                }

                return bindableTemplates;
            }

            static dispose(control: ITemplateControl) {
                var bindableTemplates = control.bindableTemplates,
                    dispose = BindableTemplates.$TemplateControlStatic.dispose;

                if (isNull(control.bindableTemplates)) {
                    return;
                }

                var compiledControls = bindableTemplates.compiledControls,
                    length = compiledControls.length;

                for (var i = 0; i < length; ++i) {
                    dispose(compiledControls[i]);
                }

                bindableTemplates.compiledControls = [];
                bindableTemplates.control = null;
                bindableTemplates.cache = {};
                bindableTemplates.templates = {};
            }
            /**
             * Stores the compiled templates for this object, ready to be bound to a data context. 
             * All created templates are DocumentFragments, allowing a ITemplateControl to
             * easily insert the template into the DOM (without iterating over childNodes).
             */
            templates = {};
            control: ITemplateControl;
            cache: IObject<processing.IElementManager> = {};
            compiledControls: Array<ITemplateControl> = [];
            $ResourcesStatic: IResourcesStatic = acquire('$ResourcesStatic');
            $PromiseStatic: async.IPromiseStatic = acquire('$PromiseStatic');
            $ManagerCacheStatic: storage.ICache<processing.IElementManager> = acquire('$ManagerCacheStatic');
            $dom: IDom = acquire('$dom');
            $ExceptionStatic: IExceptionStatic = acquire('$ExceptionStatic');
            $document: Document = acquire('$document');
            $ElementManagerStatic: processing.IElementManagerStatic = acquire('$ElementManagerStatic');

            /**
             * Provides a way for ITemplateControls to bind a template to a data context. Useful 
             * for narrowing data context without needing another ITemplateControl. In addition, 
             * this object provides a performance increase because it will only compile the template once.
             * This object is also useful when a ITemplateControl expects multiple configuration
             * templates in its innerHTML. It can separate those templates and reuse them accordingly.
             */
            constructor() { }

            /**
             * Method for linking a new template to a data context and returning a clone of the template, 
             * with all new IControls created if the template contains controls. It is not necessary
             * to specify a data context.
             * 
             * @param key The key used to retrieve the template.
             * @param callback The callback associated with binding the template to the specified data
             * context. 
             * @param relativeIdentifier The identifier string relative to this control's context
             * (e.g. 'foo.bar.baz' would signify the object this.context.foo.bar.baz). This is the 
             * most efficient way of specifying context, else the framework has to search for the 
             * object.
             * @param resources An object used as the resources for any top-level 
             * controls created in the template.
             * @return {DocumentFragment} A clone of the template, fully reconstructed and ready to put
             * in the DOM.
             */
            bind(key: string, callback: IBindableTemplateCallback, relativeIdentifier?: string, resources?: IObject<IResource>);
            /**
             * Method for linking a new template to a data context and returning a clone of the template, 
             * with all new IControls created if the template contains controls. It is not necessary
             * to specify a data context.
             * 
             * @param key The key used to retrieve the template.
             * @param callback The callback associated with binding the template to the specified data
             * context. 
             * @param context An object on this control's context. The framework will find the 
             * correct path to the object. It is recommended to use the relativeIdentifier if possible,
             * as it is a more efficient method.
             * @param resources An object used as the resources for any top-level 
             * controls created in the template.
             * @return {DocumentFragment} A clone of the template, fully reconstructed and ready to put
             * in the DOM.
             */
            bind(key: string, callback: IBindableTemplateCallback, context?: any, resources?: IObject<IResource>);
            bind(key: any, callback: IBindableTemplateCallback, context?: any, resources?: IObject<IResource>) {
                var template: any = this.templates[key],
                    control: ITemplateControl = this.control,
                    nodeMap: processing.INodeMap,
                    templatePromise;

                if (isNull(template)) {
                    this.$ExceptionStatic.fatal('Cannot bind template, no template stored with key: ' + key,
                        this.$ExceptionStatic.TEMPLATE);
                    return;
                }

                if (!isNull(context) && !isString(context)) {
                    context = this.control.getIdentifier(context);
                }

                if (isFunction(template.then)) {
                    template.then((result: DocumentFragment) => {
                        this._bindTemplate(key, <DocumentFragment>result.cloneNode(true), context, resources, callback);
                    }).catch((error) => {
                        postpone(() => {
                            this.$ExceptionStatic.fatal(error, this.$ExceptionStatic.COMPILE);
                        });
                    });
                    return;
                }
                this._bindTemplate(key, <DocumentFragment>template.cloneNode(true), context, resources, callback);
            }

            /**
             * Adds a template to this object. The template will be stored with the key,
             * and it will be transformed into a DocumentFragment.
             * 
             * @param key The key used to store the template.
             * @param template An HTMLElement represending the template DOM.
             */
            add(key: string, template: HTMLElement);
            /**
             * Adds a template to this object. The template will be stored with the key,
             * and it will be transformed into a DocumentFragment.
             * 
             * @param key The key used to store the template.
             * @param template A Node array represending the template DOM.
             */
            add(key: string, template: Array<Node>);
            /**
             * Adds a template to this object. The template will be stored with the key,
             * and it will be transformed into a DocumentFragment.
             * 
             * @param key The key used to store the template.
             * @param template A NodeList represending the template DOM.
             */
            add(key: string, template: NodeList);
            /**
             * Adds a template to this object. The template will be stored with the key.
             * 
             * @param key The key used to store the template.
             * @param template A DocumentFragment represending the template DOM.
             */
            add(key: string, template: DocumentFragment);
            /**
             * Adds a template to this object. The template will be stored with the key,
             * and it will be transformed into a DocumentFragment.
             * 
             * @param key The key used to store the template.
             * @param template A Node represending the template DOM.
             */
            add(key: string, template: Node);
            add(key: string, template: any) {
                if (isNull(template)) {
                    return;
                }

                if (template.nodeType === Node.DOCUMENT_FRAGMENT_NODE) {
                    this.templates[key] = template;
                    this._compile(key, template);
                    return;
                }

                var fragment = this.$document.createDocumentFragment(),
                    nodes;

                if (isNode(template)) {
                    fragment.appendChild(template);
                } else if (isArrayLike(template)) {
                    this.$dom.appendChildren(template, fragment);
                } else {
                    return;
                }

                this.templates[key] = fragment;

                this._compile(key, fragment);
            }
            _bindTemplate(key: string, template: DocumentFragment,
            context: string, resources: IObject<IResource>, callback: IBindableTemplateCallback) {
                var control = this._createBoundControl(key, template, context, resources),
                    nodeMap = this._createNodeMap(control, template, context);

                this._bindNodeMap(nodeMap, key).then(() => {
                    control.startNode = template.insertBefore(this.$document.createComment(control.type + ': start node'),
                        template.firstChild);
                    control.endNode = template.insertBefore(this.$document.createComment(control.type + ': end node'), null);

                    callback.call(this.control, template);
                }).catch((error) => {
                    postpone(() => {
                        this.$ExceptionStatic.fatal(error, this.$ExceptionStatic.BIND);
                    });
                });
            }
            _bindNodeMap(nodeMap: processing.INodeMap, key: string) {
                var manager = this.cache[key],
                    child = nodeMap.uiControlNode.control,
                    template = nodeMap.element;

                this.control.controls.push(child);

                manager.clone(template, this.$ManagerCacheStatic.read(this.control.uid), nodeMap);
                return (this.$ManagerCacheStatic.read(child.uid)).bindAndLoad();
            }
            _compile(key: string, template: DocumentFragment) {
                var control = this._createBoundControl(key, template),
                    nodeMap = this._createNodeMap(control, template);

                this.compiledControls.push(control);

                this._compileNodeMap(control, nodeMap, key);
            }
            _compileNodeMap(control: ITemplateControl, nodeMap: processing.INodeMap, key: string) {
                var manager = this.$ElementManagerStatic.getInstance(),
                    promises = [];

                manager.isClone = true;
                manager.initialize(nodeMap, null);
                promises.push(manager.setUiControlTemplate());

                this.cache[key] = manager;

                promises.push(manager.fulfillTemplate());

                this.templates[key] = <any>this.$PromiseStatic.all<any, Error>(promises).then((results) => {
                    var element = nodeMap.element,
                        startNode,
                        endNode;

                    this.templates[key] = <DocumentFragment>nodeMap.element.cloneNode(true);

                    startNode = control.startNode = this.$document.createComment(control.type + ': start node');
                    endNode = control.endNode = this.$document.createComment(control.type + ': end node');
                    element.insertBefore(startNode, element.firstChild);
                    element.insertBefore(endNode, null);

                    return this.templates[key];
                }).catch((error) => {
                    postpone(() => {
                        this.$ExceptionStatic.fatal(error, this.$ExceptionStatic.COMPILE);
                    });
                });

                return this.templates[key];
            }
            _createNodeMap(uiControl: ITemplateControl, template: Node, childContext?: string): processing.INodeMap {
                return {
                    element: <HTMLElement>template,
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
            }
            _createBoundControl(key: string, template: DocumentFragment,
            relativeIdentifier?: string, resources?: IObject<IResource>) {
                var control = new BindableTemplates.$TemplateControlStatic(),
                    parent = this.control,
                    hasRelativeIdentifier = !isEmpty(relativeIdentifier),
                    absoluteContextPath: string;

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
                control.element = <HTMLElement>template;
                control.type = this.control.type + '-@' + key;

                return control;
            }
        }

        export function BindableTemplatesStatic($TemplateControlStatic) {
            BindableTemplates.$TemplateControlStatic = $TemplateControlStatic;
            return BindableTemplates;
        }

        register.injectable('$BindableTemplatesStatic', BindableTemplatesStatic, [
            '$TemplateControlStatic'
        ], register.injectableType.STATIC);

        /**
         * Describes an object which provides a way for ITemplateControls to bind a template 
         * to a data context. Useful for narrowing data context without needing another 
         * ITemplateControl. In addition, this object provides a performance increase because 
         * it will only compile the template once. This object is also useful when a 
         * ITemplateControl expects multiple configuration templates in its innerHTML. It can 
         * separate those templates and reuse them accordingly.
         */
        export interface IBindableTemplates {
            /**
             * The control containing the IBindableTemplate object.
             */
            control: ITemplateControl;
            /**
             * Stores the compiled templates for this object, ready to be bound to a data context. 
             * All created templates are DocumentFragments, allowing a ITemplateControl to
             * easily insert the template into the DOM (without iterating over childNodes). This object
             * may contain a template promise.
             */
            templates: {};

            cache: IObject<processing.IElementManager>;
            compiledControls: Array<ITemplateControl>;

            /**
             * Method for linking a new template to a data context and returning a clone of the template, 
             * with all new IControls created if the template contains controls. It is not necessary
             * to specify a data context.
             * 
             * @param key The key used to retrieve the template.
             * @param callback The callback associated with binding the template to the specified data
             * context. 
             * @param relativeIdentifier The identifier string relative to this control's context
             * (e.g. 'foo.bar.baz' would signify the object this.context.foo.bar.baz). This is the 
             * most efficient way of specifying context, else the framework has to search for the 
             * object.
             * @param resources An object used as the resources for any top-level  
             * controls created in the template.
             * @return {DocumentFragment} A clone of the template, fully reconstructed and ready to put
             * in the DOM.
             */
            bind(key: string, callback: IBindableTemplateCallback, relativeIdentifier?: string, resources?: IObject<IResource>);
            /**
             * Method for linking a new template to a data context and returning a clone of the template, 
             * with all new IControls created if the template contains controls. It is not necessary
             * to specify a data context.
             * 
             * @param key The key used to retrieve the template.
             * @param callback The callback associated with binding the template to the specified data
             * context. 
             * @param context An object on this control's context. The framework will find the 
             * correct path to the object. It is recommended to use the relativeIdentifier if possible,
             * as it is a more efficient method.
             * @param resources An object used as the resources for any top-level 
             * controls created in the template.
             * @return {DocumentFragment} A clone of the template, fully reconstructed and ready to put
             * in the DOM.
             */
            bind(key: string, callback: IBindableTemplateCallback, context?: any, resources?: IObject<IResource>);

            /**
             * Adds a template to this object. The template will be stored with the key,
             * and it will be transformed into a DocumentFragment.
             * 
             * @param key The key used to store the template.
             * @param template An HTMLElement represending the template DOM.
             */
            add(key: string, template: HTMLElement);
            /**
             * Adds a template to this object. The template will be stored with the key,
             * and it will be transformed into a DocumentFragment.
             * 
             * @param key The key used to store the template.
             * @param template A Node array represending the template DOM.
             */
            add(key: string, template: Array<Node>);
            /**
             * Adds a template to this object. The template will be stored with the key,
             * and it will be transformed into a DocumentFragment.
             * 
             * @param key The key used to store the template.
             * @param template A NodeList represending the template DOM.
             */
            add(key: string, template: NodeList);
            /**
             * Adds a template to this object. The template will be stored with the key.
             * 
             * @param key The key used to store the template.
             * @param template A DocumentFragment represending the template DOM.
             */
            add(key: string, template: DocumentFragment);
            /**
             * Adds a template to this object. The template will be stored with the key,
             * and it will be transformed into a DocumentFragment.
             * 
             * @param key The key used to store the template.
             * @param template A Node represending the template DOM.
             */
            add(key: string, template: Node);
        }

        /**
         * Describes a function used as the callback associated with binding a specified 
         * template to a specified data context.
         * 
         * @param clone The bound clone of the specified template.
         */
        export interface IBindableTemplateCallback {
            /**
             * Receives a DocumentFragment clone ready to inject into DOM.
             * 
             * @param clone
             */
            (clone: DocumentFragment): void;
        }

        export interface IBindableTemplatesStatic {
            /**
             * Creates a new instance of BindableTemplates and returns it. If a BindableTemplates is
             * passed in, it will use the properties on the original BindableTemplates.
             *
             * @param control The ITemplateControl containing the new BindableTemplate object, used for data context
             * inheritance for templates.
             * @param originalBindableTemplates An optional IBindableTemplates object to copy.
             * @return {BindableTemplates} The newly instantiated BindableTemplates object.
             */
            create(control: ITemplateControl, original?: IBindableTemplates): IBindableTemplates;

            dispose(control: ITemplateControl)
        }

        export class Attributes implements IAttributes {
            private __listeners: IObject<Array<(newValue: any, oldValue: any) => void>> = {};
            private __control: IControl;

            /**
             * Stores the information about an HTMLElement's attribute NamedNodeMap, and allows a control to observe 
             * for changes on an attribute. The interface takes in a generic type, allowing ITemplateControls 
             * to specify an interface for their plat-options.
             * 
             * Attributes for this object are converted from dash-notation to camelCase notation. 'plat-options' are 
             * parsed and stored as an object on this object, all other attributes are stored with their string values.
             */
            initialize(control: IControl, attributes: IObject<string>) {
                this.__control = control;

                var keys = Object.keys(attributes),
                    attributeListeners = this.__listeners,
                    key: string,
                    length = keys.length,
                    parent = control.parent,
                    hasParent = !isNull(parent);

                for (var i = 0; i < length; ++i) {
                    key = keys[i];
                    this[key] = attributes[key];
                    attributeListeners[key] = [];
                }
            }

            /**
             * Provides a way to observe an attribute for changes.
             * 
             * @param key The attribute to observe for changes (e.g. 'platOptions').
             * @param listener The listener function to be called when the attribute changes. The
             * 'this' context of the listener will be scoped to the control instance.
             */
            observe(key: string, listener: (newValue: any, oldValue: any) => void): IRemoveListener {
                var listeners = this.__listeners[camelCase(key)];

                if (isNull(listeners)) {
                    return noop;
                }

                var length = listeners.length;

                listeners.push(listener);

                return function removeListener() {
                    listeners.splice(length, 1);
                };
            }
        
            /**
             * Used to show an attribute has been changed and forces listeners to be fired.
             * 
             * @param key The attribute being observed for changes (e.g. 'platOptions').
             * @param newValue The new value of the attribute.
             * @param oldValue The previous value of the attribute.
             */
            attributeChanged(key: string, newValue: any, oldValue: any) {
                var control = this.__control,
                    listeners = this.__listeners[camelCase(key)],
                    length = listeners.length;

                for (var i = 0; i < length; ++i) {
                    listeners[i].call(control, newValue, oldValue);
                }
            }
        }

        register.injectable('$attributes', Attributes, null, register.injectableType.MULTI);

        /**
         * Describes an object that stores the information about an HTMLElement's attribute NamedNodeMap.
         * Methods are implemented to allow you to observe for changes on an attribute.
         * 
         * Attributes for this object are converted from dash-notation to camelCase notation.
         */
        export interface IAttributes {
            /**
             * Stores the information about an HTMLElement's attribute NamedNodeMap, and allows a control to observe 
             * for changes on an attribute. The interface takes in a generic type, allowing ITemplateControls 
             * to specify an interface for their plat-options.
             * 
             * Attributes for this object are converted from dash-notation to camelCase notation. 'plat-options' are 
             * parsed and stored as an object on this object, all other attributes are stored with their string values.
             */
            initialize(control: IControl, attributes: IObject<string>): void;

            /**
             * Provides a way to observe an attribute for changes.
             * 
             * @param key The attribute to observe for changes.
             * @param listener The listener function to be called when the attribute changes.
             */
            observe(key: string, listener: (newValue: any, oldValue: any) => void): IRemoveListener;
        }

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
        export class Resources implements IResources {
            static $ContextManagerStatic: observable.IContextManagerStatic;
            static $regex: expressions.IRegex;
            static $ExceptionStatic: IExceptionStatic;
            /**
             * Populates an IResource value if necessary, and adds it to the given 
             * control's resources.
             * 
             * @param control The control for which to create a resource.
             * @param resource The IResource used to set the value.
             * @return {IResource} The created resource.
             */
            static createResource(control: ITemplateControl, resource: IResource) {
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
                            } else {;
                                Resources.$ExceptionStatic.warn('Attempted to create a "function" ' +
                                    'type Resource with a function not found on your control.',
                                    Resources.$ExceptionStatic.BIND);
                                resource.value = noop;
                            }
                        }
                        break;
                }

                return resource;
            }

            /**
             * Adds resource aliases for '@control' and '@context'. The resources are 
             * aliases for the control instance and the control.context.
             * 
             * @param control The control on which to add the resources.
             */
            static addControlResources(control: ITemplateControl) {
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
                    Resources.__addRoot(<IViewControl>control);
                }
            }

            /**
             * Binds the resources in a resource instance. This involves injecting 
             * the injectable resources, creating object/observable resources, and
             * binding functions to the associated control's instance.
             * 
             * @param resourcesInstance The instance of the IResources object.
             */
            static bindResources(resourcesInstance: IResources);
            static bindResources(resourcesInstance: Resources) {
                var resources = resourcesInstance.__resources,
                    control = resourcesInstance.__controlInstance,
                    aliases = Object.keys(resources),
                    controlResources = Resources.__controlResources,
                    length = aliases.length,
                    alias;
                
                for (var i = 0; i < length; ++i) {
                    alias = aliases[i];

                    if (controlResources.indexOf(alias) !== -1) {
                        continue;
                    }

                    resourcesInstance[alias] = resources[alias] = Resources.createResource(control,
                        resourcesInstance[alias]);
                }
            
                resourcesInstance.__bound = true;
            }

            /**
             * Disposes a resource instance, removing its reference 
             * from a control and breaking references to all resource 
             * objects.
             * 
             * @param resources The resources instance.
             */
            static dispose(control: ITemplateControl, persist?: boolean) {
                var resources = <Resources>control.resources;

                if (isNull(resources)) {
                    return;
                }

                var keys = Object.keys(resources.__resources),
                    key: string,
                    length = keys.length,
                    define = Resources.$ContextManagerStatic.defineProperty,
                    resource: IResource;

                for (var i = 0; i < length; ++i) {
                    key = keys[i];
                    resource = resources[key];

                    if (!isNull(resource) && resource.type === 'observable') {
                        define(resources, key, persist ? deepExtend({}, resource) : null, true, true);
                    }
                }

                Resources._removeListeners(resources.__controlInstance);
            }
        
            /**
             * Parses a resources HTMLElement and creates 
             * an IObject<IResource> with its element children.
             * 
             * @param element The resources element to parse.
             * @return {IObject<IResource>} The resources created 
             * using element.
             */
            static parseElement(element: HTMLElement) {
                var slice = Array.prototype.slice,
                    whiteSpaceRegex = Resources.$regex.whiteSpaceRegex,
                    quotationRegex = Resources.$regex.quotationRegex,
                    resources: IObject<IResource> = {},
                    resource: IResource,
                    types = Resources.__resourceTypes,
                    attrs: NamedNodeMap,
                    attr: Attr,
                    children = slice.call(element.children),
                    child: HTMLElement,
                    nodeName: string,
                    text: string;

                while (children.length > 0) {
                    child = children.pop();
                    nodeName = child.nodeName.toLowerCase();

                    if (types.indexOf(nodeName) === -1) {
                        continue;
                    }

                    attrs = child.attributes;
                    resource = <IResource>{};

                    attr = attrs.getNamedItem('alias');
                    if (isNull(attr)) {
                        continue;
                    }
                    resource.alias = attr.value;

                    text = child.textContent.replace(whiteSpaceRegex, '$1');
                    if (isEmpty(text)) {
                        continue;
                    }
                    resource.value = (nodeName === 'injectable') ?
                        text.replace(quotationRegex, '') : text;

                    resource.type = nodeName;
                    resources[resource.alias] = resource;
                }

                return resources;
            }

            /**
             * Returns a new instance of IResources
             */
            static getInstance() {
                return new Resources();
            }

            private static __controlResources = ['control', 'context', 'root', 'rootContext'];
            private static __resourceTypes = ['injectable', 'object', 'observable', 'function'];
            private static __observableResourceRemoveListeners: IObject<Array<IRemoveListener>> = {};

            /**
             * Adds a '@root' alias and '@rootContext' to a control, specifying that it contains the root 
             * and root context. Root controls are the root IViewControl.
             * 
             * @param control The root IViewControl.
             */
            private static __addRoot(control: IViewControl) {
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
            }

            static _observeResource(control: ITemplateControl, resource: IResource) {
                var value = resource.value,
                    uid = control.uid,
                    removeListeners = Resources.__observableResourceRemoveListeners[uid];

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
            }

            static _removeListeners(control: ITemplateControl) {
                if (isNull(control)) {
                    return;
                }

                var uid = control.uid,
                    removeListeners = Resources.__observableResourceRemoveListeners[uid];

                if (isArray(removeListeners)) {
                    var length = removeListeners.length;

                    for (var i = 0; i < length; ++i) {
                        removeListeners[i]();
                    }
                }

                Resources.__observableResourceRemoveListeners[uid] = null;
                delete Resources.__observableResourceRemoveListeners[uid];
            }

            private __resources: IObject<IResource> = {};
            private __bound: boolean = false;
            private __controlInstance: ITemplateControl;

            /**
             * @param control The control containing this Resources instance.
             * @param element An optional element used to create initial IResource objects.
             */
            initialize(control: ITemplateControl, element?: HTMLElement);
            /**
             * @param control The control containing this Resources instance.
             * @param resources An optional IObject<IResource> used to populate initial
             * IResource objects.
             */
            initialize(control: ITemplateControl, resources?: IObject<IResource>);
            /**
             * @param control The control containing this Resources instance.
             * @param element An optional IResources object used to populate initial 
             * IResource objects.
             */
            initialize(control: ITemplateControl, resources?: IResources);
            initialize(controlInstance: ITemplateControl, resources?: any) {
                this.__controlInstance = controlInstance;

                if (isNull(resources)) {
                    return;
                } else if (isNode(resources)) {
                    resources = Resources.parseElement(resources);
                } else if (isObject(resources.resources)) {
                    resources = resources.resources;
                }

                this.__resources = resources;

                var keys = Object.keys(resources),
                    key: string,
                    injector: dependency.IInjector<any>,
                    length = keys.length;

                for (var i = 0; i < length; ++i) {
                    key = keys[i];
                    this[key] = resources[key];
                }
            }

            /**
             * Used for programatically adding IResource objects.
             * 
             * @param resources An IObject<IResource> used to add 
             * resources, keyed by their alias.
             * 
             * @example control.resources.add({
             *     myAlias: {
             *         type: 'observable',
             *         value: { 
             *             hello: 'Hello World!'
             *         } 
             *     }
             * });
             */
            add(resources: IObject<IResource>);
            /**
             * Used for programatically adding IResource objects.
             * 
             * @param element An HTMLElement containing resource element children.
             * 
             * @example
             *     <plat-resources>
             *         <injectable alias="Cache">$CacheStatic</injectable>
             *         <observable alias="testObj">{ foo: 'foo', bar: 'bar', baz: 2 }</observable>
             *     </plat-resources>
             * 
             * The resource type is specified by the element name.
             */
            add(element: HTMLElement);
            add(resources: any) {
                if (isNull(resources)) {
                    return;
                } else if (isNode(resources)) {
                    resources = Resources.parseElement(resources);
                }

                var keys = Object.keys(resources),
                    length = keys.length,
                    resource: IResource,
                    control = this.__controlInstance,
                    bound = this.__bound,
                    key: string,
                    create = Resources.createResource;

                for (var i = 0; i < length; ++i) {
                    key = keys[i];
                    resource = resources[key];
                    resource.alias = key;

                    this[key] = this.__resources[key] = bound ? create(control, resource) : resource;
                }
            }
        }

        export function ResourcesStatic(
        $ContextManagerStatic,
        $regex,
        $ExceptionStatic) {
            Resources.$ContextManagerStatic = $ContextManagerStatic;
            Resources.$regex = $regex;
            Resources.$ExceptionStatic = $ExceptionStatic;
            return Resources;
        }

        register.injectable('$ResourcesStatic', ResourcesStatic, [
            '$ContextManagerStatic',
            '$regex',
            '$ExceptionStatic'
        ], register.injectableType.STATIC);

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
        export interface IResources {
            /**
             * Used for programatically adding IResource objects.
             * 
             * @param resources An IObject<IResource> used to add 
             * resources, keyed by their alias.
             * 
             * @example control.resources.add({
             *     myAlias: {
             *         type: 'observable',
             *         value: { 
             *             hello: 'Hello World!'
             *         } 
             *     }
             * });
             */
            add(resources: IObject<IResource>);
            /**
             * Used for programatically adding IResource objects.
             * 
             * @param element An HTMLElement containing resource element children.
             * 
             * @example
             *     <plat-resources>
             *         <injectable alias="Cache">$CacheStatic</injectable>
             *         <observable alias="testObj">{ foo: 'foo', bar: 'bar', baz: 2 }</observable>
             *     </plat-resources>
             * 
             * The resource type is specified by the element name.
             */
            add(element: HTMLElement): void;

            /**
             * @param control The control containing this Resources instance.
             * @param element An optional element used to create initial IResource objects.
             */
            initialize(control: ITemplateControl, element?: HTMLElement);
            /**
             * @param control The control containing this Resources instance.
             * @param resources An optional IObject<IResource> used to populate initial
             * IResource objects.
             */
            initialize(control: ITemplateControl, resources?: IObject<IResource>);
            /**
             * @param control The control containing this Resources instance.
             * @param element An optional IResources object used to populate initial 
             * IResource objects.
             */
            initialize(control: ITemplateControl, resources?: IResources);
        }

        export interface IResource {
            alias?: string;
            type: string;
            value?: any;
            initialValue?: any;
        }

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
        export interface IResourcesStatic {
            /**
             * Populates an IResource value if necessary, and adds it to the given
             * control's resources.
             *
             * @param control The control for which to create a resource.
             * @param resource The IResource used to set the value.
             * @return {IResource} The created resource.
             */
            createResource(control: ITemplateControl, resource: IResource): IResource;

            /**
             * Adds resource aliases for '@control' and '@context'. The resources are
             * aliases for the control instance and the control.context.
             *
             * @param control The control on which to add the resources.
             */
            addControlResources(control: ITemplateControl): void;

            /**
             * Binds the resources in a resource instance. This involves injecting
             * the injectable resources, creating object/observable resources, and
             * binding functions to the associated control's instance.
             *
             * @param resourcesInstance The instance of the IResources object.
             */
            bindResources(resourcesInstance: IResources): void;

            /**
             * Disposes a resource instance, removing its reference
             * from a control and breaking references to all resource
             * objects.
             *
             * @param resources The resources instance.
             */
            dispose(control: ITemplateControl, persist?: boolean): void;

            /**
             * Parses a resources HTMLElement and creates
             * an IObject<IResource> with its element children.
             *
             * @param element The resources element to parse.
             * @return {IObject<IResource>} The resources created
             * using element.
             */
            parseElement(element: HTMLElement): IObject<IResource>;

            /**
             * Returns a new instance of IResources
             */
            getInstance(): IResources;
        }

        export module controls {
            export class Baseport extends TemplateControl implements IBaseport {
                $ManagerCacheStatic: storage.ICache<processing.IElementManager> = acquire('$ManagerCacheStatic');
                $ExceptionStatic: IExceptionStatic = acquire('$ExceptionStatic');
                $document: Document = acquire('$document');
                $ElementManagerStatic: processing.IElementManagerStatic = acquire('$ElementManagerStatic');
                constructor(public navigator: navigation.IBaseNavigator) {
                    super();
                }

                /**
                 * Clears the Baseport's innerHTML.
                 */
                setTemplate() {
                    this.dom.clearNode(this.element);
                }

                /**
                 * Initializes the navigator.
                 * 
                 * @param navigationParameter A parameter needed 
                 * to perform the specified type of navigation.
                 * @param options The IBaseNavigationOptions 
                 * needed on load for the inherited form of 
                 * navigation.
                 */
                loaded(navigationParameter?: any, options?: navigation.IBaseNavigationOptions) {
                    var navigator = this.navigator;
                    navigator.initialize(this);
                    navigator.navigate(navigationParameter, options);
                }

                /**
                 * Grabs the root of this Baseport's manager 
                 * tree, clears it, and initializes the 
                 * creation of a new one by kicking off a 
                 * navigate.
                 * 
                 * @param ev The navigation options
                 */
                navigateTo(ev: IBaseportNavigateToOptions) {
                    var control = ev.target,
                        parameter = ev.parameter,
                        options = ev.options,
                        element = this.element,
                        controlType = ev.type,
                        newControl = isFunction(control.inject);

                    var node = this.$document.createElement(controlType),
                        attributes: IObject<string> = {},
                        nodeMap = {
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
                }

                /**
                 * Manages the navigatingFrom lifecycle event for 
                 * ViewControls.
                 * 
                 * @param fromControl The ViewControl being navigated 
                 * away from.
                 */
                navigateFrom(fromControl: IViewControl) {
                    if (isNull(fromControl) || !isFunction(fromControl.navigatingFrom)) {
                        return;
                    }

                    fromControl.navigatingFrom();
                }
            }

            /**
             * Navigation options for a Baseport and all 
             * controls that inherit from Baseport.
             */
            export interface IBaseportNavigateToOptions {
                /**
                 * Either a view control or an injector for a view control.
                 */
                target: any;

                /**
                 * The navigation parameter.
                 */
                parameter: any;

                /**
                 * The options used for navigation.
                 */
                options: navigation.IBaseNavigationOptions;

                /**
                 * The type of view control to navigate to.
                 */
                type: string;
            }

            export interface IBaseport extends ITemplateControl {
                /**
                 * The object in charge of performing the 
                 * navigation to and from different 
                 * ViewControls.
                 */
                navigator: navigation.IBaseNavigator;

                /**
                 * Grabs the root of this Baseport's manager 
                 * tree, clears it, and initializes the 
                 * creation of a new one by kicking off a 
                 * navigate.
                 * 
                 * @param ev The navigation options
                 */
                navigateTo(ev: IBaseportNavigateToOptions): void;

                /**
                 * Manages the navigatingFrom lifecycle event for 
                 * ViewControls.
                 * 
                 * @param fromControl The ViewControl being navigated 
                 * away from.
                 */
                navigateFrom(fromControl: IViewControl): void;
            }

            export class Viewport extends Baseport {
                /**
                 * The evaluated plat-options object.
                 */
                options: observable.IObservableProperty<IViewportOptions>;

                /**
                 * A type of navigator that uses either the ViewControl's 
                 * Constructors or their registered names for navigation 
                 * from one to another.
                 */
                navigator: navigation.INavigator;

                /**
                 * Checks for a defaultView, finds the ViewControl's injector, 
                 * and initializes the loading of the view.
                 */
                loaded() {
                    if (isNull(this.options)) {
                        this.$ExceptionStatic.warn('No defaultView specified in plat-options for plat-viewport.',
                            this.$ExceptionStatic.NAVIGATION);
                        return;
                    }

                    var options = this.options.value || <IViewportOptions>{},
                        controlType = options.defaultView,
                        injector = viewControlInjectors[controlType];

                    if (isNull(injector)) {
                        this.$ExceptionStatic.fatal('The defaultView ' + controlType + ' is not a registered view control.',
                            this.$ExceptionStatic.NAVIGATION);
                        return;
                    }

                    super.loaded(injector);
                }
            }

            /**
             * The available options for plat.ui.controls.Viewport.
             */
            export interface IViewportOptions {
                /**
                 * The registered name of the default 
                 * ViewControl to initially navigate to.
                 */
                defaultView: string;
            }

            register.control('plat-viewport', Viewport, ['$navigator']);

            class Routeport extends Baseport {
                /**
                 * The evaluated plat-options object.
                 */
                options: observable.IObservableProperty<IRouteportOptions>;

                /**
                 * A type of navigator that uses the registered routes 
                 * for ViewControls to navigate to and from one another.
                 */
                navigator: navigation.IRoutingNavigator;

                /**
                 * Looks for a defaultRoute and initializes the loading 
                 * of the view.
                 */
                loaded() {
                    var path = '',
                        options = this.options;

                    if (!isNull(options) && !isNull(options.value)) {
                        path = options.value.defaultRoute || '';
                    }

                    super.loaded(path, {
                        replace: true
                    });
                }
            }

            /**
             * The available options for plat.ui.controls.Routeport.
             */
            export interface IRouteportOptions {
                /**
                 * The registered route of the default 
                 * ViewControl to initially navigate to.
                 */
                defaultRoute: string;
            }

            register.control('plat-routeport', Routeport, ['$routingNavigator']);

            export class Template extends TemplateControl {
                /**
                 * Removes the <plat-template> node from the DOM
                 */
                replaceWith: string = null;

                /**
                 * The evaluated plat-options object.
                 */
                options: observable.IObservableProperty<ITemplateOptions>;
                $PromiseStatic: async.IPromiseStatic = acquire('$PromiseStatic');
                $templateCache: storage.ICache<async.IPromise<DocumentFragment, Error>> = acquire('$templateCache');
                $ExceptionStatic: IExceptionStatic = acquire('$ExceptionStatic');

                /**
                 * The unique ID used to reference a particular 
                 * template.
                 */
                _id: string;

                /**
                 * The optional URL associated with this 
                 * particular template.
                 */
                _url: string;
                private __isFirst: boolean = false;
                private __templatePromise: async.IPromise<Template, async.IAjaxError>;
                private __templateControlCache: storage.ICache<any>;
                constructor() {
                    super();
                    var Cache: storage.ICacheStatic = acquire('$CacheStatic');
                    this.__templateControlCache = Cache.create<any>('templateControlCache');
                }

                /**
                 * Initializes the creation of the template.
                 */
                initialize() {
                    var templateControlCache = this.__templateControlCache,
                        id = this._id = this.options.value.id,
                        options = this.options.value;

                    if (isNull(id)) {
                        return;
                    }

                    this._url = options.url;

                    var templatePromise: async.IPromise<Template, Error> = this.__templateControlCache.read(id);
                    if (!isNull(templatePromise)) {
                        this.__templatePromise = templatePromise;
                        return;
                    }

                    this.__isFirst = true;
                    this._initializeTemplate();
                }

                /**
                 * Decides if this is a template definition or 
                 * a template instance.
                 */
                loaded() {
                    if (!this.__isFirst) {
                        this._waitForTemplateControl(this.__templatePromise);
                    }
                }

                /**
                 * Removes the template from the template cache.
                 */
                dispose() {
                    if (this.__isFirst) {
                        this.$templateCache.remove(this._id);
                        this.__templateControlCache.dispose();
                    }
                }

                /**
                 * Determines whether a URL or innerHTML is being used, 
                 * creates the bindable template, and stores the template 
                 * in a template cache for later use.
                 */
                _initializeTemplate() {
                    var id = this._id,
                        $document: Document = acquire('$document');

                    if (isNull(id)) {
                        return;
                    }

                    var parentNode = this.endNode.parentNode,
                        url = this._url,
                        template;

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
                        controlPromise = template.then(function templateSuccess(template: DocumentFragment) {
                            var bindableTemplates = this.bindableTemplates;
                            bindableTemplates.add(id, template.cloneNode(true));
                            return this;
                        });
                    } else {
                        this.bindableTemplates.add(id, template.cloneNode(true));

                        controlPromise = this.$PromiseStatic.resolve(this);
                    }

                    this.__templateControlCache.put(id, controlPromise);
                }

                /**
                 * Waits for the template promise to resolve, then initializes 
                 * the binding of the bindable template and places it into the 
                 * DOM.
                 * 
                 * @param templatePromise The promise associated with the first 
                 * instance of the template with this ID.
                 */
                _waitForTemplateControl(templatePromise: async.IPromise<Template, async.IAjaxError>) {
                    templatePromise.then((templateControl: Template) => {
                        if (!(isNull(this._url) || (this._url === templateControl._url))) {
                            this.$ExceptionStatic.warn('The specified url: ' + this._url +
                                ' does not match the original plat-template with id: ' +
                                '"' + this._id + '". The original url will be loaded.',
                                this.$ExceptionStatic.TEMPLATE);
                        }

                        var endNode = this.endNode;
                        templateControl._instantiateTemplate(this).then((clone) => {
                            this.dom.insertBefore(endNode.parentNode, clone.childNodes, endNode);
                        });
                    }).catch((error) => {
                        postpone(() => {
                            this.$ExceptionStatic.warn('Problem resolving plat-template url: ' +
                                error.response, this.$ExceptionStatic.TEMPLATE);
                        });
                    });
                }

                /**
                 * Binds the template to the proper context and 
                 * resolves the clone to be placed into the DOM.
                 * 
                 * @param control The control whose context will 
                 * be bound to the bindable template.
                 */
                _instantiateTemplate(control: Template) {
                    var bindableTemplates = this.bindableTemplates,
                        id = this._id;

                    bindableTemplates.control = control;
                    return new this.$PromiseStatic<DocumentFragment, Error>((resolve, reject) => {
                        bindableTemplates.bind(id, (clone: DocumentFragment) => {
                            bindableTemplates.control = this;
                            resolve(clone);
                        });
                    });
                }
            }

            /**
             * The available options for plat.ui.controls.Template.
             */
            export interface ITemplateOptions {
                /**
                 * The unique ID used to label a template 
                 * and use it as DOM.
                 */
                id: string;

                /**
                 * An optional URL to specify a template 
                 * instead of using the element's innerHTML.
                 */
                url: string;
            }

            register.control('plat-template', Template);

            export class Ignore extends TemplateControl {
                /**
                 * Removes the innerHTML from the DOM and saves it.
                 */
                setTemplate() {
                    this.innerTemplate = <DocumentFragment>this.dom.appendChildren(this.element.childNodes);
                }

                /**
                 * Places the saved innerHTML back into the DOM.
                 */
                loaded() {
                    this.element.appendChild(this.innerTemplate.cloneNode(true));
                }
            }

            register.control('plat-ignore', Ignore);

            export class ForEach extends TemplateControl {
                /**
                 * The required context is an Array.
                 */
                context: Array<any>;

                /**
                 * The ForEach element will not appear in the DOM.
                 */
                replaceWith: string = null;

                controls: Array<ITemplateControl>;
                private __clearTimeouts: Array<IRemoveListener> = [];
                private __removeListener: IRemoveListener;

                /**
                 * Creates a bindable template with the elementNodes (innerHTML) 
                 * specified for the ForEach.
                 */
                setTemplate() {
                    this.bindableTemplates.add('item', this.elementNodes);
                }

                /**
                 * Re-syncs the ForEach children controls and DOM with the new 
                 * array.
                 * 
                 * @param newValue The new Array
                 * @param oldValue The old Array
                 */
                contextChanged(newValue?: Array<any>, oldValue?: Array<any>) {
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
                }

                /**
                 * Observes the array for changes and adds initial items to the DOM.
                 */
                loaded() {
                    var context = this.context;

                    if (!isArray(context)) {
                        return;
                    }

                    this._addItems(context.length, 0);

                    this._setListener();
                }

                /**
                 * Removes the Array listener
                 */
                dispose() {
                    if (isFunction(this.__removeListener)) {
                        this.__removeListener();
                        this.__removeListener = null;
                    }

                    var clearTimeouts = this.__clearTimeouts;

                    while (clearTimeouts.length > 0) {
                        clearTimeouts.shift()();
                    }
                }
        
                /**
                 * Adds an item to the ForEach's element.
                 */
                _addItem(item: DocumentFragment) {
                    var endNode = this.endNode;
                    endNode.parentNode.insertBefore(item, endNode);
                }

                /**
                 * Removes an item from the ForEach's element.
                 */
                _removeItem() {
                    var controls = this.controls,
                        length = controls.length - 1;

                    TemplateControl.dispose(controls[length]);
                }

                /**
                 * Updates the ForEach's children resource objects when 
                 * the array changes.
                 */
                _updateResources() {
                    var controls = this.controls,
                        length = controls.length;

                    for (var i = 0; i < length; ++i) {
                        controls[i].resources.add(this._getAliases(i));
                    }
                }

                /**
                 * Sets a listener for the changes to the array.
                 */
                _setListener() {
                    this.__removeListener = this.observeArray(this, 'context', this._arrayChanged);
                }

                /**
                 * Receives an event when a method has been called on an array.
                 * 
                 * @param ev The IArrayMethodInfo
                 */
                _arrayChanged(ev: observable.IArrayMethodInfo<any>) {
                    if (isFunction(this['_' + ev.method])) {
                        this._executeEventAsync(ev);
                    }
                }

                /**
                 * Maps an array method to its associated method handler.
                 * 
                 * @param ev The IArrayMethodInfo
                 */
                _executeEventAsync(ev: observable.IArrayMethodInfo<any>) {
                    this.__clearTimeouts.push(postpone(() => {
                        this.__clearTimeouts.shift();
                        this['_' + ev.method](ev);
                    }, null));
                }

                /**
                 * Adds new items to the ForEach's element when items are added to 
                 * the array.
                 * 
                 * @param numberOfItems The number of items to add.
                 * @param index The point in the array to start adding items.
                 */
                _addItems(numberOfItems: number, index: number) {
                    var bindableTemplates = this.bindableTemplates;
            
                    for (var i = 0; i < numberOfItems; ++i, ++index) {
                        bindableTemplates.bind('item', this._addItem, '' + index, this._getAliases(index));
                    }
                }

                /**
                 * Returns a resource alias object for an item in the array. The 
                 * resource object contains index:number, even:boolean, odd:boolean, 
                 * and first:boolean.
                 * 
                 * @param index The index used to create the resource aliases.
                 */
                _getAliases(index: number): IObject<IResource> {
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
                }

                /**
                 * Removes items from the ForEach's element.
                 * 
                 * @param numberOfItems The number of items to remove.
                 */
                _removeItems(numberOfItems: number) {
                    for (var i = 0; i < numberOfItems; ++i) {
                        this._removeItem();
                    }

                    if (this.controls.length > 0) {
                        this._updateResources();
                    }
                }

                /**
                 * Handles items being pushed into the array.
                 * 
                 * @param ev The IArrayMethodInfo
                 */
                _push(ev: observable.IArrayMethodInfo<any>) {
                    this._addItems(ev.arguments.length, ev.oldArray.length);
                }
        
                /**
                 * Handles items being popped off the array.
                 * 
                 * @param ev The IArrayMethodInfo
                 */
                _pop(ev: observable.IArrayMethodInfo<any>) {
                    this._removeItems(1);
                }
        
                /**
                 * Handles items being shifted off the array.
                 * 
                 * @param ev The IArrayMethodInfo
                 */
                _shift(ev: observable.IArrayMethodInfo<any>) {
                    this._removeItems(1);
                }
        
                /**
                 * Handles adding/removing items when an array is spliced.
                 * 
                 * @param ev The IArrayMethodInfo
                 */
                _splice(ev: observable.IArrayMethodInfo<any>) {
                    var oldLength = this.controls.length,
                        newLength = ev.newArray.length;

                    if (newLength > oldLength) {
                        this._addItems(newLength - oldLength, oldLength);
                    } else if (oldLength > newLength) {
                        this._removeItems(oldLength - newLength);
                    }
                }
        
                /**
                 * Handles items being unshifted into the array.
                 * 
                 * @param ev The IArrayMethodInfo
                 */
                _unshift(ev: observable.IArrayMethodInfo<any>) {
                    this._addItems(ev.arguments.length, ev.oldArray.length);
                }
        
                /**
                 * Handles when the array is sorted.
                 * 
                 * @param ev The IArrayMethodInfo
                 */
                _sort(ev: observable.IArrayMethodInfo<any>) {
                }
        
                /**
                 * Handles when the array is reversed.
                 * 
                 * @param ev The IArrayMethodInfo
                 */
                _reverse(ev: observable.IArrayMethodInfo<any>) {
                }
            }

            export interface IForEach {
                /**
                 * Adds an item to the ForEach's element.
                 */
                _addItem(item: DocumentFragment): void;

                /**
                 * Removes an item from the ForEach's element.
                 */
                _removeItem(): void;

                /**
                 * Updates the ForEach's children resource objects when 
                 * the array changes.
                 */
                _updateResources(): void;

                /**
                 * Sets a listener for the changes to the array.
                 */
                _setListener(): void;

                /**
                 * Receives an event when a method has been called on an array.
                 * 
                 * @param ev The IArrayMethodInfo
                 */
                _arrayChanged(ev: observable.IArrayMethodInfo<any>): void;

                /**
                 * Maps an array method to its associated method handler.
                 * 
                 * @param ev The IArrayMethodInfo
                 */
                _executeEventAsync(ev: observable.IArrayMethodInfo<any>): void;

                /**
                 * Adds new items to the ForEach's element when items are added to 
                 * the array.
                 * 
                 * @param numberOfItems The number of items to add.
                 * @param index The point in the array to start adding items.
                 */
                _addItems(numberOfItems: number, index: number): void;

                /**
                 * Returns a resource alias object for an item in the array. The 
                 * resource object contains index:number, even:boolean, odd:boolean, 
                 * and first:boolean.
                 * 
                 * @param index The index used to create the resource aliases.
                 */
                _getAliases(index: number): IObject<IResource>;

                /**
                 * Removes items from the ForEach's element.
                 * 
                 * @param numberOfItems The number of items to remove.
                 */
                _removeItems(numberOfItems: number): void;

                /**
                 * Handles items being pushed into the array.
                 * 
                 * @param ev The IArrayMethodInfo
                 */
                _push(ev: observable.IArrayMethodInfo<any>): void;
        
                /**
                 * Handles items being popped off the array.
                 * 
                 * @param ev The IArrayMethodInfo
                 */
                _pop(ev: observable.IArrayMethodInfo<any>): void;
        
                /**
                 * Handles items being shifted off the array.
                 * 
                 * @param ev The IArrayMethodInfo
                 */
                _shift(ev: observable.IArrayMethodInfo<any>): void;
        
                /**
                 * Handles adding/removing items when an array is spliced.
                 * 
                 * @param ev The IArrayMethodInfo
                 */
                _splice(ev: observable.IArrayMethodInfo<any>): void;
        
                /**
                 * Handles items being unshifted into the array.
                 * 
                 * @param ev The IArrayMethodInfo
                 */
                _unshift(ev: observable.IArrayMethodInfo<any>): void;
        
                /**
                 * Handles when the array is sorted.
                 * 
                 * @param ev The IArrayMethodInfo
                 */
                _sort(ev: observable.IArrayMethodInfo<any>): void;
        
                /**
                 * Handles when the array is reversed.
                 * 
                 * @param ev The IArrayMethodInfo
                 */
                _reverse(ev: observable.IArrayMethodInfo<any>): void;
            }

            register.control('plat-foreach', ForEach);

            export class Html extends TemplateControl {
                /**
                 * Loads the new HTML String.
                 */
                contextChanged() {
                    this.loaded();
                }

                /**
                 * Loads the context as the innerHTML of the element.
                 */
                loaded() {
                    var context = this.context;

                    if (!isString(context) || context.trim() === '') {
                        return;
                    }
                    this.dom.setInnerHtml(this.element, context);
                }
            }

            register.control('plat-html', Html);

            export class Select extends TemplateControl {
                /**
                 * Replaces the <plat-select> node with 
                 * a <select> node.
                 */
                replaceWith: string = 'select';

                /**
                 * Specifies the context as an Array.
                 */
                context: Array<any>;

                /**
                 * An object that keeps track of unique 
                 * optgroups.
                 */
                groups: IObject<HTMLElement> = {};

                /**
                 * The evaluated plat-options object.
                 */
                options: observable.IObservableProperty<ISelectOptions>;
                $PromiseStatic: async.IPromiseStatic = acquire('$PromiseStatic');
                $Exception: IExceptionStatic = acquire('$ExceptionStatic');
                private __removeListener: IRemoveListener;
                private __isGrouped: boolean = false;
                private __group: string;
                private __defaultOption: HTMLOptionElement;
                /**
                 * Creates the bindable option template and grouping 
                 * template if necessary.
                 */
                setTemplate() {
                    var element = this.element,
                        firstElementChild = element.firstElementChild,
                        $document: Document = acquire('$document');

                    if (!isNull(firstElementChild) && firstElementChild.nodeName.toLowerCase() === 'option') {
                        this.__defaultOption = <HTMLOptionElement>firstElementChild.cloneNode(true);
                    }

                    var platOptions = this.options.value,
                        option = $document.createElement('option');

                    if (this.__isGrouped = !isNull(platOptions.group)) {
                        var group = this.__group = platOptions.group,
                            optionGroup = $document.createElement('optgroup');

                        optionGroup.label = '{{' + group + '}}';

                        this.bindableTemplates.add('group', optionGroup);
                    }

                    option.value = '{{' + platOptions.value + '}}';
                    option.textContent = '{{' + platOptions.textContent + '}}';

                    this.bindableTemplates.add('option', option);
                }

                /**
                 * Re-observes the new array context and modifies 
                 * the options accordingly.
                 * 
                 * @param newValue The new array context.
                 * @param oldValue The old array context.
                 */
                contextChanged(newValue?: Array<any>, oldValue?: Array<any>) {
                    var newLength = isNull(newValue) ? 0 : newValue.length,
                        oldLength = isNull(oldValue) ? 0 : oldValue.length;

                    if (isNull(this.__removeListener)) {
                        this.__removeListener = this.observeArray(this, 'context',
                        function watchArray(ev?: observable.IArrayMethodInfo<any>) {
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
                }

                /**
                 * Observes the new array context and adds 
                 * the options accordingly.
                 */
                loaded() {
                    var context = this.context;

                    if (isNull(context)) {
                        return;
                    }

                    this._addItems(context.length, 0);

                    this.__removeListener = this.observeArray(this, 'context', function watchArray(ev?: observable.IArrayMethodInfo<any>) {
                        if (isFunction(this['_' + ev.method])) {
                            this['_' + ev.method](ev);
                        }
                    });
                }

                /**
                 * Stops observing the array context.
                 */
                dispose() {
                    if (isFunction(this.__removeListener)) {
                        this.__removeListener();
                        this.__removeListener = null;
                    }
                }

                /**
                 * Adds the options to the select element.
                 * 
                 * @param numberOfItems The number of items 
                 * to add.
                 * @param length The current index of the next 
                 * set of items to add.
                 */
                _addItems(numberOfItems: number, length: number) {
                    var index = length,
                        item;

                    for (var i = 0; i < numberOfItems; ++i, ++index) {
                        item = this.context[index];

                        this.bindableTemplates.bind('option', this._insertOptions.bind(this, index, item), '' + index);
                    }
                }

                /**
                 * The callback used to add an option after 
                 * its template has been bound.
                 * 
                 * @param index The current index of the item being added.
                 * @param item The item being added.
                 * @param optionClone The bound DocumentFragment to be 
                 * inserted into the DOM.
                 */
                _insertOptions(index: number, item: any, optionClone: DocumentFragment) {
                    var element = this.element;

                    if (this.__isGrouped) {
                        var groups = this.groups,
                            newGroup = item[this.__group],
                            optgroup: any = groups[newGroup];

                        if (isNull(optgroup)) {
                            optgroup = groups[newGroup] = <any>new this.$PromiseStatic<HTMLElement, Error>((resolve) => {
                                this.bindableTemplates.bind('group', (groupClone: DocumentFragment) => {
                                    optgroup = groups[newGroup] = <HTMLElement>groupClone.childNodes[1];

                                    optgroup.appendChild(optionClone);
                                    element.appendChild(groupClone);
                                    resolve(optgroup);
                                }, '' + index);
                            }).catch((error) => {
                                postpone(() => {
                                    this.$Exception.warn(error.message);
                                });
                            });
                            return;
                        } else if (isFunction(optgroup.then)) {
                            optgroup.then((group: HTMLElement) => {
                                group.appendChild(optionClone);
                                return group;
                            });
                            return;
                        }

                        optgroup.appendChild(optionClone);
                        return;
                    }

                    element.appendChild(optionClone);
                }

                /**
                 * Removes an item from the DOM.
                 * 
                 * @param parent The element whose child 
                 * will be removed.
                 */
                _removeItem(parent: HTMLElement) {
                    parent.removeChild(parent.lastElementChild);
                }

                /**
                 * Removes a specified number of elements.
                 * 
                 * @param numberOfItems The number of items 
                 * to remove.
                 */
                _removeItems(numberOfItems: number) {
                    var element = this.element,
                        removeItem = this._removeItem;
                    while (numberOfItems-- > 0) {
                        removeItem(element);
                    }
                }

                /**
                 * The function called when an item has been removed 
                 * from the array context.
                 * 
                 * @param ev The array mutation object
                 */
                _itemRemoved(ev: observable.IArrayMethodInfo<any>) {
                    if (ev.oldArray.length === 0) {
                        return;
                    }

                    if (this.__isGrouped) {
                        var removed = ev.returnValue,
                            group = removed[this.__group],
                            optgroup = this.groups[group];

                        this._removeItem(optgroup);

                        return;
                    }

                    this._removeItems(1);
                }

                /**
                 * Resets the select element by removing all its 
                 * items and adding them back.
                 */
                _resetSelect() {
                    var itemLength = this.context.length,
                        nodeLength = this.element.childNodes.length;

                    this._removeItems(nodeLength);
                    this.groups = {};
                    if (!isNull(this.__defaultOption)) {
                        this.element.appendChild(this.__defaultOption);
                    }

                    this._addItems(itemLength, 0);
                }

                /**
                 * The function called when an element is pushed to 
                 * the array context.
                 * 
                 * @param ev The array mutation object
                 */
                _push(ev: observable.IArrayMethodInfo<any>) {
                    this._addItems(ev.arguments.length, ev.oldArray.length);
                }

                /**
                 * The function called when an item is popped 
                 * from the array context.
                 * 
                 * @param ev The array mutation object
                 */
                _pop(ev: observable.IArrayMethodInfo<any>) {
                    this._itemRemoved(ev);
                }

                /**
                 * The function called when an item is shifted 
                 * from the array context.
                 * 
                 * @param ev The array mutation object
                 */
                _shift(ev: observable.IArrayMethodInfo<any>) {
                    if (this.__isGrouped) {
                        this._resetSelect();
                        return;
                    }

                    this._itemRemoved(ev);
                }

                /**
                 * The function called when items are spliced 
                 * from the array context.
                 * 
                 * @param ev The array mutation object
                 */
                _splice(ev: observable.IArrayMethodInfo<any>) {
                    if (this.__isGrouped) {
                        this._resetSelect();
                        return;
                    }

                    var oldLength = ev.oldArray.length,
                        newLength = ev.newArray.length;

                    if (newLength > oldLength) {
                        this._addItems(newLength - oldLength, oldLength);
                    } else if (oldLength > newLength) {
                        this._removeItems(oldLength - newLength);
                    }
                }

                /**
                 * The function called when an item is unshifted 
                 * onto the array context.
                 * 
                 * @param ev The array mutation object
                 */
                _unshift(ev: observable.IArrayMethodInfo<any>) {
                    if (this.__isGrouped) {
                        this._resetSelect();
                        return;
                    }

                    this._addItems(ev.arguments.length, ev.oldArray.length);
                }

                /**
                 * The function called when the array context 
                 * is sorted.
                 * 
                 * @param ev The array mutation object
                 */
                _sort(ev: observable.IArrayMethodInfo<any>) {
                    if (this.__isGrouped) {
                        this._resetSelect();
                    }
                }

                /**
                 * The function called when the array context 
                 * is reversed.
                 * 
                 * @param ev The array mutation object
                 */
                _reverse(ev: observable.IArrayMethodInfo<any>) {
                    if (this.__isGrouped) {
                        this._resetSelect();
                    }
                }
            }

            /**
             * The available options for plat.ui.controls.Select.
             */
            export interface ISelectOptions {
                /**
                 * The property in your context array 
                 * of objects to use to group the objects 
                 * into optgroups.
                 */
                group: string;

                /**
                 * The property in your context array of 
                 * objects with which to use to bind to the 
                 * option's value.
                 */
                value: string;

                /**
                 * The property in your context array of 
                 * objects with which to use to bind to the 
                 * option's textContent.
                 */
                textContent: string;
            }

            register.control('plat-select', Select);

            export class If extends TemplateControl implements IIf {
                /**
                 * Removes the <plat-if> node from the DOM
                 */
                replaceWith: string = null;

                /**
                 * The evaluated plat-options object.
                 */
                options: observable.IObservableProperty<IIfOptions>;
                $ExceptionStatic: IExceptionStatic = acquire('$ExceptionStatic');
                private __removeListener: IRemoveListener;
                private __condition: boolean;
                /**
                 * Creates a bindable template with its element nodes.
                 */
                setTemplate() {
                    this.bindableTemplates.add('item', this.elementNodes);
                }

                /**
                 * Checks the options and initializes the 
                 * evaluation.
                 */
                contextChanged() {
                    var options = this.options.value;

                    if (isEmpty(options)) {
                        return;
                    }

                    this.setter(options);
                }

                /**
                 * Sets the visibility to true if no options are 
                 * defined, kicks off the evaluation, and observes 
                 * the options for changes.
                 */
                loaded() {
                    if (isNull(this.options)) {
                        this.$ExceptionStatic.warn('No condition specified in plat-options for plat-if.');
                        this.options = {
                            value: {
                                condition: true
                            },
                            observe: <any>noop
                        };
                    }
                    this.contextChanged();
                    this.__removeListener = this.options.observe(this.setter);
                }

                /**
                 * Stops listening to the options for changes.
                 */
                dispose() {
                    if (isFunction(this.__removeListener)) {
                        this.__removeListener();
                        this.__removeListener = null;
                    }
                }

                /**
                 * Checks the condition and decides 
                 * whether or not to add or remove 
                 * the node from the DOM.
                 */
                setter(options: IIfOptions) {
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
                }

                /**
                 * The callback used to add the fragment to the DOM 
                 * after the bindableTemplate has been created.
                 * 
                 * @param item The DocumentFragment consisting of 
                 * the inner template of the node.
                 */
                _addItem(item: DocumentFragment) {
                    var endNode = this.endNode;
                    endNode.parentNode.insertBefore(item, endNode);
                }

                /**
                 * Removes the node from the DOM.
                 */
                _removeItem() {
                    postpone(function () {
                        Control.dispose(this.controls[0]);
                    }, null, this);
                }
            }

            export interface IIf {
                /**
                 * Checks the condition and decides 
                 * whether or not to add or remove 
                 * the node from the DOM.
                 */
                setter(options: IIfOptions): void;
            }

            /**
             * The available options for plat.ui.controls.If.
             */
            export interface IIfOptions {
                /**
                 * A boolean expression to bind to 
                 * the element's visibility.
                 */
                condition: boolean;
            }

            register.control('plat-if', If);

            class Anchor extends TemplateControl {
                element: HTMLAnchorElement;
                $browserConfig: web.IBrowserConfig = acquire('$browser.config');
                $browser: web.IBrowser = acquire('$browser');
                initialize() {
                    var config = this.$browserConfig;

                    if (config.routingType !== config.routeType.HASH) {
                        return;
                    }

                    var prefix = config.hashPrefix || '',
                        element = this.element,
                        href = element.href,
                        regex = new RegExp('#' + prefix),
                        path = element.pathname;

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
                }
            }

            register.control('a', Anchor);
        }
    }
    export module processing {
        /**
         * Responsible for iterating through DOM and collecting controls.
         */
        export class Compiler implements ICompiler {
            $ElementManagerStatic: IElementManagerStatic = acquire('$ElementManagerStatic');
            $TextManageStatic: ITextManagerStatic = acquire('$TextManageStatic');
            $commentManagerFactory: ICommentManagerFactory = acquire('$commentManagerFactory');
            $ManagerCacheStatic: storage.ICache<INodeManager> = acquire('$ManagerCacheStatic');
            /**
             * Goes through the childNodes of the given Node, finding elements that contain controls as well as
             * text that contains markup.
             * 
             * @param node The node whose childNodes are going to be compiled.
             * @param control The parent control for the given Node. The parent must implement ui.ITemplateControl
             * since only controls that implement ui.ITemplateControl can contain templates.
             */
            compile(node: Node, control?: ui.ITemplateControl);
            /**
             * Goes through the Node array, finding elements that contain controls as well as
             * text that contains markup.
             * 
             * @param nodes The Node array to be compiled.
             * @param control The parent control for the given Node array. The parent must implement ui.ITemplateControl
             * since only controls that implement ui.ITemplateControl are responsible for creating DOM.
             */
            compile(nodes: Array<Node>, control?: ui.ITemplateControl);
            /**
             * Goes through the NodeList, finding elements that contain controls as well as
             * text that contains markup.
             * 
             * @param nodes The NodeList to be compiled. 
             * @param control The parent control for the given NodeList. The parent must implement ui.ITemplateControl
             * since only controls that implement ui.ITemplateControl are responsible for creating DOM.
             */
            compile(nodes: NodeList, control?: ui.ITemplateControl);
            compile(node: any, control?: ui.ITemplateControl) {
                var childNodes = node.childNodes,
                    length,
                    newLength,
                    childNode,
                    hasControl = !isNull(control),
                    manager = <IElementManager>(hasControl ? this.$ManagerCacheStatic.read(control.uid) : null),
                    create = this.$ElementManagerStatic.create;

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
            }

            _compileNodes(nodes: Array<Node>, manager: IElementManager) {
                var length = nodes.length,
                    node: Node,
                    newManager: IElementManager,
                    newLength,
                    create = this.$ElementManagerStatic.create,
                    commentCreate = this.$commentManagerFactory.create,
                    textCreate = this.$TextManageStatic.create;

                for (var i = 0; i < length; ++i) {
                    node = nodes[i];
                    switch (node.nodeType) {
                        case Node.ELEMENT_NODE:
                            newManager = create(<HTMLElement>node, manager);
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
            }
        }

        /**
         * Describes an object that iterates through DOM and collects controls.
         */
        export interface ICompiler {
            /**
             * Goes through the childNodes of the given Node, finding elements that contain controls as well as
             * text that contains markup.
             * 
             * @param node The node whose childNodes are going to be compiled.
             * @param control The parent control for the given Node. The parent must implement ui.ITemplateControl
             * since only controls that implement ui.ITemplateControl can contain templates.
             */
            compile(node: Node, control?: ui.ITemplateControl);
            /**
             * Goes through the Node array, finding elements that contain controls as well as
             * text that contains markup.
             * 
             * @param nodes The Node array to be compiled.
             * @param control The parent control for the given Node array. The parent must implement ui.ITemplateControl
             * since only controls that implement ui.ITemplateControl are responsible for creating DOM.
             */
            compile(nodes: Array<Node>, control?: ui.ITemplateControl);
            /**
             * Goes through the NodeList, finding elements that contain controls as well as
             * text that contains markup.
             * 
             * @param nodes The NodeList to be compiled. 
             * @param control The parent control for the given NodeList. The parent must implement ui.ITemplateControl
             * since only controls that implement ui.ITemplateControl are responsible for creating DOM.
             */
            compile(nodes: NodeList, control?: ui.ITemplateControl): void;
        }

        register.injectable('$compiler', Compiler);

        /**
         * A NodeManager is responsible for data binding a data context to a Node.
         */
        export class NodeManager implements INodeManager {
            static $regex: expressions.IRegex;
            static $ContextManagerStatic: observable.IContextManagerStatic;
            static $parser: expressions.IParser;
            static $ExceptionStatic: IExceptionStatic;
            static $TemplateControlStatic: ui.ITemplateControlStatic;
            /**
             * The start markup notation.
             */
            static startSymbol: string = '{{';

            /**
             * The end markup notation.
             */
            static endSymbol: string = '}}';

            /**
             * Given an IParsedExpression array, creates an array of unique identifers
             * to use with binding. This allows us to avoid creating multiple listeners
             * for the identifier and node.
             * 
             * @static
             * @param expressions An IParsedExpression array to search for identifiers.
             * @return {Array<string>} An array of identifiers.
             */
            static findUniqueIdentifiers(expressions: Array<expressions.IParsedExpression>) {
                var length = expressions.length,
                    uniqueIdentifierObject = {},
                    uniqueIdentifiers = [],
                    identifiers,
                    identifier,
                    j, jLength;

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
            }

            /**
             * Determines if a string has the markup notation.
             * 
             * @param text The text string in which to search for markup.
             * @return {Boolean} Indicates whether or not there is markup.
             */
            static hasMarkup(text: string) {
                return NodeManager.$regex.markupRegex.test(text);
            }

            /**
             * Given a string, finds markup in the string and creates an IParsedExpression array.
             * 
             * @static
             * @param text The text string to parse.
             * @return {Array<IParsedExpression>}
             */
            static findMarkup(text: string) {
                var start,
                    end,
                    regex = NodeManager.$regex,
                    newLineRegex = regex.newLineRegex,
                    text = text.replace(newLineRegex, ''),
                    parsedExpressions: Array<expressions.IParsedExpression> = [],
                    startSymbol = NodeManager.startSymbol,
                    endSymbol = NodeManager.endSymbol,
                    wrapExpression = NodeManager._wrapExpression,
                    substring,
                    expression: expressions.IParsedExpression,
                    parser = NodeManager.$parser;

                while ((start = text.indexOf(startSymbol)) !== -1 && (end = text.indexOf(endSymbol)) !== -1) {
                    if (start !== 0) {
                        parsedExpressions.push(wrapExpression(text.substring(0, start)));
                    }

                    // incremement with while loop instead of just += 2 for nested object literal case.
                    while (text[++end] === '}') { }

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
            }

            /**
             * Takes in data context and an IParsedExpression array and outputs a string of the evaluated
             * expressions.
             * 
             * @static
             * @param expressions The IParsedExpression array to evaluate.
             * @param control The IControl used to parse the expressions.
             * @return {string} The evaluated expressions.
             */
            static build(expressions: Array<expressions.IParsedExpression>, control?: ui.ITemplateControl) {
                var text = '',
                    length = expressions.length,
                    resources = {},
                    expression: expressions.IParsedExpression,
                    value,
                    evaluateExpression = NodeManager.$TemplateControlStatic.evaluateExpression;

                for (var i = 0; i < length; ++i) {
                    expression = expressions[i];

                    value = evaluateExpression(expression, control, resources);

                    if (isObject(value)) {
                        try {
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
            }

            /**
             * Registers a listener to be notified of a change in any associated identifier.
             * 
             * @static
             * @param identifiers An Array of identifiers to observe.
             * @param control The control associated to the identifiers.
             * @param listener The listener to call when any identifier property changes.
             */
            static observeIdentifiers(identifiers: Array<string>, control: ui.ITemplateControl,
                listener: (...args: Array<any>) => void) {
                var length = identifiers.length,
                    ContextManager = NodeManager.$ContextManagerStatic,
                    contextManager = ContextManager.getManager(Control.getRootControl(control)),
                    absoluteContextPath = control.absoluteContextPath,
                    context = control.context,
                    observableCallback = {
                        listener: listener,
                        uid: control.uid
                    },
                    resources = {},
                    resourceObj,
                    manager: observable.IContextManager,
                    split,
                    alias: string,
                    absoluteIdentifier,
                    identifier: string;

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
            }

            static _wrapExpression(text: string): expressions.IParsedExpression {
                return {
                    evaluate: function unboundText() {
                        return text;
                    },
                    identifiers: [],
                    aliases: [],
                    expression: text
                };
            }

            /**
             * Specifies the type of NodeManager.
             */
            type: string;

            /**
             * Lets us know when an ElementManager is a cloned manager, or the compiled 
             * manager from BindableTemplates. We do not want to bindAndLoad compiled 
             * managers that are clones.
             */
            isClone: boolean = false;

            nodeMap: INodeMap;
            parent: IElementManager;

            /**
             * @param nodeMap The INodeMap associated with this TextManager. We have to use an 
             * INodeMap instead of an INode so we can treat all INodeManagers the same.
             * @param parent The parent ui.ITemplateControl for a TextManager.
             */
            initialize(nodeMap: INodeMap, parent: IElementManager) {
                this.nodeMap = nodeMap;
                this.parent = parent;

                if (!isNull(parent)) {
                    this.isClone = parent.isClone;
                    parent.children.push(this);
                }
            }

            /**
             * Retrieves the parent control for this NodeManager.
             */
            getParentControl() {
                var parent = this.parent,
                    control: ui.ITemplateControl;

                while (isNull(control)) {
                    if (isNull(parent)) {
                        break;
                    }

                    control = parent.getUiControl();
                    parent = parent.parent;
                }

                return control;
            }

            /**
             * Clones this NodeManager with the new node.
             * 
             * @param newNode The node used to clone this NodeManager.
             * @param parentManager The parent NodeManager for the clone.
             */
            clone(newNode: Node, parentManager: IElementManager) { return 1; }

            /**
             * The function used for data-binding a data context to the DOM.
             * 
             * @param parent The parent ui.ITemplateControl to use for context inheritance.
             * @param nodeMap The INodeMap to use in order to data-bind the data context.
             * @param controlsToLoad An optional array to populate with controls that need to be loaded.
             */
            bind() { }
        }

        export function NodeManagerStatic(
        $regex,
        $ContextManagerStatic,
        $parser,
        $ExceptionStatic,
        $TemplateControlStatic) {
            NodeManager.$regex = $regex;
            NodeManager.$ContextManagerStatic = $ContextManagerStatic;
            NodeManager.$parser = $parser;
            NodeManager.$ExceptionStatic = $ExceptionStatic;
            NodeManager.$TemplateControlStatic = $TemplateControlStatic;
            return NodeManager;
        }

        register.injectable('$NodeManagerStatic', NodeManagerStatic, [
            '$regex',
            '$ContextManagerStatic',
            '$parser',
            '$ExceptionStatic',
            '$TemplateControlStatic'
        ], register.injectableType.STATIC);

        /**
         * Describes an object that takes a Node and provides a way to data-bind to that node.
         */
        export interface INodeManager {
            /**
             * The type of INodeManager
             */
            type: string;

            /**
             * The INodeMap for this INodeManager. Contains the compiled Node.
             */
            nodeMap?: INodeMap;

            /**
             * The parent control for this INodeManager.
             */
            parent?: IElementManager;

            /**
             * Retrieves the parent control for this NodeManager.
             */
            getParentControl? (): ui.ITemplateControl;

            /**
             * Clones this NodeManager with the new node.
             * 
             * @param newNode The node used to clone this NodeManager.
             * @param parentManager The parent NodeManager for the clone.
             */
            clone? (newNode: Node, parentManager: IElementManager): number;

            /**
             * @param nodeMap The INodeMap associated with this TextManager. We have to use an 
             * INodeMap instead of an INode so we can treat all INodeManagers the same.
             * @param parent The parent ui.ITemplateControl for a TextManager.
             */
            initialize?(nodeMap: INodeMap, parent: IElementManager): void;

            /**
             * The function used for data-binding a data context to the DOM.
             * 
             * @param parent The parent ui.ITemplateControl to use for context inheritance.
             * @param nodeMap The INodeMap to use in order to data-bind the data context.
             * @param controlsToLoad An optional array to populate with controls that need to be loaded.
             */
            bind(): void;
        }

        /**
         * Describes a compiled Node.
         */
        export interface INode {
            /**
             * The control associated with the Node, if one exists.
             */
            control?: IControl;

            /**
             * The Node that is compiled.
             */
            node?: Node;

            /**
             * The name of the Node.
             */
            nodeName?: string;

            /**
             * Any IParsedExpressions contained in the Node.
             */
            expressions?: Array<expressions.IParsedExpression>;

            /**
             * Unique identifiers contained in the Node.
             */
            identifiers?: Array<string>;

            /**
             * The injector for a control associated with the Node, if one exists.
             */
            injector?: dependency.IInjector<IControl>;
        }

        /**
         * Defines the interface for a compiled HTMLElement
         */
        export interface IUiControlNode extends INode {
            /**
             * The control associated with the HTMLElement, if one exists.
             */
            control: ui.ITemplateControl;

            /**
             * The resources element defined as the control element's first
             * element child.
             */
            resourceElement?: HTMLElement;
        }

        /**
         * Describes a compiled HTMLElement tree.
         */
        export interface INodeMap {
            /**
             * The HTMLElement that is compiled.
             */
            element?: HTMLElement;

            /**
             * The compiled attribute Nodes for the HTMLElement
             */
            nodes: Array<INode>;

            /**
             * An object of key/value attribute pairs.
             */
            attributes?: IObject<string>;

            /**
             * The plat-context path for the next UIControl, if specified.
             */
            childContext?: string;

            /**
             * Indicates whether or not a IControl was found on the HTMLElement.
             */
            hasControl?: boolean;

            /**
             * The INode for the UIControl, if one was found for the HTMLElement.
             */
            uiControlNode?: IUiControlNode;
        }

        export interface INodeManagerStatic {
            /**
             * The start markup notation.
             */
            startSymbol: string;

            /**
             * The end markup notation.
             */
            endSymbol: string;

            /**
             * The regular expression for finding markup in a string.
             */
            markupRegex: RegExp;

            /**
             * Given an IParsedExpression array, creates an array of unique identifers
             * to use with binding. This allows us to avoid creating multiple listeners
             * for the identifier and node.
             *
             * @static
             * @param expressions An IParsedExpression array to search for identifiers.
             * @return {Array<string>} An array of identifiers.
             */
            findUniqueIdentifiers(expressions: Array<expressions.IParsedExpression>): Array<string>;

            /**
             * Determines if a string has the markup notation.
             *
             * @param text The text string in which to search for markup.
             * @return {Boolean} Indicates whether or not there is markup.
             */
            hasMarkup(text: string): boolean;

            /**
             * Given a string, finds markup in the string and creates an IParsedExpression array.
             *
             * @static
             * @param text The text string to parse.
             * @return {Array<IParsedExpression>}
             */
            findMarkup(text: string): Array<expressions.IParsedExpression>;

            /**
             * Takes in data context and an IParsedExpression array and outputs a string of the evaluated
             * expressions.
             *
             * @static
             * @param expressions The IParsedExpression array to evaluate.
             * @param control The IControl used to parse the expressions.
             * @return {string} The evaluated expressions.
             */
            build(expressions: Array<expressions.IParsedExpression>, control?: ui.ITemplateControl): string;

            /**
             * Registers a listener to be notified of a change in any associated identifier.
             *
             * @static
             * @param identifiers An Array of identifiers to observe.
             * @param control The control associated to the identifiers.
             * @param listener The listener to call when any identifier property changes.
             */
            observeIdentifiers(identifiers: Array<string>,
                control: ui.ITemplateControl, listener: (...args: Array<any>) => void): void;

            /**
             * @param nodeMap The INodeMap associated with this TextManager. We have to use an 
             * INodeMap instead of an INode so we can treat all INodeManagers the same.
             * @param parent The parent ui.ITemplateControl for a TextManager.
             */
            new (nodeMap: INodeMap, parent: IElementManager);
        }

        /**
         * A class used to manage element nodes. Provides a way for compiling and binding the 
         * element/template. Also provides methods for cloning an ElementManager.
         */
        export class ElementManager extends NodeManager implements IElementManager {
            static $dom: ui.IDom;
            static $document: Document;
            static $ManagerCacheStatic: storage.ICache<IElementManager>;
            static $ResourcesStatic: ui.IResourcesStatic;
            static $BindableTemplatesStatic: ui.IBindableTemplatesStatic;
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
            static create(element: HTMLElement, parent?: IElementManager) {
                var name = element.nodeName.toLowerCase(),
                    injector = controlInjectors[name] || viewControlInjectors[name],
                    hasUiControl = false,
                    uiControlNode: IUiControlNode,
                    dom = ElementManager.$dom,
                    $document = ElementManager.$document;

                if (!isNull(injector)) {
                    var uiControl = <ui.ITemplateControl>injector.inject(),
                        resourceElement = <HTMLElement>element.firstElementChild;

                    if (!isNull(resourceElement) && resourceElement.nodeName.toLowerCase() === 'plat-resources') {
                        resourceElement = <HTMLElement>element.removeChild(resourceElement);
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
                            element = dom.replaceWith(element, <HTMLElement>replacement.cloneNode(true));
                        }
                    }
                }

                var attributes = element.attributes,
                    elementMap = ElementManager._collectAttributes(attributes);

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
            }

            /**
             * Clones an ElementManager with a new element.
             * 
             * @param sourceManager The original IElementManager.
             * @param parent The parent IElementManager for the new clone.
             * @param element The new element to associate with the clone.
             * @param newControl An optional control to associate with the clone.
             * @return {ElemenetManager} The cloned ElementManager.
             */
            static clone(sourceManager: IElementManager, parent: IElementManager,
                element: HTMLElement, newControl?: ui.ITemplateControl, nodeMap?: INodeMap) {

                if (isNull(nodeMap)) {
                    nodeMap = ElementManager._cloneNodeMap(sourceManager.nodeMap, element, parent.getUiControl() ||
                        parent.getParentControl(), newControl);
                }

                var manager = new ElementManager(),
                    cache = ElementManager.$ManagerCacheStatic;

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
            }

            /**
             * Clones a UI Control with a new nodeMap.
             * 
             * @param sourceMap The source INodeMap used to clone the UI Control
             * @param parent The parent control of the clone.
             * @return {ui.ITemplateControl} The cloned UI control.
             */
            static cloneUiControl(sourceMap: INodeMap, parent: ui.ITemplateControl) {
                var uiControlNode = sourceMap.uiControlNode;

                if (isNull(uiControlNode)) {
                    return;
                }

                var uiControl = uiControlNode.control,
                    newUiControl = <ui.ITemplateControl>uiControlNode.injector.inject(),
                    Resources = ElementManager.$ResourcesStatic,
                    BindableTemplates = ElementManager.$BindableTemplatesStatic,
                    resources = ElementManager.$ResourcesStatic.getInstance(),
                    attributes: ui.IAttributes = acquire('$attributes');

                newUiControl.parent = parent;
                parent.controls.push(newUiControl);
                newUiControl.controls = [];

                attributes.initialize(newUiControl, sourceMap.attributes);
                newUiControl.attributes = attributes;

                resources.initialize(newUiControl, uiControl.resources);
                newUiControl.resources = resources;

                Resources.addControlResources(newUiControl);

                if (!isNull(uiControl.innerTemplate)) {
                    newUiControl.innerTemplate = <DocumentFragment>uiControl.innerTemplate.cloneNode(true);
                }

                newUiControl.type = uiControl.type;
                newUiControl.bindableTemplates = BindableTemplates.create(newUiControl, uiControl.bindableTemplates);
                newUiControl.replaceWith = uiControl.replaceWith;

                return newUiControl;
            }

            /**
             * Creates new nodes for an INodeMap corresponding to the element associated with the nodeMap or 
             * the passed-in element.
             * 
             * @param nodeMap The nodeMap to populate with attribute nodes.
             * @param parent The parent control for the new attribute controls.
             * @param newElement An optional element to use for attributes (used in cloning).
             * @return {Array<INode>} The new nodes.
             */
            static createAttributeControls(nodeMap: INodeMap, parent: ui.ITemplateControl,
                templateControl?: ui.ITemplateControl, newElement?: HTMLElement, isClone?: boolean) {
                var nodes = nodeMap.nodes,
                    length = nodes.length,
                    element = isClone ? newElement : nodeMap.element;

                if (!isNull(element) && element.nodeType === Node.DOCUMENT_FRAGMENT_NODE) {
                    return isClone ? ElementManager._copyAttributeNodes(nodes) : [];
                }

                var attributes = !isNull(element) ? element.attributes : null,
                    attrs = nodeMap.attributes,
                    newAttributes: ui.IAttributes,
                    node: INode,
                    injector: dependency.IInjector<IControl>,
                    control: controls.IAttributeControl,
                    newNodes: Array<INode> = [],
                    nodeName: string,
                    i;

                for (i = 0; i < length; ++i) {
                    node = nodes[i];
                    injector = node.injector;
                    control = null;

                    if (!isNull(injector)) {
                        control = <controls.IAttributeControl>injector.inject();
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
                        var aControl = <controls.IAttributeControl>a.control,
                            bControl = <controls.IAttributeControl>b.control;

                        if (isNull(aControl)) {
                            return 1;
                        } else if (isNull(bControl)) {
                            return -1;
                        }

                        var aPriority = isNumber(aControl.priority) ? aControl.priority : 0,
                            bPriority = isNumber(bControl.priority) ? bControl.priority : 0;

                        return bPriority - aPriority;
                    });

                    for (i = 0; i < length; ++i) {
                        node = nodes[i];
                        control = <controls.IAttributeControl>node.control;

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
            }

            /**
             * Returns an instance of an IElementManager
             */
            static getInstance() {
                return new ElementManager();
            }

            /**
             * Iterates over the attributes NamedNodeMap, creating an INodeMap. The INodeMap 
             * will contain injectors for all the IControls as well as parsed expressions
             * and identifiers found for each Attribute (useful for data binding).
             * 
             * @static
             * @param attributes A NamedNodeMap to compile into an INodeMap
             * @return {INodeMap} The compiled NamedNodeMap
             */
            static _collectAttributes(attributes: NamedNodeMap): INodeMap {
                var nodes: Array<INode> = [],
                    attribute: Attr,
                    name,
                    value,
                    childContext: expressions.IParsedExpression,
                    childIdentifier: string,
                    hasMarkup,
                    hasMarkupFn = NodeManager.hasMarkup,
                    findMarkup = NodeManager.findMarkup,
                    findUniqueIdentifiers = NodeManager.findUniqueIdentifiers,
                    parser = NodeManager.$parser,
                    build = NodeManager.build,
                    expressions,
                    hasControl = false,
                    injector,
                    length = attributes.length,
                    controlAttributes: IObject<string> = {},
                    uniqueIdentifiers;

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
                            var Exception: IExceptionStatic = acquire('$ExceptionStatic');
                            Exception.warn('Incorrect plat-context: ' +
                                value + ', must contain a single identifier.', Exception.COMPILE);
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
            }

            static _copyAttributeNodes(nodes: Array<INode>) {
                var newNodes: Array<INode> = [],
                    length = nodes.length,
                    node: INode;

                for (var i = 0; i < length; ++i) {
                    node = nodes[i];
                    newNodes.push({
                        identifiers: node.identifiers,
                        expressions: node.expressions,
                        nodeName: node.nodeName
                    });
                }

                return newNodes;
            }

            /**
             * Clones an INode with a new node.
             * 
             * @param sourceNode The original INode.
             * @param node The new node used for cloning.
             * @param newControl An optional new control to associate with the cloned node.
             * @return {INode} The clones INode.
             */
            static _cloneNode(sourceNode: INode, node: Node, newControl?: ui.ITemplateControl): INode {
                return {
                    control: newControl,
                    injector: sourceNode.injector,
                    identifiers: sourceNode.identifiers,
                    expressions: sourceNode.expressions,
                    node: node,
                    nodeName: sourceNode.nodeName
                };
            }

            /**
             * Clones an INodeMap with a new element.
             * 
             * @param sourceMap The original INodeMap.
             * @param element The new HTMLElement used for cloning.
             * @param newControl An optional new control to associate with the element.
             * @return {INodeMap} The cloned INodeMap.
             */
            static _cloneNodeMap(sourceMap: INodeMap, element: HTMLElement,
                parent: ui.ITemplateControl, newControl?: ui.ITemplateControl): INodeMap {
                var hasControl = sourceMap.hasControl,
                    nodeMap = {
                        attributes: sourceMap.attributes,
                        childContext: sourceMap.childContext,
                        nodes: [],
                        element: element,
                        uiControlNode: !isNull(sourceMap.uiControlNode) ?
                        <IUiControlNode>ElementManager._cloneNode(sourceMap.uiControlNode, element, newControl) : null,
                        hasControl: hasControl
                    };

                if (hasControl) {
                    nodeMap.nodes = ElementManager.createAttributeControls(sourceMap, parent, newControl, element, true);
                }
                return nodeMap;
            }

            /**
             * The child managers for this manager.
             */
            children: Array<INodeManager> = [];

            /**
             * The type of INodeManager.
             */
            type: string = 'element';

            /**
             * Specifies whether or not this manager has a uiControl which has 
             * replaceWith set to null or empty string.
             */
            replace: boolean = false;

            /**
             * The length of a replaced control, indicates the number of nodes to slice 
             * out of the parent's childNodes.
             */
            replaceNodeLength: number;

            /**
             * Indicates whether the control for this manager hasOwnContext.
             */
            hasOwnContext: boolean = false;

            /**
             * In the event that a control hasOwnContext, we need a promise to fullfill 
             * when the control is loaded to avoid loading its parent control first.
             */
            loadedPromise: async.IPromise<void, Error>;

            /**
             * A templatePromise set when a uiControl specifies a templateUrl.
             */
            templatePromise: async.IPromise<DocumentFragment, async.IAjaxError>;

            $ElementManagerStatic: IElementManagerStatic = acquire('$ElementManagerStatic');
            $PromiseStatic: async.IPromiseStatic = acquire('$PromiseStatic');
            $compiler: ICompiler = acquire('$compiler');
            $NodeManagerStatic: INodeManagerStatic = acquire('$NodeManagerStatic');
            $ContextManagerStatic: observable.IContextManagerStatic = acquire('$ContextManagerStatic');
            $commentManagerFactory: ICommentManagerFactory = acquire('$commentManagerFactory');
            $ExceptionStatic: IExceptionStatic = acquire('$ExceptionStatic');
            $ControlStatic: IControlStatic = acquire('$ControlStatic');
            $TemplateControlStatic: ui.ITemplateControlStatic = acquire('$TemplateControlStatic');

            /**
             * Clones this ElementManager with a new node.
             * 
             * @param newNode The new element used to clone the ElementManager.
             * @param parentManager The parent for the clone.
             * @param newControl An optional new control to associate with the clone.
             */
            clone(newNode: Node, parentManager: IElementManager, nodeMap?: INodeMap) {
                var childNodes: Array<Node>,
                    clonedManager: IElementManager,
                    replace = this.replace,
                    nodeMapExists = !isNull(nodeMap),
                    newControl = nodeMapExists ? nodeMap.uiControlNode.control : null,
                    newControlExists = !isNull(newControl),
                    startNodeManager: INodeManager,
                    endNodeManager: INodeManager,
                    parentControl = parentManager.getUiControl() || parentManager.getParentControl(),
                    ElementManager = this.$ElementManagerStatic;

                if (!newControlExists) {
                    // create new control
                    newControl = ElementManager.cloneUiControl(this.nodeMap, parentControl);

                    newControlExists = !isNull(newControl);
                }

                if (replace) {
                    // definitely have newControl
                    var nodes = newNode.parentNode.childNodes,
                        startIndex = Array.prototype.indexOf.call(nodes, newNode);

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
                    clonedManager = ElementManager.clone(this, parentManager, <HTMLElement>newNode, newControl, nodeMap);
                    nodeMap = clonedManager.nodeMap;

                    if (newControlExists) {
                        newControl.element = <HTMLElement>newNode;
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

                var children = this.children,
                    length = children.length,
                    childNodeOffset = 0;

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
            }

            /**
             * Initializes all the controls associated to the ElementManager's nodeMap. 
             * The INodeManager array must be passed in because if this ElementManager is 
             * used for transclusion, it can't rely on one INodeManager array.
             * 
             * @param dontInitialize Specifies whether or not the initialize method should 
             * be called for a control.
             */
            initialize(nodeMap: INodeMap, parent: IElementManager, dontInitialize?: boolean) {
                super.initialize(nodeMap, parent);

                var parentControl = this.getParentControl(),
                    controlNode = nodeMap.uiControlNode,
                    control: ui.ITemplateControl,
                    hasAttributeControl = nodeMap.hasControl,
                    hasUiControl = !isNull(controlNode),
                    replaceElement = false;

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
            }

            /**
             * Links the data context to the DOM (data-binding).
             * 
             * @param parent The parent of the UIControl and Attribute controls.
             * @param nodeMap The INodeMap for the ElementManager to use to locate controls. 
             * Separating the ElementManager from a INodeMap allows us to transclude templates
             */
            bind() {
                var nodeMap = this.nodeMap,
                    parent = this.getParentControl(),
                    controlNode = nodeMap.uiControlNode,
                    uiControl: ui.ITemplateControl,
                    nodes = nodeMap.nodes,
                    node: INode,
                    controls: Array<IControl> = [],
                    control: IControl,
                    attributes = nodeMap.attributes,
                    hasParent = !isNull(parent),
                    getManager = this.$ContextManagerStatic.getManager,
                    contextManager: observable.IContextManager,
                    absoluteContextPath = hasParent ? parent.absoluteContextPath : 'context',
                    hasUiControl = !isNull(controlNode),
                    replace = this.replace;

                if (hasUiControl) {
                    uiControl = controlNode.control;
                    controls.push(uiControl);

                    var childContext = nodeMap.childContext;

                    if (!isNull(childContext)) {
                        if (childContext[0] === '@') {
                            var split = childContext.split('.'),
                                alias = split.shift().substr(1),
                                resourceObj = this.$TemplateControlStatic.findResource(uiControl, alias);

                            if (!isNull(resourceObj)) {
                                if (resourceObj.resource.type === 'observable') {
                                    var identifier = (split.length > 0) ? '.' + split.join('.') : '';
                                    absoluteContextPath = 'resources.' + alias + '.value' + identifier;
                                    contextManager = getManager(resourceObj.control);
                                    uiControl.root = resourceObj.control;
                                } else {
                                    this.$ExceptionStatic.warn('Only resources of type observable can be set as context.',
                                        this.$ExceptionStatic.CONTEXT);
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
                        listener: (newValue, oldValue) => {
                            this.$TemplateControlStatic.contextChanged(uiControl, newValue, oldValue);
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
                this._loadAttributeControls(<Array<controls.IAttributeControl>>controls, uiControl);
            }

            _observeControlIdentifiers(nodes: Array<INode>, parent: ui.ITemplateControl, controls: Array<IControl>) {
                var length = nodes.length,
                    bindings: Array<INode> = [],
                    attributeChanged = this._attributeChanged,
                    hasParent = !isNull(parent),
                    node: INode,
                    control;

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
            }

            _loadAttributeControls(controls: Array<controls.IAttributeControl>, templateControl: ui.ITemplateControl) {
                var length = controls.length,
                    control: controls.IAttributeControl,
                    load = this.$ControlStatic.load;

                for (var i = !!templateControl ? 1 : 0; i < length; ++i) {
                    control = controls[i];
                    control.templateControl = templateControl;

                    load(control);
                }
            }

            /**
             * Sets the template for an ElementManager by calling its associated UI Control's
             * setTemplate method.
             * 
             * @param templateUrl An optional templateUrl used to override the control's template.
             */
            setUiControlTemplate(templateUrl?: string, isClone?: boolean) {
                var nodeMap = this.nodeMap,
                    controlNode = nodeMap.uiControlNode,
                    control: ui.ITemplateControl;

                if (!isNull(controlNode)) {
                    control = controlNode.control;

                    var template = this.$TemplateControlStatic.determineTemplate(control, templateUrl);

                    if (!isNull(template)) {
                        if (isFunction(template.then)) {
                            this.templatePromise = template.then((template: DocumentFragment) => {
                                this.templatePromise = null;
                                this._initializeControl(control, <DocumentFragment>template.cloneNode(true));
                            }).catch((error) => {
                                postpone(() => {
                                    this.$ExceptionStatic.fatal(error, this.$ExceptionStatic.COMPILE);
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
            }

            /**
             * Retrieves the UI control instance for this ElementManager.
             * 
             * @return {ui.ITemplateControl} The control.
             */
            getUiControl() {
                var uiControlNode = this.nodeMap.uiControlNode;
                if (isNull(uiControlNode)) {
                    return;
                }

                return uiControlNode.control;
            }

            /**
             * Fullfills any template template promises and finishes the compile phase
             * for the template associated to this ElementManager.
             * 
             * @return {async.IPromise} A promise, fulfilled when the template 
             * is complete.
             */
            fulfillTemplate() {
                var children = this.children,
                    child,
                    length = children.length,
                    promises = [];

                return new this.$PromiseStatic<any, Error>((resolve, reject) => {
                    if (!isNull(this.templatePromise)) {
                        promises.push(this.templatePromise);
                    }

                    for (var i = 0; i < length; ++i) {
                        child = children[i];
                        if (!isUndefined(child.children)) {
                            promises.push(child.fulfillTemplate());
                        }
                    }

                    this.$PromiseStatic.all<any, Error>(promises).then(resolve, reject);
                }).catch((error) => {
                    postpone(() => {
                        this.$ExceptionStatic.fatal(error, this.$ExceptionStatic.COMPILE);
                    });
                });
            }

            /**
             * Binds context to the DOM and loads controls.
             */
            bindAndLoad() {
                var children = this.children,
                    length = children.length,
                    child,
                    promises: Array<async.IPromise<void, Error>> = [];

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

                return this.$PromiseStatic.all<void, Error>(promises).then(() => {
                    this.$ControlStatic.load(this.getUiControl());
                }).catch((error) => {
                    postpone(() => {
                        this.$ExceptionStatic.fatal(error, this.$ExceptionStatic.BIND);
                    });
                });
            }

            observeRootContext(root: ui.ITemplateControl, loadMethod: () => async.IPromise<void, Error>) {
                this.loadedPromise = new this.$PromiseStatic<void, Error>((resolve, reject) => {
                    var contextManager: observable.IContextManager = this.$ContextManagerStatic.getManager(root);

                    var removeListener = contextManager.observe('context', {
                        listener: () => {
                            removeListener();

                            loadMethod.call(this).then(resolve);
                        },
                        uid: root.uid
                    });

                    if (!isNull(root.context)) {
                        removeListener();
                        loadMethod.call(this).then(resolve);
                    }
                }).catch((error) => {
                    postpone(() => {
                        this.$ExceptionStatic.fatal(error, this.$ExceptionStatic.BIND);
                    });
                });
            }

            _fulfillAndLoad() {
                return new this.$PromiseStatic<void, Error>((resolve, reject) => {
                    this.fulfillTemplate().then(() => {
                        return this.bindAndLoad();
                    }).then(resolve);
                }).catch((error) => {
                    postpone(() => {
                        this.$ExceptionStatic.fatal(error, this.$ExceptionStatic.BIND);
                    });
                });
            }
            _populateUiControl() {
                var nodeMap = this.nodeMap,
                    parent = this.getParentControl(),
                    controlNode = nodeMap.uiControlNode,
                    uiControl = <ui.ITemplateControl>controlNode.control,
                    hasParent = !isNull(parent),
                    element = nodeMap.element,
                    attributes = nodeMap.attributes,
                    newAttributes: ui.IAttributes = acquire('$attributes');

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
                    uiControl.innerTemplate = <DocumentFragment>ElementManager.$dom.appendChildren(element.childNodes);
                }

                var replace = this.replace = (uiControl.replaceWith === null || uiControl.replaceWith === '');

                if (replace) {
                    this._replaceElement(uiControl, nodeMap);
                }
            }
            _replaceElement(control: ui.ITemplateControl, nodeMap: INodeMap) {
                var element = nodeMap.element,
                    parentNode = element.parentNode,
                    $document = ElementManager.$document,
                    controlType = control.type,
                    controlUid = control.uid,
                    startNode = control.startNode = $document.createComment(controlType + ' ' + controlUid + ': start node'),
                    endNode = control.endNode = $document.createComment(controlType + ' ' + controlUid + ': end node'),
                    create = this.$commentManagerFactory.create;

                create(startNode, this);
                create(endNode, this);

                parentNode.insertBefore(startNode, element);
                parentNode.insertBefore(endNode, element.nextSibling);
                control.elementNodes = ElementManager.$dom.replace(element);

                control.element = nodeMap.element = null;
            }
            _locateResources(node: Node) {
                var childNodes: Array<Node> = Array.prototype.slice.call(node.childNodes),
                    length = childNodes.length,
                    childNode: Node;

                while (childNodes.length > 0) {
                    childNode = childNodes.shift();

                    if (childNode.nodeName.toLowerCase() === 'plat-resources') {
                        return <HTMLElement>node.removeChild(childNode);
                    }
                }
            }
            _initializeControl(uiControl: ui.ITemplateControl, template: DocumentFragment) {
                var element = this.nodeMap.element,
                    //have to check if null since isNull checks for undefined case
                    replaceElement = this.replace,
                    hasOwnContext = uiControl.hasOwnContext,
                    hasParent = !isNull(uiControl.parent),
                    endNode: Node;

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
                    var startNode = uiControl.startNode,
                        parentNode = startNode.parentNode,
                        childNodes: Array<Node> = Array.prototype.slice.call(parentNode.childNodes);

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
            }
            _attributeChanged(node: INode, parent: ui.ITemplateControl, controls: Array<IControl>) {
                var length = controls.length,
                    key = camelCase(node.nodeName),
                    attribute = <Attr>node.node,
                    value = this.$NodeManagerStatic.build(node.expressions, parent),
                    attributes: ui.Attributes,
                    oldValue;

                for (var i = 0; i < length; ++i) {
                    attributes = <ui.Attributes>controls[i].attributes;
                    oldValue = attributes[key];
                    attributes[key] = value;
                    attributes.attributeChanged(key, value, oldValue);
                }

                if (!this.replace) {
                    attribute.value = value;
                }
            }
        }

        /**
         * An ElementManager is responsible for initializing and data-binding controls associated to an HTMLElement.
         * 
         */
        export interface IElementManager extends INodeManager {
            /**
             * The child managers for this manager.
             */
            children: Array<INodeManager>;

            /**
             * Specifies whether or not this manager has a uiControl which has 
             * replaceWith set to null or empty string.
             */
            replace: boolean;

            /**
             * The length of a replaced control, indiates the number of nodes to slice 
             * out of the parent's childNodes.
             */
            replaceNodeLength: number;

            /**
             * Indicates whether the control for this manager hasOwnContext.
             */
            hasOwnContext: boolean;

            /**
             * Lets us know when an ElementManager is a cloned manager, or the compiled 
             * manager from BindableTemplates. We do not want to bindAndLoad compiled 
             * managers that are clones.
             */
            isClone: boolean;

            /**
             * In the event that a control hasOwnContext, we need a promise to fullfill 
             * when the control is loaded to avoid loading its parent control first.
             */
            loadedPromise: async.IPromise<void, Error>;

            /**
             * A templatePromise set when a uiControl specifies a templateUrl.
             */
            templatePromise: async.IPromise<DocumentFragment, async.IAjaxError>;

            /**
             * Clones the IElementManager with a new node.
             * 
             * @param newNode The new element used to clone the ElementManager.
             * @param parentManager The parent for the clone.
             * @param newControl An optional new control to associate with the clone.
             */
            clone(newNode: Node, parentManager: IElementManager, nodeMap?: INodeMap): number;

            /**
             * Initializes all the controls associated to the ElementManager's nodeMap. 
             * The INodeManager array must be passed in because if this ElementManager is 
             * used for transclusion, it can't rely on one INodeManager array.
             * 
             * @param dontInitialize Specifies whether or not the initialize method should 
             * be called for a control.
             */
            initialize(nodeMap: INodeMap, parent: IElementManager, dontInitialize?: boolean): void;

            /**
             * Todo
             */
            observeRootContext(root: ui.ITemplateControl, loadMethod: () => async.IPromise<void, Error>): void;

            /**
             * Links the data context to the DOM (data-binding).
             * 
             * @param parent The parent of the UIControl and Attribute controls.
             * @param nodeMap The INodeMap for the ElementManager to use to locate controls. 
             * Separating the ElementManager from a INodeMap allows us to transclude templates
             */
            bind(): void;

            /**
             * Sets the template for an ElementManager by calling its associated UI Control's
             * setTemplate method.
             * 
             * @param templateUrl An optional templateUrl used to override the control's template.
             */
            setUiControlTemplate(templateUrl?: string): void;

            /**
             * Retrieves the UI control instance for this ElementManager.
             * 
             * @return {ui.ITemplateControl} The control.
             */
            getUiControl(): ui.ITemplateControl;

            /**
             * Fullfills any template template promises and finishes the compile phase
             * for the template associated to this ElementManager.
             * 
             * @return {async.IPromise} A promise, fulfilled when the template 
             * is complete.
             */
            fulfillTemplate(): async.IPromise<any, Error>;

            /**
             * Binds context to the DOM and loads controls.
             */
            bindAndLoad(): async.IPromise<any, Error>;
        }

        export interface IElementManagerStatic {
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
            create(element: HTMLElement, parent?: IElementManager): IElementManager;

            /**
             * Creates new nodes for an INodeMap corresponding to the element associated with the nodeMap or
             * the passed-in element.
             *
             * @param nodeMap The nodeMap to populate with attribute nodes.
             * @param parent The parent control for the new attribute controls.
             * @param newElement An optional element to use for attributes (used in cloning).
             * @return {Array<INode>} The new nodes.
             */
            createAttributeControls(nodeMap: INodeMap, parent: ui.ITemplateControl,
                templateControl?: ui.ITemplateControl, newElement?: HTMLElement, isClone?: boolean): Array<INode>;

            /**
             * Clones a UI Control with a new nodeMap.
             *
             * @param sourceMap The source INodeMap used to clone the UI Control
             * @param parent The parent control of the clone.
             * @return {ui.ITemplateControl} The cloned UI control.
             */
            cloneUiControl(sourceMap: INodeMap, parent: ui.ITemplateControl): ui.ITemplateControl;

            /**
             * Clones an ElementManager with a new element.
             *
             * @param sourceManager The original IElementManager.
             * @param parent The parent IElementManager for the new clone.
             * @param element The new element to associate with the clone.
             * @param newControl An optional control to associate with the clone.
             * @return {IElemenetManager} The cloned ElementManager.
             */
            clone(sourceManager: IElementManager, parent: IElementManager,
                element: HTMLElement, newControl?: ui.ITemplateControl, nodeMap?: INodeMap): IElementManager;

            /**
             * Returns an instance of an IElementManager
             */
            getInstance(): IElementManager;
        }

        export function ElementManagerStatic($dom,
        $document,
        $ManagerCacheStatic,
        $ResourcesStatic,
        $BindableTemplatesStatic) {
            ElementManager.$dom = $dom;
            ElementManager.$document = $document;
            ElementManager.$ManagerCacheStatic = $ManagerCacheStatic;
            ElementManager.$ResourcesStatic = $ResourcesStatic;
            ElementManager.$BindableTemplatesStatic = $BindableTemplatesStatic;
            return ElementManager;
        }

        register.injectable('$ElementManagerStatic', ElementManagerStatic, [
            '$dom',
            '$document',
            '$ManagerCacheStatic',
            '$ResourcesStatic',
            '$BindableTemplatesStatic'
        ], register.injectableType.STATIC);

        export class TextManager extends processing.NodeManager implements ITextManager {
            /**
             * Determines if a text node has markup, and creates a TextManager if it does.
             * A TextManager or empty TextManager will be added to the managers array.
             * 
             * @static
             * @param node The Node used to find markup.
             * @param parent The parent ui.ITemplateControl for the node.
             * @param managers The INodeManager array used to compile the DOM.
             */
            static create(node: Node, parent: IElementManager) {
                var value = node.nodeValue,
                    manager = new TextManager();

                if (NodeManager.hasMarkup(value)) {
                    var expressions = NodeManager.findMarkup(value),
                        map = {
                            nodes: [{
                                node: node,
                                expressions: expressions,
                                identifiers: NodeManager.findUniqueIdentifiers(expressions),
                            }]
                        };

                    manager.initialize(map, parent);

                    return manager;
                }

                manager.initialize(null, parent);
                manager.bind = noop;

                return manager;
            }

            /**
             * Clones an INodeMap with a new text node.
             * 
             * @param sourceMap The original INodeMap.
             * @param element The new text node used for cloning.
             * @return {INodeMap} The cloned INodeMap.
             */
            static _cloneNodeMap(sourceMap: INodeMap, newNode: Node): INodeMap {
                var node = sourceMap.nodes[0],
                    nodeMap: INodeMap = {
                        nodes: [{
                            identifiers: node.identifiers,
                            expressions: node.expressions,
                            nodeName: node.nodeName,
                            node: newNode
                        }]
                    };
                return nodeMap;
            }

            /**
             * Clones a TextManager with a new text node.
             * 
             * @param sourceManager The original IElementManager.
             * @param node The new text node to associate with the clone.
             * @param parent The parent IElementManager for the new clone.
             * @return {TextManager} The cloned TextManager.
             */
            static _clone(sourceManager: INodeManager, node: Node, parent: IElementManager) {
                var map = sourceManager.nodeMap,
                    manager = new TextManager();

                if (!isNull(map)) {
                    manager.initialize(TextManager._cloneNodeMap(map, node), parent);
                } else {
                    manager.initialize(null, parent);
                    manager.bind = noop;
                }

                return manager;
            }

            /**
             * Specifies the type for this INodeManager.
             */
            type: string = 'text';

            /**
             * Clones this TextManager with a new node.
             * 
             * @param newNode The new element used to clone the TextManager.
             * @param parentManager The parent for the clone.
             */
            clone(newNode: Node, parentManager: IElementManager) {
                TextManager._clone(this, newNode, parentManager);
                return 1;
            }

            /**
             * The function used for data-binding a data context to the DOM. We allow you to 
             * pass in a ui.ITemplateControl and INodeMap to override those contained on the
             * TextManager instance. This helps when binding templates to new data contexts.
             * 
             * @param parent The parent ui.ITemplateControl to use for context inheritance.
             * @param nodeMap The INodeMap to use in order to data-bind the data context.
             */
            bind() {
                var parent = this.getParentControl(),
                    node = this.nodeMap.nodes[0],
                    textNode = node.node,
                    expressions = node.expressions;

                NodeManager.observeIdentifiers(node.identifiers, parent,
                    this._setText.bind(this, textNode, parent, expressions));

                this._setText(textNode, parent, expressions);
            }
            _setText(node: Node, control: ui.ITemplateControl, expressions: Array<expressions.IParsedExpression>) {
                var control = control || <ui.ITemplateControl>{},
                    value;

                value = NodeManager.build(expressions, control);

                node.nodeValue = value;
            }
        }

        export interface ITextManager extends INodeManager {
            /**
             * Clones this TextManager with a new node.
             * 
             * @param newNode The new element used to clone the TextManager.
             * @param parentManager The parent for the clone.
             */
            clone(newNode: Node, parentManager: IElementManager): number;

            /**
             * The function used for data-binding a data context to the DOM. We allow you to 
             * pass in a ui.ITemplateControl and INodeMap to override those contained on the
             * TextManager instance. This helps when binding templates to new data contexts.
             * 
             * @param parent The parent ui.ITemplateControl to use for context inheritance.
             * @param nodeMap The INodeMap to use in order to data-bind the data context.
             */
            bind();
        }

        export interface ITextManagerStatic {
            /**
             * Determines if a text node has markup, and creates a TextManager if it does.
             * A TextManager or empty TextManager will be added to the managers array.
             * 
             * @static
             * @param node The Node used to find markup.
             * @param parent The parent ui.ITemplateControl for the node.
             * @param managers The INodeManager array used to compile the DOM.
             */
            create(node: Node, parent?: IElementManager): ITextManager;
        }

        export function TextManagerStatic() {
            return TextManager;
        }

        register.injectable('$TextManageStatic', TextManagerStatic, null, register.injectableType.STATIC);

        /**
         * A class used to manage Comment nodes. Provides a way to 
         * clone a Comment node.
         */
        export class CommentManager extends NodeManager implements ICommentManager {
            /**
             * Creates a new CommentManager for the given Comment node.
             * 
             * @static
             * @param node The Comment to associate with the new manager.
             * @param parent The parent IElementManager.
             * @param isClone Denotes whether or not the new manager is a cloned
             * manager.
             */
            static create(node: Node, parent: IElementManager) {
                var manager = new CommentManager();

                manager.initialize({
                    nodes: [{
                        node: node
                    }]
                }, parent);
            }

            /**
             * Specifies the type of INodeManager.
             */
            type: string = 'comment';

            /**
             * A method for cloning this CommentManager.
             * 
             * @param newNode The new Comment node to associate with the cloned
             * manager.
             * @param parentManager The parent IElementManager for the new clone.
             */
            clone(newNode: Node, parentManager: IElementManager) {
                CommentManager.create(newNode, parentManager);
                return 1;
            }
        }

        export interface ICommentManager {
            /**
             * A method for cloning this CommentManager.
             * 
             * @param newNode The new Comment node to associate with the cloned
             * manager.
             * @param parentManager The parent IElementManager for the new clone.
             */
            clone(newNode: Node, parentManager: IElementManager): number;
        }

        export interface ICommentManagerFactory {
            /**
             * Creates a new CommentManager for the given Comment node.
             *
             * @static
             * @param node The Comment to associate with the new manager.
             * @param parent The parent IElementManager.
             * @param isClone Denotes whether or not the new manager is a cloned
             * manager.
             */
            create(node: Node, parent: IElementManager): ICommentManager;
        }

        register.injectable('$commentManagerFactory', function () {
            return CommentManager;
        });
    }
    export module navigation {
        export class BaseNavigator implements IBaseNavigator {
            /**
             * A unique identifier used to identify this navigator.
             */
            uid = uniqueId('plat_');

            /**
             * Every navigator will have a viewport with which to communicate and 
             * facilitate navigation.
             */
            baseport: ui.controls.IBaseport;

            /**
             * Specifies the current state of navigation. This state should contain 
             * enough information for it to be pushed onto the history stack when 
             * necessary.
             */
            currentState: IBaseNavigationState;

            $EventManagerStatic: events.IEventManagerStatic = acquire('$EventManagerStatic');
            $NavigationEventStatic: events.INavigationEventStatic = acquire('$NavigationEventStatic');
            $ExceptionStatic: IExceptionStatic = acquire('$ExceptionStatic');
            $ViewControlStatic: ui.IViewControlStatic = acquire('$ViewControlStatic');

            constructor() {
                this.$EventManagerStatic.on(this.uid, 'goBack', this.goBack, this);
            }

            /**
             * Initializes a Navigator. The viewport will call this method and pass itself in so 
             * the navigator can store it and use it to facilitate navigation.
             */
            initialize(baseport: ui.controls.IBaseport) {
                this.baseport = baseport;
            }

            navigate(navigationParameter: any, options: IBaseNavigationOptions) { }

            /**
             * Called by the Viewport to make the Navigator aware of a successful navigation. The Navigator will
             * in-turn call the app.navigated event.
             * 
             * @param control The ui.IViewControl to which the navigation occurred.
             * @param parameter The navigation parameter sent to the control.
             * @param options The INavigationOptions used during navigation.
             */
            navigated(control: ui.IViewControl, parameter: any, options: IBaseNavigationOptions) {
                this.currentState = {
                    control: control
                };

                control.navigator = this;
                control.navigatedTo(parameter);

                this._sendEvent('navigated', control, control.type, parameter, options, false);
            }

            /**
             * Every navigator must implement this method, defining what happens when a view 
             * control wants to go back.
             */
            goBack(options?: IBaseBackNavigationOptions) { }

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
            _sendEvent(name: string, target: any, type: string, parameter: any, options: IBaseNavigationOptions, cancelable: boolean) {
                return this.$NavigationEventStatic.dispatch(name, this, {
                    target: target,
                    type: type,
                    parameter: parameter,
                    options: options,
                    cancelable: cancelable
                });
            }
        }

        /**
         * Options that you can submit to the navigator in order
         * to customize navigation.
         */
        export interface IBaseNavigationOptions {
            /**
             * Allows a ui.IViewControl to leave itself out of the 
             * navigation history.
             */
            replace?: boolean;
        }

        /**
         * Options that you can submit to the navigator during a backward
         * navigation in order to customize the navigation.
         */
        export interface IBaseBackNavigationOptions {
            /**
             * Lets the Navigator know to navigate back a specific length 
             * in history.
             */
            length?: number;
        }

        /**
         * Defines the base interface needing to be implemented in the history.
         */
        export interface IBaseNavigationState {
            /**
             * The view control associated with a history entry.
             */
            control: ui.IViewControl;
        }

        /**
         * Defines the methods that a Navigator must implement.
         */
        export interface IBaseNavigator {
            /**
             * Initializes a Navigator. The viewport will call this method and pass itself in so 
             * the navigator can store it and use it to facilitate navigation.
             */
            initialize(baseport: ui.controls.IBaseport): void;

            /**
             * Allows a ui.IViewControl to navigate to another ui.IViewControl. Also allows for
             * navigation parameters to be sent to the new ui.IViewControl.
             * 
             * @param method The method used to obtain a view control from the registered view controls. Different types of 
             * navigators will require different methods of retrieval.
             * @param parameter An optional navigation parameter to send to the next ui.IViewControl.
             * @param options Optional IBaseNavigationOptions used for navigation.
             */
            navigate(navigationParameter: any, options?: IBaseNavigationOptions): void;

            /**
             * Called by the Viewport to make the Navigator aware of a successful navigation. The Navigator will
             * in-turn call the app.navigated event.
             * 
             * @param control The ui.IViewControl to which the navigation occurred.
             * @param parameter The navigation parameter sent to the control.
             * @param options The INavigationOptions used during navigation.
             */
            navigated(control: ui.IViewControl, parameter: any, options: IBaseNavigationOptions): void;

            /**
             * Every navigator must implement this method, defining what happens when a view 
             * control wants to go back.
             */
            goBack(options?: IBaseBackNavigationOptions): void;
        }

        /**
         * The Navigator class allows ui.IViewControls to navigate within a Viewport.
         * Every Viewport has its own Navigator instance, allowing multiple navigators to 
         * coexist in one app.
         */
        export class Navigator extends BaseNavigator implements INavigator {
            /**
             * Contains the navigation history stack.
             */
            history: Array<IBaseNavigationState> = [];

            /**
             * Allows a ui.IViewControl to navigate to another ui.IViewControl. Also allows for
             * navigation parameters to be sent to the new ui.IViewControl.
             * 
             * @param Constructor The Constructor for the new ui.IViewControl. The Navigator will find the injector 
             * for the Constructor and create a new instance of the control.
             * @param parameter An optional parameter to send to the next ui.IViewControl.
             * @param options Optional IBaseNavigationOptions used for Navigation.
             */
            navigate(Constructor?: new (...args: any[]) => ui.IViewControl, options?: INavigationOptions);
            navigate(injector?: dependency.IInjector<IControl>, options?: INavigationOptions);
            navigate(Constructor?: any, options?: INavigationOptions) {
                var state = this.currentState || <IBaseNavigationState>{},
                    viewControl = state.control,
                    injector: dependency.IInjector<ui.IViewControl>,
                    key: string,
                    options = options || <IBaseNavigationOptions>{},
                    parameter = options.parameter,
                    event: events.INavigationEvent<any, any, IBaseNavigator>;

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
                    var keys = Object.keys(viewControlInjectors),
                        control: dependency.IInjector<ui.IViewControl>;

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
            }

            /**
             * Returns to the last visited ui.IViewControl.
             * 
             * @param parameter An optional navigation parameter to send to the previous control.
             * @param options Optional IBackNavigationOptions allowing the ui.IViewControl
             * to customize navigation. Enables navigating back to a specified point in history as well
             * as specifying a new templateUrl to use at the next ui.IViewControl.
             */
            goBack(options?: IBackNavigationOptions) {
                options = options || {};

                if (this.history.length === 0) {
                    this.$EventManagerStatic.dispatch('shutdown', this, this.$EventManagerStatic.direction.DIRECT);
                }

                var viewControl = this.currentState.control,
                    length = isNumber(options.length) ? options.length : 1,
                    Constructor = options.ViewControl,
                    parameter = options.parameter;

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
                    this.$ExceptionStatic.warn('Not enough views in the navigation history in order to navigate back.',
                        this.$ExceptionStatic.NAVIGATION);
                    return;
                }

                var ViewControl: ui.IViewControlStatic = acquire('$ViewControlStatic');

                this.baseport.navigateFrom(viewControl);
                ViewControl.dispose(viewControl);

                var last: IBaseNavigationState = this._goBackLength(length);

                if (isNull(last)) {
                    return;
                }

                viewControl = last.control;

                this.currentState = last;

                event.target = viewControl;
                event.type = viewControl.type;

                this.baseport.navigateTo(event);
            }

            /**
             * Lets the caller know if there are ui.IViewControls in the history, meaning the caller
             * is safe to perform a backward navigation.
             * 
             * @return {Boolean}
             */
            canGoBack() {
                return this.history.length > 0;
            }

            /**
             * Clears the navigation history, disposing all the controls.
             */
            clearHistory() {
                var history = this.history,
                    dispose = this.$ViewControlStatic.dispose;

                while (history.length > 0) {
                    dispose(history.pop().control);
                }
            }

            /**
             * Finds the given constructor in the history stack. Returns the index in the history where
             * the constructor is found, or -1 if no constructor is found.
             * 
             * @param Constructor The view control constructor to search for in the history stack.
             */
            _findInHistory(Constructor: new (...args: any[]) => ui.IViewControl) {
                var history = this.history,
                    length = history.length - 1,
                    index = -1,
                    control: any;

                for (var i = length; i >= 0; --i) {
                    control = history[i].control;

                    if (control.constructor === Constructor) {
                        index = i;
                        break;
                    }
                }

                return index;
            }

            /**
             * This method takes in a length and navigates back in the history, returning the view control 
             * associated with length + 1 entries back in the history.  It disposes all the view controls 
             * encapsulated in the length.
             */
            _goBackLength(length?: number) {
                length = isNumber(length) ? length : 1;

                var last: IBaseNavigationState,
                    dispose = this.$ViewControlStatic.dispose;

                while (length-- > 0) {
                    if (!isNull(last) && !isNull(last.control)) {
                        dispose(last.control);
                    }

                    last = this.history.pop();
                }

                return last;
            }
        }

        export interface INavigationOptions extends IBaseNavigationOptions {
            /**
             * An optional parameter to send to the next ui.IViewControl.
             */
            parameter?: any;
        }

        export interface IBackNavigationOptions extends IBaseBackNavigationOptions {
            /**
             * An optional parameter to send to the next ui.IViewControl.
             */
            parameter?: any;
            /**
             * A ui.IViewControl Constructor that the Navigator will
             * use to navigate. The Navigator will search for an instance 
             * of the ui.IViewControl in its history and navigate to it.
             */
            ViewControl?: new (...args: any[]) => ui.IViewControl;
        }

        /**
         * An object implementing INavigator allows ui.IViewControls implements methods 
         * used to navigate within a Viewport.
         */
        export interface INavigator extends IBaseNavigator {
            /**
             * Contains the navigation history stack for the associated Viewport.
             */
            history: Array<IBaseNavigationState>;

            /**
             * Allows a ui.IViewControl to navigate to another ui.IViewControl. Also allows for
             * navigation parameters to be sent to the new ui.IViewControl.
             * 
             * @param Constructor The Constructor for the new ui.IViewControl. The Navigator will find the injector 
             * for the Constructor and create a new instance of the control.
             * @param parameter An optional parameter to send to the next ui.IViewControl.
             * @param options Optional IBaseNavigationOptions used for Navigation.
             */
            navigate(Constructor?: new (...args: any[]) => ui.IViewControl, options?: INavigationOptions): void;
            navigate(injector?: dependency.IInjector<IControl>, options?: INavigationOptions): void;

            /**
             * Returns to the last visited ui.IViewControl.
             * 
             * @param options Optional IBackNavigationOptions allowing the ui.IViewControl
             * to customize navigation. Enables navigating back to a specified point in history as well
             * as specifying a new templateUrl to use at the next ui.IViewControl.
             */
            goBack(options?: IBackNavigationOptions): void;

            /**
             * Lets the caller know if there are ui.IViewControls in the history, meaning the caller
             * is safe to perform a backward navigation.
             * 
             * @return {Boolean}
             */
            canGoBack(): boolean;

            /**
             * Clears the navigation history, disposing all the controls.
             */
            clearHistory(): void;
        }

        register.injectable('$navigator', Navigator, null, register.injectableType.MULTI);

        export class RoutingNavigator extends BaseNavigator implements IRoutingNavigator {
            currentState: IRouteNavigationState;
            $browser: web.IBrowser = acquire('$browser');
            $router: web.IRouter = acquire('$router');
            $window: Window = acquire('$window');
            private __removeListeners: Array<IRemoveListener> = [];
            private __historyLength = 0;

            constructor() {
                super();

                this.__removeListeners.push(this.$EventManagerStatic.on(this.uid, 'routeChanged', this._onRouteChanged, this));
                this.__removeListeners.push(this.$EventManagerStatic.on(this.uid, 'beforeRouteChange', this._beforeRouteChange, this));
            }

            _beforeRouteChange(ev: events.INavigationEvent<dependency.IInjector<ui.IViewControl>, web.IRoute<any>, web.IRouter>) {
                var event = this._sendEvent('beforeNavigate', ev.target, ev.type, ev.parameter, ev.options, true);

                if (event.canceled) {
                    ev.cancel();
                }
            }

            _onRouteChanged(ev: events.INavigationEvent<dependency.IInjector<ui.IViewControl>, web.IRoute<any>, web.IRouter>) {
                var state = this.currentState || <IRouteNavigationState>{},
                    viewControl = state.control,
                    injector = ev.target;

                if (isNull(injector)) {
                    return;
                }

                this.__historyLength++;
                this.baseport.navigateFrom(viewControl);
                this.$ViewControlStatic.dispose(viewControl);
                this.baseport.navigateTo(ev);
            }

            /**
             * Allows a ui.IViewControl to navigate to another ui.IViewControl. Also allows for
             * navigation parameters to be sent to the new ui.IViewControl.
             * 
             * @param path The url path to navigate to.
             * @param parameter An optional navigation parameter to send to the next ui.IViewControl.
             * @param options Optional INavigationOptions for ignoring the current ui.IViewControl in the history as
             * well as specifying a new templateUrl for the next ui.IViewControl to use.
             */
            navigate(path: string, options?: web.IRouteNavigationOptions) {
                this.$router.route(path, options);
            }

            /**
             * Called by the Viewport to make the Navigator aware of a successful navigation. The Navigator will
             * in-turn call the app.navigated event.
             * 
             * @param control The ui.IViewControl to which the navigation occurred.
             * @param parameter The navigation parameter sent to the control.
             * @param options The INavigationOptions used during navigation.
             */
            navigated(control: ui.IViewControl, parameter: web.IRoute<any>, options: web.IRouteNavigationOptions) {
                super.navigated(control, parameter, options);
                this.currentState.route = parameter;
            }

            goBack(options?: IBaseBackNavigationOptions) {
                options = options || {};

                this.__historyLength -= 2;

                if (this.__historyLength < 0) {
                    this.$EventManagerStatic.dispatch('shutdown', this, this.$EventManagerStatic.direction.DIRECT);
                }

                this.$router.goBack((isNumber(options.length) ? options.length : 1));
            }
        }

        register.injectable('$routingNavigator', RoutingNavigator);
    
        export interface IRoutingNavigator extends IBaseNavigator {
            /**
             * Allows a ui.IViewControl to navigate to another ui.IViewControl. Also allows for
             * navigation parameters to be sent to the new ui.IViewControl.
             * 
             * @param path The url path to navigate to.
             * @param parameter An optional navigation parameter to send to the next ui.IViewControl.
             * @param options Optional INavigationOptions for ignoring the current ui.IViewControl in the history as
             * well as specifying a new templateUrl for the next ui.IViewControl to use.
             */
            navigate(path: string, options?: web.IRouteNavigationOptions): void;

            /**
             * Returns to the last visited ui.IViewControl.
             * 
             * @param parameter An optional navigation parameter to send to the previous control.
             * @param options Optional IBackNavigationOptions allowing the ui.IViewControl
             * to customize navigation. Enables navigating back to a specified point in history as well
             * as specifying a new templateUrl to use at the next ui.IViewControl.
             */
            goBack(options?: IBaseBackNavigationOptions): void;
        }

        export interface IRouteNavigationState extends IBaseNavigationState {
            route: web.IRoute<any>;
        }
    }
    /**
     * Class for every app. This class contains hooks for Application Lifecycle Events 
     * as well as error handling.
     */
    export class App implements IApp {
        static $compat: ICompat;
        static $ExceptionStatic: IExceptionStatic;
        static $EventManagerStatic: events.IEventManagerStatic;
        static $document: Document;
        static $compiler: processing.ICompiler;
        static $LifecycleEventStatic: events.ILifecycleEventStatic;

        /**
         * A static method for initiating the app startup.
         */
        static start() {
            var compat: ICompat = acquire('$compat');

            if (!compat.isCompatible) {
                var $ExceptionStatic: IExceptionStatic = acquire('$ExceptionStatic');

                $ExceptionStatic.fatal('PlatypusTS only supports modern browsers where ' +
                    'Object.defineProperty is defined', $ExceptionStatic.COMPAT);
                return;
            }

            var eventManager: events.IEventManagerStatic = acquire('$EventManagerStatic');

            eventManager.dispose('__app__');
            eventManager.on('__app__', 'ready', App.__ready);
            eventManager.on('__app__', 'shutdown', App.__shutdown);
            eventManager.initialize();
        }

        /**
         * A static methods called upon app registration. Primarily used 
         * to initiate a ready state in the case that amd is being used.
         */
        static registerApp(app: any) {
            App._app = app;
            var compat: ICompat = acquire('$compat');

            if (compat.amd) {
                var lifecycleEventFactory: events.ILifecycleEventStatic = acquire('$LifecycleEventStatic'),
                    dispatch = lifecycleEventFactory.dispatch;

                postpone(function ready() {
                    dispatch('ready', lifecycleEventFactory);
                });
            }
        }

        /**
         * Kicks off compilation of the DOM from the specified node. If no node is specified, 
         * the default start node is document.body.
         * 
         * @param node The node at which DOM compilation begins.
         */
        static load(node?: Node) {
            var LifecycleEvent = App.$LifecycleEventStatic,
                compiler = App.$compiler,
                $document = App.$document;

            LifecycleEvent.dispatch('beforeLoad', App);

            if (isNull(node)) {
                compiler.compile($document.body);
                return;
            }

            compiler.compile(node);
        }

        /**
         * The instance of the registered IApp.
         */
        static _app: IApp;

        /**
         * A static method called when the application is ready. It calls the app instance's 
         * ready function as well as checks for the presence of a module loader. If one exists, 
         * loading the DOM falls back to the app developer. If it doesn't, the DOM is loaded from 
         * document.body.
         */
        private static __ready(ev: events.ILifecycleEvent) {
            dependency.Injector.initialize();
            var app = App._app;

            if (!isNull(app)) {
                if (isFunction((<dependency.IInjector<any>>(<any>app)).inject)) {
                    App._app = app = (<dependency.IInjector<any>>(<any>app)).inject();
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
        }

        private static __shutdown() {
            var app = (<any>navigator).app;

            if (!isNull(app) && isFunction(app.exitApp)) {
                app.exitApp();
            }
        }

        /**
         * A unique id, created during instantiation.
         */
        uid: string;

        /**
         * Class for every app. This class contains hooks for Application Lifecycle Management (ALM)
         * as well as error handling and navigation events.
         */
        constructor() {
            var ContextManager: observable.IContextManagerStatic = acquire('$ContextManagerStatic');
            ContextManager.defineGetter(this, 'uid', uniqueId('plat_'));
        }

        /**
         * Event fired when the app is suspended.
         * 
         * @param ev The ILifecycleEvent object.
         */
        suspend(ev: events.ILifecycleEvent) { }

        /**
         * Event fired when the app resumes from the suspended state.
         * 
         * @param ev The ILifecycleEvent object.
         */
        resume(ev: events.ILifecycleEvent) { }

        /**
         * Event fired when an internal error occures.
         * 
         * @param ev The IErrorEvent object.
         */
        error(ev: events.IErrorEvent<Error>) { }

        /**
         * Event fired when the app is ready.
         * 
         * @param ev The ILifecycleEvent object.
         */
        ready(ev: events.ILifecycleEvent) { }

        /**
         * Event fired when the app regains connectivity and is now in an online state.
         * 
         * @param ev The ILifecycleEvent object.
         */
        online(ev: events.ILifecycleEvent) { }

        /**
         * Event fired when the app loses connectivity and is now in an offline state.
         * 
         * @param ev The ILifecycleEvent object.
         */
        offline(ev: events.ILifecycleEvent) { }

        /**
         * Creates a new DispatchEvent and propagates it to all listeners based on the 
         * events.EventManager.DIRECT method. Propagation will always start with the sender, 
         * so the sender can both produce and consume the same event.
         * 
         * @param name The name of the event to send, cooincides with the name used in the
         * app.on() method.
         * @param ...args Any number of arguments to send to all the listeners.
         */
        dispatchEvent(name: string, ...args: any[]) {
            App.$EventManagerStatic.dispatch(name, this, App.$EventManagerStatic.direction.DIRECT, args);
        }

        /**
         * Registers a listener for a beforeNavigate event. The listener will be called when a beforeNavigate 
         * event is propagating over the app. Any number of listeners can exist for a single event name. 
         * This event is cancelable using the ev.cancel() method, and thereby preventing the navigation.
         * 
         * @param name='beforeNavigate' The name of the event, cooinciding with the beforeNavigate event.
         * @param listener The method called when the beforeNavigate event is fired.
         */
        on(name: 'beforeNavigate', listener: (ev: events.INavigationEvent<any, any, navigation.IBaseNavigator>) => void): IRemoveListener;
        /**
         * Registers a listener for a navigating event. The listener will be called when a navigating 
         * event is propagating over the app. Any number of listeners can exist for a single event name. 
         * This event is cancelable using the ev.cancel() method, and thereby preventing the navigation.
         * 
         * @param name='navigating' The name of the event, cooinciding with the navigating event.
         * @param listener The method called when the navigating event is fired.
         */
        on(name: 'navigating', listener: (ev: events.INavigationEvent<any, any, navigation.IBaseNavigator>) => void): IRemoveListener;
        /**
         * Registers a listener for a navigated event. The listener will be called when a navigated 
         * event is propagating over the app. Any number of listeners can exist for a single event name. 
         * This event is not cancelable.
         * 
         * @param name='navigated' The name of the event, cooinciding with the navigated event.
         * @param listener The method called when the navigated event is fired.
         */
        on(name: 'navigated',
            listener: (ev: events.INavigationEvent<ui.IViewControl, any, navigation.IBaseNavigator>) => void): IRemoveListener;
        /**
         * Registers a listener for a routeChange event. The listener will be called when a routeChange event 
         * is propagating over the app. Any number of listeners can exist for a single event name.
         *
         * @param eventName='routeChange' This specifies that the listener is for a routeChange event.
         * @param listener The method called when the routeChange is fired. The route argument will contain 
         * a parsed route.
         */
        on(name: 'routeChange', listener: (ev: events.INavigationEvent<any, any, web.IRouter>) => void): IRemoveListener;
        /**
         * Registers a listener for a NavigationEvent. The listener will be called when a NavigationEvent is 
         * propagating over the app. Any number of listeners can exist for a single event name.
         * 
         * @param name The name of the event, cooinciding with the NavigationEvent name.
         * @param listener The method called when the NavigationEvent is fired.
         */
        on(name: string, listener: (ev: events.INavigationEvent<any, any, any>) => void): IRemoveListener;
        /**
         * Registers a listener for a DispatchEvent. The listener will be called when a DispatchEvent is 
         * propagating over the app. Any number of listeners can exist for a single event name.
         * 
         * @param name The name of the event, cooinciding with the DispatchEvent name.
         * @param listener The method called when the DispatchEvent is fired.
         */
        on(name: string, listener: (ev: events.IDispatchEvent, ...args: any[]) => void): IRemoveListener {
            return App.$EventManagerStatic.on(this.uid, name, listener, this);
        }

        /**
         * Kicks off compilation of the DOM from the specified node. If no node is specified, 
         * the default start node is document.body. This method should be called from the app when 
         * using module loaders. If a module loader is in use, the app will delay loading until 
         * this method is called.
         * 
         * @param node The node where at which DOM compilation begins.
         */
        load(node?: Node) {
            App.load(node);
        }
    }

    export interface IAppStatic {
        /**
         * A static method for initiating the app startup.
         */
        start(): void;

        registerApp(app: IApp): void;

        /**
         * Kicks off compilation of the DOM from the specified node. If no node is specified,
         * the default start node is document.body.
         *
         * @param node The node at which DOM compilation begins.
         */
        load(node?: Node): void;
    }

    export function AppStatic($compat: ICompat,
    $ExceptionStatic: IExceptionStatic,
    $EventManagerStatic: events.IEventManagerStatic,
    $document: Document,
    $compiler: processing.ICompiler,
    $LifecycleEventStatic: events.ILifecycleEventStatic) {
        App.$compat = $compat;
        App.$ExceptionStatic = $ExceptionStatic;
        App.$EventManagerStatic = $EventManagerStatic;
        App.$document = $document;
        App.$compiler = $compiler;
        App.$LifecycleEventStatic = $LifecycleEventStatic;
        return App;
    }

    register.injectable('$AppStatic', AppStatic, [
            '$compat',
            '$ExceptionStatic',
            '$EventManagerStatic',
            '$document',
            '$compiler',
            '$LifecycleEventStatic'
        ], register.injectableType.STATIC);

    /**
     * An object implementing IApp implements the methods called by the framework to support 
     * Application Lifecycle Management (ALM) as well as error handling and navigation events.
     */
    export interface IApp {
        /**
         * A unique id, created during instantiation.
         */
        uid: string;

        /**
         * Event fired when the app is suspended.
         * 
         * @param ev The ILifecycleEvent object.
         */
        suspend? (ev: events.ILifecycleEvent): void;

        /**
         * Event fired when the app resumes from the suspended state.
         * 
         * @param ev The ILifecycleEvent object.
         */
        resume? (ev: events.ILifecycleEvent): void;

        /**
         * Event fired when an internal error occures.
         * 
         * @param ev The IErrorEvent object.
         */
        error? (ev: events.IErrorEvent<Error>): void;

        /**
         * Event fired when the app is ready.
         * 
         * @param ev The ILifecycleEvent object.
         */
        ready? (ev: events.ILifecycleEvent): void;

        /**
         * Event fired when the app regains connectivity and is now in an online state.
         * 
         * @param ev The ILifecycleEvent object.
         */
        online? (ev: events.ILifecycleEvent): void;

        /**
         * Event fired when the app loses connectivity and is now in an offline state.
         * 
         * @param ev The ILifecycleEvent object.
         */
        offline? (ev: events.ILifecycleEvent): void;

        /**
         * Creates a new DispatchEvent and propagates it to all listeners based on the 
         * events.EventManager.DIRECT method. Propagation will always start with the sender, 
         * so the sender can both produce and consume the same event.
         * 
         * @param name The name of the event to send, cooincides with the name used in the
         * app.on() method.
         * @param ...args Any number of arguments to send to all the listeners.
         */
        dispatchEvent(name: string, ...args: any[]);

        /**
         * Registers a listener for a beforeNavigate event. The listener will be called when a beforeNavigate 
         * event is propagating over the app. Any number of listeners can exist for a single event name. 
         * This event is cancelable using the ev.cancel() method, and thereby preventing the navigation.
         * 
         * @param name='beforeNavigate' The name of the event, cooinciding with the beforeNavigate event.
         * @param listener The method called when the beforeNavigate event is fired.
         * @return {IRemoveListener} A method for removing the listener. 
         */
        on(name: 'beforeNavigate', listener: (ev: events.INavigationEvent<any, any, navigation.IBaseNavigator>) => void): IRemoveListener;
        /**
         * Registers a listener for a navigating event. The listener will be called when a navigating 
         * event is propagating over the app. Any number of listeners can exist for a single event name. 
         * This event is cancelable using the ev.cancel() method, and thereby preventing the navigation.
         * 
         * @param name='navigating' The name of the event, cooinciding with the navigating event.
         * @param listener The method called when the navigating event is fired.
         * @return {IRemoveListener} A method for removing the listener. 
         */
        on(name: 'navigating', listener: (ev: events.INavigationEvent<any, any, navigation.IBaseNavigator>) => void): IRemoveListener;
        /**
         * Registers a listener for a navigated event. The listener will be called when a navigated 
         * event is propagating over the app. Any number of listeners can exist for a single event name. 
         * This event is not cancelable.
         * 
         * @param name='navigated' The name of the event, cooinciding with the navigated event.
         * @param listener The method called when the navigated event is fired.
         * @return {IRemoveListener} A method for removing the listener. 
         */
        on(name: 'navigated',
            listener: (ev: events.INavigationEvent<ui.IViewControl, any, navigation.IBaseNavigator>) => void): IRemoveListener;
        /**
         * Registers a listener for a routeChange event. The listener will be called when a routeChange event 
         * is propagating over the app. Any number of listeners can exist for a single event name.
         *
         * @param eventName='routeChange' This specifies that the listener is for a routeChange event.
         * @param listener The method called when the routeChange is fired. The route argument will contain 
         * a parsed route.
         * @return {IRemoveListener} A method for removing the listener.
         */
        on(name: 'routeChange', listener: (ev: events.INavigationEvent<any, any, web.IRouter>) => void): IRemoveListener;
        /**
         * Registers a listener for a NavigationEvent. The listener will be called when a NavigationEvent is 
         * propagating over the app. Any number of listeners can exist for a single event name.
         * 
         * @param name The name of the event, cooinciding with the NavigationEvent name.
         * @param listener The method called when the NavigationEvent is fired.
         * @return {IRemoveListener} A method for removing the listener.
         */
        on(name: string, listener: (ev: events.INavigationEvent<any, any, any>) => void): IRemoveListener;
        /**
         * Registers a listener for a DispatchEvent. The listener will be called when a DispatchEvent is 
         * propagating over the app. Any number of listeners can exist for a single event name.
         * 
         * @param name The name of the event, cooinciding with the DispatchEvent name.
         * @param listener The method called when the DispatchEvent is fired.
         * @return {IRemoveListener} A method for removing the listener.
         */
        on(name: string, listener: (ev: events.IDispatchEvent, ...args: any[]) => void): IRemoveListener;

        /**
         * Kicks off compilation of the DOM from the specified node. If no node is specified, 
         * the default start node is document.body. This method should be called from the app when 
         * using module loaders. If a module loader is in use, the app will delay loading until 
         * this method is called.
         * 
         * @param node The node where at which DOM compilation begins.
         */
        load(node?: Node);
    }

    /**
     * Interface for an object where every key has the same typed value.
     */
    export interface IObject<T> {
        [key: string]: T
    }
    
    /**
     * Defines a function that will halt further callbacks to a listener.
     * Equivalent to () => void.
     */
    export interface IRemoveListener {
        (): void;
    }

    App.start();
}
