'use strict';

var State = require('ampersand-state');
var Todos = require('./todos');


module.exports = State.extend({
	initialize: function () {
		// Listen to changes to the todos collection that will
		// affect lengths we want to calculate.
		this.listenTo(this.todos, 'change:completed change:title add remove', this.handleTodosUpdate);
		// We also want to calculate these values once on init
		this.handleTodosUpdate();

		// Listen for changes to `mode` so we can update
		// the collection mode.
		this.on('change:mode', this.handleModeChange, this);
	},
	collections: {
		todos: Todos
	},
	session: {
		activeCount: ['number', true, 0],
		completedCount: ['number', true, 0],
		totalCount: ['number', true, 0],
		allCompleted: ['boolean', true, false],
		// This is a more explicit property declaration
		// `mode` can only be one of those 3 values.
		// This drastically improves readability.
		mode: {
			type: 'string',
			values: [
				'all',
				'completed',
				'active'
			],
			default: 'all'
		}
	},
	derived: {
		// We produce this as an HTML snippet here
		// for convenience since it also has to be
		// pluralized it was easier this way.
		itemsLeftHtml: {
			deps: ['activeCount'],
			fn: function () {
				var plural = (this.activeCount === 1) ? '' : 's';
				return '<strong>' + this.activeCount + '</strong> item' + plural + ' left';
			}
		}
	},
	// Calculate and set various lengths we're
	// tracking. We set them as session properties
	// so they're easy to listen to and bind to DOM
	// where needed.
	handleTodosUpdate: function () {
		var completed = 0;
		var todos = this.todos;
		todos.each(function (todo) {
			if (todo.completed) {
				completed++;
			}
		});
		this.set({
			completedCount: completed,
			activeCount: todos.length - completed,
			totalCount: todos.length,
			allCompleted: todos.length === completed
		});
	},
	handleModeChange: function () {
		this.todos.setMode(this.mode);
	}
});
