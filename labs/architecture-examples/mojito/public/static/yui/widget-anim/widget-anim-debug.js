/*
YUI 3.7.3 (build 5687)
Copyright 2012 Yahoo! Inc. All rights reserved.
Licensed under the BSD License.
http://yuilibrary.com/license/
*/
YUI.add('widget-anim', function (Y, NAME) {

/**
 * Provides a plugin which can be used to animate widget visibility changes.
 *
 * @module widget-anim
 */
var BOUNDING_BOX = "boundingBox",
    HOST = "host",
    NODE = "node",
    OPACITY = "opacity",
    EMPTY_STR = "",
    VISIBLE = "visible",
    DESTROY = "destroy",
    HIDDEN = "hidden",

    RENDERED = "rendered",
    
    START = "start",
    END = "end",

    DURATION = "duration",
    ANIM_SHOW = "animShow",
    ANIM_HIDE = "animHide",

    _UI_SET_VISIBLE = "_uiSetVisible",
    
    ANIM_SHOW_CHANGE = "animShowChange",
    ANIM_HIDE_CHANGE = "animHideChange";

/**
 * A plugin class which can be used to animate widget visibility changes.
 *
 * @class WidgetAnim
 * @extends Plugin.Base
 * @namespace Plugin
 */
function WidgetAnim(config) {
    WidgetAnim.superclass.constructor.apply(this, arguments);
}

/**
 * The namespace for the plugin. This will be the property on the widget, which will 
 * reference the plugin instance, when it's plugged in.
 *
 * @property NS
 * @static
 * @type String
 * @default "anim"
 */
WidgetAnim.NS = "anim";

/**
 * The NAME of the WidgetAnim class. Used to prefix events generated
 * by the plugin class.
 *
 * @property NAME
 * @static
 * @type String
 * @default "pluginWidgetAnim"
 */
WidgetAnim.NAME = "pluginWidgetAnim";

/**
 * Pre-Packaged Animation implementations, which can be used for animShow and animHide attribute 
 * values.
 *
 * @property ANIMATIONS
 * @static
 * @type Object
 * @default "pluginWidgetAnim"
 */
WidgetAnim.ANIMATIONS = {

    fadeIn : function() {

        var widget = this.get(HOST),
            boundingBox = widget.get(BOUNDING_BOX),
            
            anim = new Y.Anim({
                node: boundingBox,
                to: { opacity: 1 },
                duration: this.get(DURATION)
            });

        // Set initial opacity, to avoid initial flicker
        if (!widget.get(VISIBLE)) {
            boundingBox.setStyle(OPACITY, 0);
        }

        // Clean up, on destroy. Where supported, remove
        // opacity set using style. Else make 100% opaque
        anim.on(DESTROY, function() {
            this.get(NODE).setStyle(OPACITY, (Y.UA.ie) ? 1 : EMPTY_STR);
        });

        return anim;
    },

    fadeOut : function() {
        return new Y.Anim({
            node: this.get(HOST).get(BOUNDING_BOX),
            to: { opacity: 0 },
            duration: this.get(DURATION)
        });
    }
};

/**
 * Static property used to define the default attribute 
 * configuration for the plugin.
 *
 * @property ATTRS
 * @type Object
 * @static
 */
WidgetAnim.ATTRS = {

    /**
     * Default duration in seconds. Used as the default duration for the default animation implementations
     *
     * @attribute duration
     * @type Number
     * @default 0.2 (seconds 
     */
    duration : {
        value: 0.2
    },

    /**
     * Default animation instance used for showing the widget (opacity fade-in)
     * 
     * @attribute animShow
     * @type Anim
     * @default WidgetAnim.ANIMATIONS.fadeIn
     */
    animShow : {
        valueFn: WidgetAnim.ANIMATIONS.fadeIn
    },

    /**
     * Default animation instance used for hiding the widget (opacity fade-out)
     *
     * @attribute animHide
     * @type Anim
     * @default WidgetAnim.ANIMATIONS.fadeOut
     */
    animHide : {
        valueFn: WidgetAnim.ANIMATIONS.fadeOut
    }
};

Y.extend(WidgetAnim, Y.Plugin.Base, {

    /**
     * The initializer lifecycle implementation. Modifies the host widget's 
     * visibililty implementation to add animation.
     *
     * @method initializer
     * @param {Object} config The user configuration for the plugin  
     */
    initializer : function(config) {
        this._bindAnimShow();
        this._bindAnimHide();

        this.after(ANIM_SHOW_CHANGE, this._bindAnimShow);
        this.after(ANIM_HIDE_CHANGE, this._bindAnimHide);

        // Override default _uiSetVisible method, with custom animated method
        this.beforeHostMethod(_UI_SET_VISIBLE, this._uiAnimSetVisible);
    },

    /**
     * The initializer destructor implementation. Responsible for destroying the configured
     * animation instances.
     * 
     * @method destructor
     */
    destructor : function() {
        this.get(ANIM_SHOW).destroy();
        this.get(ANIM_HIDE).destroy();
    },

    /**
     * The injected method used to override the host widget's _uiSetVisible implementation with
     * an animated version of the same.
     *
     * <p>This method replaces the default _uiSetVisible handler
     * Widget provides, by injecting itself before _uiSetVisible,
     * and preventing the default behavior. </p>
     *
     * @method _uiAnimSetVisible
     * @protected
     * @param {boolean} val true, if making the widget visible. false, if hiding it.
     */
    _uiAnimSetVisible : function(val) {
        if (this.get(HOST).get(RENDERED)) {
            if (val) {
                this.get(ANIM_HIDE).stop();
                this.get(ANIM_SHOW).run();
            } else {
                this.get(ANIM_SHOW).stop();
                this.get(ANIM_HIDE).run();
            }
            return new Y.Do.Prevent();
        }
    },

    /**
     * The original Widget _uiSetVisible implementation. This currently needs to be replicated,
     * so it can be invoked before or after the animation starts or stops, since the original
     * methods is not available to the AOP implementation.
     *
     * @method _uiSetVisible
     * @param {boolean} val true, if making the widget visible. false, if hiding it.
     * @private
     */
    _uiSetVisible : function(val) {
        var host = this.get(HOST),
            hiddenClass = host.getClassName(HIDDEN);

        host.get(BOUNDING_BOX).toggleClass(hiddenClass, !val);
    },

    /**
     * Binds a listener to invoke the original visibility handling when the animShow animation is started
     *
     * @method _bindAnimShow
     * @private
     */
    _bindAnimShow : function() {
        // Setup original visibility handling (for show) before starting to animate
        this.get(ANIM_SHOW).on(START, 
            Y.bind(function() {
                this._uiSetVisible(true);
            }, this));
    },

    /**
     * Binds a listener to invoke the original visibility handling when the animHide animation is complete
     *
     * @method _bindAnimHide
     * @private
     */
    _bindAnimHide : function() {
        // Setup original visibility handling (for hide) after completing animation
        this.get(ANIM_HIDE).after(END, 
            Y.bind(function() {
                this._uiSetVisible(false);
            }, this));
    }
});

Y.namespace("Plugin").WidgetAnim = WidgetAnim;


}, '3.7.3', {"requires": ["anim-base", "plugin", "widget"]});
