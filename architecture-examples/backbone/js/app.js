// Load the application once the DOM is ready, using `jQuery.ready`:
$(function(){

	var currentFilter = "";

	// Todo Model
	// ----------

	// Our basic **Todo** model has `title`, `order`, and `completed` attributes.
	var Todo = Backbone.Model.extend({

		// Default attributes for the todo.
		defaults: {
			title: "empty todo...",
			completed: false
		},

		// Ensure that each todo created has `title`.
		initialize: function() {
			if (!this.get("title")) {
				this.set({"title": this.defaults.title});
			}
		},

		// Toggle the `completed` state of this todo item.
		toggle: function() {
			this.save({completed: !this.get("completed")});
		},

		// Remove this Todo from *localStorage* and delete its view.
		clear: function() {
			this.destroy();
		}

	});

	// Todo Collection
	// ---------------

	// The collection of todos is backed by *localStorage* instead of a remote
	// server.
	var TodoList = Backbone.Collection.extend({

		// Reference to this collection's model.
		model: Todo,

		// Save all of the todo items under the `"todos"` namespace.
		localStorage: new Store("todos-backbone"),

		// Filter down the list of all todo items that are finished.
		completed: function() {
			return this.filter(function(todo){ return todo.get('completed'); });
		},

		// Filter down the list to only todo items that are still not finished.
		remaining: function() {
			return this.without.apply(this, this.completed());
		},

		// We keep the Todos in sequential order, despite being saved by unordered
		// GUID in the database. This generates the next order number for new items.
		nextOrder: function() {
			if (!this.length) return 1;
			return this.last().get('order') + 1;
		},

		// Todos are sorted by their original insertion order.
		comparator: function(todo) {
			return todo.get('order');
		}
	});

	// Create our global collection of **Todos**.
	var Todos = new TodoList;

	// Todo Item View
	// --------------

	// The DOM element for a todo item...
	var TodoView = Backbone.View.extend({

		//... is a list tag.
		tagName:  "li",

		// Cache the template function for a single item.
		template: _.template($('#item-template').html()),

		// The DOM events specific to an item.
		events: {
			"click .toggle"   : "togglecompleted",
			"dblclick .view"  : "edit",
			"click .destroy" : "clear",
			"keypress .edit"  : "updateOnEnter",
			"blur .edit"      : "close"
		},

		// The TodoView listens for changes to its model, re-rendering. Since there's
		// a one-to-one correspondence between a **Todo** and a **TodoView** in this
		// app, we set a direct reference on the model for convenience.
		initialize: function() {
			this.model.on('change', this.render, this);
			this.model.on('destroy', this.remove, this);
		},

		// Re-render the titles of the todo item.
		render: function() {
			var $el = $(this.el);
			$el.html(this.template(this.model.toJSON()));
			$el.toggleClass('completed', this.model.get('completed'));

			this.input = this.$('.edit');
			return this;
		},

		// Toggle the `"completed"` state of the model.
		togglecompleted: function() {
			this.model.toggle();
		},

		// Switch this view into `"editing"` mode, displaying the input field.
		edit: function() {
			$(this.el).addClass("editing");
			this.input.focus();
		},

		// Close the `"editing"` mode, saving changes to the todo.
		close: function() {
			var value = this.input.val().trim();

			if (!value){
				this.clear();
			}

			this.model.save({title: value});
			$(this.el).removeClass("editing");
		},

		// If you hit `enter`, we're through editing the item.
		updateOnEnter: function(e) {
			if (e.keyCode == 13) this.close();
		},

		// Remove the item, destroy the model.
		clear: function() {
			this.model.clear();
		}
	});

	// The Application
	// ---------------

	// Our overall **AppView** is the top-level piece of UI.
	var AppView = Backbone.View.extend({

		// Instead of generating a new element, bind to the existing skeleton of
		// the App already present in the HTML.
		el: $("#todoapp"),

		// Our template for the line of statistics at the bottom of the app.
		statsTemplate: _.template($('#stats-template').html()),

		// Delegated events for creating new items, and clearing completed ones.
		events: {
			"keypress #new-todo":  "createOnEnter",
			"click #clear-completed": "clearCompleted",
			"click #toggle-all": "toggleAllComplete"
		},

		// At initialization we bind to the relevant events on the `Todos`
		// collection, when items are added or changed. Kick things off by
		// loading any preexisting todos that might be saved in *localStorage*.
		initialize: function() {

			this.input = this.$("#new-todo");
			this.allCheckbox = this.$("#toggle-all")[0];

			Todos.on('add', this.addOne, this);
			Todos.on('reset', this.addAll, this);
			Todos.on('all', this.render, this);

			this.$footer = $('#footer');
			this.$main = $('#main');

			Todos.fetch();
		},

		// Re-rendering the App just means refreshing the statistics -- the rest
		// of the app doesn't change.
		render: function() {
			var completed = Todos.completed().length;
			var remaining = Todos.remaining().length;

			if (Todos.length) {
				this.$main.show();
				this.$footer.show();

				this.$footer.html(this.statsTemplate({
							completed:       completed,
							remaining:  remaining
				}));
		
			} else {
				this.$main.hide();
				this.$footer.hide();
			}

			this.allCheckbox.checked = !remaining;
		},

		// Add a single todo item to the list by creating a view for it, and
		// appending its element to the `<ul>`.
		addOne: function(todo) {
			var view = new TodoView({model: todo});
			this.$("#todo-list").append(view.render().el);
		},

		// Add all items in the **Todos** collection at once.
		addAll: function() {

			this.$("#todo-list").html('');

			switch(currentFilter){
				case "active":
					_.each(Todos.remaining(), this.addOne);
					break;
				case "completed":
					_.each(Todos.completed(), this.addOne);
					break;
				default:
					Todos.each(this.addOne, this);
					break;
			}

		},

		// Generate the attributes for a new Todo item.
		newAttributes: function() {
			return {
				title: this.input.val().trim(),
				order: Todos.nextOrder(),
				completed: false
			};
		},

		// If you hit return in the main input field, create new **Todo** model,
		// persisting it to *localStorage*.
		createOnEnter: function(e) {
			if (e.keyCode != 13) return;
			if (!this.input.val().trim()) return;

			Todos.create(this.newAttributes());
			this.input.val('');
		},

		// Clear all completed todo items, destroying their models.
		clearCompleted: function() {
			_.each(Todos.completed(), function(todo){ todo.clear(); });
			return false;
		},

		toggleAllComplete: function () {
			var completed = this.allCheckbox.checked;
			Todos.each(function (todo) { todo.save({'completed': completed}); });
		}
	});

	// Todo Router
	// ----------

	var Router = Backbone.Router.extend({
		routes:{
			"/:filter": "setFilter",
			"/:*": "setFilter"
		},

		setFilter: function(param){

			currentFilter = param;
			Todos.trigger('reset');

			// Currently not working on navigation.
			$('#filters li a')
				.removeClass('selected')
				.filter("[href='#/" + param + "']")
				.addClass('selected');


		}

	});

	var app_router = new Router;
	Backbone.history.start();
	
	// Finally, we kick things off by creating the **App**.
	var App = new AppView;
});
