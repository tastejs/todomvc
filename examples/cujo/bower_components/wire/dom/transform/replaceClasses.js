(function (define) {
define(function (require) {
"use strict";

	var removeRxParts, trimLeadingRx, splitClassNamesRx, partial;

	removeRxParts = ['(\\s+|^)(', ')(\\b(?![\\-_])|$)'];
	trimLeadingRx = /^\s+/;
	splitClassNamesRx = /(\b\s+\b)|(\s+)/g;
	partial = require('../../lib/functional').partial;

	/**
	 * Configures a transform function that satisfies the most common
	 * requirement for oocss states: while adding new classes, it removes
	 * classes in the same group of states. This allows the dev to add
	 * and remove classes in the same atomic action.
	 * @param [options.node] {HTMLElement}
	 * @param [options] {Object} a hashmap of options
	 * @param [options.group] {Array|String} If specified, this is a
	 *   list of all possible classes in the group.  If a single string is
	 *   provided, it should be a space-delimited (TokenList) of classes.
	 * @param [options.initial] {Array|String} If specified, this is the
	 *   initial set of classes to set on the element.  This isn't just a
	 *   convenience feature: it may be necessary for this transform to work
	 *   correctly if not specifying a group.  See the description.
	 * @param [options.remover] {Function} a custom remover function that can
	 *   be used to remove old classes when adding new ones.  If this option is
	 *   specified, the group option is ignored. Remover signature:
	 *   function (classesToRemove, baseRemover) { return newClasses; }
	 *   The baseRemover param is a function that will remove classes in the
	 *   usual way.  Call baseRemover.setRemoves(groupOrString) to set
	 *   the classes that should be removed when next invoked.
	 *
	 * @description
	 * If the group param is provided, all of the class names in the group
	 * will be removed from the element when new classes are added. A group
	 * is a set of classes that always change together (e.g. "can-edit
	 * can-delete can-view can-add" or "form-enabled form-disabled"). A
	 * group could consist of several groups at once as long as the classes
	 * for those groups are always set together, as well.
	 * If the group param is omitted, group behavior can still be achieved
	 * under most circumstances. As long as the transform function is always
	 * used on the same group (or set of groups)*, an algorithm that removes
	 * the previously set classes also works fine. (*It is possible to
	 * set classes that are not specified within the configured group.)
	 *
	 * @example 1: groups is a string
	 *   oocssSetter = configureReplaceClassNames(viewNode, {
	 *     group: 'edit-mode readonly-mode'
	 *   });
	 *   // later:
	 *   oocssSetter('edit-mode'); // viewNode.className == 'edit-mode';
	 *   // even later:
	 *   oocssSetter('readonly-mode'); // viewNode.className == 'readonly-mode';
	 *
	 * @example 2: groups is an array
	 *   oocssSetter = configureReplaceClassNames(viewNode, {
	 *     group: ['edit-mode', 'readonly-mode']
	 *   });
	 *
	 * @example 3: multiple groups at once
	 *   oocssSetter = configureReplaceClassNames(viewNode, {
	 *     group: ['edit-mode readonly-mode form-enabled form-disabled']
	 *   });
	 *   // later, be sure to set both groups at once:
	 *   oocssSetter('edit-mode form-enabled');
	 *
	 * @example 4: no group specified
	 *   oocssSetter = configureReplaceClassNames(viewNode, {
	 *     initial: 'form-disabled'
	 *   });
	 *   // later:
	 *   oocssSetter('form-enabled'); // form-disabled is removed
	 *
	 * @example 5: extra classes not in a group
	 *   oocssSetter = configureReplaceClassNames(viewNode, {
	 *     group: ['edit-mode readonly-mode']
	 *   });
	 *   // later (this is problematic if you didn't specify a group!)
	 *   oocssSetter('edit-mode error-in-form');
	 */
	return function configureReplaceClasses (options) {
		var group, remover, replace, prev = '';

		if (!options) options = {};

		group = options.group;

		if (options.remover) {
			remover = createCustomRemover(options.remover);
		}
		else if (group) {
			remover = createClassRemover(group);
		}
		else {
			remover = (function createPrevRemover (remover) {
				return function removePrev (classes) {
					remover.setRemoves(prev);
					return remover(classes);
				};
			}(createClassRemover()));
		}

		replace = options.node
			? partial(replaceClasses, options.node)
			: replaceClasses;

		if (options.initial) {
			// set the original classes
			replace(options.initial);
		}

		return replace;

		function replaceClasses (node, classes) {
			var leftovers;

			if (!classes) classes = '';

			// there were likely classes we didn't remove
			leftovers = remover(node.className);

			// save
			prev = classes;

			// assemble new classes
			classes = classes + (classes && leftovers ? ' ' : '') + leftovers;

			return node.className = classes;
		}

		function createClassRemover (tokens) {
			var removeRx;
			function genRx (tokens) {
				if(!tokens) return;
				// convert from array
				tokens = typeof tokens.join == 'function'
					? tokens.join('|')
					: tokens.replace(splitClassNamesRx, '|');
				// set up the regexp to remove everything in the set of tokens
				removeRx = new RegExp(removeRxParts.join(tokens), 'g');
			}
			function remover (classes) {
				return classes.replace(removeRx, '').replace(trimLeadingRx, '');
			}
			remover.setRemoves = genRx;
			if (tokens) genRx(tokens);
			return remover;
		}

		function createCustomRemover (custom) {
			var remover = createClassRemover();
			return function removeCustom (classes) {
				return custom(classes, remover);
			};
		}

	};

});
}(
	typeof define == 'function' && define.amd
		? define
		: function (factory) { module.exports = factory(require); }
));
