'use strict';

var Collection = require('ampersand-collection');
var SubCollection = require('ampersand-subcollection');
var debounce = require('debounce');
var Todo = require('./todo');
var STORAGE_KEY = 'todos-ampersand';


module.exports = Collection.extend({
	model: Todo,
	initialize: function () {
		// Attempt to read from localStorage
		this.readFromLocalStorage();

		// This is what we'll actually render
		// it's a subcollection of the whole todo collection
		// that we'll add/remove filters to accordingly.
		this.subset = new SubCollection(this);

		// We put a slight debounce on this since it could possibly
		// be called in rapid succession.
		this.writeToLocalStorage = debounce(this.writeToLocalStorage, 100);

		// Listen for storage events on the window to keep multiple
		// tabs in sync
		window.addEventListener('storage', this.handleStorageEvent.bind(this));

		// We listen for changes to the collection
		// and persist on change
		this.on('all', this.writeToLocalStorage, this);
	},
	getCompletedCount: function () {
		return this.reduce(function (total, todo) {
			return todo.completed ? ++total : total;
		}, 0);
	},
	// Helper for removing all completed items
	clearCompleted: function () {
		var toRemove = this.filter(function (todo) {
			return todo.completed;
		});
		this.remove(toRemove);
	},
	// Updates the collection to the appropriate mode.
	// mode can 'all', 'completed', or 'active'
	setMode: function (mode) {
		if (mode === 'all') {
			this.subset.clearFilters();
		} else {
			this.subset.configure({
				where: {
					completed: mode === 'completed'
				}
			}, true);
		}
	},
	// The following two methods are all we need in order
	// to add persistance to localStorage
	writeToLocalStorage: function () {
		localStorage[STORAGE_KEY] = JSON.stringify(this);
	},
	readFromLocalStorage: function () {
		var existingData = localStorage[STORAGE_KEY];
		if (existingData) {
			this.set(JSON.parse(existingData));
		}
	},
	// Handles events from localStorage. Browsers will fire
	// this event in other tabs on the same domain.
	handleStorageEvent: function (e) {
		if (e.key === STORAGE_KEY) {
			this.readFromLocalStorage();
		}
	}
});
