/*!
 * UI development toolkit for HTML5 (OpenUI5)
 * (c) Copyright 2009-2015 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */

// Provides class sap.ui.core.ResizeHandler
sap.ui.define(['jquery.sap.global', 'sap/ui/base/Object', 'jquery.sap.act', 'jquery.sap.script'],
	function(jQuery, BaseObject/* , jQuerySap1, jQuerySap */) {
	"use strict";

	// local logger, by default only logging errors
	var log = jQuery.sap.log.getLogger("sap.ui.core.ResizeHandler", jQuery.sap.log.Level.ERROR);

	/**
	 * Reference to the Core (implementation view, not facade)
	 * @type {sap.ui.core.Core} 
	 */
	var oCoreRef = null;

	/** 
	 * The resize handling API provides firing of resize events on all browsers by regularly 
	 * checking the width and height of registered DOM elements or controls and firing events accordingly.
	 * 
	 * @namespace
	 * @alias sap.ui.core.ResizeHandler
	 * @author SAP SE
	 * @version 1.32.9
	 * @public
	 */
	
	var ResizeHandler = BaseObject.extend("sap.ui.core.ResizeHandler", /** @lends sap.ui.core.ResizeHandler.prototype */ {

		constructor : function(oCore) {
			BaseObject.apply(this);

			oCoreRef = oCore;

			this.aResizeListeners = [];
			this.bRegistered = false;

			this.iIdCounter = 0;

			this.fDestroyHandler = jQuery.proxy(this.destroy, this);

			jQuery(window).bind("unload", this.fDestroyHandler);
			
			jQuery.sap.act.attachActivate(initListener, this);
		}

	});
	
	function clearListener(){
		if (this.bRegistered) {
			this.bRegistered = false;
			sap.ui.getCore().detachIntervalTimer(this.checkSizes, this);
		}
	}
	
	function initListener(){
		if (!this.bRegistered && this.aResizeListeners.length > 0) {
			this.bRegistered = true;
			sap.ui.getCore().attachIntervalTimer(this.checkSizes, this);
		}
	}

	/**
	 * Destroy method of the Resize Handler.
	 * It unregisters the event handlers.
	 *
	 * @param {jQuery.Event} oEvent the event that initiated the destruction of the ResizeHandler
	 * @private
	 */
	ResizeHandler.prototype.destroy = function(oEvent) {
		jQuery.sap.act.detachActivate(initListener, this);
		jQuery(window).unbind("unload", this.fDestroyHandler);
		oCoreRef = null;
		this.aResizeListeners = [];
		clearListener.apply(this);
	};

	/**
	 * Attaches listener to resize event.
	 *
	 * @param {Element|sap.ui.core.Control} oRef the DOM reference or a control
	 * @param {function} fHandler the event handler function
	 * @return {string} Registration-ID for later detaching.
	 * @private
	 */
	ResizeHandler.prototype.attachListener = function(oRef, fHandler){
		var bIsControl = oRef instanceof sap.ui.core.Control,
			oDom = bIsControl ? oRef.getDomRef() : oRef,
			iWidth = oDom ? oDom.offsetWidth : 0,
			iHeight = oDom ? oDom.offsetHeight : 0,
			sId = "rs-" + new Date().valueOf() + "-" + this.iIdCounter++,
			dbg;
			
		if (bIsControl) {
			dbg = ("Control " + oRef.getId());
		} else if (oRef.id) {
			dbg = oRef.id;
		} else {
			dbg = String(oRef);
		}

		this.aResizeListeners.push({sId: sId, oDomRef: bIsControl ? null : oRef, oControl: bIsControl ? oRef : null, fHandler: fHandler, iWidth: iWidth, iHeight: iHeight, dbg: dbg});
		log.debug("registered " + dbg);

		initListener.apply(this);
		
		return sId;
	};

	/**
	 * Detaches listener from resize event.
	 *
	 * @param {string} Registration-ID returned from attachListener
	 * @private
	 */
	ResizeHandler.prototype.detachListener = function(sId){
		var that = this;
		jQuery.each(this.aResizeListeners, function(index, oResizeListener){
			if (oResizeListener.sId == sId) {
				that.aResizeListeners.splice(index,1);
				log.debug("deregistered " + sId);
				return false; //break the loop
			}
		});

		// if list is empty now, stop interval
		if (this.aResizeListeners.length == 0) {
			clearListener.apply(this);
		}
	};


	/**
	 * Check sizes of resize elements.
	 * @private
	 */
	ResizeHandler.prototype.checkSizes = function() {
		var bDebug = log.isLoggable();
		if ( bDebug ) {
			log.debug("checkSizes:");
		}
		jQuery.each(this.aResizeListeners, function(index, oResizeListener){
			if (oResizeListener) {
				var bCtrl = !!oResizeListener.oControl,
					oDomRef = bCtrl ? oResizeListener.oControl.getDomRef() : oResizeListener.oDomRef;
					
				if ( oDomRef && jQuery.contains(document.documentElement, oDomRef)) { //check that domref is still active 
					
					var iOldWidth = oResizeListener.iWidth,
						iOldHeight = oResizeListener.iHeight,
						iNewWidth = oDomRef.offsetWidth,
						iNewHeight = oDomRef.offsetHeight;
				
					if (iOldWidth != iNewWidth || iOldHeight != iNewHeight) {
						oResizeListener.iWidth = iNewWidth;
						oResizeListener.iHeight = iNewHeight;
						
						var oEvent = jQuery.Event("resize");
						oEvent.target = oDomRef;
						oEvent.currentTarget = oDomRef;
						oEvent.size = {width: iNewWidth, height: iNewHeight};
						oEvent.oldSize = {width: iOldWidth, height: iOldHeight};
						oEvent.control = bCtrl ? oResizeListener.oControl : null;
						
						if ( bDebug ) {
							log.debug("resize detected for '" + oResizeListener.dbg + "': " + oEvent.oldSize.width + "x" + oEvent.oldSize.height + " -> " + oEvent.size.width + "x" + oEvent.size.height);
						}
						
						oResizeListener.fHandler(oEvent);
					}

				}
			}
		});
		
		if (ResizeHandler._keepActive != true && ResizeHandler._keepActive != false) {
			//initialize default
			ResizeHandler._keepActive = false;
		}
		
		if (!jQuery.sap.act.isActive() && !ResizeHandler._keepActive) {
			clearListener.apply(this);
		}
	};

	/**
	 * Registers the given event handler for resize events on the given DOM element or control.
	 * 
	 * <b>Note:</b> This function must not be used before the UI5 framework is initialized.
	 * Please use the {@link sap.ui.core.Core#attachInit init event} of UI5 if you are not sure whether this is the case.
	 * 
	 * The resize handler periodically checks the dimensions of the registered reference. Whenever it detects changes, an event is fired.
	 * Be careful when changing dimensions within the event handler which might cause another resize event and so on.
	 * 
	 * The available parameters of the resize event are:
	 * <ul>
	 * <li><code>oEvent.target</code>: The DOM element of which the dimensions were checked</li>
	 * <li><code>oEvent.size.width</code>: The current width of the DOM element in pixels</li>
	 * <li><code>oEvent.size.height</code>: The current height of the DOM element in pixels</li>
	 * <li><code>oEvent.oldSize.width</code>: The previous width of the DOM element in pixels</li>
	 * <li><code>oEvent.oldSize.height</code>: The previous height of the DOM element in pixels</li>
	 * <li><code>oEvent.control</code>: The control which was given during registration of the event handler (if present)</li>
	 * </ul>
	 * 
	 * @param {DOMRef|sap.ui.core.Control} oRef The control or the DOM reference for which the given event handler should be registered (beside the window)
	 * @param {function} fHandler
	 *             The event handler which should be called whenever the size of the given reference is changed.
	 *             The event object is passed as first argument to the event handler. See the description of this function for more details about the available parameters of this event.
	 * @return {string}
	 *             A registration ID which can be used for deregistering the event handler, see {@link sap.ui.core.ResizeHandler.deregister}.
	 *             If the UI5 framework is not yet initialized <code>null</code> is returned.
	 * @public
	 */
	ResizeHandler.register = function(oRef, fHandler) {
		if (!oCoreRef || !oCoreRef.oResizeHandler) {
			return null;
		}
		return oCoreRef.oResizeHandler.attachListener(oRef, fHandler);
	};

	/**
	 * Deregisters a previously registered handler for resize events with the given registration ID.
	 *
	 * @param {string} sId
	 *            The registration ID of the handler to deregister. The ID was provided by function {@link sap.ui.core.ResizeHandler.register}
	 *            when the handler was registered.
	 * @public
	 */
	ResizeHandler.deregister = function(sId) {
		if (!oCoreRef || !oCoreRef.oResizeHandler) {
			return;
		}
		oCoreRef.oResizeHandler.detachListener(sId);
	};
	
	/**
	 * Deregisters all registered handler for resize events for the given control.
	 *
	 * @param {string} sControlId The Id of the control.
	 * @private
	 */
	ResizeHandler.deregisterAllForControl = function(sControlId) {
		if (!oCoreRef || !oCoreRef.oResizeHandler) {
			return;
		}
		
		var aIds = [];
		jQuery.each(oCoreRef.oResizeHandler.aResizeListeners, function(index, oResizeListener){
			if (oResizeListener && oResizeListener.oControl && oResizeListener.oControl.getId() === sControlId) {
				aIds.push(oResizeListener.sId);
			}
		});
		jQuery.each(aIds, function(index, sId){
			ResizeHandler.deregister(sId);
		});
	};


	return ResizeHandler;

});
