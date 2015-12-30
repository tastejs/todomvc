/*!
 * UI development toolkit for HTML5 (OpenUI5)
 * (c) Copyright 2009-2015 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */

// Provides a tree of controls for the testsuite
sap.ui.define('sap/ui/debug/ControlTree', ['jquery.sap.global', 'sap/ui/base/EventProvider', 'sap/ui/core/Element', 'sap/ui/core/UIArea', './Highlighter'],
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
