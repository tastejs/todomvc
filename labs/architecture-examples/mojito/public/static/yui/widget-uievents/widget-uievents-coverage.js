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
_yuitest_coverage["build/widget-uievents/widget-uievents.js"] = {
    lines: {},
    functions: {},
    coveredLines: 0,
    calledLines: 0,
    coveredFunctions: 0,
    calledFunctions: 0,
    path: "build/widget-uievents/widget-uievents.js",
    code: []
};
_yuitest_coverage["build/widget-uievents/widget-uievents.js"].code=["YUI.add('widget-uievents', function (Y, NAME) {","","/**"," * Support for Widget UI Events (Custom Events fired by the widget, which wrap the underlying DOM events - e.g. widget:click, widget:mousedown)"," *"," * @module widget"," * @submodule widget-uievents"," */","","var BOUNDING_BOX = \"boundingBox\",","    Widget = Y.Widget,","    RENDER = \"render\",","    L = Y.Lang,","    EVENT_PREFIX_DELIMITER = \":\",","","    //  Map of Node instances serving as a delegation containers for a specific","    //  event type to Widget instances using that delegation container.","    _uievts = Y.Widget._uievts = Y.Widget._uievts || {};","","Y.mix(Widget.prototype, {","","    /**","     * Destructor logic for UI event infrastructure,","     * invoked during Widget destruction.","     *","     * @method _destroyUIEvents","     * @for Widget","     * @private","     */","    _destroyUIEvents: function() {","","        var widgetGuid = Y.stamp(this, true);","","        Y.each(_uievts, function (info, key) {","            if (info.instances[widgetGuid]) {","                //  Unregister this Widget instance as needing this delegated","                //  event listener.","                delete info.instances[widgetGuid];","","                //  There are no more Widget instances using this delegated ","                //  event listener, so detach it.","","                if (Y.Object.isEmpty(info.instances)) {","                    info.handle.detach();","","                    if (_uievts[key]) {","                        delete _uievts[key];","                    }","                }","            }","        });","    },","","    /**","     * Map of DOM events that should be fired as Custom Events by the  ","     * Widget instance.","     *","     * @property UI_EVENTS","     * @for Widget","     * @type Object","     */","    UI_EVENTS: Y.Node.DOM_EVENTS,","","    /**","     * Returns the node on which to bind delegate listeners.","     *","     * @method _getUIEventNode","     * @for Widget","     * @protected","     */","    _getUIEventNode: function () {","        return this.get(BOUNDING_BOX);","    },","","    /**","     * Binds a delegated DOM event listener of the specified type to the ","     * Widget's outtermost DOM element to facilitate the firing of a Custom","     * Event of the same type for the Widget instance.  ","     *","     * @method _createUIEvent","     * @for Widget ","     * @param type {String} String representing the name of the event","     * @private","     */","    _createUIEvent: function (type) {","","        var uiEvtNode = this._getUIEventNode(),","            key = (Y.stamp(uiEvtNode) + type),","            info = _uievts[key],","            handle;","","        //  For each Node instance: Ensure that there is only one delegated","        //  event listener used to fire Widget UI events.","","        if (!info) {","","            handle = uiEvtNode.delegate(type, function (evt) {","","                var widget = Widget.getByNode(this);","","                // Widget could be null if node instance belongs to","                // another Y instance.","","                if (widget) {","                    if (widget._filterUIEvent(evt)) {","                        widget.fire(evt.type, { domEvent: evt });","                    }","                }","","            }, \".\" + Y.Widget.getClassName());","","            _uievts[key] = info = { instances: {}, handle: handle };","        }","","        //  Register this Widget as using this Node as a delegation container.","        info.instances[Y.stamp(this)] = 1;","    },","","    /**","     * This method is used to determine if we should fire","     * the UI Event or not. The default implementation makes sure","     * that for nested delegates (nested unrelated widgets), we don't ","     * fire the UI event listener more than once at each level.","     *","     * <p>For example, without the additional filter, if you have nested ","     * widgets, each widget will have a delegate listener. If you ","     * click on the inner widget, the inner delegate listener's ","     * filter will match once, but the outer will match twice ","     * (based on delegate's design) - once for the inner widget, ","     * and once for the outer.</p>","     *","     * @method _filterUIEvent","     * @for Widget ","     * @param {DOMEventFacade} evt","     * @return {boolean} true if it's OK to fire the custom UI event, false if not.","     * @private","     * ","     */","    _filterUIEvent: function(evt) {","        // Either it's hitting this widget's delegate container (and not some other widget's), ","        // or the container it's hitting is handling this widget's ui events.","        return (evt.currentTarget.compareTo(evt.container) || evt.container.compareTo(this._getUIEventNode()));        ","    },","","    /**","     * Determines if the specified event is a UI event.","     *","     * @private","     * @method _isUIEvent","     * @for Widget ","     * @param type {String} String representing the name of the event","     * @return {String} Event Returns the name of the UI Event, otherwise ","     * undefined.","     */","    _getUIEvent: function (type) {","","        if (L.isString(type)) {","            var sType = this.parseType(type)[1],","                iDelim,","                returnVal;","","            if (sType) {","                // TODO: Get delimiter from ET, or have ET support this.","                iDelim = sType.indexOf(EVENT_PREFIX_DELIMITER);","                if (iDelim > -1) {","                    sType = sType.substring(iDelim + EVENT_PREFIX_DELIMITER.length);","                }","","                if (this.UI_EVENTS[sType]) {","                    returnVal = sType;","                }","            }","","            return returnVal;","        }","    },","","    /**","     * Sets up infrastructure required to fire a UI event.","     * ","     * @private","     * @method _initUIEvent","     * @for Widget","     * @param type {String} String representing the name of the event","     * @return {String}     ","     */","    _initUIEvent: function (type) {","        var sType = this._getUIEvent(type),","            queue = this._uiEvtsInitQueue || {};","","        if (sType && !queue[sType]) {","","            this._uiEvtsInitQueue = queue[sType] = 1;","","            this.after(RENDER, function() { ","                this._createUIEvent(sType);","                delete this._uiEvtsInitQueue[sType];","            });","        }","    },","","    //  Override of \"on\" from Base to facilitate the firing of Widget events","    //  based on DOM events of the same name/type (e.g. \"click\", \"mouseover\").","    //  Temporary solution until we have the ability to listen to when ","    //  someone adds an event listener (bug 2528230)","    on: function (type) {","        this._initUIEvent(type);","        return Widget.superclass.on.apply(this, arguments);","    },","","    //  Override of \"publish\" from Base to facilitate the firing of Widget events","    //  based on DOM events of the same name/type (e.g. \"click\", \"mouseover\").    ","    //  Temporary solution until we have the ability to listen to when ","    //  someone publishes an event (bug 2528230)     ","    publish: function (type, config) {","        var sType = this._getUIEvent(type);","        if (sType && config && config.defaultFn) {","            this._initUIEvent(sType);","        }        ","        return Widget.superclass.publish.apply(this, arguments);","    }","","}, true); // overwrite existing EventTarget methods","","","}, '3.7.3', {\"requires\": [\"node-event-delegate\", \"widget-base\"]});"];
_yuitest_coverage["build/widget-uievents/widget-uievents.js"].lines = {"1":0,"10":0,"20":0,"32":0,"34":0,"35":0,"38":0,"43":0,"44":0,"46":0,"47":0,"72":0,"87":0,"95":0,"97":0,"99":0,"104":0,"105":0,"106":0,"112":0,"116":0,"142":0,"157":0,"158":0,"162":0,"164":0,"165":0,"166":0,"169":0,"170":0,"174":0,"188":0,"191":0,"193":0,"195":0,"196":0,"197":0,"207":0,"208":0,"216":0,"217":0,"218":0,"220":0};
_yuitest_coverage["build/widget-uievents/widget-uievents.js"].functions = {"(anonymous 2):34":0,"_destroyUIEvents:30":0,"_getUIEventNode:71":0,"(anonymous 3):97":0,"_createUIEvent:85":0,"_filterUIEvent:139":0,"_getUIEvent:155":0,"(anonymous 4):195":0,"_initUIEvent:187":0,"on:206":0,"publish:215":0,"(anonymous 1):1":0};
_yuitest_coverage["build/widget-uievents/widget-uievents.js"].coveredLines = 43;
_yuitest_coverage["build/widget-uievents/widget-uievents.js"].coveredFunctions = 12;
_yuitest_coverline("build/widget-uievents/widget-uievents.js", 1);
YUI.add('widget-uievents', function (Y, NAME) {

/**
 * Support for Widget UI Events (Custom Events fired by the widget, which wrap the underlying DOM events - e.g. widget:click, widget:mousedown)
 *
 * @module widget
 * @submodule widget-uievents
 */

_yuitest_coverfunc("build/widget-uievents/widget-uievents.js", "(anonymous 1)", 1);
_yuitest_coverline("build/widget-uievents/widget-uievents.js", 10);
var BOUNDING_BOX = "boundingBox",
    Widget = Y.Widget,
    RENDER = "render",
    L = Y.Lang,
    EVENT_PREFIX_DELIMITER = ":",

    //  Map of Node instances serving as a delegation containers for a specific
    //  event type to Widget instances using that delegation container.
    _uievts = Y.Widget._uievts = Y.Widget._uievts || {};

_yuitest_coverline("build/widget-uievents/widget-uievents.js", 20);
Y.mix(Widget.prototype, {

    /**
     * Destructor logic for UI event infrastructure,
     * invoked during Widget destruction.
     *
     * @method _destroyUIEvents
     * @for Widget
     * @private
     */
    _destroyUIEvents: function() {

        _yuitest_coverfunc("build/widget-uievents/widget-uievents.js", "_destroyUIEvents", 30);
_yuitest_coverline("build/widget-uievents/widget-uievents.js", 32);
var widgetGuid = Y.stamp(this, true);

        _yuitest_coverline("build/widget-uievents/widget-uievents.js", 34);
Y.each(_uievts, function (info, key) {
            _yuitest_coverfunc("build/widget-uievents/widget-uievents.js", "(anonymous 2)", 34);
_yuitest_coverline("build/widget-uievents/widget-uievents.js", 35);
if (info.instances[widgetGuid]) {
                //  Unregister this Widget instance as needing this delegated
                //  event listener.
                _yuitest_coverline("build/widget-uievents/widget-uievents.js", 38);
delete info.instances[widgetGuid];

                //  There are no more Widget instances using this delegated 
                //  event listener, so detach it.

                _yuitest_coverline("build/widget-uievents/widget-uievents.js", 43);
if (Y.Object.isEmpty(info.instances)) {
                    _yuitest_coverline("build/widget-uievents/widget-uievents.js", 44);
info.handle.detach();

                    _yuitest_coverline("build/widget-uievents/widget-uievents.js", 46);
if (_uievts[key]) {
                        _yuitest_coverline("build/widget-uievents/widget-uievents.js", 47);
delete _uievts[key];
                    }
                }
            }
        });
    },

    /**
     * Map of DOM events that should be fired as Custom Events by the  
     * Widget instance.
     *
     * @property UI_EVENTS
     * @for Widget
     * @type Object
     */
    UI_EVENTS: Y.Node.DOM_EVENTS,

    /**
     * Returns the node on which to bind delegate listeners.
     *
     * @method _getUIEventNode
     * @for Widget
     * @protected
     */
    _getUIEventNode: function () {
        _yuitest_coverfunc("build/widget-uievents/widget-uievents.js", "_getUIEventNode", 71);
_yuitest_coverline("build/widget-uievents/widget-uievents.js", 72);
return this.get(BOUNDING_BOX);
    },

    /**
     * Binds a delegated DOM event listener of the specified type to the 
     * Widget's outtermost DOM element to facilitate the firing of a Custom
     * Event of the same type for the Widget instance.  
     *
     * @method _createUIEvent
     * @for Widget 
     * @param type {String} String representing the name of the event
     * @private
     */
    _createUIEvent: function (type) {

        _yuitest_coverfunc("build/widget-uievents/widget-uievents.js", "_createUIEvent", 85);
_yuitest_coverline("build/widget-uievents/widget-uievents.js", 87);
var uiEvtNode = this._getUIEventNode(),
            key = (Y.stamp(uiEvtNode) + type),
            info = _uievts[key],
            handle;

        //  For each Node instance: Ensure that there is only one delegated
        //  event listener used to fire Widget UI events.

        _yuitest_coverline("build/widget-uievents/widget-uievents.js", 95);
if (!info) {

            _yuitest_coverline("build/widget-uievents/widget-uievents.js", 97);
handle = uiEvtNode.delegate(type, function (evt) {

                _yuitest_coverfunc("build/widget-uievents/widget-uievents.js", "(anonymous 3)", 97);
_yuitest_coverline("build/widget-uievents/widget-uievents.js", 99);
var widget = Widget.getByNode(this);

                // Widget could be null if node instance belongs to
                // another Y instance.

                _yuitest_coverline("build/widget-uievents/widget-uievents.js", 104);
if (widget) {
                    _yuitest_coverline("build/widget-uievents/widget-uievents.js", 105);
if (widget._filterUIEvent(evt)) {
                        _yuitest_coverline("build/widget-uievents/widget-uievents.js", 106);
widget.fire(evt.type, { domEvent: evt });
                    }
                }

            }, "." + Y.Widget.getClassName());

            _yuitest_coverline("build/widget-uievents/widget-uievents.js", 112);
_uievts[key] = info = { instances: {}, handle: handle };
        }

        //  Register this Widget as using this Node as a delegation container.
        _yuitest_coverline("build/widget-uievents/widget-uievents.js", 116);
info.instances[Y.stamp(this)] = 1;
    },

    /**
     * This method is used to determine if we should fire
     * the UI Event or not. The default implementation makes sure
     * that for nested delegates (nested unrelated widgets), we don't 
     * fire the UI event listener more than once at each level.
     *
     * <p>For example, without the additional filter, if you have nested 
     * widgets, each widget will have a delegate listener. If you 
     * click on the inner widget, the inner delegate listener's 
     * filter will match once, but the outer will match twice 
     * (based on delegate's design) - once for the inner widget, 
     * and once for the outer.</p>
     *
     * @method _filterUIEvent
     * @for Widget 
     * @param {DOMEventFacade} evt
     * @return {boolean} true if it's OK to fire the custom UI event, false if not.
     * @private
     * 
     */
    _filterUIEvent: function(evt) {
        // Either it's hitting this widget's delegate container (and not some other widget's), 
        // or the container it's hitting is handling this widget's ui events.
        _yuitest_coverfunc("build/widget-uievents/widget-uievents.js", "_filterUIEvent", 139);
_yuitest_coverline("build/widget-uievents/widget-uievents.js", 142);
return (evt.currentTarget.compareTo(evt.container) || evt.container.compareTo(this._getUIEventNode()));        
    },

    /**
     * Determines if the specified event is a UI event.
     *
     * @private
     * @method _isUIEvent
     * @for Widget 
     * @param type {String} String representing the name of the event
     * @return {String} Event Returns the name of the UI Event, otherwise 
     * undefined.
     */
    _getUIEvent: function (type) {

        _yuitest_coverfunc("build/widget-uievents/widget-uievents.js", "_getUIEvent", 155);
_yuitest_coverline("build/widget-uievents/widget-uievents.js", 157);
if (L.isString(type)) {
            _yuitest_coverline("build/widget-uievents/widget-uievents.js", 158);
var sType = this.parseType(type)[1],
                iDelim,
                returnVal;

            _yuitest_coverline("build/widget-uievents/widget-uievents.js", 162);
if (sType) {
                // TODO: Get delimiter from ET, or have ET support this.
                _yuitest_coverline("build/widget-uievents/widget-uievents.js", 164);
iDelim = sType.indexOf(EVENT_PREFIX_DELIMITER);
                _yuitest_coverline("build/widget-uievents/widget-uievents.js", 165);
if (iDelim > -1) {
                    _yuitest_coverline("build/widget-uievents/widget-uievents.js", 166);
sType = sType.substring(iDelim + EVENT_PREFIX_DELIMITER.length);
                }

                _yuitest_coverline("build/widget-uievents/widget-uievents.js", 169);
if (this.UI_EVENTS[sType]) {
                    _yuitest_coverline("build/widget-uievents/widget-uievents.js", 170);
returnVal = sType;
                }
            }

            _yuitest_coverline("build/widget-uievents/widget-uievents.js", 174);
return returnVal;
        }
    },

    /**
     * Sets up infrastructure required to fire a UI event.
     * 
     * @private
     * @method _initUIEvent
     * @for Widget
     * @param type {String} String representing the name of the event
     * @return {String}     
     */
    _initUIEvent: function (type) {
        _yuitest_coverfunc("build/widget-uievents/widget-uievents.js", "_initUIEvent", 187);
_yuitest_coverline("build/widget-uievents/widget-uievents.js", 188);
var sType = this._getUIEvent(type),
            queue = this._uiEvtsInitQueue || {};

        _yuitest_coverline("build/widget-uievents/widget-uievents.js", 191);
if (sType && !queue[sType]) {

            _yuitest_coverline("build/widget-uievents/widget-uievents.js", 193);
this._uiEvtsInitQueue = queue[sType] = 1;

            _yuitest_coverline("build/widget-uievents/widget-uievents.js", 195);
this.after(RENDER, function() { 
                _yuitest_coverfunc("build/widget-uievents/widget-uievents.js", "(anonymous 4)", 195);
_yuitest_coverline("build/widget-uievents/widget-uievents.js", 196);
this._createUIEvent(sType);
                _yuitest_coverline("build/widget-uievents/widget-uievents.js", 197);
delete this._uiEvtsInitQueue[sType];
            });
        }
    },

    //  Override of "on" from Base to facilitate the firing of Widget events
    //  based on DOM events of the same name/type (e.g. "click", "mouseover").
    //  Temporary solution until we have the ability to listen to when 
    //  someone adds an event listener (bug 2528230)
    on: function (type) {
        _yuitest_coverfunc("build/widget-uievents/widget-uievents.js", "on", 206);
_yuitest_coverline("build/widget-uievents/widget-uievents.js", 207);
this._initUIEvent(type);
        _yuitest_coverline("build/widget-uievents/widget-uievents.js", 208);
return Widget.superclass.on.apply(this, arguments);
    },

    //  Override of "publish" from Base to facilitate the firing of Widget events
    //  based on DOM events of the same name/type (e.g. "click", "mouseover").    
    //  Temporary solution until we have the ability to listen to when 
    //  someone publishes an event (bug 2528230)     
    publish: function (type, config) {
        _yuitest_coverfunc("build/widget-uievents/widget-uievents.js", "publish", 215);
_yuitest_coverline("build/widget-uievents/widget-uievents.js", 216);
var sType = this._getUIEvent(type);
        _yuitest_coverline("build/widget-uievents/widget-uievents.js", 217);
if (sType && config && config.defaultFn) {
            _yuitest_coverline("build/widget-uievents/widget-uievents.js", 218);
this._initUIEvent(sType);
        }        
        _yuitest_coverline("build/widget-uievents/widget-uievents.js", 220);
return Widget.superclass.publish.apply(this, arguments);
    }

}, true); // overwrite existing EventTarget methods


}, '3.7.3', {"requires": ["node-event-delegate", "widget-base"]});
