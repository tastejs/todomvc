/*global Todos Ember */
'use strict';

Todos.TodosController = Ember.ArrayController.extend({
  /* Actions */

  actions: {
    createTodo: function () {
      // Get the todo title set by the "New Todo" text field
      var title = this.get('newTitle');
      if (!title.trim()) { return; }

      // Create the new Todo model
      Todos.Todo.createRecord({
        title: title,
        isCompleted: false
      });

      // Clear the "New Todo" text field
      this.set('newTitle', '');

      // Save the new model
      this.get('store').commit();
    },

    clearCompleted: function () {
      var completed = this.filterProperty('isCompleted', true);
      completed.invoke('deleteRecord');

      this.get('store').commit();
    }
  },

  /* Properties */

  newTitle: '',

	remaining: function () {
		return this.filterProperty('isCompleted', false).get('length');
	}.property('@each.isCompleted'),

	remainingFormatted: function () {
		var remaining = this.get('remaining');
		var plural = remaining === 1 ? 'item' : 'items';
		return '<strong>%@</strong> %@ left'.fmt(remaining, plural);
	}.property('remaining'),

	completed: function () {
		return this.filterProperty('isCompleted', true).get('length');
	}.property('@each.isCompleted'),

	hasCompleted: function () {
		return this.get('completed') > 0;
	}.property('completed'),

	allAreDone: function (key, value) {
		if (value !== undefined) { /* setter */
			this.setEach('isCompleted', value);
			return value;
		} else {                   /* getter */
			return !!this.get('length') &&
				this.everyProperty('isCompleted', true);
		}
	}.property('@each.isCompleted')
});
