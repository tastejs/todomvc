// usage: 
// js steal\scripts\pluginify.js funcunit/functional -destination funcunit/dist/funcunit.js
// js steal\scripts\pluginify.js jquery/controller
// js steal\scripts\pluginify.js jquery/event/drag -exclude jquery/lang/vector/vector.js jquery/event/livehack/livehack.js
// load("steal/rhino/steal.js");

steal.plugins('steal/parse','steal/build/scripts').then(
 function(s) {

	/**
	 * Builds a 'steal-less' version of your application.  To use this, files that use steal must
	 * have their code within a callback function.
	 * 
	 *     js steal\pluginify jquery\controller -nojquery
	 *   
	 * @param {Object} plugin
	 * @param {Object} opts
	 */
	s.build.pluginify = function( plugin, opts ) {
		print(""+plugin+" >");
		var jq = true,
			othervar,
			opts = steal.opts(opts, {
				"destination": 1,
				"exclude": -1,
				"nojquery": 0,
				"global" : 0,
				"compress" : 0
			}),
			destination = opts.destination || plugin+"/"+plugin.replace(/\//g,".") + ".js";

		opts.exclude = !opts.exclude ? [] : (steal.isArray(opts.exclude) ? opts.exclude : [opts.exclude]);

		if ( opts.nojquery ) {
			jq = false;
			//othervar = opts.nojquery;
			opts.exclude.push('jquery.js');
		}
		opts.exclude.push("steal/dev/")
		rhinoLoader = {
			callback: function( s ) {
				s.pluginify = true;
				s.plugins(plugin);
			}
		};

		steal.win().build_in_progress = true;

		var pageSteal = steal.build.open("steal/rhino/empty.html").steal,
			out = [],
			str, i, inExclude = function( path ) {
				for ( var i = 0; i < opts.exclude.length; i++ ) {
					if ( path.indexOf(opts.exclude[i]) > -1 ) {
						return true;
					}
				}
				return false;
			},
			steals = pageSteal.total;

		for ( i = 0; i < steals.length; i++ ) {
			if(!inExclude(steals[i].path)){
				
				var content = steal.build.pluginify.content(steals[i], opts.global ? opts.global : "jQuery" );
				if(content){
					print("  > "+steals[i].path)
					out.push(steal.build.builders.scripts.clean(content));
				}
			}else{
				print("  Ignoring "+steals[i].path)
			}
		}

		var output = out.join(";\n");
		if(opts.compress) {
			var compressorName = (typeof(opts.compress) == "string") ? opts.compress : "localClosure";
			var compressor = steal.build.builders.scripts.compressors[compressorName]()
			output = compressor(output);
		}

		print("--> " + destination);
		new steal.File(destination).save(output);
		//print("pluginified " + plugin)
	};
	
	
	//keeps track of which 'then' we are in with steal
	var funcCount = {};
	
	//gets content from a steal
	s.build.pluginify.content = function(steal, param){
		if(steal.func){
			// if it's a function, go to the file it's in ... pull out the content
			var index = funcCount[steal.path] || 0,
				contents = readFile(steal.path);
			 //print("FOOO "+steal.path);
			 funcCount[steal.path]++;
			 return "("+s.build.pluginify.getFunction(contents, index)+")("+param+")";
		}else{
			var content = readFile(steal.path);
			if( /steal[.\(]/.test(content) ){
				return;
			}
			//make sure steal isn't in here
			return content;
		}
	};
	s.build.pluginify.getFunction = function(content, ith){
		var p = steal.parse(content),
			token,
			funcs = [];

		while (token = p.moveNext() ) {
			//print(token.value)
			if(token.type !== "string"){
				switch(token.value){
					case "steal" : 
						stealPull(p, content, function(func){
							funcs.push(func)
						});
						break;
				}
			}
		}
		return funcs[ith||0];
		
	};
	//gets a function from steal
	var stealPull = function(p, content, cb){
		var token = p.next(),
			startToken,
			endToken;
		if(!token || (token.value != "." && token.value != "(")){
			// we said steal .. but we don't care
			return;
		}else{
			p.moveNext();
		}
		if(token.value == "."){
			p.until("(")
		}
		token = p.until("function",")");

		if(token.value == "function"){
			
			startToken = p.until("{");

			endToken = p.partner("{");
			cb(content.substring(token.from, endToken.to))
			//print("CONTENT\n"+  );
			p.moveNext();
		}else{
			
		}
		stealPull(p,content, cb );
		
	};
});
