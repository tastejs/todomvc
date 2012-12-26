(function(){
	
	// Gets the window (even if there is none)
	var win = (function(){return this}).call(null),
		// String constants (for better minification)
		STR_ONLOAD = "onload",
		STR_ONERROR = "onerror",
		STR_ONREADYSTATECHANGE = "onreadystatechange",
		STR_CREATE_ELEMENT = 'createElement',
		STR_GET_BY_TAG = 'getElementsByTagName',
		
		// the document ( might not exist in rhino )
		doc = win.document,
		
		// creates a script tag
		scriptTag = function() {
			var start = doc[STR_CREATE_ELEMENT]('script');
			start.type = 'text/javascript';
			return start;
		},
		// a function that returns the head element
		// creates and caches the lookup if necessary
		head = function() {
			var d = doc,
				de = d.documentElement,
				heads = d[STR_GET_BY_TAG]("head"),
				hd = heads[0];
			if (! hd ) {
				hd = d[STR_CREATE_ELEMENT]('head');
				de.insertBefore(hd, de.firstChild);
			}
			// replace head so it runs fast next time.
			head = function(){
				return hd;
			}
			return hd;
		},
		// extends one object with another
		extend = function( d, s ) {
			for ( var p in s ) {
				d[p] = s[p];
			}
			return d;
		},
		// a jQuery-like $.each
		each = function(arr, cb){
			for(var i =0, len = arr.length; i <len; i++){
				cb.call(arr[i],i,arr[i])
			}
			return arr;
		},
		// makes an array of things
		makeArray = function(args){
			var arr = [];
			each(args, function(i, str){arr[i] = str});
			return arr;
		},
		// testing support for various browser behaviors
		support = {
			// does onerror work in script tags?
			error: doc && (function(){
				var script = scriptTag();
				script.setAttribute( "onerror", "return;" );
				return typeof script["onerror"] === "function" ?
					true : "onerror" in script
			})(),
			// If scripts support interactive ready state.
			// This is set later.
			interactive: false,
			attachEvent : doc && scriptTag().attachEvent
		},
		// a startup function that will be called when steal is ready
		startup = function(){},
		// the old steal value
		oldsteal = win.steal,
		// if oldsteal is an object
		// we use it as options to configure steal
		opts = typeof oldsteal == 'object' ? oldsteal : {};
		
	// =============================== STEAL ===============================

	/**
	 * @class steal
	 * @parent stealjs
	 * 
	 * __steal__ is a function that loads scripts, css, and 
	 * other resources into your application.
	 * 
	 *     steal(FILE_or_FUNCTION, ...)
	 * 
	 * ## Quick Walkthrough
	 * 
	 * Add a script tag that loads <code>steal/steal.js</code> and add
	 * the path to the first file to load in the query string like:
	 * 
	 * &lt;script type='text/javascript'
	 *     src='../steal/steal.js?myapp/myapp.js'>
	 * &lt;/script>
	 * 
	 * Then, start loading things and using them like:
	 * 
	 *     steal('myapp/tabs.js',
	 *           'myapp/slider.js', 
	 *           'myapp/style.css',function(){
	 *     
	 *        // tabs and slider have loaded 
	 *        $('#tabs').tabs();
	 *        $('#slider').slider()
	 *     })
	 * 
	 * Make sure your widgets load their dependencies too:
	 * 
	 *     // myapp/tabs.js
	 *     steal('jquery', function(){
	 *       $.fn.tabs = function(){
	 *        ...
	 *       }
	 *     })
	 * 
	 * ## Examples:
	 * 
	 *     // Loads ROOT/jquery/controller/controller.js
	 *     steal('jquery/controller')
	 *     steal('jquery/controller/controller.js')
	 *     
	 *     // Loads coffee script type and a coffee file relative to
	 *     // the current file
	 *     steal('steal/coffee').then('./mycoffee.coffee')
	 *     
	 *     // Load 2 files and dependencies in parallel and
	 *     // callback when both have completed
	 *     steal('jquery/controller','jquery/model', function(){
	 *       // $.Controller and $.Model are available
	 *     })
	 *     
	 *     // Loads a coffee script with a non-standard extension (cf)
	 *     // relative to the current page and instructs the build
	 *     // system to not package it (but it will still be loaded).
	 *     steal({
	 *        src: "./foo.cf",
	 *        packaged: false,
	 *        type: "coffee"
	 *      })
	 * 
	 * The following is a longer walkthrough of how to install
	 * and use steal:
	 * 
	 * ## Adding steal to a page
	 * 
	 * After installing StealJS (or JavaScriptMVC), 
	 * find the <code>steal</code> folder with
	 * <code>steal/steal.js</code>. 
	 * 
	 * To use steal, add a script tag
	 * to <code>steal/steal.js</code> to your
	 * html pages.  
	 * 
	 * This walkthrough assumes you have the steal script 
	 * in <code>public/steal/steal.js</code> and a directory 
	 * structure like:
	 * 
	 * @codestart text
	 * /public
	 *     /steal
	 *     /pages
	 *         myapp.html
	 *     /myapp
	 *         myapp.js
	 *         jquery.js
	 *         jquery.ui.tabs.js
	 * @codeend
	 * 
	 * To use steal in <code>public/pages/myapp.html</code>,
	 * add a script tag in <code>myapp.html</code>:
	 * 
	 * @codestart html
	 * &lt;script type='text/javascript'
	 *     src='../steal/steal.js'>
	 * &lt;/script>
	 * @codeend
	 * 
	 * <div class='whisper'>PRO TIP: Bottom load your scripts. It
	 * will increase your application's percieved response time.</div>
	 * 
	 * ## Loading the First Script
	 * 
	 * Once steal has been added to your page, it's time
	 * to load scripts. We want to load <code>myapp.js</code>
	 * and have it load <code>jquery.js</code> and 
	 * <code>jquery.ui.tabs.js</code>.
	 * 
	 * By default, steal likes your scripts
	 * to be within in the [steal.static.root steal.root] folder.  The [steal.root] the 
	 * folder contains the <code>steal</code> folder.  In this example,
	 * it is the <code>public</code> folder.
	 * 
	 * To load <code>myapp/myapp.js</code>, we have two options:
	 * 
	 * #### Add a script tag
	 *  
	 * Add a script tag after the steal 
	 * script that 'steals' <code>myapp.js</code> like:
	 * 
	 * @codestart html
	 * &lt;script type='text/javascript'>
	 *   steal('myapp/myapp.js')
	 * &lt;/script>
	 * @codeend
	 * 
	 * #### Add the script parameter
	 * 
	 * The most common (and shortest) way to load <code>myapp.js</code>
	 * is to add the script path to the steal script's src after in the
	 * query params.  So, instead of adding a script, we change 
	 * the steal script from:
	 * 
	 * @codestart html
	 * &lt;script type='text/javascript'
	 *     src='../steal/steal.js'>
	 * &lt;/script>
	 * @codeend
	 * 
	 * To
	 * 
	 * @codestart html
	 * &lt;script type='text/javascript'
	 *     src='../steal/steal.js?<b>myapp/myapp.js</b>'>
	 * &lt;/script>
	 * @codeend
	 * 
	 * <div class='whisper'>PRO TIP: You can also just add
	 * <code>?myapp</code> to the query string.</div>
	 * 
	 * ## Loading Scripts
	 * 
	 * We want to load <code>jquery.js</code> and
	 * <code>jquery.ui.tabs.js</code> into the page and then
	 * add then create a tabs widget.  First we need to load 
	 * <code>jquery.js</code>.
	 * 
	 * By default, steal loads script relative to [steal.root]. To
	 * load <code>myapp/jquery.js</code> we can the following to
	 * <code>myapp.js</code>:
	 * 
	 *     steal('myapp/jquery.js');
	 *     
	 * But, we can also load relative to <code>myapp.js</code> like:
	 * 
	 *     steal('./jquery.js');
	 *     
	 * Next, we need to load <code>jquery.ui.tabs.js</code>.  You
	 * might expect something like:
	 * 
	 *     steal('./jquery.js','./jquery.ui.tabs.js')
	 * 
	 * to work.  But there are two problems / complications:
	 * 
	 *   - steal loads scripts in parallel and runs out of order
	 *   - <code>jquery.ui.tabs.js</code> depends on jQuery being loaded
	 *   
	 * This means that steal might load <code>jquery.ui.tabs.js</code>
	 * before <code>jquery.js</code>.  But this is easily fixed.
	 * 
	 * [steal.static.then] waits until all previous scripts have loaded and
	 * run before loading scripts after it.  We can load <code>jquery.ui.tabs.js</code>
	 * after <code>jquery.js</code> like:
	 * 
	 *     steal('./jquery.js').then('./jquery.ui.tabs.js')
	 * 
	 * Finally, we need to add tabs to the page after 
	 * the tabs's widget has loaded.  We can add a callback function to
	 * steal that will get called when all previous scripts have finished
	 * loading:
	 * 
	 *     steal('./jquery.js').then('./jquery.ui.tabs.js', function($){
	 *       $('#tabs').tabs();
	 *     })
	 *
	 * ## Other Info
	 * 
	 * ### Exclude Code Blocks From Production
	 *
	 * To exclude code blocks from being included in 
	 * production builds, add the following around
	 * the code blocks.
	 *
	 *     //!steal-remove-start
	 *         code to be removed at build
	 *     //!steal-remove-end
	 * 
	 * ### Lookup Paths
	 * 
	 * By default steal loads resources relative 
	 * to [steal.static.root steal.root].  For example, the following
	 * loads foo.js in <code>steal.root</code>:
	 * 
	 *     steal('foo.js'); // loads //foo.js
	 *     
	 * This is the same as writing:
	 * 
	 *     steal('//foo.js');
	 *     
	 * Steal uses <code>'//'</code> to designate the [steal.static.root steal.root]
	 * folder.
	 * 
	 * To load relative to the current file, add <code>"./"</code> or
	 *  <code>"../"</code>:
	 *  
	 *     steal("./bar.js","../folder/zed.js");
	 * 
	 * Often, scripts can be found in a folder within the same 
	 * name. For example, [jQuery.Controller $.Controller] is 
	 * in <code>//jquery/controller/controller.js</code>. For convience,
	 * if steal is provided a path without an extension like:
	 * 
	 *     steal('FOLDER/PLUGIN');
	 *     
	 * It is the same as writing:
	 * 
	 *     steal('FOLDER/PLUGIN/PLUGIN.js')
	 *     
	 * This means that <code>//jquery/controller/controller.js</code>
	 * can be loaded like:
	 * 
	 *      steal('jquery/controller')
	 * 
	 * ### Types
	 * 
	 * steal can load resources other than JavaScript.
	 * 
	 * 
	 * @constructor
	 * 
	 * Loads resources specified by each argument.  By default, resources
	 * are loaded in parallel and run in any order.
	 * 
	 * 
	 * @param {String|Function|Object} resource... 
	 * 
	 * Each argument specifies a resource.  Resources can 
	 * be given as a:
	 * 
	 * ### Object
	 *  
	 * An object that specifies the loading and build 
	 * behavior of a resource.  
	 *    
	 *      steal({
	 *        src: "myfile.cf",
	 *        type: "coffee",
	 *        packaged: true,
	 *        unique: true,
	 *        ignore: false,
	 *        waits: false
	 *      })
	 *    
	 * The available options are:
	 *    
	 *  - __src__ {*String*} - the path to the resource.  
	 *    
	 *  - __waits__ {*Boolean default=false*} - true the resource should wait 
	 *    for prior steals to load and run. False if the resource should load and run in
	 *    parallel.  This defaults to true for functions.
	 *  
	 *  - __unique__ {*Boolean default=true*} - true if this is a unique resource 
	 *    that 'owns' this url.  This is true for files, false for functions.
	 *             
	 *  - __ignore__ {*Boolean default=false*} - true if this resource should
	 *    not be built into a production file and not loaded in
	 *    production.  This is great for script that should only be available
	 *    in development mode.
	 *  
	 *  - __packaged__ {*Boolean default=true*} - true if the script should be built
	 *    into the production file. false if the script should not be built
	 *    into the production file, but still loaded.  This is useful for 
	 *    loading 'packages'.
	 * 
	 *  - __type__ {*String default="js"*} - the type of the resource.  This 
	 *    is typically inferred from the src.
	 * 
	 * ### __String__
	 *  
	 * Specifies src of the resource.  For example:
	 *  
	 *       steal('./file.js')
	 *         
	 * Is the same as calling:
	 *      
	 *       steal({src: './file.js'})
	 *  
	 * ### __Function__ 
	 *  
	 * A callback function that runs when all previous steals
	 * have completed.
	 *    
	 *     steal('jquery', 'foo',function(){
	 *       // jquery and foo have finished loading
	 *       // and runing
	 *     })
	 * 
	 * @return {steal} the steal object for chaining
	 */
	function steal() {
		// convert arguments into an array
		var args = makeArray(arguments);
		pending.push.apply(pending,  args);
		// steal.after is called everytime steal is called
		// it kicks off loading these files
		steal.after(args);
		// return steal for chaining
		return steal;
	};
	
	
	// =============================== PATHS .8 ============================

// things that matter ... 
//  - the current file being loaded
//  - the location of the page
//  - the file

	/**
	 * @class
	 * Used for getting information out of a path
	 * @constructor
	 * Takes a path
	 * @param {String} path 
	 */
	steal.File = function( path ) {
		// if new was not used, use it.
		if ( this.constructor != steal.File ) {
			return new steal.File(path);
		}
		// save the path
		this.path = typeof path == 'string'? path : path.path;
	};
	// alias steal.File to File
	var File = steal.File,
	
		// a reference to the current file
		curFile;
	
	// get and sets the current file
	File.cur = function(newCurFile){
		if(newCurFile !== undefined){
			curFile = File(newCurFile);
		}else{
			return curFile || File("");
		}
	};
	

	extend(File.prototype,
	/**
	 * @prototype
	 */ 
	{
		// Removes hash and querystring
		clean: function() {
			return this.path.match(/([^\?#]*)/)[1];
		},
		// gets the files extension
		ext : function(){
			var match = this.clean().match(/\.([\w\d]+)$/)
			return match ? match[1] : "";
		},
		// Returns everything before the last /
		dir: function() {
			// remove any query string
			var cleaned = this.clean(),
				// get the last /
				last = cleaned.lastIndexOf('/'),
			    // if there is a last /, get everything up to that point
				dir = (last != -1) ? cleaned.substring(0, last) : '';
			// make sure we aren't left with just https/ or file:/
			return /^(https?:\/|file:\/)$/.test(dir) ? cleaned : dir;
		},
		// Returns everything after the last /
		filename: function() {
			var cleaned = this.clean(),
				last = cleaned.lastIndexOf('/'),
				filename = (last != -1) ? cleaned.substring(last+1, cleaned.length) : cleaned;
			return /^(https?:\/|file:\/)$/.test(filename) ? cleaned : filename;
		},
		// Returns the domain for the current path.
		// Returns null if the domain is a file.
		domain: function() {
			var http = this.path.match(/^(?:https?:\/\/)([^\/]*)/);
			return http ? http[1] : null;
		},
		/**
		 * Joins a url onto a path.  One way of understanding this is that your File object represents your current location, and calling join() is analogous to "cd" on a command line.
		 * @codestart
		 * new steal.File("d/e").join("../a/b/c"); // Yields the path "d/a/b/c"
		 * @codeend
		 * @param {String} url
		 */
		join: function( url ) {
			return File(url).joinFrom(this.path);
		},

		/**
		 * Returns the path of this file referenced from another url or path.
		 * 
		 *     new steal.File('a/b.c').joinFrom('/d/e')//-> /d/e/a/b.c
		 * 
		 * @param {String} url
		 * @param {Boolean} expand if the path should be expanded
		 * @return {String} 
		 */
		joinFrom: function( url, expand ) {
			var u = File(url);
			
			// if this.path is absolutely referenced
			if ( this.protocol() ) { //if we are absolutely referenced
				
				//try to shorten the path as much as possible:
				var firstDomain = this.domain(),
					secondDomain = u.domain();
				
				// if domains are equal, shorten
				if ( firstDomain && firstDomain == secondDomain ) {
					
					return this.toReferenceFromSameDomain(url);
				} else {
					// if there is no domain or not equal, use our path
					return this.path;
				}
			
			// the path is the same as the folder the page is in
			} else if ( url === steal.pageUrl().dir() && !expand ) {

				return this.path;

			} else if ( this.isLocalAbsolute() ) { // we are a path like /page.js

				return (u.domain() ? u.protocol() + "//" + u.domain() : "" )+ this.path;
				
			} else  { //we have 2 relative paths, remove folders with every ../
				
				if ( url === '' ) {
					return this.path.replace(/\/$/, '');
				}
				
				var urls = url.split('/'),
					paths = this.path.split('/'),
					path = paths[0];
				
				//if we are joining from a folder like cookbook/, remove the last empty part
				if ( url.match(/\/$/) ) {
					urls.pop();
				}
				// for each .. remove one folder
				while ( path == '..' && paths.length > 0 ) {
					// if we've emptied out, folders, just break
					// leaving any additional ../s
					if(! urls.pop() ){ 
						break;
					}
					paths.shift();
					
					path = paths[0];
				}
				return urls.concat(paths).join('/');
			}
		},
		// Returns true if the file is relative to a domain or a protocol
		relative: function() {
			return this.path.match(/^(https?:|file:|\/)/) === null;
		},
		/**
		 * Returns the relative path between two paths with common folders.
		 * @codestart
		 * new steal.File('a/b/c/x/y').toReferenceFromSameDomain('a/b/c/d/e')//-> ../../x/y
		 * @codeend
		 * @param {Object} url
		 * @return {String} 
		 */
		toReferenceFromSameDomain: function( url ) {
			var parts = this.path.split('/'),
				other_parts = url.split('/'),
				result = '';
			while ( parts.length > 0 && other_parts.length > 0 && parts[0] == other_parts[0] ) {
				parts.shift();
				other_parts.shift();
			}
			each(other_parts, function(){ result += '../'; })
			return result + parts.join('/');
		},
		/**
		 * Is the file on the same domain as our page.
		 */
		isCrossDomain: function() {
			return this.isLocalAbsolute() ? false : this.domain() != File(win.location.href).domain();
		},
		isLocalAbsolute: function() {
			return this.path.indexOf('/') === 0;
		},
		protocol: function() {
			var match = this.path.match(/^(https?:|file:)/);
			return match && match[0];
		},
		/**
		 * For a given path, a given working directory, and file location, update the path so 
		 * it points to a location relative to steal's root.
		 * 
		 * We want everything relative to steal's root so the same app can work in multiple pages.
		 * 
		 * ./files/a.js = steals a.js
		 * ./files/a = a/a.js
		 * files/a = //files/a/a.js
		 * files/a.js = loads //files/a.js
		 */
		normalize: function() {

			var current = File.cur().dir(),
				//if you are cross domain from the page, and providing a path that doesn't have an domain
				path = this.path;
			if (/^\/\//.test(this.path)) { //if path is rooted from steal's root (DEPRECATED) 
				path = this.path.substr(2);
			} 
			else if (/^\.\//.test(this.path)) { // should be relative
				this.path = this.path.substr(2);
				path = this.joinFrom(current);
				this.path = "./" + this.path;
			}
			else if (/^[^\.|\/]/.test(this.path)) {}
			else {
				if (this.relative() ||
				File.cur().isCrossDomain() && //if current file is on another domain and
				!this.protocol()) { //this file doesn't have a protocol
					path = this.joinFrom(current);
				}
			}
			
			return path;
		}
	});
	
	var pending = [],
		s = steal,
		id = 0,
		steals = {};

	// this is for methods on a 'steal instance'.  A file can be in one of a few states:
	// created - the steal instance is created, but we haven't started loading it yet
	//           this happens when thens are used
	// loading - (loading=true) By calling load, this will tell steal to load a file
	// loaded - (isLoaded=true) The file has been run, but its dependency files have been completed
	// complete - all of this files dependencies have loaded and completed.
	steal.p = {
		// adds a new steal and throws an error if the script doesn't load
		// this also checks the steals map
		make: function(options){
			
			var stel = new steal.p.init(options),
				rootSrc = stel.options.rootSrc;
			
			if(stel.unique && rootSrc){
				// the .js is b/c we are not adding that automatically until
				// load because we defer 'type' determination until then
				if(!steals[rootSrc] && ! steals[rootSrc+".js"]){  //if we haven't loaded it before
					steals[rootSrc] = stel;
				} else{ // already have this steal
					stel = steals[rootSrc];
					// extend the old stolen file with any new options
					extend(stel.options, typeof options === "string" ? {} : options)
				}
			}
			
			return stel;
		},
		init: function( options ) {
			this.dependencies = [];
			// id for debugging
			this.id = (++id);
			
			// if we have no options, we are the global init ... set ourselves up ...
			if(!options){ //global init cur ...
				this.options = {};
				this.waits = false;
				this.pack = "production.js";
			} 
			//handle callback functions	
			else if ( typeof options == 'function' ) {
				var path = File.cur().path;
				
				this.options = {
					fn : function() {
					
						//set the path ..
						File.cur(path);
						
						// call the function, someday soon this will be requireJS-like
						options(steal.send || win.jQuery || steal); 
					},
					rootSrc: path,
					orig: options,
					type: "fn"
				}
				// this has nothing to do with 'loading' options
				this.waits = true;
				this.unique = false;
			} else {
				
				// save the original options
				this.orig = options;

				this.options = steal.makeOptions(extend({},
					typeof options == 'string' ? { src: options } : options));

				this.waits = this.options.waits || false;
				this.unique = true;
			}
		},
		complete : function(){
			this.completed = true;
		},
		/**
		 * @hide
		 * After the script has been loaded and run
		 * 
		 *   - check what else has been stolen, load them
		 *   - mark yourself as complete when everything is completed
		 *   - this is where all the actions is
		 */

		loaded: function(script){
			var myqueue, 
				stel, 
				src = (script && script.src) || this.options.src,
				rootSrc = this.options.rootSrc;
			
			//set yourself as the current file
			File.cur(rootSrc);
			
			// mark yourself as 'loaded'.  
			this.isLoaded = true;
			
			// If we are IE, get the queue from interactives
			// TODO move this out of this function
			if (support.interactive && src) {
				myqueue = interactives[src];
			}
			// is there a case in IE where, this makes sense?
			// in other browsers, the queue of items to load is
			// what is in pending
			if(!myqueue){
				myqueue = pending.slice(0);
				pending = [];
			}
			
			// if we have nothing, mark us as complete (resolve if deferred)
			if(!myqueue.length){
				this.complete();
				return;
			}
			
			// now we have to figure out how to wire up our pending steals
			var self = this,
				set = [],
				// the current
				joiner,  
				initial = [],
				
				isProduction = steal.options.env == 'production',
				
				files = [],
				
				// a helper that basically does a join
				// when everything in arr's func method is called,
				// call func2 on obj
				whenEach = function(arr, func, obj, func2){
					var big = [obj, func2];
					each(arr, function(i, item){
						big.unshift(item, func)
					});
					when.apply(steal, big);
				},
				// a helper that does the oposite of a join.  When
				// obj's func method is called, call func2 on all items.
				whenThe = function(obj, func, items, func2){
					each(items, function(i, item){
						when(obj, func, item, func2)
					})
				};
			
			
			//now go through what you stole and hook everything up
			//BUT, we go through backwards
			each(myqueue.reverse(), function(i, item){
				
				//in production, ignore ignored items (like steal/dev
				if(isProduction && item.ignore){
					return;
				}
				
				// make a steal object
				stel = steal.p.make( item );
				
				// add it as a dependency, circular are not allowed
				self.dependencies.unshift(stel)
				
				
				if(stel.waits === false){ // file
					// on the current 
					files.push(stel);
				
				}else{ // function
					
					// essentially have to bind current files to call previous joiner's load
					// and to wait for current stel's complete
					
					if(!joiner){ // if no previous joiner, then we are at the start of a file
						
						// when they are complete, complete the file
						whenEach( files.concat(stel), "complete", self, "complete");
						
						// if there was a function then files, then end, function loads all files
						if(files.length){
							whenThe(stel,"complete", files ,"load")
						}
						
					} else { //   function,  file1, file2, file3, joiner function
						
						whenEach(files.concat(stel) , "complete", joiner, "load");
						
						// make stel complete load files
						whenThe(stel,"complete", files.length ? files : [joiner] ,"load")
						
					}
					// the joiner is the previous thing
					joiner = stel;
					files = [];
					
				}
			});
			
			// now we should be left with the starting files
			if(files.length){
				// we have initial files
				// if there is a joiner, we need to load it when the initial files are complete
				if(joiner){
					whenEach(files, "complete", joiner, "load");
				} else {
					whenEach(files, "complete", self, "complete");
				}
				// reverse it back and load each initial file
				each(files.reverse(), function(){
					this.load();
				});
			} else if(joiner){
				// we have inital function
				joiner.load()
			} else {
				// we had nothing
				self.complete();
			}

		},
		/**
		 * Loads this steal
		 */
		load: function(returnScript) {
			// if we are already loading / loaded
			if(this.loading || this.isLoaded){
				return;
			}
			this.loading = true;
			var self = this;
			// get yourself
			steal.require(this.options, function load_calling_loaded(script){
				self.loaded(script);
			}, function(error, src){
				win.clearTimeout && win.clearTimeout(self.completeTimeout)
				throw "steal.js : "+self.options.src+" not completed"
			});
			
		}

	};
	steal.p.init.prototype = steal.p;
	/**
	 * @add steal
	 */
	// =============================== STATIC API ===============================
	var page;
	/**
	 *  @static
	 */
	extend(steal,{
		/**
		 * @attribute root
		 * The location of the steal folder.
		 */
		root : File(""),
		/**
		 * Gets or sets the path from the current page to 
		 * steal's (or JavaScriptMVC's) root folder.  When passed a src, it sets the root folder. 
		 * Otherwise, it returns the path to the root folder.
		 * 
		 * This is the path from which 
		 * all plugins are stolen.  When you steal a plugin like steal("jquery/controller"), 
		 * the plugin path is joined with this rootUrl to create a full path 
		 * to the controller.js file.
		 * 
		 * By default, the rootUrl is calculated from the
		 * steal script and the window location.  For example, if the 
		 * script tag looks like this:
		 * 
		 *     <script type='text/javascript' src='../../steal/steal.js?ui/app'></script>
		 * 
		 * rootUrl will be set to "../../".
		 * Setting the rootUrl can be useful if you want to have
		 * steal.js in a different location.
		 * 
		 * ## Example
		 * 
		 * The following sets steal root to a different folder.
		 * 
		 *     steal.rootUrl("../../jmvc/")
		 * 
		 * This appends  <code>"../../jmvc"</code> to paths
		 * loaded from [steal.static.root].  In some strange cases this might be desirable if 
		 * plugin folders are in a different location from the steal directory. 
		 * 
		 * It also sets the current url to this directory so the first calls to steal work relative to the root JMVC directory.
		 * 
		 * @param {String} [src] a relative path from the current page to the root directory of JMVC, like ../../
		 * @return {String} returns the last path passed to rootUrl
		 */
		rootUrl : function(src){
			if (src !== undefined) {
				steal.root = File(src);
				
				// set cur with the location
				var cleaned = steal.pageUrl(),
					loc = cleaned.join(src);

				File.cur( cleaned.toReferenceFromSameDomain(loc) );
				return steal;
			} else {
				return steal.root.path;
			}
		},
		extend : extend,
		/**
		 * @function pageUrl
		 * Gets or sets the location of the page using 
		 * steal.  This defaults to the window's location.
		 * 
		 * However, sometimes it is necessary to 
		 * have steal believe it is making requests from
		 * another page.
		 * 
		 * @param {String} [newPage] a path to the page using steal (probably the windows location)
		 * @return {steal.File} returns the last path to a page passed to pageUrl, converted to a steal.File object 
		 */
		pageUrl : function(newPage){
			if(newPage){
				page = File( File(newPage).clean() );
				return steal;
			} else{
				return page || File("");
			}
		},
		//gets and sets which page steal thinks it's at
		// TODO: make location change-able ...
		/**
		 * Gets the currently running script location.
		 * 
		 * @return String
		 */
		cur: function( file ) {
			if (file === undefined) {
				return File.cur();
			} else {
				File.cur(file);
				return steal;
			}
		},
		isRhino: win.load && win.readUrl && win.readFile,
		/**
		 * @attribute options
		 * Configurable options
		 */
		options : {
			env : 'development',
			// TODO: document this
			loadProduction : true
		},
		/**
		 * @hide
		 * when a 'unique' steal gets added ...
		 * @param {Object} stel
		 */
		add : function(stel){
			steals[stel.rootSrc] = stel;
		},
		/**
		 * @hide
		 * Makes options
		 * @param {Object} options
		 */
		makeOptions : function(options){
			
			var ext = File(options.src).ext();
			if (!ext) {
				// if first character of path is a . or /, just load this file
				if (options.src.indexOf(".") == 0 || options.src.indexOf("/") == 0) {
					options.src = options.src + ".js"
				}
				// else, load as a plugin
				else {
					options.src = options.src + "/" + File(options.src).filename() + ".js";
				}
			}
			
			var orig = options.src,
				// path relative to the current files path
				// this is done relative to jmvcroot
				normalized = steal.File(orig).normalize(),
				protocol = steal.File(options.src).protocol();
				
			extend(options,{
				originalSrc : options.src,
				rootSrc : normalized,
				// path from the page
				src : steal.root.join(normalized),
				// "file:" or "http:" depending on what protocol the request uses
				protocol: protocol || (doc? location.protocol: "file:")
			});
			options.originalSrc = options.src;
			
			return options;
		},
		/**
		 * Calls steal, but waits until all previous steals
		 * have completed loading until loading the 
		 * files passed to the arguments.
		 */
		then : function(){
			var args = typeof arguments[0] == 'function' ? 
				arguments : [function(){}].concat(makeArray( arguments ) )
			return steal.apply(win, args );
		},
		/**
		 * Listens to events on Steal
		 * @param {String} event
		 * @param {Function} listener
		 */
		bind: function(event, listener){
			if(!events[event]){
				events[event] = [] 
			}
			var special = steal.events[event]
			if(special && special.add){
				listener = special.add(listener);
			}
			listener && events[event].push(listener);
			return steal;
		},
		one : function(event, listener){
			steal.bind(event,function(){
				listener.apply(this, arguments);
				steal.unbind(event, arguments.callee);
			});
			return steal;
		},
		events : {},
		/**
		 * Unbinds an event listener on steal
		 * @param {Object} event
		 * @param {Object} listener
		 */
		unbind : function(event, listener){
			var evs = events[event] || [],
				i = 0;
			while(i < evs.length){
				if(listener === evs[i]){
					evs.splice(i,1);
				}else{
					i++;
				}
			}
		},
		trigger : function(event, arg){
			var arr = events[event] || [],
				copy = [];
			// array items might be removed during each iteration (with unbind), so we iterate over a copy
			for(var i =0, len = arr.length; i <len; i++){
				copy[i] = arr[i];
			}
			each(copy, function(i,f){
				f(arg);
			})
		},
		/**
		 * @hide
		 * Used to tell steal that it is loading a number of plugins
		 */
		loading : function(){
			// we don't use IE's interactive script functionality while production scripts are loading
			useInteractive = false;
			each(arguments, function(i, arg){
				var stel = steal.p.make( arg );
				stel.loading = true;
			});
		},
		// a dummy function to add things to after the stel is created, but before 
		// loaded is called
		preloaded : function(){},
		// called when a script has loaded via production
		loaded: function(name){
			// create the steal, mark it as loading, then as loaded
			var stel = steal.p.make( name );
			stel.loading = true;
			convert(stel, "complete");
			
			steal.preloaded(stel);
			stel.loaded()
			return steal;
		}
	});
	
	var events = {};
	startup = before(startup, function(){
		
		steal.pageUrl(win.location ?  win.location.href : "");
		
	})
	
	
	// =============================== TYPE SYSTEM ===============================
	
	var types = steal.types = {};
	
	
	steal.
	/**
	 * Registers a type.  You define the type of the file, the basic type it converts to, and a 
	 * conversion function where you convert the original file to JS or CSS.  This is modeled after the 
	 * [http://api.jquery.com/extending-ajax/#Converters AJAX converters] in jQuery.
	 * 
	 * Types are designed to make it simple to switch between steal's development and production modes.  In development mode, the types are converted 
	 * in the browser to allow devs to see changes as they work.  When the app is built, these converter functions are run by the build process, 
	 * and the processed text is inserted into the production script, optimized for performance.
	 * 
	 * Here's an example converting files of type .foo to JavaScript.  Foo is a fake language that saves global variables defined like.  A .foo file might 
	 * look like this:
	 * 
	 *     REQUIRED FOO
	 * 
	 * To define this type, you'd call steal.type like this:
	 * 
	 *     steal.type("foo js", function(options, original, success, error){
	 *       var parts = options.text.split(" ")
	 *       options.text = parts[0]+"='"+parts[1]+"'";
	 *       success();
	 *     });
	 * 
	 * The method we provide is called with the text of .foo files in options.text. We parse the file, create 
	 * JavaScript and put it in options.text.  Couldn't be simpler.
	 * 
	 * Here's an example, converting [http://jashkenas.github.com/coffee-script/ coffeescript] to JavaScript:
	 * 
	 *     steal.type("coffee js", function(options, original, success, error){
	 *       options.text = CoffeeScript.compile(options.text);
	 *       success();
	 *     });
	 * 
	 * In this example, any time steal encounters a file with
	 * extension .coffee, it will call the given 
	 * converter method.  CoffeeScript.compile takes the text of the file, converts it from coffeescript to javascript, 
	 * and saves the JavaScript text in options.text.
	 * 
	 * Similarly, languages on top of CSS, like [http://lesscss.org/ LESS], can be converted to CSS:
	 * 
	 *     steal.type("less css", function(options, original, success, error){
	 *       new (less.Parser)({
	 *         optimization: less.optimization,
	 *         paths: []
	 *       }).parse(options.text, function (e, root) {
	 *         options.text = root.toCSS();
	 *         success();
	 *       });
	 *     });
	 * 
	 * This simple type system could be used to convert any file type to be used in your JavaScript app.  For example, 
	 * [http://fdik.org/yml/ yml] could be used for configuration.  jQueryMX uses steal.type to support JS templates, such as EJS, TMPL, and others.
	 * 
	 * @param {String} type A string that defines the new type being defined and the type being converted to, 
	 * separated by a space, like "coffee js".  
	 * 
	 * There can be more than two steps used in conversion, such as "ejs view 
	 * js".  This will define a method that converts .ejs files to .view files.  There should be another converter for "view js" 
	 * that makes this final conversion to JS.
	 * 
	 * @param {Function} cb( options, original, success, error ) a callback function that converts the new file type 
	 * to a basic type.  This method needs to do two things: 1) save the text of the converted file in options.text 
	 * and 2) call success() when the conversion is done (it can work asynchronously).
	 * 
	 * - __options__ - the steal options for this file, including path information
	 * - __original__ - the original argument passed to steal, which might be a path or a function
	 * - __success__ - a method to call when the file is converted and processed successfully
	 * - __error__ - a method called if the conversion fails or the file doesn't exist
	 */
	type = function(type, cb){
		var typs = type.split(" ");
		
		if(!cb){
			return types[typs.shift()].require
		}
		
		types[typs.shift()] = {
			require : cb,
			convert: typs
		};
	};
	// adds a type (js by default) and buildType (css, js)
	// this should happen right before loading
	// however, what if urls are different 
	// because one file has JS and another does not?
	// we could check if it matches something with .js because foo.less.js SHOULD
	// be rare
	steal.p.load = before(steal.p.load, function(){
		var raw = this.options;
		
		// if it's a string, get it's extension and check if
		// it is a registered type, if it is ... set the type
		if(!raw.type){
			var ext = File(raw.src).ext();
			if(!ext && !types[ext]){
				ext = "js";
			}
			raw.type =  ext;
		}
		if (!types[raw.type]){
			throw "steal.js - type " + raw.type + " has not been loaded.";
		}
		var converters =  types[raw.type].convert;
		raw.buildType = converters.length ? converters[converters.length - 1] : raw.type;
	});
	
	steal.
	/**
	 * Called for every file that is loaded.  It sets up a string of methods called for each type in the conversion chain and calls each type one by one.  
	 * 
	 * For example, if the file is a coffeescript file, here's what happens:
	 * 
	 *   - The "text" type converter is called first.  This will perform an AJAX request for the file and save it in options.text.  
	 *   - Then the coffee type converter is called (the user provided method).  This converts the text from coffeescript to JavaScript.  
	 *   - Finally the "js" type converter is called, which inserts the JavaScript in the page as a script tag that is executed. 
	 * 
	 * @param {Object} options the steal options for this file, including path information
	 * @param {Function} success a method to call when the file is converted and processed successfully
	 * @param {Function} error a method called if the conversion fails or the file doesn't exist
	 */
	require = function(options, success, error){
		// get the type
		var type = types[options.type],
			converters;
		
		// if this has converters, make it get the text first, then pass it to the type
		if(type.convert.length){
			converters = type.convert.slice(0);
			converters.unshift('text', options.type)
		} else  {
			converters = [options.type]
		}
		require(options, converters, success, error)
	};
	function require(options, converters, success, error){
		
		var type = types[converters.shift()];
		
		type.require(options, function require_continue_check(){
			// if we have more types to convert
			if(converters.length){
				require(options, converters, success, error)
			} else { // otherwise this is the final
				success.apply(this, arguments);
			}
		}, error)
	};


// =============================== TYPES ===============================

// a clean up script that prevents memory leaks and removes the
// script
var cleanUp = function(script) {
		script[ STR_ONREADYSTATECHANGE ]
			= script[ STR_ONLOAD ]
			= script[STR_ONERROR]
			= null;
			
		head().removeChild( script );
	},
	// the last inserted script, needed for IE
	lastInserted,
	// if the state is done
	stateCheck = /loaded|complete/;
steal.type("js", function(options, success, error){
	// create a script tag
	var script = scriptTag(), 
		deps;
	// if we have text, just set and insert text
	if (options.text) {
		// insert
		script.text = options.text;
		
	}
	else {
		
		var callback = function(evt){
			if (!script.readyState || stateCheck.test(script.readyState)) {
				cleanUp(script);
				success(script);
			}
		}
		// listen to loaded
		if (support.attachEvent) {
			script.attachEvent(STR_ONREADYSTATECHANGE, callback)
		} else {
			script[STR_ONLOAD] = callback;
		}
		
		// error handling doesn't work on firefox on the filesystem
		if (support.error && error && options.protocol !== "file:") {
			if(support.attachEvent){
				script.attachEvent(STR_ONERROR, error);
			} else {
				script[ STR_ONERROR ] = error;
			}
		}
		script.src = options.src;
		script.onSuccess = success;
	}
		
	// insert the script
	lastInserted = script;
	head().insertBefore(script, head().firstChild);

	// if text, just call success right away, and clean up
	if (options.text) {
		success();
		cleanUp(script);
	}
});

steal.type("fn", function(options, success, error){
	success(options.fn());
});
steal.type("text", function(options, success, error){
	steal.request(options, function(text){
		options.text = text;
		success(text);
	}, error)
});

var cssCount = 0,
	createSheet = doc && doc.createStyleSheet,
	lastSheet,
	lastSheetOptions;

steal.type("css", function css_type(options, success, error){
	if(options.text){ // less
		var css  = doc[STR_CREATE_ELEMENT]('style');
		css.type = 'text/css';
		if (css.styleSheet) { // IE
			css.styleSheet.cssText = options.text;
		} else {
			(function (node) {
				if (css.childNodes.length > 0) {
					if (css.firstChild.nodeValue !== node.nodeValue) {
						css.replaceChild(node, css.firstChild);
					}
				} else {
					css.appendChild(node);
				}
			})(doc.createTextNode(options.text));
		}
		head().appendChild(css);
	} else {
		if( createSheet ){
			// IE has a 31 sheet and 31 import per sheet limit
			if(cssCount == 0){
				lastSheet = document.createStyleSheet(options.src);
				lastSheetOptions = options;
				cssCount++;
			} else {
				var relative = File(options.src).joinFrom(
					File(lastSheetOptions.src).dir());
					
				lastSheet.addImport( relative );
				cssCount++;
				if(cssCount == 30){
					cssCount = 0;
				}
			}
			success()
			return;
		}

		
		options = options || {};
		var link = doc[STR_CREATE_ELEMENT]('link');
		link.rel = options.rel || "stylesheet";
		link.href = options.src;
		link.type = 'text/css';
		head().appendChild(link);
	}
	
	success();
});

// Overwrite
if(opts.types){
	for(var type in opts.types){
		steal.type(type, opts.types[type]);
	}
}


// =============================== HELPERS ===============================
var factory = function() {
	return win.ActiveXObject ? new ActiveXObject("Microsoft.XMLHTTP") : new XMLHttpRequest();
};


steal.
/**
 * Performs an XHR request
 * @param {Object} options
 * @param {Function} success
 * @param {Function} error
 */
request = function(options, success, error){
	var request = new factory(),
		contentType = (options.contentType || "application/x-www-form-urlencoded; charset=utf-8"),
		clean = function(){
			request = check = clean = null;
		},
		check = function(){
			if ( request.readyState === 4 )  {
				if ( request.status === 500 || request.status === 404 || 
					 request.status === 2 || request.status < 0 || 
					 (request.status === 0 && request.responseText === '') ) {
					error && error(request.status);
					clean();
				} else {
					success(request.responseText);
					clean();
				}
				return;
			} 
		};
		
	request.open("GET", options.src, options.async === false ? false : true);
	request.setRequestHeader('Content-type', contentType);
	if ( request.overrideMimeType ) {
		request.overrideMimeType(contentType);
	}
	
	request.onreadystatechange = function(){
	  check();                                                               
	}
	try {
		request.send(null);
	}
	catch (e) {
		if (clean) {
			console.error(e);
			error && error();
			clean();
		}
	}
			 
};




	//  =============================== MAPPING ===============================
	var insertMapping = function(p){
		// don't worry about // rooted paths
		var mapName,
			map;
			
		// go through mappings
		for(var mapName in steal.mappings){
			map = steal.mappings[mapName]
			if(map.test.test(p)){ 
				return p.replace(mapName, map.path);
			}
		}
		return p;
	};
	File.prototype.mapJoin = function( url ){
		url = insertMapping(url);
		return File(url).joinFrom(this.path);
	};
	// modifies src
	steal.makeOptions = after(steal.makeOptions,function(raw){
		raw.src = steal.root.join(raw.rootSrc = insertMapping(raw.rootSrc));
	});
	
	//root mappings to other locations
	steal.mappings = {};
	
	steal.
	/**
	 * Maps a 'rooted' folder to another location.
	 * @param {String|Object} from the location you want to map from.  For example:
	 *   'foo/bar'
	 * @param {String} [to] where you want to map this folder too.  Ex: 'http://foo.cdn/bar'
	 * @return {steal}
	 */
	map = function(from, to){
		if(typeof from == "string"){
			steal.mappings[from] = {
				test : new RegExp("^("+from+")([/.]|$)"),
				path: to
			};
		} else { // its an object
			for(var key in from){
				steal.map(key, from[key]);
			}
		}
		return this;
	}
	
	// =============================== STARTUP ===============================
	
	
	var currentCollection;
	
	// essentially ... we need to know when we are on our first steal
	// then we need to know when the collection of those steals ends ...
	// and, it helps if we use a 'collection' steal because of it's natural 
	// use for going through the pending queue
	// 
	extend(steal,{
		// called after steals are added to the pending queue
		after: function(){
			// if we don't have a current 'top' steal
			// we create one and set it up
			// to start loading its dependencies (the current pending steals)
			if(! currentCollection ){
				currentCollection = new steal.p.init();
				
				// keep a reference in case it disappears 
				var cur = currentCollection,
					// runs when a steal is starting
					go = function(){
						// indicates that a collection of steals has started
						steal.trigger("start", cur);
						when(cur,"complete", function(){
							steal.trigger("end", cur);
						});
						cur.loaded();
					};
				// if we are in rhino, start loading dependencies right away
				if(!win.setTimeout){
					go()
				}else{
					// otherwise wait a small timeout to make 
					// sure we get all steals in the current file
					setTimeout(go,0)
				}
			}
		},
		_before : before,
		_after: after
	});
	
	// this can probably move above
	steal.p.complete = before(steal.p.complete, function(){
		if(this === currentCollection){ // this is the last steal
			currentCollection = null;
		}
	});
	
	
	
	// =============================== jQuery ===============================
	(function(){
		var jQueryIncremented = false,
			jQ,
			ready = false;
		
		// check if jQuery loaded after every script load ...
		steal.p.loaded = before(steal.p.loaded, function(){
	
			var $ = typeof jQuery !== "undefined" ? jQuery : null;
			if ($ && "readyWait" in $) {
				
				//Increment jQuery readyWait if ncecessary.
				if (!jQueryIncremented) {
					jQ = $;
					$.readyWait += 1;
					jQueryIncremented = true;
				}
			}
		});
		
		// once the current batch is done, fire ready if it hasn't already been done
		steal.bind('end', function(){
			if (jQueryIncremented && !ready) {
				jQ.ready(true);
				ready = true;
			}
		})

		
	})();
	
	// =============================== ERROR HANDLING ===============================
	
	steal.p.load = after(steal.p.load, function(stel){
		if(win.document && !this.completed && !this.completeTimeout && !steal.isRhino &&
			(this.options.protocol == "file:" || !support.error)){
			var self = this;
			this.completeTimeout = setTimeout(function(){
				throw "steal.js : "+self.options.src+" not completed"
			},5000);
		}
	});
	steal.p.complete = after(steal.p.complete, function(){
		this.completeTimeout && clearTimeout(this.completeTimeout)
	})
	
	
	// =============================== AOP ===============================
	function before(f, before, changeArgs){
		return changeArgs ? 
			function before_changeArgs(){
				return f.apply(this,before.apply(this,arguments));
			}:
			function before_args(){
				before.apply(this,arguments);
				return f.apply(this,arguments);
			}
	}
	/**
	 * Set up a function that runs after the first param. 
	 * @param {Object} f
	 * @param {Object} after
	 * @param {Object} changeRet If true, the result of the function will be passed to the after function as the first param.  If false, the after function's params are the 
	 * same as the original function's params
	 */
	function after(f, after, changeRet){
		
		return changeRet ?
			function after_CRet(){
				return after.apply(this,[f.apply(this,arguments)].concat(makeArray(arguments)));
			}:
			function after_Ret(){
				var ret = f.apply(this,arguments);
				after.apply(this,arguments);
				return ret;
			}
	}
	
	// converts a function to work with when
	function convert(ob, func){
			
		var oldFunc = ob[func];
		
		// if we don't have callbacks
		if(!ob[func].callbacks){
			//replace start with a function that will call ob2's method
			ob[func] = function(){
				var me = arguments.callee,
					ret;
				
				// call the original function
				ret = oldFunc.apply(ob,arguments);
				
				var cbs = me.callbacks,
					len = cbs.length;
				
				//mark as called so any callees added to this caller will
				//automatically get called
				me.called = true;
				// call other callbacks
				for(var i =0; i < len; i++){
					cbs[i].called()
				}
				return ret;
				
			}
			ob[func].callbacks = [];
		}

		return ob[func];
	};
	
	// maintains 
	function join(obj, meth){
		this.obj = obj;
		this.meth = meth;
		convert(obj, meth);
		this.calls = 0
	};
	
	extend(join.prototype,{
		called : function(){
			this.calls--;
			this.go();
		},
		// adds functions that will call this join
		add : function(obj, meth){
			// converts the function to be able to call 
			// this join
			var f = convert(obj, meth);
			if(!f.called){
				
				// adds us to the callback ... the callback will call
				// called
				f.callbacks.push(this);
				this.calls++;
			}
		},
		// call go every time the funtion is called
		
		go : function(){
			if(this.calls === 0){
				this.obj[this.meth]()
			}
		}
	})
	// chains two functions.  When the first one is called,
	//   it calls the second function.
	//   If the second function has multiple callers, it waits until all have been called
	// 
	//   when(parent,"start", steal, "start")
	//
	function when(){
		// handle if we get called with a function
		var args = makeArray(arguments),
			last = args[args.length -1];
			
		if(typeof last === 'function' ){
			args[args.length -1] = {
				'fn' : last
			}
			args.push("fn");
		};
		
		var waitMeth = args.pop(), 
			waitObj = args.pop(),
			joined = new join(waitObj, waitMeth); 
		
		for(var i =0; i < args.length; i = i+2){
			joined.add(args[i], args[i+1])
		}
		
		// call right away if it should
		joined.go();
	}
	
	// =========== DEBUG =========
	
	/*var name = function(stel){
		if(stel.options && stel.options.type == "fn"){
			return stel.options.orig.toString().substr(0,50)
		}
		return stel.options ? stel.options.rootSrc : "CONTAINER"
	}

	
	steal.p.load = before(steal.p.load, function(){
		console.log("load", name(this), this.loading, this.id)
	})
	
	steal.p.loaded = before(steal.p.loaded, function(){
		console.log("loaded", name(this), this.id)
	})
	steal.p.complete = before(steal.p.complete, function(){
		console.log("complete", name(this), this.id)
	})*/

	// ============= WINDOW LOAD ========
	var addEvent = function(elem, type, fn) {
		if ( elem.addEventListener ) {
			elem.addEventListener( type, fn, false );
		} else if ( elem.attachEvent ) {
			elem.attachEvent( "on" + type, fn );
		} else {
			fn();
		}
	};
	var loaded = {
		load : function(){},
		end : function(){}
	};
	
	var firstEnd = false;
	addEvent(win, "load", function(){
		loaded.load();
	});
	steal.one("end", function(collection){
		loaded.end();
		firstEnd = collection;
		steal.trigger("done", firstEnd)
	})
	when(loaded,"load",loaded,"end", function(){
		steal.trigger("ready")
		steal.isReady = true;
	});
	
	steal.events.done = {
		add : function(cb){
			if(firstEnd){
				cb(firstEnd);
				return false;
			} else {
				return cb;
			}
		}
	};
	
	// =========== HAS ARRAY STUFF ============
	// Logic that deals with files that have collections of other files within them.  This is usually a production.css file, 
	// which when it loads, needs to mark several CSS and LESS files it represents as being "loaded".  This is done 
	// by the production.js file having steal({src: "production.css", has: ["file1.css", "file2.css"]  
	
	// after a steal is created, if its been loaded already and has a "has", mark those files as loaded
	steal.p.make = after(steal.p.make, function(stel){
		// if we have things
		if( stel.options.has ) {
			// if we have loaded this already (and we are adding has's)
			if( stel.isLoaded ) {
				stel.loadHas();
			} else {
				// have to mark has as loading 
				steal.loading.apply(steal,stel.options.has)
			}
		}
		return stel;
	}, true)
	
	// if we're about to mark a file as loaded, mark its "has" array files as loaded also
	steal.p.loaded = before(steal.p.loaded, function(){
		if(this.options.has){
			this.loadHas();
		}
	})

	steal.p.
		/**
		 * @hide
		 * Goes through the array of files listed in this.options.has, marks them all as loaded.  
		 * This is used for files like production.css, which, once they load, need to mark the files they 
		 * contain as loaded.
		 */
		loadHas = function(){
			var stel, i,
				current = File.cur();
			
			// mark everything in has loaded
			for(i=0; i<this.options.has.length; i++){
				// don't want the current file to change, since we're just marking files as loaded
				File.cur(current)
				stel = steal.p.make( this.options.has[i] );
				// need to set up a "complete" callback for this file, so later waits know its already 
				// been completed
				convert(stel, "complete")
				stel.loaded();
				
			}
		}
	
	// =========== INTERACTIVE STUFF ===========
	// Logic that deals with making steal work with IE.  IE executes scripts out of order, so in order to tell which scripts are 
	// dependencies of another, steal needs to check which is the currently "interactive" script.
	

var interactiveScript, 
	// key is script name, value is array of pending items
	interactives = {},
	getInteractiveScript = function(){
		var i, script,
		  scripts = doc[STR_GET_BY_TAG]('script');
		for (i = scripts.length - 1; i > -1 && (script = scripts[i]); i--) {
			if (script.readyState === 'interactive') {
				return script;
			}
		}
	},
	getCachedInteractiveScript = function() {
		var scripts, i, script;
		if (interactiveScript && interactiveScript.readyState === 'interactive') {
			return interactiveScript;
		}
		
		if(script = getInteractiveScript()){
			interactiveScript = script;
			return script;
		}
		
		// check last inserted
		if(lastInserted && lastInserted.readyState == 'interactive'){
			return lastInserted;
		}
	
		return null;
	};
	
support.interactive = doc && !!getInteractiveScript();


if (support.interactive) {

	// after steal is called, check which script is "interactive" (for IE)
	steal.after = after(steal.after, function(){
		var interactive = getCachedInteractiveScript();
		// if no interactive script, this is a steal coming from inside a steal, let complete handle it
		if (!interactive || !interactive.src || /steal\.(production|production\.[a-zA-Z0-9\-\.\_]*)*js/.test(interactive.src)) {
			return;
		}
		// get the source of the script
		var src = interactive.src;
		// create an array to hold all steal calls for this script
		if (!interactives[src]) {
			interactives[src] = []
		}
		// add to the list of steals for this script tag
		if (src) {
			interactives[src].push.apply(interactives[src], pending);
			pending = [];
		}
	})
	
	// This is used for packaged scripts.  As the packaged script executes, we grab the 
	// dependencies that have come so far and assign them to the loaded script
	steal.preloaded = before(steal.preloaded, function(stel){
		// get the src name
		var src = stel.options.src,
			// and the src of the current interactive script
			interactiveSrc = getCachedInteractiveScript().src;
		
		
		interactives[src] = interactives[interactiveSrc];
		interactives[interactiveSrc] = null;
	});
	
}
	
	// ===========  OPTIONS ==========
	
	var stealCheck  = /steal\.(production\.)?js.*/,
		getStealScriptSrc = function(){
			if(!doc){
				return;
			}
			var scripts = doc[STR_GET_BY_TAG]("script"),
				i = 0,
				len = scripts.length;
	
			
			//find the steal script and setup initial paths.
			for ( ; i < len; i++ ) {
				var src = scripts[i].src;
				if ( src && stealCheck.test(src) ) { //if script has steal.js
					return scripts[i];
				}
	
			}
			return;
		};
	steal.getScriptOptions = function(script){
			var script = script || getStealScriptSrc(),
				src,
				scriptOptions,
				options = {},
				commaSplit;
				
			if(script){
				var src = script.src,
					start =  src.replace(stealCheck,"");
				if(/steal\/$/.test(start)){
					options.rootUrl = start.substr(0, start.length - 6);
				} else {
					options.rootUrl = start+"../"
				}
				if ( /steal\.production\.js/.test(src) ) {
					options.env = "production";
				}
				if ( src.indexOf('?') !== -1 ) {
					
					scriptOptions = src.split('?')[1];
					commaSplit = scriptOptions.split(",");
					
					if ( commaSplit[0] ) {
						options.startFile = commaSplit[0];
					} 
					if ( commaSplit[1] && steal.options.env != "production" ) {
						options.env = commaSplit[1];
					}
					
				}
			
			}
			return options;
		};
	
	startup = after(startup, function(){
			var options = steal.options, 
				startFiles = [];
			extend(options, steal.getScriptOptions());
			// a steal that existed before this steal
			if(typeof oldsteal == 'object'){
				extend(options, oldsteal);
			}
			
			// if it looks like steal[xyz]=bar, add those to the options
			var search = win.location && decodeURIComponent(win.location.search);
			search && search.replace(/steal\[([^\]]+)\]=([^&]+)/g, function( whoe, prop, val ) {
				// support array like params
				var commaSeparated = val.split(",");
				if(commaSeparated.length > 1){
					val = commaSeparated;
				}
				options[prop] = val;
			});
			
			// CALCULATE CURRENT LOCATION OF THINGS ...
			steal.rootUrl(options.rootUrl);
			
			// CLEAN UP OPTIONS
			// make startFile have .js ending
			if(options.startFile && options.startFile.indexOf(".") == '-1'){
				options.startFile = options.startFile + "/" + options.startFile.match(/[^\/]+$/)[0] + ".js";
			}
			
			if(!options.logLevel){
				options.logLevel = 0;
			}

			//calculate production location;
			if (!options.production && options.startFile ) {
				options.production = File(options.startFile).dir() + '/production.js';
			}
			if ( options.production ) {
				options.production = options.production + (options.production.indexOf('.js') == -1 ? '.js' : '');
			}
			each(options.loaded || [], function(i, stel){
				steal.loaded(stel)
			})
			
			if(typeof options.startFiles === "string"){
				startFiles.push(options.startFiles);
			}
			else if(options.startFiles && options.startFiles.length){
				startFiles = options.startFiles;
			}
			var steals = [];
			// need to load startFiles in dev or production mode (to run funcunit in production)
			if( startFiles.length ){
				steal.options.startFiles = startFiles;
				steals.push.apply(steals, startFiles)
			}
			// either instrument is in this page (if we're the window opened from steal.browser), or its opener has it
			if ( options.instrument || (!options.browser && win.top && win.top.opener && 
					win.top.opener.steal && win.top.opener.steal.options.instrument) ) {
				// force startFiles to load before instrument
				steals.push(function(){}, {
					src: "steal/instrument",
					waits: true
				});
			}
			//we only load things with force = true
			if (options.env == 'production' && options.loadProduction) {
				if (options.production) {
					//steal(steal.options.startFile);
					steal({
						src: options.production,
						force: true
					});
				}
			}
			else {
				if (options.loadDev !== false) {
					steals.unshift({
						src: 'steal/dev/dev.js',
						ignore: true
					});
				}
				
				if (options.startFile) {
					steals.push(options.startFile)
				}
			}
			if (steals.length) {
				steal.apply(null, steals);
			}
	});
	
	
	steal.when = when;
	// make steal public
	win.steal = steal;
	
	startup();
	
})()