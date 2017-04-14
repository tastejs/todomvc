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
_yuitest_coverage["build/autocomplete-plugin/autocomplete-plugin.js"] = {
    lines: {},
    functions: {},
    coveredLines: 0,
    calledLines: 0,
    coveredFunctions: 0,
    calledFunctions: 0,
    path: "build/autocomplete-plugin/autocomplete-plugin.js",
    code: []
};
_yuitest_coverage["build/autocomplete-plugin/autocomplete-plugin.js"].code=["YUI.add('autocomplete-plugin', function (Y, NAME) {","","/**","Binds an AutoCompleteList instance to a Node instance.","","@module autocomplete","@submodule autocomplete-plugin","**/","","/**","Binds an AutoCompleteList instance to a Node instance.","","@example","","    Y.one('#my-input').plug(Y.Plugin.AutoComplete, {","        source: 'select * from search.suggest where query=\"{query}\"'","    });","","    // You can now access the AutoCompleteList instance at Y.one('#my-input').ac","","@class Plugin.AutoComplete","@extends AutoCompleteList","**/","","var Plugin = Y.Plugin;","","function ACListPlugin(config) {","    config.inputNode = config.host;","","    // Render by default.","    if (!config.render && config.render !== false) {","      config.render = true;","    }","","    ACListPlugin.superclass.constructor.apply(this, arguments);","}","","Y.extend(ACListPlugin, Y.AutoCompleteList, {}, {","    NAME      : 'autocompleteListPlugin',","    NS        : 'ac',","    CSS_PREFIX: Y.ClassNameManager.getClassName('aclist')","});","","Plugin.AutoComplete     = ACListPlugin;","Plugin.AutoCompleteList = ACListPlugin;","","","}, '3.7.3', {\"requires\": [\"autocomplete-list\", \"node-pluginhost\"]});"];
_yuitest_coverage["build/autocomplete-plugin/autocomplete-plugin.js"].lines = {"1":0,"25":0,"27":0,"28":0,"31":0,"32":0,"35":0,"38":0,"44":0,"45":0};
_yuitest_coverage["build/autocomplete-plugin/autocomplete-plugin.js"].functions = {"ACListPlugin:27":0,"(anonymous 1):1":0};
_yuitest_coverage["build/autocomplete-plugin/autocomplete-plugin.js"].coveredLines = 10;
_yuitest_coverage["build/autocomplete-plugin/autocomplete-plugin.js"].coveredFunctions = 2;
_yuitest_coverline("build/autocomplete-plugin/autocomplete-plugin.js", 1);
YUI.add('autocomplete-plugin', function (Y, NAME) {

/**
Binds an AutoCompleteList instance to a Node instance.

@module autocomplete
@submodule autocomplete-plugin
**/

/**
Binds an AutoCompleteList instance to a Node instance.

@example

    Y.one('#my-input').plug(Y.Plugin.AutoComplete, {
        source: 'select * from search.suggest where query="{query}"'
    });

    // You can now access the AutoCompleteList instance at Y.one('#my-input').ac

@class Plugin.AutoComplete
@extends AutoCompleteList
**/

_yuitest_coverfunc("build/autocomplete-plugin/autocomplete-plugin.js", "(anonymous 1)", 1);
_yuitest_coverline("build/autocomplete-plugin/autocomplete-plugin.js", 25);
var Plugin = Y.Plugin;

_yuitest_coverline("build/autocomplete-plugin/autocomplete-plugin.js", 27);
function ACListPlugin(config) {
    _yuitest_coverfunc("build/autocomplete-plugin/autocomplete-plugin.js", "ACListPlugin", 27);
_yuitest_coverline("build/autocomplete-plugin/autocomplete-plugin.js", 28);
config.inputNode = config.host;

    // Render by default.
    _yuitest_coverline("build/autocomplete-plugin/autocomplete-plugin.js", 31);
if (!config.render && config.render !== false) {
      _yuitest_coverline("build/autocomplete-plugin/autocomplete-plugin.js", 32);
config.render = true;
    }

    _yuitest_coverline("build/autocomplete-plugin/autocomplete-plugin.js", 35);
ACListPlugin.superclass.constructor.apply(this, arguments);
}

_yuitest_coverline("build/autocomplete-plugin/autocomplete-plugin.js", 38);
Y.extend(ACListPlugin, Y.AutoCompleteList, {}, {
    NAME      : 'autocompleteListPlugin',
    NS        : 'ac',
    CSS_PREFIX: Y.ClassNameManager.getClassName('aclist')
});

_yuitest_coverline("build/autocomplete-plugin/autocomplete-plugin.js", 44);
Plugin.AutoComplete     = ACListPlugin;
_yuitest_coverline("build/autocomplete-plugin/autocomplete-plugin.js", 45);
Plugin.AutoCompleteList = ACListPlugin;


}, '3.7.3', {"requires": ["autocomplete-list", "node-pluginhost"]});
