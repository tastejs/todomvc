


steal(function(s){
	
	
 
// gets the last commit for a project from github's api
var lastCommitId = function(inf){
	var commitsText = readUrl("https://github.com/api/v2/json/commits/list/" + 
				inf.user + "/" + 
				inf.repo + "/" + 
				inf.branch);
	eval("var c = " + commitsText);
	return c.commits[0].tree;
},
// returns a url of commit data
lastCommitUrl = function(inf){
	return "https://github.com/api/v2/json/tree/show/" + 
			inf.user + "/" + 
			inf.repo + "/" + lastCommitId(inf);
	

},
github = s.get.git = {
		// get a map of names to urls ...  urls don't have to be pretty ...
		ls : function(content, rawUrl, originalUrl){
			var info = github.info(originalUrl);
			
			//print("item -- "+info.base)
			
			var data = {};
			
			// if we are the top level folder, use lastCommitData
			if( info.resource == "/" ) {
				eval("var commits = " + content);
				// use gitHub's commit API
				commits.tree.forEach(function(item){
					if(item.name.indexOf(".git") === 0){
						
					} else if ( item.type == "blob" ) {
						data[item.name] = info.base + item.name;
					}
					else if ( item.type == "tree" ) {
						data[item.name+"/"] = info.base + item.name+"/";
					}
				})
				
			} else {
				content.replace(/href\s*=\s*\"*([^\">]*)/ig, function(whole, url){
					if(url.indexOf(".git") === 0){
						return;
					}
					data[url] = info.base + url
				})
			}
			
			return data;
			
		},
		// return the 'raw' place to either get folder's contents, or download file ...
		raw : function(url){
			// https://github.com/secondstory/secondstoryjs-plugins/
			// --> https://github.com/secondstory/secondstoryjs-plugins/
			var info = github.info(url);
			if(info.resource == "/"){ // root level folder
				return lastCommitUrl(info)
			} else if( /\/$/.test(url) ) { // a folder
				return "https://"+info.domain+"/"+info.user+"/"+info.repo+"/tree/"+info.branch+"/"+info.resource+"?raw=true"
			} else { //download url ...
				return "https://"+info.domain+"/"+info.user+"/"+info.repo+"/raw/"+info.branch+"/"+info.resource
			}
		},
		// helper to get info from a github url
		info : function(url){
			var split = url.split("/"),
				data = {},
				branch;
			data.protcol = split.shift();
			split.shift();
			data.domain = split.shift();
			data.user = split.shift();
			data.repo = split.shift();
			
			branch = split.shift();
			if(branch === 'tree' || branch === 'raw' || branch === 'blob'){
				branch = split.shift();
			}
			data.branch = branch || 'master';
			
			data.resource = split.join('/').replace(/\?.*/,"") || "/";
			data.base = "https://"+data.domain+"/"+data.user+"/"+data.repo+"/tree/"+data.branch+"/"+( data.resource == "/" ? "" : data.resource)
			return data;
		},
		lastCommitUrl : lastCommitUrl
	};



})()
