'use strict';
/*global m */
var app = app || {};

app.footer = function (ctrl) {
	var amountCompleted = ctrl.amountCompleted();
	var amountActive = ctrl.list.length - amountCompleted;

	return m('footer#footer', [
		m('span#todo-count', [
			m('strong', amountActive), ' item' + (amountActive !== 1 ? 's' : '') + ' left'
		]),
		m('ul#filters', [
			m('li', [
				m('a[href=/]', {
					config: m.route,
					class: ctrl.filter() === '' ? 'selected' : ''
				}, 'All')
			]),
			m('li', [
				m('a[href=/active]', {
					config: m.route,
					class: ctrl.filter() === 'active' ? 'selected' : ''
				}, 'Active')
			]),
			m('li', [
				m('a[href=/completed]', {
					config: m.route,
					class: ctrl.filter() === 'completed' ? 'selected' : ''
				}, 'Completed')
			])
		]), ctrl.amountCompleted() === 0 ? '' : m('button#clear-completed', {
			onclick: ctrl.clearCompleted.bind(ctrl)
		}, 'Clear completed')
	]);
};
