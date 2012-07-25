/*global Epitome, App, Class */
(function(window) {
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

                todoFilter: function( model ) {
			// references the filterType which the controller sets
                        return this.filterType === false ? true : model.get('completed') === this.filterType;
		}
	});
}( window ));