define(
[
  'backbone',
  'models/todo'
],
function( Backbone, Model ) {
  
  describe( "Todo model", function() {

    it( "is a backbone model", function() {

      // It returned something
      expect( Model ).toBeDefined();

      // Check its a backbone model instance
      expect( ( new Model() ) instanceof Backbone.Model ).toBeTruthy();

    } );

    // This model doesnt do much does it...

  } );
  
} );