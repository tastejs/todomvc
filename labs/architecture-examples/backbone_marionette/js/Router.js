
var Router = Backbone.Marionette.AppRouter.extend({
  appRoutes : {
    '*filter': 'setFilter'
  },
  controller : {
    setFilter : function(param) {
      app.vent.trigger('todoList:filter', param.trim() || '');
    }
  }
});
