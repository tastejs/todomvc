/*global define */
define([
	'js/viewmodels/shell'
], function (shell) {
	'use strict';

	var ViewModel = function () {
		var self = this;

		self.activate = function (filter) {
			console.log('filter');
			shell.filter = filter;
			return true;
		};

		self.canReuseForRoute = function(arg1, arg2){
			return false;
		}
	};

	return ViewModel;
});