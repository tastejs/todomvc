// TODO: Remove this file once Dojo provides this feature out-of-the-box.
define([
	'dojo/_base/array',
	'dojo/has'
], function (array, has) {
	'use strict';

	var arrayProto = Array.prototype;

	has.add('object-is-api', typeof Object.is === 'function');

	var areSameValues = has('object-is-api') ? Object.is : function (lhs, rhs) {
		return lhs === rhs && (lhs !== 0 || 1 / lhs === 1 / rhs) || lhs !== lhs && rhs !== rhs;
	};

	function watch(o, prop, callback) {
		var hWatch;

		if (o && typeof o.watch === 'function') {
			hWatch = o.watch(prop, function (name, old, current) {
				if (!areSameValues(old, current)) {
					callback(current, old);
				}
			});
		} else {
			console.log('Attempt to observe non-stateful ' + o + ' with ' + prop + '. Observation not happening.');
		}

		return {
			remove: function () {
				if (hWatch) {
					hWatch.remove();
				}
			}
		};
	}

	function getProps(list) {
		return array.map(list, function (p) {
			return p.each ?
				array.map(p.target, function (entry) {
					return entry.get ? entry.get(p.targetProp) : entry[p.targetProp];
				}) :
				p.target.get ? p.target.get(p.targetProp) :
					p.target[p.targetProp];
		});
	}

	function removeHandles(handles) {
		var h = null;
		while ((h = handles.shift())) {
			h.remove();
		}
	}

	/**
	 * Returns a pointer to a dojo/Stateful property that are computed with other dojo/Stateful properties.
	 * @function computed
	 * @param {dojo/Stateful} target dojo/Stateful where the property is in.
	 * @param {string} targetProp The property name.
	 * @param {Function} compute
	 *     The function, which takes dependent dojo/Stateful property values as the arguments,
	 *     and returns the computed value.
	 * @param {...dojox/mvc/at} var_args The dojo/Stateful properties this computed property depends on.
	 * @returns {Object} The handle to clean up the computed property created. To clean it up, call its `remove()` method.
	 * @example
	 * <caption>
	 *     If stateful.first is "John" and stateful.last is "Doe", stateful.name becomes "John Doe".
	 * </caption>
	 * computed(stateful, 'name', function(first, last){
	 *     return first + ' ' + last;
	 * }, at(stateful, 'first'), at(stateful, 'last'));
	 * @example
	 * <caption>
	 *     If names is an array of objects with name property,
	 *     stateful.totalNameLength becomes the sum of length of name property of each array item.
	 * </caption>
	 * computed(stateful, 'totalNameLength', function(names){
	 *     var total = 0;
	 *     array.forEach(names, function(name){
	 *         total += name.length;
	 *     });
	 *     return total;
	 * }, lang.mixin(at(names, 'name'), {each: true}));
	 */
	return function (target, targetProp, compute) {
		function applyComputed(data) {
			var result;
			var hasResult;

			try {
				result = compute.apply(target, data);
				hasResult = true;
			} catch (e) {
				console.error('Error during computed property callback: ' + (e && e.stack || e));
			}

			if (hasResult) {
				if (typeof target.set === 'function') {
					target.set(targetProp, result);
				} else {
					target[targetProp] = result;
				}
			}
		}

		if (target === null || target === undefined) {
			throw new Error('Computed property cannot be applied to null.');
		}
		if (targetProp === '*') {
			throw new Error('Wildcard property cannot be used for computed properties.');
		}

		var deps = arrayProto.slice.call(arguments, 3);
		var hDep = array.map(deps, function (dep, index) {
			function observeEntry(entry) {
				return watch(entry, dep.targetProp, function () {
					applyComputed(getProps(deps));
				});
			}

			if (dep.targetProp === '*') {
				throw new Error('Wildcard property cannot be used for computed properties.');
			} else if (dep.each) {
				var hArray;
				var hEntry = array.map(dep.target, observeEntry);

				if (dep.target && typeof dep.target.watchElements === 'function') {
					hArray = dep.target.watchElements(function (idx, removals, adds) {
						removeHandles(arrayProto.splice.apply(hEntry, [idx, removals.length].concat(array.map(adds, observeEntry))));
						applyComputed(getProps(deps));
					});
				} else {
					console.log('Attempt to observe non-stateful-array ' + dep.target + '. Observation not happening.');
				}

				return {
					remove: function () {
						if (hArray) {
							hArray.remove();
						}
						removeHandles(hEntry);
					}
				};
			} else {
				return watch(dep.target, dep.targetProp, function (current) {
					var list = [];
					arrayProto.push.apply(list, getProps(deps.slice(0, index)));
					list.push(current);
					arrayProto.push.apply(list, getProps(deps.slice(index + 1)));
					applyComputed(list);
				});
			}
		});

		applyComputed(getProps(deps));
		return {
			remove: function () {
				removeHandles(hDep);
			}
		};
	};
});
