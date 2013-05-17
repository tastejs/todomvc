require.config({
  paths : {
    underscore : '../bower_components/underscore/underscore',
    backbone   : 'lib/backbone',
    marionette : 'lib/backbone.marionette',
    jquery     : '../bower_components/jquery/jquery',
    tpl        : 'lib/tpl'
  },
  shim : {
    'lib/backbone-localStorage' : ['backbone'],
    underscore : {
      exports : '_'
    },
    backbone : {
      exports : 'Backbone',
      deps : ['jquery','underscore']
    },
    marionette : {
      exports : 'Backbone.Marionette',
      deps : ['backbone']
    }
  },
  deps : ['jquery','underscore']
});

require(['app','backbone','routers/index','controllers/index'],function(app,Backbone,Router,Controller){
  "use strict";

  app.start();
  new Router({
    controller : Controller
  });
  Backbone.history.start();
});
