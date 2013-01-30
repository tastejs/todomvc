$(function( $ ) {
	'use strict';

	// The Application
	// ---------------

	// This view is the top-level piece of UI.
	Thorax.View.extend({
		// Setting a name will assign the template Thorax.templates['app']
		// to the view and create a view class at Thorax.Views['app']
		name: 'app',

		// Delegated events for creating new items, and clearing completed ones.
		events: {
			'keypress #new-todo': 'createOnEnter',
			'click #toggle-all': 'toggleAllComplete',
			// Any events specified in the collection hash will be bound to the
			// collection with `listenTo`. The collection was set in js/app.js
			collection: {
				'change:completed': 'toggleToggleAllButton',
				filter: 'toggleToggleAllButton'
			},
			rendered: 'toggleToggleAllButton'
		},

		toggleToggleAllButton: function() {
			var toggleInput = this.$('#toggle-all')[0];
			if (toggleInput) {
				toggleInput.checked = !this.collection.remaining().length;
			}
		},

		// When this function is specified, items will only be shown
		// when this function returns true
		itemFilter: function(model) {
			return model.isVisible();
		},

		// Generate the attributes for a new Todo item.
		newAttributes: function() {
			return {
				title: this.$('#new-todo').val().trim(),
				order: this.collection.nextOrder(),
				completed: false
			};
		},

		// If you hit return in the main input field, create new **Todo** model,
		// persisting it to *localStorage*.
		createOnEnter: function( e ) {
			if ( e.which !== ENTER_KEY || !this.$('#new-todo').val().trim() ) {
				return;
			}

			this.collection.create( this.newAttributes() );
			this.$('#new-todo').val('');
		},

		toggleAllComplete: function() {
			var completed = this.$('#toggle-all')[0].checked;
			this.collection.each(function( todo ) {
				todo.save({
					completed: completed
				});
			});
		}
	});
});
