/**
 * base
 * @author: brian
 */
(function(define) {
define(function(require) {

	var when, baseEvents, eventProcessor, simpleStrategy, defaultIdentifier,
		beforePhase, propagatingPhase, afterPhase, canceledPhase,
		undef;

	when = require('when');
	eventProcessor = require('./eventProcessor');
	simpleStrategy = require('../network/strategy/default');
	defaultIdentifier = require('../identifier/default');

	// TODO: make these configurable/extensible
	baseEvents = {
		// basic item events. most of these come with data. devs can
		// decide to use these events for their own purposes or send
		// different data than described here, the following list outlines
		// the intended behavior.
		update: 1, // data == item updated
		change: 1, // data == event type that caused the change
		validate: 1, // data == validation result object with at least a boolean valid prop
		// mode events
		abort: 1, // abort the current mode (no data)
		submit: 1, // finalize the current mode (no data)
		// edit event
		edit: 1, // enter edit mode (data == item to edit)
		// network-level events (not to be used by adapters)
		join: 1, // an adapter has joined (data == adapter)
		sync: 1, // adapters need to sync (data == boolean. true == provider)
		leave: 1 // an adapter has left (data == adapter)
	};

	/**
	 * Signal that event has not yet been pushed onto the network.
	 * Return false to prevent the event from being pushed.
	 */
	beforePhase = {};

	/**
	 * Signal that event is currently being propagated to adapters.
	 */
	propagatingPhase = {};

	/**
	 * Signal that an event has already been pushed onto the network.
	 * Return value is ignored since the event has already propagated.
	 */
	afterPhase = {};

	/**
	 * Signal that an event was canceled and not pushed onto the network.
	 * Return value is ignored since the event has already propagated.
	 */
	canceledPhase = {};

	function BaseHub(options) {
		var eventTypes, t;

		this.adapters = [];

		if (!options) options = {};

		this.identifier = options.identifier || defaultIdentifier;

		this.eventProcessor = Object.create(eventProcessor, {
			queue: { value: [] },
			eventProcessor: { value: this.processEvent.bind(this) }
		});

		eventTypes = this.eventTypes;
		for(t in eventTypes) {
			this.addApi(t);
		}
	}

	BaseHub.prototype = {

		eventTypes: baseEvents,

		dispatchEvent:  function (name, data) {
			try {
				return this[name](data);
			}
			catch (ex) {
				// TODO: do something with this exception
				return false;
			}
		},

		createAdapter: function (source, options) {
			var Adapter = this.resolver.resolve(source);
			return Adapter ? new Adapter(source, options) : source;
		},

		addSource: function (source, options) {
			var adapter, proxy;

			if (!options) options = {};

			if (!options.identifier) options.identifier = this.identifier;

			// create an adapter for this source
			adapter = this.createAdapter(source, options);
			proxy = this._createAdapterProxy(adapter, options);
			proxy.origSource = source;

			// save the proxied adapter
			this.adapters.push(proxy);

			this.eventProcessor.processEvent(proxy, null, 'join');

			return adapter;
		},

		/*
		 1. call events.beforeXXX(data)
		 2. call strategy on each source/dest pair w/ event XXX and data
		 - cancel iteration if any strategy returns false for any pair
		 3. if not canceled, call events.XXX(data)
		 */
		processEvent: function (source, data, type) {
			var context, strategyApi, self, strategy, adapters;

			context = {};
			self = this;
			strategy = this.strategy;
			adapters = this.adapters;

			return when(
				self.dispatchEvent(eventProcessor.makeBeforeEventName(type), data)
			).then(
				function (result) {
					context.canceled = result === false;
					if (context.canceled) return when.reject(context);

					context.phase = beforePhase;
					strategyApi = createStrategyApi(context, self.eventProcessor);

					return strategy(source, undef, data, type, strategyApi);
				}
			).then(
				function () {
					context.phase = propagatingPhase;
					return when.map(adapters, function (adapter) {
						if (source != adapter) {
							return strategy(source, adapter, data, type, strategyApi);
						}
					});
				}
			).then(
				function () {
					context.phase = context.canceled
						? canceledPhase
						: afterPhase;
					return strategy(source, undef, data, type, strategyApi);
				}
			).then(
				function (result) {
					context.canceled = result === false;
					if (context.canceled) return when.reject(context);

					return self.dispatchEvent(eventProcessor.makeEventName(type), data);
				}
			).then(
				function () {
					return context;
				}
			);
		},

		destroy: function () {
				var adapters, adapter;

			adapters = this.adapters;

			while ((adapter = adapters.pop())) {
				if (typeof adapter.destroy == 'function') {
					adapter.destroy();
				}
			}
		},

		addApi: function (name) {
			this._addApiMethod(name);
			this._addApiEvent(name);
		},

		_createAdapterProxy: function (adapter, options) {
			var eventFinder, name, method, proxy;

			proxy = Object.create(adapter);

			// keep copy of original source so we can match it up later
			if('provide' in options) {
				proxy.provide = options.provide;
			}

			// sniff for event hooks
			eventFinder = this.configureEventFinder(options.eventNames);

			// override methods that require event hooks
			for (name in adapter) {
				method = adapter[name];
				if (typeof method == 'function' && eventFinder(name)) {
					// store original method on proxy (to stop recursion)
					proxy[name] = callOriginalMethod(adapter, method);
					// change public api of adapter to call back into hub
					observeMethod(this.eventProcessor, adapter, name, method);
					// ensure hub has a public method of the same name
					this.addApi(name);
				}
			}

			return proxy;
		},

		configureEventFinder: function (option) {
			var eventTypes = this.eventTypes;
			return typeof option == 'function'
				? option
				: function (name) { return name in eventTypes; };
		},

		_addApiMethod: function (name) {
			var adapters, self, eventProcessor;

			adapters = this.adapters;
			eventProcessor = this.eventProcessor;
			self = this;

			if (!this[name]) {
				this[name] = function (anything) {
					var sourceInfo;

					sourceInfo = self._findItemFor(anything);

					if(!sourceInfo) {
						sourceInfo = {
							item: anything,
							source: findAdapterForSource(arguments[1], adapters)
						};
					}

					return eventProcessor.queueEvent(sourceInfo.source, sourceInfo.item, name);
				};
			}
		},

		_addApiEvent: function (name) {
			var eventName = this.eventProcessor.makeEventName(name);
			// add function stub to api
			if (!this[eventName]) {
				this[eventName] = function (data) {};
			}
			// add beforeXXX stub, too
			eventName = this.eventProcessor.makeBeforeEventName(name);
			if (!this[eventName]) {
				this[eventName] = function (data) {};
			}
		},

		_findItemFor: function (anything) {
			var item, i, adapters, adapter;

			adapters = this.adapters;

			// loop through adapters that have the getItemForEvent() method
			// to try to find out which adapter and which data item
			i = 0;
			while (!item && (adapter = adapters[i++])) {
				if (adapter.findItem) {
					item = adapter.findItem(anything);
				}
			}

			return item && { item: item };
		}
	};

	return BaseHub;

	function createStrategyApi (context, eventProcessor) {
		return {
			queueEvent: function(source, data, type) {
				return eventProcessor.queueEvent(source, data, type);
			},
			cancel: function () { context.canceled = true; },
			isCanceled: function () { return !!context.canceled; },
			handle: function () { context.handled = true; },
			isHandled: function () { return !!context.handled; },
			isBefore: function () { return isPhase(beforePhase); },
			isAfter: function () { return isPhase(afterPhase); },
			isAfterCanceled: function () { return isPhase(canceledPhase); },
			isPropagating: function () { return isPhase(propagatingPhase); }
		};

		function isPhase (phase) {
			return context.phase == phase;
		}
	}

	function callOriginalMethod (adapter, orig) {
		return function () {
			return orig.apply(adapter, arguments);
		};
	}

	function observeMethod (queue, adapter, type, origMethod) {
		return adapter[type] = function (data) {
			queue.queueEvent(adapter, data, type);
			return origMethod.call(adapter, data);
		};
	}

	function findAdapterForSource (source, adapters) {
		var i, adapter, found;

		// loop through adapters and find which one was created for this source
		i = 0;
		while (!found && (adapter = adapters[i++])) {
			if (adapter.origSource == source) {
				found = adapter;
			}
		}

		return found;
	}

});
}(typeof define === 'function' ? define : function(factory) { module.exports = factory(require); }));
