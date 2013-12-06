/*!
 * CanJS - 2.0.3
 * http://canjs.us/
 * Copyright (c) 2013 Bitovi
 * Tue, 26 Nov 2013 18:21:22 GMT
 * Licensed MIT
 * Includes: CanJS default build
 * Download from: http://canjs.us/
 */
define(["can/util/library"], function(can){


	// text node expando test
	var canExpando = true;
	try {
		document.createTextNode('')._ = 0;
	} catch (ex) {
		canExpando = false;
	}


	// a mapping of element ids to nodeList ids
	var nodeMap = {},
	// a mapping of ids to text nodes
	textNodeMap = {},
	// a mapping of nodeList ids to nodeList
	nodeListMap = {},
	expando = "ejs_"+Math.random(),
	_id=0,
	id = function(node){
		if(canExpando || node.nodeType !== 3) {
			if(node[expando]) {
				return node[expando];
			}
			else {
				return node[expando] = (node.nodeName ? "element_" : "obj_")+(++_id);
			}
		}
		else {
			for(var textNodeID in textNodeMap) {
				if(textNodeMap[textNodeID] === node) {
					return textNodeID;
				}
			}

			textNodeMap["text_" + (++_id)] = node;
			return "text_" + _id;
		}
	},
	// removes a nodeListId from a node's nodeListIds
	removeNodeListId= function(node, nodeListId){
		var nodeListIds = nodeMap[id(node)];
		if( nodeListIds ) {
			var index = can.inArray(nodeListId, nodeListIds);
		
			if ( index >= 0 ) {
				nodeListIds.splice( index ,  1 );
			}
			if(!nodeListIds.length){
				delete nodeMap[id(node)];
			}
		}
	},
	addNodeListId = function(node, nodeListId){
		var nodeListIds = nodeMap[id(node)];
			if(!nodeListIds){
				nodeListIds = nodeMap[id(node)] = [];
			}
			nodeListIds.push(nodeListId);
	};


	var nodeLists = {
		id: id,
		// replaces the contents of one node list with the nodes in another list
		replace: function(oldNodeList, newNodes){
			// for each node in the node list
			oldNodeList = can.makeArray( oldNodeList );
			
			// try every set
			//can.each( oldNodeList, function(node){
			var node = oldNodeList[0]
				// for each nodeList the node is in
				can.each( can.makeArray( nodeMap[id(node)] ), function( nodeListId ){
					
					// if startNode to endNode is 
					// within list, replace that list
					// 
					// I think the problem is not the WHOLE part is being 
					// matched
					var nodeList = nodeListMap[nodeListId],
						startIndex = can.inArray( node, nodeList ),
						endIndex = can.inArray( oldNodeList[oldNodeList.length - 1], nodeList);
					

					// remove this nodeListId from each node
					if(startIndex >=0 && endIndex >= 0){
						for( var i = startIndex; i <= endIndex; i++){
							var n = nodeList[i];
							removeNodeListId(n, nodeListId);
						}
						// swap in new nodes into the nodeLIst
						nodeList.splice.apply(nodeList, [startIndex,endIndex-startIndex+1 ].concat(newNodes));

						// tell these new nodes they belong to the nodeList
						can.each(newNodes, function( node ) {
							addNodeListId(node, nodeListId);
						});
					} else {
						nodeLists.unregister( nodeList );
					}
				});
			//});
		},
		// registers a list of nodes
		register: function(nodeList){
			var nLId = id(nodeList);
			nodeListMap[nLId] = nodeList;
			
			can.each(nodeList, function(node){
				addNodeListId(node, nLId);
			});
				
		},
		// removes mappings
		unregister: function(nodeList){
			var nLId = id(nodeList);
			can.each(nodeList, function(node){
				removeNodeListId(node, nLId);
			});
			delete nodeListMap[nLId];
		},
		nodeMap: nodeMap,
		nodeListMap: nodeListMap
	}
	var ids = function(nodeList){
		return nodeList.map(function(n){
			return id(n)+":"+(n.innerHTML  || n.nodeValue)  
		})
	}
	return nodeLists;


});