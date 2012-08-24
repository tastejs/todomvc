/*global define*/

define(['marionette','vent','templates','views/ActiveCount'], function (Marionette,vent,templates,ActiveCount) {
  "use strict";

  return Marionette.Layout.extend({
    template : templates.footer,
    regions : {
      count : '#todo-count strong'
    },
    events : {
      'click #clear-completed' : 'clearCompletedClick'
    },
    onRender : function() {
      this.count.show(new ActiveCount({collection : this.collection}));
    },
    clearCompletedClick : function() {
      vent.trigger('todoList:clear:completed');
    }
  });

});
