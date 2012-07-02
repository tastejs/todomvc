// Author: Loïc Knuchel <loicknuchel@gmail.com>

// Require.js allows us to configure shortcut alias
require.config({
  paths: {
    knockout: 'libs/knockout-2.1.0'
  }

});

require([
  'knockout',
  'config/global',
  'viewmodels/todo',
  'extends/handlers',
  'extends/native'
], function(ko, g, TodoViewModel){
  'use strict';
  // var app_view = new AppView();
  // check local storage for todos
  var todos = ko.utils.parseJson( localStorage.getItem( g.localStorageItem ) );

  // bind a new instance of our view model to the page
  ko.applyBindings( new TodoViewModel( todos || [] ) );
});
