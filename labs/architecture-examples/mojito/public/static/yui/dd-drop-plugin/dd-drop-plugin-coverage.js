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
_yuitest_coverage["build/dd-drop-plugin/dd-drop-plugin.js"] = {
    lines: {},
    functions: {},
    coveredLines: 0,
    calledLines: 0,
    coveredFunctions: 0,
    calledFunctions: 0,
    path: "build/dd-drop-plugin/dd-drop-plugin.js",
    code: []
};
_yuitest_coverage["build/dd-drop-plugin/dd-drop-plugin.js"].code=["YUI.add('dd-drop-plugin', function (Y, NAME) {","","","       /**","        * Simple Drop plugin that can be attached to a Node via the plug method.","        * @module dd","        * @submodule dd-drop-plugin","        */","       /**","        * Simple Drop plugin that can be attached to a Node via the plug method.","        * @class Drop","        * @extends DD.Drop","        * @constructor","        * @namespace Plugin","        */","","","        var Drop = function(config) {","            config.node = config.host;","            Drop.superclass.constructor.apply(this, arguments);","        };","","        /**","        * @property NAME","        * @description dd-drop-plugin","        * @type {String}","        */","        Drop.NAME = \"dd-drop-plugin\";","        /**","        * @property NS","        * @description The Drop instance will be placed on the Node instance under the drop namespace. It can be accessed via Node.drop;","        * @type {String}","        */","        Drop.NS = \"drop\";","","","        Y.extend(Drop, Y.DD.Drop);","        Y.namespace('Plugin');","        Y.Plugin.Drop = Drop;","","","","","}, '3.7.3', {\"requires\": [\"dd-drop\"]});"];
_yuitest_coverage["build/dd-drop-plugin/dd-drop-plugin.js"].lines = {"1":0,"18":0,"19":0,"20":0,"28":0,"34":0,"37":0,"38":0,"39":0};
_yuitest_coverage["build/dd-drop-plugin/dd-drop-plugin.js"].functions = {"Drop:18":0,"(anonymous 1):1":0};
_yuitest_coverage["build/dd-drop-plugin/dd-drop-plugin.js"].coveredLines = 9;
_yuitest_coverage["build/dd-drop-plugin/dd-drop-plugin.js"].coveredFunctions = 2;
_yuitest_coverline("build/dd-drop-plugin/dd-drop-plugin.js", 1);
YUI.add('dd-drop-plugin', function (Y, NAME) {


       /**
        * Simple Drop plugin that can be attached to a Node via the plug method.
        * @module dd
        * @submodule dd-drop-plugin
        */
       /**
        * Simple Drop plugin that can be attached to a Node via the plug method.
        * @class Drop
        * @extends DD.Drop
        * @constructor
        * @namespace Plugin
        */


        _yuitest_coverfunc("build/dd-drop-plugin/dd-drop-plugin.js", "(anonymous 1)", 1);
_yuitest_coverline("build/dd-drop-plugin/dd-drop-plugin.js", 18);
var Drop = function(config) {
            _yuitest_coverfunc("build/dd-drop-plugin/dd-drop-plugin.js", "Drop", 18);
_yuitest_coverline("build/dd-drop-plugin/dd-drop-plugin.js", 19);
config.node = config.host;
            _yuitest_coverline("build/dd-drop-plugin/dd-drop-plugin.js", 20);
Drop.superclass.constructor.apply(this, arguments);
        };

        /**
        * @property NAME
        * @description dd-drop-plugin
        * @type {String}
        */
        _yuitest_coverline("build/dd-drop-plugin/dd-drop-plugin.js", 28);
Drop.NAME = "dd-drop-plugin";
        /**
        * @property NS
        * @description The Drop instance will be placed on the Node instance under the drop namespace. It can be accessed via Node.drop;
        * @type {String}
        */
        _yuitest_coverline("build/dd-drop-plugin/dd-drop-plugin.js", 34);
Drop.NS = "drop";


        _yuitest_coverline("build/dd-drop-plugin/dd-drop-plugin.js", 37);
Y.extend(Drop, Y.DD.Drop);
        _yuitest_coverline("build/dd-drop-plugin/dd-drop-plugin.js", 38);
Y.namespace('Plugin');
        _yuitest_coverline("build/dd-drop-plugin/dd-drop-plugin.js", 39);
Y.Plugin.Drop = Drop;




}, '3.7.3', {"requires": ["dd-drop"]});
