/*global Ember */
(function () {
	'use strict';

	Ember.Handlebars.helper("debug", function(optionalValue) {
		/* from http://blog.teamtreehouse.com/handlebars-js-part-3-tips-and-tricks */
		console.log("Current Context");
		console.log("====================");
		console.log(this);

		if (optionalValue) {
			console.log("Value");
			console.log("====================");
			console.log(optionalValue);
		}
		console.log("----------------------");

	});
})();
