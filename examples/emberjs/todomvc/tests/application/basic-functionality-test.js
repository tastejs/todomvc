import { assert } from '@ember/debug';
import {
	blur,
	click,
	currentURL,
	fillIn,
	find,
	findAll,
	triggerEvent,
	triggerKeyEvent,
	visit,
} from '@ember/test-helpers';
import { module, test } from 'qunit';
import { setupApplicationTest } from 'ember-qunit';

function byText(selector, text) {
	return findAll(selector).find((element) => element.textContent.trim().includes(text));
}

function activeFilter() {
	return find('.filters .selected')?.textContent?.trim();
}

async function clickAll() {
	let element = byText('.filters a', 'All');

	assert(`Could not find All link`, element);
	await click(element);
}

async function clickActive() {
	let element = byText('.filters a', 'Active');

	assert(`Could not find Active link`, element);
	await click(element);
}

async function clickCompleted() {
	let element = byText('.filters a', 'Completed');

	assert(`Could not find Completed link`, element);
	await click(element);
}

function getTodos() {
	return findAll('.todo-list li');
}

function getTodoText(todoElement) {
	return todoElement.querySelector('label')?.textContent?.trim();
}

function getTodosTexts() {
	return getTodos().map((todo) => getTodoText(todo));
}

function getCompletedTodos() {
	return getTodos()
		.filter((todo) => todo.classList.contains('completed'))
		.map((todo) => todo.querySelector('label')?.textContent?.trim());
}

async function addTodo(text) {
	await fillIn('.new-todo', text);
	await triggerKeyEvent('.new-todo', 'keydown', 'Enter');
}

async function edit(originalText, nextText) {
	let element = byText('.todo-list li .view', originalText);
	let label = element.querySelector('label');
	let li = element.parentElement;
	let input = li.querySelector('.edit');

	assert(`Could not find element with text: ${originalText}`, element);
	assert(`Todo is missing the .edit input`, input);
	assert(`Todo is missing the label`, label);
	await triggerEvent(label, 'dblclick');

	await fillIn(input, nextText);
	await blur(input);
}

async function remove(text) {
	let element = byText('.todo-list li .view', text);

	assert(`Could not find element with text: ${text}`, element);

	let button = element.querySelector('button');

	assert(`Could not find delete button for todo with text: ${text}`, button);

	await click(button);
}

async function toggle(text) {
	let element = byText('.todo-list li .view', text);

	assert(`Could not find element with text: ${text}`, element);

	let checkbox = element.querySelector('.toggle');

	assert(`Could not find checkbox for todo with text: ${text}`, checkbox);

	await click(checkbox);
}

async function clearCompleted() {
	await click('.clear-completed');
}

async function toggleAll() {
	await click('#toggle-all');
}

