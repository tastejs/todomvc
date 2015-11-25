/*global Thorax, ENTER_KEY, ESCAPE_KEY*/
(function () {
	'use strict';

	// Todo Item View
	// --------------

	// The DOM element for a todo item...
	Thorax.View.extend({

		//... is a list tag.
		tagName:  'li',

		// Cache the template function for a single item.
		name: 'todo-item',

		// The DOM events specific to an item.
		events: {
			'click .toggle':	'toggleCompleted',
			'dblclick label':	'edit',
			'click .destroy':	'clear',
			'keyup .edit':		'keyListener',
			'blur .edit':		'close',
			// The "rendered" event is triggered by Thorax each time render()
			// is called and the result of the template has been appended
			// to the View's $el
			rendered: function () {
				this.$el.toggleClass('completed', this.model.get('completed'));
			}
		},

		// Toggle the `"completed"` state of the model.
		toggleCompleted: function () {
			this.model.toggle();
		},

		// Switch this view into `"editing"` mode, displaying the input field.
		edit: function () {
			this.$el.addClass('editing');
			this.$('.edit').val(this.model.get('title')).focus();
		},

		// Close the `"editing"` mode.
		close: function () {
			// If editing was cancelled, don't save
			if (!this.$el.hasClass('editing')) {
				return;
			}

			var value = this.$('.edit').val().trim();

			if (value) {
				this.model.save({ title: value });
			} else {
				this.clear();
			}

			this.$el.removeClass('editing');
		},

		// User cancelled editing, don't update the todo.
		cancelEdits: function () {
			this.$el.removeClass('editing');
		},

		// Enter completes the editing, Escape cancels it
		keyListener: function (e) {
			if (e.which === ENTER_KEY) {
				this.close();
			} else if (e.which === ESCAPE_KEY) {
				this.cancelEdits();
			}
		},

		// Remove the item, destroy the model from *localStorage* and delete its view.
		clear: function () {
			this.model.destroy();
		}
	});
}());
