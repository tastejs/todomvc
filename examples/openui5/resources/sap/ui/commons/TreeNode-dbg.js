/*!
 * UI development toolkit for HTML5 (OpenUI5)
 * (c) Copyright 2009-2015 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */

// Provides control sap.ui.commons.TreeNode.
sap.ui.define(['jquery.sap.global', './library', 'sap/ui/core/CustomStyleClassSupport', 'sap/ui/core/Element'],
	function(jQuery, library, CustomStyleClassSupport, Element) {
	"use strict";


	/**
	 * Constructor for a new TreeNode.
	 *
	 * @param {string} [sId] id for the new control, generated automatically if no id is given
	 * @param {object} [mSettings] initial settings for the new control
	 *
	 * @class
	 * Tree node element
	 * @extends sap.ui.core.Element
	 * @version 1.32.9
	 *
	 * @constructor
	 * @public
	 * @alias sap.ui.commons.TreeNode
	 * @ui5-metamodel This control/element also will be described in the UI5 (legacy) designtime metamodel
	 */
	var TreeNode = Element.extend("sap.ui.commons.TreeNode", /** @lends sap.ui.commons.TreeNode.prototype */ { metadata : {

		library : "sap.ui.commons",
		properties : {

			/**
			 * Node text
			 */
			text : {type : "string", group : "Misc", defaultValue : null},

			/**
			 * Node is expanded
			 */
			expanded : {type : "boolean", group : "Misc", defaultValue : true},

			/**
			 * Should the node has an expander.
			 */
			hasExpander : {type : "boolean", group : "Misc", defaultValue : false},

			/**
			 * Icon to display in front of the node
			 */
			icon : {type : "sap.ui.core.URI", group : "Misc", defaultValue : null},

			/**
			 * Node is selected
			 */
			isSelected : {type : "boolean", group : "Misc", defaultValue : false},

			/**
			 * The node is selectable. If true, clicking on the node text triggers "selected" event
			 */
			selectable : {type : "boolean", group : "Misc", defaultValue : true}
		},
		defaultAggregation : "nodes",
		aggregations : {

			/**
			 * Subnodes for the current node
			 */
			nodes : {type : "sap.ui.commons.TreeNode", multiple : true, singularName : "node"}
		},
		associations : {
			/**
			 * When this node is collapsed and it has selected children, it looks as if it were
			 * selected itself.
			 * This association holds the references of the selected children.
			 */
			selectedForNodes : { type : "sap.ui.commons.TreeNode", multiple: true, singularName: "selectedForNode", visibility: "hidden" },

			/**
			 * Association to controls / ids which describe this control (see WAI-ARIA attribute aria-describedby).
			 */
			ariaDescribedBy : {type : "sap.ui.core.Control", multiple : true, singularName : "ariaDescribedBy"},

			/**
			 * Association to controls / ids which label this control (see WAI-ARIA attribute aria-labelledby).
			 */
			ariaLabelledBy : {type : "sap.ui.core.Control", multiple : true, singularName : "ariaLabelledBy"}
		},
		events : {

			/**
			 * Node state has changed.
			 */
			toggleOpenState : {
				parameters : {

					/**
					 * Node has been opened if true
					 */
					opened : {type : "boolean"}
				}
			},

			/**
			 * Node is selected
			 */
			selected : {}
		}
	}});


	TreeNode.ANIMATION_DURATION	 = 600;

	CustomStyleClassSupport.apply(TreeNode.prototype);

	//***********************************************************************************
	//* PUBLIC METHODS
	//***********************************************************************************

	/**
	 * Expands the node.
	 * @param {boolean} bExpandChildren Propagates expand to node's children
	 * @param {boolean} bDisableExpandFinishedHandler Disables the expand finished handler
	 * @public
	 * @ui5-metamodel This method also will be described in the UI5 (legacy) designtime metamodel
	 */
	TreeNode.prototype.expand = function(bExpandChildren, bDisableExpandFinishedHandler){
		//Change property anyway. (Even if node has no expander)
		this.setProperty("expanded", true, true); //Suppress Re-rendering

		var expandFinished = null;
		if (!bDisableExpandFinishedHandler) {
			expandFinished = expandFinishedHandler.bind(this);
		}

		var oDomNode = this.$();
		if (oDomNode.hasClass("sapUiTreeNodeCollapsed")) {
			//If not, not an expandable node
			oDomNode.toggleClass("sapUiTreeNodeCollapsed");
			oDomNode.toggleClass("sapUiTreeNodeExpanded");
			oDomNode.attr("aria-expanded", "true");

			var oDomChildrenNodes = this.$("children");
			if (oDomChildrenNodes) {
				if (bExpandChildren) {
					//show without animation
					oDomChildrenNodes.show();
				} else {
					//stop any animations, before next animate
					oDomChildrenNodes.stop(true, true);
					oDomChildrenNodes.show(TreeNode.ANIMATION_DURATION, expandFinished);
				}
				//In Chrome jQuery .show() method sporadically fails to set display property to child nodes and they remain hidden.
				//and it never came back from display block...
				oDomChildrenNodes.css({display:'block'});
			}
			this.fireToggleOpenState({opened:true});
		}

		if (bExpandChildren) {
			var aNodes = this._getNodes();
			for (var i = 0;i < aNodes.length;i++) {
				aNodes[i].expand(bExpandChildren, true);
			}

			expandFinished && expandFinished();
		}
	};

	/**
	 * Collapses the node.
	 * @param {boolean} bCollapseChildren Propagates collapse to node's children
	 * @param {boolean} bDisableCollapseFinishedHandler Disables the collapse finished handler
	 * @public
	 * @ui5-metamodel This method also will be described in the UI5 (legacy) designtime metamodel
	 */
	TreeNode.prototype.collapse = function(bCollapseChildren, bDisableCollapseFinishedHandler){
		//Change property anyway. (Even if node has no expander)
		this.setProperty("expanded", false, true); //Suppress Re-rendering

		var collapseFinished = null;
		if (!bDisableCollapseFinishedHandler) {
			collapseFinished = collapseFinishedHandler.bind(this);
		}

		var oDomNode = this.$();
		if (oDomNode.hasClass("sapUiTreeNodeExpanded")) {
			//If not, not a collapsable node
			oDomNode.toggleClass("sapUiTreeNodeCollapsed");
			oDomNode.toggleClass("sapUiTreeNodeExpanded");
			oDomNode.attr("aria-expanded", "false");

			var oDomChildrenNodes = this.$("children");
			if (oDomChildrenNodes) {
				if (bCollapseChildren) {
					//hide without animation
					oDomChildrenNodes.hide();
				} else {
					//stop any animations, before next animate
					oDomChildrenNodes.stop(true, true);
					oDomChildrenNodes.hide(TreeNode.ANIMATION_DURATION, collapseFinished);
				}
			}
			this.fireToggleOpenState({opened:false});
		}

		if (bCollapseChildren) {
			var aNodes = this._getNodes();
			for (var i = 0;i < aNodes.length;i++) {
				aNodes[i].collapse(bCollapseChildren, true);
			}

			collapseFinished && collapseFinished();
		}
	};

	/**
	 * Select the node, and if any, deselects the previously selected node
	 * @param {boolean} bSuppressEvent
	 * @param {boolean} bDeselectOtherNodes
	 * @public
	 * @ui5-metamodel This method also will be described in the UI5 (legacy) designtime metamodel
	 */
	TreeNode.prototype.select = function(bSuppressEvent) {
		var oTree = this.getTree();

		// If connected to a tree call setSelection, otherwise call _select directly
		if (oTree) {
			oTree.setSelection(this, bSuppressEvent);
		} else {
			this._select();
		}

	};

	//***********************************************************************************
	//* SELECTION PRIVATE METHODS
	//***********************************************************************************

	/**
	 * Called only when the root expanding node has expanded, including children.
	 */
	function expandFinishedHandler() {
		var oTree = this.getTree();
		if (oTree) {
			oTree._adjustSelectionOnExpanding(this);
		}
	}

	/**
	 * Called only when the root collapsing node has collapsed, including children.
	 */
	function collapseFinishedHandler() {
		var oTree = this.getTree();
		if (oTree) {
			oTree._adjustSelectionOnCollapsing(this);
			oTree._adjustFocus();
		}
	}

	/**Select the node
	 * @private
	 */
	TreeNode.prototype._select = function(bSuppressEvent) {
		this.setProperty("isSelected", true, true);

		if (!bSuppressEvent) {
			this.fireSelected();
		}

		// If node is already rendered, then update the DOM and scroll into view
		if (this.getDomRef()) {
			this.$().closest(".sapUiTreeNode").addClass("sapUiTreeNodeSelected").attr("aria-selected", "true");
			this.scrollIntoView();
		}
	};

	/**Deselect the node
	 * @private
	 */
	TreeNode.prototype._deselect = function(bSuppressEvent) {
		this.setProperty("isSelected", false, true);

		// If node is already rendered, then update the DOM
		if (this.getDomRef()) {
			this.$().removeClass("sapUiTreeNodeSelected").removeAttr("aria-selected");
		}
	};

	/**
	 * Private getter for child nodes without creating a copy of the nodes array
	 */
	TreeNode.prototype._getNodes = function() {
		return this.mAggregations.nodes || [];
	};

	/**Returns true if the node has a selected child node, which is not visible
	 * @returns True if the node has such child node
	 * @private
	 */
	TreeNode.prototype.hasSelectedHiddenChild = function(){
		var aNodes = this._getNodes();
		for (var i = 0;i < aNodes.length;i++) {

			if ((!aNodes[i].isVisible() && aNodes[i].getIsSelected()) || aNodes[i].hasSelectedHiddenChild()) {
				return true;
			}
		}
		return false;
	};

	/**
	 * Redefinition of Setter for property <code>isSelected</code> for validation purpose
	 *
	 * Default value is empty/<code>undefined</code>
	 *
	 * @param {boolean} bIsSelected  new value for property <code>isSelected</code>
	 * @return {sap.ui.commons.TreeNode} <code>this</code> to allow method chaining
	 * @public
	 */
	TreeNode.prototype.setIsSelected = function(bIsSelected) {
		var oTree = this.getTree();

		if (!this.getSelectable()) {
			//Node is not selectable.
			return this;
		}

		if (bIsSelected == this.getProperty("isSelected")) {
			return this;
		}

		if (oTree) {
			oTree._setNodeSelection(this, bIsSelected, true);
		} else {
			this.setProperty("isSelected", bIsSelected, true);
		}
		return this;
	};

	/**
	 * Redefinition of Setter for property <code>selectable</code> for validation purpose.
	 *
	 * Default value is <code>true</code>
	 *
	 * @param {boolean} bSelectable  new value for property <code>selectable</code>
	 * @return {sap.ui.commons.TreeNode} <code>this</code> to allow method chaining
	 * @public
	 */
	TreeNode.prototype.setSelectable = function(bSelectable) {

		if (!bSelectable && this.getIsSelected()) {
			//Setting the node to not selectable: remove selection
			this.setIsSelected(false);
		}

		this.setProperty("selectable", bSelectable);
		return this;
	};




	//***********************************************************************************
	//* EVENTS HANDLING
	//***********************************************************************************

	/** The mouse click event, which will expand/collapse the node
	 * @param {event} oEvent The click event object
	 * @private
	 */
	TreeNode.prototype.onclick = function(oEvent){
		var oDomClicked = oEvent.target,
		oTree = this.getTree();

		if (jQuery(oDomClicked).is(".sapUiTreeNode") || jQuery(oDomClicked).is(".sapUiTreeNodeNotSelectable") ) {
			//When user click a Not-Selectable node text, it behaves as clicking on the node itself
			if (jQuery(oDomClicked).is(".sapUiTreeNodeNotSelectable")) {
				//Get the node itself
				oDomClicked = jQuery(oDomClicked).closest(".sapUiTreeNode")[0];
			}
			//Expand/Collapse
			if (jQuery(oDomClicked).hasClass("sapUiTreeNodeExpanded")) {
				this.collapse();
			} else {
				this.expand();
			}

			oTree.placeFocus(oDomClicked);
			oDomClicked.focus();

		} else if (jQuery(oDomClicked).is(".sapUiTreeNodeContent") || jQuery(oDomClicked).is(".sapUiTreeIcon")) {
			var sSelectionType = sap.ui.commons.Tree.SelectionType.Select;
			if (oTree.getSelectionMode() == sap.ui.commons.TreeSelectionMode.Multi) {
				if (oEvent.shiftKey) {
					sSelectionType = sap.ui.commons.Tree.SelectionType.Range;
				}
				if (oEvent.metaKey || oEvent.ctrlKey) {
					sSelectionType = sap.ui.commons.Tree.SelectionType.Toggle;
				}
			}
			oTree.setSelection(this, false, sSelectionType);

			//Set focus
			oDomClicked = jQuery(oDomClicked).closest(".sapUiTreeNode")[0];
			oTree.placeFocus(oDomClicked);
			oDomClicked.focus();
		}
	};


	//***********************************************************************************
	//* KEYBOARD NAVIGATION
	//***********************************************************************************
	/** The generic selection event (ENTER or SPACE)
	* @param {event} oEvent The sapselect event object
	 * @private
	 */
	TreeNode.prototype.onsapselect = function(oEvent){

		if (this.getSelectable()) {
			this.getTree().setSelection(this);
		} else if (this.getExpanded()) {
			this.collapse();
		} else {
			this.expand();
		}


	};

	/**
	 * The numpad + key event, which will expand the current node
	 * @param {event} oEvent The sapexpand event object
	 * @private
	 */
	TreeNode.prototype.onsapexpand = function(oEvent) {
		this.expand();
	};

	/**
	 * The numpad - key event, which will expand the current node
	 * @private
	 * @param {event} oEvent The sapcollapse event object
	 */
	TreeNode.prototype.onsapcollapse = function(oEvent) {
		this.collapse();

	};

	/**
	* LEFT key behavior
	* Opens the section or activates the UI element on LEFT key
	* @private
	* @param oEvent Browser event
	*/
	TreeNode.prototype.onsapleft = function(oEvent){
		if (sap.ui.getCore().getConfiguration().getRTL()) {
			this.expand();
		} else {
			this.collapse();
		}
		oEvent.preventDefault();
	};

	/**
	* RIGHT key behavior
	* Opens the section or activates the UI element on RIGHT key
	* @private
	* @param oEvent Browser event
	*/
	TreeNode.prototype.onsapright = function(oEvent){
		if (sap.ui.getCore().getConfiguration().getRTL()) {
			this.collapse();
		} else {
			this.expand();
		}
		oEvent.preventDefault();
	};

	//***********************************************************************************
	//* FOCUS HANDLING
	//***********************************************************************************

	/**Focuses the node
	 * @private
	 */
	TreeNode.prototype.focus = function () {
		var domFocus = this.getFocusDomRef();
		if (domFocus) {
			domFocus.setAttribute("tabindex", "0");
			domFocus.focus();
		}
	};

	/**Removes focus from the node
	 * @private
	 */
	TreeNode.prototype.blur = function () {
		var domFocus = this.getFocusDomRef();
		if (domFocus) {
			domFocus.setAttribute("tabindex", "-1");
		}
	};

	//***********************************************************************************
	//* HELPER METHODS
	//***********************************************************************************

	/** Returns the parent tree control. Not necessarily the direct parent if the node is a subnode.
	 * @returns The parent tree control
	 * @private
	 */
	TreeNode.prototype.getTree = function() {
		var parent = this.getParent();

		while (parent instanceof TreeNode) {
			parent = parent.getParent();
		}
		return parent;
	};

	/** Returns true if the node has any subnodes.
	 * @returns True if the node has any subnode
	 * @private
	 */
	TreeNode.prototype.hasChildren = function(){
		var aSubNodes = this._getNodes();
		if (aSubNodes.length) {
			return true;
		}
		return false;
	};

	/** Returns true if the node is visible(parent and all grand parent expanded).
	 * @returns True if the node is visible
	 * @private
	 */
	TreeNode.prototype.isVisible = function(){
		var parent = this.getParent();
		while (parent instanceof TreeNode) {
			if (!parent.getExpanded()) {
				return false;
			}

			parent = parent.getParent();
		}
		return true;
	};

	/**
	 * In case the selected node is not visible, change the scroll position of the
	 * tree to get it into view.
	 *
	 * @return {sap.ui.commons.TreeNode} <code>this</code> to allow method chaining
	 * @private
	 */
	TreeNode.prototype.scrollIntoView = function() {
		var $Node = this.$(),
			$Tree = this.getTree().$(),
			$TreeCont = $Tree.find(".sapUiTreeCont"),
			iOffsetTop = $Node[0].offsetTop,
			iScrollTop = $TreeCont.scrollTop(),
			iHeight = $TreeCont.height(),
			iNewScrollTop,
			iOffsetLeft = $Node[0].offsetLeft,
			iScrollLeft = $TreeCont.scrollLeft(),
			iWidth = $TreeCont.width(),
			iNewScrollLeft;

		if (iOffsetTop > iScrollTop + iHeight || iOffsetTop < iScrollTop) {
			iNewScrollTop = iOffsetTop - Math.floor(iHeight * 0.5);
			iNewScrollTop = Math.max(iNewScrollTop, 0);
		}

		if (iOffsetLeft > iScrollLeft + iWidth || iOffsetLeft < iScrollLeft) {
			iNewScrollLeft = iOffsetLeft - Math.floor(iWidth * 0.5);
			iNewScrollLeft = Math.max(iNewScrollLeft, 0);
		}

		if (iNewScrollTop !== undefined || iNewScrollLeft !== undefined) {
			var mScrollPos = {};
			if (iNewScrollTop !== undefined) {
				mScrollPos.scrollTop = iNewScrollTop;
			}
			if (iNewScrollLeft !== undefined) {
				mScrollPos.scrollLeft = iNewScrollLeft;
			}
			$TreeCont.animate(mScrollPos);
		}
	};

	//***********************************************************************************
	//* REDEFINITIONS
	//***********************************************************************************

	/**
	 * Returns the regular tooltip. If empty, returns the text
	* @private
	 * @return {string} string tooltip
	 */
	TreeNode.prototype.getTooltip_AsString = function() {
		var sTooltip;
		var oTooltip = this.getTooltip();
		if (typeof oTooltip === "string" || oTooltip instanceof String ) {
			sTooltip = oTooltip;
		}

		if (!sTooltip) {
			sTooltip = this.getText();
		}
		return sTooltip;
	};


	return TreeNode;

}, /* bExport= */ true);
