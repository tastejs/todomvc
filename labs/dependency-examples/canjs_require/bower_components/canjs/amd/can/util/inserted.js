/*!
 * CanJS - 2.0.3
 * http://canjs.us/
 * Copyright (c) 2013 Bitovi
 * Tue, 26 Nov 2013 18:21:22 GMT
 * Licensed MIT
 * Includes: CanJS default build
 * Download from: http://canjs.us/
 */
define(["can/util/can"], function (can) {
	// Given a list of elements, check if they are in the dom, if they 
	// are in the dom, trigger inserted on them.
	can.inserted = function(elems){
		var inDocument = false,
			checked = false,
			children;
		for ( var i = 0, elem; (elem = elems[i]) !== undefined; i++ ) {
			if( !inDocument ) {
				if( elem.getElementsByTagName ){
					if( can.has( can.$(document) , elem ).length ) {
						inDocument = true;
					} else {
						return;
					}
				} else {
					continue;
				}
			}
			
			if(inDocument && elem.getElementsByTagName){
				can.trigger(elem,"inserted",[],false);
				children = can.makeArray( elem.getElementsByTagName("*") );
				for ( var j = 0, child; (child = children[j]) !== undefined; j++ ) {
					// Trigger the destroyed event
					can.trigger(child,"inserted",[],false);
				}
			}
		}
	}
	
	
	can.appendChild = function(el, child){
		if(child.nodeType === 11){
			var children = can.makeArray(child.childNodes);
		} else {
			var children = [child]
		}
		el.appendChild(child);
		can.inserted(children)
	}
	can.insertBefore = function(el, child, ref){
		if(child.nodeType === 11){
			var children = can.makeArray(child.childNodes);
		} else {
			var children = [child];
		}
		el.insertBefore(child, ref);
		can.inserted(children)
	}
	
});