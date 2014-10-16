/*global define */
define(function () {
	'use strict';

	/**
	 * Custom data linking handler for setting the "completed" class.
	 * The intent here is just to show that you can implement custom
	 * handlers for data/dom linking to do anything that isn't provided
	 * by default.
	 */
	return function (node, data, info) {
		// Simple-minded implementation just to show custom data linking handler
		node.className = data[info.prop] ? 'completed' : '';
	};
});
