define(function () {

	return function configureAsserts (success, failure, name) {

		function doFail (msg) {
			failure(name + (msg ? ' - ' + msg : ''));
		}

		function doSuccess (msg) {
			success(name + (msg ? ' - ' + msg : ''));
		}

		function assert (val, msg) {
			(val === true ? doSuccess : doFail)(msg);
		}

		assert.equal = function equal (expected, val, msg) {
			if (val !== expected) {
				doFail(msg + ' (expected: ' + expected + '. got: ' + val + ')');
			}
			else {
				doSuccess(msg);
			}
		};

		return assert;
	};

});
