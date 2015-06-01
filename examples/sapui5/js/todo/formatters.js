/*global jQuery, todo */
/*jshint unused:false */

/*
 * Formatters used for data binding.
 */
(function () {
	'use strict';

	jQuery.sap.declare('todo.formatters');

	todo.formatters = {
		// Returns whether all todos are completed
		allCompletedTodosFormatter: function (aTodos) {
			return !(aTodos.some(function (element, index, array) {
				return element.done === false;
			}));
		},

		// Converts booleans to strings
		booleanToStringFormatter: function (value) {
			if (value === true) {
				return 'true';
			}
			return 'false';
		},

		// Returns whether a completed todo is available
		hasCompletedTodosFormatter: function (aTodos) {
			return aTodos.some(function (element, index, array) {
				return element.done === true;
			});
		},

		// Returns whether a an array has elements
		isArrayNonEmptyFormatter: function (aTodos) {
			return aTodos.length > 0;
		},

		// Counts the number of open todos
		openTodoCountFormatter: function (aTodos) {
			var numberOfOpenItems = 0;
			aTodos.forEach(function (todo) {
				if (todo.done === false) {
					numberOfOpenItems++;
				}
			});

			return numberOfOpenItems === 1 ? '1 item left' : numberOfOpenItems + ' items left';
		}
	};
})();
