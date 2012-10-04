// load('steal/compress/test/run.js')
/**
 * Tests compressing a very basic page and one that is using steal
 */
load('steal/rhino/rhino.js');

steal('steal/test','steal/parse').then( function( s ) {
	STEALPRINT = false;
	s.test.module("steal/parse")
	
	s.test.test("parse", function(t){
		var js = readFile('steal/parse/test/trailslash.js');
		var tokens = js.tokens('=<>!+-*&|/%^', '=<>&|');
		
		var js = readFile('jquery/class/class.js');
		var tokens = js.tokens('=<>!+-*&|/%^', '=<>&|');
		
		var js = readFile('jquery/view/ejs/ejs.js');
		var tokens = js.tokens('=<>!+-*&|/%^', '=<>&|');
		
		var js = readFile('jquery/lang/vector/vector.js');
		var tokens = js.tokens('=<>!+-*&|/%^', '=<>&|');
		
		var js = readFile('jquery/dom/fixture/fixture.js');
		var tokens = js.tokens('=<>!+-*&|/%^', '=<>&|');
		
		var js = readFile('jquery/view/view.js');
		var tokens = js.tokens('=<>!+-*&|/%^', '=<>&|');
		
		var js = readFile('jquery/lang/json/json.js');
		var tokens = js.tokens('=<>!+-*&|/%^', '=<>&|');
		
		js = readFile('steal/build/pluginify/test/weirdRegexps.js');
		var tokens = js.tokens('=<>!+-*&|/%^', '=<>&|');
		
	})	
	
	s.test.test("parse", function(t){
		var parser = steal.parse(readFile('steal/parse/test/testCode.js')),
			token,
			tokens = [];
			
		while(token = parser.moveNext()){
			tokens.push(token)
		}
		t.equals(tokens[0].value,"FooBar");
		t.equals(tokens[1].value,"Blah");
	});
	
	s.test.test("parse steal plugins", function(t){
		var parser = steal.parse(readFile('steal/parse/test/stealCode1.js')),
			tokens = [];

		parser.until(["steal","("]);
		parser.partner("(", function(token){
			tokens.push(token);
//			print("TOKEN = "+token.value, token.type)
		})
		
		t.equals(tokens[0].value,"foo/bar");
		t.equals(tokens[1].value,",");
		t.equals(tokens[2].value,"abc/def")
		
	});
	
	s.test.test("parse logs", function(t){
		var parser = steal.parse(readFile('steal/parse/test/dev.js')),
			tokens = [];

		var tok = parser.until(["steal",".","dev",".","log","("]);
		parser.partner("(", function(token){
			tokens.push(token);
//			print("TOKEN = "+token.value, token.type)
			
		})
		
		t.equals(tokens[0].value,"hi()");
		
	});

});