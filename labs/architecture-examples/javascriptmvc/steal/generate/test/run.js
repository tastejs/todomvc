load('steal/rhino/rhino.js')

steal('steal/test', "steal/generate")
	.then('steal/generate/system.js').then(function(s){
	_S = steal.test;
	
	//turn off printing
	STEALPRINT = false;
	
	print("==========================  steal/generate =============================")
	
	print("-- generate basic foo app --");
	
	var	data = steal.extend({
		path: "foo", 
		application_name: "foo",
		current_path: steal.File.cwdURL(),
		path_to_steal: new steal.File("foo").pathToRoot()
	}, steal.system);
	steal.generate("steal/generate/templates/app","foo",data)
	
	steal.File("foo").removeDir();
	
	print("== complete ==\n")
	
	

	/**
	 * Tests 4 cases:
	 * 1. steal(function(){})
	 * 2. steal("foo", function(){})
	 * 3. steal("foo")
	 * 4. no steal in the page initially
	 */
	s.test.test("insertSteal", function(){
		var testFile = "steal/generate/test/insertSteal.js",
			expectedFile = "steal/generate/test/insertStealExpected.js"
		
		// make blank file
		steal.File(testFile).save("steal(function(){})");
		steal.generate.insertSteal(testFile,"foo");
		steal.generate.insertSteal(testFile,"bar");
		
		var res = readFile(testFile).replace(/\r|\n|\s/g,""),
			expected = "steal('foo','bar',function(){})"
		s.test.equals(res, expected, "insertSteal is working");
		s.test.remove(testFile)
		
		steal.File(testFile).save("steal('foo')");
		steal.generate.insertSteal(testFile,"bar");
		
		var res = readFile(testFile).replace(/\r|\n|\s/g,""),
			expected = "steal('foo','bar')"
			
		s.test.equals(res, expected, "insertSteal is working");
		s.test.remove(testFile)
		
	});
	s.test.test("insertSteal blank", function(){
		var testFile = "steal/generate/test/insertSteal.js",
			expectedFile = "steal/generate/test/insertStealExpected.js"
		
		steal.File(testFile).save("");
		steal.generate.insertSteal(testFile,"bar");
		
		var res = readFile(testFile).replace(/\r|\n|\s/g,""),
			expected = "steal('bar')"
			
		s.test.equals(res, expected, "insertSteal is working");
		s.test.remove(testFile)
		
	});
	s.test.test("insertSteal ordering", function(){
		var testFile = "steal/generate/test/insertSteal.js",
			expectedFile = "steal/generate/test/insertStealExpected.js"
		
		steal.File(testFile).save("steal('foo').then('zoo');");
		steal.generate.insertSteal(testFile,"bar");
		
		var res = readFile(testFile).replace(/\r|\n|\s/g,""),
			expected = "steal('foo','bar').then('zoo');"
			
		s.test.equals(res, expected, "insertSteal is working");
		s.test.remove(testFile)
	});
})