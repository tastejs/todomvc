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
_yuitest_coverage["build/charts/charts.js"] = {
    lines: {},
    functions: {},
    coveredLines: 0,
    calledLines: 0,
    coveredFunctions: 0,
    calledFunctions: 0,
    path: "build/charts/charts.js",
    code: []
};
_yuitest_coverage["build/charts/charts.js"].code=["YUI.add('charts', function (Y, NAME) {","","/**"," * The Chart class is the basic application used to create a chart."," *"," * @module charts"," * @class Chart"," * @constructor"," */","function Chart(cfg)","{","    if(cfg.type != \"pie\")","    {","        return new Y.CartesianChart(cfg);","    }","    else","    {","        return new Y.PieChart(cfg);","    }","}","Y.Chart = Chart;","","","}, '3.7.3', {\"requires\": [\"charts-base\"]});"];
_yuitest_coverage["build/charts/charts.js"].lines = {"1":0,"10":0,"12":0,"14":0,"18":0,"21":0};
_yuitest_coverage["build/charts/charts.js"].functions = {"Chart:10":0,"(anonymous 1):1":0};
_yuitest_coverage["build/charts/charts.js"].coveredLines = 6;
_yuitest_coverage["build/charts/charts.js"].coveredFunctions = 2;
_yuitest_coverline("build/charts/charts.js", 1);
YUI.add('charts', function (Y, NAME) {

/**
 * The Chart class is the basic application used to create a chart.
 *
 * @module charts
 * @class Chart
 * @constructor
 */
_yuitest_coverfunc("build/charts/charts.js", "(anonymous 1)", 1);
_yuitest_coverline("build/charts/charts.js", 10);
function Chart(cfg)
{
    _yuitest_coverfunc("build/charts/charts.js", "Chart", 10);
_yuitest_coverline("build/charts/charts.js", 12);
if(cfg.type != "pie")
    {
        _yuitest_coverline("build/charts/charts.js", 14);
return new Y.CartesianChart(cfg);
    }
    else
    {
        _yuitest_coverline("build/charts/charts.js", 18);
return new Y.PieChart(cfg);
    }
}
_yuitest_coverline("build/charts/charts.js", 21);
Y.Chart = Chart;


}, '3.7.3', {"requires": ["charts-base"]});
