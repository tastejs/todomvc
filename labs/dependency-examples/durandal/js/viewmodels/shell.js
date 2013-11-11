/*global define*/
define(['plugins/router'], function (router) {
	'use strict';
	
	return {
		router: router,
		filter: undefined, // this is used as the global cache to figure out the filter in effect.
		activate: function () {
			router.map([
				{ route: '(:filter)', title: 'Durandal • TodoMVC', moduleId: 'js/viewmodels/todoapp' },
			]).buildNavigationModel();

			return router.activate();
		}
	};
});