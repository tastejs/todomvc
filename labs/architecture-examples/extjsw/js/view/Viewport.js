Ext.define('Todo.view.Viewport', {
    extend:'Ext.container.Viewport',
    requires:[
        'Todo.view.TopBar',
        'Todo.view.List',
        'Todo.view.BottomBar'
    ],
    layout:'border',
    items:[
        {
            xtype:'box',
            autoEl:{
                tag:'h1',
                html:'Todos'
            },
            region:'north'
        },
        {
            //Left spacer
            xtype:'box',
            region:'west',
            flex:1
        },
        {
            xtype:'todo_list',
            region:'center',
            dockedItems:[
                {xtype:'todo_topbar', dock:'top'},
                {xtype:'todo_bottombar', dock:'bottom'}
            ],
            flex:2
        },
        {
            //Right spacer
            xtype:'box',
            region:'east',
            flex:1
        },
        {
            xtype:'box',
            autoEl:{
                tag:'footer',
                html:'<p>Double-click to edit a todo</p>' +
                     '<p>Created by <a href="http://revolunet.com/">Revolunet</a>.</p>' +
                     '<p>Updates and Edits by <a href="http://github.com/boushley">Aaron Boushley</a></p>' +
                     '<p>Total refactor by <a href="http://github.com/ettavolt">Arseniy Skvortsov</a></p>' +
                     '<p>Part of <a href="http://todomvc.com">TodoMVC</a></p>'
            },
            region:'south'
        }
    ]
});