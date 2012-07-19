/** @license MIT License (c) copyright B Cavalier & J Hann */

/**
 * Licensed under the MIT License at:
 * http://www.opensource.org/licenses/mit-license.php
 */

(function(define){
define(['require', 'when', './array', './object', './moduleLoader', './lifecycle', './resolver', '../base'],
function(require, when, array, object, createModuleLoader, Lifecycle, Resolver, basePlugin) {

	"use strict";

	var lifecycleSteps,
		defer, chain, whenAll,
		emptyObject,
		undef;

	lifecycleSteps = ['create', 'configure', 'initialize', 'connect', 'ready'];

	// Local refs to when.js
	defer = when.defer;
	chain = when.chain;
	whenAll = when.all;

	emptyObject = {};

	function WireContext() {}

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
	function createContext(specs, parent, options) {
		// Do the actual wiring after all specs have been loaded
		function doWireContext(spec) {
			return createScope(spec, parent, options);
		}

		var moduleLoader = getModuleLoader(parent, options);

		return when(specs, function(specs) {
			return Array.isArray(specs)
				? when(ensureAllSpecsLoaded(specs, moduleLoader), doWireContext)
				: when(isString(specs) ? moduleLoader(specs) : specs, doWireContext);
		});
	}

	return createContext;

	function getModuleLoader(context, options) {
		return options && options.require
			? createModuleLoader(options.require)
			: context.moduleLoader;
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
	function ensureAllSpecsLoaded(specs, loadModule) {
		return when.reduce(specs, function(merged, module) {
			return isString(module)
				? when(loadModule(module), function(spec) { return safeMixin(merged, spec); })
				: safeMixin(merged, module)
		}, {});
	}

	/**
	 * Add components in from to those in to.  If duplicates are found, it
	 * is an error.
	 * @param to {Object} target object
	 * @param from {Object} source object
	 */
	function safeMixin(to, from) {
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

	/**
	 * Do the work of creating a new scope and fully wiring its contents
	 * @private
	 *
	 * @param scopeDef {Object} The spec (or portion of a spec) to be wired into a new scope
	 * @param parent {scope} scope to use as the parent, and thus from which to inherit
	 *  plugins, components, etc.
	 * @param [options] {Object} scope options
	 *
	 * @return {Promise} a promise for the new scope
	 */
	function createScope(scopeDef, parent, options) {
		var scope, scopeParent, config, contextHandlers,
			proxiedComponents, components, lifecycle, resolver,
			pluginApi, resolvers, factories, facets, listeners, proxiers,
			moduleLoader, modulesToLoad, plugins,
			wireApi, modulesReady, scopeReady, scopeDestroyed, doDestroy;

		// Empty parent scope if none provided
		if(!parent) parent = {};
		if(!options) options = {};

		inheritFromParent(parent, options);
		createPluginApi();

		// TODO: Find a better way to load and scan the base plugin
		scanPlugin(basePlugin);

		configureContext(options);
		pluginApi.resolver = resolver;

		// Setup overwritable doDestroy so that this context
		// can only be destroyed once
		doDestroy = function () {
			// Retain a do-nothing doDestroy() func, in case
			// it is called again for some reason.
			doDestroy = function () {
			};

			return when(destroyContext(), executeDestroyers);
		};

		function executeInitializers() {
			return sequence(contextHandlers.init, components, scopeDef);
		}
		function executeDestroyers() {
			return sequence(contextHandlers.destroy, components, scopeDef);
		}

		return when(executeInitializers(), function() {

			parseSpec(scopeDef, scopeReady);

			createComponents(scopeDef);

			// Once all modules are loaded, all the components can finish
			ensureAllModulesLoaded();

			// Return promise
			// Context will be ready when this promise resolves
			return scopeReady.promise;

		});

		//
		// Initialization
		//

		function inheritFromParent(parent, options) {
			// Descend scope and plugins from parent so that this scope can
			// use them directly via the prototype chain

			WireContext.prototype = createWireApi(object.inherit(parent.components));
			components = new WireContext();
			WireContext.prototype = undef;

			resolvers = object.inherit(parent.resolvers);
			factories = object.inherit(parent.factories);
			facets = object.inherit(parent.facets);

			// Set/override integral resolvers and factories
			resolvers.wire = wireResolver;
			factories.wire = wireFactory;

			listeners = array.delegate(parent.listeners);

			// Proxies is an array, have to concat
			proxiers = array.delegate(parent.proxiers);
			proxiedComponents = [];

			plugins = [];
			modulesToLoad = [];
			modulesReady = defer();

			scopeReady = defer();
			scopeDestroyed = defer();

			moduleLoader = getModuleLoader(parent, options);

			// A proxy of this scope that can be used as a parent to
			// any child scopes that may be created.
			scopeParent = {
				moduleLoader: moduleLoader,
				components: components,
				destroyed: scopeDestroyed
			};

			// Full scope definition.  This will be given to sub-scopes,
			// but should never be given to child contexts
			scope = Object.create(scopeParent);

			scope.resolvers = resolvers;
			scope.factories = factories;
			scope.facets = facets;
			scope.listeners = listeners;
			scope.proxiers = proxiers;
			scope.resolveRef = resolveRefName;
			scope.destroy = destroy;
			scope.path = createPath(options.name, parent.path);

			// When the parent begins its destroy phase, this child must
			// begin its destroy phase and complete it before the parent.
			// The context hierarchy will be destroyed from child to parent.
			if (parent.destroyed) {
				when(parent.destroyed, destroy);
			}
		}

		function createWireApi(context) {
			wireApi = context.wire = wireChild;
			wireApi.destroy = context.destroy = apiDestroy;

			// Consider deprecating resolve
			// Any reference you could resolve using this should simply be
			// injected instead.
			wireApi.resolve = context.resolve = apiResolveRef;

			return context;
		}

		function createPluginApi() {
			// Plugin API
			// wire() API that is passed to plugins.
			pluginApi = function (spec, name, path) {
				return when(createItem(spec, createPath(name, path)), getResolvedValue);
			};

			pluginApi.resolveRef = apiResolveRef;
			pluginApi.getProxy = getProxy;
			pluginApi.loadModule = getModule;
		}

		function configureContext(options) {
			// TODO: This configuration object needs to be abstracted and reused
			config = {
				lifecycleSteps: lifecycleSteps,
				pluginApi: pluginApi,
				resolvers: resolvers,
				facets: facets,
				listeners: listeners
			};

			lifecycle = new Lifecycle(config);
			resolver = new Resolver(config);

			contextHandlers = {
				init: array.delegate(options.init),
				destroy: array.delegate(options.destroy)
			};
		}

		function parseSpec(scopeDef, scopeReady) {
			var promises = [];

			// Setup a promise for each item in this scope
			for (var name in scopeDef) {
				promises.push(components[name] = defer());
			}

			// When all scope item promises are resolved, the scope
			// is ready. When this scope is ready, resolve the promise
			// with the objects that were created
			chain(whenAll(promises), scopeReady, components);
		}

		//
		// Context Startup
		//

		function createComponents(scopeDef) {
			// Process/create each item in scope and resolve its
			// promise when completed.
			for (var name in scopeDef) {
				createScopeItem(name, scopeDef[name], components[name]);
			}
		}

		function ensureAllModulesLoaded() {
			// Once all modules have been loaded, resolve modulesReady
			whenAll(modulesToLoad, function (modules) {
				modulesReady.resolve(modules);
				modulesToLoad = null;
			}, modulesReady.reject);
		}

		//
		// Context Destroy
		//

		function destroyContext() {
			var promises, i, len;

			scopeDestroyed.resolve();

			// TODO: Clear out the context prototypes?

			promises = [];

			for(i = 0, len = proxiedComponents.length; i < len; i++) {
				promises.push(lifecycle.shutdown(proxiedComponents[i]));
			}

			// *After* listeners are processed,
			return whenAll(promises, function () {
				var i, len;

				function deleteAll(container) {
					for(var p in container) delete container[p];
				}

				deleteAll(components);
				deleteAll(scope);

				for(i = 0, len = proxiedComponents.length; i < len; i++) {
					proxiedComponents[i].destroy();
				}

				// Free Objects
				components = scope = parent
					= resolvers = factories = facets = listeners
					= wireApi = proxiedComponents = proxiers = plugins
					= undef;

				return scopeDestroyed;
			});
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
			return when(resolveRefName(ref));
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
		function wireChild(spec, options) {
			return createContext(spec, scopeParent, options);
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
				components[name] = getResolvedValue(resolved);
				itemPromise.resolve(resolved);
			}, chainReject(itemPromise));
		}

		function createItem(val, name) {
			var created;

			if (resolver.isRef(val)) {
				// Reference
				created = resolveRef(val, name);

			} else if (Array.isArray(val)) {
				// Array
				created = createArray(val, name);

			} else if (object.isObject(val)) {
				// Module or nested scope
				created = createModule(val, name);

			} else {
				// Plain value
				created = val;
			}

			return created;
		}

		function getModule(moduleId, spec) {
			var module;

			function scanPluginWhenLoaded(loadModulePromise, moduleReadyResolver) {

				var loadPromise = when(loadModulePromise, function (module) {
					return when(scanPlugin(module, spec), function() {
						chain(modulesReady, moduleReadyResolver, module);
					});
				}, moduleReadyResolver.reject);

				modulesToLoad && modulesToLoad.push(loadPromise);

			}

			module = defer();
			scanPluginWhenLoaded(isString(moduleId) ? moduleLoader(moduleId) : moduleId, module);

			return module;
		}

		function scanPlugin(module, spec) {
			if (module && isFunction(module.wire$plugin) && plugins.indexOf(module.wire$plugin) === -1) {
				// Add to singleton plugins list to only allow one instance
				// of this plugin in the current context.
				plugins.push(module.wire$plugin);

				// Initialize the plugin for this context
				return when(module.wire$plugin(scopeReady.promise, scopeDestroyed.promise, spec),
					function(plugin) {
						plugin && registerPlugin(plugin);
					}
				);
			}

			return module;
		}

		function registerPlugin(plugin) {
			addPlugin(plugin.resolvers, resolvers);
			addPlugin(plugin.factories, factories);
			addPlugin(plugin.facets, facets);

			listeners.push(plugin);

			addProxies(plugin.proxies);
		}

		function addProxies(proxiesToAdd) {
			if (!proxiesToAdd) return;

			var newProxiers, p, i = 0;

			newProxiers = [];
			while (p = proxiesToAdd[i++]) {
				if (proxiers.indexOf(p) < 0) {
					newProxiers.push(p)
				}
			}

			scope.proxiers = proxiers = newProxiers.concat(proxiers);
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

					return when(factoryPromise, function(component) {
						return when(modulesReady, function() {
							return lifecycle.startup(createProxy(component, spec));
						});
					});
				},
				function () {
					// No factory found, treat object spec as a nested scope
					return createScope(spec, scope, { name: name });
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
				return getFactory() || when.reject(spec);
			});
		}

		function createProxy(object, spec) {
			var proxier, proxy, id, i;

			i = 0;

			while ((proxier = proxiers[i++]) && !(proxy = proxier(object, spec))) {}

			proxy.target = object;
			proxy.spec = spec;

			if(spec) {
				id = spec && spec.id;
				proxy.id = id;
				proxy.path = createPath(id);
				proxiedComponents.push(proxy);
			}

			return proxy;
		}

		function getProxy(nameOrComponent) {
			return typeof nameOrComponent != 'string'
				? createProxy(nameOrComponent)
				: when(resolveRefName(nameOrComponent), function(component) {
					return createProxy(component);
				});
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

		//
		// Reference resolution
		//

		/**
		 * Resolves the supplied ref as a local component name, or delegates
		 * to registered resolver plugins
		 * @param ref {Object} reference object returned by resolver.parse or resolver.create
		 * @param scope {Object} scope for resolving local component names
		 * @return {Promise} a promise for the fully resolved reference value
		 */
		function doResolveRef(ref, scope) {
			return (ref.name in scope)
				? scope[ref.name]
				: when(modulesReady, ref.resolve);
		}

		/**
		 * @param ref {*} any reference format supported by the registered resolver
		 * @param name {String} component name to which the the resolved value of the reference
		 *  will eventually be assigned.  Used to avoid self-circular references.
		 * @return {Promise} a promise for the fully resolved reference value
		 */
		function resolveRef(ref, name) {
			var scope;

			ref = resolver.parse(ref);
			scope = name == ref.name && parent.components ? parent.components : components;

			return doResolveRef(ref, scope);
		}

		/**
		 *
		 * @param refName {String} name of reference to resolve. Can be either a
		 *  component name, or a plugin-style reference, e.g. plugin!reference
		 * @param options {Object} additional options to pass to reference resolver
		 *  plugins if the refName requires a plugin to resolve
		 * @param scope {Object} scope for resolving local component names
		 * @return {Promise} a promise for the fully resolved reference value
		 */
		function resolveRefName(refName, options, scope) {
			return doResolveRef(resolver.create(refName, options), scope||components);
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
		// Built-in Factories
		//

		/**
		 * Factory that creates either a child context, or a *function* that will create
		 * that child context.  In the case that a child is created, this factory returns
		 * a promise that will resolve when the child has completed wiring.
		 *
		 * @param resolver {Resolver} resolver to resolve with the created component
		 * @param spec {Object} portion of the spec for the component to be created
		 */
		function wireFactory(resolver, spec, wire) {
			//
			// TODO: Move wireFactory to its own module
			//
			var options, module, get, provide, defer, waitParent;

			options = spec.wire;

			// Get child spec and options
			if (isString(options)) {
				module = options;
			} else {
				module = options.spec;
				waitParent = options.waitParent;
				defer = options.defer;
				get = options.get;
				provide = options.provide;
			}

			// Trying to use both get and defer is an error
			if(defer && get) {
				return resolver.reject("you can't use defer and get at the same time");
			}

			function init(components) {
				if(provide) {
					return when(wire(provide), function(provides) {
						safeMixin(components, provides);
					});
				}
			}

			function createChild(/** {Object|String}? */ mixin) {
				var spec = mixin ? [].concat(module, mixin) : module;

				return wireChild(spec, { init: init });
			}

			if (defer) {
				// Resolve with the createChild *function* itself
				// which can be used later to wire the spec
				resolver.resolve(createChild);

			} else if (get) {
				// Wire a new scope, and get a named component from it to use
				// as the component currently being wired.
				return when(createChild(spec), function(scope) {
					return resolveRefName(get, {}, scope);
				}).then(resolver.resolve, resolver.reject);

			} else if(waitParent) {

				var childPromise = when(scopeReady, function() {
					return createChild();
				});

				resolver.resolve(new ResolvedValue(childPromise));

			} else {
				resolver.resolve(createChild());

			}
		}

	} // createScope

	function isString(it) {
		return typeof it == 'string';
	}

	/**
	 * Standard function test
	 * @param it
	 */
	function isFunction(it) {
		return typeof it == 'function';
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
	 * Special object to hold a Promise that should not be resolved, but
	 * rather should be passed through a promise chain *as the resolution value*
	 * @param val
	 */
	function ResolvedValue(val) {
		this.valueOf = function() {
			return val;
		};
	}

	/**
	 * If it is a PromiseKeeper, return it.value, otherwise return it.  See
	 * PromiseKeeper above for an explanation.
	 * @param it anything
	 */
	function getResolvedValue(it) {
		return it instanceof ResolvedValue ? it.valueOf() : it;
	}

	/**
	 * Run the supplied async tasks in sequence, with no overlap.
	 * @param tasks {Array} array of functions
	 * @return {Promise} promise that resolves when all tasks
	 * have completed
	 */
	function sequence(tasks) {
		var args = array.fromArguments(arguments, 1);
		return when.reduce(tasks, function(context, task) {
			return when(task.apply(context, args), function() {
				return context;
			});
		}, undef);
	}

});
})(typeof define == 'function'
	// AMD
	? define
	// CommonJS
	: function(deps, factory) {
		module.exports = factory.apply(this, [require].concat(deps.slice(1).map(function(x) {
			return require(x);
		})));
	}
);