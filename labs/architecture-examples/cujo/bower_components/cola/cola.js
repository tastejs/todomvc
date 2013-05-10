/** @license MIT License (c) copyright B Cavalier & J Hann */

/**
 * wire/cola plugin
 *
 * wire is part of the cujo.js family of libraries (http://cujojs.com/)
 *
 * Licensed under the MIT License at:
 * http://www.opensource.org/licenses/mit-license.php
 */

(function(define) {
define(['when', './relational/propertiesKey', './comparator/byProperty'],
function(when, propertiesKey, byProperty) {

	var defaultComparator, defaultQuerySelector, defaultQuerySelectorAll,
		defaultOn, excludeOptions;

	defaultComparator = byProperty('id');
	defaultQuerySelector = { $ref: 'dom.first!' };
	defaultQuerySelectorAll = { $ref: 'dom.all!' };
	defaultOn = { $ref: 'on!' };

	function initBindOptions(incomingOptions, pluginOptions, resolver) {
		var options, identifier, comparator;

		if(resolver.isRef(incomingOptions)) {
			incomingOptions = { to: incomingOptions };
		}
		options = copyOwnProps(incomingOptions, pluginOptions);

		if(!options.querySelector) {
			options.querySelector = defaultQuerySelector;
		}

		if(!options.querySelectorAll) {
			options.querySelectorAll = defaultQuerySelectorAll;
		}

		if(!options.on) {
			options.on = defaultOn;
		}

		// TODO: Extend syntax for identifier and comparator
		// to allow more fields, and more complex expressions
		identifier = options.identifier;
		options.identifier = typeof identifier == 'string' || Array.isArray(identifier)
			? propertiesKey(identifier)
			: identifier;

		comparator = options.comparator || defaultComparator;
		options.comparator = typeof comparator == 'string'
			? byProperty(comparator)
			: comparator;

		return options;
	}

	function doBind(facet, options, wire) {
		var target = facet.target;

		return when(wire(initBindOptions(facet.options, options, wire.resolver)),
			function(options) {
				var to = options.to;
				if (!to) throw new Error('wire/cola: "to" must be specified');

				to.addSource(target, copyOwnProps(options));
				return target;
			}
		);
	}

	/**
	 * We don't want to copy the module property from the plugin options, and
	 * wire adds the id property, so we need to filter that out too.
	 * @type {Object}
	 */
	excludeOptions = {
		id: 1,
		module: 1
	};

	return {
		wire$plugin: function(pluginOptions) {

			var options, p;

			options = {};

			if(arguments.length) {
				pluginOptions = arguments[arguments.length-1];

				for(p in pluginOptions) {
					if(!(p in excludeOptions)) {
						options[p] = pluginOptions[p];
					}
				}
			}

			function bindFacet(resolver, facet, wire) {
				resolver.resolve(doBind(facet, options, wire));
			}

			return {
				facets: {
					bind: {
						ready: bindFacet
					}
				}
			};
		}
	};

	/**
	 * Copies own properties from each src object in the arguments list
	 * to a new object and returns it.  Properties further to the right
	 * win.
	 *
	 * @return {Object} a new object with own properties from all srcs.
	 */
	function copyOwnProps(/*srcs...*/) {
		var i, len, p, src, dst;

		dst = {};

		for(i = 0, len = arguments.length; i < len; i++) {
			src = arguments[i];
			if(src) {
				for(p in src) {
					if(src.hasOwnProperty(p)) {
						dst[p] = src[p];
					}
				}
			}
		}

		return dst;
	}
});
})(typeof define == 'function'
	// use define for AMD if available
	? define
	: function(deps, factory) { module.exports = factory.apply(this, deps.map(require)); }
);
