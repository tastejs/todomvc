/*
YUI 3.7.3 (build 5687)
Copyright 2012 Yahoo! Inc. All rights reserved.
Licensed under the BSD License.
http://yuilibrary.com/license/
*/
YUI.add('scrollview-base-ie', function (Y, NAME) {

/**
 * IE specific support for the scrollview-base module.
 *
 * @module scrollview-base-ie
 */

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
        this._cbDoc = cb.get("ownerDocument");
        this._nativeBody = Y.Node.getDOMNode(Y.one("body", this._cbDoc));

        cb.on("mousedown", function() {
            this._selectstart = this._nativeBody.onselectstart;
            this._nativeBody.onselectstart = this._iePreventSelect;
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
        this._nativeBody.onselectstart = this._selectstart;
    }
}, true);

}, '3.7.3', {"requires": ["scrollview-base"]});
