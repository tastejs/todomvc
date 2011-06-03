steal(function( steal ) {

	/**
	 * Builds JavaScripts
	 *
	 * @param {Object} opener the result of a steal.build.open
	 * @param {Object} options options passed to the build script
	 * 
	 *   * __to__  - which folder the production.css files should be put in
	 *   * __quite__  - tell the compressor to be less abnoxious about sending errors
	 *   * __all__ - compress all scripts
	 */
	var scripts = (steal.build.builders.scripts = function( opener, options ) {
		steal.print("\nBUILDING SCRIPTS --------------- ");

		// get the compressor
		var compressor = scripts.compressors[options.compressor || "localClosure"](),

			// packages that can be compressed somewhere
			packages = {},

			// the current package
			currentPackage = [];

		// compress all scripts by default
		if ( options.all ) {
			packages['production.js'] = currentPackage;
		}

		// for each script we find
		opener.each("script", function( script, text, i ) {

			// if we should ignore it, ignore it
			if ( script.getAttribute('ignore') == "true" ) {
				if ( script.src ) {
					steal.print('   ignoring ' + script.src);
				}
				return;
			}

			// if it has a src, let people know we are compressing it
			if ( script.src ) {
				steal.print("   " + script.src.replace(/\?.*$/, "").replace(/^(\.\.\/)+/, ""));
			}

			// get the package, this will be production.js
			var pack = script.getAttribute('package');


			if ( pack ) {
				//if we don't have it, create it and set it to the current package
				if (!packages[pack] ) {
					packages[pack] = [];
				}
				currentPackage = packages[pack];
			}

			// clean out any remove-start style comments
			text = scripts.clean(text);

			// if we should compress the script, compress it
			if ( script.getAttribute('compress') == "true" || options.all ) {
				text = compressor(text, true);
			}

			// put the result in the package
			currentPackage.push(text);
		});

		steal.print("");

		// go through all the packages
		for ( var p in packages ) {
			if ( packages[p].length ) {
				//join them
				var compressed = packages[p].join(";\n");
				//save them
				new steal.File(options.to + p).save(compressed);
				steal.print("SCRIPT BUNDLE > " + options.to + p);
			}
		}
	});
	// removes  dev comments from text
	scripts.clean = function( text ) {
		return String(java.lang.String(text).replaceAll("(?s)\/\/@steal-remove-start(.*?)\/\/@steal-remove-end", "").replaceAll("steal[\n\s\r]*\.[\n\s\r]*dev[\n\s\r]*\.[\n\s\r]*(\\w+)[\n\s\r]*\\([^\\)]*\\)", ""));
	};

	//various compressors
	scripts.compressors = {
		// needs shrinksafe.jar at steal/build/javascripts/shrinksafe.jar
		shrinksafe: function() {
			steal.print("steal.compress - Using ShrinkSafe");
			// importPackages/Class doesn't really work
			var URLClassLoader = Packages.java.net.URLClassLoader,
				URL = java.net.URL,
				File = java.io.File,
				ss = new File("steal/build/javascripts/shrinksafe.jar"),
				ssurl = ss.toURL(),
				urls = java.lang.reflect.Array.newInstance(URL, 1);
			urls[0] = new URL(ssurl);

			var clazzLoader = new URLClassLoader(urls),
				mthds = clazzLoader.loadClass("org.dojotoolkit.shrinksafe.Compressor").getDeclaredMethods(),
				rawCompress = null;

			//iterate through methods to find the one we are looking for
			for ( var i = 0; i < mthds.length; i++ ) {
				var meth = mthds[i];
				if ( meth.toString().match(/compressScript\(java.lang.String,int,int,boolean\)/) ) {
					rawCompress = meth;
				}
			}
			return function( src ) {
				var zero = new java.lang.Integer(0),
					one = new java.lang.Integer(1),
					tru = new java.lang.Boolean(false),
					script = new java.lang.String(src);
				return rawCompress.invoke(null, script, zero, one, tru);
			};
		},
		closureService: function() {
			steal.print("steal.compress - Using Google Closure Service");

			return function( src ) {
				var xhr = new XMLHttpRequest();
				xhr.open("POST", "http://closure-compiler.appspot.com/compile", false);
				xhr.setRequestHeader["Content-Type"] = "application/x-www-form-urlencoded";
				var params = "js_code=" + encodeURIComponent(src) + "&compilation_level=WHITESPACE_ONLY" + "&output_format=text&output_info=compiled_code";
				xhr.send(params);
				return "" + xhr.responseText;
			};
		},
		localClosure: function() {
			//was unable to use SS import method, so create a temp file
			steal.print("steal.compress - Using Google Closure app");
			return function( src, quiet ) {
				var rnd = Math.floor(Math.random() * 1000000 + 1),
					filename = "tmp" + rnd + ".js",
					tmpFile = new steal.File(filename);

				tmpFile.save(src);

				var outBaos = new java.io.ByteArrayOutputStream(),
					output = new java.io.PrintStream(outBaos);
				if ( quiet ) {
					runCommand("java", "-jar", "steal/build/scripts/compiler.jar", "--compilation_level", "SIMPLE_OPTIMIZATIONS", "--warning_level", "QUIET", "--js", filename, {
						output: output
					});
				} else {
					runCommand("java", "-jar", "steal/build/scripts/compiler.jar", "--compilation_level", "SIMPLE_OPTIMIZATIONS", "--js", filename, {
						output: output
					});
				}
				tmpFile.remove();

				return outBaos.toString();
			};
		},
		yui: function() {
			// needs yuicompressor.jar at steal/build/scripts/yuicompressor.jar
			steal.print("steal.compress - Using YUI compressor");

			return function( src ) {
				var rnd = Math.floor(Math.random() * 1000000 + 1),
					filename = "tmp" + rnd + ".js",
					tmpFile = new steal.File(filename);

				tmpFile.save(src);

				var outBaos = new java.io.ByteArrayOutputStream(),
					output = new java.io.PrintStream(outBaos);
					
				runCommand(
					"java", 
					"-jar", 
					"steal/build/scripts/yuicompressor.jar", 
					"--charset",
					"utf-8",
					filename, 
					{ output: output }
				);
			
				tmpFile.remove();

				return outBaos.toString();
			};
		}
	};
});
