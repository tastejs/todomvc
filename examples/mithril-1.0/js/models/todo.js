'use strict';
/*global m */
var app = app || {};

var uniqueId = (function () {
	var count = 0;
	return function () {
		return ++count;
	};
}());

// Todo Model
app.Todo = function (data) {
	this.title = stream(data.title);
	this.completed = stream(data.completed || false);
	this.editing = stream(data.editing || false);
	this.key = uniqueId();
};
