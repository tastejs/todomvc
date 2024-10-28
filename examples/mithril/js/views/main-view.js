'use strict';
/*global m */
var app = app || {};

app.MainView = {
	view: function (vnode) {
		var ctrl = vnode.attrs.ctrl;
		return [
			m('header.header', [
				m('h1', 'todos'),
				m(app.InputView, {ctrl: ctrl}),
			]),
			m('section.main', {
				style: {
					display: ctrl.list.length ? '' : 'none'
				}
			}, [
				m('input#toggle-all.toggle-all[type=checkbox]', {
					onclick: function () {
						ctrl.toggleAll();
					},
					checked: ctrl.allCompleted()
				}),
				m('label', {
					for: 'toggle-all'
				}),
				m('ul.todo-list', [
					ctrl.list
						.filter(function (task) {
							return ctrl.isVisible(task);
						})
						.map(function (task, index) {
							return m(app.TodoView, {
								ctrl: ctrl,
								task: task,
								index: index
							});
						})
				])
			]),
			ctrl.list.length === 0 ? '' : m(app.FooterView, {
				amountCompleted: ctrl.amountCompleted(),
				list: ctrl.list,
				filter: ctrl.filter(),
				clearCompleted: function () {
					ctrl.clearCompleted();
				}
			})
		];
	}
};
