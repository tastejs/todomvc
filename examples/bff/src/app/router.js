/* global define, Router */
define(['bff/record'], function (Record) {

	'use strict';

	// Define a router record constructor on the fly and create one instance of it
	var RouterRecord = Record.withProperties({ route: 'string' });
	var routerRecord = new RouterRecord({ route: '' });
	// BFF does not have any router module, instead we use the Director Router
	var directorRouter = new Router();
	// Workaround for a strange Director Router bug
	location.hash = location.hash || '#/';
	// Whenever the Director Router reports a route change we update our "route" state, thus going from an event based
	// to a state based approach to routing
	directorRouter.on(/(.*)/, function (route) { routerRecord.route = route; });
	directorRouter.init();

	// Return router singleton
	return routerRecord;

});
