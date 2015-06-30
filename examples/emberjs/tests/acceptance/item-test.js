import Ember from 'ember';
import { module, test } from 'qunit';
import startApp from 'todos/tests/helpers/start-app';

var application;

module('Acceptance | Item', {
	beforeEach() {
		application = startApp();
		addTodos('foo');
	},

	afterEach() {
		emptyStore();
		Ember.run(application, 'destroy');
	}
});

test('toggles `completed` class with completion state', assert => {
	const store = application.__container__.lookup('service:store');

	visit('/');

	andThen(() => {
		assert.equal(find('.completed').length, 0);
	});

	click('.toggle:first');

	andThen(() => {
		assert.equal(find('.completed').length, 1);

		const allDone = store.findAll('todo').then(todos => {
			return todos.reduce((acc, todo) => acc && todo.get('isCompleted'));
		});

		assert.ok(allDone);
	});
});

test('deletes todo with destroy button', assert => {
	visit('/');

	click('.destroy:first');

	andThen(() => {
		assert.equal(find('.toggle').length, 0);
	});
});

test('sets `editing` class after double-click', assert => {
	visit('/');

	andThen(() => {
		assert.equal(find('.editing').length, 0);
	});

	triggerEvent('label:first', 'dblclick');

	andThen(() => {
		assert.equal(find('.editing').length, 1);
	});
});
