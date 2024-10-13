'use strict';
/*global m */
var app = app || {};

app.TodoView = {
    view: function (vnode) {
        var ctrl = vnode.attrs.ctrl;
        var task = vnode.attrs.task;
        var index = vnode.attrs.index;

        return m('li', {
            class: (
                (task.completed ? 'completed' : '') +
                (task.editing ? ' editing' : '') +
                ''
            ),
            key: task.key
        }, [
            m('.view', [
                m('input.toggle[type=checkbox]', {
                    onclick: function () {
                        ctrl.complete(task);
                    },
                    checked: task.completed
                }),
                m('label', {
                    ondblclick: function () {
                        ctrl.edit(task);
                    }
                }, task.title),
                m('button.destroy', {
                    onclick: function () {
                        ctrl.remove(index);
                    }
                })
            ]),
            m('input.edit', {
                value: task.title,
                onkeyup: function (e) {
                    if (e.keyCode === app.ENTER_KEY) {
                        ctrl.doneEditing(task, index);
                    } else if (e.keyCode === app.ESC_KEY) {
                        ctrl.cancelEditing(task);
                    }
                },
                oninput: function (e) {
                    e.redraw = false;
                    task.title = e.target.value;
                },
                oncreate: function (vnode) {
                    if (task.editing) {
                        vnode.dom.focus();
                    }
                },
                onupdate: function (vnode) {
                    if (task.editing) {
                        vnode.dom.focus();
                    }
                },
                onblur: function () {
                    ctrl.doneEditing(task, index);
                }
            })
        ]);
    }
};
