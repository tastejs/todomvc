/*!
 * UI development toolkit for HTML5 (OpenUI5)
 * (c) Copyright 2009-2015 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */

// A core plugin that bundles debug features and connects with an embedding testsuite
sap.ui.define('sap/ui/debug/DebugEnv', ['jquery.sap.global', 'sap/ui/base/Interface', './ControlTree', './LogViewer', './PropertyList'],
	function(jQuery, Interface, ControlTree, LogViewer, PropertyList) {
	"use strict";


	/**
	 * Creates an instance of the class <code>sap.ui.debug.DebugEnv</code>
	 *
	 * @class Central Class for the Debug Environment
	 *
	 * @author Martin Schaus, Frank Weigel
	 * @version 1.32.9
	 * @private
	 * @alias sap.ui.debug.DebugEnv
	 */
	var DebugEnv = function() {
	};
	
	/**
	 * Will be invoked by <code>sap.ui.core.Core</code> to notify the plugin to start.
	 *
	 * @param {sap.ui.core.Core} oCore reference to the Core
	 * @param {boolean} [bOnInit] whether the hook is called during core initialization
	 * @public
	 */
	DebugEnv.prototype.startPlugin = function(oCore, bOnInit) {
	
		this.oCore = oCore;
		this.oWindow = window;
	
		/**
		 * Whether the debugenv should run embedded in application page (true) or in testsuite (false).
		 * @private
		 */
		try {
			this.bRunsEmbedded = typeof window.top.testfwk == "undefined"; // window || !top.frames["sap-ui-TraceWindow"]; // check only with ==, not === as the test otherwise fails on IE8
	
			jQuery.sap.log.info("Starting DebugEnv plugin (" + (this.bRunsEmbedded ? "embedded" : "testsuite") + ")");
	
			// initialize only if running in testsuite or when debug views are not disabled via URL parameter
			if (!this.bRunsEmbedded || oCore.getConfiguration().getInspect()) {
				this.init(bOnInit);
			}
			if (!this.bRunsEmbedded || oCore.getConfiguration().getTrace()) {
				this.initLogger(jQuery.sap.log, bOnInit);
			}
		} catch (oException) {
			jQuery.sap.log.warning("DebugEnv plugin can not be started outside the Testsuite.");
		}
	};
	
	/**
	 * Will be invoked by <code>sap.ui.core.Core</code> to notify the plugin to start
	 * @param {sap.ui.core.Core} oCore reference to the Core
	 * @public
	 */
	DebugEnv.prototype.stopPlugin = function() {
		jQuery.sap.log.info("Stopping DebugEnv plugin.");
		this.oCore = null;
	};
	
	/**
	 * Initializes the ControlTreeView and PropertyListView of the <code>sap.ui.debug.DebugEnv</code>
	 * @private
	 */
	DebugEnv.prototype.init = function(bOnInit) {
		this.oControlTreeWindow = this.bRunsEmbedded ? this.oWindow : (top.frames["sap-ui-ControlTreeWindow"] || top);
		this.oPropertyListWindow = this.bRunsEmbedded ? this.oWindow : (top.frames["sap-ui-PropertyListWindow"] || top);
	
		var bRtl = sap.ui.getCore().getConfiguration().getRTL();
	
		/* TODO enable switch to testsuite
		if ( this.bRunsEmbedded ) {
			var div = this.oWindow.document.createElement("DIV");
			div.style.position = "absolute";
			div.style.right = '202px';
			div.style.top = '1px';
			div.style.width = '32px';
			div.style.height = '32px';
			div.style.border = '1px solid black';
			div.style.backgroundColor = 'blue';
			div.style.backgroundImage = "url(" + sap.ui.global.resourceRoot + "testsuite/images/full.png)";
			div.style.zIndex = 5;
			div.style.opacity = '0.2';
			div.style.filter = 'progid:DXImageTransform.Microsoft.Alpha(opacity=20)';
			jQuery(div).bind("click",function(evt) {
				alert("click!");
			});
			/ *
			jQuery(div).bind("mouseover",function(evt) {
				alert("click!");
			});
			jQuery(div).bind("mouseout",function(evt) {
				alert("click!");
			}); * /
			this.oWindow.document.body.appendChild(div);
		}
		*/
	
		var oControlTreeRoot = this.oControlTreeWindow.document.getElementById("sap-ui-ControlTreeRoot"),
			oPropertyWindowRoot = this.oPropertyListWindow.document.getElementById("sap-ui-PropertyWindowRoot");
	
		if ( !oControlTreeRoot ) {
			oControlTreeRoot = this.oControlTreeWindow.document.createElement("DIV");
			oControlTreeRoot.setAttribute("id", "sap-ui-ControlTreeRoot");
			oControlTreeRoot.setAttribute("tabindex", -1);
			oControlTreeRoot.style.position = "absolute";
			oControlTreeRoot.style.fontFamily = "Arial";
			oControlTreeRoot.style.fontSize = "8pt";
			oControlTreeRoot.style.backgroundColor = "white";
			oControlTreeRoot.style.color = "black";
			oControlTreeRoot.style.border = "1px solid gray";
			oControlTreeRoot.style.overflow = "auto";
			oControlTreeRoot.style.zIndex = "999999";
			oControlTreeRoot.style.top = "1px";
			if (bRtl) {
				oControlTreeRoot.style.left = "1px";
			} else {
				oControlTreeRoot.style.right = "1px";
			}
			oControlTreeRoot.style.height = "49%";
			oControlTreeRoot.style.width = "200px";
			this.oControlTreeWindow.document.body.appendChild(oControlTreeRoot);
		} else {
			oControlTreeRoot.innerHTML = "";
		}
		this.oControlTreeRoot = oControlTreeRoot;
	
		if ( !oPropertyWindowRoot ) {
			oPropertyWindowRoot = this.oPropertyListWindow.document.createElement("DIV");
			oPropertyWindowRoot.setAttribute("id", "sap-ui-PropertyWindowRoot");
			oPropertyWindowRoot.setAttribute("tabindex", -1);
			oPropertyWindowRoot.style.position = "absolute";
			oPropertyWindowRoot.style.fontFamily = "Arial";
			oPropertyWindowRoot.style.fontSize = "8pt";
			oPropertyWindowRoot.style.backgroundColor = "white";
			oPropertyWindowRoot.style.color = "black";
			oPropertyWindowRoot.style.border = "1px solid gray";
			oPropertyWindowRoot.style.overflow = "auto";
			oPropertyWindowRoot.style.zIndex = "99999";
			oPropertyWindowRoot.style.width = "196px";
			oPropertyWindowRoot.style.height = "49%";
			if (bRtl) {
				oPropertyWindowRoot.style.left = "1px";
			} else {
				oPropertyWindowRoot.style.right = "1px";
			}
			oPropertyWindowRoot.style.bottom = "1px";
			this.oPropertyListWindow.document.body.appendChild(oPropertyWindowRoot);
		} else {
			oPropertyWindowRoot.innerHTML = "";
		}
		this.oPropertyWindowRoot = oPropertyWindowRoot;
	
		this.oControlTree = new ControlTree(this.oCore, this.oWindow, oControlTreeRoot, this.bRunsEmbedded);
		this.oPropertyList = new PropertyList(this.oCore, this.oWindow, oPropertyWindowRoot);
		this.oControlTree.attachEvent(ControlTree.M_EVENTS.SELECT, this.oPropertyList.update,
				this.oPropertyList);
		if ( !bOnInit ) {
			this.oControlTree.renderDelayed();
		}
	
		jQuery(window).unload(jQuery.proxy(function(oEvent) {
			this.oControlTree.exit();
			this.oPropertyList.exit();
		}, this));
	
	};
	
	/**
	 * Initializes the LogViewer of the <code>sap.ui.debug.DebugEnv</code>
	 * @private
	 */
	DebugEnv.prototype.initLogger = function(oLogger, bOnInit) {
		this.oLogger = oLogger;
		if ( !this.bRunsEmbedded ) {
			// attach test suite log viewer to our jQuery.sap.log
			this.oTraceWindow = top.frames["sap-ui-TraceWindow"];
			this.oTraceViewer = this.oTraceWindow.oLogViewer = new LogViewer(this.oTraceWindow, 'sap-ui-TraceWindowRoot');
			this.oTraceViewer.sLogEntryClassPrefix = "lvl"; // enforce use of CSS instead of DOM styles
			this.oTraceViewer.lock();
		} else {
			// create an embedded log viewer
			this.oTraceWindow = this.oWindow;
			this.oTraceViewer = new LogViewer(this.oTraceWindow, 'sap-ui-TraceWindowRoot');
		}
		this.oLogger.addLogListener(this.oTraceViewer);
	
		// When debug.js is injected (testsuite), it is not initialized during Core.init() but later.
		// In IE the startPlugin happens before rendering, in Chrome and others after rendering
		// Therefore the first 'UIUpdated' is missed in browsers other than IE.
		// To compensate this, we register for both, the UIUpdated and for a timer (if we are not called during Core.init)
		// Whatever happens first.
		// TODO should be part of core
		this.oCore.attachUIUpdated(this.enableLogViewer, this);
		if ( !bOnInit ) {
			var that = this;
			this.oTimer = setTimeout(function() {
				that.enableLogViewer();
			}, 0);
		}
	};
	
	DebugEnv.prototype.enableLogViewer = function() {
		// clear timeout (necessary in case we have been notified via attachUIUpdated)
		if ( this.oTimer ) {
			clearTimeout(this.oTimer);
			this.oTimer = undefined;
		}
		// clear listener (necessary to avoid multiple calls and in case we are called via timer)
		this.oCore.detachUIUpdated(this.enableLogViewer, this);
	
		// real action: enable the LogViewer
		if ( this.oTraceViewer) {
			this.oTraceViewer.unlock();
		}
	};
	
	/**
	 * Whether the DebugEnv is running embedded in app page or not (which then means running in a test suite)
	 */
	DebugEnv.prototype.isRunningEmbedded = function() {
		return this.bRunsEmbedded;
	};
	
	/**
	 * Whether the ControlTree is visible
	 */
	DebugEnv.prototype.isControlTreeShown = function() {
		return jQuery(this.oControlTreeRoot).css("visibility") === "visible" || jQuery(this.oControlTreeRoot).css("visibility") === "inherit";
	};
	
	/**
	 * Will be called to show the ControlTree
	 */
	DebugEnv.prototype.showControlTree = function() {
		if (!this.oControlTreeRoot) {
			this.init(false);
		}
		jQuery(this.oControlTreeRoot).css("visibility", "visible");
	};
	
	/**
	 * Will be called to hide the ControlTree
	 */
	DebugEnv.prototype.hideControlTree = function() {
		jQuery(this.oControlTreeRoot).css("visibility", "hidden");
	};
	
	/**
	 * Whether the LogViewer is shown
	 */
	DebugEnv.prototype.isTraceWindowShown = function() {
		var oLogViewer = this.oTraceWindow && this.oTraceWindow.document.getElementById('sap-ui-TraceWindowRoot');
		return oLogViewer && (jQuery(oLogViewer).css("visibility") === "visible" || jQuery(oLogViewer).css("visibility") === "inherit");
	};
	
	/**
	 * Will be called to show the TraceWindow
	 */
	DebugEnv.prototype.showTraceWindow = function() {
		if ( !this.oTraceWindow && jQuery && jQuery.sap && jQuery.sap.log ) {
			this.initLogger(jQuery.sap.log, false);
		}
		var oLogViewer = this.oTraceWindow && this.oTraceWindow.document.getElementById('sap-ui-TraceWindowRoot');
		if ( oLogViewer ) {
			jQuery(oLogViewer).css("visibility", "visible");
		}
	};
	
	/**
	 * Will be called to hide the TraceWindow
	 */
	DebugEnv.prototype.hideTraceWindow = function() {
		var oLogViewer = this.oTraceWindow && this.oTraceWindow.document.getElementById('sap-ui-TraceWindowRoot');
		if ( oLogViewer ) {
			jQuery(oLogViewer).css("visibility", "hidden");
		}
	};
	
	/**
	 * Will be called to show the PropertyList
	 */
	DebugEnv.prototype.isPropertyListShown = function() {
		return jQuery(this.oPropertyWindowRoot).css("visibility") === "visible" || jQuery(this.oPropertyWindowRoot).css("visibility") === "inherit";
	};
	
	/**
	 * Will be called to show the PropertyList
	 */
	DebugEnv.prototype.showPropertyList = function() {
		if (!this.oPropertyWindowRoot) {
			this.init(false);
		}
		jQuery(this.oPropertyWindowRoot).css("visibility", "visible");
	};
	
	/**
	 * Will be called to hide the PropertyList
	 */
	DebugEnv.prototype.hidePropertyList = function() {
		jQuery(this.oPropertyWindowRoot).css("visibility", "hidden");
	};
	
	/**
	 * Create the <code>sap.ui.debug.DebugEnv</code> plugin and register
	 * it within the <code>sap.ui.core.Core</code>.
	 */
	(function(){
		var oThis = new DebugEnv();
		sap.ui.getCore().registerPlugin(oThis);
		DebugEnv.getInstance = jQuery.sap.getter(new Interface(oThis, ["isRunningEmbedded", "isControlTreeShown", "showControlTree", "hideControlTree", "isTraceWindowShown", "showTraceWindow", "hideTraceWindow", "isPropertyListShown", "showPropertyList", "hidePropertyList"]));
	}());

	return DebugEnv;

}, /* bExport= */ true);
