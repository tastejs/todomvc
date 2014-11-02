(function(global) {
  'use strict';

  // The app is the overall container for views and global state
  var app = derby.createApp();
  // Load templates that are defined with <script type="text/template">
  app.registerViews();
  // Make the todos view a component by associating it with a controller class
  app.component('todos', global.Todos);

  // A page should be created for each full page render
  var page = app.createPage();

  // Use a very simple localStorage adapter to persist model state and sync
  // it among different windows in the same browser
  var todos = page.model.at('_page.todos');
  var localStore = new global.LocalStore('derbyjs-todomvc', todos);
  localStore.init(page);

  // Example routing of URL hash using https://github.com/flatiron/director
  var router = new global.Router();
  router.on(/\/(active|completed)?/, function(mode) {
    page.model.set('_page.mode', mode);
  });
  router.init();

  // Client-side rendering with getFragment returns a document fragment for
  // a view that can be added to the page via any standard DOM method
  var fragment = page.getFragment('app');
  document.getElementById('todoapp').appendChild(fragment);

})(this);
