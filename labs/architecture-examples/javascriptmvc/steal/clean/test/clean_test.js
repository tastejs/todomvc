// load('steal/compress/test/run.js')
/**
 * Tests compressing a very basic page and one that is using steal
 */
load('steal/rhino/rhino.js')
steal('steal/test', 'steal/clean', function( s ) {
	
	s.test.module("steal/clean")
	
	s.test.test("basic formatting", function(t){
		steal.File('steal/clean/test/test.js').copyTo('steal/clean/test/testStart.js')
		
		// clean this file and see if it looks like it should
		steal.clean('steal/clean/test/testStart.js')
		
		
		s.test.equals( readFile('steal/clean/test/testStart.js'), 
				readFile('steal/clean/test/testEnd.js'), "docs are clean");
		steal.File('steal/clean/test/testStart.js').remove();
	})

	
});