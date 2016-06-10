/*!
 * CanJS - 2.0.7
 * http://canjs.us/
 * Copyright (c) 2014 Bitovi
 * Wed, 26 Mar 2014 16:12:27 GMT
 * Licensed MIT
 * Includes: CanJS default build
 * Download from: http://canjs.us/
 */
define(["can/util/library", "can/view/elements", "can/view", "can/view/node_lists"], function (can, elements, view, nodeLists) {
	// ## live.js
	//
	// The live module provides live binding for computes
	// and can.List.
	//
	// Currently, it's API is designed for `can/view/render`, but
	// it could easily be used for other purposes.
	// ### Helper methods
	//
	// #### setup
	//
	// `setup(HTMLElement, bind(data), unbind(data)) -> data`
	//
	// Calls bind right away, but will call unbind
	// if the element is "destroyed" (removed from the DOM).
	var setup = function (el, bind, unbind) {
		// Removing an element can call teardown which
		// unregister the nodeList which calls teardown
		var tornDown = false,
			teardown = function () {
				if (!tornDown) {
					tornDown = true;
					unbind(data);
					can.unbind.call(el, 'removed', teardown);
				}
				return true;
			}, data = {
				teardownCheck: function (parent) {
					return parent ? false : teardown();
				}
			};
		can.bind.call(el, 'removed', teardown);
		bind(data);
		return data;
	},
		// #### listen
		// Calls setup, but presets bind and unbind to
		// operate on a compute
		listen = function (el, compute, change) {
			return setup(el, function () {
				compute.bind('change', change);
			}, function (data) {
				compute.unbind('change', change);
				if (data.nodeList) {
					nodeLists.unregister(data.nodeList);
				}
			});
		},
		// #### getAttributeParts
		// Breaks up a string like foo='bar' into ["foo","'bar'""]
		getAttributeParts = function (newVal) {
			return (newVal || '')
				.replace(/['"]/g, '')
				.split('=');
		}, splice = [].splice;
	/**
	 * @property {Object} can.view.live
	 * @parent can.view.static
	 *
	 * Setup live-binding to a compute manually.
	 *
	 * @body
	 *
	 * ## Use
	 *
	 * `can.view.live` is an object with utlitiy methods for setting up
	 * live-binding.  For example, to make an `<h2>`
	 *
	 *
	 *
	 */
	var live = {
		list: function (el, compute, render, context, parentNode) {
			// A nodeList of all elements this live-list manages.
			// This is here so that if this live list is within another section
			// that section is able to remove the items in this list.
			var masterNodeList = [el],
				// A mapping of the index of an item to an array
				// of elements that represent the item.
				// Each array is registered so child or parent
				// live structures can update the elements.
				itemIndexToNodeListsMap = [],
				// A mapping of items to their indicies'
				indexMap = [],
				// Called when items are added to the list.
				add = function (ev, items, index) {
					// Collect new html and mappings
					var frag = document.createDocumentFragment(),
						newNodeLists = [],
						newIndicies = [];
					// For each new item,
					can.each(items, function (item, key) {
						var itemIndex = can.compute(key + index),
							// get its string content
							itemHTML = render.call(context, item, itemIndex),
							// and convert it into elements.
							itemFrag = can.view.fragment(itemHTML);
						// Add those elements to the mappings.
						newNodeLists.push(nodeLists.register(can.makeArray(itemFrag.childNodes), undefined, masterNodeList));
						// Hookup the fragment (which sets up child live-bindings) and
						// add it to the collection of all added elements.
						frag.appendChild(can.view.hookup(itemFrag));
						newIndicies.push(itemIndex);
					});
					// Check if we are adding items at the end
					if (!itemIndexToNodeListsMap[index]) {
						elements.after(index === 0 ? [text] : itemIndexToNodeListsMap[index - 1], frag);
					} else {
						// Add elements before the next index's first element.
						var el = itemIndexToNodeListsMap[index][0];
						can.insertBefore(el.parentNode, frag, el);
					}
					splice.apply(itemIndexToNodeListsMap, [
						index,
						0
					].concat(newNodeLists));
					// update indices after insert point
					splice.apply(indexMap, [
						index,
						0
					].concat(newIndicies));
					for (var i = index + newIndicies.length, len = indexMap.length; i < len; i++) {
						indexMap[i](i);
					}
				},
				// Called when items are removed or when the bindings are torn down.
				remove = function (ev, items, index, duringTeardown) {
					// If this is because an element was removed, we should
					// check to make sure the live elements are still in the page.
					// If we did this during a teardown, it would cause an infinite loop.
					if (!duringTeardown && data.teardownCheck(text.parentNode)) {
						return;
					}
					var removedMappings = itemIndexToNodeListsMap.splice(index, items.length),
						itemsToRemove = [];
					can.each(removedMappings, function (nodeList) {
						// add items that we will remove all at once
						[].push.apply(itemsToRemove, nodeList);
						// Update any parent lists to remove these items
						nodeLists.update(nodeList, []);
						// unregister the list
						nodeLists.unregister(nodeList);
					});
					// update indices after remove point
					indexMap.splice(index, items.length);
					for (var i = index, len = indexMap.length; i < len; i++) {
						indexMap[i](i);
					}
					can.remove(can.$(itemsToRemove));
				}, text = document.createTextNode(''),
				// The current list.
				list,
				// Called when the list is replaced with a new list or the binding is torn-down.
				teardownList = function () {
					// there might be no list right away, and the list might be a plain
					// array
					if (list && list.unbind) {
						list.unbind('add', add)
							.unbind('remove', remove);
					}
					// use remove to clean stuff up for us
					remove({}, {
						length: itemIndexToNodeListsMap.length
					}, 0, true);
				},
				// Called when the list is replaced or setup.
				updateList = function (ev, newList, oldList) {
					teardownList();
					// make an empty list if the compute returns null or undefined
					list = newList || [];
					// list might be a plain array
					if (list.bind) {
						list.bind('add', add)
							.bind('remove', remove);
					}
					add({}, list, 0);
				};
			parentNode = elements.getParentNode(el, parentNode);
			// Setup binding and teardown to add and remove events
			var data = setup(parentNode, function () {
				if (can.isFunction(compute)) {
					compute.bind('change', updateList);
				}
			}, function () {
				if (can.isFunction(compute)) {
					compute.unbind('change', updateList);
				}
				teardownList();
			});
			live.replace(masterNodeList, text, data.teardownCheck);
			// run the list setup
			updateList({}, can.isFunction(compute) ? compute() : compute);
		},
		html: function (el, compute, parentNode) {
			var data;
			parentNode = elements.getParentNode(el, parentNode);
			data = listen(parentNode, compute, function (ev, newVal, oldVal) {
				// TODO: remove teardownCheck in 2.1
				var attached = nodes[0].parentNode;
				// update the nodes in the DOM with the new rendered value
				if (attached) {
					makeAndPut(newVal);
				}
				data.teardownCheck(nodes[0].parentNode);
			});
			var nodes = [el],
				makeAndPut = function (val) {
					var frag = can.view.fragment('' + val),
						oldNodes = can.makeArray(nodes);
					// We need to mark each node as belonging to the node list.
					nodeLists.update(nodes, frag.childNodes);
					frag = can.view.hookup(frag, parentNode);
					elements.replace(oldNodes, frag);
				};
			data.nodeList = nodes;
			// register the span so nodeLists knows the parentNodeList
			nodeLists.register(nodes, data.teardownCheck);
			makeAndPut(compute());
		},
		replace: function (nodes, val, teardown) {
			var oldNodes = nodes.slice(0),
				frag;
			nodeLists.register(nodes, teardown);
			if (typeof val === 'string') {
				frag = can.view.fragment(val);
			} else if (val.nodeType !== 11) {
				frag = document.createDocumentFragment();
				frag.appendChild(val);
			} else {
				frag = val;
			}
			// We need to mark each node as belonging to the node list.
			nodeLists.update(nodes, frag.childNodes);
			if (typeof val === 'string') {
				// if it was a string, check for hookups
				frag = can.view.hookup(frag, nodes[0].parentNode);
			}
			elements.replace(oldNodes, frag);
			return nodes;
		},
		text: function (el, compute, parentNode) {
			var parent = elements.getParentNode(el, parentNode);
			// setup listening right away so we don't have to re-calculate value
			var data = listen(parent, compute, function (ev, newVal, oldVal) {
				// Sometimes this is 'unknown' in IE and will throw an exception if it is
				/* jshint ignore:start */
				if (typeof node.nodeValue !== 'unknown') {
					node.nodeValue = '' + newVal;
				}
				/* jshint ignore:end */
				// TODO: remove in 2.1
				data.teardownCheck(node.parentNode);
			}),
				// The text node that will be updated
				node = document.createTextNode(compute());
			// Replace the placeholder with the live node and do the nodeLists thing.
			// Add that node to nodeList so we can remove it when the parent element is removed from the page
			data.nodeList = live.replace([el], node, data.teardownCheck);
		},
		/**
		 * @function can.view.live.text
		 * @parent can.view.live
		 *
		 * Replaces one element with some content while keeping [can.view.live.nodeLists nodeLists] data
		 * correct.
		 */
		attributes: function (el, compute, currentValue) {
			var setAttrs = function (newVal) {
				var parts = getAttributeParts(newVal),
					newAttrName = parts.shift();
				// Remove if we have a change and used to have an `attrName`.
				if (newAttrName !== attrName && attrName) {
					elements.removeAttr(el, attrName);
				}
				// Set if we have a new `attrName`.
				if (newAttrName) {
					elements.setAttr(el, newAttrName, parts.join('='));
					attrName = newAttrName;
				}
			};
			listen(el, compute, function (ev, newVal) {
				setAttrs(newVal);
			});
			// current value has been set
			if (arguments.length >= 3) {
				var attrName = getAttributeParts(currentValue)[0];
			} else {
				setAttrs(compute());
			}
		},
		attributePlaceholder: '__!!__',
		attributeReplace: /__!!__/g,
		attribute: function (el, attributeName, compute) {
			listen(el, compute, function (ev, newVal) {
				elements.setAttr(el, attributeName, hook.render());
			});
			var wrapped = can.$(el),
				hooks;
			// Get the list of hookups or create one for this element.
			// Hooks is a map of attribute names to hookup `data`s.
			// Each hookup data has:
			// `render` - A `function` to render the value of the attribute.
			// `funcs` - A list of hookup `function`s on that attribute.
			// `batchNum` - The last event `batchNum`, used for performance.
			hooks = can.data(wrapped, 'hooks');
			if (!hooks) {
				can.data(wrapped, 'hooks', hooks = {});
			}
			// Get the attribute value.
			var attr = elements.getAttr(el, attributeName),
				// Split the attribute value by the template.
				// Only split out the first __!!__ so if we have multiple hookups in the same attribute,
				// they will be put in the right spot on first render
				parts = attr.split(live.attributePlaceholder),
				goodParts = [],
				hook;
			goodParts.push(parts.shift(), parts.join(live.attributePlaceholder));
			// If we already had a hookup for this attribute...
			if (hooks[attributeName]) {
				// Just add to that attribute's list of `function`s.
				hooks[attributeName].computes.push(compute);
			} else {
				// Create the hookup data.
				hooks[attributeName] = {
					render: function () {
						var i = 0,
							// attr doesn't have a value in IE
							newAttr = attr ? attr.replace(live.attributeReplace, function () {
								return elements.contentText(hook.computes[i++]());
							}) : elements.contentText(hook.computes[i++]());
						return newAttr;
					},
					computes: [compute],
					batchNum: undefined
				};
			}
			// Save the hook for slightly faster performance.
			hook = hooks[attributeName];
			// Insert the value in parts.
			goodParts.splice(1, 0, compute());
			// Set the attribute.
			elements.setAttr(el, attributeName, goodParts.join(''));
		},
		specialAttribute: function (el, attributeName, compute) {
			listen(el, compute, function (ev, newVal) {
				elements.setAttr(el, attributeName, getValue(newVal));
			});
			elements.setAttr(el, attributeName, getValue(compute()));
		}
	};
	var newLine = /(\r|\n)+/g;
	var getValue = function (val) {
		var regexp = /^["'].*["']$/;
		val = val.replace(elements.attrReg, '')
			.replace(newLine, '');
		// check if starts and ends with " or '
		return regexp.test(val) ? val.substr(1, val.length - 2) : val;
	};
	can.view.live = live;
	can.view.nodeLists = nodeLists;
	can.view.elements = elements;
	return live;
});