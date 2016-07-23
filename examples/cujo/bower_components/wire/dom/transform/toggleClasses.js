(function (define) {
define(function (require) {

	var createReplaceClasses, partial;

	createReplaceClasses = require('./replaceClasses');
	partial = require('../../lib/functional').partial;

	return function (options) {
		var args, toggle, removes, replaceClasses,
			toggleClasses, addClasses, removeClasses;

		replaceClasses = createReplaceClasses({ remover: classRemover });
		removes = '';

		args = [];

		if(!options) options = {};

		if (options.node) args.push(options.node);
		if (options.classes) args.push(options.classes);

		toggleClasses = fixArgsAndCall.bind(null, doToggleClasses);
		addClasses = fixArgsAndCall.bind(null, doAddClasses);
		removeClasses = fixArgsAndCall.bind(null, doRemoveClasses);

		toggle = makePartial([toggleClasses].concat(args));
		toggle.add = makePartial([addClasses].concat(args));
		toggle.remove = makePartial([removeClasses].concat(args));

		return toggle;


		function fixArgsAndCall(func, node, classes) {
			// Since we're allowing either the node, or the classes, or both(!)
			// to be pre-bound, have to check the arguments here and swap
			// if necessary.
			if(typeof node == 'string') {
				removes = node;
				node = classes;
				classes = removes;
			} else {
				removes = classes;
			}

			return func(node, classes);
		}

		function doToggleClasses(node, classes) {
			// toggle is basically (a ^ b) where a == node's classes and b == toggled classes
			var fake, adds;
			// get everything that shouldn't be removed (adds)
			fake = { className: classes };
			removeClasses(fake, node.className);
			adds = fake.className;
			// remove toggled classes and put back adds
			removes = classes;
			replaceClasses(node, adds);
			return node;
		}

		function doRemoveClasses(node) {
			replaceClasses(node, '');
			return node;
		}

		function doAddClasses(node, classes) {
			replaceClasses(node, classes);
			return node;
		}

		function classRemover (classes, remover) {
			remover.setRemoves(removes);
			return remover(classes);
		}

	};

	function makePartial(args) {
		return partial.apply(null, args);
	}

});
}(
	typeof define == 'function' && define.amd
		? define
		: function (factory) { module.exports = factory(require); }
));