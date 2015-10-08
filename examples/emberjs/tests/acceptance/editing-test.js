import Ember from 'ember';
import { module, test } from 'qunit';
import startApp from 'todos/tests/helpers/start-app';

var application;

module('Acceptance | Editing', {
	beforeEach() {
		application = startApp();
		addTodos('foo');
	},

	afterEach() {
		emptyStore();
		Ember.run(application, 'destroy');
	}
});

test('double-clicking todo opens edit input', assert => {
	visit('/');

	triggerEvent('label:first', 'dblclick');

	andThen(() => {
		const input = find('.edit');

		assert.equal(input.length, 1);
		assert.equal(input.val(), 'foo');
	});
});

test('edit input saves on blur', assert => {
	visit('/');

	triggerEvent('label:first', 'dblclick');
	fillIn('.edit', 'bar');
	triggerEvent('.new-todo', 'focus');

	andThen(() => {
		assert.equal(find('label:first').text(), 'bar');
	});
});
