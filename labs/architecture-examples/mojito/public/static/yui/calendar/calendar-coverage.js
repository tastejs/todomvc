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
_yuitest_coverage["build/calendar/calendar.js"] = {
    lines: {},
    functions: {},
    coveredLines: 0,
    calledLines: 0,
    coveredFunctions: 0,
    calledFunctions: 0,
    path: "build/calendar/calendar.js",
    code: []
};
_yuitest_coverage["build/calendar/calendar.js"].code=["YUI.add('calendar', function (Y, NAME) {","","/**"," * The Calendar component is a UI widget that allows users"," * to view dates in a two-dimensional month grid, as well as"," * to select one or more dates, or ranges of dates. Calendar"," * is generated dynamically and relies on the developer to"," * provide for a progressive enhancement alternative."," *"," *"," * @module calendar"," */","","var getCN             = Y.ClassNameManager.getClassName,","    CALENDAR          = 'calendar',","    KEY_DOWN          = 40,","    KEY_UP            = 38,","    KEY_LEFT          = 37,","    KEY_RIGHT         = 39,","    KEY_ENTER         = 13,","    KEY_SPACE         = 32,","    CAL_HD            = getCN(CALENDAR, 'header'),","    CAL_DAY_SELECTED  = getCN(CALENDAR, 'day-selected'),","    CAL_DAY_HILITED   = getCN(CALENDAR, 'day-highlighted'),","    CAL_DAY           = getCN(CALENDAR, 'day'),","    CAL_PREVMONTH_DAY = getCN(CALENDAR, 'prevmonth-day'),","    CAL_NEXTMONTH_DAY = getCN(CALENDAR, 'nextmonth-day'),","    CAL_GRID          = getCN(CALENDAR, 'grid'),","    ydate             = Y.DataType.Date,","    delegate          = Y.delegate,","    CAL_PANE          = getCN(CALENDAR, 'pane'),","    os                = Y.UA.os;","","/** Create a calendar view to represent a single or multiple","  * month range of dates, rendered as a grid with date and","  * weekday labels.","  * ","  * @class Calendar","  * @extends CalendarBase","  * @param config {Object} Configuration object (see Configuration attributes)","  * @constructor","  */","function Calendar(config) {","  Calendar.superclass.constructor.apply ( this, arguments );","}","","Y.Calendar = Y.extend(Calendar, Y.CalendarBase, {","","    _keyEvents: [],","","    _highlightedDateNode: null,","","  /**","   * A property tracking the last selected date on the calendar, for the","   * purposes of multiple selection.","   *","   * @property _lastSelectedDate","   * @type Date","   * @default null","   * @private","   */  ","    _lastSelectedDate: null,","","  /**","   * Designated initializer. Activates the navigation plugin for the calendar.","   *","   * @method initializer","   */ ","  initializer : function () {","    this.plug(Y.Plugin.CalendarNavigator);","","","    this._keyEvents = [];","    this._highlightedDateNode = null;","    this._lastSelectedDate = null;","  },","","  /**","   * Overrides the _bindCalendarEvents placeholder in CalendarBase","   * and binds calendar events during bindUI stage.","   * @method _bindCalendarEvents","   * @protected","   */   ","  _bindCalendarEvents : function () {","    var contentBox = this.get('contentBox'),","        pane       = contentBox.one(\".\" + CAL_PANE);","    pane.on(\"selectstart\", this._preventSelectionStart);","    pane.delegate(\"click\", this._clickCalendar, \".\" + CAL_DAY + \", .\" + CAL_PREVMONTH_DAY + \", .\" + CAL_NEXTMONTH_DAY, this);","    pane.delegate(\"keydown\", this._keydownCalendar, \".\" + CAL_GRID, this);","    pane.delegate(\"focus\", this._focusCalendarGrid, \".\" + CAL_GRID, this);","    pane.delegate(\"focus\", this._focusCalendarCell, \".\" + CAL_DAY, this);","    pane.delegate(\"blur\", this._blurCalendarGrid, \".\" + CAL_GRID + \",.\" + CAL_DAY, this);","  },","","  /**","   * Prevents text selection if it is started within the calendar pane","   * @method _preventSelectionStart","   * @param event {Event} The selectstart event","   * @protected","   */   ","  _preventSelectionStart : function (event) {","    event.preventDefault();","  },","","  /**","   * Highlights a specific date node with keyboard highlight class","   * @method _highlightDateNode","   * @param oDate {Date} Date corresponding the node to be highlighted","   * @protected","   */   ","  _highlightDateNode : function (oDate) {","    this._unhighlightCurrentDateNode();","    var newNode = this._dateToNode(oDate);","    newNode.focus();","    newNode.addClass(CAL_DAY_HILITED);","  },","","  /**","   * Unhighlights a specific date node currently highlighted with keyboard highlight class","   * @method _unhighlightCurrentDateNode","   * @protected","   */   ","  _unhighlightCurrentDateNode : function () {","    var allHilitedNodes = this.get(\"contentBox\").all(\".\" + CAL_DAY_HILITED);","    if (allHilitedNodes) {","      allHilitedNodes.removeClass(CAL_DAY_HILITED);","    }","  },","","  /**","   * Returns the grid number for a specific calendar grid (for multi-grid templates)","   * @method _getGridNumber","   * @param gridNode {Node} Node corresponding to a specific grid","   * @protected","   */   ","  _getGridNumber : function (gridNode) {","    var idParts = gridNode.get(\"id\").split(\"_\").reverse();","        return parseInt(idParts[0], 10);","  },","","  /**","   * Handler for loss of focus of calendar grid","   * @method _blurCalendarGrid","   * @protected","   */   ","   _blurCalendarGrid : function (ev) {","      this._unhighlightCurrentDateNode();","   },","","","  /**","   * Handler for gain of focus of calendar cell","   * @method _focusCalendarCell","   * @protected","   */ ","   _focusCalendarCell : function (ev) {","       this._highlightedDateNode = ev.target;","       ev.stopPropagation();","   },","","  /**","   * Handler for gain of focus of calendar grid","   * @method _focusCalendarGrid","   * @protected","   */ ","   _focusCalendarGrid : function (ev) {     ","       this._unhighlightCurrentDateNode();","       this._highlightedDateNode = null;","   },","","  /**","   * Handler for keyboard press on a calendar grid","   * @method _keydownCalendar","   * @protected","   */ ","   _keydownCalendar : function (ev) {","    var gridNum = this._getGridNumber(ev.target),","        curDate = !this._highlightedDateNode ? null : this._nodeToDate(this._highlightedDateNode),","        keyCode = ev.keyCode,","        dayNum = 0,","        dir = '';","","        switch(keyCode) {","          case KEY_DOWN: ","            dayNum = 7;","            dir = 's';","          break;","          case KEY_UP: ","            dayNum = -7;","            dir = 'n';","          break;","          case KEY_LEFT: ","            dayNum = -1;","            dir = 'w';","          break;","          case KEY_RIGHT:","            dayNum = 1;","            dir = 'e';","          break;","          case KEY_SPACE: case KEY_ENTER:","            ev.preventDefault();","            if (this._highlightedDateNode) {","            var selMode = this.get(\"selectionMode\");","            if (selMode === \"single\" && !this._highlightedDateNode.hasClass(CAL_DAY_SELECTED)) {","                this._clearSelection(true);","                this._addDateToSelection(curDate);","            }","            else if (selMode === \"multiple\" || selMode === \"multiple-sticky\") {","                if (this._highlightedDateNode.hasClass(CAL_DAY_SELECTED)) {","                  this._removeDateFromSelection(curDate);","                }","                else {","                  this._addDateToSelection(curDate);","                }","             }","            }","          break;","        }"," ","","      if (keyCode == KEY_DOWN || keyCode == KEY_UP || keyCode == KEY_LEFT || keyCode == KEY_RIGHT) {","","      if (!curDate) {","             curDate = ydate.addMonths(this.get(\"date\"), gridNum);","             dayNum = 0;","      }","              ev.preventDefault();","          var newDate = ydate.addDays(curDate, dayNum),","              startDate = this.get(\"date\"),","              endDate = ydate.addMonths(this.get(\"date\"), this._paneNumber - 1),","              lastPaneDate = new Date(endDate);","              endDate.setDate(ydate.daysInMonth(endDate));","          ","          if (ydate.isInRange(newDate, startDate, endDate)) {","/*","              var paneShift = (newDate.getMonth() - curDate.getMonth()) % 10;","","","              if (paneShift != 0) {","                var newGridNum = gridNum + paneShift,","                    contentBox = this.get('contentBox'),","                    newPane = contentBox.one(\"#\" + this._calendarId + \"_pane_\" + newGridNum);","                    newPane.focus();","              }","*/","              this._highlightDateNode(newDate);","          }","          else if (ydate.isGreater(startDate, newDate)) {","            if (!ydate.isGreaterOrEqual(this.get(\"minimumDate\"), startDate)) {","                 this.set(\"date\", ydate.addMonths(startDate, -1));","                 this._highlightDateNode(newDate);","            }","          }","          else if (ydate.isGreater(newDate, endDate)) {","            if (!ydate.isGreaterOrEqual(lastPaneDate, this.get(\"maximumDate\"))) {","                 this.set(\"date\", ydate.addMonths(startDate, 1));","                 this._highlightDateNode(newDate);","            }","          }","","        }","   },","","  /**","   * Handles the calendar clicks based on selection mode.","   * @method _clickCalendar","   * @param {Event} ev A click event","   * @private","   */   ","    _clickCalendar : function (ev) {","        var clickedCell = ev.currentTarget,","            clickedCellIsDay = clickedCell.hasClass(CAL_DAY) && ","                               !clickedCell.hasClass(CAL_PREVMONTH_DAY) && ","                               !clickedCell.hasClass(CAL_NEXTMONTH_DAY),","            clickedCellIsSelected = clickedCell.hasClass(CAL_DAY_SELECTED);","        switch (this.get(\"selectionMode\")) {","          case(\"single\"):","               if (clickedCellIsDay) {","                  if (!clickedCellIsSelected) {","                    this._clearSelection(true);  ","                    this._addDateToSelection(this._nodeToDate(clickedCell));","                  }","             }","               break;","            case(\"multiple-sticky\"):","               if (clickedCellIsDay) {","                 if (clickedCellIsSelected) {","                  this._removeDateFromSelection(this._nodeToDate(clickedCell));","                 }","                 else {","                  this._addDateToSelection(this._nodeToDate(clickedCell));","                 }","               }","               break;","            case(\"multiple\"):","               if (clickedCellIsDay) {","                 if (!ev.metaKey && !ev.ctrlKey && !ev.shiftKey) {","                      this._clearSelection(true);","                      this._lastSelectedDate = this._nodeToDate(clickedCell);","                      this._addDateToSelection(this._lastSelectedDate);","                 }","                 else if (((os == 'macintosh' && ev.metaKey) || (os != 'macintosh' && ev.ctrlKey)) && !ev.shiftKey) {","                    if (clickedCellIsSelected) {","                      this._removeDateFromSelection(this._nodeToDate(clickedCell));","                      this._lastSelectedDate = null;","                    }","                    else {","                      this._lastSelectedDate = this._nodeToDate(clickedCell);","                      this._addDateToSelection(this._lastSelectedDate);","                    }","                 }","                 else if (((os == 'macintosh' && ev.metaKey) || (os != 'macintosh' && ev.ctrlKey)) && ev.shiftKey) {","                    if (this._lastSelectedDate) {","                      var selectedDate = this._nodeToDate(clickedCell);","                      this._addDateRangeToSelection(selectedDate, this._lastSelectedDate);","                      this._lastSelectedDate = selectedDate;","                    }","                    else {","                      this._lastSelectedDate = this._nodeToDate(clickedCell);","                      this._addDateToSelection(this._lastSelectedDate);","                    }","  ","                 }","                 else if (ev.shiftKey) {","                      if (this._lastSelectedDate) {","                        var selectedDate = this._nodeToDate(clickedCell);","                        this._clearSelection(true);","                        this._addDateRangeToSelection(selectedDate, this._lastSelectedDate);","                        this._lastSelectedDate = selectedDate;","                      }","                      else {","                        this._clearSelection(true);","                        this._lastSelectedDate = this._nodeToDate(clickedCell);","                          this._addDateToSelection(this._lastSelectedDate);","                      }","                 }","              }","              break;","        }","","      if (clickedCellIsDay) {","   /**","     * Fired when a specific date cell in the calendar is clicked. The event carries a ","     * payload which includes a `cell` property corresponding to the node of the actual","     * date cell, and a `date` property, with the `Date` that was clicked.","     *","     * @event dateClick","     */","        this.fire(\"dateClick\", {cell: clickedCell, date: this._nodeToDate(clickedCell)});","      }","      else if (clickedCell.hasClass(CAL_PREVMONTH_DAY)) {","   /**","     * Fired when any of the previous month's days displayed before the calendar grid","     * are clicked.","     *","     * @event prevMonthClick","     */","        this.fire(\"prevMonthClick\");","      }","      else if (clickedCell.hasClass(CAL_NEXTMONTH_DAY)) {","   /**","     * Fired when any of the next month's days displayed after the calendar grid","     * are clicked.","     *","     * @event nextMonthClick","     */","        this.fire(\"nextMonthClick\");","      }","    },","","  /**","   * Subtracts one month from the current calendar view.","   * @method subtractMonth","   */   ","  subtractMonth : function (e) {","    this.set(\"date\", ydate.addMonths(this.get(\"date\"), -1));","    if (e) {","      e.halt();","    }","  },","","  /**","   * Subtracts one year from the current calendar view.","   * @method subtractYear","   */ ","  subtractYear : function (e) {","    this.set(\"date\", ydate.addYears(this.get(\"date\"), -1));","    if (e) {","      e.halt();","    }","  },","","  /**","   * Adds one month to the current calendar view.","   * @method addMonth","   */   ","  addMonth : function (e) {    ","    this.set(\"date\", ydate.addMonths(this.get(\"date\"), 1));","    if (e) {","      e.halt();","    }","  },","","  /**","   * Adds one year to the current calendar view.","   * @method addYear","   */   ","  addYear : function (e) {","    this.set(\"date\", ydate.addYears(this.get(\"date\"), 1));","    if (e) {","      e.halt();","    }","  }","},","","{","   /**","    * The identity of the widget.","    *","    * @property NAME","    * @type String","    * @default 'calendar'","    * @readOnly","    * @protected","    * @static","    */  ","  NAME: \"calendar\",","","   /**","    * Static property used to define the default attribute configuration of","    * the Widget.","    *","    * @property ATTRS","    * @type {Object}","    * @protected","    * @static","    */  ","  ATTRS: {","","    /**","     * A setting specifying the type of selection the calendar allows.","     * Possible values include:","     * <ul>","     *   <li>`single` - One date at a time</li>","     *   <li>`multiple-sticky` - Multiple dates, selected one at a time (the dates \"stick\"). This option","     *   is appropriate for mobile devices, where function keys from the keyboard are not available.</li>","     *   <li>`multiple` - Multiple dates, selected with Ctrl/Meta keys for additional single","     *   dates, and Shift key for date ranges.</li>","     *","     * @attribute selectionMode","     * @type String","     * @default single","     */","    selectionMode: {","      value: \"single\"","    },","","    /**","     * The date corresponding to the current calendar view. Always","     * normalized to the first of the month that contains the date","     * at assignment time. Used as the first date visible in the","     * calendar.","     *","     * @attribute date","     * @type Date","     * @default Today's date as set on the user's computer.","     */","    date: {","      value: new Date(),","      lazyAdd: false,","      setter: function (val) {","","        var newDate = this._normalizeDate(val),","            newTopDate = ydate.addMonths(newDate, this._paneNumber - 1);","        var minDate = this.get(\"minimumDate\");","        var maxDate = this.get(\"maximumDate\");","            if ((!minDate || ydate.isGreaterOrEqual(newDate, minDate)) && ","                (!maxDate || ydate.isGreaterOrEqual(maxDate, newTopDate))) {","                return newDate;","            }","","            else if (minDate && ydate.isGreater(minDate, newDate)) {","                   return minDate;","            }","","            else if (maxDate && ydate.isGreater(newTopDate, maxDate)) {","                var actualMaxDate = ydate.addMonths(maxDate, -1*(this._paneNumber - 1));","                  return actualMaxDate;","            }","     }","    },","","    /**","     * The minimum date that can be displayed by the calendar. The calendar will not","     * allow dates earlier than this one to be set, and will reset any earlier date to","     * this date. Should be `null` if no minimum date is needed.","     *","     * @attribute minimumDate","     * @type Date","     * @default null","     */","    minimumDate: {","      value: null,","      setter: function (val) {","        if (val) {","          var curDate = this.get('date'),","              newMinDate = this._normalizeDate(val);","          if (curDate && !ydate.isGreaterOrEqual(curDate, newMinDate)) {","              this.set('date', newMinDate);","          }","          return newMinDate;","        }","        else {","          return this._normalizeDate(val);","        }","      }","    },","","    /**","     * The maximum date that can be displayed by the calendar. The calendar will not","     * allow dates later than this one to be set, and will reset any later date to","     * this date. Should be `null` if no maximum date is needed.","     *","     * @attribute maximumDate","     * @type Date","     * @default null","     */","    maximumDate: {","      value: null,","      setter: function (val) {","        if (val) {","          var curDate = this.get('date'),","              newMaxDate = this._normalizeDate(val);","          if (curDate && !ydate.isGreaterOrEqual(val, ydate.addMonths(curDate, this._paneNumber - 1))) {","              this.set('date', ydate.addMonths(newMaxDate, -1*(this._paneNumber -1)));","          }","          return newMaxDate;","        }","        else {","          return val;","        }","      }","    }","  }","});","","}, '3.7.3', {\"requires\": [\"calendar-base\", \"calendarnavigator\"], \"lang\": [\"de\", \"en\", \"fr\", \"ja\", \"nb-NO\", \"pt-BR\", \"ru\", \"zh-HANT-TW\"], \"skinnable\": true});"];
_yuitest_coverage["build/calendar/calendar.js"].lines = {"1":0,"14":0,"43":0,"44":0,"47":0,"70":0,"73":0,"74":0,"75":0,"85":0,"87":0,"88":0,"89":0,"90":0,"91":0,"92":0,"102":0,"112":0,"113":0,"114":0,"115":0,"124":0,"125":0,"126":0,"137":0,"138":0,"147":0,"157":0,"158":0,"167":0,"168":0,"177":0,"183":0,"185":0,"186":0,"187":0,"189":0,"190":0,"191":0,"193":0,"194":0,"195":0,"197":0,"198":0,"199":0,"201":0,"202":0,"203":0,"204":0,"205":0,"206":0,"208":0,"209":0,"210":0,"213":0,"217":0,"221":0,"223":0,"224":0,"225":0,"227":0,"228":0,"232":0,"234":0,"246":0,"248":0,"249":0,"250":0,"251":0,"254":0,"255":0,"256":0,"257":0,"271":0,"276":0,"278":0,"279":0,"280":0,"281":0,"284":0,"286":0,"287":0,"288":0,"291":0,"294":0,"296":0,"297":0,"298":0,"299":0,"300":0,"302":0,"303":0,"304":0,"305":0,"308":0,"309":0,"312":0,"313":0,"314":0,"315":0,"316":0,"319":0,"320":0,"324":0,"325":0,"326":0,"327":0,"328":0,"329":0,"332":0,"333":0,"334":0,"338":0,"341":0,"349":0,"351":0,"358":0,"360":0,"367":0,"376":0,"377":0,"378":0,"387":0,"388":0,"389":0,"398":0,"399":0,"400":0,"409":0,"410":0,"411":0,"473":0,"475":0,"476":0,"477":0,"479":0,"482":0,"483":0,"486":0,"487":0,"488":0,"505":0,"506":0,"508":0,"509":0,"511":0,"514":0,"531":0,"532":0,"534":0,"535":0,"537":0,"540":0};
_yuitest_coverage["build/calendar/calendar.js"].functions = {"Calendar:43":0,"initializer:69":0,"_bindCalendarEvents:84":0,"_preventSelectionStart:101":0,"_highlightDateNode:111":0,"_unhighlightCurrentDateNode:123":0,"_getGridNumber:136":0,"_blurCalendarGrid:146":0,"_focusCalendarCell:156":0,"_focusCalendarGrid:166":0,"_keydownCalendar:176":0,"_clickCalendar:270":0,"subtractMonth:375":0,"subtractYear:386":0,"addMonth:397":0,"addYear:408":0,"setter:471":0,"setter:504":0,"setter:530":0,"(anonymous 1):1":0};
_yuitest_coverage["build/calendar/calendar.js"].coveredLines = 153;
_yuitest_coverage["build/calendar/calendar.js"].coveredFunctions = 20;
_yuitest_coverline("build/calendar/calendar.js", 1);
YUI.add('calendar', function (Y, NAME) {

/**
 * The Calendar component is a UI widget that allows users
 * to view dates in a two-dimensional month grid, as well as
 * to select one or more dates, or ranges of dates. Calendar
 * is generated dynamically and relies on the developer to
 * provide for a progressive enhancement alternative.
 *
 *
 * @module calendar
 */

_yuitest_coverfunc("build/calendar/calendar.js", "(anonymous 1)", 1);
_yuitest_coverline("build/calendar/calendar.js", 14);
var getCN             = Y.ClassNameManager.getClassName,
    CALENDAR          = 'calendar',
    KEY_DOWN          = 40,
    KEY_UP            = 38,
    KEY_LEFT          = 37,
    KEY_RIGHT         = 39,
    KEY_ENTER         = 13,
    KEY_SPACE         = 32,
    CAL_HD            = getCN(CALENDAR, 'header'),
    CAL_DAY_SELECTED  = getCN(CALENDAR, 'day-selected'),
    CAL_DAY_HILITED   = getCN(CALENDAR, 'day-highlighted'),
    CAL_DAY           = getCN(CALENDAR, 'day'),
    CAL_PREVMONTH_DAY = getCN(CALENDAR, 'prevmonth-day'),
    CAL_NEXTMONTH_DAY = getCN(CALENDAR, 'nextmonth-day'),
    CAL_GRID          = getCN(CALENDAR, 'grid'),
    ydate             = Y.DataType.Date,
    delegate          = Y.delegate,
    CAL_PANE          = getCN(CALENDAR, 'pane'),
    os                = Y.UA.os;

/** Create a calendar view to represent a single or multiple
  * month range of dates, rendered as a grid with date and
  * weekday labels.
  * 
  * @class Calendar
  * @extends CalendarBase
  * @param config {Object} Configuration object (see Configuration attributes)
  * @constructor
  */
_yuitest_coverline("build/calendar/calendar.js", 43);
function Calendar(config) {
  _yuitest_coverfunc("build/calendar/calendar.js", "Calendar", 43);
_yuitest_coverline("build/calendar/calendar.js", 44);
Calendar.superclass.constructor.apply ( this, arguments );
}

_yuitest_coverline("build/calendar/calendar.js", 47);
Y.Calendar = Y.extend(Calendar, Y.CalendarBase, {

    _keyEvents: [],

    _highlightedDateNode: null,

  /**
   * A property tracking the last selected date on the calendar, for the
   * purposes of multiple selection.
   *
   * @property _lastSelectedDate
   * @type Date
   * @default null
   * @private
   */  
    _lastSelectedDate: null,

  /**
   * Designated initializer. Activates the navigation plugin for the calendar.
   *
   * @method initializer
   */ 
  initializer : function () {
    _yuitest_coverfunc("build/calendar/calendar.js", "initializer", 69);
_yuitest_coverline("build/calendar/calendar.js", 70);
this.plug(Y.Plugin.CalendarNavigator);


    _yuitest_coverline("build/calendar/calendar.js", 73);
this._keyEvents = [];
    _yuitest_coverline("build/calendar/calendar.js", 74);
this._highlightedDateNode = null;
    _yuitest_coverline("build/calendar/calendar.js", 75);
this._lastSelectedDate = null;
  },

  /**
   * Overrides the _bindCalendarEvents placeholder in CalendarBase
   * and binds calendar events during bindUI stage.
   * @method _bindCalendarEvents
   * @protected
   */   
  _bindCalendarEvents : function () {
    _yuitest_coverfunc("build/calendar/calendar.js", "_bindCalendarEvents", 84);
_yuitest_coverline("build/calendar/calendar.js", 85);
var contentBox = this.get('contentBox'),
        pane       = contentBox.one("." + CAL_PANE);
    _yuitest_coverline("build/calendar/calendar.js", 87);
pane.on("selectstart", this._preventSelectionStart);
    _yuitest_coverline("build/calendar/calendar.js", 88);
pane.delegate("click", this._clickCalendar, "." + CAL_DAY + ", ." + CAL_PREVMONTH_DAY + ", ." + CAL_NEXTMONTH_DAY, this);
    _yuitest_coverline("build/calendar/calendar.js", 89);
pane.delegate("keydown", this._keydownCalendar, "." + CAL_GRID, this);
    _yuitest_coverline("build/calendar/calendar.js", 90);
pane.delegate("focus", this._focusCalendarGrid, "." + CAL_GRID, this);
    _yuitest_coverline("build/calendar/calendar.js", 91);
pane.delegate("focus", this._focusCalendarCell, "." + CAL_DAY, this);
    _yuitest_coverline("build/calendar/calendar.js", 92);
pane.delegate("blur", this._blurCalendarGrid, "." + CAL_GRID + ",." + CAL_DAY, this);
  },

  /**
   * Prevents text selection if it is started within the calendar pane
   * @method _preventSelectionStart
   * @param event {Event} The selectstart event
   * @protected
   */   
  _preventSelectionStart : function (event) {
    _yuitest_coverfunc("build/calendar/calendar.js", "_preventSelectionStart", 101);
_yuitest_coverline("build/calendar/calendar.js", 102);
event.preventDefault();
  },

  /**
   * Highlights a specific date node with keyboard highlight class
   * @method _highlightDateNode
   * @param oDate {Date} Date corresponding the node to be highlighted
   * @protected
   */   
  _highlightDateNode : function (oDate) {
    _yuitest_coverfunc("build/calendar/calendar.js", "_highlightDateNode", 111);
_yuitest_coverline("build/calendar/calendar.js", 112);
this._unhighlightCurrentDateNode();
    _yuitest_coverline("build/calendar/calendar.js", 113);
var newNode = this._dateToNode(oDate);
    _yuitest_coverline("build/calendar/calendar.js", 114);
newNode.focus();
    _yuitest_coverline("build/calendar/calendar.js", 115);
newNode.addClass(CAL_DAY_HILITED);
  },

  /**
   * Unhighlights a specific date node currently highlighted with keyboard highlight class
   * @method _unhighlightCurrentDateNode
   * @protected
   */   
  _unhighlightCurrentDateNode : function () {
    _yuitest_coverfunc("build/calendar/calendar.js", "_unhighlightCurrentDateNode", 123);
_yuitest_coverline("build/calendar/calendar.js", 124);
var allHilitedNodes = this.get("contentBox").all("." + CAL_DAY_HILITED);
    _yuitest_coverline("build/calendar/calendar.js", 125);
if (allHilitedNodes) {
      _yuitest_coverline("build/calendar/calendar.js", 126);
allHilitedNodes.removeClass(CAL_DAY_HILITED);
    }
  },

  /**
   * Returns the grid number for a specific calendar grid (for multi-grid templates)
   * @method _getGridNumber
   * @param gridNode {Node} Node corresponding to a specific grid
   * @protected
   */   
  _getGridNumber : function (gridNode) {
    _yuitest_coverfunc("build/calendar/calendar.js", "_getGridNumber", 136);
_yuitest_coverline("build/calendar/calendar.js", 137);
var idParts = gridNode.get("id").split("_").reverse();
        _yuitest_coverline("build/calendar/calendar.js", 138);
return parseInt(idParts[0], 10);
  },

  /**
   * Handler for loss of focus of calendar grid
   * @method _blurCalendarGrid
   * @protected
   */   
   _blurCalendarGrid : function (ev) {
      _yuitest_coverfunc("build/calendar/calendar.js", "_blurCalendarGrid", 146);
_yuitest_coverline("build/calendar/calendar.js", 147);
this._unhighlightCurrentDateNode();
   },


  /**
   * Handler for gain of focus of calendar cell
   * @method _focusCalendarCell
   * @protected
   */ 
   _focusCalendarCell : function (ev) {
       _yuitest_coverfunc("build/calendar/calendar.js", "_focusCalendarCell", 156);
_yuitest_coverline("build/calendar/calendar.js", 157);
this._highlightedDateNode = ev.target;
       _yuitest_coverline("build/calendar/calendar.js", 158);
ev.stopPropagation();
   },

  /**
   * Handler for gain of focus of calendar grid
   * @method _focusCalendarGrid
   * @protected
   */ 
   _focusCalendarGrid : function (ev) {     
       _yuitest_coverfunc("build/calendar/calendar.js", "_focusCalendarGrid", 166);
_yuitest_coverline("build/calendar/calendar.js", 167);
this._unhighlightCurrentDateNode();
       _yuitest_coverline("build/calendar/calendar.js", 168);
this._highlightedDateNode = null;
   },

  /**
   * Handler for keyboard press on a calendar grid
   * @method _keydownCalendar
   * @protected
   */ 
   _keydownCalendar : function (ev) {
    _yuitest_coverfunc("build/calendar/calendar.js", "_keydownCalendar", 176);
_yuitest_coverline("build/calendar/calendar.js", 177);
var gridNum = this._getGridNumber(ev.target),
        curDate = !this._highlightedDateNode ? null : this._nodeToDate(this._highlightedDateNode),
        keyCode = ev.keyCode,
        dayNum = 0,
        dir = '';

        _yuitest_coverline("build/calendar/calendar.js", 183);
switch(keyCode) {
          case KEY_DOWN: 
            _yuitest_coverline("build/calendar/calendar.js", 185);
dayNum = 7;
            _yuitest_coverline("build/calendar/calendar.js", 186);
dir = 's';
          _yuitest_coverline("build/calendar/calendar.js", 187);
break;
          case KEY_UP: 
            _yuitest_coverline("build/calendar/calendar.js", 189);
dayNum = -7;
            _yuitest_coverline("build/calendar/calendar.js", 190);
dir = 'n';
          _yuitest_coverline("build/calendar/calendar.js", 191);
break;
          case KEY_LEFT: 
            _yuitest_coverline("build/calendar/calendar.js", 193);
dayNum = -1;
            _yuitest_coverline("build/calendar/calendar.js", 194);
dir = 'w';
          _yuitest_coverline("build/calendar/calendar.js", 195);
break;
          case KEY_RIGHT:
            _yuitest_coverline("build/calendar/calendar.js", 197);
dayNum = 1;
            _yuitest_coverline("build/calendar/calendar.js", 198);
dir = 'e';
          _yuitest_coverline("build/calendar/calendar.js", 199);
break;
          case KEY_SPACE: case KEY_ENTER:
            _yuitest_coverline("build/calendar/calendar.js", 201);
ev.preventDefault();
            _yuitest_coverline("build/calendar/calendar.js", 202);
if (this._highlightedDateNode) {
            _yuitest_coverline("build/calendar/calendar.js", 203);
var selMode = this.get("selectionMode");
            _yuitest_coverline("build/calendar/calendar.js", 204);
if (selMode === "single" && !this._highlightedDateNode.hasClass(CAL_DAY_SELECTED)) {
                _yuitest_coverline("build/calendar/calendar.js", 205);
this._clearSelection(true);
                _yuitest_coverline("build/calendar/calendar.js", 206);
this._addDateToSelection(curDate);
            }
            else {_yuitest_coverline("build/calendar/calendar.js", 208);
if (selMode === "multiple" || selMode === "multiple-sticky") {
                _yuitest_coverline("build/calendar/calendar.js", 209);
if (this._highlightedDateNode.hasClass(CAL_DAY_SELECTED)) {
                  _yuitest_coverline("build/calendar/calendar.js", 210);
this._removeDateFromSelection(curDate);
                }
                else {
                  _yuitest_coverline("build/calendar/calendar.js", 213);
this._addDateToSelection(curDate);
                }
             }}
            }
          _yuitest_coverline("build/calendar/calendar.js", 217);
break;
        }
 

      _yuitest_coverline("build/calendar/calendar.js", 221);
if (keyCode == KEY_DOWN || keyCode == KEY_UP || keyCode == KEY_LEFT || keyCode == KEY_RIGHT) {

      _yuitest_coverline("build/calendar/calendar.js", 223);
if (!curDate) {
             _yuitest_coverline("build/calendar/calendar.js", 224);
curDate = ydate.addMonths(this.get("date"), gridNum);
             _yuitest_coverline("build/calendar/calendar.js", 225);
dayNum = 0;
      }
              _yuitest_coverline("build/calendar/calendar.js", 227);
ev.preventDefault();
          _yuitest_coverline("build/calendar/calendar.js", 228);
var newDate = ydate.addDays(curDate, dayNum),
              startDate = this.get("date"),
              endDate = ydate.addMonths(this.get("date"), this._paneNumber - 1),
              lastPaneDate = new Date(endDate);
              _yuitest_coverline("build/calendar/calendar.js", 232);
endDate.setDate(ydate.daysInMonth(endDate));
          
          _yuitest_coverline("build/calendar/calendar.js", 234);
if (ydate.isInRange(newDate, startDate, endDate)) {
/*
              var paneShift = (newDate.getMonth() - curDate.getMonth()) % 10;


              if (paneShift != 0) {
                var newGridNum = gridNum + paneShift,
                    contentBox = this.get('contentBox'),
                    newPane = contentBox.one("#" + this._calendarId + "_pane_" + newGridNum);
                    newPane.focus();
              }
*/
              _yuitest_coverline("build/calendar/calendar.js", 246);
this._highlightDateNode(newDate);
          }
          else {_yuitest_coverline("build/calendar/calendar.js", 248);
if (ydate.isGreater(startDate, newDate)) {
            _yuitest_coverline("build/calendar/calendar.js", 249);
if (!ydate.isGreaterOrEqual(this.get("minimumDate"), startDate)) {
                 _yuitest_coverline("build/calendar/calendar.js", 250);
this.set("date", ydate.addMonths(startDate, -1));
                 _yuitest_coverline("build/calendar/calendar.js", 251);
this._highlightDateNode(newDate);
            }
          }
          else {_yuitest_coverline("build/calendar/calendar.js", 254);
if (ydate.isGreater(newDate, endDate)) {
            _yuitest_coverline("build/calendar/calendar.js", 255);
if (!ydate.isGreaterOrEqual(lastPaneDate, this.get("maximumDate"))) {
                 _yuitest_coverline("build/calendar/calendar.js", 256);
this.set("date", ydate.addMonths(startDate, 1));
                 _yuitest_coverline("build/calendar/calendar.js", 257);
this._highlightDateNode(newDate);
            }
          }}}

        }
   },

  /**
   * Handles the calendar clicks based on selection mode.
   * @method _clickCalendar
   * @param {Event} ev A click event
   * @private
   */   
    _clickCalendar : function (ev) {
        _yuitest_coverfunc("build/calendar/calendar.js", "_clickCalendar", 270);
_yuitest_coverline("build/calendar/calendar.js", 271);
var clickedCell = ev.currentTarget,
            clickedCellIsDay = clickedCell.hasClass(CAL_DAY) && 
                               !clickedCell.hasClass(CAL_PREVMONTH_DAY) && 
                               !clickedCell.hasClass(CAL_NEXTMONTH_DAY),
            clickedCellIsSelected = clickedCell.hasClass(CAL_DAY_SELECTED);
        _yuitest_coverline("build/calendar/calendar.js", 276);
switch (this.get("selectionMode")) {
          case("single"):
               _yuitest_coverline("build/calendar/calendar.js", 278);
if (clickedCellIsDay) {
                  _yuitest_coverline("build/calendar/calendar.js", 279);
if (!clickedCellIsSelected) {
                    _yuitest_coverline("build/calendar/calendar.js", 280);
this._clearSelection(true);  
                    _yuitest_coverline("build/calendar/calendar.js", 281);
this._addDateToSelection(this._nodeToDate(clickedCell));
                  }
             }
               _yuitest_coverline("build/calendar/calendar.js", 284);
break;
            case("multiple-sticky"):
               _yuitest_coverline("build/calendar/calendar.js", 286);
if (clickedCellIsDay) {
                 _yuitest_coverline("build/calendar/calendar.js", 287);
if (clickedCellIsSelected) {
                  _yuitest_coverline("build/calendar/calendar.js", 288);
this._removeDateFromSelection(this._nodeToDate(clickedCell));
                 }
                 else {
                  _yuitest_coverline("build/calendar/calendar.js", 291);
this._addDateToSelection(this._nodeToDate(clickedCell));
                 }
               }
               _yuitest_coverline("build/calendar/calendar.js", 294);
break;
            case("multiple"):
               _yuitest_coverline("build/calendar/calendar.js", 296);
if (clickedCellIsDay) {
                 _yuitest_coverline("build/calendar/calendar.js", 297);
if (!ev.metaKey && !ev.ctrlKey && !ev.shiftKey) {
                      _yuitest_coverline("build/calendar/calendar.js", 298);
this._clearSelection(true);
                      _yuitest_coverline("build/calendar/calendar.js", 299);
this._lastSelectedDate = this._nodeToDate(clickedCell);
                      _yuitest_coverline("build/calendar/calendar.js", 300);
this._addDateToSelection(this._lastSelectedDate);
                 }
                 else {_yuitest_coverline("build/calendar/calendar.js", 302);
if (((os == 'macintosh' && ev.metaKey) || (os != 'macintosh' && ev.ctrlKey)) && !ev.shiftKey) {
                    _yuitest_coverline("build/calendar/calendar.js", 303);
if (clickedCellIsSelected) {
                      _yuitest_coverline("build/calendar/calendar.js", 304);
this._removeDateFromSelection(this._nodeToDate(clickedCell));
                      _yuitest_coverline("build/calendar/calendar.js", 305);
this._lastSelectedDate = null;
                    }
                    else {
                      _yuitest_coverline("build/calendar/calendar.js", 308);
this._lastSelectedDate = this._nodeToDate(clickedCell);
                      _yuitest_coverline("build/calendar/calendar.js", 309);
this._addDateToSelection(this._lastSelectedDate);
                    }
                 }
                 else {_yuitest_coverline("build/calendar/calendar.js", 312);
if (((os == 'macintosh' && ev.metaKey) || (os != 'macintosh' && ev.ctrlKey)) && ev.shiftKey) {
                    _yuitest_coverline("build/calendar/calendar.js", 313);
if (this._lastSelectedDate) {
                      _yuitest_coverline("build/calendar/calendar.js", 314);
var selectedDate = this._nodeToDate(clickedCell);
                      _yuitest_coverline("build/calendar/calendar.js", 315);
this._addDateRangeToSelection(selectedDate, this._lastSelectedDate);
                      _yuitest_coverline("build/calendar/calendar.js", 316);
this._lastSelectedDate = selectedDate;
                    }
                    else {
                      _yuitest_coverline("build/calendar/calendar.js", 319);
this._lastSelectedDate = this._nodeToDate(clickedCell);
                      _yuitest_coverline("build/calendar/calendar.js", 320);
this._addDateToSelection(this._lastSelectedDate);
                    }
  
                 }
                 else {_yuitest_coverline("build/calendar/calendar.js", 324);
if (ev.shiftKey) {
                      _yuitest_coverline("build/calendar/calendar.js", 325);
if (this._lastSelectedDate) {
                        _yuitest_coverline("build/calendar/calendar.js", 326);
var selectedDate = this._nodeToDate(clickedCell);
                        _yuitest_coverline("build/calendar/calendar.js", 327);
this._clearSelection(true);
                        _yuitest_coverline("build/calendar/calendar.js", 328);
this._addDateRangeToSelection(selectedDate, this._lastSelectedDate);
                        _yuitest_coverline("build/calendar/calendar.js", 329);
this._lastSelectedDate = selectedDate;
                      }
                      else {
                        _yuitest_coverline("build/calendar/calendar.js", 332);
this._clearSelection(true);
                        _yuitest_coverline("build/calendar/calendar.js", 333);
this._lastSelectedDate = this._nodeToDate(clickedCell);
                          _yuitest_coverline("build/calendar/calendar.js", 334);
this._addDateToSelection(this._lastSelectedDate);
                      }
                 }}}}
              }
              _yuitest_coverline("build/calendar/calendar.js", 338);
break;
        }

      _yuitest_coverline("build/calendar/calendar.js", 341);
if (clickedCellIsDay) {
   /**
     * Fired when a specific date cell in the calendar is clicked. The event carries a 
     * payload which includes a `cell` property corresponding to the node of the actual
     * date cell, and a `date` property, with the `Date` that was clicked.
     *
     * @event dateClick
     */
        _yuitest_coverline("build/calendar/calendar.js", 349);
this.fire("dateClick", {cell: clickedCell, date: this._nodeToDate(clickedCell)});
      }
      else {_yuitest_coverline("build/calendar/calendar.js", 351);
if (clickedCell.hasClass(CAL_PREVMONTH_DAY)) {
   /**
     * Fired when any of the previous month's days displayed before the calendar grid
     * are clicked.
     *
     * @event prevMonthClick
     */
        _yuitest_coverline("build/calendar/calendar.js", 358);
this.fire("prevMonthClick");
      }
      else {_yuitest_coverline("build/calendar/calendar.js", 360);
if (clickedCell.hasClass(CAL_NEXTMONTH_DAY)) {
   /**
     * Fired when any of the next month's days displayed after the calendar grid
     * are clicked.
     *
     * @event nextMonthClick
     */
        _yuitest_coverline("build/calendar/calendar.js", 367);
this.fire("nextMonthClick");
      }}}
    },

  /**
   * Subtracts one month from the current calendar view.
   * @method subtractMonth
   */   
  subtractMonth : function (e) {
    _yuitest_coverfunc("build/calendar/calendar.js", "subtractMonth", 375);
_yuitest_coverline("build/calendar/calendar.js", 376);
this.set("date", ydate.addMonths(this.get("date"), -1));
    _yuitest_coverline("build/calendar/calendar.js", 377);
if (e) {
      _yuitest_coverline("build/calendar/calendar.js", 378);
e.halt();
    }
  },

  /**
   * Subtracts one year from the current calendar view.
   * @method subtractYear
   */ 
  subtractYear : function (e) {
    _yuitest_coverfunc("build/calendar/calendar.js", "subtractYear", 386);
_yuitest_coverline("build/calendar/calendar.js", 387);
this.set("date", ydate.addYears(this.get("date"), -1));
    _yuitest_coverline("build/calendar/calendar.js", 388);
if (e) {
      _yuitest_coverline("build/calendar/calendar.js", 389);
e.halt();
    }
  },

  /**
   * Adds one month to the current calendar view.
   * @method addMonth
   */   
  addMonth : function (e) {    
    _yuitest_coverfunc("build/calendar/calendar.js", "addMonth", 397);
_yuitest_coverline("build/calendar/calendar.js", 398);
this.set("date", ydate.addMonths(this.get("date"), 1));
    _yuitest_coverline("build/calendar/calendar.js", 399);
if (e) {
      _yuitest_coverline("build/calendar/calendar.js", 400);
e.halt();
    }
  },

  /**
   * Adds one year to the current calendar view.
   * @method addYear
   */   
  addYear : function (e) {
    _yuitest_coverfunc("build/calendar/calendar.js", "addYear", 408);
_yuitest_coverline("build/calendar/calendar.js", 409);
this.set("date", ydate.addYears(this.get("date"), 1));
    _yuitest_coverline("build/calendar/calendar.js", 410);
if (e) {
      _yuitest_coverline("build/calendar/calendar.js", 411);
e.halt();
    }
  }
},

{
   /**
    * The identity of the widget.
    *
    * @property NAME
    * @type String
    * @default 'calendar'
    * @readOnly
    * @protected
    * @static
    */  
  NAME: "calendar",

   /**
    * Static property used to define the default attribute configuration of
    * the Widget.
    *
    * @property ATTRS
    * @type {Object}
    * @protected
    * @static
    */  
  ATTRS: {

    /**
     * A setting specifying the type of selection the calendar allows.
     * Possible values include:
     * <ul>
     *   <li>`single` - One date at a time</li>
     *   <li>`multiple-sticky` - Multiple dates, selected one at a time (the dates "stick"). This option
     *   is appropriate for mobile devices, where function keys from the keyboard are not available.</li>
     *   <li>`multiple` - Multiple dates, selected with Ctrl/Meta keys for additional single
     *   dates, and Shift key for date ranges.</li>
     *
     * @attribute selectionMode
     * @type String
     * @default single
     */
    selectionMode: {
      value: "single"
    },

    /**
     * The date corresponding to the current calendar view. Always
     * normalized to the first of the month that contains the date
     * at assignment time. Used as the first date visible in the
     * calendar.
     *
     * @attribute date
     * @type Date
     * @default Today's date as set on the user's computer.
     */
    date: {
      value: new Date(),
      lazyAdd: false,
      setter: function (val) {

        _yuitest_coverfunc("build/calendar/calendar.js", "setter", 471);
_yuitest_coverline("build/calendar/calendar.js", 473);
var newDate = this._normalizeDate(val),
            newTopDate = ydate.addMonths(newDate, this._paneNumber - 1);
        _yuitest_coverline("build/calendar/calendar.js", 475);
var minDate = this.get("minimumDate");
        _yuitest_coverline("build/calendar/calendar.js", 476);
var maxDate = this.get("maximumDate");
            _yuitest_coverline("build/calendar/calendar.js", 477);
if ((!minDate || ydate.isGreaterOrEqual(newDate, minDate)) && 
                (!maxDate || ydate.isGreaterOrEqual(maxDate, newTopDate))) {
                _yuitest_coverline("build/calendar/calendar.js", 479);
return newDate;
            }

            else {_yuitest_coverline("build/calendar/calendar.js", 482);
if (minDate && ydate.isGreater(minDate, newDate)) {
                   _yuitest_coverline("build/calendar/calendar.js", 483);
return minDate;
            }

            else {_yuitest_coverline("build/calendar/calendar.js", 486);
if (maxDate && ydate.isGreater(newTopDate, maxDate)) {
                _yuitest_coverline("build/calendar/calendar.js", 487);
var actualMaxDate = ydate.addMonths(maxDate, -1*(this._paneNumber - 1));
                  _yuitest_coverline("build/calendar/calendar.js", 488);
return actualMaxDate;
            }}}
     }
    },

    /**
     * The minimum date that can be displayed by the calendar. The calendar will not
     * allow dates earlier than this one to be set, and will reset any earlier date to
     * this date. Should be `null` if no minimum date is needed.
     *
     * @attribute minimumDate
     * @type Date
     * @default null
     */
    minimumDate: {
      value: null,
      setter: function (val) {
        _yuitest_coverfunc("build/calendar/calendar.js", "setter", 504);
_yuitest_coverline("build/calendar/calendar.js", 505);
if (val) {
          _yuitest_coverline("build/calendar/calendar.js", 506);
var curDate = this.get('date'),
              newMinDate = this._normalizeDate(val);
          _yuitest_coverline("build/calendar/calendar.js", 508);
if (curDate && !ydate.isGreaterOrEqual(curDate, newMinDate)) {
              _yuitest_coverline("build/calendar/calendar.js", 509);
this.set('date', newMinDate);
          }
          _yuitest_coverline("build/calendar/calendar.js", 511);
return newMinDate;
        }
        else {
          _yuitest_coverline("build/calendar/calendar.js", 514);
return this._normalizeDate(val);
        }
      }
    },

    /**
     * The maximum date that can be displayed by the calendar. The calendar will not
     * allow dates later than this one to be set, and will reset any later date to
     * this date. Should be `null` if no maximum date is needed.
     *
     * @attribute maximumDate
     * @type Date
     * @default null
     */
    maximumDate: {
      value: null,
      setter: function (val) {
        _yuitest_coverfunc("build/calendar/calendar.js", "setter", 530);
_yuitest_coverline("build/calendar/calendar.js", 531);
if (val) {
          _yuitest_coverline("build/calendar/calendar.js", 532);
var curDate = this.get('date'),
              newMaxDate = this._normalizeDate(val);
          _yuitest_coverline("build/calendar/calendar.js", 534);
if (curDate && !ydate.isGreaterOrEqual(val, ydate.addMonths(curDate, this._paneNumber - 1))) {
              _yuitest_coverline("build/calendar/calendar.js", 535);
this.set('date', ydate.addMonths(newMaxDate, -1*(this._paneNumber -1)));
          }
          _yuitest_coverline("build/calendar/calendar.js", 537);
return newMaxDate;
        }
        else {
          _yuitest_coverline("build/calendar/calendar.js", 540);
return val;
        }
      }
    }
  }
});

}, '3.7.3', {"requires": ["calendar-base", "calendarnavigator"], "lang": ["de", "en", "fr", "ja", "nb-NO", "pt-BR", "ru", "zh-HANT-TW"], "skinnable": true});
