/*global MooVeeStar */
/*jshint browser:true, mootools:true */
(function (window) {

	'use strict';

	window.collections = window.collections || {};

	window.collections.Todos = new Class({
		Extends: MooVeeStar.Collection,
		modelClass: window.models.TodoModel
	});

})(window);