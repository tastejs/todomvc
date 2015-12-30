/*!
 * UI development toolkit for HTML5 (OpenUI5)
 * (c) Copyright 2009-2015 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */

/**
 * Initialization Code and shared classes of library sap.ui.unified.
 */
sap.ui.define(['jquery.sap.global', 
	'sap/ui/core/library'], // library dependency
	function(jQuery) {

	"use strict";

	/**
	 * Unified controls intended for both, mobile and desktop scenarios
	 *
	 * @namespace
	 * @name sap.ui.unified
	 * @author SAP SE
	 * @version 1.32.9
	 * @public
	 */

	// delegate further initialization of this library to the Core
	sap.ui.getCore().initLibrary({
		name : "sap.ui.unified",
		version: "1.32.9",
		dependencies : ["sap.ui.core"],
		types: [
			"sap.ui.unified.CalendarDayType",
			"sap.ui.unified.ContentSwitcherAnimation"
		],
		interfaces: [],
		controls: [
			"sap.ui.unified.calendar.DatesRow",
			"sap.ui.unified.calendar.Header",
			"sap.ui.unified.calendar.Month",
			"sap.ui.unified.calendar.MonthPicker",
			"sap.ui.unified.calendar.MonthsRow",
			"sap.ui.unified.calendar.TimesRow",
			"sap.ui.unified.calendar.YearPicker",
			"sap.ui.unified.Calendar",
			"sap.ui.unified.CalendarDateInterval",
			"sap.ui.unified.CalendarMonthInterval",
			"sap.ui.unified.CalendarTimeInterval",
			"sap.ui.unified.CalendarLegend",
			"sap.ui.unified.ContentSwitcher",
			"sap.ui.unified.Currency",
			"sap.ui.unified.FileUploader",
			"sap.ui.unified.Menu",
			"sap.ui.unified.Shell",
			"sap.ui.unified.ShellLayout",
			"sap.ui.unified.ShellOverlay",
			"sap.ui.unified.SplitContainer"
		],
		elements: [
			"sap.ui.unified.CalendarLegendItem",
			"sap.ui.unified.DateRange",
			"sap.ui.unified.DateTypeRange",
			"sap.ui.unified.FileUploaderParameter",
			"sap.ui.unified.MenuItem",
			"sap.ui.unified.MenuItemBase",
			"sap.ui.unified.MenuTextFieldItem",
			"sap.ui.unified.ShellHeadItem",
			"sap.ui.unified.ShellHeadUserItem"
		]
	});


	/**
	 * Type of a calendar day used for visualization.
	 *
	 * @enum {string}
	 * @public
	 * @since 1.24.0
	 * @ui5-metamodel This enumeration also will be described in the UI5 (legacy) designtime metamodel
	 */
	sap.ui.unified.CalendarDayType = {

		/**
		 * None: No special type is used
		 * @public
		 */
		None : "None",

		/**
		 * Type 01: The semantic meaning must be defined by the application. It can be shown in a legend.
		 * @public
		 */
		Type01 : "Type01",

		/**
		 * Type 02: The semantic meaning must be defined by the application. It can be shown in a legend.
		 * @public
		 */
		Type02 : "Type02",

		/**
		 * Type 03: The semantic meaning must be defined by the application. It can be shown in a legend.
		 * @public
		 */
		Type03 : "Type03",

		/**
		 * Type 04: The semantic meaning must be defined by the application. It can be shown in a legend.
		 * @public
		 */
		Type04 : "Type04",

		/**
		 * Type 05: The semantic meaning must be defined by the application. It can be shown in a legend.
		 * @public
		 */
		Type05 : "Type05",

		/**
		 * Type 06: The semantic meaning must be defined by the application. It can be shown in a legend.
		 * @public
		 */
		Type06 : "Type06",

		/**
		 * Type 07: The semantic meaning must be defined by the application. It can be shown in a legend.
		 * @public
		 */
		Type07 : "Type07",

		/**
		 * Type 08: The semantic meaning must be defined by the application. It can be shown in a legend.
		 * @public
		 */
		Type08 : "Type08",

		/**
		 * Type 09: The semantic meaning must be defined by the application. It can be shown in a legend.
		 * @public
		 */
		Type09 : "Type09",

		/**
		 * Type 10: The semantic meaning must be defined by the application. It can be shown in a legend.
		 * @public
		 */
		Type10 : "Type10"

	};

	/**
	 * Predefined animations for the ContentSwitcher
	 *
	 * @enum {string}
	 * @public
	 * @since 1.16.0
	 * @experimental Since version 1.16.0. 
	 * API is not yet finished and might change completely
	 * @ui5-metamodel This enumeration also will be described in the UI5 (legacy) designtime metamodel
	 */
	sap.ui.unified.ContentSwitcherAnimation = {

		/**
		 * No animation. Content is switched instantly.
		 * @public
		 */
		None : "None",

		/**
		 * Content is faded (opacity change).
		 * @public
		 */
		Fade : "Fade",

		/**
		 * The new content is "zoomed in" from the center and grows to fill the full content area.
		 * @public
		 */
		ZoomIn : "ZoomIn",

		/**
		 * The old content is "zoomed out", i.e. shrinks to a point at the center of the content area.
		 * @public
		 */
		ZoomOut : "ZoomOut",

		/**
		 * The new content rotates in. (Just like one of those old newspaper-animations.)
		 * @public
		 */
		Rotate : "Rotate",

		/**
		 * The new slides in from the left (to the right).
		 * @public
		 */
		SlideRight : "SlideRight",

		/**
		 * The new content slides in from the left while the old content slides out to the left at the same time.
		 * @public
		 */
		SlideOver : "SlideOver"

	};

	sap.ui.base.Object.extend("sap.ui.unified._ContentRenderer", {
		constructor : function(oControl, sContentContainerId, oContent, fAfterRenderCallback) {
			sap.ui.base.Object.apply(this);
			this._id = sContentContainerId;
			this._cntnt = oContent;
			this._ctrl = oControl;
			this._rm = sap.ui.getCore().createRenderManager();
			this._cb = fAfterRenderCallback || function(){};
		},

		destroy : function() {
			this._rm.destroy();
			delete this._rm;
			delete this._id;
			delete this._cntnt;
			delete this._cb;
			delete this._ctrl;
			if (this._rerenderTimer) {
				jQuery.sap.clearDelayedCall(this._rerenderTimer);
				delete this._rerenderTimer;
			}
			sap.ui.base.Object.prototype.destroy.apply(this, arguments);
		},

		render : function() {
			if (!this._rm) {
				return;
			}

			if (this._rerenderTimer) {
				jQuery.sap.clearDelayedCall(this._rerenderTimer);
			}

			this._rerenderTimer = jQuery.sap.delayedCall(0, this, function(){
				var $content = jQuery.sap.byId(this._id);
				var doRender = $content.length > 0;

				if (doRender) {
					if (typeof (this._cntnt) === "string") {
						var aContent = this._ctrl.getAggregation(this._cntnt, []);
						for (var i = 0; i < aContent.length; i++) {
							this._rm.renderControl(aContent[i]);
						}
					} else {
						this._cntnt(this._rm);
					}
					this._rm.flush($content[0]);
				}

				this._cb(doRender);
			});
		}
	});


	sap.ui.unified._iNumberOfOpenedShellOverlays = 0;

	//factory for the FileUploader to create TextField and Button to be overwritten by commons and mobile library
	if (!sap.ui.unified.FileUploaderHelper) {
		sap.ui.unified.FileUploaderHelper = {
			createTextField: function(sId){ throw new Error("no TextField control available!"); }, /* must return a TextField control */
			setTextFieldContent: function(oTextField, sWidth){ throw new Error("no TextField control available!"); },
			createButton: function(){ throw new Error("no Button control available!"); }, /* must return a Button control */
			addFormClass: function(){ return null; },
			bFinal: false /* if true, the helper must not be overwritten by an other library */
		};
	}

	sap.ui.unified.calendar = sap.ui.unified.calendar || {};

	return sap.ui.unified;

});
