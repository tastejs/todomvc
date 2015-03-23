define([
  './component',
  'troopjs-hub/emitter',
  'poly/array'
], function(Component, hub) {
  'use strict';

  return Component.extend({
    'hub/todos/change(true)': function(tasks) {
      var count = tasks
        .filter(function(task) {
          return task.completed;
        })
        .length;

      this.$element.toggle(count > 0);
    },

    'dom/click': function() {
      hub.emit('todos/clear');
    }
  });
});
