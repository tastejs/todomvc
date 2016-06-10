/*global define, ko */
define([
	'bower_components/durandal/app'
], function (app) {
	'use strict';

	var ViewModel = function () {
		var self = this;

		// store the new todo value being entered
		self.current = ko.observable();

		// add a new todo, when enter key is pressed
		self.add = function () {
			var current = self.current().trim();

			if (current) {
				app.trigger('todoitem', current);
				self.current('');
			}
		};
	};

	return ViewModel;
});