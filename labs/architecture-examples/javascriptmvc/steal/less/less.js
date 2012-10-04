steal({src: "./less_engine.js",ignore: true},function(){
	
	/**
	 * @page steal.less Less
	 * @parent steal.static.type
	 * @plugin steal/less
	 * <p>Lets you build and compile [http://lesscss.org/ Less ] css styles.</p>
	 * <p>Less is an extension of CSS that adds variables, mixins, and quite a bit more.
	 * You can write css like:
	 * </p>
	 * @codestart css
	 * @@brand_color: #4D926F;
	 * #header {
	 *   color: @@brand_color;
	 * }
	 * h2 {
	 *   color: @@brand_color;
	 * }
	 * @codeend
	 * <h2>Use</h2>
	 * <p>First, create a less file like:</p>
	 * @codestart css
	 * @@my_color red
	 * 
	 * body { color:  @@my_color; }
	 * @codeend
	 * 
	 * Save this in a file named <code>red.less</code>.
	 * 
	 * Next, steal the <code>steal/less</code> plugin, wait for it to finish loading
	 * (by using [steal.static.then then]) and then load the less file:
	 * 
	 * @codestart
	 * steal('steal/less').then('./red.less');
	 * @codeend
	 *
	 * Loads Less files relative to the current file.  It's expected that all
	 * Less files end with <code>less</code>.
	 * 
	 */
	
	steal.type("less css", function(options, success, error){
		var pathParts = options.src.split('/');
		pathParts[pathParts.length - 1] = ''; // Remove filename
		new (less.Parser)({
            optimization: less.optimization,
            paths: [pathParts.join('/')]
        }).parse(options.text, function (e, root) {
			options.text = root.toCSS();
			success();
		});
	});
})
