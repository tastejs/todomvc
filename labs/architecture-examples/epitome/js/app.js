(function(window) {
	'use strict';

	var App = window.App;

	// Your starting point. Enjoy the ride!
	var todos = new App.TodoCollection(null, {
		// a consistent collection if is needed if you want to use storage for a collection.
		id: 'todos'
	});

	// populate from storage if available
	todos.setUp(todos.retrieve());

	// instantiate the todo list view
	App.todoView = new App.TodoView({

		// bind to the collection and its events and model events
		collection: todos,

		// encapsulating element to bind to
		element: document.id('todo-list'),

		// template to use
		template: document.id('item-template').get('text')

	});

	// the main view is for the footer/stats/controls
	App.mainView = new App.MainView({

		// also bound to the same collection but with a different output logic.
		collection: todos,

		// encapsulating element to bind to
		element: document.id('todoapp'),

		// stats template from DOM
		template: document.id('stats-template').get('text')
	});

	// the pseudo controller via Epitome.Router
	App.router = new Epitome.Router({
		routes: {
			'': 'init',
			'#!/': 'applyFilter',
			'#!/:filter': 'applyFilter'
		},

		onInit: function() {
			// we want to always have a state
			this.navigate('#!/');
		},

		onApplyFilter: function(filter) {
			// the filter is being used by the todo collection and view.
			// when false, the whole collection is being passed.
			todos.filterType = filter || false;

			// render as per current filter
			App.todoView.render();

			// fix up the links quickie.
			var self = this;
			document.getElements('#filters li a').each(function(link) {
				link.set('class', link.get('href') == self.req ? 'selected' : '');
			});
		}

	});


})(window);