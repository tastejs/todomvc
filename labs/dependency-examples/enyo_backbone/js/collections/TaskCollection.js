/*jshint strict:false */
/*global enyo:false, ToDo:false, Backbone: false */
enyo.ready(function () {
	ToDo.TaskCollection = Backbone.Collection.extend({
		localStorage: new Backbone.LocalStorage('todos-enyo'),
		model: ToDo.TaskModel
	});
});
