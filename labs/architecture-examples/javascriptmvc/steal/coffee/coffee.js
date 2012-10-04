steal({
	src: "./coffee-script.js",
	ignore: true
}, function() {

	/**
	 * @page steal.coffee CoffeeScript
	 * @parent steal.static.type
	 * @plugin steal/coffee
	 * <p>Requires a [http://jashkenas.github.com/coffee-script/ CoffeeScript] script.</p>
	 * 
	 * <p>CoffeeScript is a more 'refined' version of JavaScript that lets you write code like:</p>
	 * @codestart
	 * number = -42 if opposite
	 * @codeend
	 * CoffeeScript is normally used on the server, but steal lets you load CoffeeScripts
	 * in the browser, and compress their JavaScript output into your production builds.
	 * 
	 * <h2>Use</h2>
	 * <p>First, create a coffee script like:</p>
	 * @codestart
	 * console.log "There are no () around this string!"
	 * @codeend
	 * <p>Save this in a file named <code>log.coffee</code>.</p>
	 * <p>Next, you have to require the <code>steal/coffee</code> plugin and then use
	 * steal.coffee to load your coffee script:
	 * </p>
	 * @codestart
	 * steal('steal/coffee').then(function(){
	 *   steal.coffee('log');
	 * });
	 * @codeend
	 *
	 * Loads CoffeeScript files relative to the current file.  It's expected that all
	 * CoffeeScript files end with <code>coffee</code>.
	 * @param {String+} path the relative path from the current file to the coffee file.
	 * You can pass multiple paths.
	 * @return {steal} returns the steal function.
	 */
	
	steal.type("coffee js", function(options, success, error){
		options.text = CoffeeScript.compile(options.text);
		success();
	});


})