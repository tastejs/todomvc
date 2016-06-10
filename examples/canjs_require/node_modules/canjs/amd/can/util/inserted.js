/*!
 * CanJS - 2.0.7
 * http://canjs.us/
 * Copyright (c) 2014 Bitovi
 * Wed, 26 Mar 2014 16:12:27 GMT
 * Licensed MIT
 * Includes: CanJS default build
 * Download from: http://canjs.us/
 */
define(["can/util/can"], function (can) {
	// Given a list of elements, check if they are in the dom, if they 
	// are in the dom, trigger inserted on them.
	can.inserted = function (elems) {
		// prevent mutations from changing the looping
		elems = can.makeArray(elems);
		var inDocument = false,
			// Not all browsers implement document.contains (Android)
			doc = can.$(document.contains ? document : document.body),
			children;
		for (var i = 0, elem;
			(elem = elems[i]) !== undefined; i++) {
			if (!inDocument) {
				if (elem.getElementsByTagName) {
					if (can.has(doc, elem)
						.length) {
						inDocument = true;
					} else {
						return;
					}
				} else {
					continue;
				}
			}

			if (inDocument && elem.getElementsByTagName) {
				children = can.makeArray(elem.getElementsByTagName("*"));
				can.trigger(elem, "inserted", [], false);
				for (var j = 0, child;
					(child = children[j]) !== undefined; j++) {
					// Trigger the destroyed event
					can.trigger(child, "inserted", [], false);
				}
			}
		}
	};

	can.appendChild = function (el, child) {
		var children;
		if (child.nodeType === 11) {
			children = can.makeArray(child.childNodes);
		} else {
			children = [child];
		}
		el.appendChild(child);
		can.inserted(children);
	};
	can.insertBefore = function (el, child, ref) {
		var children;
		if (child.nodeType === 11) {
			children = can.makeArray(child.childNodes);
		} else {
			children = [child];
		}
		el.insertBefore(child, ref);
		can.inserted(children);
	};

});