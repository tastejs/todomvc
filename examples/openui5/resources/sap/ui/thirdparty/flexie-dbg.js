/*
File: flexie.js

About: Version
	1.0.3

Project: Flexie

Description:
	Legacy support for the CSS3 Flexible Box Model

License:
	The MIT License
	
	Copyright (c) 2010 Richard Herrera

	Permission is hereby granted, free of charge, to any person obtaining a copy
	of this software and associated documentation files (the "Software"), to deal
	in the Software without restriction, including without limitation the rights
	to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
	copies of the Software, and to permit persons to whom the Software is
	furnished to do so, subject to the following conditions:

	The above copyright notice and this permission notice shall be included in
	all copies or substantial portions of the Software.

	THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
	IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
	FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
	AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
	LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
	OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
	THE SOFTWARE.
*/

/*
Class: Flexie
	Scoped to the Flexie Global Namespace
*/

/*jslint evil: true, regexp: false, plusplus: false */
/*global window, document */

var Flexie = (function (win, doc) {
	
	// Scope public properties
	var FLX = {},
	
	    // Each Flexie-modified DOM node gets a unique identifier
	    FLX_DOM_ID = 0,
	    FLX_DOM_ATTR = "data-flexie-id",
	    FLX_PARENT_ATTR = "data-flexie-parent",
	    
	    // Store support for flexbox
	    SUPPORT,
	    
	    // Store reference to engine
	    ENGINE,
	
	    ENGINES = {
			"NW" : {
				s : "*.Dom.select"
			},
			"DOMAssistant" : {
				s : "*.$",
				m : "*.DOMReady"
			},
			"Prototype" : {
				s : "$$",
				m : "document.observe",
				p : "dom:loaded",
				c : "document"
			},
			"YAHOO" : {
				s : "*.util.Selector.query",
				m : "*.util.Event.onDOMReady",
				c : "*.util.Event"
			},
			"MooTools" : {
				s : "$$",
				m : "window.addEvent",
				p : "domready"
			},
			"Sizzle" : {
				s : "*"
			},
			"jQuery" : {
				s : "*",
				m : "*(document).ready"
			},
			"dojo" : {
				s : "*.query",
				m : "*.addOnLoad"
			}
		},
	    
	    // Store reference to library
	    LIBRARY,
	    
	    // Regular Expressions
	    PIXEL = /^-?\d+(?:px)?$/i,
	    NUMBER = /^-?\d/,
	    SIZES = /width|height|margin|padding|border/,
	    MSIE = /(msie) ([\w.]+)/,
	    WHITESPACE_CHARACTERS = /\t|\n|\r/g,
	    RESTRICTIVE_PROPERTIES = /^max\-([a-z]+)/,
	    PROTOCOL = /^https?:\/\//i,
	    LEADINGTRIM = /^\s\s*/,
	    TRAILINGTRIM = /\s\s*$/,
	    ONLY_WHITESPACE = /^\s*$/,
	    CSS_SELECTOR = /\s?(\#|\.|\[|\:(\:)?[^first\-(line|letter)|before|after]+)/g,
		
	    // String constants
	    EMPTY_STRING = "",
	    SPACE_STRING = " ",
	    PLACEHOLDER_STRING = "$1",
	    PADDING_RIGHT = "paddingRight",
	    PADDING_BOTTOM = "paddingBottom",
	    PADDING_LEFT = "paddingLeft",
	    PADDING_TOP = "paddingTop",
	    BORDER_RIGHT = "borderRightWidth",
	    BORDER_BOTTOM = "borderBottomWidth",
	    BORDER_LEFT = "borderLeftWidth",
	    BORDER_TOP = "borderTopWidth",
	    HORIZONTAL = "horizontal",
	    VERTICAL = "vertical",
	    INLINE_AXIS = "inline-axis",
	    BLOCK_AXIS = "block-axis",
	    INHERIT = "inherit",
	    LEFT = "left",
		
	    END_MUSTACHE = "}",
		
	    PREFIXES = " -o- -moz- -ms- -webkit- -khtml- ".split(SPACE_STRING),
		
	    DEFAULTS = {
			orient : HORIZONTAL,
			align : "stretch",
			direction : INHERIT,
			pack : "start"
	    },
	    
	    // Global reference objects
	    FLEX_BOXES = [],
	    POSSIBLE_FLEX_CHILDREN = [],
	    DOM_ORDERED,
	    
	    RESIZE_LISTENER,
	    
	    // Minification optimizations
	    TRUE = true,
	    FALSE = false,
	    NULL = null,
	    UNDEFINED,
	    
	    // If IE, which version?
	    BROWSER = {
			IE : (function () {
				var ie, ua = win.navigator.userAgent,
				    match = (MSIE).exec(ua.toLowerCase());
			
				if (match) {
					ie = parseInt(match[2], 10);
				}
			
				return ie;
			}())
	    },
	    
	    /*
	    selectivizr v1.0.0 - (c) Keith Clark, freely distributable under the terms 
	    of the MIT license.
        
	    selectivizr.com
	    */
	    selectivizrEngine;
	
	function trim (string) {
		if (string) {
			string = string.replace(LEADINGTRIM, EMPTY_STRING).replace(TRAILINGTRIM, EMPTY_STRING);
		}
		
		return string;
	}
	
	// --[ determineSelectorMethod() ]--------------------------------------
	// walks through the engines object testing for an suitable
	// selector engine.
	
	// Moving outside Selectivizr scope because detection is needed before running selectivizrEngine
	function determineSelectorMethod() {
		// compatible selector engines in order of CSS3 support
		var engines = ENGINES, method,
			engine, obj;
		
		for (engine in engines) {
			if (engines.hasOwnProperty(engine)) {
				obj = engines[engine];

				if (win[engine] && !method) {
					method = eval(obj.s.replace("*", engine));
					
					if (method) {
						ENGINE = engine;
						break;
					}
				}
			}
		}
		
		return method;
	}
	
	// Event handler for onload/onresize events
	function addEvent(type, func) {
		type = "on" + type;
		var oldevent = win[type];

		if (typeof win[type] !== "function") {
			win[type] = func;
		} else {
			win[type] = function () {
				if (oldevent) {
					oldevent();
				}
				func();
			};
		}
	}
	
	function attachLoadMethod(handler) {
		if (!ENGINE) {
			LIBRARY = determineSelectorMethod();
		}
		
		// compatible selector engines in order of CSS3 support
		var engines = ENGINES,
		    method, caller, args,
		    engine, obj;
		
		for (engine in engines) {
			if (engines.hasOwnProperty(engine)) {
				obj = engines[engine];

				if (win[engine] && !method && obj.m) {
					method = eval(obj.m.replace("*", engine));
					caller = obj.c ? eval(obj.c.replace("*", engine)) : win;
					args = [];
					
					if (method && caller) {
						if (obj.p) {
							args.push(obj.p);
						}
						args.push(handler);
						method.apply(caller, args);
						break;
					}
				}
			}
		}
		
		if (!method) {
			addEvent("load", handler);
		}
	}
	
	function buildSelector (node) {
		var selector = node.nodeName.toLowerCase();
		
		if (node.id) {
			selector += "#" + node.id;
		} else if (node.FLX_DOM_ID) {
			selector += "[" + FLX_DOM_ATTR + "='" + node.FLX_DOM_ID + "']";
		}
		
		return selector;
	}
	
	function setFlexieId (node) {
		if (!node.FLX_DOM_ID) {
			FLX_DOM_ID = (FLX_DOM_ID + 1);
			
			node.FLX_DOM_ID = FLX_DOM_ID;
			node.setAttribute(FLX_DOM_ATTR, node.FLX_DOM_ID);
		}
	}
	
	function buildSelectorTree(text) {
		var rules = [], ruletext, rule,
		    match, selector, proptext, splitprop, properties,
		    i, j, x;
		
		// Tabs, Returns
		text = text.replace(WHITESPACE_CHARACTERS, EMPTY_STRING);
		
		// Leading / Trailing Whitespace
		text = text.replace(/\s?(\{|\:|\})\s?/g, PLACEHOLDER_STRING);
		
		ruletext = text.split(END_MUSTACHE);

		for (i in ruletext) {
			if (ruletext.hasOwnProperty(i)) {
				text = ruletext[i];

				if (text) {
					rule = [text, END_MUSTACHE].join(EMPTY_STRING);
					
					match = (/(\@media[^\{]+\{)?(.*)\{(.*)\}/).exec(rule);
					
					if (match && match[3]) {
						selector = match[2];
						proptext = match[3].split(";");
						properties = [];
						
						for (j in proptext) {
							if (proptext.hasOwnProperty(j)) {
								x = proptext[j];
								splitprop = x.split(":");
								
								if (splitprop.length && splitprop[1]) {
									properties.push({
										property : splitprop[0],
										value : splitprop[1]
									});
								}
							}
						}
						
						if (selector && properties.length) {
							rules.push({
								selector : selector,
								properties : properties
							});
						}
					}
				}
			}
		}
		
		return rules;
	}
	
	function findFlexboxElements(rules) {
		var selectors, properties,
		    property, value, shortProp,
		    selectorSplit = /\s?,\s?/,
		    createUniqueObject, addRules, key,
		    uniqueChildren = {}, uniqueBoxes = {},
		    i, j, rule, k, l, selector, m, n, prop;
		
		createUniqueObject = function (selector, rules, prop, value) {
			var unique, i, j, rule;

			unique = {
				selector : trim(selector),
				properties : []
			};

			for (i = 0, j = rules.properties.length; i < j; i++) {
				rule = rules.properties[i];

				unique.properties.push({
					property : trim(rule.property),
					value : trim(rule.value)
				});
			}
			
			if (prop && value) {
				unique[prop] = value;
			}
			
			return unique;
		};
		
		addRules = function (selector, rules, prop, value) {
			var box = (prop && value) ? uniqueChildren[selector] : uniqueBoxes[selector],
			    exists, x, i, j, rule, k, l;
			
			if (box) {
				for (i = 0, j = rules.properties.length; i < j; i++) {
					rule = rules.properties[i];

					for (k = 0, l = box.properties.length; k < l; k++) {
						x = box.properties[k];

						if (rule.property === x.property) {
							exists = k;
							return false;
						}
					}
					
					if (exists) {
						box.properties[exists] = rule;
					} else {
						box.properties.push(rule);
					}
				}
				
				if (prop && value) {
					box[prop] = value;
				}
			} else {
				if (prop && value) {
					uniqueChildren[selector] = createUniqueObject(selector, rules, prop, value);
				} else {
					uniqueBoxes[selector] = createUniqueObject(selector, rules, NULL, NULL);
				}
			}
		};

		for (i = 0, j = rules.length; i < j; i++) {
			rule = rules[i];

			selectors = trim(rule.selector).replace(selectorSplit, ",").split(selectorSplit);

			for (k = 0, l = selectors.length; k < l; k++) {
				selector = trim(selectors[k]);
				properties = rule.properties;

				for (m = 0, n = properties.length; m < n; m++) {
					prop = properties[m];
					property = trim(prop.property);
					value = trim(prop.value);

					if (property) {
						shortProp = property.replace("box-", EMPTY_STRING);

						switch (shortProp) {
						case "display" :
							if (value === "box") {
								addRules(selector, rule, NULL, NULL);
							}
							break;

						case "orient" :
						case "align" :
						case "direction" :
						case "pack" :
							addRules(selector, rule, NULL, NULL);
							break;

						case "flex" :
						case "flex-group" :
						case "ordinal-group" :
							addRules(selector, rule, shortProp, value);
							break;
						}
					}
				}
			}
		}

		for (key in uniqueBoxes) {
			if (uniqueBoxes.hasOwnProperty(key)) {
				FLEX_BOXES.push(uniqueBoxes[key]);
			}
		}

		for (key in uniqueChildren) {
			if (uniqueChildren.hasOwnProperty(key)) {
				POSSIBLE_FLEX_CHILDREN.push(uniqueChildren[key]);
			}
		}
		
		return {
			boxes : FLEX_BOXES,
			children : POSSIBLE_FLEX_CHILDREN
		};
	}
	
	function matchFlexChildren(parent, lib, possibleChildren) {
		var caller, unique, matches = [],
			i, j, child,
			k, l, node,
			key;

		for (i = 0, j = possibleChildren.length; i < j; i++) {
			child = possibleChildren[i];

			if (child.selector) {
				caller = lib(child.selector);
				caller = caller[0] ? caller : [caller];

				if (caller[0]) {

					for (k = 0, l = caller.length; k < l; k++) {
						node = caller[k];

						if (node.nodeName !== UNDEFINED) {
							switch (node.nodeName.toLowerCase()) {
							case "script" :
							case "style" :
							case "link" :
								break;

							default :
								if (node.parentNode === parent) {
									// Flag each unique node with FLX_DOM_ID
									setFlexieId(node);

									unique = {};

									for (key in child) {
										if (child.hasOwnProperty(key)) {
											unique[key] = child[key];
										}
									}

									unique.match = node;
									matches.push(unique);
								}
								break;
							}
						}
					}
				}
			} else {
				// Flag each unique node with FLX_DOM_ID
				setFlexieId(child);
				
				matches.push({
					match : child,
					selector : buildSelector(child)
				});
			}
		}
		
		return matches;
	}
	
	function getParams(params) {
		var key;
		
		for (key in params) {
			if (params.hasOwnProperty(key)) {
				params[key] = params[key] || DEFAULTS[key];
			}
		}
		
		return params;
	}
	
	function buildFlexieCall(flexers) {
		var selector, properties, property, value, shortProp,
			display, orient, align, direction, pack,
			lib, caller, children,
			box, params, flexboxes = {},
			match, childMatch, nestedFlexboxes,
			flexieParentSelector = "[" + FLX_PARENT_ATTR + "]",
			i, j, flex, k, l, prop,
			target, key, m, n, child, o, p, existing;
		
		// No boxflex? No dice.
		if (!flexers) {
			return;
		}

		for (i = 0, j = flexers.boxes.length; i < j; i++) {
			flex = flexers.boxes[i];
			flex.selector = trim(flex.selector);
			
			selector = flex.selector;
			properties = flex.properties;
			
			display = orient = align = direction = pack = NULL;
			
			for (k = 0, l = properties.length; k < l; k++) {
				prop = properties[k];

				property = trim(prop.property);
				value = trim(prop.value);
				
				if (property) {
					shortProp = property.replace("box-", EMPTY_STRING);
					
					switch (shortProp) {
					case "display" :
						if (value === "box") {
							display = value;
						}
						break;
						
					case "orient" :
						orient = value;
						break;

					case "align" :
						align = value;
						break;

					case "direction" :
						direction = value;
						break;

					case "pack" :
						pack = value;
						break;
					}
				}
			}
			
			// Determine library
			lib = LIBRARY;
			
			// Call it.
			caller = lib(flex.selector);
			
			// In an array?
			caller = caller[0] ? caller : [caller];
			
			for (k = 0, l = caller.length; k < l; k++) {
				target = caller[k];

				// If is DOM object
				if (target.nodeType) {
					// Flag each unique node with FLX_DOM_ID
					setFlexieId(target);
					
					// Find possible child node matches
					children = matchFlexChildren(target, lib, flexers.children);
					
					// Find any nested flexbox elements
					nestedFlexboxes = selector + " " + flexieParentSelector;

					// Make sure there is some value associated with box properties
					params = {
						target : target,
						selector : selector,
						properties : properties,
						children : children,
						display : display,
						orient : orient,
						align : align,
						direction: direction,
						pack : pack,
						nested : nestedFlexboxes
					};

					match = flexboxes[target.FLX_DOM_ID];

					if (match) {
						for (key in params) {
							if (params.hasOwnProperty(key)) {
								value = params[key];

								switch (key) {
								case "selector" :
									if (value && !(new RegExp(value).test(match[key]))) {
										match[key] += ", " + value;
									}
									break;
								
								case "children" :
									for (m = 0, n = params[key].length; m < n; m++) {
										child = params[key][m];
										childMatch = FALSE;
										
										for (o = 0, p = match[key].length; o < p; o++) {
											existing = match[key][o];

											if (child.match.FLX_DOM_ID === existing.match.FLX_DOM_ID) {
												childMatch = TRUE;
											}
										}
										
										if (!childMatch) {
											match[key].push(child);
										}
									}
									break;
									
								default :
									if (value) {
										match[key] = value;
									}
									break;
								}
							}
						}
					} else {
						flexboxes[target.FLX_DOM_ID] = getParams(params);
						flexboxes[target.FLX_DOM_ID].target.setAttribute(FLX_PARENT_ATTR, TRUE);
					}
				}
			}
		}
		
		DOM_ORDERED = LIBRARY(flexieParentSelector);
		FLEX_BOXES = {};
		
		for (i = 0, j = DOM_ORDERED.length; i < j; i++) {
			target = DOM_ORDERED[i];

			FLEX_BOXES[target.FLX_DOM_ID] = flexboxes[target.FLX_DOM_ID];
		}
		
		// Loop through each match, initialize constructor
		for (key in FLEX_BOXES) {
			if (FLEX_BOXES.hasOwnProperty(key)) {
				flex = FLEX_BOXES[key];

				// One final check to ensure each flexbox has a display property
				if (flex.display === "box") {
					// Constructor
					box = new FLX.box(flex);
				}
			}
		}
	}

	// ##### BEGIN: SAP modification
	// Added to incorporate SAPUI5 FlexBox elements into regular Flexie setup
	function addFlexboxElement(params) {
		var target = params.target,
			selector = "#" + target.id,
			flexieParentSelector = "[" + FLX_PARENT_ATTR + "]";

		setFlexieId(target);

		// Find possible child node matches
		matchFlexChildren(target, LIBRARY, target.childNodes);

		// Find any nested flexbox elements
		params.nestedFlexboxes = selector + " " + flexieParentSelector;

		FLEX_BOXES[target.FLX_DOM_ID] = getParams(params);
		FLEX_BOXES[target.FLX_DOM_ID].target.setAttribute(FLX_PARENT_ATTR, TRUE);
	}
	// ##### END: SAP modification

	function calcPx(element, props, dir) {
		var dim = dir.replace(dir.charAt(0), dir.charAt(0).toUpperCase()),
		    value = element["offset" + dim] || 0,
		    i, j, prop;

		if (value) {
			for (i = 0, j = props.length; i < j; i++) {
				prop = parseFloat(element.currentStyle[props[i]]);

				if (!isNaN(prop)) {
					value -= prop;
				}
			}
		}

		return value;
	}

	function getTrueValue(element, name) {
		var left, rsLeft,
		    ret = element.currentStyle && element.currentStyle[name],
		    style = element.style;

		if (!PIXEL.test(ret) && NUMBER.test(ret)) {

			// Remember the original values
			left = style.left;
			rsLeft = element.runtimeStyle.left;

			// Put in the new values to get a computed value out
			element.runtimeStyle.left = element.currentStyle.left;
			style.left = ret || 0;
			ret = style.pixelLeft + "px";

			// Revert the changed values
			style.left = left || 0;
			element.runtimeStyle.left = rsLeft;
		}

		return ret;
	}
	
	function unAuto(element, prop, name) {
		var props;
		
		switch (name) {
		case "width" :
			props = [PADDING_LEFT, PADDING_RIGHT, BORDER_LEFT, BORDER_RIGHT];
			prop = calcPx(element, props, name);
			break;

		case "height" :
			props = [PADDING_TOP, PADDING_BOTTOM, BORDER_TOP, BORDER_BOTTOM];
			prop = calcPx(element, props, name);
			break;

		default :
			prop = getTrueValue(element, name);
			break;
		}

		return prop;
	}
	
	function getPixelValue(element, prop, name) {
		if (PIXEL.test(prop)) {
			return prop;
		}
		
		// if property is auto, do some messy appending
		if (prop === "auto" || prop === "medium") {
			prop = unAuto(element, prop, name);
		} else {
			prop = getTrueValue(element, name);
		}
		
		return prop;
	}
	
	function getComputedStyle(element, property, returnAsInt) {
		var value;
		
		if (element === UNDEFINED) {
			return;
		}
		
		if (win.getComputedStyle) {
			value = win.getComputedStyle(element, NULL)[property];
		} else {
			if (SIZES.test(property)) {
				value = getPixelValue(element, (element && element.currentStyle) ? element.currentStyle[property] : 0, property);
			} else {
				value = element.currentStyle[property];
			}
		}
		
		if (returnAsInt) {
			value = parseInt(value, 10);		
			if (isNaN(value)) {
				value = 0;
			}
		}
		
		return value;
	}
	
	function clientWidth(element) {
		return element.innerWidth || element.clientWidth;
	}
	
	function clientHeight(element) {
		return element.innerHeight || element.clientHeight;
	}
	
	function appendProperty(target, prop, value, prefixName) {
		var cssText = [],
			i, j, prefix;
		
		for (i = 0, j = PREFIXES.length; i < j; i++) {
			prefix = PREFIXES[i];
			cssText.push((prefixName ? prefix : EMPTY_STRING) + prop + ":" + (!prefixName ? prefix : EMPTY_STRING) + value);
		}

		target.style.cssText += cssText.join(";");
		return target;
	}
	
	function appendPixelValue(target, prop, value) {
		var targets = target && target[0] ? target : [target],
			i, j;
		
		for (i = 0, j = targets.length; i < j; i++) {
			target = targets[i];

			if (target && target.style) {
				target.style[prop] = (value ? (value + "px") : EMPTY_STRING);
			}
		}
	}
	
	function calculateSpecificity (selector) {
		var selectorGrid, matrix, total,
			i, j, chunk;
		
		selectorGrid = selector.replace(CSS_SELECTOR, function (e, f) {
			return "%" + f;
		}).replace(/\s|\>|\+|\~/g, "%").split(/%/g);
		
		matrix = {
			_id : 100,
			_class : 10,
			_tag : 1
		};
		
		// Start with rule index position
		total = 0;
		
		// Add each selector value to total.
		for (i = 0, j = selectorGrid.length; i < j; i++) {
			chunk = selectorGrid[i];

			if ((/#/).test(chunk)) {
				total += matrix._id;
			} else if ((/\.|\[|\:/).test(chunk)) {
				total += matrix._class;
			} else if ((/[a-zA-Z]+/).test(chunk)) {
				total += matrix._tag;
			}
		}
		
		return total;
	}
	
	function filterDuplicates (matches, children, type) {
		var filteredMatches = [], exists,
		    spec = (type ? "ordinal" : "flex") + "Specificity",
		    i, j, x, k, l, f;
		
		for (i = 0, j = matches.length; i < j; i++) {
			x = matches[i];

			if ((!type && x.flex) || (type && x["ordinal-group"])) {
				x[spec] = x[spec] || calculateSpecificity(x.selector);
				
				exists = FALSE;
			
				for (k = 0, l = filteredMatches.length; k < l; k++) {
					f = filteredMatches[k];

					if (f.match === x.match) {
						if (f[spec] < x[spec]) {
							filteredMatches[j] = x;
						}
					
						exists = TRUE;
						return FALSE;
					}
				}
			
				if (!exists) {
					filteredMatches.push(x);
				}
			}
		}
		
		return filteredMatches;
	}
	
	function createMatchMatrix(matches, children, type) {
		var groups = {}, keys = [], totalRatio = 0,
			group, order = "ordinal-group",
			BoxOrdinalAttr = "data-" + order,
			i, j, kid, k, l, x, key;
		
		// Filter dupes
		matches = filterDuplicates(matches, children, type);

		for (i = 0, j = children.length; i < j; i++) {
			kid = children[i];

			for (k = 0, l = matches.length; k < l; k++) {
				x = matches[k];

				if (type) {
					// If no value declared, it's the default.
					group = x[order] || "1";
					
					if (x.match === kid) {
						x.match.setAttribute(BoxOrdinalAttr, group);
						
						groups[group] = groups[group] || [];
						groups[group].push(x);
					}
				} else {
					// If no value declared, it's the default.
					group = x.flex || "0";
					
					if (x.match === kid && (!x[group] || (x[group] && parseInt(x[group], 10) <= 1))) {
						totalRatio += parseInt(group, 10);

						groups[group] = groups[group] || [];
						groups[group].push(x);
					}
				}
			}
			
			if (type && !kid.getAttribute(BoxOrdinalAttr)) {
				group = "1";
				kid.setAttribute(BoxOrdinalAttr, group);
				
				groups[group] = groups[group] || [];
				groups[group].push({
					match : kid
				});
			}
		}

		for (key in groups) {
			if (groups.hasOwnProperty(key)) {
				keys.push(key);
			}
		}

		keys.sort(function (a, b) {
			return b - a;
		});

		return {
			keys : keys,
			groups : groups,
			total : totalRatio
		};
	}
	
	function attachResizeListener(construct, params) {
		if (!RESIZE_LISTENER) {
			var storedWidth, storedHeight,
			    currentWidth, currentHeight,
			    docBody = doc.body,
			    docEl = doc.documentElement,
			    resizeTimer,
			    innerWidth = "innerWidth", innerHeight = "innerHeight",
			    clientWidth = "clientWidth", clientHeight = "clientHeight";
			
			addEvent("resize", function () {
				if (resizeTimer) {
					window.clearTimeout(resizeTimer);
				}

				resizeTimer = window.setTimeout(function () {
					currentWidth = win[innerWidth] || docEl[innerWidth] || docEl[clientWidth] || docBody[clientWidth];
					currentHeight = win[innerHeight] || docEl[innerHeight] || docEl[clientHeight] || docBody[clientHeight];
					
					if (storedWidth !== currentWidth || storedHeight !== currentHeight) {
						FLX.updateInstance(NULL, NULL);
						
						storedWidth = currentWidth;
						storedHeight = currentHeight;
					}
				}, 250);
			});
			
			RESIZE_LISTENER = TRUE;
		}
	}
	
	function cleanPositioningProperties (children) {
		var i, j, kid, w, h;
		
		for (i = 0, j = children.length; i < j; i++) {
			kid = children[i];

			w = kid.style.width;
			h = kid.style.height;
			
			kid.style.cssText = EMPTY_STRING;
			
			kid.style.width = w;
			kid.style.height = h;
		}
	}
	
	function sanitizeChildren (target, nodes) {
		var children = [], node, i, j;
		
		for (i = 0, j = nodes.length; i < j; i++) {
			node = nodes[i];
			
			if (node) {
				switch (node.nodeName.toLowerCase()) {
				case "script" :
				case "style" :
				case "link" :
					break;

				default :
					if (node.nodeType === 1) {
						children.push(node);
					} else if ((node.nodeType === 3) && (node.isElementContentWhitespace || (ONLY_WHITESPACE).test(node.data))) {
						target.removeChild(node);
						i--;
					}
					break;
				}
			}
		}
		
		return children;
	}
	
	function parentFlex (target) {
		var totalFlex = 0,
		    parent = target.parentNode,
		    obj,
		    matrix,
		    isNested;

		while (parent.FLX_DOM_ID) {
			obj = FLEX_BOXES[parent.FLX_DOM_ID];

			matrix = createMatchMatrix(obj.children, sanitizeChildren(parent, parent.childNodes), NULL);
			
			totalFlex += matrix.total;
			isNested = TRUE;
			
			parent = parent.parentNode;
		}
		
		return {
			nested : isNested,
			flex : totalFlex
		};
	}
	
	function dimensionValues (target, prop) {
		var parent = target.parentNode,
		    obj, dimension, i, j, rule;
		
		if (parent.FLX_DOM_ID) {
			obj = FLEX_BOXES[parent.FLX_DOM_ID];
			
			for (i = 0, j = obj.properties.length; i < j; i++) {
				rule = obj.properties[i];

				if ((new RegExp(prop)).test(rule.property)) {
					dimension = TRUE;
					return FALSE;
				}
			}
		}
		
		return dimension;
	}
	
	function updateChildValues (params) {
		var i, j, x;

		if (params.flexMatrix) {
			for (i = 0, j = params.children.length; i < j; i++) {
				x = params.children[i];
				x.flex = params.flexMatrix[i];
			}
		}
		
		if (params.ordinalMatrix) {
			for (i = 0, j = params.children.length; i < j; i++) {
				x = params.children[i];
				x["ordinal-group"] = params.ordinalMatrix[i];
			}
		}
		
		return params;
	}
	
	function ensureStructuralIntegrity (params, instance) {
		var target = params.target;
		
		if (!target.FLX_DOM_ID) {
			target.FLX_DOM_ID = target.FLX_DOM_ID || (++FLX_DOM_ID);
		}
		
		if (!params.nodes) {
			params.nodes = sanitizeChildren(target, target.childNodes);
		}
		
		if (!params.selector) {
			params.selector = buildSelector(target);
			target.setAttribute(FLX_PARENT_ATTR, TRUE);
		}
		
		if (!params.properties) {
			params.properties = [];
		}
		
		if (!params.children) {
			params.children = matchFlexChildren(target, LIBRARY, sanitizeChildren(target, target.childNodes));
		}
		
		if (!params.nested) {
			params.nested = params.selector + " [" + FLX_PARENT_ATTR + "]";
		}
		
		params.target = target;
		params._instance = instance;
		
		return params;
	}
	
	selectivizrEngine = (function () {
		var RE_COMMENT = /(\/\*[^*]*\*+([^\/][^*]*\*+)*\/)\s*?/g,
			RE_IMPORT = /@import\s*(?:(?:(?:url\(\s*(['"]?)(.*)\1)\s*\))|(?:(['"])(.*)\3))\s*([^;]*);/g,
			RE_ASSET_URL = /(behavior\s*?:\s*)?\burl\(\s*(["']?)(?!data:)([^"')]+)\2\s*\)/g,
			RE_SELECTOR_GROUP = /((?:^|(?:\s*\})+)(?:\s*@media[^\{]+\{)?)\s*([^\{]*?[\[:][^{]+)/g,
			
			// Whitespace normalization regexp's
			RE_TIDY_TRAILING_WHITESPACE = /([(\[+~])\s+/g,
			RE_TIDY_LEADING_WHITESPACE = /\s+([)\]+~])/g,
			RE_TIDY_CONSECUTIVE_WHITESPACE = /\s+/g,
			RE_TIDY_TRIM_WHITESPACE = /^\s*((?:[\S\s]*\S)?)\s*$/;

		// --[ trim() ]---------------------------------------------------------
		// removes leading, trailing whitespace from a string
		function trim(text) {
			return text.replace(RE_TIDY_TRIM_WHITESPACE, PLACEHOLDER_STRING);
		}

		// --[ normalizeWhitespace() ]------------------------------------------
		// removes leading, trailing and consecutive whitespace from a string
		function normalizeWhitespace(text) {
			return trim(text).replace(RE_TIDY_CONSECUTIVE_WHITESPACE, SPACE_STRING);
		}

		// --[ normalizeSelectorWhitespace() ]----------------------------------
		// tidys whitespace around selector brackets and combinators
		function normalizeSelectorWhitespace(selectorText) {
			return normalizeWhitespace(selectorText.replace(RE_TIDY_TRAILING_WHITESPACE, PLACEHOLDER_STRING).replace(RE_TIDY_LEADING_WHITESPACE, PLACEHOLDER_STRING));
		}

		// --[ patchStyleSheet() ]----------------------------------------------
		// Scans the passed cssText for selectors that require emulation and
		// creates one or more patches for each matched selector.
		function patchStyleSheet(cssText) {
			return cssText.replace(RE_SELECTOR_GROUP, function (m, prefix, selectorText) {
				var selectorGroups, selector,
					i, j, group;
				
				selectorGroups = selectorText.split(",");
				
				for (i = 0, j = selectorGroups.length; i < j; i++) {
					group = selectorGroups[i];
					selector = normalizeSelectorWhitespace(group) + SPACE_STRING;
				}
				
				return prefix + selectorGroups.join(",");
			});
		}
		
		// --[ getXHRObject() ]-------------------------------------------------
		function getXHRObject() {
			if (win.XMLHttpRequest) {
				return new win.XMLHttpRequest();
			}
			
			try	{ 
				return new win.ActiveXObject("Microsoft.XMLHTTP");
			} catch (e) { 
				return NULL;
			}
		}

		function parseInlineStyles ( text ) {
			var reg = /<style[^<>]*>([^<>]*)<\/style[\s]?>/img,
				match = reg.exec(text),
				stylesheets = [],
				rawCSSText;

			while (match) {
				rawCSSText = match[1];

				if (rawCSSText) {
					stylesheets.push(rawCSSText);
				}

				match = reg.exec(text);
			}

			return stylesheets.join("\n\n");
		}
		
		// --[ loadStyleSheet() ]-----------------------------------------------
		function loadStyleSheet(url) {
			var xhr = getXHRObject(),
				responseText;
			
			xhr.open("GET", url, FALSE);
			xhr.send();

			responseText = (xhr.status === 200) ? xhr.responseText : EMPTY_STRING;

			if (url === window.location.href) {
				responseText = parseInlineStyles(responseText);
			}

			return responseText;
		}
		
		// --[ resolveUrl() ]---------------------------------------------------
		// Converts a URL fragment to a fully qualified URL using the specified
		// context URL. Returns null if same-origin policy is broken
		function resolveUrl(url, contextUrl) {
			
			// IE9 returns a false positive sometimes(?)
			if (!url) {
				return;
			}
			
			function getProtocolAndHost(url) {
				return url.substring(0, url.indexOf("/", 8));
			}

			// absolute path
			if (PROTOCOL.test(url)) {
				return getProtocolAndHost(contextUrl) === getProtocolAndHost(url) ? url : NULL;
			}

			// root-relative path
			if (url.charAt(0) === "/")	{
				return getProtocolAndHost(contextUrl) + url;
			}

			// relative path
			var contextUrlPath = contextUrl.split("?")[0]; // ignore query string in the contextUrl
			if (url.charAt(0) !== "?" && contextUrlPath.charAt(contextUrlPath.length - 1) !== "/") {
				contextUrlPath = contextUrlPath.substring(0, contextUrlPath.lastIndexOf("/") + 1);
			}

			return contextUrlPath + url;
		}
		
		// --[ parseStyleSheet() ]----------------------------------------------
		// Downloads the stylesheet specified by the URL, removes it's comments
		// and recursivly replaces @import rules with their contents, ultimately
		// returning the full cssText.
		function parseStyleSheet( url ) {
			if (url) {
				return loadStyleSheet(url).replace(RE_COMMENT, EMPTY_STRING).
				replace(RE_IMPORT, function( match, quoteChar, importUrl, quoteChar2, importUrl2, media ) {
					var cssText = parseStyleSheet(resolveUrl(importUrl || importUrl2, url));
					return (media) ? "@media " + media + " {" + cssText + "}" : cssText;
				}).
				replace(RE_ASSET_URL, function( match, isBehavior, quoteChar, assetUrl ) { 
					quoteChar = quoteChar || EMPTY_STRING;
					return isBehavior ? match : " url(" + quoteChar + resolveUrl(assetUrl, url, true) + quoteChar + ") "; 
				});
			}
			return EMPTY_STRING;
		}
		
		// --[ init() ]---------------------------------------------------------
		return function () {
			// honour the <base> tag
			var url, stylesheets = [], stylesheet, i, j,
			    baseTags = doc.getElementsByTagName("BASE"),
			    baseUrl = (baseTags.length > 0) ? baseTags[0].href : doc.location.href,
			    externalStyles = doc.styleSheets,
			    cssText, tree, flexers;
			
			for (i = 0, j = externalStyles.length; i < j; i++) {
				stylesheet = externalStyles[i];

				if (stylesheet != NULL) {
					stylesheets.push(stylesheet);
				}
			}

			// Add self to test for inline styles
			stylesheets.push(window.location);

			for (i = 0, j = stylesheets.length; i < j; i++) {
				stylesheet = stylesheets[i];

				if (stylesheet) {
					url = resolveUrl(stylesheet.href, baseUrl);

					if (url) {
						cssText = patchStyleSheet(parseStyleSheet(url));
					}

					if (cssText) {
						tree = buildSelectorTree(cssText);
						flexers = findFlexboxElements(tree);
					}
				}
			}
			
			buildFlexieCall(flexers);
		};
	}());
	
	// Flexie box constructor
	FLX.box = function (params) {
		return this.renderModel(params);
	};
	
	FLX.box.prototype = {
		properties : {
			boxModel : function (target, children, params) {
				var selectors, stylesheet, paddingFix, generatedRules,
					i, j, selector;

				target.style.display = "block";
				
				if (BROWSER.IE === 8) {
					target.style.overflow = "hidden";
				}

				// We'll be using floats, so the easiest way to retain layout
				// is the dreaded clear fix:
				if (!params.cleared) {
					selectors = params.selector.split(/\s?,\s?/);
					stylesheet = doc.styleSheets;
					stylesheet = stylesheet[stylesheet.length - 1];
					paddingFix = "padding-top:" + (getComputedStyle(target, PADDING_TOP, NULL) || "0.1px;");
				
					generatedRules = [
						"content: '.'",
						"display: block",
						"height: 0",
						"overflow: hidden"
					].join(";");
				
					for (i = 0, j = selectors.length; i < j; i++) {
						selector = selectors[i];

						if (stylesheet.addRule) {
							if (BROWSER.IE < 8) {
								target.style.zoom = "1";

								if (BROWSER.IE === 6) {
									stylesheet.addRule(selector.replace(/\>|\+|\~/g, ""), paddingFix + "zoom:1;", 0);
								} else if (BROWSER.IE === 7) {
									stylesheet.addRule(selector, paddingFix + "display:inline-block;", 0);
								}
							} else {
								stylesheet.addRule(selector, paddingFix, 0);
								stylesheet.addRule(selector + ":before", generatedRules, 0);
								stylesheet.addRule(selector + ":after", generatedRules + ";clear:both;", 0);
							}
						} else if (stylesheet.insertRule) {
							stylesheet.insertRule(selector + "{" + paddingFix + "}", 0);
							stylesheet.insertRule(selector + ":after{" + generatedRules + ";clear:both;}", 0);
						}
					}
					
					params.cleared = TRUE;
				}
			},
			
			boxDirection : function (target, children, params) {
				var nestedSelector, nested,
					i, j, kid, node;
				
				if ((params.direction === "reverse" && !params.reversed) || (params.direction === "normal" && params.reversed)) {
					children = children.reverse();

					for (i = 0, j = children.length; i < j; i++) {
						kid = children[i];
						target.appendChild(kid);
					}
					
					// box-direction is inheritable.
					// We need to see if there are any nested flexbox elements
					nestedSelector = LIBRARY(params.nested);
					
					for (i = 0, j = nestedSelector.length; i < j; i++) {
						node = nestedSelector[i];

						nested = FLEX_BOXES[node.FLX_DOM_ID];
						
						if (nested && nested.direction === INHERIT) {
							nested.direction = params.direction;
						}
					}

					params.reversed = !params.reversed;
				}
			},
			
			boxOrient : function (target, children, params) {
				var self = this, wide, high,
					i, j, kid;

				wide = {
					pos : "marginLeft",
					opp : "marginRight",
					dim : "width",
					out : "offsetWidth",
					main : "width",		// added for calls to getComputedStyle
					func : clientWidth,
					pad : [PADDING_LEFT, PADDING_RIGHT, BORDER_LEFT, BORDER_RIGHT]
				};

				high = {
					pos : "marginTop",
					opp : "marginBottom",
					dim : "height",		// added for calls to getComputedStyle
					out : "offsetHeight",
					main : "height",
					func : clientHeight,
					pad : [PADDING_TOP, PADDING_BOTTOM, BORDER_TOP, BORDER_BOTTOM]
				};

				if (!SUPPORT) {
					for (i = 0, j = children.length; i < j; i++) {
						kid = children[i];

						kid.style[(BROWSER.IE >= 9) ? "cssFloat" : "styleFloat"] = LEFT;

						if (params.orient === VERTICAL || params.orient === BLOCK_AXIS) {
							kid.style.clear = LEFT;
						}
						
						if (BROWSER.IE === 6) {
							kid.style.display = "inline";
						}
					}
				}

				switch (params.orient) {
				case VERTICAL :
				case BLOCK_AXIS:
					self.props = high;
					self.anti = wide;
					break;
				
				default :
					self.props = wide;
					self.anti = high;
					break;
				}
			},
			
			boxOrdinalGroup : function (target, children, params) {
				var organizeChildren,
				    matrix;

				if (!children.length) {
					return;
				}
				
				organizeChildren = function (matrix) {
					var keys = matrix.keys,
						iterator = params.reversed ? keys : keys.reverse(),
						i, j, key, k, l, kid;

					for (i = 0, j = iterator.length; i < j; i++) {
						key = iterator[i];

						for (k = 0, l = children.length; k < l; k++) {
							kid = children[k];

							if (key === kid.getAttribute("data-ordinal-group")) {
								target.appendChild(kid);
							}
						}
					}
				};

				matrix = createMatchMatrix(params.children, children, TRUE);

				if (matrix.keys.length > 1) {
					organizeChildren(matrix);
				}
			},
			
			boxFlex : function (target, children, params) {
				var self = this,
				    testForRestrictiveProperties,
				    findTotalWhitespace,
				    distributeRatio,
				    matrix,
				    restrict,
				    whitespace,
				    distro;

				if (!children.length) {
					return;
				}
				testForRestrictiveProperties = function (matrix) {
					var flexers = matrix.groups,
					    keys = matrix.keys,
					    max, i, j, key,
					    k, l, x, m, n, rule;
					
					for (i = 0, j = keys.length; i < j; i++) {
						key = keys[i];

						for (k = 0, l = flexers[key].length; k < l; k++) {
							x = flexers[key][k];
							max = NULL;

							if(x.properties !== undefined && x.properties.length !== undefined) {	// check added to avoid errors
								for (m = 0, n = x.properties.length; m < n; m++) {
									rule = x.properties[m];
									if ((RESTRICTIVE_PROPERTIES).test(rule.property)) {
										max = parseFloat(rule.value);
									}
								}
							}

							if (!max || x.match[self.props.out] > max) {
								appendPixelValue(x.match, self.props.pos, NULL);
							}
							
						}
					}
				};

				findTotalWhitespace = function (matrix) {
					var groupDimension = 0,
					    whitespace,
					    ration,
					    i, j, kid,
					    k, l, pad;
					for (i = 0, j = children.length; i < j; i++) {
						kid = children[i];
						groupDimension += getComputedStyle(kid, self.props.dim, TRUE);

						for (k = 0, l = self.props.pad.length; k < l; k++) {
							pad = self.props.pad[k];

							groupDimension += getComputedStyle(kid, pad, TRUE);
						}
						groupDimension += getComputedStyle(kid, self.props.pos, TRUE);
						groupDimension += getComputedStyle(kid, self.props.opp, TRUE);
					}

					// changed to get whitespace based on getComputedStyle to avoid errors
					// introduced by offsetWidth/Height rounding up
					// getComputedStyle does not include padding, so removed the correction loop

					whitespace = Math.floor(parseFloat(window.getComputedStyle(target,null)[self.props.main])) - groupDimension;
					ration = (whitespace / matrix.total);
					return {
						whitespace : whitespace,
						ration : ration
					};
				};

				distributeRatio = function (matrix, whitespace) {
					var flexers = matrix.groups,
					    keys = matrix.keys,
					    flex, specificity,
					    ration = whitespace.ration,
					    widthRation, trueDim, newDimension,
					    i, j, key, k, l, x;

					for (i = 0, j = keys.length; i < j; i++) {
						key = keys[i];
						widthRation = (ration * key);

						var attributedWhitespace = 0;
						for (k = 0, l = flexers[key].length; k < l; k++) {
							x = flexers[key][k];

							if (x.match) {
								flex = x.match.getAttribute("data-flex");
								specificity = x.match.getAttribute("data-specificity");

								if (!flex || (specificity <= x.flexSpecificity)) {
									x.match.setAttribute("data-flex", key);
									x.match.setAttribute("data-specificity", x.flexSpecificity);
									
									trueDim = getComputedStyle(x.match, self.props.dim, TRUE);
									newDimension = Math.max(0, (trueDim + widthRation));

									attributedWhitespace += widthRation;
									// Make sure the last item doesn't overflow the available space
									if(k == l-1) newDimension--;
									
									appendPixelValue(x.match, self.props.dim, newDimension);
								}
							}
						}
					}
				};

				matrix = createMatchMatrix(params.children, children, NULL);

				if (matrix.total) {
					params.hasFlex = TRUE;
					
					restrict = testForRestrictiveProperties(matrix);
					whitespace = findTotalWhitespace(matrix);
				
					// Distribute the calculated ratios among the children
					distro = distributeRatio(matrix, whitespace);
				}
			},
			
			boxAlign : function (target, children, params) {
				var self = this,
				    targetDimension,
				    kidDimension,
				    flexCheck = parentFlex(target),
				    i, j, pad, k, l, kid;

				if (!SUPPORT && !flexCheck.flex && (params.orient === VERTICAL || params.orient === BLOCK_AXIS)) {
					if (!dimensionValues(target, self.anti.dim)) {
						appendPixelValue(target, self.anti.dim, NULL);
					}
					appendPixelValue(children, self.anti.dim, NULL);
				}
				
				// Remove padding / border from target dimension
				targetDimension = target[self.anti.out];

				for (i = 0, j = self.anti.pad.length; i < j; i++) {
					pad = self.anti.pad[i];
					targetDimension -= getComputedStyle(target, pad, TRUE);
				}

				switch (params.align) {
				case "start" :
					break;
				
				case "end" :
					for (i = 0, j = children.length; i < j; i++) {
						kid = children[i];

						kidDimension = targetDimension - kid[self.anti.out];
						kidDimension -= getComputedStyle(kid, self.anti.opp, TRUE);
						appendPixelValue(kid, self.anti.pos, kidDimension);
					}
					break;

				case "center" :
					for (i = 0, j = children.length; i < j; i++) {
						kid = children[i];

						kidDimension = (targetDimension - kid[self.anti.out]) / 2;
						appendPixelValue(kid, self.anti.pos, kidDimension);
					}
					break;
				
				default :
					for (i = 0, j = children.length; i < j; i++) {
						kid = children[i];

						switch (kid.nodeName.toLowerCase()) {
						case "button" :
						case "input" :
						case "select" :
							break;

						default :
							var subtract = 0;

							for (k = 0, l = self.anti.pad.length; k < l; k++) {
								pad = self.anti.pad[k];

								subtract += getComputedStyle(kid, pad, TRUE);
								subtract += getComputedStyle(target, pad, TRUE);
							}

							kid.style[self.anti.dim] = "100%";
							kidDimension = kid[self.anti.out] - subtract;
							appendPixelValue(kid, self.anti.dim, NULL);

							kidDimension = targetDimension;
							kidDimension -= getComputedStyle(kid, self.anti.pos, TRUE);

							for (k = 0, l = self.anti.pad.length; k < l; k++) {
								pad = self.anti.pad[k];

								kidDimension -= getComputedStyle(kid, pad, TRUE);
							}

							kidDimension -= getComputedStyle(kid, self.anti.opp, TRUE);
							kidDimension = Math.max(0, kidDimension);
							
							appendPixelValue(kid, self.anti.dim, kidDimension);
							break;
						}
					}
					break;
				}
			},
			
			boxPack : function (target, children, params) {
				var self = this,
				    groupDimension = 0,
				    firstComputedMargin = 0,
				    targetPadding = 0,
				    totalDimension,
				    fractionedDimension,
				    currentDimension,
				    remainder,
				    length = children.length - 1,
				    kid, i, j, value, pad;

				for (i = 0, j = children.length; i < j; i++) {
					kid = children[i];
					groupDimension += kid[self.props.out];
					groupDimension += getComputedStyle(kid, self.props.pos, TRUE);
					groupDimension += getComputedStyle(kid, self.props.opp, TRUE);
				}
				firstComputedMargin = getComputedStyle(children[0], self.props.pos, TRUE);
				// changed to get totalDimension based on getComputedStyle to avoid errors
				// introduced by offsetWidth/Height rounding up
				// getComputedStyle does not include padding, so removed the correction loop
				totalDimension = Math.floor(parseFloat(window.getComputedStyle(target,null)[self.props.main])) - groupDimension;
				
				// If totalDimension is less than 0, we have a problem...
				if (totalDimension < 0) {
					totalDimension = 0;	// removed Math.max because it's much slower
				}

				switch (params.pack) {
				case "end" :
					appendPixelValue(children[0], self.props.pos, targetPadding + firstComputedMargin + totalDimension);
					break;

				case "center" :
					// TODO targetPadding is always 0???
					// Shouldn't it be padding/border on start side? Not just half the padding?
					if (targetPadding) {
						targetPadding /= 2;
					}

					appendPixelValue(children[0], self.props.pos, targetPadding + firstComputedMargin + (totalDimension / 2)); // removed Math.floor because it's already in the calculation above
					break;

				case "justify" :
					fractionedDimension = Math.floor((targetPadding + totalDimension) / length);
					remainder = (fractionedDimension * length) - totalDimension;
					
					i = children.length - 1;
					
					while (i) {
						kid = children[i];
						currentDimension = fractionedDimension;

						if (remainder) {
							currentDimension++;
							remainder++;
						}
						
						value = getComputedStyle(kid, self.props.pos, TRUE) + currentDimension - 1;		// make sure the value doesn't overflow the available space
						appendPixelValue(kid, self.props.pos, value);
						
						i--;
					}
					
					break;
				}
				
				target.style.overflow = "";
			}
		},

		setup : function (target, children, params) {
			var self = this, matrix, flexCheck,
				key, func;
			
			if (!target || !children || !params) {
				return;
			}

			if (SUPPORT && SUPPORT.partialSupport) {
				matrix = createMatchMatrix(params.children, children, NULL);
				flexCheck = parentFlex(target);
				children = sanitizeChildren(target, target.childNodes);
				
				self.properties.boxOrient.call(self, target, children, params);
				
				if (!matrix.total || !LIBRARY(params.nested).length) {
					if ((params.align === "stretch") && !SUPPORT.boxAlignStretch && (!flexCheck.nested || !flexCheck.flex)) {
						self.properties.boxAlign.call(self, target, children, params);
					}

					if ((params.pack === "justify") && !SUPPORT.boxPackJustify && !matrix.total) {
						self.properties.boxPack.call(self, target, children, params);
					}
				}
			} else if (!SUPPORT) {
				for (key in self.properties) {
					if (self.properties.hasOwnProperty(key)) {
						func = self.properties[key];
						func.call(self, target, sanitizeChildren(target, target.childNodes), params);
					}
				}
			}
		},

		trackDOM : function (params) {
			attachResizeListener(this, params);
		},

		updateModel : function (params) {
			var self = this,
			    target = params.target,
			    children = params.nodes;
			
			// Null properties
			cleanPositioningProperties(children);
			
			if (params.flexMatrix || params.ordinalMatrix) {
				params = updateChildValues(params);
			}

			self.setup(target, children, params);
			self.bubbleUp(target, params);
		},

		renderModel : function (params) {
			var self = this,
			    target = params.target,
			    nodes = target.childNodes;

			// Sanity check.
			if (!target.length && !nodes) {
				return false;
			}

			params = ensureStructuralIntegrity(params, this);
			
			// Setup properties
			self.updateModel(params);
			
			// Add dynamically created elements to the FLEX_BOXES object
			if(params.dynamic) {
				addFlexboxElement(params);
			}

			// Resize / DOM Polling Events
			// Delay for an instant because IE6 is insane.
			win.setTimeout(function () {
				self.trackDOM(params);
			}, 0);

			return self;
		},
		
		bubbleUp : function (target, params) {
			var self = this, flex,
			    parent = params.target.parentNode;
			
			while (parent) {
				flex = FLEX_BOXES[parent.FLX_DOM_ID];
				
				if (flex) {
					cleanPositioningProperties(flex.nodes);
					self.setup(flex.target, flex.nodes, flex);
				}
				
				parent = parent.parentNode;
			}
		}
	};
	
	FLX.updateInstance = function (target, params) {
		var box, key;

		if (target) {
			box = FLEX_BOXES[target.FLX_DOM_ID];
			
			if (box && box._instance) {
				box._instance.updateModel(box);
			} else if (!box) {
				box = new FLX.box(params);
			}
		} else {
			for (key in FLEX_BOXES) {
				if (FLEX_BOXES.hasOwnProperty(key)) {
					box = FLEX_BOXES[key];

					if (box && box._instance) {
						box._instance.updateModel(box);
					}
				}
			}
		}
	};
	
	FLX.getInstance = function (target) {
		return FLEX_BOXES[target.FLX_DOM_ID];
	};
	
	FLX.destroyInstance = function (target) {
		var box, destroy, i, j, x, key;
		
		destroy = function (box) {
			box.target.FLX_DOM_ID = NULL;
			box.target.style.cssText = EMPTY_STRING;
			
			for (i = 0, j = box.children.length; i < j; i++) {
				x = box.children[i];
				x.match.style.cssText = EMPTY_STRING;
			}
		};
		
		if (target) {
			box = FLEX_BOXES[target.FLX_DOM_ID];
			
			if (box) {
				destroy(box);
			}
		} else {
			for (key in FLEX_BOXES) {
				if (FLEX_BOXES.hasOwnProperty(key)) {
					destroy(FLEX_BOXES[key]);
				}
			}
			
			FLEX_BOXES = [];
		}
	};

	FLX.flexboxSupport = function () {
		var partialSupportGrid = {},
		    height = 100,
		    childHeight,
		    dummy = doc.createElement("flxbox"),
		    child = '<b style="margin: 0; padding: 0; display:block; width: 10px; height:' + (height / 2) + 'px"></b>',
		    tests, result, key, value;

		dummy.style.width = dummy.style.height = height + "px";
		dummy.innerHTML = (child + child + child);

		appendProperty(dummy, "display", "box", NULL);
		appendProperty(dummy, "box-align", "stretch", TRUE);
		appendProperty(dummy, "box-pack", "justify", TRUE);

		doc.body.appendChild(dummy);
		childHeight = dummy.firstChild.offsetHeight;
		
		tests = {
			boxAlignStretch : function () {
				return (childHeight === 100);
			},
			
			boxPackJustify : function () {
				var totalOffset = 0,
					i, j;
				
				for (i = 0, j = dummy.childNodes.length; i < j; i++) {
					totalOffset += dummy.childNodes[i].offsetLeft;
				}
				
				return (totalOffset === 135);
			}
		};
		
		for (key in tests) {
			if (tests.hasOwnProperty(key)) {
				value = tests[key];

				result = value();
				
				if (!result) {
					partialSupportGrid.partialSupport = TRUE;
				}
				
				partialSupportGrid[key] = result;
			}
		}
		
		doc.body.removeChild(dummy);
		return ~ (dummy.style.display).indexOf("box") ? partialSupportGrid : FALSE;
	};
	
	FLX.init = function () {
		FLX.flexboxSupported = SUPPORT = FLX.flexboxSupport();

		if ((!SUPPORT || SUPPORT.partialSupport) && LIBRARY) {
			selectivizrEngine();
		}
	};
	
	// Flexie Version
	FLX.version = "1.0.3";

	// Load when the DOM is ready
	//attachLoadMethod(FLX.init);
	
	return FLX;
}(this, document));