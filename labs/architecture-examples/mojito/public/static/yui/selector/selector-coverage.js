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
_yuitest_coverage["build/selector/selector.js"] = {
    lines: {},
    functions: {},
    coveredLines: 0,
    calledLines: 0,
    coveredFunctions: 0,
    calledFunctions: 0,
    path: "build/selector/selector.js",
    code: []
};
_yuitest_coverage["build/selector/selector.js"].code=["YUI.add('selector', function (Y, NAME) {","","","","}, '3.7.3', {\"requires\": [\"selector-native\"]});"];
_yuitest_coverage["build/selector/selector.js"].lines = {"1":0};
_yuitest_coverage["build/selector/selector.js"].functions = {};
_yuitest_coverage["build/selector/selector.js"].coveredLines = 1;
_yuitest_coverage["build/selector/selector.js"].coveredFunctions = 0;
_yuitest_coverline("build/selector/selector.js", 1);
YUI.add('selector', function (Y, NAME) {



}, '3.7.3', {"requires": ["selector-native"]});
