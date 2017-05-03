(function(buster, when, delay, ArrayAdapter) {

var assert, refute, undef;

assert = buster.assert;
refute = buster.refute;

function promiseFor(array) {
	return delay(array, 0);
}

buster.testCase('adapter/Array', {

	'canHandle': {
		'should return true for an Array': function() {
			assert(ArrayAdapter.canHandle([]));
		},

		'should return true for a promise': function() {
			assert(ArrayAdapter.canHandle(when.defer().promise));
		},

		'should return false for a non-Array': function() {
			refute(ArrayAdapter.canHandle(null));
			refute(ArrayAdapter.canHandle(undef));
			refute(ArrayAdapter.canHandle(0));
			refute(ArrayAdapter.canHandle(true));
			refute(ArrayAdapter.canHandle({ length: 1 }));
		}
	},

	'options': {
		'should be a provider by default': function() {
			var a = new ArrayAdapter([]);
			assert(a.provide);
		},

		'should allow overriding provide': function() {
			var a = new ArrayAdapter([], { provide: false });
			refute(a.provide);
		}
	},

	'forEach': {

		'should iterate over all items': function() {
			var src, forEachSpy;

			src = new ArrayAdapter([
				{ id: 1 }, { id: 2 }
			]);

			forEachSpy = this.spy();

			src.forEach(forEachSpy);

			assert.calledTwice(forEachSpy);
			assert.calledWith(forEachSpy, { id: 1 });
			assert.calledWith(forEachSpy, { id: 2 });
		},

		'should iterate over all promised items': function(done) {
			var src, forEachSpy;

			src = new ArrayAdapter(promiseFor([
				{ id: 1 }, { id: 2 }
			]));

			forEachSpy = this.spy();

			src.forEach(forEachSpy).then(function() {
				assert.calledTwice(forEachSpy);
				assert.calledWith(forEachSpy, { id: 1 });
				assert.calledWith(forEachSpy, { id: 2 });
				done();
			});
		}

	},

	'add': {

		'should add new items': function() {
			var pa = new ArrayAdapter([
				{ id: 1 }
			]);

			pa.add({ id: 2 });

			var spy = this.spy();

			pa.forEach(spy);

			assert.calledTwice(spy);

		},

		'should allow adding an item that already exists': function() {
			var pa = new ArrayAdapter([
				{ id: 1 }
			]);

			var spy = this.spy();

			pa.forEach(spy);

			assert.calledOnce(spy);
		},

		'promise-aware': {

			'should add new items': function(done) {
				var pa, spy;

				pa = new ArrayAdapter(promiseFor([
					{ id: 1 }
				]));

				spy = this.spy();

				when(pa.add({ id: 2 }),
					function() {
						return pa.forEach(spy);
					}
				).then(
					function() {
						assert.calledTwice(spy);
					}
				).then(done, done);
			},

			'should allow adding an item that already exists': function(done) {
				var pa, spy;

				pa = new ArrayAdapter(promiseFor([
					{ id: 1 }
				]));

				spy = this.spy();

				when(pa.add({ id: 1 }),
					function() {
						return pa.forEach(spy);
					}
				).then(
					function() {
						assert.calledOnce(spy);
					}
				).then(done, done);
			}

		}

	},

	'remove': {

		'should remove items': function() {
			var pa = new ArrayAdapter([
				{ id: 1 }, { id: 2 }
			]);

			pa.remove({ id: 1 });

			var spy = this.spy();

			pa.forEach(spy);

			assert.calledOnce(spy);
		},

		'should allow removing non-existent items': function() {
			var pa = new ArrayAdapter([]);

			var spy = this.spy();

			pa.forEach(spy);

			refute.called(spy);
		},

		'promise-aware': {

			'should remove items': function(done) {
				var pa, spy;

				pa = new ArrayAdapter(promiseFor([
					{ id: 1 }, { id: 2 }
				]));

				spy = this.spy();

				when(pa.remove({ id: 2 }),
					function() {
						return pa.forEach(spy);
					}
				).then(
					function() {
						assert.calledOnce(spy);
					}
				).then(done, done);
			},

			'should allow removing non-existent items': function(done) {
				var pa, spy;

				pa = new ArrayAdapter(promiseFor([]));

				spy = this.spy();

				when(pa.remove({ id: 2 }),
					function() {
						return pa.forEach(spy);
					}
				).then(
					function() {
						refute.calledOnce(spy);
					}
				).then(done, done);

			}

		}

	},

	'update': {
		'should update items': function() {
			var pa = new ArrayAdapter([
				{ id: 1, success: false }
			]);

			var spy = this.spy();

			pa.update({ id: 1, success: true });

			pa.forEach(spy);

			assert.calledOnceWith(spy, { id: 1, success: true });
		},

		'should ignore updates to non-existent items': function() {
			var pa = new ArrayAdapter([
				{ id: 1, success: true }
			]);

			var spy = this.spy();

			pa.update({ id: 2, success: false });

			pa.forEach(spy);

			assert.calledOnceWith(spy, { id: 1, success: true });
		},

		'promise-aware': {

			'should update items': function(done) {
				var pa, spy, expected;

				pa = new ArrayAdapter(promiseFor([
					{ id: 1, success: false }
				]));

				spy = this.spy();

				expected = { id: 1, success: true };

				when(pa.update(expected),
					function() {
						return pa.forEach(spy);
					}
				).then(
					function() {
						assert.calledOnceWith(spy, expected);
					}
				).then(done, done);
			},

			'should ignore updates to non-existent items': function(done) {
				var pa, spy, expected;

				expected = { id: 1, success: true };
				pa = new ArrayAdapter(promiseFor([
					expected
				]));

				spy = this.spy();


				when(pa.update({ id: 2, success: false }),
					function() {
						return pa.forEach(spy);
					}
				).then(
					function() {
						assert.calledOnceWith(spy, expected);
					}
				).then(done, done);
			}
		}
	},

	'clear': {
		'should remove all items': function() {
			var src, forEachSpy;

			src = new ArrayAdapter([
				{ id: 1 }, { id: 2 }
			]);

			forEachSpy = this.spy();

			src.clear();
			src.forEach(forEachSpy);

			refute.called(forEachSpy);
		},

		'promise-aware': {
			'should remove all items': function(done) {
				var src, forEachSpy;

				src = new ArrayAdapter(promiseFor([
					{ id: 1 }, { id: 2 }
				]));

				forEachSpy = this.spy();

				when(src.clear(),
					function() {
						return src.forEach(forEachSpy);
					}
				).then(
					function() {
						refute.called(forEachSpy);
					}
				).then(done, done);
			}
		}
	}
});
})(
	require('buster'),
	require('when'),
	require('when/delay'),
	require('../../adapter/Array')
);