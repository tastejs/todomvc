define([
	'js/data/Model'
], function (Model) {
	'use strict';

	return Model.inherit('app.model.Todo', {
		defaults: {
			title: '',
			completed: false
		},

		setCompleted: function (completed) {
			this.set('completed', completed);
		},

		isCompleted: function () {
			return this.$.completed;
		},

		status: function () {
			return this.$.completed ? 'completed' : '';
		}.onChange('completed'),

		hasTitle: function () {
			return this.$.title.trim().length;
		}.onChange('title')
	});
});
