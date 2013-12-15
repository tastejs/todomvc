/*global define */
define([
	'js/viewmodels/shell'
], function (shell) {
	'use strict';

	var ViewModel = function () {
		var self = this;

		self.activate = function (context) {
			shell.filter = context.filter;
			return true;
		};
	};

	return ViewModel;
});