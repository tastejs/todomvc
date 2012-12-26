load('steal/rhino/rhino.js')
load('steal/rhino/test.js');

steal('steal/get',function(rhinoSteal){
	var _S = steal.test;
	
	_S
	
	_S.module("steal/get")
	STEALPRINT = false;
	
	_S.test("pluginList", function(t){
		var url = rhinoSteal.get.url("mxui/util/selectable");
		
		t.equals(url, "https://github.com/jupiterjs/mxui/tree/master/util/selectable/", "Right url")
	});
	
	
	_S.test("dummySteal", function(t){
		var code = readFile('steal/get/test/stealCode1.js');
		var results = rhinoSteal.dummy(code);
		t.equals(results.plugins[0], "foo/bar", "first is right");
		t.equals(results.plugins.length, 4, "has other plugins")
	});
	
//	_S.test("installDependency", function(t){
//		rhinoSteal.File("jqueryui").removeDir();
//		//t.equals( rhinoSteal.get.installDependency("jquery/controller") , false, "exists" );
//		t.equals( rhinoSteal.get.installDependency("jqueryui/draggable") , true, "doesn't exist" );
//		
//		
//	});
//	
//	_S.test("root repo" , function(t){
//		
//		rhinoSteal.get('ss/router',{});
//		
//		var license = readFile("ss/router/LICENSE");
//		
//		t.ok(license, "ss downloaded");
//		rhinoSteal.File("ss").removeDir();
//	});
//	
//	_S.test("deep repo" , function(t){		
//		rhinoSteal.get('srchr',{});
//		
//		var srchr = readFile("srchr/srchr.html");
//		
//		t.ok(srchr, "srchr downloaded");
//		rhinoSteal.File("srchr").removeDir();
//	});
	
	
	var G = steal.get;
	
	
	
	_S.module("steal/get/github")
	// STEALPRINT = false;
	
	_S.test("github.info", function(t){
		var info = G.git.info("https://github.com/secondstory/secondstoryjs-plugins/");
		
		t.equals(info.user, "secondstory", "Right user");
		t.equals(info.repo, "secondstoryjs-plugins", "Right repo");
		t.equals(info.branch, "master", "Right branch");
		t.equals(info.resource, "/", "Right resource");
	});
	
	_S.test("github.raw", function(t){
		// a file
		var raw = G.git.raw("https://github.com/jupiterjs/srchr/tree/master/srchr/disabler/disabler.html");
		t.equals(raw, "https://github.com/jupiterjs/srchr/raw/master/srchr/disabler/disabler.html", "file");
		
		raw = G.git.raw("https://github.com/secondstory/secondstoryjs-plugins/blob/master/jScrollPane/jScrollPane.js");
		t.equals(raw, "https://github.com/secondstory/secondstoryjs-plugins/raw/master/jScrollPane/jScrollPane.js", "file");
		
		// folders
		raw = G.git.raw("https://github.com/secondstory/secondstoryjs-plugins/tree/master/jScrollPane/")
		t.equals(raw,"https://github.com/secondstory/secondstoryjs-plugins/tree/master/jScrollPane/?raw=true","folder")
		
		// root
		raw = G.git.raw("https://github.com/jupiterjs/funcunit")
		t.equals(raw.indexOf("https://github.com/api/v2/json/tree/show/jupiterjs/funcunit/"), 0, "root");
		
		raw = G.git.raw("https://github.com/jupiterjs/funcunit/tree/v3.2.1")
		t.equals(raw.indexOf("https://github.com/api/v2/json/tree/show/jupiterjs/funcunit/"), 0, "root");
		
	});
	
	_S.test("github.ls", function(t){
		var raw = G.git.raw("https://github.com/jupiterjs/funcunit"),
			contents = readUrl(raw);
		
		var map = G.git.ls(contents, raw, "https://github.com/jupiterjs/funcunit");
		
		//for(var name in map){
		//	print(name+" - "+map[name])
		//}
		
	});
	
	_S.test("fetcher.download", function(t){
		var raw = G.git.raw("https://github.com/jupiterjs/funcunit/blob/master/dependencies.json"),
			out = "steal/get/test/out.js";
		
		
		G.download(raw,out,{getter: G.git});
		
		var stuff = readFile(out);
		t.ok(stuff, "there is stuff");
		
		new steal.File(out).remove();
	});
	
	_S.test("fetch with git, ignore all", function(t){
		
		G.fetch("https://github.com/jupiterjs/funcunit",
			"steal/get/test/",{
				getter : G.git,
				ignore : [/.*[^\/]$/]
			});
		
	});
	
	_S.test("fetch with basic, ignore all", function(t){
		
		G.fetch("http://jabbify.googlecode.com/svn/trunk/jabbify/apps/",
			"steal/get/test/",{
				getter : G.basic,
				ignore : [/.*[^\/]$/]
			});
		
	});
	
	
	_S.test("fetch dependencies", function(t){
		
		var depends = steal.get.dependencies("https://github.com/jupiterjs/funcunit",
		                            {getter: steal.get.git});
		                            
		t.equals(depends["funcunit/syn"], "https://github.com/jupiterjs/syn", "dependency");
		
	});
	
	_S.test("steals dependencies", function(t){
		
		var steals = steal.get.steals("https://github.com/jupiterjs/mxui/tree/master/data/grid",
		                       {getter: steal.get.git});
		t.ok(steals.length, "we got something")                       
		      // -> ['mxui/layout/table_scroll','mxui/data','jquery/controller/view',..]
		
		for(var i =0; i < steals.length; i++){
			if(steals[i].indexOf('mxui') > -1){
				t.ok(true, "we have mxui")
			}
		}
		
	});
	
});

