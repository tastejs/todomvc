define(
[
  'jquery',
  'backbone'
],
function( $, Backbone ) {

  var TodoView = Backbone.View.extend( {

    // Strings, specifying the jQuery selectors for different elements
    // These will be overwritten in the todo.js wire spec
    input: '',
    checkbox: '',

    // Class names
    editing: '',

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

    // Re-render the contents of the todo item.
    render: function( model ) {
      $( this.el ).html( this.template( model.toJSON() ) );
      return this;
    },

    // Toggle the `"done"` state of the model.
    toggleDone: function() {
      this.trigger( 'changeDone', { 'done': !!this.$( this.checkbox ).is( ':checked' ) } );
    },

    // Switch this view into `"editing"` mode, displaying the input field.
    edit: function() {
      $( this.el ).addClass( this.editing );
      this.$( this.input ).focus();
    },

    // Close the `"editing"` mode, saving changes to the todo.
    close: function() {
      this.trigger( 'changeContent', { content: this.$( this.input ).val() } );
      $( this.el ).removeClass( this.editing );
    },

    // If you hit `enter`, we're through editing the item.
    updateOnEnter: function( e ) {
      if ( e.keyCode == 13 ) this.close();
    },

    // Trigger the destroy method
    clear: function() {
      this.trigger( 'destroy' );
    }

  } );

  return TodoView;
} );
