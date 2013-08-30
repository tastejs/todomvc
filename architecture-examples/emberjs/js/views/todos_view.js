/*global Todos Ember */
'use strict';

Todos.TodosView = Ember.View.extend({
  focusTodo: function () {
    this.$('#new-todo').focus();
  }.on('didInsertElement')
});
