/** MIT License (c) copyright B Cavalier & J Hann */

(function (define) {
define(function (require) {

	var when;

	when = require('when');

	/**
	 * Returns a view of the supplied collection adapter, such that the view
	 * appears to contain transformed items, and delegates to the supplied
	 * adapter.  If an inverse transform is supplied, either via the
	 * inverse param, or via transform.inverse, it will be used when items
	 * are added or removed
	 * @param adapter {Object} the adapter for which to create a transformed view
	 * @param transform {Function} the transform to apply to items. It may return
	 *  a promise
	 * @param [inverse] {Function} inverse transform, can be provided explicitly
	 *  if transform doesn't have an inverse property (transform.inverse). It may
	 *  return a promise
	 */
	function transformCollection(adapter, transform, inverse) {

		if(!transform) throw new Error('No transform supplied');

		inverse = inverse || transform.inverse;

		return {
			comparator: adapter.comparator,
			identifier: adapter.identifier,

			forEach: function(lambda) {
				var inflight;

				// Ensure that these happen sequentially, even when
				// the transform function is async
				function transformedLambda(item) {

					inflight = when(inflight, function() {
						return when(transform(item), lambda);
					});

					return inflight;
				}

				return when(adapter.forEach(transformedLambda), function() {
					return inflight;
				});
			},

			add: makeTransformedAndPromiseAware(adapter, 'add', inverse),

			remove: makeTransformedAndPromiseAware(adapter, 'remove', inverse),

			update: makeTransformedAndPromiseAware(adapter, 'update', inverse),

			clear: function() {
				// return the original clear result since it may be a promise
				return adapter.clear();
			},

			getOptions: function() {
				return adapter.getOptions();
			}
		}

	}

	return transformCollection;

	/**
	 * Creates a promise-aware version of the adapter method that supports
	 * transform functions that may return a promise
	 * @param adapter {Object} original adapter
	 * @param method {String} name of adapter method to make promise-aware
	 * @param transform {Function} transform function to apply to items
	 * before passing them to the original adapter method
	 * @return {Function} if transform is provided, returns a new function
	 * that applies the (possibly async) supplied transform and invokes
	 * the original adapter method with the transform result.  If transform
	 * is falsey, a no-op function will be returned
	 */
	function makeTransformedAndPromiseAware(adapter, method, transform) {
		return transform
			? function(item) {
				return when(transform(item), function(transformed) {
					return adapter[method](transformed);
				})
			}
			: noop;
	}

	function noop() {}

});
}(
	typeof define == 'function'
		? define
		: function (factory) { module.exports = factory(require); }
));