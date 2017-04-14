/*global require*/
'use strict';

require(['helpers', 'model', 'view', 'Controller'], function (helpers, model, view, Controller) {
	window = helpers;

	/*jshint nonew:false*/
	var controller = new Controller(model, view);

  /**
   * Finds the model ID of the clicked DOM element
   *
   * @param {object} target The starting point in the DOM for it to try to find
   * the ID of the model.
   */
	function lookupId(target) {
		var lookup = target;

		while (lookup.nodeName !== 'LI') {
			lookup = lookup.parentNode;
		}
		return lookup.dataset.id;
	}

	// When the enter key is pressed fire the addItem method.
	window.$$('#new-todo').addEventListener('keypress', function (e) {
		controller.addItem(e);
	});

	// A delegation event. Will check what item was clicked whenever you click on any
	// part of a list item.
	window.$$('#todo-list').addEventListener('click', function (e) {
		var target = e.target;

		// If you click a destroy button
		if (target.className.indexOf('destroy') > -1) {
			controller.removeItem(lookupId(target));
		}

		// If you click the checkmark
		if (target.className.indexOf('toggle') > -1) {
			controller.toggleComplete(lookupId(target), target);
		}
	});

	window.$$('#todo-list').addEventListener('dblclick', function (e) {
		var target = e.target;

		if (target.nodeName === 'LABEL') {
			controller.editItem(lookupId(target), target);
		}
	});

	window.$$('#toggle-all').addEventListener('click', function (e) {
		controller.toggleAll(e);
	});

	window.$$('#clear-completed').addEventListener('click', function () {
		controller.removeCompletedItems();
	});
});
