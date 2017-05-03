(function(buster, when, delay, ObjectAdapter) {
"use strict";

var assert, refute, fail;

assert = buster.assert;
refute = buster.refute;
fail = buster.assertions.fail;

function promiseFor(it) {
	return delay(it, 0);
}

buster.testCase('adapter/Object', {
	'options': {
		'should pass options to getOptions': function () {
			var bindings = {}, adaptedObject;
			adaptedObject = new ObjectAdapter({}, {
				bindings: bindings
			});
			assert.equals(bindings, adaptedObject.getOptions().bindings);
		}
	},
	
	'canHandle': {
		'should return true for a object literals': function () {
			assert(ObjectAdapter.canHandle({}), 'object');
		},

		'should return true for a promise': function() {
			assert(ObjectAdapter.canHandle(promiseFor({})));
		},

		'should return false for non-object literals': function () {
			refute(ObjectAdapter.canHandle(), 'undefined');
			refute(ObjectAdapter.canHandle(null), 'null');
			refute(ObjectAdapter.canHandle(function(){}), 'function');
			refute(ObjectAdapter.canHandle([]), 'array');
		}
	},
	
	'update': {
		'should update an object when update() called': function () {
			var obj, adapted;
			obj = { first: 'Fred', last: 'Flintstone' };
			adapted = new ObjectAdapter(obj);
			adapted.update({ first: 'Donna', last: 'Summer' });
			assert.equals(adapted._obj.first, 'Donna');
			assert.equals(adapted._obj.last, 'Summer');
		},

		'should update some properties when update() called with a partial': function () {
			var obj, adapted;
			obj = { first: 'Fred', last: 'Flintstone' };
			adapted = new ObjectAdapter(obj);
			adapted.update({ last: 'Astaire' });
			assert.equals(adapted._obj.first, 'Fred');
			assert.equals(adapted._obj.last, 'Astaire');
		},
		
		'promise-aware': {
			'should update an object': function (done) {
				var obj, adapted;
				obj = { first: 'Fred', last: 'Flintstone' };
				adapted = new ObjectAdapter(promiseFor(obj));
				when(adapted.update({ first: 'Donna', last: 'Summer' }),
					function() {
						return when(adapted._obj, function(obj) {
							assert.equals(obj.first, 'Donna');
							assert.equals(obj.last, 'Summer');
						});
					},
					fail
				).then(done, done);
			},

			'should update supplied properties when called with a partial': function (done) {
				var obj, adapted;
				obj = { first: 'Fred', last: 'Flintstone' };
				adapted = new ObjectAdapter(promiseFor(obj));
				when(adapted.update({ last: 'Astaire' }),
					function() {
						return when(adapted._obj, function(obj) {
							assert.equals(obj.first, 'Fred');
							assert.equals(obj.last, 'Astaire');
						});
					},
					fail
				).then(done, done);
			}
		}

	}
});
})(
	require('buster'),
	require('when'),
	require('when/delay'),
	require('../../adapter/Object')
);
