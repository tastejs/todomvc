steal('steal/build', 'steal/parse').then(function( steal ) {

	/**
	 * Builds JavaScripts
	 *
	 * @param {Object} opener the result of a steal.build.open
	 * @param {Object} options options passed to the build script
	 * 
	 *   * __to__  - which folder the production.css files should be put in
	 *   * __quiet__  - tell the compressor to be less abnoxious about sending errors
	 *   * __all__ - compress all scripts
	 * @param {Object} dependencies array of files and the dependencies they contain under the hood
	 */
	var scripts = (steal.build.builders.scripts = function( opener, options, dependencies ) {
		options.compressor = options.compressor || "localClosure";
		steal.print("\nBUILDING SCRIPTS --------------- ");
		var start = new Date();
		
		// get the compressor
		var compressor = scripts.compressors[options.compressor](),

			// packages that can be compressed somewhere
			packages = {},

			// the current package
			currentPackage = {
				scripts : [],
				src : []
			}, 
			
			// concatenated scripts waiting to be compressed
			currentCollection = [],
			 
			// keep track of lines for error reporting
			currentLineMap = [],
			
			compressCollection = function(currentCollection, currentLineMap){
				// grab the previous currentCollection and compress it, then add it to currentPackage
				if (currentCollection.length) {
					var compressed = currentCollection.join("\n");
					// clean out any remove-start style comments
					compressed = scripts.clean(compressed);
					compressed = compressor(compressed, true, currentLineMap);
					currentCollection = [];
					return compressed;
				}
			};

		// compress all scripts by default
		if ( true/*options.all*/ ) {
			packages['production.js'] = currentPackage;
		}
		
		// if nothing can't be compressed, compress whole app in one step

		// for each steal we find
		opener.each('js', function( stl, text, i ) {

			var out = stl.rootSrc || "!";
			// if we should ignore it, ignore it
			if ( stl.packaged === false ) {

				steal.print('   not packaging ' + out);
				
				return;
			}
			
			// ignore
			if ( stl.ignore || (options.exclude && options.exclude.indexOf(stl.rootSrc) != -1)) {
				steal.print('   ignoring ' + out);
				return;
			}
			// if it has a src, let people know we are compressing it
			
			steal.print("   " + out);
			

			// get the package, this will be production.js
			var pack = stl['pack'];

			if ( pack ) {
				//if we don't have it, create it and set it to the current package
				if (!packages[pack] ) {
					packages[pack] = {scripts: [], src : []};
				}
				currentPackage = packages[pack];
			}
			
			// if we should compress the script, compress it
			if ( stl.compress !== false || options.all ) {
				currentPackage.scripts.push("'"+stl.rootSrc+"'")
				// put the result in the package
				text += ";\nsteal.loaded('"+stl.rootSrc+"');";
				if(options.compressor === "localClosure"){ // only closure needs lineNumbers
					text = scripts.clean(text, stl.rootSrc); // have to remove steal.dev stuff for accurate line nbrs
					var lines = text.match(/\n/g).length + 1,
						mapObj = {
							src: stl.rootSrc,
							lines: lines	
						}
					currentLineMap.push(mapObj);
				}
				currentCollection.push(text);
			} 
			else { // compress is false, don't compress it
				var compressed = compressCollection(currentCollection, currentLineMap);
				currentCollection = [];
				currentLineMap = [];
				currentPackage.src.push(compressed);
			
				// add the uncompressed script to the package
				currentPackage.scripts.push("'"+stl.rootSrc+"'");
				currentPackage.src.push(text+";\nsteal.loaded('"+stl.rootSrc+"');");
			}
		});
		
		var compressed = compressCollection(currentCollection, currentLineMap);
		currentCollection = [];
		currentPackage.src.push(compressed);

		steal.print("");

		// go through all the packages
		for ( var p in packages ) {
			if ( packages[p].src.length ) {
				//join them
				var loading = "steal.loading("+packages[p].scripts.join(',')+");\n", 
					dependencyStr = "";
				for (var key in dependencies){
					dependencyStr += "steal({src: '"+key+"', has: ['"+dependencies[key].join("','")+"']});\n";
				}
				var compressed = packages[p].src.join("\n");
				//save them
				new steal.File(options.to + p).save(loading+dependencyStr+compressed);
				var end = new Date(),
					time = (end-start);
				steal.print(time+' MS')
				steal.print("SCRIPT BUNDLE > " + options.to + p);
			}
		}
	}),
		stealDevTest = /steal\.dev/;
	
	/**
	 * Create package's content.
	 * 
	 * @param {Array} files like:
	 * 
	 *     [{rootSrc: "jquery/jquery.js", content: "var a;"}]
	 * 
	 * @param {Object} dependencies like:
	 * 
	 *      {"package/package.js": ['jquery/jquery.js']}
	 */
	scripts.makePackage = function(files, dependencies){
		var loadingCalls = [];
		files.forEach(function(file){
			loadingCalls.push(file.rootSrc)
		});
		
		//create the dependencies ...
		var dependencyCalls = [];
		for (var key in dependencies){
			dependencyCalls.push( 
				"steal({src: '"+key+"', has: ['"+dependencies[key].join("','")+"']})"
			)
		}
		
		// make 'loading'
		
		
		//write it ...
		var code = ["steal.loading('"+loadingCalls.join("','")+"')"];
		
		code.push.apply(code, dependencyCalls);
		
		files.forEach(function(file){
			code.push( file.content, "steal.loaded('"+file.rootSrc+"')" );
		})
		return code.join(";\n")+"\n"
	}
	
	// removes  dev comments from text
	scripts.clean = function( text, file ) {
		var parsedTxt = String(java.lang.String(text)
			.replaceAll("(?s)\/\/!steal-remove-start(.*?)\/\/!steal-remove-end", ""));
		
		// the next part is slow, try to skip if possible
		// if theres not a standalone steal.dev, skip

		if(! stealDevTest.test(parsedTxt) ) {
			return parsedTxt;
		}	
		
		var positions = [],
		   	p,
		    tokens, 
			i, 
			position;

		try{
			p = steal.parse(parsedTxt);
		} catch(e){
			print("Parsing problem");
			print(e);
			return parsedTxt;
		}

		while (tokens = p.until(["steal", ".", "dev", ".", "log", "("], ["steal", ".", "dev", ".", "warn", "("])) {
			var end = p.partner("(");
			positions.push({
				start: tokens[0].from,
				end: end.to
			})
		}
		// go through in reverse order
		for (i = positions.length - 1; i >= 0; i--) {
			position = positions[i];
			parsedTxt = parsedTxt.substring(0, position.start) + parsedTxt.substring(position.end)
		}
		return parsedTxt;
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
		uglify: function() {
			steal.print("steal.compress - Using Uglify");
			return function( src, quiet ) {
				var rnd = Math.floor(Math.random() * 1000000 + 1),
					origFileName = "tmp" + rnd + ".js",
					origFile = new steal.File(origFileName);

				origFile.save(src);


				var outBaos = new java.io.ByteArrayOutputStream(),
					output = new java.io.PrintStream(outBaos);
					
				runCommand("node", "steal/build/scripts/uglify/bin/uglifyjs", origFileName,
					{ output: output }
				);
			
				origFile.remove();

				return outBaos.toString();
			};
		},
		localClosure: function() {
			//was unable to use SS import method, so create a temp file
			steal.print("steal.compress - Using Google Closure app");
			return function( src, quiet, currentLineMap ) {
				var rnd = Math.floor(Math.random() * 1000000 + 1),
					filename = "tmp" + rnd + ".js",
					tmpFile = new steal.File(filename);

				tmpFile.save(src);

				var outBaos = new java.io.ByteArrayOutputStream(),
					output = new java.io.PrintStream(outBaos),
					options = {
						err: '',
						output: output
					};
				if ( quiet ) {
					runCommand("java", "-jar", "steal/build/scripts/compiler.jar", "--compilation_level", "SIMPLE_OPTIMIZATIONS", 
						"--warning_level", "QUIET", "--js", filename, options);
				} else {
					runCommand("java", "-jar", "steal/build/scripts/compiler.jar", "--compilation_level", "SIMPLE_OPTIMIZATIONS", 
						"--js", filename, options);
				}
				// print(options.err);
				// if there's an error, go through the lines and find the right location
				if( /ERROR/.test(options.err) ){
					if (!currentLineMap) {
						print(options.error)
					}
					else {
					
						var errMatch;
						while (errMatch = /\:(\d+)\:\s(.*)/g.exec(options.err)) {
							var lineNbr = parseInt(errMatch[1], 10), 
								found = false, 
								item, 
								lineCount = 0, 
								i = 0, 
								realLine,
								error = errMatch[2];
							while (!found) {
								item = currentLineMap[i];
								lineCount += item.lines;
								if (lineCount >= lineNbr) {
									found = true;
									realLine = lineNbr - (lineCount - item.lines);
								}
								i++;
							}
							
							steal.print('ERROR in ' + item.src + ' at line ' + realLine + ': ' + error + '\n');
							var text = readFile(item.src), split = text.split(/\n/), start = realLine - 2, end = realLine + 2;
							if (start < 0) 
								start = 0;
							if (end > split.length - 1) 
								end = split.length - 1;
							steal.print(split.slice(start, end).join('\n') + '\n')
						}
					}
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
