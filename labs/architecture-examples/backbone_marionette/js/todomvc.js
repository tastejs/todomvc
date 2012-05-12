// An example Backbone/Backbone.Marionette application 
// contributed by [Derick Bailey](http://mutedsolutions.com)
// and build with [Backbone.Marionette](http://github.com/derickbailey/backbone.marionette).

// Define an application
var TodoMVC = new Backbone.Marionette.Application();

// Add regions to use
TodoMVC.addRegions({
  list: "#todo-list",
  stats: "#todo-stats"
});
