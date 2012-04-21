define(["lib/stapes"], function(Stapes) {
	return Stapes.create().extend({
		"init" : function() {
			if (!"localStorage" in window) {
				throw new Error("Your browser doesn't support localStorage");
			}

			this.emit('ready');
		},

		"load" : function() {
			var result = window.localStorage['todos-stapes'];

			if (result) {
				return JSON.parse(result);
			}
		},

		"save" : function(data) {
			localStorage['todos-stapes'] = JSON.stringify( data );
		}
	});
});