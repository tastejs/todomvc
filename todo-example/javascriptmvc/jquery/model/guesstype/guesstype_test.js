module("jquery/model/guesstype")

test("guess type", function(){
   equals("array", $.Model.guessType( [] )  );
   equals("date", $.Model.guessType( new Date() )  );
   equals("boolean", $.Model.guessType( true )  );
   equals("number", $.Model.guessType( "1" )  );
   equals("string", $.Model.guessType( "a" )  );
   
   equals("string", $.Model.guessType( "1e234234324234" ) );
   equals("string", $.Model.guessType( "-1e234234324234" ) );
})
