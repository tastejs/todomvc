/*
YUI 3.7.3 (build 5687)
Copyright 2012 Yahoo! Inc. All rights reserved.
Licensed under the BSD License.
http://yuilibrary.com/license/
*/
YUI.add('align-plugin', function (Y, NAME) {

    /**
     * Provides advanced positioning support for Node via a Plugin
     * for centering and alignment. 
     * @module align-plugin
     */

    var OFFSET_WIDTH = 'offsetWidth',
        OFFSET_HEIGHT = 'offsetHeight',
        undefined = undefined;

    /**
     * Node plugin which can be used to align a node with another node,
     * region, or the viewport.
     *
     * @class Plugin.Align
     * @param {Object} User configuration object
     */
    function Align(config) {
        if (config.host) {
            this._host = config.host;
        }
    }
        
    Align.prototype = {
        /**
         * Aligns node with a point on another node or region.
         * Possible alignment points are:
         * <dl>
         *      <dt>tl</dt>
         *      <dd>top left</dd>
         *      <dt>tr</dt>
         *      <dd>top right</dd>
         *      <dt>bl</dt>
         *      <dd>bottom left</dd>
         *      <dt>br</dt>
         *      <dd>bottom right</dd>
         *      <dt>tc</dt>
         *      <dd>top center</dd>
         *      <dt>bc</dt>
         *      <dd>bottom center</dd>
         *      <dt>rc</dt>
         *      <dd>right center</dd>
         *      <dt>lc</dt>
         *      <dd>left center</dd>
         *      <dt>cc</dt>
         *      <dd>center center</dd>
         * </dl>
         * @method to 
         * @param region {String || Node || HTMLElement || Object} The node or
         * region to align with. Defaults to the viewport region.
         * @param regionPoint {String} The point of the region to align with.
         * @param point {String} The point of the node aligned to the region. 
         * @param resize {Boolean} Whether or not the node should re-align when
         * the window is resized. Defaults to false.
         */
        to: function(region, regionPoint, point, syncOnResize) {
            // cache original args for syncing
            this._syncArgs = Y.Array(arguments);

            if (region.top === undefined) {
                region = Y.one(region).get('region');
            }

            if (region) {
                var xy = [region.left, region.top],
                    offxy = [region.width, region.height],
                    points = Align.points,
                    node = this._host,
                    NULL = null,
                    size = node.getAttrs([OFFSET_HEIGHT, OFFSET_WIDTH]),
                    nodeoff = [0 - size[OFFSET_WIDTH], 0 - size[OFFSET_HEIGHT]], // reverse offsets
                    regionFn0 = regionPoint ? points[regionPoint.charAt(0)]: NULL,
                    regionFn1 = (regionPoint && regionPoint !== 'cc') ? points[regionPoint.charAt(1)] : NULL,
                    nodeFn0 = point ? points[point.charAt(0)] : NULL,
                    nodeFn1 = (point && point !== 'cc') ? points[point.charAt(1)] : NULL;

                if (regionFn0) {
                    xy = regionFn0(xy, offxy, regionPoint);
                }
                if (regionFn1) {
                    xy = regionFn1(xy, offxy, regionPoint);
                }

                if (nodeFn0) {
                    xy = nodeFn0(xy, nodeoff, point);
                }
                if (nodeFn1) {
                    xy = nodeFn1(xy, nodeoff, point);
                }

                if (xy && node) {
                    node.setXY(xy);
                }
                
                this._resize(syncOnResize);

            }
            return this;
        },

        sync: function() {
            this.to.apply(this, this._syncArgs);
            return this;
        },

        _resize: function(add) {
            var handle = this._handle;
            if (add && !handle) {
                this._handle = Y.on('resize', this._onresize, window, this);
            } else if (!add && handle) {
                handle.detach();
            }

        },

        _onresize: function() {
            var self = this;
            setTimeout(function() { // for performance
                self.sync();
            });
        },
    
        /**
         * Aligns the center of a node to the center of another node or region.
         * @method center 
         * @param region {Node || HTMLElement || Object} optional The node or
         * region to align with. Defaults to the viewport region.
         * the window is resized. If centering to viewport, this defaults
         * to true, otherwise default is false.
         */
        center: function(region, resize) {
            this.to(region, 'cc', 'cc', resize); 
            return this;
        },

        /**
         * Removes the resize handler, if any. This is called automatically
         * when unplugged from the host node.
         * @method destroy 
         */
        destroy: function() {
            var handle = this._handle;
            if (handle) {
                handle.detach();
            }
        }
    };

    Align.points = {
        't': function(xy, off) {
            return xy;
        },

        'r': function(xy, off) {
            return [xy[0] + off[0], xy[1]];
        },

        'b': function(xy, off) {
            return [xy[0], xy[1] + off[1]];
        },

        'l': function(xy, off) {
            return xy;
        },

        'c': function(xy, off, point) {
            var axis = (point[0] === 't' || point[0] === 'b') ?  0 : 1,
                ret, val;

            if (point === 'cc') {
                ret = [xy[0] + off[0] / 2, xy[1] + off[1] / 2];
            } else {
                val = xy[axis] + off[axis] / 2;
                ret = (axis) ? [xy[0], val] : [val, xy[1]];
            }

             return ret;
        }
    };

    Align.NAME = 'Align';
    Align.NS = 'align';

    Align.prototype.constructor = Align;

    Y.namespace('Plugin');
    Y.Plugin.Align = Align;



}, '3.7.3', {"requires": ["node-screen", "node-pluginhost"]});
