/*global define */

define(function (require) {
	'use strict';

	// Constants
	var LOCAL_STORAGE_KEY = 'todos-lavaca-require';

	var Collection = require('lavaca/mvc/Collection');

	/**
	 * A collection of ToDo items that saves and restores its data from
	 * localStorage
	 * @class app.models.TodosCollection
	 * @super Lavaca.mvc.Collection
	 */
	var TodosCollection = Collection.extend(function TodosCollection() {
		// Call the super class' constructor
		Collection.apply(this, arguments);

		// Set some computed properties on this model
		this.apply({
			allComplete: allComplete,
			itemsLeft: itemsLeft,
			itemsCompleted: itemsCompleted
		});

		// Restore any data from localStorage
		restore.call(this);

		// Listen for changes to the models and then save them in localStorage
		this.on('addItem', store);
		this.on('moveItem', store);
		this.on('removeItem', store);
		this.on('changeItem', store);
	}, {
		/**
		 * @method removeCompleted
		 * Remove models that are complete
		 */
		removeCompleted: function () {
			this.remove({completed: true});
		}
	});

	/* ---- Computed Properties ---- */

	// Returns a boolean indicating whether all items are complete
	function allComplete() {
		var allAreComplete = true;

		this.each(function (index, model) {
			if (!model.get('completed')) {
				allAreComplete = false;
				return false; // break out of `each` loop
			}
		});

		return allAreComplete;
	}

	// Returns a count of incomplete items
	function itemsLeft() {
		return this.filter({ completed: false }).length;
	}

	// Returns a count of complete items
	function itemsCompleted() {
		return this.filter({ completed: true }).length;
	}

	/* ---- Handle Persistence ---- */

	// Called every time the models change. Set a timeout that will write the data
	// to localStorage. Clear the timeout with every call to make sure that data
	// is only written once even if multiple changes are made in the same run loop
	function store() {
		var items;

		clearTimeout(this.storeTimer);

		this.storeTimer = setTimeout(function () {
			// Safari will throw an exception when trying to write to localStorage in
			// private browsing mode
			try {
				items = JSON.stringify(this.toObject().items);
				localStorage.setItem(LOCAL_STORAGE_KEY, items);
			} catch (e) {}

		}.bind(this));
	}

	// Pull the data from localStorage and add it to the collection
	function restore() {
		var data;
		var i;

		try {
			data = JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEY));

			if (data) {
				for (i = 0; i < data.length; i++) {
					this.add(data[i]);
				}
			}
		} catch (e) {}
	}

	return new TodosCollection();
});
