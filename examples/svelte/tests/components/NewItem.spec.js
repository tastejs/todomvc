'use strict';
/*global describe, it, expect, jest, beforeEach */
/* jshint esnext: false */
/* jshint esversion: 9 */

import '@testing-library/jest-dom/extend-expect';

import { render, fireEvent, act } from '@testing-library/svelte';
import NewItem from '../../js/components/NewItem.svelte';

const mockAddFn = jest.fn();
const mockTodos = { add: mockAddFn };

let selectors = null;

const renderComponent = function () {
	return render(NewItem, { todos: mockTodos });
};

const newItemInput = () => selectors.getByPlaceholderText(/What needs to be done/);

describe('<NewItem />', () => {
	beforeEach(() => {
		selectors = renderComponent();
	});
	describe('entering a new todo', () => {
		beforeEach(() => {
			act(() => {
				fireEvent.input(newItemInput(), { target: { value: 'Order pizza' } });
				fireEvent.keyDown(newItemInput(), { key: 'Enter', keyCode: 13 });
			});
		});

		it('adds an item to the list', () => {
			expect(mockAddFn).toHaveBeenCalledWith({title: 'Order pizza'});
		});

		it('clears the input value', () => {
			expect(newItemInput()).toHaveValue('');
		});

		it('has focus', () => {
			expect(newItemInput()).toHaveFocus();
		});
});
});