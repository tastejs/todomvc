'use strict';
/*global describe, it, expect, jest, beforeEach */
/* jshint esnext: false */
/* jshint esversion: 9 */

import '@testing-library/jest-dom/extend-expect';

import { render, fireEvent, act } from '@testing-library/svelte';
import Todo from '../../js/components/Todo.svelte';

const mockUpdateTitleFn = jest.fn();
const mockRemoveFn = jest.fn();
const mockToggleFn = jest.fn();
const mockTodos = {
	updateTitle: mockUpdateTitleFn,
	remove: mockRemoveFn,
	toggle: mockToggleFn
};

let selectors = null;

const renderComponent = function({todo}) {
	return render(Todo, { todos: mockTodos, todo });
};

const titleLabel = () => selectors.getByTestId('title');
const toggleCheck = () => selectors.getByTestId('toggle');
const listItem = () => selectors.getByTestId('todo');
const editInput = () => selectors.getByTestId('edit');

describe('<Todo />', () => {
	describe('with a freshly added item', () => {
		beforeEach(() => {
			selectors = renderComponent({todo: {id: '42', title: 'All the things!'}});
		});

		it('adds an item to the list', () => {
			expect(titleLabel()).toHaveTextContent('All the things!');
		});

		it('is unchecked', () => {
			expect(toggleCheck()).not.toBeChecked();
		});

		it('to be styled as uncompleted', () => {
			expect(listItem()).not.toHaveClass('completed');
		});

		describe('when entering edit mode', () => {
			beforeEach(() => {
				act(() => {
					fireEvent.doubleClick(titleLabel());
				});
			});

			it('to be in edit mode', () => {
				expect(listItem()).toHaveClass('editing');
			});

			it('the edit input has focus', () => {
				expect(editInput()).toHaveFocus();
			});
		});

		describe('when editing todo text and hitting enter', () => {
			beforeEach(() => {
				act(() => {
					fireEvent.doubleClick(titleLabel());
					fireEvent.input(editInput(), { target: { value: 'Some things?' } });
					fireEvent.keyDown(editInput(), { key: 'Enter', keyCode: 13 });
				});
			});

			it('updates the todo text', () => {
				expect(mockUpdateTitleFn).toHaveBeenCalledWith('42', 'Some things?');
			});

			it('to be no longer in edit mode', () => {
				expect(listItem()).not.toHaveClass('editing');
			});
		});

		describe('when entering edit mode and hitting enter without adding content', () => {
			beforeEach(() => {
				act(() => {
					fireEvent.doubleClick(titleLabel());
					fireEvent.input(editInput(), { target: { value: '   ' } });
					fireEvent.blur(editInput());
				});
			});

			it('removes the todo item', () => {
				expect(mockRemoveFn).toHaveBeenCalledWith('42');
			});
		});

		describe('when editing todo text and clicking away', () => {
			beforeEach(() => {
				act(() => {
					fireEvent.doubleClick(titleLabel());
					fireEvent.input(editInput(), { target: { value: 'Other things?' } });
					fireEvent.blur(editInput());
				});
			});

			it('updates the todo text', () => {
				expect(mockUpdateTitleFn).toHaveBeenCalledWith('42', 'Other things?');
			});
		});

		describe('when aborting an edit', () => {
			beforeEach(() => {
				act(() => {
					fireEvent.doubleClick(titleLabel());
					fireEvent.input(editInput(), { target: { value: 'Any things?' } });
					fireEvent.keyDown(editInput(), { key: 'Escape', keyCode: 27 });
				});
			});

			it('does not update stored todo text', () => {
				expect(mockUpdateTitleFn).not.toHaveBeenCalled();
			});

			it('the listed todo text remains unchanged', () => {
				expect(titleLabel()).toHaveTextContent('All the things!');
			});
		});

		describe('when marking an item as complete', () => {
			beforeEach(() => {
				act(() => {
					fireEvent.click(toggleCheck());
				});
			});

			it('toggles the completed state in the store', () => {
				expect(mockToggleFn).toHaveBeenCalledWith('42', true);
			});
		});
	});

	describe('with a completed item', () => {
		beforeEach(() => {
			selectors = renderComponent({todo: {id: '42', title: 'just added', completed: true}});
		});

		it('is checked', async () => {
			expect(toggleCheck()).toBeChecked();
		});

		it('to be styled as completed', async () => {
			expect(listItem()).toHaveClass('completed');
		});

		describe('when marking an item as incomplete', () => {
			beforeEach(() => {
				act(() => {
					fireEvent.click(toggleCheck());
				});
			});

			it('toggles the completed state in the store', () => {
				expect(mockToggleFn).toHaveBeenCalledWith('42', false);
			});
		});

	});
});