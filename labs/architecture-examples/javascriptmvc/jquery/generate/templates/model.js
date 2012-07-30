steal(	'steal/generate',
		'steal/generate/system.js',
		'steal/generate/inflector.js',
		function(steal){

	

	var upper = function(parts){
		for(var i =0; i < parts.length; i++){
			parts[i] = parts[i].charAt(0).toUpperCase()+parts[i].substr(1)
		}
		return parts
	}
	
	steal.generate.model = function(arg){
		
		if(arg.charAt(0) !== arg.charAt(0).toUpperCase()){
			var caps = upper( arg.split(/_|-/) ).join(''),
				name = upper(caps.split("/")).join('.');
			
			print("  Creating "+name);
			arg = name;
		}
		
		var md = steal.generate.convert(arg),
			path =  arg.toLowerCase().replace('.',"/");
		
		var folder = md.path.replace(/\/\w+$/, "")
		if(!folder){
			print("! Error: Models need to be part of an app");
			quit();
		}
		if(!steal.File(folder).exists()){
			print("! Error: folder "+folder+" does not exist!");
			quit();
		}
		
		md.path_to_steal = new steal.File(path).pathToRoot();
		md.appPath =  md.path.replace(/\/models$/,"");
		
		//check pluralization of last part
		if(steal.Inflector.singularize(md.underscore) !== md.underscore){
			print("! Warning: Model names should be singular.  I don't think "+md.underscore+" is singular!")	
		}
		
		// generate the files
		steal.generate("jquery/generate/templates/model", md.appPath, md)
		
		try{
			// steal this model in models.js
			steal.generate.insertSteal(md.appPath+"/models/models.js", "./"+md.underscore+".js");
			
			// steal this model's unit test in qunit.js
			steal.generate.insertSteal(md.appPath+"/test/qunit/qunit.js", "./"+md.underscore+"_test.js");
		} catch (e) {
			if(e.type && e.type == "DUPLICATE"){
				print("! Error: This model was already created!")	
				quit();
			}
		}
		// $.fixture.make for this model in fixtures.js
	
		
		
		var text = readFile("jquery/generate/templates/fixturemake.ejs");
		var fixturetext = new steal.EJS({
			text: text
		}).render(md);
		steal.generate.insertCode(md.appPath+"/fixtures/fixtures.js", fixturetext);
		
	}
	
	
	
});