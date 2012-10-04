// load('steal/compress/test/run.js')

/**
 * Tests compressing a very basic page and one that is using steal
 */

load('steal/rhino/rhino.js')
steal('steal/test', function(s){
	
	s.test.module("jquery/view/compression")
	STEALPRINT = false;
	
	s.test.test("templates" , function(t){
		
		
		steal.File("jquery/view/test/compression/views/absolute.ejs").save("<h1>Absolute</h1>\n<h2>ok</h2>");
		steal.File("jquery/view/test/compression/views/relative.ejs").save("<h1>Relative</h1>");
		steal.File("jquery/view/test/compression/views/tmplTest.tmpl").save("<h1>${message}</h1>");
		s.test.clear();
		
		load("steal/rhino/rhino.js");
		steal('steal/build','steal/build/scripts',function(){
			steal.build('jquery/view/test/compression/compression.html',{to: 'jquery/view/test/compression'});
		});
		s.test.clear();
		s.test.remove("jquery/view/test/compression/views/absolute.ejs")
		s.test.remove("jquery/view/test/compression/views/relative.ejs")
		s.test.remove("jquery/view/test/compression/views/tmplTest.tmpl")

		
		steal = {env: "production"};
		
		s.test.open('jquery/view/test/compression/compression.html')
		s.test.ok(  /Relative/i.test( $(document.body).text() ), "Relative not in page!" );

		s.test.ok(  /Absolute/i.test( $(document.body).text() ), "Absolute not in page!" );

		s.test.ok(  /Jquery Tmpl/i.test( $(document.body).text() ), "Jquery Tmpl not in page!" );
		
		s.test.clear();
		s.test.remove("jquery/view/test/compression/production.js")
			
	})
	

	
	
	
	
	
});