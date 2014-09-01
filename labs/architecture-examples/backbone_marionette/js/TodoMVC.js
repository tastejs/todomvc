/*global Backbone */
'use strict';

// TodoMVC is global for developing in the console
// and functional testing.
window.TodoMVC = new Backbone.Marionette.Application();

(function () {
  var filterState = new Backbone.Model({
    filter: 'all'
  });

  TodoMVC.reqres.setHandler('filterState', function () {
    return filterState;
  });
})();

TodoMVC.addRegions({
	header: '#header',
	main: '#main',
	footer: '#footer'
});

TodoMVC.on('start', function () {
	Backbone.history.start();
});
