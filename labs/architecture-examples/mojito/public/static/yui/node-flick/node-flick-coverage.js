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
_yuitest_coverage["build/node-flick/node-flick.js"] = {
    lines: {},
    functions: {},
    coveredLines: 0,
    calledLines: 0,
    coveredFunctions: 0,
    calledFunctions: 0,
    path: "build/node-flick/node-flick.js",
    code: []
};
_yuitest_coverage["build/node-flick/node-flick.js"].code=["YUI.add('node-flick', function (Y, NAME) {","","/**"," * Provide a simple Flick plugin, which can be used along with the \"flick\" gesture event, to "," * animate the motion of the host node in response to a (mouse or touch) flick gesture. "," * "," * <p>The current implementation is designed to move the node, relative to the bounds of a parent node and is suitable"," * for scroll/carousel type implementations. Future versions will remove that constraint, to allow open ended movement within"," * the document.</p>"," *"," * @module node-flick"," */","","    var HOST = \"host\",","        PARENT_NODE = \"parentNode\",","        BOUNDING_BOX = \"boundingBox\",","        OFFSET_HEIGHT = \"offsetHeight\",","        OFFSET_WIDTH = \"offsetWidth\",","        SCROLL_HEIGHT = \"scrollHeight\",","        SCROLL_WIDTH = \"scrollWidth\",","        BOUNCE = \"bounce\",","        MIN_DISTANCE = \"minDistance\",","        MIN_VELOCITY = \"minVelocity\",","        BOUNCE_DISTANCE = \"bounceDistance\",","        DECELERATION = \"deceleration\",","        STEP = \"step\",","        DURATION = \"duration\",","        EASING = \"easing\",","        FLICK = \"flick\",","        ","        getClassName = Y.ClassNameManager.getClassName;","","    /**","     * A plugin class which can be used to animate the motion of a node, in response to a flick gesture.","     * ","     * @class Flick","     * @namespace Plugin","     * @param {Object} config The initial attribute values for the plugin","     */","    function Flick(config) {","        Flick.superclass.constructor.apply(this, arguments);","    }","","    Flick.ATTRS = {","","        /**","         * Drag coefficent for inertial scrolling. The closer to 1 this","         * value is, the less friction during scrolling.","         *","         * @attribute deceleration","         * @default 0.98","         */","        deceleration : {","            value: 0.98","        },","","        /**","         * Drag coefficient for intertial scrolling at the upper","         * and lower boundaries of the scrollview. Set to 0 to ","         * disable \"rubber-banding\".","         *","         * @attribute bounce","         * @type Number","         * @default 0.7","         */","        bounce : {","            value: 0.7","        },","","        /**","         * The bounce distance in pixels","         *","         * @attribute bounceDistance","         * @type Number","         * @default 150","         */","        bounceDistance : {","            value: 150","        },","","        /**","         * The minimum flick gesture velocity (px/ms) at which to trigger the flick response","         *","         * @attribute minVelocity","         * @type Number","         * @default 0","         */","        minVelocity : {","            value: 0","        },","","        /**","         * The minimum flick gesture distance (px) for which to trigger the flick response","         *","         * @attribute minVelocity","         * @type Number","         * @default 10","         */","        minDistance : {","            value: 10","        },","","        /**","         * The constraining box relative to which the flick animation and bounds should be calculated.","         *","         * @attribute boundingBox","         * @type Node","         * @default parentNode","         */","        boundingBox : {","            valueFn : function() {","                return this.get(HOST).get(PARENT_NODE);","            }","        },","","        /**","         * Time between flick animation frames.","         *","         * @attribute step","         * @type Number","         * @default 10","         */","        step : {","            value:10","        },","","        /**","         * The custom duration to apply to the flick animation. By default,","         * the animation duration is controlled by the deceleration factor.","         *","         * @attribute duration","         * @type Number","         * @default null","         */","        duration : {","            value:null","        },","","        /**","         * The custom transition easing to use for the flick animation. If not","         * provided defaults to internally to Flick.EASING, or Flick.SNAP_EASING based","         * on whether or not we're animating the flick or bounce step. ","         *","         * @attribute easing","         * @type String","         * @default null","         */","        easing : {","            value:null","        }","    };","","    /**","     * The NAME of the Flick class. Used to prefix events generated","     * by the plugin.","     *","     * @property NAME","     * @static","     * @type String","     * @default \"pluginFlick\"","     */","    Flick.NAME = \"pluginFlick\";","","    /**","     * The namespace for the plugin. This will be the property on the node, which will ","     * reference the plugin instance, when it's plugged in.","     *","     * @property NS","     * @static","     * @type String","     * @default \"flick\"","     */","    Flick.NS = \"flick\";","","    Y.extend(Flick, Y.Plugin.Base, {","","        /**","         * The initializer lifecycle implementation.","         *","         * @method initializer","         * @param {Object} config The user configuration for the plugin  ","         */","        initializer : function(config) {","            this._node = this.get(HOST);","","            this._renderClasses();","            this.setBounds();","","            this._node.on(FLICK, Y.bind(this._onFlick, this), {","                minDistance : this.get(MIN_DISTANCE),","                minVelocity : this.get(MIN_VELOCITY)","            });","        },","","        /**","         * Sets the min/max boundaries for the flick animation,","         * based on the boundingBox dimensions.","         * ","         * @method setBounds","         */","        setBounds : function () {","            var box = this.get(BOUNDING_BOX),","                node = this._node,","","                boxHeight = box.get(OFFSET_HEIGHT),","                boxWidth = box.get(OFFSET_WIDTH),","","                contentHeight = node.get(SCROLL_HEIGHT),","                contentWidth = node.get(SCROLL_WIDTH);","","            if (contentHeight > boxHeight) {","                this._maxY = contentHeight - boxHeight;","                this._minY = 0;","                this._scrollY = true;","            }","","            if (contentWidth > boxWidth) {","                this._maxX = contentWidth - boxWidth;","                this._minX = 0;","                this._scrollX = true;","            }","","            this._x = this._y = 0;","","            node.set(\"top\", this._y + \"px\");","            node.set(\"left\", this._x + \"px\");","        },","","        /**","         * Adds the CSS classes, necessary to set up overflow/position properties on the","         * node and boundingBox. ","         *","         * @method _renderClasses","         * @protected","         */","        _renderClasses : function() {","            this.get(BOUNDING_BOX).addClass(Flick.CLASS_NAMES.box);","            this._node.addClass(Flick.CLASS_NAMES.content);","        },","","        /**","         * The flick event listener. Kicks off the flick animation.","         *","         * @method _onFlick","         * @param e {EventFacade} The flick event facade, containing e.flick.distance, e.flick.velocity etc.","         * @protected","         */","        _onFlick: function(e) {","            this._v = e.flick.velocity;","            this._flick = true;","            this._flickAnim();","        },","","        /**","         * Executes a single frame in the flick animation","         *","         * @method _flickFrame","         * @protected","         */","        _flickAnim: function() {","","            var y = this._y,","                x = this._x,","","                maxY = this._maxY,","                minY = this._minY,","                maxX = this._maxX,","                minX = this._minX,","                velocity = this._v,","","                step = this.get(STEP),","                deceleration = this.get(DECELERATION),","                bounce = this.get(BOUNCE);","","            this._v = (velocity * deceleration);","","            this._snapToEdge = false;","","            if (this._scrollX) {","                x = x - (velocity * step);","            }","    ","            if (this._scrollY) {","                y = y - (velocity * step);","            }","","            if (Math.abs(velocity).toFixed(4) <= Flick.VELOCITY_THRESHOLD) {","","                this._flick = false;","","                this._killTimer(!(this._exceededYBoundary || this._exceededXBoundary));","","                if (this._scrollX) {","                    if (x < minX) {","                        this._snapToEdge = true;","                        this._setX(minX);","                    } else if (x > maxX) {","                        this._snapToEdge = true;","                        this._setX(maxX);","                    }","                }","","                if (this._scrollY) {","                    if (y < minY) {","                        this._snapToEdge = true;","                        this._setY(minY);","                    } else if (y > maxY) {","                        this._snapToEdge = true;","                        this._setY(maxY);","                    }","                }","","            } else {","","                if (this._scrollX && (x < minX || x > maxX)) {","                    this._exceededXBoundary = true;","                    this._v *= bounce;","                }","","                if (this._scrollY && (y < minY || y > maxY)) {","                    this._exceededYBoundary = true;","                    this._v *= bounce;","                }","","                if (this._scrollX) {","                    this._setX(x);","                }","","                if (this._scrollY) {","                    this._setY(y);","                }","","                this._flickTimer = Y.later(step, this, this._flickAnim);","            }","        },","","        /**","         * Internal utility method to set the X offset position","         *","         * @method _setX","         * @param {Number} val","         * @private","         */","        _setX : function(val) {","            this._move(val, null, this.get(DURATION), this.get(EASING));","        },","","        /**","         * Internal utility method to set the Y offset position","         * ","         * @method _setY","         * @param {Number} val","         * @private","         */","        _setY : function(val) {","            this._move(null, val, this.get(DURATION), this.get(EASING));","        },","","        /**","         * Internal utility method to move the node to a given XY position,","         * using transitions, if specified.","         *","         * @method _move","         * @param {Number} x The X offset position","         * @param {Number} y The Y offset position","         * @param {Number} duration The duration to use for the transition animation","         * @param {String} easing The easing to use for the transition animation.","         *","         * @private","         */","        _move: function(x, y, duration, easing) {","","            if (x !== null) {","                x = this._bounce(x);","            } else {","                x = this._x; ","            }","","            if (y !== null) {","                y = this._bounce(y);","            } else {","                y = this._y;","            }","","            duration = duration || this._snapToEdge ? Flick.SNAP_DURATION : 0;","            easing = easing || this._snapToEdge ? Flick.SNAP_EASING : Flick.EASING;","","            this._x = x;","            this._y = y;","","            this._anim(x, y, duration, easing);","        },","","        /**","         * Internal utility method to perform the transition step","         *","         * @method _anim","         * @param {Number} x The X offset position","         * @param {Number} y The Y offset position","         * @param {Number} duration The duration to use for the transition animation","         * @param {String} easing The easing to use for the transition animation.","         *","         * @private","         */","        _anim : function(x, y, duration, easing) {","            var xn = x * -1,","                yn = y * -1,","","                transition = {","                    duration : duration / 1000,","                    easing : easing","                };","","","            if (Y.Transition.useNative) {","                transition.transform = 'translate('+ (xn) + 'px,' + (yn) +'px)'; ","            } else {","                transition.left = xn + 'px';","                transition.top = yn + 'px';","            }","","            this._node.transition(transition);","        },","","        /**","         * Internal utility method to constrain the offset value","         * based on the bounce criteria. ","         *","         * @method _bounce","         * @param {Number} x The offset value to constrain.","         * @param {Number} max The max offset value.","         *","         * @private","         */","        _bounce : function(val, max) {","            var bounce = this.get(BOUNCE),","                dist = this.get(BOUNCE_DISTANCE),","                min = bounce ? -dist : 0;","","            max = bounce ? max + dist : max;","    ","            if(!bounce) {","                if(val < min) {","                    val = min;","                } else if(val > max) {","                    val = max;","                }            ","            }","            return val;","        },","","        /**","         * Stop the animation timer","         *","         * @method _killTimer","         * @private","         */","        _killTimer: function() {","            if(this._flickTimer) {","                this._flickTimer.cancel();","            }","        }","","    }, {","","        /**","         * The threshold used to determine when the decelerated velocity of the node","         * is practically 0.","         *","         * @property VELOCITY_THRESHOLD","         * @static","         * @type Number","         * @default 0.015","         */","        VELOCITY_THRESHOLD : 0.015,","","        /**","         * The duration to use for the bounce snap-back transition","         *","         * @property SNAP_DURATION","         * @static","         * @type Number","         * @default 400","         */","         SNAP_DURATION : 400,","        ","        /**","         * The default easing to use for the main flick movement transition","         *","         * @property EASING","         * @static","         * @type String","         * @default 'cubic-bezier(0, 0.1, 0, 1.0)'","         */","        EASING : 'cubic-bezier(0, 0.1, 0, 1.0)',","","        /**","         * The default easing to use for the bounce snap-back transition","         *","         * @property SNAP_EASING","         * @static","         * @type String","         * @default 'ease-out'","         */","        SNAP_EASING : 'ease-out',","","        /**","         * The default CSS class names used by the plugin","         *","         * @property CLASS_NAMES","         * @static","         * @type Object","         */","        CLASS_NAMES : {","            box: getClassName(Flick.NS),","            content: getClassName(Flick.NS, \"content\")","        }","    });","","    Y.Plugin.Flick = Flick;","","","}, '3.7.3', {\"requires\": [\"classnamemanager\", \"transition\", \"event-flick\", \"plugin\"], \"skinnable\": true});"];
_yuitest_coverage["build/node-flick/node-flick.js"].lines = {"1":0,"14":0,"40":0,"41":0,"44":0,"112":0,"162":0,"173":0,"175":0,"184":0,"186":0,"187":0,"189":0,"202":0,"211":0,"212":0,"213":0,"214":0,"217":0,"218":0,"219":0,"220":0,"223":0,"225":0,"226":0,"237":0,"238":0,"249":0,"250":0,"251":0,"262":0,"275":0,"277":0,"279":0,"280":0,"283":0,"284":0,"287":0,"289":0,"291":0,"293":0,"294":0,"295":0,"296":0,"297":0,"298":0,"299":0,"303":0,"304":0,"305":0,"306":0,"307":0,"308":0,"309":0,"315":0,"316":0,"317":0,"320":0,"321":0,"322":0,"325":0,"326":0,"329":0,"330":0,"333":0,"345":0,"356":0,"373":0,"374":0,"376":0,"379":0,"380":0,"382":0,"385":0,"386":0,"388":0,"389":0,"391":0,"406":0,"415":0,"416":0,"418":0,"419":0,"422":0,"436":0,"440":0,"442":0,"443":0,"444":0,"445":0,"446":0,"449":0,"459":0,"460":0,"520":0};
_yuitest_coverage["build/node-flick/node-flick.js"].functions = {"Flick:40":0,"valueFn:111":0,"initializer:183":0,"setBounds:201":0,"_renderClasses:236":0,"_onFlick:248":0,"_flickAnim:260":0,"_setX:344":0,"_setY:355":0,"_move:371":0,"_anim:405":0,"_bounce:435":0,"_killTimer:458":0,"(anonymous 1):1":0};
_yuitest_coverage["build/node-flick/node-flick.js"].coveredLines = 95;
_yuitest_coverage["build/node-flick/node-flick.js"].coveredFunctions = 14;
_yuitest_coverline("build/node-flick/node-flick.js", 1);
YUI.add('node-flick', function (Y, NAME) {

/**
 * Provide a simple Flick plugin, which can be used along with the "flick" gesture event, to 
 * animate the motion of the host node in response to a (mouse or touch) flick gesture. 
 * 
 * <p>The current implementation is designed to move the node, relative to the bounds of a parent node and is suitable
 * for scroll/carousel type implementations. Future versions will remove that constraint, to allow open ended movement within
 * the document.</p>
 *
 * @module node-flick
 */

    _yuitest_coverfunc("build/node-flick/node-flick.js", "(anonymous 1)", 1);
_yuitest_coverline("build/node-flick/node-flick.js", 14);
var HOST = "host",
        PARENT_NODE = "parentNode",
        BOUNDING_BOX = "boundingBox",
        OFFSET_HEIGHT = "offsetHeight",
        OFFSET_WIDTH = "offsetWidth",
        SCROLL_HEIGHT = "scrollHeight",
        SCROLL_WIDTH = "scrollWidth",
        BOUNCE = "bounce",
        MIN_DISTANCE = "minDistance",
        MIN_VELOCITY = "minVelocity",
        BOUNCE_DISTANCE = "bounceDistance",
        DECELERATION = "deceleration",
        STEP = "step",
        DURATION = "duration",
        EASING = "easing",
        FLICK = "flick",
        
        getClassName = Y.ClassNameManager.getClassName;

    /**
     * A plugin class which can be used to animate the motion of a node, in response to a flick gesture.
     * 
     * @class Flick
     * @namespace Plugin
     * @param {Object} config The initial attribute values for the plugin
     */
    _yuitest_coverline("build/node-flick/node-flick.js", 40);
function Flick(config) {
        _yuitest_coverfunc("build/node-flick/node-flick.js", "Flick", 40);
_yuitest_coverline("build/node-flick/node-flick.js", 41);
Flick.superclass.constructor.apply(this, arguments);
    }

    _yuitest_coverline("build/node-flick/node-flick.js", 44);
Flick.ATTRS = {

        /**
         * Drag coefficent for inertial scrolling. The closer to 1 this
         * value is, the less friction during scrolling.
         *
         * @attribute deceleration
         * @default 0.98
         */
        deceleration : {
            value: 0.98
        },

        /**
         * Drag coefficient for intertial scrolling at the upper
         * and lower boundaries of the scrollview. Set to 0 to 
         * disable "rubber-banding".
         *
         * @attribute bounce
         * @type Number
         * @default 0.7
         */
        bounce : {
            value: 0.7
        },

        /**
         * The bounce distance in pixels
         *
         * @attribute bounceDistance
         * @type Number
         * @default 150
         */
        bounceDistance : {
            value: 150
        },

        /**
         * The minimum flick gesture velocity (px/ms) at which to trigger the flick response
         *
         * @attribute minVelocity
         * @type Number
         * @default 0
         */
        minVelocity : {
            value: 0
        },

        /**
         * The minimum flick gesture distance (px) for which to trigger the flick response
         *
         * @attribute minVelocity
         * @type Number
         * @default 10
         */
        minDistance : {
            value: 10
        },

        /**
         * The constraining box relative to which the flick animation and bounds should be calculated.
         *
         * @attribute boundingBox
         * @type Node
         * @default parentNode
         */
        boundingBox : {
            valueFn : function() {
                _yuitest_coverfunc("build/node-flick/node-flick.js", "valueFn", 111);
_yuitest_coverline("build/node-flick/node-flick.js", 112);
return this.get(HOST).get(PARENT_NODE);
            }
        },

        /**
         * Time between flick animation frames.
         *
         * @attribute step
         * @type Number
         * @default 10
         */
        step : {
            value:10
        },

        /**
         * The custom duration to apply to the flick animation. By default,
         * the animation duration is controlled by the deceleration factor.
         *
         * @attribute duration
         * @type Number
         * @default null
         */
        duration : {
            value:null
        },

        /**
         * The custom transition easing to use for the flick animation. If not
         * provided defaults to internally to Flick.EASING, or Flick.SNAP_EASING based
         * on whether or not we're animating the flick or bounce step. 
         *
         * @attribute easing
         * @type String
         * @default null
         */
        easing : {
            value:null
        }
    };

    /**
     * The NAME of the Flick class. Used to prefix events generated
     * by the plugin.
     *
     * @property NAME
     * @static
     * @type String
     * @default "pluginFlick"
     */
    _yuitest_coverline("build/node-flick/node-flick.js", 162);
Flick.NAME = "pluginFlick";

    /**
     * The namespace for the plugin. This will be the property on the node, which will 
     * reference the plugin instance, when it's plugged in.
     *
     * @property NS
     * @static
     * @type String
     * @default "flick"
     */
    _yuitest_coverline("build/node-flick/node-flick.js", 173);
Flick.NS = "flick";

    _yuitest_coverline("build/node-flick/node-flick.js", 175);
Y.extend(Flick, Y.Plugin.Base, {

        /**
         * The initializer lifecycle implementation.
         *
         * @method initializer
         * @param {Object} config The user configuration for the plugin  
         */
        initializer : function(config) {
            _yuitest_coverfunc("build/node-flick/node-flick.js", "initializer", 183);
_yuitest_coverline("build/node-flick/node-flick.js", 184);
this._node = this.get(HOST);

            _yuitest_coverline("build/node-flick/node-flick.js", 186);
this._renderClasses();
            _yuitest_coverline("build/node-flick/node-flick.js", 187);
this.setBounds();

            _yuitest_coverline("build/node-flick/node-flick.js", 189);
this._node.on(FLICK, Y.bind(this._onFlick, this), {
                minDistance : this.get(MIN_DISTANCE),
                minVelocity : this.get(MIN_VELOCITY)
            });
        },

        /**
         * Sets the min/max boundaries for the flick animation,
         * based on the boundingBox dimensions.
         * 
         * @method setBounds
         */
        setBounds : function () {
            _yuitest_coverfunc("build/node-flick/node-flick.js", "setBounds", 201);
_yuitest_coverline("build/node-flick/node-flick.js", 202);
var box = this.get(BOUNDING_BOX),
                node = this._node,

                boxHeight = box.get(OFFSET_HEIGHT),
                boxWidth = box.get(OFFSET_WIDTH),

                contentHeight = node.get(SCROLL_HEIGHT),
                contentWidth = node.get(SCROLL_WIDTH);

            _yuitest_coverline("build/node-flick/node-flick.js", 211);
if (contentHeight > boxHeight) {
                _yuitest_coverline("build/node-flick/node-flick.js", 212);
this._maxY = contentHeight - boxHeight;
                _yuitest_coverline("build/node-flick/node-flick.js", 213);
this._minY = 0;
                _yuitest_coverline("build/node-flick/node-flick.js", 214);
this._scrollY = true;
            }

            _yuitest_coverline("build/node-flick/node-flick.js", 217);
if (contentWidth > boxWidth) {
                _yuitest_coverline("build/node-flick/node-flick.js", 218);
this._maxX = contentWidth - boxWidth;
                _yuitest_coverline("build/node-flick/node-flick.js", 219);
this._minX = 0;
                _yuitest_coverline("build/node-flick/node-flick.js", 220);
this._scrollX = true;
            }

            _yuitest_coverline("build/node-flick/node-flick.js", 223);
this._x = this._y = 0;

            _yuitest_coverline("build/node-flick/node-flick.js", 225);
node.set("top", this._y + "px");
            _yuitest_coverline("build/node-flick/node-flick.js", 226);
node.set("left", this._x + "px");
        },

        /**
         * Adds the CSS classes, necessary to set up overflow/position properties on the
         * node and boundingBox. 
         *
         * @method _renderClasses
         * @protected
         */
        _renderClasses : function() {
            _yuitest_coverfunc("build/node-flick/node-flick.js", "_renderClasses", 236);
_yuitest_coverline("build/node-flick/node-flick.js", 237);
this.get(BOUNDING_BOX).addClass(Flick.CLASS_NAMES.box);
            _yuitest_coverline("build/node-flick/node-flick.js", 238);
this._node.addClass(Flick.CLASS_NAMES.content);
        },

        /**
         * The flick event listener. Kicks off the flick animation.
         *
         * @method _onFlick
         * @param e {EventFacade} The flick event facade, containing e.flick.distance, e.flick.velocity etc.
         * @protected
         */
        _onFlick: function(e) {
            _yuitest_coverfunc("build/node-flick/node-flick.js", "_onFlick", 248);
_yuitest_coverline("build/node-flick/node-flick.js", 249);
this._v = e.flick.velocity;
            _yuitest_coverline("build/node-flick/node-flick.js", 250);
this._flick = true;
            _yuitest_coverline("build/node-flick/node-flick.js", 251);
this._flickAnim();
        },

        /**
         * Executes a single frame in the flick animation
         *
         * @method _flickFrame
         * @protected
         */
        _flickAnim: function() {

            _yuitest_coverfunc("build/node-flick/node-flick.js", "_flickAnim", 260);
_yuitest_coverline("build/node-flick/node-flick.js", 262);
var y = this._y,
                x = this._x,

                maxY = this._maxY,
                minY = this._minY,
                maxX = this._maxX,
                minX = this._minX,
                velocity = this._v,

                step = this.get(STEP),
                deceleration = this.get(DECELERATION),
                bounce = this.get(BOUNCE);

            _yuitest_coverline("build/node-flick/node-flick.js", 275);
this._v = (velocity * deceleration);

            _yuitest_coverline("build/node-flick/node-flick.js", 277);
this._snapToEdge = false;

            _yuitest_coverline("build/node-flick/node-flick.js", 279);
if (this._scrollX) {
                _yuitest_coverline("build/node-flick/node-flick.js", 280);
x = x - (velocity * step);
            }
    
            _yuitest_coverline("build/node-flick/node-flick.js", 283);
if (this._scrollY) {
                _yuitest_coverline("build/node-flick/node-flick.js", 284);
y = y - (velocity * step);
            }

            _yuitest_coverline("build/node-flick/node-flick.js", 287);
if (Math.abs(velocity).toFixed(4) <= Flick.VELOCITY_THRESHOLD) {

                _yuitest_coverline("build/node-flick/node-flick.js", 289);
this._flick = false;

                _yuitest_coverline("build/node-flick/node-flick.js", 291);
this._killTimer(!(this._exceededYBoundary || this._exceededXBoundary));

                _yuitest_coverline("build/node-flick/node-flick.js", 293);
if (this._scrollX) {
                    _yuitest_coverline("build/node-flick/node-flick.js", 294);
if (x < minX) {
                        _yuitest_coverline("build/node-flick/node-flick.js", 295);
this._snapToEdge = true;
                        _yuitest_coverline("build/node-flick/node-flick.js", 296);
this._setX(minX);
                    } else {_yuitest_coverline("build/node-flick/node-flick.js", 297);
if (x > maxX) {
                        _yuitest_coverline("build/node-flick/node-flick.js", 298);
this._snapToEdge = true;
                        _yuitest_coverline("build/node-flick/node-flick.js", 299);
this._setX(maxX);
                    }}
                }

                _yuitest_coverline("build/node-flick/node-flick.js", 303);
if (this._scrollY) {
                    _yuitest_coverline("build/node-flick/node-flick.js", 304);
if (y < minY) {
                        _yuitest_coverline("build/node-flick/node-flick.js", 305);
this._snapToEdge = true;
                        _yuitest_coverline("build/node-flick/node-flick.js", 306);
this._setY(minY);
                    } else {_yuitest_coverline("build/node-flick/node-flick.js", 307);
if (y > maxY) {
                        _yuitest_coverline("build/node-flick/node-flick.js", 308);
this._snapToEdge = true;
                        _yuitest_coverline("build/node-flick/node-flick.js", 309);
this._setY(maxY);
                    }}
                }

            } else {

                _yuitest_coverline("build/node-flick/node-flick.js", 315);
if (this._scrollX && (x < minX || x > maxX)) {
                    _yuitest_coverline("build/node-flick/node-flick.js", 316);
this._exceededXBoundary = true;
                    _yuitest_coverline("build/node-flick/node-flick.js", 317);
this._v *= bounce;
                }

                _yuitest_coverline("build/node-flick/node-flick.js", 320);
if (this._scrollY && (y < minY || y > maxY)) {
                    _yuitest_coverline("build/node-flick/node-flick.js", 321);
this._exceededYBoundary = true;
                    _yuitest_coverline("build/node-flick/node-flick.js", 322);
this._v *= bounce;
                }

                _yuitest_coverline("build/node-flick/node-flick.js", 325);
if (this._scrollX) {
                    _yuitest_coverline("build/node-flick/node-flick.js", 326);
this._setX(x);
                }

                _yuitest_coverline("build/node-flick/node-flick.js", 329);
if (this._scrollY) {
                    _yuitest_coverline("build/node-flick/node-flick.js", 330);
this._setY(y);
                }

                _yuitest_coverline("build/node-flick/node-flick.js", 333);
this._flickTimer = Y.later(step, this, this._flickAnim);
            }
        },

        /**
         * Internal utility method to set the X offset position
         *
         * @method _setX
         * @param {Number} val
         * @private
         */
        _setX : function(val) {
            _yuitest_coverfunc("build/node-flick/node-flick.js", "_setX", 344);
_yuitest_coverline("build/node-flick/node-flick.js", 345);
this._move(val, null, this.get(DURATION), this.get(EASING));
        },

        /**
         * Internal utility method to set the Y offset position
         * 
         * @method _setY
         * @param {Number} val
         * @private
         */
        _setY : function(val) {
            _yuitest_coverfunc("build/node-flick/node-flick.js", "_setY", 355);
_yuitest_coverline("build/node-flick/node-flick.js", 356);
this._move(null, val, this.get(DURATION), this.get(EASING));
        },

        /**
         * Internal utility method to move the node to a given XY position,
         * using transitions, if specified.
         *
         * @method _move
         * @param {Number} x The X offset position
         * @param {Number} y The Y offset position
         * @param {Number} duration The duration to use for the transition animation
         * @param {String} easing The easing to use for the transition animation.
         *
         * @private
         */
        _move: function(x, y, duration, easing) {

            _yuitest_coverfunc("build/node-flick/node-flick.js", "_move", 371);
_yuitest_coverline("build/node-flick/node-flick.js", 373);
if (x !== null) {
                _yuitest_coverline("build/node-flick/node-flick.js", 374);
x = this._bounce(x);
            } else {
                _yuitest_coverline("build/node-flick/node-flick.js", 376);
x = this._x; 
            }

            _yuitest_coverline("build/node-flick/node-flick.js", 379);
if (y !== null) {
                _yuitest_coverline("build/node-flick/node-flick.js", 380);
y = this._bounce(y);
            } else {
                _yuitest_coverline("build/node-flick/node-flick.js", 382);
y = this._y;
            }

            _yuitest_coverline("build/node-flick/node-flick.js", 385);
duration = duration || this._snapToEdge ? Flick.SNAP_DURATION : 0;
            _yuitest_coverline("build/node-flick/node-flick.js", 386);
easing = easing || this._snapToEdge ? Flick.SNAP_EASING : Flick.EASING;

            _yuitest_coverline("build/node-flick/node-flick.js", 388);
this._x = x;
            _yuitest_coverline("build/node-flick/node-flick.js", 389);
this._y = y;

            _yuitest_coverline("build/node-flick/node-flick.js", 391);
this._anim(x, y, duration, easing);
        },

        /**
         * Internal utility method to perform the transition step
         *
         * @method _anim
         * @param {Number} x The X offset position
         * @param {Number} y The Y offset position
         * @param {Number} duration The duration to use for the transition animation
         * @param {String} easing The easing to use for the transition animation.
         *
         * @private
         */
        _anim : function(x, y, duration, easing) {
            _yuitest_coverfunc("build/node-flick/node-flick.js", "_anim", 405);
_yuitest_coverline("build/node-flick/node-flick.js", 406);
var xn = x * -1,
                yn = y * -1,

                transition = {
                    duration : duration / 1000,
                    easing : easing
                };


            _yuitest_coverline("build/node-flick/node-flick.js", 415);
if (Y.Transition.useNative) {
                _yuitest_coverline("build/node-flick/node-flick.js", 416);
transition.transform = 'translate('+ (xn) + 'px,' + (yn) +'px)'; 
            } else {
                _yuitest_coverline("build/node-flick/node-flick.js", 418);
transition.left = xn + 'px';
                _yuitest_coverline("build/node-flick/node-flick.js", 419);
transition.top = yn + 'px';
            }

            _yuitest_coverline("build/node-flick/node-flick.js", 422);
this._node.transition(transition);
        },

        /**
         * Internal utility method to constrain the offset value
         * based on the bounce criteria. 
         *
         * @method _bounce
         * @param {Number} x The offset value to constrain.
         * @param {Number} max The max offset value.
         *
         * @private
         */
        _bounce : function(val, max) {
            _yuitest_coverfunc("build/node-flick/node-flick.js", "_bounce", 435);
_yuitest_coverline("build/node-flick/node-flick.js", 436);
var bounce = this.get(BOUNCE),
                dist = this.get(BOUNCE_DISTANCE),
                min = bounce ? -dist : 0;

            _yuitest_coverline("build/node-flick/node-flick.js", 440);
max = bounce ? max + dist : max;
    
            _yuitest_coverline("build/node-flick/node-flick.js", 442);
if(!bounce) {
                _yuitest_coverline("build/node-flick/node-flick.js", 443);
if(val < min) {
                    _yuitest_coverline("build/node-flick/node-flick.js", 444);
val = min;
                } else {_yuitest_coverline("build/node-flick/node-flick.js", 445);
if(val > max) {
                    _yuitest_coverline("build/node-flick/node-flick.js", 446);
val = max;
                }}            
            }
            _yuitest_coverline("build/node-flick/node-flick.js", 449);
return val;
        },

        /**
         * Stop the animation timer
         *
         * @method _killTimer
         * @private
         */
        _killTimer: function() {
            _yuitest_coverfunc("build/node-flick/node-flick.js", "_killTimer", 458);
_yuitest_coverline("build/node-flick/node-flick.js", 459);
if(this._flickTimer) {
                _yuitest_coverline("build/node-flick/node-flick.js", 460);
this._flickTimer.cancel();
            }
        }

    }, {

        /**
         * The threshold used to determine when the decelerated velocity of the node
         * is practically 0.
         *
         * @property VELOCITY_THRESHOLD
         * @static
         * @type Number
         * @default 0.015
         */
        VELOCITY_THRESHOLD : 0.015,

        /**
         * The duration to use for the bounce snap-back transition
         *
         * @property SNAP_DURATION
         * @static
         * @type Number
         * @default 400
         */
         SNAP_DURATION : 400,
        
        /**
         * The default easing to use for the main flick movement transition
         *
         * @property EASING
         * @static
         * @type String
         * @default 'cubic-bezier(0, 0.1, 0, 1.0)'
         */
        EASING : 'cubic-bezier(0, 0.1, 0, 1.0)',

        /**
         * The default easing to use for the bounce snap-back transition
         *
         * @property SNAP_EASING
         * @static
         * @type String
         * @default 'ease-out'
         */
        SNAP_EASING : 'ease-out',

        /**
         * The default CSS class names used by the plugin
         *
         * @property CLASS_NAMES
         * @static
         * @type Object
         */
        CLASS_NAMES : {
            box: getClassName(Flick.NS),
            content: getClassName(Flick.NS, "content")
        }
    });

    _yuitest_coverline("build/node-flick/node-flick.js", 520);
Y.Plugin.Flick = Flick;


}, '3.7.3', {"requires": ["classnamemanager", "transition", "event-flick", "plugin"], "skinnable": true});
