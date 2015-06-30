import Ember from 'ember';
import { module, test } from 'qunit';
import startApp from 'todos/tests/helpers/start-app';

var application;

module('Acceptance | New todo', {
	beforeEach() {
		application = startApp();
	},

	afterEach() {
		emptyStore();
		Ember.run(application, 'destroy');
	}
});

test('submitting the todo input should add a new todo to the list', assert => {
	visit('/');
	fillIn('.new-todo', ' foo ');
	triggerEvent('.new-todo', 'submit');

	andThen(() => {
		assert.equal(find('.todo-list li').length, 1);
		assert.equal(find('.todo-list li label').text(), 'foo');
	});
});
