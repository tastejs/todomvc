/** @license MIT License (c) copyright B Cavalier & J Hann */

/**
 * Licensed under the MIT License at:
 * http://www.opensource.org/licenses/mit-license.php
 */

(function(define){
define(['when'], function(when) {

	"use strict";

	var lifecyclePhases, phase;

	lifecyclePhases = {
		init: generateSteps(['create', 'configure', 'initialize']),
		startup: generateSteps(['connect', 'ready']),
		shutdown: generateSteps(['destroy'])
	};

	function Lifecycle(config) {
		this._config = config;
	}

	// Generate prototype from lifecyclePhases
	for(phase in lifecyclePhases) {
		Lifecycle.prototype[phase] = createLifecyclePhase(phase);
	}

	return Lifecycle;

	/**
	 * Generate a method to process all steps in a lifecycle phase
	 * @param phase
	 * @return {Function}
	 */
	function createLifecyclePhase(phase) {
		var steps = lifecyclePhases[phase];

		return function(proxy) {
			var self = this;
			return when.reduce(steps, function (unused, step) {
				return processFacets(step, proxy, self._config);
			}, proxy);
		}
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
				return when.chain(processListeners(step, proxy, config), d, proxy);
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

	function generateSteps(steps) {
		return steps.reduce(reduceSteps, []);
	}

	function reduceSteps(lifecycle, step) {
		lifecycle.push(step + ':before');
		lifecycle.push(step);
		lifecycle.push(step + ':after');
		return lifecycle;
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
