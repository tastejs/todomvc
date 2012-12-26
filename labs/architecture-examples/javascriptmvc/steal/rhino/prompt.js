steal(function( steal ) {
	steal.prompt = function( question ) {
		java.lang.System.out.print(question);
		var br = new java.io.BufferedReader(new java.io.InputStreamReader(java.lang.System["in"]));
		var response;
		try {
			response = br.readLine();
		} catch (e) {
			System.out.println("IO error trying to read");
		}
		return response;
	}
	/**
	 * 
	 * @param {String} question
	 * @param {Boolean} true or false
	 */
	steal.prompt.yesno = function( question ) {
		var response = "";
		while (!response.match(/^\s*[yn]\s*$/i) ) {
			response = steal.prompt(question)
		}
		return response.match(/[yn]/i)[0].toLowerCase() == "y";
	}

	/**
	 * Accepts an array of possible arguments and creates global variables for each that is found in args
	 * ie: steal.handleArgs(_args, ["path"])
	 * Args are passed in via command line scripts like this:
	 * js run.js path=/one/two docsLocation=docs
	 * @param {Object} possibleArgs
	 */
	steal.handleArgs = function( args, possibleArgs ) {
		var i, arg, j, possibleArg, matchedArg, results = {};
		for ( i = 0; i < args.length; i++ ) {
			arg = args[i];
			for ( j = 0; j < possibleArgs.length; j++ ) {
				possibleArg = possibleArgs[j];
				reg = new RegExp("^" + possibleArg + "\=([^\\s]+)");
				matchedArg = arg.match(reg);
				if ( matchedArg && matchedArg[1] ) {
					results[possibleArg] = matchedArg[1];
				}
			}
		}
		return results;
	}
});