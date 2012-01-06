define([
  'require',
  'underscore',
  'backbone'
], function( require, _, Backbone ){
  var AppView = Backbone.View.extend({

    // Our template for the line of statistics at the bottom of the app.
    //statsTemplate: _.template(statsTemplate),

    // Delegated events for creating new items, and clearing completed ones.
    events: {
      "keypress #new-todo":  "createOnEnter"
      //"keyup #new-todo":     "showTooltip",
      //"click .todo-clear a": "clearCompleted",
      //"click .mark-all-done": "toggleAllComplete"
    },

    // At initialization we bind to the relevant events on the `Todos`
    // collection, when items are added or changed. Kick things off by
    // loading any preexisting todos that might be saved in *localStorage*.
    initialize: function( options ) {
      _.bindAll(this, 'toggleAllComplete');

      //this.input    = this.$("#new-todo");
      //this.allCheckbox = this.$(".mark-all-done")[0];

      //Todos.fetch();
    },

    // Re-rendering the App just means refreshing the statistics -- the rest
    // of the app doesn't change.
    render: function( todos ) {
      var done = todos.done().length;
      var remaining = todos.remaining().length;

      this.$('#todo-stats').html(this.statsTemplate({
        total:      todos.length,
        done:       done,
        remaining:  remaining
      }));

      this.allCheckbox.checked = !remaining;
    },

    // Add a single todo item to the list by creating a view for it, and
    // appending its element to the `<ul>`.
    addOne: function( todo ) {
      //var view = new TodoView({model: todo});
      //this.$("#todo-list").append(view.render().el);

      //var self = this;
      //require( 'wire!todo' ).then( function( context ) {
      //  self.$("#todo-list").append( context.view.render().el );
      //} );
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
      this.trigger( 'inputEntry', {
        content: $input.val()
      } );

      // Reset the input
      $input.val('');
    },

    // Clear all done todo items, destroying their models.
    clearCompleted: function() {
      _.each(Todos.done(), function(todo){ todo.clear(); });
      return false;
    },

    // Lazily show the tooltip that tells you to press `enter` to save
    // a new todo item, after one second.
    showTooltip: function(e) {
      var tooltip = this.$(".ui-tooltip-top");
      var val = this.input.val();
      tooltip.fadeOut();
      if (this.tooltipTimeout) clearTimeout(this.tooltipTimeout);
      if (val == '' || val == this.input.attr('placeholder')) return;
      var show = function(){ tooltip.show().fadeIn(); };
      this.tooltipTimeout = _.delay(show, 1000);
    },

    // Change each todo so that it's `done` state matches the check all
    toggleAllComplete: function () {
      var done = this.allCheckbox.checked;
      Todos.each(function (todo) { todo.save({'done': done}); });
    }

  });
  return AppView;
});
