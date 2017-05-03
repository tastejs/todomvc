define([], function() {

	function decorate(target, addToMessage) {
		var origDoSomething = target.doSomething;

		target.doSomething = function newDoSomething(message) {
			return origDoSomething.call(target, message + " " + addToMessage);
		};
	}

	return decorate;
});