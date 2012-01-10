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
    }

  });

  return TodoModel;
});
