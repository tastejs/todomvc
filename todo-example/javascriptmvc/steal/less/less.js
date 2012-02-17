/**
 * @add steal.static
 */
steal({path: "less_engine.js",ignore: true},function(){
	
	/**
	 * @function less
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
	 * <p>Save this in a file named <code>red.less</code>.</p>
	 * <p>Next, you have to require the <code>steal/less</code> plugin and then use
	 * steal.less to load your less style:
	 * </p>
	 * @codestart
	 * steal.plugins('steal/less').then(function(){
	 *   steal.less('red');
	 * });
	 * @codeend
	 *
	 * Loads Less files relative to the current file.  It's expected that all
	 * Less files end with <code>less</code>.
	 * @param {String+} path the relative path from the current file to the less file.
	 * You can pass multiple paths.
	 * @return {steal} returns the steal function.
	 */
	steal.less = function(){
		//if production, 
		if(steal.options.env == 'production'){
			if(steal.loadedProductionCSS){
				return steal;
			}else{
				var productionCssPath = steal.File( steal.options.production.replace(".js", ".css") ).normalize();
				productionCssPath = steal.root.join( productionCssPath );
				steal.createLink( productionCssPath );
				loadedProductionCSS = true;
				return steal;
			}
		}
		//@steal-remove-start
		var current, path;
		for(var i=0; i < arguments.length; i++){
			current = new steal.File(arguments[i]+".less").joinCurrent();
			path = steal.root.join(current)
			if(steal.browser.rhino){
				//rhino will just look for this
				steal.createLink(path, {
					type : "text/less"
				})
			}else{
				var src = steal.request(path);
				if(!src){
					steal.dev.warn("steal/less : There's no content at "+path+", or you're on the filesystem and it's in another folder.");
					return steal;
				}
				// less needs the full path with http:// or file://
				var newPath = location.href.replace(/[\w\.-]+$/, '')+
					path.replace(/[\w\.-]+$/, '');
				//get and insert stype
				new (less.Parser)({
	                optimization: less.optimization,
	                paths: [newPath]
	            }).parse(src, function (e, root) {
	                var styles = root.toCSS(),
						css  = document.createElement('style');
			        
					css.type = 'text/css';
					css.id = steal.cleanId(path)
			        
					document.getElementsByTagName('head')[0].appendChild(css);
				    
				    if (css.styleSheet) { // IE
			            css.styleSheet.cssText = styles;
				    } else {
				        (function (node) {
				            if (css.childNodes.length > 0) {
				                if (css.firstChild.nodeValue !== node.nodeValue) {
				                    css.replaceChild(node, css.firstChild);
				                }
				            } else {
				                css.appendChild(node);
				            }
				        })(document.createTextNode(styles));
				    }

	            });
			}
		}
		//@steal-remove-end
		return steal;
	}
	//@steal-remove-start
	steal.build.types['text/less'] =  function(script, loadScriptText){
		var text =   script.text || loadScriptText(script.href, script),
			styles;
		new (less.Parser)({
	                optimization: less.optimization,
	                paths: []
	            }).parse(text, function (e, root) {
					styles = root.toCSS();
				});
		return styles;
	}
	//@steal-remove-end
})
