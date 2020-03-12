'use strict';
/*global m */
var app = app || {};

// View utility
app.watchInput = function (onenter, onescape) {
	return function (e) {
		m.redraw.strategy('none');
		if (e.keyCode === app.ENTER_KEY) {
			onenter();
			m.redraw.strategy('diff');
		} else if (e.keyCode === app.ESC_KEY) {
			onescape();
			m.redraw.strategy('diff');
		}
	};
};

app.view = (function () {
	var focused = false;

	return function (ctrl) {
		return [
			m('header.header', [
				m('h1', 'todos'), m('input.new-todo[placeholder="What needs to be done?"]', {
					onkeyup: app.watchInput(ctrl.add.bind(ctrl),
						ctrl.clearTitle.bind(ctrl)),
					value: ctrl.title(),
					oninput: m.withAttr('value', ctrl.title),
					config: function (element) {
						if (!focused) {
							element.focus();
							focused = true;
						}
					}
				})
			]),
			m('section.main', {
				style: {
					display: ctrl.list.length ? '' : 'none'
				}
			}, [
				m('input#toggle-all.toggle-all[type=checkbox]', {
					onclick: ctrl.completeAll.bind(ctrl),
					checked: ctrl.allCompleted()
				}),
				m('label', {
					for: 'toggle-all'
				}),
				m('ul.todo-list', [
					ctrl.list.filter(ctrl.isVisible.bind(ctrl)).map(function (task, index) {
						return m('li', { class: (function () {
							var classes = '';
							classes += task.completed() ? 'completed' : '';
							classes += task.editing() ? ' editing' : '';
							return classes;
						})(),
						key: task.key
						}, [
							m('.view', [
								m('input.toggle[type=checkbox]', {
									onclick: m.withAttr('checked', ctrl.complete.bind(ctrl, task)),
									checked: task.completed()
								}),
								m('label', {
									ondblclick: ctrl.edit.bind(ctrl, task)
								}, task.title()),
								m('button.destroy', {
									onclick: ctrl.remove.bind(ctrl, index)
								})
							]), m('input.edit', {
								value: task.title(),
								onkeyup: app.watchInput(
									ctrl.doneEditing.bind(ctrl, task, index),
									ctrl.cancelEditing.bind(ctrl, task)
								),
								oninput: m.withAttr('value', function (value) {
									m.redraw.strategy('none');
									task.title(value);
								}),
								config: function (element) {
									if (task.editing()) {
										element.focus();
									}
								},
								onblur: ctrl.doneEditing.bind(ctrl, task, index)
							})
						]);
					})
				])
			]), ctrl.list.length === 0 ? '' : app.footer(ctrl)
		];
	}
})();
