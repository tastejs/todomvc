define([
	'jquery',
	'underscore',
	'backbone',
	'thorax',
	'collections/todos',
	'views/todo-item',
	'views/stats',
	'text!templates/app.handlebars',
	'common'
], function( $, _, Backbone, Thorax, Todos, TodoItemView, StatsView, appTemplate, Common ) {

	return Thorax.View.extend({
		// In a require.js application the name is primarily for
		// consistency and debugging purposes
		name: 'app',

		template: Handlebars.compile(appTemplate),

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
			this.todoItemView = TodoItemView;
			this.statsView = new StatsView;
			this.todosCollection = Todos;
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
				order: Todos.nextOrder(),
				completed: false
			};
		},

		// If you hit return in the main input field, create new **Todo** model,
		// persisting it to *localStorage*.
		createOnEnter: function( e ) {
			if ( e.which !== Common.ENTER_KEY || !this.$('#new-todo').val().trim() ) {
				return;
			}

			Todos.create( this.newAttributes() );
			this.$('#new-todo').val('');
		},

		toggleAllComplete: function() {
			var completed = this.$('#toggle-all')[0].checked;

			Todos.each(function( todo ) {
				todo.save({
					'completed': completed
				});
			});
		}
	});

});
