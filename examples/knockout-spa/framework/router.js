/*! knockout-spa (https://github.com/onlyurei/knockout-spa) * Copyright 2015-2016 Cheng Fan
    MIT Licensed (https://raw.githubusercontent.com/onlyurei/knockout-spa/master/LICENSE) */
define(['framework/page', 'app/shared/routes', 'util/dom', 'director', 'jquery', 'sugar'], function (
	Page, Routes, Dom, Router) {

	function initPage(pageModulePath, controller) {
		require([pageModulePath], function (page) {
			var pathParts = pageModulePath.split('/');
			var pageName = pathParts.slice(1, pathParts.length - 1).join('-');
			var initialized = Page.init(pageName, page, pageModulePath, controller);
			if (initialized === false) {
				routes['/error/:code'](403);
			}
		});
	}

	var routes = {};
	Object.each(Routes, function (key, value) {
		var values = value.split(' ');
		var pageModulePath = values[0];
		var controllerName = values[1];
		routes[key] = function () {
			Page.loading = true;
			var args = Array.prototype.slice.call(arguments, 0);
			var controller = controllerName ? function (page) {
				page.controllers[controllerName].apply(page, args);
			} : null;
			initPage(pageModulePath, controller);
		};
	});

	var router = new Router(routes).configure({
		strict: false,
		html5history: false, //TODO change to true to use pushState if allowable
		// jscs:disable requireCamelCaseOrUpperCaseIdentifiers
		convert_hash_in_init: false/*,
		notfound: function () {
			routes['/error/:code'](404);
		}*/
	});

	router.init('/');

	$('body').on('click', 'a[href]', function (event) {
		var href = $(this).attr('href').compact();
		var origin = Dom.getOriginFromLocation($(this)[0]);
		if (href && !href.startsWith('#') && ((origin === window.location.origin) || !origin) &&
			($(this).attr('target') != '_blank') && !$(this).data('go') && !event.ctrlKey && !event.metaKey) {
			event.preventDefault();
			Page.loading = true;
			router.setRoute(href);
		}
	});

	return router;

});
