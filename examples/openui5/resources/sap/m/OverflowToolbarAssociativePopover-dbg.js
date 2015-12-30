/*!
 * UI development toolkit for HTML5 (OpenUI5)
 * (c) Copyright 2009-2015 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */

// Provides control sap.m._overflowToolbarHelpers.OverflowToolbarAssociativePopover.
sap.ui.define(['./Popover', './PopoverRenderer', './OverflowToolbarAssociativePopoverControls', './OverflowToolbarLayoutData'],
	function(Popover, PopoverRenderer, OverflowToolbarAssociativePopoverControls, OverflowToolbarLayoutData) {
	"use strict";



	/**
	 * Constructor for a new OverflowToolbarAssociativePopover.
	 *
	 * @param {string} [sId] id for the new control, generated automatically if no id is given
	 * @param {object} [mSettings] initial settings for the new control
	 *
	 * @class
	 * OverflowToolbarAssociativePopover is a version of Popover that uses an association in addition to the aggregation
	 * @extends sap.ui.core.Popover
	 *
	 * @author SAP SE
	 * @version 1.32.9
	 *
	 * @constructor
	 * @private
	 * @since 1.30
	 * @alias sap.m._overflowToolbarHelpers.OverflowToolbarAssociativePopover
	 */
	var OverflowToolbarAssociativePopover = Popover.extend("sap.m._overflowToolbarHelpers.OverflowToolbarAssociativePopover", /** @lends sap.m._overflowToolbarHelpers.OverflowToolbarAssociativePopover.prototype */ {
		metadata : {
			associations : {
				/**
				 * The same as content, but provided in the form of an association
				 */
				associatedContent: {type: "sap.ui.core.Control", multiple: true}
			}
		},
		renderer: PopoverRenderer.render
	});

	OverflowToolbarAssociativePopover.prototype.init = function() {
		Popover.prototype.init.apply(this, arguments);

		// Instantiate the helper that will manage controls entering/leaving the popover
		this.oControlsManager = new OverflowToolbarAssociativePopoverControls();
	};

	OverflowToolbarAssociativePopover.prototype.onBeforeRendering = function() {
		Popover.prototype.onBeforeRendering.apply(this, arguments);
		this.addStyleClass("sapMOTAPopover");

		var bHasButtonsWithIcons = this._getAllContent().some(function(oControl) {
			return oControl.hasStyleClass("sapMOTAPButtonWithIcon");
		});

		if (bHasButtonsWithIcons) {
			this.addStyleClass("sapMOTAPButtonsWithIcons");
		} else {
			this.removeStyleClass("sapMOTAPButtonsWithIcons");
		}
	};

	/* Override API methods */
	OverflowToolbarAssociativePopover.prototype.addAssociatedContent = function(oControl) {
		this.addAssociation("associatedContent",oControl, true);
		this._preProcessControl(oControl);
		return this;
	};

	OverflowToolbarAssociativePopover.prototype.removeAssociatedContent = function(oControl) {
		var sResult = this.removeAssociation("associatedContent",oControl, true),
			oControlObject;

		if (sResult) {
			oControlObject = sap.ui.getCore().byId(sResult);
			this._postProcessControl(oControlObject);
		}
		return sResult;
	};

	/**
	 * Use the helper to modify controls that are about to enter the popover, so that they look good there
	 * @param oControl
	 * @returns {*}
	 * @private
	 */
	OverflowToolbarAssociativePopover.prototype._preProcessControl = function(oControl){
		var sCtrlClass = oControl.getMetadata().getName(),
			oCtrlConfig = OverflowToolbarAssociativePopoverControls.getControlConfig(oControl),
			sAttachFnName, sPreProcessFnName;

		// For each event that must close the popover, attach a handler
		oCtrlConfig.listenForEvents.forEach(function(sEventType) {
			sAttachFnName = "attach" + fnCapitalize(sEventType);
			oControl[sAttachFnName](this._closeOnInteraction, this);
		}, this);

		// Call preprocessor function, if any
		sPreProcessFnName = "_preProcess" + sCtrlClass.split(".").map(fnCapitalize).join("");
		if (typeof this.oControlsManager[sPreProcessFnName] === "function") {
			this.oControlsManager[sPreProcessFnName](oControl);
		}

		var oLayoutData = oControl.getLayoutData();

		if (oLayoutData instanceof OverflowToolbarLayoutData && oLayoutData.getPriority() === sap.m.OverflowToolbarPriority.Disappear) {
			oControl.addStyleClass("sapMOTAPHidden");
		}

		return this;
	};

	/**
	 * Use the helper to restore controls that leave the popover to their previous state
	 * @param oControl
	 * @returns {*}
	 * @private
	 */
	OverflowToolbarAssociativePopover.prototype._postProcessControl = function(oControl) {
		var sCtrlClass = oControl.getMetadata().getName(),
			oCtrlConfig = OverflowToolbarAssociativePopoverControls.getControlConfig(oControl),
			sDetachFnName, sPostProcessFnName;

		// For each event that must close the popover, detach the handler
		oCtrlConfig.listenForEvents.forEach(function(sEventType) {
			sDetachFnName = "detach" + fnCapitalize(sEventType);
			oControl[sDetachFnName](this._closeOnInteraction, this);
		}, this);

		// Call preprocessor function, if any
		sPostProcessFnName =  "_postProcess" + sCtrlClass.split(".").map(fnCapitalize).join("");
		if (typeof this.oControlsManager[sPostProcessFnName] === "function") {
			this.oControlsManager[sPostProcessFnName](oControl);
		}

		oControl.removeStyleClass("sapMOTAPHidden");

		// It is important to explicitly destroy the control from the popover's DOM when using associations, because the toolbar will render it again and there will be a DOM duplication side effect
		oControl.$().remove();

		return this;
	};

	/**
	 * Many of the controls that enter the popover attach this function to some of their interaction events, such as button click, select choose, etc...
	 * @private
	 */
	OverflowToolbarAssociativePopover.prototype._closeOnInteraction = function() {
		this.close();
	};

	/**
	 * Creates a hash of the ids of the controls in the content association, f.e. "__button1.__button2.__button3"
	 * Useful to check if the same controls are in the popover in the same order compared to a point in the past
	 * @returns {*|string|!Array.<T>}
	 * @private
	 */
	OverflowToolbarAssociativePopover.prototype._getContentIdsHash = function () {
		return this._getAllContent().join(".");
	};

	/**
	 * Returns the content from the aggregation and association combined
	 * @returns {(Array.<T>|string|*|!Array)}
	 * @private
	 */
	OverflowToolbarAssociativePopover.prototype._getAllContent = function () {
		var aAssociatedContent = this.getAssociatedContent().map(function(sId) {
			return sap.ui.getCore().byId(sId);
		});

		if (this.getPlacement() === sap.m.PlacementType.Top) {
			aAssociatedContent.reverse();
		}

		return this.getContent().concat(aAssociatedContent);
	};

	/**
	 * Friendly function to be used externally to get the calculated popover position
	 * @returns {Popover._oCalcedPos|*}
	 */
	OverflowToolbarAssociativePopover.prototype.getCurrentPosition = function() {
		return this._oCalcedPos;
	};

	/**
	 * Force the firing of the "afterOpen" event prematurely, immediately after the popover position is recalculated
	 * This is needed for the popover shadow classes to be set before rendering so there is no shadow blinking
	 * @returns {*}
	 * @private
	 */
	OverflowToolbarAssociativePopover.prototype._calcPlacement = function() {
		var oRes = Popover.prototype._calcPlacement.call(this);
		this.fireAfterOpen({});
		return oRes;
	};

	function fnCapitalize(sName) {
		return sName.substring(0, 1).toUpperCase() + sName.substring(1);
	}

	return OverflowToolbarAssociativePopover;

}, /* bExport= */ false);