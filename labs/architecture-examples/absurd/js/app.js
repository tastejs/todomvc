(function( window ) {
	'use strict';

	window.absurd = Absurd(); // AbsurdJS API
	window.App = {}; // namespace

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
				main.update('all');
				footer.update('all');
			})
			.listen();
		}
	})();


})( window );
