/*!
 * UI development toolkit for HTML5 (OpenUI5)
 * (c) Copyright 2009-2015 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */

// Provides class sap.ui.core.support.plugins.Trace (Trace support plugin)
sap.ui.define(['jquery.sap.global', 'sap/ui/core/support/Plugin'],
	function(jQuery, Plugin) {
	"use strict";


	
	
	
		/**
		 * Creates an instance of sap.ui.core.support.plugins.Trace.
		 * @class This class represents the trace plugin for the support tool functionality of UI5. This class is internal and all its functions must not be used by an application.
		 *
		 * @abstract
		 * @extends sap.ui.base.Object
		 * @version 1.32.9
		 * @constructor
		 * @private
		 * @alias sap.ui.core.support.plugins.Trace
		 */
		var Trace = Plugin.extend("sap.ui.core.support.plugins.Trace", {
			constructor : function(oSupportStub) {
				Plugin.apply(this, ["sapUiSupportTrace", "JavaScript Trace", oSupportStub]);
		
				this._aEventIds = this.isToolPlugin() ? [this.getId() + "Entry"] : [];
				
				if (this.isToolPlugin()) {
					this._aLogEntries = [];
					this._iLogLevel = jQuery.sap.log.Level.ALL;
					jQuery.sap.require("sap.ui.core.format.DateFormat");
					this._oDateFormat = sap.ui.core.format.DateFormat.getDateTimeInstance();
				} else {
					var that = this;
					this._oldLogLevel = jQuery.sap.log.getLevel();
					jQuery.sap.log.setLevel(jQuery.sap.log.Level.ALL);
					jQuery.sap.log.addLogListener({
						onLogEntry: function(oLogEntry){
							if (that.isActive()) {
								oSupportStub.sendEvent(that.getId() + "Entry", {"entry": oLogEntry});
							}
						}
					});
				}
			}
		});
		
		
		/**
		 * Handler for sapUiSupportTraceEntry event
		 * 
		 * @param {sap.ui.base.Event} oEvent the event
		 * @private
		 */
		Trace.prototype.onsapUiSupportTraceEntry = function(oEvent){
			log(this, oEvent.getParameter("entry"));
		};
		
		
		Trace.prototype.init = function(oSupportStub){
			Plugin.prototype.init.apply(this, arguments);
			if (!this.isToolPlugin()) {
				return;
			}
			
			var that = this;
			
			var rm = sap.ui.getCore().createRenderManager();
			rm.write("<div class='sapUiSupportToolbar'>");
			rm.write("<button id='" + this.getId() + "-clear' class='sapUiSupportBtn'>Clear</button>");
			rm.write("<label class='sapUiSupportLabel'>Filter:</label><input type='text' id='" + this.getId() + "-filter' class='sapUiSupportTxtFld'></input>");
			rm.write("<label class='sapUiSupportLabel'>Log Level:</label><select id='" + this.getId() + "-loglevel' class='sapUiSupportTxtFld'>");
			rm.write("<option value='0'>FATAL</option>");
			rm.write("<option value='1'>ERROR</option>");
			rm.write("<option value='2'>WARNING</option>");
			rm.write("<option value='3'>INFO</option>");
			rm.write("<option value='4'>DEBUG</option>");
			rm.write("<option value='5'>TRACE</option>");
			rm.write("<option value='6' selected=''>ALL</option>");
			rm.write("</select>");
			rm.write("</div><div class='sapUiSupportTraceCntnt'></div>");
			rm.flush(this.$().get(0));
			rm.destroy();
			
			this._fClearHandler = function(){
				log(that);
			};
			
			this._fLogLevelHandler = function(){
				that._iLogLevel = that.$("loglevel").val();
				var aResult = [];
				for (var i = 0; i < that._aLogEntries.length; i++) {
					if (applyFilter(that._filter, that._iLogLevel, that._aLogEntries[i])) {
						aResult.push(getEntryHTML(that, that._aLogEntries[i]));
					}
				}
				log(that, aResult.join(""));
			};
			
			this._fFilterHandler = function(){
				that._filter = that.$("filter").val();
				that._filter = that._filter ? that._filter.toLowerCase() : "";
				var aResult = [];
				for (var i = 0; i < that._aLogEntries.length; i++) {
					if (applyFilter(that._filter, that._iLogLevel, that._aLogEntries[i])) {
						aResult.push(getEntryHTML(that, that._aLogEntries[i]));
					}
				}
				log(that, aResult.join(""));
			};
			
			this.$("clear").bind("click", this._fClearHandler);
			this.$("filter").bind("change", this._fFilterHandler);
			this.$("loglevel").bind("change", this._fLogLevelHandler);
		};
		
		
		Trace.prototype.exit = function(oSupportStub){
			if (this.isToolPlugin()) {
				if (this._fClearHandler) {
					this.$("clear").unbind("click", this._fClearHandler);
					this._fClearHandler = null;
				}
				if (this._fFilterHandler) {
					this.$("filter").unbind("change", this._fFilterHandler);
					this._fFilterHandler = null;
				}
				if (this._fLogLevelHandler) {
					this.$("loglevel").unbind("change", this._fLogLevelHandler);
					this._fLogLevelHandler = null;
				}
			} else {
				jQuery.sap.log.setLevel(this._oldLogLevel);
				this._oldLogLevel = null;
			}
			Plugin.prototype.exit.apply(this, arguments);
		};
		
		
		function log(oPlugin, oEntry){
			var jContentRef = jQuery(".sapUiSupportTraceCntnt", oPlugin.$());
			if (!oEntry) {
				jContentRef.html("");
				oPlugin._aLogEntries = [];
			} else if (typeof (oEntry) === "string") {
				jContentRef.html(oEntry);
				jContentRef[0].scrollTop = jContentRef[0].scrollHeight;
			} else {
				oEntry._levelInfo = getLevel(oEntry.level);
				if (applyFilter(oPlugin._filter, oPlugin._iLogLevel, oEntry)) {
					jContentRef.append(getEntryHTML(oPlugin, oEntry));
					jContentRef[0].scrollTop = jContentRef[0].scrollHeight;
				}
				oPlugin._aLogEntries.push(oEntry);
			}
		}
		
		
		function getEntryHTML(oPlugin, oEntry){
			var aLevelInfo = oEntry._levelInfo;
			var sStyle = " style='color:" + aLevelInfo[1] + ";'";
			var sResult = "<div class='sapUiSupportTraceEntry'><span class='sapUiSupportTraceEntryLevel'" + sStyle + ">" + aLevelInfo[0] +
					"</span><span class='sapUiSupportTraceEntryTime'" + sStyle + ">" + oPlugin._oDateFormat.format(new Date(oEntry.timestamp)) +
					"</span><span class='sapUiSupportTraceEntryMessage'>" + jQuery.sap.escapeHTML(oEntry.message || "") + "</div>";
			return sResult;
		}
		
		
		function applyFilter(sFilterValue, iLogLevel, oEntry){
			var aLevelInfo = oEntry._levelInfo;
			if (oEntry._levelInfo[2] <= iLogLevel) {
				if (sFilterValue) {
					var aParts = sFilterValue.split(" ");
					var bResult = true;
					for (var i = 0; i < aParts.length; i++) {
						bResult = bResult && oEntry.message.toLowerCase().indexOf(aParts[i]) >= 0 || aLevelInfo[0].toLowerCase().indexOf(aParts[i]) >= 0;
					}
					return bResult;
				}
				return true;
			}
			return false;
		}
		
		
		function getLevel(iLogLevel){
			switch (iLogLevel) {
				case jQuery.sap.log.Level.FATAL:
					return ["FATAL", "#E60000", iLogLevel];
				case jQuery.sap.log.Level.ERROR:
					return ["ERROR", "#E60000", iLogLevel];
				case jQuery.sap.log.Level.WARNING:
					return ["WARNING", "#FFAA00", iLogLevel];
				case jQuery.sap.log.Level.INFO:
					return ["INFO", "#000000", iLogLevel];
				case jQuery.sap.log.Level.DEBUG:
					return ["DEBUG", "#000000", iLogLevel];
				case jQuery.sap.log.Level.TRACE:
					return ["TRACE", "#000000", iLogLevel];
			}
			return ["unknown", "#000000", iLogLevel];
		}
	
	

	return Trace;

});
