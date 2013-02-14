/*
YUI 3.7.3 (build 5687)
Copyright 2012 Yahoo! Inc. All rights reserved.
Licensed under the BSD License.
http://yuilibrary.com/license/
*/
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
        var Drag = function(config) {
                if (Y.Widget && config.host instanceof Y.Widget) {
                        config.node = config.host.get('boundingBox');
                        config.widget = config.host;
                } else {
                        config.node = config.host;
                        config.widget = false;
                }
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
        Drag.NAME = "dd-plugin";

        /**
        * @property NS
        * @description The Drag instance will be placed on the Node instance under the dd namespace. It can be accessed via Node.dd;
        * @type {String}
        */
        Drag.NS = "dd";

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
                        var r = false;
                        if (widget) {
                                r = (widget.hasImpl && widget.hasImpl(Y.WidgetPosition)) ? true : false;
                        }
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
                    if (this._widget) {
                        //It's a widget
                        if (this.proxy) {
                            //It's a proxy
                            if (this._widgetHandles.length > 0) {
                                //Remove Listeners
                                this._removeWidgetListeners();
                            }
                        } else {
                            if (this._widgetHandles.length === 0) {
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
                    Y.Array.each(this._widgetHandles, function(handle) {
                        handle.detach();
                    });
                    this._widgetHandles = [];
                },
                /**
                * If this is a Widget, then attach the positioning listeners
                * @method _attachWidgetListeners
                * @private
                */
                _attachWidgetListeners: function() {
                        //if this thing is a widget, and it uses widgetposition...
                        if (this._usesWidgetPosition(this._widget)) {

                               //set the x,y on the widget's ATTRS
                               this._widgetHandles.push(this.on(EV_DRAG, this._setWidgetCoords));

                               //store the new position that the widget ends up on
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

                        this._widgetHandles = [];

                        this._widget = config.widget;

                        this.on(EV_START, this._checkEvents); //Always run, don't check

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
                        var nodeXY = this._stoppedPosition || e.target.nodeXY,
                         realXY = e.target.realXY,

                         //amount moved = [(x2 - x1) , (y2 - y1)]
                         movedXY = [realXY[0] - nodeXY[0], realXY[1] - nodeXY[1]];

                         //if both have changed..
                         if (movedXY[0] !== 0 && movedXY[1] !== 0) {
                                 this._widget.set('xy', realXY);
                         }

                         //if only x is 0, set the Y
                         else if (movedXY[0] === 0) {
                                 this._widget.set('y',realXY[1]);
                         }

                         //otherwise, y is 0, so set X
                         else if (movedXY[1] === 0){
                                 this._widget.set('x', realXY[0]);
                         }
                },

                /**
                * Updates the last position where the widget was stopped.
                *
                * @method _updateStopPosition
                * @param {EventFacade} e Event Facade
                * @private
                */
                _updateStopPosition: function(e) {
                        this._stoppedPosition = e.target.realXY;
                }
        });

        Y.namespace('Plugin');
        Y.Plugin.Drag = Drag;





}, '3.7.3', {"optional": ["dd-constrain", "dd-proxy"], "requires": ["dd-drag"]});
