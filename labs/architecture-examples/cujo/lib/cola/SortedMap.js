/** MIT License (c) copyright B Cavalier & J Hann */

(function (define) {
define(function () {

	var undef, missing = {};

	/**
	 * @constructor
	 * @param identifier {Function}
	 * @param comparator {Function}
	 */
	function SortedMap (identifier, comparator) {

		// identifier is required, comparator is optional

		this.clear();

		/**
		 * Fetches a value item for the given key item or the special object,
		 * missing, if the value item was not found.
		 * @private
		 * @param keyItem
		 * @returns {Object} the value item that was set for the supplied
		 * key item or the special object, missing, if it was not found.
		 */
		this._fetch = function (keyItem) {
			var symbol = identifier(keyItem);
			return symbol in this._index ? this._index[symbol] : missing;
		};

		/**
		 * Performs a binary search to find the bucket position of a
		 * key item within the key items list.  Only used if we have a
		 * comparator.
		 * @private
		 * @param keyItem
		 * @param exactMatch {Boolean} if true, must be an exact match to the key
		 *   item, not just the correct position for a key item that sorts
		 *   the same.
		 * @returns {Number|Undefined}
		 */
		this._pos = function (keyItem, exactMatch) {
			var pos, sorted, symbol;
			sorted = this._sorted;
			symbol = identifier(keyItem);
			function getKey (pos) { return sorted[pos] ? sorted[pos][0].key : {}; }
			pos = binarySearch(0, sorted.length, keyItem, getKey, comparator);
			if (exactMatch) {
				if (symbol != identifier(sorted[pos][0].key)) {
					pos = -1;
				}
			}
			return pos;
		};
		this._bucketOffset = function (bucketPos) {
			var total, i;
			total = 0;
			for (i = 0; i < bucketPos; i++) {
				total += this._sorted[i].length;
			}
			return total;
		};

		if (!comparator) {
			this._pos = function (keyItem, exact) {
				return exact ? -1 : this._sorted.length;
			};
		}

		/**
		 * Given a keyItem and its bucket position in the list of key items,
		 * inserts an value item into the bucket of value items.
		 * This method can be overridden by other objects that need to
		 * have objects in the same order as the key values.
		 * @private
		 * @param valueItem
		 * @param keyItem
		 * @param pos
		 * @returns {Number} the absolute position of this item amongst
		 *   all items in all buckets.
		 */
		this._insert = function (keyItem, pos, valueItem) {
			var pair, symbol, entry, absPos;

			// insert into index
			pair = { key: keyItem, value: valueItem };
			symbol = identifier(keyItem);
			this._index[symbol] = pair;

			// insert into sorted table
			if (pos >= 0) {
				absPos = this._bucketOffset(pos);
				entry = this._sorted[pos] && this._sorted[pos][0];
				// is this a new row (at end of array)?
				if (!entry) {
					this._sorted[pos] = [pair];
				}
				// are there already items of the same sort position here?
				else if (comparator(entry.key, keyItem) == 0) {
					absPos += this._sorted[pos].push(pair) - 1;
				}
				// or do we need to insert a new row?
				else {
					this._sorted.splice(pos, 0, [pair]);
				}
			}
			else {
				absPos = -1;
			}

			return absPos;
		};

		/**
		 * Given a key item and its bucket position in the list of key items,
		 * removes a value item from the bucket of value items.
		 * This method can be overridden by other objects that need to
		 * have objects in the same order as the key values.
		 * @private
		 * @param keyItem
		 * @param pos
		 * @returns {Number} the absolute position of this item amongst
		 *   all items in all buckets.
		 */
		this._remove = function remove (keyItem, pos) {
			var symbol, entries, i, entry, absPos;

			symbol = identifier(keyItem);

			// delete from index
			delete this._index[symbol];

			// delete from sorted table
			if (pos >= 0) {
				absPos = this._bucketOffset(pos);
				entries = this._sorted[pos] || [];
				i = entries.length;
				// find it and remove it
				while ((entry = entries[--i])) {
					if (symbol == identifier(entry.key)) {
						entries.splice(i, 1);
						break;
					}
				}
				absPos += i;
				// if we removed all pairs at this position
				if (entries.length == 0) {
					this._sorted.splice(pos, 1);
				}
			}
			else {
				absPos = -1;
			}

			return absPos;
		};

		this._setComparator = function (newComparator) {
			var p, pair, pos;
			comparator = newComparator;
			this._sorted = [];
			for (p in this._index) {
				pair = this._index[p];
				pos = this._pos(pair.key);
				this._insert(pair.key, pos, pair.value);
			}
		};

	}

	SortedMap.prototype = {

		get: function (keyItem) {
			var pair;
			pair = this._fetch(keyItem);
			return pair == missing ? undef : pair.value;
		},

		add: function (keyItem, valueItem) {
			var pos, absPos;

			if (arguments.length < 2) throw new Error('SortedMap.add: must supply keyItem and valueItem args');

			// don't insert twice. bail if we already have it
			if (this._fetch(keyItem) != missing) return;

			// find pos and insert
			pos = this._pos(keyItem);
			absPos = this._insert(keyItem, pos, valueItem);

			return absPos;
		},

		remove: function (keyItem) {
			var valueItem, pos, absPos;

			// don't remove if we don't already have it
			valueItem = this._fetch(keyItem);
			if (valueItem == missing) return;

			// find positions and delete
			pos = this._pos(keyItem, true);
			absPos = this._remove(keyItem, pos);

			return absPos;
		},

		forEach: function (lambda) {
			var i, j, len, len2, entries;

			for (i = 0, len = this._sorted.length; i < len; i++) {
				entries = this._sorted[i];
				for (j = 0, len2 = entries.length; j < len2; j++) {
					lambda(entries[j].value, entries[j].key);
				}
			}
		},

		clear: function() {
			// hashmap of object-object pairs
			this._index = {};

			// 2d array of objects
			this._sorted = [];
		},

		setComparator: function (comparator) {
			this._setComparator(comparator);
		}

	};


	return SortedMap;

	/**
	 * Searches through a list of items, looking for the correct slot
	 * for a new item to be added.
	 * @param min {Number} points at the first possible slot
	 * @param max {Number} points at the slot after the last possible slot
	 * @param item anything comparable via < and >
	 * @param getter {Function} a function to retrieve a item at a specific
	 * 	 slot: function (pos) { return items[pos]; }
	 * @param comparator {Function} function to compare to items. must return
	 *   a number.
	 * @returns {Number} returns the slot where the item should be placed
	 *   into the list.
	 */
	function binarySearch (min, max, item, getter, comparator) {
		var mid, compare;
		if (max <= min) return min;
		do {
			mid = Math.floor((min + max) / 2);
			compare = comparator(item, getter(mid));
			if (isNaN(compare)) throw new Error('SortedMap: invalid comparator result ' + compare);
			// if we've narrowed down to a choice of just two slots
			if (max - min <= 1) {
				return compare == 0 ? mid : compare > 0 ? max : min;
			}
			// don't use mid +/- 1 or we may miss in-between values
			if (compare > 0) min = mid;
			else if (compare < 0) max = mid;
			else return mid;
		}
 		while (true);
	}

});
}(
	typeof define == 'function'
		? define
		: function (factory) { module.exports = factory(require); }
));
