(function() {

  require.config({
    paths: {
      'jquery': '../../../../assets/jquery.min',
      'backbone': 'lib/backbone-min',
      'localstorage': 'lib/backbone.localStorage-min',
      'backboneEventStreams': 'lib/backbone.eventstreams.min',
      'underscore': 'lib/underscore-min',
      'bacon': 'lib/bacon.min',
      'transparency': 'lib/transparency.min'
    },
    shim: {
      backbone: {
        deps: ['underscore'],
        exports: 'Backbone'
      },
      underscore: {
        exports: '_'
      },
      backboneEventStreams: {
        deps: ['backbone', 'bacon']
      }
    }
  });

  require(['jquery', 'transparency', 'backbone', 'underscore', 'app', 'backboneEventStreams'], function($, Transparency, Backbone, _, TodoApp) {
    Transparency.register($);
    return $(function() {
      return new TodoApp({
        el: $('#todoapp')
      });
    });
  });

}).call(this);
