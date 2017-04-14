/*
YUI 3.7.3 (build 5687)
Copyright 2012 Yahoo! Inc. All rights reserved.
Licensed under the BSD License.
http://yuilibrary.com/license/
*/
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
    function Flick(config) {
        Flick.superclass.constructor.apply(this, arguments);
    }

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
    Flick.NS = "flick";

    Y.extend(Flick, Y.Plugin.Base, {

        /**
         * The initializer lifecycle implementation.
         *
         * @method initializer
         * @param {Object} config The user configuration for the plugin  
         */
        initializer : function(config) {
            this._node = this.get(HOST);

            this._renderClasses();
            this.setBounds();

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
            var box = this.get(BOUNDING_BOX),
                node = this._node,

                boxHeight = box.get(OFFSET_HEIGHT),
                boxWidth = box.get(OFFSET_WIDTH),

                contentHeight = node.get(SCROLL_HEIGHT),
                contentWidth = node.get(SCROLL_WIDTH);

            if (contentHeight > boxHeight) {
                this._maxY = contentHeight - boxHeight;
                this._minY = 0;
                this._scrollY = true;
            }

            if (contentWidth > boxWidth) {
                this._maxX = contentWidth - boxWidth;
                this._minX = 0;
                this._scrollX = true;
            }

            this._x = this._y = 0;

            node.set("top", this._y + "px");
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
            this.get(BOUNDING_BOX).addClass(Flick.CLASS_NAMES.box);
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
            this._v = e.flick.velocity;
            this._flick = true;
            this._flickAnim();
        },

        /**
         * Executes a single frame in the flick animation
         *
         * @method _flickFrame
         * @protected
         */
        _flickAnim: function() {

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

            this._v = (velocity * deceleration);

            this._snapToEdge = false;

            if (this._scrollX) {
                x = x - (velocity * step);
            }
    
            if (this._scrollY) {
                y = y - (velocity * step);
            }

            if (Math.abs(velocity).toFixed(4) <= Flick.VELOCITY_THRESHOLD) {

                this._flick = false;

                this._killTimer(!(this._exceededYBoundary || this._exceededXBoundary));

                if (this._scrollX) {
                    if (x < minX) {
                        this._snapToEdge = true;
                        this._setX(minX);
                    } else if (x > maxX) {
                        this._snapToEdge = true;
                        this._setX(maxX);
                    }
                }

                if (this._scrollY) {
                    if (y < minY) {
                        this._snapToEdge = true;
                        this._setY(minY);
                    } else if (y > maxY) {
                        this._snapToEdge = true;
                        this._setY(maxY);
                    }
                }

            } else {

                if (this._scrollX && (x < minX || x > maxX)) {
                    this._exceededXBoundary = true;
                    this._v *= bounce;
                }

                if (this._scrollY && (y < minY || y > maxY)) {
                    this._exceededYBoundary = true;
                    this._v *= bounce;
                }

                if (this._scrollX) {
                    this._setX(x);
                }

                if (this._scrollY) {
                    this._setY(y);
                }

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

            if (x !== null) {
                x = this._bounce(x);
            } else {
                x = this._x; 
            }

            if (y !== null) {
                y = this._bounce(y);
            } else {
                y = this._y;
            }

            duration = duration || this._snapToEdge ? Flick.SNAP_DURATION : 0;
            easing = easing || this._snapToEdge ? Flick.SNAP_EASING : Flick.EASING;

            this._x = x;
            this._y = y;

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
            var xn = x * -1,
                yn = y * -1,

                transition = {
                    duration : duration / 1000,
                    easing : easing
                };


            if (Y.Transition.useNative) {
                transition.transform = 'translate('+ (xn) + 'px,' + (yn) +'px)'; 
            } else {
                transition.left = xn + 'px';
                transition.top = yn + 'px';
            }

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
            var bounce = this.get(BOUNCE),
                dist = this.get(BOUNCE_DISTANCE),
                min = bounce ? -dist : 0;

            max = bounce ? max + dist : max;
    
            if(!bounce) {
                if(val < min) {
                    val = min;
                } else if(val > max) {
                    val = max;
                }            
            }
            return val;
        },

        /**
         * Stop the animation timer
         *
         * @method _killTimer
         * @private
         */
        _killTimer: function() {
            if(this._flickTimer) {
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

    Y.Plugin.Flick = Flick;


}, '3.7.3', {"requires": ["classnamemanager", "transition", "event-flick", "plugin"], "skinnable": true});
