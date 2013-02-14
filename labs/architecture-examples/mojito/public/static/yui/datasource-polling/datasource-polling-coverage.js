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
_yuitest_coverage["build/datasource-polling/datasource-polling.js"] = {
    lines: {},
    functions: {},
    coveredLines: 0,
    calledLines: 0,
    coveredFunctions: 0,
    calledFunctions: 0,
    path: "build/datasource-polling/datasource-polling.js",
    code: []
};
_yuitest_coverage["build/datasource-polling/datasource-polling.js"].code=["YUI.add('datasource-polling', function (Y, NAME) {","","/**"," * Extends DataSource with polling functionality."," *"," * @module datasource"," * @submodule datasource-polling"," */","    ","/**"," * Adds polling to the DataSource Utility."," * @class Pollable"," * @extends DataSource.Local"," */    ","function Pollable() {","    this._intervals = {};","}","","Pollable.prototype = {","","    /**","    * @property _intervals","    * @description Hash of polling interval IDs that have been enabled,","    * stored here to be able to clear all intervals.","    * @private","    */","    _intervals: null,","","    /**","     * Sets up a polling mechanism to send requests at set intervals and","     * forward responses to given callback.","     *","     * @method setInterval","     * @param msec {Number} Length of interval in milliseconds.","     * @param [request] {Object} An object literal with the following properties:","     *     <dl>","     *     <dt><code>request</code></dt>","     *     <dd>The request to send to the live data source, if any.</dd>","     *     <dt><code>callback</code></dt>","     *     <dd>An object literal with the following properties:","     *         <dl>","     *         <dt><code>success</code></dt>","     *         <dd>The function to call when the data is ready.</dd>","     *         <dt><code>failure</code></dt>","     *         <dd>The function to call upon a response failure condition.</dd>","     *         <dt><code>argument</code></dt>","     *         <dd>Arbitrary data payload that will be passed back to the success and failure handlers.</dd>","     *         </dl>","     *     </dd>","     *     <dt><code>cfg</code></dt>","     *     <dd>Configuration object, if any.</dd>","     *     </dl>","     * @return {Number} Interval ID.","     */","    setInterval: function(msec, request) {","        var x = Y.later(msec, this, this.sendRequest, [ request ], true);","        this._intervals[x.id] = x;","        // First call happens immediately, but async","        Y.later(0, this, this.sendRequest, [request]);","        return x.id;","    },","","    /**","     * Disables polling mechanism associated with the given interval ID.","     *","     * @method clearInterval","     * @param id {Number} Interval ID.","     */","    clearInterval: function(id, key) {","        // In case of being called by clearAllIntervals()","        id = key || id;","        if(this._intervals[id]) {","            // Clear the interval","            this._intervals[id].cancel();","            // Clear from tracker","            delete this._intervals[id];","        }","    },","","    /**","     * Clears all intervals.","     *","     * @method clearAllIntervals","     */","    clearAllIntervals: function() {","        Y.each(this._intervals, this.clearInterval, this);","    }","};","    ","Y.augment(Y.DataSource.Local, Pollable);","","","}, '3.7.3', {\"requires\": [\"datasource-local\"]});"];
_yuitest_coverage["build/datasource-polling/datasource-polling.js"].lines = {"1":0,"15":0,"16":0,"19":0,"56":0,"57":0,"59":0,"60":0,"71":0,"72":0,"74":0,"76":0,"86":0,"90":0};
_yuitest_coverage["build/datasource-polling/datasource-polling.js"].functions = {"Pollable:15":0,"setInterval:55":0,"clearInterval:69":0,"clearAllIntervals:85":0,"(anonymous 1):1":0};
_yuitest_coverage["build/datasource-polling/datasource-polling.js"].coveredLines = 14;
_yuitest_coverage["build/datasource-polling/datasource-polling.js"].coveredFunctions = 5;
_yuitest_coverline("build/datasource-polling/datasource-polling.js", 1);
YUI.add('datasource-polling', function (Y, NAME) {

/**
 * Extends DataSource with polling functionality.
 *
 * @module datasource
 * @submodule datasource-polling
 */
    
/**
 * Adds polling to the DataSource Utility.
 * @class Pollable
 * @extends DataSource.Local
 */    
_yuitest_coverfunc("build/datasource-polling/datasource-polling.js", "(anonymous 1)", 1);
_yuitest_coverline("build/datasource-polling/datasource-polling.js", 15);
function Pollable() {
    _yuitest_coverfunc("build/datasource-polling/datasource-polling.js", "Pollable", 15);
_yuitest_coverline("build/datasource-polling/datasource-polling.js", 16);
this._intervals = {};
}

_yuitest_coverline("build/datasource-polling/datasource-polling.js", 19);
Pollable.prototype = {

    /**
    * @property _intervals
    * @description Hash of polling interval IDs that have been enabled,
    * stored here to be able to clear all intervals.
    * @private
    */
    _intervals: null,

    /**
     * Sets up a polling mechanism to send requests at set intervals and
     * forward responses to given callback.
     *
     * @method setInterval
     * @param msec {Number} Length of interval in milliseconds.
     * @param [request] {Object} An object literal with the following properties:
     *     <dl>
     *     <dt><code>request</code></dt>
     *     <dd>The request to send to the live data source, if any.</dd>
     *     <dt><code>callback</code></dt>
     *     <dd>An object literal with the following properties:
     *         <dl>
     *         <dt><code>success</code></dt>
     *         <dd>The function to call when the data is ready.</dd>
     *         <dt><code>failure</code></dt>
     *         <dd>The function to call upon a response failure condition.</dd>
     *         <dt><code>argument</code></dt>
     *         <dd>Arbitrary data payload that will be passed back to the success and failure handlers.</dd>
     *         </dl>
     *     </dd>
     *     <dt><code>cfg</code></dt>
     *     <dd>Configuration object, if any.</dd>
     *     </dl>
     * @return {Number} Interval ID.
     */
    setInterval: function(msec, request) {
        _yuitest_coverfunc("build/datasource-polling/datasource-polling.js", "setInterval", 55);
_yuitest_coverline("build/datasource-polling/datasource-polling.js", 56);
var x = Y.later(msec, this, this.sendRequest, [ request ], true);
        _yuitest_coverline("build/datasource-polling/datasource-polling.js", 57);
this._intervals[x.id] = x;
        // First call happens immediately, but async
        _yuitest_coverline("build/datasource-polling/datasource-polling.js", 59);
Y.later(0, this, this.sendRequest, [request]);
        _yuitest_coverline("build/datasource-polling/datasource-polling.js", 60);
return x.id;
    },

    /**
     * Disables polling mechanism associated with the given interval ID.
     *
     * @method clearInterval
     * @param id {Number} Interval ID.
     */
    clearInterval: function(id, key) {
        // In case of being called by clearAllIntervals()
        _yuitest_coverfunc("build/datasource-polling/datasource-polling.js", "clearInterval", 69);
_yuitest_coverline("build/datasource-polling/datasource-polling.js", 71);
id = key || id;
        _yuitest_coverline("build/datasource-polling/datasource-polling.js", 72);
if(this._intervals[id]) {
            // Clear the interval
            _yuitest_coverline("build/datasource-polling/datasource-polling.js", 74);
this._intervals[id].cancel();
            // Clear from tracker
            _yuitest_coverline("build/datasource-polling/datasource-polling.js", 76);
delete this._intervals[id];
        }
    },

    /**
     * Clears all intervals.
     *
     * @method clearAllIntervals
     */
    clearAllIntervals: function() {
        _yuitest_coverfunc("build/datasource-polling/datasource-polling.js", "clearAllIntervals", 85);
_yuitest_coverline("build/datasource-polling/datasource-polling.js", 86);
Y.each(this._intervals, this.clearInterval, this);
    }
};
    
_yuitest_coverline("build/datasource-polling/datasource-polling.js", 90);
Y.augment(Y.DataSource.Local, Pollable);


}, '3.7.3', {"requires": ["datasource-local"]});
