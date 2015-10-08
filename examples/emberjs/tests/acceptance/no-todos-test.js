import Ember from 'ember';
import { module, test } from 'qunit';
import startApp from 'todos/tests/helpers/start-app';

var application;

module('Acceptance | No todos', {
	beforeEach() {
		application = startApp();
	},

	afterEach() {
		Ember.run(application, 'destroy');
	}
});

test('.main and .footer are hidden when there are no todos', assert => {
	visit('/');

	andThen(() => {
		assert.equal(find('.main').length, 0, 'main is hidden');
		assert.equal(find('.footer').length, 0, 'footer is hidden');
	});
});
