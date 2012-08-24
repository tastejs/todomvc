/*global define*/

define(['marionette','templates'], function (Marionette,templates) {
  "use strict";

  return Marionette.CompositeView.extend({
    tagName : 'li',
    template : templates.todoItemView,

    ui : {
      edit : '.edit'
    },

    events : {
      'click .destroy' : 'destroy',
      'dblclick label' : 'editClick',
      'keypress .edit' : 'updateOnEnter',
      'click .toggle'  : 'toggle'
    },

    initialize : function() {
      this.model.on('change',this.render,this);
    },

    onRender : function() {
      this.$el.removeClass('active completed');
      if (this.model.get('completed')) this.$el.addClass('completed');
      else this.$el.addClass('active');
    },

    destroy : function() {
      this.model.destroy();
    },

    toggle  : function() {
      this.model.toggle().save();
    },

    editClick : function() {
      this.$el.addClass('editing');
      this.ui.edit.focus();
    },

    updateOnEnter : function(evt) {
      var ENTER_KEY = 13;
      var todoText = this.ui.edit.val().trim();

      if ( evt.which === ENTER_KEY && todoText ) {
        this.model.set('title', todoText).save();
        this.$el.removeClass('editing');
      }
    }
  });
});
