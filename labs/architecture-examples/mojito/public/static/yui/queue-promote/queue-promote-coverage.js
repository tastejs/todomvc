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
_yuitest_coverage["build/queue-promote/queue-promote.js"] = {
    lines: {},
    functions: {},
    coveredLines: 0,
    calledLines: 0,
    coveredFunctions: 0,
    calledFunctions: 0,
    path: "build/queue-promote/queue-promote.js",
    code: []
};
_yuitest_coverage["build/queue-promote/queue-promote.js"].code=["YUI.add('queue-promote', function (Y, NAME) {","","/**"," * Adds methods promote, remove, and indexOf to Queue instances."," *"," * @module queue-promote"," * @for Queue"," */","","Y.mix(Y.Queue.prototype, {","    /**","     * Returns the current index in the queue of the specified item","     * ","     * @method indexOf","     * @param needle {MIXED} the item to search for","     * @return {Number} the index of the item or -1 if not found","     */","    indexOf : function (callback) {","        return Y.Array.indexOf(this._q, callback);","    },","","    /**","     * Moves the referenced item to the head of the queue","     *","     * @method promote","     * @param item {MIXED} an item in the queue","     */","    promote : function (callback) {","        var index = this.indexOf(callback);","","        if (index > -1) {","            this._q.unshift(this._q.splice(index,1)[0]);","        }","    },","","    /**","     * Removes the referenced item from the queue","     *","     * @method remove","     * @param item {MIXED} an item in the queue","     */","    remove : function (callback) {","        var index = this.indexOf(callback);","","        if (index > -1) {","            this._q.splice(index,1);","        }","    }","","});","","","}, '3.7.3', {\"requires\": [\"yui-base\"]});"];
_yuitest_coverage["build/queue-promote/queue-promote.js"].lines = {"1":0,"10":0,"19":0,"29":0,"31":0,"32":0,"43":0,"45":0,"46":0};
_yuitest_coverage["build/queue-promote/queue-promote.js"].functions = {"indexOf:18":0,"promote:28":0,"remove:42":0,"(anonymous 1):1":0};
_yuitest_coverage["build/queue-promote/queue-promote.js"].coveredLines = 9;
_yuitest_coverage["build/queue-promote/queue-promote.js"].coveredFunctions = 4;
_yuitest_coverline("build/queue-promote/queue-promote.js", 1);
YUI.add('queue-promote', function (Y, NAME) {

/**
 * Adds methods promote, remove, and indexOf to Queue instances.
 *
 * @module queue-promote
 * @for Queue
 */

_yuitest_coverfunc("build/queue-promote/queue-promote.js", "(anonymous 1)", 1);
_yuitest_coverline("build/queue-promote/queue-promote.js", 10);
Y.mix(Y.Queue.prototype, {
    /**
     * Returns the current index in the queue of the specified item
     * 
     * @method indexOf
     * @param needle {MIXED} the item to search for
     * @return {Number} the index of the item or -1 if not found
     */
    indexOf : function (callback) {
        _yuitest_coverfunc("build/queue-promote/queue-promote.js", "indexOf", 18);
_yuitest_coverline("build/queue-promote/queue-promote.js", 19);
return Y.Array.indexOf(this._q, callback);
    },

    /**
     * Moves the referenced item to the head of the queue
     *
     * @method promote
     * @param item {MIXED} an item in the queue
     */
    promote : function (callback) {
        _yuitest_coverfunc("build/queue-promote/queue-promote.js", "promote", 28);
_yuitest_coverline("build/queue-promote/queue-promote.js", 29);
var index = this.indexOf(callback);

        _yuitest_coverline("build/queue-promote/queue-promote.js", 31);
if (index > -1) {
            _yuitest_coverline("build/queue-promote/queue-promote.js", 32);
this._q.unshift(this._q.splice(index,1)[0]);
        }
    },

    /**
     * Removes the referenced item from the queue
     *
     * @method remove
     * @param item {MIXED} an item in the queue
     */
    remove : function (callback) {
        _yuitest_coverfunc("build/queue-promote/queue-promote.js", "remove", 42);
_yuitest_coverline("build/queue-promote/queue-promote.js", 43);
var index = this.indexOf(callback);

        _yuitest_coverline("build/queue-promote/queue-promote.js", 45);
if (index > -1) {
            _yuitest_coverline("build/queue-promote/queue-promote.js", 46);
this._q.splice(index,1);
        }
    }

});


}, '3.7.3', {"requires": ["yui-base"]});
