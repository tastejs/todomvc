/*global Epitome, App */
/*jshint mootools:true */
(function (window) {
	'use strict';

	window.App = window.App || {};

	App.MainView = new Class({
		// main view (presenter) encapsulating the app itself.

		Extends: Epitome.View,

		options: {
			// eavesdrop on these events
			events: {
				'change:relay(#new-todo)': 'addTodo',
				'keypress:relay(#new-todo)': 'handleKeypress',
				'click:relay(#toggle-all)': 'toggleAll',
				'click:relay(#clear-completed)': 'clearCompleted',
				'click:relay(#filters.a)': 'setFilters'
			},

			// pass on some options for later func
			newTodo: 'new-todo',

			footer: 'footer',

			main: 'main',

			filters: '#filters li a',

			toggleAll: 'toggle-all',

			onToggleAll: function (e, el) {
				// all todos will change their models to the new completed value
				var state = !!el.get('checked');
				this.collection.each(function (model) {
					model.set('completed', state);
				});
			},

			onHandleKeypress: function (e) {
				// on enter, submit.
				if (e.key === 'enter') {
					this.addTodo();
				}
			},

			onClearCompleted: function () {
				// because removing a model re-indexes so we don't get a sparse array, cannot apply that in a normal loop.
				var toRemove = this.collection.filter(function (model) {
					return model.get('completed');
				});

				// removeModel actually supports a single model or an array of models as arguments.
				this.collection.removeModel(toRemove);
				this.render();
			},

			onAddTodo: function () {
				// go to method
				this.addTodo();
			},

			'onChange:collection': function () {
				// also, re-render on change of collection
				this.render();
			},

			'onRemove:collection': function () {
				this.render();
			},

			'onAdd:collection': function () {
				// when adding, re-render.
				this.render();
			}
		},

		initialize: function (options) {
			// call default view constructor.
			this.parent(options);

			// store some pointers to static elements
			this.newTodo = document.id(this.options.newTodo);
			this.footer = document.id(this.options.footer);
			this.toggleAll = document.id(this.options.toggleAll);
			this.main = document.id(this.options.main);

			// draw it.
			this.render();
		},

		addTodo: function () {
			// adding a new model when data exists
			var val = this.newTodo.get('value').trim();

			if (val.length) {
				this.collection.addModel({
					title: val,
					completed: false
				});
			}

			// clear the input
			this.newTodo.set('value', '');
		},

		render: function () {
			// main method to output everything. well. the footer anyway.

			// work out what we have remaining and what is complete
			var remaining = 0;

			var completed = this.collection.filter(function (model) {
				var status = model.get('completed');

				if (status === false) {
					remaining++;
				}

				return status;
			}).length;

			var visibleClass = remaining || completed ? '' : 'hidden';

			// output footer
			this.footer.set('html', this.template({
				completed: completed,
				remaining: remaining
			})).set('class', visibleClass);

			this.main.set('class', visibleClass);

			// auto-correct the toggle-all checkbox with the new stats.
			this.toggleAll.set('checked', this.collection.length ? !remaining : false);
		}
	});
})(window);
