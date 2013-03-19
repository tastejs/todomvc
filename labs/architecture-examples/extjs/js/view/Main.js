/* global Ext */

Ext.define('Todo.view.Main', {
    extend: 'Ext.container.Viewport',
    alias: 'widget.mainview',

    layout: {
        type: 'vbox',
        align: 'center'
    },

    autoScroll: true,

    defaults: {
        xtype: 'container',
        baseCls: null,
        width: 550
    },

    config: {
        items: [{
            cls: 'header',
            height: 130,
            html: 'todos'
        }, {
            cls: 'todoapp',
            id: 'todoapp',
            items: [{
                baseCls: null,
                xtype: 'container',
                cls: 'new-todo',
                layout: 'hbox',
                height: 80,
                items: [{
                    xtype: 'container',
                    baseCls: null,
                    width: 40,
                    items: [{
                        xtype: 'button',
                        ui: 'plain',
                        cls: 'toggle-all-button',
                        text: '»',
                        enableToggle: true,
                        action: 'toggleAll'
                    }]
                }, {
                    flex: 1,
                    cls: 'edit',
                    xtype: 'textfield',
                    height: 64,
                    name: 'newtask',
                    enableKeyEvents: true,
                    emptyText: 'What needs to be done?'
                }]
            }, {
                cls: 'todo-list',
                xtype: 'taskList'
            }]
        }, {
            xtype: 'container',
            cls: 'footer',
            height: 40,
            hidden: true,
            baseCls: null,
            layout: {
                type: 'hbox',
                align: 'stretch'
            },
            items: [{
                flex: 1,
                baseCls: null,
                style: 'text-align: left; padding: 1px;',
                name: 'itemsLeft',
                data: { counts: 0 },
                tpl: [
                    '<tpl><span id="todo-count"><strong>{counts}</strong> item',
                    '<tpl if="counts &gt; 1">s</tpl>',
                    '<tpl if="counts == 0">s</tpl>',
                    ' left</span>',
                    '</tpl>'
                ]
            }, {
                xtype: 'container',
                baseCls: 'filters',
                layout: {
                    type: 'hbox',
                    pack: 'center'
                },
                defaults: {
                    xtype: 'button',
                    ui: 'plain',
                    height: 19,
                    style: 'padding: 0px 2px;',
                    baseCls: 'padme',
                    hrefTarget: '_self'
                },
                items: [{
                    text: 'All',
                    action: 'changeView',
                    href: '#/'
                }, {
                    text: 'Active',
                    action: 'changeView',
                    href: '#/active'
                }, {
                    text: 'Completed',
                    action: 'changeView',
                    href: '#/completed'
                }]
            }, {
                flex: 1,
                baseCls: 'null',
                xtype: 'container',
                height: 28,
                items: [{
                    xtype: 'button',
                    hidden: true,
                    baseCls: 'padme',
                    action: 'clearCompleted',
                    cls: 'clear-completed',
                    text: 'Clear completed'
                }]
            }]
        }, {
            xtype: 'container',
            cls: 'info',
            baseCls: null,
            html: [
                '<p>Double-click to edit a todo</p>',
                '<p>Inspired by the official <a href="https://github.com/maccman/spine.todos">Spine.Todos</a></p>',
                '<p>Revised by Kevin Cassidy</p>'
            ].join('')
        }]
    }
});