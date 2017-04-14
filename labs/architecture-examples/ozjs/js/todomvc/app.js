/*global define*/
define([
    'mo/lang',
    'mo/template/string',
    'nerv',
    'urlkit',
    './model/list',
    './view'
], function (_, str, nerv, urlkit,
    listModel, view) {
	'use strict';

    urlkit.config({
        disablePushState: true
    });

    var list = listModel(),
        url = urlkit({
            baseUrl: location.href.replace(/#.*/, '')
        }),
        actions = view.event;

    actions.on('todo:create', function (text) {
        list.addItem({
            title: text
        });
    });

    actions.on('todo:edited', function (iid, text) {
        list.get(list.findItemById(iid)).set('title', text);
    });

    actions.on('todo:toggle', function (iid) {
        if (iid) {
            list.get(list.findItemById(iid)).toggle();
        } else {
            list.toggle();
        }
    });

    actions.on('todo:destroy', function (iid) {
        list.remove(list.findItemById(iid));
    });

    actions.on('todo:destroy-completed', function () {
        list.removeCompleted();
    });

    actions.on('todo:switch', function (href) {
        url.nav(0, urlkit.parse(href)[1] || false);
    });

    list.observer.on('change', function (changes) {
        var target = changes.object,
            listName = url.nav(0);
        if (listName === 'active') {
            app.showActiveList();
        } else if (listName === 'completed') {
            app.showCompleteList();
        } else if (target !== list) {
            view.list.updateItem(target.data());
            app.updateStatus();
        } else {
            app.updateListGraceful(list.data());
        }
        localStorage.todomvc = JSON.stringify(list.data());
    });

    url.route('default', function () {
        app.showNormalList();
    }).route([
        '/active'
    ], function () {
        app.showActiveList();
    }).route([
        '/completed'
    ], function () {
        app.showCompleteList();
    });

    var app = {

        init: function (opt) {
            view.init(opt);
            url.listen();
        },

        load: function () {
            var data = JSON.parse(localStorage.todomvc || '[]');
            list.set(function () {
                data.forEach(function (itemData) {
                    list.addItem(itemData);
                });
            });
        },

        updateList: function (data) {
            view.list.update(data);
            this.updateStatus();
        },

        updateListGraceful: function (data) {
            view.list.updateGraceful(data);
            this.updateStatus();
        },

        showNormalList: function () {
            this.updateList(list.data());
        },

        showActiveList: function () {
            this.updateList(list.remainingData());
        },

        showCompleteList: function () {
            this.updateList(list.completedData());
        },

        updateStatus: function () {
            view.updateStatus({
                listName: url.nav(0) || '',
                completed: list.completedData().length,
                remaining: list.remainingData().length
            });
        },

        alert: view.alert,
        confirm: view.confirm
    
    };

    return app;

});
