/*!
 * UI development toolkit for HTML5 (OpenUI5)
 * (c) Copyright 2009-2015 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */

//Provides control sap.ui.unified.DateRange.
sap.ui.define(['jquery.sap.global', 'sap/ui/core/Element', './library'],
		function(jQuery, Element, library) {
	"use strict";



	/**
	 * Constructor for a new DateRange.
	 *
	 * @param {string} [sId] id for the new control, generated automatically if no id is given 
	 * @param {object} [mSettings] initial settings for the new control
	 *
	 * @class
	 * Date range for use in DatePicker
	 * @extends sap.ui.core.Element
	 * @version 1.32.9
	 *
	 * @constructor
	 * @public
	 * @since 1.22.0
	 * @alias sap.ui.unified.DateRange
	 * @ui5-metamodel This control/element also will be described in the UI5 (legacy) designtime metamodel
	 */
	var DateRange = Element.extend("sap.ui.unified.DateRange", /** @lends sap.ui.unified.DateRange.prototype */ { metadata : {

		library : "sap.ui.unified",
		properties : {

			/**
			 * Start date for a date range. This must be a JavaScript date object.
			 */
			startDate : {type : "object", group : "Misc", defaultValue : null},

			/**
			 * Start date for a date range. If empty only a single date is presented by this DateRange element. This must be a JavaScript date object.
			 */
			endDate : {type : "object", group : "Misc", defaultValue : null}
		}
	}});

	///**
	// * This file defines behavior for the control,
	// */

	DateRange.prototype.setStartDate = function(oDate){

		if (oDate) {
			if (!(oDate instanceof Date)) {
				throw new Error("Date must be a JavaScript date object; " + this);
			}

			var iYear = oDate.getFullYear();
			if (iYear < 1 || iYear > 9999) {
				throw new Error("Date must not be in valid range (between 0001-01-01 and 9999-12-31); " + this);
			}
		}

		this.setProperty("startDate", oDate);

		return this;

	};

	DateRange.prototype.setEndDate = function(oDate){

		if (oDate) {
			if (!(oDate instanceof Date)) {
				throw new Error("Date must be a JavaScript date object; " + this);
			}

			var iYear = oDate.getFullYear();
			if (iYear < 1 || iYear > 9999) {
				throw new Error("Date must not be in valid range (between 0001-01-01 and 9999-12-31); " + this);
			}
		}

		this.setProperty("endDate", oDate);

		return this;

	};

	return DateRange;

}, /* bExport= */ true);
