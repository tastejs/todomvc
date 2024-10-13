'use strict';
/*global m */
var app = app || {};

app.FooterView = {
	view: function (vnode) {
		var amountCompleted = vnode.attrs.amountCompleted;
		var amountActive = vnode.attrs.list.length - amountCompleted;

		return m('footer.footer', [
			m('span.todo-count', [
				m('strong', amountActive), ' item', amountActive !== 1 ? 's' : '', ' left'
			]),
			m('ul.filters', [
				m('li', [
					m(m.route.Link, {
						href: '/',
						class: vnode.attrs.filter === '' ? 'selected' : ''
					}, 'All')
				]),
				m('li', [
					m(m.route.Link, {
						href: '/active',
						class: vnode.attrs.filter === 'active' ? 'selected' : ''
					}, 'Active')
				]),
				m('li', [
					m(m.route.Link, {
						href: '/completed',
						class: vnode.attrs.filter === 'completed' ? 'selected' : ''
					}, 'Completed')
				])
			]),
			amountCompleted === 0 ? '' : m('button.clear-completed', {
				onclick: vnode.attrs.clearCompleted
			}, 'Clear completed')
		]);
	}
};
