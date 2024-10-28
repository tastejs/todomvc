'use strict';
/*global m */
var app = app || {};

app.InputView = function () {
	var focused = false;

	return {
		view: function (vnode) {
            var ctrl = vnode.attrs.ctrl;

			return m('input.new-todo[placeholder="What needs to be done?"]', {
                onkeyup: function (e) {
                    if (e.keyCode === app.ENTER_KEY) {
                        ctrl.add();
                    } else if (e.keyCode === app.ESC_KEY) {
                        ctrl.clearTitle();
                    }
                },
                value: ctrl.title,
                oninput: function (e) {
                    ctrl.title = e.target.value;
                },
                oncreate: function (vnode) {
                    if (!focused) {
                        vnode.dom.focus();
                        focused = true;
                    }
                },
                onupdate: function (vnode) {
                    if (!focused) {
                        vnode.dom.focus();
                        focused = true;
                    }
                }
            });
        }
	};
};
