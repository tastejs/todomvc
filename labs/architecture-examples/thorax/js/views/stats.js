/*global Thorax, _*/

'use strict';

Thorax.View.extend({
	name: 'stats',

	events: {
		'click #clear-completed': 'clearCompleted',
		// The "rendered" event is triggered by Thorax each time render()
		// is called and the result of the template has been appended
		// to the View's $el
		rendered: 'highlightFilter'
	},

	initialize: function () {
		// Whenever the Todos collection changes re-render the stats
		// render() needs to be called with no arguments, otherwise calling
		// it with arguments will insert the arguments as content
		this.listenTo(window.app.Todos, 'all', _.debounce(function () {
			this.render();
		}));
	},

	// Clear all completed todo items, destroying their models.
	clearCompleted: function () {
		_.each(window.app.Todos.completed(), function (todo) {
			todo.destroy();
		});

		return false;
	},

	// Each time the stats view is rendered this function will
	// be called to generate the context / scope that the template
	// will be called with. "context" defaults to "return this"
	context: function () {
		var remaining = window.app.Todos.remaining().length;
		return {
			itemText: remaining === 1 ? 'item' : 'items',
			completed: window.app.Todos.completed().length,
			remaining: remaining
		};
	},

	// Highlight which filter will appear to be active
	highlightFilter: function () {
		this.$('#filters li a')
		.removeClass('selected')
		.filter('[href="#/' + (window.app.TodoFilter || '') + '"]')
		.addClass('selected');
	}
});
