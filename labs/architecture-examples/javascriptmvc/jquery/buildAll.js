// load('jquery/buildAll.js')

load('steal/rhino/rhino.js')


// load every plugin in a single app
// get dependency graph
// generate single script

steal('steal/build/pluginify','steal/build/apps','steal/build/scripts').then( function(s){
	var ignore = /\.\w+|test|generate|dist|qunit|fixtures|pages/
	
	var plugins = [],
		/**
		 * {"path/to/file.js" : ["file2/thing.js", ...]}
		 */
		files = {};
		
	s.File('jquery').contents(function( name, type, current ) {
		if (type !== 'file' && !ignore.test(name)) {
			var folder = current+"/"+name;
			if(readFile(folder+"/"+name+".js")){
				print(folder);
				plugins.push(folder);
				steal.File(folder).contents(arguments.callee, folder)
			}
			
			//steal.File(path + "/" + (current ? current + "/" : "") + name).contents(arguments.callee, (current ? current + "/" : "") + name);
		}
	},"jquery");
	
	// tell it to load all plugins into this page

	
	//steal.win().build_in_progress = true;
	print("  LOADING APP ")
	steal.build.open('steal/rhino/blank.html', {
			startFiles: plugins
	}, function(opener){
		
		opener.each('js', function(options, text, stl){
			print(options.rootSrc)
			var dependencies = files[options.rootSrc] = [];
			if(stl.dependencies){
				for (var d = 0; d < stl.dependencies.length; d++) {
					var depend = stl.dependencies[d];
					if (depend.options.rootSrc !== "jquery/jquery.js") {
						dependencies.push(depend.options.rootSrc);
					}
				}
			}
		})
		
		s.File("jquery/dist/standalone").mkdirs();
		s.File("jquery/dist/standalone/dependencies.json").save($.toJSON(files));
		//get each file ...
		print("Creating jquery/dist/standalone/")
		var compressor = s.build.builders.scripts.compressors[ "localClosure"]()
		for(var path in files){
			if(path == "jquery/jquery.js"){
				continue;
			}
			var content = readFile(path);
			var funcContent = s.build.pluginify.getFunction(content);
			if(typeof funcContent ==  "undefined"){
				content = "";
			} else {
				content = "("+s.build.pluginify.getFunction(content)+")(jQuery);";
			}
			var out = path.replace(/\/\w+\.js/,"").replace(/\//g,".");
			content = s.build.builders.scripts.clean(content);
			print("  "+out+"");
			content = s.build.builders.scripts.clean(content);
			s.File("jquery/dist/standalone/"+out+".js").save(content);
			s.File("jquery/dist/standalone/"+out+".min.js").save(compressor(content));
		}
		
	})
	
	/*
	var pageSteal = steal.build.open("steal/rhino/empty.html").steal,
		steals = pageSteal.total,

		files = {},
		depends = function(stl, steals){
			if(stl.dependencies){
				for (var d = 0; d < stl.dependencies.length; d++) {
					var depend = stl.dependencies[d];
					if(!steals[depend.path]){
						steals[depend.path] = true;
						print("123  " + depend.path);
						//depends(depend, steals);
					}
					
					
				}
			}
		},
		all = function(c){
			for(var i =0; i < steals.length; i++){
				var pSteal =steals[i];
				
				if(!pSteal.func){
					c(pSteal)
				}
				
			}
			
		};
	print("  LOADED, GETTING DEPENDS");
	all(function(stl){
		files[stl.path] = stl;
	})
	all(function(stl){
		print(stl.path)
		var dependencies = files[stl.path] = [];
		if(stl.dependencies){
			for (var d = 0; d < stl.dependencies.length; d++) {
				var depend = stl.dependencies[d];
				if (depend.path !== "jquery/jquery.js") {
					dependencies.push(depend.path);
				}
			}
		}
	})*/
	
	
	

})