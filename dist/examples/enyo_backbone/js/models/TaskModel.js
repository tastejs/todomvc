/*jshint strict:false */
/*global enyo:false, ToDo:false, Backbone:false */
enyo.ready(function () {
	ToDo.TaskModel = Backbone.Model.extend({
		defaults: {
			title: '',
			completed: false
		}
	});
});
