/*!
 * UI development toolkit for HTML5 (OpenUI5)
 * (c) Copyright 2009-2015 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */

sap.ui.define(['jquery.sap.global'],
	function (jQuery) {
		"use strict";


		/**
		 * <pre>
		 * <code>sap.m.Support</code> shows the technical information for SAPUI5 Mobile Applications.
		 * This technical information includes
		 *    * SAPUI5 Version
		 *    * User Agent
		 *    * Configurations (Bootstrap and Computed)
		 *    * URI parameters
		 *    * All loaded module names
		 *
		 * In order to show the device information, the user must follow the following gestures.
		 *    1 - Hold two finger for 3 seconds minimum.
		 *    2 - Tab with a third finger while holding the first two fingers.
		 *
		 * NOTE: This class is internal and all its functions must not be used by an application
		 *
		 * As <code>sap.m.Support</code> is a static class, a <code>jQuery.sap.require("sap.m.Support");</code>
		 * statement must be implicitly executed before the class is used.
		 *
		 *
		 * Enable Support:
		 * --------------------------------------------------
		 * //import library
		 * jQuery.sap.require("sap.m.Support");
		 *
		 * //By default after require, support is enabled but implicitly we can call
		 * sap.m.Support.on();
		 *
		 * Disable Support:
		 * --------------------------------------------------
		 * sap.m.Support.off();
		 * </pre>
		 *
		 * @author SAP SE
		 * @since 1.11.0
		 *
		 * @static
		 * @protected
		 * @name sap.m.Support
		 */
		var Support = (function ($, document) {

		var dialog, startTime, isEventRegistered, lastTouchUID;
		var timeDiff = 0;
		var minHoldTime = 3000; // 3s(3000ms) two-finger hold time
		var holdFingersNumber = 2; // two-fingers hold
		var maxFingersAllowed = 3; // two-fingers hold + 1-finger tab
		var releasedFingersNumber = 1,
			oData = {},
			e2eTraceConst = {
				btnStart : "startE2ETrace",
				selLevel : "logLevelE2ETrace",
				taContent : "outputE2ETrace",
				infoText : "Ent-to-End trace is running in the background." +
							" Navigate to the URL that you would like to trace." +
							" The result of the trace will be shown in dialog after the trace is terminated.",
				infoDuration : 5000 // 5 sec.
			},
			controlIDs = {
				dvLoadedLibs 	: "LoadedLibs",
				dvLoadedModules : "LoadedModules"
		};

		// copied from core
		function line(buffer, right, border, label, content) {
			buffer.push("<tr class='sapUiSelectable'><td class='sapUiSupportTechInfoBorder sapUiSelectable'><label class='sapUiSupportLabel sapUiSelectable'>", jQuery.sap.encodeHTML(label), "</label><br>");
			var ctnt = content;
			if ($.isFunction(content)) {
				ctnt = content(buffer) || "";
			}
			buffer.push($.sap.encodeHTML(ctnt));
			buffer.push("</td></tr>");
		}

		// copied from core
		function multiline(buffer, right, border, label, content) {
			line(buffer, right, border, label, function(buffer) {
				buffer.push("<table class='sapMSupportTable' border='0' cellspacing='5' cellpadding='5' width='100%'><tbody>");
				$.each(content, function(i, v) {
					var val = "";
					if (v !== undefined && v !== null) {
						if (typeof (v) == "string" || typeof (v) == "boolean" || ($.isArray(v) && v.length == 1)) {
							val = v;
						} else if (($.isArray(v) || $.isPlainObject(v)) && window.JSON) {
							val = window.JSON.stringify(v);
						}
					}
					line(buffer, false, false, i, "" + val);
				});
				buffer.push("</tbody></table>");
			});
		}

			// copied from core
			function getTechnicalContent(oFrameworkInformation) {
				oData = {
					version: oFrameworkInformation.commonInformation.version,
					build: oFrameworkInformation.commonInformation.buildTime,
					change: oFrameworkInformation.commonInformation.lastChange,
					useragent: oFrameworkInformation.commonInformation.userAgent,
					docmode: oFrameworkInformation.commonInformation.documentMode,
					debug: oFrameworkInformation.commonInformation.debugMode,
					bootconfig: oFrameworkInformation.configurationBootstrap,
					config: oFrameworkInformation.configurationComputed,
					loadedlibs: oFrameworkInformation.loadedLibraries,
					modules: oFrameworkInformation.loadedModules,
					uriparams: oFrameworkInformation.URLParameters,
					appurl: oFrameworkInformation.commonInformation.applicationHREF
				};

			var html = ["<table class='sapUiSelectable' border='0' cellspacing='5' cellpadding='5' width='100%'><tbody class='sapUiSelectable'>"];
			line(html, true, true, "SAPUI5 Version", function(buffer) {
				buffer.push(oData.version, " (built at ", oData.build, ", last change ", oData.change, ")");
			});
			line(html, true, true, "User Agent", function(buffer) {
				buffer.push(oData.useragent, (oData.docmode ? ", Document Mode '" + oData.docmode + "'" : ""));
			});
			line(html, true, true, "Debug Sources", function(buffer) {
				buffer.push((oData.debug ? "ON" : "OFF") );
			});
			line(html, true, true, "Application", oData.appurl);
			multiline(html, true, true, "Configuration (bootstrap)", oData.bootconfig);
			multiline(html, true, true, "Configuration (computed)", oData.config);
			multiline(html, true, true, "URI Parameters", oData.uriparams);
			// e2e trace section
			line(html, true, true, "End-to-End Trace", function(buffer) {
				buffer.push("<label class='sapUiSupportLabel'>Trace Level:</label>",
					"<select id='" + buildControlId(e2eTraceConst.selLevel) + "' class='sapUiSupportTxtFld' >",
						"<option value='low'>LOW</option>",
						"<option value='medium' selected>MEDIUM</option>",
						"<option value='high'>HIGH</option>",
					"</select>"
				);
				buffer.push("<button id='" + buildControlId(e2eTraceConst.btnStart) + "' class='sapUiSupportBtn'>Start</button>");
				buffer.push("<div class='sapUiSupportDiv'>");
				buffer.push("<label class='sapUiSupportLabel'>XML Output:</label>");
				buffer.push("<textarea id='" + buildControlId(e2eTraceConst.taContent) +  "' class='sapUiSupportTxtArea sapUiSelectable' readonly ></textarea>");
				buffer.push("</div>");
			});

			line(html, true, true, "Loaded Libraries", function(buffer) {
				buffer.push("<ul class='sapUiSelectable'>");
				$.each(oData.loadedlibs, function(i, v) {
		            if (v && (typeof (v) === "string" || typeof (v) === "boolean")) {
	                     buffer.push("<li class='sapUiSelectable'>", i + " " + v, "</li>");
		            }
				});
				buffer.push("</ul>");
			});

			line(html, true, true, "Loaded Modules", function(buffer) {
				buffer.push("<div class='sapUiSupportDiv sapUiSelectable' id='" + buildControlId(controlIDs.dvLoadedModules) + "' />");
			});

			html.push("</tbody></table>");

			return new sap.ui.core.HTML({
				content : html.join("").replace(/\{/g, "&#123;").replace(/\}/g, "&#125;")
			});
		}

		function buildControlId(controlId) {
			return dialog.getId() + "-" + controlId;
		}

		function fillPanelContent(panelId, arContent) {

			var panelHeader = "Modules";
			var libsCount = 0, arDivContent = [];

			libsCount = arContent.length;
			$.each(arContent.sort(), function(i, module) {
				arDivContent.push(new sap.m.Label({ text : " - " + module }).addStyleClass("sapUiSupportPnlLbl"));
			});

			// insert content into div placeholders
			var objPanel = new sap.m.Panel({
				expandable : true,
				expanded : false,
				headerToolbar : new sap.m.Toolbar({
					design : sap.m.ToolbarDesign.Transparent,
					content : [new sap.m.Label({
						text : panelHeader + " (" + libsCount + ")",
						design : sap.m.LabelDesign.Bold
					})]
				}),
				content : arDivContent
			});

			objPanel.placeAt( buildControlId(panelId), "only");
		}

		// setup dialog elements and bind some events
		function setupDialog() {
			// setup e2e values as log level and content
			if (dialog.traceXml) {
				dialog.$(e2eTraceConst.taContent).text(dialog.traceXml);
			}
			if (dialog.e2eLogLevel) {
				dialog.$(e2eTraceConst.selLevel).val(dialog.e2eLogLevel);
			}

			fillPanelContent(controlIDs.dvLoadedModules, oData.modules);


			// bind button Start event
			dialog.$(e2eTraceConst.btnStart).one("tap", function() {

				dialog.e2eLogLevel = dialog.$(e2eTraceConst.selLevel).val();
				dialog.$(e2eTraceConst.btnStart).addClass("sapUiSupportRunningTrace").text("Running...");
				dialog.traceXml = "";
				dialog.$(e2eTraceConst.taContent).text("");

				sap.ui.core.support.trace.E2eTraceLib.start(dialog.e2eLogLevel, function(traceXml) {
					dialog.traceXml = traceXml;
				});

				// show info message about the E2E trace activation
				sap.m.MessageToast.show(e2eTraceConst.infoText, {duration: e2eTraceConst.infoDuration});

				//close the dialog, but keep it for later use
				dialog.close();
			});
		}

		// get or create dialog instance and return
		function getDialog() {
			if (dialog) {
				return dialog;
			}

			$.sap.require("sap.m.Dialog");
			$.sap.require("sap.m.Button");
			$.sap.require("sap.ui.core.HTML");
			$.sap.require("sap.m.MessageToast");
			$.sap.require("sap.ui.core.support.trace.E2eTraceLib");

			dialog = new sap.m.Dialog({
				title : "Technical Information",
				horizontalScrolling: true,
				verticalScrolling: true,
				stretch: jQuery.device.is.phone,
				leftButton : new sap.m.Button({
					text : "Close",
					press : function() {
						dialog.close();
					}
				}),
				afterOpen : function() {
					Support.off();
				},
				afterClose : function() {
					Support.on();
				}
			}).addStyleClass("sapMSupport");

			return dialog;
		}



		//function is triggered when a touch is detected
		function onTouchStart(oEvent) {
			if (oEvent.touches) {
				var currentTouches = oEvent.touches.length;

				if (currentTouches > maxFingersAllowed) {
					document.removeEventListener('touchend', onTouchEnd);
					return;
				}

				switch (currentTouches) {

					case holdFingersNumber:
						startTime = Date.now();
						document.addEventListener('touchend', onTouchEnd);
						break;

					case maxFingersAllowed:
						if (startTime) {
							timeDiff = Date.now() - startTime;
							lastTouchUID = oEvent.touches[currentTouches - 1].identifier;
						}
						break;
				}
			}
		}

		//function is triggered when a touch is removed e.g. the user’s finger is removed from the touchscreen.
		function onTouchEnd(oEvent) {
			document.removeEventListener('touchend', onTouchEnd);

			// Check if two fingers are holded for 3 seconds or more and after that it`s tapped with a third finger
			if (timeDiff > minHoldTime
					&& oEvent.touches.length === holdFingersNumber
					&& oEvent.changedTouches.length === releasedFingersNumber
					&& oEvent.changedTouches[0].identifier === lastTouchUID) {

						timeDiff = 0;
						startTime = 0;
						show();
			}
		}

			function show() {
				sap.ui.require(['sap/ui/core/support/ToolsAPI'], function (ToolsAPI) {
					var container = getDialog();
					container.removeAllAggregation("content");
					container.addAggregation("content", getTechnicalContent(ToolsAPI.getFrameworkInformation()));

					dialog.open();
					setupDialog();
				});
			}

		return ({
			/**
			 * Enables support.
			 *
			 * @returns {sap.m.Support} this to allow method chaining
			 * @protected
			 * @name sap.m.Support.on
			 * @function
			 */
			on : function() {
				if (!isEventRegistered && "ontouchstart" in document) {
					isEventRegistered = true;
					document.addEventListener("touchstart", onTouchStart);
				}
				return this;
			},

			/**
			 * Disables support.
			 *
			 * @returns {sap.m.Support} this to allow method chaining
			 * @protected
			 * @name sap.m.Support.off
			 * @function
			 */
			off : function() {
				if (isEventRegistered) {
					isEventRegistered = false;
					document.removeEventListener("touchstart", onTouchStart);
				}
				return this;
			},

			open : function() {
				show();
			},

			/**
			 * Returns if event is registered or not.
			 *
			 * @returns {boolean}
			 * @protected
			 * @name sap.m.Support.isEventRegistered
			 * @function
			 */
			isEventRegistered : function() {
				return isEventRegistered;
			}
		}).on();

	}(jQuery, document));


	return Support;

}, /* bExport= */ true);
