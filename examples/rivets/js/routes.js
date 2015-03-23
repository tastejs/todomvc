/*global Router, TodoStore */
(function (Router, TodoStore) {
	'use strict';

	var routes = {
		'/': function () {
			TodoStore.statusFilter = '';
		},

		'/active': function () {
			TodoStore.statusFilter = 'active';
		},

		'/completed': function () {
			TodoStore.statusFilter = 'completed';
		}
	};

	var router = new Router(routes).configure({
		notfound: function () {
			TodoStore.statusFilter = '';
		}
	});

	router.init();
})(Router, TodoStore);
