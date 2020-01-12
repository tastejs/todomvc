'use strict';
/*global describe, it, expect, beforeEach */
/* jshint esnext: false */
/* jshint esversion: 9 */

import '@testing-library/jest-dom/extend-expect';

import { render, fireEvent, act } from '@testing-library/svelte';
import { get } from 'svelte/store';
import ListFooter from '../../js/components/ListFooter.svelte';

import { createTodosStore, createVisibleStore } from '../../js/stores/todos';
import { simpleList } from '../fixtures/todos';
import testingStorageService from '../support/testingStorageService';

const mockTodosStore = createTodosStore(testingStorageService);
const mockVisbleStore = createVisibleStore(mockTodosStore);

let selectors = null;

const renderComponent = function({filterBy}, list=simpleList) {
	// The store persists state, so reset it before each test
	mockTodosStore.set(list);

	return render(ListFooter, {
		todos: mockTodosStore,
		visible: mockVisbleStore,
		filterBy
	});
};

const footer = () => selectors.queryByTestId('footer');
const reaminingCount = () => selectors.getByTestId('todo-count');
const filterByAllButton = () => selectors.getByText('All');
const filterByActiveButton = () => selectors.getByText('Active');
const filterByCompletedButton = () => selectors.getByText('Completed');
const filterByClearCompletedButton = () => selectors.queryByText('Clear completed');

describe('<ListFooter />', () => {
	describe('with all items showing', () => {
		beforeEach(() => {
			selectors = renderComponent({filterBy: 'all'});
		});

		it('the list footer is normally visible', () => {
			expect(footer()).toBeInTheDocument();
		});

		it('the number of remaining items to complete is shown', () => {
			expect(reaminingCount()).toHaveTextContent('1 item left');
		});

		it('The "all" button is styled as selected', () => {
			expect(filterByAllButton()).toHaveClass('selected');
		});

		it('the other filter buttons are deselected', () => {
			expect(filterByActiveButton()).not.toHaveClass('selected');
			expect(filterByCompletedButton()).not.toHaveClass('selected');
		});

		it('the "clear completed" button is present', () => {
			expect(filterByClearCompletedButton()).toBeInTheDocument();
		});

		describe('when clicking on "clear completed"', () => {
			beforeEach(() => {
				act(() => {
					fireEvent.click(filterByClearCompletedButton());
				});
			});

			it('the "clear completed" button disappears', () => {
				expect(filterByClearCompletedButton()).not.toBeInTheDocument();
			});

			it('the store items only has completed items left', () => {
				const todos = get(mockTodosStore);
				expect(todos).toEqual([{id: '43', title: 'moar tests'}]);
			});
		});
	});

	describe('with active items are showing', () => {
		beforeEach(() => {
			selectors = renderComponent({filterBy: 'active'});
		});


		it('The "active" button is styled as selected', () => {
			expect(filterByActiveButton()).toHaveClass('selected');
		});

		it('the other filter buttons are deselected', () => {
			expect(filterByAllButton()).not.toHaveClass('selected');
			expect(filterByCompletedButton()).not.toHaveClass('selected');
		});
	});

	describe('with completed items are showing', () => {
		beforeEach(() => {
			selectors = renderComponent({filterBy: 'completed'});
		});


		it('The "completed" button is styled as selected', () => {
			expect(filterByCompletedButton()).toHaveClass('selected');
		});

		it('the other filter buttons are deselected', () => {
			expect(filterByAllButton()).not.toHaveClass('selected');
			expect(filterByActiveButton()).not.toHaveClass('selected');
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

		it('the number of remaining items to complete is shown', () => {
			expect(reaminingCount()).toHaveTextContent('2 items left');
		});

		it('the "clear completed" button disappears', () => {
			expect(filterByClearCompletedButton()).not.toBeInTheDocument();
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

		it('the number of remaining items to complete is shown', () => {
			expect(reaminingCount()).toHaveTextContent('0 items left');
		});

		describe('when clicking on "clear completed"', () => {
			beforeEach(() => {
				act(() => {
					fireEvent.click(filterByClearCompletedButton());
				});
			});

			it('there are not items left so the footer is not visible', () => {
				expect(footer()).not.toBeInTheDocument();
			});
		});
	});

	describe('when there are no items', () => {
		beforeEach(() => {
			const list = [];
			selectors = renderComponent({filterBy: 'all'}, list);
		});

		it('the list footer is not visible', () => {
			expect(footer()).not.toBeInTheDocument();
		});
	});
});