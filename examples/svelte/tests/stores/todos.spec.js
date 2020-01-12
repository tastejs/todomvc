'use strict';
/*global describe, it, expect, jest, beforeEach */

import { todos, visible } from '../../js/stores/todos';
import { get } from 'svelte/store';
import { simpleList } from '../fixtures/todos';

jest.mock('../../js/helpers/localStorage', () => {
	return {
		read: jest.fn(),
		write: jest.fn().mockImplementation(todos => todos)
	};
});

let subject;
let result;

describe('stores/todo', () => {
	describe('store: todos', () => {
		beforeEach(() => {
			subject = todos;
			subject.set(simpleList);
		});

		it('can retreive data from localstorage', () => {
			result = get(subject);

			expect(result).toEqual(simpleList);
			expect(result[1]).toEqual({id: '43', title: 'moar tests'});
		});

		describe('add()', () => {
			beforeEach(() => {
				subject.add({id: '73', title: 'add through the store'});
				result = get(subject);
			});

			it('appends to the store', () => {
				expect(result).toEqual([
					{id: '42', title: 'test transformations', completed: true},
					{id: '43', title: 'moar tests'},
					{id: '73', title: 'add through the store', completed: false}
				]);
			});
		});

		describe('remove()', () => {
			beforeEach(() => {
				subject.remove('43');
				result = get(subject);
			});

			it('removes a list item', () => {
				expect(result).toEqual([
					{id: '42', title: 'test transformations', completed: true},
				]);
			});
		});

		describe('toggle()', () => {
			describe('for marking completed items', () => {
				beforeEach(() => {
					subject.toggle('43', true);
					result = get(subject);
				});

				it('updates just the completed state of the selected item', () => {
					expect(result[1]).toEqual(
						{id: '43', title: 'moar tests', completed: true}
					);
				});
			});

			describe('for marking incomplete items', () => {
				beforeEach(() => {
					subject.toggle('42', false);
					result = get(subject);
				});

				it('updates just the completed state of the selected item', () => {
					expect(result[0]).toEqual(
						{id: '42', title: 'test transformations', completed: false}
					);
				});
			});
		});

		describe('updateTitle()', () => {
			describe('for changing todo item text', () => {
				beforeEach(() => {
					subject.updateTitle('42', 'test stores');
					result = get(subject);
				});

				it('updates just the completed state of the selected item', () => {
					expect(result[0]).toEqual(
						{id: '42', title: 'test stores', completed: true}
					);
				});
			});
		});

		describe('toggleAll()', () => {
			describe('when marking all items as completed', () => {
				beforeEach(() => {
					subject.toggleAll(true);
					result = get(subject);
				});

				it('all items are updated accordingly', () => {
					expect(result).toEqual([
						{id: '42', title: 'test transformations', completed: true},
						{id: '43', title: 'moar tests', completed: true}
					]);
				});
			});

			describe('when marking all items as incomplete', () => {
				beforeEach(() => {
					subject.toggleAll(false);
					result = get(subject);
				});

				it('all items are updated accordingly', () => {
					expect(result).toEqual([
						{id: '42', title: 'test transformations', completed: false},
						{id: '43', title: 'moar tests', completed: false}
					]);
				});
			});
		});

		describe('clearAllCompleteds()', () => {
			beforeEach(() => {
				subject.clearAllCompleteds();
				result = get(subject);
			});

			it('removes all items that are complete', () => {
				expect(result).toEqual([
					{id: '43', title: 'moar tests'}
				]);
			});
		});
	});

	describe('store: visible', () => {
		beforeEach(() => {
			subject = visible;
		});

		it('visible when there are results', () => {
			todos.set(simpleList);
			result = get(subject);
			expect(result).toBe(true);
		});

		it('invisible when there are no results', () => {
			todos.set([]);
			result = get(subject);
			expect(result).toBe(false);
		});
	});
});

