// typically we us a 'me' model to represent state for the
// user of the app. So in an app where you have a logged in
// user this is where we'd store username, etc.
// We also use it to store session properties, which is the
// non-persisted state that we use to track application
// state for this user in this session.
'use strict';

var State = require('ampersand-state');
var Todos = require('./todos');


module.exports = State.extend({
	initialize: function () {
		// Listen to changes to the todos collection that will
		// affect lengths we want to calculate.
		this.listenTo(this.todos, 'change:completed add remove', this.handleTodosUpdate);
		// We also want to calculate these values once on init
		this.handleTodosUpdate();
		// Listen for changes to `mode` so we can update
		// the collection mode.
		this.listenTo(this, 'change:mode', this.handleModeChange);
	},
	collections: {
		todos: Todos
	},
	// We used only session properties here because there's
	// no API or persistance layer for these in this app.
	session: {
		activeCount: {
			type: 'number',
			default: 0
		},
		completedCount: {
			type: 'number',
			default: 0
		},
		totalCount:{
			type: 'number',
			default: 0
		},
		allCompleted: {
			type: 'boolean',
			default: false
		},
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
		var total = this.todos.length;
		// use a method we defined on the collection itself
		// to count how many todos are completed
		var completed = this.todos.getCompletedCount();
		// We use `set` here in order to update multiple attributes at once
		// It's possible to set directely using `this.completedCount = completed` ...
		this.set({
			completedCount: completed,
			activeCount: total - completed,
			totalCount: total,
			allCompleted: total === completed
		});
	},
	handleModeChange: function () {
		this.todos.setMode(this.mode);
	}
});
