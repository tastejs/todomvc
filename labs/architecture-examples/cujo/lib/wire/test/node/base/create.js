(function(buster, wire, ExpectedType) {
"use strict";

var assert, refute, fail, objectModule, functionModule, constructorModule;

assert = buster.assert;
refute = buster.refute;
fail = buster.assertions.fail;

objectModule = './test/node/fixtures/object';
functionModule = './test/node/fixtures/function';
constructorModule = './test/node/fixtures/constructor';

buster.testCase('base:create', {
	'should call non-constructor functions': function(done) {
		wire({
			test: {
				create: functionModule
			}
		}).then(
			function(context) {
				assert('test' in context);
			},
			fail
		).then(done, done);
	},

	'should call function with single arg': function(done) {
		wire({
			test: {
				create: {
					module: functionModule,
					args: 1
				}
			}
		}).then(
			function(context) {
				assert.equals(context.test, 1);
			},
			fail
		).then(done, done);
	},

	'should call function with multiple arg': function(done) {
		wire({
			test: {
				create: {
					module: functionModule,
					args: [1, 2]
				}
			}
		}).then(
			function(context) {
				assert.equals(context.test, 3);
			},
			fail
		).then(done, done);
	},

	'should call constructor functions using new': function(done) {
		wire({
			test: {
				create: constructorModule
			}
		}).then(
			function(context) {
				assert.isObject(context.test);
			},
			function(e) {
				console.error(e);
				return e;
			}
		).then(done, done);
	},

	'should call constructor functions with args': function(done) {
		wire({
			test: {
				create: {
					module: constructorModule,
					args: 1
				}
			}
		}).then(
			function(context) {
				assert.equals(context.test.value, 1);
			},
			fail
		).then(done, done);
	},

	'should wire args': function(done) {
		wire({
			test: {
				create: {
					module: functionModule,
					args: [
						{
							create: {
								module: functionModule,
								args: 1
							}
						},
						{
							create: {
								module: functionModule,
								args: 2
							}
						}
					]
				}
			}
		}).then(
			function(context) {
				assert.equals(context.test, 3);
			},
			fail
		).then(done, done);
	},

	'should beget new object when used with object module': function(done) {
		wire({
			child: {
				create: objectModule
			}
		}).then(
			function(context) {
				assert.isObject(context.child);
			}
		).then(done, done);
	},

	'should beget new object when used with constructed object ref': function(done) {
		wire({
			parent: {
				create: {
					module: constructorModule,
					args: 1
				}
			},
			child: {
				create: { $ref: 'parent' }
			}
		}).then(
			function(context) {
				assert.isObject(context.child);
				assert(context.child instanceof ExpectedType);
				assert.equals(context.child.value, 1);
				refute(context.child.hasOwnProperty('value'));
			}
		).then(done, done);
	}
});

})(
	require('buster'),
	require('../../../wire'),
	require('./../fixtures/constructor')
);