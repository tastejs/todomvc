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
_yuitest_coverage["build/widget-base-ie/widget-base-ie.js"] = {
    lines: {},
    functions: {},
    coveredLines: 0,
    calledLines: 0,
    coveredFunctions: 0,
    calledFunctions: 0,
    path: "build/widget-base-ie/widget-base-ie.js",
    code: []
};
_yuitest_coverage["build/widget-base-ie/widget-base-ie.js"].code=["YUI.add('widget-base-ie', function (Y, NAME) {","","/**"," * IE specific support for the widget-base module."," *"," * @module widget-base-ie"," */","var BOUNDING_BOX = \"boundingBox\",","    CONTENT_BOX = \"contentBox\",","    HEIGHT = \"height\",","    OFFSET_HEIGHT = \"offsetHeight\",","    EMPTY_STR = \"\",","    IE = Y.UA.ie,","    heightReallyMinHeight = IE < 7,","    bbTempExpanding = Y.Widget.getClassName(\"tmp\", \"forcesize\"),","    contentExpanded = Y.Widget.getClassName(\"content\", \"expanded\");","","// TODO: Ideally we want to re-use the base _uiSizeCB impl","Y.Widget.prototype._uiSizeCB = function(expand) {","","    var bb = this.get(BOUNDING_BOX),","        cb = this.get(CONTENT_BOX),","        borderBoxSupported = this._bbs;","","    if (borderBoxSupported === undefined) {","        this._bbs = borderBoxSupported = !(IE && IE < 8 && bb.get(\"ownerDocument\").get(\"compatMode\") != \"BackCompat\"); ","    }","","    if (borderBoxSupported) {","        cb.toggleClass(contentExpanded, expand);","    } else {","        if (expand) {","            if (heightReallyMinHeight) {","                bb.addClass(bbTempExpanding);","            }","","            cb.set(OFFSET_HEIGHT, bb.get(OFFSET_HEIGHT));","","            if (heightReallyMinHeight) {","                bb.removeClass(bbTempExpanding);","            }","        } else {","            cb.setStyle(HEIGHT, EMPTY_STR);","        }","    }","};","","","}, '3.7.3', {\"requires\": [\"widget-base\"]});"];
_yuitest_coverage["build/widget-base-ie/widget-base-ie.js"].lines = {"1":0,"8":0,"19":0,"21":0,"25":0,"26":0,"29":0,"30":0,"32":0,"33":0,"34":0,"37":0,"39":0,"40":0,"43":0};
_yuitest_coverage["build/widget-base-ie/widget-base-ie.js"].functions = {"_uiSizeCB:19":0,"(anonymous 1):1":0};
_yuitest_coverage["build/widget-base-ie/widget-base-ie.js"].coveredLines = 15;
_yuitest_coverage["build/widget-base-ie/widget-base-ie.js"].coveredFunctions = 2;
_yuitest_coverline("build/widget-base-ie/widget-base-ie.js", 1);
YUI.add('widget-base-ie', function (Y, NAME) {

/**
 * IE specific support for the widget-base module.
 *
 * @module widget-base-ie
 */
_yuitest_coverfunc("build/widget-base-ie/widget-base-ie.js", "(anonymous 1)", 1);
_yuitest_coverline("build/widget-base-ie/widget-base-ie.js", 8);
var BOUNDING_BOX = "boundingBox",
    CONTENT_BOX = "contentBox",
    HEIGHT = "height",
    OFFSET_HEIGHT = "offsetHeight",
    EMPTY_STR = "",
    IE = Y.UA.ie,
    heightReallyMinHeight = IE < 7,
    bbTempExpanding = Y.Widget.getClassName("tmp", "forcesize"),
    contentExpanded = Y.Widget.getClassName("content", "expanded");

// TODO: Ideally we want to re-use the base _uiSizeCB impl
_yuitest_coverline("build/widget-base-ie/widget-base-ie.js", 19);
Y.Widget.prototype._uiSizeCB = function(expand) {

    _yuitest_coverfunc("build/widget-base-ie/widget-base-ie.js", "_uiSizeCB", 19);
_yuitest_coverline("build/widget-base-ie/widget-base-ie.js", 21);
var bb = this.get(BOUNDING_BOX),
        cb = this.get(CONTENT_BOX),
        borderBoxSupported = this._bbs;

    _yuitest_coverline("build/widget-base-ie/widget-base-ie.js", 25);
if (borderBoxSupported === undefined) {
        _yuitest_coverline("build/widget-base-ie/widget-base-ie.js", 26);
this._bbs = borderBoxSupported = !(IE && IE < 8 && bb.get("ownerDocument").get("compatMode") != "BackCompat"); 
    }

    _yuitest_coverline("build/widget-base-ie/widget-base-ie.js", 29);
if (borderBoxSupported) {
        _yuitest_coverline("build/widget-base-ie/widget-base-ie.js", 30);
cb.toggleClass(contentExpanded, expand);
    } else {
        _yuitest_coverline("build/widget-base-ie/widget-base-ie.js", 32);
if (expand) {
            _yuitest_coverline("build/widget-base-ie/widget-base-ie.js", 33);
if (heightReallyMinHeight) {
                _yuitest_coverline("build/widget-base-ie/widget-base-ie.js", 34);
bb.addClass(bbTempExpanding);
            }

            _yuitest_coverline("build/widget-base-ie/widget-base-ie.js", 37);
cb.set(OFFSET_HEIGHT, bb.get(OFFSET_HEIGHT));

            _yuitest_coverline("build/widget-base-ie/widget-base-ie.js", 39);
if (heightReallyMinHeight) {
                _yuitest_coverline("build/widget-base-ie/widget-base-ie.js", 40);
bb.removeClass(bbTempExpanding);
            }
        } else {
            _yuitest_coverline("build/widget-base-ie/widget-base-ie.js", 43);
cb.setStyle(HEIGHT, EMPTY_STR);
        }
    }
};


}, '3.7.3', {"requires": ["widget-base"]});
