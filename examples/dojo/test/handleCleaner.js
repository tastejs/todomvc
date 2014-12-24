define(function () {
	'use strict';

	/**
	 * @param {Object[]} handles The handles that should be cleaned up after each tests.
	 * @returns {Function} The function that should be called after each tests to clean up the handles.
	 */
	return function (handles) {
		return function () {
			for (var handle = null; (handle = handles.shift());) {
				if (typeof handle.close === 'function') {
					handle.close();
				} else if (typeof handle.remove === 'function') {
					handle.remove();
				} else if (typeof handle.destroyRecursive === 'function') {
					handle.destroyRecursive();
				} else if (typeof handle.destroy === 'function') {
					handle.destroy();
				} else {
					throw new Error('Handle cannot be cleaned up.');
				}
			}
		};
	};
});
