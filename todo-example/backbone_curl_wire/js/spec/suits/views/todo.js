define(
[
  'jquery',
  'views/app'
],
function( $, View ) {
  
  describe( "App view", function() {

    it( "is a backbone view", function() {

      // It returned something
      expect( View ).toBeDefined();

      // Check for a function that only a backbone view is likely to have
      expect( ( new View() ).delegateEvents ).toBeDefined();

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