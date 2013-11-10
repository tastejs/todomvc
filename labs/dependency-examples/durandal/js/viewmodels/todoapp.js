/*global define */
define(['js/viewmodels/shell', 'js/viewmodels/list'], function (shell, List) {
	'use strict';

	var ViewModel = function () {
		var self = this;
		self.list = new List();

		self.activate = function (filter) {
			shell.filter = filter;
			self.list.showMode(filter || 'all');

			return true;
		};

		self.canReuseForRoute = function(){
			return true;
		}
	};

	return ViewModel;
});