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

		action: '',

		pipes: {

			// To manage the communication within hierarchical components
			// (ancestors/descendants) you should use `slot-signal` pattern.
			//
			// To bind any components in an app use `piped_slot-signal` feature.
			// Here we listen for signals in the `filter` pipe, which are
			// emitted by `:filter` component
			filter: {
				action: function (action) {

					this.action = action;
				}
			}
		},

		slots: {
			// Component's slots for the signals,
			// defined in the template and in a single tasks's template

			toggleAll: function (event) {
				this
					.model
					.each(function (task) {
						task.completed = event.currentTarget.checked;
					})
					.save();
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
