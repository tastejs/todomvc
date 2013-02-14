/*
YUI 3.7.3 (build 5687)
Copyright 2012 Yahoo! Inc. All rights reserved.
Licensed under the BSD License.
http://yuilibrary.com/license/
*/
YUI.add('widget-base-ie', function (Y, NAME) {

/**
 * IE specific support for the widget-base module.
 *
 * @module widget-base-ie
 */
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
Y.Widget.prototype._uiSizeCB = function(expand) {

    var bb = this.get(BOUNDING_BOX),
        cb = this.get(CONTENT_BOX),
        borderBoxSupported = this._bbs;

    if (borderBoxSupported === undefined) {
        this._bbs = borderBoxSupported = !(IE && IE < 8 && bb.get("ownerDocument").get("compatMode") != "BackCompat"); 
    }

    if (borderBoxSupported) {
        cb.toggleClass(contentExpanded, expand);
    } else {
        if (expand) {
            if (heightReallyMinHeight) {
                bb.addClass(bbTempExpanding);
            }

            cb.set(OFFSET_HEIGHT, bb.get(OFFSET_HEIGHT));

            if (heightReallyMinHeight) {
                bb.removeClass(bbTempExpanding);
            }
        } else {
            cb.setStyle(HEIGHT, EMPTY_STR);
        }
    }
};


}, '3.7.3', {"requires": ["widget-base"]});
