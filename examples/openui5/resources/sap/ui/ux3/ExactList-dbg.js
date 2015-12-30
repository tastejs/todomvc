/*!
 * UI development toolkit for HTML5 (OpenUI5)
 * (c) Copyright 2009-2015 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */

// Provides control sap.ui.ux3.ExactList.
sap.ui.define(['jquery.sap.global', 'sap/ui/commons/ListBox', 'sap/ui/core/Control', 'sap/ui/core/Popup', 'sap/ui/core/theming/Parameters', './library', 'jquery.sap.dom'],
	function(jQuery, ListBox, Control, Popup, Parameters, library/* , jQuerySap */) {
	"use strict";


	
	/**
	 * Constructor for a new ExactList.
	 *
	 * @param {string} [sId] id for the new control, generated automatically if no id is given 
	 * @param {object} [mSettings] initial settings for the new control
	 *
	 * @class
	 * Internal sub-control of the ExactBrowser. The control is not intended to be used stand alone. For this purpose, the ExactBrowser control can be used.
	 * @extends sap.ui.core.Control
	 *
	 * @author SAP SE
	 * @version 1.32.9
	 *
	 * @constructor
	 * @public
	 * @alias sap.ui.ux3.ExactList
	 * @ui5-metamodel This control/element also will be described in the UI5 (legacy) designtime metamodel
	 */
	var ExactList = Control.extend("sap.ui.ux3.ExactList", /** @lends sap.ui.ux3.ExactList.prototype */ { metadata : {
	
		library : "sap.ui.ux3",
		properties : {
	
			/**
			 * Defines whether the close icon shall be displayed in the header.
			 */
			showClose : {type : "boolean", group : "Misc", defaultValue : false},
	
			/**
			 * The title of this list is the top of the list hierarchy.
			 */
			topTitle : {type : "string", group : "Misc", defaultValue : null},
	
			/**
			 * The height in px if this list is the top of the list hierarchy.
			 */
			topHeight : {type : "int", group : "Appearance", defaultValue : 290}
		},
		aggregations : {
	
			/**
			 * The sub-ExactLists of this list. This aggregation must not be maintained from outside.
			 * The control automatically takes care to fill this aggregation according to the given ExactAttribute.
			 */
			subLists : {type : "sap.ui.ux3.ExactList", multiple : true, singularName : "subList"}, 
	
			/**
			 * Hidden aggregation for internal Listbox
			 */
			controls : {type : "sap.ui.commons.ListBox", multiple : true, singularName : "control", visibility : "hidden"}
		},
		associations : {
	
			/**
			 * The associated ExactAttribute
			 */
			data : {type : "sap.ui.ux3.ExactAttribute", multiple : false}
		},
		events : {
	
			/**
			 * Event which is fired when an attribute is selected/unselected
			 */
			attributeSelected : {
				parameters : {
	
					/**
					 * The attribute which was selected/unselected recently
					 */
					attribute : {type : "sap.ui.ux3.ExactAttribute"}, 
	
					/**
					 * Array of all ExactAttributes
					 */
					allAttributes : {type : "object"}
				}
			}
		}
	}});
	
	
	/**
	 * Constructor for a new ExactList.
	 *
	 * @param {string} [sId] id for the new control, generated automatically if no id is given 
	 * @param {object} [mSettings] initial settings for the new control
	 *
	 * @class
	 * Internal sub-control of the ExactBrowser. The control is not intended to be used stand alone. For this purpose, the ExactBrowser control can be used.
	 * @extends sap.ui.core.Control
	 *
	 * @author SAP SE 
	 * @version 1.15.1-SNAPSHOT
	 *
	 * @constructor   
	 * @private
	 * @name sap.ui.ux3.ExactList
	 */
	
	(function() {
	
	
	//Private extension of the ListBox control
	ListBox.extend("sap.ui.ux3.ExactList.LB", {
		init : function() {
			ListBox.prototype.init.apply(this, arguments);
			this.setAllowMultiSelect(true);
			this.setDisplayIcons(true);
			this.addStyleClass("sapUiUx3ExactLstLb");
		},
		
		invalidate : function() {
			ListBox.prototype.invalidate.apply(this, arguments);
			if (!this.bInvalidated && this.getParent()) {
				this.getParent().invalidate();
			}
			this.bInvalidated = true;
		},
		
		_handleUserActivation : function(oEvent) {
			oEvent.metaKey = true;
			ListBox.prototype._handleUserActivation.apply(this, [oEvent]);
		},
		
		onclick : function(oEvent) {
			ListBox.prototype.onclick.apply(this, arguments);
			this.getParent().onclick(oEvent);
		},
		
		onAfterRendering : function() {
			ListBox.prototype.onAfterRendering.apply(this, arguments);
			this.bInvalidated = false;
			var oParent = this.getParent();
			
			var items = this.getItems();
			var bIsTop = oParent._isTop();
			var bHasChildren = false;
			for (var i = 0; i < items.length; i++) {
				var oItem = items[i];
				var oExactAttr = sap.ui.getCore().byId(oItem.getKey());
				var jItem = oItem.$();
				bHasChildren = false;
				if (bIsTop || (!oExactAttr || !oExactAttr.getShowSubAttributesIndicator_Computed())) {
					jItem.addClass("sapUiUx3ExactLstNoIco");
					bHasChildren = bIsTop;
				} else {
					bHasChildren = true;
				}
				
				if (bHasChildren && !bIsTop) {
					jItem.attr("aria-label", oParent._rb.getText(
							jItem.hasClass("sapUiLbxISel") ? "EXACT_LST_LIST_ITEM_SEL_ARIA_LABEL" : "EXACT_LST_LIST_ITEM_ARIA_LABEL", [oItem.getText()]
					));
				}
			}
	
			var sPos = oParent._bRTL ? "left" : "right";
			jQuery(".sapUiLbxITxt", this.getDomRef()).css("margin-" + sPos, 20 + jQuery.sap.scrollbarSize().width + "px");
			jQuery(".sapUiLbxIIco", this.getDomRef()).css(sPos, 5 + jQuery.sap.scrollbarSize().width + "px");
	
			jQuery(this.getDomRef()).attr("tabindex", "-1");
	
			var sListLabel;
			if (bIsTop) {
				sListLabel = oParent.getTopTitle();
			} else {
				sListLabel = oParent._rb.getText("EXACT_LST_LIST_ARIA_LABEL", [oParent._iLevel, oParent._getAtt().getText()]);
			}
			jQuery(this.getFocusDomRef()).attr("aria-label", sListLabel).attr("aria-expanded", "true");
	
			this.oItemNavigation.iActiveTabIndex = -1; //Do not set the tabindex to 0 on the focused list item
			this.oItemNavigation.setSelectedIndex( -1); //Reset the selected index always -> focus is set by the item navigation on the last focused item
			
			//The item navigation should not handle the arrow left and right keys
			this.oItemNavigation.onsapnext = function(oEvent) {
				if (oEvent.keyCode != jQuery.sap.KeyCodes.ARROW_DOWN) {
					return;
				}
				sap.ui.core.delegate.ItemNavigation.prototype.onsapnext.apply(this, arguments);
			};
			this.oItemNavigation.onsapprevious = function(oEvent) {
				if (oEvent.keyCode != jQuery.sap.KeyCodes.ARROW_UP) {
					return;
				}
				sap.ui.core.delegate.ItemNavigation.prototype.onsapprevious.apply(this, arguments);
			};
		},
	
		renderer: "sap.ui.commons.ListBoxRenderer"
	});
	
	
	
	/**
	 * Does the setup when the control is created.
	 * @private
	 */
	ExactList.prototype.init = function(){
		var that = this;
		
		this._iLevel = 0;
	
		this._bCollapsed = false; //Indicates whether the control is horizontally collapsed
		this._bIsFirstRendering = true; //Set to false when the first rendering was done (used to animate the first opening)
	
		this._rb = sap.ui.getCore().getLibraryResourceBundle("sap.ui.ux3");
	
		//Create the used ListBox control
		this._lb = new ExactList.LB(this.getId() + "-lb", {
			select: function(oEvent){
				setHeaderText(that);
				var sKey = oEvent.getParameter("selectedItem").getKey();
				var oAttr = sap.ui.getCore().byId(sKey);
				var iSelectedIndex = oEvent.getParameter("selectedIndex");
				if (that._lb.isIndexSelected(iSelectedIndex)) {
					//select
					oAttr.setProperty("selected", true, true);
					var oSubList = createExactListForAttribute(that, oAttr);
					if (oSubList) {
						var idx = getIndexForNewSubList(that, oAttr);
						if (idx < 0) {
							that.addSubList(oSubList);
						} else {
							that.insertSubList(oSubList, idx);
						}
					}
				} else {
					//deselect
					clearAttribute(that, oAttr, iSelectedIndex);
				}
	
				getTopList(that)._selectionChanged(oAttr);
			}
		});
		this.addAggregation("controls", this._lb);
	
		this._closeHandle = jQuery.proxy(this.onForceVerticalClose, this);
	};
	
	
	/**
	 * Does all the cleanup when the control is to be destroyed.
	 * Called from Element's destroy() method.
	 * @private
	 */
	ExactList.prototype.exit = function() {
		if (this.bIsDestroyed) {
			return;
		}
		clearChangeListener(this);
		this._lb.removeAllItems(); //remove items first before destroy the list (see getOrCreateListItem function: items are reused)
		this._lb = null; //Destroy is called when the aggregation "controls" is cleaned up
		this._closeHandle = null;
		this._scrollCheckHandle = null;
		this._rb = {getText: function(){return "";}};
		this._oTopList = null;
		if (this._dirtyListsCleanupTimer) {
			jQuery.sap.clearDelayedCall(this._dirtyListsCleanupTimer);
			this._dirtyListsCleanupTimer = null;
			this._dirtyLists = null;
		}
	};
	
	
	/**
	 * @see sap.ui.core.Element.prototype.getFocusDomRef
	 * @private
	 */
	ExactList.prototype.getFocusDomRef = function() {
		if (this._isTop() && this.$().hasClass("sapUiUx3ExactLstTopHidden")) {
			return this.getDomRef("foc");
		}
		return this._bCollapsed ? this.getDomRef("head") : this._lb.getFocusDomRef();
	};
	
	
	/**
	 * Called before the re-rendering is started.
	 * @private
	 */
	ExactList.prototype.onBeforeRendering = function() {
		this._oTopList = null;
		if (!this._bIsFirstRendering) {
			return;
		}
		
		this._bRTL = sap.ui.getCore().getConfiguration().getRTL();
		
		//Init the open animation (like expand, no Open Animation when the control is the top list)
		if (!this._isTop()) {
			this._bCollapsed = true;
			
			//see also function collapseHorizontally
			this._oCollapseStyles = {
				"cntnt": "margin-" + (this._bRTL ? "right" : "left") + ":" + Parameters.get("sapUiUx3ExactLstCollapseWidth") + ";border-top-width:0px;",
				"lst": "width:0px;"
			};
		} else {
			this._bIsFirstRendering = false;
		}
	};
	
	
	/**
	 * Called when the rendering is complete.
	 * @private
	 */
	ExactList.prototype.onAfterRendering = function() {
		var that = this;
		var bIsTop = this._isTop();
	
		if (!this._iCurrentWidth) {
			this._iCurrentWidth = this._getAtt().getWidth();
		}
	
		if (bIsTop) {
			//Register listener on content overflow for scrollbar
			this._iScrollWidthDiff = -1;
			this.onCheckScrollbar();
			this.$("lst").css("bottom", jQuery.sap.scrollbarSize().height + "px");
			
			this.$("cntnt").bind("scroll", function(oEvent){
				if (oEvent.target.id === that.getId() + "-cntnt" && oEvent.target.scrollTop != 0) {
					oEvent.target.scrollTop = 0;
				}
			});
		}
		
		
	
		if (!this._bCollapsed) {
			setWidth(this, this._iCurrentWidth);
		}
	
		//Init the header text
		setHeaderText(this);
	
		if (this._bIsFirstRendering) {
			//Open Animation
			this._bIsFirstRendering = false;
			collapseHorizontally(this, false, null, true);
		} else {
			//Adapt the scrolling behavior and show the vertical list expander if necessary
			refreshScrollBehaviour(this);
			
			//Refresh the header text width in case the list is collapsed
			refreshCollapseHeaderTextWidth(this);
		}
		
		if (this._bRefreshList) {
			this._bRefreshList = false;
			setTimeout(function(){
				that._lb.invalidate();
			}, 0);
		}
	};
	
	
	//********* EVENTING *********
	
	
	/**
	 * Called when the control gets the focus.
	 * @private
	 */
	ExactList.prototype.onfocusin = function(oEvent) {
		if (oEvent.target === this.getDomRef()) {
			this.getFocusDomRef().focus();
		}
		var $head = this.$("head");
		if (this._isTop()) {
			$head.attr("tabindex", "-1");
			this.$("foc").attr("tabindex", "-1");
			if (!isTopHeaderFocusable(this) && oEvent.target === $head[0]) {
				this.getFocusDomRef().focus();
			}
			
			if (this.$().hasClass("sapUiUx3ExactLstTopHidden") && oEvent.target === this.getDomRef("foc")) {
				var aLists = this.getSubLists();
				if (aLists.length > 0) {
					aLists[0].getFocusDomRef().focus();
				}
			}
		}
		if (!oEvent.__exactHandled) {
			$head.addClass("sapUiUx3ExactLstHeadFocus");
			oEvent.__exactHandled = true;
		}
	};
	
	
	/**
	 * Called when the control loses the focus.
	 * @private
	 */
	ExactList.prototype.onfocusout = function(oEvent) {
		var $head = this.$("head");
		if (this._isTop()) {
			$head.attr("tabindex", "0");
			this.$("foc").attr("tabindex", "0");
		}
		$head.removeClass("sapUiUx3ExactLstHeadFocus");
	};
	
	
	/**
	 * Called when the control is clicked.
	 * @private
	 */
	ExactList.prototype.onclick = function(oEvent) {
		var s = this._lb.getScrollTop();
		if (jQuery(oEvent.target).attr("id") == this.getId() + "-exp") {
			//Toggle the vertically Collapse state
			toggleVerticalCollapseState(this);
			this.focus();
			// If the list is expanded, stop the event from bulling up the lists and focus the main
			// list which might be outside the scrolling area.
			oEvent.stopPropagation();
		} else if (jQuery(oEvent.target).attr("id") == this.getId() + "-close") {
			//Close this list
			close(this);
		} else if (jQuery(oEvent.target).attr("id") == this.getId() + "-hide") {
			//Toggle the horizontally Collapse state
			collapseHorizontally(this, !this._bCollapsed, oEvent);
		} else if (this._isTop() && isTopHeaderFocusable(this) && jQuery.sap.containsOrEquals(this.$("head")[0], oEvent.target)) {
			fireHeaderPress(this, oEvent, false);
			return;
		} else if (!jQuery.sap.containsOrEquals(this.$("cntnt")[0], oEvent.target)) {
			this.focus();
		}
		this._lb.setScrollTop(s);
	};
	
	
	/**
	 * Called when a key is pressed.
	 * @private
	 */
	ExactList.prototype.onkeydown = function(oEvent) {
		function _handleKeyEvent(oEvent, oTargetDomRef){
			if (jQuery(oTargetDomRef).hasClass("sapUiUx3ExactLstFoc")) {
				return;
			}
			
			if (oTargetDomRef) {
				oTargetDomRef.focus();
			}
			oEvent.preventDefault();
			oEvent.stopPropagation();
		}
		
		switch (oEvent.keyCode) {
			case jQuery.sap.KeyCodes.ENTER:
			case jQuery.sap.KeyCodes.SPACE:
				if (this._isTop() && isTopHeaderFocusable(this) && jQuery.sap.containsOrEquals(this.$("head")[0], oEvent.target)) {
					fireHeaderPress(this, oEvent, true);
				}
				break;
		
			case jQuery.sap.KeyCodes.DELETE:
				//If close functionality is active -> Close the control and deselect the corresponding attribute
				if (!this._isTop() && this.getShowClose()) {
					close(this);
					_handleKeyEvent(oEvent, this.getParent().getFocusDomRef());
				}
				break;
	
			case jQuery.sap.KeyCodes.NUMPAD_MINUS:
				/* if (!!(oEvent.metaKey || oEvent.ctrlKey)) { //NUMPAD_MINUS + CTRL: Collapse list vertically
					//Deactivated on request of UX
					var jListContRef = this.$("lst");
					if(jListContRef.hasClass("sapUiUx3ExactLstExpanded") && this.$("exp").is(":visible")){
						toggleVerticalCollapseState(this);
					}
					oEvent.preventDefault();
					oEvent.stopPropagation();
				} else */ if (oEvent.shiftKey) { //NUMPAD_MINUS + SHIFT: Make width smaller
					if (!this._bCollapsed) {
						setWidth(this, this._iCurrentWidth - 10);
						_handleKeyEvent(oEvent);
					}
				} else if (!this._bCollapsed) { //NUMPAD_MINUS: Collapse list horizontally
					collapseHorizontally(this, true, oEvent);
				}
				break;
	
			case jQuery.sap.KeyCodes.NUMPAD_PLUS:
				/* if (!!(oEvent.metaKey || oEvent.ctrlKey)) { //NUMPAD_PLUS + CTRL: Expand list vertically
					//Deactivated on request of UX
					var jListContRef = this.$("lst");
					if(!jListContRef.hasClass("sapUiUx3ExactLstExpanded") && this.$("exp").is(":visible")){
						toggleVerticalCollapseState(this);
					}
					oEvent.preventDefault();
					oEvent.stopPropagation();
				} else */ 
				if (oEvent.shiftKey) { //NUMPAD_PLUS + SHIFT: Make width larger
					if (!this._bCollapsed) {
						setWidth(this, this._iCurrentWidth + 10);
						_handleKeyEvent(oEvent);
					}
				} else if (this._bCollapsed) { //NUMPAD_PLUS: Expand list horizontally
					collapseHorizontally(this, false, oEvent);
				}
				break;
	
			case jQuery.sap.KeyCodes.TAB:
				//Handle Tabbing
				if (this._iLevel == 0) {
					var bHeaderFocusable = isTopHeaderFocusable(this);
					if (!oEvent.shiftKey && bHeaderFocusable && jQuery.sap.containsOrEquals(this.$("head")[0], oEvent.target)) {
						_handleKeyEvent(oEvent, this.getFocusDomRef());
					} else if (jQuery.sap.containsOrEquals(this.getFocusDomRef(), oEvent.target)) {
						if (oEvent.shiftKey && bHeaderFocusable) {
							_handleKeyEvent(oEvent, this.$("head")[0]);
						} else if (!oEvent.shiftKey) {
							var oSubList = getSuccessorList(this);
							if (oSubList) {
								_handleKeyEvent(oEvent, oSubList.getFocusDomRef());
							}
						}
					}
					return;
				}
				
				if (this._iLevel == 1) {
					var oSubList = null;
					if (oEvent.shiftKey) {
						if (jQuery.sap.containsOrEquals(this.$("cntnt")[0], oEvent.target)) {
							oSubList = this;
						} else {
							oSubList = getPredecessorList(this);
						}
					} else {
						oSubList = getSuccessorList(this);
					}
					if (oSubList) {
						_handleKeyEvent(oEvent, oSubList.getFocusDomRef());
					}
					oEvent.stopPropagation();
				}
				break;
				
			case jQuery.sap.KeyCodes.ARROW_LEFT:
			case jQuery.sap.KeyCodes.ARROW_RIGHT:
				var oSubList = null;
				if (this._iLevel >= 1) {
					if ((this._bRTL && oEvent.keyCode === jQuery.sap.KeyCodes.ARROW_LEFT)
							|| (!this._bRTL && oEvent.keyCode === jQuery.sap.KeyCodes.ARROW_RIGHT)) {
						oSubList = getSuccessorList(this, true);
					} else {
						oSubList = getPredecessorList(this, true);
					}
					if (oSubList) {
						_handleKeyEvent(oEvent, oSubList.getFocusDomRef());
					}
					oEvent.stopPropagation();
				}
				break;
		}
	};
	
	
	/**
	 * Called when mousedown event appears. -> Starting point for the resizing
	 * @private
	 */
	ExactList.prototype.onmousedown = function(oEvent) {
		if (oEvent.target.id === this.getId() + "-rsz") {
			jQuery(document.body).append(
					"<div id=\"" + this.getId() + "-ghost\" class=\"sapUiUx3ExactLstRSzGhost\" style =\" z-index:" + Popup.getNextZIndex() + "\" ></div>");
	
			// Fix for IE text selection while dragging
			jQuery(document.body).bind("selectstart." + this.getId(), onStartSelect);
	
			var jHandle = !!sap.ui.Device.browser.internet_explorer ? jQuery(document.body) : this.$("ghost");
			jHandle.bind("mouseup." + this.getId(), jQuery.proxy(onRelease, this)).bind("mousemove." + this.getId(), jQuery.proxy(onMove, this));
				
			this._iStartDragX = oEvent.pageX;
			this._iStartWidth  = this.$("lst").width();
	
			this.$("rsz").addClass("sapUiUx3ExactLstRSzDrag");
		}
	};
	
	
	/**
	 * Called when the vertically Collapse State should be closed immediately (e.g. outer event)
	 * @private
	 */
	ExactList.prototype.onForceVerticalClose = function(oEvent) {
		if (oEvent.type == "mousedown" ||
				oEvent.type == "click" ||
				oEvent.type == "dblclick" ||
				oEvent.type == "focusin" ||
				oEvent.type == "focusout" ||
				oEvent.type == "keydown" ||
				oEvent.type == "keypress" ||
				oEvent.type == "keyup" ||
				oEvent.type == "mousedown" ||
				oEvent.type == "mouseup") {
			var jRef = this.$("lst");
			if (!jQuery.sap.containsOrEquals(jRef[0], oEvent.target) || oEvent.target.tagName == "BODY") {
				if (jRef.hasClass("sapUiUx3ExactLstExpanded")) {
					this._oPopup.close(true);
				}
			}
		}
	};
	
	
	/**
	 * Called periodicly to check whether the content scrollbar must be show or hidden
	 * @private
	 */
	ExactList.prototype.onCheckScrollbar = function(oEvent) {
		this._scrollCheckTimer = null;
	
		var jContentArea = this.$("cntnt");
		var oContentArea = jContentArea[0];
		if (oContentArea) {
			var iNewDiff = oContentArea.scrollWidth - oContentArea.clientWidth;
			if (this._iScrollWidthDiff != iNewDiff) {
				this._iScrollWidthDiff = iNewDiff;
				if (iNewDiff <= 0) {
					//hidden scrollbar
					jContentArea.css({"overflow-x": "hidden", "bottom": jQuery.sap.scrollbarSize().height + "px"});
				} else {
					//visible scrollbar
					jContentArea.css({"overflow-x": "scroll", "bottom": "0px"});
				}
			}
			this._scrollCheckTimer = jQuery.sap.delayedCall(300, this, this.onCheckScrollbar);
		}
	};
	
	
	//********* OVERRIDDEN API FUNCTIONS *********
	
	
	ExactList.prototype.insertSubList = function(oSubList, iIndex) {
		this.insertAggregation("subLists", oSubList, iIndex);
		if (oSubList) {
			setLevel(oSubList, this._iLevel + 1);
		}
		return this;
	};
	
	
	ExactList.prototype.addSubList = function(oSubList) {
		this.addAggregation("subLists", oSubList);
		if (oSubList) {
			setLevel(oSubList, this._iLevel + 1);
		}
		return this;
	};
	
	
	ExactList.prototype.setData = function(vData) {
		if (vData != null && typeof (vData) != "string") {
			vData = vData.getId();
		}
	
		if (vData) {
			//Set the associated ExactAttribute
			this.setAssociation("data", vData);
			vData = this._getAtt();
			this._lb.removeAllItems();
			if (!vData) {
				return this;
			}
			var aAtts = vData.getAttributesInternal(true);
			var aSelectedKeys = [];
			var aLists = [];
			//Update the used ListBox accordingly and create child exact lists
			for (var i = 0; i < aAtts.length; i++) {
				var oItem = getOrCreateListItem(aAtts[i]);
				this._lb.addItem(oItem);
				if (aAtts[i].getSelected()) {
					var oList = createExactListForAttribute(this, aAtts[i]);
					if (oList) {
						aLists.push(oList);
					}
					aSelectedKeys.push(oItem.getKey());
				}
			}
			this._lb.setSelectedKeys(aSelectedKeys);
	
			//Update child lists
			var aOldChildren = this.getSubLists();
			for (var i = 0; i < aOldChildren.length; i++) {
				var idx = jQuery.inArray(aOldChildren[i], aLists);
				if (idx >= 0) {
					if (vData.getListOrder() != sap.ui.ux3.ExactOrder.Fixed /*Select*/) {
						//List is already a sublist -> remove it from the array of lists to add
						aLists.splice(idx, 1);
					}
				} else {
					//List does not exist anymore in the array of lists to add -> destroy it (also removes it from the aggregation)
					aOldChildren[i]._lb.removeAllItems();  //remove items first before destroy the list (see function getOrCreateListItem: items are reused)
					aOldChildren[i].destroy();
				}
			}
			
			if (vData.getListOrder() === sap.ui.ux3.ExactOrder.Fixed) {
				this.removeAllSubLists();
			}
			
			//Append all newly created lists
			for (var i = 0; i < aLists.length; i++) {
				this.addSubList(aLists[i]);
			}
	
			//Set the change listener to the exact attribute
			var that = this;
			vData.setChangeListener({id: that.getId(), _notifyOnChange: function(sType, oAttribute){
				if (sType === "width") {
					if (that._getAtt() === oAttribute && that.getDomRef()) {
						setWidth(that, oAttribute.getWidth());
					}
					return;
				}
				
				var oTopList = getTopList(that);
				if (!oTopList._dirtyLists) {
					oTopList._dirtyLists = {};
				}
				if (!oTopList._dirtyLists[that.getId()]) {
					oTopList._dirtyLists[that.getId()] = that;
				}
				
				if (!oTopList._dirtyListsCleanupTimer) {
					oTopList._dirtyListsCleanupTimer = jQuery.sap.delayedCall(0, oTopList, function(){
						this._dirtyListsCleanupTimer = null;
						jQuery.each(this._dirtyLists, function(i, oList){
							if (oList._lb && oList.getParent()) { //List was not destroyed in the meantime and is still active
								if (!oList._isTop()) {
									oList.getParent().setData(oList.getParent().getData());
								} else {
									oList.setData(oList.getData());
								}
							}
						});
						this._dirtyLists = null;
					}, []);
				}
			}});
		}
	
		return this;
	};
	
	
	ExactList.prototype.setShowClose = function(bShowClose) {
		if (this._isTop()) {
			this.setProperty("showClose", bShowClose);
		}
		return this;
	};
	
	
	ExactList.prototype.getShowClose = function() {
		return getTopList(this).getProperty("showClose");
	};
	
	
	ExactList.prototype.getTopTitle = function() {
		var sTitle = this.getProperty("topTitle");
		return sTitle ? sTitle : this._rb.getText("EXACT_BRWSR_LST_TITLE");
	};
	
	
	//********* GLOBAL HELPERS *********
	
	/**
	 * Returns the associated ExactAttribute.
	 * @private
	 */
	ExactList.prototype._getAtt = function() {
		return sap.ui.getCore().byId(this.getData());
	};
	
	
	/**
	 * Returns <code>true</code>, when this control is the top most in the hierarchy, <code>false</code> otherwise.
	 * @private
	 */
	ExactList.prototype._isTop = function() {
		return !(this.getParent() instanceof ExactList);
	};
	
	
	/**
	 * Handles selections of the whole list tree and fires selection change event.
	 * @private
	 */
	ExactList.prototype._selectionChanged = function(oAttribute) {
		if (!this._isTop()) {
			return;
		}
	
		// In case of TwoWay databinding the attribute might have already changed by now. Make sure
		// We use the correct one.
		// This happened for example when the selected property was bound in the same model as
		// the data for the lists
		oAttribute = sap.ui.getCore().byId(oAttribute.getId());
		
		
		//Computes recursivly all selected attributes and adds them to the given result list
		var _computeSelectedAttributes = function(oAtt, aResult){
			if (!oAtt.getSelected()) {
				return;
			}
			aResult.push(oAtt);
			var aValues = oAtt.getAttributesInternal();
			for (var idx = 0; idx < aValues.length; idx++) {
				_computeSelectedAttributes(aValues[idx], aResult);
			}
		};
	
		var aSelectedAttributes = [];
		var aTopValues = this._getAtt().getAttributesInternal();
		for (var idx = 0; idx < aTopValues.length; idx++) {
			_computeSelectedAttributes(aTopValues[idx], aSelectedAttributes);
		}
	
		
		this.fireAttributeSelected({attribute: oAttribute, allAttributes: aSelectedAttributes});
	};
	
	
	/**
	 * Closes all open sub lists and clears the selection if this list is the top list.
	 *
	 * @private
	 */
	ExactList.prototype._closeAll = function() {
		if (!this._isTop()) {
			return;
		}
	
		var that = this;
	
		var fCallback = function(){
			that._getAtt()._clearSelection();
			that._lb.clearSelection();
			that.fireAttributeSelected({attribute: undefined, allAttributes: []});
		};
	
		var aLists = this.getSubLists();
	
		if (aLists.length > 0) {
			for (var i = 0; i < aLists.length; i++) {
				close(aLists[i], true, i == aLists.length - 1 ? fCallback : null);
			}
		} else {
			fCallback();
		}
	};
	
	
	//********* LOCAL HELPERS *********
	
	//Returns the predecessor of the given list based on the level and whether TAB or the arrow keys are used
	var getPredecessorList = function(oList, bArrow){
		function getPrevOnSameLevel(oLst){
			var oParentRef = oLst.getParent();
			var aParentSubLists = oParentRef.getSubLists();
			var idx = oParentRef.indexOfSubList(oLst) - 1;
			if (idx >= 0) {
				return aParentSubLists[idx];
			}
			return null;
		}
		
		function getListOrLastChild(oLst){
			var aSubLists = oLst.getSubLists();
			if (aSubLists.length > 0) {
				return getListOrLastChild(aSubLists[aSubLists.length - 1]);
			}
			return oLst;
		}
		
		if (oList._iLevel == 0) {
			return null;
		} else if (oList._iLevel == 1) {
			if (bArrow) {
				return null;
			}
			var oPrevList = getPrevOnSameLevel(oList);
			if (oPrevList) {
				return oPrevList;
			}
			return oList.getParent();
		} else if (oList._iLevel > 1) {
			var oPrevList = getPrevOnSameLevel(oList);
			if (oPrevList) {
				return getListOrLastChild(oPrevList);
			}
			var oParent = oList.getParent();
			if (oParent._iLevel >= 1) {
				return oParent;
			}
		}
		return null;
	};
	
	//Returns the successor of the given list based on the level and whether TAB or the arrow keys are used
	var getSuccessorList = function(oList, bArrow){
		function getNextOnSameLevel(oLst){
			var oParent = oLst.getParent();
			var aParentSubLists = oParent.getSubLists();
			var idx = oParent.indexOfSubList(oLst) + 1;
			if (idx < aParentSubLists.length) {
				return aParentSubLists[idx];
			}
			return null;
		}
		
		function getFirstChild(oLst){
			var aSubLists = oLst.getSubLists();
			if (aSubLists.length > 0) {
				return aSubLists[0];
			}
			return null;
		}
		
		function getNext(oLst){
			var oNextListRef = getNextOnSameLevel(oLst);
			if (oNextListRef) {
				return oNextListRef;
			}
			var oParent = oLst.getParent();
			if (oParent._iLevel > (bArrow ? 1 : 0)) {
				return getNext(oParent);
			} else {
				return null;
			}
		}
		
		if (oList._iLevel == 0) {
			return getFirstChild(oList);
		} else if (oList._iLevel == 1) {
			return bArrow ? getFirstChild(oList) : getNextOnSameLevel(oList);
		} else if (oList._iLevel > 1) {
			var oNextList = getFirstChild(oList);
			if (oNextList) {
				return oNextList;
			}
			
			return getNext(oList);
		}
		return null;
	};
	
	var fireHeaderPress = function(oList, oEvent, bKeyboard){
		oList.fireEvent("_headerPress", {
			kexboard: bKeyboard,
			domRef: oList.$("head")
		});
		oEvent.stopPropagation();
	};
	
	var isTopHeaderFocusable = function(oList){
		return !isTopHidden(oList) && oList.$().hasClass("sapUiUx3ExactLstTopActive");
	};
	
	var isTopHidden = function(oList){
		return oList.$().hasClass("sapUiUx3ExactLstTopHidden");
	};
	
	//Returns the index in the sublists of the given list for a new list of the given attribute
	var getIndexForNewSubList = function(oList, oAttr){
		if (oList._getAtt().getListOrder() != sap.ui.ux3.ExactOrder.Fixed /*Select*/) {
			return -1;
		}
		
		var aAttributes = oList._getAtt().getAttributes();
		var idx = 0;
		for (var i = 0; i < aAttributes.length; i++) {
			if (aAttributes[i] === oAttr) {
				break;
			}
			if (aAttributes[i].getChangeListener()) {
				idx++;
			}
		}
		return idx;
	};
	
	var refreshScrollBehaviour = function(oList){
		if (adaptScollBehavior(oList)) {
			oList.$("lst").addClass("sapUiUx3ExactLstLstExp");
	
			if (!oList._oPopup) {
				var fPopupEventHandle = function(oEvent){
					oList._handleEvent(oEvent);
				};
	
				oList._oPopup = new Popup();
	
				if (!sap.ui.Device.browser.firefox) {
					oList._oPopup._fixPositioning = function(oPosition, bRtl) {
						Popup.prototype._fixPositioning.apply(this, arguments);
						if (bRtl) {
							var $Ref = this._$();
							var $Of = jQuery(oPosition.of);
							var iOffset = 0;
							if (oPosition.offset) {
								iOffset = parseInt(oPosition.offset.split(" ")[0], 10);
							}
							$Ref.css("right", (jQuery(window).width() - $Of.outerWidth() - $Of.offset().left + iOffset) + "px");
						}
					};
				}
	
				oList._oPopup.open = function(){
					var jListContRef = oList.$("lst");
					animate(jListContRef, false, -1, function(jRef){
						//Switch the expand icon
						jListContRef.addClass("sapUiUx3ExactLstExpanded");
						oList.$("exp").html(sap.ui.ux3.ExactListRenderer.getExpanderSymbol(true, false));
						//Remember the current height for closing later and set the height explicitly
						oList.__sOldHeight = jListContRef.css("height");
						jListContRef.css("height", oList.__sOldHeight);
						var jListHeader = oList.$("head");
						//Calculate the target height
						var jListRef = jQuery(oList._lb.getDomRef());
						var iListHeight = jListRef[0].scrollHeight + oList.$("exp").height() + jListRef.outerHeight() - jListRef.height() + 1;
						var iMaxListHeight = jQuery(window).height() - parseInt(jListRef.offset().top, 10) + jQuery(window).scrollTop() - jListHeader.outerHeight();
						var iTargetHeight = Math.min(iListHeight, iMaxListHeight);
						//Set the list as popup content and open the popup
						oList._oPopup.setContent(jListContRef[0]);
						var sOffset = Parameters.get()["sapUiUx3ExactLst" + (oList._isTop() ? "Root" : "") + "ExpandOffset"] || "0 0";
						Popup.prototype.open.apply(oList._oPopup,
								[0, Popup.Dock.BeginTop, Popup.Dock.BeginBottom, jListHeader[0], sOffset, "none none"]);
						oList._bPopupOpened = true;
						return iTargetHeight;
					}, function(jRef){
						//Update BlindLayer of popup
						jListContRef.addClass("sapUiUx3ExactLstExpandedBL");
						oList._oPopup._updateBlindLayer();
						//Adapt the scroll behavior and set the focus
						adaptScollBehavior(oList);
						oList.getFocusDomRef().focus();
						//Bind the event handlers for closing and control events
						jQuery.sap.bindAnyEvent(oList._closeHandle);
						jRef.bind(jQuery.sap.ControlEvents.join(" "), fPopupEventHandle);
					});
				};
				oList._oPopup.close = function(bSkipFocus){
					var jListContRef = oList.$("lst");
					jListContRef.removeClass("sapUiUx3ExactLstExpandedBL");
					animate(jListContRef, false, oList.__sOldHeight, function(jRef){
						//Unbind the event handlers for closing and control events
						jQuery.sap.unbindAnyEvent(oList._closeHandle);
						jRef.unbind(jQuery.sap.ControlEvents.join(" "), fPopupEventHandle);
						//Switch the expand icon
						jListContRef.removeClass("sapUiUx3ExactLstExpanded");
						oList.$("exp").html(sap.ui.ux3.ExactListRenderer.getExpanderSymbol(false, false));
					}, function(jRef){
						//Move the list to its original position
						jRef.detach();
						jListContRef.removeClass("sapUiShd");
						jRef.attr("style", "width:" + oList._iCurrentWidth + "px;");
						jQuery(oList.getDomRef()).prepend(jRef);
						//Cleanup and close the popup
						oList._oPopup.setContent(null);
						oList._bPopupOpened = undefined;
						oList.__sOldHeight = null;
						if (oList._isTop()) {
							jRef.css("bottom", jQuery.sap.scrollbarSize().height + "px");
						}
						adaptScollBehavior(oList);
						Popup.prototype.close.apply(oList._oPopup, [0]);
						if (!bSkipFocus) {
							oList.getFocusDomRef().focus();
						}
					});
				};
			}
		}
	};
	
	
	//Animates the width or height of the given jRef to the given target value
	//Optional callbacks are possible which are called before and after the animation
	var animate = function(jRef, bWidth, iValue, fDoBefore, fDoAfter){
		if (fDoBefore) {
			var iVal = fDoBefore(jRef);
			if (iVal != undefined) {
				iValue = iVal;
			}
		}
		var _fDoAfter = fDoAfter ? function(){fDoAfter(jRef);} : function(){};
		if (jQuery.fx.off) {
			if (bWidth) {
				jRef.width(iValue);
			} else {
				jRef.height(iValue);
			}
			_fDoAfter();
		} else {
			var oParam = bWidth ? {width: iValue} : {height: iValue};
			jRef.stop(true, true).animate(oParam, 200, 'linear', _fDoAfter);
		}
	};
	
	
	// Handles the StartSelect event during resizing
	// @see sap.ui.ux3.ExactList.prototype.onmousedown
	var onStartSelect = function(oEvent){
		oEvent.preventDefault();
		oEvent.stopPropagation();
		return false;
	};
	
	
	//Handles the MouseMove event during resizing
	//@see sap.ui.ux3.ExactList.prototype.onmousedown
	var onMove = function(oEvent){
		var iCurrentX = oEvent.pageX;
		var iDiff = this._bRTL ? (this._iStartDragX - iCurrentX) : (iCurrentX - this._iStartDragX);
		setWidth(this, this._iStartWidth + iDiff);
	};
	
	
	//Handles the MouseUp event during resizing
	//@see sap.ui.ux3.ExactList.prototype.onmousedown
	var onRelease = function(oEvent){
		jQuery(document.body).unbind("selectstart." + this.getId()).unbind("mouseup." + this.getId()).unbind("mousemove." + this.getId());
		this.$("ghost").remove();
		this.$("rsz").removeClass("sapUiUx3ExactLstRSzDrag");
		this._iStartWidth = undefined;
		this._iStartDragX = undefined;
		this.focus();
	};
	
	
	//Sets the width of the list to the given width (maybe the width is adapted to the allowed range (@see checkWidth))
	var setWidth = function(oList, iWidth){
		iWidth = sap.ui.ux3.ExactAttribute._checkWidth(iWidth);
		var sPos = oList._bRTL ? "right" : "left";
		oList._iCurrentWidth = iWidth;
		oList._getAtt()._setWidth(oList._iCurrentWidth);
		oList.$("lst").css("width", iWidth + "px");
		oList.$("rsz").css(sPos, (iWidth - 4) + "px");
		if (oList._isTop()) {
			if (!isTopHidden(oList)) {
				oList.$("head").css("width", iWidth + "px");
				oList.$("cntnt").css(sPos, (iWidth + 8) + "px");
				oList.$("scroll").css(sPos, (iWidth + 8) + "px");
			}
		} else {
			if (!oList.$().hasClass("sapUiUx3ExactLstCollapsed")) {
				oList.$("cntnt").css("margin-" + sPos, iWidth + "px");
			}
		}
	};
	
	
	//Refresh the header text of the list
	var setHeaderText = function(oList){
		var oAtt = oList._getAtt();
		if (oAtt && !oList._isTop()) {
			oList.$("head-txt").html(jQuery.sap.encodeHTML(oAtt.getText())
					+ "<span class=\"sapUiUx3ExactLstHeadInfo\">&nbsp;(" + oList._lb.getSelectedIndices().length + "/" + oList._lb.getItems().length + ")</span>");
		}
	};
	
	
	//Sets the level of the list and its sublists
	var setLevel = function(oList, iLevel){
		oList._iLevel = iLevel;
		var aLists = oList.getSubLists();
		for (var i = 0; i < aLists.length; i++) {
			setLevel(aLists[i], iLevel + 1);
		}
	};
	
	
	//Adapt the scrolling behavior when not all list items can be shown and return whether adaptation was done or not.
	var adaptScollBehavior = function(oList){
		if (oList._lb) {
			var jListRef = jQuery(oList._lb.getDomRef());
			oList.$("lst").removeClass("sapUiUx3ExactLstScroll");
			if (jListRef.length > 0 && jListRef.outerHeight() < jListRef[0].scrollHeight) {
				oList.$("lst").addClass("sapUiUx3ExactLstScroll");
				return true;
			}
		}
		return false;
	};
	
	
	//Collapses or expands the given list horizontally
	var collapseHorizontally = function(oList, bCollapse, oEvent, bSkipParentTraversal){
		if (oEvent) {
			oEvent.preventDefault();
			oEvent.stopPropagation();
		}
		if (oList._isTop()) {
			return;
		}
		if (oList._bCollapsed != bCollapse) {
			//Toggles the horizontal Collapse State
			var bFocus = !!oEvent;
			var cntntAnimParam = {};
			cntntAnimParam["margin-" + (oList._bRTL ? "right" : "left")] = (oList._bCollapsed ?
					(oList._iCurrentWidth + "px") : Parameters.get("sapUiUx3ExactLstCollapseWidth"));
			cntntAnimParam["border-top-width"] = (oList._bCollapsed ?
					Parameters.get("sapUiUx3ExactLstContentTop") : "0px");
			
			var $Ctnt = oList.$("cntnt");
			if (jQuery.fx.off) {
				for (var css in cntntAnimParam) {
					$Ctnt.css(css, cntntAnimParam[css]);
				}
			} else {
				$Ctnt.stop(true, true).animate(cntntAnimParam, 200, 'linear');
			}
			
			if (oList._bCollapsed) {
				//expand
				animate(oList.$("lst"), true, oList._iCurrentWidth + "px", function() {
					jQuery(oList.getDomRef()).removeClass("sapUiUx3ExactLstCollapsed");
					oList.$("head").css("overflow", "hidden");
				}, function($Ref) {
					oList.$("hide")
						.html(sap.ui.ux3.ExactListRenderer.getExpanderSymbol(true, true))
						.attr("title", oList._rb.getText("EXACT_LST_LIST_COLLAPSE"));
					if (bFocus) {
						oList.focus();
					}
					var $head = oList.$("head");
					oList.$("head-txt").removeAttr("style");
					$head.removeAttr("style");
					$Ref.removeAttr("style");
					refreshScrollBehaviour(oList);
					setWidth(oList, oList._iCurrentWidth);
					refreshCollapseHeaderTextWidth(oList);
					
					$head.removeAttr("role");
					$head.removeAttr("aria-label");
					$head.removeAttr("aria-expanded");
					
					var oAtt = oList._getAtt();
					if (oAtt && oAtt._scrollToAttributeId) {
						oAtt.scrollTo(sap.ui.getCore().byId(oAtt._scrollToAttributeId));
					}
					
				});
				
				oList._oCollapseStyles = undefined;
			} else {
				oList._oCollapseStyles = {};
				
				//collapse
				animate(oList.$("lst"), true, 0, null, function() {
					jQuery(oList.getDomRef()).addClass("sapUiUx3ExactLstCollapsed");
					oList.$("hide")
						.html(sap.ui.ux3.ExactListRenderer.getExpanderSymbol(false, true))
						.attr("title", oList._rb.getText("EXACT_LST_LIST_EXPAND"));
					if (bFocus) {
						oList.focus();
					}
					refreshCollapseHeaderTextWidth(oList);
					
					var $head = oList.$("head");
					$head.attr("role", "region");
					$head.attr("aria-label", oList._rb.getText("EXACT_LST_LIST_COLL_ARIA_LABEL", [oList._iLevel, oList._getAtt().getText()]));
					$head.attr("aria-expanded", "false");
				});
				
				//Remember the current styles for rerendering
				var aStyles = [];
				for (var css in cntntAnimParam) {
					aStyles.push(css, ":", cntntAnimParam[css], ";");
				}
				oList._oCollapseStyles["cntnt"] = aStyles.join("");
				oList._oCollapseStyles["lst"] = "width:0px;";
			}
			
			oList._bCollapsed = !oList._bCollapsed;
		}
		
		if (bSkipParentTraversal) {
			return;
		}
		var oParent = oList.getParent();
		if (!oList._isTop() && oParent && oParent._isTop && !oParent._isTop()) {
			collapseHorizontally(oParent, bCollapse);
		}
	};
	
	
	//Refreshs the header text width of all collapsed lists
	var refreshCollapseHeaderTextWidth = function(oList) {
		if (oList._bCollapsed) {
			var iWidth = oList.$("cntnt").height() - 50/*Space for Header Action Buttons - Maybe provide theme parameter in future*/;
			var $txt = oList.$("head-txt");
			$txt.css("width", iWidth + "px");
			if (jQuery("html").attr("data-sap-ui-browser") == "ie8") {
				//A text with 90px width is correct aligned when bottom:75px is set
				var iBottom = 75 - (90 - iWidth);
				$txt.css("bottom", iBottom + "px");
			}
		}
		var aSubLists = oList.getSubLists();
		for (var i = 0; i < aSubLists.length; i++) {
			refreshCollapseHeaderTextWidth(aSubLists[i]);
		}
	};
	
	
	//Toggles the vertical Collapse State
	var toggleVerticalCollapseState = function(oList){
		var jListContRef = oList.$("lst");
		if (jListContRef.hasClass("sapUiUx3ExactLstExpanded")) {
			//collapse
			oList._oPopup.close();
		} else {
			//expand
			oList._oPopup.open();
		}
	};
	
	
	//Handles the close of the list
	var close = function(oList, bSkipNotify, fCallback){
		var fFinalize = function(jRef) {
			if (!bSkipNotify) {
				var oAttr = oList._getAtt();
				var iSelectedIndex = oAttr.getParent().indexOfAttribute(oAttr);
				clearAttribute(oList.getParent(), oAttr, iSelectedIndex, true);
				setHeaderText(oList.getParent());
				getTopList(oList)._selectionChanged(oAttr);
			}
			oList.destroy();
			if (fCallback) {
				fCallback();
			}
		};
	
		var oListRef = oList.getDomRef();
		if (oListRef) {
			animate(jQuery(oListRef), true, 0, function(jRef) {
				jRef.css("overflow", "hidden");
			}, fFinalize);
		} else {
			fFinalize();
		}
	};
	
	
	//Creates a new ExactList for the given attribute if the attribute is selected and does not have a corresponding list yet.
	//If the attribute has a corresponding list already this list is returned.
	var createExactListForAttribute = function(oList, oAttribute) {
		if (oAttribute.getSelected()) {
			var aAttributes = oAttribute.getAttributesInternal(true);
			if (aAttributes.length > 0) {
				var oSubList;
				if (oAttribute.getChangeListener()) {
					oSubList = sap.ui.getCore().byId(oAttribute.getChangeListener().id);
				} else {
					oSubList = new ExactList();
				}
	
				oSubList.setData(oAttribute);
				return oSubList;
			}
		}
	
		return null;
	};
	
	
	//Sets the selection property of the given attribute and all its sub-attributes to false.
	//Additionally the given index in the lists ListBox is unselected. ExactLists which corresponds
	//to the cleared attributes are closed if bSkipNotify is not set.
	var clearAttribute = function(oList, oAttribute, iSelectedIndex, bSkipNotify){
		oList._lb.removeSelectedIndex(iSelectedIndex);
		oAttribute._clearSelection();
		if (!bSkipNotify) {
			var aSubLists = oList.getSubLists();
			for (var i = 0; i < aSubLists.length; i++) {
				if (aSubLists[i].getData() === oAttribute.getId()) {
					close(aSubLists[i], true);
				}
			}
		}
	};
	
	
	//Removes the change listener which is attached to the lists attribute.
	var clearChangeListener = function(oList) {
		var oAttr = oList._getAtt();
		if (oAttr && oAttr.getChangeListener() && oAttr.getChangeListener().id === oList.getId()) {
			oAttr.setChangeListener(null);
		}
	};
	
	
	//Returns the top most list.
	var getTopList = function(oList) {
		if (oList._isTop()) {
			return oList;
		}
		if (!oList._oTopList) {
			oList._oTopList = getTopList(oList.getParent());
		}
		return oList._oTopList;
	};
	
	
	var getOrCreateListItem = function(oAttribute){
		var oItem;
		if (oAttribute.__oItem) {
			oItem = oAttribute.__oItem;
			if (oItem.getText() != oAttribute.getText()) {
				oItem.setText(oAttribute.getText());
			}
			if (oItem.getKey() != oAttribute.getId()) {
				oItem.setKey(oAttribute.getId());
			}
		} else {
			oItem = new sap.ui.core.ListItem({text:oAttribute.getText(), key: oAttribute.getId()});
			oAttribute.exit = function() {
				if (sap.ui.ux3.ExactAttribute.prototype.exit) {
					sap.ui.ux3.ExactAttribute.prototype.exit.apply(oAttribute, []);
				}
				this.__oItem.destroy();
				this.__oItem = null;
			};
			oAttribute.__oItem = oItem;
		}
		return oItem;
	};
	
	
	}());
	
	
	//Override docu of the "internal" aggregation subLists.
	
	/**
	 * Getter for aggregation <code>subLists</code>.<br/>
	 * The sub ExactLists of this list. This aggregation must not be maintained from outside. The control automatically takes care to fill this aggregation according to the given ExactAttribute.
	 *
	 * @return {sap.ui.ux3.ExactList[]}
	 * @protected
	 */
	
	/**
	 * Inserts a subList into the aggregation named <code>subLists</code>.
	 *
	 * @param {sap.ui.ux3.ExactList}
	 *          oSubList the subList to insert; if empty, nothing is inserted
	 * @param {int}
	 *             iIndex the <code>0</code>-based index the subList should be inserted at; for
	 *             a negative value of <code>iIndex</code>, the subList is inserted at position 0; for a value
	 *             greater than the current size of the aggregation, the subList is inserted at
	 *             the last position
	 * @return {sap.ui.ux3.ExactList} <code>this</code> to allow method chaining
	 * @protected
	 */
	
	/**
	 * Adds some subList <code>oSubList</code>
	 * to the aggregation named <code>subLists</code>.
	 *
	 * @param {sap.ui.ux3.ExactList}
	 *            oSubList the subList to add; if empty, nothing is inserted
	 * @return {sap.ui.ux3.ExactList} <code>this</code> to allow method chaining
	 * @protected
	 */
	
	/**
	 * Removes an subList from the aggregation named <code>subLists</code>.
	 *
	 * @param {int | string | sap.ui.ux3.ExactList} vSubList the subList to remove or its index or id
	 * @return {sap.ui.ux3.ExactList} the removed subList or null
	 * @protected
	 */
	
	/**
	 * Removes all the controls in the aggregation named <code>subLists</code>.<br/>
	 * Additionally unregisters them from the hosting UIArea.
	 * @return {sap.ui.ux3.ExactList[]} an array of the removed elements (might be empty)
	 * @protected
	 */
	
	/**
	 * Checks for the provided <code>sap.ui.ux3.ExactList</code> in the aggregation named <code>subLists</code>
	 * and returns its index if found or -1 otherwise.
	 *
	 * @param {sap.ui.ux3.ExactList}
	 *            oSubList the subList whose index is looked for.
	 * @return {int} the index of the provided control in the aggregation if found, or -1 otherwise
	 * @protected
	 */
	
	/**
	 * Destroys all the subLists in the aggregation
	 * named <code>subLists</code>.
	 * @return {sap.ui.ux3.ExactList} <code>this</code> to allow method chaining
	 * @protected
	 */
	

	return ExactList;

}, /* bExport= */ true);
