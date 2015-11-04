/*jshint quotmark:false */
/*jshint newcap:false */

var app = app || {};

(function () {
	'use strict';

	var Utils = app.Utils;

	app.todoActions = app.alt.generateActions(
		'toggleAll',
		'toggle',
		'destroy',
		'save',
		'clearCompleted',
		'edit',
		'show'
	);

	app.todoActions = Utils.extend(
		app.todoActions,
		app.alt.createActions({
			addTodo: function (title) {
				return {
					id: Utils.uuid(),
					title: title,
					completed: false
				};
			}
		})
	);
})();
