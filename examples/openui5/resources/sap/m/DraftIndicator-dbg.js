/*!
 * UI development toolkit for HTML5 (OpenUI5)
 * (c) Copyright 2009-2015 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */

sap.ui.define(["sap/ui/core/Control", "sap/m/Label"], function(Control, Label) {
	"use strict";

	/**
	 * Constructor for a new DraftIndicator.
	 * @param {string} [sId] ID for the new control, generated automatically if no ID is given
	 *
	 * @class
	 * A draft indicator is {@link sap.m.Label}.
	 *
	 * @extends sap.ui.core.Control
	 * @abstract
	 *
	 * @author SAP SE
	 * @version 1.32.9
	 *
	 * @constructor
	 * @public
	 * @since 1.32.0
	 * @alias sap.m.DraftIndicator
	 * @ui5-metamodel This control/element also will be described in the UI5 (legacy) designtime metamodel
	 */

	var DraftIndicator = Control.extend("sap.m.DraftIndicator", /** @lends sap.m.DraftIndicator.prototype */ {
		metadata : {

			properties : {
				/**
				 * State of the indicator. Could be "Saving", "Saved" and "Clear".
				 */
				state : {
					type: "sap.m.DraftIndicatorState",
					group : "Behavior", 
					defaultValue : sap.m.DraftIndicatorState.Clear
				},
				/**
				 * Minimum time in milliseconds for showing the draft indicator
				 */
				minDisplayTime : {
					type: "int",
					group: "Behavior",
					defaultValue: 1500
				}
			},
			aggregations : {

				/**
				 * The State is managed in this aggregation
				 */
				_label : {type : "sap.m.Label", multiple : false, visibility: "hidden"}
			}
		}
	});
	
	var oBundle = sap.ui.getCore().getLibraryResourceBundle("sap.m");
	DraftIndicator._oTEXTS = {};
	DraftIndicator._oTEXTS[sap.m.DraftIndicatorState.Saving] = oBundle.getText("DRAFT_INDICATOR_SAVING_DRAFT");
	DraftIndicator._oTEXTS[sap.m.DraftIndicatorState.Saved] = oBundle.getText("DRAFT_INDICATOR_DRAFT_SAVED");
	DraftIndicator._oTEXTS[sap.m.DraftIndicatorState.Clear] = "";
	
	DraftIndicator.prototype.init = function() {
		this.aQueue = [];
		this.iDelayedCallId = null;
	};
	

	/**
	 * @Overwrites
	 */
	DraftIndicator.prototype.setState = function(sState) {
		this.setProperty("state", sState);
		this._addToQueue(sState);
		if (sState === sap.m.DraftIndicatorState.Saving) {
			this._addToQueue(sap.m.DraftIndicatorState.Clear);
		}
		return this;
	};

	DraftIndicator.prototype._getLabel = function() {
		var oControl = this.getAggregation('_label');
		if (!oControl) {
			var oControl = new sap.m.Label({id: this.getId() + "-label"});
			this.setAggregation('_label', oControl, true);
			oControl = this.getAggregation('_label');
		}

		return oControl;
	};

	/**
	 * Sets the indicator in "Saving..." state
	 *
	 * @public
	 */
	DraftIndicator.prototype.showDraftSaving = function() {
		this._addToQueue(sap.m.DraftIndicatorState.Saving);
		this._addToQueue(sap.m.DraftIndicatorState.Clear);
	};
	
	/**
	 * Sets the indicator in "Saved" state
	 *
	 * @public
	 */
	DraftIndicator.prototype.showDraftSaved = function() {
		this._addToQueue(sap.m.DraftIndicatorState.Saved);
	};
	
	/**
	 * Clears the indicator state
	 *
	 * @public
	 */
	DraftIndicator.prototype.clearDraftState = function() {
		this._addToQueue(sap.m.DraftIndicatorState.Clear);
	};
	
	
	/**
	 * Adds states to the queue
	 *
	 * @private
	 */
	DraftIndicator.prototype._addToQueue = function(sState) {
		this.aQueue.push(sState);
		this._processQueue();
	};
	
	/**
	 * Process the states in the aQueue array
	 *
	 * @private
	 */
	DraftIndicator.prototype._processQueue = function() {
		if (this.iDelayedCallId) {
			return;
		}
		
		var sNextState = this.aQueue.shift();
		var iTimeOut = this.getMinDisplayTime();
		
		if (!sNextState) {
			return;
		}
		
		this._applyState(sNextState);
		
		if (sNextState === sap.m.DraftIndicatorState.Clear) {
			this._proceed();
			return;
		}
		this.iDelayedCallId = jQuery.sap.delayedCall(iTimeOut, this, this._proceed);
	};
	
	/**
	 * Resets the timer and starts processing of the queue again
	 *
	 * @private
	 */
	DraftIndicator.prototype._proceed = function() {
		this._resetDraftTimer();
		this._processQueue();
	};
	
	/**
	 * Sets the text of the indicator depending of the state
	 *
	 * @private
	 */
	DraftIndicator.prototype._applyState = function(sState) {
		this._getLabel().setText(DraftIndicator._oTEXTS[sState]);
	};
	
	/**
	 * Resets the timer
	 *
	 * @private
	 */
	DraftIndicator.prototype._resetDraftTimer = function() {
		jQuery.sap.clearDelayedCall(this.iDelayedCallId);
		this.iDelayedCallId = null;
	};

	return DraftIndicator;
}, /* bExport= */ true);