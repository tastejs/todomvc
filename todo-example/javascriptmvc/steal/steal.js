/*
 * JavaScriptMVC - steal.js
 * (c) 2010 Jupiter JavaScript Consulting
 * 
 * steal provides dependency management
 * steal('path/to/file').then(function(){
 *   //do stuff with file
 * })
 */

/*jslint evil: true */
/*global steal: true, window: false */
//put everything in function to keep space clean
(function() {

	if ( typeof steal != 'undefined' && steal.nodeType ) {
		throw ("steal is defined an element's id!");
	}

	// HELPERS (if you are trying to understand steal, skip this part)
	// keep a reference to the old steal
	var oldsteal = window.steal,
		// returns the document head (creates one if necessary)
		head = function() {
			var d = document,
				de = d.documentElement,
				heads = d.getElementsByTagName("head");
			if ( heads.length > 0 ) {
				return heads[0];
			}
			var head = d.createElement('head');
			de.insertBefore(head, de.firstChild);
			return head;
		},
		// creates a script tag
		scriptTag = function() {
			var start = document.createElement('script');
			start.type = 'text/javascript';
			return start;
		},
		extend = function( d, s ) {
			for ( var p in s ) {
				d[p] = s[p];
			}
			return d;
		},
		getLastPart = function( p ) {
			return p.match(/[^\/]+$/)[0];
		},
		browser = {
			msie: !! (window.attachEvent && !window.opera),
			opera: !! window.opera,
			safari: navigator.userAgent.indexOf('AppleWebKit/') > -1,
			firefox: navigator.userAgent.indexOf('Gecko') > -1 && navigator.userAgent.indexOf('KHTML') == -1,
			mobilesafari: !! navigator.userAgent.match(/Apple.*Mobile.*Safari/),
			rhino: navigator.userAgent.match(/Rhino/) && true
		},
		factory = function() {
			return window.ActiveXObject ? new ActiveXObject("Microsoft.XMLHTTP") : new XMLHttpRequest();
		},
		// writes a steal to the page in a way that steal.end gets called after the script gets run
		insert = function( options ) {
			// source we need to know how to get to steal, then load 
			// relative to path to steal
			options = extend({
				id: options.src && steal.cleanId(options.src)
			}, options);

			var text = "",
				scriptTag = '<script ',
				bodyText;
			if ( options.src ) {
				var src_file = steal.File(options.src);
				if (!src_file.isLocalAbsolute() && !src_file.protocol() ) {
					options.src = steal.root.join(options.src);
				}
			}


			if ( options.type && options.process ) {
				text = steal.request(options.src);
				if (!text ) {
					throw "steal.js there is nothing at " + options.src;
				}
				bodyText = options.process(text);
				options.type = 'text/javascript';
				delete options.process;
				delete options.src;

			} else if ( options.type && options.type != 'text/javascript' && !browser.rhino ) {
				text = steal.request(options.src);
				if (!text ) {
					throw "steal.js there is nothing at " + options.src;
				}
				options.text = text;
				delete options.src;
			}

			for ( var attr in options ) {
				scriptTag += attr + "='" + options[attr] + "' ";
			}
			if ( steal.support.load && !steal.browser.rhino && !bodyText ) {
				scriptTag += steal.loadErrorTimer(options);
			}
			scriptTag += '>' + (bodyText || '') + '</script>';
			if ( steal.support.load && !browser.msie) {
				scriptTag += '<script type="text/javascript"' + '>steal.end()</script>';
			}
			else { // this is here b/c IE will run a script above right away (before the script above it loads)
				scriptTag += '<script type="text/javascript" src="' + steal.root.join('steal/end.js') + '"></script>';
			}
			document.write((options.src || bodyText ? scriptTag : ''));
		};

	/**
	 * @class steal
	 * @parent stealjs
	 * <p>Steal makes JavaScript dependency management and resource loading easy.</p>
	 * <p>This page details the steal script (<code>steal/steal.js</code>), 
	 * and steal function which are used to load files into your page.  
	 * For documentation of other Steal projects, read [stealjs StealJS].</p>
	 * <h3>Quick Overview</h3>
	 * 
	 * <p>To start using steal, add the steal script to your page, and tell it the first
	 * file to load:</p>
	 * </p>
	 * @codestart html
	 *&lt;script type='text/javascript'
	 *        src='public/steal/steal.js?<u><b>myapp/myapp.js</b></u>'>&lt;/script>
	 * @codeend
	 * 
	 * <p>In the file (<code>public/myapp/myapp.js</code>), 
	 * 'steal' all other files that you need like:</p>
	 * @codestart
	 * steal("anotherFile")           //loads myapp/anotherFiles.js
	 *    .css('style')               //      myapp/style.css
	 *    .plugins('jquery/view',     //      jquery/view/view.js
	 *             'steal/less')      //      steal/less/less.js
	 *    .then(function(){           //called when all prior files have completed
	 *       steal.less('myapp')      //loads myapp/myapp.less
	 *    })
	 *    .views('//myapp/show.ejs')  //loads myapp/show.ejs
	 * @codeend
	 * <p>Finally compress your page's JavaScript and CSS with:</p>
	 * @codestart
	 * > js steal/buildjs path/to/mypage.html
	 * @codeend
	 * <h2>Use</h2>
	 * Use of steal.js is broken into 5 parts:
	 * <ul>
	 * <li>Loading steal.js </li> 
	 *  <li>Loading your 'application' file.</li>
	 *    <li>"Stealing" scripts</li>
	 *    <li>Building (Concatenating+Compressing) the app</li>
	 *    <li>Switching to the production build</li>
	 * </ul>
	 * 
	 * 
	 * <h3>Loading <code>steal.js</code></h3>
	 * <p>First, you need to [download download JavaScriptMVC] (or steal standalone) and unzip it into a
	 *    public folder on your server.  For this example, lets assume you have the steal script in
	 *    <code>public/steal/steal.js</code>.   
	 * </p>
	 * <p>Next, you need to load the <code>steal.js</code> script in your html page.  We suggest 
	 *    [http://developer.yahoo.com/performance/rules.html#js_bottom bottom loading] your scripts.
	 *    For example, if your page is in <code>pages/myapp.html</code>, you can get steal like:
	 * </p>
	 * @codestart html
	 * &lt;script type='text/javascript'
	 *     src='../public/steal/steal.js'>
	 * &lt;/script>
	 * @codeend
	 * <h3>Loading your 'application' file</h3>
	 * <p>The first file your application loads
	 * is referred to as an "application" file.  It loads all the files and resources
	 * that your application needs.  For this example, we'll put our application file in:
	 * <code>public/myapp/myapp.js</code>
	 * </p>
	 * <p>You have to tell steal where to find it by configuring [steal.static.options].
	 * There are a lot of ways to configure steal to load your app file, but we've made it really easy:</p>
	 * @codestart html
	 * &lt;script type='text/javascript'
	 *     src='../public/steal/steal.js?<u><b>myapp/myapp.js</b></u>'>
	 * &lt;/script>
	 * @codeend
	 * This sets ...
	 * @codestart
	 * steal.options.startFile = 'myapp/myapp.js'
	 * @codeend
	 * 
	 * ... and results in steal loading 
	 * <code>public/myapp/myapp.js</code>.</p>
	 * 
	 * <div class='whisper'>
	 *    TIP: If startFile doesn't end with <code>.js</code> (ex: myapp), steal assumes
	 *    you are using JavaScriptMVC's folder pattern and will load:
	 *    <code>myapp/myapp.js</code> just to save you 9 characters.
	 * </div>
	 * <h3>Stealing Scripts</h3>
	 * In your files, use the steal function and its helpers
	 *  to load dependencies then describe your functionality.
	 * Typically, most of the 'stealing' is done in your application file.  Loading 
	 * jQuery and jQuery.UI from google, a local helpers.js 
	 * and then adding tabs might look something like this:
	 * @codestart
	 * steal( 'http://ajax.googleapis.com/ajax/libs/jquery/1.4.2/jquery.js',
	 *        'http://ajax.googleapis.com/ajax/libs/jqueryui/1.8.0/jquery-ui.js',
	 *        'helpers')
	 * .then( function(){
	 *   $('#tabs').tabs();
	 * });
	 * @codeend
	 * 
	 * There's a few things to notice:
	 * 
	 *   - the steal function can take multiple arguments.  Each argument 
	 *    can be a string, object, or function.  Learn more about what can be passed to 
	 *    steal in the [steal.prototype.init] documentation. 
	 *   - steal can load cross domain</li>
	 *   - steal loads relative to the current file</li>
	 *   - steal adds .js if not present</li>
	 *   - steal is chainable (most function return steal)
     * 
	 * ### Building the app
	 * 
	 * Building the app means combining and compressing your apps JavaScript and CSS into a single file.
	 * A lot more details can be found on building in the 
	 * [steal.build steal.build documentation].  But, if you used JavaScriptMVC's app or plugin
	 * generator, you can build
	 * your app's JS and CSS with:
	 * 
	 * 
	 * @codestart no-highlight
	 * js myapp\scripts\compress.js
	 * @codeend
	 * 
	 * Or if you are using steal without JavaScriptMVC:
	 * 
	 * @codestart no-highlight
	 * js steal/buildjs pages/myapp.html -to public/myapp
	 * @codeend
	 * 
	 * This creates <code>public/myapp/production.js</code> and <code>public/myapp/production.css</code>.
	 * 
	 * ### Switching to the production build
	 * 
	 * To use the production files, load steal.production.js instead of steal.js in your html file:
	 * 
	 * @codestart html
	 * &lt;script type='text/javascript'
	 *         src='../public/steal/<u><b>steal.production.js</b></u>?myapp/myapp.js'>
	 * &lt;/script>
	 * @codeend
	 * 
	 * ## Steal helpers
	 * 
	 * There are a number of steal helper functions that can be used to load files in a particular location
	 * or of a type other than JavaScript:
	 * 
	 *  * [steal.static.coffee] - loads  
	 *     [http://jashkenas.github.com/coffee-script/ CoffeeScript] scripts.
	 *  * [steal.static.controllers] - loads controllers relative to the current path.
	 *  * [steal.static.css] - loads a css file.
	 *  * [steal.static.less] - loads [http://lesscss.org/ Less] style sheets.
	 *  * [steal.static.models] - loads models relative to the current path.
	 *  * [steal.static.plugins] - loads JavaScript files relative to steal's root folder.
	 *  * [steal.static.resources] - loads a script in a relative resources folder.
	 *  * [steal.static.views] - loads a client side template to be compiled into the production build.
	 * 
	 * ## Script Load Order
	 * 
	 * The load order for your scripts follows a consistent last-in first-out order across all browsers. 
	 * This is the same way the following document.write would work in msie, Firefox, or Safari:
	 * @codestart
	 * document.write('&lt;script type="text/javascript" src="some_script.js"></script>')
	 * @codeend
	 * An example helps illustrate this.<br/>
	 * <img src='http://wiki.javascriptmvc.com/images/last_in_first_out.png'/>
	 * <table class="options">
	 * <tr class="top">
	 * <th>Load Order</th>
	 * <th class="right">File</th>
	 * </tr>
	 * <tbody>
	 * <tr>
	 * <td>1</td>
	 * <td class="right">1.js</td>
	 * </tr>
	 * <tr>
	 * <td>2</td>
	 * <td class="right">3.js</td>
	 * </tr>
	 * <tr>
	 * <td>3</td>
	 * <td class="right">4.js</td>
	 * </tr>
	 * <tr>
	 * <td>4</td>
	 * <td class="right">2.js</td>
	 * </tr>
	 * <tr>
	 * <td>5</td>
	 * <td class="right">5.js</td>
	 * </tr>
	 * <tr class="bottom">
	 * <td>6</td>
	 * <td class="right">6.js</td>
	 * </tr>
	 *</tbody></table>
	 * @constructor 
	 * Loads files or runs functions after all previous files and functions have been loaded.
	 * @param {String|Object|Function+} resource Each argument represents a resource or function.
	 * Arguments can be a String, Object, or Function.
	 * <table class='options'>
	 *  <tr>
	 *  <th>Type</th><th>Description</th>
	 *  </tr>
	 *  <tr><td>String</td>
	 * <td>A path to a JavaScript file.  The path can optionally end in '.js'.<br/>  
	 * Paths are typically assumed to be relative to the current JavaScript file. But paths, that start
	 * with: 
	 * <ul>
	 * <li><code>http(s)://</code> are absolutely referenced.</li>
	 * <li><code>/</code> are referenced from the current domain.</li>
	 * <li><code>//</code> are referenced from the ROOT folder.</li>
	 * 
	 * </td></tr>
	 *  <tr><td>Object</td>
	 *  <td>An Object with the following properties:
	 *  <ul>
	 *  <li>path {String} - relative path to a JavaScript file.  </li>
	 *  <li>type {optional:String} - Script type (defaults to text/javascript)</li>
	 *  <li>skipInsert {optional:Boolean} - Include not added as script tag</li>
	 *  <li>compress {optional:String} - "false" if you don't want to compress script</li>
	 *  <li>package {optional:String} - Script package name (defaults to production.js)</li> 
	 *  </ul>
	 *  </td></tr>
	 *  <tr><td>Function</td><td>A function to run after all the prior steals have finished loading</td></tr>
	 * </table>
	 * @return {steal} returns itself for chaining.
	 */
	steal = function() {
		for ( var i = 0; i < arguments.length; i++ ) {
			steal.add(new steal.fn.init(arguments[i]));
		}
		return steal;
	};

	(function() {
		var eventSupported = function( eventName, tag ) {
			var el = document.createElement(tag);
			eventName = "on" + eventName;

			var isSupported = (eventName in el);
			if (!isSupported ) {
				el.setAttribute(eventName, "return;");
				isSupported = typeof el[eventName] === "function";
			}
			el = null;
			return isSupported;
		};
		steal.support = {
			load: eventSupported("load", "script"),
			readystatechange: eventSupported("readystatechange", "script"),
			error: eventSupported("readystatechange", "script")
		};
	})();


	steal.fn = steal.prototype = {
		// sets up a steal instance and records the current path, etc
		init: function( options ) {
			if ( typeof options == 'function' ) {
				var path = steal.getCurrent();
				this.path = path;
				this.func = function() {
					steal.curDir(path);
					options(steal.send || window.jQuery || steal); //should return what was steald before 'then'
				};
				this.options = options;
				return;
			}
			if ( typeof options == 'string' ) {
				if (/\.js$/i.test(options) ) {
					options = {
						path: options
					};
				} else {
					options = {
						path: options + '.js'
					};
				}
			}
			extend(this, options);

			this.options = options; //TODO: needed?
			this.originalPath = this.path;

			//get actual path
			var pathFile = steal.File(this.path);

			this.path = pathFile.normalize();
			if ( this.originalPath.match(/^\/\//) ) {
				this.absolute = steal.root.join(this.originalPath.substr(2));
			}
			else {
				this.absolute = pathFile.relative() ? pathFile.joinFrom(steal.getAbsolutePath(), true) : this.path;
			}

			this.dir = steal.File(this.path).dir();
		},
		/**
		 * Adds a script tag to the dom, loading and running the steal's JavaScript file.
		 * @hide
		 */
		run: function() {
			//set next to current so other includes will be added to it
			steal.cur(this);
			//only load if actually pulled, this helps us mark only once
			this.dependencies = [];
			var isProduction = (steal.options.env == "production"),
				options = extend({
					type: "text/javascript",
					compress: "true",
					"package": "production.js"
				}, extend({
					src: this.path
				}, this.options));

			if ( this.func ) {
				//console.log("run FUNCTION")
				//run function and continue to next steald
				this.func();
				steal.end();
			} else if (!isProduction || this.force ) { //force is for packaging
				//console.log("run INSERT",this.path)
				if ( this.type ) {
					insert(options);
				} else {
					steal.curDir(this.path);
					insert(this.skipInsert ? undefined : options);
				}
			} else {
				//console.log("run VIRTUAL ",this.path)
				if (!this.type ) {
					steal.curDir(this.path);
				}
			}

		},
		/**
		 * Loads the steal code immediately.  This is typically used after DOM has loaded.
		 * @hide
		 */
		runNow: function() {
			steal.curDir(this.path);

			return browser.rhino ? load(this.path) : steal.insertHead(steal.root.join(this.path));
		}

	};
	steal.fn.init.prototype = steal.fn;
	//where the root steal folder is
	steal.root = null;
	//where the page is
	steal.pageDir = null;
	//provide extend to others
	steal.extend = extend;
	//save a reference to the browser
	steal.browser = browser;


	/**
	 * @class
	 * Used for getting information out of a path
	 * @constructor
	 * Takes a path
	 * @param {String} path 
	 */
	steal.File = function( path ) {
		if ( this.constructor != steal.File ) {
			return new steal.File(path);
		}
		this.path = path;
	};
	var File = steal.File;
	extend(File.prototype,
	/* @prototype */
	{
		/**
		 * Removes hash and params
		 * @return {String}
		 */
		clean: function() {
			return this.path.match(/([^\?#]*)/)[1];
		},
		/**
		 * Returns everything before the last /
		 */
		dir: function() {
			var last = this.clean().lastIndexOf('/'),
				dir = (last != -1) ? this.clean().substring(0, last) : '',
				parts = dir !== '' && dir.match(/^(https?:\/|file:\/)$/);
			return parts && parts[1] ? this.clean() : dir;
		},
		/**
		 * Returns the domain for the current path.
		 * Returns null if the domain is a file.
		 */
		domain: function() {
			if ( this.path.indexOf('file:') === 0 ) {
				return null;
			}
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
		 * @codestart
		 * new steal.File('a/b.c').joinFrom('/d/e')//-> /d/e/a/b.c
		 * @codeend
		 * @param {String} url
		 * @param {Boolean} expand if the path should be expanded
		 * @return {String} 
		 */
		joinFrom: function( url, expand ) {
			var u = File(url);
			if ( this.protocol() ) { //if we are absolutely referenced
				//try to shorten the path as much as possible:
				if ( this.domain() && this.domain() == u.domain() ) {
					return this.afterDomain();
				}
				else if ( this.domain() == u.domain() ) { // we are from a file
					return this.toReferenceFromSameDomain(url);
				} else {
					return this.path;
				}

			} else if ( url == steal.pageDir && !expand ) {

				return this.path;

			} else if ( this.isLocalAbsolute() ) { // we are a path like /page.js
				if (!u.domain() ) {
					return this.path;
				}

				return u.protocol() + "//" + u.domain() + this.path;

			}
			else { //we have 2 relative paths, remove folders with every ../
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
		/**
		 * Joins the file to the current working directory.
		 */
		joinCurrent: function() {
			return this.joinFrom(steal.curDir());
		},
		/**
		 * Returns true if the file is relative
		 */
		relative: function() {
			return this.path.match(/^(https?:|file:|\/)/) === null;
		},
		/**
		 * Returns the part of the path that is after the domain part
		 */
		afterDomain: function() {
			return this.path.match(/https?:\/\/[^\/]*(.*)/)[1];
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
			for ( var i = 0; i < other_parts.length; i++ ) {
				result += '../';
			}
			return result + parts.join('/');
		},
		/**
		 * Is the file on the same domain as our page.
		 */
		isCrossDomain: function() {
			return this.isLocalAbsolute() ? false : this.domain() != File(window.location.href).domain();
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
		 */
		normalize: function() {

			var current = steal.curDir(),
				//if you are cross domain from the page, and providing a path that doesn't have an domain
				path = this.path;

			if (/^\/\//.test(this.path) ) { //if path is rooted from steal's root 
				path = this.path.substr(2);

			} else if ( this.relative() || (steal.isCurrentCrossDomain() && //if current file is on another domain and
			!this.protocol()) ) { //this file doesn't have a protocol
				path = this.joinFrom(current);

			}
			return path;
		}
	});
	/**
	 *  @add steal
	 */
	// break
	/* @static */
	//break
	/**
	 * @attribute pageDir
	 * @hide
	 * The current page's folder's path.
	 */
	steal.pageDir = File(window.location.href).dir();

	//find steal
	/**
	 * @attribute options
	 * Options that deal with steal
	 * <table class='options'>
	 * <tr>
	 *     <th>Option</th><th>Default</th><th>Description</th>
	 * </tr>
	 * <tr><td>env</td><td>development</td><td>Which environment is currently running</td></tr>
	 * <tr><td>encoding</td><td>utf-8</td><td>What encoding to use for script loading</td></tr>
	 * <tr><td>cacheInclude</td><td>true</td><td>true if you want to let browser determine if it should cache script; false will always load script</td></tr>
	 * 
	 * <tr><td>done</td><td>null</td><td>If a function is present, calls function when all steals have been loaded</td></tr>
	 * <tr><td>documentLocation</td><td>null</td><td>If present, ajax request will reference this instead of the current window location.  
	 * Set this in run_unit, to force unit tests to use a real server for ajax requests. </td></tr>
	 * <tr><td>logLevel</td><td>0</td><td>0 - Log everything<br/>1 - Log Warnings<br/>2 - Log Nothing</td></tr>
	 * <tr><td>startFile</td><td>null</td><td>This is the first file to load.  It is typically determined from the first script option parameter 
	 * in the inclue script. </td></tr>
	 * </table>
	 * <ul>
	 *    <li><code>steal.options.startFile</code> - the first file steal loads.  This file
	 *    loads all other scripts needed by your application.</li>
	 *    <li><code>steal.options.env</code> - the environment (development or production)
	 *     that determines if steal loads your all your script files or a single
	 *     compressed file.
	 *    </li>
	 * </ul>
	 * <p><code>steal.options</code> can be configured by:</p>
	 * <ul>
	 *    <li>The steal.js script tag in your page (most common pattern).</li>
	 *    <li>An existing steal object in the window object</li>
	 *    <li><code>window.location.hash</code></li>
	 * </ul>
	 * <p>
	 *    The steal.js script tag is by far the most common approach. 
	 *    For the other methods,
	 *    check out [steal.static.options] documentation.
	 *    To load <code>myapp/myapp.js</code> in development mode, your 
	 *    script tag would look like:
	 * </p>
	 * 
	 * @codestart
	 * &lt;script type='text/javascript'
	 *     src='path/to/steal.js?<u><b>myapp/myapp.js</b></u>,<u><b>development</b></u>'>
	 * &lt;/script>
	 * @codeend
	 * <div class='whisper'>
	 * Typically you want this script tag right before the closing body tag (<code>&lt;/body></code>) of your page.
	 * </div>
	 * <p>Note that the path to <code>myapp/myapp.js</code> 
	 * is relative to the 'steal' folder's parent folder.  This
	 * is typically called the JavaScriptMVC root folder or just root folder if you're cool.</p>
	 * <p>And since JavaScriptMVC likes folder structures like:</p>
	 * @codestart text
	 * \myapp
	 *    \myapp.js
	 * \steal
	 *    \steal.js
	 * @codeend
	 * <p>If your path doesn't end with <code>.js</code>, JavaScriptMVC assumes you are loading an 
	 * application and will add <code>/myapp.js</code> on for you.  This means that this does the same thing too:</p>
	 * @codestart
	 * &lt;script type='text/javascript'
	 *        src='path/to/steal.js?<u><b>myapp</b></u>'>&lt;/script>
	 * @codeend
	 * <div class='whisper'>Steal, and everything else in JavaScriptMVC, provide these little shortcuts
	 * when you are doing things 'right'.  In this case, you save 9 characters 
	 * (<code>/myapp.js</code>) by organizing your app the way, JavaScriptMVC expects.</div>
	 * </div>
	 */
	steal.options = {
		loadProduction: true,
		env: 'development',
		production: null,
		encoding: "utf-8",
		cacheInclude: true,
		logLevel: 0
	};

	// variables used while including
	var first = true,
		//If we haven't steald a file yet
		first_wave_done = false,
		//a list of all steald paths
		cwd = '',
		//  the current steal
		cur = null,
		//where we are currently including
		steals = [],
		//    
		current_steals = [],
		//steals that are pending to be steald
		total = [],
		//mapping of loaded css files
		css = {};
	extend(steal, {
		/**
		 * Sets options from script
		 * @hide
		 */
		setScriptOptions: function() {
			var scripts = document.getElementsByTagName("script"),
				scriptOptions, 
				commaSplit, 
				stealReg = /steal\.(production\.)?js/;

			//find the steal script and setup initial paths.
			for ( var i = 0; i < scripts.length; i++ ) {
				var src = scripts[i].src;
				if ( src && stealReg.test(src) ) { //if script has steal.js
					var mvc_root = File(File(src).joinFrom(steal.pageDir)).dir(),
						loc = /\.\.$/.test(mvc_root) ? mvc_root + '/..' : mvc_root.replace(/steal$/, '');

					if (/.+\/$/.test(loc) ) {
						loc = loc.replace(/\/$/, '');
					}

					if (/steal\.production\.js/.test(src) ) {
						steal.options.env = "production";
					}
					steal.root = File(loc);
					if ( src.indexOf('?') != -1 ) {
						scriptOptions = src.split('?')[1];
					}
					steal.options.evalAfter = /\w+/.test(scripts[i].text) && scripts[i].text
				}

			}

			//if there is stuff after ?
			if ( scriptOptions ) {
				// if it looks like steal[xyz]=bar, add those to the options
				if ( scriptOptions.indexOf('=') > -1 ) {
					scriptOptions.replace(/steal\[([^\]]+)\]=([^&]+)/g, function( whoe, prop, val ) {
						steal.options[prop] = val;
					});
				} else {
					//set with comma style
					commaSplit = scriptOptions.split(",");
					if ( commaSplit[0] && commaSplit[0].lastIndexOf('.js') > 0 ) {
						steal.options.startFile = commaSplit[0];
					} else if ( commaSplit[0] ) {
						steal.options.app = commaSplit[0];
					}
					if ( commaSplit[1] && steal.options.env != "production" ) {
						steal.options.env = commaSplit[1];
					}
				}

			}

		},
		setOldIncludeOptions: function() {
			extend(steal.options, oldsteal);
		},
		setHashOptions: function() {
			window.location.hash.replace(/steal\[(\w+)\]=(\w+)/g, function( whoe, prop, val ) {
				steal.options[prop] = val;
			});
		},
		/**
		 * Starts including files, sets options.
		 * @hide
		 */
		init: function() {
			this.setScriptOptions();
			//force into development mode to prevent errors
			if ( steal.browser.rhino ) {
				steal.options.env = 'development';
			}
			this.setOldIncludeOptions();
			this.setHashOptions();
			//clean up any options
			if ( steal.options.app ) {
				steal.options.startFile = steal.options.app + "/" + steal.options.app.match(/[^\/]+$/)[0] + ".js";
			}
			if ( steal.options.ignoreControllers ) {
				steal.controllers = function() {
					return steal;
				};
				steal.controller = function() {
					return steal;
				};
			}
			//calculate production location;
			if (!steal.options.production && steal.options.startFile ) {
				steal.options.production = "//" + File(steal.options.startFile).dir() + '/production';
			}
			if ( steal.options.production ) {
				steal.options.production = steal.options.production + (steal.options.production.indexOf('.js') == -1 ? '.js' : '');
			}
			//we only load things with force = true
			if ( steal.options.env == 'production' ) {
				
				// if we have a production script and we haven't been told not to load it
				if ( steal.options.production && steal.options.loadProduction ) {
					first = false; //makes it so we call close after
					//steal(steal.options.startFile);
					steal({
						path: steal.options.production,
						force: true
					});
				}

			} else {

				var current_path = steal.getCurrent();
				steal({
					path: 'steal/dev/dev.js',
					ignore: true
				});
				steal.curDir(current_path);




				//if you have a startFile load it
				if ( steal.options.startFile ) {
					first = false; //makes it so we call close after
					//steal(steal.options.startFile);
					steal._start = new steal.fn.init(steal.options.startFile);
					steal.add(steal._start);
				}

			}



			if ( steal.options.startFile ) {
				steal.start();
			}
		},
		/**
		 * Gets or sets the current directory your relative steals will reference.
		 * @param {String} [path] the new current directory path
		 * @return {String|steal} the path of the current directory or steal for chaining.
		 */
		curDir: function( path ) {
			if ( path !== undefined ) {
				cwd = path;
				return steal;
			} else {
				var dir = File(cwd).dir();
				//make sure it has a /
				return dir ? dir + (dir.lastIndexOf('/') === dir.length - 1 ? '' : '/') : dir;
			}

		},
		cur: function( steal ) {
			if ( steal !== undefined ) {
				return (cur = steal);
			} else {
				return cur;
			}
		},
		//is the current folder cross domain from our folder?
		isCurrentCrossDomain: function() {
			return File(steal.getAbsolutePath()).isCrossDomain();
		},
		getCurrent: function() {
			return cwd;
		},
		getAbsolutePath: function() {
			var dir = this.curDir(),
				fwd = File(this.curDir());
			return fwd.relative() ? fwd.joinFrom(steal.root.path, true) : dir;
		},
		// Adds a steal to the pending list of steals.
		add: function( newInclude ) {
			//If steal is a function, add to list, and unshift
			if ( typeof newInclude.func == 'function' ) {
				//console.log("add","FUNCTION")
				current_steals.unshift(newInclude); //add to the front
				return;
			}
			var cur = steal.cur(), 
				existing = steal.exists(newInclude);

			
			//if we have already performed loads, insert new steals in head
			//now we should check if it has already been steald or added earlier in this file
			if ( !existing ) {
				if ( cur ) {
					cur.dependencies.push(newInclude);
				}
				if ( first_wave_done ) {
					return newInclude.runNow();
				}
				//but the file could still be in the list of steals but we need it earlier, so remove it and add it here
				var path = newInclude.absolute || newInclude.path;
				for ( var i = 0; i < steals.length; i++ ) {
					if ( steals[i].absolute == path ) {
						steals.splice(i, 1);
						break;
					}
				}
				//console.log("add FILE",newInclude.path)
				current_steals.unshift(newInclude);
			}else{
				cur.dependencies.push(existing);
			}
		},
		//this should probably be kept as a hash.
		//returns the steal if the steal already exists
		exists: function( inc ) {
			var path = inc.absolute || inc.path,
				i;
			for ( i = 0; i < total.length; i++ ) {
				if ( total[i].absolute == path ) {
					return total[i];
				}
			}
			for ( i = 0; i < current_steals.length; i++ ) {
				if ( current_steals[i].absolute == path ) {
					return current_steals[i];
				}
			}
			return;
		},
		done: function() {
			if ( steal.options.evalAfter ){
				eval(steal.options.evalAfter);
			}
			if ( typeof steal.options.done == "function" ) {
				steal.options.done(total);
			}
		},
		// Called after every file is loaded.  Gets the next file and steals it.
		end: function( src ) {
			//prevents warning of bad includes
			clearTimeout(steal.timer);
			// add steals that were just added to the end of the list
			steals = steals.concat(current_steals);
			

			// take the last one
			var next = steals.pop();

			// if there are no more
			if (!next ) {
				first_wave_done = true;
				steal.done();
			} else {
				//add to the total list of things that have been steald, and clear current steals
				total.push(next);
				current_steals = [];
				next.run();

			}

		},

		/**
		 * Starts loading files.  This is useful when steal is being used without providing an initial file or app to load.
		 * You can steal files, but then call steal.start() to start actually loading them.
		 * 
		 * <h3>Example:</h3>
		 * @codestart html
		 * &lt;script src='steal/steal.js'>&lt;/script>
		 * &lt;script type='text/javascript'>
		 *    steal.plugins('controller')
		 *    steal.start();
		 * &lt;/script>
		 * @codeend
		 * The above code loads steal, then uses steal to load the plugin controller.
		 */
		start: function() {
			steal.end();
		},
		/**
		 * Loads css files from the given relative path.
		 * @codestart
		 * steal.css('mystyles') //loads mystyles.css
		 * @codeend
		 * Styles loaded in this way will be compressed into a single style.
		 * @param {String+} relative URL(s) to stylesheets
		 * @return {steal} steal for chaining
		 */
		css: function() {
			//if production, 
			if ( steal.options.env == 'production' ) {
				if ( steal.loadedProductionCSS ) {
					return steal;
				} else {
					var productionCssPath = steal.File(steal.options.production.replace(".js", ".css")).normalize();
					productionCssPath = steal.root.join(productionCssPath);
					steal.createLink(productionCssPath);
					steal.loadedProductionCSS = true;
					return steal;
				}
			}
			var current;
			for ( var i = 0; i < arguments.length; i++ ) {
				current = steal.root.join( File(arguments[i] + ".css").joinCurrent() );
				if(!css[current]){
					steal.createLink(current);
					css[current] = true;
				}
				
			}
			return this;
		},
		/**
		 * Creates a css link and appends it to head.
		 * @hide
		 * @param {Object} location
		 * @return {HTMLLinkElement}
		 */
		createLink: function( location, options ) {
			options = options || {};
			var link = document.createElement('link');
			link.rel = options.rel || "stylesheet";
			link.href = location;
			link.type = options.type || 'text/css';
			head().appendChild(link);
			return link;
		},
		/**
		 * @hide
		 * Synchronously requests a file.  This is here to read a file for other types.	 * 
		 * @param {String} path path of file you want to load
		 * @param {optional:String} content_type optional content type
		 * @return {String} text of file
		 */
		request: function( path, content_type ) {
			var contentType = (content_type || "application/x-www-form-urlencoded; charset=" + steal.options.encoding),
				request = factory();
			request.open("GET", path, false);
			request.setRequestHeader('Content-type', contentType);
			if ( request.overrideMimeType ) {
				request.overrideMimeType(contentType);
			}

			try {
				request.send(null);
			}
			catch (e) {
				return null;
			}
			if ( request.status === 500 || request.status === 404 || request.status === 2 || (request.status === 0 && request.responseText === '') ) {
				return null;
			}
			return request.responseText;
		},
		/**
		 * Inserts a script tag in head with the encoding.
		 * @hide
		 * @param {Object} src
		 * @param {Object} encode
		 */
		insertHead: function( src, encode, type, text, id ) {
			encode = encode || "UTF-8";
			var script = scriptTag();
			if ( src ) {
				script.src = src;
			}
			if ( id ) {
				script.id = id;
			}
			script.charset = encode;
			script.type = type || "text/javascript";
			if ( text ) {
				script.text = text;
			}
			head().appendChild(script);
		},
		write: function( src, encode ) {
			encode = encode || "UTF-8";
			document.write('<script type="text/javascript" src="' + src + '" encode="+encode+"></script>');
		},
		resetApp: function( f ) {
			return function( name ) {
				var current_path = steal.getCurrent();
				steal.curDir("");
				if ( name.path ) {
					name.path = f(name.path);
				} else {
					name = f(name);
				}
				steal(name);
				steal.curDir(current_path);
				return steal;
			};
		},
		callOnArgs: function( f ) {
			return function() {
				for ( var i = 0; i < arguments.length; i++ ) {
					f(arguments[i]);
				}
				return steal;
			};

		},
		// Returns a function that applies a function to a list of arguments.  Then steals those
		// arguments.
		applier: function( f ) {
			return function() {
				var args = [];
				for ( var i = 0; i < arguments.length; i++ ) {
					if ( typeof arguments[i] == "function" ) {
						args[i] = arguments[i];
					} else {
						args[i] = f(arguments[i]);
					}

				}
				steal.apply(null, args);
				return steal;
			};
		},
		/**
		 * @function then
		 * A chainable alias for [steal].
		 */
		then: steal,
		total: total
	});
	var stealPlugin = steal.resetApp(function( p ) {
		return p + '/' + getLastPart(p);
	});
	steal.packs = function() {
		for ( var i = 0; i < arguments.length; i++ ) {
			if ( typeof arguments[i] == "function" ) {
				steal(arguments[i]);
			} else {
				steal({
					force: true,
					path: "//packages/" + arguments[i] + ".js"
				});
			}
		}
		return this;
	};

	extend(steal, {

		/**
		 * @function plugins
		 * Loads a list of plugins given a path relative to steal's ROOT folder.
		 * 
		 * Steal.plugins is used to load relative to ROOT no matter where the current file is 
		 * located.  For example, if you want to load the 'foo/bar' plugin that is located like:
		 * 
		 * @codestart
		 * steal\
		 * foo\
		 *    bar\
		 *       bar.js
		 * @codeend
		 * 
		 * You can load it like:
		 * 
		 * @codestart
		 * steal.plugins('foo/bar');
		 * @codeend
		 * 
		 * It should be noted that plugins always looks for a JS file that shares the name of the
		 * plugin's folder (bar.js is in bar).
		 * 
		 * @param {String} plugin_location location of a plugin, ex: jquery/dom/history.
		 * @return {steal} a new steal object
		 * 
		 */
		plugins: steal.callOnArgs(stealPlugin),


		/**
		 * @function controllers
		 * Loads controllers from the current file's <b>controllers</b> directory.
		 * <br>
		 * <code>steal.controllers</code> adds the suffix <code>_controller.js</code> to each name passed in.
		 * <br>
		 * <br>
		 * Example:
		 * <br>
		 * If you want to load controllers/recipe_controller.js and controllers/ingredient_controller.js,
		 * write:
		 * @codestart 
		 *  steal.controllers('recipe',
		 *                    'ingredient')
		 * @codeend
		 * @param {String+} controller the name of of the {NAME}_controller.js file to load. You can pass multiple controller names.
		 * @return {steal} the steal function for chaining.    
		 */
		controllers: steal.applier(function( i ) {
			if ( i.match(/^\/\//) ) {
				i = steal.root.join(i.substr(2));
				return i;
			}
			return 'controllers/' + i + '_controller';
		}),

		/**
		 * @function models
		 * Loads models  from the current file's <b>models</b> directory.
		 * <br>
		 * <br>
		 * Example:
		 * <br>
		 * If you want to include models/recipe.js and models/ingredient.js,
		 * write:
		 * @codestart 
		 *  steal.models('recipe',
		 *               'ingredient')
		 * @codeend
		 * @param {String+} model The name of the model file you want to load.  You can pass multiple model names.
		 * @return {steal} the steal function for chaining.
		 */
		models: steal.applier(function( i ) {
			if ( i.match(/^\/\//) ) {
				i = steal.root.join(i.substr(2));
				return i;
			}
			return 'models/' + i;
		}),

		/**
		 * @function resources
		 * Loads resources from the current file's <b>resources</b> directory.
		 * <br>
		 * <br>
		 * Example:
		 * <br>
		 * If you want to load resources/i18n.js, write:
		 * @codestart 
		 *  steal.resources('i18n')
		 * @codeend
		 * @param {String+} resource The name of the resource file you want to load.  You can pass multiple model names.
		 * @return {steal} the steal function for chaining.
		 */
		resources: steal.applier(function( i ) {
			if ( i.match(/^\/\//) ) {
				i = steal.root.join(i.substr(2));
				return i;
			}
			return 'resources/' + i;
		}),

		/**
		 * @function views
		 * Loads views to be added to the production build.  Paths must be given from steal's ROOT folder.
		 * <br>
		 * <br>
		 * Example:
		 * <br>
		 * The following loads, coookbook/views/recipe/show.ejs and coookbook/views/recipe/list.ejs:
		 * @codestart 
		 *  steal.views('//coookbook/views/recipe/show.ejs',
		 *              '//coookbook/views/recipe/list.ejs')
		 * @codeend
		 * @param {String} path The view's path rooted from steal's root folder.
		 * @return {steal} the steal function for chaining.   
		 */
		views: function() {
			// Only includes views for compression and docs (when running in rhino)
			if ( browser.rhino || steal.options.env == "production" ) {
				for ( var i = 0; i < arguments.length; i++ ) {
					steal.view(arguments[i]);
				}
			}
			return steal;
		},

		timerCount: 0,
		view: function( path ) {
			var type = path.match(/\.\w+$/gi)[0].replace(".", "");
			if( path.indexOf("//") !== 0 ){
				path = "views/"+path;
			}
			steal({
				path: path,
				type: "text/" + type,
				compress: "false"
			});
			return steal;
		},
		timers: {},
		//tracks the last script
		ct: function( id ) { //for clear timer
			clearTimeout(steal.timers[id]);
			delete steal.timers[id];
		},
		loadErrorTimer: function( options ) {
			var count = ++steal.timerCount;
			steal.timers[count] = setTimeout(function() {
				throw "steal.js Could not load " + options.src + ".  Are you sure you have the right path?";
			}, 5000);
			return "onLoad='steal.ct(" + count + ")' ";
		},
		cleanId: function( id ) {
			return id.replace(/[\/\.]/g, "_");
		}
	});
	//for integration with other build types
	if (!steal.build ) {
		steal.build = {
			types: {}
		};
	}

	steal.loadedProductionCSS = false;

	steal.init();
})();
