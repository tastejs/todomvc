(function (define) {
define(function () {

	/**
	 * Returns a strategy function that fires a "sync" function after
	 * an adapter joins the network.  If the adapter has a truthy `provide`
	 * option set, a "sync from" event is fired. Otherwise, a "sync to me"
	 * request is sent.
	 * @param [options] {Object} options.
	 * @param [options.isProvider] {Function} function (adapter) { return bool; }
	 *   returns true for adapters that should be considered to be data
	 *   providers.  If not supplied, the default isProvider looks for a
	 *   truthy property on the adapters options called "provide".  If that
	 *   doesn't exist, it checks for data by calling the adapter's forEach.
	 *   If the adapter has data, it is considered to be a provider.
	 * @return {Function} a network strategy function
	 */
	return function (options) {
		var isProvider;

		if (!options) options = {};

		isProvider = options.isProvider || defaultIsProvider;

		return function syncAfterJoin (source, dest, data, type, api) {

			// process this strategy after sending to network
			if ('join' == type && api.isAfter()) {
				if (isProvider(source)) {
					// request to sync *from* source (provide)
					api.queueEvent(source, true, 'sync');
				}
				else {
					// request to sync *to* source (consume)
					api.queueEvent(source, false, 'sync');
				}
			}

		};

	};

	function defaultIsProvider (adapter) {
		return adapter.provide;
	}

});
}(
	typeof define == 'function' && define.amd
		? define
		: function (factory) { module.exports = factory(); }
));