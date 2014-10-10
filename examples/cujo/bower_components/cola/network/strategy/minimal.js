(function (define) {
define(function (require) {
"use strict";

	var
		compose = require('./compose'),
		base = require('./base'),
		targetFirstItem = require('./targetFirstItem'),
		syncAfterJoin = require('./syncAfterJoin'),
		syncDataDirectly = require('./syncDataDirectly');

	/**
	 * This is a composition of the minimal strategies to actually do something
	 * meaningful with cola.
	 *
	 * @param options {Object} a conglomeration of all of the options for the
	 *   strategies used.
	 * @param options.targetFirstItem {Boolean} if truthy, the strategy
	 * will automatically target the first item that is added to the network.
	 * If falsey, it will not automatically target.
	 *
	 * @return {Function} a composite network strategy function
	 */
	return function (options) {

		var strategies;

		// configure strategies
		strategies = [
			syncAfterJoin(options),
			syncDataDirectly(options)
		];

		if(options && options.targetFirstItem) {
			strategies.push(targetFirstItem(options));
		}

		strategies.push(base(options));

		// compose them
		return compose(strategies);

	};

});
}(
	typeof define == 'function' && define.amd
		? define
		: function (factory) { module.exports = factory(require); }
));