/*!
 * CanJS - 2.0.7
 * http://canjs.us/
 * Copyright (c) 2014 Bitovi
 * Wed, 26 Mar 2014 16:12:27 GMT
 * Licensed MIT
 * Includes: CanJS default build
 * Download from: http://canjs.us/
 */
define(["can/util/library", "can/view/elements"], function (can) {
	// In some browsers, text nodes can not take expando properties.
	// We test that here.
	var canExpando = true;
	try {
		document.createTextNode('')
			._ = 0;
	} catch (ex) {
		canExpando = false;
	}
	// A mapping of element ids to nodeList id
	var nodeMap = {},
		// A mapping of ids to text nodes
		textNodeMap = {}, expando = 'ejs_' + Math.random(),
		_id = 0,
		id = function (node) {
			if (canExpando || node.nodeType !== 3) {
				if (node[expando]) {
					return node[expando];
				} else {
					++_id;
					return node[expando] = (node.nodeName ? 'element_' : 'obj_') + _id;
				}
			} else {
				for (var textNodeID in textNodeMap) {
					if (textNodeMap[textNodeID] === node) {
						return textNodeID;
					}
				}
				++_id;
				textNodeMap['text_' + _id] = node;
				return 'text_' + _id;
			}
		}, splice = [].splice;
	/**
	 * @property {Object} can.view.nodeLists
	 * @parent can.view.static
	 *
	 * Stores hierarchical node references.
	 *
	 * ## Use
	 *
	 * `can.view.nodeLists` is used to make sure "directly nested" live-binding
	 * sections update content correctly.
	 *
	 * Consider a template like:
	 *
	 *     <div>
	 *     {{#if items.length}}
	 *        Items:
	 *        {{#items}}
	 *           <label></label>
	 *        {{/items}}
	 *     {{/if}}
	 *     </div>
	 *
	 *
	 * The `{{#if}}` and `{{#items}}` seconds are "directly nested" because
	 * they share the same `<div>` parent element.
	 *
	 * If `{{#items}}` changes the DOM by adding more `<labels>`,
	 * `{{#if}}` needs to know about the `<labels>` to remove them
	 * if `{{#if}}` is re-rendered.  `{{#if}}` would be re-rendered, for example, if
	 * all items were removed.
	 *
	 *
	 * To keep all live-bound sections knowing which elements they are managing,
	 * all live-bound elments are [can.view.nodeLists.register registered] and
	 * [can.view.nodeLists.update updated] when the change.
	 *
	 * For example, the above template, when rendered with data like:
	 *
	 *     data = new can.Map({
	 *       items: ["first","second"]
	 *     })
	 *
	 * This will first render the following content:
	 *
	 *     <div>
	 *        <span data-view-id='5'/>
	 *     </div>
	 *
	 * When the `5` [can.view.hookup hookup] callback is called, this will register the `<span>` like:
	 *
	 *     var ifsNodes = [<span 5>]
	 *     nodeLists.register(ifsNodes);
	 *
	 * And then render `{{if}}`'s contents and update `ifsNodes` with it:
	 *
	 *     nodeLists.update( ifsNodes, [<"\nItems:\n">, <span data-view-id="6">] );
	 *
	 * Next, hookup `6` is called which will regsiter the `<span>` like:
	 *
	 *     var eachsNodes = [<span 6>];
	 *     nodeLists.register(eachsNodes);
	 *
	 * And then it will render `{{#each}}`'s content and update `eachsNodes` with it:
	 *
	 *     nodeLists.update(eachsNodes, [<label>,<label>]);
	 *
	 * As `nodeLists` knows that `eachsNodes` is inside `ifsNodes`, it also updates
	 * `ifsNodes`'s nodes to look like:
	 *
	 *     [<"\nItems:\n">,<label>,<label>]
	 *
	 * Now, if all items were removed, `{{#if}}` would be able to remove
	 * all the `<label>` elements.
	 *
	 * When you regsiter a nodeList, you can also provide a callback to know when
	 * that nodeList has been replaced by a parent nodeList.  This is
	 * useful for tearing down live-binding.
	 *
	 *
	 *
	 *
	 *
	 */
	var nodeLists = {
		id: id,

		/**
		 * @function can.view.nodeLists.update
		 * @parent can.view.nodeLists
		 *
		 * Updates a nodeList with new items
		 *
		 * @param {Array.<HTMLElement>} nodeList A registered nodeList.
		 *
		 * @param {Array.<HTMLElement>} newNodes HTML nodes that should be placed in the nodeList.
		 *
		 */
		update: function (nodeList, newNodes) {
			// Unregister all childNodes.
			can.each(nodeList.childNodeLists, function (nodeList) {
				nodeLists.unregister(nodeList);
			});
			nodeList.childNodeLists = [];
			// Remove old node pointers to this list.
			can.each(nodeList, function (node) {
				delete nodeMap[id(node)];
			});
			newNodes = can.makeArray(newNodes);
			// indicate the new nodes belong to this list
			can.each(newNodes, function (node) {
				nodeMap[id(node)] = nodeList;
			});
			var oldListLength = nodeList.length,
				firstNode = nodeList[0];
			// Replace oldNodeLists's contents'
			splice.apply(nodeList, [
				0,
				oldListLength
			].concat(newNodes));
			// update all parent nodes so they are able to replace the correct elements
			var parentNodeList = nodeList;
			while (parentNodeList = parentNodeList.parentNodeList) {
				splice.apply(parentNodeList, [
					can.inArray(firstNode, parentNodeList),
					oldListLength
				].concat(newNodes));
			}
		},
		/**
		 * @function can.view.nodeLists.register
		 * @parent can.view.nodeLists
		 *
		 * Registers a nodeList.
		 *
		 * @param {Array.<HTMLElement>} nodeList An array of elements. This array will be kept live if child nodeLists
		 * update themselves.
		 *
		 * @param {function} [unregistered] An optional callback that is called when the `nodeList` is
		 * replaced due to a parentNode list being updated.
		 *
		 * @param {Array.<HTMLElement>} [parent] An optional parent nodeList.  If no parentNode list is found,
		 * the first element in `nodeList`'s current nodeList will be used.
		 *
		 * @return {Array.<HTMLElement>} The `nodeList` passed to `register`.
		 */
		register: function (nodeList, unregistered, parent) {
			// add an id to the nodeList
			nodeList.unregistered = unregistered;
			nodeList.childNodeLists = [];
			if (!parent) {
				// find the parent by looking up where this node is
				if (nodeList.length > 1) {
					throw 'does not work';
				}
				var nodeId = id(nodeList[0]);
				parent = nodeMap[nodeId];
			}
			nodeList.parentNodeList = parent;
			if (parent) {
				parent.childNodeLists.push(nodeList);
			}
			return nodeList;
		},
		// removes node in all parent nodes and unregisters all childNodes
		/**
		 * @function can.view.nodeLists.unregister
		 * @parent can.view.nodeLists
		 *
		 * Unregister's a nodeList.  Call if the nodeList is no longer being
		 * updated.  This will unregister all child nodeLists.
		 *
		 *
		 * @param {Array.<HTMLElement>} nodeList The nodelist to unregister.
		 */
		unregister: function (nodeList) {
			if (!nodeList.isUnregistered) {
				nodeList.isUnregistered = true;
				// unregister all childNodeLists
				delete nodeList.parentNodeList;
				can.each(nodeList, function (node) {
					var nodeId = id(node);
					delete nodeMap[nodeId];
				});
				// this can unbind which will call itself
				if (nodeList.unregistered) {
					nodeList.unregistered();
				}
				can.each(nodeList.childNodeLists, function (nodeList) {
					nodeLists.unregister(nodeList);
				});
			}
		},
		nodeMap: nodeMap
	};
	return nodeLists;
});