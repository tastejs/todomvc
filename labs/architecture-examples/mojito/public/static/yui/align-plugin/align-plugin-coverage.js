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
_yuitest_coverage["build/align-plugin/align-plugin.js"] = {
    lines: {},
    functions: {},
    coveredLines: 0,
    calledLines: 0,
    coveredFunctions: 0,
    calledFunctions: 0,
    path: "build/align-plugin/align-plugin.js",
    code: []
};
_yuitest_coverage["build/align-plugin/align-plugin.js"].code=["YUI.add('align-plugin', function (Y, NAME) {","","    /**","     * Provides advanced positioning support for Node via a Plugin","     * for centering and alignment. ","     * @module align-plugin","     */","","    var OFFSET_WIDTH = 'offsetWidth',","        OFFSET_HEIGHT = 'offsetHeight',","        undefined = undefined;","","    /**","     * Node plugin which can be used to align a node with another node,","     * region, or the viewport.","     *","     * @class Plugin.Align","     * @param {Object} User configuration object","     */","    function Align(config) {","        if (config.host) {","            this._host = config.host;","        }","    }","        ","    Align.prototype = {","        /**","         * Aligns node with a point on another node or region.","         * Possible alignment points are:","         * <dl>","         *      <dt>tl</dt>","         *      <dd>top left</dd>","         *      <dt>tr</dt>","         *      <dd>top right</dd>","         *      <dt>bl</dt>","         *      <dd>bottom left</dd>","         *      <dt>br</dt>","         *      <dd>bottom right</dd>","         *      <dt>tc</dt>","         *      <dd>top center</dd>","         *      <dt>bc</dt>","         *      <dd>bottom center</dd>","         *      <dt>rc</dt>","         *      <dd>right center</dd>","         *      <dt>lc</dt>","         *      <dd>left center</dd>","         *      <dt>cc</dt>","         *      <dd>center center</dd>","         * </dl>","         * @method to ","         * @param region {String || Node || HTMLElement || Object} The node or","         * region to align with. Defaults to the viewport region.","         * @param regionPoint {String} The point of the region to align with.","         * @param point {String} The point of the node aligned to the region. ","         * @param resize {Boolean} Whether or not the node should re-align when","         * the window is resized. Defaults to false.","         */","        to: function(region, regionPoint, point, syncOnResize) {","            // cache original args for syncing","            this._syncArgs = Y.Array(arguments);","","            if (region.top === undefined) {","                region = Y.one(region).get('region');","            }","","            if (region) {","                var xy = [region.left, region.top],","                    offxy = [region.width, region.height],","                    points = Align.points,","                    node = this._host,","                    NULL = null,","                    size = node.getAttrs([OFFSET_HEIGHT, OFFSET_WIDTH]),","                    nodeoff = [0 - size[OFFSET_WIDTH], 0 - size[OFFSET_HEIGHT]], // reverse offsets","                    regionFn0 = regionPoint ? points[regionPoint.charAt(0)]: NULL,","                    regionFn1 = (regionPoint && regionPoint !== 'cc') ? points[regionPoint.charAt(1)] : NULL,","                    nodeFn0 = point ? points[point.charAt(0)] : NULL,","                    nodeFn1 = (point && point !== 'cc') ? points[point.charAt(1)] : NULL;","","                if (regionFn0) {","                    xy = regionFn0(xy, offxy, regionPoint);","                }","                if (regionFn1) {","                    xy = regionFn1(xy, offxy, regionPoint);","                }","","                if (nodeFn0) {","                    xy = nodeFn0(xy, nodeoff, point);","                }","                if (nodeFn1) {","                    xy = nodeFn1(xy, nodeoff, point);","                }","","                if (xy && node) {","                    node.setXY(xy);","                }","                ","                this._resize(syncOnResize);","","            }","            return this;","        },","","        sync: function() {","            this.to.apply(this, this._syncArgs);","            return this;","        },","","        _resize: function(add) {","            var handle = this._handle;","            if (add && !handle) {","                this._handle = Y.on('resize', this._onresize, window, this);","            } else if (!add && handle) {","                handle.detach();","            }","","        },","","        _onresize: function() {","            var self = this;","            setTimeout(function() { // for performance","                self.sync();","            });","        },","    ","        /**","         * Aligns the center of a node to the center of another node or region.","         * @method center ","         * @param region {Node || HTMLElement || Object} optional The node or","         * region to align with. Defaults to the viewport region.","         * the window is resized. If centering to viewport, this defaults","         * to true, otherwise default is false.","         */","        center: function(region, resize) {","            this.to(region, 'cc', 'cc', resize); ","            return this;","        },","","        /**","         * Removes the resize handler, if any. This is called automatically","         * when unplugged from the host node.","         * @method destroy ","         */","        destroy: function() {","            var handle = this._handle;","            if (handle) {","                handle.detach();","            }","        }","    };","","    Align.points = {","        't': function(xy, off) {","            return xy;","        },","","        'r': function(xy, off) {","            return [xy[0] + off[0], xy[1]];","        },","","        'b': function(xy, off) {","            return [xy[0], xy[1] + off[1]];","        },","","        'l': function(xy, off) {","            return xy;","        },","","        'c': function(xy, off, point) {","            var axis = (point[0] === 't' || point[0] === 'b') ?  0 : 1,","                ret, val;","","            if (point === 'cc') {","                ret = [xy[0] + off[0] / 2, xy[1] + off[1] / 2];","            } else {","                val = xy[axis] + off[axis] / 2;","                ret = (axis) ? [xy[0], val] : [val, xy[1]];","            }","","             return ret;","        }","    };","","    Align.NAME = 'Align';","    Align.NS = 'align';","","    Align.prototype.constructor = Align;","","    Y.namespace('Plugin');","    Y.Plugin.Align = Align;","","","","}, '3.7.3', {\"requires\": [\"node-screen\", \"node-pluginhost\"]});"];
_yuitest_coverage["build/align-plugin/align-plugin.js"].lines = {"1":0,"9":0,"20":0,"21":0,"22":0,"26":0,"60":0,"62":0,"63":0,"66":0,"67":0,"79":0,"80":0,"82":0,"83":0,"86":0,"87":0,"89":0,"90":0,"93":0,"94":0,"97":0,"100":0,"104":0,"105":0,"109":0,"110":0,"111":0,"112":0,"113":0,"119":0,"120":0,"121":0,"134":0,"135":0,"144":0,"145":0,"146":0,"151":0,"153":0,"157":0,"161":0,"165":0,"169":0,"172":0,"173":0,"175":0,"176":0,"179":0,"183":0,"184":0,"186":0,"188":0,"189":0};
_yuitest_coverage["build/align-plugin/align-plugin.js"].functions = {"Align:20":0,"to:58":0,"sync:103":0,"_resize:108":0,"(anonymous 2):120":0,"_onresize:118":0,"center:133":0,"destroy:143":0,"\'t\':152":0,"\'r\':156":0,"\'b\':160":0,"\'l\':164":0,"\'c\':168":0,"(anonymous 1):1":0};
_yuitest_coverage["build/align-plugin/align-plugin.js"].coveredLines = 54;
_yuitest_coverage["build/align-plugin/align-plugin.js"].coveredFunctions = 14;
_yuitest_coverline("build/align-plugin/align-plugin.js", 1);
YUI.add('align-plugin', function (Y, NAME) {

    /**
     * Provides advanced positioning support for Node via a Plugin
     * for centering and alignment. 
     * @module align-plugin
     */

    _yuitest_coverfunc("build/align-plugin/align-plugin.js", "(anonymous 1)", 1);
_yuitest_coverline("build/align-plugin/align-plugin.js", 9);
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
    _yuitest_coverline("build/align-plugin/align-plugin.js", 20);
function Align(config) {
        _yuitest_coverfunc("build/align-plugin/align-plugin.js", "Align", 20);
_yuitest_coverline("build/align-plugin/align-plugin.js", 21);
if (config.host) {
            _yuitest_coverline("build/align-plugin/align-plugin.js", 22);
this._host = config.host;
        }
    }
        
    _yuitest_coverline("build/align-plugin/align-plugin.js", 26);
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
            _yuitest_coverfunc("build/align-plugin/align-plugin.js", "to", 58);
_yuitest_coverline("build/align-plugin/align-plugin.js", 60);
this._syncArgs = Y.Array(arguments);

            _yuitest_coverline("build/align-plugin/align-plugin.js", 62);
if (region.top === undefined) {
                _yuitest_coverline("build/align-plugin/align-plugin.js", 63);
region = Y.one(region).get('region');
            }

            _yuitest_coverline("build/align-plugin/align-plugin.js", 66);
if (region) {
                _yuitest_coverline("build/align-plugin/align-plugin.js", 67);
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

                _yuitest_coverline("build/align-plugin/align-plugin.js", 79);
if (regionFn0) {
                    _yuitest_coverline("build/align-plugin/align-plugin.js", 80);
xy = regionFn0(xy, offxy, regionPoint);
                }
                _yuitest_coverline("build/align-plugin/align-plugin.js", 82);
if (regionFn1) {
                    _yuitest_coverline("build/align-plugin/align-plugin.js", 83);
xy = regionFn1(xy, offxy, regionPoint);
                }

                _yuitest_coverline("build/align-plugin/align-plugin.js", 86);
if (nodeFn0) {
                    _yuitest_coverline("build/align-plugin/align-plugin.js", 87);
xy = nodeFn0(xy, nodeoff, point);
                }
                _yuitest_coverline("build/align-plugin/align-plugin.js", 89);
if (nodeFn1) {
                    _yuitest_coverline("build/align-plugin/align-plugin.js", 90);
xy = nodeFn1(xy, nodeoff, point);
                }

                _yuitest_coverline("build/align-plugin/align-plugin.js", 93);
if (xy && node) {
                    _yuitest_coverline("build/align-plugin/align-plugin.js", 94);
node.setXY(xy);
                }
                
                _yuitest_coverline("build/align-plugin/align-plugin.js", 97);
this._resize(syncOnResize);

            }
            _yuitest_coverline("build/align-plugin/align-plugin.js", 100);
return this;
        },

        sync: function() {
            _yuitest_coverfunc("build/align-plugin/align-plugin.js", "sync", 103);
_yuitest_coverline("build/align-plugin/align-plugin.js", 104);
this.to.apply(this, this._syncArgs);
            _yuitest_coverline("build/align-plugin/align-plugin.js", 105);
return this;
        },

        _resize: function(add) {
            _yuitest_coverfunc("build/align-plugin/align-plugin.js", "_resize", 108);
_yuitest_coverline("build/align-plugin/align-plugin.js", 109);
var handle = this._handle;
            _yuitest_coverline("build/align-plugin/align-plugin.js", 110);
if (add && !handle) {
                _yuitest_coverline("build/align-plugin/align-plugin.js", 111);
this._handle = Y.on('resize', this._onresize, window, this);
            } else {_yuitest_coverline("build/align-plugin/align-plugin.js", 112);
if (!add && handle) {
                _yuitest_coverline("build/align-plugin/align-plugin.js", 113);
handle.detach();
            }}

        },

        _onresize: function() {
            _yuitest_coverfunc("build/align-plugin/align-plugin.js", "_onresize", 118);
_yuitest_coverline("build/align-plugin/align-plugin.js", 119);
var self = this;
            _yuitest_coverline("build/align-plugin/align-plugin.js", 120);
setTimeout(function() { // for performance
                _yuitest_coverfunc("build/align-plugin/align-plugin.js", "(anonymous 2)", 120);
_yuitest_coverline("build/align-plugin/align-plugin.js", 121);
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
            _yuitest_coverfunc("build/align-plugin/align-plugin.js", "center", 133);
_yuitest_coverline("build/align-plugin/align-plugin.js", 134);
this.to(region, 'cc', 'cc', resize); 
            _yuitest_coverline("build/align-plugin/align-plugin.js", 135);
return this;
        },

        /**
         * Removes the resize handler, if any. This is called automatically
         * when unplugged from the host node.
         * @method destroy 
         */
        destroy: function() {
            _yuitest_coverfunc("build/align-plugin/align-plugin.js", "destroy", 143);
_yuitest_coverline("build/align-plugin/align-plugin.js", 144);
var handle = this._handle;
            _yuitest_coverline("build/align-plugin/align-plugin.js", 145);
if (handle) {
                _yuitest_coverline("build/align-plugin/align-plugin.js", 146);
handle.detach();
            }
        }
    };

    _yuitest_coverline("build/align-plugin/align-plugin.js", 151);
Align.points = {
        't': function(xy, off) {
            _yuitest_coverfunc("build/align-plugin/align-plugin.js", "\'t\'", 152);
_yuitest_coverline("build/align-plugin/align-plugin.js", 153);
return xy;
        },

        'r': function(xy, off) {
            _yuitest_coverfunc("build/align-plugin/align-plugin.js", "\'r\'", 156);
_yuitest_coverline("build/align-plugin/align-plugin.js", 157);
return [xy[0] + off[0], xy[1]];
        },

        'b': function(xy, off) {
            _yuitest_coverfunc("build/align-plugin/align-plugin.js", "\'b\'", 160);
_yuitest_coverline("build/align-plugin/align-plugin.js", 161);
return [xy[0], xy[1] + off[1]];
        },

        'l': function(xy, off) {
            _yuitest_coverfunc("build/align-plugin/align-plugin.js", "\'l\'", 164);
_yuitest_coverline("build/align-plugin/align-plugin.js", 165);
return xy;
        },

        'c': function(xy, off, point) {
            _yuitest_coverfunc("build/align-plugin/align-plugin.js", "\'c\'", 168);
_yuitest_coverline("build/align-plugin/align-plugin.js", 169);
var axis = (point[0] === 't' || point[0] === 'b') ?  0 : 1,
                ret, val;

            _yuitest_coverline("build/align-plugin/align-plugin.js", 172);
if (point === 'cc') {
                _yuitest_coverline("build/align-plugin/align-plugin.js", 173);
ret = [xy[0] + off[0] / 2, xy[1] + off[1] / 2];
            } else {
                _yuitest_coverline("build/align-plugin/align-plugin.js", 175);
val = xy[axis] + off[axis] / 2;
                _yuitest_coverline("build/align-plugin/align-plugin.js", 176);
ret = (axis) ? [xy[0], val] : [val, xy[1]];
            }

             _yuitest_coverline("build/align-plugin/align-plugin.js", 179);
return ret;
        }
    };

    _yuitest_coverline("build/align-plugin/align-plugin.js", 183);
Align.NAME = 'Align';
    _yuitest_coverline("build/align-plugin/align-plugin.js", 184);
Align.NS = 'align';

    _yuitest_coverline("build/align-plugin/align-plugin.js", 186);
Align.prototype.constructor = Align;

    _yuitest_coverline("build/align-plugin/align-plugin.js", 188);
Y.namespace('Plugin');
    _yuitest_coverline("build/align-plugin/align-plugin.js", 189);
Y.Plugin.Align = Align;



}, '3.7.3', {"requires": ["node-screen", "node-pluginhost"]});
