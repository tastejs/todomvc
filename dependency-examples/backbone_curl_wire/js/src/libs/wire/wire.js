/**
 * @license Copyright (c) 2010-2011 Brian Cavalier
 * LICENSE: see the LICENSE.txt file. If file is missing, this file is subject
 * to the MIT License at: http://www.opensource.org/licenses/mit-license.php.
 */

//noinspection ThisExpressionReferencesGlobalObjectJS
/**
 * wire.js IOC Container
 */
(function(global, define){
define(['require', 'when', 'wire/base'], function(require, when, basePlugin) {

    "use strict";

    var VERSION, tos, arrayProto, apIndexOf, apSlice, rootSpec, rootContext, delegate, emptyObject,
        defer, chain, whenAll, isArray, indexOf, lifecycleSteps, undef;

    wire.version = VERSION = "0.7.5";

    rootSpec = global['wire'] || {};
    lifecycleSteps = ['create', 'configure', 'initialize', 'ready'];

    emptyObject = {};

    tos = Object.prototype.toString;

    arrayProto = Array.prototype;
    apSlice = arrayProto.slice;
    apIndexOf = arrayProto.indexOf;

    // Polyfills

    /**
     * Object.create
     */
    delegate = Object.create || createObject;

    /**
     * Array.isArray
     */
    isArray = Array.isArray || function (it) {
        return tos.call(it) == '[object Array]';
    };

    /**
     * Array.prototype.indexOf
     */
    indexOf = apIndexOf
            ? function (array, item) {
                return apIndexOf.call(array, item);
            }
            : function (array, item) {
                for (var i = 0, len = array.length; i < len; i++) {
                    if (array[i] === item) return i;
                }

                return -1;
            };

    emptyObject = {};

    // Local refs to when.js
    defer = when.defer;
    chain = when.chain;
    whenAll = when.all;

    /**
     * Helper to always return a promise
     * @param it anything
     */
    function promise(it) {
        return when.isPromise(it) ? it : when(it);
    }

    /**
     * Helper to reject a deferred when another is rejected
     * @param resolver {Object} resolver to reject
     */
    function chainReject(resolver) {
        return function (err) {
            resolver.reject(err);
        };
    }

    /**
     * Creates an already-rejected Deferred using err as the rejection reason
     * @param err anything - the rejection reason
     */
    function rejected(err) {
        var d = defer();
        d.reject(err);
        return d.promise;
    }

    /**
     * Abstract the platform's loader
     * @param moduleId {String} moduleId to load
     * @returns {Promise} a promise that resolves to the loaded module
     */
    function loadModule(moduleId) {
        // TODO: Choose loadModule implementation based on platform
        var deferred = defer();

        require([moduleId], deferred.resolve);

        return deferred.promise;
    }

    //
    // AMD Module API
    //

    /**
     * The top-level wire function that wires contexts as direct children
     * of the (possibly implicit) root context.  It ensures that the root
     * context has been wired before wiring children.
     *
     * @public
     *
     * @param spec {String|Array|*}
     */
    function wire(spec) {

        // If the root context is not yet wired, wire it first
        if (!rootContext) {
            rootContext = wireContext(rootSpec);
        }

        // Use the rootContext to wire all new contexts.
        return when(rootContext,
            function (root) {
                return root.wire(spec);
            }
        );
    }

    //
    // AMD loader plugin API
    //

    //noinspection JSUnusedLocalSymbols
    /**
     * AMD Loader plugin API
     * @param name {String} spec module id, or comma-separated list of module ids
     * @param require unused
     * @param callback {Function|Promise} callback to call or promise to resolve when wiring is completed
     * @param config unused
     */
    function amdLoad(name, require, callback, config) {
        var resolver = callback.resolve
            ? callback
            : {
                resolve: callback,
                reject: function (err) { throw err; }
            };

        // If it's a string, try to split on ',' since it could be a comma-separated
        // list of spec module ids
        chain(wire(name.split(',')), resolver);
    }

    wire.load = amdLoad;

    //
    // AMD Analyze/Build plugin API
    //
    // Separate builder plugin as per CommonJS LoaderPlugin spec:
    // http://wiki.commonjs.org/wiki/Modules/LoaderPlugin

    // plugin-builder: wire/cram/builder
    // cram v 0.2+ supports plugin-builder property
    wire['plugin-builder'] = 'wire/cram/builder';

    //
    // Private functions
    //

    /**
     * Creates a new context from the supplied specs, with the supplied parent context.
     * If specs is an {Array}, it may be a mixed array of string module ids, and object
     * literal specs.  All spec module ids will be loaded, and then all specs will be
     * merged from left-to-right (rightmost wins), and the resulting, merged spec will
     * be wired.
     *
     * @private
     *
     * @param specs {String|Array|*}
     * @param parent {Object} parent content
     *
     * @return {Promise} a promise for the new context
     */
    function wireContext(specs, parent) {
        // Do the actual wiring after all specs have been loaded
        function doWireContexts(spec) {
            return when(createScope(spec, parent),
                function (scope) {
                    return scope.objects;
                }
            );
        }

        return when(ensureAllSpecsLoaded(isArray(specs) ? specs : [specs]), doWireContexts);
    }
    
    /**
     * Given a mixed array of strings and non-strings, returns a promise that will resolve
     * to an array containing resolved modules by loading all the strings found in the
     * specs array as module ids
     * @private
     *
     * @param specs {Array} mixed array of strings and non-strings
     *
     * @returns {Promise} a promise that resolves to an array of resolved modules
     */
    function ensureAllSpecsLoaded(specs) {
        return when.reduce(specs, function(merged, module) {
            return isString(module)
                ? when(loadModule(module), function(spec) { return mixinSpec(merged, spec); })
                : mixinSpec(merged, module)
        }, {});
    }

    /**
     * Do the work of creating a new scope and fully wiring its contents
     * @private
     *
     * @param scopeDef {Object} The spec (or portion of a spec) to be wired into a new scope
     * @param parent {scope} scope to use as the parent, and thus from which to inherit
     *  plugins, components, etc.
     * @param [scopeName] {String} optional name for the new scope
     *
     * @return {Promise} a promise for the new scope
     */
    function createScope(scopeDef, parent, scopeName) {
        var scope, scopeParent, local, proxied, objects,
                pluginApi, resolvers, factories, facets, listeners, proxies,
                modulesToLoad, moduleLoadPromises,
                wireApi, modulesReady, scopeReady, scopeDestroyed,
                contextPromise, doDestroy;

        // Empty parent scope if none provided
        parent = parent || {};

        initFromParent(parent);
        initPluginApi();

        // TODO: Find a better way to load and scan the base plugin
        scanPlugin(basePlugin);

        contextPromise = initContextPromise(scopeDef, scopeReady);

        initWireApi(objects);

        createComponents(local, scopeDef);

        // Once all modules are loaded, all the components can finish
        ensureAllModulesLoaded();

        // Setup overwritable doDestroy so that this context
        // can only be destroyed once
        doDestroy = function () {
            // Retain a do-nothing doDestroy() func, in case
            // it is called again for some reason.
            doDestroy = function () {
            };

            return destroyContext();
        };

        // Return promise
        // Context will be ready when this promise resolves
        return scopeReady.promise;

        //
        // Initialization
        //

        function initFromParent(parent) {
            local = {};

            // Descend scope and plugins from parent so that this scope can
            // use them directly via the prototype chain
            objects = delegate(parent.objects || {});
            resolvers = delegate(parent.resolvers || {});
            factories = delegate(parent.factories || {});
            facets = delegate(parent.facets || {});

            // Set/override integral resolvers and factories
            resolvers.wire   = wireResolver;

            factories.module = moduleFactory;
            factories.create = instanceFactory;
            factories.wire   = wireFactory;
            
            listeners = delegateArray(parent.listeners);// ? [].concat(parent.listeners) : [];

            // Proxies is an array, have to concat
            proxies = delegateArray(parent.proxies);// ? [].concat(parent.proxies) : [];
            proxied = [];

            modulesToLoad = [];
            moduleLoadPromises = {};
            modulesReady = defer();

            scopeReady = defer();
            scopeDestroyed = defer();

            // A proxy of this scope that can be used as a parent to
            // any child scopes that may be created.
            scopeParent = {
                name: scopeName,
                objects: objects,
                destroyed: scopeDestroyed
            };

            // Full scope definition.  This will be given to sub-scopes,
            // but should never be given to child contexts
            scope = delegate(scopeParent);

            scope.local = local;
            scope.resolvers = resolvers;
            scope.factories = factories;
            scope.facets = facets;
            scope.listeners = listeners;
            scope.proxies = proxies;
            scope.resolveRef = doResolveRef;
            scope.destroy = destroy;
            scope.path = createPath(scopeName, parent.path);

            // When the parent begins its destroy phase, this child must
            // begin its destroy phase and complete it before the parent.
            // The context hierarchy will be destroyed from child to parent.
            if (parent.destroyed) {
                when(parent.destroyed, destroy);
            }
        }

        function initWireApi(objects) {
            wireApi = objects.wire = wireChild;
            wireApi.destroy = objects.destroy = apiDestroy;

            // Consider deprecating resolve
            // Any reference you could resolve using this should simply be
            // injected instead.
            wireApi.resolve = objects.resolve = apiResolveRef;
        }

        function initPluginApi() {
            // Plugin API
            // wire() API that is passed to plugins.
            pluginApi = function (spec, name, path) {
                // FIXME: Why does returning when(item) here cause
                // the resulting, returned promise never to resolve
                // in wire-factory1.html?
                return promise(createItem(spec, createPath(name, path)));
            };

            pluginApi.resolveRef = apiResolveRef;
        }

        function initContextPromise(scopeDef, scopeReady) {
            var promises = [];

            // Setup a promise for each item in this scope
            for (var name in scopeDef) {
                if (scopeDef.hasOwnProperty(name)) {
                    promises.push(local[name] = objects[name] = defer());
                }
            }

            // When all scope item promises are resolved, the scope
            // is resolved.
            // When this scope is ready, resolve the contextPromise
            // with the objects that were created
            return whenAll(promises,
                function () {
                    scopeReady.resolve(scope);
                    return objects;
                },
                chainReject(scopeReady)
            );
        }

        //
        // Context Startup
        //

        function createComponents(names, scopeDef) {
            // Process/create each item in scope and resolve its
            // promise when completed.
            for (var name in names) {
                // No need to check hasOwnProperty since we know names
                // only contains scopeDef's own prop names.
                createScopeItem(name, scopeDef[name], objects[name]);
            }
        }

        function ensureAllModulesLoaded() {
            // Once all modules have been loaded, resolve modulesReady
            whenAll(modulesToLoad, function (modules) {
                modulesReady.resolve(modules);
                moduleLoadPromises = modulesToLoad = null;
            });
        }

        //
        // Context Destroy
        //

        function destroyContext() {
            var p, promises, pDeferred, i;

            scopeDestroyed.resolve();

            // TODO: Clear out the context prototypes?

            promises = [];
            for (i = 0; (p = proxied[i++]);) {
                pDeferred = defer();
                promises.push(pDeferred);
                processListeners(pDeferred, 'destroy', p);
            }

            // *After* listeners are processed,
            whenAll(promises, function () {
                function deleteAll(container) {
                    for(var p in container) delete container[p];
                }
                
                deleteAll(local);
                deleteAll(objects);
                deleteAll(scope);

                var p, i;

                for (i = 0; (p = proxied[i++]);) {
                    p.destroy();
                }

                // Free Objects
                local = objects = scope = proxied = proxies = parent
                        = resolvers = factories = facets = wireApi = undef;
                // Free Arrays
                listeners = undef;
            });

            return scopeDestroyed;
        }

        //
        // Context API
        //

        // API of a wired context that is returned, via promise, to
        // the caller.  It will also have properties for all the
        // objects that were created in this scope.

        /**
         * Resolves a reference in the current context, using any reference resolvers
         * available in the current context
         *
         * @param ref {String} reference name (may contain resolver prefix, e.g. "resolver!refname"
         */
        function apiResolveRef(ref) {
            return when(doResolveRef(ref));
        }

        /**
         * Destroys the current context
         */
        function apiDestroy() {
            return destroy();
        }

        /**
         * Wires a child spec with this context as its parent
         * @param spec
         */
        function wireChild(spec) {
            return wireContext(spec, scopeParent);
        }

        //
        // Scope functions
        //

        function createPath(name, basePath) {
            var path = basePath || scope.path;

            return (path && name) ? (path + '.' + name) : name;
        }

        function createScopeItem(name, val, itemPromise) {
            // NOTE: Order is important here.
            // The object & local property assignment MUST happen before
            // the chain resolves so that the concrete item is in place.
            // Otherwise, the whole scope can be marked as resolved before
            // the final item has been resolved.
            var p = createItem(val, name);

            return when(p, function (resolved) {
                objects[name] = local[name] = resolved;
                itemPromise.resolve(resolved);
            }, chainReject(itemPromise));
        }

        function createItem(val, name) {
            var created;

            if (isRef(val)) {
                // Reference
                created = resolveRef(val, name);

            } else if (isArray(val)) {
                // Array
                created = createArray(val, name);

            } else if (isStrictlyObject(val)) {
                // Module or nested scope
                created = createModule(val, name);

            } else {
                // Plain value
                created = val;
            }

            return created;
        }

        function getModule(moduleId, spec) {
            var module, loadPromise;

            if (isString(moduleId)) {
                var m = moduleLoadPromises[moduleId];

                if (!m) {
                    modulesToLoad.push(moduleId);
                    m = moduleLoadPromises[moduleId] = {
                        id: moduleId,
                        deferred: defer()
                    };

                    moduleLoadPromises[moduleId] = m;
                    loadPromise = when(loadModule(moduleId), function (module) {
                        scanPlugin(module, spec);
                        chain(modulesReady, m.deferred, module);
                    });

                    modulesToLoad.push(loadPromise);
                }

                module = m.deferred;

            } else {
                module = moduleId;
                scanPlugin(module);
            }

            return module;
        }

        function scanPlugin(module, spec) {
            if (module && isFunction(module.wire$plugin)) {
                var plugin = module.wire$plugin(contextPromise, scopeDestroyed.promise, spec);
                if (plugin) {
                    addPlugin(plugin.resolvers, resolvers);
                    addPlugin(plugin.factories, factories);
                    addPlugin(plugin.facets, facets);

                    listeners.push(plugin);

                    addProxies(plugin.proxies);
                }
            }
        }

        function addProxies(proxiesToAdd) {
            if (!proxiesToAdd) return;

            var newProxies, p, i = 0;

            newProxies = [];
            while (p = proxiesToAdd[i++]) {
                if (indexOf(proxies, p) < 0) {
                    newProxies.push(p)
                }
            }

            scope.proxies = proxies = newProxies.concat(proxies);
        }

        function addPlugin(src, registry) {
            for (var name in src) {
                if (registry.hasOwnProperty(name)) {
                    throw new Error("Two plugins for same type in scope: " + name);
                }

                registry[name] = src[name];
            }
        }

        function createArray(arrayDef, name) {
            // Minor optimization, if it's an empty array spec, just return
            // an empty array.
            return arrayDef.length
                    ? when.map(arrayDef, function(item) {
                        return createItem(item, name + '[]');
                    })
                    : [];
        }

        function createModule(spec, name) {

            // Look for a factory, then use it to create the object
            return when(findFactory(spec),
                    function (factory) {
                        var factoryPromise = defer();

                        if (!spec.id) spec.id = name;

                        factory(factoryPromise.resolver, spec, pluginApi);

                        return processObject(factoryPromise, spec);
                    },
                    function () {
                        // No factory found, treat object spec as a nested scope
                        return when(createScope(spec, scope, name),
                            function (created) {
                                // Return *only* the objects, and none of the
                                // other scope stuff (like plugins, promises etc)
                                return created.local;
                            },
                            rejected
                        );
                    }
            );
        }

        function findFactory(spec) {

            // FIXME: Should not have to wait for all modules to load,
            // but rather only the module containing the particular
            // factory we need.  But how to know which factory before
            // they are all loaded?
            // Maybe need a special syntax for factories, something like:
            // create: "factory!whatever-arg-the-factory-takes"
            // args: [factory args here]

            function getFactory() {
                var f, factory;

                for (f in factories) {
                    if (spec.hasOwnProperty(f)) {
                        factory = factories[f];
                        break;
                    }
                }

                // Intentionally returns undefined if no factory found
                return factory;
            }
            
            return getFactory() || when(modulesReady, function () {
                return getFactory() || rejected(spec);
            });
        }

        /**
         * When the target component has been created, create its proxy,
         * then push it through all its lifecycle stages.
         *
         * @private
         *
         * @param target the component being created, may be a promise
         * @param spec the component's spec (the portion of the overall spec used to
         *  create the target component)
         *
         * @returns {Promise} a promise for the fully wired component
         */
        function processObject(target, spec) {

            return when(target,
                function (object) {

                    var proxy = createProxy(object, spec);
                    proxied.push(proxy);

                    // Push the object through the lifecycle steps, processing
                    // facets at each step.
                    return when.reduce(lifecycleSteps,
                            function (object, step) {
                                return processFacets(step, proxy);
                            }, proxy);
                }, rejected);
        }

        function createProxy(object, spec) {
            var proxier, proxy, id, i;

            i = 0;
            id = spec.id;

            while ((proxier = proxies[i++]) && !(proxy = proxier(object, spec))) {}

            proxy.target = object;
            proxy.spec = spec;
            proxy.id = id;
            proxy.path = createPath(id);

            return proxy;
        }

        function processFacets(step, proxy) {
            var promises, options, name, spec;
            promises = [];
            spec = proxy.spec;

            for (name in facets) {
                options = spec[name];
                if (options) {
                    processStep(promises, facets[name], step, proxy, options);
                }
            }

            var d = defer();

            whenAll(promises,
                function () { processListeners(d, step, proxy); },
                chainReject(d)
            );

            return d;
        }

        function processListeners(promise, step, proxy) {
            var listenerPromises = [];
            for (var i = 0; i < listeners.length; i++) {
                processStep(listenerPromises, listeners[i], step, proxy);
            }

            // FIXME: Use only proxy here, caller should resolve target
            return chain(whenAll(listenerPromises), promise, proxy.target);
        }

        function processStep(promises, processor, step, proxy, options) {
            var facet, facetPromise;

            if (processor && processor[step]) {
                facetPromise = defer();
                promises.push(facetPromise);

                facet = delegate(proxy);
                facet.options = options;
                processor[step](facetPromise.resolver, facet, pluginApi);
            }
        }

        //
        // Built-in Factories
        //

        /**
         * Factory that loads an AMD module
         *
         * @param resolver {Resolver} resolver to resolve with the created component
         * @param spec {Object} portion of the spec for the component to be created
         */
        function moduleFactory(resolver, spec /*, wire */) {
            chain(getModule(spec.module, spec), resolver);
        }

        /**
         * Factory that uses an AMD module either directly, or as a
         * constructor or plain function to create the resulting item.
         *
         * @param resolver {Resolver} resolver to resolve with the created component
         * @param spec {Object} portion of the spec for the component to be created
         */
        function instanceFactory(resolver, spec /*, wire */) {
            var fail, create, module, args, isConstructor, name;

            fail = chainReject(resolver);
            name = spec.id;

            create = spec.create;
            if (isStrictlyObject(create)) {
                module = create.module;
                args = create.args;
                isConstructor = create.isConstructor;
            } else {
                module = create;
            }

            // Load the module, and use it to create the object
            function handleModule(module) {
                function resolve(resolvedArgs) {
                    try {
                        var instantiated = instantiate(module, resolvedArgs, isConstructor);
                        resolver.resolve(instantiated);
                    } catch (e) {
                        resolver.reject(e);
                    }
                }

                try {
                    // We'll either use the module directly, or we need
                    // to instantiate/invoke it.
                    if (isFunction(module)) {
                        // Instantiate or invoke it and use the result
                        if (args) {
                            args = isArray(args) ? args : [args];
                            when(createArray(args, name), resolve, fail);

                        } else {
                            // No args, don't need to process them, so can directly
                            // insantiate the module and resolve
                            resolve([]);

                        }

                    } else {
                        // Simply use the module as is
                        resolver.resolve(module);

                    }
                } catch (e) {
                    fail(e);
                }
            }

            when(getModule(module, spec), handleModule, fail);
        }

        /**
         * Factory that creates either a child context, or a *function* that will create
         * that child context.  In the case that a child is created, this factory returns
         * a promise that will resolve when the child has completed wiring.
         *
         * @param resolver {Resolver} resolver to resolve with the created component
         * @param spec {Object} portion of the spec for the component to be created
         */
        function wireFactory(resolver, spec/*, wire, name*/) {
            var options, module, defer;

            options = spec.wire;

            // Get child spec and options
            if (isString(options)) {
                module = options;
            } else {
                module = options.spec;
                defer = options.defer;
            }

            function createChild(/** {Object|String}? */ mixin) {
                var toWire = mixin ? [].concat(module, mixin) : module;
                return wireChild(toWire);
            }

            if (defer) {
                // Resolve with the createChild *function* itself
                // which can be used later to wire the spec
                resolver.resolve(createChild);
            } else {
                // Start wiring the child
                var context = createChild();

                // Resolve immediately with the child promise
                resolver.resolve(context);
            }
        }

        //
        // Reference resolution
        //

        function resolveRef(ref, name) {
            var refName = ref.$ref;

            return doResolveRef(refName, ref, name == refName);
        }

        function doResolveRef(refName, refObj, excludeSelf) {
            var promise, registry;

            registry = excludeSelf ? parent.objects : objects;

            if (refName in registry) {
                promise = registry[refName];

            } else {
                var split;

                promise = defer();
                split = refName.indexOf('!');

                if (split > 0) {
                    var resolverName = refName.substring(0, split);
                    refName = refName.substring(split + 1);
                    // Wait for modules, since the reference may need to be
                    // resolved by a resolver plugin
                    when(modulesReady, function () {

                        var resolver = resolvers[resolverName];
                        if (resolver) {
                            resolver(promise, refName, refObj, pluginApi);

                        } else {
                            promise.reject("No resolver found for ref: " + refName);

                        }
                    });

                } else {
                    promise.reject("Cannot resolve ref: " + refName);
                }

            }

            return promise;
        }

        /**
         * Builtin reference resolver that resolves to the context-specific
         * wire function.
         *
         * @param resolver {Resolver} resolver to resolve
         */
        function wireResolver(resolver /*, name, refObj, wire*/) {
            resolver.resolve(wireApi);
        }

        //
        // Destroy
        //

        /**
         * Destroy the current context.  Waits for the context to finish
         * wiring and then immediately destroys it.
         *
         * @return {Promise} a promise that will resolve once the context
         * has been destroyed
         */
        function destroy() {
            return when(scopeReady, doDestroy, doDestroy);
        }

    } // createScope

    /**
     * Add components in from to those in to.  If duplicates are found, it
     * is an error.
     * @param to {Object} target object
     * @param from {Object} source object
     */
    function mixinSpec(to, from) {
        for (var name in from) {
            if (from.hasOwnProperty(name) && !(name in emptyObject)) {
                if (to.hasOwnProperty(name)) {
                    throw new Error("Duplicate component name in sibling specs: " + name);
                } else {
                    to[name] = from[name];
                }
            }
        }

        return to;
    }

    function isRef(it) {
        return it && it.$ref;
    }

    function isString(it) {
        return typeof it == 'string';
    }

    function isStrictlyObject(it) {
        // In IE7 tos.call(null) is '[object Object]'
        // so we need to check to see if 'it' is
        // even set
        return (it && tos.call(it) == '[object Object]');
    }

    /**
     * Standard function test
     * @param it
     */
    function isFunction(it) {
        return typeof it == 'function';
    }

    /**
     * Creates a new {Array} with the same contents as array
     * @param array {Array}
     * @return {Array} a new {Array} with the same contents as array. If array is falsey,
     *  returns a new empty {Array}
     */
    function delegateArray(array) {
        return array ? [].concat(array) : [];
    }

    // In case Object.create isn't available
    function T() {
    }

    /**
     * Object.create shim
     * @param prototype
     */
    function createObject(prototype) {
        T.prototype = prototype;
        return new T();
    }

    /**
     * Constructor used to beget objects that wire needs to create using new.
     * @param ctor {Function} real constructor to be invoked
     * @param args {Array} arguments to be supplied to ctor
     */
    function Begetter(ctor, args) {
        return ctor.apply(this, args);
    }

    /**
     * Creates an object by either invoking ctor as a function and returning the result,
     * or by calling new ctor().  It uses a simple heuristic to try to guess which approach
     * is the "right" one.
     *
     * @param ctor {Function} function or constructor to invoke
     * @param args {Array} array of arguments to pass to ctor in either case
     *
     * @returns The result of invoking ctor with args, with or without new, depending on
     * the strategy selected.
     */
    function instantiate(ctor, args, forceConstructor) {

        if (forceConstructor || isConstructor(ctor)) {
            Begetter.prototype = ctor.prototype;
            Begetter.prototype.constructor = ctor;
            return new Begetter(ctor, args);
        } else {
            return ctor.apply(null, args);
        }
    }

    /**
     * Determines with the supplied function should be invoked directly or
     * should be invoked using new in order to create the object to be wired.
     *
     * @param func {Function} determine whether this should be called using new or not
     *
     * @returns true iff func should be invoked using new, false otherwise.
     */
    function isConstructor(func) {
        var is = false, p;
        for (p in func.prototype) {
            if (p !== undef) {
                is = true;
                break;
            }
        }

        return is;
    }

    return wire;
});
})(this,
    typeof define == 'function'
    // use define for AMD if available
    ? define
    // Browser
    // If no define or module, attach to current context.
    : function(deps, factory) {
        this.wire = factory(
            // Fake require()
            function(modules, callback) { callback(modules); },
            // dependencies
            this.when, this.wire_base
        );
    }
    // NOTE: Node not supported yet, coming soon
);
