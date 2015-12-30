/*!
 * UI development toolkit for HTML5 (OpenUI5)
 * (c) Copyright 2009-2015 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */

// Provides class sap.ui.core.support.plugins.MessageTest (Test  plugin for support tool communication)
sap.ui.define(['jquery.sap.global', 'sap/ui/core/support/Plugin'],
	function(jQuery, Plugin) {
	"use strict";


	
	
	
		/**
		 * Creates an instance of sap.ui.core.support.plugins.MessageTest.
		 * @class This class represents the plugin for the support tool functionality of UI5. This class is internal and all its functions must not be used by an application.
		 *
		 * This class is only for testing purposes for support tool communication.
		 *
		 * @abstract
		 * @extends sap.ui.base.Object
		 * @version 1.32.9
		 * @constructor
		 * @private
		 * @alias sap.ui.core.support.plugins.MessageTest
		 */
		var MessageTest = Plugin.extend("sap.ui.core.support.plugins.MessageTest", {
			constructor : function(oSupportStub) {
				Plugin.apply(this, ["sapUiSupportMessageTest", "Support Tool Communication Test", oSupportStub]);
				
				this._aEventIds = [this.getId() + "Msg", sap.ui.core.support.Support.EventType.SETUP, sap.ui.core.support.Support.EventType.TEAR_DOWN];
				this._bFirstTime = true;
			}
		});
		
		
		/**
		 * Handler for sapUiSupportMessageTestMsg event
		 * 
		 * @param {sap.ui.base.Event} oEvent the event
		 * @private
		 */
		MessageTest.prototype.onsapUiSupportMessageTestMsg = function(oEvent){
			this.$("Panel").removeClass("sapUiSupportHidden"); //Make panel visible with the first event
			report(this, this.getId() + "Msg", oEvent.getParameter("message"), true);
		};
		
		
		MessageTest.prototype.init = function(oSupportStub){
			Plugin.prototype.init.apply(this, arguments);
			var that = this;
			
			if (this._bFirstTime) {
				this._bFirstTime = false;
				this.$("Panel").addClass("sapUiSupportHidden"); //Initially hide panel
			}
			
			var rm = sap.ui.getCore().createRenderManager();
			rm.write("<div class='sapUiSupportToolbar'>");
			rm.write("<input type='text' id='" + this.getId() + "-input' class='sapUiSupportTxtFld'></input>");
			rm.write("<button id='" + this.getId() + "-send' class='sapUiSupportBtn'>Send</button>");
			rm.write("</div><div class='sapUiSupportMessageCntnt'></div>");
			rm.flush(this.$().get(0));
			rm.destroy();
			
			this._fSendHandler = function(){
				var sVal = that.$("input").val();
				oSupportStub.sendEvent(that.getId() + "Msg", {"message": sVal});
				report(that, that.getId() + "Msg", sVal, false);
			};
			
			this.$("send").bind("click", this._fSendHandler);
			report(this, sap.ui.core.support.Support.EventType.SETUP, "", true);
		};
		
		
		MessageTest.prototype.exit = function(oSupportStub){
			report(this, sap.ui.core.support.Support.EventType.TEAR_DOWN, "", true);
			if (this._fSendHandler) {
				this.$("send").unbind("click", this._fSendHandler);
				this._fSendHandler = null;
			}
			Plugin.prototype.exit.apply(this, arguments);
		};
	
		
		function report(oPlugin, sMessageId, sMessage, bReceive){
			jQuery(".sapUiSupportMessageCntnt", oPlugin.$()).append("<b style=\"color:" + (bReceive ? "green" : "blue") + ";\">Message '" + sMessageId + "' " + (bReceive ? "received" : "send") +
					(sMessage ? ":</b> " + jQuery.sap.escapeHTML(sMessage) : "</b>") + "<br>");
		}
	
	
	

	return MessageTest;

});
