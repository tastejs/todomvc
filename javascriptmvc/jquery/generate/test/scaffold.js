

load('steal/rhino/steal.js');
load('steal/test/test.js');

steal('//steal/test/test', function(s){
	
	s.test.module("jquery/generate/scaffold")
	
	STEALPRINT = false;
	
	s.test.test("make app and scaffold", function(t){
		_args = ['cookbook']; 
		load('jquery/generate/app');
		_args = ['Cookbook.Models.Recipe']; 
		load('jquery/generate/scaffold');
		
		
		load('steal/rhino/steal.js');
		var cookbookContent = readFile('cookbook/cookbook.js').
		    replace(".models()", ".models('recipe')").
		    replace(".controllers()", ".controllers('recipe')");
		new steal.File('cookbook/cookbook.js').save( cookbookContent );
		
		var qunitContent = readFile('cookbook/test/qunit/qunit.js').
		    replace(".then(\"cookbook_test\")", ".then(\"recipe_test\")");
		new steal.File('cookbook/test/qunit/qunit.js').save( qunitContent );
		
		var funcunitContent = readFile('cookbook/test/funcunit/funcunit.js').
		    replace(".then(\"cookbook_test\")", ".then(\"recipe_controller_test\")");
		new steal.File('cookbook/test/funcunit/funcunit.js').save( funcunitContent );

		t.clear();
		print('trying to open ...')
		t.open('cookbook/cookbook.html', false)
		t.ok(Cookbook.Controllers.Recipe, "Recipe Controller")
		t.ok(Cookbook.Models.Recipe, "Recipe Controller")
		t.clear();
	});
	
	//now see if unit and functional run
	
	s.test.test("scaffold unit tests", function(t){
		
		load('steal/rhino/steal.js');
		load('funcunit/loader.js');
		FuncUnit.load('cookbook/qunit.html');
	});
	
	s.test.test("scaffold functional tests", function(t){
		load('steal/rhino/steal.js');
		load('funcunit/loader.js');
		FuncUnit.load('cookbook/funcunit.html');
		
	});
	
	s.test.test("documentjs", function(t){
		t.clear();
		load('steal/rhino/steal.js');
		_args = ['cookbook/cookbook.html']
		load("documentjs/documentjs.js");
		DocumentJS('cookbook/cookbook.html');
	});
	
	s.test.test("compress", function(t){
		t.clear();
		load("cookbook/scripts/build.js")
		
		var cookbookPage = readFile('cookbook/cookbook.html').
	    	replace("steal.js?cookbook,development", "steal.production.js?cookbook");
		new steal.File('cookbook/cookbook.html').save( cookbookPage );
		
		t.clear();
		t.open('cookbook/cookbook.html', false)
		t.ok(Cookbook.Controllers.Recipe, "Recipe Controller")
		t.ok(Cookbook.Models.Recipe, "Recipe Controller")
		t.clear();
	});
	
	
	//print("-- cleanup --");
	s.File("cookbook").removeDir();

})



