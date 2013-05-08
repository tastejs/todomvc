/*global Router:false */
(function (todo, Router) {

	'use strict';

	todo.Router = function (dispatcher) {

		// create the router (director.js)
		var router = new Router().init();

		// dispatch a custom event to render the template on a route change
		router.on(/.*/, function () {
			dispatcher.dispatch('render');
		});

		return {
			getRoute: function () {
				return router.getRoute()[0];
			}
		};
	};

})(window.todo = window.todo || {}, Router);
