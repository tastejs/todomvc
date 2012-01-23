define(
[
  'backbone',
  'underscore',
  'when',
  'collections/todos'
],
function( Backbone, _, when, Todos ) {

  describe( "Todos collection", function() {

    beforeEach( function() {
      this.sync = sinon.stub( Backbone, 'sync' ); // Stop it saving the test models to localstorage
    } );

    it( "is a backbone collection", function() {

      // It returned something
      expect( Todos ).toBeDefined();

      // Check its a backbone collection instance
      expect( ( new Todos() ) instanceof Backbone.Collection ).toBeTruthy();

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

    it( "reset should create all new contexts", function() {

      var todos = new Todos(),
        deferreds = [],
        models = [
          { test: 'model' },
          { test2: 'model2' }
        ],
        create_stub = sinon.stub( todos, 'create', function() {
          var deferred = when.defer();
          deferreds.push( deferred );
          return deferred;
        } ),
        reset_spy = sinon.spy();

      todos.bind( 'reset', reset_spy );
      
      todos.reset( models );

      expect( create_stub ).toHaveBeenCalledTwice();
      expect( create_stub ).toHaveBeenCalledWith( models[ 0 ] );
      expect( create_stub ).toHaveBeenCalledWith( models[ 1 ] );

      _.each( deferreds, function( def ) { def.resolve(); } );

      expect( reset_spy ).toHaveBeenCalledOnce();
      
    } );

    it( "check for models that are done or remaining", function() {
      
      var todos = new Todos();

      todos.add( { done: true } );
      todos.add( { done: true } );
      todos.add( { done: false } );

      expect( todos.done().length ).toEqual( 2 );
      expect( todos.remaining().length ).toEqual( 1 );
      
    } );

    it( "remove all models that have a done value of 'true'", function() {
      
      var todos = new Todos();

      todos.add( { done: true } );
      todos.add( { done: true } );
      todos.add( { done: false } );

      todos.clearDone();

      expect( todos.length ).toEqual( 1 );
      expect( todos.done().length ).toEqual( 0 );
      
    } );

    it( "set all models to have a done value", function() {
      
      var todos = new Todos();

      todos.add( { done: true } );
      todos.add( { done: true } );
      todos.add( { done: false } );

      todos.toggleDone( true );

      expect( todos.done().length ).toEqual( 3 );

      todos.toggleDone( false );

      expect( todos.done().length ).toEqual( 0 );
      
    } );
    
    afterEach( function() {
      this.sync.restore();
    } );

  } );
  

} );