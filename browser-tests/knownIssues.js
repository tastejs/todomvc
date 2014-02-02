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
	'TodoMVC - knockoutjs, Persistence, should persist its data'
];
