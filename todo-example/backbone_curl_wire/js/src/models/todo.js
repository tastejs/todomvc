define(
[
  'backbone'
],
function( Backbone ) {

  var TodoModel = Backbone.Model.extend({

    // Default attributes for the todo.
    defaults: {
      content: "empty todo...",
      done: false
    },

    // Ensure that each todo created has `content`.
    initialize: function() {
      
    }

  });

  return TodoModel;
});
