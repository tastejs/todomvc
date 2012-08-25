/*global define*/

define(['marionette','templates','vent','views/TodoItemView'], function (Marionette,templates,vent,ItemView) {
  "use strict";

  return Marionette.CompositeView.extend({
    template : templates.todosCompositeView,
    itemView : ItemView,

    ui : {
      list   : '#todo-list',
      toggle : '#toggle-all'
    },

    events : {
      'click #toggle-all' : 'onToggleAllClick'
    },

    initialize : function() {
      this.bindTo(this.collection, 'all', this.updateToggleCheckbox, this);
    },

    onRender : function() {
      this.updateToggleCheckbox();
    },

    updateToggleCheckbox : function() {
      function reduceCompleted(left, right) { return left && right.get('completed'); }
      var allCompleted = this.collection.reduce(reduceCompleted,true);
      this.ui.toggle.prop('checked', allCompleted);
    },

    appendHtml : function(collectionView, itemView) {
      this.ui.list.append(itemView.el);
    },

    onToggleAllClick : function(evt) {
      var isChecked = evt.currentTarget.checked;
      this.collection.each(function(todo){
        todo.save({'completed': isChecked});
      });
    }
  });
});

