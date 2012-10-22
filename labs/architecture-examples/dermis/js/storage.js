define(function(){
	var mod = {
		load: function(key){
			if (!'localStorage' in window) return;
			var d = window.localStorage[key];
			if (d){
				return JSON.parse(d);
			} else {
				return;
			}
		},
		save: function(key, data){
			if (!'localStorage' in window) return;
			window.localStorage[key] = JSON.stringify(data);
		}
	};  
	return mod;
});