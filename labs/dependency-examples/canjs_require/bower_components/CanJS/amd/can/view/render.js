/*!
* CanJS - 1.1.5 (2013-03-27)
* http://canjs.us/
* Copyright (c) 2013 Bitovi
* Licensed MIT
*/
define(['can/view', 'can/util/string'], function (can) {
    // text node expando test
    var canExpando = true;
    try {
        document.createTextNode('')._ = 0;
    } catch (ex) {
        canExpando = false;
    }

    var attrMap = {
        "class": "className",
        "value": "value",
        "innerText": "innerText",
        "textContent": "textContent"
    },
        tagMap = {
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
        attributePlaceholder = '__!!__',
        attributeReplace = /__!!__/g,
        tagToContentPropMap = {
            option: "textContent" in document.createElement("option") ? "textContent" : "innerText",
            textarea: "value"
        },
        bool = can.each(["checked", "disabled", "readonly", "required"], function (n) {
            attrMap[n] = n;
        }),
        // a helper to get the parentNode for a given element el
        // if el is in a documentFragment, it will return defaultParentNode
        getParentNode = function (el, defaultParentNode) {
            return defaultParentNode && el.parentNode.nodeType === 11 ? defaultParentNode : el.parentNode;
        },
        setAttr = function (el, attrName, val) {
            var tagName = el.nodeName.toString().toLowerCase(),
                prop = attrMap[attrName];
            // if this is a special property
            if (prop) {
                // set the value as true / false
                el[prop] = can.inArray(attrName, bool) > -1 ? true : val;
                if (prop === "value" && (tagName === "input" || tagName === "textarea")) {
                    el.defaultValue = val;
                }
            } else {
                el.setAttribute(attrName, val);
            }
        },
        getAttr = function (el, attrName) {
            // Default to a blank string for IE7/8
            return (attrMap[attrName] && el[attrMap[attrName]] ? el[attrMap[attrName]] : el.getAttribute(attrName)) || '';
        },
        removeAttr = function (el, attrName) {
            if (can.inArray(attrName, bool) > -1) {
                el[attrName] = false;
            } else {
                el.removeAttribute(attrName);
            }
        },
        pendingHookups = [],
        // Returns text content for anything other than a live-binding 
        contentText = function (input) {

            // If it's a string, return.
            if (typeof input == 'string') {
                return input;
            }
            // If has no value, return an empty string.
            if (!input && input !== 0) {
                return '';
            }

            // If it's an object, and it has a hookup method.
            var hook = (input.hookup &&

            // Make a function call the hookup method.


            function (el, id) {
                input.hookup.call(input, el, id);
            }) ||

            // Or if it's a `function`, just use the input.
            (typeof input == 'function' && input);

            // Finally, if there is a `function` to hookup on some dom,
            // add it to pending hookups.
            if (hook) {
                pendingHookups.push(hook);
                return '';
            }

            // Finally, if all else is `false`, `toString()` it.
            return "" + input;
        },
        // Returns escaped/sanatized content for anything other than a live-binding
        contentEscape = function (txt) {
            return (typeof txt == 'string' || typeof txt == 'number') ? can.esc(txt) : contentText(txt);
        },
        // a mapping of element ids to nodeList ids
        nodeMap = {},
        // a mapping of ids to text nodes
        textNodeMap = {},
        // a mapping of nodeList ids to nodeList
        nodeListMap = {},
        expando = "ejs_" + Math.random(),
        _id = 0,
        id = function (node) {
            if (canExpando || node.nodeType !== 3) {
                if (node[expando]) {
                    return node[expando];
                }
                else {
                    return node[expando] = (node.nodeName ? "element_" : "obj_") + (++_id);
                }
            }
            else {
                for (var textNodeID in textNodeMap) {
                    if (textNodeMap[textNodeID] === node) {
                        return textNodeID;
                    }
                }

                textNodeMap["text_" + (++_id)] = node;
                return "text_" + _id;
            }
        },
        // removes a nodeListId from a node's nodeListIds
        removeNodeListId = function (node, nodeListId) {
            var nodeListIds = nodeMap[id(node)];
            if (nodeListIds) {
                var index = can.inArray(nodeListId, nodeListIds);

                if (index >= 0) {
                    nodeListIds.splice(index, 1);
                }
                if (!nodeListIds.length) {
                    delete nodeMap[id(node)];
                }
            }
        },
        addNodeListId = function (node, nodeListId) {
            var nodeListIds = nodeMap[id(node)];
            if (!nodeListIds) {
                nodeListIds = nodeMap[id(node)] = [];
            }
            nodeListIds.push(nodeListId);
        },
        tagChildren = function (tagName) {
            var newTag = tagMap[tagName] || "span";
            if (newTag === "span") {
                //innerHTML in IE doesn't honor leading whitespace after empty elements
                return "@@!!@@";
            }
            return "<" + newTag + ">" + tagChildren(newTag) + "</" + newTag + ">";
        };

    can.extend(can.view, {

        pending: function () {
            // TODO, make this only run for the right tagName
            var hooks = pendingHookups.slice(0);
            lastHookups = hooks;
            pendingHookups = [];
            return can.view.hook(function (el) {
                can.each(hooks, function (fn) {
                    fn(el);
                });
            });
        },

        registerNode: function (nodeList) {
            var nLId = id(nodeList);
            nodeListMap[nLId] = nodeList;

            can.each(nodeList, function (node) {
                addNodeListId(node, nLId);
            });
        },

        unregisterNode: function (nodeList) {
            var nLId = id(nodeList);
            can.each(nodeList, function (node) {
                removeNodeListId(node, nLId);
            });
            delete nodeListMap[nLId];
        },


        txt: function (escape, tagName, status, self, func) {
            // call the "wrapping" function and get the binding information
            var binding = can.compute.binder(func, self, function (newVal, oldVal) {
                // call the update method we will define for each
                // type of attribute
                update(newVal, oldVal);
            });

            // If we had no observes just return the value returned by func.
            if (!binding.isListening) {
                return (escape || status !== 0 ? contentEscape : contentText)(binding.value);
            }

            // The following are helper methods or varaibles that will
            // be defined by one of the various live-updating schemes.
            // The parent element we are listening to for teardown
            var parentElement, nodeList, teardown = function () {
                binding.teardown();
                if (nodeList) {
                    can.view.unregisterNode(nodeList);
                }
            },
                // if the parent element is removed, teardown the binding
                setupTeardownOnDestroy = function (el) {
                    can.bind.call(el, 'destroyed', teardown);
                    parentElement = el;
                },
                // if there is no parent, undo bindings
                teardownCheck = function (parent) {
                    if (!parent) {
                        teardown();
                        can.unbind.call(parentElement, 'destroyed', teardown);
                    }
                },
                // the tag type to insert
                tag = (tagMap[tagName] || "span"),
                // this will be filled in if binding.isListening
                update,
                // the property (instead of innerHTML elements) to adjust. For
                // example options should use textContent
                contentProp = tagToContentPropMap[tagName];


            // The magic tag is outside or between tags.
            if (status === 0 && !contentProp) {
                // Return an element tag with a hookup in place of the content
                return "<" + tag + can.view.hook(
                escape ?
                // If we are escaping, replace the parentNode with 
                // a text node who's value is `func`'s return value.


                function (el, parentNode) {
                    // updates the text of the text node
                    update = function (newVal) {
                        node.nodeValue = "" + newVal;
                        teardownCheck(node.parentNode);
                    };

                    var parent = getParentNode(el, parentNode),
                        node = document.createTextNode(binding.value);

                    // When iterating through an Observe.List with no DOM
                    // elements containing the individual items, the parent 
                    // is sometimes incorrect not the true parent of the 
                    // source element. (#153)
                    if (el.parentNode !== parent) {
                        parent = el.parentNode;
                        parent.insertBefore(node, el);
                        parent.removeChild(el);
                    } else {
                        parent.insertBefore(node, el);
                        parent.removeChild(el);
                    }
                    setupTeardownOnDestroy(parent);
                } :
                // If we are not escaping, replace the parentNode with a
                // documentFragment created as with `func`'s return value.


                function (span, parentNode) {
                    // updates the elements with the new content
                    update = function (newVal) {
                        // is this still part of the DOM?
                        var attached = nodes[0].parentNode;
                        // update the nodes in the DOM with the new rendered value
                        if (attached) {
                            makeAndPut(newVal);
                        }
                        teardownCheck(nodes[0].parentNode);
                    };

                    // make sure we have a valid parentNode
                    parentNode = getParentNode(span, parentNode);
                    // A helper function to manage inserting the contents
                    // and removing the old contents
                    var nodes, makeAndPut = function (val) {
                        // create the fragment, but don't hook it up
                        // we need to insert it into the document first
                        var frag = can.view.frag(val, parentNode),
                            // keep a reference to each node
                            newNodes = can.makeArray(frag.childNodes),
                            last = nodes ? nodes[nodes.length - 1] : span;

                        // Insert it in the `document` or `documentFragment`
                        if (last.nextSibling) {
                            last.parentNode.insertBefore(frag, last.nextSibling);
                        } else {
                            last.parentNode.appendChild(frag);
                        }
                        // nodes hasn't been set yet
                        if (!nodes) {
                            can.remove(can.$(span));
                            nodes = newNodes;
                            // set the teardown nodeList
                            nodeList = nodes;
                            can.view.registerNode(nodes);
                        } else {
                            // Update node Array's to point to new nodes
                            // and then remove the old nodes.
                            // It has to be in this order for Mootools
                            // and IE because somehow, after an element
                            // is removed from the DOM, it loses its
                            // expando values.
                            var nodesToRemove = can.makeArray(nodes);
                            can.view.replace(nodes, newNodes);
                            can.remove(can.$(nodesToRemove));
                        }
                    };
                    // nodes are the nodes that any updates will replace
                    // at this point, these nodes could be part of a documentFragment
                    makeAndPut(binding.value, [span]);

                    setupTeardownOnDestroy(parentNode);
                    //children have to be properly nested HTML for buildFragment to work properly
                }) + ">" + tagChildren(tag) + "</" + tag + ">";
                // In a tag, but not in an attribute
            } else if (status === 1) {
                // remember the old attr name
                var attrName = binding.value.replace(/['"]/g, '').split('=')[0];
                pendingHookups.push(function (el) {
                    update = function (newVal) {
                        var parts = (newVal || "").replace(/['"]/g, '').split('='),
                            newAttrName = parts[0];

                        // Remove if we have a change and used to have an `attrName`.
                        if ((newAttrName != attrName) && attrName) {
                            removeAttr(el, attrName);
                        }
                        // Set if we have a new `attrName`.
                        if (newAttrName) {
                            setAttr(el, newAttrName, parts[1]);
                            attrName = newAttrName;
                        }
                    };
                    setupTeardownOnDestroy(el);
                });

                return binding.value;
            } else { // In an attribute...
                var attributeName = status === 0 ? contentProp : status;
                // if the magic tag is inside the element, like `<option><% TAG %></option>`,
                // we add this hookup to the last element (ex: `option`'s) hookups.
                // Otherwise, the magic tag is in an attribute, just add to the current element's
                // hookups.
                (status === 0 ? lastHookups : pendingHookups).push(function (el) {
                    // update will call this attribute's render method
                    // and set the attribute accordingly
                    update = function () {
                        setAttr(el, attributeName, hook.render(), contentProp);
                    };

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
                    var attr = getAttr(el, attributeName, contentProp),
                        // Split the attribute value by the template.
                        // Only split out the first __!!__ so if we have multiple hookups in the same attribute, 
                        // they will be put in the right spot on first render
                        parts = attr.split(attributePlaceholder),
                        goodParts = [],
                        hook;
                    goodParts.push(parts.shift(), parts.join(attributePlaceholder));

                    // If we already had a hookup for this attribute...
                    if (hooks[attributeName]) {
                        // Just add to that attribute's list of `function`s.
                        hooks[attributeName].bindings.push(binding);
                    } else {
                        // Create the hookup data.
                        hooks[attributeName] = {
                            render: function () {
                                var i = 0,
                                    newAttr = attr.replace(attributeReplace, function () {
                                        return contentText(hook.bindings[i++].value);
                                    });
                                return newAttr;
                            },
                            bindings: [binding],
                            batchNum: undefined
                        };
                    }

                    // Save the hook for slightly faster performance.
                    hook = hooks[attributeName];

                    // Insert the value in parts.
                    goodParts.splice(1, 0, binding.value);

                    // Set the attribute.
                    setAttr(el, attributeName, goodParts.join(""), contentProp);

                    // Bind on change.
                    //liveBind(observed, el, binder,oldObserved);
                    setupTeardownOnDestroy(el);
                });
                return attributePlaceholder;
            }
        },

        replace: function (oldNodeList, newNodes) {
            // for each node in the node list
            oldNodeList = can.makeArray(oldNodeList);

            can.each(oldNodeList, function (node) {
                // for each nodeList the node is in
                can.each(can.makeArray(nodeMap[id(node)]), function (nodeListId) {
                    var nodeList = nodeListMap[nodeListId],
                        startIndex = can.inArray(node, nodeList),
                        endIndex = can.inArray(oldNodeList[oldNodeList.length - 1], nodeList);

                    // remove this nodeListId from each node
                    if (startIndex >= 0 && endIndex >= 0) {
                        for (var i = startIndex; i <= endIndex; i++) {
                            var n = nodeList[i];
                            removeNodeListId(n, nodeListId);
                        }

                        // swap in new nodes into the nodeLIst
                        nodeList.splice.apply(nodeList, [startIndex, endIndex - startIndex + 1].concat(newNodes));

                        // tell these new nodes they belong to the nodeList
                        can.each(newNodes, function (node) {
                            addNodeListId(node, nodeListId);
                        });
                    } else {
                        can.view.unregisterNode(nodeList);
                    }
                });
            });
        },

        canExpando: canExpando,
        // Node mappings
        textNodeMap: textNodeMap,
        nodeMap: nodeMap,
        nodeListMap: nodeListMap
    });

    return can;
});