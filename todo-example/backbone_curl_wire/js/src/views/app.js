define(
[
  'underscore',
  'jquery',
  'backbone'
],
function( _, $, Backbone ) {
  var AppView = Backbone.View.extend({

    // Dom elements
    // These will be overwriten by our wiring spec
    input: '',
    allCheckbox: '',
    stats: '',
    list: '',
    tooltip: '',

    // Our template for the line of statistics at the bottom of the app.
    // This will be overwrite with a real template by our wire spec
    statsTemplate: function() { return ''; },

    // Delegated events for creating new items, and clearing completed ones.
    events: {
      "keypress #new-todo":  "createOnEnter",
      "keyup #new-todo":     "showTooltip",
      "click .todo-clear a": "clearCompleted",
      "click .mark-all-done": "toggleAllComplete"
    },

    // Re-rendering the App just means refreshing the statistics -- the rest
    // of the app doesn't change.
    render: function( event, model ) {

      // Since this will be bound to all events, normalize the callback arguments
      var collection = ( model.collection ) ? model.collection :
                      ( ( model instanceof Backbone.Collection ) ? model : false );

      if ( !collection ) return;

      var remaining = collection.remaining().length;

      $( this.stats ).html( this.statsTemplate( {
        total:      collection.length,
        done:       collection.done().length,
        remaining:  remaining
      } ) );

      this.allCheckbox.checked = !remaining;
    },

    // Add a single todo item to the list by creating a view for it, and
    // appending its element to the `<ul>`.
    addOne: function( todo ) {
      $( this.list ).append( todo.view.render( todo ).el );
    },

    // Add all items in the **Todos** collection at once.
    addAll: function( todos ) {
      todos.each( this.addOne );
    },

    // If you hit return in the main input field, create new **Todo** model,
    // persisting it to *localStorage*.
    createOnEnter: function( e ) {
      if ( !e || e.keyCode != 13 ) return; // On enter

      var $input = $( this.input );
      // Tell everyone about what just happened
      this.trigger( 'todoSubmission', {
        content: $input.val()
      } );

      // Reset the input
      $input.val('');
    },

    // Trigger the 'clearDone' event
    clearCompleted: function( e ) {
      if ( e ) e.preventDefault();

      this.trigger( 'clearDone' );
    },

    // Trigger the 'toggleDone' event so that it's `done` state matches the check all
    toggleAllComplete: function ( e ) {
      var done = this.allCheckbox.checked;
      this.trigger( 'toggleDone', done );
    },

    // Lazily show the tooltip that tells you to press `enter` to save
    // a new todo item, after one second.
    showTooltip: function( e ) {
      var $tooltip = $( this.tooltip ),
        $input = $( this.input ),
        val = $input.val();
      
      $tooltip.fadeOut();

      if ( this.tooltipTimeout ) clearTimeout( this.tooltipTimeout );
      if ( !val || val == $input.attr( 'placeholder' ) ) return;
      var show = function() { $tooltip.show().fadeIn(); };
      this.tooltipTimeout = _.delay( show, 1000 );
    }


  });
  return AppView;
});
