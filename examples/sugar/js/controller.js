/*global todoMVC, Router */

(function (app, Controller) {
	/**
	 * router control for todoMVC.
	 * https://github.com/flatiron/director
	 */

	var controller = new Controller();
	var routers = ['all', 'active', 'completed'];

	/**
	 * detect designated router change.
	 */
	routers.forEach(function (router) {
		controller.on(router, function () {
			app.vm.set('type', router);
		});
	});

	/**
	 * handle for undefined router.
	 */
	controller.configure({
		notfound: function notfound() {
			window.location.hash = '';
			app.vm.set('type', routers[0]);
		}
	});

	// start for router control.
	controller.init();

})(todoMVC, Router);
