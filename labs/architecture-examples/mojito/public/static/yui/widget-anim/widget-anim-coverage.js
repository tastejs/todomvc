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
_yuitest_coverage["build/widget-anim/widget-anim.js"] = {
    lines: {},
    functions: {},
    coveredLines: 0,
    calledLines: 0,
    coveredFunctions: 0,
    calledFunctions: 0,
    path: "build/widget-anim/widget-anim.js",
    code: []
};
_yuitest_coverage["build/widget-anim/widget-anim.js"].code=["YUI.add('widget-anim', function (Y, NAME) {","","/**"," * Provides a plugin which can be used to animate widget visibility changes."," *"," * @module widget-anim"," */","var BOUNDING_BOX = \"boundingBox\",","    HOST = \"host\",","    NODE = \"node\",","    OPACITY = \"opacity\",","    EMPTY_STR = \"\",","    VISIBLE = \"visible\",","    DESTROY = \"destroy\",","    HIDDEN = \"hidden\",","","    RENDERED = \"rendered\",","    ","    START = \"start\",","    END = \"end\",","","    DURATION = \"duration\",","    ANIM_SHOW = \"animShow\",","    ANIM_HIDE = \"animHide\",","","    _UI_SET_VISIBLE = \"_uiSetVisible\",","    ","    ANIM_SHOW_CHANGE = \"animShowChange\",","    ANIM_HIDE_CHANGE = \"animHideChange\";","","/**"," * A plugin class which can be used to animate widget visibility changes."," *"," * @class WidgetAnim"," * @extends Plugin.Base"," * @namespace Plugin"," */","function WidgetAnim(config) {","    WidgetAnim.superclass.constructor.apply(this, arguments);","}","","/**"," * The namespace for the plugin. This will be the property on the widget, which will "," * reference the plugin instance, when it's plugged in."," *"," * @property NS"," * @static"," * @type String"," * @default \"anim\""," */","WidgetAnim.NS = \"anim\";","","/**"," * The NAME of the WidgetAnim class. Used to prefix events generated"," * by the plugin class."," *"," * @property NAME"," * @static"," * @type String"," * @default \"pluginWidgetAnim\""," */","WidgetAnim.NAME = \"pluginWidgetAnim\";","","/**"," * Pre-Packaged Animation implementations, which can be used for animShow and animHide attribute "," * values."," *"," * @property ANIMATIONS"," * @static"," * @type Object"," * @default \"pluginWidgetAnim\""," */","WidgetAnim.ANIMATIONS = {","","    fadeIn : function() {","","        var widget = this.get(HOST),","            boundingBox = widget.get(BOUNDING_BOX),","            ","            anim = new Y.Anim({","                node: boundingBox,","                to: { opacity: 1 },","                duration: this.get(DURATION)","            });","","        // Set initial opacity, to avoid initial flicker","        if (!widget.get(VISIBLE)) {","            boundingBox.setStyle(OPACITY, 0);","        }","","        // Clean up, on destroy. Where supported, remove","        // opacity set using style. Else make 100% opaque","        anim.on(DESTROY, function() {","            this.get(NODE).setStyle(OPACITY, (Y.UA.ie) ? 1 : EMPTY_STR);","        });","","        return anim;","    },","","    fadeOut : function() {","        return new Y.Anim({","            node: this.get(HOST).get(BOUNDING_BOX),","            to: { opacity: 0 },","            duration: this.get(DURATION)","        });","    }","};","","/**"," * Static property used to define the default attribute "," * configuration for the plugin."," *"," * @property ATTRS"," * @type Object"," * @static"," */","WidgetAnim.ATTRS = {","","    /**","     * Default duration in seconds. Used as the default duration for the default animation implementations","     *","     * @attribute duration","     * @type Number","     * @default 0.2 (seconds ","     */","    duration : {","        value: 0.2","    },","","    /**","     * Default animation instance used for showing the widget (opacity fade-in)","     * ","     * @attribute animShow","     * @type Anim","     * @default WidgetAnim.ANIMATIONS.fadeIn","     */","    animShow : {","        valueFn: WidgetAnim.ANIMATIONS.fadeIn","    },","","    /**","     * Default animation instance used for hiding the widget (opacity fade-out)","     *","     * @attribute animHide","     * @type Anim","     * @default WidgetAnim.ANIMATIONS.fadeOut","     */","    animHide : {","        valueFn: WidgetAnim.ANIMATIONS.fadeOut","    }","};","","Y.extend(WidgetAnim, Y.Plugin.Base, {","","    /**","     * The initializer lifecycle implementation. Modifies the host widget's ","     * visibililty implementation to add animation.","     *","     * @method initializer","     * @param {Object} config The user configuration for the plugin  ","     */","    initializer : function(config) {","        this._bindAnimShow();","        this._bindAnimHide();","","        this.after(ANIM_SHOW_CHANGE, this._bindAnimShow);","        this.after(ANIM_HIDE_CHANGE, this._bindAnimHide);","","        // Override default _uiSetVisible method, with custom animated method","        this.beforeHostMethod(_UI_SET_VISIBLE, this._uiAnimSetVisible);","    },","","    /**","     * The initializer destructor implementation. Responsible for destroying the configured","     * animation instances.","     * ","     * @method destructor","     */","    destructor : function() {","        this.get(ANIM_SHOW).destroy();","        this.get(ANIM_HIDE).destroy();","    },","","    /**","     * The injected method used to override the host widget's _uiSetVisible implementation with","     * an animated version of the same.","     *","     * <p>This method replaces the default _uiSetVisible handler","     * Widget provides, by injecting itself before _uiSetVisible,","     * and preventing the default behavior. </p>","     *","     * @method _uiAnimSetVisible","     * @protected","     * @param {boolean} val true, if making the widget visible. false, if hiding it.","     */","    _uiAnimSetVisible : function(val) {","        if (this.get(HOST).get(RENDERED)) {","            if (val) {","                this.get(ANIM_HIDE).stop();","                this.get(ANIM_SHOW).run();","            } else {","                this.get(ANIM_SHOW).stop();","                this.get(ANIM_HIDE).run();","            }","            return new Y.Do.Prevent();","        }","    },","","    /**","     * The original Widget _uiSetVisible implementation. This currently needs to be replicated,","     * so it can be invoked before or after the animation starts or stops, since the original","     * methods is not available to the AOP implementation.","     *","     * @method _uiSetVisible","     * @param {boolean} val true, if making the widget visible. false, if hiding it.","     * @private","     */","    _uiSetVisible : function(val) {","        var host = this.get(HOST),","            hiddenClass = host.getClassName(HIDDEN);","","        host.get(BOUNDING_BOX).toggleClass(hiddenClass, !val);","    },","","    /**","     * Binds a listener to invoke the original visibility handling when the animShow animation is started","     *","     * @method _bindAnimShow","     * @private","     */","    _bindAnimShow : function() {","        // Setup original visibility handling (for show) before starting to animate","        this.get(ANIM_SHOW).on(START, ","            Y.bind(function() {","                this._uiSetVisible(true);","            }, this));","    },","","    /**","     * Binds a listener to invoke the original visibility handling when the animHide animation is complete","     *","     * @method _bindAnimHide","     * @private","     */","    _bindAnimHide : function() {","        // Setup original visibility handling (for hide) after completing animation","        this.get(ANIM_HIDE).after(END, ","            Y.bind(function() {","                this._uiSetVisible(false);","            }, this));","    }","});","","Y.namespace(\"Plugin\").WidgetAnim = WidgetAnim;","","","}, '3.7.3', {\"requires\": [\"anim-base\", \"plugin\", \"widget\"]});"];
_yuitest_coverage["build/widget-anim/widget-anim.js"].lines = {"1":0,"8":0,"38":0,"39":0,"51":0,"62":0,"73":0,"77":0,"87":0,"88":0,"93":0,"94":0,"97":0,"101":0,"117":0,"153":0,"163":0,"164":0,"166":0,"167":0,"170":0,"180":0,"181":0,"197":0,"198":0,"199":0,"200":0,"202":0,"203":0,"205":0,"219":0,"222":0,"233":0,"235":0,"247":0,"249":0,"254":0};
_yuitest_coverage["build/widget-anim/widget-anim.js"].functions = {"WidgetAnim:38":0,"(anonymous 2):93":0,"fadeIn:75":0,"fadeOut:100":0,"initializer:162":0,"destructor:179":0,"_uiAnimSetVisible:196":0,"_uiSetVisible:218":0,"(anonymous 3):234":0,"_bindAnimShow:231":0,"(anonymous 4):248":0,"_bindAnimHide:245":0,"(anonymous 1):1":0};
_yuitest_coverage["build/widget-anim/widget-anim.js"].coveredLines = 37;
_yuitest_coverage["build/widget-anim/widget-anim.js"].coveredFunctions = 13;
_yuitest_coverline("build/widget-anim/widget-anim.js", 1);
YUI.add('widget-anim', function (Y, NAME) {

/**
 * Provides a plugin which can be used to animate widget visibility changes.
 *
 * @module widget-anim
 */
_yuitest_coverfunc("build/widget-anim/widget-anim.js", "(anonymous 1)", 1);
_yuitest_coverline("build/widget-anim/widget-anim.js", 8);
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
_yuitest_coverline("build/widget-anim/widget-anim.js", 38);
function WidgetAnim(config) {
    _yuitest_coverfunc("build/widget-anim/widget-anim.js", "WidgetAnim", 38);
_yuitest_coverline("build/widget-anim/widget-anim.js", 39);
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
_yuitest_coverline("build/widget-anim/widget-anim.js", 51);
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
_yuitest_coverline("build/widget-anim/widget-anim.js", 62);
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
_yuitest_coverline("build/widget-anim/widget-anim.js", 73);
WidgetAnim.ANIMATIONS = {

    fadeIn : function() {

        _yuitest_coverfunc("build/widget-anim/widget-anim.js", "fadeIn", 75);
_yuitest_coverline("build/widget-anim/widget-anim.js", 77);
var widget = this.get(HOST),
            boundingBox = widget.get(BOUNDING_BOX),
            
            anim = new Y.Anim({
                node: boundingBox,
                to: { opacity: 1 },
                duration: this.get(DURATION)
            });

        // Set initial opacity, to avoid initial flicker
        _yuitest_coverline("build/widget-anim/widget-anim.js", 87);
if (!widget.get(VISIBLE)) {
            _yuitest_coverline("build/widget-anim/widget-anim.js", 88);
boundingBox.setStyle(OPACITY, 0);
        }

        // Clean up, on destroy. Where supported, remove
        // opacity set using style. Else make 100% opaque
        _yuitest_coverline("build/widget-anim/widget-anim.js", 93);
anim.on(DESTROY, function() {
            _yuitest_coverfunc("build/widget-anim/widget-anim.js", "(anonymous 2)", 93);
_yuitest_coverline("build/widget-anim/widget-anim.js", 94);
this.get(NODE).setStyle(OPACITY, (Y.UA.ie) ? 1 : EMPTY_STR);
        });

        _yuitest_coverline("build/widget-anim/widget-anim.js", 97);
return anim;
    },

    fadeOut : function() {
        _yuitest_coverfunc("build/widget-anim/widget-anim.js", "fadeOut", 100);
_yuitest_coverline("build/widget-anim/widget-anim.js", 101);
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
_yuitest_coverline("build/widget-anim/widget-anim.js", 117);
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

_yuitest_coverline("build/widget-anim/widget-anim.js", 153);
Y.extend(WidgetAnim, Y.Plugin.Base, {

    /**
     * The initializer lifecycle implementation. Modifies the host widget's 
     * visibililty implementation to add animation.
     *
     * @method initializer
     * @param {Object} config The user configuration for the plugin  
     */
    initializer : function(config) {
        _yuitest_coverfunc("build/widget-anim/widget-anim.js", "initializer", 162);
_yuitest_coverline("build/widget-anim/widget-anim.js", 163);
this._bindAnimShow();
        _yuitest_coverline("build/widget-anim/widget-anim.js", 164);
this._bindAnimHide();

        _yuitest_coverline("build/widget-anim/widget-anim.js", 166);
this.after(ANIM_SHOW_CHANGE, this._bindAnimShow);
        _yuitest_coverline("build/widget-anim/widget-anim.js", 167);
this.after(ANIM_HIDE_CHANGE, this._bindAnimHide);

        // Override default _uiSetVisible method, with custom animated method
        _yuitest_coverline("build/widget-anim/widget-anim.js", 170);
this.beforeHostMethod(_UI_SET_VISIBLE, this._uiAnimSetVisible);
    },

    /**
     * The initializer destructor implementation. Responsible for destroying the configured
     * animation instances.
     * 
     * @method destructor
     */
    destructor : function() {
        _yuitest_coverfunc("build/widget-anim/widget-anim.js", "destructor", 179);
_yuitest_coverline("build/widget-anim/widget-anim.js", 180);
this.get(ANIM_SHOW).destroy();
        _yuitest_coverline("build/widget-anim/widget-anim.js", 181);
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
        _yuitest_coverfunc("build/widget-anim/widget-anim.js", "_uiAnimSetVisible", 196);
_yuitest_coverline("build/widget-anim/widget-anim.js", 197);
if (this.get(HOST).get(RENDERED)) {
            _yuitest_coverline("build/widget-anim/widget-anim.js", 198);
if (val) {
                _yuitest_coverline("build/widget-anim/widget-anim.js", 199);
this.get(ANIM_HIDE).stop();
                _yuitest_coverline("build/widget-anim/widget-anim.js", 200);
this.get(ANIM_SHOW).run();
            } else {
                _yuitest_coverline("build/widget-anim/widget-anim.js", 202);
this.get(ANIM_SHOW).stop();
                _yuitest_coverline("build/widget-anim/widget-anim.js", 203);
this.get(ANIM_HIDE).run();
            }
            _yuitest_coverline("build/widget-anim/widget-anim.js", 205);
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
        _yuitest_coverfunc("build/widget-anim/widget-anim.js", "_uiSetVisible", 218);
_yuitest_coverline("build/widget-anim/widget-anim.js", 219);
var host = this.get(HOST),
            hiddenClass = host.getClassName(HIDDEN);

        _yuitest_coverline("build/widget-anim/widget-anim.js", 222);
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
        _yuitest_coverfunc("build/widget-anim/widget-anim.js", "_bindAnimShow", 231);
_yuitest_coverline("build/widget-anim/widget-anim.js", 233);
this.get(ANIM_SHOW).on(START, 
            Y.bind(function() {
                _yuitest_coverfunc("build/widget-anim/widget-anim.js", "(anonymous 3)", 234);
_yuitest_coverline("build/widget-anim/widget-anim.js", 235);
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
        _yuitest_coverfunc("build/widget-anim/widget-anim.js", "_bindAnimHide", 245);
_yuitest_coverline("build/widget-anim/widget-anim.js", 247);
this.get(ANIM_HIDE).after(END, 
            Y.bind(function() {
                _yuitest_coverfunc("build/widget-anim/widget-anim.js", "(anonymous 4)", 248);
_yuitest_coverline("build/widget-anim/widget-anim.js", 249);
this._uiSetVisible(false);
            }, this));
    }
});

_yuitest_coverline("build/widget-anim/widget-anim.js", 254);
Y.namespace("Plugin").WidgetAnim = WidgetAnim;


}, '3.7.3', {"requires": ["anim-base", "plugin", "widget"]});
