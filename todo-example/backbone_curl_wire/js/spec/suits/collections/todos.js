define(
[
  'require',
  'when',
  'wire',
  'collections/todos'
],
function( require, when, wire, Todos ) {

  console.log( wire );

  var Backbone = require( 'backbone' );
  
  describe( "Todos collection", function() {

    it( "is a backbone collection", function() {

      // It returned something
      expect( Todos ).toBeDefined();

      // Check for a function that only a backbone collection is likely to have
      expect( ( new Todos() ).getByCid ).toBeDefined();

    } );

    it( "create a new context, containing a new todo view and model", function() {
      // This is a little hard to test without testing the todo spec
      // BEWARE: Wire does a lot of magic here!

      var todos = new Todos(),
        deferred = when.defer(),
        model = { test: 'model' },
        add_stub = sinon.stub( todos, 'add' );

      todos._createTodo = function() { return deferred; };
      
      todos.create( {} );

      deferred.resolve( {
        view: {},
        model: model
      } );

      // Check that the model is added to the collection
      expect( add_stub ).toHaveBeenCalledOnce();
      expect( add_stub ).toHaveBeenCalledWith( model );
      
    } );

    it( "check for models that are done or remaining", function() {
      
      var todos = new Todos(
        [
          new Backbone.Model( { done: true } ),
          new Backbone.Model( { done: true } ),
          new Backbone.Model( { done: false } )
        ]
      );

      expect( todos.done().length ).toEqual( 2 );
      expect( todos.remaining().length ).toEqual( 1 );
      
    } );
    

  } );
  

} );