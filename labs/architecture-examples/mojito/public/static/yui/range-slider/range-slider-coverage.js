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
_yuitest_coverage["build/range-slider/range-slider.js"] = {
    lines: {},
    functions: {},
    coveredLines: 0,
    calledLines: 0,
    coveredFunctions: 0,
    calledFunctions: 0,
    path: "build/range-slider/range-slider.js",
    code: []
};
_yuitest_coverage["build/range-slider/range-slider.js"].code=["YUI.add('range-slider', function (Y, NAME) {","","/**"," * Create a sliding value range input visualized as a draggable thumb on a"," * background rail element."," * "," * @module slider"," * @main slider"," * @submodule range-slider"," */","","/**"," * Create a slider to represent an integer value between a given minimum and"," * maximum.  Sliders may be aligned vertically or horizontally, based on the"," * <code>axis</code> configuration."," *"," * @class Slider"," * @constructor"," * @extends SliderBase"," * @uses SliderValueRange"," * @uses ClickableRail"," * @param config {Object} Configuration object"," */","Y.Slider = Y.Base.build( 'slider', Y.SliderBase,","    [ Y.SliderValueRange, Y.ClickableRail ] );","","","}, '3.7.3', {\"requires\": [\"slider-base\", \"slider-value-range\", \"clickable-rail\"]});"];
_yuitest_coverage["build/range-slider/range-slider.js"].lines = {"1":0,"24":0};
_yuitest_coverage["build/range-slider/range-slider.js"].functions = {"(anonymous 1):1":0};
_yuitest_coverage["build/range-slider/range-slider.js"].coveredLines = 2;
_yuitest_coverage["build/range-slider/range-slider.js"].coveredFunctions = 1;
_yuitest_coverline("build/range-slider/range-slider.js", 1);
YUI.add('range-slider', function (Y, NAME) {

/**
 * Create a sliding value range input visualized as a draggable thumb on a
 * background rail element.
 * 
 * @module slider
 * @main slider
 * @submodule range-slider
 */

/**
 * Create a slider to represent an integer value between a given minimum and
 * maximum.  Sliders may be aligned vertically or horizontally, based on the
 * <code>axis</code> configuration.
 *
 * @class Slider
 * @constructor
 * @extends SliderBase
 * @uses SliderValueRange
 * @uses ClickableRail
 * @param config {Object} Configuration object
 */
_yuitest_coverfunc("build/range-slider/range-slider.js", "(anonymous 1)", 1);
_yuitest_coverline("build/range-slider/range-slider.js", 24);
Y.Slider = Y.Base.build( 'slider', Y.SliderBase,
    [ Y.SliderValueRange, Y.ClickableRail ] );


}, '3.7.3', {"requires": ["slider-base", "slider-value-range", "clickable-rail"]});
