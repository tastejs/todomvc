'use strict';
/*global describe, it, expect */

import { valid, build } from '../../js/models/todo';

describe('models/todo', () => {
	describe('valid()', () => {
		it('rejects items that do not have a title', () => {
			const isValid = valid({});
			expect(isValid).toBe(false);
		});

		it('rejects items that do not have a blank title', () => {
			const isValid = valid({title: null});
			expect(isValid).toBe(false);
		});

		it('rejects items that are purely whitespace', () => {
			const isValid = valid({title: '  '});
			expect(isValid).toBe(false);
		});

		it('accepts items that have some kind of content aside from whitespace', () => {
			const isValid = valid({title: '  a '});
			expect(isValid).toBe(true);
		});
	});

	describe('build()', () => {
		it('will use default attributes if none are supplied', () => {
			const todo = build({});
			expect(todo).toEqual({title: '', completed: false});
		});

		it('all attributes are overridable', () => {
			const todo = build({id: '42', title: 'Build perpetual motion generator', completed: true});
			expect(todo).toEqual({id: '42', title: 'Build perpetual motion generator', completed: true});
		});
	});
});
