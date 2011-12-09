define(['underscore', 'backbone'], function(_, Backbone) {
  var TodoModel = Backbone.Model.extend({

    // Default attributes for the todo.
    defaults: {
      content: "empty todo...",
      done: false
    },

    // Ensure that each todo created has `content`.
    initialize: function() {
      if (!this.get("content")) {
        this.set({"content": this.defaults.content});
      }
    },

    // Toggle the `done` state of this todo item.
    toggle: function() {
      this.save({done: !this.get("done")});
    },

    // Remove this Todo from *localStorage* and delete its view.
    clear: function() {
      this.destroy();
      this.view.remove();
    }

  });
  return TodoModel;
});
