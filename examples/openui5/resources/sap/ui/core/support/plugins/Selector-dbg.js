/*!
 * UI development toolkit for HTML5 (OpenUI5)
 * (c) Copyright 2009-2015 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */

// Provides class sap.ui.core.support.plugins.Selector (Selector support plugin)
sap.ui.define(['jquery.sap.global', 'sap/ui/core/Popup', 'sap/ui/core/support/Plugin'],
	function(jQuery, Popup, Plugin) {
	"use strict";


	
	
	
		/**
		 * Creates an instance of sap.ui.core.support.plugins.Selector.
		 * @class This class represents the selector plugin for the support tool functionality of UI5. This class is internal and all its functions must not be used by an application.
		 *
		 * @abstract
		 * @extends sap.ui.base.Object
		 * @version 1.32.9
		 * @constructor
		 * @private
		 * @alias sap.ui.core.support.plugins.Selector
		 */
		var Selector = Plugin.extend("sap.ui.core.support.plugins.Selector", {
			constructor : function(oSupportStub) {
				Plugin.apply(this, ["sapUiSupportSelector", "", oSupportStub]);
				
				if (this.isToolPlugin()) {
					throw Error();
				}
		
				this._aEventIds = [this.getId() + "Highlight"];
				this._oPopup = new Popup();
			}
		});
		
		
		/**
		 * Handler for sapUiSupportSelectorHighlight event
		 * 
		 * @param {sap.ui.base.Event} oEvent the event
		 * @private
		 */
		Selector.prototype.onsapUiSupportSelectorHighlight = function(oEvent){
			highlight(oEvent.getParameter("id"), this, oEvent.getParameter("sendInfo"));
		};
		
		
		Selector.prototype.init = function(oSupportStub){
			Plugin.prototype.init.apply(this, arguments);
			
			var jPopupRef;
			
			if (!this._sPopupId) {
				this._sPopupId = this.getId() + "-" + jQuery.sap.uid();
				var rm = sap.ui.getCore().createRenderManager();
				rm.write("<div id='" + this._sPopupId + "' style='border: 2px solid rgb(0, 128, 0); background-color: rgba(0, 128, 0, .55);'></div>");
				rm.flush(sap.ui.getCore().getStaticAreaRef(), false, true);
				rm.destroy();
				
				jPopupRef = jQuery.sap.byId(this._sPopupId);
				this._oPopup.setContent(jPopupRef[0]);
			} else {
				jPopupRef = jQuery.sap.byId(this._sPopupId);
			}
	
			var that = this;
			
			this._fSelectHandler = function(oEvent){
				if (!oEvent.shiftKey || !oEvent.altKey || !oEvent.ctrlKey) {
					return;
				}
				var sId = jQuery(oEvent.target).closest("[data-sap-ui]").attr("id");
				
				if (highlight(sId, that, true)) {
					oEvent.stopPropagation();
					oEvent.preventDefault();
				}
			};
			
			this._fCloseHandler = function(oEvent){
				that._oPopup.close(0);
			};
			
			jPopupRef.bind("click", this._fCloseHandler);
			jQuery(document).bind("mousedown", this._fSelectHandler);
			
		};
		
		
		Selector.prototype.exit = function(oSupportStub){
			this._oPopup.close(0);
			if (this._fCloseHandler) {
				jQuery.sap.byId(this._sPopupId).unbind("click", this._fCloseHandler);
				this._fCloseHandler = null;
			}
			if (this._fSelectHandler) {
				jQuery(document).unbind("mousedown", this._fSelectHandler);
				this._fSelectHandler = null;
			}
			Plugin.prototype.exit.apply(this, arguments);
		};
		
		
		function highlight(sId, oPlugin, bSend){
			if (sId) {
				var oElem = sap.ui.getCore().byId(sId);
				if (oElem) {
					var jPopupRef = jQuery.sap.byId(oPlugin._sPopupId);
					var jRef = oElem.$();
					if (jRef.is(":visible")) {
						jPopupRef.width(jRef.outerWidth());
						jPopupRef.height(jRef.outerHeight());
						oPlugin._oPopup.open(0, "BeginTop", "BeginTop", jRef[0], "0 0", "none");
						if (bSend) {
							sap.ui.core.support.Support.getStub().sendEvent(oPlugin.getId() + "Select", getElementDetailsForEvent(oElem, oPlugin));
						}
						setTimeout(function(){
							oPlugin._oPopup.close(0);
						}, 1000);
						return true;
					}
				}
			}
			return false;
		}
		
		
		function getElementDetailsForEvent(oElement, oPlugin){
			//TODO: to be extended
			return {"id": oElement.getId()};
		}
		
	

	return Selector;

});
