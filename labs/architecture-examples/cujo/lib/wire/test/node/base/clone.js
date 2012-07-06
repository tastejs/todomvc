(function(buster, wire) {

var assert, refute, fail;

assert = buster.assert;
refute = buster.refute;
fail = buster.assertions.fail;

buster.testCase('base:clone', {

	'clone factory': {
		'should return same type of object': function(done) {
			wire({
				object: { literal: {} },
				array: { literal : [] },
				date: { literal: new Date('12/01/2007') },
				regexp: { literal: /foo/i },
				obj1: {
					clone: { $ref: 'object' }
				},
				array1: {
					clone: { $ref: 'array' }
				},
				date1: {
					clone: { $ref: 'date' }
				},
				rx1: {
					clone: { $ref: 'regexp' }
				}
			}).then(function (context) {
				assert.equals(({}).toString.call(context.obj1), '[object Object]');
				assert.isArray(context.array1);
				assert.equals(({}).toString.call(context.date1), '[object Date]');
				assert.equals(({}).toString.call(context.rx1), '[object RegExp]');
				done();
			}, fail
			).then(done, done);
		},

		'should make copies of deep objects when deep == true': function(done) {
			// TODO
			wire({
				orig: {
					literal: {
						foo: {
							bar: {
								prop: 42
							}
						}
					}
				},
//				obj2: { clone: { $ref: 'orig' } },
				obj1: {
					clone: { source: { $ref: 'orig'}, deep: true }
				},
				arr: {
					literal: [
						{ foo: 'foo' },
						42,
						'skeletor',
						['a', 'b', 'c']
					]
				},
				arr1: {
					clone: { source: { $ref: 'arr' }, deep: true }
				}
			}).then(function (context) {
				// check object
				assert.defined(context.obj1, 'obj1 is defined');
				assert.defined(context.obj1.foo, 'obj1.foo is defined');
				assert.defined(context.obj1.foo.bar, 'obj1.foo.bar is defined');
				refute.same(context.orig.foo.bar, context.obj1.foo.bar); // should be diff objects
				assert.equals(context.orig.foo.bar.prop, context.obj1.foo.bar.prop);
				// check array
				assert.defined(context.arr1, 'arr1 is defined');
				assert.defined(context.arr1[0].foo, 'arr1[0].foo is defined');
				assert.defined(context.arr1[1], 'arr1[1] is defined');
				assert.defined(context.arr1[2], 'arr1[2] is defined');
				for (var i = 0; i < 3; i++) {
					assert.defined(context.arr1[3][i], 'arr1[3][' + i + '] is defined');
					assert.equals(context.arr1[3][i], context.arr[3][i]);
				}
				// check that copies were made
				refute.same(context.arr[0], context.arr1[0], 'object array element');
				refute.same(context.arr[3], context.arr1[3], 'nested array element');
			}, fail
			).then(done, done);
		},

		'should copy all enumerable properties of an object': function (done) {
			wire({
				orig: {
					literal: {
						foo: 'foo',
						bar: 'bar'
					}
				},
				copy: {
					clone: { $ref: 'orig' }
				}
			}).then(function (context) {
				assert.defined(context.copy, 'copy exists');
				assert.defined(context.copy.foo, 'copy.foo exists');
				assert.defined(context.copy.bar, 'copy.bar exists');
			}, fail).then(done, done);
		},

		'should call constructor when cloning an object with a constructor': function(done) {
			function Fabulous () {
				this.instanceProp = 'instanceProp';
			}
			Fabulous.prototype = {
				prototypeProp: 'prototypeProp'
			};
			wire({
				fab: {
					create: Fabulous
				},
				copy: {
					clone: { $ref: 'fab' }
				}
			}).then(function(context) {
				assert.defined(context.copy, 'copy is defined');
				assert.defined(context.copy.prototypeProp, 'copy.prototypeProp is defined');
				assert.defined(context.copy.instanceProp, 'copy.instanceProp is defined');
				refute.same(context.copy, context.fab);
			}, fail).then(done, done);
		}
	}

});

})(
	require('buster'),
	require('../../../wire')
);