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
_yuitest_coverage["build/scrollview/scrollview.js"] = {
    lines: {},
    functions: {},
    coveredLines: 0,
    calledLines: 0,
    coveredFunctions: 0,
    calledFunctions: 0,
    path: "build/scrollview/scrollview.js",
    code: []
};
_yuitest_coverage["build/scrollview/scrollview.js"].code=["YUI.add('scrollview', function (Y, NAME) {","","/**"," * <p>"," * The scrollview module does not add any new classes. It simply plugs the ScrollViewScrollbars plugin into the "," * base ScrollView class implementation provided by the scrollview-base module, so that all scrollview instances "," * have scrollbars enabled."," * </p>"," *"," * <ul>"," *     <li><a href=\"../classes/ScrollView.html\">ScrollView API documentation</a></li>"," *     <li><a href=\"scrollview-base.html\">scrollview-base Module documentation</a></li>"," * </ul>"," *"," * @module scrollview"," */","","Y.Base.plug(Y.ScrollView, Y.Plugin.ScrollViewScrollbars);","","","}, '3.7.3', {\"requires\": [\"scrollview-base\", \"scrollview-scrollbars\"]});"];
_yuitest_coverage["build/scrollview/scrollview.js"].lines = {"1":0,"18":0};
_yuitest_coverage["build/scrollview/scrollview.js"].functions = {"(anonymous 1):1":0};
_yuitest_coverage["build/scrollview/scrollview.js"].coveredLines = 2;
_yuitest_coverage["build/scrollview/scrollview.js"].coveredFunctions = 1;
_yuitest_coverline("build/scrollview/scrollview.js", 1);
YUI.add('scrollview', function (Y, NAME) {

/**
 * <p>
 * The scrollview module does not add any new classes. It simply plugs the ScrollViewScrollbars plugin into the 
 * base ScrollView class implementation provided by the scrollview-base module, so that all scrollview instances 
 * have scrollbars enabled.
 * </p>
 *
 * <ul>
 *     <li><a href="../classes/ScrollView.html">ScrollView API documentation</a></li>
 *     <li><a href="scrollview-base.html">scrollview-base Module documentation</a></li>
 * </ul>
 *
 * @module scrollview
 */

_yuitest_coverfunc("build/scrollview/scrollview.js", "(anonymous 1)", 1);
_yuitest_coverline("build/scrollview/scrollview.js", 18);
Y.Base.plug(Y.ScrollView, Y.Plugin.ScrollViewScrollbars);


}, '3.7.3', {"requires": ["scrollview-base", "scrollview-scrollbars"]});
