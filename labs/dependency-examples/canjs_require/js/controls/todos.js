/*global define, window */
/*jshint newcap:false */
define([
	'can/util/library',
	'can/control'
], function (can, Control) {
	'use strict';

	var ENTER_KEY = 13;
	var Todos = Control({
		// Default options
		defaults: {
			view: 'views/todos.ejs'
		}
	}, {
		// Initialize the Todos list
		init: function () {
			// Render the Todos we passed in the options
			this.element.append(can.view(this.options.view, {
				todos: this.options.todos
			}));
		},

		// Listen for when a new Todo has been entered
		'#new-todo keyup': function (el, e) {
			var value = can.trim(el.val());
			if (e.which === ENTER_KEY && value !== '') {
				// Create a new Model which was passed as an option when initializing the control
				new this.options.Model({
					text: value,
					complete: false
				}).save(function () {
					el.val('');
				});
			}
		},

		// Handle a newly created Todo (`Model` that was passed when initializing this Control)
		'{Model} created': function (list, e, item) {
			this.options.todos.push(item);
			// Reset the filter so that you always see your new todo
			this.options.state.attr('filter', '');
		},

		// Listener for when the filter observe
		'{state} filter': function (state, event, filter) {
			// Update the filter of our Todo list
			this.options.todos.attr('filter', filter || '');
			// Remove the `selected` class from the old link and add it to the link for the current location hash
			this.element.find('#filters a').removeClass('selected').filter('[href="' + window.location.hash + '"]')
				.addClass('selected');
		},

		// Listen for editing a Todo
		'.todo dblclick': function (el) {
			el.data('todo').attr('editing', true).save(function () {
				el.children('.edit').focus();
			});
		},

		// Update a todo
		updateTodo: function (el) {
			var value = can.trim(el.val());
			var todo = el.closest('.todo').data('todo');

			// If we don't have a todo we don't need to do anything
			if (!todo) {
				return;
			}

			if (value === '') {
				todo.destroy();
			} else {
				todo.attr({
					editing: false,
					text: value
				}).save();
			}
		},

		// Listen for an edited Todo
		'.todo .edit keyup': function (el, e) {
			if (e.which === ENTER_KEY) {
				this.updateTodo(el);
			}
		},

		'.todo .edit focusout': 'updateTodo',

		// Listen for the toggled completion of a Todo
		'.todo .toggle click': function (el) {
			el.closest('.todo').data('todo')
				.attr('complete', el.is(':checked'))
				.save();
		},

		// Listen for a removed Todo
		'.todo .destroy click': function (el) {
			el.closest('.todo').data('todo').destroy();
		},

		// Listen for toggle all completed Todos
		'#toggle-all click': function (el) {
			var toggle = el.prop('checked');
			can.each(this.options.todos, function (todo) {
				todo.attr('complete', toggle).save();
			});
		},

		// Listen for removing all completed Todos
		'#clear-completed click': function () {
			can.each(this.options.todos.byFilter('completed'), function (todo) {
				todo.destroy();
			});
		}
	});

	return Todos;
});
