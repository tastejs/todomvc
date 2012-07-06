define(function(){
	return {
		load: function(id, require, loaded, config){
			this.config = config; // just to test if config is passed correctly
			require([id], loaded);
		}
	};
});
