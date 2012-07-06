(function(buster, when, delay, makeTransformed) {
"use strict";

var assert, refute, fail;

assert = buster.assert;
refute = buster.refute;
fail = buster.assertions.fail;

function createFakeAdapter(data) {
	data = data || [];
	return {
		add: function(item) {},
		remove: function(item) {},
		update: function(item) {},
		clear: function() {},
		forEach: function(f) {
			for(var i = 0, len = data.length; i < len; i++) {
				f(data[i]);
			}
		},
		getOptions: function() {}
	}
}

function resolved(val) {
	return delay(val, 0);
}

function makePromised(f) {
	function promised(x) {
		return resolved(f(x));
	}

	if(f.inverse) {
		promised.inverse = function(x) {
			return resolved(f.inverse(x));
		}
	}

	return promised;
}

function addOne(x) {
	return x + 1;
}

function addOneWithInverse(x) {
	return addOne(x);
}

addOneWithInverse.inverse = function(x) {
	return x - 1;
};

buster.testCase('adapter/makeTransformed', {
	'should throw if no transform provided': function() {
		assert.exception(function() {
			makeTransformed(createFakeAdapter());
		});
	},

	'should not modify original adapter': function() {
		var adapter, p, originals;

		originals = {};
		adapter = createFakeAdapter();

		for(p in adapter) {
			originals[p] = adapter[p];
		}

		makeTransformed(adapter, addOneWithInverse);
		for(p in adapter) {
			assert.same(adapter[p], originals[p]);
		}
	},

	'should preserve original comparator': function() {
		var adapter, transformed;

		function comparator(){}

		adapter = createFakeAdapter();
		adapter.comparator = comparator;
		transformed = makeTransformed(adapter, addOneWithInverse);

		assert.same(transformed.comparator, comparator);
	},

	'should preserve original identifier': function() {
		var adapter, transformed;

		function identifier(){}

		adapter = createFakeAdapter();
		adapter.identifier = identifier;
		transformed = makeTransformed(adapter, addOneWithInverse);

		assert.same(transformed.identifier, identifier);
	},

	'getOptions': {
		'should return original adapter options': function() {
			var adapter, transformed, options;

			options = {};
			adapter = this.stub(createFakeAdapter());
			transformed = makeTransformed(adapter, addOneWithInverse);

			adapter.getOptions.returns(options);
			assert.same(transformed.getOptions(), options);
		}
	},

	'forEach': {
		'should delegate with transformed value': function() {
			var adapter, transformed, lambda;

			adapter = createFakeAdapter([1]);
			transformed = makeTransformed(adapter, addOne);

			lambda = this.spy();

			transformed.forEach(lambda);

			assert.calledOnceWith(lambda, 2);
		},

		'should allow promised transforms': function(done) {
			var adapter, transformed, lambda, results;

			adapter = createFakeAdapter([1, 2, 3]);
			transformed = makeTransformed(adapter, makePromised(addOne));

			results = [];
			lambda = function(val) {
				results.push(val);
			};

			when(transformed.forEach(lambda),
				function() {
					assert.equals(results, [2,3,4]);
				},
				fail
			).then(done, done);
		}
	},

	'add': {
		'should call original with inverse transformed item': function() {
			var adapter, transformed;

			adapter = this.stub(createFakeAdapter());
			transformed = makeTransformed(adapter, addOneWithInverse);

			transformed.add(1);
			assert.calledOnceWith(adapter.add, 0);
		},

		'should allow promised transforms': function(done) {
			var adapter, transformed;

			adapter = this.stub(createFakeAdapter());
			transformed = makeTransformed(adapter, makePromised(addOneWithInverse));

			when(transformed.add(1),
				function() {
					assert.calledOnceWith(adapter.add, 0);
				},
				fail
			).then(done, done);
		}
	},

	'remove': {
		'should call original with inverse transformed item': function() {
			var adapter, transformed;

			adapter = this.stub(createFakeAdapter());
			transformed = makeTransformed(adapter, addOneWithInverse);

			transformed.remove(1);
			assert.calledOnceWith(adapter.remove, 0);
		},

		'should allow promised transforms': function(done) {
			var adapter, transformed;

			adapter = this.stub(createFakeAdapter());
			transformed = makeTransformed(adapter, makePromised(addOneWithInverse));

			when(transformed.remove(1),
				function() {
					assert.calledOnceWith(adapter.remove, 0);
				},
				fail
			).then(done, done);
		}
	},

	'update': {
		'should call original with inverse transformed item': function() {
			var adapter, transformed;

			adapter = this.stub(createFakeAdapter());
			transformed = makeTransformed(adapter, addOneWithInverse);

			transformed.update(1);
			assert.calledOnceWith(adapter.update, 0);
		},

		'should allow promised transforms': function(done) {
			var adapter, transformed;

			adapter = this.stub(createFakeAdapter());
			transformed = makeTransformed(adapter, makePromised(addOneWithInverse));

			when(transformed.update(1),
				function() {
					assert.calledOnceWith(adapter.update, 0);
				},
				fail
			).then(done, done);
		}
	},

	'clear': {
		'should call original clear': function() {
			var adapter, transformed;

			adapter = this.stub(createFakeAdapter());
			transformed = makeTransformed(adapter, addOneWithInverse);

			transformed.clear();
			assert.calledOnce(adapter.clear);

		}
	}

});

})(
	require('buster'),
	require('when'),
	require('when/delay'),
	require('../../adapter/makeTransformed')
);