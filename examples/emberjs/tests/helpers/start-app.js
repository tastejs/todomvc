import Ember from 'ember';
import Application from '../../app';
import config from '../../config/environment';

import addTodos from './add-todos';
import emptyStore from './empty-store';

export default function startApp(attrs) {
	var application;

	var attributes = Ember.merge({}, config.APP);
	attributes = Ember.merge(attributes, attrs); // use defaults, but you can override;

	Ember.run(function() {
		application = Application.create(attributes);
		application.setupForTesting();
		application.injectTestHelpers();
	});

	return application;
}
