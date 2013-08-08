/*global define*/
define([
    'dollar',
    'mo/lang',
    'mo/template',
    'mo/mainloop',
    'mo/key',
    'eventmaster',
    'soviet',
    './view/picker',
    './view/actionview',
    './view/alert',
    './view/confirm',
    './view/list',
    'mo/domready'
], function ($, _, tpl, mainloop, key, event, soviet,
    picker, actionView, alert, confirm,
    listView) {
	'use strict';

    var doc = $(document),
        statusBox;

    var clickEvents = {

        '.todo-actionview > footer .cancel': function () {
            actionView.current.cancel();
        },

        '.todo-actionview > footer .confirm': function () {
            actionView.current.confirm();
        },

        '#filters .todo-option': function () {
            view.event.fire('todo:switch', [this.href]);
        },

        '#toggle-all': function () {
            view.event.fire('todo:toggle');
            return true;
        },

        '#todo-list .toggle': function () {
            var iid = $(this).closest('li').data('iid');
            view.event.fire('todo:toggle', [iid]);
            return true;
        },

        '#clear-completed': function () {
            view.confirmDestory(function () {
                view.event.fire('todo:destroy-completed');
            });
        },

        '#todo-list .destroy': function () {
            var iid = $(this).closest('li').data('iid');
            view.confirmDestory(function () {
                view.event.fire('todo:destroy', [iid]);
            });
        }

    };

    var doubleEvents = {

        '#todo-list .view label': function () {
            var li = $(this).closest('li');
            li.addClass('editing');
            li.find('.edit').once('blur', function () {
                li.removeClass('editing');
                view.event.fire('todo:edited', [
                    li.data('iid'),
                    $(this).val()
                ]);
            }).trigger('focus');
        }
    
    };

    var pressEvents = {

        '#new-todo': function (e) {
            if ('return' === key.KEYS_CODE[e.which]) {
                view.event.fire('todo:create', [this.value]);
                this.value = '';
            }
            return true;
        },

        '#todo-list .edit': function (e) {
            if ('return' === key.KEYS_CODE[e.which]) {
                $(this).trigger('blur');
            }
            return true;
        }

    };

    var view = {
    
        event: event(),

        init: function () {

            statusBox = $('#footer');

            listView.init();
            $('#new-todo').removeAttr('disabled').trigger('focus');

            this.delegate = soviet(doc, {
                matchesSelector: true,
                preventDefault: true,
                autoOverride: true
            }).on('click', clickEvents)
                .on('dblclick', doubleEvents)
                //.on('picker:change', pickerEvents)
                .on('keypress', pressEvents);

        },

        updateStatus: function (data) {
            statusBox[0].innerHTML = tpl.convertTpl('stats-template', data);
            var tab = statusBox.find('[href="#/' + data.listName + '"]');
            if (tab[0]) {
                picker('#filters').select(tab);
            }
        },

        confirmDestory: function (cb) {
            confirm('Are you sure you want to delete this todo ?', cb, {
                title: 'Prompt'
            });
        },

        alert: alert,
        confirm: confirm,
        list: listView

    };

    return view;

});
