/*!
 * UI development toolkit for HTML5 (OpenUI5)
 * (c) Copyright 2009-2015 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */

/**
 * OverflowToolbar / OverflowToolbarAssociativePopover helper
 * This class handles the changes done to controls with respect to the associative popover
 * For each control that must have a special handling before entering/leaving the popover, there must be 2 functions:
 * _preProcessCONTROL (called before moving the control to the popover)
 * _postProcessCONTROL (called before returning the control to the toolbar)
 * where CONTROL is a camel-cased version of the getMetadata().getName() value, f.e. "sap.m.Button" becomes "sapMButton"
 */

sap.ui.define(['jquery.sap.global', 'sap/ui/base/Metadata'],
	function(jQuery, Metadata) {
		"use strict";

		var OverflowToolbarAssociativePopoverControls = Metadata.createClass("sap.m._overflowToolbarHelpers.OverflowToolbarAssociativePopoverControls", {
			/**
			 * @private
			 */
			constructor: function() {
				this._mControlsCache = {};
			}
		});

		// Button - modifications similar to action sheet
		OverflowToolbarAssociativePopoverControls.prototype._preProcessSapMButton = function(oControl) {
			this._mControlsCache[oControl.getId()] = {
				buttonType: oControl.getType()
			};

			if (oControl.getType() === sap.m.ButtonType.Transparent) {
				oControl.setProperty("type", sap.m.ButtonType.Default, true);
			}

			// Set some css classes to apply the proper paddings in cases of buttons with/without icons
			if (oControl.getIcon()) {
				oControl.addStyleClass("sapMOTAPButtonWithIcon");
			} else {
				oControl.addStyleClass("sapMOTAPButtonNoIcon");
			}

			oControl.attachEvent("_change", this._onSapMButtonUpdated, this);
		};

		OverflowToolbarAssociativePopoverControls.prototype._postProcessSapMButton = function(oControl) {
			var oPrevState = this._mControlsCache[oControl.getId()];

			if (oControl.getType() !== oPrevState.buttonType) {
				oControl.setProperty("type", oPrevState.buttonType, true);
			}

			oControl.removeStyleClass("sapMOTAPButtonNoIcon");
			oControl.removeStyleClass("sapMOTAPButtonWithIcon");

			oControl.detachEvent("_change", this._onSapMButtonUpdated, this);
		};

		OverflowToolbarAssociativePopoverControls.prototype._onSapMButtonUpdated = function(oEvent) {
			var sParameterName = oEvent.getParameter("name"),
				oButton = oEvent.getSource(),
				sButtonId = oButton.getId();

			if (typeof this._mControlsCache[sButtonId] === "undefined") {
				return;
			}

			if (sParameterName === "type") {
				this._mControlsCache[sButtonId]["buttonType"] = oButton.getType();
			}
		};


		// OverflowToolbarButton - same as Button, but also must add the _bInOverflow trigger
		OverflowToolbarAssociativePopoverControls.prototype._preProcessSapMOverflowToolbarButton = function(oControl) {
			this._preProcessSapMButton(oControl);
			oControl._bInOverflow = true;
		};

		OverflowToolbarAssociativePopoverControls.prototype._postProcessSapMOverflowToolbarButton = function(oControl) {
			delete oControl._bInOverflow;
			this._postProcessSapMButton(oControl);
		};


		// ToggleButton - same as button
		OverflowToolbarAssociativePopoverControls.prototype._preProcessSapMToggleButton = function(oControl) {
			this._preProcessSapMButton(oControl);
		};

		OverflowToolbarAssociativePopoverControls.prototype._postProcessSapMToggleButton = function(oControl) {
			this._postProcessSapMButton(oControl);
		};


		// SegmentedButton - switch to/from select mode
		OverflowToolbarAssociativePopoverControls.prototype._preProcessSapMSegmentedButton = function(oControl) {
			oControl._toSelectMode();
		};

		OverflowToolbarAssociativePopoverControls.prototype._postProcessSapMSegmentedButton = function(oControl) {
			oControl._toNormalMode();
		};

		// Select - turn off icon only mode while in the popover
		OverflowToolbarAssociativePopoverControls.prototype._preProcessSapMSelect = function(oControl) {
			this._mControlsCache[oControl.getId()] = {
				selectType: oControl.getType()
			};

			if (oControl.getType() !== sap.m.SelectType.Default) {
				oControl.setProperty("type", sap.m.SelectType.Default, true);
			}
		};

		OverflowToolbarAssociativePopoverControls.prototype._postProcessSapMSelect = function(oControl) {
			var oPrevState = this._mControlsCache[oControl.getId()];

			if (oControl.getType() !== oPrevState.selectType) {
				oControl.setProperty("type", oPrevState.selectType, true);
			}
		};

		/******************************   STATIC properties and methods   ****************************/

		/**
		 * A map of all controls that are commonly found in an overflow toolbar
		 * canOverflow - tells if the control can go to the popover or is forced to always stay in the toolbar (f.e. labels, radio buttons can never overflow)
		 * listenForEvents - all events that, when fired, suggest that the interaction with the control is over and the popup must be closed (f.e. button click, select change)
		 * noInvalidationProps - all properties of a control that, when changed, do not affect the size of the control, thus don't require a re-rendering of the toolbar (f.e. input value)
		 * @private
		 */
		OverflowToolbarAssociativePopoverControls._mSupportedControls = {
			"sap.m.Button": {
				canOverflow: true,
				listenForEvents: ["press"],
				noInvalidationProps: ["enabled", "type"]
			},
			"sap.m.OverflowToolbarButton": {
				canOverflow: true,
				listenForEvents: ["press"],
				noInvalidationProps: ["enabled", "type"]
			},
			"sap.m.CheckBox": {
				canOverflow: true,
				listenForEvents: ["select"],
				noInvalidationProps: ["enabled", "selected"]
			},
			"sap.m.ToggleButton": {
				canOverflow: true,
				listenForEvents: ["press"],
				noInvalidationProps: ["enabled", "pressed"]
			},
			"sap.m.Select": {
				canOverflow: true,
				listenForEvents: ["change"],
				noInvalidationProps: ["enabled", "selectedItemId", "selectedKey"]
			},
			"sap.m.ComboBox": {
				canOverflow: true,
				listenForEvents: [],
				noInvalidationProps: ["enabled", "value", "selectedItemId", "selectedKey"]
			},
			"sap.m.SearchField": {
				canOverflow: true,
				listenForEvents: ["search"],
				noInvalidationProps: ["enabled", "value", "selectOnFocus"]
			},
			"sap.m.SegmentedButton": {
				canOverflow: true,
				listenForEvents: ["select"],
				noInvalidationProps: ["enabled", "selectedKey"]
			},
			"sap.m.Input": {
				canOverflow: true,
				listenForEvents: [],
				noInvalidationProps: ["enabled", "value"]
			},
			"sap.m.DateTimeInput": {
				canOverflow: true,
				listenForEvents: ["change"],
				noInvalidationProps: ["enabled", "value", "dateValue"]
			},
			"sap.m.RadioButton": {
				canOverflow: false,
				listenForEvents: [],
				noInvalidationProps: ["enabled", "selected"]
			}
		};

		/**
		 * Returns the control configuration for a given control class (obtained through the control instance)
		 * @param vControl - either a control instance object, or a control class name string
		 * @returns {*}
		 */
		OverflowToolbarAssociativePopoverControls.getControlConfig = function(vControl) {
			if (typeof vControl === "object") {
				vControl = vControl.getMetadata().getName();
			}
			return OverflowToolbarAssociativePopoverControls._mSupportedControls[vControl];
		};

		/**
		 * Tells if a control is supported by the associative popover (i.e. can overflow to it)
		 * @param vControl - either a control instance object, or a control class name string
		 * @returns {boolean}
		 */
		OverflowToolbarAssociativePopoverControls.supportsControl = function(vControl) {
			if (typeof vControl === "object") {
				vControl = vControl.getMetadata().getName();
			}
			var oCtrlConfig = OverflowToolbarAssociativePopoverControls._mSupportedControls[vControl];
			return typeof oCtrlConfig !== "undefined" && oCtrlConfig.canOverflow;
		};

		return OverflowToolbarAssociativePopoverControls;

}, /* bExport= */ false);