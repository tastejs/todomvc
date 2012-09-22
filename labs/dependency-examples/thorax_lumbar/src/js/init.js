//all templates are assumed to be in the templates directory
Thorax.templatePathPrefix = 'src/templates/';

var app = window.app = module.exports;

$(function() {
  app.initBackboneLoader();
  Backbone.history.start();
});
