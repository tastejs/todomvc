(function (todo) {
	'use strict';

	var ENTER_KEY = 13;

	todo.MainView = function (scope, template, model, router, dispatcher) {

		// get data from the injected model
		var items = model.get();

		// template function: returns an array of items to display
		// can be different depending on the filter selected
		scope.items = function () {
			var filter = router.getRoute();
			if (filter === '') {
				return items;
			}
			return items.filter(function (item) {
				return filter === 'active' ? !item.completed : item.completed;
			});
		};

		// template function: set all items to either completed or not completed
		scope.toggleAll = function (event) {
			items.forEach(function (item) {
				item.completed = event.currentTarget.checked;
			});
			update();
		};

		// template function: set 1 item to either completed or not completed
		scope.toggle = function (event, item) {
			item.completed = !item.completed;
			update();
		};

		// template function: returns a css class depending if the item is completed or not completed
		scope.completedClass = function (completed) {
			return completed ? 'completed' : '';
		};

		// template function: removes an item
		scope.remove = function (event, item) {
			if (item) {
				items.splice(items.indexOf(item), 1);
				update();
			}
		};

		// template function: edit an item (used on a double click event)
		scope.edit = function (event, item) {
			item.editing = 'editing';
			template.render();
		};

		// template function: during edit mode, changes the value of an item after an enter key press
		scope.update = function (event, item) {
			var value = event.currentTarget.value.trim();
			if (event.which === ENTER_KEY || event.type === 'blur') {
				if (value) {
					item.title = value;
				}
				else {
					items.splice(items.indexOf(item), 1);
				}
				item.editing = '';
				event.currentTarget.value = value;
				update();
			}
		};

		// save the changes to the model and dispatch a custom event to render the templates
		function update() {
			model.set(items);
			dispatcher.dispatch('render');
		}

		// listen to a custom event to render the main view
		dispatcher.addEventListener('render', function () {
			items = model.get();
			scope.active = model.getActive();
			scope.isVisible = scope.items().length > 0 ? true : false;
			scope.allCompleted = items.length > 0 && scope.active === 0 ? true : false;
			template.render();
		});

	};

})(window.todo = window.todo || {});
