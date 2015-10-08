import Ember from 'ember';
import config from './config/environment';

var Router = Ember.Router.extend({
	location: config.locationType
});

Router.map(function() {
	this.route('todos', { path: '/' }, function() {
		this.route('active');
		this.route('completed');
	});
});

export default Router;
