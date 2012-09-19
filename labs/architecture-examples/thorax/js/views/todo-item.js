var app = app || {};

$(function() {
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
			'keypress .edit':	'updateOnEnter',
			'blur .edit':		'close',
			// Events in this hash will be bound to the model
			// when it is assigned to the view
			model: {
				visible: 'toggleVisible'
			},
			// The "rendered" event is triggered by Thorax each time render()
			// is called and the result of the template has been appended
			// to the View's $el
			rendered: function() {
				this.$el.toggleClass( 'completed', this.model.get('completed') );
				this.toggleVisible();
				this.input = this.$('.edit');
			}
		},

		toggleVisible : function () {
			this.$el.toggleClass( 'hidden',  this.isHidden());
		},

		isHidden : function () {
			var isCompleted = this.model.get('completed');
			return ( // hidden cases only
				(!isCompleted && app.TodoFilter === 'completed')
				|| (isCompleted && app.TodoFilter === 'active')
			);
		},

		// Toggle the `"completed"` state of the model.
		toggleCompleted: function() {
			this.model.toggle();
		},

		// Switch this view into `"editing"` mode, displaying the input field.
		edit: function() {
			this.$el.addClass('editing');
			this.input.focus();
		},

		// Close the `"editing"` mode, saving changes to the todo.
		close: function() {
			var value = this.input.val().trim();

			if ( value ) {
				this.model.save({ title: value });
			} else {
				this.clear();
			}

			this.$el.removeClass('editing');
		},

		// If you hit `enter`, we're through editing the item.
		updateOnEnter: function( e ) {
			if ( e.which === ENTER_KEY ) {
				this.close();
			}
		},

		// Remove the item, destroy the model from *localStorage* and delete its view.
		clear: function() {
			this.model.destroy();
		}
	});
});
