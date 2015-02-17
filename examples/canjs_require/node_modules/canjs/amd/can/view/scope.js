/*!
 * CanJS - 2.0.7
 * http://canjs.us/
 * Copyright (c) 2014 Bitovi
 * Wed, 26 Mar 2014 16:12:27 GMT
 * Licensed MIT
 * Includes: CanJS default build
 * Download from: http://canjs.us/
 */
define(["can/util/library", "can/construct", "can/map", "can/list", "can/view", "can/compute"], function (can) {
	var escapeReg = /(\\)?\./g;
	var escapeDotReg = /\\\./g;
	var getNames = function (attr) {
		var names = [],
			last = 0;
		attr.replace(escapeReg, function (first, second, index) {
			if (!second) {
				names.push(attr.slice(last, index)
					.replace(escapeDotReg, '.'));
				last = index + first.length;
			}
		});
		names.push(attr.slice(last)
			.replace(escapeDotReg, '.'));
		return names;
	};
	/**
	 * @add can.view.Scope
	 */
	var Scope = can.Construct.extend(

		/**
		 * @static
		 */
		{
			// reads properties from a parent.  A much more complex version of getObject.
			/**
			 * @function can.view.Scope.read read
			 * @parent can.view.Scope.static
			 *
			 * @signature `Scope.read(parent, reads, options)`
			 *
			 * Read properties from an object.
			 *
			 * @param {*} parent A parent object to read properties from.
			 * @param {Array<String>} reads An array of properties to read.
			 * @param {can.view.Scope.readOptions} options Configures
			 * how to read properties and values and register callbacks
			 *
			 * @return {{value: *, parent: *}} Returns an object that
			 * provides the value and parent object.
			 *
			 * @option {*} value The value found by reading `reads` properties.  If
			 * no value was found, value will be undefined.
			 *
			 * @option {*} parent The most immediate parent object of the value specified by `key`.
			 *
			 * @body
			 *
			 *
			 */
			read: can.compute.read
		},
		/**
		 * @prototype
		 */
		{
			init: function (context, parent) {
				this._context = context;
				this._parent = parent;
			},
			/**
			 * @function can.view.Scope.prototype.attr
			 *
			 * Reads a value from the current context or parent contexts.
			 *
			 * @param {can.Mustache.key} key A dot seperated path.  Use `"\."` if you have a
			 * property name that includes a dot.
			 *
			 * @return {*} The found value or undefined if no value is found.
			 *
			 * @body
			 *
			 * ## Use
			 *
			 * `scope.attr(key)` looks up a value in the current scope's
			 * context, if a value is not found, parent scope's context
			 * will be explored.
			 *
			 *     var list = [{name: "Justin"},{name: "Brian"}],
			 *     justin = list[0];
			 *
			 *     var curScope = new can.view.Scope(list).add(justin);
			 *
			 *     curScope.attr("name") //-> "Justin"
			 *     curScope.attr("length") //-> 2
			 */
			attr: function (key) {
				// reads for whatever called before attr.  It's possible
				// that this.read clears them.  We want to restore them.
				var previousReads = can.__clearReading && can.__clearReading(),
					res = this.read(key, {
						isArgument: true,
						returnObserveMethods: true,
						proxyMethods: false
					})
						.value;
				if (can.__setReading) {
					can.__setReading(previousReads);
				}
				return res;
			},
			/**
			 * @function can.view.Scope.prototype.add
			 *
			 * Creates a new scope with its parent set as the current scope.
			 *
			 * @param {*} context The context of the new scope object.
			 *
			 * @return {can.view.Scope}  A scope object.
			 *
			 * @body
			 *
			 * ## Use
			 *
			 * `scope.add(context)` creates a new scope object that
			 * first looks up values in context and then in the
			 * parent `scope` object.
			 *
			 *     var list = [{name: "Justin"},{name: "Brian"}],
			 *      justin = list[0];
			 *
			 *     var curScope = new can.view.Scope(list).add(justin);
			 *
			 *     curScope.attr("name") //-> "Justin"
			 *     curScope.attr("length") //-> 2
			 */
			add: function (context) {
				if (context !== this._context) {
					return new this.constructor(context, this);
				} else {
					return this;
				}
			},
			/**
			 * @function can.view.Scope.prototype.computeData
			 *
			 * @description Provides a compute that represents a
			 * key's value and other information about where the value was found.
			 *
			 *
			 * @param {can.Mustache.key} key A dot seperated path.  Use `"\."` if you have a
			 * property name that includes a dot.
			 *
			 * @param {can.view.Scope.readOptions} [options] Options that configure how the `key` gets read.
			 *
			 * @return {{}} An object with the following values:
			 *
			 * @option {can.compute} compute A compute that returns the
			 * value of `key` looked up in the scope's context or parent context. This compute can
			 * also be written to, which will set the observable attribute or compute value at the
			 * location represented by the key.
			 *
			 * @option {can.view.Scope} scope The scope the key was found within. The key might have
			 * been found in a parent scope.
			 *
			 * @option {*} initialData The initial value at the key's location.
			 *
			 * @body
			 *
			 * ## Use
			 *
			 * `scope.computeData(key, options)` is used heavily by [can.Mustache] to get the value of
			 * a [can.Mustache.key key] value in a template. Configure how it reads values in the
			 * scope and what values it returns with the [can.view.Scope.readOptions options] argument.
			 *
			 *     var context = new Map({
			 *       name: {first: "Curtis"}
			 *     })
			 *     var scope = new can.view.Scope(context)
			 *     var computeData = scope.computeData("name.first");
			 *
			 *     computeData.scope === scope //-> true
			 *     computeData.initialValue    //-> "Curtis"
			 *     computeData.compute()       //-> "Curtis"
			 *
			 * The `compute` value is writable.  For example:
			 *
			 *     computeData.compute("Andy")
			 *     context.attr("name.first") //-> "Andy"
			 *
			 */
			computeData: function (key, options) {
				options = options || {
					args: []
				};
				var self = this,
					rootObserve, rootReads, computeData = {
						compute: can.compute(function (newVal) {
							if (arguments.length) {
								// check that there's just a compute with nothing from it ...
								if (rootObserve.isComputed && !rootReads.length) {
									rootObserve(newVal);
								} else {
									var last = rootReads.length - 1;
									Scope.read(rootObserve, rootReads.slice(0, last))
										.value.attr(rootReads[last], newVal);
								}
							} else {
								if (rootObserve) {
									return Scope.read(rootObserve, rootReads, options)
										.value;
								}
								// otherwise, go get the value
								var data = self.read(key, options);
								rootObserve = data.rootObserve;
								rootReads = data.reads;
								computeData.scope = data.scope;
								computeData.initialValue = data.value;
								return data.value;
							}
						})
					};
				return computeData;
			},
			/**
			 * @hide
			 * @function can.view.Scope.prototype.read read
			 *
			 * Read a key value from the scope and provide useful information
			 * about what was found along the way.
			 *
			 * @param {can.Mustache.key} attr A dot seperated path.  Use `"\."` if you have a property name that includes a dot.
			 * @param {can.view.Scope.readOptions} options that configure how this gets read.
			 *
			 * @return {{}}
			 *
			 * @option {Object} parent the value's immediate parent
			 *
			 * @option {can.Map|can.compute} rootObserve the first observable to read from.
			 *
			 * @option {Array<String>} reads An array of properties that can be used to read from the rootObserve to get the value.
			 *
			 * @option {*} value the found value
			 */
			read: function (attr, options) {
				// check if we should be running this on a parent.
				if (attr.substr(0, 3) === '../') {
					return this._parent.read(attr.substr(3), options);
				} else if (attr === '..') {
					return {
						value: this._parent._context
					};
				} else if (attr === '.' || attr === 'this') {
					return {
						value: this._context
					};
				}
				// Split the name up.
				var names = attr.indexOf('\\.') === -1 ?
				// Reference doesn't contain escaped periods
				attr.split('.')
				// Reference contains escaped periods (`a.b\c.foo` == `a["b.c"].foo)
				: getNames(attr),
					// The current context (a scope is just data and a parent scope).
					context,
					// The current scope.
					scope = this,
					// While we are looking for a value, we track the most likely place this value will be found.  
					// This is so if there is no me.name.first, we setup a listener on me.name.
					// The most likely canidate is the one with the most "read matches" "lowest" in the
					// context chain.
					// By "read matches", we mean the most number of values along the key.
					// By "lowest" in the context chain, we mean the closest to the current context.
					// We track the starting position of the likely place with `defaultObserve`.
					defaultObserve,
					// Tracks how to read from the defaultObserve.
					defaultReads = [],
					// Tracks the highest found number of "read matches".
					defaultPropertyDepth = -1,
					// `scope.read` is designed to be called within a compute, but
					// for performance reasons only listens to observables within one context.
					// This is to say, if you have me.name in the current context, but me.name.first and
					// we are looking for me.name.first, we don't setup bindings on me.name and me.name.first.
					// To make this happen, we clear readings if they do not find a value.  But,
					// if that path turns out to be the default read, we need to restore them.  This
					// variable remembers those reads so they can be restored.
					defaultComputeReadings,
					// Tracks the default's scope.
					defaultScope,
					// Tracks the first found observe.
					currentObserve,
					// Tracks the reads to get the value for a scope.
					currentReads;
				// While there is a scope/context to look in.
				while (scope) {
					// get the context
					context = scope._context;
					if (context !== null) {
						// Lets try this context
						var data = Scope.read(context, names, can.simpleExtend({
							// Called when an observable is found.
							foundObservable: function (observe, nameIndex) {
								// Save the current observe.
								currentObserve = observe;
								currentReads = names.slice(nameIndex);
							},
							// Called when we were unable to find a value.
							earlyExit: function (parentValue, nameIndex) {
								// If this has more matching values,
								if (nameIndex > defaultPropertyDepth) {
									// save the state.
									defaultObserve = currentObserve;
									defaultReads = currentReads;
									defaultPropertyDepth = nameIndex;
									defaultScope = scope;
									// Clear and save readings so next attempt does not use these readings
									defaultComputeReadings = can.__clearReading && can.__clearReading();
								}
							}
						}, options));
						// Found a matched reference.
						if (data.value !== undefined) {
							return {
								scope: scope,
								rootObserve: currentObserve,
								value: data.value,
								reads: currentReads
							};
						}
					}
					// Prevent prior readings.
					if (can.__clearReading) {
						can.__clearReading();
					}
					// Move up to the next scope.
					scope = scope._parent;
				}
				// If there was a likely observe.
				if (defaultObserve) {
					// Restore reading for previous compute
					if (can.__setReading) {
						can.__setReading(defaultComputeReadings);
					}
					return {
						scope: defaultScope,
						rootObserve: defaultObserve,
						reads: defaultReads,
						value: undefined
					};
				} else {
					// we found nothing and no observable
					return {
						names: names,
						value: undefined
					};
				}
			}
		});
	can.view.Scope = Scope;
	return Scope;
});