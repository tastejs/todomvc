'use strict';
/*global m */
var app = app || {};

// Todo Model
app.Todo = function (data) {
	this.title = m.prop(data.title);
	this.completed = m.prop(data.completed || false);
	this.editing = m.prop(data.editing || false);
};
