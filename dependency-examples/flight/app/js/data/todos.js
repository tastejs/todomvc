/*global define */
'use strict';

define([
	'flight/component',
	'../store'
], function (defineComponent, dataStore) {
	function todos() {
		var filter;

		this.add = function (e, data) {
			var todo = dataStore.save({
				title: data.title,
				completed: false
			});

			this.trigger('dataTodoAdded', { todo: todo, filter: filter });
		};

		this.remove = function (e, data) {
			var todo = dataStore.destroy(data.id);

			this.trigger('dataTodoRemoved', todo);
		};

		this.load = function () {
			var todos;

			filter = localStorage.getItem('filter');
			todos = this.find();
			this.trigger('dataTodosLoaded', { todos: todos });
		};

		this.update = function (e, data) {
			dataStore.save(data);
		};

		this.toggleCompleted = function (e, data) {
			var eventType;
			var todo = dataStore.get(data.id);

			todo.completed = !todo.completed;
			dataStore.save(todo);

			eventType = filter ? 'dataTodoRemoved' : 'dataTodoToggled';

			this.trigger(eventType, todo);
		};

		this.toggleAllCompleted = function (e, data) {
			dataStore.updateAll({ completed: data.completed });
			this.trigger('dataTodoToggledAll', { todos: this.find(filter) });
		};

		this.filter = function (e, data) {
			var todos;

			localStorage.setItem('filter', data.filter);
			filter = data.filter;
			todos = this.find();

			this.trigger('dataTodosFiltered', { todos: todos });
		};

		this.find = function () {
			var todos;

			if (filter) {
				todos = dataStore.find(function (each) {
					return (typeof each[filter] !== 'undefined') ? each.completed : !each.completed;
				});
			} else {
				todos = dataStore.all();
			}

			return todos;
		};

		this.clearCompleted = function () {
			dataStore.destroyAll({ completed: true });

			this.trigger('uiFilterRequested', { filter: filter });
			this.trigger('dataClearedCompleted');
		};

		this.after('initialize', function () {
			this.on(document, 'uiAddRequested', this.add);
			this.on(document, 'uiUpdateRequested', this.update);
			this.on(document, 'uiRemoveRequested', this.remove);
			this.on(document, 'uiLoadRequested', this.load);
			this.on(document, 'uiToggleRequested', this.toggleCompleted);
			this.on(document, 'uiToggleAllRequested', this.toggleAllCompleted);
			this.on(document, 'uiClearRequested', this.clearCompleted);
			this.on(document, 'uiFilterRequested', this.filter);
		});
	}

	return defineComponent(todos);
});
