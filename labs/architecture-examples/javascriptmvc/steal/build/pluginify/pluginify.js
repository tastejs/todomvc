// usage: 
// js steal\scripts\pluginify.js funcunit/functional -out funcunit/dist/funcunit.js
// js steal\scripts\pluginify.js jquery/controller
// js steal\scripts\pluginify.js jquery/event/drag -exclude jquery/lang/vector/vector.js jquery/event/livehack/livehack.js

// _args = ['jquery/controller']; load('steal/pluginifyjs')

steal('steal/parse','steal/build/scripts').then(
 function(s) {
	var isArray = function(arr){
		return Object.prototype.toString.call(arr)=== "[object Array]"
	}
	/**
	 * @function steal.build.pluginify
	 * @parent steal.build
	 * 
	 * Builds a 'steal-less' version of your application.  To use this, files that use steal must
	 * have their code within a callback function.
	 * 
	 *     js steal\pluginify jquery\controller -nojquery
	 *   
	 * @param {Object} plugin
	 * @param {Object} opts options include:
	 * 
	 *   - out - where to put the generated file
	 *   - exclude - an array of files to exclude
	 *   - nojquery - exclude jquery
	 *   - global - what the callback to steal functions should be.  Defaults to jQuery as $.
	 *   - compress - compress the file
	 */
	s.build.pluginify = function(plugin, opts){
		s.print("" + plugin + " >");
		var jq = true, 
			othervar, 
			opts = steal.opts(opts, {
				"out": 1,
				"exclude": -1,
				"nojquery": 0,
				"global": 0,
				"compress": 0
			}), 
			where = opts.out || plugin + "/" + plugin.replace(/\//g, ".") + ".js";
		
		opts.exclude = !opts.exclude ? [] : (isArray(opts.exclude) ? opts.exclude : [opts.exclude]);
		
		if (opts.nojquery) {
			jq = false;
			//othervar = opts.nojquery;
			opts.exclude.push('jquery.js');
		}
		opts.exclude.push("steal/dev/")
		rhinoLoader = {
			callback: function(s){
				s.pluginify = true;
				//s(plugin);
			}
		};
		
		//		steal.win().build_in_progress = true;
		var out = [], 
			str, 
			i, 
			inExclude = function(path){
				for (var i = 0; i < opts.exclude.length; i++) {
					if (path.indexOf(opts.exclude[i]) > -1) {
						return true;
					}
				}
				return false;
			}, 
			pageSteal, 
			steals = [];
			
		steal.build.open("steal/rhino/empty.html", {startFile : plugin}, function(opener){
			opener.each('js', function(stl, text, i){
				//print("p  "+stl.rootSrc)
				if (!inExclude(stl.rootSrc)) {
				
					var content = s.build.pluginify.content(stl, opts.global ? opts.global : "jQuery", text);
					if (content) {
						s.print("  > " + stl.rootSrc)
						out.push(s.build.builders.scripts.clean(content));
					}
				}
				else {
					s.print("  Ignoring " + stl.rootSrc)
				}
			})
		}, true);
		
		var output = out.join(";\n");
		if (opts.compress) {
			var compressorName = (typeof(opts.compress) == "string") ? opts.compress : "localClosure";
			var compressor = steal.build.builders.scripts.compressors[compressorName]()
			output = compressor(output);
		}
		
		s.print("--> " + where);
		new steal.File(where).save(output);
		
		//keeps track of which 'then' we are in with steal
		var funcCount = {};
		
	}
	//gets content from a steal
	s.build.pluginify.content = function(steal, param, opener){
		if (steal.buildType == 'fn') {
			// if it's a function, go to the file it's in ... pull out the content
			var index = funcCount[steal.rootSrc] || 0, contents = readFile(steal.rootSrc);
			funcCount[steal.rootSrc]++;
			return "(" + s.build.pluginify.getFunction(contents, index) + ")(" + param + ")";
		}
		else {
			var content = readFile(steal.rootSrc);
			if (/steal[.\(]/.test(content)) {
				
				content = s.build.pluginify.getFunction(content, 0)
				
				if(content){
					content =  "(" + content + ")(" + param + ")";
				}
			}
			//make sure steal isn't in here
			return content;
		}
	};
	s.build.pluginify.getFunction = function(content, ith){
		var p = s.parse(content), 
			token, 
			funcs = [];
		
		while (token = p.moveNext()) {
			//print(token.value)
			if (token.type !== "string") {
				switch (token.value) {
					case "steal":
						stealPull(p, content, function(func){
							funcs.push(func)
						});
						break;
				}
			}
		}
		return funcs[ith || 0];
		
	};
	//gets a function from steal
	var stealPull = function(p, content, cb){
		var token = p.next(), startToken, endToken;
		if (!token || (token.value != "." && token.value != "(")) {
			// we said steal .. but we don't care
			return;
		}
		else {
			p.moveNext();
		}
		if (token.value == ".") {
			p.until("(")
		}
		var tokens = p.until("function", ")");
		if (tokens && tokens[0].value == "function") {
			
			token = tokens[0];
			
			startToken = p.until("{")[0];
			
			endToken = p.partner("{");
			cb(content.substring(token.from, endToken.to))
			//print("CONTENT\n"+  );
			p.moveNext();
		}
		else {
		
		}
		stealPull(p, content, cb);
		
	};
});
