Ext.define('Todo.store.Tasks', {
    extend: 'Ext.data.Store',
    fields: ['label', 'checked'],
    data: [
        {label: 'task one', checked: false},
        {label: 'task two', checked: true}
    ]
});
