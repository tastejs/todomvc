/*!
 * CanJS - 2.0.7
 * http://canjs.us/
 * Copyright (c) 2014 Bitovi
 * Wed, 26 Mar 2014 16:12:27 GMT
 * Licensed MIT
 * Includes: CanJS default build
 * Download from: http://canjs.us/
 */
define(["can/util/library", "can/util/bind", "can/util/batch"], function (can, bind) {
	var names = [
		'__reading',
		'__clearReading',
		'__setReading'
	],
		setup = function (observed) {
			var old = {};
			for (var i = 0; i < names.length; i++) {
				old[names[i]] = can[names[i]];
			}
			can.__reading = function (obj, attr) {
				// Add the observe and attr that was read
				// to `observed`
				observed.push({
					obj: obj,
					attr: attr + ''
				});
			};
			can.__clearReading = function () {
				return observed.splice(0, observed.length);
			};
			can.__setReading = function (o) {
				[].splice.apply(observed, [
					0,
					observed.length
				].concat(o));
			};
			return old;
		},
		// empty default function
		k = function () {};
	// returns the
	// - observes and attr methods are called by func
	// - the value returned by func
	// ex: `{value: 100, observed: [{obs: o, attr: "completed"}]}`
	var getValueAndObserved = function (func, self) {
		var observed = [],
			old = setup(observed),
			// Call the "wrapping" function to get the value. `observed`
			// will have the observe/attribute pairs that were read.
			value = func.call(self);
		// Set back so we are no longer reading.
		can.simpleExtend(can, old);
		return {
			value: value,
			observed: observed
		};
	},
		// Calls `callback(newVal, oldVal)` everytime an observed property
		// called within `getterSetter` is changed and creates a new result of `getterSetter`.
		// Also returns an object that can teardown all event handlers.
		computeBinder = function (getterSetter, context, callback, computeState) {
			// track what we are observing
			var observing = {},
				// a flag indicating if this observe/attr pair is already bound
				matched = true,
				// the data to return
				data = {
					value: undefined,
					teardown: function () {
						for (var name in observing) {
							var ob = observing[name];
							ob.observe.obj.unbind(ob.observe.attr, onchanged);
							delete observing[name];
						}
					}
				}, batchNum;
			// when a property value is changed
			var onchanged = function (ev) {
				// If the compute is no longer bound (because the same change event led to an unbind)
				// then do not call getValueAndBind, or we will leak bindings.
				if (computeState && !computeState.bound) {
					return;
				}
				if (ev.batchNum === undefined || ev.batchNum !== batchNum) {
					// store the old value
					var oldValue = data.value,
						// get the new value
						newvalue = getValueAndBind();
					// update the value reference (in case someone reads)
					data.value = newvalue;
					// if a change happened
					if (newvalue !== oldValue) {
						callback(newvalue, oldValue);
					}
					batchNum = batchNum = ev.batchNum;
				}
			};
			// gets the value returned by `getterSetter` and also binds to any attributes
			// read by the call
			var getValueAndBind = function () {
				var info = getValueAndObserved(getterSetter, context),
					newObserveSet = info.observed;
				var value = info.value,
					ob;
				matched = !matched;
				// go through every attribute read by this observe
				for (var i = 0, len = newObserveSet.length; i < len; i++) {
					ob = newObserveSet[i];
					// if the observe/attribute pair is being observed
					if (observing[ob.obj._cid + '|' + ob.attr]) {
						// mark at as observed
						observing[ob.obj._cid + '|' + ob.attr].matched = matched;
					} else {
						// otherwise, set the observe/attribute on oldObserved, marking it as being observed
						observing[ob.obj._cid + '|' + ob.attr] = {
							matched: matched,
							observe: ob
						};
						ob.obj.bind(ob.attr, onchanged);
					}
				}
				// Iterate through oldObserved, looking for observe/attributes
				// that are no longer being bound and unbind them
				for (var name in observing) {
					ob = observing[name];
					if (ob.matched !== matched) {
						ob.observe.obj.unbind(ob.observe.attr, onchanged);
						delete observing[name];
					}
				}
				return value;
			};
			// set the initial value
			data.value = getValueAndBind();
			data.isListening = !can.isEmptyObject(observing);
			return data;
		};
	var isObserve = function (obj) {
		return obj instanceof can.Map || obj && obj.__get;
	};
	// if no one is listening ... we can not calculate every time
	can.compute = function (getterSetter, context, eventName) {
		if (getterSetter && getterSetter.isComputed) {
			return getterSetter;
		}
		// stores the result of computeBinder
		var computedData,
			// the computed object
			computed,
			// an object that keeps track if the computed is bound
			// onchanged needs to know this. It's possible a change happens and results in
			// something that unbinds the compute, it needs to not to try to recalculate who it
			// is listening to
			computeState = {
				bound: false,
				hasDependencies: false
			},
			// The following functions are overwritten depending on how compute() is called
			// a method to setup listening
			on = k,
			// a method to teardown listening
			off = k,
			// the current cached value (only valid if bound = true)
			value,
			// how to read the value
			get = function () {
				return value;
			},
			// sets the value
			set = function (newVal) {
				value = newVal;
			},
			// this compute can be a dependency of other computes
			canReadForChangeEvent = true,
			// save for clone
			args = can.makeArray(arguments),
			updater = function (newValue, oldValue) {
				value = newValue;
				// might need a way to look up new and oldVal
				can.batch.trigger(computed, 'change', [
					newValue,
					oldValue
				]);
			},
			// the form of the arguments
			form;
		computed = function (newVal) {
			// setting ...
			if (arguments.length) {
				// save a reference to the old value
				var old = value;
				// setter may return a value if
				// setter is for a value maintained exclusively by this compute
				var setVal = set.call(context, newVal, old);
				// if this has dependencies return the current value
				if (computed.hasDependencies) {
					return get.call(context);
				}
				if (setVal === undefined) {
					// it's possible, like with the DOM, setting does not
					// fire a change event, so we must read
					value = get.call(context);
				} else {
					value = setVal;
				}
				// fire the change
				if (old !== value) {
					can.batch.trigger(computed, 'change', [
						value,
						old
					]);
				}
				return value;
			} else {
				// Another compute wants to bind to this compute
				if (can.__reading && canReadForChangeEvent) {
					// Tell the compute to listen to change on this computed
					can.__reading(computed, 'change');
					// We are going to bind on this compute.
					// If we are not bound, we should bind so that
					// we don't have to re-read to get the value of this compute.
					if (!computeState.bound) {
						can.compute.temporarilyBind(computed);
					}
				}
				// if we are bound, use the cached value
				if (computeState.bound) {
					return value;
				} else {
					return get.call(context);
				}
			}
		};
		if (typeof getterSetter === 'function') {
			set = getterSetter;
			get = getterSetter;
			canReadForChangeEvent = eventName === false ? false : true;
			computed.hasDependencies = false;
			on = function (update) {
				computedData = computeBinder(getterSetter, context || this, update, computeState);
				computed.hasDependencies = computedData.isListening;
				value = computedData.value;
			};
			off = function () {
				if (computedData) {
					computedData.teardown();
				}
			};
		} else if (context) {
			if (typeof context === 'string') {
				// `can.compute(obj, "propertyName", [eventName])`
				var propertyName = context,
					isObserve = getterSetter instanceof can.Map;
				if (isObserve) {
					computed.hasDependencies = true;
				}
				get = function () {
					if (isObserve) {
						return getterSetter.attr(propertyName);
					} else {
						return getterSetter[propertyName];
					}
				};
				set = function (newValue) {
					if (isObserve) {
						getterSetter.attr(propertyName, newValue);
					} else {
						getterSetter[propertyName] = newValue;
					}
				};
				var handler;
				on = function (update) {
					handler = function () {
						update(get(), value);
					};
					can.bind.call(getterSetter, eventName || propertyName, handler);
					// use getValueAndObserved because
					// we should not be indicating that some parent
					// reads this property if it happens to be binding on it
					value = getValueAndObserved(get)
						.value;
				};
				off = function () {
					can.unbind.call(getterSetter, eventName || propertyName, handler);
				};
			} else {
				// `can.compute(initialValue, setter)`
				if (typeof context === 'function') {
					value = getterSetter;
					set = context;
					context = eventName;
					form = 'setter';
				} else {
					// `can.compute(initialValue,{get:, set:, on:, off:})`
					value = getterSetter;
					var options = context,
						oldUpdater = updater;
						
					updater = function(){
						var newVal = get.call(context);
						if(newVal !== value) {
							oldUpdater(newVal, value);
						}
					};
					get = options.get || get;
					set = options.set || set;
					on = options.on || on;
					off = options.off || off;
				}
			}
		} else {
			// `can.compute(5)`
			value = getterSetter;
		}
		can.cid(computed, 'compute');
		return can.simpleExtend(computed, {
			/**
			 * @property {Boolean} can.computed.isComputed compute.isComputed
			 * @parent can.compute
			 * Whether the value of the compute has been computed yet.
			 */
			isComputed: true,
			_bindsetup: function () {
				computeState.bound = true;
				// setup live-binding
				// while binding, this does not count as a read
				var oldReading = can.__reading;
				delete can.__reading;
				on.call(this, updater);
				can.__reading = oldReading;
			},
			_bindteardown: function () {
				off.call(this, updater);
				computeState.bound = false;
			},
			/**
			 * @function can.computed.bind compute.bind
			 * @parent can.compute
			 * @description Bind an event handler to a compute.
			 * @signature `compute.bind(eventType, handler)`
			 * @param {String} eventType The event to bind this handler to.
			 * The only event type that computes emit is _change_.
			 * @param {function({Object},{*},{*})} handler The handler to call when the event happens.
			 * The handler should have three parameters:
			 *
			 * - _event_ is the event object.
			 * - _newVal_ is the newly-computed value of the compute.
			 * - _oldVal_ is the value of the compute before it changed.
			 *
			 * `bind` lets you listen to a compute to know when it changes. It works just like
			 * can.Map's `[can.Map.prototype.bind bind]`:
			 * @codestart
			 * var tally = can.compute(0);
			 * tally.bind('change', function(ev, newVal, oldVal) {
			 *     console.log('The tally is now at ' + newVal + '.');
			 * });
			 *
			 * tally(tally() + 5); // The log reads:
			 *                     // 'The tally is now at 5.'
			 * @codeend
			 */
			bind: can.bindAndSetup,
			/**
			 * @function computed.unbind compute.unbind
			 * @parent can.compute
			 * @description Unbind an event handler from a compute.
			 * @signature `compute.unbind(eventType[, handler])`
			 * @param {String} eventType The type of event to unbind.
			 * The only event type available for computes is _change_.
			 * @param {function} [handler] If given, the handler to unbind.
			 * If _handler_ is not supplied, all handlers bound to _eventType_
			 * will be removed.
			 */
			unbind: can.unbindAndTeardown,
			clone: function (context) {
				if (context) {
					if (form === 'setter') {
						args[2] = context;
					} else {
						args[1] = context;
					}
				}
				return can.compute.apply(can, args);
			}
		});
	};
	// a list of temporarily bound computes
	var computes, unbindComputes = function () {
			for (var i = 0, len = computes.length; i < len; i++) {
				computes[i].unbind('change', k);
			}
			computes = null;
		};
	// Binds computes for a moment to retain their value and prevent caching
	can.compute.temporarilyBind = function (compute) {
		compute.bind('change', k);
		if (!computes) {
			computes = [];
			setTimeout(unbindComputes, 10);
		}
		computes.push(compute);
	};
	can.compute.binder = computeBinder;
	can.compute.truthy = function (compute) {
		return can.compute(function () {
			var res = compute();
			if (typeof res === 'function') {
				res = res();
			}
			return !!res;
		});
	};

	can.compute.read = function (parent, reads, options) {
		options = options || {};
		// `cur` is the current value.
		var cur = parent,
			type,
			// `prev` is the object we are reading from.
			prev,
			// `foundObs` did we find an observable.
			foundObs;
		for (var i = 0, readLength = reads.length; i < readLength; i++) {
			// Update what we are reading from.
			prev = cur;
			// Read from the compute. We can't read a property yet.
			if (prev && prev.isComputed) {
				if (options.foundObservable) {
					options.foundObservable(prev, i);
				}
				prev = prev();
			}
			// Look to read a property from something.
			if (isObserve(prev)) {
				if (!foundObs && options.foundObservable) {
					options.foundObservable(prev, i);
				}
				foundObs = 1;
				// is it a method on the prototype?
				if (typeof prev[reads[i]] === 'function' && prev.constructor.prototype[reads[i]] === prev[reads[i]]) {
					// call that method
					if (options.returnObserveMethods) {
						cur = cur[reads[i]];
					} else if (reads[i] === 'constructor' && prev instanceof can.Construct) {
						cur = prev[reads[i]];
					} else {
						cur = prev[reads[i]].apply(prev, options.args || []);
					}
				} else {
					// use attr to get that value
					cur = cur.attr(reads[i]);
				}
			} else {
				// just do the dot operator
				cur = prev[reads[i]];
			}
			// If it's a compute, get the compute's value
			// unless we are at the end of the 
			if (cur && cur.isComputed && (!options.isArgument && i < readLength - 1)) {
				if (!foundObs && options.foundObservable) {
					options.foundObservable(prev, i + 1);
				}
				cur = cur();
			}
			type = typeof cur;
			// if there are properties left to read, and we don't have an object, early exit
			if (i < reads.length - 1 && (cur === null || type !== 'function' && type !== 'object')) {
				if (options.earlyExit) {
					options.earlyExit(prev, i, cur);
				}
				// return undefined so we know this isn't the right value
				return {
					value: undefined,
					parent: prev
				};
			}
		}
		// handle an ending function
		if (typeof cur === 'function') {
			if (options.isArgument) {
				if (!cur.isComputed && options.proxyMethods !== false) {
					cur = can.proxy(cur, prev);
				}
			} else {
				if (cur.isComputed && !foundObs && options.foundObservable) {
					options.foundObservable(cur, i);
				}
				cur = cur.call(prev);
			}
		}
		// if we don't have a value, exit early.
		if (cur === undefined) {
			if (options.earlyExit) {
				options.earlyExit(prev, i - 1);
			}
		}
		return {
			value: cur,
			parent: prev
		};
	};

	return can.compute;
});