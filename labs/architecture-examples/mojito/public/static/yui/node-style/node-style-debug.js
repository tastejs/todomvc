/*
YUI 3.7.3 (build 5687)
Copyright 2012 Yahoo! Inc. All rights reserved.
Licensed under the BSD License.
http://yuilibrary.com/license/
*/
YUI.add('node-style', function (Y, NAME) {

(function(Y) {
/**
 * Extended Node interface for managing node styles.
 * @module node
 * @submodule node-style
 */

Y.mix(Y.Node.prototype, {
    /**
     * Sets a style property of the node.
     * Use camelCase (e.g. 'backgroundColor') for multi-word properties.
     * @method setStyle
     * @param {String} attr The style attribute to set. 
     * @param {String|Number} val The value. 
     * @chainable
     */
    setStyle: function(attr, val) {
        Y.DOM.setStyle(this._node, attr, val);
        return this;
    },

    /**
     * Sets multiple style properties on the node.
     * Use camelCase (e.g. 'backgroundColor') for multi-word properties.
     * @method setStyles
     * @param {Object} hash An object literal of property:value pairs. 
     * @chainable
     */
    setStyles: function(hash) {
        Y.DOM.setStyles(this._node, hash);
        return this;
    },

    /**
     * Returns the style's current value.
     * Use camelCase (e.g. 'backgroundColor') for multi-word properties.
     * @method getStyle
     * @for Node
     * @param {String} attr The style attribute to retrieve. 
     * @return {String} The current value of the style property for the element.
     */

     getStyle: function(attr) {
        return Y.DOM.getStyle(this._node, attr);
     },

    /**
     * Returns the computed value for the given style property.
     * Use camelCase (e.g. 'backgroundColor') for multi-word properties.
     * @method getComputedStyle
     * @param {String} attr The style attribute to retrieve. 
     * @return {String} The computed value of the style property for the element.
     */
     getComputedStyle: function(attr) {
        return Y.DOM.getComputedStyle(this._node, attr);
     }
});

/**
 * Returns an array of values for each node.
 * Use camelCase (e.g. 'backgroundColor') for multi-word properties.
 * @method getStyle
 * @for NodeList
 * @see Node.getStyle
 * @param {String} attr The style attribute to retrieve. 
 * @return {Array} The current values of the style property for the element.
 */

/**
 * Returns an array of the computed value for each node.
 * Use camelCase (e.g. 'backgroundColor') for multi-word properties.
 * @method getComputedStyle
 * @see Node.getComputedStyle
 * @param {String} attr The style attribute to retrieve. 
 * @return {Array} The computed values for each node.
 */

/**
 * Sets a style property on each node.
 * Use camelCase (e.g. 'backgroundColor') for multi-word properties.
 * @method setStyle
 * @see Node.setStyle
 * @param {String} attr The style attribute to set. 
 * @param {String|Number} val The value. 
 * @chainable
 */

/**
 * Sets multiple style properties on each node.
 * Use camelCase (e.g. 'backgroundColor') for multi-word properties.
 * @method setStyles
 * @see Node.setStyles
 * @param {Object} hash An object literal of property:value pairs. 
 * @chainable
 */

// These are broken out to handle undefined return (avoid false positive for
// chainable)

Y.NodeList.importMethod(Y.Node.prototype, ['getStyle', 'getComputedStyle', 'setStyle', 'setStyles']);
})(Y);


}, '3.7.3', {"requires": ["dom-style", "node-base"]});
