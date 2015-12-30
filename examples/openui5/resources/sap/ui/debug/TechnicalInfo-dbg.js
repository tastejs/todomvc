/*!
 * UI development toolkit for HTML5 (OpenUI5)
 * (c) Copyright 2009-2015 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */

// Provides a popup with technical informations about the running SAPUI5 core
sap.ui.define('sap/ui/debug/TechnicalInfo', ['jquery.sap.global', 'sap/ui/Device', 'sap/ui/core/Popup', 'jquery.sap.strings'],
	function(jQuery, Device, Popup/* , jQuerySap */) {
	"use strict";

	/*global alert */

	var TechnicalInfo = {

		open : function(callback) {

			function serialize(o) {
				if (o && window.JSON) {
					return window.JSON.stringify(o);
				}
				if ( o === "" ) {
					return '""';
				}
				return "" + o + (o ? "???" : "");
			}

			function list(o,prefix) {
				prefix = prefix || '';
				if ( !prefix ) {
					html.push("<table border='0' cellspacing='0' cellpadding='0'>");
				}
				jQuery.each(o, function(i,v) {
					if ( !v || typeof v === 'string' || typeof v === 'number' || v instanceof Date ) {
						html.push("<tr><td>", prefix, "<b>", jQuery.sap.encodeHTML(serialize(i)), "</b></td><td>", jQuery.sap.encodeHTML(serialize(v)), "</td></tr>");
					} else {
						html.push("<tr><td>", prefix, "<b>", jQuery.sap.encodeHTML(serialize(i)), "</b></td><td></td></tr>");
						list(v, prefix + "&nbsp;&nbsp;");
					}
				});
				if ( !prefix) {
					html.push("</table>");
				}
			}

			if ( this._oPopup && this._oPopup.isOpen() ) {
				return;
			}

			var ojQSData = this._ojQSData = callback() || {};

			var bCT = false,bLV = false,bEmbedded = true;
			if ( jQuery.sap.getObject("sap.ui.debug.DebugEnv") ) {
				bCT = sap.ui.debug.DebugEnv.getInstance().isControlTreeShown();
				bLV = sap.ui.debug.DebugEnv.getInstance().isTraceWindowShown();
				bEmbedded = sap.ui.debug.DebugEnv.getInstance().isRunningEmbedded();
			}
			var sDCUrl = "/sapui5-internal/download/index.jsp";
			var bDC = jQuery.sap.syncHead(sDCUrl);
			var sOUUrl = "/sapui5-sdk-dist/optimize-module-set";
			var bOU = jQuery.sap.syncHead(sOUUrl);
			if ( !bOU ) {
				sOUUrl = "/demokit/optimize-module-set";
				bOU = jQuery.sap.syncHead(sOUUrl);
			}
			var bUseDbgSrc = jQuery.sap.debug();
			var bUseStatistics = jQuery.sap.statistics();
			var sWeinreId = jQuery.sap.uid();
			var sWeinreClientUrl = sap.ui.getCore().getConfiguration().getWeinreServer() + "/client/#" + sWeinreId;
			var html = [];
			html.push("<div id='sap-ui-techinfo' class='sapUiTInf sapUiDlg' style='width:640px; position: relative;'>");
			html.push("<table border='0' cellpadding='3'>");
			try {
				var oVersionInfo = sap.ui.getVersionInfo();
				var sVersion = "<a href='" + sap.ui.resource("", "sap-ui-version.json") + "' target='_blank' title='Open Version Info'>" + oVersionInfo.version + "</a>";
				html.push("<tr><td align='right' valign='top'><b>SAPUI5 Version</b></td><td>", sVersion, " (built at ", oVersionInfo.buildTimestamp, ", last change ", oVersionInfo.scmRevision, ")</td></tr>");
			} catch (ex) {
				html.push("<tr><td align='right' valign='top'><b>SAPUI5 Version</b></td><td>not available</td></tr>");
			}
			html.push("<tr><td align='right' valign='top'><b>Core Version</b></td><td>", sap.ui.version, " (built at ", sap.ui.buildinfo.buildtime, ", last change ", sap.ui.buildinfo.lastchange, ")</td></tr>");
			html.push("<tr><td align='right' valign='top'><b>User Agent</b></td><td>", jQuery.sap.encodeHTML(navigator.userAgent), (document.documentMode ? ", Document Mode '" + document.documentMode + "'" : ""), "</td></tr>");
			html.push("<tr><td align='right' valign='top'><b>Configuration</b></td><td><div class='sapUiTInfCfg'>");
			list(ojQSData.config);
			html.push("</div></td></tr>");
			html.push("<tr><td align='right' valign='top'><b>Loaded Modules</b></td><td><div id='sap-ui-techinfo-modules' class='sapUiTInfMList'>");
			this._renderModules(html, 20);
			html.push("</div></td></tr>");
			if ( bDC ) {
				html.push("<tr><td></td><td><a id=\"sap-ui-techinfo-customModule\" href=\"" + sDCUrl + "\">Create Custom Bootstrap Module</a></td></tr>");
			}
			if ( bOU ) {
				html.push("<tr><td></td><td><a id=\"sap-ui-techinfo-optimizeModuleSet\" href=\"" + sOUUrl + "\">Calculate Optimized Module Set URL</a></td></tr>");
			}
			html.push("<tr><td align='right' valign='top' rowSpan='7'><b>Debug Tools</b></td>", "<td><input id='sap-ui-techinfo-useDbgSources' type='checkbox'",
					bUseDbgSrc ? " checked='checked'" : "",
					"><span ",
					">Use Debug Sources (reload)</span></input></td></tr>");
			html.push("<tr><td>Boot app with different UI5 version on next reload:</td></tr>");
			html.push("<tr><td style='padding-left: 2rem'><select id='sap-ui-techinfo-reboot-select' style='width: 100%;'>",
					"<option value='none'>Disabled (no custom reboot URL)</option>",
					"<option value='other' id='sap-ui-techinfo-reboot-other'>Other (enter URL to sap-ui-core.js below):</option>",
					"</select></td></tr>");
			html.push("<tr><td style='padding-left: 2rem'><input type='text' id='sap-ui-techinfo-reboot-input' style='width: 357px;' disabled='disabled'/>",
					"<button id='sap-ui-techinfo-reboot'>Activate Reboot URL</button></td></tr>");
			html.push("<tr><td><input id='sap-ui-techinfo-showControls' type='checkbox'",
					bCT ? " checked='checked'" : "",
					bEmbedded ? "" : " readonly='readonly'",
					"><span ",
					bEmbedded ? "" : " style='color:grey'",
					">Show UIAreas, Controls and Properties</span></input></td></tr>");
			html.push("<tr><td><input id='sap-ui-techinfo-showLogViewer' type='checkbox' ",
					bLV ? " checked='checked'" : "",
					bEmbedded ? "" : " readonly='readonly' style='color:grey'",
					"><span ",
					bEmbedded ? "" : " style='color:grey'",
					">Show Log Viewer</span></input></td></tr>");
			html.push("<tr><td><input id='sap-ui-techinfo-useStatistics' type='checkbox' ",
					bUseStatistics ? " checked='checked'" : "",
					"><span ",
					">Enable SAP-statistics for oData calls</span></input></td></tr>");
			html.push("<tr><td colspan='2' align='center' valign='bottom' height='40'><button id='sap-ui-techinfo-close' class='sapUiBtn sapUiBtnS sapUiBtnNorm sapUiBtnStd'>Close</button></td></tr>");
			html.push("</table>");
			if ( bDC ) {
				html.push("<form id=\"sap-ui-techinfo-submit\" target=\"_blank\" method=\"post\" action=\"" + sDCUrl + "\">");
				html.push("<input type=\"hidden\" name=\"modules\"/>");
				html.push("</form>");
			}
			if ( bOU ) {
				html.push("<form id=\"sap-ui-techinfo-optimize-submit\" target=\"_blank\" method=\"post\" action=\"" + sOUUrl + "\">");
				html.push("<input type=\"hidden\" name=\"version\"/>");
				html.push("<input type=\"hidden\" name=\"libs\"/>");
				html.push("<input type=\"hidden\" name=\"modules\"/>");
				html.push("</form>");
			}
			if (sap.ui.getCore().getConfiguration().getRTL()) {
				html.push("<div style='position: absolute; bottom: 5px; left: 5px; text-align: left'>");
			} else {
				html.push("<div style='position: absolute; bottom: 5px; right: 5px; text-align: right'>");
			}
			html.push("<canvas id='sap-ui-techinfo-qrcode' width='0' height='0'></canvas>");
			html.push("<br><a id='sap-ui-techinfo-weinre' href=\"" + sWeinreClientUrl + "\" target=\"_blank\">Remote Web Inspector</a>");
			html.push("</div></div>");
			this._$Ref = jQuery(html.join(""));
			this._$Ref.find('#sap-ui-techinfo-useDbgSources').click(jQuery.proxy(this.onUseDbgSources, this));
			this._$Ref.find('#sap-ui-techinfo-reboot').click(jQuery.proxy(this.onUseOtherUI5Version, this));
			this._$Ref.find('#sap-ui-techinfo-reboot-select').on("change", this.onUI5VersionDropdownChanged);
			this._$Ref.find('#sap-ui-techinfo-showControls').click(jQuery.proxy(this.onShowControls, this));
			this._$Ref.find('#sap-ui-techinfo-showLogViewer').click(jQuery.proxy(this.onShowLogViewer, this));
			this._$Ref.find('#sap-ui-techinfo-more').click(jQuery.proxy(this.onShowAllModules, this));
			this._$Ref.find('#sap-ui-techinfo-close').click(jQuery.proxy(this.close, this));
			this._$Ref.find('#sap-ui-techinfo-customModule').click(jQuery.proxy(this.onCreateCustomModule, this));
			this._$Ref.find('#sap-ui-techinfo-optimizeModuleSet').click(jQuery.proxy(this.onOptimizeModuleSet, this));
			this._$Ref.find('#sap-ui-techinfo-weinre').click(jQuery.proxy(this.onOpenWebInspector, this));
			this._$Ref.find('#sap-ui-techinfo-useStatistics').click(jQuery.proxy(this.onUseStatistics, this));
			this._oPopup = new Popup(this._$Ref.get(0), /*modal*/true, /*shadow*/true, /*autoClose*/false);
			var bValidBrowser = !Device.browser.internet_explorer || !!Device.browser.internet_explorer && Device.browser.version > 8;
			var bDevAvailable = bValidBrowser && jQuery.sap.sjax({type: "HEAD", url: sap.ui.resource("sap.ui.dev", "library.js")}).success;
			if (bDevAvailable) {
				this._oPopup.attachOpened(function(oEvent) {
					// since the log, control tree and property list are using
					// the z-index 999999 the popup needs a higher z-index to
					// be able to click on the technical info.
					this._$().css("z-index", "1000000");
					// add the QR code when the control is available
					jQuery.sap.require("sap.ui.dev.qrcode.QRCode");
					if (sap.ui.dev.qrcode.QRCode._renderQRCode) {
						var sAbsUrl = window.location.href,
							sWeinreTargetUrl = sAbsUrl + (sAbsUrl.indexOf("?") > 0 ? "&" : "?") + "sap-ui-weinreId=" + sWeinreId;
						sap.ui.dev.qrcode.QRCode._renderQRCode(jQuery.sap.domById("sap-ui-techinfo-qrcode"), sWeinreTargetUrl);
					}
				});
			}
			this._oPopup.open(400);
			this.populateRebootUrls();
		},

		close : function() {
			this._oPopup.destroy();
			this._oPopup = undefined;
			this._$Ref.remove();
			this._$Ref = undefined;
			this._ojQSData = undefined;
		},

		_renderModules : function(html, iLimit) {
			var CLASS_4_MOD_STATE = {
					"5"  : " sapUiTInfMFail"  // FAILED
			};
			var modules = this._ojQSData.modules;
			var modnames = [];
			jQuery.each(modules, function(sName,oModule) {
				if ( oModule.state > 0 ) {
					modnames.push(sName);
				}
			});
			modnames.sort();
			var iMore = (iLimit && modnames.length > iLimit) ? modnames.length - iLimit : 0;
			if ( iMore ) {
				modnames.sort(function(a,b) {
					if ( a === b ) {
						return 0;
					}
					var ia = modules[a].url ? 1 : 0;
					var ib = modules[b].url ? 1 : 0;
					if ( ia != ib ) {
						return ib - ia;
					}
					return a < b ? -1 : 1;
				});
				modnames = modnames.slice(0, iLimit);
			}
			jQuery.each(modnames, function(i,v) {
				var mod = modules[v];
				html.push("<span",
						" title='", mod.url ? jQuery.sap.encodeHTML(mod.url) : ("embedded in " + mod.parent), "'",
						" class='sapUiTInfM", CLASS_4_MOD_STATE[mod.state] || "", "'>", v, ",</span> ");
			});
			if ( iMore ) {
				html.push("<span id='sap-ui-techinfo-more' title='Show all modules' class='sapUiTInfMMore'>...(" + iMore + " more)</span>");
			}
		},

		onShowAllModules : function(e) {
			var html = [];
			this._renderModules(html, 0);
			this._$Ref.find("[id=sap-ui-techinfo-modules]").html(html.join(""));
		},

		onCreateCustomModule : function(e) {
			e.preventDefault();
			e.stopPropagation();
			var modnames = [];
			jQuery.each(this._ojQSData.modules, function(i,v) {
				modnames.push(i);
			});
			modnames.sort();
			jQuery("input[name='modules']", this._$Ref).attr("value", modnames.join(","));
			jQuery("form", this._$Ref)[0].submit();
		},

		onOptimizeModuleSet : function(e) {
			e.preventDefault();
			e.stopPropagation();
			var libnames = [];
			jQuery.each(sap.ui.getCore().getLoadedLibraries(), function(i,v) {
				libnames.push(i);
			});
			var modnames = [];
			jQuery.each(this._ojQSData.modules, function(sName,oModule) {
				if ( oModule.state >= 0 ) {
					modnames.push(sName);
				}
			});
			modnames.sort();
			var $Form = jQuery("#sap-ui-techinfo-optimize-submit",this._$Ref);
			jQuery("input[name='version']", $Form).attr("value", "2.0");
			jQuery("input[name='libs']", $Form).attr("value", libnames.join(","));
			jQuery("input[name='modules']", $Form).attr("value", modnames.join(","));
			$Form[0].submit();
		},

		ensureDebugEnv : function(bShowControls) {
			if ( !jQuery.sap.getObject("sap.ui.debug.DebugEnv") ) {
				try {
					jQuery.sap.require("sap-ui-debug");
					// when sap-ui-debug is loaded, control tree and property list are shown by defualt
					// so disable them again if they are not desired
					if ( !bShowControls ) {
						sap.ui.debug.DebugEnv.getInstance().hideControlTree();
						sap.ui.debug.DebugEnv.getInstance().hidePropertyList();
					}
				} catch (e) {
					// failed to load debug env (not installed?)
					return false;
				}
			}
			return true;
		},

		onShowControls : function(e) {
			if ( e.target.readOnly ) {
				e.preventDefault();
				e.stopPropagation();
				return;
			}
			if ( this.ensureDebugEnv(true) ) {
				if ( e.target.checked ) {
					sap.ui.debug.DebugEnv.getInstance().showControlTree();
					sap.ui.debug.DebugEnv.getInstance().showPropertyList();
				} else {
					sap.ui.debug.DebugEnv.getInstance().hideControlTree();
					sap.ui.debug.DebugEnv.getInstance().hidePropertyList();
				}
			}
		},

		onShowLogViewer : function(e) {
			if ( e.target.readOnly ) {
				e.preventDefault();
				e.stopPropagation();
				return;
			}
			if ( this.ensureDebugEnv(false) ) {
				if ( e.target.checked ) {
					sap.ui.debug.DebugEnv.getInstance().showTraceWindow();
				} else {
					sap.ui.debug.DebugEnv.getInstance().hideTraceWindow();
				}
			}
		},

		onUseDbgSources : function(e) {
			jQuery.sap.debug(!!e.target.checked);
		},

		populateRebootUrls : function() { // checks whether known URLs where UI5 could be booted from are reachable
			// these are the known standard URLs
			var sUserUrls, aUserUrls, mUrls = this.mRebootUrls = {
				// unfortunately we are not allowed to add the known internal URLs here
				"https://openui5.hana.ondemand.com/resources/sap-ui-core.js": "Public OpenUI5 server",
				"https://openui5beta.hana.ondemand.com/resources/sap-ui-core.js": "Public OpenUI5 PREVIEW server",
				"https://sapui5.hana.ondemand.com/sdk/resources/sap-ui-core.js": "Public SAPUI5 server",
				"http://localhost:8080/testsuite/resources/sap-ui-core.js": "Localhost (port 8080), /testsuite ('grunt serve' URL)",
				"http://localhost:8080/sapui5/resources/sap-ui-core.js": "Localhost (port 8080), /sapui5 (maven URL)"
			};

			// also try any previously entered URLs
			try { // Necessary for FF when Cookies are disabled
				sUserUrls = window.localStorage.getItem("sap-ui-reboot-URLs");
				aUserUrls = sUserUrls.split(" ");
			} catch (e) { /* that's ok... */ }

			for (var i in aUserUrls) {
				var sUrl = aUserUrls[i];
				if (!mUrls[sUrl]) {
					mUrls[sUrl] = jQuery.sap.encodeHTML(sUrl);
				}
			}

			var $Other = jQuery("#sap-ui-techinfo-reboot-other");
			function createAppendFunction(sUrl) {
				return function() {
					// append URL and description to select box
					var sHtml = "<option value='" + sUrl + "'>" + mUrls[sUrl] + "</option>";
					$Other.before(sHtml);
				};
			}

			// send an async HEAD request to each URL and append URL to the list in case of success
			for (var sUrl in mUrls) {
				jQuery.ajax({
					type: "HEAD",
					async: true,
					url: sUrl,
					success: createAppendFunction(sUrl)
				});
			}
		},

		onUI5VersionDropdownChanged : function() {
			var sRebootUrl = jQuery("#sap-ui-techinfo-reboot-select").val(),
				$Input = jQuery("#sap-ui-techinfo-reboot-input");

			if (sRebootUrl === "other") {
				// enable input field for custom URL
				$Input.removeAttr("disabled");

			} else {
				// disable input field and fill the selected URL (if any)
				$Input.attr("disabled", "disabled");
				if (sRebootUrl === "none") {
					$Input.val("");
				} else {
					$Input.val(sRebootUrl);
				}
			}
		},

		onUseOtherUI5Version : function() {
			var sRebootUrl = jQuery("#sap-ui-techinfo-reboot-select").val();
			if (sRebootUrl === "other") {
				// use content of input field
				sRebootUrl = jQuery("#sap-ui-techinfo-reboot-input").val();
			}

			if (!sRebootUrl || sRebootUrl === "none") {
				// no custom reboot
				jQuery.sap.setReboot(null);
				/*eslint-disable no-alert */
				alert("Reboot URL cleared. App will start normally.");
				/*eslint-enable no-alert */
			} else {
				// configure a reboot
				jQuery.sap.setReboot(sRebootUrl);

				// remember this URL in case it is a custom one
				if (!this.mRebootUrls[sRebootUrl]) {
					try { // Necessary for FF when Cookies are disabled
						var sUserUrls = window.localStorage.getItem("sap-ui-reboot-URLs");
						var aUserUrls = sUserUrls ? sUserUrls.split(" ") : [];
						if (jQuery.inArray(sRebootUrl, aUserUrls) === -1) {
							aUserUrls.push(sRebootUrl.replace(/ /g,"%20"));
							window.localStorage.setItem("sap-ui-reboot-URLs", aUserUrls.join(" "));
						}
					} catch (e) {
					jQuery.sap.log.error("sgsrg");

					/* there will already be a warning in the log because the reboot URL cannot be written */ }
				}
			}
		},

		onUseStatistics : function(e) {
			jQuery.sap.statistics(!!e.target.checked);
		},

		onOpenWebInspector: function(e) {
			/*eslint-disable no-alert */
			if (!sap.ui.getCore().getConfiguration().getWeinreServer()) {
				alert("Cannot start Web Inspector - WEINRE server is not configured.");
				e.preventDefault();
			} else if (!Device.browser.webkit) {
				alert("Cannot start Web Inspector - WEINRE only runs on WebKit, please use Chrome or Safari.");
				e.preventDefault();
			}
			/*eslint-enable no-alert */
		}

	};

	return TechnicalInfo;

}, /* bExport= */ true);
