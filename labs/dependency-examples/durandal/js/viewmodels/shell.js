/*global define*/
define([
	'bower_components/durandal/plugins/router',
	'bower_components/durandal/app'
], function (router, app) {

	'use strict';
	
	return {
		router: router,
		search: function () {
			//It's really easy to show a message box.
			//You can add custom options too. Also, it returns a promise for the user's response.
			app.showMessage('Search not yet implemented...');
		},
		activate: function () {
			return router.activate('todoapp');
		}
	};
});