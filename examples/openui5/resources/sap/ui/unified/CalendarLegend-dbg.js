/*!
 * UI development toolkit for HTML5 (OpenUI5)
 * (c) Copyright 2009-2015 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */

// Provides control sap.ui.unified.CalendarLegend.
sap.ui.define(['jquery.sap.global', 'sap/ui/core/Control', './library'],
	function(jQuery, Control, library) {
	"use strict";

	/**
	 * Constructor for a new CalendarLegend.
	 *
	 * @param {string} [sId] id for the new control, generated automatically if no id is given 
	 * @param {object} [mSettings] initial settings for the new control
	 *
	 * @class
	 * A legend for the Calendar Control. Displays special dates colors with their corresponding description. The aggregation specialDates can be set herefor.
	 * @extends sap.ui.core.Control
	 *
	 * @author SAP SE
	 * @version 1.32.9
	 *
	 * @constructor
	 * @public
	 * @since 1.24.0
	 * @alias sap.ui.unified.CalendarLegend
	 * @ui5-metamodel This control/element also will be described in the UI5 (legacy) designtime metamodel
	 */
	var CalendarLegend = Control.extend("sap.ui.unified.CalendarLegend", /** @lends sap.ui.unified.CalendarLegend.prototype */ { metadata : {

		library : "sap.ui.unified",
		properties : {

			/**
			 * Width of the columns created in which the items are arranged.
			 */
			columnWidth : {type : "sap.ui.core.CSSSize", group : "Misc", defaultValue : '120px'}
		},
		aggregations : {

			/**
			 * Items to be displayed.
			 */
			items : {type : "sap.ui.unified.CalendarLegendItem", multiple : true, singularName : "item"},
			standardItems : {type : "sap.ui.unified.CalendarLegendItem", multiple : true, visibility : "hidden"}
		}
	}});

	CalendarLegend.prototype.init = function() {

		var rb = sap.ui.getCore().getLibraryResourceBundle("sap.ui.unified");
		var sId = this.getId();

		var oItem = new sap.ui.unified.CalendarLegendItem(sId + "-Today", {
			text: rb.getText("LEGEND_TODAY")
		});
		this.addAggregation("standardItems", oItem);

		oItem = new sap.ui.unified.CalendarLegendItem(sId + "-Selected", {
			text: rb.getText("LEGEND_SELECTED")
		});
		this.addAggregation("standardItems", oItem);

		oItem = new sap.ui.unified.CalendarLegendItem(sId + "-NormalDay", {
			text: rb.getText("LEGEND_NORMAL_DAY")
		});
		this.addAggregation("standardItems", oItem);
		oItem = new sap.ui.unified.CalendarLegendItem(sId + "-NonWorkingDay", {
			text: rb.getText("LEGEND_NON_WORKING_DAY")
		});
		this.addAggregation("standardItems", oItem);

	};

	// IE9 workaround for responsive layout of legend items
	CalendarLegend.prototype.onAfterRendering = function() {
		if (sap.ui.Device.browser.msie) {
			if (sap.ui.Device.browser.version < 10) {
				jQuery(".sapUiUnifiedLegendItem").css("width", this.getColumnWidth() + 4 + "px").css("display", "inline-block");
			}
		}
	};

	return CalendarLegend;

}, /* bExport= */ true);
