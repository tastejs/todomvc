/*global Todos Ember */
'use strict';

Todos.TodosView = Ember.View.extend({
  didInsertElement: function () {
    this.$('#new-todo').focus();
  }
});
