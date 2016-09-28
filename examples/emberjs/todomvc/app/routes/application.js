import Ember from 'ember';

export default Ember.Route.extend({
	repo: Ember.inject.service(),
	model() {
		return this.get('repo').findAll();
	}
});
