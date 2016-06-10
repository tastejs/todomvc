/** @license MIT License (c) copyright B Cavalier & J Hann */

/**
 * Licensed under the MIT License at:
 * http://www.opensource.org/licenses/mit-license.php
 *
 * @author brian@hovercraftstudios.com
 */

(function(define) { 'use strict';
define(function(require) {

	var when, defer, sequence, array, object, loader,
		ComponentFactory, Lifecycle, Resolver, WireProxy, PluginRegistry,
		undef;

	when = require('when');
	sequence = require('when/sequence');
	array = require('./array');
	object = require('./object');
	loader = require('./loader');
	ComponentFactory = require('./ComponentFactory');
	Lifecycle = require('./lifecycle');
	Resolver = require('./resolver');
	WireProxy = require('./WireProxy');
	PluginRegistry = require('./plugin/registry');

	defer = when.defer;

	function Scope(parent, options) {
		this.parent = parent||{};
		object.mixin(this, options);
	}

	Scope.prototype = {

		init: function(spec) {

			this._inherit(this.parent);
			this._init();
			this._configure();

			return this._startup(spec).yield(this);
		},

		_inherit: function(parent) {

			this.instances = this._inheritInstances(parent);
			this.components = object.inherit(parent.components);

			this.path = this._createPath(this.name, parent.path);

			this.plugins = parent.plugins;

			this.initializers = array.delegate(this.initializers);
			this.destroyers = array.delegate(this.destroyers);

			this.moduleLoader = loader(this.require, parent.moduleLoader).load;
		},

		_inheritInstances: function(parent) {
			return object.inherit(parent.instances);
		},

		_createChild: function(spec, options) {
			// Create child and arrange for it to be destroyed just before
			// this scope is destroyed
			var destroyTasks = this.destroyers;
			return this.createContext(spec, this, options).then(
				function(child) {
					destroyTasks.push(function() {
						return child.destroy();
					});
					return child;
				}
			);
		},

		_init: function() {
			this._pluginApi = this._initPluginApi();
		},

		_initPluginApi: function() {
			// Plugin API
			// wire() API that is passed to plugins.
			var self, pluginApi;

			self = this;
			pluginApi = {};

			pluginApi.contextualize = function(name) {
				function contextualApi(spec, id) {
					return self._resolveItem(self._createComponentDef(id, spec));
				}

				contextualApi.createChild = self._createChild.bind(self);
				contextualApi.loadModule = self.getModule.bind(self);
				contextualApi.resolver = self.resolver;
				contextualApi.addComponent = addComponent;
				contextualApi.addInstance = addInstance;

				contextualApi.resolveRef = function(ref) {
					var onBehalfOf = arguments.length > 1 ? arguments[2] : name;
					return self._resolveRef(ref, onBehalfOf);
				};

				contextualApi.getProxy = function(nameOrComponent) {
					var onBehalfOf = arguments.length > 1 ? arguments[2] : name;
					return self.getProxy(nameOrComponent, onBehalfOf);
				};

				return contextualApi;
			};

			return pluginApi;

			function addComponent(component, id) {
				var def, instance;

				def = self._createComponentDef(id);
				instance = self.componentFactory.processComponent(def, component);

				return self._makeResolvable(def, instance);
			}

			function addInstance(instance, id) {
				self._makeResolvable(self._createComponentDef(id), instance);
				return when.resolve(instance);
			}
		},

		_configure: function() {
			var plugins, pluginApi;

			plugins = this.plugins;
			pluginApi = this._pluginApi;

			this.resolver = this._createResolver(plugins, pluginApi);
			this.componentFactory = this._createComponentFactory(plugins, pluginApi);

			this._destroy = function() {
				this._destroy = noop;

				return this._executeDestroyers()
					.then(this._destroyComponents.bind(this))
					.then(this._releaseResources.bind(this));
			};
		},

		_startup: function(spec) {
			var self = this;

			return this._executeInitializers().then(function() {
				var parsed = self._parseSpec(spec);
				return self._createComponents(parsed).then(function() {
					return self._awaitInstances(parsed);
				});
			});
		},

		destroy: function() {
			return this._destroy();
		},

		_destroy: noop,

		_destroyComponents: function() {
			var instances = this.instances;

			return this.componentFactory.destroy().then(function() {
				for (var p in  instances) {
					delete instances[p];
				}
			});
		},

		_releaseResources: function() {
			// Free Objects
			this.instances = this.components = this.parent
				= this.resolver = this.componentFactory
				= this._pluginApi = this.plugins
				= undef;
		},

		getModule: function(moduleId) {
			return typeof moduleId == 'string'
				? this.moduleLoader(moduleId)
				: when.resolve(moduleId);
		},

		getProxy: function(nameOrComponent, onBehalfOf) {
			var componentFactory = this.componentFactory;
			return typeof nameOrComponent == 'string'
				? when(this._resolveRefName(nameOrComponent, {}, onBehalfOf), function (component) {
					return componentFactory.createProxy(component);
				})
				: componentFactory.createProxy(nameOrComponent);
		},

		_createResolver: function(plugins, pluginApi) {
			return new Resolver(plugins.resolvers, pluginApi);
		},

		_createComponentFactory: function(plugins, pluginApi) {
			var self, factory, init, lifecycle;

			self = this;

			lifecycle = new Lifecycle(plugins, pluginApi);
			factory = new ComponentFactory(lifecycle, plugins, pluginApi);

			init = factory.initInstance;
			factory.initInstance = function() {
				return when(init.apply(factory, arguments), function(proxy) {
					return self._makeResolvable(proxy.metadata, proxy);
				});
			};

			return factory;
		},

		_executeInitializers: function() {
			return sequence(this.initializers, this);
		},

		_executeDestroyers: function() {
			return sequence(this.destroyers, this);
		},

		_parseSpec: function(spec) {
			var instances, components, plugins, id, d;

			instances = this.instances;
			components = {};

			// Setup a promise for each item in this scope
			for (id in spec) {
				if(id === '$plugins' || id === 'plugins') {
					plugins = spec[id];
				} else if (!object.hasOwn(instances, id)) {
					// An initializer may have inserted concrete components
					// into the context.  If so, they override components of the
					// same name from the input spec
					d = defer();
					components[id] = this._createComponentDef(id, spec[id], d.resolver);
					instances[id] = d.promise;
				}
			}

			return {
				plugins: plugins,
				components: components,
				instances: instances
			};
		},

		_createComponentDef: function(id, spec, resolver) {
			return {
				id: id,
				spec: spec,
				path: this._createPath(id, this.path),
				resolver: resolver
			};
		},

		_createComponents: function(parsed) {
			// Process/create each item in scope and resolve its
			// promise when completed.
			var self, components;

			self = this;
			components = parsed.components;
			return when.map(Object.keys(components), function(name) {
				return self._createScopeItem(components[name]);
			});
		},

		_awaitInstances: function(parsed) {
			var instances = parsed.instances;
			return when.map(Object.keys(instances), function(id) {
				return instances[id];
			});
		},

		_createScopeItem: function(component) {
			// NOTE: Order is important here.
			// The object & local property assignment MUST happen before
			// the chain resolves so that the concrete item is in place.
			// Otherwise, the whole scope can be marked as resolved before
			// the final item has been resolved.
			var self, item;

			self = this;
			item = this._resolveItem(component).then(function (resolved) {
				self._makeResolvable(component, resolved);
				return resolved;
			});

			component.resolver.resolve(item);
			return item;
		},

		_makeResolvable: function(component, instance) {
			var id = component.id;
			if(id != null) {
				this.instances[id] = WireProxy.getTarget(instance);
			}

			return instance;
		},

		_resolveItem: function(component) {
			var item, spec;

			spec = component.spec;

			if (this.resolver.isRef(spec)) {
				// Reference
				item = this._resolveRef(spec, component.id);
			} else {
				// Component
				item = this._createItem(component);
			}

			return item;
		},

		_createItem: function(component) {
			var created, spec;

			spec = component.spec;

			if (Array.isArray(spec)) {
				// Array
				created = this._createArray(component);

			} else if (object.isObject(spec)) {
				// component spec, create the component
				created = this._createComponent(component);

			} else {
				// Plain value
				created = when.resolve(spec);
			}

			return created;
		},

		_createArray: function(component) {
			var self, id, i;

			self = this;
			id = component.id;
			i = 0;

			// Minor optimization, if it's an empty array spec, just return an empty array.
			return when.map(component.spec, function(item) {
				var componentDef = self._createComponentDef(id + '[' + (i++) + ']', item);
				return self._resolveItem(componentDef);
			});
		},

		_createComponent: function(component) {
			var self = this;

			return this.componentFactory.create(component)
				.otherwise(function (reason) {
					if(reason !== component) {
						throw reason;
					}

					// No factory found, treat object spec as a nested scope
					return new Scope(self)
						.init(component.spec)
						.then(function (childScope) {
							// TODO: find a lighter weight solution
							// We're paying the cost of creating a complete scope,
							// then discarding everything except the instance map.
							return object.mixin({}, childScope.instances);
						}
					);
				}
			);
		},

		_resolveRef: function(ref, onBehalfOf) {
			var scope;

			ref = this.resolver.parse(ref);
			scope = onBehalfOf == ref.name && this.parent.instances ? this.parent : this;

			return this._doResolveRef(ref, scope.instances, onBehalfOf);
		},

		_resolveRefName: function(refName, options, onBehalfOf) {
			var ref = this.resolver.create(refName, options);

			return this._doResolveRef(ref, this.instances, onBehalfOf);
		},

		_doResolveRef: function(ref, scope, onBehalfOf) {
			return ref.resolve(function (name) {
				return resolveDeepName(name, scope);
			}, onBehalfOf);
		},

		_createPath: function(name, basePath) {
			var path = basePath || this.path;
			return (path && name) ? (path + '.' + name) : name;
		}
	};

	return Scope;

	function resolveDeepName(name, scope) {
		var parts = name.split('.');

		if(parts.length > 2) {
			return when.reject('Only 1 "." is allowed in refs: ' + name);
		}

		return when.reduce(parts, function(scope, segment) {
			return segment in scope
				? scope[segment]
				: when.reject('Cannot resolve ref: ' + name);
		}, scope);
	}

	function noop() {}

});
})(typeof define == 'function' && define.amd ? define : function(factory) { module.exports = factory(require); }
);