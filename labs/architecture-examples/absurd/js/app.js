(function( window ) {
	'use strict';

	window.absurd = Absurd(); // AbsurdJS API
	window.App = {}; // namespace

	absurd.component('Application', {
		todos: [],
		ready: function(router) {

			var self = this,
				model = App.Model(),
				header = App.Header(model),
				main = App.Main(model),
				footer = App.Footer(model);

			router
			.add(/active\/?$/, function() {
				main.update('active');
				footer.update(1);
			})
			.add(/completed\/?$/, function() {
				main.update('completed');
				footer.update(2);
			})
			.add(function() {
				main.update();
				footer.update();
			})
			.listen();
		}
	})();


})( window );
