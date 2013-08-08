/*global define*/
define([
	'bower_components/durandal/plugins/router',
], function (router) {

	'use strict';
	
	return {
		router: router,
		filter: undefined, // this is used as the global cache to figure out the filter in effect.
		activate: function () {
			return router.activate('todoapp');
		}
	};
});