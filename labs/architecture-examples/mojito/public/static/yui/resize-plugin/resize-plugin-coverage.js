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
_yuitest_coverage["build/resize-plugin/resize-plugin.js"] = {
    lines: {},
    functions: {},
    coveredLines: 0,
    calledLines: 0,
    coveredFunctions: 0,
    calledFunctions: 0,
    path: "build/resize-plugin/resize-plugin.js",
    code: []
};
_yuitest_coverage["build/resize-plugin/resize-plugin.js"].code=["YUI.add('resize-plugin', function (Y, NAME) {","","/**"," * The Resize Plugin allows you to make a Node or a Widget resizable. It supports all the functionality of"," * the standalone Resize utility. Additionally, resizing a widget updates the widget's height,width and x,y"," * attributes, if they exist.","","","        var overlay = new Y.Overlay({","           width: \"200px\",","           srcNode: \"#overlay\",","           visible: false,","           align: {node:\".example\", points:[\"tc\", \"bc\"]}","        });","        overlay.plug(Y.Plugin.Resize);","",""," *"," * @module resize"," * @submodule resize-plugin"," * @extends Resize"," * @class Plugin.Resize"," * @constructor"," */","var ResizePlugin = function(config) {","","                //if its a widget, get the bounding box","                config.node = ((Y.Widget && config.host instanceof Y.Widget) ? config.host.get('boundingBox') : config.host);","                if (config.host instanceof Y.Widget) {","                        config.widget = config.host;","                }","                else {","                        config.widget = false;","                }","","                ResizePlugin.superclass.constructor.call(this, config);","        };","","        /**","        * @property NAME","        * @description resize-plugin","        * @type {String}","        */","        ResizePlugin.NAME = \"resize-plugin\";","","        /**","        * The Resize instance will be placed on the Node instance under","        * the resize namespace. It can be accessed via Node.resize or Widget.resize;","        * @property NS","        * @type {String}","        */","        ResizePlugin.NS = \"resize\";","","        /**","         * Static property used to define the default attribute","         * configuration for the Resize plugin.","         *","         * @property ATTRS","         * @type Object","         * @static","         */","        ResizePlugin.ATTRS = {","","              /**","               * Stores the node that is being resized","               *","               * @attribute node","               * @default undefined","               * @public","               */","                node: {","                        value: undefined","                },","","                /**","                 * Stores the widget that the node belongs to, if one exists","                 *","                 * @attribute widget","                 * @default undefined","                 * @public","                 */","                widget: {","                        value:undefined","                }","        };","","","        Y.extend(ResizePlugin, Y.Resize, {","","                /**","                 * Stores the values for node and widget, and sets up an event-listener","                 *","                 * @method initializer","                 * @protected","                 */","                initializer: function(config) {","","                        this.set('node', config.node);","                        this.set('widget', config.widget);","","                        this.on('resize:resize', function(e) {","                                this._correctDimensions(e);","                        });","                },","","                /**","                 * Updates the node's (x,y) values if they are changed via resizing.","                 * If the node belongs to a widget, passes the widget down to _setWidgetProperties method","                 *","                 * @method _correctDimensions","                 * @param {EventFacade} e The Event object","                 * @private","                 */","                _correctDimensions: function(e) {","","                        var node = this.get('node'),","                        x = {","                            old: node.getX(),","                            cur: e.currentTarget.info.left","                        },","                        y = {","                            old: node.getY(),","                            cur: e.currentTarget.info.top","                        };","","","                        if (this.get('widget')) {","                            this._setWidgetProperties(e, x, y);","                        }","","                        //now set properties on just the node or the widget's bounding box","                        if (this._isDifferent(x.old, x.cur)) {","                            node.set('x', x.cur);","                        }","","                        if (this._isDifferent(y.old, y.cur)) {","                            node.set('y', y.cur);","                        }","","                },","","","                   /**","                    * If the host is a widget, then set the width, height. Then look for widgetPosition and set x,y","                    *","                    * @method _setWidgetProperties","                    * @param {EventFacade} e The Event object","                    * @param {Object} x Literal containing old x value and current x value","                    * @param {Object} y Literal containing old y value and current y value","                    * @private","                    */","                   _setWidgetProperties: function(e,x,y) {","                       //all widgets have width/height attrs. change these only if they differ from the old values","","                       var widget = this.get('widget'),","                       oldHeight = widget.get('height'),","                       oldWidth = widget.get('width'),","                       currentWidth = e.currentTarget.info.offsetWidth - e.currentTarget.totalHSurrounding,","                       currentHeight = e.currentTarget.info.offsetHeight - e.currentTarget.totalVSurrounding;","","                       if (this._isDifferent(oldHeight, currentHeight)) {","                          widget.set('height', currentHeight);","                       }","","                       if (this._isDifferent(oldWidth, currentWidth)) {","                          widget.set('width', currentWidth);","                       }","","","","                       //If the widget uses Y.WidgetPosition, it will also have x,y position support.","                       if (widget.hasImpl && widget.hasImpl(Y.WidgetPosition)) {","","                           if (this._isDifferent(widget.get('x'), x.cur)) {","                               widget.set('x', x.cur);","                           }","","                           if (this._isDifferent(widget.get('y'), y.cur)) {","                               widget.set('y', y.cur);","                           }","","","                       }","                   },","","                   /**","                      * a little utility method that returns a value if the old !== new, otherwise it returns false.","                      *","                      * @method _isDifferent","                      * @param {Number} oldVal","                      * @param {Number} newVal","                      * @private","                      */","                   _isDifferent: function(oldVal, newVal) {","                       var retValue = false;","                       if (oldVal !== newVal) {","                           retValue = newVal;","                       }","                       return retValue;","                   }","","","        });","        Y.namespace('Plugin');","        Y.Plugin.Resize = ResizePlugin;","","","}, '3.7.3', {\"requires\": [\"resize-base\", \"plugin\"], \"optional\": [\"resize-constrain\"]});"];
_yuitest_coverage["build/resize-plugin/resize-plugin.js"].lines = {"1":0,"25":0,"28":0,"29":0,"30":0,"33":0,"36":0,"44":0,"52":0,"62":0,"88":0,"98":0,"99":0,"101":0,"102":0,"116":0,"127":0,"128":0,"132":0,"133":0,"136":0,"137":0,"155":0,"161":0,"162":0,"165":0,"166":0,"172":0,"174":0,"175":0,"178":0,"179":0,"195":0,"196":0,"197":0,"199":0,"204":0,"205":0};
_yuitest_coverage["build/resize-plugin/resize-plugin.js"].functions = {"ResizePlugin:25":0,"(anonymous 2):101":0,"initializer:96":0,"_correctDimensions:114":0,"_setWidgetProperties:152":0,"_isDifferent:194":0,"(anonymous 1):1":0};
_yuitest_coverage["build/resize-plugin/resize-plugin.js"].coveredLines = 38;
_yuitest_coverage["build/resize-plugin/resize-plugin.js"].coveredFunctions = 7;
_yuitest_coverline("build/resize-plugin/resize-plugin.js", 1);
YUI.add('resize-plugin', function (Y, NAME) {

/**
 * The Resize Plugin allows you to make a Node or a Widget resizable. It supports all the functionality of
 * the standalone Resize utility. Additionally, resizing a widget updates the widget's height,width and x,y
 * attributes, if they exist.


        var overlay = new Y.Overlay({
           width: "200px",
           srcNode: "#overlay",
           visible: false,
           align: {node:".example", points:["tc", "bc"]}
        });
        overlay.plug(Y.Plugin.Resize);


 *
 * @module resize
 * @submodule resize-plugin
 * @extends Resize
 * @class Plugin.Resize
 * @constructor
 */
_yuitest_coverfunc("build/resize-plugin/resize-plugin.js", "(anonymous 1)", 1);
_yuitest_coverline("build/resize-plugin/resize-plugin.js", 25);
var ResizePlugin = function(config) {

                //if its a widget, get the bounding box
                _yuitest_coverfunc("build/resize-plugin/resize-plugin.js", "ResizePlugin", 25);
_yuitest_coverline("build/resize-plugin/resize-plugin.js", 28);
config.node = ((Y.Widget && config.host instanceof Y.Widget) ? config.host.get('boundingBox') : config.host);
                _yuitest_coverline("build/resize-plugin/resize-plugin.js", 29);
if (config.host instanceof Y.Widget) {
                        _yuitest_coverline("build/resize-plugin/resize-plugin.js", 30);
config.widget = config.host;
                }
                else {
                        _yuitest_coverline("build/resize-plugin/resize-plugin.js", 33);
config.widget = false;
                }

                _yuitest_coverline("build/resize-plugin/resize-plugin.js", 36);
ResizePlugin.superclass.constructor.call(this, config);
        };

        /**
        * @property NAME
        * @description resize-plugin
        * @type {String}
        */
        _yuitest_coverline("build/resize-plugin/resize-plugin.js", 44);
ResizePlugin.NAME = "resize-plugin";

        /**
        * The Resize instance will be placed on the Node instance under
        * the resize namespace. It can be accessed via Node.resize or Widget.resize;
        * @property NS
        * @type {String}
        */
        _yuitest_coverline("build/resize-plugin/resize-plugin.js", 52);
ResizePlugin.NS = "resize";

        /**
         * Static property used to define the default attribute
         * configuration for the Resize plugin.
         *
         * @property ATTRS
         * @type Object
         * @static
         */
        _yuitest_coverline("build/resize-plugin/resize-plugin.js", 62);
ResizePlugin.ATTRS = {

              /**
               * Stores the node that is being resized
               *
               * @attribute node
               * @default undefined
               * @public
               */
                node: {
                        value: undefined
                },

                /**
                 * Stores the widget that the node belongs to, if one exists
                 *
                 * @attribute widget
                 * @default undefined
                 * @public
                 */
                widget: {
                        value:undefined
                }
        };


        _yuitest_coverline("build/resize-plugin/resize-plugin.js", 88);
Y.extend(ResizePlugin, Y.Resize, {

                /**
                 * Stores the values for node and widget, and sets up an event-listener
                 *
                 * @method initializer
                 * @protected
                 */
                initializer: function(config) {

                        _yuitest_coverfunc("build/resize-plugin/resize-plugin.js", "initializer", 96);
_yuitest_coverline("build/resize-plugin/resize-plugin.js", 98);
this.set('node', config.node);
                        _yuitest_coverline("build/resize-plugin/resize-plugin.js", 99);
this.set('widget', config.widget);

                        _yuitest_coverline("build/resize-plugin/resize-plugin.js", 101);
this.on('resize:resize', function(e) {
                                _yuitest_coverfunc("build/resize-plugin/resize-plugin.js", "(anonymous 2)", 101);
_yuitest_coverline("build/resize-plugin/resize-plugin.js", 102);
this._correctDimensions(e);
                        });
                },

                /**
                 * Updates the node's (x,y) values if they are changed via resizing.
                 * If the node belongs to a widget, passes the widget down to _setWidgetProperties method
                 *
                 * @method _correctDimensions
                 * @param {EventFacade} e The Event object
                 * @private
                 */
                _correctDimensions: function(e) {

                        _yuitest_coverfunc("build/resize-plugin/resize-plugin.js", "_correctDimensions", 114);
_yuitest_coverline("build/resize-plugin/resize-plugin.js", 116);
var node = this.get('node'),
                        x = {
                            old: node.getX(),
                            cur: e.currentTarget.info.left
                        },
                        y = {
                            old: node.getY(),
                            cur: e.currentTarget.info.top
                        };


                        _yuitest_coverline("build/resize-plugin/resize-plugin.js", 127);
if (this.get('widget')) {
                            _yuitest_coverline("build/resize-plugin/resize-plugin.js", 128);
this._setWidgetProperties(e, x, y);
                        }

                        //now set properties on just the node or the widget's bounding box
                        _yuitest_coverline("build/resize-plugin/resize-plugin.js", 132);
if (this._isDifferent(x.old, x.cur)) {
                            _yuitest_coverline("build/resize-plugin/resize-plugin.js", 133);
node.set('x', x.cur);
                        }

                        _yuitest_coverline("build/resize-plugin/resize-plugin.js", 136);
if (this._isDifferent(y.old, y.cur)) {
                            _yuitest_coverline("build/resize-plugin/resize-plugin.js", 137);
node.set('y', y.cur);
                        }

                },


                   /**
                    * If the host is a widget, then set the width, height. Then look for widgetPosition and set x,y
                    *
                    * @method _setWidgetProperties
                    * @param {EventFacade} e The Event object
                    * @param {Object} x Literal containing old x value and current x value
                    * @param {Object} y Literal containing old y value and current y value
                    * @private
                    */
                   _setWidgetProperties: function(e,x,y) {
                       //all widgets have width/height attrs. change these only if they differ from the old values

                       _yuitest_coverfunc("build/resize-plugin/resize-plugin.js", "_setWidgetProperties", 152);
_yuitest_coverline("build/resize-plugin/resize-plugin.js", 155);
var widget = this.get('widget'),
                       oldHeight = widget.get('height'),
                       oldWidth = widget.get('width'),
                       currentWidth = e.currentTarget.info.offsetWidth - e.currentTarget.totalHSurrounding,
                       currentHeight = e.currentTarget.info.offsetHeight - e.currentTarget.totalVSurrounding;

                       _yuitest_coverline("build/resize-plugin/resize-plugin.js", 161);
if (this._isDifferent(oldHeight, currentHeight)) {
                          _yuitest_coverline("build/resize-plugin/resize-plugin.js", 162);
widget.set('height', currentHeight);
                       }

                       _yuitest_coverline("build/resize-plugin/resize-plugin.js", 165);
if (this._isDifferent(oldWidth, currentWidth)) {
                          _yuitest_coverline("build/resize-plugin/resize-plugin.js", 166);
widget.set('width', currentWidth);
                       }



                       //If the widget uses Y.WidgetPosition, it will also have x,y position support.
                       _yuitest_coverline("build/resize-plugin/resize-plugin.js", 172);
if (widget.hasImpl && widget.hasImpl(Y.WidgetPosition)) {

                           _yuitest_coverline("build/resize-plugin/resize-plugin.js", 174);
if (this._isDifferent(widget.get('x'), x.cur)) {
                               _yuitest_coverline("build/resize-plugin/resize-plugin.js", 175);
widget.set('x', x.cur);
                           }

                           _yuitest_coverline("build/resize-plugin/resize-plugin.js", 178);
if (this._isDifferent(widget.get('y'), y.cur)) {
                               _yuitest_coverline("build/resize-plugin/resize-plugin.js", 179);
widget.set('y', y.cur);
                           }


                       }
                   },

                   /**
                      * a little utility method that returns a value if the old !== new, otherwise it returns false.
                      *
                      * @method _isDifferent
                      * @param {Number} oldVal
                      * @param {Number} newVal
                      * @private
                      */
                   _isDifferent: function(oldVal, newVal) {
                       _yuitest_coverfunc("build/resize-plugin/resize-plugin.js", "_isDifferent", 194);
_yuitest_coverline("build/resize-plugin/resize-plugin.js", 195);
var retValue = false;
                       _yuitest_coverline("build/resize-plugin/resize-plugin.js", 196);
if (oldVal !== newVal) {
                           _yuitest_coverline("build/resize-plugin/resize-plugin.js", 197);
retValue = newVal;
                       }
                       _yuitest_coverline("build/resize-plugin/resize-plugin.js", 199);
return retValue;
                   }


        });
        _yuitest_coverline("build/resize-plugin/resize-plugin.js", 204);
Y.namespace('Plugin');
        _yuitest_coverline("build/resize-plugin/resize-plugin.js", 205);
Y.Plugin.Resize = ResizePlugin;


}, '3.7.3', {"requires": ["resize-base", "plugin"], "optional": ["resize-constrain"]});
