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
_yuitest_coverage["build/pjax-plugin/pjax-plugin.js"] = {
    lines: {},
    functions: {},
    coveredLines: 0,
    calledLines: 0,
    coveredFunctions: 0,
    calledFunctions: 0,
    path: "build/pjax-plugin/pjax-plugin.js",
    code: []
};
_yuitest_coverage["build/pjax-plugin/pjax-plugin.js"].code=["YUI.add('pjax-plugin', function (Y, NAME) {","","/**","Node plugin that provides seamless, gracefully degrading pjax functionality.","","@module pjax","@submodule pjax-plugin","@since 3.5.0","**/","","/**","Node plugin that provides seamless, gracefully degrading pjax functionality.","","@class Plugin.Pjax","@extends Pjax","@since 3.5.0","**/","","Y.Plugin.Pjax = Y.Base.create('pjaxPlugin', Y.Pjax, [Y.Plugin.Base], {","    // -- Lifecycle Methods ----------------------------------------------------","    initializer: function (config) {","        this.set('container', config.host);","    }","}, {","    NS: 'pjax'","});","","","}, '3.7.3', {\"requires\": [\"node-pluginhost\", \"pjax\", \"plugin\"]});"];
_yuitest_coverage["build/pjax-plugin/pjax-plugin.js"].lines = {"1":0,"19":0,"22":0};
_yuitest_coverage["build/pjax-plugin/pjax-plugin.js"].functions = {"initializer:21":0,"(anonymous 1):1":0};
_yuitest_coverage["build/pjax-plugin/pjax-plugin.js"].coveredLines = 3;
_yuitest_coverage["build/pjax-plugin/pjax-plugin.js"].coveredFunctions = 2;
_yuitest_coverline("build/pjax-plugin/pjax-plugin.js", 1);
YUI.add('pjax-plugin', function (Y, NAME) {

/**
Node plugin that provides seamless, gracefully degrading pjax functionality.

@module pjax
@submodule pjax-plugin
@since 3.5.0
**/

/**
Node plugin that provides seamless, gracefully degrading pjax functionality.

@class Plugin.Pjax
@extends Pjax
@since 3.5.0
**/

_yuitest_coverfunc("build/pjax-plugin/pjax-plugin.js", "(anonymous 1)", 1);
_yuitest_coverline("build/pjax-plugin/pjax-plugin.js", 19);
Y.Plugin.Pjax = Y.Base.create('pjaxPlugin', Y.Pjax, [Y.Plugin.Base], {
    // -- Lifecycle Methods ----------------------------------------------------
    initializer: function (config) {
        _yuitest_coverfunc("build/pjax-plugin/pjax-plugin.js", "initializer", 21);
_yuitest_coverline("build/pjax-plugin/pjax-plugin.js", 22);
this.set('container', config.host);
    }
}, {
    NS: 'pjax'
});


}, '3.7.3', {"requires": ["node-pluginhost", "pjax", "plugin"]});
