/*global riot, route, store */
(function () {
	'use strict';
	// let riot compiling all the external tags
	// of course this step could be avoided precompiling them to js files
	riot.compile(function () {
		riot.mount('todo', { store: store });

		// set the router callback
		// in this case we have only one dimention urls
		route(function (filter) {
			store.filter(filter || 'all');
		});

		// start the router
		route.start(true);
	});
})();
