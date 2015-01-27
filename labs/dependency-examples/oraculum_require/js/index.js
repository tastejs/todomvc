// https://github.com/tastejs/todomvc/blob/master/codestyle.md
(function (window) {
	'use strict';

	window.require([
		'oraculum',
		'application/layout',
		'application/controllers/todomvc',
		'oraculum/application/index'
	], function (Oraculum) {

		var routes = function (match) {
			match('', 'TodoMVC.Controller#index');
			match('*url', 'TodoMVC.Controller#hashslash');
		};

		Oraculum.get('Application', {
			layout: 'TodoMVC.Layout',
			routes: routes,
			pushState: false
		});

	});

})( window );
