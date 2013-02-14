/*
YUI 3.7.3 (build 5687)
Copyright 2012 Yahoo! Inc. All rights reserved.
Licensed under the BSD License.
http://yuilibrary.com/license/
*/
if (typeof _yuitest_coverage == "undefined"){
    _yuitest_coverage = {};
    _yuitest_coverline = function(src, line){
        var coverage = _yuitest_coverage[src];
        if (!coverage.lines[line]){
            coverage.calledLines++;
        }
        coverage.lines[line]++;
    };
    _yuitest_coverfunc = function(src, name, line){
        var coverage = _yuitest_coverage[src],
            funcId = name + ":" + line;
        if (!coverage.functions[funcId]){
            coverage.calledFunctions++;
        }
        coverage.functions[funcId]++;
    };
}
_yuitest_coverage["build/view-node-map/view-node-map.js"] = {
    lines: {},
    functions: {},
    coveredLines: 0,
    calledLines: 0,
    coveredFunctions: 0,
    calledFunctions: 0,
    path: "build/view-node-map/view-node-map.js",
    code: []
};
_yuitest_coverage["build/view-node-map/view-node-map.js"].code=["YUI.add('view-node-map', function (Y, NAME) {","","/**","View extension that adds a static `getByNode()` method that returns the nearest","View instance associated with the given Node (similar to Widget's `getByNode()`","method).","","@module app","@submodule view-node-map","@since 3.5.0","**/","","var buildCfg  = Y.namespace('View._buildCfg'),","    instances = {};","","/**","View extension that adds a static `getByNode()` method that returns the nearest","View instance associated with the given Node (similar to Widget's `getByNode()`","method).","","Note that it's important to call `destroy()` on a View instance using this","extension when you plan to stop using it. This ensures that all internal","references to that View are cleared to prevent memory leaks.","","@class View.NodeMap","@extensionfor View","@since 3.5.0","**/","function NodeMap() {}","","// Tells Base.create() to mix the static getByNode method into built classes.","// We're cheating and modifying Y.View here, because right now there's no better","// way to do it.","buildCfg.aggregates || (buildCfg.aggregates = []);","buildCfg.aggregates.push('getByNode');","","/**","Returns the nearest View instance associated with the given Node. The Node may","be a View container or any child of a View container.","","Note that only instances of Views that have the Y.View.NodeMap extension mixed","in will be returned. The base View class doesn't provide this functionality by","default due to the additional memory management overhead involved in maintaining","a mapping of Nodes to View instances.","","@method getByNode","@param {Node|HTMLElement|String} node Node instance, selector string, or","    HTMLElement.","@return {View} Closest View instance associated with the given Node, or `null`","    if no associated View instance was found.","@static","@since 3.5.0","**/","NodeMap.getByNode = function (node) {","    var view;","","    Y.one(node).ancestor(function (ancestor) {","        return (view = instances[Y.stamp(ancestor, true)]) || false;","    }, true);","","    return view || null;","};","","// To make this testable.","NodeMap._instances = instances;","","NodeMap.prototype = {","    initializer: function () {","        instances[Y.stamp(this.get('container'))] = this;","    },","","    destructor: function () {","        var stamp = Y.stamp(this.get('container'), true);","","        if (stamp in instances) {","            delete instances[stamp];","        }","    }","};","","Y.View.NodeMap = NodeMap;","","","}, '3.7.3', {\"requires\": [\"view\"]});"];
_yuitest_coverage["build/view-node-map/view-node-map.js"].lines = {"1":0,"13":0,"29":0,"34":0,"35":0,"54":0,"55":0,"57":0,"58":0,"61":0,"65":0,"67":0,"69":0,"73":0,"75":0,"76":0,"81":0};
_yuitest_coverage["build/view-node-map/view-node-map.js"].functions = {"NodeMap:29":0,"(anonymous 2):57":0,"getByNode:54":0,"initializer:68":0,"destructor:72":0,"(anonymous 1):1":0};
_yuitest_coverage["build/view-node-map/view-node-map.js"].coveredLines = 17;
_yuitest_coverage["build/view-node-map/view-node-map.js"].coveredFunctions = 6;
_yuitest_coverline("build/view-node-map/view-node-map.js", 1);
YUI.add('view-node-map', function (Y, NAME) {

/**
View extension that adds a static `getByNode()` method that returns the nearest
View instance associated with the given Node (similar to Widget's `getByNode()`
method).

@module app
@submodule view-node-map
@since 3.5.0
**/

_yuitest_coverfunc("build/view-node-map/view-node-map.js", "(anonymous 1)", 1);
_yuitest_coverline("build/view-node-map/view-node-map.js", 13);
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
_yuitest_coverline("build/view-node-map/view-node-map.js", 29);
function NodeMap() {}

// Tells Base.create() to mix the static getByNode method into built classes.
// We're cheating and modifying Y.View here, because right now there's no better
// way to do it.
_yuitest_coverline("build/view-node-map/view-node-map.js", 34);
buildCfg.aggregates || (buildCfg.aggregates = []);
_yuitest_coverline("build/view-node-map/view-node-map.js", 35);
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
_yuitest_coverline("build/view-node-map/view-node-map.js", 54);
NodeMap.getByNode = function (node) {
    _yuitest_coverfunc("build/view-node-map/view-node-map.js", "getByNode", 54);
_yuitest_coverline("build/view-node-map/view-node-map.js", 55);
var view;

    _yuitest_coverline("build/view-node-map/view-node-map.js", 57);
Y.one(node).ancestor(function (ancestor) {
        _yuitest_coverfunc("build/view-node-map/view-node-map.js", "(anonymous 2)", 57);
_yuitest_coverline("build/view-node-map/view-node-map.js", 58);
return (view = instances[Y.stamp(ancestor, true)]) || false;
    }, true);

    _yuitest_coverline("build/view-node-map/view-node-map.js", 61);
return view || null;
};

// To make this testable.
_yuitest_coverline("build/view-node-map/view-node-map.js", 65);
NodeMap._instances = instances;

_yuitest_coverline("build/view-node-map/view-node-map.js", 67);
NodeMap.prototype = {
    initializer: function () {
        _yuitest_coverfunc("build/view-node-map/view-node-map.js", "initializer", 68);
_yuitest_coverline("build/view-node-map/view-node-map.js", 69);
instances[Y.stamp(this.get('container'))] = this;
    },

    destructor: function () {
        _yuitest_coverfunc("build/view-node-map/view-node-map.js", "destructor", 72);
_yuitest_coverline("build/view-node-map/view-node-map.js", 73);
var stamp = Y.stamp(this.get('container'), true);

        _yuitest_coverline("build/view-node-map/view-node-map.js", 75);
if (stamp in instances) {
            _yuitest_coverline("build/view-node-map/view-node-map.js", 76);
delete instances[stamp];
        }
    }
};

_yuitest_coverline("build/view-node-map/view-node-map.js", 81);
Y.View.NodeMap = NodeMap;


}, '3.7.3', {"requires": ["view"]});
