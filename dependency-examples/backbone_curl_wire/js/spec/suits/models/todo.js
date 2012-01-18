define(
[
  'jquery',
  'models/todo'
],
function( $, Model ) {
  
  describe( "Todo model", function() {

    it( "is a backbone model", function() {

      // It returned something
      expect( Model ).toBeDefined();

      // Check for a function that only a backbone model is likely to have
      expect( ( new Model() )._escapedAttributes ).toBeDefined();

    } );

    // This model doesnt do much does it...

  } );
  
} );