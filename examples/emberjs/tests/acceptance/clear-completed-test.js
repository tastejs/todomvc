import Ember from 'ember';
import { module, test } from 'qunit';
import startApp from 'todos/tests/helpers/start-app';

var application;

module('Acceptance | Clear completed', {
	beforeEach() {
		application = startApp();
	},

	afterEach() {
		emptyStore();
		Ember.run(application, 'destroy');
	}
});

test('clear completed button deletes completed todos', assert => {
	visit('/');

	addTodos('foo', 'bar');
	click('.toggle:first');

	andThen(() => {
		assert.equal(find('.toggle').length, 2);
	});

	click('.clear-completed');

	andThen(() => {
		assert.equal(find('.toggle').length, 1);
	});
});
