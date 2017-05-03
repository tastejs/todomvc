define(
[
  'backbone',
  'jquery',
  'views/todo'
],
function( Backbone, $, View ) {
  
  describe( "Todo view", function() {

    it( "is a backbone view", function() {

      // It returned something
      expect( View ).toBeDefined();

      // Check its a backbone view instance
      expect( ( new View() ) instanceof Backbone.View ).toBeTruthy();

    } );

    // Test the render function
    it( "can render the template", function() {
      
      var view = new View(),
          template = sinon.stub( view, 'template' ).returns( '<div id="test1" ></div>' );

      view.render( new Backbone.Model() );

      expect( template ).toHaveBeenCalledOnce();
      expect( view.$( '#test1' ).length ).toBeTruthy();

    } );

    it( "can determine state of the checkbox", function() {
      
      var view = new View( {
          el: '<div><input type="checkbox" class="checkbox" checked /></div>'
        } ),
        spy = sinon.spy();

      view.checkbox = '.checkbox';
      view.bind( 'changeDone', spy );
      view.toggleDone();

      expect( spy ).toHaveBeenCalledOnce();
      expect( spy ).toHaveBeenCalledWithExactly( { 'done': true } );

    } );

    it( "sets the state of the view to edit", function() {
      
      var view = new View( {
          el: '<div><input type="text" class="input" /></div>'
        } ),
        spy = sinon.spy();

      view.editing = 'editing';
      view.input = '.input';
      $( view.el ).find( view.input ).on( 'focus', spy );
      view.edit();

      expect( $( view.el ).hasClass( view.editing ) ).toBeTruthy(); // Has set editing class
      expect( spy ).toHaveBeenCalledOnce(); // Focused on the input

    } );

    it( "can finished editing", function() {
      
      var view = new View( {
          el: '<div class="editing"><input type="text" class="input" value="test1" /></div>'
        } ),
        spy = sinon.spy();

      view.editing = 'editing';
      view.input = '.input';
      view.bind( 'changeContent', spy );
      view.close();

      expect( $( view.el ).hasClass( view.editing ) ).not.toBeTruthy(); // Has removed editing class
      expect( spy ).toHaveBeenCalledOnce();
      expect( spy ).toHaveBeenCalledWithExactly( { content: 'test1' } );

    } );


    it( "on enter finish editing", function() {
      
      var view = new View(),
        onEnter = { keyCode: 13 },
        onOtherKey = { keyCode: 66 },
        close = sinon.stub( view, 'close' );

      view.updateOnEnter( onEnter );
      view.updateOnEnter( onOtherKey );

      expect( close ).toHaveBeenCalledOnce();

    } );


    it( "can tell the itself to die", function() {
      
      var view = new View(),
        spy = sinon.spy();

      view.bind( 'destroy', spy );
      view.clear();

      expect( spy ).toHaveBeenCalledOnce();

    } );

  } );
  
} );