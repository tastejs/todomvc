/*global define:false */
(function () {

	'use strict';

	define([], function () {

		var ENTER_KEY = 13;

		var HeaderView = function (scope, template, model, dispatcher) {

			// get data from the injected model
			var items = model.get();

			// template function: add a new item on an enter key press
			scope.add = function (event) {
				var value = event.currentTarget.value.trim();
				if (event.which === ENTER_KEY && value !== '') {
					items.push({
						title: value,
						completed: false
					});
					event.currentTarget.value = '';
					update();
				}
			};

			// template function: remove text from the input (used on blur event)
			scope.clear = function (event) {
				event.currentTarget.value = '';
			};

			// save the changes to the model and dispatch a custom event to render the templates
			function update() {
				model.set(items);
				dispatcher.dispatch('render');
			}

			// listen to a custom event to render the header view
			dispatcher.addEventListener('render', function () {
				items = model.get();
				template.render();
			});

		};

		return HeaderView;


	});

})();
