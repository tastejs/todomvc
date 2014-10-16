/*global Backbone, microtemplate, ENTER_KEY, ESCAPE_KEY */
var app = app || {};

(function () {
	'use strict';

	// Todo Item View
	// --------------

	// The DOM element for a todo item...
	app.TodoView = Backbone.View.extend({
		//... is a list tag.
		tagName:  'li',

		// Cache the template function for a single item.
		template: microtemplate(document.querySelector('#item-template').innerHTML),

		// The DOM events specific to an item.
		events: {
			'click .toggle': 'toggleCompleted',
			'dblclick label': 'edit',
			'click .destroy': 'clear',
			// Not keypress since it doesn't work with escape.
			'keyup .edit': 'handleKey',
			// Not blur since it doesn't bubble up.
			'focusout .edit': 'close'
		},

		// The TodoView listens for changes to its model, re-rendering. Since there's
		// a one-to-one correspondence between a **Todo** and a **TodoView** in this
		// app, we set a direct reference on the model for convenience.
		initialize: function () {
			this.listenTo(this.model, 'change', this.render);
			this.listenTo(this.model, 'destroy', this.remove);
			this.listenTo(this.model, 'visible', this.toggleVisible);
		},

		// Re-render the titles of the todo item.
		render: function () {
			this.el.innerHTML = this.template(this.model.toJSON());
			var method = this.model.get('completed') ? 'add' : 'remove';
			this.el.classList[method]('completed');
			this.toggleVisible();
			this.input = this.find('.edit');
			return this;
		},

		toggleVisible: function () {
			this.el.classList[this.isHidden() ? 'add' : 'remove']('hidden');
		},

		isHidden: function () {
			var isCompleted = this.model.get('completed');
			return (// hidden cases only
				(!isCompleted && app.TodoFilter === 'completed') ||
				(isCompleted && app.TodoFilter === 'active')
			);
		},

		// Toggle the `"completed"` state of the model.
		toggleCompleted: function () {
			this.model.toggle();
		},

		// Switch this view into `"editing"` mode, displaying the input field.
		edit: function () {
			this.el.classList.add('editing');
			this.input.focus();
			// Set the selection to the last char.
			this.input.value = this.input.value;
		},

		// Close the `"editing"` mode, saving changes to the todo.
		close: function (e, discard) {
			var value = discard ?
				this.model.get('title') : this.input.value.trim();
			this.input.value = value;

			if (value) {
				this.model.save({ title: value });
			} else {
				this.clear();
			}

			this.el.classList.remove('editing');
		},

		// If you hit `enter`, we're through editing the item.
		// If you hit `escape`, we're saving it with old value.
		handleKey: function (e) {
			if (e.which === ENTER_KEY) {
				this.close();
			} else if (e.which === ESCAPE_KEY) {
				this.close(null, true);
			}
		},

		// Remove the item, destroy the model from *localStorage* and delete its view.
		clear: function () {
			this.model.destroy();
		}
	});
})();
