
var Footer = Backbone.Marionette.Layout.extend({
  template : "#template-footer",
  ui : {
    count   : '#todo-count strong',
    filters : '#filters a'
  },
  events : {
    'click #clear-completed' : 'onClearClick'
  },
  initialize : function() {
    this.bindTo(app.vent, 'todoList:filter', this.updateFilterSelection, this);
    this.bindTo(todoList, 'all', this.updateCount, this);
  },
  onRender : function() {
    this.updateCount();
  },
  updateCount : function() {
    this.ui.count.html(todoList.getActive().length);
  },
  updateFilterSelection : function(filter) {
    this.ui.filters.removeClass('selected').filter('[href="#/' + filter + '"]').addClass('selected');
  },
  onClearClick : function() {
    function destroy(todo)     { todo.destroy(); }
    todoList.getCompleted().forEach(destroy);
  }
});
