Application['todomvc'] = (function() {
  var module = {exports: {}};
  var exports = module.exports;
  Application['todomvc'] = exports;

  /* router : todomvc */
module.name = "todomvc";
module.routes = {"":"setFilter",":filter":"setFilter"};
(function() {
	'use strict';

	// Todo Model
	// ----------

	// Our basic **Todo** model has `title` and `completed` attributes.
	window.app.Todo = Thorax.Model.extend({

		// Default attributes for the todo
		// and ensure that each todo created has `title` and `completed` keys.
		defaults: {
			title: '',
			completed: false
		},

		// Toggle the `completed` state of this todo item.
		toggle: function() {
			this.save({
				completed: !this.get('completed')
			});
		},

		isVisible: function () {
			var isCompleted = this.get('completed');
			if (window.app.TodoFilter === '') {
				return true;
			} else if (window.app.TodoFilter === 'completed') {
				return isCompleted;
			} else if (window.app.TodoFilter === 'active') {
				return !isCompleted;
			}
		}

	});

}());

;;
(function() {
	'use strict';

	// Todo Collection
	// ---------------

	// The collection of todos is backed by *localStorage* instead of a remote
	// server.
	var TodoList = Thorax.Collection.extend({

		// Reference to this collection's model.
		model: window.app.Todo,

		// Save all of the todo items under the `"todos"` namespace.
		localStorage: new Store('todos-backbone-thorax'),

		// Filter down the list of all todo items that are finished.
		completed: function() {
			return this.filter(function( todo ) {
				return todo.get('completed');
			});
		},

		// Filter down the list to only todo items that are still not finished.
		remaining: function() {
			return this.without.apply( this, this.completed() );
		},

		// We keep the Todos in sequential order, despite being saved by unordered
		// GUID in the database. This generates the next order number for new items.
		nextOrder: function() {
			if ( !this.length ) {
				return 1;
			}
			return this.last().get('order') + 1;
		},

		// Todos are sorted by their original insertion order.
		comparator: function( todo ) {
			return todo.get('order');
		}
	});

	// Create our global collection of **Todos**.
	window.app.Todos = new TodoList();

  // Ensure that we always have data available
  window.app.Todos.fetch();

}());

;;
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
			// The "rendered" event is triggered by Thorax each time render()
			// is called and the result of the template has been appended
			// to the View's $el
			rendered: function() {
				this.$el.toggleClass( 'completed', this.model.get('completed') );
			}
		},

		// Toggle the `"completed"` state of the model.
		toggleCompleted: function() {
			this.model.toggle();
		},

		// Switch this view into `"editing"` mode, displaying the input field.
		edit: function() {
			this.$el.addClass('editing');
			this.$('.edit').focus();
		},

		// Close the `"editing"` mode, saving changes to the todo.
		close: function() {
			var value = this.$('.edit').val().trim();

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

;;
Thorax.templates['src/templates/stats'] = Handlebars.compile('<span id=\"todo-count\"><strong>{{remaining}}</strong> {{itemText}} left</span>\n<ul id=\"filters\">\n  <li>\n    {{#link \"/\" class=\"selected\"}}All{{/link}}\n  </li>\n  <li>\n    {{#link \"/active\"}}Active{{/link}}\n  </li>\n  <li>\n    {{#link \"/completed\"}}Completed{{/link}}\n  </li>\n</ul>\n{{#if completed}}\n  <button id=\"clear-completed\">Clear completed ({{completed}})</button>\n{{/if}}\n');Thorax.View.extend({
  name: 'stats',

  events: {
    'click #clear-completed': 'clearCompleted',
    // The "rendered" event is triggered by Thorax each time render()
    // is called and the result of the template has been appended
    // to the View's $el
    rendered: 'highlightFilter'
  },

  initialize: function() {
    // Whenever the Todos collection changes re-render the stats
    // render() needs to be called with no arguments, otherwise calling
    // it with arguments will insert the arguments as content
    this.listenTo(window.app.Todos, 'all', _.debounce(function() {
      this.render();
    }));
  },

  // Clear all completed todo items, destroying their models.
  clearCompleted: function() {
    _.each( window.app.Todos.completed(), function( todo ) {
      todo.destroy();
    });

    return false;
  },

  // Each time the stats view is rendered this function will
  // be called to generate the context / scope that the template
  // will be called with. "context" defaults to "return this"
  context: function() {
    var remaining = window.app.Todos.remaining().length;
    return {
      itemText: remaining === 1 ? 'item' : 'items',
      completed: window.app.Todos.completed().length,
      remaining: remaining
    };
  },

  // Highlight which filter will appear to be active
  highlightFilter: function() {
    this.$('#filters li a')
      .removeClass('selected')
      .filter('[href="#/' + ( window.app.TodoFilter || '' ) + '"]')
      .addClass('selected');
  }
});
;;
Thorax.templates['src/templates/app'] = Handlebars.compile('<section id=\"todoapp\">\n  <header id=\"header\">\n    <h1>todos</h1>\n    <input id=\"new-todo\" placeholder=\"What needs to be done?\" autofocus>\n  </header>\n  {{^empty collection}}\n    <section id=\"main\">\n      <input id=\"toggle-all\" type=\"checkbox\">\n      <label for=\"toggle-all\">Mark all as complete</label>\n      {{#collection item-view=\"todo-item\" tag=\"ul\" id=\"todo-list\"}}\n        <div class=\"view\">\n          <input class=\"toggle\" type=\"checkbox\" {{#if completed}}checked=\"checked\"{{/if}}>\n          <label>{{title}}</label>\n          <button class=\"destroy\"></button>\n        </div>\n        <input class=\"edit\" value=\"{{title}}\">\n      {{/collection}}\n    </section>\n    {{view \"stats\" tag=\"footer\" id=\"footer\"}}\n  {{/empty}}\n</section>\n<div id=\"info\">\n  <p>Double-click to edit a todo</p>\n  <p>Written by <a href=\"https://github.com/addyosmani\">Addy Osmani</a> &amp; <a href=\"https://github.com/eastridge\">Ryan Eastridge</a></p>\n  <p>Part of <a href=\"http://todomvc.com\">TodoMVC</a></p>\n</div>\n');$(function( $ ) {
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

;;
(function() {
	'use strict';

	// Todo Router
	// ----------

	new (Thorax.Router.extend({
		// The module variable is set inside of the file
		// generated by Lumbar
		name: module.name,
		routes: module.routes,

		setFilter: function( param ) {
			// Set the current filter to be used
			window.app.TodoFilter = param ? param.trim().replace(/^\//, '') : '';
			// Thorax listens for a `filter` event which will
			// force the collection to re-filter
			window.app.Todos.trigger('filter');
		}
	}));

}());

;;
var ENTER_KEY = 13;

$(function() {
  // Kick things off by creating the **App**.
  var view = new Thorax.Views['app']({
    collection: window.app.Todos
  });
  view.appendTo('body');
});

;;


  if (Application['todomvc'] !== module.exports) {
    console.warn("Application['todomvc'] internally differs from global");
  }
  return module.exports;
}).call(this);
