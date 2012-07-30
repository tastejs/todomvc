// load('steal/compress/test/run.js')
/**
 * Tests compressing a very basic page and one that is using steal
 */
load('steal/rhino/rhino.js')
steal('steal/test', function( s ) {
	STEALPRINT = false;
	s.test.module("jquery/download")
	
	s.test.test("controller", function(){
		load('steal/rhino/rhino.js')
		s.test.open('jquery/download/test/controllerpage.html')
		s.test.ok(MyController, "Controller was loaded")
		s.test.clear();
	});
});