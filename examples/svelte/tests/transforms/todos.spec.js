'use strict';
/*global describe, it, expect, jest, beforeEach */

import {
	add,
	remove,
	modify,
	modifyAll,
	filterByUncompleted,
} from '../../js/transforms/todos';
import { simpleList } from '../fixtures/todos';

jest.mock('../../js/helpers/uuid', () => ({
	v4: jest.fn().mockReturnValue('dummy-uuid')
}));

let result;
let list;

describe('transforms/todos', () => {
	beforeEach(() => {
		list = [];
	});

	describe('add()', () => {
		describe('with no todos entered yet', () => {
			it('appends new items to the list', () => {
				const newItem = {id: '42', title: 'test add', completed: true};
				result = add(list, newItem);
				expect(result).toEqual(
					[{ id: '42', title: 'test add', completed: true }]
				);
			});

			it('Falls back on default values where none are present', () => {
				const newItem = {};
				result = add(list, newItem);
				expect(result).toEqual(
					[{ id: 'dummy-uuid', title: '', completed: false }]
				);
			});
		});

		describe('with an existing list', () => {
			it('appends new items to the list', () => {
				list = [{id: '42', title: 'test add', completed: true}];
				const newItem = {id: '43', title: 'moar tests'};
				result = add(list, newItem);
				expect(result).toEqual(
					[
						{ id: '42', title: 'test add', completed: true },
						{ id: '43', title: 'moar tests', completed: false},
					]
				);
			});
		});
	});

	describe('remove()', () => {
		beforeEach(() => {
			list = simpleList;
		});

		it('removes items by id lookup', () => {
			result = remove(list, '42');
			expect(result).toEqual([{id: '43', title: 'moar tests'}]);
		});

		it('does nothing when removing non-existent ids', () => {
			result = remove(list, '99999');

			expect(result).toEqual(list);
			expect(result.length).toEqual(2);
		});
	});

	describe('modify()', () => {
		beforeEach(() => {
			list = simpleList;
		});

		it('changes the values for a specific item', () => {
			result = modify(list, '43', {title: 'testing is overrated', completed: false});

			expect(result).toEqual([
				{id: '42', title: 'test transformations', completed: true},
				{id: '43', title: 'testing is overrated', completed: false}
			]);
		});

		it('can modify individual attributes', () => {
			result = modify(list, '42', {completed: false});

			expect(result[0]).toEqual({id: '42', title: 'test transformations', completed: false});
		});

		it('does nothing if the id is not in the list', () => {
			result = modify(list, '99999', {title: 'Profit'});

			expect(result).toEqual(list);
			expect(result.length).toEqual(2);
		});
	});

	describe('modifyAll()', () => {
		beforeEach(() => {
			list = simpleList;
		});

		it('can be used to mark all items as completed', () => {
			result = modifyAll(list, {completed: true});

			expect(result).toEqual([
				{id: '42', title: 'test transformations', completed: true},
				{id: '43', title: 'moar tests', completed: true}
			]);
		});

		it('can be used to mark all items as not completed', () => {
			result = modifyAll(list, {completed: false});

			expect(result).toEqual([
				{id: '42', title: 'test transformations', completed: false},
				{id: '43', title: 'moar tests', completed: false}
			]);
		});
	});

	describe('filterByUncompleted()', () => {
		beforeEach(() => {
			list = simpleList;
		});

		it('filters out all completed items', () => {
			result = filterByUncompleted(simpleList);

			expect(result).toEqual([{id: '43', title: 'moar tests'}]);
		});
	});
});