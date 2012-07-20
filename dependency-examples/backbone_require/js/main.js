
// Require.js allows us to configure shortcut alias
require.config({

  // The shim config allows us to configure dependencies for 
  // scripts that do not call define() to register a module
	shim: {
	    'underscore': {
	        exports: '_'
	    },

	    'backbone': {
	        deps: ['underscore', 'jquery'],
	        exports: 'Backbone'
	    },

	},

	paths: {
		jquery: 'libs/jquery/jquery-min',
		underscore: 'libs/underscore/underscore',
		backbone: 'libs/backbone/backbone',
		text: 'libs/require/text'
	}

});

require(['views/app', 'routers/router'], function( AppView, Workspace ){

  // Initialize routing and start Backbone.history()
  var TodoRouter = new Workspace;
  Backbone.history.start();

  // Initialize the application view
  var app_view = new AppView;

});
