/* global cs, app, Router, $ */
(function () {
	'use strict';

	// component of the 'main' UI composite
	cs.ns('app.ui.composite').main = cs.clazz({
		mixin: [cs.marker.controller, cs.marker.view],
		protos: {
			create: function () {
				// create todo widget components and auto-increase their state with us
				cs(this).create('todo-model/todo-view', app.ui.widget.todo.model, app.ui.widget.todo.view);
				cs(this).property('ComponentJS:state-auto-increase', true);
			},
			prepare: function () {
				var self = this;
				var todoModel = cs(self, '//todo-model');

				// two-way bind URL route to presentation model
				var router = new Router({
					'/': function () { todoFilterSelect('all'); },
					'/active': function () { todoFilterSelect('active'); },
					'/completed': function () { todoFilterSelect('completed'); }
				});
				var todoFilterSelect = function (filter) {
					todoModel.value('state:status-filter-selected', filter);
					todoModel.value('cmd:item-list-updated', true);
				};
				todoModel.observe({ name: 'event:status-filter-select', func: function (ev, value) {
					var route = '/' + value;
					if (route === '/all') {
						route = '/';
					}
					if (router.getRoute() !== route) {
						window.location.hash = '#' + route;
						router.setRoute(route);
					}
				}});
				router.init();

				// transfer business model into presentation model
				var bm2pm = function () {
					var bmTodoList = app.sv.todo();
					var pmItems = bmTodoList.items.map(function (bmTodoItem) {
						return {
							id: bmTodoItem.id,
							title: bmTodoItem.title,
							completed: bmTodoItem.completed,
							editing: false
						};
					});
					todoModel.value('data:item-list', pmItems);
					todoModel.value('cmd:item-list-updated', true);
				};

				// react on item CRUD model event value changes
				todoModel.observe({ name: 'event:new-item-create', func: function (/* ev, value */) {
					var text = todoModel.value('data:new-item-text');
					todoModel.value('data:new-item-text', '');
					var todoList = app.sv.todo();
					var todoItem = new app.dm.TodoItem({ title: text });
					todoList.itemAdd(todoItem);
					app.sv.save();
					bm2pm();
				}});
				todoModel.observe({ name: 'event:item-list-item-modified', func: function (ev, item) {
					var todoList = app.sv.todo();
					var todoItem = todoList.itemById(item.id);
					todoItem.title = item.title;
					todoItem.completed = item.completed;
					app.sv.save();
					bm2pm();
				}});
				todoModel.observe({ name: 'event:item-list-item-removed', func: function (ev, item) {
					var todoList = app.sv.todo();
					var todoItem = todoList.itemById(item.id);
					todoList.itemDel(todoItem);
					app.sv.save();
					bm2pm();
				}});

				// initially load business model and trigger transfer into presentation model
				app.sv.load();
				bm2pm();
			},
			render: function () {
				// render view mask
				var ui = $.markup('main');
				cs(this).plug(ui);
				cs(this).socket({ ctx: $('.main__todo', ui), spool: 'materialized' });
			}
		}
	});
}());
