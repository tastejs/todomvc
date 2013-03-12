Ext.define('Todo.store.Tasks', {
	extend: 'Ext.data.Store',
	model: 'Todo.model.Task',

	autoSync: false
});
