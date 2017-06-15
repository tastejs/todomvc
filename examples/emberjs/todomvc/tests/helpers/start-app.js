import Ember from 'ember';
import Application from '../../app';
import config from '../../config/environment';

export default function startApp(attrs) {
	let attributes = Ember.merge({}, config.APP);
	attributes = Ember.merge(attributes, attrs); // use defaults, but you can override;

	return Ember.run(() => {
		let application = Application.create(attributes);
		application.setupForTesting();
		application.injectTestHelpers();
		return application;
	});
}
