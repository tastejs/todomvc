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
_yuitest_coverage["build/calendarnavigator/calendarnavigator.js"] = {
    lines: {},
    functions: {},
    coveredLines: 0,
    calledLines: 0,
    coveredFunctions: 0,
    calledFunctions: 0,
    path: "build/calendarnavigator/calendarnavigator.js",
    code: []
};
_yuitest_coverage["build/calendarnavigator/calendarnavigator.js"].code=["YUI.add('calendarnavigator', function (Y, NAME) {","","/**"," * Provides a plugin which adds navigation controls to Calendar."," *"," * @module calendarnavigator"," */","var CONTENT_BOX = \"contentBox\",","    HOST        = \"host\",","    RENDERED    = \"rendered\",","    getCN       = Y.ClassNameManager.getClassName,","    substitute  = Y.substitute,","    node        = Y.Node,","    create      = node.create,","    CALENDAR    = 'calendar',","    CALENDARNAV = 'calendarnav',","    CAL_HD      = getCN(CALENDAR, 'header'),","    CAL_PREV_M  = getCN(CALENDARNAV, 'prevmonth'),","    CAL_NEXT_M  = getCN(CALENDARNAV, 'nextmonth'),","    CAL_DIS_M   = getCN(CALENDARNAV, 'month-disabled'),","    ydate       = Y.DataType.Date;","/**"," * A plugin class which adds navigation controls to Calendar."," *"," * @class CalendarNavigator"," * @extends Plugin.Base"," * @namespace Plugin"," */","function CalendarNavigator(config) {","    CalendarNavigator.superclass.constructor.apply(this, arguments);","}","","/**"," * The namespace for the plugin. This will be the property on the widget, which will "," * reference the plugin instance, when it's plugged in."," *"," * @property NS"," * @static"," * @type String"," * @default \"navigator\""," */","CalendarNavigator.NS = \"navigator\";","","/**"," * The NAME of the CalendarNavigator class. Used to prefix events generated"," * by the plugin class."," *"," * @property NAME"," * @static"," * @type String"," * @default \"pluginCalendarNavigator\""," */","CalendarNavigator.NAME = \"pluginCalendarNavigator\";","","","/**"," * Static property used to define the default attribute "," * configuration for the plugin."," *"," * @property ATTRS"," * @type Object"," * @static"," */","CalendarNavigator.ATTRS = {","","    /**","     * The number of months to shift by when the control arrows are clicked.","     *","     * @attribute shiftByMonths","     * @type Number","     * @default 1 (months)","     */","    shiftByMonths : {","        value: 1","    }","};","","   /**","    * The CSS classnames for the calendar navigator controls.","    * @property CALENDARNAV_STRINGS","    * @type Object","    * @readOnly","    * @protected","    * @static","    */ ","CalendarNavigator.CALENDARNAV_STRINGS = {","   prev_month_class: CAL_PREV_M,","   next_month_class: CAL_NEXT_M","};","","   /**","    * The template for the calendar navigator previous month control.","    * @property PREV_MONTH_CONTROL_TEMPLATE","    * @type String","    * @protected","    * @static","    */ ","CalendarNavigator.PREV_MONTH_CONTROL_TEMPLATE = '<a class=\"yui3-u {prev_month_class}\" role=\"button\" aria-label=\"{prev_month_arialabel}\" tabindex=\"{control_tabindex}\">' + ","                                                   \"<span>&lt;</span>\" +","                                                '</a>';","   /**","    * The template for the calendar navigator next month control.","    * @property NEXT_MONTH_CONTROL_TEMPLATE","    * @type String","    * @readOnly","    * @protected","    * @static","    */ ","CalendarNavigator.NEXT_MONTH_CONTROL_TEMPLATE = '<a class=\"yui3-u {next_month_class}\" role=\"button\" aria-label=\"{next_month_arialabel}\" tabindex=\"{control_tabindex}\">' + ","                                                   \"<span>&gt;</span>\" +","                                                '</a>';","","","Y.extend(CalendarNavigator, Y.Plugin.Base, {","","    _eventAttachments : {},","    _controls: {},","","    /**","     * The initializer lifecycle implementation. Modifies the host widget's ","     * render to add navigation controls.","     *","     * @method initializer","     * @param {Object} config The user configuration for the plugin  ","     */","    initializer : function(config) {","","        // After the host has rendered its UI, place the navigation cotnrols","        this._controls = {};","        this._eventAttachments = {};","","        this.afterHostMethod(\"renderUI\", this._initNavigationControls);","    },","","    /**","     * The initializer destructor implementation. Responsible for destroying the initialized","     * control mechanisms.","     * ","     * @method destructor","     */","    destructor : function() {","       ","    },","","    /**","     * Private utility method that focuses on a navigation button when it is clicked","     * or pressed with a keyboard.","     * ","     * @method _focusNavigation","     * @param {Event} ev Click or keydown event from the controls","     * @protected","     */","    _focusNavigation : function (ev) {","        ev.currentTarget.focus();","    },","","    /**","     * Private utility method that subtracts months from the host calendar date","     * based on the control click and the shiftByMonths property.","     * ","     * @method _subtractMonths","     * @param {Event} ev Click event from the controls","     * @protected","     */","    _subtractMonths : function (ev) {","        if ( (ev.type === \"click\") || (ev.type === \"keydown\" && (ev.keyCode == 13 || ev.keyCode == 32)) ) {","           var host = this.get(HOST);","           var oldDate = host.get(\"date\");","           host.set(\"date\", ydate.addMonths(oldDate, -1*this.get(\"shiftByMonths\")));","           ev.preventDefault();","       }","    },","","    /**","     * Private utility method that adds months to the host calendar date","     * based on the control click and the shiftByMonths property.","     * ","     * @method _addMonths","     * @param {Event} ev Click event from the controls","     * @protected","     */","    _addMonths : function (ev) {","        if ( (ev.type === \"click\") || (ev.type === \"keydown\" && (ev.keyCode == 13 || ev.keyCode == 32)) ) {","           var host = this.get(HOST);","           var oldDate = host.get(\"date\");","           host.set(\"date\", ydate.addMonths(oldDate, this.get(\"shiftByMonths\")));","           ev.preventDefault();","       }","    },","","","    _updateControlState : function () {","","        var host = this.get(HOST);","        if (ydate.areEqual(host.get(\"minimumDate\"), host.get(\"date\"))) {","            if (this._eventAttachments.prevMonth) {","                this._eventAttachments.prevMonth.detach();","                this._eventAttachments.prevMonth = false;","            }","","            if (!this._controls.prevMonth.hasClass(CAL_DIS_M)) {","                this._controls.prevMonth.addClass(CAL_DIS_M).setAttribute(\"aria-disabled\", \"true\");","            }","        }","        else {","            if (!this._eventAttachments.prevMonth) {","            this._eventAttachments.prevMonth = this._controls.prevMonth.on([\"click\", \"keydown\"], this._subtractMonths, this);","            }","            if (this._controls.prevMonth.hasClass(CAL_DIS_M)) {","              this._controls.prevMonth.removeClass(CAL_DIS_M).setAttribute(\"aria-disabled\", \"false\");","            }","        }","","        if (ydate.areEqual(host.get(\"maximumDate\"), ydate.addMonths(host.get(\"date\"), host._paneNumber - 1))) {","            if (this._eventAttachments.nextMonth) {","                this._eventAttachments.nextMonth.detach();","                this._eventAttachments.nextMonth = false;","            }","","            if (!this._controls.nextMonth.hasClass(CAL_DIS_M)) {","                this._controls.nextMonth.addClass(CAL_DIS_M).setAttribute(\"aria-disabled\", \"true\");","            }","        }","        else {","            if (!this._eventAttachments.nextMonth) {","            this._eventAttachments.nextMonth = this._controls.nextMonth.on([\"click\", \"keydown\"], this._addMonths, this);","            }","            if (this._controls.nextMonth.hasClass(CAL_DIS_M)) {","              this._controls.nextMonth.removeClass(CAL_DIS_M).setAttribute(\"aria-disabled\", \"false\");","            }","        }","","        this._controls.prevMonth.on([\"click\", \"keydown\"], this._focusNavigation, this);","        this._controls.nextMonth.on([\"click\", \"keydown\"], this._focusNavigation, this);","    },","","","","","    /**","     * Private render assist method that renders the previous month control","     * ","     * @method _renderPrevControls","     * @private","     */","    _renderPrevControls : function () {","      var prevControlNode = create(substitute (CalendarNavigator.PREV_MONTH_CONTROL_TEMPLATE,","                               CalendarNavigator.CALENDARNAV_STRINGS));","      prevControlNode.on(\"selectstart\", this.get(HOST)._preventSelectionStart);","","      return prevControlNode;        ","    },","","    /**","     * Private render assist method that renders the next month control","     * ","     * @method _renderNextControls","     * @private","     */","    _renderNextControls : function () {","      var nextControlNode = create(substitute (CalendarNavigator.NEXT_MONTH_CONTROL_TEMPLATE,","                               CalendarNavigator.CALENDARNAV_STRINGS));","      nextControlNode.on(\"selectstart\", this.get(HOST)._preventSelectionStart);","      ","      return nextControlNode;     ","    },","","    /**","     * Protected render assist method that initialized and renders the navigation controls.","     * @method _initNavigationControls","     * @protected","     */","    _initNavigationControls : function() {","            var host = this.get(HOST);","            CalendarNavigator.CALENDARNAV_STRINGS[\"control_tabindex\"] = host.get(\"tabIndex\");","            CalendarNavigator.CALENDARNAV_STRINGS[\"prev_month_arialabel\"] = \"Go to previous month\";","            CalendarNavigator.CALENDARNAV_STRINGS[\"next_month_arialabel\"] = \"Go to next month\";","","            var headerCell = host.get(CONTENT_BOX).one(\".\" + CAL_HD);","","            this._controls.prevMonth = this._renderPrevControls();","            this._controls.nextMonth = this._renderNextControls();","","            this._updateControlState();","","            host.after(\"dateChange\", this._updateControlState, this);","","            headerCell.prepend(this._controls.prevMonth);","            headerCell.append(this._controls.nextMonth);","    }","});","","Y.namespace(\"Plugin\").CalendarNavigator = CalendarNavigator;","","}, '3.7.3', {\"requires\": [\"plugin\", \"classnamemanager\", \"datatype-date\", \"node\", \"substitute\"], \"skinnable\": true});"];
_yuitest_coverage["build/calendarnavigator/calendarnavigator.js"].lines = {"1":0,"8":0,"29":0,"30":0,"42":0,"53":0,"64":0,"86":0,"98":0,"109":0,"114":0,"129":0,"130":0,"132":0,"154":0,"166":0,"167":0,"168":0,"169":0,"170":0,"183":0,"184":0,"185":0,"186":0,"187":0,"194":0,"195":0,"196":0,"197":0,"198":0,"201":0,"202":0,"206":0,"207":0,"209":0,"210":0,"214":0,"215":0,"216":0,"217":0,"220":0,"221":0,"225":0,"226":0,"228":0,"229":0,"233":0,"234":0,"247":0,"249":0,"251":0,"261":0,"263":0,"265":0,"274":0,"275":0,"276":0,"277":0,"279":0,"281":0,"282":0,"284":0,"286":0,"288":0,"289":0,"293":0};
_yuitest_coverage["build/calendarnavigator/calendarnavigator.js"].functions = {"CalendarNavigator:29":0,"initializer:126":0,"_focusNavigation:153":0,"_subtractMonths:165":0,"_addMonths:182":0,"_updateControlState:192":0,"_renderPrevControls:246":0,"_renderNextControls:260":0,"_initNavigationControls:273":0,"(anonymous 1):1":0};
_yuitest_coverage["build/calendarnavigator/calendarnavigator.js"].coveredLines = 66;
_yuitest_coverage["build/calendarnavigator/calendarnavigator.js"].coveredFunctions = 10;
_yuitest_coverline("build/calendarnavigator/calendarnavigator.js", 1);
YUI.add('calendarnavigator', function (Y, NAME) {

/**
 * Provides a plugin which adds navigation controls to Calendar.
 *
 * @module calendarnavigator
 */
_yuitest_coverfunc("build/calendarnavigator/calendarnavigator.js", "(anonymous 1)", 1);
_yuitest_coverline("build/calendarnavigator/calendarnavigator.js", 8);
var CONTENT_BOX = "contentBox",
    HOST        = "host",
    RENDERED    = "rendered",
    getCN       = Y.ClassNameManager.getClassName,
    substitute  = Y.substitute,
    node        = Y.Node,
    create      = node.create,
    CALENDAR    = 'calendar',
    CALENDARNAV = 'calendarnav',
    CAL_HD      = getCN(CALENDAR, 'header'),
    CAL_PREV_M  = getCN(CALENDARNAV, 'prevmonth'),
    CAL_NEXT_M  = getCN(CALENDARNAV, 'nextmonth'),
    CAL_DIS_M   = getCN(CALENDARNAV, 'month-disabled'),
    ydate       = Y.DataType.Date;
/**
 * A plugin class which adds navigation controls to Calendar.
 *
 * @class CalendarNavigator
 * @extends Plugin.Base
 * @namespace Plugin
 */
_yuitest_coverline("build/calendarnavigator/calendarnavigator.js", 29);
function CalendarNavigator(config) {
    _yuitest_coverfunc("build/calendarnavigator/calendarnavigator.js", "CalendarNavigator", 29);
_yuitest_coverline("build/calendarnavigator/calendarnavigator.js", 30);
CalendarNavigator.superclass.constructor.apply(this, arguments);
}

/**
 * The namespace for the plugin. This will be the property on the widget, which will 
 * reference the plugin instance, when it's plugged in.
 *
 * @property NS
 * @static
 * @type String
 * @default "navigator"
 */
_yuitest_coverline("build/calendarnavigator/calendarnavigator.js", 42);
CalendarNavigator.NS = "navigator";

/**
 * The NAME of the CalendarNavigator class. Used to prefix events generated
 * by the plugin class.
 *
 * @property NAME
 * @static
 * @type String
 * @default "pluginCalendarNavigator"
 */
_yuitest_coverline("build/calendarnavigator/calendarnavigator.js", 53);
CalendarNavigator.NAME = "pluginCalendarNavigator";


/**
 * Static property used to define the default attribute 
 * configuration for the plugin.
 *
 * @property ATTRS
 * @type Object
 * @static
 */
_yuitest_coverline("build/calendarnavigator/calendarnavigator.js", 64);
CalendarNavigator.ATTRS = {

    /**
     * The number of months to shift by when the control arrows are clicked.
     *
     * @attribute shiftByMonths
     * @type Number
     * @default 1 (months)
     */
    shiftByMonths : {
        value: 1
    }
};

   /**
    * The CSS classnames for the calendar navigator controls.
    * @property CALENDARNAV_STRINGS
    * @type Object
    * @readOnly
    * @protected
    * @static
    */ 
_yuitest_coverline("build/calendarnavigator/calendarnavigator.js", 86);
CalendarNavigator.CALENDARNAV_STRINGS = {
   prev_month_class: CAL_PREV_M,
   next_month_class: CAL_NEXT_M
};

   /**
    * The template for the calendar navigator previous month control.
    * @property PREV_MONTH_CONTROL_TEMPLATE
    * @type String
    * @protected
    * @static
    */ 
_yuitest_coverline("build/calendarnavigator/calendarnavigator.js", 98);
CalendarNavigator.PREV_MONTH_CONTROL_TEMPLATE = '<a class="yui3-u {prev_month_class}" role="button" aria-label="{prev_month_arialabel}" tabindex="{control_tabindex}">' + 
                                                   "<span>&lt;</span>" +
                                                '</a>';
   /**
    * The template for the calendar navigator next month control.
    * @property NEXT_MONTH_CONTROL_TEMPLATE
    * @type String
    * @readOnly
    * @protected
    * @static
    */ 
_yuitest_coverline("build/calendarnavigator/calendarnavigator.js", 109);
CalendarNavigator.NEXT_MONTH_CONTROL_TEMPLATE = '<a class="yui3-u {next_month_class}" role="button" aria-label="{next_month_arialabel}" tabindex="{control_tabindex}">' + 
                                                   "<span>&gt;</span>" +
                                                '</a>';


_yuitest_coverline("build/calendarnavigator/calendarnavigator.js", 114);
Y.extend(CalendarNavigator, Y.Plugin.Base, {

    _eventAttachments : {},
    _controls: {},

    /**
     * The initializer lifecycle implementation. Modifies the host widget's 
     * render to add navigation controls.
     *
     * @method initializer
     * @param {Object} config The user configuration for the plugin  
     */
    initializer : function(config) {

        // After the host has rendered its UI, place the navigation cotnrols
        _yuitest_coverfunc("build/calendarnavigator/calendarnavigator.js", "initializer", 126);
_yuitest_coverline("build/calendarnavigator/calendarnavigator.js", 129);
this._controls = {};
        _yuitest_coverline("build/calendarnavigator/calendarnavigator.js", 130);
this._eventAttachments = {};

        _yuitest_coverline("build/calendarnavigator/calendarnavigator.js", 132);
this.afterHostMethod("renderUI", this._initNavigationControls);
    },

    /**
     * The initializer destructor implementation. Responsible for destroying the initialized
     * control mechanisms.
     * 
     * @method destructor
     */
    destructor : function() {
       
    },

    /**
     * Private utility method that focuses on a navigation button when it is clicked
     * or pressed with a keyboard.
     * 
     * @method _focusNavigation
     * @param {Event} ev Click or keydown event from the controls
     * @protected
     */
    _focusNavigation : function (ev) {
        _yuitest_coverfunc("build/calendarnavigator/calendarnavigator.js", "_focusNavigation", 153);
_yuitest_coverline("build/calendarnavigator/calendarnavigator.js", 154);
ev.currentTarget.focus();
    },

    /**
     * Private utility method that subtracts months from the host calendar date
     * based on the control click and the shiftByMonths property.
     * 
     * @method _subtractMonths
     * @param {Event} ev Click event from the controls
     * @protected
     */
    _subtractMonths : function (ev) {
        _yuitest_coverfunc("build/calendarnavigator/calendarnavigator.js", "_subtractMonths", 165);
_yuitest_coverline("build/calendarnavigator/calendarnavigator.js", 166);
if ( (ev.type === "click") || (ev.type === "keydown" && (ev.keyCode == 13 || ev.keyCode == 32)) ) {
           _yuitest_coverline("build/calendarnavigator/calendarnavigator.js", 167);
var host = this.get(HOST);
           _yuitest_coverline("build/calendarnavigator/calendarnavigator.js", 168);
var oldDate = host.get("date");
           _yuitest_coverline("build/calendarnavigator/calendarnavigator.js", 169);
host.set("date", ydate.addMonths(oldDate, -1*this.get("shiftByMonths")));
           _yuitest_coverline("build/calendarnavigator/calendarnavigator.js", 170);
ev.preventDefault();
       }
    },

    /**
     * Private utility method that adds months to the host calendar date
     * based on the control click and the shiftByMonths property.
     * 
     * @method _addMonths
     * @param {Event} ev Click event from the controls
     * @protected
     */
    _addMonths : function (ev) {
        _yuitest_coverfunc("build/calendarnavigator/calendarnavigator.js", "_addMonths", 182);
_yuitest_coverline("build/calendarnavigator/calendarnavigator.js", 183);
if ( (ev.type === "click") || (ev.type === "keydown" && (ev.keyCode == 13 || ev.keyCode == 32)) ) {
           _yuitest_coverline("build/calendarnavigator/calendarnavigator.js", 184);
var host = this.get(HOST);
           _yuitest_coverline("build/calendarnavigator/calendarnavigator.js", 185);
var oldDate = host.get("date");
           _yuitest_coverline("build/calendarnavigator/calendarnavigator.js", 186);
host.set("date", ydate.addMonths(oldDate, this.get("shiftByMonths")));
           _yuitest_coverline("build/calendarnavigator/calendarnavigator.js", 187);
ev.preventDefault();
       }
    },


    _updateControlState : function () {

        _yuitest_coverfunc("build/calendarnavigator/calendarnavigator.js", "_updateControlState", 192);
_yuitest_coverline("build/calendarnavigator/calendarnavigator.js", 194);
var host = this.get(HOST);
        _yuitest_coverline("build/calendarnavigator/calendarnavigator.js", 195);
if (ydate.areEqual(host.get("minimumDate"), host.get("date"))) {
            _yuitest_coverline("build/calendarnavigator/calendarnavigator.js", 196);
if (this._eventAttachments.prevMonth) {
                _yuitest_coverline("build/calendarnavigator/calendarnavigator.js", 197);
this._eventAttachments.prevMonth.detach();
                _yuitest_coverline("build/calendarnavigator/calendarnavigator.js", 198);
this._eventAttachments.prevMonth = false;
            }

            _yuitest_coverline("build/calendarnavigator/calendarnavigator.js", 201);
if (!this._controls.prevMonth.hasClass(CAL_DIS_M)) {
                _yuitest_coverline("build/calendarnavigator/calendarnavigator.js", 202);
this._controls.prevMonth.addClass(CAL_DIS_M).setAttribute("aria-disabled", "true");
            }
        }
        else {
            _yuitest_coverline("build/calendarnavigator/calendarnavigator.js", 206);
if (!this._eventAttachments.prevMonth) {
            _yuitest_coverline("build/calendarnavigator/calendarnavigator.js", 207);
this._eventAttachments.prevMonth = this._controls.prevMonth.on(["click", "keydown"], this._subtractMonths, this);
            }
            _yuitest_coverline("build/calendarnavigator/calendarnavigator.js", 209);
if (this._controls.prevMonth.hasClass(CAL_DIS_M)) {
              _yuitest_coverline("build/calendarnavigator/calendarnavigator.js", 210);
this._controls.prevMonth.removeClass(CAL_DIS_M).setAttribute("aria-disabled", "false");
            }
        }

        _yuitest_coverline("build/calendarnavigator/calendarnavigator.js", 214);
if (ydate.areEqual(host.get("maximumDate"), ydate.addMonths(host.get("date"), host._paneNumber - 1))) {
            _yuitest_coverline("build/calendarnavigator/calendarnavigator.js", 215);
if (this._eventAttachments.nextMonth) {
                _yuitest_coverline("build/calendarnavigator/calendarnavigator.js", 216);
this._eventAttachments.nextMonth.detach();
                _yuitest_coverline("build/calendarnavigator/calendarnavigator.js", 217);
this._eventAttachments.nextMonth = false;
            }

            _yuitest_coverline("build/calendarnavigator/calendarnavigator.js", 220);
if (!this._controls.nextMonth.hasClass(CAL_DIS_M)) {
                _yuitest_coverline("build/calendarnavigator/calendarnavigator.js", 221);
this._controls.nextMonth.addClass(CAL_DIS_M).setAttribute("aria-disabled", "true");
            }
        }
        else {
            _yuitest_coverline("build/calendarnavigator/calendarnavigator.js", 225);
if (!this._eventAttachments.nextMonth) {
            _yuitest_coverline("build/calendarnavigator/calendarnavigator.js", 226);
this._eventAttachments.nextMonth = this._controls.nextMonth.on(["click", "keydown"], this._addMonths, this);
            }
            _yuitest_coverline("build/calendarnavigator/calendarnavigator.js", 228);
if (this._controls.nextMonth.hasClass(CAL_DIS_M)) {
              _yuitest_coverline("build/calendarnavigator/calendarnavigator.js", 229);
this._controls.nextMonth.removeClass(CAL_DIS_M).setAttribute("aria-disabled", "false");
            }
        }

        _yuitest_coverline("build/calendarnavigator/calendarnavigator.js", 233);
this._controls.prevMonth.on(["click", "keydown"], this._focusNavigation, this);
        _yuitest_coverline("build/calendarnavigator/calendarnavigator.js", 234);
this._controls.nextMonth.on(["click", "keydown"], this._focusNavigation, this);
    },




    /**
     * Private render assist method that renders the previous month control
     * 
     * @method _renderPrevControls
     * @private
     */
    _renderPrevControls : function () {
      _yuitest_coverfunc("build/calendarnavigator/calendarnavigator.js", "_renderPrevControls", 246);
_yuitest_coverline("build/calendarnavigator/calendarnavigator.js", 247);
var prevControlNode = create(substitute (CalendarNavigator.PREV_MONTH_CONTROL_TEMPLATE,
                               CalendarNavigator.CALENDARNAV_STRINGS));
      _yuitest_coverline("build/calendarnavigator/calendarnavigator.js", 249);
prevControlNode.on("selectstart", this.get(HOST)._preventSelectionStart);

      _yuitest_coverline("build/calendarnavigator/calendarnavigator.js", 251);
return prevControlNode;        
    },

    /**
     * Private render assist method that renders the next month control
     * 
     * @method _renderNextControls
     * @private
     */
    _renderNextControls : function () {
      _yuitest_coverfunc("build/calendarnavigator/calendarnavigator.js", "_renderNextControls", 260);
_yuitest_coverline("build/calendarnavigator/calendarnavigator.js", 261);
var nextControlNode = create(substitute (CalendarNavigator.NEXT_MONTH_CONTROL_TEMPLATE,
                               CalendarNavigator.CALENDARNAV_STRINGS));
      _yuitest_coverline("build/calendarnavigator/calendarnavigator.js", 263);
nextControlNode.on("selectstart", this.get(HOST)._preventSelectionStart);
      
      _yuitest_coverline("build/calendarnavigator/calendarnavigator.js", 265);
return nextControlNode;     
    },

    /**
     * Protected render assist method that initialized and renders the navigation controls.
     * @method _initNavigationControls
     * @protected
     */
    _initNavigationControls : function() {
            _yuitest_coverfunc("build/calendarnavigator/calendarnavigator.js", "_initNavigationControls", 273);
_yuitest_coverline("build/calendarnavigator/calendarnavigator.js", 274);
var host = this.get(HOST);
            _yuitest_coverline("build/calendarnavigator/calendarnavigator.js", 275);
CalendarNavigator.CALENDARNAV_STRINGS["control_tabindex"] = host.get("tabIndex");
            _yuitest_coverline("build/calendarnavigator/calendarnavigator.js", 276);
CalendarNavigator.CALENDARNAV_STRINGS["prev_month_arialabel"] = "Go to previous month";
            _yuitest_coverline("build/calendarnavigator/calendarnavigator.js", 277);
CalendarNavigator.CALENDARNAV_STRINGS["next_month_arialabel"] = "Go to next month";

            _yuitest_coverline("build/calendarnavigator/calendarnavigator.js", 279);
var headerCell = host.get(CONTENT_BOX).one("." + CAL_HD);

            _yuitest_coverline("build/calendarnavigator/calendarnavigator.js", 281);
this._controls.prevMonth = this._renderPrevControls();
            _yuitest_coverline("build/calendarnavigator/calendarnavigator.js", 282);
this._controls.nextMonth = this._renderNextControls();

            _yuitest_coverline("build/calendarnavigator/calendarnavigator.js", 284);
this._updateControlState();

            _yuitest_coverline("build/calendarnavigator/calendarnavigator.js", 286);
host.after("dateChange", this._updateControlState, this);

            _yuitest_coverline("build/calendarnavigator/calendarnavigator.js", 288);
headerCell.prepend(this._controls.prevMonth);
            _yuitest_coverline("build/calendarnavigator/calendarnavigator.js", 289);
headerCell.append(this._controls.nextMonth);
    }
});

_yuitest_coverline("build/calendarnavigator/calendarnavigator.js", 293);
Y.namespace("Plugin").CalendarNavigator = CalendarNavigator;

}, '3.7.3', {"requires": ["plugin", "classnamemanager", "datatype-date", "node", "substitute"], "skinnable": true});
