/*global window, Router, todoList */
(function (window, Router, todoList) {
	'use strict';

	// We're using https://github.com/flatiron/director for routing

	var router = new Router({
		'/active': function () {
			todoList.set('currentFilter', 'active');
		},
		'/completed': function () {
			todoList.set('currentFilter', 'completed');
		}
	});

	router.configure({
		notfound: function () {
			window.location.hash = '';
			todoList.set('currentFilter', 'all');
		}
	});

	router.init();

})(window, Router, todoList);
