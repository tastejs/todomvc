/*!
 * UI development toolkit for HTML5 (OpenUI5)
 * (c) Copyright 2009-2015 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */

// Provides a tree of controls for the testsuite
sap.ui.predefine('sap/ui/debug/ControlTree', ['jquery.sap.global', 'sap/ui/base/EventProvider', 'sap/ui/core/Element', 'sap/ui/core/UIArea', './Highlighter'],
	function(jQuery, EventProvider, Element, UIArea, Highlighter) {
	"use strict";


	/**
	 * Constructs the class <code>sap.ui.debug.ControlTree</code> and registers
	 * to the <code>sap.ui.core.Core</code> for UI change events.
	 *
	 * @param {sap.ui.core.Core}
	 *            oCore the core instance to use for analysis
	 * @param {Window}
	 *            oWindow reference to the window object
	 * @param {Element}
	 *            oParentDomRef reference to the parent DOM element
	 *
	 * @constructor
	 *
	 * @class Control Tree used for the Debug Environment
	 * @extends sap.ui.base.EventProvider
	 * @author Martin Schaus, Frank Weigel
	 * @version 1.32.9
	 * @alias sap.ui.debug.ControlTree
	 * @private
	 */
	var ControlTree = EventProvider.extend("sap.ui.debug.ControlTree", /** @lends sap.ui.debug.ControlTree.prototype */ {
		constructor: function(oCore, oWindow, oParentDomRef, bRunsEmbedded) {
			EventProvider.apply(this,arguments);
			this.oWindow = oWindow;
			this.oDocument = oWindow.document;
			this.oCore = oCore;
			this.oSelectedNode = null;
			this.oParentDomRef = oParentDomRef;
			this.oSelectionHighlighter = new Highlighter("sap-ui-testsuite-SelectionHighlighter");
			this.oHoverHighlighter = new Highlighter("sap-ui-testsuite-HoverHighlighter", true, '#c8f', 1);
			var that = this;
			jQuery(oParentDomRef).bind("click",function(evt) {
				that.onclick(evt);
			})
			.bind("mouseover",function(evt) {
				that.onmouseover(evt);
			})
			.bind("mouseout",function(evt) {
				that.onmouseout(evt);
			});
			this.enableInplaceControlSelection();// see below...
			this.oCore.attachUIUpdated(this.renderDelayed, this);
			this.sSelectedNodeId = "";
			this.sResourcePath = bRunsEmbedded ? jQuery.sap.getModulePath("", "/") : (window.top.testfwk.sResourceRoot || "../");
			this.sTestResourcePath = this.sResourcePath + "../test-resources/";
			this.sSpaceUrl = this.sResourcePath + "sap/ui/debug/images/space.gif";
			this.sMinusUrl = this.sResourcePath + "sap/ui/debug/images/minus.gif";
			this.sPlusUrl = this.sResourcePath + "sap/ui/debug/images/plus.gif";
			this.sLinkUrl = this.sResourcePath + "sap/ui/debug/images/link.gif";
		}
	});
	
	/** events of the ControlTree */
	ControlTree.M_EVENTS = {
		SELECT : "SELECT"
	};
	
	/**
	 * TODO: missing internal JSDoc... @author please update
	 * @private
	 */
	ControlTree.prototype.exit = function() {
		jQuery(document).unbind();
		jQuery(this.oParentDomRef).unbind();
	};
	
	/**
	 * TODO: missing internal JSDoc... @author please update
	 * @private
	 */
	ControlTree.prototype.renderDelayed = function() {
		if (this.oTimer) {
			this.oWindow.jQuery.sap.clearDelayedCall(this.oTimer);
		}
		this.oTimer = this.oWindow.jQuery.sap.delayedCall(0,this,"render");
	};
	
	/**
	 * TODO: missing internal JSDoc... @author please update
	 * @private
	 */
	ControlTree.prototype.render = function() {
		var oDomRef = this.oParentDomRef;
		var oUIArea = null,
			oUIAreas = this.oCore.mUIAreas;
		oDomRef.innerHTML = "";
		for (var i in oUIAreas) {
			var oUIArea = oUIAreas[i],
				oDomNode = this.createTreeNodeDomRef(oUIArea.getId(),0,"UIArea", this.sTestResourcePath + "sap/ui/core/images/controls/sap.ui.core.UIArea.gif");
			oDomRef.appendChild(oDomNode);
	
			var aRootControls = oUIArea.getContent();
			for (var i = 0, l = aRootControls.length; i < l; i++) {
				this.renderNode(oDomRef,aRootControls[i],1);
			}
		}
	};
	
	/**
	 * TODO: missing internal JSDoc... @author please update
	 * @private
	 */
	ControlTree.prototype.createTreeNodeDomRef = function(sId,iLevel,sType,sIcon) {
		var oDomNode = this.oParentDomRef.ownerDocument.createElement("DIV");
		oDomNode.setAttribute("id","sap-debug-controltree-" + sId);
		var sShortType = sType.substring(sType.lastIndexOf(".") >  -1 ? sType.lastIndexOf(".") + 1 : 0);
		oDomNode.innerHTML = "<img style='height:12px;width:12px;display:none' src='" + this.sSpaceUrl + "' align='absmiddle'/><img style='height:16px;width:16px' src='" + sIcon + "' align='absmiddle'/>&nbsp;<span>" + sShortType + " - " + sId + "</span>";
		oDomNode.style.overflow = "hidden";
		oDomNode.style.whiteSpace = "nowrap";
		oDomNode.style.textOverflow = "ellipsis";
		oDomNode.style.paddingLeft = (iLevel * 16) + "px";
		oDomNode.style.height = "20px";
		oDomNode.style.cursor = "default";
		oDomNode.setAttribute("sap-type",sType);
		oDomNode.setAttribute("sap-id",sId);
		oDomNode.setAttribute("sap-expanded","true");
		oDomNode.setAttribute("sap-level","" + iLevel);
		oDomNode.title = sType + " - " + sId;
		return oDomNode;
	};
	
	/**
	 * TODO: missing internal JSDoc... @author please update
	 * @private
	 */
	ControlTree.prototype.createLinkNode = function(oParentRef, sId, iLevel, sType) {
		var oDomNode = this.oParentDomRef.ownerDocument.createElement("DIV");
		oDomNode.setAttribute("id","sap-debug-controltreelink-" + sId);
		var sShortType = sType ? sType.substring(sType.lastIndexOf(".") >  -1 ? sType.lastIndexOf(".") + 1 : 0) : "";
		oDomNode.innerHTML = "<img style='height:12px;width:12px;display:none' src='" + this.sSpaceUrl + "' align='absmiddle'/><img style='height:12px;width:12px' src='" + this.sLinkUrl + "' align='absmiddle'/>&nbsp;<span style='color:#888;border-bottom:1px dotted #888;'>" + (sShortType ? sShortType + " - " : "") + sId + "</span>";
		oDomNode.style.overflow = "hidden";
		oDomNode.style.whiteSpace = "nowrap";
		oDomNode.style.textOverflow = "ellipsis";
		oDomNode.style.paddingLeft = (iLevel * 16) + "px";
		oDomNode.style.height = "20px";
		oDomNode.style.cursor = "default";
		oDomNode.setAttribute("sap-type","Link");
		oDomNode.setAttribute("sap-id",sId);
		oDomNode.setAttribute("sap-expanded","true");
		oDomNode.setAttribute("sap-level","" + iLevel);
		oDomNode.title = "Association to '" + sId + "'";
		oParentRef.appendChild(oDomNode);
		return oDomNode;
	};
	
	/**
	 * TODO: missing internal JSDoc... @author please update
	 * @private
	 */
	ControlTree.prototype.renderNode = function(oDomRef,oControl,iLevel) {
		if (!oControl) {
			return;
		}
	
		var oMetadata = oControl.getMetadata();
		var sIcon = this.sTestResourcePath + oMetadata.getLibraryName().replace(/\./g, "/") + "/images/controls/" + oMetadata.getName() + ".gif";
		var oDomNode = this.createTreeNodeDomRef(oControl.getId(),iLevel,oMetadata.getName(),sIcon);
		oDomRef.appendChild(oDomNode);
		var bRequiresExpanding = false;
		if (oControl.mAggregations) {
			for (var n in oControl.mAggregations) {
				bRequiresExpanding = true;
				var oAggregation = oControl.mAggregations[n];
				if (oAggregation && oAggregation.length) {
					for (var i = 0;i < oAggregation.length;i++) {
						var o = oAggregation[i];
						if (o  instanceof Element) {
							this.renderNode(oDomRef,oAggregation[i],iLevel + 1);
						}
					}
				} else if (oAggregation instanceof Element) {
					this.renderNode(oDomRef,oAggregation,iLevel + 1);
				}
			}
		}
		if (oControl.mAssociations) {
			for (var n in oControl.mAssociations) {
				bRequiresExpanding = true;
				var oAssociation = oControl.mAssociations[n];
				if (jQuery.isArray(oAssociation)) {
					for (var i = 0;i < oAssociation.length;i++) {
						var o = oAssociation[i];
						if (typeof o === "string") {
							this.createLinkNode(oDomRef, o, iLevel + 1);
						}
					}
				} else if (typeof oAssociation === "string") {
					this.createLinkNode(oDomRef, oAssociation, iLevel + 1);
				}
			}
		}
		if ( bRequiresExpanding ) {
			var oExpandImage = oDomNode.getElementsByTagName("IMG")[0];
			oExpandImage.src = this.sMinusUrl;
			oExpandImage.style.display = "";
		}
	
	};
	
	/**
	 * TODO: missing internal JSDoc... @author please update
	 * @private
	 */
	ControlTree.prototype.onclick = function(oEvent) {
		var oSource = oEvent.target;
		if (oSource.tagName == "IMG") {
			var oParent = oSource.parentNode,
				iLevel = parseInt(oParent.getAttribute("sap-level"), 10),
				oNextNode = oParent.nextSibling,
				bExpanded = oParent.getAttribute("sap-expanded") == "true";
			// propagate expanded state to all children
			oSource = oParent.firstChild;
			if (oNextNode) {
				var iNextLevel = parseInt(oNextNode.getAttribute("sap-level"), 10);
				while (oNextNode && iNextLevel > iLevel) {
					var oExpandImage = oNextNode.getElementsByTagName("IMG")[0];
					if (bExpanded) {
						oNextNode.style.display = "none";
						oNextNode.setAttribute("sap-expanded","false");
						if ( oExpandImage && oExpandImage.src !== this.sSpaceUrl ) {
							oExpandImage.src = this.sPlusUrl;
						}
					} else {
						oNextNode.style.display = "block";
						oNextNode.setAttribute("sap-expanded","true");
						if ( oExpandImage && oExpandImage.src !== this.sSpaceUrl ) {
							oExpandImage.src = this.sMinusUrl;
						}
					}
					oNextNode = oNextNode.nextSibling;
					if (oNextNode) {
						iNextLevel = parseInt(oNextNode.getAttribute("sap-level"), 10);
					}
				}
			}
			if (bExpanded) {
				oSource.src = this.sPlusUrl;
				oParent.setAttribute("sap-expanded","false");
			} else {
				oSource.src = this.sMinusUrl;
				oParent.setAttribute("sap-expanded","true");
			}
	
		//} else if (oSource.getAttribute("sap-type") == "UIArea") {
	
		} else {
			if (oSource.tagName != "SPAN") {
				oSource = oSource.getElementsByTagName("SPAN")[0];
			}
			var oParent = oSource.parentNode,
				sId = oParent.getAttribute("sap-id"),
				oElement = this.oCore.byId(sId),
				sNodeId = oParent.getAttribute("sap-type") === "Link" ? "sap-debug-controltree-" + sId : oParent.id;
			this.oSelectionHighlighter.hide();
			if (oElement && oElement instanceof Element) {
				this.oSelectionHighlighter.highlight(oElement.getDomRef());
				this.oHoverHighlighter.hide();
			}
			this.deselectNode(this.sSelectedNodeId);
			this.selectNode(sNodeId);
		}
	};
	
	/**
	 * TODO: missing internal JSDoc... @author please update
	 * @private
	 */
	ControlTree.prototype.onmouseover = function(oEvent) {
		var oSource = oEvent.target;
		if (oSource.tagName == "SPAN") {
			this.oHoverHighlighter.highlight(this.getTargetDomRef(oSource.parentNode));
		}
	};
	
	/**
	 * TODO: missing internal JSDoc... @author please update
	 * @private
	 */
	ControlTree.prototype.onmouseout = function(oEvent) {
		var oSource = oEvent.target;
		if (oSource.tagName == "SPAN") {
			if ( this.getTargetDomRef(oSource.parentNode) ) {
				this.oHoverHighlighter.hide();
			}
		}
	};
	
	/**
	 * TODO: missing internal JSDoc... @author please update
	 * @private
	 */
	ControlTree.prototype.selectNode = function(sId) {
		if (!sId) {
			return;
		}
		var oDomRef = jQuery.sap.domById(sId, jQuery.sap.ownerWindow(this.oParentDomRef));
		if ( !oDomRef ) {
			jQuery.sap.log.warning("Control with Id '" + sId.substring(22) + "' not found in tree");
			return;
		}
		var	sControlId = oDomRef.getAttribute("sap-id");
		var oSpan = oDomRef.getElementsByTagName("SPAN")[0];
		oSpan.style.backgroundColor = "#000066";
		oSpan.style.color = "#FFFFFF";
		this.sSelectedNodeId = sId;
	
		this.fireEvent(ControlTree.M_EVENTS.SELECT,{id:sId, controlId: sControlId});
	};
	
	/**
	 * TODO: missing internal JSDoc... @author please update
	 * @private
	 */
	ControlTree.prototype.deselectNode = function(sId) {
		if (!sId) {
			return;
		}
		var oDomRef = jQuery.sap.domById(sId, jQuery.sap.ownerWindow(this.oParentDomRef));
		var oSpan = oDomRef.getElementsByTagName("SPAN")[0];
		oSpan.style.backgroundColor = "transparent";
		oSpan.style.color = "#000000";
		this.sSelectedNodeId = sId;
	};
	
	/**
	 * Tries to find the innermost DOM node in the source window that contains the
	 * SAPUI5 element/UIArea identified by the given tree node.
	 *
	 * If elements in the hierarchy don't return a value for {@link sap.ui.core.Element#getDomRef}
	 * (e.g. because they don't render a DOM node with their own id), enclosing parents
	 * are checked until the UIArea is reached.
	 *
	 * @param oTreeNodeDomRef the tree node to start the search for
	 * @return {Element} best matching source DOM node
	 * @private
	 */
	ControlTree.prototype.getTargetDomRef = function(oTreeNodeDomRef) {
		var sType = oTreeNodeDomRef.getAttribute("sap-type"),
			sId = oTreeNodeDomRef.getAttribute("sap-id"),
			oSomething = sType === "UIArea" ? this.oCore.getUIArea(sId) : this.oCore.byId(sId);
	
		while (oSomething && oSomething instanceof Element) {
			var oDomRef = oSomething.getDomRef();
			if ( oDomRef ) {
				return oDomRef;
			}
			oSomething = oSomething.getParent();
		}
	
		if ( oSomething instanceof UIArea ) {
			return oSomething.getRootNode();
		}
	};
	
	/**
	 * Enables an 'onhover' handler in the content window that allows to see control borders.
	 * @private
	 */
	ControlTree.prototype.enableInplaceControlSelection = function() {
		var that = this;
		jQuery(document).bind("mouseover" , function (oEvt) {
			that.selectControlInTree(oEvt);
		});
	};
	
	ControlTree.prototype.selectControlInTree = function( oEvt ) {
		if ( oEvt ) {
		  if ( oEvt.ctrlKey && oEvt.shiftKey && !oEvt.altKey ) {
			  var oControl = oEvt.srcElement || oEvt.target;
			  while (oControl && (!oControl.id || !this.oCore.getControl(oControl.id )) ) {
				oControl = oControl.parentNode;
			}
			 if ( oControl && oControl.id && this.oCore.getControl(oControl.id ) ) {
				this.oHoverHighlighter.highlight(oControl);
			 } else {
			// this.selectControlInTreeByCtrlId(sId);
				  this.oHoverHighlighter.hide();
			 }
	
		  } else {
			  this.oHoverHighlighter.hide();
		  }
		}
	};

	return ControlTree;

});
/*!
 * UI development toolkit for HTML5 (OpenUI5)
 * (c) Copyright 2009-2015 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */

