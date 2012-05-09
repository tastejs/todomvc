/**
 *  @add jQuery.fn
 */
steal.plugins('jquery/dom').then(function(){
	/**
	 * @function closest
	 * @parent dom
	 * Overwrites closest to allow open > selectors.  This allows controller actions such as:
	 * @codestart
	 * ">li click" : function( el, ev ) { ... }
	 * @codeend
	 */
	var oldClosest = jQuery.fn.closest;
	jQuery.fn.closest = function(selectors, context){
		var rooted = {}, res, result, thing, i, j, selector, rootedIsEmpty = true, selector, selectorsArr = selectors;
		if(typeof selectors == "string") selectorsArr = [selectors];
		
		$.each(selectorsArr, function(i, selector){
		    if(selector.indexOf(">") == 0 ){
				if(selector.indexOf(" ") != -1){
					throw " closest does not work with > followed by spaces!"
				}
				rooted[( selectorsArr[i] = selector.substr(1)  )] = selector;
				if(typeof selectors == "string") selectors = selector.substr(1);
				rootedIsEmpty = false;
			}
		})
		
		res = oldClosest.call(this, selectors, context);
		
		if(rootedIsEmpty) return res;
		i =0;
		while(i < res.length){
			result = res[i], selector = result.selector;
			if (rooted[selector] !== undefined) {
				result.selector = rooted[selector];
				rooted[selector] = false;
				if(typeof result.selector !== "string"  || result.elem.parentNode !== context ){
					res.splice(i,1);
						continue;
				}
			}
			i++;
		}
		return res;
	}
})