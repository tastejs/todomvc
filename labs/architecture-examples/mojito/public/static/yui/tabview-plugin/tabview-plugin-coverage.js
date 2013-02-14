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
_yuitest_coverage["build/tabview-plugin/tabview-plugin.js"] = {
    lines: {},
    functions: {},
    coveredLines: 0,
    calledLines: 0,
    coveredFunctions: 0,
    calledFunctions: 0,
    path: "build/tabview-plugin/tabview-plugin.js",
    code: []
};
_yuitest_coverage["build/tabview-plugin/tabview-plugin.js"].code=["YUI.add('tabview-plugin', function (Y, NAME) {","","function TabviewPlugin() {","    TabviewPlugin.superclass.constructor.apply(this, arguments);","};","","TabviewPlugin.NAME = 'tabviewPlugin';","TabviewPlugin.NS = 'tabs';","","Y.extend(TabviewPlugin, Y.TabviewBase);","","Y.namespace('Plugin');","Y.Plugin.Tabview = TabviewPlugin;","","","}, '3.7.3', {\"requires\": [\"tabview-base\"]});"];
_yuitest_coverage["build/tabview-plugin/tabview-plugin.js"].lines = {"1":0,"3":0,"4":0,"5":0,"7":0,"8":0,"10":0,"12":0,"13":0};
_yuitest_coverage["build/tabview-plugin/tabview-plugin.js"].functions = {"TabviewPlugin:3":0,"(anonymous 1):1":0};
_yuitest_coverage["build/tabview-plugin/tabview-plugin.js"].coveredLines = 9;
_yuitest_coverage["build/tabview-plugin/tabview-plugin.js"].coveredFunctions = 2;
_yuitest_coverline("build/tabview-plugin/tabview-plugin.js", 1);
YUI.add('tabview-plugin', function (Y, NAME) {

_yuitest_coverfunc("build/tabview-plugin/tabview-plugin.js", "(anonymous 1)", 1);
_yuitest_coverline("build/tabview-plugin/tabview-plugin.js", 3);
function TabviewPlugin() {
    _yuitest_coverfunc("build/tabview-plugin/tabview-plugin.js", "TabviewPlugin", 3);
_yuitest_coverline("build/tabview-plugin/tabview-plugin.js", 4);
TabviewPlugin.superclass.constructor.apply(this, arguments);
}_yuitest_coverline("build/tabview-plugin/tabview-plugin.js", 5);
;

_yuitest_coverline("build/tabview-plugin/tabview-plugin.js", 7);
TabviewPlugin.NAME = 'tabviewPlugin';
_yuitest_coverline("build/tabview-plugin/tabview-plugin.js", 8);
TabviewPlugin.NS = 'tabs';

_yuitest_coverline("build/tabview-plugin/tabview-plugin.js", 10);
Y.extend(TabviewPlugin, Y.TabviewBase);

_yuitest_coverline("build/tabview-plugin/tabview-plugin.js", 12);
Y.namespace('Plugin');
_yuitest_coverline("build/tabview-plugin/tabview-plugin.js", 13);
Y.Plugin.Tabview = TabviewPlugin;


}, '3.7.3', {"requires": ["tabview-base"]});
