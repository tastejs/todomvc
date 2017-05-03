define(
[
  'backbone',
  'jquery',
  'views/app'
],
function( Backbone, $, View ) {
  
  describe( "App view", function() {

    it( "is a backbone view", function() {

      // It returned something
      expect( View ).toBeDefined();

      // Check its a backbone view instance
      expect( ( new View() ) instanceof Backbone.View ).toBeTruthy();

    } );

    // Test the render function
    it( "can render the template", function() {
      
      var view = new View(),
        collection = new ( Backbone.Collection.extend( {
          done: function() { return []; },
          remaining: function() { return []; }
        } ) )(),
        template = sinon.stub( view, 'statsTemplate' );
        
      view.stats = $( '<div></div>' ).get( 0 );
      view.allCheckbox = $( '<input type="checkbox" />' ).get( 0 );

      view.render( '', collection );
      view.render( '', { collection: collection } );
      view.render( '', {} ); // Should be rejected

      expect( template ).toHaveBeenCalledTwice();
      expect( view.allCheckbox.checked ).toBeTruthy();

    } );

    it( "trigger 'todoSubmission' event, on enter keypress", function() {

      var view = new View(),
        onEnter = { keyCode: 13 },
        onOtherKey = { keyCode: 66 },
        spy = sinon.spy();

      // Set the input element
      view.input = $( '<input />' ).val( 'test' );

      view.bind( 'todoSubmission', spy );

      view.createOnEnter( onEnter );
      view.createOnEnter( onOtherKey );

      expect( spy ).toHaveBeenCalledOnce(); // Only trigger the event for an enter press
      expect( spy ).toHaveBeenCalledWithExactly( { content: 'test' } ); // Should pass the content of the input
      expect( view.input.val() ).toEqual( '' ); // Reset input
      
    } );
    

  } );
  

} );