// A core plugin that bundles debug features and connects with an embedding testsuite
sap.ui.predefine('sap/ui/debug/DebugEnv', ['jquery.sap.global', 'sap/ui/base/Interface', './ControlTree', './LogViewer', './PropertyList'],
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
/*!
 * UI development toolkit for HTML5 (OpenUI5)
 * (c) Copyright 2009-2015 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */

// Provides a helper that can highlight a given control
sap.ui.predefine('sap/ui/debug/Highlighter', ['jquery.sap.global', 'jquery.sap.dom', 'jquery.sap.script'],
	function(jQuery/* , jQuerySap, jQuerySap1 */) {
	"use strict";


	/**
	 * Creates a new highlighter object without displaying it.
	 *
	 * The DOM node is not created until the first call to method {@link #highlight}.
	 *
	 * @param {string} [sId] id that is used by the new highlighter
	 * @param {boolean} [bFilled] whether the box of the highlighter is partially opaque (20%), defaults to false
	 * @param {string} [sColor] the CSS color of the border and the box (defaults to blue)
	 * @param {int} [iBorderWidth] the width of the border
	 *
	 * @class Helper class to display a colored rectangle around and above a given DOM node
	 * @author Frank Weigel
	 * @since 0.8.7
	 * @public
	 * @alias sap.ui.debug.Highlighter
	 */
	var Highlighter = function(sId, bFilled, sColor, iBorderWidth) {
		this.sId = sId || jQuery.sap.uid();
		this.bFilled = (bFilled == true);
		this.sColor = sColor || 'blue';
		if ( isNaN(iBorderWidth ) ) {
			this.iBorderWidth = 2;
		} else if ( iBorderWidth <= 0 ) {
			this.iBorderWidth = 0;
		} else {
			this.iBorderWidth = iBorderWidth;
		}
	};
	
	/**
	 * Shows a rectangle/box that surrounds the given DomRef.
	 *
	 * If this is the first call to {@link #highlight} for this instance, then
	 * a DOM node for the highlighter is created in the same document as the given <code>oDomRef</code>.
	 *
	 * <b>Note:</b> As the DOM node is reused across multiple calls, the highlighter must only be used
	 * within a single document.
	 */
	Highlighter.prototype.highlight = function(oDomRef) {
		if (!oDomRef || !oDomRef.parentNode) {
			return;
		}
	
		var oHighlightRect = jQuery.sap.domById(this.sId);
		if (!oHighlightRect) {
			oHighlightRect = oDomRef.ownerDocument.createElement("DIV");
			oHighlightRect.setAttribute("id", this.sId);
			oHighlightRect.style.position = "absolute";
			oHighlightRect.style.border = this.iBorderWidth + "px solid " + this.sColor;
			oHighlightRect.style.display = "none";
			oHighlightRect.style.margin = "0px";
			oHighlightRect.style.padding = "0px";
			if ( this.bFilled ) {
				oHighlightRect.innerHTML = "<div style='background-color:" + this.sColor + ";opacity:0.2;filter:progid:DXImageTransform.Microsoft.Alpha(opacity=20);height:100%;width:100%'>&nbsp;</div>";
			}
			oDomRef.ownerDocument.body.appendChild(oHighlightRect);
		}
		var oRect = jQuery(oDomRef).rect();
		oHighlightRect.style.top = (oRect.top - this.iBorderWidth) + "px";
		oHighlightRect.style.left = (oRect.left - this.iBorderWidth) + "px";
		oHighlightRect.style.width = (oRect.width) + "px";
		oHighlightRect.style.height = (oRect.height) + "px";
		oHighlightRect.style.display = "block";
	};
	
	/**
	 * Hides the rectangle/box if it is currently shown.
	 */
	Highlighter.prototype.hide = function() {
		var oHighlightRect = jQuery.sap.domById(this.sId);
		if (!oHighlightRect) {
			return;
		}
		oHighlightRect.style.display = "none";
	};

	return Highlighter;

}, /* bExport= */ true);
/*!
 * UI development toolkit for HTML5 (OpenUI5)
 * (c) Copyright 2009-2015 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */

// Provides a log viewer for debug purposes
sap.ui.predefine('sap/ui/debug/LogViewer', function() {
	"use strict";


	/**
	 * Constructs a LogViewer in the given window, embedded into the given DOM element.
	 * If the DOM element doesn't exist, a DIV is created.
	 *
	 * @param {Window} oTargetWindow the window where the log will be displayed in
	 * @param {sRootId} sRootId id of the top level element that will contain the log entries
	 *
	 * @class HTML LogViewer that displays all entries of a Logger, as long as they match a filter and a minimal log level
	 * @alias sap.ui.debug.LogViewer
	 */
	var LogViewer = function(oWindow, sRootId) {
		this.oWindow = oWindow;
		this.oDomNode = oWindow.document.getElementById(sRootId);
		if (!this.oDomNode) {
			var oDiv = this.oWindow.document.createElement("DIV");
			oDiv.setAttribute("id", sRootId);
			oDiv.style.overflow = "auto";
			oDiv.style.tabIndex = "-1";
			oDiv.style.position = "absolute";
			oDiv.style.bottom = "0px";
			oDiv.style.left = "0px";
			oDiv.style.right = "202px";
			oDiv.style.height = "200px";
			oDiv.style.border = "1px solid gray";
			oDiv.style.fontFamily = "Arial monospaced for SAP,monospace";
			oDiv.style.fontSize   = "11px";
			oDiv.style.zIndex = "999999";
			this.oWindow.document.body.appendChild(oDiv);
			this.oDomNode = oDiv;
		}
		this.iLogLevel = 3; /* jQuery.sap.log.LogLevel.INFO */
		this.sLogEntryClassPrefix = undefined;
		this.clear();
		this.setFilter(LogViewer.NO_FILTER);
	};
	
	LogViewer.NO_FILTER = function(oLogMessage) {
		return true;
	};
	
	LogViewer.prototype.clear = function() {
		this.oDomNode.innerHTML = "";
	};
	
	/**
	 * Returns an XML escaped version of a given string sText
	 * @param {string} sText the string that is escaped.
	 * @return {string} an XML escaped version of a given string sText
	 * @private
	 */
	LogViewer.xmlEscape = function(sText) {
		sText = sText.replace(/\&/g, "&amp;");
		sText = sText.replace(/\</g, "&lt;");
		sText = sText.replace(/\"/g, "&quot;");
		return sText;
	};
	/**
	 * Renders a single log entry to the DOM. Could be overwritten in subclasses.
	 * @param {object} oLogEntry
	 * @protected
	 */
	LogViewer.prototype.addEntry = function(oLogEntry) {
	
		var oDomEntry = this.oWindow.document.createElement("div");
	
		// style the entry
		if ( this.sLogEntryClassPrefix ) {
			// note: setting a class has only an effect when the main.css is loaded (testsuite)
			oDomEntry.className = this.sLogEntryClassPrefix + oLogEntry.level;
		} else {
			oDomEntry.style.overflow = "hidden";
			oDomEntry.style.textOverflow = "ellipsis";
			oDomEntry.style.height = "1.3em";
			oDomEntry.style.width = "100%";
			oDomEntry.style.whiteSpace = "noWrap";
		}
	
		// create text as text node
		var sText = LogViewer.xmlEscape(oLogEntry.time + "  " + oLogEntry.message),
			oTextNode = this.oWindow.document.createTextNode(sText);
		oDomEntry.appendChild(oTextNode);
		oDomEntry.title = oLogEntry.message;
	
		// filter
		oDomEntry.style.display = this.oFilter(sText) ? "" : "none";
	
		this.oDomNode.appendChild(oDomEntry);
	
		return oDomEntry;
	};
	
	LogViewer.prototype.fillFromLogger = function(iFirstEntry) {
		this.clear();
		this.iFirstEntry = iFirstEntry;
		if ( !this.oLogger ) {
			return;
		}
	
		// when attached to a log, clear the dom node and add all entries from the log
		var aLog = this.oLogger.getLog();
		for (var i = this.iFirstEntry,l = aLog.length;i < l;i++) {
			if ( aLog[i].level <= this.iLogLevel ) {
				this.addEntry(aLog[i]);
			}
		}
	
		this.scrollToBottom();
	};
	
	LogViewer.prototype.scrollToBottom = function() {
		this.oDomNode.scrollTop = this.oDomNode.scrollHeight;
	};
	
	LogViewer.prototype.truncate = function() {
		this.clear();
		this.fillFromLogger(this.oLogger.getLog().length);
	};
	
	LogViewer.prototype.setFilter = function(oFilter) {
		this.oFilter = oFilter = oFilter || LogViewer.NO_FILTER;
		var childNodes = this.oDomNode.childNodes;
		for (var i = 0,l = childNodes.length; i < l; i++) {
			var sText = childNodes[i].innerText;
			if (!sText) {
				sText = childNodes[i].innerHTML;
			}
			childNodes[i].style.display = oFilter(sText) ? "" : "none";
		}
		this.scrollToBottom();
	};
	
	LogViewer.prototype.setLogLevel = function(iLogLevel) {
		this.iLogLevel = iLogLevel;
		if ( this.oLogger ) {
			this.oLogger.setLevel(iLogLevel);
		}
		// fill and filter again
		this.fillFromLogger(this.iFirstEntry);
	};
	
	LogViewer.prototype.lock = function() {
		this.bLocked = true;
		//this.oDomNode.style.backgroundColor = 'gray'; // marker for 'locked' state
	};
	
	LogViewer.prototype.unlock = function() {
		this.bLocked = false;
		//this.oDomNode.style.backgroundColor = ''; // clear 'locked' marker
		this.fillFromLogger(0);
		// this.addEntry({ time : '---------', message: '---------------', level : 3});
	};
	
	LogViewer.prototype.onAttachToLog = function(oLogger) {
		this.oLogger = oLogger;
		this.oLogger.setLevel(this.iLogLevel);
		if ( !this.bLocked ) {
			this.fillFromLogger(0);
		}
	};
	
	LogViewer.prototype.onDetachFromLog = function(oLogger) {
		this.oLogger = undefined;
		this.fillFromLogger(0); // clears the viewer
	};
	
	LogViewer.prototype.onLogEntry = function(oLogEntry) {
		if ( !this.bLocked ) {
			var oDomRef = this.addEntry(oLogEntry);
			if ( oDomRef && oDomRef.style.display !== 'none' ) {
				this.scrollToBottom();
			}
		}
	};

	return LogViewer;

}, /* bExport= */ true);
/*!
 * UI development toolkit for HTML5 (OpenUI5)
 * (c) Copyright 2009-2015 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */

// Provides a (modifiable) list of properties for a given control
sap.ui.predefine('sap/ui/debug/PropertyList', ['jquery.sap.global', 'sap/ui/base/DataType', 'sap/ui/base/EventProvider', 'sap/ui/core/Element', 'sap/ui/core/ElementMetadata', 'jquery.sap.strings', 'jquery.sap.encoder'],
	function(jQuery, DataType, EventProvider, Element, ElementMetadata/* , jQuerySap */) {
	"use strict";


	/**
	 * Constructs the class <code>sap.ui.debug.PropertyList</code>.
	 *
	 * @class HTML Property list for a <code>sap.ui.core.Control</code> in the
	 * Debug Environment
	 *
	 * @extends sap.ui.base.EventProvider
	 * @author Martin Schaus
	 * @version 1.32.9
	 *
	 * @param {sap.ui.core.Core}
	 *            oCore the core instance to use for analysis
	 * @param {Window}
	 *            oWindow reference to the window object
	 * @param {object}
	 *            oParentDomRef reference to the parent DOM element
	 *
	 * @constructor
	 * @alias sap.ui.debug.PropertyList
	 * @private
	 */
	var PropertyList = EventProvider.extend("sap.ui.debug.PropertyList", /** @lends sap.ui.debug.PropertyList.prototype */ {
		constructor: function(oCore, oWindow, oParentDomRef) {
			EventProvider.apply(this,arguments);
			this.oWindow = oWindow;
			this.oParentDomRef = oParentDomRef;
		//	this.oCore = oWindow.sap.ui.getCore();
			this.oCore = oCore;
			this.bEmbedded = top.window == oWindow; // check only with ==, not === as the test otherwise fails on IE8
			this.mProperties = {};
			var that = this;
			jQuery(oParentDomRef).bind("click",function(evt) {
				that.onclick(evt);
			})
			.bind("focusin",function(evt) {
				that.onfocus(evt);
			})
			.bind("keydown",function(evt) {
				that.onkeydown(evt);
			});
			if ( !this.bEmbedded ) {
				jQuery(oParentDomRef).bind("mouseover",function(evt) {
					that.onmouseover(evt);
				})
				.bind("mouseout",function(evt) {
					that.onmouseout(evt);
				});
			}
			//this.oParentDomRef.style.backgroundColor = "#e0e0e0";
			this.oParentDomRef.style.border = "solid 1px gray";
			this.oParentDomRef.style.padding = "2px";
		
		}
	});
	
	/**
	 * TODO: missing internal JSDoc... @author please update
	 * @private
	 */
	PropertyList.prototype.exit = function() {
		jQuery(this.oParentDomRef).unbind();
	};
	
	/**
	 * TODO: missing internal JSDoc... @author please update
	 * @private
	 */
	PropertyList.prototype.update = function(oParams) {
		var sControlId = oParams.getParameter("controlId");
		this.oParentDomRef.innerHTML = "";
	
		var oControl = this.oCore.byId(sControlId);
		if (!oControl) {
			this.oParentDomRef.innerHTML = "Please select a valid control";
			return;
		}
		if (!oControl.getMetadata || !oControl.getMetadata()) {
			this.oParentDomRef.innerHTML = "Control does not provide Metadata.";
			return;
		}
		this.mProperties = {};
		var oMetadata = oControl.getMetadata(),
			aHTML = [];
		aHTML.push("<span data-sap-ui-quickhelp='" + this._calcHelpId(oMetadata) + "'>Type : " + oMetadata.getName() + "</span><br >");
		aHTML.push("Id : " + oControl.getId() + "<br >");
		aHTML.push("<button id='sap-debug-propertylist-apply' sap-id='" + sControlId + "' style='border:solid 1px gray;background-color:#d0d0d0;font-size:8pt;'>Apply Changes</button>");
		if ( !this.bEmbedded ) {
			aHTML.push("<div id='sap-ui-quickhelp' style='position:fixed;display:none;padding:5px;background-color:rgb(200,220,231);border:1px solid gray;overflow:hidden'>Help</div>");
		}
		aHTML.push("<div style='border-bottom:1px solid gray'>&nbsp;</div><table cellspacing='1' style='font-size:8pt;width:100%;table-layout:fixed'>");
	
		while ( oMetadata instanceof ElementMetadata ) {
			var mProperties = oMetadata.getProperties();
			var bHeaderCreated = false;
			if ( !jQuery.isEmptyObject(mProperties) ) {
				if ( !bHeaderCreated && oMetadata !== oControl.getMetadata() ) {
					aHTML.push("<tr><td colspan=\"2\">BaseType: ");
					aHTML.push(oMetadata.getName());
					aHTML.push("</td></tr>");
					bHeaderCreated = true;
				}
				this.printProperties(aHTML, oControl, mProperties);
			}
			var mProperties = this.getAggregationsAsProperties(oMetadata);
			if ( !jQuery.isEmptyObject(mProperties) ) {
				if ( !bHeaderCreated && oMetadata !== oControl.getMetadata() ) {
					aHTML.push("<tr><td colspan=\"2\">BaseType: ");
					aHTML.push(oMetadata.getName());
					aHTML.push("</td></tr>");
					bHeaderCreated = true;
				}
				this.printProperties(aHTML, oControl, mProperties);
			}
			oMetadata = oMetadata.getParent();
		}
	
		aHTML.push("</table>");
		this.oParentDomRef.innerHTML = aHTML.join("");
		this.mHelpDocs = {};
	};
	
	PropertyList.prototype.getAggregationsAsProperties = function(oMetadata) {
	
		function isSimpleType(sType) {
			if ( !sType ) {
				return false;
			}
	
			if ( sType.indexOf("[]") > 0 ) {
				sType = sType.substring(sType.indexOf("[]"));
			}
	
			if ( sType === "boolean" || sType === "string" || sType === "int" || sType === "float" ) {
				return true;
			}
	
			if ( sType === "void" ) {
				return false;
			}
	
			// TODO check for enum
	
			return false;
		}
	
		var oResult = {};
		for (var sAggrName in oMetadata.getAggregations() ) {
			var oAggr = oMetadata.getAggregations()[sAggrName];
			if ( oAggr.altTypes && oAggr.altTypes[0] && isSimpleType(oAggr.altTypes[0]) ) {
				oResult[sAggrName] = { name : sAggrName, type : oAggr.altTypes[0], _oParent : oAggr._oParent };
			}
		}
		return oResult;
	
	};
	
	/**
	 * TODO: missing internal JSDoc... @author please update
	 * @private
	 */
	PropertyList.prototype.printProperties = function(aHTML, oControl, mProperties, bAggregation) {
		for (var i in mProperties) {
			var sName = i,
				sType = mProperties[i].type,
				oMethod =  oControl["get" + sName];
			if (!oMethod) {
				sName = jQuery.sap.charToUpperCase(sName,0);
			}
			var oValue = oControl["get" + sName]();
			aHTML.push("<tr><td>");
			this.mProperties[sName] = sType;
			aHTML.push("<span data-sap-ui-quickhelp='", this._calcHelpId(mProperties[i]._oParent, i), "' >", sName, '</span>');
			aHTML.push("</td><td>");
			var sTitle = "";
			if (sType == "string" || sType == "int" || sType == "float" || jQuery.sap.endsWith(sType, "[]")) {
				var sColor = '';
				if ( oValue === null ) {
					sColor = 'color:#a5a5a5;';
					oValue = '(null)';
				} else if ( oValue  instanceof Element ) {
					sColor = 'color:#a5a5a5;';
					if (jQuery.isArray(oValue)) {
						// array type (copied from primitive values above and modified the value to string / comma separated)
						oValue = oValue.join(", ");
					} else {
						oValue = oValue.toString();
					}
					sTitle = ' title="This aggregation currently references an Element. You can set a ' + sType +  ' value instead"';
				}
				aHTML.push("<input type='text' style='width:100%;font-size:8pt;background-color:#f5f5f5;" + sColor + "' value='" + jQuery.sap.encodeHTML("" + oValue) + "'" + sTitle + " sap-name='" + sName + "'/>");
			} else if (sType == "boolean") {
				aHTML.push("<input type='checkbox' sap-name='" + sName + "' ");
				if (oValue == true) {
					aHTML.push("checked='checked'");
				}
				aHTML.push("/>");
			} else if (sType != "void") {
				//Enum or Custom Type
				var oEnum = jQuery.sap.getObject(sType);
				if (!oEnum || oEnum instanceof DataType) {
					aHTML.push("<input type='text' style='width:100%;font-size:8pt;background-color:#f5f5f5;' value='" + jQuery.sap.encodeHTML("" + oValue) + "'" + sTitle + " sap-name='" + sName + "'/>");
				} else {
					aHTML.push("<select style='width:100%;font-size:8pt;background-color:#f5f5f5;' sap-name='" + sName + "'>");
					sType = sType.replace("/",".");
					for (var n in oEnum) {
						aHTML.push("<option ");
						if (n == oValue) {
							aHTML.push(" selected ");
						}
						aHTML.push("value='" + sType + "." + n + "'>");
						aHTML.push(n);
						aHTML.push("</option>");
					}
					aHTML.push("</select>");
				}
			} else {
				aHTML.push("&nbsp;");
			}
			aHTML.push("</td></tr>");
		}
	};
	
	/**
	 * TODO: missing internal JSDoc... @author please update
	 * @private
	 */
	PropertyList.prototype.onkeydown = function(oEvent) {
		if (oEvent.keyCode == 13) {
			this.applyChanges("sap-debug-propertylist-apply");
		}
	};
	
	/**
	 * TODO: missing internal JSDoc... @author please update
	 * @private
	 */
	PropertyList.prototype.onclick = function(oEvent) {
		var oSource = oEvent.target;
		if (oSource.id == "sap-debug-propertylist-apply") {
			this.applyChanges("sap-debug-propertylist-apply");
		}
	};
	
	/**
	 * TODO: missing internal JSDoc... @author please update
	 * @private
	 */
	PropertyList.prototype.onfocus = function(oEvent) {
		var oSource = oEvent.target;
		if (oSource.tagName === "INPUT" && oSource.getAttribute("sap-name") ) {
			if ( oSource.style.color === '#a5a5a5' /* && oSource.value === '(null)' */ ) {
				oSource.style.color = '';
				oSource.value = '';
			}
		}
	};
	
	/**
	 * TODO: missing internal JSDoc... @author please update
	 * @private
	 */
	PropertyList.prototype.applyChanges = function(sId) {
		var oSource = this.oParentDomRef.ownerDocument.getElementById(sId),
			sControlId = oSource.getAttribute("sap-id"),
			oControl = this.oCore.byId(sControlId),
			aInput = oSource.parentNode.getElementsByTagName("INPUT"),
			aSelect = oSource.parentNode.getElementsByTagName("SELECT"),
			oMethod;
	
		for (var i = 0; i < aInput.length; i++) {
			var oInput = aInput[i],
				sName = oInput.getAttribute("sap-name");
				oMethod = oControl["set" + sName];
			if (!oMethod) {
				sName = jQuery.sap.charToUpperCase(sName,0);
			}
			if (oControl["set" + sName]) {
				var oType = DataType.getType(this.mProperties[sName]);
				var vValue = this.mProperties[sName] === "boolean" ? oInput.checked : oType.parseValue(oInput.value);
				if (oType.isValid(vValue) && vValue !== "(null)" ) {
					oControl["set" + sName](vValue);
				}
			}
		}
		for (var i = 0; i < aSelect.length; i++) {
			var oSelect = aSelect[i],
				sName = oSelect.getAttribute("sap-name");
			oMethod = oControl["set" + sName];
			if (!oMethod) {
				sName = jQuery.sap.charToUpperCase(sName,0);
			}
			var oValue = null;
			if (oSelect.value) {
				/*eslint-disable no-eval */
				eval("oValue = " + oSelect.value);
				oControl["set" + sName](oValue);
				/*eslint-enable no-eval */
			}
		}
		this.oCore.applyChanges();
	};
	
	PropertyList.prototype.showQuickHelp = function(oSource) {
		if ( this.oQuickHelpTimer ) {
			clearTimeout(this.oQuickHelpTimer);
			this.oQuickHelpTimer = undefined;
		}
		var oTooltipDomRef = this.oParentDomRef.ownerDocument.getElementById("sap-ui-quickhelp");
		if ( oTooltipDomRef ) {
			this.sCurrentHelpId = oSource.getAttribute("data-sap-ui-quickhelp");
			var oRect = jQuery(oSource).rect();
			oTooltipDomRef.style.left = (oRect.left + 40 + 10) + "px";
			oTooltipDomRef.style.top = (oRect.top - 40) + "px";
			oTooltipDomRef.style.display = 'block';
			oTooltipDomRef.style.opacity = '0.2';
			oTooltipDomRef.style.filter = 'progid:DXImageTransform.Microsoft.Alpha(opacity=20)';
			if ( this.mHelpDocs[this.sCurrentHelpId] ) {
				this.updateQuickHelp(this.mHelpDocs[this.sCurrentHelpId], 2000);
			} else {
				oTooltipDomRef.innerHTML = "<b>Quickhelp</b> for " + this.sCurrentHelpId + " is being retrieved...";
				this.sCurrentHelpDoc = this.sCurrentHelpId;
				this.sCurrentHelpDocPart = undefined;
				if ( this.sCurrentHelpId.indexOf('#') >= 0 ) {
					this.sCurrentHelpDoc = this.sCurrentHelpId.substring(0, this.sCurrentHelpId.indexOf('#'));
					this.sCurrentHelpDocPart = this.sCurrentHelpId.substring(this.sCurrentHelpId.indexOf('#') + 1);
				}
				var sUrl = this.oWindow.jQuery.sap.getModulePath(this.sCurrentHelpDoc, ".control");
				var that = this;
				jQuery.ajax({
					async: true,
					url : sUrl,
					dataType : 'xml',
					error : function(xhr,status) {
						that.receiveQuickHelp(undefined);
					},
					success : function(data) {
						that.receiveQuickHelp(data);
					}
				});
				this.oQuickHelpTimer = setTimeout(function () {
					that.hideQuickHelp();
				}, 2000);
			}
		}
	};
	
	// ---- Quickhelp ----
	
	PropertyList.prototype.receiveQuickHelp = function(oDocument) {
		if ( oDocument ) {
			var oControlNode = oDocument.getElementsByTagName("control")[0];
			if ( oControlNode ) {
				// debugger;
				var get = function(oXMLNode, sName) {
					var result = [];
					var oCandidate = oXMLNode.firstChild;
					while ( oCandidate ) {
						if ( sName === oCandidate.nodeName ) {
							result.push(oCandidate);
						}
						oCandidate = oCandidate.nextSibling;
					}
					return result;
				};
				var aName = get(oControlNode, "name");
				var sName = '';
				if ( aName[0] ) {
					sName = aName[0].text || aName[0].textContent;
				}
				var aDocumentation = get(oControlNode, "documentation");
				if ( aDocumentation[0] ) {
					if ( sName && aDocumentation[0] ) {
						var doc = [];
						doc.push("<div style='font-size:10pt;font-weight:bold;padding:5px 0px;margin-bottom:5px;border-bottom:1px solid gray'>", sName.replace('/', '.'), "</div>");
						doc.push("<div style='padding:2px 0px;'>", aDocumentation[0].text || aDocumentation[0].textContent, "</div>");
						this.mHelpDocs[this.sCurrentHelpDoc] = doc.join("");
					}
				}
				var aProperties = get(oControlNode, "properties");
				if ( aProperties[0] ) {
					aProperties = get(aProperties[0], "property");
				}
				for (var i = 0, l = aProperties.length; i < l; i++) {
					var oProperty = aProperties[i];
					var sName = oProperty.getAttribute("name");
					var sType = oProperty.getAttribute("type") || "string";
					var sDefaultValue = oProperty.getAttribute("defaultValue") || "empty/undefined";
					var aDocumentation = get(oProperty, "documentation");
					if ( sName && aDocumentation[0] ) {
						var doc = [];
						doc.push("<div style='font-size:10pt;font-weight:bold;padding:3px 0px;margin-bottom:3px;border-bottom:1px solid gray'>", sName, "</div>");
						doc.push("<div style='padding:2px 0px;'><i><strong>Type</strong></i>: ", sType, "</div>");
						doc.push("<div style='padding:2px 0px;'>", aDocumentation[0].text || aDocumentation[0].textContent, "</div>");
						doc.push("<div style='padding:2px 0px;'><i><strong>Default Value</strong></i>: ", sDefaultValue, "</div>");
						this.mHelpDocs[this.sCurrentHelpDoc + "#" + sName] = doc.join("");
					}
				}
				var aProperties = get(oControlNode, "aggregations");
				if ( aProperties[0] ) {
					aProperties = get(aProperties[0], "aggregation");
				}
				for (var i = 0, l = aProperties.length; i < l; i++) {
					var oProperty = aProperties[i];
					var sName = oProperty.getAttribute("name");
					var sType = oProperty.getAttribute("type") || "sap.ui.core/Control";
					var sDefaultValue = oProperty.getAttribute("defaultValue") || "empty/undefined";
					var aDocumentation = get(oProperty, "documentation");
					if ( sName && aDocumentation[0] && !this.mHelpDocs[this.sCurrentHelpDoc + "#" + sName]) {
						var doc = [];
						doc.push("<div style='font-size:10pt;font-weight:bold;padding:3px 0px;margin-bottom:3px;border-bottom:1px solid gray'>", sName, "</div>");
						doc.push("<div style='padding:2px 0px;'><i><strong>Type</strong></i>: ", sType, "</div>");
						doc.push("<div style='padding:2px 0px;'>", aDocumentation[0].text || aDocumentation[0].textContent, "</div>");
						doc.push("<div style='padding:2px 0px;'><i><strong>Default Value</strong></i>: ", sDefaultValue, "</div>");
						this.mHelpDocs[this.sCurrentHelpDoc + "#" + sName] = doc.join("");
					}
				}
			}
			if ( this.mHelpDocs[this.sCurrentHelpId] ) {
				this.updateQuickHelp(this.mHelpDocs[this.sCurrentHelpId], 2000);
			} else {
				this.updateQuickHelp(undefined, 0);
			}
		} else {
			this.updateQuickHelp(undefined, 0);
		}
	};
	
	PropertyList.prototype.updateQuickHelp = function(sNewContent, iTimeout) {
		if ( this.oQuickHelpTimer ) {
			clearTimeout(this.oQuickHelpTimer);
			this.oQuickHelpTimer = undefined;
		}
		var oTooltipDomRef = this.oParentDomRef.ownerDocument.getElementById("sap-ui-quickhelp");
		if ( oTooltipDomRef ) {
			if ( !sNewContent ) {
				oTooltipDomRef.innerHTML = "<i>No quick help...</i>";
				oTooltipDomRef.style.display = 'none';
			} else {
				oTooltipDomRef.innerHTML = sNewContent;
				var that = this;
				this.oQuickHelpTimer = setTimeout(function () {
					that.hideQuickHelp();
				}, iTimeout);
			}
		}
	};
	
	PropertyList.prototype.hideQuickHelp = function() {
		var oTooltipDomRef = this.oParentDomRef.ownerDocument.getElementById("sap-ui-quickhelp");
		if ( oTooltipDomRef ) {
			oTooltipDomRef.style.display = 'none';
		}
		this.bMovedOverTooltip = false;
	};
	
	PropertyList.prototype._calcHelpId = function(oMetadata, sName) {
		var sHelpId = oMetadata.getName();
		if ( sName ) {
			sHelpId = sHelpId + "#" + sName;
		}
		return sHelpId;
	};
	
	PropertyList.prototype._isChildOfQuickHelp = function(oDomRef) {
		while ( oDomRef ) {
			if ( oDomRef.id === "sap-ui-quickhelp" ) {
				return true;
			}
			oDomRef = oDomRef.parentNode;
		}
		return false;
	};
	
	/**
	 * TODO: missing internal JSDoc... @author please update
	 * @private
	 */
	PropertyList.prototype.onmouseover = function(oEvent) {
		var oSource = oEvent.target;
		if ( this._isChildOfQuickHelp(oSource) ) {
			// if the user enteres the tooltip with the mouse, we don't close it automatically
			if ( this.oQuickHelpTimer ) {
				clearTimeout(this.oQuickHelpTimer);
				this.oQuickHelpTimer = undefined;
			}
			this.bMovedOverTooltip = true;
			var oTooltipDomRef = this.oParentDomRef.ownerDocument.getElementById("sap-ui-quickhelp");
			if ( oTooltipDomRef ) {
				oTooltipDomRef.style.opacity = '';
				oTooltipDomRef.style.filter = '';
			}
		} else if ( oSource.getAttribute("data-sap-ui-quickhelp") ) {
			this.showQuickHelp(oSource);
		}
	};
	
	/**
	 * TODO: missing internal JSDoc... @author please update
	 * @private
	 */
	PropertyList.prototype.onmouseout = function(oEvent) {
		var oSource = oEvent.target;
		if ( this._isChildOfQuickHelp(oSource) ) {
			if ( this.oQuickHelpTimer ) {
				clearTimeout(this.oQuickHelpTimer);
				this.oQuickHelpTimer = undefined;
			}
			this.bMovedOverTooltip = false;
			var that = this;
			this.oQuickHelpTimer = setTimeout(function () {
				that.hideQuickHelp();
			}, 50);
		} else if (oSource.getAttribute("data-sap-ui-quickhelp")) {
			if ( this.oQuickHelpTimer ) {
				clearTimeout(this.oQuickHelpTimer);
				this.oQuickHelpTimer = undefined;
			}
			if ( !this.bMovedOverTooltip ) {
				var that = this;
				this.oQuickHelpTimer = setTimeout(function () {
					that.hideQuickHelp();
				}, 800);
			}
		}
	};

	return PropertyList;

});
jQuery.sap.require("sap.ui.debug.DebugEnv");
