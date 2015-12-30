/*!
 * UI development toolkit for HTML5 (OpenUI5)
 * (c) Copyright 2009-2015 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */

// Provides the basic UI5 support functionality
sap.ui.define(['jquery.sap.global', 'sap/ui/base/EventProvider', './Plugin', 'sap/ui/Device', 'jquery.sap.dom', 'jquery.sap.encoder', 'jquery.sap.script'],
	function(jQuery, EventProvider, Plugin, Device/* , jQuerySap, jQuerySap2, jQuerySap1 */) {
	"use strict";

	/**
	 * Constructor for sap.ui.core.support.Support - must not be used: To get the singleton instance, use
	 * sap.ui.core.support.Support.getStub.
	 *
	 * @class This class provides the support tool functionality of UI5. This class is internal and all its functions must not be used by an application.
	 *
	 * @extends sap.ui.base.EventProvider
	 * @version 1.32.9
	 * @constructor
	 * @private
	 * @alias sap.ui.core.support.Support
	 */
	var Support = EventProvider.extend("sap.ui.core.support.Support", {
		constructor: function(sType) {
			if (!_bPrivate) {
				throw Error();
			}
			EventProvider.apply(this);

			var that = this;

			this._sType = sType;
			this._sLocalOrigin = window.location.protocol + "//" + window.location.host;

			var fHandler = jQuery.proxy(this._receiveEvent, this);
			if (window.addEventListener) {
				window.addEventListener("message", fHandler, false);
			} else {
				window.attachEvent("onmessage", fHandler);
			}

			switch (sType) {
				case mTypes.APPLICATION:
					this._isOpen = false;
					this.attachEvent(mEvents.TEAR_DOWN, function(oEvent){
						that._isOpen = false;
						if (!!Device.browser.internet_explorer) {
							jQuery.sap.byId(ID_SUPPORT_AREA + "-frame").remove();
						} else {
							close(that._oRemoteWindow);
						}
						that._oRemoteWindow = null;
						exitPlugins(that, false);
					});
					this.attachEvent(mEvents.SETUP, function(oEvent){
						that._isOpen = true;
						initPlugins(that, false);
					});
					break;
				case mTypes.IFRAME:
					this._oRemoteWindow = window.parent;
					this._sRemoteOrigin = jQuery.sap.getUriParameters().get("sap-ui-xx-support-origin");
					this.openSupportTool();
					jQuery(window).bind("unload", function(oEvent){
						close(that._oOpenedWindow);
					});
					break;
				case mTypes.TOOL:
					this._oRemoteWindow = window.opener;
					this._sRemoteOrigin = jQuery.sap.getUriParameters().get("sap-ui-xx-support-origin");
					jQuery(window).bind("unload", function(oEvent){
						that.sendEvent(mEvents.TEAR_DOWN);
						exitPlugins(that, true);
					});
					jQuery(function(){
						initPlugins(that, true);
						that.sendEvent(mEvents.SETUP);
					});
					break;
			}

		}
	});


	var mTypes = {
		APPLICATION: "APPLICATION", //Application stub -> the "standard one"
		IFRAME: "IFRAME", //Used by the Internet Explorer iFrame bridge only
		TOOL: "TOOL" //Used by the support tool only
	};


	var mEvents = {
		SETUP: "sapUiSupportSetup", //Event when support tool is opened
		TEAR_DOWN: "sapUiSupportTeardown" //Event when support tool is closed
	};


	/**
	 * Enumeration providing the possible support stub types.
	 *
	 * @static
	 * @protected
	 */
	Support.StubType = mTypes;


	/**
	 * Enumeration providing the predefined support event ids.
	 *
	 * @static
	 * @namespace
	 * @protected
	 */
	Support.EventType = mEvents;

	/**
	 * Support plugin registration
	 * @private
	 */
	Support.TOOL_SIDE_PLUGINS = ["sap.ui.core.support.plugins.TechInfo", "sap.ui.core.support.plugins.ControlTree", "sap.ui.core.support.plugins.Debugging", "sap.ui.core.support.plugins.Trace", "sap.ui.core.support.plugins.Performance", "sap.ui.core.support.plugins.MessageTest", "sap.ui.core.support.plugins.Interaction"];
	Support.APP_SIDE_PLUGINS = ["sap.ui.core.support.plugins.TechInfo", "sap.ui.core.support.plugins.ControlTree", "sap.ui.core.support.plugins.Trace", "sap.ui.core.support.plugins.Performance", "sap.ui.core.support.plugins.Selector", "sap.ui.core.support.plugins.Breakpoint", "sap.ui.core.support.plugins.LocalStorage", "sap.ui.core.support.plugins.Interaction"];


	/**
	 * Returns the support stub instance. If an instance was not yet available a new one is
	 * with the given type is created.
	 *
	 * This function is internal and must not be called by an application.
	 *
	 * @param {string} [sType=sap.ui.core.support.Support.EventType.APPLICATION] the type
	 * @return {sap.ui.core.support.Support} the support stub
	 * @static
	 * @protected
	 */
	Support.getStub = function(sType) {
		if (_oStubInstance) {
			return _oStubInstance;
		}

		if (sType != mTypes.APPLICATION && sType != mTypes.IFRAME && sType != mTypes.TOOL) {
			sType = mTypes.APPLICATION;
		}

		_bPrivate = true;
		_oStubInstance = new Support(sType);
		_bPrivate = false;

		return _oStubInstance;
	};


	/**
	 * Returns the type of this support stub.
	 *
	 * @see sap.ui.core.support.Support.StubType
	 * @return {string} the type of the support stub
	 * @protected
	 */
	Support.prototype.getType = function() {
		return this._sType;
	};


	/**
	 * Receive event handler for postMessage communication.
	 *
	 * @param {object} oEvent the event
	 * @private
	 */
	Support.prototype._receiveEvent = function(oEvent) {
		var sData = oEvent.data;

		if (typeof sData === "string" && sData.indexOf("SAPUI5SupportTool*") === 0) {
			sData = sData.substr(18); // length of SAPUI5SupportTool*
		} else {
			return;
		}

		if (jQuery("html").attr("data-sap-ui-browser") != "ie8") {
			if (oEvent.source != this._oRemoteWindow) {
				return;
			}
		}

		this._oRemoteOrigin = oEvent.origin;

		if (this._sType === mTypes.IFRAME) {
			var that = this;
			setTimeout(function(){
				that._oOpenedWindow.sap.ui.core.support.Support.getStub(mTypes.TOOL)._receiveEvent({source: window, data: oEvent.data, origin: that._sLocalOrigin});
			}, 0);
		} else {
			var oData = window.JSON.parse(sData);
			var sEventId = oData.eventId;
			var mParams = oData.params;
			this.fireEvent(sEventId, mParams);
		}
	};


	/**
	 * Sends an event to the remote window.
	 *
	 * @param {string} sEventId the event id
	 * @param {Object} [mParams] the parameter map (JSON)
	 * @protected
	 */
	Support.prototype.sendEvent = function(sEventId, mParams) {
		if (!this._oRemoteWindow) {
			return;
		}

		mParams = mParams ? mParams : {};

		if (!!Device.browser.internet_explorer && this._sType === mTypes.TOOL) {
			this._oRemoteWindow.sap.ui.core.support.Support.getStub(mTypes.IFRAME).sendEvent(sEventId, mParams);
		} else {
			var mParamsLocal = mParams;
			if (!!Device.browser.internet_explorer) {
				//Attention mParams comes from an other window
				//-> (mParams instanceof Object == false)!
				mParamsLocal = {};
				jQuery.extend(true, mParamsLocal, mParams);
			}
			var oData = {"eventId": sEventId, "params": mParamsLocal};
			var sData = "SAPUI5SupportTool*" + window.JSON.stringify(oData);
			this._oRemoteWindow.postMessage(sData, this._sRemoteOrigin);
		}
	};


	/**
	 * Opens the support tool in an external browser window.
	 *
	 * @protected
	 */
	Support.prototype.openSupportTool = function() {
		var sToolUrl = jQuery.sap.getModulePath("sap.ui.core.support", "/support.html");
		var sParams = "?sap-ui-xx-support-origin=" + jQuery.sap.encodeURL(this._sLocalOrigin);

		var sBootstrapScript;
		if (this._sType === mTypes.APPLICATION) {
			// get bootstrap script name from script tag
			var oBootstrap = jQuery.sap.domById("sap-ui-bootstrap");
			if (oBootstrap) {
				var sRootPath = jQuery.sap.getModulePath('./');
				var sBootstrapSrc = oBootstrap.getAttribute('src');
				if (typeof sBootstrapSrc === 'string' && sBootstrapSrc.indexOf(sRootPath) === 0) {
					sBootstrapScript = sBootstrapSrc.substr(sRootPath.length);
				}
			}
		} else if (this._sType === mTypes.IFRAME) {
			// use script name from URI parameter to hand it over to the tool
			sBootstrapScript = jQuery.sap.getUriParameters().get("sap-ui-xx-support-bootstrap");
		}

		// sap-ui-core.js is the default. no need for passing it to the support window
		// also ensure that the bootstrap script is in the root module path
		if (sBootstrapScript && sBootstrapScript !== 'sap-ui-core.js' && sBootstrapScript.indexOf('/') === -1) {
			sParams += "&sap-ui-xx-support-bootstrap=" + jQuery.sap.encodeURL(sBootstrapScript);
		}

		function checkLocalUrl(sUrl){
			//TODO find a proper check
			return (sUrl.indexOf(".") == 0 || sUrl.indexOf("/") == 0 || sUrl.indexOf("://") < 0);
		}

		if (this._sType === mTypes.APPLICATION) {
			if (!this._isOpen) {
				if (!!Device.browser.internet_explorer) {
					var sIFrameUrl = jQuery.sap.getModulePath("sap.ui.core.support", "/msiebridge.html");
					getSupportArea().html("").append("<iframe id=\"" + ID_SUPPORT_AREA + "-frame\" src=\"" + sIFrameUrl + sParams + "\" onload=\"sap.ui.core.support.Support._onSupportIFrameLoaded();\"></iframe>");
					this._sRemoteOrigin = checkLocalUrl(sIFrameUrl) ? this._sLocalOrigin : sIFrameUrl;
				} else {
					this._oRemoteWindow = openWindow(sToolUrl + sParams);
					this._sRemoteOrigin = checkLocalUrl(sToolUrl) ? this._sLocalOrigin : sToolUrl;
				}
			}
		} else if (this._sType === mTypes.IFRAME) {
			this._oOpenedWindow = openWindow(sToolUrl + sParams);
		}
	};


	/**
	 * Event Handler which is bound to the onload event of the Internet Explorer iFrame bridge.
	 *
	 * @static
	 * @private
	 */
	Support._onSupportIFrameLoaded = function(){
		_oStubInstance._oRemoteWindow = jQuery.sap.byId(ID_SUPPORT_AREA + "-frame")[0].contentWindow;
	};


	/**
	 * @see sap.ui.base.EventProvider.prototype.toString
	 *
	 * @protected
	 */
	Support.prototype.toString = function() {
		return "sap.ui.core.support.Support";
	};


	/**
	 * @see sap.ui.base.EventProvider.prototype.fireEvent
	 *
	 * @name sap.ui.core.support.Support.prototype.fireEvent
	 * @function
	 * @param {string} sEventId the event id
	 * @param {Object} [mParameters] the parameter map (JSON)
	 * @return {sap.ui.core.support.Support} Returns <code>this</code> to allow method chaining
	 * @private
	 */


	/**
	 * @see sap.ui.base.EventProvider.prototype.detachEvent
	 *
	 * @name sap.ui.core.support.Support.prototype.detachEvent
	 * @function
	 * @protected
	 */


	/**
	 * @see sap.ui.base.EventProvider.prototype.attachEvent
	 *
	 * @name sap.ui.core.support.Support.prototype.attachEvent
	 * @function
	 * @protected
	 */


	//*************** PRIVATE **************

	var _bPrivate = false; //Ensures that the constructor can not be called from outside
	var _oStubInstance; //The stub instance

	var ID_SUPPORT_AREA = "sap-ui-support";


	function getSupportArea() {
		var $support = jQuery.sap.byId(ID_SUPPORT_AREA);
		if ($support.length === 0) {
			$support = jQuery("<DIV/>", {id:ID_SUPPORT_AREA}).
				addClass("sapUiHidden").
				appendTo(document.body);
		}
		return $support;
	}


	function openWindow(sUrl) {
		return window.open(sUrl,
			"sapUiSupportTool",
			"width=800,height=700,status=no,toolbar=no,menubar=no,resizable=yes,location=no,directories=no,scrollbars=yes"
		);
	}


	function close(oWindow) {
		if (!oWindow) {
			return;
		}
		try {
			oWindow.close();
		} catch (e) {
			//escape eslint check for empty block
		}
	}


	function initPlugins(oStub, bTool) {
		var aPlugins = bTool ? Support.TOOL_SIDE_PLUGINS : Support.APP_SIDE_PLUGINS;

		for (var i = 0; i < aPlugins.length; i++) {
			if (typeof (aPlugins[i]) === "string") {
				jQuery.sap.require(aPlugins[i]);
				var fPluginConstructor = jQuery.sap.getObject(aPlugins[i]);
				aPlugins[i] = new fPluginConstructor(oStub);
				if (oStub.getType() === mTypes.TOOL) {
					wrapPlugin(aPlugins[i]);
				}
				aPlugins[i].init(oStub);
			} else if (aPlugins[i] instanceof Plugin) {
				aPlugins[i].init(oStub);
			}
		}

		if (bTool) {
			Support.TOOL_SIDE_PLUGINS = aPlugins;
		} else {
			Support.APP_SIDE_PLUGINS = aPlugins;
		}
	}


	function exitPlugins(oStub, bTool) {
		var aPlugins = bTool ? Support.TOOL_SIDE_PLUGINS : Support.APP_SIDE_PLUGINS;
		for (var i = 0; i < aPlugins.length; i++) {
			if (aPlugins[i] instanceof Plugin) {
				aPlugins[i].exit(oStub, bTool);
			}
		}
	}


	function wrapPlugin(oPlugin) {
		oPlugin.$().replaceWith("<div  id='" + oPlugin.getId() + "-Panel' class='sapUiSupportPnl'><h2 class='sapUiSupportPnlHdr'>" +
				oPlugin.getTitle() + "<div id='" + oPlugin.getId() + "-PanelHandle' class='sapUiSupportPnlHdrHdl sapUiSupportPnlHdrHdlClosed'></div></h2><div id='" +
				oPlugin.getId() + "-PanelContent' class='sapUiSupportPnlCntnt sapUiSupportHidden'><div id='" +
				oPlugin.getId() + "' class='sapUiSupportPlugin'></div></div></div>");

		oPlugin.$("PanelHandle").click(function(){
			var jHandleRef = oPlugin.$("PanelHandle");
			if (jHandleRef.hasClass("sapUiSupportPnlHdrHdlClosed")) {
				jHandleRef.removeClass("sapUiSupportPnlHdrHdlClosed");
				oPlugin.$("PanelContent").removeClass("sapUiSupportHidden");
			} else {
				jHandleRef.addClass("sapUiSupportPnlHdrHdlClosed");
				oPlugin.$("PanelContent").addClass("sapUiSupportHidden");
			}
		});
	}

	return Support;

});
