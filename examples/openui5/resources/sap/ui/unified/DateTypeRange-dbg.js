/*!
 * UI development toolkit for HTML5 (OpenUI5)
 * (c) Copyright 2009-2015 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */

// Provides control sap.ui.unified.DateTypeRange.
sap.ui.define(['jquery.sap.global', './DateRange', './library'],
	function(jQuery, DateRange, library) {
	"use strict";



	/**
	 * Constructor for a new DateTypeRange.
	 *
	 * @param {string} [sId] id for the new control, generated automatically if no id is given 
	 * @param {object} [mSettings] initial settings for the new control
	 *
	 * @class
	 * Date range with calendar day type information. Used to visualize special days in the Calendar.
	 * @extends sap.ui.unified.DateRange
	 * @version 1.32.9
	 *
	 * @constructor
	 * @public
	 * @since 1.24.0
	 * @alias sap.ui.unified.DateTypeRange
	 * @ui5-metamodel This control/element also will be described in the UI5 (legacy) designtime metamodel
	 */
	var DateTypeRange = DateRange.extend("sap.ui.unified.DateTypeRange", /** @lends sap.ui.unified.DateTypeRange.prototype */ { metadata : {

		library : "sap.ui.unified",
		properties : {

			/**
			 * Type of the date range.
			 */
			type : {type : "sap.ui.unified.CalendarDayType", group : "Appearance", defaultValue : sap.ui.unified.CalendarDayType.Type01}
		}
	}});

	///**
	// * This file defines behavior for the control,
	// */
	//sap.ui.unified.DateTypeRange.prototype.init = function(){
	//   // do something for initialization...
	//};


	return DateTypeRange;

}, /* bExport= */ true);
