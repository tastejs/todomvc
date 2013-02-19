// Load our app
goog.provide('Todos.app');

goog.require('Todos.Router');
goog.require('Todos.models.Store');
goog.require('Todos.ctrls.Entries');
goog.require('Todos.views.Application');

Todos.App = Ember.Application.create({
	VERSION: '1.0',
	rootElement: '#todoapp',
	// Load routes
	Router: Todos.Router,
	// Extend to inherit outlet support
	ApplicationController: Ember.Controller.extend(),
	ApplicationView: Todos.views.Application,
	entriesController: Todos.ctrls.Entries.create({
		store: new Todos.models.Store('todos-emberjs')
	}),
  // define all our templates so we can load via ajax
  // (templates are out of mantri's scope so tough)
  templates: ['clear_button', 'filters', 'items', 'stats'],
	ready: function() {
    this.loadTemplates(this.templates.shift());
	},
  /**
   * Load all templates sequencially.
   * @param  {?string} template the template's name.
   */
  loadTemplates: function(template) {
    if (!template) {
      this.initialize();
      return;
    }

    this.loadTemplate('js/app/templates/' + template + '.html',
      template, this.loadTemplates);
  },
  /*
   * Loads a handlebars.js template at a given URL. Takes an optional name, in which     case,
   * the template is added and is reference-able via templateName.
   */
  loadTemplate: function (url, name, callback) {
    var _this = this;
    var contents = $.get(url, function(templateText) {
      var compiledTemplate = Ember.Handlebars.compile(templateText);

      Ember.TEMPLATES[name] = compiledTemplate

      callback.call(_this, _this.templates.shift());
    });
  }



});

