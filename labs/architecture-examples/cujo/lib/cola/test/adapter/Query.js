(function(buster, when, QueryAdapter) {

var assert, refute, fail;

assert = buster.assert;
refute = buster.refute;
fail = buster.assertions.fail;

function promiseFor(it) {
	return when(it);
}

function createDatasource() {
	return {
		getIdentity: function() {},
		query: function() {},
		add: function() {},
		put: function() {},
		remove: function() {}
	};
}

buster.testCase('adapter/Query', {

	'should throw if no datasource provided': function() {
		assert.exception(function() {
			new QueryAdapter();
		});
	},

    'options': {
		'should be a provider by default': function() {
			var a = new QueryAdapter({});
			assert(a.provide);
		},

		'should allow overriding provide': function() {
			var a = new QueryAdapter({}, { provide: false });
			refute(a.provide);
		},

		'should preserve bindings options': function() {
            var bindings, adaptedObject;

            bindings = {};
            adaptedObject = new QueryAdapter({}, {
                bindings: bindings
            });

            assert.equals(adaptedObject.getOptions().bindings, bindings);
        }
    },

	'query': {
		'should query datasource': function(done) {
			var qa, ds, queryStub, added, removed;

			ds = this.stub(createDatasource());
			ds.query.returns(promiseFor([{ id: 1 }]));
			// Have to hold onto this stub because QueryAdapter
			// will replace ds.query
			queryStub = ds.query;

			added = this.spy();
			removed = this.spy();

			qa = new QueryAdapter(ds);

			// TODO: Should be able to just return this, but there is an error
			// in buster right now if we do.  When that's fixed, we can remove
			// the done() calls and just return a promise.
			qa.query().then(
				function() {
					assert.calledOnce(queryStub);
				},
				fail
			).then(done, done);
		}
	},

	'add': {
		'should add item to datasource': function(done) {
			var ds, qa, item;

			ds = this.stub(createDatasource());
			ds.getIdentity.returns(1);

			qa = new QueryAdapter(ds);

			item = { id: 1 };
			qa.add(item).then(
				function() {
					assert.calledOnceWith(ds.add, item);
				},
				fail
			).then(done, done);
		}
	},

	'remove': {
		'should remove item from datasource': function(done) {
			var ds, qa, item;

			item = { id: 1 };
			ds = this.stub(createDatasource());
			ds.query.returns([item]);
			ds.getIdentity.returns(item.id);

			qa = new QueryAdapter(ds);
			qa.query();

			qa.remove(item).then(
				function() {
					assert.calledOnceWith(ds.remove, item.id);
				},
				fail
			).then(done, done);

		}
	},

	'update': {
		'should update item in datasource': function(done) {
			var ds, qa, item;

			item = { id: 1 };
			ds = this.stub(createDatasource());
			ds.getIdentity.returns(1);
			ds.query.returns([item]);

			qa = new QueryAdapter(ds);
			qa.query();

			qa.update(item).then(
				function() {
					assert.calledOnceWith(ds.put, item);
				},
				fail
			).then(done, done);
		}
	},


	'forEach': {
		'should iterate over empty results before query': function() {
			var qa, spy;

			qa = new QueryAdapter(createDatasource());
			spy = this.spy();

			qa.forEach(spy);

			refute.called(spy);
		},

		'should iterate when results are available': function(done) {
			var ds, qa, spy;

			ds = this.stub(createDatasource());
			ds.query.returns(promiseFor([{ id: 1 }]));

			qa = new QueryAdapter(ds);
			spy = this.spy();

			qa.query();

			qa.forEach(spy).then(
				function() {
					assert.calledOnce(spy);
				},
				fail
			).then(done, done);

		}
	},

	'async': {
		'// should have tests to assert that values returned from server update internal state': function () {},
		'// should have tests to assert that errors returned from server are handled': function () {}
	}

});

})(
    require('buster'),
    require('when'),
    require('../../adapter/Query')
);