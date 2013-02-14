/*
YUI 3.7.3 (build 5687)
Copyright 2012 Yahoo! Inc. All rights reserved.
Licensed under the BSD License.
http://yuilibrary.com/license/
*/
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
function Pollable() {
    this._intervals = {};
}

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
        var x = Y.later(msec, this, this.sendRequest, [ request ], true);
        this._intervals[x.id] = x;
        // First call happens immediately, but async
        Y.later(0, this, this.sendRequest, [request]);
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
        id = key || id;
        if(this._intervals[id]) {
            // Clear the interval
            this._intervals[id].cancel();
            // Clear from tracker
            delete this._intervals[id];
        }
    },

    /**
     * Clears all intervals.
     *
     * @method clearAllIntervals
     */
    clearAllIntervals: function() {
        Y.each(this._intervals, this.clearInterval, this);
    }
};
    
Y.augment(Y.DataSource.Local, Pollable);


}, '3.7.3', {"requires": ["datasource-local"]});
