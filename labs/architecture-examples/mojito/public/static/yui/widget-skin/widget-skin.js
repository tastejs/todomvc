/*
YUI 3.7.3 (build 5687)
Copyright 2012 Yahoo! Inc. All rights reserved.
Licensed under the BSD License.
http://yuilibrary.com/license/
*/
YUI.add('widget-skin', function (Y, NAME) {

/**
 * Provides skin related utlility methods.
 *
 * @module widget
 * @submodule widget-skin
 */

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

Y.Widget.prototype.getSkinName = function () {
    var root = this.get( CONTENT_BOX ) || this.get( BOUNDING_BOX ),
        search = new RegExp( '\\b' + _getClassName( SKIN ) + '-(\\S+)' ),
        match;

    if ( root ) {
        root.ancestor( function ( node ) {
            match = node.get( 'className' ).match( search );
            return match;
        } );
    }

    return ( match ) ? match[1] : null;
};


}, '3.7.3', {"requires": ["widget-base"]});
