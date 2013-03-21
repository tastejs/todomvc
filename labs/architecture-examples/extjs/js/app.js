/*
 * ToDoMVC - ExtJS 4.1.1a
 * 
 * Date Created: November 10, 2012
 * Last Updated: March 17, 2013
 *
 */

/* global Ext */

Ext.Loader.setConfig({
    enabled: true
});

Ext.application({
    name: 'Todo',
    appFolder: 'js',

    stores: ['Tasks'],
    controllers: ['Tasks'],

    launch: function () {
        'use strict';

        Ext.create('Todo.view.Main');

        this.getTasksStore().load();

        Ext.History.init(function (history) {
            this.setRoute(history.getToken());
        }, this);

        Ext.History.on('change', this.setRoute, this);
        Ext.ComponentQuery.query('[name=newtask]')[0].focus();
    },

    setRoute: function (token) {
        'use strict';

        var store = this.getTasksStore(),
            btns  = Ext.ComponentQuery.query('button[action=changeView]');

        token = token || '/';

        Ext.each(btns, function (btn) {
            btn.getEl().down('span').applyStyles({'text-align': 'center', 'font-weight': (btn.href === '#' + token) ? 'bold': 'normal'});
        });

        store.clearFilter();

        if (token !== '/') {
            store.filter('completed', token === '/completed');
        }
    }
});