/*global Todos DS Ember */
'use strict';

Todos.Todo = DS.Model.extend({
	title: DS.attr('string'),
	isCompleted: DS.attr('boolean'),

	todoDidChange: function () {
		Ember.run.once(this, function () {
			this.get('store').commit();
		});
	}.observes('isCompleted', 'title')
});
