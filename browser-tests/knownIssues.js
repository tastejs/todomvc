module.exports = [

	// see: https://github.com/tastejs/todomvc/issues/832
	// chapling brunch does not mark items as completed via the completed CSS class
	'TodoMVC - chaplin-brunch, No Todos, should hide #main and #footer',
	'TodoMVC - chaplin-brunch, Mark all as completed, should allow me to mark all items as completed',
	'TodoMVC - chaplin-brunch, Mark all as completed, complete all checkbox should update state when items are completed / cleared',
	'TodoMVC - chaplin-brunch, Item, should allow me to mark items as complete',
	'TodoMVC - chaplin-brunch, Item, should allow me to un-mark items as complete',
	'TodoMVC - chaplin-brunch, Item, should allow me to edit an item',


	// durandal routing is very very slow.
	// see: https://github.com/tastejs/todomvc/issues/831
	'TodoMVC - durandal, Routing, should allow me to display active items',
	'TodoMVC - durandal, Routing, should allow me to display completed items',
	'TodoMVC - durandal, Routing, should allow me to display all items',
	'TodoMVC - durandal, Routing, should highlight the currently applied filter',

	// see: https://github.com/tastejs/todomvc/issues/830
	// typescript-backbone has a nested div within the li element, and sets /li/div[@class=done]
	'TodoMVC - typescript-backbone, Mark all as completed, should allow me to mark all items as completed / cleared',
	'TodoMVC - typescript-backbone, Item, should allow me to mark items as complete',
	'TodoMVC - typescript-backbone, Item, should allow me to un-mark items as complete',
	'TodoMVC - typescript-backbone, Item, should allow me to edit an item',

	// https://github.com/tastejs/todomvc/issues/829
	// checkbox state is inverted
	'TodoMVC - typescript-angular, Mark all as completed, should allow me to mark all items as completed',
	'TodoMVC - typescript-angular, Mark all as completed, should allow me to clear the completion state of all items',
	'TodoMVC - typescript-angular, Mark all as completed, complete all checkbox should update state when items are completed / cleared',

	// https://github.com/tastejs/todomvc/issues/828
	// routing should default to all
	'TodoMVC - batman, Routing, should highlight the currently applied filter',
	'TodoMVC - plastronjs, Routing, should highlight the currently applied filter',
	'TodoMVC - sammyjs, Routing, should highlight the currently applied filter',

	// https://github.com/tastejs/todomvc/issues/824
	// this implementation has numerous edit experience issues
	'TodoMVC - angularjs_require, Mark all as completed, should allow me to mark all items as completed',
	'TodoMVC - angularjs_require, Mark all as completed, should allow me to clear the completion state of all items',
	'TodoMVC - angularjs_require, Mark all as completed, complete all checkbox should update state when items are completed / cleared',

	// https://github.com/tastejs/todomvc/issues/824
	// this implementation has numerous edit experience issues
	'TodoMVC - typescript-backbone, Editing, should save edits on enter',
	'TodoMVC - typescript-backbone, Editing, should trim entered text',
	'TodoMVC - typescript-backbone, Editing, should remove the item if an empty text string was entered',
	'TodoMVC - typescript-backbone, Editing, should cancel edits on escape',

	// https://github.com/tastejs/todomvc/issues/823
	// prepends new items rather than appends
	'TodoMVC - puremvc, New Todo, should append new items to the bottom of the list',

	// https://github.com/tastejs/todomvc/issues/815
	// does not hide other controls while editing
	'TodoMVC - dojo, Editing, should hide other controls when editing',

	// https://github.com/tastejs/todomvc/issues/816
	// atma does not hide the main section, instead it hides the toggle-all checkbox
	'TodoMVC - atmajs, No Todos, should hide #main and #footer',

	// https://github.com/tastejs/todomvc/issues/817
	// batman does not trim input
	'TodoMVC - batman, New Todo, should trim text input',
	'TodoMVC - typescript-backbone, New Todo, should trim text input',

	// https://github.com/tastejs/todomvc/issues/818
	// does not trim edited text
	'TodoMVC - dermis, Editing, should trim entered text',
	'TodoMVC - kendo, Editing, should trim entered text',
	'TodoMVC - serenadejs, Editing, should trim entered text',

	// https://github.com/tastejs/todomvc/issues/819
	// the edit experience with soma is quite broken. You can 
	// get multiple elements into an edit state
	'TodoMVC - somajs, Editing, should remove the item if an empty text string was entered',
	'TodoMVC - somajs_require, Editing, should remove the item if an empty text string was entered',
	'TodoMVC - somajs_require, Editing, should cancel edits on escape',

	// the following are covered by the following issue:
	// https://github.com/tastejs/todomvc/issues/789
	'TodoMVC - agilityjs, Editing, should cancel edits on escape',
	'TodoMVC - angularjs-perf, Editing, should cancel edits on escape',
	'TodoMVC - closure, Editing, should cancel edits on escape',
	'TodoMVC - jquery, Editing, should cancel edits on escape',
	'TodoMVC - knockback, Editing, should cancel edits on escape',
	'TodoMVC - spine, Editing, should cancel edits on escape',
	'TodoMVC - yui, Editing, should cancel edits on escape',
	'TodoMVC - ariatemplates, Editing, should cancel edits on escape',
	'TodoMVC - dermis, Editing, should cancel edits on escape',
	'TodoMVC - duel, Editing, should cancel edits on escape',
	'TodoMVC - epitome, Editing, should cancel edits on escape',
	'TodoMVC - extjs_deftjs, Editing, should cancel edits on escape',
	'TodoMVC - kendo, Editing, should cancel edits on escape',
	'TodoMVC - olives, Editing, should cancel edits on escape',
	'TodoMVC - plastronjs, Editing, should cancel edits on escape',
	'TodoMVC - puremvc, Editing, should cancel edits on escape',
	'TodoMVC - rappidjs, Editing, should cancel edits on escape',
	'TodoMVC - serenadejs, Editing, should cancel edits on escape',
	'TodoMVC - somajs, Editing, should cancel edits on escape',
	'TodoMVC - thorax, Editing, should cancel edits on escape',
	'TodoMVC - typescript-angular, Editing, should cancel edits on escape',
	'TodoMVC - angularjs_require, Editing, should cancel edits on escape',
	'TodoMVC - backbone_marionette_require, Editing, should cancel edits on escape',
	'TodoMVC - flight, Editing, should cancel edits on escape',
	'TodoMVC - thorax_lumbar, Editing, should cancel edits on escape',
	'TodoMVC - backbone_require, Editing, should cancel edits on escape',
	'TodoMVC - batman, Editing, should cancel edits on escape',
	'TodoMVC - dijon, Editing, should cancel edits on escape',
	'TodoMVC - knockoutjs_require, Editing, should cancel edits on escape',

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
	'TodoMVC - atmajs, Routing, should allow me to display active items',
	'TodoMVC - atmajs, Routing, should allow me to display completed items',
	'TodoMVC - backbone_marionette, Routing, should allow me to display active items',
	'TodoMVC - backbone_marionette, Routing, should allow me to display completed items',
	'TodoMVC - exoskeleton, Routing, should allow me to display active items',
	'TodoMVC - exoskeleton, Routing, should allow me to display completed items',
	'TodoMVC - thorax, Routing, should allow me to display active items',
	'TodoMVC - thorax, Routing, should allow me to display completed items',
	'TodoMVC - thorax_lumbar, Routing, should allow me to display active items',
	'TodoMVC - thorax_lumbar, Routing, should allow me to display completed items',
	'TodoMVC - troopjs_require, Routing, should allow me to display active items',
	'TodoMVC - troopjs_require, Routing, should allow me to display completed items',
	'TodoMVC - backbone_require, Routing, should allow me to display active items',
	'TodoMVC - backbone_require, Routing, should allow me to display completed items',
	'TodoMVC - ariatemplates, Routing, should allow me to display active items',
	'TodoMVC - ariatemplates, Routing, should allow me to display completed items',
	'TodoMVC - backbone_marionette_require, Routing, should allow me to display active items',
	'TodoMVC - backbone_marionette_require, Routing, should allow me to display completed items',
	'TodoMVC - chaplin-brunch, Routing, should allow me to display active items',
	'TodoMVC - chaplin-brunch, Routing, should allow me to display completed items',


	// the following are covered by this issue:
	// https://github.com/tastejs/todomvc/issues/795
	'TodoMVC - spine, Mark all as completed, complete all checkbox should update state when items are completed / cleared',
	'TodoMVC - angularjs-perf, Mark all as completed, complete all checkbox should update state when items are completed / cleared',
	'TodoMVC - kendo, Mark all as completed, complete all checkbox should update state when items are completed / cleared',

	// the following implementations do not support routing
	'TodoMVC - jquery, Routing, should allow me to display active items',
	'TodoMVC - jquery, Routing, should allow me to display completed items',
	'TodoMVC - jquery, Routing, should allow me to display all items',
	'TodoMVC - jquery, Routing, should highlight the currently applied filter',
	'TodoMVC - extjs_deftjs, Routing, should allow me to display active items',
	'TodoMVC - extjs_deftjs, Routing, should allow me to display completed items',
	'TodoMVC - extjs_deftjs, Routing, should allow me to display all items',
	'TodoMVC - extjs_deftjs, Routing, should highlight the currently applied filter',
	'TodoMVC - olives, Routing, should allow me to display active items',
	'TodoMVC - olives, Routing, should allow me to display completed items',
	'TodoMVC - olives, Routing, should allow me to display all items',
	'TodoMVC - olives, Routing, should highlight the currently applied filter',
	'TodoMVC - dijon, Routing, should allow me to display active items',
	'TodoMVC - dijon, Routing, should allow me to display completed items',
	'TodoMVC - dijon, Routing, should allow me to display all items',
	'TodoMVC - dijon, Routing, should highlight the currently applied filter',
	'TodoMVC - duel, Routing, should allow me to display active items',
	'TodoMVC - duel, Routing, should allow me to display completed items',
	'TodoMVC - duel, Routing, should allow me to display all items',
	'TodoMVC - duel, Routing, should highlight the currently applied filter',
	'TodoMVC - knockoutjs_require, Routing, should allow me to display active items',
	'TodoMVC - knockoutjs_require, Routing, should allow me to display completed items',
	'TodoMVC - knockoutjs_require, Routing, should allow me to display all items',
	'TodoMVC - knockoutjs_require, Routing, should highlight the currently applied filter',
	'TodoMVC - angular-dart, Routing, should allow me to display active items',
	'TodoMVC - angular-dart, Routing, should allow me to display completed items',
	'TodoMVC - angular-dart, Routing, should allow me to display all items',
	'TodoMVC - angular-dart, Routing, should highlight the currently applied filter',
	'TodoMVC - typescript-backbone, Routing, should allow me to display active items',
	'TodoMVC - typescript-backbone, Routing, should allow me to display completed items',
	'TodoMVC - typescript-backbone, Routing, should allow me to display all items',
	'TodoMVC - typescript-backbone, Routing, should highlight the currently applied filter',

	// EXTJS is not spec compliant (by a long way!)
	'TodoMVC - extjs, New Todo, should show #main and #footer when items added',
	'TodoMVC - extjs, Mark all as completed, should allow me to mark all items as completed',
	'TodoMVC - extjs, Mark all as completed, complete all checkbox should update state when items are completed / cleared',
	'TodoMVC - extjs, Item, should allow me to mark items as complete',
	'TodoMVC - extjs, Item, should allow me to un-mark items as complete',
	'TodoMVC - extjs, Editing, should save edits on blur',
	'TodoMVC - extjs, Editing, should cancel edits on escape',
	'TodoMVC - extjs, Counter, should display the current number of todo items',
	'TodoMVC - extjs, Clear completed button, should display the number of completed items',
	'TodoMVC - extjs, Clear completed button, should remove completed items when clicked',
	'TodoMVC - extjs, Clear completed button, should be hidden when there are no items that are completed',
	'TodoMVC - extjs, Persistence, should persist its data',
	'TodoMVC - extjs, Routing, should allow me to display active items',
	'TodoMVC - extjs, Routing, should allow me to display completed items',
	'TodoMVC - extjs, Routing, should allow me to display all items',
	'TodoMVC - extjs, Routing, should highlight the currently applied filter',

	// stapes is completely broken!
	// see: https://github.com/tastejs/todomvc/issues/808
	'TodoMVC - stapes, Mark all as completed, should allow me to mark all items as completed',
	'TodoMVC - stapes, Mark all as completed, should allow me to clear the completion state of all items',
	'TodoMVC - stapes, Mark all as completed, complete all checkbox should update state when items are completed / cleared',
	'TodoMVC - stapes, Item, should allow me to mark items as complete',
	'TodoMVC - stapes, Item, should allow me to un-mark items as complete',
	'TodoMVC - stapes, Item, should allow me to edit an item',
	'TodoMVC - stapes, Editing, should hide other controls when editing',
	'TodoMVC - stapes, Editing, should save edits on enter',
	'TodoMVC - stapes, Editing, should save edits on blur',
	'TodoMVC - stapes, Editing, should trim entered text',
	'TodoMVC - stapes, Editing, should remove the item if an empty text string was entered',
	'TodoMVC - stapes, Editing, should cancel edits on escape',
	'TodoMVC - stapes, Counter, should display the current number of todo items',
	'TodoMVC - stapes, Clear completed button, should display the number of completed items',
	'TodoMVC - stapes, Clear completed button, should remove completed items when clicked',
	'TodoMVC - stapes, Clear completed button, should be hidden when there are no items that are completed',
	'TodoMVC - stapes, Persistence, should persist its data',
	'TodoMVC - stapes, Routing, should allow me to display active items',
	'TodoMVC - stapes, Routing, should allow me to display completed items',
	'TodoMVC - stapes, Routing, should allow me to display all items',
	'TodoMVC - stapes_require, No Todos, should hide #main and #footer',
	'TodoMVC - stapes_require, New Todo, should allow me to add todo items',
	'TodoMVC - stapes_require, New Todo, should append new items to the bottom of the list',
	'TodoMVC - stapes_require, New Todo, should trim text input',
	'TodoMVC - stapes_require, Mark all as completed, should allow me to mark all items as completed',
	'TodoMVC - stapes_require, Mark all as completed, should allow me to clear the completion state of all items',
	'TodoMVC - stapes_require, Mark all as completed, complete all checkbox should update state when items are completed / cleared',
	'TodoMVC - stapes_require, Item, should allow me to mark items as complete',
	'TodoMVC - stapes_require, Item, should allow me to un-mark items as complete',
	'TodoMVC - stapes_require, Item, should allow me to edit an item',
	'TodoMVC - stapes_require, Editing, should hide other controls when editing',
	'TodoMVC - stapes_require, Editing, should save edits on enter',
	'TodoMVC - stapes_require, Editing, should save edits on blur',
	'TodoMVC - stapes_require, Editing, should trim entered text',
	'TodoMVC - stapes_require, Editing, should remove the item if an empty text string was entered',
	'TodoMVC - stapes_require, Editing, should cancel edits on escape',
	'TodoMVC - stapes_require, Counter, should display the current number of todo items',
	'TodoMVC - stapes_require, Clear completed button, should display the number of completed items',
	'TodoMVC - stapes_require, Clear completed button, should remove completed items when clicked',
	'TodoMVC - stapes_require, Clear completed button, should be hidden when there are no items that are completed',
	'TodoMVC - stapes_require, Routing, should allow me to display active items',
	'TodoMVC - stapes_require, Routing, should allow me to display completed items',
	'TodoMVC - stapes_require, Routing, should allow me to display all items',

	// mozart is not on the public website
	'TodoMVC - mozart, New Todo, should allow me to add todo items',
	'TodoMVC - mozart, New Todo, should trim text input',

	// ----------------- Test framework issues -----------

	// for some reason the persistence test fails for knockout, even though persistence is working
	// just fine. Perhaps there is something asynchronous going on that is causing the assert
	// to be executed early?
	'TodoMVC - knockoutjs, Persistence, should persist its data',

	// chaplin edit tests fail with the following:
	// StaleElementReferenceError: stale element reference: element is not attached to the page document
	'TodoMVC - chaplin-brunch, Editing, should save edits on enter',
	'TodoMVC - chaplin-brunch, Editing, should save edits on blur',
	'TodoMVC - chaplin-brunch, Editing, should trim entered text',
	'TodoMVC - chaplin-brunch, Editing, should remove the item if an empty text string was entered',
	'TodoMVC - chaplin-brunch, Editing, should cancel edits on escape'
];
