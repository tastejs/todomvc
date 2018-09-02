/*global window, Ractive */
(function (window, Ractive) {
	'use strict';

	// Create some filter functions, which we'll need later
	var filters = {
		completed: function (item) { return item.completed; },
		active: function (item) { return !item.completed; }
	};

	// The keycode for the 'enter' and 'escape' keys
	var ENTER_KEY = 13;
	var ESCAPE_KEY = 27;

	// Create our Ractive instance
	var todoList = new Ractive({
		// Specify a target element - an ID, a CSS selector, or the element itself
		el: '.todoapp',

		// Specify a template, or the ID of a script tag containing the template
		template: '#main',

		// This is our viewmodel - as well as our list of tasks (which gets added
		// later from localStorage - see persistence.js), it includes helper
		// functions and computed values
		data: {
			filter: function (item) {
				// Because we're doing `this.get('currentFilter')`, Ractive understands
				// that this function needs to be re-executed reactively when the value of
				// `currentFilter` changes
				var currentFilter = this.get('currentFilter');

				if (currentFilter === 'all') {
					return true;
				}

				return filters[currentFilter](item);
			},

			// completedTasks() and activeTasks() are computed values, that will update
			// our app view reactively whenever `items` changes (including changes to
			// child properties like `items[1].completed`)
			completedTasks: function () {
				return this.get('items').filter(filters.completed);
			},

			activeTasks: function () {
				return this.get('items').filter(filters.active);
			},

			// By default, show all tasks. This value changes when the route changes
			// (see routes.js)
			currentFilter: 'all'
		},

		// We can define custom events. Here, we're defining an `enter` event,
		// and an `escape` event, which fire when the user hits those keys while
		// an input is focused:
		//
		// <input id="edit" class="edit" on-blur-enter="submit" on-escape="cancel" autofocus>
		events: (function () {
			var makeCustomEvent = function (keyCode) {
				return function (node, fire) {
					var keydownHandler = function (event) {
						if (event.which === keyCode) {
							fire({
								node: node,
								original: event
							});
						}
					};

					node.addEventListener('keydown', keydownHandler, false);

					return {
						teardown: function () {
							node.removeEventListener('keydown', keydownHandler, false);
						}
					};
				};
			};

			return {
				enter: makeCustomEvent(ENTER_KEY),
				escape: makeCustomEvent(ESCAPE_KEY)
			};
		}())
	});


	// Here, we're defining how to respond to user interactions. Unlike many
	// libraries, where you use CSS selectors to dictate what event corresponds
	// to what action, in Ractive the 'meaning' of the event is baked into the
	// template itself (e.g. <button on-click='remove'>Remove</button>).
	todoList.on({

		// Removing a todo is as straightforward as splicing it out of the array -
		// Ractive intercepts calls to array mutator methods and updates the view
		// accordingly. The DOM is updated in the most efficient manner possible.
		remove: function (event, index) {
			this.get('items').splice(index, 1);
		},

		// The `event` object contains useful properties for (e.g.) retrieving
		// data from the DOM
		newTodo: function (event) {
			var description = event.node.value.trim();

			if (!description) {
				return;
			}

			this.get('items').push({
				description: description,
				completed: false
			});

			event.node.value = '';
		},

		edit: function (event) {
			this.set(event.keypath + '.editing', true);
			this.nodes.edit.value = event.context.description;
		},

		submit: function (event) {
			var description = event.node.value.trim();

			if (!description) {
				this.get('items').splice(event.index.i, 1);
				return;
			}

			this.set(event.keypath + '.description', description);
			this.set(event.keypath + '.editing', false);
		},

		cancel: function (event) {
			this.set(event.keypath + '.editing', false);
		},

		clearCompleted: function () {
			var items = this.get('items');
			var i = items.length;

			while (i--) {
				if (items[i].completed) {
					items.splice(i, 1);
				}
			}
		},

		toggleAll: function (event) {
			var i = this.get('items').length;
			var completed = event.node.checked;
			var changeHash = {};

			while (i--) {
				changeHash['items[' + i + '].completed'] = completed;
			}

			this.set(changeHash);
		}
	});

	window.todoList = todoList;

})(window, Ractive);
