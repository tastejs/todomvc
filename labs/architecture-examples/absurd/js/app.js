(function( window ) {
	'use strict';

	window.absurd = Absurd(); // AbsurdJS API
	window.App = {}; // namespace

	// Defininf a simple class which acts as a wrapper
	// around the local storage's API. It is registered as
	// dependency ready for inejction.
	absurd.di.register('storage', {
		key: 'todos-absurdjs',
		put: function(todos) {
			window.localStorage.setItem(this.key, JSON.stringify(todos));
		},
		get: function() {
			if(window.localStorage) {
				var value = window.localStorage.getItem(this.key);
				return value != null ? JSON.parse(value) : [];
			}
			return [];
		}
	});

	// The main class of the application.
	absurd.component('Application', {
		// Called when the current page is fully loaded.
		ready: function(router) {

 			// May be required during the testing because
 			// Phantomjs keeps the localStorage data.
			// window.localStorage.clear();

			// Definition of the model and views/controllers. 
			var model = App.Model(),
				header = App.Header(model),
				main = App.Main(model),
				footer = App.Footer(model);

			// Setting up the router.
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
				main.update('all');
				footer.update(0);
			})
			.listen(10) // listening for route changes
			.check(); // bootstrapping
		}
	})();


})( window );
