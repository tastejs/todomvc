/** @license MIT License (c) copyright B Cavalier & J Hann */

/**
 * Licensed under the MIT License at:
 * http://www.opensource.org/licenses/mit-license.php
 */

(function(define){ 'use strict';
define(function(require) {

	var when, safeNonFacetNames;

	when = require('when');
	safeNonFacetNames = {
		id: { value: 1 }
	};

	function Lifecycle(plugins, pluginApi) {
		this._plugins = plugins;
		this._pluginApi = pluginApi;
	}

	Lifecycle.prototype = {
		init: createLifecyclePhase(['create', 'configure', 'initialize']),
		startup: createLifecyclePhase(['connect', 'ready']),
		shutdown: createLifecyclePhase(['destroy'])
	};

	return Lifecycle;

	/**
	 * Generate a method to process all steps in a lifecycle phase
	 * @return {Function}
	 */
	function createLifecyclePhase(steps) {
		steps = generateSteps(steps);

		return function(proxy) {
			var plugins, pluginApi;

			plugins = this._plugins;
			pluginApi = this._pluginApi.contextualize(proxy.id);

			return when.reduce(steps, function (unused, step) {
				return processFacets(step, proxy, pluginApi, plugins);
			}, proxy);
		};
	}

	function processFacets(step, proxy, api, plugins) {
		var promises, metadata, options, name, spec, facets, safeNames, unprocessed;

		promises = [];
		metadata = proxy.metadata;
		spec = metadata.spec;
		facets = plugins.facets;
		safeNames = Object.create(plugins.factories, safeNonFacetNames);
		unprocessed = [];

		for(name in spec) {
			if(name in facets) {
				options = spec[name];
				if (options) {
					processStep(promises, facets[name], step, proxy, options, api);
				}
			} else if (!(name in safeNames)) {
				unprocessed.push(name);
			}
		}

		if(unprocessed.length) {
			return when.reject(unrecognizedFacets(proxy, unprocessed, spec));
		} else {
			return when.all(promises).then(function () {
				return processListeners(step, proxy, api, plugins.listeners);
			}).yield(proxy);
		}
	}

	function processListeners(step, proxy, api, listeners) {
		var listenerPromises = [];

		for (var i = 0; i < listeners.length; i++) {
			processStep(listenerPromises, listeners[i], step, proxy, {}, api);
		}

		return when.all(listenerPromises);
	}

	function processStep(promises, processor, step, proxy, options, api) {
		var facet, pendingFacet;

		if (processor && processor[step]) {
			pendingFacet = when.defer();
			promises.push(pendingFacet.promise);

			facet = Object.create(proxy);
			facet.options = options;
			processor[step](pendingFacet.resolver, facet, api);
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

	function unrecognizedFacets(proxy, unprocessed, spec) {
		return new Error('unrecognized facets in ' + proxy.id + ', maybe you forgot a plugin? ' + unprocessed.join(', ') + '\n' + JSON.stringify(spec));
	}

});
})(typeof define == 'function'
	// AMD
	? define
	// CommonJS
	: function(factory) { module.exports = factory(require); }
);