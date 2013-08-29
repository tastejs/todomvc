/*global Todos Ember */
'use strict';

Todos.TodoController = Ember.ObjectController.extend({
	isEditing: false,

  actions: {
    editTodo: function () {
      this.set('isEditing', true);
    },

    removeTodo: function () {
      var todo = this.get('model');

      todo.deleteRecord();
      todo.get('store').commit();
    }
  }
});
