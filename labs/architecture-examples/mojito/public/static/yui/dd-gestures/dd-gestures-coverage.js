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
_yuitest_coverage["build/dd-gestures/dd-gestures.js"] = {
    lines: {},
    functions: {},
    coveredLines: 0,
    calledLines: 0,
    coveredFunctions: 0,
    calledFunctions: 0,
    path: "build/dd-gestures/dd-gestures.js",
    code: []
};
_yuitest_coverage["build/dd-gestures/dd-gestures.js"].code=["YUI.add('dd-gestures', function (Y, NAME) {","","","    /**","    * This module is the conditional loaded `dd` module to support gesture events","    * in the event that `dd` is loaded onto a device that support touch based events.","    *","    * This module is loaded and over rides 2 key methods on `DD.Drag` and `DD.DDM` to","    * attach the gesture events. Overrides `DD.Drag._prep` and `DD.DDM._setupListeners`","    * methods as well as set's the property `DD.Drag.START_EVENT` to `gesturemovestart`","    * to enable gesture movement instead of mouse based movement.","    * @module dd","    * @submodule dd-gestures","    */","","    Y.DD.Drag.START_EVENT = 'gesturemovestart';","","    Y.DD.Drag.prototype._prep = function() {","        this._dragThreshMet = false;","        var node = this.get('node'), DDM = Y.DD.DDM;","","        node.addClass(DDM.CSS_PREFIX + '-draggable');","","        node.on(Y.DD.Drag.START_EVENT, Y.bind(this._handleMouseDownEvent, this), {","            minDistance: this.get('clickPixelThresh'),","            minTime: this.get('clickTimeThresh')","        });","","        node.on('gesturemoveend', Y.bind(this._handleMouseUp, this), { standAlone: true });","        node.on('dragstart', Y.bind(this._fixDragStart, this));","","    };","","    var _unprep = Y.DD.Drag.prototype._unprep;","","    Y.DD.Drag.prototype._unprep = function() {","        var node = this.get('node');","        _unprep.call(this);","        node.detachAll('gesturemoveend');","    };","","    Y.DD.DDM._setupListeners = function() {","        var DDM = Y.DD.DDM;","","        this._createPG();","        this._active = true;","        Y.one(Y.config.doc).on('gesturemove', Y.throttle(Y.bind(DDM._move, DDM), DDM.get('throttleTime')), { standAlone: true });","    };","","","","}, '3.7.3', {\"requires\": [\"dd-drag\", \"event-synthetic\", \"event-gestures\"]});"];
_yuitest_coverage["build/dd-gestures/dd-gestures.js"].lines = {"1":0,"16":0,"18":0,"19":0,"20":0,"22":0,"24":0,"29":0,"30":0,"34":0,"36":0,"37":0,"38":0,"39":0,"42":0,"43":0,"45":0,"46":0,"47":0};
_yuitest_coverage["build/dd-gestures/dd-gestures.js"].functions = {"_prep:18":0,"_unprep:36":0,"_setupListeners:42":0,"(anonymous 1):1":0};
_yuitest_coverage["build/dd-gestures/dd-gestures.js"].coveredLines = 19;
_yuitest_coverage["build/dd-gestures/dd-gestures.js"].coveredFunctions = 4;
_yuitest_coverline("build/dd-gestures/dd-gestures.js", 1);
YUI.add('dd-gestures', function (Y, NAME) {


    /**
    * This module is the conditional loaded `dd` module to support gesture events
    * in the event that `dd` is loaded onto a device that support touch based events.
    *
    * This module is loaded and over rides 2 key methods on `DD.Drag` and `DD.DDM` to
    * attach the gesture events. Overrides `DD.Drag._prep` and `DD.DDM._setupListeners`
    * methods as well as set's the property `DD.Drag.START_EVENT` to `gesturemovestart`
    * to enable gesture movement instead of mouse based movement.
    * @module dd
    * @submodule dd-gestures
    */

    _yuitest_coverfunc("build/dd-gestures/dd-gestures.js", "(anonymous 1)", 1);
_yuitest_coverline("build/dd-gestures/dd-gestures.js", 16);
Y.DD.Drag.START_EVENT = 'gesturemovestart';

    _yuitest_coverline("build/dd-gestures/dd-gestures.js", 18);
Y.DD.Drag.prototype._prep = function() {
        _yuitest_coverfunc("build/dd-gestures/dd-gestures.js", "_prep", 18);
_yuitest_coverline("build/dd-gestures/dd-gestures.js", 19);
this._dragThreshMet = false;
        _yuitest_coverline("build/dd-gestures/dd-gestures.js", 20);
var node = this.get('node'), DDM = Y.DD.DDM;

        _yuitest_coverline("build/dd-gestures/dd-gestures.js", 22);
node.addClass(DDM.CSS_PREFIX + '-draggable');

        _yuitest_coverline("build/dd-gestures/dd-gestures.js", 24);
node.on(Y.DD.Drag.START_EVENT, Y.bind(this._handleMouseDownEvent, this), {
            minDistance: this.get('clickPixelThresh'),
            minTime: this.get('clickTimeThresh')
        });

        _yuitest_coverline("build/dd-gestures/dd-gestures.js", 29);
node.on('gesturemoveend', Y.bind(this._handleMouseUp, this), { standAlone: true });
        _yuitest_coverline("build/dd-gestures/dd-gestures.js", 30);
node.on('dragstart', Y.bind(this._fixDragStart, this));

    };

    _yuitest_coverline("build/dd-gestures/dd-gestures.js", 34);
var _unprep = Y.DD.Drag.prototype._unprep;

    _yuitest_coverline("build/dd-gestures/dd-gestures.js", 36);
Y.DD.Drag.prototype._unprep = function() {
        _yuitest_coverfunc("build/dd-gestures/dd-gestures.js", "_unprep", 36);
_yuitest_coverline("build/dd-gestures/dd-gestures.js", 37);
var node = this.get('node');
        _yuitest_coverline("build/dd-gestures/dd-gestures.js", 38);
_unprep.call(this);
        _yuitest_coverline("build/dd-gestures/dd-gestures.js", 39);
node.detachAll('gesturemoveend');
    };

    _yuitest_coverline("build/dd-gestures/dd-gestures.js", 42);
Y.DD.DDM._setupListeners = function() {
        _yuitest_coverfunc("build/dd-gestures/dd-gestures.js", "_setupListeners", 42);
_yuitest_coverline("build/dd-gestures/dd-gestures.js", 43);
var DDM = Y.DD.DDM;

        _yuitest_coverline("build/dd-gestures/dd-gestures.js", 45);
this._createPG();
        _yuitest_coverline("build/dd-gestures/dd-gestures.js", 46);
this._active = true;
        _yuitest_coverline("build/dd-gestures/dd-gestures.js", 47);
Y.one(Y.config.doc).on('gesturemove', Y.throttle(Y.bind(DDM._move, DDM), DDM.get('throttleTime')), { standAlone: true });
    };



}, '3.7.3', {"requires": ["dd-drag", "event-synthetic", "event-gestures"]});
