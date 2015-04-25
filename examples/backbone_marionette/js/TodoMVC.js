/*global Backbone */
'use strict';

// TodoMVC is global for developing in the console
// and functional testing.
var App = Backbone.Marionette.Application.extend({
  setRootLayout: function() {
    this.root = new TodoMVC.Layout.Root();
  }
});

window.TodoMVC = new App();

(function () {
  var filterState = new Backbone.Model({
    filter: 'all'
  });

  TodoMVC.reqres.setHandler('filterState', function () {
    return filterState;
  });
})();

TodoMVC.on('before:start', function () {
  TodoMVC.setRootLayout();
});
