Ext.define('Todo.store.Tasks', {
    extend:'Ext.data.Store',
    model:'Todo.model.Task',
    autoLoad:true,
    autoSync:true
});
