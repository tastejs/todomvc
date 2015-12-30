/*!
 * UI development toolkit for HTML5 (OpenUI5)
 * (c) Copyright 2009-2015 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */

// Provides class sap.ui.core.FocusHandler
sap.ui.define(['jquery.sap.global', '../Device', '../base/Object', 'jquery.sap.script'],
	function(jQuery, Device, BaseObject/* , jQuerySap */) {
	"use strict";




		/**
		 * Constructs an instance of a sap.ui.core.FocusHandler.
		 * Keeps track of the focused element.
		 *
		 * @class Keeps track of the focused element.
		 * @param {Element} oRootRef e.g. document.body
		 * @param {sap.ui.core.Core} oCore Reference to the Core implementation
		 * @alias sap.ui.core.FocusHandler
		 * @private
		 */
		var FocusHandler = BaseObject.extend("sap.ui.core.FocusHandler", /** @lends sap.ui.core.FocusHandler.prototype */ {
			constructor : function(oRootRef, oCore) {
				BaseObject.apply(this);

				this.oCore = oCore;

				// keep track of element currently in focus
				this.oCurrent = null;
				// keep track of the element previously had the focus
				this.oLast = null;
				// buffer the focus/blur events for correct order
				this.aEventQueue = [];
				// keep track of last focused element
				this.oLastFocusedControlInfo = null;

				this.fEventHandler = jQuery.proxy(this.onEvent, this);

				// initialize event handling
				if (oRootRef.addEventListener && !Device.browser.internet_explorer) { //FF, Safari
					oRootRef.addEventListener("focus", this.fEventHandler, true);
					oRootRef.addEventListener("blur", this.fEventHandler, true);
				} else { //IE
					jQuery(oRootRef).bind("activate", this.fEventHandler);
					jQuery(oRootRef).bind("deactivate", this.fEventHandler);
				}
				jQuery.sap.log.debug("FocusHandler setup on Root " + oRootRef.type + (oRootRef.id ? ": " + oRootRef.id : ""), null, "sap.ui.core.FocusHandler");
			}
		});

		/**
		 * Returns the Id of the control/element currently in focus.
		 * @return {string} the Id of the control/element currently in focus.
		 * @public
		 */
		FocusHandler.prototype.getCurrentFocusedControlId = function(){
			var aCtrls = null;
			try {
				var $Act = jQuery(document.activeElement);
				if ($Act.is(":focus") || (Device.browser.internet_explorer && Device.browser.version == 8 && document.hasFocus())) {
					aCtrls = $Act.control();
				}
			} catch (err) {
				//escape eslint check for empty block
			}
			return aCtrls && aCtrls.length > 0 ? aCtrls[0].getId() : null;
		};

		/**
		 * Returns the focus info of the current focused control or the control with the given id, if exists.
		 *
		 * @see sap.ui.core.FocusHandler#restoreFocus
		 * @see sap.ui.core.FocusHandler#getCurrentFocusedControlId
		 * @param {string} [sControlId] the id of the control. If not given the id of the current focused control (if exists) is used
		 * @return {object} the focus info of the current focused control or the control with the given id, if exists.
		 * @private
		 */
		FocusHandler.prototype.getControlFocusInfo = function(sControlId){
			sControlId = sControlId || this.getCurrentFocusedControlId();

			if (!sControlId) {
				return null;
			}
			
			var oControl = this.oCore.byId(sControlId);
			if (oControl) {
				return {
				    id : sControlId,
				    control : oControl,
				    info : oControl.getFocusInfo(),
				    type : oControl.getMetadata().getName(),
				    focusref : oControl.getFocusDomRef()
				};
			}
			return null;
		};

		/**
		 * If the given control is the last known focused control, the stored focusInfo is updated.
		 *
		 * @see sap.ui.core.FocusHandler#restoreFocus
		 * @see sap.ui.core.FocusHandler#getControlFocusInfo
		 * @param {string} oControl the control
		 * @private
		 */
		FocusHandler.prototype.updateControlFocusInfo = function(oControl){
			if (oControl && this.oLastFocusedControlInfo && this.oLastFocusedControlInfo.control === oControl) {
				var sControlId = oControl.getId();
				this.oLastFocusedControlInfo = this.getControlFocusInfo(sControlId);
				jQuery.sap.log.debug("Update focus info of control " + sControlId, null, "sap.ui.core.FocusHandler");
			}
		};

		/**
		 * Restores the focus to the last known focused control or to the given focusInfo, if possible.
		 *
		 * @see sap.ui.core.FocusHandler#getControlFocusInfo
		 * @param {object} [oControlFocusInfo] the focus info previously received from getControlFocusInfo
		 * @private
		 */
		FocusHandler.prototype.restoreFocus = function(oControlFocusInfo){
			var oInfo = oControlFocusInfo || this.oLastFocusedControlInfo;

			if (!oInfo) {
				return;
			}

			var oControl = this.oCore.byId(oInfo.id);
			if (oControl && oInfo.info
					&& oControl.getMetadata().getName() == oInfo.type
					&& oControl.getFocusDomRef() != oInfo.focusref
					&& (oControlFocusInfo || /*!oControlFocusInfo &&*/ oControl !== oInfo.control)) {
				jQuery.sap.log.debug("Apply focus info of control " + oInfo.id, null, "sap.ui.core.FocusHandler");
				oInfo.control = oControl;
				this.oLastFocusedControlInfo = oInfo;
				oControl.applyFocusInfo(oInfo.info);
			} else {
				jQuery.sap.log.debug("Apply focus info of control " + oInfo.id + " not possible", null, "sap.ui.core.FocusHandler");
			}
		};

		/**
		 * Destroy method of the Focus Handler.
		 * It unregisters the event handlers.
		 *
		 * @param {jQuery.Event} event the event that initiated the destruction of the FocusHandler
		 * @private
		 */
		FocusHandler.prototype.destroy = function(event) {
			var oRootRef = event.data.oRootRef;
			if (oRootRef) {
				if (oRootRef.removeEventListener && !Device.browser.internet_explorer) { //FF, Safari
					oRootRef.removeEventListener("focus", this.fEventHandler, true);
					oRootRef.removeEventListener("blur", this.fEventHandler, true);
				} else { //IE
					jQuery(oRootRef).unbind("activate", this.fEventHandler);
					jQuery(oRootRef).unbind("deactivate", this.fEventHandler);
				}
			}
			this.oCore = null;
		};

		/**
		 * Handles the focus/blur events.
		 *
		 * @param oRootRef e.g. document.body
		 * @private
		 */
		FocusHandler.prototype.onEvent = function(oBrowserEvent){
			var oEvent = jQuery.event.fix(oBrowserEvent);

			jQuery.sap.log.debug("Event " + oEvent.type + " reached Focus Handler (target: " + oEvent.target + (oEvent.target ? oEvent.target.id : "") + ")", null, "sap.ui.core.FocusHandler");

			var type = (oEvent.type == "focus" || oEvent.type == "focusin" || oEvent.type == "activate") ? "focus" : "blur";
			this.aEventQueue.push({type:type, controlId: getControlIdForDOM(oEvent.target)});
			if (this.aEventQueue.length == 1) {
				this.processEvent();
			}
		};

		/**
		 * Processes the focus/blur events in the event queue.
		 *
		 * @private
		 */
		FocusHandler.prototype.processEvent = function(){
			var oEvent = this.aEventQueue[0];
			if (!oEvent) {
				return;
			}
			try {
				if (oEvent.type == "focus") {
					this.onfocusEvent(oEvent.controlId);
				} else if (oEvent.type == "blur") {
					this.onblurEvent(oEvent.controlId);
				}
			} finally { //Ensure that queue is processed until it is empty!
				this.aEventQueue.shift();
				if (this.aEventQueue.length > 0) {
					this.processEvent();
				}
			}
		};

		/**
		 * Processes the focus event taken from the event queue.
		 *
		 * @param sControlId Id of the event related control
		 * @private
		 */
		FocusHandler.prototype.onfocusEvent = function(sControlId){
			var oControl = this.oCore.byId(sControlId);
			if (oControl) {
				this.oLastFocusedControlInfo = this.getControlFocusInfo(sControlId);
				jQuery.sap.log.debug("Store focus info of control " + sControlId, null, "sap.ui.core.FocusHandler");
			}

			this.oCurrent = sControlId;
			if (!this.oLast) {
				// No last active element to be left...
				return;
			}

			if (this.oLast != this.oCurrent) {
				// if same control is focused again (e.g. while re-rendering) no focusleave is needed
				triggerFocusleave(this.oLast, sControlId, this.oCore);
			}

			this.oLast = null;
		};

		/**
		 * Processes the blur event taken from the event queue.
		 *
		 * @param sControlId Id of the event related control
		 * @private
		 */
		FocusHandler.prototype.onblurEvent = function(sControlId){
			if (!this.oCurrent) {
				// No current Item, so nothing to lose focus...
				return;
			}
			this.oLast = sControlId;

			this.oCurrent = null;
			jQuery.sap.delayedCall(0, this, "checkForLostFocus");
		};

		/**
		 * Checks for lost focus and provides events in case of losing the focus.
		 * Called in delayed manner from {@link sap.ui.core.FocusHandler#onblurEvent}.
		 *
		 * @private
		 */
		FocusHandler.prototype.checkForLostFocus = function(){
			if (this.oCurrent == null && this.oLast != null) {
				triggerFocusleave(this.oLast, null, this.oCore);
			}
			this.oLast = null;
		};


		//***********************************************************
		// Utility / convenience
		//***********************************************************

		/**
		 * Returns the id of the control/element to which the given DOM
		 * reference belongs to or <code>null</code> if no such
		 * control/element exists.
		 *
		 * @param {Element} oDOM the DOM reference
		 * @returns {string} Id of the control or null
		 * @private
		 */
		var getControlIdForDOM = function(oDOM){
			var sId = jQuery(oDOM).closest("[data-sap-ui]").attr("id");
			if (sId) {
				return sId;
			}
			return null;
		};

		/**
		 * Calls the onsapfocusleave function on the control with id sControlId
		 * with the information about the given related control.
		 *
		 * @param {string} sControlId
		 * @param {string} sRelatedControlId
		 * @private
		 */
		var triggerFocusleave = function(sControlId, sRelatedControlId, oCore){
			var oControl = sControlId ? sap.ui.getCore().byId(sControlId) : null;
			if (oControl) {
				var oRelatedControl = sRelatedControlId ? sap.ui.getCore().byId(sRelatedControlId) : null;
				var oEvent = jQuery.Event("sapfocusleave");
				oEvent.target = oControl.getDomRef();
				oEvent.relatedControlId = oRelatedControl ? oRelatedControl.getId() : null;
				oEvent.relatedControlFocusInfo = oRelatedControl ? oRelatedControl.getFocusInfo() : null;
				//TODO: Cleanup the popup! The following is shit
				var oControlUIArea = oControl.getUIArea();
				var oUiArea = null;
				if (oControlUIArea) {
					oUiArea = oCore.getUIArea(oControlUIArea.getId());
				} else {
					var oPopupUIAreaDomRef = sap.ui.getCore().getStaticAreaRef();
					if (jQuery.sap.containsOrEquals(oPopupUIAreaDomRef, oEvent.target)) {
						oUiArea = oCore.getUIArea(oPopupUIAreaDomRef.id);
					}
				}
				if (oUiArea) {
					oUiArea._handleEvent(oEvent);
				}
			}
		};

		/*
		 * Checks if the passed DOM reference is nested in the active DOM of the document
		 * @param {Element} oDomRef The new active element
		 * @private
		 * @type boolean
		 * @returns {boolean} whether the passed DOM reference is nested in the active DOM of the document
		 */
		/*function isInActiveDom(oDomRef) {
			jQuery.sap.assert(oDomRef != null);
			var oCurrDomRef = oDomRef;
			while(oCurrDomRef) {
				if(oCurrDomRef === document) return true;
				oCurrDomRef = oCurrDomRef.parentNode;
			}
			return false;
		};*/



	return FocusHandler;

});
