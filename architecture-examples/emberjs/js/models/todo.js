/*global Todos, DS */
(function () {
	'use strict';

	Todos.Todo = DS.Model.extend({
		title: DS.attr('string'),
		isCompleted: DS.attr('boolean')
	});
})();
