define(
[
  'jquery',
  'underscore',
  'backbone'
],
function($, _, Backbone){
  var TodoView = Backbone.View.extend({

    //... is a list tag.
    tagName:  "li",

    // Template that will be replaced with the real one by the wiring spec
    template: function() { return ''; },

    // The DOM events specific to an item.
    events: {
      "click .check"              : "toggleDone",
      "dblclick div.todo-content" : "edit",
      "click span.todo-destroy"   : "clear",
      "keypress .todo-input"      : "updateOnEnter",
      "blur .todo-input"          : "close"
    },

    // The TodoView listens for changes to its model, re-rendering. Since there's
    // a one-to-one correspondence between a **Todo** and a **TodoView** in this
    // app, we set a direct reference on the model for convenience.
    initialize: function() {
      _.bindAll(this, 'render', 'close', 'remove');
    },

    // Re-render the contents of the todo item.
    render: function( model ) {
      $( this.el ).html( this.template( model.toJSON() ) );
      this.input = this.$( '.todo-input' ).get( 0 );
      this.check = this.$( '.check' ).get( 0 );
      return this;
    },

    // Toggle the `"done"` state of the model.
    toggleDone: function() {
      this.trigger( 'done', this.check.checked );
    },

    // Switch this view into `"editing"` mode, displaying the input field.
    edit: function() {
      $( this.el ).addClass( "editing" );
      $( this.input ).focus();
    },

    // Close the `"editing"` mode, saving changes to the todo.
    close: function() {
      this.trigger( 'changeContent', { content: $( this.input ).val() } );
      $( this.el ).removeClass( "editing" );
    },

    // If you hit `enter`, we're through editing the item.
    updateOnEnter: function( e ) {
      if ( e.keyCode == 13 ) this.close();
    },

    // Remove the item, destroy the model.
    clear: function() {
      this.trigger( 'destroy' );
    }

  });
  return TodoView;
});
