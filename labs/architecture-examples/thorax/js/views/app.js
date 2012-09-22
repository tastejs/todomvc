$(function( $ ) {
	'use strict';

	// The Application
	// ---------------

	// Our overall **AppView** is the top-level piece of UI.
	Thorax.View.extend({
		// This will assign the template Thorax.templates['app'] to the view and
		// create a view class at Thorax.Views['app']
		name: 'app',

		// Delegated events for creating new items, and clearing completed ones.
		events: {
			'keypress #new-todo': 'createOnEnter',
			'click #toggle-all': 'toggleAllComplete',
			// The collection helper in the template will bind the collection
			// to the view. Any events in this hash will be bound to the
			// collection.
			collection: {
				all: 'toggleToggleAllButton'
			},
			rendered: 'toggleToggleAllButton'
		},

		// Unless the "context" method is overriden any attributes on the view
		// will be availble to the context / scope of the template, make the
		// global Todos collection available to the template.
		// Load any preexisting todos that might be saved in *localStorage*.
		initialize: function() {
			this.todosCollection = window.app.Todos;
			this.todosCollection.fetch();
			this.render();
		},

		toggleToggleAllButton: function() {
			this.$('#toggle-all').attr('checked', !this.todosCollection.remaining().length);
		},

		// This function is specified in the collection helper as the filter
		// and will be called each time a model changes, or for each item
		// when the collection is rendered
		filterTodoItem: function(model) {
			return model.isVisible();
		},

		// Generate the attributes for a new Todo item.
		newAttributes: function() {
			return {
				title: this.$('#new-todo').val().trim(),
				order: window.app.Todos.nextOrder(),
				completed: false
			};
		},

		// If you hit return in the main input field, create new **Todo** model,
		// persisting it to *localStorage*.
		createOnEnter: function( e ) {
			if ( e.which !== ENTER_KEY || !this.$('#new-todo').val().trim() ) {
				return;
			}

			window.app.Todos.create( this.newAttributes() );
			this.$('#new-todo').val('');
		},

		toggleAllComplete: function() {
			var completed = this.$('#toggle-all')[0].checked;

			window.app.Todos.each(function( todo ) {
				todo.save({
					'completed': completed
				});
			});
		}
	});
});
