/*global Epitome, App */
/*jshint mootools:true */
(function (window) {
	'use strict';

	window.App = window.App || {};

	// base structure for the todos themselves
	App.Todo = new Class({

		Extends: Epitome.Model,

		options: {
			defaults: {
				completed: false,
				title: ''
			}
		}
	});

	// a collection that holds the todos
	App.TodoCollection = new Class({

		Extends: Epitome.Collection,

		Implements: Epitome.Storage.sessionStorage('collection'),

		model: App.Todo

	});
})(window);
