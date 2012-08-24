/*global define*/

define(['marionette'], function (Marionette) {
  "use strict";

  return Marionette.View.extend({
    tagName : 'span',
    initialize : function() {
      this.collection.on('all',this.render,this);
    },
    render : function() {
      this.$el.html(this.collection.getActive().length);
    }
  });

});
