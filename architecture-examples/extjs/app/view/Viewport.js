Ext.define('Todo.view.Viewport', {
    extend:'Ext.container.Viewport',
    requires:[
        'Ext.layout.container.Column',
        'Ext.layout.container.Anchor',
        'Todo.view.TopBar',
        'Todo.view.List',
        'Todo.view.BottomBar'
    ],
    layout:'column',
    items:[
        {
            //Left spacer
            xtype:'box',
            columnWidth:0.25,
            html:'&nbsp;'
        },
        {
            xtype:'container',
            layout:'anchor',
            defaults:{anchor:'100%'},
            columnWidth:0.5,
            items:[
                {
                    xtype:'box',
                    autoEl:{
                        tag:'h1',
                        html:'todos'
                    }
                },
                {
                    xtype:'todo_list',
                    dockedItems:[
                        {xtype:'todo_topbar', dock:'top'},
                        {xtype:'todo_bottombar', dock:'bottom'}
                    ]
                },
                {
                    xtype:'box',
                    contentEl:'footer'
                }
            ]
        },
        {
            //Right spacer
            xtype:'box',
            columnWidth:0.25,
            html:'&nbsp;'
        }
    ]
});