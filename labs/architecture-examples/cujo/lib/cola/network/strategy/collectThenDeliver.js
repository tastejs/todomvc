(function (define) {
define(function () {

	var defaultCollectionProperty, defaultPreserveCollection, isArray, undef;

	defaultCollectionProperty = 'items';
	defaultPreserveCollection = false;

	isArray = Array.isArray || function (o) {
		return Object.prototype.toString.call(o) == '[object Array]';
	};

	/**
	 *
	 * @param [options] {Object}
	 * @param [options.collectionProperty] {String} the name of the array
	 *   that will hold the collected items on the collector. If the collector
	 *   is an array, this option is ignored.
	 * @param [options.preserveCollection] {Boolean} set this to true to
	 *   preserve any existing items in the collector when starting a new
	 *   collection (i.e. a "collect" event happens).  Typically, you'd want
	 *   to start a fresh collection each time, but this is a way to pre-
	 *   load certain items.  This option is ignored if the collector is an
	 *   array.
	 * @return {Function}
	 *
	 * @description
	 * Note: this strategy relies on select and unselect events carrying
	 * the data item with them. (This is the intended behavior, but devs
	 * have the option to send something else.)
	 */
	return function (options) {
		var collProp, preserve, collector, collection, index;

		if (!options) options = {};

		collProp = options.collectionProperty || defaultCollectionProperty;
		preserve = options.preserveCollection || defaultPreserveCollection;

		return function collectThenDeliver (source, dest, data, type, api) {

			// if we're currently collecting
			if (collector) {
				if (api.isBefore()) {
					// cancel if we get another "collect" event
					if ('collect' == type) {
						// TODO: how do we notify the system why we canceled?
						// queue an "error" event?
						api.cancel();
					}
				}
				else if (api.isAfter()) {
					// watch for select
					if (type == 'select') {
						collect(data, source.identifier(data));
					}
					// also watch for unselect events and remove events
					else if (type == 'unselect' || type == 'remove') {
						uncollect(data, source.identifier(data));
					}
					// watch for "submit" events
					else if ('submit' == type) {
						api.queueEvent(source, collector, 'deliver');
						stopCollecting();
					}
					// watch for cancel events
					else if ('cancel' == type) {
						stopCollecting();
					}
				}
			}
			// if we're not collecting
			else {
				if (api.isAfter()) {
					// watch for "collect" events
					if ('collect' == type) {
						startCollecting(data);
					}
				}
			}

		};

		function startCollecting (data) {
			collector = data || [];
			// figure out where to collect
			if (isArray(collector)) {
				// collector is the collection. append to it
				collection = collector;
			}
			else {
				// use a property on collector
				collection = data[collProp];
				if (!collection) {
					collection = data[collProp] = [];
				}
			}
			// figure out if we need to remove any existing items
			if (!preserve && collection.length) {
				collection.splice(0, collection.length);
			}
			// create index
			index = {};
		}

		function stopCollecting () {
			collector = index = null;
		}

		function collect (item, id) {
			var pos = index[id];
			if (pos === undef) {
				index[id] = collection.push(item) - 1;
			}
		}

		function uncollect (item, id) {
			var pos = index[id];
			if (pos >= 0) {
				collection.splice(pos, 1);
				delete index[id];
				adjustIndex(pos);
			}
		}

		function adjustIndex (fromPos) {
			var id;
			for (id in index) {
				if (index[id] > fromPos) {
					index[id]--;
				}
			}
		}

	};

});
}(
	typeof define == 'function' && define.amd
		? define
		: function (factory) { module.exports = factory(); }
));