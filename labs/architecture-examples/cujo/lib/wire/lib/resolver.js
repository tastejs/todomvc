/** @license MIT License (c) copyright B Cavalier & J Hann */

/**
 * Licensed under the MIT License at:
 * http://www.opensource.org/licenses/mit-license.php
 */

(function(define){
define(['when'], function(when) {

	"use strict";

	function Resolver(config) {
		this._resolvers = config.resolvers;
		this._pluginApi = config.pluginApi;
	}

	Resolver.prototype = {

		isRef: function(it) {
			return it && it.hasOwnProperty('$ref');
		},

		parse: function(it) {
			return this.create(it.$ref, it);
		},

		create: function(name, options) {
			var self, split, resolver;

			self = this;

			split = name.indexOf('!');
			resolver = name.substring(0, split);
			name = name.substring(split + 1);

			return {
				resolver: resolver,
				name: name,
				options: options,
				resolve: function() {
					return self._resolve(resolver, name, options);
				}
			}
		},

		_resolve: function(resolverName, name, options) {
			var deferred, resolver;

			deferred = when.defer();

			if (resolverName) {
				resolver = this._resolvers[resolverName];

				if (resolver) {
					resolver(deferred.resolver, name, options||{}, this._pluginApi);
				} else {
					deferred.reject("No resolver plugin found: " + resolverName);
				}

			} else {
				deferred.reject("Cannot resolve ref: " + name);
			}

			return deferred.promise;
		}
	};

	return Resolver;

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
