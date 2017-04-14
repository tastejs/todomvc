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
_yuitest_coverage["build/calendar-base/calendar-base.js"] = {
    lines: {},
    functions: {},
    coveredLines: 0,
    calledLines: 0,
    coveredFunctions: 0,
    calledFunctions: 0,
    path: "build/calendar-base/calendar-base.js",
    code: []
};
_yuitest_coverage["build/calendar-base/calendar-base.js"].code=["YUI.add('calendar-base', function (Y, NAME) {","","/**"," * The CalendarBase submodule is a basic UI calendar view that displays"," * a range of dates in a two-dimensional month grid, with one or more"," * months visible at a single time. CalendarBase supports custom date"," * rendering, multiple calendar panes, and selection. "," * @module calendar"," * @submodule calendar-base"," */","    ","var getCN                 = Y.ClassNameManager.getClassName,","    CALENDAR              = 'calendar',","    CAL_GRID              = getCN(CALENDAR, 'grid'),","    CAL_LEFT_GRID         = getCN(CALENDAR, 'left-grid'),","    CAL_RIGHT_GRID        = getCN(CALENDAR, 'right-grid'),","    CAL_BODY              = getCN(CALENDAR, 'body'),","    CAL_HD                = getCN(CALENDAR, 'header'),","    CAL_HD_LABEL          = getCN(CALENDAR, 'header-label'),","    CAL_WDAYROW           = getCN(CALENDAR, 'weekdayrow'),","    CAL_WDAY              = getCN(CALENDAR, 'weekday'),","    CAL_COL_HIDDEN        = getCN(CALENDAR, 'column-hidden'),","    CAL_DAY_SELECTED      = getCN(CALENDAR, 'day-selected'),","    SELECTION_DISABLED    = getCN(CALENDAR, 'selection-disabled'),","    CAL_ROW               = getCN(CALENDAR, 'row'),","    CAL_DAY               = getCN(CALENDAR, 'day'),","    CAL_PREVMONTH_DAY     = getCN(CALENDAR, 'prevmonth-day'),","    CAL_NEXTMONTH_DAY     = getCN(CALENDAR, 'nextmonth-day'),","    CAL_ANCHOR            = getCN(CALENDAR, 'anchor'),","    CAL_PANE              = getCN(CALENDAR, 'pane'),","    CAL_STATUS            = getCN(CALENDAR, 'status'),","    L           = Y.Lang,","    node        = Y.Node,","    create      = node.create,","    substitute  = Y.substitute,","    each        = Y.each,","    hasVal      = Y.Array.hasValue,","    iOf         = Y.Array.indexOf,","    hasKey      = Y.Object.hasKey,","    setVal      = Y.Object.setValue,","    owns        = Y.Object.owns,","    isEmpty     = Y.Object.isEmpty,","    ydate       = Y.DataType.Date;","","/** Create a calendar view to represent a single or multiple","  * month range of dates, rendered as a grid with date and","  * weekday labels.","  * ","  * @class CalendarBase","  * @extends Widget","  * @param config {Object} Configuration object (see Configuration ","  * attributes)","  * @constructor","  */","function CalendarBase(config) {","  CalendarBase.superclass.constructor.apply ( this, arguments );","}","","","","Y.CalendarBase = Y.extend( CalendarBase, Y.Widget, {","","  /**","   * A storage for various properties of individual month","   * panes.","   *","   * @property _paneProperties","   * @type Object","   * @private","   */","  _paneProperties : {},","","  /**","   * The number of month panes in the calendar, deduced","   * from the CONTENT_TEMPLATE's number of {calendar_grid}","   * tokens.","   *","   * @property _paneNumber","   * @type Number","   * @private","   */","  _paneNumber : 1,","","  /**","   * The unique id used to prefix various elements of this","   * calendar instance.","   *","   * @property _calendarId","   * @type String","   * @private","   */","  _calendarId : null,","","  /**","   * The hash map of selected dates, populated with","   * selectDates() and deselectDates() methods ","   *","   * @property _selectedDates","   * @type Object","   * @private","   */","  _selectedDates : {},","","  /**","   * A private copy of the rules object, populated","   * by setting the customRenderer attribute.","   *","   * @property _rules","   * @type Object","   * @private","   */","  _rules : {},","","  /**","   * A private copy of the filterFunction, populated","   * by setting the customRenderer attribute.","   *","   * @property _filterFunction","   * @type Function","   * @private","   */","  _filterFunction : null,","","  /**","   * Storage for calendar cells modified by any custom","   * formatting. The storage is cleared, used to restore","   * cells to the original state, and repopulated accordingly","   * when the calendar is rerendered. ","   *","   * @property _storedDateCells","   * @type Object","   * @private","   */","  _storedDateCells : {},","","  /**","   * Designated initializer","   * Initializes instance-level properties of","   * calendar.","   *","   * @method initializer","   */  ","  initializer : function () {","    this._paneProperties = {};","    this._calendarId = Y.guid('calendar');","    this._selectedDates = {};","    if (isEmpty(this._rules)) {","       this._rules = {};      ","    }","    this._storedDateCells = {};","  },","","  /**","   * renderUI implementation","   *","   * Creates a visual representation of the calendar based on existing parameters. ","   * @method renderUI","   */  ","  renderUI : function () {","","      var contentBox = this.get('contentBox');","      contentBox.appendChild(this._initCalendarHTML(this.get('date')));","        if (this.get('showPrevMonth')) {","            this._afterShowPrevMonthChange();","        }","        if (this.get('showNextMonth')) {","            this._afterShowNextMonthChange();","        }","      this._renderCustomRules();","      this._renderSelectedDates();","","    this.get(\"boundingBox\").setAttribute(\"aria-labelledby\", this._calendarId + \"_header\");","","  },","  /**","   * bindUI implementation","   *","   * Assigns listeners to relevant events that change the state","   * of the calendar.","   * @method bindUI","   */ ","  bindUI : function () {","    this.after('dateChange', this._afterDateChange);","    this.after('showPrevMonthChange', this._afterShowPrevMonthChange);","    this.after('showNextMonthChange', this._afterShowNextMonthChange);","    this.after('headerRendererChange', this._afterHeaderRendererChange);","    this.after('customRendererChange', this._afterCustomRendererChange);","    this.after('enabledDatesRuleChange', this._afterCustomRendererChange);","    this.after('disabledDatesRuleChange', this._afterCustomRendererChange);","    this.after('focusedChange', this._afterFocusedChange);","    this.after('selectionChange', this._renderSelectedDates);","    this._bindCalendarEvents();","  },","","","    /**","     * An internal utility method that generates a list of selected dates ","     * from the hash storage.","     *","     * @method _getSelectedDatesList","     * @protected","     * @return {Array} The array of `Date`s that are currently selected.","     */","    _getSelectedDatesList : function () {","      var output = [];","      each (this._selectedDates, function (year) {","        each (year, function (month) {","          each (month, function (day) {","           output.push (day);","           }, this);","        }, this);","      }, this);","      return output;","    },","","    /**","     * A utility method that returns all dates selected in a specific month.","     *","     * @method _getSelectedDatesInMonth","     * @param {Date} oDate corresponding to the month for which selected dates","     * are requested.","     * @protected","     * @return {Array} The array of `Date`s in a given month that are currently selected.","     */","    _getSelectedDatesInMonth : function (oDate) {","      var year = oDate.getFullYear(),","          month = oDate.getMonth();","      ","        if (hasKey(this._selectedDates, year) && hasKey(this._selectedDates[year], month)) {","           return Y.Object.values(this._selectedDates[year][month]); ","        }","        else {","           return [];","        }","      },","","","    /**","     * An internal parsing method that receives a String list of numbers","     * and number ranges (of the form \"1,2,3,4-6,7-9,10,11\" etc.) and checks","     * whether a specific number is included in this list. Used for looking","     * up dates in the customRenderer rule set.","     *","     * @method _isNumInList","     * @param {Number} num The number to look for in a list.","     * @param {String} strList The list of numbers of the form \"1,2,3,4-6,7-8,9\", etc.","     * @private","     * @return {boolean} Returns true if the given number is in the given list.","     */","    _isNumInList : function (num, strList) {","        if (strList == \"all\") {","            return true;","        }","        else {","            var elements = strList.split(\",\"),","                i = elements.length;","","            while (i--) {","                var range = elements[i].split(\"-\");","                if (range.length == 2 && num >= parseInt(range[0], 10) && num <= parseInt(range[1], 10)) {","                    return true;","                }","                else if (range.length == 1 && (parseInt(elements[i], 10) == num)) {","                    return true;","                }","            }","            return false;   ","        }","    },","","    /**","     * Given a specific date, returns an array of rules (from the customRenderer rule set)","     * that the given date matches.","     *","     * @method _getRulesForDate","     * @param {Date} oDate The date for which an array of rules is needed","     * @private","     * @return {Array} Returns an array of `String`s, each containg the name of","     * a rule that the given date matches.","     */","    _getRulesForDate : function (oDate) {","      var year = oDate.getFullYear(),","          month = oDate.getMonth(),","          date = oDate.getDate(),","          wday = oDate.getDay(),","          rules = this._rules, ","          outputRules = [],","          years, months, dates, days;","","      for (years in rules) {","          if (this._isNumInList(year, years)) {","              if (L.isString(rules[years])) {","                  outputRules.push(rules[years]);","              }","              else {","                  for (months in rules[years]) {","                      if (this._isNumInList(month, months)) {","                          if (L.isString(rules[years][months])) {","                              outputRules.push(rules[years][months]);","                          }","                          else {","                              for (dates in rules[years][months]) {","                                  if (this._isNumInList(date, dates)) {","                                      if (L.isString(rules[years][months][dates])) {","                                          outputRules.push(rules[years][months][dates]);","                                      }","                                      else {","                                          for (days in rules[years][months][dates]) {","                                              if (this._isNumInList(wday, days)) {","                                                  if (L.isString(rules[years][months][dates][days])) {","                                                     outputRules.push(rules[years][months][dates][days]);","                                                  }","                                              }","                                          }","                                      }","                                  }","                              }","                          }","                      }","                  } ","              }","          }","      }","      return outputRules;","    },","","    /**","     * A utility method which, given a specific date and a name of the rule,","     * checks whether the date matches the given rule.","     *","     * @method _matchesRule","     * @param {Date} oDate The date to check","     * @param {String} rule The name of the rule that the date should match.","     * @private","     * @return {boolean} Returns true if the date matches the given rule.","     *","     */","    _matchesRule : function (oDate, rule) {","        return (iOf(this._getRulesForDate(oDate), rule) >= 0);","    },","","    /**","     * A utility method which checks whether a given date matches the `enabledDatesRule`","     * or does not match the `disabledDatesRule` and therefore whether it can be selected.","     * @method _canBeSelected","     * @param {Date} oDate The date to check","     * @private","     * @return {boolean} Returns true if the date can be selected; false otherwise.","     */","    _canBeSelected : function (oDate) {","       ","       var enabledDatesRule = this.get(\"enabledDatesRule\"),","           disabledDatesRule = this.get(\"disabledDatesRule\");","","       if (enabledDatesRule) {","           return this._matchesRule(oDate, enabledDatesRule);","       }","       else if (disabledDatesRule) {","           return !this._matchesRule(oDate, disabledDatesRule);","       }","       else {","           return true;","       }","    },","","    /**","     * Selects a given date or array of dates.","     * @method selectDates","     * @param {Date|Array} dates A `Date` or `Array` of `Date`s.","     */","    selectDates : function (dates) {","      if (ydate.isValidDate(dates)) {","         this._addDateToSelection(dates);","      }","      else if (L.isArray(dates)) {","         this._addDatesToSelection(dates);","      }","    },","","    /**","     * Deselects a given date or array of dates, or deselects","     * all dates if no argument is specified.","     * @method deselectDates","     * @param {Date|Array} [dates] A `Date` or `Array` of `Date`s, or no","     * argument if all dates should be deselected.","     */","    deselectDates : function (dates) {","      if (!dates) {","         this._clearSelection();","      }","      else if (ydate.isValidDate(dates)) {","         this._removeDateFromSelection(dates);","      }","      else if (L.isArray(dates)) {","         this._removeDatesFromSelection(dates);","      }","    },","","    /**","     * A utility method that adds a given date to selection..","     * @method _addDateToSelection","     * @param {Date} oDate The date to add to selection.","     * @param {Number} [index] An optional parameter that is used","     * to differentiate between individual date selections and multiple","     * date selections.","     * @private","     */","    _addDateToSelection : function (oDate, index) {","","      if (this._canBeSelected(oDate)) {","","        var year = oDate.getFullYear(),","            month = oDate.getMonth(),","            day = oDate.getDate();","        ","        if (hasKey(this._selectedDates, year)) {","            if (hasKey(this._selectedDates[year], month)) {","                this._selectedDates[year][month][day] = oDate;","            }","            else {","                this._selectedDates[year][month] = {};","                this._selectedDates[year][month][day] = oDate;","            }","        }","        else {","            this._selectedDates[year] = {};","            this._selectedDates[year][month] = {};","            this._selectedDates[year][month][day] = oDate;","        }","","        this._selectedDates = setVal(this._selectedDates, [year, month, day], oDate);","","        if (!index) {","        this._fireSelectionChange();","        }","      }","    },","","    /**","     * A utility method that adds a given list of dates to selection.","     * @method _addDatesToSelection","     * @param {Array} datesArray The list of dates to add to selection.","     * @private","     */","    _addDatesToSelection : function (datesArray) {","        each(datesArray, this._addDateToSelection, this);","        this._fireSelectionChange();","    },","","    /**","     * A utility method that adds a given range of dates to selection.","     * @method _addDateRangeToSelection","     * @param {Date} startDate The first date of the given range.","     * @param {Date} endDate The last date of the given range.","     * @private","     */","    _addDateRangeToSelection : function (startDate, endDate) {","","        var timezoneDifference = (endDate.getTimezoneOffset() - startDate.getTimezoneOffset())*60000,","            startTime = startDate.getTime(),","            endTime   = endDate.getTime();","            ","            if (startTime > endTime) {","                var tempTime = startTime;","                startTime = endTime;","                endTime = tempTime + timezoneDifference;","            }","            else {","                endTime = endTime - timezoneDifference;","            }","","","        for (var time = startTime; time <= endTime; time += 86400000) {","            var addedDate = new Date(time);","                addedDate.setHours(12);","            this._addDateToSelection(addedDate, time);","        }","        this._fireSelectionChange();","    },","","    /**","     * A utility method that removes a given date from selection..","     * @method _removeDateFromSelection","     * @param {Date} oDate The date to remove from selection.","     * @param {Number} [index] An optional parameter that is used","     * to differentiate between individual date selections and multiple","     * date selections.","     * @private","     */","    _removeDateFromSelection : function (oDate, index) {","        var year = oDate.getFullYear(),","            month = oDate.getMonth(),","            day = oDate.getDate();","        if (hasKey(this._selectedDates, year) && ","            hasKey(this._selectedDates[year], month) && ","            hasKey(this._selectedDates[year][month], day)) {","               delete this._selectedDates[year][month][day];","               if (!index) {","                 this._fireSelectionChange();","               }","        }","    },","","    /**","     * A utility method that removes a given list of dates from selection.","     * @method _removeDatesFromSelection","     * @param {Array} datesArray The list of dates to remove from selection.","     * @private","     */","    _removeDatesFromSelection : function (datesArray) {","        each(datesArray, this._removeDateFromSelection, this);","        this._fireSelectionChange();","    },","","    /**","     * A utility method that removes a given range of dates from selection.","     * @method _removeDateRangeFromSelection","     * @param {Date} startDate The first date of the given range.","     * @param {Date} endDate The last date of the given range.","     * @private","     */","    _removeDateRangeFromSelection : function (startDate, endDate) {","        var startTime = startDate.getTime(),","            endTime   = endDate.getTime();","        ","        for (var time = startTime; time <= endTime; time += 86400000) {","            this._removeDateFromSelection(new Date(time), time);","        }","","        this._fireSelectionChange();    ","    },","","    /**","     * A utility method that removes all dates from selection.","     * @method _clearSelection","     * @param {boolean} noevent A Boolean specifying whether a selectionChange","     * event should be fired. If true, the event is not fired.","     * @private","     */","    _clearSelection : function (noevent) {","        this._selectedDates = {};","        this.get(\"contentBox\").all(\".\" + CAL_DAY_SELECTED).removeClass(CAL_DAY_SELECTED).setAttribute(\"aria-selected\", false);","        if (!noevent) {","          this._fireSelectionChange();","        }","    },","","    /**","     * A utility method that fires a selectionChange event.","     * @method _fireSelectionChange","     * @private","     */","    _fireSelectionChange : function () {","","   /**","     * Fired when the set of selected dates changes. Contains a payload with","     * a `newSelection` property with an array of selected dates.","     *","     * @event selectionChange","     */","      this.fire(\"selectionChange\", {newSelection: this._getSelectedDatesList()});","    },","","    /**","     * A utility method that restores cells modified by custom formatting.","     * @method _restoreModifiedCells","     * @private","     */","    _restoreModifiedCells : function () {","      var contentbox = this.get(\"contentBox\"),","          id;","      for (id in this._storedDateCells) {","          contentbox.one(\"#\" + id).replace(this._storedDateCells[id]);","          delete this._storedDateCells[id];","      }","    },","","    /**","     * A rendering assist method that renders all cells modified by the customRenderer","     * rules, as well as the enabledDatesRule and disabledDatesRule.","     * @method _renderCustomRules","     * @private","     */","    _renderCustomRules : function () {","","        this.get(\"contentBox\").all(\".\" + CAL_DAY + \",.\" + CAL_NEXTMONTH_DAY).removeClass(SELECTION_DISABLED).setAttribute(\"aria-disabled\", false);","","        if (!isEmpty(this._rules)) {","        var enRule = this.get(\"enabledDatesRule\"),","            disRule = this.get(\"disabledDatesRule\");","","           for (var paneNum = 0; paneNum < this._paneNumber; paneNum++) {","             var paneDate = ydate.addMonths(this.get(\"date\"), paneNum);","             var dateArray = ydate.listOfDatesInMonth(paneDate);","             each(dateArray, function (date) {","                var matchingRules = this._getRulesForDate(date);","                if (matchingRules.length > 0) {","                    var dateNode = this._dateToNode(date);","                    if ((enRule && iOf(matchingRules, enRule) < 0) || (!enRule && disRule && iOf(matchingRules, disRule) >= 0)) {","                            dateNode.addClass(SELECTION_DISABLED).setAttribute(\"aria-disabled\", true);","                        }","                        ","                    if (L.isFunction(this._filterFunction)) {","                        this._storedDateCells[dateNode.get(\"id\")] = dateNode.cloneNode(true);","                        this._filterFunction (date, dateNode, matchingRules);","                    }","                }","                else if (enRule) {","                   var dateNode = this._dateToNode(date);","                   dateNode.addClass(SELECTION_DISABLED).setAttribute(\"aria-disabled\", true);","                }","                },","             this);","          }","       }         ","    },","","    /**","     * A rendering assist method that renders all cells that are currently selected.","     * @method _renderSelectedDates","     * @private","     */","  _renderSelectedDates : function () {","    this.get(\"contentBox\").all(\".\" + CAL_DAY_SELECTED).removeClass(CAL_DAY_SELECTED).setAttribute(\"aria-selected\", false);","    ","        for (var paneNum = 0; paneNum < this._paneNumber; paneNum++) {","        var paneDate = ydate.addMonths(this.get(\"date\"), paneNum);","        var dateArray = this._getSelectedDatesInMonth(paneDate);","        each(dateArray, function (date) {","            this._dateToNode(date).addClass(CAL_DAY_SELECTED).setAttribute(\"aria-selected\", true);","                        },","             this);","      }","  },","","    /**","     * A utility method that converts a date to the node wrapping the calendar cell","     * the date corresponds to..","     * @method _dateToNode","     * @param {Date} oDate The date to convert to Node","     * @protected","     * @return {Node} The node wrapping the DOM element of the cell the date ","     * corresponds to.","     */","  _dateToNode : function (oDate) {","    var day = oDate.getDate(),","            col = 0,","            daymod = day%7,","            paneNum = (12 + oDate.getMonth() - this.get(\"date\").getMonth()) % 12,","            paneId = this._calendarId + \"_pane_\" + paneNum,","            cutoffCol = this._paneProperties[paneId].cutoffCol;","","        switch (daymod) {","          case (0):","             if (cutoffCol >= 6) {","               col = 12;","             }","             else {","               col = 5;","             }","             break;","          case (1):","               col = 6;","             break;","          case (2):","             if (cutoffCol > 0) {","               col = 7;","             }","             else {","               col = 0;","             }","             break;","          case (3):","             if (cutoffCol > 1) {","               col = 8;","             }","             else {","               col = 1;","             }","             break;","          case (4):","             if (cutoffCol > 2) {","               col = 9;","             }","             else {","               col = 2;","             }","             break;","          case (5):","             if (cutoffCol > 3) {","               col = 10;","             }","             else {","               col = 3;","             }","             break;","          case (6):","             if (cutoffCol > 4) {","               col = 11;","             }","             else {","               col = 4;","             }","             break;","        }","        return(this.get(\"contentBox\").one(\"#\" + this._calendarId + \"_pane_\" + paneNum + \"_\" + col + \"_\" + day));  ","","  },","","    /**","     * A utility method that converts a node corresponding to the DOM element of","     * the cell for a particular date to that date.","     * @method _nodeToDate","     * @param {Node} oNode The Node wrapping the DOM element of a particular date cell.","     * @protected","     * @return {Date} The date corresponding to the DOM element that the given node wraps.","     */","  _nodeToDate : function (oNode) {","    ","        var idParts = oNode.get(\"id\").split(\"_\").reverse(),","            paneNum = parseInt(idParts[2], 10),","            day  = parseInt(idParts[0], 10);","","        var shiftedDate = ydate.addMonths(this.get(\"date\"), paneNum),","            year = shiftedDate.getFullYear(),","            month = shiftedDate.getMonth();","","    return new Date(year, month, day, 12, 0, 0, 0);","  },","","    /**","     * A placeholder method, called from bindUI, to bind the Calendar events.","     * @method _bindCalendarEvents","     * @protected","     */","  _bindCalendarEvents : function () {","    ","  },","","    /**","     * A utility method that normalizes a given date by converting it to the 1st","     * day of the month the date is in, with the time set to noon.","     * @method _normalizeDate","     * @param {Date} oDate The date to normalize","     * @protected","     * @return {Date} The normalized date, set to the first of the month, with time","     * set to noon.","     */","    _normalizeDate : function (date) {","      if (date) {","       return new Date(date.getFullYear(), date.getMonth(), 1, 12, 0, 0, 0);","      }","      else {","       return null;","      }  ","    },","","","    /**","     * A render assist utility method that computes the cutoff column for the calendar ","     * rendering mask.","     * @method _getCutoffColumn","     * @param {Date} date The date of the month grid to compute the cutoff column for.","     * @param {Number} firstday The first day of the week (modified by internationalized calendars)","     * @private","     * @return {Number} The number of the cutoff column.","     */","    _getCutoffColumn : function (date, firstday) {","","   var distance = this._normalizeDate(date).getDay() - firstday;","   var cutOffColumn = 6 - (distance + 7)%7;","   return cutOffColumn;","","    },","","    /**","     * A render assist method that turns on the view of the previous month's dates ","     * in a given calendar pane.","     * @method _turnPrevMonthOn","     * @param {Node} pane The calendar pane that needs its previous month's dates view","     * modified.","     * @protected","     */","    _turnPrevMonthOn : function (pane) {","        ","        var pane_id = pane.get(\"id\"),","            pane_date = this._paneProperties[pane_id].paneDate,","            daysInPrevMonth = ydate.daysInMonth(ydate.addMonths(pane_date, -1));","","        if (!this._paneProperties[pane_id].hasOwnProperty(\"daysInPrevMonth\")) {","          this._paneProperties[pane_id].daysInPrevMonth = 0;","        }","","        if (daysInPrevMonth != this._paneProperties[pane_id].daysInPrevMonth) {","        ","        this._paneProperties[pane_id].daysInPrevMonth = daysInPrevMonth;","","        for (var cell = 5; cell >= 0; cell--) ","           {","            pane.one(\"#\" + pane_id + \"_\" + cell + \"_\" + (cell-5)).set('text', daysInPrevMonth--);","           }","","        }","","","    },","","    /**","     * A render assist method that turns off the view of the previous month's dates ","     * in a given calendar pane.","     * @method _turnPrevMonthOff","     * @param {Node} pane The calendar pane that needs its previous month's dates view","     * modified.","     * @protected","     */","    _turnPrevMonthOff : function (pane) {","          var pane_id = pane.get(\"id\");","        this._paneProperties[pane_id].daysInPrevMonth = 0;","","        for (var cell = 5; cell >= 0; cell--) ","           {","            pane.one(\"#\" + pane_id + \"_\" + cell + \"_\" + (cell-5)).setContent(\"&nbsp;\");","           }      ","    },","","    /**","     * A render assist method that cleans up the last few cells in the month grid","     * when the number of days in the month changes.","     * @method _cleanUpNextMonthCells","     * @param {Node} pane The calendar pane that needs the last date cells cleaned up.","     * @private","     */","    _cleanUpNextMonthCells : function (pane) {","      var pane_id = pane.get(\"id\");","        pane.one(\"#\" + pane_id + \"_6_29\").removeClass(CAL_NEXTMONTH_DAY);","        pane.one(\"#\" + pane_id + \"_7_30\").removeClass(CAL_NEXTMONTH_DAY);","        pane.one(\"#\" + pane_id + \"_8_31\").removeClass(CAL_NEXTMONTH_DAY);","        pane.one(\"#\" + pane_id + \"_0_30\").removeClass(CAL_NEXTMONTH_DAY);","        pane.one(\"#\" + pane_id + \"_1_31\").removeClass(CAL_NEXTMONTH_DAY);     ","    },","","    /**","     * A render assist method that turns on the view of the next month's dates ","     * in a given calendar pane.","     * @method _turnNextMonthOn","     * @param {Node} pane The calendar pane that needs its next month's dates view","     * modified.","     * @protected","     */","    _turnNextMonthOn : function (pane) {       ","          var dayCounter = 1,","              pane_id = pane.get(\"id\"),","              daysInMonth = this._paneProperties[pane_id].daysInMonth,","              cutoffCol = this._paneProperties[pane_id].cutoffCol;","","        for (var cell = daysInMonth - 22; cell < cutoffCol + 7; cell++) ","           {","            pane.one(\"#\" + pane_id + \"_\" + cell + \"_\" + (cell+23)).set(\"text\", dayCounter++).addClass(CAL_NEXTMONTH_DAY);","           }","","        var startingCell = cutoffCol;","        if (daysInMonth == 31 && (cutoffCol <= 1)) {","          startingCell = 2;","        }","        else if (daysInMonth == 30 && cutoffCol === 0) {","          startingCell = 1;","        }","  ","        for (var cell = startingCell ; cell < cutoffCol + 7; cell++) {","            pane.one(\"#\" + pane_id + \"_\" + cell + \"_\" + (cell+30)).set(\"text\", dayCounter++).addClass(CAL_NEXTMONTH_DAY);    ","        }","    },","","    /**","     * A render assist method that turns off the view of the next month's dates ","     * in a given calendar pane.","     * @method _turnNextMonthOff","     * @param {Node} pane The calendar pane that needs its next month's dates view","     * modified.","     * @protected","     */","    _turnNextMonthOff : function (pane) {","          var pane_id = pane.get(\"id\"),","              daysInMonth = this._paneProperties[pane_id].daysInMonth,","              cutoffCol = this._paneProperties[pane_id].cutoffCol;","","        for (var cell = daysInMonth - 22; cell <= 12; cell++) ","           {","            pane.one(\"#\" + pane_id + \"_\" + cell + \"_\" + (cell+23)).setContent(\"&nbsp;\").addClass(CAL_NEXTMONTH_DAY);","           }","","        var startingCell = 0;","        if (daysInMonth == 31 && (cutoffCol <= 1)) {","          startingCell = 2;","        }","        else if (daysInMonth == 30 && cutoffCol === 0) {","          startingCell = 1;","        }","  ","        for (var cell = startingCell ; cell <= 12; cell++) {","            pane.one(\"#\" + pane_id + \"_\" + cell + \"_\" + (cell+30)).setContent(\"&nbsp;\").addClass(CAL_NEXTMONTH_DAY);   ","        }   ","    },","","    /**","     * The handler for the change in the showNextMonth attribute.","     * @method _afterShowNextMonthChange","     * @private","     */","    _afterShowNextMonthChange : function () {","      ","      var contentBox = this.get('contentBox'),","          lastPane = contentBox.one(\"#\" + this._calendarId + \"_pane_\" + (this._paneNumber - 1));","          this._cleanUpNextMonthCells(lastPane);  ","","","      if (this.get('showNextMonth')) {","          this._turnNextMonthOn(lastPane);","        }","","        else {","          this._turnNextMonthOff(lastPane);","        }","","    },","","    /**","     * The handler for the change in the showPrevMonth attribute.","     * @method _afterShowPrevMonthChange","     * @private","     */","    _afterShowPrevMonthChange : function () {","      var contentBox = this.get('contentBox'),","          firstPane = contentBox.one(\"#\" + this._calendarId + \"_pane_\" + 0);","","      if (this.get('showPrevMonth')) {","         this._turnPrevMonthOn(firstPane);","      }","","      else {","         this._turnPrevMonthOff(firstPane);","      }","      ","    },"," ","     /**","     * The handler for the change in the headerRenderer attribute.","     * @method _afterHeaderRendererChange","     * @private","     */ ","  _afterHeaderRendererChange : function () {","    var headerCell = this.get(\"contentBox\").one(\".\" + CAL_HD_LABEL);","    headerCell.setContent(this._updateCalendarHeader(this.get('date')));","  },","","     /**","     * The handler for the change in the customRenderer attribute.","     * @method _afterCustomRendererChange","     * @private","     */ ","    _afterCustomRendererChange : function () {","        this._restoreModifiedCells();","        this._renderCustomRules();","    },","","     /**","     * The handler for the change in the date attribute. Modifies the calendar","     * view by shifting the calendar grid mask and running custom rendering and","     * selection rendering as necessary.","     * @method _afterDateChange","     * @private","     */ ","  _afterDateChange : function () {","    ","    var contentBox = this.get('contentBox'),","        headerCell = contentBox.one(\".\" + CAL_HD).one(\".\" + CAL_HD_LABEL),","        calendarPanes = contentBox.all(\".\" + CAL_GRID),","        currentDate = this.get(\"date\"),","        counter = 0;","","  contentBox.setStyle(\"visibility\", \"hidden\");","  headerCell.setContent(this._updateCalendarHeader(currentDate));","  ","    this._restoreModifiedCells();","","    calendarPanes.each(function (curNode) {","                      this._rerenderCalendarPane(ydate.addMonths(currentDate, counter++), ","                                            curNode);","                                        }, this);","","     this._afterShowPrevMonthChange();","     this._afterShowNextMonthChange();","","    this._renderCustomRules();","    this._renderSelectedDates();","      ","  contentBox.setStyle(\"visibility\", \"visible\");","  },","","","     /**","     * A rendering assist method that initializes the HTML for a single","     * calendar pane.","     * @method _initCalendarPane","     * @param {Date} baseDate The date corresponding to the month of the given","     * calendar pane.","     * @param {String} pane_id The id of the pane, to be used as a prefix for","     * element ids in the given pane.","     * @private","     */ ","  _initCalendarPane : function (baseDate, pane_id) {","        // Initialize final output HTML string","    var calString = '',","        // Get a list of short weekdays from the internationalization package, or else use default English ones.","        weekdays = this.get('strings.very_short_weekdays') || [\"Su\", \"Mo\", \"Tu\", \"We\", \"Th\", \"Fr\", \"Sa\"],","        fullweekdays = this.get('strings.weekdays') || [\"Sunday\", \"Monday\", \"Tuesday\", \"Wednesday\", \"Thursday\", \"Friday\", \"Saturday\"],","        // Get the first day of the week from the internationalization package, or else use Sunday as default.","        firstday = this.get('strings.first_weekday') || 0,","        // Compute the cutoff column of the masked calendar table, based on the start date and the first day of week.","        cutoffCol = this._getCutoffColumn(baseDate, firstday),","        // Compute the number of days in the month based on starting date","        daysInMonth = ydate.daysInMonth(baseDate),","        // Initialize the array of individual row HTML strings","        row_array = ['','','','','',''],","        // Initialize the partial templates object","        partials = {};","        ","            // Initialize the partial template for the weekday row cells.","        partials[\"weekday_row\"] = '';","      ","      // Populate the partial template for the weekday row cells with weekday names","      for (var day = firstday; day <= firstday + 6; day++) {","               partials[\"weekday_row\"] += ","                  substitute(CalendarBase.WEEKDAY_TEMPLATE,","                       {weekdayname: weekdays[day%7],","                        full_weekdayname: fullweekdays[day%7]});","      }","        ","        // Populate the partial template for the weekday row container with the weekday row cells","      partials[\"weekday_row_template\"] = substitute(CalendarBase.WEEKDAY_ROW_TEMPLATE, partials);","","      // Populate the array of individual row HTML strings","          for (var row = 0; row <= 5; row++) {","          ","              for (var column = 0; column <= 12; column++) {  ","             ","             // Compute the value of the date that needs to populate the cell","             var date = 7*row - 5 + column;","","             // Compose the value of the unique id of the current calendar cell","             var id_date = pane_id + \"_\" + column + \"_\" + date;","","             // Set the calendar day class to one of three possible values","             var calendar_day_class = CAL_DAY;","","             if (date < 1) {","              calendar_day_class = CAL_PREVMONTH_DAY;","             }","                 else if (date > daysInMonth) {","                  calendar_day_class = CAL_NEXTMONTH_DAY;","                 }","","                 // Cut off dates that fall before the first and after the last date of the month","             if (date < 1 || date > daysInMonth) {","               date = \"&nbsp;\";","             }","             ","             // Decide on whether a column in the masked table is visible or not based on the value of the cutoff column.","             var column_visibility = (column >= cutoffCol && column < (cutoffCol + 7)) ? '' : CAL_COL_HIDDEN;","","             // Substitute the values into the partial calendar day template and add it to the current row HTML string","             row_array[row] += substitute (CalendarBase.CALDAY_TEMPLATE, ","                                         {day_content: date,","                                        calendar_col_class: \"calendar_col\" + column,","                                        calendar_col_visibility_class: column_visibility,","                                        calendar_day_class: calendar_day_class,","                                        calendar_day_id: id_date});","             }","            }","      ","      // Instantiate the partial calendar pane body template","      partials[\"body_template\"] = '';","      ","      // Populate the body template with the rows templates","      each (row_array, function (v) {","         partials[\"body_template\"] += substitute(CalendarBase.CALDAY_ROW_TEMPLATE, ","                                                       {calday_row: v});","      });","","      // Populate the calendar grid id","      partials[\"calendar_pane_id\"] = pane_id;","","      // Populate the calendar pane tabindex","      partials[\"calendar_pane_tabindex\"] = this.get(\"tabIndex\");","      partials[\"pane_arialabel\"] = ydate.format(baseDate, {format:\"%B %Y\"});","","","      // Generate final output by substituting class names.","          var output = substitute(substitute (CalendarBase.CALENDAR_GRID_TEMPLATE, partials),","                              CalendarBase.CALENDAR_STRINGS);","","        // Store the initialized pane information","","        this._paneProperties[pane_id] = {cutoffCol: cutoffCol, daysInMonth: daysInMonth, paneDate: baseDate};","","      return output;","  },","","     /**","     * A rendering assist method that rerenders a specified calendar pane, based","     * on a new Date. ","     * @method _rerenderCalendarPane","     * @param {Date} newDate The date corresponding to the month of the given","     * calendar pane.","     * @param {Node} pane The node corresponding to the calendar pane to be rerenders.","     * @private","     */ ","  _rerenderCalendarPane : function (newDate, pane) {","","       // Get the first day of the week from the internationalization package, or else use Sunday as default.","     var firstday = this.get('strings.first_weekday') || 0,","         // Compute the cutoff column of the masked calendar table, based on the start date and the first day of week.","         cutoffCol = this._getCutoffColumn(newDate, firstday),","         // Compute the number of days in the month based on starting date","         daysInMonth = ydate.daysInMonth(newDate),","         // Get pane id for easier reference","         paneId = pane.get(\"id\");","  ","       // Hide the pane before making DOM changes to speed them up","         pane.setStyle(\"visibility\", \"hidden\");","         pane.setAttribute(\"aria-label\", ydate.format(newDate, {format:\"%B %Y\"}));","  ","       // Go through all columns, and flip their visibility setting based on whether they are within the unmasked range.","         for (var column = 0; column <= 12; column++) {","        var currentColumn = pane.all(\".\" + \"calendar_col\" + column);","        currentColumn.removeClass(CAL_COL_HIDDEN);","      ","        if (column < cutoffCol || column >= (cutoffCol + 7)) {","            currentColumn.addClass(CAL_COL_HIDDEN);","        }","        else {","          // Clean up dates in visible columns to account for the correct number of days in a month","          switch(column)","          {","         case 0:","          var curCell = pane.one(\"#\" + paneId + \"_0_30\");","          if (daysInMonth >= 30) {","            curCell.set(\"text\", \"30\");","            curCell.removeClass(CAL_NEXTMONTH_DAY).addClass(CAL_DAY);","          }","          else {","            curCell.setContent(\"&nbsp;\");","            curCell.addClass(CAL_NEXTMONTH_DAY).addClass(CAL_DAY);","          }","          break;","         case 1:","          var curCell = pane.one(\"#\" + paneId + \"_1_31\");","          if (daysInMonth >= 31) {","            curCell.set(\"text\", \"31\");","            curCell.removeClass(CAL_NEXTMONTH_DAY).addClass(CAL_DAY);","          }","          else {","            curCell.setContent(\"&nbsp;\");","            curCell.removeClass(CAL_DAY).addClass(CAL_NEXTMONTH_DAY);","          }","          break;","         case 6:","          var curCell = pane.one(\"#\" + paneId + \"_6_29\");","          if (daysInMonth >= 29) {","            curCell.set(\"text\", \"29\");","            curCell.removeClass(CAL_NEXTMONTH_DAY).addClass(CAL_DAY);","          }","          else {","            curCell.setContent(\"&nbsp;\");","            curCell.removeClass(CAL_DAY).addClass(CAL_NEXTMONTH_DAY);","          }","          break;","         case 7:","          var curCell = pane.one(\"#\" + paneId + \"_7_30\");","          if (daysInMonth >= 30) {","            curCell.set(\"text\", \"30\");","            curCell.removeClass(CAL_NEXTMONTH_DAY).addClass(CAL_DAY);","          }","          else {","            curCell.setContent(\"&nbsp;\");","            curCell.removeClass(CAL_DAY).addClass(CAL_NEXTMONTH_DAY);","          }","          break;","         case 8:","          var curCell = pane.one(\"#\" + paneId + \"_8_31\");","          if (daysInMonth >= 31) {","            curCell.set(\"text\", \"31\");","            curCell.removeClass(CAL_NEXTMONTH_DAY).addClass(CAL_DAY);","          }","          else {","            curCell.setContent(\"&nbsp;\");","            curCell.removeClass(CAL_DAY).addClass(CAL_NEXTMONTH_DAY);","          }","          break;","          } ","        }","        }","    // Update stored pane properties","    this._paneProperties[paneId].cutoffCol = cutoffCol;","    this._paneProperties[paneId].daysInMonth = daysInMonth;","    this._paneProperties[paneId].paneDate = newDate;","  ","  // Bring the pane visibility back after all DOM changes are done    ","  pane.setStyle(\"visibility\", \"visible\");","","  },","","     /**","     * A rendering assist method that updates the calendar header based","     * on a given date and potentially the provided headerRenderer.","     * @method _updateCalendarHeader","     * @param {Date} baseDate The date with which to update the calendar header.","     * @private","     */ ","    _updateCalendarHeader : function (baseDate) {","      var headerString = \"\",","      headerRenderer = this.get(\"headerRenderer\");","      ","      if (Y.Lang.isString(headerRenderer)) {","        headerString = ydate.format(baseDate, {format:headerRenderer});","      }","      else if (headerRenderer instanceof Function) {","        headerString = headerRenderer.call(this, baseDate);","      }","      ","      return headerString;  ","    },","","     /**","     * A rendering assist method that initializes the calendar header HTML ","     * based on a given date and potentially the provided headerRenderer.","     * @method _updateCalendarHeader","     * @param {Date} baseDate The date with which to initialize the calendar header.","     * @private","     */ ","    _initCalendarHeader : function (baseDate) {","      return substitute(substitute(CalendarBase.HEADER_TEMPLATE, ","                                 {calheader: this._updateCalendarHeader(baseDate),","                                  calendar_id: this._calendarId}), ","                      CalendarBase.CALENDAR_STRINGS);","    },","","     /**","     * A rendering assist method that initializes the calendar HTML ","     * based on a given date.","     * @method _initCalendarHTML","     * @param {Date} baseDate The date with which to initialize the calendar.","     * @private","     */          ","  _initCalendarHTML : function (baseDate) {","        // Instantiate the partials holder","        var partials = {},","            // Counter for iterative template replacement.","            counter = 0;","        ","        // Generate the template for the header   ","        partials[\"header_template\"] =  this._initCalendarHeader(baseDate);","        partials[\"calendar_id\"] = this._calendarId;","","          partials[\"body_template\"] = substitute(substitute (CalendarBase.CONTENT_TEMPLATE, partials),","                                             CalendarBase.CALENDAR_STRINGS);"," ","        // Instantiate the iterative template replacer function        ","        function paneReplacer () {","          var singlePane = this._initCalendarPane(ydate.addMonths(baseDate, counter), partials[\"calendar_id\"]+\"_pane_\"+counter);","          counter++;","          return singlePane;","        }","        // Go through all occurrences of the calendar_grid_template token and replace it with an appropriate calendar grid.","        var output = partials[\"body_template\"].replace(/\\{calendar_grid_template\\}/g, Y.bind(paneReplacer, this));","","        // Update the paneNumber count","        this._paneNumber = counter;","","    return output;","  }","}, {","  ","   /**","    * The CSS classnames for the calendar templates.","    * @property CALENDAR_STRINGS","    * @type Object","    * @readOnly","    * @protected","    * @static","    */  ","  CALENDAR_STRINGS: {","    calendar_grid_class       : CAL_GRID,","    calendar_body_class       : CAL_BODY,","    calendar_hd_class         : CAL_HD,","    calendar_hd_label_class   : CAL_HD_LABEL,","    calendar_weekdayrow_class : CAL_WDAYROW,","    calendar_weekday_class    : CAL_WDAY,","    calendar_row_class        : CAL_ROW,","    calendar_day_class        : CAL_DAY,","    calendar_dayanchor_class  : CAL_ANCHOR,","    calendar_pane_class       : CAL_PANE,","    calendar_right_grid_class : CAL_RIGHT_GRID,","    calendar_left_grid_class  : CAL_LEFT_GRID,","    calendar_status_class     : CAL_STATUS","  },","","  /*","","  ARIA_STATUS_TEMPLATE: '<div role=\"status\" aria-atomic=\"true\" class=\"{calendar_status_class}\"></div>',","","  AriaStatus : null,","","  updateStatus : function (statusString) {","","    if (!CalendarBase.AriaStatus) {","      CalendarBase.AriaStatus = create(","                             substitute (CalendarBase.ARIA_STATUS_TEMPLATE, ","                                         CalendarBase.CALENDAR_STRINGS));","      Y.one(\"body\").append(CalendarBase.AriaStatus);","    }","","      CalendarBase.AriaStatus.set(\"text\", statusString);","  },","","  */","","   /**","    * The main content template for calendar.","    * @property CONTENT_TEMPLATE","    * @type String","    * @protected","    * @static","    */  ","  CONTENT_TEMPLATE:  '<div class=\"yui3-g {calendar_pane_class}\" id=\"{calendar_id}\">' +  ","                              '{header_template}' +","                            '<div class=\"yui3-u-1\">' +","                              '{calendar_grid_template}' +","                            '</div>' +","                 '</div>',","","   /**","    * A single pane template for calendar (same as default CONTENT_TEMPLATE)","    * @property ONE_PANE_TEMPLATE","    * @type String","    * @protected","    * @readOnly","    * @static","    */  ","  ONE_PANE_TEMPLATE: '<div class=\"yui3-g {calendar_pane_class}\" id=\"{calendar_id}\">' +  ","                              '{header_template}' +","                            '<div class=\"yui3-u-1\">' +","                              '{calendar_grid_template}' +","                            '</div>' +","                 '</div>',","","   /**","    * A two pane template for calendar.","    * @property TWO_PANE_TEMPLATE","    * @type String","    * @protected","    * @readOnly","    * @static","    */  ","  TWO_PANE_TEMPLATE: '<div class=\"yui3-g {calendar_pane_class}\" id=\"{calendar_id}\">' +  ","                              '{header_template}' +","                            '<div class=\"yui3-u-1-2\">'+","                                    '<div class = \"{calendar_left_grid_class}\">' +                                  ","                                 '{calendar_grid_template}' +","                                    '</div>' +","                            '</div>' +","                            '<div class=\"yui3-u-1-2\">' +","                                    '<div class = \"{calendar_right_grid_class}\">' +","                                 '{calendar_grid_template}' +","                                    '</div>' +","                            '</div>' +                   ","                 '</div>',","   /**","    * A three pane template for calendar.","    * @property THREE_PANE_TEMPLATE","    * @type String","    * @protected","    * @readOnly","    * @static","    */  ","  THREE_PANE_TEMPLATE: '<div class=\"yui3-g {calendar_pane_class}\" id=\"{calendar_id}\">' +  ","                              '{header_template}' +","                            '<div class=\"yui3-u-1-3\">' +","                                    '<div class = \"{calendar_left_grid_class}\">' +","                                 '{calendar_grid_template}' +","                                    '</div>' + ","                            '</div>' +","                            '<div class=\"yui3-u-1-3\">' +","                                 '{calendar_grid_template}' +","                            '</div>' +      ","                            '<div class=\"yui3-u-1-3\">' +","                                    '<div class = \"{calendar_right_grid_class}\">' +","                                 '{calendar_grid_template}' +","                                    '</div>' + ","                            '</div>' +                                             ","                 '</div>',","   /**","    * A template for the calendar grid.","    * @property CALENDAR_GRID_TEMPLATE","    * @type String","    * @protected","    * @static","    */    ","  CALENDAR_GRID_TEMPLATE: '<table class=\"{calendar_grid_class}\" id=\"{calendar_pane_id}\" role=\"grid\" aria-readonly=\"true\" aria-label=\"{pane_arialabel}\" tabindex=\"{calendar_pane_tabindex}\">' + ","                           '<thead>' +","                        '{weekday_row_template}' +","                           '</thead>' +","                           '<tbody>' + ","                            '{body_template}' +","                           '</tbody>' +","                          '</table>',","","   /**","    * A template for the calendar header.","    * @property HEADER_TEMPLATE","    * @type String","    * @protected","    * @static","    */   ","  HEADER_TEMPLATE: '<div class=\"yui3-g {calendar_hd_class}\">' + ","                         '<div class=\"yui3-u {calendar_hd_label_class}\" id=\"{calendar_id}_header\" aria-role=\"heading\">' + ","                              '{calheader}' +","                         '</div>' +","                   '</div>',","","   /**","    * A template for the row of weekday names.","    * @property WEEKDAY_ROW_TEMPLATE","    * @type String","    * @protected","    * @static","    */ ","  WEEKDAY_ROW_TEMPLATE: '<tr class=\"{calendar_weekdayrow_class}\" role=\"row\">' + ","                           '{weekday_row}' +","              '</tr>',","","   /**","    * A template for a single row of calendar days.","    * @property CALDAY_ROW_TEMPLATE","    * @type String","    * @protected","    * @static","    */ ","  CALDAY_ROW_TEMPLATE: '<tr class=\"{calendar_row_class}\" role=\"row\">' + ","                 '{calday_row}' + ","              '</tr>',","","   /**","    * A template for a single cell with a weekday name.","    * @property CALDAY_ROW_TEMPLATE","    * @type String","    * @protected","    * @static","    */ ","  WEEKDAY_TEMPLATE: '<th class=\"{calendar_weekday_class}\" role=\"columnheader\" aria-label=\"{full_weekdayname}\">{weekdayname}</th>',","","   /**","    * A template for a single cell with a calendar day.","    * @property CALDAY_TEMPLATE","    * @type String","    * @protected","    * @static","    */ ","  CALDAY_TEMPLATE: '<td class=\"{calendar_col_class} {calendar_day_class} {calendar_col_visibility_class}\" id=\"{calendar_day_id}\" role=\"gridcell\" tabindex=\"-1\">' +","                       '{day_content}' + ","                   '</td>',","","   /**","    * The identity of the widget.","    *","    * @property NAME","    * @type String","    * @default 'calendarBase'","    * @readOnly","    * @protected","    * @static","    */  ","  NAME: 'calendarBase',","","   /**","    * Static property used to define the default attribute configuration of","    * the Widget.","    *","    * @property ATTRS","    * @type {Object}","    * @protected","    * @static","    */  ","  ATTRS: {","    tabIndex: {","      value: 1","    },","    /**","     * The date corresponding to the current calendar view. Always","     * normalized to the first of the month that contains the date","     * at assignment time. Used as the first date visible in the","     * calendar.","     *","     * @attribute date","     * @type Date","     * @default The first of the month containing today's date, as","     * set on the end user's system.","     */","    date: {","      value: new Date(),","      setter: function (val) {","        var newDate = this._normalizeDate(val);","        if (ydate.areEqual(newDate, this.get('date'))) {","            return this.get('date');","        }","        else {","            return newDate;","        }","      }","      },","","    /**","     * A setting specifying whether to shows days from the previous","     * month in the visible month's grid, if there are empty preceding","     * cells available.","     *","     * @attribute showPrevMonth","     * @type boolean","     * @default false","     */","    showPrevMonth: {","      value: false","    },","","    /**","     * A setting specifying whether to shows days from the next","     * month in the visible month's grid, if there are empty","     * cells available at the end.","     *","     * @attribute showNextMonth","     * @type boolean","     * @default false","     */","    showNextMonth: {","      value: false","    },","","    /**","     * Strings and properties derived from the internationalization packages","     * for the calendar.","     *","     * @attribute strings","     * @type Object","     * @protected","     */","    strings : {","            valueFn: function() { return Y.Intl.get(\"calendar-base\"); }","        },","","    /**","     * Custom header renderer for the calendar.","     *","     * @attribute headerRenderer","     * @type String | Function","     */","        headerRenderer: {","            value: \"%B %Y\"","        },","","    /**","     * The name of the rule which all enabled dates should match.","     * Either disabledDatesRule or enabledDatesRule should be specified,","     * or neither, but not both.","     *","     * @attribute enabledDatesRule","     * @type String","     * @default null","     */","        enabledDatesRule: {","            value: null","        },","","    /**","     * The name of the rule which all disabled dates should match.","     * Either disabledDatesRule or enabledDatesRule should be specified,","     * or neither, but not both.","     *","     * @attribute disabledDatesRule","     * @type String","     * @default null","     */","        disabledDatesRule: {","            value: null","        },","","    /**","     * A read-only attribute providing a list of currently selected dates.","     *","     * @attribute selectedDates","     * @readOnly","     * @type Array","     */","        selectedDates : {","          readOnly: true,","          getter: function (val) {","            return (this._getSelectedDatesList());","          }","        },","","    /**","     * An object of the form {rules:Object, filterFunction:Function},","     * providing  set of rules and a custom rendering function for ","     * customizing specific calendar cells.","     *","     * @attribute customRenderer","     * @readOnly","     * @type Object","     * @default {}","     */","        customRenderer : {","            lazyAdd: false,","            value: {},","            setter: function (val) {","                this._rules = val.rules;","                this._filterFunction = val.filterFunction;","            }","        }","  }","  ","});","","","}, '3.7.3', {\"requires\": [\"widget\", \"substitute\", \"datatype-date\", \"datatype-date-math\", \"cssgrids\"], \"lang\": [\"de\", \"en\", \"fr\", \"ja\", \"nb-NO\", \"pt-BR\", \"ru\", \"zh-HANT-TW\"], \"skinnable\": true});"];
_yuitest_coverage["build/calendar-base/calendar-base.js"].lines = {"1":0,"12":0,"55":0,"56":0,"61":0,"144":0,"145":0,"146":0,"147":0,"148":0,"150":0,"161":0,"162":0,"163":0,"164":0,"166":0,"167":0,"169":0,"170":0,"172":0,"183":0,"184":0,"185":0,"186":0,"187":0,"188":0,"189":0,"190":0,"191":0,"192":0,"205":0,"206":0,"207":0,"208":0,"209":0,"213":0,"226":0,"229":0,"230":0,"233":0,"251":0,"252":0,"255":0,"258":0,"259":0,"260":0,"261":0,"263":0,"264":0,"267":0,"282":0,"290":0,"291":0,"292":0,"293":0,"296":0,"297":0,"298":0,"299":0,"302":0,"303":0,"304":0,"305":0,"308":0,"309":0,"310":0,"311":0,"324":0,"339":0,"352":0,"355":0,"356":0,"358":0,"359":0,"362":0,"372":0,"373":0,"375":0,"376":0,"388":0,"389":0,"391":0,"392":0,"394":0,"395":0,"410":0,"412":0,"416":0,"417":0,"418":0,"421":0,"422":0,"426":0,"427":0,"428":0,"431":0,"433":0,"434":0,"446":0,"447":0,"459":0,"463":0,"464":0,"465":0,"466":0,"469":0,"473":0,"474":0,"475":0,"476":0,"478":0,"491":0,"494":0,"497":0,"498":0,"499":0,"511":0,"512":0,"523":0,"526":0,"527":0,"530":0,"541":0,"542":0,"543":0,"544":0,"561":0,"570":0,"572":0,"573":0,"574":0,"586":0,"588":0,"589":0,"592":0,"593":0,"594":0,"595":0,"596":0,"597":0,"598":0,"599":0,"600":0,"603":0,"604":0,"605":0,"608":0,"609":0,"610":0,"624":0,"626":0,"627":0,"628":0,"629":0,"630":0,"646":0,"653":0,"655":0,"656":0,"659":0,"661":0,"663":0,"664":0,"666":0,"667":0,"670":0,"672":0,"674":0,"675":0,"678":0,"680":0,"682":0,"683":0,"686":0,"688":0,"690":0,"691":0,"694":0,"696":0,"698":0,"699":0,"702":0,"704":0,"706":0,"720":0,"724":0,"728":0,"750":0,"751":0,"754":0,"770":0,"771":0,"772":0,"786":0,"790":0,"791":0,"794":0,"796":0,"798":0,"800":0,"817":0,"818":0,"820":0,"822":0,"834":0,"835":0,"836":0,"837":0,"838":0,"839":0,"851":0,"856":0,"858":0,"861":0,"862":0,"863":0,"865":0,"866":0,"869":0,"870":0,"883":0,"887":0,"889":0,"892":0,"893":0,"894":0,"896":0,"897":0,"900":0,"901":0,"912":0,"914":0,"917":0,"918":0,"922":0,"933":0,"936":0,"937":0,"941":0,"952":0,"953":0,"962":0,"963":0,"975":0,"981":0,"982":0,"984":0,"986":0,"987":0,"991":0,"992":0,"994":0,"995":0,"997":0,"1013":0,"1029":0,"1032":0,"1033":0,"1040":0,"1043":0,"1045":0,"1048":0,"1051":0,"1054":0,"1056":0,"1057":0,"1059":0,"1060":0,"1064":0,"1065":0,"1069":0,"1072":0,"1082":0,"1085":0,"1086":0,"1091":0,"1094":0,"1095":0,"1099":0,"1104":0,"1106":0,"1121":0,"1130":0,"1131":0,"1134":0,"1135":0,"1136":0,"1138":0,"1139":0,"1143":0,"1146":0,"1147":0,"1148":0,"1149":0,"1152":0,"1153":0,"1155":0,"1157":0,"1158":0,"1159":0,"1160":0,"1163":0,"1164":0,"1166":0,"1168":0,"1169":0,"1170":0,"1171":0,"1174":0,"1175":0,"1177":0,"1179":0,"1180":0,"1181":0,"1182":0,"1185":0,"1186":0,"1188":0,"1190":0,"1191":0,"1192":0,"1193":0,"1196":0,"1197":0,"1199":0,"1204":0,"1205":0,"1206":0,"1209":0,"1221":0,"1224":0,"1225":0,"1227":0,"1228":0,"1231":0,"1242":0,"1257":0,"1262":0,"1263":0,"1265":0,"1269":0,"1270":0,"1271":0,"1272":0,"1275":0,"1278":0,"1280":0,"1512":0,"1513":0,"1514":0,"1517":0,"1557":0,"1606":0,"1624":0,"1625":0};
_yuitest_coverage["build/calendar-base/calendar-base.js"].functions = {"CalendarBase:55":0,"initializer:143":0,"renderUI:159":0,"bindUI:182":0,"(anonymous 4):208":0,"(anonymous 3):207":0,"(anonymous 2):206":0,"_getSelectedDatesList:204":0,"_getSelectedDatesInMonth:225":0,"_isNumInList:250":0,"_getRulesForDate:281":0,"_matchesRule:338":0,"_canBeSelected:350":0,"selectDates:371":0,"deselectDates:387":0,"_addDateToSelection:408":0,"_addDatesToSelection:445":0,"_addDateRangeToSelection:457":0,"_removeDateFromSelection:490":0,"_removeDatesFromSelection:510":0,"_removeDateRangeFromSelection:522":0,"_clearSelection:540":0,"_fireSelectionChange:553":0,"_restoreModifiedCells:569":0,"(anonymous 5):595":0,"_renderCustomRules:584":0,"(anonymous 6):629":0,"_renderSelectedDates:623":0,"_dateToNode:645":0,"_nodeToDate:718":0,"_normalizeDate:749":0,"_getCutoffColumn:768":0,"_turnPrevMonthOn:784":0,"_turnPrevMonthOff:816":0,"_cleanUpNextMonthCells:833":0,"_turnNextMonthOn:850":0,"_turnNextMonthOff:882":0,"_afterShowNextMonthChange:910":0,"_afterShowPrevMonthChange:932":0,"_afterHeaderRendererChange:951":0,"_afterCustomRendererChange:961":0,"(anonymous 7):986":0,"_afterDateChange:973":0,"(anonymous 8):1085":0,"_initCalendarPane:1011":0,"_rerenderCalendarPane:1118":0,"_updateCalendarHeader:1220":0,"_initCalendarHeader:1241":0,"paneReplacer:1269":0,"_initCalendarHTML:1255":0,"setter:1511":0,"valueFn:1557":0,"getter:1605":0,"setter:1623":0,"(anonymous 1):1":0};
_yuitest_coverage["build/calendar-base/calendar-base.js"].coveredLines = 355;
_yuitest_coverage["build/calendar-base/calendar-base.js"].coveredFunctions = 55;
_yuitest_coverline("build/calendar-base/calendar-base.js", 1);
YUI.add('calendar-base', function (Y, NAME) {

/**
 * The CalendarBase submodule is a basic UI calendar view that displays
 * a range of dates in a two-dimensional month grid, with one or more
 * months visible at a single time. CalendarBase supports custom date
 * rendering, multiple calendar panes, and selection. 
 * @module calendar
 * @submodule calendar-base
 */
    
_yuitest_coverfunc("build/calendar-base/calendar-base.js", "(anonymous 1)", 1);
_yuitest_coverline("build/calendar-base/calendar-base.js", 12);
var getCN                 = Y.ClassNameManager.getClassName,
    CALENDAR              = 'calendar',
    CAL_GRID              = getCN(CALENDAR, 'grid'),
    CAL_LEFT_GRID         = getCN(CALENDAR, 'left-grid'),
    CAL_RIGHT_GRID        = getCN(CALENDAR, 'right-grid'),
    CAL_BODY              = getCN(CALENDAR, 'body'),
    CAL_HD                = getCN(CALENDAR, 'header'),
    CAL_HD_LABEL          = getCN(CALENDAR, 'header-label'),
    CAL_WDAYROW           = getCN(CALENDAR, 'weekdayrow'),
    CAL_WDAY              = getCN(CALENDAR, 'weekday'),
    CAL_COL_HIDDEN        = getCN(CALENDAR, 'column-hidden'),
    CAL_DAY_SELECTED      = getCN(CALENDAR, 'day-selected'),
    SELECTION_DISABLED    = getCN(CALENDAR, 'selection-disabled'),
    CAL_ROW               = getCN(CALENDAR, 'row'),
    CAL_DAY               = getCN(CALENDAR, 'day'),
    CAL_PREVMONTH_DAY     = getCN(CALENDAR, 'prevmonth-day'),
    CAL_NEXTMONTH_DAY     = getCN(CALENDAR, 'nextmonth-day'),
    CAL_ANCHOR            = getCN(CALENDAR, 'anchor'),
    CAL_PANE              = getCN(CALENDAR, 'pane'),
    CAL_STATUS            = getCN(CALENDAR, 'status'),
    L           = Y.Lang,
    node        = Y.Node,
    create      = node.create,
    substitute  = Y.substitute,
    each        = Y.each,
    hasVal      = Y.Array.hasValue,
    iOf         = Y.Array.indexOf,
    hasKey      = Y.Object.hasKey,
    setVal      = Y.Object.setValue,
    owns        = Y.Object.owns,
    isEmpty     = Y.Object.isEmpty,
    ydate       = Y.DataType.Date;

/** Create a calendar view to represent a single or multiple
  * month range of dates, rendered as a grid with date and
  * weekday labels.
  * 
  * @class CalendarBase
  * @extends Widget
  * @param config {Object} Configuration object (see Configuration 
  * attributes)
  * @constructor
  */
_yuitest_coverline("build/calendar-base/calendar-base.js", 55);
function CalendarBase(config) {
  _yuitest_coverfunc("build/calendar-base/calendar-base.js", "CalendarBase", 55);
_yuitest_coverline("build/calendar-base/calendar-base.js", 56);
CalendarBase.superclass.constructor.apply ( this, arguments );
}



_yuitest_coverline("build/calendar-base/calendar-base.js", 61);
Y.CalendarBase = Y.extend( CalendarBase, Y.Widget, {

  /**
   * A storage for various properties of individual month
   * panes.
   *
   * @property _paneProperties
   * @type Object
   * @private
   */
  _paneProperties : {},

  /**
   * The number of month panes in the calendar, deduced
   * from the CONTENT_TEMPLATE's number of {calendar_grid}
   * tokens.
   *
   * @property _paneNumber
   * @type Number
   * @private
   */
  _paneNumber : 1,

  /**
   * The unique id used to prefix various elements of this
   * calendar instance.
   *
   * @property _calendarId
   * @type String
   * @private
   */
  _calendarId : null,

  /**
   * The hash map of selected dates, populated with
   * selectDates() and deselectDates() methods 
   *
   * @property _selectedDates
   * @type Object
   * @private
   */
  _selectedDates : {},

  /**
   * A private copy of the rules object, populated
   * by setting the customRenderer attribute.
   *
   * @property _rules
   * @type Object
   * @private
   */
  _rules : {},

  /**
   * A private copy of the filterFunction, populated
   * by setting the customRenderer attribute.
   *
   * @property _filterFunction
   * @type Function
   * @private
   */
  _filterFunction : null,

  /**
   * Storage for calendar cells modified by any custom
   * formatting. The storage is cleared, used to restore
   * cells to the original state, and repopulated accordingly
   * when the calendar is rerendered. 
   *
   * @property _storedDateCells
   * @type Object
   * @private
   */
  _storedDateCells : {},

  /**
   * Designated initializer
   * Initializes instance-level properties of
   * calendar.
   *
   * @method initializer
   */  
  initializer : function () {
    _yuitest_coverfunc("build/calendar-base/calendar-base.js", "initializer", 143);
_yuitest_coverline("build/calendar-base/calendar-base.js", 144);
this._paneProperties = {};
    _yuitest_coverline("build/calendar-base/calendar-base.js", 145);
this._calendarId = Y.guid('calendar');
    _yuitest_coverline("build/calendar-base/calendar-base.js", 146);
this._selectedDates = {};
    _yuitest_coverline("build/calendar-base/calendar-base.js", 147);
if (isEmpty(this._rules)) {
       _yuitest_coverline("build/calendar-base/calendar-base.js", 148);
this._rules = {};      
    }
    _yuitest_coverline("build/calendar-base/calendar-base.js", 150);
this._storedDateCells = {};
  },

  /**
   * renderUI implementation
   *
   * Creates a visual representation of the calendar based on existing parameters. 
   * @method renderUI
   */  
  renderUI : function () {

      _yuitest_coverfunc("build/calendar-base/calendar-base.js", "renderUI", 159);
_yuitest_coverline("build/calendar-base/calendar-base.js", 161);
var contentBox = this.get('contentBox');
      _yuitest_coverline("build/calendar-base/calendar-base.js", 162);
contentBox.appendChild(this._initCalendarHTML(this.get('date')));
        _yuitest_coverline("build/calendar-base/calendar-base.js", 163);
if (this.get('showPrevMonth')) {
            _yuitest_coverline("build/calendar-base/calendar-base.js", 164);
this._afterShowPrevMonthChange();
        }
        _yuitest_coverline("build/calendar-base/calendar-base.js", 166);
if (this.get('showNextMonth')) {
            _yuitest_coverline("build/calendar-base/calendar-base.js", 167);
this._afterShowNextMonthChange();
        }
      _yuitest_coverline("build/calendar-base/calendar-base.js", 169);
this._renderCustomRules();
      _yuitest_coverline("build/calendar-base/calendar-base.js", 170);
this._renderSelectedDates();

    _yuitest_coverline("build/calendar-base/calendar-base.js", 172);
this.get("boundingBox").setAttribute("aria-labelledby", this._calendarId + "_header");

  },
  /**
   * bindUI implementation
   *
   * Assigns listeners to relevant events that change the state
   * of the calendar.
   * @method bindUI
   */ 
  bindUI : function () {
    _yuitest_coverfunc("build/calendar-base/calendar-base.js", "bindUI", 182);
_yuitest_coverline("build/calendar-base/calendar-base.js", 183);
this.after('dateChange', this._afterDateChange);
    _yuitest_coverline("build/calendar-base/calendar-base.js", 184);
this.after('showPrevMonthChange', this._afterShowPrevMonthChange);
    _yuitest_coverline("build/calendar-base/calendar-base.js", 185);
this.after('showNextMonthChange', this._afterShowNextMonthChange);
    _yuitest_coverline("build/calendar-base/calendar-base.js", 186);
this.after('headerRendererChange', this._afterHeaderRendererChange);
    _yuitest_coverline("build/calendar-base/calendar-base.js", 187);
this.after('customRendererChange', this._afterCustomRendererChange);
    _yuitest_coverline("build/calendar-base/calendar-base.js", 188);
this.after('enabledDatesRuleChange', this._afterCustomRendererChange);
    _yuitest_coverline("build/calendar-base/calendar-base.js", 189);
this.after('disabledDatesRuleChange', this._afterCustomRendererChange);
    _yuitest_coverline("build/calendar-base/calendar-base.js", 190);
this.after('focusedChange', this._afterFocusedChange);
    _yuitest_coverline("build/calendar-base/calendar-base.js", 191);
this.after('selectionChange', this._renderSelectedDates);
    _yuitest_coverline("build/calendar-base/calendar-base.js", 192);
this._bindCalendarEvents();
  },


    /**
     * An internal utility method that generates a list of selected dates 
     * from the hash storage.
     *
     * @method _getSelectedDatesList
     * @protected
     * @return {Array} The array of `Date`s that are currently selected.
     */
    _getSelectedDatesList : function () {
      _yuitest_coverfunc("build/calendar-base/calendar-base.js", "_getSelectedDatesList", 204);
_yuitest_coverline("build/calendar-base/calendar-base.js", 205);
var output = [];
      _yuitest_coverline("build/calendar-base/calendar-base.js", 206);
each (this._selectedDates, function (year) {
        _yuitest_coverfunc("build/calendar-base/calendar-base.js", "(anonymous 2)", 206);
_yuitest_coverline("build/calendar-base/calendar-base.js", 207);
each (year, function (month) {
          _yuitest_coverfunc("build/calendar-base/calendar-base.js", "(anonymous 3)", 207);
_yuitest_coverline("build/calendar-base/calendar-base.js", 208);
each (month, function (day) {
           _yuitest_coverfunc("build/calendar-base/calendar-base.js", "(anonymous 4)", 208);
_yuitest_coverline("build/calendar-base/calendar-base.js", 209);
output.push (day);
           }, this);
        }, this);
      }, this);
      _yuitest_coverline("build/calendar-base/calendar-base.js", 213);
return output;
    },

    /**
     * A utility method that returns all dates selected in a specific month.
     *
     * @method _getSelectedDatesInMonth
     * @param {Date} oDate corresponding to the month for which selected dates
     * are requested.
     * @protected
     * @return {Array} The array of `Date`s in a given month that are currently selected.
     */
    _getSelectedDatesInMonth : function (oDate) {
      _yuitest_coverfunc("build/calendar-base/calendar-base.js", "_getSelectedDatesInMonth", 225);
_yuitest_coverline("build/calendar-base/calendar-base.js", 226);
var year = oDate.getFullYear(),
          month = oDate.getMonth();
      
        _yuitest_coverline("build/calendar-base/calendar-base.js", 229);
if (hasKey(this._selectedDates, year) && hasKey(this._selectedDates[year], month)) {
           _yuitest_coverline("build/calendar-base/calendar-base.js", 230);
return Y.Object.values(this._selectedDates[year][month]); 
        }
        else {
           _yuitest_coverline("build/calendar-base/calendar-base.js", 233);
return [];
        }
      },


    /**
     * An internal parsing method that receives a String list of numbers
     * and number ranges (of the form "1,2,3,4-6,7-9,10,11" etc.) and checks
     * whether a specific number is included in this list. Used for looking
     * up dates in the customRenderer rule set.
     *
     * @method _isNumInList
     * @param {Number} num The number to look for in a list.
     * @param {String} strList The list of numbers of the form "1,2,3,4-6,7-8,9", etc.
     * @private
     * @return {boolean} Returns true if the given number is in the given list.
     */
    _isNumInList : function (num, strList) {
        _yuitest_coverfunc("build/calendar-base/calendar-base.js", "_isNumInList", 250);
_yuitest_coverline("build/calendar-base/calendar-base.js", 251);
if (strList == "all") {
            _yuitest_coverline("build/calendar-base/calendar-base.js", 252);
return true;
        }
        else {
            _yuitest_coverline("build/calendar-base/calendar-base.js", 255);
var elements = strList.split(","),
                i = elements.length;

            _yuitest_coverline("build/calendar-base/calendar-base.js", 258);
while (i--) {
                _yuitest_coverline("build/calendar-base/calendar-base.js", 259);
var range = elements[i].split("-");
                _yuitest_coverline("build/calendar-base/calendar-base.js", 260);
if (range.length == 2 && num >= parseInt(range[0], 10) && num <= parseInt(range[1], 10)) {
                    _yuitest_coverline("build/calendar-base/calendar-base.js", 261);
return true;
                }
                else {_yuitest_coverline("build/calendar-base/calendar-base.js", 263);
if (range.length == 1 && (parseInt(elements[i], 10) == num)) {
                    _yuitest_coverline("build/calendar-base/calendar-base.js", 264);
return true;
                }}
            }
            _yuitest_coverline("build/calendar-base/calendar-base.js", 267);
return false;   
        }
    },

    /**
     * Given a specific date, returns an array of rules (from the customRenderer rule set)
     * that the given date matches.
     *
     * @method _getRulesForDate
     * @param {Date} oDate The date for which an array of rules is needed
     * @private
     * @return {Array} Returns an array of `String`s, each containg the name of
     * a rule that the given date matches.
     */
    _getRulesForDate : function (oDate) {
      _yuitest_coverfunc("build/calendar-base/calendar-base.js", "_getRulesForDate", 281);
_yuitest_coverline("build/calendar-base/calendar-base.js", 282);
var year = oDate.getFullYear(),
          month = oDate.getMonth(),
          date = oDate.getDate(),
          wday = oDate.getDay(),
          rules = this._rules, 
          outputRules = [],
          years, months, dates, days;

      _yuitest_coverline("build/calendar-base/calendar-base.js", 290);
for (years in rules) {
          _yuitest_coverline("build/calendar-base/calendar-base.js", 291);
if (this._isNumInList(year, years)) {
              _yuitest_coverline("build/calendar-base/calendar-base.js", 292);
if (L.isString(rules[years])) {
                  _yuitest_coverline("build/calendar-base/calendar-base.js", 293);
outputRules.push(rules[years]);
              }
              else {
                  _yuitest_coverline("build/calendar-base/calendar-base.js", 296);
for (months in rules[years]) {
                      _yuitest_coverline("build/calendar-base/calendar-base.js", 297);
if (this._isNumInList(month, months)) {
                          _yuitest_coverline("build/calendar-base/calendar-base.js", 298);
if (L.isString(rules[years][months])) {
                              _yuitest_coverline("build/calendar-base/calendar-base.js", 299);
outputRules.push(rules[years][months]);
                          }
                          else {
                              _yuitest_coverline("build/calendar-base/calendar-base.js", 302);
for (dates in rules[years][months]) {
                                  _yuitest_coverline("build/calendar-base/calendar-base.js", 303);
if (this._isNumInList(date, dates)) {
                                      _yuitest_coverline("build/calendar-base/calendar-base.js", 304);
if (L.isString(rules[years][months][dates])) {
                                          _yuitest_coverline("build/calendar-base/calendar-base.js", 305);
outputRules.push(rules[years][months][dates]);
                                      }
                                      else {
                                          _yuitest_coverline("build/calendar-base/calendar-base.js", 308);
for (days in rules[years][months][dates]) {
                                              _yuitest_coverline("build/calendar-base/calendar-base.js", 309);
if (this._isNumInList(wday, days)) {
                                                  _yuitest_coverline("build/calendar-base/calendar-base.js", 310);
if (L.isString(rules[years][months][dates][days])) {
                                                     _yuitest_coverline("build/calendar-base/calendar-base.js", 311);
outputRules.push(rules[years][months][dates][days]);
                                                  }
                                              }
                                          }
                                      }
                                  }
                              }
                          }
                      }
                  } 
              }
          }
      }
      _yuitest_coverline("build/calendar-base/calendar-base.js", 324);
return outputRules;
    },

    /**
     * A utility method which, given a specific date and a name of the rule,
     * checks whether the date matches the given rule.
     *
     * @method _matchesRule
     * @param {Date} oDate The date to check
     * @param {String} rule The name of the rule that the date should match.
     * @private
     * @return {boolean} Returns true if the date matches the given rule.
     *
     */
    _matchesRule : function (oDate, rule) {
        _yuitest_coverfunc("build/calendar-base/calendar-base.js", "_matchesRule", 338);
_yuitest_coverline("build/calendar-base/calendar-base.js", 339);
return (iOf(this._getRulesForDate(oDate), rule) >= 0);
    },

    /**
     * A utility method which checks whether a given date matches the `enabledDatesRule`
     * or does not match the `disabledDatesRule` and therefore whether it can be selected.
     * @method _canBeSelected
     * @param {Date} oDate The date to check
     * @private
     * @return {boolean} Returns true if the date can be selected; false otherwise.
     */
    _canBeSelected : function (oDate) {
       
       _yuitest_coverfunc("build/calendar-base/calendar-base.js", "_canBeSelected", 350);
_yuitest_coverline("build/calendar-base/calendar-base.js", 352);
var enabledDatesRule = this.get("enabledDatesRule"),
           disabledDatesRule = this.get("disabledDatesRule");

       _yuitest_coverline("build/calendar-base/calendar-base.js", 355);
if (enabledDatesRule) {
           _yuitest_coverline("build/calendar-base/calendar-base.js", 356);
return this._matchesRule(oDate, enabledDatesRule);
       }
       else {_yuitest_coverline("build/calendar-base/calendar-base.js", 358);
if (disabledDatesRule) {
           _yuitest_coverline("build/calendar-base/calendar-base.js", 359);
return !this._matchesRule(oDate, disabledDatesRule);
       }
       else {
           _yuitest_coverline("build/calendar-base/calendar-base.js", 362);
return true;
       }}
    },

    /**
     * Selects a given date or array of dates.
     * @method selectDates
     * @param {Date|Array} dates A `Date` or `Array` of `Date`s.
     */
    selectDates : function (dates) {
      _yuitest_coverfunc("build/calendar-base/calendar-base.js", "selectDates", 371);
_yuitest_coverline("build/calendar-base/calendar-base.js", 372);
if (ydate.isValidDate(dates)) {
         _yuitest_coverline("build/calendar-base/calendar-base.js", 373);
this._addDateToSelection(dates);
      }
      else {_yuitest_coverline("build/calendar-base/calendar-base.js", 375);
if (L.isArray(dates)) {
         _yuitest_coverline("build/calendar-base/calendar-base.js", 376);
this._addDatesToSelection(dates);
      }}
    },

    /**
     * Deselects a given date or array of dates, or deselects
     * all dates if no argument is specified.
     * @method deselectDates
     * @param {Date|Array} [dates] A `Date` or `Array` of `Date`s, or no
     * argument if all dates should be deselected.
     */
    deselectDates : function (dates) {
      _yuitest_coverfunc("build/calendar-base/calendar-base.js", "deselectDates", 387);
_yuitest_coverline("build/calendar-base/calendar-base.js", 388);
if (!dates) {
         _yuitest_coverline("build/calendar-base/calendar-base.js", 389);
this._clearSelection();
      }
      else {_yuitest_coverline("build/calendar-base/calendar-base.js", 391);
if (ydate.isValidDate(dates)) {
         _yuitest_coverline("build/calendar-base/calendar-base.js", 392);
this._removeDateFromSelection(dates);
      }
      else {_yuitest_coverline("build/calendar-base/calendar-base.js", 394);
if (L.isArray(dates)) {
         _yuitest_coverline("build/calendar-base/calendar-base.js", 395);
this._removeDatesFromSelection(dates);
      }}}
    },

    /**
     * A utility method that adds a given date to selection..
     * @method _addDateToSelection
     * @param {Date} oDate The date to add to selection.
     * @param {Number} [index] An optional parameter that is used
     * to differentiate between individual date selections and multiple
     * date selections.
     * @private
     */
    _addDateToSelection : function (oDate, index) {

      _yuitest_coverfunc("build/calendar-base/calendar-base.js", "_addDateToSelection", 408);
_yuitest_coverline("build/calendar-base/calendar-base.js", 410);
if (this._canBeSelected(oDate)) {

        _yuitest_coverline("build/calendar-base/calendar-base.js", 412);
var year = oDate.getFullYear(),
            month = oDate.getMonth(),
            day = oDate.getDate();
        
        _yuitest_coverline("build/calendar-base/calendar-base.js", 416);
if (hasKey(this._selectedDates, year)) {
            _yuitest_coverline("build/calendar-base/calendar-base.js", 417);
if (hasKey(this._selectedDates[year], month)) {
                _yuitest_coverline("build/calendar-base/calendar-base.js", 418);
this._selectedDates[year][month][day] = oDate;
            }
            else {
                _yuitest_coverline("build/calendar-base/calendar-base.js", 421);
this._selectedDates[year][month] = {};
                _yuitest_coverline("build/calendar-base/calendar-base.js", 422);
this._selectedDates[year][month][day] = oDate;
            }
        }
        else {
            _yuitest_coverline("build/calendar-base/calendar-base.js", 426);
this._selectedDates[year] = {};
            _yuitest_coverline("build/calendar-base/calendar-base.js", 427);
this._selectedDates[year][month] = {};
            _yuitest_coverline("build/calendar-base/calendar-base.js", 428);
this._selectedDates[year][month][day] = oDate;
        }

        _yuitest_coverline("build/calendar-base/calendar-base.js", 431);
this._selectedDates = setVal(this._selectedDates, [year, month, day], oDate);

        _yuitest_coverline("build/calendar-base/calendar-base.js", 433);
if (!index) {
        _yuitest_coverline("build/calendar-base/calendar-base.js", 434);
this._fireSelectionChange();
        }
      }
    },

    /**
     * A utility method that adds a given list of dates to selection.
     * @method _addDatesToSelection
     * @param {Array} datesArray The list of dates to add to selection.
     * @private
     */
    _addDatesToSelection : function (datesArray) {
        _yuitest_coverfunc("build/calendar-base/calendar-base.js", "_addDatesToSelection", 445);
_yuitest_coverline("build/calendar-base/calendar-base.js", 446);
each(datesArray, this._addDateToSelection, this);
        _yuitest_coverline("build/calendar-base/calendar-base.js", 447);
this._fireSelectionChange();
    },

    /**
     * A utility method that adds a given range of dates to selection.
     * @method _addDateRangeToSelection
     * @param {Date} startDate The first date of the given range.
     * @param {Date} endDate The last date of the given range.
     * @private
     */
    _addDateRangeToSelection : function (startDate, endDate) {

        _yuitest_coverfunc("build/calendar-base/calendar-base.js", "_addDateRangeToSelection", 457);
_yuitest_coverline("build/calendar-base/calendar-base.js", 459);
var timezoneDifference = (endDate.getTimezoneOffset() - startDate.getTimezoneOffset())*60000,
            startTime = startDate.getTime(),
            endTime   = endDate.getTime();
            
            _yuitest_coverline("build/calendar-base/calendar-base.js", 463);
if (startTime > endTime) {
                _yuitest_coverline("build/calendar-base/calendar-base.js", 464);
var tempTime = startTime;
                _yuitest_coverline("build/calendar-base/calendar-base.js", 465);
startTime = endTime;
                _yuitest_coverline("build/calendar-base/calendar-base.js", 466);
endTime = tempTime + timezoneDifference;
            }
            else {
                _yuitest_coverline("build/calendar-base/calendar-base.js", 469);
endTime = endTime - timezoneDifference;
            }


        _yuitest_coverline("build/calendar-base/calendar-base.js", 473);
for (var time = startTime; time <= endTime; time += 86400000) {
            _yuitest_coverline("build/calendar-base/calendar-base.js", 474);
var addedDate = new Date(time);
                _yuitest_coverline("build/calendar-base/calendar-base.js", 475);
addedDate.setHours(12);
            _yuitest_coverline("build/calendar-base/calendar-base.js", 476);
this._addDateToSelection(addedDate, time);
        }
        _yuitest_coverline("build/calendar-base/calendar-base.js", 478);
this._fireSelectionChange();
    },

    /**
     * A utility method that removes a given date from selection..
     * @method _removeDateFromSelection
     * @param {Date} oDate The date to remove from selection.
     * @param {Number} [index] An optional parameter that is used
     * to differentiate between individual date selections and multiple
     * date selections.
     * @private
     */
    _removeDateFromSelection : function (oDate, index) {
        _yuitest_coverfunc("build/calendar-base/calendar-base.js", "_removeDateFromSelection", 490);
_yuitest_coverline("build/calendar-base/calendar-base.js", 491);
var year = oDate.getFullYear(),
            month = oDate.getMonth(),
            day = oDate.getDate();
        _yuitest_coverline("build/calendar-base/calendar-base.js", 494);
if (hasKey(this._selectedDates, year) && 
            hasKey(this._selectedDates[year], month) && 
            hasKey(this._selectedDates[year][month], day)) {
               _yuitest_coverline("build/calendar-base/calendar-base.js", 497);
delete this._selectedDates[year][month][day];
               _yuitest_coverline("build/calendar-base/calendar-base.js", 498);
if (!index) {
                 _yuitest_coverline("build/calendar-base/calendar-base.js", 499);
this._fireSelectionChange();
               }
        }
    },

    /**
     * A utility method that removes a given list of dates from selection.
     * @method _removeDatesFromSelection
     * @param {Array} datesArray The list of dates to remove from selection.
     * @private
     */
    _removeDatesFromSelection : function (datesArray) {
        _yuitest_coverfunc("build/calendar-base/calendar-base.js", "_removeDatesFromSelection", 510);
_yuitest_coverline("build/calendar-base/calendar-base.js", 511);
each(datesArray, this._removeDateFromSelection, this);
        _yuitest_coverline("build/calendar-base/calendar-base.js", 512);
this._fireSelectionChange();
    },

    /**
     * A utility method that removes a given range of dates from selection.
     * @method _removeDateRangeFromSelection
     * @param {Date} startDate The first date of the given range.
     * @param {Date} endDate The last date of the given range.
     * @private
     */
    _removeDateRangeFromSelection : function (startDate, endDate) {
        _yuitest_coverfunc("build/calendar-base/calendar-base.js", "_removeDateRangeFromSelection", 522);
_yuitest_coverline("build/calendar-base/calendar-base.js", 523);
var startTime = startDate.getTime(),
            endTime   = endDate.getTime();
        
        _yuitest_coverline("build/calendar-base/calendar-base.js", 526);
for (var time = startTime; time <= endTime; time += 86400000) {
            _yuitest_coverline("build/calendar-base/calendar-base.js", 527);
this._removeDateFromSelection(new Date(time), time);
        }

        _yuitest_coverline("build/calendar-base/calendar-base.js", 530);
this._fireSelectionChange();    
    },

    /**
     * A utility method that removes all dates from selection.
     * @method _clearSelection
     * @param {boolean} noevent A Boolean specifying whether a selectionChange
     * event should be fired. If true, the event is not fired.
     * @private
     */
    _clearSelection : function (noevent) {
        _yuitest_coverfunc("build/calendar-base/calendar-base.js", "_clearSelection", 540);
_yuitest_coverline("build/calendar-base/calendar-base.js", 541);
this._selectedDates = {};
        _yuitest_coverline("build/calendar-base/calendar-base.js", 542);
this.get("contentBox").all("." + CAL_DAY_SELECTED).removeClass(CAL_DAY_SELECTED).setAttribute("aria-selected", false);
        _yuitest_coverline("build/calendar-base/calendar-base.js", 543);
if (!noevent) {
          _yuitest_coverline("build/calendar-base/calendar-base.js", 544);
this._fireSelectionChange();
        }
    },

    /**
     * A utility method that fires a selectionChange event.
     * @method _fireSelectionChange
     * @private
     */
    _fireSelectionChange : function () {

   /**
     * Fired when the set of selected dates changes. Contains a payload with
     * a `newSelection` property with an array of selected dates.
     *
     * @event selectionChange
     */
      _yuitest_coverfunc("build/calendar-base/calendar-base.js", "_fireSelectionChange", 553);
_yuitest_coverline("build/calendar-base/calendar-base.js", 561);
this.fire("selectionChange", {newSelection: this._getSelectedDatesList()});
    },

    /**
     * A utility method that restores cells modified by custom formatting.
     * @method _restoreModifiedCells
     * @private
     */
    _restoreModifiedCells : function () {
      _yuitest_coverfunc("build/calendar-base/calendar-base.js", "_restoreModifiedCells", 569);
_yuitest_coverline("build/calendar-base/calendar-base.js", 570);
var contentbox = this.get("contentBox"),
          id;
      _yuitest_coverline("build/calendar-base/calendar-base.js", 572);
for (id in this._storedDateCells) {
          _yuitest_coverline("build/calendar-base/calendar-base.js", 573);
contentbox.one("#" + id).replace(this._storedDateCells[id]);
          _yuitest_coverline("build/calendar-base/calendar-base.js", 574);
delete this._storedDateCells[id];
      }
    },

    /**
     * A rendering assist method that renders all cells modified by the customRenderer
     * rules, as well as the enabledDatesRule and disabledDatesRule.
     * @method _renderCustomRules
     * @private
     */
    _renderCustomRules : function () {

        _yuitest_coverfunc("build/calendar-base/calendar-base.js", "_renderCustomRules", 584);
_yuitest_coverline("build/calendar-base/calendar-base.js", 586);
this.get("contentBox").all("." + CAL_DAY + ",." + CAL_NEXTMONTH_DAY).removeClass(SELECTION_DISABLED).setAttribute("aria-disabled", false);

        _yuitest_coverline("build/calendar-base/calendar-base.js", 588);
if (!isEmpty(this._rules)) {
        _yuitest_coverline("build/calendar-base/calendar-base.js", 589);
var enRule = this.get("enabledDatesRule"),
            disRule = this.get("disabledDatesRule");

           _yuitest_coverline("build/calendar-base/calendar-base.js", 592);
for (var paneNum = 0; paneNum < this._paneNumber; paneNum++) {
             _yuitest_coverline("build/calendar-base/calendar-base.js", 593);
var paneDate = ydate.addMonths(this.get("date"), paneNum);
             _yuitest_coverline("build/calendar-base/calendar-base.js", 594);
var dateArray = ydate.listOfDatesInMonth(paneDate);
             _yuitest_coverline("build/calendar-base/calendar-base.js", 595);
each(dateArray, function (date) {
                _yuitest_coverfunc("build/calendar-base/calendar-base.js", "(anonymous 5)", 595);
_yuitest_coverline("build/calendar-base/calendar-base.js", 596);
var matchingRules = this._getRulesForDate(date);
                _yuitest_coverline("build/calendar-base/calendar-base.js", 597);
if (matchingRules.length > 0) {
                    _yuitest_coverline("build/calendar-base/calendar-base.js", 598);
var dateNode = this._dateToNode(date);
                    _yuitest_coverline("build/calendar-base/calendar-base.js", 599);
if ((enRule && iOf(matchingRules, enRule) < 0) || (!enRule && disRule && iOf(matchingRules, disRule) >= 0)) {
                            _yuitest_coverline("build/calendar-base/calendar-base.js", 600);
dateNode.addClass(SELECTION_DISABLED).setAttribute("aria-disabled", true);
                        }
                        
                    _yuitest_coverline("build/calendar-base/calendar-base.js", 603);
if (L.isFunction(this._filterFunction)) {
                        _yuitest_coverline("build/calendar-base/calendar-base.js", 604);
this._storedDateCells[dateNode.get("id")] = dateNode.cloneNode(true);
                        _yuitest_coverline("build/calendar-base/calendar-base.js", 605);
this._filterFunction (date, dateNode, matchingRules);
                    }
                }
                else {_yuitest_coverline("build/calendar-base/calendar-base.js", 608);
if (enRule) {
                   _yuitest_coverline("build/calendar-base/calendar-base.js", 609);
var dateNode = this._dateToNode(date);
                   _yuitest_coverline("build/calendar-base/calendar-base.js", 610);
dateNode.addClass(SELECTION_DISABLED).setAttribute("aria-disabled", true);
                }}
                },
             this);
          }
       }         
    },

    /**
     * A rendering assist method that renders all cells that are currently selected.
     * @method _renderSelectedDates
     * @private
     */
  _renderSelectedDates : function () {
    _yuitest_coverfunc("build/calendar-base/calendar-base.js", "_renderSelectedDates", 623);
_yuitest_coverline("build/calendar-base/calendar-base.js", 624);
this.get("contentBox").all("." + CAL_DAY_SELECTED).removeClass(CAL_DAY_SELECTED).setAttribute("aria-selected", false);
    
        _yuitest_coverline("build/calendar-base/calendar-base.js", 626);
for (var paneNum = 0; paneNum < this._paneNumber; paneNum++) {
        _yuitest_coverline("build/calendar-base/calendar-base.js", 627);
var paneDate = ydate.addMonths(this.get("date"), paneNum);
        _yuitest_coverline("build/calendar-base/calendar-base.js", 628);
var dateArray = this._getSelectedDatesInMonth(paneDate);
        _yuitest_coverline("build/calendar-base/calendar-base.js", 629);
each(dateArray, function (date) {
            _yuitest_coverfunc("build/calendar-base/calendar-base.js", "(anonymous 6)", 629);
_yuitest_coverline("build/calendar-base/calendar-base.js", 630);
this._dateToNode(date).addClass(CAL_DAY_SELECTED).setAttribute("aria-selected", true);
                        },
             this);
      }
  },

    /**
     * A utility method that converts a date to the node wrapping the calendar cell
     * the date corresponds to..
     * @method _dateToNode
     * @param {Date} oDate The date to convert to Node
     * @protected
     * @return {Node} The node wrapping the DOM element of the cell the date 
     * corresponds to.
     */
  _dateToNode : function (oDate) {
    _yuitest_coverfunc("build/calendar-base/calendar-base.js", "_dateToNode", 645);
_yuitest_coverline("build/calendar-base/calendar-base.js", 646);
var day = oDate.getDate(),
            col = 0,
            daymod = day%7,
            paneNum = (12 + oDate.getMonth() - this.get("date").getMonth()) % 12,
            paneId = this._calendarId + "_pane_" + paneNum,
            cutoffCol = this._paneProperties[paneId].cutoffCol;

        _yuitest_coverline("build/calendar-base/calendar-base.js", 653);
switch (daymod) {
          case (0):
             _yuitest_coverline("build/calendar-base/calendar-base.js", 655);
if (cutoffCol >= 6) {
               _yuitest_coverline("build/calendar-base/calendar-base.js", 656);
col = 12;
             }
             else {
               _yuitest_coverline("build/calendar-base/calendar-base.js", 659);
col = 5;
             }
             _yuitest_coverline("build/calendar-base/calendar-base.js", 661);
break;
          case (1):
               _yuitest_coverline("build/calendar-base/calendar-base.js", 663);
col = 6;
             _yuitest_coverline("build/calendar-base/calendar-base.js", 664);
break;
          case (2):
             _yuitest_coverline("build/calendar-base/calendar-base.js", 666);
if (cutoffCol > 0) {
               _yuitest_coverline("build/calendar-base/calendar-base.js", 667);
col = 7;
             }
             else {
               _yuitest_coverline("build/calendar-base/calendar-base.js", 670);
col = 0;
             }
             _yuitest_coverline("build/calendar-base/calendar-base.js", 672);
break;
          case (3):
             _yuitest_coverline("build/calendar-base/calendar-base.js", 674);
if (cutoffCol > 1) {
               _yuitest_coverline("build/calendar-base/calendar-base.js", 675);
col = 8;
             }
             else {
               _yuitest_coverline("build/calendar-base/calendar-base.js", 678);
col = 1;
             }
             _yuitest_coverline("build/calendar-base/calendar-base.js", 680);
break;
          case (4):
             _yuitest_coverline("build/calendar-base/calendar-base.js", 682);
if (cutoffCol > 2) {
               _yuitest_coverline("build/calendar-base/calendar-base.js", 683);
col = 9;
             }
             else {
               _yuitest_coverline("build/calendar-base/calendar-base.js", 686);
col = 2;
             }
             _yuitest_coverline("build/calendar-base/calendar-base.js", 688);
break;
          case (5):
             _yuitest_coverline("build/calendar-base/calendar-base.js", 690);
if (cutoffCol > 3) {
               _yuitest_coverline("build/calendar-base/calendar-base.js", 691);
col = 10;
             }
             else {
               _yuitest_coverline("build/calendar-base/calendar-base.js", 694);
col = 3;
             }
             _yuitest_coverline("build/calendar-base/calendar-base.js", 696);
break;
          case (6):
             _yuitest_coverline("build/calendar-base/calendar-base.js", 698);
if (cutoffCol > 4) {
               _yuitest_coverline("build/calendar-base/calendar-base.js", 699);
col = 11;
             }
             else {
               _yuitest_coverline("build/calendar-base/calendar-base.js", 702);
col = 4;
             }
             _yuitest_coverline("build/calendar-base/calendar-base.js", 704);
break;
        }
        _yuitest_coverline("build/calendar-base/calendar-base.js", 706);
return(this.get("contentBox").one("#" + this._calendarId + "_pane_" + paneNum + "_" + col + "_" + day));  

  },

    /**
     * A utility method that converts a node corresponding to the DOM element of
     * the cell for a particular date to that date.
     * @method _nodeToDate
     * @param {Node} oNode The Node wrapping the DOM element of a particular date cell.
     * @protected
     * @return {Date} The date corresponding to the DOM element that the given node wraps.
     */
  _nodeToDate : function (oNode) {
    
        _yuitest_coverfunc("build/calendar-base/calendar-base.js", "_nodeToDate", 718);
_yuitest_coverline("build/calendar-base/calendar-base.js", 720);
var idParts = oNode.get("id").split("_").reverse(),
            paneNum = parseInt(idParts[2], 10),
            day  = parseInt(idParts[0], 10);

        _yuitest_coverline("build/calendar-base/calendar-base.js", 724);
var shiftedDate = ydate.addMonths(this.get("date"), paneNum),
            year = shiftedDate.getFullYear(),
            month = shiftedDate.getMonth();

    _yuitest_coverline("build/calendar-base/calendar-base.js", 728);
return new Date(year, month, day, 12, 0, 0, 0);
  },

    /**
     * A placeholder method, called from bindUI, to bind the Calendar events.
     * @method _bindCalendarEvents
     * @protected
     */
  _bindCalendarEvents : function () {
    
  },

    /**
     * A utility method that normalizes a given date by converting it to the 1st
     * day of the month the date is in, with the time set to noon.
     * @method _normalizeDate
     * @param {Date} oDate The date to normalize
     * @protected
     * @return {Date} The normalized date, set to the first of the month, with time
     * set to noon.
     */
    _normalizeDate : function (date) {
      _yuitest_coverfunc("build/calendar-base/calendar-base.js", "_normalizeDate", 749);
_yuitest_coverline("build/calendar-base/calendar-base.js", 750);
if (date) {
       _yuitest_coverline("build/calendar-base/calendar-base.js", 751);
return new Date(date.getFullYear(), date.getMonth(), 1, 12, 0, 0, 0);
      }
      else {
       _yuitest_coverline("build/calendar-base/calendar-base.js", 754);
return null;
      }  
    },


    /**
     * A render assist utility method that computes the cutoff column for the calendar 
     * rendering mask.
     * @method _getCutoffColumn
     * @param {Date} date The date of the month grid to compute the cutoff column for.
     * @param {Number} firstday The first day of the week (modified by internationalized calendars)
     * @private
     * @return {Number} The number of the cutoff column.
     */
    _getCutoffColumn : function (date, firstday) {

   _yuitest_coverfunc("build/calendar-base/calendar-base.js", "_getCutoffColumn", 768);
_yuitest_coverline("build/calendar-base/calendar-base.js", 770);
var distance = this._normalizeDate(date).getDay() - firstday;
   _yuitest_coverline("build/calendar-base/calendar-base.js", 771);
var cutOffColumn = 6 - (distance + 7)%7;
   _yuitest_coverline("build/calendar-base/calendar-base.js", 772);
return cutOffColumn;

    },

    /**
     * A render assist method that turns on the view of the previous month's dates 
     * in a given calendar pane.
     * @method _turnPrevMonthOn
     * @param {Node} pane The calendar pane that needs its previous month's dates view
     * modified.
     * @protected
     */
    _turnPrevMonthOn : function (pane) {
        
        _yuitest_coverfunc("build/calendar-base/calendar-base.js", "_turnPrevMonthOn", 784);
_yuitest_coverline("build/calendar-base/calendar-base.js", 786);
var pane_id = pane.get("id"),
            pane_date = this._paneProperties[pane_id].paneDate,
            daysInPrevMonth = ydate.daysInMonth(ydate.addMonths(pane_date, -1));

        _yuitest_coverline("build/calendar-base/calendar-base.js", 790);
if (!this._paneProperties[pane_id].hasOwnProperty("daysInPrevMonth")) {
          _yuitest_coverline("build/calendar-base/calendar-base.js", 791);
this._paneProperties[pane_id].daysInPrevMonth = 0;
        }

        _yuitest_coverline("build/calendar-base/calendar-base.js", 794);
if (daysInPrevMonth != this._paneProperties[pane_id].daysInPrevMonth) {
        
        _yuitest_coverline("build/calendar-base/calendar-base.js", 796);
this._paneProperties[pane_id].daysInPrevMonth = daysInPrevMonth;

        _yuitest_coverline("build/calendar-base/calendar-base.js", 798);
for (var cell = 5; cell >= 0; cell--) 
           {
            _yuitest_coverline("build/calendar-base/calendar-base.js", 800);
pane.one("#" + pane_id + "_" + cell + "_" + (cell-5)).set('text', daysInPrevMonth--);
           }

        }


    },

    /**
     * A render assist method that turns off the view of the previous month's dates 
     * in a given calendar pane.
     * @method _turnPrevMonthOff
     * @param {Node} pane The calendar pane that needs its previous month's dates view
     * modified.
     * @protected
     */
    _turnPrevMonthOff : function (pane) {
          _yuitest_coverfunc("build/calendar-base/calendar-base.js", "_turnPrevMonthOff", 816);
_yuitest_coverline("build/calendar-base/calendar-base.js", 817);
var pane_id = pane.get("id");
        _yuitest_coverline("build/calendar-base/calendar-base.js", 818);
this._paneProperties[pane_id].daysInPrevMonth = 0;

        _yuitest_coverline("build/calendar-base/calendar-base.js", 820);
for (var cell = 5; cell >= 0; cell--) 
           {
            _yuitest_coverline("build/calendar-base/calendar-base.js", 822);
pane.one("#" + pane_id + "_" + cell + "_" + (cell-5)).setContent("&nbsp;");
           }      
    },

    /**
     * A render assist method that cleans up the last few cells in the month grid
     * when the number of days in the month changes.
     * @method _cleanUpNextMonthCells
     * @param {Node} pane The calendar pane that needs the last date cells cleaned up.
     * @private
     */
    _cleanUpNextMonthCells : function (pane) {
      _yuitest_coverfunc("build/calendar-base/calendar-base.js", "_cleanUpNextMonthCells", 833);
_yuitest_coverline("build/calendar-base/calendar-base.js", 834);
var pane_id = pane.get("id");
        _yuitest_coverline("build/calendar-base/calendar-base.js", 835);
pane.one("#" + pane_id + "_6_29").removeClass(CAL_NEXTMONTH_DAY);
        _yuitest_coverline("build/calendar-base/calendar-base.js", 836);
pane.one("#" + pane_id + "_7_30").removeClass(CAL_NEXTMONTH_DAY);
        _yuitest_coverline("build/calendar-base/calendar-base.js", 837);
pane.one("#" + pane_id + "_8_31").removeClass(CAL_NEXTMONTH_DAY);
        _yuitest_coverline("build/calendar-base/calendar-base.js", 838);
pane.one("#" + pane_id + "_0_30").removeClass(CAL_NEXTMONTH_DAY);
        _yuitest_coverline("build/calendar-base/calendar-base.js", 839);
pane.one("#" + pane_id + "_1_31").removeClass(CAL_NEXTMONTH_DAY);     
    },

    /**
     * A render assist method that turns on the view of the next month's dates 
     * in a given calendar pane.
     * @method _turnNextMonthOn
     * @param {Node} pane The calendar pane that needs its next month's dates view
     * modified.
     * @protected
     */
    _turnNextMonthOn : function (pane) {       
          _yuitest_coverfunc("build/calendar-base/calendar-base.js", "_turnNextMonthOn", 850);
_yuitest_coverline("build/calendar-base/calendar-base.js", 851);
var dayCounter = 1,
              pane_id = pane.get("id"),
              daysInMonth = this._paneProperties[pane_id].daysInMonth,
              cutoffCol = this._paneProperties[pane_id].cutoffCol;

        _yuitest_coverline("build/calendar-base/calendar-base.js", 856);
for (var cell = daysInMonth - 22; cell < cutoffCol + 7; cell++) 
           {
            _yuitest_coverline("build/calendar-base/calendar-base.js", 858);
pane.one("#" + pane_id + "_" + cell + "_" + (cell+23)).set("text", dayCounter++).addClass(CAL_NEXTMONTH_DAY);
           }

        _yuitest_coverline("build/calendar-base/calendar-base.js", 861);
var startingCell = cutoffCol;
        _yuitest_coverline("build/calendar-base/calendar-base.js", 862);
if (daysInMonth == 31 && (cutoffCol <= 1)) {
          _yuitest_coverline("build/calendar-base/calendar-base.js", 863);
startingCell = 2;
        }
        else {_yuitest_coverline("build/calendar-base/calendar-base.js", 865);
if (daysInMonth == 30 && cutoffCol === 0) {
          _yuitest_coverline("build/calendar-base/calendar-base.js", 866);
startingCell = 1;
        }}
  
        _yuitest_coverline("build/calendar-base/calendar-base.js", 869);
for (var cell = startingCell ; cell < cutoffCol + 7; cell++) {
            _yuitest_coverline("build/calendar-base/calendar-base.js", 870);
pane.one("#" + pane_id + "_" + cell + "_" + (cell+30)).set("text", dayCounter++).addClass(CAL_NEXTMONTH_DAY);    
        }
    },

    /**
     * A render assist method that turns off the view of the next month's dates 
     * in a given calendar pane.
     * @method _turnNextMonthOff
     * @param {Node} pane The calendar pane that needs its next month's dates view
     * modified.
     * @protected
     */
    _turnNextMonthOff : function (pane) {
          _yuitest_coverfunc("build/calendar-base/calendar-base.js", "_turnNextMonthOff", 882);
_yuitest_coverline("build/calendar-base/calendar-base.js", 883);
var pane_id = pane.get("id"),
              daysInMonth = this._paneProperties[pane_id].daysInMonth,
              cutoffCol = this._paneProperties[pane_id].cutoffCol;

        _yuitest_coverline("build/calendar-base/calendar-base.js", 887);
for (var cell = daysInMonth - 22; cell <= 12; cell++) 
           {
            _yuitest_coverline("build/calendar-base/calendar-base.js", 889);
pane.one("#" + pane_id + "_" + cell + "_" + (cell+23)).setContent("&nbsp;").addClass(CAL_NEXTMONTH_DAY);
           }

        _yuitest_coverline("build/calendar-base/calendar-base.js", 892);
var startingCell = 0;
        _yuitest_coverline("build/calendar-base/calendar-base.js", 893);
if (daysInMonth == 31 && (cutoffCol <= 1)) {
          _yuitest_coverline("build/calendar-base/calendar-base.js", 894);
startingCell = 2;
        }
        else {_yuitest_coverline("build/calendar-base/calendar-base.js", 896);
if (daysInMonth == 30 && cutoffCol === 0) {
          _yuitest_coverline("build/calendar-base/calendar-base.js", 897);
startingCell = 1;
        }}
  
        _yuitest_coverline("build/calendar-base/calendar-base.js", 900);
for (var cell = startingCell ; cell <= 12; cell++) {
            _yuitest_coverline("build/calendar-base/calendar-base.js", 901);
pane.one("#" + pane_id + "_" + cell + "_" + (cell+30)).setContent("&nbsp;").addClass(CAL_NEXTMONTH_DAY);   
        }   
    },

    /**
     * The handler for the change in the showNextMonth attribute.
     * @method _afterShowNextMonthChange
     * @private
     */
    _afterShowNextMonthChange : function () {
      
      _yuitest_coverfunc("build/calendar-base/calendar-base.js", "_afterShowNextMonthChange", 910);
_yuitest_coverline("build/calendar-base/calendar-base.js", 912);
var contentBox = this.get('contentBox'),
          lastPane = contentBox.one("#" + this._calendarId + "_pane_" + (this._paneNumber - 1));
          _yuitest_coverline("build/calendar-base/calendar-base.js", 914);
this._cleanUpNextMonthCells(lastPane);  


      _yuitest_coverline("build/calendar-base/calendar-base.js", 917);
if (this.get('showNextMonth')) {
          _yuitest_coverline("build/calendar-base/calendar-base.js", 918);
this._turnNextMonthOn(lastPane);
        }

        else {
          _yuitest_coverline("build/calendar-base/calendar-base.js", 922);
this._turnNextMonthOff(lastPane);
        }

    },

    /**
     * The handler for the change in the showPrevMonth attribute.
     * @method _afterShowPrevMonthChange
     * @private
     */
    _afterShowPrevMonthChange : function () {
      _yuitest_coverfunc("build/calendar-base/calendar-base.js", "_afterShowPrevMonthChange", 932);
_yuitest_coverline("build/calendar-base/calendar-base.js", 933);
var contentBox = this.get('contentBox'),
          firstPane = contentBox.one("#" + this._calendarId + "_pane_" + 0);

      _yuitest_coverline("build/calendar-base/calendar-base.js", 936);
if (this.get('showPrevMonth')) {
         _yuitest_coverline("build/calendar-base/calendar-base.js", 937);
this._turnPrevMonthOn(firstPane);
      }

      else {
         _yuitest_coverline("build/calendar-base/calendar-base.js", 941);
this._turnPrevMonthOff(firstPane);
      }
      
    },
 
     /**
     * The handler for the change in the headerRenderer attribute.
     * @method _afterHeaderRendererChange
     * @private
     */ 
  _afterHeaderRendererChange : function () {
    _yuitest_coverfunc("build/calendar-base/calendar-base.js", "_afterHeaderRendererChange", 951);
_yuitest_coverline("build/calendar-base/calendar-base.js", 952);
var headerCell = this.get("contentBox").one("." + CAL_HD_LABEL);
    _yuitest_coverline("build/calendar-base/calendar-base.js", 953);
headerCell.setContent(this._updateCalendarHeader(this.get('date')));
  },

     /**
     * The handler for the change in the customRenderer attribute.
     * @method _afterCustomRendererChange
     * @private
     */ 
    _afterCustomRendererChange : function () {
        _yuitest_coverfunc("build/calendar-base/calendar-base.js", "_afterCustomRendererChange", 961);
_yuitest_coverline("build/calendar-base/calendar-base.js", 962);
this._restoreModifiedCells();
        _yuitest_coverline("build/calendar-base/calendar-base.js", 963);
this._renderCustomRules();
    },

     /**
     * The handler for the change in the date attribute. Modifies the calendar
     * view by shifting the calendar grid mask and running custom rendering and
     * selection rendering as necessary.
     * @method _afterDateChange
     * @private
     */ 
  _afterDateChange : function () {
    
    _yuitest_coverfunc("build/calendar-base/calendar-base.js", "_afterDateChange", 973);
_yuitest_coverline("build/calendar-base/calendar-base.js", 975);
var contentBox = this.get('contentBox'),
        headerCell = contentBox.one("." + CAL_HD).one("." + CAL_HD_LABEL),
        calendarPanes = contentBox.all("." + CAL_GRID),
        currentDate = this.get("date"),
        counter = 0;

  _yuitest_coverline("build/calendar-base/calendar-base.js", 981);
contentBox.setStyle("visibility", "hidden");
  _yuitest_coverline("build/calendar-base/calendar-base.js", 982);
headerCell.setContent(this._updateCalendarHeader(currentDate));
  
    _yuitest_coverline("build/calendar-base/calendar-base.js", 984);
this._restoreModifiedCells();

    _yuitest_coverline("build/calendar-base/calendar-base.js", 986);
calendarPanes.each(function (curNode) {
                      _yuitest_coverfunc("build/calendar-base/calendar-base.js", "(anonymous 7)", 986);
_yuitest_coverline("build/calendar-base/calendar-base.js", 987);
this._rerenderCalendarPane(ydate.addMonths(currentDate, counter++), 
                                            curNode);
                                        }, this);

     _yuitest_coverline("build/calendar-base/calendar-base.js", 991);
this._afterShowPrevMonthChange();
     _yuitest_coverline("build/calendar-base/calendar-base.js", 992);
this._afterShowNextMonthChange();

    _yuitest_coverline("build/calendar-base/calendar-base.js", 994);
this._renderCustomRules();
    _yuitest_coverline("build/calendar-base/calendar-base.js", 995);
this._renderSelectedDates();
      
  _yuitest_coverline("build/calendar-base/calendar-base.js", 997);
contentBox.setStyle("visibility", "visible");
  },


     /**
     * A rendering assist method that initializes the HTML for a single
     * calendar pane.
     * @method _initCalendarPane
     * @param {Date} baseDate The date corresponding to the month of the given
     * calendar pane.
     * @param {String} pane_id The id of the pane, to be used as a prefix for
     * element ids in the given pane.
     * @private
     */ 
  _initCalendarPane : function (baseDate, pane_id) {
        // Initialize final output HTML string
    _yuitest_coverfunc("build/calendar-base/calendar-base.js", "_initCalendarPane", 1011);
_yuitest_coverline("build/calendar-base/calendar-base.js", 1013);
var calString = '',
        // Get a list of short weekdays from the internationalization package, or else use default English ones.
        weekdays = this.get('strings.very_short_weekdays') || ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"],
        fullweekdays = this.get('strings.weekdays') || ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
        // Get the first day of the week from the internationalization package, or else use Sunday as default.
        firstday = this.get('strings.first_weekday') || 0,
        // Compute the cutoff column of the masked calendar table, based on the start date and the first day of week.
        cutoffCol = this._getCutoffColumn(baseDate, firstday),
        // Compute the number of days in the month based on starting date
        daysInMonth = ydate.daysInMonth(baseDate),
        // Initialize the array of individual row HTML strings
        row_array = ['','','','','',''],
        // Initialize the partial templates object
        partials = {};
        
            // Initialize the partial template for the weekday row cells.
        _yuitest_coverline("build/calendar-base/calendar-base.js", 1029);
partials["weekday_row"] = '';
      
      // Populate the partial template for the weekday row cells with weekday names
      _yuitest_coverline("build/calendar-base/calendar-base.js", 1032);
for (var day = firstday; day <= firstday + 6; day++) {
               _yuitest_coverline("build/calendar-base/calendar-base.js", 1033);
partials["weekday_row"] += 
                  substitute(CalendarBase.WEEKDAY_TEMPLATE,
                       {weekdayname: weekdays[day%7],
                        full_weekdayname: fullweekdays[day%7]});
      }
        
        // Populate the partial template for the weekday row container with the weekday row cells
      _yuitest_coverline("build/calendar-base/calendar-base.js", 1040);
partials["weekday_row_template"] = substitute(CalendarBase.WEEKDAY_ROW_TEMPLATE, partials);

      // Populate the array of individual row HTML strings
          _yuitest_coverline("build/calendar-base/calendar-base.js", 1043);
for (var row = 0; row <= 5; row++) {
          
              _yuitest_coverline("build/calendar-base/calendar-base.js", 1045);
for (var column = 0; column <= 12; column++) {  
             
             // Compute the value of the date that needs to populate the cell
             _yuitest_coverline("build/calendar-base/calendar-base.js", 1048);
var date = 7*row - 5 + column;

             // Compose the value of the unique id of the current calendar cell
             _yuitest_coverline("build/calendar-base/calendar-base.js", 1051);
var id_date = pane_id + "_" + column + "_" + date;

             // Set the calendar day class to one of three possible values
             _yuitest_coverline("build/calendar-base/calendar-base.js", 1054);
var calendar_day_class = CAL_DAY;

             _yuitest_coverline("build/calendar-base/calendar-base.js", 1056);
if (date < 1) {
              _yuitest_coverline("build/calendar-base/calendar-base.js", 1057);
calendar_day_class = CAL_PREVMONTH_DAY;
             }
                 else {_yuitest_coverline("build/calendar-base/calendar-base.js", 1059);
if (date > daysInMonth) {
                  _yuitest_coverline("build/calendar-base/calendar-base.js", 1060);
calendar_day_class = CAL_NEXTMONTH_DAY;
                 }}

                 // Cut off dates that fall before the first and after the last date of the month
             _yuitest_coverline("build/calendar-base/calendar-base.js", 1064);
if (date < 1 || date > daysInMonth) {
               _yuitest_coverline("build/calendar-base/calendar-base.js", 1065);
date = "&nbsp;";
             }
             
             // Decide on whether a column in the masked table is visible or not based on the value of the cutoff column.
             _yuitest_coverline("build/calendar-base/calendar-base.js", 1069);
var column_visibility = (column >= cutoffCol && column < (cutoffCol + 7)) ? '' : CAL_COL_HIDDEN;

             // Substitute the values into the partial calendar day template and add it to the current row HTML string
             _yuitest_coverline("build/calendar-base/calendar-base.js", 1072);
row_array[row] += substitute (CalendarBase.CALDAY_TEMPLATE, 
                                         {day_content: date,
                                        calendar_col_class: "calendar_col" + column,
                                        calendar_col_visibility_class: column_visibility,
                                        calendar_day_class: calendar_day_class,
                                        calendar_day_id: id_date});
             }
            }
      
      // Instantiate the partial calendar pane body template
      _yuitest_coverline("build/calendar-base/calendar-base.js", 1082);
partials["body_template"] = '';
      
      // Populate the body template with the rows templates
      _yuitest_coverline("build/calendar-base/calendar-base.js", 1085);
each (row_array, function (v) {
         _yuitest_coverfunc("build/calendar-base/calendar-base.js", "(anonymous 8)", 1085);
_yuitest_coverline("build/calendar-base/calendar-base.js", 1086);
partials["body_template"] += substitute(CalendarBase.CALDAY_ROW_TEMPLATE, 
                                                       {calday_row: v});
      });

      // Populate the calendar grid id
      _yuitest_coverline("build/calendar-base/calendar-base.js", 1091);
partials["calendar_pane_id"] = pane_id;

      // Populate the calendar pane tabindex
      _yuitest_coverline("build/calendar-base/calendar-base.js", 1094);
partials["calendar_pane_tabindex"] = this.get("tabIndex");
      _yuitest_coverline("build/calendar-base/calendar-base.js", 1095);
partials["pane_arialabel"] = ydate.format(baseDate, {format:"%B %Y"});


      // Generate final output by substituting class names.
          _yuitest_coverline("build/calendar-base/calendar-base.js", 1099);
var output = substitute(substitute (CalendarBase.CALENDAR_GRID_TEMPLATE, partials),
                              CalendarBase.CALENDAR_STRINGS);

        // Store the initialized pane information

        _yuitest_coverline("build/calendar-base/calendar-base.js", 1104);
this._paneProperties[pane_id] = {cutoffCol: cutoffCol, daysInMonth: daysInMonth, paneDate: baseDate};

      _yuitest_coverline("build/calendar-base/calendar-base.js", 1106);
return output;
  },

     /**
     * A rendering assist method that rerenders a specified calendar pane, based
     * on a new Date. 
     * @method _rerenderCalendarPane
     * @param {Date} newDate The date corresponding to the month of the given
     * calendar pane.
     * @param {Node} pane The node corresponding to the calendar pane to be rerenders.
     * @private
     */ 
  _rerenderCalendarPane : function (newDate, pane) {

       // Get the first day of the week from the internationalization package, or else use Sunday as default.
     _yuitest_coverfunc("build/calendar-base/calendar-base.js", "_rerenderCalendarPane", 1118);
_yuitest_coverline("build/calendar-base/calendar-base.js", 1121);
var firstday = this.get('strings.first_weekday') || 0,
         // Compute the cutoff column of the masked calendar table, based on the start date and the first day of week.
         cutoffCol = this._getCutoffColumn(newDate, firstday),
         // Compute the number of days in the month based on starting date
         daysInMonth = ydate.daysInMonth(newDate),
         // Get pane id for easier reference
         paneId = pane.get("id");
  
       // Hide the pane before making DOM changes to speed them up
         _yuitest_coverline("build/calendar-base/calendar-base.js", 1130);
pane.setStyle("visibility", "hidden");
         _yuitest_coverline("build/calendar-base/calendar-base.js", 1131);
pane.setAttribute("aria-label", ydate.format(newDate, {format:"%B %Y"}));
  
       // Go through all columns, and flip their visibility setting based on whether they are within the unmasked range.
         _yuitest_coverline("build/calendar-base/calendar-base.js", 1134);
for (var column = 0; column <= 12; column++) {
        _yuitest_coverline("build/calendar-base/calendar-base.js", 1135);
var currentColumn = pane.all("." + "calendar_col" + column);
        _yuitest_coverline("build/calendar-base/calendar-base.js", 1136);
currentColumn.removeClass(CAL_COL_HIDDEN);
      
        _yuitest_coverline("build/calendar-base/calendar-base.js", 1138);
if (column < cutoffCol || column >= (cutoffCol + 7)) {
            _yuitest_coverline("build/calendar-base/calendar-base.js", 1139);
currentColumn.addClass(CAL_COL_HIDDEN);
        }
        else {
          // Clean up dates in visible columns to account for the correct number of days in a month
          _yuitest_coverline("build/calendar-base/calendar-base.js", 1143);
switch(column)
          {
         case 0:
          _yuitest_coverline("build/calendar-base/calendar-base.js", 1146);
var curCell = pane.one("#" + paneId + "_0_30");
          _yuitest_coverline("build/calendar-base/calendar-base.js", 1147);
if (daysInMonth >= 30) {
            _yuitest_coverline("build/calendar-base/calendar-base.js", 1148);
curCell.set("text", "30");
            _yuitest_coverline("build/calendar-base/calendar-base.js", 1149);
curCell.removeClass(CAL_NEXTMONTH_DAY).addClass(CAL_DAY);
          }
          else {
            _yuitest_coverline("build/calendar-base/calendar-base.js", 1152);
curCell.setContent("&nbsp;");
            _yuitest_coverline("build/calendar-base/calendar-base.js", 1153);
curCell.addClass(CAL_NEXTMONTH_DAY).addClass(CAL_DAY);
          }
          _yuitest_coverline("build/calendar-base/calendar-base.js", 1155);
break;
         case 1:
          _yuitest_coverline("build/calendar-base/calendar-base.js", 1157);
var curCell = pane.one("#" + paneId + "_1_31");
          _yuitest_coverline("build/calendar-base/calendar-base.js", 1158);
if (daysInMonth >= 31) {
            _yuitest_coverline("build/calendar-base/calendar-base.js", 1159);
curCell.set("text", "31");
            _yuitest_coverline("build/calendar-base/calendar-base.js", 1160);
curCell.removeClass(CAL_NEXTMONTH_DAY).addClass(CAL_DAY);
          }
          else {
            _yuitest_coverline("build/calendar-base/calendar-base.js", 1163);
curCell.setContent("&nbsp;");
            _yuitest_coverline("build/calendar-base/calendar-base.js", 1164);
curCell.removeClass(CAL_DAY).addClass(CAL_NEXTMONTH_DAY);
          }
          _yuitest_coverline("build/calendar-base/calendar-base.js", 1166);
break;
         case 6:
          _yuitest_coverline("build/calendar-base/calendar-base.js", 1168);
var curCell = pane.one("#" + paneId + "_6_29");
          _yuitest_coverline("build/calendar-base/calendar-base.js", 1169);
if (daysInMonth >= 29) {
            _yuitest_coverline("build/calendar-base/calendar-base.js", 1170);
curCell.set("text", "29");
            _yuitest_coverline("build/calendar-base/calendar-base.js", 1171);
curCell.removeClass(CAL_NEXTMONTH_DAY).addClass(CAL_DAY);
          }
          else {
            _yuitest_coverline("build/calendar-base/calendar-base.js", 1174);
curCell.setContent("&nbsp;");
            _yuitest_coverline("build/calendar-base/calendar-base.js", 1175);
curCell.removeClass(CAL_DAY).addClass(CAL_NEXTMONTH_DAY);
          }
          _yuitest_coverline("build/calendar-base/calendar-base.js", 1177);
break;
         case 7:
          _yuitest_coverline("build/calendar-base/calendar-base.js", 1179);
var curCell = pane.one("#" + paneId + "_7_30");
          _yuitest_coverline("build/calendar-base/calendar-base.js", 1180);
if (daysInMonth >= 30) {
            _yuitest_coverline("build/calendar-base/calendar-base.js", 1181);
curCell.set("text", "30");
            _yuitest_coverline("build/calendar-base/calendar-base.js", 1182);
curCell.removeClass(CAL_NEXTMONTH_DAY).addClass(CAL_DAY);
          }
          else {
            _yuitest_coverline("build/calendar-base/calendar-base.js", 1185);
curCell.setContent("&nbsp;");
            _yuitest_coverline("build/calendar-base/calendar-base.js", 1186);
curCell.removeClass(CAL_DAY).addClass(CAL_NEXTMONTH_DAY);
          }
          _yuitest_coverline("build/calendar-base/calendar-base.js", 1188);
break;
         case 8:
          _yuitest_coverline("build/calendar-base/calendar-base.js", 1190);
var curCell = pane.one("#" + paneId + "_8_31");
          _yuitest_coverline("build/calendar-base/calendar-base.js", 1191);
if (daysInMonth >= 31) {
            _yuitest_coverline("build/calendar-base/calendar-base.js", 1192);
curCell.set("text", "31");
            _yuitest_coverline("build/calendar-base/calendar-base.js", 1193);
curCell.removeClass(CAL_NEXTMONTH_DAY).addClass(CAL_DAY);
          }
          else {
            _yuitest_coverline("build/calendar-base/calendar-base.js", 1196);
curCell.setContent("&nbsp;");
            _yuitest_coverline("build/calendar-base/calendar-base.js", 1197);
curCell.removeClass(CAL_DAY).addClass(CAL_NEXTMONTH_DAY);
          }
          _yuitest_coverline("build/calendar-base/calendar-base.js", 1199);
break;
          } 
        }
        }
    // Update stored pane properties
    _yuitest_coverline("build/calendar-base/calendar-base.js", 1204);
this._paneProperties[paneId].cutoffCol = cutoffCol;
    _yuitest_coverline("build/calendar-base/calendar-base.js", 1205);
this._paneProperties[paneId].daysInMonth = daysInMonth;
    _yuitest_coverline("build/calendar-base/calendar-base.js", 1206);
this._paneProperties[paneId].paneDate = newDate;
  
  // Bring the pane visibility back after all DOM changes are done    
  _yuitest_coverline("build/calendar-base/calendar-base.js", 1209);
pane.setStyle("visibility", "visible");

  },

     /**
     * A rendering assist method that updates the calendar header based
     * on a given date and potentially the provided headerRenderer.
     * @method _updateCalendarHeader
     * @param {Date} baseDate The date with which to update the calendar header.
     * @private
     */ 
    _updateCalendarHeader : function (baseDate) {
      _yuitest_coverfunc("build/calendar-base/calendar-base.js", "_updateCalendarHeader", 1220);
_yuitest_coverline("build/calendar-base/calendar-base.js", 1221);
var headerString = "",
      headerRenderer = this.get("headerRenderer");
      
      _yuitest_coverline("build/calendar-base/calendar-base.js", 1224);
if (Y.Lang.isString(headerRenderer)) {
        _yuitest_coverline("build/calendar-base/calendar-base.js", 1225);
headerString = ydate.format(baseDate, {format:headerRenderer});
      }
      else {_yuitest_coverline("build/calendar-base/calendar-base.js", 1227);
if (headerRenderer instanceof Function) {
        _yuitest_coverline("build/calendar-base/calendar-base.js", 1228);
headerString = headerRenderer.call(this, baseDate);
      }}
      
      _yuitest_coverline("build/calendar-base/calendar-base.js", 1231);
return headerString;  
    },

     /**
     * A rendering assist method that initializes the calendar header HTML 
     * based on a given date and potentially the provided headerRenderer.
     * @method _updateCalendarHeader
     * @param {Date} baseDate The date with which to initialize the calendar header.
     * @private
     */ 
    _initCalendarHeader : function (baseDate) {
      _yuitest_coverfunc("build/calendar-base/calendar-base.js", "_initCalendarHeader", 1241);
_yuitest_coverline("build/calendar-base/calendar-base.js", 1242);
return substitute(substitute(CalendarBase.HEADER_TEMPLATE, 
                                 {calheader: this._updateCalendarHeader(baseDate),
                                  calendar_id: this._calendarId}), 
                      CalendarBase.CALENDAR_STRINGS);
    },

     /**
     * A rendering assist method that initializes the calendar HTML 
     * based on a given date.
     * @method _initCalendarHTML
     * @param {Date} baseDate The date with which to initialize the calendar.
     * @private
     */          
  _initCalendarHTML : function (baseDate) {
        // Instantiate the partials holder
        _yuitest_coverfunc("build/calendar-base/calendar-base.js", "_initCalendarHTML", 1255);
_yuitest_coverline("build/calendar-base/calendar-base.js", 1257);
var partials = {},
            // Counter for iterative template replacement.
            counter = 0;
        
        // Generate the template for the header   
        _yuitest_coverline("build/calendar-base/calendar-base.js", 1262);
partials["header_template"] =  this._initCalendarHeader(baseDate);
        _yuitest_coverline("build/calendar-base/calendar-base.js", 1263);
partials["calendar_id"] = this._calendarId;

          _yuitest_coverline("build/calendar-base/calendar-base.js", 1265);
partials["body_template"] = substitute(substitute (CalendarBase.CONTENT_TEMPLATE, partials),
                                             CalendarBase.CALENDAR_STRINGS);
 
        // Instantiate the iterative template replacer function        
        _yuitest_coverline("build/calendar-base/calendar-base.js", 1269);
function paneReplacer () {
          _yuitest_coverfunc("build/calendar-base/calendar-base.js", "paneReplacer", 1269);
_yuitest_coverline("build/calendar-base/calendar-base.js", 1270);
var singlePane = this._initCalendarPane(ydate.addMonths(baseDate, counter), partials["calendar_id"]+"_pane_"+counter);
          _yuitest_coverline("build/calendar-base/calendar-base.js", 1271);
counter++;
          _yuitest_coverline("build/calendar-base/calendar-base.js", 1272);
return singlePane;
        }
        // Go through all occurrences of the calendar_grid_template token and replace it with an appropriate calendar grid.
        _yuitest_coverline("build/calendar-base/calendar-base.js", 1275);
var output = partials["body_template"].replace(/\{calendar_grid_template\}/g, Y.bind(paneReplacer, this));

        // Update the paneNumber count
        _yuitest_coverline("build/calendar-base/calendar-base.js", 1278);
this._paneNumber = counter;

    _yuitest_coverline("build/calendar-base/calendar-base.js", 1280);
return output;
  }
}, {
  
   /**
    * The CSS classnames for the calendar templates.
    * @property CALENDAR_STRINGS
    * @type Object
    * @readOnly
    * @protected
    * @static
    */  
  CALENDAR_STRINGS: {
    calendar_grid_class       : CAL_GRID,
    calendar_body_class       : CAL_BODY,
    calendar_hd_class         : CAL_HD,
    calendar_hd_label_class   : CAL_HD_LABEL,
    calendar_weekdayrow_class : CAL_WDAYROW,
    calendar_weekday_class    : CAL_WDAY,
    calendar_row_class        : CAL_ROW,
    calendar_day_class        : CAL_DAY,
    calendar_dayanchor_class  : CAL_ANCHOR,
    calendar_pane_class       : CAL_PANE,
    calendar_right_grid_class : CAL_RIGHT_GRID,
    calendar_left_grid_class  : CAL_LEFT_GRID,
    calendar_status_class     : CAL_STATUS
  },

  /*

  ARIA_STATUS_TEMPLATE: '<div role="status" aria-atomic="true" class="{calendar_status_class}"></div>',

  AriaStatus : null,

  updateStatus : function (statusString) {

    if (!CalendarBase.AriaStatus) {
      CalendarBase.AriaStatus = create(
                             substitute (CalendarBase.ARIA_STATUS_TEMPLATE, 
                                         CalendarBase.CALENDAR_STRINGS));
      Y.one("body").append(CalendarBase.AriaStatus);
    }

      CalendarBase.AriaStatus.set("text", statusString);
  },

  */

   /**
    * The main content template for calendar.
    * @property CONTENT_TEMPLATE
    * @type String
    * @protected
    * @static
    */  
  CONTENT_TEMPLATE:  '<div class="yui3-g {calendar_pane_class}" id="{calendar_id}">' +  
                              '{header_template}' +
                            '<div class="yui3-u-1">' +
                              '{calendar_grid_template}' +
                            '</div>' +
                 '</div>',

   /**
    * A single pane template for calendar (same as default CONTENT_TEMPLATE)
    * @property ONE_PANE_TEMPLATE
    * @type String
    * @protected
    * @readOnly
    * @static
    */  
  ONE_PANE_TEMPLATE: '<div class="yui3-g {calendar_pane_class}" id="{calendar_id}">' +  
                              '{header_template}' +
                            '<div class="yui3-u-1">' +
                              '{calendar_grid_template}' +
                            '</div>' +
                 '</div>',

   /**
    * A two pane template for calendar.
    * @property TWO_PANE_TEMPLATE
    * @type String
    * @protected
    * @readOnly
    * @static
    */  
  TWO_PANE_TEMPLATE: '<div class="yui3-g {calendar_pane_class}" id="{calendar_id}">' +  
                              '{header_template}' +
                            '<div class="yui3-u-1-2">'+
                                    '<div class = "{calendar_left_grid_class}">' +                                  
                                 '{calendar_grid_template}' +
                                    '</div>' +
                            '</div>' +
                            '<div class="yui3-u-1-2">' +
                                    '<div class = "{calendar_right_grid_class}">' +
                                 '{calendar_grid_template}' +
                                    '</div>' +
                            '</div>' +                   
                 '</div>',
   /**
    * A three pane template for calendar.
    * @property THREE_PANE_TEMPLATE
    * @type String
    * @protected
    * @readOnly
    * @static
    */  
  THREE_PANE_TEMPLATE: '<div class="yui3-g {calendar_pane_class}" id="{calendar_id}">' +  
                              '{header_template}' +
                            '<div class="yui3-u-1-3">' +
                                    '<div class = "{calendar_left_grid_class}">' +
                                 '{calendar_grid_template}' +
                                    '</div>' + 
                            '</div>' +
                            '<div class="yui3-u-1-3">' +
                                 '{calendar_grid_template}' +
                            '</div>' +      
                            '<div class="yui3-u-1-3">' +
                                    '<div class = "{calendar_right_grid_class}">' +
                                 '{calendar_grid_template}' +
                                    '</div>' + 
                            '</div>' +                                             
                 '</div>',
   /**
    * A template for the calendar grid.
    * @property CALENDAR_GRID_TEMPLATE
    * @type String
    * @protected
    * @static
    */    
  CALENDAR_GRID_TEMPLATE: '<table class="{calendar_grid_class}" id="{calendar_pane_id}" role="grid" aria-readonly="true" aria-label="{pane_arialabel}" tabindex="{calendar_pane_tabindex}">' + 
                           '<thead>' +
                        '{weekday_row_template}' +
                           '</thead>' +
                           '<tbody>' + 
                            '{body_template}' +
                           '</tbody>' +
                          '</table>',

   /**
    * A template for the calendar header.
    * @property HEADER_TEMPLATE
    * @type String
    * @protected
    * @static
    */   
  HEADER_TEMPLATE: '<div class="yui3-g {calendar_hd_class}">' + 
                         '<div class="yui3-u {calendar_hd_label_class}" id="{calendar_id}_header" aria-role="heading">' + 
                              '{calheader}' +
                         '</div>' +
                   '</div>',

   /**
    * A template for the row of weekday names.
    * @property WEEKDAY_ROW_TEMPLATE
    * @type String
    * @protected
    * @static
    */ 
  WEEKDAY_ROW_TEMPLATE: '<tr class="{calendar_weekdayrow_class}" role="row">' + 
                           '{weekday_row}' +
              '</tr>',

   /**
    * A template for a single row of calendar days.
    * @property CALDAY_ROW_TEMPLATE
    * @type String
    * @protected
    * @static
    */ 
  CALDAY_ROW_TEMPLATE: '<tr class="{calendar_row_class}" role="row">' + 
                 '{calday_row}' + 
              '</tr>',

   /**
    * A template for a single cell with a weekday name.
    * @property CALDAY_ROW_TEMPLATE
    * @type String
    * @protected
    * @static
    */ 
  WEEKDAY_TEMPLATE: '<th class="{calendar_weekday_class}" role="columnheader" aria-label="{full_weekdayname}">{weekdayname}</th>',

   /**
    * A template for a single cell with a calendar day.
    * @property CALDAY_TEMPLATE
    * @type String
    * @protected
    * @static
    */ 
  CALDAY_TEMPLATE: '<td class="{calendar_col_class} {calendar_day_class} {calendar_col_visibility_class}" id="{calendar_day_id}" role="gridcell" tabindex="-1">' +
                       '{day_content}' + 
                   '</td>',

   /**
    * The identity of the widget.
    *
    * @property NAME
    * @type String
    * @default 'calendarBase'
    * @readOnly
    * @protected
    * @static
    */  
  NAME: 'calendarBase',

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
    tabIndex: {
      value: 1
    },
    /**
     * The date corresponding to the current calendar view. Always
     * normalized to the first of the month that contains the date
     * at assignment time. Used as the first date visible in the
     * calendar.
     *
     * @attribute date
     * @type Date
     * @default The first of the month containing today's date, as
     * set on the end user's system.
     */
    date: {
      value: new Date(),
      setter: function (val) {
        _yuitest_coverfunc("build/calendar-base/calendar-base.js", "setter", 1511);
_yuitest_coverline("build/calendar-base/calendar-base.js", 1512);
var newDate = this._normalizeDate(val);
        _yuitest_coverline("build/calendar-base/calendar-base.js", 1513);
if (ydate.areEqual(newDate, this.get('date'))) {
            _yuitest_coverline("build/calendar-base/calendar-base.js", 1514);
return this.get('date');
        }
        else {
            _yuitest_coverline("build/calendar-base/calendar-base.js", 1517);
return newDate;
        }
      }
      },

    /**
     * A setting specifying whether to shows days from the previous
     * month in the visible month's grid, if there are empty preceding
     * cells available.
     *
     * @attribute showPrevMonth
     * @type boolean
     * @default false
     */
    showPrevMonth: {
      value: false
    },

    /**
     * A setting specifying whether to shows days from the next
     * month in the visible month's grid, if there are empty
     * cells available at the end.
     *
     * @attribute showNextMonth
     * @type boolean
     * @default false
     */
    showNextMonth: {
      value: false
    },

    /**
     * Strings and properties derived from the internationalization packages
     * for the calendar.
     *
     * @attribute strings
     * @type Object
     * @protected
     */
    strings : {
            valueFn: function() { _yuitest_coverfunc("build/calendar-base/calendar-base.js", "valueFn", 1557);
_yuitest_coverline("build/calendar-base/calendar-base.js", 1557);
return Y.Intl.get("calendar-base"); }
        },

    /**
     * Custom header renderer for the calendar.
     *
     * @attribute headerRenderer
     * @type String | Function
     */
        headerRenderer: {
            value: "%B %Y"
        },

    /**
     * The name of the rule which all enabled dates should match.
     * Either disabledDatesRule or enabledDatesRule should be specified,
     * or neither, but not both.
     *
     * @attribute enabledDatesRule
     * @type String
     * @default null
     */
        enabledDatesRule: {
            value: null
        },

    /**
     * The name of the rule which all disabled dates should match.
     * Either disabledDatesRule or enabledDatesRule should be specified,
     * or neither, but not both.
     *
     * @attribute disabledDatesRule
     * @type String
     * @default null
     */
        disabledDatesRule: {
            value: null
        },

    /**
     * A read-only attribute providing a list of currently selected dates.
     *
     * @attribute selectedDates
     * @readOnly
     * @type Array
     */
        selectedDates : {
          readOnly: true,
          getter: function (val) {
            _yuitest_coverfunc("build/calendar-base/calendar-base.js", "getter", 1605);
_yuitest_coverline("build/calendar-base/calendar-base.js", 1606);
return (this._getSelectedDatesList());
          }
        },

    /**
     * An object of the form {rules:Object, filterFunction:Function},
     * providing  set of rules and a custom rendering function for 
     * customizing specific calendar cells.
     *
     * @attribute customRenderer
     * @readOnly
     * @type Object
     * @default {}
     */
        customRenderer : {
            lazyAdd: false,
            value: {},
            setter: function (val) {
                _yuitest_coverfunc("build/calendar-base/calendar-base.js", "setter", 1623);
_yuitest_coverline("build/calendar-base/calendar-base.js", 1624);
this._rules = val.rules;
                _yuitest_coverline("build/calendar-base/calendar-base.js", 1625);
this._filterFunction = val.filterFunction;
            }
        }
  }
  
});


}, '3.7.3', {"requires": ["widget", "substitute", "datatype-date", "datatype-date-math", "cssgrids"], "lang": ["de", "en", "fr", "ja", "nb-NO", "pt-BR", "ru", "zh-HANT-TW"], "skinnable": true});
