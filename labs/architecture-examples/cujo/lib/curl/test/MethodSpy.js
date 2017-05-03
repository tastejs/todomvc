define(function () {

	function MethodSpy (method, context) {
		var count, orig, spy;

		count = 0;
		orig = context[method];

		context[method] = function () {
			count++;
			return orig.apply(context, arguments);
		};

		return {
			calledNever: function () { return count == 0; },
			calledOnce: function () { return count == 1; },
			calledTwice: function () { return count == 2; },
			calledMany: function (howMany) { return count == howMany; }
		};
	}

	return MethodSpy;

});
