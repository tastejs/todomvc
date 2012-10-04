// load('steal/build/test/run.js')
/**
 * Tests compressing a very basic page and one that is using steal
 */
load('steal/rhino/rhino.js')
steal('steal/test', function( s ) {
	STEALPRINT = false;
	s.test.module("steal/coffee")
	
	s.test.test("development mode", function(){
		s.test.clear();
		s.test.open('steal/coffee/coffee.html')
		
		s.test.equals(5, cubes.length, "cubes array populated");
		s.test.clear();
	});
	
	s.test.test("build and production", function(){
		load('steal/rhino/rhino.js')
		steal("steal/build","steal/build/scripts").then(function(s2){
			s2.build('steal/coffee/coffee.html', {
				to: 'steal/coffee'
			})
			
			s.test.clear();
			s.test.equals(typeof cubes, "undefined", "cubes array populated");
			s.test.open('steal/coffee/coffeeprod.html')
			s.test.equals(5, cubes.length, "cubes array populated");
		
			s.test.remove('steal/coffee/production.js')
		});
		
	});

});