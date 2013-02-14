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
_yuitest_coverage["build/widget-skin/widget-skin.js"] = {
    lines: {},
    functions: {},
    coveredLines: 0,
    calledLines: 0,
    coveredFunctions: 0,
    calledFunctions: 0,
    path: "build/widget-skin/widget-skin.js",
    code: []
};
_yuitest_coverage["build/widget-skin/widget-skin.js"].code=["YUI.add('widget-skin', function (Y, NAME) {","","/**"," * Provides skin related utlility methods."," *"," * @module widget"," * @submodule widget-skin"," */","","var BOUNDING_BOX = \"boundingBox\",","    CONTENT_BOX = \"contentBox\",","    SKIN = \"skin\",","    _getClassName = Y.ClassNameManager.getClassName;","","/**"," * Returns the name of the skin that's currently applied to the widget."," * This is only really useful after the widget's DOM structure is in the"," * document, either by render or by progressive enhancement.  Searches up"," * the Widget's ancestor axis for a class yui3-skin-(name), and returns the"," * (name) portion.  Otherwise, returns null."," *"," * @method getSkinName"," * @for Widget"," * @return {String} the name of the skin, or null (yui3-skin-sam => sam)"," */","","Y.Widget.prototype.getSkinName = function () {","    var root = this.get( CONTENT_BOX ) || this.get( BOUNDING_BOX ),","        search = new RegExp( '\\\\b' + _getClassName( SKIN ) + '-(\\\\S+)' ),","        match;","","    if ( root ) {","        root.ancestor( function ( node ) {","            match = node.get( 'className' ).match( search );","            return match;","        } );","    }","","    return ( match ) ? match[1] : null;","};","","","}, '3.7.3', {\"requires\": [\"widget-base\"]});"];
_yuitest_coverage["build/widget-skin/widget-skin.js"].lines = {"1":0,"10":0,"27":0,"28":0,"32":0,"33":0,"34":0,"35":0,"39":0};
_yuitest_coverage["build/widget-skin/widget-skin.js"].functions = {"(anonymous 2):33":0,"getSkinName:27":0,"(anonymous 1):1":0};
_yuitest_coverage["build/widget-skin/widget-skin.js"].coveredLines = 9;
_yuitest_coverage["build/widget-skin/widget-skin.js"].coveredFunctions = 3;
_yuitest_coverline("build/widget-skin/widget-skin.js", 1);
YUI.add('widget-skin', function (Y, NAME) {

/**
 * Provides skin related utlility methods.
 *
 * @module widget
 * @submodule widget-skin
 */

_yuitest_coverfunc("build/widget-skin/widget-skin.js", "(anonymous 1)", 1);
_yuitest_coverline("build/widget-skin/widget-skin.js", 10);
var BOUNDING_BOX = "boundingBox",
    CONTENT_BOX = "contentBox",
    SKIN = "skin",
    _getClassName = Y.ClassNameManager.getClassName;

/**
 * Returns the name of the skin that's currently applied to the widget.
 * This is only really useful after the widget's DOM structure is in the
 * document, either by render or by progressive enhancement.  Searches up
 * the Widget's ancestor axis for a class yui3-skin-(name), and returns the
 * (name) portion.  Otherwise, returns null.
 *
 * @method getSkinName
 * @for Widget
 * @return {String} the name of the skin, or null (yui3-skin-sam => sam)
 */

_yuitest_coverline("build/widget-skin/widget-skin.js", 27);
Y.Widget.prototype.getSkinName = function () {
    _yuitest_coverfunc("build/widget-skin/widget-skin.js", "getSkinName", 27);
_yuitest_coverline("build/widget-skin/widget-skin.js", 28);
var root = this.get( CONTENT_BOX ) || this.get( BOUNDING_BOX ),
        search = new RegExp( '\\b' + _getClassName( SKIN ) + '-(\\S+)' ),
        match;

    _yuitest_coverline("build/widget-skin/widget-skin.js", 32);
if ( root ) {
        _yuitest_coverline("build/widget-skin/widget-skin.js", 33);
root.ancestor( function ( node ) {
            _yuitest_coverfunc("build/widget-skin/widget-skin.js", "(anonymous 2)", 33);
_yuitest_coverline("build/widget-skin/widget-skin.js", 34);
match = node.get( 'className' ).match( search );
            _yuitest_coverline("build/widget-skin/widget-skin.js", 35);
return match;
        } );
    }

    _yuitest_coverline("build/widget-skin/widget-skin.js", 39);
return ( match ) ? match[1] : null;
};


}, '3.7.3', {"requires": ["widget-base"]});
