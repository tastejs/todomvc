'use strict';

interface ITodoAttrs {
	filter: string;
}

class MainView implements Mithril.Component<ITodoAttrs, ToDoController> {
	
	static ENTER_KEY = 13;
	static ESC_KEY = 27;
	static footer: Footer;

	oninit(vnode: Mithril.Vnode<ITodoAttrs, ToDoController> ) {	
		vnode.state = new ToDoController();	
		const item = {} as ITodoData;
		item.title = "";
		item.completed = false;
		item.editing = false;
		MainView.footer = new Footer();
	}

	// View utility
	static watchInput = (onenter, onescape) => {
		return function (e) {
			if (e.keyCode === MainView.ENTER_KEY) {
				onenter();
			} else if (e.keyCode === MainView.ESC_KEY) {
				onescape();
			}
		};
	};

	view(vnode: Mithril.Vnode<ITodoAttrs, ToDoController>) {
		var focused = false;
		//const self = this;
		const ctrl = vnode.state;
		const filterParam = vnode.attrs.filter;
		ctrl.filter(filterParam);
		return m("div", [
			m('header#header', [
				m('h1', 'todos'), m('input#new-todo[placeholder="WHAT needs to be done?"]', {
					onkeyup: MainView.watchInput(ctrl.add.bind(ctrl),
						ctrl.clearTitle.bind(ctrl)),
					value: ctrl.title(),
					oninput: m.withAttr('value', ctrl.title.bind(ctrl)),
					config: function (element) {
						if (!focused) {
							element.focus();
							focused = true;
						}
					}
				})
			]),
			m('section#main', {
				style: {
					display: ctrl.list.length ? '' : 'none'
				}
			}, [
					m('input#toggle-all[type=checkbox]', {
						onclick: ctrl.completeAll.bind(ctrl),
						checked: ctrl.allCompleted()
					}),
					m('ul#todo-list', [
						ctrl.list.filter(ctrl.isVisible.bind(ctrl)).map(function (task, index) {
							return m('li', {
								class: (function () {
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
										onkeyup: MainView.watchInput(
											ctrl.doneEditing.bind(ctrl, task, index),
											ctrl.cancelEditing.bind(ctrl, task)
										),
										oninput: m.withAttr('value', function (value) {
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
				]), ctrl.list.length === 0 ? '' : MainView.footer.view(vnode)
		]);
	}
}




