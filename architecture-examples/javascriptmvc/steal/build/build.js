//used to build a page's script
/*global steal : false, Envjs : false, jQuery : false*/

steal(function( steal ) {
	var window = (function() {
		return this;
	}).call(null, 0);

	/**
	 * 
	 * @parent stealjs
	 * 
	 * Builds an html page's JavaScript and CSS files by compressing and concatenating them into
	 * a single or several files.
	 * 
	 * Steal can also build multiple applications at the same time and separate 
	 * shared dependencies into standalone cache-able scripts.
	 * 
	 * ## How it works
	 * 
	 * <code>Steal.build</code> opens a page in Envjs to extract all scripts and styles
	 * from the page.  It compresses the resources into production.js and production.css
	 * files.
	 * 
	 * Steal.build works with or without using steal.js, so it could work with other script loaders.
	 * 
	 * ## Building with steal.js.
	 * 
	 * Building with steal is easy, just point the <code>steal/buildjs</code> script at your page and
	 * give it the name of your application folder:
	 * 
	 * @codestart no-highlight
	 * js steal/buildjs path/to/page.html -to myapp
	 * @codeend 
	 * 
	 * If you generated a steal app or plugin, there's a handy script already ready for you:
	 * 
	 * @codestart no-highlight
	 * js myapp/scripts/build.js
	 * @codeend 
	 * 
	 * ## Building without steal.js
	 * 
	 * You can compress and package any page's JavaScript by adding <code>compress="true"</code>
	 * attributes to your script tag like the following:
	 * 
	 * @codestart html
	 * &lt;script src="file1.js" type="text/javascript" compress="true">&lt;/script>
	 * &lt;script src="file2.js" type="text/javascript" compress="true">&lt;/script>		
	 * @codeend
	 * 
	 * and then running either:
	 * 
	 * @codestart no-highlight
	 * js steal/buildjs path/to/page.html -to [OUTPUT_FOLDER]
	 * @codeend 
	 * 
	 * or: 
	 * 
	 * @codestart no-highlight
	 * js steal/buildjs http://hostname/path/page.html -to [OUTPUT_FOLDER]
	 * @codeend  
	 * 
	 * This will compress file1.js and file2.js into a file package named production.js an put it in OUTPUT_FOLDER.
	 * 
	 * ## Common Problems
	 * 
	 * If you are getting errors building a production build, it's almost certainly because Envjs is
	 * close, but not quite a fully featured browser.  So, you have to avoid doing things in your page that
	 * Envjs doesn't like before onload.  The most common problems are:
	 * 
	 * <h5>Malformed HTML or unescaped characters</h5>
	 * <p>Steal does not have as tolerant of an HTML parser as Firefox.  Make sure your page's tags look good.
	 * Also, make sure you escape characters like &amp; to &amp;amp;
	 * </p>
	 * <h5>DOM manipulations before onload</h5>
	 * <p>EnvJS supports most DOM manipulations.  But, it's not a graphical browser so it completely punts
	 * on styles and dimensional DOM features.  It's easy to protect against this, just wait until 
	 * document ready or onload to do these things.
	 * </p>
	 * <h5>Unending timeouts or intervals before onload</h5>
	 * <p>Envjs won't quit running until all timeouts or intervals have completed.  If you have a reoccuring
	 * 'process', consider starting it on document ready or onload.</p>
	 * <h2>Building With Shared Dependencies</h2>
	 * <p>
	 * If you are using steal in a setting with multiple pages loading similar
	 * functionality, it's typically a good idea to build the shared functionality in
	 * its own script.  This way when a user switches pages, they don't have to load
	 * that functionality again.
	 * </p>
	 * <p>
	 * To do this, use the buildjs script with the names of your apps:
	 * </p>
	 * @codestart
	 * ./js steal/buildjs myco/search myco/searchresults music
	 * @codeend
	 * <h2>steal.build function</h2>
	 * Takes a url, extracts
	 * @param {String} url an html page to compress
	 * @param {Object} options An object literal with the following optional values:
	 * <table class='options'>
	 *       <tr>
	 *           <th>Name</th><th>Description</th>
	 *       </tr>
	 *       <tr><td>to</td>
	 *           <td>The folder to put the production.js and production.css files.</td></tr>
	 *       <tr><td>all</td>
	 *       <td>Concat and compress all scripts and styles.  By default, this is set to false, meaning
	 *           scripts and styles have to opt into being compress with the <code>compress='true'</code> attribute.</td></tr>
	 *       <tr><td>compressor</td>
	 *           <td>The compressor to use: shrinksafe, localClosure, closureService or yui</td></tr>
	 *     </table>
	 * Note that you must install shrinksafe and YUI compressor manually, because they are not included in the JavaScriptMVC distribution.
	 */
	steal.build = function( url, options ) {

		//convert options (which might be an array) into an object
		options = steal.opts(options || {}, {
			//compress everything, regardless of what you find
			all: 1,
			//folder to build to, defaults to the folder the page is in
			to: 1,
			//compressor to use, e.g. shrinksafe, localClosure, closureService or yui
			compressor: 1
		});

		// to is the folder packages will be put in
		options.to = options.to || (url.match(/https?:\/\//) ? "" : url.substr(0, url.lastIndexOf('/')));

		// make sure to ends with /
		if ( options.to.match(/\\$/) === null && options.to !== '' ) {
			options.to += "/";
		}

		steal.print("Building to " + options.to);

		var opener = steal.build.open(url);
		
		
		// iterates through the types of builders.  For now
		// there are just scripts and styles builders
		for ( var builder in steal.build.builders ) {
			steal.build.builders[builder](opener, options);
		}
	};
	// a place for the builders
	steal.build.builders = {}; //builders
	// a helper function that gets the src of a script and returns
	// the content for that script
	var loadScriptText = function( src ) {
		var text = "",
			base = "" + window.location,
			url = src.match(/([^\?#]*)/)[1];

		if ( url.match(/^\/\//) ) {
			url = steal.root.join(url.substr(2)); //can steal be removed?
		}
		url = Envjs.uri(url, base);

		if ( url.match(/^file\:/) ) {
			url = url.replace("file:/", "");
			text = readFile("/" + url);
		}

		if ( url.match(/^https?\:/) ) {
			text = readUrl(url);
		}

		return text;
	},
		checkText = function(text, id){
			if(!text){
				print("\n!! There is nothing at "+id+"!!")
			}
		};
	
	// types conversion
	// the idea is for each type to return JavaScript (or css) that
	// should be in its place
	steal.build.types = {
		'text/javascript': function( script ) {
			if ( script.src ) {
				return loadScriptText(script.src, script);
			}
			else {
				return script.text;
			}
		},
		'text/css': function( script ) {
			if ( script.href ) {
				return loadScriptText(script.href, script);
			}
			else {
				return script.text;
			}
		},
		'text/ejs': function( script ) {
			var text = script.text || loadScriptText(script.src),
				id = script.id || script.getAttribute("id");
				checkText(text, script.src || id);
			return jQuery.View.registerScript("ejs", id, text);
		},
		'text/micro': function( script ) {
			var text = script.text || loadScriptText(script.src),
				id = script.id || script.getAttribute("id");
				checkText(text, script.src || id);
			return jQuery.View.registerScript("micro", id, text);
		},
		'text/jaml': function( script ) {
			var text = script.text || loadScriptText(script.src),
				id = script.id || script.getAttribute("id");
				checkText(text, script.src || id);
			return jQuery.View.registerScript("jaml", id, text);
		},
		'text/tmpl': function( script ) {
			var text = script.text || loadScriptText(script.src),
				id = script.id || script.getAttribute("id");
				checkText(text, script.src || id);
			return jQuery.View.registerScript("tmpl", id, text);
		},
		loadScriptText: loadScriptText
	};

	/**
	 * @function open
	 * Opens a page by:
	 *   temporarily deleting the rhino steal
	 *   opening the page with Envjs
	 *   setting back rhino steal, saving envjs's steal as steal._steal;
	 * @param {String} url the html page to open
	 * @return {Object} an object with properties that makes extracting 
	 * the content for a certain tag slightly easier.
	 * 
	 */
	steal.build.open = function( url, stealData ) {
		var scripts = [],

			// save and remove the old steal
			oldSteal = window.steal || steal,
			newSteal;
		delete window.steal;
		if ( stealData ) {
			window.steal = stealData;
		}
		// get envjs
		load('steal/rhino/env.js'); //reload every time
		var success = true;
		// open the url
		Envjs(url, {
			scriptTypes: {
				"text/javascript": true,
				"text/envjs": true,
				"": true
			},
			fireLoad: false,
			logLevel: 2,
			afterScriptLoad: {
				".*": function( script ) {
					scripts.push(script);
				}
			},
			onLoadUnknownTypeScript: function( script ) {
				scripts.push(script);
			},
			afterInlineScriptLoad: function( script ) {
				scripts.push(script);
			}, 
			onScriptLoadError: function(script) {
				success = false;
			},
			dontPrintUserAgent: true,
			killTimersAfterLoad: true
		});
		if (!success) {
			java.lang.System.exit(-1);
		}

		// set back steal
		newSteal = window.steal;
		window.steal = oldSteal;
		window.steal._steal = newSteal;


		// check if newSteal added any build types (used to convert less to css for example).
		if(newSteal && newSteal.build && newSteal.build.types){
			for ( var buildType in newSteal.build.types ) {
				oldSteal.build.types[buildType] = newSteal.build.types[buildType];
			}
		}
		

		// return the helper
		return {
			/**
			 * @hide
			 * Gets all elements of a type, extracts their converted content, and calls a callback function with  
			 * each element and its converted content.
			 * @param {Object} [type] the tag to get
			 * @param {Object} func a function to call back with the element and its content
			 */
			each: function( type, func ) {
				if ( typeof type == 'function' ) {
					func = type;
					type = 'script';
				}
				var scripts = document.getElementsByTagName(type);

				for ( var i = 0; i < scripts.length; i++ ) {
					func(scripts[i], this.getScriptContent(scripts[i]), i);
				}
			},
			getScriptContent: function( script ) {
				return steal.build.types[script.type] && steal.build.types[script.type](script, loadScriptText);
			},
			// the 
			steal: newSteal,
			url: url
		};
	};

});
