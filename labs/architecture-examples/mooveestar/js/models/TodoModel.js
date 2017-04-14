/*global MooVeeStar */
/*jshint browser:true, mootools:true */
(function (window) {

	'use strict';

	window.models = window.models || {};

	window.models.TodoModel = new Class({
		Extends: MooVeeStar.Model,
		properties: {
			completed: {
				possible: [true, false],
				initial: false
			}
		}

	});

})(window);