/*global YUI*/
YUI.add('todo', function (Y) {
	'use strict';

	// -- Todo Model -------------
	var Todo = Y.Base.create('todo', Y.Model, [Y.ModelSync.Local], {
		// Set up the root localStorage key we save our Model data in.
		root: 'todos-yui',

		// Toggle the completed state of the Todo.
		toggle: function () {
			this.save({completed: !this.get('completed')});
		},

		// Destroy this Todo and remove it from localStorage.
		clear: function () {
			this.destroy({remove: true});
		}
	}, {
		// Default attributes.
		ATTRS: {
			title: {
				value: ''
			},
			completed: {
				value: false
			}
		}
	});

	// Set this Model under our custom Y.MVC namespace.
	Y.namespace('TodoMVC').Todo = Todo;

}, '@VERSION@', {
	requires: [
		'gallery-model-sync-local',
		'model'
	]
});
