Ext.define('Todo.view.TaskList' , {
    store: 'Tasks',
    loadMask: false,
    itemSelector: 'li',
    extend: 'Ext.view.View',
    alias : 'widget.taskList',
    tpl: Ext.create('Ext.XTemplate',
        '<ul id="todo-list"><tpl for=".">',
            '<li>',
                '<div class="view">',
                    '<input type="checkbox" {[values.checked ? "checked" : ""]} />',
                    '<span class="{[values.checked ? "checked" : ""]}">{label}</span>',
                    '<a class="destroy"></a>',
                '</div>',
                '<input class="edit" type="text">',
            '</li>',
        '</tpl></ul>',
        {compiled: true}
    )
});
