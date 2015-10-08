import Ember from 'ember';
import { module, test } from 'qunit';
import startApp from 'todos/tests/helpers/start-app';

var application;

module('Acceptance | Routing', {
	beforeEach() {
		application = startApp();
		addTodos('foo', 'bar');
		click('.toggle:first');
	},

	afterEach() {
		emptyStore();
		Ember.run(application, 'destroy');
	}
});

test('/ displays all todos', assert => {
	visit('/');

	andThen(() => {
		assert.equal(find('.toggle:checked').length, 1, 'shows complete todo');
		assert.equal(find('.toggle:not(:checked)').length, 1, 'shows incomplete todo');
	});
});

test('/active displays incomplete todos', assert => {
	visit('/active');

	andThen(() => {
		assert.equal(find('.toggle').length, 1, 'only shows one todo');
		assert.equal(find('.toggle:not(:checked)').length, 1, 'shows incomplete todo');
	});
});

test('/completed displays complete todos', assert => {
	visit('/completed');

	andThen(() => {
		assert.equal(find('.toggle').length, 1, 'only shows one todo');
		assert.equal(find('.toggle:checked').length, 1, 'shows complete todo');
	});
});

