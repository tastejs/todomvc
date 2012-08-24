/*global define*/

define(['marionette','templates','vent','views/TodoItemView'], function (Marionette,templates,vent,ItemView) {
  "use strict";

  return Marionette.CompositeView.extend({
    template : templates.todosCompositeView,
    itemView : ItemView,
    ui : {
      list      : '#todo-list',
      toggleAll : '#toggle-all'
    },
    events : {
      'click #toggle-all' : 'toggleAllClick'
    },
    initialize : function() {
      this.bindTo(vent, 'todoList:filter', this.setFilter, this);
      this.bindTo(this.collection, 'all', this.updateToggleCheckbox, this);
    },
    onRender : function() {
      this.updateToggleCheckbox();
    },
    updateToggleCheckbox : function() {
      var allCompleted = this.collection.reduce(function(l, r){
        return l && r.get('completed');
      },true);
      this.ui.toggleAll.prop('checked', allCompleted);
    },
    appendHtml : function(collectionView, itemView) {
      this.ui.list.append(itemView.el);
    },
    setFilter : function(filter) {
      this.ui.list.removeClass('filter-all filter-completed filter-active').addClass('filter-' + filter);
    },
    toggleAllClick : function(evt) {
      var isChecked = evt.currentTarget.checked;
      this.collection.each(function(todo){
        todo.save({'completed': isChecked});
      });
    }
  });
});

