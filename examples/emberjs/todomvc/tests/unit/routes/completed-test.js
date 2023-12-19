import { module, test } from 'qunit';

import { setupTest } from 'todomvc/tests/helpers';

module('Unit | Route | completed', function (hooks) {
	setupTest(hooks);

	test('it exists', function (assert) {
		let route = this.owner.lookup('route:completed');

		assert.ok(route);
	});
});
