Ext.define('Todo.view.BottomBar', {
    extend:'Ext.toolbar.Toolbar',
    alias:'widget.todo_bottombar',
    hidden:true,
    items:[
        {
            xtype:'box',
            itemId:'uncompleted',
            tpl:Ext.create('Ext.Template', '<strong>{count}</strong> items left.'),
            data:{count:0}
        },
        '->',
        {
            xtype:'box',
            contentEl:'filters'
        },
        '->',
        {
            tpl:Ext.create('Ext.Template', 'Clear completed ({count})'),
            data:{count:0},
            hidden:true,
            itemId:'completed'
        }
    ]
});
