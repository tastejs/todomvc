Ext.define('Todo.view.TaskList' , {
    store: 'Tasks',
    loadMask: false,
    itemSelector: 'li',
    extend: 'Ext.view.View',
    alias : 'widget.taskList',
    tpl: Ext.create('Ext.XTemplate',
        '<ul id="todo-list"><tpl for=".">',
            '<li class="<tpl if="checked">done</tpl>">',
                '<div class="view">',
                    '<input type="checkbox" <tpl if="checked">checked</tpl> /> ',
                    '<label>{label}</label>',
                    '<a class="destroy"></a>',
                '</div>',
                '<input class="edit" type="text">',
            '</li>',
        '</tpl></ul>',
        {compiled: true}
    )
});
