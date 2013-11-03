/*jshint newcap:false */
/*global Class, ruqq, include */

(function () {
	'use strict';

	var Todo = Class({
		Base: Class.Serializable,

		// Properties with default values
		title: '',
		completed: false
	});


	include.exports = Class.Collection(Todo, {
		Store: Class.LocalStore('todos-atmajs'),

		create: function (title) {
			// `push` initilizes the `Task` instance. It does the same
			// as if we would do this via `new Task({title: title})`
			return this
				.push({
					title: title
				})
				.save();
		},

		status: {
			count: 0,
			todoCount: 0,
			completedCount: 0,
		},

		Override: {
			// Override mutators and recalculate status,
			// which will be use lately in M-V bindings
			save: function () {
				return this
					.super(arguments)
					.calcStatus();
			},
			del: function () {
				return this
					.super(arguments)
					.calcStatus();
			},
			fetch: function () {
				return this
					.super(arguments)
					.calcStatus();
			}
		},
		calcStatus: function () {

			this.status.count = this.length;
			this.status.todoCount = ruqq.arr.count(this, 'completed', '==', false);
			this.status.completedCount = ruqq.arr.count(this, 'completed', '==', true);
			return this;
		}
	});

}());
