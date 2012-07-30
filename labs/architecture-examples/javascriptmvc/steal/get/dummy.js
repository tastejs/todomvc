// a dummy version of steal that can run on a file and extract data from it ...
steal(function(s){
	
	s.dummy = function(code){
		
		var args = [], 
			arg;
			
		var fakesteal = function(){
			args.push(arguments);
			for(var i =0; i < arguments.length; i++){
				arg = arguments[i];
				// if there's nothing at start of path and no extension, its a plugin
				if(typeof arg == "string" && arg.indexOf(".") != 0 && arg.indexOf("/") != 0){
					dummy.plugins.push(arg)
				}
			}
			return dummy;
		}
		var dummy = fakesteal;
		
		for(var prop in s){
			dummy[prop] = {};
		}
		dummy.then = dummy;
		dummy.plugins = [];
		
		//save current steal
		var curSteal = steal;
		//replace ...
		
		steal = dummy;
		
		eval(code)
		
		steal = curSteal;
		return dummy;
	};
	
	
});
