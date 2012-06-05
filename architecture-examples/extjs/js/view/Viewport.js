Ext.define('Todo.view.Viewport', {
    extend:'Ext.container.Viewport',
    requires:[
        'Ext.layout.container.Border',
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
            contentEl:'footer',
            region:'south'
        }
    ]
});