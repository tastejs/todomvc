(function (define) {
define(function (require) {

	var replaceClasses, weave, removes;
	replaceClasses = require('./replaceClasses')({ remover: classRemover });
	weave = require('../../lib/functional').weave;

	return function (options) {
		var args, toggle;

		args = { length: toggleClasses.length }; // sparse array-like object

		if (options.node) args[0] = options.node;
		if (options.classes) args[1] = options.classes;

		toggle = weave(toggleClasses, args);
		toggle.add = weave(addClasses, args);
		toggle.remove = weave(removeClasses, args);

		return toggle;

	};

	function toggleClasses (node, classes) {
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

	function addClasses (node, classes) {
		removes = classes;
		replaceClasses(node, classes);
		return node;
	}

	function removeClasses (node, classes) {
		removes = classes;
		replaceClasses(node, '');
		return node;
	}

	function classRemover (classes, remover) {
		remover.setRemoves(removes);
		return remover(classes);
	}

});
}(
	typeof define == 'function' && define.amd
		? define
		: function (factory) { module.exports = factory(require); }
));