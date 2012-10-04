steal(function(){
	steal.client = {};
	steal.client.trigger = function(type, data){
		Envjs.trigger(type, data);
	};
})