import '@testing-library/jest-dom';
import { vi } from 'vitest';
import { render, screen, cleanup, type RenderResult } from '@testing-library/svelte';
import userEvent from '@testing-library/user-event';

import AddTodo from './AddTodo.svelte';

let rendered: RenderResult<AddTodo>;
let user: ReturnType<typeof userEvent.setup>;

function newTodoInput() {
	return screen.getByPlaceholderText('What needs to be done?');
}

describe('<AddTodo>', () => {
	beforeEach(() => {
		user = userEvent.setup();
		rendered = render(AddTodo);
	});

	afterEach(() => {
		cleanup();
	});

	it('should show input with correct class', () => {
		const input = newTodoInput();
		expect(input).toBeInTheDocument();
		expect(input).toHaveClass('new-todo');
	});

	it('should have focus', () => {
		const input = newTodoInput();
		expect(input).toEqual(document.activeElement);
	});

	it('should trigger newTodo when value is not empty or whitespace', async () => {
		let newTodoTitle = '';
		const onNewTodo = vi.fn((event) => newTodoTitle = event.detail.value);
		rendered.component.$on('newTodo', onNewTodo);

		await user.type(newTodoInput(), 'Hello World!');
		await user.keyboard('[Enter]');

		expect(onNewTodo).toBeCalled();
		expect(newTodoTitle).toBe('Hello World!');
	});

	it('should trigger newTodo with trimed value', async () => {
		let newTodoTitle = '';
		const onNewTodo = vi.fn((event) => newTodoTitle = event.detail.value);
		rendered.component.$on('newTodo', onNewTodo);

		await user.type(newTodoInput(), '[Space]Hello World![Space]');
		await user.keyboard('[Enter]');

		expect(onNewTodo).toBeCalled();
		expect(newTodoTitle).toBe('Hello World!');
	});

	it('should not trigger newTodo when value is empty or whitespace', async () => {
		const onNewTodo = vi.fn();
		rendered.component.$on('newTodo', onNewTodo);

		await user.click(newTodoInput());
		await user.keyboard('[Space][Enter]');

		expect(onNewTodo).not.toBeCalled();
	});
});
