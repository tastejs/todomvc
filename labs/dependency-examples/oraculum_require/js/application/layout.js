// https://github.com/tastejs/todomvc/blob/master/codestyle.md
(function (window) {
	'use strict';

	window.define([
		'oraculum',
		'oraculum/views/mixins/layout'
	], function (Oraculum) {

		Oraculum.extend('View', 'TodoMVC.Layout', {

			// Set the top-level element to the todoapp node
			el: '#todoapp',

			// Extend our mixinOptions to export regions.
			// `RegionPublisher.ViewMixin` is provided by `Layout.ViewMixin`.
			// See: https://hackers.lookout.com/oraculum/docs/src/views/mixins/region-publisher.coffee.html
			mixinOptions: {
				regions: {
					main: '#main',
					todos: '#todo-list',
					footer: '#footer',
					clear: '#clear-completed'
				}
			}

		}, {
			// Enhance this view definition with `Layout.ViewMixin`.
			// See: https://hackers.lookout.com/oraculum/docs/src/views/mixins/layout.coffee.html
			mixins: ['Layout.ViewMixin']
		});

	});

})( window );
