/* global cs, UUIDjs, _ */
(function () {
	'use strict';

	// data model: Todo List entity
	cs.ns('app.dm').TodoList = cs.clazz({
		dynamics: {
			items: []
		},
		cons: function (obj) {
			_.assign(this, _.pick(obj, function (val, key) { return _.has(this, key); }, this));
		},
		protos: {
			itemAdd: function (item) { this.items.push(item); },
			itemDel: function (item) { this.items = _.without(this.items, item); },
			itemById: function (id) { return _.find(this.items, { id: id }); }
		}
	});

	// data model: Todo Item entity
	cs.ns('app.dm').TodoItem = cs.clazz({
		dynamics: {
			id: '0',
			title: '',
			completed: false
		},
		cons: function (obj) {
			this.id = UUIDjs.create(1).hex;
			_.assign(this, _.pick(obj, function (val, key) { return _.has(this, key); }, this));
		}
	});
}());
