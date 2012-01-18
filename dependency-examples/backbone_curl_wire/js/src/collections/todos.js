define(
[
  'when',
  'underscore',
  'backbone',
  'backbone/localstorage'
],
function( when, _, Backbone, Store ) {

	var TodosCollection = Backbone.Collection.extend({

    // Will be overwritten with an injected wire function
    _createTodo: function() {},

    // Override Backbone's default create method so we can take advantage of wire.js's creation methods
    // Creates our todo Model and View, then saves it and passes it to the collection
    create: function( attributes ) {

      var self = this;

      // Run the function created in our wiring spec, to create necessary objects
      // Pass in our attributes so they can be used in the creation of the model
      // BEWARE: Wire does a lot of magic here!
      return this._createTodo( { 'todo_attributes': attributes } ).then( function( todo_context ) {
        
        // After creating the model, add it to the collection
        self.add( todo_context.model );

        // When the model is destroyed kill the whole context
        todo_context.model.bind( 'destroy', function() {
          todo_context.destroy();
        } );

      } );
      
    },

    reset: function( models, options ) {
      var self = this;
      models  || (models = []);
      options || (options = {});
      this.each(this._removeReference);
      this._reset();

      var promises = _.map( models, function( model ) {
        return self.create( model );
      } );

      if ( !options.silent ) when.all( promises, function() {
        self.trigger( 'reset', self, options );
      } );

      return this;
    },

    // Save all of the todo items under the `"todos"` namespace.
    localStorage: new Store("todos-backbone-curl-wire"),

    // Filter down the list of all todo items that are finished.
    done: function() {
      return this.filter( function( todo ) { return todo.get( 'done' ); } );
    },

    // Filter down the list to only todo items that are still not finished.
    remaining: function() {
      return this.without.apply( this, this.done() );
    },

    clearDone: function() {
      _.invoke( this.done(), 'destroy' );
    },

    // Set all models to have the done value passed in
    toggleDone: function( done ) {
      this.invoke( 'save', { 'done': !!done } );
    }



    // We keep the Todos in sequential order, despite being saved by unordered
    // GUID in the database. This generates the next order number for new items.
    // nextOrder: function() {
    //   if (!this.length) return 1;
    //   return this.last().get('order') + 1;
    // },

    // Todos are sorted by their original insertion order.
    // comparator: function(todo) {
    //   return todo.get('order');
    // }

  });

  return TodosCollection;
});
