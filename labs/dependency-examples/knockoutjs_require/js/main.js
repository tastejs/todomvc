/*global require, window */

// Author: Loïc Knuchel <loicknuchel@gmail.com>

// Require.js allows us to configure shortcut alias
require.config({
	paths: {
		knockout: '../bower_components/knockout.js/knockout'
	}
});

require([
	'knockout',
	'config/global',
	'viewmodels/todo',
	'extends/handlers'
], function (ko, g, TodoViewModel) {
	'use strict';

	// var app_view = new AppView();
	// check local storage for todos
	var todos = ko.utils.parseJson(window.localStorage.getItem(g.localStorageItem));

	// bind a new instance of our view model to the page
	ko.applyBindings(new TodoViewModel(todos || []));
});
