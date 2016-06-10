/*global define:false */
(function () {

	'use strict';

	define([], function () {

		var FooterView = function (scope, template, model, router, dispatcher) {

			// get data from the injected model
			var items = model.get();

			// template function: returns a css class for the current filter (all/active/completed)
			scope.highlightFilter = function (filter) {
				var route = router.getRoute();
				return route === filter ? 'selected' : '';
			};

			// template function: returns the number of completed items
			scope.clearCompleted = function () {
				items = items.filter(function (item) {
					return !item.completed;
				});
				update();
			};

			// save the changes to the model and dispatch a custom event to render the templates
			function update() {
				model.set(items);
				dispatcher.dispatch('render');
			}

			// listen to a custom event to render the footer view
			dispatcher.addEventListener('render', function () {
				items = model.get();
				scope.active = model.getActive();
				scope.completed = items.length - scope.active;
				scope.itemLabel = scope.active === 1 ? 'item' : 'items';
				scope.footerVisible = items.length > 0 ? true : false;
				scope.clearCompletedVisible = scope.completed > 0 ? true : false;
				template.render();
			});

		};

		return FooterView;

	});

})();
