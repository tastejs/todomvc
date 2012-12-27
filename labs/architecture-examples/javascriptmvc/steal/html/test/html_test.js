load('steal/rhino/rhino.js');

steal('steal/test/test.js', function( s ) {
	STEALPRINT = true;
	s.test.module("steal/html")
	
	var crawlTest = function(type){
		s.test.test("crawl works for "+type, function(){
			load('steal/rhino/rhino.js')
			
			steal('steal/html/crawl', function(){
				steal.html.crawl("steal/html/test/page.html#!Hello+World!", 
				{
					out: 'steal/html/test/out',
					browser: type
				})
			});
			
			// test for the expected pages
			['Hello+World!', 'Foo', 'Bar/Baz'].forEach(function(page){
				var txt = readFile('steal/html/test/out/' + page + '.html')
				s.test.ok(txt.indexOf('<div id="out"><p>#!' + page + '</p></div>') != -1, page + " generated correctly");
			});
			
			// remove generated pages
			s.test.deleteDir('steal/html/test/out');
			s.test.clear();
		});
	}
	crawlTest("envjs");
	crawlTest("phantomjs");

});