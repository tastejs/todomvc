Ext.define('Todo.model.Task', {
    extend:'Ext.data.Model',
    requires:['Ext.data.UuidGenerator'],
    fields:['id', 'title', {name:'completed', type:'boolean'}],
    proxy:{
        type:'localstorage',
        id:'todos-extjs'
    }
});
