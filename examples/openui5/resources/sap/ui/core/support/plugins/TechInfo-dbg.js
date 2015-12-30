/*!
 * UI development toolkit for HTML5 (OpenUI5)
 * (c) Copyright 2009-2015 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */

// Provides class sap.ui.core.support.plugins.TechInfo (TechInfo support plugin)
sap.ui.define(['jquery.sap.global', 'sap/ui/core/support/Plugin', '../ToolsAPI', 'jquery.sap.encoder', 'jquery.sap.script'],
	function(jQuery, Plugin, ToolsAPI/* , jQuerySap, jQuerySap1 */) {
	"use strict";




		/**
		 * Creates an instance of sap.ui.core.support.plugins.TechInfo.
		 * @class This class represents the technical info plugin for the support tool functionality of UI5. This class is internal and all its functions must not be used by an application.
		 *
		 * @abstract
		 * @extends sap.ui.base.Object
		 * @version 1.32.9
		 * @constructor
		 * @private
		 * @alias sap.ui.core.support.plugins.TechInfo
		 */
		var TechInfo = Plugin.extend("sap.ui.core.support.plugins.TechInfo", {
			constructor : function(oSupportStub) {
				Plugin.apply(this, ["sapUiSupportTechInfo", "Technical Information", oSupportStub]);
				this._aEventIds = this.isToolPlugin() ? [
					this.getId() + "Data",
					this.getId() + "FinishedE2ETrace"
				] : [
					this.getId() + "ToggleDebug",
					this.getId() + "SetReboot",
					this.getId() + "Refresh",
					this.getId() + "StartE2ETrace",
					this.getId() + "ToggleStatistics"
				];

				if (this.isToolPlugin()) {
					this.e2eLogLevel = "medium";
					this.e2eTraceStarted = false;
				}

			}
		});


		/**
		 * Handler for sapUiSupportTechInfoData event
		 *
		 * @param {sap.ui.base.Event} oEvent the event
		 * @private
		 */
		TechInfo.prototype.onsapUiSupportTechInfoData = function(oEvent){
			var that = this;
			var oData = oEvent.getParameter("data");
			oData.modules.sort();
			this.e2eTraceStarted = oData["e2e-trace"].isStarted;
			var html = ["<div class='sapUiSupportToolbar'>",
						"<a href='javascript:void(0);' id='", that.getId(), "-Refresh' class='sapUiSupportLink'>Refresh</a>",
						"<div><div class='sapUiSupportTechInfoCntnt'>",
						"<table border='0' cellpadding='3'>"];
			line(html, true, true, "SAPUI5 Version", function(buffer){
				try {
					var oVersionInfo = sap.ui.getVersionInfo();
					var sVersion = "<a href='" + sap.ui.resource("", "sap-ui-version.json") + "' target='_blank' title='Open Version Info'>" + jQuery.sap.escapeHTML(oVersionInfo.version || "") + "</a>";
					buffer.push(sVersion, " (built at ", jQuery.sap.escapeHTML(oVersionInfo.buildTimestamp || ""), ", last change ", jQuery.sap.escapeHTML(oVersionInfo.scmRevision || ""), ")");
				} catch (ex) {
					buffer.push("not available");
				}
			});
			line(html, true, true, "Core Version", function(buffer){
				return oData.version + " (built at " + oData.build + ", last change " + oData.change + ")";
			});
			line(html, true, true, "User Agent", function(buffer){
				return oData.useragent + (oData.docmode ? ", Document Mode '" + oData.docmode + "'" : "");
			});
			line(html, true, true, "Debug Sources", function(buffer){
				buffer.push((oData.debug ? "ON" : "OFF"), "<a href='javascript:void(0);' id='", that.getId(), "-tggleDbgSrc' class='sapUiSupportLink'>Toggle</a>");
			});
			line(html, true, true, "Application", oData.appurl);
			multiline(html, true, true, "Configuration (bootstrap)", oData.bootconfig);
			multiline(html, true, true, "Configuration (computed)", oData.config);
			if (!jQuery.isEmptyObject(oData.libraries)) {
				multiline(html, true, true, "Libraries", oData.libraries);
			}
			multiline(html, true, true, "Loaded Libraries", oData.loadedLibraries);
			line(html, true, true, "Loaded Modules", function(buffer){
				jQuery.each(oData.modules, function(i,v){
					if (v.indexOf("sap.ui.core.support") < 0) {
						buffer.push("<span>", jQuery.sap.escapeHTML(v || ""), "</span>");
						if (i < oData.modules.length - 1) {
							buffer.push(", ");
						}
					}
				});
			});
			multiline(html, true, true, "URI Parameters", oData.uriparams);

			line(html, true, true, "E2E Trace", function(buffer) {
				buffer.push("<label class='sapUiSupportLabel'>Trace Level:</label>",
					"<select id='", that.getId(), "-logLevelE2ETrace' class='sapUiSupportTxtFld' style='margin-left:10px'>",
						"<option value='low'" + (that.e2eLogLevel === 'low' ? " selected" : "") + ">LOW</option>",
						"<option value='medium'" + (that.e2eLogLevel === 'medium' ? " selected" : "") + ">MEDIUM</option>",
						"<option value='high'" + (that.e2eLogLevel === 'hight' ? " selected" : "") + ">HIGH</option>",
					"</select>"
				);
				buffer.push("<button id='" + that.getId() + "-startE2ETrace' class='sapUiSupportBtn " +
						(oData["e2e-trace"].isStarted ? " active" : "") + "' style='margin-left: 10px;'>" + (oData["e2e-trace"].isStarted ? "Running..." : "Start") + "</button>");
				buffer.push("<div style='margin-top:5px'>");
				buffer.push("<label class='sapUiSupportLabel'>XML Output:</label>");
				buffer.push("<textarea id='" + that.getId() + "-outputE2ETrace' style='width:100%;height:50px;margin-top:5px;resize:none;box-sizing:border-box'></textarea>");
				buffer.push("</div>");
			});

			line(html, true, true, "SAP-statistics for oData calls", function(buffer){
				buffer.push((oData.statistics ? "ON" : "OFF"), "<a href='javascript:void(0);' id='", that.getId(), "-tggleStatistics' class='sapUiSupportLink'>Toggle</a>");
			});

			html.push("</table></div>");
			this.$().html(html.join(""));

			this.$("tggleDbgSrc").bind("click", function(){
				sap.ui.core.support.Support.getStub().sendEvent(that.getId() + "ToggleDebug", {});
			});
			this.$("Refresh").bind("click", function(){
				sap.ui.core.support.Support.getStub().sendEvent(that.getId() + "Refresh", {});
			});

			this.$("outputE2ETrace").bind("click", function() {
				this.focus();
				this.select();
			});

			this.$("tggleStatistics").bind("click", function(){
				sap.ui.core.support.Support.getStub().sendEvent(that.getId() + "ToggleStatistics", {});
			});

			this.$("startE2ETrace").bind("click", function() {
				if (!that.e2eTraceStarted) {
					that.e2eLogLevel = that.$("logLevelE2ETrace").val();
					that.$("startE2ETrace").addClass("active").text("Running...");
					that.$("outputE2ETrace").text("");
					sap.ui.core.support.Support.getStub().sendEvent(that.getId() + "StartE2ETrace", {
						level: that.e2eLogLevel
					});
					that.e2eTraceStarted = true;
				}
			});

			document.title = "SAPUI5 Diagnostics - " + oData.title;
		};


		/**
		 * Handler for sapUiSupportTechInfoToggleDebug event
		 *
		 * @param {sap.ui.base.Event} oEvent the event
		 * @private
		 */
		TechInfo.prototype.onsapUiSupportTechInfoToggleDebug = function(oEvent){
			jQuery.sap.debug(!jQuery.sap.debug());
			sendData(this);
		};

		/**
		 * Handler for sapUiSupportTechInfoSetReboot event, which sets the URL from which UI5 should be loaded on next restart of the application
		 *
		 * @param {sap.ui.base.Event} oEvent the event
		 * @private
		 */
		TechInfo.prototype.onsapUiSupportTechInfoSetReboot = function(oEvent) {
			jQuery.sap.setReboot(oEvent.getParameter("rebootUrl"));
		};

		/**
		 * Handler for sapUiSupportTechInfoStartE2ETrace event
		 *
		 * @param {sap.ui.base.Event} oEvent the event
		 * @private
		 */
		TechInfo.prototype.onsapUiSupportTechInfoStartE2ETrace = function(oEvent) {

			if (!jQuery.sap.isDeclared("sap.ui.core.support.trace.E2eTraceLib")) {
				jQuery.sap.require("sap.ui.core.support.trace.E2eTraceLib");
			}

			var that = this;

			sap.ui.core.support.trace.E2eTraceLib.start(oEvent.getParameter("level"), function(traceXml) {
				sap.ui.core.support.Support.getStub().sendEvent(that.getId() + "FinishedE2ETrace", {
					trace: traceXml
				});
			});
		};

		/**
		 * Handler for sapUiSupportTechInfoFinishedE2ETrace event
		 *
		 * @param {sap.ui.base.Event} oEvent the event
		 * @private
		 */
		TechInfo.prototype.onsapUiSupportTechInfoFinishedE2ETrace = function(oEvent) {
			this.$("startE2ETrace").removeClass("active").text("Start");
			this.$("outputE2ETrace").text(oEvent.getParameter("trace"));
			this.e2eTraceStarted = false;
		};

		/**
		 * Handler for sapUiSupportTechInfoRefresh event
		 *
		 * @param {sap.ui.base.Event} oEvent the event
		 * @private
		 */
		TechInfo.prototype.onsapUiSupportTechInfoRefresh = function(oEvent){
			sendData(this);
		};

		/**
		 * Handler for sapUiSupportTechInfoToggleStatistics event
		 *
		 * @param {sap.ui.base.Event} oEvent the event
		 * @private
		 */
		TechInfo.prototype.onsapUiSupportTechInfoToggleStatistics = function(oEvent){
			jQuery.sap.statistics(!jQuery.sap.statistics());
			sendData(this);
		};

		TechInfo.prototype.init = function(oSupportStub){
			Plugin.prototype.init.apply(this, arguments);
			if (!this.isToolPlugin()) {
				sendData(this);
				return;
			}

			this.$().html("No Information available");
		};


		function sendData(oPlugin){
			var oCfg = ToolsAPI.getFrameworkInformation();
			var oData = {
				version: oCfg.commonInformation.version,
				build: oCfg.commonInformation.buildTime,
				change: oCfg.commonInformation.lastChange,
				useragent: oCfg.commonInformation.userAgent,
				docmode: oCfg.commonInformation.documentMode,
				debug: oCfg.commonInformation.debugMode,
				bootconfig: oCfg.configurationBootstrap,
				config:  oCfg.configurationComputed,
				libraries: oCfg.libraries,
				loadedLibraries: oCfg.loadedLibraries,
				modules: oCfg.loadedModules,
				uriparams: oCfg.URLParameters,
				appurl: oCfg.commonInformation.applicationHREF,
				title: oCfg.commonInformation.documentTitle,
				statistics: oCfg.commonInformation.statistics
			};

			if (jQuery.sap.isDeclared("sap.ui.core.support.trace.E2eTraceLib")) {
				oData["e2e-trace"] = {
					isStarted: sap.ui.core.support.trace.E2eTraceLib.isStarted()
				};
			} else {
				oData["e2e-trace"] = {
					isStarted: false
				};
			}

			sap.ui.core.support.Support.getStub().sendEvent(oPlugin.getId() + "Data", { data: oData });
		}


		function line(buffer, right, border, label, content){
			buffer.push("<tr><td ", right ? "align='right' " : "", "valign='top'>", "<label class='sapUiSupportLabel'>", jQuery.sap.escapeHTML(label || ""), "</label></td><td",
					border ? " class='sapUiSupportTechInfoBorder'" : "", ">");
			var ctnt = content;
			if (jQuery.isFunction(content)) {
				ctnt = content(buffer);
			}
			buffer.push(jQuery.sap.escapeHTML(ctnt || ""));
			buffer.push("</td></tr>");
		}


		function multiline(buffer, right, border, label, content){
			line(buffer, right, border, label, function(buffer){
				buffer.push("<table border='0' cellspacing='0' cellpadding='3'>");
				jQuery.each(content, function(i,v){
					var val = "";
					if (v) {
						if (typeof (v) === "string" || typeof (v) === "string" || typeof (v) === "boolean") {
							val = v;
						} else if ((jQuery.isArray(v) || jQuery.isPlainObject(v)) && window.JSON) {
							val = window.JSON.stringify(v);
						}
					}
					line(buffer, false, false, i, "" + val);
				});
				buffer.push("</table>");
			});
		}




	return TechInfo;

});
