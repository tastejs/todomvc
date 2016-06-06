'use strict';

var tools = require('./tools');

var routes = {
	'#/': 'show-all',
	'#/completed': 'show-completed',
	'#/active': 'show-active'
};

/**
 * A quick plugin to interface with a url-highway router.
 * @param {url highway} the router's instance
 * @constructor
 */
module.exports = function RouterPlugin(router) {
	var currentRoute = router.getLastRoute();

	/**
	 * Set a given className to a dom element if its hash matches with the url's hash
	 * @param link
	 * @param className
	 */
	this.isLinkActive = function isLinkActive(link, className) {
		if (router.getLastRoute() === link.hash) {
			link.classList.add(className);
		}

		router.watch(function (route) {
			tools.toggleClass.call(link, link.hash === route, className);
		});
	};

	this.toggleClassOnRouteChange = function toggleClassOnRouteChange(list) {
		router.watch(function (route) {
			list.classList.remove(routes[currentRoute]);
			list.classList.add(routes[route]);
			currentRoute = route;
		});
	};

	router.start('#/');
};
