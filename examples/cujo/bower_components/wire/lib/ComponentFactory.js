/** @license MIT License (c) copyright 2010-2013 original author or authors */

/**
 * Licensed under the MIT License at:
 * http://www.opensource.org/licenses/mit-license.php
 *
 * @author: Brian Cavalier
 * @author: John Hann
 */

(function(define) { 'use strict';
define(function(require) {

	var when, object, WireProxy, undef;

	when = require('when');
	object = require('./object');
	WireProxy = require('./WireProxy');

	function ComponentFactory(lifecycle, plugins, pluginApi) {
		this.plugins = plugins;
		this.pluginApi = pluginApi;
		this.lifecycle = lifecycle;
		this.proxies = [];
	}

	ComponentFactory.prototype = {

		create: function(component) {
			var found;

			// Look for a factory, then use it to create the object
			found = this.getFactory(component.spec);
			return found
				? this._create(component, found.factory, found.options)
				: when.reject(component);
		},

		_create: function(component, factory, options) {
			var instance, self;

			instance = when.defer();
			self = this;

			factory(instance.resolver, options,
				this.pluginApi.contextualize(component.id));

			return instance.promise.then(function(instance) {
				return self.processComponent(component, instance);
			});
		},

		processComponent: function(component, instance) {
			var self, proxy;

			self = this;
			proxy = this.createProxy(instance, component);

			return self.initInstance(proxy).then(
				function(proxy) {
					return self.startupInstance(proxy);
				}
			).then(WireProxy.getTarget);
		},

		initInstance: function(proxy) {
			return this.lifecycle.init(proxy);
		},

		startupInstance: function(proxy) {
			return this.lifecycle.startup(proxy);
		},

		createProxy: function(instance, component) {
			var proxy;

			if (WireProxy.isProxy(instance)) {
				proxy = instance;
				instance = WireProxy.getTarget(proxy);
			} else {
				proxy = WireProxy.create(instance);
			}

			if(component) {
				proxy.id = component.id;
				proxy.metadata = component;
			}

			return this.initProxy(proxy);
		},

		initProxy: function(proxy) {

			var proxiers = this.plugins.proxiers;

			// Allow proxy plugins to process/modify the proxy
			proxy = proxiers.reduce(
				function(proxy, proxier) {
					var overridden = proxier(proxy);
					return WireProxy.isProxy(overridden) ? overridden : proxy;
				},
				proxy
			);

			this._registerProxy(proxy);

			return proxy;

		},

		destroy: function() {
			var proxies, lifecycle;

			proxies = this.proxies;
			lifecycle = this.lifecycle;

			return shutdownComponents().then(destroyComponents);

			function shutdownComponents() {
				return when.reduce(proxies,
					function(_, proxy) { return lifecycle.shutdown(proxy); },
					undef);
			}

			function destroyComponents() {
				return when.reduce(proxies,
					function(_, proxy) { return proxy.destroy(); },
					undef);
			}
		},

		_registerProxy: function(proxy) {
			if(proxy.metadata) {
				proxy.path = proxy.metadata.path;
				this.proxies.push(proxy);
			}
		},

		getFactory: function(spec) {
			var f, factories, found;

			factories = this.plugins.factories;

			for (f in factories) {
				if (object.hasOwn(spec, f)) {
					found = {
						factory: factories[f],
						options: {
							options: spec[f],
							spec: spec
						}
					};
					break;
				}
			}

			// Intentionally returns undefined if no factory found
			return found;

		}
	};

	return ComponentFactory;

});
}(typeof define === 'function' && define.amd ? define : function(factory) { module.exports = factory(require); }));
