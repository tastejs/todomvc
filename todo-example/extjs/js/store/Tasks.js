Ext.define('Todo.store.Tasks', {
    autoLoad: true,
    model: 'Todo.model.Task',
    extend: 'Ext.data.Store'
    // data: [
    //     {label: 'task one', checked: false},
    //     {label: 'task two', checked: true}
    // ]
});
