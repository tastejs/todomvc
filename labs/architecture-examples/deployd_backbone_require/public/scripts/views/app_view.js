define([
  'collections/todos',
  'lib/utils',
  "views/todo_view"
], function (Todos, Utils, TodoView) {
  return Backbone.View.extend({
		// Instead of generating a new element, bind to the existing skeleton of
		// the App already present in the HTML.
		el: '#todoapp',

		// Our template for the line of statistics at the bottom of the app.
    footerTemplate: Handlebars.compile($('#footer-template').html()),

		// Delegated events for creating new items, and clearing completed ones.
		events: {
      'keypress #new-todo': 'createOnEnter',
      'click #clear-completed': 'clearCompleted',
      'click #toggle-all': 'toggleAllComplete'
    },

		// At initialization we bind to the relevant events on the `Todos`
		// collection, when items are added or changed. Kick things off by
		// loading any preexisting todos that might be saved in *localStorage*.
		initialize: function () {
      this.$footer = this.$('#footer');
      this.$newTodo = this.$('#new-todo');
      this.$toggleAll = this.$('#toggle-all')[0];

      this.todos = new Todos();

      this.listenTo(this.todos, 'reset', this.renderTodos);
      this.listenTo(this.todos, 'all', this.renderFooter);
      this.listenTo(this.todos, 'add', this.renderTodo);
    
			this.todos.fetch({reset:true});
		},

		// Re-rendering the App just means refreshing the statistics -- the rest
		// of the app doesn't change.
		renderFooter: function () {
      var todoCount = this.todos.length;
      var activeTodoCount = this.todos.remaining().length;
      var completed = this.todos.completed().length;

      var footer = {
        activeTodoCount: activeTodoCount,
        activeTodoWord: Utils.pluralize(activeTodoCount, 'item'),
        completedTodos: completed
      };

      this.$footer.toggle(!!todoCount);
      this.$footer.html(this.footerTemplate(footer));
		},

		// Add a single todo item to the list by creating a view for it, and
		// appending its element to the `<ul>`.
		renderTodo: function (todo) {
			var view = new TodoView({ model: todo });
			$('#todo-list').append(view.render().el);
		},

		// Add all items in the **Todos** collection at once.
		renderTodos: function () {
			this.$('#todo-list').html('');
			this.todos.each(this.renderTodo, this);
		},

		// Generate the attributes for a new Todo item.
		newAttributes: function () {
			return {
				title: this.$newTodo.val().trim(),
				completed: false,
        uuid: Utils.uuid()
			};
		},

		// If you hit return in the main input field, create new **Todo** model,
		// persisting it to *localStorage*.
		createOnEnter: function (e) {
			if (e.which !== 13 || !this.$newTodo.val().trim()) {
				return;
			}

			this.todos.create(this.newAttributes());
			this.$newTodo.val('');
		},

		// Clear all completed todo items, destroying their models.
		clearCompleted: function () {
			_.invoke(this.todos.completed(), 'destroy');
			return false;
		},

		toggleAllComplete: function () {
			var completed = this.$toggleAll.checked;

			this.todos.each(function (todo) {
				todo.save({
					'completed': completed
				});
			});
		}
	});
});