// load('steal/compress/test/run.js')
/**
 * Tests compressing a very basic page and one that is using steal
 */
load('steal/rhino/steal.js')
steal('//steal/test/test', function( s ) {
	STEALPRINT = false;
	s.test.module("jquery/download")
	
	s.test.test("controller", function(){
		load('steal/rhino/steal.js')
		s.test.open('jquery/download/test/controllerpage.html')
		s.test.ok(MyController, "Controller was loaded")
		s.test.clear();
	});
});