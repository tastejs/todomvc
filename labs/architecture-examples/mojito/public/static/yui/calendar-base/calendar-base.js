/*
YUI 3.7.3 (build 5687)
Copyright 2012 Yahoo! Inc. All rights reserved.
Licensed under the BSD License.
http://yuilibrary.com/license/
*/
YUI.add('calendar-base', function (Y, NAME) {

/**
 * The CalendarBase submodule is a basic UI calendar view that displays
 * a range of dates in a two-dimensional month grid, with one or more
 * months visible at a single time. CalendarBase supports custom date
 * rendering, multiple calendar panes, and selection. 
 * @module calendar
 * @submodule calendar-base
 */
    
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
function CalendarBase(config) {
  CalendarBase.superclass.constructor.apply ( this, arguments );
}



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
    this._paneProperties = {};
    this._calendarId = Y.guid('calendar');
    this._selectedDates = {};
    if (isEmpty(this._rules)) {
       this._rules = {};      
    }
    this._storedDateCells = {};
  },

  /**
   * renderUI implementation
   *
   * Creates a visual representation of the calendar based on existing parameters. 
   * @method renderUI
   */  
  renderUI : function () {

      var contentBox = this.get('contentBox');
      contentBox.appendChild(this._initCalendarHTML(this.get('date')));
        if (this.get('showPrevMonth')) {
            this._afterShowPrevMonthChange();
        }
        if (this.get('showNextMonth')) {
            this._afterShowNextMonthChange();
        }
      this._renderCustomRules();
      this._renderSelectedDates();

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
    this.after('dateChange', this._afterDateChange);
    this.after('showPrevMonthChange', this._afterShowPrevMonthChange);
    this.after('showNextMonthChange', this._afterShowNextMonthChange);
    this.after('headerRendererChange', this._afterHeaderRendererChange);
    this.after('customRendererChange', this._afterCustomRendererChange);
    this.after('enabledDatesRuleChange', this._afterCustomRendererChange);
    this.after('disabledDatesRuleChange', this._afterCustomRendererChange);
    this.after('focusedChange', this._afterFocusedChange);
    this.after('selectionChange', this._renderSelectedDates);
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
      var output = [];
      each (this._selectedDates, function (year) {
        each (year, function (month) {
          each (month, function (day) {
           output.push (day);
           }, this);
        }, this);
      }, this);
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
      var year = oDate.getFullYear(),
          month = oDate.getMonth();
      
        if (hasKey(this._selectedDates, year) && hasKey(this._selectedDates[year], month)) {
           return Y.Object.values(this._selectedDates[year][month]); 
        }
        else {
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
        if (strList == "all") {
            return true;
        }
        else {
            var elements = strList.split(","),
                i = elements.length;

            while (i--) {
                var range = elements[i].split("-");
                if (range.length == 2 && num >= parseInt(range[0], 10) && num <= parseInt(range[1], 10)) {
                    return true;
                }
                else if (range.length == 1 && (parseInt(elements[i], 10) == num)) {
                    return true;
                }
            }
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
      var year = oDate.getFullYear(),
          month = oDate.getMonth(),
          date = oDate.getDate(),
          wday = oDate.getDay(),
          rules = this._rules, 
          outputRules = [],
          years, months, dates, days;

      for (years in rules) {
          if (this._isNumInList(year, years)) {
              if (L.isString(rules[years])) {
                  outputRules.push(rules[years]);
              }
              else {
                  for (months in rules[years]) {
                      if (this._isNumInList(month, months)) {
                          if (L.isString(rules[years][months])) {
                              outputRules.push(rules[years][months]);
                          }
                          else {
                              for (dates in rules[years][months]) {
                                  if (this._isNumInList(date, dates)) {
                                      if (L.isString(rules[years][months][dates])) {
                                          outputRules.push(rules[years][months][dates]);
                                      }
                                      else {
                                          for (days in rules[years][months][dates]) {
                                              if (this._isNumInList(wday, days)) {
                                                  if (L.isString(rules[years][months][dates][days])) {
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
       
       var enabledDatesRule = this.get("enabledDatesRule"),
           disabledDatesRule = this.get("disabledDatesRule");

       if (enabledDatesRule) {
           return this._matchesRule(oDate, enabledDatesRule);
       }
       else if (disabledDatesRule) {
           return !this._matchesRule(oDate, disabledDatesRule);
       }
       else {
           return true;
       }
    },

    /**
     * Selects a given date or array of dates.
     * @method selectDates
     * @param {Date|Array} dates A `Date` or `Array` of `Date`s.
     */
    selectDates : function (dates) {
      if (ydate.isValidDate(dates)) {
         this._addDateToSelection(dates);
      }
      else if (L.isArray(dates)) {
         this._addDatesToSelection(dates);
      }
    },

    /**
     * Deselects a given date or array of dates, or deselects
     * all dates if no argument is specified.
     * @method deselectDates
     * @param {Date|Array} [dates] A `Date` or `Array` of `Date`s, or no
     * argument if all dates should be deselected.
     */
    deselectDates : function (dates) {
      if (!dates) {
         this._clearSelection();
      }
      else if (ydate.isValidDate(dates)) {
         this._removeDateFromSelection(dates);
      }
      else if (L.isArray(dates)) {
         this._removeDatesFromSelection(dates);
      }
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

      if (this._canBeSelected(oDate)) {

        var year = oDate.getFullYear(),
            month = oDate.getMonth(),
            day = oDate.getDate();
        
        if (hasKey(this._selectedDates, year)) {
            if (hasKey(this._selectedDates[year], month)) {
                this._selectedDates[year][month][day] = oDate;
            }
            else {
                this._selectedDates[year][month] = {};
                this._selectedDates[year][month][day] = oDate;
            }
        }
        else {
            this._selectedDates[year] = {};
            this._selectedDates[year][month] = {};
            this._selectedDates[year][month][day] = oDate;
        }

        this._selectedDates = setVal(this._selectedDates, [year, month, day], oDate);

        if (!index) {
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
        each(datesArray, this._addDateToSelection, this);
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

        var timezoneDifference = (endDate.getTimezoneOffset() - startDate.getTimezoneOffset())*60000,
            startTime = startDate.getTime(),
            endTime   = endDate.getTime();
            
            if (startTime > endTime) {
                var tempTime = startTime;
                startTime = endTime;
                endTime = tempTime + timezoneDifference;
            }
            else {
                endTime = endTime - timezoneDifference;
            }


        for (var time = startTime; time <= endTime; time += 86400000) {
            var addedDate = new Date(time);
                addedDate.setHours(12);
            this._addDateToSelection(addedDate, time);
        }
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
        var year = oDate.getFullYear(),
            month = oDate.getMonth(),
            day = oDate.getDate();
        if (hasKey(this._selectedDates, year) && 
            hasKey(this._selectedDates[year], month) && 
            hasKey(this._selectedDates[year][month], day)) {
               delete this._selectedDates[year][month][day];
               if (!index) {
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
        each(datesArray, this._removeDateFromSelection, this);
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
        var startTime = startDate.getTime(),
            endTime   = endDate.getTime();
        
        for (var time = startTime; time <= endTime; time += 86400000) {
            this._removeDateFromSelection(new Date(time), time);
        }

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
        this._selectedDates = {};
        this.get("contentBox").all("." + CAL_DAY_SELECTED).removeClass(CAL_DAY_SELECTED).setAttribute("aria-selected", false);
        if (!noevent) {
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
      this.fire("selectionChange", {newSelection: this._getSelectedDatesList()});
    },

    /**
     * A utility method that restores cells modified by custom formatting.
     * @method _restoreModifiedCells
     * @private
     */
    _restoreModifiedCells : function () {
      var contentbox = this.get("contentBox"),
          id;
      for (id in this._storedDateCells) {
          contentbox.one("#" + id).replace(this._storedDateCells[id]);
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

        this.get("contentBox").all("." + CAL_DAY + ",." + CAL_NEXTMONTH_DAY).removeClass(SELECTION_DISABLED).setAttribute("aria-disabled", false);

        if (!isEmpty(this._rules)) {
        var enRule = this.get("enabledDatesRule"),
            disRule = this.get("disabledDatesRule");

           for (var paneNum = 0; paneNum < this._paneNumber; paneNum++) {
             var paneDate = ydate.addMonths(this.get("date"), paneNum);
             var dateArray = ydate.listOfDatesInMonth(paneDate);
             each(dateArray, function (date) {
                var matchingRules = this._getRulesForDate(date);
                if (matchingRules.length > 0) {
                    var dateNode = this._dateToNode(date);
                    if ((enRule && iOf(matchingRules, enRule) < 0) || (!enRule && disRule && iOf(matchingRules, disRule) >= 0)) {
                            dateNode.addClass(SELECTION_DISABLED).setAttribute("aria-disabled", true);
                        }
                        
                    if (L.isFunction(this._filterFunction)) {
                        this._storedDateCells[dateNode.get("id")] = dateNode.cloneNode(true);
                        this._filterFunction (date, dateNode, matchingRules);
                    }
                }
                else if (enRule) {
                   var dateNode = this._dateToNode(date);
                   dateNode.addClass(SELECTION_DISABLED).setAttribute("aria-disabled", true);
                }
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
    this.get("contentBox").all("." + CAL_DAY_SELECTED).removeClass(CAL_DAY_SELECTED).setAttribute("aria-selected", false);
    
        for (var paneNum = 0; paneNum < this._paneNumber; paneNum++) {
        var paneDate = ydate.addMonths(this.get("date"), paneNum);
        var dateArray = this._getSelectedDatesInMonth(paneDate);
        each(dateArray, function (date) {
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
    var day = oDate.getDate(),
            col = 0,
            daymod = day%7,
            paneNum = (12 + oDate.getMonth() - this.get("date").getMonth()) % 12,
            paneId = this._calendarId + "_pane_" + paneNum,
            cutoffCol = this._paneProperties[paneId].cutoffCol;

        switch (daymod) {
          case (0):
             if (cutoffCol >= 6) {
               col = 12;
             }
             else {
               col = 5;
             }
             break;
          case (1):
               col = 6;
             break;
          case (2):
             if (cutoffCol > 0) {
               col = 7;
             }
             else {
               col = 0;
             }
             break;
          case (3):
             if (cutoffCol > 1) {
               col = 8;
             }
             else {
               col = 1;
             }
             break;
          case (4):
             if (cutoffCol > 2) {
               col = 9;
             }
             else {
               col = 2;
             }
             break;
          case (5):
             if (cutoffCol > 3) {
               col = 10;
             }
             else {
               col = 3;
             }
             break;
          case (6):
             if (cutoffCol > 4) {
               col = 11;
             }
             else {
               col = 4;
             }
             break;
        }
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
    
        var idParts = oNode.get("id").split("_").reverse(),
            paneNum = parseInt(idParts[2], 10),
            day  = parseInt(idParts[0], 10);

        var shiftedDate = ydate.addMonths(this.get("date"), paneNum),
            year = shiftedDate.getFullYear(),
            month = shiftedDate.getMonth();

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
      if (date) {
       return new Date(date.getFullYear(), date.getMonth(), 1, 12, 0, 0, 0);
      }
      else {
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

   var distance = this._normalizeDate(date).getDay() - firstday;
   var cutOffColumn = 6 - (distance + 7)%7;
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
        
        var pane_id = pane.get("id"),
            pane_date = this._paneProperties[pane_id].paneDate,
            daysInPrevMonth = ydate.daysInMonth(ydate.addMonths(pane_date, -1));

        if (!this._paneProperties[pane_id].hasOwnProperty("daysInPrevMonth")) {
          this._paneProperties[pane_id].daysInPrevMonth = 0;
        }

        if (daysInPrevMonth != this._paneProperties[pane_id].daysInPrevMonth) {
        
        this._paneProperties[pane_id].daysInPrevMonth = daysInPrevMonth;

        for (var cell = 5; cell >= 0; cell--) 
           {
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
          var pane_id = pane.get("id");
        this._paneProperties[pane_id].daysInPrevMonth = 0;

        for (var cell = 5; cell >= 0; cell--) 
           {
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
      var pane_id = pane.get("id");
        pane.one("#" + pane_id + "_6_29").removeClass(CAL_NEXTMONTH_DAY);
        pane.one("#" + pane_id + "_7_30").removeClass(CAL_NEXTMONTH_DAY);
        pane.one("#" + pane_id + "_8_31").removeClass(CAL_NEXTMONTH_DAY);
        pane.one("#" + pane_id + "_0_30").removeClass(CAL_NEXTMONTH_DAY);
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
          var dayCounter = 1,
              pane_id = pane.get("id"),
              daysInMonth = this._paneProperties[pane_id].daysInMonth,
              cutoffCol = this._paneProperties[pane_id].cutoffCol;

        for (var cell = daysInMonth - 22; cell < cutoffCol + 7; cell++) 
           {
            pane.one("#" + pane_id + "_" + cell + "_" + (cell+23)).set("text", dayCounter++).addClass(CAL_NEXTMONTH_DAY);
           }

        var startingCell = cutoffCol;
        if (daysInMonth == 31 && (cutoffCol <= 1)) {
          startingCell = 2;
        }
        else if (daysInMonth == 30 && cutoffCol === 0) {
          startingCell = 1;
        }
  
        for (var cell = startingCell ; cell < cutoffCol + 7; cell++) {
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
          var pane_id = pane.get("id"),
              daysInMonth = this._paneProperties[pane_id].daysInMonth,
              cutoffCol = this._paneProperties[pane_id].cutoffCol;

        for (var cell = daysInMonth - 22; cell <= 12; cell++) 
           {
            pane.one("#" + pane_id + "_" + cell + "_" + (cell+23)).setContent("&nbsp;").addClass(CAL_NEXTMONTH_DAY);
           }

        var startingCell = 0;
        if (daysInMonth == 31 && (cutoffCol <= 1)) {
          startingCell = 2;
        }
        else if (daysInMonth == 30 && cutoffCol === 0) {
          startingCell = 1;
        }
  
        for (var cell = startingCell ; cell <= 12; cell++) {
            pane.one("#" + pane_id + "_" + cell + "_" + (cell+30)).setContent("&nbsp;").addClass(CAL_NEXTMONTH_DAY);   
        }   
    },

    /**
     * The handler for the change in the showNextMonth attribute.
     * @method _afterShowNextMonthChange
     * @private
     */
    _afterShowNextMonthChange : function () {
      
      var contentBox = this.get('contentBox'),
          lastPane = contentBox.one("#" + this._calendarId + "_pane_" + (this._paneNumber - 1));
          this._cleanUpNextMonthCells(lastPane);  


      if (this.get('showNextMonth')) {
          this._turnNextMonthOn(lastPane);
        }

        else {
          this._turnNextMonthOff(lastPane);
        }

    },

    /**
     * The handler for the change in the showPrevMonth attribute.
     * @method _afterShowPrevMonthChange
     * @private
     */
    _afterShowPrevMonthChange : function () {
      var contentBox = this.get('contentBox'),
          firstPane = contentBox.one("#" + this._calendarId + "_pane_" + 0);

      if (this.get('showPrevMonth')) {
         this._turnPrevMonthOn(firstPane);
      }

      else {
         this._turnPrevMonthOff(firstPane);
      }
      
    },
 
     /**
     * The handler for the change in the headerRenderer attribute.
     * @method _afterHeaderRendererChange
     * @private
     */ 
  _afterHeaderRendererChange : function () {
    var headerCell = this.get("contentBox").one("." + CAL_HD_LABEL);
    headerCell.setContent(this._updateCalendarHeader(this.get('date')));
  },

     /**
     * The handler for the change in the customRenderer attribute.
     * @method _afterCustomRendererChange
     * @private
     */ 
    _afterCustomRendererChange : function () {
        this._restoreModifiedCells();
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
    
    var contentBox = this.get('contentBox'),
        headerCell = contentBox.one("." + CAL_HD).one("." + CAL_HD_LABEL),
        calendarPanes = contentBox.all("." + CAL_GRID),
        currentDate = this.get("date"),
        counter = 0;

  contentBox.setStyle("visibility", "hidden");
  headerCell.setContent(this._updateCalendarHeader(currentDate));
  
    this._restoreModifiedCells();

    calendarPanes.each(function (curNode) {
                      this._rerenderCalendarPane(ydate.addMonths(currentDate, counter++), 
                                            curNode);
                                        }, this);

     this._afterShowPrevMonthChange();
     this._afterShowNextMonthChange();

    this._renderCustomRules();
    this._renderSelectedDates();
      
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
        partials["weekday_row"] = '';
      
      // Populate the partial template for the weekday row cells with weekday names
      for (var day = firstday; day <= firstday + 6; day++) {
               partials["weekday_row"] += 
                  substitute(CalendarBase.WEEKDAY_TEMPLATE,
                       {weekdayname: weekdays[day%7],
                        full_weekdayname: fullweekdays[day%7]});
      }
        
        // Populate the partial template for the weekday row container with the weekday row cells
      partials["weekday_row_template"] = substitute(CalendarBase.WEEKDAY_ROW_TEMPLATE, partials);

      // Populate the array of individual row HTML strings
          for (var row = 0; row <= 5; row++) {
          
              for (var column = 0; column <= 12; column++) {  
             
             // Compute the value of the date that needs to populate the cell
             var date = 7*row - 5 + column;

             // Compose the value of the unique id of the current calendar cell
             var id_date = pane_id + "_" + column + "_" + date;

             // Set the calendar day class to one of three possible values
             var calendar_day_class = CAL_DAY;

             if (date < 1) {
              calendar_day_class = CAL_PREVMONTH_DAY;
             }
                 else if (date > daysInMonth) {
                  calendar_day_class = CAL_NEXTMONTH_DAY;
                 }

                 // Cut off dates that fall before the first and after the last date of the month
             if (date < 1 || date > daysInMonth) {
               date = "&nbsp;";
             }
             
             // Decide on whether a column in the masked table is visible or not based on the value of the cutoff column.
             var column_visibility = (column >= cutoffCol && column < (cutoffCol + 7)) ? '' : CAL_COL_HIDDEN;

             // Substitute the values into the partial calendar day template and add it to the current row HTML string
             row_array[row] += substitute (CalendarBase.CALDAY_TEMPLATE, 
                                         {day_content: date,
                                        calendar_col_class: "calendar_col" + column,
                                        calendar_col_visibility_class: column_visibility,
                                        calendar_day_class: calendar_day_class,
                                        calendar_day_id: id_date});
             }
            }
      
      // Instantiate the partial calendar pane body template
      partials["body_template"] = '';
      
      // Populate the body template with the rows templates
      each (row_array, function (v) {
         partials["body_template"] += substitute(CalendarBase.CALDAY_ROW_TEMPLATE, 
                                                       {calday_row: v});
      });

      // Populate the calendar grid id
      partials["calendar_pane_id"] = pane_id;

      // Populate the calendar pane tabindex
      partials["calendar_pane_tabindex"] = this.get("tabIndex");
      partials["pane_arialabel"] = ydate.format(baseDate, {format:"%B %Y"});


      // Generate final output by substituting class names.
          var output = substitute(substitute (CalendarBase.CALENDAR_GRID_TEMPLATE, partials),
                              CalendarBase.CALENDAR_STRINGS);

        // Store the initialized pane information

        this._paneProperties[pane_id] = {cutoffCol: cutoffCol, daysInMonth: daysInMonth, paneDate: baseDate};

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
     var firstday = this.get('strings.first_weekday') || 0,
         // Compute the cutoff column of the masked calendar table, based on the start date and the first day of week.
         cutoffCol = this._getCutoffColumn(newDate, firstday),
         // Compute the number of days in the month based on starting date
         daysInMonth = ydate.daysInMonth(newDate),
         // Get pane id for easier reference
         paneId = pane.get("id");
  
       // Hide the pane before making DOM changes to speed them up
         pane.setStyle("visibility", "hidden");
         pane.setAttribute("aria-label", ydate.format(newDate, {format:"%B %Y"}));
  
       // Go through all columns, and flip their visibility setting based on whether they are within the unmasked range.
         for (var column = 0; column <= 12; column++) {
        var currentColumn = pane.all("." + "calendar_col" + column);
        currentColumn.removeClass(CAL_COL_HIDDEN);
      
        if (column < cutoffCol || column >= (cutoffCol + 7)) {
            currentColumn.addClass(CAL_COL_HIDDEN);
        }
        else {
          // Clean up dates in visible columns to account for the correct number of days in a month
          switch(column)
          {
         case 0:
          var curCell = pane.one("#" + paneId + "_0_30");
          if (daysInMonth >= 30) {
            curCell.set("text", "30");
            curCell.removeClass(CAL_NEXTMONTH_DAY).addClass(CAL_DAY);
          }
          else {
            curCell.setContent("&nbsp;");
            curCell.addClass(CAL_NEXTMONTH_DAY).addClass(CAL_DAY);
          }
          break;
         case 1:
          var curCell = pane.one("#" + paneId + "_1_31");
          if (daysInMonth >= 31) {
            curCell.set("text", "31");
            curCell.removeClass(CAL_NEXTMONTH_DAY).addClass(CAL_DAY);
          }
          else {
            curCell.setContent("&nbsp;");
            curCell.removeClass(CAL_DAY).addClass(CAL_NEXTMONTH_DAY);
          }
          break;
         case 6:
          var curCell = pane.one("#" + paneId + "_6_29");
          if (daysInMonth >= 29) {
            curCell.set("text", "29");
            curCell.removeClass(CAL_NEXTMONTH_DAY).addClass(CAL_DAY);
          }
          else {
            curCell.setContent("&nbsp;");
            curCell.removeClass(CAL_DAY).addClass(CAL_NEXTMONTH_DAY);
          }
          break;
         case 7:
          var curCell = pane.one("#" + paneId + "_7_30");
          if (daysInMonth >= 30) {
            curCell.set("text", "30");
            curCell.removeClass(CAL_NEXTMONTH_DAY).addClass(CAL_DAY);
          }
          else {
            curCell.setContent("&nbsp;");
            curCell.removeClass(CAL_DAY).addClass(CAL_NEXTMONTH_DAY);
          }
          break;
         case 8:
          var curCell = pane.one("#" + paneId + "_8_31");
          if (daysInMonth >= 31) {
            curCell.set("text", "31");
            curCell.removeClass(CAL_NEXTMONTH_DAY).addClass(CAL_DAY);
          }
          else {
            curCell.setContent("&nbsp;");
            curCell.removeClass(CAL_DAY).addClass(CAL_NEXTMONTH_DAY);
          }
          break;
          } 
        }
        }
    // Update stored pane properties
    this._paneProperties[paneId].cutoffCol = cutoffCol;
    this._paneProperties[paneId].daysInMonth = daysInMonth;
    this._paneProperties[paneId].paneDate = newDate;
  
  // Bring the pane visibility back after all DOM changes are done    
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
      var headerString = "",
      headerRenderer = this.get("headerRenderer");
      
      if (Y.Lang.isString(headerRenderer)) {
        headerString = ydate.format(baseDate, {format:headerRenderer});
      }
      else if (headerRenderer instanceof Function) {
        headerString = headerRenderer.call(this, baseDate);
      }
      
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
        var partials = {},
            // Counter for iterative template replacement.
            counter = 0;
        
        // Generate the template for the header   
        partials["header_template"] =  this._initCalendarHeader(baseDate);
        partials["calendar_id"] = this._calendarId;

          partials["body_template"] = substitute(substitute (CalendarBase.CONTENT_TEMPLATE, partials),
                                             CalendarBase.CALENDAR_STRINGS);
 
        // Instantiate the iterative template replacer function        
        function paneReplacer () {
          var singlePane = this._initCalendarPane(ydate.addMonths(baseDate, counter), partials["calendar_id"]+"_pane_"+counter);
          counter++;
          return singlePane;
        }
        // Go through all occurrences of the calendar_grid_template token and replace it with an appropriate calendar grid.
        var output = partials["body_template"].replace(/\{calendar_grid_template\}/g, Y.bind(paneReplacer, this));

        // Update the paneNumber count
        this._paneNumber = counter;

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
        var newDate = this._normalizeDate(val);
        if (ydate.areEqual(newDate, this.get('date'))) {
            return this.get('date');
        }
        else {
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
            valueFn: function() { return Y.Intl.get("calendar-base"); }
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
                this._rules = val.rules;
                this._filterFunction = val.filterFunction;
            }
        }
  }
  
});


}, '3.7.3', {"requires": ["widget", "substitute", "datatype-date", "datatype-date-math", "cssgrids"], "lang": ["de", "en", "fr", "ja", "nb-NO", "pt-BR", "ru", "zh-HANT-TW"], "skinnable": true});
