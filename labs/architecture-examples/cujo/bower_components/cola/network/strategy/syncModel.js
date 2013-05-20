(function (define) {
	define(function () {
		"use strict";

		/**
		 * Creates a strategy to push all data from a source into the consumers
		 * in the network directly (rather than as a sequence of 'add' events
		 * in the network) when a sync event happens.
		 *
		 * @description This strategy helps eliminate loops and complexities
		 * when data providers and consumers are added at unpredictable times.
		 * During a sync, all 'add' events are squelched while providers push
		 * all items to all consumers.
		 *
		 * @param [options.providersAreConsumers] {Boolean} if truthy, providers
		 *   are also treated as consumers and receive items from other providers.
		 * @return {Function} a network strategy function
		 */
		return function (options) {
			var synced, providers, consumers, undef;

			if (!options) options = {};

			// TODO: consider putting these on the api object so they can be shared across strategies
			// a list of all known providers and consumers
			// these lists tend to be very small
			providers = [];
			consumers = [];
			// the adapter currently being synced
			synced = undef;

			return function syncDataDirectly (source, dest, provide, type, api) {
				// this strategy stops sync events before going on the network
				if ('sync' == type && api.isBefore()) {
					synced = source;
					try {
						if (provide) {
							// provide data onto consumers in network
							if (typeof source.properties != 'function') {
								throw new Error('syncModel: provider doesn\'t have `properties()`.');
							}
							// keep track of providers
							add(providers, synced);
							// also add to consumers list, if specified
							if (options.providersAreConsumers) {
								add(consumers, synced);
							}
							// push data to all consumers
							forEach(consumers, function (consumer) {
								source.properties(function (item) {
									consumer.update(item);
								});
							});
						}
						else {
							// keep track of consumers
							add(consumers, synced);
							// provide data onto consumers in network
							if (typeof source.update == 'function') {
								// consume data from all providers
								forEach(providers, function (provider) {
									provider.properties(function (item) {
										synced.update(item);
									});
								});
							}
						}
						// the sync event never gets onto the network:
						api.cancel();
					}
					finally {
						synced = undef;
					}
				}
				// stop 'add' events between adapters while sync'ing, but allow
				// strategies interested in the event to see it before
				else if ('add' == type && synced && !api.isBefore()) {
					api.cancel();
				}
				// keep track of adapters that leave
				else if ('leave' == type && api.isAfter()) {
					// these just end up being noops if the source isn't in the list
					remove(providers, source);
					remove(consumers, source);
				}
			};

			function add (list, adapter) {
				list.push(adapter);
			}

			function remove (list, adapter) {
				forEach(list, function (provider, i , providers) {
					if (provider == adapter) {
						providers.splice(i, 1);
					}
				});
			}

			function forEach (list, lambda) {
				var i, obj;
				i = list.length;
				while ((obj = list[--i])) {
					lambda(obj, i, list);
				}
			}

		};

	});
}(
		typeof define == 'function' && define.amd
			? define
			: function (factory) { module.exports = factory(); }
	));