// A Rhino-version of steal
(function(win){
	
	if(typeof console == 'undefined'){
		console = {
			log: function(){
				print.apply(null, arguments)
			}
		}
	}
	
	win.steal = {
		types : {
			"js" : function(options, success){
				if(options.text){
					eval(text)
				}else{
					load(options.src)
				}
				success()
			}
		}
	}
	load("steal/steal.js");
	load("steal/rhino/file.js");
})(this);

