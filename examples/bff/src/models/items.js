/* global define */
define(['bff/list'], function (List) {

	'use strict';

	var ItemList = List.withProperties({
		// The nCompleted property is calculated by traversing the list items and summing up all completed items.
		nCompleted: {
			getter: function () {
				return this.reduce(function (sum, item) { return sum + item.completed; }, 0);
			},
			// Because we specify that this property depends on the list length and the completed state of all list
			// items, whenever any of those change, a check will be performed to see if this property has changed, and
			// if so a change event will be emitted.
			dependencies: ['length', 'item:completed']
		},
		// No dependencies specified -> will not trigger any events (no one is listening anyway)
		nActive: { getter: function () { return this.length - this.nCompleted; } }

	});

	// Create and return a singleton instance of an ItemList
	return new ItemList();

});