module('Behavior', function (hooks) {
	setupApplicationTest(hooks);

	hooks.beforeEach(function () {
		localStorage.clear();
	});

	hooks.afterEach(function () {
		localStorage.clear();
	});

	test('Filters are not rendered because there are no todos', async function (assert) {
		assert.dom('.filters').doesNotExist();
	});

	test('starts with no todos', async function (assert) {
		await visit('/');

		assert.strictEqual(getTodos().length, 0);
	});

	test('can add a todo', async function (assert) {
		await visit('/');

		await addTodo('new todo');
		assert.strictEqual(getTodos().length, 1, 'the todo is created');
		assert.deepEqual(getTodosTexts(), ['new todo']);

		await clickActive();
		assert.strictEqual(getTodos().length, 1, 'todo is present on active filter');

		await clickCompleted();
		assert.strictEqual(getTodos().length, 0, 'todo is not present on completed filter');
	});

	module('one todo exists', function (hooks) {
		hooks.beforeEach(async function () {
			await visit('/');

			await addTodo('first todo');
		});

		test('default page is the "all" page', async function (assert) {
			assert.strictEqual(activeFilter(), 'All', 'current filter is "All"');
		});

		test('Filters are rendered', async function (assert) {
			assert.dom('.filters').exists();
		});

		test('URL navigation works', async function (assert) {
			assert.deepEqual(getTodosTexts(), ['first todo']);

			await visit('/active');
			assert.strictEqual(activeFilter(), 'Active', 'current filter is "Active"');
			assert.deepEqual(getTodosTexts(), ['first todo']);

			await visit('/completed');
			assert.strictEqual(activeFilter(), 'Completed', 'current filter is "Completed"');
			assert.deepEqual(getTodosTexts(), []);
		});

		test('Link navigation works', async function (assert) {
			await clickActive();
			assert.strictEqual(activeFilter(), 'Active', 'current filter is "Active"');
			assert.strictEqual(currentURL(), '/active');
			assert.deepEqual(getTodosTexts(), ['first todo']);

			await clickCompleted();
			assert.strictEqual(activeFilter(), 'Completed', 'current filter is "Completed"');
			assert.strictEqual(currentURL(), '/completed');
			assert.deepEqual(getTodosTexts(), []);

			await clickAll();
			assert.strictEqual(activeFilter(), 'All', 'current filter is "All"');
			assert.strictEqual(currentURL(), '/');
			assert.deepEqual(getTodosTexts(), ['first todo']);
		});

		test('can be edited', async function (assert) {
			assert.deepEqual(getTodosTexts(), ['first todo']);

			await edit('first todo', 'edited first todo');

			assert.deepEqual(getTodosTexts(), ['edited first todo']);
		});

		test('can be deleted', async function (assert) {
			assert.deepEqual(getTodosTexts(), ['first todo']);

			await remove('first todo');

			assert.deepEqual(getTodosTexts(), []);
		});

		test('can be marked complete', async function (assert) {
			assert.deepEqual(getTodosTexts(), ['first todo']);

			await toggle('first todo');

			await clickActive();
			assert.deepEqual(getTodosTexts(), []);

			await clickCompleted();
			assert.deepEqual(getTodosTexts(), ['first todo']);

			await clickAll();
			assert.deepEqual(getTodosTexts(), ['first todo']);
		});
	});

	module('two todos exist', function (hooks) {
		hooks.beforeEach(async function () {
			await visit('/');

			await addTodo('first todo');
			await addTodo('second todo');
		});

		test('default page is the "all" page', async function (assert) {
			assert.strictEqual(activeFilter(), 'All', 'current filter is "All"');
		});

		test('Filters are rendered', async function (assert) {
			assert.dom('.filters').exists();
		});

		test('All todos are initially not completed', async function (assert) {
			assert.deepEqual(getCompletedTodos(), []);
		});

		test('The first todo is completed', async function (assert) {
			await toggle('first todo');

			assert.deepEqual(getCompletedTodos(), ['first todo']);
		});

		test('The second todo is completed', async function (assert) {
			await toggle('second todo');

			assert.deepEqual(getCompletedTodos(), ['second todo']);
		});

		test('All todos are completed', async function (assert) {
			await toggle('first todo');
			await toggle('second todo');

			assert.deepEqual(getCompletedTodos(), ['first todo', 'second todo']);

			await clearCompleted();
			assert.deepEqual(getCompletedTodos(), [], 'clear completed clears the todos');
		});

		test('All todos are toggled twice', async function (assert) {
			assert.deepEqual(getCompletedTodos(), []);
			await toggleAll();
			assert.deepEqual(getCompletedTodos(), ['first todo', 'second todo']);
			await toggleAll();
			assert.deepEqual(getCompletedTodos(), []);
		});

		test('The global toggle will select all if not all are selected', async function (assert) {
			assert.deepEqual(getCompletedTodos(), []);

			await toggle('first todo');
			assert.deepEqual(getCompletedTodos(), ['first todo']);

			await toggleAll();
			assert.deepEqual(getCompletedTodos(), ['first todo', 'second todo']);
		});
	});
});
