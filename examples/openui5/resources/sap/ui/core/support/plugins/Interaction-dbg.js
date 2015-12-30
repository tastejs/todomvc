/*!
 * UI development toolkit for HTML5 (OpenUI5)
 * (c) Copyright 2009-2015 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */

// Provides class sap.ui.core.support.plugins.Performance
sap.ui.define(['jquery.sap.global', 'sap/ui/core/support/Plugin'],
	function(jQuery, Plugin) {
	"use strict";





		/**
		 * Creates an instance of sap.ui.core.support.plugins.Interaction.
		 * @class This class represents the plugin for the support tool functionality of UI5. This class is internal and all its functions must not be used by an application.
		 *
		 * With this plugIn the performance measurements are displayed
		 *
		 * @abstract
		 * @extends sap.ui.base.Object
		 * @version 1.32.9
		 * @constructor
		 * @private
		 * @alias sap.ui.core.support.plugins.Interaction
		 */
		var Interaction = Plugin.extend("sap.ui.core.support.plugins.Interaction", {
			constructor : function(oSupportStub) {
				Plugin.apply(this, ["sapUiSupportInteraction", "Interaction", oSupportStub]);

				this._oStub = oSupportStub;

				if (this.isToolPlugin()) {

					this._aEventIds = [this.getId() + "SetMeasurements",
									   this.getId() + "SetActive"];
					jQuery.sap.require("sap.ui.core.format.DateFormat");
					var pad0 = function(i, w) {
						return ("000" + String(i)).slice(-w);
					};
					this._fnFormatTime = function(fNow) {
						var oNow = new Date(fNow),
							iMicroSeconds = Math.floor((fNow - Math.floor(fNow)) * 1000);
						return pad0(oNow.getHours(),2) + ":" + pad0(oNow.getMinutes(),2) + ":" + pad0(oNow.getSeconds(),2) + "." + pad0(oNow.getMilliseconds(),3) + pad0(iMicroSeconds,3);
					};
				} else {

					this._aEventIds = [this.getId() + "Refresh",
									   this.getId() + "Clear",
									   this.getId() + "Start",
									   this.getId() + "Stop",
									   this.getId() + "Activate"];

				}

			}
		});

		Interaction.prototype.init = function(oSupportStub){
			Plugin.prototype.init.apply(this, arguments);
			if (this.isToolPlugin()) {
				initInTools.call(this, oSupportStub);
			} else {
				initInApps.call(this, oSupportStub);
			}
		};

		Interaction.prototype.exit = function(oSupportStub){
			Plugin.prototype.exit.apply(this, arguments);
		};


		function initInTools(oSupportStub) {

			var rm = sap.ui.getCore().createRenderManager();
			rm.write("<div class=\"sapUiSupportToolbar\">");
			rm.write("<button id=\"" + this.getId() + "-refresh\" class=\"sapUiSupportBtn\">Refresh</button>");
			rm.write("<button id=\"" + this.getId() + "-clear\" class=\"sapUiSupportBtn\">Clear</button>");
	//		rm.write("<button id=\"" + this.getId() + "-start\" class=\"sapUiSupportBtn\">Start</button>");
	//		rm.write("<button id=\"" + this.getId() + "-end\" class=\"sapUiSupportBtn\">End</button>");
			rm.write("<input type=\"checkbox\" id=\"" + this.getId() + "-active\" class=\"sapUiSupportChB\">");
			rm.write("<label for=\"" + this.getId() + "-active\" class=\"sapUiSupportLabel\">Active</label>");
			rm.write("</div><div class=\"sapUiSupportInteractionCntnt\">");
			rm.write("<table id=\"" + this.getId() + "-tab\" width=\"100%\">");
			rm.write("<colgroup><col><col><col><col><col><col></colgroup>");
			rm.write("<thead style=\"text-align:left;\"><tr>");
			rm.write("<th>Component</th>");
			rm.write("<th>Trigger</th>");
			rm.write("<th>Type</th>");
			rm.write("<th>Start</th>");
			rm.write("<th>End</th>");
			rm.write("<th>Duration</th>");
			rm.write("<th>Requests</th>");
			rm.write("</tr></thead>");
			rm.write("<tbody id=\"" + this.getId() + "-tabBody\"></tbody>");
			rm.write("</table></div>");
			rm.flush(this.$().get(0));
			rm.destroy();

			this.$("refresh").click(jQuery.proxy(function(oEvent) {
				this._oStub.sendEvent(this.getId() + "Refresh");
			}, this));
			this.$("clear").click(jQuery.proxy(function(oEvent) {
				this._oStub.sendEvent(this.getId() + "Clear");
			}, this));
	/*		this.$("start").click(jQuery.proxy(function(oEvent) {
				this._oStub.sendEvent(this.getId() + "Start");
			}, this));
			this.$("end").click(jQuery.proxy(function(oEvent) {
				this._oStub.sendEvent(this.getId() + "End");
			}, this));
	*/
			this.$("active").click(jQuery.proxy(function(oEvent) {
				var bActive = false;
				if (this.$("active").prop("checked")) {
					bActive = true;
				}
				this._oStub.sendEvent(this.getId() + "Activate", {"active": bActive});
			}, this));

		}

		function initInApps(oSupportStub) {
			getPerformanceData.call(this);
		}

		function getPerformanceData(oSupportStub) {
			var bActive = jQuery.sap.interaction.getActive();
			var aMeasurements = [];

			if (bActive) {
				aMeasurements = jQuery.sap.measure.getAllInteractionMeasurements();
			}
			this._oStub.sendEvent(this.getId() + "SetMeasurements", {"measurements": aMeasurements});
			this._oStub.sendEvent(this.getId() + "SetActive", {"active": bActive});
		}

		/**
		 * Handler for sapUiSupportInteractionSetMeasurements event
		 *
		 * @param {sap.ui.base.Event} oEvent the event
		 * @private
		 */
		Interaction.prototype.onsapUiSupportInteractionSetMeasurements = function(oEvent) {

			var aMeasurements = oEvent.getParameter("measurements");
			var oTableBody = this.$("tabBody");
			var rm = sap.ui.getCore().createRenderManager();

			for ( var i = 0; i < aMeasurements.length; i++) {
				var oMeasurement = aMeasurements[i];
				rm.write("<tr>");
				rm.write("<td>" + oMeasurement.component + "</td>");
				rm.write("<td>" + oMeasurement.trigger + "</td>");
				rm.write("<td>" + oMeasurement.event + "</td>");
				rm.write("<td>" + this._fnFormatTime(oMeasurement.start) + "</td>");
				rm.write("<td>" + this._fnFormatTime(oMeasurement.end) + "</td>");
				rm.write("<td>" + oMeasurement.duration + "</td>");
				rm.write("<td>" + oMeasurement.requests.length + "</td>");
				rm.write("</tr>");
			}
			rm.flush(oTableBody[0]);
			rm.destroy();

		};

		/**
		 * Handler for sapUiSupportInteractionSetActive event
		 *
		 * @param {sap.ui.base.Event} oEvent the event
		 * @private
		 */
		Interaction.prototype.onsapUiSupportInteractionSetActive = function(oEvent) {

			var bActive = oEvent.getParameter("active");
			var oCheckBox = this.$("active");

			if (bActive) {
				oCheckBox.attr("checked", "checked");
			} else {
				oCheckBox.removeAttr("checked");
			}

		};

		/**
		 * Handler for sapUiSupportInteractionRefresh event
		 *
		 * @param {sap.ui.base.Event} oEvent the event
		 * @private
		 */
		Interaction.prototype.onsapUiSupportInteractionRefresh = function(oEvent) {

			getPerformanceData.call(this);

		};

		/**
		 * Handler for sapUiSupportInteractionClear event
		 *
		 * @param {sap.ui.base.Event} oEvent the event
		 * @private
		 */
		Interaction.prototype.onsapUiSupportInteractionClear = function(oEvent) {

			jQuery.sap.measure.clearInteractionMeasurements();
			this._oStub.sendEvent(this.getId() + "SetMeasurements", {"measurements":[]});

		};

		/**
		 * Handler for sapUiSupportInteractionStart event
		 *
		 * @param {sap.ui.base.Event} oEvent the event
		 * @private
		 */
		Interaction.prototype.onsapUiSupportInteractionStart = function(oEvent) {

			jQuery.sap.measure.start(this.getId() + "-perf","Measurement by support tool");

		};

		/**
		 * Handler for sapUiSupportInteractionEnd event
		 *
		 * @param {sap.ui.base.Event} oEvent the event
		 * @private
		 */
		Interaction.prototype.onsapUiSupportInteractionEnd = function(oEvent) {

			jQuery.sap.measure.end(this.getId() + "-perf");

		};

		/**
		 * Handler for sapUiSupportInteractionActivate event
		 *
		 * @param {sap.ui.base.Event} oEvent the event
		 * @private
		 */
		Interaction.prototype.onsapUiSupportInteractionActivate = function(oEvent) {

			var bActive = oEvent.getParameter("active");

			if (jQuery.sap.interaction.getActive() != bActive) {
				jQuery.sap.interaction.setActive(bActive);
			}

		};



	return Interaction;

});
