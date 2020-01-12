'use strict';
/*global describe, it, expect, beforeEach */
/* jshint esnext: false */
/* jshint esversion: 9 */

import '@testing-library/jest-dom/extend-expect';

import { render, fireEvent, act } from '@testing-library/svelte';
import TodoList from '../../js/components/TodoList.svelte';

import { createTodosStore, createVisibleStore } from '../../js/stores/todos';
import { simpleList } from '../fixtures/todos';
import testingStorageService from '../support/testingStorageService';

const mockTodosStore = createTodosStore(testingStorageService);
const mockVisbleStore = createVisibleStore(mockTodosStore);

let selectors = null;

const renderComponent = function({filterBy}, list=simpleList) {
	// The store persists state, so reset it before each test
	mockTodosStore.set(list);

	return render(TodoList, {
		todos: mockTodosStore,
		visible: mockVisbleStore,
		filterBy
	});
};

const mainSection = () => selectors.queryByTestId('main');
const toggleAllCheckbox = () => selectors.getByTestId('toggle-all');
const toggleCheckboxes = () => selectors.queryAllByTestId('toggle');
const listItems = () => selectors.queryAllByTestId('todo');

describe('<TodoList />', () => {
	describe('with a list of mixed completions', () => {
		beforeEach(() => {
			selectors = renderComponent({filterBy: 'all'});
		});

		it('the todo list section is normally visible', () => {
			expect(mainSection()).toBeInTheDocument();
		});

		it('the toggle all button is not checked', () => {
			expect(toggleAllCheckbox()).not.toBeChecked();
		});

		it('contain list items', () => {
			expect(listItems()[1]).toHaveTextContent('moar tests');
		});

		it('contain the right amount of list items', () => {
			expect(listItems()).toHaveLength(2);
		});

		describe('when marking an item as complete', () => {
			beforeEach(() => {
				act(() => {
					fireEvent.click(toggleCheckboxes()[1]);
				});
			});

			it('the toggle all checkbox is now checked', () => {
				expect(toggleAllCheckbox()).toBeChecked();
			});
		});

		describe('when clicking on "toggle all"', () => {
			beforeEach(() => {
				act(() => {
					fireEvent.click(toggleAllCheckbox());
				});
			});

			it('the toggles all checkboxes', () => {
				expect(toggleCheckboxes()[0]).toBeChecked();
				expect(toggleCheckboxes()[1]).toBeChecked();
			});
		});
	});

	describe('with all items initially marked completed', () => {
		beforeEach(() => {
			const list = [
				{id: '42', title: 'test transformations', completed: true},
				{id: '43', title: 'moar tests', completed: true}
			];
			selectors = renderComponent({filterBy: 'all'}, list);
		});

		it('the toggle all button starts out checked', () => {
			expect(toggleAllCheckbox()).toBeChecked();
		});

		describe('when marking an item as incomplete', () => {
			beforeEach(() => {
				act(() => {
					fireEvent.click(toggleCheckboxes()[0]);
				});
			});

			it('the toggle all checkbox is now unchecked', () => {
				expect(toggleAllCheckbox()).not.toBeChecked();
			});
		});

		describe('when clicking on "toggle all"', () => {
			beforeEach(() => {
				act(() => {
					fireEvent.click(toggleAllCheckbox());
				});
			});

			it('the untoggles all checkboxes', () => {
				expect(toggleCheckboxes()[0]).not.toBeChecked();
				expect(toggleCheckboxes()[1]).not.toBeChecked();
			});
		});
	});

	describe('with all items initially marked uncompleted', () => {
		beforeEach(() => {
			const list = [
				{id: '42', title: 'test transformations', completed: false},
				{id: '43', title: 'moar tests', completed: false}
			];
			selectors = renderComponent({filterBy: 'all'}, list);
		});

		it('the toggle all button is not checked', () => {
			expect(toggleAllCheckbox()).not.toBeChecked();
		});

		describe('when clicking on "toggle all"', () => {
			beforeEach(() => {
				act(() => {
					fireEvent.click(toggleAllCheckbox());
				});
			});

			it('the toggles all checkboxes', () => {
				expect(toggleCheckboxes()[0]).toBeChecked();
				expect(toggleCheckboxes()[1]).toBeChecked();
			});
		});
	});

	describe('when there are no items', () => {
		beforeEach(() => {
			const list = [];
			selectors = renderComponent({filterBy: 'all'}, list);
		});

		it('the todo list section is not visible', () => {
			expect(mainSection()).not.toBeInTheDocument();
		});
	});

	describe('when filtered by active items', () => {
		beforeEach(() => {
			selectors = renderComponent({filterBy: 'active'});
		});

		it('only shows the uncompleted items', () => {
			expect(listItems()[0]).toHaveTextContent('moar tests');
			expect(toggleCheckboxes()[0]).not.toBeChecked();
		});

		it('there is only one completed item to show', () => {
			expect(listItems()).toHaveLength(1);
		});
	});

	describe('when filtered by completed items', () => {
		beforeEach(() => {
			selectors = renderComponent({filterBy: 'completed'});
		});

		it('only shows the completed items', () => {
			expect(listItems()[0]).toHaveTextContent('test transformations');
			expect(toggleCheckboxes()[0]).toBeChecked();
		});

		it('there is only one completed item to show', () => {
			expect(listItems()).toHaveLength(1);
		});
	});
});