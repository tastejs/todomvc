/* global cs, app, _ */
(function () {
	'use strict';

	// service tier
	cs.ns('app').sv = new cs.clazz({
		dynamics: {
			todoList: null,
			storageId: 'todos-componentjs'
		},
		protos: {
			todo: function () {
				return this.todoList;
			},
			load: function () {
				this.todoList = new app.dm.TodoList();
				if (_.has(localStorage, this.storageId)) {
					var obj = JSON.parse(localStorage[this.storageId]);
					this.todoList.items = _.map(obj.items, function (item) {
						return new app.dm.TodoItem(item);
					});
				}
			},
			save: function () {
				localStorage[this.storageId] = JSON.stringify(this.todoList);
			}
		}
	})();
}());
