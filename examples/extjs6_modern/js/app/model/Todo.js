Ext.define('TodoMVC.model.Todo', {
 extend: 'Ext.data.Model',
 fields: [
  'id', 'text', 'active', 'completed', 'delete'
 ],
 proxy: {
  type: 'localstorage',
  id: 'todos-extjs'
 }

});
