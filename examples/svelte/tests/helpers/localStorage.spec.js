'use strict';
/*global describe, beforeEach, expect, it, jest */

import localStorage from '../../js/helpers/localStorage';

let subject;

const mockSetItem = jest.fn();

describe('helpers/localStorage', () => {
	beforeEach(() => {
		jest.spyOn(Object.getPrototypeOf(window.localStorage), 'getItem');
		jest.spyOn(Object.getPrototypeOf(window.localStorage), 'setItem');

		Object.getPrototypeOf(window.localStorage).setItem = mockSetItem;
	});

	describe('read()', () => {
		describe('when data is available', () => {
			beforeEach(() => {
				Object.getPrototypeOf(window.localStorage).getItem = jest.fn()
					.mockReturnValue(
						'[{"id":"17275100-3837-4368-b3ec-791cf1d620f8","title":"Implement Svelte example","completed":true},{"id":"17220994-8d11-4c5e-beab-3cf862a2b71f","title":"Write tests","completed":false}]');  

				subject = localStorage.read();
			});

			it('deserializes all the svelte todos data from localstorage', () => {
				expect(subject).toEqual(
					[
						{
							id: '17275100-3837-4368-b3ec-791cf1d620f8',
							title: 'Implement Svelte example',
							completed: true
						},
						{
							id: '17220994-8d11-4c5e-beab-3cf862a2b71f',
							title: 'Write tests',
							completed: false
						}
					]
				);
			});
		});

		describe('when there is no data', () => {
			beforeEach(() => {
				Object.getPrototypeOf(window.localStorage).getItem = jest.fn()
					.mockReturnValue(null);

				subject = localStorage.read();
			});

			it('gives an empty result set', () => {
				expect(subject).toEqual([]);
			});
		});
	});

	describe('write()', () => {
		describe('when applying a data change', () => {
			beforeEach(() => {
				const newList = {
					id: '17220994-8d11-4c5e-beab-3cf862a2b71f',
					title: 'Who needs tests?',
					completed: true
				};
				subject = localStorage.write(newList);
			});

			it('serializes and updates localStorage for this examples storage slot', () => {
				expect(mockSetItem).toHaveBeenCalledWith(
					'todos-svelte',
					'{\"id\":\"17220994-8d11-4c5e-beab-3cf862a2b71f\",\"title\":\"Who needs tests?\",\"completed\":true}'
				);
			});
		});
	});
});
