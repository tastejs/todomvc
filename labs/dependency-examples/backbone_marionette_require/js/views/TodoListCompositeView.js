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
      'click #toggle-all' : 'onToggleAllClick'
    },

    initialize : function() {
      this.bindTo(vent, 'todoList:filter', this.setFilter, this);
      this.bindTo(this.collection, 'all', this.updateToggleCheckbox, this);
    },

    onRender : function() {
      this.updateToggleCheckbox();
    },

    updateToggleCheckbox : function() {
      function reduceCompleted(left, right) { return left && right.get('completed'); }
      var allCompleted = this.collection.reduce(reduceCompleted,true);
      this.ui.toggleAll.prop('checked', allCompleted);
    },

    appendHtml : function(collectionView, itemView) {
      this.ui.list.append(itemView.el);
    },

    setFilter : function(filter) {
      this.ui.list.removeClass('filter-completed filter-active');
      if (filter) this.ui.list.addClass('filter-' + filter );
    },

    onToggleAllClick : function(evt) {
      var isChecked = evt.currentTarget.checked;
      this.collection.each(function(todo){
        todo.save({'completed': isChecked});
      });
    }
  });
});

