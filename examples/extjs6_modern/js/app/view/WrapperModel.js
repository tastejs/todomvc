Ext.define('TodoMVC.view.WrapperModel', {
 extend: 'Ext.app.ViewModel',
 alias: 'viewmodel.todomvc',
 stores: {
  todomvc: {
   model: 'TodoMVC.model.Todo',
   listeners: {
    update: 'onUpdateRecord',
    remove: 'onRemoveRecord',
    add: 'onAddRecord',
    load: 'onLoadStore'
   }
  }
 }
});
