/*!
 * CanJS - 2.0.3
 * http://canjs.us/
 * Copyright (c) 2013 Bitovi
 * Tue, 26 Nov 2013 18:21:22 GMT
 * Licensed MIT
 * Includes: CanJS default build
 * Download from: http://canjs.us/
 */
define(function(){
	/**
	 * @typedef {{}} can/view/elements.js
	 * 
	 * Provides helper methods for and information about the behavior
	 * of DOM elements.
	 */
	var elements = {
		tagToContentPropMap: {
			option: "textContent" in document.createElement("option") ? "textContent" : "innerText",
			textarea: "value"
		},
		/**
		 * @property {Object.<String,(String|Boolean)>} attrMap a mapping of
		 * special attributes to their JS property. For example:
		 * 
		 *     "class" : "className"
		 * 
		 * means call element.className. And: 
		 * 
		 *      "checked" : true
		 * 
		 * means call `element.checked = true`
		 *     
		 */
		attrMap: {
			"class" : "className",
			"value": "value",
			"innerText" : "innerText",
			"textContent" : "textContent",
			"checked": true,
			"disabled": true,
			"readonly": true,
			"required": true,
			src: function(el, val){
				if(val == null || val == ""){
					el.removeAttribute("src")
				} else {
					el.setAttribute("src",val)
				}
			}
		},
		// matches the attrName of a regexp
		attrReg: /([^\s]+)[\s]*=[\s]*/,
		// elements whos default value we should set
		defaultValue : ["input","textarea"],
		// a map of parent element to child elements
		tagMap : {
			"": "span", 
			table: "tbody", 
			tr: "td",
			ol: "li", 
			ul: "li", 
			tbody: "tr",
			thead: "tr",
			tfoot: "tr",
			select: "option",
			optgroup: "option"
		},
		// a tag's parent element
		reverseTagMap: {
			tr:"tbody",
			option:"select",
			td:"tr",
			th:"tr",
			li: "ul"
		},
		
		getParentNode: function(el, defaultParentNode){
			return defaultParentNode && el.parentNode.nodeType === 11 ? defaultParentNode : el.parentNode;
		},
		// set an attribute on an element
		setAttr: function (el, attrName, val) {
			var tagName = el.nodeName.toString().toLowerCase(),
				prop = elements.attrMap[attrName];
			// if this is a special property
			if(typeof prop === "function"){
				prop(el, val)
			} else if(prop === true) {
				el[attrName]  = true;
			} else if (prop) {
				// set the value as true / false
				el[prop] = val;
				if( prop === "value" && can.inArray(tagName, elements.defaultValue) >= 0 ) {
					el.defaultValue = val;
				}
			} else {
				el.setAttribute(attrName, val);
			}
		},
		// gets the value of an attribute
		getAttr: function(el, attrName){
			// Default to a blank string for IE7/8
			return (elements.attrMap[attrName] && el[elements.attrMap[attrName]] ?
				el[elements.attrMap[attrName]]:
				el.getAttribute(attrName)) || '';
		},
		// removes the attribute
		removeAttr: function(el, attrName){
			var setter = elements.attrMap[attrName];
			if(typeof prop === "function"){
				prop(el, undefined)
			} if( setter === true ) {
				el[attrName] = false;
			} else if(typeof setter === "string"){
				el[setter] = "";
			} else {
				el.removeAttribute(attrName);
			}
		},
		contentText: function(text){
			if ( typeof text == 'string' ) {
				return text;
			}
			// If has no value, return an empty string.
			if ( !text && text !== 0 ) {
				return '';
			}
			return "" + text;
		}
	};
	
	// feature detect if setAttribute works with styles
	(function(){
		// feature detect if 
		var div = document.createElement('div')
		div.setAttribute("style","width: 5px")
		div.setAttribute("style","width: 10px");
		// make style use cssText
		elements.attrMap.style = function(el, val){
			el.style.cssText = val || ""
		}
	})();
	
	
	return elements;
});