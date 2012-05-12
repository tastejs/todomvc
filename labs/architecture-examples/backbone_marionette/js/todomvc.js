// An example Backbone/Backbone.Marionette application 
// contributed by [Derick Bailey](http://mutedsolutions.com)
// and build with [Backbone.Marionette](http://github.com/derickbailey/backbone.marionette).

// Define an application
var TodoMVC = new Backbone.Marionette.Application();

// Regions are visual areas of the DOM, where specific views
// will be displayed. 
//
// The `todo-list` region is the <ul> list of todo items.
// The `todo-stats` region is the stats display below the list
TodoMVC.addRegions({
  list: "#todo-list",
  stats: "#todo-stats"
});
