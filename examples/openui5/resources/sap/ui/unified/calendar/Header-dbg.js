/*!
 * UI development toolkit for HTML5 (OpenUI5)
 * (c) Copyright 2009-2015 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */

// Provides control sap.ui.unified.Calendar.
sap.ui.define(['jquery.sap.global', 'sap/ui/core/Control', 'sap/ui/core/LocaleData', 'sap/ui/unified/library'],
	function(jQuery, Control, LocaleData, library) {
	"use strict";

	/**
	 * Constructor for a new Header.
	 *
	 * @param {string} [sId] ID for the new control, generated automatically if no ID is given
	 * @param {object} [mSettings] Initial settings for the new control
	 *
	 * @class
	 * renders a calendar header
	 *
	 * The calendar header consists of 3 buttons where the text can be set and a previous and a next button.
	 * In the normal calendar the first button contains the displayed day, the second button the displayed month and the third button the displayed year.
	 *
	 * <b>Note:</b> This is used inside the calendar. Not for standalone usage
	 * @extends sap.ui.core.Control
	 * @version 1.32.9
	 *
	 * @constructor
	 * @public
	 * @since 1.28.0
	 * @alias sap.ui.unified.calendar.Header
	 * @ui5-metamodel This control/element also will be described in the UI5 (legacy) designtime metamodel
	 */
	var Header = Control.extend("sap.ui.unified.calendar.Header", /** @lends sap.ui.unified.calendar.Header.prototype */ { metadata : {

		library : "sap.ui.unified",
		properties : {

			/**
			 * Text of the first button (normally day)
			 * @since 1.32.0
			 */
			textButton0 : {type : "string", group : "Misc"},

			/**
			 * aria-label of the first button (normally day)
			 * @since 1.32.0
			 */
			ariaLabelButton0 : {type : "string", group : "Misc"},

			/**
			 * If set, the first button will be displayed
			 *
			 * <b>Note:</b> The default is set to false to be compatible to older versions
			 * @since 1.32.0
			 */
			visibleButton0 : {type : "boolean", group : "Misc", defaultValue : false},

			/**
			 * Text of the second button (normally month)
			 */
			textButton1 : {type : "string", group : "Misc"},

			/**
			 * aria-label of the second button (normally month)
			 */
			ariaLabelButton1 : {type : "string", group : "Misc"},

			/**
			 * If set, the second button will be displayed
			 * @since 1.32.0
			 */
			visibleButton1 : {type : "boolean", group : "Misc", defaultValue : true},

			/**
			 * Text of the third button (normally year)
			 */
			textButton2 : {type : "string", group : "Misc"},

			/**
			 * aria-label of the third button (normally year)
			 */
			ariaLabelButton2 : {type : "string", group : "Misc"},

			/**
			 * If set, the third button will be displayed
			 * @since 1.32.0
			 */
			visibleButton2 : {type : "boolean", group : "Misc", defaultValue : true},

			/**
			 * Enables the previous button
			 */
			enabledPrevious : {type : "boolean", group : "Misc", defaultValue : true},

			/**
			 * Enables the Next button
			 */
			enabledNext : {type : "boolean", group : "Misc", defaultValue : true}

		},
		events : {

			/**
			 * Previous button pressed
			 */
			pressPrevious : {},

			/**
			 * Next button pressed
			 */
			pressNext : {},

			/**
			 * First button pressed (normally day)
			 * @since 1.32.0
			 */
			pressButton0 : {},

			/**
			 * Second button pressed (normally month)
			 */
			pressButton1 : {},

			/**
			 * Third button pressed (normally year)
			 */
			pressButton2 : {}

		}
	}});

	(function() {

		Header.prototype.onAfterRendering = function(){

//			var that = this;

		};

		Header.prototype.setTextButton0 = function(sText){

			this.setProperty("textButton0", sText, true);

			if (this.getDomRef() && this.getVisibleButton0()) {
				this.$("B0").text(sText);
			}

		};

		Header.prototype.setAriaLabelButton0 = function(sText){

			this.setProperty("ariaLabelButton0", sText, true);

			if (this.getDomRef() && this.getVisibleButton0()) {
				if (sText) {
					this.$("B0").attr("aria-label", sText);
				} else {
					this.$("B0").removeAttr("aria-label");
				}
			}

		};

		Header.prototype.setTextButton1 = function(sText){

			this.setProperty("textButton1", sText, true);

			if (this.getDomRef() && this.getVisibleButton1()) {
				this.$("B1").text(sText);
			}

		};

		Header.prototype.setAriaLabelButton1 = function(sText){

			this.setProperty("ariaLabelButton1", sText, true);

			if (this.getDomRef() && this.getVisibleButton1()) {
				if (sText) {
					this.$("B1").attr("aria-label", sText);
				} else {
					this.$("B1").removeAttr("aria-label");
				}
			}

		};

		Header.prototype.setTextButton2 = function(sText){

			this.setProperty("textButton2", sText, true);

			if (this.getDomRef() && this.getVisibleButton2()) {
				this.$("B2").text(sText);
			}

		};

		Header.prototype.setAriaLabelButton2 = function(sText){

			this.setProperty("ariaLabelButton2", sText, true);

			if (this.getDomRef() && this.getVisibleButton2()) {
				if (sText) {
					this.$("B2").attr("aria-label", sText);
				} else {
					this.$("B2").removeAttr("aria-label");
				}
			}

		};

		Header.prototype.setEnabledPrevious = function(bEnabled){

			this.setProperty("enabledPrevious", bEnabled, true);

			if (this.getDomRef()) {
				if (bEnabled) {
					this.$("prev").toggleClass("sapUiCalDsbl", false).removeAttr("disabled");
				}else {
					this.$("prev").toggleClass("sapUiCalDsbl", true).attr("disabled", "disabled");
				}
			}

		};

		Header.prototype.setEnabledNext = function(bEnabled){

			this.setProperty("enabledNext", bEnabled, true);

			if (this.getDomRef()) {
				if (bEnabled) {
					this.$("next").toggleClass("sapUiCalDsbl", false).removeAttr("disabled");
				}else {
					this.$("next").toggleClass("sapUiCalDsbl", true).attr("disabled", "disabled");
				}
			}

		};

		Header.prototype.onclick = function(oEvent){

			if (oEvent.isMarked("delayedMouseEvent") ) {
				return;
			}

			if (jQuery.sap.containsOrEquals(this.getDomRef("prev"), oEvent.target) && this.getEnabledPrevious()) {
				this.firePressPrevious();
			}	else if (jQuery.sap.containsOrEquals(this.getDomRef("next"), oEvent.target) && this.getEnabledNext()){
				this.firePressNext();
			} else if (oEvent.target.id == this.getId() + "-B0"){
				this.firePressButton0();
			} else if (oEvent.target.id == this.getId() + "-B1"){
				this.firePressButton1();
			} else if (oEvent.target.id == this.getId() + "-B2"){
				this.firePressButton2();
			}

		};

		Header.prototype.onsapnext = function(oEvent){

			//prevent browser scrolling
			oEvent.preventDefault();

		};

	}());

	return Header;

}, /* bExport= */ true);
