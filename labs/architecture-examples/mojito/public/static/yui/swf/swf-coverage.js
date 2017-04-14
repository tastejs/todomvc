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
_yuitest_coverage["build/swf/swf.js"] = {
    lines: {},
    functions: {},
    coveredLines: 0,
    calledLines: 0,
    coveredFunctions: 0,
    calledFunctions: 0,
    path: "build/swf/swf.js",
    code: []
};
_yuitest_coverage["build/swf/swf.js"].code=["YUI.add('swf', function (Y, NAME) {","","/**"," * Embed a Flash applications in a standard manner and communicate with it"," * via External Interface."," * @module swf"," */","","    var Event = Y.Event,","        SWFDetect = Y.SWFDetect,","        Lang = Y.Lang,","        uA = Y.UA,","        Node = Y.Node,","        Escape = Y.Escape,","","        // private","        FLASH_CID = \"clsid:d27cdb6e-ae6d-11cf-96b8-444553540000\",","        FLASH_TYPE = \"application/x-shockwave-flash\",","        FLASH_VER = \"10.0.22\",","        EXPRESS_INSTALL_URL = \"http://fpdownload.macromedia.com/pub/flashplayer/update/current/swf/autoUpdater.swf?\" + Math.random(),","        EVENT_HANDLER = \"SWF.eventHandler\",","        possibleAttributes = {align:\"\", allowFullScreen:\"\", allowNetworking:\"\", allowScriptAccess:\"\", base:\"\", bgcolor:\"\", loop:\"\", menu:\"\", name:\"\", play: \"\", quality:\"\", salign:\"\", scale:\"\", tabindex:\"\", wmode:\"\"};","","        /**","         * The SWF utility is a tool for embedding Flash applications in HTML pages.","         * @module swf","         * @title SWF Utility","         * @requires event-custom, node, swfdetect","         */","","        /**","         * Creates the SWF instance and keeps the configuration data","         *","         * @class SWF","         * @augments Y.Event.Target","         * @constructor","         * @param {String|HTMLElement} id The id of the element, or the element itself that the SWF will be inserted into.","         *        The width and height of the SWF will be set to the width and height of this container element.","         * @param {String} swfURL The URL of the SWF to be embedded into the page.","         * @param {Object} p_oAttributes (optional) Configuration parameters for the Flash application and values for Flashvars","         *        to be passed to the SWF. The p_oAttributes object allows the following additional properties:","         *        <dl>","         *          <dt>version : String</dt>","         *          <dd>The minimum version of Flash required on the user's machine.</dd>","         *          <dt>fixedAttributes : Object</dt>","         *          <dd>An object literal containing one or more of the following String keys and their values: <code>align,","         *              allowFullScreen, allowNetworking, allowScriptAccess, base, bgcolor, menu, name, quality, salign, scale,","         *              tabindex, wmode.</code> event from the thumb</dd>","         *        </dl>","         */","","function SWF (p_oElement /*:String*/, swfURL /*:String*/, p_oAttributes /*:Object*/ ) {","","    this._id = Y.guid(\"yuiswf\");","","","    var _id = this._id;","    var oElement = Node.one(p_oElement);","    ","    var p_oAttributes = p_oAttributes || {};","","    var flashVersion = p_oAttributes.version || FLASH_VER;","","    var flashVersionSplit = (flashVersion + '').split(\".\");","    var isFlashVersionRight = SWFDetect.isFlashVersionAtLeast(parseInt(flashVersionSplit[0], 10), parseInt(flashVersionSplit[1], 10), parseInt(flashVersionSplit[2], 10));","    var canExpressInstall = (SWFDetect.isFlashVersionAtLeast(8,0,0));","    var shouldExpressInstall = canExpressInstall && !isFlashVersionRight && p_oAttributes.useExpressInstall;","    var flashURL = (shouldExpressInstall)?EXPRESS_INSTALL_URL:swfURL;","    var objstring = '<object ';","    var w, h;","    var flashvarstring = \"yId=\" + Y.id + \"&YUISwfId=\" + _id + \"&YUIBridgeCallback=\" + EVENT_HANDLER + \"&allowedDomain=\" + document.location.hostname;","","    Y.SWF._instances[_id] = this;","    if (oElement && (isFlashVersionRight || shouldExpressInstall) && flashURL) {","        objstring += 'id=\"' + _id + '\" ';","        if (uA.ie) {","            objstring += 'classid=\"' + FLASH_CID + '\" ';","        } else {","            objstring += 'type=\"' + FLASH_TYPE + '\" data=\"' + Escape.html(flashURL) + '\" ';","        }","","        w = \"100%\";","        h = \"100%\";","","        objstring += 'width=\"' + w + '\" height=\"' + h + '\">';","","        if (uA.ie) {","            objstring += '<param name=\"movie\" value=\"' + Escape.html(flashURL) + '\"/>';","        }","","        for (var attribute in p_oAttributes.fixedAttributes) {","            if (possibleAttributes.hasOwnProperty(attribute)) {","                objstring += '<param name=\"' + Escape.html(attribute) + '\" value=\"' + Escape.html(p_oAttributes.fixedAttributes[attribute]) + '\"/>';","            }","        }","","        for (var flashvar in p_oAttributes.flashVars) {","            var fvar = p_oAttributes.flashVars[flashvar];","            if (Lang.isString(fvar)) {","                flashvarstring += \"&\" + Escape.html(flashvar) + \"=\" + Escape.html(encodeURIComponent(fvar));","            }","        }","","        if (flashvarstring) {","            objstring += '<param name=\"flashVars\" value=\"' + flashvarstring + '\"/>';","        }","","        objstring += \"</object>\";","        //using innerHTML as setHTML/setContent causes some issues with ExternalInterface for IE versions of the player","        oElement.set(\"innerHTML\", objstring);","        ","        this._swf = Node.one(\"#\" + _id);","    } else {","        /**","         * Fired when the Flash player version on the user's machine is","         * below the required value.","         *","         * @event wrongflashversion","         */","        var event = {};","        event.type = \"wrongflashversion\";","        this.publish(\"wrongflashversion\", {fireOnce:true});","        this.fire(\"wrongflashversion\", event);","    }","}","","/**"," * @private"," * The static collection of all instances of the SWFs on the page."," * @property _instances"," * @type Object"," */","","SWF._instances = SWF._instances || {};","","/**"," * @private"," * Handles an event coming from within the SWF and delegate it"," * to a specific instance of SWF."," * @method eventHandler"," * @param swfid {String} the id of the SWF dispatching the event"," * @param event {Object} the event being transmitted."," */","SWF.eventHandler = function (swfid, event) {","    SWF._instances[swfid]._eventHandler(event);","};","","SWF.prototype = {","    /**","     * @private","     * Propagates a specific event from Flash to JS.","     * @method _eventHandler","     * @param event {Object} The event to be propagated from Flash.","     */","    _eventHandler: function(event) {","        if (event.type === \"swfReady\") {","            this.publish(\"swfReady\", {fireOnce:true});","            this.fire(\"swfReady\", event);","        } else if(event.type === \"log\") {","        } else {","            this.fire(event.type, event);","        }","    },","","        /**","     * Calls a specific function exposed by the SWF's","     * ExternalInterface.","     * @method callSWF","     * @param func {String} the name of the function to call","     * @param args {Array} the set of arguments to pass to the function.","     */","    ","    callSWF: function (func, args)","    {","    if (!args) { ","          args= []; ","    }   ","        if (this._swf._node[func]) {","        return(this._swf._node[func].apply(this._swf._node, args));","        } else {","        return null;","        }","    },","    ","    /**","     * Public accessor to the unique name of the SWF instance.","     *","     * @method toString","     * @return {String} Unique name of the SWF instance.","     */","    toString: function()","    {","        return \"SWF \" + this._id;","    }","};","","Y.augment(SWF, Y.EventTarget);","","Y.SWF = SWF;","","","}, '3.7.3', {\"requires\": [\"event-custom\", \"node\", \"swfdetect\", \"escape\"]});"];
_yuitest_coverage["build/swf/swf.js"].lines = {"1":0,"9":0,"52":0,"54":0,"57":0,"58":0,"60":0,"62":0,"64":0,"65":0,"66":0,"67":0,"68":0,"69":0,"70":0,"71":0,"73":0,"74":0,"75":0,"76":0,"77":0,"79":0,"82":0,"83":0,"85":0,"87":0,"88":0,"91":0,"92":0,"93":0,"97":0,"98":0,"99":0,"100":0,"104":0,"105":0,"108":0,"110":0,"112":0,"120":0,"121":0,"122":0,"123":0,"134":0,"144":0,"145":0,"148":0,"156":0,"157":0,"158":0,"159":0,"161":0,"175":0,"176":0,"178":0,"179":0,"181":0,"193":0,"197":0,"199":0};
_yuitest_coverage["build/swf/swf.js"].functions = {"SWF:52":0,"eventHandler:144":0,"_eventHandler:155":0,"callSWF:173":0,"toString:191":0,"(anonymous 1):1":0};
_yuitest_coverage["build/swf/swf.js"].coveredLines = 60;
_yuitest_coverage["build/swf/swf.js"].coveredFunctions = 6;
_yuitest_coverline("build/swf/swf.js", 1);
YUI.add('swf', function (Y, NAME) {

/**
 * Embed a Flash applications in a standard manner and communicate with it
 * via External Interface.
 * @module swf
 */

    _yuitest_coverfunc("build/swf/swf.js", "(anonymous 1)", 1);
_yuitest_coverline("build/swf/swf.js", 9);
var Event = Y.Event,
        SWFDetect = Y.SWFDetect,
        Lang = Y.Lang,
        uA = Y.UA,
        Node = Y.Node,
        Escape = Y.Escape,

        // private
        FLASH_CID = "clsid:d27cdb6e-ae6d-11cf-96b8-444553540000",
        FLASH_TYPE = "application/x-shockwave-flash",
        FLASH_VER = "10.0.22",
        EXPRESS_INSTALL_URL = "http://fpdownload.macromedia.com/pub/flashplayer/update/current/swf/autoUpdater.swf?" + Math.random(),
        EVENT_HANDLER = "SWF.eventHandler",
        possibleAttributes = {align:"", allowFullScreen:"", allowNetworking:"", allowScriptAccess:"", base:"", bgcolor:"", loop:"", menu:"", name:"", play: "", quality:"", salign:"", scale:"", tabindex:"", wmode:""};

        /**
         * The SWF utility is a tool for embedding Flash applications in HTML pages.
         * @module swf
         * @title SWF Utility
         * @requires event-custom, node, swfdetect
         */

        /**
         * Creates the SWF instance and keeps the configuration data
         *
         * @class SWF
         * @augments Y.Event.Target
         * @constructor
         * @param {String|HTMLElement} id The id of the element, or the element itself that the SWF will be inserted into.
         *        The width and height of the SWF will be set to the width and height of this container element.
         * @param {String} swfURL The URL of the SWF to be embedded into the page.
         * @param {Object} p_oAttributes (optional) Configuration parameters for the Flash application and values for Flashvars
         *        to be passed to the SWF. The p_oAttributes object allows the following additional properties:
         *        <dl>
         *          <dt>version : String</dt>
         *          <dd>The minimum version of Flash required on the user's machine.</dd>
         *          <dt>fixedAttributes : Object</dt>
         *          <dd>An object literal containing one or more of the following String keys and their values: <code>align,
         *              allowFullScreen, allowNetworking, allowScriptAccess, base, bgcolor, menu, name, quality, salign, scale,
         *              tabindex, wmode.</code> event from the thumb</dd>
         *        </dl>
         */

_yuitest_coverline("build/swf/swf.js", 52);
function SWF (p_oElement /*:String*/, swfURL /*:String*/, p_oAttributes /*:Object*/ ) {

    _yuitest_coverfunc("build/swf/swf.js", "SWF", 52);
_yuitest_coverline("build/swf/swf.js", 54);
this._id = Y.guid("yuiswf");


    _yuitest_coverline("build/swf/swf.js", 57);
var _id = this._id;
    _yuitest_coverline("build/swf/swf.js", 58);
var oElement = Node.one(p_oElement);
    
    _yuitest_coverline("build/swf/swf.js", 60);
var p_oAttributes = p_oAttributes || {};

    _yuitest_coverline("build/swf/swf.js", 62);
var flashVersion = p_oAttributes.version || FLASH_VER;

    _yuitest_coverline("build/swf/swf.js", 64);
var flashVersionSplit = (flashVersion + '').split(".");
    _yuitest_coverline("build/swf/swf.js", 65);
var isFlashVersionRight = SWFDetect.isFlashVersionAtLeast(parseInt(flashVersionSplit[0], 10), parseInt(flashVersionSplit[1], 10), parseInt(flashVersionSplit[2], 10));
    _yuitest_coverline("build/swf/swf.js", 66);
var canExpressInstall = (SWFDetect.isFlashVersionAtLeast(8,0,0));
    _yuitest_coverline("build/swf/swf.js", 67);
var shouldExpressInstall = canExpressInstall && !isFlashVersionRight && p_oAttributes.useExpressInstall;
    _yuitest_coverline("build/swf/swf.js", 68);
var flashURL = (shouldExpressInstall)?EXPRESS_INSTALL_URL:swfURL;
    _yuitest_coverline("build/swf/swf.js", 69);
var objstring = '<object ';
    _yuitest_coverline("build/swf/swf.js", 70);
var w, h;
    _yuitest_coverline("build/swf/swf.js", 71);
var flashvarstring = "yId=" + Y.id + "&YUISwfId=" + _id + "&YUIBridgeCallback=" + EVENT_HANDLER + "&allowedDomain=" + document.location.hostname;

    _yuitest_coverline("build/swf/swf.js", 73);
Y.SWF._instances[_id] = this;
    _yuitest_coverline("build/swf/swf.js", 74);
if (oElement && (isFlashVersionRight || shouldExpressInstall) && flashURL) {
        _yuitest_coverline("build/swf/swf.js", 75);
objstring += 'id="' + _id + '" ';
        _yuitest_coverline("build/swf/swf.js", 76);
if (uA.ie) {
            _yuitest_coverline("build/swf/swf.js", 77);
objstring += 'classid="' + FLASH_CID + '" ';
        } else {
            _yuitest_coverline("build/swf/swf.js", 79);
objstring += 'type="' + FLASH_TYPE + '" data="' + Escape.html(flashURL) + '" ';
        }

        _yuitest_coverline("build/swf/swf.js", 82);
w = "100%";
        _yuitest_coverline("build/swf/swf.js", 83);
h = "100%";

        _yuitest_coverline("build/swf/swf.js", 85);
objstring += 'width="' + w + '" height="' + h + '">';

        _yuitest_coverline("build/swf/swf.js", 87);
if (uA.ie) {
            _yuitest_coverline("build/swf/swf.js", 88);
objstring += '<param name="movie" value="' + Escape.html(flashURL) + '"/>';
        }

        _yuitest_coverline("build/swf/swf.js", 91);
for (var attribute in p_oAttributes.fixedAttributes) {
            _yuitest_coverline("build/swf/swf.js", 92);
if (possibleAttributes.hasOwnProperty(attribute)) {
                _yuitest_coverline("build/swf/swf.js", 93);
objstring += '<param name="' + Escape.html(attribute) + '" value="' + Escape.html(p_oAttributes.fixedAttributes[attribute]) + '"/>';
            }
        }

        _yuitest_coverline("build/swf/swf.js", 97);
for (var flashvar in p_oAttributes.flashVars) {
            _yuitest_coverline("build/swf/swf.js", 98);
var fvar = p_oAttributes.flashVars[flashvar];
            _yuitest_coverline("build/swf/swf.js", 99);
if (Lang.isString(fvar)) {
                _yuitest_coverline("build/swf/swf.js", 100);
flashvarstring += "&" + Escape.html(flashvar) + "=" + Escape.html(encodeURIComponent(fvar));
            }
        }

        _yuitest_coverline("build/swf/swf.js", 104);
if (flashvarstring) {
            _yuitest_coverline("build/swf/swf.js", 105);
objstring += '<param name="flashVars" value="' + flashvarstring + '"/>';
        }

        _yuitest_coverline("build/swf/swf.js", 108);
objstring += "</object>";
        //using innerHTML as setHTML/setContent causes some issues with ExternalInterface for IE versions of the player
        _yuitest_coverline("build/swf/swf.js", 110);
oElement.set("innerHTML", objstring);
        
        _yuitest_coverline("build/swf/swf.js", 112);
this._swf = Node.one("#" + _id);
    } else {
        /**
         * Fired when the Flash player version on the user's machine is
         * below the required value.
         *
         * @event wrongflashversion
         */
        _yuitest_coverline("build/swf/swf.js", 120);
var event = {};
        _yuitest_coverline("build/swf/swf.js", 121);
event.type = "wrongflashversion";
        _yuitest_coverline("build/swf/swf.js", 122);
this.publish("wrongflashversion", {fireOnce:true});
        _yuitest_coverline("build/swf/swf.js", 123);
this.fire("wrongflashversion", event);
    }
}

/**
 * @private
 * The static collection of all instances of the SWFs on the page.
 * @property _instances
 * @type Object
 */

_yuitest_coverline("build/swf/swf.js", 134);
SWF._instances = SWF._instances || {};

/**
 * @private
 * Handles an event coming from within the SWF and delegate it
 * to a specific instance of SWF.
 * @method eventHandler
 * @param swfid {String} the id of the SWF dispatching the event
 * @param event {Object} the event being transmitted.
 */
_yuitest_coverline("build/swf/swf.js", 144);
SWF.eventHandler = function (swfid, event) {
    _yuitest_coverfunc("build/swf/swf.js", "eventHandler", 144);
_yuitest_coverline("build/swf/swf.js", 145);
SWF._instances[swfid]._eventHandler(event);
};

_yuitest_coverline("build/swf/swf.js", 148);
SWF.prototype = {
    /**
     * @private
     * Propagates a specific event from Flash to JS.
     * @method _eventHandler
     * @param event {Object} The event to be propagated from Flash.
     */
    _eventHandler: function(event) {
        _yuitest_coverfunc("build/swf/swf.js", "_eventHandler", 155);
_yuitest_coverline("build/swf/swf.js", 156);
if (event.type === "swfReady") {
            _yuitest_coverline("build/swf/swf.js", 157);
this.publish("swfReady", {fireOnce:true});
            _yuitest_coverline("build/swf/swf.js", 158);
this.fire("swfReady", event);
        } else {_yuitest_coverline("build/swf/swf.js", 159);
if(event.type === "log") {
        } else {
            _yuitest_coverline("build/swf/swf.js", 161);
this.fire(event.type, event);
        }}
    },

        /**
     * Calls a specific function exposed by the SWF's
     * ExternalInterface.
     * @method callSWF
     * @param func {String} the name of the function to call
     * @param args {Array} the set of arguments to pass to the function.
     */
    
    callSWF: function (func, args)
    {
    _yuitest_coverfunc("build/swf/swf.js", "callSWF", 173);
_yuitest_coverline("build/swf/swf.js", 175);
if (!args) { 
          _yuitest_coverline("build/swf/swf.js", 176);
args= []; 
    }   
        _yuitest_coverline("build/swf/swf.js", 178);
if (this._swf._node[func]) {
        _yuitest_coverline("build/swf/swf.js", 179);
return(this._swf._node[func].apply(this._swf._node, args));
        } else {
        _yuitest_coverline("build/swf/swf.js", 181);
return null;
        }
    },
    
    /**
     * Public accessor to the unique name of the SWF instance.
     *
     * @method toString
     * @return {String} Unique name of the SWF instance.
     */
    toString: function()
    {
        _yuitest_coverfunc("build/swf/swf.js", "toString", 191);
_yuitest_coverline("build/swf/swf.js", 193);
return "SWF " + this._id;
    }
};

_yuitest_coverline("build/swf/swf.js", 197);
Y.augment(SWF, Y.EventTarget);

_yuitest_coverline("build/swf/swf.js", 199);
Y.SWF = SWF;


}, '3.7.3', {"requires": ["event-custom", "node", "swfdetect", "escape"]});
