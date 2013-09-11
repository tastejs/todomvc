/** @license MIT License (c) copyright B Cavalier & J Hann */

/**
 * wire/dojo/store plugin
 * wire plugin that provides a REST resource reference resolver.  Referencing
 * any REST resource using the format: resource!url/goes/here will create a
 * dojo.store.JsonRest pointing to url/goes/here.  Using the id or query
 * options, you can alternatively resolve references to actual data.
 *
 * wire is part of the cujo.js family of libraries (http://cujojs.com/)
 *
 * Licensed under the MIT License at:
 * http://www.opensource.org/licenses/mit-license.php
 */

define([], function() {

	var pluginInstance;

	/**
	 * If wait === true, waits for dataPromise to complete and resolves
	 * the reference to the resulting concrete data.  If wait !== true,
	 * resolves the reference to dataPromise.
	 *
	 * @param dataPromise
	 * @param resolver
	 * @param wait
	 */
	function resolveData(dataPromise, resolver, wait) {
		if(wait === true) {
			dataPromise.then(
				function(data) {
					resolver.resolve(data);
				},
				function(err) {
					resolver.reject(err);
				}
			);
		} else {
			resolver.resolve(dataPromise);
		}
	}

	/**
	 * Resolves a dojo.store.JsonRest for the REST resource at the url
	 * specified in the reference, e.g. resource!url/to/resource
	 *
	 * @param resolver
	 * @param name
	 * @param refObj
	 * @param wire
	 */
	function resolveResource(resolver, name, refObj, wire) {
		var args = { target: name };

		if(refObj.idProperty) args.idProperty = refObj.idProperty;

		wire({ create: { module: 'dojo/store/JsonRest', args: args } })
			.then(function(store) {
				if(refObj.get) {
					// If get was specified, get it, and resolve with the resulting item.
					resolveData(store.get(refObj.get), resolver, refObj.wait);

				} else if(refObj.query) {
					// Similarly, query and resolve with the result set.
					resolveData(store.query(refObj.query), resolver, refObj.wait);

				} else {
					// Neither get nor query was specified, so resolve with
					// the store itself.
					resolver.resolve(store);
				}
			});
	}

	/**
	 * The plugin instance.  Can be the same for all wiring runs
	 */
	pluginInstance = {
		resolvers: {
			resource: resolveResource
		}
	};

	return {
		wire$plugin: function restPlugin(/* options */) {
			return pluginInstance;
		}
	};
});