/*!
 * UI development toolkit for HTML5 (OpenUI5)
 * (c) Copyright 2009-2015 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */

// Provides control sap.ui.commons.ProgressIndicator.
sap.ui.define(['jquery.sap.global', './library', 'sap/ui/core/Control'],
	function(jQuery, library, Control) {
	"use strict";

	/**
	 * Constructor for a new ProgressIndicator.
	 *
	 * @param {string} [sId] ID for the new control, generated automatically if no ID is given
	 * @param {object} [mSettings] Initial settings for the new control
	 *
	 * @class
	 * Shows the progress of a process in a graphical way.
	 * The indicator can be displayed with or without numerical values.
	 * The filling can be displayed in color only, or additionally with the percentage rate.
	 * The indicator status can be interactive.
	 * @extends sap.ui.core.Control
	 *
	 * @author SAP SE
	 * @version 1.32.9
	 *
	 * @constructor
	 * @public
	 * @alias sap.ui.commons.ProgressIndicator
	 * @ui5-metamodel This control/element also will be described in the UI5 (legacy) designtime metamodel
	 */
	var ProgressIndicator = Control.extend("sap.ui.commons.ProgressIndicator", /** @lends sap.ui.commons.ProgressIndicator.prototype */ { metadata : {
		library : "sap.ui.commons",
		properties : {

			/**
			 * Determines whether the control is enabled or not.
			 * Disabled controls have different colors, and can not be focused.
			 */
			enabled : {type : "boolean", group : "Behavior", defaultValue : true},

			/**
			 * Determines the color of the bar which visualizes the progress.
			 * Possible values defined in the sap.ui.core.BarColor enumeration are the following:
			 * CRITICAL (yellow), NEGATIVE (red), POSITIVE (green), NEUTRAL (blue) (default value).
			 */
			barColor : {type : "sap.ui.core.BarColor", group : "Appearance", defaultValue : sap.ui.core.BarColor.NEUTRAL},

			/**
			 * Determines the text value that will be displayed in the bar.
			 */
			displayValue : {type : "string", group : "Appearance", defaultValue : '0%'},

			/**
			 * Determines the numerical value for the displayed length of the progress bar.
			 */
			percentValue : {type : "int", group : "Data", defaultValue : 0},

			/**
			 * Determines whether the percent value shall be rendered inside the bar.
			 */
			showValue : {type : "boolean", group : "Appearance", defaultValue : true},

			/**
			 * Determines the width of the control.
			 */
			width : {type : "sap.ui.core.CSSSize", group : "Dimension", defaultValue : '100%'}
		}
	}});

	/**
	 * Function is called when ProgressIndicator is clicked.
	 *
	 * @param {jQuery.Event} oEvent
	 * @private
	 */
	ProgressIndicator.prototype.onclick = function(oEvent) {

		// Set focus to whole ProgressIndicator control
		this.focus();

	};

	/**
	 * Function is called when the value of the ProgressIndicator goes beyond 100 and
	 * the outer bar needs to be shrinked.
	 * @private
	 */
	ProgressIndicator.prototype.setEndBar = function () {

		var widthBar = this.getPercentValue();
		var widthBorder;
		var sBarColor = this.getBarColor();
		var time;

		this.oBar  = this.getDomRef("bar");
		this.oEnd  = this.getDomRef("end");
		this.oBox  = this.getDomRef("box");

		jQuery(this.oEnd).removeClass('sapUiProgIndEndHidden');

		switch (sBarColor) {
			case "POSITIVE":
				jQuery(this.oEnd).addClass('sapUiProgIndPosEnd');
				break;
			case "NEGATIVE":
				jQuery(this.oEnd).addClass('sapUiProgIndNegEnd');
				break;
			case "CRITICAL":
				jQuery(this.oEnd).addClass('sapUiProgIndCritEnd');
				break;
			case "NEUTRAL":
				jQuery(this.oEnd).addClass('sapUiProgIndEnd');
				break;
			default:
				jQuery(this.oEnd).addClass('sapUiProgIndEnd');
				break;
		}

		if (widthBar > 100) {
			widthBorder = (10000 / widthBar) + '%';
		} else {
			widthBorder = '100%';
		}

		if (widthBar > 100) {
			time = (widthBar - 100) * 20;
		} else {
			time = (100 - widthBar) * 20;
		}

		jQuery(this.oBox).animate({width: widthBorder}, 0, 'linear');

		if (this.bRtl) {
			jQuery(this.oEnd).animate({right: widthBorder}, time, 'linear');
		} else {
			jQuery(this.oEnd).animate({left: widthBorder}, time, 'linear');
		}

		jQuery(this.oBar).animate({width: widthBar + '%'}, time, 'linear');
		if (!this.oThis) {
			this.oThis = this.$();
		}
		this.oThis.attr('aria-valuenow', widthBar + '%');

	};

	/**
	 * Function is called when the value of the ProgressIndicator goes down to 100 or below and
	 * the outer bar needs to be maximized to the to take the whole width of the ProgressIndicator.
	 * @param {int} iPercentValue
	 * @private
	 */
	ProgressIndicator.prototype.setEndBarGoesBack = function (iPercentValue) {

		var widthBar = this.getPercentValue();
		var widthBorder;
		var sBarColor = this.getBarColor();
		var time;

		this.oBar  = this.getDomRef("bar");
		this.oEnd  = this.getDomRef("end");
		this.oBox  = this.getDomRef("box");

		if (iPercentValue > 100) {
			widthBorder = (10000 / iPercentValue) + '%';
		} else {
			widthBorder = '100%';
		}

		switch (sBarColor) {
			case "POSITIVE":
				jQuery(this.oEnd).removeClass('sapUiProgIndPosEnd');
				break;
			case "NEGATIVE":
				jQuery(this.oEnd).removeClass('sapUiProgIndNegEnd');
				break;
			case "CRITICAL":
				jQuery(this.oEnd).removeClass('sapUiProgIndCritEnd');
				break;
			case "NEUTRAL":
				jQuery(this.oEnd).removeClass('sapUiProgIndEnd');
				break;
			default:
				jQuery(this.oEnd).removeClass('sapUiProgIndEnd');
				break;
		}

		jQuery(this.oEnd).addClass('sapUiProgIndEndHidden');

		if (widthBar > 100) {
			time = (widthBar - 100) * 20;
		} else {
			time = (100 - widthBar) * 20;
		}

		jQuery(this.oBox).animate({width: widthBorder}, 0, 'linear');

		if (this.bRtl) {
			jQuery(this.oEnd).animate({right: widthBorder}, time, 'linear');
		} else {
			jQuery(this.oEnd).animate({left: widthBorder}, time, 'linear');
		}

		jQuery(this.oBar).animate({width: widthBar + '%'}, time, 'linear');
		if (!this.oThis) {
			this.oThis = this.$();
		}
		this.oThis.attr('aria-valuenow', widthBar + '%');

	};

	/**
	 * Sets the new percent value which the ProgressIndicator should display.
	 * A new rendering is not necessary, only the bar has to be moved.
	 *
	 * @param {int} iPercentValue The new percent value of the ProgressIndicator.
	 * @return {sap.ui.commons.ProgressIndicator} <code>this</code> to allow method chaining.
	 * @public
	 */
	ProgressIndicator.prototype.setPercentValue = function(iPercentValue) {

		var widthBar = this.getPercentValue();
		var widthBorder;

		this.oBar  = this.getDomRef("bar");
		this.oEnd  = this.getDomRef("end");
		this.oBox  = this.getDomRef("box");

		var that = this;
		var time;

		if (iPercentValue < 0) {
			iPercentValue = 0;
		}

		if (iPercentValue > 100) {
			widthBorder = (10000 / iPercentValue) + '%';
		} else {
			widthBorder = '100%';
		}

		if (!this.oBar) {
			// Not already rendered -> return and render
			time = iPercentValue * 20;
			this.setProperty('percentValue', iPercentValue, true); // No re-rendering!
			jQuery(this.oBar).animate({width: iPercentValue + '%'}, time, 'linear');
			return this;
		}

		if (iPercentValue > 100 && widthBar <= 100) {
			time = (100 - widthBar) * 20;
			this.setProperty( 'percentValue', iPercentValue, true ); // Do not render complete control again

			jQuery(this.oBar).animate({width: '100%'}, time, 'linear', function() {
				that.setEndBar();
			});
		} else if (iPercentValue <= 100 && widthBar > 100) {
			time = (widthBar - 100) * 20;
			this.setProperty( 'percentValue', iPercentValue, true ); // Do not render complete control again

			jQuery(this.oBar).animate({width: '100%'}, time, 'linear', function() {
				that.setEndBarGoesBack();
			});
		} else if (iPercentValue > 100 && widthBar > 100) {
			if (iPercentValue > widthBar) {
				time = (iPercentValue - widthBar) * 20;
			} else {
				time = (widthBar - iPercentValue) * 20;
			}
			widthBorder = (10000 / iPercentValue) + '%';
			this.setProperty( 'percentValue', iPercentValue, true ); // Do not render complete control again
			jQuery(this.oBox).animate({width: widthBorder}, 0, 'linear');

			if (this.bRtl) {
				jQuery(this.oEnd).animate({right: widthBorder}, time, 'linear');
			} else {
				jQuery(this.oEnd).animate({left: widthBorder}, time, 'linear');
			}

			jQuery(this.oBar).animate({width: iPercentValue + '%'}, time, 'linear', function() {
			});
			if (!this.oThis) {
				this.oThis = this.$();
			}
			this.oThis.attr('aria-valuenow', iPercentValue + '%');
		} else {
			if (iPercentValue > widthBar) {
				time = (iPercentValue - widthBar) * 20;
			} else {
				time = (widthBar - iPercentValue) * 20;
			}
			this.setProperty( 'percentValue', iPercentValue, true ); // Do not render complete control again
			jQuery(this.oBar).animate({width: iPercentValue + '%'}, time, 'linear');
			if (!this.oThis) {
				this.oThis = this.$();
			}
			this.oThis.attr('aria-valuenow', iPercentValue + '%');
		}

		return this;
	};


	return ProgressIndicator;

}, /* bExport= */ true);
