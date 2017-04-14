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
_yuitest_coverage["build/graphics-vml-default/graphics-vml-default.js"] = {
    lines: {},
    functions: {},
    coveredLines: 0,
    calledLines: 0,
    coveredFunctions: 0,
    calledFunctions: 0,
    path: "build/graphics-vml-default/graphics-vml-default.js",
    code: []
};
_yuitest_coverage["build/graphics-vml-default/graphics-vml-default.js"].code=["YUI.add('graphics-vml-default', function (Y, NAME) {","","Y.Graphic = Y.VMLGraphic;","Y.Shape = Y.VMLShape;","Y.Circle = Y.VMLCircle;","Y.Rect = Y.VMLRect;","Y.Ellipse = Y.VMLEllipse;","Y.Path = Y.VMLPath;","Y.Drawing = Y.VMLDrawing;","","","}, '3.7.3');"];
_yuitest_coverage["build/graphics-vml-default/graphics-vml-default.js"].lines = {"1":0,"3":0,"4":0,"5":0,"6":0,"7":0,"8":0,"9":0};
_yuitest_coverage["build/graphics-vml-default/graphics-vml-default.js"].functions = {"(anonymous 1):1":0};
_yuitest_coverage["build/graphics-vml-default/graphics-vml-default.js"].coveredLines = 8;
_yuitest_coverage["build/graphics-vml-default/graphics-vml-default.js"].coveredFunctions = 1;
_yuitest_coverline("build/graphics-vml-default/graphics-vml-default.js", 1);
YUI.add('graphics-vml-default', function (Y, NAME) {

_yuitest_coverfunc("build/graphics-vml-default/graphics-vml-default.js", "(anonymous 1)", 1);
_yuitest_coverline("build/graphics-vml-default/graphics-vml-default.js", 3);
Y.Graphic = Y.VMLGraphic;
_yuitest_coverline("build/graphics-vml-default/graphics-vml-default.js", 4);
Y.Shape = Y.VMLShape;
_yuitest_coverline("build/graphics-vml-default/graphics-vml-default.js", 5);
Y.Circle = Y.VMLCircle;
_yuitest_coverline("build/graphics-vml-default/graphics-vml-default.js", 6);
Y.Rect = Y.VMLRect;
_yuitest_coverline("build/graphics-vml-default/graphics-vml-default.js", 7);
Y.Ellipse = Y.VMLEllipse;
_yuitest_coverline("build/graphics-vml-default/graphics-vml-default.js", 8);
Y.Path = Y.VMLPath;
_yuitest_coverline("build/graphics-vml-default/graphics-vml-default.js", 9);
Y.Drawing = Y.VMLDrawing;


}, '3.7.3');
