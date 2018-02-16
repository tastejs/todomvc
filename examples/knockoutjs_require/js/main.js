/*global require, window */

// Author: Loïc Knuchel <loicknuchel@gmail.com>

// Require.js allows us to configure shortcut alias
require.config({
	paths: {
		knockout: '../node_modules/knockout/build/output/knockout-latest',
		director: '../node_modules/director/build/director'
	}
});

require([
	'knockout',
	'config/global',
	'viewmodels/todo',
	'extends/handlers',
	'director'
], function (ko, g, TodoViewModel) {
	'use strict';

	// var app_view = new AppView();
	// check local storage for todos
	var todos = ko.utils.parseJson(window.localStorage.getItem(g.localStorageItem));

	// bind a new instance of our view model to the page
	var viewModel = new TodoViewModel(todos || []);
	ko.applyBindings(viewModel);

	// set up filter routing
	/*jshint newcap:false */
	Router({ '/:filter': viewModel.showMode }).init();
});
