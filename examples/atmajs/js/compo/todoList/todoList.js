/*jshint newcap:false */
/*global include, mask, Compo*/

/*
 *	Todos Collection Component
 *
 *	Collection is passed as a model to this component
 */
include
	.load('todoList.mask')
	.js('todoTask/todoTask.js')
	.done(function (response) {
	'use strict';

	mask.registerHandler(':todoList', Compo({
		template: response.load.todoList,
		slots: {
			// Component's slots for the signals

			toggleAll: function (event) {
				var completed = event.currentTarget.checked;
				this.model.toggleAll(completed);
			},
			taskChanged: function () {
				this.model.save();
			},
			taskRemoved: function (event, task) {
				this.model.del(task);
			}
		}
	}));
});
