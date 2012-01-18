// lets you know if your JS sucks and will try to clean it for you
// using with jslint: js steal/cleanjs path/to/file -jslint

steal.plugins('steal/build').then('//steal/clean/beautify','//steal/clean/jslint','//steal/rhino/prompt', function(steal){
	var lintAndPrint = function(out, predefined){
		

		JSLINT(out,{devel: true, forin: true, browser: true, windows: true, rhino: true, predefined : predefined});
		if(JSLINT.errors.length){
			//var lines = out.split('\n'), line, error;
			for(var i = 0; i < JSLINT.errors.length; i++){
				error = JSLINT.errors[i];
				if(!error.evidence){
					break;
				}
				line = error.evidence.replace(/\t/g,"     ");

				print("    "+error.line+":"+error.character+"  "+
					line.substring(Math.max(error.character-25, 0), 
					   Math.min(error.character+25, line.length)).replace(/^\s+/,"")
					
					)
				print("    "+error.reason);
				print(" ")
			}
		}
		
		var data  = JSLINT.data();
		//if(data.globals){
		//	print("  GLOBALS \n    "+data.globals.join("\n    "))
		//}
		if(data.unused){
			print("  UNUSED    ");
			for(var i =0; i < data.unused.length; i++){
				print("    "+data.unused[i].line+" : "+data.unused[i].name)
			}
		}
		if(data.implieds){
			print("  implied    ");
			for(var i =0; i < data.implieds.length; i++){
				print("    "+data.implieds[i].line+" : "+data.implieds[i].name)
			}
		}
		return JSLINT.errors.length > 0 
	}
	
	
	/**
	 * @parent stealjs
	 * <p>Beautifies source code with [http://jsbeautifier.org/ JS Beautify]
	 * and checks it for trouble spots with 
	 * [http://www.jslint.com/ JSLint].
	 * </p>
	 * <p>The following cleans all scripts found in myapp/myapp.html.</p>
	 * @codestart text
	 * ./js steal/cleanjs myapp/myapp.html
	 * @codeend
	 * <h2>Use</h2>
	 * <p>Typically, steal.clean is used from the command line
	 * <code>steal/cleanjs</code> script.  It takes
	 * a path to an html or js file on the filesystem and
	 * a list of options.  It then
	 * updates the file or files in place.</p>
	 * <p><b>Using on a single file</b></p>
	 * @codestart text
	 * ./js steal/cleanjs myapp/myapp.js
	 * @codeend
	 * <p><b>Using on many files</b></p>
	 * @codestart text
	 * ./js steal/cleanjs myapp/myapp.html
	 * @codeend
	 * <h2>Turning on JSLint and other options</h2>
	 * Turn on JSLint like:
	 * @codestart text
	 * ./js steal/cleanjs myapp/myapp.js -jslint true
	 * @codeend
	 * <p>You can pass other options in a similar way.</p>
	 * <h2>The clean script</h2>
	 * When you generate a JavaScriptMVC application, it comes with
	 * a steal script.  You can modify the options in this file.</p>
	 * <h2>Ignoring Files</h2>
	 * To ignore a file from your application, mark it as clean with a comment like:
	 * @codestart
	 * //@steal-clean
	 * @codeend
	 * <h2>The steal.clean function</h2>
	 * <p>Takes a relative path to a file on the filesystem;
	 * checks if it is a html page or a single js file; runs 
	 * beautify on it then optionally runs JSLint.</p>
	 * @param {String} url the path to a page or a JS file
	 * @param {Object} [options] an optional set of params.  If you
	 * want to turn on steal, this should be true.
	 * 
	 */
	steal.clean = function(url, options){
		options = steal.extend(
			{indent_size: 1, 
			 indent_char: '\t', 
			 space_statement_expression: true,
			 jquery : false},
			steal.opts(options || {}, {
				//compress everything, regardless of what you find
				all : 1,
				//folder to build to, defaults to the folder the page is in
				to: 1,
				print : 1,
				jslint :1,
				predefined: 1
			}) )
		
		//if it ends with js, just rewwrite
		if(/\.js/.test(url)){
			var text = readFile(url);
			steal.print('Beautifying '+url)
			var out = js_beautify(text, options);
			if(options.print){
				print(out)
			}else{
				steal.File(url).save( out  )
			}
			if(options.jslint){
				var errors = lintAndPrint(out, options.predefined || {});
				if(errors){
					print("quiting because of JSLint Errors");
					quit();
				}
			}
		}else{
			var folder = steal.File(url).dir(),
				clean = /\/\/@steal-clean/
			//folder
			
			steal.build.open(url).each(function(script, text, i){
				if(!text || !script.src){
					return;
				}
				var path = steal.File(script.src).joinFrom(folder).replace(/\?.*/,"")
				if(clean.test(text) || (options.ignore && options.ignore.test(path) ) ){
					print("I "+path)
				}else{
					var out = js_beautify(text, options);
					if(out == text){
						print("C "+path);
						if(options.jslint){
							var errors = lintAndPrint(out, options.predefined || {});
							if(errors){
								print("quiting because of JSLint Errors");
								quit();
							}
						}
						
					}else{
						if(steal.prompt.yesno("B "+path+" Overwrite? [Yn]")){
							if(options.print){
								print(out)
							}else{
								steal.File(path).save( out  )
							}
							
							if(options.jslint){
								var errors = lintAndPrint(out, options.predefined || {});
								if(errors){
									print("quiting because of JSLint Errors");
									quit();
								}
							}
						}
	
					}
					
				}
			});
		}
		
		
		
		
	};
	

  
});