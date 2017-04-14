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
_yuitest_coverage["build/dd-plugin/dd-plugin.js"] = {
    lines: {},
    functions: {},
    coveredLines: 0,
    calledLines: 0,
    coveredFunctions: 0,
    calledFunctions: 0,
    path: "build/dd-plugin/dd-plugin.js",
    code: []
};
_yuitest_coverage["build/dd-plugin/dd-plugin.js"].code=["YUI.add('dd-plugin', function (Y, NAME) {","","","","       /**","        * Simple Drag plugin that can be attached to a Node or Widget via the plug method.","        * @module dd","        * @submodule dd-plugin","        */","       /**","        * Simple Drag plugin that can be attached to a Node or Widget via the plug method.","        * @class Drag","        * @extends DD.Drag","        * @constructor","        * @namespace Plugin","        */","        var Drag = function(config) {","                if (Y.Widget && config.host instanceof Y.Widget) {","                        config.node = config.host.get('boundingBox');","                        config.widget = config.host;","                } else {","                        config.node = config.host;","                        config.widget = false;","                }","                Drag.superclass.constructor.call(this, config);","        },","","        EV_START = 'drag:start',","        EV_DRAG = 'drag:drag',","        EV_DRAG_END = 'drag:end';","","        /**","        * @property NAME","        * @description dd-plugin","        * @type {String}","        */","        Drag.NAME = \"dd-plugin\";","","        /**","        * @property NS","        * @description The Drag instance will be placed on the Node instance under the dd namespace. It can be accessed via Node.dd;","        * @type {String}","        */","        Drag.NS = \"dd\";","","        Y.extend(Drag, Y.DD.Drag, {","","                _widgetHandles: null,","","                /**","                * refers to a Y.Widget if its the host, otherwise = false.","                *","                * @attribute _widget","                * @private","                */","                _widget: undefined,","","","                /**","                * refers to the [x,y] coordinate where the drag was stopped last","                *","                * @attribute _stoppedPosition","                * @private","                */","                _stoppedPosition: undefined,","","","                /**","                * Returns true if widget uses widgetPosition, otherwise returns false","                *","                * @method _usesWidgetPosition","                * @private","                */","                _usesWidgetPosition: function(widget) {","                        var r = false;","                        if (widget) {","                                r = (widget.hasImpl && widget.hasImpl(Y.WidgetPosition)) ? true : false;","                        }","                        return r;","                },","                /**","                * Attached to the `drag:start` event, it checks if this plugin needs","                * to attach or detach listeners for widgets. If `dd-proxy` is plugged","                * the default widget positioning should be ignored.","                * @method _checkEvents","                * @private","                */","                _checkEvents: function() {","                    if (this._widget) {","                        //It's a widget","                        if (this.proxy) {","                            //It's a proxy","                            if (this._widgetHandles.length > 0) {","                                //Remove Listeners","                                this._removeWidgetListeners();","                            }","                        } else {","                            if (this._widgetHandles.length === 0) {","                                this._attachWidgetListeners();","                            }","                        }","                    }","                },","                /**","                * Remove the attached widget listeners","                * @method _removeWidgetListeners","                * @private","                */","                _removeWidgetListeners: function() {","                    Y.Array.each(this._widgetHandles, function(handle) {","                        handle.detach();","                    });","                    this._widgetHandles = [];","                },","                /**","                * If this is a Widget, then attach the positioning listeners","                * @method _attachWidgetListeners","                * @private","                */","                _attachWidgetListeners: function() {","                        //if this thing is a widget, and it uses widgetposition...","                        if (this._usesWidgetPosition(this._widget)) {","","                               //set the x,y on the widget's ATTRS","                               this._widgetHandles.push(this.on(EV_DRAG, this._setWidgetCoords));","","                               //store the new position that the widget ends up on","                               this._widgetHandles.push(this.on(EV_DRAG_END, this._updateStopPosition));","                        }","                },","                /**","                * Sets up event listeners on drag events if interacting with a widget","                *","                * @method initializer","                * @protected","                */","                initializer: function(config) {","","                        this._widgetHandles = [];","","                        this._widget = config.widget;","","                        this.on(EV_START, this._checkEvents); //Always run, don't check","","                        this._attachWidgetListeners();","","                },","","                /**","                * Updates x,y or xy attributes on widget based on where the widget is dragged","                *","                * @method initializer","                * @param {EventFacade} e Event Facade","                * @private","                */","                _setWidgetCoords: function(e) {","","                        //get the last position where the widget was, or get the starting point","                        var nodeXY = this._stoppedPosition || e.target.nodeXY,","                         realXY = e.target.realXY,","","                         //amount moved = [(x2 - x1) , (y2 - y1)]","                         movedXY = [realXY[0] - nodeXY[0], realXY[1] - nodeXY[1]];","","                         //if both have changed..","                         if (movedXY[0] !== 0 && movedXY[1] !== 0) {","                                 this._widget.set('xy', realXY);","                         }","","                         //if only x is 0, set the Y","                         else if (movedXY[0] === 0) {","                                 this._widget.set('y',realXY[1]);","                         }","","                         //otherwise, y is 0, so set X","                         else if (movedXY[1] === 0){","                                 this._widget.set('x', realXY[0]);","                         }","                },","","                /**","                * Updates the last position where the widget was stopped.","                *","                * @method _updateStopPosition","                * @param {EventFacade} e Event Facade","                * @private","                */","                _updateStopPosition: function(e) {","                        this._stoppedPosition = e.target.realXY;","                }","        });","","        Y.namespace('Plugin');","        Y.Plugin.Drag = Drag;","","","","","","}, '3.7.3', {\"optional\": [\"dd-constrain\", \"dd-proxy\"], \"requires\": [\"dd-drag\"]});"];
_yuitest_coverage["build/dd-plugin/dd-plugin.js"].lines = {"1":0,"17":0,"18":0,"19":0,"20":0,"22":0,"23":0,"25":0,"37":0,"44":0,"46":0,"75":0,"76":0,"77":0,"79":0,"89":0,"91":0,"93":0,"95":0,"98":0,"99":0,"110":0,"111":0,"113":0,"122":0,"125":0,"128":0,"139":0,"141":0,"143":0,"145":0,"159":0,"166":0,"167":0,"171":0,"172":0,"176":0,"177":0,"189":0,"193":0,"194":0};
_yuitest_coverage["build/dd-plugin/dd-plugin.js"].functions = {"Drag:17":0,"_usesWidgetPosition:74":0,"_checkEvents:88":0,"(anonymous 2):110":0,"_removeWidgetListeners:109":0,"_attachWidgetListeners:120":0,"initializer:137":0,"_setWidgetCoords:156":0,"_updateStopPosition:188":0,"(anonymous 1):1":0};
_yuitest_coverage["build/dd-plugin/dd-plugin.js"].coveredLines = 41;
_yuitest_coverage["build/dd-plugin/dd-plugin.js"].coveredFunctions = 10;
_yuitest_coverline("build/dd-plugin/dd-plugin.js", 1);
YUI.add('dd-plugin', function (Y, NAME) {



       /**
        * Simple Drag plugin that can be attached to a Node or Widget via the plug method.
        * @module dd
        * @submodule dd-plugin
        */
       /**
        * Simple Drag plugin that can be attached to a Node or Widget via the plug method.
        * @class Drag
        * @extends DD.Drag
        * @constructor
        * @namespace Plugin
        */
        _yuitest_coverfunc("build/dd-plugin/dd-plugin.js", "(anonymous 1)", 1);
_yuitest_coverline("build/dd-plugin/dd-plugin.js", 17);
var Drag = function(config) {
                _yuitest_coverfunc("build/dd-plugin/dd-plugin.js", "Drag", 17);
_yuitest_coverline("build/dd-plugin/dd-plugin.js", 18);
if (Y.Widget && config.host instanceof Y.Widget) {
                        _yuitest_coverline("build/dd-plugin/dd-plugin.js", 19);
config.node = config.host.get('boundingBox');
                        _yuitest_coverline("build/dd-plugin/dd-plugin.js", 20);
config.widget = config.host;
                } else {
                        _yuitest_coverline("build/dd-plugin/dd-plugin.js", 22);
config.node = config.host;
                        _yuitest_coverline("build/dd-plugin/dd-plugin.js", 23);
config.widget = false;
                }
                _yuitest_coverline("build/dd-plugin/dd-plugin.js", 25);
Drag.superclass.constructor.call(this, config);
        },

        EV_START = 'drag:start',
        EV_DRAG = 'drag:drag',
        EV_DRAG_END = 'drag:end';

        /**
        * @property NAME
        * @description dd-plugin
        * @type {String}
        */
        _yuitest_coverline("build/dd-plugin/dd-plugin.js", 37);
Drag.NAME = "dd-plugin";

        /**
        * @property NS
        * @description The Drag instance will be placed on the Node instance under the dd namespace. It can be accessed via Node.dd;
        * @type {String}
        */
        _yuitest_coverline("build/dd-plugin/dd-plugin.js", 44);
Drag.NS = "dd";

        _yuitest_coverline("build/dd-plugin/dd-plugin.js", 46);
Y.extend(Drag, Y.DD.Drag, {

                _widgetHandles: null,

                /**
                * refers to a Y.Widget if its the host, otherwise = false.
                *
                * @attribute _widget
                * @private
                */
                _widget: undefined,


                /**
                * refers to the [x,y] coordinate where the drag was stopped last
                *
                * @attribute _stoppedPosition
                * @private
                */
                _stoppedPosition: undefined,


                /**
                * Returns true if widget uses widgetPosition, otherwise returns false
                *
                * @method _usesWidgetPosition
                * @private
                */
                _usesWidgetPosition: function(widget) {
                        _yuitest_coverfunc("build/dd-plugin/dd-plugin.js", "_usesWidgetPosition", 74);
_yuitest_coverline("build/dd-plugin/dd-plugin.js", 75);
var r = false;
                        _yuitest_coverline("build/dd-plugin/dd-plugin.js", 76);
if (widget) {
                                _yuitest_coverline("build/dd-plugin/dd-plugin.js", 77);
r = (widget.hasImpl && widget.hasImpl(Y.WidgetPosition)) ? true : false;
                        }
                        _yuitest_coverline("build/dd-plugin/dd-plugin.js", 79);
return r;
                },
                /**
                * Attached to the `drag:start` event, it checks if this plugin needs
                * to attach or detach listeners for widgets. If `dd-proxy` is plugged
                * the default widget positioning should be ignored.
                * @method _checkEvents
                * @private
                */
                _checkEvents: function() {
                    _yuitest_coverfunc("build/dd-plugin/dd-plugin.js", "_checkEvents", 88);
_yuitest_coverline("build/dd-plugin/dd-plugin.js", 89);
if (this._widget) {
                        //It's a widget
                        _yuitest_coverline("build/dd-plugin/dd-plugin.js", 91);
if (this.proxy) {
                            //It's a proxy
                            _yuitest_coverline("build/dd-plugin/dd-plugin.js", 93);
if (this._widgetHandles.length > 0) {
                                //Remove Listeners
                                _yuitest_coverline("build/dd-plugin/dd-plugin.js", 95);
this._removeWidgetListeners();
                            }
                        } else {
                            _yuitest_coverline("build/dd-plugin/dd-plugin.js", 98);
if (this._widgetHandles.length === 0) {
                                _yuitest_coverline("build/dd-plugin/dd-plugin.js", 99);
this._attachWidgetListeners();
                            }
                        }
                    }
                },
                /**
                * Remove the attached widget listeners
                * @method _removeWidgetListeners
                * @private
                */
                _removeWidgetListeners: function() {
                    _yuitest_coverfunc("build/dd-plugin/dd-plugin.js", "_removeWidgetListeners", 109);
_yuitest_coverline("build/dd-plugin/dd-plugin.js", 110);
Y.Array.each(this._widgetHandles, function(handle) {
                        _yuitest_coverfunc("build/dd-plugin/dd-plugin.js", "(anonymous 2)", 110);
_yuitest_coverline("build/dd-plugin/dd-plugin.js", 111);
handle.detach();
                    });
                    _yuitest_coverline("build/dd-plugin/dd-plugin.js", 113);
this._widgetHandles = [];
                },
                /**
                * If this is a Widget, then attach the positioning listeners
                * @method _attachWidgetListeners
                * @private
                */
                _attachWidgetListeners: function() {
                        //if this thing is a widget, and it uses widgetposition...
                        _yuitest_coverfunc("build/dd-plugin/dd-plugin.js", "_attachWidgetListeners", 120);
_yuitest_coverline("build/dd-plugin/dd-plugin.js", 122);
if (this._usesWidgetPosition(this._widget)) {

                               //set the x,y on the widget's ATTRS
                               _yuitest_coverline("build/dd-plugin/dd-plugin.js", 125);
this._widgetHandles.push(this.on(EV_DRAG, this._setWidgetCoords));

                               //store the new position that the widget ends up on
                               _yuitest_coverline("build/dd-plugin/dd-plugin.js", 128);
this._widgetHandles.push(this.on(EV_DRAG_END, this._updateStopPosition));
                        }
                },
                /**
                * Sets up event listeners on drag events if interacting with a widget
                *
                * @method initializer
                * @protected
                */
                initializer: function(config) {

                        _yuitest_coverfunc("build/dd-plugin/dd-plugin.js", "initializer", 137);
_yuitest_coverline("build/dd-plugin/dd-plugin.js", 139);
this._widgetHandles = [];

                        _yuitest_coverline("build/dd-plugin/dd-plugin.js", 141);
this._widget = config.widget;

                        _yuitest_coverline("build/dd-plugin/dd-plugin.js", 143);
this.on(EV_START, this._checkEvents); //Always run, don't check

                        _yuitest_coverline("build/dd-plugin/dd-plugin.js", 145);
this._attachWidgetListeners();

                },

                /**
                * Updates x,y or xy attributes on widget based on where the widget is dragged
                *
                * @method initializer
                * @param {EventFacade} e Event Facade
                * @private
                */
                _setWidgetCoords: function(e) {

                        //get the last position where the widget was, or get the starting point
                        _yuitest_coverfunc("build/dd-plugin/dd-plugin.js", "_setWidgetCoords", 156);
_yuitest_coverline("build/dd-plugin/dd-plugin.js", 159);
var nodeXY = this._stoppedPosition || e.target.nodeXY,
                         realXY = e.target.realXY,

                         //amount moved = [(x2 - x1) , (y2 - y1)]
                         movedXY = [realXY[0] - nodeXY[0], realXY[1] - nodeXY[1]];

                         //if both have changed..
                         _yuitest_coverline("build/dd-plugin/dd-plugin.js", 166);
if (movedXY[0] !== 0 && movedXY[1] !== 0) {
                                 _yuitest_coverline("build/dd-plugin/dd-plugin.js", 167);
this._widget.set('xy', realXY);
                         }

                         //if only x is 0, set the Y
                         else {_yuitest_coverline("build/dd-plugin/dd-plugin.js", 171);
if (movedXY[0] === 0) {
                                 _yuitest_coverline("build/dd-plugin/dd-plugin.js", 172);
this._widget.set('y',realXY[1]);
                         }

                         //otherwise, y is 0, so set X
                         else {_yuitest_coverline("build/dd-plugin/dd-plugin.js", 176);
if (movedXY[1] === 0){
                                 _yuitest_coverline("build/dd-plugin/dd-plugin.js", 177);
this._widget.set('x', realXY[0]);
                         }}}
                },

                /**
                * Updates the last position where the widget was stopped.
                *
                * @method _updateStopPosition
                * @param {EventFacade} e Event Facade
                * @private
                */
                _updateStopPosition: function(e) {
                        _yuitest_coverfunc("build/dd-plugin/dd-plugin.js", "_updateStopPosition", 188);
_yuitest_coverline("build/dd-plugin/dd-plugin.js", 189);
this._stoppedPosition = e.target.realXY;
                }
        });

        _yuitest_coverline("build/dd-plugin/dd-plugin.js", 193);
Y.namespace('Plugin');
        _yuitest_coverline("build/dd-plugin/dd-plugin.js", 194);
Y.Plugin.Drag = Drag;





}, '3.7.3', {"optional": ["dd-constrain", "dd-proxy"], "requires": ["dd-drag"]});
