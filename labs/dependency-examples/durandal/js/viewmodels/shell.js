/*global define */
define([
	'bower_components/durandal/plugins/router',
], function (router) {
	'use strict';

	return {
		router: router,

		// this is used as the global cache to figure out the filter in effect.
		filter: undefined,

		activate: function () {
			return router.activate('todoapp');
		}
	};
});