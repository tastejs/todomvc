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
_yuitest_coverage["build/overlay/overlay.js"] = {
    lines: {},
    functions: {},
    coveredLines: 0,
    calledLines: 0,
    coveredFunctions: 0,
    calledFunctions: 0,
    path: "build/overlay/overlay.js",
    code: []
};
_yuitest_coverage["build/overlay/overlay.js"].code=["YUI.add('overlay', function (Y, NAME) {","","/**"," * Provides a basic Overlay widget, with Standard Module content support. The Overlay widget"," * provides Page XY positioning support, alignment and centering support along with basic "," * stackable support (z-index and shimming)."," *"," * @module overlay"," */","","/**"," * A basic Overlay Widget, which can be positioned based on Page XY co-ordinates and is stackable (z-index support)."," * It also provides alignment and centering support and uses a standard module format for it's content, with header,"," * body and footer section support."," *"," * @class Overlay"," * @constructor"," * @extends Widget"," * @uses WidgetStdMod"," * @uses WidgetPosition"," * @uses WidgetStack"," * @uses WidgetPositionAlign"," * @uses WidgetPositionConstrain"," * @param {Object} object The user configuration for the instance."," */","Y.Overlay = Y.Base.create(\"overlay\", Y.Widget, [Y.WidgetStdMod, Y.WidgetPosition, Y.WidgetStack, Y.WidgetPositionAlign, Y.WidgetPositionConstrain]);","","","}, '3.7.3', {\"requires\": [\"widget\", \"widget-stdmod\", \"widget-position\", \"widget-position-align\", \"widget-stack\", \"widget-position-constrain\"], \"skinnable\": true});"];
_yuitest_coverage["build/overlay/overlay.js"].lines = {"1":0,"26":0};
_yuitest_coverage["build/overlay/overlay.js"].functions = {"(anonymous 1):1":0};
_yuitest_coverage["build/overlay/overlay.js"].coveredLines = 2;
_yuitest_coverage["build/overlay/overlay.js"].coveredFunctions = 1;
_yuitest_coverline("build/overlay/overlay.js", 1);
YUI.add('overlay', function (Y, NAME) {

/**
 * Provides a basic Overlay widget, with Standard Module content support. The Overlay widget
 * provides Page XY positioning support, alignment and centering support along with basic 
 * stackable support (z-index and shimming).
 *
 * @module overlay
 */

/**
 * A basic Overlay Widget, which can be positioned based on Page XY co-ordinates and is stackable (z-index support).
 * It also provides alignment and centering support and uses a standard module format for it's content, with header,
 * body and footer section support.
 *
 * @class Overlay
 * @constructor
 * @extends Widget
 * @uses WidgetStdMod
 * @uses WidgetPosition
 * @uses WidgetStack
 * @uses WidgetPositionAlign
 * @uses WidgetPositionConstrain
 * @param {Object} object The user configuration for the instance.
 */
_yuitest_coverfunc("build/overlay/overlay.js", "(anonymous 1)", 1);
_yuitest_coverline("build/overlay/overlay.js", 26);
Y.Overlay = Y.Base.create("overlay", Y.Widget, [Y.WidgetStdMod, Y.WidgetPosition, Y.WidgetStack, Y.WidgetPositionAlign, Y.WidgetPositionConstrain]);


}, '3.7.3', {"requires": ["widget", "widget-stdmod", "widget-position", "widget-position-align", "widget-stack", "widget-position-constrain"], "skinnable": true});
