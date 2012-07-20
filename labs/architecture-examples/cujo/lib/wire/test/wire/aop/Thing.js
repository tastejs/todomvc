define([], function() {

	var me = function() {
	};

	me.prototype = {
		doSomething: function(message) {
			var completeMessage = this.name + ": " + message;
			console.log(completeMessage);
			return completeMessage;
		},
		doSomethingElse: function(message) {
			throw new Error(message);
		}
	};

	return me;
});