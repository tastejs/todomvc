(function() {
	"use strict";

	if (typeof define === "function" && define.amd) {
		define(["./src/jQueryDestroy"], factory);
	} else if (typeof exports === 'object') {
		module.exports = factory(
			require("./src/jQueryDestroy")
		);
	} else {
		throw Error("no module loader found");
	}

	function factory(jQueryDestroy) {
		return jQueryDestroy;
	}
})();
