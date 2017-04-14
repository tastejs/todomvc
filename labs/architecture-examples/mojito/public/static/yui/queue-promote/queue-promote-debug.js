/*
YUI 3.7.3 (build 5687)
Copyright 2012 Yahoo! Inc. All rights reserved.
Licensed under the BSD License.
http://yuilibrary.com/license/
*/
YUI.add('queue-promote', function (Y, NAME) {

/**
 * Adds methods promote, remove, and indexOf to Queue instances.
 *
 * @module queue-promote
 * @for Queue
 */

Y.mix(Y.Queue.prototype, {
    /**
     * Returns the current index in the queue of the specified item
     * 
     * @method indexOf
     * @param needle {MIXED} the item to search for
     * @return {Number} the index of the item or -1 if not found
     */
    indexOf : function (callback) {
        return Y.Array.indexOf(this._q, callback);
    },

    /**
     * Moves the referenced item to the head of the queue
     *
     * @method promote
     * @param item {MIXED} an item in the queue
     */
    promote : function (callback) {
        var index = this.indexOf(callback);

        if (index > -1) {
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
        var index = this.indexOf(callback);

        if (index > -1) {
            this._q.splice(index,1);
        }
    }

});


}, '3.7.3', {"requires": ["yui-base"]});
