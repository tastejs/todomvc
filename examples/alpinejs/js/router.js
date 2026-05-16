(function (window) {
	'use strict';

	window.setUpTodoAppRouter = function (todoapp) {
		var router = new window.Router();

		['all', 'active', 'completed'].forEach(function (visibility) {
			router.on(visibility, function () {
				todoapp.visibility = visibility;
			});
		});

		router.configure({
			notfound: function () {
				window.location.hash = '';
				todoapp.visibility = 'all';
			}
		});

		router.init();
	};

})(window);