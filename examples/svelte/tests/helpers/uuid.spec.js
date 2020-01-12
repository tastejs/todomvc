'use strict';
/*global describe, beforeEach, expect, it */

import { v4 } from '../../js/helpers/uuid';

let subject;

describe('helpers/uuid', () => {
	describe('v4()', () => {
		beforeEach(() => {
			subject = v4();
		});

		it('creates an id of the expected pattern', () => {
			expect(subject).toMatch(
				/^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[0-9a-f]{4}-[0-9a-f]{12}$/
			);
		});

		it('creates an id of the expected length', () => {
			expect(subject.length).toBe(36);
		});

		it('no two ids are the same', () => {
			const otherUuid = v4();
			expect(subject).not.toEqual(otherUuid);
		});
	});
});
