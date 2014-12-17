/*global Backbone, ENTER_KEY */
var app = app || {};

(function () {
	'use strict';

	var Dispatcher = Backbone.Dispatcher.extend({
		initialize: function (actions) {
			this.createActions(actions);
		}
	});

	app.dispatcher = new Dispatcher([
		{
			name: 'createOnEnter',

			shouldEmit: function (payload) {

				if (payload.event.which === ENTER_KEY && payload.val) {
					return true;
				}

				return false;
			},

			beforeEmit: function (payload, next) {
				next(payload.title);
			}
		},

		'clearCompleted',
		'toggleAllComplete',
		'toggleTodoComplete',
		'editTodo',
		'removeTodo',
		'updateOnEnter',
		'filterOne',
		'filterAll'
	]);


})();
