(function(buster, propertiesKey) {
"use strict";

var assert, refute;

assert = buster.assert;
refute = buster.refute;

buster.testCase('relational/propertiesKey', {

	'should return property value for single property': function() {
		var fixture, key;

		fixture = { foo: 'bar' };
		key = propertiesKey('foo');

		assert.equals(key(fixture), 'bar');
	},

	'should return undefined for missing single property': function() {
		var fixture, key;

		fixture = { foo: 'bar' };
		key = propertiesKey('missing');

		refute.defined(key(fixture));
	},

	'should return joined values for an array of properties': function() {
		var fixture, key;

		fixture = { p1: 'foo', p2: 'bar' };
		key = propertiesKey(['p1', 'p2']);

		assert.equals(key(fixture), 'foo|bar');
	},

	'should use the supplied join separator': function() {
		var fixture, key;

		fixture = { p1: 'foo', p2: 'bar' };
		key = propertiesKey(['p1', 'p2'], ',');

		assert.equals(key(fixture), 'foo,bar');
	},

	'should only include defined and non-null values for an array of properties': function() {
		var fixture, key;

		fixture = { p1: 'foo', p2: 'bar' };
		key = propertiesKey(['p1', 'p3', 'p2']);

		assert.equals(key(fixture), 'foo|bar');
	},

	'should return empty string when all properties in array are missing': function() {
		var fixture, key;

		fixture = { p1: 'foo', p2: 'bar' };
		key = propertiesKey(['p3', 'p4']);

		assert.equals(key(fixture), '');
	}

});

})(
	require('buster'),
	require('../../relational/propertiesKey')
);