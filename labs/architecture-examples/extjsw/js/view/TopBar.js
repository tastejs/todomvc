Ext.define('Todo.view.TopBar', {
    extend:'Ext.toolbar.Toolbar',
    alias:'widget.todo_topbar',
    items:[
        {
            xtype:'checkbox',
            cls:'check-all',
            checked:false,
            width:36
        },
        {
            xtype:'textfield',
            flex:1,
            emptyText:'What needs to be done?'
        }
    ]
});
