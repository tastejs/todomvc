/**
 * Collection
 */
(function(define) {
define(function(require) {

	var Base, resolver, eventTypes, simpleStrategy;

	Base = require('./hub/Base');
	resolver = require('./collectionAdapterResolver');
	simpleStrategy = require('./network/strategy/default');

	eventTypes = extend(Base.prototype.eventTypes, {
		// collection item events. most of these come with data. devs can
		// decide to use these events for their own purposes or send
		// different data than described here, the following list outlines
		// the intended behavior.
		add: 1, // data == item added
		remove: 1, // data == item removed
		target: 1, // data == item targeted TODO: rename this to "point"?
		// multi-item events
		select: 1, // select an item (data == item)
		unselect: 1, // deselect an item (data == item)
		// batch events
		collect: 1, // start of batch mode (until abort or submit) (data = batch purpose)
		deliver: 1 // collected items (data = batch purpose with collected items array as property)
	});

	function Collection(options) {
		Base.call(this, options);

		if(!options) {
			options = {};
		}

		this.strategy = options.strategy;
		if (!this.strategy) this.strategy = simpleStrategy(options.strategyOptions);

	}

	Collection.prototype = Object.create(Base.prototype, {

		eventTypes: { value: eventTypes },

		resolver: { value: resolver },

		forEach: {
			value: function forEach(lambda) {
				var provider = this.getProvider();
				return provider && provider.forEach(lambda);
			}
		},

		findItem: {
			value: function (anything) {
				var info = this._findItemFor(anything);
				return info && info.item;
			}
		},

		findNode: {
			value: function (anything) {
				var info = this._findNodeFor(anything);
				return info && info.node;
			}
		},

		getProvider: {
			value: function () {
				var a, i = this.adapters.length;
				while(a = this.adapters[--i]) {
					if(a.provide) return a;
				}
			}
		},

		_findNodeFor: {
			value: function (anything) {
				var node, i, adapters, adapter;

				adapters = this.adapters;

				// loop through adapters that have the findNode() method
				// to try to find out which adapter and which node
				i = 0;
				while (!node && (adapter = adapters[i++])) {
					if (adapter.findNode) {
						node = adapter.findNode(anything);
					}
				}

				return node && { node: node };
			}
		}

	});

	return Collection;

	function extend(base, mixin) {
		var extended = Object.create(base);
		for(var p in mixin) {
			extended[p] = mixin[p];
		}

		return extended;
	}

});
}(typeof define === 'function' ? define : function(factory) { module.exports = factory(require); }));
