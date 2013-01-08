Ext.define('Todo.model.Task', {
	extend: 'Ext.data.Model',
	fields: ['id', 'label', {name: 'completed', type: 'boolean'}],

	proxy: {
		type: 'localstorage',
		id: 'todos-extjs'
	}
});
