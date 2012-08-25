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
      'click #clear-completed' : 'onClearClick'
    },
    initialize : function() {
      this.bindTo(vent, 'todoList:filter', this.updateFilterSelection, this);
    },
    onRender : function() {
      this.count.show(new ActiveCount({collection : this.collection}));
    },
    updateFilterSelection : function(filter) {
      this.ui.filters.removeClass('selected').filter('[href="#/' + filter + '"]').addClass('selected');
    },
    onClearClick : function() {
      vent.trigger('todoList:clear:completed');
    }
  });

});
