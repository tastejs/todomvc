module.exports = [
	// the following are covered by the following issue:
	// https://github.com/tastejs/todomvc/issues/789
	'TodoMVC - agilityjs, Editing, should cancel edits on escape',
	'TodoMVC - angularjs-perf, Editing, should cancel edits on escape',
	'TodoMVC - closure, Editing, should cancel edits on escape',
	'TodoMVC - jquery, Editing, should cancel edits on escape',
	'TodoMVC - knockback, Editing, should cancel edits on escape',
	'TodoMVC - spine, Editing, should cancel edits on escape',
	'TodoMVC - yui, Editing, should cancel edits on escape',

	// all the following are covered by this issue:
	// https://github.com/tastejs/todomvc/issues/790
	// these implementations filter the view rather than the model when routing
	'TodoMVC - agilityjs, Routing, should allow me to display active items',
	'TodoMVC - agilityjs, Routing, should allow me to display completed items',
	'TodoMVC - backbone, Routing, should allow me to display active items',
	'TodoMVC - backbone, Routing, should allow me to display completed items',
	'TodoMVC - maria, Routing, should allow me to display active items',
	'TodoMVC - maria, Routing, should allow me to display completed items',
	'TodoMVC - dojo, Routing, should allow me to display active items',
	'TodoMVC - dojo, Routing, should allow me to display completed items',

	// the following are covered by this issue:
	// https://github.com/tastejs/todomvc/issues/795
	'TodoMVC - spine, Mark all as completed, complete all checkbox should update state when items are completed / cleared',
	'TodoMVC - angularjs-perf, Mark all as completed, complete all checkbox should update state when items are completed / cleared',

	// the following implementations do not support routing
	'TodoMVC - jquery, Routing, should allow me to display active items',
	'TodoMVC - jquery, Routing, should allow me to display completed items',
	'TodoMVC - jquery, Routing, should allow me to display all items',
	'TodoMVC - jquery, Routing, should highlight the currently applied filter',

	// ----------------- Test framework issues -----------

	// for some reason the persistence test fails for knockout, even though persistence is working
	// just fine. Perhaps there is something asynchronous going on that is causing the assert
	// to be executed early?
	'TodoMVC - knockoutjs, Persistence, should persist its data',


	// ----------------- Unsupported implementations!! -----------

	// the following are TodoMVC implementations that are not supported by the autoated UI
	// tests, and as a result have numerous failures.

	// polymer - does not follow the HTML spec
	'TodoMVC - polymer, New Todo, should allow me to add todo items',
	'TodoMVC - polymer, New Todo, should clear text input field when an item is added',
	'TodoMVC - polymer, New Todo, should trim text input',
	'TodoMVC - polymer, New Todo, should show #main and #footer when items added',
	'TodoMVC - polymer, Mark all as completed, should allow me to mark all items as completed',
	'TodoMVC - polymer, Mark all as completed, should allow me to clear the completion state of all items',
	'TodoMVC - polymer, Mark all as completed, complete all checkbox should update state when items are completed / cleared',
	'TodoMVC - polymer, Item, should allow me to mark items as complete',
	'TodoMVC - polymer, Item, should allow me to un-mark items as complete',
	'TodoMVC - polymer, Item, should allow me to edit an item',
	'TodoMVC - polymer, Editing, should hide other controls when editing',
	'TodoMVC - polymer, Editing, should save edits on enter',
	'TodoMVC - polymer, Editing, should save edits on blur',
	'TodoMVC - polymer, Editing, should trim entered text',
	'TodoMVC - polymer, Editing, should remove the item if an empty text string was entered',
	'TodoMVC - polymer, Editing, should cancel edits on escape',
	'TodoMVC - polymer, Counter, should display the current number of todo items',
	'TodoMVC - polymer, Clear completed button, should display the number of completed items',
	'TodoMVC - polymer, Clear completed button, should remove completed items when clicked',
	'TodoMVC - polymer, Clear completed button, should be hidden when there are no items that are completed',
	'TodoMVC - polymer, Persistence, should persist its data',
	'TodoMVC - polymer, Routing, should allow me to display active items',
	'TodoMVC - polymer, Routing, should allow me to display completed items',
	'TodoMVC - polymer, Routing, should allow me to display all items',
	'TodoMVC - polymer, Routing, should highlight the currently applied filter',

	// gwt - does not follow the HTML spec closely eough for testing
	'TodoMVC - gwt, New Todo, should allow me to add todo items',
	'TodoMVC - gwt, New Todo, should trim text input',
	'TodoMVC - gwt, Mark all as completed, should allow me to mark all items as completed',
	'TodoMVC - gwt, Mark all as completed, should allow me to clear the completion state of all items',
	'TodoMVC - gwt, Mark all as completed, complete all checkbox should update state when items are completed / cleared',
	'TodoMVC - gwt, Item, should allow me to mark items as complete',
	'TodoMVC - gwt, Item, should allow me to un-mark items as complete',
	'TodoMVC - gwt, Item, should allow me to edit an item',
	'TodoMVC - gwt, Editing, should hide other controls when editing',
	'TodoMVC - gwt, Editing, should save edits on enter',
	'TodoMVC - gwt, Editing, should save edits on blur',
	'TodoMVC - gwt, Editing, should trim entered text',
	'TodoMVC - gwt, Editing, should remove the item if an empty text string was entered',
	'TodoMVC - gwt, Editing, should cancel edits on escape',
	'TodoMVC - gwt, Clear completed button, should display the number of completed items',
	'TodoMVC - gwt, Clear completed button, should remove completed items when clicked',
	'TodoMVC - gwt, Clear completed button, should be hidden when there are no items that are completed',
	'TodoMVC - gwt, Persistence, should persist its data',
	'TodoMVC - gwt, Routing, should allow me to display active items',
	'TodoMVC - gwt, Routing, should allow me to display completed items',
	'TodoMVC - gwt, Routing, should allow me to display all items',
	'TodoMVC - gwt, Routing, should highlight the currently applied filter',
];
