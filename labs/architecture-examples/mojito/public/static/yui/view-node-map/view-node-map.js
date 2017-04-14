/*
YUI 3.7.3 (build 5687)
Copyright 2012 Yahoo! Inc. All rights reserved.
Licensed under the BSD License.
http://yuilibrary.com/license/
*/
YUI.add('view-node-map', function (Y, NAME) {

/**
View extension that adds a static `getByNode()` method that returns the nearest
View instance associated with the given Node (similar to Widget's `getByNode()`
method).

@module app
@submodule view-node-map
@since 3.5.0
**/

var buildCfg  = Y.namespace('View._buildCfg'),
    instances = {};

/**
View extension that adds a static `getByNode()` method that returns the nearest
View instance associated with the given Node (similar to Widget's `getByNode()`
method).

Note that it's important to call `destroy()` on a View instance using this
extension when you plan to stop using it. This ensures that all internal
references to that View are cleared to prevent memory leaks.

@class View.NodeMap
@extensionfor View
@since 3.5.0
**/
function NodeMap() {}

// Tells Base.create() to mix the static getByNode method into built classes.
// We're cheating and modifying Y.View here, because right now there's no better
// way to do it.
buildCfg.aggregates || (buildCfg.aggregates = []);
buildCfg.aggregates.push('getByNode');

/**
Returns the nearest View instance associated with the given Node. The Node may
be a View container or any child of a View container.

Note that only instances of Views that have the Y.View.NodeMap extension mixed
in will be returned. The base View class doesn't provide this functionality by
default due to the additional memory management overhead involved in maintaining
a mapping of Nodes to View instances.

@method getByNode
@param {Node|HTMLElement|String} node Node instance, selector string, or
    HTMLElement.
@return {View} Closest View instance associated with the given Node, or `null`
    if no associated View instance was found.
@static
@since 3.5.0
**/
NodeMap.getByNode = function (node) {
    var view;

    Y.one(node).ancestor(function (ancestor) {
        return (view = instances[Y.stamp(ancestor, true)]) || false;
    }, true);

    return view || null;
};

// To make this testable.
NodeMap._instances = instances;

NodeMap.prototype = {
    initializer: function () {
        instances[Y.stamp(this.get('container'))] = this;
    },

    destructor: function () {
        var stamp = Y.stamp(this.get('container'), true);

        if (stamp in instances) {
            delete instances[stamp];
        }
    }
};

Y.View.NodeMap = NodeMap;


}, '3.7.3', {"requires": ["view"]});
