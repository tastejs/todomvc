/** @license MIT License (c) copyright B Cavalier & J Hann */

/**
 * Licensed under the MIT License at:
 * http://www.opensource.org/licenses/mit-license.php
 */

(function(define){
define(['when'], function(when) {

	"use strict";

	function Lifecycle(config) {
		this._config = config;
	}

	Lifecycle.prototype = {
		startup: function(proxy) {
			return processLifecycle(proxy, this._config);
		},

		shutdown: function(proxy) {
			return processListeners('destroy', proxy, this._config);
		}
	};

	return Lifecycle;

	function processLifecycle(proxy, config) {
		return when.reduce(config.lifecycleSteps,
			function (unused, step) {
				return processFacets(step, proxy, config);
			}, proxy);
	}

	function processFacets(step, proxy, config) {
		var promises, options, name, spec, facets;
		promises = [];
		spec = proxy.spec;

		facets = config.facets;

		for (name in facets) {
			options = spec[name];
			if (options) {
				processStep(promises, facets[name], step, proxy, options, config.pluginApi);
			}
		}

		var d = when.defer();

		when.all(promises,
			function () {
				return when.chain(processListeners(step, proxy, config), d, proxy.target);
			},
			function (e) { d.reject(e); }
		);

		return d;
	}

	function processListeners(step, proxy, config) {
		var listeners, listenerPromises;

		listeners = config.listeners;
		listenerPromises = [];

		for (var i = 0; i < listeners.length; i++) {
			processStep(listenerPromises, listeners[i], step, proxy, {}, config.pluginApi);
		}

		return when.all(listenerPromises);
	}

	function processStep(promises, processor, step, proxy, options, pluginApi) {
		var facet, facetPromise;

		if (processor && processor[step]) {
			facetPromise = when.defer();
			promises.push(facetPromise);

			facet = Object.create(proxy);
			facet.options = options;
			processor[step](facetPromise.resolver, facet, pluginApi);
		}
	}


});
})(typeof define == 'function'
	// AMD
	? define
	// CommonJS
	: function(deps, factory) {
		module.exports = factory.apply(this, deps.map(function(x) {
			return require(x);
		}));
	}
);