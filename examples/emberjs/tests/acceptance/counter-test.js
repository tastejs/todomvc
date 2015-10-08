import Ember from 'ember';
import { module, test } from 'qunit';
import startApp from 'todos/tests/helpers/start-app';

var application;

module('Acceptance | Counter', {
	beforeEach() {
		application = startApp();
	},

	afterEach() {
		emptyStore();
		Ember.run(application, 'destroy');
	}
});

test('remaining counter changes based on completion state', assert => {
	visit('/');

	addTodos('foo', 'bar');

	andThen(() => {
		assert.equal(find('.todo-count').text().trim(), '2 items left');
	});

	click('.toggle:first');

	andThen(() => {
		assert.equal(find('.todo-count').text().trim(), '1 item left');
	});
});
