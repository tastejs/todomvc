// a dummy version of steal that can run on a file and extract data from it ...
steal(function(s){
	var makeFunc = function(name){
		return function(){
			for(var i =0; i < arguments.length; i++){
				this["_"+name].push(arguments[i])
			}
			
			return this;
		}
	}
	
	s.dummy = function(code){
		var args = [];
		var dummy = function(){
			args.push(arguments);
		}
		
		for(var prop in s){
			if(typeof s[prop] == 'function'){
				dummy["_"+prop] = []
				dummy[prop] = makeFunc(prop);
			}else {
				dummy[prop] = {};
			}
		}
		//additional funcs (for 3.0)
		var funcs = ['plugins','views','models','controllers','css','less'];
		for(var i =0; i < funcs.length; i++){
			var prop = funcs[i];
			
			dummy["_"+prop] = []
			dummy[prop] = makeFunc(prop);
		}
		
		//save current steal
		var curSteal = steal;
		//replace ...
		
		steal = dummy;
		
		eval(code)
		
		steal = curSteal;
		for(var prop in dummy){
			if(prop.substr(0,1) === "_"){
				dummy[prop.substr(1)] = dummy[prop];
			}
		}
		return dummy;
	}
	
	
})()
