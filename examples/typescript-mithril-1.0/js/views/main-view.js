'use strict';
var MainView = (function () {
    function MainView() {
    }
    MainView.prototype.oninit = function (vnode) {
        vnode.state = new ToDoController();
        var item = {};
        item.title = "";
        item.completed = false;
        item.editing = false;
        MainView.footer = new Footer();
    };
    MainView.prototype.view = function (vnode) {
        var focused = false;
        //const self = this;
        var ctrl = vnode.state;
        var filterParam = vnode.attrs.filter;
        ctrl.filter(filterParam);
        return m("div", [
            m('header#header', [
                m('h1', 'todos'), m('input#new-todo[placeholder="WHAT needs to be done?"]', {
                    onkeyup: MainView.watchInput(ctrl.add.bind(ctrl), ctrl.clearTitle.bind(ctrl)),
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
                                onkeyup: MainView.watchInput(ctrl.doneEditing.bind(ctrl, task, index), ctrl.cancelEditing.bind(ctrl, task)),
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
    };
    return MainView;
}());
MainView.ENTER_KEY = 13;
MainView.ESC_KEY = 27;
// View utility
MainView.watchInput = function (onenter, onescape) {
    return function (e) {
        if (e.keyCode === MainView.ENTER_KEY) {
            onenter();
        }
        else if (e.keyCode === MainView.ESC_KEY) {
            onescape();
        }
    };
};
//# sourceMappingURL=main-view.js.map