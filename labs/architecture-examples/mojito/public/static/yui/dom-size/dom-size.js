/*
YUI 3.7.3 (build 5687)
Copyright 2012 Yahoo! Inc. All rights reserved.
Licensed under the BSD License.
http://yuilibrary.com/license/
*/
YUI.add('dom-size', function(Y) {

Y.mix(Y.DOM, {
    /**
     * Sets the width of the element to the given size, regardless
     * of box model, border, padding, etc.
     * @method setWidth
     * @param {HTMLElement} element The DOM element. 
     * @param {String|Int} size The pixel height to size to
     */

    setWidth: function(node, size) {
        Y.DOM._setSize(node, 'width', size);
    },

    /**
     * Sets the height of the element to the given size, regardless
     * of box model, border, padding, etc.
     * @method setHeight
     * @param {HTMLElement} element The DOM element. 
     * @param {String|Int} size The pixel height to size to
     */

    setHeight: function(node, size) {
        Y.DOM._setSize(node, 'height', size);
    },

    _setSize: function(node, prop, val) {
        val = (val > 0) ? val : 0;
        var size = 0;

        node.style[prop] = val + 'px';
        size = (prop === 'height') ? node.offsetHeight : node.offsetWidth;

        if (size > val) {
            val = val - (size - val);

            if (val < 0) {
                val = 0;
            }

            node.style[prop] = val + 'px';
        }
    }
});


}, '3.7.3' ,{requires:['dom-core']});
