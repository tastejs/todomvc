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
	this.title = m.prop(data.title);
	this.completed = m.prop(data.completed || false);
	this.editing = m.prop(data.editing || false);
	this.key = uniqueId();
};
