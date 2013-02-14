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
_yuitest_coverage["build/scrollview-base-ie/scrollview-base-ie.js"] = {
    lines: {},
    functions: {},
    coveredLines: 0,
    calledLines: 0,
    coveredFunctions: 0,
    calledFunctions: 0,
    path: "build/scrollview-base-ie/scrollview-base-ie.js",
    code: []
};
_yuitest_coverage["build/scrollview-base-ie/scrollview-base-ie.js"].code=["YUI.add('scrollview-base-ie', function (Y, NAME) {","","/**"," * IE specific support for the scrollview-base module."," *"," * @module scrollview-base-ie"," */","","Y.mix(Y.ScrollView.prototype, {","","    /**","     * Internal method to fix text selection in IE","     * ","     * @method _fixIESelect","     * @for ScrollView","     * @private","     * @param {Node} bb The bounding box","     * @param {Node} cb The content box","     */","    _fixIESelect : function(bb, cb) {","        this._cbDoc = cb.get(\"ownerDocument\");","        this._nativeBody = Y.Node.getDOMNode(Y.one(\"body\", this._cbDoc));","","        cb.on(\"mousedown\", function() {","            this._selectstart = this._nativeBody.onselectstart;","            this._nativeBody.onselectstart = this._iePreventSelect;","            this._cbDoc.once(\"mouseup\", this._ieRestoreSelect, this);","        }, this);","    },","","    /**","     * Native onselectstart handle to prevent selection in IE","     *","     * @method _iePreventSelect","     * @for ScrollView","     * @private","     */","    _iePreventSelect : function() {","        return false;","    },","","    /**","     * Restores native onselectstart handle, backed up to prevent selection in IE","     *","     * @method _ieRestoreSelect","     * @for ScrollView","     * @private","     */","    _ieRestoreSelect : function() {","        this._nativeBody.onselectstart = this._selectstart;","    }","}, true);","","}, '3.7.3', {\"requires\": [\"scrollview-base\"]});"];
_yuitest_coverage["build/scrollview-base-ie/scrollview-base-ie.js"].lines = {"1":0,"9":0,"21":0,"22":0,"24":0,"25":0,"26":0,"27":0,"39":0,"50":0};
_yuitest_coverage["build/scrollview-base-ie/scrollview-base-ie.js"].functions = {"(anonymous 2):24":0,"_fixIESelect:20":0,"_iePreventSelect:38":0,"_ieRestoreSelect:49":0,"(anonymous 1):1":0};
_yuitest_coverage["build/scrollview-base-ie/scrollview-base-ie.js"].coveredLines = 10;
_yuitest_coverage["build/scrollview-base-ie/scrollview-base-ie.js"].coveredFunctions = 5;
_yuitest_coverline("build/scrollview-base-ie/scrollview-base-ie.js", 1);
YUI.add('scrollview-base-ie', function (Y, NAME) {

/**
 * IE specific support for the scrollview-base module.
 *
 * @module scrollview-base-ie
 */

_yuitest_coverfunc("build/scrollview-base-ie/scrollview-base-ie.js", "(anonymous 1)", 1);
_yuitest_coverline("build/scrollview-base-ie/scrollview-base-ie.js", 9);
Y.mix(Y.ScrollView.prototype, {

    /**
     * Internal method to fix text selection in IE
     * 
     * @method _fixIESelect
     * @for ScrollView
     * @private
     * @param {Node} bb The bounding box
     * @param {Node} cb The content box
     */
    _fixIESelect : function(bb, cb) {
        _yuitest_coverfunc("build/scrollview-base-ie/scrollview-base-ie.js", "_fixIESelect", 20);
_yuitest_coverline("build/scrollview-base-ie/scrollview-base-ie.js", 21);
this._cbDoc = cb.get("ownerDocument");
        _yuitest_coverline("build/scrollview-base-ie/scrollview-base-ie.js", 22);
this._nativeBody = Y.Node.getDOMNode(Y.one("body", this._cbDoc));

        _yuitest_coverline("build/scrollview-base-ie/scrollview-base-ie.js", 24);
cb.on("mousedown", function() {
            _yuitest_coverfunc("build/scrollview-base-ie/scrollview-base-ie.js", "(anonymous 2)", 24);
_yuitest_coverline("build/scrollview-base-ie/scrollview-base-ie.js", 25);
this._selectstart = this._nativeBody.onselectstart;
            _yuitest_coverline("build/scrollview-base-ie/scrollview-base-ie.js", 26);
this._nativeBody.onselectstart = this._iePreventSelect;
            _yuitest_coverline("build/scrollview-base-ie/scrollview-base-ie.js", 27);
this._cbDoc.once("mouseup", this._ieRestoreSelect, this);
        }, this);
    },

    /**
     * Native onselectstart handle to prevent selection in IE
     *
     * @method _iePreventSelect
     * @for ScrollView
     * @private
     */
    _iePreventSelect : function() {
        _yuitest_coverfunc("build/scrollview-base-ie/scrollview-base-ie.js", "_iePreventSelect", 38);
_yuitest_coverline("build/scrollview-base-ie/scrollview-base-ie.js", 39);
return false;
    },

    /**
     * Restores native onselectstart handle, backed up to prevent selection in IE
     *
     * @method _ieRestoreSelect
     * @for ScrollView
     * @private
     */
    _ieRestoreSelect : function() {
        _yuitest_coverfunc("build/scrollview-base-ie/scrollview-base-ie.js", "_ieRestoreSelect", 49);
_yuitest_coverline("build/scrollview-base-ie/scrollview-base-ie.js", 50);
this._nativeBody.onselectstart = this._selectstart;
    }
}, true);

}, '3.7.3', {"requires": ["scrollview-base"]});
