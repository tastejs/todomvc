steal("steal/get/json.js", 
	  "steal/rhino/prompt.js", 
	  "steal/get/dummy.js",function( steal ) {
	
	// a map of plugins that you just installed (prevents cycles)
	var installed = {};
	
	/**
	 * @class steal.get
	 * @parent stealjs
	 * 
	 * Downloads and installs a plugin from a url.  Normally 
	 * this is run from the steal/getjs script.
	 * 
	 * The following copies the mustache-javascript repo to a 
	 * local mustache folder.
	 * 
	 * 
	 *     js steal/getjs http://github.com/tdreyno/mustache-javascriptmvc mustache
	 * 
	 * Get will:
	 * 
	 *   - Download the plugins files.
	 *   - Prompt you to install dependencies.
	 *   - Prompt you to run an install script.
	 * 
	 * ## Offical Plugins
	 * 
	 * JavaScriptMVC maintains a list of offical plugins compatible with JavaScriptMVC 3.0.
	 * You can install these by simply typing there name.  This is the current list of
	 * offical plugins:
	 * 
	 *  - <code>mustache</code> - mustache templates.
	 *  - <code>steal</code> - script loader, and more.
	 *  - <code>jquery</code> - jQuery 1.4.3 and the MVC components.
	 *  - <code>funcunit</code> - Functional testing platform.
	 *  - <code>mxui</code> - UI widgets.
	 *  - <code>documentjs</code> - documentation engine.
	 *
	 * You can install these just by writing
	 * 
	 *     js steal/getjs funcunit
	 * 
	 * If you have something good, let us know on the forums and we can make your project official too!
	 * 
	 * ## Making your own Getter
	 * 
	 * This is easy to do and will be documented shortly.
	 * 
	 * @constructor
	 * 
	 * Get takes a url or official plugin name and installs it.
	 * 
	 * @param {String} url the path to a svn or github repo or a name of a recognized plugin.
	 * @param {Object} options configure the download.  
	 * 
	 *   - __name__  - The name of the folder to put the download in.
	 *   - __ignore__ - An array of regexps that if the filename matches, these will be ignored.
	 * 
	 * @return {boolean} if the installation was successful 
	 */
	var get = (steal.get = function( url, options ) {
		
		options = steal.opts(options, {
			name: 1
		});
		
		var getter, 
			name = options.name, 
			dependenciesUrl;
		
		// if not a url, get the url from the plugin list
		if (!url.match(/^http/) ) {
			name = url;
			url = get.url(name);
		}
		
		// if we don't get a url back, throw an error
		if (!url ) {
			steal.print("There is no plugin named " + name);
			return;
		}
		// if we don't have a name (a place for the app) try to guess one from the url
		if (!name ) {
			name = get.guessName(url);
		}
		options.name = name;
		options.quiet = options.quiet === undefined ? true : options.quiet;
		options.ignore = options.ignore === undefined ? [] : options.ignore;
		
		// pick the default getter or the github getter ... somehow getters should register themselves
		options.getter =  options.getter ? get[options.getter] : url.indexOf("github.com") !== -1 ? get.git : get.basic;
		
		//make the folder for this plugin
		//new steal.File(name).mkdirs();
		
		// check for a dependency file
		steal.print("  Checking dependencies ... ");
		
		
		//dependenciesUrl = getter.dependenciesUrl(url);

		get.installDependencies(url, options );

		// check if we should be installing dependencies read from the JS file itself
		if( name.indexOf("/") !== -1 ){
			
			var steals = get.steals(url, options);
			for(var i =0; i < steals.length; i++){
				get.installDependency(steals[i]);
			}
		}
		
		steal.print("   ");
		
		//get contents
		get.fetch(url, 
				  /\/$/.test(options.name) ? options.name : options.name+"/", 
				  options);
		
		//var fetcher = new getter(url, name, options);
		//fetcher.quiet = options.quiet || true;

		//fetcher.fetch();

		steal.print("\n  " + name + " plugin downloaded.");
		get.runInstallScript(name);

	}),
		folderTest = /\/$/,
		trim = /\s+$/gm,
		jarTest = /\.jar$/,
		lastPart = /([^\/]+)\/$/;
		
		
	steal.extend(get,{
		/**
		 * Gets url from plugin name using the urls at:
		 * 
		 *     https://github.com/jupiterjs/steal/raw/master/get/gets.json
		 * 
		 * Or locally at
		 * 
		 *     //gets.json
		 * 
		 * @param {String} name the name of the project (ex:  'funcunit')
		 * @return {String} the url of the repository (ex: 'http://github.com/jupiterjs/funcunit')
		 */
		url: function( name ) {
			//steal.print("  Looking for plugin ...");

			var plugin_list_source =
				readUrl("https://github.com/jupiterjs/steal/raw/master/get/gets.json"),
				plugin_list;
			
			eval("plugin_list = " + plugin_list_source);
			if ( plugin_list[name] ) {
				return plugin_list[name];
			}
			// check if the first part matches ....
			
			var parts = name.split("/")
				firstPart = parts.shift();
			if(plugin_list[firstPart]){
				var first =  plugin_list[firstPart];
				if(/github\.com/.test(first) && !/tree\/\w+/.test(first)){
					// http://github.com/jupiterjs/mxui -> 
					//    http://github.com/jupiterjs/mxui/tree/master/util/selectable/
					return first+"/tree/master/"+parts.join("/")+"/"
					//first = first.replace(/[^\/]+$/g, function(end){
					//	
					//})
				}
				return first;
			}
			
			
			steal.print("  Looking in gets.json for your own plugin list")
			
			plugin_list_source = readFile("gets.json");
			if(plugin_list_source){
				eval("plugin_list = " + plugin_list_source);
				return plugin_list[name];
			}
			
		},
		//gets teh name from the url
		guessName: function( url ) {
			var name = new steal.File(url).basename();
			if ( name === 'trunk' || !name ) {
				name = new steal.File(new steal.File(url).dir()).basename();
			}
			return name;
		},
		// works for 
		// https://github.com/jupiterjs/funcunit/raw/master/dependencies.json
		installDependencies: function( url, options ) {
			
			var dependencies = get.dependencies(url, options);

			for ( var plug_name in dependencies ) {
				if ( steal.prompt.yesno("Install dependency " + plug_name + "? (yN):") ) {
					steal.print("Installing " + plug_name + "...");
					steal.get(dependencies[plug_name], {
						name: plug_name
					});
				}
			}

			//steal.print("  Installed all dependencies for " + name);
		},
		runInstallScript: function( name ) {
			if ( readFile(name + "/install.js") ) {

				var res = steal.prompt.yesno("\n  " + name + " has an install script." + "\n    WARNING! Install scripts may be evil.  " + "\n    You can run it manually after reading the file by running:" + "\n      js " + name + "/install.js" + "\n\n  Would you like to run it now? (yN):");
				if ( res ) {
					steal.print("  running ...");
					load(name + "/install.js");
				}
			}
		},
		pluginDependencies : function(url){
			//steal.print("  Checking plugin file ..."+url);
			var script, dependencies;
			
			try {
				script = readUrl(url);
			} catch (e) {
				steal.print("No plugin file");
				return;
			}
			if(/steal/.test(script)){
				try{
					var stealCalls = steal.dummy(script)
				} catch(e){
					//steal.print("Unable to figure out plugins.  Are you using steal in an unusual way?");
					//return;
				}
			}
			// get non-jquery plugins and see if they want to install ...
			var plugins = []
			for(var i = 0; i < stealCalls.plugins.length; i++){
				var plugin = stealCalls.plugins[i];
				if(!/^jquery\/|steal/.test(plugin) && plugin != 'jquery' ){
					plugins.push(stealCalls.plugins[i])
				}
			}

			if (!plugins.length ) {
				//steal.print("  No dependancies");
				return;
			}
			//print("length", plugins.length)
			return plugins;
		},
		installDependency : function(depend){
			if(installed[depend]){
				return;
			}
			if(steal.File(depend).exists()){
				installed[depend] = true;
				if ( steal.prompt.yesno("Update dependency " + depend + "? (yN):") ) {
					steal.print("Updating " + depend + "...");
					steal.get(depend, {
						name: depend
					});
				}
				
				return false;
			}else{
				
				if ( steal.prompt.yesno("Install dependency " + depend + "? (yN):") ) {
					installed[depend] = true;
					steal.print("Installing " + depend + "...");
					steal.get(depend, {
						name: depend
					});
				}
				
				return true;
			}
		},
		/**
		 * Recursively gets the contents of a folder at a url, and puts it at path.
		 * 
		 * The following gets everything in the controller folder
		 * 
		 *     steal.fetch(
		 *       "https://github.com/jupiterjs/jquerymx/tree/master/controller",
		 *       "jquery/controller/controller",
		 *       {getter: steal.get.git})
		 * 
		 * @param {Object} url the 'human' folder name
		 * @param {Object} path a folder on the local filesystem to put the contents of the folder in. Must end in /.
		 * @param {Object} options options to configure the downloading.  It has the following properties:
		 * 
		 *   * __ignore__ - an array of regular expressions that can be used to ignore certain paths.  
		 *   * __getter__ - a getter object with a raw and ls methods.
		 */
		fetch : function(url, path, options ){
			// make the new folder
			
			
			var raw = options.getter.raw(url),
				content = readUrl(raw),
				// only make a folder the first time we put a file in the folder
				madeFolder = false;
			
			//print("\nfetching "+url+"--------\n\n")
			
			var urls = options.getter.ls(content, raw, url);
			
			//separate folders and files ...
			pathloop:
			for(var newPath in urls){
				
				//print(" -"+urls[newPath]+"\n")
				
				var updatedPath =  path+newPath;
				
				for ( var i = 0; i < options.ignore.length; i++ ) {
					if ( options.ignore[i].test( updatedPath ) ) {
						steal.print("   I " + updatedPath);
						continue pathloop;
					}
				}
				
				if(folderTest.test(newPath)){
					
					get.fetch( urls[newPath], updatedPath, options )
					
				} else {
					if(!madeFolder){
						new steal.File(path).mkdirs();
						madeFolder = true;
					}
					get.download( urls[newPath], updatedPath, options)
				}
			}
			
		},
		/**
		 * Downloads a url to path.  Reports if the file was:
		 * 
		 *   - A - added
		 *   - U - updated
		 * 
		 * ### Example
		 * 
		 * The following downloads controller using the git getter:
		 * 
		 *     steal.get.download(
		 *         "https://github.com/jupiterjs/jquerymx/blob/master/controller/controller.js",
		 *         "jquery/controller/controller.js",
		 *         {getter: steal.get.git})
		 * 
		 * @param {Object} url
		 * @param {Object} path
		 * @param {Object} options
		 */
		download: function(url, path, options){
			var raw =  options.getter.raw(url),
				oldsrc = readFile(path),
				tmp = new steal.File("tmps"),
				pstar = "   ",
				newsrc;
			
			
			try{
				tmp.download_from(raw, true);
				newsrc = readFile("tmps");
				
			}catch(e){
				tmp.remove();
				steal.print("\n"+pstar+"Error downloading "+path+"\n from "+raw+"\n"+e+"\n");
				return;
			}
			
			// if we have an old one, lets compare it
			if ( oldsrc ) {
				
				// if they are the same, do nothing
				if ( (! jarTest.test(path) && oldsrc.replace(trim, '') == newsrc.replace(trim, '')) ) {
					tmp.remove();
					return;
				}
				// move ..
				steal.print(pstar + "U " + path);
				tmp.copyTo(path);
			} else {
				steal.print(pstar + "A " + path);
				tmp.copyTo(path);
			}
			tmp.remove();
		},
		/**
		 * Gets dependencies JSON from a folder url
		 * 
		 *     steal.get.dependencies("https://github.com/jupiterjs/funcunit",
		 *                            {getter: steal.get.git});
		 *                            
		 *     //  -> {	"funcunit/syn" : "http://github.com/jupiterjs/syn" }
		 * 
		 * @param {Object} url
		 * @param {Object} options
		 * @return {Object} a map of plugin-url pairs.
		 */
		dependencies : function(url, options){
			var dependUrl = get.file(url, 'dependencies.json', options);
			
			if(dependUrl){
				var dependencyUrl = options.getter.raw(dependUrl),
					dependencyText,
					dependencies;

				try {
					dependencyText = readUrl(dependencyUrl);
				} catch (e) {}
				
				if (!dependencyText ) {
					//steal.print("  No dependancies");
					return {};
				}
		
				try {
					return JSONparse(dependencyText);
				} catch (e) {
					steal.print("  No or mailformed dependencies");
					return {};
				}
			}
		},
		/**
		 * @hide
		 * A helper that gets a file named file within a folderUrl
		 * @param {Object} folderUrl
		 * @param {Object} file
		 */
		file : function(folderUrl, file, options){
			var raw = options.getter.raw(folderUrl),
				content = readUrl(raw);
			var urls = options.getter.ls(content, raw, folderUrl);
			return urls[file];
		},
		/**
		 * Gets a list of plugins stolen by a file (or plugin w/i a folder)
		 * 
		 *     steal.get.steals("https://github.com/jupiterjs/mxui/tree/master/data/grid",
		 *                      {getter: steal.get.git});
		 *                      
		 *     // -> ['mxui/layout/table_scroll','mxui/data','jquery/controller/view',..]
		 * 
		 * @param {Object} url
		 * @param {Object} options
		 * @return {Array} an array of stolen JS files.
		 */
		steals : function(url, options){
			// is it a folder, if so, get it's contents and file ...
			if(!/\.js$/.test(url) && !/\/$/.test(url)){ // has to be a folder (if it isn't already)
				url = url +"/";
			}
			
			if(folderTest.test(url)){
				url = get.file(url, url.match(lastPart)[1]+".js", options); //p
				if(!url){
				// there is no plugin file
					return [];
				}
			}
			var raw = options.getter.raw(url),
				script, 
				stealCalls,
				plugins = [];
			
			try {
				script = readUrl(raw);
			} catch (e) {
				steal.print("Error reading file at "+raw);
				return [];
			}

			if(/steal/.test(script)){
				
				try{
					var stealCalls = steal.dummy(script)
				} catch(e){
					steal.print("Unable to figure out plugins.  Are you using steal in an unusual way?");
					return [];
				}
				
				// get non-jquery plugins and see if they want to install ...
				for(var i = 0; i < stealCalls.plugins.length; i++){
					var plugin = stealCalls.plugins[i];
					if(!/^jquery\/|steal/.test(plugin) && plugin != 'jquery' ){
						plugins.push(stealCalls.plugins[i])
					}
				}
			}
			
			//print("length", plugins.length)
			return plugins;
		}
	})


		
},"steal/get/basic.js","steal/get/git.js");