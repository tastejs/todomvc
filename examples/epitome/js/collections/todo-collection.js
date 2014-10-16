/*global Epitome, App */
/*jshint mootools:true */
(function (window) {
	'use strict';

	window.App = window.App || {};

	// a collection that holds the todos
	App.TodoCollection = new Class({
		// normal collection or Collection.Sync
		Extends: Epitome.Collection,

		// enable storage methods, namespaced as collection.
		Implements: Epitome.Storage.localStorage('collection'),

		// base model class prototype
		model: App.Todo,

		map: {
			active: 0,
			completed: 1
		},

		todoFilter: function (model) {
			// references the filterType which the controller sets
			return this.filterType === false ? true : this.map[this.filterType] === +model.get('completed');
		}
	});
})(window);
