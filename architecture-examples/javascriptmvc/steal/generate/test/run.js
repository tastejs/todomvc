load('steal/rhino/steal.js')
load('steal/rhino/test.js');

(function(rhinoSteal){
	_S = steal.test;
	
	//turn off printing
	STEALPRINT = false;
	
	print("==========================  steal/generate =============================")
	
	print("-- generate basic foo app --");
	
	steal("//steal/generate/generate",'//steal/generate/system', function(steal){
		var	data = steal.extend({
			path: "foo", 
			application_name: "foo",
			current_path: steal.File.cwdURL(),
			path_to_steal: new steal.File("foo").pathToRoot()
		}, steal.system);
		steal.generate("steal/generate/templates/app","foo",data)
	})
	
	
	rhinoSteal.File("foo").removeDir();
	
	print("== complete ==\n")
})(steal);
