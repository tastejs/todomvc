/*global define */
define([
	'backbone',
	'models/Todo',
	'localStorage'
], function (Backbone, Todo) {
	'use strict';

	return Backbone.Collection.extend({
		model: Todo,

		localStorage: new Backbone.LocalStorage('todos-backbone'),

		getCompleted: function () {
			return this.where({completed: true});
		},

		getActive: function () {
			return this.where({completed: false});
		},

		comparator: 'created'
	});
});
