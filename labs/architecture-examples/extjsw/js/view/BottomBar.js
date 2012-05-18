Ext.define('Todo.view.BottomBar', {
    extend:'Ext.toolbar.Toolbar',
    alias:'widget.todo_bottombar',
    cls:'todo-app-bbar',
    hidden:true,
    height:33,
    items:[
        {
            xtype:'box',
            itemId:'uncompleted',
            tpl:Ext.create('Ext.Template', '<strong>{count:plural("item")}</strong> left.'),
            data:{count:0}
        },
        '->',
        {
            xtype:'box',
            itemId:'filters',
            cls:'filters',
            html: '<a class="selected" href="#/">All</a>' +
                  '<a href="#/active">Active</a>' +
                  '<a href="#/completed">Completed</a>'
        },
        '->',
        {
            textTpl:Ext.create('Ext.Template', 'Clear completed ({count})'),
            hidden:true,
            itemId:'completed'
        }
    ]
});
