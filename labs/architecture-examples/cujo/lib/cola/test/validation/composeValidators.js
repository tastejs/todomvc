(function(buster, composeValidators) {

var assert, refute, fail;

assert = buster.assert;
refute = buster.refute;
fail = buster.assertions.fail;

buster.testCase('validation/composeValidators', {

	'should call each validator': function() {
		var v1, v2, v3, object;
		v1 = this.spy();
		v2 = this.spy();
		v3 = this.spy();

		object = {};

		composeValidators([v1, v2, v3])(object);

		assert.calledOnceWith(v1, object);
		assert.calledOnceWith(v2, object);
		assert.calledOnceWith(v3, object);
	},

	'should merge errors': function() {
		var v1, v2, v3, result;
		v1 = this.stub().returns({ valid: true });
		v2 = this.stub().returns({ valid: false, errors: [1] });
		v3 = this.stub().returns({ valid: false, errors: [2] });

		result = composeValidators([v1, v2, v3])({});

		assert.equals(result, { valid: false, errors: [1, 2] });
	},

	'should pass when all validators pass': function() {
		var v1, v2, result;
		v1 = this.stub().returns({ valid: true });
		v2 = this.stub().returns({ valid: true });

		result = composeValidators([v1, v2])({});

		assert.equals(result, { valid: true });
	},

	'should fail when at least one validator fails': function() {
		var v1, v2, v3, result;
		v1 = this.stub().returns({ valid: true });
		v2 = this.stub().returns({ valid: false });
		v3 = this.stub().returns({ valid: false });

		result = composeValidators([v1, v2, v3])({});

		assert.equals(result, { valid: false });
	}

});

})(
	require('buster'),
	require('../../validation/composeValidators')
);
