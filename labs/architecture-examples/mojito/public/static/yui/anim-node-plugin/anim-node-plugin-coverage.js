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
_yuitest_coverage["build/anim-node-plugin/anim-node-plugin.js"] = {
    lines: {},
    functions: {},
    coveredLines: 0,
    calledLines: 0,
    coveredFunctions: 0,
    calledFunctions: 0,
    path: "build/anim-node-plugin/anim-node-plugin.js",
    code: []
};
_yuitest_coverage["build/anim-node-plugin/anim-node-plugin.js"].code=["YUI.add('anim-node-plugin', function (Y, NAME) {","","/**"," *  Binds an Anim instance to a Node instance"," * @module anim"," * @class Plugin.NodeFX"," * @extends Anim"," * @submodule anim-node-plugin"," */","","var NodeFX = function(config) {","    config = (config) ? Y.merge(config) : {};","    config.node = config.host;","    NodeFX.superclass.constructor.apply(this, arguments);","};","","NodeFX.NAME = \"nodefx\";","NodeFX.NS = \"fx\";","","Y.extend(NodeFX, Y.Anim);","","Y.namespace('Plugin');","Y.Plugin.NodeFX = NodeFX;","","","}, '3.7.3', {\"requires\": [\"node-pluginhost\", \"anim-base\"]});"];
_yuitest_coverage["build/anim-node-plugin/anim-node-plugin.js"].lines = {"1":0,"11":0,"12":0,"13":0,"14":0,"17":0,"18":0,"20":0,"22":0,"23":0};
_yuitest_coverage["build/anim-node-plugin/anim-node-plugin.js"].functions = {"NodeFX:11":0,"(anonymous 1):1":0};
_yuitest_coverage["build/anim-node-plugin/anim-node-plugin.js"].coveredLines = 10;
_yuitest_coverage["build/anim-node-plugin/anim-node-plugin.js"].coveredFunctions = 2;
_yuitest_coverline("build/anim-node-plugin/anim-node-plugin.js", 1);
YUI.add('anim-node-plugin', function (Y, NAME) {

/**
 *  Binds an Anim instance to a Node instance
 * @module anim
 * @class Plugin.NodeFX
 * @extends Anim
 * @submodule anim-node-plugin
 */

_yuitest_coverfunc("build/anim-node-plugin/anim-node-plugin.js", "(anonymous 1)", 1);
_yuitest_coverline("build/anim-node-plugin/anim-node-plugin.js", 11);
var NodeFX = function(config) {
    _yuitest_coverfunc("build/anim-node-plugin/anim-node-plugin.js", "NodeFX", 11);
_yuitest_coverline("build/anim-node-plugin/anim-node-plugin.js", 12);
config = (config) ? Y.merge(config) : {};
    _yuitest_coverline("build/anim-node-plugin/anim-node-plugin.js", 13);
config.node = config.host;
    _yuitest_coverline("build/anim-node-plugin/anim-node-plugin.js", 14);
NodeFX.superclass.constructor.apply(this, arguments);
};

_yuitest_coverline("build/anim-node-plugin/anim-node-plugin.js", 17);
NodeFX.NAME = "nodefx";
_yuitest_coverline("build/anim-node-plugin/anim-node-plugin.js", 18);
NodeFX.NS = "fx";

_yuitest_coverline("build/anim-node-plugin/anim-node-plugin.js", 20);
Y.extend(NodeFX, Y.Anim);

_yuitest_coverline("build/anim-node-plugin/anim-node-plugin.js", 22);
Y.namespace('Plugin');
_yuitest_coverline("build/anim-node-plugin/anim-node-plugin.js", 23);
Y.Plugin.NodeFX = NodeFX;


}, '3.7.3', {"requires": ["node-pluginhost", "anim-base"]});
