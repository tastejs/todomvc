(function(){
// Used for trimming whitespace
var trimLeft = /^\s+/,
	trimRight = /\s+$/;
steal.instrument.utils = {
	hashCode:  function(text){
		var hash = 0, 
			mychar;
		if (text.length == 0) return hash;
		for (i = 0; i < text.length; i++) {
			mychar = text.charCodeAt(i);
			hash = ((hash<<5)-hash)+mychar;
			hash = hash & hash; // Convert to 32bit integer
		}
		return hash;
	},
	trim: String.prototype.trim ?
	function( text ) {
		return text == null ?
			"" :
			text.trim();
	} :

	// Otherwise use our own trimming functionality
	function( text ) {
		return text == null ?
			"" :
			text.toString().replace( trimLeft, "" ).replace( trimRight, "" );
	},
	// stolen from jQuery
	globalEval: function(data){
		( window.execScript || function( data ) {
					window[ "eval" ].call( window, data );
				} )( data );
	},
	// true if the path starts the same as something in the ignores array
	shouldIgnore: function(file){
		var ignoreRegex,
			ignore;
		for(var i=0; i<steal.instrument.ignores.length; i++){
			ignore = steal.instrument.ignores[i];
			ignore = ignore.replace("*", ".*")
			ignoreRegex = new RegExp("^"+ignore);
			if(ignoreRegex.test(file)){
				return true;
			}
		}
		return false;
	},
	cache: {
		get: function(fileName, hash){
			if(window.localStorage && window.JSON){
				var val = window.localStorage["stealInstrument:"+fileName];
				if(val){
					var obj = JSON.parse(val);
					// console.log(fileName, 'saved hash', obj.hash, 'current hash', hash)
					if(obj.hash === hash){
						// console.log('hit', fileName)
						return obj.instrumented;
					}
				}
			}
			// console.log('miss', fileName)
			return false;
		},
		set: function(fileName, hash, instrumented){
			if(window.localStorage && window.JSON){
				var stringified = JSON.stringify({
					hash: hash,
					instrumented: instrumented
				})
				try {
					window.localStorage["stealInstrument:"+fileName] = stringified;
				} catch (e) {
					// console.log('NO MORE SPACE!')
			 		// no more space
				}
	
			}
		}
	},
	parentWin: function(){
		var win = window;
		if(top !== window){
			win = top;
		}
		try{
			if(win.opener && win.opener.steal){
				win = win.opener;
			}
		}catch(e){}
		
		return win;
	}
}

})()
