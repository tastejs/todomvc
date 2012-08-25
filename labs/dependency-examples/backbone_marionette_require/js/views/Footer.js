/*global define, $*/

define(['marionette','vent','templates','views/ActiveCount'], function (Marionette,vent,templates,ActiveCount) {
  "use strict";

  return Marionette.Layout.extend({
    template : templates.footer,
    regions : {
      count : '#todo-count strong'
    },
    ui : {
      filters : '#filters a'
    },
    events : {
      'click #clear-completed' : 'clearCompletedClick',
      'click #filters a' : 'onFilterClick'
    },
    onRender : function() {
      this.count.show(new ActiveCount({collection : this.collection}));
    },
    onFilterClick : function(evt) {
      this.ui.filters.removeClass('selected');
      $(evt.currentTarget).addClass('selected');
    },
    clearCompletedClick : function() {
      vent.trigger('todoList:clear:completed');
    }
  });

});
