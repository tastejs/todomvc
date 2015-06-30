import Ember from 'ember';

export default Ember.Test.registerHelper('emptyStore', function(app) {
	const adapter = app.__container__.lookup('adapter:application');
	const namespace = adapter.get('namespace');

	window.localStorage.setItem(namespace, '{}');
});
