// An example Backbone application contributed by
// [Jérôme Gravel-Niquet](http://jgn.me/). This demo uses a simple
// [LocalStorage adapter](backbone-localstorage.js)
// to persist Backbone models within your browser.
// Update to backbone 0.9.2 and sortable support by
// [David Pennington](http://davidpennington.me/)

// Define the structure of our global application object before we get started
var App = {
	Class: {
		Todo: {
			Model: {},
			Collection: {},
			AppView: {},
			ListView: {},
			ItemView: {}
		}
	},
	Object: {
		Todo: {

		}
	}
}

// Load the application once the DOM is ready, using `jQuery.ready`:
$(function(){

	// Our basic **Todo** model has `content`, `order`, and `done` attributes.
	App.Class.Todo.Model = Backbone.Model.extend({

		// Save all of the todo items under the `"todos-backbone"` namespace.
		localStorage: new Backbone.LocalStorage("todos-backbone"),

		defaults: {
			content: "empty todo...",
			done: false
		},

		initialize: function()
		{
			if (!this.get("content"))
			{
				this.set({"content": this.defaults.content})
			}
		},

		// Toggle the `done` state of this todo item.
		toggle: function()
		{
			this.save({done: !this.get("done")})
		},

		// Remove this Todo from *localStorage* and delete its view.
		clear: function()
		{
			this.destroy()
		}

	})

	// The collection of todos is backed by *localStorage* instead of a remote
	// server.
	App.Class.Todo.Collection = Backbone.Collection.extend({

		// Reference to this collection's model.
		model: App.Class.Todo.Model,

		// Save all of the todo items under the `"todos-backbone"` namespace.
		localStorage: new Backbone.LocalStorage("todos-backbone"),

		// Filter down the list of all todo items that are finished.
		done: function()
		{
			return this.filter(function(todo){ return todo.get('done') })
		},

		// Filter down the list to only todo items that are still not finished.
		remaining: function()
		{
			return this.without.apply(this, this.done())
		},

		// Todos are sorted by their order.
		comparator: function(todo)
		{
			return todo.get('order')
		},
	})


	// The DOM element for a todo item...
	App.Class.Todo.ItemView = Backbone.View.extend({

		//... is a list tag.
		tagName: "li",

		// Cache the template function for a single item.
		template: _.template($('#item-template').html()),

		// The DOM events specific to an item.
		events: {
			"click .check"					: "toggleDone",
			"dblclick label.todo-content"	: "edit",
			"click span.todo-destroy"		: "clear",
			"keypress .todo-input"			: "updateOnEnter",
			"blur .todo-input"				: "close",
			'drop'							: 'drop'
		},

		// The TodoView listens for changes to its model, re-rendering. Since there's
		// a one-to-one correspondence between a **Todo** and a **TodoView** in this
		// app, we set a direct reference on the model for convenience.
		initialize: function()
		{
			_.bindAll(this, 'render', 'close', 'remove')
			this.model.on('change', this.render, this)
			this.model.on('destroy', this.remove, this)
		},

		drop: function(event, index)
		{
			this.$el.trigger('update-sort', [this.model, index]);
		},

		// Re-render the contents of the todo item.
		render: function()
		{
			$(this.el).html(this.template(this.model.toJSON()))
			this.input = this.$('.todo-input')
			return this
		},

		// Toggle the `"done"` state of the model.
		toggleDone: function()
		{
			this.model.toggle()
		},

		// Switch this view into `"editing"` mode, displaying the input field.
		edit: function()
		{
			$(this.el).addClass("editing")
			this.input.focus()
		},

		// Close the `"editing"` mode, saving changes to the todo.
		close: function()
		{
			this.model.save({content: this.input.val()})
			$(this.el).removeClass("editing")
		},

		// If you hit `enter`, we're through editing the item.
		updateOnEnter: function(e)
		{
			if (e.keyCode == 13) this.close()
		},

		// Remove the item, destroy the model.
		clear: function()
		{
			this.model.clear()
		}

	})


	// UL list container for all the individual todo items
	App.Class.Todo.ListView = Backbone.View.extend({

		events: {
			'update-sort': 'updateSort'
		},

		render: function()
		{
			this.$el.children().remove()
			this.collection.each(this.appendModelView, this)
			return this
		},

		appendModelView: function(model)
		{
			var el = new App.Class.Todo.ItemView({model: model}).render().el
			this.$el.append(el)
		},

		updateSort: function(event, model, position)
		{
			this.collection.remove(model)

			this.collection.each(function (model, index)
			{
				var order = index
				if (index >= position) order += 1

				// Prevent un-needed syncs to the server
				if(model.get('order') != order)
				{
					model.set('order', order)
					model.save()
				}
			})

			model.set('order', position)
			model.save()

			this.collection.add(model, {at: position})

			this.render()
		}
	})

	// Our overall **AppView** is the top-level piece of UI.
	App.Class.Todo.AppView = Backbone.View.extend({

		// Our template for the line of statistics at the bottom of the app.
		template: _.template($('#stats-template').html()),

		// Delegated events for creating new items, and clearing completed ones.
		events: {
			"keypress #new-todo":	"createOnEnter",
			"keyup #new-todo":		"showTooltip",
			"click .todo-clear a":	"clearCompleted",
			"click .mark-all-done":	"toggleAllComplete"
		},

		// At initialization we bind to the relevant events on the `Todos`
		// collection, when items are added or changed. Kick things off by
		// loading any preexisting todos that might be saved in *localStorage*.
		initialize: function()
		{
			_.bindAll(this, 'addOne', 'addAll', 'render', 'toggleAllComplete')

			this.input = this.$("#new-todo")
			this.allCheckbox = this.$(".mark-all-done")[0]

			this.collection.on('add',	this.addOne, this)
			this.collection.on('reset',	this.addAll, this)
			this.collection.on('all',	this.render, this)

			this.collection.fetch()
		},

		// Re-rendering the App just means refreshing the statistics -- the rest
		// of the app doesn't change.
		render: function()
		{
			var done = this.collection.done().length
			var remaining = this.collection.remaining().length

			this.$('#todo-stats').html(this.template({
				total:		this.collection.length,
				done:		done,
				remaining:	remaining
			}))

			this.allCheckbox.checked = !remaining
		},

		// Add a single todo item to the list by creating a view for it, and
		// appending its element to the `<ul>`.
		addOne: function(todo)
		{
			var view = new App.Class.Todo.ItemView({ model: todo })

			this.$("#todo-list").append(view.render().el)
		},

		// Add all items in the **Todos** collection at once.
		addAll: function()
		{
			this.collection.each(this.addOne)
		},

		// Generate the attributes for a new Todo item.
		newAttributes: function()
		{
			return {
				content:	this.input.val(),
				done:		false
			}
		},

		// If you hit return in the main input field, create new **Todo** model,
		// persisting it to *localStorage*.
		createOnEnter: function(e)
		{
			if (e.keyCode != 13) return
			this.collection.create(this.newAttributes())
			this.input.val('')
		},

		// Clear all done todo items, destroying their models.
		clearCompleted: function()
		{
			_.each(this.collection.done(), function(todo){ todo.clear() })
			return false
		},

		// Lazily show the tooltip that tells you to press `enter` to save
		// a new todo item, after one second.
		showTooltip: function(e)
		{
			var tooltip = this.$(".ui-tooltip-top")
			var val = this.input.val()

			tooltip.fadeOut()

			if (this.tooltipTimeout) clearTimeout(this.tooltipTimeout)

			if (val == '' || val == this.input.attr('placeholder')) return

			var show = function() { tooltip.show().fadeIn() }

			this.tooltipTimeout = _.delay(show, 1000)
		},

		toggleAllComplete: function ()
		{
			var done = this.allCheckbox.checked
			this.collection.each(function (todo)
			{
				todo.save({'done': done})
			})
		}
	})

	//
	// Now we start the aplication
	//

	App.Object.Todo.Collection = new App.Class.Todo.Collection

	App.Object.Todo.ListView = new App.Class.Todo.ListView({
		el: '#todo-list',
		collection: App.Object.Todo.Collection
	});

	App.Object.Todo.AppView = new App.Class.Todo.AppView({
		el: '#todoapp',
		collection: App.Object.Todo.Collection
	})

	// After the sorting is done, alert the view to update the model
	$('#todo-list').sortable({
		stop: function(event, ui)
		{
			ui.item.trigger('drop', ui.item.index());
		}
	});
});
