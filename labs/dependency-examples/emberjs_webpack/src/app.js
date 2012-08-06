require('script!todomvc/assets/base.js');
require('script!jquery');
require('script!handlebars');
require('script!ember');
require('todomvc/assets/base.css');
require('./app/css/app.css');

var Router = require('./app/router');
var Store = require('./app/models/store');
var EntriesController = require('./app/controllers/entries');
var ApplicationView = require('./app/views/application');

// Load our app
var App = Ember.Application.create({
	VERSION: '0.2',
	rootElement: '#todoapp',
	// Load routes
	Router: Router,
	// Extend to inherit outlet support
	ApplicationController: Ember.Controller.extend(),
	ApplicationView: ApplicationView,
	entriesController: EntriesController.create(
		{ store: new Store( 'todos-emberjs' ) }
	)
});

$(function() {
	App.initialize();
});
// Expose the application globally
module.exports = window.Todos = App;
